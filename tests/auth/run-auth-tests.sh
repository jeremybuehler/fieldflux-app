#!/bin/bash

# Authentication Test Suite Runner
# Runs comprehensive tests for JWT authentication system

set -e

echo "🔐 Starting FieldFlux Authentication Test Suite"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
export NODE_ENV=test
export JWT_SECRET="test-jwt-secret-for-authentication-testing-only"
export DATABASE_URL="postgresql://test:test@localhost:5432/fieldflux_test"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to run test suite with proper error handling
run_test_suite() {
    local suite_name="$1"
    local test_command="$2"
    local description="$3"
    
    print_status "Running $suite_name tests..."
    print_status "Description: $description"
    
    if eval "$test_command"; then
        print_success "$suite_name tests passed!"
        return 0
    else
        print_error "$suite_name tests failed!"
        return 1
    fi
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is required but not installed"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    # Check if test dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_warning "Node modules not found, installing dependencies..."
        npm install
    fi
    
    print_success "All dependencies are available"
}

# Setup test database (if needed)
setup_test_database() {
    print_status "Setting up test database..."
    
    # Check if PostgreSQL is running
    if command -v pg_isready &> /dev/null && pg_isready -h localhost -p 5432 &> /dev/null; then
        print_success "PostgreSQL is running"
        
        # Create test database if it doesn't exist
        if ! psql -h localhost -p 5432 -U postgres -lqt | cut -d \| -f 1 | grep -qw fieldflux_test; then
            print_status "Creating test database..."
            createdb -h localhost -p 5432 -U postgres fieldflux_test || print_warning "Database may already exist"
        fi
        
        # Run migrations (if available)
        if [ -f "package.json" ] && npm run | grep -q "db:push"; then
            print_status "Running database migrations..."
            npm run db:push || print_warning "Database migrations may have failed"
        fi
    else
        print_warning "PostgreSQL not available, some integration tests may fail"
    fi
}

# Main test execution
main() {
    local exit_code=0
    local failed_tests=()
    
    # Check dependencies
    check_dependencies
    
    # Setup test environment
    setup_test_database
    
    print_status "Starting authentication test execution..."
    echo ""
    
    # 1. Unit Tests - Analytics Token Service
    if ! run_test_suite \
        "Analytics Token Service Unit" \
        "npm run test tests/unit/server/analyticsTokenService.test.ts" \
        "Tests JWT token generation, validation, and revocation"; then
        failed_tests+=("Analytics Token Service Unit Tests")
        exit_code=1
    fi
    echo ""
    
    # 2. Unit Tests - Analytics Auth Middleware
    if ! run_test_suite \
        "Analytics Auth Middleware Unit" \
        "npm run test tests/unit/server/analyticsAuthMiddleware.test.ts" \
        "Tests authentication middleware, scope validation, and security controls"; then
        failed_tests+=("Analytics Auth Middleware Unit Tests")
        exit_code=1
    fi
    echo ""
    
    # 3. Integration Tests - Auth Routes
    if ! run_test_suite \
        "Auth Routes Integration" \
        "npm run test tests/integration/analyticsAuthRoutes.test.ts" \
        "Tests API endpoints for token management and authentication flows"; then
        failed_tests+=("Auth Routes Integration Tests")
        exit_code=1
    fi
    echo ""
    
    # 4. Security Tests
    if ! run_test_suite \
        "Security Validation" \
        "npm run test tests/security/authenticationSecurity.test.ts" \
        "Tests security vulnerabilities, attack prevention, and compliance"; then
        failed_tests+=("Security Validation Tests")
        exit_code=1
    fi
    echo ""
    
    # 5. End-to-End Tests (if Playwright is available)
    if command -v npx &> /dev/null && [ -f "playwright.config.ts" ]; then
        if ! run_test_suite \
            "Authentication Flow E2E" \
            "npm run test:e2e -- tests/e2e/authenticationFlow.spec.ts" \
            "Tests complete authentication flows from user perspective"; then
            failed_tests+=("Authentication Flow E2E Tests")
            exit_code=1
        fi
        echo ""
    else
        print_warning "Playwright not available, skipping E2E tests"
        echo ""
    fi
    
    # 6. Performance Tests (optional)
    if [ "$RUN_PERFORMANCE_TESTS" = "true" ]; then
        print_status "Running performance benchmarks..."
        if ! npm run test -- --reporter=verbose tests/performance/auth-performance.test.ts; then
            print_warning "Performance tests failed or not available"
        fi
        echo ""
    fi
    
    # 7. Coverage Report
    if [ "$GENERATE_COVERAGE" != "false" ]; then
        print_status "Generating test coverage report..."
        if npm run test:coverage -- tests/unit/server/analytics* tests/integration/analyticsAuth* tests/security/authentication*; then
            print_success "Coverage report generated successfully"
        else
            print_warning "Coverage report generation failed"
        fi
        echo ""
    fi
    
    # Summary
    echo "=============================================="
    if [ $exit_code -eq 0 ]; then
        print_success "🎉 All authentication tests passed successfully!"
        print_status "The JWT authentication system is secure and functional"
    else
        print_error "❌ Some authentication tests failed:"
        for test in "${failed_tests[@]}"; do
            print_error "  - $test"
        done
        print_status "Please review the failed tests and fix any issues"
    fi
    
    echo ""
    print_status "Test Results Summary:"
    print_status "- JWT Token Service: Unit tests for token lifecycle"
    print_status "- Auth Middleware: Security controls and validation"
    print_status "- API Routes: Integration testing for authentication endpoints"
    print_status "- Security Tests: Vulnerability and attack prevention validation"
    print_status "- E2E Tests: Complete user authentication flows"
    
    if [ "$GENERATE_COVERAGE" != "false" ]; then
        print_status ""
        print_status "Coverage report available at: coverage/index.html"
    fi
    
    echo "=============================================="
    
    exit $exit_code
}

# Handle script arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --performance)
            export RUN_PERFORMANCE_TESTS=true
            shift
            ;;
        --no-coverage)
            export GENERATE_COVERAGE=false
            shift
            ;;
        --verbose)
            set -x
            shift
            ;;
        --help|-h)
            echo "Authentication Test Suite Runner"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --performance     Run performance benchmark tests"
            echo "  --no-coverage     Skip test coverage report generation"
            echo "  --verbose         Enable verbose output"
            echo "  --help, -h        Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  NODE_ENV         Test environment (default: test)"
            echo "  JWT_SECRET       JWT secret for testing (auto-generated)"
            echo "  DATABASE_URL     Test database URL"
            echo ""
            echo "Examples:"
            echo "  $0                           # Run all tests with coverage"
            echo "  $0 --performance             # Include performance tests"
            echo "  $0 --no-coverage --verbose   # Skip coverage, show verbose output"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            print_status "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main function
main "$@"