import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  PlusCircle, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Target,
  Zap,
  FileText,
  Calendar,
  Users,
  ArrowRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FelixWelcomeScreen from "./felix-welcome-screen";
import CanvasManager, { WINDOW_CONFIGS } from "@/components/canvas/canvas-manager";

interface Message {
  id: string;
  type: 'user' | 'felix' | 'system';
  content: string;
  timestamp: Date;
  options?: TaskOption[];
}

interface TaskOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
}

const TASK_OPTIONS: TaskOption[] = [
  {
    id: "create-post",
    title: "Create Social Media Post",
    description: "Generate engaging content for your field service business",
    icon: PlusCircle,
    category: "content"
  },
  {
    id: "analyze-performance",
    title: "Analyze Business Performance",
    description: "Review metrics and get insights about your marketing",
    icon: BarChart3,
    category: "analytics"
  },
  {
    id: "generate-leads",
    title: "Lead Generation Strategy",
    description: "Develop strategies to attract new customers",
    icon: Target,
    category: "marketing"
  },
  {
    id: "schedule-campaign",
    title: "Schedule Marketing Campaign",
    description: "Plan and schedule your marketing activities",
    icon: Calendar,
    category: "planning"
  },
  {
    id: "review-management",
    title: "Review Management",
    description: "Manage and respond to customer reviews",
    icon: MessageSquare,
    category: "reputation"
  },
  {
    id: "customer-insights",
    title: "Customer Insights",
    description: "Understand your customer base better",
    icon: Users,
    category: "analytics"
  }
];

