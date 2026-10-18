/**
 * ============================================================
 * ĐIỀU KHIỂN MÁY TÍNH (đợt 4, 18/10/2026) — chụp màn hình, chuột, bàn phím
 * ============================================================
 *
 * Dùng CHUNG cho app desktop, CuongMini CLI và extension VS Code (lõi bundle
 * thẳng file này). Không cần helper ký riêng: mọi thứ đi qua công cụ CÓ SẴN
 * của hệ điều hành —
 *
 *   • macOS: `screencapture -x -m` (chụp) + `sips` (thu nhỏ) + JXA
 *     (`osascript -l JavaScript`, `ObjC.import('CoreGraphics')` ⇒
 *     `CGEventCreateMouseEvent`/`CGEventCreateKeyboardEvent`/`CGEventPost`).
 *     Quyền Screen Recording + Accessibility được hệ điều hành tính cho APP CHA
 *     (Terminal/iTerm/VS Code/Electron) — nên CLI và VS Code dùng được y như app.
 *   • Windows: PowerShell `Add-Type` (user32 `SetCursorPos`/`mouse_event`/
 *     `keybd_event`, `System.Windows.Forms.Screen`, `CopyFromScreen`).
 *   • Linux (X11): `xdotool` + `import` (ImageMagick) / `scrot` / `gnome-screenshot`.
 *     Wayland hoặc thiếu công cụ ⇒ báo rõ cài gì, không im lặng.
 *
 * ─── TOẠ ĐỘ ───
 * Model nhìn ẢNH ĐÃ THU (≤1280px ngang) nên nó nói toạ độ theo ảnh. Ở đây quy
 * đổi về điểm màn hình thật: macOS dùng ĐIỂM (point — Retina 2× vẫn là 1440×900
 * điểm), Windows dùng PIXEL vật lý (tiến trình PowerShell tự `SetProcessDPIAware`).
 * Hình học của lần chụp CUỐI được nhớ ở đây; chưa chụp lần nào thì từ chối bấm
 * (bấm mù theo toạ độ đoán là cách nhanh nhất để đóng nhầm một cửa sổ).
 *
 * ─── AN TOÀN ───
 * File này CHỈ thực thi. Duyệt nằm ở `loop.ts` (mọi `may_bam/go/phim/cuon` đều
 * hỏi, kể cả "Bỏ qua hết" — `hoiNguoiDung({ luonHoi: true })`). Toàn bộ lời gọi
 * hệ điều hành đi qua `chay` — test thay bằng bản giả, KHÔNG bao giờ bấm thật.
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export interface KetQuaChay { ma: number | null; ra: string; loi: string }
export type HamChay = (lenh: string, args: string[], tuyChon?: { timeout?: number }) => Promise<KetQuaChay>;

const chayThat: HamChay = (lenh, args, tuyChon = {}) => new Promise((ok) => {
  execFile(lenh, args, { timeout: tuyChon.timeout ?? 20_000, windowsHide: true, maxBuffer: 8 * 1024 * 1024 }, (err, stdout, stderr) => {
    const ma = err ? (typeof (err as { code?: unknown }).code === 'number' ? (err as { code: number }).code : null) : 0;
    ok({ ma, ra: String(stdout ?? ''), loi: String(stderr ?? '') || (err && ma === null ? (err as Error).message : '') });
  });
});

let chay: HamChay = chayThat;
let nenTang: NodeJS.Platform = process.platform;
/** Chỉ cho test: thay tầng gọi hệ điều hành (không bao giờ bấm/gõ thật trong test). */
export function _datChay(f: HamChay | null, nt?: NodeJS.Platform): void {
  chay = f ?? chayThat;
  nenTang = nt ?? process.platform;
  hinhHoc = null;
}

/** Ảnh gửi cho model rộng tối đa chừng này (px). */
export const RONG_TOI_DA = 1280;

interface HinhHoc {
  /** Kích thước ẢNH đã gửi cho model. */
  anhRong: number; anhCao: number;
  /** Kích thước màn hình theo đơn vị toạ độ sự kiện (macOS: điểm; Windows/Linux: pixel). */
  mhRong: number; mhCao: number;
  luc: number;
}
let hinhHoc: HinhHoc | null = null;
export function hinhHocCuoi(): HinhHoc | null { return hinhHoc; }

