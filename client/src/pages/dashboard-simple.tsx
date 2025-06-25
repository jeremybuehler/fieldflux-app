import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, MapPin, Users, TrendingUp, Heart, Star } from "lucide-react";

export default function Dashboard() {
  useEffect(() => {
    trackEvent('dashboard_view', 'navigation', 'dashboard_page');
  }, []);

  const handleGenerateContent = () => {
    trackEvent('generate_content_click', 'action', 'header_button');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <MobileSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-6 pt-16 lg:pt-6">
            {/* Dashboard Header */}
            <div className={ui.component('header', 'lg')}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="space-y-2">
                  <h1 className={ui.typography({ level: 'display', weight: 'bold', context: 'header' })}>
                    Field Service Marketing Dashboard
                  </h1>
                  <p className={ui.typography({ level: 'body', weight: 'normal', context: 'content' })}>
                    Welcome back! Here's your social media content marketing activity.
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2">
                    <Zap className="w-4 h-4 mr-2" />
                    AI Powered
                  </Badge>
                  <div className="flex items-center space-x-2 bg-primary/10 rounded-lg px-3 py-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Winter Haven, FL</span>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="space-y-4 lg:space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Website Traffic</p>
                        <p className="text-2xl font-bold text-hvac-gray">2,847</p>
                        <p className="text-xs text-green-600">+12.5% this month</p>
                      </div>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Social Engagement</p>
                        <p className="text-2xl font-bold text-hvac-gray">4,251</p>
                        <p className="text-xs text-green-600">+8.3% this month</p>
                      </div>
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-pink-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">New Leads</p>
                        <p className="text-2xl font-bold text-hvac-gray">156</p>
                        <p className="text-xs text-green-600">+23.1% this month</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Review Score</p>
                        <p className="text-2xl font-bold text-hvac-gray">4.8</p>
                        <p className="text-xs text-gray-500">42 reviews</p>
                      </div>
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Social Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Create and schedule your next social media post</p>
                    <Button className="w-full" onClick={() => window.location.href = '/social'}>
                      Create Post
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lead Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Manage and follow up with your leads</p>
                    <Button className="w-full" onClick={() => window.location.href = '/leads'}>
                      View Leads
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">View detailed performance metrics</p>
                    <Button className="w-full" onClick={() => window.location.href = '/analytics'}>
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">New social media post scheduled for tomorrow</span>
                      <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New lead received from website</span>
                      <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">5-star review received on Google</span>
                      <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}