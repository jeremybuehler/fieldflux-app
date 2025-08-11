import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Users, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Shield, 
  Clock, 
  Target,
  Star,
  Zap,
  MessageSquare,
  PhoneCall
} from "lucide-react";
import fieldFluxLogo from "@assets/fieldFlux_logo_updated_1754198391343.avif";

export default function LandingPocket() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const handleWatchDemo = () => {
    window.location.href = "/demo";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="relative z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <img 
                src={fieldFluxLogo} 
                alt="FieldFlux Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-bold text-foreground">FieldFlux</span>
            </div>
            
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              <a href="#features" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                Success Stories
              </a>
              <a href="#pricing" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#support" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleGetStarted} className="hidden lg:inline-flex">
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="text-center">
            <Badge className="mb-6 inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
              <Zap className="mr-2 h-4 w-4" />
              AI-Powered Field Service Marketing
            </Badge>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Transform your field service business with
              <span className="relative whitespace-nowrap text-primary">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-primary/20"
                  preserveAspectRatio="none"
                >
                  <path d="m203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">smart marketing</span>
              </span>
            </h1>
            
            <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-muted-foreground">
              Generate more leads, create better content, and grow your revenue with our AI-native marketing platform designed specifically for field service professionals.
            </p>
            
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="group bg-primary px-8 py-4 text-lg font-semibold hover:bg-primary/90 text-primary-foreground"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleWatchDemo}
                className="px-8 py-4 text-lg font-semibold"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trusted by Section */}
            <div className="mt-16">
              <p className="text-base font-semibold text-muted-foreground">
                Trusted by leading field service companies
              </p>
              <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  "HVAC Pro Solutions",
                  "Premier Plumbing Co.",
                  "Elite Electrical",
                  "Green Lawn Masters",
                  "Quick Fix Services"
                ].map((company, index) => (
                  <div key={index} className="col-span-1 flex justify-center">
                    <div className="h-12 w-32 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">{company}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-24 right-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-slate-200 to-slate-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-card py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-muted-foreground">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for field service success
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              From lead generation to customer retention, our platform handles every aspect of your marketing needs
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  name: 'Smart Analytics',
                  description: 'Track ROI, monitor campaigns, and get actionable insights with comprehensive analytics dashboards.',
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  name: 'AI Content Creation',
                  description: 'Generate compelling marketing content, social media posts, and email campaigns with AI assistance.',
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  name: 'Lead Management',
                  description: 'Capture, qualify, and nurture prospects with intelligent lead scoring and automated follow-ups.',
                },
                {
                  icon: <MessageSquare className="h-6 w-6" />,
                  name: 'Review Management',
                  description: 'Monitor online reviews, respond professionally, and build your reputation across all platforms.',
                },
                {
                  icon: <Settings className="h-6 w-6" />,
                  name: 'Workflow Automation',
                  description: 'Automate repetitive marketing tasks and focus on what matters most - growing your business.',
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  name: 'Reliable Support',
                  description: '24/7 customer support and dedicated success manager to help you achieve your goals.',
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-secondary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-muted-foreground">
              Testimonials
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loved by field service professionals
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-foreground sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
            {[
              {
                quote: "FieldFlux increased our lead generation by 150% in just 3 months. The AI content creation saves us hours every week.",
                author: "Sarah Chen",
                role: "Owner, Pro HVAC Solutions",
                rating: 5
              },
              {
                quote: "Finally, a marketing platform that understands field service. The automation features are a game-changer for our workflow.",
                author: "Mike Rodriguez",
                role: "Manager, Elite Plumbing Co.",
                rating: 5
              },
              {
                quote: "Customer reviews have improved dramatically since using FieldFlux. Their response management system is incredibly effective.",
                author: "Jennifer Park",
                role: "Director, Green Lawn Care",
                rating: 5
              },
              {
                quote: "The ROI analytics help us make data-driven decisions. We've optimized our marketing spend and doubled our conversion rate.",
                author: "David Thompson",
                role: "CEO, Quick Fix Services",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="flex flex-col justify-between">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-chart-3 text-chart-3" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Choose the perfect plan for your business. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
            {[
              {
                name: 'Starter',
                id: 'tier-starter',
                price: { monthly: '$49', annually: '$39' },
                description: 'Perfect for small field service businesses getting started.',
                features: [
                  'Up to 500 leads per month',
                  'Basic AI content generation',
                  'Social media scheduling',
                  'Email marketing',
                  'Basic analytics'
                ],
                mostPopular: false,
              },
              {
                name: 'Professional',
                id: 'tier-professional',
                price: { monthly: '$99', annually: '$79' },
                description: 'Best for growing businesses that need advanced features.',
                features: [
                  'Up to 2,000 leads per month',
                  'Advanced AI content generation',
                  'Multi-platform social scheduling',
                  'Review management',
                  'Advanced analytics',
                  'Priority support'
                ],
                mostPopular: true,
              },
              {
                name: 'Enterprise',
                id: 'tier-enterprise',
                price: { monthly: '$199', annually: '$159' },
                description: 'For large businesses with complex needs.',
                features: [
                  'Unlimited leads',
                  'Custom AI training',
                  'White-label options',
                  'API access',
                  'Custom integrations',
                  'Dedicated success manager'
                ],
                mostPopular: false,
              },
            ].map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative ${tier.mostPopular ? 'border-slate-900 shadow-lg scale-105' : 'border-slate-200'}`}
              >
                {tier.mostPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-semibold">{tier.name}</CardTitle>
                  <div className="mt-4 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-slate-900">
                      {tier.price.monthly}
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-slate-600">
                      /month
                    </span>
                  </div>
                  <CardDescription className="mt-6">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul role="list" className="space-y-3 text-sm leading-6 text-slate-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckCircle className="h-6 w-5 flex-none text-slate-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`mt-8 w-full ${tier.mostPopular ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your field service business?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Join thousands of field service professionals who are already growing their businesses with FieldFlux.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-slate-900 hover:bg-slate-100"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg"
                variant="ghost"
                onClick={handleWatchDemo}
                className="text-white hover:bg-slate-800"
              >
                <PhoneCall className="mr-2 h-5 w-5" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white" aria-labelledby="footer-heading">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center space-x-3">
                <img 
                  src={fieldFluxLogo} 
                  alt="FieldFlux Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-2xl font-bold text-slate-900">FieldFlux</span>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                The all-in-one marketing platform designed specifically for field service professionals.
              </p>
              <div className="flex space-x-6">
                {/* Social media links would go here */}
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-slate-900">Product</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#features" className="text-sm leading-6 text-slate-600 hover:text-slate-900">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#pricing" className="text-sm leading-6 text-slate-600 hover:text-slate-900">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="/demo" className="text-sm leading-6 text-slate-600 hover:text-slate-900">
                        Demo
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-slate-900">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <span className="text-sm leading-6 text-slate-600">
                        Documentation
                      </span>
                    </li>
                    <li>
                      <span className="text-sm leading-6 text-slate-600">
                        API Reference
                      </span>
                    </li>
                    <li>
                      <span className="text-sm leading-6 text-slate-600">
                        Help Center
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-slate-900">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <span className="text-sm leading-6 text-slate-600">
                        About
                      </span>
                    </li>
                    <li>
                      <span className="text-sm leading-6 text-slate-600">
                        Blog
                      </span>
                    </li>
                    <li>
                      <span className="text-sm leading-6 text-slate-600">
                        Careers
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-slate-900">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <span className="text-sm leading-6 text-slate-600">
                        Privacy
                      </span>
                    </li>
                    <li>
                      <span className="text-sm leading-6 text-slate-600">
                        Terms
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-900/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-slate-500">
              &copy; 2025 FieldFlux. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}