import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Building2,
  Users,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BarChart3,
  MessageSquare,
  Calendar,
  Bot,
  Lightbulb,
  Clock,
  TrendingUp,
} from "lucide-react";

interface OnboardingData {
  // Business Information
  businessName: string;
  businessType: string;
  serviceArea: string;
  teamSize: string;
  yearsInBusiness: string;
  
  // Goals & Priorities
  primaryGoals: string[];
  currentChallenges: string[];
  monthlyBudget: string;
  
  // Current Marketing
  currentMarketing: string[];
  socialPlatforms: string[];
  hasWebsite: boolean;
  websiteUrl?: string;
  
  // Preferences
  contentTone: string;
  automationLevel: string;
  reportingFrequency: string;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface AIRecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
  setupTime: string;
  icon: React.ReactNode;
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    businessName: '',
    businessType: '',
    serviceArea: '',
    teamSize: '',
    yearsInBusiness: '',
    primaryGoals: [],
    currentChallenges: [],
    monthlyBudget: '',
    currentMarketing: [],
    socialPlatforms: [],
    hasWebsite: false,
    websiteUrl: '',
    contentTone: '',
    automationLevel: '',
    reportingFrequency: '',
  });
  
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const { toast } = useToast();

  // Generate AI recommendations based on user input
  const generateRecommendations = useMutation({
    mutationFn: async (onboardingData: OnboardingData) => {
      const response = await fetch('/api/ai/generate-onboarding-plan', {
        method: 'POST',
        body: JSON.stringify(onboardingData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      setAiRecommendations(result.recommendations || []);
      setIsGeneratingPlan(false);
      toast({
        title: "Personalized Plan Generated!",
        description: "Your custom marketing strategy is ready.",
      });
    },
    onError: () => {
      setIsGeneratingPlan(false);
      toast({
        title: "Generation Failed",
        description: "Unable to generate recommendations. Please try again.",
        variant: "destructive",
      });
    }
  });

  const saveOnboardingData = useMutation({
    mutationFn: async (onboardingData: OnboardingData & { recommendations?: AIRecommendation[] }) => {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        body: JSON.stringify(onboardingData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Saved",
        description: "Your business profile has been saved successfully.",
      });
      window.location.href = '/dashboard';
    }
  });

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: string, value: string, checked: boolean) => {
    setData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof OnboardingData] as string[]), value]
        : (prev[field as keyof OnboardingData] as string[]).filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    generateRecommendations.mutate(data);
  };

  const handleComplete = () => {
    saveOnboardingData.mutate({ ...data, recommendations: aiRecommendations });
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Business Information",
      description: "Tell us about your field service business",
      icon: <Building2 className="w-6 h-6" />,
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={data.businessName}
                onChange={(e) => updateData('businessName', e.target.value)}
                placeholder="e.g., Smith HVAC Services"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="businessType">Service Type *</Label>
              <Select value={data.businessType} onValueChange={(value) => updateData('businessType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your primary service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hvac">HVAC Services</SelectItem>
                  <SelectItem value="plumbing">Plumbing Services</SelectItem>
                  <SelectItem value="electrical">Electrical Services</SelectItem>
                  <SelectItem value="landscaping">Landscaping & Lawn Care</SelectItem>
                  <SelectItem value="roofing">Roofing Services</SelectItem>
                  <SelectItem value="cleaning">Cleaning Services</SelectItem>
                  <SelectItem value="handyman">Handyman Services</SelectItem>
                  <SelectItem value="other">Other Field Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="serviceArea">Service Area</Label>
              <Input
                id="serviceArea"
                value={data.serviceArea}
                onChange={(e) => updateData('serviceArea', e.target.value)}
                placeholder="e.g., Dallas-Fort Worth Metro"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select value={data.teamSize} onValueChange={(value) => updateData('teamSize', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Just Me</SelectItem>
                    <SelectItem value="2-5">2-5 People</SelectItem>
                    <SelectItem value="6-15">6-15 People</SelectItem>
                    <SelectItem value="16-50">16-50 People</SelectItem>
                    <SelectItem value="50+">50+ People</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                <Select value={data.yearsInBusiness} onValueChange={(value) => updateData('yearsInBusiness', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Just Starting</SelectItem>
                    <SelectItem value="1-3">1-3 Years</SelectItem>
                    <SelectItem value="4-10">4-10 Years</SelectItem>
                    <SelectItem value="11-20">11-20 Years</SelectItem>
                    <SelectItem value="20+">20+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Goals & Priorities",
      description: "What are your main business objectives?",
      icon: <Target className="w-6 h-6" />,
      component: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Primary Goals (Select all that apply)</Label>
            <div className="mt-3 space-y-3">
              {[
                'Increase lead generation',
                'Improve online reviews',
                'Boost social media presence',
                'Automate marketing tasks',
                'Better customer communication',
                'Expand service area',
                'Increase revenue per customer',
                'Build brand awareness'
              ].map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={data.primaryGoals.includes(goal)}
                    onCheckedChange={(checked) => updateArrayField('primaryGoals', goal, checked as boolean)}
                  />
                  <Label htmlFor={goal} className="text-sm font-normal">{goal}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Current Challenges (Select all that apply)</Label>
            <div className="mt-3 space-y-3">
              {[
                'Not enough qualified leads',
                'Inconsistent online presence',
                'Poor online reviews',
                'Time-consuming manual tasks',
                'Difficulty tracking ROI',
                'Seasonal business fluctuations',
                'Competition from larger companies',
                'Limited marketing budget'
              ].map((challenge) => (
                <div key={challenge} className="flex items-center space-x-2">
                  <Checkbox
                    id={challenge}
                    checked={data.currentChallenges.includes(challenge)}
                    onCheckedChange={(checked) => updateArrayField('currentChallenges', challenge, checked as boolean)}
                  />
                  <Label htmlFor={challenge} className="text-sm font-normal">{challenge}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="monthlyBudget">Monthly Marketing Budget</Label>
            <Select value={data.monthlyBudget} onValueChange={(value) => updateData('monthlyBudget', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-500">$0 - $500</SelectItem>
                <SelectItem value="500-1500">$500 - $1,500</SelectItem>
                <SelectItem value="1500-3000">$1,500 - $3,000</SelectItem>
                <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
                <SelectItem value="5000+">$5,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Current Marketing",
      description: "What marketing activities are you doing now?",
      icon: <BarChart3 className="w-6 h-6" />,
      component: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Current Marketing Activities</Label>
            <div className="mt-3 space-y-3">
              {[
                'Word of mouth referrals',
                'Google Ads',
                'Facebook/Instagram ads',
                'SEO/Website optimization',
                'Email marketing',
                'Direct mail',
                'Vehicle wraps/signage',
                'Trade show participation',
                'Partnership referrals',
                'None currently'
              ].map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity}
                    checked={data.currentMarketing.includes(activity)}
                    onCheckedChange={(checked) => updateArrayField('currentMarketing', activity, checked as boolean)}
                  />
                  <Label htmlFor={activity} className="text-sm font-normal">{activity}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Social Media Platforms</Label>
            <div className="mt-3 space-y-3">
              {[
                'Facebook',
                'Instagram',
                'LinkedIn',
                'Twitter/X',
                'YouTube',
                'TikTok',
                'Google My Business',
                'None currently'
              ].map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={data.socialPlatforms.includes(platform)}
                    onCheckedChange={(checked) => updateArrayField('socialPlatforms', platform, checked as boolean)}
                  />
                  <Label htmlFor={platform} className="text-sm font-normal">{platform}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWebsite"
                checked={data.hasWebsite}
                onCheckedChange={(checked) => updateData('hasWebsite', checked)}
              />
              <Label htmlFor="hasWebsite">I have a business website</Label>
            </div>

            {data.hasWebsite && (
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  value={data.websiteUrl || ''}
                  onChange={(e) => updateData('websiteUrl', e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Preferences",
      description: "Customize your FieldFlux experience",
      icon: <Zap className="w-6 h-6" />,
      component: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Content Tone & Style</Label>
            <RadioGroup 
              value={data.contentTone} 
              onValueChange={(value) => updateData('contentTone', value)}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional">Professional & Formal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="friendly" />
                <Label htmlFor="friendly">Friendly & Conversational</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expert" id="expert" />
                <Label htmlFor="expert">Expert & Technical</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="casual" />
                <Label htmlFor="casual">Casual & Approachable</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">Automation Preference</Label>
            <RadioGroup 
              value={data.automationLevel} 
              onValueChange={(value) => updateData('automationLevel', value)}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High Automation - Minimal manual oversight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Balanced - Some manual review and approval</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Manual Control - Review everything before posting</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="reportingFrequency">Reporting Frequency</Label>
            <Select value={data.reportingFrequency} onValueChange={(value) => updateData('reportingFrequency', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="How often would you like reports?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Updates</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="monthly">Monthly Overview</SelectItem>
                <SelectItem value="quarterly">Quarterly Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "AI-Generated Plan",
      description: "Your personalized marketing strategy",
      icon: <Sparkles className="w-6 h-6" />,
      component: (
        <div className="space-y-6">
          {aiRecommendations.length === 0 ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <Bot className="w-10 h-10 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Generate Your Custom Plan</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Our AI will analyze your business profile and create a personalized marketing strategy tailored to your goals.
                </p>
              </div>

              <Button 
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white"
              >
                {isGeneratingPlan ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Plan
                  </>
                )}
              </Button>

              {isGeneratingPlan && (
                <div className="max-w-md mx-auto">
                  <div className="text-sm text-gray-600 mb-2">Analyzing your business profile...</div>
                  <Progress value={65} className="h-2" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Personalized Marketing Plan</h3>
                <p className="text-gray-600">
                  Based on your business profile, here's your custom strategy for {data.businessName}
                </p>
              </div>

              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => {
                  // Map category to icon
                  const getIconForCategory = (category: string) => {
                    switch (category.toLowerCase()) {
                      case 'content':
                        return <Bot className="w-6 h-6 text-orange-600" />;
                      case 'lead generation':
                        return <Users className="w-6 h-6 text-green-600" />;
                      case 'reviews':
                        return <MessageSquare className="w-6 h-6 text-purple-600" />;
                      case 'social media':
                        return <Calendar className="w-6 h-6 text-blue-600" />;
                      case 'analytics':
                        return <BarChart3 className="w-6 h-6 text-indigo-600" />;
                      case 'automation':
                        return <Zap className="w-6 h-6 text-yellow-600" />;
                      default:
                        return <Target className="w-6 h-6 text-gray-600" />;
                    }
                  };

                  return (
                    <Card key={index} className={`border-l-4 ${
                      rec.priority === 'high' ? 'border-l-red-500 bg-red-50/50' :
                      rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50/50' :
                      'border-l-blue-500 bg-blue-50/50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getIconForCategory(rec.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                              <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                                {rec.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>Impact: {rec.estimatedImpact}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Setup: {rec.setupTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Next Steps</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete your profile setup to activate these recommendations</li>
                  <li>• Start with high-priority items for maximum impact</li>
                  <li>• Schedule a strategy call with our team for implementation guidance</li>
                  <li>• Monitor your progress through the FieldFlux dashboard</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">FieldFlux Onboarding</span>
                <div className="text-xs text-gray-500 font-medium">Personalized Setup Experience</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Setup Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                  index === currentStep
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : index < currentStep
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {currentStepData.icon}
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <p className="text-gray-600">{currentStepData.description}</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {currentStepData.component}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={aiRecommendations.length === 0 || saveOnboardingData.isPending}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
            >
              {saveOnboardingData.isPending ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                  Completing Setup...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 0 && (!data.businessName || !data.businessType)) ||
                (currentStep === 1 && data.primaryGoals.length === 0) ||
                (currentStep === 3 && !data.contentTone)
              }
              size="lg"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}