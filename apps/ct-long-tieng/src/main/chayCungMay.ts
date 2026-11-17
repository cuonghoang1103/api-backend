/**
 * "Chạy cùng máy": macOS/Windows dùng login item của Electron; Linux không có API đó ⇒ tệp
 * `~/.config/autostart/ct-long-tieng.desktop` (chuẩn XDG). Mở cùng máy thì khởi động ẨN (`--an`), chỉ hiện khay.
 */
import { app } from 'electron';
import fsp from 'node:fs/promises';
import path from 'node:path';

const TEP_LINUX = () => path.join(app.getPath('home'), '.config', 'autostart', 'ct-long-tieng.desktop');

export async function datChayCungMay(bat: boolean): Promise<void> {
  if (!app.isPackaged) return; // bản dev: không đăng ký Electron trần vào khởi động máy
  if (process.platform === 'linux') {
    const exe = process.env.APPIMAGE ?? process.execPath;
    if (bat) {
      await fsp.mkdir(path.dirname(TEP_LINUX()), { recursive: true });
      await fsp.writeFile(TEP_LINUX(), [
        '[Desktop Entry]', 'Type=Application', 'Name=CT Lồng Tiếng', `Exec="${exe}" --an`, 'X-GNOME-Autostart-enabled=true', '',
      ].join('\n'));
    } else {
      await fsp.rm(TEP_LINUX(), { force: true });
    }
    return;
  }
  app.setLoginItemSettings({ openAtLogin: bat, args: ['--an'] });
}

export function moCungMay(): boolean {
  if (process.argv.includes('--an')) return true;
  if (process.platform === 'darwin') {
    try { return app.getLoginItemSettings().wasOpenedAtLogin; } catch { return false; }
  }
  return false;
}
