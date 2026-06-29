'use client';
import { useEffect } from 'react';

// Service worker DISABLED. The old PWA SW cached JS/CSS cache-first and left
// desktops stuck on a stale bundle (dark Notes theme / old shared view) while
// mobile + localhost showed the new code. Instead of registering a SW we now
// actively unregister any existing one and wipe its caches, so every visitor
// loads fresh from the network. `/sw.js` is now a kill-switch that does the
// same for tabs still controlled by the old worker. Re-introduce a versioned
// SW later only if PWA/offline support is genuinely needed.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});

    if (typeof caches !== 'undefined') {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch(() => {});
    }
  }, []);
  return null;
}
