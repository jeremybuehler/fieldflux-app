import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, CheckCircle } from "lucide-react";

export interface SocialConfig {
  facebook: { appId: string; appSecret: string; accessToken: string; pageId: string; isConfigured: boolean };
  twitter: { apiKey: string; apiSecret: string; accessToken: string; accessTokenSecret: string; isConfigured: boolean };
  instagram: { accessToken: string; businessAccountId: string; isConfigured: boolean };
  linkedin: { clientId: string; clientSecret: string; accessToken: string; organizationId: string; isConfigured: boolean };
}

export function SocialSection({
  socialConfig,
  setSocialConfig,
}: {
  socialConfig: SocialConfig;
  setSocialConfig: React.Dispatch<React.SetStateAction<SocialConfig>>;
}) {
  const anyConnected =
    socialConfig.facebook.isConfigured ||
    socialConfig.twitter.isConfigured ||
    socialConfig.instagram.isConfigured ||
    socialConfig.linkedin.isConfigured;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <Facebook className="w-6 h-6 text-blue-600" />
            <Twitter className="w-6 h-6 text-sky-500" />
            <Instagram className="w-6 h-6 text-pink-500" />
            <Linkedin className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <CardTitle>Social Integrations</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Configure connections for publishing and analytics</p>
          </div>
          {anyConnected && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 inline-flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Facebook */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fb-app-id">Facebook App ID</Label>
            <Input id="fb-app-id" value={socialConfig.facebook.appId}
              onChange={(e) => setSocialConfig((p) => ({ ...p, facebook: { ...p.facebook, appId: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fb-app-secret">Facebook App Secret</Label>
            <Input id="fb-app-secret" type="password" value={socialConfig.facebook.appSecret}
              onChange={(e) => setSocialConfig((p) => ({ ...p, facebook: { ...p.facebook, appSecret: e.target.value } }))} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fb-access-token">Facebook Access Token</Label>
            <Input id="fb-access-token" value={socialConfig.facebook.accessToken}
              onChange={(e) => setSocialConfig((p) => ({ ...p, facebook: { ...p.facebook, accessToken: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fb-page-id">Facebook Page ID</Label>
            <Input id="fb-page-id" value={socialConfig.facebook.pageId}
              onChange={(e) => setSocialConfig((p) => ({ ...p, facebook: { ...p.facebook, pageId: e.target.value } }))} />
          </div>
        </div>

        {/* Twitter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tw-api-key">Twitter API Key</Label>
            <Input id="tw-api-key" value={socialConfig.twitter.apiKey}
              onChange={(e) => setSocialConfig((p) => ({ ...p, twitter: { ...p.twitter, apiKey: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tw-api-secret">Twitter API Secret</Label>
            <Input id="tw-api-secret" type="password" value={socialConfig.twitter.apiSecret}
              onChange={(e) => setSocialConfig((p) => ({ ...p, twitter: { ...p.twitter, apiSecret: e.target.value } }))} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tw-access-token">Twitter Access Token</Label>
            <Input id="tw-access-token" value={socialConfig.twitter.accessToken}
              onChange={(e) => setSocialConfig((p) => ({ ...p, twitter: { ...p.twitter, accessToken: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tw-access-secret">Twitter Access Token Secret</Label>
            <Input id="tw-access-secret" type="password" value={socialConfig.twitter.accessTokenSecret}
              onChange={(e) => setSocialConfig((p) => ({ ...p, twitter: { ...p.twitter, accessTokenSecret: e.target.value } }))} />
          </div>
        </div>

        {/* Instagram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ig-access">Instagram Access Token</Label>
            <Input id="ig-access" value={socialConfig.instagram.accessToken}
              onChange={(e) => setSocialConfig((p) => ({ ...p, instagram: { ...p.instagram, accessToken: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ig-biz">Instagram Business Account ID</Label>
            <Input id="ig-biz" value={socialConfig.instagram.businessAccountId}
              onChange={(e) => setSocialConfig((p) => ({ ...p, instagram: { ...p.instagram, businessAccountId: e.target.value } }))} />
          </div>
        </div>

        {/* LinkedIn */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="li-client-id">LinkedIn Client ID</Label>
            <Input id="li-client-id" value={socialConfig.linkedin.clientId}
              onChange={(e) => setSocialConfig((p) => ({ ...p, linkedin: { ...p.linkedin, clientId: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="li-client-secret">LinkedIn Client Secret</Label>
            <Input id="li-client-secret" type="password" value={socialConfig.linkedin.clientSecret}
              onChange={(e) => setSocialConfig((p) => ({ ...p, linkedin: { ...p.linkedin, clientSecret: e.target.value } }))} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="li-access">LinkedIn Access Token</Label>
            <Input id="li-access" value={socialConfig.linkedin.accessToken}
              onChange={(e) => setSocialConfig((p) => ({ ...p, linkedin: { ...p.linkedin, accessToken: e.target.value } }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="li-org">LinkedIn Organization ID</Label>
            <Input id="li-org" value={socialConfig.linkedin.organizationId}
              onChange={(e) => setSocialConfig((p) => ({ ...p, linkedin: { ...p.linkedin, organizationId: e.target.value } }))} />
          </div>
        </div>

        <Button
          onClick={() => {
            const connected = {
              facebook: { ...socialConfig.facebook, isConfigured: Boolean(socialConfig.facebook.accessToken) },
              twitter: { ...socialConfig.twitter, isConfigured: Boolean(socialConfig.twitter.accessToken) },
              instagram: { ...socialConfig.instagram, isConfigured: Boolean(socialConfig.instagram.accessToken) },
              linkedin: { ...socialConfig.linkedin, isConfigured: Boolean(socialConfig.linkedin.accessToken) },
            } as SocialConfig;
            setSocialConfig(connected);
            try { localStorage.setItem("socialConfig", JSON.stringify(connected)); } catch {}
          }}
          className="w-full lg:w-auto"
        >
          Save Social Settings
        </Button>
      </CardContent>
    </Card>
  );
}

