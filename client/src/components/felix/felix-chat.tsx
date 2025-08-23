import { useState, useRef, useEffect } from "react";
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
  Users
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'felix',
      content: "👋 Hi there! I'm Felix, your AI marketing assistant for field service professionals. I'm here to help you grow your HVAC, plumbing, electrical, or landscaping business with smart marketing strategies. What would you like to work on today?",
      timestamp: new Date(),
      options: TASK_OPTIONS
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgb(var(--fx-orange-600))'}}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg" style={{color: 'rgb(var(--fx-navy-900))'}}>Felix AI Assistant</h2>
            <p className="text-sm text-gray-600">Your Field Service Marketing Expert</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'felix' ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  {message.type === 'felix' ? (
                    <Bot className="w-5 h-5" style={{color: 'rgb(var(--fx-orange-600))'}} />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <Card className={`${message.type === 'felix' ? 'bg-white' : 'bg-blue-50'}`}>
                    <CardContent className="p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>

                  {message.options && message.options.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {message.options.map((option) => (
                        <Card 
                          key={option.id} 
                          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 bg-white border-2"
                          style={{borderColor: 'rgb(var(--fx-orange-200))'}}
                          onClick={() => handleTaskSelect(option.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 rounded-lg" style={{backgroundColor: 'rgb(var(--fx-orange-100))'}}>
                                <option.icon className="w-5 h-5" style={{color: 'rgb(var(--fx-orange-600))'}} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">{option.title}</h4>
                                <p className="text-xs text-gray-600">{option.description}</p>
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {option.category}
                                </Badge>
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
              <div className="flex space-x-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-100">
                  <Bot className="w-5 h-5" style={{color: 'rgb(var(--fx-orange-600))'}} />
                </div>
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-gray-600 text-sm">Felix is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Felix about your marketing needs..."
              className="flex-1"
              disabled={isProcessing}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isProcessing}
              className="px-6 text-white"
              style={{backgroundColor: 'rgb(var(--fx-orange-600))'}}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}