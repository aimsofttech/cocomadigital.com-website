# 🚀 LCP Optimization Guide - Cocoma Digital

## Current Status

- **Current LCP**: 10,270 ms (CRITICAL ❌)
- **Target LCP**: < 2,500 ms (Good ✅)
- **Improvement Needed**: 4x faster

---

## 📊 Root Cause Analysis

### 1. **Hero Banner (Section01)** - Likely LCP Element

Your Home page has:

```jsx
{
  homeData?.top_banner && <Section01 bannerData={homeData?.top_banner} />;
}
```

**Problems:**

- Banner loads AFTER API call completes (`fetchHomeData`)
- API call is synchronous blocking
- No image preloading/lazy loading
- Large hero image likely unoptimized

### 2. **API Blocking Render**

```jsx
useEffect(() => {
  const fetchHomeData = async () => {
    /* waits for API */
  };
  fetchHomeData();
}, [language]);
```

**Impact**: Page can't render Section01 until API returns

### 3. **Image Optimization Missing**

- No WebP format conversion
- No responsive image sizes
- No critical image preloading
- Images likely full resolution for all devices

### 4. **Render-Blocking Resources**

- CSS not critical-extracted
- JavaScript parsing delays rendering
- Third-party scripts (Google Analytics) not deferred

---

## ✅ Step-by-Step Optimization

### **PHASE 1: Quick Wins (Do First)**

#### 1.1 Add Critical Image Preloading

**File: `public/index.html`**

Add after existing preload links:

```html
<!-- Phase 5 LCP Optimization: Critical Hero Image Preloading -->
<link
  rel="preload"
  href="%PUBLIC_URL%/Images/home/hero-banner-lg.jpg"
  as="image"
  imagesrcset="
    %PUBLIC_URL%/Images/home/hero-banner-sm.jpg 480w,
    %PUBLIC_URL%/Images/home/hero-banner-md.jpg 768w,
    %PUBLIC_URL%/Images/home/hero-banner-lg.jpg 1200w"
  imagesizes="(max-width: 768px) 100vw, 1200px"
  onerror="this.remove()"
/>

<!-- DNS Prefetch for API server -->
<link rel="dns-prefetch" href="//your-api-domain.com" />
```

#### 1.2 Optimize Hero Image File Size

**Create: `scripts/optimize-hero-image.js`**

```javascript
#!/usr/bin/env node

/**
 * Hero Image Optimization Script
 * Converts hero images to WebP and creates responsive sizes
 * Usage: node scripts/optimize-hero-image.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const heroImagePath = path.join(
  __dirname,
  "../public/Images/home/hero-banner.jpg"
);
const outputDir = path.join(__dirname, "../public/Images/home");

const sizes = [
  { width: 480, suffix: "sm" },
  { width: 768, suffix: "md" },
  { width: 1200, suffix: "lg" },
  { width: 1600, suffix: "xl" },
];

async function optimizeHeroImage() {
  console.log("🖼️  Optimizing hero image...");

  for (const size of sizes) {
    // JPEG versions
    await sharp(heroImagePath)
      .resize(size.width, null, { withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toFile(path.join(outputDir, `hero-banner-${size.suffix}.jpg`))
      .then((info) =>
        console.log(`✅ JPEG ${size.suffix}: ${info.size} bytes`)
      );

    // WebP versions (smaller)
    await sharp(heroImagePath)
      .resize(size.width, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(path.join(outputDir, `hero-banner-${size.suffix}.webp`))
      .then((info) =>
        console.log(`✅ WebP ${size.suffix}: ${info.size} bytes`)
      );
  }

  console.log("🎉 Hero image optimization complete!");
}

optimizeHeroImage().catch(console.error);
```

Run:

```bash
npm install sharp --save-dev
node scripts/optimize-hero-image.js
```

---

### **PHASE 2: API & Rendering Optimization**

#### 2.1 Create Skeleton Content for Hero

**File: `src/components/Home/Section01/SkeletonHero.jsx`**

```jsx
import React from "react";
import "./SkeletonHero.css";

export const SkeletonHero = () => {
  return (
    <div className="skeleton-hero-container">
      <div className="skeleton-hero-image" />
      <div className="skeleton-hero-content">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-subtitle" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
};
```

**File: `src/components/Home/Section01/SkeletonHero.css`**

