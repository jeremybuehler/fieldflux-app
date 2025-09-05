# FieldFlux Performance Testing Suite

A comprehensive performance testing and benchmarking ecosystem for the FieldFlux application, covering API load testing, database performance, frontend optimization, memory profiling, and performance regression detection.

## 🚀 Quick Start

### 1. Install Performance Testing Tools

```bash
# Run the installation script
./tests/performance/scripts/install-tools.sh

# Or install manually
npm install -g artillery k6 lighthouse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy and configure environment variables
cp .env.example .env

# Ensure DATABASE_URL is set for database performance tests
export DATABASE_URL="postgresql://localhost:5432/fieldflux"
```

### 4. Run Performance Tests

```bash
# Quick performance check (5 minutes)
npm run perf:load

# Individual test categories
npm run perf:api        # API load testing
npm run perf:db         # Database performance
npm run perf:frontend   # Frontend bundle analysis
npm run perf:memory     # Memory profiling
npm run perf:cpu        # CPU profiling

# Comprehensive report
npm run perf:report
```

## 📊 Test Categories

### API Load Testing
- **Artillery**: Realistic load scenarios with multiple user flows
- **k6**: High-performance load testing with detailed metrics
- **Scenarios**: Normal load, stress testing, spike testing, endurance testing

**Key Metrics:**
- Response time (avg, p95, p99)
- Throughput (requests/second)
- Error rates
- Concurrent user handling

### Database Performance Testing
- Query performance benchmarking
- Connection pool testing
- Concurrent operation handling
- Lock and deadlock detection

**Key Metrics:**
- Query execution time
- Connection establishment time
- Concurrent query performance
- Resource utilization

### Frontend Performance Testing
- Bundle size analysis and optimization recommendations
- Lighthouse audits for Core Web Vitals
- Progressive web app scoring
- Performance budgets enforcement

**Key Metrics:**
- Bundle size and composition
- Core Web Vitals (LCP, FID, CLS)
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Load time estimates across network conditions

### Memory Profiling
- Heap usage monitoring
- Memory leak detection
- Garbage collection analysis
- Memory growth pattern analysis

**Key Metrics:**
- Peak memory usage
- Memory growth over time
- Garbage collection frequency and duration
- Memory leak detection

### CPU Profiling
- CPU utilization monitoring
- Performance bottleneck identification
- Hot spot analysis
- Algorithm efficiency assessment

**Key Metrics:**
- CPU utilization percentage
- Blocking operation detection
- Performance hot spots
- Algorithm complexity analysis

### Performance Regression Testing
- Automated baseline comparison
- Historical performance tracking
- CI/CD integration for regression detection
- Automated alerting on performance degradation

## 🎯 Performance Thresholds

### API Performance SLA
- **Response Time**: p95 < 500ms, p99 < 1s, avg < 200ms
- **Error Rate**: < 1%
- **Throughput**: > 100 requests/second

### Database Performance SLA
- **Simple Queries**: < 50ms
- **Complex Queries**: < 200ms
- **Aggregation Queries**: < 500ms
- **Connection Time**: < 30ms

### Frontend Performance SLA
- **Lighthouse Performance**: > 90
- **Lighthouse Accessibility**: > 95
- **Bundle Size**: Initial < 500KB, Total < 2MB
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Memory Performance SLA
- **Heap Usage**: < 512MB
- **RSS**: < 1GB
- **Memory Growth**: < 25% per hour

## 📁 Directory Structure

```
tests/performance/
├── configs/
│   └── performance-config.ts    # Centralized configuration
├── artillery/
│   ├── api-load-test.yml       # Standard load testing
│   ├── stress-test.yml         # Stress testing scenarios
│   ├── spike-test.yml          # Spike testing scenarios
│   └── endurance-test.yml      # Endurance testing scenarios
├── k6/
│   └── api-load-test.js        # k6 load testing script
├── database/
│   └── db-performance-test.ts  # Database performance testing
├── frontend/
│   ├── bundle-analyzer.ts      # Bundle size analysis
│   └── lighthouse-runner.ts    # Lighthouse automation
├── profiling/
│   ├── memory-profiler.ts      # Memory usage profiling
│   └── cpu-profiler.ts         # CPU performance profiling
├── regression/
│   └── performance-regression.ts # Regression testing
├── reporting/
│   └── generate-report.ts      # Comprehensive reporting
├── reports/                    # Generated reports
│   ├── comprehensive/          # Unified reports
│   ├── baseline.json          # Performance baseline
│   └── *.json                 # Individual test reports
└── scripts/
    └── install-tools.sh       # Tool installation script
```

## 🛠️ Configuration

### Global Configuration
Edit `tests/performance/configs/performance-config.ts` to customize:
- Base URLs and endpoints
- Performance thresholds
- Test duration and load parameters
- Database scenarios
- Report formats

### Environment Variables
```bash
# Application settings
PERF_BASE_URL=http://localhost:5000
DATABASE_URL=postgresql://localhost:5432/fieldflux

# Test duration settings
PERF_DURATION=60000  # Duration in milliseconds

# Baseline management
UPDATE_BASELINE=false  # Set to true to update performance baseline
```

### Local Configuration
Create `.perfrc` for local overrides:
```bash
PERF_BASE_URL=http://localhost:3000
QUICK_TEST_DURATION=30
EXTENDED_TEST_DURATION=300
```

## 🔧 Advanced Usage

### Custom Test Scenarios

