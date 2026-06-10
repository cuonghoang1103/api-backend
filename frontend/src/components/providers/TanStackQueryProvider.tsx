'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

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
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes — music metadata is relatively stable
            gcTime: 30 * 60 * 1000, // 30 minutes — keep cached data
            retry: 2,
            refetchOnWindowFocus: false, // Don't refetch when user returns from another tab — playback shouldn't be interrupted
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
