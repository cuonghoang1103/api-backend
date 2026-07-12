'use client';

/**
 * useMusicAccess — whether the current viewer may see the /music page.
 *
 * Driven by the global mode (ADMIN_ONLY | SPECIFIC | EVERYONE) + the
 * per-user flag, resolved server-side at GET /music/access. Stays live:
 * useNotificationSocket re-broadcasts the `music:access-changed` socket
 * event as a window event, which we listen for and refetch — so the nav
 * item + route guard update in realtime when an admin changes settings.
 *
 * Defaults to hasAccess=false while loading, so the /music item stays
 * hidden until we've confirmed the viewer is allowed.
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { musicAccessApi, type MusicAccessMode } from '@/lib/api';

export function useMusicAccess() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['music-access'],
    queryFn: async () => (await musicAccessApi.check()).data.data,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handler = () => { void refetch(); };
    window.addEventListener('music-access-changed', handler);
    return () => window.removeEventListener('music-access-changed', handler);
  }, [refetch]);

  return {
    hasAccess: data?.hasAccess ?? false,
    mode: (data?.mode ?? 'ADMIN_ONLY') as MusicAccessMode,
    isLoading,
  };
}
