/**
 * crypto — application-level symmetric encryption (AES-256-GCM).
 *
 * A tiny, dependency-free helper for encrypting small values "at
 * rest": third-party tokens, phone numbers, private note bodies,
 * or any field we want unreadable in a DB dump. It is the same
 * primitive the FPT exam client uses to seal a `.dat` answer file
 * — one secret key, GCM authenticated encryption — but wrapped so
 * the four things that are easy to get wrong are handled for you:
 *
 *   1. KEY      — never a raw password. We read a 32-byte key from
 *                 APP_ENCRYPTION_KEY (base64 or hex). Mint one with
 *                 `generateKey()` and paste it into .env.
 *   2. IV/NONCE — a fresh 12-byte random IV per message. Never
 *                 reused with the same key (reuse breaks GCM). It
 *                 is public, so we store it inside the token.
 *   3. AUTH TAG — GCM's 16-byte seal. Any tampering (even 1 flipped
 *                 bit) makes `decrypt()` throw instead of returning
 *                 corrupted plaintext.
 *   4. AAD      — optional "additional authenticated data" you can
 *                 bind the ciphertext to (e.g. a user id), so a blob
 *                 cannot be silently moved to another row and still
 *                 decrypt.
 *
 * IMPORTANT — what this is NOT for:
 *   - User passwords. Those must be HASHED (bcrypt/argon2), never
 *     encrypted — you must never be able to reverse a password.
 *   - Large files / streams. This buffers the whole value in memory.
 *
 * The key is read LAZILY (inside each call), so merely importing
 * this module has zero side effects and cannot affect app startup
 * even if APP_ENCRYPTION_KEY is unset.
 *
 * Token format (single opaque string, safe for a VARCHAR/TEXT
 * column and URL-safe):
 *
 *     v1.<base64url(iv ‖ tag ‖ ciphertext)>
 *
 * The `v1.` prefix lets us rotate algorithms later without
 * guessing how an old value was produced.
 */

import { randomBytes, createCipheriv, createDecipheriv, timingSafeEqual } from 'node:crypto';

const ALGO = 'aes-256-gcm';
const KEY_BYTES = 32; // AES-256
const IV_BYTES = 12; // GCM standard nonce length
const TAG_BYTES = 16; // GCM auth tag
const VERSION = 'v1';

/** Thrown for any encrypt/decrypt failure. Message is safe to log — it never contains plaintext or key material. */
export class CryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptoError';
  }
}

/**
 * Load and validate the AES key from APP_ENCRYPTION_KEY.
 *
 * Accepts base64 (recommended) or hex. Must decode to exactly 32
 * bytes. We do NOT derive from an arbitrary passphrase here: a key
 * is 32 bytes of real entropy, not "hunter2". Use `generateKey()`.
 *
 * Read on every call (not cached at import) so the module has no
 * import-time side effects. The cost is negligible for our volumes.
 */
function loadKey(): Buffer {
  const raw = process.env.APP_ENCRYPTION_KEY;
  if (!raw || !raw.trim()) {
    throw new CryptoError(
      'APP_ENCRYPTION_KEY is not set. Generate one with `generateKey()` and add it to .env.',
    );
  }
  const trimmed = raw.trim();

  // Try base64 first, then hex. Buffer.from is lenient, so we
  // validate the decoded length rather than the input charset.
  let key = Buffer.from(trimmed, 'base64');
  if (key.length !== KEY_BYTES && /^[0-9a-fA-F]+$/.test(trimmed)) {
    key = Buffer.from(trimmed, 'hex');
  }
  if (key.length !== KEY_BYTES) {
    throw new CryptoError(
      `APP_ENCRYPTION_KEY must decode to ${KEY_BYTES} bytes (got ${key.length}). ` +
        'Use `generateKey()` to mint a valid key.',
    );
  }
  return key;
}

/**
 * Mint a fresh 32-byte key, base64-encoded, ready to paste into
 * `.env` as APP_ENCRYPTION_KEY. Run once, store it as a secret,
 * NEVER commit it. Rotating the key makes old ciphertexts
 * undecryptable — re-encrypt data during a rotation window.
 *
 *   node -e "import('./dist/utils/crypto.js').then(m=>console.log(m.generateKey()))"
 */
export function generateKey(): string {
  return randomBytes(KEY_BYTES).toString('base64');
}

/**
 * Encrypt a UTF-8 string. Returns the opaque `v1.…` token.
 *
 * @param plaintext  the value to protect
 * @param aad        optional context to bind (e.g. `user:42`). The
 *                   SAME aad must be supplied to `decrypt()`.
 */
export function encrypt(plaintext: string, aad?: string): string {
  if (typeof plaintext !== 'string') {
    throw new CryptoError('encrypt() expects a string. Use encryptJSON() for objects.');
  }
  const key = loadKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  if (aad) cipher.setAAD(Buffer.from(aad, 'utf8'));

  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const packed = Buffer.concat([iv, tag, ciphertext]);
  return `${VERSION}.${packed.toString('base64url')}`;
}

/**
 * Decrypt a token produced by `encrypt()`. Throws CryptoError if
 * the token is malformed, the key is wrong, the aad does not match,
 * or the data was tampered with — it never returns garbage.
 */
export function decrypt(token: string, aad?: string): string {
  if (typeof token !== 'string' || !token.includes('.')) {
    throw new CryptoError('Malformed token.');
  }
  const [version, payload] = token.split('.', 2);
  if (version !== VERSION || !payload) {
    throw new CryptoError(`Unsupported token version "${version}".`);
  }

  const packed = Buffer.from(payload, 'base64url');
  if (packed.length < IV_BYTES + TAG_BYTES) {
    throw new CryptoError('Token too short.');
  }
  const iv = packed.subarray(0, IV_BYTES);
  const tag = packed.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const ciphertext = packed.subarray(IV_BYTES + TAG_BYTES);

  const key = loadKey();
  const decipher = createDecipheriv(ALGO, key, iv);
  if (aad) decipher.setAAD(Buffer.from(aad, 'utf8'));
  decipher.setAuthTag(tag);

  try {
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  } catch {
    // A failed tag check lands here. Keep the message generic — a
    // detailed reason (bad key vs. tampered vs. wrong aad) would be
    // an oracle. The caller only needs "this did not authenticate".
    throw new CryptoError('Decryption failed: wrong key, wrong aad, or tampered data.');
  }
}

/** Encrypt any JSON-serializable value. Convenience wrapper over `encrypt()`. */
export function encryptJSON<T>(value: T, aad?: string): string {
  return encrypt(JSON.stringify(value), aad);
}

/** Decrypt and JSON.parse a token produced by `encryptJSON()`. */
export function decryptJSON<T>(token: string, aad?: string): T {
  return JSON.parse(decrypt(token, aad)) as T;
}

/** Cheap guard: does this look like one of our tokens? (No decryption, no key needed.) */
export function isEncrypted(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(`${VERSION}.`);
}

/**
 * Constant-time string comparison. Handy when you compare a secret
 * (e.g. a webhook signature) and want to avoid leaking length/lead
 * via early-exit `===`. Returns false on length mismatch.
 */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
