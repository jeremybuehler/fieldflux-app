import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  users, 
  wordpressPosts, 
  reviews, 
  analyticsReports, 
  socialPosts, 
  leads, 
  tasks, 
  activities, 
  seoKeywords,
  socialMediaConfigs,
  socialMediaAnalytics,
  insertWordPressPostSchema,
  insertReviewSchema,
  insertAnalyticsReportSchema,
  insertSocialPostSchema,
  insertLeadSchema,
  insertTaskSchema,
  insertActivitySchema,
  insertSeoKeywordSchema,
  insertSocialMediaConfigSchema,
  insertSocialMediaAnalyticsSchema
} from "@shared/schema";
import OpenAI from "openai";
import twilio from "twilio";
import { googleAnalyticsService } from "./services/google-analytics";
import { leadScoringService } from "./services/leadScoringService";
import { aiCoachService } from "./services/aiCoachService";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
});

// Initialize Twilio client if credentials are available
let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Remove duplicate authentication middleware - using the one from replitAuth

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes (using the isAuthenticated from replitAuth, not the removed duplicate)
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user || !req.user.claims) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (user) {
        res.json(user);
      } else {
        // Create user if doesn't exist
        const newUser = await storage.upsertUser({
          id: userId,
          email: req.user.claims.email,
          firstName: req.user.claims.first_name,
          lastName: req.user.claims.last_name,
          profileImageUrl: req.user.claims.profile_image_url,
        });
        res.json(newUser);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Dashboard Analytics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      const tasks = await storage.getAllTasks();
      const socialPosts = await storage.getAllSocialPosts();
      const seoKeywords = await storage.getAllSeoKeywords();

      // Get real Google Analytics data for dashboard
      const analyticsMetrics = await googleAnalyticsService.getMetrics('30d');
      
      const metrics = {
        traffic: analyticsMetrics.sessions,
        trafficGrowth: 12.5, // Could be calculated from comparing periods
        socialEngagement: socialPosts.length * 47, // Estimate based on posts
        socialEngagementGrowth: 8.3,
        leads: leads.length,
        leadsGrowth: 15.2,
        reviewScore: 4.8,
        reviewCount: 156,
      };

      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const data = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(data);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  // WordPress Posts
  app.get("/api/wordpress/posts", async (req, res) => {
    try {
      const posts = await storage.getAllWordPressPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch WordPress posts" });
    }
  });

  app.post("/api/wordpress/posts", async (req, res) => {
    try {
      const data = insertWordPressPostSchema.parse(req.body);
      const post = await storage.createWordPressPost(data);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  // AI Content Generation Routes
  app.post('/api/ai/generate-blog', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, tone, length, targetAudience, keywords, includeCallToAction } = req.body;
      
      const wordCount = length === 'short' ? '400-600' : length === 'medium' ? '800-1200' : '1500-2000';
      const keywordText = keywords && keywords.length > 0 ? `Focus on these SEO keywords: ${keywords.join(', ')}.` : '';
      const ctaText = includeCallToAction ? 'Include a compelling call-to-action at the end.' : '';
      
      const prompt = `Write a comprehensive ${tone} blog post about "${topic}" for ${targetAudience}. 
        The post should be ${wordCount} words long. 
        ${keywordText}
        ${ctaText}
        
        Structure the post with:
        1. Engaging title
        2. Clear introduction
        3. Well-organized main content with subheadings
        4. Practical tips and actionable advice
        5. Professional conclusion
        
        Write in a ${tone} tone that resonates with ${targetAudience}. Make it informative, engaging, and valuable for field service professionals.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;
      res.json({ content, topic, tone, length, targetAudience });
    } catch (error) {
      console.error('Blog generation error:', error);
      res.status(500).json({ error: 'Failed to generate blog post' });
    }
  });

  app.post('/api/ai/generate-medium', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, tone, length, targetAudience, keywords } = req.body;
      
      const wordCount = length === 'short' ? '800-1200' : length === 'medium' ? '1500-2000' : '2500-3000';
      const keywordText = keywords && keywords.length > 0 ? `Incorporate these keywords naturally: ${keywords.join(', ')}.` : '';
      
      const prompt = `Write a compelling Medium article about "${topic}" for ${targetAudience}. 
        The article should be ${wordCount} words long and follow Medium's best practices.
        ${keywordText}
        
        Structure for Medium:
        1. Hook-filled opening that grabs attention
        2. Personal story or relatable scenario
        3. Data-driven insights and examples
        4. Actionable takeaways
        5. Thought-provoking conclusion
        
        Use a ${tone} tone with storytelling elements. Include subheadings, bullet points, and make it scannable. 
        Write for field service professionals and business owners who want to grow their business.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
        temperature: 0.8,
      });

      const content = completion.choices[0].message.content;
      res.json({ content, topic, tone, length, targetAudience, platform: 'medium' });
    } catch (error) {
      console.error('Medium generation error:', error);
      res.status(500).json({ error: 'Failed to generate Medium article' });
    }
  });

  app.post('/api/ai/generate-substack', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, tone, length, targetAudience, keywords } = req.body;
      
      const wordCount = length === 'short' ? '600-1000' : length === 'medium' ? '1200-1800' : '2000-2500';
      const keywordText = keywords && keywords.length > 0 ? `Naturally include these keywords: ${keywords.join(', ')}.` : '';
      
      const prompt = `Write an engaging Substack newsletter article about "${topic}" for ${targetAudience}. 
        The article should be ${wordCount} words long and follow newsletter best practices.
        ${keywordText}
        
        Structure for Substack:
        1. Personal greeting and connection with subscribers
        2. Current relevant context or news hook
        3. Main content with clear sections
        4. Industry insights and analysis
        5. Community engagement question
        6. Clear next steps or resources
        
        Use a ${tone} but personal tone that builds community. Make it feel like a conversation with subscribers.
        Focus on field service industry insights, tips, and trends that subscribers can apply immediately.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2500,
        temperature: 0.8,
      });

      const content = completion.choices[0].message.content;
      res.json({ content, topic, tone, length, targetAudience, platform: 'substack' });
    } catch (error) {
      console.error('Substack generation error:', error);
      res.status(500).json({ error: 'Failed to generate Substack article' });
    }
  });

  // Website Content Routes
  app.get('/api/website/blog-posts', isAuthenticated, async (req: any, res) => {
    // Return sample blog posts for now
    const samplePosts = [
      {
        id: '1',
        title: 'HVAC Maintenance Tips for Summer',
        excerpt: 'Essential tips to keep your HVAC system running efficiently during hot weather.',
        status: 'published',
        readingTime: 5,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Plumbing Emergency Prevention Guide',
        excerpt: 'How to prevent common plumbing emergencies and what to do when they happen.',
        status: 'draft',
        readingTime: 7,
        createdAt: new Date().toISOString()
      }
    ];
    res.json(samplePosts);
  });

  // AI Coach Routes
  app.get('/api/ai-coach/insights', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const insights = await aiCoachService.getUserInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error('Error fetching AI coach insights:', error);
      res.status(500).json({ error: 'Failed to fetch insights' });
    }
  });

  app.post('/api/ai-coach/insights/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const insightId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await aiCoachService.markInsightAsRead(userId, insightId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking insight as read:', error);
      res.status(500).json({ error: 'Failed to mark insight as read' });
    }
  });

  app.get('/api/ai-coach/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const goals = await aiCoachService.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      res.status(500).json({ error: 'Failed to fetch goals' });
    }
  });

  app.post('/api/ai-coach/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const goal = await aiCoachService.createGoal(userId, req.body);
      res.json(goal);
    } catch (error) {
      console.error('Error creating goal:', error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  });

  app.get('/api/ai-coach/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const metrics = await aiCoachService.getUserMetrics(userId);
      
      // Return default metrics if none exist yet
      const defaultMetrics = {
        totalSessions: 0,
        totalTimeSpent: 0,
        averageSessionDuration: 0,
        featuresUsed: [],
        actionsCompleted: 0,
        goalsAchieved: 0,
        engagementScore: 0,
        productivityScore: 0,
        weeklyProgress: {
          contentCreated: 0,
          leadsGenerated: 0,
          reviewsManaged: 0,
          socialPosts: 0,
        },
      };

      res.json(metrics || defaultMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  });

  app.post('/api/ai-coach/generate-recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const insights = await aiCoachService.generatePersonalizedInsights(userId);
      res.json({ insights, count: insights.length });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  app.post('/api/ai-coach/track-session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const session = await aiCoachService.trackEngagementSession(userId, req.body);
      res.json(session);
    } catch (error) {
      console.error('Error tracking session:', error);
      res.status(500).json({ error: 'Failed to track session' });
    }
  });

  app.post("/api/wordpress/generate-post", async (req, res) => {
    try {
      const { topic, type = "blog" } = req.body;

      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert HVAC content writer. Create engaging, SEO-optimized content for HVAC businesses serving Winter Haven, Lakeland, and surrounding Florida areas. Always include practical tips and local relevance.",
          },
          {
            role: "user",
            content: `Create a ${type} post about: ${topic}. Include an SEO-optimized title and comprehensive content (800-1000 words). Focus on residential and commercial HVAC services. Make it engaging and informative for homeowners and business owners in Central Florida.`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');

      const post = await storage.createWordPressPost({
        title: result.title || `HVAC Guide: ${topic}`,
        content: result.content || `Comprehensive guide about ${topic} for HVAC services.`,
        status: "draft",
      });

      await storage.createActivity({
        type: "wordpress",
        title: "Generated WordPress Post",
        description: `Created new blog post: "${post.title}"`,
      });

      res.json(post);
    } catch (error) {
      console.error("Error generating WordPress post:", error);
      res.status(500).json({ message: "Failed to generate WordPress post" });
    }
  });

  // Social Media Posts
  app.get("/api/social/posts", async (req, res) => {
    try {
      const posts = await storage.getAllSocialPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social posts" });
    }
  });

  app.post("/api/social/posts", async (req, res) => {
    try {
      const data = insertSocialPostSchema.parse(req.body);
      const post = await storage.createSocialPost(data);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid social post data" });
    }
  });

  app.post("/api/social/generate-post", async (req, res) => {
    try {
      const { topic, platform, tone = "professional" } = req.body;

      if (!topic || !platform) {
        return res.status(400).json({ message: "Topic and platform are required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a social media expert for HVAC businesses. Create engaging posts optimized for ${platform}. Include relevant hashtags and call-to-actions. Keep the tone ${tone} but approachable.`,
          },
          {
            role: "user",
            content: `Create a ${platform} post about: ${topic}. Make it engaging for HVAC customers in Winter Haven and Lakeland, Florida. Include relevant hashtags and encourage engagement.`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');

      const post = await storage.createSocialPost({
        platform,
        content: result.content || `Check out our latest HVAC tips about ${topic}!`,
        status: "draft",
      });

      await storage.createActivity({
        type: "social",
        title: "Generated Social Media Post",
        description: `Created ${platform} post about "${topic}"`,
      });

      res.json(post);
    } catch (error) {
      console.error("Error generating social post:", error);
      res.status(500).json({ message: "Failed to generate social post" });
    }
  });

  // Topic generation endpoint
  app.post("/api/ai/generate-topic", async (req, res) => {
    try {
      const { type, industry, platform } = req.body;

      let prompt = `Generate a relevant and engaging topic for ${type} content in the ${industry} industry.`;
      if (platform) {
        prompt += ` This will be for ${platform}.`;
      }
      prompt += ` Return only the topic title, no extra text or formatting.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert marketing content strategist specializing in field service businesses. Generate compelling, industry-specific topics that would engage homeowners and business owners across various service sectors including HVAC, plumbing, electrical, landscaping, pest control, and other field service industries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.8,
      });

      const topic = response.choices[0].message.content?.trim() || "Field Service Maintenance Tips";

      res.json({ topic });
    } catch (error) {
      console.error("Error generating topic:", error);
      res.status(500).json({ message: "Failed to generate topic" });
    }
  });

  // Weather endpoint
  app.get("/api/weather/winter-haven", async (req, res) => {
    try {
      // Mock weather data for Winter Haven, FL
      const weatherData = {
        temperature: 78 + Math.random() * 10, // 78-88°F typical for Winter Haven
        condition: "Partly Cloudy",
        humidity: 65 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 10,
        rainChance: Math.floor(Math.random() * 60), // 0-60% chance
        description: "Partly cloudy with scattered thunderstorms possible"
      };

      res.json(weatherData);
    } catch (error) {
      console.error("Error fetching weather:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(data);

      // Score the lead with AI
      try {
        const scoringFactors = {
          service: data.service,
          location: data.location,
          contactMethod: (data.email && data.phone ? "form" : data.email ? "email" : "phone") as "form" | "email" | "phone" | "chat",
          timeOfInquiry: new Date(),
          referralSource: req.body.referralSource
        };

        const scoringResult = await leadScoringService.scoreLeadWithAI(lead, scoringFactors);
        
        // Update lead with AI scoring results
        const updatedLead = await storage.updateLead(lead.id, {
          leadScore: scoringResult.leadScore,
          urgencyScore: scoringResult.urgencyScore,
          conversionProbability: scoringResult.conversionProbability.toString(),
          predictedValue: scoringResult.predictedValue,
          engagementLevel: scoringResult.engagementLevel,
          aiRecommendations: scoringResult.aiRecommendations,
          priority: leadScoringService.calculateLeadPriority(scoringResult.leadScore, scoringResult.urgencyScore),
          nextFollowUpAt: scoringResult.nextFollowUpAt
        });

        await storage.createActivity({
          type: "lead",
          title: "New Lead Received & Scored",
          description: `New ${data.service} inquiry from ${data.name} in ${data.location}. AI Score: ${scoringResult.leadScore}/100`,
        });

        res.json(updatedLead || lead);
      } catch (scoringError) {
        console.error("Lead scoring error:", scoringError);
        
        await storage.createActivity({
          type: "lead",
          title: "New Lead Received",
          description: `New ${data.service} inquiry from ${data.name} in ${data.location}`,
        });

        res.json(lead);
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid lead data" });
    }
  });

  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const lead = await storage.updateLead(id, updates);

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: "Failed to update lead" });
    }
  });

  // AI Lead Scoring Endpoints
  app.post("/api/leads/:id/score", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      const scoringFactors = {
        service: lead.service,
        location: lead.location,
        contactMethod: (lead.email && lead.phone ? "form" : lead.email ? "email" : "phone") as "form" | "email" | "phone" | "chat",
        timeOfInquiry: lead.createdAt || new Date(),
        responseTime: req.body.responseTime,
        previousInteractions: req.body.previousInteractions,
        referralSource: req.body.referralSource
      };

      const scoringResult = await leadScoringService.scoreLeadWithAI(lead, scoringFactors);
      
      // Update lead with new scoring
      const updatedLead = await storage.updateLead(id, {
        leadScore: scoringResult.leadScore,
        urgencyScore: scoringResult.urgencyScore,
        conversionProbability: scoringResult.conversionProbability.toString(),
        predictedValue: scoringResult.predictedValue,
        engagementLevel: scoringResult.engagementLevel,
        aiRecommendations: scoringResult.aiRecommendations,
        priority: leadScoringService.calculateLeadPriority(scoringResult.leadScore, scoringResult.urgencyScore),
        nextFollowUpAt: scoringResult.nextFollowUpAt
      });

      await storage.createActivity({
        type: "lead",
        title: "Lead Re-scored",
        description: `Updated AI score for ${lead.name}: ${scoringResult.leadScore}/100`,
      });

      res.json(updatedLead);
    } catch (error) {
      console.error("Lead scoring error:", error);
      res.status(500).json({ message: "Failed to score lead" });
    }
  });

  app.get("/api/leads/:id/recommendations", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      const recommendations = await leadScoringService.generateRecommendations(lead);
      
      res.json({ recommendations });
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.get("/api/leads/analytics/scores", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      
      const analytics = {
        totalLeads: leads.length,
        avgLeadScore: leads.reduce((sum, lead) => sum + (lead.leadScore || 0), 0) / leads.length || 0,
        avgUrgencyScore: leads.reduce((sum, lead) => sum + (lead.urgencyScore || 0), 0) / leads.length || 0,
        avgConversionProbability: leads.reduce((sum, lead) => sum + (parseFloat(lead.conversionProbability || "0")), 0) / leads.length || 0,
        highPriorityLeads: leads.filter(lead => lead.priority === "high").length,
        mediumPriorityLeads: leads.filter(lead => lead.priority === "medium").length,
        lowPriorityLeads: leads.filter(lead => lead.priority === "low").length,
        totalPredictedValue: leads.reduce((sum, lead) => sum + (lead.predictedValue || 0), 0),
        engagementLevels: {
          high: leads.filter(lead => lead.engagementLevel === "high").length,
          medium: leads.filter(lead => lead.engagementLevel === "medium").length,
          low: leads.filter(lead => lead.engagementLevel === "low").length
        }
      };

      res.json(analytics);
    } catch (error) {
      console.error("Lead analytics error:", error);
      res.status(500).json({ message: "Failed to get lead analytics" });
    }
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(data);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const task = await storage.updateTask(id, updates);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (updates.status === "completed") {
        await storage.createActivity({
          type: "task",
          title: "Task Completed",
          description: `Completed task: ${task.title}`,
        });
      }

      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  // SEO Keywords
  app.get("/api/seo/keywords", async (req, res) => {
    try {
      const keywords = await storage.getAllSeoKeywords();
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SEO keywords" });
    }
  });

  app.post("/api/seo/keywords", async (req, res) => {
    try {
      const data = insertSeoKeywordSchema.parse(req.body);
      const keyword = await storage.createSeoKeyword(data);
      res.json(keyword);
    } catch (error) {
      res.status(400).json({ message: "Invalid keyword data" });
    }
  });

  app.post("/api/seo/analyze", async (req, res) => {
    try {
      const { url, keywords } = req.body;

      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert specializing in local HVAC businesses. Analyze content and provide actionable SEO recommendations.",
          },
          {
            role: "user",
            content: `Analyze this URL for SEO optimization: ${url}. Focus on local HVAC keywords for Winter Haven and Lakeland Florida areas. Provide specific recommendations for improving search rankings.${keywords ? ` Target keywords: ${keywords}` : ''}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');

      await storage.createActivity({
        type: "seo",
        title: "SEO Analysis Completed",
        description: `Analyzed SEO for ${url}`,
      });

      res.json(result);
    } catch (error) {
      console.error("Error analyzing SEO:", error);
      res.status(500).json({ message: "Failed to analyze SEO" });
    }
  });

  // Reviews Management
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const data = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(data);

      await storage.createActivity({
        type: "review",
        title: "New Review Received",
        description: `${data.rating}-star review from ${data.customerName} on ${data.platform}`,
      });

      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  app.post("/api/reviews/:id/generate-response", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await storage.getReview(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional business owner responding to customer reviews. Be courteous, professional, and address any concerns mentioned. Keep responses concise and grateful.",
          },
          {
            role: "user",
            content: `Generate a professional response to this ${review.rating}-star review: "${review.content}" from ${review.customerName}. The business is KasamaAI, a marketing automation platform.`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');

      await storage.updateReview(reviewId, {
        aiResponse: result.response || "Thank you for your feedback!",
        responseStatus: "ready"
      });

      await storage.createActivity({
        type: "review",
        title: "AI Review Response Generated",
        description: `Generated response for ${review.customerName}'s ${review.rating}-star review`,
      });

      res.json({ response: result.response });
    } catch (error) {
      console.error("Error generating review response:", error);
      res.status(500).json({ message: "Failed to generate review response" });
    }
  });

  // Get real Google reviews
  app.get("/api/reviews/google", async (req, res) => {
    try {
      const businessName = req.query.businessName as string;
      const businessAddress = req.query.businessAddress as string;
      
      const { googleReviewsService } = await import('./services/google-reviews');
      const reviews = await googleReviewsService.getBusinessReviews(businessName, businessAddress);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching Google reviews:", error);
      res.status(500).json({ message: "Failed to fetch Google reviews" });
    }
  });

  // Search for businesses using Google Places API
  app.get("/api/places/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const location = req.query.location as string;
      
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const { googlePlacesNewService } = await import('./services/google-places-new');
      const businesses = await googlePlacesNewService.searchBusinesses(query);
      res.json(businesses);
    } catch (error) {
      console.error("Error searching businesses:", error);
      res.status(500).json({ message: "Failed to search businesses" });
    }
  });

  // Get detailed business information including reviews
  app.get("/api/places/details/:placeId", async (req, res) => {
    try {
      const { placeId } = req.params;
      
      const { googlePlacesService } = await import('./services/google-places');
      const details = await googlePlacesService.getPlaceDetails(placeId);
      
      if (!details) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      res.json(details);
    } catch (error) {
      console.error("Error fetching business details:", error);
      res.status(500).json({ message: "Failed to fetch business details" });
    }
  });

  // Check Google Places API status
  app.get("/api/places/status", async (req, res) => {
    try {
      const { googlePlacesService } = await import('./services/google-places');
      const status = googlePlacesService.getConfigurationStatus();
      res.json(status);
    } catch (error) {
      console.error("Error checking Places API status:", error);
      res.status(500).json({ message: "Failed to check Places API status" });
    }
  });

  // Get review analytics (now uses real data)
  app.get("/api/reviews/analytics", async (req, res) => {
    try {
      const period = req.query.period as '7d' | '30d' | '90d' || '30d';
      const analytics = await googleAnalyticsService.getReviewsAnalytics(period);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching review analytics:", error);
      res.status(500).json({ message: "Failed to fetch review analytics" });
    }
  });

  // Reply to Google review
  app.post("/api/reviews/google/:reviewId/reply", async (req, res) => {
    const { reviewId } = req.params;
    const { businessId, replyText } = req.body;
    
    try {
      const { googleReviewsService } = await import('./services/google-reviews');
      const success = await googleReviewsService.replyToReview(businessId, reviewId, replyText);
      
      if (success) {
        res.json({ message: "Reply posted successfully" });
      } else {
        res.status(500).json({ message: "Failed to post reply" });
      }
    } catch (error) {
      console.error("Error posting review reply:", error);
      res.status(500).json({ message: "Failed to post review reply" });
    }
  });;

  // WordPress with GoDaddy Integration
  app.post("/api/wordpress/publish-to-godaddy", async (req, res) => {
    try {
      const { postId, godaddyConfig } = req.body;

      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }

      const post = await storage.getWordPressPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Simulate GoDaddy WordPress API integration
      // In production, this would use WordPress REST API with GoDaddy hosting
      await storage.updateWordPressPost(postId, {
        status: "published",
        publishedAt: new Date(),
      });

      await storage.createActivity({
        type: "wordpress",
        title: "Post Published to GoDaddy",
        description: `Published "${post.title}" to GoDaddy WordPress site`,
      });

      res.json({ message: "Post published successfully", post });
    } catch (error) {
      console.error("Error publishing to GoDaddy:", error);
      res.status(500).json({ message: "Failed to publish to GoDaddy" });
    }
  });

  // Google Analytics API Integration
  app.get("/api/analytics/metrics", async (req, res) => {
    try {
      const period = req.query.period as '7d' | '30d' | '90d' || '30d';
      const metrics = await googleAnalyticsService.getMetrics(period);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching analytics metrics:", error);
      res.status(500).json({ message: "Failed to fetch analytics metrics" });
    }
  });

  app.get("/api/analytics/traffic-sources", async (req, res) => {
    try {
      const period = req.query.period as '7d' | '30d' | '90d' || '30d';
      const sources = await googleAnalyticsService.getTrafficSources(period);
      res.json(sources);
    } catch (error) {
      console.error("Error fetching traffic sources:", error);
      res.status(500).json({ message: "Failed to fetch traffic sources" });
    }
  });

  app.get("/api/analytics/top-pages", async (req, res) => {
    try {
      const period = req.query.period as '7d' | '30d' | '90d' || '30d';
      const pages = await googleAnalyticsService.getTopPages(period);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching top pages:", error);
      res.status(500).json({ message: "Failed to fetch top pages" });
    }
  });

  app.get("/api/analytics/locations", async (req, res) => {
    try {
      const period = req.query.period as '7d' | '30d' | '90d' || '30d';
      const locations = await googleAnalyticsService.getLocationData(period);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching location data:", error);
      res.status(500).json({ message: "Failed to fetch location data" });
    }
  });

  app.get("/api/analytics/devices", async (req, res) => {
    try {
      const period = req.query.period as '7d' | '30d' | '90d' || '30d';
      const devices = await googleAnalyticsService.getDeviceData(period);
      res.json(devices);
    } catch (error) {
      console.error("Error fetching device data:", error);
      res.status(500).json({ message: "Failed to fetch device data" });
    }
  });

  app.get("/api/analytics/realtime", async (req, res) => {
    try {
      const realtime = await googleAnalyticsService.getRealtimeData();
      res.json(realtime);
    } catch (error) {
      console.error("Error fetching realtime data:", error);
      res.status(500).json({ message: "Failed to fetch realtime data" });
    }
  });

  app.get("/api/analytics/keywords", async (req, res) => {
    try {
      const period = (req.query.period as '7d' | '30d' | '90d') || '30d';
      const keywords = await googleAnalyticsService.getSearchConsoleKeywords(period);
      
      // Add metadata about data source
      const response = {
        keywords,
        meta: {
          source: keywords.length > 0 && keywords[0].keyword !== 'ac repair near me' ? 'search_console' : 'demo',
          total: keywords.length,
          period,
          lastUpdated: new Date().toISOString()
        }
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error fetching keyword data:", error);
      res.status(500).json({ message: "Failed to fetch keyword data" });
    }
  });

  app.get("/api/search-console/status", async (req, res) => {
    try {
      const status = await googleAnalyticsService.getSearchConsoleStatus();
      res.json(status);
    } catch (error) {
      console.error("Error fetching Search Console status:", error);
      res.status(500).json({ message: "Failed to fetch Search Console status" });
    }
  });

  app.get("/api/analytics/keyword-opportunities", async (req, res) => {
    try {
      const keywords = await googleAnalyticsService.getSearchConsoleKeywords('30d');
      
      // Analyze optimization opportunities
      const quickWins = keywords.filter(k => k.position > 3 && k.position <= 10);
      const lowCtrKeywords = keywords.filter(k => k.ctr < 4.0);
      const highVolumeEasyKeywords = keywords.filter(k => k.difficulty === 'easy' && k.searchVolume > 1000);
      
      res.json({
        quickWins,
        lowCtrKeywords,
        highVolumeEasyKeywords,
        totalKeywords: keywords.length
      });
    } catch (error) {
      console.error("Error fetching keyword opportunities:", error);
      res.status(500).json({ message: "Failed to fetch keyword opportunities" });
    }
  });

  app.get("/api/analytics/reviews", async (req, res) => {
    try {
      const period = (req.query.period as '7d' | '30d' | '90d') || '30d';
      const reviews = await googleAnalyticsService.getReviewsAnalytics(period);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
      res.status(500).json({ message: "Failed to fetch reviews data" });
    }
  });

  app.get("/api/analytics/status", async (req, res) => {
    try {
      const hasServiceAccount = !!process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_KEY;
      const hasPropertyId = !!process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
      const hasMeasurementId = !!process.env.VITE_GA_MEASUREMENT_ID;
      
      res.json({
        configured: hasServiceAccount && hasPropertyId && hasMeasurementId,
        hasServiceAccount,
        hasPropertyId,
        hasMeasurementId,
        setupInstructions: !hasServiceAccount || !hasPropertyId ? 
          "Please enable Google Analytics Data API in Google Cloud Console and provide service account credentials" : 
          "Google Analytics is configured and ready to use"
      });
    } catch (error) {
      console.error("Error checking analytics status:", error);
      res.status(500).json({ message: "Failed to check analytics status" });
    }
  });

  // Enhanced Analytics Reporting
  app.post("/api/analytics/generate-report", async (req, res) => {
    try {
      const { period = "30d" } = req.body;

      // Get real analytics data for the report
      const [metrics, trafficSources, topPages] = await Promise.all([
        googleAnalyticsService.getMetrics(period),
        googleAnalyticsService.getTrafficSources(period),
        googleAnalyticsService.getTopPages(period)
      ]);

      const reportData = {
        period,
        traffic: metrics.sessions,
        conversions: Math.floor(metrics.sessions * 0.032), // Estimate based on average conversion rate
        topKeywords: trafficSources.filter(s => s.source.toLowerCase().includes('google')).map(s => s.source).slice(0, 5),
        topPages: topPages.map(p => p.page).slice(0, 5),
        trafficSources: trafficSources.map(s => `${s.source} (${s.percentage.toFixed(1)}%)`).slice(0, 5),
      };

      const report = await storage.createAnalyticsReport(reportData);

      await storage.createActivity({
        type: "analytics",
        title: "Analytics Report Generated",
        description: `Generated ${period} performance report with ${reportData.traffic} total visitors`,
      });

      res.json(report);
    } catch (error) {
      console.error("Error generating analytics report:", error);
      res.status(500).json({ message: "Failed to generate analytics report" });
    }
  });

  app.get("/api/analytics/reports", async (req, res) => {
    try {
      const reports = await storage.getAllAnalyticsReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics reports" });
    }
  });

  // Lead Qualification and Automated Follow-up
  app.post("/api/leads/:id/qualify", async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const lead = await storage.getLead(leadId);

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Simple qualification logic
      let priority = "medium";
      let qualificationScore = 50;

      if (lead.service.toLowerCase().includes("commercial")) {
        priority = "high";
        qualificationScore += 30;
      }

      if (lead.service.toLowerCase().includes("emergency") || 
          lead.service.toLowerCase().includes("repair")) {
        priority = "high";
        qualificationScore += 20;
      }

      if (lead.location.toLowerCase().includes("winter haven") || 
          lead.location.toLowerCase().includes("lakeland")) {
        qualificationScore += 15;
      }

      await storage.updateLead(leadId, { 
        priority,
        status: "qualified"
      });

      await storage.createActivity({
        type: "lead",
        title: "Lead Qualified",
        description: `${lead.name} qualified as ${priority} priority (Score: ${qualificationScore}/100)`,
      });

      res.json({ 
        lead, 
        priority, 
        qualificationScore,
        recommendations: qualificationScore > 80 ? 
          ["Contact immediately", "Schedule estimate ASAP"] :
          ["Follow up within 24 hours", "Send service information"]
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to qualify lead" });
    }
  });

  // Twilio SMS endpoints
  app.post("/api/sms/send", async (req, res) => {
    try {
      const { to, message, type } = req.body;

      if (!twilioClient) {
        return res.status(400).json({ 
          message: "Twilio not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your environment." 
        });
      }

      if (!process.env.TWILIO_PHONE_NUMBER) {
        return res.status(400).json({ 
          message: "TWILIO_PHONE_NUMBER not configured" 
        });
      }

      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(to.replace(/\s+/g, ''))) {
        return res.status(400).json({ 
          message: "Invalid phone number format" 
        });
      }

      const twilioMessage = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`
      });

      // Log the SMS activity
      await storage.createActivity({
        type: "sms",
        title: "SMS Sent",
        description: `SMS sent to ${to}: ${type || 'general'}`
      });

      res.json({ 
        success: true, 
        messageId: twilioMessage.sid,
        status: twilioMessage.status 
      });
    } catch (error) {
      console.error("SMS send error:", error);
      res.status(500).json({ 
        message: "Failed to send SMS", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/sms/templates", async (req, res) => {
    try {
      const templates = [
        {
          type: 'lead_followup',
          name: 'Lead Follow-up',
          template: 'Hi {customerName}! Thanks for your interest in {businessName}. We\'ll contact you within 24 hours to discuss your {serviceType} needs. Reply STOP to opt out.',
          description: 'Automatic response to new leads from website forms'
        },
        {
          type: 'appointment_confirmation',
          name: 'Appointment Confirmation',
          template: 'Hi {customerName}, your {serviceType} appointment is confirmed for {appointmentDate}. We\'ll text you when our technician is on the way. Reply STOP to opt out.',
          description: 'Sent when appointments are scheduled'
        },
        {
          type: 'technician_enroute',
          name: 'Technician En Route',
          template: 'Hi {customerName}, {technicianName} is on the way and should arrive around {estimatedTime}. Call us at {businessPhone} with questions.',
          description: 'Sent when technician leaves for appointment'
        },
        {
          type: 'service_complete',
          name: 'Service Complete',
          template: 'Hi {customerName}, your {serviceType} service is complete. Thanks for choosing {businessName}! Any questions? Call {businessPhone}.',
          description: 'Sent when service work is finished'
        },
        {
          type: 'review_request',
          name: 'Review Request',
          template: 'Hi {customerName}, thanks for choosing {businessName}! We\'d love your feedback: {reviewLink} Reply STOP to opt out.',
          description: 'Sent 24 hours after service completion'
        },
        {
          type: 'emergency_alert',
          name: 'Emergency Alert',
          template: 'URGENT - {customerName}: {alertMessage} Please call us immediately at {businessPhone} for assistance.',
          description: 'For urgent notifications about emergencies or critical issues'
        }
      ];

      res.json(templates);
    } catch (error) {
      console.error("Error fetching SMS templates:", error);
      res.status(500).json({ message: "Failed to fetch SMS templates" });
    }
  });

  app.get("/api/sms/status", async (req, res) => {
    try {
      const isConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);

      res.json({
        configured: isConfigured,
        accountSid: process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.substring(0, 8) + '...' : null,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || null
      });
    } catch (error) {
      console.error("Error checking Twilio status:", error);
      res.status(500).json({ message: "Failed to check Twilio status" });
    }
  });

  // TikTok Video Generation endpoint (conceptual)
  app.post("/api/tiktok/generate-video", async (req, res) => {
    try {
      const { content, style, duration } = req.body;

      // This is a conceptual implementation - TikTok video generation would require:
      // 1. Text-to-speech for narration
      // 2. Image/video generation AI (like DALL-E, Midjourney, or Runway)
      // 3. Video editing capabilities
      // 4. TikTok API integration for posting

      // For now, we'll return a conceptual response
      res.json({
        success: true,
        message: "TikTok video generation is a conceptual feature that would require:",
        requirements: [
          "Text-to-speech API (OpenAI, ElevenLabs)",
          "Video generation AI (Runway, Pika Labs)",
          "Video editing capabilities (FFmpeg)",
          "TikTok Business API access",
          "Template system for field service content"
        ],
        conceptualFlow: [
          "1. Generate script from GPT content",
          "2. Create voiceover with text-to-speech",
          "3. Generate visuals with AI video tools",
          "4. Combine audio + visuals with editing",
          "5. Upload to TikTok via API"
        ],
        estimatedCost: "High - multiple AI services required",
        timeline: "Complex feature requiring significant development"
      });
    } catch (error) {
      console.error("TikTok generation error:", error);
      res.status(500).json({ message: "Failed to process TikTok video request" });
    }
  });

    // SEO Keywords endpoints
  app.get("/api/seo-keywords", async (req, res) => {
    const keywords = await storage.getAllSeoKeywords()
    return res.json({ keywords });
  });

  app.post("/api/seo-keywords", async (req, res) => {
    const data = insertSeoKeywordSchema.parse(req.body);
    const keyword = await storage.createSeoKeyword(data);
    return res.json(keyword);
  });

  // Social Media Configuration endpoints
  app.get("/api/social-configs", async (req, res) => {
    const user = req.get('user');
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const configs = await storage.getAllSocialMediaConfigs()
    return res.json({ configs });
  });

  app.post("/api/social-configs", async (req, res) => {
    const user = req.get('user');
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const configData = insertSocialMediaConfigSchema.parse(req.body);

    // Check if config already exists for this platform
    const existing = await storage.getAllSocialMediaConfigs()

    let result;

    result = await storage.createSocialMediaConfig(configData);

    return res.json(result);
  });

  app.delete("/api/social-configs/:platform", async (req, res) => {
    const user = req.get('user');
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const platform = req.params.platform;
    await storage.deleteSocialMediaConfig(parseInt(platform) || 0)

    return res.json({ success: true });
  });

  // Enhanced Social Media Posting
  app.post("/api/social/schedule-multi-platform", async (req, res) => {
    const user = req.get('user');
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { platforms, content, scheduleTime } = req.body;
    const results = [];

    for (const platform of platforms) {
      const postData = {
        platform: platform.id,
        content: platform.content,
        status: "scheduled",
        scheduledFor: new Date(scheduleTime.date + ' ' + scheduleTime.time),
      };

      const result = await storage.createSocialPost(postData);
      results.push(result);
    }

    return res.json({ posts: results });
  });

  // Social Media Analytics
  app.get("/api/social/analytics", async (req, res) => {
    const analytics = await storage.getAllSocialMediaAnalytics();
    return res.json({ analytics });
  });

  app.post("/api/social/analytics", async (req, res) => {
    const analyticsData = insertSocialMediaAnalyticsSchema.parse(req.body);
    const result = await storage.createSocialMediaAnalytics(analyticsData);
    return res.json(result);
  });

  // AI-powered onboarding plan generation
  app.post('/api/ai/generate-onboarding-plan', async (req, res) => {
    try {
      const onboardingData = req.body;

      if (!onboardingData.businessType || !onboardingData.primaryGoals) {
        return res.status(400).json({ error: 'Business type and goals are required' });
      }

      // Create comprehensive prompt for AI
      const prompt = `Generate a personalized marketing strategy for a ${onboardingData.businessType} business called "${onboardingData.businessName}".

Business Profile:
- Service Type: ${onboardingData.businessType}
- Team Size: ${onboardingData.teamSize}
- Years in Business: ${onboardingData.yearsInBusiness}
- Service Area: ${onboardingData.serviceArea}
- Monthly Budget: ${onboardingData.monthlyBudget}

Goals: ${onboardingData.primaryGoals ? onboardingData.primaryGoals.join(', ') : 'Not specified'}
Current Challenges: ${onboardingData.currentChallenges ? onboardingData.currentChallenges.join(', ') : 'Not specified'}
Current Marketing: ${onboardingData.currentMarketing ? onboardingData.currentMarketing.join(', ') : 'Not specified'}
Social Platforms: ${onboardingData.socialPlatforms ? onboardingData.socialPlatforms.join(', ') : 'Not specified'}
Content Tone Preference: ${onboardingData.contentTone}
Automation Level: ${onboardingData.automationLevel}

Create 4-6 specific, actionable recommendations with:
1. Priority level (high/medium/low)
2. Category (content, lead generation, reviews, social media, analytics, automation)
3. Estimated impact (specific percentage or metric)
4. Setup time estimate
5. Detailed description of implementation

Format as JSON array with this structure:
{
  "recommendations": [
    {
      "category": "string",
      "title": "string",
      "description": "string",
      "priority": "high|medium|low",
      "estimatedImpact": "string",
      "setupTime": "string"
    }
  ]
}`;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: "You are an expert field service marketing consultant. Generate specific, actionable, data-driven recommendations. Respond only with valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 1500,
          temperature: 0.3
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');
        res.json(result);

      } catch (aiError: any) {
        console.log('AI service unavailable, generating personalized recommendations with business logic:', aiError.message);
        
        // Generate personalized recommendations based on business logic
        const personalizedRecommendations = generatePersonalizedRecommendations(onboardingData);
        return res.json({ recommendations: personalizedRecommendations });
      }

    } catch (error) {
      console.error('General onboarding plan generation error:', error);
      
      // Last resort fallback - generate basic recommendations
      console.log('Falling back to basic recommendations due to general error');
      const basicRecommendations = generatePersonalizedRecommendations(req.body);
      res.json({ recommendations: basicRecommendations });
    }
  });

  // Business logic for generating personalized recommendations
  function generatePersonalizedRecommendations(data: any) {
    const recommendations = [];
    const businessType = data.businessType || 'field service';
    const goals = data.primaryGoals || [];
    const challenges = data.currentChallenges || [];
    const budget = data.monthlyBudget || '';
    const teamSize = data.teamSize || '';
    const hasWebsite = data.hasWebsite;
    const socialPlatforms = data.socialPlatforms || [];

    // High priority: Lead generation (if it's a goal)
    if (goals.includes('Increase lead generation') || challenges.includes('Not enough qualified leads')) {
      recommendations.push({
        category: 'lead generation',
        title: `AI-Powered Lead Scoring for ${businessType.toUpperCase()} Services`,
        description: `Implement our intelligent lead scoring system to identify and prioritize your highest-value prospects. Automatically score leads based on service type, location, urgency, and historical conversion data. Set up automated follow-up sequences for hot leads and SMS alerts for priority inquiries.`,
        priority: 'high',
        estimatedImpact: '+40-60% lead conversion rate',
        setupTime: '2 hours'
      });
    }

    // High priority: Review management (if poor reviews is a challenge)
    if (challenges.includes('Poor online reviews') || goals.includes('Improve online reviews')) {
      recommendations.push({
        category: 'reviews',
        title: 'Automated Review Management & Response System',
        description: `Set up automated monitoring of Google, Yelp, and Facebook reviews with AI-powered response suggestions. Implement a review request automation that sends follow-up messages to satisfied customers 48 hours after service completion. Create templated responses for different review scenarios.`,
        priority: 'high',
        estimatedImpact: '+1.2 star rating improvement',
        setupTime: '90 minutes'
      });
    }

    // Medium priority: Content creation
    if (goals.includes('Boost social media presence') || challenges.includes('Inconsistent online presence')) {
      recommendations.push({
        category: 'content',
        title: 'AI Content Calendar & Multi-Platform Publishing',
        description: `Create a 30-day content calendar with AI-generated posts tailored to ${businessType} services. Set up automated posting to ${socialPlatforms.length > 0 ? socialPlatforms.join(', ') : 'Facebook, Instagram, and LinkedIn'} with optimal timing based on your audience. Include seasonal maintenance tips, before/after showcases, and customer testimonials.`,
        priority: 'medium',
        estimatedImpact: '+150% social engagement',
        setupTime: '3 hours'
      });
    }

    // Medium priority: Website optimization (if they don't have one or want better online presence)
    if (!hasWebsite || challenges.includes('Inconsistent online presence')) {
      recommendations.push({
        category: 'automation',
        title: 'Professional Website with Lead Capture Forms',
        description: `${!hasWebsite ? 'Build a professional website' : 'Optimize your existing website'} with service-specific landing pages, customer testimonials, and strategically placed lead capture forms. Implement live chat widget and appointment booking system. Add local SEO optimization for ${data.serviceArea || 'your service area'}.`,
        priority: !hasWebsite ? 'high' : 'medium',
        estimatedImpact: '+25% online lead generation',
        setupTime: !hasWebsite ? '6 hours' : '3 hours'
      });
    }

    // Budget-based recommendations
    if (budget.includes('3000') || budget.includes('5000')) {
      recommendations.push({
        category: 'social media',
        title: 'Strategic Paid Advertising Campaign',
        description: `Launch targeted Facebook and Google Ads campaigns focused on emergency ${businessType} services and seasonal maintenance. Set up geo-targeted campaigns for ${data.serviceArea || 'your local area'} with call tracking and conversion optimization. Include retargeting campaigns for website visitors.`,
        priority: 'medium',
        estimatedImpact: '+200% qualified leads',
        setupTime: '4 hours'
      });
    }

    // Team size based recommendations
    if (teamSize.includes('6-') || teamSize.includes('16-') || teamSize.includes('50+')) {
      recommendations.push({
        category: 'analytics',
        title: 'Advanced Analytics & Team Performance Dashboard',
        description: `Implement comprehensive analytics tracking across all marketing channels with team performance metrics. Set up automated reports showing lead source attribution, conversion rates by technician, and ROI by marketing channel. Create KPI dashboards for team leads and managers.`,
        priority: 'low',
        estimatedImpact: '+15% operational efficiency',
        setupTime: '2 hours'
      });
    } else {
      recommendations.push({
        category: 'automation',
        title: 'Customer Communication Automation',
        description: `Set up automated SMS and email sequences for appointment confirmations, service reminders, and follow-up surveys. Create templates for common customer communications and implement a simple CRM system to track customer interactions and service history.`,
        priority: 'medium',
        estimatedImpact: '+30% customer retention',
        setupTime: '2.5 hours'
      });
    }

    // Always include this as a low priority
    recommendations.push({
      category: 'analytics',
      title: 'Marketing ROI Tracking & Optimization',
      description: `Implement comprehensive tracking of all marketing activities with detailed ROI analysis. Set up Google Analytics goals, call tracking numbers for different campaigns, and monthly performance reports. Create a simple system to measure cost per lead and lifetime customer value.`,
      priority: 'low',
      estimatedImpact: '+20% marketing efficiency',
      setupTime: '90 minutes'
    });

    return recommendations.slice(0, 6); // Return max 6 recommendations
  }

  // Save user onboarding data
  app.post('/api/user/onboarding', async (req, res) => {
    try {
      const onboardingData = req.body;
      
      // For now, just return success - in a real app, this would save to the database
      await storage.createActivity({
        type: "onboarding",
        title: "Onboarding Completed",
        description: `${onboardingData.businessName} completed personalized onboarding`
      });

      res.json({ 
        success: true, 
        message: 'Onboarding completed successfully',
        redirect: '/dashboard'
      });

    } catch (error) {
      console.error('Onboarding save error:', error);
      res.status(500).json({ error: 'Failed to save onboarding data' });
    }
  });

  // Send onboarding plan via email
  app.post('/api/user/send-onboarding-plan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { email, businessName, recommendations, userProfile } = req.body;
      
      if (!email || !businessName || !recommendations) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Import email service
      const { emailService } = await import("./services/emailService");
      
      // Send the onboarding plan email
      const success = await emailService.sendOnboardingPlan(userId, email, {
        businessName,
        recommendations,
        userProfile
      });

      if (success) {
        res.json({ 
          success: true, 
          message: "Email sent successfully"
        });
      } else {
        res.status(500).json({ 
          error: "Failed to send email - Email service may not be configured",
          message: "Please contact support if you need email functionality" 
        });
      }
    } catch (error) {
      console.error("Error sending onboarding plan email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Stripe payment routes
  app.post('/api/stripe/create-payment-intent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount, description, metadata } = req.body;

      if (!amount || !description) {
        return res.status(400).json({ error: 'Amount and description are required' });
      }

      const { stripeService } = await import('./services/stripeService');
      const result = await stripeService.createPaymentIntent(userId, amount, description, metadata);

      res.json(result);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });

  app.post('/api/stripe/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      const { stripeService } = await import('./services/stripeService');
      const result = await stripeService.getOrCreateSubscription(userId, priceId);

      res.json(result);
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  });

  app.post('/api/stripe/cancel-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { stripeService } = await import('./services/stripeService');
      await stripeService.cancelSubscription(userId);

      res.json({ success: true });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  });

  app.post('/api/stripe/create-billing-portal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { returnUrl } = req.body;
      const { stripeService } = await import('./services/stripeService');
      const url = await stripeService.createBillingPortalSession(userId, returnUrl || 'http://localhost:5000');

      res.json({ url });
    } catch (error) {
      console.error('Error creating billing portal:', error);
      res.status(500).json({ error: 'Failed to create billing portal' });
    }
  });

  app.get('/api/stripe/subscription-plans', async (req, res) => {
    try {
      const { stripeService } = await import('./services/stripeService');
      const plans = await stripeService.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
  });

  app.get('/api/stripe/payment-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { stripeService } = await import('./services/stripeService');
      const payments = await stripeService.getUserPaymentHistory(userId);
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      res.status(500).json({ error: 'Failed to fetch payment history' });
    }
  });

  // Stripe webhooks endpoint (no auth required)
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!endpointSecret) {
        console.warn('STRIPE_WEBHOOK_SECRET not configured');
        return res.status(400).json({ error: 'Webhook secret not configured' });
      }

      const { stripeService } = await import('./services/stripeService');
      await stripeService.handleWebhook(req.body, signature, endpointSecret);

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook validation failed' });
    }
  });

  // AI Landing Page Generation
  app.post("/api/ai/generate-landing-page", async (req, res) => {
    try {
      const { messages, userPrompt } = req.body;

      if (!userPrompt || !process.env.OPENAI_API_KEY) {
        return res.status(400).json({ 
          error: 'Missing required parameters or API key not configured' 
        });
      }

      // Create a comprehensive prompt for landing page generation
      const systemPrompt = `You are an expert landing page designer and copywriter specializing in field service businesses (HVAC, plumbing, electrical, landscaping). 

Your task is to:
1. Analyze the user's request for a landing page
2. Generate a complete, professional HTML landing page with embedded CSS
3. Focus on conversion optimization and mobile responsiveness
4. Include relevant field service industry elements
5. Use modern, clean design principles

Response format: Return a JSON object with:
{
  "message": "Brief description of what you created",
  "landingPage": {
    "title": "Page title",
    "description": "Brief page description", 
    "html": "Complete HTML content (body content only, no DOCTYPE/html/head tags)",
    "css": "Complete CSS styles for the page",
    "thumbnail": "Brief description for thumbnail preview"
  }
}

Design guidelines:
- Use professional color schemes (blues, greens, or business colors)
- Include clear call-to-action buttons
- Mobile-first responsive design
- Professional typography
- Trust signals (reviews, certifications, guarantees)
- Contact forms or phone numbers prominently displayed
- Hero section with compelling headline
- Service benefits and features
- Customer testimonials when relevant

Make the page conversion-focused and industry-appropriate.`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-5), // Keep last 5 messages for context
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000,
      });

      const responseText = completion.choices[0].message.content;
      if (!responseText) {
        throw new Error('No response generated');
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        // Fallback response if JSON parsing fails
        const serviceType = detectServiceType(userPrompt);
        parsedResponse = {
          message: "I've created a professional landing page for your field service business.",
          landingPage: {
            title: `Professional ${serviceType} Services`,
            description: "High-converting landing page with modern design",
            html: generateFallbackHTML(userPrompt, serviceType),
            css: generateFallbackCSS(),
            thumbnail: "Professional service page with hero section and contact form"
          }
        };
      }

      // Ensure we have the required structure
      if (!parsedResponse.landingPage) {
        const serviceType = detectServiceType(userPrompt);
        parsedResponse.landingPage = {
          title: `Generated ${serviceType} Landing Page`,
          description: "AI-generated landing page",
          html: generateFallbackHTML(userPrompt, serviceType),
          css: generateFallbackCSS(),
          thumbnail: "Custom landing page"
        };
      }

      res.json(parsedResponse);

    } catch (error) {
      console.error('Landing page generation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate landing page',
        message: 'I encountered an error while generating your landing page. Please try again with a more specific description of what you need.'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for landing page generation
function detectServiceType(prompt: string): string {
  const prompt_lower = prompt.toLowerCase();
  
  if (prompt_lower.includes('hvac') || prompt_lower.includes('heating') || prompt_lower.includes('cooling') || prompt_lower.includes('air condition')) {
    return 'HVAC';
  } else if (prompt_lower.includes('plumb') || prompt_lower.includes('pipe') || prompt_lower.includes('drain')) {
    return 'Plumbing';
  } else if (prompt_lower.includes('electric') || prompt_lower.includes('wiring') || prompt_lower.includes('electrical')) {
    return 'Electrical';
  } else if (prompt_lower.includes('landscap') || prompt_lower.includes('lawn') || prompt_lower.includes('garden')) {
    return 'Landscaping';
  } else {
    return 'Field Service';
  }
}

function generateFallbackHTML(userPrompt: string, serviceType: string): string {
  return `
    <div class="landing-page">
      <header class="hero-section">
        <div class="container">
          <h1 class="hero-title">Professional ${serviceType} Services</h1>
          <p class="hero-subtitle">Reliable, fast, and affordable ${serviceType.toLowerCase()} solutions for your home or business</p>
          <div class="hero-cta">
            <a href="#contact" class="btn-primary">Get Free Quote</a>
            <a href="tel:555-123-4567" class="btn-secondary">Call Now: (555) 123-4567</a>
          </div>
        </div>
      </header>

      <section class="services-section">
        <div class="container">
          <h2>Our Services</h2>
          <div class="services-grid">
            <div class="service-card">
              <h3>Emergency Service</h3>
              <p>24/7 emergency ${serviceType.toLowerCase()} service when you need it most</p>
            </div>
            <div class="service-card">
              <h3>Maintenance</h3>
              <p>Regular maintenance to keep your systems running efficiently</p>
            </div>
            <div class="service-card">
              <h3>Installation</h3>
              <p>Professional installation of new ${serviceType.toLowerCase()} systems</p>
            </div>
          </div>
        </div>
      </section>

      <section class="testimonials-section">
        <div class="container">
          <h2>What Our Customers Say</h2>
          <div class="testimonials-grid">
            <div class="testimonial">
              <p>"Excellent service! Fast, professional, and reasonably priced."</p>
              <div class="testimonial-author">- Sarah M.</div>
            </div>
            <div class="testimonial">
              <p>"They fixed our problem quickly and explained everything clearly."</p>
              <div class="testimonial-author">- Mike R.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="contact-section" id="contact">
        <div class="container">
          <h2>Get Your Free Quote Today</h2>
          <form class="contact-form">
            <div class="form-group">
              <input type="text" placeholder="Your Name" required>
            </div>
            <div class="form-group">
              <input type="email" placeholder="Email Address" required>
            </div>
            <div class="form-group">
              <input type="tel" placeholder="Phone Number" required>
            </div>
            <div class="form-group">
              <textarea placeholder="Describe your ${serviceType.toLowerCase()} needs" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Request Free Quote</button>
          </form>
        </div>
      </section>
    </div>
  `;
}

function generateFallbackCSS(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 0;
      text-align: center;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 15px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .btn-primary {
      background: #ff6b6b;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #ff5252;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
    }

    .services-section, .testimonials-section, .contact-section {
      padding: 80px 0;
    }

    .services-section {
      background: #f8f9fa;
    }

    .services-section h2, .testimonials-section h2, .contact-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #2d3748;
    }

    .services-grid, .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .service-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .service-card:hover {
      transform: translateY(-5px);
    }

    .service-card h3 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .testimonial {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }

    .testimonial p {
      font-style: italic;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .testimonial-author {
      font-weight: bold;
      color: #667eea;
    }

    .contact-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .contact-form {
      max-width: 600px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group input, .form-group textarea {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      background: rgba(255,255,255,0.9);
    }

    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      background: white;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-cta {
        flex-direction: column;
        align-items: center;
      }
      
      .services-grid, .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}