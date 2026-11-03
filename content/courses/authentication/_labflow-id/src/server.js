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
const setRefreshCookie = (res, token) => res.append('Set-Cookie', `${RT_COOKIE}=${token}; ${RT_ATTRS}; Max-Age=${30 * 24 * 3600}`);
const clearRefreshCookie = (res) => res.append('Set-Cookie', `${RT_COOKIE}=; ${RT_ATTRS}; Max-Age=0`);
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
      text: `Welcome. Confirm this address within 30 minutes: https://id.labflow.example/verify?token=${token}` });
  }
  res.status(202).json({ ok: true, message: 'Check your email to finish signing up.' });   // same response either way
});

// lesson 6.2: email verification. GET is SAFE — it only shows a confirm page, because scanners and prefetchers GET
// links and must not burn the one-time token. POST consumes it.
app.get('/verify-email', (req, res) => {
  const token = String(req.query.token ?? '');
  res.type('html').send(`<!doctype html><title>Confirm your email</title>
    <form method="POST" action="/verify-email"><input type="hidden" name="token" value="${token.replace(/[^A-Za-z0-9_-]/g, '')}">
    <button>Confirm my email</button></form>`);   // GET consumes nothing; only this click (a POST) does
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
  if (!/^[^@\s]+@[^@\s]+$/.test(email)) return res.status(422).json({ error: 'BAD_EMAIL' });
  await users.updateEmail(req.session.userId, email);
  const { token } = await life.issueToken(req.session.userId, 'verify_email');
  sendEmail({ to: email, subject: 'Verify your new LabFlow email',
    text: `Confirm your new address within 30 minutes: https://id.labflow.example/verify?token=${token}` });
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
app.listen(port, () => log.info(`LabFlow ID v0.6 on http://localhost:${port} (JWKS kid ${ACTIVE_KID})`));
