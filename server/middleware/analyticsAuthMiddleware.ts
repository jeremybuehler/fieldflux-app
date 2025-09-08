import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { logger } from '../lib/logger';
import { asyncHandler, UnauthorizedError, ForbiddenError } from '../lib/errors';
import { rateLimiter, createDynamicRateLimiter } from '../lib/rate-limit';
import crypto from 'crypto';

// Analytics-specific authentication interface
export interface AnalyticsAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    emailVerified: boolean;
    tenantId?: string;
    sessionId?: string;
    analyticsScopes?: string[];
    claims: any;
  };
  analyticsContext?: {
    accessLevel: 'viewer' | 'analyst' | 'admin' | 'owner';
    dataScope: 'limited' | 'standard' | 'full';
    allowedMetrics: string[];
    allowedPeriods: string[];
    apiQuota: number;
    rateLimitMultiplier: number;
  };
  auditLog?: {
    endpoint: string;
    action: string;
    resourceId?: string;
    metadata?: Record<string, any>;
  };
}

// Analytics permission scopes
export const ANALYTICS_SCOPES = {
  READ_METRICS: 'analytics:read:metrics',
  READ_TRAFFIC: 'analytics:read:traffic',
  READ_PAGES: 'analytics:read:pages',
  READ_LOCATIONS: 'analytics:read:locations',
  READ_DEVICES: 'analytics:read:devices',
  READ_REALTIME: 'analytics:read:realtime',
  READ_KEYWORDS: 'analytics:read:keywords',
  READ_REVIEWS: 'analytics:read:reviews',
  GENERATE_REPORTS: 'analytics:generate:reports',
  EXPORT_DATA: 'analytics:export:data',
  ADMIN_CONFIG: 'analytics:admin:config',
  FULL_ACCESS: 'analytics:*'
} as const;

// Access level configurations
const ACCESS_LEVEL_CONFIG = {
  viewer: {
    dataScope: 'limited' as const,
    allowedMetrics: ['sessions', 'pageviews', 'users'],
    allowedPeriods: ['7d', '30d'],
    apiQuota: 100,
    rateLimitMultiplier: 1,
    scopes: [
      ANALYTICS_SCOPES.READ_METRICS,
      ANALYTICS_SCOPES.READ_TRAFFIC,
      ANALYTICS_SCOPES.READ_PAGES
    ]
  },
  analyst: {
    dataScope: 'standard' as const,
    allowedMetrics: ['all'],
    allowedPeriods: ['7d', '30d', '90d'],
    apiQuota: 500,
    rateLimitMultiplier: 2,
    scopes: [
      ANALYTICS_SCOPES.READ_METRICS,
      ANALYTICS_SCOPES.READ_TRAFFIC,
      ANALYTICS_SCOPES.READ_PAGES,
      ANALYTICS_SCOPES.READ_LOCATIONS,
      ANALYTICS_SCOPES.READ_DEVICES,
      ANALYTICS_SCOPES.READ_KEYWORDS,
      ANALYTICS_SCOPES.GENERATE_REPORTS
    ]
  },
  admin: {
    dataScope: 'full' as const,
    allowedMetrics: ['all'],
    allowedPeriods: ['all'],
    apiQuota: 2000,
    rateLimitMultiplier: 5,
    scopes: [
      ANALYTICS_SCOPES.READ_METRICS,
      ANALYTICS_SCOPES.READ_TRAFFIC,
      ANALYTICS_SCOPES.READ_PAGES,
      ANALYTICS_SCOPES.READ_LOCATIONS,
      ANALYTICS_SCOPES.READ_DEVICES,
      ANALYTICS_SCOPES.READ_REALTIME,
      ANALYTICS_SCOPES.READ_KEYWORDS,
      ANALYTICS_SCOPES.READ_REVIEWS,
      ANALYTICS_SCOPES.GENERATE_REPORTS,
      ANALYTICS_SCOPES.EXPORT_DATA
    ]
  },
  owner: {
    dataScope: 'full' as const,
    allowedMetrics: ['all'],
    allowedPeriods: ['all'],
    apiQuota: 10000,
    rateLimitMultiplier: 10,
    scopes: [ANALYTICS_SCOPES.FULL_ACCESS]
  }
};

