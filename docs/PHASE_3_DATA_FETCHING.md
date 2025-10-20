# ⚡ PHASE 3: Data Fetching & Skeleton Loading (1-2 days)

## Full Stack LCP Optimization - Rendering & API Optimization

---

## 📊 Phase 3 Objectives

| Objective       | Details                                     |
| --------------- | ------------------------------------------- |
| **Current LCP** | ~3,500ms (from Phase 2)                     |
| **Target LCP**  | ~2,500ms (additional 10% improvement)       |
| **Focus**       | Defer API calls, implement skeleton loaders |
| **Root Cause**  | Home.jsx API blocks Section01 rendering     |
| **Time**        | 1-2 days                                    |

---

## 🎯 Phase 3 Strategy

```
CURRENT PROBLEM (Blocking Render):
┌─────────────────────────────────┐
│ Page Load Starts                 │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Wait for API: fetchHomeData()    │ ⏳ ~3000-5000ms
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ API Response Received            │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Section01 (Hero) Renders         │ ← LCP Element
└──────────────┬──────────────────┘
               │
               ▼
            ~3500ms LCP

PHASE 3 SOLUTION (Deferred Loading):
┌─────────────────────────────────┐
│ Page Load Starts                 │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Render Hero with Default State   │ ← LCP Element (No API Wait!)
└──────────────┬──────────────────┘
               │
               ▼  ~500-800ms LCP ✅
┌─────────────────────────────────┐
│ Fetch API in Background          │ ⏳ Continues in background
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ API Response Received            │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│ Update Hero with Real Data       │
└──────────────┬──────────────────┘
```

---

## 🔍 Problem Analysis

### Current Code (Blocking)

```jsx
// src/Pages/Home/Home.jsx
export default function Home() {
  const [homeData, setHomeData] = useState({}); // ❌ Empty initially

  // ❌ BLOCKING: Waits for API before rendering
  useEffect(() => {
    const fetchHomeData = async () => {
      const response = await adminServiceInstance?.Home(language);
      setHomeData(response?.data?.data);
    };
    fetchHomeData();
  }, [language]);

  // ❌ Section01 only renders when homeData has data
  return (
    <>
      {homeData?.top_banner && <Section01 bannerData={homeData?.top_banner} />}
      {/* ... rest of page ... */}
    </>
  );
}

// Problem: User sees blank screen for 3-5 seconds while API loads
// LCP: ~3,500ms (waiting for API + rendering)
```

### Why This Blocks LCP

```javascript
// Timeline:
0ms     ┐ Page load starts
        │
500ms   │ HTML parsed, CSS loaded
        │
1000ms  │ React renders
        │
1500ms  │ Home.jsx starts, initiates API call
        │
3500ms  │ API response arrives
        │
3600ms  │ Section01 renders (LCP!)
        │
3700ms  ┘ Paint complete

Problem: LCP waits for API (3000+ ms delay)
Solution: Render immediately with default data, fetch in background
```

---

## ✅ Phase 3 Implementation

### Task 1: Update Home.jsx with Default State (30 min)

#### Step 1: Add Default Hero Data

```jsx
// File: src/Pages/Home/Home.jsx

// Add at the top of the file after imports:
const DEFAULT_HERO_DATA = {
  top_banner: {
    heading: "Digital Innovation & Growth",
    sub_heading: "Transform Your Business with Cutting-Edge Digital Solutions",
    banner_button_text: "Get Started",
    banner_video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Optional fallback
    book_call_template_id: 1, // Default value
  },
};

// This provides immediate content to prevent blank screen
```

#### Step 2: Initialize State with Default

```jsx
// BEFORE (Blocking):
const [homeData, setHomeData] = useState({});

// AFTER (Non-blocking):
const [homeData, setHomeData] = useState(DEFAULT_HERO_DATA);
//                                      ↑ Renders immediately!
```

#### Complete Updated Code:

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

