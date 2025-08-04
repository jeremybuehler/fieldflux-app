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

import Sidebar from "@/components/dashboard/sidebar";

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
    <div className="dashboard-fieldservice">
      <div className="flex">
        <Sidebar />
        <MobileSidebar />

        <main className="main-content-fieldservice">
          <div className="content-area-fieldservice">
            {/* Dashboard Header */}
            <div className="page-header-fieldservice rounded-lg mb-6">
              <h1 className="page-title-fieldservice">
                Field Service Marketing Dashboard
              </h1>
              <p className="page-subtitle-fieldservice">
                Monitor your business performance and manage field operations
              </p>
            </div>

            {/* Dashboard Content */}
            <div className="space-y-6">
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