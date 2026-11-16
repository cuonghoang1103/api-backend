import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { goiBackend, headerNoiBoOAuth, maNhaCungCap } from '@/lib/backendServer';
import { COOKIE_APP_DN, chuyenHuongHopLe } from '@/lib/dangNhapApp';
import { docPhienAppDn } from '@/lib/dangNhapAppServer';

/**
 * POST /api/auth/app/ma — bước 2 của "đăng nhập app qua web" (16/11/2026). Trang /dang-nhap-app/xong gọi sau khi
 * NextAuth đăng nhập xong. Máy chủ Next (có chữ ký nội bộ) xin backend một MÃ MỘT LẦN cho đúng người vừa đăng nhập,
 * rồi trả URL `<scheme>://dang-nhap?ma=…&trangThai=…` do BACKEND dựng từ bảng cố định. Cookie phiên bị xoá ngay —
 * mỗi lượt bấm chỉ phát được một mã.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Đồng hồ hai container lệch vài giây cũng không được làm hỏng lượt đăng nhập. */
const LECH_DONG_HO_MS = 30_000;

function loi(message: string, status: number) {
  const res = NextResponse.json({ success: false, message }, { status });
  res.cookies.set(COOKIE_APP_DN, '', { maxAge: 0, path: '/' });
  return res;
}

export async function POST(req: NextRequest) {
  const phien = docPhienAppDn(req.cookies.get(COOKIE_APP_DN)?.value);
  if (!phien) return loi('Lượt đăng nhập đã hết hạn. Quay lại app và bấm đăng nhập lần nữa.', 400);

  const session = await auth().catch(() => null);
  const user = session?.user as (Record<string, unknown> & { email?: string | null; name?: string | null; image?: string | null }) | undefined;
  if (!user?.email) return loi('Chưa đăng nhập xong. Quay lại app và thử lại.', 401);

  // Phiên NextAuth phải là phiên VỪA cấp trong lượt này, bằng đúng nhà cung cấp app đã chọn.
  const dangNhapLuc = Number(user.dangNhapLuc ?? 0);
  if (!dangNhapLuc || dangNhapLuc + LECH_DONG_HO_MS < phien.luc || user.provider !== phien.ncc) {
    return loi('Chưa đăng nhập xong. Quay lại app và thử lại.', 401);
  }

  let r: Response;
  try {
    r = await goiBackend('/api/v1/auth/app/tao-ma', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headerNoiBoOAuth() },
      body: JSON.stringify({
        email: user.email,
        fullName: user.name ?? user.email.split('@')[0],
        provider: phien.ncc,
        providerId: maNhaCungCap(user.id, phien.ncc, user.email),
        avatarUrl: user.image ?? undefined,
        app: phien.app,
        trangThai: phien.tt,
        thu: phien.thu,
      }),
    });
  } catch (e) {
    console.error('[app-dang-nhap] không gọi được backend:', e);
    return loi('Không kết nối được máy chủ. Thử lại sau ít phút.', 502);
  }
  const j = (await r.json().catch(() => ({}))) as { data?: { chuyenHuong?: string }; message?: string };
  if (!r.ok || !chuyenHuongHopLe(phien.app, j.data?.chuyenHuong)) {
    console.error('[app-dang-nhap] backend từ chối tạo mã', r.status, j.message);
    return loi('Chưa tạo được phiên cho app. Thử lại sau ít phút.', r.ok ? 500 : r.status);
  }
  const res = NextResponse.json({ success: true, chuyenHuong: j.data!.chuyenHuong });
  res.cookies.set(COOKIE_APP_DN, '', { maxAge: 0, path: '/' });
  return res;
}
