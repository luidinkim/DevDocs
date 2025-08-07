#!/bin/bash

# Initial Setup Script for DevDocs
# Usage: ./scripts/setup.sh

echo "🔧 Setting up DevDocs development environment..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required"
    exit 1
fi

echo "✅ Node.js version check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Copy environment variables
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️ Please update .env.local with your actual values"
fi

# Create necessary directories
echo "📁 Creating required directories..."
mkdir -p public/images
mkdir -p public/assets

# Git hooks setup (optional)
if [ -d .git ]; then
    echo "🪝 Setting up Git hooks..."
    # Add pre-commit hook for linting (if needed)
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000"