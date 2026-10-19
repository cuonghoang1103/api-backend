/**
 * THÔNG BÁO khi xong lượt dài hoặc khi cần duyệt — chuông terminal + thông báo
 * của hệ điều hành (đợt 8C, 19/10/2026: làm lại vì "logo + chữ lỗi/xấu").
 *
 * Nguyên nhân chữ lỗi trên macOS (đo thật): bản cũ đưa chữ qua biến môi trường
 * rồi đọc bằng `system attribute` của AppleScript — hàm đó giải mã theo MacRoman,
 * nên "tiếng Việt" thành "ti·∫øng Vi·ªát". Nay chữ đi qua ARGV (`on run argv`,
 * giải mã UTF-8), vẫn không ghép vào mã script (chữ của model/tên file có thể
 * chứa dấu nháy — ghép vào AppleScript/PowerShell là cửa chạy mã lạ).
 * Logo xấu: `display notification` luôn mang icon Script Editor; Windows dùng
 * `SystemIcons::Information` của NotifyIcon. Nay:
 *   macOS   terminal-notifier (nếu cài, kèm logo CuongMini) ⇒ osascript (tiêu đề CuongMini, phụ đề = tên phiên)
 *           — iTerm2/ghostty/WezTerm thì ManChat gửi thông báo GỐC của terminal (OSC 9 / 777) thay cho cả hai.
 *   Windows toast WinRT (Windows PowerShell 5.1) với AppUserModelID "CuongMini.CLI" + logo ⇒ BurntToast ⇒ bóng NotifyIcon có logo.
 *   Linux   notify-send -a CuongMini -i <logo>.
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { duongBieuTuong, type DuongBieuTuong } from './bieuTuong';
import { L } from './i18n';

export interface NoiDungThongBao {
  /** Luôn "CuongMini". */
  tieuDe: string;
  /** Tên phiên (việc) — phụ đề macOS / dòng 2 toast Windows. */
  phuDe: string;
  /** Một dòng KHÔNG có tên phiên (vì đã có phụ đề): "Xong · 2 phút 14 giây". */
  noiDung: string;
  /** Một dòng ĐỦ cho kênh chỉ có một dòng (OSC 9, notify-send): "Xong · <tên phiên> · 2 phút 14 giây". */
  dayDu: string;
}

export type LoaiThongBao = 'xong' | 'loi' | 'duyet';

/** "2 phút 14 giây" / "45 giây" / "1 giờ 3 phút" (EN: "2m 14s"). */
export function thoiLuongChu(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const g = Math.floor(s / 3600);
  const p = Math.floor((s % 3600) / 60);
  const giay = s % 60;
  if (g) return L(`${g} giờ${p ? ` ${p} phút` : ''}`, `${g}h${p ? ` ${p}m` : ''}`);
  if (p) return L(`${p} phút${giay ? ` ${giay} giây` : ''}`, `${p}m${giay ? ` ${giay}s` : ''}`);
  return L(`${giay} giây`, `${giay}s`);
}

/**
 * Một dòng sạch: bỏ ký tự điều khiển (ESC/BEL phá chuỗi OSC; xuống dòng phá "≤ 1 dòng"), gộp khoảng trắng,
 * cắt kèm "…". Không bắt đầu bằng "-" (osascript/terminal-notifier/notify-send hiểu là cờ).
 */
export function motDong(s: string, toiDa = 140): string {
  let r = s.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (r.startsWith('-')) r = `–${r.slice(1)}`;
  return r.length > toiDa ? `${r.slice(0, toiDa - 1).trimEnd()}…` : r;
}

export function soanThongBao(loai: LoaiThongBao, tenPhien: string, thoiLuongMs?: number): NoiDungThongBao {
  const ten = motDong(tenPhien, 80);
  const tg = thoiLuongMs !== undefined && thoiLuongMs > 0 ? thoiLuongChu(thoiLuongMs) : '';
  const nhan = loai === 'xong' ? L('Xong', 'Done') : loai === 'loi' ? L('Gặp lỗi', 'Failed') : L('Cần bạn duyệt', 'Needs your approval');
  return {
    tieuDe: 'CuongMini',
    phuDe: ten,
    noiDung: motDong([nhan, tg].filter(Boolean).join(' · ')),
    dayDu: motDong([nhan, ten, tg].filter(Boolean).join(' · ')),
  };
}

export interface LenhThongBao { file: string; args: string[]; env: Record<string, string> }

