// demo0/gates.js — lesson 0.2: identification, authentication and authorization are three separate gates.
import express from 'express';

const users = [
  { id: 'usr_1', name: 'Nguyen Van An', role: 'STUDENT', email: 'an@student.labflow.example', phone: '0901 000 001' },
  { id: 'usr_2', name: 'Tran Thi Binh', role: 'STUDENT', email: 'binh@student.labflow.example', phone: '0901 000 002' },
  { id: 'usr_3', name: 'Co Lan', role: 'LAB_MANAGER', email: 'lan@labflow.example', phone: '0901 000 003' },
];
// Demo credentials only (Chapter 3 replaces them with real sessions).
const TOKENS = new Map([['tok_an', 'usr_1'], ['tok_bin', 'usr_2'], ['tok_lan', 'usr_3']]);
const find = (id) => users.find((u) => u.id === id);

const app = express();
app.use(express.json());

// Gate 1 only — identification: the client SAYS who it is, nobody checks.
app.get('/v1/me', (req, res) => {
  const user = find(req.get('x-user-id'));
  if (!user) return res.status(400).json({ error: 'Send X-User-Id' });
  res.json(user);
});

// Gate 2 — authentication: prove it.
function authenticate(req, res, next) {
  const token = (req.get('authorization') ?? '').replace(/^Bearer /, '');
  const user = find(TOKENS.get(token));
  if (!user) {
    return res.status(401).set('WWW-Authenticate', 'Bearer realm="labflow-id"').json({ error: 'UNAUTHENTICATED' });
  }
  req.user = user;
  next();
}

// Gates 1 + 2, gate 3 forgotten: any signed-in user can read any profile (IDOR).
app.get('/v2/users/:id', authenticate, (req, res) => {
  const user = find(req.params.id);
  if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json(user);
});

// All three gates. Gate 3 lives in the lookup itself: yourself, or a lab manager.
app.get('/v3/users/:id', authenticate, (req, res) => {
  const allowed = req.user.id === req.params.id || req.user.role === 'LAB_MANAGER';
  const user = allowed ? find(req.params.id) : undefined;
  if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json(user);
});

// 403: we know exactly who you are, and the answer is still no.
app.patch('/v3/users/:id/role', authenticate, (req, res) => {
  if (req.user.role !== 'LAB_MANAGER') return res.status(403).json({ error: 'FORBIDDEN' });
  const user = find(req.params.id);
  if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
  user.role = req.body.role;
  res.json(user);
});

app.listen(4800, () => console.log('demo0/gates.js on http://localhost:4800'));
