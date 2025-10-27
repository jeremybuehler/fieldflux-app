import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Facebook, Instagram, Linkedin, Wand2, Settings, AlertCircle, Clock, Smartphone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/lib/toast-service";
import { socialPostSchema } from "@/lib/validation/schemas/social-post";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(socialPostSchema),
    mode: "onBlur",
    defaultValues: {
      content: "",
      platforms: [],
      scheduledDate: undefined,
      includeImage: false,
    },
  });

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
      const response = await fetch("/api/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error("Failed to schedule post");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Post Scheduled", "Your post has been scheduled successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/social/posts"] });
    },
    onError: (error) => {
      toast.error("Error", "Failed to schedule post. Please try again.");
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
      form.setValue("content", data.topic || "Share a tip about your field service expertise!");
      toast.info("Idea Generated", "AI suggestion added to your post content");
    } catch (error) {
      console.error("Failed to generate idea:", error);
      toast.error("Generation Failed", "Could not generate idea. Please try again.");
    }
    setIsGenerating(false);
  };

  const handleSchedulePost = (data: z.infer<typeof socialPostSchema>) => {
    const postData = {
      content: data.content,
      platforms: data.platforms,
      scheduledTime: data.scheduledDate || new Date().toISOString(),
      status: "scheduled",
      includeImage: data.includeImage,
    };

    createPostMutation.mutate(postData);
  };

  const togglePlatform = (platformId: string) => {
    const currentPlatforms: any[] = form.getValues("platforms") || [];
    if (currentPlatforms.includes(platformId)) {
      form.setValue("platforms", currentPlatforms.filter(id => id !== platformId) as any);
    } else {
      form.setValue("platforms", [...currentPlatforms, platformId] as any);
    }
  };

  const getCharacterCount = () => {
    const selectedPlatforms = form.getValues("platforms");
    const content = form.getValues("content");
    if (selectedPlatforms.length === 0) return null;
    const limits = selectedPlatforms.map(id =>
      platforms.find(p => p.id === id)?.characterLimit || 0
    );
    const minLimit = Math.min(...limits);
    return { current: content.length, limit: minLimit };
  };

  const charCount = getCharacterCount();
  const selectedPlatforms = form.getValues("platforms");
  const content = form.getValues("content");
  const postTypeValue = form.getValues("scheduledDate") ? "schedule" : "now";

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
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Select Platforms
              </label>
              {form.formState.errors.platforms && (
                <span className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{form.formState.errors.platforms.message}</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                // @ts-ignore - Zod array type inference
                const isSelected = selectedPlatforms.includes(platform.id as any);
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
              <div className="flex items-center space-x-2">
                {charCount && (
                  <span className={`text-xs ${
                    charCount.current > charCount.limit ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {charCount.current} / {charCount.limit.toLocaleString()}
                  </span>
                )}
                {form.formState.errors.content && (
                  <span className="text-xs text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{form.formState.errors.content.message}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              <Textarea
                placeholder="What's happening in your field service business? Share updates, tips, success stories, or behind-the-scenes content..."
                value={content}
                onChange={(e) => form.setValue("content", e.target.value)}
                onBlur={() => form.trigger("content")}
                className={`min-h-[120px] pr-20 ${
                  form.formState.errors.content ? 'border-red-500' : ''
                }`}
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
                Post Now or Schedule
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={!form.getValues("scheduledDate")}
                    onChange={(checked) => {
                      if (checked) form.setValue("scheduledDate", undefined);
                    }}
                  />
                  <span className="text-sm">Post immediately</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={!!form.getValues("scheduledDate")}
                    onChange={(checked) => {
                      if (checked) form.setValue("scheduledDate", new Date() as any);
                    }}
                  />
                  <span className="text-sm">Schedule for later</span>
                </label>
              </div>
            </div>

            {form.getValues("scheduledDate") && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={
                    form.getValues("scheduledDate")
                      ? new Date(form.getValues("scheduledDate") as any).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : (undefined as any);
                    form.setValue("scheduledDate", newDate);
                  }}
                  className={form.formState.errors.scheduledDate ? 'border-red-500' : ''}
                />
                {form.formState.errors.scheduledDate && (
                  <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{form.formState.errors.scheduledDate.message}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Post Button */}
          <Button
            onClick={form.handleSubmit(handleSchedulePost)}
            disabled={createPostMutation.isPending || !form.formState.isValid}
            className="w-full"
          >
            {createPostMutation.isPending ? "Processing..." :
             form.getValues("scheduledDate") ? "Schedule Post" :
             `Post to ${selectedPlatforms.length} Platform(s)`}
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