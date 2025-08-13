import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOPerformance from "@/components/dashboard/seo-performance";
import Sidebar from "@/components/dashboard/sidebar";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import { ArrowLeft, Search, TrendingUp, Target, BarChart3 } from "lucide-react";

export default function SEO() {
  return (
    <div className="min-h-screen landing-page">
      <div className="flex">
        <Sidebar />
        <MobileSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="sticky top-0 z-40 border-b border-white/20 glass-morphism backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-6 animate-protocol-slide-in">
              <div>
                <h1 className="text-2xl font-bold gradient-text">SEO Optimization</h1>
                <p className="text-sm text-fieldflux-secondary">Optimize your search engine visibility and keyword rankings</p>
              </div>
            </div>
          </div>

          <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-hvac-gray">SEO Optimization</h1>
              <p className="text-gray-600">Optimize your search engine visibility and keyword rankings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Keyword Rankings</p>
                  <p className="text-2xl font-bold">142</p>
                  <p className="text-xs text-green-600">+8 this month</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Organic Traffic</p>
                  <p className="text-2xl font-bold">1,847</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Page Speed Score</p>
                  <p className="text-2xl font-bold">87</p>
                  <p className="text-xs text-orange-600">Needs improvement</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Domain Authority</p>
                  <p className="text-2xl font-bold">34</p>
                  <p className="text-xs text-blue-600">Industry average: 28</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">DA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SEOPerformance />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Keywords</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">field service software</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">#3</div>
                      <div className="text-xs text-gray-500">↑2</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">HVAC repair near me</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">#7</div>
                      <div className="text-xs text-gray-500">↑1</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">plumbing services</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">#12</div>
                      <div className="text-xs text-gray-500">—</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">electrical contractor</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-orange-600">#18</div>
                      <div className="text-xs text-gray-500">↓3</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SEO Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-1">Optimize Page Speed</h4>
                    <p className="text-sm text-blue-800">Compress images and enable caching to improve load times</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-1">Add Local Keywords</h4>
                    <p className="text-sm text-green-800">Include city and region names in your content</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-1">Create Service Pages</h4>
                    <p className="text-sm text-orange-800">Build dedicated pages for each service you offer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">ServiceTitan</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">DA: 72</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fieldwire</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">DA: 58</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Jobber</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">DA: 45</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
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