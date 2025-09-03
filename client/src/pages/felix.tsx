import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { FelixChat } from "@/components/felix/felix-chat";
import { CanvasWindow } from "@/components/canvas/canvas-window";
import Social from "@/pages/social";
import Leads from "@/pages/leads";
import Reviews from "@/pages/reviews";
import Analytics from "@/pages/analytics";
import Keywords from "@/pages/keywords";
import Website from "@/pages/website";
import Settings from "@/pages/settings";

interface OpenWindow {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
}

const WINDOW_CONFIGS = {
  'social-media': {
    title: 'Social Media Management',
    defaultSize: { width: 800, height: 600 },
    headerColor: '#3B82F6',
    component: Social
  },
  'leads': {
    title: 'Lead Management',
    defaultSize: { width: 900, height: 650 },
    headerColor: '#10B981',
    component: Leads
  },
  'reviews': {
    title: 'Review Management',
    defaultSize: { width: 750, height: 550 },
    headerColor: '#F59E0B',
    component: Reviews
  },
  'analytics': {
    title: 'Analytics Dashboard',
    defaultSize: { width: 1000, height: 700 },
    headerColor: '#8B5CF6',
    component: Analytics
  },
  'keywords': {
    title: 'SEO Keywords',
    defaultSize: { width: 800, height: 500 },
    headerColor: '#EF4444',
    component: Keywords
  },
  'website': {
    title: 'Website Management',
    defaultSize: { width: 900, height: 600 },
    headerColor: '#06B6D4',
    component: Website
  },
  'settings': {
    title: 'Settings',
    defaultSize: { width: 700, height: 500 },
    headerColor: '#6B7280',
    component: Settings
  }
};

export default function Felix() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);

  const handleOpenWindow = (windowType: string, config?: any) => {
    const windowConfig = WINDOW_CONFIGS[windowType as keyof typeof WINDOW_CONFIGS];
    if (!windowConfig) return;

    // Check if window is already open
    const existingWindow = openWindows.find(w => w.type === windowType);
    if (existingWindow) {
      // Bring to front and un-minimize
      setOpenWindows(prev => prev.map(w => 
        w.id === existingWindow.id 
          ? { ...w, isMinimized: false }
          : w
      ));
      return;
    }

    // Calculate position with slight offset for multiple windows
    const baseX = 400 + (openWindows.length * 50);
    const baseY = 50 + (openWindows.length * 50);

    const newWindow: OpenWindow = {
      id: `${windowType}-${Date.now()}`,
      type: windowType,
      title: windowConfig.title,
      position: { x: baseX, y: baseY },
      size: windowConfig.defaultSize,
      isMinimized: false
    };

    setOpenWindows(prev => [...prev, newWindow]);
  };

  const handleCloseWindow = (windowId: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const handleMinimizeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const handleUpdateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, position } : w
    ));
  };

  const handleUpdateWindowSize = (windowId: string, size: { width: number; height: number }) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, size } : w
    ));
  };

  // Auto-open window based on route
  React.useEffect(() => {
    const routeMap: Record<string, string> = {
      '/social': 'social-media',
      '/leads': 'leads',
      '/reviews': 'reviews',
      '/analytics': 'analytics',
      '/keywords': 'keywords',
      '/website': 'website',
      '/settings': 'settings'
    };

    const windowType = routeMap[location];
    if (windowType && isAuthenticated) {
      handleOpenWindow(windowType);
    }
  }, [location, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FieldFlux...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Felix Chat - Left Side */}
      <div className="w-96 border-r border-gray-200 bg-white">
        <FelixChat onOpenWindow={handleOpenWindow} />
      </div>

      {/* Canvas Area - Right Side */}
      <div className="flex-1 relative overflow-hidden">
        {openWindows.length === 0 && (
          <div className="h-full flex items-center justify-center text-center">
            <div className="max-w-md">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: "#F97316" }}
              >
                <span className="text-white text-2xl font-bold">FF</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to FieldFlux
              </h2>
              <p className="text-gray-600 mb-6">
                Start a conversation with Felix on the left to open business management windows here.
              </p>
              <div className="text-sm text-gray-500">
                Ask Felix to help you with social media, leads, reviews, analytics, and more.
              </div>
            </div>
          </div>
        )}

        {/* Render Open Windows */}
        {openWindows.map((window) => {
          const windowConfig = WINDOW_CONFIGS[window.type as keyof typeof WINDOW_CONFIGS];
          const WindowComponent = windowConfig.component;

          return (
            <CanvasWindow
              key={window.id}
              id={window.id}
              title={window.title}
              position={window.position}
              size={window.size}
              onPositionChange={(position) => handleUpdateWindowPosition(window.id, position)}
              onSizeChange={(size) => handleUpdateWindowSize(window.id, size)}
              onClose={() => handleCloseWindow(window.id)}
              onMinimize={() => handleMinimizeWindow(window.id)}
              isMinimized={window.isMinimized}
              headerColor={windowConfig.headerColor}
            >
              <WindowComponent />
            </CanvasWindow>
          );
        })}
      </div>
    </div>
  );
}
