const APP_CACHE = 'girlcare-app-v1';
const RUNTIME_CACHE = 'girlcare-runtime-v1';

const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => ![APP_CACHE, RUNTIME_CACHE].includes(cacheName))
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, cloned));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) {
            return cachedPage;
          }

          const appShell = await caches.match('/index.html');
          return appShell;
        }),
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            const cloned = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, cloned));
            return response;
          })
          .catch(() => cached);

        return cached || networkFetch;
      }),
    );
  }
});

self.addEventListener('push', (event) => {
  let payload = { title: 'GirlCare Reminder', body: 'You have a new reminder.' };

  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch {
    // Use fallback payload.
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'GirlCare Reminder', {
      body: payload.body || 'You have a new reminder.',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'girlcare-reminder-push',
    }),
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type !== 'SHOW_REMINDER') {
    return;
  }

  const title = data.title || 'GirlCare Reminder';
  const body = data.body || 'You have a new reminder.';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'girlcare-reminder-local',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => 'focus' in client);
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow('/cycle-tracker');
    }),
  );
});
