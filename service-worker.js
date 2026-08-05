'use strict';

const CACHE_VERSION = 'weather-dashboard-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/weather.js',
  '/assets/js/weatherUtils.js',
  '/assets/js/weatherAlerts.js',
  '/assets/js/themeManager.js',
  '/assets/js/comparisonManager.js',
  '/assets/js/config.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(error => {
        console.log('Cache installation error:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Try network request
      return fetch(request)
        .then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache successful API responses
          if (request.url.includes('api.openweathermap.org')) {
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Return offline page or cached response
          return caches.match('/index.html');
        });
    })
  );
});
