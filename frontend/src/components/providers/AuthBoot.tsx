'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';

/**
 * Thin mount-once component that syncs the auth store's user object
 * with the server's authoritative profile on every full page load.
 *
 * Scenarios fixed:
 * 1. After hard refresh — Zustand rehydrates from localStorage but
 *    localStorage only has the slim user object set by `setAuth`.
 *    This calls `GET /profile` and merges `avatarUrl` + other fields
 *    back into the store.
 * 2. After the JWT cookie is refreshed server-side — the server may
 *    have the latest profile but the client store doesn't know.
 *
 * The effect is intentionally idempotent and silent (no toast on
 * failure) to avoid polluting the UX.
 */
export default function AuthBoot() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !user) return;

    // We only need to sync if the user is missing fields that come
    // from the full profile (avatarUrl is the primary one). If it's
    // already present we skip the extra request.
    if (user.avatarUrl) return;

    let cancelled = false;
    authApi
      .getProfile()
      .then((res) => {
        if (cancelled) return;
        if (res.data?.data) {
          updateProfile(res.data.data);
        }
      })
      .catch(() => {
        // silently ignore
      });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, isAuthenticated, user, updateProfile]);

  return null;
}
