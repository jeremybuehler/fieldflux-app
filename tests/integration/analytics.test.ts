import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { TestDatabase, TestApiHelper, mockResponses, PerformanceHelper } from '../setup/integration.setup';

// Mock the analytics service for integration tests
import { vi } from 'vitest';

vi.mock('@server/services/google-analytics', () => ({
  googleAnalyticsService: {
    getMetrics: vi.fn().mockResolvedValue(mockResponses.googleAnalytics.metrics),
    getTrafficSources: vi.fn().mockResolvedValue(mockResponses.googleAnalytics.trafficSources),
    getTopPages: vi.fn().mockResolvedValue([
      { page: '/services', pageviews: 1000, unique_pageviews: 800, avg_time_on_page: 120, bounce_rate: 30 },
      { page: '/contact', pageviews: 500, unique_pageviews: 400, avg_time_on_page: 90, bounce_rate: 45 }
    ]),
    getLocationData: vi.fn().mockResolvedValue([
      { country: 'United States', sessions: 800, percentage: 80 },
      { country: 'Canada', sessions: 200, percentage: 20 }
    ]),
    getDeviceData: vi.fn().mockResolvedValue([
      { device: 'desktop', sessions: 600, percentage: 60 },
      { device: 'mobile', sessions: 400, percentage: 40 }
    ]),
    getRealtimeData: vi.fn().mockResolvedValue({
      active_users: 15,
      top_pages: [{ page: '/services', active_users: 8 }],
      traffic_sources: [{ source: 'google', active_users: 10 }]
    }),
    getSearchConsoleKeywords: vi.fn().mockResolvedValue([
      {
        keyword: 'hvac repair',
        clicks: 50,
        impressions: 1000,
        ctr: 5.0,
        position: 2.5,
        trend: 'up',
        difficulty: 'medium',
        searchVolume: 3500
      }
    ])
  }
}));

