/**
 * Real User Monitoring (RUM) System
 * Tracks real user performance and behavior analytics
 */

class RealUserMonitoring {
  constructor(config = {}) {
    this.config = {
      endpoint: config.endpoint || '/api/analytics/rum',
      sampleRate: config.sampleRate || 0.1, // Sample 10% of users
      maxBatchSize: config.maxBatchSize || 10,
      flushInterval: config.flushInterval || 30000, // 30 seconds
      enableErrorTracking: config.enableErrorTracking !== false,
      enableUserTimings: config.enableUserTimings !== false,
      enableResourceTimings: config.enableResourceTimings !== false,
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.batch = [];
    this.userInteractions = [];
    this.pageLoadStartTime = performance.now();
    
    // Initialize if sampling allows
    if (Math.random() < this.config.sampleRate) {
      this.init();
    }
  }

  init() {
    this.collectDeviceInfo();
    this.setupPerformanceObservers();
    this.setupErrorTracking();
    this.setupUserInteractionTracking();
    this.setupPageVisibilityTracking();
    this.setupNetworkInfoTracking();
    this.startBatchTimer();
    
    // Track page load
    window.addEventListener('load', () => {
      this.trackPageLoad();
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackVisibilityChange();
    });
  }

  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getUserId() {
    // Try to get user ID from localStorage or generate anonymous ID
    let userId = localStorage.getItem('rum_user_id');
    if (!userId) {
      userId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('rum_user_id', userId);
    }
    return userId;
  }

  collectDeviceInfo() {
    this.deviceInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection: this.getConnectionInfo(),
      memory: this.getMemoryInfo()
    };
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    return null;
  }

  getMemoryInfo() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  setupPerformanceObservers() {
    // Core Web Vitals
    this.observeWebVitals();
    
    // Navigation timing
    this.observeNavigation();
    
    // Resource timing
    if (this.config.enableResourceTimings) {
      this.observeResources();
    }
    
    // User timing
    if (this.config.enableUserTimings) {
      this.observeUserTimings();
    }
    
    // Long tasks
    this.observeLongTasks();
  }

  observeWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.trackMetric('LCP', {
            value: lastEntry.startTime,
            element: lastEntry.element?.tagName || 'unknown',
            url: lastEntry.url || '',
            size: lastEntry.size || 0,
            renderTime: lastEntry.renderTime || lastEntry.loadTime,
            rating: this.getWebVitalRating('LCP', lastEntry.startTime)
          });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported:', e);
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            const fid = entry.processingStart - entry.startTime;
            
            this.trackMetric('FID', {
              value: fid,
              eventType: entry.name,
              startTime: entry.startTime,
              processingStart: entry.processingStart,
              duration: entry.duration,
              rating: this.getWebVitalRating('FID', fid)
            });
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported:', e);
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              const firstSessionEntry = sessionEntries[0];
              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
              
              if (sessionValue &&
                  entry.startTime - lastSessionEntry.startTime < 1000 &&
                  entry.startTime - firstSessionEntry.startTime < 5000) {
                sessionValue += entry.value;
                sessionEntries.push(entry);
              } else {
                sessionValue = entry.value;
                sessionEntries = [entry];
              }
              
