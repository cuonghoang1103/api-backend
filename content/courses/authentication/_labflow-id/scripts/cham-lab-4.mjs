// scripts/cham-lab-4.mjs — the grader of Lab 4 (LabFlow ID's JWT verifier). 9 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-4.mjs <folder with index.js>      e.g.  node scripts/cham-lab-4.mjs lab4/my
// It builds a keyring, mints a battery of 20+ hostile tokens, and asks YOUR verifier to accept the good one and
// reject every bad one. It only CALLS your makeVerifier(); it never edits your files.
import { createHmac } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { eddsa, newEd25519 } from '../src/jwt/keyring.js';
import { sign } from '../src/jwt/sign.js';
import { b64urlJson } from '../src/jwt/base64url.js';

const dir = path.resolve(process.argv[2] ?? 'lab4/my');
const file = path.join(dir, 'index.js');
const m = await import(pathToFileURL(file).href);

const ISSUER = 'https://id.labflow.example', AUDIENCE = 'labflow-api';
const kpA = newEd25519(), kpB = newEd25519();
const keyring = { 'ed-a': eddsa(kpA), 'ed-b': eddsa(kpB) };          // both keys are live (a rotation window, lesson 4.4)
const pemA = kpA.publicKey.export({ type: 'spki', format: 'pem' }); // public — what an attacker downloads from the JWKS
const NOW = Date.UTC(2026, 10, 3, 9, 0, 0), S = Math.floor(NOW / 1000);
const REVOKED = new Set(['jti-revoked']);
const good = { iss: ISSUER, sub: 'usr_3', aud: AUDIENCE, iat: S, nbf: S, exp: S + 900, jti: 'jti-ok', role: 'LAB_MANAGER' };

const mk = (over = {}, kid = 'ed-a') => sign({ ...good, ...over }, { key: keyring[kid], kid });        // validly signed
const mkHeader = (header, payload = good, sig = '') => `${b64urlJson(header)}.${b64urlJson(payload)}.${sig}`;
const hmac = (input, secret) => createHmac('sha256', secret).update(input).digest('base64url');

const V = m.makeVerifier({ keyring, issuer: ISSUER, audience: AUDIENCE, skewSec: 60 });
const run = (token, opts = {}) => V(token, { now: NOW, revoked: REVOKED, ...opts });

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
const rejects = (token, label, opts) => { try { run(token, opts); throw Object.assign(new Error(`accepted ${label}`), { name: 'Expected' }); } catch (e) { if (e.name === 'Expected') throw e; } };
const ctl = () => expect(run(mk()).sub === 'usr_3', 'the valid control token was rejected — a verifier that rejects everything is not a verifier');
async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : `your code threw ${e?.name ?? 'Error'}: ${String(e?.message ?? e).split('\n')[0]}`; }
  results.push({ name, points, ok: !why, why });
}

// ── T1 a valid token is accepted, from either live key ──
await check('T1 a valid token is accepted and its claims returned', 1, () => {
  const p = run(mk());
  expect(p && p.sub === 'usr_3' && p.role === 'LAB_MANAGER', 'a correct token did not return sub/role');
  expect(run(mk({}, 'ed-b')).sub === 'usr_3', 'a token signed with the other live key (kid ed-b) was not accepted');
});

// ── T2 alg: none ──
await check('T2 the "none" algorithm is rejected', 1.5, () => {
  ctl();
  rejects(mkHeader({ alg: 'none', typ: 'JWT', kid: 'ed-a' }), 'alg:none with empty signature');
  rejects(mkHeader({ alg: 'none', typ: 'JWT', kid: 'ed-a' }, good, 'AAAA'), 'alg:none with junk signature');
  rejects(mkHeader({ alg: 'None', typ: 'JWT', kid: 'ed-a' }), 'alg:None (capitalised)');
  rejects(mkHeader({ alg: 'nOnE', typ: 'JWT', kid: 'ed-a' }), 'alg:nOnE (mixed case)');
});

