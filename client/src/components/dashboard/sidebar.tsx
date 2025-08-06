import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { getNavigation } from "@/lib/navigation";
import fieldFluxLogo from "@assets/fieldFlux_logo_updated_1754198391343.avif";

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-hvac-orange rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={fieldFluxLogo} 
              alt="FieldFlux Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-hvac-gray">FieldFlux</h1>
            <p className="text-sm text-gray-500">Where Field Service Meets Smart Marketing</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {getNavigation().map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className={cn("font-medium", isActive && "font-semibold")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Status Card */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-800">AI Agent Active</span>
          </div>
          <p className="text-xs text-green-600 mt-1">Processing marketing tasks...</p>
        </div>
      </div>
    </div>
  );
}