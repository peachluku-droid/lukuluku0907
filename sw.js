// Peach Luku Service Worker
const CACHE = 'peachluku-v1';
const PRECACHE = ['/write.html', '/auth.html', '/navbar.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network first — luôn lấy bản mới nhất, chỉ fallback cache khi offline
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
