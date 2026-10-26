/**
 * MÀU cho terminal — tự viết SGR thay vì dùng chalk vì hai lẽ:
 *  1. `NO_COLOR` phải được tôn trọng ở MỌI chỗ (chalk bản Ink kèm theo không
 *     xem `NO_COLOR`), nên mọi màu đi qua một cửa duy nhất là `capMau()`.
 *  2. Tô cú pháp trên nền diff: mỗi token chỉ được huỷ MÀU CHỮ (`39`), không
 *     được `0` (huỷ cả nền) — nếu không thì dòng `+` xanh nền bị thủng lỗ chỗ.
 */
import stringWidth from 'string-width';

/** 0 = không màu · 1 = 16 màu · 2 = 256 màu · 3 = truecolor. */
export type CapMau = 0 | 1 | 2 | 3;

export function doCapMau(env: NodeJS.ProcessEnv, laTTY: boolean, nenTang: string = process.platform): CapMau {
  // https://no-color.org: có biến và KHÁC rỗng ⇒ tắt màu.
  if (env.NO_COLOR !== undefined && env.NO_COLOR !== '') return 0;
  const ep = env.FORCE_COLOR;
  if (ep === '0' || ep === 'false') return 0;
  if (ep === '1') return 1;
  if (ep === '2') return 2;
  if (ep === '3') return 3;
  if (!laTTY && ep === undefined) return 0;
  if (env.TERM === 'dumb' && ep === undefined) return 0;
  if (env.COLORTERM === 'truecolor' || env.COLORTERM === '24bit') return 3;
  if (/^(iTerm\.app|vscode|WezTerm|Hyper|ghostty|WarpTerminal|Tabby|rio)$/.test(env.TERM_PROGRAM ?? '')) return 3;
  if (env.WT_SESSION || nenTang === 'win32') return 3;
  if (/kitty|alacritty|foot|ghostty|direct/i.test(env.TERM ?? '')) return 3;
  // Terminal.app (Apple_Terminal) chỉ chắc chắn 256 màu.
  return 2;
}

let cap: CapMau = doCapMau(process.env, Boolean(process.stdout.isTTY));

export const capMau = (): CapMau => cap;
/** Cho phép kiểm thử / chế độ in ép mức màu. */
export function datCapMau(c: CapMau): void { cap = c; }

// ─── Thương hiệu ─────────────────────────────────────────────────

export const THUONG_HIEU = {
  tim: '#d97757',
  xanh: '#e8a26a',
  timNhat: '#eab49a',
  xanhNhat: '#f0c9a8',
  xam: '#6b7280',
  xamNhat: '#9ca3af',
  vien: '#4b5563',
  xanhLa: '#22c55e',
  do: '#ef4444',
  vang: '#f59e0b',
  xanhNgoc: '#06b6d4',
} as const;

// ─── Chuyển hex ⇒ mã SGR ─────────────────────────────────────────

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const d = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = Number.parseInt(d, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** RGB ⇒ ô 256 màu gần nhất (khối 6×6×6 hoặc dải xám). */
export function rgbSang256(r: number, g: number, b: number): number {
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round(((r - 8) / 247) * 24) + 232;
  }
  const q = (v: number) => Math.round((v / 255) * 5);
  return 16 + 36 * q(r) + 6 * q(g) + q(b);
}

/** 16 màu chuẩn (bảng mặc định của xterm) — để chọn màu GẦN NHẤT thay vì làm tròn từng kênh. */
const BANG_16: Array<[number, number, number, number]> = [
  [30, 0, 0, 0], [31, 205, 0, 0], [32, 0, 205, 0], [33, 205, 205, 0], [34, 0, 0, 238], [35, 205, 0, 205], [36, 0, 205, 205], [37, 229, 229, 229],
  [90, 127, 127, 127], [91, 255, 0, 0], [92, 0, 255, 0], [93, 255, 255, 0], [94, 92, 92, 255], [95, 255, 0, 255], [96, 0, 255, 255], [97, 255, 255, 255],
];