/** Tên app cha mà người dùng phải cấp quyền (macOS). */
export function appCha(): string {
  const tp = process.env.TERM_PROGRAM ?? '';
  if (process.versions.electron && !process.env.VSCODE_PID) return 'CuongThai';
  if (process.env.VSCODE_PID || tp === 'vscode') return 'Visual Studio Code (hoặc Cursor/Windsurf bạn đang dùng)';
  if (tp === 'iTerm.app') return 'iTerm';
  if (tp === 'Apple_Terminal') return 'Terminal';
  if (tp === 'WarpTerminal') return 'Warp';
  if (tp) return tp;
  return 'ứng dụng terminal bạn đang dùng';
}

export function loiThieuQuyen(loai: 'chup' | 'dieuKhien'): string {
  const app = appCha();
  return loai === 'chup'
    ? `THIẾU QUYỀN GHI MÀN HÌNH (Screen Recording). Bảo người dùng: mở System Settings → Privacy & Security → Screen & System Audio Recording (Ghi màn hình), bật cho "${app}", rồi THOÁT HẲN và mở lại "${app}". `
      + 'Mở nhanh: `open "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"`. Đừng thử lại trước khi họ báo đã bật.'
    : `THIẾU QUYỀN TRỢ NĂNG (Accessibility) để điều khiển chuột/bàn phím. Bảo người dùng: mở System Settings → Privacy & Security → Accessibility (Trợ năng), bật cho "${app}" (bấm + nếu chưa có), rồi mở lại "${app}". `
      + 'Mở nhanh: `open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"`. Đừng thử lại trước khi họ báo đã bật.';
}

function tmp(duoi: string): string {
  return path.join(os.tmpdir(), `cuongmini-may-${process.pid}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.${duoi}`);
}

async function jxa(maNguon: string, args: string[] = []): Promise<KetQuaChay> {
  return chay('osascript', ['-l', 'JavaScript', '-e', maNguon, ...args.map(String)], { timeout: 15_000 });
}

async function ps(maNguon: string): Promise<KetQuaChay> {
  return chay('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', maNguon], { timeout: 30_000 });
}

/** Lệnh có trên máy không (Linux). */
async function co(lenh: string): Promise<boolean> {
  const r = await chay('sh', ['-c', `command -v ${lenh}`]).catch(() => ({ ma: 1, ra: '', loi: '' }));
  return r.ma === 0 && r.ra.trim() !== '';
}

// ─── macOS ──────────────────────────────────────────────────────

const JXA_KIEM_QUYEN = `ObjC.import('CoreGraphics'); ObjC.import('ApplicationServices');
function run(argv){ var c = true, a = true;
 try { c = $.CGPreflightScreenCaptureAccess(); } catch (e) {}
 try { a = $.AXIsProcessTrusted(); } catch (e) {}
 return JSON.stringify({ chup: !!c, dieuKhien: !!a }); }`;

const JXA_MAN_HINH = `ObjC.import('AppKit');
function run(argv){ var f = $.NSScreen.mainScreen.frame; return JSON.stringify({ w: f.size.width, h: f.size.height }); }`;

/** Chuột: argv = x y nut(0 trái|1 phải|2 giữa) soLan. Hằng số CGEvent ghi bằng SỐ (JXA không bridge enum chắc chắn). */
export const JXA_CHUOT = `ObjC.import('CoreGraphics');
function run(argv){ var x = +argv[0], y = +argv[1], nut = +argv[2], lan = +argv[3] || 1;
 var p = $.CGPointMake(x, y);
 var xuong = nut === 1 ? 3 : nut === 2 ? 25 : 1, len = nut === 1 ? 4 : nut === 2 ? 26 : 2;
 var mv = $.CGEventCreateMouseEvent(null, 5, p, 0); $.CGEventPost(0, mv); delay(0.05);
 for (var i = 1; i <= lan; i++) {
  var d = $.CGEventCreateMouseEvent(null, xuong, p, nut); $.CGEventSetIntegerValueField(d, 1, i); $.CGEventPost(0, d);
  var u = $.CGEventCreateMouseEvent(null, len, p, nut); $.CGEventSetIntegerValueField(u, 1, i); $.CGEventPost(0, u);
  delay(0.04);
 } return 'ok'; }`;

