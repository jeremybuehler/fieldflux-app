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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
          {isAuthenticated ? (
            <Button 
              onClick={handleDashboard}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={handleLogin}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Login/Sign-Up
            </Button>
          )}
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

        {/* Field Service Marketing Infographic */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-hvac-gray mb-4">
              Transform Your Field Service Marketing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how FieldPulse eliminates marketing chaos and drives real business growth
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Before: Traditional Marketing Challenges */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-600 mb-4">Before FieldPulse</h3>
                <p className="text-gray-600 mb-6">Traditional marketing chaos costs you customers</p>
              </div>
              
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-100">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800">5 Different Marketing Tools</h4>
                      <p className="text-sm text-red-700">Facebook, Google Ads, WordPress, Review Apps, Email Marketing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800">$500+ Monthly Costs</h4>
                      <p className="text-sm text-red-700">Multiple subscriptions, hidden fees, upgrade costs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800">20+ Hours Weekly</h4>
                      <p className="text-sm text-red-700">Creating content, managing reviews, tracking leads</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800">Missed Opportunities</h4>
                      <p className="text-sm text-red-700">Slow responses, inconsistent messaging, lost leads</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* After: FieldPulse Solution */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-4">After FieldPulse</h3>
                <p className="text-gray-600 mb-6">One platform that grows your business automatically</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-100">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">One Unified Platform</h4>
                      <p className="text-sm text-green-700">All marketing tools integrated seamlessly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">80% Cost Reduction</h4>
                      <p className="text-sm text-green-700">Replace $500+ monthly tools with one affordable solution</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">90% Time Savings</h4>
                      <p className="text-sm text-green-700">Automated content creation, review responses, lead follow-ups</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">3x More Leads</h4>
                      <p className="text-sm text-green-700">Consistent posting, instant responses, smart follow-ups</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="mt-12 bg-gradient-to-r from-primary/10 to-hvac-orange/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-hvac-gray mb-2">The FieldPulse Advantage</h3>
              <p className="text-gray-600">Real results from field service professionals</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-2xl font-bold text-hvac-gray">300%</h4>
                <p className="text-sm text-gray-600">Average lead increase</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-hvac-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-hvac-orange" />
                </div>
                <h4 className="text-2xl font-bold text-hvac-gray">18 hrs</h4>
                <p className="text-sm text-gray-600">Weekly time saved</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-hvac-gray">$2,400</h4>
                <p className="text-sm text-gray-600">Monthly revenue increase</p>
              </div>
            </div>
          </div>
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
          <Card className="bg-gradient-to-br from-primary to-hvac-orange text-white border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Marketing?</h3>
              <p className="text-xl mb-6 text-white/90">
                Join 500+ field service professionals who are already growing their business with FieldPulse.
              </p>
              
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-50 font-semibold px-12 py-4 text-lg"
                  onClick={isAuthenticated ? handleDashboard : handleLogin}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-white/80">
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
              
              {!isAuthenticated && (
                <div className="mt-6 text-sm text-white/80">
                  Already have an account?{" "}
                  <button 
                    onClick={handleLogin}
                    className="underline hover:text-white font-medium"
                  >
                    Sign In Here
                  </button>
                </div>
              )}
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