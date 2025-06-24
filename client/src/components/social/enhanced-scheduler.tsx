import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Facebook, Instagram, Linkedin, Wand2, Settings, AlertCircle, Clock, Smartphone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SocialPlatform {
  id: string;
  name: string;
  icon: any;
  configured: boolean;
  color: string;
  characterLimit: number;
  features: string[];
}

export default function EnhancedScheduler() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState("");
  const [postType, setPostType] = useState("now");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Platform configurations
  const platforms: SocialPlatform[] = [
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      configured: false,
      color: "text-blue-600",
      characterLimit: 63206,
      features: ["Text Posts", "Images", "Videos", "Links", "Events"]
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      configured: false,
      color: "text-pink-600",
      characterLimit: 2200,
      features: ["Images", "Stories", "Reels", "IGTV"]
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      configured: false,
      color: "text-blue-800",
      characterLimit: 3000,
      features: ["Professional Posts", "Articles", "Company Updates"]
    }
  ];

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return apiRequest("/api/social/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Post Scheduled",
        description: "Your post has been scheduled successfully!",
      });
      setContent("");
      setSelectedPlatforms([]);
      setScheduledTime("");
      queryClient.invalidateQueries({ queryKey: ["/api/social/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateIdea = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "social", industry: "field_service" }),
      });
      const data = await response.json();
      setContent(data.topic || "Share a tip about your field service expertise!");
    } catch (error) {
      console.error("Failed to generate idea:", error);
    }
    setIsGenerating(false);
  };

  const handleSchedulePost = async () => {
    if (!content || selectedPlatforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter content and select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      content,
      platforms: selectedPlatforms,
      scheduledTime: scheduledTime || new Date().toISOString(),
      status: postType === "now" ? "published" : "scheduled",
      postType,
    };

    createPostMutation.mutate(postData);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getCharacterCount = () => {
    if (selectedPlatforms.length === 0) return null;
    const limits = selectedPlatforms.map(id => 
      platforms.find(p => p.id === id)?.characterLimit || 0
    );
    const minLimit = Math.min(...limits);
    return { current: content.length, limit: minLimit };
  };

  const charCount = getCharacterCount();

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-hvac-gray flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Social Media Scheduler</span>
          </div>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Mobile Ready</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Platform Configuration Alert */}
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-sm">Social platforms need API credentials to post automatically.</span>
              <Button variant="outline" size="sm">Configure APIs</Button>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {/* Platform Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Select Platforms
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <div
                    key={platform.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => togglePlatform(platform.id)}
                      />
                      <Icon className={`w-4 h-4 ${platform.color}`} />
                      <span className="font-medium text-sm">{platform.name}</span>
                      {!platform.configured && (
                        <AlertCircle className="w-3 h-3 text-orange-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Limit: {platform.characterLimit.toLocaleString()} chars</p>
                      <p className="truncate">{platform.features.join(", ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Creation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Content
              </label>
              {charCount && (
                <span className={`text-xs ${
                  charCount.current > charCount.limit ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {charCount.current} / {charCount.limit.toLocaleString()}
                </span>
              )}
            </div>
            <div className="relative">
              <Textarea
                placeholder="What's happening in your field service business? Share updates, tips, success stories, or behind-the-scenes content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] pr-20"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={generateIdea}
                disabled={isGenerating}
              >
                <Wand2 className="w-4 h-4 mr-1" />
                {isGenerating ? "..." : "Idea"}
              </Button>
            </div>
          </div>

          {/* Scheduling Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Timing
              </label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Post Now</SelectItem>
                  <SelectItem value="schedule">Schedule for Later</SelectItem>
                  <SelectItem value="optimal">Optimal Time (AI Recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {postType === "schedule" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            )}

            {postType === "optimal" && (
              <div className="flex items-center space-x-2 mt-6">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600">AI will choose the best time based on your audience</span>
              </div>
            )}
          </div>

          {/* Post Button */}
          <Button 
            onClick={handleSchedulePost} 
            disabled={createPostMutation.isPending || !content || selectedPlatforms.length === 0 || (charCount && charCount.current > charCount.limit)}
            className="w-full"
          >
            {createPostMutation.isPending ? "Processing..." : 
             postType === "now" ? `Post to ${selectedPlatforms.length} Platform(s)` :
             postType === "schedule" ? "Schedule Post" :
             "Schedule at Optimal Time"}
          </Button>

          {/* Configuration Reminder */}
          {selectedPlatforms.some(id => !platforms.find(p => p.id === id)?.configured) && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800">Platform Setup Required</p>
                  <p className="text-orange-700 mt-1">
                    Selected platforms need API credentials to enable posting. Configure them in Settings to automate posting.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}