import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Calendar,
  ArrowRight,
  Target,
  MessageSquare,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

const statsCards = [
  {
    title: 'Total Leads',
    value: '247',
    change: '+12.3%',
    changeType: 'positive' as const,
    icon: Users,
    description: 'This month'
  },
  {
    title: 'Review Score',
    value: '4.8',
    change: '+0.2',
    changeType: 'positive' as const,
    icon: Star,
    description: 'Average rating'
  },
  {
    title: 'Conversion Rate',
    value: '23.4%',
    change: '+1.8%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    description: 'Lead to customer'
  },
  {
    title: 'Social Engagement',
    value: '1,234',
    change: '+5.7%',
    changeType: 'positive' as const,
    icon: MessageSquare,
    description: 'Total interactions'
  }
];

const recentActivities = [
  {
    type: 'lead',
    title: 'New lead from Google Ads',
    description: 'HVAC repair request in Downtown',
    time: '5 minutes ago',
    status: 'new',
    priority: 'high'
  },
  {
    type: 'review',
    title: 'New 5-star review received',
    description: 'Customer praised quick response time',
    time: '1 hour ago',
    status: 'positive',
    priority: 'medium'
  },
  {
    type: 'social',
    title: 'Social post published',
    description: 'Instagram post about seasonal maintenance',
    time: '2 hours ago',
    status: 'completed',
    priority: 'low'
  },
  {
    type: 'analytics',
    title: 'Weekly report generated',
    description: 'Performance metrics are ready for review',
    time: '1 day ago',
    status: 'ready',
    priority: 'medium'
  }
];

const upcomingTasks = [
  {
    title: 'Respond to customer review',
    description: 'Reply to recent 4-star review on Google',
    dueTime: 'Due in 2 hours',
    priority: 'high',
    type: 'review'
  },
  {
    title: 'Schedule social media posts',
    description: 'Queue content for next week',
    dueTime: 'Due tomorrow',
    priority: 'medium',
    type: 'social'
  },
  {
    title: 'Follow up with warm leads',
    description: '3 leads need follow-up calls',
    dueTime: 'Due today',
    priority: 'high',
    type: 'lead'
  }
];

export default function DashboardMain() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Good morning! 👋
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your marketing today.
            </p>
          </div>
          <Button 
            className="text-white"
            style={{ backgroundColor: "#F97316" }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#EA580C"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#F97316"}
          >
            <Target className="mr-2 h-4 w-4" />
            Set Today's Goals
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                    </div>
                  </div>
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#F97316" }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'lead' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                  activity.type === 'social' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'lead' && <Users className="h-4 w-4" />}
                  {activity.type === 'review' && <Star className="h-4 w-4" />}
                  {activity.type === 'social' && <MessageSquare className="h-4 w-4" />}
                  {activity.type === 'analytics' && <BarChart3 className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <Badge variant={
                      activity.priority === 'high' ? 'destructive' :
                      activity.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {activity.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full mt-0.5 ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {task.priority === 'high' ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{task.dueTime}</p>
                  </div>
                </div>
                {index < upcomingTasks.length - 1 && <hr className="border-gray-100" />}
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Create Social Post</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Add New Lead</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Star className="h-6 w-6" />
              <span className="text-sm">Manage Reviews</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}