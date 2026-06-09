'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
      try {
        const res = await fetch('/api/auth/oauth/token', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          backendToken = data?.token ?? '';
        }
      } catch (err) {
        console.error('[oauth-callback] Failed to set backend_token:', err);
      }

      // Step 2: Fetch the FRESH profile from the backend to get the CURRENT role.
      // This reflects any role changes made by the admin (cuong03dx) immediately.
      let freshRole = 'USER';
      let freshRoles: string[] = [];
      let freshEmail = session.user.email;
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
            console.log('[oauth-callback] Fresh role from backend:', freshRole, 'roles:', freshRoles);
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
