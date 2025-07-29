
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
  Play,
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

    // Demo login functionality
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
        description:
          "Invalid username or password. Try admin/demo123 for demo access.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async () => {
    if (
      !signupData.name ||
      !signupData.email ||
      !signupData.username ||
      !signupData.password
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create your account.",
        variant: "destructive",
      });
      return;
    }

    // Demo signup functionality
    toast({
      title: "Account Created",
      description:
        "Welcome to FieldFlux! You can now log in with your credentials.",
    });

    // Reset form and switch to login tab
    setSignupData({ name: "", email: "", username: "", password: "" });
    setTimeout(() => {
      setIsAuthOpen(false);
    }, 1500);
  };

  const handleDemoAccess = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">FieldFlux</span>
                <div className="text-xs text-gray-500 font-medium">Intelligent Field Service Marketing</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
              <a href="#support" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Support</a>
            </nav>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <Button 
                  onClick={handleDashboard}
                  className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost"
                    onClick={handleLogin}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center relative">
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={handleLogin}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleDemoAccess}
                className="px-10 py-4 text-lg border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 bg-white/50 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-16">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Setup in 5 Minutes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Cancel Anytime</span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-300 rounded-2xl opacity-60 hidden lg:block animate-pulse"></div>
          <div className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-green-200 to-blue-300 rounded-full opacity-70 hidden lg:block animate-bounce"></div>
          <div className="absolute top-60 right-20 w-8 h-8 bg-gradient-to-br from-orange-200 to-pink-300 rounded-full opacity-60 hidden lg:block animate-pulse"></div>
          <div className="absolute top-32 left-10 w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-300 rounded-xl opacity-50 hidden lg:block animate-pulse"></div>
          <div className="absolute top-48 left-32 w-6 h-6 bg-gradient-to-br from-pink-200 to-orange-300 rounded-full opacity-60 hidden lg:block animate-bounce"></div>
        </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">How FieldFlux Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your field service marketing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BarChart3 className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect Your Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Link your business tools, Google Analytics, and social media accounts for comprehensive insights
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Bot className="w-10 h-10 text-purple-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Creates Content</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes your business and generates professional marketing content tailored to your industry
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Grow Your Business</h3>
              <p className="text-gray-600 leading-relaxed">
                Watch leads increase, reviews improve, and revenue grow with automated marketing workflows
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from field service professionals who transformed their business
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mike Rodriguez</div>
                    <div className="text-sm text-gray-600">Rodriguez HVAC Services</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "FieldFlux saved me 10 hours a week on marketing tasks. The AI content creation is spot-on for HVAC services, and I've seen a 40% increase in qualified leads."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-lg">ST</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Thompson</div>
                    <div className="text-sm text-gray-600">Thompson Electrical</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Before FieldFlux, I was juggling five different tools for marketing. Now everything is in one place, and my Google reviews have improved dramatically."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-lg">JC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">James Carter</div>
                    <div className="text-sm text-gray-600">Carter Plumbing & Repair</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The lead scoring feature is a game-changer. I can focus on the hottest prospects first and close deals faster. ROI paid for itself in the first month."
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 bg-gray-50/50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-8">Trusted by Industry Leaders</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
              <div className="flex items-center gap-3 text-gray-600">
                <BarChart3 className="w-6 h-6" />
                <span className="font-semibold text-lg">Google Analytics</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Bot className="w-6 h-6" />
                <span className="font-semibold text-lg">OpenAI</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Target className="w-6 h-6" />
                <span className="font-semibold text-lg">WordPress</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MessageSquare className="w-6 h-6" />
                <span className="font-semibold text-lg">Twilio</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Field Service Marketing?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join hundreds of contractors who've already boosted their leads and revenue with FieldFlux
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                onClick={handleLogin}
                className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleDemoAccess}
                className="border-2 border-white text-white hover:bg-white/10 px-10 py-4 text-lg bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>14-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Auth Card Section */}
        <section className="py-20">
          <Card className="bg-gradient-to-br from-mint-500 to-mint-600 text-black border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4 text-black">Ready to Transform Your Marketing?</h3>
              <p className="text-xl mb-6 text-black/80">
                Join 500+ field service professionals who are already growing their business with FieldFlux.
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {isAuthenticated ? (
                    <Button 
                      size="lg" 
                      className="bg-white text-black hover:bg-gray-50 font-semibold px-12 py-4 text-lg"
                      onClick={handleDashboard}
                    >
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-white text-black hover:bg-gray-50 font-semibold px-12 py-4 text-lg"
                      onClick={handleLogin}
                    >
                      Sign in with Replit
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                  
                  <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="bg-white/10 text-black border-black/20 hover:bg-white/20 font-semibold px-8 py-4 text-lg"
                      >
                        Demo Access
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold text-hvac-gray">
                          Demo Access
                        </DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="login">Login</TabsTrigger>
                          <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Username
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  type="text"
                                  placeholder="Enter your username"
                                  value={loginData.username}
                                  onChange={(e) =>
                                    setLoginData({
                                      ...loginData,
                                      username: e.target.value,
                                    })
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  value={loginData.password}
                                  onChange={(e) =>
                                    setLoginData({
                                      ...loginData,
                                      password: e.target.value,
                                    })
                                  }
                                  className="pl-10"
                                  onKeyPress={(e) =>
                                    e.key === "Enter" && handleDemoLogin()
                                  }
                                />
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                              Demo access: Use <strong>admin</strong> /{" "}
                              <strong>demo123</strong>
                            </div>
                            <Button
                              onClick={handleDemoLogin}
                              className="w-full bg-primary hover:bg-primary/90"
                            >
                              Sign In
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Full Name
                              </label>
                              <Input
                                type="text"
                                placeholder="Enter your full name"
                                value={signupData.name}
                                onChange={(e) =>
                                  setSignupData({
                                    ...signupData,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Email
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  value={signupData.email}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      email: e.target.value,
                                    })
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Username
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  type="text"
                                  placeholder="Choose a username"
                                  value={signupData.username}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      username: e.target.value,
                                    })
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  type="password"
                                  placeholder="Create a password"
                                  value={signupData.password}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      password: e.target.value,
                                    })
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            <Button
                              onClick={handleSignup}
                              className="w-full bg-mint-500 hover:bg-mint-600 text-white"
                            >
                              Create Account
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>

                <Button
                  onClick={handleDemoAccess}
                  size="sm"
                  variant="ghost"
                  className="text-black/70 hover:text-black hover:bg-white/10 w-full"
                >
                  Skip to Demo Dashboard
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
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
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
    </div>
  );
}
