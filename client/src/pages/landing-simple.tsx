import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react";
import fieldFluxLogo from "@assets/fieldFlux_logo_updated_1754198391343.avif";

export default function Landing() {
  const handleDemoLogin = async () => {
    try {
      const response = await fetch('/api/login', { 
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <div className="min-h-screen fx-hills">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: "var(--fx-orange-600)" }}
            >
              FF
            </div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--fx-navy-900)" }}>FieldFlux</h1>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6" style={{color: 'var(--fx-navy-900)'}}>
            Intelligent Marketing for <span style={{color: 'var(--fx-orange-600)'}}>Field Service Providers</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
            FieldFlux consolidates your marketing tools into one affordable platform. 
            Perfect for HVAC, plumbing, electrical, landscaping, and field service 
            professionals who need content creation, social media management, lead tracking, 
            and reputation management in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="border-2 border-transparent hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: 'var(--fx-orange-300)'}}>
              <BarChart3 className="w-6 h-6" style={{color: 'var(--fx-orange-600)'}} />
            </div>
            <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--fx-navy-900)'}}>
              Performance Insights
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              See what's working with crystal-clear analytics. Track leads,
              measure engagement, and discover which content brings in the
              most customers.
            </p>
          </div>

          <div className="border-2 border-transparent hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 overflow-hidden" style={{backgroundColor: 'var(--fx-orange-300)'}}>
              <img 
                src={fieldFluxLogo} 
                alt="FieldFlux Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--fx-navy-900)'}}>
              Content That Converts
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Never stare at a blank page again. FieldFlux AI creates professional
              posts, helpful tips, and customer stories that showcase your
              expertise and attract new business.
            </p>
          </div>

          <div className="border-2 border-transparent hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: 'var(--fx-sky-300)'}}>
              <Shield className="w-6 h-6" style={{color: 'var(--fx-teal-500)'}} />
            </div>
            <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--fx-navy-900)'}}>
              Smart Lead Pipeline
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Turn inquiries into appointments effortlessly. Smart follow-ups,
              automated reminders, and lead scoring help you close more deals
              without the hassle.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-2">
          <div className="max-w-2xl mx-auto rounded-xl p-6 lg:p-8 fx-grain" style={{backgroundColor: 'var(--bg-elevated)', border: '2px solid var(--border)'}}>
            <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4" style={{color: 'var(--fx-navy-900)'}}>
              Stop Juggling Multiple Marketing Tools
            </h3>
            <p className="mb-4 lg:mb-6 text-sm lg:text-base" style={{ color: "var(--text-secondary)" }}>
              Join thousands of field service professionals who've consolidated 
              their marketing stack. FieldFlux replaces your content creation tool, 
              social media scheduler, lead manager, analytics platform, and reputation 
              management system with one affordable solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="font-semibold px-8 text-white transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: 'var(--fx-orange-600)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--fx-orange-700)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--fx-orange-600)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onClick={handleDemoLogin}
              >
                Try Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link href="/features">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-8"
                  style={{ borderColor: 'var(--fx-navy-600)', color: 'var(--fx-navy-600)' }}
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16" style={{ color: "var(--text-secondary)" }}>
          <p className="text-sm">
            Secure platform designed for professionals. Your business data is
            protected and private.
          </p>
          <p className="text-xs mt-2">
            Click "Try Demo" to explore FieldFlux with sample data.
          </p>
        </div>
      </div>
    </div>
  );
}