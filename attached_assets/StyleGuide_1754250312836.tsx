import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { CheckCircle, Star, Zap, Users, BarChart3, Settings, TrendingUp } from "lucide-react";
import fieldFluxLogo from "figma:asset/d14cc83936e612aab13d1a899f4b7aa20bb56e6a.png";

export function StyleGuide() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={fieldFluxLogo} 
                alt="FieldFlux Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-semibold text-slate-800">FieldFlux</span>
              <Badge variant="secondary" className="ml-2">Style Guide</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="gradient-text mb-4">FieldFlux Design System</h1>
          <p className="lead max-w-2xl mx-auto text-slate-600">
            A professional design system for field service marketing automation platforms.
            Built for clarity, efficiency, and business results.
          </p>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="brand">Brand</TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-8">
            <div>
              <h2 className="mb-6 text-slate-800">Color Palette</h2>
              
              {/* Primary Colors */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700">Primary Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ColorSwatch color="#374151" name="Primary" description="Main brand color" />
                  <ColorSwatch color="#6B7280" name="Secondary" description="Secondary brand color" />
                  <ColorSwatch color="#0F766E" name="Accent" description="Accent & actions" />
                  <ColorSwatch color="#059669" name="Success" description="Success states" />
                </div>
              </div>

              {/* Professional Slate Scale */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700">Slate Scale</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <ColorSwatch color="#F8FAFC" name="Slate 50" border />
                  <ColorSwatch color="#F1F5F9" name="Slate 100" />
                  <ColorSwatch color="#E2E8F0" name="Slate 200" />
                  <ColorSwatch color="#CBD5E1" name="Slate 300" />
                  <ColorSwatch color="#94A3B8" name="Slate 400" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <ColorSwatch color="#64748B" name="Slate 500" />
                  <ColorSwatch color="#475569" name="Slate 600" />
                  <ColorSwatch color="#334155" name="Slate 700" />
                  <ColorSwatch color="#1E293B" name="Slate 800" />
                  <ColorSwatch color="#0F172A" name="Slate 900" />
                </div>
              </div>

              {/* Teal Accent Scale */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700">Teal Accent Scale</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <ColorSwatch color="#F0FDFA" name="Teal 50" border />
                  <ColorSwatch color="#CCFBF1" name="Teal 100" />
                  <ColorSwatch color="#99F6E4" name="Teal 200" />
                  <ColorSwatch color="#5EEAD4" name="Teal 300" />
                  <ColorSwatch color="#2DD4BF" name="Teal 400" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <ColorSwatch color="#14B8A6" name="Teal 500" />
                  <ColorSwatch color="#0D9488" name="Teal 600" />
                  <ColorSwatch color="#0F766E" name="Teal 700" />
                  <ColorSwatch color="#115E59" name="Teal 800" />
                  <ColorSwatch color="#134E4A" name="Teal 900" />
                </div>
              </div>

              {/* Gradients */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700">Gradients</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-24 gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Primary Gradient</span>
                  </div>
                  <div className="h-24 gradient-accent rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Accent Gradient</span>
                  </div>
                  <div className="h-24 gradient-subtle rounded-lg flex items-center justify-center border">
                    <span className="text-slate-600 font-medium">Subtle Gradient</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-8">
            <div>
              <h2 className="mb-6 text-slate-800">Typography Scale</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-white border rounded-lg">
                  <h1>Heading 1</h1>
                  <p className="text-sm text-slate-500 mt-2">40px / Bold / -0.02em / Slate 900</p>
                </div>
                
                <div className="p-6 bg-white border rounded-lg">
                  <h2>Heading 2</h2>
                  <p className="text-sm text-slate-500 mt-2">32px / Bold / -0.01em / Slate 800</p>
                </div>
                
                <div className="p-6 bg-white border rounded-lg">
                  <h3>Heading 3</h3>
                  <p className="text-sm text-slate-500 mt-2">24px / Semibold / Slate 800</p>
                </div>
                
                <div className="p-6 bg-white border rounded-lg">
                  <h4>Heading 4</h4>
                  <p className="text-sm text-slate-500 mt-2">20px / Semibold / Slate 700</p>
                </div>
                
                <div className="p-6 bg-white border rounded-lg">
                  <p>Body Text - Regular paragraph text used throughout the application. This should be readable and comfortable for extended reading sessions in professional field service environments.</p>
                  <p className="text-sm text-slate-500 mt-2">16px / Regular / 1.6 / Slate 600</p>
                </div>
                
                <div className="p-6 bg-white border rounded-lg">
                  <p className="lead">Lead Text - Used for introductory paragraphs and important descriptions that need more emphasis than regular body text.</p>
                  <p className="text-sm text-slate-500 mt-2">18px / Regular / 1.6 / Slate 600</p>
                </div>
                
                <div className="p-6 bg-white border rounded-lg">
                  <p className="small">Small Text - Used for captions, footnotes, and secondary information.</p>
                  <p className="text-sm text-slate-500 mt-2">14px / Regular / 1.5 / Slate 500</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8">
            <div>
              <h2 className="mb-6 text-slate-800">Components</h2>
              
              {/* Buttons */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700">Buttons</h3>
                <div className="flex flex-wrap gap-4 p-6 bg-white rounded-lg border">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Cards */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-800">
                        <BarChart3 className="h-5 w-5 text-teal-600" />
                        Analytics Dashboard
                      </CardTitle>
                      <CardDescription className="text-slate-600">Track performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">Monitor key metrics and insights to optimize your field service operations and marketing performance.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Zap className="h-5 w-5 text-teal-600" />
                        Workflow Automation
                      </CardTitle>
                      <CardDescription className="text-slate-600">Smart automation tools</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">Automate repetitive tasks and streamline your marketing processes with intelligent workflows.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Users className="h-5 w-5 text-teal-600" />
                        Customer Management
                      </CardTitle>
                      <CardDescription className="text-slate-600">Manage leads and customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">Organize your customer relationships with intelligent lead scoring and comprehensive CRM tools.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Badges */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700">Badges</h3>
                <div className="flex flex-wrap gap-2 p-6 bg-white rounded-lg border">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Alert</Badge>
                </div>
              </div>

              {/* Form Elements */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700">Form Elements</h3>
                <div className="max-w-md space-y-4 p-6 bg-white rounded-lg border">
                  <Input placeholder="Enter your business email" />
                  <Button className="w-full">Get Started</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-8">
            <div>
              <h2 className="mb-6 text-slate-800">Spacing System</h2>
              
              <div className="space-y-6">
                {[
                  { name: "XS", value: "0.25rem", pixels: "4px" },
                  { name: "SM", value: "0.5rem", pixels: "8px" },
                  { name: "MD", value: "1rem", pixels: "16px" },
                  { name: "LG", value: "1.5rem", pixels: "24px" },
                  { name: "XL", value: "2rem", pixels: "32px" },
                  { name: "2XL", value: "3rem", pixels: "48px" },
                  { name: "3XL", value: "4rem", pixels: "64px" },
                ].map((space) => (
                  <div key={space.name} className="flex items-center gap-4 p-4 bg-white border rounded-lg">
                    <div className="w-16 text-sm font-medium text-slate-700">{space.name}</div>
                    <div 
                      className="bg-slate-700 h-4 rounded"
                      style={{ width: space.value }}
                    />
                    <div className="text-sm text-slate-500">
                      {space.value} ({space.pixels})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-8">
            <div>
              <h2 className="mb-6 text-slate-800">Usage Examples</h2>
              
              {/* Hero Section Example */}
              <div className="mb-12">
                <h3 className="mb-4 text-slate-700">Hero Section</h3>
                <Card className="p-12 gradient-primary text-white">
                  <div className="text-center">
                    <h1 className="mb-4 text-white">Where Field Service Meets Smart Marketing</h1>
                    <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                      Transform your field service business with AI-native marketing automation. 
                      Generate leads, create content, and grow revenue—all in one platform.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button size="lg" variant="secondary" className="bg-white text-slate-800 hover:bg-slate-50">
                        Start Free Trial
                      </Button>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        Schedule Demo
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Feature Cards Example */}
              <div className="mb-12">
                <h3 className="mb-4 text-slate-700">Feature Grid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <BarChart3 className="h-8 w-8 text-teal-600" />,
                      title: "Performance Analytics",
                      description: "Track key metrics, monitor lead generation, and optimize your marketing strategy with comprehensive analytics and reporting tools."
                    },
                    {
                      icon: <Zap className="h-8 w-8 text-teal-600" />,
                      title: "Marketing Automation",
                      description: "Generate professional content, automate follow-ups, and streamline your marketing processes with intelligent AI-powered workflows."
                    },
                    {
                      icon: <Users className="h-8 w-8 text-teal-600" />,
                      title: "Lead Management",
                      description: "Capture, qualify, and nurture prospects with advanced lead scoring, automated follow-ups, and integrated CRM functionality."
                    },
                    {
                      icon: <Settings className="h-8 w-8 text-teal-600" />,
                      title: "Service Integration",
                      description: "Seamlessly connect your field service operations with marketing campaigns for a unified business approach."
                    },
                    {
                      icon: <TrendingUp className="h-8 w-8 text-teal-600" />,
                      title: "Revenue Growth",
                      description: "Increase your revenue with data-driven insights, optimized campaigns, and automated customer acquisition strategies."
                    },
                    {
                      icon: <CheckCircle className="h-8 w-8 text-teal-600" />,
                      title: "Professional Results",
                      description: "Deliver consistent, professional results with proven marketing frameworks designed specifically for field service businesses."
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="bg-white border-slate-200 hover:shadow-fieldflux transition-shadow">
                      <CardHeader>
                        <div className="mb-2">{feature.icon}</div>
                        <CardTitle className="text-slate-800">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Brand Tab */}
          <TabsContent value="brand" className="space-y-8">
            <div>
              <h2 className="mb-6 text-slate-800">Brand Guidelines</h2>
              
              <div className="space-y-8">
                {/* Logo Usage */}
                <div>
                  <h3 className="mb-4 text-slate-700">Logo Usage</h3>
                  <Card className="p-8 bg-white">
                    <div className="flex items-center justify-center space-x-12">
                      <div className="text-center">
                        <div className="w-16 h-16 flex items-center justify-center mb-3 mx-auto">
                          <img 
                            src={fieldFluxLogo} 
                            alt="FieldFlux Icon" 
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        <p className="text-sm text-slate-500">Icon Mark</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-3 mb-3">
                          <img 
                            src={fieldFluxLogo} 
                            alt="FieldFlux Logo" 
                            className="w-10 h-10 object-contain"
                          />
                          <span className="text-2xl font-semibold text-slate-800">FieldFlux</span>
                        </div>
                        <p className="text-sm text-slate-500">Full Logo</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Voice & Tone */}
                <div>
                  <h3 className="mb-4 text-slate-700">Voice & Tone</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-white">
                      <h4 className="mb-3 text-teal-700 font-semibold">✓ Professional Approach</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Clear, business-focused language</li>
                        <li>• Emphasize ROI and efficiency</li>
                        <li>• Use industry-specific terminology appropriately</li>
                        <li>• Focus on practical solutions</li>
                        <li>• Maintain professional credibility</li>
                      </ul>
                    </Card>
                    <Card className="p-6 bg-white">
                      <h4 className="mb-3 text-red-600 font-semibold">✗ Avoid</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Overly casual or informal tone</li>
                        <li>• Exaggerated claims or promises</li>
                        <li>• Complex technical jargon</li>
                        <li>• Generic marketing speak</li>
                        <li>• Unprofessional imagery or content</li>
                      </ul>
                    </Card>
                  </div>
                </div>

                {/* Key Messages */}
                <div>
                  <h3 className="mb-4 text-slate-700">Key Messages</h3>
                  <div className="space-y-4">
                    <Card className="p-6 bg-white">
                      <h4 className="mb-2 text-slate-800 font-semibold">Primary Value Proposition</h4>
                      <p className="text-slate-600">
                        "Where Field Service Meets Smart Marketing" - We bridge the gap between field service operations 
                        and intelligent marketing automation, helping businesses grow through data-driven strategies.
                      </p>
                    </Card>
                    <Card className="p-6 bg-white">
                      <h4 className="mb-2 text-slate-800 font-semibold">Core Benefits</h4>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Professional marketing automation for field service businesses</li>
                        <li>• Streamlined lead generation and customer management</li>
                        <li>• Data-driven insights and performance analytics</li>
                        <li>• Integrated platform solution for operational efficiency</li>
                        <li>• Proven ROI and business growth results</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ColorSwatch({ color, name, description, border }: { 
  color: string; 
  name: string; 
  description?: string; 
  border?: boolean;
}) {
  return (
    <div className="text-center">
      <div 
        className={`w-full h-20 rounded-lg mb-2 ${border ? 'border-2 border-slate-200' : ''}`}
        style={{ backgroundColor: color }}
      />
      <div className="text-sm font-medium text-slate-700">{name}</div>
      <div className="text-xs text-slate-500">{color.toUpperCase()}</div>
      {description && <div className="text-xs text-slate-500 mt-1">{description}</div>}
    </div>
  );
}