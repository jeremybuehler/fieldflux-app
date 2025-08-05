import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  Bot,
  BarChart3,
  Zap,
  Users,
  ArrowRight,

  MessageSquare,
  Star,
  TrendingUp,
  Calendar,
  CheckCircle,
  Target,
  User,
  Lock,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import fieldFluxLogo from "@assets/fieldFlux_logo_updated_1754198391343.avif";

export default function LandingAuth() {
  const { isAuthenticated } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const { toast } = useToast();
  
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleDemoLogin = async () => {
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter your username and password.",
        variant: "destructive",
      });
      return;
    }

    if (loginData.username === "admin" && loginData.password === "demo123") {
      toast({
        title: "Login Successful",
        description: "Welcome back to FieldFlux!",
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Try admin/demo123 for demo access.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async () => {
    if (!signupData.name || !signupData.email || !signupData.username || !signupData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create your account.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account Created",
      description: "Welcome to FieldFlux! You can now log in with your credentials.",
    });

    setSignupData({ name: "", email: "", username: "", password: "" });
    setTimeout(() => {
      setIsAuthOpen(false);
    }, 1500);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-lg flex-shrink-0 overflow-hidden">
                <img src={fieldFluxLogo} alt="FieldFlux Logo" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-lg sm:text-xl font-bold text-gray-900">FieldFlux</span>
                <div className="text-xs text-gray-500 font-medium hidden sm:block">Intelligent Field Service Marketing</div>
                <div className="text-xs text-gray-500 font-medium sm:hidden">Smart Marketing</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
              <a href="#support" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Support</a>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {isAuthenticated ? (
                <Button 
                  onClick={handleDashboard}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">App</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={handleLogin}
                    className="text-gray-700 hover:text-gray-900 font-medium hidden sm:inline-flex"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={handleLogin}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg text-sm sm:text-base px-3 sm:px-4"
                  >
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-20 pb-16 text-center relative">
          <div className="max-w-5xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 500+ Field Service Professionals
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Where Field Service<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Meets Smart Marketing
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your field service business with AI-native marketing automation. 
              Generate leads, create content, and grow revenue—all in one platform.
            </p>

            <div className="flex justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={handleLogin}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-16">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Setup in 5 Minutes</span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-300 rounded-2xl opacity-60 hidden lg:block animate-pulse"></div>
          <div className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-green-200 to-blue-300 rounded-full opacity-70 hidden lg:block animate-bounce"></div>
          <div className="absolute top-60 right-20 w-8 h-8 bg-gradient-to-br from-orange-200 to-pink-300 rounded-full opacity-60 hidden lg:block animate-pulse"></div>
          <div className="absolute top-32 left-10 w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-300 rounded-xl opacity-50 hidden lg:block animate-pulse"></div>
          <div className="absolute top-48 left-32 w-6 h-6 bg-gradient-to-br from-pink-200 to-orange-300 rounded-full opacity-60 hidden lg:block animate-bounce"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Grow Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed specifically for field service professionals to streamline operations and accelerate growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Performance Analytics
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Track key metrics, monitor lead generation, and optimize your marketing strategy with comprehensive analytics and reporting.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  AI-Native Content
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Generate professional social media posts, blog articles, and marketing content with our advanced AI writing assistant.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Smart Lead Management
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Automate follow-ups, qualify prospects, and manage your sales pipeline with intelligent lead scoring and CRM integration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Review Management
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor and respond to customer reviews across all platforms with AI-powered response suggestions and sentiment analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-7 h-7 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Social Scheduling
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Plan and schedule content across Facebook, Instagram, LinkedIn, and Twitter with optimal timing recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Campaign Management
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Launch targeted marketing campaigns with A/B testing, conversion tracking, and ROI optimization across all channels.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl my-20">
          <div className="text-center px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Field Service Marketing?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join hundreds of contractors who've already boosted their leads and revenue with FieldFlux
            </p>
            
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleLogin}
                className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">FieldFlux</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Intelligent Field Service Marketing platform empowering contractors with AI-native tools for lead generation and business growth.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Solutions</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Lead Generation</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Content Creation</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Review Management</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Social Media</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Analytics</a>
              </div>
            </div>

            {/* Industries */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Industries</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">HVAC Contractors</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Plumbing Services</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Electrical Services</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Landscaping</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Home Services</a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Support</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Help Center</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Documentation</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">Contact Support</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">System Status</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">API Reference</a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-sm text-gray-600">
                  © 2025 FieldFlux. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}