/**
 * _ma.mjs (Chương 7) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  totp: `// src/totp/index.js — TOTP from scratch (RFC 6238 over HOTP, RFC 4226). Chapter 7 = Lab 7 reference.
// A shared secret, the current 30-second step as an 8-byte counter, HMAC-SHA1, dynamic truncation ⇒ a 6-digit code.
// No library: the whole algorithm is the ~30 lines below, checked against the RFC 6238 test vectors and otplib.
import { createHmac, randomBytes } from 'node:crypto';
import { safeEqual } from '../crypto/index.js';

// RFC 4648 base32 (no padding) — the form authenticator apps and otpauth:// URIs use for the secret.
const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32Encode(buf) {
  let bits = 0, val = 0, out = '';
  for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += ALPH[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += ALPH[(val << (5 - bits)) & 31];
  return out;
}
export function base32Decode(str) {
  const s = String(str).toUpperCase().replace(/=+$/, '').replace(/\\s/g, '');
  let bits = 0, val = 0; const out = [];
  for (const ch of s) { const i = ALPH.indexOf(ch); if (i < 0) continue; val = (val << 5) | i; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } }
  return Buffer.from(out);
}

/** A fresh 160-bit secret, base32-encoded (the size RFC 6238 recommends for SHA-1). */
export function generateSecret(bytes = 20) { return base32Encode(randomBytes(bytes)); }

/** HOTP (RFC 4226): HMAC(key, counter) → dynamic truncation → \`digits\` decimal digits. */
export function hotp(key, counter, { digits = 6, alg = 'sha1' } = {}) {
  const msg = Buffer.alloc(8); msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac(alg, key).update(msg).digest();
  const off = h[h.length - 1] & 0x0f;                                   // the low 4 bits pick the offset
  const bin = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 10 ** digits).padStart(digits, '0');
}

/** TOTP (RFC 6238): the counter is the number of \`step\`-second windows since \`t0\`. */
export function totp(secretB32, { time = Math.floor(Date.now() / 1000), step = 30, t0 = 0, digits = 6, alg = 'sha1' } = {}) {
  return hotp(base32Decode(secretB32), Math.floor((time - t0) / step), { digits, alg });
}

/** Verify a code, allowing ±\`window\` steps of clock skew. ⇒ { ok, offset } (constant-time compare). */
export function verifyTotp(secretB32, code, { window = 1, time = Math.floor(Date.now() / 1000), step = 30, t0 = 0, digits = 6, alg = 'sha1' } = {}) {
  const given = String(code ?? '').trim();
  for (let w = -window; w <= window; w++) {
    const expect = totp(secretB32, { time: time + w * step, step, t0, digits, alg });
    if (given.length === expect.length && safeEqual(given, expect)) return { ok: true, offset: w };
  }
  return { ok: false };
}

