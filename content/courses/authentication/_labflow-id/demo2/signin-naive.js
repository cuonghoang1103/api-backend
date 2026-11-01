// demo2/signin-naive.js — lesson 2.3: the sign-in most tutorials write. Same message for both failures… and an early return.
import express from 'express';
import { users } from '../src/users.js';
import { verifyPassword } from '../src/passwords/index.js';

const app = express();
app.use(express.json());
app.post('/sign-in', async (req, res) => {
  const user = await users.findByEmail(String(req.body.email).toLowerCase());
  if (!user) return res.status(401).json({ error: 'Email or password is incorrect' });   // no hash computed
  const { ok } = await verifyPassword(user.passwordHash, req.body.password);
  if (!ok) return res.status(401).json({ error: 'Email or password is incorrect' });
  res.json({ ok: true });
});
app.listen(4802, () => console.log('demo2/signin-naive.js on http://localhost:4802'));
