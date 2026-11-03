// src/totp/index.js — TOTP from scratch (RFC 6238 over HOTP, RFC 4226). Chapter 7 = Lab 7 reference.
// A shared secret, the current 30-second step as an 8-byte counter, HMAC-SHA1, dynamic truncation ⇒ a 6-digit code.
// No library: the whole algorithm is the ~30 lines below, checked against the RFC 6238 test vectors and otplib.
import { createHmac, randomBytes } from 'node:crypto';
import { safeEqual } from '../crypto/index.js';

// RFC 4648 base32 (no padding) — the form authenticator apps and otpauth:// URIs use for the secret.
const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32Encode(buf) {
  let bits = 0, val = 0, out = '';
  for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += ALPH[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += ALPH[(val << (5 - bits)) & 31];
  return out;
}
export function base32Decode(str) {
  const s = String(str).toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  let bits = 0, val = 0; const out = [];
  for (const ch of s) { const i = ALPH.indexOf(ch); if (i < 0) continue; val = (val << 5) | i; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } }
  return Buffer.from(out);
}

/** A fresh 160-bit secret, base32-encoded (the size RFC 6238 recommends for SHA-1). */
export function generateSecret(bytes = 20) { return base32Encode(randomBytes(bytes)); }

/** HOTP (RFC 4226): HMAC(key, counter) → dynamic truncation → `digits` decimal digits. */
export function hotp(key, counter, { digits = 6, alg = 'sha1' } = {}) {
  const msg = Buffer.alloc(8); msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac(alg, key).update(msg).digest();
  const off = h[h.length - 1] & 0x0f;                                   // the low 4 bits pick the offset
  const bin = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 10 ** digits).padStart(digits, '0');
}

/** TOTP (RFC 6238): the counter is the number of `step`-second windows since `t0`. */
export function totp(secretB32, { time = Math.floor(Date.now() / 1000), step = 30, t0 = 0, digits = 6, alg = 'sha1' } = {}) {
  return hotp(base32Decode(secretB32), Math.floor((time - t0) / step), { digits, alg });
}

/** Verify a code, allowing ±`window` steps of clock skew. ⇒ { ok, offset } (constant-time compare). */
export function verifyTotp(secretB32, code, { window = 1, time = Math.floor(Date.now() / 1000), step = 30, t0 = 0, digits = 6, alg = 'sha1' } = {}) {
  const given = String(code ?? '').trim();
  for (let w = -window; w <= window; w++) {
    const expect = totp(secretB32, { time: time + w * step, step, t0, digits, alg });
    if (given.length === expect.length && safeEqual(given, expect)) return { ok: true, offset: w };
  }
  return { ok: false };
}

/** The otpauth:// URI an authenticator app scans as a QR code. */
export function otpauthURI({ secret, label, issuer = 'LabFlow', digits = 6, step = 30, alg = 'SHA1' }) {
  const q = new URLSearchParams({ secret, issuer, algorithm: alg, digits: String(digits), period: String(step) });
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(label)}?${q}`;
}
