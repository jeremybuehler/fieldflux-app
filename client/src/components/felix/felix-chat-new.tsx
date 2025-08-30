import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bot,
  Send,
  MessageCircle,
  Users,
  Star,
  BarChart3,
  MessageSquare,
  Zap,
  PlusCircle,
  TrendingUp,
  Clock,
  Target,
  Globe,
  Search
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'felix' | 'system' | 'insight';
  content: string;
  timestamp: Date;
  suggestions?: FeatureSuggestion[];
  quickActions?: QuickAction[];
  insightType?: 'productivity' | 'marketing' | 'leads' | 'growth';
  insightTitle?: string;
  impact?: string;
  route?: string;
}

interface FeatureSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  route?: string;
  action?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  route?: string;
}

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  available: boolean;
}

interface FelixChatProps {
  onNavigate?: (route: string) => void;
}

export function FelixChat({ onNavigate }: FelixChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4');
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth() as { user: any };
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Load available models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await apiRequest('GET', '/api/felix/models', {});
        const data = await response.json();
        setAvailableModels(data.models || []);
      } catch (error) {
        console.error('Failed to load models:', error);
        // Fallback models if API fails - prioritize Anthropic since OpenAI quota is exceeded
        setAvailableModels([
          { id: 'claude-sonnet-4', name: 'Claude 4.0 Sonnet', provider: 'anthropic', description: 'Latest Anthropic model', available: true },
          { id: 'claude-haiku-3.5', name: 'Claude 3.5 Haiku', provider: 'anthropic', description: 'Fast Anthropic model', available: true },
          { id: 'gpt-5', name: 'GPT-5', provider: 'openai', description: 'Most advanced OpenAI model', available: true },
          { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', description: 'Fast OpenAI model', available: true }
        ]);
        // Set default to Claude since OpenAI quota is exceeded
        setSelectedModel('claude-sonnet-4');
      }
    };
    loadModels();
  }, []);

  // Initialize Felix with a contextual welcome message
  useEffect(() => {
    if (user && !isInitialized) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        type: 'felix',
        content: `Hi ${user.firstName || 'there'}! I'm Felix, your AI assistant for FieldFlux. I'm here to help you grow your field service business with intelligent marketing automation. What would you like to work on today?`,
        timestamp: new Date(),
        suggestions: [
          {
            id: 'check-leads',
            title: 'Review New Leads',
            description: 'Check your latest leads and get AI recommendations',
            category: 'leads',
            route: '/leads'
          },
          {
            id: 'create-content',
            title: 'Create Social Content',
            description: 'Generate engaging posts for your business',
            category: 'social',
            route: '/social'
          },
          {
            id: 'view-analytics',
            title: 'Check Performance',
            description: 'Review your marketing analytics',
            category: 'analytics',
            route: '/analytics'
          }
        ],
        quickActions: [
          {
            id: 'new-post',
            label: 'Create Post',
            icon: 'PlusCircle',
            action: 'create-social-post',
            route: '/social'
          },
          {
            id: 'check-reviews',
            label: 'Reviews',
            icon: 'Star',
            action: 'view-reviews',
            route: '/reviews'
          }
        ]
      };
      setMessages([welcomeMessage]);
      setIsInitialized(true);

      // Add a sample insight after welcome
      setTimeout(() => {
        const insightMessage: Message = {
          id: 'insight-' + Date.now(),
          type: 'insight',
          content: 'Field service businesses that use automated marketing see 40% more leads. Let me show you which processes we can automate.',
          timestamp: new Date(),
          insightType: 'productivity',
          insightTitle: 'Productivity Insight',
          impact: 'Could increase leads by 40%',
          route: '/social'
        };
        setMessages(prev => [...prev, insightMessage]);
      }, 3000);
    }
  }, [user, isInitialized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to Felix AI backend
      const response = await apiRequest(
        'POST',
        '/api/felix/chat',
        {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          currentPage: location,
          model: selectedModel
        }
      );

      const responseData = await response.json();

      const felixResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'felix',
        content: responseData.message,
        timestamp: new Date(),
        suggestions: responseData.suggestions || [],
        quickActions: responseData.quickActions || []
      };
      
      setMessages(prev => [...prev, felixResponse]);

      // Add insights as separate messages
      if (responseData.insights && responseData.insights.length > 0) {
        responseData.insights.forEach((insight: any, index: number) => {
          const insightMessage: Message = {
            id: (Date.now() + 2 + index).toString(),
            type: 'insight',
            content: insight.message,
            timestamp: new Date(),
            insightType: insight.type,
            insightTitle: insight.title,
            impact: insight.impact,
            route: insight.route
          };
          
          setTimeout(() => {
            setMessages(prev => [...prev, insightMessage]);
          }, (index + 1) * 1500);
        });
      }
    } catch (error) {
      console.error('Felix chat error:', error);
      
      // Fallback response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'felix',
        content: `I understand you want to work on "${currentInput}". Let me help you with that. What specific aspect would you like to focus on?`,
        timestamp: new Date(),
        suggestions: getRelevantSuggestions(currentInput)
      };
      
      setMessages(prev => [...prev, fallbackResponse]);

      toast({
        title: "Connection Issue",
        description: "Using offline mode. Some features may be limited.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const getRelevantSuggestions = (input: string): FeatureSuggestion[] => {
    const allSuggestions: FeatureSuggestion[] = [
      {
        id: 'social-media',
        title: 'Social Media Management',
        description: 'Create and schedule posts',
        category: 'content',
        route: '/social'
      },
      {
        id: 'leads',
        title: 'Lead Management', 
        description: 'Track and convert leads',
        category: 'sales',
        route: '/leads'
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'Performance insights',
        category: 'analytics',
        route: '/analytics'
      },
      {
        id: 'reviews',
        title: 'Reviews',
        description: 'Manage customer reviews',
        category: 'reputation',
        route: '/reviews'
      }
    ];

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('social') || lowerInput.includes('post')) {
      return [allSuggestions[0], allSuggestions[2]];
    }
    if (lowerInput.includes('lead') || lowerInput.includes('customer')) {
      return [allSuggestions[1], allSuggestions[3]];
    }
    
    return allSuggestions.slice(0, 3);
  };

  const handleSuggestionClick = (suggestion: FeatureSuggestion) => {
    if (suggestion.route) {
      navigate(suggestion.route);
      onNavigate?.(suggestion.route);
    }
  };

  const handleQuickActionClick = (action: QuickAction) => {
    if (action.route) {
      navigate(action.route);
      onNavigate?.(action.route);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'PlusCircle': PlusCircle,
      'Users': Users,
      'Star': Star,
      'BarChart3': BarChart3,
      'MessageSquare': MessageSquare,
      'Search': Search,
      'Globe': Globe,
      'Zap': Zap
    };
    return iconMap[iconName] || MessageSquare;
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Set available models when they load
  useEffect(() => {
    if (availableModels.length > 0 && availableModels.find(m => m.id === 'claude-sonnet-4')) {
      setSelectedModel('claude-sonnet-4');
    }
  }, [availableModels]);

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'insight' ? (
                // Special insight message styling like in the screenshot
                <div className="max-w-[90%] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{message.insightTitle}</h4>
                        {message.impact && (
                          <p className="text-xs text-gray-500">{message.impact}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">2/3</div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700 mb-3">{message.content}</p>
                    {message.route && (
                      <div className="flex justify-between items-center">
                        <Button
                          onClick={() => handleSuggestionClick({ 
                            id: message.id, 
                            title: 'View Details', 
                            description: '', 
                            category: 'action',
                            route: message.route 
                          })}
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          Show Me How
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setMessages(prev => prev.filter(m => m.id !== message.id))}
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Regular message styling  
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-orange-500 text-white rounded-l-lg rounded-tr-lg' 
                    : 'bg-white border rounded-r-lg rounded-tl-lg'
                } p-3 shadow-sm`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'felix' && (
                      <Bot className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm whitespace-pre-wrap ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}>
                        {message.content}
                      </p>
                    
                      {/* Feature Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs font-medium text-gray-600 mb-2">Suggestions:</div>
                          {message.suggestions.map((suggestion) => (
                            <Button
                              key={suggestion.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full justify-start text-left h-auto p-3 hover:bg-orange-50 hover:border-orange-200"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{suggestion.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{suggestion.description}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Quick Actions */}
                      {message.quickActions && message.quickActions.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-medium text-gray-600 mb-2">Quick Actions:</div>
                          <div className="flex flex-wrap gap-2">
                            {message.quickActions.map((action) => {
                              const Icon = getIconComponent(action.icon);
                              return (
                                <Button
                                  key={action.id}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickActionClick(action)}
                                  className="flex items-center space-x-1 text-xs hover:bg-orange-50 hover:border-orange-200"
                                  style={{ borderColor: "#F97316" }}
                                >
                                  <Icon className="w-3 h-3" />
                                  <span>{action.label}</span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-r-lg rounded-tl-lg p-3 shadow-sm max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-orange-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white space-y-3 flex-shrink-0">
        {/* Model Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600">AI Model:</span>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableModels.filter(model => model.available).map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        model.provider === 'openai' ? 'bg-green-500' : 'bg-purple-500'
                      }`} />
                      <span className="font-medium">{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-gray-400">
            {availableModels.find(m => m.id === selectedModel)?.description}
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Felix anything about your business..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            style={{ backgroundColor: "#F97316", color: "white" }}
            className="hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}