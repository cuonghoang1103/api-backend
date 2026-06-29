// ============================================================
// CuongThai Service Worker — KILL SWITCH
// ============================================================
// The previous PWA service worker cached JS/CSS cache-first and got stuck on
// desktops: production kept serving the pre-fix bundle (dark Notes theme, old
// shared view) while mobile/localhost showed the new code. Because sw.js is
// served `no-cache`, every existing client re-checks this file on navigation,
// installs this kill-switch, and on activate it: deletes ALL caches,
// unregisters itself, then reloads open tabs so they reload straight from the
// network (HTML is no-cache, chunks are content-hashed → always fresh).
//
// The app no longer registers a service worker (see ServiceWorkerRegister.tsx),
// so once a client runs this once there is nothing left to get stuck. If PWA
// offline support is wanted again later, reintroduce a versioned SW carefully.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch {
        /* ignore */
      }
      try {
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
          // Reload each open tab so it picks up fresh, SW-free assets.
          client.navigate(client.url);
        }
      } catch {
        /* ignore */
      }
    })()
  );
});

// No fetch handler on purpose: requests go straight to the network.
