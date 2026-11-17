/**
 * Lưu trữ cục bộ trong thư mục dữ liệu app: cài đặt, trạng thái việc ở máy này, và mã kết nối (mã hoá bằng kho
 * khoá hệ điều hành qua `safeStorage` — Keychain trên macOS, DPAPI trên Windows, libsecret/kwallet trên Linux).
 *
 * Ghi JSON qua tệp tạm + đổi tên: tắt máy giữa lúc ghi không để lại tệp cài đặt nửa vời.
 */
import { app, safeStorage } from 'electron';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { caiDatMacDinh, chuanHoaCaiDat, type CaiDat } from '../shared/caiDat';

const tep = (ten: string) => path.join(app.getPath('userData'), ten);

export function docJson<T>(ten: string): T | null {
  try { return JSON.parse(fs.readFileSync(tep(ten), 'utf8')) as T; } catch { return null; }
}

let hangGhi = Promise.resolve();
export function ghiJson(ten: string, du: unknown): Promise<void> {
  hangGhi = hangGhi.then(async () => {
    await fsp.mkdir(app.getPath('userData'), { recursive: true });
    const tam = `${tep(ten)}.tam`;
    await fsp.writeFile(tam, JSON.stringify(du, null, 2), 'utf8');
    await fsp.rename(tam, tep(ten));
  }).catch((e) => console.error('[kho] ghi lỗi', ten, e));
  return hangGhi;
}

export function thuMucVideoMacDinh(): string {
  try { return app.getPath('videos'); } catch { return path.join(app.getPath('home'), 'Videos'); }
}

export function docCaiDat(thuMucMacDinh = thuMucVideoMacDinh()): CaiDat {
  return chuanHoaCaiDat(docJson('cai-dat.json'), caiDatMacDinh(thuMucMacDinh));
}

export function ghiCaiDat(c: CaiDat): Promise<void> {
  return ghiJson('cai-dat.json', c);
}

// ── Mã kết nối ────────────────────────────────────────────────────────────────

const TEP_MA = 'ma-ket-noi.bin';
/** Không mã hoá được (Linux thiếu kho khoá) ⇒ chỉ giữ trong RAM, mở lại app phải dán lại. KHÔNG ghi chữ thường. */
let maTrongRam: string | null = null;

export function luuMaDuoc(): boolean {
  try { return safeStorage.isEncryptionAvailable(); } catch { return false; }
}

export function docMa(): string | null {
  if (maTrongRam) return maTrongRam;
  if (!luuMaDuoc()) return null;
  try {
    return safeStorage.decryptString(fs.readFileSync(tep(TEP_MA)));
  } catch {
    return null;
  }
}

export async function luuMa(ma: string): Promise<void> {
  if (!luuMaDuoc()) { maTrongRam = ma; return; }
  await fsp.mkdir(app.getPath('userData'), { recursive: true });
  await fsp.writeFile(tep(TEP_MA), safeStorage.encryptString(ma), { mode: 0o600 });
}

export async function xoaMa(): Promise<void> {
  maTrongRam = null;
  await fsp.rm(tep(TEP_MA), { force: true });
}
