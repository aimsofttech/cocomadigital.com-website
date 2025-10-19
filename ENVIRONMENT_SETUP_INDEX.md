# 🔧 Multi-Environment Configuration Setup - Complete Documentation

## 📑 Quick Navigation

| Document                 | Purpose                                  |
| ------------------------ | ---------------------------------------- |
| **MULTI_ENV_SETUP.md**   | 🚀 Start here - Quick start and overview |
| **ENVIRONMENT_SETUP.md** | 📚 Detailed setup guide and reference    |
| This file                | 📋 Complete index and checklist          |

---

## ✅ What Was Created

### New Files

```
✅ package.local.json              # Local development config
✅ package.production.json         # Production config
✅ .env.local                      # Local environment variables
✅ .env.production                 # Production environment variables
✅ src/config/environment.js       # Environment utility
✅ scripts/setup-env.js            # Setup automation script
✅ MULTI_ENV_SETUP.md              # Quick reference guide
✅ ENVIRONMENT_SETUP.md            # Detailed setup guide
```

### Updated Files

```
✅ package.json                    # Updated with cross-env scripts
```

---

## 🎯 Configuration Summary

### Environments

#### Local Development

```
Homepage: http://localhost:3000
API URL: http://localhost:8000
Debug: Enabled (true)
Log Level: debug
Node Environment: development
Port: 3000
```

#### Production

```
Homepage: https://cocoma-website-594958810769.asia-south1.run.app
API URL: https://api.cocomadigital.com
Debug: Disabled (false)
Log Level: error
Node Environment: production
Port: 8080
```

---

## 🚀 Getting Started

### Option 1: Default Setup (Recommended)

```bash
# Install everything
npm install

# Start local development
npm run dev

# Build for production
npm run build:prod
```

### Option 2: Manual Environment Selection

```bash
# Check current environment
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

---

## 📋 New NPM Scripts

### Development

| Command               | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Start local dev server (http://localhost:3000) |
| `npm run build:local` | Build for local testing                        |
| `npm run test:local`  | Run tests in local environment                 |

### Production

| Command              | Purpose                         |
| -------------------- | ------------------------------- |
| `npm run build`      | Build for production            |
| `npm run build:prod` | Build for production (explicit) |
| `npm start`          | Start production server         |

### Setup

| Command               | Purpose                           |
| --------------------- | --------------------------------- |
| `npm run setup:local` | Switch to local package.json      |
| `npm run setup:prod`  | Switch to production package.json |

---

## 🔧 Using Environment Variables

### In Your Code

**Check Environment:**

```javascript
import ENV, { isLocal, isProduction } from "./config/environment";

if (isProduction()) {
  // Production-only code
  enableAnalytics();
}

if (isLocal()) {
  // Development-only code
  enableDevTools();
}
```

**Use Logger:**

```javascript
import { logger } from "./config/environment";

logger.debug("Debug message"); // Only in local
logger.info("Info message"); // Based on LOG_LEVEL
logger.error("Error message"); // Always shown
```

**Access Configuration:**

```javascript
import ENV from "./config/environment";

const apiUrl = ENV.api.baseURL;
const debug = ENV.debug;
const enableAnalytics = ENV.features.enableAnalytics;
```

### Adding New Variables

1. Add to `.env.local` or `.env.production`:

   ```
   REACT_APP_MY_VARIABLE=value
   ```

2. Use in code:

   ```javascript
   const myVar = process.env.REACT_APP_MY_VARIABLE;
   ```

3. Or add to `src/config/environment.js` for centralized access

---

## 🔄 Workflow Examples

### Local Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Code and develop
# - Hot-reload enabled
# - Debug logs visible
# - DevTools available

# 4. Build for testing (optional)
npm run build:local

# 5. Test build
npm start
```

### Production Deployment Workflow

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build:prod

# 3. Verify build locally
npm start
# Visit http://localhost:8080

# 4. Deploy build/ directory
# - Upload to production server
# - Configure web server
# - Update DNS if needed

