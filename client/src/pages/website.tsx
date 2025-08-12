import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import TopNavigation from "@/components/layout/top-navigation";
import LandingPageChat from "@/components/landing-page-generator/chat-interface";
import { ResponsivePreview } from "@/components/landing-page-generator/responsive-preview";
import { 
  Code, 
  FileText, 
  Image, 
  Video, 
  Globe, 
  Zap, 
  TrendingUp, 
  Eye, 
  Calendar,
  Loader2,
  Copy,
  Download,
  Share2,
  Edit3,
  Save,
  Trash2,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Monitor
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  wordCount: number;
  readingTime: number;
}

interface BlogGenerationRequest {
  topic: string;
  tone: string;
  length: string;
  targetAudience: string;
  keywords: string[];
  includeCallToAction: boolean;
}

export default function Website() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("blog");
  const [contentType, setContentType] = useState<'blog' | 'medium' | 'substack'>('blog');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [generatedLandingPages, setGeneratedLandingPages] = useState<any[]>([]);
  const [previewPage, setPreviewPage] = useState<any>(null);
  const [blogForm, setBlogForm] = useState<BlogGenerationRequest>({
    topic: "",
    tone: "professional",
    length: "medium",
    targetAudience: "homeowners",
    keywords: [],
    includeCallToAction: true
  });
  const [currentKeyword, setCurrentKeyword] = useState("");

  // Generate content mutation (supports blog, medium, substack)
  const generateContentMutation = useMutation({
    mutationFn: async (data: BlogGenerationRequest & { contentType: 'blog' | 'medium' | 'substack' }) => {
      const endpoint = data.contentType === 'blog' ? '/api/ai/generate-blog' : 
                     data.contentType === 'medium' ? '/api/ai/generate-medium' : 
                     '/api/ai/generate-substack';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to generate content');
      return response.json();
    },
    onSuccess: (data: any) => {
      setGeneratedContent(data.content || data.text || 'Generated content');
      const platformName = data.platform === 'medium' ? 'Medium Article' : 
                          data.platform === 'substack' ? 'Substack Article' : 'Blog Post';
      toast({
        title: `${platformName} Generated`,
        description: `Your AI-native ${platformName.toLowerCase()} has been created successfully!`
      });
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  });

  // Fetch existing blog posts
  const { data: blogPosts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['/api/website/blog-posts'],
  });

  const handleGenerateBlog = () => {
    if (!blogForm.topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your blog post.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    generateContentMutation.mutate({ ...blogForm, contentType });
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !blogForm.keywords.includes(currentKeyword.trim())) {
      setBlogForm(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword("");
    }
  };

  // Landing page handlers
  const handleLandingPageGenerated = (pageData: any) => {
    setGeneratedLandingPages(prev => [...prev, pageData]);
  };

  const openLandingPagePreview = (pageData: any) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pageData.title || 'Generated Landing Page'}</title>
          <style>${pageData.css}</style>
        </head>
        <body>
          ${pageData.html}
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const copyLandingPageCode = (pageData: any) => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageData.title || 'Generated Landing Page'}</title>
  <style>${pageData.css}</style>
</head>
<body>
  ${pageData.html}
