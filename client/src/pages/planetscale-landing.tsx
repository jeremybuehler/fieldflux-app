import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Users, Star, Database, Globe, Rocket } from "lucide-react";
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

// Pixel grid background component
const PixelGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const gridSize = 20;
    const stars: Array<{ x: number; y: number; opacity: number; twinkle: number }> = [];

    // Create random stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width / window.devicePixelRatio,
        y: Math.random() * canvas.height / window.devicePixelRatio,
        opacity: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width / window.devicePixelRatio; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / window.devicePixelRatio);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height / window.devicePixelRatio; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / window.devicePixelRatio, y);
        ctx.stroke();
      }

      // Draw twinkling stars
      stars.forEach((star, i) => {
        star.twinkle += 0.02;
        const twinkleOpacity = (Math.sin(star.twinkle) + 1) / 2;
        ctx.fillStyle = `rgba(59, 130, 246, ${star.opacity * twinkleOpacity * 0.8})`;
        ctx.fillRect(star.x, star.y, 2, 2);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

// Aurora gradient background component
const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      <PixelGrid />
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

// Shimmering text effect for table headers
const ShimmerText = ({ children, inView }: { children: React.ReactNode; inView: boolean }) => {
  return (
    <span
      data-animate={inView}
      className="relative bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent bg-[length:400%] transition-[background-position] duration-1000 ease-out [background-position-x:100%] data-[animate=true]:[background-position-x:-35%]"
    >
      {children}
    </span>
  );
};

export default function PlanetScaleLanding() {
  const { ref: tableRef, inView: tableInView } = useIntersectionObserver({
    threshold: 0.3,
  });

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Content Creation",
      description: "Generate compelling marketing content instantly with advanced AI that understands your field service business.",
      stats: "10x faster content creation"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Smart Lead Generation",
      description: "Identify and capture high-quality leads with intelligent scoring and automated nurturing workflows.",
      stats: "300% more qualified leads"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Unified Analytics Dashboard",
      description: "Get complete visibility into your marketing performance with real-time insights and actionable recommendations.",
      stats: "50% better ROI tracking"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Review Management",
      description: "Monitor, respond to, and leverage customer reviews across all platforms to build trust and credibility.",
      stats: "4.8★ average rating boost"
    }
  ];

  const comparisonData = {
    "AI & Automation": {
      "Content Generation": { fieldflux: "✓ AI-Powered", competitor: "✗ Manual only" },
      "Lead Scoring": { fieldflux: "✓ Smart algorithms", competitor: "✓ Basic scoring" },
      "Review Management": { fieldflux: "✓ Automated responses", competitor: "✗ Manual replies" },
    },
    "Marketing Tools": {
      "Landing Page Builder": { fieldflux: "✓ AI-Generated", competitor: "✓ Template-based" },
      "SEO Optimization": { fieldflux: "✓ Real-time insights", competitor: "✓ Basic reports" },
      "Social Media Management": { fieldflux: "✓ Multi-platform", competitor: "✓ Limited platforms" },
    },
    "Analytics & Insights": {
      "Performance Tracking": { fieldflux: "✓ Real-time dashboard", competitor: "✓ Weekly reports" },
      "ROI Measurement": { fieldflux: "✓ Advanced attribution", competitor: "✓ Basic tracking" },
      "Competitive Analysis": { fieldflux: "✓ Market insights", competitor: "✗ Not available" },
    }
  };

  const testimonials = [
    {
      company: "Alpine HVAC",
      logo: "AH",
      quote: "FieldFlux completely transformed our lead generation. We're getting 3x more qualified leads and our content creation time dropped from hours to minutes.",
      author: "Mike Thompson",
      role: "Owner",
      rating: 5
    },
    {
      company: "ProFlow Plumbing",
      logo: "PP",
      quote: "The AI-powered marketing tools helped us increase our revenue by 40% in just 6 months. Best investment we've made for our business.",
      author: "Jessica Martinez",
      role: "Marketing Manager",
      rating: 5
    },
    {
      company: "GreenScape Landscaping",
      logo: "GL",
      quote: "Managing reviews across all platforms used to be a nightmare. Now it's automated and our average rating went from 4.2 to 4.8 stars.",
      author: "David Park",
      role: "Operations Manager",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
      {/* Navigation */}
      <MainNav />
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <AnimatedElement>
            <Badge variant="outline" className="mb-8 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
              <Rocket className="w-4 h-4 mr-2" />
              Field Service Meets Smart Marketing
            </Badge>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Intelligent Marketing
              </span>
              <br />
              for Field Service Providers
            </h1>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your field service business with AI-powered marketing automation. 
              Generate more leads, manage reviews, and grow your revenue with intelligent tools designed for HVAC, plumbing, electrical, and landscaping professionals.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white px-8 py-4 text-lg font-semibold shadow-sm hover:shadow-md transition-all">
                Watch Demo
              </Button>
            </div>
          </AnimatedElement>
          
          <AnimatedElement delay={800}>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>
      {/* Trusted By Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedElement>
            <p className="text-center text-slate-600 mb-12 text-lg font-medium">
              Integrates seamlessly with leading field service platforms
            </p>
          </AnimatedElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {["ServiceTitan", "Jobber", "Housecall Pro", "FieldEdge"].map((company, i) => (
              <AnimatedElement key={company} delay={i * 100}>
                <div className="text-lg font-semibold text-slate-700 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {company}
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Built for <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">performance</span> at scale
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Every feature designed to help HVAC, plumbing, electrical, and landscaping professionals 
                grow their business with intelligent marketing automation.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <AnimatedElement key={i} delay={i * 200}>
                <Card className="bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                    </div>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                      {feature.stats}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      {/* Comparison Table Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                See how we <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">compare</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Don't just take our word for it. Here's how FieldFlux stacks up against the competition.
              </p>
            </div>
          </AnimatedElement>

          <AnimatedElement>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200" ref={tableRef as React.RefObject<HTMLDivElement>}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left border-r border-gray-200"></th>
                    <th className="p-4 text-left border-r border-gray-200"></th>
                    <th className="p-4 text-center border-r border-gray-200">
                      <span className="font-semibold text-blue-600">FieldFlux</span>
                    </th>
                    <th className="p-4 text-center">
                      <span className="text-slate-600 font-medium">Competitors</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(comparisonData).map(([section, data]) => {
                    return Object.entries(data).map(([feature, comparison], i) => (
                      <tr key={`${section}-${feature}`} className="border-t border-gray-100 hover:bg-gray-50/50">
                        {i === 0 && (
                          <td rowSpan={Object.keys(data).length} className="p-4 font-semibold text-blue-600 border-r border-gray-200 align-top">
                            {section}
                          </td>
                        )}
                        <td className="p-4 border-r border-gray-200 font-medium text-slate-700">{feature}</td>
                        <td className="p-4 border-r border-gray-200 text-center">
                          <span className="text-green-600 font-medium">{comparison.fieldflux}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-500">{comparison.competitor}</span>
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </AnimatedElement>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Loved by <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">teams worldwide</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of teams who have transformed their field operations with FieldFlux.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <AnimatedElement key={i} delay={i * 200}>
                <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-slate-700 mb-6 leading-relaxed font-medium">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center font-bold text-white">
                        {testimonial.logo}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.author}</div>
                        <div className="text-sm text-slate-600">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <AnimatedElement>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Ready to transform your field operations?
            </h2>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <p className="text-xl mb-12 text-blue-100 leading-relaxed">
              Join thousands of companies already using FieldFlux to deliver exceptional field service experiences.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent px-8 py-4 text-lg font-semibold">
                Contact Sales
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">FieldFlux</span>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Intelligent marketing automation for field service professionals.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Product</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="/features" className="hover:text-slate-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-slate-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-slate-900">Support</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-slate-900 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 text-sm">
              © 2025 FieldFlux. All rights reserved.
            </p>
            <div className="flex gap-6 text-slate-600 text-sm mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}