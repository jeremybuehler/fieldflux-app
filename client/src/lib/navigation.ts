import {
  LayoutDashboard,
  Share2,
  Code,
  TrendingUp,
  Search,
  Star,
  UserPlus,
  Settings as SettingsIcon,
  Bot,
  Globe,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
}

// Core navigation items used across all dashboard components
export const CORE_NAVIGATION: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Social Media", href: "/social", icon: Share2 },
  { name: "Website Updates", href: "/website", icon: Code },
  { name: "Reports", href: "/reports", icon: TrendingUp },
  { name: "SEO Optimization", href: "/seo", icon: Search },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Lead Generation", href: "/leads", icon: UserPlus },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

// Extended navigation with additional items for specific components
export const EXTENDED_NAVIGATION: NavigationItem[] = [
  ...CORE_NAVIGATION.slice(0, -1), // All items except Settings
  { name: "AI Coach", href: "/ai-coach", icon: Bot },
  { name: "GoDaddy", href: "/godaddy", icon: Globe },
  { name: "Settings", href: "/settings", icon: SettingsIcon }, // Settings always last
];

// Get navigation array based on context
export const getNavigation = (includeExtended = false): NavigationItem[] => {
  return includeExtended ? EXTENDED_NAVIGATION : CORE_NAVIGATION;
};