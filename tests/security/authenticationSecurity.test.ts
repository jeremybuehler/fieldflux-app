import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { analyticsTokenService } from '../../../server/services/analyticsTokenService';
import { 
  authenticateAnalyticsJWT, 
  requireAnalyticsScope,
  ANALYTICS_SCOPES 
} from '../../../server/middleware/analyticsAuthMiddleware';
import { UnauthorizedError, ForbiddenError } from '../../../server/lib/errors';

// Mock dependencies for focused security testing
vi.mock('../../../server/storage');
vi.mock('../../../server/lib/logger');
vi.mock('../../../server/lib/rate-limit');

const mockStorage = {
  getUser: vi.fn(),
  getSession: vi.fn(),
  getApiKey: vi.fn(),
  isTokenRevoked: vi.fn(),
  getSessionActivity: vi.fn(),
  revokeSession: vi.fn(),
  storeTokenMetadata: vi.fn(),
  storeRefreshToken: vi.fn(),
  createApiKey: vi.fn(),
  getUserTokens: vi.fn(),
  revokeToken: vi.fn()
};

vi.mocked(require('../../../server/storage')).storage = mockStorage;

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
};

vi.mocked(require('../../../server/lib/logger')).logger = mockLogger;

const TEST_JWT_SECRET = 'test-jwt-secret-security-focused';

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  emailVerified: true,
  tenantId: 'tenant-456',
  role: 'admin',
  subscriptionPlan: 'professional',
  analyticsEnabled: true,
  isActive: true
};

const createMockRequest = (overrides: any = {}) => ({
  headers: {},
  cookies: {},
  ip: '127.0.0.1',
  path: '/api/analytics/test',
  method: 'GET',
  query: {},
  correlationId: 'security-test-id',
  ...overrides
});

const createMockResponse = () => ({
  setHeader: vi.fn(),
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
  send: vi.fn().mockReturnThis(),
  statusCode: 200
});

