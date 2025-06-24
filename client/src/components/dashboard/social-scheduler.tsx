import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Plus, Facebook, Instagram, Twitter, Lightbulb, RefreshCw, Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { SocialPost } from "@shared/schema";

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "facebook":
      return Facebook;
    case "instagram":
      return Instagram;
    case "twitter":
      return Twitter;
    default:
      return Facebook;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "facebook":
      return "text-blue-600";
    case "instagram":
      return "text-pink-500";
    case "twitter":
      return "text-blue-400";
    default:
      return "text-blue-600";
  }
};

export default function SocialScheduler() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [suggestedTopic, setSuggestedTopic] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery<SocialPost[]>({
    queryKey: ["/api/social/posts"],
  });

  const generatePostMutation = useMutation({
    mutationFn: async ({ topic, platform }: { topic: string; platform: string }) => {
      const response = await apiRequest("POST", "/api/social/generate-post", { topic, platform });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setTopic("");
      setPlatform("");
      setIsGenerating(false);
      toast({
        title: "Social Post Generated",
        description: "Your social media post has been created and scheduled.",
      });
      trackEvent('social_post_generated', 'content', 'ai_generation');
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Failed to generate social post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateIdeaMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/generate-topic", { 
        type: "social",
        industry: "HVAC",
        platform: platform || "general"
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestedTopic(data.topic);
      setShowSuggestion(true);
      setIsGeneratingIdea(false);
      trackEvent('topic_suggestion_generated', 'content', 'social');
    },
    onError: () => {
      setIsGeneratingIdea(false);
      toast({
        title: "Idea Generation Failed",
        description: "Failed to generate topic idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateIdea = () => {
    setIsGeneratingIdea(true);
    generateIdeaMutation.mutate();
  };

  const handleUseSuggestion = () => {
    setTopic(suggestedTopic);
    setShowSuggestion(false);
    trackEvent('topic_suggestion_accepted', 'content', 'social');
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    setSuggestedTopic("");
    trackEvent('topic_suggestion_rejected', 'content', 'social');
  };

  const handleGeneratePost = async () => {
    if (!topic.trim() || !platform) {
      toast({
        title: "Missing Information",
        description: "Please enter a topic and select a platform.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generatePostMutation.mutate({ topic, platform });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "scheduled":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-hvac-orange/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-hvac-orange" />
          </div>
          <CardTitle className="text-lg font-semibold text-hvac-gray">
            Social Scheduler
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No social posts yet</p>
            <p className="text-xs text-gray-400 mt-1">Create your first social media post</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.slice(0, 3).map((post) => {
              const Icon = getPlatformIcon(post.platform);
              const colorClass = getPlatformColor(post.platform);
              
              return (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <Icon className={`w-4 h-4 ${colorClass}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-hvac-gray truncate">
                        {post.content.length > 50 
                          ? `${post.content.substring(0, 50)}...` 
                          : post.content
                        }
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getStatusColor(post.status)} className="text-xs">
                          {post.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {post.scheduledFor 
                            ? new Date(post.scheduledFor).toLocaleDateString()
                            : new Date(post.createdAt!).toLocaleDateString()
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-hvac-orange hover:bg-hvac-orange/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Social Media Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Post Topic
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., HVAC maintenance tips for winter"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Platform
                </label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGeneratePost}
                disabled={isGenerating}
                className="w-full bg-hvac-orange hover:bg-hvac-orange/90"
              >
                {isGenerating ? "Generating..." : "Generate Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
