/**
 * Đăng nhập cho chế độ độc lập (không cần app desktop).
 *
 * Hai đường, y như app:
 *  • Google / GitHub / Apple: mở TRÌNH DUYỆT HỆ THỐNG tới `cuongthai.com/login`
 *    kèm `dt_cong` + `dt_nonce`; web trả token về cổng vòng 127.0.0.1 của
 *    extension (RFC 8252). Dùng lại nguyên đường của app (`oauthVong.ts` +
 *    `frontend/src/app/oauth-callback`) — web không phải sửa gì.
 *  • Tên đăng nhập + mật khẩu: `POST /api/v1/auth/login`, như màn đăng nhập app.
 *
 * Token là ACCESS token đổi mới được bằng `/auth/refresh` (xem
 * `desktop/src/main/ipc/auth.ts`) ⇒ chỉ cất trong `SecretStorage` của VS Code.
 *
 * File này không import `vscode` để thử được bằng Node thuần.
 */
import { randomBytes } from 'node:crypto';
import { createServer, type Server } from 'node:http';

export const WEB_ORIGIN = 'https://cuongthai.com';
export const API_ORIGIN = process.env.CUONGTHAI_API_ORIGIN ?? 'https://api.cuongthai.com';

export interface NguoiDung { userId: number; username: string; fullName?: string; email?: string; token: string }

/** Bỏ cuộc sau ngần này — như app. */
const HET_GIO_MS = 5 * 60 * 1000;

