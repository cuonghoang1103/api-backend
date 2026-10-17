/**
 * THÔNG BÁO khi xong lượt dài hoặc khi cần duyệt — chuông terminal + thông báo
 * của hệ điều hành. Nội dung đi qua BIẾN MÔI TRƯỜNG, không ghép vào chuỗi lệnh:
 * chữ của model/tên file có thể chứa dấu nháy, và ghép vào AppleScript/PowerShell
 * là cửa chạy mã lạ.
 */
import { spawn } from 'node:child_process';

export interface LenhThongBao { file: string; args: string[]; env: Record<string, string> }

export function lenhThongBao(nenTang: string, tieuDe: string, noiDung: string): LenhThongBao | null {
  const env = { CM_TIEU_DE: tieuDe.slice(0, 120), CM_NOI_DUNG: noiDung.slice(0, 300) };
  if (nenTang === 'darwin') {
    return { file: 'osascript', args: ['-e', 'display notification (system attribute "CM_NOI_DUNG") with title (system attribute "CM_TIEU_DE")'], env };
  }
  if (nenTang === 'win32') {
    // NotifyIcon (WinForms) chạy được cả Windows PowerShell 5.1 lẫn pwsh 7 — không cần module ngoài.
    const ps = [
      'Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing',
      '$n = New-Object System.Windows.Forms.NotifyIcon',
      '$n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true',
      '$n.ShowBalloonTip(6000, $env:CM_TIEU_DE, $env:CM_NOI_DUNG, [System.Windows.Forms.ToolTipIcon]::Info)',
      'Start-Sleep -Seconds 7; $n.Dispose()',
    ].join('; ');
    return { file: 'powershell.exe', args: ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', ps], env };
  }
  if (nenTang === 'linux') return { file: 'notify-send', args: ['--app-name=CuongMini', tieuDe, noiDung], env };
  return null;
}

export function guiThongBaoHeThong(tieuDe: string, noiDung: string): void {
  const l = lenhThongBao(process.platform, tieuDe, noiDung);
  if (!l) return;
  try {
    const p = spawn(l.file, l.args, { env: { ...process.env, ...l.env }, stdio: 'ignore', detached: true, windowsHide: true });
    p.once('error', () => undefined);
    p.unref();
  } catch { /* không có công cụ thông báo thì thôi */ }
}

/** Chuông terminal (BEL) — nhiều terminal nháy tab/đổ huy hiệu Dock khi đang ở cửa sổ khác. */
export function rungChuong(): void {
  if (process.stdout.isTTY) process.stdout.write('\x07');
}
