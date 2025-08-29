# Quick Reference: Development Workflow
## ACTREC Telephone Directory Post-Production Management

## 🏗️ **Recommended Setup: Hybrid Approach**

| Environment | Platform | Cost | Purpose | URL |
|-------------|----------|------|---------|-----|
| **Development** | Local PC | Free | Feature development, testing | `http://localhost:3000` |
| **Staging** | Vercel | Free | Integration testing, client demos | `https://actrec-directory-staging.vercel.app` |
| **Production** | OVHcloud VPS-1 | $4.20/month | Live application | `https://actrec-directory.com` |

**Total Monthly Cost: ~$5.20/month** (including domain)

## 🚀 **Daily Workflow Commands**

### **New Feature Development**
```bash
# 1. Start new feature
git checkout develop
git checkout -b feature/new-enhancement

# 2. Develop & test locally
npm run dev                    # http://localhost:3000
npm run test                   # Run all tests

# 3. Deploy to staging for QA
git checkout develop
git merge feature/new-enhancement
npm run sync:staging           # Deploy to Vercel

# 4. Deploy to production (after approval)
git checkout main
git merge develop
npm run sync:production        # Deploy to VPS
```

### **Hotfix (Emergency Fix)**
```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/critical-fix

# 2. Fix & test
npm run dev
npm run test

# 3. Deploy immediately to production
git checkout main
git merge hotfix/critical-fix
npm run sync:production

# 4. Sync back to develop
git checkout develop
git merge main
```

## 📋 **Environment Management**

### **Local Development (.env.development)**
- Supabase dev project
- Debug logs enabled
- Test features enabled
- Port: 3000

### **Staging (.env.staging)**  
- Separate Supabase staging project
- Client demo ready
- QA testing environment
- Auto-deploy from `develop` branch

### **Production (.env.production)**
- Live Supabase project
- Optimized for performance
- Deploy from `main` branch only
- SSL enabled with monitoring

## 🔄 **Git Branch Strategy**

```
main (production)           ← Deploy to VPS
├── develop (integration)   ← Deploy to Staging  
│   ├── feature/search-enhancement
│   ├── feature/bulk-optimization
│   └── hotfix/login-fix
└── staging (auto-deploy)   ← Vercel staging branch
```

## 🛠️ **Key Commands Reference**

### **Development**
```bash
npm run dev              # Start local development
npm run dev:staging     # Local staging simulation (port 3001)
npm run test            # Run tests
npm run test:watch      # Watch mode testing
npm run lint            # Code quality check
```

### **Deployment**
```bash
npm run sync:staging     # Deploy develop → Vercel staging
npm run sync:production  # Deploy main → OVHcloud VPS
npm run build           # Build for production
npm run start           # Start production server
```

### **Monitoring**
```bash
# Check VPS application status
ssh deployer@YOUR_VPS_IP "pm2 status"

# View application logs  
ssh deployer@YOUR_VPS_IP "pm2 logs telephone-directory"

# Monitor resources
ssh deployer@YOUR_VPS_IP "htop"

# Restart application
ssh deployer@YOUR_VPS_IP "pm2 restart telephone-directory"
```

## 🧪 **Testing Strategy**

### **Local Testing**
- Unit tests: `npm run test`
- Integration tests: Manual feature testing
- Performance: Local load testing

### **Staging Testing** 
- Automated CI/CD tests on Vercel
- Client/stakeholder demos
- QA validation testing
- Cross-browser testing

### **Production Testing**
- Smoke tests after deployment
- Real-time monitoring
- Error tracking and alerts
- Performance monitoring

## 🗃️ **Database Management**

### **Development Database**
- Local PostgreSQL OR Supabase dev project
- Sample data for testing
- Schema experimentation safe

### **Staging Database**  
- Supabase staging project (separate from prod)
- Anonymized production data copies
- Safe for testing data operations

### **Production Database**
- Supabase production project
- Live user data
- Daily automated backups
- Careful migration strategies

