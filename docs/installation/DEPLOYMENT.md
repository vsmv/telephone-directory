# ACTREC Directory - Cloud Deployment Guide

## Prerequisites
1. Supabase account (supabase.com)
2. Cloud hosting account (Vercel recommended)
3. Git repository (GitHub/GitLab)

## Step 1: Setup Supabase Database

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create new project
3. Choose region closest to your users
4. Set strong database password

### 1.2 Setup Database Schema
1. Go to SQL Editor in Supabase
2. Run the SQL from `supabase/schema.sql`
3. Enable Row Level Security (RLS)
4. Create authentication policies

### 1.3 Get Environment Variables
1. Go to Project Settings > API
2. Copy Project URL and Anon Key
3. Save these for deployment

## Step 2: Deploy to Vercel (Recommended)

### 2.1 Prepare Repository
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Deploy on Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Deploy

### 2.3 Custom Domain (Optional)
1. Add your domain in Vercel dashboard
2. Update DNS settings
3. SSL automatically configured

## Step 3: Post-Deployment

### 3.1 Test Application
- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Dashboard authentication works
- [ ] Database operations function

### 3.2 Setup Monitoring
- [ ] Enable Vercel Analytics
- [ ] Setup Supabase monitoring
- [ ] Configure error tracking

### 3.3 Security Checklist
- [ ] Environment variables secured
- [ ] Database RLS enabled
- [ ] HTTPS enforced
- [ ] Authentication working

## Alternative Hosting Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### DigitalOcean
1. Create new app
2. Connect GitHub repository
3. Configure build settings
4. Add environment variables

## Cost Estimates (Monthly)

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| **Vercel** | 100GB bandwidth | $20+ |
| **Netlify** | 100GB bandwidth | $19+ |
| **Railway** | $5 credit | $10+ |
| **DigitalOcean** | N/A | $12+ |
| **Supabase** | 500MB database | $25+ |

## Recommended Setup for Production

1. **Hosting**: Vercel (free tier sufficient for start)
2. **Database**: Supabase (free tier: 500MB)
3. **Domain**: Custom domain via Vercel
4. **Monitoring**: Vercel Analytics + Supabase dashboard

## Support and Maintenance

### Regular Tasks
- Monitor database usage
- Review application logs
- Update dependencies monthly
- Backup database regularly

### Scaling Considerations
- Upgrade hosting plan when needed
- Optimize database queries
- Enable CDN for better performance
- Consider multiple regions for global users