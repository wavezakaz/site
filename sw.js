self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Базовый перехват сетевых запросов
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      // Резервный вариант на случай потери сети
      return caches.match(e.request);
    })
  );
});

// Обработка входящих Push-уведомлений в фоновом режиме
self.addEventListener('push', (e) => {
  let data = { title: 'Пульс Заказов', body: 'Новое уведомление' };
  
  if (e.data) {
    try {
      data = e.data.json();
    } catch (err) {
      data.body = e.data.text();
    }
  }

  const options = {
    body: data.body || data.notification?.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png?v=2',
    badge: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png?v=2',
    vibrate: [200, 100, 200]
  };

  const title = data.title || data.notification?.title || 'Пульс Заказов';

  e.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Клик по уведомлению открывает приложение
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});
