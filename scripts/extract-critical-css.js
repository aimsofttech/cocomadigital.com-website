const critical = require('critical');
const fs = require('fs').promises;
const path = require('path');

/**
 * Phase 5 Critical CSS Extraction Utility
 * Conservative approach - extract and inline critical CSS safely
 */
class CriticalCSSExtractor {
  constructor() {
    this.buildDir = 'build';
    this.criticalDir = 'build/critical';
    this.viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1200, height: 800 }  // Desktop
    ];
  }

  /**
   * Extract critical CSS for homepage
   */
  async extractHomepageCritical() {
    console.log('🎯 Extracting critical CSS for homepage...');
    
    try {
      await fs.mkdir(this.criticalDir, { recursive: true });
      
      const result = await critical.generate({
        inline: false, // Conservative: don't auto-inline
        base: this.buildDir,
        src: 'index.html',
        dest: 'critical/homepage-critical.css',
        width: 375,
        height: 667,
        dimensions: this.viewports,
        
        // Conservative settings
        extract: false, // Don't remove CSS from original files
        minify: true,
        ignore: {
          atrule: ['@font-face'],
          rule: [/\.sr-only/], // Skip screen reader only styles
          decl: function(node, value) {
            // Skip complex animations for critical path
            return /animation|transition/.test(node.prop);
          }
        },
        
        // Include important selectors
        include: [
          /header/,
          /nav/,
          /hero/,
          /\.btn/,
          /\.container/,
          /\.row/,
          /\.col/
        ],
        
        // Exclude non-critical selectors
        exclude: [
          /footer/,
          /\.modal/,
          /\.tooltip/,
          /\.carousel/,
          /\.offcanvas/
        ]
      });

      console.log('✅ Homepage critical CSS extracted');
      return result;
    } catch (error) {
      console.error('❌ Critical CSS extraction failed:', error);
      throw error;
    }
  }

  /**
   * Extract critical CSS for key pages
   */
  async extractPageCritical() {
    console.log('📄 Extracting critical CSS for key pages...');
    
    const pages = [
      { name: 'about', path: '/about' },
      { name: 'services', path: '/services' },
      { name: 'contact', path: '/contact' }
    ];

    try {
      for (const page of pages) {
        await critical.generate({
          inline: false,
          base: this.buildDir,
          src: 'index.html',
          dest: `critical/${page.name}-critical.css`,
          url: `http://localhost:3000${page.path}`,
          width: 375,
          height: 667,
          dimensions: this.viewports,
          minify: true,
          extract: false, // Conservative approach
          
          // Page-specific includes
          include: this.getPageSpecificIncludes(page.name)
        });
        
        console.log(`✅ ${page.name} critical CSS extracted`);
      }
    } catch (error) {
      console.error('❌ Page critical CSS extraction failed:', error);
      // Don't throw - this is optional enhancement
    }
  }

  /**
   * Get page-specific CSS selectors to include
   */
  getPageSpecificIncludes(pageName) {
    const baseIncludes = [
      /header/,
      /nav/,
      /\.btn/,
      /\.container/,
      /\.row/,
      /\.col/
    ];

    const pageSpecific = {
      about: [
        /\.about/,
        /\.team/,
        /\.mission/
      ],
      services: [
        /\.service/,
        /\.feature/,
        /\.pricing/
      ],
      contact: [
        /\.contact/,
        /\.form/,
        /\.map/
      ]
    };

    return [...baseIncludes, ...(pageSpecific[pageName] || [])];
  }

  /**
   * Generate critical CSS loading script
   */
  async generateCriticalLoader() {
    console.log('🔧 Generating critical CSS loader...');
    
    const loaderScript = `
/**
 * Phase 5 Critical CSS Loader
 * Conservative approach - load critical CSS with fallbacks
 */
(function() {
  'use strict';
  
  // Check if critical CSS is already loaded
  if (document.querySelector('[data-critical-css]')) {
    return;
  }
  
  // Create and inject critical CSS
  function loadCriticalCSS(cssText, identifier) {
    const style = document.createElement('style');
    style.setAttribute('data-critical-css', identifier);
    style.innerHTML = cssText;
    
    // Insert before any existing stylesheets
    const firstLink = document.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      document.head.insertBefore(style, firstLink);
    } else {
      document.head.appendChild(style);
    }
  }
  
  // Load page-specific critical CSS
  function loadPageCritical() {
    const page = window.location.pathname.split('/')[1] || 'homepage';
    const criticalPath = '/critical/' + page + '-critical.css';
    
    fetch(criticalPath)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        // Fallback to homepage critical CSS
        return fetch('/critical/homepage-critical.css').then(r => r.text());
      })
      .then(css => {
        loadCriticalCSS(css, page);
        
        // Mark critical CSS as loaded
        document.documentElement.setAttribute('data-critical-loaded', 'true');
        
        // Trigger custom event for other scripts
        window.dispatchEvent(new CustomEvent('criticalCSSLoaded', {
          detail: { page: page }
        }));
      })
      .catch(error => {
        console.warn('Critical CSS loading failed:', error);
        // Continue without critical CSS - graceful degradation
      });
  }
  
  // Load critical CSS immediately for better performance
  loadPageCritical();
  
  // Preload critical CSS for common pages
  function preloadPageCritical() {
    const commonPages = ['about', 'services', 'contact'];
    
    commonPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/critical/' + page + '-critical.css';
      document.head.appendChild(link);
    });
  }
  
  // Preload after initial page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadPageCritical);
  } else {
    preloadPageCritical();
  }
})();
`;

    try {
      await fs.writeFile(
        path.join(this.criticalDir, 'critical-loader.js'),
        loaderScript
      );
      
      console.log('✅ Critical CSS loader generated');
    } catch (error) {
      console.error('❌ Critical loader generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate async CSS loading utility
   */
  async generateAsyncCSSLoader() {
    console.log('⚡ Generating async CSS loader...');
    
    const asyncLoader = `
/**
 * Async CSS Loading Utility
 * Load non-critical CSS asynchronously
 */
function loadCSSAsync(href, media = 'all') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print'; // Load as print first (doesn't block render)
  
  link.onload = function() {
    this.media = media; // Switch to target media after load
  };
  
  // Fallback for older browsers
  setTimeout(function() {
    link.media = media;
  }, 3000);
  
  document.head.appendChild(link);
  return link;
}

// Load non-critical CSS after page load
window.addEventListener('load', function() {
  // Load component-specific CSS asynchronously
  const nonCriticalCSS = [
    '/static/css/components.css',
    '/static/css/animations.css',
    '/static/css/print.css'
  ];
  
  nonCriticalCSS.forEach(href => {
    if (document.querySelector('link[href="' + href + '"]')) {
      return; // Already loaded
    }
    loadCSSAsync(href);
  });
});

// Export for use in other scripts
window.loadCSSAsync = loadCSSAsync;
`;

    try {
      await fs.writeFile(
        path.join(this.criticalDir, 'async-css-loader.js'),
        asyncLoader
      );
      
      console.log('✅ Async CSS loader generated');
    } catch (error) {
      console.error('❌ Async CSS loader generation failed:', error);
      throw error;
    }
  }

  /**
   * Run complete critical CSS extraction
   */
  async extractAll() {
    console.log('🚀 Starting Phase 5 Critical CSS Extraction (Conservative)...');
    
    try {
      await this.extractHomepageCritical();
      await this.extractPageCritical();
      await this.generateCriticalLoader();
      await this.generateAsyncCSSLoader();
      
      console.log('🎉 Phase 5 Critical CSS Extraction Complete!');
      console.log('Next steps:');
      console.log('1. Update HTML template to include critical CSS loader');
      console.log('2. Implement async CSS loading for non-critical styles');
      console.log('3. Test critical CSS on various devices and connections');
      
    } catch (error) {
      console.error('💥 Critical CSS extraction failed:', error);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const extractor = new CriticalCSSExtractor();
  extractor.extractAll();
}

module.exports = CriticalCSSExtractor;