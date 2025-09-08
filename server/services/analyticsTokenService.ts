import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { storage } from '../storage';
import { logger } from '../lib/logger';

export interface AnalyticsTokenPayload {
  sub: string; // User ID
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  tenantId?: string;
  sessionId?: string;
  analyticsRole?: 'viewer' | 'analyst' | 'admin' | 'owner';
  scopes?: string[];
  type?: 'access' | 'refresh' | 'api_key';
  jti?: string; // JWT ID for revocation
  iat?: number;
  exp?: number;
}

export interface AnalyticsTokenOptions {
  expiresIn?: string;
  audience?: string;
  issuer?: string;
  scopes?: string[];
  analyticsRole?: 'viewer' | 'analyst' | 'admin' | 'owner';
}

class AnalyticsTokenService {
  private readonly JWT_SECRET: string;
  private readonly DEFAULT_ISSUER = 'fieldflux';
  private readonly DEFAULT_AUDIENCE = 'fieldflux-analytics';
  private readonly ACCESS_TOKEN_EXPIRY = '1h';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly API_KEY_TOKEN_EXPIRY = '30d';

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    
    if (this.JWT_SECRET === 'dev-secret-change-in-production' && process.env.NODE_ENV === 'production') {
      logger.error('CRITICAL: Using default JWT secret in production!');
      throw new Error('JWT_SECRET must be configured in production');
    }
  }

  /**
   * Generate an analytics access token
   */
  async generateAccessToken(user: any, options: AnalyticsTokenOptions = {}): Promise<string> {
    const jti = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    // Determine analytics role based on user data
    const analyticsRole = options.analyticsRole || this.determineAnalyticsRole(user);
    
    // Get default scopes for the role
    const scopes = options.scopes || this.getDefaultScopes(analyticsRole);
    
    const payload: AnalyticsTokenPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified || false,
      tenantId: user.tenantId,
      sessionId: user.sessionId,
      analyticsRole,
      scopes,
      type: 'access',
      jti,
      iat: now
    };
    
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: options.expiresIn || this.ACCESS_TOKEN_EXPIRY,
      audience: options.audience || this.DEFAULT_AUDIENCE,
      issuer: options.issuer || this.DEFAULT_ISSUER,
      algorithm: 'HS256'
    });
    
    // Store token metadata for tracking
    await this.storeTokenMetadata(jti, user.id, 'access', now);
    
    logger.info('Analytics access token generated', {
      userId: user.id,
      email: user.email,
      analyticsRole,
      scopes: scopes.length,
      jti
    });
    
    return token;
  }

  /**
   * Generate a refresh token for analytics
   */
  async generateRefreshToken(user: any): Promise<string> {
    const jti = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    const payload: AnalyticsTokenPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
      jti,
      iat: now
    };
    
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      audience: this.DEFAULT_AUDIENCE,
      issuer: this.DEFAULT_ISSUER,
      algorithm: 'HS256'
    });
    
    // Store refresh token
    await this.storeRefreshToken(jti, user.id, token);
    
    logger.info('Analytics refresh token generated', {
      userId: user.id,
      email: user.email,
      jti
    });
    
    return token;
  }

  /**
   * Generate an API key token
   */
  async generateApiKeyToken(user: any, keyName: string, scopes: string[]): Promise<{ key: string; token: string }> {
    const apiKey = this.generateSecureApiKey();
    const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const jti = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    const payload: AnalyticsTokenPayload = {
      sub: user.id,
      email: user.email,
      scopes,
      type: 'api_key',
      jti,
      iat: now
    };
    
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.API_KEY_TOKEN_EXPIRY,
      audience: this.DEFAULT_AUDIENCE,
      issuer: this.DEFAULT_ISSUER,
      algorithm: 'HS256'
    });
    
    // Store API key
    await storage.createApiKey({
      id: jti,
      userId: user.id,
      userEmail: user.email,
      keyHash: apiKeyHash,
      keyName,
      scopes,
      isActive: true,
      createdAt: new Date(),
      lastUsedAt: null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    logger.info('Analytics API key generated', {
      userId: user.id,
      email: user.email,
      keyName,
      scopes: scopes.length,
      jti
    });
    
    return { key: apiKey, token };
  }

  /**
   * Refresh an access token using a refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET, {
        audience: this.DEFAULT_AUDIENCE,
        issuer: this.DEFAULT_ISSUER
      }) as AnalyticsTokenPayload;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      
      // Check if refresh token is revoked
      const isRevoked = await storage.isTokenRevoked(decoded.jti!);
      if (isRevoked) {
        throw new Error('Refresh token has been revoked');
      }
      
      // Get user data
      const user = await storage.getUser(decoded.sub);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }
      
      // Generate new access token
      return await this.generateAccessToken(user);
      
    } catch (error) {
      logger.error('Failed to refresh analytics token', { error });
      throw error;
    }
  }

  /**
   * Revoke a token
   */
  async revokeToken(tokenOrJti: string): Promise<void> {
    let jti: string;
    
    try {
      // Try to decode as JWT first
      const decoded = jwt.decode(tokenOrJti) as AnalyticsTokenPayload;
      if (decoded && decoded.jti) {
        jti = decoded.jti;
      } else {
        // Assume it's already a JTI
        jti = tokenOrJti;
      }
      
      await storage.revokeToken(jti);
      
      logger.info('Analytics token revoked', { jti });
    } catch (error) {
      logger.error('Failed to revoke analytics token', { error });
      throw error;
    }
  }

  /**
   * Validate a token without throwing errors
   */
  async validateToken(token: string): Promise<{ valid: boolean; payload?: AnalyticsTokenPayload; error?: string }> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        audience: this.DEFAULT_AUDIENCE,
        issuer: this.DEFAULT_ISSUER,
        algorithms: ['HS256']
      }) as AnalyticsTokenPayload;
      
      // Check if token is revoked
      if (decoded.jti) {
        const isRevoked = await storage.isTokenRevoked(decoded.jti);
        if (isRevoked) {
          return { valid: false, error: 'Token has been revoked' };
        }
      }
      
      return { valid: true, payload: decoded };
    } catch (error: any) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  async generateTokenPair(user: any, options: AnalyticsTokenOptions = {}): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user, options),
      this.generateRefreshToken(user)
    ]);
    
    return { accessToken, refreshToken };
  }

  /**
   * List active tokens for a user
   */
  async listUserTokens(userId: string): Promise<any[]> {
    return await storage.getUserTokens(userId);
  }

  /**
   * Revoke all tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    const tokens = await this.listUserTokens(userId);
    
    await Promise.all(
      tokens.map(token => this.revokeToken(token.jti))
    );
    
    logger.info('All analytics tokens revoked for user', { userId, count: tokens.length });
  }

  // Private helper methods

  private determineAnalyticsRole(user: any): 'viewer' | 'analyst' | 'admin' | 'owner' {
    if (user.role === 'owner') return 'owner';
    if (user.role === 'admin') return 'admin';
    
    switch (user.subscriptionPlan) {
      case 'enterprise':
      case 'professional':
        return 'analyst';
      default:
        return 'viewer';
    }
  }

  private getDefaultScopes(role: 'viewer' | 'analyst' | 'admin' | 'owner'): string[] {
    const scopeMap = {
      viewer: [
        'analytics:read:metrics',
        'analytics:read:traffic',
        'analytics:read:pages'
      ],
      analyst: [
        'analytics:read:metrics',
        'analytics:read:traffic',
        'analytics:read:pages',
        'analytics:read:locations',
        'analytics:read:devices',
        'analytics:read:keywords',
        'analytics:generate:reports'
      ],
      admin: [
        'analytics:read:metrics',
        'analytics:read:traffic',
        'analytics:read:pages',
        'analytics:read:locations',
        'analytics:read:devices',
        'analytics:read:realtime',
        'analytics:read:keywords',
        'analytics:read:reviews',
        'analytics:generate:reports',
        'analytics:export:data'
      ],
      owner: ['analytics:*']
    };
    
    return scopeMap[role] || scopeMap.viewer;
  }

  private generateSecureApiKey(): string {
    // Generate a secure API key with prefix
    const prefix = 'ffa_'; // FieldFlux Analytics
    const randomBytes = crypto.randomBytes(32).toString('base64url');
    return `${prefix}${randomBytes}`;
  }

  private async storeTokenMetadata(jti: string, userId: string, type: string, issuedAt: number): Promise<void> {
    await storage.storeTokenMetadata({
      jti,
      userId,
      type,
      issuedAt: new Date(issuedAt * 1000),
      expiresAt: new Date((issuedAt + 3600) * 1000), // 1 hour for access tokens
      isActive: true
    });
  }

  private async storeRefreshToken(jti: string, userId: string, token: string): Promise<void> {
    await storage.storeRefreshToken({
      jti,
      userId,
      token,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isActive: true
    });
  }
}

export const analyticsTokenService = new AnalyticsTokenService();

// Export utility functions for easy access
export const generateAnalyticsToken = (user: any, options?: AnalyticsTokenOptions) => 
  analyticsTokenService.generateAccessToken(user, options);

export const generateAnalyticsTokenPair = (user: any, options?: AnalyticsTokenOptions) =>
  analyticsTokenService.generateTokenPair(user, options);

export const validateAnalyticsToken = (token: string) =>
  analyticsTokenService.validateToken(token);

export const revokeAnalyticsToken = (tokenOrJti: string) =>
  analyticsTokenService.revokeToken(tokenOrJti);

export const refreshAnalyticsToken = (refreshToken: string) =>
  analyticsTokenService.refreshAccessToken(refreshToken);