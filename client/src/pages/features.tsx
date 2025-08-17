import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Users, 
  BarChart3, 
  Star, 
  Globe, 
  Shield,
  Bot,
  Target,
  TrendingUp,
  MessageSquare,
  Search,
  PenTool,
  Calendar,
  FileText,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Award,
  Smartphone,
  Monitor,
  Briefcase
} from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import MainNav from "@/components/navigation/main-nav";

// Animation component for reveal on scroll
const AnimatedElement = ({ children, className = "", delay = 0 }: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => {
  const { ref, inView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0% 0px -10%',
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      data-animate={inView}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out data-[animate=true]:opacity-100 data-[animate=true]:translate-y-0 ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Gradient text component
const GradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
};

// Feature card component
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  benefits, 
  delay = 0 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  delay?: number;
}) => {
  return (
    <AnimatedElement delay={delay}>
      <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-500 group h-full">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 group-hover:bg-blue-600/30 transition-colors">
              {icon}
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          <p className="text-slate-400 mb-6 leading-relaxed">
            {description}
          </p>
          <ul className="space-y-3">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

// Interactive demo component
const InteractiveDemo = ({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-3 text-[#a0b1bd]">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-600">
        {children}
      </div>
    </div>
  );
};

export default function Features() {
  const [activeTab, setActiveTab] = useState("ai-content");

  const mainFeatures = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI-Powered Content Creation",
      description: "Generate compelling marketing content instantly with advanced AI that understands your field service business.",
      benefits: [
        "Blog posts optimized for HVAC, plumbing, electrical, and landscaping",
        "Social media content tailored to seasonal needs",
        "Email campaigns with industry-specific messaging",
        "SEO-optimized website copy that converts",
        "Product descriptions that highlight technical benefits"
      ]
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Lead Generation",
      description: "Identify and capture high-quality leads with intelligent scoring and automated nurturing workflows.",
      benefits: [
        "Lead scoring based on service type and urgency",
        "Automated follow-up sequences for different lead types",
        "Integration with popular CRM platforms",
        "Real-time lead notifications and routing",
        "Conversion tracking and optimization suggestions"
      ]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Unified Analytics Dashboard",
      description: "Get complete visibility into your marketing performance with real-time insights and actionable recommendations.",
      benefits: [
        "ROI tracking across all marketing channels",
        "Customer acquisition cost analysis",
        "Seasonal trend identification",
        "Competitor performance benchmarking",
        "Automated reporting and recommendations"
      ]
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Review Management",
      description: "Monitor, respond to, and leverage customer reviews across all platforms to build trust and credibility.",
      benefits: [
        "Multi-platform review monitoring (Google, Yelp, Facebook)",
        "AI-generated response suggestions",
        "Review request automation after job completion",
        "Reputation score tracking and alerts",
        "Review widget integration for your website"
      ]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Website Builder",
      description: "Create professional field service websites with AI-generated content and conversion-optimized layouts.",
      benefits: [
        "Industry-specific templates for HVAC, plumbing, electrical",
        "Mobile-responsive designs",
        "Local SEO optimization",
        "Online booking integration",
        "Emergency service highlight sections"
      ]
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Social Media Management",
      description: "Streamline your social media presence with automated posting and engagement tracking.",
      benefits: [
        "Scheduled posting across multiple platforms",
        "Content calendar with seasonal suggestions",
        "Engagement monitoring and response alerts",
        "Before/after photo showcase features",
        "Local community engagement tools"
      ]
    }
  ];

  const integrations = [
    { name: "ServiceTitan", category: "Field Service Management" },
    { name: "Jobber", category: "Scheduling & Invoicing" },
    { name: "Housecall Pro", category: "Business Management" },
    { name: "FieldEdge", category: "Service Operations" },
    { name: "Google My Business", category: "Local SEO" },
    { name: "Facebook Business", category: "Social Media" },
    { name: "Mailchimp", category: "Email Marketing" },
    { name: "HubSpot", category: "CRM" },
    { name: "Salesforce", category: "Sales Management" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Stripe", category: "Payment Processing" },
    { name: "Twilio", category: "SMS Communication" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <MainNav />
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <AnimatedElement>
            <Badge variant="outline" className="mb-6 border-blue-400/50 text-blue-400 bg-blue-500/10">
              <Zap className="w-4 h-4 mr-2" />
              Comprehensive Feature Suite
            </Badge>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Everything you need to <GradientText>grow your field service</GradientText> business
            </h1>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              From AI-powered content creation to intelligent lead generation, FieldFlux provides 
              all the tools HVAC, plumbing, electrical, and landscaping professionals need to dominate their local markets.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-slate-400 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent px-8 py-6 text-lg">
                Schedule Demo
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>
      {/* Feature Categories Tabs */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-slate-800/50 p-2 rounded-2xl">
                <TabsTrigger value="ai-content" className="text-xs md:text-sm">AI Content</TabsTrigger>
                <TabsTrigger value="lead-gen" className="text-xs md:text-sm">Lead Gen</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs md:text-sm">Reviews</TabsTrigger>
                <TabsTrigger value="website" className="text-xs md:text-sm">Website</TabsTrigger>
                <TabsTrigger value="social" className="text-xs md:text-sm">Social</TabsTrigger>
              </TabsList>

              <TabsContent value="ai-content" className="mt-12">
                <InteractiveDemo
                  title="AI-Powered Content Creation"
                  description="See how our AI generates field service content in seconds"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                      <PenTool className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">Generate blog post: "Emergency HVAC Repair Tips"</span>
                      <Button size="sm" className="ml-auto">Generate</Button>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Generated Content Preview:</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        "When your HVAC system breaks down unexpectedly, quick action can prevent costly damage and restore comfort to your home. Here are essential emergency repair tips every homeowner should know..."
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">SEO Optimized</Badge>
                        <Badge variant="secondary" className="text-xs">Local Keywords</Badge>
                        <Badge variant="secondary" className="text-xs">CTA Included</Badge>
                      </div>
                    </div>
                  </div>
                </InteractiveDemo>
              </TabsContent>

              <TabsContent value="lead-gen" className="mt-12">
                <InteractiveDemo
                  title="Smart Lead Generation"
                  description="Intelligent lead scoring and automated nurturing workflows"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Lead Score Factors</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Service Type: Emergency HVAC</span>
                          <span className="text-green-400">+40 points</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Location: Service Area</span>
                          <span className="text-green-400">+30 points</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Time: After Hours</span>
                          <span className="text-green-400">+25 points</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Previous Customer</span>
                          <span className="text-green-400">+20 points</span>
                        </div>
                        <div className="border-t border-slate-600 pt-2 mt-3">
                          <div className="flex justify-between font-medium">
                            <span>Total Score</span>
                            <span className="text-green-400">115 / Hot Lead</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Automated Actions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Immediate SMS to technician</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Email confirmation sent</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>CRM entry created</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span>Follow-up scheduled (24h)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveDemo>
              </TabsContent>

              <TabsContent value="analytics" className="mt-12">
                <InteractiveDemo
                  title="Unified Analytics Dashboard"
                  description="Real-time insights into your marketing performance"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-4 rounded-lg text-center">
                      <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400">$15,420</div>
                      <div className="text-sm text-slate-400">Revenue This Month</div>
                      <div className="text-xs text-green-400 mt-1">↑ 23% vs last month</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg text-center">
                      <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-400">347</div>
                      <div className="text-sm text-slate-400">New Leads</div>
                      <div className="text-xs text-blue-400 mt-1">↑ 15% vs last month</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg text-center">
                      <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-400">4.2%</div>
                      <div className="text-sm text-slate-400">Conversion Rate</div>
                      <div className="text-xs text-purple-400 mt-1">↑ 0.8% vs last month</div>
                    </div>
                  </div>
                </InteractiveDemo>
              </TabsContent>

              <TabsContent value="reviews" className="mt-12">
                <InteractiveDemo
                  title="Review Management Hub"
                  description="Monitor and respond to reviews across all platforms"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">G</span>
                        </div>
                        <div>
                          <div className="font-medium">Google My Business</div>
                          <div className="text-sm text-slate-400">New 5-star review</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <Button size="sm" variant="outline">Respond</Button>
                      </div>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <p className="text-sm italic mb-3">
                        "Excellent service! John arrived on time and fixed our AC unit quickly. Very professional and knowledgeable. Highly recommend!"
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Use AI Response
                        </Button>
                        <Button size="sm" className="bg-[#1d4ed8] text-white hover:bg-[#1e40af]">
                          Write Custom
                        </Button>
                      </div>
                    </div>
                  </div>
                </InteractiveDemo>
              </TabsContent>

              <TabsContent value="website" className="mt-12">
                <InteractiveDemo
                  title="AI Website Builder"
                  description="Create professional field service websites in minutes"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Website Features</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Mobile-responsive design</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Local SEO optimization</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Online booking integration</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Emergency contact buttons</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Service area mapping</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <div className="text-xs text-slate-400 mb-2">Preview: HVAC Website</div>
                      <div className="bg-white text-black p-3 rounded text-xs">
                        <div className="font-bold mb-1">CoolAir HVAC Services</div>
                        <div className="text-xs mb-2">Professional HVAC Repair & Installation</div>
                        <div className="flex gap-1">
                          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                            Emergency Service
                          </div>
                          <div className="bg-gray-200 px-2 py-1 rounded text-xs">
                            Free Estimates
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveDemo>
              </TabsContent>

              <TabsContent value="social" className="mt-12">
                <InteractiveDemo
                  title="Social Media Management"
                  description="Automated posting and engagement across platforms"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-800 p-4 rounded-lg text-center">
                        <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
                        <div className="text-sm font-medium">Facebook</div>
                        <div className="text-xs text-slate-400">3 posts scheduled</div>
                      </div>
                      <div className="bg-slate-800 p-4 rounded-lg text-center">
                        <div className="w-8 h-8 bg-pink-600 rounded mx-auto mb-2"></div>
                        <div className="text-sm font-medium">Instagram</div>
                        <div className="text-xs text-slate-400">5 posts scheduled</div>
                      </div>
                      <div className="bg-slate-800 p-4 rounded-lg text-center">
                        <div className="w-8 h-8 bg-sky-600 rounded mx-auto mb-2"></div>
                        <div className="text-sm font-medium">LinkedIn</div>
                        <div className="text-xs text-slate-400">2 posts scheduled</div>
                      </div>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-sm font-medium mb-2">Next Scheduled Post</div>
                      <div className="text-xs text-slate-400 mb-2">Tomorrow at 9:00 AM</div>
                      <div className="text-sm">
                        "Spring is here! Time to schedule your AC maintenance. Our certified technicians will ensure your system runs efficiently all season long. 🌟 Book today!"
                      </div>
                    </div>
                  </div>
                </InteractiveDemo>
              </TabsContent>
            </Tabs>
          </AnimatedElement>
        </div>
      </section>
      {/* Main Features Grid */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Complete <GradientText>marketing automation</GradientText> suite
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Every tool you need to attract, convert, and retain customers for your field service business.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                benefits={feature.benefits}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Integrations Section */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Seamless <GradientText>integrations</GradientText>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Connect FieldFlux with your existing tools and workflows for a unified business management experience.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {integrations.map((integration, i) => (
              <AnimatedElement key={i} delay={i * 50}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                      <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">{integration.name}</h3>
                    <p className="text-sm text-slate-400">{integration.category}</p>
                  </CardContent>
                </Card>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <AnimatedElement>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[#0d1b33]">
              Ready to supercharge your marketing?
            </h2>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <p className="text-xl mb-8 opacity-90 text-[#edf0f5]">
              Join thousands of field service professionals already using FieldFlux to grow their business.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="hover:bg-slate-100 px-8 py-6 text-lg font-semibold bg-[#051d36] text-[#ffffff]">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 bg-transparent px-8 py-6 text-lg">
                Schedule Demo
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>
    </div>
  );
}