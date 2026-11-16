import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_APP_DN, SONG_PHIEN_APP_DN_GIAY, laKhoaApp, laNhaCungCapApp, laThuApp, laTrangThaiApp,
} from '@/lib/dangNhapApp';
import { kyPhienAppDn } from '@/lib/dangNhapAppServer';

/**
 * POST /api/auth/app/bat-dau — bước 1 của "đăng nhập app qua web" (16/11/2026).
 * Trang /dang-nhap-app gọi TRƯỚC khi signIn(provider): ghi cookie httpOnly ký HMAC ràng app + nhà cung cấp +
 * trangThai + PKCE + mốc bắt đầu. Không nhận URL chuyển hướng nào — app chỉ là một KHOÁ trong bảng cố định.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const than = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const app = than?.app, ncc = than?.nhaCungCap, tt = than?.trangThai, thu = than?.thu;
  if (!laKhoaApp(app) || !laNhaCungCapApp(ncc) || !laTrangThaiApp(tt) || !laThuApp(thu)) {
    return NextResponse.json({ success: false, message: 'Liên kết đăng nhập không hợp lệ.' }, { status: 400 });
  }
  const gt = kyPhienAppDn({ app, ncc, tt, thu, luc: Date.now() });
  if (!gt) {
    console.error('[app-dang-nhap] thiếu AUTH_SECRET — không ký được phiên');
    return NextResponse.json({ success: false, message: 'Máy chủ chưa sẵn sàng. Thử lại sau.' }, { status: 503 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_APP_DN, gt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // Lax: trình duyệt vẫn gửi kèm lần điều hướng GET quay về từ Google/GitHub; fetch cùng gốc ở /xong cũng mang theo.
    sameSite: 'lax',
    maxAge: SONG_PHIEN_APP_DN_GIAY,
    path: '/',
  });
  return res;
}