/** Cuộn: argv = x y dy dx (đơn vị dòng; dương = lên/trái theo quy ước CGEvent). */
export const JXA_CUON = `ObjC.import('CoreGraphics');
function run(argv){ var p = $.CGPointMake(+argv[0], +argv[1]);
 var mv = $.CGEventCreateMouseEvent(null, 5, p, 0); $.CGEventPost(0, mv); delay(0.05);
 var e = $.CGEventCreateScrollWheelEvent2(null, 1, 2, +argv[2], +argv[3], 0); $.CGEventPost(0, e); return 'ok'; }`;

/** Phím: argv = keycode flags. */
export const JXA_PHIM = `ObjC.import('CoreGraphics');
function run(argv){ var k = +argv[0], f = +argv[1];
 var d = $.CGEventCreateKeyboardEvent(null, k, true); $.CGEventSetFlags(d, f); $.CGEventPost(0, d);
 var u = $.CGEventCreateKeyboardEvent(null, k, false); $.CGEventSetFlags(u, f); $.CGEventPost(0, u); return 'ok'; }`;

/** Gõ chữ = dán qua bảng nhớ tạm (gõ phím từng ký tự hỏng với tiếng Việt/bộ gõ). Bảng nhớ cũ được trả lại. */
export const JXA_GO = `ObjC.import('AppKit'); ObjC.import('CoreGraphics');
function run(argv){ var pb = $.NSPasteboard.generalPasteboard; var cu = pb.stringForType($.NSPasteboardTypeString);
 pb.clearContents; pb.setStringForType($(argv[0]), $.NSPasteboardTypeString);
 var d = $.CGEventCreateKeyboardEvent(null, 9, true); $.CGEventSetFlags(d, 1048576); $.CGEventPost(0, d);
 var u = $.CGEventCreateKeyboardEvent(null, 9, false); $.CGEventSetFlags(u, 1048576); $.CGEventPost(0, u);
 delay(0.35); pb.clearContents; if (cu && cu.js !== undefined) pb.setStringForType(cu, $.NSPasteboardTypeString); return 'ok'; }`;

/** Mã phím ảo macOS (bàn phím ANSI). */
export const PHIM_MAC: Record<string, number> = {
  a: 0, s: 1, d: 2, f: 3, h: 4, g: 5, z: 6, x: 7, c: 8, v: 9, b: 11, q: 12, w: 13, e: 14, r: 15, y: 16, t: 17,
  '1': 18, '2': 19, '3': 20, '4': 21, '6': 22, '5': 23, '=': 24, '9': 25, '7': 26, '-': 27, '8': 28, '0': 29,
  ']': 30, o: 31, u: 32, '[': 33, i: 34, p: 35, l: 37, j: 38, "'": 39, k: 40, ';': 41, '\\': 42, ',': 43, '/': 44,
  n: 45, m: 46, '.': 47, '`': 50,
  enter: 36, return: 36, tab: 48, space: 49, backspace: 51, delete: 51, esc: 53, escape: 53,
  left: 123, right: 124, down: 125, up: 126, home: 115, end: 119, pageup: 116, pagedown: 121, forwarddelete: 117, del: 117,
  f1: 122, f2: 120, f3: 99, f4: 118, f5: 96, f6: 97, f7: 98, f8: 100, f9: 101, f10: 109, f11: 103, f12: 111,
};
const CO_MAC: Record<string, number> = { cmd: 1 << 20, command: 1 << 20, meta: 1 << 20, super: 1 << 20, win: 1 << 20, shift: 1 << 17, ctrl: 1 << 18, control: 1 << 18, alt: 1 << 19, option: 1 << 19, opt: 1 << 19 };

// ─── đọc tổ hợp phím ────────────────────────────────────────────

export interface ToHop { phim: string; bo: string[] }

const BIET_DANH: Record<string, string> = {
  '⌘': 'cmd', '⇧': 'shift', '⌃': 'ctrl', '⌥': 'alt', '↵': 'enter', '⏎': 'enter', '←': 'left', '→': 'right', '↑': 'up', '↓': 'down',
  arrowleft: 'left', arrowright: 'right', arrowup: 'up', arrowdown: 'down', pgup: 'pageup', pgdn: 'pagedown', ' ': 'space',
};

