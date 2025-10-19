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

// Import Service Worker Manager
import swManager from "./utils/serviceWorkerManager";

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

// Enhanced Web Vitals reporting with service worker integration
reportWebVitals((metric) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vitals:', metric);
  }
  
  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // You can send this data to Google Analytics, LogRocket, etc.
    // Example: gtag('event', metric.name, { value: metric.value });
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
  
  // Show update notification to user
  if (window.confirm('A new version of the app is available. Would you like to update?')) {
    swManager.skipWaitingAndReload();
  }
});

window.addEventListener('sw-first-install', () => {
  console.log('🎉 App is now available offline!');
  
  // You could show a toast notification here
  // Example: showToast('App is now available offline!');
});

window.addEventListener('app-offline', () => {
  console.log('📱 App is now offline - cached content will be served');
  
  // You could show an offline indicator
  // Example: showOfflineIndicator();
});

window.addEventListener('app-online', () => {
  console.log('🌐 App is back online');
  
  // You could hide offline indicator and sync data
  // Example: hideOfflineIndicator(); syncPendingData();
});
