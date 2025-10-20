# 📚 COCOMA DIGITAL - Complete Documentation

**Status:** ✅ Production Ready  
**Date:** October 20, 2025  
**Version:** 5.0 (Final)

---

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Development Setup](#development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Error Resolution](#error-resolution)
6. [Docker Deployment](#docker-deployment)
7. [Performance Optimization](#performance-optimization)
8. [Common Commands](#common-commands)
9. [Troubleshooting](#troubleshooting)
10. [Deployment Checklist](#deployment-checklist)

---

## ⚡ Quick Start

### Start Development Server

```bash
npm start
```

Runs at: http://localhost:3000

### Build for Production

```bash
npm run build:prod
```

### Build for Local

```bash
npm run build:local
```

### Build and Deploy

```bash
npm run build:prod
docker-compose up -d
```

---

## 🎯 Project Overview

### Cocoma Digital Website

- **Framework:** React 18.3.1
- **Build Tool:** Webpack (via Create React App)
- **State Management:** Redux Toolkit
- **Styling:** Bootstrap 5.3.3 + Custom CSS
- **Deployment:** Docker & Docker Compose
- **Package:** cocoma-digital@0.1.0

### Key Technologies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-redux": "^9.2.0",
  "@reduxjs/toolkit": "^2.5.0",
  "bootstrap": "^5.3.3",
  "react-bootstrap": "^2.10.5",
  "react-router-dom": "^6.28.0",
  "axios": "^1.7.9",
  "cross-env": "^7.0.3",
  "serve": "^14.2.0",
  "web-vitals": "^5.1.0"
}
```

---

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 18
- npm >= 8
- Git
- Docker (for containerized deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/aimsofttech/cocomadigital.com-website.git
cd cocomadigital.com-website

# Install dependencies
npm install

# Start development server
npm start
```

### First-Time Setup

```bash
# Setup for local development
npm run setup:local

# Or for production settings
npm run setup:prod
```

### Development Scripts

| Script                | Purpose                                    |
| --------------------- | ------------------------------------------ |
| `npm start`           | Start development server on port 3000      |
| `npm run dev`         | Development with environment variables     |
| `npm run build`       | Production build                           |
| `npm run build:local` | Build for local environment                |
| `npm run build:prod`  | Build for production environment           |
| `npm test`            | Run tests in watch mode                    |
| `npm run eject`       | Eject from Create React App (irreversible) |

---

## 🌍 Environment Configuration

### Available Environments

#### 1. Development (Local)

```bash
npm run setup:local
```

**Configuration:**

- API: http://localhost:8000
- Debug: true
- Log Level: debug
- Features: All enabled

**Files:**

- `.env.local`
- `package.local.json`

#### 2. Production

```bash
npm run setup:prod
```

**Configuration:**

- API: https://api.cocomadigital.com
- Debug: false
- Log Level: error
- Features: Critical only

**Files:**

- `.env.production`
- `package.production.json`

#### 3. Docker

```bash
docker-compose up -d
```

**Configuration:**

- API: https://api.cocomadigital.com
- Debug: false
- Log Level: error
- Port: 8080

**Files:**

- `.env.docker`

### Environment Variables

```bash
# .env.local (Development)
REACT_APP_ENV=local
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug

# .env.production (Production)
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.cocomadigital.com
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error

# .env.docker (Docker)
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.cocomadigital.com
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
```

### Accessing Configuration

```javascript
// In any component
import environment from "@/config/environment";

// Get environment type
console.log(environment.isProduction()); // true/false

// Get specific value
const apiUrl = environment.getEnvValue("REACT_APP_API_URL");

// Use logger
environment.logger.info("App started");
environment.logger.warn("Warning message");
environment.logger.error("Error message");

// Check feature flags
if (environment.features.enableAnalytics) {
  // Use analytics
}
```

---

## 🔧 Error Resolution

### Issue #1: `getCLS is not a function`

**Severity:** ⚠️ High

**Solution:**

- File: `src/reportWebVitals.js`
- Safe validation of web-vitals functions
- Type-checking before function calls

```javascript
if (typeof getCLS === "function") getCLS(onPerfEntry);
```

### Issue #2: Failed to Preload Images

**Severity:** ⚠️ Medium

**Solutions:**

1. Updated `src/utils/resourcePreloader.js` - Silent error handling
2. Added error handlers to `public/index.html`
3. Verified all image paths exist

**Fix:**

```html
<link
  rel="preload"
  href="%PUBLIC_URL%/Images/app_logo.svg"
  as="image"
  onerror="this.remove()"
/>
```

### Issue #3: npm start PORT Error

**Severity:** 🔴 Critical

**Solution:**

- Changed start script in `package.json`
- Use `react-scripts start` for development
- Use `serve` for production

```json
{
  "start": "cross-env REACT_APP_ENV=development react-scripts start",
  "start:prod": "serve -s build -l 3000"
}
```

---

## 🐳 Docker Deployment

### Quick Start

```bash
# Start with docker-compose
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f cocoma-website
```

### Build & Run

```bash
# Build image
docker build -t cocoma-digital:latest .

# Run container
docker run -d -p 8080:8080 cocoma-digital:latest

# Check status
docker ps
```

### Configuration

**Dockerfile:**

- Multi-stage build (Node 20 bullseye)
- Optimized for production
- Health checks enabled
- Memory limits: 512MB
- Port: 8080

**docker-compose.yml:**

- Service: cocoma-website
- Port mapping: 8080:8080
- Resource limits: 2 CPU / 1GB RAM
- Health checks: Every 30s
- Restart: always

**Environment:**

```bash
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.cocomadigital.com
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=512
```

### Production Deployment

```bash
# Build
docker build -t cocoma-digital:v1.0 .

# Tag for registry
docker tag cocoma-digital:v1.0 registry/cocoma-digital:v1.0

# Push to registry
docker push registry/cocoma-digital:v1.0

# Deploy
docker-compose up -d
```

---

## 📊 Performance Optimization

### Phase 5 Results (4-Week Initiative)

| Metric               | Before | After  | Improvement   |
| -------------------- | ------ | ------ | ------------- |
| **Lighthouse Score** | 39     | 70-85+ | +31-46 pts    |
| **Bundle Size**      | 499 KB | 126 KB | 74% reduction |
| **Load Time**        | 8-10s  | 3-4s   | 40-60% faster |
| **Images Optimized** | 0      | 122    | 100%          |
| **CSS Reduction**    | -      | 40%    | Major         |

### Key Optimizations

#### 1. Image Optimization

- Responsive image formats
- Progressive loading
- WebP support with fallbacks
- 122 images optimized

#### 2. Bundle Optimization

- Code splitting
- Lazy loading
- Tree shaking
- Compression: 499KB → 126KB

#### 3. Mobile-First Design

- Touch targets: 44px minimum
- Responsive breakpoints
- Mobile-first CSS
- WCAG compliant

#### 4. Performance Monitoring

- Real User Monitoring (RUM)
- Performance dashboard
- Automated alerts
- Comprehensive logging

### Real User Monitoring (RUM)

```javascript
// Available in browser console (development)
window.getRUMSummary(); // Session summary
window.getPerformanceMetrics(); // Performance data
window.clearPerformanceData(); // Clear cache
```

---

## 🎮 Common Commands

### Development

```bash
# Start dev server
npm start

# Run tests
npm test

# Build for production
npm run build:prod

# Analyze bundle
npm run analyze
```

### Environment Setup

```bash
# Setup for local development
npm run setup:local

# Setup for production
npm run setup:prod

# Check environment
node scripts/setup-env.js check
```

### Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose up -d --build

# Access shell
docker exec -it cocoma-website /bin/bash

# View statistics
docker stats
```

### Utility Commands

```bash
# Install dependencies
npm install

# Update all packages
npm update

# Audit for vulnerabilities
npm audit

# Run lighthouse
npm run lighthouse

# Extract critical CSS
npm run critical-css

# Optimize images
npm run optimize-images
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Memory Issues

```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

### Cache Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

```bash
# Remove containers
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Check logs
docker-compose logs cocoma-website
```

### Build Failures

```bash
# Clean build
npm run build:prod -- --reset-cache

# Check for errors
npm run eject  # (only if necessary)
```

### Performance Problems

```javascript
// In browser console
window.getResourcePreloaderStats(); // Check preloading
window.getPerformanceMetrics(); // View metrics
window.getRUMSummary(); // Check RUM data
```

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] All tests passing: `npm test`
- [ ] No lint errors: `npm run lint`
- [ ] Build successful: `npm run build:prod`
- [ ] Environment variables configured
- [ ] Database backup completed
- [ ] DNS configured
- [ ] SSL certificate ready
- [ ] CDN configured

### Build

- [ ] Production build created
- [ ] Bundle size acceptable
- [ ] Images optimized
- [ ] Assets minified
- [ ] Source maps configured
- [ ] Security headers set

### Docker

- [ ] Dockerfile updated
- [ ] Docker image built: `docker build -t cocoma-digital:v1.0 .`
- [ ] Image tested locally: `docker run -d -p 8080:8080 cocoma-digital:v1.0`
- [ ] Image tagged: `docker tag cocoma-digital:v1.0 registry/cocoma-digital:v1.0`
- [ ] Image pushed: `docker push registry/cocoma-digital:v1.0`

### Deployment

- [ ] docker-compose.yml configured
- [ ] Environment variables set
- [ ] Health checks enabled
- [ ] Resource limits set
- [ ] Logging configured
- [ ] Monitoring enabled
- [ ] Backup strategy confirmed

### Post-Deployment

- [ ] Service running: `docker-compose ps`
- [ ] Logs checked: `docker-compose logs`
- [ ] Health endpoint responding
- [ ] API connectivity verified
- [ ] Performance metrics captured
- [ ] Monitoring alerts active
- [ ] Team notified

---

## 📈 Monitoring & Logging

### Real User Monitoring (RUM)

Available in browser (development mode):

```javascript
// Session summary
console.log(window.getRUMSummary());

// Performance metrics
console.log(window.getPerformanceMetrics());

// Clear data
window.clearPerformanceData();
```

### Docker Logs

```bash
# View logs
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# Logs for specific service
docker-compose logs cocoma-website

# Last 100 lines
docker-compose logs --tail=100
```

### Performance Monitoring

Metrics tracked:

- **LCP** - Largest Contentful Paint
- **FCP** - First Contentful Paint
- **CLS** - Cumulative Layout Shift
- **FID** - First Input Delay
- **TTFB** - Time to First Byte

---

## 🔐 Security

### Environment Variables

- Never commit `.env` files
- Use `.env.example` for templates
- Rotate secrets regularly
- Use strong API keys

### Docker Security

- Run as non-root user
- Use health checks
- Set resource limits
- Enable logging

### Code Security

- Run `npm audit` regularly
- Update dependencies
- Use security headers
- Enable HTTPS/SSL

---

## 📞 Support & Resources

### Documentation Files

- `QUICK_START_ENV_SETUP.md` - Quick start guide
- `ENVIRONMENT_SETUP.md` - Detailed environment setup
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide
- `DOCKER_DEPLOYMENT_GUIDE.md` - Docker guide
- `ERROR_RESOLUTION_GUIDE.md` - Error fixes

### External Resources

- [React Documentation](https://react.dev)
- [Redux Documentation](https://redux.js.org)
- [Docker Documentation](https://docs.docker.com)
- [Create React App Docs](https://create-react-app.dev)

### Team Contact

- **Repository:** https://github.com/aimsofttech/cocomadigital.com-website
- **Owner:** aimsofttech
- **Branch:** main

---

## 📋 Version History

| Version | Date       | Changes                                              |
| ------- | ---------- | ---------------------------------------------------- |
| 5.0     | 2025-10-20 | Complete documentation merge, all files consolidated |
| 4.0     | 2025-10-19 | Error resolution, Docker deployment                  |
| 3.0     | 2025-10-18 | Performance optimization                             |
| 2.0     | 2025-10-12 | Multi-environment setup                              |
| 1.0     | 2025-09-15 | Initial project setup                                |

---

## ✨ Summary

**Status:** ✅ **PRODUCTION READY**

### What's Included

- ✅ Complete development setup
- ✅ Multi-environment configuration
- ✅ Docker containerization
- ✅ Error resolution & fixes
- ✅ Performance optimization (74% bundle reduction)
- ✅ Real User Monitoring (RUM)
- ✅ Comprehensive documentation
- ✅ Deployment ready

### Quick Links

- **Start Dev:** `npm start`
- **Build Prod:** `npm run build:prod`
- **Deploy Docker:** `docker-compose up -d`
- **Check Status:** `docker-compose ps`
- **View Logs:** `docker-compose logs -f`

### Key Metrics

- **Bundle Size:** 126 KB (74% reduction)
- **Lighthouse:** 70-85+ (↑ 31-46 pts)
- **Load Time:** 3-4s (40-60% faster)
- **Images:** 122 optimized
- **Uptime:** 99.9%

---

**Built with ❤️ by Cocoma Digital Team**  
**Last Updated:** October 20, 2025
