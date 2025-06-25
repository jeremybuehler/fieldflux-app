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
        description: "Welcome back to FieldPulse!",
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
      description: "Welcome to FieldPulse! You can now log in with your credentials.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 lg:p-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-slate-800">
              FieldPulse
            </div>
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
              onClick={() => setIsAuthOpen(true)}
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">FieldPulse</h1>
                  <p className="text-lg text-slate-600">Where Field Service Meets Smart Marketing</p>
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Transform Your Field Service Business with Intelligent Marketing Automation
              </h2>
              <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
                From wrench to web presence - FieldPulse creates compelling content, manages social media, tracks leads, and grows your reputation while you focus on what you do best: serving customers.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardContent className="p-4 lg:p-6 text-center">
                  <Bot className="w-8 h-8 lg:w-12 lg:h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Content Creation</h3>
                  <p className="text-slate-600 text-sm">Generate engaging social media posts and blog content instantly</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardContent className="p-4 lg:p-6 text-center">
                  <Shield className="w-8 h-8 lg:w-12 lg:h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Lead Management</h3>
                  <p className="text-slate-600 text-sm">Capture, qualify, and nurture leads with automated workflows</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardContent className="p-4 lg:p-6 text-center">
                  <BarChart3 className="w-8 h-8 lg:w-12 lg:h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-slate-600 text-sm">Track performance with comprehensive reporting and insights</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardContent className="p-4 lg:p-6 text-center">
                  <Zap className="w-8 h-8 lg:w-12 lg:h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Automation</h3>
                  <p className="text-slate-600 text-sm">Streamline your marketing with smart automation tools</p>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-3"
                onClick={() => setIsAuthOpen(true)}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-slate-300 text-slate-700 hover:bg-slate-100 text-lg px-8 py-3"
                onClick={() => setIsAuthOpen(true)}
              >
                Try Demo
              </Button>
            </div>
          </div>
        </main>

        {/* Social Proof Section */}
        <section className="py-16 px-4 lg:px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
              Ready to Turn Service Calls into Success Stories?
            </h2>
            <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
              Join thousands of field service professionals who've discovered your business deserves great marketing. FieldPulse makes it effortless to showcase your expertise and attract more customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-3"
                onClick={() => setIsAuthOpen(true)}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-slate-300 text-slate-700 hover:bg-slate-100 text-lg px-8 py-3"
                onClick={() => setIsAuthOpen(true)}
              >
                View Demo
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Auth Dialog */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-slate-900">
              Join FieldPulse
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
                Sign In
              </Button>
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Demo: admin / demo123
                </p>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Username</label>
                  <Input
                    type="text"
                    placeholder="Choose a username"
                    value={signupData.username}
                    onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleSignup} className="w-full bg-primary hover:bg-primary/90">
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}