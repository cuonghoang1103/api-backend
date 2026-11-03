/**
 * _ma.mjs (Chương 4) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  base64url: `// src/jwt/base64url.js — lesson 4.1: a JWT is three base64url strings. Nothing here is encryption.
// base64url is plain base64 with +/ replaced by -_ and the = padding dropped (RFC 7515 §2, RFC 4648 §5).

/** Encode a Buffer or a string as base64url (no padding). */
export function b64url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf8');
  return buf.toString('base64url'); // Node knows base64url since v14 — identical to the hand-rolled replace
}

/** Encode a JS value as the base64url of its JSON — used for the header and the payload. */
export const b64urlJson = (obj) => b64url(JSON.stringify(obj));

/** Decode a base64url string back to a Buffer. Anyone can do this; it proves nothing. */
export const unb64url = (s) => Buffer.from(String(s), 'base64url');

/** Split "header.payload.signature" and decode the two JSON parts WITHOUT checking the signature.
 *  This is exactly what an attacker — or your browser's devtools — can read. Never trust it. */
export function decodeJwt(token) {
  const parts = String(token).split('.');
  if (parts.length !== 3) throw new TypeError('a JWS compact token has three dot-separated parts');
  const [h, p, s] = parts;
  return {
    header: JSON.parse(unb64url(h).toString('utf8')),
    payload: JSON.parse(unb64url(p).toString('utf8')),
    signingInput: \`\${h}.\${p}\`, // the bytes the signature actually covers
    signature: s,              // still base64url; meaningless until verified
  };
}`,
  sign: `// src/jwt/sign.js — lesson 4.1: build a JWS compact token by hand. header.payload.signature, each base64url.
import { b64urlJson } from './base64url.js';

/** key: a keyring entry (keyring.js); kid: its id, copied into the header so the verifier knows which key to use. */
export function sign(payload, { key, kid }) {
  const header = { alg: key.alg, typ: 'JWT', ...(kid ? { kid } : {}) };
  const signingInput = \`\${b64urlJson(header)}.\${b64urlJson(payload)}\`;
  return \`\${signingInput}.\${key.sign(signingInput)}\`;
}`,
  keyring: `// src/jwt/keyring.js — lessons 4.1, 4.2, 4.4: the keys LabFlow ID signs and verifies with.
// A keyring is { kid: entry }. Each entry knows ONE algorithm and how to sign/verify with it. The verifier
// chooses the algorithm from the KEY it looked up by kid, never from the token's header — that is what makes
// "alg: none" and HS↔RS confusion (lesson 4.2) impossible.
import { createHmac, timingSafeEqual, sign as nodeSign, verify as nodeVerify, generateKeyPairSync } from 'node:crypto';
import { unb64url } from './base64url.js';

/** A symmetric HS256 key — HMAC-SHA256 (lesson 1.4). One secret signs AND verifies: only its holder can do either. */
export function hs256(secret) {
  return {
    alg: 'HS256',
    sign: (input) => createHmac('sha256', secret).update(input).digest('base64url'),
    verify(input, sig) {
      const want = createHmac('sha256', secret).update(input).digest();
      const got = unb64url(sig);
      return got.length === want.length && timingSafeEqual(got, want); // constant time, same length (lesson 1.3)
    },
  };
}

/** An asymmetric EdDSA (Ed25519) key — LabFlow ID's production default. The PRIVATE key signs; the PUBLIC key,
 *  which anyone may hold, only verifies. Ed25519 signatures are a fixed 64 raw bytes — no DER, no curve tricks. */
export function eddsa({ publicKey, privateKey }) {
  return {
    alg: 'EdDSA',
    sign: (input) => nodeSign(null, Buffer.from(input), privateKey).toString('base64url'),
    verify: (input, sig) => { try { return nodeVerify(null, Buffer.from(input), publicKey, unb64url(sig)); } catch { return false; } },
    publicKey, // kept so lesson 4.4 can publish it as a JWKS
  };
}

/** A fresh Ed25519 key pair (KeyObjects). */
export const newEd25519 = () => generateKeyPairSync('ed25519');`,
  verify: `// src/jwt/verify.js — lessons 4.2 and 4.3: ONE strict verifier. The order of the checks is the lesson.
import { decodeJwt } from './base64url.js';

/** Thrown with a stable .code so callers log a reason without leaking it to the client. */
export class JwtError extends Error {
  constructor(code) { super(code); this.name = 'JwtError'; this.code = code; }
}

/**
 * Verify a LabFlow ID token, or throw a JwtError.
 *   keyring   { kid: entry }  — the only keys we accept (keyring.js)
 *   issuer    string          — exact iss we require
 *   audience  string          — must appear in aud
 *   now       ms               — inject in tests
 *   skewSec   seconds of clock skew allowed on exp/nbf (default 60; RFC 7519 lets each side pick "a small leeway")
 *   revoked   Set of jti that must be rejected (lesson 4.3; the denylist Chapter 5 fills)
 */
export function verify(token, { keyring, issuer, audience, now = Date.now(), skewSec = 60, revoked = new Set() }) {
  let d;
  try { d = decodeJwt(token); } catch { throw new JwtError('MALFORMED'); }
  const { header, payload, signingInput, signature } = d;

  // 1) ALGORITHM — decided by the key we hold, never by the attacker-supplied header.
  //    This one rule defeats "alg": "none" (there is no key whose alg is none) and HS/RS confusion
  //    (a token claiming HS256 against an EdDSA kid is an ALG_MISMATCH, so the public key is never used as an HMAC secret).
  if (header.typ && header.typ !== 'JWT') throw new JwtError('BAD_TYP');
  if (!header.kid) throw new JwtError('NO_KID');
  const key = keyring[header.kid]; // a plain object lookup — NEVER a file path (lesson 4.4: kid path traversal)
  if (!key) throw new JwtError('UNKNOWN_KID');
  if (header.alg !== key.alg) throw new JwtError('ALG_MISMATCH');

  // 2) SIGNATURE — before any claim is trusted.
  if (!key.verify(signingInput, signature)) throw new JwtError('BAD_SIGNATURE');

  // 3) CLAIMS — the seven of lesson 4.3. Only now is the payload trustworthy.
  const nowSec = Math.floor(now / 1000);
  if (payload.iss !== issuer) throw new JwtError('BAD_ISS');                 // who minted it
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(audience)) throw new JwtError('BAD_AUD');                // who it is for
  if (typeof payload.sub !== 'string' || !payload.sub) throw new JwtError('NO_SUB'); // who it is about
  if (typeof payload.exp !== 'number' || nowSec - skewSec >= payload.exp) throw new JwtError('EXPIRED');
  if (typeof payload.nbf === 'number' && nowSec + skewSec < payload.nbf) throw new JwtError('NOT_YET');
  if (typeof payload.iat !== 'number') throw new JwtError('NO_IAT');
  if (!payload.jti) throw new JwtError('NO_JTI');
  if (revoked.has(payload.jti)) throw new JwtError('REVOKED');
  return payload;
}`,
  indexJwt: `// src/jwt/index.js — LabFlow ID v0.4: issue and verify its own access tokens (Chapter 4).
// A short-lived JWT access token says "the bearer is user X, proven at time T, for 15 minutes". Chapter 5 adds the
// long-lived refresh token and rotation; Chapter 8 turns this issuer into an OpenID Connect provider for LabFlow API.
import { randomBytes } from 'node:crypto';
import { sign } from './sign.js';
import { verify, JwtError } from './verify.js';

export { sign } from './sign.js';
export { verify, JwtError } from './verify.js';
export { decodeJwt, b64url, b64urlJson, unb64url } from './base64url.js';
export { hs256, eddsa, newEd25519 } from './keyring.js';

export const ACCESS_TTL_SEC = 15 * 60; // 15 minutes — the number the whole platform shares (lesson 1.1, api-design 6.1)

/**
 * An issuer over a keyring with a current signing kid.
 *   keyring   { kid: entry }   — all keys that are still trusted to VERIFY (old + new during a rotation, lesson 4.4)
 *   activeKid                  — the key new tokens are SIGNED with
 *   issuer, audience           — the fixed iss and aud of this deployment
 */
export function accessTokens({ keyring, activeKid, issuer, audience, ttlSec = ACCESS_TTL_SEC, now = () => Date.now(), skewSec = 60 }) {
  const revoked = new Set(); // jti denylist (process-local for now; Chapter 11 moves it to Redis)

  function issue(userId, { role, ttl = ttlSec } = {}) {
    const iat = Math.floor(now() / 1000);
    const payload = {
      iss: issuer, sub: userId, aud: audience,          // who minted it / who it is about / who it is for
      iat, nbf: iat, exp: iat + ttl,                    // when it was minted / is valid from / expires
      jti: randomBytes(16).toString('base64url'),       // a unique id, so one token can be revoked (lesson 4.3)
      ...(role ? { role } : {}),
    };
    return sign(payload, { key: keyring[activeKid], kid: activeKid });
  }

  const check = (token, opts = {}) => verify(token, { keyring, issuer, audience, now: now(), skewSec, revoked, ...opts });
  const revoke = (jti) => revoked.add(jti);
  return { issue, verify: check, revoke, revoked, keyring, activeKid };
}`,
  jwks: `// src/jwt/jwks.js — lesson 4.4: publish the PUBLIC half of the signing keys as a JWKS, and cross-check our own
// EdDSA tokens against the \`jose\` library. A JWKS (JSON Web Key Set) is the standard way a verifier discovers a
// signer's public keys by kid; Chapter 8 serves it at /.well-known/jwks.json for LabFlow API to fetch.
import { exportJWK, importJWK, jwtVerify, SignJWT } from 'jose';

/** Turn our keyring (keyring.js) into a public JWKS: one JWK per EdDSA key, each carrying its kid and use. */
export async function publicJwks(keyring) {
  const keys = [];
  for (const [kid, entry] of Object.entries(keyring)) {
    if (entry.alg !== 'EdDSA' || !entry.publicKey) continue; // never publish HS256 secrets — they verify AND sign
    const jwk = await exportJWK(entry.publicKey);            // { kty:'OKP', crv:'Ed25519', x:'…' } — public only
    keys.push({ ...jwk, kid, use: 'sig', alg: 'EdDSA' });
  }
  return { keys };
}

/** A verifier that resolves a token's kid against a JWKS object (what a CLIENT of LabFlow ID does). */
export function jwksVerifier(jwks) {
  const byKid = new Map(jwks.keys.map((k) => [k.kid, k]));
  return async (token, { issuer, audience }) => {
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
    const jwk = byKid.get(header.kid);
    if (!jwk) throw new Error('unknown kid — not in the JWKS');
    const key = await importJWK(jwk, 'EdDSA');
    const { payload } = await jwtVerify(token, key, { issuer, audience, algorithms: ['EdDSA'] });
    return payload;
  };
}

/** Sign a token with \`jose\` (to prove our hand-rolled verifier accepts a standard library's output, and vice versa). */
export async function signWithJose(payload, { privateKey, kid, issuer, audience, ttlSec = 900 }) {
  return new SignJWT({ ...(payload.role ? { role: payload.role } : {}) })
    .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT', kid })
    .setIssuer(issuer).setSubject(payload.sub).setAudience(audience)
    .setIssuedAt().setNotBefore('0s').setExpirationTime(\`\${ttlSec}s\`).setJti(payload.jti ?? crypto.randomUUID())
    .sign(privateKey);
}`,
  naive: `// demo4/_naive.mjs — the WRONG verifier, kept as a teaching foil (lesson 4.2). It does what tutorials and early
// JWT libraries did: it reads the ALGORITHM FROM THE TOKEN and uses one blob of "key material" for whatever the
// token asks for. Every attack in lesson 4.2 is an attack on exactly this habit.
import { createHmac, createPublicKey, verify as nodeVerify, timingSafeEqual } from 'node:crypto';

export function verifyNaive(token, keyMaterial) {
  const [h, p, s] = token.split('.');
  const header = JSON.parse(Buffer.from(h, 'base64url').toString());
  const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
  const input = \`\${h}.\${p}\`;
  if (header.alg === 'none') return payload;                       // "unsecured JWT" (RFC 7519 §6) — accepted blindly
  if (header.alg === 'HS256') {                                    // symmetric: the key both signs and verifies
    const want = createHmac('sha256', keyMaterial).update(input).digest();
    const got = Buffer.from(s, 'base64url');
    if (got.length !== want.length || !timingSafeEqual(got, want)) throw new Error('bad signature');
    return payload;
  }
  if (header.alg === 'EdDSA') {                                    // asymmetric: verify with the public key
    const pub = typeof keyMaterial === 'string' ? createPublicKey(keyMaterial) : keyMaterial;
    if (!nodeVerify(null, Buffer.from(input), pub, Buffer.from(s, 'base64url'))) throw new Error('bad signature');
    return payload;
  }
  throw new Error(\`unsupported alg \${header.alg}\`);
}`,
  server04: `// src/server.js — LabFlow ID v0.4 (end of Chapter 4). Fixed so far:
//   hole 1 — argon2id in PostgreSQL, measured parameters, upgrade on login (Chapter 2);
//   hole 3 — CSPRNG session ids, only their SHA-256 stored (Chapter 1);
//   hole 4 — sessions end: idle 30 min, absolute 12 h, sign-out, sign-out-everywhere (lesson 3.1);
//   hole 5 — the session travels in a __Host- cookie JavaScript cannot read, never in a JSON body (3.2); CSRF checked (3.4).
// New in Chapter 4: LabFlow ID now ISSUES its own short-lived JWT access tokens for LabFlow API — EdDSA (Ed25519),
//   a kid in every header, the seven registered claims, and a public JWKS at /.well-known/jwks.json. The session
//   proves who you are to LabFlow ID; the access token proves it to a DIFFERENT service, for 15 minutes (lesson 4.5).
// Still open: the sign-up half of hole 2 (Chapter 6) and hole 6, unlimited guessing (Chapter 10). Never deploy this file.
import express from 'express';
import { users } from './users.js';
import { hashPassword, verifyPassword, checkNewPassword, loadBlocklist, pwnedCount, signIn } from './passwords/index.js';
import { sessionLayer, pgStore } from './sessions/index.js';
import { accessTokens, eddsa, newEd25519, ACCESS_TTL_SEC } from './jwt/index.js';
import { publicJwks } from './jwt/jwks.js';
import { log, requestLog } from './log.js';

const BLOCKLIST = loadBlocklist();
const sessions = sessionLayer({ store: pgStore, touchEveryMs: Number(process.env.TOUCH_EVERY_MS ?? 60e3) });

// The signing key. In production this is loaded from a secret and rotated (lesson 4.4); for a demo we mint one at
// boot, so every restart publishes a new JWKS — which is exactly why a client must FETCH the JWKS, not hard-code a key.
const ACTIVE_KID = process.env.JWT_KID ?? 'ed-2026-11';
const keyring = { [ACTIVE_KID]: eddsa(newEd25519()) };
const ISSUER = process.env.JWT_ISSUER ?? 'https://id.labflow.example';
const AUDIENCE = process.env.JWT_AUDIENCE ?? 'labflow-api';
const tokens = accessTokens({ keyring, activeKid: ACTIVE_KID, issuer: ISSUER, audience: AUDIENCE });

const app = express();
app.use(requestLog);
app.use(express.json({ limit: '8kb' }));
app.use(sessions.load);   // req.session = the row, or null
app.use(sessions.csrf);   // POST/PUT/PATCH/DELETE must come from our own origin

const needSession = (req, res, next) => (req.session ? next() : res.status(401).json({ error: 'Not signed in' }));

app.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body ?? {};
  const problems = checkNewPassword(password, { email, blocklist: BLOCKLIST });
  if (!problems.length) {
    const seen = await pwnedCount(password);
    if (seen > 0) problems.push('BREACHED');
    if (seen === null) log.warn('pwned-passwords check unavailable; accepted without it');
  }
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  const user = await users.create({ email, name, passwordHash: await hashPassword(password) });
  res.status(201).json({ id: user.id });
});

app.post('/sign-in', async (req, res) => {
  const { email, password } = req.body ?? {};
  const { user, error } = await signIn(users, email, password);
  if (error) return res.status(401).json({ error: 'Email or password is incorrect' });
  const common = BLOCKLIST.has(password.normalize('NFC').toLowerCase());
  if (common) await users.flagMustChange(user.id);
  await sessions.start(req, res, user.id);   // new session id, old one destroyed; the token goes in a cookie only
  res.json({ ok: true, mustChangePassword: user.mustChangePassword || common });
});

app.get('/me', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  res.json({ id: u.id, email: u.email, name: u.name, role: u.role });
});

// lesson 4.1–4.5: mint an access token for ANOTHER service (LabFlow API). The session says who you are HERE; the
// access token carries that fact, signed, to a service that trusts our JWKS. 15 minutes — the platform-wide number.
app.post('/token', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  const access = tokens.issue(u.id, { role: u.role });
  res.json({ access_token: access, token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, scope: AUDIENCE });
});

// lesson 4.4: the public keys, by kid. A client (LabFlow API, Chapter 8) fetches this and caches it. Public only.
app.get('/.well-known/jwks.json', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(await publicJwks(keyring));
});

// lesson 3.4: the classic CSRF target — change the email, then "forgot password" takes the account
app.post('/me/email', needSession, async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!/^[^@\\s]+@[^@\\s]+$/.test(email)) return res.status(422).json({ error: 'BAD_EMAIL' });
  await users.updateEmail(req.session.userId, email);
  res.json({ ok: true, email });
});

// lesson 3.3: prove the current password again, change it, sign out every other device, start a fresh session
app.post('/me/password', needSession, async (req, res) => {
  const { current, next: pw } = req.body ?? {};
  const u = await users.findById(req.session.userId);
  if (!(await verifyPassword(u.passwordHash, String(current ?? ''))).ok) return res.status(403).json({ error: 'REAUTH_FAILED' });
  const problems = checkNewPassword(pw, { email: u.email, blocklist: BLOCKLIST });
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  await users.updateHash(u.id, await hashPassword(pw));
  const ended = await sessions.endAll(u.id);
  await sessions.start(req, res, u.id);
  res.json({ ok: true, signedOutSessions: ended });
});

app.post('/sign-out', async (req, res) => { await sessions.end(req, res); res.json({ ok: true }); });
app.post('/sign-out-everywhere', needSession, async (req, res) => {
  res.json({ ok: true, ended: await sessions.endAll(req.session.userId) });
});

app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? 'INTERNAL' }));

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(\`LabFlow ID v0.4 on http://localhost:\${port} (JWKS kid \${ACTIVE_KID})\`));`,
  grader: `// scripts/cham-lab-4.mjs — the grader of Lab 4 (LabFlow ID's JWT verifier). 9 checks, 10 points, pass = 7.
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
const mkHeader = (header, payload = good, sig = '') => \`\${b64urlJson(header)}.\${b64urlJson(payload)}.\${sig}\`;
const hmac = (input, secret) => createHmac('sha256', secret).update(input).digest('base64url');

const V = m.makeVerifier({ keyring, issuer: ISSUER, audience: AUDIENCE, skewSec: 60 });
const run = (token, opts = {}) => V(token, { now: NOW, revoked: REVOKED, ...opts });

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
const rejects = (token, label, opts) => { try { run(token, opts); throw Object.assign(new Error(\`accepted \${label}\`), { name: 'Expected' }); } catch (e) { if (e.name === 'Expected') throw e; } };
const ctl = () => expect(run(mk()).sub === 'usr_3', 'the valid control token was rejected — a verifier that rejects everything is not a verifier');
async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : \`your code threw \${e?.name ?? 'Error'}: \${String(e?.message ?? e).split('\\n')[0]}\`; }
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
  const input = \`\${b64urlJson({ alg: 'HS256', typ: 'JWT', kid: 'ed-a' })}.\${b64urlJson(good)}\`;
  rejects(\`\${input}.\${hmac(input, pemA)}\`, 'HS256 HMACed with the EdDSA public key (PEM)');
  const inputRaw = \`\${b64urlJson({ alg: 'HS256', typ: 'JWT', kid: 'ed-a' })}.\${b64urlJson(good)}\`;
  rejects(\`\${inputRaw}.\${hmac(inputRaw, kpA.publicKey.export({ type: 'spki', format: 'der' }))}\`, 'HS256 HMACed with the raw public key bytes');
});

// ── T4 the kid must name a key we hold ──
await check('T4 unknown, missing or path-like kid is rejected', 1, () => {
  ctl();
  rejects(mkHeader({ alg: 'EdDSA', typ: 'JWT', kid: 'ed-x' }, good, mk().split('.')[2]), 'a kid not in the keyring');
  rejects(mkHeader({ alg: 'EdDSA', typ: 'JWT' }, good, mk().split('.')[2]), 'a token with no kid at all');
  const trav = \`\${b64urlJson({ alg: 'HS256', typ: 'JWT', kid: '../../package.json' })}.\${b64urlJson(good)}\`;
  rejects(\`\${trav}.\${hmac(trav, fs.readFileSync('package.json'))}\`, 'a kid pointing at a file (path traversal)');
});

// ── T5 a changed token is rejected ──
await check('T5 a tampered payload or a swapped signature is rejected', 1, () => {
  ctl();
  const t = mk(); const [h, , s] = t.split('.');
  rejects(\`\${h}.\${b64urlJson({ ...good, role: 'LAB_MANAGER', sub: 'usr_1' })}.\${s}\`, 'a rewritten payload with the old signature');
  const other = mk({ jti: 'jti-other' });
  rejects(\`\${h}.\${t.split('.')[1]}.\${other.split('.')[2]}\`, 'a signature taken from another token');
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
console.log(\`Lab 4 — \${path.relative(process.cwd(), file)}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(68)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
if (/header\\.alg|\\balg\\b\\s*===|payload\\.alg/.test(src) && !/key\\.alg|entry\\.alg|\\.alg\\s*!==\\s*key/.test(src))
  console.log('! your source compares the token\\'s header.alg — pick the algorithm from the KEY you looked up by kid, not from the token');
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  yeu: `// lab4/yeu/index.js — a first attempt that "works": it signs people in and rejects a tampered token. It verifies
// the signature and calls it a day — the mistake almost every first JWT integration makes.
import { decodeJwt } from '../../src/jwt/base64url.js';

export function makeVerifier({ keyring, issuer, audience, skewSec = 60 }) {
  return (token, { now = Date.now(), revoked = new Set() } = {}) => {
    const { header, payload, signingInput, signature } = decodeJwt(token);
    if (header.alg === 'none') return payload;          // "the token says it is unsigned, so there is nothing to check"
    const key = keyring[header.kid];
    if (key && !key.verify(signingInput, signature)) throw new Error('bad signature');
    return payload;                                     // signature checks out ⇒ trusted. But which claims?
  };
}`,
};
export const OUT = {
  '41-decode': `$ node demo4/decode.mjs
three parts, separated by dots:
  header    62 chars base64url
  payload   231 chars base64url
  signature 86 chars base64url

anyone can base64url-decode the first two — no key needed:
  header  = {"alg":"EdDSA","typ":"JWT","kid":"ed-2026-11"}
  payload = {"iss":"https://id.labflow.example","sub":"usr_3","aud":"labflow-api","iat":1793717464,"nbf":1793717464,"exp":1793718364,"jti":"m7-82UglD30voOFGUFkmIw","role":"LAB_MANAGER"}

the payload is NOT encrypted. A JWT hides nothing; it only proves it was not changed.
  jose decodeJwt (no verify) sees the same sub: usr_3
  jose decodeProtectedHeader alg/kid         : {"alg":"EdDSA","typ":"JWT","kid":"ed-2026-11"}

our own decodeJwt returns the signing input the signature actually covers:
  signingInput = 294 bytes = 294 (header.payload)
  signature is 64 raw bytes (Ed25519 is always 64)`,
  '41-issue': `$ bash demo4/issue.sh
$ curl -s -b jar -X POST localhost:4800/token
{"access_token":"eyJhbGciOiJFZERTQSIsInR5…","token_type":"Bearer","expires_in":900,"scope":"labflow-api"}

$ # the client splits the access_token and reads the payload (no key needed):
  header : {"alg":"EdDSA","typ":"JWT","kid":"ed-2026-11"}
  payload: {"iss":"https://id.labflow.example","sub":"usr_1","aud":"labflow-api","iat":1793717527,"nbf":1793717527,"exp":1793718427,"jti":"l3PygcMWXbUzXmn8CP1XCg","role":"STUDENT"}

$ curl -s localhost:4800/.well-known/jwks.json
{"keys":[{"crv":"Ed25519","x":"6uNYOMSpy1rE8KLTbEGE…","kty":"OKP","kid":"ed-2026-11","use":"sig","alg":"EdDSA"}]}`,
  '41-tamper': `$ node demo4/tamper.mjs
An has a valid token, verified:
  sub = usr_1 / role = STUDENT

the attacker rewrites role=LAB_MANAGER and keeps the old signature:
  forged payload decodes to role = LAB_MANAGER (they can write anything here)
  verify → BAD_SIGNATURE — the signature covers the payload, so editing it breaks it`,
  '42-confusion': `$ node demo4/confusion.mjs
the server publishes an Ed25519 public key (not secret). The attacker signs HS256 with that PEM:

a verifier that picks the algorithm from the token, keyed with the public key:
  ACCEPTED → forged usr_3 as LAB_MANAGER — the public key became a shared secret

LabFlow ID's verifier — kid ed-2026-11 is declared EdDSA, the header says HS256:
  rejected → ALG_MISMATCH`,
  '42-none': `$ node demo4/alg-none.mjs
forged token header : {"alg":"none","typ":"JWT","kid":"ed-2026-11"}
forged token claims : sub = usr_3 role = LAB_MANAGER (no signature at all)

a verifier that trusts the header (demo4/_naive.mjs):
  ACCEPTED → the attacker is usr_3 as LAB_MANAGER — account takeover

LabFlow ID's verifier (src/jwt/verify.js) — the algorithm comes from the KEY, not the token:
  rejected → ALG_MISMATCH (kid ed-2026-11 is an EdDSA key; "none" is not EdDSA)`,
  '43-claims': `$ node demo4/claims.mjs
a correct token first:
all seven claims present                     → accepted

now remove one claim at a time — each omission is a real attack:
no iss (token from another issuer)           → rejected BAD_ISS
no sub (who is it even about?)               → rejected NO_SUB
no aud (minted for labflow-chat, used here)  → rejected BAD_AUD
no exp (a stolen token never dies)           → rejected EXPIRED
no iat (cannot reason about age)             → rejected NO_IAT
no jti (cannot revoke or detect replay)      → rejected NO_JTI

and the ones that are present but wrong:
iss = https://evil.example                   → rejected BAD_ISS
aud = labflow-chat                           → rejected BAD_AUD
aud is an array incl. labflow-api            → accepted`,
  '43-exp': `$ node demo4/exp-skew.mjs
token valid from 09:00:00, exp 09:15:00 (900 s). skewSec = 0 (strict):
  at 09:14:59 (exp − 1 s) : accepted
  at 09:15:00 (exp exactly): rejected EXPIRED   ← exp == now is already expired
  at 09:15:01 (exp + 1 s) : rejected EXPIRED

real deployments allow a little clock skew. skewSec = 60:
  at 09:15:30 (30 s late) : accepted   ← within the 60 s leeway
  at 09:16:01 (61 s late) : rejected EXPIRED

nbf (not before) 09:02:00, skewSec = 60:
  at 09:00:30 (90 s early): rejected NOT_YET
  at 09:01:05 (55 s early): accepted   ← inside the leeway`,
  '43-revoke': `$ node demo4/revoke.mjs
issued a token, jti = 2ZZqbE5RuHTvzErbVkOTBg
  verify → usr_3 (accepted)

added the jti to the denylist (one Set.add):
  verify → rejected REVOKED

but a SECOND service shares the key (same JWKS) and keeps its OWN, empty denylist:
  it still accepts the revoked token until it expires (15 min) — the JWT trade-off vs a session DELETE`,
  '44-jose': `$ node demo4/jose.mjs
our EdDSA token, verified by jose : sub = usr_3 role = LAB_MANAGER
jose EdDSA token, verified by ours : sub = usr_1 role = STUDENT

both directions pass ⇒ LabFlow ID speaks the same JWS/JWT as any compliant client (RFC 7515, 7519).`,
  '44-jwks': `$ node demo4/jwks.mjs
GET /.well-known/jwks.json  (public — safe to cache and share):
  { kty: "OKP", crv: "Ed25519", kid: "ed-2026-11",
    use: "sig", alg: "EdDSA", x: "MCF3TNPOfjncRyEY1Vr6…" }
  no "d" field — the private half never leaves LabFlow ID.

LabFlow API fetches that JWKS once, then verifies tokens by the kid in each header:
  token kid = ed-2026-11 → matched a JWK → verified. sub = usr_3 role = LAB_MANAGER

a token whose kid is not in the JWKS is rejected before any crypto runs:
  rejected: unknown kid — not in the JWKS`,
  '44-kid': `$ node demo4/kid-traversal.mjs
happy path — a real token with kid "hs-main":
  verifyByKidPath → usr_1 (accepted)

attack — kid = "../package.json" (a file whose bytes the attacker can read):
  verifyByKidPath → ACCEPTED, forged usr_3 as LAB_MANAGER — the kid chose the key

LabFlow ID — kid is a key in a plain object, never a path:
  rejected → UNKNOWN_KID
  keyring holds exactly: [ 'ed-2026-11' ]`,
  '44-perf': `$ node demo4/perf.mjs
ops/sec over 20000 iterations, 3 rounds (macOS arm64, Node 22.23.3):
alg     sig bytes        sign/s (r1·r2·r3)                 verify/s (r1·r2·r3)
HS256    32           784,798 · 804,461 · 829,589       794,797 · 820,946 · 831,641
EdDSA    64           33,455 · 33,933 · 34,513          11,814 · 11,874 · 11,861
ES256    70           49,518 · 49,003 · 49,617          17,573 · 17,537 · 17,670
RS256   256           1,765 · 1,762 · 1,762             60,901 · 59,115 · 60,687`,
  '44-rotate': `$ node demo4/rotate.mjs
day 1: token signed with kid ed-2026-10 → usr_1 (accepted)

day 2: publish both keys in the JWKS, still sign with the old one — clients pick up the new key
  new tokens signed with kid ed-2026-11 → usr_1 (accepted)
  old tokens (kid ed-2026-10) still    → usr_1 (accepted — no one is signed out)

day 3: 15 min after the switch, remove the old key from the JWKS
  an old token now → UNKNOWN_KID (its kid is gone)
  new tokens → usr_1 (accepted)`,
  '45-storage': `$ node demo4/storage-xss.mjs
what the injected script could read on the page:
  localStorage.lfid.access : eyJhbGciOiJFZERTQSIsInR5… ← STOLEN
  document.cookie          : lfid_access_readable=eyJhbGciOiJF…
    → contains lfid_access_readable?  true (plain cookie: STOLEN)
    → contains lfid_access_httponly?  false (HttpOnly: invisible to JS)

the attacker collector on :4801 received: {"localStorage":"eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI…`,
  'lab-bat-dau': `$ node scripts/cham-lab-4.mjs lab4/starter
Lab 4 — lab4/starter/index.js
✗ T1 a valid token is accepted and its claims returned                 0/1
    ↳ your code threw Error: not implemented
✗ T2 the "none" algorithm is rejected                                  0/1.5
    ↳ your code threw Error: not implemented
✗ T3 HS256 signed with the public key is rejected (algorithm confusion) 0/1.5
    ↳ your code threw Error: not implemented
✗ T4 unknown, missing or path-like kid is rejected                     0/1
    ↳ your code threw Error: not implemented
✗ T5 a tampered payload or a swapped signature is rejected             0/1
    ↳ your code threw Error: not implemented
✗ T6 exp: expired is rejected, within clock skew is accepted           0/1
    ↳ your code threw Error: not implemented
✗ T7 a token not yet valid (nbf in the future) is rejected             0/0.5
    ↳ your code threw Error: not implemented
✗ T8 wrong issuer, audience or missing subject is rejected             0/1.5
    ↳ your code threw Error: not implemented
✗ T9 a revoked or jti-less token is rejected                           0/1
    ↳ your code threw Error: not implemented
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test 2>&1 | grep -v 'npm notice'

> labflow-id@0.3.0 test
> node --test --test-reporter=spec "test/**/*.test.js"

✔ newToken: prefix + 43 base64url chars, and checks its arguments (0.811708ms)
✔ tokenDigest is SHA-256 hex (0.315042ms)
✔ safeEqual: equal, different, different lengths, not strings (0.196666ms)
✔ signed value: round trip, tampering, expiry boundary (0.358042ms)
✔ signed value: key rotation and malformed input (0.169875ms)
✔ redact keeps only allowed keys, deeply (0.406292ms)
✔ issue + verify: round trip with the seven claims (1.513375ms)
✔ alg: none is rejected (algorithm comes from the key, not the header) (0.327333ms)
✔ HS/RS confusion is rejected (public key used as an HMAC secret) (1.086666ms)
✔ unknown or missing kid is rejected (0.192542ms)
✔ tampered payload is rejected (signature covers header.payload) (0.327875ms)
✔ claims: iss, aud, sub, exp, nbf, iat, jti each enforced (1.361625ms)
✔ exp boundary and clock skew (0.542917ms)
✔ revocation by jti (0.309834ms)
✔ key rotation: two live keys verify, a dropped key does not (0.765125ms)
✔ interop with jose (both directions) (6.757708ms)
✔ hash is argon2id with the measured parameters and a fresh salt (153.145792ms)
✔ NFC: precomposed and decomposed Vietnamese verify the same (151.494375ms)
✔ bcrypt verifies and asks for a rehash; a wrong password never does (205.906209ms)
✔ policy: length, blocklist, context — no composition rules (0.701083ms)
✔ signIn: one answer for both failures, upgrade on success (369.2825ms)
✔ cookie: __Host- prefix, HttpOnly, Secure, SameSite=Lax, Path=/ (1.025375ms)
✔ sign-in replaces a planted session (fixation) (0.324875ms)
✔ idle 30 min and absolute 12 h (0.832083ms)
✔ csrf: cross-site and foreign Origin get 403; same-origin and non-browser clients pass (0.1515ms)
ℹ tests 25
ℹ suites 0
ℹ pass 25
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1027.359542`,
  'lab-tham-khao': `$ node scripts/cham-lab-4.mjs lab4/tham-khao
Lab 4 — lab4/tham-khao/index.js
✓ T1 a valid token is accepted and its claims returned                 1/1
✓ T2 the "none" algorithm is rejected                                  1.5/1.5
✓ T3 HS256 signed with the public key is rejected (algorithm confusion) 1.5/1.5
✓ T4 unknown, missing or path-like kid is rejected                     1/1
✓ T5 a tampered payload or a swapped signature is rejected             1/1
✓ T6 exp: expired is rejected, within clock skew is accepted           1/1
✓ T7 a token not yet valid (nbf in the future) is rejected             0.5/0.5
✓ T8 wrong issuer, audience or missing subject is rejected             1.5/1.5
✓ T9 a revoked or jti-less token is rejected                           1/1
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-4.mjs lab4/yeu
Lab 4 — lab4/yeu/index.js
✓ T1 a valid token is accepted and its claims returned                 1/1
✗ T2 the "none" algorithm is rejected                                  0/1.5
    ↳ accepted alg:none with empty signature
✓ T3 HS256 signed with the public key is rejected (algorithm confusion) 1.5/1.5
✗ T4 unknown, missing or path-like kid is rejected                     0/1
    ↳ accepted a kid not in the keyring
✓ T5 a tampered payload or a swapped signature is rejected             1/1
✗ T6 exp: expired is rejected, within clock skew is accepted           0/1
    ↳ accepted a token that expired a day ago
✗ T7 a token not yet valid (nbf in the future) is rejected             0/0.5
    ↳ accepted a token whose nbf is 2 minutes in the future
✗ T8 wrong issuer, audience or missing subject is rejected             0/1.5
    ↳ accepted a token from another issuer
✗ T9 a revoked or jti-less token is rejected                           0/1
    ↳ accepted a token whose jti is on the denylist
! your source compares the token's header.alg — pick the algorithm from the KEY you looked up by kid, not from the token
TOTAL 3.5/10 — NOT YET (pass = 7)`,
};
