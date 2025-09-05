#!/bin/bash
# Quick Performance Test Script
# Runs essential performance tests in under 5 minutes

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

print_header "🚀 FieldFlux Quick Performance Test"

# Check if application is running
print_status "Checking if application is running..."
if ! curl -s -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_warning "Application not running. Starting development server..."
    npm run dev &
    APP_PID=$!
    
    # Wait for application to start
    for i in {1..30}; do
        if curl -s -f http://localhost:5000/api/health > /dev/null 2>&1; then
            print_status "Application started successfully"
            break
        fi
        sleep 2
        if [ $i -eq 30 ]; then
            print_error "Failed to start application"
            exit 1
        fi
    done
else
    print_status "Application is running"
    APP_PID=""
fi

# Set performance test duration for quick tests
export PERF_DURATION=30000  # 30 seconds

# Create reports directory
mkdir -p tests/performance/reports

# Function to run test with error handling
run_test() {
    local test_name="$1"
    local command="$2"
    
    print_status "Running $test_name..."
    
    if eval "$command"; then
        print_status "✅ $test_name completed successfully"
        return 0
    else
        print_warning "⚠️  $test_name completed with warnings/errors"
        return 1
    fi
}

# Track test results
PASSED_TESTS=0
TOTAL_TESTS=0

# Run API Performance Test (k6)
print_header "🌐 API Performance Test"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "K6 API Load Test" "npm run perf:api:k6"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Run Database Performance Test
print_header "🗄️ Database Performance Test"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Database Performance Test" "npm run perf:db"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Run Frontend Bundle Analysis
print_header "📦 Frontend Bundle Analysis"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Bundle Analysis" "npm run perf:bundle"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Run Memory Profiling (short duration)
print_header "🧠 Memory Profiling"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Memory Profiling" "npm run perf:memory"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Run Performance Regression Test
print_header "🔄 Performance Regression Test"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Regression Test" "npm run perf:regression"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Generate comprehensive report
print_header "📊 Generating Performance Report"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
if run_test "Report Generation" "npm run perf:report"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
fi

# Stop application if we started it
if [ -n "$APP_PID" ]; then
    print_status "Stopping development server..."
    kill $APP_PID 2>/dev/null || true
fi

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Display summary
print_header "📋 Test Summary"
echo "Duration: ${DURATION}s"
echo "Tests Passed: ${PASSED_TESTS}/${TOTAL_TESTS}"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    print_status "🎉 All performance tests passed!"
    echo -e "${GREEN}Performance looks good!${NC}"
else
    print_warning "⚠️  Some performance tests had issues"
    echo -e "${YELLOW}Check individual test outputs for details${NC}"
fi

# Display report locations
echo -e "\n${BLUE}📄 Reports Available:${NC}"
echo "• HTML Report: tests/performance/reports/comprehensive/performance-report.html"
echo "• JSON Report: tests/performance/reports/comprehensive/performance-report.json"
echo "• Markdown Report: tests/performance/reports/comprehensive/performance-report.md"

# Display key findings if reports exist
if [ -f "tests/performance/reports/comprehensive/performance-report.json" ]; then
    echo -e "\n${BLUE}🎯 Quick Results:${NC}"
    
    # Extract key metrics using jq if available
    if command -v jq &> /dev/null; then
        OVERALL_SCORE=$(jq -r '.summary.overallScore // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
        STATUS=$(jq -r '.summary.status // "N/A"' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
        REGRESSIONS=$(jq -r '.summary.regressions // 0' tests/performance/reports/comprehensive/performance-report.json 2>/dev/null)
        
        echo "Overall Score: ${OVERALL_SCORE}/100 (${STATUS})"
        echo "Regressions: ${REGRESSIONS}"
    else
        echo "Install 'jq' for detailed result summary"
    fi
fi

# Open report in browser if available
if command -v open &> /dev/null && [ -f "tests/performance/reports/comprehensive/performance-report.html" ]; then
    print_status "Opening performance report in browser..."
    open tests/performance/reports/comprehensive/performance-report.html
elif command -v xdg-open &> /dev/null && [ -f "tests/performance/reports/comprehensive/performance-report.html" ]; then
    print_status "Opening performance report in browser..."
    xdg-open tests/performance/reports/comprehensive/performance-report.html
fi

# Exit with appropriate code
if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    exit 0
else
    exit 1
fi