/**
 * Enhanced JWT validation for analytics endpoints
 */
export const authenticateAnalyticsJWT = asyncHandler(async (
  req: AnalyticsAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const correlationId = (req as any).correlationId || crypto.randomUUID();
  
  // Extract token from multiple sources
  let token = '';
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.analytics_token) {
    token = req.cookies.analytics_token;
  } else if (apiKey) {
    // Support API key authentication for programmatic access
    token = await validateApiKey(apiKey);
  }
  
  if (!token) {
    logger.warn('Analytics access attempted without authentication', {
      correlationId,
      ip: req.ip,
      endpoint: req.path,
      userAgent: req.headers['user-agent']
    });
    throw new UnauthorizedError('Analytics authentication required');
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    
    // Verify JWT with additional security checks
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'fieldflux',
      audience: 'fieldflux-analytics',
      algorithms: ['HS256'],
      maxAge: '24h'
    }) as any;
    
    // Validate token claims
    if (!decoded.sub || !decoded.email) {
      throw new UnauthorizedError('Invalid token claims');
    }
    
    // Check token revocation
    const isRevoked = await checkTokenRevocation(decoded.jti);
    if (isRevoked) {
      throw new UnauthorizedError('Token has been revoked');
    }
    
    // Validate user exists and is active
    const user = await storage.getUser(decoded.sub);
    if (!user || !user.isActive) {
      logger.warn('Invalid user attempted analytics access', {
        correlationId,
        userId: decoded.sub,
        email: decoded.email
      });
      throw new UnauthorizedError('User not found or deactivated');
    }
    
    // Check if user has analytics access
    if (!user.analyticsEnabled) {
      throw new ForbiddenError('Analytics access not enabled for this user');
    }
    
    // Validate session if present
    if (decoded.sessionId) {
      const session = await storage.getSession(decoded.sessionId);
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedError('Session expired');
      }
      
      // Check for suspicious session activity
      const sessionActivity = await checkSessionActivity(decoded.sessionId);
      if (sessionActivity.suspicious) {
        logger.warn('Suspicious session activity detected', {
          correlationId,
          sessionId: decoded.sessionId,
          userId: decoded.sub,
          activity: sessionActivity
        });
        await revokeSession(decoded.sessionId);
        throw new UnauthorizedError('Session security violation');
      }
    }
    
    // Determine analytics access level
    const accessLevel = await determineAnalyticsAccessLevel(user, decoded);
    const accessConfig = ACCESS_LEVEL_CONFIG[accessLevel];
    
    // Attach user and analytics context to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      emailVerified: decoded.emailVerified,
      tenantId: decoded.tenantId,
      sessionId: decoded.sessionId,
      analyticsScopes: accessConfig.scopes,
      claims: decoded
    };
    
    req.analyticsContext = {
      accessLevel,
      dataScope: accessConfig.dataScope,
      allowedMetrics: accessConfig.allowedMetrics,
      allowedPeriods: accessConfig.allowedPeriods,
      apiQuota: accessConfig.apiQuota,
      rateLimitMultiplier: accessConfig.rateLimitMultiplier
    };
    
    // Setup audit logging context
    req.auditLog = {
      endpoint: req.path,
      action: req.method,
      metadata: {
        userId: req.user.id,
        accessLevel,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    };
    
    logger.info('Analytics authentication successful', {
      correlationId,
      userId: req.user.id,
      email: req.user.email,
      accessLevel,
      endpoint: req.path
    });
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid analytics JWT', {
        correlationId,
        error: error.message,
        ip: req.ip
      });
      throw new UnauthorizedError('Invalid analytics access token');
    } else if (error instanceof jwt.TokenExpiredError) {
      logger.info('Expired analytics JWT', {
        correlationId,
        expiredAt: error.expiredAt,
        ip: req.ip
      });
      throw new UnauthorizedError('Analytics access token expired');
    } else {
      throw error;
    }
  }
});

