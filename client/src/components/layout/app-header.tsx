import React from 'react';
import { useLocation } from 'wouter';
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
import { Bell, ChevronDown, LogOut, User as UserIcon, Settings } from 'lucide-react';

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

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentPage.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{currentPage.subtitle}</p>
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
                <Avatar className="h-8 w-8">
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
                  <div className="text-xs text-gray-500">
                    {user?.email || 'user@example.com'}
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
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
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
    </header>
  );
}