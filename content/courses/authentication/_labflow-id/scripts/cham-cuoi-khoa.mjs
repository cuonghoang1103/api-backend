// scripts/cham-cuoi-khoa.mjs — the final-project grader. It runs ~12 real attack scenarios against a submission's
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
console.log(`Final project — ${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'sub-cuoi/my', 'index.js'))}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} [${r.ch.padEnd(6)}] ${r.name.padEnd(54)} ${r.ok ? r.pts : 0}/${r.pts}`);
console.log(`TOTAL ${total}/100 — ${total >= 70 ? 'PASS' : 'NOT YET (pass = 70)'}`);
process.exit(total >= 70 ? 0 : 1);
