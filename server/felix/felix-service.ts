import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null as any;

interface ChatMessage {
  id: string;
  type: 'user' | 'felix' | 'system';
  content: string;
  timestamp: Date;
}

interface TaskContext {
  taskId: string;
  taskTitle: string;
  stage: string;
  collectedData: Record<string, any>;
}

export class FelixService {
  
  async startTask(taskId: string, taskTitle: string, taskDescription: string) {
    const taskPrompts = {
      "create-post": {
        message: "Perfect! I'll help you create engaging social media content for your field service business. To get started, I need to understand your specific situation better.",
        nextSteps: [
          {
            id: "business-type",
            title: "What's your trade?",
            description: "HVAC, Plumbing, Electrical, or Landscaping",
            icon: "Zap",
            category: "setup"
          },
          {
            id: "target-audience",
            title: "Who's your audience?",
            description: "Homeowners, businesses, or both",
            icon: "Users", 
            category: "setup"
          }
        ]
      },
      "analyze-performance": {
        message: "Great choice! Let's analyze your business performance and identify opportunities for growth. I'll help you understand what's working and what needs improvement.",
        nextSteps: [
          {
            id: "connect-analytics",
            title: "Connect Analytics",
            description: "Link your Google Analytics for real data",
            icon: "BarChart3",
            category: "data"
          },
          {
            id: "manual-review",
            title: "Manual Review",
            description: "I'll guide you through key metrics to track",
            icon: "FileText",
            category: "manual"
          }
        ]
      }
    };

    return taskPrompts[taskId as keyof typeof taskPrompts] || {
      message: "Let's work on this task together! How would you like to proceed?",
      nextSteps: []
    };
  }

  async processChat(message: string, currentTask: string | null, conversationHistory: ChatMessage[]) {
    try {
      const systemPrompt = this.getSystemPrompt(currentTask);
      const context = this.buildContext(conversationHistory);
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Context: ${context}\n\nUser message: ${message}` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      });

      const response = JSON.parse(completion.choices[0].message.content || "{}");
      
      return {
        message: response.message || "I'm here to help! What would you like to work on?",
        options: response.options || [],
        nextAction: response.nextAction || null
      };

    } catch (error) {
      console.error('Felix chat error:', error);
      return {
        message: this.getFallbackResponse(currentTask, message),
        options: this.getFallbackOptions(currentTask)
      };
    }
  }

  private getSystemPrompt(currentTask: string | null): string {
    const basePrompt = `You are FieldFlux, the complete AI assistant for field service businesses. You are the ONLY interface users interact with - there are no other dashboards, menus, or pages. Users rely on you for EVERYTHING related to their business.

When users ask to view analytics, manage leads, check schedules, or access any business function, provide the information directly in conversation. You ARE their complete business management system.

Your comprehensive capabilities include:
- Lead tracking and management
- Customer relationship management 
- Appointment scheduling and calendar management
- Service tracking and job management
- Marketing content creation and campaigns
- Review management and reputation building
- Business analytics and performance insights
- SEO and local search optimization
- Invoicing and payment tracking
- Staff scheduling and workforce management

Always respond in JSON format with this structure:
{
  "message": "Your response to the user",
  "options": [
    {
      "id": "option-id", 
      "title": "Option Title",
      "description": "Brief description", 
      "icon": "IconName",
      "category": "category"
    }
  ],
  "nextAction": "next_step_id or null"
}

Handle all business requests conversationally and provide actionable solutions. Be the complete business management interface.`;

    const taskSpecificPrompts = {
      "create-post": `Current Task: Social Media Post Creation
Guide the user through: 1) Business type identification, 2) Target audience, 3) Post type/goal, 4) Content generation, 5) Platform optimization.`,
      
      "analyze-performance": `Current Task: Business Performance Analysis  
Guide the user through: 1) Data source connection, 2) Key metric identification, 3) Performance review, 4) Improvement recommendations.`,

      "generate-leads": `Current Task: Lead Generation Strategy
