/**
 * Tìm trình duyệt họ Chromium CÓ SẴN trên máy (Chrome / Edge / Brave / Chromium).
 *
 * Vì sao không tải Chromium như `puppeteer` đầy đủ: gói đó kéo ~170MB về lúc
 * cài, và extension VS Code/CLI không được phép cài một trình duyệt thứ hai sau
 * lưng người dùng. Gần như máy nào cũng có sẵn Chrome hoặc Edge (Windows cài
 * kèm Edge) — dùng luôn cái đó qua `puppeteer-core`.
 *
 * `CUONGMINI_TRINH_DUYET=<đường dẫn>` ép một trình duyệt cụ thể (máy có nhiều
 * bản, hoặc Chrome cài ở chỗ lạ).
 */
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const LOI_KHONG_CO_TRINH_DUYET =
  'Không tìm thấy trình duyệt nào trên máy. Cài Google Chrome hoặc Microsoft Edge để AI điều khiển trình duyệt '
  + '(hoặc đặt biến môi trường CUONGMINI_TRINH_DUYET trỏ tới file chạy của Chrome/Edge/Brave/Chromium).';

/** Danh sách ứng viên theo thứ tự ưu tiên — Chrome trước (đúng thứ người dùng quen nhìn). */
export function ungVienTrinhDuyet(nenTang: NodeJS.Platform = process.platform, env: NodeJS.ProcessEnv = process.env): string[] {
  const ds: string[] = [];
  if (nenTang === 'darwin') {
    const app = [
      'Google Chrome.app/Contents/MacOS/Google Chrome',
      'Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      'Brave Browser.app/Contents/MacOS/Brave Browser',
      'Chromium.app/Contents/MacOS/Chromium',
      'Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    ];
    for (const a of app) ds.push(path.join('/Applications', a), path.join(os.homedir(), 'Applications', a));
  } else if (nenTang === 'win32') {
    const goc = [env.PROGRAMFILES, env['PROGRAMFILES(X86)'], env.LOCALAPPDATA].filter((x): x is string => !!x);
    const con = [
      'Google\\Chrome\\Application\\chrome.exe',
      'Microsoft\\Edge\\Application\\msedge.exe',
      'BraveSoftware\\Brave-Browser\\Application\\brave.exe',
      'Chromium\\Application\\chrome.exe',
    ];
    for (const c of con) for (const g of goc) ds.push(path.win32.join(g, c));
  } else {
    const ten = [
      'google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser',
      'microsoft-edge-stable', 'microsoft-edge', 'brave-browser',
    ];
    const thuMuc = (env.PATH ?? '').split(path.delimiter).filter(Boolean);
    for (const t of ten) for (const d of [...thuMuc, '/usr/bin', '/usr/local/bin', '/snap/bin']) ds.push(path.join(d, t));
    ds.push('/opt/google/chrome/chrome', '/opt/microsoft/msedge/msedge', '/opt/brave.com/brave/brave');
  }
  return [...new Set(ds)];
}

/** Đường dẫn file chạy của trình duyệt, hoặc `null`. */
export function timTrinhDuyet(): string | null {
  const ep = process.env.CUONGMINI_TRINH_DUYET?.trim();
  if (ep) return existsSync(ep) ? ep : null;
  return ungVienTrinhDuyet().find((p) => existsSync(p)) ?? null;
}