/**
 * RGB ⇒ 16 màu (conhost Windows đời cũ, TERM=linux…). Màu gần nhất theo khoảng
 * cách RGB; CHỮ không bao giờ ra đúng màu nền (đen trên nền tối / trắng trên
 * nền sáng) — bản làm tròn từng kênh cũ biến xám #6b7280 thành ĐEN, tàng hình.
 */
export function rgbSang16(r: number, g: number, b: number, laNen = false): number {
  let tot = BANG_16[0]!;
  let kc = Infinity;
  for (const m of BANG_16) {
    if (!laNen && ((theme === 'toi' && m[0] === 30) || (theme === 'sang' && m[0] === 97))) continue;
    const d = (m[1] - r) ** 2 + (m[2] - g) ** 2 + (m[3] - b) ** 2;
    if (d < kc) { kc = d; tot = m; }
  }
  return tot[0];
}

// ─── Theme sáng / tối ────────────────────────────────────────────

export type Theme = 'toi' | 'sang';
let theme: Theme = 'toi';
export const themeHienTai = (): Theme => theme;
export function datTheme(t: Theme): void { theme = t; }

/**
 * Đoán nền terminal: `COLORFGBG` ("15;0" = chữ trắng nền đen) do rxvt, Konsole,
 * iTerm2 (khi bật) đặt. Nền 7 hoặc 15 ⇒ sáng. Không có ⇒ tối (đa số terminal dev).
 */
export function doTheme(env: NodeJS.ProcessEnv): Theme {
  const nen = (env.COLORFGBG ?? '').split(';').pop();
  return nen === '7' || nen === '15' ? 'sang' : 'toi';
}

function rgbHsl(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = [r / 255, g / 255, b / 255];
  const max = Math.max(x, y, z);
  const min = Math.min(x, y, z);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s2 = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === x ? (y - z) / d + (y < z ? 6 : 0) : max === y ? (z - x) / d + 2 : (x - y) / d + 4;
  return [h / 6, s2, l];
}
function hslRgb(h: number, s2: number, l: number): [number, number, number] {
  if (s2 === 0) return [l * 255, l * 255, l * 255].map(Math.round) as [number, number, number];
  const q = l < 0.5 ? l * (1 + s2) : l + s2 - l * s2;
  const p = 2 * l - q;
  const k = (t: number) => {
    const u = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (u < 1 / 6) return p + (q - p) * 6 * u;
    if (u < 1 / 2) return q;
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6;
    return p;
  };
  return [k(h + 1 / 3), k(h), k(h - 1 / 3)].map((v) => Math.round(v * 255)) as [number, number, number];
}

/**
 * Theme sáng KHÔNG cần bảng màu thứ hai: mọi màu chữ quá sáng được hạ độ sáng
 * (giữ sắc độ) để đọc được trên nền trắng; màu nền tối (diff, tin người dùng)
 * được nâng thành nền nhạt cùng tông. Thêm màu mới ở đâu cũng tự đúng.
 */
export function chinhTheoTheme(rgb: [number, number, number], laNen: boolean, t: Theme = theme): [number, number, number] {
  if (t === 'toi') return rgb;
  const [h, s2, l] = rgbHsl(...rgb);
  if (laNen) return l >= 0.85 ? rgb : hslRgb(h, Math.min(s2, 0.6), 0.92);
  // Hạ theo ĐỘ CHÓI cảm nhận (không theo L của HSL): xanh lá L=0,36 vẫn quá chói trên nền
  // trắng. Dừng khi độ chói ≤ 0,18 — tương phản ≈ 4,5:1 với nền trắng (mức WCAG AA).
  let l2 = Math.min(l, 0.45);
  let ra = hslRgb(h, s2, l2);
  while (doChoi(ra) > 0.18 && l2 > 0.08) { l2 -= 0.02; ra = hslRgb(h, s2, l2); }
  return doChoi(rgb) <= 0.18 ? rgb : ra;
}

