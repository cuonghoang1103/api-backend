// chay: tay — Chapter 7 demo app: login with a session cookie, no libraries (Node 22). Run: node app.mjs → http://localhost:3457
// COOKIE_SAMESITE=None node app.mjs  ⇒ the session cookie is sent on cross-site requests too (CSRF demo in Lesson 7.2).
import http from 'node:http';
import crypto from 'node:crypto';

// Passwords are stored as scrypt hashes with a per-user salt (Lesson 7.4) — never as plain text.
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}
function checkPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const again = crypto.scryptSync(password, salt, 32);
  return crypto.timingSafeEqual(again, Buffer.from(hash, 'hex'));
}

const users = [
  { id: 1, email: 'an@example.com', name: 'An', role: 'user', password: hashPassword('correct horse battery') },
  { id: 2, email: 'lan@example.com', name: 'Lan', role: 'admin', password: hashPassword('staple 42 river') },
];
const sessions = new Map();                     // session id → { userId, expires }
const SAMESITE = process.env.COOKIE_SAMESITE || 'Lax';

function send(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(data));
}
function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => resolve(raw));
  });
}
function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').filter(Boolean).map((p) => p.trim().split('=')));
}
function currentUser(req) {
  const sid = parseCookies(req.headers.cookie).sid;
  const s = sid && sessions.get(sid);
  if (!s || s.expires < Date.now()) return null;          // unknown, logged out, or expired
  return users.find((u) => u.id === s.userId);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  console.log(req.method, url.pathname, req.headers.cookie ? `cookie: ${req.headers.cookie}` : '(no cookie)');

  if (req.method === 'POST' && url.pathname === '/login') {
    const { email, password } = JSON.parse((await readBody(req)) || '{}');
    const user = users.find((u) => u.email === email);
    if (!user || !checkPassword(password ?? '', user.password)) {
      return send(res, 401, { error: 'Wrong email or password' });   // same message for both cases
    }
    const sid = crypto.randomBytes(32).toString('base64url');        // unguessable
    sessions.set(sid, { userId: user.id, expires: Date.now() + 60 * 60 * 1000 });
    const secure = SAMESITE === 'None' ? '; Secure' : '';
    return send(res, 200, { name: user.name }, {
      'Set-Cookie': `sid=${sid}; HttpOnly; SameSite=${SAMESITE}; Path=/; Max-Age=3600${secure}`,
    });
  }
  if (req.method === 'POST' && url.pathname === '/logout') {
    sessions.delete(parseCookies(req.headers.cookie).sid);           // the server forgets the session
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'sid=; HttpOnly; Path=/; Max-Age=0' });
  }

  const user = currentUser(req);
  if (url.pathname === '/api/me') {
    if (!user) return send(res, 401, { error: 'Log in first' });     // authentication
    return send(res, 200, { id: user.id, name: user.name, role: user.role });
  }
  if (url.pathname === '/api/admin/users') {
    if (!user) return send(res, 401, { error: 'Log in first' });     // who are you?
    if (user.role !== 'admin') return send(res, 403, { error: 'Admins only' });  // what may you do?
    return send(res, 200, users.map((u) => ({ id: u.id, email: u.email, role: u.role })));
  }
  if (req.method === 'POST' && url.pathname === '/api/transfer') {
    if (!user) return send(res, 401, { error: 'Log in first' });
    const form = new URLSearchParams(await readBody(req));
    console.log(`  → TRANSFER ${form.get('amount')} to ${form.get('to')} from ${user.name}'s account`);
    return send(res, 200, { ok: true, from: user.name, to: form.get('to'), amount: form.get('amount') });
  }
  send(res, 404, { error: 'Not found' });
});
server.listen(Number(process.env.PORT || 3457), () => console.log(`App on http://localhost:${server.address().port} (SameSite=${SAMESITE})`));
