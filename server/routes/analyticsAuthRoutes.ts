import { Router } from 'express';
import { authenticateJWT, requireEmailVerification } from '../middleware/authMiddleware';
import { asyncHandler } from '../lib/errors';
import { logger } from '../lib/logger';
import { 
  analyticsTokenService,
  generateAnalyticsTokenPair,
  refreshAnalyticsToken,
  revokeAnalyticsToken
} from '../services/analyticsTokenService';
import { z } from 'zod';
import { rateLimiter } from '../lib/rate-limit';

const router = Router();

// Request validation schemas
const tokenRequestSchema = z.object({
  scopes: z.array(z.string()).optional(),
  analyticsRole: z.enum(['viewer', 'analyst', 'admin', 'owner']).optional()
});

const apiKeyRequestSchema = z.object({
  keyName: z.string().min(1).max(100),
  scopes: z.array(z.string()).min(1),
  description: z.string().optional()
});

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

/**
 * POST /api/analytics/auth/token
 * Generate analytics JWT token pair
 */
router.post('/token', 
  authenticateJWT,
  requireEmailVerification,
  rateLimiter,
  asyncHandler(async (req, res) => {
    const correlationId = (req as any).correlationId;
    const user = (req as any).user;
    
    try {
      // Validate request body
      const validatedData = tokenRequestSchema.parse(req.body);
      
      // Generate token pair
      const { accessToken, refreshToken } = await generateAnalyticsTokenPair(user, {
        scopes: validatedData.scopes,
        analyticsRole: validatedData.analyticsRole
      });
      
      // Set secure HTTP-only cookie for refresh token
      res.cookie('analytics_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      logger.info('Analytics tokens generated', {
        correlationId,
        userId: user.id,
        email: user.email,
        scopes: validatedData.scopes?.length || 0
      });
      
      res.json({
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 3600, // 1 hour
        scope: validatedData.scopes?.join(' ') || ''
      });
      
    } catch (error) {
      logger.error('Failed to generate analytics tokens', {
        correlationId,
        userId: user.id,
        error
      });
      throw error;
    }
  })
);

/**
 * POST /api/analytics/auth/refresh
 * Refresh analytics access token
 */
router.post('/refresh',
  rateLimiter,
  asyncHandler(async (req, res) => {
    const correlationId = (req as any).correlationId;
    
    try {
      // Get refresh token from body or cookie
      const refreshToken = req.body.refreshToken || req.cookies.analytics_refresh_token;
      
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
      }
      
      // Generate new access token
      const accessToken = await refreshAnalyticsToken(refreshToken);
      
      logger.info('Analytics token refreshed', {
        correlationId
      });
      
      res.json({
        accessToken,
        tokenType: 'Bearer',
        expiresIn: 3600 // 1 hour
      });
      
    } catch (error: any) {
      logger.error('Failed to refresh analytics token', {
        correlationId,
        error: error.message
      });
      
      res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  })
);

/**
 * POST /api/analytics/auth/api-key
 * Generate API key for programmatic access
 */
router.post('/api-key',
  authenticateJWT,
  requireEmailVerification,
  rateLimiter,
  asyncHandler(async (req, res) => {
    const correlationId = (req as any).correlationId;
    const user = (req as any).user;
    
    try {
      // Validate request body
      const validatedData = apiKeyRequestSchema.parse(req.body);
      
      // Check user's API key limit
      const existingKeys = await analyticsTokenService.listUserTokens(user.id);
      const apiKeys = existingKeys.filter(t => t.type === 'api_key');
      
      if (apiKeys.length >= 5) {
        return res.status(400).json({ 
          error: 'API key limit reached. Please revoke unused keys.' 
        });
      }
      
      // Generate API key
      const { key } = await analyticsTokenService.generateApiKeyToken(
        user,
        validatedData.keyName,
        validatedData.scopes
      );
      
      logger.info('Analytics API key generated', {
        correlationId,
        userId: user.id,
        email: user.email,
        keyName: validatedData.keyName,
        scopes: validatedData.scopes.length
      });
      
      res.json({
        apiKey: key,
        keyName: validatedData.keyName,
        scopes: validatedData.scopes,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      
    } catch (error) {
      logger.error('Failed to generate analytics API key', {
        correlationId,
        userId: user.id,
        error
      });
      throw error;
    }
  })
);

/**
 * POST /api/analytics/auth/revoke
 * Revoke analytics token
 */
router.post('/revoke',
  authenticateJWT,
  rateLimiter,
  asyncHandler(async (req, res) => {
    const correlationId = (req as any).correlationId;
    const user = (req as any).user;
    
    try {
      const { token, all } = req.body;
      
      if (all === true) {
        // Revoke all tokens for user
        await analyticsTokenService.revokeAllUserTokens(user.id);
        
        logger.info('All analytics tokens revoked', {
          correlationId,
          userId: user.id
        });
        
        res.json({ message: 'All tokens revoked successfully' });
      } else if (token) {
        // Revoke specific token
        await revokeAnalyticsToken(token);
        
        logger.info('Analytics token revoked', {
          correlationId,
          userId: user.id
        });
        
        res.json({ message: 'Token revoked successfully' });
      } else {
        res.status(400).json({ error: 'Token or "all" flag required' });
      }
      
    } catch (error) {
      logger.error('Failed to revoke analytics token', {
        correlationId,
        userId: user.id,
        error
      });
      throw error;
    }
  })
);

/**
 * GET /api/analytics/auth/tokens
 * List user's analytics tokens
 */
router.get('/tokens',
  authenticateJWT,
  rateLimiter,
  asyncHandler(async (req, res) => {
    const correlationId = (req as any).correlationId;
    const user = (req as any).user;
    
    try {
      const tokens = await analyticsTokenService.listUserTokens(user.id);
      
      // Filter out sensitive information
      const sanitizedTokens = tokens.map(token => ({
        id: token.jti,
        type: token.type,
        keyName: token.keyName,
        scopes: token.scopes,
        isActive: token.isActive,
        createdAt: token.issuedAt,
        expiresAt: token.expiresAt,
        lastUsedAt: token.lastUsedAt
      }));
      
      logger.info('Analytics tokens listed', {
        correlationId,
        userId: user.id,
        count: sanitizedTokens.length
      });
      
      res.json({ tokens: sanitizedTokens });
      
    } catch (error) {
      logger.error('Failed to list analytics tokens', {
        correlationId,
        userId: user.id,
        error
      });
      throw error;
    }
  })
);

/**
 * POST /api/analytics/auth/validate
 * Validate an analytics token
 */
router.post('/validate',
  rateLimiter,
  asyncHandler(async (req, res) => {
    const correlationId = (req as any).correlationId;
    
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: 'Token required' });
      }
      
      const result = await analyticsTokenService.validateToken(token);
      
      if (result.valid) {
        logger.info('Analytics token validated', {
          correlationId,
          userId: result.payload?.sub
        });
        
        res.json({
          valid: true,
          payload: {
            userId: result.payload?.sub,
            email: result.payload?.email,
            scopes: result.payload?.scopes,
            analyticsRole: result.payload?.analyticsRole,
            expiresAt: result.payload?.exp ? new Date(result.payload.exp * 1000).toISOString() : null
          }
        });
      } else {
        logger.warn('Invalid analytics token validation attempt', {
          correlationId,
          error: result.error
        });
        
        res.status(401).json({
          valid: false,
          error: result.error
        });
      }
      
    } catch (error) {
      logger.error('Failed to validate analytics token', {
        correlationId,
        error
      });
      throw error;
    }
  })
);

export default router;