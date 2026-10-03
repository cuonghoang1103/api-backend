/**
 * TOTP (RFC 6238) tự viết bằng `node:crypto` — không thêm thư viện.
 *
 * Vì sao tự viết: toàn bộ thuật toán là HMAC-SHA1 + cắt động (RFC 4226 §5.3),
 * ~60 dòng. Thêm một gói npm cho từng ấy mã là thêm một chuỗi cung ứng phải
 * canh. Đúng/sai được khoá bằng bộ vector chính thức ở RFC 6238 phụ lục B
 * (`totp.test.ts`), nên "tự viết" không có nghĩa là "tự tin".
 *
 * Tham số cố định theo thứ mọi app xác thực (Google Authenticator, Authy,
 * 1Password, Bitwarden…) mặc định hiểu: SHA1 · 6 số · bước 30 giây.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const TOTP_BUOC_GIAY = 30;
export const TOTP_SO_CHU_SO = 6;
/** Chấp nhận lệch ±1 bước (±30s) cho đồng hồ điện thoại chạy lệch. */
export const TOTP_CUA_SO = 1;

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** Base32 RFC 4648, KHÔNG có `=` đệm (app xác thực chấp nhận cả hai). */
export function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

/** Giải base32 — bỏ qua dấu cách/gạch/`=`, không phân biệt hoa thường. */
export function base32Decode(s: string): Buffer {
  const clean = s.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx < 0) throw new Error('Chuỗi base32 không hợp lệ');
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

/** HOTP (RFC 4226). `counter` là số bước — ghi 8 byte big-endian. */
export function hotp(key: Buffer, counter: number, digits = TOTP_SO_CHU_SO, algo: 'sha1' | 'sha256' | 'sha512' = 'sha1'): string {
  const msg = Buffer.alloc(8);
  // Tách cao/thấp thay vì BigInt: counter của TOTP vẫn < 2^53 tới năm 2.8e15.
  msg.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  msg.writeUInt32BE(counter >>> 0, 4);
  const h = createHmac(algo, key).update(msg).digest();
  const off = h[h.length - 1]! & 0x0f;
  const bin =
    ((h[off]! & 0x7f) << 24) |
    ((h[off + 1]! & 0xff) << 16) |
    ((h[off + 2]! & 0xff) << 8) |
    (h[off + 3]! & 0xff);
  return String(bin % 10 ** digits).padStart(digits, '0');
}

/** Số bước TOTP tại thời điểm `nowMs`. */
export function buocHienTai(nowMs: number = Date.now()): number {
  return Math.floor(nowMs / 1000 / TOTP_BUOC_GIAY);
}

export function totp(key: Buffer, nowMs: number = Date.now(), digits = TOTP_SO_CHU_SO): string {
  return hotp(key, buocHienTai(nowMs), digits);
}

function bangNhauHangSo(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * Kiểm một mã 6 số. Trả về SỐ BƯỚC đã khớp (để lưu làm `mfaLastUsedStep`),
 * hoặc `null` nếu sai.
 *
 * `lastUsedStep`: bước của mã gần nhất đã được chấp nhận. Mọi bước ≤ nó bị
 * bỏ qua — nên cùng một mã (hoặc một mã CŨ HƠN trong cửa sổ ±1) không dùng
 * lại được, kể cả khi kẻ xấu chộp được nó trong 30 giây đó.
 */
export function kiemTotp(
  key: Buffer,
  code: string,
  opts: { nowMs?: number; window?: number; lastUsedStep?: number | null } = {},
): number | null {
  const ma = String(code ?? '').replace(/\s+/g, '');
  if (!/^\d{6}$/.test(ma)) return null;
  const now = buocHienTai(opts.nowMs ?? Date.now());
  const w = opts.window ?? TOTP_CUA_SO;
  const last = opts.lastUsedStep ?? null;
  let khop: number | null = null;
  // Duyệt HẾT cửa sổ (không thoát sớm) để thời gian không lộ mã khớp ở bước nào.
  for (let step = now - w; step <= now + w; step++) {
    if (last !== null && step <= last) continue;
    if (bangNhauHangSo(hotp(key, step), ma) && khop === null) khop = step;
  }
  return khop;
}

/** 20 byte ngẫu nhiên = 160 bit, đúng độ dài RFC 4226 khuyên cho SHA1. */
export function sinhKhoaTotp(): Buffer {
  return randomBytes(20);
}

/** URI `otpauth://` — app xác thực đọc từ mã QR hoặc dán tay. */
export function otpauthUri(issuer: string, account: string, secretB32: string): string {
  const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(account)}`;
  const q = new URLSearchParams({
    secret: secretB32,
    issuer,
    algorithm: 'SHA1',
    digits: String(TOTP_SO_CHU_SO),
    period: String(TOTP_BUOC_GIAY),
  });
  return `otpauth://totp/${label}?${q.toString()}`;
}