export interface TuyChonLenh {
  icon?: DuongBieuTuong | null;
  /** Đường `terminal-notifier` (macOS) nếu có trên PATH. */
  terminalNotifier?: string | null;
  /** Bundle id của app terminal (`__CFBundleIdentifier`) — bấm thông báo thì đưa terminal lên trước. */
  bundleId?: string;
}

/**
 * Script toast Windows (Windows PowerShell 5.1 — pwsh 7 KHÔNG nạp được WinRT). Script đi bằng `-EncodedCommand`
 * (UTF-16LE), chữ người dùng đi qua biến môi trường (khối env của CreateProcessW là UTF-16 ⇒ không có "?"), XML dựng bằng CreateTextNode (không ghép
 * chuỗi ⇒ `<`, `&`, `"` an toàn). In ra stdout một từ: TOAST:<aumid> | BT | BALLOON (để test trên runner).
 */
export const PS_TOAST = [
  "$ErrorActionPreference = 'Stop'",
  '$t = $env:CM_TB_TIEU_DE; $p = $env:CM_TB_PHU_DE; $b = $env:CM_TB_NOI_DUNG; $png = $env:CM_TB_PNG; $ico = $env:CM_TB_ICO',
  "$aumid = 'CuongMini.CLI'; $psId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe'",
  'function Ghi($s) { if ($env:CM_TB_RA) { [IO.File]::AppendAllText($env:CM_TB_RA, $s + "`n", [Text.Encoding]::UTF8) } }',
  'try {',
  '  $null = [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]',
  '  $null = [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime]',
  // AUMID tự khai trong HKCU (không cần quyền admin, không cần lối tắt Start): tiêu đề toast = "CuongMini" + logo.
  '  $id = $psId',
  "  try { $k = 'HKCU:\\Software\\Classes\\AppUserModelId\\' + $aumid; if (-not (Test-Path $k)) { $null = New-Item -Path $k -Force }",
  "    Set-ItemProperty -Path $k -Name DisplayName -Value 'CuongMini'; if ($png) { Set-ItemProperty -Path $k -Name IconUri -Value $png }",
  '    $n = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($aumid); $null = $n.Setting; $id = $aumid } catch { }',
  '  $x = New-Object Windows.Data.Xml.Dom.XmlDocument',
  "  $x.LoadXml('<toast><visual><binding template=\"ToastGeneric\"><text/><text/></binding></visual></toast>')",
  "  $tx = $x.GetElementsByTagName('text')",
  '  $null = $tx.Item(0).AppendChild($x.CreateTextNode($b)); $null = $tx.Item(1).AppendChild($x.CreateTextNode($p))',
  '  if ($id -eq $psId) { $null = $tx.Item(0).ParentNode.InsertBefore($x.CreateElement(\'text\'), $tx.Item(0)); $null = $x.GetElementsByTagName(\'text\').Item(0).AppendChild($x.CreateTextNode($t)) }',
  "  if ($png -and (Test-Path -LiteralPath $png)) { $im = $x.CreateElement('image'); $im.SetAttribute('placement', 'appLogoOverride'); $im.SetAttribute('hint-crop', 'circle'); $im.SetAttribute('src', ([Uri]$png).AbsoluteUri); $null = $x.GetElementsByTagName('binding').Item(0).AppendChild($im) }",
  "  Ghi ('XML:' + $x.GetXml()); Ghi ('ID:' + $id)",
  '  if (-not $env:CM_TB_KHONG_HIEN) { [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($id).Show([Windows.UI.Notifications.ToastNotification]::new($x)) }',
  "  [Console]::Out.Write('TOAST:' + $id); exit 0",
  "} catch { Ghi ('LOI_TOAST:' + $_.Exception.Message) }",
  "if (Get-Module -ListAvailable -Name BurntToast) { try { Import-Module BurntToast; if (-not $env:CM_TB_KHONG_HIEN) { New-BurntToastNotification -Text $b, $p -AppLogo $png }; [Console]::Out.Write('BT'); exit 0 } catch { Ghi ('LOI_BT:' + $_.Exception.Message) } }",
  'Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing',
  '$nb = New-Object System.Windows.Forms.NotifyIcon',
  'try { $nb.Icon = New-Object System.Drawing.Icon($ico) } catch { $nb.Icon = [System.Drawing.SystemIcons]::Information }',
  "$nb.Text = 'CuongMini'; $nb.Visible = $true",
  "if (-not $env:CM_TB_KHONG_HIEN) { $nb.ShowBalloonTip(6000, $t + ' · ' + $p, $b, [System.Windows.Forms.ToolTipIcon]::None); Start-Sleep -Seconds 7 }",
  "$nb.Dispose(); [Console]::Out.Write('BALLOON'); exit 0",
].join('\n');

