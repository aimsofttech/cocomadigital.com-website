/**
 * Performance Monitoring Utility
 * Tracks Core Web Vitals and custom performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isSupported = this.checkSupport();
    
    if (this.isSupported) {
      this.initializeObservers();
    }
  }

  checkSupport() {
    return typeof window !== 'undefined' &&
           'performance' in window &&
           'PerformanceObserver' in window;
  }

  initializeObservers() {
    // Core Web Vitals Observer
    this.observeWebVitals();
    
    // Navigation Timing
    this.observeNavigation();
    
    // Resource Loading
    this.observeResources();
    
    // Layout Shifts
    this.observeLayoutShifts();
    
    // Long Tasks
    this.observeLongTasks();
  }

  observeWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.recordMetric('LCP', {
          value: lastEntry.startTime,
          element: lastEntry.element?.tagName,
          url: lastEntry.url,
          timestamp: Date.now(),
          rating: this.getRating('LCP', lastEntry.startTime)
        });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const fid = entry.processingStart - entry.startTime;
        
        this.recordMetric('FID', {
          value: fid,
          eventType: entry.name,
          timestamp: Date.now(),
          rating: this.getRating('FID', fid)
        });
      });
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    } catch (e) {
      console.warn('FID observer not supported');
    }
  }

  observeNavigation() {
    const navObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const metrics = {
          dns: entry.domainLookupEnd - entry.domainLookupStart,
          connection: entry.connectEnd - entry.connectStart,
          request: entry.responseStart - entry.requestStart,
          response: entry.responseEnd - entry.responseStart,
          domParsing: entry.domContentLoadedEventStart - entry.responseEnd,
          resourceLoading: entry.loadEventStart - entry.domContentLoadedEventStart,
          total: entry.loadEventEnd - entry.navigationStart,
          timestamp: Date.now()
        };
        
        this.recordMetric('Navigation', metrics);
        
        // Time to First Byte (TTFB)
        const ttfb = entry.responseStart - entry.requestStart;
        this.recordMetric('TTFB', {
          value: ttfb,
          rating: this.getRating('TTFB', ttfb),
          timestamp: Date.now()
        });
      });
    });
    
    try {
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navObserver);
    } catch (e) {
      console.warn('Navigation observer not supported');
    }
  }

  observeResources() {
    const resourceObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      const resourceMetrics = {
        images: [],
        scripts: [],
        stylesheets: [],
        fonts: [],
        other: [],
        timestamp: Date.now()
      };
      
      entries.forEach(entry => {
        const resource = {
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize || 0,
          cached: entry.transferSize === 0 && entry.decodedBodySize > 0
        };
        
        if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          resourceMetrics.images.push(resource);
        } else if (entry.name.match(/\.js$/i)) {
          resourceMetrics.scripts.push(resource);
        } else if (entry.name.match(/\.css$/i)) {
          resourceMetrics.stylesheets.push(resource);
        } else if (entry.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
          resourceMetrics.fonts.push(resource);
        } else {
          resourceMetrics.other.push(resource);
        }
      });
      
      this.recordMetric('Resources', resourceMetrics);
    });
    
    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resources', resourceObserver);
    } catch (e) {
      console.warn('Resource observer not supported');
    }
  }

  observeLayoutShifts() {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries = [];
    
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach(entry => {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
          
          // If the entry occurred less than 1 second after the previous entry
          // and less than 5 seconds after the first entry in the session,
          // include it in the current session. Otherwise, start a new session.
          if (sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }
          
          // If the current session value is larger than the current CLS value,
          // update CLS and the entries contributing to it.
          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            
            this.recordMetric('CLS', {
              value: clsValue,
              entries: sessionEntries.length,
              timestamp: Date.now(),
              rating: this.getRating('CLS', clsValue)
            });
          }
        }
      });
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  observeLongTasks() {
    const longTaskObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach(entry => {
        this.recordMetric('LongTask', {
          duration: entry.duration,
          startTime: entry.startTime,
          attribution: entry.attribution?.[0]?.containerType || 'unknown',
          timestamp: Date.now()
        });
      });
    });
    
    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);
    } catch (e) {
      console.warn('Long task observer not supported');
    }
  }

  recordMetric(name, data) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push(data);
    
    // Emit custom event for real-time monitoring
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performance-metric', {
        detail: { name, data }
      }));
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}:`, data);
    }
  }

  getRating(metric, value) {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    };
    
    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  getMetrics() {
    const result = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  getLatestMetrics() {
    const result = {};
    this.metrics.forEach((values, key) => {
      result[key] = values[values.length - 1] || null;
    });
    return result;
  }

  getSummary() {
    const latest = this.getLatestMetrics();
    
    return {
      coreWebVitals: {
        LCP: latest.LCP,
        FID: latest.FID,
        CLS: latest.CLS
      },
      loadingPerformance: {
        TTFB: latest.TTFB,
        Navigation: latest.Navigation
      },
      userExperience: {
        longTasks: this.metrics.get('LongTask')?.length || 0,
        totalBlockingTime: this.calculateTotalBlockingTime()
      },
      resources: latest.Resources,
      timestamp: Date.now()
    };
  }

  calculateTotalBlockingTime() {
    const longTasks = this.metrics.get('LongTask') || [];
    return longTasks.reduce((total, task) => {
      return total + Math.max(0, task.duration - 50);
    }, 0);
  }

  exportData() {
    return {
      metrics: this.getMetrics(),
      summary: this.getSummary(),
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      url: window.location.href
    };
  }

  clearMetrics() {
    this.metrics.clear();
  }

  disconnect() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// Export utility functions
export const getPerformanceSummary = () => performanceMonitor.getSummary();
export const exportPerformanceData = () => performanceMonitor.exportData();
export const clearPerformanceData = () => performanceMonitor.clearMetrics();