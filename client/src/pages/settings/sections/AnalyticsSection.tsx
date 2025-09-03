import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart3, CheckCircle, AlertCircle } from "lucide-react";

export interface GoogleAnalyticsConfig {
  measurementId: string;
  isConfigured: boolean;
}

type ToastFn = (opts: { title: string; description?: string; variant?: "default" | "destructive" | null }) => void;

export function AnalyticsSection({
  gaConfig,
  setGaConfig,
  onSave,
  toast,
}: {
  gaConfig: GoogleAnalyticsConfig;
  setGaConfig: React.Dispatch<React.SetStateAction<GoogleAnalyticsConfig>>;
  onSave: () => void;
  toast: ToastFn;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-green-600" />
          <div>
            <CardTitle>Google Analytics</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Connect GA4 to enable reporting</p>
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
            Enter your GA4 Measurement ID (starts with G-) and save.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="ga-id">GA4 Measurement ID</Label>
          <Input
            id="ga-id"
            placeholder="G-XXXXXXXXXX"
            value={gaConfig.measurementId}
            onChange={(e) => setGaConfig((prev) => ({ ...prev, measurementId: e.target.value }))}
          />
        </div>

        <Button onClick={onSave} className="w-full lg:w-auto">
          Save Analytics Settings
        </Button>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
            <li>Go to Google Analytics and select your property</li>
            <li>Admin → Data Streams → Web</li>
            <li>Copy the Measurement ID (starts with G-)</li>
            <li>Add it to your environment variables as VITE_GA_MEASUREMENT_ID</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
