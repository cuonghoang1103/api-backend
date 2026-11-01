// src/server.js — LabFlow ID v0.1 (end of Chapter 1). Fixed so far:
//   hole 3 — session ids come from the CSPRNG (lesson 1.2), and the database keeps only their SHA-256 (lesson 1.3);
//   the request log hides credentials (lesson 1.5).
// Still open: holes 1, 2, 4, 5, 6 — Chapters 2, 3, 6, 10. Never deploy this file.
import express from 'express';
import { load, save } from './store.js';
import { newToken, tokenDigest } from './crypto/index.js';
import { log, requestLog } from './log.js';

const app = express();
app.use(express.json());
app.use(requestLog);

app.post('/sign-up', (req, res) => {
  const { email, password, name } = req.body;
  const db = load();
  const user = { id: 'usr_' + (db.users.length + 1), email, password, name }; // hole 1
  db.users.push(user);
  save(db);
  res.status(201).json({ id: user.id });
});

app.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  const db = load();
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: 'No account with that email' }); // hole 2
  if (user.password !== password) return res.status(401).json({ error: 'Wrong password' });
  const token = newToken('lfid_ses'); // 256 bits from the CSPRNG
  db.sessions.push({ digest: tokenDigest(token), userId: user.id }); // the token itself is never stored; hole 4
  save(db);
  res.json({ session: token }); // hole 5
}); // hole 6

app.get('/me', (req, res) => {
  const db = load();
  const digest = tokenDigest(req.get('x-session') ?? '');
  const session = db.sessions.find((s) => s.digest === digest); // look up by digest: no secret is compared
  if (!session) return res.status(401).json({ error: 'Not signed in' });
  const user = db.users.find((u) => u.id === session.userId);
  res.json({ id: user.id, email: user.email, name: user.name });
});

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(`LabFlow ID v0.1 on http://localhost:${port}`));
