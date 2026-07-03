// ============================================================
// CuongThai Service Worker — versioned, network-first (2026-07-03)
// ============================================================
// Re-introduces PWA/offline support AFTER the 2026-07-02 stale-cache
// incident, this time built so it can NEVER get stuck on an old bundle:
//
//   • HTML / navigations  → NETWORK-FIRST. The network response always
//     wins; the cache is only a fallback when the device is offline. This
//     is the exact opposite of the old worker (which served HTML
//     cache-first and pinned every client to a stale build).
//   • /_next/static/*     → CACHE-FIRST, but SAFE because those files are
//     content-hashed & immutable (a new build ships new filenames).
//   • images/fonts/icons  → stale-while-revalidate (fast, self-healing).
//   • /api, /_next/data, /monitoring, cross-origin → NOT intercepted
//     (always straight to network, never cached → no stale data).
//
// On every deploy bump VERSION. `install` skipWaiting + `activate`
// clients.claim make the new worker take over immediately; the page
// (ServiceWorkerRegister.tsx) reloads once on controllerchange so users
// auto-update like an app-store app, with fresh > stale as the failure mode.

const VERSION = 'v2-2026-07-03';
const CACHE = `ct-cache-${VERSION}`;
const OFFLINE_URL = '/offline';

// Precache the offline fallback page + core icons. Best-effort: a failure
// here must NOT block installation.
const PRECACHE_URLS = [OFFLINE_URL, '/manifest.json', '/favicon.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE);
        await cache.addAll(PRECACHE_URLS);
      } catch {
        /* offline install or a 404 on one URL — ignore, don't block */
      }
      // Activate this version immediately instead of waiting for all tabs
      // to close. Combined with clients.claim below this makes updates apply
      // on the next load, not "sometime later".
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop every cache that isn't the current version.
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Let the page trigger an immediate takeover (used by the update prompt).
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(request);
    // Only cache successful, basic (same-origin) responses.
    if (fresh && fresh.ok && fresh.type === 'basic') {
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Navigations fall back to the offline page.
    if (request.mode === 'navigate') {
      const offline = await cache.match(OFFLINE_URL);
      if (offline) return offline;
    }
    throw new Error('network-first: no network and no cache');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh && fresh.ok) cache.put(request, fresh.clone());
  return fresh;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((fresh) => {
      if (fresh && fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    })
    .catch(() => null);
  return cached || (await network) || fetch(request);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  // Never touch cross-origin (R2 media, YouTube, Sentry, …).
  if (url.origin !== self.location.origin) return;

  // Never cache dynamic / auth-sensitive endpoints — always network.
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/data') ||
    url.pathname.startsWith('/monitoring') ||
    url.pathname.startsWith('/sw.js')
  ) {
    return;
  }

  // HTML navigations: network-first with offline fallback.
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  // Content-hashed, immutable build assets: cache-first is safe.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Static media/fonts/icons from /public: stale-while-revalidate.
  if (/\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico|woff2?|ttf|otf)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Everything else: let the browser handle it (straight to network).
});
