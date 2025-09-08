import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import analyticsAuthRoutes from '../../../server/routes/analyticsAuthRoutes';

// Mock dependencies
vi.mock('../../../server/middleware/authMiddleware');
vi.mock('../../../server/services/analyticsTokenService');
vi.mock('../../../server/storage');
vi.mock('../../../server/lib/logger');
vi.mock('../../../server/lib/rate-limit');

const mockAuthMiddleware = {
  authenticateJWT: vi.fn((req, res, next) => {
    req.user = mockUser;
    next();
  }),
  requireEmailVerification: vi.fn((req, res, next) => next())
};

const mockAnalyticsTokenService = {
  generateTokenPair: vi.fn(),
  generateApiKeyToken: vi.fn(),
  refreshAccessToken: vi.fn(),
  revokeToken: vi.fn(),
  revokeAllUserTokens: vi.fn(),
  validateToken: vi.fn(),
  listUserTokens: vi.fn()
};

const mockRateLimiter = vi.fn((req, res, next) => next());

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};

vi.mocked(require('../../../server/middleware/authMiddleware')).authenticateJWT = mockAuthMiddleware.authenticateJWT;
vi.mocked(require('../../../server/middleware/authMiddleware')).requireEmailVerification = mockAuthMiddleware.requireEmailVerification;
vi.mocked(require('../../../server/services/analyticsTokenService')).analyticsTokenService = mockAnalyticsTokenService;
vi.mocked(require('../../../server/lib/rate-limit')).rateLimiter = mockRateLimiter;
vi.mocked(require('../../../server/lib/logger')).logger = mockLogger;

// Test data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  emailVerified: true,
  tenantId: 'tenant-456',
  role: 'admin'
};

const TEST_JWT_SECRET = 'test-jwt-secret-for-routes';

// Test app setup
let app: express.Application;

