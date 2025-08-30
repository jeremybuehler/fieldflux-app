import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@shared/schema';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  User as UserIcon, 
  Settings,
  LayoutDashboard,
  Share2,
  Users,
  Star,
  BarChart,
  Search,
  Globe,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { 
    path: '/dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard
  },
  { 
    path: '/social', 
    label: 'Social Media', 
    icon: Share2
  },
  { 
    path: '/leads', 
    label: 'Leads', 
    icon: Users
  },
  { 
    path: '/reviews', 
    label: 'Reviews', 
    icon: Star
  },
  { 
    path: '/analytics', 
    label: 'Analytics', 
    icon: BarChart
  },
  { 
    path: '/keywords', 
    label: 'Keywords', 
    icon: Search
  },
  { 
    path: '/website', 
    label: 'Website', 
    icon: Globe
  },
  { 
    path: '/ai-coach', 
    label: 'AI Coach', 
    icon: Zap
  }
];

const pageMap: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { 
    title: 'Dashboard', 
    subtitle: 'Your marketing performance overview' 
  },
  '/social': { 
    title: 'Social Media', 
    subtitle: 'Manage your social content and scheduling' 
  },
  '/leads': { 
    title: 'Lead Management', 
    subtitle: 'Track and convert your leads' 
  },
  '/reviews': { 
    title: 'Reviews Management', 
    subtitle: 'Monitor and respond to customer reviews' 
  },
  '/analytics': { 
    title: 'Analytics', 
    subtitle: 'Track your marketing performance' 
  },
  '/keywords': { 
    title: 'Keyword Tracking', 
    subtitle: 'Monitor your SEO performance' 
  },
  '/website': { 
    title: 'Website Management', 
    subtitle: 'Manage your website content and SEO' 
  },
  '/ai-coach': { 
    title: 'AI Coach', 
    subtitle: 'Get personalized marketing guidance' 
  },
  '/settings': { 
    title: 'Settings', 
    subtitle: 'Manage your account and preferences' 
  }
};

export function AppHeader() {
  const [location] = useLocation();
  const { user } = useAuth() as { user: User | null };
  
  const currentPage = pageMap[location] || { 
    title: 'FieldFlux', 
    subtitle: 'AI-Powered Marketing Platform' 
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const isActivePath = (path: string) => {
    return location === path || (path !== '/dashboard' && location.startsWith(path));
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Navigation Bar */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: "#F97316" }}
            >
              FF
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">FieldFlux</h1>
            </div>
          </div>

          {/* Right Side - Notifications & User */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email || 'User'
                      }
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <Link href="/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-6">
        <nav className="flex space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-t-lg rounded-b-none border-b-2",
                    isActive 
                      ? "text-white border-orange-500 shadow-none" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                  )}
                  style={isActive ? { backgroundColor: "#F97316" } : {}}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Page Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentPage.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{currentPage.subtitle}</p>
        </div>
      </div>
    </div>
  );
}