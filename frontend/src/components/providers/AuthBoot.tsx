'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';

/**
 * Thin mount-once component that syncs the auth store's user object
 * with the server's authoritative profile after authentication.
 *
 * Why this is the source of truth for the avatar: the Navbar and the
 * home PostComposer render <UserAvatar/> which reads `avatarUrl` from
 * the auth store. The various login paths (password, OAuth callback,
 * hard refresh) don't all reliably populate `avatarUrl`, so this
 * component fetches the full profile once per authenticated user and
 * merges `avatarUrl` + `displayName` + `fullName` + … back into the
 * store — guaranteeing those surfaces show the right avatar after
 * logout→login, not just within the upload session.
 *
 * It re-syncs whenever the user id changes (covers logout→login as a
 * different or same user) and is otherwise idempotent — at most one
 * request per user per page load. Silent on failure (no toast).
 */
export default function AuthBoot() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  // Track the last user id we've synced so we fetch once per user
  // (not on every render) yet always refresh when the user changes.
  const lastSyncedUserId = useRef<number | null>(null);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || userId == null) return;
    if (lastSyncedUserId.current === userId) return;
    lastSyncedUserId.current = userId;

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
        // Allow a retry on a later render if the fetch failed.
        if (lastSyncedUserId.current === userId) lastSyncedUserId.current = null;
      });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, isAuthenticated, userId, updateProfile]);

  return null;
}
