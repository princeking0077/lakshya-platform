#!/bin/bash

# Hostinger Auto-Start Script
# This script ensures the application starts correctly

echo "=== Starting Enlighten Pharma Platform ==="

# Set NODE_ENV to production
export NODE_ENV=production

# Check if out directory exists
if [ ! -d "out" ]; then
    echo "⚠️  Warning: /out directory not found. Building now..."
    npm run build
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Warning: node_modules not found. Installing dependencies..."
    npm install
fi

# Start the application
echo "✓ Starting server..."
node app.js
