// The whole LabFlow Lite app for end-to-end tests (Chapter 7): the Chapter 5 API, a demo login, and the built web app.
// Run: npm run build:web && node e2e/server.js   (Playwright starts it for you — see playwright.config.js)
import path from 'node:path';
import express from 'express';
import { createApp } from '../src/api/server.js';
import { createAuth } from '../src/api/auth.js';
import { createMemoryRepo } from '../src/booking/service.js';

const auth = createAuth({ secret: process.env.JWT_SECRET ?? 'e2e-secret-not-for-production' });
const app = createApp({ repo: createMemoryRepo(), auth });

// Demo accounts — this server only ever runs on a developer machine or in CI.
const USERS = { an: 'STUDENT', binh: 'STUDENT', thay: 'LECTURER', boss: 'ADMIN' };
const PASSWORD = 'labflow-demo';

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  const role = USERS[username];
  if (!role || password !== PASSWORD) return res.status(401).json({ error: { code: 'BAD_LOGIN' } });
  res.json({ token: await auth.sign({ id: username, role }), user: { id: username, role } });
});

const dist = path.resolve(import.meta.dirname, '../dist-web');
app.use(express.static(dist));
app.get('/{*page}', (req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = Number(process.env.PORT ?? 4173);
app.listen(port, () => console.log('LabFlow Lite (e2e) on http://localhost:' + port));
