#!/bin/bash

# AWS Amplify Deployment Script
# Usage: ./scripts/deploy.sh [environment]

ENV=${1:-production}
BRANCH=${2:-main}

echo "🚀 Deploying to AWS Amplify..."
echo "Environment: $ENV"
echo "Branch: $BRANCH"

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Deploy to Amplify (requires AWS CLI configured)
if command -v aws &> /dev/null; then
    echo "☁️ Starting Amplify deployment..."
    aws amplify start-job \
        --app-id "$AMPLIFY_APP_ID" \
        --branch-name "$BRANCH" \
        --job-type RELEASE \
        --region ap-northeast-2
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment initiated successfully"
        echo "Check AWS Amplify console for deployment status"
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "⚠️ AWS CLI not found. Please install AWS CLI to deploy."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi