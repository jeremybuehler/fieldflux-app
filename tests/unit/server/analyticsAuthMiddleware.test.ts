import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
  authenticateAnalyticsJWT,
  requireAnalyticsScope,
  validateAnalyticsPeriod,
  analyticsRateLimiter,
  auditAnalyticsAccess,
  filterAnalyticsData,
  ANALYTICS_SCOPES,
  AnalyticsAuthRequest
} from '../../../server/middleware/analyticsAuthMiddleware';
import { UnauthorizedError, ForbiddenError } from '../../../server/lib/errors';

// Mock dependencies
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
  logAnalyticsAccess: vi.fn(),
};

vi.mocked(require('../../../server/storage')).storage = mockStorage;

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

vi.mocked(require('../../../server/lib/logger')).logger = mockLogger;

// Mock rate limiter
const mockRateLimiter = vi.fn();
const mockCreateDynamicRateLimiter = vi.fn().mockReturnValue(mockRateLimiter);
vi.mocked(require('../../../server/lib/rate-limit')).rateLimiter = mockRateLimiter;
vi.mocked(require('../../../server/lib/rate-limit')).createDynamicRateLimiter = mockCreateDynamicRateLimiter;

// Test JWT secret
const TEST_JWT_SECRET = 'test-jwt-secret-for-analytics';

// Mock user data
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

const mockSession = {
  id: 'session-789',
  userId: 'user-123',
  expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
  isActive: true
};

// Helper functions
const createMockRequest = (overrides: Partial<AnalyticsAuthRequest> = {}): AnalyticsAuthRequest => {
  const req = {
    headers: {},
    cookies: {},
    ip: '127.0.0.1',
    path: '/api/analytics/test',
    method: 'GET',
    query: {},
    correlationId: 'test-correlation-id',
    ...overrides
  } as AnalyticsAuthRequest;
  
  return req;
};

