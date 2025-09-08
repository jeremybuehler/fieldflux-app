import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler, UnauthorizedError, ForbiddenError } from '../lib/errors';
import { logger } from '../lib/logger';
import { storage } from '../storage';

/**
 * Simplified analytics authentication middleware for immediate deployment
 * This provides basic JWT validation and scope checking for analytics endpoints
 */

export interface SimpleAnalyticsRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    emailVerified?: boolean;
    tenantId?: string;
    role?: string;
    claims?: any;
  };
}

// Simple analytics scopes
export const SIMPLE_ANALYTICS_SCOPES = {
  READ_METRICS: 'analytics:read:metrics',
  READ_TRAFFIC: 'analytics:read:traffic', 
  READ_PAGES: 'analytics:read:pages',
  READ_LOCATIONS: 'analytics:read:locations',
  READ_DEVICES: 'analytics:read:devices',
  READ_REALTIME: 'analytics:read:realtime',
  READ_KEYWORDS: 'analytics:read:keywords',
  READ_REVIEWS: 'analytics:read:reviews',
  GENERATE_REPORTS: 'analytics:generate:reports',
  ADMIN_CONFIG: 'analytics:admin:config'
} as const;

/**
 * Basic JWT authentication for analytics endpoints
 * Uses the standard JWT authentication from the existing system
 */
export const simpleAnalyticsAuth = asyncHandler(async (
  req: SimpleAnalyticsRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract token from Authorization header
  let token = '';
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  
  if (!token) {
    throw new UnauthorizedError('Analytics access requires authentication');
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded.sub) {
      throw new UnauthorizedError('Invalid token structure');
    }
    
    // Get user from storage to verify they exist and are active
    const user = await storage.getUser(decoded.sub);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    // Check if user is active (if field exists)
    const isActive = (user as any).isActive !== false; // Default to true if field doesn't exist
    if (!isActive) {
      throw new UnauthorizedError('User account is deactivated');
    }
    
    // Attach user to request
    req.user = {
      id: decoded.sub,
      email: decoded.email || user.email || '',
      firstName: decoded.firstName || user.firstName || undefined,
      lastName: decoded.lastName || user.lastName || undefined,
      emailVerified: decoded.emailVerified || (user as any).emailVerified || false,
      tenantId: decoded.tenantId,
      role: decoded.role || (user as any).role || 'member',
      claims: decoded
    };
    
    logger.info('Analytics authentication successful', {
      userId: req.user.id,
      email: req.user.email,
      endpoint: req.path
    });
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid authentication token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Authentication token expired');
    } else {
      throw error;
    }
  }
});

/**
 * Check if user has required scope (simplified role-based checking)
 */
export const requireAnalyticsScope = (requiredScope: string) => {
  return asyncHandler(async (req: SimpleAnalyticsRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    
    const userRole = req.user.role || 'member';
    
    // Owner and admin roles have all permissions
    if (userRole === 'owner' || userRole === 'admin') {
      return next();
    }
    
    // Basic scope checking based on role
    const allowedScopes = getRoleScopesSimple(userRole);
    
    if (!allowedScopes.includes(requiredScope)) {
      logger.warn('User lacks required analytics scope', {
        userId: req.user.id,
        userRole,
        requiredScope,
        endpoint: req.path
      });
      
      throw new ForbiddenError('Insufficient permissions for analytics access');
    }
    
    next();
  });
};

/**
 * Basic analytics access logging
 */
export const logAnalyticsAccess = asyncHandler(async (
  req: SimpleAnalyticsRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  
  // Log the request
  logger.info('Analytics endpoint accessed', {
    userId: req.user?.id,
    endpoint: req.path,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });
  
  // Intercept response to log completion
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    logger.info('Analytics request completed', {
      userId: req.user?.id,
      endpoint: req.path,
      status: res.statusCode,
      duration,
      responseSize: Buffer.byteLength(data || '')
    });
    
    return originalSend.call(this, data);
  };
  
  next();
});

/**
 * Get allowed scopes for a role (simplified)
 */
function getRoleScopesSimple(role: string): string[] {
  const scopeMap: Record<string, string[]> = {
    viewer: [
      SIMPLE_ANALYTICS_SCOPES.READ_METRICS,
      SIMPLE_ANALYTICS_SCOPES.READ_TRAFFIC,
      SIMPLE_ANALYTICS_SCOPES.READ_PAGES
    ],
    member: [
      SIMPLE_ANALYTICS_SCOPES.READ_METRICS,
      SIMPLE_ANALYTICS_SCOPES.READ_TRAFFIC,
      SIMPLE_ANALYTICS_SCOPES.READ_PAGES,
      SIMPLE_ANALYTICS_SCOPES.READ_LOCATIONS,
      SIMPLE_ANALYTICS_SCOPES.READ_DEVICES,
      SIMPLE_ANALYTICS_SCOPES.READ_KEYWORDS
    ],
    admin: [
      SIMPLE_ANALYTICS_SCOPES.READ_METRICS,
      SIMPLE_ANALYTICS_SCOPES.READ_TRAFFIC,
      SIMPLE_ANALYTICS_SCOPES.READ_PAGES,
      SIMPLE_ANALYTICS_SCOPES.READ_LOCATIONS,
      SIMPLE_ANALYTICS_SCOPES.READ_DEVICES,
      SIMPLE_ANALYTICS_SCOPES.READ_REALTIME,
      SIMPLE_ANALYTICS_SCOPES.READ_KEYWORDS,
      SIMPLE_ANALYTICS_SCOPES.READ_REVIEWS,
      SIMPLE_ANALYTICS_SCOPES.GENERATE_REPORTS,
      SIMPLE_ANALYTICS_SCOPES.ADMIN_CONFIG
    ],
    owner: Object.values(SIMPLE_ANALYTICS_SCOPES)
  };
  
  return scopeMap[role] || scopeMap.viewer;
}

// Export default middleware set
export const analyticsAuthMiddleware = [
  simpleAnalyticsAuth,
  logAnalyticsAccess
];

export default {
  simpleAnalyticsAuth,
  requireAnalyticsScope,
  logAnalyticsAccess,
  analyticsAuthMiddleware,
  SIMPLE_ANALYTICS_SCOPES
};