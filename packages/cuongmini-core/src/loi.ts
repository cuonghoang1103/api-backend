/**
 * LÕI ĐỘC LẬP — AI Code của app desktop chạy ngay trong tiến trình extension.
 *
 * Dựng thành `dist/loi.js` RIÊNG (xem `build.mjs`): chỉ nạp khi không có app
 * desktop, nên người đang dùng app không trả giá vài MB lúc VS Code khởi động.
 *
 * Mã AI Code là CỦA APP (`desktop/src/main/**`), không phải bản chép: lúc dựng,
 * esbuild đổi `electron` → `./electron.ts` và vài module vỏ app → bản thay
 * (`ipcThay`, `authThay`, `cuaSoThay`, `aiCucBoThay`). Sửa vòng lặp/tool trong
 * app ⇒ dựng lại extension là có, không phải sửa hai chỗ.
 *
 * ⚠️ File này KHÔNG nằm trong `tsconfig.json` của extension: nó kéo mã desktop
 * (kiểu Electron thật, import `?raw`), thứ mà tsc của desktop đã kiểm. Mặt giao
 * tiếp với extension khai ở `kieuLoi.ts`.
 */
import Module from 'node:module';
import * as electronGia from './electron';
import { caiDatVo, type VoDocLap } from './electron';
import { datPhien as datPhienLoi, type PhienDangNhap } from './authThay';
import { goiKenhNoiBo } from './ipcThay';
import { registerAgentHandlers } from '../../../desktop/src/main/ipc/agent';
import { datNoiChay } from '../../../desktop/src/main/agent/phienMang';
import { datGocChoCuoc, gocCuaCuoc } from '../../../desktop/src/main/agent/loop';
import { chuanHoaAnh as chuanHoaAnhApp } from '../../../desktop/src/main/agent/anhLa';
import { API_ORIGIN, WEB_ORIGIN } from '../../../desktop/src/main/config';
import { getSettings, setSetting } from '../../../desktop/src/main/store';
import { timTrinhDuyet } from './timTrinhDuyet';
import { huy as huyTrinhDuyet, trangThai as trangThaiTd } from './trinhDuyetThay';
import { dongBoVe } from './boVeSoDoThay';
import { datNguonLsp as datNguonLspLoi, type NguonLsp } from '../../../desktop/src/main/agent/lsp';
import { statSync } from 'node:fs';
import path from 'node:path';

export { API_ORIGIN, WEB_ORIGIN };

/*
 * Vài file của app nạp Electron bằng `require` ĐỘNG (`boNho.ts`, `phienTerminal.ts`:
 * `const nap = require; nap('electron')`) — esbuild không thấy chuỗi nên không
 * đổi được lúc dựng. Chặn ở bộ nạp Node, nhưng CHỈ cho lời gọi từ chính
 * `loi.js`: tiến trình extension host là của chung mọi extension, không được
 * đổi `electron` của ai khác.
 */
const napGoc = (Module as unknown as { _load: (r: string, p: { filename?: string } | undefined, m: boolean) => unknown })._load;
(Module as unknown as { _load: typeof napGoc })._load = function napThay(r, cha, chinh) {
  if (r === 'electron' && cha?.filename === __filename) return electronGia;
  return napGoc.call(this, r, cha, chinh);
};

let daKhoiDong = false;
let vo: VoDocLap | null = null;

/** `event` giả cho handler: `sender.send` ⇒ sự kiện ra khung chat (y như cầu nối của app). */
const suKienGia = {
  sender: {
    send: (kenh: string, duLieu: unknown) => vo?.phatSuKien(kenh, duLieu),
    isDestroyed: () => false,
  },
};

export function khoiDong(v: VoDocLap): void {
  vo = v;
  caiDatVo(v);
  // Đợt 3: nhắn giữa phiên cần biết phiên này chạy ở đâu (CLI hay VS Code) — hiện trong /sessions.
  if (v.noi) datNoiChay(v.noi);
  if (daKhoiDong) return;
  registerAgentHandlers();
  datMacDinhDayDu();
  daKhoiDong = true;
  // App desktop nạp MCP ở `main/index.ts` — file đó bị THAY trong lõi, nên CLI/VS Code chưa từng nạp
  // `mcp.json` lúc khởi động (18/10/2026: người dùng cấu hình ctwork xong vẫn "none configured").
  void goiKenhNoiBo('agent:mcpNapLai', {}, suKienGia).catch(() => undefined);
}

/**
 * Ngoài app (VS Code / CLI) mặc định BẬT ĐỦ công cụ — chủ app 18/10/2026: "mặc định luôn bật all tool".
 * Chế độ "Hỏi trước" (`hoi`) khai đủ khả năng đọc/sửa/chạy lệnh/git/xuất sơ đồ, nhưng mỗi lần sửa
 * file hay chạy lệnh VẪN có thẻ duyệt — như Claude Code. Trình duyệt bật sẵn khi máy có Chrome/Edge.
 * Chỉ đặt khi người dùng CHƯA tự chọn: lựa chọn của họ (kể cả "Lập kế hoạch") luôn thắng.
 * "Bỏ qua hết" KHÔNG bao giờ là mặc định (xem `cheDoMacDinh` trong loop.ts).
 */
