# Deployment Guide for Smart Train Finder

This guide covers multiple deployment options for the Smart Train Finder application.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Git repository set up

## Environment Variables

Before deploying, set up the following environment variables:

```bash
REACT_APP_NAVITIA_TOKEN=your_navitia_token_here
```

For demo purposes, you can use the sandbox token: `3b036afe-0110-4202-b9ed-99718476c2e0`

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment for React applications.

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/smart-train-finder)

#### Manual Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `npm run deploy:vercel`

#### Environment Variables in Vercel
1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add `REACT_APP_NAVITIA_TOKEN` with your token value

### 2. Netlify

#### Quick Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/smart-train-finder)

#### Manual Deployment
1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Or use Netlify CLI: `npm run deploy:netlify`

### 3. Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### 4. Docker Deployment

#### Build and Run Locally
```bash
npm run docker:build
npm run docker:run
```

#### Deploy to Cloud Platforms
The Docker image can be deployed to:
- Google Cloud Run
- AWS ECS
- Azure Container Instances
- DigitalOcean App Platform

### 5. GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Set homepage in package.json: `"homepage": "https://yourusername.github.io/smart-train-finder"`
4. Deploy: `npm run deploy`

## Build Optimization

### Production Build
```bash
npm run build
```

### Build Analysis
To analyze bundle size:
```bash
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

## Performance Optimization

### Caching Strategy
- Static assets: 1 year cache
- HTML files: 1 hour cache
- API responses: 5 minutes cache

### Compression
- Gzip enabled for all text assets
- Brotli compression for modern browsers

## Monitoring and Analytics

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### Performance Monitoring
- Lighthouse CI for performance audits
- Web Vitals monitoring
- Real User Monitoring (RUM)

## Security Considerations

### Headers
The nginx configuration includes security headers:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### API Keys
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (16+ required)
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

2. **Environment Variables Not Working**
   - Ensure variables start with `REACT_APP_`
   - Restart development server after adding variables
   - Check deployment platform's environment variable settings

3. **API Requests Failing**
   - Verify API token is correct
   - Check CORS settings
   - Ensure API endpoints are accessible from deployment domain

### Debug Mode
Enable debug mode by setting:
```bash
REACT_APP_DEBUG_MODE=true
```

## Continuous Deployment

The project includes GitHub Actions workflows for:
- Running tests on pull requests
- Automatic deployment to Vercel/Netlify on main branch updates
- Docker image building and publishing

## Custom Domain

### Vercel
1. Go to project settings
2. Add custom domain
3. Configure DNS records as instructed

### Netlify
1. Go to site settings
2. Add custom domain
3. Configure DNS or use Netlify DNS

## SSL/HTTPS

All recommended platforms provide automatic SSL certificates:
- Vercel: Automatic Let's Encrypt certificates
- Netlify: Automatic Let's Encrypt certificates
- Railway: Automatic SSL for custom domains

## Backup and Recovery

### Database Backup
Since this is a frontend-only application with no database, ensure:
- Code is backed up in version control
- Environment variables are documented
- Deployment configurations are version controlled

### Disaster Recovery
- Keep deployment scripts in version control
- Document all environment variables
- Maintain multiple deployment targets for redundancy

## Support

For deployment issues:
1. Check the deployment platform's documentation
2. Review build logs for specific errors
3. Ensure all environment variables are set correctly
4. Verify API endpoints are accessible