/** The otpauth:// URI an authenticator app scans as a QR code. */
export function otpauthURI({ secret, label, issuer = 'LabFlow', digits = 6, step = 30, alg = 'SHA1' }) {
  const q = new URLSearchParams({ secret, issuer, algorithm: alg, digits: String(digits), period: String(step) });
  return \`otpauth://totp/\${encodeURIComponent(issuer)}:\${encodeURIComponent(label)}?\${q}\`;
}`,
  recovery: `// src/totp/recovery.js — recovery codes: the way back in when the phone with the authenticator is lost (lesson 7.3).
// Each code is high-entropy random, shown ONCE at enrollment, and stored only as a SHA-256 digest (like every other
// credential, lesson 1.3). Consuming one is single-use and constant-time. Reusing a spent code fails.
import { randomInt, createHash } from 'node:crypto';
import { safeEqual } from '../crypto/index.js';

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';   // no l/o/0/1 — unambiguous when a human copies it down
const digest = (code) => createHash('sha256').update(code.replace(/-/g, '').toLowerCase()).digest('hex');

/** Make \`count\` codes, formatted xxxx-xxxx. Returns the plaintext (show once) and the digests (store these). */
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

export { digest as recoveryDigest };`,
  webauthn: `// src/webauthn/index.js — passkeys (WebAuthn), the thin layer over @simplewebauthn/server (lessons 7.4, 7.5).
// LabFlow ID does NOT hand-roll the CBOR/COSE/attestation parsing — that is a library's job. What it owns is the policy:
// the RP ID and the expected origin. The authenticator signs over BOTH, so verification binds the assertion to this
// exact site — the one line (expectedOrigin / expectedRPID) that makes a phishing site's stolen challenge useless (7.4).
import {
  generateRegistrationOptions, verifyRegistrationResponse,
  generateAuthenticationOptions, verifyAuthenticationResponse,
} from '@simplewebauthn/server';

export function makeWebAuthn({ rpID, rpName = 'LabFlow ID', origin }) {
  return {
    rpID, origin,
    // Registration ceremony, step 1: the server hands the browser a challenge + who it is.
    registrationOptions: (user, excludeCredentials = []) => generateRegistrationOptions({
      rpName, rpID, userName: user.email, userID: new TextEncoder().encode(user.id),
      attestationType: 'none', excludeCredentials,
      authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
    }),
    // Registration ceremony, step 2: verify what the authenticator created, bound to THIS rpID + origin.
    verifyRegistration: (response, expectedChallenge) => verifyRegistrationResponse({
      response, expectedChallenge, expectedOrigin: origin, expectedRPID: rpID, requireUserVerification: false,
    }),
    // Authentication ceremony, step 1.
    authenticationOptions: (allowCredentials = []) => generateAuthenticationOptions({ rpID, allowCredentials, userVerification: 'preferred' }),
    // Authentication ceremony, step 2: verify the assertion's signature against the stored public key, bound to origin.
    // \`expected\` lets a demo override expectedOrigin/expectedRPID to show that a mismatch (phishing) fails.
    verifyAuthentication: (response, expectedChallenge, credential, expected = {}) => verifyAuthenticationResponse({
      response, expectedChallenge,
      expectedOrigin: expected.origin ?? origin, expectedRPID: expected.rpID ?? rpID,
      credential, requireUserVerification: false,
    }),
  };
}`,
  sql005: `-- 005_mfa.sql — Chapter 7: a second factor. TOTP secrets, single-use recovery codes, and passkeys (WebAuthn credentials).
-- A user may have at most one TOTP secret (confirmed only after they prove one code), many recovery codes, many passkeys.

CREATE TABLE totp_secrets (
  user_id      text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  secret       text        NOT NULL,                 -- base32, the shared seed; treat as a credential
  confirmed_at timestamptz,                           -- null until the user verifies one code (lesson 7.3)
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE recovery_codes (
  id       bigserial PRIMARY KEY,
  user_id  text        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  digest   text        NOT NULL,                      -- SHA-256 of the code; the plaintext is shown once
  used_at  timestamptz
);
CREATE INDEX recovery_codes_user ON recovery_codes (user_id);

CREATE TABLE passkeys (
  id           text PRIMARY KEY,                       -- the credential id (base64url), unique per authenticator
  user_id      text        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public_key   text        NOT NULL,                   -- COSE public key, base64
  counter      bigint      NOT NULL DEFAULT 0,         -- signature counter, for clone detection (lesson 7.5)
  transports   text,                                   -- JSON array: how the authenticator can be reached
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);
CREATE INDEX passkeys_user ON passkeys (user_id);`,
  mfaStore: `// src/mfa/store.js — PostgreSQL persistence for the second factor (lessons 7.3, 7.5): TOTP secret, recovery codes, passkeys.
import { q } from '../db.js';

export const totpStore = {
  async put(userId, secret) { await q(\`INSERT INTO totp_secrets (user_id, secret) VALUES ($1, $2)
    ON CONFLICT (user_id) DO UPDATE SET secret = $2, confirmed_at = NULL, created_at = now()\`, [userId, secret]); },
  async get(userId) { const r = (await q('SELECT * FROM totp_secrets WHERE user_id = $1', [userId])).rows[0]; return r ? { secret: r.secret, confirmedAt: r.confirmed_at ? +r.confirmed_at : null } : null; },
  async confirm(userId) { await q('UPDATE totp_secrets SET confirmed_at = now() WHERE user_id = $1', [userId]); },
  async remove(userId) { await q('DELETE FROM totp_secrets WHERE user_id = $1', [userId]); },
};

export const recoveryStore = {
  async replaceAll(userId, digests) {
    await q('DELETE FROM recovery_codes WHERE user_id = $1', [userId]);
    for (const d of digests) await q('INSERT INTO recovery_codes (user_id, digest) VALUES ($1, $2)', [userId, d]);
  },
  async liveDigests(userId) { return (await q('SELECT id, digest FROM recovery_codes WHERE user_id = $1 AND used_at IS NULL', [userId])).rows.map((r) => ({ id: r.id, digest: r.digest })); },
  async markUsed(id) { await q('UPDATE recovery_codes SET used_at = now() WHERE id = $1', [id]); },
};

export const passkeyStore = {
  async add(userId, c) { await q(\`INSERT INTO passkeys (id, user_id, public_key, counter, transports) VALUES ($1, $2, $3, $4, $5)\`,
    [c.id, userId, c.publicKey, c.counter, JSON.stringify(c.transports ?? [])]); },
  async listForUser(userId) { return (await q('SELECT * FROM passkeys WHERE user_id = $1', [userId])).rows.map(mapKey); },
  async getById(id) { return mapKey((await q('SELECT * FROM passkeys WHERE id = $1', [id])).rows[0]); },
  async bumpCounter(id, counter) { await q('UPDATE passkeys SET counter = $2, last_used_at = now() WHERE id = $1', [id, counter]); },
};
const mapKey = (r) => r ? { id: r.id, userId: r.user_id, publicKey: r.public_key, counter: Number(r.counter), transports: JSON.parse(r.transports || '[]') } : null;`,
  server07: `// src/server.js — LabFlow ID v0.7 (end of Chapter 7). Chapter 6 added the account lifecycle; Chapter 7 adds a SECOND factor:
//   TOTP (RFC 6238, src/totp), single-use recovery codes, and passkeys (WebAuthn, src/webauthn over @simplewebauthn).
// src/server.js — LabFlow ID v0.5 (end of Chapter 5). Fixed so far:
//   hole 1 — argon2id in PostgreSQL, measured parameters, upgrade on login (Chapter 2);
//   hole 3 — CSPRNG session ids, only their SHA-256 stored (Chapter 1);
//   hole 4 — sessions end: idle 30 min, absolute 12 h, sign-out, sign-out-everywhere (lesson 3.1);
//   hole 5 — the session travels in a __Host- cookie JavaScript cannot read, never in a JSON body (3.2); CSRF checked (3.4).
// Chapter 4: LabFlow ID issues short-lived JWT access tokens (EdDSA, kid, 7 claims) and a public JWKS (lesson 4.x).
// Chapter 5: a long-lived REFRESH token, in a family, in a __Host- cookie; rotation + reuse detection + a devices page.
// New in Chapter 6 (closes the sign-up half of hole 2): the account lifecycle. A new account is UNVERIFIED until it proves
//   its email (one-time token, 30 min); password reset uses a one-time token (15 min) and revokes every session + family;
//   /forgot-password and /sign-up never reveal whether an email exists (same response, same work — lesson 6.4); changing
//   the email un-verifies it; deleting the account revokes everything. Still open: hole 6, unlimited guessing (Chapter 10).
import express from 'express';
import { users } from './users.js';
import { hashPassword, verifyPassword, checkNewPassword, loadBlocklist, pwnedCount, signIn } from './passwords/index.js';
import { sessionLayer, pgStore } from './sessions/index.js';
import { accessTokens, eddsa, newEd25519, ACCESS_TTL_SEC } from './jwt/index.js';
import { publicJwks } from './jwt/jwks.js';
import { refreshLayer, pgStore as refreshStore } from './refresh/index.js';
import { lifecycle, pgStore as lifecycleStore } from './lifecycle/index.js';
import { sendEmail } from './email/index.js';
import { normalizeEmail } from './email/normalize.js';
import { generateSecret, verifyTotp, otpauthURI } from './totp/index.js';
import { generateRecoveryCodes, consumeRecoveryCode, recoveryDigest } from './totp/recovery.js';
import { totpStore, recoveryStore, passkeyStore } from './mfa/store.js';
import { makeWebAuthn } from './webauthn/index.js';
import { tokenDigest } from './crypto/index.js';
import { log, requestLog } from './log.js';

const BLOCKLIST = loadBlocklist();
const sessions = sessionLayer({ store: pgStore, touchEveryMs: Number(process.env.TOUCH_EVERY_MS ?? 60e3) });
const refresh = refreshLayer({ store: refreshStore, graceMs: Number(process.env.REFRESH_GRACE_MS ?? 10e3) });
const life = lifecycle({ store: lifecycleStore });

const ACTIVE_KID = process.env.JWT_KID ?? 'ed-2026-11';
const keyring = { [ACTIVE_KID]: eddsa(newEd25519()) };
const ISSUER = process.env.JWT_ISSUER ?? 'https://id.labflow.example';
const AUDIENCE = process.env.JWT_AUDIENCE ?? 'labflow-api';
const tokens = accessTokens({ keyring, activeKid: ACTIVE_KID, issuer: ISSUER, audience: AUDIENCE });

const RT_COOKIE = '__Host-lfid_rt';                               // the refresh token, HttpOnly, never read by JavaScript (4.5)
const RT_ATTRS = 'Path=/; HttpOnly; Secure; SameSite=Lax';
const setRefreshCookie = (res, token) => res.append('Set-Cookie', \`\${RT_COOKIE}=\${token}; \${RT_ATTRS}; Max-Age=\${30 * 24 * 3600}\`);
const clearRefreshCookie = (res) => res.append('Set-Cookie', \`\${RT_COOKIE}=; \${RT_ATTRS}; Max-Age=0\`);
function readCookie(header, name) {
  for (const part of String(header ?? '').split(';')) { const i = part.indexOf('='); if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim(); }
  return null;
}

const app = express();
app.use(requestLog);
app.use(express.json({ limit: '8kb' }));
app.use(sessions.load);   // req.session = the row, or null
app.use(sessions.csrf);   // POST/PUT/PATCH/DELETE must come from our own origin

const needSession = (req, res, next) => (req.session ? next() : res.status(401).json({ error: 'Not signed in' }));
const accessFor = (u) => tokens.issue(u.id, { role: u.role });

// lesson 6.1, 6.4: register. The email is normalised once (NFKC + lowercase) and the UNIQUE index — NOT a check-then-
// insert — decides uniqueness: we just INSERT and catch the duplicate (PG 23505). On a duplicate we do NOT say "taken";
// we hash anyway (same timing) and email "you already have an account", so sign-up cannot enumerate accounts.
app.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body ?? {};
  const problems = checkNewPassword(password, { email, blocklist: BLOCKLIST });
  if (!problems.length) {
    const seen = await pwnedCount(password);
    if (seen > 0) problems.push('BREACHED');
    if (seen === null) log.warn('pwned-passwords check unavailable; accepted without it');
  }
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  const normEmail = normalizeEmail(email);
  if (!normEmail) return res.status(422).json({ error: 'BAD_EMAIL' });
  const passwordHash = await hashPassword(password);   // hash in BOTH outcomes, so timing never reveals whether the email is taken
  let user = null;
  try {
    user = await users.create({ email: normEmail, name: name ?? '', passwordHash });  // let the UNIQUE index be the check
  } catch (e) {
    if (e?.code !== '23505') throw e;                  // 23505 = unique_violation: the address already exists (the race-safe path)
  }
  if (user) {
    const { token } = await life.issueToken(user.id, 'verify_email');
    sendEmail({ to: normEmail, subject: 'Verify your LabFlow email',
      text: \`Welcome. Confirm this address within 30 minutes: https://id.labflow.example/verify?token=\${token}\` });
  } else {
    sendEmail({ to: normEmail, subject: 'You already have a LabFlow account',
      text: 'Someone tried to register with this address. If it was you, sign in or reset your password — there is nothing else to do.' });
  }
  res.status(202).json({ ok: true, message: 'Check your email to finish signing up.' });   // same response either way
});

// lesson 6.2: email verification. GET is SAFE — it only shows a confirm page, because scanners and prefetchers GET
// links and must not burn the one-time token. POST consumes it.
app.get('/verify-email', (req, res) => {
  const token = String(req.query.token ?? '');
  res.type('html').send(\`<!doctype html><title>Confirm your email</title>
    <form method="POST" action="/verify-email"><input type="hidden" name="token" value="\${token.replace(/[^A-Za-z0-9_-]/g, '')}">
    <button>Confirm my email</button></form>\`);   // GET consumes nothing; only this click (a POST) does
});
app.post('/verify-email', async (req, res) => {
  const r = await life.consumeToken('verify_email', req.body?.token);
  if (r.error) return res.status(400).json({ error: r.error });
  await users.markEmailVerified(r.userId);
  res.json({ ok: true, verified: true });
});

// lesson 6.3, 6.4: ask for a password reset. Same response AND same timing (the insert + email are not awaited).
app.post('/forgot-password', async (req, res) => {
  await life.requestPasswordReset(users, req.body?.email, { send: sendEmail });
  res.json({ ok: true, message: 'If an account exists for that address, a reset link is on its way.' });
});
// lesson 6.4 TEACHING FOIL (never ship): the same endpoint, but it AWAITS the token insert + email send — so a real
// account is measurably slower than a fake one, and the identical wording above no longer hides which emails exist.
app.post('/forgot-password-naive', async (req, res) => {
  await life.requestPasswordReset(users, req.body?.email, { send: sendEmail, sync: true });
  res.json({ ok: true, message: 'If an account exists for that address, a reset link is on its way.' });
});

// lesson 6.3: consume a reset token, set the new password, and end every session and refresh family (5.3).
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body ?? {};
  const r = await life.consumeToken('reset_password', token);
  if (r.error) return res.status(400).json({ error: r.error });
  const u = await users.findById(r.userId);
  const problems = checkNewPassword(newPassword, { email: u.email, blocklist: BLOCKLIST });
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  await users.updateHash(u.id, await hashPassword(newPassword));
  await sessions.endAll(u.id);
  await refresh.revokeAll(u.id);
  res.json({ ok: true, message: 'Password reset. Sign in with your new password.' });
});

app.post('/sign-in', async (req, res) => {
  const { email, password } = req.body ?? {};
  const { user, error } = await signIn(users, email, password);
  if (error) return res.status(401).json({ error: 'Email or password is incorrect' });
  const common = BLOCKLIST.has(password.normalize('NFC').toLowerCase());
  if (common) await users.flagMustChange(user.id);
  await sessions.start(req, res, user.id);                         // the web session (Chapter 3), in its own cookie
  const { token } = await refresh.issue(user.id, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null }); // a new family (device)
  setRefreshCookie(res, token);
  res.json({ ok: true, access_token: accessFor(user), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, mustChangePassword: user.mustChangePassword || common });
});

// lesson 5.1, 5.2: exchange the refresh token for a fresh access token, rotating the refresh token every time.
app.post('/refresh', async (req, res) => {
  const presented = readCookie(req.headers.cookie, RT_COOKIE);
  if (!presented) return res.status(401).json({ error: 'NO_REFRESH_TOKEN' });
  const r = await refresh.rotate(presented, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null });
  if (r.error) {
    clearRefreshCookie(res);                                       // a bad refresh token is cleared, whatever the reason
    if (r.error === 'REUSE_DETECTED') log.warn({ familyId: r.familyId }, 'refresh token reuse — family revoked');
    return res.status(401).json({ error: r.error });
  }
  const u = await users.findById(r.row.userId);
  setRefreshCookie(res, r.token);                                  // the rotated refresh token
  res.json({ ok: true, access_token: accessFor(u), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, ...(r.raced ? { raced: true } : {}) });
});

app.get('/me', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  res.json({ id: u.id, email: u.email, name: u.name, role: u.role });
});

// lesson 5.4: the devices page — one row per live family, with "this is you?" fields and a revoke button.
app.get('/me/devices', needSession, async (req, res) => {
  res.json({ devices: await refresh.listDevices(req.session.userId) });
});
app.post('/me/devices/revoke', needSession, async (req, res) => {
  const familyId = String(req.body?.familyId ?? '');
  const revoked = await refresh.revokeDevice(req.session.userId, familyId);
  res.json({ ok: true, revoked });
});

// lesson 4.x compatibility: also mint an access token from the session (web clients without a stored refresh token).
app.post('/token', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  res.json({ access_token: accessFor(u), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, scope: AUDIENCE });
});

app.get('/.well-known/jwks.json', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(await publicJwks(keyring));
});

// lesson 6.5: change the email. The new address starts UN-verified (users.updateEmail clears it) and must be proven.
app.post('/me/email', needSession, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!email) return res.status(422).json({ error: 'BAD_EMAIL' });
  await users.updateEmail(req.session.userId, email);
  const { token } = await life.issueToken(req.session.userId, 'verify_email');
  sendEmail({ to: email, subject: 'Verify your new LabFlow email',
    text: \`Confirm your new address within 30 minutes: https://id.labflow.example/verify?token=\${token}\` });
  res.json({ ok: true, email, verificationSent: true });
});

// lesson 6.5: end the account. Re-authenticate, mark it deleted, and revoke every session and refresh family.
app.post('/me/delete', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  if (!(await verifyPassword(u.passwordHash, String(req.body?.password ?? ''))).ok) return res.status(403).json({ error: 'REAUTH_FAILED' });
  await users.setStatus(u.id, 'deleted');
  await sessions.endAll(u.id);
  await refresh.revokeAll(u.id);
  await sessions.end(req, res);
  clearRefreshCookie(res);
  res.json({ ok: true, deleted: true });
});

// lesson 3.3 + 5.3: change the password, end every session AND revoke every refresh family, start fresh.
app.post('/me/password', needSession, async (req, res) => {
  const { current, next: pw } = req.body ?? {};
  const u = await users.findById(req.session.userId);
  if (!(await verifyPassword(u.passwordHash, String(current ?? ''))).ok) return res.status(403).json({ error: 'REAUTH_FAILED' });
  const problems = checkNewPassword(pw, { email: u.email, blocklist: BLOCKLIST });
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  await users.updateHash(u.id, await hashPassword(pw));
  const endedSessions = await sessions.endAll(u.id);
  const revokedFamilies = await refresh.revokeAll(u.id);
  await sessions.start(req, res, u.id);
  const { token } = await refresh.issue(u.id, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null });
  setRefreshCookie(res, token);
  res.json({ ok: true, signedOutSessions: endedSessions, revokedFamilies });
});

// lesson 5.3: sign-out ends this session and revokes this device's refresh family.
app.post('/sign-out', async (req, res) => {
  const presented = readCookie(req.headers.cookie, RT_COOKIE);
  if (presented) { const rec = await refreshStore.getByDigest(tokenDigest(presented)); if (rec) await refresh.revokeFamily(rec.familyId); }
  clearRefreshCookie(res);
  await sessions.end(req, res);
  res.json({ ok: true });
});
app.post('/sign-out-everywhere', needSession, async (req, res) => {
  const revokedFamilies = await refresh.revokeAll(req.session.userId);
  clearRefreshCookie(res);
  res.json({ ok: true, ended: await sessions.endAll(req.session.userId), revokedFamilies });
});

// ── Chapter 7: a second factor ─────────────────────────────────────────────────────────────────────────────────────
// lesson 7.3: enroll TOTP. begin ⇒ a secret + otpauth URI (unconfirmed); confirm ⇒ prove one code, then recovery codes.
app.post('/mfa/totp/begin', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  const secret = generateSecret();
  await totpStore.put(u.id, secret);                                   // stored UNCONFIRMED until a code is proven
  res.json({ secret, otpauth: otpauthURI({ secret, label: u.email, issuer: 'LabFlow ID' }) });
});
app.post('/mfa/totp/confirm', needSession, async (req, res) => {
  const t = await totpStore.get(req.session.userId);
  if (!t) return res.status(400).json({ error: 'NO_ENROLLMENT' });
  if (!verifyTotp(t.secret, req.body?.code, { window: 1 }).ok) return res.status(401).json({ error: 'BAD_CODE' });
  await totpStore.confirm(req.session.userId);
  const { codes, digests } = generateRecoveryCodes(10);               // shown ONCE, stored as digests (lesson 7.3)
  await recoveryStore.replaceAll(req.session.userId, digests);
  res.json({ ok: true, enabled: true, recoveryCodes: codes });        // the only time the codes are returned
});
// lesson 7.1/7.3: the step-up check at login — a TOTP code, or a single-use recovery code when the phone is gone.
app.post('/mfa/totp/verify', needSession, async (req, res) => {
  const t = await totpStore.get(req.session.userId);
  if (!t?.confirmedAt) return res.status(400).json({ error: 'NOT_ENABLED' });
  if (req.body?.code && verifyTotp(t.secret, req.body.code, { window: 1 }).ok) return res.json({ ok: true, via: 'totp' });
  if (req.body?.recovery) {
    const live = await recoveryStore.liveDigests(req.session.userId);
    const r = consumeRecoveryCode(req.body.recovery, live.map((x) => x.digest));
    if (r.ok) { await recoveryStore.markUsed(live[r.index].id); return res.json({ ok: true, via: 'recovery', remaining: r.remaining.length }); }
  }
  res.status(401).json({ error: 'BAD_CODE' });
});

// lesson 7.4/7.5: passkeys. Two ceremonies; the RP ID + expected origin bind every assertion to this site.
const WA = makeWebAuthn({ rpID: process.env.RP_ID ?? 'localhost', origin: process.env.RP_ORIGIN ?? \`http://localhost:\${process.env.PORT ?? 4800}\` });
const waChallenges = new Map();                                        // userId → the challenge we just issued (demo: in memory)
app.post('/webauthn/register/options', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  const existing = (await passkeyStore.listForUser(u.id)).map((k) => ({ id: k.id, transports: k.transports }));
  const options = await WA.registrationOptions(u, existing);
  waChallenges.set('reg:' + u.id, options.challenge);
  res.json(options);
});
app.post('/webauthn/register/verify', needSession, async (req, res) => {
  const v = await WA.verifyRegistration(req.body, waChallenges.get('reg:' + req.session.userId)).catch(() => ({ verified: false }));
  if (!v.verified) return res.status(400).json({ error: 'VERIFY_FAILED' });
  const c = v.registrationInfo.credential;
  await passkeyStore.add(req.session.userId, { id: c.id, publicKey: Buffer.from(c.publicKey).toString('base64'), counter: c.counter, transports: req.body?.response?.transports });
  res.json({ ok: true, registered: true });
});
app.post('/webauthn/auth/options', async (req, res) => {
  const u = await users.findByEmail(normalizeEmail(req.body?.email) ?? '');
  const keys = u ? await passkeyStore.listForUser(u.id) : [];
  const options = await WA.authenticationOptions(keys.map((k) => ({ id: k.id, transports: k.transports })));
  if (u) waChallenges.set('auth:' + u.id, options.challenge);
  res.json(options);                                                   // same shape whether or not the user exists (6.4)
});
app.post('/webauthn/auth/verify', async (req, res) => {
  const stored = await passkeyStore.getById(req.body?.id ?? '');
  if (!stored) return res.status(400).json({ error: 'UNKNOWN_CREDENTIAL' });
  const v = await WA.verifyAuthentication(req.body, waChallenges.get('auth:' + stored.userId),
    { id: stored.id, publicKey: new Uint8Array(Buffer.from(stored.publicKey, 'base64')), counter: stored.counter }).catch(() => ({ verified: false }));
  if (!v.verified) return res.status(401).json({ error: 'VERIFY_FAILED' });
  await passkeyStore.bumpCounter(stored.id, v.authenticationInfo.newCounter);   // clone detection (lesson 7.5)
  res.json({ ok: true, userId: stored.userId });
});

app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? 'INTERNAL' }));

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(\`LabFlow ID v0.7 on http://localhost:\${port} (JWKS kid \${ACTIVE_KID})\`));`,
  ceremony: `// demo7/passkey-ceremony.mjs — a REAL passkey, created and used by a real Chromium (Playwright virtual authenticator),
// verified by LabFlow ID's src/webauthn over @simplewebauthn/server (lessons 7.4, 7.5). Then the phishing test: the same
// real assertion, re-verified with a different expectedOrigin, FAILS — the one line that kills phishing.
import express from 'express';
import { chromium } from 'playwright';
import { makeWebAuthn } from '../src/webauthn/index.js';

const PORT = 4811;
const RP_ID = 'localhost';
const ORIGIN = \`http://localhost:\${PORT}\`;
const wa = makeWebAuthn({ rpID: RP_ID, origin: ORIGIN });
const db = { challenge: null, credential: null, lastAuth: null };
const user = { id: 'usr_1', email: 'an@student.labflow.example' };

const app = express();
app.use(express.json());
app.get('/', (_req, res) => res.type('html').send(PAGE));
app.post('/reg/options', async (_req, res) => { const o = await wa.registrationOptions(user); db.challenge = o.challenge; res.json(o); });
app.post('/reg/verify', async (req, res) => {
  const v = await wa.verifyRegistration(req.body, db.challenge);
  if (v.verified) db.credential = { id: v.registrationInfo.credential.id, publicKey: Buffer.from(v.registrationInfo.credential.publicKey).toString('base64'), counter: v.registrationInfo.credential.counter };
  res.json({ verified: v.verified });
});
app.post('/auth/options', async (_req, res) => { const o = await wa.authenticationOptions([{ id: db.credential.id }]); db.challenge = o.challenge; res.json(o); });
app.post('/auth/verify', async (req, res) => { db.lastAuth = req.body; const v = await wa.verifyAuthentication(req.body, db.challenge, { id: db.credential.id, publicKey: new Uint8Array(Buffer.from(db.credential.publicKey, 'base64')), counter: db.credential.counter }); res.json({ verified: v.verified }); });

const PAGE = \`<!doctype html><title>passkey</title><script>
const b64uToBuf = (s) => Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(s.length/4)*4,'=')), c=>c.charCodeAt(0)).buffer;
const bufToB64u = (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\\\\+/g,'-').replace(/\\\\//g,'_').replace(/=+$/,'');
const post = (u,b) => fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b||{})}).then(r=>r.json());
async function register() {
  const o = await post('/reg/options');
  o.challenge = b64uToBuf(o.challenge); o.user.id = b64uToBuf(o.user.id);
  if (o.excludeCredentials) o.excludeCredentials.forEach(c=>c.id=b64uToBuf(c.id));
  const cred = await navigator.credentials.create({ publicKey: o });
  const r = cred.response;
  return post('/reg/verify', { id: cred.id, rawId: bufToB64u(cred.rawId), type: cred.type, clientExtensionResults: cred.getClientExtensionResults(),
    response: { clientDataJSON: bufToB64u(r.clientDataJSON), attestationObject: bufToB64u(r.attestationObject), transports: r.getTransports?r.getTransports():[] } });
}
async function authenticate() {
  const o = await post('/auth/options');
  o.challenge = b64uToBuf(o.challenge);
  if (o.allowCredentials) o.allowCredentials.forEach(c=>c.id=b64uToBuf(c.id));
  const cred = await navigator.credentials.get({ publicKey: o });
  const r = cred.response;
  return post('/auth/verify', { id: cred.id, rawId: bufToB64u(cred.rawId), type: cred.type, clientExtensionResults: cred.getClientExtensionResults(),
    response: { clientDataJSON: bufToB64u(r.clientDataJSON), authenticatorData: bufToB64u(r.authenticatorData), signature: bufToB64u(r.signature), userHandle: r.userHandle?bufToB64u(r.userHandle):null } });
}
window.register = register; window.authenticate = authenticate;
</script>\`;

const server = app.listen(PORT);
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('WebAuthn.enable');
await cdp.send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } });
await page.goto(ORIGIN);

console.log('A real Chromium with a virtual authenticator runs the two ceremonies against LabFlow ID:');
const reg = await page.evaluate('register()');
console.log(\`  1. register  — navigator.credentials.create → server verifyRegistration: verified=\${reg.verified}\`);
console.log(\`     stored credential id \${db.credential.id.slice(0, 16)}… (public key \${db.credential.publicKey.length} b64 chars, counter \${db.credential.counter})\`);
const auth = await page.evaluate('authenticate()');
console.log(\`  2. authenticate — navigator.credentials.get → server verifyAuthentication: verified=\${auth.verified}\`);

console.log('\\nThe one line that kills phishing — re-verify the SAME real assertion with a phishing origin/RP ID:');
const good = await wa.verifyAuthentication(db.lastAuth, db.challenge, { id: db.credential.id, publicKey: new Uint8Array(Buffer.from(db.credential.publicKey, 'base64')), counter: db.credential.counter }).then(v => v.verified).catch(() => false);
const evil = await wa.verifyAuthentication(db.lastAuth, db.challenge, { id: db.credential.id, publicKey: new Uint8Array(Buffer.from(db.credential.publicKey, 'base64')), counter: db.credential.counter }, { origin: 'https://evil.example', rpID: 'evil.example' }).then(v => v.verified).catch(() => false);
console.log(\`  expectedOrigin = \${ORIGIN}  → verified=\${good}\`);
console.log(\`  expectedOrigin = https://evil.example  → verified=\${evil}   (the authenticator signed over the real origin; the signature cannot match a lie)\`);

await browser.close();
server.close();
console.log(\`\\n⇒ a passkey is bound to \${RP_ID}. A phishing page on another origin gets a signature the real server rejects — nothing to steal and replay.\`);`,
  grader7: `// scripts/cham-lab-7.mjs — grader of Lab 7 (LabFlow ID's TOTP). 6 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-7.mjs <folder with index.js>     e.g.  node scripts/cham-lab-7.mjs lab7/my
// It drives YOUR hotp/totp/verifyTotp against the RFC 4226 and RFC 6238 published test vectors and a skew window.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = path.resolve(process.argv[2] ?? 'lab7/my');
const m = await import(pathToFileURL(path.join(dir, 'index.js')).href);
const RFC_KEY = Buffer.from('12345678901234567890');                     // the RFC's ASCII secret
let B32 = null; try { B32 = m.base32Encode(RFC_KEY); } catch { /* starter: base32 not implemented yet */ }

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : \`your code threw \${e?.name}: \${String(e?.message).split('\\n')[0]}\`; }
  results.push({ name, points, ok: !why, why });
}

await check('T1 base32Encode/Decode round-trip', 1, async () => {
  expect(typeof m.base32Encode === 'function' && typeof m.base32Decode === 'function', 'export base32Encode and base32Decode');
  expect(m.base32Decode(m.base32Encode(Buffer.from('hello'))).toString() === 'hello', 'decode(encode(x)) must equal x');
});

await check('T2 hotp matches the RFC 4226 vectors (counter 0–9)', 2, async () => {
  const want = ['755224', '287082', '359152', '969429', '338314', '254676', '287922', '162583', '399871', '520489'];
  for (let c = 0; c < want.length; c++) expect(m.hotp(RFC_KEY, c, { digits: 6 }) === want[c], \`hotp(key, \${c}) must be \${want[c]}\`);
});

await check('T3 totp matches the RFC 6238 vectors (SHA-1, 8 digits)', 2.5, async () => {
  for (const [t, w] of [[59, '94287082'], [1111111109, '07081804'], [1234567890, '89005924'], [20000000000, '65353130']])
    expect(m.totp(B32, { time: t, digits: 8 }) === w, \`totp at t=\${t} must be \${w}\`);
});

await check('T4 totp default is 6 digits over a 30-second step', 1.5, async () => {
  const a = m.totp(B32, { time: 1700000040 }), b = m.totp(B32, { time: 1700000069 }), c = m.totp(B32, { time: 1700000070 });
  expect(/^\\d{6}$/.test(a), 'a 6-digit code');
  expect(a === b, 'codes in the same 30s step (…040–…069) must match');
  expect(a !== c, 'the next step (…070) must give a different code');
});

await check('T5 verifyTotp accepts ±1 step of skew, rejects beyond', 2, async () => {
  const now = 1700000055;
  expect(m.verifyTotp(B32, m.totp(B32, { time: now - 30 }), { time: now, window: 1 }).ok, 'the previous step must be accepted');
  expect(m.verifyTotp(B32, m.totp(B32, { time: now }), { time: now, window: 1 }).ok, 'the current step must be accepted');
  expect(!m.verifyTotp(B32, m.totp(B32, { time: now - 90 }), { time: now, window: 1 }).ok, 'three steps away must be rejected');
});

await check('T6 verifyTotp rejects a wrong code and never crashes', 1, async () => {
  expect(!m.verifyTotp(B32, '000000', { time: 1700000000, window: 1 }).ok, 'a wrong code must be rejected');
  expect(!m.verifyTotp(B32, '', { time: 1700000000 }).ok, 'an empty code must be rejected, not throw');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 7 — \${path.relative(process.cwd(), path.join(dir, 'index.js'))}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(62)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  yeu7: `// lab7/yeu/index.js — a first attempt that generates correct codes for the happy path, but hardcodes 6 digits (so the
// 8-digit RFC vectors fail) and verifies only the EXACT current step (no skew window — a user whose clock is a few
// seconds off is locked out). Both are real first-attempt mistakes.
import { createHmac } from 'node:crypto';
const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function base32Encode(buf) { let bits = 0, val = 0, out = ''; for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += ALPH[(val >>> (bits - 5)) & 31]; bits -= 5; } } if (bits > 0) out += ALPH[(val << (5 - bits)) & 31]; return out; }
export function base32Decode(str) { const s = String(str).toUpperCase().replace(/[^A-Z2-7]/g, ''); let bits = 0, val = 0; const out = []; for (const ch of s) { val = (val << 5) | ALPH.indexOf(ch); bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } } return Buffer.from(out); }
export function hotp(key, counter, { alg = 'sha1' } = {}) {
  const msg = Buffer.alloc(8); msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac(alg, key).update(msg).digest();
  const off = h[h.length - 1] & 0x0f;
  const bin = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 1000000).padStart(6, '0');   // BUG: hardcoded 6 digits, ignores opts.digits
}
export function totp(secretB32, { time = Math.floor(Date.now() / 1000), step = 30 } = {}) {
  return hotp(base32Decode(secretB32), Math.floor(time / step));
}
export function verifyTotp(secretB32, code, { time = Math.floor(Date.now() / 1000), step = 30 } = {}) {
  return { ok: totp(secretB32, { time, step }) === String(code) };   // BUG: no skew window
}`,
};
export const OUT = {
  '71-totp-rfc': `$ node demo7/totp-rfc.mjs
