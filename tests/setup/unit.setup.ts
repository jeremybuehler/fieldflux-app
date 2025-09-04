import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables for tests
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/fieldflux_test';
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.GOOGLE_ANALYTICS_PROPERTY_ID = 'test-ga-property';
  process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_KEY = JSON.stringify({
    type: 'service_account',
    project_id: 'test-project',
    client_email: 'test@test-project.iam.gserviceaccount.com'
  });
});

// Mock external APIs
beforeAll(() => {
  // Mock OpenAI
  vi.mock('openai', () => ({
    default: class MockOpenAI {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
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
        }
      }
    }
  }));

  // Mock Google Analytics
  vi.mock('@google-analytics/data', () => ({
    BetaAnalyticsDataClient: class MockAnalyticsClient {
      runReport = vi.fn().mockResolvedValue([{
        rows: [{
          metricValues: [
            { value: '1000' }, // sessions
            { value: '2000' }, // pageviews
            { value: '800' }, // users
            { value: '45.5' }, // bounce rate
            { value: '120' }, // avg session duration
            { value: '600' } // new users
          ]
        }]
      }]);
      
      runRealtimeReport = vi.fn().mockResolvedValue([{
        rows: [{
          metricValues: [{ value: '10' }]
        }]
      }]);
    }
  }));

  // Mock Google APIs
  vi.mock('googleapis', () => ({
    google: {
      auth: {
        GoogleAuth: vi.fn(() => ({}))
      },
      searchconsole: vi.fn(() => ({
        sites: {
          list: vi.fn().mockResolvedValue({
            data: {
              siteEntry: [{ siteUrl: 'https://test-site.com' }]
            }
          })
        },
        searchanalytics: {
          query: vi.fn().mockResolvedValue({
            data: {
              rows: [
                {
                  keys: ['test keyword'],
                  clicks: 100,
                  impressions: 1000,
                  ctr: 0.1,
                  position: 3.5
                }
              ]
            }
          })
        }
      }))
    }
  }));

  // Mock Twilio
  vi.mock('twilio', () => ({
    default: vi.fn(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          sid: 'test-message-sid',
          status: 'sent'
        })
      }
    }))
  }));

  // Mock fetch for external APIs
  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes('facebook.com')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'test-facebook-post' })
      });
    }
    if (url.includes('instagram.com')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'test-instagram-post' })
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    });
  });
});

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {
  vi.resetAllMocks();
});

// Custom matchers
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeValidUUID(): T;
      toBeValidEmail(): T;
      toHaveValidStructure(structure: Record<string, any>): T;
    }
  }
}

// Add custom Jest matchers
expect.extend({
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false
      };
    }
  },

  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false
      };
    }
  },

  toHaveValidStructure(received: any, structure: Record<string, any>) {
    const checkStructure = (obj: any, expected: any): boolean => {
      for (const [key, expectedType] of Object.entries(expected)) {
        if (!(key in obj)) {
          return false;
        }
        
        if (typeof expectedType === 'string') {
          if (typeof obj[key] !== expectedType) {
            return false;
          }
        } else if (typeof expectedType === 'object') {
          if (!checkStructure(obj[key], expectedType)) {
            return false;
          }
        }
      }
      return true;
    };
    
    const pass = checkStructure(received, structure);
    
    if (pass) {
      return {
        message: () => `expected object not to have valid structure`,
        pass: true
      };
    } else {
      return {
        message: () => `expected object to have valid structure`,
        pass: false
      };
    }
  }
});

// Console suppression for cleaner test output
const originalConsole = { ...console };

beforeAll(() => {
  console.warn = vi.fn();
  console.error = vi.fn();
  
  // Only suppress in test environment
  if (process.env.VITEST_SUPPRESS_LOGS !== 'false') {
    console.log = vi.fn();
    console.info = vi.fn();
  }
});

afterAll(() => {
  Object.assign(console, originalConsole);
});
