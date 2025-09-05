/**
 * K6 Load Testing Script for FieldFlux API
 * Comprehensive API performance testing with detailed metrics
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { randomItem, randomIntBetween, randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');
const requestCount = new Counter('requests');

// Configuration
const BASE_URL = __ENV.PERF_BASE_URL || 'http://localhost:5000';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Warm-up
    { duration: '1m', target: 50 },    // Ramp-up
    { duration: '3m', target: 50 },    // Sustained load
    { duration: '1m', target: 100 },   // Peak load
    { duration: '30s', target: 0 },    // Cool-down
  ],
  
  // Performance thresholds
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000', 'avg<200'],
    'http_req_failed': ['rate<0.01'], // Less than 1% error rate
    'errors': ['rate<0.01'],
    'response_time': ['p(95)<500'],
    'requests': ['count>1000'] // Minimum request volume
  },
  
  // Test data
  ext: {
    loadimpact: {
      projectID: 'fieldflux-performance',
      name: 'API Load Test'
    }
  }
};

// Test data generators
const leadSources = ['website', 'facebook', 'google', 'referral', 'direct'];
const platforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
const businessTypes = ['HVAC', 'Plumbing', 'Electrical', 'Landscaping'];

function generateLead() {
  return {
    name: `Test Customer ${randomIntBetween(1, 10000)}`,
    email: `test${randomIntBetween(1, 10000)}@example.com`,
    phone: `555-${String(randomIntBetween(1000, 9999))}`,
    source: randomItem(leadSources),
    service_type: randomItem(['Maintenance', 'Emergency Repair', 'Installation']),
    message: 'Performance test lead'
  };
}

// Main test scenarios
export default function () {
  const scenario = Math.random();
  
  if (scenario < 0.3) {
    testHealthAndAuth();
  } else if (scenario < 0.6) {
    testLeadManagement();
  } else if (scenario < 0.8) {
    testSocialMedia();
  } else {
    testAnalytics();
  }
  
  sleep(randomIntBetween(1, 3));
}

function testHealthAndAuth() {
  const group = 'Health_and_Auth';
  
  // Health check
  let response = http.get(`${BASE_URL}/api/health`, {
    tags: { group, endpoint: 'health' }
  });
  
  check(response, {
    'health check status is 200': (r) => r.status === 200,
    'health check has status field': (r) => JSON.parse(r.body).status !== undefined,
    'health check response time < 100ms': (r) => r.timings.duration < 100,
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
  
  // Dev status
  response = http.get(`${BASE_URL}/api/dev/status`, {
    tags: { group, endpoint: 'dev-status' }
  });
  
  check(response, {
    'dev status responds': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
}

function testLeadManagement() {
  const group = 'Lead_Management';
  
  // Get leads (may require auth)
  let response = http.get(`${BASE_URL}/api/leads`, {
    tags: { group, endpoint: 'get-leads' }
  });
  
  check(response, {
    'get leads responds': (r) => r.status === 200 || r.status === 401,
    'get leads response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
  
  // Create lead
  const leadData = generateLead();
  response = http.post(`${BASE_URL}/api/leads`, JSON.stringify(leadData), {
    headers: { 'Content-Type': 'application/json' },
    tags: { group, endpoint: 'create-lead' }
  });
  
  check(response, {
    'create lead responds': (r) => [200, 201, 401].includes(r.status),
    'create lead response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
}

function testSocialMedia() {
  const group = 'Social_Media';
  
  // Get social posts
  let response = http.get(`${BASE_URL}/api/social/posts`, {
    tags: { group, endpoint: 'get-social-posts' }
  });
  
  check(response, {
    'get social posts responds': (r) => r.status === 200 || r.status === 401,
    'get social posts response time < 400ms': (r) => r.timings.duration < 400,
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
  
  // Generate social post (AI operation - higher latency expected)
  const postData = {
    prompt: `Create a ${randomItem(['seasonal', 'maintenance', 'emergency'])} tip for ${randomItem(businessTypes)}`,
    platform: randomItem(platforms),
    businessType: randomItem(businessTypes),
    tone: 'professional'
  };
  
  response = http.post(`${BASE_URL}/api/social/generate-post`, JSON.stringify(postData), {
    headers: { 'Content-Type': 'application/json' },
    tags: { group, endpoint: 'generate-social-post' }
  });
  
  check(response, {
    'generate social post responds': (r) => [200, 401].includes(r.status),
    'generate social post response time < 5000ms': (r) => r.timings.duration < 5000, // AI operations can be slow
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
}

function testAnalytics() {
  const group = 'Analytics';
  
  // Analytics metrics
  let response = http.get(`${BASE_URL}/api/analytics/metrics`, {
    tags: { group, endpoint: 'analytics-metrics' }
  });
  
  check(response, {
    'analytics metrics responds': (r) => [200, 500].includes(r.status), // May fail if no GA setup
    'analytics metrics response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
  
  // Traffic sources
  response = http.get(`${BASE_URL}/api/analytics/traffic-sources`, {
    tags: { group, endpoint: 'traffic-sources' }
  });
  
  check(response, {
    'traffic sources responds': (r) => [200, 500].includes(r.status),
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
  
  // Weather API (external dependency)
  response = http.get(`${BASE_URL}/api/weather/winter-haven`, {
    tags: { group, endpoint: 'weather' }
  });
  
  check(response, {
    'weather API responds': (r) => [200, 500].includes(r.status),
    'weather API response time < 2000ms': (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);
  
  responseTime.add(response.timings.duration);
  requestCount.add(1);
}

// Setup function - runs once before the test
export function setup() {
  console.log('Starting K6 Performance Test for FieldFlux API');
  console.log(`Base URL: ${BASE_URL}`);
  
  // Verify the service is running
  const response = http.get(`${BASE_URL}/api/health`);
  if (response.status !== 200) {
    throw new Error(`Service not available at ${BASE_URL}. Status: ${response.status}`);
  }
  
  return { baseUrl: BASE_URL, startTime: new Date() };
}

// Teardown function - runs once after the test
export function teardown(data) {
  const endTime = new Date();
  const duration = (endTime - data.startTime) / 1000;
  console.log(`K6 Performance Test completed in ${duration} seconds`);
}

// Health check scenario for CI/CD
export function healthCheck() {
  const response = http.get(`${BASE_URL}/api/health`);
  
  check(response, {
    'service is available': (r) => r.status === 200,
    'response time acceptable': (r) => r.timings.duration < 1000,
  });
  
  return response.status === 200;
}