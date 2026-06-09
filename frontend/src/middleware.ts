import { NextRequest, NextResponse } from 'next/server';

const isDebug = process.env.NODE_ENV !== 'production';

function debugLog(...args: unknown[]) {
  if (isDebug) console.log('[middleware]', ...args);
}

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

  debugLog('path:', pathname, 'admin_role:', adminRole, 'has_backend_token:', !!backendToken);

  // Case 1: Có backend_token + admin_role=1 → kiểm tra server-side bắt buộc
  if (backendToken) {
    try {
      const apiUrl = new URL('/api/auth/admin-check', request.url).toString();
      const res = await fetch(apiUrl, {
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
          debugLog('Admin access granted (server verified)');
          return NextResponse.next();
        }
        // Token hợp lệ nhưng không phải admin
        debugLog('User has token but not admin, redirecting');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('error', 'not_admin');
        return NextResponse.redirect(loginUrl);
      }

      // Token không hợp lệ hoặc hết hạn
      debugLog('Token invalid or expired, redirecting');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    } catch (err) {
      debugLog('Admin check failed:', err);
      // Có lỗi mạng → chặn luôn (không leak thông tin)
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Case 2: Không có backend_token → chắc chắn không phải admin
  debugLog('No backend_token — redirect to /login');
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
