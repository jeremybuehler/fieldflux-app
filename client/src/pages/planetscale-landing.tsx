import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Users, Star, Database, Globe, Rocket, Play, TrendingUp } from "lucide-react";
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
      title: "Viral Content Creation",
      description: "Generate scroll-stopping posts, stories, and videos that get your field service business noticed across all social platforms.",
      stats: "10x more engagement",
      bgColor: "var(--fx-sky-100)",
      iconColor: "var(--fx-orange-600)"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Social Lead Magnet",
      description: "Turn followers into customers with automated DM responses, story polls, and conversion-optimized landing pages.",
      stats: "300% more leads from social",
      bgColor: "var(--fx-grass-100)",
      iconColor: "var(--fx-grass-700)"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Content Performance Analytics",
      description: "Track which posts drive the most calls, bookings, and revenue with detailed social media ROI insights.",
      stats: "See exactly what converts",
      bgColor: "var(--fx-mint-100)",
      iconColor: "var(--fx-teal-500)"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Multi-Platform Posting",
      description: "Schedule and publish content across Instagram, Facebook, TikTok, and YouTube from one powerful dashboard.",
      stats: "Save 15+ hours per week",
      bgColor: "var(--fx-sky-300)",
      iconColor: "var(--fx-navy-900)"
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
      company: "Elite HVAC",
      logo: "EH",
      quote: "Our Instagram went from 200 to 15K followers in 6 months! FieldFlux's content strategy turned us into the go-to HVAC company in our city.",
      author: "Sarah Chen",
      role: "Marketing Director",
      rating: 5,
      metric: "+7400% follower growth"
    },
    {
      company: "Apex Plumbing",
      logo: "AP",
      quote: "We're booked 3 months out thanks to our viral TikTok videos. FieldFlux helped us create content that actually converts followers into paying customers.",
      author: "Marcus Rodriguez",
      role: "Owner",
      rating: 5,
      metric: "3 month waitlist"
    },
    {
      company: "Urban Landscaping",
      logo: "UL",
      quote: "Social media felt impossible until FieldFlux. Now we're the most followed landscaper in our market and our DMs are full of project requests.",
      author: "Taylor Kim",
      role: "Creative Director",
      rating: 5,
      metric: "#1 in local market"
    }
  ];

  return (
    <div className="min-h-screen fx-hills text-gray-900 overflow-hidden">
      {/* Navigation */}
      <MainNav />
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{backgroundColor: 'var(--fx-sun-400)', opacity: 0.1}} />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" style={{backgroundColor: 'var(--fx-grass-300)', opacity: 0.15}} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <AnimatedElement>
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold shadow-lg transition-all" style={{backgroundColor: 'var(--fx-orange-600)'}}>
              <Rocket className="w-4 h-4" />
              Field Service Meets Smart Marketing
            </div>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight">
              <span style={{color: 'var(--fx-navy-900)'}}>
                Intelligent Marketing
              </span>
              <br />
              <span style={{color: 'var(--fx-orange-600)'}}>for Field Service Providers</span>
            </h1>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Create viral content, boost engagement, and grow your field service business with AI-powered social media marketing. 
              Built specifically for HVAC, plumbing, electrical, and landscaping professionals who want to dominate their local market.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={600}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="inline-flex items-center gap-3 px-10 py-4 text-lg font-bold text-white rounded-lg shadow-2xl transition-all transform hover:scale-105 hover:shadow-orange-500/25" style={{backgroundColor: 'var(--fx-orange-600)'}} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--fx-orange-700)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--fx-orange-600)'}>
                Start Creating Content
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center gap-3 px-10 py-4 text-lg font-bold border-2 rounded-lg shadow-xl hover:shadow-2xl transition-all bg-white/90 backdrop-blur-sm" style={{borderColor: 'var(--fx-navy-900)', color: 'var(--fx-navy-900)'}} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--fx-mint-50)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}>
                Watch Demo
                <Play className="w-5 h-5" />
              </button>
            </div>
          </AnimatedElement>
          
          <AnimatedElement delay={800}>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-semibold">Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-semibold">No setup fees</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-semibold">Cancel anytime</span>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>
      {/* Social Proof Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <p className="text-center text-gray-700 mb-12 text-xl font-bold">
              Trusted by 10,000+ field service professionals across social media
            </p>
          </AnimatedElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
            {[
              { name: "Instagram", color: "from-orange-500 to-orange-600", style: {backgroundColor: 'var(--fx-orange-600)'} },
              { name: "Facebook", color: "from-sky-600 to-sky-700", style: {backgroundColor: 'var(--fx-sky-700)'} },
              { name: "TikTok", color: "from-navy-700 to-navy-900", style: {backgroundColor: 'var(--fx-navy-900)'} },
              { name: "YouTube", color: "from-grass-600 to-grass-700", style: {backgroundColor: 'var(--fx-grass-700)'} }
            ].map((platform, i) => (
              <AnimatedElement key={platform.name} delay={i * 100}>
                <div className="text-lg font-bold text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-110" style={platform.style}>
                  {platform.name}
                </div>
              </AnimatedElement>
            ))}
          </div>
          
          <AnimatedElement delay={500}>
            <div className="text-center mt-12">
              <p className="text-gray-600 text-lg">
                + Connects with <span className="font-bold" style={{color: 'var(--fx-orange-600)'}}>ServiceTitan</span>, <span className="font-bold" style={{color: 'var(--fx-orange-600)'}}>Jobber</span>, <span className="font-bold" style={{color: 'var(--fx-orange-600)'}}>FieldEdge</span> & more
              </p>
            </div>
          </AnimatedElement>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 fx-grain" style={{backgroundColor: 'var(--bg-surface)'}}>
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
                Create Content That <span style={{color: 'var(--fx-orange-600)'}}>Converts</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
                Stop posting and praying. Every feature is designed to turn your social media presence into 
                a lead-generating machine for your field service business.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <AnimatedElement key={i} delay={i * 200}>
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full transform hover:scale-105 fx-grain" style={{borderColor: 'var(--border)'}}>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 rounded-2xl text-white shadow-lg transition-all" style={{backgroundColor: feature.iconColor}}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold" style={{color: 'var(--fx-navy-900)'}}>{feature.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    <div className="text-sm font-bold text-white px-4 py-2 rounded-full inline-block shadow-md" style={{backgroundColor: 'var(--fx-teal-500)'}}>
                      {feature.stats}
                    </div>
                  </div>
                </div>
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
      {/* Success Stories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
                Real Results from <span style={{color: 'var(--fx-orange-600)'}}>Real Field Service Pros</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
                These field service pros went from social media struggles to social media success stories.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <AnimatedElement key={i} delay={i * 200}>
                <div className="bg-white border rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform hover:scale-105 p-8 fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
                  <div className="p-0">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-white px-4 py-2 rounded-full text-sm font-bold mb-6 inline-block" style={{backgroundColor: 'var(--fx-orange-600)'}}>
                      {testimonial.metric}
                    </div>
                    <blockquote className="text-gray-800 mb-6 leading-relaxed font-medium text-lg">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{backgroundColor: 'var(--fx-navy-900)'}}>
                        {testimonial.logo}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{testimonial.author}</div>
                        <div className="text-gray-600 font-medium">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{background: 'linear-gradient(135deg, var(--fx-navy-900), var(--fx-navy-700))'}}>
        {/* Safety Orange Accents */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse" style={{backgroundColor: 'var(--fx-orange-600)', opacity: 0.2}} />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-2xl animate-pulse delay-1000" style={{backgroundColor: 'var(--fx-sun-400)', opacity: 0.15}} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimatedElement>
            <h2 className="text-4xl md:text-7xl font-extrabold mb-8 text-white leading-tight">
              Ready to Go Viral?
            </h2>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed font-medium max-w-3xl mx-auto">
              Join 10,000+ field service professionals who've transformed their social media presence into a lead-generating machine.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="inline-flex items-center gap-3 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all transform hover:scale-105 rounded-lg bg-white hover:bg-gray-100" style={{color: 'var(--fx-navy-900)'}}>
                Start Creating Content
                <ArrowRight className="w-6 h-6" />
              </button>
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-10 py-4 text-xl font-bold">
                See Live Demo
              </Button>
            </div>
          </AnimatedElement>
          
          <AnimatedElement delay={600}>
            <p className="text-white/80 text-lg font-medium mt-8">
              ⚡ Set up in under 5 minutes • 🎯 See results in your first week
            </p>
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