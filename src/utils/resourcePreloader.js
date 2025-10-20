/**
 * Resource Preloading Utility
 * Intelligently preloads critical assets for better performance
 */

class ResourcePreloader {
  constructor() {
    this.preloadedResources = new Set();
    this.preloadQueue = [];
    this.isLoading = false;
    this.maxConcurrent = 3;
    this.currentLoading = 0;
    
    this.initializeIntersectionObserver();
  }

  initializeIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const preloadUrl = element.dataset.preload;
              
              if (preloadUrl && !this.preloadedResources.has(preloadUrl)) {
                this.preloadResource(preloadUrl, element.dataset.preloadType || 'fetch');
              }
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );
    }
  }

  /**
   * Preload critical resources immediately
   */
  preloadCriticalAssets() {
    const criticalAssets = [
      // Critical logos (confirmed to exist)
      { url: '/Images/app_logo.svg', type: 'image' },
      { url: '/Images/logoWhite.svg', type: 'image' },
      { url: '/Images/developmentHouse.png', type: 'image' },
      
      // Critical fonts - will be loaded via CSS @import
      { url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap', type: 'style' }
    ];

    criticalAssets.forEach(asset => {
      this.preloadResource(asset.url, asset.type, 'high');
    });
  }

  /**
   * Preload resources for specific routes
   */
  preloadRouteAssets(routeName) {
    const routeAssets = {
      home: [
        '/Images/developmentHouse.png',
        '/Images/recent-work.svg',
        '/Images/portFolio.svg'
      ],
      about: [
        '/Images/about/aboutmainimg.svg',
        '/Images/about/aboutStory.png'
      ],
      services: [
        '/Images/web-app.svg',
        '/Images/video-production.svg',
        '/Images/VideoEditing.webp'
      ],
      blog: [
        '/Images/blog/'
      ],
      contact: [
        '/Images/bookACall.png'
      ]
    };

    const assets = routeAssets[routeName] || [];
    assets.forEach(url => {
      // Skip directory paths
      if (!url.endsWith('/')) {
        this.queuePreload(url, 'image', 'low');
      }
    });
  }

  /**
   * Preload next likely page based on user behavior
   */
  preloadLikelyNextPage() {
    const currentPath = window.location.pathname;
    const nextPagePredictions = {
      '/': ['/about', '/services'], // From home, users likely go to about or services
      '/about': ['/services', '/contact'], // From about, likely to services or contact
      '/services': ['/contact', '/blog'], // From services, likely to contact or blog
      '/blog': ['/services', '/about'], // From blog, might go to services or about
      '/contact': ['/services', '/about'] // From contact, might explore more
    };

    const likelyPages = nextPagePredictions[currentPath] || [];
    
    likelyPages.forEach(page => {
      // Preload the route chunk
      this.preloadRouteChunk(page);
      
      // Preload route-specific assets
      const routeName = page.substring(1) || 'home';
      this.preloadRouteAssets(routeName);
    });
  }

  /**
   * Preload route chunks (code-split bundles)
   */
  preloadRouteChunk(routePath) {
    const chunkMap = {
      '/': 'home',
      '/about': 'about', 
      '/services': 'services',
      '/service': 'services',
      '/blog': 'blog',
      '/contact': 'contact',
      '/solution': 'solution',
      '/creative-house': 'creative-house'
    };

    const chunkName = chunkMap[routePath];
    if (chunkName) {
      // This will be handled by React.lazy() but we can preload the chunk
      this.preloadResource(`/static/js/${chunkName}.chunk.js`, 'script', 'low');
    }
  }

  /**
   * Main preload function
   */
  preloadResource(url, type = 'fetch', priority = 'medium') {
    if (this.preloadedResources.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = this.getPreloadRel(type);
      link.href = url;
      
      if (type === 'font') {
        link.crossOrigin = 'anonymous';
      }
      
      if (type === 'image') {
        link.as = 'image';
      } else if (type === 'script') {
        link.as = 'script';
      } else if (type === 'style') {
        link.as = 'style';
      } else if (type === 'font') {
        link.as = 'font';
        link.type = 'font/woff2';
      }

      // Set priority if supported
      if ('importance' in link) {
        link.importance = priority;
      }

      link.onload = () => {
        this.preloadedResources.add(url);
        this.currentLoading--;
        this.processQueue();
        resolve();
      };

      link.onerror = () => {
        // Suppress error logging for missing resources - just fail silently
        // This prevents console spam when optional resources aren't available
        console.debug(`Resource preload skipped: ${url}`);
        this.currentLoading--;
        this.processQueue();
        // Don't reject - treat as non-critical
        resolve();
      };

      // Add to queue if too many concurrent requests
      if (this.currentLoading >= this.maxConcurrent) {
        this.preloadQueue.push({ link, url });
      } else {
        this.currentLoading++;
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Queue preload for later processing
   */
  queuePreload(url, type, priority) {
    this.preloadQueue.push({
      url,
      type,
      priority,
      timestamp: Date.now()
    });
    
    this.processQueue();
  }

  /**
   * Process preload queue
   */
  processQueue() {
    while (this.preloadQueue.length > 0 && this.currentLoading < this.maxConcurrent) {
      const item = this.preloadQueue.shift();
      
      if (item.link) {
        // Direct link element
        this.currentLoading++;
        document.head.appendChild(item.link);
      } else {
        // Queued preload request
        this.preloadResource(item.url, item.type, item.priority);
      }
    }
  }

  /**
   * Get appropriate preload rel attribute
   */
  getPreloadRel(type) {
    switch (type) {
      case 'dns':
        return 'dns-prefetch';
      case 'connect':
        return 'preconnect';
      case 'module':
        return 'modulepreload';
      default:
        return 'preload';
    }
  }

  /**
   * Preload based on user interaction hints
   */
  setupHoverPreloading() {
    const links = document.querySelectorAll('a[href^="/"]');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (href && href !== window.location.pathname) {
          this.preloadRouteChunk(href);
          
          // Preload route assets after a short delay
          setTimeout(() => {
            const routeName = href.substring(1) || 'home';
            this.preloadRouteAssets(routeName);
          }, 100);
        }
      }, { passive: true });
    });
  }

  /**
   * Setup viewport-based preloading
   */
  observeElement(element) {
    if (this.intersectionObserver && element) {
      this.intersectionObserver.observe(element);
    }
  }

  /**
   * Preload images in viewport or about to enter viewport
   */
  preloadImagesInViewport() {
    const images = document.querySelectorAll('img[data-src], [data-preload]');
    
    images.forEach(img => {
      this.observeElement(img);
    });
  }

  /**
   * Smart preloading based on connection speed
   */
  adaptToConnectionSpeed() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const effectiveType = connection.effectiveType;
      
      // Adjust preloading strategy based on connection
      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
          this.maxConcurrent = 1;
          // Only preload critical assets
          break;
        case '3g':
          this.maxConcurrent = 2;
          // Moderate preloading
          break;
        case '4g':
          this.maxConcurrent = 4;
          // Aggressive preloading
          this.preloadLikelyNextPage();
          break;
        default:
          this.maxConcurrent = 3;
      }
    }
  }

  /**
   * Initialize all preloading strategies
   */
  init() {
    // Immediate critical asset preloading
    this.preloadCriticalAssets();
    
    // Adapt to connection speed
    this.adaptToConnectionSpeed();
    
    // Setup hover preloading after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.setupHoverPreloading();
        this.preloadImagesInViewport();
        
        // Preload likely next pages for high-speed connections
        if ('connection' in navigator && 
            ['4g', 'ethernet'].includes(navigator.connection.effectiveType)) {
          this.preloadLikelyNextPage();
        }
      }, 1000);
    });
  }

  /**
   * Get preloading statistics
   */
  getStats() {
    return {
      preloadedCount: this.preloadedResources.size,
      queueLength: this.preloadQueue.length,
      currentLoading: this.currentLoading,
      maxConcurrent: this.maxConcurrent,
      preloadedResources: Array.from(this.preloadedResources)
    };
  }

  /**
   * Clear preloaded resources cache
   */
  clearCache() {
    this.preloadedResources.clear();
    this.preloadQueue = [];
    this.currentLoading = 0;
  }
}

// Create singleton instance
const resourcePreloader = new ResourcePreloader();

export default resourcePreloader;

// Auto-initialize
if (typeof window !== 'undefined') {
  resourcePreloader.init();
}