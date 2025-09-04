import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock server for external API calls
const server = setupServer(
  // OpenAI API mocks
  rest.post('https://api.openai.com/v1/chat/completions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        choices: [{
          message: {
            content: JSON.stringify({
              message: 'Test AI response',
              suggestions: [],
              quickActions: []
            })
          }
        }]
      })
    );
  }),

  // Google Analytics API mocks
  rest.post('https://analyticsdata.googleapis.com/v1beta/properties/*/runReport', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        rows: [{
          metricValues: [
            { value: '1000' },
            { value: '2000' },
            { value: '800' },
            { value: '45.5' },
            { value: '120' },
            { value: '600' }
          ]
        }]
      })
    );
  }),

  // Facebook API mocks
  rest.post('https://graph.facebook.com/*/feed', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ id: 'test-facebook-post-id' })
    );
  }),

  // Instagram API mocks
  rest.post('https://graph.instagram.com/*/media', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ id: 'test-instagram-media-id' })
    );
  }),

  // Twilio API mocks
  rest.post('https://api.twilio.com/2010-04-01/Accounts/*/Messages.json', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        sid: 'test-message-sid',
        status: 'sent'
      })
    );
  }),

  // Default fallback for unhandled requests
  rest.all('*', (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url.toString()}`);
    return res(
      ctx.status(200),
      ctx.json({ message: 'Mock response' })
    );
  })
);

// Set up test environment
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/fieldflux_test';
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.GOOGLE_ANALYTICS_PROPERTY_ID = 'test-ga-property';
  process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_KEY = JSON.stringify({
    type: 'service_account',
    project_id: 'test-project',
    client_email: 'test@test-project.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----'
  });
  process.env.TWILIO_ACCOUNT_SID = 'test-twilio-sid';
  process.env.TWILIO_AUTH_TOKEN = 'test-twilio-token';
  process.env.FACEBOOK_APP_ID = 'test-facebook-app-id';
  process.env.FACEBOOK_APP_SECRET = 'test-facebook-app-secret';
  
  // Start mock server
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers between tests
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});

// Database setup utilities for integration tests
export class TestDatabase {
  static async setup() {
    // In a real implementation, you would:
    // 1. Create a test database
    // 2. Run migrations
    // 3. Seed with test data
    console.log('Setting up test database...');
  }

  static async cleanup() {
    // In a real implementation, you would:
    // 1. Clear all test data
    // 2. Reset sequences
    // 3. Close connections
    console.log('Cleaning up test database...');
  }

  static async seed(data: any) {
    // Seed the test database with specific test data
    console.log('Seeding test database...', data);
  }
}

// Test helpers for API testing
export class TestApiHelper {
  static getAuthHeaders(userId: string = 'test-user-id') {
    return {
      'Authorization': `Bearer test-token`,
      'x-user-id': userId,
      'x-tenant-id': 'test-tenant-id'
    };
  }

  static createTestTenant() {
    return {
      id: 'test-tenant-id',
      name: 'Test Tenant',
      domain: 'test.example.com',
      plan: 'professional',
      createdAt: new Date().toISOString()
    };
  }

  static createTestUser() {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      tenantId: 'test-tenant-id',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
  }

  static createTestLead() {
    return {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      message: 'Need HVAC repair',
      source: 'website',
      urgency: 'medium' as const,
      serviceNeeded: 'HVAC Repair',
      address: '123 Test Street, Test City'
    };
  }

  static createTestSocialPost() {
    return {
      content: 'Test social media post content',
      platforms: ['facebook', 'instagram'] as const,
      mediaUrls: ['https://example.com/image.jpg'],
      tags: ['hvac', 'fieldservice']
    };
  }
}

// Mock external service responses
export const mockResponses = {
  openai: {
    chatCompletion: {
      choices: [{
        message: {
          content: JSON.stringify({
            message: 'Test AI response',
            suggestions: [{
              id: 'test-suggestion',
              title: 'Test Suggestion',
              description: 'Test description',
              category: 'social'
            }],
            quickActions: [{
              id: 'test-action',
              label: 'Test Action',
              icon: 'PlusCircle',
              action: 'test-action'
            }]
          })
        }
      }]
    }
  },

  googleAnalytics: {
    metrics: {
      sessions: 1000,
      pageviews: 2000,
      users: 800,
      bounce_rate: 45.5,
      avg_session_duration: 120,
      new_users: 600,
      returning_users: 200
    },
    trafficSources: [
      { source: 'google', medium: 'organic', sessions: 600, percentage: 60 },
      { source: 'direct', medium: '(none)', sessions: 300, percentage: 30 },
      { source: 'facebook', medium: 'social', sessions: 100, percentage: 10 }
    ]
  },

  twilio: {
    message: {
      sid: 'test-message-sid',
      status: 'sent',
      to: '+1234567890',
      from: '+0987654321',
      body: 'Test SMS message'
    }
  }
};

// Test data factories
export const testData = {
  validLead: TestApiHelper.createTestLead(),
  validUser: TestApiHelper.createTestUser(),
  validTenant: TestApiHelper.createTestTenant(),
  validSocialPost: TestApiHelper.createTestSocialPost(),
  
  invalidLead: {
    name: '', // Invalid: empty name
    email: 'invalid-email', // Invalid: malformed email
    phone: 'abc123' // Invalid: non-numeric phone
  },

  invalidSocialPost: {
    content: '', // Invalid: empty content
    platforms: [] // Invalid: no platforms selected
  }
};

// Performance testing helpers
export class PerformanceHelper {
  static async measureExecutionTime<T>(
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    return { result, duration };
  }

  static expectExecutionTimeUnder(duration: number, maxTime: number) {
    expect(duration).toBeLessThan(maxTime);
  }
}
