import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Users, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Shield, 
  Clock, 
  Target 
} from "lucide-react";
import fieldFluxLogo from "@assets/fieldFlux_logo_updated_1754198391343.avif";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const { toast } = useToast();

  const handleLogin = async () => {
    // Use Replit's OIDC authentication system
    window.location.href = "/api/login";
  };

  const handleSignup = async () => {
    // Use Replit's OIDC authentication system for signup as well
    window.location.href = "/api/login";
  };

  const handleDemoAccess = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen fx-hills">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b fx-grain" style={{borderColor: 'var(--border)'}}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{backgroundColor: 'var(--fx-orange-600)'}}>
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{color: 'var(--fx-navy-900)'}}>FieldFlux</h1>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Field Service Marketing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6" style={{color: 'var(--fx-navy-900)'}}>
            Intelligent Marketing for <span style={{color: 'var(--fx-orange-600)'}}>Field Service Providers</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            FieldFlux consolidates your marketing tools into one affordable platform. 
            Perfect for HVAC, plumbing, electrical, landscaping, and field service 
            professionals who need content creation, social media management, lead tracking, 
            and reputation management in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="border-2 border-transparent hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: 'var(--fx-orange-100)'}}>
                <BarChart3 className="w-6 h-6" style={{color: 'var(--fx-orange-600)'}} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--fx-navy-900)'}}>
                Performance Insights
              </h3>
            </div>
            <div>
              <p className="text-gray-600">
                See what's working with crystal-clear analytics. Track leads,
                measure engagement, and discover which content brings in the
                most customers.
              </p>
            </div>
          </div>

          <div className="border-2 border-transparent hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 overflow-hidden" style={{backgroundColor: 'var(--fx-orange-100)'}}>
                {/* FieldFlux Logo */}
                <img 
                  src={fieldFluxLogo} 
                  alt="FieldFlux Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => console.error('Logo failed to load:', e)}
                  onLoad={() => console.log('Logo loaded successfully')}
                />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--fx-navy-900)'}}>
                Content That Converts
              </h3>
            </div>
            <div>
              <p className="text-gray-600">
                Never stare at a blank page again. FieldFlux AI creates professional
                posts, helpful tips, and customer stories that showcase your
                expertise and attract new business.
              </p>
            </div>
          </div>

          <div className="border-2 border-transparent hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
            <div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: 'var(--fx-teal-100)'}}>
                <Shield className="w-6 h-6" style={{color: 'var(--fx-teal-600)'}} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--fx-navy-900)'}}>
                Smart Lead Pipeline
              </h3>
            </div>
            <div>
              <p className="text-gray-600">
                Turn inquiries into appointments effortlessly. Smart follow-ups,
                automated reminders, and lead scoring help you close more deals
                without the hassle.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-2">
          <div className="max-w-2xl mx-auto rounded-xl p-6 lg:p-8 fx-grain" style={{backgroundColor: 'var(--bg-elevated)', border: '2px solid var(--border)'}}>
            <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4" style={{color: 'var(--fx-navy-900)'}}>
              Stop Juggling Multiple Marketing Tools
            </h3>
            <p className="text-gray-700 mb-4 lg:mb-6 text-sm lg:text-base">
              Join thousands of field service professionals who've consolidated 
              their marketing stack. FieldFlux replaces your content creation tool, 
              social media scheduler, lead manager, analytics platform, and reputation 
              management system with one affordable solution.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="font-semibold px-8 text-white hover:shadow-lg transition-all"
                      style={{backgroundColor: 'var(--fx-orange-600)', '&:hover': {backgroundColor: 'var(--fx-orange-700)'}}}
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold text-hvac-gray">
                        Access FieldFlux
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
                                  e.key === "Enter" && handleLogin()
                                }
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                            Demo access: Use <strong>admin</strong> /{" "}
                            <strong>demo123</strong>
                          </div>
                          <Button
                            onClick={handleLogin}
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
                            className="w-full bg-hvac-orange hover:bg-hvac-orange/90"
                          >
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
            Secure platform designed for professionals. Your business data is
            protected and private.
          </p>
          <p className="text-xs mt-2">
            Already have an account? Click "Get Started" to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}