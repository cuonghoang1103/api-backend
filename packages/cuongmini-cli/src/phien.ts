/**
 * PHIÊN ĐĂNG NHẬP + thư mục dữ liệu của CLI.
 *
 * Token cất ở `~/.cuongmini/phien.json` quyền 0600 (thư mục 0700) — cùng cách
 * `gh` CLI cất `hosts.yml`: terminal không có Keychain chung cho mọi hệ điều
 * hành, và một file chỉ chủ máy đọc được là mức chuẩn của công cụ dòng lệnh.
 * Token là ACCESS token đổi mới được (`/auth/refresh`), không phải mật khẩu.
 *
 * `CUONGMINI_HOME` đổi thư mục gốc — để kiểm thử không bao giờ đụng HOME thật.
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { lamMoi, LoiDangNhap, type NguoiDung } from '../../cuongmini-core/src/dangNhap';

export type { NguoiDung };

export const thuMucGoc = (): string => process.env.CUONGMINI_HOME || path.join(os.homedir(), '.cuongmini');
export const duongPhien = (): string => path.join(thuMucGoc(), 'phien.json');
export const thuMucDuLieu = (): string => path.join(thuMucGoc(), 'data');
export const duongLichSu = (): string => path.join(thuMucGoc(), 'lich-su.txt');

export function damBaoThuMuc(p: string, quyen = 0o700): void {
  if (!existsSync(p)) mkdirSync(p, { recursive: true, mode: quyen });
}

export function docPhien(): NguoiDung | null {
  try {
    const j = JSON.parse(readFileSync(duongPhien(), 'utf8')) as Partial<NguoiDung>;
    if (typeof j.token !== 'string' || typeof j.userId !== 'number') return null;
    return j as NguoiDung;
  } catch {
    return null;
  }
}

export function luuPhien(n: NguoiDung): void {
  damBaoThuMuc(thuMucGoc());
  const p = duongPhien();
  writeFileSync(p, `${JSON.stringify({ ...n, luu: new Date().toISOString() }, null, 2)}\n`, { mode: 0o600 });
  // `mode` chỉ có tác dụng khi TẠO file — file cũ (vd lỡ tạo 0644) phải chmod lại.
  try { chmodSync(p, 0o600); } catch { /* Windows: quyền POSIX không áp dụng */ }
}

export function xoaPhien(): boolean {
  const p = duongPhien();
  if (!existsSync(p)) return false;
  rmSync(p, { force: true });
  return true;
}

/**
 * Phiên đã cất ⇒ xác minh + đổi token mới. Hết hạn hẳn ⇒ xoá + `null`.
 * Mất mạng ⇒ dùng tạm token cũ (lượt sau tự đổi) — đừng bắt đăng nhập lại chỉ vì wifi chập chờn.
 */
export async function moLaiPhien(): Promise<{ nguoi: NguoiDung; ngoaiTuyen: boolean } | null> {
  const cu = docPhien();
  if (!cu) return null;
  try {
    const moi = await lamMoi(cu.token);
    luuPhien(moi);
    return { nguoi: moi, ngoaiTuyen: false };
  } catch (e) {
    if (e instanceof LoiDangNhap && e.ma === 'hetHan') { xoaPhien(); return null; }
    return { nguoi: cu, ngoaiTuyen: true };
  }
}

export const tenHienThi = (n: NguoiDung): string => n.fullName?.trim() || n.username;
