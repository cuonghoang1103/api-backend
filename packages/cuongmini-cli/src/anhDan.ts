/**
 * DÁN ẢNH từ clipboard (ctrl+v; Windows: alt+v). Terminal không đưa ảnh qua stdin —
 * phím dán chỉ dán CHỮ (Windows Terminal/conhost còn GIỮ ctrl+v và ctrl+shift+v để dán chữ,
 * clipboard chỉ có ảnh thì nó dán… không gì cả) — nên CLI tự đọc clipboard bằng công cụ
 * của hệ điều hành rồi lưu ra file PNG tạm:
 *   macOS   osascript (`«class furl»` = file ảnh đã chép trong Finder ⇒ `«class PNGf»`) ⇒ lùi pngpaste
 *   Windows Windows PowerShell 5.1 ⇒ lùi pwsh 7: System.Windows.Forms.Clipboard (STA)
 *   Linux   wl-paste (Wayland) ⇒ xclip (X11)
 *
 * Đợt 8C (19/10/2026, kiểm thật trên runner `windows-latest`, PS 5.1 + 7): script đi bằng `-EncodedCommand`
 * (UTF-16LE — không còn chuyện dấu nháy trong `-Command` bị Node/PowerShell hiểu khác nhau), có `-STA`
 * (Clipboard là OLE: thread MTA ⇒ ThreadStateException), `-ExecutionPolicy Bypass`, KHÔNG dùng
 * `Get-Clipboard -Format Image` (không có ở pwsh 7). Kết quả in ra stdout bằng TỪ KHOÁ + base64 UTF-8
 * (console Windows in theo bảng mã OEM ⇒ đường có dấu tiếng Việt thành "?"). Đường đích qua biến môi
 * trường (UTF-16 ⇒ dấu cách/dấu tiếng Việt an toàn). Clipboard rỗng ⇒ "EMPTY" ⇒ báo rõ "không có ảnh",
 * khác hẳn "không đọc được clipboard" (công cụ hỏng/thiếu).
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { laAnhThat } from './anh';
import { L } from './i18n';
import { thuMucGoc } from './phien';

export interface CachDoc {
  file: string;
  args: string[];
  /**
   * `stdout` = ảnh PNG chảy ra stdout (ghi vào file);
   * `tuKhoa` = công cụ tự ghi file và in một từ khoá: OK | EMPTY | FILE:<base64 utf8> | ERR:<base64 utf8>.
   */
  ra: 'stdout' | 'tuKhoa';
}

const DUOI_ANH_PS = String.raw`\.(png|jpe?g|gif|webp|bmp|heic|heif|avif|tiff?)$`;

/** Script đọc clipboard Windows — ASCII, chạy được ở Windows PowerShell 5.1 lẫn pwsh 7. */
export const PS_DOC_ANH = [
  "$ErrorActionPreference = 'Stop'",
  'function B64($s) { [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes([string]$s)) }',
  'try {',
  '  Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing',
  '  $c = [System.Windows.Forms.Clipboard]; $d = $env:CM_DICH',
  // File ảnh đã "Copy" trong Explorer: gửi CHÍNH file đó (không phải ảnh thu nhỏ).
  `  if ($c::ContainsFileDropList()) { foreach ($f in $c::GetFileDropList()) { if ($f -match '${DUOI_ANH_PS}') { [Console]::Out.Write('FILE:' + (B64 $f)); exit 0 } } }`,
  '  if ($c::ContainsImage()) { $i = $c::GetImage(); try { $i.Save($d, [System.Drawing.Imaging.ImageFormat]::Png) } finally { $i.Dispose() }; [Console]::Out.Write(\'OK\'); exit 0 }',
  // Trình duyệt/Office có khi chỉ để định dạng "PNG" (luồng byte) mà không có CF_DIB.
  "  if ($c::ContainsData('PNG')) { $s = $c::GetData('PNG'); if ($s -is [IO.MemoryStream]) { [IO.File]::WriteAllBytes($d, $s.ToArray()); [Console]::Out.Write('OK'); exit 0 } }",
  "  [Console]::Out.Write('EMPTY'); exit 3",
  "} catch { [Console]::Out.Write('ERR:' + (B64 $_.Exception.Message)); exit 4 }",
].join('\n');

