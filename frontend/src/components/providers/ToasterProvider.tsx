'use client';

import { Toaster } from 'sonner';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
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
