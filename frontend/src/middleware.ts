import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware chạy trên Vercel Edge — có quyền đọc tất cả cookies (bao gồm httpOnly).
 *
 * Security model:
 * - admin_role cookie ĐƯỢC set bởi backend (trong proxy route) với httpOnly=true
 * - Middleware đọc admin_role từ raw cookie header (Edge Runtime không cần httpOnly)
 * - Luôn verify với backend /api/auth/admin-check để ngăn stale cookie exploitation
 * - Non-admin user KHÔNG BAO GIỜ vào được admin nếu không có backend_token hợp lệ
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get('cookie') ?? '';
  const backendTokenMatch = cookieHeader.match(/(?:^|;\s*)backend_token=([^;]*)/);
  const adminRoleMatch = cookieHeader.match(/(?:^|;\s*)admin_role=([^;]*)/);
  const backendToken = backendTokenMatch?.[1] ?? '';
  const adminRole = adminRoleMatch?.[1];

  if (backendToken) {
    try {
      // Use the Host header to construct the URL, not request.url.
      // request.url may be "https://0.0.0.0:3000" in standalone containers,
      // but the Host header always carries the correct public hostname.
      const host = request.headers.get('host') ?? 'cuongthai.com';
      const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
      const adminCheckUrl = `${protocol}://${host}/api/auth/admin-check`;

      const res = await fetch(adminCheckUrl, {
        method: 'GET',
        headers: {
          'Cookie': `backend_token=${backendToken}`,
        },
        credentials: 'include',
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const roles: string[] = data?.data?.roles || [];
        const isAdmin = roles.some(
          (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN'
        );

        if (isAdmin) {
          return NextResponse.next();
        }
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('error', 'not_admin');
        return NextResponse.redirect(loginUrl);
      }

      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    } catch {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