```css
.skeleton-hero-container {
  display: flex;
  align-items: center;
  min-height: 400px;
  background: linear-gradient(
    135deg,
    #f0f0f0 25%,
    #e0e0e0 25%,
    #e0e0e0 50%,
    #f0f0f0 50%,
    #f0f0f0 75%,
    #e0e0e0 75%
  );
  background-size: 40px 40px;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 40px;
  }
}

.skeleton-hero-image {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #f0f0f0;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin: 10px 0;
}

.skeleton-title {
  width: 60%;
  height: 32px;
}

.skeleton-subtitle {
  width: 40%;
  height: 20px;
}

.skeleton-button {
  width: 150px;
  height: 44px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-top: 20px;
  border-radius: 4px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .skeleton-hero-container {
    min-height: 300px;
  }
}
```

#### 2.2 Optimize Home Page for LCP

**File: `src/Pages/Home/Home.jsx` (Replace entire useEffect)**

```jsx
import { useEffect, useState, Suspense, lazy } from "react";
import "./Home.css";
import { useSelector } from "react-redux";
import adminServiceInstance from "../../Service/apiService";
import {
  SkeletonHeroBanner,
  SkeletonServicesGrid,
  SkeletonCard,
} from "../../components/common/Skeleton/Skeleton";
import { SkeletonHero } from "../../components/Home/Section01/SkeletonHero";

// Critical above-the-fold components loaded immediately
import Section01 from "../../components/Home/Section01/section01";
import Section02 from "../../components/Home/section02";

// Lazy load below-the-fold components
const ExploreOurServices = lazy(() =>
  import("../../components/Home/ExploreServices/services")
);
const Section04 = lazy(() =>
  import("../../components/Home/Section04/section04")
);
// ... rest of lazy imports

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState({
    // Provide default hero data for immediate render
    top_banner: {
      title: "Your Digital Presence Starts Here",
      subtitle: "Creating exceptional digital experiences",
      image: "%PUBLIC_URL%/Images/home/hero-banner-md.jpg", // Mobile-first default
    },
  });
  const [allCategories, setAllCategories] = useState({});
  const [error, setError] = useState("");
  const language = useSelector((state) => state?.lang?.lang);

  // OPTIMIZATION: Fetch in background, render cached data first
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Use AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await adminServiceInstance?.Home(language, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        setHomeData((prev) => ({ ...prev, ...response?.data?.data }));
      } catch (err) {
        console.error("API Error:", err);
        // Keep previously set data if error
        if (err.name !== "AbortError") {
          setError(err?.message || "Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Defer API call to after initial paint
    const timeoutId = setTimeout(fetchHomeData, 100);
    return () => clearTimeout(timeoutId);
  }, [language]);

  // Fetch categories independently (non-blocking)
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await adminServiceInstance?.homeAllCategories();
        setAllCategories(response?.data?.data);
      } catch (err) {
        console.error("Categories API Error:", err);
      }
    };

    // Defer category fetch to idle time
    const timeoutId = setTimeout(fetchAllCategories, 2000);
    return () => clearTimeout(timeoutId);
  }, [language]);

  return (
    <>
      <div className="home-main-wraper">
        <div className="home-main">
          {/* Always render hero immediately with default or API data */}
          {homeData?.top_banner && (
            <Section01 bannerData={homeData?.top_banner} />
          )}

          {/* Fallback skeleton if no data */}
          {!homeData?.top_banner && isLoading && <SkeletonHero />}

          <Section02 />

          {/* Below-the-fold content loads lazily when visible */}
          <Suspense fallback={<SkeletonServicesGrid count={6} />}>
            <ExploreOurServices categories={allCategories} />
          </Suspense>

          {/* Rest of sections */}
          {/* ... */}
        </div>
      </div>
    </>
  );
}
```

---

### **PHASE 3: Image Component Optimization**

#### 3.1 Create Optimized Hero Image Component

**File: `src/components/Home/Section01/OptimizedHeroImage.jsx`**

