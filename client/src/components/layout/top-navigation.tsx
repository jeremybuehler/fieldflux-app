import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WeatherWidget from "@/components/dashboard/weather-widget";
import {
  Bot,
  MapPin,
  LogOut,
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
  { name: "", href: "/dashboard", icon: WeatherWidget },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Social Media", href: "/social", icon: Share2 },
  { name: "Website", href: "/website", icon: Code },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "SEO", href: "/seo", icon: Search },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Leads", href: "/leads", icon: UserPlus },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
  { name: "Logout", href: "alert('Add something here')", icon: LogOut },
];

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Bot,
  MapPin,
  LogOut,
  LayoutDashboard,
  Share2,
  Code,
  TrendingUp,
  Search,
  Star,
  UserPlus,
  Settings as SettingsIcon,
} from "lucide-react";

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

interface TopNavigationProps {
  title: string;
}

export default function TopNavigation({ title }: TopNavigationProps) {
  const { toast } = useToast();
  const [location] = useLocation();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-hvac-orange rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-hvac-gray">
                  {title}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="hidden sm:flex items-center space-x-1">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      AI Powered
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      Winter Haven FL
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3">
        <nav className="flex space-x-1 overflow-x-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2 whitespace-nowrap",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
