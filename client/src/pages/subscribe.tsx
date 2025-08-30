import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard, Shield } from 'lucide-react';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined;
const stripePromise: Promise<Stripe | null> | null = stripePublicKey
  ? loadStripe(stripePublicKey)
  : null;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?subscription=success`,
      },
    });

    if (error) {
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Subscription Active!',
        description: 'Welcome to FieldFlux Pro! You now have access to all premium features.',
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <PaymentElement />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={!stripe || isLoading}
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Subscription
          </div>
        )}
      </Button>

      <div className="flex items-center justify-center text-sm text-gray-500">
        <Shield className="w-4 h-4 mr-1" />
        Secured by Stripe
      </div>
    </form>
  );
};

export default function SubscribePage() {
  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Subscriptions Unavailable</h1>
          <p className="text-gray-600 max-w-lg">
            Missing Stripe public key. Please set the environment variable <code>VITE_STRIPE_PUBLIC_KEY</code>
            in your hosting provider (e.g., Vercel Project Settings) to enable subscriptions.
          </p>
        </div>
      </div>
    );
  }
  const [clientSecret, setClientSecret] = useState('');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionId = urlParams.get('subscription_id');
    const secret = urlParams.get('client_secret');

    if (secret) {
      setClientSecret(secret);
      // In a real app, you'd fetch subscription details here
      setSubscriptionDetails({
        planName: 'Professional Plan',
        amount: 49,
        interval: 'month',
        features: [
          'Up to 500 leads per month',
          'Unlimited social media posts',
          'Advanced AI content generation',
          'Email campaigns & automation',
          'Priority support',
        ],
      });
    } else {
      // No client secret, redirect to pricing
      window.location.href = '/pricing';
    }
  }, []);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Your Subscription
            </h1>
            <p className="text-gray-600">
              You're just one step away from unlocking all premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Subscription Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Subscription Summary
                </CardTitle>
                <CardDescription>
                  Your selected plan details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptionDetails && (
                  <>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {subscriptionDetails.planName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Billed monthly
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${subscriptionDetails.amount}
                        </div>
                        <div className="text-sm text-gray-600">
                          per {subscriptionDetails.interval}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        What's included:
                      </h4>
                      <ul className="space-y-1">
                        {subscriptionDetails.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Enter your payment information to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#3b82f6',
                      },
                    },
                  }}
                >
                  <CheckoutForm />
                </Elements>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Your payment is secure
                </h3>
                <p className="text-sm text-gray-600">
                  We use Stripe for secure payment processing. Your card details are encrypted and never stored on our servers.
                  You can cancel your subscription at any time from your account settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
