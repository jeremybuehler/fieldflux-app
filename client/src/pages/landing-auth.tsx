
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">FieldPulse</span>
            </div>
            <Button 
              variant="outline"
              onClick={handleLogin}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="pt-16 pb-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Where Field Service<br />
              Meets Smart Marketing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A powerful platform to streamline content,<br />
              automate leads, and grow your service business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                onClick={handleLogin}
              >
                Get Started Free
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Setup in 5 Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 right-10 w-32 h-20 bg-blue-100 rounded-lg opacity-50 hidden lg:block"></div>
          <div className="absolute top-32 right-32 w-8 h-8 bg-green-200 rounded-full opacity-60 hidden lg:block"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-orange-200 rounded-full opacity-50 hidden lg:block"></div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Performance Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Gain visibility into key metrics and track your success with in-depth analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Content That Converts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create professional posts, ads, and blogs to attract and engage customers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Lead Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Automate follow-ups and manage your pipeline with ease.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data</h3>
              <p className="text-gray-600">Connect your business data sources</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Content</h3>
              <p className="text-gray-600">Generate professional marketing materials</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto Publishing</h3>
              <p className="text-gray-600">Distribute across all your channels</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Kelly Patterson</div>
                    <div className="text-sm text-gray-600">Elite HVAC</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "An indispensable tool for our business."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Kelly Patterson</div>
                    <div className="text-sm text-gray-600">Elite HVAC</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "An indispensable tool for our basic service needs and remarkable growth in leads and customer inquiries."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Lisa Owens</div>
                    <div className="text-sm text-gray-600">Prolemica Plumbing</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "With FieldPulse, we can perform on our work to our marketing practically manages itself."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Partners Section */}
        <div className="py-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-8">Experts Advocate</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              <span className="font-semibold">Google</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <span className="font-semibold">OpenAI</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              <span className="font-semibold">WordPress</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              <span className="font-semibold">Twilio</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6" />
              <span className="font-semibold">TrueHot</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-16">
          <Card className="bg-blue-600 text-white border-0 max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Join 500+ Service Pros Growing with FieldPulse
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-lg text-gray-900 w-full sm:w-80"
                />
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
                  onClick={handleLogin}
                >
                  Get Started
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t bg-white">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">About</h4>
              <div className="space-y-2 text-gray-600">
                <div>Terms</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Ev Contactted</h4>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
