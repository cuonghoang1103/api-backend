/**
 * Bit & hệ đếm — hàm thuần cho "Bits & number systems playground".
 * Mọi giá trị được giữ dưới dạng SỐ KHÔNG DẤU trong [0, 2^w) — đúng như thanh ghi giữ một dãy bit; "có dấu" chỉ là
 * một CÁCH ĐỌC dãy bit đó (bù hai). Dùng Number (an toàn tới 2^53) nên 32 bit không cần BigInt.
 */
export type Width = 4 | 8 | 16 | 32;
export const WIDTHS: Width[] = [8, 16, 32];

export const pow2 = (n: number) => 2 ** n;
/** Đưa một số nguyên bất kỳ về dãy w bit (cắt bit cao, như phần cứng). */
export const wrap = (v: number, w: Width) => {
  const m = pow2(w);
  return ((Math.trunc(v) % m) + m) % m;
};
/** Đọc dãy bit như số có dấu bù hai. */
export const toSigned = (u: number, w: Width) => (u >= pow2(w - 1) ? u - pow2(w) : u);
export const minSigned = (w: Width) => -pow2(w - 1);
export const maxSigned = (w: Width) => pow2(w - 1) - 1;
export const maxUnsigned = (w: Width) => pow2(w) - 1;

export const bitAt = (u: number, k: number) => Math.floor(u / pow2(k)) % 2;
export const toggleBit = (u: number, k: number, w: Width) => wrap(bitAt(u, k) ? u - pow2(k) : u + pow2(k), w);
/** Chuỗi nhị phân đủ w chữ số, bit cao bên trái. */
export const bin = (u: number, w: number) => u.toString(2).padStart(w, '0');
export const hex = (u: number, w: number) => u.toString(16).toUpperCase().padStart(Math.ceil(w / 4), '0');
export const oct = (u: number, w: number) => u.toString(8).padStart(Math.ceil(w / 3), '0');
/** Nhóm chữ số từ phải sang (1010 1010). */
export function group(str: string, n = 4, sep = ' ') {
  const out: string[] = [];
  for (let i = str.length; i > 0; i -= n) out.unshift(str.slice(Math.max(0, i - n), i));
  return out.join(sep);
}

/** Đọc số người dùng gõ: 200, -56, 0xC8, 0b11001000, 0o310, C8h. null nếu không đọc được. */
export function parseNumber(text: string): number | null {
  let t = text.trim().replace(/[_\s]/g, '').toLowerCase();
  if (!t) return null;
  let neg = false;
  if (t.startsWith('-')) { neg = true; t = t.slice(1); }
  let v: number;
  if (/^0x[0-9a-f]+$/.test(t)) v = parseInt(t.slice(2), 16);
  else if (/^[0-9a-f]+h$/.test(t)) v = parseInt(t.slice(0, -1), 16);
  else if (/^0b[01]+$/.test(t)) v = parseInt(t.slice(2), 2);
  else if (/^0o[0-7]+$/.test(t)) v = parseInt(t.slice(2), 8);
  else if (/^[0-9]+$/.test(t)) v = parseInt(t, 10);
  else return null;
  if (!Number.isFinite(v) || v > 2 ** 53) return null;
  return neg ? -v : v;
}

/** Có vừa w bit không, theo cách đọc nào. */
export function fits(v: number, w: Width) {
  return { unsigned: v >= 0 && v <= maxUnsigned(w), signed: v >= minSigned(w) && v <= maxSigned(w) };
}

/* ── Đổi cơ số từng bước ─────────────────────────────────────────────────────────────────── */
export interface DivStep { n: number; q: number; r: number }
/** Chia liên tiếp cho cơ số: số dư đọc NGƯỢC từ dưới lên là kết quả. */
export function divisionSteps(n: number, base: number): DivStep[] {
  const out: DivStep[] = [];
  let x = Math.trunc(Math.abs(n));
  if (x === 0) return [{ n: 0, q: 0, r: 0 }];
  while (x > 0) { const q = Math.floor(x / base); out.push({ n: x, q, r: x % base }); x = q; }
  return out;
}
export const DIGITS = '0123456789ABCDEF';
export const digitsFromSteps = (st: DivStep[]) => st.map((s) => DIGITS[s.r]).reverse().join('');

