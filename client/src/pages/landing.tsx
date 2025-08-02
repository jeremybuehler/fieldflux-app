import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  Shield,
  BarChart3,
  Zap,
  ArrowRight,
  LogIn,
} from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    // Redirect to Replit Auth login endpoint
    window.location.href = "/api/login";
  };

  const handleDemoAccess = () => {
    window.location.href = "/demo";
  };

  return (
    <div className="min-h-screen bg-white" style={{ background: 'white !important' }}>
      {/* Header */}
      <header className="topnav-fieldservice">
        <div className="container-fieldservice">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-fieldservice-blue-600 to-fieldservice-orange-500 rounded-xl flex items-center justify-center shadow-fieldservice">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-fieldservice-title text-fieldservice-blue-700">FieldFlux</h1>
                <p className="text-fieldservice-muted">Replace 5 Marketing Tools with One</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-fieldservice section-fieldservice">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fieldservice-fade-in">
          <div className="mb-8">
            <span className="badge-fieldservice">
              <Zap className="w-4 h-4" />
              Intelligent Field Service Marketing
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-fieldservice-blue-700 mb-6 leading-tight">
            Grow Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fieldservice-blue-600 to-fieldservice-orange-500 block md:inline md:ml-4">
              Service Business
            </span>
          </h1>
          
          <p className="text-xl text-fieldservice-muted max-w-3xl mx-auto mb-12 leading-relaxed">
            Streamline marketing, generate quality leads, and manage customer relationships 
            with our AI-powered platform designed specifically for HVAC, plumbing, electrical, 
            and field service professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={handleLogin}
              size="lg"
              className="bg-fieldservice-orange-500 hover:bg-fieldservice-orange-600 text-white font-semibold px-8 py-4 text-lg shadow-fieldservice"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              onClick={handleDemoAccess}
              size="lg"
              variant="outline"
              className="bg-white/20 text-fieldservice-blue-700 border-fieldservice-blue-200 hover:bg-fieldservice-blue-50 font-semibold px-8 py-4 text-lg"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Card className="card-fieldservice group">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-fieldservice-blue-500 to-fieldservice-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-fieldservice group-hover:shadow-lg transition-all">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-fieldservice-blue-700 text-xl">AI-Powered Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fieldservice-muted leading-relaxed">
                Generate professional social media posts, blog content, and marketing materials 
                tailored to your field service business with advanced AI.
              </p>
            </CardContent>
          </Card>

          <Card className="card-fieldservice group">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-fieldservice-orange-500 to-fieldservice-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-fieldservice group-hover:shadow-lg transition-all">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-fieldservice-blue-700 text-xl">Lead Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fieldservice-muted leading-relaxed">
                Smart lead scoring and qualification system that identifies high-value prospects 
                and automates follow-up sequences to maximize conversions.
              </p>
            </CardContent>
          </Card>

          <Card className="card-fieldservice group">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-fieldservice-blue-500 to-fieldservice-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-fieldservice group-hover:shadow-lg transition-all">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-fieldservice-blue-700 text-xl">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fieldservice-muted leading-relaxed">
                Comprehensive business insights with real-time metrics, performance tracking, 
                and actionable recommendations to grow your service business.
              </p>
            </CardContent>
          </Card>

          <Card className="card-fieldservice group">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-fieldservice-orange-400 to-fieldservice-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-fieldservice group-hover:shadow-lg transition-all">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-fieldservice-blue-700 text-xl">Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fieldservice-muted leading-relaxed">
                Streamline your marketing workflow with intelligent scheduling, automated 
                responses, and smart task management designed for busy field service pros.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="card-fieldservice max-w-2xl mx-auto bg-gradient-to-br from-fieldservice-blue-50 to-fieldservice-orange-50 border-0">
            <CardHeader>
              <CardTitle className="text-3xl text-fieldservice-blue-700 mb-4">
                Ready to Transform Your Marketing?
              </CardTitle>
              <p className="text-fieldservice-muted text-lg leading-relaxed mb-8">
                Join hundreds of field service professionals who have streamlined their 
                marketing and grown their businesses with FieldFlux.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleLogin}
                  size="lg"
                  className="bg-fieldservice-orange-500 hover:bg-fieldservice-orange-600 text-white font-semibold px-8 py-4"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In to Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  onClick={handleDemoAccess}
                  size="lg"
                  variant="outline"
                  className="bg-white/20 text-fieldservice-blue-700 border-fieldservice-blue-200 hover:bg-white/30 font-semibold px-8 py-4"
                >
                  View Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-fieldservice-muted">
          <p className="text-sm">
            Secure platform designed for professionals. Your business data is
            protected and private.
          </p>
          <p className="text-xs mt-2">
            Click "Sign In to Get Started" to access your account or create a new one.
          </p>
        </div>
      </div>
    </div>
  );
}