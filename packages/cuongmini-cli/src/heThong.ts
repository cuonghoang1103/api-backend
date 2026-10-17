/**
 * Việc "vỏ" của hệ điều hành mà lõi cần: mở trình duyệt/file, chép chữ.
 * Không lệnh nào ở đây được làm treo CLI — tất cả `spawn` tách rời, có hạn giờ.
 */
import { spawn } from 'node:child_process';

function chay(lenh: string, thamSo: string[], dauVao?: string, nguyenVan = false): Promise<boolean> {
  return new Promise((xong) => {
    try {
      const p = spawn(lenh, thamSo, {
        stdio: [dauVao === undefined ? 'ignore' : 'pipe', 'ignore', 'ignore'], detached: dauVao === undefined, windowsHide: true,
        windowsVerbatimArguments: nguyenVan,
      });
      // `spawn` KHÔNG ném khi lệnh không tồn tại — lỗi đến qua sự kiện 'error'.
      p.once('error', () => xong(false));
      if (dauVao !== undefined) {
        p.stdin?.end(dauVao);
        p.once('close', (ma) => xong(ma === 0));
        setTimeout(() => xong(false), 3000).unref();
      } else {
        p.once('spawn', () => { p.unref(); xong(true); });
      }
    } catch {
      xong(false);
    }
  });
}

/** Mở URL/file bằng chương trình mặc định (macOS `open`, Linux `xdg-open`, Windows `start`). */
export function moNgoai(dich: string): Promise<boolean> {
  if (process.env.CUONGMINI_KHONG_MO_TRINH_DUYET === '1') return Promise.resolve(false);
  if (process.platform === 'darwin') return chay('open', [dich]);
  // Ưu tiên rundll32 (không qua cmd ⇒ `&` trong URL đăng nhập không bị hiểu là nối lệnh).
  // Hỏng thì `start` với tham số NGUYÊN VĂN trong nháy kép — trong nháy, cmd không hiểu `&` là nối lệnh.
  if (process.platform === 'win32') {
    return chay('rundll32', ['url.dll,FileProtocolHandler', dich]).then((ok) => ok
      || chay('cmd.exe', [`/d /s /c "start "" "${dich.replace(/"/g, '%22')}""`], undefined, true));
  }
  return chay('xdg-open', [dich]);
}

/** Chép vào clipboard: công cụ hệ thống, không có thì OSC 52 (đi được cả qua SSH). */
export async function chepChu(chu: string): Promise<void> {
  const thu: Array<[string, string[]]> = process.platform === 'darwin' ? [['pbcopy', []]]
    // `clip.exe` đọc stdin theo bảng mã OEM ⇒ chữ tiếng Việt vỡ; PowerShell đọc UTF-8 rồi Set-Clipboard.
    : process.platform === 'win32' ? [['powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', '[Console]::InputEncoding=[Text.Encoding]::UTF8; Set-Clipboard -Value ([Console]::In.ReadToEnd())']], ['clip', []]]
      : [['wl-copy', []], ['xclip', ['-selection', 'clipboard']], ['xsel', ['--clipboard', '--input']]];
  for (const [l, a] of thu) if (await chay(l, a, chu)) return;
  if (process.stdout.isTTY) process.stdout.write(`\x1b]52;c;${Buffer.from(chu).toString('base64')}\x07`);
}
