import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { getNavigation } from "@/lib/navigation";
import fieldFluxLogo from "@assets/fieldFlux_logo_updated_1754198391343.avif";

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 glass-morphism shadow-protocol-lg border-r border-white/20 flex-col bg-white/95 backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3 animate-protocol-slide-in">
          <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center overflow-hidden shadow-lg animate-pulse-glow">
            <img 
              src={fieldFluxLogo} 
              alt="FieldFlux Logo" 
              className="w-6 h-6 object-contain filter brightness-0 invert"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">FieldFlux</h1>
            <p className="text-xs text-fieldflux-secondary">Smart Marketing Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
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
  );
}