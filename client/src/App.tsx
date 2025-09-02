import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, lazy, Suspense } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/app-layout";
import DashboardMain from "@/pages/dashboard-main";
import Settings from "@/pages/settings-fixed";
import Landing from "@/pages/planetscale-landing";
import Social from "@/pages/social";
import Leads from "@/pages/leads";
import Reviews from "@/pages/reviews";
import Reports from "@/pages/reports";
import Keywords from "@/pages/keywords";
import SEO from "@/pages/seo";
import Website from "@/pages/website";
import AICoach from "@/pages/ai-coach";
import Demo from "@/pages/demo";
import Onboarding from "@/pages/onboarding";
import Pricing from "@/pages/pricing";
const Subscribe = lazy(() => import("@/pages/subscribe"));
import GoDaddy from "@/pages/godaddy";
import PlanetScaleLanding from "@/pages/planetscale-landing";
import Features from "@/pages/features";
import StyleDemo from "@/pages/style-demo";
import NotFound from "@/pages/not-found";
import About from "@/pages/about";
import Analytics from "@/pages/analytics";

function Router() {
  // Track page views when routes change
  useAnalytics();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FieldFlux...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Landing page - always show for root */}
      <Route path="/" component={Landing} />
      
      {/* Landing page route */}
      <Route path="/landing" component={Landing} />
      
      {/* Authenticated App Routes with Layout */}
      <Route path="/dashboard">
        {isAuthenticated ? (
          <AppLayout>
            <DashboardMain />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/social">
        {isAuthenticated ? (
          <AppLayout>
            <Social />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/leads">
        {isAuthenticated ? (
          <AppLayout>
            <Leads />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/reviews">
        {isAuthenticated ? (
          <AppLayout>
            <Reviews />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/analytics">
        {isAuthenticated ? (
          <AppLayout>
            <Analytics />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/keywords">
        {isAuthenticated ? (
          <AppLayout>
            <Keywords />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/website">
        {isAuthenticated ? (
          <AppLayout>
            <Website />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/ai-coach">
        {isAuthenticated ? (
          <AppLayout>
            <AICoach />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/settings">
        {isAuthenticated ? (
          <AppLayout>
            <Settings />
          </AppLayout>
        ) : <Landing />}
      </Route>
      
      {/* Legacy routes - redirect to dashboard */}
      <Route path="/felix">
        {isAuthenticated ? (
          <AppLayout>
            <DashboardMain />
          </AppLayout>
        ) : <Landing />}
      </Route>
      <Route path="/app">
        {isAuthenticated ? (
          <AppLayout>
            <DashboardMain />
          </AppLayout>
        ) : <Landing />}
      </Route>
      
      {/* Marketing pages */}
      <Route path="/demo" component={Demo} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/subscribe">
        <Suspense>
          <Subscribe />
        </Suspense>
      </Route>
      <Route path="/features" component={Features} />
      <Route path="/about" component={About} />
      <Route path="/godaddy" component={GoDaddy} />
      
      {/* Fallback to landing */}
      <Route component={Landing} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn(
        "Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID",
      );
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
