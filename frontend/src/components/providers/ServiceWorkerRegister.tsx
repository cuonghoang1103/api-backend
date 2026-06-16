'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    // Only register on https / localhost
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return;
    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          // Optional: listen for updates
          reg.addEventListener('updatefound', () => {
            const w = reg.installing;
            if (!w) return;
            w.addEventListener('statechange', () => {
              if (w.state === 'installed' && navigator.serviceWorker.controller) {
                // New SW available — could show a toast
                console.log('[PWA] New service worker available');
              }
            });
          });
        })
        .catch((err) => console.warn('[PWA] SW registration failed:', err));
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);
  }, []);
  return null;
}