              if (sessionValue > clsValue) {
                clsValue = sessionValue;
                
                this.trackMetric('CLS', {
                  value: clsValue,
                  entries: sessionEntries.length,
                  sources: sessionEntries.map(e => ({
                    node: e.sources?.[0]?.node?.tagName || 'unknown',
                    previousRect: e.sources?.[0]?.previousRect,
                    currentRect: e.sources?.[0]?.currentRect
                  })),
                  rating: this.getWebVitalRating('CLS', clsValue)
                });
              }
            }
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported:', e);
      }
    }
  }

  observeNavigation() {
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          this.trackMetric('Navigation', {
            type: entry.type,
            redirectCount: entry.redirectCount,
            timing: {
              dns: entry.domainLookupEnd - entry.domainLookupStart,
              connection: entry.connectEnd - entry.connectStart,
              ssl: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
              request: entry.responseStart - entry.requestStart,
              response: entry.responseEnd - entry.responseStart,
              domParsing: entry.domContentLoadedEventStart - entry.responseEnd,
              resourceLoading: entry.loadEventStart - entry.domContentLoadedEventStart,
              total: entry.loadEventEnd - entry.navigationStart
            },
            ttfb: entry.responseStart - entry.requestStart,
            redirects: entry.redirectCount
          });
        });
      });
      
      try {
        navObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.warn('Navigation observer not supported:', e);
      }
    }
  }

  observeResources() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach(entry => {
          const resourceType = this.getResourceType(entry.name);
          
          this.trackMetric('Resource', {
            name: entry.name,
            type: resourceType,
            duration: entry.duration,
            size: entry.transferSize || 0,
            cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
            timing: {
              dns: entry.domainLookupEnd - entry.domainLookupStart,
              connection: entry.connectEnd - entry.connectStart,
              ssl: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
              request: entry.responseStart - entry.requestStart,
              response: entry.responseEnd - entry.responseStart
            }
          });
        });
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.warn('Resource observer not supported:', e);
      }
    }
  }

  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach(entry => {
          this.trackMetric('LongTask', {
            duration: entry.duration,
            startTime: entry.startTime,
            attribution: entry.attribution?.[0]?.containerType || 'unknown',
            name: entry.attribution?.[0]?.containerName || '',
            blocking: entry.duration - 50 // Anything over 50ms is blocking
          });
        });
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task observer not supported:', e);
      }
    }
  }

  setupErrorTracking() {
    if (!this.config.enableErrorTracking) return;

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });
  }

  setupUserInteractionTracking() {
    const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart'];
    
    interactionEvents.forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        this.trackUserInteraction({
          type: eventType,
          target: event.target.tagName,
          timestamp: performance.now(),
          x: event.clientX || 0,
          y: event.clientY || 0
        });
      }, { passive: true });
    });
  }

  setupPageVisibilityTracking() {
    let startTime = performance.now();
    
    document.addEventListener('visibilitychange', () => {
      const now = performance.now();
      
      if (document.hidden) {
        this.trackMetric('PageVisibility', {
          state: 'hidden',
          visibleTime: now - startTime,
          timestamp: now
        });
      } else {
        startTime = now;
        this.trackMetric('PageVisibility', {
          state: 'visible',
          timestamp: now
        });
      }
    });
  }

  setupNetworkInfoTracking() {
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.trackMetric('Connection', {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          saveData: navigator.connection.saveData,
          timestamp: performance.now()
        });
      });
    }
  }

  getResourceType(url) {
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(js)$/)) return 'script';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    if (url.match(/\.(mp4|webm|ogg)$/)) return 'video';
    if (url.match(/\.(mp3|wav|ogg)$/)) return 'audio';
    return 'other';
  }

  getWebVitalRating(metric, value) {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 }
    };
    
    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  trackMetric(name, data) {
    this.addToBatch('metric', {
      name,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      referrer: document.referrer
    });
  }

  trackError(error) {
    this.addToBatch('error', {
      ...error,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      device: this.deviceInfo
    });
  }

  trackUserInteraction(interaction) {
    // Throttle interactions to avoid spam
    const now = performance.now();
    const lastInteraction = this.userInteractions[this.userInteractions.length - 1];
    
    if (!lastInteraction || now - lastInteraction.timestamp > 100) {
      this.userInteractions.push(interaction);
      
      // Keep only last 50 interactions
      if (this.userInteractions.length > 50) {
        this.userInteractions = this.userInteractions.slice(-50);
      }
    }
  }

  trackPageLoad() {
    const loadTime = performance.now() - this.pageLoadStartTime;
    
    this.trackMetric('PageLoad', {
      loadTime,
      deviceInfo: this.deviceInfo,
      interactions: this.userInteractions.length,
      memoryUsage: this.getMemoryInfo()
    });
  }

  trackVisibilityChange() {
    this.trackMetric('VisibilityChange', {
      hidden: document.hidden,
      visibilityState: document.visibilityState,
      timestamp: performance.now()
    });
  }

  addToBatch(type, data) {
    this.batch.push({ type, ...data });
    
    if (this.batch.length >= this.config.maxBatchSize) {
      this.flush();
    }
  }

  startBatchTimer() {
    setInterval(() => {
      if (this.batch.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  flush(isUnloading = false) {
    if (this.batch.length === 0) return;
    
    const data = {
      batch: [...this.batch],
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.batch = [];
    
    if (isUnloading && 'sendBeacon' in navigator) {
      // Use sendBeacon for unload events
      navigator.sendBeacon(this.config.endpoint, JSON.stringify(data));
    } else {
      // Use fetch for regular sends
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: isUnloading
      }).catch(error => {
        console.warn('Failed to send RUM data:', error);
      });
    }
  }

  // Public API
  trackCustomEvent(name, data) {
    this.trackMetric('CustomEvent', { name, data });
  }

  setUser(userId, attributes = {}) {
    this.userId = userId;
    localStorage.setItem('rum_user_id', userId);
    
    this.trackMetric('UserIdentified', {
      userId,
      attributes
    });
  }

  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      deviceInfo: this.deviceInfo,
      interactions: this.userInteractions.length,
      batchSize: this.batch.length
    };
  }
}

// Auto-initialize RUM
const rum = new RealUserMonitoring({
  endpoint: process.env.REACT_APP_RUM_ENDPOINT || '/api/analytics/rum',
  sampleRate: parseFloat(process.env.REACT_APP_RUM_SAMPLE_RATE) || 0.1,
  enableErrorTracking: true,
  enableUserTimings: true,
  enableResourceTimings: false // Disable in production to reduce data volume
});

export default rum;