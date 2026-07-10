'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { getQueryClient } from '@/lib/queryClient';

/**
 * TanStack Query provider — enables caching for music data.
 *
 * Configuration:
 * - staleTime: 5 minutes (music metadata rarely changes)
 * - gcTime: 30 minutes (keep cached data around)
 * - retry: 2 attempts on failure
 * - refetchOnWindowFocus: false (don't interrupt playback)
 */
export default function TanStackQueryProvider({ children }: { children: React.ReactNode }) {
  // Use the shared browser singleton so code outside React (Zustand
  // stores) can invalidate the same cache — keeps the music playlist UI
  // in sync no matter which surface triggered the change.
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
