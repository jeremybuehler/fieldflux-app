import { useState, useCallback, useEffect } from "react";
import * as React from "react";
import CanvasWindow from "./canvas-window";
import Analytics from "@/pages/reports";
import Leads from "@/pages/leads";
import Social from "@/pages/social";
import Reviews from "@/pages/reviews";
import SEO from "@/pages/seo";
import Settings from "@/pages/settings-fixed";

interface WindowConfig {
  id: string;
  title: string;
  component: React.ComponentType;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
}

interface OpenWindow extends WindowConfig {
  zIndex: number;
}

// Get right-side positioning dynamically
const getRightSidePosition = () => ({
  x: Math.max(400, window.innerWidth - 420),
  y: 80
});

const getRightSideSize = () => ({
  width: 400,
  height: window.innerHeight - 160
});

const WINDOW_CONFIGS: Record<string, WindowConfig> = {
  analytics: {
    id: "analytics",
    title: "Business Analytics & Reports",
    component: Analytics,
    initialPosition: getRightSidePosition(),
    initialSize: getRightSideSize()
  },
  leads: {
    id: "leads",
    title: "Lead Management",
    component: Leads,
    initialPosition: getRightSidePosition(),
    initialSize: getRightSideSize()
  },
  social: {
    id: "social",
    title: "Social Media Management",
    component: Social,
    initialPosition: getRightSidePosition(),
    initialSize: getRightSideSize()
  },
  reviews: {
    id: "reviews",
    title: "Review Management",
    component: Reviews,
    initialPosition: getRightSidePosition(),
    initialSize: getRightSideSize()
  },
  seo: {
    id: "seo",
    title: "SEO & Keywords",
    component: SEO,
    initialPosition: getRightSidePosition(),
    initialSize: getRightSideSize()
  },
  settings: {
    id: "settings",
    title: "Business Settings",
    component: Settings,
    initialPosition: getRightSidePosition(),
    initialSize: getRightSideSize()
  }
};

interface CanvasManagerProps {
  openWindows: string[];
  onWindowOpen: (windowId: string) => void;
  onWindowClose: (windowId: string) => void;
}

export default function CanvasManager({ 
  openWindows, 
  onWindowOpen, 
  onWindowClose 
}: CanvasManagerProps) {
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [topZIndex, setTopZIndex] = useState(1000);

  // Update windows when openWindows prop changes
  useEffect(() => {
    const newWindows = openWindows
      .filter(windowId => WINDOW_CONFIGS[windowId])
      .map((windowId, index) => {
        const existing = windows.find(w => w.id === windowId);
        if (existing) return existing;
        
        return {
          ...WINDOW_CONFIGS[windowId],
          zIndex: topZIndex + index + 1
        };
      });
    
    setWindows(newWindows);
    if (newWindows.length > windows.length) {
      setTopZIndex(prev => prev + newWindows.length);
    }
  }, [openWindows, windows.length, topZIndex]);

  const handleWindowFocus = useCallback((windowId: string) => {
    setWindows(prev => prev.map(window => 
      window.id === windowId 
        ? { ...window, zIndex: topZIndex + 1 }
        : window
    ));
    setTopZIndex(prev => prev + 1);
  }, [topZIndex]);

  const handleWindowClose = useCallback((windowId: string) => {
    onWindowClose(windowId);
  }, [onWindowClose]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {windows.map((window) => {
        const WindowComponent = window.component;
        return (
          <div key={window.id} className="pointer-events-auto">
            <CanvasWindow
              id={window.id}
              title={window.title}
              initialPosition={window.initialPosition}
              initialSize={window.initialSize}
              zIndex={window.zIndex}
              onClose={() => handleWindowClose(window.id)}
              onFocus={() => handleWindowFocus(window.id)}
            >
              <WindowComponent />
            </CanvasWindow>
          </div>
        );
      })}
    </div>
  );
}

export { WINDOW_CONFIGS };