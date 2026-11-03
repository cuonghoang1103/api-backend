// test/jwt.test.js — Chapter 4's JWT module, pinned by tests (npm test, no database).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { accessTokens, eddsa, hs256, newEd25519, sign, decodeJwt, b64urlJson, JwtError } from '../src/jwt/index.js';
import { verify } from '../src/jwt/verify.js';
import { publicJwks, jwksVerifier, signWithJose } from '../src/jwt/jwks.js';

const ISS = 'https://id.labflow.example', AUD = 'labflow-api';
const kp = newEd25519();
const keyring = { 'ed-1': eddsa(kp) };
const NOW = Date.UTC(2026, 10, 3, 9, 0, 0);
const iss = accessTokens({ keyring, activeKid: 'ed-1', issuer: ISS, audience: AUD, now: () => NOW });

test('issue + verify: round trip with the seven claims', () => {
  const t = iss.issue('usr_3', { role: 'LAB_MANAGER' });
  const p = iss.verify(t);
  assert.equal(p.sub, 'usr_3');
  assert.equal(p.role, 'LAB_MANAGER');
  for (const c of ['iss', 'sub', 'aud', 'iat', 'nbf', 'exp', 'jti']) assert.ok(c in p, `missing claim ${c}`);
  assert.equal(decodeJwt(t).header.alg, 'EdDSA');
});

test('alg: none is rejected (algorithm comes from the key, not the header)', () => {
  const claims = { ...decodeJwt(iss.issue('usr_1')).payload, sub: 'usr_3', role: 'LAB_MANAGER' };
  const forged = `${b64urlJson({ alg: 'none', typ: 'JWT', kid: 'ed-1' })}.${b64urlJson(claims)}.`;
  assert.throws(() => iss.verify(forged), (e) => e instanceof JwtError && e.code === 'ALG_MISMATCH');
});

test('HS/RS confusion is rejected (public key used as an HMAC secret)', () => {
  const pem = kp.publicKey.export({ type: 'spki', format: 'pem' });
  const claims = { ...decodeJwt(iss.issue('usr_1')).payload, role: 'LAB_MANAGER' };
  const input = `${b64urlJson({ alg: 'HS256', typ: 'JWT', kid: 'ed-1' })}.${b64urlJson(claims)}`;
  const forged = `${input}.${createHmac('sha256', pem).update(input).digest('base64url')}`;
  assert.throws(() => iss.verify(forged), (e) => e.code === 'ALG_MISMATCH');
});

test('unknown or missing kid is rejected', () => {
  const t = iss.issue('usr_1');
  const [, p, s] = t.split('.');
  const badKid = `${b64urlJson({ alg: 'EdDSA', typ: 'JWT', kid: 'ed-x' })}.${p}.${s}`;
  const noKid = `${b64urlJson({ alg: 'EdDSA', typ: 'JWT' })}.${p}.${s}`;
  assert.throws(() => iss.verify(badKid), (e) => e.code === 'UNKNOWN_KID');
  assert.throws(() => iss.verify(noKid), (e) => e.code === 'NO_KID');
});

test('tampered payload is rejected (signature covers header.payload)', () => {
  const t = iss.issue('usr_1', { role: 'STUDENT' });
  const [h, , s] = t.split('.');
  const forged = `${h}.${b64urlJson({ ...decodeJwt(t).payload, role: 'LAB_MANAGER' })}.${s}`;
  assert.throws(() => iss.verify(forged), (e) => e.code === 'BAD_SIGNATURE');
});

test('claims: iss, aud, sub, exp, nbf, iat, jti each enforced', () => {
  const base = { iss: ISS, sub: 'usr_1', aud: AUD, iat: Math.floor(NOW / 1000), nbf: Math.floor(NOW / 1000), exp: Math.floor(NOW / 1000) + 900, jti: 'j' };
  const tok = (over) => sign({ ...base, ...over }, { key: keyring['ed-1'], kid: 'ed-1' });
  const bad = { iss: ['https://evil', 'BAD_ISS'], aud: ['other', 'BAD_AUD'], sub: [undefined, 'NO_SUB'], exp: [undefined, 'EXPIRED'], iat: [undefined, 'NO_IAT'], jti: [undefined, 'NO_JTI'] };
  for (const [claim, [val, code]] of Object.entries(bad)) {
    assert.throws(() => verify(tok({ [claim]: val }), { keyring, issuer: ISS, audience: AUD, now: NOW }), (e) => e.code === code, `${claim} → ${code}`);
  }
  assert.equal(verify(tok({}), { keyring, issuer: ISS, audience: AUD, now: NOW }).sub, 'usr_1');
});

test('exp boundary and clock skew', () => {
  const t = iss.issue('usr_1');
  const exp = decodeJwt(t).payload.exp * 1000;
  assert.equal(verify(t, { keyring, issuer: ISS, audience: AUD, now: exp - 1000, skewSec: 0 }).sub, 'usr_1');
  assert.throws(() => verify(t, { keyring, issuer: ISS, audience: AUD, now: exp, skewSec: 0 }), (e) => e.code === 'EXPIRED');
  assert.equal(verify(t, { keyring, issuer: ISS, audience: AUD, now: exp + 30_000, skewSec: 60 }).sub, 'usr_1');
  assert.throws(() => verify(t, { keyring, issuer: ISS, audience: AUD, now: exp + 61_000, skewSec: 60 }), (e) => e.code === 'EXPIRED');
});

test('revocation by jti', () => {
  const t = iss.issue('usr_1');
  assert.equal(iss.verify(t).sub, 'usr_1');
  iss.revoke(decodeJwt(t).payload.jti);
  assert.throws(() => iss.verify(t), (e) => e.code === 'REVOKED');
});

test('key rotation: two live keys verify, a dropped key does not', () => {
  const kpB = newEd25519();
  const ring2 = { 'ed-1': eddsa(kp), 'ed-2': eddsa(kpB) };
  const iss2 = accessTokens({ keyring: ring2, activeKid: 'ed-2', issuer: ISS, audience: AUD, now: () => NOW });
  const old = iss.issue('usr_1');            // signed with ed-1
  assert.equal(iss2.verify(old).sub, 'usr_1'); // ed-1 still in the ring
  const only2 = accessTokens({ keyring: { 'ed-2': eddsa(kpB) }, activeKid: 'ed-2', issuer: ISS, audience: AUD, now: () => NOW });
  assert.throws(() => only2.verify(old), (e) => e.code === 'UNKNOWN_KID');
});

test('interop with jose (both directions)', async () => {
  // jose verifies against the real wall clock, so issue with the real clock here (not the fixed NOW above).
  const issNow = accessTokens({ keyring, activeKid: 'ed-1', issuer: ISS, audience: AUD });
  const t = issNow.issue('usr_3', { role: 'LAB_MANAGER' });
  const viaJose = await jwksVerifier(await publicJwks(keyring))(t, { issuer: ISS, audience: AUD });
  assert.equal(viaJose.sub, 'usr_3');
  const theirs = await signWithJose({ sub: 'usr_1', role: 'STUDENT' }, { privateKey: kp.privateKey, kid: 'ed-1', issuer: ISS, audience: AUD });
  assert.equal(issNow.verify(theirs).sub, 'usr_1');
});