// Create a test Express app
function createTestApp() {
  const app = express();
  
  // Add middleware
  app.use(express.json());
  
  // Add test middleware to simulate authentication
  app.use((req, res, next) => {
    (req as any).user = TestApiHelper.createTestUser();
    (req as any).tenant = TestApiHelper.createTestTenant();
    (req as any).correlationId = 'test-correlation-id';
    next();
  });
  
  // Import and add routes (this would normally import your main routes)
  // For this test, we'll add simplified route handlers
  
  app.get('/api/analytics/metrics', async (req, res) => {
    try {
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      const period = (req.query.period as string) || '30d';
      const metrics = await googleAnalyticsService.getMetrics(period as any);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch analytics metrics' });
    }
  });
  
  app.get('/api/analytics/traffic-sources', async (req, res) => {
    try {
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      const period = (req.query.period as string) || '30d';
      const sources = await googleAnalyticsService.getTrafficSources(period as any);
      res.json(sources);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch traffic sources' });
    }
  });
  
  app.get('/api/analytics/top-pages', async (req, res) => {
    try {
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      const period = (req.query.period as string) || '30d';
      const pages = await googleAnalyticsService.getTopPages(period as any);
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch top pages' });
    }
  });
  
  app.get('/api/analytics/locations', async (req, res) => {
    try {
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      const period = (req.query.period as string) || '30d';
      const locations = await googleAnalyticsService.getLocationData(period as any);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch location data' });
    }
  });
  
  app.get('/api/analytics/devices', async (req, res) => {
    try {
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      const period = (req.query.period as string) || '30d';
      const devices = await googleAnalyticsService.getDeviceData(period as any);
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch device data' });
    }
  });
  
  app.get('/api/analytics/realtime', async (req, res) => {
    try {
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      const realtime = await googleAnalyticsService.getRealtimeData();
      res.json(realtime);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch realtime data' });
    }
  });
  
  app.get('/api/analytics/keywords', async (req, res) => {
    try {
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      const period = (req.query.period as string) || '30d';
      const keywords = await googleAnalyticsService.getSearchConsoleKeywords(period as any);
      
      res.json({
        keywords,
        meta: {
          source: 'search_console',
          total: keywords.length,
          period,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch keyword data' });
    }
  });
  
  return app;
}

describe('Analytics API Integration Tests', () => {
  let app: express.Application;
  
  beforeAll(async () => {
    await TestDatabase.setup();
    app = createTestApp();
  });
  
  afterAll(async () => {
    await TestDatabase.cleanup();
  });
  
  beforeEach(async () => {
    // Reset any test data between tests
    vi.clearAllMocks();
  });
  
  describe('GET /api/analytics/metrics', () => {
    it('should return analytics metrics successfully', async () => {
      const response = await request(app)
        .get('/api/analytics/metrics')
        .expect(200);
      
      expect(response.body).toHaveValidStructure({
        sessions: 'number',
        pageviews: 'number',
        users: 'number',
        bounce_rate: 'number',
        avg_session_duration: 'number'
      });
      
      expect(response.body.sessions).toBe(1000);
      expect(response.body.pageviews).toBe(2000);
      expect(response.body.users).toBe(800);
    });
    
    it('should accept period parameter', async () => {
      const response = await request(app)
        .get('/api/analytics/metrics?period=7d')
        .expect(200);
      
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      expect(googleAnalyticsService.getMetrics).toHaveBeenCalledWith('7d');
    });
    
    it('should use default period when not specified', async () => {
      await request(app)
        .get('/api/analytics/metrics')
        .expect(200);
      
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      expect(googleAnalyticsService.getMetrics).toHaveBeenCalledWith('30d');
    });
    
    it('should complete within acceptable time', async () => {
      const { result, duration } = await PerformanceHelper.measureExecutionTime(async () => {
        return await request(app).get('/api/analytics/metrics');
      });
      
      expect(result.status).toBe(200);
      PerformanceHelper.expectExecutionTimeUnder(duration, 1000); // Should complete within 1 second
    });
  });
  
  describe('GET /api/analytics/traffic-sources', () => {
    it('should return traffic sources data', async () => {
      const response = await request(app)
        .get('/api/analytics/traffic-sources')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const firstSource = response.body[0];
      expect(firstSource).toHaveValidStructure({
        source: 'string',
        medium: 'string',
        sessions: 'number',
        percentage: 'number'
      });
    });
    
    it('should return sources ordered by sessions descending', async () => {
      const response = await request(app)
        .get('/api/analytics/traffic-sources')
        .expect(200);
      
      const sources = response.body;
      for (let i = 1; i < sources.length; i++) {
        expect(sources[i-1].sessions).toBeGreaterThanOrEqual(sources[i].sessions);
      }
    });
  });
  
  describe('GET /api/analytics/top-pages', () => {
    it('should return top pages data', async () => {
      const response = await request(app)
        .get('/api/analytics/top-pages')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const firstPage = response.body[0];
      expect(firstPage).toHaveValidStructure({
        page: 'string',
        pageviews: 'number',
        unique_pageviews: 'number',
        avg_time_on_page: 'number',
        bounce_rate: 'number'
      });
    });
  });
  
  describe('GET /api/analytics/locations', () => {
    it('should return location data', async () => {
      const response = await request(app)
        .get('/api/analytics/locations')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const firstLocation = response.body[0];
      expect(firstLocation).toHaveValidStructure({
        country: 'string',
        sessions: 'number',
        percentage: 'number'
      });
    });
    
    it('should have percentages that sum to approximately 100', async () => {
      const response = await request(app)
        .get('/api/analytics/locations')
        .expect(200);
      
      const totalPercentage = response.body.reduce(
        (sum: number, location: any) => sum + location.percentage,
        0
      );
      
      expect(totalPercentage).toBeCloseTo(100, 0);
    });
  });
  
  describe('GET /api/analytics/devices', () => {
    it('should return device data', async () => {
      const response = await request(app)
        .get('/api/analytics/devices')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const firstDevice = response.body[0];
      expect(firstDevice).toHaveValidStructure({
        device: 'string',
        sessions: 'number',
        percentage: 'number'
      });
    });
  });
  
  describe('GET /api/analytics/realtime', () => {
    it('should return realtime data', async () => {
      const response = await request(app)
        .get('/api/analytics/realtime')
        .expect(200);
      
      expect(response.body).toHaveValidStructure({
        active_users: 'number',
        top_pages: 'object',
        traffic_sources: 'object'
      });
      
      expect(Array.isArray(response.body.top_pages)).toBe(true);
      expect(Array.isArray(response.body.traffic_sources)).toBe(true);
      expect(response.body.active_users).toBeGreaterThanOrEqual(0);
    });
    
    it('should complete very quickly for realtime data', async () => {
      const { result, duration } = await PerformanceHelper.measureExecutionTime(async () => {
        return await request(app).get('/api/analytics/realtime');
      });
      
      expect(result.status).toBe(200);
      PerformanceHelper.expectExecutionTimeUnder(duration, 500); // Should complete within 500ms
    });
  });
  
  describe('GET /api/analytics/keywords', () => {
    it('should return keywords data with metadata', async () => {
      const response = await request(app)
        .get('/api/analytics/keywords')
        .expect(200);
      
      expect(response.body).toHaveValidStructure({
        keywords: 'object',
        meta: 'object'
      });
      
      expect(Array.isArray(response.body.keywords)).toBe(true);
      expect(response.body.meta).toHaveValidStructure({
        source: 'string',
        total: 'number',
        period: 'string',
        lastUpdated: 'string'
      });
      
      if (response.body.keywords.length > 0) {
        const firstKeyword = response.body.keywords[0];
        expect(firstKeyword).toHaveValidStructure({
          keyword: 'string',
          clicks: 'number',
          impressions: 'number',
          ctr: 'number',
          position: 'number',
          trend: 'string',
          difficulty: 'string',
          searchVolume: 'number'
        });
      }
    });
    
    it('should include valid trend values', async () => {
      const response = await request(app)
        .get('/api/analytics/keywords')
        .expect(200);
      
      const validTrends = ['up', 'down', 'stable'];
      response.body.keywords.forEach((keyword: any) => {
        expect(validTrends).toContain(keyword.trend);
      });
    });
    
    it('should include valid difficulty values', async () => {
      const response = await request(app)
        .get('/api/analytics/keywords')
        .expect(200);
      
      const validDifficulties = ['easy', 'medium', 'hard'];
      response.body.keywords.forEach((keyword: any) => {
        expect(validDifficulties).toContain(keyword.difficulty);
      });
    });
  });
  
  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Mock a service error
      const { googleAnalyticsService } = await import('@server/services/google-analytics');
      vi.mocked(googleAnalyticsService.getMetrics).mockRejectedValueOnce(
        new Error('Google Analytics API error')
      );
      
      const response = await request(app)
        .get('/api/analytics/metrics')
        .expect(500);
      
      expect(response.body.message).toBe('Failed to fetch analytics metrics');
    });
  });
  
  describe('Performance Tests', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, () =>
        request(app).get('/api/analytics/metrics')
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveValidStructure({
          sessions: 'number',
          pageviews: 'number',
          users: 'number'
        });
      });
    });
    
    it('should maintain consistent response times under load', async () => {
      const durations: number[] = [];
      
      for (let i = 0; i < 5; i++) {
        const { duration } = await PerformanceHelper.measureExecutionTime(async () => {
          return await request(app).get('/api/analytics/metrics');
        });
        durations.push(duration);
      }
      
      // Check that response times are consistent (no request takes more than 2x the average)
      const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      durations.forEach(duration => {
        expect(duration).toBeLessThan(averageDuration * 2);
      });
    });
  });
});
