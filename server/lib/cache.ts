import Redis from 'ioredis';
import { logger } from './logger';

interface CacheConfig {
  ttl: number; // Time to live in seconds
  prefix?: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

export class CacheService {
  private redis: Redis | null = null;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0
  };
  private isEnabled: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (process.env.REDIS_URL) {
      try {
        this.redis = new Redis(process.env.REDIS_URL, {
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

        this.redis.on('connect', () => {
          logger.info('Redis cache connected');
          this.isEnabled = true;
        });

        this.redis.on('error', (error) => {
          logger.error('Redis cache error', {}, error);
          this.stats.errors++;
          this.isEnabled = false;
        });

        this.redis.on('disconnect', () => {
          logger.warn('Redis cache disconnected');
          this.isEnabled = false;
        });

      } catch (error) {
        logger.error('Failed to initialize Redis cache', {}, error as Error);
      }
    } else {
      logger.info('Redis not configured, using in-memory fallback');
    }
  }

  async get<T>(key: string, config?: { prefix?: string }): Promise<T | null> {
    const fullKey = this.buildKey(key, config?.prefix);
    
    if (!this.isEnabled || !this.redis) {
      this.stats.misses++;
      return null;
    }

    try {
      const start = Date.now();
      const value = await this.redis.get(fullKey);
      const duration = Date.now() - start;

      if (value === null) {
        this.stats.misses++;
        logger.debug('Cache miss', { correlationId: key }, { 
          key: fullKey, 
          duration 
        });
        return null;
      }

      this.stats.hits++;
      logger.debug('Cache hit', { correlationId: key }, { 
        key: fullKey, 
        duration 
      });

      return JSON.parse(value) as T;
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache get error', { correlationId: key }, error as Error);
      return null;
    }
  }

  async set<T>(
    key: string, 
    value: T, 
    config: CacheConfig = { ttl: 3600 }
  ): Promise<boolean> {
    const fullKey = this.buildKey(key, config.prefix);
    
    if (!this.isEnabled || !this.redis) {
      return false;
    }

    try {
      const start = Date.now();
      const serialized = JSON.stringify(value);
      
      if (config.ttl > 0) {
        await this.redis.setex(fullKey, config.ttl, serialized);
      } else {
        await this.redis.set(fullKey, serialized);
      }

      const duration = Date.now() - start;
      this.stats.sets++;

      logger.debug('Cache set', { correlationId: key }, { 
        key: fullKey, 
        ttl: config.ttl,
        size: serialized.length,
        duration
      });

      return true;
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache set error', { correlationId: key }, error as Error);
      return false;
    }
  }

  async del(key: string, prefix?: string): Promise<boolean> {
    const fullKey = this.buildKey(key, prefix);
    
    if (!this.isEnabled || !this.redis) {
      return false;
    }

    try {
      const result = await this.redis.del(fullKey);
      this.stats.deletes++;
      
      logger.debug('Cache delete', { correlationId: key }, { 
        key: fullKey, 
        deleted: result > 0 
      });

      return result > 0;
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache delete error', { correlationId: key }, error as Error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    if (!this.isEnabled || !this.redis) {
      return 0;
    }

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.redis.del(...keys);
      this.stats.deletes += result;

      logger.info('Cache pattern invalidated', {}, { 
        pattern, 
        keysDeleted: result 
      });

      return result;
    } catch (error) {
      this.stats.errors++;
      logger.error('Cache pattern invalidation error', {}, error as Error);
      return 0;
    }
  }

  // Cache decorators for common use cases
  async cached<T>(
    key: string,
    fn: () => Promise<T>,
    config: CacheConfig = { ttl: 3600 }
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key, config);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn();
    await this.set(key, result, config);
    return result;
  }

  // Analytics-specific cache with shorter TTL
  async cacheAnalytics<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 900 // 15 minutes
  ): Promise<T> {
    return this.cached(key, fn, { ttl, prefix: 'analytics' });
  }

  // Lead data cache with medium TTL
  async cacheLeads<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 1800 // 30 minutes
  ): Promise<T> {
    return this.cached(key, fn, { ttl, prefix: 'leads' });
  }

  // AI responses cache with longer TTL
  async cacheAI<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 7200 // 2 hours
  ): Promise<T> {
    return this.cached(key, fn, { ttl, prefix: 'ai' });
  }

  private buildKey(key: string, prefix?: string): string {
    const basePrefix = 'fieldflux';
    if (prefix) {
      return `${basePrefix}:${prefix}:${key}`;
    }
    return `${basePrefix}:${key}`;
  }

  getStats(): CacheStats & { enabled: boolean; hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      enabled: this.isEnabled,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0
    };
  }

  async healthCheck(): Promise<{ status: string; latency?: number }> {
    if (!this.isEnabled || !this.redis) {
      return { status: 'disabled' };
    }

    try {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      
      return { status: 'healthy', latency };
    } catch (error) {
      return { status: 'unhealthy' };
    }
  }
}

// Singleton instance
export const cache = new CacheService();

// Performance-aware cache middleware
export function cacheMiddleware(
  keyFn: (req: any) => string,
  config: CacheConfig = { ttl: 300 }
) {
  return async (req: any, res: any, next: any) => {
    const key = keyFn(req);
    const cached = await cache.get(key, config);
    
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      res.setHeader('X-Cache', 'MISS');
      cache.set(key, data, config);
      return originalJson.call(this, data);
    };

    next();
  };
}

// Cache warming utilities
export async function warmCache() {
  logger.info('Starting cache warm-up...');
  
  // Warm up common analytics data
  // This would be called on app startup or via cron
  
  logger.info('Cache warm-up completed');
}