#### Creating Custom Artillery Tests
```yaml
# custom-test.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Custom Scenario"
    flow:
      - get:
          url: "/api/custom-endpoint"
```

#### Creating Custom k6 Tests
```javascript
// custom-k6-test.js
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const response = http.get('http://localhost:5000/api/custom-endpoint');
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}
```

### Performance Budgets
Define performance budgets in your configuration:
```typescript
const performanceBudgets = {
  api: {
    responseTime: { max: 500, target: 200 },
    errorRate: { max: 1, target: 0.1 }
  },
  frontend: {
    bundleSize: { max: 500000, target: 400000 },
    lighthouse: { min: 90, target: 95 }
  }
};
```

### CI/CD Integration
The test suite integrates with GitHub Actions for:
- Automated testing on pull requests
- Performance regression detection
- Baseline updates on releases
- Performance report publishing
- Slack/email notifications on failures

## 📊 Reports and Outputs

### Report Formats
- **HTML**: Interactive dashboards with charts and recommendations
- **JSON**: Machine-readable data for automation and APIs
- **Markdown**: Human-readable summaries for documentation
- **CSV**: Data export for external analysis

### Report Contents
- Executive summary with overall performance score
- Category breakdowns (API, Database, Frontend, Memory, CPU)
- Performance trend analysis
- Regression detection results
- Actionable recommendations with implementation guidance
- Historical comparisons and baselines

### Accessing Reports
```bash
# Latest comprehensive report
open tests/performance/reports/comprehensive/performance-report.html

# Individual category reports
open tests/performance/reports/lighthouse-report.html
open tests/performance/reports/bundle-analysis.json
```

## 🚨 Monitoring and Alerting

### Automated Monitoring
- Nightly performance test runs
- Continuous baseline updates
- Regression threshold monitoring
- Performance drift detection

### Alert Conditions
- **Critical**: > 30% performance regression
- **Warning**: 10-30% performance regression
- **Info**: Performance improvements detected

### Integration Points
- GitHub Issues for regression tracking
- Slack notifications for real-time alerts
- Email reports for stakeholders
- Datadog/New Relic for production monitoring

## 🔍 Troubleshooting

### Common Issues

#### Tool Installation Failures
```bash
# If global installs fail, try local installation
npm install artillery k6 lighthouse --save-dev

# For permission issues on macOS/Linux
sudo npm install -g artillery k6 lighthouse
```

#### Database Connection Issues
```bash
# Verify database is running
pg_isready -h localhost -p 5432

# Check connection string format
export DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

#### Chrome/Chromium Issues (Lighthouse)
```bash
# Linux: Install Chrome
sudo apt-get install google-chrome-stable

# macOS: Install Chrome
brew install --cask google-chrome

# Set Chrome path if needed
export CHROME_PATH="/usr/bin/google-chrome"
```

### Performance Test Failures
1. **High Response Times**: Check database queries and API optimizations
2. **Memory Leaks**: Review object lifecycle and cleanup routines
3. **Bundle Size Issues**: Analyze webpack bundle and implement code splitting
4. **Database Slow Queries**: Add indexes and optimize query structure

### Getting Help
- Check the GitHub Issues for known problems
- Review performance reports for specific recommendations
- Use the built-in diagnostic tools for detailed analysis
- Consult the performance configuration documentation

## 🎯 Best Practices

### Test Development
- Write realistic test scenarios based on actual user behavior
- Use production-like data volumes for accurate testing
- Test across different network conditions and device types
- Implement gradual load increases to identify breaking points

### Performance Monitoring
- Establish baseline metrics early in development
- Monitor trends over time, not just absolute values
- Set up alerts for regression detection
- Review performance impact of all major changes

### Optimization Workflow
1. **Measure**: Establish current performance baseline
2. **Identify**: Use profiling to find bottlenecks
3. **Optimize**: Implement targeted improvements
4. **Validate**: Verify improvements with testing
5. **Monitor**: Track long-term performance trends

### CI/CD Integration
- Run quick performance checks on all pull requests
- Execute comprehensive tests on main branch updates
- Block deployments that exceed performance budgets
- Maintain historical performance data for trend analysis

## 📚 Additional Resources

### Documentation
- [Artillery.js Documentation](https://artillery.io/docs/)
- [k6 Documentation](https://k6.io/docs/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web Performance Best Practices](https://web.dev/performance/)

### Tools and Libraries
- [WebPageTest](https://webpagetest.org/) - Online performance testing
- [Clinic.js](https://clinicjs.org/) - Advanced Node.js profiling
- [bundlephobia](https://bundlephobia.com/) - Bundle size analysis
- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) - Bundle composition

### Performance Optimization Guides
- [Field Guide to Web Performance](https://www.keycdn.com/blog/web-performance-guide)
- [Database Performance Tuning](https://use-the-index-luke.com/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)

---

## 🤝 Contributing

### Adding New Performance Tests
1. Create test files in appropriate category directories
2. Update configuration in `performance-config.ts`
3. Add npm scripts to `package.json`
4. Document test scenarios and thresholds
5. Update CI/CD workflows if needed

### Reporting Issues
When reporting performance issues, include:
- Performance test results and logs
- System configuration details
- Steps to reproduce the issue
- Expected vs. actual performance metrics

### Performance Standards
- All tests should complete within reasonable time limits
- Test code should be well-documented and maintainable
- New tests should include appropriate thresholds and assertions
- Performance improvements should be validated with testing

---

**Performance is a feature, not an afterthought. Test early, test often, and keep your applications fast! 🚀**