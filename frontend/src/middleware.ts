import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware chạy trên Vercel Edge — có quyền đọc tất cả cookies (bao gồm httpOnly).
 *
 * Security model:
 * - admin_role cookie ĐƯỢC set bởi backend (trong proxy route) với httpOnly=true
 * - Middleware đọc admin_role từ raw cookie header (Edge Runtime không cần httpOnly)
 * - Luôn verify với backend /api/auth/admin-check để ngăn stale cookie exploitation
 * - Non-admin user KHÔNG BAO GIỜ vào được admin nếu không có backend_token hợp lệ
 *
 * Routes handled:
 * - /admin/* → admin only (verified via /api/auth/admin-check)
 * - /learn/* → any authenticated user (just needs backend_token cookie)
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // /admin/* — requires admin role
  if (pathname.startsWith('/admin')) {
    return handleAdminRoute(request, pathname);
  }

  // /learn/* — requires any logged-in user
  if (pathname.startsWith('/learn')) {
    return handleLearnRoute(request, pathname);
  }

  return NextResponse.next();
}

async function handleAdminRoute(
  request: NextRequest,
  pathname: string,
): Promise<NextResponse> {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const backendTokenMatch = cookieHeader.match(/(?:^|;\s*)backend_token=([^;]*)/);
  const backendToken = backendTokenMatch?.[1] ?? '';

  if (backendToken) {
    try {
      const host = request.headers.get('host') ?? 'cuongthai.com';
      const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
      const adminCheckUrl = `${protocol}://${host}/api/auth/admin-check`;

      const res = await fetch(adminCheckUrl, {
        method: 'GET',
        headers: { Cookie: `backend_token=${backendToken}` },
        credentials: 'include',
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const roles: string[] = data?.data?.roles || [];
        const isAdmin = roles.some(
          (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN',
        );

        if (isAdmin) {
          return NextResponse.next();
        }

        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('error', 'not_admin');
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      // Fall through to login redirect
    }
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

async function handleLearnRoute(
  request: NextRequest,
  pathname: string,
): Promise<NextResponse> {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const backendTokenMatch = cookieHeader.match(/(?:^|;\s*)backend_token=([^;]*)/);
  const backendToken = backendTokenMatch?.[1] ?? '';

  if (!backendToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    loginUrl.searchParams.set('error', 'login_required');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/learn/:path*'],
};
