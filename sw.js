// Legacy cleanup worker.
// Before the landing page existed, the app itself lived at the repo root and
// registered a service worker here. The app now lives in /app with its own
// worker, so this file exists only to retire the old root-scoped one: when an
// existing install picks it up, it removes itself and the stale caches
// (finvault-v23 and earlier) so the landing page isn't served from an old cache.
// Safe to delete once old installs have had time to update.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => /^finvault-v\d+$/.test(k) && parseInt(k.split('-v')[1], 10) <= 23)
        .map((k) => caches.delete(k))
    );
    await self.registration.unregister();
  })());
});
