# AWS Amplify Deployment & Maintenance Guide
## DevDocs Documentation Platform

---

## 1. Prerequisites

### 1.1 Required Accounts & Tools

#### Accounts
- [ ] **GitHub Account**: For source code repository
- [ ] **AWS Account**: For Amplify hosting
- [ ] **Domain Name**: Optional custom domain

#### Local Development Tools
```bash
# Required versions
Node.js: >= 18.0.0
npm: >= 9.0.0
Git: >= 2.30.0

# Verify installations
node --version
npm --version
git --version
```

#### AWS CLI Installation
```bash
# Windows (using chocolatey)
choco install awscli

# macOS
brew install awscli

# Verify installation
aws --version
```

### 1.2 AWS Configuration

```bash
# Configure AWS CLI
aws configure

# Enter your credentials
AWS Access Key ID: [YOUR_ACCESS_KEY]
AWS Secret Access Key: [YOUR_SECRET_KEY]
Default region name: ap-northeast-2  # Seoul region
Default output format: json
```

---

## 2. Project Setup

### 2.1 Initialize Nextra Project

```bash
# Create project directory
mkdir devdocs
cd devdocs

# Initialize with Nextra template
npx create-next-app@latest . --example https://github.com/shuding/nextra/tree/main/examples/docs

# Or manual setup
npm init -y
npm install next react react-dom nextra nextra-theme-docs
npm install -D @types/node typescript
```

### 2.2 Project Configuration

#### package.json
```json
{
  "name": "devdocs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export"
  },
  "dependencies": {
    "next": "^14.0.0",
    "nextra": "^3.0.0",
    "nextra-theme-docs": "^3.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

### 2.3 Git Repository Setup

```bash
# Initialize Git repository
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/

# Production
dist/

# Misc
.DS_Store
*.pem
.vscode/
.idea/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

# Initial commit
git add .
git commit -m "Initial commit: Nextra documentation setup"

# Add GitHub remote
git remote add origin https://github.com/yourusername/devdocs.git
git branch -M main
git push -u origin main
```

---

## 3. AWS Amplify Setup

### 3.1 Create Amplify App via Console

1. **Navigate to AWS Amplify Console**
   ```
   https://console.aws.amazon.com/amplify/
   ```

2. **Create New App**
   - Click "New app" → "Host web app"
   - Select "GitHub" as source provider
   - Authorize AWS Amplify to access your GitHub

3. **Connect Repository**
   - Select repository: `devdocs`
   - Select branch: `main`
   - Check "Connecting a monorepo? Pick a folder" if needed

4. **Configure Build Settings**
   - Amplify will auto-detect Next.js
   - Review and modify build settings if needed

### 3.2 Amplify Configuration via CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in project
amplify init

# Answer prompts
? Enter a name for the project: devdocs
? Enter a name for the environment: prod
? Choose your default editor: Visual Studio Code
? Choose the type of app: javascript
? What javascript framework: react
? Source Directory Path: .
? Distribution Directory Path: .next
? Build Command: npm run build
? Start Command: npm run start
```

### 3.3 Build Configuration (amplify.yml)

```yaml
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
            - echo "NODE_OPTIONS=--max-old-space-size=4096" >> $HOME/.bashrc
            - source $HOME/.bashrc
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
      
    # Custom headers for security and performance
    customHeaders:
      - pattern: '**/*'
        headers:
          - key: 'Strict-Transport-Security'
            value: 'max-age=31536000; includeSubDomains'
          - key: 'X-Frame-Options'
            value: 'SAMEORIGIN'
          - key: 'X-Content-Type-Options'
            value: 'nosniff'
          - key: 'X-XSS-Protection'
            value: '1; mode=block'
          - key: 'Referrer-Policy'
            value: 'strict-origin-when-cross-origin'
      
      - pattern: '**/*.@(jpg|jpeg|gif|png|svg|ico|webp)'
        headers:
          - key: 'Cache-Control'
            value: 'public, max-age=31536000, immutable'
      
      - pattern: '**/*.@(js|css|mjs)'
        headers:
          - key: 'Cache-Control'
            value: 'public, max-age=31536000, immutable'
      
      - pattern: '**/*.@(json|xml|txt)'
        headers:
          - key: 'Cache-Control'
            value: 'public, max-age=3600, must-revalidate'
```

---

## 4. Environment Variables

