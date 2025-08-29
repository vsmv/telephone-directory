# Development Workflow & Environment Management
## ACTREC Telephone Directory - Post-Production Setup

This guide establishes a proper development workflow for managing changes, testing, and deployments after your production VPS is live.

## Environment Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEVELOPMENT   │    │    STAGING      │    │   PRODUCTION    │
│   (Local PC)    │───▶│  (VPS Subdomain)│───▶│   (Main VPS)    │
│                 │    │                 │    │                 │
│ • Feature dev   │    │ • Integration   │    │ • Live users    │
│ • Unit testing  │    │ • User testing  │    │ • Stable code   │
│ • Code changes  │    │ • QA validation │    │ • Minimal risk  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Phase 1: Environment Setup Strategy

### Option A: Single VPS with Multiple Environments (Recommended for Small Projects)
**Cost**: $4.20/month (OVHcloud VPS-1 only)
- Production: `https://actrec-directory.com`
- Staging: `https://staging.actrec-directory.com`
- Both run on same VPS, different ports

### Option B: Separate VPS for Staging
**Cost**: $8.40/month (2x OVHcloud VPS-1)
- Production VPS: Main application
- Staging VPS: Testing environment

### Option C: Local + Cloud Hybrid (Most Cost-Effective)
**Cost**: $4.20/month + free services
- Local Development: Your Windows PC
- Staging: Vercel/Netlify (free tier)
- Production: OVHcloud VPS

## Recommended Setup: Option C (Hybrid Approach)

## Phase 2: Environment Configuration

### 1. Local Development Environment
```bash
# On your Windows PC
npm run dev                    # Port 3000 (development)
npm run dev:staging           # Port 3001 (staging simulation)
npm run test                  # Run all tests
npm run test:watch           # Watch mode testing
```

### 2. Staging Environment (Vercel - Free)
- **URL**: `https://actrec-directory-staging.vercel.app`
- **Purpose**: Integration testing, client demos
- **Database**: Supabase staging project (separate from production)

### 3. Production Environment (OVHcloud VPS)
- **URL**: `https://actrec-directory.com`
- **Purpose**: Live application
- **Database**: Supabase production project

## Phase 3: Git Workflow Strategy

### Branch Strategy
```
main (production)
├── develop (integration)
│   ├── feature/contact-search-enhancement
│   ├── feature/bulk-import-optimization
│   └── hotfix/login-bug-fix
└── staging (staging deployment)
```

### Workflow Process
1. **Feature Development**: Create feature branch from `develop`
2. **Local Testing**: Test thoroughly on local environment
3. **Integration**: Merge to `develop` branch
4. **Staging Deployment**: Deploy `develop` to staging for QA
5. **Production Release**: Merge `develop` to `main` for production

## Phase 4: Detailed Setup Instructions

### Step 1: Create Environment-Specific Configurations

**Files Created:**
- `.env.development` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production VPS

### Step 2: Git Repository Setup

```bash
# Initialize Git branches (if not already done)
git checkout -b develop
git checkout -b staging
git checkout main

# Set up remote repository (GitHub/GitLab)
git remote add origin https://github.com/your-username/telephone-directory.git
git push -u origin main
git push -u origin develop
git push -u origin staging
```

### Step 3: Staging Environment Setup (Vercel)

1. **Create Vercel Account**: Sign up at vercel.com
2. **Connect Repository**: Link your GitHub repository
3. **Configure Environment Variables**: Add staging variables
4. **Set Branch**: Deploy from `develop` branch

```bash
# Deploy to staging
npm run deploy:staging
```

### Step 4: Production Deployment Setup

1. **Update VPS IP**: Edit `scripts/deploy-to-vps.sh`
2. **SSH Key Setup**: Configure passwordless SSH
3. **Deploy**: Run production deployment

```bash
# Deploy to production VPS
npm run sync:production
```

## Phase 5: Daily Development Workflow

### For New Features

```bash
# 1. Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-contact-validation

# 2. Develop locally
npm run dev
# Make your changes...
npm run test

# 3. Commit and push
git add .
git commit -m "feat: add enhanced contact validation"
git push origin feature/new-contact-validation

# 4. Create Pull Request (GitHub/GitLab)
# Merge to develop after review

# 5. Deploy to staging
git checkout develop
git pull origin develop
npm run sync:staging

# 6. Test on staging
# https://actrec-directory-staging.vercel.app

# 7. Deploy to production (after approval)
git checkout main
git merge develop
npm run sync:production
```

