import { apiRequest } from "./queryClient";

export interface AnalyticsMetrics {
  sessions: number;
  pageviews: number;
  users: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversion_rate: number;
  goal_conversions: number;
}

export interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
}

export interface PagePerformance {
  page: string;
  pageviews: number;
  unique_pageviews: number;
  avg_time_on_page: number;
  bounce_rate: number;
  conversions: number;
}

export interface KeywordPerformance {
  keyword: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avg_position: number;
  conversions: number;
}

export interface AnalyticsReport {
  period: string;
  metrics: AnalyticsMetrics;
  traffic_sources: TrafficSource[];
  top_pages: PagePerformance[];
  top_keywords: KeywordPerformance[];
  demographic_data: {
    locations: Array<{ location: string; sessions: number }>;
    devices: Array<{ device: string; sessions: number }>;
    age_groups: Array<{ age_group: string; sessions: number }>;
  };
}

export class AnalyticsService {
  async getMetrics(period: "7d" | "30d" | "90d" = "30d"): Promise<AnalyticsMetrics> {
    const response = await apiRequest("GET", `/api/analytics/metrics?period=${period}`);
    return response.json();
  }

  async getTrafficSources(period: "7d" | "30d" | "90d" = "30d"): Promise<TrafficSource[]> {
    const response = await apiRequest("GET", `/api/analytics/traffic-sources?period=${period}`);
    return response.json();
  }

  async getPagePerformance(period: "7d" | "30d" | "90d" = "30d"): Promise<PagePerformance[]> {
    const response = await apiRequest("GET", `/api/analytics/pages?period=${period}`);
    return response.json();
  }

  async getKeywordPerformance(period: "7d" | "30d" | "90d" = "30d"): Promise<KeywordPerformance[]> {
    const response = await apiRequest("GET", `/api/analytics/keywords?period=${period}`);
    return response.json();
  }

  async generateReport(period: "7d" | "30d" | "90d" = "30d"): Promise<AnalyticsReport> {
    const response = await apiRequest("POST", "/api/analytics/report", { period });
    return response.json();
  }

  async trackConversion(event: string, value?: number, properties?: Record<string, any>): Promise<void> {
    await apiRequest("POST", "/api/analytics/conversions", {
      event,
      value,
      properties,
      timestamp: new Date().toISOString()
    });
  }

  async getConversionFunnel(): Promise<Array<{
    step: string;
    users: number;
    conversion_rate: number;
  }>> {
    const response = await apiRequest("GET", "/api/analytics/conversion-funnel");
    return response.json();
  }

  async getRealtimeData(): Promise<{
    active_users: number;
    top_pages: Array<{ page: string; active_users: number }>;
    traffic_sources: Array<{ source: string; active_users: number }>;
  }> {
    const response = await apiRequest("GET", "/api/analytics/realtime");
    return response.json();
  }
}

export const analyticsService = new AnalyticsService();
