import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedScheduler from "@/components/social/enhanced-scheduler";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import { ArrowLeft, Share2 } from "lucide-react";

export default function Social() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <MobileSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-6 pt-16 lg:pt-6">
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Back to Dashboard</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-hvac-gray">Social Media Management</h1>
                  <p className="text-gray-600 text-sm lg:text-base">Create, schedule, and manage your social media content</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <EnhancedScheduler />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-blue-800">Posts This Month</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">5</div>
                        <div className="text-sm text-green-800">Scheduled Posts</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">4.2%</div>
                        <div className="text-sm text-purple-800">Engagement Rate</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">847</div>
                        <div className="text-sm text-orange-800">Total Reach</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span className="text-sm font-medium">Facebook</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">85%</div>
                          <div className="text-xs text-gray-500">engagement</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
                          <span className="text-sm font-medium">Instagram</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">72%</div>
                          <div className="text-xs text-gray-500">engagement</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                          <span className="text-sm font-medium">LinkedIn</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">58%</div>
                          <div className="text-xs text-gray-500">engagement</div>
                        </div>
                      </div>
                    </div>
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