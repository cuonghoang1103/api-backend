'use client';

import { Toaster } from 'sonner';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      // Sonner's default 32px offset drops a toast inside the band the fixed
      // navbar occupies, on the same side as the bell and avatar — it landed in
      // the nav's backdrop-blur and read as being stuck behind it. Clear the
      // nav (and the notch, which makes the nav taller on an installed PWA).
      offset="calc(var(--app-nav-h, 4rem) + 0.75rem)"
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
