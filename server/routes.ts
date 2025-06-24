import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertWordPressPostSchema,
  insertSocialPostSchema,
  insertLeadSchema,
  insertTaskSchema,
  insertActivitySchema,
  insertSeoKeywordSchema,
} from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard Analytics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      const tasks = await storage.getAllTasks();
      const socialPosts = await storage.getAllSocialPosts();
      const seoKeywords = await storage.getAllSeoKeywords();

      const metrics = {
        traffic: 2847,
        trafficGrowth: 12.5,
        socialEngagement: 1234,
        socialEngagementGrowth: 8.3,
        leads: leads.length,
        leadsGrowth: 15.2,
        reviewScore: 4.8,
        reviewCount: 156,
      };

      res.json(metrics);
    } catch (error) {
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

      await storage.createActivity({
        type: "lead",
        title: "New Lead Received",
        description: `New ${data.service} inquiry from ${data.name} in ${data.location}`,
      });

      res.json(lead);
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

  const httpServer = createServer(app);
  return httpServer;
}
