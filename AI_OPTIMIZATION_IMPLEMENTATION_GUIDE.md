# AI Optimization Implementation Guide
*Practical 30-Day Implementation Plan for FieldFlux*

## Quick Wins: Immediate Cost & Performance Optimization

### 1. Model Selection Optimization (Week 1)

**Objective**: Reduce AI costs by 40% through intelligent model selection

**Implementation**:

```typescript
// server/ai-service.ts (NEW FILE)
export enum AIComplexity {
  SIMPLE = 'simple',      // Social posts, basic responses
  STANDARD = 'standard',  // Blog content, reviews  
  COMPLEX = 'complex'     // Analysis, strategic content
}

export const AI_MODEL_CONFIG = {
  [AIComplexity.SIMPLE]: {
    model: 'gpt-3.5-turbo',
    max_tokens: 500,
    temperature: 0.7,
    cost_per_token: 0.0000015  // ~70% cheaper than GPT-4o
  },
  [AIComplexity.STANDARD]: {
    model: 'gpt-4o-mini',
    max_tokens: 2000,
    temperature: 0.8,
    cost_per_token: 0.000015   // ~50% cheaper than GPT-4o
  },
  [AIComplexity.COMPLEX]: {
    model: 'gpt-4o',
    max_tokens: 4000,
    temperature: 0.9,
    cost_per_token: 0.00003
  }
};

export async function generateWithOptimalModel(
  prompt: string,
  complexity: AIComplexity,
  systemPrompt?: string
) {
  const config = AI_MODEL_CONFIG[complexity];
  
  try {
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt }
      ],
      max_tokens: config.max_tokens,
      temperature: config.temperature,
    });

    // Track usage for cost monitoring
    await trackAIUsage(config.model, completion.usage?.total_tokens || 0);
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`AI generation failed with ${config.model}:`, error);
    throw error;
  }
}
```

**Update Existing Routes**:

```typescript
// Update in server/routes.ts

// Social Media Posts (SIMPLE complexity)
app.post("/api/social/generate-post", async (req, res) => {
  try {
    const { topic, platform, tone = "professional" } = req.body;
    
    const systemPrompt = `You are a social media expert for field service businesses including HVAC, plumbing, electrical, landscaping, and pest control. Create engaging posts optimized for ${platform}. Include relevant hashtags and call-to-actions. Keep the tone ${tone} but approachable.`;
    
    const userPrompt = `Create a ${platform} post about: ${topic}. Make it engaging for field service customers. Include relevant hashtags and encourage engagement.`;
    
    const result = await generateWithOptimalModel(
      userPrompt, 
      AIComplexity.SIMPLE, 
      systemPrompt
    );
    
    const post = await storage.createSocialPost({
      platform,
      content: JSON.parse(result || '{}').content || `Check out our latest field service tips about ${topic}!`,
      status: "draft",
    });

    res.json(post);
  } catch (error) {
    console.error("Error generating social post:", error);
    res.status(500).json({ message: "Failed to generate social post" });
  }
});

// WordPress Posts (STANDARD complexity)
app.post("/api/wordpress/generate-post", async (req, res) => {
  try {
    const { topic, type = "blog" } = req.body;
    
    const systemPrompt = "You are an expert field service content writer specializing in HVAC, plumbing, electrical, landscaping, and pest control businesses. Create engaging, SEO-optimized content that helps field service businesses attract more customers and establish expertise.";
    
    const userPrompt = `Create a ${type} post about: ${topic}. Include an SEO-optimized title and comprehensive content (800-1000 words). Focus on field service industries. Make it engaging and informative for homeowners seeking professional services.`;
    
    const result = await generateWithOptimalModel(
      userPrompt,
      AIComplexity.STANDARD,
      systemPrompt
    );
    
    const parsedResult = JSON.parse(result || '{}');
    const post = await storage.createWordPressPost({
      title: parsedResult.title || `Field Service Guide: ${topic}`,
      content: parsedResult.content || `Comprehensive guide about ${topic} for field service businesses.`,
      status: "draft",
    });

    res.json(post);
  } catch (error) {
    console.error("Error generating WordPress post:", error);
    res.status(500).json({ message: "Failed to generate WordPress post" });
  }
});
```

### 2. Semantic Caching System (Week 2)

**Objective**: Reduce duplicate AI calls by 30% through intelligent caching

**Implementation**:

