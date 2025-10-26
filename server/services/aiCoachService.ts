import OpenAI from "openai";
import { db } from "../db";
import { 
  userEngagementSessions, 
  userEngagementMetrics, 
  aiCoachInsights, 
  userGoals,
  socialPosts,
  leads,
  activities,
  type AiCoachInsight,
  type UserEngagementMetrics,
  type UserGoal
} from "@shared/schema";
import { eq, desc, and, sql, gte } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-key",
});

export class AICoachService {
  // Track user engagement session
  async trackEngagementSession(userId: string, sessionData: {
    sessionId: string;
    pagesVisited: string[];
    actionsPerformed: string[];
    clicksCount: number;
    scrollDepth: number;
    deviceType: string;
    userAgent: string;
    duration?: number;
  }) {
    try {
      const [session] = await db.insert(userEngagementSessions).values({
        userId,
        sessionId: sessionData.sessionId,
        pagesVisited: sessionData.pagesVisited,
        actionsPerformed: sessionData.actionsPerformed,
        clicksCount: sessionData.clicksCount,
        scrollDepth: sessionData.scrollDepth.toString(),
        deviceType: sessionData.deviceType,
        userAgent: sessionData.userAgent,
        duration: sessionData.duration,
      }).returning();

      // Update daily metrics
      await this.updateDailyMetrics(userId);
      
      return session;
    } catch (error) {
      console.error('Error tracking engagement session:', error);
      throw error;
    }
  }

