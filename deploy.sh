#!/bin/bash

# ACTREC Telephone Directory Deployment Script for OVHcloud VPS
# Run this script on your VPS after initial setup

set -e  # Exit on any error

echo "🚀 Starting ACTREC Telephone Directory deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running as deployer user
if [ "$USER" != "deployer" ]; then
    print_error "Please run this script as the 'deployer' user"
    print_status "Switch user with: su - deployer"
    exit 1
fi

# Navigate to application directory
APP_DIR="/home/deployer/telephone-directory"
if [ ! -d "$APP_DIR" ]; then
    print_error "Application directory not found: $APP_DIR"
    print_status "Please clone the repository first"
    exit 1
fi

cd "$APP_DIR"

print_status "Current directory: $(pwd)"

# Check if git repository exists
if [ ! -d ".git" ]; then
    print_error "Not a git repository. Please clone from your repository."
    exit 1
fi

# Pull latest changes
print_status "Pulling latest changes from repository..."
git pull origin main || {
    print_warning "Git pull failed. Continuing with current code..."
}

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in current directory"
    exit 1
fi

# Install/update dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found"
    if [ -f ".env.production" ]; then
        print_status "Copying .env.production to .env.local"
        cp .env.production .env.local
        print_warning "Please edit .env.local with your actual values"
    else
        print_error "No environment configuration found"
        print_status "Please create .env.local with your configuration"
        exit 1
    fi
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    print_status "Creating logs directory..."
    mkdir -p logs
fi

# Build the application
print_status "Building Next.js application..."
npm run build

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
fi

# Check if ecosystem.config.js exists
if [ ! -f "ecosystem.config.js" ]; then
    print_error "ecosystem.config.js not found"
    print_status "Please ensure the PM2 configuration file exists"
    exit 1
fi

# Stop existing PM2 process if running
print_status "Stopping existing PM2 processes..."
pm2 stop telephone-directory 2>/dev/null || print_warning "No existing process to stop"

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 process list
print_status "Saving PM2 process list..."
pm2 save

# Display PM2 status
print_status "Current PM2 status:"
pm2 status

# Check if application is responding
print_status "Checking if application is responding..."
sleep 5

if curl -f -s http://localhost:3000 > /dev/null; then
    print_success "✅ Application is responding on port 3000"
else
    print_error "❌ Application is not responding on port 3000"
    print_status "Check PM2 logs with: pm2 logs telephone-directory"
    exit 1
fi

# Display logs
print_status "Recent application logs:"
pm2 logs telephone-directory --lines 10

print_success "🎉 Deployment completed successfully!"
print_status "Application is running at: http://localhost:3000"
print_status "Use 'pm2 logs telephone-directory' to view logs"
print_status "Use 'pm2 restart telephone-directory' to restart the app"

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2{printf "%s", $5}')
print_status "Current disk usage: $DISK_USAGE"

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')
print_status "Current memory usage: $MEMORY_USAGE"

echo
print_success "Deployment completed! 🚀"