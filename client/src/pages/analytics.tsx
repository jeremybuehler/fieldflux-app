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
    <div className="min-h-screen fx-hills">
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{backgroundColor: 'var(--fx-orange-600)'}}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{color: 'var(--fx-navy-900)'}}>Analytics & Performance</h1>
              <p className="text-gray-600">Track your marketing performance and customer engagement</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow-sm border rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">Total Users</div>
              <Users className="w-6 h-6" style={{color: 'var(--fx-orange-600)'}} />
            </div>
            <div className="text-2xl font-bold mb-2" style={{color: 'var(--fx-navy-900)'}}>
              {metricsLoading ? '...' : metrics?.users.toLocaleString() || '0'}
            </div>
            <div className="text-xs" style={{color: 'var(--fx-teal-600)'}}>
              {metricsLoading ? "..." : metrics?.new_users ? `${metrics.new_users} new users` : "Connect Analytics"}
            </div>
          </div>

          <Card className="metric-fieldservice hover-glow animate-protocol-scale-in" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6">
              <div className="metric-fieldservice-header">
                <div className="metric-fieldservice-title">Page Views</div>
                <Eye className="w-6 h-6 text-green-600 animate-pulse-glow" />
              </div>
              <div className="metric-fieldservice-value">
                {metricsLoading ? '...' : metrics?.pageviews.toLocaleString() || '0'}
              </div>
              <div className="metric-fieldservice-change metric-fieldservice-change-positive">
                {metricsLoading ? '...' : `${metrics?.sessions || 0} sessions`}
              </div>
            </CardContent>
          </Card>

          <Card className="metric-fieldservice hover-glow animate-protocol-scale-in" style={{animationDelay: '0.3s'}}>
            <CardContent className="p-6">
              <div className="metric-fieldservice-header">
                <div className="metric-fieldservice-title">Avg Session Duration</div>
                <MousePointer className="w-6 h-6 text-orange-600 animate-float" />
              </div>
              <div className="metric-fieldservice-value">
                {metricsLoading ? '...' : `${Math.round((metrics?.avg_session_duration || 0) / 60)}m`}
              </div>
              <div className="metric-fieldservice-change metric-fieldservice-change-neutral">
                {metricsLoading ? '...' : `${metrics?.sessions || 0} sessions`}
              </div>
            </CardContent>
          </Card>

          <Card className="metric-fieldservice hover-glow animate-protocol-scale-in" style={{animationDelay: '0.4s'}}>
            <CardContent className="p-6">
              <div className="metric-fieldservice-header">
                <div className="metric-fieldservice-title">Bounce Rate</div>
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div className="metric-fieldservice-value">
                {metricsLoading ? '...' : `${(metrics?.bounce_rate || 0).toFixed(1)}%`}
              </div>
              <div className="metric-fieldservice-change metric-fieldservice-change-neutral">
                Google Analytics data
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="animate-protocol-scale-in" style={{animationDelay: '0.5s'}}>
            <AnalyticsChart />
          </div>
          <Card className="glass-morphism hover-lift shadow-fieldflux animate-protocol-scale-in" style={{animationDelay: '0.6s'}}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="gradient-text text-lg">Top Keywords</CardTitle>
                <Link href="/keywords">
                  <Button variant="outline" size="sm" className="glass-morphism hover-lift border-white/20">
                    View All Keywords
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 font-medium">
                  <span>Keyword</span>
                  <span>Clicks</span>
                  <span>CTR</span>
                  <span>Position</span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <span className="text-sm font-medium">ac repair near me</span>
                    <span className="text-sm">45</span>
                    <span className="text-sm text-green-600">3.6%</span>
                    <span className="text-sm text-blue-600">#2.1</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <span className="text-sm font-medium">hvac installation</span>
                    <span className="text-sm">32</span>
                    <span className="text-sm text-green-600">3.6%</span>
                    <span className="text-sm text-blue-600">#3.2</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <span className="text-sm font-medium">emergency hvac repair</span>
                    <span className="text-sm">28</span>
                    <span className="text-sm text-green-600">4.1%</span>
                    <span className="text-sm text-blue-600">#1.8</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-gray-500">
                  Connect Google Search Console for real keyword data
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traffic Sources</CardTitle>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reviews Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="text-2xl font-bold">147</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xl font-bold text-yellow-500">4.6</span>
                    <span className="text-yellow-500">★★★★★</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-lg font-semibold text-green-600">89%</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <span className="text-sm text-green-800">+12% reviews this month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Google My Business</span>
                    <div className="text-xs text-gray-500">89 reviews • 8 recent</div>
                  </div>
                  <span className="text-sm font-bold">4.7★</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Facebook</span>
                    <div className="text-xs text-gray-500">34 reviews • 3 recent</div>
                  </div>
                  <span className="text-sm font-bold">4.5★</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Yelp</span>
                    <div className="text-xs text-gray-500">24 reviews • 1 recent</div>
                  </div>
                  <span className="text-sm font-bold">4.4★</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-4 border-green-400 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Google</span>
                    <span className="text-yellow-500">★★★★★</span>
                  </div>
                  <p className="text-xs">"Excellent service! Fixed our AC quickly..."</p>
                  <span className="text-xs text-green-600">✓ Responded</span>
                </div>
                <div className="border-l-4 border-orange-400 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Facebook</span>
                    <span className="text-yellow-500">★★★★</span>
                  </div>
                  <p className="text-xs">"Good work, came on time..."</p>
                  <span className="text-xs text-red-600">⚠ Needs response</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AnalyticsReports />
      </div>
    </div>
  );
}