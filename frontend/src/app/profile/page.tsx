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
  const { user, isAuthenticated: isBackendAuth } = useAuthStore();

  useEffect(() => {
    if (!user?.id) return;
    // Hand off to the same tabbed view the public route uses.
    // Passing the id explicitly (rather than relying on the
    // useParams hook inside ProfileDetail) means the same
    // component instance serves both routes.
    router.replace(`/profile/${user.id}/v2`);
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