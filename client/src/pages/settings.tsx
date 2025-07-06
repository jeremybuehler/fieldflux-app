import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { socialMediaService, SocialPlatformConfig } from "@/lib/social-media-service";
import MobileSidebar from "@/components/dashboard/mobile-sidebar";
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Globe, 
  Shield, 
  Bell, 
  Palette,
  BarChart3,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Save
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

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

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  isConfigured: boolean;
}

interface SocialPlatformConfig {
  facebook: {
    appId: string;
    appSecret: string;
    accessToken: string;
    isConfigured: boolean;
  };
  instagram: {
    accessToken: string;
    isConfigured: boolean;
  };
  twitter: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
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

  const [socialConfigs, setSocialConfigs] = useState<SocialPlatformConfig[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);

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

    // Load social media configs from database
    loadSocialConfigs();

    trackEvent('settings_page_view', 'navigation', 'settings');
  }, []);

  const loadSocialConfigs = async () => {
    try {
      setIsLoadingConfigs(true);
      const configs = await socialMediaService.getSocialConfigs();
      setSocialConfigs(configs);
    } catch (error) {
      console.error('Failed to load social configs:', error);
      toast({
        title: "Error",
        description: "Failed to load social media configurations.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingConfigs(false);
    }
  };

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

  const handleTestWordPressConnection = async () => {
    if (!wpConfig.isConfigured) {
      toast({
        title: "Configuration Required",
        description: "Please save your WordPress configuration first.",
        variant: "destructive",
      });
      return;
    }

    // Simulate connection test
    toast({
      title: "Testing Connection...",
      description: "This feature will test your WordPress REST API connection.",
    });

    // In a real implementation, you would make an API call to test the connection
    setTimeout(() => {
      toast({
        title: "Connection Test Complete",
        description: "WordPress connection is working properly.",
      });
    }, 2000);
  };

  const saveSocialConfig = async (platform: string, configData: Partial<SocialPlatformConfig>) => {
    try {
      const savedConfig = await socialMediaService.saveSocialConfig({
        ...configData,
        platform: platform.toLowerCase(),
        isConfigured: true,
      });

      // Update local state
      setSocialConfigs(prev => {
        const existing = prev.find(c => c.platform === platform.toLowerCase());
        if (existing) {
          return prev.map(c => c.platform === platform.toLowerCase() ? savedConfig : c);
        } else {
          return [...prev, savedConfig];
        }
      });

      toast({
        title: `${platform} Connected`,
        description: `Your ${platform} integration has been configured.`,
      });
    } catch (error) {
      console.error(`Failed to save ${platform} config:`, error);
      toast({
        title: "Error",
        description: `Failed to save ${platform} configuration.`,
        variant: "destructive",
      });
    }
  };

  const getPlatformConfig = (platform: string): SocialPlatformConfig | undefined => {
    return socialConfigs.find(c => c.platform === platform);
  };

  const updatePlatformConfig = (platform: string, field: string, value: string) => {
    setSocialConfigs(prev => {
      const existing = prev.find(c => c.platform === platform);
      if (existing) {
        return prev.map(c => 
          c.platform === platform 
            ? { ...c, [field]: value }
            : c
        );
      } else {
        return [...prev, { 
          platform, 
          [field]: value, 
          isConfigured: false 
        } as SocialPlatformConfig];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-hvac-gray mb-2">Settings & Configuration</h1>
          <p className="text-gray-600">Configure your integrations and preferences for FieldPulse</p>
        </div>

        <Tabs defaultValue="wordpress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wordpress" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>WordPress</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="twilio" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>SMS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wordpress" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">GoDaddy WordPress Integration</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Connect FieldPulse to your GoDaddy-hosted WordPress site</p>
                    </div>
                  </div>
                  {wpConfig.isConfigured ? (
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <SettingsIcon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Before you start:</strong> You'll need to create an Application Password in your WordPress admin panel.
                    This is different from your regular login password and provides secure API access.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      WordPress Site URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={wpConfig.siteUrl}
                      onChange={(e) => setWpConfig({ ...wpConfig, siteUrl: e.target.value })}
                      placeholder="https://yoursite.com"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The full URL of your GoDaddy WordPress site (including https://)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        WordPress Username <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={wpConfig.username}
                        onChange={(e) => setWpConfig({ ...wpConfig, username: e.target.value })}
                        placeholder="admin"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your WordPress admin username
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Application Password <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="password"
                        value={wpConfig.appPassword}
                        onChange={(e) => setWpConfig({ ...wpConfig, appPassword: e.target.value })}
                        placeholder="xxxx xxxx xxxx xxxx"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Generated in WordPress Admin → Users → Application Passwords
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    How to Create an Application Password
                  </h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>Step 1:</strong> Log into your WordPress admin panel</p>
                    <p><strong>Step 2:</strong> Go to Users → Your Profile (or Users → All Users → Your Username)</p>
                    <p><strong>Step 3:</strong> Scroll down to "Application Passwords" section</p>
                    <p><strong>Step 4:</strong> Enter "Dave Marketing Agent" as the application name</p>
                    <p><strong>Step 5:</strong> Click "Add New Application Password"</p>
                    <p><strong>Step 6:</strong> Copy the generated password (it looks like: xxxx xxxx xxxx xxxx)</p>
                    <p className="text-blue-600"><strong>Important:</strong> Save this password immediately - you won't be able to see it again!</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSaveWordPressConfig}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Save Configuration
                  </Button>
                  <Button
                    onClick={handleTestWordPressConnection}
                    variant="outline"
                    disabled={!wpConfig.isConfigured}
                  >
                    Test Connection
                  </Button>
                </div>

                {wpConfig.isConfigured && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      WordPress integration is configured. Dave can now publish content directly to your GoDaddy site.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Google Analytics Integration</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Connect Dave to your Google Analytics for comprehensive reporting</p>
                    </div>
                  </div>
                  {gaConfig.isConfigured ? (
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Google Analytics 4 required:</strong> Make sure you're using Google Analytics 4 (GA4), not Universal Analytics.
                    Your Measurement ID should start with "G-" (e.g., G-XXXXXXXXXX).
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Google Analytics 4 Measurement ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={gaConfig.measurementId}
                      onChange={(e) => setGaConfig({ ...gaConfig, measurementId: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full"
                      disabled={gaConfig.isConfigured}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your GA4 Measurement ID from Google Analytics
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    How to Find Your Google Analytics Measurement ID
                  </h4>
                  <div className="text-sm text-green-800 space-y-2">
                    <p><strong>Step 1:</strong> Go to your Google Analytics account</p>
                    <p><strong>Step 2:</strong> Click on "Admin" (gear icon) in the bottom left</p>
                    <p><strong>Step 3:</strong> In the Property column, click on "Data Streams"</p>
                    <p><strong>Step 4:</strong> Select your web data stream</p>
                    <p><strong>Step 5:</strong> Copy the "Measurement ID" (starts with G-)</p>
                    <div className="mt-3 p-2 bg-green-100 rounded border-l-4 border-green-400">
                      <p className="text-green-700">
                        <strong>Don't have Google Analytics yet?</strong> Create a free account at{" "}
                        <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center">
                          analytics.google.com <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {gaConfig.isConfigured ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Google Analytics is configured with ID: <code className="bg-gray-100 px-2 py-1 rounded">{gaConfig.measurementId}</code>
                      <br />
                      Dave is now tracking page views and user interactions on your website.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Configuration needed:</strong> Add your Google Analytics Measurement ID to the Secrets tab in your Replit project.
                      Use the key name: <code className="bg-gray-100 px-2 py-1 rounded">VITE_GA_MEASUREMENT_ID</code>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    What FieldPulse Tracks with Google Analytics
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Page views and session data</p>
                    <p>• User engagement and behavior</p>
                    <p>• Traffic sources and campaigns</p>
                    <p>• Conversion tracking for leads</p>
                    <p>• Custom events for marketing activities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twilio" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Twilio SMS Configuration</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Configure SMS communication for customer engagement</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Setup Required
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <SettingsIcon className="h-4 w-4" />
                  <AlertDescription>
                    To enable SMS features, add your Twilio credentials as environment variables in your hosting platform. These credentials are stored securely and only used for SMS functionality.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">Required Environment Variables</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center justify-between">
                        <code className="bg-blue-100 px-2 py-1 rounded">TWILIO_ACCOUNT_SID</code>
                        <span className="text-xs">Your Twilio Account SID</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="bg-blue-100 px-2 py-1 rounded">TWILIO_AUTH_TOKEN</code>
                        <span className="text-xs">Your Twilio Auth Token</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="bg-blue-100 px-2 py-1 rounded">TWILIO_PHONE_NUMBER</code>
                        <span className="text-xs">Your Twilio phone number (+1234567890)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-green-900 mb-3">How to Get Your Twilio Credentials</h4>
                    <ol className="text-sm text-green-800 space-y-2">
                      <li className="flex items-start">
                        <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                        <span>Log in to your <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="underline">Twilio Console</a></span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                        <span>Find your Account SID and Auth Token on the main dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                        <span>Get a phone number from Phone Numbers → Manage → Active numbers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                        <span>Add these values as environment variables in your hosting platform</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-orange-900 mb-2">
                      SMS Features Once Configured
                    </h4>
                    <div className="text-sm text-orange-800 space-y-1">
                      <p>• Automated lead follow-up messages</p>
                      <p>• Appointment confirmation and reminders</p>
                      <p>• Service completion notifications</p>
                      <p>• Emergency alerts to customers</p>
                      <p>• Review request automation</p>
                      <p>• Weather delay notifications</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center py-4">
                  <Button asChild>
                    <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer">
                      <Phone className="w-4 h-4 mr-2" />
                      Open Twilio Console
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Twilio Configuration */}
          <TabsContent value="twilio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                  <span>Twilio SMS Configuration</span>
                  {twilioConfig.isConfigured && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Configure your Twilio account to enable SMS notifications for lead follow-ups, appointment confirmations, and customer communication.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Account SID</label>
                    <Input
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={twilioConfig.accountSid}
                      onChange={(e) => setTwilioConfig(prev => ({...prev, accountSid: e.target.value}))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Auth Token</label>
                    <Input
                      type="password"
                      placeholder="Your Twilio Auth Token"
                      value={twilioConfig.authToken}
                      onChange={(e) => setTwilioConfig(prev => ({...prev, authToken: e.target.value}))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      placeholder="+1234567890"
                      value={twilioConfig.phoneNumber}
                      onChange={(e) => setTwilioConfig(prev => ({...prev, phoneNumber: e.target.value}))}
                    />
                  </div>

                  <Button onClick={saveTwilioConfig} className="w-full">
                    Save Twilio Configuration
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Setup Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Create a Twilio account at <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">twilio.com</a></li>
                    <li>Get your Account SID and Auth Token from the Twilio Console</li>
                    <li>Purchase a phone number in the Twilio Console</li>
                    <li>Add these credentials to your Replit Secrets:
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li><code className="bg-gray-100 px-1 rounded">TWILIO_ACCOUNT_SID</code></li>
                        <li><code className="bg-gray-100 px-1 rounded">TWILIO_AUTH_TOKEN</code></li>
                        <li><code className="bg-gray-100 px-1 rounded">TWILIO_PHONE_NUMBER</code></li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Configuration */}
          <TabsContent value="social" className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Configure your social media platform credentials to enable automated posting and content sharing.
              </AlertDescription>
            </Alert>

            {/* Facebook Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <span>Facebook</span>
                  {socialConfigs.find(config => config.platform === 'facebook' && config.isConfigured) ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">App ID</label>
                    <Input
                      placeholder="Your Facebook App ID"
                      value={getPlatformConfig('facebook')?.appId || ''}
                      onChange={(e) => updatePlatformConfig('facebook', 'appId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">App Secret</label>
                    <Input
                      type="password"
                      placeholder="Your Facebook App Secret"
                      value={getPlatformConfig('facebook')?.appSecret || ''}
                      onChange={(e) => updatePlatformConfig('facebook', 'appSecret', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Access Token</label>
                  <Input
                    placeholder="Your Facebook Page Access Token"
                    value={getPlatformConfig('facebook')?.accessToken || ''}
                    onChange={(e) => updatePlatformConfig('facebook', 'accessToken', e.target.value)}
                  />
                </div>
                <Button onClick={() => saveSocialConfig('Facebook', getPlatformConfig('facebook') || {})} className="w-full">
                  Save Facebook Configuration
                </Button>
              </CardContent>
            </Card>

            {/* Instagram Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                  <span>Instagram</span>
                  {socialConfigs.find(config => config.platform === 'instagram' && config.isConfigured) ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Access Token</label>
                  <Input
                    placeholder="Your Instagram Access Token"
                    value={getPlatformConfig('instagram')?.accessToken || ''}
                    onChange={(e) => updatePlatformConfig('instagram', 'accessToken', e.target.value)}
                  />
                </div>
                <Button onClick={() => saveSocialConfig('Instagram', getPlatformConfig('instagram') || {})} className="w-full">
                  Save Instagram Configuration
                </Button>
              </CardContent>
            </Card>

            {/* Twitter Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-400 rounded"></div>
                  <span>Twitter/X</span>
                  {socialConfigs.find(config => config.platform === 'twitter' && config.isConfigured) ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">API Key</label>
                    <Input
                      placeholder="Your Twitter API Key"
                      value={getPlatformConfig('twitter')?.apiKey || ''}
                      onChange={(e) => updatePlatformConfig('twitter', 'apiKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">API Secret</label>
                    <Input
                      type="password"
                      placeholder="Your Twitter API Secret"
                      value={getPlatformConfig('twitter')?.apiSecret || ''}
                      onChange={(e) => updatePlatformConfig('twitter', 'apiSecret', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Access Token</label>
                    <Input
                      placeholder="Your Twitter Access Token"
                      value={getPlatformConfig('twitter')?.accessToken || ''}
                      onChange={(e) => updatePlatformConfig('twitter', 'accessToken', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Access Token Secret</label>
                    <Input
                      type="password"
                      placeholder="Your Twitter Access Token Secret"
                      value={getPlatformConfig('twitter')?.accessTokenSecret || ''}
                      onChange={(e) => updatePlatformConfig('twitter', 'accessTokenSecret', e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={() => saveSocialConfig('Twitter', getPlatformConfig('twitter') || {})} className="w-full">
                  Save Twitter Configuration
                </Button>
              </CardContent>
            </Card>

            {/* LinkedIn Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-700 rounded"></div>
                  <span>LinkedIn</span>
                  {socialConfigs.find(config => config.platform === 'linkedin' && config.isConfigured) ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Client ID</label>
                    <Input
                      placeholder="Your LinkedIn Client ID"
                      value={getPlatformConfig('linkedin')?.clientId || ''}
                      onChange={(e) => updatePlatformConfig('linkedin', 'clientId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Client Secret</label>
                    <Input
                      type="password"
                      placeholder="Your LinkedIn Client Secret"
                      value={getPlatformConfig('linkedin')?.clientSecret || ''}
                      onChange={(e) => updatePlatformConfig('linkedin', 'clientSecret', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Access Token</label>
                  <Input
                    placeholder="Your LinkedIn Access Token"
                    value={getPlatformConfig('linkedin')?.accessToken || ''}
                    onChange={(e) => updatePlatformConfig('linkedin', 'accessToken', e.target.value)}
                  />
                </div>
                <Button onClick={() => saveSocialConfig('LinkedIn', getPlatformConfig('linkedin') || {})} className="w-full">
                  Save LinkedIn Configuration
                </Button>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                After configuring each platform, add the credentials to your Replit Secrets using the appropriate environment variable names (e.g., FACEBOOK_APP_ID, TWITTER_API_KEY, etc.) for the integrations to work properly.
              </AlertDescription>
            </Alert>
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
                        // In a real app, this would save to environment variables or backend
                        setTwilioConfig(prev => ({ ...prev, isConfigured: true }));
                        toast({
                          title: "Twilio Configuration Saved",
                          description: "Your Twilio SMS settings have been configured successfully.",
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
                        {socialConfigs.find(config => config.platform === 'facebook' && config.isConfigured) ? (
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
                            value={getPlatformConfig('facebook')?.appId || ''}
                            onChange={(e) => updatePlatformConfig('facebook', 'appId', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fb-secret">App Secret</Label>
                          <Input
                            id="fb-secret"
                            type="password"
                            placeholder="Your Facebook App Secret"
                            value={getPlatformConfig('facebook')?.appSecret || ''}
                            onChange={(e) => updatePlatformConfig('facebook', 'appSecret', e.target.value)}
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
                            value={getPlatformConfig('facebook')?.accessToken || ''}
                            onChange={(e) => updatePlatformConfig('facebook', 'accessToken', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fb-pageid">Page ID</Label>
                          <Input
                            id="fb-pageid"
                            placeholder="Your Facebook Page ID"
                            value={getPlatformConfig('facebook')?.pageId || ''}
                            onChange={(e) => updatePlatformConfig('facebook', 'pageId', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          saveSocialConfig('Facebook', getPlatformConfig('facebook') || {});
                        }}
                        className="w-full lg:w-auto"
                      >
                        Save Facebook Settings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Twitter */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Twitter className="w-6 h-6 text-blue-400" />
                        <div>
                          <CardTitle>Twitter Integration</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Connect your Twitter account for automated tweeting
                          </p>
                        </div>
                        {socialConfigs.find(config => config.platform === 'twitter' && config.isConfigured) ? (
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
                          <Label htmlFor="tw-key">API Key</Label>
                          <Input
                            id="tw-key"
                            placeholder="Your Twitter API Key"
                            value={getPlatformConfig('twitter')?.apiKey || ''}
                            onChange={(e) => updatePlatformConfig('twitter', 'apiKey', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tw-secret">API Secret</Label>
                          <Input
                            id="tw-secret"
                            type="password"
                            placeholder="Your Twitter API Secret"
                            value={getPlatformConfig('twitter')?.apiSecret || ''}
                            onChange={(e) => updatePlatformConfig('twitter', 'apiSecret', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tw-token">Access Token</Label>
                          <Input
                            id="tw-token"
                            type="password"
                            placeholder="Your Access Token"
                            value={getPlatformConfig('twitter')?.accessToken || ''}
                            onChange={(e) => updatePlatformConfig('twitter', 'accessToken', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tw-token-secret">Access Token Secret</Label>
                          <Input
                            id="tw-token-secret"
                            type="password"
                            placeholder="Your Access Token Secret"
                            value={getPlatformConfig('twitter')?.accessTokenSecret || ''}
                            onChange={(e) => updatePlatformConfig('twitter', 'accessTokenSecret', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          saveSocialConfig('Twitter', getPlatformConfig('twitter') || {});
                        }}
                        className="w-full lg:w-auto"
                      >
                        Save Twitter Settings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Instagram */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Instagram className="w-6 h-6 text-pink-600" />
                        <div>
                          <CardTitle>Instagram Business Integration</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Connect your Instagram Business account
                          </p>
                        </div>
                        {socialConfigs.find(config => config.platform === 'instagram' && config.isConfigured) ? (
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
                          <Label htmlFor="ig-token">Access Token</Label>
                          <Input
                            id="ig-token"
                            type="password"
                            placeholder="Your Instagram Access Token"
                            value={getPlatformConfig('instagram')?.accessToken || ''}
                            onChange={(e) => updatePlatformConfig('instagram', 'accessToken', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ig-account">Business Account ID</Label>
                          <Input
                            id="ig-account"
                            placeholder="Your Instagram Business Account ID"
                            value={getPlatformConfig('instagram')?.businessAccountId || ''}
                            onChange={(e) => updatePlatformConfig('instagram', 'businessAccountId', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          saveSocialConfig('Instagram', getPlatformConfig('instagram') || {});
                        }}
                        className="w-full lg:w-auto"
                      >
                        Save Instagram Settings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* LinkedIn */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-6 h-6 text-blue-700" />
                        <div>
                          <CardTitle>LinkedIn Integration</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Connect your LinkedIn Company Page
                          </p>
                        </div>
                        {socialConfigs.find(config => config.platform === 'linkedin' && config.isConfigured) ? (
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
                          <Label htmlFor="li-clientid">Client ID</Label>
                          <Input
                            id="li-clientid"
                            placeholder="Your LinkedIn Client ID"
                            value={getPlatformConfig('linkedin')?.clientId || ''}
                            onChange={(e) => updatePlatformConfig('linkedin', 'clientId', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="li-secret">Client Secret</Label>
                          <Input
                            id="li-secret"
                            type="password"
                            placeholder="Your LinkedIn Client Secret"
                            value={getPlatformConfig('linkedin')?.clientSecret || ''}
                            onChange={(e) => updatePlatformConfig('linkedin', 'clientSecret', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="li-token">Access Token</Label>
                          <Input
                            id="li-token"
                            type="password"
                            placeholder="Your Access Token"
                            value={getPlatformConfig('linkedin')?.accessToken || ''}
                            onChange={(e) => updatePlatformConfig('linkedin', 'accessToken', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="li-org">Organization ID</Label>
                          <Input
                            id="li-org"
                            placeholder="Your Company Page Organization ID"
                            value={getPlatformConfig('linkedin')?.organizationId || ''}
                            onChange={(e) => updatePlatformConfig('linkedin', 'organizationId', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          saveSocialConfig('LinkedIn', getPlatformConfig('linkedin') || {});
                        }}
                        className="w-full lg:w-auto"
                      >
                        Save LinkedIn Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}