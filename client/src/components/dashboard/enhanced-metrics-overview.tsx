import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign,
  Eye,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles
} from "lucide-react";

interface Metric {
  label: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  description: string;
  insight?: string;
}

interface EnhancedMetricsOverviewProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

export default function EnhancedMetricsOverview({ timeRange, onTimeRangeChange }: EnhancedMetricsOverviewProps) {
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/enhanced-metrics", timeRange],
    // This will fetch real data when backend is implemented
  });

  // High-quality demo data that represents realistic field service metrics
  const metrics: Metric[] = [
    {
      label: "Monthly Revenue",
      value: "$28,450",
      change: 15.3,
      changeType: 'increase',
      icon: DollarSign,
      description: "Total revenue from completed jobs",
      insight: "23% increase from new customer acquisition"
    },
    {
      label: "Website Visitors",
      value: "3,247",
      change: 8.1,
      changeType: 'increase',
      icon: Eye,
      description: "Unique visitors this period",
      insight: "Local SEO improvements driving organic growth"
    },
    {
      label: "Active Leads",
      value: "127",
      change: -3.2,
      changeType: 'decrease',
      icon: Users,
      description: "Qualified leads in pipeline",
      insight: "Seasonal dip expected, consider winter campaigns"
    },
    {
      label: "Conversion Rate",
      value: "32.4%",
      change: 5.7,
      changeType: 'increase',
      icon: Target,
      description: "Lead to customer conversion",
      insight: "New qualification process improving results"
    }
  ];

  const getTrendIcon = (changeType: string, change: number) => {
    if (changeType === 'increase') return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (changeType === 'decrease') return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (changeType: string) => {
    if (changeType === 'increase') return "text-green-600 bg-green-50 border-green-200";
    if (changeType === 'decrease') return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getChangeText = (change: number, changeType: string) => {
    const sign = changeType === 'increase' ? '+' : changeType === 'decrease' ? '' : '';
    return `${sign}${Math.abs(change).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Business Overview</h2>
            <p className="text-sm text-muted-foreground">Key performance indicators for your field service business</p>
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <Sparkles className="w-6 h-6 text-primary mr-2" />
            Business Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered insights for your field service business performance
          </p>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={metric.label} 
              className="relative overflow-hidden border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </CardTitle>
                  </div>
                  {getTrendIcon(metric.changeType, metric.change)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={`${getTrendColor(metric.changeType)} border text-xs`}
                    >
                      {getChangeText(metric.change, metric.changeType)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      vs last period
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      {metric.description}
                    </p>
                    {metric.insight && (
                      <div className="flex items-start space-x-1 group-hover:visible">
                        <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-primary font-medium leading-relaxed">
                          {metric.insight}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </Card>
          );
        })}
      </div>

      {/* AI-Powered Summary Banner */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">AI Insight</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Your business is performing {metrics[0].changeType === 'increase' ? 'exceptionally well' : 'steadily'} this {timeRange === '7d' ? 'week' : 'period'}. 
                Revenue growth of {Math.abs(metrics[0].change)}% combined with improved conversion rates suggests your recent marketing efforts are highly effective. 
                Consider scaling successful campaigns while addressing the seasonal lead decline with targeted winter promotions.
              </p>
              <Button variant="outline" size="sm" className="text-xs">
                View Detailed Analysis <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}