function datMacDinhDayDu(): void {
  try {
    const s = getSettings() as Record<string, unknown>;
    if (s.aiCheDoQuyenMacDinh === undefined) setSetting('aiCheDoQuyenMacDinh', 'hoi');
    if (s.aiTrinhDuyetMacDinh === undefined && timTrinhDuyet()) setSetting('aiTrinhDuyetMacDinh', true);
  } catch { /* cài đặt hỏng thì giữ mặc định của app */ }
}

export function datPhien(p: PhienDangNhap | null): void { datPhienLoi(p); }

/**
 * Đợt 4 — LSP của TRÌNH SOẠN (VS Code): extension bơm nguồn dùng API của nó
 * (`vscode.executeDefinitionProvider`…). CLI không gọi ⇒ lõi tự chạy server
 * ngôn ngữ qua stdio (`desktop/src/main/agent/lsp.ts`).
 */
export function datNguonLsp(n: NguonLsp | null): void { datNguonLspLoi(n); }

export async function goi(kenh: string, duLieu?: unknown): Promise<unknown> {
  const kq = (await goiKenhNoiBo(kenh, duLieu, suKienGia)) ?? null;
  // Cuộc mới ⇒ bật luôn ghi chú (Notes trên web) như mọi công cụ khác — vẫn hỏi duyệt từng lần ghi.
  if (kenh === 'agent:taoCuoc' && typeof kq === 'string') {
    await goiKenhNoiBo('agent:datCheDoNote', { cuocId: kq, bat: true }, suKienGia).catch(() => undefined);
  }
  return kq;
}

/** Thư mục đang mở trong VS Code ⇒ thư mục dự án của cuộc. */
export async function datThuMuc(cuocId: string, duong: string): Promise<unknown> {
  if (!cuocId || !path.isAbsolute(duong) || !statSync(duong).isDirectory()) throw new Error('Thư mục không hợp lệ.');
  if (gocCuaCuoc(cuocId) !== duong) {
    datGocChoCuoc(cuocId, duong);
    // Đổi thư mục đặt lại các công tắc của cuộc ⇒ bật lại ghi chú (mặc định "đủ công cụ" ngoài app).
    await goiKenhNoiBo('agent:datCheDoNote', { cuocId, bat: true }, suKienGia).catch(() => undefined);
  }
  return goi('agent:getWorkspace', { cuocId });
}

/** Cổng dự phòng (rambo bảo trì): mật khẩu admin ⇒ vé, lưu vào thiết đặt như app. */
export async function moDuPhong(matKhau: string, token: string): Promise<string> {
  if (!matKhau || matKhau.length > 200) throw new Error('Thiếu mật khẩu.');
  const r = await fetch(`${API_ORIGIN}/api/v1/agent/du-phong/mo-khoa`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ matKhau }),
    signal: AbortSignal.timeout(20_000),
  });
  const j = await r.json().catch(() => ({})) as { data?: { ve?: string; ten?: string }; message?: string; error?: { message?: string } };
  if (!r.ok || !j.data?.ve) throw new Error(j.error?.message ?? j.message ?? `Máy chủ trả HTTP ${r.status}`);
  setSetting('agentDuPhongVe', j.data.ve);
  return j.data.ten ?? 'cổng dự phòng';
}

/**
 * Cổng Claude CHÍNH HÃNG (17/10/2026): mật khẩu RIÊNG ⇒ vé `agentAnthropicVe`.
 * Đi qua đúng handler `agent:moCongAnthropic` của app (một chỗ gọi máy chủ,
 * dùng phiên đã bơm bằng `datPhien`). Ném câu lỗi của máy chủ khi sai/chưa bật.
 */
export async function moCongAnthropic(matKhau: string): Promise<{ ten: string; hetHan: number | null }> {
  if (!matKhau || matKhau.length > 200) throw new Error('Thiếu mật khẩu.');
  return await goiKenhNoiBo('agent:moCongAnthropic', { matKhau }, suKienGia) as { ten: string; hetHan: number | null };
}

/** Ảnh dán/kéo vào (HEIC/AVIF/TIFF…, ảnh xoay EXIF, ảnh quá to) ⇒ chuẩn hoá như app. */
export async function chuanHoaAnh(dataUrl: string): Promise<string> {
  const than = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
  const r = await chuanHoaAnhApp(than);
  return `data:${r.media};base64,${r.data.toString('base64')}`;
}

/** Trình duyệt AI đang nối chưa (extension/CLI hiện "Đã nối trình duyệt"). */
export function trangThaiTrinhDuyet(): ReturnType<typeof trangThaiTd> { return trangThaiTd(); }

/**
 * Đóng trình duyệt AI (nếu chính lõi bật nó) và trình duyệt ẩn dùng để xuất sơ
 * đồ. puppeteer cũng tự giết Chrome khi tiến trình thoát, nhưng extension host
 * của VS Code SỐNG TIẾP khi một extension tắt — không gọi thì cửa sổ còn đó.
 */
export async function dongTrinhDuyet(): Promise<void> {
  await Promise.all([huyTrinhDuyet(), dongBoVe()]);
}
