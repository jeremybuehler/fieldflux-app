import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import TopNavigation from "@/components/layout/top-navigation";
import {
  ArrowLeft,
  Globe,
  FileText,
  Edit,
  TrendingUp,
  Users,
  Calendar,
  Clock,
} from "lucide-react";

export default function Website() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <TopNavigation title="Website Management" />
      <div className="flex min-h-screen">
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-6 pt-16 lg:pt-6">
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                    Website Management
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Manage your website content and performance
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Website Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          12
                        </div>
                        <div className="text-sm text-blue-800">
                          Active Pages
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          95%
                        </div>
                        <div className="text-sm text-green-800">Uptime</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          2.3s
                        </div>
                        <div className="text-sm text-purple-800">Load Time</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          85
                        </div>
                        <div className="text-sm text-orange-800">SEO Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-green-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          New blog post published
                        </h4>
                        <p className="text-sm text-gray-600">
                          "5 Tips for Energy-Efficient Cooling"
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Edit className="w-5 h-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          Homepage optimized
                        </h4>
                        <p className="text-sm text-gray-600">
                          SEO improvements and speed optimization
                        </p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          Case study published
                        </h4>
                        <p className="text-sm text-gray-600">
                          "Commercial Installation Success Story"
                        </p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Content Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Blog Posts</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">2.4k views</div>
                          <div className="text-xs text-green-600">+15%</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Service Pages</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">5.2k views</div>
                          <div className="text-xs text-green-600">+8%</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Landing Pages</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">3.8k views</div>
                          <div className="text-xs text-blue-600">+22%</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">About/Contact</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">1.1k views</div>
                          <div className="text-xs text-gray-600">+3%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Create New Blog Post
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Update Service Pages
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Globe className="w-4 h-4 mr-2" />
                      Check Site Health
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