RFC 6238 Appendix B (SHA-1, 8 digits) — our totp() vs the published vector:
  t=         59  ours 94287082  ✓ matches RFC
  t= 1111111109  ours 07081804  ✓ matches RFC
  t= 1111111111  ours 14050471  ✓ matches RFC
  t= 1234567890  ours 89005924  ✓ matches RFC
  t= 2000000000  ours 69279037  ✓ matches RFC
  t=20000000000  ours 65353130  ✓ matches RFC
  ⇒ all six RFC vectors: PASS

Same secret, 6 digits — our totp() vs otplib at three fixed times:
  t=1700000000  ours 496665  otplib 496665  ✓
  t=1700000030  ours 073872  otplib 073872  ✓
  t=1700000060  ours 469942  otplib 469942  ✓

Clock skew — a code from the previous 30s window is still accepted with window=1:
  code from step -1  → accepted=true (offset -1)
  code from step +0  → accepted=true (offset 0)
  code from step +1  → accepted=true (offset 1)
  code from step +2  → accepted=false (outside ±1 window)`,
  '72-recovery': `$ node demo7/recovery.mjs
Ten codes shown ONCE at enrollment (only their SHA-256 digests are stored):
  q743-dbyx  gakb-g4at  6bwb-x3mn  9ity-sup7  …
  stored: 10 digests, e.g. 3d08d02379afcf9d2b0123f0… (not the codes themselves)

