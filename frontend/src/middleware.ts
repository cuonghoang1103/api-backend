import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge middleware — runs before any admin or learn route.
 *
 * Auth model:
 * - Backend issues a JWT (`backend_token`) and sets it as an httpOnly
 *   cookie during login. We can't verify the JWT signature in Edge
 *   runtime (no `jsonwebtoken`/`jose` available without a custom build),
 *   so we rely on the backend's `admin_role` companion cookie.
 * - `admin_role` is set to "1" for admins, "0" otherwise, and is
 *   httpOnly so JS can't tamper with it. Edge runtime reads it from
 *   the raw cookie header just fine.
 * - The /api/auth/admin-check route still does the real verification
 *   server-side — we only use it as a *secondary* check in case the
 *   cookie was somehow stale. The cookie is the primary gate so the
 *   middleware doesn't have to do an internal fetch (which used to
 *   fail intermittently and bounce users back to /login).
 *
 * Routes:
 * - /admin/* → admin only (admin_role=1)
 * - /creator/* → admin only (Content Studio, Phase 3+)
 * - /learn/* → any authenticated user (just needs backend_token)
 */
export async function middleware(request: NextRequest) {
 const pathname = request.nextUrl.pathname;

 if (pathname.startsWith('/admin')) {
 return handleAdminRoute(request, pathname);
 }
 if (pathname.startsWith('/creator')) {
 // Content Studio is admin-only. Reuses the exact same
 // cookie gate as /admin/* — no extra config needed.
 return handleAdminRoute(request, pathname);
 }
 if (pathname.startsWith('/learn')) {
 return handleLearnRoute(request, pathname);
 }
 return NextResponse.next();
}

function readCookie(request: NextRequest, name: string): string {
  // In Next.js 14 Edge runtime, request.cookies.get() can return
  // undefined for httpOnly cookies in some hosting environments
  // (notably `output: 'standalone'` when behind a reverse proxy).
  // Parsing the raw cookie header is the bullet-proof path.
  const header = request.headers.get('cookie') ?? '';
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = header.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return m?.[1] ?? '';
}

function redirectToLogin(request: NextRequest, pathname: string, errorCode: string) {
  const url = new URL('/login', request.url);
  url.searchParams.set('redirect', pathname);
  url.searchParams.set('error', errorCode);
  return NextResponse.redirect(url);
}

async function handleAdminRoute(
  request: NextRequest,
  pathname: string,
): Promise<NextResponse> {
  const backendToken = readCookie(request, 'backend_token');
  const adminRole = readCookie(request, 'admin_role');

  if (!backendToken) {
    return redirectToLogin(request, pathname, 'login_required');
  }

  // Fast path: trust the admin_role cookie. It's set by the backend
  // proxy route at the same time as backend_token, and the backend
  // also rotates it on logout (sets maxAge=0).
  if (adminRole === '1') {
    return NextResponse.next();
  }

  // Slow path: cookie says not-admin OR is missing. Ask the backend
  // to double-check — could happen after a role upgrade where the
  // cookie is stale. We give this a short timeout so the middleware
  // doesn't hold the request.
  if (adminRole === '0') {
    // Backend already told us this user is not admin. Don't even
    // bother calling it again.
    return redirectToLogin(request, pathname, 'not_admin');
  }

  try {
    const host = request.headers.get('host') ?? 'cuongthai.com';
    const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`${protocol}://${host}/api/auth/admin-check`, {
      method: 'GET',
      headers: { Cookie: `backend_token=${backendToken}` },
      cache: 'no-store',
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      const roles: string[] = data?.data?.roles || [];
      const isAdmin = roles.some(
        (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN',
      );
      if (isAdmin) return NextResponse.next();
      return redirectToLogin(request, pathname, 'not_admin');
    }
  } catch {
    // Network blip or timeout — fall through to login. Better to
    // ask for a fresh login than to silently grant access.
  }

  return redirectToLogin(request, pathname, 'login_required');
}

async function handleLearnRoute(
  request: NextRequest,
  pathname: string,
): Promise<NextResponse> {
  const backendToken = readCookie(request, 'backend_token');
  if (!backendToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    url.searchParams.set('error', 'login_required');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
 matcher: ['/admin/:path*', '/admin', '/creator/:path*', '/creator', '/learn/:path*'],
};