## 📊 **Change Management Process**

### **For New Features (2-3 days)**
1. **Day 1**: Develop locally, write tests
2. **Day 2**: Deploy to staging, QA testing
3. **Day 3**: Production deployment (after approval)

### **For Bug Fixes (Same day)**
1. **Immediate**: Fix locally, test
2. **Within 2 hours**: Deploy to production
3. **Follow-up**: Sync to develop branch

### **For Major Changes (1 week)**
1. **Week planning**: Feature branch creation
2. **Development**: Multiple iterations in staging
3. **QA Period**: Extended testing phase
4. **Production**: Careful monitored deployment

## 🚨 **Emergency Procedures**

### **Application Down**
```bash
# 1. Check VPS status
ssh deployer@YOUR_VPS_IP "pm2 status"

# 2. Restart if needed
ssh deployer@YOUR_VPS_IP "pm2 restart telephone-directory"

# 3. Check logs for errors
ssh deployer@YOUR_VPS_IP "pm2 logs telephone-directory --lines 50"

# 4. Rollback if necessary
ssh deployer@YOUR_VPS_IP "cd /home/deployer/telephone-directory && git reset --hard HEAD~1"
```

### **Database Issues**
```bash
# Test Supabase connection
curl -X GET 'https://your-project.supabase.co/rest/v1/contacts' \
-H "apikey: your-anon-key"

# Check environment variables
ssh deployer@YOUR_VPS_IP "cat /home/deployer/telephone-directory/.env.local"
```

## 💰 **Cost Monitoring**

### **Current Monthly Costs**
- OVHcloud VPS-1: $4.20
- Domain registration: ~$1.00
- Vercel staging: $0 (Free tier)
- Supabase: $0 (Free tier up to 500MB)
- **Total: ~$5.20/month**

### **Scaling Thresholds**
- **VPS Upgrade** ($6.75/month): >80% CPU usage consistently
- **Supabase Pro** ($25/month): >500MB database or >100K monthly active users
- **Vercel Pro** ($20/month): >100GB bandwidth or team collaboration needed

## 📈 **Performance Targets**

### **Application Performance**
- Response time: <200ms average
- Uptime: >99.9%
- Page load: <2 seconds
- Search results: <500ms

### **VPS Resources**
- CPU usage: <70% average
- Memory usage: <80%
- Disk usage: <60%
- Network: Unlimited (OVHcloud benefit)

## 🔐 **Security Checklist**

### **Monthly Security Tasks**
- [ ] Update VPS system packages
- [ ] Review SSL certificate status
- [ ] Check access logs for anomalies  
- [ ] Verify backup integrity
- [ ] Update application dependencies

### **Quarterly Security Tasks**
- [ ] Security vulnerability scan
- [ ] Review user access permissions
- [ ] Update authentication tokens
- [ ] Audit environment variables
- [ ] Test disaster recovery procedures

## 📞 **Support Contacts**

### **Technical Issues**
- **VPS Issues**: OVHcloud support
- **Database Issues**: Supabase documentation
- **Deployment Issues**: Check GitHub Actions / Vercel logs
- **Application Issues**: PM2 logs and error monitoring

### **Emergency Escalation**
1. **Level 1**: Application restart (`pm2 restart`)
2. **Level 2**: VPS reboot (OVHcloud control panel)
3. **Level 3**: Rollback deployment (`git reset`)
4. **Level 4**: Contact hosting support

---

## ✅ **Workflow Benefits**

- **🛡️ Safe**: Isolated environments prevent production issues
- **🚀 Fast**: Automated deployments reduce manual work  
- **💰 Cost-effective**: ~$5/month for professional setup
- **📈 Scalable**: Easy to upgrade components as needed
- **🔍 Traceable**: Full audit trail of changes
- **🧪 Testable**: Comprehensive testing at each stage

Your ACTREC Telephone Directory now has enterprise-grade development workflow! 🎉