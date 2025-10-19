# 🚀 QUICK START - Multi-Environment Setup

**Status:** ✅ Ready to Use  
**Last Updated:** October 19, 2025

---

## ⚡ Start in 2 Minutes

### Local Development (Recommended)

```bash
npm install
npm run dev
```

✅ Opens http://localhost:3000 with hot-reload

### Production Build

```bash
npm install
npm run build:prod
npm start
```

✅ Builds optimized bundle and serves on http://localhost:8080

---

## 📚 What Was Created

| File                        | Purpose                     |
| --------------------------- | --------------------------- |
| `package.local.json`        | Local dev config            |
| `package.production.json`   | Production config           |
| `.env.local`                | Local environment vars      |
| `.env.production`           | Production environment vars |
| `src/config/environment.js` | Configuration utility       |
| `scripts/setup-env.js`      | Environment switcher        |

---

## 🔄 Switch Environments

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

## 💻 Use Environment Variables

```javascript
// Check environment
import ENV, { isLocal, isProduction } from "./config/environment";

if (isProduction()) {
  // Production-specific code
}

// Access configuration
const apiUrl = ENV.api.baseURL; // API endpoint
const debug = ENV.debug; // Debug mode
const features = ENV.features; // Feature flags

// Use logger
import { logger } from "./config/environment";
logger.debug("Debug message"); // Only in local
logger.error("Error message"); // Always shown
```

---

## 📦 NPM Scripts

```bash
npm run dev              # Start local dev server
npm run build:local      # Build for local testing
npm run build:prod       # Build for production
npm start                # Start production server
npm run setup:local      # Switch to local config
npm run setup:prod       # Switch to production config
```

---

## ⚙️ Configuration

### Local Development

```
URL: http://localhost:3000
API: http://localhost:8000
Debug: ON
Log Level: debug
Port: 3000
```

### Production

```
URL: https://cocoma-website-594958810769.asia-south1.run.app
API: https://api.cocomadigital.com
Debug: OFF
Log Level: error
Port: 8080
```

---

## 📖 Full Documentation

- **MULTI_ENV_SETUP.md** - Complete overview (5-10 min)
- **ENVIRONMENT_SETUP.md** - Detailed guide (15-20 min)
- **ENVIRONMENT_SETUP_INDEX.md** - Full index (10-15 min)
- **ENVIRONMENT_CONFIGURATION_SUMMARY.md** - Summary (5 min)
- **ENVIRONMENT_IMPLEMENTATION_CHECKLIST.md** - Verification (5 min)

---

## ✅ Verification

```bash
# Test setup
npm run dev

# In another terminal
npm run build:prod

# Verify bundle
npm start

# Check environment
node scripts/setup-env.js check
```

---

## 🎯 Common Tasks

### Start Development

```bash
npm run dev
# http://localhost:3000
```

### Build for Production

```bash
npm run build:prod
# Creates optimized build/ directory
```

### Test Production Build

```bash
npm start
# http://localhost:8080
```

### Check Current Environment

```bash
node scripts/setup-env.js check
```

---

## 🐛 Quick Troubleshooting

| Issue                | Solution                              |
| -------------------- | ------------------------------------- |
| Env vars not loading | Restart dev server                    |
| Wrong environment    | Run `node scripts/setup-env.js check` |
| cross-env not found  | `npm install`                         |
| Build fails          | `rm -r node_modules && npm install`   |
| Port in use          | Change PORT in .env file              |

---

## 📞 Need Help?

1. **Quick Start** → This file (you're reading it!)
2. **Overview** → MULTI_ENV_SETUP.md
3. **Details** → ENVIRONMENT_SETUP.md
4. **Complete Index** → ENVIRONMENT_SETUP_INDEX.md
5. **Troubleshooting** → See "Quick Troubleshooting" above

---

## 🎉 You're All Set!

Your project now has:
✅ Separate local and production configs  
✅ Environment variable management  
✅ Easy environment switching  
✅ Complete documentation  
✅ Production-ready build

**Start developing:**

```bash
npm run dev
```

---

**Questions?** See the detailed guides linked above.
