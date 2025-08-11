import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  X
} from "lucide-react";

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  dismissed?: boolean;
}

export default function IntelligentInsights() {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Peak Season Optimization',
      description: 'Your conversion rates are 40% higher on weekends. Consider increasing weekend ad spend for better ROI.',
      action: 'Adjust Ad Schedule',
      priority: 'high',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Lead Response Time',
      description: 'Average response time has increased to 3.2 hours. Quick responses improve conversion by 35%.',
      action: 'Set Up Alerts',
      priority: 'high',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'success',
      title: 'Content Performance',
      description: 'Your "Winter HVAC Tips" blog post generated 156% more engagement than average.',
      action: 'Create Similar Content',
      priority: 'medium',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      type: 'info',
      title: 'Seasonal Trends',
      description: 'Historical data shows 25% increase in emergency calls next month. Prepare marketing for emergency services.',
      action: 'Plan Campaign',
      priority: 'medium',
      timestamp: '2 days ago'
    }
  ]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <Lightbulb className="w-4 h-4 text-purple-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'success': return 'bg-blue-50 border-blue-200';
      default: return 'bg-purple-50 border-purple-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <Badge className={`text-xs ${colors[priority as keyof typeof colors]} border`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const dismissInsight = (id: string) => {
    setInsights(insights.filter(insight => insight.id !== id));
  };

  const handleAction = (insight: Insight) => {
    console.log(`Taking action for insight: ${insight.title}`);
    // Here you would implement the actual action logic
  };

  const visibleInsights = insights.filter(insight => !insight.dismissed);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Sparkles className="w-5 h-5 text-primary mr-2" />
          AI Insights
          <Badge variant="secondary" className="ml-2 text-xs">
            {visibleInsights.length} active
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Smart recommendations to grow your business
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {visibleInsights.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">All caught up!</p>
            <p className="text-xs text-muted-foreground">
              New insights will appear here as your business data is analyzed
            </p>
          </div>
        ) : (
          visibleInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)} relative group`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissInsight(insight.id)}
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </Button>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground text-sm">
                      {insight.title}
                    </h4>
                    {getPriorityBadge(insight.priority)}
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {insight.timestamp}
                    </div>
                    
                    {insight.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(insight)}
                        className="h-7 px-3 text-xs"
                      >
                        {insight.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* AI Analysis Status */}
        <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-foreground">
                AI Analysis Active
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Last updated 15 min ago
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Continuously monitoring your business performance for optimization opportunities
          </p>
        </div>
      </CardContent>
    </Card>
  );
}