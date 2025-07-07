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
