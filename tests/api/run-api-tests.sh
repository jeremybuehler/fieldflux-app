#!/bin/bash

# FieldFlux API Test Runner
# Runs Newman API tests with different configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_COLLECTION="tests/api/fieldflux-api-collection.json"
TEST_ENVIRONMENT="tests/api/test-environment.json"
RESULTS_DIR="test-results/api"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Ensure results directory exists
mkdir -p "$RESULTS_DIR"

echo -e "${BLUE}🚀 Starting FieldFlux API Tests${NC}"
echo "Timestamp: $TIMESTAMP"
echo "Collection: $API_COLLECTION"
echo "Environment: $TEST_ENVIRONMENT"
echo ""

# Function to run Newman with specific configuration
run_newman_test() {
    local test_name=$1
    local extra_args=$2
    local output_file="$RESULTS_DIR/${test_name}_${TIMESTAMP}"
    
    echo -e "${BLUE}Running $test_name tests...${NC}"
    
    if newman run "$API_COLLECTION" \
        --environment "$TEST_ENVIRONMENT" \
        --reporters cli,json,junit \
        --reporter-json-export "${output_file}.json" \
        --reporter-junit-export "${output_file}.xml" \
        --timeout-request 30000 \
        --timeout-script 10000 \
        --bail \
        $extra_args; then
        echo -e "${GREEN}✅ $test_name tests passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name tests failed${NC}"
        return 1
    fi
}

# Function to check if server is running
check_server() {
    local base_url="http://localhost:5000"
    local max_attempts=10
    local attempt=1
    
    echo -e "${YELLOW}⏳ Checking if server is running at $base_url...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$base_url/health" > /dev/null 2>&1 || curl -s -f "$base_url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Server is running${NC}"
            return 0
        fi
        
        echo "Attempt $attempt/$max_attempts failed, waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ Server is not responding after $max_attempts attempts${NC}"
    echo -e "${YELLOW}💡 Please start the server with: npm run dev${NC}"
    return 1
}

# Function to generate summary report
generate_summary() {
    echo ""
    echo -e "${BLUE}📊 Test Results Summary${NC}"
    echo "======================================"
    
    local json_files=("$RESULTS_DIR"/*_"$TIMESTAMP".json)
    
    if [ ${#json_files[@]} -eq 0 ]; then
        echo "No test results found"
        return
    fi
    
    for json_file in "${json_files[@]}"; do
        if [ -f "$json_file" ]; then
            local test_name=$(basename "$json_file" | sed "s/_${TIMESTAMP}.json//")
            echo ""
            echo "Test Suite: $test_name"
            
            # Extract key metrics using node if available, otherwise use basic parsing
            if command -v node &> /dev/null; then
                node -e "
                    const fs = require('fs');
                    try {
                        const data = JSON.parse(fs.readFileSync('$json_file', 'utf8'));
                        const stats = data.run.stats;
                        console.log('  Requests: ' + stats.requests.total + ' (' + stats.requests.passed + ' passed, ' + stats.requests.failed + ' failed)');
                        console.log('  Tests: ' + stats.tests.total + ' (' + stats.tests.passed + ' passed, ' + stats.tests.failed + ' failed)');
                        console.log('  Duration: ' + Math.round(data.run.timings.completed - data.run.timings.started) + 'ms');
                    } catch(e) {
                        console.log('  Could not parse results');
                    }
                "
            else
                echo "  Results saved to: $json_file"
            fi
        fi
    done
    
    echo ""
}

# Main execution
main() {
    local exit_code=0
    
    # Check if Newman is installed
    if ! command -v newman &> /dev/null; then
        echo -e "${RED}❌ Newman is not installed. Install with: npm install -g newman${NC}"
        exit 1
    fi
    
    # Check if collection and environment files exist
    if [ ! -f "$API_COLLECTION" ]; then
        echo -e "${RED}❌ API collection file not found: $API_COLLECTION${NC}"
        exit 1
    fi
    
    if [ ! -f "$TEST_ENVIRONMENT" ]; then
        echo -e "${RED}❌ Test environment file not found: $TEST_ENVIRONMENT${NC}"
        exit 1
    fi
    
    # Check if server is running
    if ! check_server; then
        exit 1
    fi
    
    echo ""
    
    # Run basic API tests
    if ! run_newman_test "basic" "--folder Authentication --folder Analytics"; then
        exit_code=1
    fi
    
    # Run CRUD tests
    if ! run_newman_test "crud" "--folder 'Leads Management' --folder 'Social Media'"; then
        exit_code=1
    fi
    
    # Run error handling tests
    if ! run_newman_test "error-handling" "--folder 'Error Handling'"; then
        exit_code=1
    fi
    
    # Run all tests together for comprehensive coverage
    if ! run_newman_test "comprehensive" ""; then
        exit_code=1
    fi
    
    # Generate summary
    generate_summary
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}🎉 All API tests completed successfully!${NC}"
    else
        echo -e "${RED}💥 Some API tests failed. Check the results above.${NC}"
    fi
    
    # Open results in browser if available
    if command -v open &> /dev/null && [ -f "$RESULTS_DIR/comprehensive_${TIMESTAMP}.json" ]; then
        echo ""
        echo -e "${BLUE}💡 To view detailed results, you can import the JSON files into Postman${NC}"
    fi
    
    exit $exit_code
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [--help|--quick|--folder FOLDER_NAME]"
        echo ""
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --quick             Run only basic health checks"
        echo "  --folder NAME       Run tests from specific folder only"
        echo ""
        echo "Examples:"
        echo "  $0                         # Run all tests"
        echo "  $0 --quick                 # Quick health check only"
        echo "  $0 --folder Authentication # Run authentication tests only"
        exit 0
        ;;
    --quick)
        check_server
        run_newman_test "quick" "--folder Authentication"
        exit $?
        ;;
    --folder)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}❌ Folder name required after --folder${NC}"
            exit 1
        fi
        check_server
        run_newman_test "$2" "--folder '$2'"
        exit $?
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}❌ Unknown option: $1${NC}"
        echo "Use --help for usage information"
        exit 1
        ;;
esac