```jsx
import React, { useState, useEffect } from "react";

/**
 * OptimizedHeroImage Component
 * - Responsive images with srcset
 * - WebP format with fallback
 * - Lazy loading support
 * - Image optimization
 */
export const OptimizedHeroImage = ({
  src = "",
  alt = "Hero Banner",
  title = "",
  priority = false,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(!priority);

  // Use lower quality image while fetching on non-priority
  useEffect(() => {
    if (!src) return;

    // For priority images, load immediately
    if (priority) {
      setImageSrc(src);
      return;
    }

    // For non-priority, show placeholder first
    const img = new Image();
    img.onload = () => setImageSrc(src);
    img.onerror = () => setImageSrc(src); // Still load even if error
    img.src = src;
  }, [src, priority]);

  // Convert to WebP variants
  const webpSrcSet = src
    ? `
    ${src.replace(/\.(jpg|jpeg|png)$/i, "-sm.webp")} 480w,
    ${src.replace(/\.(jpg|jpeg|png)$/i, "-md.webp")} 768w,
    ${src.replace(/\.(jpg|jpeg|png)$/i, "-lg.webp")} 1200w,
    ${src.replace(/\.(jpg|jpeg|png)$/i, "-xl.webp")} 1600w
  `
    : "";

  const jpegSrcSet = src
    ? `
    ${src.replace(/\.(jpg|jpeg|png)$/i, "-sm.jpg")} 480w,
    ${src.replace(/\.(jpg|jpeg|png)$/i, "-md.jpg")} 768w,
    ${src.replace(/\.(jpg|jpeg|png)$/i, "-lg.jpg")} 1200w,
    ${src.replace(/\.(jpg|jpeg|png)$/i, "-xl.jpg")} 1600w
  `
    : "";

  return (
    <picture>
      <source
        srcSet={webpSrcSet}
        type="image/webp"
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 1200px"
      />
      <img
        src={imageSrc || src}
        alt={alt}
        title={title}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        srcSet={jpegSrcSet}
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 1200px"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          opacity: isLoading ? 0.8 : 1,
          transition: "opacity 0.3s ease",
        }}
        onLoad={() => setIsLoading(false)}
      />
    </picture>
  );
};

export default OptimizedHeroImage;
```

#### 3.2 Update Section01 to Use Optimized Image

**File: `src/components/Home/Section01/section01.jsx`**

```jsx
import React from "react";
import OptimizedHeroImage from "./OptimizedHeroImage";
import "./section01.css";

const Section01 = ({ bannerData }) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Image as background with priority loading */}
        <div className="hero-image-wrapper">
          <OptimizedHeroImage
            src={bannerData?.image || "/Images/home/hero-banner-lg.jpg"}
            alt={bannerData?.title || "Hero Banner"}
            title={bannerData?.title}
            priority={true} // This is LCP element - prioritize!
          />
        </div>

        {/* Content overlay */}
        <div className="hero-content">
          <h1 className="hero-title">{bannerData?.title}</h1>
          <p className="hero-subtitle">{bannerData?.subtitle}</p>
          <button className="hero-cta">
            {bannerData?.cta_text || "Get Started"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section01;
```

---

### **PHASE 4: Performance Monitoring**

#### 4.1 Enhanced Performance Monitor

**File: `src/utils/lcpMonitor.js`**

```javascript
/**
 * LCP Monitoring Utility
 * Tracks Largest Contentful Paint metrics
 *
 * Usage:
 * import lcpMonitor from './utils/lcpMonitor';
 * lcpMonitor.init();
 */

class LCPMonitor {
  constructor() {
    this.lcpData = {
      element: null,
      startTime: null,
      size: 0,
      url: null,
    };
    this.thresholds = {
      good: 2500,
      needsImprovement: 4000,
      poor: Infinity,
    };
  }

  init() {
    if (!("PerformanceObserver" in window)) {
      console.warn("⚠️  PerformanceObserver not supported");
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.lcpData = {
          element: lastEntry.element?.className || "unknown",
          startTime: lastEntry.startTime,
          size: lastEntry.size,
          url: lastEntry.url,
          renderTime: lastEntry.renderTime,
          loadTime: lastEntry.loadTime,
        };

        this.reportLCP();
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });

      // Stop observing after page load (safety check)
      window.addEventListener("load", () => {
        setTimeout(() => observer.disconnect(), 3000);
      });
    } catch (err) {
      console.error("❌ LCP Monitor Error:", err);
    }
  }

  reportLCP() {
    const { startTime } = this.lcpData;
    let status = "✅";
    let category = "good";

    if (startTime > this.thresholds.poor) {
      status = "❌";
      category = "poor";
    } else if (startTime > this.thresholds.needsImprovement) {
      status = "🟡";
      category = "needsImprovement";
    }

    console.log(
      `${status} LCP: ${startTime.toFixed(2)}ms | Element: ${
        this.lcpData.element
      } | Category: ${category}`
    );

    // Send to analytics
    if (window.gtag) {
      window.gtag("event", "page_view", {
        web_vitals: {
          largest_contentful_paint: startTime.toFixed(2),
        },
      });
    }

    // Dispatch custom event for app monitoring
    window.dispatchEvent(
      new CustomEvent("lcp-metric", {
        detail: {
          name: "LCP",
          value: startTime,
          category: category,
          element: this.lcpData.element,
        },
      })
    );
  }

  getMetrics() {
    return this.lcpData;
  }
}

const lcpMonitor = new LCPMonitor();
export default lcpMonitor;
```

