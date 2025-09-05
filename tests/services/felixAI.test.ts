import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { felixAI } from '@/server/services/felixAI';
import type { FelixContext, FelixMessage, AIModel } from '@/server/services/felixAI';

// Mock OpenAI
const mockOpenAI = {
  chat: {
    completions: {
      create: vi.fn()
    }
  }
};

// Mock Anthropic
const mockAnthropic = {
  messages: {
    create: vi.fn()
  }
};

// Mock the modules
vi.mock('openai', () => ({
  default: vi.fn(() => mockOpenAI)
}));

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn(() => mockAnthropic)
}));

// Mock environment variables
const originalEnv = process.env;

const mockUser = {
  id: 'user-123',
  email: 'john@hvacpro.com',
  firstName: 'John',
  lastName: 'Doe',
  subscriptionStatus: 'active' as const,
  role: 'user' as const,
  tenantId: 'tenant-123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockContext: FelixContext = {
  user: mockUser,
  currentPage: '/dashboard',
  businessData: {
    leads: 5,
    socialPosts: 12,
    reviews: 8,
    keywords: 15,
  },
  recentActivity: [
    'Created social media post',
    'Updated lead status',
    'Responded to review'
  ]
};

describe('FelixAI Service', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { 
      ...originalEnv,
      OPENAI_API_KEY: 'test-openai-key',
      ANTHROPIC_API_KEY: 'test-anthropic-key'
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env = originalEnv;
  });

  describe('Model Availability', () => {
    it('should return available models when API keys are present', () => {
      const models = felixAI.getAvailableModels();
      
      expect(models).toHaveLength(4);
      expect(models.every(model => model.available)).toBe(true);
      
      const modelIds = models.map(m => m.id);
      expect(modelIds).toContain('gpt-5');
      expect(modelIds).toContain('gpt-4o');
      expect(modelIds).toContain('claude-sonnet-4');
      expect(modelIds).toContain('claude-haiku-3.5');
    });

    it('should mark OpenAI models as unavailable when API key is missing', () => {
      process.env.OPENAI_API_KEY = '';
      
      const models = felixAI.getAvailableModels();
      const openAIModels = models.filter(m => m.provider === 'openai');
      
      expect(openAIModels.every(model => !model.available)).toBe(true);
    });

    it('should mark Anthropic models as unavailable when API key is missing', () => {
      process.env.ANTHROPIC_API_KEY = '';
      
      const models = felixAI.getAvailableModels();
      const anthropicModels = models.filter(m => m.provider === 'anthropic');
      
      expect(anthropicModels.every(model => !model.available)).toBe(true);
    });
  });

  describe('Response Generation - OpenAI', () => {
    const mockMessages: FelixMessage[] = [
      {
        role: 'user',
        content: 'How can I improve my HVAC business marketing?',
        timestamp: new Date()
      }
    ];

    const mockOpenAIResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            message: "Focus on seasonal maintenance campaigns and customer education content.",
            suggestions: [
              {
                id: "seasonal-campaign",
                title: "Create Seasonal Campaign",
                description: "Develop winter prep content",
                category: "social",
                route: "/social"
              }
            ],
            quickActions: [
              {
                id: "create-post",
                label: "Create Post",
                icon: "PlusCircle",
                action: "create-social-post"
              }
            ]
          })
        }
      }]
    };

    beforeEach(() => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockOpenAIResponse);
    });

    it('should generate response using GPT-5 by default', async () => {
      const response = await felixAI.generateResponse(mockMessages, mockContext);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-5',
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user', content: mockMessages[0].content })
        ]),
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      expect(response.message).toContain('seasonal maintenance campaigns');
      expect(response.suggestions).toHaveLength(1);
      expect(response.quickActions).toHaveLength(1);
    });

    it('should use GPT-4o when specified', async () => {
      await felixAI.generateResponse(mockMessages, mockContext, 'gpt-4o');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gpt-4o' })
      );
    });

    it('should include context in system message', async () => {
      await felixAI.generateResponse(mockMessages, mockContext);

      const systemMessages = mockOpenAI.chat.completions.create.mock.calls[0][0].messages
        .filter((msg: any) => msg.role === 'system');

      expect(systemMessages).toHaveLength(2);
      expect(systemMessages[1].content).toContain('John Doe');
      expect(systemMessages[1].content).toContain('active plan');
      expect(systemMessages[1].content).toContain('5 leads');
      expect(systemMessages[1].content).toContain('12 social posts');
    });

    it('should handle malformed JSON response gracefully', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Invalid JSON response' } }]
      });

      const response = await felixAI.generateResponse(mockMessages, mockContext);

      expect(response.message).toBe("I'm here to help with your field service marketing!");
      expect(response.suggestions).toBeDefined();
      expect(response.quickActions).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const response = await felixAI.generateResponse(mockMessages, mockContext);

      expect(response.message).toContain('Hi John!');
      expect(response.suggestions).toBeDefined();
      expect(response.quickActions).toBeDefined();
      expect(response.insights).toBeDefined();
    });

    it('should handle empty API response', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: null } }]
      });

      const response = await felixAI.generateResponse(mockMessages, mockContext);

      expect(response.message).toBe("I'm here to help with your field service marketing!");
    });
  });

  describe('Response Generation - Anthropic', () => {
    const mockMessages: FelixMessage[] = [
      {
        role: 'user',
        content: 'Help me with lead management',
        timestamp: new Date()
      }
    ];

    const mockAnthropicResponse = {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          message: "Let me help you optimize your lead management process.",
          suggestions: [
            {
              id: "lead-scoring",
              title: "Implement Lead Scoring",
              description: "Prioritize high-value leads",
              category: "leads"
            }
          ]
        })
      }]
    };

    beforeEach(() => {
      mockAnthropic.messages.create.mockResolvedValue(mockAnthropicResponse);
    });

    it('should generate response using Claude Sonnet', async () => {
      const response = await felixAI.generateResponse(
        mockMessages, 
        mockContext, 
        'claude-sonnet-4'
      );

      expect(mockAnthropic.messages.create).toHaveBeenCalledWith({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.7,
        system: expect.stringContaining('field service business'),
        messages: expect.arrayContaining([
          expect.objectContaining({ 
            role: 'user', 
            content: mockMessages[0].content 
          })
        ])
      });

      expect(response.message).toContain('lead management process');
      expect(response.suggestions).toHaveLength(1);
    });

    it('should use Claude Haiku when specified', async () => {
      await felixAI.generateResponse(
        mockMessages, 
        mockContext, 
        'claude-haiku-3.5'
      );

      expect(mockAnthropic.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({ 
          model: 'claude-3-5-haiku-20241022' 
        })
      );
    });

    it('should handle non-JSON Anthropic responses', async () => {
      mockAnthropic.messages.create.mockResolvedValue({
        content: [{
          type: 'text' as const,
          text: 'Plain text response without JSON'
        }]
      });

      const response = await felixAI.generateResponse(
        mockMessages, 
        mockContext, 
        'claude-sonnet-4'
      );

      expect(response.message).toBe('Plain text response without JSON');
      expect(response.suggestions).toBeDefined();
    });

    it('should extract JSON from mixed content', async () => {
      mockAnthropic.messages.create.mockResolvedValue({
        content: [{
          type: 'text' as const,
          text: 'Here is my response: {"message": "Extracted JSON", "suggestions": []}'
        }]
      });

      const response = await felixAI.generateResponse(
        mockMessages, 
        mockContext, 
        'claude-sonnet-4'
      );

      expect(response.message).toBe('Extracted JSON');
    });

    it('should handle Anthropic API errors', async () => {
      mockAnthropic.messages.create.mockRejectedValue(new Error('Anthropic API Error'));

      const response = await felixAI.generateResponse(
        mockMessages, 
        mockContext, 
        'claude-sonnet-4'
      );

      expect(response.message).toContain('Hi John!');
    });
  });

  describe('Model Availability Errors', () => {
    it('should throw error when model is not available', async () => {
      process.env.OPENAI_API_KEY = '';

      await expect(
        felixAI.generateResponse([], mockContext, 'gpt-5')
      ).rejects.toThrow('Model gpt-5 is not available');
    });

    it('should throw error when provider is not available', async () => {
      process.env.ANTHROPIC_API_KEY = '';

      await expect(
        felixAI.generateResponse([], mockContext, 'claude-sonnet-4')
      ).rejects.toThrow('Provider for model claude-sonnet-4 is not available');
    });
  });

  describe('Contextual Suggestions', () => {
    it('should provide context-specific suggestions for social page', () => {
      const socialContext: FelixContext = {
        ...mockContext,
        currentPage: '/social'
      };

      const suggestions = felixAI['getDefaultSuggestions'](socialContext);

      expect(suggestions[0].id).toBe('content-ideas');
      expect(suggestions[0].title).toBe('Get Content Ideas');
      expect(suggestions[0].category).toBe('content');
    });

    it('should provide general suggestions for other pages', () => {
      const generalContext: FelixContext = {
        ...mockContext,
        currentPage: '/analytics'
      };

      const suggestions = felixAI['getDefaultSuggestions'](generalContext);

      expect(suggestions.map(s => s.id)).toContain('social-content');
      expect(suggestions.map(s => s.id)).toContain('lead-management');
      expect(suggestions.map(s => s.id)).toContain('review-monitoring');
    });
  });

  describe('Business Insights Generation', () => {
    it('should generate productivity insights for leads', () => {
      const insights = felixAI.buildInsights(mockContext);

      const productivityInsight = insights.find(i => i.type === 'productivity');
      expect(productivityInsight).toBeDefined();
      expect(productivityInsight?.message).toContain('40% more leads');
      expect(productivityInsight?.priority).toBe('high');
    });

    it('should generate marketing insights for low social posts', () => {
      const lowSocialContext: FelixContext = {
        ...mockContext,
        businessData: {
          ...mockContext.businessData!,
          socialPosts: 3
        }
      };

      const insights = felixAI.buildInsights(lowSocialContext);

      const marketingInsight = insights.find(i => i.type === 'marketing');
      expect(marketingInsight).toBeDefined();
      expect(marketingInsight?.message).toContain('3 posts');
      expect(marketingInsight?.impact).toContain('67%');
    });

    it('should generate lead insights for high lead count', () => {
      const highLeadContext: FelixContext = {
        ...mockContext,
        businessData: {
          ...mockContext.businessData!,
          leads: 10
        }
      };

      const insights = felixAI.buildInsights(highLeadContext);

      const leadInsight = insights.find(i => i.type === 'leads');
      expect(leadInsight).toBeDefined();
      expect(leadInsight?.message).toContain('10 active leads');
      expect(leadInsight?.impact).toContain('900%');
    });

    it('should generate growth insights for reviews', () => {
      const highReviewContext: FelixContext = {
        ...mockContext,
        businessData: {
          ...mockContext.businessData!,
          reviews: 15
        }
      };

      const insights = felixAI.buildInsights(highReviewContext);

      const growthInsight = insights.find(i => i.type === 'growth');
      expect(growthInsight).toBeDefined();
      expect(growthInsight?.message).toContain('15 reviews');
      expect(growthInsight?.impact).toContain('31%');
    });

    it('should limit insights to maximum of 2', () => {
      const richDataContext: FelixContext = {
        ...mockContext,
        businessData: {
          leads: 10,
          socialPosts: 3,
          reviews: 15,
          keywords: 20
        }
      };

      const insights = felixAI.buildInsights(richDataContext);
      expect(insights.length).toBeLessThanOrEqual(2);
    });

    it('should return empty insights when no business data', () => {
      const noDataContext: FelixContext = {
        ...mockContext,
        businessData: undefined
      };

      const insights = felixAI.buildInsights(noDataContext);
      expect(insights).toHaveLength(0);
    });
  });

  describe('Content Generation', () => {
    const mockContentResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            ideas: [
              'Winter heating system maintenance checklist',
              'Signs your furnace needs professional service',
              'Energy-saving tips for cold weather'
            ]
          })
        }
      }]
    };

    beforeEach(() => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockContentResponse);
    });

    it('should generate content ideas for business type', async () => {
      const ideas = await felixAI.generateContentIdeas('HVAC');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-5',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('HVAC field service business')
          }),
          expect.objectContaining({
            role: 'user',
            content: 'Generate 5 diverse content ideas'
          })
        ]),
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      expect(ideas).toHaveLength(3);
      expect(ideas[0]).toContain('Winter heating system');
    });

    it('should generate content ideas for specific topic', async () => {
      await felixAI.generateContentIdeas('HVAC', 'energy efficiency');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: 'Generate content ideas about: energy efficiency'
            })
          ])
        })
      );
    });

    it('should return fallback ideas on API error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const ideas = await felixAI.generateContentIdeas('HVAC');

      expect(ideas).toHaveLength(5);
      expect(ideas[0]).toContain('before/after photo');
      expect(ideas[1]).toContain('maintenance tips');
    });
  });

  describe('Social Post Generation', () => {
    const mockPostResponse = {
      choices: [{
        message: {
          content: 'Keep your home warm this winter! 🏠❄️ Schedule your heating system maintenance today. Our certified technicians ensure optimal performance and energy efficiency. #HVAC #WinterMaintenance #EnergyEfficient'
        }
      }]
    };

    beforeEach(() => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockPostResponse);
    });

    it('should generate social media post', async () => {
      const post = await felixAI.generateSocialPost(
        'winter heating maintenance tips',
        'facebook',
        'HVAC'
      );

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-5',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('facebook content for a HVAC field service business')
          }),
          expect.objectContaining({
            role: 'user',
            content: 'winter heating maintenance tips'
          })
        ]),
        temperature: 0.7,
      });

      expect(post).toContain('Keep your home warm');
      expect(post).toContain('#HVAC');
    });

    it('should return fallback content on error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const post = await felixAI.generateSocialPost('test', 'twitter', 'HVAC');

      expect(post).toContain('Thanks for choosing our professional field service team');
      expect(post).toContain('#FieldService');
    });
  });

  describe('Lead Analysis', () => {
    const mockLeadData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0123',
      message: 'Need urgent furnace repair',
      source: 'google',
      urgency: 'high'
    };

    const mockAnalysisResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            score: 85,
            recommendations: [
              'Respond within 1 hour due to urgency',
              'Prepare emergency repair toolkit',
              'Confirm availability for same-day service'
            ],
            nextActions: [
              'Call immediately to assess situation',
              'Schedule emergency visit if needed',
              'Send follow-up text with ETA'
            ]
          })
        }
      }]
    };

    beforeEach(() => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockAnalysisResponse);
    });

    it('should analyze lead data and provide recommendations', async () => {
      const analysis = await felixAI.analyzeLead(mockLeadData);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-5',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('lead score (1-100)')
          }),
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining(JSON.stringify(mockLeadData))
          })
        ]),
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      expect(analysis.score).toBe(85);
      expect(analysis.recommendations).toHaveLength(3);
      expect(analysis.nextActions).toHaveLength(3);
      expect(analysis.recommendations[0]).toContain('1 hour');
    });

    it('should return fallback analysis on error', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('Analysis Error'));

      const analysis = await felixAI.analyzeLead(mockLeadData);

      expect(analysis.score).toBe(50);
      expect(analysis.recommendations).toContain('Follow up promptly');
      expect(analysis.nextActions).toContain('Make initial contact');
    });

    it('should handle malformed analysis response', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Invalid JSON' } }]
      });

      const analysis = await felixAI.analyzeLead(mockLeadData);

      expect(analysis.score).toBe(50);
      expect(analysis.recommendations).toBeDefined();
      expect(analysis.nextActions).toBeDefined();
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle network timeouts gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      
      mockOpenAI.chat.completions.create.mockRejectedValue(timeoutError);

      const response = await felixAI.generateResponse([], mockContext);

      expect(response.message).toContain('Hi John!');
      expect(response).toHaveProperty('suggestions');
      expect(response).toHaveProperty('quickActions');
    });

    it('should handle rate limiting errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.name = 'RateLimitError';
      
      mockOpenAI.chat.completions.create.mockRejectedValue(rateLimitError);

      const response = await felixAI.generateResponse([], mockContext);

      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('suggestions');
    });

    it('should handle invalid model selection gracefully', async () => {
      await expect(
        felixAI.generateResponse([], mockContext, 'invalid-model' as AIModel)
      ).rejects.toThrow('Model invalid-model is not available');
    });
  });

  describe('Performance and Optimization', () => {
    it('should use appropriate token limits for different models', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: '{}' } }]
      });

      await felixAI.generateResponse([], mockContext, 'gpt-5');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({ max_tokens: 1000 })
      );
    });

    it('should use different token limits for Anthropic models', async () => {
      mockAnthropic.messages.create.mockResolvedValue({
        content: [{ type: 'text', text: '{}' }]
      });

      await felixAI.generateResponse([], mockContext, 'claude-sonnet-4');

      expect(mockAnthropic.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({ max_tokens: 1500 })
      );
    });

    it('should use appropriate temperature settings', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: '{}' } }]
      });

      await felixAI.generateResponse([], mockContext);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({ temperature: 0.7 })
      );
    });
  });
});