export default function FelixChat() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Don't render Felix if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTaskSelect = async (taskId: string) => {
    const task = TASK_OPTIONS.find(t => t.id === taskId);
    if (!task) return;

    // Check if this should open a canvas window
    const windowMapping: Record<string, string> = {
      "analyze-performance": "analytics",
      "view-analytics": "analytics",
      "manage-leads": "leads",
      "lead-management": "leads",
      "social-media": "social",
      "create-post": "social",
      "manage-reviews": "reviews",
      "review-management": "reviews",
      "seo-optimization": "seo",
      "keywords": "seo",
      "business-settings": "settings",
      "settings": "settings"
    };
    
    const windowId = windowMapping[taskId];
    if (windowId && WINDOW_CONFIGS[windowId]) {
      handleWindowOpen(windowId);
      
      addMessage({
        type: 'user',
        content: `I want to work on: ${task.title}`
      });

      addMessage({
        type: 'felix',
        content: `I've opened the ${WINDOW_CONFIGS[windowId].title} window for you. You can interact with it directly while continuing our conversation here. Would you like me to guide you through any specific tasks in that window?`,
        options: []
      });
      return;
    }

    setCurrentTask(taskId);
    addMessage({
      type: 'user',
      content: `I want to work on: ${task.title}`
    });

    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/felix/start-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId,
          taskTitle: task.title,
          taskDescription: task.description
        })
      });

      const data = await response.json();
      
      addMessage({
        type: 'felix',
        content: data.message,
        options: data.nextSteps || []
      });
    } catch (error) {
      console.error('Error starting task:', error);
      addMessage({
        type: 'felix',
        content: `Great choice! Let's work on ${task.title}. ${getTaskStarterMessage(taskId)}`,
        options: getTaskOptions(taskId)
      });
    }
    
    setIsProcessing(false);
  };

  const handleWindowOpen = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows(prev => [...prev, windowId]);
    }
  };

  const handleWindowClose = (windowId: string) => {
    setOpenWindows(prev => prev.filter(id => id !== windowId));
  };

  const getTaskStarterMessage = (taskId: string): string => {
    const messages = {
      "create-post": "I'll help you create engaging social media content. First, let me know what type of service you want to promote and your target audience.",
      "analyze-performance": "Let's dive into your business performance. I'll help you understand your metrics and identify opportunities for growth.",
      "generate-leads": "Perfect! Lead generation is crucial for field service businesses. Let's create a strategy that works for your specific trade and market.",
      "schedule-campaign": "Smart planning leads to better results. I'll help you create a marketing campaign schedule that fits your business cycle.",
      "review-management": "Online reviews are vital for field service businesses. Let's develop a strategy to manage and improve your online reputation.",
      "customer-insights": "Understanding your customers is key to growing your business. Let's analyze your customer data and identify patterns."
    };
    return messages[taskId as keyof typeof messages] || "Let's get started on this task!";
  };

  const getTaskOptions = (taskId: string): TaskOption[] => {
    const optionSets = {
      "create-post": [
        { id: "post-hvac", title: "HVAC Service Post", description: "Heating and cooling services", icon: Zap, category: "hvac" },
        { id: "post-plumbing", title: "Plumbing Service Post", description: "Plumbing and water services", icon: Zap, category: "plumbing" },
        { id: "post-electrical", title: "Electrical Service Post", description: "Electrical installation and repair", icon: Zap, category: "electrical" },
        { id: "post-landscaping", title: "Landscaping Service Post", description: "Landscaping and lawn care", icon: Zap, category: "landscaping" }
      ],
      "analyze-performance": [
        { id: "analyze-traffic", title: "Website Traffic", description: "Review website visitor data", icon: BarChart3, category: "web" },
        { id: "analyze-leads", title: "Lead Conversion", description: "Analyze lead generation performance", icon: Target, category: "leads" },
        { id: "analyze-social", title: "Social Media", description: "Social media engagement metrics", icon: MessageSquare, category: "social" }
      ]
    };
    return optionSets[taskId as keyof typeof optionSets] || [];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    addMessage({
      type: 'user',
      content: userMessage
    });

    setIsProcessing(true);

    try {
      const response = await fetch('/api/felix/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          currentTask,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      });

      const data = await response.json();
      
      addMessage({
        type: 'felix',
        content: data.message,
        options: data.options || []
      });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        type: 'felix',
        content: "I'm having trouble processing your request right now. Let me help you in a different way. What specific task would you like to work on?"
      });
    }

    setIsProcessing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 p-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  FieldFlux
                </h1>
                <p className="text-gray-600 font-medium">Your Intelligent Field Service Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <FelixWelcomeScreen onTaskSelect={handleTaskSelect} />
          ) : (
            <div className="max-w-5xl mx-auto space-y-6">
            {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex space-x-4 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  message.type === 'felix' 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}>
                  {message.type === 'felix' ? (
                    <Bot className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div className="space-y-4 flex-1">
                  <Card className={`shadow-sm border-0 ${
                    message.type === 'felix' 
                      ? 'bg-white/80 backdrop-blur-sm' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  }`}>
                    <CardContent className="p-6">
                      <p className={`${message.type === 'felix' ? 'text-gray-800' : 'text-white'} leading-relaxed`}>
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>

                  {message.options && message.options.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {message.options.map((option) => (
                        <Card 
                          key={option.id} 
                          className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:border-orange-300/50"
                          onClick={() => handleTaskSelect(option.id)}
                        >
                          <CardContent className="p-5">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 group-hover:from-orange-200 group-hover:to-pink-200 transition-all">
                                  <option.icon className="w-6 h-6 text-orange-600" />
                                </div>
                                <Badge variant="secondary" className="text-xs bg-gray-100/80">
                                  {option.category}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                  {option.title}
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {option.description}
                                </p>
                              </div>
                              <div className="flex items-center text-orange-600 text-sm font-medium group-hover:text-orange-700 transition-colors">
                                <span>Get started</span>
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex space-x-4 max-w-4xl">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-orange-500 to-pink-500 shadow-sm">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 animate-bounce"></div>
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-gray-700 font-medium">Felix is generating your response...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200/50 bg-white/70 backdrop-blur-xl p-6 sticky bottom-0">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="flex items-end space-x-4 bg-white rounded-2xl border border-gray-200/50 shadow-lg p-4">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Felix anything about your field service marketing..."
                  className="border-0 bg-transparent text-lg placeholder-gray-500 focus:ring-0 focus:outline-none resize-none"
                  disabled={isProcessing}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center mt-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/50 hover:bg-white/80 border-gray-200/50 text-gray-600"
                onClick={() => handleWindowOpen("leads")}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Leads
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/50 hover:bg-white/80 border-gray-200/50 text-gray-600"
                onClick={() => handleTaskSelect("schedule-appointments")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Service
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/50 hover:bg-white/80 border-gray-200/50 text-gray-600"
                onClick={() => handleWindowOpen("analytics")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/50 hover:bg-white/80 border-gray-200/50 text-gray-600"
                onClick={() => handleWindowOpen("social")}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Content
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Manager for Windows */}
      <CanvasManager 
        openWindows={openWindows}
        onWindowOpen={handleWindowOpen}
        onWindowClose={handleWindowClose}
      />
    </div>
  );
}