#!/bin/bash
# Performance Testing Tools Installation Script
# Installs all necessary tools for running performance tests

set -e

echo "🔧 Installing Performance Testing Tools..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_status "npm version: $NPM_VERSION"

# Install global tools
print_status "Installing global performance testing tools..."

# Install Artillery.js
if ! command -v artillery &> /dev/null; then
    print_status "Installing Artillery.js..."
    npm install -g artillery@latest
else
    print_status "Artillery.js already installed: $(artillery version)"
fi

# Install k6 (OS-specific installation)
if ! command -v k6 &> /dev/null; then
    print_status "Installing k6..."
    
    # Detect OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install k6
        else
            print_warning "Homebrew not found. Installing k6 via npm (alternative)..."
            npm install -g k6
        fi
    else
        print_warning "Unsupported OS for k6 installation. Please install manually."
    fi
else
    print_status "k6 already installed: $(k6 version)"
fi

# Install Lighthouse
if ! command -v lighthouse &> /dev/null; then
    print_status "Installing Lighthouse..."
    npm install -g lighthouse@latest
else
    print_status "Lighthouse already installed: $(lighthouse --version)"
fi

# Install Clinic.js (optional)
if ! command -v clinic &> /dev/null; then
    print_status "Installing Clinic.js..."
    npm install -g clinic
else
    print_status "Clinic.js already installed"
fi

# Install Autocannon (optional)
if ! command -v autocannon &> /dev/null; then
    print_status "Installing Autocannon..."
    npm install -g autocannon
else
    print_status "Autocannon already installed"
fi

# Install 0x profiler (optional)
if ! command -v 0x &> /dev/null; then
    print_status "Installing 0x profiler..."
    npm install -g 0x
else
    print_status "0x profiler already installed"
fi

# Install Chrome/Chromium for Lighthouse (if not already installed)
print_status "Checking for Chrome/Chromium..."

if command -v google-chrome &> /dev/null || command -v chromium &> /dev/null || command -v chromium-browser &> /dev/null; then
    print_status "Chrome/Chromium found"
else
    print_warning "Chrome/Chromium not found. Installing..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Ubuntu/Debian
        if command -v apt-get &> /dev/null; then
            wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
            echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
            sudo apt-get update
            sudo apt-get install -y google-chrome-stable
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install --cask google-chrome
        else
            print_warning "Please install Chrome manually from https://www.google.com/chrome/"
        fi
    fi
fi

# Verify installations
print_status "Verifying installations..."

tools=(
    "artillery"
    "k6"
    "lighthouse"
    "clinic"
    "autocannon"
    "0x"
)

for tool in "${tools[@]}"; do
    if command -v "$tool" &> /dev/null; then
        print_status "✅ $tool: installed"
    else
        print_warning "⚠️  $tool: not found"
    fi
done

# Test basic functionality
print_status "Testing basic functionality..."

# Test Artillery
if command -v artillery &> /dev/null; then
    artillery --version > /dev/null 2>&1 && print_status "✅ Artillery: working" || print_warning "⚠️  Artillery: issues detected"
fi

# Test k6
if command -v k6 &> /dev/null; then
    k6 version > /dev/null 2>&1 && print_status "✅ k6: working" || print_warning "⚠️  k6: issues detected"
fi

# Test Lighthouse
if command -v lighthouse &> /dev/null; then
    lighthouse --version > /dev/null 2>&1 && print_status "✅ Lighthouse: working" || print_warning "⚠️  Lighthouse: issues detected"
fi

# Create performance test configuration
print_status "Creating performance test configuration..."

# Create .perfrc file for local configuration
cat > .perfrc << EOF
# Performance Testing Configuration
# This file contains local settings for performance tests

# Base URL for testing (override with PERF_BASE_URL environment variable)
PERF_BASE_URL=http://localhost:5000

# Test duration settings (in seconds)
QUICK_TEST_DURATION=30
STANDARD_TEST_DURATION=120
EXTENDED_TEST_DURATION=300

# Load testing parameters
MAX_VIRTUAL_USERS=100
RAMP_UP_DURATION=30

# Memory profiling settings
MEMORY_SAMPLING_INTERVAL=1000
GC_MONITORING=true

# CPU profiling settings
CPU_SAMPLING_RATE=100
FLAME_GRAPH_OUTPUT=true

# Lighthouse settings
LIGHTHOUSE_THROTTLING=true
LIGHTHOUSE_MOBILE_TEST=true

# Report settings
GENERATE_HTML_REPORTS=true
GENERATE_JSON_REPORTS=true
GENERATE_CSV_REPORTS=false

# CI/CD settings
CI_MODE=false
PERFORMANCE_BUDGET_ENFORCEMENT=true
EOF

print_status "✅ Created .perfrc configuration file"

# Create performance test aliases/shortcuts
print_status "Creating performance test shortcuts..."

cat > scripts/perf-quick.sh << 'EOF'
#!/bin/bash
# Quick performance test (5 minutes)
echo "🚀 Running quick performance tests..."
npm run perf:api:k6
npm run perf:db
npm run perf:bundle
npm run perf:report
echo "✅ Quick performance tests completed"
EOF

cat > scripts/perf-full.sh << 'EOF'
#!/bin/bash
# Full performance test suite (30+ minutes)
echo "🚀 Running full performance test suite..."
npm run perf:load
npm run perf:stress
npm run perf:endurance
npm run perf:memory
npm run perf:cpu
npm run perf:lighthouse
npm run perf:regression
npm run perf:report
echo "✅ Full performance test suite completed"
EOF

chmod +x scripts/perf-quick.sh
chmod +x scripts/perf-full.sh

print_status "✅ Created performance test shortcuts"

# Display next steps
echo -e "\n${BLUE}🎉 Performance Testing Tools Installation Complete!${NC}\n"

echo -e "${GREEN}Next Steps:${NC}"
echo "1. Run 'npm install' to install project-specific dependencies"
echo "2. Configure your DATABASE_URL environment variable"
echo "3. Start your application with 'npm run dev'"
echo "4. Run quick tests with: ./scripts/perf-quick.sh"
echo "5. Run full test suite with: ./scripts/perf-full.sh"

echo -e "\n${GREEN}Available Commands:${NC}"
echo "• npm run perf:load      - API load testing"
echo "• npm run perf:db        - Database performance testing"
echo "• npm run perf:frontend  - Frontend performance testing"
echo "• npm run perf:memory    - Memory profiling"
echo "• npm run perf:cpu       - CPU profiling"
echo "• npm run perf:regression - Regression testing"
echo "• npm run perf:report    - Generate comprehensive report"

echo -e "\n${GREEN}Configuration:${NC}"
echo "• Edit .perfrc to customize settings"
echo "• Set PERF_BASE_URL environment variable for different test targets"
echo "• Check tests/performance/configs/performance-config.ts for detailed settings"

echo -e "\n${YELLOW}Troubleshooting:${NC}"
echo "• If k6 installation fails, try: npm install -g k6"
echo "• For Chrome issues on Linux, install: sudo apt-get install google-chrome-stable"
echo "• For permission issues, you may need to run with sudo"

print_status "Setup complete! 🚀"