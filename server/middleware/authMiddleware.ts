import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { logger } from '../lib/logger';
import { asyncHandler, UnauthorizedError, ForbiddenError } from '../lib/errors';
import { authService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    emailVerified: boolean;
    tenantId?: string;
    sessionId?: string;
    claims: any;
  };
  session?: {
    id: string;
    userId: string;
    tenantId?: string;
    expiresAt: Date;
  };
}

export interface UserRole {
  role: 'owner' | 'admin' | 'member' | 'viewer';
  tenantId: string;
  permissions: string[];
}

/**
 * JWT Authentication Middleware
 * Validates JWT tokens and attaches user information to request
 */
export const authenticateJWT = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const correlationId = (req as any).correlationId || 'unknown';
  
  // Extract token from Authorization header or cookie
  let token = '';
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  
  if (!token) {
    throw new UnauthorizedError('Access token is required');
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'fieldflux',
      audience: 'fieldflux-app'
    }) as any;
    
    // Validate user still exists and is active
    const user = await storage.getUser(decoded.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or deactivated');
    }
    
    // Validate session if sessionId is present
    if (decoded.sessionId) {
      const session = await storage.getSession(decoded.sessionId);
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedError('Session expired');
      }
      
      // Update session last accessed time
      await storage.updateSession(decoded.sessionId, { lastAccessedAt: new Date() });
      
      req.session = {
        id: session.id,
        userId: session.userId,
        tenantId: session.tenantId,
        expiresAt: session.expiresAt
      };
    }
    
    // Attach user to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      emailVerified: decoded.emailVerified,
      tenantId: decoded.tenantId,
      sessionId: decoded.sessionId,
      claims: decoded
    };
    
    logger.debug('User authenticated successfully', {
      correlationId,
      userId: req.user.id,
      email: req.user.email,
      tenantId: req.user.tenantId,
      sessionId: req.user.sessionId
    });
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid access token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token expired');
    } else {
      throw error;
    }
  }
});

/**
 * Optional JWT Authentication Middleware
 * Similar to authenticateJWT but doesn't throw error if token is missing
 */
export const optionalAuthenticateJWT = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const correlationId = (req as any).correlationId || 'unknown';
  
  // Extract token from Authorization header or cookie
  let token = '';
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  
  if (!token) {
    logger.debug('No authentication token provided (optional auth)', { correlationId });
    return next();
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'fieldflux',
      audience: 'fieldflux-app'
    }) as any;
    
    // Validate user still exists and is active
    const user = await storage.getUser(decoded.sub);
    if (!user || !user.isActive) {
      logger.warn('Invalid user in optional auth', { correlationId, userId: decoded.sub });
      return next();
    }
    
    // Validate session if sessionId is present
    if (decoded.sessionId) {
      const session = await storage.getSession(decoded.sessionId);
      if (!session || session.expiresAt < new Date()) {
        logger.warn('Expired session in optional auth', { correlationId, sessionId: decoded.sessionId });
        return next();
      }
      
      req.session = {
        id: session.id,
        userId: session.userId,
        tenantId: session.tenantId,
        expiresAt: session.expiresAt
      };
    }
    
    // Attach user to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      emailVerified: decoded.emailVerified,
      tenantId: decoded.tenantId,
      sessionId: decoded.sessionId,
      claims: decoded
    };
    
    logger.debug('User optionally authenticated', {
      correlationId,
      userId: req.user.id,
      email: req.user.email
    });
    
  } catch (error) {
    logger.debug('Optional authentication failed', { correlationId }, error as Error);
  }
  
  next();
});

/**
 * Require Email Verification Middleware
 * Ensures user has verified their email address
 */
export const requireEmailVerification = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const correlationId = (req as any).correlationId || 'unknown';
  
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }
  
  if (!req.user.emailVerified) {
    logger.warn('Unverified user attempted to access protected resource', {
      correlationId,
      userId: req.user.id,
      email: req.user.email
    });
    
    throw new ForbiddenError('Email verification required');
  }
  
  next();
});

/**
 * Role-Based Access Control Middleware
 * Ensures user has required role in the current tenant
 */
export const requireRole = (requiredRoles: string | string[]) => {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  return asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId || 'unknown';
    
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    
    const tenant = (req as any).tenant;
    if (!tenant) {
      throw new ForbiddenError('Tenant context required');
    }
    
    // Get user's membership in current tenant
    const membership = await storage.getMembership(tenant.id, req.user.id);
    if (!membership) {
      throw new ForbiddenError('User not authorized for this tenant');
    }
    
    // Check if user has required role
    if (!roles.includes(membership.role)) {
      logger.warn('User lacks required role', {
        correlationId,
        userId: req.user.id,
        tenantId: tenant.id,
        userRole: membership.role,
        requiredRoles: roles
      });
      
      throw new ForbiddenError(`Required role: ${roles.join(' or ')}`);
    }
    
    logger.debug('Role authorization successful', {
      correlationId,
      userId: req.user.id,
      tenantId: tenant.id,
      userRole: membership.role
    });
    
    next();
  });
};