async function goiApi(duong: string, o: { token?: string; body?: unknown }): Promise<NguoiDung> {
  let r: Response;
  try {
    r = await fetch(`${API_ORIGIN}${duong}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(o.token ? { authorization: `Bearer ${o.token}` } : {}),
      },
      body: o.body === undefined ? undefined : JSON.stringify(o.body),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new LoiDangNhap('mang', 'Không kết nối được máy chủ CuongThai. Kiểm tra mạng rồi thử lại.');
  }
  const j = await r.json().catch(() => ({})) as { data?: NguoiDung; message?: string; error?: { message?: string } };
  if (r.status === 401) throw new LoiDangNhap('hetHan', j.message ?? 'Phiên đăng nhập đã hết hạn.');
  if (!r.ok) throw new LoiDangNhap('mayChu', j.error?.message ?? j.message ?? `Máy chủ trả HTTP ${r.status}.`);
  const d = (j.data ?? j) as NguoiDung;
  if (!d?.token || typeof d.userId !== 'number') throw new LoiDangNhap('mayChu', 'Máy chủ trả về dữ liệu lạ.');
  return { userId: d.userId, username: d.username, fullName: d.fullName, email: d.email, token: d.token };
}

export class LoiDangNhap extends Error {
  constructor(readonly ma: 'mang' | 'hetHan' | 'mayChu' | 'huy', thongDiep: string) { super(thongDiep); }
}

export async function dangNhapMatKhau(ten: string, matKhau: string): Promise<NguoiDung> {
  try {
    return await goiApi('/api/v1/auth/login', { body: { username: ten, password: matKhau } });
  } catch (e) {
    // 401 ở đây là sai thông tin, không phải "hết phiên".
    if (e instanceof LoiDangNhap && e.ma === 'hetHan') throw new LoiDangNhap('mayChu', 'Sai tên đăng nhập hoặc mật khẩu.');
    throw e;
  }
}

/**
 * Xác minh + đổi token mới. Gọi lúc mở VS Code và định kỳ — token cũ hết hạn
 * vẫn đổi được (máy chủ verify bằng `ignoreExpiration`), chừng nào tài khoản
 * còn hoạt động.
 */
export function lamMoi(token: string): Promise<NguoiDung> {
  return goiApi('/api/v1/auth/refresh', { token });
}

let dangCho: { may: Server; hetGio: NodeJS.Timeout; huy: () => void } | null = null;

export function huyDangNhapTrinhDuyet(): void {
  const c = dangCho;
  if (!c) return;
  dangCho = null;
  clearTimeout(c.hetGio);
  c.may.closeAllConnections?.();
  c.may.close();
  c.huy();
}

/**
 * Đăng nhập Google/GitHub/Apple qua trình duyệt. `moTrinhDuyet` do extension
 * cắm vào (`vscode.env.openExternal`).
 *
 * Ba chốt như app: nonce ngẫu nhiên mỗi lượt, chỉ nghe 127.0.0.1, hết giờ và
 * đóng ngay sau lượt đầu (kể cả kết nối keep-alive — `close()` một mình không đủ).
 */
export async function dangNhapTrinhDuyet(
  nha: 'google' | 'github' | 'apple',
  moTrinhDuyet: (url: string) => Promise<boolean>,
  /** Tên nơi người dùng quay về, hiện trên trang "Đã đăng nhập" (vd "VS Code", "terminal"). */
  noiQuayVe = 'VS Code',
): Promise<NguoiDung> {
  huyDangNhapTrinhDuyet();
  const nonce = randomBytes(24).toString('hex');

  const token = await new Promise<string>((xong, hong) => {
    const may = createServer((req, res) => {
      const u = new URL(req.url ?? '/', 'http://127.0.0.1');
      if (u.pathname !== '/xong') { res.writeHead(404).end(); return; }
      const tk = u.searchParams.get('token') ?? '';
      const hopLe = Boolean(tk) && dangCho !== null && u.searchParams.get('nonce') === nonce;
      res.writeHead(hopLe ? 200 : 400, { 'content-type': 'text/html; charset=utf-8', connection: 'close' });
      res.end(trangXong(hopLe, noiQuayVe));
      if (!hopLe) return;
      const c = dangCho;
      dangCho = null;
      if (c) { clearTimeout(c.hetGio); setTimeout(() => { may.closeAllConnections?.(); may.close(); }, 200); }
      xong(tk);
    });
    may.keepAliveTimeout = 0;
    may.once('error', hong);
    may.listen(0, '127.0.0.1', () => {
      const cong = (may.address() as { port: number }).port;
      dangCho = {
        may,
        hetGio: setTimeout(() => huyDangNhapTrinhDuyet(), HET_GIO_MS),
        huy: () => hong(new LoiDangNhap('huy', 'Đã huỷ đăng nhập (hoặc quá 5 phút chưa xong).')),
      };
      const url = new URL('/login', WEB_ORIGIN);
      url.searchParams.set('dt_cong', String(cong));
      url.searchParams.set('dt_nonce', nonce);
      url.searchParams.set('dt_nha', nha);
      void moTrinhDuyet(url.toString()).then((ok) => { if (!ok) huyDangNhapTrinhDuyet(); });
    });
  });

  // Token tới từ web của ta, nhưng VẪN xác minh với máy chủ + lấy hồ sơ (như app).
  return lamMoi(token);
}

function trangXong(ok: boolean, noiQuayVe: string): string {
  const noi = noiQuayVe.replace(/[<>&"']/g, '');
  const tieuDe = ok ? 'Đã đăng nhập CuongThai' : 'Liên kết đăng nhập không hợp lệ';
  const chu = ok ? `Quay lại ${noi} để dùng CuongMini Code. Bạn có thể đóng thẻ này.` : `Thử bấm đăng nhập lại trong ${noi}.`;
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${tieuDe}</title>
<style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0;background:#0f0a1e;color:#ede9fe}
.k{text-align:center;padding:32px 40px;border-radius:16px;background:#1e1640;box-shadow:0 10px 40px #0006}h1{font-size:20px;margin:0 0 8px}p{margin:0;color:#c4b5fd}</style>
</head><body><div class="k"><h1>${ok ? '✅' : '⚠️'} ${tieuDe}</h1><p>${chu}</p></div></body></html>`;
}
