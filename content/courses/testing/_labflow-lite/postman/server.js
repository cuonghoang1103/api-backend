// LabFlow Lite API for the Postman chapter (Chapter 10B): the Chapter 5 API + a demo login + a tiny OAuth 2.0 token endpoint.
// Run: node postman/server.js   (PORT, TOKEN_TTL, ALLOW_RESET from the environment)
import express from 'express';
import { createApp } from '../src/api/server.js';
import { createAuth } from '../src/api/auth.js';
import { createMemoryRepo } from '../src/booking/service.js';

const auth = createAuth({ secret: process.env.JWT_SECRET ?? 'postman-secret-not-for-production' });
const TTL = Number(process.env.TOKEN_TTL ?? 3600);
let repo = createMemoryRepo();
const app = express();
app.use(express.urlencoded({ extended: false }));

// Demo accounts — this server only ever runs on a developer machine or in CI.
const USERS = { an: 'STUDENT', binh: 'STUDENT', thay: 'LECTURER', boss: 'ADMIN' };
const PASSWORD = 'labflow-demo';
app.post('/api/login', express.json(), async (req, res) => {
  const { username, password } = req.body ?? {};
  const role = USERS[username];
  if (!role || password !== PASSWORD) return res.status(401).json({ error: { code: 'BAD_LOGIN' } });
  res.json({ token: await auth.sign({ id: username, role }, TTL), expiresIn: TTL, user: { id: username, role } });
});

// OAuth 2.0 client credentials (RFC 6749 §4.4): a machine, not a person, asks for a token.
const CLIENTS = { 'report-bot': { secret: 'bot-secret-demo', role: 'ADMIN', scope: 'bookings:read' } };
app.post('/oauth/token', (req, res, next) => {
  let id = req.body.client_id, secret = req.body.client_secret;
  const basic = req.get('authorization') ?? '';
  if (basic.startsWith('Basic ')) [id, secret] = Buffer.from(basic.slice(6), 'base64').toString().split(':');
  if (req.body.grant_type !== 'client_credentials') return res.status(400).json({ error: 'unsupported_grant_type' });
  const c = CLIENTS[id];
  if (!c || c.secret !== secret) return res.status(401).json({ error: 'invalid_client' });
  auth.sign({ id, role: c.role }, TTL).then((t) =>
    res.json({ access_token: t, token_type: 'Bearer', expires_in: TTL, scope: c.scope }), next);
});

// Test-only reset so every run starts from an empty store. Never mounted unless ALLOW_RESET=1.
if (process.env.ALLOW_RESET === '1') app.post('/api/test/reset', (req, res) => { repo = createMemoryRepo(); res.status(204).end(); });

// The API reads the store through a proxy, so a reset swaps the data without rebuilding the routes.
app.use(createApp({ repo: new Proxy({}, { get: (_, k) => repo[k] }), auth }));

const port = Number(process.env.PORT ?? 4173);
app.listen(port, () => console.log('LabFlow Lite (postman) on http://localhost:' + port + ' · token TTL ' + TTL + ' s'));
