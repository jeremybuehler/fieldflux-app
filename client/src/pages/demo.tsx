import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  BarChart3,
  Zap,
  Users,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  X,
} from "lucide-react";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  duration: number; // in seconds
}

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [autoStartCountdown, setAutoStartCountdown] = useState(3);

  // Debug logging on component mount
  useEffect(() => {
    console.log('Demo component mounted');
    console.log('Initial state:', { currentStep, isPlaying, progress, timeLeft, autoStartCountdown });
  }, []);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Welcome to FieldFlux",
      description: "Your intelligent field service marketing platform",
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      duration: 4,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to FieldFlux</h2>
          <p className="text-xl text-gray-600">
            The all-in-one marketing automation platform designed specifically for field service professionals
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-blue-700 font-medium">500+ Active Users</span>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-green-700 font-medium">40% Lead Increase</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "AI-Powered Content Creation",
      description: "Generate professional marketing content in seconds",
      icon: <Bot className="w-8 h-8 text-orange-600" />,
      duration: 6,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Content Generation</h3>
            <p className="text-gray-600">Watch as our AI creates professional content for your business</p>
          </div>
          
          <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                      <h4 className="font-semibold text-gray-900 mb-2">🔥 Summer HVAC Special!</h4>
                      <p className="text-gray-600 text-sm">
                        Beat the heat with our professional AC tune-up service! 
                        Limited time: 20% off all maintenance packages. 
                        Keep your family cool and comfortable all season long. 
                        #HVAC #AirConditioning #SummerSpecial
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">📅 Scheduled for: Today 2:00 PM</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Ready to Post</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Platforms</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">15s</div>
              <div className="text-sm text-gray-600">Generation Time</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">SEO</div>
              <div className="text-sm text-gray-600">Optimized</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Smart Lead Management",
      description: "Intelligent lead scoring and automated follow-ups",
      icon: <Users className="w-8 h-8 text-green-600" />,
      duration: 5,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Lead Management</h3>
            <p className="text-gray-600">AI-powered lead scoring identifies your best prospects</p>
          </div>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-red-500 bg-red-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">Commercial HVAC Repair - Emergency</p>
                    <p className="text-xs text-gray-500">Downtown Office Building</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">95</div>
                    <div className="text-xs text-gray-500">Score</div>
                    <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded mt-1">Hot Lead</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Mike Rodriguez</h4>
                    <p className="text-sm text-gray-600">Residential AC Installation</p>
                    <p className="text-xs text-gray-500">New construction home</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">78</div>
                    <div className="text-xs text-gray-500">Score</div>
                    <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded mt-1">Warm Lead</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Jennifer Chen</h4>
                    <p className="text-sm text-gray-600">Maintenance Service Inquiry</p>
                    <p className="text-xs text-gray-500">Annual service contract</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">62</div>
                    <div className="text-xs text-gray-500">Score</div>
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1">Follow Up</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Automated Actions</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Priority leads get immediate SMS alerts</li>
              <li>• Follow-up emails scheduled automatically</li>
              <li>• Lead scoring updates in real-time</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Performance Analytics",
      description: "Real-time insights and comprehensive reporting",
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      duration: 5,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-gray-600">Track your marketing ROI and business growth</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">+147%</div>
                <div className="text-sm text-blue-700">Lead Generation</div>
                <div className="text-xs text-blue-600 mt-1">vs last month</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">$24.8K</div>
                <div className="text-sm text-green-700">Revenue Growth</div>
                <div className="text-xs text-green-600 mt-1">this quarter</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">4.8★</div>
                <div className="text-sm text-purple-700">Avg Rating</div>
                <div className="text-xs text-purple-600 mt-1">across platforms</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900">89%</div>
                <div className="text-sm text-orange-700">Response Rate</div>
                <div className="text-xs text-orange-600 mt-1">customer engagement</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Marketing ROI Overview</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Social Media Campaigns</span>
                  <span className="font-semibold text-green-600">+285% ROI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Marketing</span>
                  <span className="font-semibold text-green-600">+156% ROI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Google Ads</span>
                  <span className="font-semibold text-green-600">+203% ROI</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: "Review Management",
      description: "AI-powered review monitoring and response generation",
      icon: <MessageSquare className="w-8 h-8 text-purple-600" />,
      duration: 4,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Review Management</h3>
            <p className="text-gray-600">AI generates professional responses to all customer reviews</p>
          </div>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">TC</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">Tom Chen</h4>
                    <div className="flex text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4" />
                      <Star className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-500">Google Reviews</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    "Service was okay but technician arrived 30 minutes late. Work quality was good though."
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">AI Generated Response</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      "Hi Tom, thank you for your feedback! We sincerely apologize for the delay - we understand your time is valuable. We're glad you were satisfied with our work quality. We've addressed the scheduling issue to prevent future delays. We'd love the opportunity to exceed your expectations next time. Please don't hesitate to reach out for any future HVAC needs!"
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <Button size="sm" className="text-xs">Post Response</Button>
                      <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xl font-bold text-green-600">4.7★</div>
              <div className="text-xs text-gray-600">Avg Rating</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-600">24h</div>
              <div className="text-xs text-gray-600">Response Time</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xl font-bold text-purple-600">94%</div>
              <div className="text-xs text-gray-600">AI Accuracy</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Ready to Get Started?",
      description: "Transform your field service marketing today",
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      duration: 4,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-600">
            Join 500+ field service professionals already growing with FieldFlux
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-sm text-gray-600">Average Lead Increase</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 mb-2">10hrs</div>
              <div className="text-sm text-gray-600">Saved Per Week</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 mb-2">5min</div>
              <div className="text-sm text-gray-600">Setup Time</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-10 py-4 text-lg w-full sm:w-auto"
              onClick={() => window.location.href = '/api/login'}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>14-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < demoSteps.length) {
      console.log(`Starting timer for step ${currentStep + 1}, duration: ${demoSteps[currentStep].duration}s`);
      
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (demoSteps[currentStep].duration * 10); // Update every 0.1s
          const newProgress = prev + increment;
          
          if (newProgress >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(prevStep => prevStep + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return newProgress;
        });
        
        setTimeLeft(prev => {
          const newTimeLeft = prev - 0.1;
          return newTimeLeft <= 0 ? 0 : newTimeLeft;
        });
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentStep, demoSteps]);

  useEffect(() => {
    if (currentStep < demoSteps.length) {
      console.log(`Setting up step ${currentStep + 1}: ${demoSteps[currentStep].title}`);
      setTimeLeft(demoSteps[currentStep].duration);
      setProgress(0);
    }
  }, [currentStep, demoSteps]);

  // Auto-start demo with countdown
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    let autoStartTimer: NodeJS.Timeout;

    // Only start countdown if not already playing and countdown is greater than 0
    if (!isPlaying && autoStartCountdown > 0) {
      countdownInterval = setInterval(() => {
        setAutoStartCountdown(prev => {
          if (prev <= 1) {
            setIsPlaying(true);
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Backup timer to ensure countdown stops
      autoStartTimer = setTimeout(() => {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
        if (autoStartCountdown > 0) {
          setIsPlaying(true);
          setAutoStartCountdown(0);
        }
      }, 4000); // 4 second safety net
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (autoStartTimer) clearTimeout(autoStartTimer);
    };
  }, [isPlaying, autoStartCountdown]); // Add dependencies

  const handlePlay = () => {
    console.log('Play button clicked'); // Debug log
    setIsPlaying(true);
    setAutoStartCountdown(0); // Clear countdown when user manually starts
  };

  const handlePause = () => {
    console.log('Pause button clicked'); // Debug log
    setIsPlaying(false);
    setAutoStartCountdown(0); // Clear countdown when user manually pauses
  };

  const handleRestart = () => {
    console.log('Restart button clicked'); // Debug log
    setCurrentStep(0);
    setProgress(0);
    setTimeLeft(demoSteps[0].duration);
    setIsPlaying(true);
    setAutoStartCountdown(0); // Clear countdown when user manually restarts
  };

  const handleStepSelect = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
    setTimeLeft(demoSteps[stepIndex].duration);
    setIsPlaying(false);
    setAutoStartCountdown(0); // Clear countdown when user manually selects step
  };

  const currentDemoStep = demoSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">FieldFlux Demo</span>
                <div className="text-xs text-gray-500 font-medium">Interactive Product Tour</div>
              </div>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="text-gray-700 hover:text-gray-900"
            >
              <X className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {!isPlaying ? (
                    <Button onClick={handlePlay} size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Play className="w-5 h-5 mr-2" />
                      {autoStartCountdown > 0 ? `Starting in ${autoStartCountdown}s` : "Start Demo"}
                    </Button>
                  ) : (
                    <Button onClick={handlePause} size="lg" variant="outline">
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={handleRestart} size="lg" variant="outline">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Restart
                  </Button>
                </div>
                
                {autoStartCountdown > 0 && !isPlaying && (
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-700 font-medium">
                      Demo starting automatically in {autoStartCountdown}s
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Step {currentStep + 1} of {demoSteps.length}</span>
                <span>•</span>
                <span>{Math.ceil(timeLeft)}s remaining</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{currentDemoStep.title}</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Demo Steps Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {demoSteps.map((step, index) => (
              <Button
                key={step.id}
                onClick={() => handleStepSelect(index)}
                variant={index === currentStep ? "default" : "outline"}
                size="sm"
                className={`${
                  index === currentStep 
                    ? "bg-blue-600 text-white" 
                    : index < currentStep 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-gray-50 text-gray-600"
                }`}
              >
                {index < currentStep && <CheckCircle className="w-4 h-4 mr-1" />}
                {step.icon}
                <span className="ml-2 hidden sm:inline">{step.title}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Demo Content */}
        <Card className="min-h-[500px]">
          <CardContent className="p-8">
            {currentDemoStep.content}
          </CardContent>
        </Card>

        {/* Demo Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Seeing the potential? Experience FieldFlux with your own data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
            >
              Try Live Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}