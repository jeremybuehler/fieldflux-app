import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Shield, BarChart3, Zap, ArrowRight, User, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", username: "", password: "" });
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter your username and password.",
        variant: "destructive",
      });
      return;
    }

    // Simulate login for demo - in real implementation, this would call an API
    if (loginData.username === "admin" && loginData.password === "demo123") {
      toast({
        title: "Login Successful",
        description: "Welcome back to HVAC Pro AI!",
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

    // Simulate signup for demo
    toast({
      title: "Account Created",
      description: "Welcome to HVAC Pro AI! You can now log in with your credentials.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-hvac-orange rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-hvac-gray">HVAC Pro AI</h1>
              <p className="text-lg text-gray-600">Marketing Automation Platform</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-hvac-gray mb-4">
            Intelligent Marketing Automation for HVAC Contractors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let Dave handle your content creation, social media scheduling, SEO optimization, and lead management while you focus on what you do best.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl text-hvac-gray">Analytics & Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track your marketing performance with comprehensive analytics and automated reporting from Google Analytics integration.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-hvac-orange/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-hvac-orange" />
              </div>
              <CardTitle className="text-xl text-hvac-gray">AI Content Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generate engaging blog posts, social media content, and marketing materials tailored specifically for HVAC businesses.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-hvac-gray">Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Automatically track, qualify, and manage leads from multiple sources with intelligent scoring and follow-up reminders.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary to-hvac-orange border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Transform Your HVAC Marketing?
              </h3>
              <p className="text-blue-100 mb-6">
                Join HVAC Pro AI and experience intelligent marketing automation designed specifically for HVAC contractors in Winter Haven, FL and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-white text-primary hover:bg-gray-50 font-semibold px-8"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold text-hvac-gray">
                        Access HVAC Pro AI
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
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
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
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="pl-10"
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                            Demo access: Use <strong>admin</strong> / <strong>demo123</strong>
                          </div>
                          <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
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
                              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
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
                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
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
                                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
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
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          <Button onClick={handleSignup} className="w-full bg-hvac-orange hover:bg-hvac-orange/90">
                            Create Account
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={handleDemoAccess}
                  size="lg"
                  variant="outline"
                  className="bg-white/20 text-white border-white hover:bg-white/30 font-semibold px-8"
                >
                  View Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Secure platform designed for HVAC professionals. Your business data is protected and private.
          </p>
          <p className="text-xs mt-2">
            Already have an account? Click "Get Started" to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}