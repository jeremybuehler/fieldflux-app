import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/dashboard";
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
import Subscribe from "@/pages/subscribe";
import GoDaddy from "@/pages/godaddy";
import PlanetScaleLanding from "@/pages/planetscale-landing";
import Features from "@/pages/features";
import StyleDemo from "@/pages/style-demo";
import NotFound from "@/pages/not-found";
import Felix from "@/pages/felix";

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
      {/* Landing page for unauthenticated users */}
      <Route path="/" component={isAuthenticated ? Felix : Landing} />
      
      {/* Landing page route */}
      <Route path="/landing" component={Landing} />
      
      {/* All authenticated routes go to Felix */}
      {isAuthenticated ? (
        <>
          <Route path="/felix" component={Felix} />
          <Route path="/dashboard" component={Felix} />
          <Route path="/social" component={Felix} />
          <Route path="/leads" component={Felix} />
          <Route path="/reviews" component={Felix} />
          <Route path="/reports" component={Felix} />
          <Route path="/keywords" component={Felix} />
          <Route path="/seo" component={Felix} />
          <Route path="/website" component={Felix} />
          <Route path="/ai-coach" component={Felix} />
          <Route path="/settings" component={Felix} />
          <Route path="/demo" component={Felix} />
          <Route path="/onboarding" component={Felix} />
          <Route path="/pricing" component={Felix} />
          <Route path="/subscribe" component={Felix} />
          <Route path="/features" component={Felix} />
          <Route path="/godaddy" component={Felix} />
          <Route component={Felix} />
        </>
      ) : (
        // Redirect all unauthenticated requests to landing
        <Route component={Landing} />
      )}
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
