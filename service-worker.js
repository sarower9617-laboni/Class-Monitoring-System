const CACHE_NAME = 'class-monitor-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  const req = evt.request;
  if (req.mode === 'navigate') {
    evt.respondWith(fetch(req).catch(() => caches.match('/index.html')));
    return;
  }
  evt.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});