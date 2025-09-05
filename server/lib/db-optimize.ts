import { db } from '../db';
import { sql } from 'drizzle-orm';
import { logger } from './logger';

interface QueryStats {
  query: string;
  duration: number;
  rows?: number;
  cached?: boolean;
}

export class DatabaseOptimizer {
  private queryStats: QueryStats[] = [];
  private slowQueryThreshold = 1000; // 1 second

  // Performance monitoring decorator
  static timed<T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const method = descriptor.value!;
    
    descriptor.value = async function(...args: any[]) {
      const start = Date.now();
      const optimizer = new DatabaseOptimizer();
      
      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - start;
        
        optimizer.logQuery(propertyName, duration, Array.isArray(result) ? result.length : 1);
        
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        optimizer.logSlowQuery(propertyName, duration, error as Error);
        throw error;
      }
    } as T;
    
    return descriptor;
  }

  private logQuery(query: string, duration: number, rows?: number) {
    const stat: QueryStats = { query, duration, rows };
    this.queryStats.push(stat);

    if (duration > this.slowQueryThreshold) {
      logger.warn('Slow database query detected', {}, {
        query,
        duration: `${duration}ms`,
        rows,
        threshold: `${this.slowQueryThreshold}ms`
      });
    } else {
      logger.debug('Database query completed', {}, {
        query,
        duration: `${duration}ms`,
        rows
      });
    }
  }

  private logSlowQuery(query: string, duration: number, error: Error) {
    logger.error('Database query failed', {}, error, {
      query,
      duration: `${duration}ms`
    });
  }

  // Index analysis and recommendations
  static async analyzeIndexes(): Promise<any> {
    try {
      const result = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          attname as column_name,
          n_distinct,
          correlation,
          most_common_vals,
          most_common_freqs
        FROM pg_stats 
        WHERE schemaname = 'public'
        ORDER BY tablename, attname
      `);

      logger.info('Database index analysis completed', {}, {
        tablesAnalyzed: result.length
      });

      return result;
    } catch (error) {
      logger.error('Failed to analyze database indexes', {}, error as Error);
      return [];
    }
  }

  // Query plan analysis
  static async explainQuery(query: string): Promise<any> {
    try {
      const result = await db.execute(sql`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${sql.raw(query)}`);
      return result[0];
    } catch (error) {
      logger.error('Failed to explain query', {}, error as Error);
      return null;
    }
  }

  // Database health check
  static async healthCheck(): Promise<{
    status: string;
    connections: number;
    cacheHitRatio: number;
    slowQueries: number;
    uptime: string;
  }> {
    try {
      // Get connection stats
      const [connections] = await db.execute(sql`
        SELECT count(*) as active_connections 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `);

      // Get cache hit ratio
      const [cacheStats] = await db.execute(sql`
        SELECT 
          sum(heap_blks_read) as heap_read,
          sum(heap_blks_hit) as heap_hit,
          sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100 as cache_hit_ratio
        FROM pg_statio_user_tables
      `);

      // Get slow queries count (hypothetical - would need pg_stat_statements)
      const slowQueries = 0; // Placeholder

      // Get uptime
      const [uptime] = await db.execute(sql`
        SELECT pg_postmaster_start_time()
      `);

      return {
        status: 'healthy',
        connections: parseInt(connections.active_connections as string),
        cacheHitRatio: parseFloat(cacheStats.cache_hit_ratio as string) || 0,
        slowQueries,
        uptime: uptime.pg_postmaster_start_time as string
      };
    } catch (error) {
      logger.error('Database health check failed', {}, error as Error);
      return {
        status: 'unhealthy',
        connections: 0,
        cacheHitRatio: 0,
        slowQueries: 0,
        uptime: 'unknown'
      };
    }
  }

  // Batch operations for performance
  static async batchInsert<T>(
    table: any,
    data: T[],
    batchSize: number = 1000
  ): Promise<void> {
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const start = Date.now();
      try {
        await db.insert(table).values(batch);
        const duration = Date.now() - start;
        
        logger.debug('Batch insert completed', {}, {
          table: table._.name,
          batchSize: batch.length,
          duration: `${duration}ms`
        });
      } catch (error) {
        logger.error('Batch insert failed', {}, error as Error, {
          table: table._.name,
          batchSize: batch.length
        });
        throw error;
      }
    }
  }

  // Connection pool monitoring
  static async getPoolStats(): Promise<any> {
    try {
      const result = await db.execute(sql`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections,
          count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction,
          max(now() - query_start) as longest_query,
          max(now() - state_change) as longest_idle
        FROM pg_stat_activity 
        WHERE pid <> pg_backend_pid()
      `);

      return result[0];
    } catch (error) {
      logger.error('Failed to get connection pool stats', {}, error as Error);
      return null;
    }
  }

  getStats(): {
    totalQueries: number;
    averageDuration: number;
    slowQueries: number;
    fastestQuery: number;
    slowestQuery: number;
  } {
    if (this.queryStats.length === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
        fastestQuery: 0,
        slowestQuery: 0
      };
    }

    const durations = this.queryStats.map(s => s.duration);
    const slowQueries = this.queryStats.filter(s => s.duration > this.slowQueryThreshold);

    return {
      totalQueries: this.queryStats.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      slowQueries: slowQueries.length,
      fastestQuery: Math.min(...durations),
      slowestQuery: Math.max(...durations)
    };
  }
}

// Optimized pagination helper
export function optimizedPagination(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return {
    limit: Math.min(limit, 100), // Cap at 100
    offset: Math.max(offset, 0)   // Ensure non-negative
  };
}

// Database indexes to create (run via migration)
export const PERFORMANCE_INDEXES = {
  // Multi-tenant isolation indexes
  TENANT_INDEXES: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_tenant_id ON leads(tenant_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_social_posts_tenant_id ON social_posts(tenant_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activities_tenant_id ON activities(tenant_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_tenant_id ON reviews(tenant_id)',
  ],

  // Timestamp indexes for analytics
  TIME_INDEXES: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_social_posts_scheduled_for ON social_posts(scheduled_for)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_start_time ON user_engagement_sessions(start_time DESC)',
  ],

  // Status and filtering indexes
  STATUS_INDEXES: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_status ON leads(status)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_social_posts_status ON social_posts(status)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_status ON tasks(status)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_status ON reviews(status)',
  ],

  // User-specific indexes
  USER_INDEXES: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_memberships_user_tenant ON memberships(user_id, tenant_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id)',
  ],

  // Search optimization indexes
  SEARCH_INDEXES: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_name_gin ON leads USING gin(to_tsvector(\'english\', name))',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_content_gin ON reviews USING gin(to_tsvector(\'english\', content))',
  ],

  // Composite indexes for common queries
  COMPOSITE_INDEXES: [
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_tenant_status_created ON leads(tenant_id, status, created_at DESC)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_social_posts_tenant_platform_status ON social_posts(tenant_id, platform, status)',
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_engagement_user_date ON user_engagement_metrics(user_id, date DESC)',
  ]
};

export const dbOptimizer = new DatabaseOptimizer();