/**
 * Require specific analytics scope
 */
export const requireAnalyticsScope = (requiredScope: string) => {
  return asyncHandler(async (req: AnalyticsAuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId || crypto.randomUUID();
    
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    
    const userScopes = req.user.analyticsScopes || [];
    
    // Check for full access
    if (userScopes.includes(ANALYTICS_SCOPES.FULL_ACCESS)) {
      return next();
    }
    
    // Check for specific scope
    if (!userScopes.includes(requiredScope)) {
      logger.warn('User lacks required analytics scope', {
        correlationId,
        userId: req.user.id,
        requiredScope,
        userScopes,
        endpoint: req.path
      });
      
      throw new ForbiddenError(`Required scope: ${requiredScope}`);
    }
    
    logger.debug('Analytics scope authorization successful', {
      correlationId,
      userId: req.user.id,
      scope: requiredScope
    });
    
    next();
  });
};

/**
 * Validate period parameter based on access level
 */
export const validateAnalyticsPeriod = asyncHandler(async (
  req: AnalyticsAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const period = req.query.period as string;
  
  if (!period) {
    return next();
  }
  
  if (!req.analyticsContext) {
    throw new UnauthorizedError('Analytics context not initialized');
  }
  
  const allowedPeriods = req.analyticsContext.allowedPeriods;
  
  if (!allowedPeriods.includes('all') && !allowedPeriods.includes(period)) {
    throw new ForbiddenError(`Period '${period}' not allowed for your access level`);
  }
  
  next();
});

/**
 * Dynamic rate limiting based on access level
 */
export const analyticsRateLimiter = asyncHandler(async (
  req: AnalyticsAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.analyticsContext) {
    // Apply strict rate limit for unauthenticated requests
    return rateLimiter(req, res, next);
  }
  
  const multiplier = req.analyticsContext.rateLimitMultiplier;
  
  // Create dynamic rate limiter based on access level
  const dynamicLimiter = createDynamicRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 * multiplier,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many analytics requests, please try again later',
    keyGenerator: (req) => `analytics:${req.user?.id || req.ip}`
  });
  
  return dynamicLimiter(req, res, next);
});

/**
 * Audit log middleware for analytics access
 */
export const auditAnalyticsAccess = asyncHandler(async (
  req: AnalyticsAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const correlationId = (req as any).correlationId || crypto.randomUUID();
  
  // Log the access attempt
  if (req.auditLog) {
    await logAnalyticsAccess({
      ...req.auditLog,
      timestamp: new Date(),
      correlationId,
      responseStatus: res.statusCode
    });
  }
  
  // Add response interceptor for complete audit
  const originalSend = res.send;
  res.send = function(data) {
    if (req.auditLog) {
      logAnalyticsResponse({
        ...req.auditLog,
        responseStatus: res.statusCode,
        responseSize: Buffer.byteLength(JSON.stringify(data)),
        timestamp: new Date()
      });
    }
    return originalSend.call(this, data);
  };
  
  next();
});

/**
 * Data filtering based on access level
 */
export const filterAnalyticsData = asyncHandler(async (
  req: AnalyticsAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.analyticsContext) {
    return next();
  }
  
  const dataScope = req.analyticsContext.dataScope;
  
  // Intercept response to filter data based on scope
  const originalJson = res.json;
  res.json = function(data) {
    const filteredData = applyDataScopeFilter(data, dataScope);
    return originalJson.call(this, filteredData);
  };
  
  next();
});

// Helper functions

