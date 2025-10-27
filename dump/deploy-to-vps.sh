#!/bin/bash

# Production Deployment Script for OVHcloud VPS
# Run this from your local development machine

set -e

# Configuration
VPS_USER="deployer"
VPS_HOST="YOUR_VPS_IP"  # Replace with your actual VPS IP
APP_DIR="/home/deployer/telephone-directory"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Verify we're on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    print_error "Must be on 'main' branch for production deployment"
    print_status "Current branch: $current_branch"
    print_status "Switch with: git checkout main"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "Uncommitted changes detected. Please commit or stash changes."
    exit 1
fi

print_status "🚀 Starting production deployment to OVHcloud VPS..."

# Run local tests first
print_status "Running local tests..."
npm test || {
    print_error "Tests failed. Deployment aborted."
    exit 1
}

print_success "✅ All tests passed"

# Build application locally to verify
print_status "Building application locally..."
npm run build || {
    print_error "Build failed. Deployment aborted."
    exit 1
}

print_success "✅ Build successful"

# Push to remote repository
print_status "Pushing to remote repository..."
git push origin main

print_success "✅ Code pushed to repository"

# Deploy to VPS
print_status "Deploying to production VPS..."

# Create deployment commands
DEPLOY_COMMANDS="
    cd $APP_DIR &&
    git pull origin main &&
    npm ci --production=false &&
    npm run build &&
    pm2 restart telephone-directory &&
    pm2 save
"

# Execute deployment on VPS
ssh $VPS_USER@$VPS_HOST "$DEPLOY_COMMANDS" || {
    print_error "Deployment failed on VPS"
    exit 1
}

print_success "✅ Deployment completed successfully!"

# Verify deployment
print_status "Verifying deployment..."
sleep 5

# Check if application is responding
if ssh $VPS_USER@$VPS_HOST "curl -f -s http://localhost:3000 > /dev/null"; then
    print_success "✅ Application is responding"
else
    print_error "❌ Application verification failed"
    print_status "Check logs with: ssh $VPS_USER@$VPS_HOST 'pm2 logs telephone-directory'"
fi

print_success "🎉 Production deployment completed!"
print_status "Application URL: https://your-domain.com"

# Display post-deployment information
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Post-Deployment Commands:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Check status:    ssh $VPS_USER@$VPS_HOST 'pm2 status'"
echo "View logs:       ssh $VPS_USER@$VPS_HOST 'pm2 logs telephone-directory'"
echo "Monitor app:     ssh $VPS_USER@$VPS_HOST 'pm2 monit'"
echo "Restart app:     ssh $VPS_USER@$VPS_HOST 'pm2 restart telephone-directory'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"