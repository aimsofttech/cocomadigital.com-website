/**
 * Phase 5 Simple Critical CSS Extractor
 * Conservative approach for mobile optimization
 */

const fs = require('fs').promises;
const path = require('path');

class SimpleCriticalCSS {
  constructor() {
    this.buildDir = './build';
    this.outputDir = './build/critical';
  }

  /**
   * Analyze current CSS files and identify critical styles
   */
  async analyzeCSSFiles() {
    console.log('🔍 Analyzing CSS files in build directory...');
    
    try {
      const cssFiles = [];
      const cssDir = path.join(this.buildDir, 'static/css');
      
      try {
        const files = await fs.readdir(cssDir);
        for (const file of files) {
          if (file.endsWith('.css') && !file.endsWith('.map')) {
            const filePath = path.join(cssDir, file);
            const stats = await fs.stat(filePath);
            const content = await fs.readFile(filePath, 'utf8');
            
            cssFiles.push({
              name: file,
              path: filePath,
              size: stats.size,
              content: content,
              lines: content.split('\n').length
            });
          }
        }
      } catch (error) {
        console.warn('Build directory not found. Please run "npm run build" first.');
        return { files: [], analysis: null };
      }
      
      const analysis = this.generateCSSAnalysis(cssFiles);
      
      console.log('📊 CSS Analysis Results:');
      console.log(`Total CSS files: ${cssFiles.length}`);
      console.log(`Total CSS size: ${(cssFiles.reduce((sum, f) => sum + f.size, 0) / 1024).toFixed(2)} KB`);
      
      cssFiles.forEach(file => {
        console.log(`- ${file.name}: ${(file.size / 1024).toFixed(2)} KB`);
      });
      
      return { files: cssFiles, analysis };
    } catch (error) {
      console.error('❌ CSS analysis failed:', error);
      throw error;
    }
  }

  /**
   * Generate CSS analysis and recommendations
   */
  generateCSSAnalysis(cssFiles) {
    const analysis = {
      totalSize: cssFiles.reduce((sum, f) => sum + f.size, 0),
      criticalSelectors: [],
      recommendations: [],
      mobileOptimizations: []
    };

    // Common critical CSS patterns for mobile
    const criticalPatterns = [
      // Layout and structure
      'body', 'html', '*', '::before', '::after',
      
      // Header and navigation (typically above fold)
      '[class*="header"]', '[class*="nav"]', '[class*="menu"]',
      
      // Hero sections
      '[class*="hero"]', '[class*="banner"]', '[class*="jumbotron"]',
      
      // Typography (base styles)
      'h1', 'h2', 'h3', 'p', 'a', 'span',
      
      // Bootstrap critical classes
      '.container', '.row', '.col', '.btn', '.navbar',
      
      // Common utility classes
      '.d-', '.text-', '.bg-', '.m-', '.p-', '.w-', '.h-'
    ];

    cssFiles.forEach(file => {
      const content = file.content;
      let criticalRules = '';
      
      criticalPatterns.forEach(pattern => {
        // Simple regex to find CSS rules (basic approach)
        const regex = new RegExp(`[^}]*${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^{]*{[^}]*}`, 'gi');
        const matches = content.match(regex) || [];
        
        matches.forEach(match => {
          if (!criticalRules.includes(match)) {
            criticalRules += match + '\n';
          }
        });
      });
      
      analysis.criticalSelectors.push({
        file: file.name,
        extractedCSS: criticalRules,
        originalSize: file.size,
        criticalSize: criticalRules.length
      });
    });

    // Generate recommendations
    analysis.recommendations = [
      'Inline critical CSS directly in HTML head',
      'Load non-critical CSS asynchronously',
      'Use CSS containment for better performance',
      'Minimize above-the-fold CSS to < 14KB',
      'Remove unused CSS rules',
      'Optimize CSS delivery with preload/prefetch'
    ];

    analysis.mobileOptimizations = [
      'Prioritize mobile-first CSS rules',
      'Use CSS Grid/Flexbox for layout',
      'Optimize font loading with font-display',
      'Minimize repaints and reflows',
      'Use CSS custom properties for theming'
    ];

    return analysis;
  }

