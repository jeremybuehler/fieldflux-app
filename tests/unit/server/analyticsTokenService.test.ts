import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { analyticsTokenService } from '../../../server/services/analyticsTokenService';
import { storage } from '../../../server/storage';

// Mock dependencies
vi.mock('../../../server/storage');
vi.mock('../../../server/lib/logger');

const mockStorage = storage as any;

// Mock user data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  emailVerified: true,
  tenantId: 'tenant-456',
  sessionId: 'session-789',
  subscriptionPlan: 'professional',
  role: 'admin',
  analyticsEnabled: true,
  isActive: true
};

// Mock JWT secret for testing
const TEST_JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

describe('AnalyticsTokenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = TEST_JWT_SECRET;
    process.env.NODE_ENV = 'test';
    
    // Mock storage methods
    mockStorage.storeTokenMetadata = vi.fn().mockResolvedValue(undefined);
    mockStorage.storeRefreshToken = vi.fn().mockResolvedValue(undefined);
    mockStorage.createApiKey = vi.fn().mockResolvedValue(undefined);
    mockStorage.getUser = vi.fn().mockResolvedValue(mockUser);
    mockStorage.isTokenRevoked = vi.fn().mockResolvedValue(false);
    mockStorage.getUserTokens = vi.fn().mockResolvedValue([]);
    mockStorage.revokeToken = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.NODE_ENV;
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token with user data', async () => {
      const token = await analyticsTokenService.generateAccessToken(mockUser);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Verify token structure
      const decoded = jwt.verify(token, TEST_JWT_SECRET) as any;
      expect(decoded.sub).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.firstName).toBe(mockUser.firstName);
      expect(decoded.lastName).toBe(mockUser.lastName);
      expect(decoded.emailVerified).toBe(mockUser.emailVerified);
      expect(decoded.tenantId).toBe(mockUser.tenantId);
      expect(decoded.sessionId).toBe(mockUser.sessionId);
      expect(decoded.analyticsRole).toBe('admin');
      expect(decoded.type).toBe('access');
      expect(decoded.jti).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
      expect(decoded.iss).toBe('fieldflux');
      expect(decoded.aud).toBe('fieldflux-analytics');
    });

    it('should generate token with analyst role for professional subscription', async () => {
      const professionalUser = { ...mockUser, role: 'user', subscriptionPlan: 'professional' };
      const token = await analyticsTokenService.generateAccessToken(professionalUser);
      
      const decoded = jwt.verify(token, TEST_JWT_SECRET) as any;
      expect(decoded.analyticsRole).toBe('analyst');
      expect(decoded.scopes).toContain('analytics:read:metrics');
      expect(decoded.scopes).toContain('analytics:generate:reports');
    });

    it('should generate token with viewer role for basic subscription', async () => {
      const basicUser = { ...mockUser, role: 'user', subscriptionPlan: 'basic' };
      const token = await analyticsTokenService.generateAccessToken(basicUser);
      
      const decoded = jwt.verify(token, TEST_JWT_SECRET) as any;
      expect(decoded.analyticsRole).toBe('viewer');
      expect(decoded.scopes).toContain('analytics:read:metrics');
      expect(decoded.scopes).not.toContain('analytics:generate:reports');
    });

    it('should generate token with owner role', async () => {
      const ownerUser = { ...mockUser, role: 'owner' };
      const token = await analyticsTokenService.generateAccessToken(ownerUser);
      
      const decoded = jwt.verify(token, TEST_JWT_SECRET) as any;
      expect(decoded.analyticsRole).toBe('owner');
      expect(decoded.scopes).toContain('analytics:*');
    });

    it('should use custom options when provided', async () => {
      const customOptions = {
        analyticsRole: 'admin' as const,
        expiresIn: '2h',
        scopes: ['analytics:read:metrics', 'analytics:admin:config']
      };
      
      const token = await analyticsTokenService.generateAccessToken(mockUser, customOptions);
      
      const decoded = jwt.verify(token, TEST_JWT_SECRET) as any;
      expect(decoded.analyticsRole).toBe('admin');
      expect(decoded.scopes).toEqual(customOptions.scopes);
    });

    it('should store token metadata', async () => {
      await analyticsTokenService.generateAccessToken(mockUser);
      
      expect(mockStorage.storeTokenMetadata).toHaveBeenCalledWith(
        expect.objectContaining({
          jti: expect.any(String),
          userId: mockUser.id,
          type: 'access',
          issuedAt: expect.any(Date),
          expiresAt: expect.any(Date),
          isActive: true
        })
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', async () => {
      const token = await analyticsTokenService.generateRefreshToken(mockUser);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = jwt.verify(token, TEST_JWT_SECRET) as any;
      expect(decoded.sub).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.type).toBe('refresh');
      expect(decoded.jti).toBeDefined();
    });

    it('should store refresh token', async () => {
      await analyticsTokenService.generateRefreshToken(mockUser);
      
      expect(mockStorage.storeRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({
          jti: expect.any(String),
          userId: mockUser.id,
          token: expect.any(String),
          issuedAt: expect.any(Date),
          expiresAt: expect.any(Date),
          isActive: true
        })
      );
    });
  });

  describe('generateApiKeyToken', () => {
    it('should generate API key and token', async () => {
      const keyName = 'test-api-key';
      const scopes = ['analytics:read:metrics', 'analytics:read:traffic'];
      
      const result = await analyticsTokenService.generateApiKeyToken(mockUser, keyName, scopes);
      
      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('token');
      expect(result.key).toMatch(/^ffa_/); // FieldFlux Analytics prefix
      expect(typeof result.token).toBe('string');
      
      const decoded = jwt.verify(result.token, TEST_JWT_SECRET) as any;
      expect(decoded.sub).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.scopes).toEqual(scopes);
      expect(decoded.type).toBe('api_key');
    });

    it('should store API key in storage', async () => {
      const keyName = 'test-api-key';
      const scopes = ['analytics:read:metrics'];
      
      await analyticsTokenService.generateApiKeyToken(mockUser, keyName, scopes);
      
      expect(mockStorage.createApiKey).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          userId: mockUser.id,
          userEmail: mockUser.email,
          keyHash: expect.any(String),
          keyName,
          scopes,
          isActive: true,
          createdAt: expect.any(Date),
          expiresAt: expect.any(Date)
        })
      );
    });

    it('should generate secure API key with proper format', async () => {
      const keyName = 'test-key';
      const scopes = ['analytics:read:metrics'];
      
      const result = await analyticsTokenService.generateApiKeyToken(mockUser, keyName, scopes);
      
      expect(result.key).toMatch(/^ffa_[A-Za-z0-9_-]+$/);
      expect(result.key.length).toBeGreaterThan(40); // Base64url encoded 32 bytes + prefix
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      // Generate refresh token first
      const refreshToken = await analyticsTokenService.generateRefreshToken(mockUser);
      
      const newAccessToken = await analyticsTokenService.refreshAccessToken(refreshToken);
      
      expect(newAccessToken).toBeDefined();
      expect(typeof newAccessToken).toBe('string');
      
      const decoded = jwt.verify(newAccessToken, TEST_JWT_SECRET) as any;
      expect(decoded.sub).toBe(mockUser.id);
      expect(decoded.type).toBe('access');
    });

    it('should reject invalid refresh token', async () => {
      const invalidToken = jwt.sign(
        { sub: 'user-123', type: 'access' }, // Wrong type
        TEST_JWT_SECRET
      );
      
      await expect(analyticsTokenService.refreshAccessToken(invalidToken))
        .rejects.toThrow('Invalid token type');
    });

    it('should reject revoked refresh token', async () => {
      const refreshToken = await analyticsTokenService.generateRefreshToken(mockUser);
      mockStorage.isTokenRevoked.mockResolvedValue(true);
      
      await expect(analyticsTokenService.refreshAccessToken(refreshToken))
        .rejects.toThrow('Refresh token has been revoked');
    });

    it('should reject token for inactive user', async () => {
      const refreshToken = await analyticsTokenService.generateRefreshToken(mockUser);
      mockStorage.getUser.mockResolvedValue({ ...mockUser, isActive: false });
      
      await expect(analyticsTokenService.refreshAccessToken(refreshToken))
        .rejects.toThrow('User not found or inactive');
    });

    it('should reject token with invalid signature', async () => {
      const invalidToken = jwt.sign(
        { sub: 'user-123', type: 'refresh' },
        'wrong-secret'
      );
      
      await expect(analyticsTokenService.refreshAccessToken(invalidToken))
        .rejects.toThrow();
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', async () => {
      const token = await analyticsTokenService.generateAccessToken(mockUser);
      
      const result = await analyticsTokenService.validateToken(token);
      
      expect(result.valid).toBe(true);
      expect(result.payload).toBeDefined();
      expect(result.payload?.sub).toBe(mockUser.id);
      expect(result.error).toBeUndefined();
    });

    it('should reject revoked token', async () => {
      const token = await analyticsTokenService.generateAccessToken(mockUser);
      mockStorage.isTokenRevoked.mockResolvedValue(true);
      
      const result = await analyticsTokenService.validateToken(token);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Token has been revoked');
      expect(result.payload).toBeUndefined();
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
        },
        TEST_JWT_SECRET
      );
      
      const result = await analyticsTokenService.validateToken(expiredToken);
      
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/expired/i);
    });

    it('should reject token with invalid signature', async () => {
      const invalidToken = jwt.sign(
        { sub: mockUser.id, email: mockUser.email },
        'wrong-secret'
      );
      
      const result = await analyticsTokenService.validateToken(invalidToken);
      
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/signature/i);
    });

    it('should reject malformed token', async () => {
      const malformedToken = 'not.a.valid.jwt';
      
      const result = await analyticsTokenService.validateToken(malformedToken);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', async () => {
      const result = await analyticsTokenService.generateTokenPair(mockUser);
      
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      
      // Validate both tokens
      const accessDecoded = jwt.verify(result.accessToken, TEST_JWT_SECRET) as any;
      const refreshDecoded = jwt.verify(result.refreshToken, TEST_JWT_SECRET) as any;
      
      expect(accessDecoded.type).toBe('access');
      expect(refreshDecoded.type).toBe('refresh');
      expect(accessDecoded.sub).toBe(mockUser.id);
      expect(refreshDecoded.sub).toBe(mockUser.id);
    });

    it('should use provided options for access token', async () => {
      const options = {
        analyticsRole: 'viewer' as const,
        scopes: ['analytics:read:metrics']
      };
      
      const result = await analyticsTokenService.generateTokenPair(mockUser, options);
      
      const accessDecoded = jwt.verify(result.accessToken, TEST_JWT_SECRET) as any;
      expect(accessDecoded.analyticsRole).toBe('viewer');
      expect(accessDecoded.scopes).toEqual(options.scopes);
    });
  });

  describe('revokeToken', () => {
    it('should revoke token by JWT string', async () => {
      const token = await analyticsTokenService.generateAccessToken(mockUser);
      
      await analyticsTokenService.revokeToken(token);
      
      expect(mockStorage.revokeToken).toHaveBeenCalledWith(expect.any(String));
    });

    it('should revoke token by JTI', async () => {
      const jti = crypto.randomUUID();
      
      await analyticsTokenService.revokeToken(jti);
      
      expect(mockStorage.revokeToken).toHaveBeenCalledWith(jti);
    });

    it('should handle invalid token gracefully', async () => {
      await expect(analyticsTokenService.revokeToken('invalid-token'))
        .rejects.toThrow();
    });
  });

  describe('listUserTokens', () => {
    it('should return user tokens from storage', async () => {
      const mockTokens = [
        { jti: 'token-1', type: 'access', issuedAt: new Date(), expiresAt: new Date() },
        { jti: 'token-2', type: 'refresh', issuedAt: new Date(), expiresAt: new Date() }
      ];
      mockStorage.getUserTokens.mockResolvedValue(mockTokens);
      
      const result = await analyticsTokenService.listUserTokens(mockUser.id);
      
      expect(result).toEqual(mockTokens);
      expect(mockStorage.getUserTokens).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('revokeAllUserTokens', () => {
    it('should revoke all tokens for a user', async () => {
      const mockTokens = [
        { jti: 'token-1' },
        { jti: 'token-2' },
        { jti: 'token-3' }
      ];
      mockStorage.getUserTokens.mockResolvedValue(mockTokens);
      
      await analyticsTokenService.revokeAllUserTokens(mockUser.id);
      
      expect(mockStorage.getUserTokens).toHaveBeenCalledWith(mockUser.id);
      expect(mockStorage.revokeToken).toHaveBeenCalledTimes(3);
      expect(mockStorage.revokeToken).toHaveBeenCalledWith('token-1');
      expect(mockStorage.revokeToken).toHaveBeenCalledWith('token-2');
      expect(mockStorage.revokeToken).toHaveBeenCalledWith('token-3');
    });
  });

  describe('error handling', () => {
    it('should throw error when JWT_SECRET is missing in production', () => {
      delete process.env.JWT_SECRET;
      process.env.NODE_ENV = 'production';
      
      expect(() => {
        new (analyticsTokenService.constructor as any)();
      }).toThrow('JWT_SECRET must be configured in production');
    });

    it('should handle storage errors gracefully', async () => {
      mockStorage.storeTokenMetadata.mockRejectedValue(new Error('Storage error'));
      
      await expect(analyticsTokenService.generateAccessToken(mockUser))
        .rejects.toThrow('Storage error');
    });
  });

  describe('security considerations', () => {
    it('should generate unique JTI for each token', async () => {
      const token1 = await analyticsTokenService.generateAccessToken(mockUser);
      const token2 = await analyticsTokenService.generateAccessToken(mockUser);
      
      const decoded1 = jwt.verify(token1, TEST_JWT_SECRET) as any;
      const decoded2 = jwt.verify(token2, TEST_JWT_SECRET) as any;
      
      expect(decoded1.jti).not.toBe(decoded2.jti);
    });

    it('should use secure random for API key generation', async () => {
      const keyName = 'test-key';
      const scopes = ['analytics:read:metrics'];
      
      const result1 = await analyticsTokenService.generateApiKeyToken(mockUser, keyName, scopes);
      const result2 = await analyticsTokenService.generateApiKeyToken(mockUser, keyName, scopes);
      
      expect(result1.key).not.toBe(result2.key);
      expect(result1.key.length).toBeGreaterThan(40);
      expect(result2.key.length).toBeGreaterThan(40);
    });

    it('should properly hash API keys before storage', async () => {
      const keyName = 'test-key';
      const scopes = ['analytics:read:metrics'];
      
      await analyticsTokenService.generateApiKeyToken(mockUser, keyName, scopes);
      
      const createApiKeyCall = mockStorage.createApiKey.mock.calls[0][0];
      expect(createApiKeyCall.keyHash).toBeDefined();
      expect(createApiKeyCall.keyHash).toMatch(/^[a-f0-9]{64}$/); // SHA256 hex
      expect(createApiKeyCall.keyHash).not.toContain('ffa_'); // Should not contain the actual key
    });

    it('should set appropriate expiration times', async () => {
      const accessToken = await analyticsTokenService.generateAccessToken(mockUser);
      const refreshToken = await analyticsTokenService.generateRefreshToken(mockUser);
      
      const accessDecoded = jwt.verify(accessToken, TEST_JWT_SECRET) as any;
      const refreshDecoded = jwt.verify(refreshToken, TEST_JWT_SECRET) as any;
      
      // Access token should expire in 1 hour (3600 seconds)
      expect(accessDecoded.exp - accessDecoded.iat).toBe(3600);
      
      // Refresh token should expire in 7 days (604800 seconds)
      expect(refreshDecoded.exp - refreshDecoded.iat).toBe(604800);
    });
  });
});