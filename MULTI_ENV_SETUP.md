# Multi-Environment Configuration Setup

## 🎯 Overview

This project now supports **separate configurations for Local Development and Production** environments, allowing different settings, APIs, and build optimizations for each environment.

### What's New

✅ **package.local.json** - Local development configuration  
✅ **package.production.json** - Production configuration  
✅ **Environment variables** - .env.local and .env.production  
✅ **Environment utility** - src/config/environment.js  
✅ **Setup script** - scripts/setup-env.js

---

## 🚀 Quick Start

### Local Development (Recommended Default)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Your app runs on http://localhost:3000 with hot-reload
```

### Production Build

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build:prod

# Test production build locally
npm start

# Or deploy the build/ folder to your server
```

---

## 📦 Package.json Files

### 1. **package.json** (Main - Default)

The default configuration that automatically uses the appropriate settings based on `cross-env` and `.env` files.

**Scripts:**

- `npm run dev` - Start local development server
- `npm run build` - Build for production
- `npm run build:prod` - Explicitly build for production
- `npm run build:local` - Build for local testing
- `npm run setup:local` - Switch to local-specific package.json
- `npm run setup:prod` - Switch to production-specific package.json

### 2. **package.local.json**

Optimized for local development and testing.

**Key Features:**

- Homepage: `http://localhost:3000`
- React Scripts for development
- No production dependencies like `serve`
- Optimized for fast builds and debugging

**Usage:**

```bash
npm run setup:local  # Copy to package.json
npm install          # Install local dependencies
npm run dev          # Start development
```

### 3. **package.production.json**

Optimized for production deployment.

**Key Features:**

- Homepage: `https://cocoma-website-594958810769.asia-south1.run.app`
- Includes `serve` for production serving
- Production optimizations enabled
- Minimal logging and debugging

**Usage:**

```bash
npm run setup:prod   # Copy to package.json
npm install          # Install production dependencies
npm run build:prod   # Build for production
npm start            # Start production server
```

---

## 🌍 Environment Variables

### .env.local (Local Development)

```env
REACT_APP_ENV=local
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
NODE_ENV=development
PORT=3000
```

### .env.production (Production)

```env
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.cocomadigital.com
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
NODE_ENV=production
PORT=8080
```

### Custom Variables

You can add more variables by:

1. Creating them in `.env.local` or `.env.production`
2. Prefixing with `REACT_APP_` (only prefixed variables are exposed)
3. Importing in your code:
   ```javascript
   const apiUrl = process.env.REACT_APP_API_URL;
   ```

---

## 🔧 Configuration Utility

### Location

`src/config/environment.js`

### Usage

**Import the utility:**

```javascript
import ENV, { isLocal, isProduction, logger } from "./config/environment";
```

**Check Environment:**

```javascript
if (isProduction()) {
  // Production-specific code
  enableAnalytics();
}

if (isLocal()) {
  // Development-specific code
  enableDebugTools();
}
```

**Use Logger:**

```javascript
logger.debug("Debug message"); // Only in local
logger.info("Info message"); // Based on LOG_LEVEL
logger.warn("Warning message"); // Based on LOG_LEVEL
logger.error("Error message"); // Always shown
```

**Access Configuration:**

```javascript
const apiUrl = ENV.api.baseURL;
const debugMode = ENV.debug;
const logLevel = ENV.logLevel;

// Feature flags
if (ENV.features.enableAnalytics) {
  // Setup analytics
}

if (ENV.features.enablePerformanceMonitoring) {
  // Setup performance monitoring
}
```

---

## 🔄 Environment Switching

### Using Setup Script

```bash
# Check current environment
node scripts/setup-env.js check

# Switch to local
node scripts/setup-env.js local

# Switch to production
node scripts/setup-env.js prod
```

### Or Manually

```bash
# Local development
cp package.local.json package.json
npm install

# Production
cp package.production.json package.json
npm install
```

---

## 📋 Common Tasks

### Start Local Development

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm install
npm run build:prod
```

### Test Production Build Locally

```bash
npm run build:prod
npm start
# Visit http://localhost:8080
```

### Switch Environments

```bash
# Check current
node scripts/setup-env.js check

