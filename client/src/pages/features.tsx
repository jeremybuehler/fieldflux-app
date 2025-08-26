import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, BarChart3, MessageSquare, Target, Rocket, Shield, Clock, Star } from "lucide-react";

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
      {/* Header */}
      <section className="py-24 bg-gradient-to-br text-white fx-hills fx-grain" style={{ 
        background: `linear-gradient(135deg, var(--fx-navy-900) 0%, var(--fx-navy-700) 50%, var(--fx-teal-600) 100%)`
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
            className="text-lg px-8 py-4 font-bold transition-all transform hover:scale-105"
            style={{ 
              backgroundColor: "var(--fx-orange-600)",
              color: "white"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--fx-orange-700)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--fx-orange-600)"}
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
                    <div className="p-3 rounded-lg" style={{
                      backgroundColor: "var(--fx-orange-100)",
                      color: "var(--fx-orange-600)"
                    }}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl" style={{ color: "var(--fx-navy-900)" }}>
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
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Seamless Integrations
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with the tools and platforms you already use
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {integrations.map((integration, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
                <p className="font-medium text-gray-900">{integration}</p>
              </div>
            ))}
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
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
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