/**
 * Permission-Based Access Control Middleware
 * Ensures user has specific permissions in the current tenant
 */
export const requirePermission = (requiredPermissions: string | string[]) => {
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  return asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId || 'unknown';
    
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    
    const tenant = (req as any).tenant;
    if (!tenant) {
      throw new ForbiddenError('Tenant context required');
    }
    
    // Get user's membership in current tenant
    const membership = await storage.getMembership(tenant.id, req.user.id);
    if (!membership) {
      throw new ForbiddenError('User not authorized for this tenant');
    }
    
    // Get role permissions
    const rolePermissions = await getRolePermissions(membership.role);
    
    // Check if user has all required permissions
    const hasAllPermissions = permissions.every(permission => 
      rolePermissions.includes(permission) || rolePermissions.includes('*')
    );
    
    if (!hasAllPermissions) {
      logger.warn('User lacks required permissions', {
        correlationId,
        userId: req.user.id,
        tenantId: tenant.id,
        userRole: membership.role,
        userPermissions: rolePermissions,
        requiredPermissions: permissions
      });
      
      throw new ForbiddenError(`Required permissions: ${permissions.join(', ')}`);
    }
    
    logger.debug('Permission authorization successful', {
      correlationId,
      userId: req.user.id,
      tenantId: tenant.id,
      userRole: membership.role,
      permissions: rolePermissions
    });
    
    next();
  });
};

/**
 * Rate Limiting by User Middleware
 * Applies different rate limits based on user subscription
 */
export const rateLimitByUser = (limits: { free: number; starter: number; professional: number; enterprise: number }) => {
  return asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId || 'unknown';
    
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    
    // Get user's subscription plan
    const user = await storage.getUser(req.user.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    const userLimit = limits[user.subscriptionPlan] || limits.free;
    
    // Apply rate limiting based on user's plan
    // This would integrate with the existing rate limiting middleware
    // For now, we'll just log the information
    logger.debug('Rate limit applied based on user plan', {
      correlationId,
      userId: req.user.id,
      subscriptionPlan: user.subscriptionPlan,
      rateLimit: userLimit
    });
    
    next();
  });
};

/**
 * Session Validation Middleware
 * Ensures session is valid and updates last accessed time
 */
export const validateSession = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const correlationId = (req as any).correlationId || 'unknown';
  
  if (!req.user || !req.user.sessionId) {
    throw new UnauthorizedError('Session required');
  }
  
  const session = await storage.getSession(req.user.sessionId);
  if (!session || session.expiresAt < new Date()) {
    throw new UnauthorizedError('Session expired');
  }
  
  // Update session last accessed time
  await storage.updateSession(req.user.sessionId, { lastAccessedAt: new Date() });
  
  logger.debug('Session validated and updated', {
    correlationId,
    userId: req.user.id,
    sessionId: req.user.sessionId
  });
  
  next();
});

/**
 * Get permissions for a role
 */
async function getRolePermissions(role: string): Promise<string[]> {
  const rolePermissions: Record<string, string[]> = {
    owner: ['*'], // All permissions
    admin: [
      'users.read', 'users.write', 'users.delete',
      'content.read', 'content.write', 'content.delete',
      'analytics.read', 'settings.read', 'settings.write',
      'billing.read', 'billing.write'
    ],
    member: [
      'content.read', 'content.write',
      'analytics.read', 'settings.read'
    ],
    viewer: [
      'content.read', 'analytics.read'
    ]
  };
  
  return rolePermissions[role] || [];
}

/**
 * Development-only bypass middleware
 * Only works in development environment
 */
export const devAuthBypass = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    throw new ForbiddenError('Development auth bypass not allowed in production');
  }
  
  if (process.env.DISABLE_AUTH === 'true') {
    const correlationId = (req as any).correlationId || 'unknown';
    
    // Create fake authenticated user for development
    req.user = {
      id: 'dev-user',
      email: 'dev@fieldflux.local',
      firstName: 'Dev',
      lastName: 'User',
      emailVerified: true,
      tenantId: 'dev-tenant',
      claims: {
        sub: 'dev-user',
        email: 'dev@fieldflux.local',
        firstName: 'Dev',
        lastName: 'User',
        emailVerified: true
      }
    };
    
    logger.warn('Development auth bypass active', {
      correlationId,
      userId: req.user.id
    });
  }
  
  next();
});

export { AuthenticatedRequest };
