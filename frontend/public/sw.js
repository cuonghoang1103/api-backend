// ============================================================
// CuongThai Service Worker (PWA)
// ============================================================
// Provides offline shell, app caching, and basic asset
// pre-fetching so the page is usable as an installed PWA
// even on flaky mobile networks. Network-first for HTML
// (always fresh) and cache-first for static assets.

const CACHE_NAME = 'cuongthai-v2';
const PRECACHE = [
 '/',
 '/manifest.json',
 '/favicon.png',
 '/offline',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never cache API or socket.io or auth
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io/')) return;

  // Network-first for HTML (always fresh)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match('/offline').then((o) => o || new Response('Offline', { status: 503 })))
        )
    );
    return;
  }

  // Cache-first for static assets
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/uploads/') || /\.(png|jpg|jpeg|svg|webp|woff2?|css|js)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        }).catch(() => new Response('Asset offline', { status: 503 }))
      )
    );
  }
});
