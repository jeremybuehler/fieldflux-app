import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Plus,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  Mail
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'content' | 'campaign' | 'analysis' | 'followup' | 'system';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  estimatedTime: string;
  status: 'pending' | 'in_progress' | 'completed';
  automated?: boolean;
}

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Weekly SEO Report',
      description: 'Generate keyword performance analysis for this week',
      type: 'analysis',
      priority: 'high',
      dueDate: '2024-01-15T09:00:00',
      estimatedTime: '30 min',
      status: 'pending',
      automated: true
    },
    {
      id: '2',
      title: 'Follow up with Hot Leads',
      description: 'Contact 8 leads who showed high interest in heating installation',
      type: 'followup',
      priority: 'high',
      dueDate: '2024-01-15T14:00:00',
      estimatedTime: '45 min',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Social Media Content Review',
      description: 'Review and approve next week\'s Instagram posts',
      type: 'content',
      priority: 'medium',
      dueDate: '2024-01-16T10:00:00',
      estimatedTime: '20 min',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Campaign Budget Optimization',
      description: 'Adjust Google Ads budget based on performance data',
      type: 'campaign',
      priority: 'medium',
      dueDate: '2024-01-16T16:00:00',
      estimatedTime: '35 min',
      status: 'pending',
      automated: true
    },
    {
      id: '5',
      title: 'Newsletter Prep',
      description: 'Prepare monthly customer newsletter with winter tips',
      type: 'content',
      priority: 'low',
      dueDate: '2024-01-18T11:00:00',
      estimatedTime: '60 min',
      status: 'pending'
    }
  ]);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'content': return <FileText className="w-4 h-4" />;
      case 'campaign': return <TrendingUp className="w-4 h-4" />;
      case 'analysis': return <TrendingUp className="w-4 h-4" />;
      case 'followup': return <Users className="w-4 h-4" />;
      case 'system': return <MessageSquare className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'content': return 'text-green-600';
      case 'campaign': return 'text-blue-600';
      case 'analysis': return 'text-purple-600';
      case 'followup': return 'text-orange-600';
      case 'system': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' as const }
          : task
      )
    );
  };

  const pendingTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Upcoming Tasks
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {pendingTasks.length} tasks remaining today
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">All tasks completed!</p>
              <p className="text-xs text-muted-foreground">
                Great job staying on top of your marketing tasks
              </p>
            </div>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className={`
                  flex items-start space-x-3 p-3 rounded-lg border transition-colors
                  ${isOverdue(task.dueDate) 
                    ? 'border-red-200 bg-red-50/50' 
                    : 'border-border hover:bg-muted/50'
                  }
                `}
              >
                <div className="mt-0.5">
                  <Checkbox
                    onCheckedChange={() => handleTaskComplete(task.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <div className={`${getTaskColor(task.type)}`}>
                        {getTaskIcon(task.type)}
                      </div>
                      <h4 className="font-medium text-foreground text-sm">
                        {task.title}
                      </h4>
                      {task.automated && (
                        <Badge className="text-xs px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                          AUTO
                        </Badge>
                      )}
                    </div>
                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)} border`}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center text-xs ${
                        isOverdue(task.dueDate) ? 'text-red-600' : 'text-muted-foreground'
                      }`}>
                        {isOverdue(task.dueDate) ? (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {formatDueDate(task.dueDate)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ⏱️ {task.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Productivity Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-foreground">{pendingTasks.length}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-foreground">{completedTasks.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>

        {/* AI Automation Status */}
        <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-foreground">
              AI Automation Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {tasks.filter(t => t.automated).length} tasks will be handled automatically
          </p>
        </div>
      </CardContent>
    </Card>
  );
}