// Lesson 10.5 — the whole course in one small app: page → fetch → HTTP → session → validation → SQL → JSON → DOM.
// Node 22 only (node:http, node:sqlite, node:crypto). Every layer logs one line, tagged with the request number.
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const PORT = Number(process.env.PORT ?? 3460);
const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL);
  CREATE TABLE notes (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
                      title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80), created_at TEXT NOT NULL DEFAULT (datetime('now')));
`);
const hash = (pw, salt) => crypto.scryptSync(pw, salt, 32).toString('hex');
const salt = 'demo-salt-1';
db.prepare('INSERT INTO users (email, password_hash, salt) VALUES (?, ?, ?)').run('an@example.com', hash('correct horse battery', salt), salt);
db.prepare('INSERT INTO notes (user_id, title) VALUES (1, ?), (1, ?)').run('Learn HTTP', 'Learn SQL');

const sessions = new Map();                                   // sid → user id (Lesson 7.2)
let seq = 0;

function sql(id, text, params) {                              // run a query and log it (Chapter 8)
  const stmt = db.prepare(text);
  const isSelect = /^\s*SELECT/i.test(text);
  const result = isSelect ? stmt.all(...params) : stmt.run(...params);
  log(id, 'sql   ', text.replace(/\s+/g, ' ').trim(), JSON.stringify(params), '→', isSelect ? result.length + ' rows' : 'id ' + result.lastInsertRowid);
  return result;
}
function log(id, layer, ...rest) { console.log('[req ' + id + '] ' + layer + ' ' + rest.join(' ')); }
function send(res, id, status, body, headers = {}) {
  const json = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': typeof body === 'string' ? headers.type ?? 'text/html' : 'application/json', ...headers });
  res.end(json);
  log(id, 'reply ', status, http.STATUS_CODES[status]);
}
function readJson(req) {
  return new Promise((resolve) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { try { resolve(JSON.parse(b || '{}')); } catch { resolve(null); } }); });
}
function currentUser(req) {
  const sid = /(?:^|;\s*)sid=([^;]+)/.exec(req.headers.cookie ?? '')?.[1];
  return sid ? sessions.get(sid) : undefined;
}

http.createServer(async (req, res) => {
  const id = ++seq;
  const url = new URL(req.url, 'http://x');
  log(id, 'http  ', req.method, url.pathname, req.headers.cookie ? '(cookie: sid=…)' : '(no cookie)');
  if (req.method === 'GET' && url.pathname === '/') return send(res, id, 200, fs.readFileSync(new URL('./page.html', import.meta.url), 'utf8'));
  if (req.method === 'GET' && url.pathname === '/app.js') return send(res, id, 200, fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8'), { type: 'text/javascript' });

  if (req.method === 'POST' && url.pathname === '/login') {
    const body = await readJson(req);
    const [user] = sql(id, 'SELECT id, password_hash, salt FROM users WHERE email = ?', [String(body?.email ?? '')]);
    const ok = user && crypto.timingSafeEqual(Buffer.from(user.password_hash, 'hex'), Buffer.from(hash(String(body.password ?? ''), user.salt), 'hex'));
    log(id, 'auth  ', ok ? 'password ok → new session for user ' + user.id : 'wrong email or password');
    if (!ok) return send(res, id, 401, { error: 'wrong email or password' });
    const sid = crypto.randomBytes(18).toString('base64url');
    sessions.set(sid, user.id);
    return send(res, id, 200, { ok: true }, { 'Set-Cookie': 'sid=' + sid + '; HttpOnly; SameSite=Lax; Path=/' });
  }

  if (url.pathname === '/api/notes') {
    const userId = currentUser(req);
    log(id, 'auth  ', userId ? 'session ok → user ' + userId : 'no valid session');
    if (!userId) return send(res, id, 401, { error: 'log in first' });
    if (req.method === 'GET') {
      return send(res, id, 200, { items: sql(id, 'SELECT id, title FROM notes WHERE user_id = ? ORDER BY id', [userId]) });
    }
    if (req.method === 'POST') {
      const body = await readJson(req);
      const title = typeof body?.title === 'string' ? body.title.trim() : '';
      const problem = !title ? 'title is required' : title.length > 80 ? 'title is longer than 80 characters' : null;
      log(id, 'valid ', problem ? 'rejected: ' + problem : 'ok ' + JSON.stringify({ title }));
      if (problem) return send(res, id, 422, { errors: [problem] });
      const r = sql(id, 'INSERT INTO notes (user_id, title) VALUES (?, ?)', [userId, title]);
      return send(res, id, 201, { id: Number(r.lastInsertRowid), title }, { Location: '/api/notes/' + r.lastInsertRowid });
    }
    return send(res, id, 405, { error: 'method not allowed' }, { Allow: 'GET, POST' });
  }
  send(res, id, 404, { error: 'not found' });
}).listen(PORT, '127.0.0.1', () => console.log('listening on http://localhost:' + PORT));
