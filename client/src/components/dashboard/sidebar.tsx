import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { getNavigation } from "@/lib/navigation";
import fieldFluxLogo from "@assets/fieldFlux_logo_updated_1754198391343.avif";

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col bg-white border-r fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
      {/* Header */}
      <div className="p-6 border-b" style={{borderColor: 'var(--border)'}}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg" style={{backgroundColor: 'var(--fx-orange-600)'}}>
            <img 
              src={fieldFluxLogo} 
              alt="FieldFlux Logo" 
              className="w-6 h-6 object-contain filter brightness-0 invert"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{color: 'var(--fx-navy-900)'}}>FieldFlux</h1>
            <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Field Service Marketing</p>
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
                "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "text-white shadow-lg"
                  : "hover:bg-gray-50"
              )}
              style={isActive ? {backgroundColor: 'var(--fx-navy-900)'} : {}}
            >
              <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110")} style={{color: isActive ? 'white' : 'var(--fx-orange-600)'}} />
              <span className={cn("font-medium transition-all", isActive ? "font-semibold text-white" : "text-gray-700 group-hover:text-gray-900")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Status Card */}
      <div className="p-4 border-t" style={{borderColor: 'var(--border)'}}>
        <div className="rounded-xl p-4 transition-all hover:scale-105" style={{backgroundColor: 'var(--fx-teal-500)'}}>
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