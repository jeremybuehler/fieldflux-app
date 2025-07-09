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
    <div className="landing-page min-h-screen bg-white" style={{ background: 'white !important' }}>
      {/* Header with Login/Sign-Up */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-hvac-orange rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-hvac-gray">FieldPulse</h1>
              <p className="text-sm text-gray-600">Intelligent Field Service Marketing</p>
            </div>
          </div>
          <Button 
            variant="outline"
            onClick={handleLogin}
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Login/Sign-Up
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-hvac-gray mb-4">
            Where Field Service Meets Smart Marketing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Consolidate your marketing tools into one affordable platform. 
            Perfect for HVAC, plumbing, electrical, landscaping, and field service 
            professionals who need content creation, social media management, lead tracking, 
            and reputation management in one place.
          </p>
        </div>



        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-hvac-gray mb-2">
                Performance Insights
              </h3>
              <p className="text-gray-600">
                See what's working with crystal-clear analytics. Track leads,
                measure engagement, and discover which content brings in the
                most customers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-hvac-orange/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-hvac-orange" />
              </div>
              <h3 className="text-xl font-semibold text-hvac-gray mb-2">
                Content That Converts
              </h3>
              <p className="text-gray-600">
                Generate professional posts, blogs, and ads that capture
                attention and drive action. From technical explanations to
                customer testimonials.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-hvac-gray mb-2">
                Smart Lead Management
              </h3>
              <p className="text-gray-600">
                Never miss an opportunity. Automated follow-ups, priority
                scoring, and intelligent scheduling keep your pipeline flowing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-mint-500 to-mint-600 text-black border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4 text-black">Ready to Transform Your Marketing?</h3>
              <p className="text-xl mb-6 text-black/80">
                Join 500+ field service professionals who are already growing their business with FieldPulse.
              </p>
              
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-50 font-semibold px-12 py-4 text-lg"
                  onClick={() => {
                    // Scroll to top to show features, then redirect to login
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => {
                      handleLogin();
                    }, 500);
                  }}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-black/70">
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
              
              <div className="mt-6 text-sm text-black/70">
                Already have an account?{" "}
                <button 
                  onClick={handleLogin}
                  className="underline hover:text-black font-medium"
                >
                  Sign In Here
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Secure platform designed for professionals. Your business data is
            protected and private.
          </p>
        </div>
      </div>
    </div>
  );
}