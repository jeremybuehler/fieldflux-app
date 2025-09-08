import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from './errors';
import { logger } from './logger';

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  max: number;           // Max requests per window
  message?: string;      // Custom error message
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class MemoryRateLimitStore {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    for (const [key, data] of Object.entries(this.store)) {
      if (now >= data.resetTime) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => delete this.store[key]);
  }

  get(key: string): { count: number; resetTime: number } | undefined {
    const data = this.store[key];
    if (data && Date.now() >= data.resetTime) {
      delete this.store[key];
      return undefined;
    }
    return data;
  }

  set(key: string, count: number, resetTime: number) {
    this.store[key] = { count, resetTime };
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.get(key);
    
    if (existing) {
      existing.count++;
      this.store[key] = existing;
      return existing;
    } else {
      const data = { count: 1, resetTime: now + windowMs };
      this.store[key] = data;
      return data;
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store = {};
  }
}

// Global store instance
const store = new MemoryRateLimitStore();

// Default key generator (IP + User ID if available)
function defaultKeyGenerator(req: Request): string {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userId = (req as any).user?.id;
  return userId ? `${ip}:${userId}` : ip;
}

// Rate limit middleware factory
export function createRateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = defaultKeyGenerator
  } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const correlationId = (req as any).correlationId || 'unknown';

    // Skip if request shouldn't be counted
    if (skipSuccessfulRequests && res.statusCode < 400) {
      return next();
    }
    if (skipFailedRequests && res.statusCode >= 400) {
      return next();
    }

    const { count, resetTime } = store.increment(key, windowMs);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));
    res.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());

    if (count > max) {
      logger.warn(
        `Rate limit exceeded`,
        {
          correlationId,
          endpoint: req.path,
          method: req.method,
          ip: req.ip
        },
        {
          key,
          count,
          limit: max,
          resetTime: new Date(resetTime).toISOString()
        }
      );

      const error = new RateLimitError(message);
      return next(error);
    }

    next();
  };
}

// Predefined rate limiters for different endpoints
export const rateLimiters = {
  // General API rate limit
  general: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: 'Too many API requests, please try again in 15 minutes'
  }),

  // Strict rate limit for authentication endpoints
  auth: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again in 15 minutes'
  }),

  // Rate limit for AI content generation
  aiGeneration: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 AI requests per hour
    message: 'AI generation limit reached, please try again in an hour'
  }),

  // Rate limit for social media posting
  socialPosting: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 social posts per hour
    message: 'Social media posting limit reached, please try again in an hour'
  }),

  // Rate limit for email sending
  emailSending: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 emails per hour
    message: 'Email sending limit reached, please try again in an hour'
  }),

  // Rate limit for file uploads
  fileUpload: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 file uploads per hour
    message: 'File upload limit reached, please try again in an hour'
  }),

  // Rate limit for analytics requests (less strict)
  analytics: createRateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // 50 analytics requests per 5 minutes
    message: 'Analytics request limit reached, please try again in 5 minutes',
    skipSuccessfulRequests: true // Only count failed requests
  }),

  // Very strict rate limit for password resets
  passwordReset: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Only 3 password reset attempts per hour
    message: 'Password reset limit reached, please try again in an hour'
  }),

  // Per-tenant rate limiting for lead creation
  leadCreation: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 leads per hour per tenant
    keyGenerator: (req) => {
      const tenantId = (req as any).tenant?.id || 'unknown';
      return `tenant:${tenantId}`;
    },
    message: 'Lead creation limit reached for your account, please try again in an hour'
  })
};

// Utility function to create custom tenant-scoped rate limiters
export function createTenantRateLimit(config: RateLimitConfig & { prefix?: string }) {
  const { prefix = 'tenant', ...rateLimitConfig } = config;
  
  return createRateLimit({
    ...rateLimitConfig,
    keyGenerator: (req) => {
      const tenantId = (req as any).tenant?.id || 'unknown';
      const baseKey = rateLimitConfig.keyGenerator?.(req) || defaultKeyGenerator(req);
      return `${prefix}:${tenantId}:${baseKey}`;
    }
  });
}

// Utility function to create user-scoped rate limiters
export function createUserRateLimit(config: RateLimitConfig & { prefix?: string }) {
  const { prefix = 'user', ...rateLimitConfig } = config;
  
  return createRateLimit({
    ...rateLimitConfig,
    keyGenerator: (req) => {
      const userId = (req as any).user?.id || 'anonymous';
      const ip = req.ip || 'unknown';
      return `${prefix}:${userId}:${ip}`;
    }
  });
}

// Rate limit bypass for development/testing
export function bypassRateLimit(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'development' && req.headers['x-bypass-rate-limit'] === 'true') {
    logger.debug('Rate limit bypassed for development', {
      correlationId: (req as any).correlationId,
      endpoint: req.path,
      method: req.method
    });
    return next();
  }
  next();
}

// Health check for rate limiting
export function getRateLimitStatus() {
  return {
    active: true,
    storeType: 'memory',
    // In production, you'd want to expose more metrics
    // like current counts, reset times, etc.
  };
}

// Create dynamic rate limiter based on config
export function createDynamicRateLimiter(config: RateLimitConfig & { 
  standardHeaders?: boolean; 
  legacyHeaders?: boolean; 
}) {
  const { standardHeaders = true, legacyHeaders = false, ...rateLimitConfig } = config;
  
  return createRateLimit({
    ...rateLimitConfig,
    keyGenerator: config.keyGenerator || defaultKeyGenerator
  });
}

// Export default rate limiter
export const rateLimiter = rateLimiters.general;

// Graceful shutdown
export function shutdownRateLimit() {
  store.destroy();
}
