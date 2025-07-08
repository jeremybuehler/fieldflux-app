import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  BarChart3,
  Zap,
  Users,
  ArrowRight,
} from "lucide-react";

export default function LandingAuth() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Login/Sign-Up */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-hvac-orange rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-hvac-gray">FieldPulse</h1>
            </div>
          </div>
          <Button 
            variant="outline"
            onClick={handleLogin}
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Login/Sign-Up
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-hvac-orange rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-hvac-gray">FieldPulse</h1>
              <p className="text-lg text-gray-600">Replace 5 Marketing Tools with One</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-hvac-gray mb-4">
            Stop Paying 5 Companies - Get Everything in One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            FieldPulse consolidates social media management, review monitoring, 
            customer communication, content creation, and analytics into one 
            affordable solution for field service professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-hvac-gray mb-2">
                All-in-One Analytics
              </h3>
              <p className="text-gray-600">
                Replace expensive analytics tools with comprehensive reporting. 
                Track leads, measure engagement, and see which marketing efforts 
                bring in the most field service customers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-hvac-orange/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-hvac-orange" />
              </div>
              <h3 className="text-xl font-semibold text-hvac-gray mb-2">
                Field Service Content Creation
              </h3>
              <p className="text-gray-600">
                Generate HVAC, plumbing, electrical, and landscaping content 
                that converts. From seasonal maintenance tips to emergency 
                service promotions - all created for your industry.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-hvac-gray mb-2">
                Centralized Lead Management
              </h3>
              <p className="text-gray-600">
                Stop losing service calls to competitors. Automated follow-ups, 
                priority scoring, and intelligent scheduling keep your field 
                service pipeline flowing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-primary to-hvac-orange text-white border-0 max-w-lg mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-lg mb-6 text-white/90">
                Join HVAC, plumbing, electrical, and landscaping professionals 
                who stopped overpaying for multiple marketing tools.
              </p>
              
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-50 font-semibold px-8 mb-4"
                onClick={handleLogin}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <div className="text-sm text-white/80">
                Already have an account?{" "}
                <button 
                  onClick={handleLogin}
                  className="underline hover:text-white font-medium"
                >
                  Login/Sign-Up
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Secure platform designed for field service professionals. Your 
            customer data is protected and private.
          </p>
        </div>
      </div>
    </div>
  );
}