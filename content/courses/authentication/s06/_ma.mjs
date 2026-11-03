/**
 * _ma.mjs (Chương 6) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  layer: `// src/lifecycle/layer.js — Chapter 6 = Lab 6 reference: one-time tokens for email verification and password reset,
// and a password-reset request that does not reveal whether an email exists (lessons 6.2, 6.3, 6.4).
// store = { insert(row), getByDigest(d), markUsed(id, t) }. A token is random; only its digest is stored (lesson 1.3).
import { newToken, tokenDigest } from '../crypto/index.js';

export function lifecycle({ store, now = () => Date.now(), verifyTtlMs = 30 * 60e3, resetTtlMs = 15 * 60e3 }) {
  /** Make a one-time token for a purpose; the plaintext is emailed, the digest is stored. */
  async function issueToken(userId, purpose) {
    const token = newToken(purpose === 'reset_password' ? 'lfid_reset' : 'lfid_verify');
    const t = now();
    const row = { id: newToken('ott'), userId, purpose, digest: tokenDigest(token), createdAt: t,
      expiresAt: t + (purpose === 'reset_password' ? resetTtlMs : verifyTtlMs), usedAt: null };
    await store.insert(row);
    return { token, row };
  }

  /** Consume a token for a purpose. ⇒ { userId } or { error }. Single-use, purpose-bound, time-limited. */
  async function consumeToken(purpose, token, { at = now() } = {}) {
    const rec = await store.getByDigest(tokenDigest(String(token)));
    if (!rec || rec.purpose !== purpose) return { error: 'INVALID' };   // wrong token, or a reset token used to verify email
    if (rec.usedAt) return { error: 'USED' };                           // single-use (a reset link works exactly once)
    if (at >= rec.expiresAt) return { error: 'EXPIRED' };
    await store.markUsed(rec.id, at);
    return { userId: rec.userId };
  }

  /** Ask for a password reset WITHOUT revealing whether the email exists (lesson 6.4). The response is identical either
   *  way — AND so is its timing, because the token insert and the email send are done OFF the response path (not awaited).
   *  Awaiting them (the \`sync\` option, a teaching foil) makes a real account measurably slower, which is itself the leak. */
  async function requestPasswordReset(users, email, { send, sync = false }) {
    const user = await users.findByEmail(String(email ?? '').trim().toLowerCase());
    const work = async () => {
      if (user && user.status === 'active') {
        const { token } = await issueToken(user.id, 'reset_password');
        send({ to: user.email, subject: 'Reset your LabFlow password',
          text: \`Someone asked to reset your password. If it was you, use this one-time link within 15 minutes: \` +
            \`https://id.labflow.example/reset?token=\${token}  — if not, ignore this email.\` });
      }
    };
    if (sync) await work();          // the naive version: the response waits for the insert + send ⇒ a timing leak
    else work().catch(() => {});     // the safe version: fire-and-forget, so the response time does not depend on the account
    return { ok: true };             // one fixed response in every case
  }

  return { issueToken, consumeToken, requestPasswordReset };
}`,
  pgStore: `// src/lifecycle/pg-store.js — the one-time-token store on PostgreSQL (lesson 6.3). Times are epoch ms in JavaScript.
import { q } from '../db.js';

const row = (r) => r ? { id: r.id, userId: r.user_id, purpose: r.purpose, digest: r.digest,
  createdAt: +r.created_at, expiresAt: +r.expires_at, usedAt: r.used_at ? +r.used_at : null } : null;
const ts = (ms) => new Date(ms);

export const pgStore = {
  async insert(s) {
    await q(\`INSERT INTO one_time_tokens (id, user_id, purpose, digest, created_at, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)\`, [s.id, s.userId, s.purpose, s.digest, ts(s.createdAt), ts(s.expiresAt)]);
  },
  async getByDigest(digest) { return row((await q('SELECT * FROM one_time_tokens WHERE digest = $1', [digest])).rows[0]); },
  async markUsed(id, t) { await q('UPDATE one_time_tokens SET used_at = $2 WHERE id = $1', [id, ts(t)]); },
};`,
  sql004: `-- sql/004_lifecycle.sql — Chapter 6: the account lifecycle. A user is created unverified; email verification and
-- password reset both use ONE-TIME tokens, stored only as a digest (lesson 1.3), single-use and short-lived.
ALTER TABLE users
  ADD COLUMN email_verified_at timestamptz,                       -- null until the address is proven (lesson 6.2)
  ADD COLUMN status            text NOT NULL DEFAULT 'active';     -- active | deleted (lesson 6.5)

CREATE TABLE one_time_tokens (
  id         text        PRIMARY KEY,                             -- ott_<random> — the row id, safe to log
  user_id    text        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose    text        NOT NULL,                                -- 'verify_email' | 'reset_password'
  digest     text        NOT NULL,                                -- SHA-256 of the token; the token itself is emailed, never stored
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,                                -- 30 min for verify, 15 min for reset
  used_at    timestamptz                                         -- set when consumed; a used token is rejected (single-use)
);
CREATE UNIQUE INDEX one_time_tokens_digest_idx ON one_time_tokens (digest);
CREATE INDEX one_time_tokens_user_idx ON one_time_tokens (user_id, purpose);`,
  email: `// src/email/index.js — Chapter 6: a fake mailbox. In production this calls a provider (Resend, SES, Postmark); here it
// captures every message in an in-process outbox so the demos, tests and the Lab grader can read a verification link or
// a reset code without a real inbox. A real inbox is the only place these codes should ever appear.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outbox = [];

/** "Send" a message: capture it. Never throws; a real sender would be fire-and-forget so timing does not leak (6.4).
 *  If LFID_MAIL_DIR is set (demos), also drop the message as a .txt file — the dev's "inbox". */
export function sendEmail({ to, subject, text }) {
  outbox.push({ to, subject, text, at: Date.now() });
  const dir = process.env.LFID_MAIL_DIR;
  if (dir) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, \`\${Date.now()}-\${String(to).replace(/[^a-z0-9]/gi, '_')}.txt\`), \`To: \${to}\\nSubject: \${subject}\\n\\n\${text}\\n\`);
  }
  return { queued: true };
}

export const mailbox = {
  outbox,
  /** The most recent message, optionally to one address. */
  last: (to) => [...outbox].reverse().find((m) => !to || m.to === to) ?? null,
  count: (to) => outbox.filter((m) => !to || m.to === to).length,
  clear: () => { outbox.length = 0; },
};`,
  server06: `// src/server.js — LabFlow ID v0.5 (end of Chapter 5). Fixed so far:
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

// lesson 6.1, 6.4: register. On a duplicate email we do NOT say "taken" — we hash anyway (same timing) and send a
// "you already have an account" email instead, so sign-up cannot be used to enumerate accounts. The account is unverified.
app.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body ?? {};
  const problems = checkNewPassword(password, { email, blocklist: BLOCKLIST });
  if (!problems.length) {
    const seen = await pwnedCount(password);
    if (seen > 0) problems.push('BREACHED');
    if (seen === null) log.warn('pwned-passwords check unavailable; accepted without it');
  }
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  const normEmail = String(email ?? '').trim().toLowerCase();
  const passwordHash = await hashPassword(password);   // hash in BOTH branches, so timing never reveals whether the email is taken
  const existing = await users.findByEmail(normEmail);
  if (existing) {
    sendEmail({ to: normEmail, subject: 'You already have a LabFlow account',
      text: 'Someone tried to register with this address. If it was you, sign in or reset your password — there is nothing else to do.' });
  } else {
    const user = await users.create({ email: normEmail, name: name ?? '', passwordHash });
    const { token } = await life.issueToken(user.id, 'verify_email');
    sendEmail({ to: normEmail, subject: 'Verify your LabFlow email',
      text: \`Welcome. Confirm this address within 30 minutes: https://id.labflow.example/verify?token=\${token}\` });
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
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!/^[^@\\s]+@[^@\\s]+$/.test(email)) return res.status(422).json({ error: 'BAD_EMAIL' });
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

app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? 'INTERNAL' }));

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(\`LabFlow ID v0.6 on http://localhost:\${port} (JWKS kid \${ACTIVE_KID})\`));`,
  users: `// src/users.js — the users table (PostgreSQL), shaped as the small "store" that signIn() expects.
import { q } from './db.js';

const row = (r) => r && { id: r.id, email: r.email, name: r.name, role: r.role, passwordHash: r.password_hash,
  mustChangePassword: r.must_change_password, emailVerifiedAt: r.email_verified_at ? +r.email_verified_at : null,
  status: r.status ?? 'active' };

export const users = {
  // Chapter 6: an active account only (a deleted one is gone from every flow). signIn and reset use this.
  async findByEmail(email) {
    return row((await q(\`SELECT * FROM users WHERE email = $1 AND status = 'active'\`, [email])).rows[0]);
  },
  async findById(id) {
    return row((await q('SELECT * FROM users WHERE id = $1', [id])).rows[0]);
  },
  // Chapter 6: a new account starts UNVERIFIED (email_verified_at is null) until the address is proven (lesson 6.2).
  async create({ email, name, role = 'STUDENT', passwordHash }) {
    const r = await q(\`INSERT INTO users (id, email, name, role, password_hash)
      VALUES ('usr_' || nextval('user_seq'), $1, $2, $3, $4) RETURNING *\`, [email.trim().toLowerCase(), name, role, passwordHash]);
    return row(r.rows[0]);
  },
  async updateHash(id, passwordHash) {
    await q('UPDATE users SET password_hash = $2 WHERE id = $1', [id, passwordHash]);
  },
  // Changing the email un-verifies it: the new address must be proven too (lesson 6.5).
  async updateEmail(id, email) {
    await q('UPDATE users SET email = $2, email_verified_at = NULL WHERE id = $1', [id, email]);
  },
  async flagMustChange(id) {
    await q('UPDATE users SET must_change_password = true WHERE id = $1', [id]);
  },
  async markEmailVerified(id, t = Date.now()) {
    await q('UPDATE users SET email_verified_at = $2 WHERE id = $1', [id, new Date(t)]);
  },
  async setStatus(id, status) {
    await q('UPDATE users SET status = $2 WHERE id = $1', [id, status]);
  },
};`,
  grader: `// scripts/cham-lab-6.mjs — the grader of Lab 6 (LabFlow ID's account-lifecycle layer). 6 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-6.mjs <folder with index.js>     e.g.  node scripts/cham-lab-6.mjs lab6/my
// It gives YOUR lifecycle() an in-memory store, a fake clock and a recording mailer, then drives verification, reset,
// single-use, purpose and the enumeration-safe reset request. No database, no real email.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { memoryStore } from '../src/lifecycle/memory-store.js';

const dir = path.resolve(process.argv[2] ?? 'lab6/my');
const file = path.join(dir, 'index.js');
const m = await import(pathToFileURL(file).href);

let CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
const now = () => CLOCK;
const tick = (ms) => (CLOCK += ms);
const layer = () => m.lifecycle({ store: memoryStore(), now, verifyTtlMs: 30 * 60e3, resetTtlMs: 15 * 60e3 });
const usersWith = (list) => ({ findByEmail: async (e) => list.find((u) => u.email === e) ?? null });

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : \`your code threw \${e?.name ?? 'Error'}: \${String(e?.message ?? e).split('\\n')[0]}\`; }
  results.push({ name, points, ok: !why, why });
}

// ── T1 issue + consume round trip ──
await check('T1 issueToken + consumeToken: a token verifies the right user', 1.5, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const v = await life.issueToken('usr_1', 'verify_email');
  expect(typeof v.token === 'string' && v.token.length > 20, 'issueToken must return a { token }');
  tick(1000);
  expect((await life.consumeToken('verify_email', v.token)).userId === 'usr_1', 'a fresh token must consume to its user');
});

// ── T2 single-use ──
await check('T2 a token is single-use: the second consume fails', 2, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const v = await life.issueToken('usr_1', 'verify_email');
  tick(1000);
  expect((await life.consumeToken('verify_email', v.token)).userId === 'usr_1', 'the first consume must succeed');
  expect((await life.consumeToken('verify_email', v.token)).error === 'USED', 'the second consume must return USED');
});

// ── T3 purpose-bound ──
await check('T3 a token is purpose-bound: a reset token cannot verify an email', 1.5, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const r = await life.issueToken('usr_2', 'reset_password');
  tick(1000);
  expect((await life.consumeToken('verify_email', r.token)).error === 'INVALID', 'a reset token used to verify must be INVALID');
  expect((await life.consumeToken('reset_password', r.token)).userId === 'usr_2', 'the same token must consume for its own purpose');
});

// ── T4 expiry ──
await check('T4 tokens expire: reset after 15 min, verify after 30 min', 1.5, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const r = await life.issueToken('usr_1', 'reset_password');
  expect((await life.consumeToken('reset_password', r.token, { at: CLOCK + 16 * 60e3 })).error === 'EXPIRED', 'a reset token must be EXPIRED after 16 min');
  const v = await life.issueToken('usr_1', 'verify_email');
  expect((await life.consumeToken('verify_email', v.token, { at: CLOCK + 29 * 60e3 })).userId === 'usr_1', 'a verify token must still work at 29 min');
  const v2 = await life.issueToken('usr_1', 'verify_email');
  expect((await life.consumeToken('verify_email', v2.token, { at: CLOCK + 31 * 60e3 })).error === 'EXPIRED', 'a verify token must be EXPIRED after 31 min');
});

// ── T5 enumeration-safe reset: only a real, active account is mailed ──
await check('T5 requestPasswordReset mails a real account and NOTHING to a non-existent one', 2, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const users = usersWith([{ id: 'usr_1', email: 'an@x', status: 'active' }]);
  const sent = [];
  await life.requestPasswordReset(users, 'an@x', { send: (msg) => sent.push(msg), sync: true });
  await life.requestPasswordReset(users, 'nobody@x', { send: (msg) => sent.push(msg), sync: true });
  expect(sent.length === 1, \`exactly one email should be sent (to the real account), got \${sent.length} — a "no account" email to a stranger leaks which emails exist\`);
  expect(sent[0].to === 'an@x', 'the one email must go to the real account');
});

// ── T6 deleted account, and a bad token ──
await check('T6 a deleted account is not mailed; a bad token never crashes', 1.5, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const users = usersWith([{ id: 'usr_9', email: 'gone@x', status: 'deleted' }]);
  const sent = [];
  await life.requestPasswordReset(users, 'gone@x', { send: (msg) => sent.push(msg), sync: true });
  expect(sent.length === 0, 'a deleted account must not receive a reset email');
  expect((await life.consumeToken('reset_password', 'lfid_reset_nope')).error === 'INVALID', 'an unknown token must be INVALID, not a crash');
});

const src = fs.readFileSync(file, 'utf8');
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 6 — \${path.relative(process.cwd(), file)}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(68)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
if (/No account|no such account|does not exist/i.test(src)) console.log('! your source emails a "no account" message — never tell a stranger whether an email is registered (lesson 6.4)');
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  yeu: `// lab6/yeu/index.js — a first attempt that "works": it issues and consumes tokens and emails a reset link. But it never
// marks a token used, it does not bind a token to its purpose, and — trying to be helpful — it emails "no account found"
// to a stranger, which is exactly how an attacker enumerates who is registered.
import { newToken, tokenDigest } from '../../src/crypto/index.js';

export function lifecycle({ store, now = () => Date.now(), verifyTtlMs = 30 * 60e3, resetTtlMs = 15 * 60e3 }) {
  async function issueToken(userId, purpose) {
    const token = newToken(purpose === 'reset_password' ? 'lfid_reset' : 'lfid_verify');
    const t = now();
    const row = { id: newToken('ott'), userId, purpose, digest: tokenDigest(token), createdAt: t,
      expiresAt: t + (purpose === 'reset_password' ? resetTtlMs : verifyTtlMs), usedAt: null };
    await store.insert(row);
    return { token, row };
  }
  async function consumeToken(purpose, token, { at = now() } = {}) {
    const rec = await store.getByDigest(tokenDigest(String(token)));
    if (!rec) return { error: 'INVALID' };
    if (at >= rec.expiresAt) return { error: 'EXPIRED' };
    return { userId: rec.userId };          // no single-use, no purpose check — looks fine, until it isn't
  }
  async function requestPasswordReset(users, email, { send }) {
    const user = await users.findByEmail(String(email ?? '').trim().toLowerCase());
    if (user) {
      const { token } = await issueToken(user.id, 'reset_password');
      send({ to: user.email, subject: 'Reset your password', text: \`Reset: https://id.labflow.example/reset?token=\${token}\` });
    } else {
      send({ to: email, subject: 'No account found', text: 'There is no LabFlow account for this email. Would you like to register?' });
    }
    return { ok: true };
  }
  return { issueToken, consumeToken, requestPasswordReset };
}`,
};
export const OUT = {
  '61-register': `$ bash demo6/register.sh
$ curl -s -X POST localhost:4800/sign-up  (email: newbie@student.labflow.example)
{"ok":true,"message":"Check your email to finish signing up."}

$ # the verification email that landed in the dev mailbox:
To: newbie@student.labflow.example
Subject: Verify your LabFlow email

Welcome. Confirm this address within 30 minutes: https://id.labflow.example/verify?token=lfid_verify_mXmC2qxW…

$ # the user clicks the link and confirms (POST consumes the one-time token):
{"ok":true,"verified":true}
$ # clicking the same link again — the token is single-use:
{"error":"USED"}`,
  '62-scanner': `$ bash demo6/scanner.sh
$ # a mail scanner PREFETCHES the link (GET) — it is safe and consumes nothing:
<!doctype html><title>Confirm your email</title>    <form method="POST" action="/verify-email"><input type="hidden" name="token" value="lfid_verify_…">    <button>Confirm my email</button></form>

$ # the real user clicks (POST) — now the token is consumed:
{"ok":true,"verified":true}

$ # sign up again with an email that already exists — same 202, no "taken" leak:
{"ok":true,"message":"Check your email to finish signing up."}
$ # and the mailbox shows a "you already have an account" note instead of a verify link:
Subject: You already have a LabFlow account`,
  '63-reset': `$ bash demo6/reset.sh
$ # An is signed in (session + refresh cookie):
  /me → an@student.labflow.example

$ curl -s -X POST localhost:4800/forgot-password  (email: an@student.labflow.example)
{"ok":true,"message":"If an account exists for that address, a reset link is on its way."}
$ # the reset email (one-time link, 15 minutes):
Someone asked to reset your password. If it was you, use this one-time link within 15 minutes: https://id.labflow.example/reset?token=lfid_reset_EyzIkPHD…  — if not, ignore this email.

$ curl -s -X POST localhost:4800/reset-password  (token + a new password)
{"ok":true,"message":"Password reset. Sign in with your new password."}

$ # An’s old refresh cookie is now dead — every session and family was revoked:
{"error":"REVOKED"}
$ # the reset link cannot be used a second time:
{"error":"USED"}`,
  '64-enum': `$ node demo6/enum-timing.mjs
1a) /forgot-password-naive — same WORDING, but it AWAITS the token insert + email send (the teaching foil):
   real account : median 1.98 ms
   fake account : median 1.07 ms
   LEAK         : the real account is 0.92 ms slower — an attacker enumerates by TIMING, not wording

1b) /forgot-password — same response AND the insert + mail are NOT awaited (the fix):
   real account : median 1.13 ms
   fake account : median 1.07 ms
   difference   : 0.06 ms — within noise; the slow work is off the response path

2) /sign-up — the password is hashed in BOTH branches (taken and free), so argon2 dominates both:
   email taken  : median 194.6 ms
   email free   : median 199.1 ms
   ratio        : 1.02x  (argon2 ~86 ms in both — the leak is closed by doing the same work)`,
  '65-change-delete': `$ bash demo6/change-delete.sh
$ curl -s -X POST localhost:4800/me/email  (change to lan.new@labflow.example)
{"ok":true,"email":"lan.new@labflow.example","verificationSent":true}
$ # the new address is UN-verified and gets its own verification email:
Subject: Verify your new LabFlow email

$ curl -s -X POST localhost:4800/me/delete  (re-auth with the password)
{"ok":true,"deleted":true}
$ # the account is gone — sign-in now fails like any unknown email:
{"error":"Email or password is incorrect"}`,
  'lab-bat-dau': `$ node scripts/cham-lab-6.mjs lab6/starter
Lab 6 — lab6/starter/index.js
✗ T1 issueToken + consumeToken: a token verifies the right user        0/1.5
    ↳ your code threw Error: not implemented
✗ T2 a token is single-use: the second consume fails                   0/2
    ↳ your code threw Error: not implemented
✗ T3 a token is purpose-bound: a reset token cannot verify an email    0/1.5
    ↳ your code threw Error: not implemented
✗ T4 tokens expire: reset after 15 min, verify after 30 min            0/1.5
    ↳ your code threw Error: not implemented
✗ T5 requestPasswordReset mails a real account and NOTHING to a non-existent one 0/2
    ↳ your code threw Error: not implemented
✗ T6 a deleted account is not mailed; a bad token never crashes        0/1.5
    ↳ your code threw Error: not implemented
! your source emails a "no account" message — never tell a stranger whether an email is registered (lesson 6.4)
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test 2>&1 | grep -v 'npm notice'

> labflow-id@0.5.0 test
> node --test --test-reporter=spec "test/**/*.test.js"

✔ newToken: prefix + 43 base64url chars, and checks its arguments (0.720875ms)
✔ tokenDigest is SHA-256 hex (0.289208ms)
✔ safeEqual: equal, different, different lengths, not strings (0.183791ms)
✔ signed value: round trip, tampering, expiry boundary (0.349916ms)
✔ signed value: key rotation and malformed input (0.173083ms)
✔ redact keeps only allowed keys, deeply (0.40775ms)
✔ issue + verify: round trip with the seven claims (1.562084ms)
✔ alg: none is rejected (algorithm comes from the key, not the header) (0.346833ms)
✔ HS/RS confusion is rejected (public key used as an HMAC secret) (0.876ms)
✔ unknown or missing kid is rejected (0.195459ms)
✔ tampered payload is rejected (signature covers header.payload) (0.331709ms)
✔ claims: iss, aud, sub, exp, nbf, iat, jti each enforced (1.383ms)
✔ exp boundary and clock skew (0.5665ms)
✔ revocation by jti (0.309125ms)
✔ key rotation: two live keys verify, a dropped key does not (0.510209ms)
✔ interop with jose (both directions) (6.73675ms)
✔ one-time token: issue and consume round trip (1.285833ms)
✔ single-use: a consumed token is rejected the second time (0.198083ms)
✔ purpose-bound: a reset token cannot verify an email, and vice versa (0.112709ms)
✔ expiry: a reset token is dead after 15 minutes, a verify token after 30 (0.418958ms)
✔ an unknown token is INVALID, never a crash (0.129875ms)
✔ requestPasswordReset emails only a real, active account (0.1755ms)
✔ requestPasswordReset does not email a deleted account (0.137583ms)
✔ hash is argon2id with the measured parameters and a fresh salt (157.844ms)
✔ NFC: precomposed and decomposed Vietnamese verify the same (147.74425ms)
✔ bcrypt verifies and asks for a rehash; a wrong password never does (200.446125ms)
✔ policy: length, blocklist, context — no composition rules (0.553458ms)
✔ signIn: one answer for both failures, upgrade on success (349.537958ms)
✔ issue + rotate: a fresh token each time, same family (1.223458ms)
✔ reuse of a rotated token revokes the whole family (0.409041ms)
✔ the refresh race: the same token rotated twice within grace returns the same child (0.188208ms)
✔ outside the grace window, the same second use is treated as theft (0.121792ms)
✔ invalid, expired and revoked tokens are rejected without flagging theft (0.196959ms)
✔ device list and revocation (0.231875ms)
✔ a rotated family still appears as one device (not one per rotation) (0.240542ms)
✔ cookie: __Host- prefix, HttpOnly, Secure, SameSite=Lax, Path=/ (0.988042ms)
✔ sign-in replaces a planted session (fixation) (0.317083ms)
✔ idle 30 min and absolute 12 h (0.81925ms)
✔ csrf: cross-site and foreign Origin get 403; same-origin and non-browser clients pass (0.129291ms)
ℹ tests 39
ℹ suites 0
ℹ pass 39
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1002.820042`,
  'lab-tham-khao': `$ node scripts/cham-lab-6.mjs lab6/tham-khao
Lab 6 — lab6/tham-khao/index.js
✓ T1 issueToken + consumeToken: a token verifies the right user        1.5/1.5
✓ T2 a token is single-use: the second consume fails                   2/2
✓ T3 a token is purpose-bound: a reset token cannot verify an email    1.5/1.5
✓ T4 tokens expire: reset after 15 min, verify after 30 min            1.5/1.5
✓ T5 requestPasswordReset mails a real account and NOTHING to a non-existent one 2/2
✓ T6 a deleted account is not mailed; a bad token never crashes        1.5/1.5
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-6.mjs lab6/yeu
Lab 6 — lab6/yeu/index.js
✓ T1 issueToken + consumeToken: a token verifies the right user        1.5/1.5
✗ T2 a token is single-use: the second consume fails                   0/2
    ↳ the second consume must return USED
✗ T3 a token is purpose-bound: a reset token cannot verify an email    0/1.5
    ↳ a reset token used to verify must be INVALID
✓ T4 tokens expire: reset after 15 min, verify after 30 min            1.5/1.5
✗ T5 requestPasswordReset mails a real account and NOTHING to a non-existent one 0/2
    ↳ exactly one email should be sent (to the real account), got 2 — a "no account" email to a stranger leaks which emails exist
✗ T6 a deleted account is not mailed; a bad token never crashes        0/1.5
    ↳ a deleted account must not receive a reset email
! your source emails a "no account" message — never tell a stranger whether an email is registered (lesson 6.4)
TOTAL 3/10 — NOT YET (pass = 7)`,
};