// Critical above-the-fold components
import Section01 from "../../components/Home/Section01/section01";
import Section02 from "../../components/Home/section02";

// Lazy load below-the-fold components
const ExploreOurServices = lazy(() =>
  import("../../components/Home/ExploreServices/services")
);
const Section04 = lazy(() =>
  import("../../components/Home/Section04/section04")
);
const Section05 = lazy(() =>
  import("../../components/Home/Section05/section05")
);
const Section06 = lazy(() =>
  import("../../components/Home/Section06/section06")
);
const Section07 = lazy(() =>
  import("../../components/Home/Section07/section07")
);
const Section08 = lazy(() =>
  import("../../components/Home/Section08/section08")
);
const Section09 = lazy(() =>
  import("../../components/Home/Section09/Section09")
);
const Section12 = lazy(() =>
  import("../../components/Home/Section12/section12")
);
const BusinessCareerSection = lazy(() =>
  import("../../components/Home/section14/section14")
);

// PHASE 3: Default hero data for immediate rendering (no API wait)
const DEFAULT_HERO_DATA = {
  top_banner: {
    heading: "Digital Innovation & Growth",
    sub_heading: "Transform Your Business with Cutting-Edge Digital Solutions",
    banner_button_text: "Get Started",
    banner_video_url: "", // Will be replaced when API data loads
    book_call_template_id: 1,
    id: "default",
  },
};

export default function Home() {
  // PHASE 3: Initialize with DEFAULT_HERO_DATA (renders immediately)
  const [homeData, setHomeData] = useState(DEFAULT_HERO_DATA);
  const [allCategories, setAllCategories] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const language = useSelector((state) => state?.lang?.lang);

  // PHASE 3: Fetch home data in background (non-blocking)
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const response = await adminServiceInstance?.Home(language);

        // Only update if we got data
        if (response?.data?.data) {
          setHomeData(response?.data?.data);
        }
      } catch (err) {
        console.error("API Error:", err);
        // Keep default data if API fails
        setError(err?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [language]);

  // Fetch all categories for sections
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await adminServiceInstance?.homeAllCategories();
        if (response?.data?.data) {
          setAllCategories(response?.data?.data);
        }
      } catch (err) {
        console.error("Categories API Error:", err);
        setError(err?.message || "Something went wrong");
      }
    };

    fetchAllCategories();
  }, [language]);

  // Don't show skeleton for hero anymore (using default data)
  // Only show error if critical
  if (error && !homeData?.top_banner) {
    return <p className="text-danger">Error: {error}</p>;
  }

  return (
    <>
      <div className="home-main-wraper">
        <div className="home-main">
          {/* PHASE 3: Hero renders immediately with default data */}
          {/* No API wait = LCP ~500-800ms instead of ~3500ms */}
          <Section01 bannerData={homeData?.top_banner} />

          <Section02 />

          {/* Below-the-fold content loads lazily */}
          <Suspense fallback={<SkeletonServicesGrid count={6} />}>
            <ExploreOurServices />
          </Suspense>

          {homeData?.other_service && (
            <Suspense fallback={<SkeletonCard count={3} />}>
              <Section04 ServicesToShow={homeData?.other_service} />
            </Suspense>
          )}

          {homeData?.video && (
            <Suspense fallback={<SkeletonCard count={1} />}>
              <Section05 VideoData={homeData?.video} />
            </Suspense>
          )}

          <Suspense fallback={<SkeletonCard count={2} />}>
            <Section06 />
          </Suspense>

          {homeData?.client && (
            <Suspense fallback={<SkeletonCard count={4} />}>
              <Section07 ClientData={homeData?.client} />
            </Suspense>
          )}

          <Suspense fallback={<SkeletonCard count={3} />}>
            <Section08
              marketingHouseCategory={allCategories?.marketing_house_category}
            />
          </Suspense>

          <Suspense fallback={<SkeletonCard count={3} />}>
            <Section09
              creativeHouseCategory={allCategories?.creative_house_category}
            />
          </Suspense>

          {homeData?.top_banner?.book_call_template_id && (
            <div className="home-book-call-container-wraper">
              <div className="home-book-call-container">
                <Suspense fallback={<SkeletonCard count={1} />}>
                  <Section12
                    templateId={homeData?.top_banner?.book_call_template_id}
                  />
                </Suspense>
              </div>
            </div>
          )}

          <Suspense fallback={<SkeletonCard count={1} />}>
            <BusinessCareerSection />
          </Suspense>
        </div>
      </div>
    </>
  );
}
```

### Task 2: Implement Skeleton Loader for Below-Fold (30 min)

The skeleton loaders are already implemented in your codebase:

```javascript
// File: src/components/common/Skeleton/Skeleton.jsx
// Already includes:
// ✅ SkeletonHeroBanner
// ✅ SkeletonServicesGrid
// ✅ SkeletonCard
// ✅ PageLoader
```

These are already used in the updated code above with `Suspense` fallback.

### Task 3: Add Loading State Indicator (Optional, 15 min)

```jsx
// Add a subtle loading indicator at the top
// File: src/Pages/Home/Home.jsx