// ── T3 HS/RS algorithm confusion ──
await check('T3 HS256 signed with the public key is rejected (algorithm confusion)', 1.5, () => {
  ctl();
  const input = `${b64urlJson({ alg: 'HS256', typ: 'JWT', kid: 'ed-a' })}.${b64urlJson(good)}`;
  rejects(`${input}.${hmac(input, pemA)}`, 'HS256 HMACed with the EdDSA public key (PEM)');
  const inputRaw = `${b64urlJson({ alg: 'HS256', typ: 'JWT', kid: 'ed-a' })}.${b64urlJson(good)}`;
  rejects(`${inputRaw}.${hmac(inputRaw, kpA.publicKey.export({ type: 'spki', format: 'der' }))}`, 'HS256 HMACed with the raw public key bytes');
});

// ── T4 the kid must name a key we hold ──
await check('T4 unknown, missing or path-like kid is rejected', 1, () => {
  ctl();
  rejects(mkHeader({ alg: 'EdDSA', typ: 'JWT', kid: 'ed-x' }, good, mk().split('.')[2]), 'a kid not in the keyring');
  rejects(mkHeader({ alg: 'EdDSA', typ: 'JWT' }, good, mk().split('.')[2]), 'a token with no kid at all');
  const trav = `${b64urlJson({ alg: 'HS256', typ: 'JWT', kid: '../../package.json' })}.${b64urlJson(good)}`;
  rejects(`${trav}.${hmac(trav, fs.readFileSync('package.json'))}`, 'a kid pointing at a file (path traversal)');
});

// ── T5 a changed token is rejected ──
await check('T5 a tampered payload or a swapped signature is rejected', 1, () => {
  ctl();
  const t = mk(); const [h, , s] = t.split('.');
  rejects(`${h}.${b64urlJson({ ...good, role: 'LAB_MANAGER', sub: 'usr_1' })}.${s}`, 'a rewritten payload with the old signature');
  const other = mk({ jti: 'jti-other' });
  rejects(`${h}.${t.split('.')[1]}.${other.split('.')[2]}`, 'a signature taken from another token');
});

// ── T6 exp is a boundary, with clock skew ──
await check('T6 exp: expired is rejected, within clock skew is accepted', 1, () => {
  ctl();
  rejects(mk({ exp: S - 86400 }), 'a token that expired a day ago');
  rejects(mk({ exp: S - 61 }), 'a token 61 s past exp (beyond the 60 s skew)');
  expect(run(mk({ exp: S - 30 })).sub === 'usr_3', 'a token 30 s past exp should pass within the 60 s skew');
  rejects(mk({ exp: undefined }), 'a token with no exp at all (a stolen token that never dies)');
});

// ── T7 nbf ──
await check('T7 a token not yet valid (nbf in the future) is rejected', 0.5, () => {
  ctl();
  rejects(mk({ nbf: S + 120 }), 'a token whose nbf is 2 minutes in the future');
});

// ── T8 iss / aud / sub ──
await check('T8 wrong issuer, audience or missing subject is rejected', 1.5, () => {
  ctl();
  rejects(mk({ iss: 'https://evil.example' }), 'a token from another issuer');
  rejects(mk({ aud: 'labflow-chat' }), 'a token minted for another audience');
  rejects(mk({ aud: ['labflow-chat', 'labflow-admin'] }), 'an aud array that does not include us');
  rejects(mk({ sub: undefined }), 'a token with no subject');
  expect(run(mk({ aud: ['labflow-chat', AUDIENCE] })).sub === 'usr_3', 'an aud array that DOES include us should be accepted');
});

// ── T9 revocation ──
await check('T9 a revoked or jti-less token is rejected', 1, () => {
  ctl();
  rejects(mk({ jti: 'jti-revoked' }), 'a token whose jti is on the denylist');
  rejects(mk({ jti: undefined }), 'a token with no jti (cannot be revoked or replay-checked)');
});

const src = fs.readFileSync(file, 'utf8');
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 4 — ${path.relative(process.cwd(), file)}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(68)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
if (/header\.alg|\balg\b\s*===|payload\.alg/.test(src) && !/key\.alg|entry\.alg|\.alg\s*!==\s*key/.test(src))
  console.log('! your source compares the token\'s header.alg — pick the algorithm from the KEY you looked up by kid, not from the token');
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
