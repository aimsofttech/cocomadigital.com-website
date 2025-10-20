import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App";
import "./index.css";
import store, { persistor } from "./Service/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Defer Bootstrap JS loading to improve TBT
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  } else {
    window.addEventListener('load', () => {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
    });
  }
}

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

// Defer all analytics and tracking to avoid blocking initial page load
// This dramatically improves LCP and TBT metrics
if (typeof window !== 'undefined') {
  // Load analytics after page is interactive
  if (document.readyState === 'complete') {
    // Page already loaded, defer with requestIdleCallback
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import('./utils/analytics').then(({ initializeAllTracking }) => {
          initializeAllTracking();
        });
      }, { timeout: 3000 });
    } else {
      setTimeout(() => {
        import('./utils/analytics').then(({ initializeAllTracking }) => {
          initializeAllTracking();
        });
      }, 3000);
    }
  } else {
    // Wait for page load
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          import('./utils/analytics').then(({ initializeAllTracking }) => {
            initializeAllTracking();
          });
        }, { timeout: 3000 });
      } else {
        setTimeout(() => {
          import('./utils/analytics').then(({ initializeAllTracking }) => {
            initializeAllTracking();
          });
        }, 3000);
      }
    });
  }
}
