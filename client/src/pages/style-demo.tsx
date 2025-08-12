import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Users, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  ArrowRight,
  Play,
  Shield,
  Clock,
  Target,
  Palette,
  Sparkles,
  Eye,
  Heart
} from "lucide-react";

export default function StyleDemo() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                FieldPulse Style Guide
              </span>
              <Badge variant="secondary" className="ml-2">Demo</Badge>
            </div>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              Back to App
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="gradient-text mb-4 animate-protocol-fade-in">
            FieldPulse Design System
          </h1>
          <p className="lead max-w-2xl mx-auto text-slate-600 dark:text-slate-400 animate-protocol-slide-in">
            Explore the complete collection of styling options, effects, and components 
            available in your FieldPulse application.
          </p>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-white dark:bg-slate-800">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="layouts">Layouts</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-8 mt-8">
            <div>
              <h2 className="mb-6 text-slate-800 dark:text-slate-200">Color Palette</h2>
              
              {/* Primary Colors */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Slate Palette (Primary)</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="text-center">
                      <div 
                        className={`w-full h-16 rounded-lg mb-2 bg-slate-${shade} border border-gray-200`}
                      />
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        slate-{shade}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teal Colors */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Teal Palette (Accent)</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="text-center">
                      <div 
                        className={`w-full h-16 rounded-lg mb-2 bg-teal-${shade} border border-gray-200`}
                      />
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        teal-{shade}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient Examples */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Available Gradients</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="gradient-primary h-20 rounded-lg flex items-center justify-center text-white font-medium">
                    gradient-primary
                  </div>
                  <div className="gradient-subtle h-20 rounded-lg flex items-center justify-center text-slate-700 font-medium">
                    gradient-subtle
                  </div>
                  <div className="gradient-accent h-20 rounded-lg flex items-center justify-center text-white font-medium">
                    gradient-accent
                  </div>
                  <div className="h-20 rounded-lg flex items-center justify-center font-medium">
                    <span className="gradient-text text-2xl">gradient-text</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8 mt-8">
            <div>
              <h2 className="mb-6 text-slate-800 dark:text-slate-200">Component Variations</h2>
              
              {/* Buttons */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Button Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                
                <h4 className="mt-6 mb-4 text-slate-600 dark:text-slate-400">Button Sizes</h4>
                <div className="flex items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Settings className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Cards */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Card Components</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Standard Card</CardTitle>
                      <CardDescription>Basic card with header and content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        This is a standard card component with minimal styling.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle>Glass Morphism</CardTitle>
                      <CardDescription>Modern glass effect</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Glass morphism effect with backdrop blur.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover-lift">
                    <CardHeader>
                      <CardTitle>Hover Lift</CardTitle>
                      <CardDescription>Interactive hover effect</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Hover over this card to see the lift effect.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Form Elements */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Form Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="demo-input">Standard Input</Label>
                      <Input id="demo-input" placeholder="Enter text here..." />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="demo-switch" />
                      <Label htmlFor="demo-switch">Enable feature</Label>
                    </div>
                    <div>
                      <Label>Progress Bar</Label>
                      <Progress value={65} className="mt-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Badge Variants</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-8 mt-8">
            <div>
              <h2 className="mb-6 text-slate-800 dark:text-slate-200">Visual Effects</h2>
              
              {/* Shadow Effects */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Shadow Effects</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-protocol-sm">
                    <h4 className="font-semibold mb-2">Small Shadow</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">shadow-protocol-sm</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-protocol">
                    <h4 className="font-semibold mb-2">Default Shadow</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">shadow-protocol</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-protocol-lg">
                    <h4 className="font-semibold mb-2">Large Shadow</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">shadow-protocol-lg</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-fieldflux">
                    <h4 className="font-semibold mb-2">FieldFlux Shadow</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">shadow-fieldflux</p>
                  </div>
                </div>
              </div>

              {/* Glass Effects */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Glass Morphism</h3>
                <div className="relative h-64 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg overflow-hidden">
                  <div className="absolute inset-4 glass-morphism rounded-lg p-6">
                    <h4 className="font-semibold mb-2 text-slate-800">Light Glass Effect</h4>
                    <p className="text-sm text-slate-600">
                      Glass morphism with backdrop blur and subtle transparency.
                    </p>
                    <Button className="mt-4" variant="outline" size="sm">
                      Action Button
                    </Button>
                  </div>
                </div>
              </div>

              {/* Hover Effects */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Interactive Effects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover-lift cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-teal-600" />
                        Hover Lift
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Hover over this card to see the lift animation.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover-glow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-teal-600" />
                        Hover Glow
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Hover over this card to see the glow effect.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Animations Tab */}
          <TabsContent value="animations" className="space-y-8 mt-8">
            <div>
              <h2 className="mb-6 text-slate-800 dark:text-slate-200">Animations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center animate-float">
                      <Heart className="w-8 h-8 text-teal-600" />
                    </div>
                    <CardTitle>Float Animation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      animate-float - Gentle floating motion
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center animate-pulse-glow">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle>Pulse Glow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      animate-pulse-glow - Pulsing glow effect
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center animate-protocol-scale-in">
                      <Star className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle>Scale In</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      animate-protocol-scale-in - Scale animation
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Loading Effects</h3>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer w-1/2"></div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-8 mt-8">
            <div>
              <h2 className="mb-6 text-slate-800 dark:text-slate-200">Status Indicators</h2>
              
              {/* Modern Status */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Modern Status (with Glow)</h3>
                <div className="flex flex-wrap gap-4">
                  <span className="status-modern-online">Online</span>
                  <span className="status-modern-offline">Offline</span>
                  <span className="status-modern-pending">Pending</span>
                  <span className="status-modern-processing">Processing</span>
                </div>
              </div>

              {/* Field Service Status */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Field Service Status</h3>
                <div className="flex flex-wrap gap-4">
                  <span className="status-fieldservice-online">Available</span>
                  <span className="status-fieldservice-offline">Unavailable</span>
                  <span className="status-fieldservice-pending">Scheduled</span>
                  <span className="status-fieldservice-in-progress">In Progress</span>
                </div>
              </div>

              {/* Protocol Status */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Protocol Status Dots</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full status-protocol-online"></div>
                    <span className="text-sm">Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full status-protocol-processing"></div>
                    <span className="text-sm">Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full status-protocol-error"></div>
                    <span className="text-sm">Error</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full status-protocol-success"></div>
                    <span className="text-sm">Success</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Layouts Tab */}
          <TabsContent value="layouts" className="space-y-8 mt-8">
            <div>
              <h2 className="mb-6 text-slate-800 dark:text-slate-200">Layout Components</h2>
              
              {/* Metric Cards */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Metric Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="metric-fieldservice">
                    <div className="metric-fieldservice-header">
                      <div className="metric-fieldservice-title">Total Leads</div>
                      <TrendingUp className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="metric-fieldservice-value">2,847</div>
                    <div className="metric-fieldservice-change metric-fieldservice-change-positive">
                      +12.5% from last month
                    </div>
                  </div>

                  <div className="metric-fieldservice">
                    <div className="metric-fieldservice-header">
                      <div className="metric-fieldservice-title">Conversion Rate</div>
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="metric-fieldservice-value">18.2%</div>
                    <div className="metric-fieldservice-change metric-fieldservice-change-positive">
                      +2.1% from last month
                    </div>
                  </div>

                  <div className="metric-fieldservice">
                    <div className="metric-fieldservice-header">
                      <div className="metric-fieldservice-title">Response Time</div>
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="metric-fieldservice-value">4.2h</div>
                    <div className="metric-fieldservice-change metric-fieldservice-change-negative">
                      +0.5h from last month
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Container */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Modern Container</h3>
                <div className="container-modern py-12">
                  <Card className="text-center">
                    <CardHeader>
                      <CardTitle>Enhanced Container</CardTitle>
                      <CardDescription>
                        This container has subtle background effects and enhanced styling
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-400">
                        The container-modern class adds subtle radial gradients and enhanced spacing.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-8 mt-8">
            <div>
              <h2 className="mb-6 text-slate-800 dark:text-slate-200">Real-world Examples</h2>
              
              {/* Dashboard Card Example */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Dashboard Card</h3>
                <Card className="hover-lift glass-morphism">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-teal-600" />
                        </div>
                        Lead Generation
                      </CardTitle>
                      <Badge className="status-modern-online">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                        <span className="font-semibold">234 leads</span>
                      </div>
                      <Progress value={78} />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>78% of goal</span>
                        <span>22 days remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature Showcase */}
              <div className="mb-8">
                <h3 className="mb-4 text-slate-700 dark:text-slate-300">Feature Showcase</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover-lift text-center">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-4 animate-float">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">Secure Platform</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Enterprise-grade security with end-to-end encryption
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover-glow text-center">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">Advanced Analytics</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Real-time insights and predictive analytics
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover-lift text-center">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">Lightning Fast</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Optimized performance for instant results
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="text-teal-100 mb-6">
                    Apply these styles to your FieldPulse application and create amazing user experiences.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="text-slate-800">
                      <Eye className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                    <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Start Building
                    </Button>
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