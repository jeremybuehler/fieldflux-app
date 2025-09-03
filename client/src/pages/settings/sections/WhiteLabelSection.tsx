import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, CheckCircle } from "lucide-react";

type ToastFn = (opts: { title: string; description?: string; variant?: "default" | "destructive" | null }) => void;

export interface WhiteLabelConfig {
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

export function WhiteLabelSection({
  whiteLabelConfig,
  setWhiteLabelConfig,
  toast,
}: {
  whiteLabelConfig: WhiteLabelConfig;
  setWhiteLabelConfig: React.Dispatch<React.SetStateAction<WhiteLabelConfig>>;
  toast: ToastFn;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <SettingsIcon className="w-6 h-6 text-purple-600" />
          <div>
            <CardTitle>White-label & Multi-Client Configuration</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Configure FieldFlux for white-label deployment or multi-client management
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
            onChange={(e) => setWhiteLabelConfig((prev) => ({ ...prev, isWhiteLabel: e.target.checked }))}
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
              onChange={(e) => setWhiteLabelConfig((prev) => ({ ...prev, clientName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-domain">Client Domain</Label>
            <Input
              id="client-domain"
              placeholder="youragency.com"
              value={whiteLabelConfig.clientDomain}
              onChange={(e) => setWhiteLabelConfig((prev) => ({ ...prev, clientDomain: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo-url">Logo URL</Label>
          <Input
            id="logo-url"
            placeholder="https://yourdomain.com/logo.png"
            value={whiteLabelConfig.logoUrl}
            onChange={(e) => setWhiteLabelConfig((prev) => ({ ...prev, logoUrl: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Brand Color</Label>
            <Input
              id="primary-color"
              type="color"
              value={whiteLabelConfig.primaryColor}
              onChange={(e) => setWhiteLabelConfig((prev) => ({ ...prev, primaryColor: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary-color">Secondary Brand Color</Label>
            <Input
              id="secondary-color"
              type="color"
              value={whiteLabelConfig.secondaryColor}
              onChange={(e) => setWhiteLabelConfig((prev) => ({ ...prev, secondaryColor: e.target.value }))}
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
              onChange={(e) => setWhiteLabelConfig((prev) => ({ ...prev, contactEmail: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Support Phone</Label>
            <Input
              id="contact-phone"
              placeholder="(555) 123-4567"
              value={whiteLabelConfig.contactPhone}
              onChange={(e) => setWhiteLabelConfig((prev) => ({ ...prev, contactPhone: e.target.value }))}
            />
          </div>
        </div>

        <Button
          onClick={() => {
            setWhiteLabelConfig((prev) => ({ ...prev, isConfigured: true }));
            try {
              localStorage.setItem(
                "whiteLabelConfig",
                JSON.stringify({ ...whiteLabelConfig, isConfigured: true }),
              );
            } catch {}
            toast({
              title: "White-label Configuration Saved",
              description: "Your white-label configuration has been saved successfully.",
            });
          }}
          className="w-full"
        >
          Save White-label Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
