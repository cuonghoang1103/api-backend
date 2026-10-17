/**
 * ============================================================
 * CẦU NỐI VS CODE — extension "CuongThai AI Code" nói chuyện với app
 * ============================================================
 *
 * Chủ app 16/10/2026: muốn AI Code nằm một bên VS Code để chat và làm việc như
 * Copilot/Claude, "dùng được full chức năng skill, chất lượng… như AI trong app".
 *
 * Nên extension KHÔNG có bộ máy riêng: nó là khung chat, còn mọi lượt chạy
 * đúng các handler `agent:*` của app (vòng lặp, tool, skill, MCP, bộ nhớ,
 * chế độ quyền, cổng rambo + dự phòng). Nâng cấp AI Code là VS Code có theo.
 *
 * ─── AN TOÀN ───
 *  • Chỉ nghe 127.0.0.1. Máy khác không với tới.
 *  • Khoá ngẫu nhiên 48 ký tự mỗi lần mở app, ghi vào
 *    `~/.cuongthai/vscode-bridge.json` quyền 0600 — chỉ tài khoản người dùng
 *    trên máy đọc được (đúng những tiến trình vốn đã đọc được dữ liệu app).
 *  • TỪ CHỐI mọi yêu cầu có header `Origin`: extension (Node) không gửi nó,
 *    còn trang web trong trình duyệt LUÔN gửi ⇒ chặn sạch CSRF từ web lạ.
 *    Kiểm cả `Host` để chặn DNS rebinding.
 *  • Chỉ mở một DANH SÁCH TRẮNG kênh `agent:*` — không cài đặt, không đăng
 *    nhập, không file tuỳ ý.
 */
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import type { IpcMainInvokeEvent } from 'electron';
import { app } from 'electron';
import type { InvokeChannel } from '../shared/ipc';

const KENH_DUOC: ReadonlySet<InvokeChannel> = new Set<InvokeChannel>([
  'agent:getInfo', 'agent:getWorkspace', 'agent:taoCuoc', 'agent:dongCuoc', 'agent:send', 'agent:cancel',
  'agent:reset', 'agent:traLoiXinPhep', 'agent:datCheDoQuyen', 'agent:datCheDoTrinhDuyet', 'agent:datCheDoNote',
  'agent:datMucNoLuc', 'agent:datModel', 'agent:lamTiep', 'agent:hoanTac', 'agent:compact', 'agent:nguCanhChiTiet',
  'agent:bangGhi', 'agent:veCongChinh', 'agent:themDuong', 'agent:dsQuyenLau',
  // CuongMini Code 0.3 (17/10): lịch sử việc, `@` file, lệnh `/`, quay lui, bộ nhớ, MCP, kho kỹ năng.
  'agent:dsPhien', 'agent:moPhien', 'agent:xoaPhien', 'agent:doiTenPhien', 'agent:ghimPhien', 'agent:timFile',
  'agent:themDinhKem', 'agent:lenhDuAn', 'agent:kyNangDs', 'agent:chanDoan', 'agent:quayLui', 'agent:luiFile',
  'agent:boNhoDs', 'agent:khoTim', 'agent:khoCai', 'agent:xoaQuyenLau', 'agent:mcpTrangThai', 'agent:mcpMoCauHinh',
  'agent:hookMoCauHinh',
  // Cổng Claude chính hãng (17/10/2026): trạng thái, mở khoá (app gọi máy chủ bằng phiên của nó), chọn cổng phụ.
  'agent:congAnthropic', 'agent:moCongAnthropic', 'agent:datCongPhu',
]);

const CONG_THU = [47821, 47822, 47823, 47824, 47825];

export function fileKhamPha(): string {
  return path.join(os.homedir(), '.cuongthai', 'vscode-bridge.json');
}

let mayChu: http.Server | null = null;
const nguoiNghe = new Set<http.ServerResponse>();

function phatSuKien(kenh: string, duLieu: unknown): void {
  const goi = `data: ${JSON.stringify({ kenh, duLieu })}\n\n`;
  for (const r of nguoiNghe) {
    try { r.write(goi); } catch { nguoiNghe.delete(r); }
  }
}

/**
 * `event` giả cho handler: `sender.send` đẩy thẳng ra luồng SSE của extension.
 * Handler AI Code chỉ dùng `event.sender.send/isDestroyed` — đủ ở đây.
 */
