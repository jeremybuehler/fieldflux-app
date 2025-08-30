import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import TopNav from "@/components/navigation/top-nav";
import {
  Bot,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Calendar,
  BarChart3,
  Users,
  MessageSquare,
  Star,
  Zap,
  Award,
  BookOpen,
  Plus,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

interface AiCoachInsight {
  id: number;
  insightType: 'recommendation' | 'achievement' | 'warning' | 'tip';
  title: string;
  message: string;
  actionable?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'engagement' | 'productivity' | 'features' | 'goals';
  isRead: boolean;
  isActionTaken: boolean;
  relatedFeature?: string;
  createdAt: string;
}

interface UserGoal {
  id: number;
  goalType: 'daily' | 'weekly' | 'monthly' | 'custom';
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'content' | 'leads' | 'engagement' | 'productivity';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface EngagementMetrics {
  totalSessions: number;
  totalTimeSpent: number;
  averageSessionDuration: number;
  featuresUsed: string[];
  actionsCompleted: number;
  goalsAchieved: number;
  engagementScore: number;
  productivityScore: number;
  weeklyProgress: {
    contentCreated: number;
    leadsGenerated: number;
    reviewsManaged: number;
    socialPosts: number;
  };
}

export default function AICoach() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("insights");
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    goalType: "weekly" as const,
    targetValue: 0,
    unit: "posts",
    category: "content" as const,
    priority: "medium" as const,
    dueDate: "",
  });

  // Fetch AI coach insights
  const { data: insights = [], isLoading: insightsLoading } = useQuery<AiCoachInsight[]>({
    queryKey: ['/api/ai-coach/insights'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user goals
  const { data: goals = [], isLoading: goalsLoading } = useQuery<UserGoal[]>({
    queryKey: ['/api/ai-coach/goals'],
  });

  // Fetch engagement metrics
  const { data: metrics = {} as EngagementMetrics, isLoading: metricsLoading } = useQuery<EngagementMetrics>({
    queryKey: ['/api/ai-coach/metrics'],
  });

  // Mark insight as read mutation
  const markInsightReadMutation = useMutation({
    mutationFn: async (insightId: number) => {
      const response = await fetch(`/api/ai-coach/insights/${insightId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to mark insight as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-coach/insights'] });
    },
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: typeof newGoal) => {
      const response = await fetch('/api/ai-coach/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      });
      if (!response.ok) throw new Error('Failed to create goal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-coach/goals'] });
      setNewGoal({
        title: "",
        description: "",
        goalType: "weekly",
        targetValue: 0,
        unit: "posts",
        category: "content",
        priority: "medium",
        dueDate: "",
      });
      toast({
        title: "Goal Created",
        description: "Your new goal has been added successfully!",
      });
    },
  });

  // Generate AI recommendations mutation
  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai-coach/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to generate recommendations');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-coach/insights'] });
      toast({
        title: "New Recommendations Generated",
        description: "Your AI coach has created personalized insights for you!",
      });
    },
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-blue-600" />;
      case 'tip': return <BookOpen className="w-5 h-5 text-purple-600" />;
      default: return <Bot className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGoalProgress = (goal: UserGoal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  return (
    <div className="min-h-screen landing-page">
      <TopNav />
      
      <main className="w-full">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold gradient-text">AI Coach</h1>
                <p className="text-sm text-fieldflux-secondary">Your personal AI assistant for engagement and productivity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* AI Coach Action Button */}
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => generateRecommendationsMutation.mutate()}
          disabled={generateRecommendationsMutation.isPending}
          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          {generateRecommendationsMutation.isPending ? 'Generating...' : 'Get New Insights'}
        </Button>
      </div>

      {/* Engagement Overview */}
      {!metricsLoading && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics?.engagementScore || 0}%</div>
              <Progress value={Number(metrics?.engagementScore) || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              <Target className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics?.productivityScore || 0}%</div>
              <Progress value={Number(metrics?.productivityScore) || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((metrics?.totalTimeSpent || 0) / 60)}m
              </div>
              <p className="text-xs text-gray-600 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics?.goalsAchieved || 0}</div>
              <p className="text-xs text-gray-600 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Personalized Insights
              </CardTitle>
              <CardDescription>
                AI-generated recommendations based on your usage patterns and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight: AiCoachInsight) => (
                    <div
                      key={insight.id}
                      className={`border rounded-lg p-4 ${
                        insight.isRead ? 'bg-gray-50' : 'bg-white border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getInsightIcon(insight.insightType)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                              <Badge className={getPriorityColor(insight.priority)}>
                                {insight.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{insight.message}</p>
                            {insight.actionable && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                                <p className="text-sm text-blue-800">
                                  <strong>Action:</strong> {insight.actionable}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!insight.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markInsightReadMutation.mutate(insight.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No insights available yet. Generate some recommendations to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Active Goals</CardTitle>
                <CardDescription>Track your progress towards key objectives</CardDescription>
              </CardHeader>
              <CardContent>
                {goalsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : goals.length > 0 ? (
                  <div className="space-y-4">
                    {goals.filter((goal: UserGoal) => goal.status === 'active').map((goal: UserGoal) => (
                      <div key={goal.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          <Badge variant="secondary">{goal.goalType}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                          </div>
                          <Progress value={getGoalProgress(goal)} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active goals. Create your first goal to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create New Goal */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Goal</CardTitle>
                <CardDescription>Set a new objective to track your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Create 10 social media posts"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-description">Description (Optional)</Label>
                  <Textarea
                    id="goal-description"
                    placeholder="Describe what this goal means to you..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-type">Goal Type</Label>
                    <Select 
                      value={newGoal.goalType} 
                      onValueChange={(value) => setNewGoal(prev => ({ ...prev, goalType: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal-category">Category</Label>
                    <Select 
                      value={newGoal.category} 
                      onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="leads">Leads</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-target">Target Value</Label>
                    <Input
                      id="goal-target"
                      type="number"
                      placeholder="10"
                      value={newGoal.targetValue || ''}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal-unit">Unit</Label>
                    <Input
                      id="goal-unit"
                      placeholder="posts, leads, hours..."
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => createGoalMutation.mutate(newGoal)}
                  disabled={!newGoal.title || !newGoal.targetValue || createGoalMutation.isPending}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {createGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analytics</CardTitle>
              <CardDescription>Detailed breakdown of your platform usage</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : metrics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Session Data</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Sessions</span>
                        <span className="font-medium">{metrics?.totalSessions || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Duration</span>
                        <span className="font-medium">{Math.round(Number(metrics?.averageSessionDuration) || 0)}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actions Completed</span>
                        <span className="font-medium">{metrics?.actionsCompleted || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Weekly Progress</h4>
                    <div className="space-y-2">
                      {metrics?.weeklyProgress && Object.entries(metrics.weeklyProgress).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium">{value as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Features Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {metrics?.featuresUsed && metrics.featuresUsed.map((feature: string) => (
                        <Badge key={feature} variant="secondary">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No analytics data available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </main>
    </div>
  );
}