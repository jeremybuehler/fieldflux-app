import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Building, AlertCircle } from "lucide-react";

export interface BusinessConfig {
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

type ToastFn = (opts: { title: string; description?: string; variant?: "default" | "destructive" | null }) => void;

export function BusinessSection({
  businessConfig,
  setBusinessConfig,
  onSave,
  toast,
}: {
  businessConfig: BusinessConfig;
  setBusinessConfig: React.Dispatch<React.SetStateAction<BusinessConfig>>;
  onSave: () => void;
  toast: ToastFn;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Building className="w-6 h-6 text-amber-600" />
          <div>
            <CardTitle>Business Profile</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Basic information about your business</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" value={businessConfig.businessName}
              onChange={(e) => setBusinessConfig((p) => ({ ...p, businessName: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-phone">Business Phone</Label>
            <Input id="business-phone" value={businessConfig.businessPhone}
              onChange={(e) => setBusinessConfig((p) => ({ ...p, businessPhone: e.target.value }))} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="business-email">Business Email</Label>
            <Input id="business-email" type="email" value={businessConfig.businessEmail}
              onChange={(e) => setBusinessConfig((p) => ({ ...p, businessEmail: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-website">Business Website</Label>
            <Input id="business-website" value={businessConfig.businessWebsite}
              onChange={(e) => setBusinessConfig((p) => ({ ...p, businessWebsite: e.target.value }))} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="business-address">Business Address</Label>
          <Input id="business-address" value={businessConfig.businessAddress}
            onChange={(e) => setBusinessConfig((p) => ({ ...p, businessAddress: e.target.value }))} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business-default-search">Default Search</Label>
          <Input id="business-default-search" placeholder="Your Business Name + City"
            value={businessConfig.businessDefaultSearch}
            onChange={(e) => setBusinessConfig((p) => ({ ...p, businessDefaultSearch: e.target.value }))} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" value={businessConfig.timezone}
              onChange={(e) => setBusinessConfig((p) => ({ ...p, timezone: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" value={businessConfig.currency}
              onChange={(e) => setBusinessConfig((p) => ({ ...p, currency: e.target.value }))} />
          </div>
        </div>

        <Button onClick={onSave} className="w-full lg:w-auto">Save Business Configuration</Button>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The default search helps the Google Places API find your business for real review data.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
