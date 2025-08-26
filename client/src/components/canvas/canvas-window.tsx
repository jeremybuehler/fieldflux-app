import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Minimize2, Maximize2, Move } from "lucide-react";

interface CanvasWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  onClose: () => void;
  onMinimize?: () => void;
  zIndex: number;
  onFocus: () => void;
}

export default function CanvasWindow({
  id,
  title,
  children,
  initialPosition,
  initialSize,
  onClose,
  onMinimize,
  zIndex,
  onFocus
}: CanvasWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-maximize on mobile (Gemini-style full screen)
  useEffect(() => {
    if (isMobile && !isMaximized) {
      setIsMaximized(true);
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [isMobile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget || isMobile) return;
    
    setIsDragging(true);
    onFocus();
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleMaximize = () => {
    if (isMobile) return; // Don't allow toggling on mobile
    
    if (isMaximized) {
      setPosition(initialPosition);
      setSize(initialSize);
    } else {
      if (isMobile) {
        setPosition({ x: 0, y: 0 });
        setSize({ width: window.innerWidth, height: window.innerHeight });
      } else {
        setPosition({ x: 0, y: 60 });
        setSize({ width: window.innerWidth, height: window.innerHeight - 60 });
      }
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      ref={windowRef}
      className={`fixed bg-white shadow-2xl border border-gray-200/50 backdrop-blur-sm ${
        isMobile ? 'rounded-none' : 'rounded-lg'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onClick={onFocus}
    >
      {/* Window Header */}
      <div
        className={`flex items-center justify-between p-3 border-b bg-gradient-to-r from-gray-50 to-gray-100 ${
          isMobile ? 'rounded-none' : 'rounded-t-lg cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          ) : (
            <Move className="w-4 h-4 text-gray-400" />
          )}
          <h3 className="font-semibold text-gray-900 text-sm truncate">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          {onMinimize && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="w-6 h-6 p-0 hover:bg-gray-200"
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMaximize}
              className="w-6 h-6 p-0 hover:bg-gray-200"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-6 h-6 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className={`flex-1 overflow-y-auto bg-white ${!isMobile ? 'rounded-b-lg' : ''}`}>
        <div className={`h-full ${isMobile ? 'p-3' : 'p-4'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}