// Add this near the return statement to show data is loading:
{
  isLoading && (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #007bff, #0056b3)",
        animation: "slideIn 1.5s ease-in-out infinite",
        zIndex: 9999,
      }}
    />
  );
}

// Add to your CSS file:
/*
@keyframes slideIn {
  0% { width: 0; }
  50% { width: 100%; }
  100% { width: 100%; opacity: 0; }
}
*/
```

---

## 🧪 Phase 3 Testing

### Test 1: Verify Hero Renders Immediately

```javascript
// In Browser Console:
// Test 1: Check if Section01 renders without waiting
// Expected: Hero section visible within 500ms

// Check timestamp:
console.time("hero-render");
// In Chrome DevTools Performance tab:
// Look for Section01 paint event
// Should occur at 500-800ms mark (not 3500ms)
```

### Test 2: Monitor API Loading

```javascript
// In Browser Console:
window.addEventListener("load", () => {
  console.log("Page fully loaded at:", new Date().getTime());

  // Check network timing
  const perfData = performance.getEntriesByType("resource");
  const apiCalls = perfData.filter((r) => r.name.includes("api"));
  console.log(
    "API calls:",
    apiCalls.map((a) => ({
      name: a.name,
      duration: a.duration.toFixed(0) + "ms",
    }))
  );
});
```

### Test 3: Run Lighthouse Audit

```javascript
// After making changes:
1. npm start (if not already running)
2. Open http://localhost:3000
3. Press F12 → Lighthouse tab
4. Select "Mobile"
5. Click "Analyze page load"

Expected Results:
├─ LCP: ~2,500ms ✅ (down from 3,500ms)
├─ Improvement: 28% additional reduction
└─ Hero should show immediately (no skeleton delay)
```

### Test 4: Verify Default Data Fallback

```javascript
// Test what happens if API fails:
1. Go to http://localhost:3000
2. Open DevTools → Network tab
3. Simulate offline (check "Offline" checkbox)
4. Reload page

Expected:
├─ Hero section still visible (with default data)
├─ Other sections show skeleton
├─ Error message might appear (optional)
└─ Page doesn't crash
```

---

## 📊 Expected Performance Improvement

### Before Phase 3

```javascript
LCP Timeline:
├─ 0ms     Page load
├─ 500ms   React renders
├─ 1500ms  API call initiated
├─ 3500ms  API response (SLOW)
├─ 3600ms  Section01 renders (LCP!)
└─ 3700ms  Paint complete
Result: LCP = 3,500ms
```

### After Phase 3

```javascript
LCP Timeline:
├─ 0ms     Page load
├─ 500ms   React renders
├─ 550ms   Section01 renders with DEFAULT_HERO_DATA (LCP!)
├─ 600ms   Paint complete
└─ [API still loading in background]
Result: LCP = ~500-800ms
Improvement: 77% faster! 🎉
```

### Total Improvement So Far

```
Original:  10,270ms
Phase 1:   -46% →  5,500ms
Phase 2:   -25% →  3,500ms
Phase 3:   -28% →  2,500ms ✅