```typescript
// server/ai-cache.ts (NEW FILE)
import Redis from 'ioredis';
import crypto from 'crypto';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class AICache {
  private static generateCacheKey(prompt: string, model: string, temperature: number): string {
    const content = `${prompt}-${model}-${temperature}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  static async get(prompt: string, model: string, temperature: number): Promise<string | null> {
    const key = this.generateCacheKey(prompt, model, temperature);
    const cached = await redis.get(`ai_cache:${key}`);
    
    if (cached) {
      console.log(`Cache hit for model ${model}`);
      await this.trackCacheHit(model);
    }
    
    return cached;
  }

  static async set(
    prompt: string, 
    model: string, 
    temperature: number, 
    response: string,
    ttlSeconds: number = 86400 // 24 hours default
  ): Promise<void> {
    const key = this.generateCacheKey(prompt, model, temperature);
    await redis.setex(`ai_cache:${key}`, ttlSeconds, response);
  }

  static async findSimilar(prompt: string, threshold: number = 0.8): Promise<string | null> {
    // Implement semantic similarity search for related cached content
    // This is a simplified version - production would use vector embeddings
    const words = prompt.toLowerCase().split(' ');
    const pattern = `*${words.slice(0, 3).join('*')}*`;
    
    const keys = await redis.keys(`ai_cache:*${pattern}*`);
    if (keys.length > 0) {
      return await redis.get(keys[0]);
    }
    
    return null;
  }

  static async trackCacheHit(model: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await redis.incr(`cache_hits:${model}:${today}`);
  }

  static async getCacheStats(): Promise<{ hits: number; misses: number; hitRate: number }> {
    const today = new Date().toISOString().split('T')[0];
    const hits = await redis.get(`cache_hits:total:${today}`) || '0';
    const misses = await redis.get(`cache_misses:total:${today}`) || '0';
    
    const hitCount = parseInt(hits);
    const missCount = parseInt(misses);
    const total = hitCount + missCount;
    
    return {
      hits: hitCount,
      misses: missCount,
      hitRate: total > 0 ? hitCount / total : 0
    };
  }
}

// Updated AI service with caching
export async function generateWithCache(
  prompt: string,
  complexity: AIComplexity,
  systemPrompt?: string,
  cacheTimeSeconds: number = 86400
) {
  const config = AI_MODEL_CONFIG[complexity];
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
  
  // Check cache first
  const cached = await AICache.get(fullPrompt, config.model, config.temperature);
  if (cached) {
    return cached;
  }

  // Generate new content
  const result = await generateWithOptimalModel(prompt, complexity, systemPrompt);
  
  // Cache the result
  if (result) {
    await AICache.set(fullPrompt, config.model, config.temperature, result, cacheTimeSeconds);
  }
  
  return result;
}
```

### 3. Usage Monitoring & Budget Alerts (Week 3)

**Objective**: Track AI costs and prevent budget overruns

**Implementation**:

```typescript
// server/ai-monitoring.ts (NEW FILE)
export interface AIUsageMetrics {
  model: string;
  tokens: number;
  cost: number;
  timestamp: Date;
  operation_type: string;
  success: boolean;
}

export class AIMonitoring {
  static async trackUsage(metrics: AIUsageMetrics): Promise<void> {
    // Store in database
    await storage.createAIUsageMetric(metrics);
    
    // Update real-time counters
    const today = new Date().toISOString().split('T')[0];
    await redis.incrby(`ai_cost:${today}`, Math.round(metrics.cost * 10000)); // Store as 1/10000 cents
    await redis.incrby(`ai_tokens:${today}`, metrics.tokens);
    
    // Check budget alerts
    await this.checkBudgetAlerts();
  }

  static async checkBudgetAlerts(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const dailyCost = await redis.get(`ai_cost:${today}`) || '0';
    const costInDollars = parseInt(dailyCost) / 10000;
    
    const DAILY_BUDGET = parseFloat(process.env.AI_DAILY_BUDGET || '10'); // $10 default
    const ALERT_THRESHOLD = 0.8; // 80% of budget
    
    if (costInDollars > DAILY_BUDGET * ALERT_THRESHOLD) {
      await this.sendBudgetAlert(costInDollars, DAILY_BUDGET);
    }
  }

  static async sendBudgetAlert(currentCost: number, budget: number): Promise<void> {
    console.warn(`AI Budget Alert: $${currentCost.toFixed(2)} of $${budget} daily budget used`);
    
    // Could integrate with email/Slack notifications
    // await sendSlackNotification(`🚨 AI Budget Alert: ${(currentCost/budget*100).toFixed(1)}% of daily budget used`);
  }

  static async getDailyUsage(): Promise<{ cost: number; tokens: number; requests: number }> {
    const today = new Date().toISOString().split('T')[0];
    const cost = await redis.get(`ai_cost:${today}`) || '0';
    const tokens = await redis.get(`ai_tokens:${today}`) || '0';
    const requests = await redis.get(`ai_requests:${today}`) || '0';
    
    return {
      cost: parseInt(cost) / 10000,
      tokens: parseInt(tokens),
      requests: parseInt(requests)
    };
  }
}

