#!/bin/bash
# Full Performance Test Suite Script
# Comprehensive performance testing (30+ minutes)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}$1${NC}"
    echo "$(printf '=%.0s' $(seq 1 ${#1}))"
}

# Start time tracking
START_TIME=$(date +%s)

print_header "🚀 FieldFlux Full Performance Test Suite"

# Check if application is running
print_status "Checking if application is running..."
if ! curl -s -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_warning "Application not running. Starting production server..."
    
    # Build application first
    npm run build
    
    # Start production server
    npm run start &
    APP_PID=$!
    
    # Wait for application to start
    for i in {1..60}; do
        if curl -s -f http://localhost:5000/api/health > /dev/null 2>&1; then
            print_status "Application started successfully"
            break
        fi
        sleep 2
        if [ $i -eq 60 ]; then
            print_error "Failed to start application"
            exit 1
        fi
    done
else
    print_status "Application is running"
    APP_PID=""
fi

# Set performance test duration for full tests
export PERF_DURATION=300000  # 5 minutes

# Create reports directory
mkdir -p tests/performance/reports

# Function to run test with error handling and timing
run_test() {
    local test_name="$1"
    local command="$2"
    local start_time=$(date +%s)
    
    print_status "Running $test_name..."
    
    if eval "$command"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_status "✅ $test_name completed successfully (${duration}s)"
        return 0
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_warning "⚠️  $test_name completed with warnings/errors (${duration}s)"
        return 1
    fi
}

# Track test results
PASSED_TESTS=0
TOTAL_TESTS=0

# Phase 1: API Load Testing
print_header "🌐 Phase 1: API Load Testing"

# Standard load test
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Artillery Standard Load Test" "npm run perf:api"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# k6 detailed testing
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "K6 Detailed Load Test" "npm run perf:api:k6"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Stress testing
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Artillery Stress Test" "npm run perf:stress"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Spike testing
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Artillery Spike Test" "npm run perf:spike"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Phase 2: Database Performance Testing
print_header "🗄️ Phase 2: Database Performance Testing"

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Comprehensive Database Test" "npm run perf:db"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Phase 3: Frontend Performance Testing
print_header "📦 Phase 3: Frontend Performance Testing"

# Bundle analysis
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Bundle Analysis" "npm run perf:bundle"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Lighthouse audit
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Lighthouse Performance Audit" "npm run perf:lighthouse"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Phase 4: System Profiling
print_header "⚡ Phase 4: System Profiling"

# Memory profiling
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Extended Memory Profiling" "npm run perf:memory"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# CPU profiling
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Extended CPU Profiling" "npm run perf:cpu"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Phase 5: Endurance Testing
print_header "🏃 Phase 5: Endurance Testing"

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Endurance Test (Extended Duration)" "npm run perf:endurance"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Phase 6: Regression Analysis
print_header "🔄 Phase 6: Regression Analysis"

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Performance Regression Analysis" "npm run perf:regression"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Phase 7: Comprehensive Reporting
print_header "📊 Phase 7: Comprehensive Reporting"

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Comprehensive Report Generation" "npm run perf:report"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Stop application if we started it
if [ -n "$APP_PID" ]; then
    print_status "Stopping application server..."
    kill $APP_PID 2>/dev/null || true
    wait $APP_PID 2>/dev/null || true
fi

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

# Display comprehensive summary
print_header "📋 Full Test Suite Summary"
echo "Total Duration: ${DURATION_MIN}m ${DURATION_SEC}s"
echo "Tests Passed: ${PASSED_TESTS}/${TOTAL_TESTS}"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    print_status "🎉 All performance tests passed!"
    echo -e "${GREEN}Excellent performance across all categories!${NC}"
elif [ $PASSED_TESTS -gt $((TOTAL_TESTS * 3 / 4)) ]; then
    print_warning "⚠️  Most performance tests passed with some issues"
    echo -e "${YELLOW}Good performance with room for improvement${NC}"
else
    print_error "❌ Multiple performance tests failed"
    echo -e "${RED}Performance issues require attention${NC}"
fi

