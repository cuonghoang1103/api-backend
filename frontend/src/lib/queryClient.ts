import { QueryClient } from '@tanstack/react-query';

/**
 * Shared QueryClient.
 *
 * TanStack's provider creates its client via useState (one per browser
 * tab), which is correct — but that instance isn't reachable from code
 * OUTSIDE React, e.g. our Zustand stores. Those stores mutate the same
 * server data (playlists, etc.) and must be able to invalidate the
 * matching queries so the TanStack-driven UI updates in real time.
 *
 * We expose a browser singleton for exactly that. On the server we return
 * a fresh client per call so request state never leaks between users
 * (the App-Router pattern).
 */
function makeClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: { retry: 1 },
    },
  });
}

let browserClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') return makeClient(); // server: per-request
  if (!browserClient) browserClient = makeClient();
  return browserClient;
}
