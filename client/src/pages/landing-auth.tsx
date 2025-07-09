import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Bot,
  BarChart3,
  Zap,
  Users,
  ArrowRight,
  Play,
  MessageSquare,
  Star,
  TrendingUp,
  Calendar,
  CheckCircle,
  Target,
  Wrench,
  Phone,
  Truck,
  Clock,
  DollarSign,
} from "lucide-react";

export default function LandingAuth() {
  const { isAuthenticated } = useAuth();
  
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Login/Sign-Up */}
      <header className="container mx-auto px-4 py-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FieldPulse</h1>
              <p className="text-sm text-gray-600">Intelligent Field Service Marketing</p>
            </div>
          </div>
          <Button 
            onClick={handleLogin}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Login/Sign-Up
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            STOP PAYING <span className="text-green-600">5 COMPANIES</span>
          </h1>
          <h2 className="text-2xl md:text-3xl mb-8 font-semibold text-gray-800">
            Replace Your Marketing Stack with One Tool Built for Field Service
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-lg text-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Save $500+ monthly</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Gain 18 hours weekly</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Increase leads 300%</span>
            </div>
          </div>
          <p className="text-xl mb-8 text-gray-600">
            Perfect for HVAC, Plumbing, Electrical & Field Service Pros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-lg"
              onClick={handleLogin}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 font-semibold px-8 py-4 text-lg"
            >
              Watch 2-Min Demo
            </Button>
          </div>
          <div className="mt-8 text-gray-600 italic">
            "Finally, marketing software that gets our business"<br />
            <span className="text-sm">- Winter Haven Air Conditioning, FL</span>
          </div>
        </div>



        {/* The Numbers Don't Lie Section */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-field-navy mb-4">The Numbers Don't Lie</h2>
            <p className="text-field-gray text-lg">Real results from field service professionals</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-field-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-field-orange" />
              </div>
              <h3 className="text-3xl font-bold text-field-navy mb-2">87%</h3>
              <p className="text-field-gray">Reduction in marketing tool costs</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-field-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-field-orange" />
              </div>
              <h3 className="text-3xl font-bold text-field-navy mb-2">18 hrs</h3>
              <p className="text-field-gray">Saved weekly per office manager</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-field-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-field-orange" />
              </div>
              <h3 className="text-3xl font-bold text-field-navy mb-2">300%</h3>
              <p className="text-field-gray">Increase in qualified leads</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-field-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-field-orange" />
              </div>
              <h3 className="text-3xl font-bold text-field-navy mb-2">500+</h3>
              <p className="text-field-gray">Field service businesses</p>
            </div>
          </div>
        </div>

        {/* Field Service Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-field-orange/20 hover:border-field-orange/40 transition-all duration-300 bg-white">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-field-orange/10 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-field-orange" />
              </div>
              <h3 className="text-xl font-semibold text-field-navy mb-2">
                Field Service AI
              </h3>
              <p className="text-field-gray">
                Content built for HVAC, plumbing, and electrical pros. Seasonal campaigns, emergency messaging, and service-specific posts.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-field-orange/20 hover:border-field-orange/40 transition-all duration-300 bg-white">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-field-orange/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-field-orange" />
              </div>
              <h3 className="text-xl font-semibold text-field-navy mb-2">
                Seasonal Content
              </h3>
              <p className="text-field-gray">
                Automated seasonal campaigns for AC tune-ups, heating maintenance, and emergency repairs that drive bookings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-field-orange/20 hover:border-field-orange/40 transition-all duration-300 bg-white">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-field-orange/10 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-field-orange" />
              </div>
              <h3 className="text-xl font-semibold text-field-navy mb-2">
                Emergency Communications
              </h3>
              <p className="text-field-gray">
                Instant SMS and social media alerts for emergency services, weather events, and urgent repair needs.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust and Guarantee Section */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-field-navy mb-4">Built BY Field Service Pros FOR Field Service Pros</h2>
            <p className="text-field-gray text-lg">No-risk trial with real human support</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-field-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-field-orange" />
              </div>
              <h3 className="text-lg font-semibold text-field-navy mb-2">14-Day Free Trial</h3>
              <p className="text-field-gray">No credit card required</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-field-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-field-orange" />
              </div>
              <h3 className="text-lg font-semibold text-field-navy mb-2">Real Humans</h3>
              <p className="text-field-gray">Not chatbots for support</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-field-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-field-orange" />
              </div>
              <h3 className="text-lg font-semibold text-field-navy mb-2">No Contracts</h3>
              <p className="text-field-gray">Cancel anytime</p>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-field-navy to-primary text-white border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">Ready to Stop Juggling 5 Tools?</h3>
              <p className="text-xl mb-6 text-white/90">
                Join 500+ field service professionals who replaced their marketing stack with FieldPulse.
              </p>
              
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="bg-field-orange text-white hover:bg-field-orange/90 font-semibold px-12 py-4 text-lg"
                  onClick={handleLogin}
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Setup in 5 Minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Cancel Anytime</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-white/80">
                Already have an account?{" "}
                <button 
                  onClick={handleLogin}
                  className="underline hover:text-white font-medium"
                >
                  Sign In Here
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-white/60">
          <p className="text-sm">
            Secure platform designed for field service professionals. Your business data is protected and private.
          </p>
        </div>
      </div>
    </div>
  );
}