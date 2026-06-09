'use client';

/**
 * Renders children ONLY on the client after hydration.
 * On the server, renders null — preventing any SSR/client state mismatch.
 * Use this to wrap components that depend on localStorage, window, or
 * other browser-only state that Zustand persist stores haven't rehydrated yet.
 *
 * This replaces the skipHydration + manual rehydrate pattern which causes
 * SSR prerender crashes when components read empty store state.
 */
import { useState, useEffect, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : <>{fallback}</>;
}
