import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const handleLogin = () => {
    window.location.href = '/api/login';
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
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-hvac-orange rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-hvac-gray">FieldPulse</h1>
              <p className="text-lg text-gray-600">Replace 5 Marketing Tools with One</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-hvac-gray mb-4">
            Replace 5 Marketing Tools with One
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            FieldPulse consolidates your marketing tools into one affordable platform. 
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

        {/* Interactive Demo Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-hvac-gray mb-4">
              See FieldPulse in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how FieldPulse transforms your marketing workflow with AI-powered automation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Demo Video/Preview */}
            <div className="relative">
              <div className="bg-gray-100 rounded-2xl p-8 border-2 border-gray-200">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-hvac-orange rounded-lg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">FieldPulse Dashboard</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Live Demo
                    </Badge>
                  </div>
                  
                  {/* Mock Dashboard Elements */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Facebook Post Generated</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-medium">5-Star Review Response</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">Lead Qualification Complete</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-hvac-orange/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-gray-900">
                        3 New Leads Generated This Week
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Demo Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-white/90 text-primary hover:bg-white shadow-lg backdrop-blur-sm border-2 border-primary/20"
                  onClick={handleLogin}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Try Live Demo
                </Button>
              </div>
            </div>

            {/* Demo Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Content Generation
                  </h3>
                  <p className="text-gray-600">
                    Watch our AI create professional social media posts, blog articles, and customer responses in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Smart Review Management
                  </h3>
                  <p className="text-gray-600">
                    See how FieldPulse automatically generates professional responses to customer reviews and tracks your reputation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Performance Analytics
                  </h3>
                  <p className="text-gray-600">
                    Experience real-time insights into your marketing performance with actionable recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                  onClick={handleLogin}
                >
                  Get Started Free
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