const AS_DOC_ANH = [
  'on run argv',
  '  try',
  '    set u to (the clipboard as «class furl»)',
  '    return "FILE:" & (POSIX path of u)',
  '  end try',
  '  try',
  '    set png to (the clipboard as «class PNGf»)',
  '  on error',
  '    return "EMPTY"',
  '  end try',
  '  set h to open for access (POSIX file (item 1 of argv)) with write permission',
  '  set eof h to 0',
  '  write png to h',
  '  close access h',
  '  return "OK"',
  'end run',
];

const maHoaPs = (s: string): string => Buffer.from(s, 'utf16le').toString('base64');

/** Các cách đọc ảnh theo thứ tự thử. Thuần — `dich` là đường file PNG đích. */
export function cachDocAnh(nenTang: string, dich: string): CachDoc[] {
  if (nenTang === 'darwin') {
    // Đường đích qua ARGV (UTF-8) — `system attribute` của AppleScript giải mã MacRoman, đường có dấu sẽ vỡ.
    return [
      { file: 'osascript', args: [...AS_DOC_ANH.flatMap((d) => ['-e', d]), dich], ra: 'tuKhoa' },
      { file: 'pngpaste', args: ['-'], ra: 'stdout' },
    ];
  }
  if (nenTang === 'win32') {
    const args = ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-STA', '-EncodedCommand', maHoaPs(PS_DOC_ANH)];
    return [
      { file: 'powershell.exe', args, ra: 'tuKhoa' },
      { file: 'pwsh.exe', args, ra: 'tuKhoa' },
    ];
  }
  return [
    { file: 'wl-paste', args: ['--no-newline', '--type', 'image/png'], ra: 'stdout' },
    { file: 'xclip', args: ['-selection', 'clipboard', '-t', 'image/png', '-o'], ra: 'stdout' },
  ];
}

export const GOI_Y_KHONG_DAN_DUOC: Record<string, () => string> = {
  darwin: () => L('Clipboard không có ảnh. Chụp màn hình vào clipboard bằng ⌘⇧⌃4, hoặc kéo file ảnh vào terminal.', 'No image in the clipboard. Capture to clipboard with ⌘⇧⌃4, or drag an image file into the terminal.'),
  win32: () => L('Clipboard không có ảnh. Chụp bằng Win+Shift+S rồi bấm alt+v, hoặc kéo file ảnh vào terminal.', 'No image in the clipboard. Capture with Win+Shift+S and press alt+v, or drag an image file in.'),
  linux: () => L('Clipboard không có ảnh — chụp vào clipboard rồi dán lại, hoặc kéo file ảnh vào terminal.', 'No image in the clipboard — capture to the clipboard and paste again, or drag an image file in.'),
};

const THIEU_CONG_CU: Record<string, () => string> = {
  darwin: () => L('Không đọc được clipboard (osascript lỗi).', 'Could not read the clipboard (osascript failed).'),
  win32: () => L('Không đọc được clipboard bằng PowerShell', 'Could not read the clipboard with PowerShell'),
  linux: () => L('Không đọc được ảnh từ clipboard — cài wl-clipboard (Wayland) hoặc xclip (X11), hoặc kéo file ảnh vào terminal.', 'Can\'t read an image from the clipboard — install wl-clipboard (Wayland) or xclip (X11), or drag an image file in.'),
};

export type KetQuaMotCach = { loai: 'anh'; duong: string } | { loai: 'trong' } | { loai: 'loi'; chiTiet: string };

const giai64 = (s: string): string => {
  try { return Buffer.from(s.trim(), 'base64').toString('utf8'); } catch { return s; }
};

