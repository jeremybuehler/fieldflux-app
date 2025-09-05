/**
 * Memory Performance Profiler
 * Monitors memory usage patterns and detects memory leaks
 */

import { performance, PerformanceObserver } from 'perf_hooks';
// import memwatch from 'memwatch-next'; // Removed due to Node.js compatibility issues
import fs from 'fs';
import path from 'path';
import { PERFORMANCE_CONFIG } from '../configs/performance-config.js';

interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  arrayBuffers: number;
}

interface MemoryLeak {
  type: 'heap-growth' | 'external-growth' | 'rss-growth';
  growth: number;
  startTime: number;
  endTime: number;
  severity: 'low' | 'medium' | 'high';
}

interface GarbageCollectionStats {
  count: number;
  totalDuration: number;
  averageDuration: number;
  maxDuration: number;
  collections: Array<{
    timestamp: number;
    duration: number;
    type: string;
  }>;
}

class MemoryProfiler {
  private snapshots: MemorySnapshot[] = [];
  private leaks: MemoryLeak[] = [];
  private gcStats: GarbageCollectionStats;
  private monitoring = false;
  private monitoringInterval?: NodeJS.Timer;
  private heapDiffs: any[] = [];

  constructor() {
    this.gcStats = {
      count: 0,
      totalDuration: 0,
      averageDuration: 0,
      maxDuration: 0,
      collections: []
    };
  }

  async startMemoryProfiling(duration: number = 60000): Promise<void> {
    console.log('🧠 Starting Memory Performance Profiling...');
    
    try {
      // Setup memory monitoring
      this.setupMemoryMonitoring();
      
      // Setup garbage collection monitoring
      this.setupGCMonitoring();
      
      // Setup memwatch for leak detection
      this.setupMemwatchMonitoring();
      
      // Start monitoring
      this.startMonitoring();
      
      // Run memory-intensive simulation
      await this.runMemoryStressTest(duration);
      
      // Stop monitoring and analyze
      this.stopMonitoring();
      await this.analyzeMemoryPatterns();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Memory profiling failed:', error);
    }
  }

  private setupMemoryMonitoring(): void {
    // Monitor memory usage every second
    this.monitoringInterval = setInterval(() => {
      if (this.monitoring) {
        const memUsage = process.memoryUsage();
        this.snapshots.push({
          timestamp: Date.now(),
          heapUsed: memUsage.heapUsed,
          heapTotal: memUsage.heapTotal,
          external: memUsage.external,
          rss: memUsage.rss,
          arrayBuffers: memUsage.arrayBuffers || 0
        });
      }
    }, 1000);
  }

