const CACHE_NAME = 'hub-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/main.js'
];

// Install event - caches the core files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch event - serves files from cache if offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});