const fs = require('fs').promises;
const path = require('path');

/**
 * Phase 5 Simplified Image Optimization Utility
 * Conservative approach - focus on what works reliably first
 */
class SimpleImageOptimizer {
  constructor() {
    this.inputDir = 'public/Images';
    this.outputDir = 'public/Images/optimized';
  }

  /**
   * Analyze current images and create optimization plan
   */
  async analyzeImages() {
    console.log('🔍 Analyzing current images...');
    
    try {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];
      const imageStats = {
        total: 0,
        totalSize: 0,
        byType: {},
        recommendations: []
      };

      const scanDir = async (dir, prefix = '') => {
        try {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
              await scanDir(fullPath, path.join(prefix, entry.name));
            } else if (entry.isFile()) {
              const ext = path.extname(entry.name).toLowerCase();
              
              if (imageExtensions.includes(ext)) {
                const stats = await fs.stat(fullPath);
                const relativePath = path.join(prefix, entry.name);
                
                imageStats.total++;
                imageStats.totalSize += stats.size;
                
                if (!imageStats.byType[ext]) {
                  imageStats.byType[ext] = { count: 0, size: 0, files: [] };
                }
                
                imageStats.byType[ext].count++;
                imageStats.byType[ext].size += stats.size;
                imageStats.byType[ext].files.push({
                  path: relativePath,
                  size: stats.size,
                  fullPath: fullPath
                });
              }
            }
          }
        } catch (error) {
          console.warn(`Could not scan directory: ${dir}`, error.message);
        }
      };

      await scanDir(this.inputDir);
      
      // Generate recommendations
      this.generateRecommendations(imageStats);
      
      console.log('📊 Image Analysis Results:');
      console.log(`Total images: ${imageStats.total}`);
      console.log(`Total size: ${(imageStats.totalSize / 1024 / 1024).toFixed(2)} MB`);
      
      Object.entries(imageStats.byType).forEach(([ext, data]) => {
        console.log(`${ext}: ${data.count} files, ${(data.size / 1024 / 1024).toFixed(2)} MB`);
      });
      
      console.log('\n💡 Recommendations:');
      imageStats.recommendations.forEach(rec => console.log(`- ${rec}`));
      
      return imageStats;
    } catch (error) {
      console.error('❌ Image analysis failed:', error);
      throw error;
    }
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(stats) {
    const recommendations = [];
    
    // Check for large files
    Object.entries(stats.byType).forEach(([ext, data]) => {
      const largeFiles = data.files.filter(file => file.size > 500 * 1024); // > 500KB
      if (largeFiles.length > 0) {
        recommendations.push(`${largeFiles.length} ${ext} files > 500KB should be optimized`);
      }
    });
    
    // Check for format optimization opportunities
    if (stats.byType['.jpg'] || stats.byType['.jpeg']) {
      recommendations.push('Convert JPEG images to WebP for 25-35% size reduction');
    }
    
    if (stats.byType['.png']) {
      recommendations.push('Convert PNG images to WebP for better compression');
    }
    
    // Check for responsive image opportunities
    const heroImages = Object.values(stats.byType).flat()
      .filter(files => files.files?.some(f => f.path.includes('hero') || f.path.includes('banner')));
    
    if (heroImages.length > 0) {
      recommendations.push('Create responsive variants for hero/banner images');
    }
    
    stats.recommendations = recommendations;
  }

  /**
   * Create responsive image configuration
   */
  async createResponsiveConfig() {
    console.log('⚙️  Creating responsive image configuration...');
    
    const config = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      breakpoints: {
        mobile: { width: 480, quality: 80 },
        tablet: { width: 768, quality: 85 },
        desktop: { width: 1200, quality: 90 }
      },
      formats: {
        preferred: ['avif', 'webp'],
        fallback: ['jpg', 'png']
      },
      optimization: {
        enableLazyLoading: true,
        enableProgressiveLoading: true,
        enableResponsiveImages: true,
        enableNextGenFormats: true
      },
      criticalImages: [
        '/Images/home/hero-banner-1.jpg',
        '/Images/home/hero-banner-2.jpg',
        '/Images/app_logo.svg',
        '/Images/logoWhite.svg'
      ]
    };

    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.writeFile(
        path.join(this.outputDir, 'responsive-config.json'),
        JSON.stringify(config, null, 2)
      );
      
      console.log('✅ Responsive image configuration created');
      return config;
    } catch (error) {
      console.error('❌ Config creation failed:', error);
      throw error;
    }
  }

  /**
   * Generate image optimization manifest
   */
  async generateManifest() {
    console.log('📋 Generating image optimization manifest...');
    
    const manifest = {
      version: '1.0.0',
      phase: 'Phase 5 - Conservative Mobile Optimization',
      generatedAt: new Date().toISOString(),
      optimizations: {
        implemented: [
          'Progressive image loading component',
          'Responsive image configuration',
          'Lazy loading with intersection observer',
          'Fallback handling for unsupported formats'
        ],
        pending: [
          'WebP/AVIF conversion (requires manual setup)',
          'Responsive image variants generation',
          'Critical image preloading',
          'Image compression optimization'
        ]
      },
      nextSteps: [
        '1. Install sharp or other image processing tool',
        '2. Run batch conversion for WebP/AVIF formats',
        '3. Generate responsive variants for hero images',
        '4. Update React components to use ProgressiveImage',
        '5. Implement critical image preloading'
      ],
      estimatedImpact: {
        mobileLighthouseScore: '+8 to +12 points',
        bundleSizeReduction: '20-30% for images',
        loadingSpeed: '30-40% faster image loading',
        userExperience: 'Smooth progressive loading'
      }
    };

    try {
      await fs.writeFile(
        path.join(this.outputDir, 'optimization-manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      console.log('✅ Image optimization manifest generated');
      return manifest;
    } catch (error) {
      console.error('❌ Manifest generation failed:', error);
      throw error;
    }
  }

  /**
   * Create Next.js-style Image component import
   */
  async createImageComponentImport() {
    console.log('⚛️  Creating image component import helper...');
    
    const importHelper = `
/**
 * Phase 5 Image Component Import Helper
 * Use this to gradually migrate to optimized images
 */

// Import the new ProgressiveImage component
import ProgressiveImage from '../components/common/ProgressiveImage';
import '../components/common/ProgressiveImage.css';

/**
 * Migration guide for existing image usage:
 * 
 * BEFORE:
 * <img src="/Images/home/hero-banner-1.jpg" alt="Hero" />
 * 
 * AFTER:
 * <ProgressiveImage 
 *   src="/Images/home/hero-banner-1.jpg"
 *   alt="Hero"
 *   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 *   className="hero-image"
 *   lazy={true}
 * />
 */

// Helper function to generate optimized image sources
export const getOptimizedImageSrc = (originalSrc, format = 'webp') => {
  const baseName = originalSrc.split('.').slice(0, -1).join('.');
  const extension = originalSrc.split('.').pop();
  
  return {
    avif: \`\${baseName}.\${format === 'avif' ? 'avif' : format}\`,
    webp: \`\${baseName}.\${format === 'webp' ? 'webp' : 'webp'}\`,
    fallback: originalSrc
  };
};

// Helper function for responsive image sizes
export const getResponsiveSizes = (usage = 'default') => {
  const sizeMaps = {
    hero: '100vw',
    thumbnail: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw',
    card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    default: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  };
  
  return sizeMaps[usage] || sizeMaps.default;
};

export default ProgressiveImage;
`;

    try {
      await fs.writeFile(
        path.join('src/utils', 'imageOptimization.js'),
        importHelper
      );
      
      console.log('✅ Image component import helper created');
    } catch (error) {
      console.error('❌ Import helper creation failed:', error);
      throw error;
    }
  }

  /**
   * Run simplified optimization analysis and setup
   */
  async optimizeAll() {
    console.log('🚀 Starting Phase 5 Simplified Image Optimization (Conservative)...');
    
    try {
      const stats = await this.analyzeImages();
      await this.createResponsiveConfig();
      await this.generateManifest();
      await this.createImageComponentImport();
      
      console.log('\n🎉 Phase 5 Image Optimization Setup Complete!');
      console.log('📋 Summary:');
      console.log(`- Analyzed ${stats.total} images (${(stats.totalSize / 1024 / 1024).toFixed(2)} MB)`);
      console.log('- Created responsive image configuration');
      console.log('- Generated optimization manifest');
      console.log('- Created React component import helper');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. Review the optimization manifest in public/Images/optimized/');
      console.log('2. Start using ProgressiveImage component in React components');
      console.log('3. Set up image conversion tools (sharp, imagemin-cli, etc.)');
      console.log('4. Generate WebP/AVIF variants for critical images');
      
    } catch (error) {
      console.error('💥 Image optimization setup failed:', error);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const optimizer = new SimpleImageOptimizer();
  optimizer.optimizeAll();
}

module.exports = SimpleImageOptimizer;