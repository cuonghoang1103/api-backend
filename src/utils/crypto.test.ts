/**
 * AES-256-GCM helper unit tests. Run with the built-in node:test
 * runner via tsx (`npx tsx --test src/utils/crypto.test.ts`).
 *
 * No DB, no network — the only "environment" is APP_ENCRYPTION_KEY,
 * which we mint per-run so the suite is self-contained and never
 * depends on a developer's .env.
 *
 * These guard the four properties that make the scheme worth using:
 * confidentiality, non-determinism (fresh IV), integrity (tamper
 * detection), and context binding (aad).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  encrypt,
  decrypt,
  encryptJSON,
  decryptJSON,
  generateKey,
  isEncrypted,
  safeEqual,
  CryptoError,
} from './crypto.js';

// Self-contained key for the whole suite.
process.env.APP_ENCRYPTION_KEY = generateKey();

test('round-trip: decrypt(encrypt(x)) === x', () => {
  const secret = 'so dien thoai: 0912345678';
  assert.equal(decrypt(encrypt(secret)), secret);
});

test('round-trip survives unicode (tieng Viet + kana + emoji)', () => {
  const s = 'Xin chào — 日本語のテスト 🎌 ǎéîõü';
  assert.equal(decrypt(encrypt(s)), s);
});

test('ciphertext hides the plaintext', () => {
  const token = encrypt('DAP-AN-BI-MAT');
  assert.ok(!token.includes('DAP-AN-BI-MAT'));
  assert.ok(isEncrypted(token));
});

test('same input encrypted twice yields different tokens (fresh IV)', () => {
  const a = encrypt('same');
  const b = encrypt('same');
  assert.notEqual(a, b, 'IV reuse would make these identical — that is the bug we prevent');
  assert.equal(decrypt(a), decrypt(b));
});

test('tampering with one byte is detected', () => {
  const token = encrypt('so du: 1000000');
  const [v, payload] = token.split('.', 2);
  const bytes = Buffer.from(payload, 'base64url');
  bytes[bytes.length - 1] ^= 0x01; // flip a single bit of ciphertext
  const tampered = `${v}.${bytes.toString('base64url')}`;
  assert.throws(() => decrypt(tampered), CryptoError);
});

test('wrong key cannot decrypt', () => {
  const token = encrypt('bi mat');
  const good = process.env.APP_ENCRYPTION_KEY;
  process.env.APP_ENCRYPTION_KEY = generateKey();
  assert.throws(() => decrypt(token), CryptoError);
  process.env.APP_ENCRYPTION_KEY = good;
});

test('aad binds ciphertext to its context', () => {
  const token = encrypt('note cua user 42', 'user:42');
  assert.equal(decrypt(token, 'user:42'), 'note cua user 42');
  // Moving the blob to another user's row must fail, not silently decrypt.
  assert.throws(() => decrypt(token, 'user:43'), CryptoError);
  assert.throws(() => decrypt(token), CryptoError);
});

test('JSON helpers round-trip objects', () => {
  const payload = { studentId: 'HE176322', answers: { q1: 'B', q2: 'A' }, score: null };
  const token = encryptJSON(payload);
  assert.deepEqual(decryptJSON<typeof payload>(token), payload);
});

test('malformed tokens throw CryptoError, never return garbage', () => {
  assert.throws(() => decrypt('not-a-token'), CryptoError);
  assert.throws(() => decrypt('v1.'), CryptoError);
  assert.throws(() => decrypt('v2.abcdef'), CryptoError);
  assert.throws(() => decrypt('v1.AAAA'), CryptoError); // shorter than iv+tag
});

test('missing / bad key gives an actionable error', () => {
  const good = process.env.APP_ENCRYPTION_KEY;
  delete process.env.APP_ENCRYPTION_KEY;
  assert.throws(() => encrypt('x'), /APP_ENCRYPTION_KEY is not set/);
  process.env.APP_ENCRYPTION_KEY = 'too-short';
  assert.throws(() => encrypt('x'), /must decode to 32 bytes/);
  process.env.APP_ENCRYPTION_KEY = good;
});

test('generateKey produces a 32-byte base64 key', () => {
  assert.equal(Buffer.from(generateKey(), 'base64').length, 32);
  assert.notEqual(generateKey(), generateKey());
});

test('isEncrypted only matches our tokens', () => {
  assert.equal(isEncrypted(encrypt('x')), true);
  assert.equal(isEncrypted('plain text'), false);
  assert.equal(isEncrypted(null), false);
  assert.equal(isEncrypted(12345), false);
});

test('safeEqual compares without early exit', () => {
  assert.equal(safeEqual('abc123', 'abc123'), true);
  assert.equal(safeEqual('abc123', 'abc124'), false);
  assert.equal(safeEqual('abc', 'abcdef'), false); // length mismatch, no throw
});
