/**
 * Biểu diễn dữ liệu — hàm thuần: chữ (ASCII/Unicode/UTF-8/UTF-16, mojibake), số thực IEEE-754, màu RGB, endianness.
 * Viết TAY (không gọi TextEncoder/DataView trong phần "dạy") để từng bit có lý do; bộ test đối chiếu với TextEncoder
 * và Float32Array/Float64Array của trình duyệt.
 */

/* ═══════════ CHỮ ═══════════ */

export interface Utf8Seg { bits: string; kind: 'prefix' | 'payload' }
export interface CharInfo {
  ch: string;
  cp: number;
  /** U+1EC7 */
  uplus: string;
  utf8: number[];
  /** mỗi byte tách thành phần "đầu" (110/10/1110…) và phần "chở" bit của mã điểm */
  utf8Segs: Utf8Seg[][];
  utf16: number[];
  ascii: boolean;
  /** dấu kết hợp (combining mark) — xuất hiện khi chữ ở dạng NFD */
  combining: boolean;
}

export const uplus = (cp: number) => 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');

/** Mã hoá UTF-8 một mã điểm (RFC 3629). */
export function utf8Encode(cp: number): number[] {
  if (cp < 0x80) return [cp];
  if (cp < 0x800) return [0xc0 | (cp >> 6), 0x80 | (cp & 0x3f)];
  if (cp < 0x10000) return [0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f)];
  return [0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f)];
}

/** Giải mã UTF-8 (chuẩn chặt): trả về mã điểm, hoặc 0xFFFD (�) cho chuỗi byte hỏng. */
export function utf8Decode(bytes: number[]): number[] {
  const out: number[] = [];
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i];
    const n = b < 0x80 ? 1 : b >> 5 === 6 ? 2 : b >> 4 === 14 ? 3 : b >> 3 === 30 ? 4 : 0;
    if (!n) { out.push(0xfffd); i++; continue; }
    if (n === 1) { out.push(b); i++; continue; }
    let cp = b & (0xff >> (n + 1));
    let ok = i + n <= bytes.length;
    for (let k = 1; ok && k < n; k++) {
      const c = bytes[i + k];
      if (c >> 6 !== 2) { ok = false; break; }
      cp = (cp << 6) | (c & 0x3f);
    }
    if (!ok) { out.push(0xfffd); i++; continue; }
    out.push(cp);
    i += n;
  }
  return out;
}

export function utf16Encode(cp: number): number[] {
  if (cp < 0x10000) return [cp];
  const v = cp - 0x10000;
  return [0xd800 + (v >> 10), 0xdc00 + (v & 0x3ff)];
}

function segsOf(bytes: number[]): Utf8Seg[][] {
  return bytes.map((b, k) => {
    const bits = b.toString(2).padStart(8, '0');
    const pre = bytes.length === 1 ? 1 : k === 0 ? bytes.length + 1 : 2;
    return [{ bits: bits.slice(0, pre), kind: 'prefix' }, { bits: bits.slice(pre), kind: 'payload' }];
  });
}

const isCombining = (cp: number) => (cp >= 0x300 && cp <= 0x36f) || (cp >= 0x1dc0 && cp <= 0x1dff) || (cp >= 0x20d0 && cp <= 0x20ff);

export function charsOf(text: string): CharInfo[] {
  return Array.from(text).map((ch) => {
    const cp = ch.codePointAt(0) ?? 0;
    const utf8 = utf8Encode(cp);
    return { ch, cp, uplus: uplus(cp), utf8, utf8Segs: segsOf(utf8), utf16: utf16Encode(cp), ascii: cp < 0x80, combining: isCombining(cp) };
  });
}

export const utf8Bytes = (text: string) => Array.from(text).flatMap((c) => utf8Encode(c.codePointAt(0) ?? 0));

