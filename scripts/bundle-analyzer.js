/**
 * Phase 5 Week 2: Bundle Size Analysis and Optimization
 * Conservative approach to reduce chunk sizes and improve mobile performance
 */

const fs = require('fs');
const path = require('path');

class BundleAnalyzer {
  constructor() {
    this.buildDir = './build';
    this.jsDir = path.join(this.buildDir, 'static/js');
    this.cssDir = path.join(this.buildDir, 'static/css');
  }

  /**
   * Analyze current bundle sizes
   */
  async analyzeBundles() {
    console.log('🔍 Analyzing current bundle sizes...');
    
    try {
      const jsFiles = await this.getFilesWithSizes(this.jsDir, '.js');
      const cssFiles = await this.getFilesWithSizes(this.cssDir, '.css');
      
      const analysis = {
        javascript: {
          files: jsFiles.filter(f => !f.name.endsWith('.map') && !f.name.endsWith('.LICENSE.txt')),
          totalSize: 0,
          chunkCount: 0,
          oversizedChunks: [],
          mainBundle: null
        },
        css: {
          files: cssFiles.filter(f => !f.name.endsWith('.map')),
          totalSize: 0,
          chunkCount: 0
        },
        recommendations: []
      };

      // Analyze JavaScript bundles
      analysis.javascript.files.forEach(file => {
        analysis.javascript.totalSize += file.size;
        analysis.javascript.chunkCount++;
        
        if (file.name.startsWith('main.')) {
          analysis.javascript.mainBundle = file;
        }
        
        // Flag chunks over 50KB (our target)
        if (file.size > 50 * 1024) {
          analysis.javascript.oversizedChunks.push(file);
        }
      });

      // Analyze CSS bundles
      analysis.css.files.forEach(file => {
        analysis.css.totalSize += file.size;
        analysis.css.chunkCount++;
      });

      this.generateRecommendations(analysis);
      this.printAnalysis(analysis);
      
      return analysis;
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get files with their sizes from a directory
   */
  async getFilesWithSizes(dir, extension) {
    try {
      const files = await fs.promises.readdir(dir);
      const fileStats = [];
      
      for (const file of files) {
        if (file.endsWith(extension)) {
          const filePath = path.join(dir, file);
          const stats = await fs.promises.stat(filePath);
          fileStats.push({
            name: file,
            path: filePath,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024 * 100) / 100
          });
        }
      }
      
      return fileStats.sort((a, b) => b.size - a.size);
    } catch (error) {
      console.warn(`Could not analyze directory: ${dir}`);
      return [];
    }
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    
    // JavaScript recommendations
    if (analysis.javascript.oversizedChunks.length > 0) {
      recommendations.push(`${analysis.javascript.oversizedChunks.length} JavaScript chunks exceed 50KB target`);
    }
    
    if (analysis.javascript.mainBundle && analysis.javascript.mainBundle.size > 100 * 1024) {
      recommendations.push('Main bundle is over 100KB - consider code splitting');
    }
    
    // Look for React Player chunks (often unused)
    const reactPlayerChunks = analysis.javascript.files.filter(f => f.name.includes('reactPlayer'));
    if (reactPlayerChunks.length > 5) {
      recommendations.push(`${reactPlayerChunks.length} React Player chunks detected - implement dynamic imports`);
    }
    
    // CSS recommendations
    const mainCSS = analysis.css.files.find(f => f.name.startsWith('main.'));
    if (mainCSS && mainCSS.size > 100 * 1024) {
      recommendations.push('Main CSS bundle is large - consider further critical CSS optimization');
    }
    
    // General recommendations
    if (analysis.javascript.chunkCount > 50) {
      recommendations.push('High number of chunks may impact HTTP/2 efficiency');
    }
    
    analysis.recommendations = recommendations;
  }

  /**
   * Print analysis results
   */
  printAnalysis(analysis) {
    console.log('\n📊 Bundle Analysis Results:');
    console.log('=' .repeat(50));
    
    // JavaScript Analysis
    console.log('\n🟨 JavaScript Bundles:');
    console.log(`Total JS Size: ${(analysis.javascript.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Number of JS Chunks: ${analysis.javascript.chunkCount}`);
    
    if (analysis.javascript.mainBundle) {
      console.log(`Main Bundle: ${analysis.javascript.mainBundle.sizeKB} KB`);
    }
    
    if (analysis.javascript.oversizedChunks.length > 0) {
      console.log(`\n⚠️  Oversized Chunks (>50KB):`);
      analysis.javascript.oversizedChunks.slice(0, 10).forEach(chunk => {
        console.log(`  - ${chunk.name}: ${chunk.sizeKB} KB`);
      });
    }
    
    // CSS Analysis
    console.log(`\n🟦 CSS Bundles:`);
    console.log(`Total CSS Size: ${(analysis.css.totalSize / 1024).toFixed(2)} KB`);
    console.log(`Number of CSS Chunks: ${analysis.css.chunkCount}`);
    
    // Top chunks
    console.log(`\n🔝 Largest JavaScript Chunks:`);
    analysis.javascript.files.slice(0, 10).forEach((file, index) => {
      console.log(`${index + 1}. ${file.name}: ${file.sizeKB} KB`);
    });
    
    // Recommendations
    if (analysis.recommendations.length > 0) {
      console.log(`\n💡 Optimization Recommendations:`);
      analysis.recommendations.forEach(rec => console.log(`- ${rec}`));
    }
  }

  /**
   * Generate bundle optimization configuration
   */
  async generateOptimizationConfig(analysis) {
    console.log('\n⚙️  Generating optimization configuration...');
    
    const config = {
      version: '1.0.0',
      phase: 'Phase 5 Week 2 - Bundle Optimization',
      generatedAt: new Date().toISOString(),
      currentState: {
        totalJSSize: `${(analysis.javascript.totalSize / 1024 / 1024).toFixed(2)} MB`,
        jsChunks: analysis.javascript.chunkCount,
        oversizedChunks: analysis.javascript.oversizedChunks.length,
        totalCSSSize: `${(analysis.css.totalSize / 1024).toFixed(2)} KB`,
        cssChunks: analysis.css.chunkCount
      },
      optimization: {
        targets: {
          maxChunkSize: '50KB',
          mainBundleTarget: '<100KB',
          totalJSTarget: '<500KB',
          chunkLoadingStrategy: 'async'
        },
        strategies: [
          'Dynamic imports for React Player components',
          'Vendor chunk optimization',
          'Common chunk extraction',
          'Tree shaking unused code',
          'Code splitting by route'
        ]
      },
      webpack: {
        splitChunks: {
          chunks: 'all',
          maxSize: 51200, // 50KB
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              maxSize: 102400 // 100KB for vendor chunks
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              maxSize: 51200
            }
          }
        }
      },
      estimatedImpact: {
        bundleSizeReduction: '20-30%',
        mobileLighthouseGain: '+10-15 points',
        loadingSpeedImprovement: '25-40%',
        cacheEfficiency: 'Improved due to smaller chunks'
      }
    };

    try {
      await fs.promises.mkdir(path.join(this.buildDir, 'optimization'), { recursive: true });
      await fs.promises.writeFile(
        path.join(this.buildDir, 'optimization', 'bundle-analysis.json'),
        JSON.stringify(config, null, 2)
      );
      
      console.log('✅ Bundle optimization configuration generated');
      return config;
    } catch (error) {
      console.error('❌ Config generation failed:', error);
      throw error;
    }
  }

  /**
   * Run complete bundle analysis
   */
  async analyze() {
    console.log('🚀 Starting Phase 5 Week 2 Bundle Analysis...');
    
    try {
      const analysis = await this.analyzeBundles();
      const config = await this.generateOptimizationConfig(analysis);
      
      console.log('\n🎉 Bundle Analysis Complete!');
      console.log('📋 Next Steps:');
      console.log('1. Review bundle-analysis.json for detailed optimization plan');
      console.log('2. Implement dynamic imports for React Player components');
      console.log('3. Configure webpack optimization settings');
      console.log('4. Test bundle size improvements');
      
      return { analysis, config };
    } catch (error) {
      console.error('💥 Bundle analysis failed:', error);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze();
}

module.exports = BundleAnalyzer;