const suKienGia = {
  sender: {
    send: (kenh: string, duLieu: unknown) => phatSuKien(kenh, duLieu),
    isDestroyed: () => false,
  },
} as unknown as IpcMainInvokeEvent;

function bangNhau(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function docJson(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((ok, hong) => {
    const khuc: Buffer[] = [];
    let tong = 0;
    req.on('data', (c: Buffer) => {
      tong += c.length;
      // 8 ảnh × 5,6MB base64 + chữ — trần rộng nhưng có trần.
      if (tong > 48 * 1024 * 1024) { hong(new Error('quá lớn')); req.destroy(); } else khuc.push(c);
    });
    req.on('end', () => {
      try { ok(JSON.parse(Buffer.concat(khuc).toString('utf8') || '{}')); } catch { hong(new Error('không phải JSON')); }
    });
    req.on('error', hong);
  });
}

function tra(res: http.ServerResponse, ma: number, d: unknown): void {
  res.writeHead(ma, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(d));
}

export async function batCauNoiVscode(): Promise<void> {
  if (mayChu) return;
  const khoa = randomBytes(24).toString('hex');
  const { goiKenhNoiBo } = await import('./ipc');

  const sv = http.createServer((req, res) => {
    void (async () => {
      const cong = (sv.address() as { port: number } | null)?.port;
      const host = String(req.headers.host ?? '');
      if (req.headers.origin || (host !== `127.0.0.1:${cong}` && host !== `localhost:${cong}`)) return tra(res, 403, { loi: 'bị chặn' });
      const bearer = String(req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
      if (!bangNhau(bearer, khoa)) return tra(res, 401, { loi: 'sai khoá' });

      const url = (req.url ?? '').split('?')[0];
      if (req.method === 'GET' && url === '/trang-thai') {
        const { getSettings } = await import('./store');
        const muc = getSettings().agentMucNoLuc;
        return tra(res, 200, { ok: true, phienBan: app.getVersion(), nenTang: process.platform, mucNoLuc: typeof muc === 'string' ? muc : 'vua' });
      }
      if (req.method === 'GET' && url === '/su-kien') {
        res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
        res.write(': mo\n\n');
        nguoiNghe.add(res);
        const nhip = setInterval(() => { try { res.write(': nhip\n\n'); } catch { /* đóng */ } }, 20_000);
        req.on('close', () => { clearInterval(nhip); nguoiNghe.delete(res); });
        return undefined;
      }
      if (req.method !== 'POST') return tra(res, 404, { loi: 'không có đường này' });
      let b: Record<string, unknown>;
      try { b = await docJson(req); } catch (e) { return tra(res, 400, { loi: (e as Error).message }); }

      if (url === '/goi') {
        const kenh = String(b.kenh ?? '') as InvokeChannel;
        if (!KENH_DUOC.has(kenh)) return tra(res, 403, { loi: `kênh ${kenh} không mở cho VS Code` });
        try {
          return tra(res, 200, { ok: true, kq: (await goiKenhNoiBo(kenh, b.duLieu, suKienGia)) ?? null });
        } catch (e) {
          return tra(res, 200, { ok: false, loi: (e as Error).message });
        }
      }
      // Thư mục đang mở trong VS Code ⇒ thư mục dự án của cuộc.
      if (url === '/dat-thu-muc') {
        const cuocId = String(b.cuocId ?? '');
        const duong = String(b.duong ?? '');
        try {
          if (!cuocId || !path.isAbsolute(duong) || !statSync(duong).isDirectory()) throw new Error('thư mục không hợp lệ');
          const { datGocChoCuoc, gocCuaCuoc } = await import('./agent/loop');
          if (gocCuaCuoc(cuocId) !== duong) datGocChoCuoc(cuocId, duong);
          return tra(res, 200, { ok: true, kq: await goiKenhNoiBo('agent:getWorkspace', { cuocId }, suKienGia) });
        } catch (e) {
          return tra(res, 200, { ok: false, loi: (e as Error).message });
        }
      }
      /* Cổng dự phòng AI Code (rambo bảo trì ⇒ lỗi RAMBO_BAO_TRI): mở khoá bằng
         mật khẩu admin — y hệt ô mật khẩu trong app (`CongDuPhong.tsx`). App gọi
         máy chủ bằng phiên đăng nhập của CHÍNH NÓ, extension không bao giờ cầm
         token; vé lưu vào thiết đặt `agentDuPhongVe` như app. */
      if (url === '/mo-du-phong') {
        try {
          const matKhau = String(b.matKhau ?? '');
          if (!matKhau || matKhau.length > 200) throw new Error('Thiếu mật khẩu.');
          const { readStoredSession } = await import('./ipc/auth');
          const { API_ORIGIN } = await import('./config');
          const phien = readStoredSession();
          if (!phien?.sessionToken) throw new Error('App chưa đăng nhập.');
          const r = await fetch(`${API_ORIGIN}/api/v1/agent/du-phong/mo-khoa`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${phien.sessionToken}` },
            body: JSON.stringify({ matKhau }),
            signal: AbortSignal.timeout(20_000),
          });
          const j = await r.json().catch(() => ({})) as { data?: { ve?: string; ten?: string }; message?: string; error?: { message?: string } };
          if (!r.ok || !j.data?.ve) throw new Error(j.error?.message ?? j.message ?? `Máy chủ trả HTTP ${r.status}`);
          const { setSetting } = await import('./store');
          setSetting('agentDuPhongVe', j.data.ve);
          return tra(res, 200, { ok: true, ten: j.data.ten ?? 'cổng dự phòng' });
        } catch (e) {
          return tra(res, 200, { ok: false, loi: (e as Error).message });
        }
      }
      /* Cổng Claude chính hãng: mật khẩu RIÊNG ⇒ vé `agentAnthropicVe`. Đi qua
         đúng handler `agent:moCongAnthropic` của app (một chỗ gọi máy chủ). */
      if (url === '/mo-cong-anthropic') {
        try {
          const matKhau = String(b.matKhau ?? '');
          if (!matKhau || matKhau.length > 200) throw new Error('Thiếu mật khẩu.');
          const kq = await goiKenhNoiBo('agent:moCongAnthropic', { matKhau }, suKienGia) as { ten?: string; hetHan?: number | null };
          return tra(res, 200, { ok: true, ten: kq?.ten ?? 'Claude chính hãng', hetHan: kq?.hetHan ?? null });
        } catch (e) {
          return tra(res, 200, { ok: false, loi: (e as Error).message });
        }
      }
      // Ảnh dán/kéo vào VS Code (HEIC/AVIF/TIFF…) ⇒ chuẩn hoá như app.
      if (url === '/chuan-hoa-anh') {
        try {
          const du = String(b.dataUrl ?? '');
          const than = Buffer.from(du.slice(du.indexOf(',') + 1), 'base64');
          const { chuanHoaAnh } = await import('./agent/anhLa');
          const r = await chuanHoaAnh(than);
          return tra(res, 200, { ok: true, dataUrl: `data:${r.media};base64,${r.data.toString('base64')}` });
        } catch (e) {
          return tra(res, 200, { ok: false, loi: (e as Error).message });
        }
      }
      return tra(res, 404, { loi: 'không có đường này' });
    })().catch((e) => { if (!res.headersSent) tra(res, 500, { loi: (e as Error).message }); });
  });

  sv.keepAliveTimeout = 0;
  const nghe = (cong: number) => new Promise<boolean>((ok) => {
    sv.once('error', () => ok(false));
    sv.listen(cong, '127.0.0.1', () => ok(true));
  });
  let duoc = false;
  for (const c of CONG_THU) { if (await nghe(c)) { duoc = true; break; } }
  if (!duoc && !(await nghe(0))) return;
  mayChu = sv;

  const cong = (sv.address() as { port: number }).port;
  const f = fileKhamPha();
  mkdirSync(path.dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify({ cong, khoa, pid: process.pid, phienBan: app.getVersion() }), { mode: 0o600 });
  try { chmodSync(f, 0o600); } catch { /* Windows: thư mục người dùng vốn riêng */ }
  app.on('will-quit', () => {
    try { if (existsSync(f)) rmSync(f); } catch { /* bỏ */ }
    for (const r of nguoiNghe) { try { r.end(); } catch { /* bỏ */ } }
    sv.close();
  });
  console.log(`[vscode] cầu nối nghe 127.0.0.1:${cong}`);
}
