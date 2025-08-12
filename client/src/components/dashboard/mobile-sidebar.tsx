import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { getNavigation } from "@/lib/navigation";
import {
  Menu,
  X,
  Zap
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function MobileSidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
          className="glass-morphism hover-lift border-white/20 shadow-fieldflux"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "lg:hidden pb-12 transition-transform duration-300 ease-in-out",
        "fixed inset-y-0 left-0 z-50 w-64 glass-morphism shadow-lg border-r border-white/20 bg-white/95 backdrop-blur-xl",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">FieldFlux</h1>
                  <p className="text-xs text-fieldflux-secondary">Smart Marketing Platform</p>
                </div>
              </div>
              {/* Close button for mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="lg:hidden p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {getNavigation(true).map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 hover-lift group",
                    isActive
                      ? "gradient-accent text-white shadow-lg border-l-4 border-teal-300"
                      : "text-fieldflux-secondary hover:glass-morphism hover:text-fieldflux-primary"
                  )}
                  onClick={closeMobileMenu}
                >
                  <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-fieldflux-accent")} />
                  <span className={cn("font-medium transition-all", isActive ? "font-semibold text-white" : "text-fieldflux-secondary group-hover:text-fieldflux-primary")}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Status Card */}
          <div className="p-4 border-t border-white/20">
            <div className="status-modern-online rounded-xl p-4 animate-protocol-fade-in hover-lift">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse-glow" />
                <span className="text-sm font-semibold text-white">AI Agent Active</span>
              </div>
              <p className="text-xs text-green-100 mt-2 leading-relaxed">
                Processing 3 marketing campaigns...
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}