Guide the user through: 1) Current lead sources, 2) Target customer profile, 3) Competition analysis, 4) Strategy development.`,

      "schedule-campaign": `Current Task: Marketing Campaign Scheduling
Guide the user through: 1) Campaign goals, 2) Timeline planning, 3) Channel selection, 4) Content calendar creation.`,

      "review-management": `Current Task: Review Management
Guide the user through: 1) Current review status, 2) Response strategy, 3) Improvement plan, 4) Monitoring setup.`,

      "customer-insights": `Current Task: Customer Analysis
Guide the user through: 1) Data collection, 2) Customer segmentation, 3) Behavior analysis, 4) Action planning.`
    };

    return basePrompt + "\n\n" + (taskSpecificPrompts[currentTask as keyof typeof taskSpecificPrompts] || "");
  }

  private buildContext(conversationHistory: ChatMessage[]): string {
    return conversationHistory
      .slice(-3)
      .map(msg => `${msg.type}: ${msg.content}`)
      .join("\n");
  }

  private getFallbackResponse(currentTask: string | null, message: string): string {
    if (currentTask === "create-post") {
      return "I'll help you create a great social media post! Let's start with your business type - are you in HVAC, plumbing, electrical, or landscaping?";
    }
    
    if (currentTask === "analyze-performance") {
      return "Let's dive into your business performance! To give you the best analysis, I'd like to understand what metrics are most important to you right now.";
    }

    return "I'm FieldFlux, your complete field service business assistant! I handle everything from lead management to scheduling, analytics, marketing, and operations. What business area would you like to work on today?";
  }

  private getFallbackOptions(currentTask: string | null) {
    if (currentTask === "create-post") {
      return [
        { id: "hvac-post", title: "HVAC Services", description: "Heating & cooling content", icon: "Zap", category: "trade" },
        { id: "plumbing-post", title: "Plumbing Services", description: "Plumbing & water services", icon: "Zap", category: "trade" },
        { id: "electrical-post", title: "Electrical Services", description: "Electrical work content", icon: "Zap", category: "trade" },
        { id: "landscaping-post", title: "Landscaping Services", description: "Landscaping & lawn care", icon: "Zap", category: "trade" }
      ];
    }

    return [
      { id: "start-over", title: "Start Over", description: "Choose a different task", icon: "ArrowLeft", category: "navigation" }
    ];
  }

  async generateSocialMediaPost(businessType: string, audience: string, postGoal: string, additionalContext?: string) {
    try {
      const prompt = `Create a social media post for a ${businessType} business targeting ${audience}. 
      Goal: ${postGoal}
      ${additionalContext ? `Additional context: ${additionalContext}` : ''}
      
      Create an engaging post that's professional yet approachable, includes a clear call-to-action, and is optimized for field service marketing.
      
      Respond in JSON format:
      {
        "post": "The social media post text",
        "hashtags": ["relevant", "hashtags"],
        "callToAction": "Specific call-to-action",
        "platforms": {
          "facebook": "Platform-specific version if needed",
          "instagram": "Platform-specific version if needed", 
          "linkedin": "Platform-specific version if needed"
        }
      }`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.8
      });

      return JSON.parse(completion.choices[0].message.content || "{}");
    } catch (error) {
      console.error('Social media generation error:', error);
      return {
        post: `🔧 ${businessType.toUpperCase()} SERVICES YOU CAN TRUST! 🔧\n\nYour local experts are here to help with all your ${businessType.toLowerCase()} needs. Quality work, fair prices, and reliable service every time.\n\n✅ Licensed & Insured\n✅ Same-day service available\n✅ 100% satisfaction guaranteed\n\nReady to get started? Contact us today!`,
        hashtags: [`#${businessType}`, "#LocalBusiness", "#FieldService", "#QualityWork"],
        callToAction: "Call now for a free estimate!",
        platforms: {}
      };
    }
  }
}

export const felixService = new FelixService();
