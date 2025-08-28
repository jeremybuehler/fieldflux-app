import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { FelixChat } from '@/components/felix/felix-chat-fixed';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isFelixOpen, setIsFelixOpen] = useState(false);
  const [location] = useLocation();

  const handleToggleFelix = () => {
    setIsFelixOpen(!isFelixOpen);
  };

  const handleCloseFelix = () => {
    setIsFelixOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Header with Navigation */}
      <AppHeader />
      
      {/* Main Content Area with Felix Slide Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main 
          className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${
            isFelixOpen ? 'mr-96' : 'mr-0'
          }`}
        >
          {children}
        </main>

        {/* Felix Slide-in Panel */}
        <div 
          className={`fixed right-0 w-96 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 z-40 ${
            isFelixOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ 
            top: '60px',
            bottom: '20px',
            height: 'auto'
          }}
        >
          {/* Felix Header */}
          <div 
            className="flex items-center justify-between p-4 border-b border-gray-200"
            style={{ backgroundColor: "#F97316" }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Felix</h3>
                <p className="text-xs text-white/80">Your AI Marketing Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseFelix}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Felix Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <FelixChat onNavigate={(route) => console.log('Navigating to:', route)} />
          </div>
        </div>
      </div>

      {/* Felix Toggle Button - Always visible */}
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

      {/* Felix Tab Button - When panel is open */}
      {isFelixOpen && (
        <Button
          onClick={handleCloseFelix}
          className="fixed top-1/2 transform -translate-y-1/2 right-96 h-12 w-6 rounded-l-lg shadow-lg z-50 transition-all"
          style={{ 
            backgroundColor: "#F97316",
            color: "white",
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}