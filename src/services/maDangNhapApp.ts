/**
 * Đăng nhập app di động QUA WEB bằng mã một lần (16/11/2026).
 *
 * Vì sao có: app iOS (CT Language trước, rồi CT Courses / CT Work / CuongThai) cần "Đăng nhập bằng Google / GitHub"
 * y như web, mà không phải xin một OAuth client iOS riêng cho từng app. App mở `ASWebAuthenticationSession`
 * (trình duyệt hệ thống, KHÔNG WebView nhúng — Google cấm) tới `https://cuongthai.com/dang-nhap-app`, web đăng nhập
 * bằng NextAuth như thường, rồi máy chủ Next xin ở đây một MÃ MỘT LẦN và chuyển hướng về `<scheme>://dang-nhap?ma=…`.
 * App đổi mã lấy phiên ở `POST /api/v1/auth/app/doi-ma`.
 *
 * Luật của mã (đọc kỹ trước khi nới bất cứ điều gì):
 *  1. Chỉ máy chủ Next tạo được mã (`/auth/app/tao-ma` bắt chữ ký nội bộ HMAC của AUTH_SECRET) — client ngoài không
 *     tự xin mã cho email tuỳ ý được.
 *  2. Mã = 32 byte ngẫu nhiên (base64url, 43 ký tự). Máy chủ CHỈ lưu SHA-256 của mã, không lưu mã thô.
 *  3. Sống tối đa `SONG_MA_GIAY` (120 s) — Redis EX, và kiểm lại mốc tạo lúc đổi (phòng kho bỏ qua TTL).
 *  4. Dùng ĐÚNG MỘT LẦN: lấy-và-xoá nguyên tử (MULTI GET+DEL) TRƯỚC mọi phép kiểm khác ⇒ đoán sai app / trạng thái /
 *     mã xác minh cũng làm mã chết luôn, không ai dò từng giá trị được.
 *  5. Ràng với: người dùng (userId), app (khoá trong bảng cố định), `trangThai` (nonce app sinh, lưu dạng băm) và
 *     PKCE S256 (`thu` = base64url(SHA-256(maXacMinh))). Kẻ chặn được URL `<scheme>://…` (app khác giành scheme)
 *     vẫn không đổi được mã vì không có `maXacMinh` — nó chỉ nằm trong bộ nhớ app đã mở phiên.
 *  6. Chuyển hướng CHỈ tới scheme trong `APP_DANG_NHAP` (hằng trong mã). Không nhận URL chuyển hướng từ ngoài vào —
 *     chống open redirect / máy phát token.
 */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** App được phép nhận mã. Thêm app mới = thêm một dòng ở đây + đăng ký đúng scheme trong Info.plist của app đó. */
export const APP_DANG_NHAP = {
  ctlanguage: { scheme: 'ctlanguage', ten: 'CT Language' },
  ctwork: { scheme: 'ctwork', ten: 'CT Work' },
  cuongthai: { scheme: 'cuongthai', ten: 'CuongThai' },
  // App CT Courses (đang dựng ở phiên khác) — PHẢI khai `ctcourses` trong CFBundleURLTypes thì mới nhận được.
  ctcourses: { scheme: 'ctcourses', ten: 'CT Courses' },
} as const;
export type MaApp = keyof typeof APP_DANG_NHAP;

/** Nhà cung cấp đi qua web. Apple KHÔNG ở đây: app dùng Sign in with Apple gốc (App Store 4.8). */
export const NHA_CUNG_CAP_QUA_WEB = ['google', 'github'] as const;

export const SONG_MA_GIAY = 120;

const RE_TRANG_THAI = /^[A-Za-z0-9_-]{22,128}$/;
/** base64url(SHA-256) không đệm = đúng 43 ký tự. */
const RE_THU = /^[A-Za-z0-9_-]{43}$/;
/** RFC 7636 code_verifier: 43–128 ký tự "unreserved". */
const RE_XAC_MINH = /^[A-Za-z0-9._~-]{43,128}$/;
const RE_MA = /^[A-Za-z0-9_-]{43}$/;

