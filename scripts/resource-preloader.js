/**
 * Phase 5 Week 2: Resource Preloading Optimization
 * Implement critical resource preloading for mobile performance
 */

const fs = require('fs').promises;
const path = require('path');

class ResourcePreloader {
  constructor() {
    this.buildDir = './build';
    this.publicDir = './public';
  }

  /**
   * Analyze critical resources that should be preloaded
   */
  async analyzeCriticalResources() {
    console.log('🔍 Analyzing critical resources for preloading...');
    
    try {
      const resources = {
        fonts: [],
        images: [],
        scripts: [],
        stylesheets: [],
        recommendations: []
      };

      // Check for font files
      try {
        const fontsDir = path.join(this.publicDir, 'fonts');
        try {
          const fontFiles = await fs.readdir(fontsDir);
          resources.fonts = fontFiles.filter(f => 
            f.endsWith('.woff2') || f.endsWith('.woff') || f.endsWith('.ttf')
          ).map(f => ({
            path: `/fonts/${f}`,
            type: 'font',
            format: f.split('.').pop()
          }));
        } catch (e) {
          // No fonts directory
        }
      } catch (error) {
        // Fonts directory doesn't exist
      }

      // Identify critical images
      const criticalImagePaths = [
        '/Images/app_logo.svg',
        '/Images/logoWhite.svg',
        '/Images/home/hero-banner-1.jpg',
        '/Images/home/hero-banner-2.jpg',
        '/Images/home/about-hero.jpg'
      ];

      for (const imagePath of criticalImagePaths) {
        try {
          await fs.access(path.join(this.publicDir, imagePath.substring(1)));
          resources.images.push({
            path: imagePath,
            type: 'image',
            priority: 'high'
          });
        } catch (e) {
          // Image doesn't exist
        }
      }

      // Analyze build assets
      try {
        const jsFiles = await fs.readdir(path.join(this.buildDir, 'static/js'));
        const cssFiles = await fs.readdir(path.join(this.buildDir, 'static/css'));

        // Find main bundles for preloading
        const mainJS = jsFiles.find(f => f.startsWith('main.') && f.endsWith('.js'));
        const mainCSS = cssFiles.find(f => f.startsWith('main.') && f.endsWith('.css'));

        if (mainJS) {
          resources.scripts.push({
            path: `/static/js/${mainJS}`,
            type: 'script',
            priority: 'high'
          });
        }

        if (mainCSS) {
          resources.stylesheets.push({
            path: `/static/css/${mainCSS}`,
            type: 'style',
            priority: 'high'
          });
        }
      } catch (error) {
        console.warn('Could not analyze build assets');
      }

      this.generatePreloadRecommendations(resources);
      
      console.log('📊 Critical Resource Analysis:');
      console.log(`- Fonts: ${resources.fonts.length}`);
      console.log(`- Critical Images: ${resources.images.length}`);
      console.log(`- Scripts: ${resources.scripts.length}`);
      console.log(`- Stylesheets: ${resources.stylesheets.length}`);
      
      return resources;
    } catch (error) {
      console.error('❌ Resource analysis failed:', error);
      throw error;
    }
  }

  /**
   * Generate preload recommendations
   */
  generatePreloadRecommendations(resources) {
    const recommendations = [];

    if (resources.fonts.length > 0) {
      recommendations.push('Preload critical fonts to prevent FOIT/FOUT');
    }

    if (resources.images.length > 0) {
      recommendations.push('Preload hero images to improve LCP');
    }

    if (resources.scripts.length > 0) {
      recommendations.push('Preload main JavaScript bundle');
    }

    recommendations.push('Add DNS prefetch for external domains');
    recommendations.push('Implement modulepreload for ES modules');
    recommendations.push('Use prefetch for non-critical resources');

    resources.recommendations = recommendations;
  }

  /**
   * Generate preload HTML tags
   */
  generatePreloadTags(resources) {
    const tags = [];

    // Font preloads
    resources.fonts.forEach(font => {
      if (font.format === 'woff2') {
        tags.push(`  <link rel="preload" href="${font.path}" as="font" type="font/woff2" crossorigin>`);
      }
    });

    // Image preloads (only the most critical)
    resources.images.slice(0, 2).forEach(image => {
      tags.push(`  <link rel="preload" href="${image.path}" as="image">`);
    });

    // Script preloads
    resources.scripts.forEach(script => {
      tags.push(`  <link rel="preload" href="${script.path}" as="script">`);
    });

    // External DNS prefetch
    const externalDomains = [
      '//fonts.googleapis.com',
      '//fonts.gstatic.com',
      '//www.google-analytics.com',
      '//www.googletagmanager.com'
    ];

    externalDomains.forEach(domain => {
      tags.push(`  <link rel="dns-prefetch" href="${domain}">`);
    });

    return tags;
  }

