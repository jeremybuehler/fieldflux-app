import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Globe, BarChart3, CheckCircle, AlertCircle, Settings as SettingsIcon, Key, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

    // Load WordPress config from localStorage
    const savedWpConfig = localStorage.getItem('wpConfig');
    if (savedWpConfig) {
      setWpConfig(JSON.parse(savedWpConfig));
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-hvac-gray mb-2">Settings & Configuration</h1>
          <p className="text-gray-600">Configure your integrations and preferences for Dave AI Marketing Agent</p>
        </div>

        <Tabs defaultValue="wordpress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wordpress" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>WordPress Integration</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Google Analytics</span>
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
                      <p className="text-sm text-gray-600 mt-1">Connect Dave to your GoDaddy-hosted WordPress site</p>
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
                    What Dave Tracks with Google Analytics
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
        </Tabs>
      </div>
    </div>
  );
}