/** `"cmd+shift+t"` ⇒ `{ phim: 't', bo: ['cmd','shift'] }`. Sai dạng ⇒ chuỗi lỗi. */
export function docToHop(chuoi: string): ToHop | string {
  const s = String(chuoi ?? '').trim();
  if (!s) return 'thiếu "to_hop" (vd "cmd+c", "enter", "ctrl+shift+t").';
  if (s.length > 40) return '"to_hop" quá dài.';
  const phan = s.split(/\s*\+\s*/).map((x) => x.trim().toLowerCase()).map((x) => BIET_DANH[x] ?? x).filter(Boolean);
  if (!phan.length) return 'tổ hợp rỗng.';
  const phim = phan[phan.length - 1]!;
  const bo = phan.slice(0, -1);
  for (const b of bo) if (!(b in CO_MAC)) return `phím bổ trợ "${b}" không có (dùng cmd/ctrl/alt/shift).`;
  if (!(phim in PHIM_MAC)) return `phím "${phim}" không có. Dùng chữ/số, enter, tab, esc, space, backspace, delete, up/down/left/right, home/end, pageup/pagedown, f1–f12.`;
  return { phim, bo };
}

// ─── Windows ────────────────────────────────────────────────────

const PS_DAU = `$ErrorActionPreference='Stop';
Add-Type -AssemblyName System.Windows.Forms,System.Drawing;
Add-Type -Namespace CM -Name U -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetProcessDPIAware(); [DllImport("user32.dll")] public static extern bool SetCursorPos(int x,int y); [DllImport("user32.dll")] public static extern void mouse_event(uint f,int x,int y,int d,int e); [DllImport("user32.dll")] public static extern void keybd_event(byte v,byte s,uint f,int e);';
[void][CM.U]::SetProcessDPIAware();`;

/** Mã phím ảo Windows (VK_*). */
const VK: Record<string, number> = {
  enter: 0x0d, return: 0x0d, tab: 0x09, space: 0x20, backspace: 0x08, delete: 0x2e, forwarddelete: 0x2e, del: 0x2e, esc: 0x1b, escape: 0x1b,
  left: 0x25, up: 0x26, right: 0x27, down: 0x28, home: 0x24, end: 0x23, pageup: 0x21, pagedown: 0x22,
  ...Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`f${i + 1}`, 0x70 + i])),
  ...Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map((ch) => [ch, ch.toUpperCase().charCodeAt(0)])),
  ...Object.fromEntries('0123456789'.split('').map((ch) => [ch, ch.charCodeAt(0)])),
  ';': 0xba, '=': 0xbb, ',': 0xbc, '-': 0xbd, '.': 0xbe, '/': 0xbf, '`': 0xc0, '[': 0xdb, '\\': 0xdc, ']': 0xdd, "'": 0xde,
};
const VK_BO: Record<string, number> = { ctrl: 0x11, control: 0x11, cmd: 0x11, command: 0x11, meta: 0x5b, super: 0x5b, win: 0x5b, shift: 0x10, alt: 0x12, option: 0x12, opt: 0x12 };

/** Chuỗi PowerShell một dấu nháy đơn — `'` nhân đôi. */
function psChuoi(s: string): string { return `'${s.replace(/'/g, "''")}'`; }

// ─── Linux ──────────────────────────────────────────────────────

const XDO_PHIM: Record<string, string> = {
  enter: 'Return', return: 'Return', tab: 'Tab', space: 'space', backspace: 'BackSpace', delete: 'Delete', forwarddelete: 'Delete', del: 'Delete',
  esc: 'Escape', escape: 'Escape', left: 'Left', right: 'Right', up: 'Up', down: 'Down', home: 'Home', end: 'End', pageup: 'Prior', pagedown: 'Next',
  ';': 'semicolon', '=': 'equal', ',': 'comma', '-': 'minus', '.': 'period', '/': 'slash', '`': 'grave', '[': 'bracketleft', '\\': 'backslash', ']': 'bracketright', "'": 'apostrophe',
};
const XDO_BO: Record<string, string> = { ctrl: 'ctrl', control: 'ctrl', cmd: 'ctrl', command: 'ctrl', meta: 'super', super: 'super', win: 'super', shift: 'shift', alt: 'alt', option: 'alt', opt: 'alt' };

