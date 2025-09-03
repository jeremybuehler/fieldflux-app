import Stripe from 'stripe';
import { db } from '../db';
import { users, payments, subscriptionPlans, webhookEvents } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const hasStripe = !!process.env.STRIPE_SECRET_KEY;
const stripe = hasStripe ? new Stripe(process.env.STRIPE_SECRET_KEY as string) : (null as unknown as Stripe);

export class StripeService {
  /**
   * Create or retrieve a Stripe customer for a user
   */
  async getOrCreateCustomer(userId: string, email: string, name?: string): Promise<string> {
    // Check if user already has a Stripe customer ID
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (user?.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Update user with Stripe customer ID
    await db.update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, userId));

    return customer.id;
  }

  /**
   * Create a payment intent for one-time payments
   */
  async createPaymentIntent(
    userId: string,
    amount: number,
    description: string,
    metadata?: Record<string, string>
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      throw new Error('User not found');
    }

    const customerId = await this.getOrCreateCustomer(
      userId,
      user.email || '',
      `${user.firstName} ${user.lastName}`.trim()
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      description,
      metadata: {
        userId,
        ...metadata,
      },
    });

    // Log payment in database
    await db.insert(payments).values({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount: amount.toString(),
      currency: 'usd',
      status: 'pending',
      description,
      paymentType: 'one_time',
      metadata,
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }

  /**
   * Create or retrieve a subscription for a user
   */
  async getOrCreateSubscription(
    userId: string,
    priceId: string
  ): Promise<{ subscriptionId: string; clientSecret: string | null }> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has an active subscription
    if (user.stripeSubscriptionId) {
      const subscription: any = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      if (subscription.status === 'active' || subscription.status === 'trialing') {
        const invoice = subscription.latest_invoice as any as Stripe.Invoice;
        const paymentIntent = (invoice as any)?.payment_intent as Stripe.PaymentIntent;
        
        return {
          subscriptionId: subscription.id,
          clientSecret: paymentIntent?.client_secret || null,
        };
      }
    }

    const customerId = await this.getOrCreateCustomer(
      userId,
      user.email || '',
      `${user.firstName} ${user.lastName}`.trim()
    );

    // Create new subscription
    const subscription: any = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user with subscription info
    await db.update(users)
      .set({
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionCurrentPeriodEnd: new Date((subscription.current_period_end as number) * 1000),
      })
      .where(eq(users.id, userId));

    const invoice = subscription.latest_invoice as any as Stripe.Invoice;
    const paymentIntent = (invoice as any)?.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
    };
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(userId: string): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user?.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await db.update(users)
      .set({ subscriptionStatus: 'canceled' })
      .where(eq(users.id, userId));
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(userId: string, returnUrl: string): Promise<string> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user?.stripeCustomerId) {
      throw new Error('No Stripe customer found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return session.url;
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(
    body: string,
    signature: string,
    endpointSecret: string
  ): Promise<void> {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    // Check if we've already processed this event
    const [existingEvent] = await db
      .select()
      .from(webhookEvents)
      .where(eq(webhookEvents.stripeEventId, event.id));

    if (existingEvent) {
      return; // Already processed
    }

    // Log the webhook event
    await db.insert(webhookEvents).values({
      stripeEventId: event.id,
      eventType: event.type,
      processed: false,
      data: event.data,
    });

    // Process the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }

    // Mark event as processed
    await db.update(webhookEvents)
      .set({ processed: true })
      .where(eq(webhookEvents.stripeEventId, event.id));
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    await db.update(payments)
      .set({ status: 'succeeded' })
      .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    await db.update(payments)
      .set({ status: 'failed' })
      .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
  }

  private async handleSubscriptionUpdated(subscription: any): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    await db.update(users)
      .set({
        subscriptionStatus: subscription.status,
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
      .where(eq(users.id, userId));
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    await db.update(users)
      .set({
        stripeSubscriptionId: null,
        subscriptionStatus: 'canceled',
        subscriptionPlan: 'free',
        subscriptionCurrentPeriodEnd: null,
      })
      .where(eq(users.id, userId));
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    if ((invoice as any).subscription) {
      const subscriptionId = (invoice as any).subscription as string;
      const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
      await this.handleSubscriptionUpdated(subscription);
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if ((invoice as any).subscription) {
      const subscriptionId = (invoice as any).subscription as string;
      const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = subscription.metadata?.userId;
      
      if (userId) {
        await db.update(users)
          .set({ subscriptionStatus: 'past_due' })
          .where(eq(users.id, userId));
      }
    }
  }

  /**
   * Get subscription plans
   */
  async getSubscriptionPlans(): Promise<any[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  /**
   * Get user's payment history
   */
  async getUserPaymentHistory(userId: string): Promise<any[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }
}

let stripeService: any = new StripeService();

// Development fallback: provide a mock service when STRIPE_SECRET_KEY is not set
if (!hasStripe) {
  class MockStripeService {
    async getOrCreateCustomer(_userId: string, _email: string, _name?: string) {
      return 'cus_mock_dev';
    }
    async createPaymentIntent(_userId: string, _amount: number, _description: string, _metadata?: Record<string, string>) {
      return { clientSecret: 'pi_mock_secret', paymentIntentId: 'pi_mock' };
    }
    async getOrCreateSubscription(_userId: string, _priceId: string) {
      return { subscriptionId: 'sub_mock', clientSecret: null };
    }
    async cancelSubscription(_userId: string) { return; }
    async createBillingPortalSession(_userId: string, returnUrl: string) { return returnUrl; }
    async handleWebhook(_body: string, _signature: string, _endpointSecret: string) { return; }
    async getSubscriptionPlans() { return []; }
    async getUserPaymentHistory(_userId: string) { return []; }
  }
  stripeService = new MockStripeService();
}

export { stripeService };
