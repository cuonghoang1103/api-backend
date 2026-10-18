/**
 * BÀN PHÍM: Shift+Enter xuống dòng KHÔNG cần cấu hình (đợt 3, 18/10/2026).
 *
 * Terminal cổ điển gửi Shift+Enter y hệt Enter (`\r`) ⇒ CLI không phân biệt
 * được (người dùng báo: iTerm2 bấm Shift+Enter là GỬI luôn). Claude Code làm
 * được nhờ KITTY KEYBOARD PROTOCOL: bật "progressive enhancement" bằng
 * `CSI > 1 u` (cờ 1 = disambiguate escape codes) thì terminal hỗ trợ (kitty,
 * WezTerm, ghostty, foot, iTerm2 ≥ 3.5, Alacritty ≥ 0.13…) gửi Shift+Enter
 * thành `CSI 13;2 u`. Terminal không hỗ trợ BỎ QUA chuỗi đó (CSI có tham số
 * riêng `>` không in ra gì), nên bật là an toàn — người dùng vẫn còn `\`+Enter,
 * ctrl+j, Alt/Option+Enter.
 *
 * Ink 6.8 tự đọc CSI u (`parse-keypress.js`: Shift+Enter ⇒ `key.return` +
 * `key.shift`; Ctrl+J ⇒ `input 'j'` + `key.ctrl`, KHÔNG còn là `\n` như kiểu
 * cũ — vì thế `laXuongDong` hiểu cả hai) và tự gửi `CSI < u` (tắt) khi
 * unmount. Ở đây thêm: chỉ bật ở TTY thật (không CI, không `-p`, không ống),
 * và tắt cả khi tiến trình chết đột ngột (`exit`) — không thì terminal của
 * người dùng kẹt ở chế độ CSI u sau khi CuongMini crash: shell nhận `[13;2u`
 * thay cho Shift+Enter.
 */

export const BAT_KITTY = '\x1b[>1u';
export const TAT_KITTY = '\x1b[<u';

/** Có nên bật kitty keyboard protocol không. Thuần (test được). */
export function nenBatKitty(o: { tty: boolean; cheDoIn?: boolean; env?: NodeJS.ProcessEnv }): boolean {
  const env = o.env ?? process.env;
  if (!o.tty || o.cheDoIn) return false;
  if (env.CUONGMINI_KITTY === '0') return false;
  if (env.CI || env.GITHUB_ACTIONS || env.TF_BUILD || env.BUILD_NUMBER) return false;
  if ((env.TERM ?? '') === 'dumb') return false;
  return true;
}

let daBat = false;
let daGanThoat = false;

/** Ghi nhận đã bật (Ink gửi `BAT_KITTY`) + móc tắt khi tiến trình thoát/crash. */
export function ganTatKhiThoat(ra: NodeJS.WriteStream = process.stdout): void {
  daBat = true;
  if (daGanThoat) return;
  daGanThoat = true;
  // `exit` chạy cả khi `process.exit()` lẫn khi ném lỗi không bắt (sau in lỗi) — ghi ĐỒNG BỘ.
  process.on('exit', () => tatNgay(ra));
}

/** Tắt ngay (idempotent: `CSI < u` khi ngăn xếp rỗng là vô hại). */
export function tatNgay(ra: NodeJS.WriteStream = process.stdout): void {
  if (!daBat) return;
  daBat = false;
  try { if (ra.writable) ra.write(TAT_KITTY); } catch { /* stdout đã đóng */ }
}

/** Phím vừa bấm có phải "xuống dòng" (không gửi) không. */
export function laXuongDong(input: string, key: { return?: boolean; shift?: boolean; meta?: boolean; ctrl?: boolean }): boolean {
  if (key.return) return Boolean(key.shift || key.meta);
  // ctrl+j: kiểu cũ là LF trần (`\n`); CSI u là `j` + ctrl.
  if (input === '\n') return true;
  return Boolean(key.ctrl && input === 'j');
}

export type TerminalPhim = 'kitty' | 'iterm' | 'itermCu' | 'vscode' | 'appleTerminal' | 'windowsTerminal' | 'khac';

/** Đoán terminal đang dùng (TERM_PROGRAM…) để nói ĐÚNG phím xuống dòng. */
export function doTerminalPhim(env: NodeJS.ProcessEnv = process.env): TerminalPhim {
  const tp = env.TERM_PROGRAM ?? '';
  if (env.KITTY_WINDOW_ID || env.TERM === 'xterm-kitty' || tp === 'WezTerm' || tp === 'ghostty' || env.TERM === 'foot') return 'kitty';
  if (tp === 'iTerm.app') {
    const [maj, min] = String(env.TERM_PROGRAM_VERSION ?? '').split('.').map((x) => Number(x));
    // iTerm2 ≥ 3.5 hiểu kitty keyboard protocol. Không đọc được số ⇒ coi như mới.
    return maj === undefined || Number.isNaN(maj) || maj > 3 || (maj === 3 && (min ?? 0) >= 5) ? 'iterm' : 'itermCu';
  }
  if (tp === 'vscode') return 'vscode';
  if (tp === 'Apple_Terminal') return 'appleTerminal';
  if (env.WT_SESSION) return 'windowsTerminal';
  return 'khac';
}

/** Chuỗi ngắn cho gợi ý dưới ô nhập (đã dịch). */
export function goiYXuongDong(t: TerminalPhim, L: (vi: string, en: string) => string): string {
  switch (t) {
    case 'kitty': case 'iterm': return L('⇧⏎ xuống dòng', '⇧⏎ newline');
    case 'itermCu': return L('⌥⏎ / ctrl+j xuống dòng (/terminal-setup cho ⇧⏎)', '⌥⏎ / ctrl+j newline (/terminal-setup for ⇧⏎)');
    case 'vscode': return L('⌥⏎ / ctrl+j xuống dòng (/terminal-setup cho ⇧⏎)', '⌥⏎ / ctrl+j newline (/terminal-setup for ⇧⏎)');
    case 'appleTerminal': return L('ctrl+j hoặc \\⏎ xuống dòng (⌥⏎ khi bật Option = Meta)', 'ctrl+j or \\⏎ newline (⌥⏎ with Option as Meta)');
    case 'windowsTerminal': return L('ctrl+j hoặc \\⏎ xuống dòng', 'ctrl+j or \\⏎ newline');
    default: return L('ctrl+j / \\⏎ xuống dòng', 'ctrl+j / \\⏎ newline');
  }
}
