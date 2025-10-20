/**
 * LCP (Largest Contentful Paint) Monitoring Utility
 * Tracks and reports LCP metrics for performance optimization
 * 
 * Features:
 * - Real-time LCP tracking
 * - Element identification
 * - Performance categorization
 * - Analytics integration
 * - Custom event dispatching
 * 
 * Usage:
 * import lcpMonitor from './utils/lcpMonitor';
 * lcpMonitor.init();
 */

class LCPMonitor {
  constructor() {
    this.lcpData = {
      element: null,
      elementClass: null,
      startTime: null,
      renderTime: null,
      loadTime: null,
      size: 0,
      url: null,
      timestamp: null
    };

    this.thresholds = {
      good: 2500,        // Good: 0-2.5s
      needsImprovement: 4000,  // Needs Improvement: 2.5-4s
      poor: Infinity     // Poor: > 4s
    };

    this.isInitialized = false;
    this.observer = null;
  }

  /**
   * Initialize LCP monitoring
   */
  init() {
    if (this.isInitialized) {
      console.warn('⚠️  LCP Monitor already initialized');
      return;
    }

    if (!('PerformanceObserver' in window)) {
      console.warn('⚠️  PerformanceObserver not supported in this browser');
      return;
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        // Update LCP data with latest entry
        this.updateLCPData(lastEntry);
        this.reportLCP();
      });

      // Start observing LCP entries
      this.observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.isInitialized = true;

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ LCP Monitor initialized');
      }

      // Stop observing after page fully loads (cleanup)
      window.addEventListener('load', () => {
        setTimeout(() => {
          if (this.observer) {
            this.observer.disconnect();
            console.log('⏹️  LCP Observer stopped');
          }
        }, 5000);
      });

    } catch (err) {
      console.error('❌ LCP Monitor initialization error:', err);
    }
  }

  /**
   * Update LCP data from PerformanceEntry
   */
  updateLCPData(entry) {
    this.lcpData = {
      element: entry.element,
      elementClass: entry.element?.className || 'unknown',
      elementTag: entry.element?.tagName || 'unknown',
      startTime: entry.startTime,
      renderTime: entry.renderTime,
      loadTime: entry.loadTime,
      size: entry.size,
      url: entry.url,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Report LCP metrics
   */
  reportLCP() {
    const { startTime, elementClass, elementTag } = this.lcpData;

    if (!startTime) return;

    // Determine category
    let status = '✅';
    let category = 'good';
    let color = 'green';

    if (startTime > this.thresholds.poor) {
      status = '❌';
      category = 'poor';
      color = 'red';
    } else if (startTime > this.thresholds.needsImprovement) {
      status = '🟡';
      category = 'needsImprovement';
      color = 'orange';
    }

    // Console logging
    const logMessage = `${status} LCP: ${startTime.toFixed(2)}ms | Element: <${elementTag} class="${elementClass}"> | Status: ${category}`;

    if (process.env.NODE_ENV === 'development') {
      console.log(logMessage);
      console.log(`   📊 Render Time: ${this.lcpData.renderTime?.toFixed(2) || 'N/A'}ms`);
      console.log(`   📦 Element Size: ${(this.lcpData.size / 1024).toFixed(2)}KB`);
      console.log(`   🔗 URL: ${this.lcpData.url || 'N/A'}`);
    }

    // Send to analytics if available
    this.sendToAnalytics({
      name: 'LCP',
      value: startTime,
      category: category,
      element: elementTag,
      elementClass: elementClass
    });

    // Dispatch custom event for app-level monitoring
    this.dispatchMetricEvent({
      name: 'LCP',
      value: startTime,
      category: category,
      element: this.lcpData.element,
      elementClass: elementClass,
      elementTag: elementTag
    });
  }

  /**
   * Send metrics to Google Analytics
   */
  sendToAnalytics(metric) {
    // Google Analytics 4
    if (window.gtag && process.env.NODE_ENV === 'production') {
      try {
        window.gtag('event', 'web_vitals', {
          'event_category': 'Web Vitals',
          'event_label': metric.name,
          'value': Math.round(metric.value),
          'metric_category': metric.category,
          'metric_element': metric.element,
          'non_interaction': true
        });
      } catch (err) {
        console.warn('⚠️  Analytics error:', err);
      }
    }

    // Custom RUM endpoint (if available)
    if (window.__RUM_ENDPOINT__) {
      this.sendToRUM(metric);
    }
  }

  /**
   * Send metrics to Real User Monitoring endpoint
   */
  sendToRUM(metric) {
    try {
      const payload = {
        metric: metric.name,
        value: metric.value,
        category: metric.category,
        element: metric.element,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // Send as beacon to avoid page unload delays
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(window.__RUM_ENDPOINT__, blob);
    } catch (err) {
      console.warn('⚠️  RUM endpoint error:', err);
    }
  }

  /**
   * Dispatch custom event for app monitoring
   */
  dispatchMetricEvent(metric) {
    try {
      window.dispatchEvent(new CustomEvent('lcp-metric', {
        detail: {
          ...metric,
          timestamp: this.lcpData.timestamp
        }
      }));
    } catch (err) {
      console.warn('⚠️  Event dispatch error:', err);
    }
  }

  /**
   * Get current LCP metrics
   */
  getMetrics() {
    return {
      ...this.lcpData,
      category: this.getCategory(this.lcpData.startTime)
    };
  }

  /**
   * Get category based on LCP value
   */
  getCategory(lcp) {
    if (!lcp) return null;
    if (lcp <= this.thresholds.good) return 'good';
    if (lcp <= this.thresholds.needsImprovement) return 'needsImprovement';
    return 'poor';
  }

  /**
   * Reset monitor
   */
  reset() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isInitialized = false;
    this.lcpData = {
      element: null,
      elementClass: null,
      startTime: null,
      renderTime: null,
      loadTime: null,
      size: 0,
      url: null,
      timestamp: null
    };
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const metrics = this.getMetrics();
    return {
      lcp: `${metrics.startTime?.toFixed(2) || 'N/A'}ms`,
      category: metrics.category || 'unknown',
      element: `<${metrics.elementTag || 'unknown'} class="${metrics.elementClass || 'unknown'}">`,
      size: metrics.size ? `${(metrics.size / 1024).toFixed(2)}KB` : 'N/A',
      url: metrics.url || 'N/A'
    };
  }
}

// Create singleton instance
const lcpMonitor = new LCPMonitor();

// Export for use in app
export default lcpMonitor;

// Also make it globally available in development
if (process.env.NODE_ENV === 'development') {
  window.__LCPMonitor__ = lcpMonitor;
}
