# Vercel Deployment Guide for ACTREC Telephone Directory

## 🚀 Deployment Overview

This guide provides step-by-step instructions for deploying the ACTREC Telephone Directory application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: The project should be connected to GitHub (already done)
3. **Supabase Project**: Ensure Supabase is properly configured
4. **Environment Variables**: Have all required environment variables ready

## 🔧 Environment Variables Required

### Production Environment Variables
Add these in your Vercel project settings under Environment Variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# Optional: Additional configuration
NODE_ENV=production
```

### Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Settings → API
4. Copy the Project URL and keys:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### Generating NEXTAUTH_SECRET

```bash
# Generate a secure secret
openssl rand -base64 32
```

## 🚀 Deployment Steps

### Method 1: Automatic Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy from GitHub**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `vsmv/telephone-directory`
   - Vercel will automatically detect it as a Next.js app

3. **Configure Environment Variables**
   - In the Vercel project dashboard, go to Settings → Environment Variables
   - Add all the required variables from the section above
   - Make sure to select the appropriate environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy" to start the deployment process
   - Vercel will build and deploy your application

### Method 2: Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Project**
   ```bash
   cd /d "c:\D\Jeyarish Projects\Telephone Directory\telephone-directory-old"
   vercel --prod
   ```

4. **Follow the prompts** to configure your project

## 🔍 Post-Deployment Checklist

### 1. Verify Environment Variables
- Check that all environment variables are properly set in Vercel dashboard
- Ensure Supabase URLs and keys are correct

### 2. Test Authentication
- Visit your deployed application
- Test login functionality with existing users
- Verify that authentication redirects work correctly

### 3. Test Database Connectivity
- Test contact management features
- Verify bulk operations work
- Check that all CRUD operations function properly

### 4. Check Responsive Design
- Test on mobile devices
- Verify tablet and desktop layouts
- Ensure all UI components render correctly

### 5. Performance Optimization
- Check Vercel Analytics for performance metrics
- Verify that images and assets are optimized
- Test loading times

## 🛠️ Troubleshooting

### Common Issues

#### 1. Authentication Issues
**Problem**: Users can't log in after deployment
**Solution**:
- Verify `NEXTAUTH_URL` matches your Vercel domain
- Check that Supabase environment variables are correct
- Ensure CORS is properly configured in Supabase

#### 2. Database Connection Issues
**Problem**: Can't connect to Supabase
**Solution**:
- Verify Supabase URL and keys
- Check that RLS policies are properly configured
- Ensure service role key has correct permissions

#### 3. Build Errors
**Problem**: Deployment fails during build
**Solution**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify TypeScript configuration

#### 4. Environment Variable Issues
**Problem**: App crashes due to missing environment variables
**Solution**:
- Double-check all required variables are set
- Ensure variable names match exactly
- Verify no trailing spaces in variable values

### Debugging Steps

1. **Check Vercel Logs**
   - Go to your project dashboard
   - Click on the "Logs" tab
   - Filter by function or time period

2. **Test API Endpoints**
   ```bash
   # Test health endpoint
   curl https://your-app.vercel.app/api/health
   
   # Test auth endpoint
   curl -X POST https://your-app.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

3. **Verify Environment Variables**
   - Add a debug endpoint to check variables
   - Use Vercel's environment variable debugging

## 📊 Monitoring and Analytics

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor page views and performance
- Track user interactions

### Error Tracking
- Consider integrating with Sentry or similar service
- Monitor error rates and types
- Set up alerts for critical errors

### Performance Monitoring
- Use Vercel Speed Insights
- Monitor Core Web Vitals
- Track loading times across different regions

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit secrets to Git
- Use Vercel's encrypted environment variables
- Rotate secrets regularly

### 2. Supabase Security
- Enable Row Level Security (RLS)
- Use service role key only on server-side
- Regularly review API permissions

### 3. HTTPS
- Vercel automatically provides HTTPS
- Ensure all resources use HTTPS
- Update any hardcoded HTTP URLs

## 🔄 Continuous Deployment

### Automatic Deployments
- Vercel automatically deploys on every push to main
- Preview deployments for pull requests
- Custom deployment rules can be configured

### Deployment Hooks
- Set up webhooks for deployment notifications
- Integrate with Slack or Discord for team notifications
- Configure custom deployment workflows

## 📈 Scaling Considerations

### Database Scaling
- Monitor Supabase usage and performance
- Consider upgrading Supabase plan for higher traffic
- Implement caching strategies

### Edge Functions
- Consider using Vercel Edge Functions for global performance
- Move API routes closer to users
- Implement geographic distribution

## 🎯 Next Steps

1. **Deploy to Vercel** using the steps above
2. **Test thoroughly** in the production environment
3. **Set up monitoring** and alerting
4. **Configure custom domain** if needed
5. **Set up backup and recovery** procedures

## 📞 Support

If you encounter issues during deployment:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Consult [Supabase Deployment Guide](https://supabase.com/docs/guides/deployment)
4. Check the project's GitHub Issues for known problems

---

**Note**: This deployment guide assumes you have administrative access to both Vercel and Supabase. Ensure you have the necessary permissions before proceeding with deployment.
