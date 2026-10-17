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
import { datGocChoCuoc, gocCuaCuoc } from '../../../desktop/src/main/agent/loop';
import { chuanHoaAnh as chuanHoaAnhApp } from '../../../desktop/src/main/agent/anhLa';
import { API_ORIGIN, WEB_ORIGIN } from '../../../desktop/src/main/config';
import { setSetting } from '../../../desktop/src/main/store';
import { huy as huyTrinhDuyet, trangThai as trangThaiTd } from './trinhDuyetThay';
import { dongBoVe } from './boVeSoDoThay';
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
  if (daKhoiDong) return;
  registerAgentHandlers();
  daKhoiDong = true;
}

export function datPhien(p: PhienDangNhap | null): void { datPhienLoi(p); }

export async function goi(kenh: string, duLieu?: unknown): Promise<unknown> {
  return (await goiKenhNoiBo(kenh, duLieu, suKienGia)) ?? null;
}

/** Thư mục đang mở trong VS Code ⇒ thư mục dự án của cuộc. */
export async function datThuMuc(cuocId: string, duong: string): Promise<unknown> {
  if (!cuocId || !path.isAbsolute(duong) || !statSync(duong).isDirectory()) throw new Error('Thư mục không hợp lệ.');
  if (gocCuaCuoc(cuocId) !== duong) datGocChoCuoc(cuocId, duong);
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
