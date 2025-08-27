import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { CanvasWindow } from '@/components/canvas/canvas-window';
import { FelixChat } from '@/components/felix/felix-chat';
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
          position={felixPosition}
          size={felixSize}
          onPositionChange={setFelixPosition}
          onSizeChange={setFelixSize}
          onClose={handleCloseFelix}
          onMinimize={handleMinimizeFelix}
          isMinimized={isMinimized}
          headerColor="#F97316"
        >
          <FelixChat />
        </CanvasWindow>
      )}
    </div>
  );
}