async function validateApiKey(apiKey: string): Promise<string> {
  // Validate API key and return corresponding JWT
  const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const apiKeyRecord = await storage.getApiKey(apiKeyHash);
  
  if (!apiKeyRecord || !apiKeyRecord.isActive) {
    throw new UnauthorizedError('Invalid API key');
  }
  
  // Generate JWT from API key
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
  return jwt.sign(
    {
      sub: apiKeyRecord.userId,
      email: apiKeyRecord.userEmail,
      type: 'api_key',
      jti: crypto.randomUUID()
    },
    JWT_SECRET,
    {
      issuer: 'fieldflux',
      audience: 'fieldflux-analytics',
      expiresIn: '1h'
    }
  );
}

async function checkTokenRevocation(jti: string): Promise<boolean> {
  // Check if token has been revoked
  const revoked = await storage.isTokenRevoked(jti);
  return revoked;
}

async function checkSessionActivity(sessionId: string): Promise<any> {
  // Check for suspicious session activity
  const recentActivity = await storage.getSessionActivity(sessionId);
  
  const suspiciousIndicators = {
    rapidLocationChanges: false,
    unusualAccessPatterns: false,
    concurrentSessions: false,
    suspicious: false
  };
  
  // Check for rapid location changes
  if (recentActivity.locations && recentActivity.locations.length > 5) {
    suspiciousIndicators.rapidLocationChanges = true;
    suspiciousIndicators.suspicious = true;
  }
  
  // Check for unusual access patterns
  if (recentActivity.requestCount > 1000) {
    suspiciousIndicators.unusualAccessPatterns = true;
    suspiciousIndicators.suspicious = true;
  }
  
  return suspiciousIndicators;
}

async function revokeSession(sessionId: string): Promise<void> {
  await storage.revokeSession(sessionId);
  logger.warn('Session revoked due to security violation', { sessionId });
}

async function determineAnalyticsAccessLevel(user: any, token: any): Promise<'viewer' | 'analyst' | 'admin' | 'owner'> {
  // Determine access level based on user role and subscription
  if (user.role === 'owner' || token.analyticsRole === 'owner') {
    return 'owner';
  }
  
  if (user.role === 'admin' || token.analyticsRole === 'admin') {
    return 'admin';
  }
  
  if (user.subscriptionPlan === 'professional' || user.subscriptionPlan === 'enterprise') {
    return 'analyst';
  }
  
  return 'viewer';
}

async function logAnalyticsAccess(logEntry: any): Promise<void> {
  // Log analytics access for audit trail
  await storage.logAnalyticsAccess(logEntry);
  
  logger.info('Analytics access logged', {
    userId: logEntry.metadata?.userId,
    endpoint: logEntry.endpoint,
    action: logEntry.action
  });
}

async function logAnalyticsResponse(logEntry: any): Promise<void> {
  // Log analytics response for complete audit
  if (logEntry.responseStatus >= 400) {
    logger.warn('Analytics request failed', logEntry);
  }
}

function applyDataScopeFilter(data: any, scope: string): any {
  // Filter data based on access scope
  if (scope === 'full') {
    return data;
  }
  
  if (scope === 'limited') {
    // Remove sensitive fields for limited scope
    if (Array.isArray(data)) {
      return data.map(item => filterSensitiveFields(item));
    }
    return filterSensitiveFields(data);
  }
  
  return data;
}

function filterSensitiveFields(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const filtered = { ...obj };
  const sensitiveFields = ['revenue', 'cost', 'profit', 'email', 'phone', 'address'];
  
  sensitiveFields.forEach(field => {
    if (field in filtered) {
      delete filtered[field];
    }
  });
  
  return filtered;
}

export default {
  authenticateAnalyticsJWT,
  requireAnalyticsScope,
  validateAnalyticsPeriod,
  analyticsRateLimiter,
  auditAnalyticsAccess,
  filterAnalyticsData,
  ANALYTICS_SCOPES
};