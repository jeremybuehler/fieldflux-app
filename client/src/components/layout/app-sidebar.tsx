import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Share2, 
  Users, 
  Star, 
  BarChart, 
  Search, 
  Globe, 
  Settings,
  Target,
  Zap,
  TrendingUp,
  Heart,
  FileText
} from 'lucide-react';

const navigationItems = [
  { 
    path: '/dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    description: 'Overview & insights'
  },
  { 
    path: '/social', 
    label: 'Social Media', 
    icon: Share2,
    description: 'Content & scheduling'
  },
  { 
    path: '/leads', 
    label: 'Lead Management', 
    icon: Users,
    description: 'Track & convert leads'
  },
  { 
    path: '/reviews', 
    label: 'Reviews', 
    icon: Star,
    description: 'Manage & respond'
  },
  { 
    path: '/analytics', 
    label: 'Analytics', 
    icon: BarChart,
    description: 'Performance metrics'
  },
  { 
    path: '/keywords', 
    label: 'Keywords', 
    icon: Search,
    description: 'SEO optimization'
  },
  { 
    path: '/website', 
    label: 'Website', 
    icon: Globe,
    description: 'Content & SEO'
  },
  { 
    path: '/ai-coach', 
    label: 'AI Coach', 
    icon: Zap,
    description: 'Personalized guidance'
  }
];

const bottomItems = [
  { 
    path: '/settings', 
    label: 'Settings', 
    icon: Settings,
    description: 'Account & preferences'
  }
];

export function AppSidebar() {
  const [location] = useLocation();

  const isActivePath = (path: string) => {
    return location === path || (path !== '/dashboard' && location.startsWith(path));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: "#F97316" }}
          >
            FF
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FieldFlux</h1>
            <p className="text-xs text-gray-500">Marketing Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left p-3 h-auto",
                  isActive 
                    ? "text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                style={isActive ? { backgroundColor: "#F97316" } : {}}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    isActive ? "text-white/80" : "text-gray-500"
                  )}>
                    {item.description}
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left p-3 h-auto",
                  isActive 
                    ? "text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                style={isActive ? { backgroundColor: "#F97316" } : {}}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    isActive ? "text-white/80" : "text-gray-500"
                  )}>
                    {item.description}
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}