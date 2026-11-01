// demo3/csrf-target.mjs — lesson 3.4: a tiny "change my email" service with ONE cookie and a choice of CSRF defence.
//   cookie: SameSite=None | Lax | (unset);  defence: none | fetch-metadata | token
import express from 'express';
import { createHmac, randomBytes } from 'node:crypto';
import { safeEqual } from '../src/crypto/index.js';

export function csrfTarget({ sameSite, defence }) {
  const sessions = new Map();                                  // sid → { email }
  const KEY = randomBytes(32);
  const csrfToken = (sid) => createHmac('sha256', KEY).update(sid).digest('base64url'); // synchronizer token, bound to the session
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  const sidOf = (req) => (req.headers.cookie ?? '').match(/(?:^|; )sid=([^;]+)/)?.[1];
  app.get('/login', (req, res) => {
    const sid = randomBytes(32).toString('base64url');
    sessions.set(sid, { email: 'an@student.labflow.example' });
    res.append('Set-Cookie', `sid=${sid}; Path=/; HttpOnly${sameSite ? `; SameSite=${sameSite}` : ''}${sameSite === 'None' ? '; Secure' : ''}`);
    res.send('signed in');
  });
  app.get('/settings', (req, res) => res.type('html').send(`<form id="f" method="POST" action="/email">
<input name="email" value="an.new@student.labflow.example"><input type="hidden" name="csrf" value="${csrfToken(sidOf(req) ?? '')}"></form>`));
  app.post('/email', (req, res) => {
    const s = sessions.get(sidOf(req));
    if (!s) return res.status(401).send('not signed in');
    if (defence === 'fetch-metadata' && !['same-origin', 'none'].includes(req.headers['sec-fetch-site'] ?? 'none')) return res.status(403).send('cross-site');
    if (defence === 'token' && !safeEqual(req.body.csrf ?? '', csrfToken(sidOf(req)))) return res.status(403).send('bad csrf token');
    s.email = req.body.email;
    res.send('email changed');
  });
  app.get('/state', (req, res) => res.json(sessions.get(sidOf(req)) ?? null));
  app.get('/reset', (req, res) => { const s = sessions.get(sidOf(req)); if (s) s.email = 'an@student.labflow.example'; res.send('reset'); });
  return app;
}
