/**
 * Lighthouse Performance Testing Runner
 * Automated Lighthouse audits for frontend performance monitoring
 */

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { PERFORMANCE_CONFIG } from '../configs/performance-config.js';

interface LighthouseResult {
  url: string;
  timestamp: number;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa?: number;
  };
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    speedIndex: number;
    timeToInteractive: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    numericValue: number;
    displayValue: string;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    displayValue: string;
  }>;
}

class LighthouseRunner {
  private chrome: any;
  private results: LighthouseResult[] = [];

  async runLighthouseAudits(): Promise<void> {
    console.log('🚀 Starting Lighthouse Performance Audits...');
    
    try {
      // Launch Chrome
      this.chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
      });
      
      // Test different scenarios
      await this.auditHomepage();
      await this.auditDashboard();
      await this.auditMobilePerformance();
      
      // Generate reports
      this.validateResults();
      this.generateReport();
      this.saveDetailedReport();
      
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error);
    } finally {
      if (this.chrome) {
        await this.chrome.kill();
      }
    }
  }

  private async auditHomepage(): Promise<void> {
    console.log('🏠 Auditing homepage performance...');
    
    const baseUrl = PERFORMANCE_CONFIG.baseUrl.replace(':5000', ':5173'); // Use dev server
    const result = await this.runLighthouseAudit(`${baseUrl}/`, {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 10240,
          uploadThroughputKbps: 10240
        }
      }
    });
    
    this.results.push(this.parseLighthouseResult(result, `${baseUrl}/`));
  }

  private async auditDashboard(): Promise<void> {
    console.log('📊 Auditing dashboard performance...');
    
    const baseUrl = PERFORMANCE_CONFIG.baseUrl.replace(':5000', ':5173');
    const result = await this.runLighthouseAudit(`${baseUrl}/dashboard`, {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      }
    });
    
    this.results.push(this.parseLighthouseResult(result, `${baseUrl}/dashboard`));
  }

  private async auditMobilePerformance(): Promise<void> {
    console.log('📱 Auditing mobile performance...');
    
    const baseUrl = PERFORMANCE_CONFIG.baseUrl.replace(':5000', ':5173');
    const result = await this.runLighthouseAudit(`${baseUrl}/`, {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance'],
        formFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 150,
          downloadThroughputKbps: 1638,
          uploadThroughputKbps: 750
        },
        emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.101 Mobile Safari/537.36'
      }
    });
    
    this.results.push(this.parseLighthouseResult(result, `${baseUrl}/ (Mobile)`));
  }

  private async runLighthouseAudit(url: string, config: any): Promise<any> {
    const options = {
      logLevel: 'info',
      output: 'json',
      port: this.chrome.port
    };
    
    try {
      const runnerResult = await lighthouse(url, options, config);
      return runnerResult;
    } catch (error) {
      console.error(`Failed to audit ${url}:`, error);
      throw error;
    }
  }

  private parseLighthouseResult(runnerResult: any, url: string): LighthouseResult {
    const lhr = runnerResult.lhr;
    
    return {
      url,
      timestamp: Date.now(),
      scores: {
        performance: Math.round(lhr.categories.performance?.score * 100) || 0,
        accessibility: Math.round(lhr.categories.accessibility?.score * 100) || 0,
        bestPractices: Math.round(lhr.categories['best-practices']?.score * 100) || 0,
        seo: Math.round(lhr.categories.seo?.score * 100) || 0,
        pwa: lhr.categories.pwa ? Math.round(lhr.categories.pwa.score * 100) : undefined
      },
      metrics: {
        firstContentfulPaint: lhr.audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: lhr.audits['largest-contentful-paint']?.numericValue || 0,
        speedIndex: lhr.audits['speed-index']?.numericValue || 0,
        timeToInteractive: lhr.audits['interactive']?.numericValue || 0,
        totalBlockingTime: lhr.audits['total-blocking-time']?.numericValue || 0,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift']?.numericValue || 0
      },
      opportunities: this.extractOpportunities(lhr),
      diagnostics: this.extractDiagnostics(lhr)
    };
  }

  private extractOpportunities(lhr: any): LighthouseResult['opportunities'] {
    const opportunities = [];
    
    for (const [auditId, audit] of Object.entries(lhr.audits)) {
      const auditData = audit as any;
      if (auditData.details && auditData.details.type === 'opportunity' && auditData.numericValue > 0) {
        opportunities.push({
          id: auditId,
          title: auditData.title,
          description: auditData.description,
          score: auditData.score || 0,
          numericValue: auditData.numericValue,
          displayValue: auditData.displayValue || ''
        });
      }
    }
    
    return opportunities.sort((a, b) => b.numericValue - a.numericValue).slice(0, 10);
  }

  private extractDiagnostics(lhr: any): LighthouseResult['diagnostics'] {
    const diagnostics = [];
    
    const diagnosticAudits = [
      'mainthread-work-breakdown',
      'bootup-time',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'dom-size'
    ];
    
    for (const auditId of diagnosticAudits) {
      const audit = lhr.audits[auditId];
      if (audit) {
        diagnostics.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score || 0,
          displayValue: audit.displayValue || ''
        });
      }
    }
    
    return diagnostics;
  }

  private validateResults(): void {
    console.log('🎯 Validating Lighthouse results against thresholds...');
    
    const thresholds = PERFORMANCE_CONFIG.thresholds.frontend;
    const violations = [];
    
    for (const result of this.results) {
      // Check Lighthouse scores
      if (result.scores.performance < thresholds.lighthouse.performance) {
        violations.push(`${result.url}: Performance score (${result.scores.performance}) below threshold (${thresholds.lighthouse.performance})`);
      }
      
      if (result.scores.accessibility < thresholds.lighthouse.accessibility) {
        violations.push(`${result.url}: Accessibility score (${result.scores.accessibility}) below threshold (${thresholds.lighthouse.accessibility})`);
      }
      
      // Check Web Vitals
      if (result.metrics.largestContentfulPaint > thresholds.webVitals.lcp) {
        violations.push(`${result.url}: LCP (${result.metrics.largestContentfulPaint}ms) exceeds threshold (${thresholds.webVitals.lcp}ms)`);
      }
      
      if (result.metrics.firstContentfulPaint > thresholds.webVitals.fcp) {
        violations.push(`${result.url}: FCP (${result.metrics.firstContentfulPaint}ms) exceeds threshold (${thresholds.webVitals.fcp}ms)`);
      }
      
      if (result.metrics.timeToInteractive > thresholds.webVitals.tti) {
        violations.push(`${result.url}: TTI (${result.metrics.timeToInteractive}ms) exceeds threshold (${thresholds.webVitals.tti}ms)`);
      }
      
      if (result.metrics.cumulativeLayoutShift > thresholds.webVitals.cls) {
        violations.push(`${result.url}: CLS (${result.metrics.cumulativeLayoutShift}) exceeds threshold (${thresholds.webVitals.cls})`);
      }
    }
    
    if (violations.length > 0) {
      console.log('⚠️ Lighthouse threshold violations:');
      violations.forEach(violation => console.log(`  - ${violation}`));
    } else {
      console.log('✅ All Lighthouse thresholds met');
    }
  }

  private generateReport(): void {
    console.log('\n🎨 Lighthouse Performance Report');
    console.log('=================================');
    
    for (const result of this.results) {
      console.log(`\n📍 ${result.url}`);
      console.log(`Performance: ${result.scores.performance}/100`);
      console.log(`Accessibility: ${result.scores.accessibility}/100`);
      console.log(`Best Practices: ${result.scores.bestPractices}/100`);
      console.log(`SEO: ${result.scores.seo}/100`);
      
      console.log('\n⏱️ Core Web Vitals:');
      console.log(`  FCP: ${result.metrics.firstContentfulPaint.toFixed(0)}ms`);
      console.log(`  LCP: ${result.metrics.largestContentfulPaint.toFixed(0)}ms`);
      console.log(`  TTI: ${result.metrics.timeToInteractive.toFixed(0)}ms`);
      console.log(`  TBT: ${result.metrics.totalBlockingTime.toFixed(0)}ms`);
      console.log(`  CLS: ${result.metrics.cumulativeLayoutShift.toFixed(3)}`);
      
      if (result.opportunities.length > 0) {
        console.log('\n💡 Top Opportunities:');
        result.opportunities.slice(0, 3).forEach(opp => {
          console.log(`  • ${opp.title}: ${opp.displayValue}`);
        });
      }
    }
    
    console.log('\n✅ Lighthouse audit completed');
  }

  private saveDetailedReport(): void {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalAudits: this.results.length,
        averagePerformanceScore: this.results.reduce((sum, r) => sum + r.scores.performance, 0) / this.results.length,
        averageAccessibilityScore: this.results.reduce((sum, r) => sum + r.scores.accessibility, 0) / this.results.length
      },
      results: this.results,
      thresholds: PERFORMANCE_CONFIG.thresholds.frontend
    };
    
    const reportPath = path.join('tests', 'performance', 'reports', 'lighthouse-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    // Also save HTML report for the latest audit
    if (this.results.length > 0) {
      const htmlPath = path.join('tests', 'performance', 'reports', 'lighthouse-report.html');
      fs.writeFileSync(htmlPath, this.generateHtmlReport());
    }
    
    console.log(`Detailed report saved to ${reportPath}`);
  }

  private generateHtmlReport(): string {
    const result = this.results[0]; // Use first result for HTML report
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Lighthouse Performance Report - FieldFlux</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .score { font-size: 24px; font-weight: bold; }
        .good { color: #0d7377; }
        .needs-improvement { color: #fa9500; }
        .poor { color: #ff4e42; }
        .metric { margin: 10px 0; }
        .opportunity { margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Lighthouse Performance Report - FieldFlux</h1>
    <p>Generated: ${new Date().toISOString()}</p>
    
    <h2>Scores</h2>
    <div class="score ${result.scores.performance >= 90 ? 'good' : result.scores.performance >= 50 ? 'needs-improvement' : 'poor'}">
        Performance: ${result.scores.performance}/100
    </div>
    <div class="score ${result.scores.accessibility >= 90 ? 'good' : result.scores.accessibility >= 50 ? 'needs-improvement' : 'poor'}">
        Accessibility: ${result.scores.accessibility}/100
    </div>
    
    <h2>Core Web Vitals</h2>
    <div class="metric">First Contentful Paint: ${result.metrics.firstContentfulPaint.toFixed(0)}ms</div>
    <div class="metric">Largest Contentful Paint: ${result.metrics.largestContentfulPaint.toFixed(0)}ms</div>
    <div class="metric">Time to Interactive: ${result.metrics.timeToInteractive.toFixed(0)}ms</div>
    <div class="metric">Total Blocking Time: ${result.metrics.totalBlockingTime.toFixed(0)}ms</div>
    <div class="metric">Cumulative Layout Shift: ${result.metrics.cumulativeLayoutShift.toFixed(3)}</div>
    
    <h2>Optimization Opportunities</h2>
    ${result.opportunities.map(opp => `
        <div class="opportunity">
            <h3>${opp.title}</h3>
            <p>${opp.description}</p>
            <p><strong>Potential Savings:</strong> ${opp.displayValue}</p>
        </div>
    `).join('')}
</body>
</html>`;
  }
}

// Main execution
async function main() {
  const runner = new LighthouseRunner();
  await runner.runLighthouseAudits();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { LighthouseRunner };