### 4.1 Local Development (.env.local)

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# API Keys (if needed)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_COMMENTS=false
```

### 4.2 Amplify Environment Variables

```bash
# Set via Amplify Console or CLI
aws amplify update-app --app-id YOUR_APP_ID \
  --environment-variables \
    NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX \
    NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 5. Custom Domain Setup

### 5.1 Domain Configuration in Amplify

1. **Navigate to Domain Management**
   - Amplify Console → App settings → Domain management
   - Click "Add domain"

2. **Add Your Domain**
   ```
   Domain: devdocs.yourdomain.com
   ```

3. **Configure Subdomains**
   ```
   www → redirect to apex domain
   docs → main branch
   dev → development branch (optional)
   ```

### 5.2 DNS Configuration

#### For Route 53
```bash
# Amplify automatically configures if using Route 53
# Just verify the records are created
```

#### For External DNS Providers
```
Type: CNAME
Name: docs
Value: [amplify-provided-domain].amplifyapp.com

Type: CNAME
Name: www
Value: [amplify-provided-domain].amplifyapp.com
```

### 5.3 SSL Certificate

- Amplify automatically provisions SSL certificates
- Wait for certificate validation (can take up to 48 hours)
- Verify HTTPS is working: `https://docs.yourdomain.com`

---

## 6. Continuous Deployment

### 6.1 Branch Deployments

```yaml
# Multiple environment setup
main branch → Production (docs.yourdomain.com)
develop branch → Staging (dev.yourdomain.com)
feature/* branches → Preview URLs
```

### 6.2 GitHub Actions Integration

```yaml
# .github/workflows/amplify-deploy.yml
name: Deploy to Amplify

on:
  push:
    branches: [main, develop]
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Amplify
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ap-northeast-2
        run: |
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            BRANCH_NAME="main"
          else
            BRANCH_NAME="${{ github.head_ref }}"
          fi
          
          aws amplify start-job \
            --app-id ${{ secrets.AMPLIFY_APP_ID }} \
            --branch-name $BRANCH_NAME \
            --job-type RELEASE
```

### 6.3 Preview Deployments

```javascript
// amplify.yml for PR previews
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
            # Add PR preview banner
            - |
              if [ "${AWS_BRANCH}" != "main" ]; then
                echo "NEXT_PUBLIC_PREVIEW_MODE=true" >> .env.local
              fi
        build:
          commands:
            - npm run build
```

---

## 7. Monitoring & Maintenance

### 7.1 CloudWatch Monitoring

```bash
# View Amplify logs
aws logs tail /aws/amplify/YOUR_APP_ID --follow

# Get build logs
aws amplify get-job --app-id YOUR_APP_ID --branch-name main --job-id JOB_ID
```

### 7.2 Performance Monitoring

#### Setup Web Vitals Tracking
```javascript
// pages/_app.tsx
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // Send to analytics
    console.log(metric)
    
    // Send to CloudWatch
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    })
  }
}
```

### 7.3 Automated Health Checks

```yaml
# CloudWatch Synthetics Canary
name: devdocs-health-check
schedule: rate(5 minutes)
script: |
  const synthetics = require('Synthetics');
  const log = require('SyntheticsLogger');
  
  const checkWebsite = async function () {
    const page = await synthetics.getPage();
    
    await synthetics.executeStep('Load homepage', async () => {
      await page.goto('https://docs.yourdomain.com');
    });
    
    await synthetics.executeStep('Check search', async () => {
      await page.type('input[type="search"]', 'test');
      await page.waitForSelector('.search-results');
    });
  };
  
  exports.handler = async () => {
    return await synthetics.executeStep('Check website', checkWebsite);
  };
```

---

## 8. Backup & Disaster Recovery

### 8.1 Content Backup Strategy

```bash
# Automated daily backups to S3
aws s3 sync ./content s3://your-backup-bucket/devdocs/$(date +%Y%m%d)/ \
  --exclude "node_modules/*" \
  --exclude ".next/*"

# Setup lifecycle policy for S3
aws s3api put-bucket-lifecycle-configuration \
  --bucket your-backup-bucket \
  --lifecycle-configuration file://lifecycle.json
```

### 8.2 Database Backup (if applicable)

