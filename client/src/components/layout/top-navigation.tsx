import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getNavigation } from "@/lib/navigation";
import {
  Bot,
  MapPin,
  LogOut,
} from "lucide-react";

interface TopNavigationProps {
  title: string;
}

export default function TopNavigation({ title }: TopNavigationProps) {
  const { toast } = useToast();
  const [location] = useLocation();

  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "You are being logged out.",
    });
    window.location.href = "/api/logout";
  };

  return (
    <>
      {/* Header */}
      <div className="glass-morphism backdrop-blur-xl border-b border-white/20 px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between animate-protocol-slide-in">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold gradient-text">
                  {title}
                </h1>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="hidden sm:flex items-center space-x-2">
                    <Badge className="status-modern-online">
                      AI Powered
                    </Badge>
                    <Badge className="glass-morphism text-fieldflux-primary border-teal-200">
                      <MapPin className="w-3 h-3 mr-1" />
                      Winter Haven FL
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="glass-morphism hover-lift border-white/20 text-fieldflux-secondary hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="glass-morphism border-b border-white/20 px-4 lg:px-8 py-3">
        <nav className="flex space-x-2 overflow-x-auto">
          {getNavigation(true).map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2 whitespace-nowrap transition-all hover-lift rounded-xl",
                    isActive
                      ? "gradient-accent text-white shadow-lg"
                      : "text-fieldflux-secondary hover:text-fieldflux-primary glass-morphism",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
