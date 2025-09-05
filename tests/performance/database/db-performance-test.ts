/**
 * Database Performance Testing Suite
 * Tests PostgreSQL query performance and connection handling
 */

import { performance } from 'perf_hooks';
import postgres from 'postgres';
import { PERFORMANCE_CONFIG } from '../configs/performance-config.js';

interface QueryResult {
  name: string;
  duration: number;
  rowCount: number;
  success: boolean;
  error?: string;
}

interface ConnectionPoolStats {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  waitingRequests: number;
}

class DatabasePerformanceTester {
  private sql: any;
  private results: QueryResult[] = [];
  private connectionStats: ConnectionPoolStats[] = [];

  constructor() {
    // Create database connection with performance monitoring
    this.sql = postgres(process.env.DATABASE_URL || 'postgresql://localhost:5432/fieldflux', {
      max: 50, // Max connections for load testing
      idle_timeout: 20,
      connect_timeout: 30,
      onnotice: () => {}, // Suppress notices during testing
    });
  }

  async runPerformanceTests(): Promise<void> {
    console.log('🚀 Starting Database Performance Tests...');
    
    try {
      // Test individual query performance
      await this.testQueryPerformance();
      
      // Test connection pool under load
      await this.testConnectionPoolPerformance();
      
      // Test concurrent operations
      await this.testConcurrentOperations();
      
      // Test database locks and deadlocks
      await this.testLockingBehavior();
      
      // Generate performance report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Database performance test failed:', error);
    } finally {
      await this.sql.end();
    }
  }