/** Windows-1252 cho 0x80–0x9F (phần còn lại trùng Latin-1). undefined = byte không có chữ. */
const CP1252: Record<number, number | undefined> = {
  0x80: 0x20ac, 0x81: undefined, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021,
  0x88: 0x02c6, 0x89: 0x2030, 0x8a: 0x0160, 0x8b: 0x2039, 0x8c: 0x0152, 0x8d: undefined, 0x8e: 0x017d, 0x8f: undefined,
  0x90: undefined, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201c, 0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a, 0x9c: 0x0153, 0x9d: undefined, 0x9e: 0x017e, 0x9f: 0x0178,
};
/** Đọc dãy byte như thể nó là Windows-1252 — đúng cái lỗi "Viá»‡t Nam" khi trình đọc đoán sai bảng mã. */
export function decodeCp1252(bytes: number[]): string {
  return bytes.map((b) => {
    // 5 byte không có chữ (81 8D 8F 90 9D): chuẩn WHATWG mà trình duyệt dùng giữ nguyên thành ký tự điều khiển C1
    if (b >= 0x80 && b <= 0x9f) return String.fromCodePoint(CP1252[b] ?? b);
    return String.fromCodePoint(b);
  }).join('');
}
/** Mã hoá ngược sang Windows-1252 (chữ không có trong bảng ⇒ '?'). Dùng để mô phỏng lỗi mã hoá HAI LẦN. */
export function encodeCp1252(text: string): number[] {
  const rev = new Map<number, number>();
  for (const [k, v] of Object.entries(CP1252)) if (v !== undefined) rev.set(v, Number(k));
  return Array.from(text).map((c) => {
    const cp = c.codePointAt(0) ?? 63;
    if (cp < 0x80 || (cp >= 0xa0 && cp <= 0xff)) return cp;
    return rev.get(cp) ?? 63;
  });
}
/** "Việt" → UTF-8 → đọc nhầm là cp1252 → lưu lại thành UTF-8 → đọc nhầm lần nữa … */
export function mojibake(text: string, rounds = 1): string {
  let t = text;
  for (let i = 0; i < rounds; i++) t = decodeCp1252(utf8Bytes(t));
  return t;
}
export const fromCodePoints = (cps: number[]) => cps.map((c) => String.fromCodePoint(c)).join('');

/* ═══════════ SỐ THỰC IEEE-754 ═══════════ */

export type FloatFmt = 'f32' | 'f64';
export const FMT = {
  f32: { bits: 32, exp: 8, frac: 23, bias: 127 },
  f64: { bits: 64, exp: 11, frac: 52, bias: 1023 },
} as const;

export interface FloatParts {
  fmt: FloatFmt;
  /** dãy bit đủ độ dài (bit 31/63 bên trái) */
  bits: string;
  sign: 0 | 1;
  expRaw: number;
  /** phần định trị dạng bit */
  fracBits: string;
  kind: 'zero' | 'subnormal' | 'normal' | 'inf' | 'nan';
  /** số mũ thật (expRaw − bias; subnormal = 1 − bias) */
  exp: number;
  /** giá trị JS (double) của số đã lưu */
  value: number;
  /** giá trị CHÍNH XÁC của số đã lưu, viết thập phân đầy đủ (mọi số nhị phân hữu hạn đều có dạng thập phân hữu hạn) */
  exact: string;
  /** dạng 1.xxx × 2^e (hoặc 0.xxx cho subnormal) */
  sci: string;
}

const B0 = BigInt(0), B1 = BigInt(1), B2 = BigInt(2), B5 = BigInt(5), B10 = BigInt(10);
const bpow = (b: bigint, e: number) => { let r = B1; for (let i = 0; i < e; i++) r *= b; return r; };

/** m × 2^e viết thập phân chính xác (m ≥ 0). */
export function exactDecimal(m: bigint, e: number): string {
  if (m === B0) return '0';
  if (e >= 0) return (m * bpow(B2, e)).toString();
  // m / 2^k = m·5^k / 10^k
  const k = -e;
  const num = (m * bpow(B5, k)).toString();
  const intPart = num.length > k ? num.slice(0, num.length - k) : '0';
  let frac = num.length > k ? num.slice(num.length - k) : num.padStart(k, '0');
  frac = frac.replace(/0+$/, '');
  return frac ? `${intPart}.${frac}` : intPart;
}

/** Bit của một số JS khi lưu ở dạng f32/f64 (f32: làm tròn về float gần nhất, như Math.fround). */
export function floatBits(x: number, fmt: FloatFmt): string {
  const buf = new ArrayBuffer(8);
  const dv = new DataView(buf);
  if (fmt === 'f32') { dv.setFloat32(0, x); return dv.getUint32(0).toString(2).padStart(32, '0'); }
  dv.setFloat64(0, x);
  return dv.getUint32(0).toString(2).padStart(32, '0') + dv.getUint32(4).toString(2).padStart(32, '0');
}

