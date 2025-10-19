// Service Worker Registration and Management
// Handles registration, updates, and communication with the service worker

class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isOnline = navigator.onLine;
    this.setupNetworkListeners();
  }

  // Initialize and register service worker
  async init() {
    if (!('serviceWorker' in navigator)) {
      console.warn('🚫 Service Worker not supported in this browser');
      return false;
    }

    try {
      console.log('🔧 Service Worker: Registering...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Always check for updates
      });

      console.log('✅ Service Worker: Registered successfully');

      // Handle different registration states
      if (this.registration.installing) {
        console.log('🔧 Service Worker: Installing...');
        this.trackInstalling(this.registration.installing);
      } else if (this.registration.waiting) {
        console.log('⏳ Service Worker: Waiting...');
        this.showUpdateAvailable();
      } else if (this.registration.active) {
        console.log('🚀 Service Worker: Active and ready!');
        this.notifyActiveServiceWorker();
      }

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker: Update found!');
        this.trackInstalling(this.registration.installing);
      });

      // Check for updates every 60 seconds
      setInterval(() => {
        this.registration.update();
      }, 60000);

      return true;
    } catch (error) {
      console.error('🚨 Service Worker: Registration failed:', error);
      return false;
    }
  }

  // Track service worker installation
  trackInstalling(worker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New service worker available
          console.log('🆕 Service Worker: New version available!');
          this.showUpdateAvailable();
        } else {
          // Service worker installed for the first time
          console.log('✅ Service Worker: Installed for the first time!');
          this.notifyFirstInstall();
        }
      }
    });
  }

  // Show update available notification
  showUpdateAvailable() {
    // You can customize this to show a toast notification or modal
    console.log('🔄 Service Worker: Update available - reload to get the latest version');
    
    // Dispatch custom event for the app to handle
    window.dispatchEvent(new CustomEvent('sw-update-available', {
      detail: { registration: this.registration }
    }));
  }

  // Skip waiting and reload
  async skipWaitingAndReload() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  // Notify when service worker is first installed
  notifyFirstInstall() {
    console.log('🎉 Service Worker: App is now available offline!');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('sw-first-install'));
  }

  // Notify when service worker is active
  notifyActiveServiceWorker() {
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('sw-active'));
  }

  // Setup network status listeners
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Network: Back online');
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📱 Network: Gone offline');
      this.handleOffline();
    });
  }

  // Handle online state
  handleOnline() {
    // Sync any pending data
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register('api-sync');
      });
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('app-online'));
  }

  // Handle offline state
  handleOffline() {
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('app-offline'));
  }

  // Get cache information
  async getCacheInfo() {
    if (!('caches' in window)) {
      return null;
    }

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheInfo[cacheName] = {
          count: keys.length,
          urls: keys.map(request => request.url)
        };
      }

      return cacheInfo;
    } catch (error) {
      console.error('Error getting cache info:', error);
      return null;
    }
  }

  // Clear all caches
  async clearAllCaches() {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('🗑️ Service Worker: All caches cleared');
      return true;
    } catch (error) {
      console.error('Error clearing caches:', error);
      return false;
    }
  }

  // Send message to service worker
  async sendMessage(message) {
    if (!this.registration || !this.registration.active) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.registration.active.postMessage(message, [messageChannel.port2]);
    });
  }

  // Get service worker status
  getStatus() {
    if (!('serviceWorker' in navigator)) {
      return 'not-supported';
    }

    if (!this.registration) {
      return 'not-registered';
    }

    if (this.registration.installing) {
      return 'installing';
    }

    if (this.registration.waiting) {
      return 'waiting';
    }

    if (this.registration.active) {
      return 'active';
    }

    return 'unknown';
  }
}

// Create global instance
const swManager = new ServiceWorkerManager();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => swManager.init());
} else {
  swManager.init();
}

// Export for use in other modules
export default swManager;