# OVHcloud VPS-1 Quick Start Guide
## Deploy ACTREC Telephone Directory in Under 30 Minutes

This quick start guide will get your application running on OVHcloud VPS-1 in approximately 20-30 minutes.

## Prerequisites Checklist
- [ ] OVHcloud account created
- [ ] Domain name ready (optional)
- [ ] Supabase project configured
- [ ] Local application working

## Phase 1: VPS Setup (10 minutes)

### Step 1: Order VPS-1
1. Go to [OVHcloud VPS](https://www.ovhcloud.com/en/vps/)
2. Select **VPS-1** ($4.20/month)
3. Choose **Ubuntu 22.04 LTS**
4. Complete purchase

### Step 2: Initial Access
```bash
# SSH into your VPS (received via email)
ssh root@YOUR_VPS_IP

# Update system
apt update && apt upgrade -y

# Install essentials
apt install -y curl wget git ufw nginx
```

### Step 3: Quick Security
```bash
# Basic firewall
ufw allow ssh && ufw allow 80 && ufw allow 443 && ufw allow 3000
ufw --force enable

# Create deployer user
adduser deployer
usermod -aG sudo deployer
```

## Phase 2: Node.js Setup (5 minutes)

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Switch to deployer user
su - deployer
```

## Phase 3: Deploy Application (10 minutes)

### Step 1: Clone Repository
```bash
# Clone your repo (replace with your actual repo)
git clone https://github.com/YOUR_USERNAME/telephone-directory.git
cd telephone-directory
```

### Step 2: Environment Setup
```bash
# Copy environment template
cp .env.production .env.local

# Edit with your Supabase credentials
nano .env.local
```

**Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
```

### Step 3: Build and Deploy
```bash
# Install dependencies
npm ci

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Phase 4: Configure Nginx (5 minutes)

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/telephone-directory
```

**Minimal Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/telephone-directory /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Phase 5: SSL Setup (Optional - 3 minutes)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com
```

## Verification

Your application should now be accessible at:
- **HTTP:** `http://YOUR_VPS_IP` or `http://your-domain.com`
- **HTTPS:** `https://your-domain.com` (if SSL configured)

### Quick Health Check
```bash
# Check PM2 status
pm2 status

# Check application response
curl -I http://localhost:3000

# View logs
pm2 logs telephone-directory
```

## Cost Summary

**Monthly Costs:**
- OVHcloud VPS-1: $4.20/month
- Domain (optional): ~$12/year
- **Total: ~$5.20/month**

## One-Command Deployment

After initial setup, use the deployment script for updates:

```bash
# Make script executable
chmod +x deploy.sh

# Deploy updates
./deploy.sh
```

## Troubleshooting

**Application not starting?**
```bash
pm2 logs telephone-directory
```

**502 Bad Gateway?**
```bash
pm2 status
sudo nginx -t
```

**Environment issues?**
```bash
cat .env.local
```

## Next Steps

1. **Monitor performance:** `pm2 monit`
2. **Set up backups:** Daily automated backups included with OVHcloud
3. **Domain setup:** Point your domain to the VPS IP
4. **SSL certificate:** Use Certbot for free SSL

## Support

- **Application Issues:** Check PM2 logs
- **VPS Issues:** OVHcloud support
- **Domain Issues:** Your domain registrar

Your ACTREC Telephone Directory is now live! 🎉

**Quick Access Commands:**
```bash
pm2 status              # Check app status
pm2 restart telephone-directory  # Restart app
pm2 logs telephone-directory     # View logs
./deploy.sh             # Deploy updates
```