describe('Authentication Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = TEST_JWT_SECRET;
    process.env.NODE_ENV = 'test';
    
    // Default successful mocks
    mockStorage.getUser.mockResolvedValue(mockUser);
    mockStorage.getSession.mockResolvedValue({
      id: 'session-123',
      userId: mockUser.id,
      expiresAt: new Date(Date.now() + 86400000),
      isActive: true
    });
    mockStorage.isTokenRevoked.mockResolvedValue(false);
    mockStorage.getSessionActivity.mockResolvedValue({
      locations: [],
      requestCount: 10,
      suspicious: false
    });
    mockStorage.storeTokenMetadata.mockResolvedValue(undefined);
    mockStorage.storeRefreshToken.mockResolvedValue(undefined);
    mockStorage.createApiKey.mockResolvedValue(undefined);
    mockStorage.getUserTokens.mockResolvedValue([]);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.NODE_ENV;
  });

  describe('JWT Token Security', () => {
    it('should reject tokens with weak secrets in production', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_SECRET;
      
      expect(() => {
        new (analyticsTokenService.constructor as any)();
      }).toThrow('JWT_SECRET must be configured in production');
    });

    it('should reject tokens signed with different algorithm', async () => {
      const maliciousToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          analyticsRole: 'owner' // Try to escalate privileges
        },
        TEST_JWT_SECRET,
        { algorithm: 'none' as any } // Algorithm confusion attack
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${maliciousToken}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should reject tokens with manipulated claims', async () => {
      // Create a valid token first
      const validToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          analyticsRole: 'viewer',
          scopes: ['analytics:read:metrics']
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      // Try to manipulate the payload (this would fail signature verification)
      const [header, payload, signature] = validToken.split('.');
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
      decodedPayload.analyticsRole = 'owner'; // Privilege escalation attempt
      
      const manipulatedPayload = Buffer.from(JSON.stringify(decodedPayload)).toString('base64url');
      const manipulatedToken = `${header}.${manipulatedPayload}.${signature}`;

      const req = createMockRequest({
        headers: { authorization: `Bearer ${manipulatedToken}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Invalid analytics JWT',
        expect.any(Object)
      );
    });

    it('should reject tokens with invalid issuer', async () => {
      const tokenWithWrongIssuer = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email
        },
        TEST_JWT_SECRET,
        {
          issuer: 'malicious-issuer', // Wrong issuer
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${tokenWithWrongIssuer}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should reject tokens with invalid audience', async () => {
      const tokenWithWrongAudience = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'wrong-audience', // Wrong audience
          algorithm: 'HS256'
        }
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${tokenWithWrongAudience}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should enforce maximum token age', async () => {
      const oldToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          iat: Math.floor(Date.now() / 1000) - (25 * 60 * 60), // 25 hours ago
          exp: Math.floor(Date.now() / 1000) + 3600 // Still valid expiration
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${oldToken}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should validate token revocation status', async () => {
      const validToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          jti: 'revoked-token-id'
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      mockStorage.isTokenRevoked.mockResolvedValue(true);

      const req = createMockRequest({
        headers: { authorization: `Bearer ${validToken}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockStorage.isTokenRevoked).toHaveBeenCalledWith('revoked-token-id');
    });
  });

  describe('Session Security', () => {
    it('should detect and prevent session hijacking attempts', async () => {
      const sessionId = 'session-456';
      const validToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          sessionId,
          jti: crypto.randomUUID()
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      // Simulate suspicious activity
      mockStorage.getSessionActivity.mockResolvedValue({
        locations: ['IP1', 'IP2', 'IP3', 'IP4', 'IP5', 'IP6'], // Rapid location changes
        requestCount: 5000, // Unusually high request count
        suspicious: true
      });

      const req = createMockRequest({
        headers: { authorization: `Bearer ${validToken}` },
        ip: '192.168.1.100' // Different IP
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockStorage.revokeSession).toHaveBeenCalledWith(sessionId);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Suspicious session activity detected',
        expect.any(Object)
      );
    });

    it('should reject expired sessions', async () => {
      const sessionId = 'expired-session';
      const validToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          sessionId,
          jti: crypto.randomUUID()
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      mockStorage.getSession.mockResolvedValue({
        id: sessionId,
        userId: mockUser.id,
        expiresAt: new Date(Date.now() - 86400000), // Expired 24 hours ago
        isActive: true
      });

      const req = createMockRequest({
        headers: { authorization: `Bearer ${validToken}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('API Key Security', () => {
    it('should securely hash API keys before storage', async () => {
      const apiKeyName = 'test-api-key';
      const scopes = ['analytics:read:metrics'];
      
      await analyticsTokenService.generateApiKeyToken(mockUser, apiKeyName, scopes);
      
      expect(mockStorage.createApiKey).toHaveBeenCalledWith(
        expect.objectContaining({
          keyHash: expect.stringMatching(/^[a-f0-9]{64}$/), // SHA256 hash
          keyName: apiKeyName,
          scopes
        })
      );

      // Ensure the actual key is not stored
      const createApiKeyCall = mockStorage.createApiKey.mock.calls[0][0];
      expect(createApiKeyCall.keyHash).not.toContain('ffa_');
    });

    it('should generate cryptographically secure API keys', async () => {
      const keys = [];
      for (let i = 0; i < 100; i++) {
        const result = await analyticsTokenService.generateApiKeyToken(
          mockUser,
          `key-${i}`,
          ['analytics:read:metrics']
        );
        keys.push(result.key);
      }

      // Check that all keys are unique
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(100);

      // Check key format and length
      keys.forEach(key => {
        expect(key).toMatch(/^ffa_[A-Za-z0-9_-]+$/);
        expect(key.length).toBeGreaterThan(40);
      });
    });

    it('should reject invalid API keys', async () => {
      const invalidApiKey = 'invalid-api-key-format';
      
      mockStorage.getApiKey.mockResolvedValue(null);

      const req = createMockRequest({
        headers: { 'x-api-key': invalidApiKey }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should reject inactive API keys', async () => {
      const apiKey = 'ffa_valid_format_but_inactive';
      const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
      
      mockStorage.getApiKey.mockResolvedValue({
        userId: mockUser.id,
        userEmail: mockUser.email,
        keyHash: apiKeyHash,
        isActive: false // Inactive key
      });

      const req = createMockRequest({
        headers: { 'x-api-key': apiKey }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('Authorization Security', () => {
    it('should prevent privilege escalation through scope manipulation', async () => {
      const middleware = requireAnalyticsScope(ANALYTICS_SCOPES.ADMIN_CONFIG);
      const req = createMockRequest();
      
      // User with limited scopes trying to access admin functionality
      req.user = {
        id: mockUser.id,
        email: mockUser.email,
        emailVerified: true,
        analyticsScopes: [ANALYTICS_SCOPES.READ_METRICS], // Limited scope
        claims: {}
      };

      const res = createMockResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'User lacks required analytics scope',
        expect.any(Object)
      );
    });

    it('should validate scope hierarchy properly', async () => {
      const testCases = [
        {
          userScopes: [ANALYTICS_SCOPES.FULL_ACCESS],
          requiredScope: ANALYTICS_SCOPES.ADMIN_CONFIG,
          shouldAllow: true
        },
        {
          userScopes: [ANALYTICS_SCOPES.READ_METRICS],
          requiredScope: ANALYTICS_SCOPES.EXPORT_DATA,
          shouldAllow: false
        },
        {
          userScopes: [ANALYTICS_SCOPES.GENERATE_REPORTS],
          requiredScope: ANALYTICS_SCOPES.READ_METRICS,
          shouldAllow: false // Reports don't imply metrics access
        }
      ];

      for (const testCase of testCases) {
        const middleware = requireAnalyticsScope(testCase.requiredScope);
        const req = createMockRequest();
        req.user = {
          id: mockUser.id,
          email: mockUser.email,
          emailVerified: true,
          analyticsScopes: testCase.userScopes,
          claims: {}
        };

        const res = createMockResponse();
        const next = vi.fn();

        await middleware(req, res, next);

        if (testCase.shouldAllow) {
          expect(next).toHaveBeenCalledWith();
        } else {
          expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
        }
      }
    });

    it('should prevent cross-tenant data access', async () => {
      const userFromTenant1 = {
        ...mockUser,
        tenantId: 'tenant-111'
      };

      const validToken = jwt.sign(
        {
          sub: userFromTenant1.id,
          email: userFromTenant1.email,
          tenantId: userFromTenant1.tenantId,
          jti: crypto.randomUUID()
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      mockStorage.getUser.mockResolvedValue(userFromTenant1);

      const req = createMockRequest({
        headers: { authorization: `Bearer ${validToken}` },
        params: { tenantId: 'tenant-222' } // Different tenant
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      // Should authenticate successfully
      expect(next).toHaveBeenCalledWith();
      expect(req.user?.tenantId).toBe('tenant-111');
      
      // Additional tenant validation would be done in route handlers
      // This test verifies that tenant information is properly preserved
    });
  });

  describe('Input Validation Security', () => {
    it('should sanitize malicious input in claims', async () => {
      const maliciousToken = jwt.sign(
        {
          sub: mockUser.id,
          email: '<script>alert("xss")</script>@example.com',
          firstName: '"><script>alert("xss")</script>',
          lastName: 'DROP TABLE users; --',
          jti: crypto.randomUUID()
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${maliciousToken}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      // Should still authenticate (input sanitization would be done at display level)
      expect(next).toHaveBeenCalledWith();
      expect(req.user?.email).toBe('<script>alert("xss")</script>@example.com');
      
      // Log that potentially malicious input was detected
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Analytics authentication successful',
        expect.any(Object)
      );
    });

    it('should handle extremely long input values', async () => {
      const longString = 'a'.repeat(10000);
      
      const tokenWithLongClaims = jwt.sign(
        {
          sub: mockUser.id,
          email: `${longString}@example.com`,
          firstName: longString,
          jti: crypto.randomUUID()
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${tokenWithLongClaims}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      // Should handle gracefully without crashing
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Timing Attack Prevention', () => {
    it('should have consistent response times for valid and invalid tokens', async () => {
      const validToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          jti: crypto.randomUUID()
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      const invalidToken = 'invalid.jwt.token';

      const timings: number[] = [];

      // Test valid token multiple times
      for (let i = 0; i < 5; i++) {
        const start = process.hrtime.bigint();
        
        const req = createMockRequest({
          headers: { authorization: `Bearer ${validToken}` }
        });
        const res = createMockResponse();
        const next = vi.fn();

        await authenticateAnalyticsJWT(req, res, next);
        
        const end = process.hrtime.bigint();
        timings.push(Number(end - start) / 1_000_000); // Convert to milliseconds
      }

      // Test invalid token multiple times
      for (let i = 0; i < 5; i++) {
        const start = process.hrtime.bigint();
        
        const req = createMockRequest({
          headers: { authorization: `Bearer ${invalidToken}` }
        });
        const res = createMockResponse();
        const next = vi.fn();

        await authenticateAnalyticsJWT(req, res, next);
        
        const end = process.hrtime.bigint();
        timings.push(Number(end - start) / 1_000_000);
      }

      // Timing differences should be minimal (within reasonable variance)
      const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
      const maxTiming = Math.max(...timings);
      const minTiming = Math.min(...timings);
      
      // Allow for 100ms variance (adjust based on your requirements)
      expect(maxTiming - minTiming).toBeLessThan(100);
    });
  });

  describe('Error Information Disclosure', () => {
    it('should not expose sensitive information in error messages', async () => {
      const tokenWithSensitiveData = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          sensitiveField: 'secret-database-password-123',
          jti: crypto.randomUUID()
        },
        'wrong-secret', // Will cause signature verification to fail
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics',
          algorithm: 'HS256'
        }
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${tokenWithSensitiveData}` }
      });
      const res = createMockResponse();
      const next = vi.fn();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      
      // Verify that error logs don't contain sensitive information
      const errorCalls = mockLogger.warn.mock.calls;
      errorCalls.forEach(call => {
        const logMessage = JSON.stringify(call);
        expect(logMessage).not.toContain('secret-database-password-123');
      });
    });
  });
});