import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { useAuth } from "@/hooks/useAuth";
import Felix from "@/pages/felix";
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
      
      {/* Main Felix interface - primary authenticated experience */}
      <Route path="/felix">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/dashboard">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/app">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      
      {/* Business function routes - all go to Felix canvas interface */}
      <Route path="/social">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/leads">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/reviews">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/analytics">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/keywords">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/website">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/ai-coach">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      <Route path="/settings">
        {isAuthenticated ? <Felix /> : <Landing />}
      </Route>
      
      {/* Marketing pages */}
      <Route path="/demo" component={Demo} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/subscribe" component={Subscribe} />
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
