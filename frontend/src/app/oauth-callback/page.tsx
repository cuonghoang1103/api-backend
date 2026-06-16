'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/**
 * OAuth callback page — NextAuth redirects here after OAuth sign-in.
 *
 * After the NextAuth session is established, we:
 * 1. Call /api/auth/oauth/token to set the backend_token cookie (with FRESH role from DB)
 * 2. Fetch /api/v1/profile to get the CURRENT role from the backend DB
 * 3. Redirect to /admin or / based on the FRESH role (not the cached NextAuth JWT role)
 */
function OAuthCallbackContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get('redirect');
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (status === 'loading' || redirected) return;
    if (status === 'unauthenticated' || !session?.user) {
      router.replace('/login');
      return;
    }

    const setupAndRedirect = async () => {
      // Step 1: Set the backend_token cookie with a FRESH JWT from the backend.
      // The backend reads the user's CURRENT role from the DB.
      let backendToken = '';
      let tokenPayload: { data?: { userId?: number; roles?: string[]; role?: string } } = {};
      // CRITICAL: declare freshRoles / freshRole BEFORE the step-1 fetch
      // uses them at line `freshRoles = data.data.roles` (hoisting rule
      // for `let` is "TDZ until declaration" — assigning to an undeclared
      // `let` throws ReferenceError, which is caught silently by the
      // try/catch and breaks the whole OAuth flow). Same issue would
      // affect `freshRole` if we ever set it before declaring.
      let freshRole = 'USER';
      let freshRoles: string[] = [];
      try {
        const res = await fetch('/api/auth/oauth/token', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          backendToken = data?.token ?? '';
          tokenPayload = data;
          // Capture fresh roles from token endpoint response as a fallback
          // if the profile fetch below fails.
          if (data?.data?.roles?.length) {
            freshRoles = data.data.roles;
          }
        }
      } catch (err) {
        console.error('[oauth-callback] Failed to set backend_token:', err);
      }

      // Step 2: Fetch the FRESH profile from the backend to get the CURRENT role.
      // This reflects any role changes made by the admin (cuong03dx) immediately.
      const freshEmail = session.user.email;
      if (backendToken) {
        try {
          const profileRes = await fetch('/api/v1/profile', {
            credentials: 'include',
            headers: { Authorization: `Bearer ${backendToken}` },
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            freshRoles = profileData?.data?.roles ?? [];
            const isAdmin = freshRoles.some(
              (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN'
            );
            freshRole = isAdmin ? 'ADMIN' : 'USER';
            // (debug log removed 2026-06-17)
          }
        } catch (err) {
          console.error('[oauth-callback] Failed to fetch profile:', err);
        }
      }

      // Dispatch auth-updated so Navbar gets the fresh role immediately
      if (freshEmail && typeof window !== 'undefined') {
        try {
          const existingRaw = localStorage.getItem('user');
          const existingUser = existingRaw ? JSON.parse(existingRaw) : {};
          localStorage.setItem('user', JSON.stringify({
            ...existingUser,
            email: freshEmail,
            roles: freshRoles,
          }));
        } catch {}

        // CRITICAL: also call setAuth on the Zustand store so OAuth users
        // are treated as authenticated throughout the app. Without this,
        // gates like `if (!isAuthenticated) showLoginPrompt()` (Playlist,
        // Upload, etc.) fire for OAuth users even though the backend
        // backend_token cookie is set and NextAuth session is valid.
        try {
          const userId = tokenPayload?.data?.userId
            || parseInt(String((session.user as { id?: string })?.id ?? '0'), 10)
            || 0;
          useAuthStore.getState().setAuth({
            success: true,
            message: 'OAuth login',
            userId,
            username: session.user.name ?? freshEmail.split('@')[0],
            email: freshEmail,
            fullName: session.user.name ?? freshEmail.split('@')[0],
            roles: freshRoles.length > 0 ? freshRoles : ['user'],
            role: freshRoles[0] ?? 'user',
          });
        } catch (e) {
          console.warn('[oauth-callback] setAuth failed:', e);
        }

        window.dispatchEvent(new CustomEvent('auth-updated', {
          detail: {
            action: 'role-updated',
            email: freshEmail,
            role: freshRole,
            roles: freshRoles,
            isSocialUser: true,
          },
        }));
      }

      // Step 3: Redirect based on FRESH role (not cached NextAuth JWT role)
      setRedirected(true);
      if (freshRole === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace(redirectParam || '/');
      }
    };

    setupAndRedirect();
  }, [session, status, router, redirectParam, redirected]);

  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-darkbg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
          <p className="text-text-muted text-sm">Loading...</p>
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
