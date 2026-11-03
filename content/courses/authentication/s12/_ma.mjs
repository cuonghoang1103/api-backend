/**
 * _ma.mjs (Chương 12) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  grader_cuoi: `// scripts/cham-cuoi-khoa.mjs — the final-project grader. It runs ~12 real attack scenarios against a submission's
// LabFlow ID v1.0 posture (one per chapter of the course) and scores 100 points; pass = 70. A weak submission scores
// low; the reference scores 100. Run: node scripts/cham-cuoi-khoa.mjs sub-cuoi/tham-khao
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const S = await import(pathToFileURL(path.resolve(process.argv[2] ?? 'sub-cuoi/my', 'index.js')).href);
const results = [];
const E = (c) => { if (!c) throw new Error('x'); };
const scen = (ch, name, pts, fn) => { let ok = false; try { ok = fn() !== false; } catch { ok = false; } results.push({ ch, name, pts, ok }); };

// Ch2 — a dumped database (DB dump): a weak/old stored hash must be flagged for upgrade.
scen('Ch2', 'DB dump: weak stored hash flagged + argon2id in use', 8, () =>
  S.passwordScheme === 'argon2id' && S.needsRehash('sha1$deadbeef') === true && S.needsRehash('$argon2id$v=19$m=65536,t=2,p=1$aaaa$bbbb') === false);
// Ch6 — email-enumeration by timing/message: sign-up says the same thing whether the email exists or not.
scen('Ch6', 'Email enumeration: identical sign-up message either way', 8, () =>
  S.signupMessage(true) === S.signupMessage(false) && S.signupMessage(true).length > 0);
// Ch6 — confusable/homograph email: a full-width look-alike must NFKC-fold to the same address (lowercase alone misses it).
scen('Ch6', 'Homograph email: full-width look-alike folds together', 8, () =>
  S.normalizeEmail('ａn@labflow.example') === S.normalizeEmail('an@labflow.example'));
// Ch1/3 — session guessing: the session id must be unguessable (high-entropy CSPRNG).
scen('Ch1/3', 'Session guessing: high-entropy session id', 8, () => Number(S.sessionIdEntropyBits) >= 128);
// Ch4 — alg:none / algorithm confusion: a token must be rejected unless its alg is the expected one.
scen('Ch4', 'alg:none rejected; only the expected algorithm accepted', 9, () =>
  S.acceptAlg('none', 'EdDSA') === false && S.acceptAlg('HS256', 'EdDSA') === false && S.acceptAlg('EdDSA', 'EdDSA') === true);
// Ch5 — refresh-token reuse: a replayed refresh revokes the whole family.
scen('Ch5', 'Refresh reuse: replay revokes the token family', 8, () => S.refreshReuseAction() === 'revoke_family');
// Ch3 — CSRF / cookie posture: HttpOnly + Secure + __Host- + SameSite not None.
scen('Ch3', 'Cookie posture: HttpOnly, Secure, __Host-, SameSite≠None', 9, () => {
  const c = S.cookieAttrs() || {}; return c.httpOnly === true && c.secure === true && c.hostPrefix === true && c.sameSite !== 'None';
});
// Ch8 — forged ID token: a token whose signature is invalid must be rejected (all seven checks).
scen('Ch8', 'Forged ID token: bad signature rejected', 9, () => {
  const ctx = { signatureValid: false, expectedIssuer: 'iss', expectedAudience: 'aud', nonce: 'n', now: 1000 };
  const r = S.verifyIdToken({ iss: 'iss', aud: 'aud', nonce: 'n', exp: 2000, iat: 900, sub: 'u1' }, ctx);
  return r && r.ok !== true && !!r.error;
});
// Ch7/10 — TOTP relay / phishing: only an origin-bound passkey is phishing-resistant, TOTP is not.
scen('Ch7/10', 'Phishing: passkey resists a relay, TOTP does not', 8, () =>
  S.phishingResistant('passkey') === true && S.phishingResistant('totp') === false);
// Ch9 — IDOR / cross-tenant: an admin from another tenant must be denied (tenant checked first).
scen('Ch9', 'IDOR/cross-tenant: other-tenant admin denied', 9, () => {
  const bk = { tenantId: 'fpt-hcm', ownerId: 'u1', departmentId: 'se' };
  return S.can({ id: 'u0', role: 'ADMIN', tenantId: 'fpt-hn', departmentId: null }, 'booking:cancel', bk) === false
      && S.can({ id: 'u1', role: 'STUDENT', tenantId: 'fpt-hcm', departmentId: 'se' }, 'booking:create', bk) === true;
});
// Ch10 — 10k credential-stuffing spray: a flooding IP is blocked, a mistyping real user is NOT.
scen('Ch10', '10k stuffing: flood blocked, real user not locked out', 8, () =>
  S.decide({ accountFails: 0, ipFails: 100, ipAccounts: 0, breached: false, solvedChallenge: false }) === 'block'
  && S.decide({ accountFails: 999, ipFails: 0, ipAccounts: 0, breached: false, solvedChallenge: false }) !== 'block');
// Ch11 — audit log leak: a logged event must never contain a token or password.
scen('Ch11', 'Audit log: a logged event leaks no token or password', 8, () => {
  const a = S.safeAudit({ ts: 1, actor: 'u1', action: 'login_ok', outcome: 'ok', ip: '1.2.3.4', token: 'SECRET-tok', password: 'SECRET-pw' });
  return !JSON.stringify(a).includes('SECRET');
});

const total = results.reduce((s, r) => s + (r.ok ? r.pts : 0), 0);
console.log(\`Final project — \${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'sub-cuoi/my', 'index.js'))}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} [\${r.ch.padEnd(6)}] \${r.name.padEnd(54)} \${r.ok ? r.pts : 0}/\${r.pts}\`);
console.log(\`TOTAL \${total}/100 — \${total >= 70 ? 'PASS' : 'NOT YET (pass = 70)'}\`);
process.exit(total >= 70 ? 0 : 1);`,
  thamkhao_cuoi: `// sub-cuoi/tham-khao/index.js — the reference LabFlow ID v1.0 posture: every decision wired to the hardened module the
// course built. cham-cuoi-khoa.mjs runs ~12 real attack scenarios against this; the reference scores 100/100.
export { needsRehash } from '../../src/passwords/index.js';     // Chapter 2 — flag an old/weak stored hash
export { normalizeEmail } from '../../src/email/normalize.js';  // Chapter 6 — fold confusables so two "same" emails collide
export { verifyIdToken } from '../../src/oidc/verify.js';       // Chapter 8 — the seven ID-token checks
export { can } from '../../src/authz/policy.js';                // Chapter 9 — tenant-first authorization gate
export { decide } from '../../src/defense/stuffing.js';         // Chapter 10 — credential-stuffing defence
export { safeAudit } from '../../src/ops/audit.js';             // Chapter 11 — audit entry that leaks nothing

// Posture declarations — the production choices the course argued for.
export const passwordScheme = 'argon2id';                       // Chapter 2
export const sessionIdEntropyBits = 256;                        // Chapter 1/3 — CSPRNG, unguessable
export function signupMessage() {                               // Chapter 6 — enumeration-safe: SAME message either way
  return 'If that email is not already registered, we have sent a verification link.';
}
export function acceptAlg(alg, expected) {                       // Chapter 4 — reject alg:none and algorithm confusion
  if (alg === 'none') return false;
  return alg === expected;
}
export function refreshReuseAction() { return 'revoke_family'; } // Chapter 5 — a replayed refresh revokes the whole family
export function cookieAttrs() {                                  // Chapter 3 — the one safe place for a session
  return { httpOnly: true, secure: true, sameSite: 'Lax', hostPrefix: true };
}
export function phishingResistant(factor) { return factor === 'passkey'; }  // Chapter 7/10 — only origin-bound survives a relay
export const secretsFromEnv = true;                             // Chapter 11 — secrets from the environment, never the repo`,
  yeu_cuoi: `// sub-cuoi/yeu/index.js — a WEAK LabFlow ID: it gets the "basics" right (modern hashing, cookie flags, refresh reuse)
// but misses the hardening the course spent its later chapters on. It runs and passes a happy-path demo, yet fails
// most of the 12 attack scenarios. Expected grade: measurably low — well under the 70 pass line.
export { needsRehash } from '../../src/passwords/index.js';     // ✓ Ch2 — got hashing right
export const passwordScheme = 'argon2id';                       // ✓ Ch2
export function cookieAttrs() { return { httpOnly: true, secure: true, sameSite: 'Lax', hostPrefix: true }; } // ✓ Ch3
export function refreshReuseAction() { return 'revoke_family'; } // ✓ Ch5

export function normalizeEmail(raw) { return String(raw).toLowerCase(); }  // ❌ lowercase only — homographs slip through (Ch6)
export function verifyIdToken(payload) { return { ok: true, sub: payload && payload.sub }; }  // ❌ trusts any token, no signature check (Ch8)
export function can() { return true; }                          // ❌ allows everything — no tenant, no role (Ch9)
export function decide() { return 'allow'; }                    // ❌ never challenges or blocks a spray (Ch10)
export function safeAudit(event) { return { ...event }; }       // ❌ logs the whole event, secrets and all (Ch11)
export const sessionIdEntropyBits = 32;                         // ❌ guessable session id (Ch1/3)
export function signupMessage(exists) { return exists ? 'Email already registered' : 'Verification sent'; } // ❌ enumeration (Ch6)
export function acceptAlg() { return true; }                    // ❌ accepts alg:none (Ch4)
export function phishingResistant(factor) { return factor === 'totp' || factor === 'passkey'; }  // ❌ thinks TOTP resists phishing (Ch7/10)
export const secretsFromEnv = false;                            // (posture, not scored directly)`,
  diagnose: `// demo12/diagnose.mjs — the first five minutes of "users cannot log in" (Chapter 12, 12.1). The fastest signal is the
// HTTP STATUS of the login endpoint on an unauthenticated curl: it tells you which layer is broken before you read a
// line of code. 401/403/404/500/200 each point somewhere different.
const MEANING = {
  200: ['the route works and is public — the problem is AFTER login (session, redirect, the client)', 'look at the client / the next request'],
  401: ['the route is MOUNTED and asking for credentials — auth is wired; a real login should now be tried', 'try a real credential; the pipe is intact'],
  403: ['authenticated but forbidden — an AUTHORIZATION problem (role/tenant), not authentication', 'check the authz gate (Chapter 9), not the password'],
  404: ['the route is NOT MOUNTED — almost always a STALE or partial build, not a code bug', 'redeploy a clean build; the route exists in source but not in the running image'],
  500: ['the server CRASHED handling it — a dependency (DB, Redis, a missing secret) or an unhandled error', 'read the server log and the startup banner (Chapter 11)'],
};
function firstCheck(status) { return MEANING[status] || ['an unexpected status — capture it and the response body', 'widen the net']; }

console.log('"Users cannot log in." First: curl the login route unauthenticated and read the status.\\n');
console.log('  curl -s -o /dev/null -w "%{http_code}" https://id.labflow.example/api/v1/auth/login\\n');
for (const s of [200, 401, 403, 404, 500]) {
  const [meaning, next] = firstCheck(s);
  console.log(\`  \${s} → \${meaning}\`);
  console.log(\`        next: \${next}\\n\`);
}
console.log('⇒ The status narrows the problem to a layer in seconds: 404 = stale build, 500 = crashed dependency,');
console.log('  403 = authorization not authentication, 401 = the pipe is intact so try a real login. Measure before you guess.');`,
  toolbox: `// demo12/toolbox.mjs — the toolbox: answer the question yourself (Chapter 12, 12.3). You do not need the backend team
// to tell you what is in a token or whether a cookie is set right — decode and read it. Pure, no libraries.
const b64urlJson = (seg) => JSON.parse(Buffer.from(seg.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
function decodeJwt(token) { const [h, p] = token.split('.'); return { header: b64urlJson(h), payload: b64urlJson(p) }; }
function tokenState(payload, nowSec) {
  if (payload.exp && nowSec >= payload.exp) return \`EXPIRED \${nowSec - payload.exp}s ago — this is why it is 401\`;
  if (payload.nbf && nowSec < payload.nbf) return 'NOT YET VALID (nbf in the future) — clock skew?';
  return \`valid for \${payload.exp - nowSec}s more\`;
}
function cookieFlags(setCookie) {
  const low = setCookie.toLowerCase();
  return { httpOnly: low.includes('httponly'), secure: low.includes('secure'), sameSite: (setCookie.match(/samesite=(\\w+)/i) || [])[1] || 'none', hostPrefix: setCookie.startsWith('__Host-') };
}

// 1. Decode a JWT without any library (header + payload are just base64url JSON).
const tok = 'eyJhbGciOiJFZERTQSIsImtpZCI6ImsyIn0.eyJzdWIiOiJ1c3JfMSIsImlzcyI6Imh0dHBzOi8vaWQubGFiZmxvdy5leGFtcGxlIiwiZXhwIjoxNzAwMDAwOTAwLCJpYXQiOjE3MDAwMDAwMDB9.SIG';
const { header, payload } = decodeJwt(tok);
console.log('1. Decode the token by hand:');
console.log(\`   header : \${JSON.stringify(header)}\`);
console.log(\`   payload: \${JSON.stringify(payload)}\`);
console.log(\`   state  : \${tokenState(payload, 1700000950)}   ← answers "why 401?" without asking anyone\\n\`);

// 2. Read a Set-Cookie header and check the session flags.
const sc = '__Host-lfid_ses=abc; Path=/; HttpOnly; Secure; SameSite=Lax';
console.log('2. Check the session cookie flags:');
console.log(\`   \${sc}\`);
console.log(\`   ⇒ \${JSON.stringify(cookieFlags(sc))}   ← all four hardened (Chapter 3)\\n\`);

console.log('⇒ A JWT is base64url JSON you can read in two lines; a cookie is a header you can inspect. Decode first,');
console.log('  ask second — the answer to "why is it 401?" is almost always visible in the token or the cookie itself.');`,
};
export const OUT = {
  '121-diagnose': `$ node demo12/diagnose.mjs
"Users cannot log in." First: curl the login route unauthenticated and read the status.

  curl -s -o /dev/null -w "%{http_code}" https://id.labflow.example/api/v1/auth/login

  200 → the route works and is public — the problem is AFTER login (session, redirect, the client)
        next: look at the client / the next request

  401 → the route is MOUNTED and asking for credentials — auth is wired; a real login should now be tried
        next: try a real credential; the pipe is intact

  403 → authenticated but forbidden — an AUTHORIZATION problem (role/tenant), not authentication
        next: check the authz gate (Chapter 9), not the password

  404 → the route is NOT MOUNTED — almost always a STALE or partial build, not a code bug
        next: redeploy a clean build; the route exists in source but not in the running image

  500 → the server CRASHED handling it — a dependency (DB, Redis, a missing secret) or an unhandled error
        next: read the server log and the startup banner (Chapter 11)

⇒ The status narrows the problem to a layer in seconds: 404 = stale build, 500 = crashed dependency,
  403 = authorization not authentication, 401 = the pipe is intact so try a real login. Measure before you guess.`,
  '122-shapes': `$ node demo12/shapes.mjs
Eight shapes of failure — match the pattern to the cause:

  • Everyone logged out at once
      ⇒ the signing key or session secret changed with no overlap — a bad rotation (11.2)

  • Only NEW logins fail, old sessions work
      ⇒ the signing key is broken/misconfigured; verification of old tokens still works

  • Works, then 401 after ~15 minutes
      ⇒ the access token expired and refresh is broken — the /auth/refresh gap (Chapter 5)

  • Works in Postman, fails in the browser
      ⇒ a cookie problem — SameSite, Secure on http, or CORS credentials (Chapter 3)

  • One specific user cannot log in
      ⇒ that account: a locked/needs-rehash hash, unverified email, or a wrong password (Chapters 2/6)

  • Intermittent 401 on the same token
      ⇒ instances disagree — different keys per node, or an unshared session/rate store (Chapter 11)

  • Login succeeds but every API call is 401
      ⇒ the token is not forwarded, or its audience is wrong — client wiring, not the login (Chapter 8)

  • 5xx on login under load
      ⇒ a dependency is down or saturated — the database, Redis, or a missing secret (Chapter 11)

⇒ Read the SHAPE first: who is affected (everyone / new logins / one user) and when (immediately / after 15
  minutes / only in the browser). The shape names the chapter to open before you read a single stack trace.`,
  '123-toolbox': `$ node demo12/toolbox.mjs
1. Decode the token by hand:
   header : {"alg":"EdDSA","kid":"k2"}
   payload: {"sub":"usr_1","iss":"https://id.labflow.example","exp":1700000900,"iat":1700000000}
   state  : EXPIRED 50s ago — this is why it is 401   ← answers "why 401?" without asking anyone

2. Check the session cookie flags:
   __Host-lfid_ses=abc; Path=/; HttpOnly; Secure; SameSite=Lax
   ⇒ {"httpOnly":true,"secure":true,"sameSite":"Lax","hostPrefix":true}   ← all four hardened (Chapter 3)

⇒ A JWT is base64url JSON you can read in two lines; a cookie is a header you can inspect. Decode first,
  ask second — the answer to "why is it 401?" is almost always visible in the token or the cookie itself.`,
  'cuoi-starter': `$ node scripts/cham-cuoi-khoa.mjs sub-cuoi/starter
Final project — sub-cuoi/starter/index.js
✗ [Ch2   ] DB dump: weak stored hash flagged + argon2id in use    0/8
✗ [Ch6   ] Email enumeration: identical sign-up message either way 0/8
✗ [Ch6   ] Homograph email: full-width look-alike folds together  0/8
✗ [Ch1/3 ] Session guessing: high-entropy session id              0/8
✗ [Ch4   ] alg:none rejected; only the expected algorithm accepted 0/9
✗ [Ch5   ] Refresh reuse: replay revokes the token family         0/8
✗ [Ch3   ] Cookie posture: HttpOnly, Secure, __Host-, SameSite≠None 0/9
✗ [Ch8   ] Forged ID token: bad signature rejected                0/9
✗ [Ch7/10] Phishing: passkey resists a relay, TOTP does not       0/8
✗ [Ch9   ] IDOR/cross-tenant: other-tenant admin denied           0/9
✗ [Ch10  ] 10k stuffing: flood blocked, real user not locked out  0/8
✗ [Ch11  ] Audit log: a logged event leaks no token or password   0/8
TOTAL 0/100 — NOT YET (pass = 70)`,
  'cuoi-tham-khao': `$ node scripts/cham-cuoi-khoa.mjs sub-cuoi/tham-khao
Final project — sub-cuoi/tham-khao/index.js
✓ [Ch2   ] DB dump: weak stored hash flagged + argon2id in use    8/8
✓ [Ch6   ] Email enumeration: identical sign-up message either way 8/8
✓ [Ch6   ] Homograph email: full-width look-alike folds together  8/8
✓ [Ch1/3 ] Session guessing: high-entropy session id              8/8
✓ [Ch4   ] alg:none rejected; only the expected algorithm accepted 9/9
✓ [Ch5   ] Refresh reuse: replay revokes the token family         8/8
✓ [Ch3   ] Cookie posture: HttpOnly, Secure, __Host-, SameSite≠None 9/9
✓ [Ch8   ] Forged ID token: bad signature rejected                9/9
✓ [Ch7/10] Phishing: passkey resists a relay, TOTP does not       8/8
✓ [Ch9   ] IDOR/cross-tenant: other-tenant admin denied           9/9
✓ [Ch10  ] 10k stuffing: flood blocked, real user not locked out  8/8
✓ [Ch11  ] Audit log: a logged event leaks no token or password   8/8
TOTAL 100/100 — PASS`,
  'cuoi-yeu': `$ node scripts/cham-cuoi-khoa.mjs sub-cuoi/yeu
Final project — sub-cuoi/yeu/index.js
✓ [Ch2   ] DB dump: weak stored hash flagged + argon2id in use    8/8
✗ [Ch6   ] Email enumeration: identical sign-up message either way 0/8
✗ [Ch6   ] Homograph email: full-width look-alike folds together  0/8
✗ [Ch1/3 ] Session guessing: high-entropy session id              0/8
✗ [Ch4   ] alg:none rejected; only the expected algorithm accepted 0/9
✓ [Ch5   ] Refresh reuse: replay revokes the token family         8/8
✓ [Ch3   ] Cookie posture: HttpOnly, Secure, __Host-, SameSite≠None 9/9
✗ [Ch8   ] Forged ID token: bad signature rejected                0/9
✗ [Ch7/10] Phishing: passkey resists a relay, TOTP does not       0/8
✗ [Ch9   ] IDOR/cross-tenant: other-tenant admin denied           0/9
✗ [Ch10  ] 10k stuffing: flood blocked, real user not locked out  0/8
✗ [Ch11  ] Audit log: a logged event leaks no token or password   0/8
TOTAL 25/100 — NOT YET (pass = 70)`,
  'lab-npm-test': `$ npm test
…
ℹ tests 54
ℹ pass 54
ℹ fail 0`,
};
