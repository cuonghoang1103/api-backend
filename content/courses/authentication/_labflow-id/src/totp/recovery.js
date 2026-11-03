// src/totp/recovery.js — recovery codes: the way back in when the phone with the authenticator is lost (lesson 7.3).
// Each code is high-entropy random, shown ONCE at enrollment, and stored only as a SHA-256 digest (like every other
// credential, lesson 1.3). Consuming one is single-use and constant-time. Reusing a spent code fails.
import { randomInt, createHash } from 'node:crypto';
import { safeEqual } from '../crypto/index.js';

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';   // no l/o/0/1 — unambiguous when a human copies it down
const digest = (code) => createHash('sha256').update(code.replace(/-/g, '').toLowerCase()).digest('hex');

/** Make `count` codes, formatted xxxx-xxxx. Returns the plaintext (show once) and the digests (store these). */
export function generateRecoveryCodes(count = 10, groups = 2, size = 4) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const parts = [];
    for (let g = 0; g < groups; g++) { let s = ''; for (let k = 0; k < size; k++) s += ALPHABET[randomInt(ALPHABET.length)]; parts.push(s); }
    codes.push(parts.join('-'));
  }
  return { codes, digests: codes.map(digest) };
}

/** Consume a presented code against the stored digests. ⇒ { ok, index } and the remaining digests (the spent one removed). */
export function consumeRecoveryCode(presented, storedDigests) {
  const want = digest(String(presented ?? ''));
  let hit = -1;
  for (let i = 0; i < storedDigests.length; i++) if (safeEqual(storedDigests[i], want)) hit = i;   // scan all: constant-ish time
  if (hit < 0) return { ok: false, remaining: storedDigests };
  return { ok: true, index: hit, remaining: storedDigests.filter((_, i) => i !== hit) };   // single-use: drop it
}

export { digest as recoveryDigest };