describe('Analytics Auth Routes Integration', () => {
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/analytics/auth', analyticsAuthRoutes);
    
    // Add correlation ID middleware for testing
    app.use((req: any, res, next) => {
      req.correlationId = 'test-correlation-id';
      next();
    });

    // Error handling middleware
    app.use((error: any, req: any, res: any, next: any) => {
      res.status(error.statusCode || 500).json({
        error: error.message || 'Internal server error'
      });
    });

    process.env.JWT_SECRET = TEST_JWT_SECRET;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  describe('POST /api/analytics/auth/token', () => {
    it('should generate analytics token pair successfully', async () => {
      const tokenPair = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456'
      };

      mockAnalyticsTokenService.generateTokenPair.mockResolvedValue(tokenPair);

      const response = await request(app)
        .post('/api/analytics/auth/token')
        .send({
          scopes: ['analytics:read:metrics'],
          analyticsRole: 'analyst'
        })
        .expect(200);

      expect(response.body).toMatchObject({
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        tokenType: 'Bearer',
        expiresIn: 3600,
        scope: 'analytics:read:metrics'
      });

      expect(mockAnalyticsTokenService.generateTokenPair).toHaveBeenCalledWith(
        mockUser,
        {
          scopes: ['analytics:read:metrics'],
          analyticsRole: 'analyst'
        }
      );
    });

    it('should set secure HTTP-only cookie for refresh token', async () => {
      const tokenPair = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456'
      };

      mockAnalyticsTokenService.generateTokenPair.mockResolvedValue(tokenPair);

      const response = await request(app)
        .post('/api/analytics/auth/token')
        .send({})
        .expect(200);

      expect(response.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('analytics_refresh_token=')
        ])
      );
    });

    it('should handle token generation failure', async () => {
      mockAnalyticsTokenService.generateTokenPair.mockRejectedValue(
        new Error('Token generation failed')
      );

      const response = await request(app)
        .post('/api/analytics/auth/token')
        .send({})
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('POST /api/analytics/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      const refreshToken = 'refresh-token-456';
      const newAccessToken = 'new-access-token-789';

      mockAnalyticsTokenService.refreshAccessToken.mockResolvedValue(newAccessToken);

      const response = await request(app)
        .post('/api/analytics/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        accessToken: newAccessToken,
        tokenType: 'Bearer',
        expiresIn: 3600
      });
    });

    it('should return 400 when no refresh token provided', async () => {
      const response = await request(app)
        .post('/api/analytics/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Refresh token required'
      });
    });

    it('should handle invalid refresh token', async () => {
      mockAnalyticsTokenService.refreshAccessToken.mockRejectedValue(
        new Error('Invalid refresh token')
      );

      const response = await request(app)
        .post('/api/analytics/auth/refresh')
        .send({ refreshToken: 'invalid' })
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'Invalid or expired refresh token'
      });
    });
  });

  describe('POST /api/analytics/auth/api-key', () => {
    it('should generate API key successfully', async () => {
      const apiKeyData = {
        key: 'ffa_test_api_key_12345',
        token: 'jwt-token-for-api-key'
      };

      mockAnalyticsTokenService.generateApiKeyToken.mockResolvedValue(apiKeyData);
      mockAnalyticsTokenService.listUserTokens.mockResolvedValue([]);

      const response = await request(app)
        .post('/api/analytics/auth/api-key')
        .send({
          keyName: 'My Analytics API Key',
          scopes: ['analytics:read:metrics', 'analytics:read:traffic']
        })
        .expect(200);

      expect(response.body).toMatchObject({
        apiKey: apiKeyData.key,
        keyName: 'My Analytics API Key',
        scopes: ['analytics:read:metrics', 'analytics:read:traffic']
      });
    });

    it('should enforce API key limit', async () => {
      const existingKeys = Array(5).fill(0).map((_, i) => ({ 
        jti: `key-${i}`, 
        type: 'api_key' 
      }));

      mockAnalyticsTokenService.listUserTokens.mockResolvedValue(existingKeys);

      const response = await request(app)
        .post('/api/analytics/auth/api-key')
        .send({
          keyName: 'Another Key',
          scopes: ['analytics:read:metrics']
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'API key limit reached. Please revoke unused keys.'
      });
    });
  });

  describe('POST /api/analytics/auth/validate', () => {
    it('should validate valid token', async () => {
      const validationResult = {
        valid: true,
        payload: {
          sub: 'user-123',
          email: 'test@example.com',
          scopes: ['analytics:read:metrics'],
          analyticsRole: 'analyst',
          exp: Math.floor(Date.now() / 1000) + 3600
        }
      };

      mockAnalyticsTokenService.validateToken.mockResolvedValue(validationResult);

      const response = await request(app)
        .post('/api/analytics/auth/validate')
        .send({ token: 'valid-token' })
        .expect(200);

      expect(response.body).toMatchObject({
        valid: true,
        payload: expect.objectContaining({
          userId: 'user-123',
          email: 'test@example.com'
        })
      });
    });

    it('should handle invalid token', async () => {
      const validationResult = {
        valid: false,
        error: 'Token signature verification failed'
      };

      mockAnalyticsTokenService.validateToken.mockResolvedValue(validationResult);

      const response = await request(app)
        .post('/api/analytics/auth/validate')
        .send({ token: 'invalid-token' })
        .expect(401);

      expect(response.body).toMatchObject({
        valid: false,
        error: 'Token signature verification failed'
      });
    });
  });

  describe('security tests', () => {
    it('should apply rate limiting', async () => {
      mockRateLimiter.mockImplementation((req, res, next) => {
        res.status(429).json({ error: 'Too many requests' });
      });

      await request(app)
        .post('/api/analytics/auth/token')
        .send({})
        .expect(429);
    });

    it('should require authentication for protected endpoints', async () => {
      mockAuthMiddleware.authenticateJWT.mockImplementation((req, res, next) => {
        res.status(401).json({ error: 'Authentication required' });
      });

      await request(app)
        .post('/api/analytics/auth/token')
        .send({})
        .expect(401);
    });
  });
});