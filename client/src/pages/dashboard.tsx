import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import Sidebar from "@/components/dashboard/sidebar";
import MetricsGrid from "@/components/dashboard/metrics-grid";
import ActivityFeed from "@/components/dashboard/activity-feed";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import WordPressIntegration from "@/components/dashboard/wordpress-integration";
import SocialScheduler from "@/components/dashboard/social-scheduler";
import SEOPerformance from "@/components/dashboard/seo-performance";
import TasksList from "@/components/dashboard/tasks-list";
import LeadsPanel from "@/components/dashboard/leads-panel";
import ReviewsPanel from "@/components/dashboard/reviews-panel";
import GoDaddyIntegration from "@/components/dashboard/godaddy-integration";
import AnalyticsReports from "@/components/dashboard/analytics-reports";
import WeatherWidget from "@/components/dashboard/weather-widget";
import { Button } from "@/components/ui/button";
import { Wand2, MapPin } from "lucide-react";

export default function Dashboard() {
  useEffect(() => {
    // Track dashboard view
    trackEvent('dashboard_view', 'navigation', 'dashboard_page');
  }, []);

  const handleGenerateContent = () => {
    trackEvent('generate_content_click', 'action', 'header_button');
    // This will be handled by individual components
  };

  return (
    <div className="min-h-screen flex bg-hvac-light">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-hvac-gray">HVAC Marketing Dashboard</h2>
              <p className="text-gray-600 mt-1">Welcome back! Here's what Dave has been working on.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-primary/10 rounded-lg px-3 py-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Winter Haven, FL</span>
              </div>
              <WeatherWidget />
              <Button 
                onClick={handleGenerateContent}
                className="bg-hvac-orange hover:bg-hvac-orange/90 text-white"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          <MetricsGrid />

          {/* Dave's Activity & Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed />
            <AnalyticsChart />
          </div>

          {/* Content Management & SEO Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WordPressIntegration />
            <SocialScheduler />
            <SEOPerformance />
          </div>

          {/* WordPress & Analytics Integration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoDaddyIntegration />
            <AnalyticsReports />
          </div>

          {/* Customer Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TasksList />
            <LeadsPanel />
            <ReviewsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