# Switch to local
node scripts/setup-env.js local
npm install
npm run dev

# Switch to production
node scripts/setup-env.js prod
npm install
npm run build:prod
```

### View Bundled Size

```bash
npm run build:prod
# Check build/ directory for size
```

---

## 📊 Feature Flags by Environment

### Local Development ✅

- React hot-reload
- Redux DevTools
- Source maps
- Console debugging
- Detailed error messages
- Development API URL

### Production ✅

- Optimized bundling (74% reduction achieved)
- Analytics enabled
- Crash reporting enabled
- Performance monitoring
- Minimal logging
- Production API URL
- Serve with compression

---

## 🔐 Security Notes

- Never commit `.env` files with sensitive data
- `.env.local` and `.env.production` can be added to `.gitignore`
- Production API URLs should use HTTPS
- Debug mode disabled in production
- Sensitive data should be environment-specific

---

## 🐛 Troubleshooting

### Environment variables not loading

**Problem:** Variables show as undefined  
**Solution:**

1. Ensure variable starts with `REACT_APP_`
2. Restart dev server
3. Rebuild: `npm run build:prod`

### Wrong environment being used

**Problem:** Production code in local or vice versa  
**Solution:**

```bash
# Check current environment
node scripts/setup-env.js check

# Verify REACT_APP_ENV in console
node -e "console.log(process.env.REACT_APP_ENV)"
```

### cross-env not found

**Problem:** `cross-env: command not found`  
**Solution:**

```bash
npm install cross-env --save-dev
npm install
```

### Build fails with environment issues

**Problem:** Build fails or uses wrong config  
**Solution:**

```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run build:prod
```

---

## 📚 File Structure

```
project-root/
├── package.json                    # Main (uses cross-env)
├── package.local.json             # Local development config
├── package.production.json         # Production config
├── .env.local                      # Local env variables
├── .env.production                 # Production env variables
├── scripts/
│   └── setup-env.js               # Environment setup script
├── src/
│   ├── config/
│   │   └── environment.js          # Environment utility
│   └── ... (rest of app)
├── build/                          # Production build output
└── ENVIRONMENT_SETUP.md            # Full setup guide
```

---

## 🚀 Deployment Guide

### Step 1: Build for Production

```bash
npm run build:prod
```

### Step 2: Verify Build

```bash
npm start
# Test on http://localhost:8080
```

### Step 3: Deploy

```bash
# Copy build/ directory to your server
# Update your deploy configuration

# Example for Cloud Run:
gcloud run deploy cocoma-website \
  --source . \
  --platform managed \
  --memory 512Mi \
  --timeout 600s
```

### Step 4: Post-Deployment Verification

- ✅ Site loads on production URL
- ✅ API calls use production endpoint
- ✅ No debug logs in browser console
- ✅ Analytics enabled
- ✅ Performance monitoring active
- ✅ Lighthouse score: 70-85+

---

## 📈 Expected Performance

### Local Development

- Build time: ~30-45 seconds
- Hot-reload: <2 seconds
- Memory usage: Moderate (includes source maps)

### Production

- Build time: ~45-60 seconds
- Bundle size: 126KB (main) - 74% reduction
- File sizes: Optimized chunks (50KB target)
- Startup time: <3 seconds on 3G

---

## 📞 Support

For issues with environment setup:

1. **Check this guide** - Most issues covered above
2. **Run**: `node scripts/setup-env.js check`
3. **Verify .env files** exist and have correct values
4. **Clear cache**: `npm cache clean --force`
5. **Reinstall**: `rm -r node_modules && npm install`
6. **Rebuild**: `npm run build:prod`

---

## 🎓 Best Practices

✅ **Do:**

- Use environment variables for configuration
- Check environment before enabling features
- Use the logger utility instead of console.log
- Test builds locally before deploying
- Keep .env files out of version control

❌ **Don't:**

- Hardcode API URLs
- Commit .env files with secrets
- Disable debug mode checking in code
- Use console.log directly (use logger)
- Skip local testing before production

---

**Last Updated:** October 2025  
**Status:** ✅ Production Ready  
**Version:** 1.0.0
