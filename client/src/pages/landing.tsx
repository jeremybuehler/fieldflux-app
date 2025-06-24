import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Shield, BarChart3, Zap, ArrowRight } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
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
              <h1 className="text-4xl font-bold text-hvac-gray">Dave AI</h1>
              <p className="text-lg text-gray-600">HVAC Marketing Agent</p>
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
                Join Dave AI and experience intelligent marketing automation designed specifically for HVAC contractors in Winter Haven, FL and beyond.
              </p>
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-white text-primary hover:bg-gray-50 font-semibold px-8"
              >
                Get Started with Dave AI
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Secure authentication powered by Replit. Your data is protected and private.
          </p>
        </div>
      </div>
    </div>
  );
}