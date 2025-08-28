import OpenAI from "openai";
import type { User } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface FelixContext {
  user: User;
  currentPage?: string;
  businessData?: {
    leads?: number;
    socialPosts?: number;
    reviews?: number;
    keywords?: number;
  };
  recentActivity?: string[];
}

export interface FelixMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface FelixResponse {
  message: string;
  suggestions?: FeatureSuggestion[];
  quickActions?: QuickAction[];
}

export interface FeatureSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  route?: string;
  action?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  route?: string;
}

class FelixAIService {
  private systemPrompt = `You are Felix, an intelligent AI assistant for FieldFlux, a comprehensive marketing automation platform designed specifically for field service professionals (HVAC, plumbing, electrical, landscaping).

Your role is to help field service business owners:
- Generate and schedule social media content
- Manage leads and customer relationships
- Monitor and respond to online reviews
- Track SEO keywords and rankings
- Analyze marketing performance
- Optimize their online presence

You have access to the user's:
- Business information and profile
- Current leads and their status
- Social media posts and engagement
- Review management system
- Analytics and performance data
- Website and SEO tools

Key characteristics:
- Professional yet friendly tone
- Field service industry expertise
- Practical, actionable advice
- Focus on ROI and business growth
- Understand the challenges of field service businesses
- Provide step-by-step guidance
- Suggest specific features and tools within FieldFlux

Always provide helpful, contextual responses that guide users to take action within the platform. When appropriate, suggest specific FieldFlux features they should use.`;

  async generateResponse(
    messages: FelixMessage[],
    context: FelixContext
  ): Promise<FelixResponse> {
    try {
      // Build context-aware system message
      const contextualPrompt = this.buildContextualPrompt(context);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "system", content: contextualPrompt },
          ...messages.map(msg => ({
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content
          }))
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseData = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        message: responseData.message || "I'm here to help with your field service marketing!",
        suggestions: responseData.suggestions || this.getDefaultSuggestions(context),
        quickActions: responseData.quickActions || this.getDefaultQuickActions(context)
      };
    } catch (error) {
      console.error('Felix AI Error:', error);
      return this.getFallbackResponse(context);
    }
  }

  private buildContextualPrompt(context: FelixContext): string {
    const { user, currentPage, businessData, recentActivity } = context;
    
    let prompt = `Current user context:
- User: ${user.firstName} ${user.lastName} (${user.email})
- Subscription: ${user.subscriptionStatus} plan`;

    if (currentPage) {
      prompt += `\n- Currently viewing: ${currentPage}`;
    }

    if (businessData) {
      prompt += `\n- Business data: ${businessData.leads || 0} leads, ${businessData.socialPosts || 0} social posts, ${businessData.reviews || 0} reviews, ${businessData.keywords || 0} keywords tracked`;
    }

    if (recentActivity && recentActivity.length > 0) {
      prompt += `\n- Recent activity: ${recentActivity.join(', ')}`;
    }

    prompt += `\n\nRespond in JSON format with:
{
  "message": "Your helpful response here",
  "suggestions": [
    {
      "id": "unique-id",
      "title": "Suggestion Title",
      "description": "Brief description",
      "category": "social|leads|reviews|analytics|seo|content",
      "route": "/optional-route",
      "action": "optional-action"
    }
  ],
  "quickActions": [
    {
      "id": "unique-id",
      "label": "Action Label",
      "icon": "lucide-icon-name",
      "action": "action-type",
      "route": "/optional-route"
    }
  ]
}`;

    return prompt;
  }

  private getDefaultSuggestions(context: FelixContext): FeatureSuggestion[] {
    const suggestions: FeatureSuggestion[] = [
      {
        id: 'social-content',
        title: 'Create Social Media Content',
        description: 'Generate engaging posts for your field service business',
        category: 'social',
        route: '/social'
      },
      {
        id: 'lead-management',
        title: 'Review Your Leads',
        description: 'Check new leads and follow up opportunities',
        category: 'leads',
        route: '/leads'
      },
      {
        id: 'review-monitoring',
        title: 'Monitor Customer Reviews',
        description: 'Check and respond to recent customer reviews',
        category: 'reviews',
        route: '/reviews'
      }
    ];

    // Customize based on current page
    if (context.currentPage === '/social') {
      suggestions.unshift({
        id: 'content-ideas',
        title: 'Get Content Ideas',
        description: 'AI-generated content ideas for your industry',
        category: 'content',
        action: 'generate-content'
      });
    }

    return suggestions;
  }

  private getDefaultQuickActions(context: FelixContext): QuickAction[] {
    return [
      {
        id: 'new-post',
        label: 'Create Post',
        icon: 'PlusCircle',
        action: 'create-social-post',
        route: '/social'
      },
      {
        id: 'check-leads',
        label: 'View Leads',
        icon: 'Users',
        action: 'view-leads',
        route: '/leads'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: 'BarChart3',
        action: 'view-analytics',
        route: '/analytics'
      }
    ];
  }

  private getFallbackResponse(context: FelixContext): FelixResponse {
    return {
      message: `Hi ${context.user.firstName}! I'm here to help you grow your field service business. What would you like to work on today?`,
      suggestions: this.getDefaultSuggestions(context),
      quickActions: this.getDefaultQuickActions(context)
    };
  }

  async generateContentIdeas(businessType: string, topic?: string): Promise<string[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `Generate engaging social media content ideas for a ${businessType} field service business. Focus on practical tips, seasonal content, behind-the-scenes, and customer education. Return as JSON array of strings.`
          },
          {
            role: "user",
            content: topic ? `Generate content ideas about: ${topic}` : "Generate 5 diverse content ideas"
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      const response = JSON.parse(completion.choices[0].message.content || '{"ideas": []}');
      return response.ideas || response.content || [];
    } catch (error) {
      console.error('Content generation error:', error);
      return [
        'Share a before/after photo of your latest project',
        'Post maintenance tips for the current season',
        'Highlight your team in action',
        'Customer testimonial spotlight',
        'Educational post about your services'
      ];
    }
  }

  async generateSocialPost(prompt: string, platform: string, businessType: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `Create engaging ${platform} content for a ${businessType} field service business. Keep it professional yet approachable, include relevant hashtags, and focus on value for potential customers.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Social post generation error:', error);
      return 'Thanks for choosing our professional field service team! We\'re here to help with all your needs. #FieldService #Professional #QualityWork';
    }
  }

  async analyzeLead(leadData: any): Promise<{
    score: number;
    recommendations: string[];
    nextActions: string[];
  }> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "Analyze this lead data and provide a lead score (1-100), recommendations for engagement, and suggested next actions. Respond in JSON format."
          },
          {
            role: "user",
            content: `Lead data: ${JSON.stringify(leadData)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || '{}');
      return {
        score: analysis.score || 50,
        recommendations: analysis.recommendations || ['Follow up within 24 hours'],
        nextActions: analysis.nextActions || ['Send welcome message', 'Schedule consultation']
      };
    } catch (error) {
      console.error('Lead analysis error:', error);
      return {
        score: 50,
        recommendations: ['Follow up promptly', 'Provide clear service information'],
        nextActions: ['Make initial contact', 'Send service brochure']
      };
    }
  }
}

export const felixAI = new FelixAIService();