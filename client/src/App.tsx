import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/dashboard-simple";
import Settings from "@/pages/settings-fixed";
import Landing from "@/pages/landing-auth";
import Social from "@/pages/social";
import Leads from "@/pages/leads";
import Reviews from "@/pages/reviews";
import Reports from "@/pages/reports";
import Keywords from "@/pages/keywords";
import SEO from "@/pages/seo";
import Website from "@/pages/website";
import AICoach from "@/pages/ai-coach";
import GoDaddy from "@/pages/godaddy";
import NotFound from "@/pages/not-found";

function Router() {
  // Track page views when routes change
  useAnalytics();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Landing page - always accessible */}
      <Route path="/" component={Landing} />
      
      {/* Protected routes - require authentication */}
      {isAuthenticated ? (
        <>
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
        </>
      ) : (
        /* Redirect unauthenticated users to landing for protected routes */
        <Route path="/dashboard" component={Landing} />
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
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
