/**
 * Frontend Bundle Performance Analyzer
 * Analyzes Vite build output and measures frontend performance metrics
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { PERFORMANCE_CONFIG } from '../configs/performance-config.js';

interface BundleStats {
  file: string;
  size: number;
  gzippedSize?: number;
  type: 'js' | 'css' | 'html' | 'asset';
}

interface PerformanceMetrics {
  totalBundleSize: number;
  initialBundleSize: number;
  chunkSizes: BundleStats[];
  assetSizes: BundleStats[];
  compressionRatio: number;
  loadTimeEstimate: {
    fast3G: number;
    slow3G: number;
    wifi: number;
  };
}

class BundleAnalyzer {
  private distPath: string;
  private metrics: PerformanceMetrics;

  constructor() {
    this.distPath = path.join(process.cwd(), 'dist');
    this.metrics = {
      totalBundleSize: 0,
      initialBundleSize: 0,
      chunkSizes: [],
      assetSizes: [],
      compressionRatio: 0,
      loadTimeEstimate: { fast3G: 0, slow3G: 0, wifi: 0 }
    };
  }

  async analyzeBundlePerformance(): Promise<void> {
    console.log('📦 Starting Frontend Bundle Performance Analysis...');
    
    try {
      // Build the application first
      await this.buildApplication();
      
      // Analyze bundle sizes
      await this.analyzeBundleSizes();
      
      // Calculate compression ratios
      await this.calculateCompressionRatios();
      
      // Estimate load times
      this.calculateLoadTimeEstimates();
      
      // Check against performance thresholds
      this.validateThresholds();
      
      // Generate detailed report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error);
    }
  }

  private async buildApplication(): Promise<void> {
    console.log('🔨 Building application for analysis...');
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Application built successfully');
    } catch (error) {
      throw new Error(`Build failed: ${error}`);
    }
  }

  private async analyzeBundleSizes(): Promise<void> {
    console.log('📊 Analyzing bundle sizes...');
    
    if (!fs.existsSync(this.distPath)) {
      throw new Error('Dist directory not found. Build the application first.');
    }
    
    const files = this.getAllFiles(this.distPath);
    
    for (const file of files) {
      const stats = fs.statSync(file);
      const relativePath = path.relative(this.distPath, file);
      const ext = path.extname(file).toLowerCase();
      
      let type: BundleStats['type'] = 'asset';
      if (ext === '.js') type = 'js';
      else if (ext === '.css') type = 'css';
      else if (ext === '.html') type = 'html';
      
      const bundleStat: BundleStats = {
        file: relativePath,
        size: stats.size,
        type
      };
      
      if (type === 'js' || type === 'css') {
        this.metrics.chunkSizes.push(bundleStat);
        
        // Consider main chunks as initial bundle
        if (relativePath.includes('index') || relativePath.includes('main')) {
          this.metrics.initialBundleSize += stats.size;
        }
      } else {
        this.metrics.assetSizes.push(bundleStat);
      }
      
      this.metrics.totalBundleSize += stats.size;
    }
    
    console.log(`Found ${files.length} files, total size: ${this.formatBytes(this.metrics.totalBundleSize)}`);
  }

  private async calculateCompressionRatios(): Promise<void> {
    console.log('📈 Calculating compression ratios...');
    
    // Calculate gzipped sizes for JS and CSS files
    for (const chunk of this.metrics.chunkSizes) {
      if (chunk.type === 'js' || chunk.type === 'css') {
        try {
          const filePath = path.join(this.distPath, chunk.file);
          const gzipCommand = `gzip -c "${filePath}" | wc -c`;
          const gzippedSize = parseInt(execSync(gzipCommand, { encoding: 'utf8' }).trim());
          chunk.gzippedSize = gzippedSize;
        } catch (error) {
          console.warn(`Could not calculate gzipped size for ${chunk.file}`);
        }
      }
    }
    
    // Calculate overall compression ratio
    const totalOriginalSize = this.metrics.chunkSizes.reduce((sum, chunk) => sum + chunk.size, 0);
    const totalGzippedSize = this.metrics.chunkSizes.reduce((sum, chunk) => sum + (chunk.gzippedSize || chunk.size), 0);
    
    this.metrics.compressionRatio = totalOriginalSize > 0 ? totalGzippedSize / totalOriginalSize : 1;
  }

  private calculateLoadTimeEstimates(): void {
    console.log('⏱️ Calculating load time estimates...');
    
    // Network speeds in bytes per second
    const networkSpeeds = {
      slow3G: 50 * 1024,    // 50 KB/s
      fast3G: 200 * 1024,   // 200 KB/s  
      wifi: 1024 * 1024     // 1 MB/s
    };
    
    const initialSizeCompressed = this.metrics.initialBundleSize * this.metrics.compressionRatio;
    
    this.metrics.loadTimeEstimate = {
      slow3G: initialSizeCompressed / networkSpeeds.slow3G * 1000, // Convert to ms
      fast3G: initialSizeCompressed / networkSpeeds.fast3G * 1000,
      wifi: initialSizeCompressed / networkSpeeds.wifi * 1000
    };
  }

  private validateThresholds(): void {
    console.log('🎯 Validating performance thresholds...');
    
    const thresholds = PERFORMANCE_CONFIG.thresholds.frontend.bundleSize;
    const violations = [];
    
    // Check initial bundle size
    if (this.metrics.initialBundleSize > thresholds.initial) {
      violations.push(`Initial bundle size (${this.formatBytes(this.metrics.initialBundleSize)}) exceeds threshold (${this.formatBytes(thresholds.initial)})`);
    }
    
    // Check total bundle size
    if (this.metrics.totalBundleSize > thresholds.total) {
      violations.push(`Total bundle size (${this.formatBytes(this.metrics.totalBundleSize)}) exceeds threshold (${this.formatBytes(thresholds.total)})`);
    }
    
    // Check individual chunk sizes
    for (const chunk of this.metrics.chunkSizes) {
      if (chunk.size > thresholds.chunks) {
        violations.push(`Chunk ${chunk.file} (${this.formatBytes(chunk.size)}) exceeds threshold (${this.formatBytes(thresholds.chunks)})`);
      }
    }
    
    if (violations.length > 0) {
      console.log('⚠️ Bundle size threshold violations:');
      violations.forEach(violation => console.log(`  - ${violation}`));
    } else {
      console.log('✅ All bundle size thresholds met');
    }
  }

  private generateReport(): void {
    console.log('\n📋 Frontend Bundle Performance Report');
    console.log('=====================================');
    
    // Bundle size summary
    console.log('\n📦 Bundle Size Summary:');
    console.log(`Total bundle size: ${this.formatBytes(this.metrics.totalBundleSize)}`);
    console.log(`Initial bundle size: ${this.formatBytes(this.metrics.initialBundleSize)}`);
    console.log(`Compression ratio: ${(this.metrics.compressionRatio * 100).toFixed(1)}%`);
    
    // Load time estimates
    console.log('\n⏱️ Load Time Estimates (initial bundle):');
    console.log(`Slow 3G: ${(this.metrics.loadTimeEstimate.slow3G / 1000).toFixed(1)}s`);
    console.log(`Fast 3G: ${(this.metrics.loadTimeEstimate.fast3G / 1000).toFixed(1)}s`);
    console.log(`WiFi: ${(this.metrics.loadTimeEstimate.wifi / 1000).toFixed(1)}s`);
    
    // Largest chunks
    console.log('\n📊 Largest JavaScript Chunks:');
    const jsChunks = this.metrics.chunkSizes
      .filter(chunk => chunk.type === 'js')
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    jsChunks.forEach(chunk => {
      const gzippedInfo = chunk.gzippedSize ? ` (${this.formatBytes(chunk.gzippedSize)} gzipped)` : '';
      console.log(`  ${chunk.file}: ${this.formatBytes(chunk.size)}${gzippedInfo}`);
    });
    
    // CSS chunks
    const cssChunks = this.metrics.chunkSizes.filter(chunk => chunk.type === 'css');
    if (cssChunks.length > 0) {
      console.log('\n🎨 CSS Files:');
      cssChunks.forEach(chunk => {
        const gzippedInfo = chunk.gzippedSize ? ` (${this.formatBytes(chunk.gzippedSize)} gzipped)` : '';
        console.log(`  ${chunk.file}: ${this.formatBytes(chunk.size)}${gzippedInfo}`);
      });
    }
    
    // Recommendations
    this.generateRecommendations();
    
    // Save detailed report to file
    this.saveReportToFile();
    
    console.log('\n✅ Bundle analysis completed');
  }

  private generateRecommendations(): void {
    console.log('\n💡 Optimization Recommendations:');
    
    const thresholds = PERFORMANCE_CONFIG.thresholds.frontend.bundleSize;
    const recommendations = [];
    
    // Bundle size recommendations
    if (this.metrics.initialBundleSize > thresholds.initial * 0.8) {
      recommendations.push('Consider code splitting to reduce initial bundle size');
    }
    
    if (this.metrics.compressionRatio > 0.7) {
      recommendations.push('Compression ratio is low - consider minification optimizations');
    }
    
    // Check for large chunks that could be split
    const largeChunks = this.metrics.chunkSizes.filter(chunk => 
      chunk.type === 'js' && chunk.size > thresholds.chunks * 0.8
    );
    
    if (largeChunks.length > 0) {
      recommendations.push(`Large chunks detected: consider splitting ${largeChunks.map(c => c.file).join(', ')}`);
    }
    
    // Load time recommendations
    if (this.metrics.loadTimeEstimate.fast3G > 3000) {
      recommendations.push('Load time on 3G exceeds 3 seconds - consider aggressive code splitting');
    }
    
    if (recommendations.length === 0) {
      console.log('  ✅ No optimization recommendations - bundle performance looks good!');
    } else {
      recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
  }

  private saveReportToFile(): void {
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      thresholds: PERFORMANCE_CONFIG.thresholds.frontend.bundleSize,
      summary: {
        totalSize: this.metrics.totalBundleSize,
        initialSize: this.metrics.initialBundleSize,
        compressionRatio: this.metrics.compressionRatio,
        loadTimeEstimates: this.metrics.loadTimeEstimate
      }
    };
    
    const reportPath = path.join('tests', 'performance', 'reports', 'bundle-analysis.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`Detailed report saved to ${reportPath}`);
  }

  private getAllFiles(dir: string): string[] {
    let results: string[] = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        results = results.concat(this.getAllFiles(filePath));
      } else {
        results.push(filePath);
      }
    }
    
    return results;
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
  const analyzer = new BundleAnalyzer();
  await analyzer.analyzeBundlePerformance();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { BundleAnalyzer };