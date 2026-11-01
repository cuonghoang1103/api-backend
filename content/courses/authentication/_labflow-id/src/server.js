// src/server.js — LabFlow ID v0.3 (end of Chapter 3). Fixed so far:
//   hole 1 — argon2id in PostgreSQL, measured parameters, upgrade on login (Chapter 2);
//   hole 3 — CSPRNG session ids, only their SHA-256 stored (Chapter 1);
//   hole 4 — sessions end: idle 30 min, absolute 12 h, sign-out, sign-out-everywhere (lesson 3.1);
//   hole 5 — the session travels in a __Host- cookie JavaScript cannot read, never in a JSON body (3.2); CSRF checked (3.4);
//   sign-in and every privilege change start a NEW session (3.3).
// Still open: the sign-up half of hole 2 (Chapter 6) and hole 6, unlimited guessing (Chapter 10). Never deploy this file.
import express from 'express';
import { users } from './users.js';
import { hashPassword, verifyPassword, checkNewPassword, loadBlocklist, pwnedCount, signIn } from './passwords/index.js';
import { sessionLayer, pgStore } from './sessions/index.js';
import { log, requestLog } from './log.js';

const BLOCKLIST = loadBlocklist();
const sessions = sessionLayer({ store: pgStore, touchEveryMs: Number(process.env.TOUCH_EVERY_MS ?? 60e3) });
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

// lesson 3.4: the classic CSRF target — change the email, then "forgot password" takes the account
app.post('/me/email', needSession, async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+$/.test(email)) return res.status(422).json({ error: 'BAD_EMAIL' });
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
app.listen(port, () => log.info(`LabFlow ID v0.3 on http://localhost:${port}`));
