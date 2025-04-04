#!/bin/bash

# Build script for Vercel deployment

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
npm install

# Build the app
npm run build

# Create .vercel directory if it doesn't exist
mkdir -p .vercel

# Success message
echo "Build completed successfully!" 