User lost their phone and types one code: 9ity-sup7
  consume → ok=true, index=3; remaining 9
  same code again → ok=false (single-use: a spent code is gone); remaining 9
  a wrong code → ok=false`,
  '73-totp-enroll': `$ bash demo7/totp-enroll.sh
$ curl -s -b jar -X POST localhost:4800/mfa/totp/begin
  secret 3566NXPPKNME…   otpauth otpauth://totp/LabFlow%20ID:an%40student.labflow.examp…
$ # the authenticator app shows 338694 — confirm it (and receive recovery codes ONCE):
  → {"ok":true,"enabled":true}   recovery: yfrz-rgbs 3ji6-bw4v rbfc-9wy4 … (10 total)
$ # step up at login with a fresh 6-digit code:
{"ok":true,"via":"totp"}
$ # lost the phone — the single-use recovery code yfrz-rgbs works instead:
{"ok":true,"via":"recovery","remaining":9}
$ # that recovery code is now spent — reusing it fails:
{"error":"BAD_CODE"}`,
  '74-passkey': `$ node demo7/passkey-ceremony.mjs
A real Chromium with a virtual authenticator runs the two ceremonies against LabFlow ID:
  1. register  — navigator.credentials.create → server verifyRegistration: verified=true
     stored credential id a_aihV0MtSpL3nfX… (public key 56 b64 chars, counter 1)
  2. authenticate — navigator.credentials.get → server verifyAuthentication: verified=true

