// src/server.js — LabFlow ID v0 (lesson 0.3): a login that runs, and is wrong in six ways.
// Every "hole N" comment is fixed in a later chapter. Never deploy this file.
import express from 'express';
import { load, save } from './store.js';

const app = express();
app.use(express.json());

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
  const session = { id: String(Date.now()), userId: user.id }; // holes 3 and 4
  db.sessions.push(session);
  save(db);
  res.json({ session: session.id }); // hole 5
}); // hole 6: nothing counts the attempts

app.get('/me', (req, res) => {
  const db = load();
  const session = db.sessions.find((s) => s.id === req.get('x-session'));
  if (!session) return res.status(401).json({ error: 'Not signed in' });
  const user = db.users.find((u) => u.id === session.userId);
  res.json({ id: user.id, email: user.email, name: user.name });
});

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => console.log(`LabFlow ID v0 on http://localhost:${port}`));
