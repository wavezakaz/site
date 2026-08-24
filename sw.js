self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Пропускаем все сетевые запросы штатными средствами
  e.respondWith(fetch(e.request));
});
