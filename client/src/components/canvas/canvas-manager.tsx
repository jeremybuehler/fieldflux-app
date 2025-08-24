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

const WINDOW_CONFIGS: Record<string, WindowConfig> = {
  analytics: {
    id: "analytics",
    title: "Business Analytics & Reports",
    component: Analytics,
    initialPosition: { x: 100, y: 100 },
    initialSize: { width: 1000, height: 700 }
  },
  leads: {
    id: "leads",
    title: "Lead Management",
    component: Leads,
    initialPosition: { x: 150, y: 150 },
    initialSize: { width: 900, height: 600 }
  },
  social: {
    id: "social",
    title: "Social Media Management",
    component: Social,
    initialPosition: { x: 200, y: 200 },
    initialSize: { width: 800, height: 650 }
  },
  reviews: {
    id: "reviews",
    title: "Review Management",
    component: Reviews,
    initialPosition: { x: 250, y: 250 },
    initialSize: { width: 850, height: 600 }
  },
  seo: {
    id: "seo",
    title: "SEO & Keywords",
    component: SEO,
    initialPosition: { x: 300, y: 300 },
    initialSize: { width: 900, height: 650 }
  },
  settings: {
    id: "settings",
    title: "Business Settings",
    component: Settings,
    initialPosition: { x: 350, y: 350 },
    initialSize: { width: 700, height: 500 }
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