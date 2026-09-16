const CACHE_NAME = 'fitbod-pro-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (
    url.origin === location.origin ||
    url.hostname.includes('fonts.') ||
    url.hostname.includes('gstatic.') ||
    url.hostname.includes('githubusercontent.') ||
    url.hostname.includes('tailwindcss.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Xử lý khi Sếp chạm vào thông báo ngoài màn hình khóa -> Mở lại app ngay lập tức
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// Nhận lệnh bắn thông báo từ background timer
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_REST_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
});
