// src/crypto/tokens.js — lessons 1.2 and 1.3: random tokens and how to store them.
import { randomBytes, createHash } from 'node:crypto';

const PREFIX = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/; // lfid_ses, lfid_key, lfid_reset …

/** A new random token: "<prefix>_<43 base64url chars>" = 32 bytes = 256 bits from the OS CSPRNG. */
export function newToken(prefix, bytes = 32) {
  if (typeof prefix !== 'string' || !PREFIX.test(prefix)) throw new TypeError(`bad token prefix: ${prefix}`);
  if (!Number.isInteger(bytes) || bytes < 16) throw new RangeError('a token needs at least 16 random bytes (128 bits)');
  return `${prefix}_${randomBytes(bytes).toString('base64url')}`;
}

/** What the database stores instead of the token: its SHA-256, hex. Fine for random tokens — NOT for passwords (Chapter 2). */
export function tokenDigest(token) {
  return createHash('sha256').update(token).digest('hex');
}
