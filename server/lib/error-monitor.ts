import { logger } from './logger';

interface ErrorMetrics {
  count: number;
  lastOccurred: Date;
  firstOccurred: Date;
  frequencies: {
    hourly: number[];
    daily: number[];
  };
  contexts: string[];
}

interface ErrorPattern {
  errorType: string;
  message: string;
  statusCode: number;
  endpoint?: string;
  method?: string;
  userId?: string;
  tenantId?: string;
}

class ErrorMonitor {
  private errorStats: Map<string, ErrorMetrics> = new Map();
  private recentErrors: Array<{
    pattern: ErrorPattern;
    timestamp: Date;
    correlationId: string;
  }> = [];
  
  private maxRecentErrors = 1000;
  private maxStatsEntries = 500;

  constructor() {
    // Clean up old entries every hour
    setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000);
  }

  // Track an error occurrence
  trackError(error: Error, context: {
    correlationId: string;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    userId?: string;
    tenantId?: string;
  }) {
    const pattern: ErrorPattern = {
      errorType: error.constructor.name,
      message: error.message,
      statusCode: context.statusCode || 500,
      endpoint: context.endpoint,
      method: context.method,
      userId: context.userId,
      tenantId: context.tenantId
    };

    const key = this.generateKey(pattern);
    const now = new Date();

    // Update error statistics
    let metrics = this.errorStats.get(key);
    if (!metrics) {
      metrics = {
        count: 0,
        lastOccurred: now,
        firstOccurred: now,
        frequencies: {
          hourly: new Array(24).fill(0),
          daily: new Array(7).fill(0)
        },
        contexts: []
      };
      this.errorStats.set(key, metrics);
    }

    metrics.count++;
    metrics.lastOccurred = now;
    
    // Update frequency counters
    const hour = now.getHours();
    const day = now.getDay();
    metrics.frequencies.hourly[hour]++;
    metrics.frequencies.daily[day]++;

    // Track context information
    const contextStr = `${context.endpoint || 'unknown'}:${context.method || 'unknown'}`;
    if (!metrics.contexts.includes(contextStr)) {
      metrics.contexts.push(contextStr);
      // Keep only the most recent 10 contexts
      if (metrics.contexts.length > 10) {
        metrics.contexts = metrics.contexts.slice(-10);
      }
    }

    // Add to recent errors
    this.recentErrors.unshift({
      pattern,
      timestamp: now,
      correlationId: context.correlationId
    });

    // Keep only recent errors within limit
    if (this.recentErrors.length > this.maxRecentErrors) {
      this.recentErrors = this.recentErrors.slice(0, this.maxRecentErrors);
    }

    // Log high frequency errors as warnings
    if (metrics.count > 10 && metrics.count % 10 === 0) {
      logger.warn(`High frequency error detected`, {
        correlationId: context.correlationId,
        errorType: pattern.errorType,
        message: pattern.message,
        occurrenceCount: metrics.count,
        endpoint: pattern.endpoint
      });
    }
  }

  // Get error statistics
  getErrorStats(options: {
    limit?: number;
    sortBy?: 'count' | 'recent' | 'frequency';
    timeframe?: 'hour' | 'day' | 'all';
  } = {}) {
    const { limit = 50, sortBy = 'count', timeframe = 'all' } = options;
    
    const now = new Date();
    const cutoffTime = timeframe === 'hour' 
      ? new Date(now.getTime() - 60 * 60 * 1000)
      : timeframe === 'day'
        ? new Date(now.getTime() - 24 * 60 * 60 * 1000)
        : null;

    let entries = Array.from(this.errorStats.entries())
      .map(([key, metrics]) => ({ key, ...metrics }));

    // Filter by timeframe if specified
    if (cutoffTime) {
      entries = entries.filter(entry => entry.lastOccurred >= cutoffTime);
    }

    // Sort by requested criteria
    switch (sortBy) {
      case 'recent':
        entries.sort((a, b) => b.lastOccurred.getTime() - a.lastOccurred.getTime());
        break;
      case 'frequency':
        entries.sort((a, b) => {
          const aFreq = timeframe === 'hour' 
            ? a.frequencies.hourly.reduce((sum, val) => sum + val, 0)
            : a.frequencies.daily.reduce((sum, val) => sum + val, 0);
          const bFreq = timeframe === 'hour'
            ? b.frequencies.hourly.reduce((sum, val) => sum + val, 0)
            : b.frequencies.daily.reduce((sum, val) => sum + val, 0);
          return bFreq - aFreq;
        });
        break;
      case 'count':
      default:
        entries.sort((a, b) => b.count - a.count);
        break;
    }

    return entries.slice(0, limit);
  }

  // Get recent errors
  getRecentErrors(limit: number = 100) {
    return this.recentErrors.slice(0, limit);
  }

  // Get error trends
  getErrorTrends() {
    const now = new Date();
    const trends = {
      hourly: new Array(24).fill(0),
      daily: new Array(7).fill(0),
      totalErrors: 0,
      uniqueErrorTypes: 0,
      mostCommonErrors: [] as any[],
      criticalEndpoints: [] as any[]
    };

    // Aggregate all error frequencies
    for (const metrics of this.errorStats.values()) {
      trends.totalErrors += metrics.count;
      
      for (let i = 0; i < 24; i++) {
        trends.hourly[i] += metrics.frequencies.hourly[i];
      }
      
      for (let i = 0; i < 7; i++) {
        trends.daily[i] += metrics.frequencies.daily[i];
      }
    }

    trends.uniqueErrorTypes = this.errorStats.size;

    // Get most common errors
    trends.mostCommonErrors = this.getErrorStats({ limit: 5, sortBy: 'count' })
      .map(error => ({
        type: error.key.split('|')[0],
        count: error.count,
        lastOccurred: error.lastOccurred
      }));

    // Identify critical endpoints (endpoints with high error rates)
    const endpointErrors = new Map<string, number>();
    for (const [key, metrics] of this.errorStats.entries()) {
      for (const context of metrics.contexts) {
        const endpoint = context.split(':')[0];
        endpointErrors.set(endpoint, (endpointErrors.get(endpoint) || 0) + metrics.count);
      }
    }

    trends.criticalEndpoints = Array.from(endpointErrors.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, errorCount: count }));

    return trends;
  }

  // Check for error anomalies
  detectAnomalies() {
    const anomalies = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    for (const [key, metrics] of this.errorStats.entries()) {
      const currentHourErrors = metrics.frequencies.hourly[currentHour];
      const averageHourlyErrors = metrics.frequencies.hourly.reduce((sum, val) => sum + val, 0) / 24;
      
      // Detect spike (current hour is 3x average)
      if (currentHourErrors > averageHourlyErrors * 3 && currentHourErrors > 5) {
        anomalies.push({
          type: 'error_spike',
          errorKey: key,
          currentHourErrors,
          averageHourlyErrors: Math.round(averageHourlyErrors * 100) / 100,
          severity: currentHourErrors > averageHourlyErrors * 5 ? 'critical' : 'warning'
        });
      }

      // Detect new error types (first occurred within last hour)
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      if (metrics.firstOccurred > hourAgo) {
        anomalies.push({
          type: 'new_error_type',
          errorKey: key,
          firstOccurred: metrics.firstOccurred,
          count: metrics.count,
          severity: metrics.count > 10 ? 'warning' : 'info'
        });
      }
    }

    return anomalies;
  }

  // Generate key for error pattern
  private generateKey(pattern: ErrorPattern): string {
    return `${pattern.errorType}|${pattern.statusCode}|${pattern.endpoint || 'unknown'}|${pattern.message.substring(0, 100)}`;
  }

  // Clean up old entries
  private cleanup() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Remove old error statistics
    for (const [key, metrics] of this.errorStats.entries()) {
      if (metrics.lastOccurred < weekAgo) {
        this.errorStats.delete(key);
      }
    }

    // Keep only recent errors from last week
    this.recentErrors = this.recentErrors.filter(
      error => error.timestamp > weekAgo
    );

    // Limit stats entries to prevent memory issues
    if (this.errorStats.size > this.maxStatsEntries) {
      const sortedByDate = Array.from(this.errorStats.entries())
        .sort(([,a], [,b]) => b.lastOccurred.getTime() - a.lastOccurred.getTime())
        .slice(0, this.maxStatsEntries);
      
      this.errorStats.clear();
      for (const [key, metrics] of sortedByDate) {
        this.errorStats.set(key, metrics);
      }
    }

    logger.info('Error monitor cleanup completed', {
      correlationId: 'system',
      errorStatsCount: this.errorStats.size,
      recentErrorsCount: this.recentErrors.length
    });
  }

  // Get summary for health checks
  getHealthSummary() {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentErrorCount = this.recentErrors.filter(
      error => error.timestamp > hourAgo
    ).length;

    const anomalies = this.detectAnomalies();
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');

    return {
      totalTrackedErrors: this.errorStats.size,
      recentErrors: recentErrorCount,
      anomalies: anomalies.length,
      criticalAnomalies: criticalAnomalies.length,
      status: criticalAnomalies.length > 0 ? 'critical' : 
              anomalies.length > 0 ? 'warning' : 
              recentErrorCount > 50 ? 'degraded' : 'healthy'
    };
  }
}

// Singleton instance
export const errorMonitor = new ErrorMonitor();

// Helper function to track errors from middleware
export function trackError(error: Error, context: {
  correlationId: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  userId?: string;
  tenantId?: string;
}) {
  errorMonitor.trackError(error, context);
}
