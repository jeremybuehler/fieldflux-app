import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle, AlertCircle } from "lucide-react";

export interface WordPressConfig {
  siteUrl: string;
  username: string;
  appPassword: string;
  isConfigured: boolean;
}

type ToastFn = (opts: { title: string; description?: string; variant?: "default" | "destructive" | null }) => void;

export function WordPressSection({
  wpConfig,
  setWpConfig,
  onSave,
  toast,
}: {
  wpConfig: WordPressConfig;
  setWpConfig: React.Dispatch<React.SetStateAction<WordPressConfig>>;
  onSave: () => void;
  toast: ToastFn;
}) {
  return (
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
            Your WordPress site must have the REST API enabled (WordPress 4.7+). Create an
            Application Password in your WordPress dashboard under Users → Profile.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="site-url">WordPress Site URL</Label>
            <Input
              id="site-url"
              placeholder="https://yoursite.com"
              value={wpConfig.siteUrl}
              onChange={(e) => setWpConfig((prev) => ({ ...prev, siteUrl: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wp-username">WordPress Username</Label>
            <Input
              id="wp-username"
              placeholder="Your WordPress username"
              value={wpConfig.username}
              onChange={(e) => setWpConfig((prev) => ({ ...prev, username: e.target.value }))}
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
            onChange={(e) => setWpConfig((prev) => ({ ...prev, appPassword: e.target.value }))}
          />
        </div>

        <Button onClick={onSave} className="w-full lg:w-auto">
          Save WordPress Settings
        </Button>
      </CardContent>
    </Card>
  );
}
