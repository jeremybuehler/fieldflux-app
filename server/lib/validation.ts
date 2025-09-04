import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';
import { ValidationError } from './errors';

// Common validation schemas
export const commonSchemas = {
  // ID parameters
  id: z.string().uuid('Invalid ID format'),
  tenantId: z.string().uuid('Invalid tenant ID format'),
  
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
  }),
  
  // Time periods
  timePeriod: z.enum(['7d', '30d', '90d']).default('30d'),
  
  // Common string validations
  nonEmptyString: z.string().min(1, 'Field cannot be empty').trim(),
  email: z.string().email('Invalid email format'),
  url: z.string().url('Invalid URL format'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  
  // Social media specific
  socialPlatform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'google']),
  
  // Analytics periods
  analyticsPeriod: z.enum(['7d', '30d', '90d']).default('30d'),
  
  // File uploads
  fileUpload: z.object({
    filename: z.string().min(1),
    mimetype: z.string(),
    size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB')
  })
};

// Lead validation schemas
export const leadSchemas = {
  create: z.object({
    name: commonSchemas.nonEmptyString,
    email: commonSchemas.email,
    phone: commonSchemas.phone.optional(),
    message: z.string().max(2000).optional(),
    source: z.string().optional(),
    urgency: z.enum(['low', 'medium', 'high']).default('medium'),
    serviceNeeded: z.string().optional(),
    address: z.string().optional()
  }),
  
  update: z.object({
    name: commonSchemas.nonEmptyString.optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone.optional(),
    message: z.string().max(2000).optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
    notes: z.string().max(5000).optional()
  }),
  
  status: z.object({
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost'])
  })
};

// Social media validation schemas
export const socialSchemas = {
  config: z.object({
    platform: commonSchemas.socialPlatform,
    accessToken: commonSchemas.nonEmptyString,
    refreshToken: z.string().optional(),
    pageId: z.string().optional(),
    accountId: z.string().optional(),
    expiresAt: z.date().optional(),
    isActive: z.boolean().default(true)
  }),
  
  post: z.object({
    content: z.string().min(1).max(2200, 'Content too long'),
    platforms: z.array(commonSchemas.socialPlatform).min(1, 'Select at least one platform'),
    mediaUrls: z.array(commonSchemas.url).optional(),
    scheduledFor: z.date().optional(),
    tags: z.array(z.string()).optional()
  }),
  
  schedule: z.object({
    postId: commonSchemas.id,
    scheduledFor: z.date().refine(
      (date) => date > new Date(),
      'Scheduled time must be in the future'
    )
  })
};

// Analytics validation schemas
export const analyticsSchemas = {
  metrics: z.object({
    period: commonSchemas.analyticsPeriod
  }),
  
  report: z.object({
    period: commonSchemas.analyticsPeriod,
    includeKeywords: z.boolean().default(true),
    includeTrafficSources: z.boolean().default(true),
    includeConversions: z.boolean().default(true)
  })
};

// WordPress validation schemas
export const wordPressSchemas = {
  post: z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1).max(50000),
    excerpt: z.string().max(300).optional(),
    status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    featuredImage: commonSchemas.url.optional(),
    publishedAt: z.date().optional()
  }),
  
  config: z.object({
    siteUrl: commonSchemas.url,
    username: commonSchemas.nonEmptyString,
    password: commonSchemas.nonEmptyString,
    isActive: z.boolean().default(true)
  })
};

// Review management schemas
export const reviewSchemas = {
  reply: z.object({
    reviewId: commonSchemas.nonEmptyString,
    reply: z.string().min(1).max(1000),
    platform: z.enum(['google', 'yelp', 'facebook'])
  }),
  
  request: z.object({
    customerEmail: commonSchemas.email,
    customerName: commonSchemas.nonEmptyString,
    serviceDate: z.date(),
    message: z.string().max(500).optional(),
    followUpDays: z.number().int().min(1).max(30).default(3)
  })
};

// Felix AI schemas
export const felixSchemas = {
  chat: z.object({
    message: z.string().min(1).max(1000),
    context: z.object({
      currentPage: z.string().optional(),
      businessData: z.record(z.any()).optional()
    }).optional()
  }),
  
  contentGeneration: z.object({
    type: z.enum(['social', 'blog', 'email', 'ad']),
    topic: z.string().optional(),
    tone: z.enum(['professional', 'casual', 'friendly', 'urgent']).default('professional'),
    length: z.enum(['short', 'medium', 'long']).default('medium'),
    keywords: z.array(z.string()).optional()
  })
};

// Validation middleware factory
export function validateRequest(schemas: {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      
      // Validate URL parameters
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      
      // Validate query parameters
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      
      next();
    } catch (error) {
      next(error); // Will be handled by error middleware
    }
  };
}

// Specific validation middlewares for common endpoints
export const validators = {
  // Lead validators
  createLead: validateRequest({ body: leadSchemas.create }),
  updateLead: validateRequest({ 
    body: leadSchemas.update, 
    params: z.object({ id: commonSchemas.id }) 
  }),
  updateLeadStatus: validateRequest({ 
    body: leadSchemas.status,
    params: z.object({ id: commonSchemas.id })
  }),
  
  // Social media validators
  configureSocial: validateRequest({ body: socialSchemas.config }),
  createSocialPost: validateRequest({ body: socialSchemas.post }),
  schedulePost: validateRequest({ body: socialSchemas.schedule }),
  
  // Analytics validators
  getAnalyticsMetrics: validateRequest({ 
    query: analyticsSchemas.metrics 
  }),
  generateAnalyticsReport: validateRequest({ 
    body: analyticsSchemas.report 
  }),
  
  // WordPress validators
  createWordPressPost: validateRequest({ body: wordPressSchemas.post }),
  configureWordPress: validateRequest({ body: wordPressSchemas.config }),
  
  // Review validators
  replyToReview: validateRequest({ body: reviewSchemas.reply }),
  requestReview: validateRequest({ body: reviewSchemas.request }),
  
  // Felix AI validators
  felixChat: validateRequest({ body: felixSchemas.chat }),
  generateContent: validateRequest({ body: felixSchemas.contentGeneration }),
  
  // Common validators
  idParam: validateRequest({ 
    params: z.object({ id: commonSchemas.id }) 
  }),
  pagination: validateRequest({ 
    query: commonSchemas.pagination 
  }),
  tenantParam: validateRequest({ 
    params: z.object({ tenantId: commonSchemas.tenantId }) 
  })
};

// Custom validation helpers
export function validateEmail(email: string): boolean {
  return commonSchemas.email.safeParse(email).success;
}

export function validateUrl(url: string): boolean {
  return commonSchemas.url.safeParse(url).success;
}

export function validateUUID(id: string): boolean {
  return commonSchemas.id.safeParse(id).success;
}

// Sanitization helpers
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, '') // Basic XSS protection
    .replace(/\s+/g, ' '); // Normalize whitespace
}

export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

// File validation
export function validateFileUpload(file: any): {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
} {
  try {
    const validated = commonSchemas.fileUpload.parse(file);
    
    // Additional file type validation
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm',
      'application/pdf',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(validated.mimetype)) {
      return { valid: false, error: 'File type not allowed' };
    }
    
    // Sanitize filename
    const sanitizedName = validated.filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 100);
    
    return { valid: true, sanitizedName };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid file' 
    };
  }
}
