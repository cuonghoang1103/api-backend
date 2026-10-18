/**
 * ============================================================
 * KẾT NỐI CT WORK MỘT CHẠM (đợt 3, 18/10/2026) — `/ctwork` · nút trong bảng MCP
 * ============================================================
 *
 * Người dùng đã đăng nhập CuongMini bằng tài khoản CuongThai ⇒ app dùng CHÍNH
 * phiên đó (JWT) gọi `POST /api/v1/work/me/api-tokens` tạo một token CT Work cá
 * nhân (Chỉ đọc = scope `read`, Đọc + ghi = `read`,`write`), cất vào KHO BÍ MẬT
 * của máy, và thêm server `ctwork` vào `mcp.json` với header
 * `Authorization: Bearer ${CTWORK_TOKEN}` — biến này được lõi điền từ kho lúc
 * nối (`bienBiMat()` trong mcp.ts). Token THÔ không bao giờ nằm trong mcp.json,
 * không đi qua hội thoại, model không bao giờ thấy.
 *
 * Kho: app desktop ⇒ `safeStorage` (Keychain/DPAPI/libsecret) mã hoá file
 * `bi-mat/ctwork.bin`; ngoài app (CLI/VS Code) ⇒ file quyền 0600 trong thư mục
 * dữ liệu riêng (`~/.cuongmini/...`). Biến môi trường `CTWORK_TOKEN` người dùng
 * tự đặt (cách cũ: `.zshrc` đọc `~/.ctwork-token`) vẫn THẮNG — giữ tương thích.
 *
 * `/ctwork off` ⇒ thu hồi token trên máy chủ + xoá khỏi kho + gỡ server.
 */
