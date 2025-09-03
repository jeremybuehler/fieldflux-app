import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  Download,
  ExternalLink,
  Crown,
  Star,
  Zap,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';

interface Payment {
  id: number;
  amount: string;
  currency: string;
  status: string;
  description: string;
  paymentType: string;
  createdAt: string;
}

export default function BillingSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery<import('@shared/schema').User | null>({
    queryKey: ['/api/auth/user'],
  });

  const { data: paymentHistory = [] } = useQuery<Payment[]>({
    queryKey: ['/api/stripe/payment-history'],
    enabled: !!user,
  });

  const createBillingPortal = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/stripe/create-billing-portal', {
        returnUrl: window.location.origin + '/settings',
      });
    },
    onSuccess: (data) => {
      window.open(data.url, '_blank');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to open billing portal. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/stripe/cancel-subscription');
    },
    onSuccess: () => {
      toast({
        title: 'Subscription Canceled',
        description: 'Your subscription has been canceled. You will retain access until the end of your current billing period.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: () => {
      toast({
        title: 'Cancellation Failed',
        description: 'Failed to cancel subscription. Please try again or contact support.',
        variant: 'destructive',
      });
    },
  });

  const getPlanIcon = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'pro':
      case 'professional':
        return <Zap className="w-5 h-5 text-blue-500" />;
      case 'enterprise':
        return <Crown className="w-5 h-5 text-purple-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'pro':
        return 'Professional';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Starter (Free)';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Active' },
      past_due: { variant: 'destructive' as const, label: 'Past Due' },
      canceled: { variant: 'secondary' as const, label: 'Canceled' },
      free: { variant: 'outline' as const, label: 'Free' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.free;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {getPlanIcon(user?.subscriptionPlan || 'free')}
            <span className="ml-2">Current Plan</span>
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {getPlanDisplayName(user?.subscriptionPlan || 'free')}
              </h3>
              <p className="text-sm text-gray-600">
                {user?.subscriptionCurrentPeriodEnd
                  ? `Renews on ${format(new Date(user.subscriptionCurrentPeriodEnd), 'MMMM d, yyyy')}`
                  : 'No billing cycle'}
              </p>
            </div>
            <div className="text-right">
              {getStatusBadge(user?.subscriptionStatus || 'free')}
            </div>
          </div>

          {user?.subscriptionPlan === 'free' ? (
            <div className="space-y-4">
              <Separator />
              <div className="text-center py-4">
                <h4 className="text-lg font-semibold mb-2">Ready to unlock more features?</h4>
                <p className="text-gray-600 mb-4">
                  Upgrade to Professional for unlimited leads, advanced AI features, and priority support.
                </p>
                <Button
                  onClick={() => (window.location.href = '/pricing')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Separator />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => createBillingPortal.mutate()}
                  disabled={createBillingPortal.isPending}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/pricing')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Change Plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => cancelSubscription.mutate()}
                  disabled={cancelSubscription.isPending}
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Payment History
            </CardTitle>
            <CardDescription>
              View your recent transactions and download receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Calendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.description || 'Subscription Payment'}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(payment.createdAt), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${payment.amount} {payment.currency.toUpperCase()}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(payment.status)}
                      <Button variant="ghost" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Need to update your billing details or have questions?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Payment Method</h4>
              <p className="text-sm text-gray-600">
                Manage your payment methods through the billing portal
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => createBillingPortal.mutate()}
                disabled={createBillingPortal.isPending}
              >
                Update Payment Method
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Billing Support</h4>
              <p className="text-sm text-gray-600">
                Questions about billing? We're here to help
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
