import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Share2, 
  Code, 
  TrendingUp, 
  Search, 
  Star, 
  UserPlus,
  Bot
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "#", icon: LayoutDashboard, current: true },
  { name: "Social Media", href: "#", icon: Share2, current: false },
  { name: "Website Updates", href: "#", icon: Code, current: false },
  { name: "Analytics", href: "#", icon: TrendingUp, current: false },
  { name: "SEO Optimization", href: "#", icon: Search, current: false },
  { name: "Reviews", href: "#", icon: Star, current: false },
  { name: "Lead Generation", href: "#", icon: UserPlus, current: false },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-hvac-orange rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-hvac-gray">Dave AI</h1>
            <p className="text-sm text-gray-500">HVAC Marketing Agent</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                item.current
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className={cn("font-medium", item.current && "font-semibold")}>
                {item.name}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Status Card */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-800">Dave is Online</span>
          </div>
          <p className="text-xs text-green-600 mt-1">Processing 3 tasks...</p>
        </div>
      </div>
    </div>
  );
}
