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
import StyleDemo from "@/pages/style-demo";
import NotFound from "@/pages/not-found";

function Router() {
  // Track page views when routes change
  useAnalytics();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Landing page - always accessible */}
      <Route path="/" component={Landing} />

      {/* Demo page - accessible to everyone */}
      <Route path="/demo" component={Demo} />

      {/* Onboarding page - accessible to everyone */}
      <Route path="/onboarding" component={Onboarding} />

      {/* Pricing page - accessible to everyone */}
      <Route path="/pricing" component={Pricing} />

      {/* Subscribe page - accessible to everyone */}
      <Route path="/subscribe" component={Subscribe} />

      {/* Style Demo page - accessible to everyone */}
      <Route path="/style-demo" component={StyleDemo} />
      
      {/* PlanetScale-inspired landing page */}
      <Route path="/planetscale" component={PlanetScaleLanding} />

      {/* Temporarily disable auth check for development - allow access to dashboard */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/social" component={Social} />
      <Route path="/leads" component={Leads} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/reports" component={Reports} />
      <Route path="/keywords" component={Keywords} />
      <Route path="/seo" component={SEO} />
      <Route path="/website" component={Website} />
      <Route path="/ai-coach" component={AICoach} />
      <Route path="/godaddy" component={GoDaddy} />
      <Route path="/settings" component={Settings} />

      <Route component={NotFound} />
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
