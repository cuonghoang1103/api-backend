// lab1/starter/index.js — Lab 1: LabFlow ID's toolkit of primitives. Replace every TODO; keep the exported names.
// Grade it:  node scripts/cham-lab-1.mjs lab1/starter      (10 points, pass = 7)
import { randomBytes, createHash, createHmac, timingSafeEqual } from 'node:crypto';

/** "<prefix>_<base64url of `bytes` random bytes>". prefix like "lfid_ses" (lowercase, digits, single underscores).
 *  Bad prefix ⇒ TypeError. bytes not an integer ≥ 16 ⇒ RangeError. */
export function newToken(prefix, bytes = 32) {
  throw new Error('TODO newToken');
}

/** SHA-256 of the token, lowercase hex (64 chars) — what the database stores. */
export function tokenDigest(token) {
  throw new Error('TODO tokenDigest');
}

/** true only if a and b are equal strings. Any lengths, never throws, time must not depend on where they differ. */
export function safeEqual(a, b) {
  throw new Error('TODO safeEqual');
}

/** "<base64url(value)>.<exp unix seconds>.<kid>.<base64url HMAC-SHA256(keys[kid], first three parts)>". */
export function signValue(value, { keys, kid, ttlSec, now = Date.now() }) {
  throw new Error('TODO signValue');
}

/** The value, or null: changed, expired (now ≥ exp), unknown kid, malformed — never throws. Check the signature first. */
export function verifyValue(signed, { keys, now = Date.now() }) {
  throw new Error('TODO verifyValue');
}

/** Deep copy; every key not in `allow` becomes "[redacted]"; arrays and nested objects are walked; input not changed. */
export function redact(value, allow) {
  throw new Error('TODO redact');
}