The one line that kills phishing — re-verify the SAME real assertion with a phishing origin/RP ID:
  expectedOrigin = http://localhost:4811  → verified=true
  expectedOrigin = https://evil.example  → verified=false   (the authenticator signed over the real origin; the signature cannot match a lie)

⇒ a passkey is bound to localhost. A phishing page on another origin gets a signature the real server rejects — nothing to steal and replay.`,
  'lab-bat-dau': `$ node scripts/cham-lab-7.mjs lab7/starter
Lab 7 — lab7/starter/index.js
✗ T1 base32Encode/Decode round-trip                              0/1
    ↳ your code threw Error: not implemented
✗ T2 hotp matches the RFC 4226 vectors (counter 0–9)             0/2
    ↳ your code threw Error: not implemented
✗ T3 totp matches the RFC 6238 vectors (SHA-1, 8 digits)         0/2.5
    ↳ your code threw Error: not implemented
✗ T4 totp default is 6 digits over a 30-second step              0/1.5
    ↳ your code threw Error: not implemented
✗ T5 verifyTotp accepts ±1 step of skew, rejects beyond          0/2
    ↳ your code threw Error: not implemented
✗ T6 verifyTotp rejects a wrong code and never crashes           0/1
    ↳ your code threw Error: not implemented
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test 2>&1 | grep -v 'npm notice'

