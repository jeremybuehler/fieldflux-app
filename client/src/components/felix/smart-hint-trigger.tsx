import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, X, ArrowRight } from "lucide-react";

interface SmartHintTriggerProps {
  trigger: string; // 'idle', 'struggle', 'opportunity', 'achievement'
  context?: any;
  onDismiss?: () => void;
  onAction?: (action: string) => void;
}

export default function SmartHintTrigger({ 
  trigger, 
  context, 
  onDismiss, 
  onAction 
}: SmartHintTriggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hint, setHint] = useState<any>(null);

  useEffect(() => {
    const generateContextualHint = () => {
      switch (trigger) {
        case 'idle':
          return {
            title: "Felix suggests next steps",
            message: "I notice you've been here for a while. Would you like me to suggest some productive actions?",
            actions: [
              { label: "Show suggestions", action: "show-suggestions" },
              { label: "Quick tutorial", action: "quick-tutorial" }
            ],
            priority: 'low',
            type: 'suggestion'
          };
          
        case 'struggle':
          return {
            title: "Need assistance?",
            message: "It looks like you might be stuck. I'm here to help guide you through this process.",
            actions: [
              { label: "Get help", action: "get-help" },
              { label: "Watch tutorial", action: "watch-tutorial" }
            ],
            priority: 'high',
            type: 'assistance'
          };
          
        case 'opportunity':
          return {
            title: "Perfect timing!",
            message: "This is a great moment to optimize your workflow. Let me show you how.",
            actions: [
              { label: "Show optimization", action: "show-optimization" },
              { label: "Learn more", action: "learn-more" }
            ],
            priority: 'medium',
            type: 'optimization'
          };
          
        case 'achievement':
          return {
            title: "Great progress!",
            message: "You're doing well! Ready to take it to the next level?",
            actions: [
              { label: "Next steps", action: "next-steps" },
              { label: "Advanced features", action: "advanced-features" }
            ],
            priority: 'medium',
            type: 'celebration'
          };
          
        default:
          return null;
      }
    };

    const contextualHint = generateContextualHint();
    if (contextualHint) {
      setHint(contextualHint);
      setIsVisible(true);
      
      // Auto-hide low priority hints after 8 seconds
      if (contextualHint.priority === 'low') {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [trigger]);

  const handleAction = (action: string) => {
    onAction?.(action);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || !hint) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-top-2">
      <Card className="shadow-lg border-l-4 bg-white" style={{borderLeftColor: 'rgb(var(--fx-orange-600))'}}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgb(var(--fx-orange-100))'}}>
                <Bot className="w-4 h-4" style={{color: 'rgb(var(--fx-orange-600))'}} />
              </div>
              <Badge variant="outline" className="text-xs">
                {hint.type}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {hint.title}
              </h4>
              <p className="text-xs text-gray-600">
                {hint.message}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {hint.actions?.map((actionItem: any, index: number) => (
                <Button
                  key={index}
                  size="sm"
                  variant={index === 0 ? "default" : "outline"}
                  onClick={() => handleAction(actionItem.action)}
                  className={`text-xs ${index === 0 ? 'text-white' : ''}`}
                  style={index === 0 ? {backgroundColor: 'rgb(var(--fx-orange-600))'} : {}}
                >
                  {actionItem.label}
                  {index === 0 && <ArrowRight className="w-3 h-3 ml-1" />}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}