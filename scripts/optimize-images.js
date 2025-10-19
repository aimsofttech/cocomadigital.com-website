const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp').default || require('imagemin-webp');
const imageminAvif = require('imagemin-avif').default || require('imagemin-avif');
const imageminPngquant = require('imagemin-pngquant').default || require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg').default || require('imagemin-mozjpeg');
const fs = require('fs').promises;
const path = require('path');

/**
 * Phase 5 Image Optimization Utility
 * Conservative approach - optimize images with fallbacks
 */
class ImageOptimizer {
  constructor() {
    this.inputDir = 'public/Images';
    this.outputDir = 'public/Images/optimized';
    this.mobileBreakpoint = 768;
    this.tabletBreakpoint = 1024;
  }

  /**
   * Convert images to WebP format
   */
  async convertToWebP() {
    console.log('🖼️  Converting images to WebP format...');
    
    try {
      const files = await imagemin([`${this.inputDir}/**/*.{jpg,jpeg,png}`], {
        destination: this.outputDir,
        plugins: [
          imageminWebp({
            quality: 85, // Conservative quality for better compatibility
            method: 4,   // Good balance of compression vs speed
          })
        ]
      });

      console.log(`✅ Converted ${files.length} images to WebP`);
      return files;
    } catch (error) {
      console.error('❌ WebP conversion failed:', error);
      throw error;
    }
  }

  /**
   * Convert images to AVIF format (next-gen)
   */
  async convertToAVIF() {
    console.log('🚀 Converting images to AVIF format...');
    
    try {
      const files = await imagemin([`${this.inputDir}/**/*.{jpg,jpeg,png}`], {
        destination: `${this.outputDir}/avif`,
        plugins: [
          imageminAvif({
            quality: 80, // Conservative quality
            speed: 6,    // Balance compression vs speed
          })
        ]
      });

      console.log(`✅ Converted ${files.length} images to AVIF`);
      return files;
    } catch (error) {
      console.error('❌ AVIF conversion failed:', error);
      // Don't throw - AVIF is optional enhancement
      return [];
    }
  }

  /**
   * Create responsive image variants
   */
  async createResponsiveVariants() {
    console.log('📱 Creating responsive image variants...');
    
    const sizes = [
      { suffix: '-mobile', width: 480, quality: 80 },
      { suffix: '-tablet', width: 768, quality: 85 },
      { suffix: '-desktop', width: 1200, quality: 90 }
    ];

    try {
      for (const size of sizes) {
        await imagemin([`${this.inputDir}/**/*.{jpg,jpeg}`], {
          destination: `${this.outputDir}/responsive${size.suffix}`,
          plugins: [
            imageminMozjpeg({
              quality: size.quality,
              progressive: true
            })
          ]
        });

        // Create WebP variants for each size
        await imagemin([`${this.inputDir}/**/*.{jpg,jpeg,png}`], {
          destination: `${this.outputDir}/responsive${size.suffix}`,
          plugins: [
            imageminWebp({
              quality: size.quality,
              method: 4
            })
          ]
        });
      }

      console.log('✅ Created responsive image variants');
    } catch (error) {
      console.error('❌ Responsive variant creation failed:', error);
      throw error;
    }
  }

  /**
   * Optimize PNG images
   */
  async optimizePNGs() {
    console.log('🔧 Optimizing PNG images...');
    
    try {
      const files = await imagemin([`${this.inputDir}/**/*.png`], {
        destination: `${this.outputDir}/png`,
        plugins: [
          imageminPngquant({
            quality: [0.6, 0.8], // Conservative quality range
            speed: 4
          })
        ]
      });

      console.log(`✅ Optimized ${files.length} PNG images`);
      return files;
    } catch (error) {
      console.error('❌ PNG optimization failed:', error);
      throw error;
    }
  }

  /**
   * Generate image manifest for runtime optimization
   */
  async generateImageManifest() {
    console.log('📋 Generating image optimization manifest...');
    
    const manifest = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      images: {},
      formats: ['avif', 'webp', 'jpg', 'png'],
      breakpoints: {
        mobile: this.mobileBreakpoint,
        tablet: this.tabletBreakpoint,
        desktop: 1200
      }
    };

    try {
      // Scan optimized images directory
      const scanDir = async (dir, prefix = '') => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.join(prefix, entry.name);
          
          if (entry.isDirectory()) {
            await scanDir(fullPath, relativePath);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            const basename = path.basename(entry.name, ext);
            
            if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
              if (!manifest.images[basename]) {
                manifest.images[basename] = {};
              }
              
              manifest.images[basename][ext.substring(1)] = relativePath;
            }
          }
        }
      };

      await scanDir(this.outputDir);
      
      // Write manifest file
      await fs.writeFile(
        path.join(this.outputDir, 'image-manifest.json'),
        JSON.stringify(manifest, null, 2)
      );

      console.log('✅ Generated image optimization manifest');
      return manifest;
    } catch (error) {
      console.error('❌ Manifest generation failed:', error);
      throw error;
    }
  }

  /**
   * Run complete image optimization pipeline
   */
  async optimizeAll() {
    console.log('🚀 Starting Phase 5 Image Optimization (Conservative)...');
    
    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });
      
      // Run optimizations in sequence (conservative approach)
      await this.convertToWebP();
      await this.convertToAVIF();
      await this.createResponsiveVariants();
      await this.optimizePNGs();
      await this.generateImageManifest();
      
      console.log('🎉 Phase 5 Image Optimization Complete!');
      console.log('Next steps:');
      console.log('1. Update React components to use optimized images');
      console.log('2. Implement progressive image loading');
      console.log('3. Add responsive image components');
      
    } catch (error) {
      console.error('💥 Image optimization failed:', error);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  optimizer.optimizeAll();
}

module.exports = ImageOptimizer;