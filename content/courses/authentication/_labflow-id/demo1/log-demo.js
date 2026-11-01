// demo1/log-demo.js — lesson 1.5: three ways to log the same sign-in request. Only the last one is safe.
import express from 'express';
import pino from 'pino';
import { redact } from '../src/crypto/index.js';

const app = express();
app.use(express.json());

// 1) What everyone writes on day one.
app.post('/naive/sign-in', (req, res) => {
  console.log('sign-in', { headers: req.headers, body: req.body });
  res.json({ ok: true });
});

// 2) A deny-list: hide the fields we THOUGHT of.
const denyLog = pino({ base: null, timestamp: false, redact: ['headers.authorization', 'headers.cookie', 'body.password'] });
app.post('/deny/sign-in', (req, res) => {
  denyLog.info({ headers: req.headers, body: req.body }, 'sign-in');
  res.json({ ok: true });
});

// 3) An allow-list: log only the fields we DECIDED are safe; everything else is hidden, even fields added next year.
const log = pino({ base: null, timestamp: false });
const SAFE = ['headers', 'host', 'user-agent', 'content-type', 'body', 'email'];
app.post('/allow/sign-in', (req, res) => {
  log.info(redact({ headers: req.headers, body: req.body }, SAFE), 'sign-in');
  res.json({ ok: true });
});

app.listen(4800, () => console.log('demo1/log-demo.js on http://localhost:4800'));