</body>
</html>`;

    navigator.clipboard.writeText(fullHtml).then(() => {
      toast({
        title: "Code Copied",
        description: "Landing page HTML copied to clipboard!"
      });
    });
  };

  const downloadLandingPage = (pageData: any) => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageData.title || 'Generated Landing Page'}</title>
  <style>${pageData.css}</style>
</head>
<body>
  ${pageData.html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageData.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'landing-page'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your landing page HTML file is downloading!"
    });
  };

  const removeKeyword = (keyword: string) => {
    setBlogForm(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content",
        variant: "destructive"
      });
    }
  };

  const quickActions = [
    {
      title: "Create Blog Post",
      description: "Generate AI-native blog content",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      action: () => setActiveTab("blog")
    },
    {
      title: "Update Homepage",
      description: "Refresh your website content",
      icon: Globe,
      color: "bg-green-100 text-green-600",
      action: () => setActiveTab("homepage")
    },
    {
      title: "Add Service Page",
      description: "Create new service offerings",
      icon: Plus,
      color: "bg-purple-100 text-purple-600",
      action: () => setActiveTab("services")
    },
    {
      title: "Generate Landing Page",
      description: "Create conversion-focused pages",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
      action: () => setActiveTab("landing")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <TopNavigation title="Website Management" />
      
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Website Management</h1>
            <p className="text-gray-600 mt-2">Create, update, and optimize your field service website content</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Zap className="w-4 h-4 mr-2" />
              AI-Native Content
            </Badge>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full lg:w-fit">
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="landing">Landing Pages</TabsTrigger>
          </TabsList>

          {/* Blog Post Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Blog Generation Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Generate {contentType === 'blog' ? 'Blog Post' : contentType === 'medium' ? 'Medium Article' : 'Substack Article'}</span>
                    </CardTitle>
                    <CardDescription>
                      Create engaging, {contentType === 'blog' ? 'SEO-optimized blog content' : contentType === 'medium' ? 'storytelling-focused Medium articles' : 'newsletter-style Substack content'} for your field service business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Platform Selection */}
                    <div className="space-y-2">
                      <Label>Content Platform</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={contentType === 'blog' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setContentType('blog')}
                        >
                          Blog Post
                        </Button>
                        <Button
                          variant={contentType === 'medium' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setContentType('medium')}
                        >
                          Medium Article
                        </Button>
                        <Button
                          variant={contentType === 'substack' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setContentType('substack')}
                        >
                          Substack Newsletter
                        </Button>
                      </div>
                    </div>

                    {/* Topic Input */}
                    <div className="space-y-2">
                      <Label htmlFor="topic">{contentType === 'blog' ? 'Blog' : contentType === 'medium' ? 'Article' : 'Newsletter'} Topic *</Label>
                      <Input
                        id="topic"
                        placeholder={
                          contentType === 'blog' ? "e.g., 'HVAC Maintenance Tips for Summer'" :
                          contentType === 'medium' ? "e.g., 'Why Field Service Businesses Fail at Digital Marketing'" :
                          "e.g., 'Weekly Field Service Industry Insights'"
                        }
                        value={blogForm.topic}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, topic: e.target.value }))}
                      />
                    </div>

                    {/* Settings Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tone">Tone</Label>
                        <Select value={blogForm.tone} onValueChange={(value) => setBlogForm(prev => ({ ...prev, tone: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="authoritative">Authoritative</SelectItem>
                            <SelectItem value="conversational">Conversational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">Length</Label>
                        <Select value={blogForm.length} onValueChange={(value) => setBlogForm(prev => ({ ...prev, length: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">
                              Short ({contentType === 'blog' ? '400-600' : contentType === 'medium' ? '800-1200' : '600-1000'} words)
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium ({contentType === 'blog' ? '800-1200' : contentType === 'medium' ? '1500-2000' : '1200-1800'} words)
                            </SelectItem>
                            <SelectItem value="long">
                              Long ({contentType === 'blog' ? '1500-2000' : contentType === 'medium' ? '2500-3000' : '2000-2500'} words)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select value={blogForm.targetAudience} onValueChange={(value) => setBlogForm(prev => ({ ...prev, targetAudience: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homeowners">Homeowners</SelectItem>
                          <SelectItem value="business-owners">Business Owners</SelectItem>
                          <SelectItem value="property-managers">Property Managers</SelectItem>
                          <SelectItem value="contractors">Fellow Contractors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Keywords */}
                    <div className="space-y-2">
                      <Label>SEO Keywords</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add keyword"
                          value={currentKeyword}
                          onChange={(e) => setCurrentKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                        />
                        <Button onClick={addKeyword} size="sm">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {blogForm.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(keyword)}>
                            {keyword} ×
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button 
                      onClick={handleGenerateBlog}
                      disabled={isGenerating || !blogForm.topic.trim()}
                      className="w-full py-3"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate {contentType === 'blog' ? 'Blog Post' : contentType === 'medium' ? 'Medium Article' : 'Substack Article'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Generated Content */}
                {generatedContent && (
                  <Card className="mt-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Generated Content</CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            Save Draft
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <Textarea
                          value={generatedContent}
                          onChange={(e) => setGeneratedContent(e.target.value)}
                          rows={20}
                          className="min-h-[400px] font-mono text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Recent Posts Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingPosts ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(Array.isArray(blogPosts) ? blogPosts.length : 0) === 0 ? (
                          <p className="text-gray-500 text-sm">No blog posts yet. Generate your first one!</p>
                        ) : (
                          Array.isArray(blogPosts) ? blogPosts.slice(0, 5).map((post: any, index: number) => (
                            <div key={post.id || index} className="border-b border-gray-100 pb-3 last:border-b-0">
                              <h4 className="font-medium text-sm text-gray-900 mb-1">{post.title || 'Sample Blog Post'}</h4>
                              <p className="text-xs text-gray-600 mb-2">{post.excerpt || 'Sample excerpt...'}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                                  {post.status || 'draft'}
                                </Badge>
                                <span className="text-xs text-gray-500">{post.readingTime || '5'} min read</span>
                              </div>
                            </div>
                          )) : null
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Content Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Published Posts</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Draft Posts</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Words</span>
                      <span className="font-medium">18,450</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Content Goal</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs placeholders */}
          <TabsContent value="homepage">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Management</CardTitle>
                <CardDescription>Update and optimize your homepage content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Homepage management tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Pages</CardTitle>
                <CardDescription>Manage your service offerings and descriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Service page management tools coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="landing">
            <div className="space-y-6">
              <Card className="glass-morphism shadow-fieldflux">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-teal-600" />
                    AI Landing Page Generator
                  </CardTitle>
                  <CardDescription>
                    Create high-converting landing pages with AI assistance. Describe your needs and get a professional page in minutes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LandingPageChat onLandingPageGenerated={handleLandingPageGenerated} />
                </CardContent>
              </Card>

              {/* Generated Pages Gallery */}
              {generatedLandingPages.length > 0 && (
                <Card className="glass-morphism shadow-fieldflux">
                  <CardHeader>
                    <CardTitle className="gradient-text flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-600" />
                      Generated Landing Pages
                    </CardTitle>
                    <CardDescription>
                      Your AI-generated landing pages are ready for use
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedLandingPages.map((page) => (
                        <div key={page.id} className="glass-morphism rounded-xl p-4 hover-lift">
                          <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center cursor-pointer"
                               onClick={() => openLandingPagePreview(page)}>
                            <div className="text-center">
                              <Eye className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm text-slate-600">Click to preview</p>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold gradient-text mb-2">{page.title}</h3>
                          <p className="text-sm text-fieldflux-secondary mb-3">{page.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-fieldflux-secondary mb-3">
                            <span>Generated {new Date(page.createdAt).toLocaleDateString()}</span>
                            <Badge className="status-modern-online">Ready</Badge>
                          </div>

                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => openLandingPagePreview(page)}
                              className="flex-1 gradient-accent hover-glow text-white"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setPreviewPage(page)}
                              className="glass-morphism border-white/20"
                              title="Responsive Preview"
                            >
                              <Monitor className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyLandingPageCode(page)}
                              className="glass-morphism border-white/20"
                              title="Copy Code"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => downloadLandingPage(page)}
                              className="glass-morphism border-white/20"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Responsive Preview Modal */}
      {previewPage && (
        <ResponsivePreview 
          landingPage={previewPage}
          onClose={() => setPreviewPage(null)}
        />
      )}
    </div>
  );
}