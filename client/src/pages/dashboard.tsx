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
            {/* Dashboard Content */}
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                    Field Service Marketing Dashboard
                  </h1>
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