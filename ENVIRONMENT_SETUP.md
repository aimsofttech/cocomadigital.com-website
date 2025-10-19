# Environment Setup Guide

## Overview

This project now supports separate configurations for Local Development and Production environments using multiple `package.json` files and environment variables.

---

## Files Created

### 1. **package.local.json** - Local Development Configuration

- Homepage: `http://localhost:3000`
- Optimized for development and testing
- Includes source maps and debugging tools
- Redux DevTools enabled
- Console warnings enabled

### 2. **package.production.json** - Production Configuration

- Homepage: `https://cocoma-website-594958810769.asia-south1.run.app`
- Production-optimized build
- Serve enabled for production serving
- Optimized for performance
- Minimal logging

### 3. **.env.local** - Local Environment Variables

```
REACT_APP_ENV=local
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
NODE_ENV=development
PORT=3000
```

### 4. **.env.production** - Production Environment Variables

```
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.cocomadigital.com
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
NODE_ENV=production
PORT=8080
```

### 5. **src/config/environment.js** - Environment Utility

Centralized configuration management with:

- Environment detection helpers
- Feature flags based on environment
- Logger with environment-aware levels
- Performance monitoring configuration

---

## Setup Instructions

### For Local Development

**Option 1: Quick Start (Recommended)**

```bash
npm run dev
```

This uses the main package.json with cross-env set to development mode.

**Option 2: Use Local-Specific Package.json**

```bash
# First time setup
npm run setup:local

# Then start development
npm run dev
```

### For Production

**Build for Production**

```bash
npm run build:prod
```

or

```bash
npm run build
```

**Setup Production Package**

```bash
npm run setup:prod
```

**Start Production Server**

```bash
npm start
```

---

## Package.json Scripts

### Main Package.json (Default)

```bash
npm run dev              # Start development server (local)
npm start               # Start production server with serve
npm run build           # Build for production
npm run build:local     # Build specifically for local testing
npm run build:prod      # Build specifically for production
npm run test            # Run tests
npm run setup:local     # Switch to local development setup
npm run setup:prod      # Switch to production setup
npm run eject           # Eject from CRA (not recommended)
```

### Local Package.json (package.local.json)

```bash
npm run dev             # Local development server
npm run start           # Alias for dev
npm run build:local     # Local optimized build
npm run test:local      # Tests with local environment
```

### Production Package.json (package.production.json)

```bash
npm run build:prod      # Production optimized build
npm run start           # Production server with serve
```

---

## Environment Variables Reference

### Available Variables

| Variable              | Local                 | Production                    | Purpose                         |
| --------------------- | --------------------- | ----------------------------- | ------------------------------- |
| `REACT_APP_ENV`       | local                 | production                    | Environment type identification |
| `REACT_APP_API_URL`   | http://localhost:8000 | https://api.cocomadigital.com | API endpoint                    |
| `REACT_APP_DEBUG`     | true                  | false                         | Enable debug mode               |
| `REACT_APP_LOG_LEVEL` | debug                 | error                         | Console logging level           |
| `NODE_ENV`            | development           | production                    | Node environment                |
| `PORT`                | 3000                  | 8080                          | Server port                     |

### Using Environment Variables

```javascript
import ENV, { isLocal, isProduction, logger } from "./config/environment";

// Check environment
if (isProduction()) {
  // Production-specific code
}

if (isLocal()) {
  // Development-specific code
}

// Use logger
logger.debug("Debug message"); // Only in local
logger.error("Error message"); // Always shown
logger.info("Info message"); // Depends on LOG_LEVEL

// Access configuration
const apiUrl = ENV.api.baseURL;
const debugMode = ENV.debug;
const enableAnalytics = ENV.features.enableAnalytics;
```

---

## Typical Workflow

### Local Development

```bash
# Clone/pull repo
git clone <repo>
cd <project>

# Install dependencies
npm install

# Start development
npm run dev

# Development server runs on http://localhost:3000
# With hot-reload and debugging enabled
```

### Building for Production

```bash
# Build optimized production bundle
npm run build:prod

# Test production build locally
npm start

# Deploy to production server
# (Your deployment process here)
```

### Switching Environments

```bash
# Current setup uses main package.json with cross-env

# To verify which environment is active
node -e "console.log(process.env.REACT_APP_ENV)"

# To explicitly use local config
npm run setup:local
npm run dev

# To explicitly use production config
npm run setup:prod
npm run build
```

---

## Configuration Hierarchy

The configuration loads in this order (later values override earlier):

1. `.env` - Default environment variables
2. `.env.local` - Local development overrides
3. `.env.production` - Production overrides
4. Process environment variables - Highest priority
5. `environment.js` utility - Runtime configuration

---

## Feature Flags by Environment

### Local/Development

✅ Redux DevTools enabled  
✅ Source maps enabled  
✅ Console warnings visible  
✅ Debug logging enabled  
✅ Hot module replacement

### Production

❌ Redux DevTools disabled  
❌ Source maps disabled (by default)  
✅ Analytics enabled  
✅ Crash reporting enabled  
✅ Performance monitoring enabled  
❌ Minimal console output

---

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build:prod` successfully
- [ ] Verify `REACT_APP_ENV=production` is set
- [ ] Confirm API URL points to production API
- [ ] Test production build locally: `npm start`
- [ ] Verify no debug logs in browser console
- [ ] Check bundle size: `npm run build:prod`
- [ ] Validate all feature flags for production
- [ ] Deploy `build/` directory to server
- [ ] Verify production site loads correctly
- [ ] Monitor error logs post-deployment

---

## Troubleshooting

### Issue: Environment variables not loading

**Solution:** Restart dev server or rebuild after changing `.env` files

### Issue: Cross-env not recognized

**Solution:** Run `npm install` to ensure dependencies installed

### Issue: Wrong environment in build

**Solution:**

1. Check `.env` files
2. Verify `REACT_APP_ENV` is set correctly
3. Clear `node_modules` and reinstall: `rm -r node_modules && npm install`

### Issue: Console still shows debug logs in production

**Solution:**

1. Verify `REACT_APP_DEBUG=false` in `.env.production`
2. Rebuild: `npm run build:prod`
3. Check `NODE_ENV=production`

---

## Notes

- **cross-env** package ensures environment variables work on Windows/Unix
- **react-app-rewired** enables custom webpack configuration
- Main `package.json` is the default; create different configs for specific environments
- Environment variables are baked into the build; changing them requires a rebuild
- Use `src/config/environment.js` for centralized configuration management

---

## Support

For environment-related issues:

1. Check this guide
2. Verify `.env` files
3. Clear cache: `npm cache clean --force`
4. Reinstall: `rm -r node_modules && npm install`
5. Rebuild: `npm run build:prod`