Total: 76% improvement from original! 🎊
```

---

## 💡 Why This Works

### Rendering Priority

```javascript
// React renders in this order:
1. Critical (above fold):
   - Header
   - Section01 (hero) ← LCP Element
   - Section02 (brands)

2. Suspense boundaries (below fold):
   - Section04-14 render when visible
   - Skeleton shows while loading
   - Real component replaces skeleton when ready

// Result: Fast LCP + Progressive Enhancement
```

### Data Strategy

```javascript
// Smart data fetching:
- DEFAULT data: Renders immediately (fast)
- Real API data: Fetches in background (complete)
- If API fails: Default still works (fallback)
- User sees content immediately, gets updates as they load
```

---

## 🔧 Implementation Checklist

### Pre-Implementation

- [ ] Backup Home.jsx (copy file)
- [ ] Review code changes above
- [ ] Understand default state concept

### Implementation

- [ ] Add DEFAULT_HERO_DATA constant
- [ ] Change useState initialization
- [ ] Update fetchHomeData effect
- [ ] Verify Suspense boundaries
- [ ] Save file and commit

### Testing

- [ ] Dev server starts without errors
- [ ] Hero renders immediately
- [ ] No console errors
- [ ] Network tab shows API loading in background
- [ ] Lighthouse LCP: ~2,500ms
- [ ] Offline mode: Default data shows
- [ ] Real data loads when API responds

### Verification

- [ ] Take Lighthouse screenshots
- [ ] Document LCP improvement
- [ ] Verify no regressions
- [ ] Test on mobile device

---

## ⚠️ Important Notes

### Safe Changes

✅ These changes are safe because:

- Default data is always available
- API updates UI when ready
- No breaking changes
- Backward compatible with existing styles

### What You're NOT Changing

- Component structure
- CSS styling
- Video overlay
- Navigation
- Footer

### What You ARE Changing

- Initial state (fills with default instead of empty)
- Loading behavior (non-blocking instead of blocking)
- User experience (sees hero immediately)

---

## 📋 Phase 3 Summary

| Aspect            | Details                                     |
| ----------------- | ------------------------------------------- |
| **Time**          | 1-2 hours implementation + 30 min testing   |
| **File Modified** | `src/Pages/Home/Home.jsx` (1 file)          |
| **LCP Before**    | ~3,500ms                                    |
| **LCP After**     | ~2,500ms ✅                                 |
| **Improvement**   | 28% additional (76% total)                  |
| **Key Change**    | Use default data instead of waiting for API |
| **Risk Level**    | Very Low (non-breaking change)              |
| **Rollback Time** | < 2 minutes (revert file)                   |

---

## 🎯 Phase 3 Complete When:

- [ ] Home.jsx updated with DEFAULT_HERO_DATA
- [ ] Section01 renders without API wait
- [ ] LCP: ~2,500ms (Lighthouse confirms)
- [ ] All sections still load with real data
- [ ] Offline mode works with default data
- [ ] No console errors
- [ ] Testing complete

---

## 🚀 Next Phase: Phase 4 - Monitoring

Once Phase 3 is complete:

- LCP: ~2,500ms ✅ (Target met!)
- Ready for Phase 4: Performance monitoring setup
- See: `PHASE_4_MONITORING.md`

---

**Phase 3 Guide Created**: October 20, 2025  
**Estimated Completion**: 1-2 hours  
**Expected LCP After Phase 3**: ~2,500ms ✅ (TARGET REACHED!)  
**Overall Improvement**: 76% from original 10,270ms
