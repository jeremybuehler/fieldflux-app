import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  isConfigured: boolean;
}

type ToastFn = (opts: { title: string; description?: string; variant?: "default" | "destructive" | null }) => void;

export function TwilioSection({
  twilioConfig,
  setTwilioConfig,
  onSave,
  toast,
}: {
  twilioConfig: TwilioConfig;
  setTwilioConfig: React.Dispatch<React.SetStateAction<TwilioConfig>>;
  onSave: () => void;
  toast: ToastFn;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
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
            You'll need a Twilio account to send SMS messages. Get your credentials from your
            <a
              href="https://console.twilio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              &nbsp;Twilio Console <ExternalLink className="w-3 h-3 ml-1" />
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
              onChange={(e) => setTwilioConfig((prev) => ({ ...prev, accountSid: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twilio-token">Auth Token</Label>
            <Input
              id="twilio-token"
              type="password"
              placeholder="Your Auth Token"
              value={twilioConfig.authToken}
              onChange={(e) => setTwilioConfig((prev) => ({ ...prev, authToken: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="twilio-phone">Phone Number</Label>
          <Input
            id="twilio-phone"
            placeholder="+1234567890"
            value={twilioConfig.phoneNumber}
            onChange={(e) => setTwilioConfig((prev) => ({ ...prev, phoneNumber: e.target.value }))}
          />
          <p className="text-xs text-gray-500">
            Your Twilio phone number in E.164 format (e.g., +1234567890)
          </p>
        </div>

        <Button onClick={onSave} className="w-full lg:w-auto">
          Save Twilio Settings
        </Button>
      </CardContent>
    </Card>
  );
}