/** `-EncodedCommand` = base64 UTF-16LE: không còn chuyện Node/PowerShell hiểu khác nhau về dấu nháy trong `-Command`. */
export const maHoaPs = (script: string): string => Buffer.from(script, 'utf16le').toString('base64');

/** Lệnh gửi thông báo. Thuần (test được trên mọi máy). `null` = nền tảng không có cách nào. */
export function lenhThongBao(nenTang: string, nd: NoiDungThongBao, o: TuyChonLenh = {}): LenhThongBao | null {
  const tieuDe = motDong(nd.tieuDe, 60) || 'CuongMini';
  const phuDe = motDong(nd.phuDe, 80);
  const noiDung = motDong(nd.noiDung);
  const dayDu = motDong(nd.dayDu);
  if (nenTang === 'darwin') {
    if (o.terminalNotifier) {
      const args = ['-title', tieuDe, '-message', noiDung || dayDu, '-group', 'cuongmini'];
      if (phuDe) args.push('-subtitle', phuDe);
      if (o.icon?.png) args.push('-contentImage', o.icon.png);
      if (o.bundleId && /^[\w.-]+$/.test(o.bundleId)) args.push('-activate', o.bundleId);
      return { file: o.terminalNotifier, args, env: {} };
    }
    // Chữ qua ARGV (UTF-8 đúng) — KHÔNG qua `system attribute` (MacRoman ⇒ chữ Việt vỡ).
    const as = ['on run argv', 'display notification (item 3 of argv) with title (item 1 of argv) subtitle (item 2 of argv)', 'end run'];
    return { file: 'osascript', args: [...as.flatMap((d) => ['-e', d]), tieuDe, phuDe, noiDung || dayDu], env: {} };
  }
  if (nenTang === 'win32') {
    return {
      file: 'powershell.exe',
      args: ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-EncodedCommand', maHoaPs(PS_TOAST)],
      env: { CM_TB_TIEU_DE: tieuDe, CM_TB_PHU_DE: phuDe, CM_TB_NOI_DUNG: noiDung || dayDu, CM_TB_PNG: o.icon?.png ?? '', CM_TB_ICO: o.icon?.ico ?? '' },
    };
  }
  if (nenTang === 'linux' || nenTang === 'freebsd') {
    return { file: 'notify-send', args: ['-a', 'CuongMini', ...(o.icon?.png ? ['-i', o.icon.png] : []), '--', tieuDe, dayDu], env: {} };
  }
  return null;
}

/** Tìm một lệnh trên PATH (không chạy shell). */
export function timTrenPath(ten: string, env: NodeJS.ProcessEnv = process.env): string | null {
  for (const d of (env.PATH ?? '').split(path.delimiter)) {
    if (!d) continue;
    const p = path.join(d, ten);
    if (existsSync(p)) return p;
  }
  return null;
}

export function guiThongBaoHeThong(nd: NoiDungThongBao): void {
  const l = lenhThongBao(process.platform, nd, {
    icon: duongBieuTuong(),
    terminalNotifier: process.platform === 'darwin' ? timTrenPath('terminal-notifier') : null,
    bundleId: process.env.__CFBundleIdentifier,
  });
  if (!l) return;
  try {
    const p = spawn(l.file, l.args, { env: { ...process.env, ...l.env }, stdio: 'ignore', detached: true, windowsHide: true });
    p.once('error', () => undefined);
    p.unref();
  } catch { /* không có công cụ thông báo thì thôi */ }
}

/** Chạy ĐỒNG BỘ và trả stdout (chỉ cho `cuongmini doctor --thu-thong-bao` / kiểm trên runner). */
export function thuThongBaoDongBo(nd: NoiDungThongBao, them: Record<string, string> = {}): { ma: number | null; ra: string; loi: string } {
  const l = lenhThongBao(process.platform, nd, { icon: duongBieuTuong(), terminalNotifier: process.platform === 'darwin' ? timTrenPath('terminal-notifier') : null });
  if (!l) return { ma: null, ra: '', loi: 'khong-ho-tro' };
  const r = spawnSync(l.file, l.args, { env: { ...process.env, ...l.env, ...them }, encoding: 'utf8', timeout: 30_000, windowsHide: true });
  return { ma: r.status, ra: String(r.stdout ?? ''), loi: String(r.stderr ?? r.error?.message ?? '') };
}

/** Chuông terminal (BEL) — nhiều terminal nháy tab/đổ huy hiệu Dock khi đang ở cửa sổ khác. */
export function rungChuong(): void {
  if (process.stdout.isTTY) process.stdout.write('\x07');
}
