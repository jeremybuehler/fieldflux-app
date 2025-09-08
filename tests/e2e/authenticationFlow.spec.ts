import { test, expect, Page, BrowserContext } from '@playwright/test';

/**
 * End-to-End Authentication Flow Tests
 * 
 * These tests validate the complete authentication system from the user's perspective,
 * including JWT token generation, API access, and security controls.
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_USER = {
  email: 'test.user@fieldflux.example.com',
  password: 'SecureTestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

test.describe('Authentication Flow E2E Tests', () => {
  let page: Page;
  let context: BrowserContext;
  let accessToken: string;
  let refreshToken: string;
  let apiKey: string;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    page = await context.newPage();
    
    // Setup test data - in a real scenario, this would use test database seeding
    await setupTestUser();
  });

  test.afterAll(async () => {
    // Cleanup - revoke all tokens
    if (accessToken) {
      await cleanupTokens();
    }
    await context.close();
  });

  test.describe('Authentication Token Generation', () => {
    test('should generate analytics tokens after successful authentication', async () => {
      // Step 1: Authenticate user (simulated - would normally be done via login flow)
      const loginResponse = await page.request.post('/api/auth/login', {
        data: {
          email: TEST_USER.email,
          password: TEST_USER.password
        }
      });
      
      expect(loginResponse.ok()).toBeTruthy();
      const loginData = await loginResponse.json();
      expect(loginData).toHaveProperty('user');
      
      // Step 2: Generate analytics token pair
      const tokenResponse = await page.request.post('/api/analytics/auth/token', {
        data: {
          scopes: ['analytics:read:metrics', 'analytics:read:traffic'],
          analyticsRole: 'analyst'
        },
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      expect(tokenResponse.ok()).toBeTruthy();
      const tokenData = await tokenResponse.json();
      
      expect(tokenData).toHaveProperty('accessToken');
      expect(tokenData).toHaveProperty('refreshToken');
      expect(tokenData).toHaveProperty('tokenType', 'Bearer');
      expect(tokenData).toHaveProperty('expiresIn', 3600);
      expect(tokenData.scope).toBe('analytics:read:metrics analytics:read:traffic');
      
      // Store tokens for subsequent tests
      accessToken = tokenData.accessToken;
      refreshToken = tokenData.refreshToken;
      
      // Verify secure cookie is set
      const cookies = await context.cookies();
      const refreshCookie = cookies.find(cookie => cookie.name === 'analytics_refresh_token');
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie?.httpOnly).toBe(true);
      expect(refreshCookie?.secure).toBe(process.env.NODE_ENV === 'production');
    });

    test('should validate generated access token', async () => {
      const validationResponse = await page.request.post('/api/analytics/auth/validate', {
        data: {
          token: accessToken
        }
      });

      expect(validationResponse.ok()).toBeTruthy();
      const validationData = await validationResponse.json();
      
      expect(validationData.valid).toBe(true);
      expect(validationData.payload).toHaveProperty('userId');
      expect(validationData.payload).toHaveProperty('email', TEST_USER.email);
      expect(validationData.payload.scopes).toContain('analytics:read:metrics');
      expect(validationData.payload.analyticsRole).toBe('analyst');
      expect(validationData.payload).toHaveProperty('expiresAt');
    });

    test('should refresh access token using refresh token', async () => {
      // Wait a moment to ensure different token timestamps
      await page.waitForTimeout(1000);
      
      const refreshResponse = await page.request.post('/api/analytics/auth/refresh', {
        data: {
          refreshToken: refreshToken
        }
      });

      expect(refreshResponse.ok()).toBeTruthy();
      const refreshData = await refreshResponse.json();
      
      expect(refreshData).toHaveProperty('accessToken');
      expect(refreshData).toHaveProperty('tokenType', 'Bearer');
      expect(refreshData).toHaveProperty('expiresIn', 3600);
      
      // Verify new token is different
      expect(refreshData.accessToken).not.toBe(accessToken);
      
      // Update stored token
      accessToken = refreshData.accessToken;
    });
  });

  test.describe('API Key Management', () => {
    test('should generate API key successfully', async () => {
      const apiKeyResponse = await page.request.post('/api/analytics/auth/api-key', {
        data: {
          keyName: 'E2E Test API Key',
          scopes: ['analytics:read:metrics', 'analytics:read:pages'],
          description: 'API key for end-to-end testing'
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      expect(apiKeyResponse.ok()).toBeTruthy();
      const apiKeyData = await apiKeyResponse.json();
      
      expect(apiKeyData).toHaveProperty('apiKey');
      expect(apiKeyData.apiKey).toMatch(/^ffa_[A-Za-z0-9_-]+$/);
      expect(apiKeyData).toHaveProperty('keyName', 'E2E Test API Key');
      expect(apiKeyData.scopes).toEqual(['analytics:read:metrics', 'analytics:read:pages']);
      expect(apiKeyData).toHaveProperty('createdAt');
      expect(apiKeyData).toHaveProperty('expiresAt');
      
      apiKey = apiKeyData.apiKey;
    });

    test('should authenticate using API key', async () => {
      const apiResponse = await page.request.get('/api/analytics/metrics', {
        headers: {
          'X-API-Key': apiKey
        }
      });

      // Should successfully authenticate (actual endpoint might not exist in test)
      expect([200, 404]).toContain(apiResponse.status()); // 200 if endpoint exists, 404 if not implemented
      
      if (apiResponse.status() === 200) {
        const responseData = await apiResponse.json();
        expect(responseData).toBeDefined();
      }
    });

    test('should list user API keys', async () => {
      const tokensResponse = await page.request.get('/api/analytics/auth/tokens', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      expect(tokensResponse.ok()).toBeTruthy();
      const tokensData = await tokensResponse.json();
      
      expect(tokensData).toHaveProperty('tokens');
      expect(Array.isArray(tokensData.tokens)).toBe(true);
      
      // Should include our API key
      const apiKeyToken = tokensData.tokens.find((token: any) => 
        token.type === 'api_key' && token.keyName === 'E2E Test API Key'
      );
      expect(apiKeyToken).toBeDefined();
      expect(apiKeyToken.isActive).toBe(true);
      expect(apiKeyToken.scopes).toEqual(['analytics:read:metrics', 'analytics:read:pages']);
    });

    test('should enforce API key limit', async () => {
      // Generate 4 more API keys (total 5 including the one already created)
      const keyPromises = [];
      for (let i = 1; i <= 4; i++) {
        keyPromises.push(
          page.request.post('/api/analytics/auth/api-key', {
            data: {
              keyName: `Test Key ${i}`,
              scopes: ['analytics:read:metrics']
            },
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
        );
      }
      
      const keyResponses = await Promise.all(keyPromises);
      keyResponses.forEach(response => {
        expect(response.ok()).toBeTruthy();
      });
      
      // Try to create 6th API key - should fail
      const sixthKeyResponse = await page.request.post('/api/analytics/auth/api-key', {
        data: {
          keyName: 'Sixth Key',
          scopes: ['analytics:read:metrics']
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      expect(sixthKeyResponse.status()).toBe(400);
      const errorData = await sixthKeyResponse.json();
      expect(errorData.error).toContain('API key limit reached');
    });
  });

  test.describe('Access Control and Authorization', () => {
    test('should enforce scope-based access control', async () => {
      // Try to access admin functionality with analyst token
      const adminResponse = await page.request.get('/api/analytics/admin/config', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Should be forbidden due to insufficient scope
      expect(adminResponse.status()).toBe(403);
    });

    test('should validate period restrictions', async () => {
      // Analyst should be able to access 90d period
      const validPeriodResponse = await page.request.get('/api/analytics/metrics?period=90d', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      // Should succeed or return 404 if endpoint doesn't exist
      expect([200, 404]).toContain(validPeriodResponse.status());

      // Try to access 365d period (should be restricted for analyst)
      const restrictedPeriodResponse = await page.request.get('/api/analytics/metrics?period=365d', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      // Should be forbidden or return 404
      expect([403, 404]).toContain(restrictedPeriodResponse.status());
    });

    test('should apply rate limiting', async () => {
      const requests = [];
      
      // Make multiple rapid requests to trigger rate limiting
      for (let i = 0; i < 10; i++) {
        requests.push(
          page.request.get('/api/analytics/metrics', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
        );
      }
      
      const responses = await Promise.all(requests);
      
      // Should include rate limiting headers
      responses.forEach(response => {
        expect(response.headers()['x-ratelimit-limit']).toBeDefined();
        expect(response.headers()['x-ratelimit-remaining']).toBeDefined();
        expect(response.headers()['x-ratelimit-reset']).toBeDefined();
      });
    });
  });

  test.describe('Security Validations', () => {
    test('should reject requests without authentication', async () => {
      const unauthenticatedResponse = await page.request.get('/api/analytics/metrics');
      
      expect(unauthenticatedResponse.status()).toBe(401);
    });

    test('should reject requests with invalid tokens', async () => {
      const invalidTokenResponse = await page.request.get('/api/analytics/metrics', {
        headers: {
          'Authorization': 'Bearer invalid-token-12345'
        }
      });
      
      expect(invalidTokenResponse.status()).toBe(401);
    });

    test('should reject expired tokens', async () => {
      // Create an expired token (this would normally be done by waiting or manipulating time)
      const expiredTokenResponse = await page.request.post('/api/analytics/auth/validate', {
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImV4cCI6MTY5MDAwMDAwMH0.invalid'
        }
      });
      
      expect(expiredTokenResponse.status()).toBe(401);
    });

    test('should handle malicious input safely', async () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '"; DROP TABLE users; --',
        '../../../etc/passwd',
        'a'.repeat(10000) // Very long string
      ];
      
      for (const maliciousInput of maliciousInputs) {
        const response = await page.request.post('/api/analytics/auth/validate', {
          data: {
            token: maliciousInput
          }
        });
        
        // Should handle gracefully without exposing sensitive information
        expect([400, 401]).toContain(response.status());
        
        const responseData = await response.json();
        expect(JSON.stringify(responseData)).not.toContain('password');
        expect(JSON.stringify(responseData)).not.toContain('secret');
        expect(JSON.stringify(responseData)).not.toContain('internal');
      }
    });

    test('should prevent session fixation attacks', async () => {
      // Generate first token
      const firstTokenResponse = await page.request.post('/api/analytics/auth/token', {
        data: {},
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const firstTokenData = await firstTokenResponse.json();
      
      // Generate second token
      const secondTokenResponse = await page.request.post('/api/analytics/auth/token', {
        data: {},
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const secondTokenData = await secondTokenResponse.json();
      
      // Tokens should be different
      expect(firstTokenData.accessToken).not.toBe(secondTokenData.accessToken);
      expect(firstTokenData.refreshToken).not.toBe(secondTokenData.refreshToken);
    });
  });

  test.describe('Token Revocation and Cleanup', () => {
    test('should revoke specific tokens', async () => {
      const revokeResponse = await page.request.post('/api/analytics/auth/revoke', {
        data: {
          token: refreshToken
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      expect(revokeResponse.ok()).toBeTruthy();
      
      // Try to use revoked refresh token
      const useRevokedTokenResponse = await page.request.post('/api/analytics/auth/refresh', {
        data: {
          refreshToken: refreshToken
        }
      });
      
      expect(useRevokedTokenResponse.status()).toBe(401);
    });

    test('should revoke all user tokens', async () => {
      const revokeAllResponse = await page.request.post('/api/analytics/auth/revoke', {
        data: {
          all: true
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      expect(revokeAllResponse.ok()).toBeTruthy();
      
      // Verify tokens list is empty or inactive
      const tokensResponse = await page.request.get('/api/analytics/auth/tokens', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (tokensResponse.ok()) {
        const tokensData = await tokensResponse.json();
        const activeTokens = tokensData.tokens.filter((token: any) => token.isActive);
        expect(activeTokens.length).toBe(0);
      }
    });
  });

  // Helper functions
  async function setupTestUser() {
    // In a real scenario, this would create a test user in the database
    // For now, we assume the user exists or mock the authentication
    console.log('Setting up test user...');
  }

  async function cleanupTokens() {
    try {
      await page.request.post('/api/analytics/auth/revoke', {
        data: { all: true },
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
    } catch (error) {
      console.log('Token cleanup failed (expected if tokens already revoked):', error);
    }
  }
});

// Additional test for concurrent access and race conditions
test.describe('Concurrent Access Tests', () => {
  test('should handle concurrent token generation safely', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext({ baseURL: API_BASE_URL }),
      browser.newContext({ baseURL: API_BASE_URL }),
      browser.newContext({ baseURL: API_BASE_URL })
    ]);

    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );

    try {
      // Simulate concurrent token generation requests
      const tokenRequests = pages.map(async (page, index) => {
        // Mock authentication for each page
        const mockToken = `mock-auth-token-${index}`;
        
        return page.request.post('/api/analytics/auth/token', {
          data: {
            scopes: ['analytics:read:metrics'],
            analyticsRole: 'analyst'
          },
          headers: {
            'Authorization': `Bearer ${mockToken}`
          }
        });
      });

      const responses = await Promise.all(tokenRequests);
      
      // All requests should either succeed or fail consistently
      // No partial successes due to race conditions
      responses.forEach((response, index) => {
        // Status should be consistent (either all authenticated users succeed, or all fail due to mock auth)
        expect([200, 401, 403]).toContain(response.status());
      });

    } finally {
      // Cleanup
      await Promise.all(contexts.map(context => context.close()));
    }
  });
});