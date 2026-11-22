import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(helmet());                                   // security headers
app.use(express.json({ limit: '10kb' }));            // a 5 MB JSON body is an attack, not a plant
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });
app.post('/auth/login', loginLimiter, (req, res) => res.status(401).json({ error: { code: 'BAD_CREDENTIALS' } }));
app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: { code: err.type ?? 'INTERNAL' } })); // no stack trace to the client

const server = app.listen(3009, async () => {
  const base = 'http://localhost:3009';
  const post = (body) => fetch(base + '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body });
  const r = await post('{}');
  for (const h of ['content-security-policy', 'x-content-type-options', 'strict-transport-security', 'x-powered-by']) console.log(h.padEnd(26), r.headers.get(h));
  const codes = []; for (let i = 0; i < 6; i++) codes.push((await post('{}')).status);
  console.log('6 more login attempts ->', codes.join(' '));
  const big = await fetch(base + '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ x: 'a'.repeat(20000) }) });
  console.log('20 KB body ->', big.status, await big.text());
  server.close();
});
