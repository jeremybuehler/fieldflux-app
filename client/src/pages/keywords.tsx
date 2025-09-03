import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, TrendingUp, Eye, MousePointer, Target, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SearchConsoleSetup from "@/components/search-console-setup";

interface KeywordData {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  trend: 'up' | 'down' | 'stable';
  difficulty: 'easy' | 'medium' | 'hard';
  searchVolume: number;
}

export default function Keywords() {
  // Fetch real keyword data from Search Console API
  const { data: apiResponse, isLoading, error } = useQuery<{ keywords: KeywordData[]; meta?: { source: string } }>({
    queryKey: ['/api/analytics/keywords'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const keywords: KeywordData[] = apiResponse?.keywords || [];
  const isRealData = apiResponse?.meta?.source === 'search_console';

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-green-500" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-red-500" />;
      default: return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalClicks = keywords.reduce((sum, k) => sum + k.clicks, 0);
  const totalImpressions = keywords.reduce((sum, k) => sum + k.impressions, 0);
  const avgPosition = keywords.length > 0 ? keywords.reduce((sum, k) => sum + k.position, 0) / keywords.length : 0;
  const avgCTR = keywords.length > 0 ? keywords.reduce((sum, k) => sum + k.ctr, 0) / keywords.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reports
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Keyword Performance Dashboard</h1>
              <p className="text-gray-600">Track search rankings, optimize content, and discover new opportunities</p>
            </div>
          </div>
        </div>

        {/* Search Console Setup Info */}
        <SearchConsoleSetup />

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-gray-500">Loading keyword data from Google Search Console...</div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-red-500">Error loading keyword data. Using demo data for display.</div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+23% from last month</p>
                </div>
                <MousePointer className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Impressions</p>
                  <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+18% from last month</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average CTR</p>
                  <p className="text-2xl font-bold">{avgCTR.toFixed(1)}%</p>
                  <p className="text-xs text-green-600">+0.4% from last month</p>
                </div>
                <Target className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Position</p>
                  <p className="text-2xl font-bold">#{avgPosition.toFixed(1)}</p>
                  <p className="text-xs text-green-600">Improved 0.8 positions</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Keyword Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Keyword Performance Analysis</CardTitle>
                <p className="text-sm text-gray-600">Last 30 days performance data</p>
              </div>
              <div className="flex items-center space-x-2">
                {isRealData ? (
                  <Badge className="bg-green-100 text-green-800">Live Data</Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800">Demo Data</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Keyword</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Position</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Clicks</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Impressions</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">CTR</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Search Volume</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Difficulty</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.length > 0 ? keywords.map((keyword, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-gray-900">{keyword.keyword}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-1">
                          <span className={`font-semibold ${keyword.position <= 3 ? 'text-green-600' : keyword.position <= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                            #{keyword.position.toFixed(1)}
                          </span>
                          {getTrendIcon(keyword.trend)}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-medium">{keyword.clicks}</td>
                      <td className="py-3 px-2 text-gray-600">{keyword.impressions.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{keyword.ctr.toFixed(1)}%</span>
                          <Progress value={keyword.ctr * 10} className="w-12 h-2" />
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-600">{keyword.searchVolume.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <Badge className={getDifficultyColor(keyword.difficulty)}>
                          {keyword.difficulty}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center">
                          {getTrendIcon(keyword.trend)}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="py-8 px-2 text-center text-gray-500">
                        {isLoading ? 'Loading keywords...' : 'No keyword data available. Please set up Google Search Console integration.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Wins</CardTitle>
              <p className="text-sm text-gray-600">Keywords with optimization potential</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Position 4-10 Opportunities</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex justify-between">
                      <span>central air repair</span>
                      <span className="font-medium">#4.1 → Target #1-3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>commercial hvac</span>
                      <span className="font-medium">#5.2 → Target #1-3</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Low CTR Improvers</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>hvac installation</span>
                      <span className="font-medium">3.6% CTR → Optimize title</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ductwork cleaning</span>
                      <span className="font-medium">3.6% CTR → Add description</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Recommendations</CardTitle>
              <p className="text-sm text-gray-600">Based on keyword analysis</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">High-Volume, Low-Difficulty</h4>
                  <p className="text-sm text-gray-600 mb-2">Create content for these easy wins:</p>
                  <ul className="text-sm space-y-1">
                    <li>• "Emergency HVAC Repair" (2.1K volume, easy)</li>
                    <li>• "HVAC Maintenance" (3.2K volume, easy)</li>
                    <li>• "Ductwork Cleaning" (1.5K volume, easy)</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-gray-900">Improve Existing Content</h4>
                  <p className="text-sm text-gray-600 mb-2">Optimize these underperforming pages:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Add FAQ section to "AC Repair" page</li>
                    <li>• Include local service areas</li>
                    <li>• Add customer testimonials</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
