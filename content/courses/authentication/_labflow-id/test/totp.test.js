// test/totp.test.js — TOTP (RFC 4226/6238 vectors) + recovery codes. No database.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { base32Encode, hotp, totp, verifyTotp } from '../src/totp/index.js';
import { generateRecoveryCodes, consumeRecoveryCode } from '../src/totp/recovery.js';

const KEY = Buffer.from('12345678901234567890');
const B32 = base32Encode(KEY);

test('HOTP matches the RFC 4226 test vectors', () => {
  const want = ['755224', '287082', '359152', '969429', '338314', '254676', '287922', '162583', '399871', '520489'];
  want.forEach((w, c) => assert.equal(hotp(KEY, c, { digits: 6 }), w));
});

test('TOTP matches the RFC 6238 test vectors (SHA-1, 8 digits)', () => {
  for (const [t, w] of [[59, '94287082'], [1111111109, '07081804'], [1111111111, '14050471'], [1234567890, '89005924'], [2000000000, '69279037'], [20000000000, '65353130']])
    assert.equal(totp(B32, { time: t, digits: 8 }), w);
});

test('verifyTotp accepts ±1 step of skew and rejects beyond', () => {
  const now = 1700000055;
  assert.equal(verifyTotp(B32, totp(B32, { time: now - 30 }), { time: now, window: 1 }).ok, true);
  assert.equal(verifyTotp(B32, totp(B32, { time: now }), { time: now, window: 1 }).offset, 0);
  assert.equal(verifyTotp(B32, totp(B32, { time: now - 90 }), { time: now, window: 1 }).ok, false);
  assert.equal(verifyTotp(B32, '', { time: now }).ok, false);
});

test('recovery codes are single-use and stored only as digests', () => {
  const { codes, digests } = generateRecoveryCodes(10);
  assert.equal(codes.length, 10);
  assert.ok(!digests.includes(codes[0]));                       // the digest is not the code
  let r = consumeRecoveryCode(codes[2], digests);
  assert.equal(r.ok, true); assert.equal(r.remaining.length, 9);
  assert.equal(consumeRecoveryCode(codes[2], r.remaining).ok, false);   // spent
});
