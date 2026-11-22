import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'dev-only-change-me';          // real value comes from .env
const users = [{ id: 1, email: 'an@example.com', hash: await bcrypt.hash('correct horse', 12) },
               { id: 2, email: 'binh@example.com', hash: await bcrypt.hash('battery staple', 12) }];
const plants = [{ id: 10, ownerId: 1, name: 'Monstera' }];
console.log('stored hash looks like:', users[0].hash.slice(0, 7) + '...', '(length ' + users[0].hash.length + ')');

function requireAuth(req, res, next) {
  const token = (req.get('authorization') ?? '').replace('Bearer ', '');
  try { req.user = jwt.verify(token, SECRET); next(); }
  catch { res.status(401).json({ error: { code: 'UNAUTHENTICATED' } }); }
}

const app = express();
app.use(express.json());
app.post('/auth/login', async (req, res) => {
  const u = users.find((x) => x.email === req.body.email);
  if (!u || !(await bcrypt.compare(req.body.password, u.hash))) return res.status(401).json({ error: { code: 'BAD_CREDENTIALS' } });
  res.json({ accessToken: jwt.sign({ sub: u.id }, SECRET, { expiresIn: '15m' }) });
});
app.delete('/plants/:id', requireAuth, (req, res) => {
  const p = plants.find((x) => x.id === Number(req.params.id));
  if (!p) return res.status(404).end();
  if (p.ownerId !== req.user.sub) return res.status(403).json({ error: { code: 'NOT_OWNER' } }); // ownership checked on the SERVER
  plants.splice(plants.indexOf(p), 1); res.status(204).end();
});

const server = app.listen(3008, async () => {
  const base = 'http://localhost:3008';
  const login = async (email, password) => (await (await fetch(base + '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) })).json()).accessToken;
  const del = (token) => fetch(base + '/plants/10', { method: 'DELETE', headers: token ? { authorization: 'Bearer ' + token } : {} }).then((r) => r.status);
  const bad = await fetch(base + '/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'an@example.com', password: 'guess' }) });
  console.log('wrong password   ->', bad.status, await bad.text());
  console.log('no token         ->', await del());
  console.log('Binh deletes #10 ->', await del(await login('binh@example.com', 'battery staple')));
  console.log('An deletes #10   ->', await del(await login('an@example.com', 'correct horse')));
  server.close();
});
