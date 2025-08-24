import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  X, 
  Lightbulb, 
  TrendingUp, 
  Target,
  MessageSquare,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useLocation } from "wouter";

interface Hint {
  id: string;
  type: 'suggestion' | 'insight' | 'optimization' | 'tip' | 'warning';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  priority: 'low' | 'medium' | 'high';
  context: string;
  dismissible: boolean;
}

interface CollaborationHintsProps {
  currentPage?: string;
  userActivity?: any;
  onHintAction?: (hintId: string, action: string) => void;
}

export default function CollaborationHints({ 
  currentPage, 
  userActivity, 
  onHintAction 
}: CollaborationHintsProps) {
  const [location] = useLocation();
  const [hints, setHints] = useState<Hint[]>([]);
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Generate contextual hints based on current page and user activity
  useEffect(() => {
    const generateHints = () => {
      const contextualHints: Hint[] = [];
      const page = currentPage || location;

      // Dashboard hints
      if (page.includes('/dashboard')) {
        contextualHints.push({
          id: 'dashboard-optimization',
          type: 'suggestion',
          title: 'Optimize Your Dashboard',
          message: 'I notice you visit the dashboard frequently. Would you like me to customize the metrics shown based on your field service type?',
          action: {
            label: 'Customize Dashboard',
            onClick: () => onHintAction?.('dashboard-optimization', 'customize')
          },
          priority: 'medium',
          context: 'dashboard',
          dismissible: true
        });

        contextualHints.push({
          id: 'quick-start-guide',
          type: 'tip',
          title: 'Quick Start Guide',
          message: 'New to FieldFlux? I can walk you through the key features that will boost your field service marketing in just 5 minutes.',
          action: {
            label: 'Start Guide',
            onClick: () => onHintAction?.('quick-start-guide', 'start')
          },
          priority: 'high',
          context: 'dashboard',
          dismissible: true
        });
      }

      // Social media hints
      if (page.includes('/social')) {
        contextualHints.push({
          id: 'content-calendar',
          type: 'suggestion',
          title: 'Create Content Calendar',
          message: 'Consistent posting drives better results. Let me help you create a monthly content calendar for your field service business.',
          action: {
            label: 'Create Calendar',
            onClick: () => onHintAction?.('content-calendar', 'create')
          },
          priority: 'medium',
          context: 'social',
          dismissible: true
        });

        contextualHints.push({
          id: 'peak-posting-times',
          type: 'insight',
          title: 'Optimal Posting Times',
          message: 'Field service customers are most active on social media between 6-8 PM weekdays and 10 AM-2 PM weekends. Schedule your posts accordingly!',
          priority: 'low',
          context: 'social',
          dismissible: true
        });
      }

      // Analytics hints
      if (page.includes('/analytics') || page.includes('/reports')) {
        contextualHints.push({
          id: 'connect-analytics',
          type: 'warning',
          title: 'Connect Google Analytics',
          message: 'Connect your Google Analytics to get real insights instead of placeholder data. This will unlock powerful business intelligence.',
          action: {
            label: 'Connect Now',
            onClick: () => onHintAction?.('connect-analytics', 'connect')
          },
          priority: 'high',
          context: 'analytics',
          dismissible: false
        });

        contextualHints.push({
          id: 'monthly-review',
          type: 'suggestion',
          title: 'Monthly Performance Review',
          message: 'It\'s been a while since your last comprehensive review. Let me analyze your data and provide actionable insights.',
          action: {
            label: 'Generate Review',
            onClick: () => onHintAction?.('monthly-review', 'generate')
          },
          priority: 'medium',
          context: 'analytics',
          dismissible: true
        });
      }

      // Reviews page hints
      if (page.includes('/reviews')) {
        contextualHints.push({
          id: 'review-response-template',
          type: 'tip',
          title: 'Professional Review Responses',
          message: 'I can create professional response templates for different types of reviews to maintain your brand voice consistently.',
          action: {
            label: 'Create Templates',
            onClick: () => onHintAction?.('review-response-template', 'create')
          },
          priority: 'medium',
          context: 'reviews',
          dismissible: true
        });
      }

      // Leads page hints
      if (page.includes('/leads')) {
        contextualHints.push({
          id: 'lead-scoring',
          type: 'optimization',
          title: 'Improve Lead Scoring',
          message: 'I can analyze your successful conversions and improve the lead scoring algorithm to prioritize high-value prospects.',
          action: {
            label: 'Optimize Scoring',
            onClick: () => onHintAction?.('lead-scoring', 'optimize')
          },
          priority: 'high',
          context: 'leads',
          dismissible: true
        });
      }

      // General productivity hints
      contextualHints.push({
        id: 'productivity-boost',
        type: 'insight',
        title: 'Productivity Insight',
        message: 'Field service businesses that use automated marketing see 40% more leads. Let me show you which processes we can automate.',
        action: {
          label: 'Show Automation',
          onClick: () => onHintAction?.('productivity-boost', 'show')
        },
        priority: 'medium',
        context: 'general',
        dismissible: true
      });

      // Time-based hints
      const hour = new Date().getHours();
      if (hour >= 9 && hour <= 17) {
        contextualHints.push({
          id: 'business-hours-opportunity',
          type: 'suggestion',
          title: 'Business Hours Opportunity',
          message: 'It\'s prime business hours! Consider posting about your availability for emergency services to capture immediate leads.',
          action: {
            label: 'Create Post',
            onClick: () => onHintAction?.('business-hours-opportunity', 'create-post')
          },
          priority: 'medium',
          context: 'time-based',
          dismissible: true
        });
      }

      return contextualHints.filter(hint => !dismissedHints.has(hint.id));
    };

    setHints(generateHints());
  }, [location, currentPage, dismissedHints, onHintAction]);

  // Cycle through hints every 10 seconds
  useEffect(() => {
    if (hints.length > 1) {
      const interval = setInterval(() => {
        setCurrentHintIndex((prev) => (prev + 1) % hints.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [hints.length]);

  const dismissHint = (hintId: string) => {
    setDismissedHints(prev => new Set(prev.add(hintId)));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Bot className="w-4 h-4" style={{color: 'rgb(var(--fx-orange-600))'}} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <Lightbulb className="w-4 h-4" />;
      case 'insight': return <TrendingUp className="w-4 h-4" />;
      case 'optimization': return <Target className="w-4 h-4" />;
      case 'tip': return <Sparkles className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  if (!isVisible || hints.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-white shadow-lg border-2"
        style={{borderColor: 'rgb(var(--fx-orange-600))', color: 'rgb(var(--fx-orange-600))'}}
      >
        <Bot className="w-4 h-4 mr-2" />
        Felix Hints
      </Button>
    );
  }

  const currentHint = hints[currentHintIndex];
  if (!currentHint) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-xl border-2 bg-white" style={{borderColor: 'rgb(var(--fx-orange-600))'}}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgb(var(--fx-orange-100))'}}>
                <Bot className="w-4 h-4" style={{color: 'rgb(var(--fx-orange-600))'}} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-800">Felix</span>
                {getPriorityIcon(currentHint.priority)}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {hints.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  {currentHintIndex + 1}/{hints.length}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              {getTypeIcon(currentHint.type)}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {currentHint.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentHint.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {currentHint.action && (
                  <Button
                    size="sm"
                    className="text-xs px-3 py-1 text-white"
                    style={{backgroundColor: 'rgb(var(--fx-orange-600))'}}
                    onClick={currentHint.action.onClick}
                  >
                    {currentHint.action.label}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
              
              {currentHint.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissHint(currentHint.id)}
                  className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
                >
                  Dismiss
                </Button>
              )}
            </div>

            {/* Navigation dots for multiple hints */}
            {hints.length > 1 && (
              <div className="flex justify-center space-x-1 pt-2">
                {hints.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHintIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentHintIndex 
                        ? 'bg-orange-500' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}