```javascript
// Backup user data, comments, analytics
const backupData = async () => {
  const data = await fetchAllData()
  
  await s3.putObject({
    Bucket: 'backup-bucket',
    Key: `backups/${Date.now()}-data.json`,
    Body: JSON.stringify(data)
  }).promise()
}

// Schedule daily backup
scheduleJob('0 2 * * *', backupData)
```

---

## 9. Troubleshooting

### 9.1 Common Issues

#### Build Failures
```bash
# Check build logs
aws amplify get-job --app-id APP_ID --branch-name main --job-id JOB_ID

# Common fixes
- Clear cache: Amplify Console → App settings → Build settings → Clear cache
- Increase memory: NODE_OPTIONS=--max-old-space-size=4096
- Check dependencies: npm audit fix
```

#### 404 Errors
```javascript
// next.config.js - Fix for client-side routing
module.exports = {
  trailingSlash: true,
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      // Add all your static pages
    }
  }
}
```

#### Performance Issues
```bash
# Enable caching
# amplify.yml
cache:
  paths:
    - node_modules/**/*
    - .next/cache/**/*

# Optimize images
npm install next-optimized-images
```

### 9.2 Rollback Procedures

```bash
# Rollback to previous deployment
aws amplify start-job \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --commit-id PREVIOUS_COMMIT_ID

# Or use Amplify Console
# Navigate to "Activity" tab → Select previous build → "Redeploy this version"
```

---

## 10. Maintenance Schedule

### 10.1 Regular Maintenance Tasks

#### Daily
- [ ] Monitor error logs
- [ ] Check uptime metrics
- [ ] Review security alerts

#### Weekly
- [ ] Update dependencies (security patches)
- [ ] Review and merge PRs
- [ ] Backup content

#### Monthly
- [ ] Performance audit
- [ ] Security scan
- [ ] Update documentation
- [ ] Review analytics

#### Quarterly
- [ ] Major dependency updates
- [ ] Infrastructure review
- [ ] Cost optimization
- [ ] Disaster recovery test

### 10.2 Update Procedures

```bash
# Update dependencies
npm update
npm audit fix

# Update Nextra
npm install nextra@latest nextra-theme-docs@latest

# Test locally
npm run dev

# Run tests
npm test

# Deploy
git add .
git commit -m "chore: Update dependencies"
git push origin main
```

---

## 11. Cost Optimization

### 11.1 AWS Amplify Pricing

```yaml
Build & Deploy:
  - Build minutes: $0.01 per minute
  - Storage: $0.023 per GB per month

Hosting:
  - Data transfer: $0.15 per GB
  - Request: $0.0000002 per request
```

### 11.2 Cost Reduction Strategies

1. **Optimize Build Time**
   ```yaml
   # Cache dependencies
   cache:
     paths:
       - node_modules/**/*
   ```

2. **Enable Compression**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true
   }
   ```

3. **Optimize Images**
   ```javascript
   // Use Next.js Image Optimization
   import Image from 'next/image'
   ```

4. **Set Appropriate Cache Headers**
   ```yaml
   customHeaders:
     - pattern: '**/*.@(js|css)'
       headers:
         - key: 'Cache-Control'
           value: 'public, max-age=31536000'
   ```

---

## 12. Security Best Practices

### 12.1 Security Headers

```yaml
# amplify.yml
customHeaders:
  - pattern: '**/*'
    headers:
      - key: 'Content-Security-Policy'
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';"
      - key: 'Permissions-Policy'
        value: 'camera=(), microphone=(), geolocation=()'
```

### 12.2 Access Control

```bash
# IAM Policy for Amplify
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "amplify:CreateApp",
        "amplify:UpdateApp",
        "amplify:DeleteApp",
        "amplify:CreateBranch",
        "amplify:UpdateBranch",
        "amplify:DeleteBranch",
        "amplify:StartJob"
      ],
      "Resource": "arn:aws:amplify:*:*:apps/*/branches/*"
    }
  ]
}
```

### 12.3 Secrets Management

```bash
# Use AWS Secrets Manager
aws secretsmanager create-secret \
  --name devdocs/api-keys \
  --secret-string '{"key1":"value1","key2":"value2"}'

# Reference in Amplify
aws amplify update-app \
  --app-id YOUR_APP_ID \
  --environment-variables \
    API_KEY='{{resolve:secretsmanager:devdocs/api-keys:SecretString:key1}}'
```

---

*Document Version: 1.0*  
*Last Updated: 2025-08-07*  
*Related Documents: TECH_SPEC.md, PRD.md*