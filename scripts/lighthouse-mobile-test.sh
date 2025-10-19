#!/bin/bash

# Phase 5 Mobile Lighthouse Test Script
echo "🚀 Starting Phase 5 Week 1 Mobile Performance Test..."

# Start the server in background
echo "📡 Starting development server..."
npm start &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 10

# Run Lighthouse mobile audit
echo "🔍 Running Lighthouse mobile audit..."
npx lighthouse http://localhost:3000 \
  --form-factor=mobile \
  --output html \
  --output json \
  --output-path ./lighthouse-mobile-week1 \
  --chrome-flags="--headless --no-sandbox" \
  --quiet

# Kill the server
echo "🛑 Stopping server..."
kill $SERVER_PID

echo "✅ Lighthouse audit complete! Check lighthouse-mobile-week1.html for results."