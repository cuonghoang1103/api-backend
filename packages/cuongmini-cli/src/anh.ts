/**
 * ẢNH GỬI KÈM. Terminal không dán được ảnh như khung chat, nên có hai đường:
 *  • `@anh.png` (đường tương đối trong dự án);
 *  • KÉO file ảnh vào terminal ⇒ terminal dán ĐƯỜNG DẪN tuyệt đối — có khi
 *    bọc nháy (`'/a b/c.png'`, iTerm) hoặc thoát dấu cách (`/a\ b/c.png`,
 *    Terminal.app). Cả hai dạng đều phải nhận ra.
 * Đường ảnh trong câu được thay bằng `[ảnh: tên]` — model nhận ảnh thật kèm theo.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const DUOI_ANH = /\.(png|jpe?g|gif|webp|heic|heif|avif|tiff?|bmp)$/i;
const MIME: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
  heic: 'image/heic', heif: 'image/heif', avif: 'image/avif', tif: 'image/tiff', tiff: 'image/tiff', bmp: 'image/bmp',
};
export const TRAN_ANH = 8;

function moRong(p: string, cwd: string): string {
  const bo = p.replace(/\\ /g, ' ');
  if (bo.startsWith('~/')) return path.join(os.homedir(), bo.slice(2));
  return path.isAbsolute(bo) ? bo : path.resolve(cwd, bo);
}

export interface KetQuaTachAnh { text: string; anh: string[]; daNhac: Set<string> }

/**
 * Tìm ảnh trong câu. `laFile` tiêm vào để test không cần đĩa thật.
 * Trả câu đã thay đường ảnh bằng `[ảnh: tên]`, danh sách đường tuyệt đối,
 * và các token `@…` đã dùng làm ảnh (để khỏi nhắc model "đọc file" đó).
 */
export function tachAnh(text: string, cwd: string, laFile: (p: string) => boolean = macDinhLaFile): KetQuaTachAnh {
  const anh: string[] = [];
  const daNhac = new Set<string>();
  const them = (tuyetDoi: string): boolean => {
    if (anh.length >= TRAN_ANH || !laFile(tuyetDoi)) return false;
    if (!anh.includes(tuyetDoi)) anh.push(tuyetDoi);
    return true;
  };
  // 1) Bọc nháy: '…/x.png' hoặc "…/x.png"
  let ra = text.replace(/(['"])((?:~|\/|[A-Za-z]:[\\/])[^'"\n]*?)\1/g, (m, _q: string, p: string) => {
    if (!DUOI_ANH.test(p)) return m;
    const td = moRong(p, cwd);
    return them(td) ? `[ảnh: ${path.basename(td)}]` : m; // i18n-bo-qua: chữ gửi model
  });
  // 2) `@đường` và đường tuyệt đối trần (cho phép `\ ` bên trong).
  ra = ra.replace(/(^|\s)(@?)((?:~\/|\/|[A-Za-z]:[\\/]|\.{0,2}[\w-])(?:\\ |[^\s])*)/g, (m, dau: string, a: string, p: string) => {
    if (!DUOI_ANH.test(p)) return m;
    // Đường trần (không `@`) phải tuyệt đối — "xem a.png" trong câu chưa chắc là muốn gửi ảnh.
    if (!a && !(p.startsWith('/') || p.startsWith('~/') || /^[A-Za-z]:[\\/]/.test(p))) return m;
    const td = moRong(p, cwd);
    if (!them(td)) return m;
    if (a) daNhac.add(p);
    return `${dau}[ảnh: ${path.basename(td)}]`; // i18n-bo-qua: chữ gửi model
  });
  return { text: ra, anh, daNhac };
}

function macDinhLaFile(p: string): boolean {
  try {
    return existsSync(p) && statSync(p).isFile() && statSync(p).size < 40 * 1024 * 1024;
  } catch {
    return false;
  }
}

/** Đọc file ảnh ⇒ data URL (chưa chuẩn hoá — `chuanHoaAnh` của lõi lo phần HEIC/xoay/thu nhỏ). */
export function docAnhDataUrl(duong: string): string {
  const duoi = (/\.([a-z]+)$/i.exec(duong)?.[1] ?? 'png').toLowerCase();
  const mime = MIME[duoi] ?? 'application/octet-stream';
  return `data:${mime};base64,${readFileSync(duong).toString('base64')}`;
}

/** Ảnh gửi thẳng được (đúng 4 định dạng cổng nhận và đủ nhỏ) hay phải qua lõi chuẩn hoá. */
export const guiThangDuoc = (dataUrl: string): boolean => /^data:image\/(png|jpeg|webp|gif);/.test(dataUrl) && dataUrl.length < 3_500_000;
