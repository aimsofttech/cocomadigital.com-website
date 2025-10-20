// Service Worker for Cocoma Digital Website
// Implements advanced caching strategies for optimal performance

const CACHE_NAME = 'cocoma-digital-v1.0.0';
const STATIC_CACHE_NAME = 'cocoma-static-v1.0.0';
const API_CACHE_NAME = 'cocoma-api-v1.0.0';
const IMAGE_CACHE_NAME = 'cocoma-images-v1.0.0';

// Cache duration in milliseconds
const CACHE_STRATEGIES = {
  STATIC: 30 * 24 * 60 * 60 * 1000, // 30 days
  API: 5 * 60 * 1000, // 5 minutes
  IMAGES: 7 * 24 * 60 * 60 * 1000, // 7 days
  HTML: 24 * 60 * 60 * 1000, // 24 hours
};

// URLs to cache immediately on install
const CRITICAL_CACHE_URLS = [
  '/',
  '/static/css/main.846d9a0d.css',
  '/static/js/main.df418f56.js',
  '/manifest.json',
  '/Images/app_logo.svg',
  '/Images/app_name.svg',
  '/Images/logoWhite.svg',
];

// API endpoints to cache
const API_ENDPOINTS = [
  'https://admin.cocomadigital.com/public/api/home',
  'https://admin.cocomadigital.com/public/api/categories',
  'https://admin.cocomadigital.com/public/api/service_home_priority',
];

// Install event - Cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical static resources
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('📦 Service Worker: Caching critical resources');
        // Use try-catch to handle missing URLs gracefully
        return Promise.all(
          CRITICAL_CACHE_URLS.map(url => {
            return cache.add(url).catch((error) => {
              console.warn(`⚠️ Service Worker: Failed to cache ${url}`, error.message);
              // Don't fail installation if some URLs can't be cached
              return Promise.resolve();
            });
          })
        );
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== API_CACHE_NAME &&
              cacheName !== IMAGE_CACHE_NAME
            ) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - Implement caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(handleFetchRequest(request));
});

// Main fetch handler with different strategies
async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // API requests - Network first with cache fallback
    if (url.hostname === 'admin.cocomadigital.com') {
      return await handleApiRequest(request);
    }
    
    // Static assets - Cache first
    if (isStaticAsset(url.pathname)) {
      return await handleStaticAsset(request);
    }
    
    // Images - Cache first with fallback
    if (isImageRequest(url.pathname)) {
      return await handleImageRequest(request);
    }
    
    // HTML pages - Network first with cache fallback
    if (request.headers.get('accept')?.includes('text/html')) {
      return await handleHtmlRequest(request);
    }
    
    // Default: Network first
    return await handleNetworkFirst(request);
    
  } catch (error) {
    console.error('🚨 Service Worker: Fetch error:', error);
    return await handleOfflineFallback(request);
  }
}

// API Request Handler - Network first with cache fallback
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      console.log('🌐 Service Worker: API response cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('📱 Service Worker: Network failed, trying cache for:', request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('✅ Service Worker: Served from API cache:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Static Asset Handler - Cache first
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('⚡ Service Worker: Served from static cache:', request.url);
    return cachedResponse;
  }
  
  // Not in cache, fetch and cache
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
    console.log('📦 Service Worker: Static asset cached:', request.url);
  }
  
  return networkResponse;
}

// Image Request Handler - Cache first with long expiry
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('🖼️ Service Worker: Served from image cache:', request.url);
    return cachedResponse;
  }
  
  // Not in cache, fetch and cache
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
    console.log('🖼️ Service Worker: Image cached:', request.url);
  }
  
  return networkResponse;
}

// HTML Request Handler - Network first with cache fallback
async function handleHtmlRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      console.log('📄 Service Worker: HTML cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('📄 Service Worker: Served from HTML cache:', request.url);
      return cachedResponse;
    }
    throw error;
  }
}

// Network First Handler
async function handleNetworkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Offline Fallback Handler
async function handleOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For HTML requests, try to serve cached version or offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match('/');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a basic offline response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Cocoma Digital</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline-message { max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // For other requests, return network error
  return new Response('Network error', { status: 408 });
}

// Utility functions
function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/static/') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf') ||
    pathname.endsWith('.eot')
  );
}

function isImageRequest(pathname) {
  return (
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.includes('/Images/')
  );
}

// Background sync for API requests (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'api-sync') {
    event.waitUntil(syncApiRequests());
  }
});

async function syncApiRequests() {
  // Implementation for background sync of failed API requests
  console.log('🔄 Service Worker: Background sync triggered');
}

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/Images/app_logo.svg',
      badge: '/Images/app_logo.svg',
      data: data.url
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches());
  }
});

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentTime = Date.now();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      const dateHeader = response.headers.get('date');
      
      if (dateHeader) {
        const cacheDate = new Date(dateHeader).getTime();
        const age = currentTime - cacheDate;
        
        // Remove items older than their strategy allows
        if (
          (cacheName === API_CACHE_NAME && age > CACHE_STRATEGIES.API) ||
          (cacheName === IMAGE_CACHE_NAME && age > CACHE_STRATEGIES.IMAGES) ||
          (cacheName === STATIC_CACHE_NAME && age > CACHE_STRATEGIES.STATIC)
        ) {
          await cache.delete(request);
          console.log('🗑️ Service Worker: Cleaned up old cache entry:', request.url);
        }
      }
    }
  }
}

console.log('🚀 Service Worker: Loaded and ready!');