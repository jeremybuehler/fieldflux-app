import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, BarChart3, MessageSquare, Target, Rocket, Shield, Clock, Star, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "AI Content Generation",
    description: "Create engaging social media posts, blog content, and marketing materials with AI that understands field service.",
    benefits: ["Viral social media posts", "SEO-optimized blog content", "Service-specific messaging", "Brand voice consistency"]
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Lead Management",
    description: "Intelligent lead scoring and automated follow-up sequences that convert prospects into customers.",
    benefits: ["Smart lead scoring", "Automated nurturing", "Conversion tracking", "Pipeline management"]
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Business Analytics",
    description: "Comprehensive insights into your marketing performance, customer behavior, and business growth.",
    benefits: ["Real-time dashboards", "ROI tracking", "Customer insights", "Performance reports"]
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Review Management",
    description: "Monitor and respond to customer reviews across all platforms with AI-generated responses.",
    benefits: ["Multi-platform monitoring", "AI response generation", "Reputation tracking", "Sentiment analysis"]
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Local SEO Optimization",
    description: "Dominate local search results with automated SEO strategies tailored for field service businesses.",
    benefits: ["Local keyword optimization", "Google My Business management", "Citation building", "Search ranking monitoring"]
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Marketing Automation",
    description: "Streamline your marketing efforts with intelligent automation that works while you focus on service delivery.",
    benefits: ["Email campaigns", "Social media scheduling", "Customer journeys", "Automated reporting"]
  }
];

const integrations = [
  "Google Analytics", "Google My Business", "Facebook", "Instagram", 
  "LinkedIn", "Twitter", "Yelp", "Angie's List", "HomeAdvisor", "Thumbtack"
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: "#F97316" }}
            >
              FF
            </div>
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
              FieldFlux
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <Button 
              className="text-white font-semibold"
              style={{ backgroundColor: "#F97316" }}
              onClick={() => window.location.href = "/api/login"}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-600 text-white" style={{ 
        background: `linear-gradient(135deg, #0E2545 0%, #12365E 50%, #14B8A6 100%)`
      }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Powerful Features for Field Service Growth
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
            Everything you need to transform your field service business into a marketing powerhouse
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 font-bold transition-all transform hover:scale-105 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Built for Field Service Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed specifically for HVAC, plumbing, electrical, and landscaping businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-slate-900">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-700">
                        <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Seamless Integrations
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with the tools and platforms you already use to maximize your marketing reach
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {integrations.map((integration, index) => (
              <div 
                key={index} 
                className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: "#F97316" }}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                  {integration}
                </p>
              </div>
            ))}
          </div>
          
          {/* Integration Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#F97316" }}>
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">One-Click Setup</h3>
              <p className="text-gray-600">Connect your existing tools in seconds with our streamlined integration process</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#0E2545" }}>
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Real-Time Sync</h3>
              <p className="text-gray-600">Keep all your data synchronized across platforms automatically</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#14B8A6" }}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with 99.9% uptime guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of field service professionals already growing with FieldFlux
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4"
              onClick={() => window.location.href = "/api/login"}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
              onClick={() => window.location.href = "/"}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}