/** Độ chói tương đối (WCAG). */
function doChoi([r, g, b]: [number, number, number]): number {
  const k = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * k(r) + 0.7152 * k(g) + 0.0722 * k(b);
}

function maMau(hex: string, laNen: boolean): string {
  const [r, g, b] = chinhTheoTheme(hexRgb(hex), laNen);
  if (cap === 3) return `${laNen ? 48 : 38};2;${r};${g};${b}`;
  if (cap === 2) return `${laNen ? 48 : 38};5;${rgbSang256(r, g, b)}`;
  return String(rgbSang16(r, g, b, laNen) + (laNen ? 10 : 0));
}

const boc = (mo: string, dong: string) => (s: string): string => (cap === 0 || s === '' ? s : `\x1b[${mo}m${s}\x1b[${dong}m`);

/** Màu chữ theo hex. */
export const mau = (hex: string) => (s: string): string => (cap === 0 || s === '' ? s : `\x1b[${maMau(hex, false)}m${s}\x1b[39m`);
/** Màu nền theo hex. */
export const nen = (hex: string) => (s: string): string => (cap === 0 || s === '' ? s : `\x1b[${maMau(hex, true)}m${s}\x1b[49m`);
export const dam = boc('1', '22');
export const mo = boc('2', '22');
export const nghieng = boc('3', '23');
export const gachChan = boc('4', '24');
export const dao = boc('7', '27');
export const gachNgang = boc('9', '29');

/** Màu cho prop `color` của Ink — `undefined` khi tắt màu để Ink không tự tô. */
export const mauInk = (hex: string): string | undefined => {
  if (cap === 0) return undefined;
  const [r, g, b] = chinhTheoTheme(hexRgb(hex), false);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

// ─── Chuyển sắc tím → xanh ───────────────────────────────────────

function tron(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexRgb(a);
  const [r2, g2, b2] = hexRgb(b);
  const h = (x: number) => Math.round(x).toString(16).padStart(2, '0');
  return `#${h(r1 + (r2 - r1) * t)}${h(g1 + (g2 - g1) * t)}${h(b1 + (b2 - b1) * t)}`;
}

/** Tô chuyển sắc theo CỘT (`rong` = tổng số cột để nhiều dòng cùng một dải màu). */
export function chuyenSac(s: string, tu: string = THUONG_HIEU.tim, den: string = THUONG_HIEU.xanh, rong?: number): string {
  if (cap === 0) return s;
  const kyTu = [...s];
  const n = Math.max(1, (rong ?? kyTu.length) - 1);
  return kyTu.map((c, i) => (c === ' ' ? c : mau(tron(tu, den, Math.min(1, i / n)))(c))).join('');
}

// ─── Đo / cắt ────────────────────────────────────────────────────

// eslint-disable-next-line no-control-regex
const ANSI = /\x1b\[[0-9;:]*m|\x1b\]8;[^\x07\x1b]*(?:\x07|\x1b\\)/g;
export const boMau = (s: string): string => s.replace(ANSI, '');
export const doRong = (s: string): number => stringWidth(s);

/** Cắt chuỗi THƯỜNG (chưa tô) cho vừa `n` cột, thêm `…` nếu bị cắt. */
export function catVua(s: string, n: number): string {
  if (n <= 0) return '';
  if (stringWidth(s) <= n) return s;
  let ra = '';
  let w = 0;
  for (const c of s) {
    const cw = stringWidth(c);
    if (w + cw > n - 1) break;
    ra += c;
    w += cw;
  }
  return `${ra}…`;
}

/** Thêm khoảng trắng phải cho đủ `n` cột (đo bỏ mã màu). */
export function dem(s: string, n: number): string {
  const w = stringWidth(s);
  return w >= n ? s : s + ' '.repeat(n - w);
}
