import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Play, Pause, RotateCcw, Zap, Users, BarChart3, MessageSquare, Star, Clock } from "lucide-react";

const demoSections = [
  {
    id: "felix-chat",
    title: "Felix AI Assistant",
    description: "Your intelligent marketing companion that understands field service",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "Natural language conversations",
      "Field service-specific knowledge",
      "Instant content generation",
      "Business strategy recommendations"
    ],
    screenshot: "/api/placeholder/800/500"
  },
  {
    id: "content-generation",
    title: "AI Content Creation",
    description: "Generate viral social media content in seconds",
    icon: <MessageSquare className="w-6 h-6" />,
    features: [
      "Social media posts",
      "Blog articles",
      "Email campaigns",
      "Service descriptions"
    ],
    screenshot: "/api/placeholder/800/500"
  },
  {
    id: "lead-management",
    title: "Smart Lead Management",
    description: "AI-powered lead scoring and automated follow-up",
    icon: <Users className="w-6 h-6" />,
    features: [
      "Intelligent lead scoring",
      "Automated nurture sequences",
      "Conversion tracking",
      "Pipeline management"
    ],
    screenshot: "/api/placeholder/800/500"
  },
  {
    id: "analytics",
    title: "Business Analytics",
    description: "Comprehensive insights into your marketing performance",
    icon: <BarChart3 className="w-6 h-6" />,
    features: [
      "Real-time dashboards",
      "ROI tracking",
      "Customer insights",
      "Performance reports"
    ],
    screenshot: "/api/placeholder/800/500"
  }
];

const testimonials = [
  {
    text: "FieldFlux transformed our social media presence. We went from 200 followers to 5,000 in just 3 months!",
    author: "Mike Johnson",
    company: "Johnson HVAC",
    rating: 5
  },
  {
    text: "The AI content generation saves us 20+ hours per week. The posts actually sound like they're written by someone who knows HVAC.",
    author: "Sarah Davis",
    company: "Pro Plumbing Solutions",
    rating: 5
  },
  {
    text: "Our lead conversion rate increased by 40% after implementing FieldFlux's automated follow-up sequences.",
    author: "Tom Rodriguez",
    company: "Elite Electrical Services",
    rating: 5
  }
];

export default function Demo() {
  const [activeSection, setActiveSection] = useState("felix-chat");
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSection = demoSections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            See FieldFlux in Action
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
            Watch how field service professionals are transforming their marketing with AI-powered automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              onClick={() => window.location.href = "/api/login"}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isPlaying ? "Pause Demo" : "Play Demo"}
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Interactive Product Demo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the key features that make FieldFlux the #1 choice for field service marketing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature Navigation */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {demoSections.map((section) => (
                  <Card 
                    key={section.id}
                    className={`cursor-pointer transition-all ${
                      activeSection === section.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === section.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Demo Viewer */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg text-white">
                        {currentSection?.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{currentSection?.title}</CardTitle>
                        <p className="text-gray-600">{currentSection?.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Demo Screenshot/Video Area */}
                  <div className="bg-gray-900 rounded-lg aspect-video mb-6 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-75" />
                      <p className="text-lg">Interactive Demo Player</p>
                      <p className="text-sm opacity-75">
                        {isPlaying ? "Demo is playing..." : "Click features to explore"}
                      </p>
                    </div>
                  </div>

                  {/* Feature List */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Key Features:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentSection?.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Live Results Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Real Results from Real Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how field service professionals are growing their businesses with FieldFlux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4 leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Built for Your Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized features for different field service verticals
            </p>
          </div>

          <Tabs defaultValue="hvac" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="hvac">HVAC</TabsTrigger>
              <TabsTrigger value="plumbing">Plumbing</TabsTrigger>
              <TabsTrigger value="electrical">Electrical</TabsTrigger>
              <TabsTrigger value="landscaping">Landscaping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hvac">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">HVAC-Specific Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Seasonal Campaign Automation</h4>
                      <p className="text-gray-600 mb-4">Automatically promote AC service in summer, heating maintenance in fall</p>
                      
                      <h4 className="font-semibold mb-2">Emergency Service Promotion</h4>
                      <p className="text-gray-600">24/7 emergency messaging that builds trust and urgency</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Energy Efficiency Content</h4>
                      <p className="text-gray-600 mb-4">Educational content about energy savings and system optimization</p>
                      
                      <h4 className="font-semibold mb-2">Maintenance Reminders</h4>
                      <p className="text-gray-600">Automated follow-up for filter changes and seasonal tune-ups</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="plumbing">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Plumbing-Specific Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Emergency Response Marketing</h4>
                      <p className="text-gray-600 mb-4">Urgent messaging for burst pipes, water damage, and leak detection</p>
                      
                      <h4 className="font-semibold mb-2">Water Conservation Content</h4>
                      <p className="text-gray-600">Educational posts about water-saving fixtures and practices</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Seasonal Pipe Protection</h4>
                      <p className="text-gray-600 mb-4">Winter freeze prevention and summer water pressure tips</p>
                      
                      <h4 className="font-semibold mb-2">Fixture Upgrade Campaigns</h4>
                      <p className="text-gray-600">Automated promotion of modern fixtures and appliances</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="electrical">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Electrical-Specific Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Safety-First Messaging</h4>
                      <p className="text-gray-600 mb-4">Educational content about electrical safety and code compliance</p>
                      
                      <h4 className="font-semibold mb-2">Smart Home Integration</h4>
                      <p className="text-gray-600">Content about home automation and smart electrical solutions</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Panel Upgrade Campaigns</h4>
                      <p className="text-gray-600 mb-4">Automated promotion of electrical panel modernization</p>
                      
                      <h4 className="font-semibold mb-2">Energy Efficiency Focus</h4>
                      <p className="text-gray-600">LED upgrades, energy audits, and cost-saving solutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="landscaping">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Landscaping-Specific Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Seasonal Service Automation</h4>
                      <p className="text-gray-600 mb-4">Spring cleanup, summer maintenance, fall preparation campaigns</p>
                      
                      <h4 className="font-semibold mb-2">Plant Care Education</h4>
                      <p className="text-gray-600">Seasonal plant care tips and landscape maintenance advice</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Design Showcase Content</h4>
                      <p className="text-gray-600 mb-4">Before/after project galleries and design inspiration</p>
                      
                      <h4 className="font-semibold mb-2">Sustainable Practices</h4>
                      <p className="text-gray-600">Eco-friendly landscaping and water-wise garden solutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Clock className="w-16 h-16 mx-auto mb-6 text-blue-400" />
          <h2 className="text-4xl font-bold mb-6">
            Ready to See Your Business Transform?
          </h2>
          <p className="text-xl mb-8">
            Start your free trial today and experience the power of AI-driven field service marketing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-4"
              onClick={() => window.location.href = "/api/login"}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
              onClick={() => window.location.href = "mailto:demo@fieldflux.com"}
            >
              Schedule Personal Demo
            </Button>
          </div>
          <p className="text-gray-400 mt-6">
            ⚡ No credit card required • 🎯 Full access to all features • 📞 Get expert onboarding
          </p>
        </div>
      </section>
    </div>
  );
}