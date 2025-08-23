import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import MultiPlatformWizard from "@/components/social/multi-platform-wizard";
import TopNavigation from "@/components/layout/top-navigation";
import {
  Wand2,
  PlusCircle,
  Calendar,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Navigation now imported from shared constants

export default function Social() {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  const handleLogout = () => {
    toast({
      title: "Logged out!",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen fx-hills">
      <TopNavigation title="Social Media Management" />

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        <div className="space-y-6">
          <div className="bg-white shadow-sm border rounded-xl fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="p-6 border-b" style={{borderColor: 'var(--border)'}}>
              <h3 className="text-lg font-semibold flex items-center mb-2" style={{color: 'var(--fx-navy-900)'}}>
                <Wand2 className="w-5 h-5 mr-2" style={{color: 'var(--fx-orange-600)'}} />
                AI Content Generation
              </h3>
              <p className="text-sm text-gray-600">
                Generate engaging social media content with AI.
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-[1fr_110px] gap-4">
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter a topic or description..."
                    rows={4}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                  />
                  <Button 
                    onClick={() => setIsGenerating(true)} 
                    className="text-white hover:shadow-lg transition-all"
                    style={{backgroundColor: 'var(--fx-orange-600)'}}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    Generate
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Powered by AI, generate content ideas for your social media
                  platforms.
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="wizard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="wizard"
                className="flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Multi-Platform Wizard</span>
              </TabsTrigger>
              <TabsTrigger
                value="quick"
                className="flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Quick Post</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="wizard" className="mt-4">
              <MultiPlatformWizard />
            </TabsContent>
            <TabsContent value="quick" className="mt-4">
              Quick post content here
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-morphism hover-lift shadow-fieldflux animate-protocol-scale-in" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle className="gradient-text flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-teal-600" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="metric-fieldservice-header">
                  <div className="metric-fieldservice-title">Engagement Rate</div>
                  <TrendingUp className="w-6 h-6 text-green-600 animate-float" />
                </div>
                <div className="metric-fieldservice-value">87.3%</div>
                <div className="metric-fieldservice-change metric-fieldservice-change-positive">
                  +15% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism hover-lift shadow-fieldflux animate-protocol-scale-in" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="gradient-text flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="metric-fieldservice-header">
                  <div className="metric-fieldservice-title">Total Followers</div>
                  <Users className="w-6 h-6 text-blue-600 animate-pulse-glow" />
                </div>
                <div className="metric-fieldservice-value">2,347</div>
                <div className="metric-fieldservice-change metric-fieldservice-change-positive">
                  +124 new followers
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}