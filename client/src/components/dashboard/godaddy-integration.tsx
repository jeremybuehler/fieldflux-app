import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Globe, Upload, Settings, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { WordPressPost } from "@shared/schema";

interface GoDaddyConfig {
  siteUrl: string;
  username: string;
  appPassword: string;
}

export default function GoDaddyIntegration() {
  const [godaddyConfig, setGoDaddyConfig] = useState<GoDaddyConfig>({
    siteUrl: "",
    username: "",
    appPassword: "",
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts } = useQuery<WordPressPost[]>({
    queryKey: ["/api/wordpress/posts"],
  });

  const publishToGoDaddyMutation = useMutation({
    mutationFn: async ({ postId, config }: { postId: number; config: GoDaddyConfig }) => {
      const response = await apiRequest("POST", "/api/wordpress/publish-to-godaddy", {
        postId,
        godaddyConfig: config,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wordpress/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Published Successfully",
        description: "Post has been published to your GoDaddy WordPress site.",
      });
      trackEvent('godaddy_publish', 'wordpress', 'publish_post');
    },
    onError: () => {
      toast({
        title: "Publication Failed",
        description: "Failed to publish to GoDaddy. Please check your configuration.",
        variant: "destructive",
      });
    },
  });

  const handlePublish = (postId: number) => {
    if (!isConfigured) {
      toast({
        title: "Configuration Required",
        description: "Please configure your GoDaddy connection first.",
        variant: "destructive",
      });
      return;
    }
    publishToGoDaddyMutation.mutate({ postId, config: godaddyConfig });
  };

  const handleSaveConfig = () => {
    if (!godaddyConfig.siteUrl || !godaddyConfig.username || !godaddyConfig.appPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all configuration fields.",
        variant: "destructive",
      });
      return;
    }
    setIsConfigured(true);
    toast({
      title: "Configuration Saved",
      description: "GoDaddy connection has been configured successfully.",
    });
  };

  const draftPosts = posts?.filter(post => post.status === "draft") || [];

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-hvac-gray">
              GoDaddy WordPress
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {isConfigured ? (
              <Badge variant="default" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary">Not Connected</Badge>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>GoDaddy WordPress Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      WordPress Site URL
                    </label>
                    <Input
                      value={godaddyConfig.siteUrl}
                      onChange={(e) => setGoDaddyConfig({ ...godaddyConfig, siteUrl: e.target.value })}
                      placeholder="https://yoursite.com"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your GoDaddy WordPress site URL
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      WordPress Username
                    </label>
                    <Input
                      value={godaddyConfig.username}
                      onChange={(e) => setGoDaddyConfig({ ...godaddyConfig, username: e.target.value })}
                      placeholder="admin"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Application Password
                    </label>
                    <Input
                      type="password"
                      value={godaddyConfig.appPassword}
                      onChange={(e) => setGoDaddyConfig({ ...godaddyConfig, appPassword: e.target.value })}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Generate this in WordPress Admin → Users → Application Passwords
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveConfig}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Save Configuration
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {draftPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No draft posts ready to publish</p>
            <p className="text-xs text-gray-400 mt-1">
              Generate some blog content first, then publish to your GoDaddy site
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Ready to Publish ({draftPosts.length})
            </h4>
            {draftPosts.slice(0, 4).map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-hvac-gray truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {post.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handlePublish(post.id)}
                  disabled={publishToGoDaddyMutation.isPending || !isConfigured}
                  className="bg-primary hover:bg-primary/90 text-white ml-4"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  {publishToGoDaddyMutation.isPending ? "Publishing..." : "Publish"}
                </Button>
              </div>
            ))}
          </div>
        )}

        {!isConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Settings className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Setup Required
                </h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Configure your GoDaddy WordPress connection to publish posts directly to your website.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}