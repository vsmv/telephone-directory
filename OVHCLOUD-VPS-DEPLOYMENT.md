# OVHcloud VPS-1 Deployment Guide
## ACTREC Telephone Directory Application

This guide provides step-by-step instructions for deploying your ACTREC Telephone Directory application on OVHcloud VPS-1 ($4.20/month plan).

## Prerequisites

- OVHcloud account
- Domain name (optional but recommended)
- Supabase project set up
- Local development environment working

## Phase 1: OVHcloud VPS Setup

### Step 1: Purchase OVHcloud VPS-1
1. Visit [OVHcloud VPS page](https://www.ovhcloud.com/en/vps/)
2. Select **VPS-1** plan ($4.20/month)
   - 4 vCores
   - 8 GB RAM
   - 75 GB NVMe SSD
   - Unlimited bandwidth
3. Choose your preferred data center location
4. Select Ubuntu 22.04 LTS as the operating system
5. Complete the purchase and wait for VPS provisioning

### Step 2: Initial VPS Configuration
1. **Access your VPS:**
   ```bash
   ssh root@your-vps-ip-address
   ```

2. **Update the system:**
   ```bash
   apt update && apt upgrade -y
   ```

3. **Install essential packages:**
   ```bash
   apt install -y curl wget git ufw fail2ban htop nano
   ```

### Step 3: Security Configuration
1. **Configure firewall:**
   ```bash
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow ssh
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 3000/tcp
   ufw --force enable
   ```

2. **Configure fail2ban:**
   ```bash
   systemctl enable fail2ban
   systemctl start fail2ban
   ```

3. **Create a non-root user:**
   ```bash
   adduser deployer
   usermod -aG sudo deployer
   ```

4. **Set up SSH key authentication (recommended):**
   ```bash
   mkdir -p /home/deployer/.ssh
   cp ~/.ssh/authorized_keys /home/deployer/.ssh/
   chown -R deployer:deployer /home/deployer/.ssh
   chmod 700 /home/deployer/.ssh
   chmod 600 /home/deployer/.ssh/authorized_keys
   ```

## Phase 2: Node.js Environment Setup

### Step 4: Install Node.js
1. **Install Node.js 18.x:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   ```

2. **Verify installation:**
   ```bash
   node --version  # Should show v18.x.x
   npm --version   # Should show latest npm version
   ```

3. **Install PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   ```

### Step 5: Install Additional Tools
1. **Install Git (if not already installed):**
   ```bash
   apt install -y git
   ```

2. **Install Nginx (reverse proxy):**
   ```bash
   apt install -y nginx
   systemctl enable nginx
   systemctl start nginx
   ```

## Phase 3: Application Deployment

### Step 6: Clone and Setup Application
1. **Switch to deployer user:**
   ```bash
   su - deployer
   ```

2. **Clone your repository:**
   ```bash
   git clone https://github.com/your-username/telephone-directory.git
   cd telephone-directory
   ```

3. **Install dependencies:**
   ```bash
   npm ci --production=false
   ```

### Step 7: Environment Configuration
1. **Create production environment file:**
   ```bash
   cp .env.production .env.local
   nano .env.local
   ```

2. **Fill in your environment variables:**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Application Configuration
   NODE_ENV=production
   PORT=3000
   HOSTNAME=0.0.0.0

   # Domain Configuration
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your_random_secret_32_chars_min
   ```

### Step 8: Build Application
1. **Build the Next.js application:**
   ```bash
   npm run build
   ```

2. **Test the build locally:**
   ```bash
   npm start
   ```
   - Visit `http://your-vps-ip:3000` to verify it works

## Phase 4: Production Configuration

### Step 9: Configure PM2
1. **Create PM2 ecosystem file:**
   ```bash
   nano ecosystem.config.js
   ```

2. **Add PM2 configuration:**
   ```javascript
   module.exports = {
     apps: [{
       name: 'telephone-directory',
       script: 'npm',
       args: 'start',
       cwd: '/home/deployer/telephone-directory',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log',
       time: true
     }]
   };
   ```

3. **Create logs directory:**
   ```bash
   mkdir logs
   ```

4. **Start application with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Step 10: Configure Nginx Reverse Proxy
1. **Create Nginx configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/telephone-directory
   ```

2. **Add Nginx configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/telephone-directory /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Phase 5: SSL/HTTPS Setup

### Step 11: Install SSL Certificate
1. **Install Certbot:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Verify auto-renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

## Phase 6: Final Configuration and Monitoring

### Step 12: Set up Monitoring
1. **Configure PM2 monitoring:**
   ```bash
   pm2 monitor
   ```

2. **Check application status:**
   ```bash
   pm2 status
   pm2 logs telephone-directory
   ```

### Step 13: Database Verification
1. **Test Supabase connection:**
   ```bash
   curl -X GET 'https://your-project.supabase.co/rest/v1/contacts' \
   -H "apikey: your-anon-key" \
   -H "Authorization: Bearer your-anon-key"
   ```

### Step 14: Performance Optimization
1. **Configure Nginx caching:**
   ```bash
   sudo nano /etc/nginx/sites-available/telephone-directory
   ```

2. **Add caching directives:**
   ```nginx
   # Add inside server block
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
       proxy_pass http://localhost:3000;
   }

   # Enable gzip compression
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
   ```

## Phase 7: Deployment Automation

### Step 15: Create Deployment Script
1. **Create deployment script:**
   ```bash
   nano deploy.sh
   ```

2. **Add deployment automation:**
   ```bash
   #!/bin/bash
   
   echo "Starting deployment..."
   
   # Pull latest code
   git pull origin main
   
   # Install dependencies
   npm ci --production=false
   
   # Build application
   npm run build
   
   # Restart PM2 application
   pm2 restart telephone-directory
   
   # Check status
   pm2 status
   
   echo "Deployment completed!"
   ```

3. **Make script executable:**
   ```bash
   chmod +x deploy.sh
   ```

## Maintenance and Monitoring

### Daily Maintenance Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs telephone-directory

# Monitor system resources
htop

# Check disk usage
df -h

# Check memory usage
free -m

# Restart application if needed
pm2 restart telephone-directory
```

