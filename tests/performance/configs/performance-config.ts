/**
 * Performance Testing Configuration
 * Centralized configuration for all performance testing scenarios
 */

export const PERFORMANCE_CONFIG = {
  // Base configuration
  baseUrl: process.env.PERF_BASE_URL || 'http://localhost:5000',
  testDuration: {
    quick: '30s',
    standard: '2m',
    extended: '10m',
    endurance: '30m'
  },
  
  // Load testing parameters
  load: {
    light: { users: 10, rampUp: '30s' },
    medium: { users: 50, rampUp: '1m' },
    heavy: { users: 200, rampUp: '2m' },
    stress: { users: 500, rampUp: '5m' }
  },
  
  // Performance thresholds (SLA targets)
  thresholds: {
    api: {
      responseTime: {
        p95: 500, // 95th percentile < 500ms
        p99: 1000, // 99th percentile < 1s
        avg: 200   // average < 200ms
      },
      errorRate: 1, // < 1% error rate
      throughput: 100 // > 100 requests/second
    },
    database: {
      queryTime: {
        simple: 50,  // < 50ms for simple queries
        complex: 200, // < 200ms for complex queries
        aggregation: 500 // < 500ms for aggregation queries
      },
      connections: 50, // max concurrent connections
      deadlocks: 0     // zero deadlocks allowed
    },
    frontend: {
      lighthouse: {
        performance: 90,
        accessibility: 95,
        bestPractices: 90,
        seo: 90
      },
      webVitals: {
        lcp: 2500,    // Largest Contentful Paint < 2.5s
        fid: 100,     // First Input Delay < 100ms
        cls: 0.1,     // Cumulative Layout Shift < 0.1
        fcp: 1800,    // First Contentful Paint < 1.8s
        tti: 3800     // Time to Interactive < 3.8s
      },
      bundleSize: {
        initial: 500000,    // < 500KB initial bundle
        total: 2000000,     // < 2MB total bundle size
        chunks: 250000      // < 250KB per chunk
      }
    },
    memory: {
      heapUsed: 512 * 1024 * 1024,     // < 512MB heap
      heapTotal: 1024 * 1024 * 1024,   // < 1GB total heap
      external: 100 * 1024 * 1024,     // < 100MB external
      rss: 1024 * 1024 * 1024          // < 1GB RSS
    }
  },
  
  // Critical API endpoints for testing
  endpoints: {
    auth: [
      { path: '/api/health', method: 'GET' },
      { path: '/api/auth/user', method: 'GET' },
      { path: '/api/login', method: 'GET' }
    ],
    core: [
      { path: '/api/dashboard/metrics', method: 'GET', auth: true },
      { path: '/api/leads', method: 'GET', auth: true },
      { path: '/api/leads', method: 'POST', auth: true },
      { path: '/api/social/posts', method: 'GET', auth: true },
      { path: '/api/social/posts', method: 'POST', auth: true },
      { path: '/api/wordpress/posts', method: 'GET', auth: true }
    ],
    ai: [
      { path: '/api/ai/generate-blog', method: 'POST', auth: true },
      { path: '/api/social/generate-post', method: 'POST' },
      { path: '/api/felix/chat', method: 'POST', auth: true },
      { path: '/api/felix/content-ideas', method: 'POST', auth: true }
    ],
    analytics: [
      { path: '/api/analytics/metrics', method: 'GET' },
      { path: '/api/analytics/traffic-sources', method: 'GET' },
      { path: '/api/reviews/analytics', method: 'GET' },
      { path: '/api/analytics/generate-report', method: 'POST' }
    ],
    external: [
      { path: '/api/places/search', method: 'GET' },
      { path: '/api/weather/winter-haven', method: 'GET' },
      { path: '/api/reviews/google', method: 'GET' }
    ]
  },
  
  // Database performance scenarios
  database: {
    scenarios: [
      {
        name: 'User Authentication',
        queries: [
          'SELECT * FROM users WHERE id = $1',
          'SELECT * FROM sessions WHERE sid = $1'
        ]
      },
      {
        name: 'Dashboard Metrics',
        queries: [
          'SELECT COUNT(*) FROM leads WHERE created_at > $1',
          'SELECT COUNT(*) FROM social_posts WHERE created_at > $1',
          'SELECT COUNT(*) FROM wordpress_posts WHERE created_at > $1'
        ]
      },
      {
        name: 'Lead Management',
        queries: [
          'SELECT * FROM leads ORDER BY created_at DESC LIMIT 50',
          'INSERT INTO leads (name, email, phone, source) VALUES ($1, $2, $3, $4)',
          'UPDATE leads SET status = $1 WHERE id = $2'
        ]
      },
      {
        name: 'Content Analytics',
        queries: [
          'SELECT COUNT(*), AVG(engagement_score) FROM social_posts',
          'SELECT * FROM analytics_reports WHERE created_at > $1',
          'SELECT platform, COUNT(*) FROM social_posts GROUP BY platform'
        ]
      }
    ]
  },
  
  // Test data generators
  testData: {
    users: {
      count: 1000,
      generator: () => ({
        name: `Test User ${Math.floor(Math.random() * 10000)}`,
        email: `test${Math.floor(Math.random() * 10000)}@example.com`,
        phone: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      })
    },
    leads: {
      count: 5000,
      sources: ['website', 'facebook', 'google', 'referral', 'direct']
    },
    socialPosts: {
      count: 2000,
      platforms: ['facebook', 'instagram', 'twitter', 'linkedin'],
      contentTypes: ['promotional', 'educational', 'seasonal', 'emergency']
    }
  },
  
  // Report configuration
  reporting: {
    outputDir: 'tests/performance/reports',
    formats: ['html', 'json', 'csv'],
    metrics: [
      'responseTime',
      'throughput',
      'errorRate',
      'memoryUsage',
      'cpuUsage',
      'databaseConnections'
    ]
  }
} as const;

// Environment-specific overrides
if (process.env.NODE_ENV === 'production') {
  PERFORMANCE_CONFIG.load.stress.users = 1000;
  PERFORMANCE_CONFIG.testDuration.endurance = '60m';
}

export type PerformanceConfig = typeof PERFORMANCE_CONFIG;
export default PERFORMANCE_CONFIG;