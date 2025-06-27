import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Eye,
  Settings
} from "lucide-react";
import { format } from "date-fns";

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  maxLength: number;
  features: string[];
}

const platforms: Platform[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
    color: "bg-blue-600",
    maxLength: 63206,
    features: ["Text", "Images", "Videos", "Links", "Hashtags"]
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    maxLength: 2200,
    features: ["Images", "Stories", "Reels", "Hashtags"]
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: <Twitter className="w-5 h-5" />,
    color: "bg-black",
    maxLength: 280,
    features: ["Text", "Images", "Videos", "Hashtags", "Threads"]
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    color: "bg-blue-700",
    maxLength: 3000,
    features: ["Text", "Images", "Documents", "Professional"]
  }
];

interface ScheduleTime {
  date: Date | undefined;
  time: string;
}

interface PlatformContent {
  [key: string]: {
    content: string;
    hashtags: string;
    enabled: boolean;
  };
}

export default function MultiPlatformWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleTime, setScheduleTime] = useState<ScheduleTime>({
    date: undefined,
    time: "09:00"
  });
  const [globalContent, setGlobalContent] = useState("");
  const [platformContent, setPlatformContent] = useState<PlatformContent>({});
  const [isScheduling, setIsScheduling] = useState(false);

  const totalSteps = 4;

  // Initialize platform content when platforms are selected
  const initializePlatformContent = (platformIds: string[]) => {
    const newContent: PlatformContent = {};
    platformIds.forEach(id => {
      newContent[id] = {
        content: globalContent,
        hashtags: "",
        enabled: true
      };
    });
    setPlatformContent(newContent);
  };

  const handlePlatformToggle = (platformId: string) => {
    const newSelected = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    
    setSelectedPlatforms(newSelected);
    
    if (newSelected.length > 0) {
      initializePlatformContent(newSelected);
    }
  };

  const updatePlatformContent = (platformId: string, field: keyof PlatformContent[string], value: string | boolean) => {
    setPlatformContent(prev => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        [field]: value
      }
    }));
  };

  const handleGlobalContentChange = (content: string) => {
    setGlobalContent(content);
    // Update all platform content
    const updated: PlatformContent = {};
    selectedPlatforms.forEach(id => {
      updated[id] = {
        ...platformContent[id],
        content: content
      };
    });
    setPlatformContent(updated);
  };

  const getSelectedPlatforms = () => {
    return platforms.filter(p => selectedPlatforms.includes(p.id));
  };

  const handleSchedule = async () => {
    setIsScheduling(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would make actual API calls to schedule posts
    console.log("Scheduling posts:", {
      platforms: selectedPlatforms,
      content: platformContent,
      schedule: scheduleTime
    });
    
    setIsScheduling(false);
    // Reset wizard or show success message
    setCurrentStep(1);
    setSelectedPlatforms([]);
    setPlatformContent({});
    setGlobalContent("");
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedPlatforms.length > 0;
      case 2:
        return globalContent.trim().length > 0;
      case 3:
        return scheduleTime.date && scheduleTime.time;
      default:
        return true;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Multi-Platform Post Scheduling Wizard</CardTitle>
          <Badge variant="secondary">Step {currentStep} of {totalSteps}</Badge>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 1: Platform Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Select Platforms</h3>
              <p className="text-sm text-gray-600 mb-4">Choose which social media platforms you want to post to</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${platform.color}`}>
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{platform.name}</h4>
                      <p className="text-xs text-gray-500">Max: {platform.maxLength.toLocaleString()} chars</p>
                    </div>
                    <Checkbox
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => handlePlatformToggle(platform.id)}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {platform.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Content Creation */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Create Content</h3>
              <p className="text-sm text-gray-600 mb-4">Write your post content. It will be applied to all selected platforms by default.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="global-content">Post Content</Label>
                <Textarea
                  id="global-content"
                  placeholder="Write your post content here..."
                  value={globalContent}
                  onChange={(e) => handleGlobalContentChange(e.target.value)}
                  className="min-h-32"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {globalContent.length} characters
                </p>
              </div>

              <div className="grid gap-4">
                <h4 className="font-medium">Platform-Specific Content</h4>
                {getSelectedPlatforms().map((platform) => (
                  <div key={platform.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                      <Checkbox
                        checked={platformContent[platform.id]?.enabled !== false}
                        onCheckedChange={(checked) => updatePlatformContent(platform.id, 'enabled', checked)}
                      />
                    </div>
                    
                    {platformContent[platform.id]?.enabled !== false && (
                      <div className="space-y-3">
                        <Textarea
                          placeholder={`Customize content for ${platform.name}...`}
                          value={platformContent[platform.id]?.content || ""}
                          onChange={(e) => updatePlatformContent(platform.id, 'content', e.target.value)}
                          className="min-h-24"
                        />
                        <Input
                          placeholder="Add hashtags..."
                          value={platformContent[platform.id]?.hashtags || ""}
                          onChange={(e) => updatePlatformContent(platform.id, 'hashtags', e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          {(platformContent[platform.id]?.content || "").length} / {platform.maxLength} characters
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Schedule Post</h3>
              <p className="text-sm text-gray-600 mb-4">Choose when to publish your content</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleTime.date ? format(scheduleTime.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduleTime.date}
                      onSelect={(date) => setScheduleTime(prev => ({ ...prev, date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-3">
                <Label>Select Time</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <Input
                    type="time"
                    value={scheduleTime.time}
                    onChange={(e) => setScheduleTime(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Optimal Posting Times</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Facebook:</span> 9-10 AM, 1-3 PM
                </div>
                <div>
                  <span className="font-medium">Instagram:</span> 11 AM-1 PM, 5-7 PM
                </div>
                <div>
                  <span className="font-medium">Twitter:</span> 8-10 AM, 7-9 PM
                </div>
                <div>
                  <span className="font-medium">LinkedIn:</span> 8-9 AM, 12-1 PM
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Review & Confirm</h3>
              <p className="text-sm text-gray-600 mb-4">Review your post before scheduling</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Schedule Details</h4>
                <p className="text-sm text-gray-600">
                  {scheduleTime.date && scheduleTime.time && (
                    <>Publishing on {format(scheduleTime.date, "PPP")} at {scheduleTime.time}</>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Platform Previews</h4>
                {getSelectedPlatforms().map((platform) => {
                  const content = platformContent[platform.id];
                  if (!content?.enabled) return null;
                  
                  return (
                    <div key={platform.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                      <div className="bg-white border rounded-lg p-3">
                        <p className="text-sm whitespace-pre-wrap">{content.content}</p>
                        {content.hashtags && (
                          <p className="text-blue-600 text-sm mt-2">{content.hashtags}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {currentStep < totalSteps && (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            
            {currentStep === totalSteps && (
              <Button
                onClick={handleSchedule}
                disabled={isScheduling || !canProceed()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isScheduling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Schedule Posts
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}