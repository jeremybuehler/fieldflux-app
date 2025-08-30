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
import TopNav from "@/components/navigation/top-nav";
import CollaborationHints from "@/components/felix/collaboration-hints";
import SmartHintTrigger from "@/components/felix/smart-hint-trigger";
import { useFelixHints } from "@/hooks/use-felix-hints";
import { useSmartHints } from "@/hooks/use-smart-hints";

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
  const { activity, handleHintAction, currentPage } = useFelixHints();
  const { triggers, dismissTrigger, handleHintAction: handleSmartAction } = useSmartHints();

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
    <div className="min-h-screen fx-hills">
      <TopNav />
      
      <main className="w-full">
        <div className="bg-white/90 backdrop-blur-sm border-b fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{color: 'var(--fx-navy-900)'}}>Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back! Here's what's happening with your business.</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2" 
                  style={{borderColor: 'rgb(var(--fx-orange-600))', color: 'rgb(var(--fx-orange-600))'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(var(--fx-orange-600))';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgb(var(--fx-orange-600))';
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="border transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  style={{borderColor: 'rgb(var(--fx-orange-600))', color: 'rgb(var(--fx-orange-600))'}}
                  onMouseEnter={(e) => {
                    if (!refreshing) {
                      e.currentTarget.style.backgroundColor = 'rgb(var(--fx-orange-600))';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!refreshing) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgb(var(--fx-orange-600))';
                    }
                  }}
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
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
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
      
      {/* Felix Collaboration Hints */}
      <CollaborationHints 
        currentPage={currentPage}
        userActivity={activity}
        onHintAction={handleHintAction}
      />
      
      {/* Smart Hint Triggers */}
      {triggers.map((trigger, index) => (
        <SmartHintTrigger
          key={`${trigger.type}-${index}`}
          trigger={trigger.type}
          context={trigger.context}
          onDismiss={() => dismissTrigger(trigger.type)}
          onAction={handleSmartAction}
        />
      ))}
    </div>
  );
}