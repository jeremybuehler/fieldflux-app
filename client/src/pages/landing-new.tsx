import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
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

export default function Landing() {
  const handleDemoAccess = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={fieldFluxLogo} 
                alt="FieldFlux Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-semibold text-slate-800">FieldFlux</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
              <Button variant="outline" size="sm" onClick={handleDemoAccess}>Sign In</Button>
              <Button size="sm" className="bg-slate-800 hover:bg-slate-700" onClick={handleDemoAccess}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-teal-50 text-teal-700 border-teal-200">
              AI-Native Marketing Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Where Field Service Meets{" "}
              <span className="gradient-text">Smart Marketing</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your field service business with AI-native marketing automation. 
              Generate leads, create content, and grow revenue—all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-lg px-8 py-3" onClick={handleDemoAccess}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal-600" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal-600" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to grow your field service business
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Streamline operations, generate quality leads, and scale your revenue with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8 text-teal-600" />,
                title: "Performance Analytics",
                description: "Track ROI, monitor lead generation, and optimize campaigns with comprehensive analytics and real-time reporting."
              },
              {
                icon: <img src={fieldFluxLogo} alt="FieldFlux Logo" className="h-8 w-8 object-contain" />,
                title: "Marketing Automation",
                description: "Generate professional content, automate follow-ups, and streamline workflows with AI-powered marketing tools."
              },
              {
                icon: <Users className="h-8 w-8 text-teal-600" />,
                title: "Lead Management",
                description: "Capture, qualify, and nurture prospects with intelligent lead scoring and automated CRM integration."
              },
              {
                icon: <Settings className="h-8 w-8 text-teal-600" />,
                title: "Service Integration",
                description: "Connect field operations with marketing campaigns for unified customer experiences and operational efficiency."
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-teal-600" />,
                title: "Revenue Growth",
                description: "Increase revenue with data-driven insights, optimized pricing strategies, and automated customer acquisition."
              },
              {
                icon: <Shield className="h-8 w-8 text-teal-600" />,
                title: "Professional Results",
                description: "Deliver consistent outcomes with proven frameworks designed specifically for field service businesses."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white border-slate-200 hover:shadow-fieldflux transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="mb-3">{feature.icon}</div>
                  <CardTitle className="text-slate-800 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Built for field service professionals who demand results
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Stop juggling multiple tools and platforms. FieldFlux combines everything you need 
                to market and grow your field service business in one powerful, easy-to-use platform.
              </p>
              <div className="space-y-4">
                {[
                  "Increase lead quality by 40% with intelligent scoring",
                  "Reduce marketing time by 60% with automation",
                  "Improve customer retention with data-driven insights",
                  "Scale operations without adding overhead"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 bg-white shadow-fieldflux">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">40%</div>
                    <div className="text-sm text-slate-600">Higher Lead Quality</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">60%</div>
                    <div className="text-sm text-slate-600">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">25%</div>
                    <div className="text-sm text-slate-600">Revenue Growth</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">90%</div>
                    <div className="text-sm text-slate-600">Customer Satisfaction</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Get started in minutes, not months
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our simple 3-step process gets your marketing automation running quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Settings className="h-8 w-8 text-teal-600" />,
                title: "Quick Setup",
                description: "Connect your existing tools and import your customer data with our simple onboarding process."
              },
              {
                step: "02",
                icon: <Target className="h-8 w-8 text-teal-600" />,
                title: "AI Configuration",
                description: "Our AI learns your business patterns and automatically configures optimal marketing workflows."
              },
              {
                step: "03",
                icon: <TrendingUp className="h-8 w-8 text-teal-600" />,
                title: "Start Growing",
                description: "Launch campaigns, track performance, and watch your lead generation and revenue grow."
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-2xl mb-6">
                  {step.icon}
                </div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-teal-600 text-white text-xs font-bold rounded-full">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your field service business?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of field service professionals who are already growing their revenue with FieldFlux
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-3" onClick={handleDemoAccess}>
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-700 text-lg px-8 py-3">
              Schedule a Demo
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">14-day free trial • No setup fees • Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={fieldFluxLogo} 
                  alt="FieldFlux Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-semibold text-white">FieldFlux</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                The AI-native marketing automation platform built specifically for field service businesses.
              </p>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle className="h-4 w-4 text-teal-600" />
                <span className="text-sm">Trusted by 1000+ field service professionals</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Features</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Integrations</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">API</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Contact</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Privacy</a>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-slate-800" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 FieldFlux. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}