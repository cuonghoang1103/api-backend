// demo0/forget.js — lesson 0.1: three ways a server might try to "remember" who you are.
// Only the third one survives real networks — and it is the idea behind every login in this course.
import express from 'express';
import { randomBytes } from 'node:crypto';

const app = express();
app.use(express.json());

// What the server actually receives: a method, a path, some headers. No "who".
app.get('/raw', (req, res) => {
  const lines = [`${req.method} ${req.url} HTTP/${req.httpVersion}`];
  for (let i = 0; i < req.rawHeaders.length; i += 2) lines.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}`);
  res.type('text').send(lines.join('\n') + '\n');
});

// Try 1 — remember by IP address
const byIp = new Map();
app.post('/ip/sign-in', (req, res) => {
  byIp.set(req.ip, req.body.name);
  res.json({ remembered: req.body.name, ip: req.ip });
});
app.get('/ip/me', (req, res) => res.json({ you: byIp.get(req.ip) ?? null, ip: req.ip }));

// Try 2 — remember by TCP connection
app.post('/conn/sign-in', (req, res) => {
  req.socket.who = req.body.name;
  res.json({ remembered: req.body.name, clientPort: req.socket.remotePort });
});
app.get('/conn/me', (req, res) => res.json({ you: req.socket.who ?? null, clientPort: req.socket.remotePort }));

// Try 3 — the client carries proof on every request
const cards = new Map();
app.post('/card/sign-in', (req, res) => {
  const card = randomBytes(16).toString('base64url');
  cards.set(card, req.body.name);
  res.json({ card });
});
app.get('/card/me', (req, res) => res.json({ you: cards.get(req.get('x-card')) ?? null }));

app.listen(4800, () => console.log('demo0/forget.js on http://localhost:4800'));