  // Update daily engagement metrics
  async updateDailyMetrics(userId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get all sessions for today
      const todaySessions = await db.select()
        .from(userEngagementSessions)
        .where(and(
          eq(userEngagementSessions.userId, userId),
          gte(userEngagementSessions.startTime, today)
        ));

      // Calculate metrics
      const totalSessions = todaySessions.length;
      const totalTimeSpent = todaySessions.reduce((sum, session) => sum + (session.duration || 0), 0);
      const averageSessionDuration = totalSessions > 0 ? totalTimeSpent / totalSessions : 0;
      
      // Get unique features used
      const allActions = todaySessions.flatMap(session => session.actionsPerformed || []);
      const featuresUsed = Array.from(new Set(allActions));
      
      const actionsCompleted = allActions.length;

      // Calculate engagement score (0-100)
      const engagementScore = this.calculateEngagementScore({
        totalSessions,
        averageSessionDuration,
        actionsCompleted,
        featuresUsed: featuresUsed.length,
      });

      // Calculate productivity score
      const productivityScore = this.calculateProductivityScore(userId, actionsCompleted);

      // Get weekly progress
      const weeklyProgress = await this.getWeeklyProgress(userId);
      const goalsAchieved = await this.getGoalsAchieved(userId);

      // Upsert metrics for today
      const productivityScoreValue = await productivityScore;
      await db.insert(userEngagementMetrics).values({
        userId,
        date: today,
        totalSessions,
        totalTimeSpent,
        averageSessionDuration: averageSessionDuration.toString(),
        featuresUsed,
        actionsCompleted,
        goalsAchieved,
        engagementScore: engagementScore.toString(),
        productivityScore: productivityScoreValue.toString(),
        weeklyProgress,
      }).onConflictDoUpdate({
        target: [userEngagementMetrics.userId],
        set: {
          totalSessions,
          totalTimeSpent,
          averageSessionDuration: averageSessionDuration.toString(),
          featuresUsed,
          actionsCompleted,
          goalsAchieved,
          engagementScore: engagementScore.toString(),
          productivityScore: productivityScoreValue.toString(),
          weeklyProgress,
        },
      });

    } catch (error) {
      console.error('Error updating daily metrics:', error);
    }
  }

  // Calculate engagement score based on activity
  private calculateEngagementScore(metrics: {
    totalSessions: number;
    averageSessionDuration: number;
    actionsCompleted: number;
    featuresUsed: number;
  }) {
    const sessionScore = Math.min(metrics.totalSessions * 10, 30); // Max 30 points
    const durationScore = Math.min(metrics.averageSessionDuration / 60 * 20, 30); // Max 30 points
    const actionScore = Math.min(metrics.actionsCompleted * 2, 25); // Max 25 points
    const featureScore = Math.min(metrics.featuresUsed * 3, 15); // Max 15 points

    return Math.round(sessionScore + durationScore + actionScore + featureScore);
  }

  // Calculate productivity score
  private async calculateProductivityScore(userId: string, actionsCompleted: number) {
    try {
      // Get goals completion rate
      const activeGoals = await db.select()
        .from(userGoals)
        .where(and(
          eq(userGoals.userId, userId),
          eq(userGoals.status, 'active')
        ));

      const completedGoals = activeGoals.filter(goal => 
        (goal.currentValue || 0) >= (goal.targetValue || 0)
      ).length;

      const goalCompletionRate = activeGoals.length > 0 ? 
        (completedGoals / activeGoals.length) * 50 : 0;

      const actionScore = Math.min(actionsCompleted * 1.5, 50);

      return Math.round(goalCompletionRate + actionScore);
    } catch (error) {
      console.error('Error calculating productivity score:', error);
      return 0;
    }
  }

  // Get weekly progress data
  private async getWeeklyProgress(userId: string) {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Get activities from this week
      const weeklyActivities = await db.select()
        .from(activities)
        .where(gte(activities.createdAt, weekAgo));

      // Get social posts from this week  
      const weeklySocialPosts = await db.select()
        .from(socialPosts)
        .where(gte(socialPosts.createdAt, weekAgo));

      // Get leads from this week
      const weeklyLeads = await db.select()
        .from(leads)
        .where(gte(leads.createdAt, weekAgo));

      return {
        contentCreated: weeklyActivities.filter(a => a.type === 'content').length,
        leadsGenerated: weeklyLeads.length,
        reviewsManaged: weeklyActivities.filter(a => a.type === 'review').length,
        socialPosts: weeklySocialPosts.length,
      };
    } catch (error) {
      console.error('Error getting weekly progress:', error);
      return {
        contentCreated: 0,
        leadsGenerated: 0,
        reviewsManaged: 0,
        socialPosts: 0,
      };
    }
  }

  // Get goals achieved count
  private async getGoalsAchieved(userId: string) {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const achievedGoals = await db.select()
        .from(userGoals)
        .where(and(
          eq(userGoals.userId, userId),
          eq(userGoals.status, 'completed'),
          gte(userGoals.completedAt, currentMonth)
        ));

      return achievedGoals.length;
    } catch (error) {
      console.error('Error getting goals achieved:', error);
      return 0;
    }
  }

  // Generate AI-powered insights and recommendations
  async generatePersonalizedInsights(userId: string) {
    try {
      // Get user's recent metrics and activity
      const recentMetrics = await db.select()
        .from(userEngagementMetrics)
        .where(eq(userEngagementMetrics.userId, userId))
        .orderBy(desc(userEngagementMetrics.date))
        .limit(7);

      const activeGoals = await db.select()
        .from(userGoals)
        .where(and(
          eq(userGoals.userId, userId),
          eq(userGoals.status, 'active')
        ));

      const recentSessions = await db.select()
        .from(userEngagementSessions)
        .where(eq(userEngagementSessions.userId, userId))
        .orderBy(desc(userEngagementSessions.startTime))
        .limit(10);

      // Analyze patterns and generate insights
      const insights = await this.analyzeUserPatterns({
        metrics: recentMetrics,
        goals: activeGoals,
        sessions: recentSessions,
        userId,
      });

      // Save insights to database
      for (const insight of insights) {
        await db.insert(aiCoachInsights).values({
          userId,
          ...insight,
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      throw error;
    }
  }

  // Analyze user patterns and generate insights using AI
  private async analyzeUserPatterns(data: {
    metrics: any[];
    goals: any[];
    sessions: any[];
    userId: string;
  }) {
    try {
      const { metrics, goals, sessions } = data;

      const context = {
        recentEngagement: metrics.slice(0, 3),
        activeGoals: goals,
        recentActivity: sessions.slice(0, 5).map(s => ({
          duration: s.duration,
          pages: s.pagesVisited,
          actions: s.actionsPerformed,
          timestamp: s.startTime,
        })),
        trends: {
          avgEngagement: metrics.reduce((sum, m) => sum + (m.engagementScore || 0), 0) / Math.max(metrics.length, 1),
          avgProductivity: metrics.reduce((sum, m) => sum + (m.productivityScore || 0), 0) / Math.max(metrics.length, 1),
          totalActions: metrics.reduce((sum, m) => sum + (m.actionsCompleted || 0), 0),
        }
      };

      const prompt = `As an AI coach for a field service marketing platform, analyze this user's engagement data and provide 3-4 personalized insights.

User Context:
- Recent engagement scores: ${context.recentEngagement.map(m => m.engagementScore).join(', ')}
- Recent productivity scores: ${context.recentEngagement.map(m => m.productivityScore).join(', ')}
- Active goals: ${goals.map(g => `${g.title} (${g.currentValue}/${g.targetValue} ${g.unit})`).join(', ')}
- Recent activity patterns: ${sessions.length} sessions with ${context.trends.totalActions} total actions
- Average engagement: ${context.trends.avgEngagement.toFixed(1)}%
- Average productivity: ${context.trends.avgProductivity.toFixed(1)}%

Generate insights in this exact JSON format:
{
  "insights": [
    {
      "insightType": "recommendation|achievement|warning|tip",
      "title": "Brief title",
      "message": "Detailed message with specific observations",
      "actionable": "Specific action they can take",
      "priority": "low|medium|high|urgent",
      "category": "engagement|productivity|features|goals",
      "relatedFeature": "feature name if applicable"
    }
  ]
}

Focus on:
1. Goal progress and recommendations
2. Engagement patterns and opportunities
3. Feature usage optimization
4. Productivity improvements

Make insights specific, actionable, and encouraging.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{"insights": []}');
      return result.insights || [];

    } catch (error) {
      console.error('Error analyzing user patterns with AI:', error);
      // Fallback to basic insights
      return this.generateBasicInsights(data);
    }
  }

  // Fallback method for basic insights without AI
  private generateBasicInsights(data: { metrics: any[]; goals: any[]; sessions: any[] }) {
    const insights = [];
    const { metrics, goals, sessions } = data;

    // Goal progress insight
    if (goals.length > 0) {
      const behindGoals = goals.filter(g => g.currentValue < g.targetValue * 0.5);
      if (behindGoals.length > 0) {
        insights.push({
          insightType: 'recommendation',
          title: 'Goal Progress Opportunity',
          message: `You have ${behindGoals.length} goals that could use some attention to stay on track.`,
          actionable: 'Focus on completing small daily actions toward these goals.',
          priority: 'medium',
          category: 'goals',
        });
      }
    }

    // Engagement insight
    const avgEngagement = metrics.reduce((sum, m) => sum + (m.engagementScore || 0), 0) / Math.max(metrics.length, 1);
    if (avgEngagement < 50) {
      insights.push({
        insightType: 'tip',
        title: 'Boost Your Engagement',
        message: 'Your engagement score suggests there\'s room for more active platform usage.',
        actionable: 'Try spending 10 more minutes daily exploring different features.',
        priority: 'medium',
        category: 'engagement',
      });
    }

    // Achievement insight
    if (sessions.length > 5) {
      insights.push({
        insightType: 'achievement',
        title: 'Great Activity Level!',
        message: 'You\'ve been consistently using the platform - keep up the momentum!',
        actionable: 'Consider setting a new weekly goal to maintain this pace.',
        priority: 'low',
        category: 'engagement',
      });
    }

    return insights;
  }

  // Get user insights
  async getUserInsights(userId: string, limit = 10) {
    try {
      return await db.select()
        .from(aiCoachInsights)
        .where(eq(aiCoachInsights.userId, userId))
        .orderBy(desc(aiCoachInsights.createdAt))
        .limit(limit);
    } catch (error) {
      console.error('Error getting user insights:', error);
      return [];
    }
  }

  // Mark insight as read
  async markInsightAsRead(userId: string, insightId: number) {
    try {
      await db.update(aiCoachInsights)
        .set({ isRead: true })
        .where(and(
          eq(aiCoachInsights.id, insightId),
          eq(aiCoachInsights.userId, userId)
        ));
    } catch (error) {
      console.error('Error marking insight as read:', error);
      throw error;
    }
  }

  // Get user goals
  async getUserGoals(userId: string) {
    try {
      return await db.select()
        .from(userGoals)
        .where(eq(userGoals.userId, userId))
        .orderBy(desc(userGoals.createdAt));
    } catch (error) {
      console.error('Error getting user goals:', error);
      return [];
    }
  }

  // Create new goal
  async createGoal(userId: string, goalData: {
    title: string;
    description?: string;
    goalType: string;
    targetValue: number;
    unit: string;
    category: string;
    priority?: string;
    dueDate?: string;
  }) {
    try {
      const [goal] = await db.insert(userGoals).values({
        userId,
        ...goalData,
        dueDate: goalData.dueDate ? new Date(goalData.dueDate) : null,
      }).returning();

      return goal;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  // Update goal progress
  async updateGoalProgress(userId: string, goalId: number, newValue: number) {
    try {
      const [goal] = await db.select()
        .from(userGoals)
        .where(and(
          eq(userGoals.id, goalId),
          eq(userGoals.userId, userId)
        ));

      if (!goal) {
        throw new Error('Goal not found');
      }

      const updateData: any = { currentValue: newValue };
      
      // Check if goal is completed
      if (newValue >= (goal.targetValue || 0) && goal.status !== 'completed') {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
      }

      await db.update(userGoals)
        .set(updateData)
        .where(and(
          eq(userGoals.id, goalId),
          eq(userGoals.userId, userId)
        ));

      return { ...goal, ...updateData };
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }

  // Get user engagement metrics
  async getUserMetrics(userId: string, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const metrics = await db.select()
        .from(userEngagementMetrics)
        .where(and(
          eq(userEngagementMetrics.userId, userId),
          gte(userEngagementMetrics.date, startDate)
        ))
        .orderBy(desc(userEngagementMetrics.date))
        .limit(1);

      return metrics[0] || null;
    } catch (error) {
      console.error('Error getting user metrics:', error);
      return null;
    }
  }
}

export const aiCoachService = new AICoachService();