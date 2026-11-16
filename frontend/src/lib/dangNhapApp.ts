/**
 * Đăng nhập app di động QUA WEB (16/11/2026) — phần dùng chung client + server (KHÔNG import node:crypto ở đây).
 *
 * Luồng: app mở ASWebAuthenticationSession → /dang-nhap-app?nhaCungCap=google|github&app=<khoá>&trangThai=<nonce>&thu=<PKCE>
 *   → POST /api/auth/app/bat-dau (ghi cookie httpOnly ký HMAC, sống 10 phút) → signIn(provider) của NextAuth
 *   → /dang-nhap-app/xong → POST /api/auth/app/ma (máy chủ Next xin backend MÃ MỘT LẦN) → `<scheme>://dang-nhap?ma=…`.
 * Luật của mã nằm ở backend `src/services/maDangNhapApp.ts`. Bảng app ở đây CHỈ để hiện tên + kiểm thêm một lớp;
 * nguồn sự thật của scheme là bảng `APP_DANG_NHAP` ở backend (hai bảng phải khớp — thêm app thì sửa cả hai).
 */

export const APP_QUA_WEB = {
  ctlanguage: { scheme: 'ctlanguage', ten: 'CT Language' },
  ctwork: { scheme: 'ctwork', ten: 'CT Work' },
  cuongthai: { scheme: 'cuongthai', ten: 'CuongThai' },
  ctcourses: { scheme: 'ctcourses', ten: 'CT Courses' },
} as const;
export type KhoaAppQuaWeb = keyof typeof APP_QUA_WEB;

export const NHA_CUNG_CAP_APP = { google: 'Google', github: 'GitHub' } as const;
export type NhaCungCapApp = keyof typeof NHA_CUNG_CAP_APP;

/** Cookie phiên đăng nhập-cho-app (httpOnly, chỉ máy chủ Next đọc). */
export const COOKIE_APP_DN = 'ct_app_dn';
/** Từ lúc bấm tới lúc web xong đăng nhập: đủ cho người gõ mật khẩu + 2FA của Google/GitHub. */
export const SONG_PHIEN_APP_DN_GIAY = 10 * 60;

export const laKhoaApp = (x: unknown): x is KhoaAppQuaWeb => typeof x === 'string' && Object.prototype.hasOwnProperty.call(APP_QUA_WEB, x);
export const laNhaCungCapApp = (x: unknown): x is NhaCungCapApp => x === 'google' || x === 'github';
export const laTrangThaiApp = (x: unknown): x is string => typeof x === 'string' && /^[A-Za-z0-9_-]{22,128}$/.test(x);
export const laThuApp = (x: unknown): x is string => typeof x === 'string' && /^[A-Za-z0-9_-]{43}$/.test(x);

/** URL chuyển hướng backend trả về có đúng `<scheme của app>://dang-nhap?…` không — lớp kiểm thứ hai, phòng lệch bảng. */
export function chuyenHuongHopLe(app: KhoaAppQuaWeb, url: unknown): url is string {
  return typeof url === 'string' && url.startsWith(`${APP_QUA_WEB[app].scheme}://dang-nhap?`);
}
