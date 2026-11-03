// lab7/yeu/index.js — a first attempt that generates correct codes for the happy path, but hardcodes 6 digits (so the
// 8-digit RFC vectors fail) and verifies only the EXACT current step (no skew window — a user whose clock is a few
// seconds off is locked out). Both are real first-attempt mistakes.
import { createHmac } from 'node:crypto';
const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32Encode(buf) { let bits = 0, val = 0, out = ''; for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += ALPH[(val >>> (bits - 5)) & 31]; bits -= 5; } } if (bits > 0) out += ALPH[(val << (5 - bits)) & 31]; return out; }
export function base32Decode(str) { const s = String(str).toUpperCase().replace(/[^A-Z2-7]/g, ''); let bits = 0, val = 0; const out = []; for (const ch of s) { val = (val << 5) | ALPH.indexOf(ch); bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } } return Buffer.from(out); }
export function hotp(key, counter, { alg = 'sha1' } = {}) {
  const msg = Buffer.alloc(8); msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac(alg, key).update(msg).digest();
  const off = h[h.length - 1] & 0x0f;
  const bin = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 1000000).padStart(6, '0');   // BUG: hardcoded 6 digits, ignores opts.digits
}
export function totp(secretB32, { time = Math.floor(Date.now() / 1000), step = 30 } = {}) {
  return hotp(base32Decode(secretB32), Math.floor(time / step));
}
export function verifyTotp(secretB32, code, { time = Math.floor(Date.now() / 1000), step = 30 } = {}) {
  return { ok: totp(secretB32, { time, step }) === String(code) };   // BUG: no skew window
}