  private async testQueryPerformance(): Promise<void> {
    console.log('🔍 Testing individual query performance...');
    
    const queries = [
      {
        name: 'Simple User Lookup',
        query: 'SELECT * FROM users WHERE id = $1 LIMIT 1',
        params: ['user-123'],
        threshold: PERFORMANCE_CONFIG.thresholds.database.queryTime.simple
      },
      {
        name: 'Leads with Pagination',
        query: 'SELECT * FROM leads ORDER BY created_at DESC LIMIT 50 OFFSET 0',
        params: [],
        threshold: PERFORMANCE_CONFIG.thresholds.database.queryTime.simple
      },
      {
        name: 'Dashboard Metrics Count',
        query: `
          SELECT 
            (SELECT COUNT(*) FROM leads WHERE created_at > NOW() - INTERVAL '30 days') as leads_count,
            (SELECT COUNT(*) FROM social_posts WHERE created_at > NOW() - INTERVAL '30 days') as posts_count,
            (SELECT COUNT(*) FROM wordpress_posts WHERE created_at > NOW() - INTERVAL '30 days') as blog_count
        `,
        params: [],
        threshold: PERFORMANCE_CONFIG.thresholds.database.queryTime.complex
      },
      {
        name: 'Lead Analytics Aggregation',
        query: `
          SELECT 
            source,
            COUNT(*) as count,
            AVG(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as conversion_rate
          FROM leads 
          WHERE created_at > NOW() - INTERVAL '90 days'
          GROUP BY source
          ORDER BY count DESC
        `,
        params: [],
        threshold: PERFORMANCE_CONFIG.thresholds.database.queryTime.aggregation
      },
      {
        name: 'Social Media Analytics',
        query: `
          SELECT 
            platform,
            COUNT(*) as post_count,
            AVG(engagement_rate) as avg_engagement,
            SUM(reach) as total_reach
          FROM social_posts 
          WHERE created_at > NOW() - INTERVAL '30 days'
          GROUP BY platform
        `,
        params: [],
        threshold: PERFORMANCE_CONFIG.thresholds.database.queryTime.aggregation
      }
    ];

    for (const { name, query, params, threshold } of queries) {
      const startTime = performance.now();
      
      try {
        const result = await this.sql.unsafe(query, params);
        const duration = performance.now() - startTime;
        
        this.results.push({
          name,
          duration,
          rowCount: Array.isArray(result) ? result.length : 0,
          success: true
        });
        
        const status = duration <= threshold ? '✅' : '⚠️';
        console.log(`${status} ${name}: ${duration.toFixed(2)}ms (${result.length} rows) - Threshold: ${threshold}ms`);
        
      } catch (error) {
        const duration = performance.now() - startTime;
        this.results.push({
          name,
          duration,
          rowCount: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
        
        console.log(`❌ ${name}: Failed after ${duration.toFixed(2)}ms - ${error}`);
      }
    }
  }

  private async testConnectionPoolPerformance(): Promise<void> {
    console.log('🏊 Testing connection pool performance...');
    
    const connectionTests = [10, 25, 50, 75, 100];
    
    for (const concurrentConnections of connectionTests) {
      console.log(`Testing ${concurrentConnections} concurrent connections...`);
      
      const startTime = performance.now();
      const promises = [];
      
      for (let i = 0; i < concurrentConnections; i++) {
        promises.push(
          this.sql`SELECT pg_sleep(0.1), ${i} as connection_id`
            .then(() => ({ success: true }))
            .catch(error => ({ success: false, error }))
        );
      }
      
      const results = await Promise.all(promises);
      const duration = performance.now() - startTime;
      const successCount = results.filter(r => r.success).length;
      
      console.log(`${successCount}/${concurrentConnections} connections successful in ${duration.toFixed(2)}ms`);
      
      // Monitor connection pool stats (if available)
      // Note: postgres.js doesn't expose detailed pool stats, but we can simulate
      this.connectionStats.push({
        activeConnections: concurrentConnections,
        idleConnections: 0,
        totalConnections: concurrentConnections,
        waitingRequests: Math.max(0, concurrentConnections - 50) // Assuming max 50 pool size
      });
    }
  }

  private async testConcurrentOperations(): Promise<void> {
    console.log('⚡ Testing concurrent read/write operations...');
    
    // Create test data first
    await this.createTestData();
    
    // Test concurrent reads
    const readPromises = Array(20).fill(null).map(async (_, index) => {
      const startTime = performance.now();
      try {
        await this.sql`SELECT * FROM leads WHERE name LIKE ${'%Performance Test%'} LIMIT 10`;
        return { type: 'read', duration: performance.now() - startTime, success: true };
      } catch (error) {
        return { type: 'read', duration: performance.now() - startTime, success: false, error };
      }
    });
    
    // Test concurrent writes
    const writePromises = Array(10).fill(null).map(async (_, index) => {
      const startTime = performance.now();
      try {
        await this.sql`
          INSERT INTO leads (name, email, phone, source, created_at) 
          VALUES (${`Concurrent Test ${index}`}, ${`test${index}@concurrent.com`}, ${'555-0000'}, ${'performance-test'}, NOW())
        `;
        return { type: 'write', duration: performance.now() - startTime, success: true };
      } catch (error) {
        return { type: 'write', duration: performance.now() - startTime, success: false, error };
      }
    });
    
    const allResults = await Promise.all([...readPromises, ...writePromises]);
    
    const readResults = allResults.filter(r => r.type === 'read');
    const writeResults = allResults.filter(r => r.type === 'write');
    
    console.log(`Read operations: ${readResults.filter(r => r.success).length}/${readResults.length} successful`);
    console.log(`Write operations: ${writeResults.filter(r => r.success).length}/${writeResults.length} successful`);
    
    const avgReadTime = readResults.reduce((sum, r) => sum + r.duration, 0) / readResults.length;
    const avgWriteTime = writeResults.reduce((sum, r) => sum + r.duration, 0) / writeResults.length;
    
    console.log(`Average read time: ${avgReadTime.toFixed(2)}ms`);
    console.log(`Average write time: ${avgWriteTime.toFixed(2)}ms`);
    
    // Cleanup test data
    await this.cleanupTestData();
  }

  private async testLockingBehavior(): Promise<void> {
    console.log('🔒 Testing database locking behavior...');
    
    try {
      // Test row-level locking
      const promise1 = this.sql.begin(async sql => {
        await sql`SELECT * FROM leads WHERE id = 1 FOR UPDATE`;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Hold lock for 1 second
        return 'Transaction 1 completed';
      });
      
      const promise2 = this.sql.begin(async sql => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Start slightly after
        const startTime = performance.now();
        await sql`SELECT * FROM leads WHERE id = 1 FOR UPDATE`;
        const waitTime = performance.now() - startTime;
        return { message: 'Transaction 2 completed', waitTime };
      });
      
      const [result1, result2] = await Promise.all([promise1, promise2]);
      
      console.log(`Lock test completed - Wait time: ${result2.waitTime?.toFixed(2)}ms`);
      
    } catch (error) {
      console.log(`Lock test failed: ${error}`);
    }
  }

  private async createTestData(): Promise<void> {
    // Create test leads for performance testing
    const testLeads = Array(100).fill(null).map((_, index) => ({
      name: `Performance Test User ${index}`,
      email: `perf-test-${index}@example.com`,
      phone: `555-${String(index).padStart(4, '0')}`,
      source: 'performance-test'
    }));
    
    for (const lead of testLeads) {
      await this.sql`
        INSERT INTO leads (name, email, phone, source, created_at) 
        VALUES (${lead.name}, ${lead.email}, ${lead.phone}, ${lead.source}, NOW())
        ON CONFLICT (email) DO NOTHING
      `;
    }
  }

  private async cleanupTestData(): Promise<void> {
    await this.sql`DELETE FROM leads WHERE source = 'performance-test'`;
    await this.sql`DELETE FROM leads WHERE name LIKE 'Concurrent Test%'`;
  }

  private async generateReport(): Promise<void> {
    console.log('\n📊 Database Performance Test Report');
    console.log('====================================');
    
    // Query performance summary
    const successfulQueries = this.results.filter(r => r.success);
    const failedQueries = this.results.filter(r => !r.success);
    
    console.log(`\n📈 Query Performance Summary:`);
    console.log(`Total queries: ${this.results.length}`);
    console.log(`Successful: ${successfulQueries.length}`);
    console.log(`Failed: ${failedQueries.length}`);
    
    if (successfulQueries.length > 0) {
      const avgTime = successfulQueries.reduce((sum, r) => sum + r.duration, 0) / successfulQueries.length;
      const minTime = Math.min(...successfulQueries.map(r => r.duration));
      const maxTime = Math.max(...successfulQueries.map(r => r.duration));
      
      console.log(`Average response time: ${avgTime.toFixed(2)}ms`);
      console.log(`Min response time: ${minTime.toFixed(2)}ms`);
      console.log(`Max response time: ${maxTime.toFixed(2)}ms`);
    }
    
    // Threshold violations
    const violations = this.results.filter(r => {
      const thresholds = PERFORMANCE_CONFIG.thresholds.database.queryTime;
      return r.success && (
        (r.name.includes('Simple') && r.duration > thresholds.simple) ||
        (r.name.includes('Complex') && r.duration > thresholds.complex) ||
        (r.name.includes('Aggregation') && r.duration > thresholds.aggregation)
      );
    });
    
    if (violations.length > 0) {
      console.log(`\n⚠️ Threshold Violations:`);
      violations.forEach(v => {
        console.log(`- ${v.name}: ${v.duration.toFixed(2)}ms`);
      });
    }
    
    // Failed queries
    if (failedQueries.length > 0) {
      console.log(`\n❌ Failed Queries:`);
      failedQueries.forEach(q => {
        console.log(`- ${q.name}: ${q.error}`);
      });
    }
    
    console.log('\n✅ Database performance test completed');
  }
}

// Main execution
async function main() {
  const tester = new DatabasePerformanceTester();
  await tester.runPerformanceTests();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { DatabasePerformanceTester };