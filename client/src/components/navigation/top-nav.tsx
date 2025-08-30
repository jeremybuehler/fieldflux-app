import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Share2, 
  Globe, 
  BarChart3, 
  Search, 
  Star, 
  UserPlus, 
  Bot,
  Settings,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Social Media",
    href: "/social",
    icon: Share2
  },
  {
    name: "Website Updates", 
    href: "/website",
    icon: Globe
  },
  {
    name: "Reports",
    href: "/reports", 
    icon: BarChart3
  },
  {
    name: "SEO Optimization",
    href: "/seo",
    icon: Search
  },
  {
    name: "Reviews",
    href: "/reviews",
    icon: Star
  },
  {
    name: "Lead Generation",
    href: "/leads",
    icon: UserPlus
  },
  {
    name: "AI Coach",
    href: "/ai-coach",
    icon: Bot
  },
  {
    name: "GoDaddy",
    href: "/godaddy",
    icon: Building
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings
  }
];

export default function TopNav() {
  const [location] = useLocation();

  return (
    <nav className="bg-white border-b px-6 py-0 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
      <div className="flex items-center space-x-8 overflow-x-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || 
            (item.href !== "/dashboard" && location.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                isActive 
                  ? "border-2" 
                  : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
              )}
              style={isActive ? {
                color: 'var(--fx-orange-600)', 
                borderColor: 'var(--fx-orange-600)'
              } : {}}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}