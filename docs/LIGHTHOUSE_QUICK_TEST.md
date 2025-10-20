# 🚀 LIGHTHOUSE TEST - QUICK START (3 Minutes)

## ⚡ THE FCP ERROR IS FIXED ✅

Your app now uses existing images. Here's how to verify it works:

---

## 🎯 3-MINUTE TEST

### Step 1: Dev Server (Already Running? Skip!)

```powershell
npm start
# Wait for "webpack compiled" message
```

### Step 2: Open Browser

```
Go to: http://localhost:3000
Wait: 5 seconds for page to load
Check: Hero image visible? ✅ Good sign!
```

### Step 3: Check Network Tab

```
F12 → Network tab
Reload: Ctrl+R
Look for: "cocoma-banner.jpg"
Status: Should be 200 (not 404)
If 404: Image path is wrong
```

### Step 4: Run Lighthouse

```
F12 → Lighthouse tab
Click: [Analyze page load]
Keep: Browser window in FOREGROUND (don't minimize!)
Wait: 60-90 seconds
```

### Step 5: Check Results

```
✅ SUCCESS if you see:
   - FCP: ~1,000-2,000ms (NOT ERROR)
   - LCP: ~3,500ms or similar
   - No red "Failed" audits

❌ PROBLEM if you see:
   - "NO_FCP" error → Keep window in foreground
   - 404 errors → Check image paths
   - Red "Failed" audits → Review console
```

---

## 📊 WHAT YOU'LL SEE

### Good Result ✅

```
First Contentful Paint (FCP): 1.2 s
Largest Contentful Paint (LCP): 3.5 s
Cumulative Layout Shift (CLS): 0.05
```

### Bad Result ❌

```
First Contentful Paint (FCP): ERROR
NO_FCP - The page did not paint any content...
```

---

## 🔥 IF YOU GET ERROR: DO THIS

**1. Hard Refresh**

```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

**2. Keep Window Active**

```
Don't minimize browser
Don't switch to other apps
Don't lock screen
Run Lighthouse again
```

**3. Check Network Tab**

```
F12 → Network tab
Reload page
Look for red 404s
If images are 404: Fix path
```

---

## 📝 WHAT TO SCREENSHOT

After Lighthouse finishes:

1. Screenshot the Lighthouse results
2. Include: FCP, LCP, and performance score
3. Send to verify Phase 1 is working

---

## 🎬 EXAMPLE (Follow Exactly)

```
Terminal:
  npm start
  ↓ (wait 10 sec)
  "webpack compiled"

Browser:
  http://localhost:3000
  ↓ (wait 5 sec)
  Page shows with hero image

DevTools:
  F12 → Lighthouse
  [Analyze page load] ← Click this
  ↓ (wait 90 sec)
  Results show...

Results Should Show:
  FCP: 1.2s ✅
  LCP: 3.5s ✅
  No errors ✅
```

---

## ✅ CHECKLIST

- [ ] npm start running
- [ ] Page loads at localhost:3000
- [ ] Hero image visible
- [ ] DevTools open (F12)
- [ ] Lighthouse tab ready
- [ ] Browser window in foreground
- [ ] Clicked "Analyze page load"
- [ ] Waited 90 seconds
- [ ] Results show FCP time (not ERROR)
- [ ] Results show LCP time
- [ ] Screenshot saved

---

## 🎉 NEXT

After you verify Lighthouse works:

1. Note your FCP and LCP values
2. Proceed to Phase 2: Create 8 responsive images
3. See: `PHASE_2_EXECUTION_GUIDE.md`

**Status:** ✅ FCP Error Fixed, Ready for Phase 2