export const laMaApp = (x: unknown): x is MaApp => typeof x === 'string' && Object.hasOwn(APP_DANG_NHAP, x);
export const laNhaCungCapQuaWeb = (x: unknown): x is (typeof NHA_CUNG_CAP_QUA_WEB)[number] =>
  typeof x === 'string' && (NHA_CUNG_CAP_QUA_WEB as readonly string[]).includes(x);
export const laTrangThai = (x: unknown): x is string => typeof x === 'string' && RE_TRANG_THAI.test(x);
export const laThu = (x: unknown): x is string => typeof x === 'string' && RE_THU.test(x);
export const laMaXacMinh = (x: unknown): x is string => typeof x === 'string' && RE_XAC_MINH.test(x);
export const laMa = (x: unknown): x is string => typeof x === 'string' && RE_MA.test(x);

const sha256Hex = (s: string): string => createHash('sha256').update(s).digest('hex');
/** PKCE S256: base64url(SHA-256(verifier)). */
export const thuTuXacMinh = (maXacMinh: string): string => createHash('sha256').update(maXacMinh).digest('base64url');

function bangNhau(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// ─── Kho ────────────────────────────────────────────────────────────────────

export interface KhoMa {
  /** Ghi nếu khoá chưa có; trả false khi trùng (gần như không thể với 256 bit, nhưng không bao giờ ghi đè). */
  datNeuChuaCo(khoa: string, giaTri: string, giay: number): Promise<boolean>;
  /** Lấy-và-xoá NGUYÊN TỬ. Hai lời đổi chạy đua thì chỉ một lời thấy giá trị. */
  layVaXoa(khoa: string): Promise<string | null>;
}

/** Kho trong RAM — dùng cho test và làm lưới đỡ khi Redis không với tới (backend chỉ chạy một tiến trình). */
export function khoTrongBoNho(bayGio: () => number = Date.now): KhoMa & { kichThuoc(): number; cacKhoa(): string[] } {
  const m = new Map<string, { v: string; het: number }>();
  const don = (): void => { const t = bayGio(); for (const [k, x] of m) if (x.het <= t) m.delete(k); };
  return {
    async datNeuChuaCo(k, v, giay) {
      don();
      if (m.has(k)) return false;
      m.set(k, { v, het: bayGio() + giay * 1000 });
      return true;
    },
    async layVaXoa(k) {
      don();
      const x = m.get(k);
      m.delete(k);
      return x ? x.v : null;
    },
    kichThuoc: () => m.size,
    cacKhoa: () => [...m.keys()],
  };
}

type RedisToiThieu = {
  set(k: string, v: string, o: { EX: number; NX: true }): Promise<string | null>;
  multi(): { get(k: string): unknown; del(k: string): unknown; exec(): Promise<unknown[]> };
};

export function khoRedis(redis: RedisToiThieu): KhoMa {
  return {
    async datNeuChuaCo(k, v, giay) {
      return (await redis.set(k, v, { EX: giay, NX: true })) === 'OK';
    },
    async layVaXoa(k) {
      const m = redis.multi();
      m.get(k);
      m.del(k);
      const [v] = await m.exec();
      return typeof v === 'string' ? v : null;
    },
  };
}

// ─── Tạo / đổi mã ───────────────────────────────────────────────────────────

const TIEN_TO = 'appdn:';

type BanGhi = { u: number; app: MaApp; tt: string; thu: string; luc: number };

export function chuyenHuongVeApp(app: MaApp, thamSo: Record<string, string>): string {
  const q = new URLSearchParams(thamSo).toString();
  return `${APP_DANG_NHAP[app].scheme}://dang-nhap?${q}`;
}

/** Báo lỗi về app (tài khoản bị khoá/vô hiệu…) — vẫn qua scheme cố định, kèm trangThai để app khớp phiên. */
export function chuyenHuongLoi(app: MaApp, trangThai: string, loi: string): string {
  const maLoi = /^[A-Z0-9_]{2,40}$/.test(loi) ? loi : 'LOI';
  return chuyenHuongVeApp(app, { loi: maLoi, trangThai });
}

export async function taoMa(
  kho: KhoMa,
  v: { userId: number; app: string; trangThai: string; thu: string },
  bayGio: () => number = Date.now,
): Promise<{ ma: string; chuyenHuong: string }> {
  if (!laMaApp(v.app)) throw new Error('app không nằm trong danh sách được phép');
  if (!laTrangThai(v.trangThai)) throw new Error('trangThai sai định dạng');
  if (!laThu(v.thu)) throw new Error('thu (PKCE S256) sai định dạng');
  if (!Number.isInteger(v.userId) || v.userId <= 0) throw new Error('userId sai');
  for (let lan = 0; lan < 3; lan++) {
    const ma = randomBytes(32).toString('base64url');
    const banGhi: BanGhi = { u: v.userId, app: v.app, tt: sha256Hex(v.trangThai), thu: v.thu, luc: bayGio() };
    if (await kho.datNeuChuaCo(TIEN_TO + sha256Hex(ma), JSON.stringify(banGhi), SONG_MA_GIAY)) {
      return { ma, chuyenHuong: chuyenHuongVeApp(v.app, { ma, trangThai: v.trangThai }) };
    }
  }
  throw new Error('không tạo được mã');
}

export type KetQuaDoiMa = { ok: true; userId: number } | { ok: false; lyDo: string };

export async function doiMa(
  kho: KhoMa,
  v: { ma?: unknown; app?: unknown; trangThai?: unknown; maXacMinh?: unknown },
  bayGio: () => number = Date.now,
): Promise<KetQuaDoiMa> {
  if (!laMa(v.ma)) return { ok: false, lyDo: 'mã sai định dạng' };
  // Lấy-và-xoá TRƯỚC mọi phép kiểm: mã đã trình ra là chết, đúng hay sai.
  const tho = await kho.layVaXoa(TIEN_TO + sha256Hex(v.ma));
  if (!tho) return { ok: false, lyDo: 'mã không tồn tại, đã dùng hoặc đã hết hạn' };
  let b: BanGhi;
  try { b = JSON.parse(tho) as BanGhi; } catch { return { ok: false, lyDo: 'bản ghi hỏng' }; }
  if (bayGio() - b.luc > SONG_MA_GIAY * 1000) return { ok: false, lyDo: 'mã hết hạn' };
  if (!laMaApp(v.app) || v.app !== b.app) return { ok: false, lyDo: 'sai app' };
  if (!laTrangThai(v.trangThai) || !bangNhau(sha256Hex(v.trangThai), b.tt)) return { ok: false, lyDo: 'sai trangThai' };
  if (!laMaXacMinh(v.maXacMinh) || !bangNhau(thuTuXacMinh(v.maXacMinh), b.thu)) return { ok: false, lyDo: 'sai maXacMinh (PKCE)' };
  return { ok: true, userId: b.u };
}

// ─── Kho mặc định (Redis, lùi về RAM) ───────────────────────────────────────

let khoGan: KhoMa | null = null;
const khoRam = khoTrongBoNho();

/** Test gắn kho riêng; `null` ⇒ quay về kho mặc định. */
export function ganKhoMaChoTest(k: KhoMa | null): void { khoGan = k; }

export async function khoMacDinh(): Promise<KhoMa> {
  if (khoGan) return khoGan;
  // Test không bao giờ đụng Redis thật.
  if (process.env.NODE_ENV === 'test') return khoRam;
  try {
    const { getRedis } = await import('../config/redis.js');
    const r = await Promise.race([
      getRedis(),
      new Promise<never>((_, loi) => setTimeout(() => loi(new Error('Redis chậm quá 1,5 s')), 1500).unref()),
    ]);
    return khoRedis(r as unknown as RedisToiThieu);
  } catch (e) {
    const { logger } = await import('../utils/logger.js');
    logger.warn('[app-dang-nhap] Redis không với tới — dùng kho RAM', { error: (e as Error).message });
    return khoRam;
  }
}
