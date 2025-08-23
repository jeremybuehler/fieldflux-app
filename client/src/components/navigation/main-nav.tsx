import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

const GradientText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span style={{color: 'var(--fx-navy-900)', fontWeight: 900}}>
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
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm" style={{borderColor: 'var(--border)'}}>
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
                <span
                  className={`cursor-pointer transition-colors font-medium ${
                    location === item.href
                      ? "font-bold"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  style={location === item.href ? {color: 'var(--fx-orange-600)'} : {}}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              className="text-white shadow-lg hover:shadow-xl transition-all"
              style={{backgroundColor: 'var(--fx-orange-600)'}}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--fx-orange-700)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--fx-orange-600)'}
              onClick={() => (window.location.href = "/api/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
