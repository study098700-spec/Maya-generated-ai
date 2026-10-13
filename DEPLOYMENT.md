# Deployment Guide

This guide covers various deployment options for Maya AI Assistant.

## 🌐 Environment Variables

Before deploying, ensure you have the following environment variables configured:

| Variable                | Description                | Required |
| ----------------------- | -------------------------- | -------- |
| `GOOGLE_GEMINI_API_KEY` | Your Google Gemini API key | Yes      |

## 🚀 Deployment Platforms

### Vercel (Recommended)

Vercel provides zero-configuration deployment for SvelteKit applications.

1. **Connect Repository**:

   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Import the Maya project

2. **Configure Environment Variables**:

   - Go to Project Settings → Environment Variables
   - Add `GOOGLE_GEMINI_API_KEY` with your API key

3. **Deploy**:
   - Vercel automatically deploys on every push to main branch
   - Preview deployments created for pull requests

**Build Settings** (usually auto-detected):

- Build Command: `npm run build`
- Output Directory: `build`
- Node.js Version: 18.x or later

### Netlify

Netlify offers excellent static site hosting with SvelteKit adapter.

1. **Connect Repository**:

   - Visit [netlify.com](https://netlify.com)
   - Create new site from Git
   - Connect your GitHub repository

2. **Build Settings**:

   - Build Command: `npm run build`
   - Publish Directory: `build`
   - Node Version: 18 (in netlify.toml or environment)

3. **Environment Variables**:

   - Go to Site Settings → Environment Variables
   - Add `GOOGLE_GEMINI_API_KEY`

4. **Create netlify.toml** (optional):

   ```toml
   [build]
     command = "npm run build"
     publish = "build"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Railway

Railway provides full-stack deployment with database support.

1. **Connect Repository**:

   - Visit [railway.app](https://railway.app)
   - Create new project from GitHub repo

2. **Environment Variables**:

   - Add `GOOGLE_GEMINI_API_KEY` in Variables tab

3. **Deploy**:
   - Railway automatically detects SvelteKit
   - Deploys on every push to main branch

**Port Configuration**:
Railway automatically sets the PORT environment variable.

### Digital Ocean App Platform

1. **Create App**:

   - Visit Digital Ocean App Platform
   - Create app from GitHub repository

2. **Configure Build**:

   - Build Command: `npm run build`
   - Run Command: `node build`

3. **Environment Variables**:
   - Add `GOOGLE_GEMINI_API_KEY` in app settings

### Cloudflare Pages

1. **Connect Repository**:

   - Visit Cloudflare Pages
   - Connect GitHub repository

2. **Build Settings**:

   - Build Command: `npm run build`
   - Build Output Directory: `build`

3. **Environment Variables**:
   - Add variables in Pages settings

## 🏗️ Local Production Build

To test your production build locally:

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The preview server will start on `http://localhost:4173`

## 🔧 SvelteKit Adapters

Maya uses the default Node.js adapter. For other platforms, you might need different adapters:

### Static Adapter (for static hosting)

```bash
npm install @sveltejs/adapter-static
```

Update `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		})
	}
};
```

### Cloudflare Adapter

```bash
npm install @sveltejs/adapter-cloudflare
```

### Netlify Adapter

```bash
npm install @sveltejs/adapter-netlify
```

## 🔒 Security Considerations

### HTTPS Requirements

The Web Speech API requires HTTPS in production. Most deployment platforms provide HTTPS by default.

### Environment Variables

- Never commit API keys to version control
- Use platform-specific environment variable systems
- Rotate API keys regularly

### Content Security Policy

Consider adding CSP headers for enhanced security:

```html
<meta
	http-equiv="Content-Security-Policy"
	content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://generativelanguage.googleapis.com;"
/>
```

## 📊 Monitoring and Analytics

### Error Tracking

Consider integrating error tracking:

- Sentry for error monitoring
- LogRocket for session replay
- Custom error logging to your backend

### Performance Monitoring

- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Track speech API performance metrics

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**:

   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Speech API Not Working**:

   - Ensure HTTPS is enabled
   - Check browser compatibility
   - Verify microphone permissions

3. **Gemini API Errors**:
   - Verify API key is correct
   - Check API quotas and limits
   - Ensure network connectivity

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck

# Optimize images
npm install @sveltejs/adapter-auto
```

## 🚀 CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run check
      - run: npm run build
        env:
          GOOGLE_GEMINI_API_KEY: ${{ secrets.GOOGLE_GEMINI_API_KEY }}
```

## 📈 Scaling Considerations

- **Rate Limiting**: Implement API rate limiting
- **Caching**: Add response caching for common queries
- **Load Balancing**: Use multiple instances for high traffic
- **Database**: Consider adding conversation persistence

---

For platform-specific deployment issues, check the respective platform documentation or reach out in the project's Issues section.