// Add to routes.ts
app.get("/api/ai/usage-stats", async (req, res) => {
  try {
    const dailyUsage = await AIMonitoring.getDailyUsage();
    const cacheStats = await AICache.getCacheStats();
    
    res.json({
      daily_usage: dailyUsage,
      cache_performance: cacheStats,
      cost_savings: cacheStats.hitRate * dailyUsage.cost,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching AI usage stats:", error);
    res.status(500).json({ message: "Failed to fetch usage stats" });
  }
});
```

### 4. Enhanced Error Handling (Week 4)

**Objective**: Improve reliability and user experience

**Implementation**:

```typescript
// server/ai-resilience.ts (NEW FILE)
export class AIResilience {
  private static requestCounts = new Map<string, number>();
  private static lastFailures = new Map<string, Date>();

  static async executeWithResilience<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3,
    backoffMs: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Circuit breaker check
        if (this.isCircuitOpen(operationName)) {
          throw new Error(`Circuit breaker is open for ${operationName}`);
        }
        
        const result = await operation();
        
        // Success - reset failure tracking
        this.requestCounts.delete(operationName);
        this.lastFailures.delete(operationName);
        
        return result;
        
      } catch (error) {
        lastError = error as Error;
        
        // Track failure
        this.trackFailure(operationName);
        
        if (attempt === maxRetries) {
          break; // Don't wait after last attempt
        }
        
        // Exponential backoff
        const delayMs = backoffMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    // All retries failed - return fallback content
    const fallback = await this.getFallbackContent(operationName);
    if (fallback) {
      return fallback as T;
    }
    
    throw lastError!;
  }

  private static isCircuitOpen(operationName: string): boolean {
    const failureCount = this.requestCounts.get(operationName) || 0;
    const lastFailure = this.lastFailures.get(operationName);
    
    if (failureCount >= 5 && lastFailure) {
      const timeSinceLastFailure = Date.now() - lastFailure.getTime();
      const circuitOpenTime = 5 * 60 * 1000; // 5 minutes
      
      return timeSinceLastFailure < circuitOpenTime;
    }
    
    return false;
  }

  private static trackFailure(operationName: string): void {
    const currentCount = this.requestCounts.get(operationName) || 0;
    this.requestCounts.set(operationName, currentCount + 1);
    this.lastFailures.set(operationName, new Date());
  }

  private static async getFallbackContent(operationType: string): Promise<string | null> {
    const fallbacks = {
      'social-post': 'Thanks for your interest! Contact us for professional field service solutions.',
      'blog-post': 'Stay tuned for expert field service tips and insights.',
      'review-response': 'Thank you for your feedback! We appreciate your business and will use your input to improve our services.',
      'seo-analysis': 'SEO analysis temporarily unavailable. Please try again later.'
    };
    
    return fallbacks[operationType as keyof typeof fallbacks] || null;
  }
}

// Updated AI service with resilience
export async function generateWithResilience(
  prompt: string,
  complexity: AIComplexity,
  operationType: string,
  systemPrompt?: string
) {
  return await AIResilience.executeWithResilience(
    async () => {
      return await generateWithCache(prompt, complexity, systemPrompt);
    },
    operationType,
    3, // maxRetries
    1000 // backoffMs
  );
}
```

## Environment Configuration Updates

Add to your `.env` file:

```bash
# AI Optimization Configuration
AI_DAILY_BUDGET=15.00
AI_CACHE_TTL_SECONDS=86400
REDIS_URL=redis://localhost:6379

# Model Selection Preferences
AI_DEFAULT_COMPLEXITY=standard
AI_ENABLE_CACHING=true
AI_ENABLE_MONITORING=true
```

## Database Schema Updates

Add to `shared/schema.ts`:

```typescript
export const aiUsageMetrics = pgTable("ai_usage_metrics", {
  id: serial("id").primaryKey(),
  model: text("model").notNull(),
  tokens: integer("tokens").notNull(),
  cost: real("cost").notNull(),
  operationType: text("operation_type").notNull(),
  success: integer("success").notNull(), // 1 = success, 0 = failure
  responseTime: integer("response_time"), // milliseconds
  cacheHit: integer("cache_hit").default(0), // 1 = cache hit
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAIUsageMetricSchema = createInsertSchema(aiUsageMetrics).omit({
  id: true,
  createdAt: true,
});
```

## Quick Implementation Checklist

- [ ] **Week 1**: Deploy model selection optimization
- [ ] **Week 2**: Implement semantic caching with Redis
- [ ] **Week 3**: Add usage monitoring and budget alerts
- [ ] **Week 4**: Deploy enhanced error handling and fallbacks
- [ ] **Testing**: Validate 40% cost reduction and improved reliability
- [ ] **Monitoring**: Set up dashboards for AI performance tracking
- [ ] **Documentation**: Update API documentation with new capabilities

## Expected Results After 30 Days

- **Cost Reduction**: 40-50% lower AI service costs
- **Reliability**: 99.5% uptime for AI-powered features
- **Performance**: 70% cache hit rate, faster response times
- **Monitoring**: Complete visibility into AI usage and costs
- **Quality**: Maintained content quality with improved consistency

This implementation guide provides immediate, actionable improvements that can be deployed incrementally while maintaining system stability and user experience.