/** Hiểu đầu ra kiểu `tuKhoa`. Thuần. */
export function hieuTuKhoa(ra: string, ma: number | null, dich: string, laMac = false): KetQuaMotCach {
  const t = ra.trim();
  if (t === 'OK') return existsSync(dich) && statSync(dich).size > 0 ? { loai: 'anh', duong: dich } : { loai: 'loi', chiTiet: 'OK but the file is missing' };
  if (t === 'EMPTY') return { loai: 'trong' };
  if (t.startsWith('FILE:')) {
    const p = laMac ? t.slice(5) : giai64(t.slice(5));
    return new RegExp(DUOI_ANH_PS, 'i').test(p) && existsSync(p) && laAnhThat(p) ? { loai: 'anh', duong: p } : { loai: 'trong' };
  }
  if (t.startsWith('ERR:')) return { loai: 'loi', chiTiet: giai64(t.slice(4)).slice(0, 200) };
  return { loai: 'loi', chiTiet: `exit ${ma ?? '?'}${t ? `: ${t.slice(0, 120)}` : ''}` };
}

/** Thử MỘT cách. Xuất ra để kiểm trên runner Windows (`thu/kiemWindows.ts`). */
export function thuMotCach(c: CachDoc, dich: string, henMs = 15_000): Promise<KetQuaMotCach> {
  return new Promise((xong) => {
    try {
      const p = spawn(c.file, c.args, { env: { ...process.env, CM_DICH: dich }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
      const phan: Buffer[] = [];
      let loi = '';
      p.stdout?.on('data', (b: Buffer) => phan.push(b));
      p.stderr?.on('data', (b: Buffer) => { loi = (loi + b.toString('utf8')).slice(-400); });
      p.once('error', (e) => xong({ loai: 'loi', chiTiet: `${c.file}: ${e.message}` }));
      // PowerShell 5.1 nguội + nạp WinForms có khi 3–6 giây trên máy có Defender quét — 8 giây cũ là sát nút.
      const hen = setTimeout(() => { p.kill(); xong({ loai: 'loi', chiTiet: `${c.file}: timed out after ${henMs / 1000}s` }); }, henMs);
      p.once('close', (ma) => {
        clearTimeout(hen);
        const b = Buffer.concat(phan);
        if (c.ra === 'tuKhoa') {
          const k = hieuTuKhoa(b.toString('utf8'), ma, dich, c.file === 'osascript');
          xong(k.loai === 'loi' && loi.trim() ? { loai: 'loi', chiTiet: `${k.chiTiet} · ${loi.trim().split('\n').pop()}` } : k);
          return;
        }
        // Chỉ nhận PNG thật (8 byte chữ ký) — xclip/wl-paste có thể trả chữ, hoặc mã ≠ 0 khi không có kiểu image/png.
        if (ma !== 0 || b.length < 8 || b.readUInt32BE(0) !== 0x89504e47) { xong(ma === 0 || /no suitable|nothing is copied|target image\/png not available/i.test(loi) ? { loai: 'trong' } : { loai: 'loi', chiTiet: loi.trim() || `exit ${ma}` }); return; }
        writeFileSync(dich, b);
        xong({ loai: 'anh', duong: dich });
      });
    } catch (e) {
      xong({ loai: 'loi', chiTiet: (e as Error).message });
    }
  });
}

/** Ảnh trong clipboard ⇒ đường file ảnh, hoặc lời báo rõ (không có ảnh ≠ không đọc được). */
export async function danAnhTuClipboard(nenTang: string = process.platform): Promise<{ duong: string } | { loi: string }> {
  const thuMuc = path.join(thuMucGoc(), 'tam');
  mkdirSync(thuMuc, { recursive: true, mode: 0o700 });
  const dich = path.join(thuMuc, `anh-dan-${Date.now()}.png`);
  const loi: string[] = [];
  let trong = false;
  for (const c of cachDocAnh(nenTang, dich)) {
    const k = await thuMotCach(c, dich);
    if (k.loai === 'anh') return { duong: k.duong };
    if (k.loai === 'trong') { trong = true; break; }
    loi.push(k.chiTiet);
  }
  const nen = nenTang in GOI_Y_KHONG_DAN_DUOC ? nenTang : 'linux';
  if (trong) return { loi: GOI_Y_KHONG_DAN_DUOC[nen]!() };
  return { loi: nen === 'linux' ? THIEU_CONG_CU.linux!() : `${THIEU_CONG_CU[nen]!()}${loi[0] ? ` — ${loi[0]}` : ''}. ${L('Kéo file ảnh vào terminal để gửi kèm.', 'Drag the image file into the terminal instead.')}` };
}
