'use client';

/**
 * /profile — Own profile route.
 *
 * Phase 6 — bug fix: this route used to render a static
 * "editing" UI (display name, password change, etc.) with no
 * posts list. Users reported that posts they created didn't
 * show up anywhere on their personal profile (only the home
 * feed). We now redirect /profile → /profile/[id]/v2 where the
 * tabbed ProfileDetail component lives — that view shows the
 * user's posts (with the same infinite-scroll, optimistic
 * likes, and post composers the home feed uses).
 *
 * The legacy editing features (display name, password change,
 * notification preferences, account deletion) have been
 * preserved at /settings/profile so the user can still reach
 * them. The navbar / Sidebar links point to /settings/profile.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      // Hand off to the same tabbed view the public route uses.
      // Passing the id explicitly (rather than relying on the
      // useParams hook inside ProfileDetail) means the same
      // component instance serves both routes.
      router.replace(`/profile/${user.id}/v2`);
      return;
    }
    // Guest: without this branch the page spun forever — `user.id` never
    // arrives when logged out, so the redirect above never fired
    // (reported 2026-07-06). The persisted auth state restores
    // synchronously from localStorage, but `isHydrated` never flips for
    // first-visit guests (no auth-storage key), so instead of waiting on
    // it we give restoration a beat and read the store directly.
    const t = setTimeout(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        router.replace('/login?next=/profile');
      }
    }, 400);
    return () => clearTimeout(t);
  }, [user?.id, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-text-muted">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-violet/20 border-t-neon-violet" />
        <span className="text-sm">Đang mở trang cá nhân…</span>
      </div>
    </div>
  );
}