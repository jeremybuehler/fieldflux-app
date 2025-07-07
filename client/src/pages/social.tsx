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
  Bot,
  MapPin,
  Wand2,
  PlusCircle,
  LogOut,
  Calendar,
  Share2,
  Code,
  Search,
  Star,
  UserPlus,
  Settings as SettingsIcon,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Social Media", href: "/social", icon: Share2 },
  { name: "Website", href: "/website", icon: Code },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "SEO", href: "/seo", icon: Search },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Leads", href: "/leads", icon: UserPlus },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <TopNavigation title="Social Media Management" />

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Generate engaging social media content with AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-[1fr_110px] gap-4">
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter a topic or description..."
                    rows={4}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                  />
                  <Button onClick={() => setIsGenerating(true)}>
                    Generate
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Powered by AI, generate content ideas for your social media
                  platforms.
                </p>
              </div>
            </CardContent>
          </Card>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>Performance data here</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>Platform specific data here</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}