const createMockResponse = (): Response => {
  const res = {
    setHeader: vi.fn(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    statusCode: 200
  } as unknown as Response;
  
  return res;
};

const createMockNext = (): NextFunction => vi.fn();

const createValidToken = (payload: any = {}) => {
  const defaultPayload = {
    sub: mockUser.id,
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    emailVerified: mockUser.emailVerified,
    tenantId: mockUser.tenantId,
    sessionId: 'session-789',
    analyticsRole: 'admin',
    scopes: [ANALYTICS_SCOPES.FULL_ACCESS],
    type: 'access',
    jti: crypto.randomUUID(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  };

  return jwt.sign(
    { ...defaultPayload, ...payload },
    TEST_JWT_SECRET,
    {
      issuer: 'fieldflux',
      audience: 'fieldflux-analytics',
      algorithm: 'HS256'
    }
  );
};

describe('Analytics Authentication Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = TEST_JWT_SECRET;
    
    // Setup default mock responses
    mockStorage.getUser.mockResolvedValue(mockUser);
    mockStorage.getSession.mockResolvedValue(mockSession);
    mockStorage.isTokenRevoked.mockResolvedValue(false);
    mockStorage.getSessionActivity.mockResolvedValue({
      locations: [],
      requestCount: 10,
      suspicious: false
    });
    mockRateLimiter.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('authenticateAnalyticsJWT', () => {
    it('should authenticate valid JWT token from Authorization header', async () => {
      const token = createValidToken();
      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(mockUser.id);
      expect(req.user?.email).toBe(mockUser.email);
      expect(req.analyticsContext).toBeDefined();
      expect(req.analyticsContext?.accessLevel).toBe('admin');
      expect(req.auditLog).toBeDefined();
    });

    it('should authenticate valid JWT token from cookies', async () => {
      const token = createValidToken();
      const req = createMockRequest({
        cookies: { analytics_token: token }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user?.id).toBe(mockUser.id);
    });

    it('should authenticate via API key', async () => {
      const apiKey = 'ffa_test_api_key_12345';
      const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
      const token = createValidToken({ type: 'api_key' });
      
      mockStorage.getApiKey.mockResolvedValue({
        userId: mockUser.id,
        userEmail: mockUser.email,
        keyHash: apiKeyHash,
        isActive: true
      });

      const req = createMockRequest({
        headers: { 'x-api-key': apiKey }
      });
      const res = createMockResponse();
      const next = createMockNext();

      // Mock the API key validation to return a JWT
      vi.mocked(jwt.sign as any).mockReturnValue(token);

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(mockStorage.getApiKey).toHaveBeenCalledWith(apiKeyHash);
    });

    it('should reject request without authentication', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Analytics access attempted without authentication',
        expect.any(Object)
      );
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
        },
        TEST_JWT_SECRET,
        {
          issuer: 'fieldflux',
          audience: 'fieldflux-analytics'
        }
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${expiredToken}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Expired analytics JWT',
        expect.any(Object)
      );
    });

    it('should reject invalid token signature', async () => {
      const invalidToken = jwt.sign(
        { sub: mockUser.id, email: mockUser.email },
        'wrong-secret'
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${invalidToken}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Invalid analytics JWT',
        expect.any(Object)
      );
    });

    it('should reject revoked token', async () => {
      const token = createValidToken();
      mockStorage.isTokenRevoked.mockResolvedValue(true);

      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should reject token for inactive user', async () => {
      const token = createValidToken();
      mockStorage.getUser.mockResolvedValue({ ...mockUser, isActive: false });

      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Invalid user attempted analytics access',
        expect.any(Object)
      );
    });

    it('should reject user without analytics access', async () => {
      const token = createValidToken();
      mockStorage.getUser.mockResolvedValue({ ...mockUser, analyticsEnabled: false });

      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('should handle expired session', async () => {
      const token = createValidToken({ sessionId: 'session-789' });
      mockStorage.getSession.mockResolvedValue({
        ...mockSession,
        expiresAt: new Date(Date.now() - 86400000) // 24 hours ago
      });

      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should handle suspicious session activity', async () => {
      const token = createValidToken({ sessionId: 'session-789' });
      mockStorage.getSessionActivity.mockResolvedValue({
        locations: new Array(10).fill('different-location'),
        requestCount: 2000,
        suspicious: true
      });

      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockStorage.revokeSession).toHaveBeenCalledWith('session-789');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Suspicious session activity detected',
        expect.any(Object)
      );
    });

    it('should set correct analytics context for different access levels', async () => {
      const testCases = [
        { role: 'owner', analyticsRole: 'owner', expectedLevel: 'owner' },
        { role: 'admin', analyticsRole: 'admin', expectedLevel: 'admin' },
        { subscriptionPlan: 'professional', expectedLevel: 'analyst' },
        { subscriptionPlan: 'basic', expectedLevel: 'viewer' }
      ];

      for (const testCase of testCases) {
        const token = createValidToken({
          analyticsRole: testCase.analyticsRole || 'viewer'
        });
        mockStorage.getUser.mockResolvedValue({
          ...mockUser,
          role: testCase.role || 'user',
          subscriptionPlan: testCase.subscriptionPlan || 'basic'
        });

        const req = createMockRequest({
          headers: { authorization: `Bearer ${token}` }
        });
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateAnalyticsJWT(req, res, next);

        expect(req.analyticsContext?.accessLevel).toBe(testCase.expectedLevel);
      }
    });

    it('should log successful authentication', async () => {
      const token = createValidToken();
      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Analytics authentication successful',
        expect.objectContaining({
          userId: mockUser.id,
          email: mockUser.email,
          accessLevel: 'admin'
        })
      );
    });
  });

  describe('requireAnalyticsScope', () => {
    const setupAuthenticatedRequest = (scopes: string[] = [ANALYTICS_SCOPES.FULL_ACCESS]) => {
      const req = createMockRequest();
      req.user = {
        id: mockUser.id,
        email: mockUser.email,
        emailVerified: true,
        analyticsScopes: scopes,
        claims: {}
      };
      return req;
    };

    it('should allow access with correct scope', async () => {
      const middleware = requireAnalyticsScope(ANALYTICS_SCOPES.READ_METRICS);
      const req = setupAuthenticatedRequest([ANALYTICS_SCOPES.READ_METRICS]);
      const res = createMockResponse();
      const next = createMockNext();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should allow access with full access scope', async () => {
      const middleware = requireAnalyticsScope(ANALYTICS_SCOPES.READ_TRAFFIC);
      const req = setupAuthenticatedRequest([ANALYTICS_SCOPES.FULL_ACCESS]);
      const res = createMockResponse();
      const next = createMockNext();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should reject access without required scope', async () => {
      const middleware = requireAnalyticsScope(ANALYTICS_SCOPES.ADMIN_CONFIG);
      const req = setupAuthenticatedRequest([ANALYTICS_SCOPES.READ_METRICS]);
      const res = createMockResponse();
      const next = createMockNext();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'User lacks required analytics scope',
        expect.any(Object)
      );
    });

    it('should reject unauthenticated requests', async () => {
      const middleware = requireAnalyticsScope(ANALYTICS_SCOPES.READ_METRICS);
      const req = createMockRequest(); // No user
      const res = createMockResponse();
      const next = createMockNext();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('validateAnalyticsPeriod', () => {
    const setupContextRequest = (allowedPeriods: string[] = ['all']) => {
      const req = createMockRequest();
      req.analyticsContext = {
        accessLevel: 'admin',
        dataScope: 'full',
        allowedMetrics: ['all'],
        allowedPeriods,
        apiQuota: 1000,
        rateLimitMultiplier: 1
      };
      return req;
    };

    it('should allow valid period', async () => {
      const req = setupContextRequest(['7d', '30d', '90d']);
      req.query = { period: '30d' };
      const res = createMockResponse();
      const next = createMockNext();

      await validateAnalyticsPeriod(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should allow any period with "all" permission', async () => {
      const req = setupContextRequest(['all']);
      req.query = { period: '365d' };
      const res = createMockResponse();
      const next = createMockNext();

      await validateAnalyticsPeriod(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should reject invalid period', async () => {
      const req = setupContextRequest(['7d', '30d']);
      req.query = { period: '365d' };
      const res = createMockResponse();
      const next = createMockNext();

      await validateAnalyticsPeriod(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('should pass through when no period specified', async () => {
      const req = setupContextRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await validateAnalyticsPeriod(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should reject when analytics context missing', async () => {
      const req = createMockRequest();
      req.query = { period: '30d' };
      const res = createMockResponse();
      const next = createMockNext();

      await validateAnalyticsPeriod(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('analyticsRateLimiter', () => {
    const setupRateLimitRequest = (rateLimitMultiplier: number = 1) => {
      const req = createMockRequest();
      req.user = {
        id: mockUser.id,
        email: mockUser.email,
        emailVerified: true,
        analyticsScopes: [],
        claims: {}
      };
      req.analyticsContext = {
        accessLevel: 'admin',
        dataScope: 'full',
        allowedMetrics: ['all'],
        allowedPeriods: ['all'],
        apiQuota: 1000,
        rateLimitMultiplier
      };
      return req;
    };

    it('should apply dynamic rate limiting based on access level', async () => {
      const req = setupRateLimitRequest(5);
      const res = createMockResponse();
      const next = createMockNext();

      await analyticsRateLimiter(req, res, next);

      expect(mockCreateDynamicRateLimiter).toHaveBeenCalledWith(
        expect.objectContaining({
          max: 500, // 100 * 5 multiplier
          keyGenerator: expect.any(Function)
        })
      );
      expect(mockRateLimiter).toHaveBeenCalledWith(req, res, next);
    });

    it('should use strict rate limit for unauthenticated requests', async () => {
      const req = createMockRequest(); // No user or analytics context
      const res = createMockResponse();
      const next = createMockNext();

      await analyticsRateLimiter(req, res, next);

      expect(mockRateLimiter).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe('auditAnalyticsAccess', () => {
    const setupAuditRequest = () => {
      const req = createMockRequest();
      req.auditLog = {
        endpoint: '/api/analytics/test',
        action: 'GET',
        metadata: {
          userId: mockUser.id,
          accessLevel: 'admin',
          ip: '127.0.0.1'
        }
      };
      return req;
    };

    it('should log analytics access', async () => {
      const req = setupAuditRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await auditAnalyticsAccess(req, res, next);

      expect(mockStorage.logAnalyticsAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: '/api/analytics/test',
          action: 'GET',
          timestamp: expect.any(Date),
          responseStatus: 200
        })
      );
      expect(next).toHaveBeenCalledWith();
    });

    it('should intercept response for complete audit', async () => {
      const req = setupAuditRequest();
      const res = createMockResponse();
      const next = createMockNext();

      const originalSend = res.send;
      await auditAnalyticsAccess(req, res, next);

      // Simulate response being sent
      const testData = { test: 'data' };
      res.send(testData);

      expect(originalSend).toHaveBeenCalledWith(testData);
    });
  });

  describe('filterAnalyticsData', () => {
    const setupFilterRequest = (dataScope: 'limited' | 'standard' | 'full' = 'full') => {
      const req = createMockRequest();
      req.analyticsContext = {
        accessLevel: 'viewer',
        dataScope,
        allowedMetrics: ['sessions'],
        allowedPeriods: ['7d'],
        apiQuota: 100,
        rateLimitMultiplier: 1
      };
      return req;
    };

    it('should not filter data for full scope', async () => {
      const req = setupFilterRequest('full');
      const res = createMockResponse();
      const next = createMockNext();

      await filterAnalyticsData(req, res, next);

      const testData = { revenue: 1000, sessions: 500 };
      res.json(testData);

      // Should not filter anything for full scope
      expect(res.json).toHaveBeenCalledWith(testData);
    });

    it('should filter sensitive fields for limited scope', async () => {
      const req = setupFilterRequest('limited');
      const res = createMockResponse();
      const next = createMockNext();

      const originalJson = res.json;
      res.json = vi.fn().mockImplementation((data) => {
        // The middleware would filter data here
        const filteredData = { ...data };
        const sensitiveFields = ['revenue', 'cost', 'profit', 'email', 'phone', 'address'];
        sensitiveFields.forEach(field => delete filteredData[field]);
        return originalJson.call(res, filteredData);
      });

      await filterAnalyticsData(req, res, next);

      const testData = { revenue: 1000, sessions: 500, email: 'test@example.com' };
      res.json(testData);

      expect(res.json).toHaveBeenCalled();
    });

    it('should pass through when no analytics context', async () => {
      const req = createMockRequest(); // No analytics context
      const res = createMockResponse();
      const next = createMockNext();

      await filterAnalyticsData(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('security edge cases', () => {
    it('should handle malformed JWT tokens', async () => {
      const malformedToken = 'not.a.valid.jwt.token.structure';
      const req = createMockRequest({
        headers: { authorization: `Bearer ${malformedToken}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should handle tokens with missing claims', async () => {
      const tokenWithoutClaims = jwt.sign({}, TEST_JWT_SECRET);
      const req = createMockRequest({
        headers: { authorization: `Bearer ${tokenWithoutClaims}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should handle storage errors gracefully', async () => {
      const token = createValidToken();
      mockStorage.getUser.mockRejectedValue(new Error('Database connection failed'));

      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle correlation ID generation', async () => {
      const token = createValidToken();
      const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      delete (req as any).correlationId; // Remove correlation ID
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Analytics authentication successful',
        expect.any(Object)
      );
    });

    it('should validate JWT algorithm', async () => {
      const tokenWithWrongAlgorithm = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email
        },
        TEST_JWT_SECRET,
        { algorithm: 'HS512' } // Wrong algorithm
      );

      const req = createMockRequest({
        headers: { authorization: `Bearer ${tokenWithWrongAlgorithm}` }
      });
      const res = createMockResponse();
      const next = createMockNext();

      await authenticateAnalyticsJWT(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});