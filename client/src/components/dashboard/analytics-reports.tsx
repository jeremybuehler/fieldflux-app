import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Download, RefreshCw, Users, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { AnalyticsReport } from "@shared/schema";

const TRAFFIC_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reports, isLoading: reportsLoading } = useQuery<AnalyticsReport[]>({
    queryKey: ["/api/analytics/reports"],
  });

  const generateReportMutation = useMutation({
    mutationFn: async (period: string) => {
      const response = await apiRequest("POST", "/api/analytics/generate-report", { period });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Report Generated",
        description: "New analytics report has been generated successfully.",
      });
      trackEvent('analytics_report_generated', 'analytics', 'generate_report');
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate analytics report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateReport = () => {
    generateReportMutation.mutate(selectedPeriod);
  };

  const latestReport = reports?.[0];

  // Sample chart data based on latest report
  const trafficData = latestReport ? [
    { name: "Week 1", visitors: Math.floor(latestReport.traffic * 0.2) },
    { name: "Week 2", visitors: Math.floor(latestReport.traffic * 0.25) },
    { name: "Week 3", visitors: Math.floor(latestReport.traffic * 0.28) },
    { name: "Week 4", visitors: Math.floor(latestReport.traffic * 0.27) },
  ] : [];

  const sourceData = latestReport?.trafficSources?.map((source, index) => ({
    name: source.split(' (')[0],
    value: parseInt(source.match(/\((\d+)%\)/)?.[1] || "0"),
    color: TRAFFIC_COLORS[index % TRAFFIC_COLORS.length]
  })) || [];

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-hvac-gray">
              Analytics Reports
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={handleGenerateReport}
              disabled={generateReportMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${generateReportMutation.isPending ? 'animate-spin' : ''}`} />
              Generate
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {reportsLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse h-32 bg-gray-200 rounded" />
            <div className="animate-pulse h-24 bg-gray-200 rounded" />
          </div>
        ) : !latestReport ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No analytics reports available</p>
            <p className="text-xs text-gray-400 mt-1">
              Generate your first report to see website performance data
            </p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Traffic</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {latestReport.traffic.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Conversions</span>
                </div>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {latestReport.conversions}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Conv. Rate</span>
                </div>
                <p className="text-2xl font-bold text-orange-700 mt-1">
                  {((latestReport.conversions / latestReport.traffic) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Period</span>
                </div>
                <p className="text-lg font-bold text-purple-700 mt-1">
                  {latestReport.period}
                </p>
              </div>
            </div>

            {/* Traffic Chart */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Weekly Traffic Trend</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic Sources and Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Traffic Sources</h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {sourceData.slice(0, 4).map((source, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-xs text-gray-600">
                        {source.name} ({source.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Keywords</h4>
                <div className="space-y-2">
                  {latestReport.topKeywords?.slice(0, 5).map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 truncate">{keyword}</span>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Report History */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Reports</h4>
              <div className="space-y-2">
                {reports?.slice(0, 3).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {report.period} Report
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(report.generatedAt!).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {report.traffic.toLocaleString()} visitors
                      </span>
                      <Button size="sm" variant="ghost">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}