> labflow-id@0.5.0 test
> node --test --test-reporter=spec "test/**/*.test.js"

✔ newToken: prefix + 43 base64url chars, and checks its arguments (0.699041ms)
✔ tokenDigest is SHA-256 hex (0.298292ms)
✔ safeEqual: equal, different, different lengths, not strings (0.1885ms)
✔ signed value: round trip, tampering, expiry boundary (0.339208ms)
✔ signed value: key rotation and malformed input (0.175958ms)
✔ redact keeps only allowed keys, deeply (0.3925ms)
✔ issue + verify: round trip with the seven claims (1.674041ms)
✔ alg: none is rejected (algorithm comes from the key, not the header) (0.392917ms)
✔ HS/RS confusion is rejected (public key used as an HMAC secret) (0.834125ms)
✔ unknown or missing kid is rejected (0.172875ms)
✔ tampered payload is rejected (signature covers header.payload) (0.320875ms)
✔ claims: iss, aud, sub, exp, nbf, iat, jti each enforced (1.345791ms)
✔ exp boundary and clock skew (0.52125ms)
✔ revocation by jti (0.297083ms)
✔ key rotation: two live keys verify, a dropped key does not (0.729208ms)
✔ interop with jose (both directions) (6.9865ms)
✔ one-time token: issue and consume round trip (1.258917ms)
✔ single-use: a consumed token is rejected the second time (0.200792ms)
✔ purpose-bound: a reset token cannot verify an email, and vice versa (0.120459ms)
✔ expiry: a reset token is dead after 15 minutes, a verify token after 30 (0.431167ms)
✔ an unknown token is INVALID, never a crash (0.1355ms)
✔ requestPasswordReset emails only a real, active account (0.183833ms)
✔ requestPasswordReset does not email a deleted account (0.143125ms)
✔ hash is argon2id with the measured parameters and a fresh salt (147.553667ms)
✔ NFC: precomposed and decomposed Vietnamese verify the same (147.791417ms)
✔ bcrypt verifies and asks for a rehash; a wrong password never does (202.393375ms)
✔ policy: length, blocklist, context — no composition rules (0.667792ms)
✔ signIn: one answer for both failures, upgrade on success (348.379916ms)
✔ issue + rotate: a fresh token each time, same family (1.1445ms)
✔ reuse of a rotated token revokes the whole family (0.415125ms)
✔ the refresh race: the same token rotated twice within grace returns the same child (0.185542ms)
✔ outside the grace window, the same second use is treated as theft (0.122333ms)
✔ invalid, expired and revoked tokens are rejected without flagging theft (0.202416ms)
✔ device list and revocation (0.249416ms)
✔ a rotated family still appears as one device (not one per rotation) (0.247334ms)
✔ cookie: __Host- prefix, HttpOnly, Secure, SameSite=Lax, Path=/ (1.026292ms)
✔ sign-in replaces a planted session (fixation) (0.304542ms)
✔ idle 30 min and absolute 12 h (0.856ms)
✔ csrf: cross-site and foreign Origin get 403; same-origin and non-browser clients pass (0.127792ms)
✔ HOTP matches the RFC 4226 test vectors (0.904ms)
✔ TOTP matches the RFC 6238 test vectors (SHA-1, 8 digits) (0.314834ms)
✔ verifyTotp accepts ±1 step of skew and rejects beyond (0.342875ms)
✔ recovery codes are single-use and stored only as digests (1.187083ms)
ℹ tests 43
ℹ suites 0
ℹ pass 43
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 998.323667`,
  'lab-tham-khao': `$ node scripts/cham-lab-7.mjs lab7/tham-khao