### Backup Strategy
1. **Database backup** (Supabase handles this automatically)
2. **Application backup:**
   ```bash
   tar -czf backup-$(date +%Y%m%d).tar.gz /home/deployer/telephone-directory
   ```

### Update Process
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
npm update

# Rebuild and restart
npm run build
pm2 restart telephone-directory
```

## Troubleshooting

### Common Issues and Solutions

1. **Application won't start:**
   ```bash
   pm2 logs telephone-directory
   # Check environment variables
   cat .env.local
   ```

2. **502 Bad Gateway:**
   ```bash
   # Check if application is running
   pm2 status
   # Check Nginx configuration
   sudo nginx -t
   ```

3. **Database connection issues:**
   ```bash
   # Test Supabase connection
   curl -X GET 'https://your-project.supabase.co/rest/v1/' \
   -H "apikey: your-anon-key"
   ```

4. **SSL certificate issues:**
   ```bash
   sudo certbot certificates
   sudo certbot renew
   ```

## Cost Optimization

Your OVHcloud VPS-1 at $4.20/month provides:
- **Traffic**: Unlimited (huge advantage)
- **Performance**: Sufficient for small to medium applications
- **Backups**: Daily automatic backups included
- **Security**: Anti-DDoS protection included

## Performance Expectations

With VPS-1 specifications:
- **Concurrent Users**: 50-100 users
- **Response Time**: < 200ms for most operations
- **Database Queries**: < 100ms with Supabase
- **File Uploads**: Support for CSV files up to 10MB

## Next Steps

1. Monitor application performance for the first week
2. Set up automated backups for your application files
3. Consider setting up staging environment for testing updates
4. Implement monitoring alerts for downtime
5. Plan for scaling if traffic increases

Your ACTREC Telephone Directory is now successfully deployed on OVHcloud VPS-1!

---

**Support Resources:**
- OVHcloud Documentation: https://help.ovhcloud.com/
- Next.js Deployment Guide: https://nextjs.org/docs/deployment
- PM2 Documentation: https://pm2.keymetrics.io/docs/
- Nginx Documentation: https://nginx.org/en/docs/