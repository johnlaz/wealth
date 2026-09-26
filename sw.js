// Financial Vault & Capital Allocator — Service Worker
// Caches the app shell (this HTML file + the CDN libraries it loads) so the
// app opens and functions offline. All financial data itself lives in
// IndexedDB/localStorage in the browser, not in this cache.

const CACHE_VERSION = 'finvault-v23';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  './icon-180.png',
  './favicon-32.png',
  './favicon-16.png'
];

// Third-party libraries the app depends on — cached so the app still loads
// and functions when there's no network connection.
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js',
  'https://unpkg.com/lucide@1.47.0'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // Cache same-origin app shell files (should all succeed)
      const shellPromise = cache.addAll(APP_SHELL).catch((err) => {
        console.warn('App shell caching had an issue:', err);
      });
      // Cache CDN assets individually — a single blocked/renamed CDN URL
      // shouldn't stop the whole install.
      const cdnPromises = CDN_ASSETS.map((url) =>
        fetch(url, { mode: 'no-cors' })
          .then((res) => cache.put(url, res))
          .catch((err) => console.warn('Could not cache', url, err))
      );
      return Promise.all([shellPromise, ...cdnPromises]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only ever handle GET requests. Groq API calls (and anything else that
  // isn't a plain page/asset fetch) pass straight through to the network,
  // untouched — never cached, never intercepted.
  if (req.method !== 'GET') return;
  if (req.url.includes('api.groq.com')) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Serve from cache immediately, but refresh in the background so
        // the next load picks up any update.
        const network = fetch(req)
          .then((res) => {
            if (res && res.status === 200) {
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, res.clone()));
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && req.url.startsWith(self.location.origin)) {
            const resClone = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
