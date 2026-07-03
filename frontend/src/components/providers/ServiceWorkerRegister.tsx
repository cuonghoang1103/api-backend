'use client';
import { useEffect } from 'react';

// PWA service worker registration (re-enabled 2026-07-03).
//
// The previous version of this file DISABLED the SW after the 2026-07-02
// stale-cache incident. The new `/sw.js` is network-first for HTML/API and
// only cache-first for content-hashed immutable assets, so it can't pin
// clients to an old bundle. This component:
//   1. registers /sw.js,
//   2. periodically checks for an updated worker, and
//   3. auto-reloads ONCE when a new worker takes control (app-store-style
//      auto-update), while never reloading on the very first install.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Older iOS only reports installed-PWA mode via the legacy
    // `navigator.standalone` flag, not the `display-mode: standalone` media
    // query. Stamp a class so globals.css can apply the safe-area rules
    // through either signal (see the standalone block in globals.css).
    if ((navigator as { standalone?: boolean }).standalone === true) {
      document.documentElement.classList.add('pwa-standalone');
    }

    if (!('serviceWorker' in navigator)) return;
    // Skip on localhost dev to avoid caching the dev server; only run on
    // https (or the http->https-upgraded production origin).
    if (process.env.NODE_ENV === 'development') return;

    // Whether a SW already controlled this page at load time. If not, the
    // first `controllerchange` is just the initial install — don't reload.
    const hadController = !!navigator.serviceWorker.controller;
    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return; // first install → no reload
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    let cleanup: (() => void) | undefined;
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for a new worker whenever the tab regains focus and once an
        // hour, so long-lived tabs still pick up new deploys.
        const check = () => registration.update().catch(() => {});
        const onVisible = () => {
          if (document.visibilityState === 'visible') check();
        };
        document.addEventListener('visibilitychange', onVisible);
        const interval = window.setInterval(check, 60 * 60 * 1000);

        // Clean up listeners if the component ever unmounts.
        cleanup = () => {
          document.removeEventListener('visibilitychange', onVisible);
          window.clearInterval(interval);
        };
      })
      .catch(() => {
        /* registration failed (e.g. private mode) — app still works */
      });

    return () => {
      cleanup?.();
    };
  }, []);

  return null;
}
