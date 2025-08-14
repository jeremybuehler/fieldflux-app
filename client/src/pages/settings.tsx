import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import { Globe, BarChart3, CheckCircle, AlertCircle, Settings as SettingsIcon, ExternalLink, ArrowLeft, MessageSquare, Facebook, Twitter, Instagram, Linkedin, Building, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Link } from "wouter";
import TopNavigation from "@/components/layout/top-navigation";

interface WordPressConfig {
  siteUrl: string;
  username: string;
  appPassword: string;
  isConfigured: boolean;
}

interface GoogleAnalyticsConfig {
  measurementId: string;
  isConfigured: boolean;
}

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  isConfigured: boolean;
}

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

interface SocialConfig {
  facebook: {
    appId: string;
    appSecret: string;
    accessToken: string;
    pageId: string;
    isConfigured: boolean;
  };
  twitter: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
    isConfigured: boolean;
  };
  instagram: {
    accessToken: string;
    businessAccountId: string;
    isConfigured: boolean;
  };
  linkedin: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    organizationId: string;
    isConfigured: boolean;
  };
}

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
    clientName: "KasamaAI",
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
              <TabsContent value="wordpress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-6 h-6 text-blue-600" />
                      <div>
                        <CardTitle>WordPress & GoDaddy Integration</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Connect your GoDaddy-hosted WordPress site to publish content automatically
                        </p>
                      </div>
                      {wpConfig.isConfigured && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your WordPress site must have the REST API enabled (WordPress 4.7+). 
                        Create an Application Password in your WordPress dashboard under Users → Profile.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="site-url">WordPress Site URL</Label>
                        <Input
                          id="site-url"
                          placeholder="https://yoursite.com"
                          value={wpConfig.siteUrl}
                          onChange={(e) => setWpConfig(prev => ({ ...prev, siteUrl: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wp-username">WordPress Username</Label>
                        <Input
                          id="wp-username"
                          placeholder="Your WordPress username"
                          value={wpConfig.username}
                          onChange={(e) => setWpConfig(prev => ({ ...prev, username: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="app-password">Application Password</Label>
                      <Input
                        id="app-password"
                        type="password"
                        placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                        value={wpConfig.appPassword}
                        onChange={(e) => setWpConfig(prev => ({ ...prev, appPassword: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">
                        Generate this in WordPress Admin → Users → Your Profile → Application Passwords
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleSaveWordPressConfig} className="flex-1 sm:flex-none">
                        Save Configuration
                      </Button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Log into your WordPress admin dashboard</li>
                        <li>Go to Users → Your Profile</li>
                        <li>Scroll down to "Application Passwords"</li>
                        <li>Enter "FieldFlux" as the application name and click "Add New Application Password"</li>
                        <li>Copy the generated password and paste it above</li>
                        <li>Your site URL should be your main domain (e.g., https://yourbusiness.com)</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Configuration */}
              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                      <div>
                        <CardTitle>Google Analytics Configuration</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Connect Google Analytics 4 to track website performance
                        </p>
                      </div>
                      {gaConfig.isConfigured && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You need a Google Analytics 4 property to track your website performance.
                        Get your Measurement ID from{" "}
                        <a 
                          href="https://analytics.google.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center"
                        >
                          Google Analytics <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="ga-measurement-id">Measurement ID</Label>
                      <Input
                        id="ga-measurement-id"
                        placeholder="G-XXXXXXXXXX"
                        value={gaConfig.measurementId}
                        onChange={(e) => setGaConfig(prev => ({ ...prev, measurementId: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">
                        Your GA4 Measurement ID starts with "G-" followed by 10 characters
                      </p>
                    </div>

                    <Button 
                      onClick={() => {
                        if (!gaConfig.measurementId) {
                          toast({
                            title: "Missing Measurement ID",
                            description: "Please enter your Google Analytics Measurement ID.",
                            variant: "destructive",
                          });
                          return;
                        }

                        setGaConfig(prev => ({ ...prev, isConfigured: true }));
                        toast({
                          title: "Google Analytics Connected",
                          description: "Add VITE_GA_MEASUREMENT_ID to your Replit Secrets to complete setup.",
                        });
                      }}
                      className="w-full lg:w-auto"
                    >
                      Save Analytics Settings
                    </Button>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Setup Instructions:</h4>
                      <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                        <li>Go to Google Analytics and create or select your property</li>
                        <li>Navigate to Admin → Data Streams → Web</li>
                        <li>Select your web stream or create a new one</li>
                        <li>Copy the Measurement ID (starts with G-)</li>
                        <li>Add it to your Replit Secrets as VITE_GA_MEASUREMENT_ID</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Twilio SMS Configuration */}
              <TabsContent value="twilio" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-6 h-6 text-red-600" />
                      <div>
                        <CardTitle>Twilio SMS Configuration</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Configure Twilio for SMS notifications and lead follow-ups
                        </p>
                      </div>
                      {twilioConfig.isConfigured && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You'll need a Twilio account to send SMS messages. Get your credentials from your{" "}
                        <a 
                          href="https://console.twilio.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center"
                        >
                          Twilio Console <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="twilio-sid">Account SID</Label>
                        <Input
                          id="twilio-sid"
                          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          value={twilioConfig.accountSid}
                          onChange={(e) => setTwilioConfig(prev => ({ ...prev, accountSid: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twilio-token">Auth Token</Label>
                        <Input
                          id="twilio-token"
                          type="password"
                          placeholder="Your Auth Token"
                          value={twilioConfig.authToken}
                          onChange={(e) => setTwilioConfig(prev => ({ ...prev, authToken: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twilio-phone">Phone Number</Label>
                      <Input
                        id="twilio-phone"
                        placeholder="+1234567890"
                        value={twilioConfig.phoneNumber}
                        onChange={(e) => setTwilioConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">
                        Your Twilio phone number in E.164 format (e.g., +1234567890)
                      </p>
                    </div>

                    <Button 
                      onClick={() => {
                        setTwilioConfig(prev => ({ ...prev, isConfigured: true }));
                        toast({
                          title: "Twilio Configuration Saved",
                          description: "Add your credentials to Replit Secrets: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER",
                        });
                      }}
                      className="w-full lg:w-auto"
                    >
                      Save Twilio Settings
                    </Button>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Create a Twilio account at console.twilio.com</li>
                        <li>Purchase a phone number for sending SMS</li>
                        <li>Copy your Account SID and Auth Token from the dashboard</li>
                        <li>Add your credentials above and save</li>
                        <li>Set these environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Media Configuration */}
              <TabsContent value="social" className="space-y-6">
                <div className="grid gap-6">
                  {/* Facebook */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Facebook className="w-6 h-6 text-blue-600" />
                        <div>
                          <CardTitle>Facebook Integration</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Connect your Facebook Page for automated posting
                          </p>
                        </div>
                        {socialConfig.facebook.isConfigured && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fb-appid">App ID</Label>
                          <Input
                            id="fb-appid"
                            placeholder="Your Facebook App ID"
                            value={socialConfig.facebook.appId}
                            onChange={(e) => setSocialConfig(prev => ({
                              ...prev,
                              facebook: { ...prev.facebook, appId: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fb-secret">App Secret</Label>
                          <Input
                            id="fb-secret"
                            type="password"
                            placeholder="Your Facebook App Secret"
                            value={socialConfig.facebook.appSecret}
                            onChange={(e) => setSocialConfig(prev => ({
                              ...prev,
                              facebook: { ...prev.facebook, appSecret: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fb-token">Page Access Token</Label>
                          <Input
                            id="fb-token"
                            type="password"
                            placeholder="Your Page Access Token"
                            value={socialConfig.facebook.accessToken}
                            onChange={(e) => setSocialConfig(prev => ({
                              ...prev,
                              facebook: { ...prev.facebook, accessToken: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fb-pageid">Page ID</Label>
                          <Input
                            id="fb-pageid"
                            placeholder="Your Facebook Page ID"
                            value={socialConfig.facebook.pageId}
                            onChange={(e) => setSocialConfig(prev => ({
                              ...prev,
                              facebook: { ...prev.facebook, pageId: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setSocialConfig(prev => ({
                            ...prev,
                            facebook: { ...prev.facebook, isConfigured: true }
                          }));
                          toast({
                            title: "Facebook Connected",
                            description: "Add your credentials to Replit Secrets: FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_ACCESS_TOKEN, FACEBOOK_PAGE_ID",
                          });
                        }}
                        className="w-full lg:w-auto"
                      >
                        Save Facebook Settings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Alert for all social platforms */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      After configuring each platform, add the credentials to your Replit Secrets using the appropriate environment variable names for the integrations to work properly.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              {/* Business Configuration */}
              <TabsContent value="business" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-6 h-6 text-green-600" />
                      <div>
                        <CardTitle>Business Configuration</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Configure your business details and default search preferences
                        </p>
                      </div>
                      {businessConfig.isConfigured && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input
                          id="business-name"
                          placeholder="Your Business Name"
                          value={businessConfig.businessName}
                          onChange={(e) => setBusinessConfig(prev => ({ ...prev, businessName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-industry">Industry</Label>
                        <Input
                          id="business-industry"
                          placeholder="e.g., HVAC, Plumbing, Electrical"
                          value={businessConfig.industry}
                          onChange={(e) => setBusinessConfig(prev => ({ ...prev, industry: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-phone">Business Phone</Label>
                        <Input
                          id="business-phone"
                          placeholder="(555) 123-4567"
                          value={businessConfig.businessPhone}
                          onChange={(e) => setBusinessConfig(prev => ({ ...prev, businessPhone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-email">Business Email</Label>
                        <Input
                          id="business-email"
                          type="email"
                          placeholder="info@yourbusiness.com"
                          value={businessConfig.businessEmail}
                          onChange={(e) => setBusinessConfig(prev => ({ ...prev, businessEmail: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-address">Business Address</Label>
                      <Input
                        id="business-address"
                        placeholder="123 Main Street, City, State 12345"
                        value={businessConfig.businessAddress}
                        onChange={(e) => setBusinessConfig(prev => ({ ...prev, businessAddress: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-website">Business Website</Label>
                      <Input
                        id="business-website"
                        placeholder="https://yourbusiness.com"
                        value={businessConfig.businessWebsite}
                        onChange={(e) => setBusinessConfig(prev => ({ ...prev, businessWebsite: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-default-search">Business Search Default</Label>
                      <Input
                        id="business-default-search"
                        placeholder="Your Business Name + City (e.g., Joe's HVAC Orlando)"
                        value={businessConfig.businessDefaultSearch}
                        onChange={(e) => setBusinessConfig(prev => ({ ...prev, businessDefaultSearch: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">
                        Default search term for Google Places API to find your business reviews
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                          id="timezone"
                          placeholder="America/New_York"
                          value={businessConfig.timezone}
                          onChange={(e) => setBusinessConfig(prev => ({ ...prev, timezone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input
                          id="currency"
                          placeholder="USD"
                          value={businessConfig.currency}
                          onChange={(e) => setBusinessConfig(prev => ({ ...prev, currency: e.target.value }))}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={() => {
                        setBusinessConfig(prev => ({ ...prev, isConfigured: true }));
                        localStorage.setItem('businessConfig', JSON.stringify({ ...businessConfig, isConfigured: true }));
                        toast({
                          title: "Business Configuration Saved",
                          description: "Your business details have been configured successfully.",
                        });
                      }}
                      className="w-full lg:w-auto"
                    >
                      Save Business Configuration
                    </Button>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        The Business Search Default helps the Google Places API find your business for real review data. 
                        Use your exact business name and city as it appears on Google Maps.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* White-label Configuration */}
              <TabsContent value="whitelabel" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <SettingsIcon className="w-6 h-6 text-purple-600" />
                      <div>
                        <CardTitle>White-label & Multi-Client Configuration</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Configure KasamaAI for white-label deployment or multi-client management
                        </p>
                      </div>
                      {whiteLabelConfig.isConfigured && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enable-whitelabel"
                        checked={whiteLabelConfig.isWhiteLabel}
                        onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, isWhiteLabel: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="enable-whitelabel">Enable White-label Mode</Label>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-name">Client/Brand Name</Label>
                        <Input
                          id="client-name"
                          placeholder="Your Agency Name"
                          value={whiteLabelConfig.clientName}
                          onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, clientName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-domain">Client Domain</Label>
                        <Input
                          id="client-domain"
                          placeholder="youragency.com"
                          value={whiteLabelConfig.clientDomain}
                          onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, clientDomain: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo-url">Logo URL</Label>
                      <Input
                        id="logo-url"
                        placeholder="https://yourdomain.com/logo.png"
                        value={whiteLabelConfig.logoUrl}
                        onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primary-color">Primary Brand Color</Label>
                        <Input
                          id="primary-color"
                          type="color"
                          value={whiteLabelConfig.primaryColor}
                          onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondary-color">Secondary Brand Color</Label>
                        <Input
                          id="secondary-color"
                          type="color"
                          value={whiteLabelConfig.secondaryColor}
                          onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Support Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="support@youragency.com"
                          value={whiteLabelConfig.contactEmail}
                          onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Support Phone</Label>
                        <Input
                          id="contact-phone"
                          placeholder="(555) 123-4567"
                          value={whiteLabelConfig.contactPhone}
                          onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, contactPhone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={() => {
                        setWhiteLabelConfig(prev => ({ ...prev, isConfigured: true }));
                        localStorage.setItem('whiteLabelConfig', JSON.stringify({ ...whiteLabelConfig, isConfigured: true }));
                        toast({
                          title: "White-label Configuration Saved",
                          description: "Your white-label configuration has been saved successfully."
                        });
                      }}
                      className="w-full"
                    >
                      Save White-label Configuration
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
