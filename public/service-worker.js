// Versão automática baseada em timestamp de build
const VERSION = '{{BUILD_VERSION}}';
const CACHE_NAME = `futebolsort-v${VERSION}`;

// Use relative paths so deployment under a base path (e.g., /futebol/) works
const ASSETS_TO_CACHE = [
  'index.html',
  'trophy.svg'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando versão:', VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        console.log('Alguns assets não puderam ser cacheados');
      });
    })
  );
  // Force o novo service worker a ativar imediatamente
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Network-first strategy para HTML e API requests
  if (event.request.url.includes('.html') || event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first para outros assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        return caches.match('index.html');
      });
    })
  );
});
