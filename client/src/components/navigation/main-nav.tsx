import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

const GradientText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
      {children}
    </span>
  );
};

export default function MainNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/demo", label: "Demo" },
  ];

  return (
    <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="text-2xl font-bold">
                <GradientText>FieldFlux</GradientText>
              </div>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`transition-colors ${
                  location === item.href 
                    ? "text-blue-400 font-medium" 
                    : "text-slate-300 hover:text-white"
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/api/login">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
            <Link href="/api/login">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}