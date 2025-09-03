import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import { Settings as SettingsIcon, ExternalLink, Globe, BarChart3, CheckCircle, AlertCircle, MessageSquare, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Link } from "wouter";
import TopNavigation from "@/components/layout/top-navigation";
import { WhiteLabelSection } from "./settings/sections/WhiteLabelSection";
import { WordPressSection, type WordPressConfig } from "./settings/sections/WordPressSection";
import { AnalyticsSection, type GoogleAnalyticsConfig } from "./settings/sections/AnalyticsSection";
import { TwilioSection, type TwilioConfig } from "./settings/sections/TwilioSection";
import { SocialSection, type SocialConfig } from "./settings/sections/SocialSection";
import { BusinessSection, type BusinessConfig as BusinessSectionConfig } from "./settings/sections/BusinessSection";

interface BusinessConfig {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite: string;
  businessDefaultSearch: string;
  industry: string;
  timezone: string;
  currency: string;
  isConfigured: boolean;
}

interface WhiteLabelConfig {
  clientName: string;
  clientDomain: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  isWhiteLabel: boolean;
  isConfigured: boolean;
}

// SocialConfig is imported from SocialSection

export default function Settings() {
  const [wpConfig, setWpConfig] = useState<WordPressConfig>({
    siteUrl: "",
    username: "",
    appPassword: "",
    isConfigured: false,
  });

  const [gaConfig, setGaConfig] = useState<GoogleAnalyticsConfig>({
    measurementId: "",
    isConfigured: false,
  });

  const [twilioConfig, setTwilioConfig] = useState<TwilioConfig>({
    accountSid: "",
    authToken: "",
    phoneNumber: "",
    isConfigured: false,
  });

  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>({
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    businessWebsite: "",
    businessDefaultSearch: "",
    industry: "",
    timezone: "America/New_York",
    currency: "USD",
    isConfigured: false,
  });

  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig>({
    clientName: "",
    clientDomain: "",
    logoUrl: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#f97316",
    contactEmail: "",
    contactPhone: "",
    isWhiteLabel: false,
    isConfigured: false,
  });

  const [socialConfig, setSocialConfig] = useState<SocialConfig>({
    facebook: {
      appId: "",
      appSecret: "",
      accessToken: "",
      pageId: "",
      isConfigured: false,
    },
    twitter: {
      apiKey: "",
      apiSecret: "",
      accessToken: "",
      accessTokenSecret: "",
      isConfigured: false,
    },
    instagram: {
      accessToken: "",
      businessAccountId: "",
      isConfigured: false,
    },
    linkedin: {
      clientId: "",
      clientSecret: "",
      accessToken: "",
      organizationId: "",
      isConfigured: false,
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    // Check if Google Analytics is already configured
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
      setGaConfig(prev => ({
        ...prev,
        measurementId: gaId,
        isConfigured: true,
      }));
    }

    // Load saved WordPress config from localStorage
    const savedWpConfig = localStorage.getItem('wpConfig');
    if (savedWpConfig) {
      try {
        const parsed = JSON.parse(savedWpConfig);
        setWpConfig(parsed);
      } catch (error) {
        console.error('Failed to parse saved WordPress config:', error);
      }
    }

    trackEvent('settings_page_view', 'navigation', 'settings');
  }, []);

  const handleSaveWordPressConfig = () => {
    if (!wpConfig.siteUrl || !wpConfig.username || !wpConfig.appPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all WordPress configuration fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(wpConfig.siteUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL (e.g., https://yoursite.com)",
        variant: "destructive",
      });
      return;
    }

    const updatedConfig = { ...wpConfig, isConfigured: true };
    setWpConfig(updatedConfig);
    localStorage.setItem('wpConfig', JSON.stringify(updatedConfig));

    toast({
      title: "WordPress Configuration Saved",
      description: "Your GoDaddy WordPress connection has been configured successfully.",
    });

    trackEvent('wordpress_configured', 'settings', 'configuration');
  };

  return (
    <div className="min-h-screen landing-page">
      <TopNavigation title="Settings" />

      <div className="flex min-h-screen">
        <MobileSidebar />

        <main className="flex-1 lg:ml-64">
          <div className="p-4 pt-16 lg:pt-6 lg:pl-6 container-modern">
            <div className="mb-6 lg:mb-8 animate-protocol-fade-in">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold gradient-text">Settings</h1>
                  <p className="text-fieldflux-secondary text-sm lg:text-base">Configure your integrations and preferences</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="wordpress" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="wordpress">WordPress</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="twilio">SMS</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="whitelabel">White-label</TabsTrigger>
              </TabsList>

              {/* WordPress Configuration */}
              {/* WordPress Configuration */}
              <TabsContent value="wordpress" className="space-y-6">
                <WordPressSection wpConfig={wpConfig} setWpConfig={setWpConfig} onSave={handleSaveWordPressConfig} toast={toast} />
              </TabsContent>


              {/* Analytics Configuration */}
              {/* Analytics Configuration */}
              <TabsContent value="analytics" className="space-y-6">
                <AnalyticsSection
                  gaConfig={gaConfig}
                  setGaConfig={setGaConfig}
                  onSave={() => {
                    if (!gaConfig.measurementId) {
                      toast({ title: 'Missing Measurement ID', description: 'Please enter your GA4 measurement ID.', variant: 'destructive' });
                      return;
                    }
                    setGaConfig(prev => ({ ...prev, isConfigured: true }));
                    toast({ title: 'Analytics Configured', description: 'Add VITE_GA_MEASUREMENT_ID to your environment variables (e.g., Vercel Project Settings).' });
                  }}
                  toast={toast}
                />
              </TabsContent>


              {/* Twilio SMS Configuration */}
              {/* Twilio SMS Configuration */}
              <TabsContent value="twilio" className="space-y-6">
                <TwilioSection
                  twilioConfig={twilioConfig}
                  setTwilioConfig={setTwilioConfig}
                  onSave={() => {
                    setTwilioConfig(prev => ({ ...prev, isConfigured: true }));
                    toast({ title: 'Twilio Configuration Saved', description: 'Set environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER' });
                  }}
                  toast={toast}
                />
              </TabsContent>


              {/* Social Media Configuration */}
              {/* Social Media Configuration */}
              <TabsContent value="social" className="space-y-6">
                <SocialSection socialConfig={socialConfig} setSocialConfig={setSocialConfig} />
              </TabsContent>


              {/* Business Configuration */}
              {/* Business Configuration */}
              <TabsContent value="business" className="space-y-6">
                <BusinessSection
                  businessConfig={businessConfig}
                  setBusinessConfig={setBusinessConfig}
                  onSave={() => {
                    setBusinessConfig(prev => ({ ...prev, isConfigured: true }));
                    localStorage.setItem('businessConfig', JSON.stringify({ ...businessConfig, isConfigured: true }));
                    toast({ title: 'Business Configuration Saved', description: 'Your business details have been configured successfully.' });
                  }}
                  toast={toast}
                />
              </TabsContent>


              {/* White-label Configuration */}
              <TabsContent value="whitelabel" className="space-y-6">
                <WhiteLabelSection whiteLabelConfig={whiteLabelConfig} setWhiteLabelConfig={setWhiteLabelConfig} toast={toast} />
              </TabsContent>
              </Tabs>
            </div>
        </main>
      </div>
    </div>
  );
}
