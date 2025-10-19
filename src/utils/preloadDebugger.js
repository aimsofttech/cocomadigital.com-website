/**
 * Preload Debugging Utility
 * Helps identify which resources are being preloaded and if they exist
 */

class PreloadDebugger {
  static logPreloadAttempts() {
    // Intercept link element creation to log preload attempts
    const originalCreateElement = document.createElement.bind(document);
    
    document.createElement = function(tagName, options) {
      const element = originalCreateElement(tagName, options);
      
      if (tagName === 'link' && (element.rel === 'preload' || element.rel === 'prefetch')) {
        const href = element.getAttribute('href');
        console.log(`[Preload Debug] ${element.rel}: ${href}`);
        
        // Add logging to error handler
        if (!element.onerror) {
          element.onerror = function() {
            console.error(`[Preload Failed] ${element.rel}: ${href}`);
          };
        }
      }
      
      return element;
    };
  }
  
  static verifyPreloadLinks() {
    // Check all preload/prefetch links in the document
    const links = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"]');
    console.log(`[Preload Debug] Found ${links.length} preload/prefetch links:`);
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      console.log(`  - ${link.rel}: ${href}`);
    });
  }
  
  static init() {
    console.log('Preload Debugger initialized');
    this.logPreloadAttempts();
    
    // Run verification after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.verifyPreloadLinks();
      });
    } else {
      this.verifyPreloadLinks();
    }
  }
}

// Initialize if in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    PreloadDebugger.init();
  }
}

export default PreloadDebugger;