# Display detailed results if available
if [ -f "tests/performance/reports/comprehensive/performance-report.json" ] && command -v jq &> /dev/null; then
    echo -e "\n${BLUE}🎯 Detailed Results:${NC}"
    
    OVERALL_SCORE=$(jq -r '.summary.overallScore // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    STATUS=$(jq -r '.summary.status // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    REGRESSIONS=$(jq -r '.summary.regressions // 0' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    IMPROVEMENTS=$(jq -r '.summary.improvements // 0' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    
    echo "📊 Overall Performance Score: ${OVERALL_SCORE}/100 (${STATUS})"
    echo "📉 Regressions Detected: ${REGRESSIONS}"
    echo "📈 Improvements Detected: ${IMPROVEMENTS}"
    
    # Display category scores
    echo -e "\n${BLUE}Category Breakdown:${NC}"
    API_SCORE=$(jq -r '.summary.categories.api.score // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    DB_SCORE=$(jq -r '.summary.categories.database.score // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    FRONTEND_SCORE=$(jq -r '.summary.categories.frontend.score // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    MEMORY_SCORE=$(jq -r '.summary.categories.memory.score // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    CPU_SCORE=$(jq -r '.summary.categories.cpu.score // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    
    echo "  🌐 API Performance: ${API_SCORE}/100"
    echo "  🗄️  Database Performance: ${DB_SCORE}/100"
    echo "  📦 Frontend Performance: ${FRONTEND_SCORE}/100"
    echo "  🧠 Memory Performance: ${MEMORY_SCORE}/100"
    echo "  ⚡ CPU Performance: ${CPU_SCORE}/100"
fi

# Display available reports
echo -e "\n${BLUE}📄 Generated Reports:${NC}"
echo "• HTML Report: tests/performance/reports/comprehensive/performance-report.html"
echo "• JSON Report: tests/performance/reports/comprehensive/performance-report.json"
echo "• Markdown Report: tests/performance/reports/comprehensive/performance-report.md"
echo "• CI Summary: tests/performance/reports/comprehensive/ci-summary.md"

# Display individual reports
echo -e "\n${BLUE}📊 Individual Reports:${NC}"
for report in tests/performance/reports/*.json; do
    if [ -f "$report" ]; then
        basename "$report" | sed 's/\.json$//'
    fi
done

# Performance recommendations
if [ -f "tests/performance/reports/comprehensive/performance-report.json" ] && command -v jq &> /dev/null; then
    RECOMMENDATIONS_COUNT=$(jq '.summary.recommendations | length' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
    
    if [ "$RECOMMENDATIONS_COUNT" -gt 0 ] 2>/dev/null; then
        echo -e "\n${BLUE}💡 Top Performance Recommendations:${NC}"
        jq -r '.summary.recommendations[:3][] | "• \(.title) (\(.category), \(.priority) priority)"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null
    fi
fi

# Archive results with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_DIR="tests/performance/archives/$TIMESTAMP"
mkdir -p "$ARCHIVE_DIR"
cp -r tests/performance/reports/* "$ARCHIVE_DIR/" 2>/dev/null || true
print_status "Results archived to: $ARCHIVE_DIR"

# Open report in browser if available
if [ -f "tests/performance/reports/comprehensive/performance-report.html" ]; then
    if command -v open &> /dev/null; then
        print_status "Opening comprehensive performance report..."
        open tests/performance/reports/comprehensive/performance-report.html
    elif command -v xdg-open &> /dev/null; then
        print_status "Opening comprehensive performance report..."
        xdg-open tests/performance/reports/comprehensive/performance-report.html
    fi
fi

# Final recommendations
echo -e "\n${BLUE}🎯 Next Steps:${NC}"
if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo "• Continue monitoring performance in production"
    echo "• Consider updating performance baselines"
    echo "• Schedule regular performance reviews"
else
    echo "• Review failed test outputs for specific issues"
    echo "• Address high-priority performance recommendations"
    echo "• Re-run specific test categories after improvements"
fi

# Exit with appropriate code
if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    exit 0
else
    exit 1
fi