  /**
   * Create optimized index.html with resource hints
   */
  async createOptimizedHTML(resources) {
    console.log('🛠️  Creating optimized HTML with resource preloading...');

    try {
      const indexPath = path.join(this.publicDir, 'index.html');
      let htmlContent = await fs.readFile(indexPath, 'utf8');

      // Generate preload tags
      const preloadTags = this.generatePreloadTags(resources);

      // Find the position to insert preload tags (after existing DNS prefetch)
      const insertPosition = htmlContent.indexOf('  <title>');
      
      if (insertPosition !== -1) {
        const preloadSection = `
  <!-- Phase 5 Week 2: Critical Resource Preloading -->
${preloadTags.join('\n')}
  
  <!-- Prefetch non-critical resources -->
  <link rel="prefetch" href="/Images/home/services-bg.jpg">
  <link rel="prefetch" href="/Images/home/portfolio-bg.jpg">
  
`;

        htmlContent = htmlContent.slice(0, insertPosition) + 
                     preloadSection + 
                     htmlContent.slice(insertPosition);

        // Also add to build version
        const buildIndexPath = path.join(this.buildDir, 'index.html');
        try {
          let buildHtmlContent = await fs.readFile(buildIndexPath, 'utf8');
          const buildInsertPosition = buildHtmlContent.indexOf('  <title>');
          
          if (buildInsertPosition !== -1) {
            buildHtmlContent = buildHtmlContent.slice(0, buildInsertPosition) + 
                              preloadSection + 
                              buildHtmlContent.slice(buildInsertPosition);
            
            await fs.writeFile(buildIndexPath, buildHtmlContent);
            console.log('✅ Updated build/index.html with resource preloading');
          }
        } catch (e) {
          console.warn('Could not update build/index.html - run build first');
        }

        await fs.writeFile(indexPath, htmlContent);
        console.log('✅ Updated public/index.html with resource preloading');
      }
    } catch (error) {
      console.error('❌ HTML optimization failed:', error);
      throw error;
    }
  }

  /**
   * Generate service worker resource caching strategy
   */
  async generateCachingStrategy(resources) {
    console.log('⚙️  Generating service worker caching strategy...');

    const strategy = {
      version: '1.0.0',
      phase: 'Phase 5 Week 2 - Resource Preloading',
      generatedAt: new Date().toISOString(),
      caching: {
        critical: {
          strategy: 'CacheFirst',
          resources: [
            ...resources.scripts.map(s => s.path),
            ...resources.stylesheets.map(s => s.path),
            ...resources.fonts.map(f => f.path),
            ...resources.images.filter(i => i.priority === 'high').map(i => i.path)
          ]
        },
        static: {
          strategy: 'StaleWhileRevalidate',
          resources: [
            '/Images/**/*.{jpg,jpeg,png,svg,webp,avif}',
            '/static/css/**/*.css',
            '/static/js/**/*.js'
          ]
        },
        runtime: {
          strategy: 'NetworkFirst',
          resources: [
            '/api/**/*',
            '/manifest.json'
          ]
        }
      },
      preload: {
        onInstall: resources.scripts.concat(resources.stylesheets).map(r => r.path),
        onActivate: resources.images.filter(i => i.priority === 'high').map(i => i.path)
      },
      estimatedImpact: {
        mobileLighthouseGain: '+5-8 points',
        cacheHitRatio: '85-95%',
        loadingSpeedImprovement: '15-25%',
        offlineCapability: 'Enhanced'
      }
    };

    try {
      await fs.mkdir(path.join(this.buildDir, 'optimization'), { recursive: true });
      await fs.writeFile(
        path.join(this.buildDir, 'optimization', 'caching-strategy.json'),
        JSON.stringify(strategy, null, 2)
      );
      
      console.log('✅ Service worker caching strategy generated');
      return strategy;
    } catch (error) {
      console.error('❌ Caching strategy generation failed:', error);
      throw error;
    }
  }

  /**
   * Run complete resource preloading optimization
   */
  async optimize() {
    console.log('🚀 Starting Phase 5 Week 2 Resource Preloading Optimization...');

    try {
      const resources = await this.analyzeCriticalResources();
      await this.createOptimizedHTML(resources);
      const strategy = await this.generateCachingStrategy(resources);

      console.log('\n🎉 Resource Preloading Optimization Complete!');
      console.log('📋 Implemented:');
      console.log('- Critical resource preloading in HTML');
      console.log('- DNS prefetch for external domains');
      console.log('- Service worker caching strategy');
      console.log('- Font loading optimization');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. Test the optimized build with resource preloading');
      console.log('2. Monitor Core Web Vitals improvements');
      console.log('3. Implement service worker caching');
      console.log('4. Verify font loading performance');

      return { resources, strategy };
    } catch (error) {
      console.error('💥 Resource preloading optimization failed:', error);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const preloader = new ResourcePreloader();
  preloader.optimize();
}

module.exports = ResourcePreloader;