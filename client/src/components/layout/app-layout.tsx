import React, { useState } from 'react';
import { useLocation } from 'wouter';
import CanvasWindow from '@/components/canvas/canvas-window';
import FelixChat from '@/components/felix/felix-chat';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isFelixOpen, setIsFelixOpen] = useState(false);
  const [felixPosition, setFelixPosition] = useState({ x: window.innerWidth - 400, y: 100 });
  const [felixSize, setFelixSize] = useState({ width: 380, height: 500 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [location] = useLocation();

  const handleToggleFelix = () => {
    setIsFelixOpen(!isFelixOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const handleMinimizeFelix = () => {
    setIsMinimized(!isMinimized);
  };

  const handleCloseFelix = () => {
    setIsFelixOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AppHeader />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Felix Chat Button - Always visible */}
      {!isFelixOpen && (
        <Button
          onClick={handleToggleFelix}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all hover:scale-105"
          style={{ 
            backgroundColor: "#F97316",
            color: "white"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#EA580C"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#F97316"}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Felix Chat Window */}
      {isFelixOpen && (
        <CanvasWindow
          id="felix-chat"
          title="Felix - AI Assistant"
          initialPosition={felixPosition}
          initialSize={felixSize}
          onClose={handleCloseFelix}
          onMinimize={handleMinimizeFelix}
          zIndex={50}
          onFocus={() => {}}
        >
          <div className="h-full flex flex-col">
            {/* Felix Header */}
            <div 
              className="flex items-center justify-between p-3 text-white border-b border-white/20"
              style={{ backgroundColor: "#F97316" }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Felix</h3>
                  <p className="text-xs opacity-75">Your AI Marketing Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimizeFelix}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseFelix}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Felix Chat Content */}
            <div className="flex-1 overflow-hidden">
              <FelixChat />
            </div>
          </div>
        </CanvasWindow>
      )}
    </div>
  );
}