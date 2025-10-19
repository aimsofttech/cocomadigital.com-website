/**
 * Environment Configuration Utility
 * Handles different environment settings for local and production
 */

const ENV = {
  // Environment type
  type: process.env.REACT_APP_ENV || 'development',
  
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  // Debug Configuration
  debug: process.env.REACT_APP_DEBUG === 'true',
  logLevel: process.env.REACT_APP_LOG_LEVEL || 'warn',
  
  // Feature Flags
  features: {
    enableAnalytics: process.env.REACT_APP_ENV === 'production',
    enableCrashReporting: process.env.REACT_APP_ENV === 'production',
    enablePerformanceMonitoring: process.env.REACT_APP_ENV === 'production',
    enableConsoleWarnings: process.env.REACT_APP_ENV === 'local' || process.env.REACT_APP_ENV === 'development',
  },
  
  // Performance Configuration
  performance: {
    enableSentry: process.env.REACT_APP_ENV === 'production',
    enableSourceMaps: process.env.REACT_APP_ENV === 'local' || process.env.REACT_APP_ENV === 'development',
    enableReduxDevtools: process.env.REACT_APP_ENV === 'local' || process.env.REACT_APP_ENV === 'development',
  },
  
  // Build Configuration
  build: {
    mode: process.env.NODE_ENV || 'development',
    port: process.env.PORT || (process.env.REACT_APP_ENV === 'production' ? 8080 : 3000),
  },
};

// Logger utility with environment-aware levels
export const logger = {
  debug: (...args) => {
    if (ENV.features.enableConsoleWarnings) {
      console.debug('[DEBUG]', ...args);
    }
  },
  info: (...args) => {
    if (ENV.features.enableConsoleWarnings || ENV.logLevel !== 'error') {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (ENV.logLevel !== 'error') {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
};

// Check environment
export const isLocal = () => ENV.type === 'local' || ENV.type === 'development';
export const isProduction = () => ENV.type === 'production';
export const isDevelopment = () => ENV.type === 'development';

// Get environment-specific values
export const getEnvValue = (key, defaultValue) => {
  return process.env[`REACT_APP_${key}`] || defaultValue;
};

export default ENV;
