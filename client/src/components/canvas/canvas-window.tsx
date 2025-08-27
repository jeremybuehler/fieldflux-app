import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2, Move } from 'lucide-react';

interface CanvasWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  className?: string;
  headerColor?: string;
}

export function CanvasWindow({
  id,
  title,
  children,
  position,
  size,
  onPositionChange,
  onSizeChange,
  onClose,
  onMinimize,
  isMinimized = false,
  className = '',
  headerColor = '#6B7280'
}: CanvasWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
    setIsDragging(true);
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
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    
    // Keep window within viewport bounds
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;
    
    onPositionChange({
      x: Math.max(0, Math.min(newPosition.x, maxX)),
      y: Math.max(0, Math.min(newPosition.y, maxY))
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
  }, [isDragging, dragOffset, size]);

  if (isMinimized) {
    return (
      <div
        className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-3 cursor-pointer ${className}`}
        onClick={onMinimize}
        style={{ zIndex: 1000 }}
      >
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: headerColor }}
          />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      className={`fixed bg-white rounded-lg shadow-xl border overflow-hidden ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Window Header */}
      <div
        className="flex items-center justify-between p-3 border-b cursor-grab select-none"
        style={{ backgroundColor: headerColor }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Move className="w-4 h-4 text-white/80" />
          <h3 className="font-semibold text-white text-sm">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          {onMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
      </div>
    </div>
  );
}