  private setupGCMonitoring(): void {
    // Use PerformanceObserver to monitor GC events
    const gcObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'gc') {
          this.gcStats.count++;
          this.gcStats.totalDuration += entry.duration;
          this.gcStats.maxDuration = Math.max(this.gcStats.maxDuration, entry.duration);
          
          this.gcStats.collections.push({
            timestamp: entry.startTime,
            duration: entry.duration,
            type: (entry as any).kind || 'unknown'
          });
        }
      });
    });
    
    gcObserver.observe({ entryTypes: ['gc'] });
  }

  private setupMemwatchMonitoring(): void {
    // Monitor for memory leaks using basic memory tracking
    let previousMemory = process.memoryUsage().heapUsed;
    
    setInterval(() => {
      if (this.monitoring) {
        const currentMemory = process.memoryUsage().heapUsed;
        const growth = currentMemory - previousMemory;
        
        // Simple leak detection - if memory grows consistently
        if (growth > 50 * 1024 * 1024) { // 50MB growth
          this.leaks.push({
            type: 'heap-growth',
            growth,
            startTime: Date.now() - 15000,
            endTime: Date.now(),
            severity: growth > 100 * 1024 * 1024 ? 'high' : 'medium'
          });
        }
        
        previousMemory = currentMemory;
      }
    }, 15000);
  }

  private startMonitoring(): void {
    this.monitoring = true;
    console.log('📊 Memory monitoring started');
  }

  private stopMonitoring(): void {
    this.monitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    console.log('📊 Memory monitoring stopped');
  }

  private async runMemoryStressTest(duration: number): Promise<void> {
    console.log(`🔥 Running memory stress test for ${duration / 1000} seconds...`);
    
    const endTime = Date.now() + duration;
    const operations = [];
    
    while (Date.now() < endTime) {
      // Simulate various memory operations
      await Promise.all([
        this.simulateArrayOperations(),
        this.simulateObjectCreation(),
        this.simulateStringOperations(),
        this.simulateBufferOperations()
      ]);
      
      // Brief pause to allow GC
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('✅ Memory stress test completed');
  }

  private async simulateArrayOperations(): Promise<void> {
    const largeArray = new Array(100000).fill(Math.random());
    
    // Array manipulations
    largeArray.sort();
    largeArray.reverse();
    largeArray.filter(x => x > 0.5);
    largeArray.map(x => x * 2);
    
    // Cleanup (simulate memory release)
    largeArray.length = 0;
  }

  private async simulateObjectCreation(): Promise<void> {
    const objects = [];
    
    for (let i = 0; i < 1000; i++) {
      objects.push({
        id: i,
        data: `Large string data ${Math.random().toString(36).repeat(100)}`,
        nested: {
          values: new Array(100).fill(i),
          metadata: {
            timestamp: Date.now(),
            type: 'test-object'
          }
        }
      });
    }
    
    // Process objects
    objects.forEach(obj => {
      obj.processed = true;
      obj.nested.values = obj.nested.values.map(v => v * 2);
    });
    
    // Cleanup
    objects.length = 0;
  }

  private async simulateStringOperations(): Promise<void> {
    let largeString = '';
    
    // Build large string
    for (let i = 0; i < 10000; i++) {
      largeString += `Line ${i}: ${Math.random().toString(36)}\n`;
    }
    
    // String operations
    const lines = largeString.split('\n');
    const filtered = lines.filter(line => line.includes('5'));
    const joined = filtered.join('|');
    
    // Regex operations
    const regex = /Line\s+(\d+)/g;
    const matches = Array.from(largeString.matchAll(regex));
    
    // Cleanup
    largeString = '';
  }

  private async simulateBufferOperations(): Promise<void> {
    // Create and manipulate buffers
    const buffers = [];
    
    for (let i = 0; i < 50; i++) {
      const buffer = Buffer.allocUnsafe(64 * 1024); // 64KB buffers
      buffer.fill(i % 256);
      buffers.push(buffer);
    }
    
    // Buffer operations
    const combined = Buffer.concat(buffers);
    const sliced = combined.slice(0, 1024 * 1024); // 1MB slice
    
    // Cleanup
    buffers.length = 0;
  }

  private async analyzeMemoryPatterns(): Promise<void> {
    console.log('📈 Analyzing memory usage patterns...');
    
    if (this.snapshots.length < 2) {
      console.log('⚠️ Insufficient data for analysis');
      return;
    }
    
    // Detect memory growth patterns
    const firstSnapshot = this.snapshots[0];
    const lastSnapshot = this.snapshots[this.snapshots.length - 1];
    const duration = lastSnapshot.timestamp - firstSnapshot.timestamp;
    
    // Analyze heap growth
    const heapGrowth = lastSnapshot.heapUsed - firstSnapshot.heapUsed;
    if (heapGrowth > 10 * 1024 * 1024) { // More than 10MB growth
      this.leaks.push({
        type: 'heap-growth',
        growth: heapGrowth,
        startTime: firstSnapshot.timestamp,
        endTime: lastSnapshot.timestamp,
        severity: heapGrowth > 100 * 1024 * 1024 ? 'high' : 'medium'
      });
    }
    
    // Analyze RSS growth
    const rssGrowth = lastSnapshot.rss - firstSnapshot.rss;
    if (rssGrowth > 20 * 1024 * 1024) { // More than 20MB RSS growth
      this.leaks.push({
        type: 'rss-growth',
        growth: rssGrowth,
        startTime: firstSnapshot.timestamp,
        endTime: lastSnapshot.timestamp,
        severity: rssGrowth > 200 * 1024 * 1024 ? 'high' : 'medium'
      });
    }
    
    // Calculate GC statistics
    if (this.gcStats.count > 0) {
      this.gcStats.averageDuration = this.gcStats.totalDuration / this.gcStats.count;
    }
    
    console.log('✅ Memory pattern analysis completed');
  }

  private generateReport(): void {
    console.log('\n🧠 Memory Performance Report');
    console.log('============================');
    
    if (this.snapshots.length === 0) {
      console.log('❌ No memory data collected');
      return;
    }
    
    const firstSnapshot = this.snapshots[0];
    const lastSnapshot = this.snapshots[this.snapshots.length - 1];
    const peakSnapshot = this.snapshots.reduce((max, current) => 
      current.heapUsed > max.heapUsed ? current : max
    );
    
    // Memory usage summary
    console.log('\n📊 Memory Usage Summary:');
    console.log(`Duration: ${((lastSnapshot.timestamp - firstSnapshot.timestamp) / 1000).toFixed(1)}s`);
    console.log(`Initial heap: ${this.formatBytes(firstSnapshot.heapUsed)}`);
    console.log(`Final heap: ${this.formatBytes(lastSnapshot.heapUsed)}`);
    console.log(`Peak heap: ${this.formatBytes(peakSnapshot.heapUsed)}`);
    console.log(`Heap growth: ${this.formatBytes(lastSnapshot.heapUsed - firstSnapshot.heapUsed)}`);
    console.log(`RSS growth: ${this.formatBytes(lastSnapshot.rss - firstSnapshot.rss)}`);
    
    // Threshold validation
    const thresholds = PERFORMANCE_CONFIG.thresholds.memory;
    const violations = [];
    
    if (peakSnapshot.heapUsed > thresholds.heapUsed) {
      violations.push(`Peak heap usage (${this.formatBytes(peakSnapshot.heapUsed)}) exceeded threshold (${this.formatBytes(thresholds.heapUsed)})`);
    }
    
    if (lastSnapshot.rss > thresholds.rss) {
      violations.push(`Final RSS (${this.formatBytes(lastSnapshot.rss)}) exceeded threshold (${this.formatBytes(thresholds.rss)})`);
    }
    
    // Garbage collection stats
    console.log('\n🗑️ Garbage Collection Stats:');
    console.log(`Total collections: ${this.gcStats.count}`);
    if (this.gcStats.count > 0) {
      console.log(`Average GC duration: ${this.gcStats.averageDuration.toFixed(2)}ms`);
      console.log(`Max GC duration: ${this.gcStats.maxDuration.toFixed(2)}ms`);
      console.log(`Total GC time: ${this.gcStats.totalDuration.toFixed(2)}ms`);
    }
    
    // Memory leaks
    if (this.leaks.length > 0) {
      console.log('\n⚠️ Memory Issues Detected:');
      this.leaks.forEach((leak, index) => {
        console.log(`${index + 1}. ${leak.type} - Growth: ${this.formatBytes(leak.growth)} (${leak.severity} severity)`);
      });
    } else {
      console.log('\n✅ No significant memory leaks detected');
    }
    
    // Heap diffs analysis
    if (this.heapDiffs.length > 0) {
      console.log('\n📈 Heap Diff Analysis:');
      this.heapDiffs.forEach((diffData, index) => {
        const diff = diffData.diff;
        console.log(`Diff ${index + 1}: +${diff.change.size_bytes} bytes, +${diff.change.freed_nodes} freed nodes`);
      });
    }
    
    // Threshold violations
    if (violations.length > 0) {
      console.log('\n❌ Threshold Violations:');
      violations.forEach(violation => console.log(`  - ${violation}`));
    } else {
      console.log('\n✅ All memory thresholds met');
    }
    
    // Save detailed report
    this.saveDetailedReport();
    
    console.log('\n✅ Memory profiling completed');
  }

  private saveDetailedReport(): void {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        duration: this.snapshots.length > 0 ? 
          this.snapshots[this.snapshots.length - 1].timestamp - this.snapshots[0].timestamp : 0,
        peakHeapUsed: Math.max(...this.snapshots.map(s => s.heapUsed)),
        totalGCTime: this.gcStats.totalDuration,
        leakCount: this.leaks.length
      },
      snapshots: this.snapshots,
      gcStats: this.gcStats,
      leaks: this.leaks,
      heapDiffs: this.heapDiffs.map(hd => ({
        timestamp: hd.timestamp,
        summary: {
          size_bytes: hd.diff.change.size_bytes,
          freed_nodes: hd.diff.change.freed_nodes,
          allocated_nodes: hd.diff.change.allocated_nodes
        }
      })),
      thresholds: PERFORMANCE_CONFIG.thresholds.memory
    };
    
    const reportPath = path.join('tests', 'performance', 'reports', 'memory-profile.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`Detailed memory report saved to ${reportPath}`);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}

// Main execution
async function main() {
  const profiler = new MemoryProfiler();
  const duration = parseInt(process.env.PERF_DURATION || '60000'); // Default 60 seconds
  await profiler.startMemoryProfiling(duration);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { MemoryProfiler };