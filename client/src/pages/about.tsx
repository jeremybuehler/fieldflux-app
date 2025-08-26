import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Lightbulb, Heart, Award, Zap } from "lucide-react";

const team = [
  {
    name: "Jeremy Buehler",
    role: "Founder & CEO",
    bio: "20+ years in field service operations and marketing automation. Former ServiceTitan executive.",
    avatar: "JB"
  },
  {
    name: "Sarah Chen",
    role: "Head of Product",
    bio: "Product leader with expertise in AI/ML applications for small business marketing.",
    avatar: "SC"
  },
  {
    name: "Mike Rodriguez",
    role: "VP of Engineering",
    bio: "Full-stack engineer passionate about building tools that help businesses grow.",
    avatar: "MR"
  },
  {
    name: "Lisa Thompson",
    role: "Head of Customer Success",
    bio: "15 years helping field service companies optimize their operations and marketing.",
    avatar: "LT"
  }
];

const values = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Field Service First",
    description: "We understand the unique challenges of field service businesses because we've lived them."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Intelligent Automation",
    description: "Smart technology that works behind the scenes so you can focus on serving customers."
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Results-Driven",
    description: "Every feature is designed to measurably grow your business and improve your bottom line."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community-Focused",
    description: "Building a community of successful field service professionals who learn from each other."
  }
];

const stats = [
  { number: "10,000+", label: "Field Service Businesses" },
  { number: "50M+", label: "Content Pieces Generated" },
  { number: "300%", label: "Average Lead Increase" },
  { number: "99.9%", label: "Platform Uptime" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Empowering Field Service Excellence
              </h1>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed">
                We're on a mission to help field service professionals build thriving businesses 
                through intelligent marketing automation and AI-powered growth strategies.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                onClick={() => window.location.href = "/api/login"}
              >
                Join Our Mission
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {stat.number}
                      </div>
                      <div className="text-blue-100 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  FieldFlux was born from frustration. As field service professionals ourselves, 
                  we saw talented technicians and business owners struggling with marketing while 
                  generic solutions ignored our industry's unique needs.
                </p>
                <p>
                  Traditional marketing tools weren't built for the field service world. They didn't 
                  understand seasonal demands, emergency calls, or the trust-building required in 
                  home service businesses.
                </p>
                <p>
                  So we built something different. FieldFlux combines deep field service expertise 
                  with cutting-edge AI to create marketing automation that actually works for 
                  HVAC, plumbing, electrical, and landscaping professionals.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
                <Lightbulb className="w-16 h-16 text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  The Lightbulb Moment
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  "When I realized our HVAC company was spending 40 hours a week on marketing 
                  tasks that could be automated, I knew there had to be a better way. That's 
                  when FieldFlux was born."
                </p>
                <p className="text-sm text-gray-600 mt-4 font-medium">
                  - Jeremy Buehler, Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Field service veterans and technology experts working together to transform your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Industry Recognition
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Trusted by industry leaders and recognized for innovation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Best AI Marketing Tool</h3>
                <p className="text-gray-600">ServiceTech Awards 2024</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Top Field Service Innovation</h3>
                <p className="text-gray-600">HVAC Excellence 2024</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Customer Choice Award</h3>
                <p className="text-gray-600">Contractor Magazine 2024</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of field service professionals who've chosen FieldFlux
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              onClick={() => window.location.href = "/api/login"}
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
              onClick={() => window.location.href = "mailto:hello@fieldflux.com"}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}