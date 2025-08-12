import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  MessageSquare,
  Star,
  Target,
  Zap,
  ArrowRight,
  RefreshCw,
  Bell,
  Settings,
  Plus,
  Filter
} from "lucide-react";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import Sidebar from "@/components/dashboard/sidebar";

// Enhanced Dashboard Components
import EnhancedMetricsOverview from "@/components/dashboard/enhanced-metrics-overview";
import IntelligentInsights from "@/components/dashboard/intelligent-insights";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import PerformanceCharts from "@/components/dashboard/performance-charts";
import ActiveCampaigns from "@/components/dashboard/active-campaigns";
import UpcomingTasks from "@/components/dashboard/upcoming-tasks";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    trackEvent('dashboard_view', 'navigation', 'dashboard_page');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen landing-page">
      <div className="flex">
        <Sidebar />
        <MobileSidebar />

        <main className="flex-1 lg:ml-64">
          <div className="sticky top-0 z-40 border-b border-white/20 glass-morphism backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-6 animate-protocol-slide-in">
              <div>
                <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
                <p className="text-sm text-fieldflux-secondary">Welcome back! Here's what's happening with your business.</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="glass-morphism hover-lift border-white/20">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="glass-morphism hover-lift border-white/20"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm" className="gradient-accent hover-glow text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8 container-modern">
            {/* Enhanced Metrics Overview - Top Priority */}
            <EnhancedMetricsOverview timeRange={timeRange} onTimeRangeChange={setTimeRange} />

            {/* Quick Actions Bar */}
            <QuickActions />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Charts */}
              <div className="lg:col-span-2 space-y-6">
                <PerformanceCharts timeRange={timeRange} />
                <ActiveCampaigns />
              </div>

              {/* Right Column - Insights & Activity */}
              <div className="space-y-6">
                <IntelligentInsights />
                <RecentActivity />
                <UpcomingTasks />
              </div>
            </div>

            {/* Secondary Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Overview content will be populated by existing components */}
                </div>
              </TabsContent>

              <TabsContent value="leads" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Leads management components */}
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content management components */}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Analytics components */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}