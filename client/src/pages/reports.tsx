import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TopNav from "@/components/navigation/top-nav";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Mouse, Star, MessageSquare, Calendar, Download, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Reports() {
  const [timePeriod, setTimePeriod] = useState('30d');
  
  // Get comprehensive analytics data
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/analytics/metrics', timePeriod],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/metrics?period=${timePeriod}`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    }
  });

  const { data: trafficSources } = useQuery({
    queryKey: ['/api/analytics/traffic-sources', timePeriod],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/traffic-sources?period=${timePeriod}`);
      if (!response.ok) throw new Error('Failed to fetch traffic sources');
      return response.json();
    }
  });

  const { data: reviewAnalytics } = useQuery({
    queryKey: ['/api/reviews/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/reviews/analytics');
      if (!response.ok) throw new Error('Failed to fetch review analytics');
      return response.json();
    }
  });

  const { data: keywords } = useQuery({
    queryKey: ['/api/search-console/keywords', timePeriod],
    queryFn: async () => {
      const response = await fetch(`/api/search-console/keywords?period=${timePeriod}`);
      if (!response.ok) throw new Error('Failed to fetch keywords');
      return response.json();
    }
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Sample data for charts
  const performanceData = [
    { name: 'Week 1', visits: 124, leads: 8, conversions: 3 },
    { name: 'Week 2', visits: 156, leads: 12, conversions: 5 },
    { name: 'Week 3', visits: 189, leads: 15, conversions: 7 },
    { name: 'Week 4', visits: 167, leads: 11, conversions: 4 },
  ];

  return (
    <div className="min-h-screen landing-page">
      <TopNav />
      
      <main className="w-full">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold gradient-text">Business Reports</h1>
                <p className="text-sm text-fieldflux-secondary">Comprehensive insights across all your marketing channels</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 fx-grain" style={{backgroundColor: 'var(--bg-primary)'}}>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-xl font-bold" style={{color: 'var(--fx-navy-900)'}}>Business Intelligence Dashboard</h2>
                <p className="text-sm text-gray-600">Comprehensive insights across all your marketing channels</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="text-white" style={{backgroundColor: 'var(--fx-teal-600)'}}>
              Google Analytics Connected
            </Badge>
            <Badge variant="outline" className="border-2" style={{color: 'var(--fx-orange-600)', borderColor: 'var(--fx-orange-600)'}}>
              Search Console Active
            </Badge>
            <Badge variant="outline" className="border-2" style={{color: 'var(--fx-navy-900)', borderColor: 'var(--fx-navy-900)'}}>
              Reviews Monitoring
            </Badge>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-sm border rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Website Visitors</p>
                <p className="text-2xl font-bold" style={{color: 'var(--fx-navy-900)'}}>
                  {metricsLoading ? "..." : metrics?.users?.toLocaleString() || "0"}
                </p>
                <p className="text-xs" style={{color: 'var(--fx-teal-600)'}}>{metricsLoading ? "..." : metrics?.users ? "Connected" : "Connect Analytics"}</p>
              </div>
              <Users className="w-8 h-8" style={{color: 'var(--fx-orange-600)'}} />
            </div>
          </div>

          <div className="bg-white shadow-sm border rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-2xl font-bold" style={{color: 'var(--fx-navy-900)'}}>
                  {metricsLoading ? "..." : metrics?.pageviews?.toLocaleString() || "0"}
                </p>
                <p className="text-xs" style={{color: 'var(--fx-teal-600)'}}>{metricsLoading ? "..." : metrics?.pageviews ? "Connected" : "Connect Analytics"}</p>
              </div>
              <Eye className="w-8 h-8" style={{color: 'var(--fx-teal-600)'}} />
            </div>
          </div>

          <div className="bg-white shadow-sm border rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lead Conversions</p>
                <p className="text-2xl font-bold" style={{color: 'var(--fx-navy-900)'}}>
                  0
                </p>
                <p className="text-xs" style={{color: 'var(--fx-teal-600)'}}>Connect lead tracking</p>
              </div>
              <Mouse className="w-8 h-8" style={{color: 'var(--fx-orange-600)'}} />
            </div>
          </div>

          <div className="bg-white shadow-sm border rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Review Rating</p>
                <p className="text-2xl font-bold" style={{color: 'var(--fx-navy-900)'}}>
                  {reviewAnalytics?.overview?.averageRating || "0.0"}
                </p>
                <p className="text-xs" style={{color: 'var(--fx-teal-600)'}}>{reviewAnalytics?.overview?.averageRating ? "Active monitoring" : "Connect reviews"}</p>
              </div>
              <Star className="w-8 h-8" style={{color: 'var(--fx-yellow-500)'}} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficSources || [
                      { name: 'Google Search', value: 45, color: '#3B82F6' },
                      { name: 'Direct', value: 25, color: '#10B981' },
                      { name: 'Social Media', value: 15, color: '#F59E0B' },
                      { name: 'Referrals', value: 10, color: '#EF4444' },
                      { name: 'Email', value: 5, color: '#8B5CF6' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(trafficSources || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Keywords Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(keywords || [
                  { keyword: 'air conditioning repair', clicks: 234, impressions: 1200, position: 3.2 },
                  { keyword: 'hvac service', clicks: 189, impressions: 980, position: 2.8 },
                  { keyword: 'emergency ac repair', clicks: 156, impressions: 750, position: 4.1 },
                  { keyword: 'air conditioner installation', clicks: 134, impressions: 890, position: 3.7 }
                ]).slice(0, 4).map((keyword: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{keyword.keyword}</p>
                      <p className="text-sm text-gray-600">{keyword.clicks} clicks • Avg. position {keyword.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{keyword.impressions} impressions</p>
                      <p className="text-xs text-green-600">↗ +15%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Review Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Review Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="font-medium">{reviewAnalytics?.overview?.totalReviews || 147}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{reviewAnalytics?.overview?.averageRating || 4.8}</span>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-medium">{reviewAnalytics?.overview?.responseRate || 94}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">5-Star Reviews</span>
                  <span className="font-medium text-green-600">{reviewAnalytics?.overview?.positiveReviews || 108}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Reviews improve local search ranking and customer trust</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Improve SEO Performance</h4>
                <p className="text-sm text-blue-700 mb-3">3 keywords dropped in rankings this week</p>
                <Button size="sm" variant="outline">View Keywords</Button>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Respond to Reviews</h4>
                <p className="text-sm text-green-700 mb-3">5 new reviews need responses</p>
                <Button size="sm" variant="outline">Manage Reviews</Button>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Social Media Content</h4>
                <p className="text-sm text-orange-700 mb-3">Schedule posts for next week</p>
                <Button size="sm" variant="outline">Create Content</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}