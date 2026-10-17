/**
 * DÁN ẢNH từ clipboard (ctrl+v / alt+v). Terminal không đưa ảnh qua stdin —
 * phím dán chỉ dán CHỮ — nên CLI tự đọc clipboard bằng công cụ của hệ điều hành
 * rồi lưu ra file PNG tạm:
 *   macOS   pngpaste (nếu cài) ⇒ không thì osascript (`the clipboard as «class PNGf»`)
 *   Windows PowerShell: Get-Clipboard -Format Image (5.1) ⇒ không thì System.Windows.Forms
 *   Linux   wl-paste (Wayland) ⇒ xclip (X11)
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { L } from './i18n';
import { thuMucGoc } from './phien';

export interface CachDoc {
  file: string;
  args: string[];
  /** `stdout` = ảnh chảy ra stdout (ghi vào file); `file` = công cụ tự ghi file. */
  ra: 'stdout' | 'file';
}

/** Các cách đọc ảnh theo thứ tự thử. Thuần — `dich` là đường file PNG đích. */
export function cachDocAnh(nenTang: string, dich: string): CachDoc[] {
  if (nenTang === 'darwin') {
    const as = [
      'set f to POSIX file (system attribute "CM_DICH")',
      'set png to (the clipboard as «class PNGf»)',
      'set h to open for access f with write permission',
      'set eof h to 0',
      'write png to h',
      'close access h',
    ];
    return [
      { file: 'pngpaste', args: [dich], ra: 'file' },
      { file: 'osascript', args: as.flatMap((d) => ['-e', d]), ra: 'file' },
    ];
  }
  if (nenTang === 'win32') {
    // Đường đích qua biến môi trường — không ghép chuỗi vào lệnh PowerShell (đường có dấu nháy/dấu tiếng Việt).
    const ps = [
      '$d=$env:CM_DICH; $i=$null',
      'try { $i = Get-Clipboard -Format Image -ErrorAction Stop } catch {}',
      'if (-not $i) { Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $i=[System.Windows.Forms.Clipboard]::GetImage() }',
      'if (-not $i) { exit 3 }',
      '$i.Save($d, [System.Drawing.Imaging.ImageFormat]::Png); exit 0',
    ].join('; ');
    return [
      { file: 'powershell.exe', args: ['-NoProfile', '-NonInteractive', '-STA', '-Command', ps], ra: 'file' },
      { file: 'pwsh', args: ['-NoProfile', '-NonInteractive', '-STA', '-Command', ps], ra: 'file' },
    ];
  }
  return [
    { file: 'wl-paste', args: ['--no-newline', '--type', 'image/png'], ra: 'stdout' },
    { file: 'xclip', args: ['-selection', 'clipboard', '-t', 'image/png', '-o'], ra: 'stdout' },
  ];
}

export const GOI_Y_KHONG_DAN_DUOC: Record<string, () => string> = {
  darwin: () => L('Clipboard không có ảnh. Chụp màn hình vào clipboard bằng ⌘⇧⌃4, hoặc kéo file ảnh vào terminal.', 'No image in the clipboard. Capture to clipboard with ⌘⇧⌃4, or drag an image file into the terminal.'),
  win32: () => L('Clipboard không có ảnh. Chụp bằng Win+Shift+S rồi dán lại (alt+v), hoặc kéo file ảnh vào terminal.', 'No image in the clipboard. Capture with Win+Shift+S and paste again (alt+v), or drag an image file in.'),
  linux: () => L('Không đọc được ảnh từ clipboard — cài wl-clipboard (Wayland) hoặc xclip (X11), hoặc kéo file ảnh vào terminal.', 'Can\'t read an image from the clipboard — install wl-clipboard (Wayland) or xclip (X11), or drag an image file in.'),
};

function thu(c: CachDoc, dich: string): Promise<boolean> {
  return new Promise((xong) => {
    try {
      const p = spawn(c.file, c.args, { env: { ...process.env, CM_DICH: dich }, stdio: ['ignore', c.ra === 'stdout' ? 'pipe' : 'ignore', 'ignore'], windowsHide: true });
      const phan: Buffer[] = [];
      p.stdout?.on('data', (b: Buffer) => phan.push(b));
      p.once('error', () => xong(false));
      const hen = setTimeout(() => { p.kill(); xong(false); }, 8000);
      p.once('close', (ma) => {
        clearTimeout(hen);
        if (ma !== 0) { xong(false); return; }
        if (c.ra === 'stdout') {
          const b = Buffer.concat(phan);
          // Chỉ nhận PNG thật (8 byte chữ ký) — xclip có thể trả chữ khi clipboard chỉ có chữ.
          if (b.length < 8 || b.readUInt32BE(0) !== 0x89504e47) { xong(false); return; }
          writeFileSync(dich, b);
        }
        xong(existsSync(dich) && statSync(dich).size > 0);
      });
    } catch {
      xong(false);
    }
  });
}

/** Ảnh trong clipboard ⇒ đường file PNG, hoặc `null` kèm gợi ý. */
export async function danAnhTuClipboard(): Promise<{ duong: string } | { loi: string }> {
  const thuMuc = path.join(thuMucGoc(), 'tam');
  mkdirSync(thuMuc, { recursive: true, mode: 0o700 });
  const dich = path.join(thuMuc, `anh-dan-${Date.now()}.png`);
  for (const c of cachDocAnh(process.platform, dich)) if (await thu(c, dich)) return { duong: dich };
  return { loi: (GOI_Y_KHONG_DAN_DUOC[process.platform] ?? GOI_Y_KHONG_DAN_DUOC.linux!)() };
}
