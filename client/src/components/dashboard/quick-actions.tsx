import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  MessageSquare,
  FileText,
  Calendar,
  Target,
  Zap,
  PenTool,
  TrendingUp,
  Users,
  Send
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  action: () => void;
  badge?: string;
}

export default function QuickActions() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleAction = async (actionId: string, action: () => void) => {
    setIsGenerating(actionId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    action();
    setIsGenerating(null);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'create-post',
      label: 'Create Social Post',
      description: 'Generate AI-powered social media content',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: () => console.log('Create social post'),
      badge: 'AI'
    },
    {
      id: 'generate-blog',
      label: 'Write Blog Article',
      description: 'Create SEO-optimized blog content',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: () => console.log('Generate blog'),
      badge: 'SEO'
    },
    {
      id: 'schedule-campaign',
      label: 'Schedule Campaign',
      description: 'Plan your next marketing campaign',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: () => console.log('Schedule campaign')
    },
    {
      id: 'analyze-leads',
      label: 'Analyze Leads',
      description: 'Review lead quality and conversion',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: () => console.log('Analyze leads'),
      badge: 'Smart'
    },
    {
      id: 'create-ad',
      label: 'Create Ad Campaign',
      description: 'Launch targeted advertising',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      action: () => console.log('Create ad')
    },
    {
      id: 'send-newsletter',
      label: 'Send Newsletter',
      description: 'Engage customers with updates',
      icon: Send,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      action: () => console.log('Send newsletter')
    }
  ];

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Zap className="w-5 h-5 text-primary mr-2" />
              Quick Actions
            </h3>
            <p className="text-sm text-muted-foreground">
              Start your most common marketing tasks with one click
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isLoading = isGenerating === action.id;

            return (
              <Button
                key={action.id}
                variant="ghost"
                onClick={() => handleAction(action.id, action.action)}
                disabled={isLoading}
                className={`
                  h-auto p-4 flex flex-col items-center space-y-2 
                  ${action.bgColor} border border-transparent
                  hover:border-border transition-all duration-200
                  relative group
                `}
              >
                {action.badge && (
                  <Badge 
                    className="absolute -top-1 -right-1 text-xs px-1.5 py-0 bg-primary text-primary-foreground"
                  >
                    {action.badge}
                  </Badge>
                )}
                
                <div className={`p-2 rounded-lg ${isLoading ? 'animate-pulse' : ''}`}>
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                
                <div className="text-center">
                  <div className="text-xs font-medium text-foreground mb-1">
                    {action.label}
                  </div>
                  <div className="text-xs text-muted-foreground leading-tight">
                    {action.description}
                  </div>
                </div>

                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        {/* AI Assistant Prompt */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <PenTool className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Need something custom?
              </p>
              <p className="text-xs text-muted-foreground">
                Tell us what you'd like to create and we'll help you build it
              </p>
            </div>
            <Button size="sm" variant="outline">
              Ask AI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}