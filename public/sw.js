/* PulsePM service worker
 *
 * What it does:
 *  - keeps the app shell assets (scripts, styles, icons) so repeat visits load fast
 *  - shows a friendly offline page when a page cannot be reached
 *
 * What it deliberately does NOT do:
 *  - it never stores API responses, task data or any signed-in page, so nobody can see
 *    another user's data from the cache, and data is always fresh when you are online.
 *
 * Bump VERSION to force every device to drop its old cache on the next visit.
 */
const VERSION = 'v1';
const STATIC_CACHE = `pulsepm-static-${VERSION}`;
const OFFLINE_URL = '/offline';
const PRECACHE = [OFFLINE_URL, '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

const isStaticAsset = (url) =>
  url.pathname.startsWith('/_next/static/') ||
  /\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/i.test(url.pathname);

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // The API and uploads live on another origin; leave all cross-origin traffic alone
  if (url.origin !== self.location.origin) return;

  // Page loads: always try the network first so users see current data
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL).then((cached) => cached || Response.error()))
    );
    return;
  }

  // Build output and images: serve from cache, refresh in the background
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
