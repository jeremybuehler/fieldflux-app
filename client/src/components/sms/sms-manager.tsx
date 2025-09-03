import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SMSTemplate {
  type: string;
  name: string;
  template: string;
  description: string;
}

interface TwilioStatus {
  configured: boolean;
  accountSid: string | null;
  phoneNumber: string | null;
}

export default function SMSManager() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check Twilio configuration status
  const { data: twilioStatus } = useQuery<TwilioStatus>({
    queryKey: ["/api/sms/status"],
  });

  // Get SMS templates
  const { data: templates = [] } = useQuery<SMSTemplate[]>({
    queryKey: ["/api/sms/templates"],
  });

  // Send SMS mutation
  const sendSMSMutation = useMutation({
    mutationFn: async (data: { to: string; message: string; type?: string }) => {
      return apiRequest("POST", "/api/sms/send", data);
    },
    onSuccess: () => {
      toast({
        title: "SMS Sent",
        description: "Your message was sent successfully!",
      });
      setPhoneNumber("");
      setCustomMessage("");
      setSelectedTemplate("");
    },
    onError: (error) => {
      toast({
        title: "SMS Failed",
        description: error.message || "Failed to send SMS",
        variant: "destructive",
      });
    },
  });

  const handleSendSMS = () => {
    if (!phoneNumber || (!customMessage && !selectedTemplate)) {
      toast({
        title: "Missing Information",
        description: "Please enter a phone number and message.",
        variant: "destructive",
      });
      return;
    }

    const message = customMessage || templates.find(t => t.type === selectedTemplate)?.template || "";
    
    sendSMSMutation.mutate({
      to: phoneNumber,
      message,
      type: selectedTemplate || "custom"
    });
  };

  const handleTemplateSelect = (templateType: string) => {
    setSelectedTemplate(templateType);
    const template = templates.find(t => t.type === templateType);
    if (template) {
      setCustomMessage(template.template);
    }
  };

  if (!twilioStatus?.configured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>SMS Communication</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Twilio Not Configured</h3>
            <p className="text-sm text-gray-500 mb-4">
              To enable SMS features, please configure your Twilio credentials in the environment settings.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-blue-900 mb-2">Required Environment Variables:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• TWILIO_ACCOUNT_SID</li>
                <li>• TWILIO_AUTH_TOKEN</li>
                <li>• TWILIO_PHONE_NUMBER</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>SMS Manager</span>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-700">
              Twilio Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Message Template
              </label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Custom Message</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.type} value={template.type}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Message Content
            </label>
            <Textarea
              placeholder="Enter your message here..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use variables like {"{customerName}"}, {"{businessName}"}, {"{serviceType}"} for personalization
            </p>
          </div>

          <Button 
            onClick={handleSendSMS} 
            disabled={sendSMSMutation.isPending}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {sendSMSMutation.isPending ? "Sending..." : "Send SMS"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SMS Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((template) => (
            <div key={template.type} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{template.name}</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTemplateSelect(template.type)}
                >
                  Use Template
                </Button>
              </div>
              <p className="text-xs text-gray-600 mb-2">{template.description}</p>
              <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded">
                {template.template}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {twilioStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Twilio Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account SID:</span>
              <span className="font-mono">{twilioStatus.accountSid}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phone Number:</span>
              <span className="font-mono">{twilioStatus.phoneNumber}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
