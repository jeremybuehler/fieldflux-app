import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { Bot, MapPin, TrendingUp, Users, MessageSquare, Star, LogOut, Calendar, Share2, Code, Search, UserPlus, Settings as SettingsIcon, LayoutDashboard, CheckCircle, Globe, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Social Media", href: "/social", icon: Share2 },
  { name: "Website Updates", href: "/website", icon: Code },
  { name: "Reports", href: "/reports", icon: TrendingUp },
  { name: "SEO Optimization", href: "/seo", icon: Search },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Lead Generation", href: "/leads", icon: UserPlus },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [location] = useLocation();

  useEffect(() => {
    trackEvent('dashboard_view', 'navigation', 'dashboard_page');
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleGenerateContent = () => {
    toast({
      title: "Generate Content",
      description: "Content generation feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-hvac-orange rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-hvac-gray text-center lg:text-left">
                  FieldPulse Marketing Dashboard
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="hidden sm:flex items-center space-x-1">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      AI Powered
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      <MapPin className="w-3 h-3 mr-1" />
                      Winter Haven FL
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogout} 
            variant="outline" 
            size="sm"
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3">
        <nav className="flex space-x-1 overflow-x-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2 whitespace-nowrap",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Dashboard Header */}
            <div className="mb-8 border-b border-gray-100 bg-white/80 backdrop-blur-sm rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between text-center sm:text-left">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                    Marketing Dashboard
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    Welcome back! Here's your marketing performance and activity overview.
                  </p>
                </div>

                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 hidden sm:flex">
                    <Bot className="w-4 h-4 mr-2" />
                    AI Powered
                  </Badge>
                  <div className="flex items-center space-x-2 bg-primary/10 rounded-lg px-3 py-2 hidden sm:flex">
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium">Website Traffic</CardTitle>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-gray-600">
                    <span className="text-green-600 font-medium">+12.5%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium">Social Media Engagement</CardTitle>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">1,284</div>
                  <p className="text-xs text-gray-600">
                    <span className="text-green-600 font-medium">+8.3%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium">Customer Reviews</CardTitle>
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-gray-600">
                    Average rating (47 reviews)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-gray-600">
                    <span className="text-green-600 font-medium">+0.8%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Social Media Management */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <CardHeader className="space-y-3 p-6">
                    <CardTitle className="text-xl font-semibold flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>Social Media Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <p className="text-gray-600">
                      Create and schedule social media posts to boost your online presence and engage with customers.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium">Facebook Post Scheduled</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/80 border-green-200">Today 2:00 PM</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium">Instagram Story Ready</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/80 border-blue-200">Draft</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium">LinkedIn Article</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/80 border-purple-200">Tomorrow</Badge>
                      </div>
                    </div>

                    <Button className="w-full py-3 bg-primary text-white hover:bg-primary/90 font-medium rounded-lg transition-all duration-200" onClick={handleGenerateContent}>
                      <Bot className="w-4 h-4 mr-2" />
                      Create New Post
                    </Button>
                  </CardContent>
                </Card>

                {/* Performance Analytics */}
                <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <CardHeader className="space-y-3 p-6">
                    <CardTitle className="text-xl font-semibold flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <span>Performance Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Content Engagement</span>
                          <span className="font-semibold text-green-600">87%</span>
                        </div>
                        <Progress value={87} className="h-3 bg-gray-100" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Lead Generation</span>
                          <span className="font-semibold text-blue-600">72%</span>
                        </div>
                        <Progress value={72} className="h-3 bg-gray-100" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Customer Satisfaction</span>
                          <span className="font-semibold text-purple-600">95%</span>
                        </div>
                        <Progress value={95} className="h-3 bg-gray-100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Sidebar */}
              <div className="space-y-8">
                <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <CardHeader className="space-y-3 p-6">
                    <CardTitle className="text-xl font-semibold flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-orange-600" />
                      </div>
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-2 shadow-sm"></div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">Blog post published</p>
                          <p className="text-xs text-gray-600">2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 shadow-sm"></div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">Social media scheduled</p>
                          <p className="text-xs text-gray-600">4 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 shadow-sm"></div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">New review received</p>
                          <p className="text-xs text-gray-600">1 day ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 shadow-sm"></div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">SEO optimization complete</p>
                          <p className="text-xs text-gray-600">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}