/** Tách bit thành dấu/mũ/định trị và tính giá trị chính xác bằng số nguyên lớn — không dùng phép toán số thực. */
export function partsFromBits(bits: string, fmt: FloatFmt): FloatParts {
  const F = FMT[fmt];
  const sign = bits[0] === '1' ? 1 : 0;
  const expBits = bits.slice(1, 1 + F.exp);
  const fracBits = bits.slice(1 + F.exp);
  const expRaw = parseInt(expBits, 2);
  const frac = BigInt('0b' + fracBits);
  const allOnes = expRaw === 2 ** F.exp - 1;
  let kind: FloatParts['kind'];
  let m: bigint, e: number;
  if (allOnes) { kind = frac === B0 ? 'inf' : 'nan'; m = B0; e = 0; }
  else if (expRaw === 0) { kind = frac === B0 ? 'zero' : 'subnormal'; m = frac; e = 1 - F.bias - F.frac; }
  else { kind = 'normal'; m = (B1 << BigInt(F.frac)) | frac; e = expRaw - F.bias - F.frac; }
  const exp = kind === 'normal' ? expRaw - F.bias : 1 - F.bias;
  let exact: string;
  if (kind === 'inf') exact = sign ? '-Infinity' : 'Infinity';
  else if (kind === 'nan') exact = 'NaN';
  else exact = (sign ? '-' : '') + exactDecimal(m, e);
  // giá trị JS
  const buf = new ArrayBuffer(8);
  const dv = new DataView(buf);
  let value: number;
  if (fmt === 'f32') { dv.setUint32(0, parseInt(bits, 2)); value = dv.getFloat32(0); }
  else { dv.setUint32(0, parseInt(bits.slice(0, 32), 2)); dv.setUint32(4, parseInt(bits.slice(32), 2)); value = dv.getFloat64(0); }
  const fracShown = fracBits.replace(/0+$/, '') || '0';
  const sci = kind === 'normal' ? `${sign ? '−' : ''}1.${fracShown}₂ × 2^${exp}`
    : kind === 'subnormal' ? `${sign ? '−' : ''}0.${fracShown}₂ × 2^${exp}`
      : kind === 'zero' ? `${sign ? '−' : ''}0` : kind === 'inf' ? `${sign ? '−' : ''}∞` : 'NaN';
  return { fmt, bits, sign: sign as 0 | 1, expRaw, fracBits, kind, exp, value, exact, sci };
}

export const floatParts = (x: number, fmt: FloatFmt) => partsFromBits(floatBits(x, fmt), fmt);

/** Đổi phần thập phân sang nhị phân bằng "nhân 2 lấy phần nguyên" — chạy trên SỐ HỮU TỈ chính xác (BigInt) từ chuỗi thập phân. */
export function fracToBinarySteps(decimal: string, maxSteps = 24): { steps: Array<{ x: string; times2: string; bit: 0 | 1 }>; repeatsFrom: number | null } {
  const m = decimal.trim().match(/^(\d*)\.(\d+)$/);
  if (!m) return { steps: [], repeatsFrom: null };
  const den = bpow(B10, m[2].length);
  let num = BigInt(m[2]);
  const seen = new Map<string, number>();
  const steps: Array<{ x: string; times2: string; bit: 0 | 1 }> = [];
  const show = (n: bigint) => {
    const s = n.toString().padStart(m[2].length, '0').replace(/0+$/, '');
    return '0.' + (s || '0');
  };
  let repeatsFrom: number | null = null;
  for (let i = 0; i < maxSteps && num !== B0; i++) {
    const key = num.toString();
    if (seen.has(key)) { repeatsFrom = seen.get(key)!; break; }
    seen.set(key, i);
    const t = num * B2;
    const bit: 0 | 1 = t >= den ? 1 : 0;
    const rest = bit ? t - den : t;
    steps.push({ x: show(num), times2: (bit ? '1.' : '0.') + (rest.toString().padStart(m[2].length, '0').replace(/0+$/, '') || '0'), bit });
    num = rest;
  }
  return { steps, repeatsFrom };
}

/* ═══════════ ENDIANNESS ═══════════ */
export function bytesOfU32(u: number, little: boolean): number[] {
  const be = [(u >>> 24) & 255, (u >>> 16) & 255, (u >>> 8) & 255, u & 255];
  return little ? be.reverse() : be;
}

/* ═══════════ MÀU ═══════════ */
export interface Rgb { r: number; g: number; b: number }
export const rgbToHex = ({ r, g, b }: Rgb) => '#' + [r, g, b].map((v) => v.toString(16).toUpperCase().padStart(2, '0')).join('');
export function hexToRgb(h: string): Rgb | null {
  const m = h.trim().replace(/^#/, '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return null;
  const s = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return { r: parseInt(s.slice(0, 2), 16), g: parseInt(s.slice(2, 4), 16), b: parseInt(s.slice(4, 6), 16) };
}
/** Kích thước ảnh thô (không nén): rộng × cao × số byte mỗi điểm ảnh. */
export const rawImageBytes = (w: number, h: number, bpp = 3) => w * h * bpp;