### For Hotfixes

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-login-fix

# 2. Fix and test
npm run dev
# Fix the issue...
npm run test

# 3. Deploy immediately
git add .
git commit -m "hotfix: resolve critical login issue"
git checkout main
git merge hotfix/critical-login-fix
npm run sync:production

# 4. Sync back to develop
git checkout develop
git merge main
git push origin develop
```

## Phase 6: Testing Strategy

### Local Testing
```bash
# Unit tests
npm run test

# Integration tests
npm run test:coverage

# Manual testing
npm run dev
# Test all features manually
```

### Staging Testing
- **Automated**: Tests run on Vercel deployment
- **Manual**: Client/stakeholder testing
- **Performance**: Load testing with staging data
- **Security**: Vulnerability scanning

### Production Testing
- **Smoke Tests**: Basic functionality verification
- **Monitoring**: Real-time error tracking
- **Rollback Plan**: Immediate revert capability

## Phase 7: Database Management

### Development Database
- **Option 1**: Local PostgreSQL instance
- **Option 2**: Supabase development project
- **Option 3**: Docker PostgreSQL container

### Staging Database
- **Supabase Staging Project**: Separate from production
- **Test Data**: Anonymized production data copies
- **Schema Sync**: Mirror production schema

### Production Database
- **Supabase Production**: Live data
- **Backups**: Daily automated backups
- **Migration Strategy**: Careful schema changes

## Phase 8: Monitoring and Maintenance

### Application Monitoring
```bash
# Check application health
curl -I https://actrec-directory.com/api/health

# Monitor VPS resources
ssh deployer@your-vps-ip "htop"

# View application logs
ssh deployer@your-vps-ip "pm2 logs telephone-directory"
```

### Performance Monitoring
- **Uptime**: 99.9% target
- **Response Time**: <200ms average
- **Error Rate**: <0.1%
- **Resource Usage**: CPU <70%, Memory <80%

### Security Monitoring
- **SSL Certificate**: Auto-renewal with Certbot
- **Security Updates**: Monthly OS updates
- **Access Logs**: Monitor for suspicious activity
- **Backup Verification**: Weekly backup testing

## Phase 9: Cost Optimization

### Current Setup Cost
- **OVHcloud VPS-1**: $4.20/month
- **Domain Name**: ~$1/month
- **Vercel Staging**: Free
- **Supabase**: Free tier (up to 500MB)
- **Total**: ~$5.20/month

### Scaling Considerations
- **Traffic Growth**: Monitor bandwidth usage
- **Database Growth**: Watch Supabase storage limits
- **Performance**: Consider VPS-2 upgrade if needed

## Phase 10: Troubleshooting Guide

### Common Issues

**Deployment Fails:**
```bash
# Check VPS connectivity
ssh deployer@your-vps-ip "pm2 status"

# Verify build process
npm run build

# Check environment variables
cat .env.production
```

**Application Down:**
```bash
# Restart application
ssh deployer@your-vps-ip "pm2 restart telephone-directory"

# Check logs
ssh deployer@your-vps-ip "pm2 logs telephone-directory --lines 50"

# Verify database connection
curl -X GET 'https://your-project.supabase.co/rest/v1/contacts' \
-H "apikey: your-anon-key"
```

**Staging Issues:**
```bash
# Redeploy to Vercel
npm run deploy:staging

# Check Vercel logs
# Visit Vercel dashboard
```

## Quick Reference Commands

```bash
# Development
npm run dev              # Start local development
npm run test            # Run tests
npm run lint            # Code quality check

# Staging
npm run sync:staging    # Deploy to staging

# Production
npm run sync:production # Deploy to production

# Monitoring
ssh deployer@VPS_IP "pm2 monit"     # Monitor app
ssh deployer@VPS_IP "pm2 logs"      # View logs
ssh deployer@VPS_IP "pm2 restart"   # Restart app
```

## Summary

This workflow provides:
- ✅ **Safe Development**: Isolated local environment
- ✅ **Quality Assurance**: Staging environment for testing
- ✅ **Reliable Deployment**: Automated production deployment
- ✅ **Cost Effective**: ~$5.20/month total cost
- ✅ **Scalable**: Easy to upgrade as needs grow
- ✅ **Maintainable**: Clear processes for changes and updates

Your ACTREC Telephone Directory now has a professional development workflow! 🚀