Lab 7 — lab7/tham-khao/index.js
✓ T1 base32Encode/Decode round-trip                              1/1
✓ T2 hotp matches the RFC 4226 vectors (counter 0–9)             2/2
✓ T3 totp matches the RFC 6238 vectors (SHA-1, 8 digits)         2.5/2.5
✓ T4 totp default is 6 digits over a 30-second step              1.5/1.5
✓ T5 verifyTotp accepts ±1 step of skew, rejects beyond          2/2
✓ T6 verifyTotp rejects a wrong code and never crashes           1/1
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-7.mjs lab7/yeu
Lab 7 — lab7/yeu/index.js
✓ T1 base32Encode/Decode round-trip                              1/1
✓ T2 hotp matches the RFC 4226 vectors (counter 0–9)             2/2
✗ T3 totp matches the RFC 6238 vectors (SHA-1, 8 digits)         0/2.5
    ↳ totp at t=59 must be 94287082
✓ T4 totp default is 6 digits over a 30-second step              1.5/1.5
✗ T5 verifyTotp accepts ±1 step of skew, rejects beyond          0/2
    ↳ the previous step must be accepted
✓ T6 verifyTotp rejects a wrong code and never crashes           1/1
TOTAL 5.5/10 — NOT YET (pass = 7)`,
};
