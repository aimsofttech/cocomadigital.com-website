import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Includes Popper.js
import "./index.css";
import store, { persistor } from "./Service/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate

// Import Service Worker Manager and RUM
import swManager from "./utils/serviceWorkerManager";
import rum from "./utils/realUserMonitoring";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// Enhanced Web Vitals reporting with service worker integration and RUM
reportWebVitals((metric) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vitals:', metric);
  }
  
  // Send to RUM system
  if (rum) {
    rum.trackCustomEvent('WebVital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType
    });
  }
  
  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4 example
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        custom_parameter: metric.rating,
        non_interaction: true,
      });
    }
    
    // Send to custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...metric,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        serviceWorkerActive: swManager.getStatus() === 'active'
      }),
      keepalive: true
    }).catch(error => {
      console.warn('Failed to send Web Vitals to analytics:', error);
    });
  }
  
  // Store performance data locally for monitoring
  if ('localStorage' in window) {
    const performanceData = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
    performanceData.push({
      ...metric,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      serviceWorkerActive: swManager.getStatus() === 'active'
    });
    
    // Keep only last 50 entries
    if (performanceData.length > 50) {
      performanceData.splice(0, performanceData.length - 50);
    }
    
    localStorage.setItem('performanceMetrics', JSON.stringify(performanceData));
  }
});

// Service Worker event listeners
window.addEventListener('sw-update-available', (event) => {
  console.log('🔄 New app version available!');
  
  // Track update availability
  if (rum) {
    rum.trackCustomEvent('ServiceWorkerUpdate', {
      type: 'update-available',
      timestamp: Date.now()
    });
  }
  
  // Show update notification to user
  if (window.confirm('A new version of the app is available. Would you like to update?')) {
    swManager.skipWaitingAndReload();
  }
});

window.addEventListener('sw-first-install', () => {
  console.log('🎉 App is now available offline!');
  
  // Track first install
  if (rum) {
    rum.trackCustomEvent('ServiceWorkerInstall', {
      type: 'first-install',
      timestamp: Date.now()
    });
  }
  
  // You could show a toast notification here
  // Example: showToast('App is now available offline!');
});

window.addEventListener('app-offline', () => {
  console.log('📱 App is now offline - cached content will be served');
  
  // Track offline state
  if (rum) {
    rum.trackCustomEvent('NetworkStatus', {
      type: 'offline',
      timestamp: Date.now()
    });
  }
  
  // You could show an offline indicator
  // Example: showOfflineIndicator();
});

window.addEventListener('app-online', () => {
  console.log('🌐 App is back online');
  
  // Track online state
  if (rum) {
    rum.trackCustomEvent('NetworkStatus', {
      type: 'online',
      timestamp: Date.now()
    });
  }
  
  // You could hide offline indicator and sync data
  // Example: hideOfflineIndicator(); syncPendingData();
});

// Track user engagement
let engagementStartTime = Date.now();
let isUserActive = true;

// Track page engagement time
const trackEngagement = () => {
  if (isUserActive && rum) {
    const engagementTime = Date.now() - engagementStartTime;
    
    rum.trackCustomEvent('UserEngagement', {
      type: 'session-duration',
      duration: engagementTime,
      timestamp: Date.now()
    });
  }
};

// Track user activity
const resetEngagementTimer = () => {
  isUserActive = true;
  engagementStartTime = Date.now();
};

// User interaction events
['click', 'scroll', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetEngagementTimer, { passive: true });
});

// Track engagement every 30 seconds
setInterval(trackEngagement, 30000);

// Track engagement on page unload
window.addEventListener('beforeunload', trackEngagement);

// Track page visibility for engagement
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isUserActive = false;
    trackEngagement();
  } else {
    resetEngagementTimer();
  }
});

// Development performance debugging
if (process.env.NODE_ENV === 'development') {
  // Add global functions for debugging
  window.getPerformanceMetrics = () => {
    return JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
  };
  
  window.getRUMSummary = () => {
    return rum ? rum.getSessionSummary() : null;
  };
  
  window.clearPerformanceData = () => {
    localStorage.removeItem('performanceMetrics');
    console.log('Performance data cleared');
  };
  
  // Log performance summary periodically
  setInterval(() => {
    console.log('📊 Current Performance Summary:', window.getPerformanceMetrics().slice(-5));
    if (rum) {
      console.log('🔍 RUM Session Summary:', rum.getSessionSummary());
    }
  }, 60000); // Every minute
}
