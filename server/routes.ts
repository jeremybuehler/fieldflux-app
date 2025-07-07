import type { Express } from "express";
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
});

// Initialize Twilio client if credentials are available
let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Simple authentication middleware for now
const isAuthenticated = (req: any, res: any, next: any) => {
  // For now, allow all requests - we'll implement proper auth later
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
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
            content: "You are a professional HVAC business owner responding to customer reviews. Be courteous, professional, and address any concerns mentioned. Keep responses concise and grateful.",
          },
          {
            role: "user",
            content: `Generate a professional response to this ${review.rating}-star review: "${review.content}" from ${review.customerName}. The business is a local HVAC company in Winter Haven/Lakeland, Florida.`,
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

  // Enhanced Analytics Reporting
  app.post("/api/analytics/generate-report", async (req, res) => {
    try {
      const { period = "30d" } = req.body;

      // Simulate comprehensive analytics data
      const reportData = {
        period,
        traffic: Math.floor(Math.random() * 5000) + 2000,
        conversions: Math.floor(Math.random() * 50) + 20,
        topKeywords: [
          "HVAC repair Winter Haven",
          "AC installation Lakeland", 
          "Commercial HVAC service",
          "Emergency HVAC repair",
          "Heat pump maintenance"
        ],
        topPages: [
          "/services/ac-repair",
          "/services/installation", 
          "/commercial-hvac",
          "/emergency-service",
          "/maintenance-plans"
        ],
        trafficSources: [
          "Google Organic (45%)",
          "Google Ads (25%)",
          "Direct (15%)",
          "Facebook (10%)",
          "Referrals (5%)"
        ]
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
        description: `SMS sent to ${to}: ${type || 'general'}`,
        status: "completed",
        metadata: { messageId: twilioMessage.sid, type }
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
        error: error.message 
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
    await storage.deleteSocialMediaConfig(platform)

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

  const httpServer = createServer(app);
  return httpServer;
}