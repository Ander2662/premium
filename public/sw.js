const CACHE_VERSION = 'crucero-v3';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

const APP_SHELL_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_SHELL_CACHE, IMAGE_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isRemoteImage = url.origin !== self.location.origin &&
    (url.pathname.includes('Special:FilePath') || request.destination === 'image');

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put(request, cloned));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/');
        })
    );
    return;
  }

  if (url.pathname.startsWith('/photos/') || isRemoteImage) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (!response.ok) return response;
            const cloned = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, cloned));
            return response;
          })
          .catch(() => Response.error());
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (url.origin === self.location.origin) {
            const cloned = response.clone();
            caches.open(APP_SHELL_CACHE).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() => caches.match('/'));
    })
  );
});
