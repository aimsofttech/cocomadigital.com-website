/**
 * Phase 5 Week 2: Webpack Bundle Optimization Configuration
 * Custom webpack config to optimize chunk sizes for mobile performance
 */

const path = require('path');

module.exports = function override(config, env) {
  // Phase 5 Bundle Optimization
  if (env === 'production') {
    console.log('🚀 Applying Phase 5 Bundle Optimizations...');
    
    // Optimize chunk splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 51200, // 50KB target
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        cacheGroups: {
          // Vendor libraries chunk
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            maxSize: 102400, // 100KB for vendor chunks
            reuseExistingChunk: true
          },
          
          // React specific chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
            maxSize: 81920, // 80KB
            reuseExistingChunk: true
          },
          
          // Bootstrap and UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](bootstrap|@mui|react-bootstrap)[\\/]/,
            name: 'ui',
            priority: 15,
            chunks: 'all',
            maxSize: 71680, // 70KB
            reuseExistingChunk: true
          },
          
          // React Player chunks (large, should be async)
          reactPlayer: {
            test: /[\\/]node_modules[\\/]react-player[\\/]/,
            name: 'react-player',
            priority: 25,
            chunks: 'async', // Only load when needed
            maxSize: 40960, // 40KB
            reuseExistingChunk: true
          },
          
          // Common application code
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            maxSize: 51200, // 50KB
            reuseExistingChunk: true
          },
          
          // Default chunk
          default: {
            minChunks: 2,
            priority: -10,
            maxSize: 51200,
            reuseExistingChunk: true
          }
        }
      },
      
      // Minimize and optimize
      minimize: true,
      usedExports: true,
      sideEffects: false,
      
      // Runtime chunk optimization
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      }
    };

    // Tree shaking optimization
    config.mode = 'production';
    config.bail = true;
    
    // Module concatenation
    config.optimization.concatenateModules = true;
    
    // Better module IDs for caching
    config.optimization.moduleIds = 'deterministic';
    config.optimization.chunkIds = 'deterministic';
    
    console.log('✅ Phase 5 Bundle Optimizations Applied');
  }
  
  return config;
};

// Alternative configuration for React App Rewired
const rewire = {
  webpack: function(config, env) {
    return module.exports(config, env);
  }
};

module.exports.rewired = rewire;