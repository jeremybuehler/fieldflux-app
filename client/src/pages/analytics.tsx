import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import AnalyticsReports from "@/components/dashboard/analytics-reports";
import { ArrowLeft, TrendingUp, Users, Eye, MousePointer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/lib/analytics-service";

export default function Analytics() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/analytics/metrics'],
    queryFn: () => analyticsService.getMetrics('30d'),
  });

  const { data: trafficSources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['/api/analytics/traffic-sources'],
    queryFn: () => analyticsService.getTrafficSources('30d'),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-hvac-gray">Analytics & Performance</h1>
              <p className="text-gray-600">Track your marketing performance and customer engagement</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">
                    {metricsLoading ? '...' : metrics?.users.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-green-600">
                    {metricsLoading ? '...' : `${metrics?.new_users || 0} new users`}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold">
                    {metricsLoading ? '...' : metrics?.pageviews.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-green-600">
                    {metricsLoading ? '...' : `${metrics?.sessions || 0} sessions`}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Session Duration</p>
                  <p className="text-2xl font-bold">
                    {metricsLoading ? '...' : `${Math.round((metrics?.avg_session_duration || 0) / 60)}m`}
                  </p>
                  <p className="text-xs text-blue-600">
                    {metricsLoading ? '...' : `${metrics?.sessions || 0} sessions`}
                  </p>
                </div>
                <MousePointer className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bounce Rate</p>
                  <p className="text-2xl font-bold">
                    {metricsLoading ? '...' : `${(metrics?.bounce_rate || 0).toFixed(1)}%`}
                  </p>
                  <p className="text-xs text-red-600">
                    {metricsLoading ? '...' : 'Google Analytics data'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AnalyticsChart />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sourcesLoading ? (
                <div className="text-center py-4">Loading traffic sources...</div>
              ) : trafficSources && trafficSources.length > 0 ? (
                trafficSources.slice(0, 5).map((source, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{source.source} ({source.medium})</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-600' : 
                            index === 1 ? 'bg-green-600' : 
                            index === 2 ? 'bg-purple-600' : 
                            index === 3 ? 'bg-orange-600' : 'bg-gray-600'
                          }`}
                          style={{ width: `${Math.min(source.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{source.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No traffic data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        <AnalyticsReports />
      </div>
    </div>
  );
}