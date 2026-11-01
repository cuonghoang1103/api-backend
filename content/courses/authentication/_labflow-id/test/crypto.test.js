// test/crypto.test.js — the toolkit of Chapter 1, pinned by tests (npm test). Later chapters keep these green.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { newToken, tokenDigest, safeEqual, signValue, verifyValue, redact } from '../src/crypto/index.js';

const KEYS = { k1: 'demo-key-one-not-secret', k2: 'demo-key-two-not-secret' };
const NOW = Date.UTC(2026, 10, 1, 6, 0, 0);

test('newToken: prefix + 43 base64url chars, and checks its arguments', () => {
  assert.match(newToken('lfid_ses'), /^lfid_ses_[A-Za-z0-9_-]{43}$/);
  assert.throws(() => newToken('LFID'), TypeError);
  assert.throws(() => newToken('lfid_ses', 8), RangeError);
});

test('tokenDigest is SHA-256 hex', () => {
  assert.equal(tokenDigest('abc'), createHash('sha256').update('abc').digest('hex'));
});

test('safeEqual: equal, different, different lengths, not strings', () => {
  assert.equal(safeEqual('lfid_ses_x', 'lfid_ses_x'), true);
  assert.equal(safeEqual('lfid_ses_x', 'lfid_ses_y'), false);
  assert.equal(safeEqual('lfid_ses_x', 'lfid_ses_xx'), false);
  assert.equal(safeEqual(undefined, undefined), false);
});

test('signed value: round trip, tampering, expiry boundary', () => {
  const s = signValue('usr_1', { keys: KEYS, kid: 'k1', ttlSec: 900, now: NOW });
  assert.equal(verifyValue(s, { keys: KEYS, now: NOW + 899_000 }), 'usr_1');
  assert.equal(verifyValue(s, { keys: KEYS, now: NOW + 900_000 }), null);
  const [, exp, kid, sig] = s.split('.');
  assert.equal(verifyValue([Buffer.from('usr_3').toString('base64url'), exp, kid, sig].join('.'), { keys: KEYS, now: NOW }), null);
});

test('signed value: key rotation and malformed input', () => {
  const old = signValue('usr_1', { keys: KEYS, kid: 'k1', ttlSec: 60, now: NOW });
  assert.equal(verifyValue(old, { keys: KEYS, now: NOW }), 'usr_1');
  assert.equal(verifyValue(old, { keys: { k2: KEYS.k2 }, now: NOW }), null);
  for (const bad of ['', 'a.b.c', undefined, 42]) assert.equal(verifyValue(bad, { keys: KEYS, now: NOW }), null);
});

test('redact keeps only allowed keys, deeply', () => {
  assert.deepEqual(redact({ body: { email: 'a', password: 'p' } }, ['body', 'email']), { body: { email: 'a', password: '[redacted]' } });
});