# 5. Monitor production
# - Check analytics
# - Monitor errors
# - Track performance
```

### Switching Environments

```bash
# Check current
node scripts/setup-env.js check

# Switch from Local to Production
node scripts/setup-env.js prod
npm install
npm run build:prod

# Switch from Production to Local
node scripts/setup-env.js local
npm install
npm run dev
```

---

## 🎯 Feature Flags

### Automatically Enabled Based on Environment

#### Local Development ✅

```javascript
enableReduxDevtools: true;
enableSourceMaps: true;
enableConsoleWarnings: true;
enableSentry: false;
```

#### Production ✅

```javascript
enableAnalytics: true;
enableCrashReporting: true;
enablePerformanceMonitoring: true;
enableReduxDevtools: false;
enableSourceMaps: false;
```

### Conditional Code Example

```javascript
import ENV from "./config/environment";

// Setup analytics only in production
if (ENV.features.enableAnalytics) {
  initializeAnalytics();
}

// Show debug info only in development
if (ENV.features.enableConsoleWarnings) {
  console.log("Debug info:", ENV);
}
```

---

## 📊 File Structure

```
project-root/
│
├── 📄 package.json                 # Main config (uses cross-env)
├── 📄 package.local.json          # Local dev config
├── 📄 package.production.json      # Production config
│
├── 🔐 .env.local                  # Local env vars (dev API, debug on)
├── 🔐 .env.production             # Prod env vars (prod API, debug off)
│
├── 📚 MULTI_ENV_SETUP.md          # Quick reference
├── 📚 ENVIRONMENT_SETUP.md        # Detailed guide
├── 📚 ENVIRONMENT_SETUP_INDEX.md  # This file
│
├── scripts/
│   └── setup-env.js               # Environment switching script
│
├── src/
│   ├── config/
│   │   └── environment.js          # Environment utility & config
│   ├── components/
│   ├── pages/
│   └── ...
│
├── build/                         # Production build (generated)
└── node_modules/                  # Dependencies
```

---

## 🚀 Common Commands Reference

```bash
# Setup & Installation
npm install                        # Install all dependencies
npm run setup:local               # Switch to local config
npm run setup:prod                # Switch to production config

# Development
npm run dev                        # Start dev server
npm run build:local               # Build for local testing

# Production
npm run build                      # Build for production
npm run build:prod                # Build for production (explicit)
npm start                         # Start production server

# Testing
npm test                          # Run tests
npm run test:local                # Run tests in local env

