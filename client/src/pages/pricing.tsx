import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Check, Star, Zap, Crown, Rocket } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: <Rocket className="w-6 h-6" />,
    description: "Perfect for small field service businesses just getting started",
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      "AI Content Generation (50 posts/month)",
      "Basic Lead Management",
      "Social Media Scheduling",
      "Review Monitoring (2 platforms)",
      "Basic Analytics Dashboard",
      "Email Support"
    ],
    limitations: [
      "Limited to 2 team members",
      "Basic templates only",
      "Standard support"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    icon: <Star className="w-6 h-6" />,
    description: "Advanced features for growing field service operations",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      "AI Content Generation (Unlimited)",
      "Advanced Lead Scoring & Automation",
      "Multi-Platform Social Management",
      "Review Management (All platforms)",
      "Advanced Analytics & Reporting",
      "Local SEO Optimization",
      "Customer Journey Automation",
      "Priority Support"
    ],
    limitations: [
      "Up to 10 team members",
      "Custom branding available"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    icon: <Crown className="w-6 h-6" />,
    description: "Full-scale solution for large field service organizations",
    monthlyPrice: 199,
    yearlyPrice: 159,
    features: [
      "Everything in Professional",
      "White-label Solution",
      "Custom AI Training",
      "Advanced API Access",
      "Multi-location Management",
      "Custom Integrations",
      "Dedicated Account Manager",
      "24/7 Phone Support",
      "Custom Reporting",
      "Advanced Security & Compliance"
    ],
    limitations: [
      "Unlimited team members",
      "Full customization"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const faqs = [
  {
    question: "How does the free trial work?",
    answer: "Start with a 14-day free trial on any plan. No credit card required. You'll have full access to all features during your trial period."
  },
  {
    question: "Can I change plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
  },
  {
    question: "What's included in the AI content generation?",
    answer: "Our AI creates social media posts, blog content, email campaigns, and marketing materials specifically tailored for field service businesses."
  },
  {
    question: "Do you offer custom integrations?",
    answer: "Enterprise customers get access to custom integrations. Professional and Starter plans include our standard integrations with major platforms."
  },
  {
    question: "What kind of support do you provide?",
    answer: "All plans include comprehensive onboarding. Professional gets priority support, and Enterprise includes a dedicated account manager with 24/7 phone support."
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
            Choose the perfect plan for your field service business. Start free, scale as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${!isYearly ? 'font-semibold' : 'text-blue-100'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="bg-blue-500"
            />
            <span className={`text-lg ${isYearly ? 'font-semibold' : 'text-blue-100'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-yellow-400 text-yellow-900 ml-2">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative h-full ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-6 py-2 text-sm font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-green-600 font-medium">
                        Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Features included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full text-lg py-6"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => {
                      if (plan.cta === "Contact Sales") {
                        window.location.href = "mailto:sales@fieldflux.com";
                      } else {
                        window.location.href = "/api/login";
                      }
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and features
            </p>
          </div>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-4xl font-bold mb-6">
            Ready to Supercharge Your Marketing?
          </h2>
          <p className="text-xl mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-4"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}