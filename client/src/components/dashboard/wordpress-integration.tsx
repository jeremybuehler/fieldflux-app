import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Plus, Eye, Lightbulb, RefreshCw, Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { WordPressPost } from "@shared/schema";

export default function WordPressIntegration() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [suggestedTopic, setSuggestedTopic] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery<WordPressPost[]>({
    queryKey: ["/api/wordpress/posts"],
  });

  const generatePostMutation = useMutation({
    mutationFn: async (topic: string) => {
      const response = await apiRequest("POST", "/api/wordpress/generate-post", { topic });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wordpress/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setTopic("");
      setIsGenerating(false);
      toast({
        title: "Blog Post Generated",
        description: "Your HVAC blog post has been created and is ready for review.",
      });
      trackEvent('wordpress_post_generated', 'content', 'ai_generation');
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateIdeaMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/generate-topic", { 
        type: "blog",
        industry: "HVAC"
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestedTopic(data.topic);
      setShowSuggestion(true);
      setIsGeneratingIdea(false);
      trackEvent('topic_suggestion_generated', 'content', 'wordpress');
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
    trackEvent('topic_suggestion_accepted', 'content', 'wordpress');
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    setSuggestedTopic("");
    trackEvent('topic_suggestion_rejected', 'content', 'wordpress');
  };

  const handleGeneratePost = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for the blog post.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generatePostMutation.mutate(topic);
  };

  const handlePreview = (post: WordPressPost) => {
    trackEvent('wordpress_post_preview', 'content', 'post_preview');
    // In a real app, this would open a preview modal or new window
    toast({
      title: "Preview",
      description: `Preview for "${post.title}" would open here.`,
    });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-blue-600" />
          </div>
          <CardTitle className="text-lg font-semibold text-hvac-gray">
            WordPress Updates
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
            <p className="text-sm text-gray-500">No WordPress posts yet</p>
            <p className="text-xs text-gray-400 mt-1">Generate your first HVAC blog post</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-hvac-gray truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={post.status === "published" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {post.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePreview(post)}
                  className="text-primary hover:text-primary/80"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Generate New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate HVAC Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Blog Post Topic
                </label>
                <div className="mt-1 space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Winter HVAC maintenance tips"
                      className="flex-1"
                    />
                    <Button
                      onClick={handleGenerateIdea}
                      disabled={isGeneratingIdea}
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      {isGeneratingIdea ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                      {isGeneratingIdea ? "..." : "Need an idea?"}
                    </Button>
                  </div>
                  
                  {showSuggestion && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">AI Suggestion:</p>
                            <p className="text-sm text-blue-800">{suggestedTopic}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleUseSuggestion}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Use This
                            </Button>
                            <Button
                              onClick={handleGenerateIdea}
                              disabled={isGeneratingIdea}
                              size="sm"
                              variant="outline"
                              className="border-blue-300"
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Try Another
                            </Button>
                            <Button
                              onClick={handleRejectSuggestion}
                              size="sm"
                              variant="ghost"
                            >
                              <X className="w-3 h-3 mr-1" />
                              No Thanks
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              <Button
                onClick={handleGeneratePost}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90"
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
