const CACHE_NAME = 'smarthire-pwa-v2';

// Precached app shell, icons, manifest, and local workers
const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/pdfjs/pdf.worker.min.mjs'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SmartHire SW] Removing stale cache version:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Bypass API endpoints and non-GET requests - never cache API requests
  if (url.pathname.startsWith('/api') || event.request.method !== 'GET') {
    return;
  }

  // 2. Navigation requests: Network-first, fallback to cached '/' for offline shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/').then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // 3. Static assets & bundles (JS, CSS, fonts, images, web workers): Cache-first with network fallback & auto-caching
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.pathname.includes('/assets/') ||
             url.pathname.includes('/pdfjs/') ||
             url.pathname.endsWith('.js') ||
             url.pathname.endsWith('.css') ||
             url.pathname.endsWith('.png') ||
             url.pathname.endsWith('.svg') ||
             url.pathname.endsWith('.woff2'))
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((fetchErr) => {
          // If offline and request is an image or icon, attempt fallback
          if (url.pathname.endsWith('.png') || url.pathname.endsWith('.svg')) {
            return caches.match('/pwa-192x192.png');
          }
          throw fetchErr;
        });
    })
  );
});
