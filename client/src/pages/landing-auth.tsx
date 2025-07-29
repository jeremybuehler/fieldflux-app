
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">FieldFlux</span>
            </div>
            {isAuthenticated ? (
              <Button 
                variant="outline"
                onClick={handleDashboard}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={handleLogin}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
            )}
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

        {/* Enhanced CTA Section */}
        <div className="py-16">
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
