import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
  Star,
  Globe,
  Search
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'felix' | 'system';
  content: string;
  timestamp: Date;
  actions?: FeatureAction[];
}

interface FeatureAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  onClick: () => void;
}

interface FelixChatProps {
  onOpenWindow?: (windowType: string, config?: any) => void;
}

export function FelixChat({ onOpenWindow }: FelixChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'felix',
      content: 'Hello! I\'m Felix, your intelligent Field Service Assistant. I can help you manage your marketing, leads, social media, and more. What would you like to work on today?',
      timestamp: new Date(),
      actions: [
        {
          id: 'social-media',
          title: 'Social Media Management',
          description: 'Create and schedule social media posts',
          icon: MessageSquare,
          category: 'content',
          onClick: () => onOpenWindow?.('social-media')
        },
        {
          id: 'lead-management',
          title: 'Lead Management',
          description: 'Track and manage your leads',
          icon: Users,
          category: 'sales',
          onClick: () => onOpenWindow?.('leads')
        },
        {
          id: 'analytics',
          title: 'Analytics Dashboard',
          description: 'View your marketing performance',
          icon: BarChart3,
          category: 'analytics',
          onClick: () => onOpenWindow?.('analytics')
        },
        {
          id: 'reviews',
          title: 'Review Management',
          description: 'Monitor and respond to reviews',
          icon: Star,
          category: 'reputation',
          onClick: () => onOpenWindow?.('reviews')
        }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Felix response
    setTimeout(() => {
      const felixResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'felix',
        content: `I understand you want to work on "${inputValue}". Let me help you with that. Which specific area would you like to focus on?`,
        timestamp: new Date(),
        actions: getRelevantActions(inputValue)
      };
      
      setMessages(prev => [...prev, felixResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getRelevantActions = (input: string): FeatureAction[] => {
    const allActions: FeatureAction[] = [
      {
        id: 'social-media',
        title: 'Social Media Management',
        description: 'Create and schedule posts',
        icon: MessageSquare,
        category: 'content',
        onClick: () => onOpenWindow?.('social-media')
      },
      {
        id: 'leads',
        title: 'Lead Management', 
        description: 'Track and convert leads',
        icon: Users,
        category: 'sales',
        onClick: () => onOpenWindow?.('leads')
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'Performance insights',
        icon: BarChart3,
        category: 'analytics',
        onClick: () => onOpenWindow?.('analytics')
      },
      {
        id: 'reviews',
        title: 'Reviews',
        description: 'Manage customer reviews',
        icon: Star,
        category: 'reputation',
        onClick: () => onOpenWindow?.('reviews')
      },
      {
        id: 'keywords',
        title: 'SEO Keywords',
        description: 'Track keyword rankings',
        icon: Search,
        category: 'seo',
        onClick: () => onOpenWindow?.('keywords')
      },
      {
        id: 'website',
        title: 'Website Management',
        description: 'Content and SEO tools',
        icon: Globe,
        category: 'web',
        onClick: () => onOpenWindow?.('website')
      }
    ];

    // Return relevant actions based on input
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('social') || lowerInput.includes('post')) {
      return [allActions[0], allActions[2]];
    }
    if (lowerInput.includes('lead') || lowerInput.includes('customer')) {
      return [allActions[1], allActions[3]];
    }
    
    return allActions.slice(0, 4);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: "#F97316" }}
          >
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Felix</h2>
            <p className="text-sm text-gray-500">Your Intelligent Field Service Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-orange-500 text-white rounded-l-lg rounded-tr-lg' 
                  : 'bg-white border rounded-r-lg rounded-tl-lg'
              } p-3 shadow-sm`}>
                <div className="flex items-start space-x-2">
                  {message.type === 'felix' && (
                    <Bot className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}>
                      {message.content}
                    </p>
                    
                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.actions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <Button
                              key={action.id}
                              variant="outline"
                              size="sm"
                              onClick={action.onClick}
                              className="w-full justify-start text-left h-auto p-3"
                            >
                              <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{action.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-r-lg rounded-tl-lg p-3 shadow-sm">
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
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Felix anything about your field service business..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            className="text-white"
            style={{ backgroundColor: "#F97316" }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#EA580C"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#F97316"}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}