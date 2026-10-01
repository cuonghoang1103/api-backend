/**
 * ============================================================
 * FILE VĂN PHÒNG ĐỊNH DẠNG CŨ / ODF — chuyển sang dạng đọc được
 * ============================================================
 *
 * `.doc` `.ppt` `.xls` (Office 97–2003) là định dạng nhị phân OLE, không phải
 * zip XML — tự viết bộ đọc cho chúng là cả một dự án. Tài liệu môn học thì
 * vẫn đầy những file đó. Nên: mượn công cụ CÓ SẴN trên máy.
 *
 *   • macOS `textutil` (luôn có) — đọc .doc .rtf .odt .docx → chữ.
 *   • LibreOffice `soffice` (nếu cài) — đổi .ppt/.xls/.doc/.odp/.ods/.odt
 *     sang .pptx/.xlsx/.docx trong thư mục tạm, rồi `docOffice` đọc như thường.
 *
 * Không có công cụ nào ⇒ nói ĐÚNG lý do và cách gỡ, thay vì "file nhị phân".
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const DUOI_CU = new Set(['.doc', '.ppt', '.xls', '.rtf', '.odt', '.odp', '.ods']);

/** Đổi sang định dạng mới nào để `docOffice` đọc được. */
const SANG: Record<string, '.docx' | '.pptx' | '.xlsx'> = {
  '.doc': '.docx', '.rtf': '.docx', '.odt': '.docx',
  '.ppt': '.pptx', '.odp': '.pptx',
  '.xls': '.xlsx', '.ods': '.xlsx',
};

function chay(lenh: string, thamSo: string[], hanMs: number): Promise<{ ok: boolean; ra: string; loi: string }> {
  return new Promise((xong) => {
    execFile(lenh, thamSo, { timeout: hanMs, maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err, ra, loi) => {
      xong({ ok: !err, ra: String(ra ?? ''), loi: String(loi ?? (err as Error | null)?.message ?? '') });
    });
  });
}

let sofficeDaTim: string | null | undefined;

/** Đường dẫn `soffice`, hoặc `null`. Tìm một lần mỗi lần mở app. */
export async function timSoffice(): Promise<string | null> {
  if (sofficeDaTim !== undefined) return sofficeDaTim;
  const ung = [
    '/Applications/LibreOffice.app/Contents/MacOS/soffice',
    'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
    'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
    '/usr/bin/soffice', '/usr/local/bin/soffice', '/opt/homebrew/bin/soffice', '/snap/bin/libreoffice',
  ];
  for (const u of ung) {
    try { await fs.access(u); sofficeDaTim = u; return u; } catch { /* thử cái sau */ }
  }
  // Có trong PATH (đã gộp PATH thật của người dùng — xem duongLenh.ts)?
  const tim = await chay(process.platform === 'win32' ? 'where' : 'which', ['soffice'], 3000);
  sofficeDaTim = tim.ok && tim.ra.trim() ? tim.ra.trim().split(/\r?\n/)[0]! : null;
  return sofficeDaTim;
}

export type KetQuaDoiCu =
  | { kieu: 'office'; byte: Buffer; duoi: '.docx' | '.pptx' | '.xlsx'; nho: string }
  | { kieu: 'chu'; chu: string; nho: string }
  | { kieu: 'loi'; loi: string };

export async function doiFileCu(duong: string): Promise<KetQuaDoiCu> {
  const duoi = path.extname(duong).toLowerCase();
  const dich = SANG[duoi];
  if (!dich) return { kieu: 'loi', loi: `không hỗ trợ ${duoi}` };

  const soffice = await timSoffice();
  if (soffice) {
    const tam = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-doi-'));
    try {
      // Hồ sơ người dùng RIÊNG: LibreOffice đang mở sẵn thì lệnh headless dùng
      // chung hồ sơ sẽ thoát ngay mà không đổi gì.
      const hoSo = `-env:UserInstallation=file://${path.join(tam, 'ho-so').split(path.sep).join('/')}`;
      const r = await chay(soffice, [hoSo, '--headless', '--convert-to', dich.slice(1), '--outdir', tam, duong], 120_000);
      const ra = path.join(tam, `${path.basename(duong, path.extname(duong))}${dich}`);
      const byte = await fs.readFile(ra).catch(() => null);
      if (byte) return { kieu: 'office', byte, duoi: dich, nho: `đã đổi ${duoi} → ${dich} bằng LibreOffice` };
      if (!r.ok && process.platform !== 'darwin') return { kieu: 'loi', loi: `LibreOffice đổi hỏng: ${r.loi.slice(0, 200)}` };
    } finally {
      void fs.rm(tam, { recursive: true, force: true }).catch(() => {});
    }
  }

  // macOS: `textutil` đọc được văn bản (không đọc được slide / bảng tính).
  if (process.platform === 'darwin' && (duoi === '.doc' || duoi === '.rtf' || duoi === '.odt')) {
    const r = await chay('/usr/bin/textutil', ['-convert', 'txt', '-stdout', duong], 60_000);
    if (r.ok && r.ra.trim()) return { kieu: 'chu', chu: r.ra, nho: 'rút chữ bằng textutil của macOS' };
  }

  const loai = duoi === '.ppt' || duoi === '.odp' ? 'slide' : duoi === '.xls' || duoi === '.ods' ? 'bảng tính' : 'văn bản';
  return {
    kieu: 'loi',
    loi: `${loai} định dạng ${duoi} cần LibreOffice để đọc, mà máy chưa cài. Cách gỡ: người dùng cài LibreOffice `
      + '(miễn phí, libreoffice.org) rồi hỏi lại; HOẶC mở file bằng PowerPoint/Word/Excel/Keynote và lưu lại thành '
      + `${dich} hay xuất PDF. ĐỪNG nói là không đọc được slide nói chung — ${dich} và PDF đều đọc được.`,
  };
}
