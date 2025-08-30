import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, UserPlus, Star, TrendingUp } from "lucide-react";

interface DashboardMetrics {
  traffic: number;
  trafficGrowth: number;
  socialEngagement: number;
  socialEngagementGrowth: number;
  leads: number;
  leadsGrowth: number;
  reviewScore: number;
  reviewCount: number;
}

export default function MetricsGrid() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              Unable to load metrics. Please check your connection.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Website Traffic</p>
              <p className="text-2xl font-bold text-hvac-gray mt-2">
                {metrics.traffic.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +{metrics.trafficGrowth}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Social Engagement</p>
              <p className="text-2xl font-bold text-hvac-gray mt-2">
                {metrics.socialEngagement.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +{metrics.socialEngagementGrowth}% this week
              </p>
            </div>
            <div className="w-12 h-12 bg-hvac-orange/10 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-hvac-orange" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lead Generation</p>
              <p className="text-2xl font-bold text-hvac-gray mt-2">
                {metrics.leads}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +{metrics.leadsGrowth}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Review Score</p>
              <p className="text-2xl font-bold text-hvac-gray mt-2">
                {metrics.reviewScore}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {metrics.reviewCount} reviews
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}