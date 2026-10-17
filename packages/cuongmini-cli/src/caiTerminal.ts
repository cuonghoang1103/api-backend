/**
 * `/terminal-setup` — cho Shift+Enter xuống dòng.
 *
 * Terminal mặc định gửi Shift+Enter giống hệt Enter (`\r`), nên CLI không phân
 * biệt được. Cách chung: dạy terminal gửi `ESC + \r` (= Alt+Enter, CLI đã hiểu
 * là xuống dòng) khi bấm Shift+Enter.
 *  • VS Code / Cursor: TỰ thêm keybinding vào `keybindings.json` (có sao lưu,
 *    chỉ khi chưa có) — đây là file JSON có chú thích, nên CHÈN văn bản chứ
 *    không parse/ghi lại (ghi lại sẽ xoá mất chú thích của người dùng).
 *  • iTerm2, Windows Terminal: in hướng dẫn — file cấu hình của chúng là
 *    plist nhị phân / JSON do app quản lý, sửa ngoài lúc app đang chạy dễ bị ghi đè.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const KEYBINDING_VSCODE = {
  key: 'shift+enter',
  command: 'workbench.action.terminal.sendSequence',
  args: { text: '\u001b\r' },
  when: 'terminalFocus',
};

export function duongKeybindingVsCode(ungDung: 'Code' | 'Cursor', nenTang: string = process.platform, env: NodeJS.ProcessEnv = process.env): string {
  const nha = os.homedir();
  if (nenTang === 'darwin') return path.join(nha, 'Library', 'Application Support', ungDung, 'User', 'keybindings.json');
  if (nenTang === 'win32') return path.join(env.APPDATA ?? path.join(nha, 'AppData', 'Roaming'), ungDung, 'User', 'keybindings.json');
  return path.join(env.XDG_CONFIG_HOME ?? path.join(nha, '.config'), ungDung, 'User', 'keybindings.json');
}

/** Chèn keybinding vào nội dung keybindings.json (JSONC). `null` = đã có, không cần sửa. Thuần. */
export function chenKeybinding(noiDung: string): string | null {
  if (/workbench\.action\.terminal\.sendSequence[\s\S]{0,200}\\u001b\\r|"shift\+enter"[\s\S]{0,120}terminal\.sendSequence/.test(noiDung)) return null;
  const muc = JSON.stringify(KEYBINDING_VSCODE, null, 2).split('\n').map((d) => `  ${d}`).join('\n');
  const t = noiDung.trim();
  if (!t) return `// Shift+Enter xuống dòng trong terminal — thêm bởi CuongMini /terminal-setup\n[\n${muc}\n]\n`;
  const cuoi = noiDung.lastIndexOf(']');
  if (cuoi < 0) throw new Error('keybindings.json không có mảng [...] — sửa tay theo hướng dẫn.');
  // Mảng rỗng hay đã có phần tử (bỏ qua chú thích/khoảng trắng trước `]`)?
  const truoc = noiDung.slice(0, cuoi).replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '').trimEnd();
  const can = truoc.endsWith('[') || truoc.endsWith(',') ? '' : ',';
  return `${noiDung.slice(0, cuoi).trimEnd()}${can}\n  // Shift+Enter xuống dòng trong terminal — thêm bởi CuongMini /terminal-setup\n${muc}\n${noiDung.slice(cuoi)}`;
}

export function caiVsCode(ungDung: 'Code' | 'Cursor'): { duong: string; daCo: boolean; saoLuu: string | null } {
  const duong = duongKeybindingVsCode(ungDung);
  const cu = existsSync(duong) ? readFileSync(duong, 'utf8') : '';
  const moi = chenKeybinding(cu);
  if (moi === null) return { duong, daCo: true, saoLuu: null };
  mkdirSync(path.dirname(duong), { recursive: true });
  let saoLuu: string | null = null;
  if (cu) { saoLuu = `${duong}.cuongmini-${Date.now()}.bak`; copyFileSync(duong, saoLuu); }
  writeFileSync(duong, moi);
  return { duong, daCo: false, saoLuu };
}

export type LoaiTerminal = 'vscode' | 'cursor' | 'iterm' | 'windowsTerminal' | 'appleTerminal' | 'khac';

export function doTerminal(env: NodeJS.ProcessEnv = process.env): LoaiTerminal {
  if (env.TERM_PROGRAM === 'vscode') return /cursor/i.test(env.VSCODE_GIT_ASKPASS_MAIN ?? env.CURSOR_TRACE_ID ?? '') || env.CURSOR_TRACE_ID ? 'cursor' : 'vscode';
  if (env.TERM_PROGRAM === 'iTerm.app') return 'iterm';
  if (env.WT_SESSION) return 'windowsTerminal';
  if (env.TERM_PROGRAM === 'Apple_Terminal') return 'appleTerminal';
  return 'khac';
}

export const HUONG_DAN: Record<Exclude<LoaiTerminal, 'vscode' | 'cursor'>, string> = {
  iterm: '**iTerm2**: Settings → Profiles → Keys → Key Mappings → **+** → bấm Shift+Enter → Action: **Send Escape Sequence** → ô Esc+ gõ `\\r`… nếu không có ô đó thì chọn **Send Text with "vim" Special Chars** và gõ `\\e\\r`. Hoặc bật **Report modifiers using CSI u** (Keys → General) — CuongMini hiểu luôn.',
  windowsTerminal: '**Windows Terminal**: Settings → **Open JSON file**, thêm vào mảng `"actions"`:\n\n```json\n{ "command": { "action": "sendInput", "input": "\\u001b\\r" }, "keys": "shift+enter" }\n```\n\nLưu lại là có tác dụng ngay. (Alt+Enter của Windows Terminal là phím toàn màn hình — vì vậy dùng `ctrl+j` hoặc `\\` cuối dòng nếu chưa cài.)',
  appleTerminal: '**Terminal.app**: Settings → Profiles → Keyboard → bật **Use Option as Meta key** ⇒ Option+Enter xuống dòng. Shift+Enter không gán được trong Terminal.app; dùng `ctrl+j` hoặc `\\` cuối dòng.',
  khac: 'Terminal này chưa tự cài được. Xuống dòng bằng **Alt+Enter**, **ctrl+j**, hoặc gõ `\\` cuối dòng rồi Enter. Nếu terminal cho gán phím: gán Shift+Enter gửi chuỗi `ESC` + `\\r` (`\\x1b\\r`).',
};
