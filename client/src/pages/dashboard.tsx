import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <MobileSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-6 pt-16 lg:pt-6">
            {/* Dashboard Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-hvac-gray mb-2">
                    
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-base">Welcome back! Here's your social media content marketing activity.</p>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <div className="flex items-center space-x-2 bg-primary/10 rounded-lg px-3 py-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Winter Haven, FL</span>
                  </div>
            
                  <Button 
                    onClick={handleGenerateContent}
                    className="bg-gradient-to-r from-primary to-hvac-orange hover:from-primary/90 hover:to-hvac-orange/90 text-white text-sm lg:text-base"
                    size="sm"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Generate Content</span>
                    <span className="sm:hidden">Generate</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="space-y-4 lg:space-y-6">
              <MetricsGrid />

              {/* Activity & Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <ActivityFeed />
                <AnalyticsChart />
              </div>

              {/* Content Management & SEO Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <WordPressIntegration />
                <SocialScheduler />
                <SEOPerformance />
              </div>

              {/* WordPress & Analytics Integration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <GoDaddyIntegration />
                <AnalyticsReports />
              </div>

              {/* Customer Management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <TasksList />
                <LeadsPanel />
                <ReviewsPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