async function linuxKhongDung(): Promise<string | null> {
  if ((process.env.XDG_SESSION_TYPE ?? '').toLowerCase() === 'wayland' && !process.env.DISPLAY) {
    return 'phiên Wayland không cho điều khiển chuột/bàn phím từ ngoài. Đăng nhập phiên "Xorg/X11" (màn hình đăng nhập → bánh răng) hoặc dùng ydotool.';
  }
  if (!(await co('xdotool'))) return 'chưa cài xdotool — chạy `sudo apt install xdotool` (Debian/Ubuntu) hoặc `sudo dnf install xdotool` (Fedora).';
  return null;
}

// ─── API ────────────────────────────────────────────────────────

export interface AnhChup { media_type: string; data: string }
export type KetQuaMay =
  | { ok: true; moTa: string; anh?: AnhChup; rong?: number; cao?: number }
  | { ok: false; loi: string };

/** Hỗ trợ trên nền tảng này không (không chạy gì cả). */
export function hoTro(nt: NodeJS.Platform = nenTang): boolean {
  return nt === 'darwin' || nt === 'win32' || nt === 'linux';
}

/** Kiểm quyền macOS (rẻ, không chụp). Nền tảng khác ⇒ luôn true. */
export async function kiemQuyen(): Promise<{ chup: boolean; dieuKhien: boolean }> {
  if (nenTang !== 'darwin') return { chup: true, dieuKhien: true };
  const r = await jxa(JXA_KIEM_QUYEN);
  try { const j = JSON.parse(r.ra.trim()) as { chup: boolean; dieuKhien: boolean }; return { chup: j.chup !== false, dieuKhien: j.dieuKhien !== false }; } catch { return { chup: true, dieuKhien: true }; }
}

