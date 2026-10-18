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
 *
 * ĐỢT 5 (18/10/2026): server `ctwork` thành DỰNG SẴN — có token trong kho là có server, KHÔNG còn ghi dòng
 * nào vào mcp.json (`mcp.ts › datNguonServerDungSan`). Dòng cũ do bản trước tự thêm được gỡ khi nối lại.
 * Token hết hạn / bị thu hồi (server báo 401/403) ⇒ `canCapLai()` ⇒ giao diện hỏi một chạm `capLaiCtwork`.
 */
import { app, safeStorage } from 'electron';
import { chmod, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { API_ORIGIN } from '../config';
import { datNguonBienBiMat, datNguonServerDungSan, duongDanCauHinh, napLaiMcp, toolCuaServer, trangThaiServer, type CauHinhServer } from './mcp';

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

/** Đợt 5: cấu hình server `ctwork` DỰNG SẴN — chỉ khi máy có token (kho của app, hoặc biến CTWORK_TOKEN). */
export function cauHinhDungSan(): Record<string, CauHinhServer> {
  if (!dem && !process.env[BIEN_TOKEN]) return {};
  return { [TEN_SERVER]: { type: 'http', url: URL_MCP, headers: { Authorization: `Bearer \${${BIEN_TOKEN}}` } } as CauHinhServer };
}
datNguonServerDungSan(cauHinhDungSan);

/** Lỗi xác thực của CT Work (token hết hạn / bị thu hồi / sai) — nhận từ thông báo lỗi nối hoặc gọi tool. */
/*
 * QA 5c: KHÔNG khớp chữ `FORBIDDEN` trần — lỗi cấp TOOL "FORBIDDEN: This API token is read-only" (token chỉ đọc
 * gọi tool ghi) hay "không phải thành viên dự án" không phải token hỏng; trước đây chúng bật thẻ "Token đã hết hạn —
 * Cấp lại" giả (cấp lại vẫn chỉ đọc ⇒ vòng lặp). Lỗi xác thực thật của máy chủ là HTTP 401/403 ("HTTP 401: …
 * Invalid API token", "This API token has expired").
 */
export const LOI_XAC_THUC = /\b(401|403)\b|unauthori[sz]ed|invalid[_ ](?:api[_ ])?token|token (?:has )?(?:been )?(?:revoked|expired|invalid)|token[^\n]{0,20}(?:hết hạn|bị thu hồi)/i;
let loiXacThucCuoi = 0;
/** Lõi gọi khi một lời gọi CT Work hỏng vì xác thực (để `canCapLai` biết, kể cả khi server vẫn "đã nối"). */
export function baoLoiCtwork(chu: string): void { if (LOI_XAC_THUC.test(chu)) loiXacThucCuoi = Date.now(); }
/** Có token của app mà server báo lỗi xác thực ⇒ cần cấp lại (một chạm). */
export async function canCapLai(): Promise<boolean> {
  const m = await docBiMat();
  if (!m || process.env[BIEN_TOKEN]) return false;
  const sv = trangThaiServer().find((x) => x.ten === TEN_SERVER);
  if (sv && !sv.ok && !sv.tat && LOI_XAC_THUC.test(sv.loi ?? '')) return true;
  return Date.now() - loiXacThucCuoi < 10 * 60_000;
}

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

  /* Đợt 5: server dựng sẵn — gỡ dòng cũ do app tự thêm (và cờ tắt của nó: nối lại = muốn bật). Dòng người
     dùng TỰ viết (không có ghi chú `/ctwork`) để nguyên, nó vẫn thắng. */
  await goDongCu(true);
  loiXacThucCuoi = 0;
  await napLaiMcp(goc).catch(() => {});
  const sv = trangThaiServer().find((s) => s.ten === TEN_SERVER);
  return sv?.ok
    ? { ok: true, soTool: sv.soTool, quyen }
    : { ok: false, loi: `đã tạo token nhưng server chưa nối được${sv?.loi ? `: ${sv.loi}` : ''}`, quyen };
}

/** Gỡ dòng `ctwork` do app tự thêm (bản trước đợt 5) — `kemCoTat`: gỡ cả dòng chỉ mang cờ tắt của bản dựng sẵn. */
async function goDongCu(kemCoTat: boolean): Promise<void> {
  const cfg = await docMcp();
  let doi = false;
  for (const k of ['servers', 'mcpServers']) {
    const bang = cfg[k] as Record<string, { url?: string; command?: string; _ghi_chu?: string }> | undefined;
    const x = bang?.[TEN_SERVER];
    if (!x) continue;
    const cuaApp = String(x._ghi_chu ?? '').includes('/ctwork') || (kemCoTat && !x.url && !x.command);
    if (cuaApp) { delete bang![TEN_SERVER]; doi = true; }
  }
  if (doi) await ghiMcp(cfg);
}

/** Đợt 5: token hết hạn / bị thu hồi ⇒ cấp lại MỘT CHẠM, cùng quyền như lần trước. */
export async function capLaiCtwork(sessionToken: string, goc: string | null = null): Promise<KetQuaCtwork> {
  const m = await docBiMat();
  return ketNoiCtwork(sessionToken, m?.quyen ?? 'doc', goc);
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
  await goDongCu(false);
  await napLaiMcp(goc).catch(() => {});
  return { ok: true };
}

/** Trạng thái cho `/ctwork` không tham số. */
export async function trangThaiCtwork(): Promise<{ coToken: boolean; quyen: 'doc' | 'ghi' | null; server: { ok: boolean; soTool: number; loi?: string; tat?: boolean; dungSan?: boolean } | null; bienTay: boolean; canCapLai: boolean; coGhi: boolean | null }> {
  const m = await docBiMat();
  const sv = trangThaiServer().find((s) => s.ten === TEN_SERVER);
  /* QA 5c: máy chủ chỉ liệt kê tool ghi cho token có scope `write` ⇒ đây là nguồn ĐÚNG (kể cả token từ biến
     CTWORK_TOKEN, thứ app không biết quyền). `null` = chưa nối / chưa biết. */
  const ds = sv?.ok ? toolCuaServer(TEN_SERVER) : [];
  return {
    coToken: !!m, quyen: m?.quyen ?? null, bienTay: !!process.env[BIEN_TOKEN],
    coGhi: ds.length ? ds.some((t) => !t.chiDoc) : null,
    server: sv ? { ok: sv.ok, soTool: sv.soTool, ...(sv.loi ? { loi: sv.loi } : {}), ...(sv.tat ? { tat: true } : {}), ...(sv.dungSan ? { dungSan: true } : {}) } : null,
    canCapLai: await canCapLai(),
  };
}
