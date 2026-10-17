/**
 * KÝ TỰ THAY THẾ cho console không vẽ được Unicode (conhost Windows đời cũ,
 * console `TERM=linux`): khung ╭─╮ ⇒ +-+, ● ⇒ *, ⎿ ⇒ L, ☑ ⇒ [x]…
 *
 * Chữ tiếng Việt KHÔNG đổi — Node ghi ra console Windows bằng WriteConsoleW
 * nên chữ có dấu vẫn hiện; thứ vỡ là KÝ HIỆU nằm ngoài font console mặc định
 * (box-drawing tròn, emoji, ký hiệu kỹ thuật) — chúng ra ô vuông hoặc dấu ?.
 */

/** Có nên dùng ký tự ASCII không (cùng luật `is-unicode-supported` của sindresorhus, cộng cờ tay). */
export function canAscii(env: NodeJS.ProcessEnv, nenTang: string = process.platform): boolean {
  if (env.CUONGMINI_ASCII === '1') return true;
  if (env.CUONGMINI_ASCII === '0') return false;
  if (nenTang !== 'win32') return env.TERM === 'linux';
  return !(env.WT_SESSION || env.TERMINUS_SUBLIME || env.ConEmuTask === '{cmd::Cmder}'
    || env.TERM_PROGRAM === 'vscode' || env.TERM === 'xterm-256color' || env.TERM === 'alacritty'
    || env.TERMINAL_EMULATOR === 'JetBrains-JediTerm' || env.TERM_PROGRAM === 'Terminus-Sublime');
}

let ascii = canAscii(process.env);
export const laAscii = (): boolean => ascii;
export function datAscii(b: boolean): void { ascii = b; }

// MỘT ký tự đổi MỘT ký tự (cùng bề ngang) — chuỗi đã được căn cột (khung màn mở đầu,
// bảng, ô nhập) trước khi đổi, đổi sang chuỗi dài hơn là lệch viền.
const BANG: Record<string, string> = {
  '╭': '+', '╮': '+', '╰': '+', '╯': '+', '┌': '+', '┐': '+', '└': '+', '┘': '+', '├': '+', '┤': '+', '┬': '+', '┴': '+', '┼': '+',
  '─': '-', '│': '|', '═': '=', '║': '|', '╔': '+', '╗': '+', '╚': '+', '╝': '+', '╦': '+', '╩': '+', '█': '#', '░': '.',
  '●': '*', '○': 'o', '◐': '~', '☑': 'x', '☐': '-', '⎿': 'L', '❯': '>', '›': '>', '▸': '>', '▲': '^', '▎': '|',
  '✓': 'v', '✔': 'v', '✕': 'x', '✗': 'x', '✖': 'x', '⚠': '!', 'ℹ': 'i', '⏸': '=', '✋': '?', '✎': '~', '⚡': '!', '⏳': '~',
  '✻': '*', '✶': '*', '✳': '*', '✢': '+', '✽': '*', '·': '.', '•': '*', '◦': '-', '▪': '-', '…': '~', '⎇': 'Y',
  '⌕': '/', '↑': '^', '↓': 'v', '→': '>', '←': '<', '↺': '<', '−': '-', '⬆': '^', '📋': '#', '🖼': '#', '📌': '*', 'ƒ': 'f',
};

/** Đổi ký hiệu Unicode ⇒ ASCII khi console không vẽ được (giữ nguyên mã màu và chữ có dấu). */
export function doiKyTu(s: string, bat: boolean = ascii): string {
  if (!bat) return s;
  let ra = '';
  for (const c of s) ra += BANG[c] ?? c;
  return ra;
}

/** Kiểu viền cho `<Box borderStyle>` của Ink. */
export const kieuVien = (): 'round' | 'classic' => (ascii ? 'classic' : 'round');
