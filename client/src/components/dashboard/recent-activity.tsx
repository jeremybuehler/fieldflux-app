import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  MoreHorizontal
} from "lucide-react";

interface Activity {
  id: string;
  type: 'content' | 'lead' | 'campaign' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  metadata?: {
    platform?: string;
    value?: string;
    count?: number;
  };
}

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities/recent"],
    // This will fetch real data when backend is implemented
  });

  // High-quality demo data
  const defaultActivities: Activity[] = [
    {
      id: '1',
      type: 'content',
      title: 'Blog Post Published',
      description: '"Winter HVAC Maintenance Tips" published to WordPress',
      timestamp: '2 minutes ago',
      status: 'completed',
      metadata: { platform: 'WordPress' }
    },
    {
      id: '2',
      type: 'lead',
      title: 'New Lead Qualified',
      description: 'Sarah Johnson from Tampa qualified for heating installation',
      timestamp: '15 minutes ago',
      status: 'completed',
      metadata: { value: '$3,200' }
    },
    {
      id: '3',
      type: 'campaign',
      title: 'Social Media Campaign',
      description: 'Instagram winter promotion campaign launched',
      timestamp: '1 hour ago',
      status: 'in_progress',
      metadata: { platform: 'Instagram', count: 5 }
    },
    {
      id: '4',
      type: 'system',
      title: 'SEO Analysis Complete',
      description: 'Keyword rankings updated for 127 tracked terms',
      timestamp: '2 hours ago',
      status: 'completed',
      metadata: { count: 127 }
    },
    {
      id: '5',
      type: 'content',
      title: 'Social Posts Scheduled',
      description: 'Week of Facebook content scheduled successfully',
      timestamp: '3 hours ago',
      status: 'completed',
      metadata: { platform: 'Facebook', count: 7 }
    },
    {
      id: '6',
      type: 'lead',
      title: 'Lead Response Sent',
      description: 'Auto-response sent to Mike Chen regarding AC repair',
      timestamp: '4 hours ago',
      status: 'completed'
    }
  ];

  const displayActivities = activities || defaultActivities;

  const getActivityIcon = (type: string, status: string) => {
    if (status === 'failed') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (status === 'in_progress') return <PlayCircle className="w-4 h-4 text-blue-500" />;
    
    switch (type) {
      case 'content': return <FileText className="w-4 h-4 text-green-500" />;
      case 'lead': return <Users className="w-4 h-4 text-purple-500" />;
      case 'campaign': return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'system': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-50 text-green-700 border-green-200',
      in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      failed: 'bg-red-50 text-red-700 border-red-200'
    };

    return (
      <Badge className={`text-xs px-2 py-1 ${variants[status as keyof typeof variants]} border`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    // In real implementation, you'd use a proper date formatting library
    return timestamp;
  };

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Latest updates from your marketing automation
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {displayActivities.slice(0, 6).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 group hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
              <div className="mt-0.5 p-1.5 bg-muted rounded-full">
                {getActivityIcon(activity.type, activity.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </h4>
                  {getStatusBadge(activity.status)}
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(activity.timestamp)}
                  </div>
                  
                  {activity.metadata && (
                    <div className="flex items-center space-x-2">
                      {activity.metadata.platform && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {activity.metadata.platform}
                        </Badge>
                      )}
                      {activity.metadata.value && (
                        <span className="text-xs font-medium text-green-600">
                          {activity.metadata.value}
                        </span>
                      )}
                      {activity.metadata.count && (
                        <span className="text-xs text-muted-foreground">
                          {activity.metadata.count} items
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" className="w-full" size="sm">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}