import { app, safeStorage } from 'electron';
import { chmod, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { API_ORIGIN } from '../config';
import { datNguonBienBiMat, duongDanCauHinh, napLaiMcp, trangThaiServer } from './mcp';

export const TEN_SERVER = 'ctwork';
export const BIEN_TOKEN = 'CTWORK_TOKEN';
export const URL_MCP = `${API_ORIGIN}/api/v1/work/mcp`;

interface BiMat { token: string; id: number | string | null; quyen: 'doc' | 'ghi'; luc: number }

function thuMucBiMat(): string { return path.join(app.getPath('userData'), 'bi-mat'); }
function fileBiMat(): string { return path.join(thuMucBiMat(), 'ctwork.bin'); }

function coMaHoa(): boolean {
  try { return safeStorage.isEncryptionAvailable(); } catch { return false; }
}

export async function docBiMat(): Promise<BiMat | null> {
  try {
    const b = await readFile(fileBiMat());
    const chu = b.subarray(0, 4).toString() === 'MAH1' ? safeStorage.decryptString(b.subarray(4)) : b.toString('utf8');
    const j = JSON.parse(chu) as BiMat;
    return typeof j?.token === 'string' && j.token ? j : null;
  } catch { return null; }
}

async function ghiBiMat(m: BiMat | null): Promise<void> {
  if (!m) { await rm(fileBiMat(), { force: true }); return; }
  await mkdir(thuMucBiMat(), { recursive: true, mode: 0o700 });
  const chu = JSON.stringify(m);
  const than = coMaHoa() ? Buffer.concat([Buffer.from('MAH1'), safeStorage.encryptString(chu)]) : Buffer.from(chu, 'utf8');
  await writeFile(fileBiMat(), than, { mode: 0o600 });
  await chmod(fileBiMat(), 0o600).catch(() => {});
}

/** Đệm đồng bộ cho `bienBiMat()` (mcp.ts nạp server đồng bộ). */
let dem: string | null = null;
export async function napDemBiMat(): Promise<void> { dem = (await docBiMat())?.token ?? null; }

/**
 * Biến "bí mật" cho phần mở rộng `${…}` của mcp.json. Biến môi trường thật
 * (người dùng tự đặt) thắng — không ghi đè cách cấu hình tay đang chạy.
 */
export function bienBiMat(): Record<string, string> {
  if (process.env[BIEN_TOKEN]) return {};
  return dem ? { [BIEN_TOKEN]: dem } : {};
}
datNguonBienBiMat(bienBiMat);

async function docMcp(): Promise<Record<string, unknown>> {
  try { return JSON.parse(await readFile(duongDanCauHinh(), 'utf8')) as Record<string, unknown>; } catch { return {}; }
}

async function ghiMcp(j: Record<string, unknown>): Promise<void> {
  await writeFile(duongDanCauHinh(), `${JSON.stringify(j, null, 2)}\n`, 'utf8');
}

export interface KetQuaCtwork { ok: boolean; loi?: string; soTool?: number; trangThai?: string; quyen?: 'doc' | 'ghi' }

/** Nối: tạo token bằng phiên đăng nhập ⇒ kho bí mật ⇒ server `ctwork` trong mcp.json ⇒ nạp lại. */
export async function ketNoiCtwork(sessionToken: string, quyen: 'doc' | 'ghi', goc: string | null = null): Promise<KetQuaCtwork> {
  // Đã có token cũ của app ⇒ thu hồi trước (đổi quyền đọc ↔ ghi = token mới).
  const cu = await docBiMat();
  if (cu?.id != null) await thuHoi(sessionToken, cu.id).catch(() => {});
  let r: Response;
  try {
    r = await fetch(`${API_ORIGIN}/api/v1/work/me/api-tokens`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${sessionToken}` },
      body: JSON.stringify({ name: `CuongMini · ${os.hostname().slice(0, 40)}`, scopes: quyen === 'ghi' ? ['read', 'write'] : ['read'] }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (e) {
    return { ok: false, loi: `không gọi được máy chủ: ${(e as Error).message}` };
  }
  const j = await r.json().catch(() => ({})) as { data?: { token?: string; id?: number | string; token_id?: number }; message?: string; error?: { message?: string } };
  const token = j.data?.token;
  if (!r.ok || !token) return { ok: false, loi: j.error?.message ?? j.message ?? `máy chủ trả HTTP ${r.status}` };
  await ghiBiMat({ token, id: j.data?.id ?? j.data?.token_id ?? null, quyen, luc: Date.now() });
  dem = token;

  const cfg = await docMcp();
  const bangKey = cfg.mcpServers && !cfg.servers ? 'mcpServers' : 'servers';
  const bang = (cfg[bangKey] && typeof cfg[bangKey] === 'object' ? cfg[bangKey] : {}) as Record<string, unknown>;
  bang[TEN_SERVER] = {
    _ghi_chu: 'Do CuongMini tự thêm (/ctwork). Token nằm trong kho bí mật của máy, KHÔNG ở file này. Gỡ: /ctwork off.',
    type: 'http',
    url: URL_MCP,
    headers: { Authorization: `Bearer \${${BIEN_TOKEN}}` },
  };
  cfg[bangKey] = bang;
  await ghiMcp(cfg);
  await napLaiMcp(goc).catch(() => {});
  const sv = trangThaiServer().find((s) => s.ten === TEN_SERVER);
  return sv?.ok
    ? { ok: true, soTool: sv.soTool, quyen }
    : { ok: false, loi: `đã tạo token nhưng server chưa nối được${sv?.loi ? `: ${sv.loi}` : ''}`, quyen };
}

async function thuHoi(sessionToken: string, id: number | string): Promise<void> {
  await fetch(`${API_ORIGIN}/api/v1/work/me/api-tokens/${encodeURIComponent(String(id))}`, {
    method: 'DELETE', headers: { authorization: `Bearer ${sessionToken}` }, signal: AbortSignal.timeout(15_000),
  });
}

/** Ngắt: thu hồi token + xoá khỏi kho + gỡ server `ctwork` (chỉ mục do app thêm). */
export async function ngatCtwork(sessionToken: string | null, goc: string | null = null): Promise<KetQuaCtwork> {
  const m = await docBiMat();
  if (m?.id != null && sessionToken) await thuHoi(sessionToken, m.id).catch(() => {});
  await ghiBiMat(null);
  dem = null;
  const cfg = await docMcp();
  for (const k of ['servers', 'mcpServers']) {
    const bang = cfg[k] as Record<string, { url?: string; _ghi_chu?: string }> | undefined;
    if (bang?.[TEN_SERVER] && String(bang[TEN_SERVER]!._ghi_chu ?? '').includes('/ctwork')) delete bang[TEN_SERVER];
  }
  await ghiMcp(cfg);
  await napLaiMcp(goc).catch(() => {});
  return { ok: true };
}

/** Trạng thái cho `/ctwork` không tham số. */
export async function trangThaiCtwork(): Promise<{ coToken: boolean; quyen: 'doc' | 'ghi' | null; server: { ok: boolean; soTool: number; loi?: string } | null; bienTay: boolean }> {
  const m = await docBiMat();
  const sv = trangThaiServer().find((s) => s.ten === TEN_SERVER);
  return {
    coToken: !!m, quyen: m?.quyen ?? null, bienTay: !!process.env[BIEN_TOKEN],
    server: sv ? { ok: sv.ok, soTool: sv.soTool, ...(sv.loi ? { loi: sv.loi } : {}) } : null,
  };
}
