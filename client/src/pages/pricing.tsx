import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  maxLeads?: number;
  maxSocialPosts?: number;
  maxEmailCampaigns?: number;
  isPopular?: boolean;
}

const defaultPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for small businesses getting started',
    price: 0,
    interval: 'month',
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
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For growing businesses that need more power',
    price: 49,
    interval: 'month',
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
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For established businesses with complex needs',
    price: 149,
    interval: 'month',
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
  },
];

export default function PricingPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const { data: plans = defaultPlans } = useQuery({
    queryKey: ['/api/stripe/subscription-plans'],
    queryFn: async () => {
      const response = await fetch('/api/stripe/subscription-plans');
      if (!response.ok) {
        // Fall back to default plans if API fails
        return defaultPlans;
      }
      return response.json();
    },
  });

  const handleSubscribe = async (planId: string, price: number) => {
    if (planId === 'free') {
      toast({
        title: 'Free Plan',
        description: 'You are already on the free plan!',
      });
      return;
    }

    setLoading(planId);

    try {
      // For demo purposes, we'll create a subscription with a test price ID
      // In production, you'd use actual Stripe price IDs
      const testPriceIds: Record<string, string> = {
        pro: 'price_test_pro_monthly',
        enterprise: 'price_test_enterprise_monthly',
      };

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: testPriceIds[planId],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { clientSecret, subscriptionId } = await response.json();

      if (clientSecret) {
        // Redirect to Stripe payment page or handle with Stripe Elements
        window.location.href = `/subscribe?subscription_id=${subscriptionId}&client_secret=${clientSecret}`;
      } else {
        toast({
          title: 'Subscription Active',
          description: 'You already have an active subscription!',
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Failed',
        description: 'Unable to start subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const getIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <Star className="w-6 h-6" />;
      case 'professional':
        return <Zap className="w-6 h-6" />;
      case 'enterprise':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            💎 Pricing Plans
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Growth Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scale your field service marketing with plans designed for businesses of every size.
            Start free, upgrade when you're ready to accelerate growth.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.isPopular
                  ? 'border-2 border-blue-500 shadow-lg scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getIcon(plan.name)}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.isPopular
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => handleSubscribe(plan.id, plan.price)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? (
                    'Processing...'
                  ) : plan.price === 0 ? (
                    'Get Started Free'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Is there a free trial?</h3>
              <p className="text-gray-600">
                Our Starter plan is completely free forever. You can also try Pro features with a 14-day free trial.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and ACH bank transfers through Stripe.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely. Cancel your subscription anytime with no cancellation fees. You'll keep access until your current period ends.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of field service professionals who've accelerated their growth with FieldFlux.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => handleSubscribe('pro', 49)}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}