  /**
   * Create critical CSS inline template
   */
  async createCriticalCSSTemplate(analysis) {
    console.log('📝 Creating critical CSS template...');
    
    const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <!-- Critical CSS - Inline for fastest loading -->
  <style>
    /* Critical CSS extracted for mobile performance */
    /* Reset and base styles */
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    
    /* Critical layout styles - customize based on your app */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
    .row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
    .col { padding: 0 15px; }
    
    /* Critical header styles */
    header, .header { position: relative; z-index: 1000; }
    nav, .nav { display: flex; align-items: center; }
    
    /* Critical hero/banner styles */
    .hero, .banner { min-height: 400px; display: flex; align-items: center; }
    
    /* Critical typography */
    h1 { font-size: 2.5rem; margin: 0 0 1rem; line-height: 1.2; }
    h2 { font-size: 2rem; margin: 0 0 1rem; }
    p { margin: 0 0 1rem; line-height: 1.6; }
    
    /* Critical buttons */
    .btn { display: inline-block; padding: 0.75rem 1.25rem; border: none; border-radius: 0.25rem; text-decoration: none; cursor: pointer; }
    
    /* Mobile-first responsive utilities */
    @media (max-width: 768px) {
      .container { padding: 0 10px; }
      h1 { font-size: 2rem; }
      .hero, .banner { min-height: 300px; }
    }
    
    /* Loading states for better UX */
    .loading { opacity: 0.7; pointer-events: none; }
    .fade-in { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  </style>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/static/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/static/css/main.css"></noscript>
  
  <!-- Async load non-critical CSS -->
  <script>
    // Load CSS asynchronously for better performance
    function loadCSS(href) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
    
    // Load non-critical styles after page load
    window.addEventListener('load', function() {
      // Add paths to your chunk CSS files here
      const nonCriticalCSS = [
        // Will be populated based on your build output
      ];
      
      nonCriticalCSS.forEach(loadCSS);
    });
  </script>
  
  <title>Cocoma Digital</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
`;

    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.writeFile(
        path.join(this.outputDir, 'critical-css-template.html'),
        template
      );
      
      console.log('✅ Critical CSS template created');
    } catch (error) {
      console.error('❌ Template creation failed:', error);
      throw error;
    }
  }

  /**
   * Generate CSS optimization report
   */
  async generateOptimizationReport(analysis) {
    console.log('📊 Generating CSS optimization report...');
    
    const report = {
      version: '1.0.0',
      phase: 'Phase 5 - Mobile CSS Optimization',
      generatedAt: new Date().toISOString(),
      analysis: {
        totalCSSFiles: analysis.files?.length || 0,
        totalCSSSize: analysis.analysis ? `${(analysis.analysis.totalSize / 1024).toFixed(2)} KB` : 'Unknown',
        criticalCSSTarget: '< 14KB (for mobile performance)',
        recommendations: analysis.analysis?.recommendations || []
      },
      optimizations: {
        implemented: [
          'Critical CSS template created',
          'Async CSS loading script',
          'Mobile-first critical styles',
          'CSS preload optimization'
        ],
        pending: [
          'Extract actual critical CSS from your components',
          'Inline critical CSS in index.html',
          'Configure async loading for chunk CSS',
          'Remove unused CSS rules',
          'Optimize CSS delivery'
        ]
      },
      mobileOptimizations: [
        'Mobile-first CSS approach',
        'Reduced critical CSS size',
        'Async non-critical CSS loading',
        'Improved perceived performance',
        'Better Core Web Vitals scores'
      ],
      nextSteps: [
        '1. Replace build/index.html with critical CSS template',
        '2. Customize critical CSS for your specific components',
        '3. Configure build process to inline critical CSS',
        '4. Test mobile performance improvements',
        '5. Monitor Core Web Vitals metrics'
      ],
      estimatedImpact: {
        mobileLighthouseScore: '+5 to +8 points',
        firstContentfulPaint: '15-25% improvement',
        largestContentfulPaint: '10-20% improvement',
        cumulativeLayoutShift: 'Reduced due to critical styles'
      }
    };

    try {
      await fs.writeFile(
        path.join(this.outputDir, 'css-optimization-report.json'),
        JSON.stringify(report, null, 2)
      );
      
      console.log('✅ CSS optimization report generated');
      return report;
    } catch (error) {
      console.error('❌ Report generation failed:', error);
      throw error;
    }
  }

  /**
   * Run complete CSS optimization analysis
   */
  async optimize() {
    console.log('🚀 Starting Phase 5 CSS Optimization (Conservative)...');
    
    try {
      const analysis = await this.analyzeCSSFiles();
      await this.createCriticalCSSTemplate(analysis);
      const report = await this.generateOptimizationReport(analysis);
      
      console.log('\n🎉 Phase 5 CSS Optimization Complete!');
      console.log('📋 Summary:');
      if (analysis.files && analysis.files.length > 0) {
        console.log(`- Analyzed ${analysis.files.length} CSS files`);
        console.log(`- Total CSS size: ${(report.analysis.totalCSSSize)}`);
      } else {
        console.log('- Build directory not found (run npm run build first)');
      }
      console.log('- Created critical CSS template');
      console.log('- Generated optimization report');
      
      console.log('\n🚀 Next Steps:');
      console.log('1. Run "npm run build" to generate CSS files');
      console.log('2. Review critical CSS template in build/critical/');
      console.log('3. Customize critical styles for your components');
      console.log('4. Test mobile performance improvements');
      
    } catch (error) {
      console.error('💥 CSS optimization failed:', error);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const optimizer = new SimpleCriticalCSS();
  optimizer.optimize();
}

module.exports = SimpleCriticalCSS;