/** Đọc kích thước ảnh PNG/JPEG từ đầu file (không cần thư viện). */
export function kichThuocAnh(b: Buffer): { rong: number; cao: number } | null {
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { rong: b.readUInt32BE(16), cao: b.readUInt32BE(20) };
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1]!;
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { cao: b.readUInt16BE(i + 5), rong: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

/** Chụp màn hình CHÍNH, thu về ≤ `RONG_TOI_DA` px ngang, JPEG. */
export async function chupManHinh(): Promise<KetQuaMay> {
  if (!hoTro()) return { ok: false, loi: `nền tảng ${nenTang} chưa hỗ trợ điều khiển máy tính.` };
  const file = tmp('jpg');
  try {
    let mhRong = 0; let mhCao = 0;
    if (nenTang === 'darwin') {
      const q = await kiemQuyen();
      if (!q.chup) return { ok: false, loi: loiThieuQuyen('chup') };
      const r = await chay('screencapture', ['-x', '-m', '-t', 'jpg', file]);
      if (r.ma !== 0) return { ok: false, loi: /not permitted|could not create image/i.test(r.loi) ? loiThieuQuyen('chup') : `screencapture hỏng: ${r.loi.trim().slice(0, 200) || `mã ${r.ma}`}` };
      const g = await jxa(JXA_MAN_HINH);
      try { const j = JSON.parse(g.ra.trim()) as { w: number; h: number }; mhRong = j.w; mhCao = j.h; } catch { /* lấy theo ảnh */ }
      const kt = kichThuocAnh(await fs.readFile(file));
      if (kt && kt.rong > RONG_TOI_DA) {
        await chay('sips', ['--resampleWidth', String(RONG_TOI_DA), '-s', 'format', 'jpeg', '-s', 'formatOptions', '70', file, '--out', file]);
      }
    } else if (nenTang === 'win32') {
      const r = await ps(`${PS_DAU}
$b=[System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bm=New-Object System.Drawing.Bitmap $b.Width,$b.Height;
$g=[System.Drawing.Graphics]::FromImage($bm); $g.CopyFromScreen($b.Location,[System.Drawing.Point]::Empty,$b.Size);
$w=[Math]::Min(${RONG_TOI_DA},$b.Width); $h=[int]($b.Height*$w/$b.Width); $o=New-Object System.Drawing.Bitmap $bm,$w,$h;
$o.Save(${psChuoi(file)},[System.Drawing.Imaging.ImageFormat]::Jpeg); Write-Output ("{0} {1}" -f $b.Width,$b.Height)`);
      if (r.ma !== 0) return { ok: false, loi: `PowerShell không chụp được màn hình: ${r.loi.trim().slice(0, 240) || `mã ${r.ma}`}` };
      const m = /(\d+)\s+(\d+)/.exec(r.ra);
      if (m) { mhRong = Number(m[1]); mhCao = Number(m[2]); }
    } else {
      const khong = (process.env.XDG_SESSION_TYPE ?? '').toLowerCase() === 'wayland' && !process.env.DISPLAY;
      if (khong) return { ok: false, loi: 'phiên Wayland: chưa hỗ trợ chụp màn hình từ ngoài — đăng nhập phiên Xorg/X11.' };
      let ok = false;
      if (await co('import')) ok = (await chay('import', ['-window', 'root', '-resize', `${RONG_TOI_DA}x>`, '-quality', '70', file])).ma === 0;
      else if (await co('scrot')) ok = (await chay('scrot', ['-o', file])).ma === 0;
      else if (await co('gnome-screenshot')) ok = (await chay('gnome-screenshot', ['-f', file])).ma === 0;
      else return { ok: false, loi: 'không có công cụ chụp màn hình — cài ImageMagick (`sudo apt install imagemagick`) hoặc scrot.' };
      if (!ok) return { ok: false, loi: 'lệnh chụp màn hình thất bại (cần phiên X11 có DISPLAY).' };
      const g = await chay('xdotool', ['getdisplaygeometry']).catch(() => ({ ma: 1, ra: '', loi: '' }));
      const m = /(\d+)\s+(\d+)/.exec(g.ra);
      if (m) { mhRong = Number(m[1]); mhCao = Number(m[2]); }
    }
    const buf = await fs.readFile(file);
    const kt = kichThuocAnh(buf);
    if (!kt) return { ok: false, loi: 'ảnh chụp không đọc được.' };
    if (!mhRong || !mhCao) { mhRong = kt.rong; mhCao = kt.cao; }
    hinhHoc = { anhRong: kt.rong, anhCao: kt.cao, mhRong, mhCao, luc: Date.now() };
    const media = buf[0] === 0x89 ? 'image/png' : 'image/jpeg';
    return {
      ok: true, rong: kt.rong, cao: kt.cao, anh: { media_type: media, data: buf.toString('base64') },
      moTa: `Ảnh màn hình chính ${kt.rong}×${kt.cao}px (màn hình thật ${Math.round(mhRong)}×${Math.round(mhCao)}). `
        + 'Toạ độ cho may_bam/may_cuon tính theo ẢNH NÀY (gốc trên-trái).',
    };
  } catch (e) {
    return { ok: false, loi: `không chụp được màn hình: ${(e as Error).message}` };
  } finally {
    await fs.rm(file, { force: true }).catch(() => {});
  }
}

/** Toạ độ ẢNH ⇒ toạ độ màn hình. Chưa chụp ⇒ chuỗi lỗi. */
export function quyDoi(x: number, y: number): { x: number; y: number } | string {
  if (!hinhHoc) return 'chưa có ảnh màn hình nào — gọi may_chup trước để biết toạ độ.';
  if (!Number.isFinite(x) || !Number.isFinite(y)) return '"x"/"y" phải là số.';
  if (x < 0 || y < 0 || x > hinhHoc.anhRong || y > hinhHoc.anhCao) return `toạ độ (${x}, ${y}) nằm ngoài ảnh ${hinhHoc.anhRong}×${hinhHoc.anhCao}.`;
  const kx = hinhHoc.mhRong / hinhHoc.anhRong;
  const ky = hinhHoc.mhCao / hinhHoc.anhCao;
  return { x: Math.round(x * kx), y: Math.round(y * ky) };
}

async function macCanQuyen(): Promise<string | null> {
  if (nenTang !== 'darwin') return null;
  const q = await kiemQuyen();
  return q.dieuKhien ? null : loiThieuQuyen('dieuKhien');
}

export type NutChuot = 'trai' | 'phai' | 'giua';

export async function bam(x: number, y: number, nut: NutChuot = 'trai', haiLan = false): Promise<KetQuaMay> {
  const p = quyDoi(x, y);
  if (typeof p === 'string') return { ok: false, loi: p };
  const thieu = await macCanQuyen();
  if (thieu) return { ok: false, loi: thieu };
  const lan = haiLan ? 2 : 1;
  let r: KetQuaChay;
  if (nenTang === 'darwin') r = await jxa(JXA_CHUOT, [String(p.x), String(p.y), String(nut === 'phai' ? 1 : nut === 'giua' ? 2 : 0), String(lan)]);
  else if (nenTang === 'win32') {
    const [d, u] = nut === 'phai' ? [0x08, 0x10] : nut === 'giua' ? [0x20, 0x40] : [0x02, 0x04];
    r = await ps(`${PS_DAU} [void][CM.U]::SetCursorPos(${p.x},${p.y}); Start-Sleep -Milliseconds 40; 1..${lan} | % { [CM.U]::mouse_event(${d},0,0,0,0); [CM.U]::mouse_event(${u},0,0,0,0); Start-Sleep -Milliseconds 40 }`);
  } else {
    const loi = await linuxKhongDung();
    if (loi) return { ok: false, loi };
    r = await chay('xdotool', ['mousemove', String(p.x), String(p.y), 'click', '--repeat', String(lan), nut === 'phai' ? '3' : nut === 'giua' ? '2' : '1']);
  }
  if (r.ma !== 0) return { ok: false, loi: `không bấm được: ${r.loi.trim().slice(0, 200) || `mã ${r.ma}`}` };
  return { ok: true, moTa: `Đã ${haiLan ? 'nhấp đúp' : 'bấm'} chuột ${nut === 'phai' ? 'phải' : nut === 'giua' ? 'giữa' : 'trái'} tại (${x}, ${y}) trên ảnh ⇒ (${p.x}, ${p.y}) trên màn hình.` };
}

export async function go(chu: string): Promise<KetQuaMay> {
  const s = String(chu ?? '');
  if (!s) return { ok: false, loi: 'thiếu "chu".' };
  if (s.length > 4000) return { ok: false, loi: '"chu" dài quá 4000 ký tự — chia nhỏ.' };
  const thieu = await macCanQuyen();
  if (thieu) return { ok: false, loi: thieu };
  let r: KetQuaChay;
  if (nenTang === 'darwin') r = await jxa(JXA_GO, [s]);
  else if (nenTang === 'win32') {
    // Dán qua bảng nhớ tạm (SendKeys hỏng với Unicode/bộ gõ), trả bảng nhớ cũ lại.
    r = await ps(`${PS_DAU} $cu=Get-Clipboard -Raw -ErrorAction SilentlyContinue; Set-Clipboard -Value ${psChuoi(s)}; [CM.U]::keybd_event(0x11,0,0,0); [CM.U]::keybd_event(0x56,0,0,0); [CM.U]::keybd_event(0x56,0,2,0); [CM.U]::keybd_event(0x11,0,2,0); Start-Sleep -Milliseconds 350; if ($cu -ne $null) { Set-Clipboard -Value $cu }`);
  } else {
    const loi = await linuxKhongDung();
    if (loi) return { ok: false, loi };
    r = await chay('xdotool', ['type', '--delay', '8', '--', s]);
  }
  if (r.ma !== 0) return { ok: false, loi: `không gõ được: ${r.loi.trim().slice(0, 200) || `mã ${r.ma}`}` };
  return { ok: true, moTa: `Đã gõ ${s.length} ký tự vào ô đang có tiêu điểm.` };
}

export async function phim(toHop: string): Promise<KetQuaMay> {
  const t = docToHop(toHop);
  if (typeof t === 'string') return { ok: false, loi: t };
  const thieu = await macCanQuyen();
  if (thieu) return { ok: false, loi: thieu };
  let r: KetQuaChay;
  if (nenTang === 'darwin') {
    const co = t.bo.reduce((a, b) => a | (CO_MAC[b] ?? 0), 0);
    r = await jxa(JXA_PHIM, [String(PHIM_MAC[t.phim]), String(co)]);
  } else if (nenTang === 'win32') {
    const vk = VK[t.phim];
    if (vk === undefined) return { ok: false, loi: `phím "${t.phim}" chưa hỗ trợ trên Windows.` };
    const bo = [...new Set(t.bo.map((b) => VK_BO[b]!))];
    r = await ps(`${PS_DAU} ${bo.map((b) => `[CM.U]::keybd_event(${b},0,0,0);`).join(' ')} [CM.U]::keybd_event(${vk},0,0,0); [CM.U]::keybd_event(${vk},0,2,0); ${[...bo].reverse().map((b) => `[CM.U]::keybd_event(${b},0,2,0);`).join(' ')}`);
  } else {
    const loi = await linuxKhongDung();
    if (loi) return { ok: false, loi };
    const ten = [...new Set(t.bo.map((b) => XDO_BO[b]!)), XDO_PHIM[t.phim] ?? t.phim].join('+');
    r = await chay('xdotool', ['key', ten]);
  }
  if (r.ma !== 0) return { ok: false, loi: `không bấm phím được: ${r.loi.trim().slice(0, 200) || `mã ${r.ma}`}` };
  return { ok: true, moTa: `Đã bấm ${[...t.bo, t.phim].join('+')}.` };
}

export async function cuon(huong: string, soDong = 5, x?: number, y?: number): Promise<KetQuaMay> {
  const h = String(huong ?? 'xuong').toLowerCase();
  const map: Record<string, [number, number]> = { len: [1, 0], up: [1, 0], xuong: [-1, 0], down: [-1, 0], trai: [0, 1], left: [0, 1], phai: [0, -1], right: [0, -1] };
  const v = map[h];
  if (!v) return { ok: false, loi: '"huong" phải là len | xuong | trai | phai.' };
  const n = Math.max(1, Math.min(50, Math.round(Number(soDong) || 5)));
  const hh = hinhHoc;
  const p = x !== undefined && y !== undefined ? quyDoi(x, y) : hh ? { x: Math.round(hh.mhRong / 2), y: Math.round(hh.mhCao / 2) } : 'chưa có ảnh màn hình nào — gọi may_chup trước.';
  if (typeof p === 'string') return { ok: false, loi: p };
  const thieu = await macCanQuyen();
  if (thieu) return { ok: false, loi: thieu };
  let r: KetQuaChay;
  if (nenTang === 'darwin') r = await jxa(JXA_CUON, [String(p.x), String(p.y), String(v[0] * n), String(v[1] * n)]);
  else if (nenTang === 'win32') {
    const [co, dl] = v[0] !== 0 ? [0x0800, v[0] * n * 120] : [0x01000, -v[1] * n * 120];
    r = await ps(`${PS_DAU} [void][CM.U]::SetCursorPos(${p.x},${p.y}); [CM.U]::mouse_event(${co},0,0,${dl},0)`);
  } else {
    const loi = await linuxKhongDung();
    if (loi) return { ok: false, loi };
    const nut = v[0] > 0 ? '4' : v[0] < 0 ? '5' : v[1] > 0 ? '6' : '7';
    r = await chay('xdotool', ['mousemove', String(p.x), String(p.y), 'click', '--repeat', String(n), nut]);
  }
  if (r.ma !== 0) return { ok: false, loi: `không cuộn được: ${r.loi.trim().slice(0, 200) || `mã ${r.ma}`}` };
  return { ok: true, moTa: `Đã cuộn ${h} ${n} nấc.` };
}

/** Một dòng mô tả cho THẺ DUYỆT — người dùng phải đọc được chính xác việc sắp xảy ra. */
export function moTaDuyet(ten: string, a: Record<string, unknown>): string {
  const s = (k: string): string => (typeof a[k] === 'string' ? (a[k] as string) : a[k] === undefined ? '' : String(a[k]));
  const p = Number.isFinite(Number(a.x)) && Number.isFinite(Number(a.y)) ? quyDoi(Number(a.x), Number(a.y)) : null;
  const viTri = p && typeof p !== 'string' ? ` (${s('x')}, ${s('y')}) trên ảnh ⇒ (${p.x}, ${p.y}) màn hình` : a.x !== undefined ? ` (${s('x')}, ${s('y')})` : '';
  switch (ten) {
    case 'may_bam': return `🖱 ${a.hai_lan === true ? 'Nhấp đúp' : 'Bấm'} chuột ${s('nut') === 'phai' ? 'PHẢI' : s('nut') === 'giua' ? 'GIỮA' : 'trái'} tại${viTri}`;
    case 'may_go': { const c = s('chu'); return `⌨ Gõ vào ô đang chọn: "${c.slice(0, 600)}${c.length > 600 ? '…' : ''}" (${c.length} ký tự)`; }
    case 'may_phim': return `⌨ Bấm tổ hợp phím: ${s('to_hop')}`;
    case 'may_cuon': return `🖱 Cuộn ${s('huong') || 'xuống'} ${s('so') || '5'} nấc${viTri}`;
    default: return ten;
  }
}
