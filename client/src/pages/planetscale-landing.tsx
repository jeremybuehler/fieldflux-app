import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Users, Star, Database, Globe, Rocket } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

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
      ref={ref}
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
      title: "Lightning-Fast Performance",
      description: "Deliver content and process data at unprecedented speeds with our optimized infrastructure.",
      stats: "99.9% faster than competitors"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and end-to-end encryption.",
      stats: "Zero security incidents"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Real-time insights and actionable data to drive your business decisions.",
      stats: "500% increase in insights"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Scale",
      description: "Deploy worldwide with our distributed infrastructure and edge computing.",
      stats: "195+ countries supported"
    }
  ];

  const comparisonData = {
    "Performance": {
      "Response Time": { fieldflux: "< 50ms", competitor: "200-500ms" },
      "Uptime SLA": { fieldflux: "99.99%", competitor: "99.9%" },
      "Global CDN": { fieldflux: "✓ 200+ locations", competitor: "✓ 50 locations" },
    },
    "Features": {
      "AI-Powered Insights": { fieldflux: "✓ Advanced AI", competitor: "✗ Basic analytics" },
      "Real-time Sync": { fieldflux: "✓ Instant", competitor: "✓ 5min delay" },
      "API Rate Limits": { fieldflux: "Unlimited", competitor: "10,000/hour" },
    },
    "Support": {
      "Response Time": { fieldflux: "< 1 hour", competitor: "24-48 hours" },
      "Support Channels": { fieldflux: "24/7 Chat, Email, Phone", competitor: "Email only" },
      "Dedicated Manager": { fieldflux: "✓ Enterprise", competitor: "✗ Not available" },
    }
  };

  const testimonials = [
    {
      company: "TechCorp",
      logo: "TC",
      quote: "FieldFlux transformed our operations completely. The performance gains were immediate and substantial.",
      author: "Sarah Chen",
      role: "CTO",
      rating: 5
    },
    {
      company: "GlobalServices",
      logo: "GS",
      quote: "The best investment we've made in years. ROI was visible within the first month.",
      author: "Michael Rodriguez",
      role: "Operations Director",
      rating: 5
    },
    {
      company: "InnovateLabs",
      logo: "IL",
      quote: "Exceptional support and a platform that just works. Our team couldn't be happier.",
      author: "Emily Johnson",
      role: "Product Manager",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <AuroraBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <AnimatedElement>
            <Badge variant="outline" className="mb-6 border-blue-400/50 text-blue-400 bg-blue-500/10">
              <Rocket className="w-4 h-4 mr-2" />
              Now Available: Next-Gen Platform
            </Badge>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              The world's fastest and most{" "}
              <GradientText>scalable field service</GradientText>{" "}
              platform
            </h1>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              FieldFlux brings you the fastest field service management platform available. 
              Deliver exceptional performance with unlimited scale, powered by AI and built for the modern enterprise.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-slate-400 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </div>
          </AnimatedElement>
          
          <AnimatedElement delay={800}>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <p className="text-center text-slate-400 mb-12 text-lg">
              Trusted by industry leaders worldwide
            </p>
          </AnimatedElement>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {["Microsoft", "Google", "Amazon", "Salesforce"].map((company, i) => (
              <AnimatedElement key={company} delay={i * 100}>
                <div className="text-2xl font-bold text-slate-400">
                  {company}
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built for <GradientText>performance</GradientText> at scale
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Every feature designed to deliver exceptional speed, reliability, and insights 
                for field service teams that never compromise.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <AnimatedElement key={i} delay={i * 200}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-500 group h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 group-hover:bg-blue-600/30 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-slate-400 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="text-sm font-medium text-blue-400">
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
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                See how we <GradientText>compare</GradientText>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Don't just take our word for it. Here's how FieldFlux stacks up against the competition.
              </p>
            </div>
          </AnimatedElement>

          <AnimatedElement>
            <div className="overflow-x-auto" ref={tableRef}>
              <table className="w-full border-collapse border border-slate-700 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="p-4 text-left border-r border-slate-700"></th>
                    <th className="p-4 text-left border-r border-slate-700"></th>
                    <th className="p-4 text-center border-r border-slate-700">
                      <ShimmerText inView={tableInView}>FieldFlux</ShimmerText>
                    </th>
                    <th className="p-4 text-center">
                      <span className="text-slate-400">Competitors</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(comparisonData).map(([section, data]) => {
                    return Object.entries(data).map(([feature, comparison], i) => (
                      <tr key={`${section}-${feature}`} className="border-t border-slate-700 hover:bg-slate-800/50">
                        {i === 0 && (
                          <td rowSpan={Object.keys(data).length} className="p-4 font-semibold text-blue-400 border-r border-slate-700 align-top">
                            {section}
                          </td>
                        )}
                        <td className="p-4 border-r border-slate-700 font-medium">{feature}</td>
                        <td className="p-4 border-r border-slate-700 text-center">
                          <span className="text-green-400 font-medium">{comparison.fieldflux}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-400">{comparison.competitor}</span>
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
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Loved by <GradientText>teams worldwide</GradientText>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Join thousands of teams who have transformed their field operations with FieldFlux.
              </p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <AnimatedElement key={i} delay={i * 200}>
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-slate-300 mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                        {testimonial.logo}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-slate-400">{testimonial.role} at {testimonial.company}</div>
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
      <section className="py-24 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <AnimatedElement>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to transform your field operations?
            </h2>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of companies already using FieldFlux to deliver exceptional field service experiences.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-slate-100 px-8 py-6 text-lg font-semibold">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Contact Sales
              </Button>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <GradientText>FieldFlux</GradientText>
              </div>
              <p className="text-slate-400 mb-4">
                The world's fastest and most scalable field service platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 FieldFlux. All rights reserved.
            </p>
            <div className="flex gap-6 text-slate-400 text-sm mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}