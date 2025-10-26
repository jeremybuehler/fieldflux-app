#!/bin/bash

# Kill any existing processes on port 5000
echo "🛑 Cleaning up port 5000..."
lsof -i :5000 | grep -v COMMAND | awk '{print $2}' | xargs -r kill -9 2>/dev/null || true
sleep 1

# Kill any lingering node processes
pkill -f "npm run dev" 2>/dev/null || true
sleep 1

# Set environment variables
export DATABASE_URL="postgresql://postgres:password@localhost:5432/fieldflux"
export OPENAI_API_KEY="sk-test-local"
export NODE_ENV="development"

# Start the dev server
echo "🚀 Starting FieldFlux dev server..."
npm run dev
