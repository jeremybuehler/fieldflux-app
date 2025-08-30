import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import TopNav from "@/components/navigation/top-nav";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  Key,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Server,
  Shield,
  Database,
  Link as LinkIcon,
} from "lucide-react";

interface GoDaddyConfig {
  apiKey: string;
  apiSecret: string;
  environment: "production" | "sandbox";
  isConfigured: boolean;
}

interface DomainInfo {
  domain: string;
  status: string;
  expires: string;
  autoRenew: boolean;
  privacy: boolean;
}

export default function GoDaddy() {
  const { toast } = useToast();
  const [config, setConfig] = useState<GoDaddyConfig>({
    apiKey: "",
    apiSecret: "",
    environment: "sandbox",
    isConfigured: false,
  });

  const [domains, setDomains] = useState<DomainInfo[]>([
    {
      domain: "example.com",
      status: "Active",
      expires: "2025-12-31",
      autoRenew: true,
      privacy: true,
    },
  ]);

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSaveConfig = async () => {
    if (!config.apiKey || !config.apiSecret) {
      toast({
        title: "Missing Information",
        description: "Please provide both API Key and Secret",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setConfig(prev => ({ ...prev, isConfigured: true }));
      setConnectionStatus("success");
      setIsConnecting(false);
      toast({
        title: "GoDaddy Connected",
        description: "Successfully connected to GoDaddy API",
      });
    }, 2000);
  };

  const handleTestConnection = async () => {
    if (!config.apiKey || !config.apiSecret) {
      toast({
        title: "Missing Configuration",
        description: "Please configure your API credentials first",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate API test
    setTimeout(() => {
      setConnectionStatus("success");
      setIsConnecting(false);
      toast({
        title: "Connection Test Successful",
        description: "GoDaddy API is responding correctly",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen landing-page">
      <TopNav />
      
      <main className="w-full">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold gradient-text">GoDaddy Configuration</h1>
                <p className="text-sm text-fieldflux-secondary">Connect and manage your GoDaddy domains and services</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
            <Tabs defaultValue="connection" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connection">Connection</TabsTrigger>
                <TabsTrigger value="domains">Domains</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="connection" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Key className="w-5 h-5" />
                      <span>API Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You'll need to create API credentials in your GoDaddy Developer account.
                        <a
                          href="https://developer.godaddy.com/keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          Get API Keys
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          placeholder="Enter your GoDaddy API Key"
                          value={config.apiKey}
                          onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="api-secret">API Secret</Label>
                        <Input
                          id="api-secret"
                          type="password"
                          placeholder="Enter your GoDaddy API Secret"
                          value={config.apiSecret}
                          onChange={(e) => setConfig(prev => ({ ...prev, apiSecret: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Environment</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="sandbox"
                            name="environment"
                            checked={config.environment === "sandbox"}
                            onChange={() => setConfig(prev => ({ ...prev, environment: "sandbox" }))}
                          />
                          <Label htmlFor="sandbox">Sandbox (Testing)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="production"
                            name="environment"
                            checked={config.environment === "production"}
                            onChange={() => setConfig(prev => ({ ...prev, environment: "production" }))}
                          />
                          <Label htmlFor="production">Production</Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={handleSaveConfig}
                        disabled={isConnecting}
                        className="flex items-center space-x-2"
                      >
                        {isConnecting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4" />
                            <span>Save Configuration</span>
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleTestConnection}
                        variant="outline"
                        disabled={isConnecting || !config.apiKey || !config.apiSecret}
                      >
                        Test Connection
                      </Button>

                      {connectionStatus === "success" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Setup Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Create GoDaddy Developer Account</p>
                          <p className="text-gray-600">
                            Sign up at developer.godaddy.com and verify your account
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Generate API Keys</p>
                          <p className="text-gray-600">
                            Create API keys for either sandbox (testing) or production use
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Configure Permissions</p>
                          <p className="text-gray-600">
                            Ensure your API keys have permissions for domain management
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="domains" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Server className="w-5 h-5" />
                      <span>Domain Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!config.isConfigured ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please configure your GoDaddy API connection first to manage domains.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Your Domains</h3>
                          <Button size="sm">
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Add Domain
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {domains.map((domain, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-white">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium">{domain.domain}</h4>
                                  <Badge variant={domain.status === "Active" ? "default" : "secondary"}>
                                    {domain.status}
                                  </Badge>
                                </div>
                                <Button variant="outline" size="sm">
                                  Manage
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Expires:</span> {domain.expires}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">Auto-Renew:</span>
                                  <Switch checked={domain.autoRenew} />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">Privacy:</span>
                                  <Switch checked={domain.privacy} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Advanced Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Domain Auto-Renewal</p>
                          <p className="text-sm text-gray-600">
                            Automatically renew domains before expiration
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">DNS Management</p>
                          <p className="text-sm text-gray-600">
                            Allow FieldPulse to manage DNS records
                          </p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Domain Privacy Protection</p>
                          <p className="text-sm text-gray-600">
                            Enable privacy protection for new domains
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="w-5 h-5" />
                      <span>Webhook Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://your-domain.com/webhook/godaddy"
                        value=""
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-sm text-gray-600">
                        This webhook URL will receive notifications about domain changes
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhook-secret">Webhook Secret</Label>
                      <Input
                        id="webhook-secret"
                        type="password"
                        placeholder="Enter webhook secret for security"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </div>
      </main>
    </div>
  );
}