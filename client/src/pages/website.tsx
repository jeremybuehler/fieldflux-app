import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WordPressIntegration from "@/components/dashboard/wordpress-integration";
import GoDaddyIntegration from "@/components/dashboard/godaddy-integration";
import { ArrowLeft, Code, Globe, Edit, FileText } from "lucide-react";

export default function Website() {
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-hvac-gray">Website Updates</h1>
              <p className="text-gray-600">Manage your WordPress content and website integrations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Published Posts</p>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-xs text-green-600">+3 this month</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Draft Posts</p>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-gray-600">Ready to publish</p>
                </div>
                <Edit className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold">12.4k</p>
                  <p className="text-xs text-green-600">+18% this month</p>
                </div>
                <Globe className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Time on Page</p>
                  <p className="text-2xl font-bold">2:34</p>
                  <p className="text-xs text-blue-600">Above average</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">⏱</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WordPressIntegration />
          <GoDaddyIntegration />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Website Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">New blog post published</h4>
                    <p className="text-sm text-gray-600">"5 Signs Your HVAC System Needs Maintenance"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Edit className="w-5 h-5 text-orange-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Service page updated</h4>
                    <p className="text-sm text-gray-600">Emergency Plumbing Services page refreshed</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Homepage optimized</h4>
                    <p className="text-sm text-gray-600">SEO improvements and speed optimization</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Case study published</h4>
                    <p className="text-sm text-gray-600">"Commercial HVAC Installation Success Story"</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Performance</CardTitle>
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
    </div>
  );
}