export interface PlaceTerm { digit: number; power: number; weight: number; value: number }
/** Khai triển theo trọng số: 11001000₂ = 1×2⁷ + 1×2⁶ + … */
export function placeValues(digits: string, base: number): PlaceTerm[] {
  const d = digits.toUpperCase().split('');
  return d.map((ch, i) => {
    const digit = DIGITS.indexOf(ch);
    const power = d.length - 1 - i;
    const weight = base ** power;
    return { digit, power, weight, value: digit * weight };
  });
}

/* ── Bù hai ─────────────────────────────────────────────────────────────────────────────── */
export interface NegSteps { start: number; inverted: number; plusOne: number }
/** −x = (đảo mọi bit) + 1. */
export function negateSteps(u: number, w: Width): NegSteps {
  const inverted = maxUnsigned(w) - u;
  return { start: u, inverted, plusOne: wrap(inverted + 1, w) };
}

export interface ArithResult {
  a: number; b: number; result: number; op: '+' | '-';
  /** bit nhớ ra khỏi bit cao nhất (với phép trừ: 1 nghĩa là KHÔNG mượn) */
  carryOut: 0 | 1;
  /** cách đọc không dấu: kết quả sai vì vượt [0, 2^w) */
  unsignedOverflow: boolean;
  /** cách đọc có dấu: kết quả sai vì vượt [−2^(w−1), 2^(w−1)) */
  signedOverflow: boolean;
  /** dãy nhớ từng cột (cột 0 = bit thấp), để vẽ phép cộng tay */
  carries: number[];
}

/** Cộng/trừ đúng như ALU: trừ = cộng với bù hai của b. Cờ C và V như CPU thật. */
export function arith(a: number, b: number, op: '+' | '-', w: Width): ArithResult {
  const bb = op === '+' ? b : wrap(maxUnsigned(w) - b, w); // đảo bit, cộng 1 qua carry-in
  let carry = op === '+' ? 0 : 1;
  const carries: number[] = [];
  let result = 0;
  for (let k = 0; k < w; k++) {
    carries.push(carry);
    const s = bitAt(a, k) + bitAt(bb, k) + carry;
    if (s % 2) result += pow2(k);
    carry = s >= 2 ? 1 : 0;
  }
  const sa = toSigned(a, w), sb = toSigned(b, w);
  const exactS = op === '+' ? sa + sb : sa - sb;
  const exactU = op === '+' ? a + b : a - b;
  return {
    a, b, op, result, carryOut: carry as 0 | 1, carries,
    unsignedOverflow: exactU < 0 || exactU > maxUnsigned(w),
    signedOverflow: exactS < minSigned(w) || exactS > maxSigned(w),
  };
}

/* ── Dịch & mặt nạ ──────────────────────────────────────────────────────────────────────── */
export type ShiftOp = 'shl' | 'shr' | 'sar' | 'rol' | 'ror';
/** Dịch n bit. shl/shr = logic (chèn 0), sar = số học (chép bit dấu), rol/ror = xoay vòng. */
export function shift(u: number, n: number, op: ShiftOp, w: Width): { value: number; out: number[] } {
  let v = u;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const hi = bitAt(v, w - 1), lo = bitAt(v, 0);
    if (op === 'shl') { out.push(hi); v = wrap(v * 2, w); }
    else if (op === 'shr') { out.push(lo); v = Math.floor(v / 2); }
    else if (op === 'sar') { out.push(lo); v = Math.floor(v / 2) + hi * pow2(w - 1); }
    else if (op === 'rol') { v = wrap(v * 2, w) + hi; }
    else { v = Math.floor(v / 2) + lo * pow2(w - 1); }
  }
  return { value: v, out };
}

export type BitOp = 'and' | 'or' | 'xor' | 'not';
export function bitwise(a: number, b: number, op: BitOp, w: Width) {
  let r = 0;
  for (let k = 0; k < w; k++) {
    const x = bitAt(a, k), y = bitAt(b, k);
    const bit = op === 'and' ? x & y : op === 'or' ? x | y : op === 'xor' ? x ^ y : 1 - x;
    if (bit) r += pow2(k);
  }
  return r;
}

/** Từ điện áp tới bit: ngưỡng kiểu logic 3,3 V (≥ 2,0 V là 1, ≤ 0,8 V là 0, giữa là vùng cấm). */
export function voltsToBit(v: number): 0 | 1 | null {
  if (v >= 2.0) return 1;
  if (v <= 0.8) return 0;
  return null;
}
