import { db } from '../db';
import { subscriptionPlans } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export class SubscriptionPlansService {
  async initializeDefaultPlans(): Promise<void> {
    // Check if plans already exist
    const existingPlans = await db.select().from(subscriptionPlans);
    
    if (existingPlans.length > 0) {
      return; // Plans already exist
    }

    // Create default plans
    const defaultPlans = [
      {
        planId: 'price_starter_free',
        name: 'Starter',
        description: 'Perfect for small businesses getting started',
        price: '0.00',
        currency: 'usd',
        interval: 'month',
        intervalCount: 1,
        features: [
          'Up to 50 leads per month',
          'Basic AI content generation',
          '5 social media posts per month',
          'Email support',
          'Basic analytics',
        ],
        maxLeads: 50,
        maxSocialPosts: 5,
        maxEmailCampaigns: 2,
        isActive: true,
      },
      {
        planId: 'price_pro_monthly',
        name: 'Professional',
        description: 'For growing businesses that need more power',
        price: '49.00',
        currency: 'usd',
        interval: 'month',
        intervalCount: 1,
        features: [
          'Up to 500 leads per month',
          'Advanced AI content generation',
          'Unlimited social media posts',
          'Email campaigns & automation',
          'Advanced analytics & reporting',
          'Priority support',
          'Lead scoring & qualification',
          'Review management',
        ],
        maxLeads: 500,
        maxSocialPosts: -1,
        maxEmailCampaigns: 10,
        isActive: true,
      },
      {
        planId: 'price_enterprise_monthly',
        name: 'Enterprise',
        description: 'For established businesses with complex needs',
        price: '149.00',
        currency: 'usd',
        interval: 'month',
        intervalCount: 1,
        features: [
          'Unlimited leads',
          'White-label solutions',
          'Custom AI training',
          'Unlimited everything',
          'Dedicated account manager',
          'Custom integrations',
          'Advanced team collaboration',
          'Custom reporting & dashboards',
          'Phone support',
        ],
        maxLeads: -1,
        maxSocialPosts: -1,
        maxEmailCampaigns: -1,
        isActive: true,
      },
    ];

    await db.insert(subscriptionPlans).values(defaultPlans);
    console.log('Default subscription plans initialized');
  }

  async getActivePlans() {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }
}

export const subscriptionPlansService = new SubscriptionPlansService();