# Utilities
npm run eject                     # Eject from CRA (not recommended)
node scripts/setup-env.js check   # Check current environment
node scripts/setup-env.js local   # Switch to local
node scripts/setup-env.js prod    # Switch to production
```

---

## ✅ Setup Checklist

### First-Time Setup

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Verify `.env.local` exists
- [ ] Verify `.env.production` exists
- [ ] Run `node scripts/setup-env.js check`
- [ ] Start dev server: `npm run dev`
- [ ] Test in browser: http://localhost:3000

### Before Production Deployment

- [ ] Run `npm run build:prod`
- [ ] Verify build size (target: <200KB gzipped)
- [ ] Test build locally: `npm start`
- [ ] Verify API URL points to production
- [ ] Check no debug logs in console
- [ ] Verify analytics enabled
- [ ] Run Lighthouse audit
- [ ] Deploy `build/` directory

### Post-Deployment

- [ ] Verify site loads on production URL
- [ ] Check browser console (no errors)
- [ ] Verify analytics receiving data
- [ ] Monitor error logs
- [ ] Test on mobile devices
- [ ] Check Core Web Vitals
- [ ] Review performance metrics

---

## 🐛 Troubleshooting

| Problem                         | Solution                                              |
| ------------------------------- | ----------------------------------------------------- |
| Environment variables undefined | Restart dev server, rebuild with `npm run build:prod` |
| Wrong environment being used    | Run `node scripts/setup-env.js check` to verify       |
| cross-env not found             | `npm install cross-env --save-dev`                    |
| Build fails                     | Clear cache: `rm -r node_modules && npm install`      |
| Port already in use             | Change PORT in .env file or kill process on port 3000 |
| API calls failing in production | Verify REACT_APP_API_URL in .env.production           |

---

## 📈 Performance Targets

### Build Metrics

| Metric       | Local          | Production       |
| ------------ | -------------- | ---------------- |
| Build Time   | 30-45s         | 45-60s           |
| Main Bundle  | ~250KB         | ~126KB (gzipped) |
| Chunk Size   | <100KB         | <50KB (target)   |
| Chunks Count | 107+ optimized | Minimized        |

### Runtime Metrics

| Metric              | Target | Achieved        |
| ------------------- | ------ | --------------- |
| Lighthouse Score    | 70-85+ | Expected 75+    |
| LCP (Load)          | <2.5s  | Expected <2.5s  |
| FID (Interactivity) | <100ms | Expected <100ms |
| CLS (Stability)     | <0.1   | Expected <0.1   |

---

## 🔐 Security Best Practices

✅ **DO:**

- Store sensitive data in .env files
- Add `.env.local` and `.env.production` to .gitignore
- Use HTTPS URLs in production
- Disable debug mode in production
- Rotate API keys regularly

❌ **DON'T:**

- Commit .env files with secrets
- Hardcode API URLs
- Enable debug in production
- Expose sensitive data in client code
- Use same API URL for dev and prod

---

## 📝 Environment Variables Reference

### Local Development (.env.local)

```env
REACT_APP_ENV=local
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
NODE_ENV=development
PORT=3000
```

### Production (.env.production)

```env
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.cocomadigital.com
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
NODE_ENV=production
PORT=8080
```

### Using Environment Variables

```javascript
// Automatically available with REACT_APP_ prefix
const apiUrl = process.env.REACT_APP_API_URL;
const env = process.env.REACT_APP_ENV;
const debug = process.env.REACT_APP_DEBUG === "true";

// Via environment utility
import ENV from "./config/environment";
const apiUrl = ENV.api.baseURL;
const debugMode = ENV.debug;
```

---

## 🎓 Learning Resources

### Understanding This Setup

1. **MULTI_ENV_SETUP.md** - Start here for overview
2. **ENVIRONMENT_SETUP.md** - Deep dive into configuration
3. **src/config/environment.js** - See the utility implementation
4. **scripts/setup-env.js** - See automation script

### External Resources

- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Node.js cross-env Package](https://www.npmjs.com/package/cross-env)
- [12 Factor App Configuration](https://12factor.net/config)

---

## 🤝 Support

### Quick Help

```bash
# Check current setup
node scripts/setup-env.js check

# Show help
node scripts/setup-env.js help
```

### Common Issues

1. **Variables not loading** → Restart dev server
2. **Wrong environment** → Run `node scripts/setup-env.js check`
3. **Build failures** → Clear cache: `npm cache clean --force && npm install`

---

## 📞 Next Steps

1. **Read Quick Start**: Open `MULTI_ENV_SETUP.md`
2. **Run Setup Script**: `node scripts/setup-env.js check`
3. **Start Development**: `npm run dev`
4. **Deploy to Production**: Follow deployment guide in `ENVIRONMENT_SETUP.md`

---

## 📊 Summary

| Aspect                  | Details                                    |
| ----------------------- | ------------------------------------------ |
| **Environments**        | Local + Production                         |
| **Configuration Files** | 3 package.json + 2 .env files              |
| **New Scripts**         | 2 build commands + 2 setup commands        |
| **Environment Utility** | environment.js with logger & feature flags |
| **Automation**          | setup-env.js for easy switching            |
| **Documentation**       | 3 comprehensive guides                     |
| **Status**              | ✅ Ready for Production                    |

---

**Last Updated:** October 19, 2025  
**Version:** 1.0.0  
**Status:** ✅ Complete & Production Ready
