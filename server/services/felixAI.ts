import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';
import type { User } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Anthropic client if API key is available
let anthropic: Anthropic | null = null;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export type AIModel = 'gpt-4o' | 'gpt-5' | 'claude-sonnet-4' | 'claude-haiku-3.5';

export interface ModelInfo {
  id: AIModel;
  name: string;
  provider: 'openai' | 'anthropic';
  description: string;
  available: boolean;
}

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
  insights?: BusinessInsight[];
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

export interface BusinessInsight {
  id: string;
  type: 'productivity' | 'marketing' | 'leads' | 'growth';
  title: string;
  message: string;
  impact: string;
  actionable: boolean;
  route?: string;
  priority: 'high' | 'medium' | 'low';
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

  getAvailableModels(): ModelInfo[] {
    return [
      {
        id: 'gpt-5',
        name: 'GPT-5',
        provider: 'openai',
        description: 'Most advanced OpenAI model with superior reasoning',
        available: !!process.env.OPENAI_API_KEY
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai', 
        description: 'Fast and efficient OpenAI model',
        available: !!process.env.OPENAI_API_KEY
      },
      {
        id: 'claude-sonnet-4',
        name: 'Claude 4.0 Sonnet',
        provider: 'anthropic',
        description: 'Latest Anthropic model with excellent analysis',
        available: !!process.env.ANTHROPIC_API_KEY
      },
      {
        id: 'claude-haiku-3.5',
        name: 'Claude 3.5 Haiku',
        provider: 'anthropic',
        description: 'Fast Anthropic model for quick responses',
        available: !!process.env.ANTHROPIC_API_KEY
      }
    ];
  }

  async generateResponse(
    messages: FelixMessage[],
    context: FelixContext,
    model: AIModel = 'gpt-5'
  ): Promise<FelixResponse> {
    try {
      // Build context-aware system message
      const contextualPrompt = this.buildContextualPrompt(context);
      
      let responseText: string;

      const modelInfo = this.getAvailableModels().find(m => m.id === model);
      if (!modelInfo?.available) {
        throw new Error(`Model ${model} is not available`);
      }

      if (modelInfo.provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: model === 'gpt-5' ? 'gpt-5' : 'gpt-4o',
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
        responseText = completion.choices[0].message.content || '{}';
      } else if (modelInfo.provider === 'anthropic' && anthropic) {
        const anthropicModel = model === 'claude-sonnet-4' ? 'claude-3-5-sonnet-20241022' : 'claude-3-5-haiku-20241022';
        
        const systemMessage = `${this.systemPrompt}\n\n${contextualPrompt}\n\nYou must respond with valid JSON in this exact format: {"message": "your response here", "suggestions": [], "quickActions": [], "insights": []}`;
        
        const completion = await anthropic.messages.create({
          model: anthropicModel,
          max_tokens: 1500,
          temperature: 0.7,
          system: systemMessage,
          messages: messages.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }))
        });
        
        const content = completion.content[0];
        if (content.type === 'text') {
          // Try to extract JSON, if not found return plain text response
          try {
            const jsonMatch = content.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              responseText = jsonMatch[0];
            } else {
              // If no JSON found, create proper response
              responseText = JSON.stringify({
                message: content.text,
                suggestions: this.getDefaultSuggestions(context),
                quickActions: this.getDefaultQuickActions(context),
                insights: []
              });
            }
          } catch {
            responseText = JSON.stringify({
              message: content.text,
              suggestions: this.getDefaultSuggestions(context),
              quickActions: this.getDefaultQuickActions(context),
              insights: []
            });
          }
        } else {
          responseText = '{"message": "I\'m here to help with your field service marketing!"}';
        }
      } else {
        throw new Error(`Provider for model ${model} is not available`);
      }

      const responseData = JSON.parse(responseText);
      
      return {
        message: responseData.message || "I'm here to help with your field service marketing!",
        suggestions: responseData.suggestions || this.getDefaultSuggestions(context),
        quickActions: responseData.quickActions || this.getDefaultQuickActions(context),
        insights: responseData.insights || this.generateInsights(context)
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

  private generateInsights(context: FelixContext): BusinessInsight[] {
    const insights: BusinessInsight[] = [];
    const { businessData } = context;

    if (!businessData) return insights;

    // Productivity insights
    if (businessData.leads && businessData.leads > 0) {
      insights.push({
        id: 'productivity-automation',
        type: 'productivity',
        title: 'Productivity Insight',
        message: `Field service businesses that use automated marketing see 40% more leads. Let me show you which processes we can automate.`,
        impact: 'Could increase leads by 40%',
        actionable: true,
        route: '/social',
        priority: 'high'
      });
    }

    // Marketing insights
    if (businessData.socialPosts && businessData.socialPosts < 5) {
      insights.push({
        id: 'social-consistency',
        type: 'marketing',
        title: 'Marketing Insight',
        message: `Posting consistently on social media increases customer engagement by 67%. You currently have ${businessData.socialPosts} posts - let's create a content strategy.`,
        impact: 'Boost engagement by 67%',
        actionable: true,
        route: '/social',
        priority: 'medium'
      });
    }

    // Lead insights
    if (businessData.leads && businessData.leads > 5) {
      insights.push({
        id: 'lead-conversion',
        type: 'leads',
        title: 'Lead Management Insight',
        message: `You have ${businessData.leads} active leads! Following up within 5 minutes increases conversion rates by 900%. Want me to help prioritize them?`,
        impact: 'Increase conversions by 900%',
        actionable: true,
        route: '/leads',
        priority: 'high'
      });
    }

    // Growth insights
    if (businessData.reviews && businessData.reviews > 10) {
      insights.push({
        id: 'review-leverage',
        type: 'growth',
        title: 'Growth Opportunity',
        message: `Your ${businessData.reviews} reviews are valuable social proof! Businesses that showcase reviews get 31% more customers. Let's create content highlighting your success.`,
        impact: '31% more customers',
        actionable: true,
        route: '/reviews',
        priority: 'medium'
      });
    }

    return insights.slice(0, 2); // Return max 2 insights at a time
  }

  // Public wrapper to expose insights without revealing private method
  buildInsights(context: FelixContext): BusinessInsight[] {
    return this.generateInsights(context);
  }

  private getFallbackResponse(context: FelixContext): FelixResponse {
    return {
      message: `Hi ${context.user.firstName}! I'm here to help you grow your field service business. What would you like to work on today?`,
      suggestions: this.getDefaultSuggestions(context),
      quickActions: this.getDefaultQuickActions(context),
      insights: this.generateInsights(context)
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
