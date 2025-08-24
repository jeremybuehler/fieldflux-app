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
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
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
    if (isMaximized) {
      setPosition(initialPosition);
      setSize(initialSize);
    } else {
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight - 100 });
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      ref={windowRef}
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200/50 backdrop-blur-sm"
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
        className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Move className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          {onMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="w-6 h-6 p-0 hover:bg-gray-200"
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMaximize}
            className="w-6 h-6 p-0 hover:bg-gray-200"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
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
      <div className="flex-1 overflow-auto rounded-b-lg bg-white">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}