#### 4.2 Add LCP Monitor to App

**File: `src/App.jsx` (Add to imports)**

```jsx
import lcpMonitor from "./utils/lcpMonitor";

// In useEffect after performance monitoring init:
useEffect(() => {
  // Initialize LCP monitoring
  lcpMonitor.init();

  // Get LCP metrics after load
  window.addEventListener("load", () => {
    setTimeout(() => {
      console.log("📊 LCP Metrics:", lcpMonitor.getMetrics());
    }, 5000);
  });

  return () => {
    window.removeEventListener("load", () => {});
  };
}, []);
```

---

### **PHASE 5: Server-Side Optimizations**

#### 5.1 Update nginx.conf for caching

**File: `nginx.conf`**

```nginx
# Cache images for LCP (hero banner)
location ~* ^/Images/home/hero-banner {
    expires 30d;
    add_header Cache-Control "public, immutable";
    add_header X-Content-Type-Options "nosniff";
}

# Compress images and fonts
gzip on;
gzip_types image/webp image/jpeg image/png font/woff font/woff2;
gzip_comp_level 6;

# Enable Brotli compression (better than gzip)
brotli on;
brotli_types image/webp image/jpeg image/png font/woff font/woff2;
```

#### 5.2 Docker Optimization

**File: `Dockerfile`**

```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:prod

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

# Serve with compression
RUN npm install -g serve compression

CMD ["serve", "-s", "build", "-l", "3000"]
```

---

## 📈 Expected Results

### Before LCP Optimization

- LCP: **10,270 ms** ❌
- Lighthouse Score: **Poor**

### After Phase 1-2 (Quick Wins)

- LCP: **4,000-6,000 ms** (40% improvement)
- Expected time: **1-2 days**

### After Phase 3-4 (Image & Monitoring)

- LCP: **2,500-3,500 ms** (65% improvement)
- Expected time: **3-4 days**

### After Phase 5 (Full Stack)

- LCP: **1,500-2,000 ms** (80%+ improvement) ✅
- Expected time: **5-7 days**

---

## 🔍 Testing & Verification

### Local Testing

```bash
# Run local build
npm run build:prod
npm start

# Test with Lighthouse
npx lighthouse http://localhost:3000 --view
```

### Chrome DevTools

1. Open DevTools → Lighthouse
2. Run Performance Audit
3. Check LCP element in "Opportunities"
4. Monitor Core Web Vitals

### Command Line Testing

```bash
# Install lighthouse CLI
npm install -g lighthouse

# Test with mobile throttling
lighthouse https://yourdomain.com --emulated-form-factor=mobile --view
```

---

## ✅ Implementation Checklist

- [ ] Phase 1.1: Add hero image preloading
- [ ] Phase 1.2: Create hero image variants (WebP + JPEG)
- [ ] Phase 2.1: Create skeleton component for hero
- [ ] Phase 2.2: Optimize Home.jsx data fetching
- [ ] Phase 3.1: Create OptimizedHeroImage component
- [ ] Phase 3.2: Update Section01 component
- [ ] Phase 4.1: Add LCP monitoring utility
- [ ] Phase 4.2: Integrate into App.jsx
- [ ] Phase 5.1: Update nginx.conf
- [ ] Phase 5.2: Optimize Dockerfile
- [ ] Run Lighthouse audit
- [ ] Test on real devices
- [ ] Monitor production metrics

---

## 📞 Support

For questions or issues during implementation:

1. Check console logs for LCP element identification
2. Use Chrome DevTools Performance tab
3. Review Lighthouse report recommendations
4. Check `window.getPerformanceSummary()` in console (dev mode)

---

**Last Updated**: October 20, 2025  
**Status**: Ready for Implementation  
**Priority**: CRITICAL 🔴
