// lab7/starter/index.js — Lab 7 starter. Write TOTP from scratch (RFC 6238 over RFC 4226). No library.
//   base32Encode(buf) / base32Decode(str)  — RFC 4648 base32, no padding
//   hotp(key, counter, { digits, alg })     — HMAC(key, 8-byte counter) → dynamic truncation → `digits` digits
//   totp(secretB32, { time, step, t0, digits, alg }) — counter = floor((time - t0) / step)
//   verifyTotp(secretB32, code, { window, time, step, ... }) — accept ±window steps of skew; ⇒ { ok, offset }
// You may use node:crypto (createHmac). Do NOT import ../../src/totp — that is the answer.
import { createHmac } from 'node:crypto';

export function base32Encode(buf) { throw new Error('not implemented'); }
export function base32Decode(str) { throw new Error('not implemented'); }
export function hotp(key, counter, { digits = 6, alg = 'sha1' } = {}) { throw new Error('not implemented'); }
export function totp(secretB32, opts = {}) { throw new Error('not implemented'); }
export function verifyTotp(secretB32, code, opts = {}) { throw new Error('not implemented'); }
