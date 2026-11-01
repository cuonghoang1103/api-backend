// src/server.js — LabFlow ID v0.2 (end of Chapter 2). Fixed so far:
//   hole 1 — passwords are argon2id hashes in PostgreSQL, parameters chosen by measurement, old hashes upgraded on login;
//   hole 2 (sign-in half) — one answer and the same work for "no such email" and "wrong password" (lesson 2.3);
//   hole 3 — CSPRNG session ids, only their SHA-256 stored (lessons 1.2, 1.3); credentials never logged (lesson 1.5).
// Still open: holes 4, 5, 6 and the sign-up half of hole 2 — Chapters 3, 6, 10. Never deploy this file.
import express from 'express';
import { q } from './db.js';
import { users } from './users.js';
import { newToken, tokenDigest } from './crypto/index.js';
import { hashPassword, checkNewPassword, loadBlocklist, pwnedCount, signIn } from './passwords/index.js';
import { log, requestLog } from './log.js';

const BLOCKLIST = loadBlocklist();
const app = express();
app.use(requestLog);                     // first, so even a request the body parser rejects (413, bad JSON) gets its log line
app.use(express.json({ limit: '8kb' })); // a password is ≤ 128 characters; nobody needs a 100 kB sign-in body

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
  if (error) return res.status(401).json({ error: 'Email or password is incorrect' }); // one message for both cases
  const common = BLOCKLIST.has(password.normalize('NFC').toLowerCase());
  if (common) await users.flagMustChange(user.id); // lesson 2.4: a known-common password must be changed
  const token = newToken('lfid_ses');
  await q('INSERT INTO sessions (digest, user_id) VALUES ($1, $2)', [tokenDigest(token), user.id]); // hole 4
  res.json({ session: token, mustChangePassword: user.mustChangePassword || common }); // hole 5
}); // hole 6

app.get('/me', async (req, res) => {
  const r = await q(`SELECT u.id, u.email, u.name, u.role FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.digest = $1`, [tokenDigest(req.get('x-session') ?? '')]);
  if (!r.rows[0]) return res.status(401).json({ error: 'Not signed in' });
  res.json(r.rows[0]);
});

// Errors answer with a code, never a stack trace (and never the body that caused them).
app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? 'INTERNAL' }));

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(`LabFlow ID v0.2 on http://localhost:${port}`));
