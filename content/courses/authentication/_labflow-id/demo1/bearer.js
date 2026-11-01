// demo1/bearer.js — lesson 1.1: whoever holds the token IS the user, and a token in a URL travels further than you think.
import express from 'express';
import { newToken } from '../src/crypto/index.js';

const app = express();
app.use(express.json());
// An access log in nginx's default style: it records the FULL URL, query string included.
// (The user agent is shortened to its product token so the lines fit on a slide.)
const agent = (ua = '') => ua.match(/(HeadlessChrome|Firefox|curl)\/[\d.]+/)?.[0] ?? ua;
app.use((req, res, next) => {
  res.on('finish', () => console.log(`${req.ip} "${req.method} ${req.originalUrl}" ${res.statusCode} "${agent(req.get('user-agent'))}"`));
  next();
});

const tokens = new Map(); // token → name (Chapter 3 stores a digest; here we keep it simple)
app.post('/sign-in', (req, res) => {
  const token = newToken('lfid_ses');
  tokens.set(token, req.body.name);
  res.json({ token });
});
app.get('/me', (req, res) => {
  const who = tokens.get((req.get('authorization') ?? '').replace(/^Bearer /, ''));
  if (!who) return res.status(401).json({ error: 'UNAUTHENTICATED' });
  res.json({ you: who });
});

// A password-reset page reached through a link in an email: the token is IN the URL.
// It loads a same-origin script and a third-party analytics pixel — like most real pages.
app.get('/reset', (req, res) => {
  if (req.query.policy) res.set('Referrer-Policy', req.query.policy);
  res.type('html').send(`<!doctype html><title>Reset your password</title>
<script src="/static/app.js"></script>
<img src="http://127.0.0.1:4801/pixel.gif" alt="">
<form method="post" action="/reset"><input type="password" name="pw"><button>Save</button></form>`);
});
app.get('/static/app.js', (req, res) => {
  console.log(`  ↳ same-origin request, Referer: ${req.get('referer') ?? '(none)'}`);
  res.type('js').send('// app');
});

app.listen(4800, () => console.log('demo1/bearer.js on http://localhost:4800'));
