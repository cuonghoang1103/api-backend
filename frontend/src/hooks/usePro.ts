'use client';

/**
 * usePro — the current viewer's effective Pro status.
 *
 * `effective` = admin OR a valid (non-expired) Pro membership. Drives: the
 * "Update Pro" menu item, the logo/avatar PRO badge, and the client-side locks
 * on AI chat Pro/Max, Interview AI grading, and Academy. Guests are never Pro.
 *
 * Backend enforces all of these too — this hook only controls the UX (locks +
 * redirects to /pro), never the actual entitlement.
 */
import { useQuery } from '@tanstack/react-query';
import { proApi, type ProStatus } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const GUEST: ProStatus = { isAdmin: false, isPro: false, effective: false, lifetime: false, expiresAt: null, source: null };

export function usePro() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pro-status'],
    queryFn: async () => (await proApi.status()).data.data,
    enabled: isAuthenticated,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  return {
    status: isAuthenticated ? (data ?? GUEST) : GUEST,
    isPro: isAuthenticated ? (data?.effective ?? false) : false,
    isLoading: isAuthenticated ? isLoading : false,
    refetch,
  };
}
