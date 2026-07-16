'use client';

import { Toaster } from 'sonner';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      // Sonner's default offset drops a toast inside the band the fixed navbar
      // occupies — it landed in the nav's backdrop-blur and read as stuck
      // behind it. Clear the nav (plus the notch, which makes the nav taller on
      // an installed PWA). `offset` alone is NOT enough: sonner switches to a
      // separate `mobileOffset` (default 16px) under 600px — the exact devices
      // with a notch — so the first fix worked everywhere except on phones.
      offset="calc(var(--app-nav-h, 4rem) + 0.75rem)"
      mobileOffset="calc(var(--app-nav-h, 4rem) + 0.5rem)"
      expand={false}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: 'var(--darkcard, #12121a)',
          border: '1px solid var(--darkborder, #1e1e2e)',
          color: '#e2e8f0',
        },
      }}
    />
  );
}
