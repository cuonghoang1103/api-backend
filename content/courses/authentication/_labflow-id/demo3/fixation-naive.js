// demo3/fixation-naive.js — lesson 3.3: the session-fixation bug. A visitor gets an anonymous session (language, cart…);
// signing in UPGRADES that same session instead of issuing a new one. Port 4802.
import express from 'express';
import { randomBytes } from 'node:crypto';
import { users } from '../src/users.js';
import { signIn } from '../src/passwords/index.js';
import { readCookie } from '../src/sessions/index.js';

const sessions = new Map(); // sid → { lang, userId }
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  let sid = readCookie(req.headers.cookie, 'sid');
  if (!sid || !sessions.has(sid)) {
    sid = randomBytes(32).toString('base64url');
    sessions.set(sid, { lang: 'vi', userId: null });
    res.append('Set-Cookie', `sid=${sid}; Path=/; HttpOnly; SameSite=Lax`);
  }
  req.sid = sid; req.session = sessions.get(sid);
  next();
});
app.get('/', (req, res) => res.json({ lang: req.session.lang }));
app.post('/sign-in', async (req, res) => {
  const { user, error } = await signIn(users, req.body.email, req.body.password);
  if (error) return res.status(401).json({ error });
  req.session.userId = user.id;            // ← the bug: same sid, now signed in
  res.json({ ok: true });
});
app.get('/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not signed in' });
  res.json({ id: req.session.userId, email: (await users.findById(req.session.userId)).email });
});
app.listen(4802, () => console.log('demo3/fixation-naive.js on http://localhost:4802'));
