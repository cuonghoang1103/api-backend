/**
 * _ma.mjs (Chương 3) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  sql002: `-- sql/002_sessions.sql — Chapter 3: each column of a session row answers one question someone will ask in production.
ALTER TABLE sessions
  ADD COLUMN expires_at   timestamptz NOT NULL DEFAULT now() + interval '12 hours', -- absolute end: no session outlives a work day
  ADD COLUMN last_seen_at timestamptz NOT NULL DEFAULT now(),                       -- idle end = last_seen_at + 30 minutes
  ADD COLUMN auth_at      timestamptz NOT NULL DEFAULT now(),                       -- when the password was last proven (step-up, 3.3)
  ADD COLUMN ip           inet,                                                     -- "is this you?" on the devices page (Chapter 5)
  ADD COLUMN user_agent   text;
CREATE INDEX sessions_user_id_idx ON sessions (user_id);                             -- "sign out everywhere" without a full scan`,
  layer: `// src/sessions/layer.js — Chapter 3 = Lab 3 reference: a server-side session behind a cookie that JavaScript cannot read.
// store = { insert(row), get(digest), update(digest, fields), delete(digest), deleteByUser(userId) } — PostgreSQL, Redis or memory.
import { newToken, tokenDigest } from '../crypto/index.js';

export const COOKIE = '__Host-lfid_ses';                       // __Host-: Secure, Path=/, no Domain — enforced by the browser
const ATTRS = 'Path=/; HttpOnly; Secure; SameSite=Lax';

/** Read one cookie from the Cookie header (no library: lesson 0.1's parser). */
export function readCookie(header, name = COOKIE) {
  for (const part of String(header ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export function sessionLayer({ store, now = () => Date.now(), idleMs = 30 * 60e3, absoluteMs = 12 * 3600e3,
  touchEveryMs = 60e3, origins = ['http://localhost:4800'] }) {
  const setCookie = (res, token) => res.append('Set-Cookie', \`\${COOKIE}=\${token}; \${ATTRS}; Max-Age=\${absoluteMs / 1000}\`);
  const clearCookie = (res) => res.append('Set-Cookie', \`\${COOKIE}=; \${ATTRS}; Max-Age=0\`); // same attributes, or it is a new cookie

  /** After a successful sign-in (or any privilege change): a NEW session; the old one, if any, is destroyed (lesson 3.3). */
  async function start(req, res, userId) {
    const old = readCookie(req.headers.cookie);
    if (old) await store.delete(tokenDigest(old));
    const token = newToken('lfid_ses');
    const t = now();
    await store.insert({ digest: tokenDigest(token), userId, createdAt: t, expiresAt: t + absoluteMs, lastSeenAt: t, authAt: t,
      ip: req.ip ?? null, userAgent: req.headers['user-agent'] ?? null });
    setCookie(res, token);
  }

  /** Middleware: req.session = the row, or null. Expired (idle or absolute) ⇒ deleted and the cookie cleared. */
  async function load(req, res, next) {
    req.session = null;
    const token = readCookie(req.headers.cookie);
    if (token) {
      const digest = tokenDigest(token);
      const s = await store.get(digest);
      const t = now();
      if (!s) clearCookie(res);
      else if (t >= s.expiresAt || t - s.lastSeenAt >= idleMs) { await store.delete(digest); clearCookie(res); }
      else {
        if (t - s.lastSeenAt >= touchEveryMs) await store.update(digest, { lastSeenAt: t }); // not a write per request (3.1)
        req.session = { ...s, digest };
      }
    }
    next();
  }

  async function end(req, res) {
    const token = readCookie(req.headers.cookie);
    if (token) await store.delete(tokenDigest(token));
    clearCookie(res);
  }

  const endAll = (userId) => store.deleteByUser(userId);

  /** CSRF layer 2 (lesson 3.4): a state-changing request must come from our own origin. */
  function csrf(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const site = req.headers['sec-fetch-site'];
    if (site) return site === 'same-origin' || site === 'none' ? next() : res.status(403).json({ error: 'CROSS_SITE_REQUEST' });
    const origin = req.headers.origin;
    if (origin && !origins.includes(origin)) return res.status(403).json({ error: 'CROSS_SITE_REQUEST' });
    next();                                                     // no browser metadata at all: curl, a mobile app — not a CSRF vector
  }

  return { start, load, end, endAll, csrf };
}`,
  pgStore: `// src/sessions/pg-store.js — the session store on PostgreSQL (lesson 3.1). Times are epoch milliseconds in JavaScript.
import { q } from '../db.js';

const row = (r) => r ? { userId: r.user_id, createdAt: +r.created_at, expiresAt: +r.expires_at, lastSeenAt: +r.last_seen_at,
  authAt: +r.auth_at, ip: r.ip, userAgent: r.user_agent } : null;
const ts = (ms) => new Date(ms);

export const pgStore = {
  async insert(s) {
    await q(\`INSERT INTO sessions (digest, user_id, created_at, expires_at, last_seen_at, auth_at, ip, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\`, [s.digest, s.userId, ts(s.createdAt), ts(s.expiresAt), ts(s.lastSeenAt), ts(s.authAt), s.ip, s.userAgent]);
  },
  async get(digest) { return row((await q('SELECT * FROM sessions WHERE digest = $1', [digest])).rows[0]); },
  async update(digest, f) {
    if (f.lastSeenAt) await q('UPDATE sessions SET last_seen_at = $2 WHERE digest = $1', [digest, ts(f.lastSeenAt)]);
    if (f.authAt) await q('UPDATE sessions SET auth_at = $2 WHERE digest = $1', [digest, ts(f.authAt)]);
  },
  async delete(digest) { await q('DELETE FROM sessions WHERE digest = $1', [digest]); },
  async deleteByUser(userId) { return (await q('DELETE FROM sessions WHERE user_id = $1', [userId])).rowCount; },
};`,
  memoryStore: `// src/sessions/memory-store.js — the same store in a Map: for tests, the Lab 3 grader, and one-process demos. Not for production
// (a restart signs everyone out, and two processes do not share it — lesson 3.5).
export function memoryStore() {
  const rows = new Map();
  const log = { inserts: 0, updates: 0, deletes: 0 };
  return {
    rows, log,
    async insert(s) { log.inserts++; rows.set(s.digest, { ...s }); },
    async get(digest) { const s = rows.get(digest); return s ? { ...s } : null; },
    async update(digest, f) { log.updates++; if (rows.has(digest)) Object.assign(rows.get(digest), f); },
    async delete(digest) { log.deletes++; rows.delete(digest); },
    async deleteByUser(userId) { let n = 0; for (const [d, s] of rows) if (s.userId === userId) { rows.delete(d); n++; } return n; },
  };
}`,
  server03: `// src/server.js — LabFlow ID v0.3 (end of Chapter 3). Fixed so far:
//   hole 1 — argon2id in PostgreSQL, measured parameters, upgrade on login (Chapter 2);
//   hole 3 — CSPRNG session ids, only their SHA-256 stored (Chapter 1);
//   hole 4 — sessions end: idle 30 min, absolute 12 h, sign-out, sign-out-everywhere (lesson 3.1);
//   hole 5 — the session travels in a __Host- cookie JavaScript cannot read, never in a JSON body (3.2); CSRF checked (3.4);
//   sign-in and every privilege change start a NEW session (3.3).
// Still open: the sign-up half of hole 2 (Chapter 6) and hole 6, unlimited guessing (Chapter 10). Never deploy this file.
import express from 'express';
import { users } from './users.js';
import { hashPassword, verifyPassword, checkNewPassword, loadBlocklist, pwnedCount, signIn } from './passwords/index.js';
import { sessionLayer, pgStore } from './sessions/index.js';
import { log, requestLog } from './log.js';

const BLOCKLIST = loadBlocklist();
const sessions = sessionLayer({ store: pgStore, touchEveryMs: Number(process.env.TOUCH_EVERY_MS ?? 60e3) });
const app = express();
app.use(requestLog);
app.use(express.json({ limit: '8kb' }));
app.use(sessions.load);   // req.session = the row, or null
app.use(sessions.csrf);   // POST/PUT/PATCH/DELETE must come from our own origin

const needSession = (req, res, next) => (req.session ? next() : res.status(401).json({ error: 'Not signed in' }));

app.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body ?? {};
  const problems = checkNewPassword(password, { email, blocklist: BLOCKLIST });
  if (!problems.length) {
    const seen = await pwnedCount(password);
    if (seen > 0) problems.push('BREACHED');
    if (seen === null) log.warn('pwned-passwords check unavailable; accepted without it');
  }
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  const user = await users.create({ email, name, passwordHash: await hashPassword(password) });
  res.status(201).json({ id: user.id });
});

app.post('/sign-in', async (req, res) => {
  const { email, password } = req.body ?? {};
  const { user, error } = await signIn(users, email, password);
  if (error) return res.status(401).json({ error: 'Email or password is incorrect' });
  const common = BLOCKLIST.has(password.normalize('NFC').toLowerCase());
  if (common) await users.flagMustChange(user.id);
  await sessions.start(req, res, user.id);   // new session id, old one destroyed; the token goes in a cookie only
  res.json({ ok: true, mustChangePassword: user.mustChangePassword || common });
});

app.get('/me', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  res.json({ id: u.id, email: u.email, name: u.name, role: u.role });
});

// lesson 3.4: the classic CSRF target — change the email, then "forgot password" takes the account
app.post('/me/email', needSession, async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!/^[^@\\s]+@[^@\\s]+$/.test(email)) return res.status(422).json({ error: 'BAD_EMAIL' });
  await users.updateEmail(req.session.userId, email);
  res.json({ ok: true, email });
});

// lesson 3.3: prove the current password again, change it, sign out every other device, start a fresh session
app.post('/me/password', needSession, async (req, res) => {
  const { current, next: pw } = req.body ?? {};
  const u = await users.findById(req.session.userId);
  if (!(await verifyPassword(u.passwordHash, String(current ?? ''))).ok) return res.status(403).json({ error: 'REAUTH_FAILED' });
  const problems = checkNewPassword(pw, { email: u.email, blocklist: BLOCKLIST });
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  await users.updateHash(u.id, await hashPassword(pw));
  const ended = await sessions.endAll(u.id);
  await sessions.start(req, res, u.id);
  res.json({ ok: true, signedOutSessions: ended });
});

app.post('/sign-out', async (req, res) => { await sessions.end(req, res); res.json({ ok: true }); });
app.post('/sign-out-everywhere', needSession, async (req, res) => {
  res.json({ ok: true, ended: await sessions.endAll(req.session.userId) });
});

app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? 'INTERNAL' }));

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(\`LabFlow ID v0.3 on http://localhost:\${port}\`));`,
  fakeHttp: `// demo3/fake-http.mjs — just enough of req/res to drive the session layer without a server (timeouts, tests).
export function fakeReq(cookie, method = 'GET', headers = {}) {
  return { method, ip: '127.0.0.1', headers: { ...(cookie ? { cookie } : {}), 'user-agent': 'demo', ...headers } };
}
export function fakeRes() {
  const res = { setCookies: [], status: 200, body: null };
  res.append = (name, value) => { if (name.toLowerCase() === 'set-cookie') res.setCookies.push(value); return res; };
  res.status = (code) => { res.code = code; return res; };
  res.json = (b) => { res.body = b; return res; };
  return res;
}
/** The cookie value the response set, or null; '' when it was cleared. */
export const setValue = (res, name = '__Host-lfid_ses') => {
  const c = res.setCookies.find((x) => x.startsWith(name + '='));
  return c ? c.slice(name.length + 1).split(';')[0] : null;
};`,
  timeouts: `// demo3/timeouts.mjs — lesson 3.1: idle timeout (30 min without a request) vs absolute timeout (12 h, active or not).
// A fake clock drives the real session layer; the store is in memory.
import { sessionLayer, memoryStore } from '../src/sessions/index.js';
import { fakeReq, fakeRes, setValue } from './fake-http.mjs';

let clock = Date.UTC(2026, 10, 2, 0, 0);                       // 07:00 in Vietnam
const store = memoryStore();
const layer = sessionLayer({ store, now: () => clock });
const hhmm = () => new Date(clock + 7 * 3600e3).toISOString().slice(11, 16);
const start = async (userId) => { const res = fakeRes(); await layer.start(fakeReq(), res, userId); return \`__Host-lfid_ses=\${setValue(res)}\`; };
const ask = async (cookie) => { const req = fakeReq(cookie); const res = fakeRes(); await layer.load(req, res, () => {});
  return req.session ? 'signed in' : \`NOT signed in\${setValue(res) === '' ? ' (cookie cleared)' : ''}\`; };

const an = await start('usr_1'), binh = await start('usr_2');
console.log(\`\${hhmm()}  An and Binh sign in; An then sends a request every 15 minutes, Binh walks away\`);
clock += 15 * 60e3; console.log(\`\${hhmm()}  An:   \${await ask(an)}\`);
clock += 15 * 60e3; console.log(\`\${hhmm()}  An:   \${await ask(an)}\`);
clock += 1 * 60e3; console.log(\`\${hhmm()}  Binh (31 min without a request): \${await ask(binh)}\`);
clock -= 1 * 60e3;
let n = 0;
while (clock + 15 * 60e3 < Date.UTC(2026, 10, 2, 12, 0)) { clock += 15 * 60e3; n++; await ask(an); }
console.log(\`\${hhmm()}  An after \${n} more requests: \${await ask(an)}\`);
clock += 15 * 60e3; console.log(\`\${hhmm()}  An (12 h after sign-in, still active): \${await ask(an)}\`);
console.log(\`store writes: \${store.log.inserts} inserts, \${store.log.updates} updates (last_seen), \${store.log.deletes} deletes\`);`,
  touchCost: `// demo3/touch-cost.mjs — lesson 3.1: what "update last_seen_at on every request" costs. 1,000 GET /me with one session,
// then PostgreSQL's own counter of updated session rows.  node demo3/touch-cost.mjs <port>
import { pool } from '../src/db.js';
const port = process.argv[2] ?? '4800';
const base = \`http://localhost:\${port}\`;
const res = await fetch(base + '/sign-in', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) });
const cookie = res.headers.get('set-cookie').split(';')[0];
const updated = async () => { await new Promise((r) => setTimeout(r, 11000)); // idle backends flush statistics after ~10 s (PostgreSQL 15+)
  return Number((await pool.query(\`SELECT n_tup_upd FROM pg_stat_user_tables WHERE relname = 'sessions'\`)).rows[0].n_tup_upd); };
const before = await updated();
const ms = [];
for (let i = 0; i < 1000; i++) {
  const t0 = performance.now();
  const r = await fetch(base + '/me', { headers: { cookie } });
  await r.arrayBuffer();
  ms.push(performance.now() - t0);
}
ms.sort((a, b) => a - b);
console.log(\`port \${port}: 1,000 × GET /me in \${(ms.reduce((s, x) => s + x, 0) / 1000).toFixed(2)} s · median \${ms[500].toFixed(2)} ms · p99 \${ms[990].toFixed(2)} ms · sessions rows updated: \${(await updated()) - before}\`);
await pool.end();`,
  devices: `# demo3/devices.sh — lesson 3.1: An on three devices (three cookie jars), then "sign out everywhere" from the laptop.
for d in laptop phone labpc; do
  rm -f /tmp/lfid-$d.jar
  curl -s -o /dev/null -c /tmp/lfid-$d.jar -A "$d" localhost:4800/sign-in -H 'content-type: application/json' \\
    -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
done
for d in laptop phone labpc; do printf '%-7s /me → ' $d; curl -s -b /tmp/lfid-$d.jar localhost:4800/me | cut -c1-40; done
printf 'laptop  POST /sign-out-everywhere → '; curl -s -b /tmp/lfid-laptop.jar -X POST localhost:4800/sign-out-everywhere; echo
for d in laptop phone labpc; do printf '%-7s /me → ' $d; curl -s -b /tmp/lfid-$d.jar localhost:4800/me; echo; done`,
  signInSh: `# demo3/sign-in.sh — lesson 3.1: An signs in to v0.3 (server on :4800). The token arrives ONLY in Set-Cookie.
rm -f /tmp/lfid-an.jar
curl -s -i -c /tmp/lfid-an.jar localhost:4800/sign-in -H 'content-type: application/json' \\
  -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}' | grep -E '^(HTTP|Set-Cookie|\\{)' | sed -E 's/(lfid_ses_.{6})[^;]*/\\1…/'
curl -s -b /tmp/lfid-an.jar localhost:4800/me; echo`,
  sessionsDump: `// demo3/sessions-dump.mjs — lesson 3.1: what one session row looks like (the digest shortened; the token is not there at all).
import { pool } from '../src/db.js';
await pool.query("SET TIME ZONE 'Asia/Ho_Chi_Minh'");
const { rows } = await pool.query(\`SELECT left(digest, 12) || '…' AS digest, user_id, to_char(created_at, 'HH24:MI:SS') AS created,
  to_char(expires_at, 'DD/MM HH24:MI') AS expires, to_char(last_seen_at, 'HH24:MI:SS') AS last_seen, ip, left(user_agent, 12) AS ua
  FROM sessions ORDER BY created_at\`);
console.table(rows);
await pool.end();`,
  cookieLab: `// demo3/cookie-lab.js — lesson 3.2: one origin (http://localhost:4802) that sets cookies with different attributes.
import http from 'node:http';
const CASES = {
  plain: 'plain=1',
  httponly: 'httponly=1; HttpOnly',
  host_ok: '__Host-ok=1; Path=/; Secure; HttpOnly; SameSite=Lax',
  host_no_secure: '__Host-nosecure=1; Path=/; HttpOnly',
  host_domain: '__Host-domain=1; Path=/; Secure; Domain=localhost',
  host_path: '__Host-path=1; Path=/admin; Secure',
  secure_prefix_no_secure: '__Secure-x=1; Path=/',
  path_me: 'scoped=1; Path=/me',
  delete_wrong_path: 'scoped=; Max-Age=0',
  delete_right_path: 'scoped=; Max-Age=0; Path=/me',
};
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/set') { res.setHeader('Set-Cookie', CASES[url.searchParams.get('c')]); return res.end('set'); }
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ path: url.pathname, cookieHeader: req.headers.cookie ?? '' }));
}).listen(4802, () => console.log('demo3/cookie-lab.js on http://localhost:4802'));
export { CASES };`,
  cookieMatrix: `// demo3/cookie-matrix.mjs — lesson 3.2: what real Chromium does with each Set-Cookie of demo3/cookie-lab.js.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const B = 'http://localhost:4802';
const jar = async () => (await ctx.cookies(B + '/me')).map((c) => c.name).concat((await ctx.cookies(B + '/admin')).map((c) => c.name));
console.log(\`Chromium \${browser.version()} · origin \${B}\`);
console.log('case                     stored?  JS sees it?  sent to /me?');
for (const c of ['plain', 'httponly', 'host_ok', 'host_no_secure', 'host_domain', 'host_path', 'secure_prefix_no_secure', 'path_me']) {
  await page.goto(\`\${B}/set?c=\${c}\`);
  const names = [...new Set(await jar())];
  await page.goto(\`\${B}/me\`);
  const sent = JSON.parse(await page.textContent('body')).cookieHeader;
  const visible = await page.evaluate(() => document.cookie);
  const name = { plain: 'plain', httponly: 'httponly', host_ok: '__Host-ok', host_no_secure: '__Host-nosecure', host_domain: '__Host-domain',
    host_path: '__Host-path', secure_prefix_no_secure: '__Secure-x', path_me: 'scoped' }[c];
  const yes = (b) => (b ? 'yes' : 'no ').padEnd(9);
  console.log(\`\${c.padEnd(25)}\${yes(names.includes(name))}\${yes(visible.split('; ').some((p) => p.startsWith(name + '=')))}   \${sent.split('; ').some((p) => p.startsWith(name + '=')) ? 'yes' : 'no'}\`);
}
for (const c of ['delete_wrong_path', 'delete_right_path']) {
  await page.goto(\`\${B}/set?c=\${c}\`);
  console.log(\`\${c.padEnd(25)}scoped still stored: \${(await jar()).includes('scoped') ? 'YES' : 'no'}\`);
}
await browser.close();`,
  samesite: `// demo3/samesite.mjs — lesson 3.2: which cookies real Chromium attaches when ANOTHER site (127.0.0.1:4801) triggers a request
// to LabFlow ID's site (localhost:4802). Four cookies, one per SameSite value; four ways a page can cause a request.
import http from 'node:http';
import { chromium } from 'playwright';

const seen = [];
const bank = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/login') {
    res.setHeader('Set-Cookie', ['strict=1; SameSite=Strict', 'lax=1; SameSite=Lax', 'none=1; SameSite=None; Secure', 'unset=1']);
    return res.end('logged in');
  }
  const names = (req.headers.cookie ?? '').split('; ').filter(Boolean).map((c) => c.split('=')[0]);
  seen.push({ via: url.searchParams.get('via'), method: req.method, site: req.headers['sec-fetch-site'], names });
  res.setHeader('content-type', 'text/html');
  res.end('ok');
}).listen(4802);
const T = 'http://localhost:4802/hit?via=';
const PAGES = {
  link: \`<a id="go" href="\${T}link">open</a>\`,
  form: \`<form id="f" method="POST" action="\${T}form-post"><input name="email" value="evil@attacker.example"></form><script>f.submit()</script>\`,
  img: \`<img src="\${T}img">\`,
  fetch: \`<script>fetch('\${T}fetch-post', { method: 'POST', mode: 'no-cors', credentials: 'include', body: 'x' })</script>\`,
};
const evil = http.createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(PAGES[req.url.slice(1)] ?? ''); }).listen(4801, '127.0.0.1');

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto('http://localhost:4802/login');
const run = async (label) => {
  for (const p of ['link', 'form', 'img', 'fetch']) {
    await page.goto(\`http://127.0.0.1:4801/\${p}\`);
    if (p === 'link') await page.click('#go');
    await page.waitForTimeout(400);
  }
  console.log(label);
  for (const s of seen.splice(0)) console.log(\`  \${(s.via + ' ' + s.method).padEnd(16)} Sec-Fetch-Site: \${String(s.site).padEnd(11)} cookies sent: \${s.names.join(', ') || '(none)'}\`);
};
console.log(\`Chromium \${browser.version()} · site localhost:4802, attacker 127.0.0.1:4801\`);
await run('cookies set seconds ago:');
await page.waitForTimeout(125e3);
await run('125 s later:');
await browser.close(); bank.close(); evil.close();`,
  xss: `// demo3/httponly-xss.mjs — lesson 3.2: HttpOnly stops a script from READING the session cookie, not from USING it.
// "Injected script" = code run inside a LabFlow ID page (an XSS). Server: LabFlow ID v0.3 on :4800.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4800/me');
await page.evaluate(() => fetch('/sign-in', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) }));
const out = await page.evaluate(async () => {
  const post = (email) => fetch('/me/email', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
  const r = await post('attacker@evil.example');
  const after = await (await fetch('/me')).json();
  await post('an@student.labflow.example');                        // put An's email back for the next demos
  return { cookieSeenByScript: document.cookie, emailChange: \`\${r.status} \${await r.text()}\`, meAfter: after.email };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();`,
  fixNaive: `// demo3/fixation-naive.js — lesson 3.3: the session-fixation bug. A visitor gets an anonymous session (language, cart…);
// signing in UPGRADES that same session instead of issuing a new one. Port 4802.
import express from 'express';
import { randomBytes } from 'node:crypto';
import { users } from '../src/users.js';
import { signIn } from '../src/passwords/index.js';
import { readCookie } from '../src/sessions/index.js';

const sessions = new Map(); // sid → { lang, userId }
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  let sid = readCookie(req.headers.cookie, 'sid');
  if (!sid || !sessions.has(sid)) {
    sid = randomBytes(32).toString('base64url');
    sessions.set(sid, { lang: 'vi', userId: null });
    res.append('Set-Cookie', \`sid=\${sid}; Path=/; HttpOnly; SameSite=Lax\`);
  }
  req.sid = sid; req.session = sessions.get(sid);
  next();
});
app.get('/', (req, res) => res.json({ lang: req.session.lang }));
app.post('/sign-in', async (req, res) => {
  const { user, error } = await signIn(users, req.body.email, req.body.password);
  if (error) return res.status(401).json({ error });
  req.session.userId = user.id;            // ← the bug: same sid, now signed in
  res.json({ ok: true });
});
app.get('/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not signed in' });
  res.json({ id: req.session.userId, email: (await users.findById(req.session.userId)).email });
});
app.listen(4802, () => console.log('demo3/fixation-naive.js on http://localhost:4802'));`,
  fixation: `// demo3/fixation.mjs — lesson 3.3: the attacker plants a session id in An's browser, waits for her to sign in, then uses it.
// Planting = context.addCookies (in real life: a sibling subdomain, an XSS on another app of the site, a URL that accepts ?sid=).
import { chromium } from 'playwright';
const json = async (r) => \`\${r.status} \${await r.text()}\`;
const signInInPage = (page, base) => page.evaluate((b) => fetch(b + '/sign-in', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) }).then((r) => r.status), base);
const browser = await chromium.launch();

// 1. the naive server (:4802) — the attacker visits first and keeps the anonymous sid
let r = await fetch('http://localhost:4802/');
const sid = r.headers.get('set-cookie').split(';')[0].slice(4);
console.log(\`naive :4802  attacker got anonymous sid \${sid.slice(0, 8)}…\`);
let ctx = await browser.newContext();
await ctx.addCookies([{ name: 'sid', value: sid, domain: 'localhost', path: '/' }]);
let page = await ctx.newPage();
await page.goto('http://localhost:4802/');
console.log(\`naive :4802  An signs in in her browser → \${await signInInPage(page, 'http://localhost:4802')}; her sid is still \${(await ctx.cookies())[0].value.slice(0, 8)}…\`);
console.log(\`naive :4802  attacker GET /me with his sid → \${await json(await fetch('http://localhost:4802/me', { headers: { cookie: 'sid=' + sid } }))}\`);

// 2. LabFlow ID v0.3 (:4800) — the attacker signs in as Binh and plants HIS valid session in An's browser
r = await fetch('http://localhost:4800/sign-in', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'binh@student.labflow.example', password: '123456' }) });
const planted = r.headers.get('set-cookie').split(';')[0].split('=')[1];
ctx = await browser.newContext();
await ctx.addCookies([{ name: '__Host-lfid_ses', value: planted, domain: 'localhost', path: '/', secure: true, httpOnly: true }]);
page = await ctx.newPage();
await page.goto('http://localhost:4800/me');
console.log(\`v0.3  :4800  planted \${planted.slice(0, 17)}…; An's tab before signing in: \${await page.textContent('body')}\`);
console.log(\`v0.3  :4800  An signs in → \${await signInInPage(page, 'http://localhost:4800')}; her cookie is now \${(await ctx.cookies())[0].value.slice(0, 17)}…\`);
console.log(\`v0.3  :4800  attacker GET /me with the planted id → \${await json(await fetch('http://localhost:4800/me', { headers: { cookie: '__Host-lfid_ses=' + planted } }))}\`);
await page.goto('http://localhost:4800/me');
console.log(\`v0.3  :4800  An's tab → \${await page.textContent('body')}\`);
await browser.close();`,
  changePw: `# demo3/change-password.sh — lesson 3.3: changing the password = prove the old one, sign out every other device, new session here.
for d in laptop phone; do
  rm -f /tmp/lfid-$d.jar
  curl -s -o /dev/null -c /tmp/lfid-$d.jar localhost:4800/sign-in -H 'content-type: application/json' \\
    -d '{"email":"lan@labflow.example","password":"lan-lab-2026"}'
done
cp /tmp/lfid-laptop.jar /tmp/lfid-laptop-old.jar
pw() { curl -s -b /tmp/lfid-laptop.jar -c /tmp/lfid-laptop.jar localhost:4800/me/password -H 'content-type: application/json' -d "$1"; echo; }
printf 'wrong current password  → '; pw '{"current":"guess-123","next":"phong lab tang ba mo cua luc bay gio"}'
printf 'right current password  → '; pw '{"current":"lan-lab-2026","next":"phong lab tang ba mo cua luc bay gio"}'
printf 'phone /me               → '; curl -s -b /tmp/lfid-phone.jar localhost:4800/me; echo
printf 'laptop OLD cookie /me   → '; curl -s -b /tmp/lfid-laptop-old.jar localhost:4800/me; echo
printf 'laptop NEW cookie /me   → '; curl -s -b /tmp/lfid-laptop.jar localhost:4800/me | cut -c1-48`,
  csrfTarget: `// demo3/csrf-target.mjs — lesson 3.4: a tiny "change my email" service with ONE cookie and a choice of CSRF defence.
//   cookie: SameSite=None | Lax | (unset);  defence: none | fetch-metadata | token
import express from 'express';
import { createHmac, randomBytes } from 'node:crypto';
import { safeEqual } from '../src/crypto/index.js';

export function csrfTarget({ sameSite, defence }) {
  const sessions = new Map();                                  // sid → { email }
  const KEY = randomBytes(32);
  const csrfToken = (sid) => createHmac('sha256', KEY).update(sid).digest('base64url'); // synchronizer token, bound to the session
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  const sidOf = (req) => (req.headers.cookie ?? '').match(/(?:^|; )sid=([^;]+)/)?.[1];
  app.get('/login', (req, res) => {
    const sid = randomBytes(32).toString('base64url');
    sessions.set(sid, { email: 'an@student.labflow.example' });
    res.append('Set-Cookie', \`sid=\${sid}; Path=/; HttpOnly\${sameSite ? \`; SameSite=\${sameSite}\` : ''}\${sameSite === 'None' ? '; Secure' : ''}\`);
    res.send('signed in');
  });
  app.get('/settings', (req, res) => res.type('html').send(\`<form id="f" method="POST" action="/email">
<input name="email" value="an.new@student.labflow.example"><input type="hidden" name="csrf" value="\${csrfToken(sidOf(req) ?? '')}"></form>\`));
  app.post('/email', (req, res) => {
    const s = sessions.get(sidOf(req));
    if (!s) return res.status(401).send('not signed in');
    if (defence === 'fetch-metadata' && !['same-origin', 'none'].includes(req.headers['sec-fetch-site'] ?? 'none')) return res.status(403).send('cross-site');
    if (defence === 'token' && !safeEqual(req.body.csrf ?? '', csrfToken(sidOf(req)))) return res.status(403).send('bad csrf token');
    s.email = req.body.email;
    res.send('email changed');
  });
  app.get('/state', (req, res) => res.json(sessions.get(sidOf(req)) ?? null));
  app.get('/reset', (req, res) => { const s = sessions.get(sidOf(req)); if (s) s.email = 'an@student.labflow.example'; res.send('reset'); });
  return app;
}`,
  csrfMatrix: `// demo3/csrf-matrix.mjs — lesson 3.4: an attacker page on 127.0.0.1:4801 tries to change An's email on localhost:4802,
// with an auto-submitting form and with fetch(no-cors). Real Chromium; one fresh browser profile per configuration.
// Status = what the server answered (the attacker's page cannot read a no-cors response — the write happens anyway).
import http from 'node:http';
import { chromium } from 'playwright';
import { csrfTarget } from './csrf-target.mjs';

const T = 'http://localhost:4802/email';
const EVIL = {
  form: \`<form id="f" method="POST" action="\${T}"><input name="email" value="attacker@evil.example"></form><script>f.submit()</script>\`,
  fetch: \`<script>fetch('\${T}', { method: 'POST', mode: 'no-cors', credentials: 'include',
    headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'email=attacker@evil.example' })</script>\`,
};
const evil = http.createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(EVIL[req.url.slice(1)] ?? ''); }).listen(4801, '127.0.0.1');
const browser = await chromium.launch();
console.log(\`Chromium \${browser.version()}\`);
console.log('cookie SameSite  defence         attacker form  attacker fetch  An’s own form  email at the end');
for (const [sameSite, defence] of [['None', 'none'], ['', 'none'], ['Lax', 'none'], ['None', 'fetch-metadata'], ['None', 'token']]) {
  const server = csrfTarget({ sameSite, defence }).listen(4802);
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('http://localhost:4802/login');
  const results = [];
  for (const kind of ['form', 'fetch']) {
    await page.goto('http://localhost:4802/reset');                               // each attempt starts from An's real email
    const resp = page.waitForResponse((r) => r.url() === T, { timeout: 3000 }).catch(() => null);
    await page.goto(\`http://127.0.0.1:4801/\${kind}\`);
    const r = await resp;
    if (kind === 'form' && r) await page.waitForURL(T, { waitUntil: 'load' });   // the form navigates the tab to the target
    await page.waitForTimeout(300);
    results.push(r ? String(r.status()) : '—');
    await page.goto('http://localhost:4802/state');
    if (JSON.parse(await page.textContent('body')).email === 'attacker@evil.example') results[results.length - 1] += ' CHANGED';
  }
  await page.goto('http://localhost:4802/settings');
  const own = page.waitForResponse((r) => r.url() === T);
  await page.evaluate(() => document.getElementById('f').submit());
  results.push(String((await own).status()));
  await page.waitForURL(T, { waitUntil: 'load' });
  await page.goto('http://localhost:4802/state');
  const end = JSON.parse(await page.textContent('body')).email;
  console.log(\`\${(sameSite || '(unset)').padEnd(17)}\${defence.padEnd(16)}\${results[0].padEnd(15)}\${results[1].padEnd(16)}\${results[2].padEnd(15)}\${end}\`);
  await ctx.close();
  await new Promise((r) => server.close(r));
}
await browser.close(); evil.close();`,
  csrfV03: `# demo3/csrf-v03.sh — lesson 3.4: LabFlow ID v0.3's layer 2 on the wire. Same cookie, same body — only the browser's metadata changes.
rm -f /tmp/lfid-an.jar
curl -s -o /dev/null -c /tmp/lfid-an.jar localhost:4800/sign-in -H 'content-type: application/json' \\
  -d '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
post() { printf '%-40s → ' "$1"; shift; curl -s -w ' %{http_code}\\n' -b /tmp/lfid-an.jar localhost:4800/me/email -H 'content-type: application/json' "$@" -d '{"email":"an@student.labflow.example"}'; }
post 'Sec-Fetch-Site: cross-site' -H 'Sec-Fetch-Site: cross-site'
post 'Sec-Fetch-Site: same-site' -H 'Sec-Fetch-Site: same-site'
post 'Origin: http://127.0.0.1:4801 (old browser)' -H 'Origin: http://127.0.0.1:4801'
post 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Site: same-origin'
post 'no browser headers (curl, a mobile app)'`,
  redisStore: `// demo3/redis-store.mjs — lesson 3.5: the same session store on Redis. Idle timeout = the key's TTL; "sign out everywhere"
// needs a second structure (a set of digests per user), because Redis cannot search values.
import { createClient } from 'redis';

export async function redisStore(url = process.env.REDIS_URL, idleSec = 1800) {
  const r = createClient({ url });
  await r.connect();
  const key = (d) => \`ses:\${d}\`, userKey = (u) => \`user-ses:\${u}\`;
  return {
    client: r,
    async insert(s) {
      await r.multi().set(key(s.digest), JSON.stringify(s), { EX: idleSec }).sAdd(userKey(s.userId), s.digest).exec();
    },
    async get(digest) { const v = await r.get(key(digest)); return v && JSON.parse(v); },
    async update(digest, f) {
      const s = await this.get(digest); if (!s) return;
      await r.set(key(digest), JSON.stringify({ ...s, ...f }), { EX: idleSec });   // touching = a new TTL
    },
    async delete(digest) { const s = await this.get(digest); await r.del(key(digest)); if (s) await r.sRem(userKey(s.userId), digest); },
    async deleteByUser(userId) {
      const ds = await r.sMembers(userKey(userId));
      if (ds.length) await r.del(ds.map(key));
      await r.del(userKey(userId));
      return ds.length;
    },
  };
}`,
  where: `// demo3/where.mjs — lesson 3.5: three places to keep a session — PostgreSQL, Redis, or the cookie itself (signed, lesson 1.4).
// Same question for each: how long does one lookup take, how big is the cookie, and can we revoke An NOW?
import { pool } from '../src/db.js';
import { pgStore } from '../src/sessions/index.js';
import { newToken, tokenDigest, signValue, verifyValue } from '../src/crypto/index.js';
import { redisStore } from './redis-store.mjs';

const N = 5000;
const redis = await redisStore();
const KEYS = { k1: Buffer.from(process.env.SESSION_SIGNING_KEY ?? '', 'base64url') };
const median = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];
async function bench(label, lookup) {
  const us = [];
  for (let i = 0; i < N; i++) { const t0 = performance.now(); await lookup(); us.push((performance.now() - t0) * 1000); }
  return median(us);
}
const t = Date.now();
const row = { userId: 'usr_1', createdAt: t, expiresAt: t + 12 * 3600e3, lastSeenAt: t, authAt: t, ip: '127.0.0.1', userAgent: 'demo' };

// 1. PostgreSQL: random token in the cookie, row in the table
const pgToken = newToken('lfid_ses');
await pgStore.insert({ ...row, digest: tokenDigest(pgToken) });
// 2. Redis: random token in the cookie, JSON under ses:<digest>
const rdToken = newToken('lfid_ses');
await redis.insert({ ...row, digest: tokenDigest(rdToken) });
// 3. Signed cookie: the session data IS the cookie
const signed = signValue(JSON.stringify({ userId: 'usr_1', authAt: t }), { keys: KEYS, kid: 'k1', ttlSec: 12 * 3600 });

const res = [
  ['PostgreSQL row', await bench('pg', () => pgStore.get(tokenDigest(pgToken))), \`__Host-lfid_ses=\${pgToken}\`],
  ['Redis key', await bench('redis', () => redis.get(tokenDigest(rdToken))), \`__Host-lfid_ses=\${rdToken}\`],
  ['signed cookie', await bench('signed', () => verifyValue(signed, { keys: KEYS })), \`__Host-lfid_ses=\${signed}\`],
];
console.log(\`\${N} lookups each, one process; PostgreSQL 17 and Redis 7 in Docker Desktop (macOS port forwarding adds a hop)\`);
for (const [name, us, cookie] of res) console.log(\`\${name.padEnd(15)} median \${us.toFixed(1).padStart(6)} µs per lookup · cookie \${cookie.length} bytes\`);

console.log(\`Redis TTL of An's session key: \${await redis.client.ttl('ses:' + tokenDigest(rdToken))} s (the idle timeout is Redis's job)\`);
// Revoke An everywhere, then ask again
await pgStore.deleteByUser('usr_1');
await redis.deleteByUser('usr_1');
console.log('after "sign An out everywhere":');
console.log(\`  PostgreSQL → \${JSON.stringify(await pgStore.get(tokenDigest(pgToken)))}\`);
console.log(\`  Redis      → \${JSON.stringify(await redis.get(tokenDigest(rdToken)))}\`);
console.log(\`  signed     → \${verifyValue(signed, { keys: KEYS })}   (still valid until it expires, unless every request also checks a denylist)\`);
await redis.client.quit(); await pool.end();`,
  grader: `// scripts/cham-lab-3.mjs — the grader of Lab 3 (LabFlow ID's session layer). 9 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-3.mjs <folder with index.js>      e.g.  node scripts/cham-lab-3.mjs lab3/my
// It mounts YOUR sessionLayer in a small Express app (:4806) with an in-memory store and a fake clock, talks to it over HTTP,
// and runs one attack in real Chromium from another site (:4807). It reads your source last.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express from 'express';
import { chromium } from 'playwright';
import { memoryStore } from '../src/sessions/memory-store.js';

const dir = path.resolve(process.argv[2] ?? 'lab3/my');
const file = path.join(dir, 'index.js');
const m = await import(pathToFileURL(file).href);
const NAME = '__Host-lfid_ses';
const IDLE = 30 * 60e3, ABS = 12 * 3600e3;
let clock = Date.UTC(2026, 10, 2, 0, 0);
const store = memoryStore();
const emails = { usr_1: 'an@student.labflow.example' };
let layer, server, startError = null;
try {
  layer = m.sessionLayer({ store, now: () => clock, idleMs: IDLE, absoluteMs: ABS, touchEveryMs: 60e3, origins: ['http://localhost:4806'] });
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
  app.use(wrap(layer.load));
  app.use(wrap(layer.csrf));
  app.post('/sign-in', wrap(async (req, res) => { await layer.start(req, res, req.body.user); res.json({ ok: true }); }));
  app.get('/browser-login', wrap(async (req, res) => { await layer.start(req, res, 'usr_1'); res.send('signed in'); }));
  app.get('/me', (req, res) => (req.session ? res.json({ userId: req.session.userId }) : res.status(401).json({ error: 'Not signed in' })));
  app.get('/settings', (req, res) => res.type('html').send('<form id="f" method="POST" action="/me/email"><input name="email" value="an.new@student.labflow.example"></form>'));
  app.post('/me/email', (req, res) => {
    if (!req.session) return res.status(401).json({ error: 'Not signed in' });
    emails[req.session.userId] = req.body.email; res.json({ ok: true });
  });
  app.post('/sign-out', wrap(async (req, res) => { await layer.end(req, res); res.json({ ok: true }); }));
  app.post('/sign-out-everywhere', wrap(async (req, res) => {
    if (!req.session) return res.status(401).json({});
    res.json({ ended: await layer.endAll(req.session.userId) });
  }));
  app.use((err, req, res, next) => res.status(500).json({ error: String(err?.message ?? err) }));
  server = await new Promise((r) => { const s = app.listen(4806, () => r(s)); });
} catch (e) { startError = e; }

const B = 'http://localhost:4806';
const results = [];
async function check(name, points, fn) {
  let why = '';
  try { if (startError) throw startError; why = (await fn()) || ''; } catch (e) {
    why = e?.name === 'Expected' ? e.message : \`your code threw \${e?.name ?? 'Error'}: \${String(e?.message ?? e).split('\\n')[0]}\`;
  }
  results.push({ name, points, ok: !why, why });
}
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
const setCookies = (res) => res.headers.getSetCookie().filter((c) => c.startsWith(NAME + '='));
const valueOf = (c) => c.slice(NAME.length + 1).split(';')[0];
const cleared = (res) => setCookies(res).some((c) => valueOf(c) === '' || /max-age=0\\b/i.test(c) || /expires=thu, 01 jan 1970/i.test(c));
async function signIn(user, cookie) {
  const res = await fetch(B + '/sign-in', { method: 'POST', headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: JSON.stringify({ user }) });
  const c = setCookies(res)[0];
  expect(c, \`sign-in answered \${res.status} without a Set-Cookie for \${NAME}\`);
  return { header: c, cookie: \`\${NAME}=\${valueOf(c)}\`, token: valueOf(c) };
}
const me = (cookie) => fetch(B + '/me', { headers: cookie ? { cookie } : {} });

// ── T1 cookie attributes ──
await check('T1 cookie: __Host-lfid_ses; HttpOnly; Secure; Path=/; SameSite Lax/Strict; no Domain', 1.5, async () => {
  const { header } = await signIn('usr_1');
  const a = header.split(';').map((x) => x.trim().toLowerCase());
  expect(a.includes('httponly'), \`no HttpOnly: \${header}\`);
  expect(a.includes('secure'), \`no Secure (and a __Host- cookie without Secure is dropped by the browser): \${header}\`);
  expect(a.includes('path=/'), \`Path must be / for a __Host- cookie: \${header}\`);
  expect(a.some((x) => x === 'samesite=lax' || x === 'samesite=strict'), \`SameSite must be Lax or Strict: \${header}\`);
  expect(!a.some((x) => x.startsWith('domain=')), \`a Domain attribute makes the browser reject a __Host- cookie: \${header}\`);
});

// ── T2 token + digest ──
await check('T2 token: CSPRNG, ≥ 256 bits, the store keeps a digest — never the token', 1.5, async () => {
  const real = Math.random;
  Math.random = () => { throw new Error('Math.random was called (the grader replaced it with a trap)'); };
  let a, b;
  try { a = await signIn('usr_1'); b = await signIn('usr_1'); } finally { Math.random = real; }
  expect(a.token !== b.token, 'two sign-ins produced the same token');
  const body = a.token.replace(/^lfid_ses_/, '');
  expect(/^[A-Za-z0-9_-]{43,}$/.test(body), \`token \${a.token.slice(0, 20)}… is shorter than 32 random bytes in base64url (43 chars)\`);
  expect(!JSON.stringify([...store.rows]).includes(body), 'the store contains the token itself: a leaked session table is a list of live sessions (lesson 1.3)');
});

// ── T3 fixation ──
await check('T3 sign-in replaces any session the browser already had (session fixation)', 1.5, async () => {
  const planted = await signIn('usr_2');                       // the attacker's own valid session…
  const n = store.rows.size;
  const after = await signIn('usr_1', planted.cookie);          // …planted in An's browser; An signs in
  expect(after.token !== planted.token, 'the same session id was kept after sign-in');
  expect((await me(planted.cookie)).status === 401, 'the planted session id still works after An signed in');
  expect(store.rows.size === n, \`the old session was not destroyed (store grew from \${n} to \${store.rows.size})\`);
});

// ── T4 idle ──
await check('T4 idle timeout: 30 min without a request ⇒ 401, row deleted, cookie cleared', 1, async () => {
  const keysBefore = new Set(store.rows.keys());
  const s = await signIn('usr_1');
  const key = [...store.rows.keys()].find((k) => !keysBefore.has(k));
  clock += IDLE - 60e3;
  expect((await me(s.cookie)).status === 200, 'the session died before the idle timeout');
  clock += IDLE;
  const r = await me(s.cookie);
  expect(r.status === 401, \`30 min idle still answered \${r.status}\`);
  expect(cleared(r), 'the expired cookie was not cleared (Set-Cookie with Max-Age=0)');
  expect(!store.rows.has(key), 'the expired row is still in the store');
});

// ── T5 absolute ──
await check('T5 absolute timeout: 12 h after sign-in ⇒ 401 even with activity', 1, async () => {
  const s = await signIn('usr_1');
  const t0 = clock;
  while (clock + 20 * 60e3 < t0 + ABS) { clock += 20 * 60e3; expect((await me(s.cookie)).status === 200, 'an active session died before 12 h'); }
  clock = t0 + ABS;
  expect((await me(s.cookie)).status === 401, 'an active session is still alive 12 h after sign-in');
});

// ── T6 throttle ──
await check('T6 last-seen is not written on every request (100 requests in 10 s ⇒ ≤ 1 update)', 0.5, async () => {
  const s = await signIn('usr_1');
  const before = store.log.updates;
  for (let i = 0; i < 100; i++) { clock += 100; await me(s.cookie); }
  const n = store.log.updates - before;
  expect(n <= 1, \`\${n} store updates for 100 requests — a write per request (lesson 3.1)\`);
});

// ── T7 sign-out ──
await check('T7 sign-out clears the cookie and kills the row; sign-out-everywhere kills other devices', 1, async () => {
  const laptop = await signIn('usr_1'), phone = await signIn('usr_1');
  const r = await fetch(B + '/sign-out', { method: 'POST', headers: { cookie: laptop.cookie } });
  expect(cleared(r), 'sign-out did not clear the cookie (same name, Path=/, Max-Age=0)');
  const h = setCookies(r)[0] ?? '';
  expect(/path=\\//i.test(h) && /secure/i.test(h), \`the clearing Set-Cookie must repeat Path=/ and Secure, or the browser keeps the old cookie: \${h}\`);
  expect((await me(laptop.cookie)).status === 401, 'the old cookie still works after sign-out (replay)');
  const tablet = await signIn('usr_1');
  const e = await fetch(B + '/sign-out-everywhere', { method: 'POST', headers: { cookie: tablet.cookie } });
  expect(e.status === 200, \`sign-out-everywhere answered \${e.status}\`);
  expect((await me(phone.cookie)).status === 401, 'the phone is still signed in after sign-out-everywhere');
});

// ── T8 CSRF in Chromium ──
await check('T8 CSRF: another site cannot change the email (real Chromium); our own form still can', 1.5, async () => {
  const s = await signIn('usr_1');
  for (const [label, headers] of [['Sec-Fetch-Site: cross-site', { 'sec-fetch-site': 'cross-site' }], ['Origin: http://127.0.0.1:4807', { origin: 'http://127.0.0.1:4807' }]]) {
    const r = await fetch(B + '/me/email', { method: 'POST', headers: { cookie: s.cookie, 'content-type': 'application/json', ...headers }, body: '{"email":"x@evil.example"}' });
    expect(r.status === 403, \`a POST with the session cookie and \${label} answered \${r.status}, not 403 — SameSite alone is not enough (lesson 3.4: same-site subdomains, old browsers, cookies without the attribute)\`);
  }
  const evil = http.createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(req.url === '/form'
    ? \`<form id="f" method="POST" action="\${B}/me/email"><input name="email" value="attacker@evil.example"></form><script>f.submit()</script>\`
    : \`<script>fetch('\${B}/me/email', { method: 'POST', mode: 'no-cors', credentials: 'include', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'email=attacker@evil.example' })</script>\`); })
    .listen(4807, '127.0.0.1');
  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext()).newPage();
    await page.goto(B + '/browser-login');
    emails.usr_1 = 'an@student.labflow.example';
    for (const p of ['form', 'fetch']) { await page.goto(\`http://127.0.0.1:4807/\${p}\`); await page.waitForTimeout(800); }
    expect(emails.usr_1 === 'an@student.labflow.example', \`the attacker's page changed An's email to \${emails.usr_1}\`);
    await page.goto(B + '/settings');
    await Promise.all([page.waitForURL(B + '/me/email'), page.evaluate(() => document.getElementById('f').submit())]);
    expect(emails.usr_1 === 'an.new@student.labflow.example', \`An's own same-origin form did not work (email is \${emails.usr_1})\`);
  } finally { await browser.close(); evil.close(); }
});

// ── T9 source ──
await check('T9 source: no Math.random, no SameSite=None, no Domain=', 0.5, async () => {
  const src = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\\n');
  expect(!startError && typeof layer?.start === 'function', 'sessionLayer is not written yet — the source check starts counting once it works');
  expect(!/Math\\.random/.test(src), 'Math.random in a session module');
  expect(!/SameSite=None/i.test(src), 'SameSite=None sends the cookie on every cross-site request');
  expect(!/Domain=/i.test(src), 'a Domain attribute shares the cookie with every subdomain');
});

server?.close();
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 3 — \${path.relative(process.cwd(), file)}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(84)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  starter: `// lab3/starter/index.js — Lab 3: LabFlow ID's session layer. Replace every TODO; keep the exported name and the returned methods.
// store = { insert(row), get(digest), update(digest, fields), delete(digest), deleteByUser(userId) } (the grader passes one).
// Allowed: node:crypto, ../../src/crypto (newToken, tokenDigest). Grade: node scripts/cham-lab-3.mjs lab3/my
export function sessionLayer({ store, now = () => Date.now(), idleMs = 30 * 60e3, absoluteMs = 12 * 3600e3, touchEveryMs = 60e3,
  origins = ['http://localhost:4800'] }) {
  throw new Error('TODO sessionLayer');
  // return {
  //   async start(req, res, userId) {},      // new session, cookie __Host-lfid_ses, destroy any session the request carried
  //   async load(req, res, next) {},         // req.session = row | null; idle / absolute timeouts; throttled last-seen
  //   async end(req, res) {},                // delete the row, clear the cookie with the same attributes
  //   async endAll(userId) {},               // every session of this user ⇒ number deleted
  //   csrf(req, res, next) {},               // unsafe methods from another site ⇒ 403
  // };
}`,
  yeu: `// lab3/yeu/index.js — a FIRST ATTEMPT that "works": An signs in, /me knows her, sign-out answers ok.
import { randomBytes } from 'node:crypto';

export function sessionLayer({ store, now = () => Date.now(), idleMs = 30 * 60e3 }) {
  const read = (req) => (req.headers.cookie ?? '').match(/(?:^|; )__Host-lfid_ses=([^;]+)/)?.[1];
  return {
    async start(req, res, userId) {
      const token = randomBytes(32).toString('base64url');
      await store.insert({ digest: token, userId, lastSeenAt: now() });          // the token is the key
      res.append('Set-Cookie', \`__Host-lfid_ses=\${token}; Path=/; HttpOnly; Secure; SameSite=Lax\`);
    },
    async load(req, res, next) {
      req.session = null;
      const token = read(req);
      const s = token && (await store.get(token));
      if (s && now() - s.lastSeenAt <= idleMs) {
        await store.update(token, { lastSeenAt: now() });
        req.session = s;
      }
      next();
    },
    async end(req, res) {
      const token = read(req);
      if (token) await store.delete(token);
      res.append('Set-Cookie', '__Host-lfid_ses=deleted');
    },
    async endAll(userId) { return store.deleteByUser(userId); },
    csrf(req, res, next) { next(); },
  };
}`,
  test: `// test/sessions.test.js — Chapter 3: the session layer with an in-memory store and a fake clock (no database, no server).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionLayer, memoryStore } from '../src/sessions/index.js';
import { fakeReq, fakeRes, setValue } from '../demo3/fake-http.mjs';

const setup = () => { const c = { t: Date.UTC(2026, 10, 2) }; const store = memoryStore(); return { c, store, layer: sessionLayer({ store, now: () => c.t }) }; };
const signIn = async (layer, user, cookie) => { const res = fakeRes(); await layer.start(fakeReq(cookie), res, user); return { res, cookie: \`__Host-lfid_ses=\${setValue(res)}\` }; };
const who = async (layer, cookie, method = 'GET', headers) => { const req = fakeReq(cookie, method, headers); const res = fakeRes(); await layer.load(req, res, () => {}); return req.session?.userId ?? null; };

test('cookie: __Host- prefix, HttpOnly, Secure, SameSite=Lax, Path=/', async () => {
  const { layer } = setup();
  const { res } = await signIn(layer, 'usr_1');
  assert.match(res.setCookies[0], /^__Host-lfid_ses=lfid_ses_[A-Za-z0-9_-]{43}; Path=\\/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200$/);
});

test('sign-in replaces a planted session (fixation)', async () => {
  const { layer } = setup();
  const planted = await signIn(layer, 'usr_2');
  const an = await signIn(layer, 'usr_1', planted.cookie);
  assert.notEqual(an.cookie, planted.cookie);
  assert.equal(await who(layer, planted.cookie), null);
  assert.equal(await who(layer, an.cookie), 'usr_1');
});

test('idle 30 min and absolute 12 h', async () => {
  const { c, layer } = setup();
  const s = await signIn(layer, 'usr_1');
  c.t += 29 * 60e3; assert.equal(await who(layer, s.cookie), 'usr_1');
  c.t += 30 * 60e3; assert.equal(await who(layer, s.cookie), null);
  const t = await signIn(layer, 'usr_1'); const t0 = c.t;
  while (c.t + 20 * 60e3 < t0 + 12 * 3600e3) { c.t += 20 * 60e3; assert.equal(await who(layer, t.cookie), 'usr_1'); }
  c.t = t0 + 12 * 3600e3; assert.equal(await who(layer, t.cookie), null);
});

test('csrf: cross-site and foreign Origin get 403; same-origin and non-browser clients pass', () => {
  const { layer } = setup();
  const run = (headers) => { const res = fakeRes(); let passed = false; layer.csrf(fakeReq(null, 'POST', headers), res, () => { passed = true; }); return passed ? 'next' : res.code; };
  assert.equal(run({ 'sec-fetch-site': 'cross-site' }), 403);
  assert.equal(run({ 'sec-fetch-site': 'same-site' }), 403);
  assert.equal(run({ origin: 'http://127.0.0.1:4801' }), 403);
  assert.equal(run({ 'sec-fetch-site': 'same-origin' }), 'next');
  assert.equal(run({}), 'next');
});`,
};
export const OUT = {
  '31-devices': `$ bash demo3/devices.sh
laptop  /me → {"id":"usr_1","email":"an@student.labflo
phone   /me → {"id":"usr_1","email":"an@student.labflo
labpc   /me → {"id":"usr_1","email":"an@student.labflo
laptop  POST /sign-out-everywhere → {"ok":true,"ended":3}
laptop  /me → {"error":"Not signed in"}
phone   /me → {"error":"Not signed in"}
labpc   /me → {"error":"Not signed in"}`,
  '31-migrate': `$ npm run migrate --silent && npm run seed --silent
applied 001_users.sql
applied 002_sessions.sql
seeded usr_1 an@student.labflow.example STUDENT
seeded usr_2 binh@student.labflow.example STUDENT
seeded usr_3 lan@labflow.example LAB_MANAGER`,
  '31-row': `$ node demo3/sessions-dump.mjs
┌─────────┬─────────────────┬─────────┬────────────┬───────────────┬────────────┬───────┬──────────────┐
│ (index) │ digest          │ user_id │ created    │ expires       │ last_seen  │ ip    │ ua           │
├─────────┼─────────────────┼─────────┼────────────┼───────────────┼────────────┼───────┼──────────────┤
│ 0       │ 'c9c39a232e9a…' │ 'usr_1' │ '15:34:10' │ '02/11 03:34' │ '15:34:10' │ '::1' │ 'curl/8.7.1' │
└─────────┴─────────────────┴─────────┴────────────┴───────────────┴────────────┴───────┴──────────────┘`,
  '31-sign-in': `$ bash demo3/sign-in.sh
HTTP/1.1 200 OK
Set-Cookie: __Host-lfid_ses=lfid_ses_PbdRe-…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200
{"ok":true,"mustChangePassword":false}
{"id":"usr_1","email":"an@student.labflow.example","name":"Nguyen Van An","role":"STUDENT"}`,
  '31-timeouts': `$ node demo3/timeouts.mjs
07:00  An and Binh sign in; An then sends a request every 15 minutes, Binh walks away
07:15  An:   signed in
07:30  An:   signed in
07:31  Binh (31 min without a request): NOT signed in (cookie cleared)
18:45  An after 45 more requests: signed in
19:00  An (12 h after sign-in, still active): NOT signed in (cookie cleared)
store writes: 2 inserts, 47 updates (last_seen), 2 deletes`,
  '31-touch': `$ node demo3/touch-cost.mjs 4800 && node demo3/touch-cost.mjs 4803
port 4800: 1,000 × GET /me in 1.79 s · median 1.74 ms · p99 2.90 ms · sessions rows updated: 0
port 4803: 1,000 × GET /me in 2.13 s · median 2.06 ms · p99 3.64 ms · sessions rows updated: 1000`,
  '32-cookies': `$ node demo3/cookie-matrix.mjs
Chromium 156.0.8078.4 · origin http://localhost:4802
case                     stored?  JS sees it?  sent to /me?
plain                    yes      yes         yes
httponly                 yes      no          yes
host_ok                  yes      no          yes
host_no_secure           no       no          no
host_domain              no       no          no
host_path                no       no          no
secure_prefix_no_secure  no       no          no
path_me                  yes      yes         yes
delete_wrong_path        scoped still stored: YES
delete_right_path        scoped still stored: no`,
  '32-samesite': `$ node demo3/samesite.mjs
Chromium 156.0.8078.4 · site localhost:4802, attacker 127.0.0.1:4801
cookies set seconds ago:
  link GET         Sec-Fetch-Site: cross-site  cookies sent: lax, none, unset
  form-post POST   Sec-Fetch-Site: cross-site  cookies sent: none, unset
  img GET          Sec-Fetch-Site: cross-site  cookies sent: none
  fetch-post POST  Sec-Fetch-Site: cross-site  cookies sent: none
125 s later:
  link GET         Sec-Fetch-Site: cross-site  cookies sent: lax, none, unset
  form-post POST   Sec-Fetch-Site: cross-site  cookies sent: none
  img GET          Sec-Fetch-Site: cross-site  cookies sent: none
  fetch-post POST  Sec-Fetch-Site: cross-site  cookies sent: none`,
  '32-xss': `$ node demo3/httponly-xss.mjs
{
 "cookieSeenByScript": "",
 "emailChange": "200 {\\"ok\\":true,\\"email\\":\\"attacker@evil.example\\"}",
 "meAfter": "attacker@evil.example"
}`,
  '33-fixation': `$ node demo3/fixation.mjs
naive :4802  attacker got anonymous sid H9Dt073h…
naive :4802  An signs in in her browser → 200; her sid is still H9Dt073h…
naive :4802  attacker GET /me with his sid → 200 {"id":"usr_1","email":"an@student.labflow.example"}
v0.3  :4800  planted lfid_ses_3k4dhZmW…; An's tab before signing in: {"id":"usr_2","email":"binh@student.labflow.example","name":"Tran Thi Binh","role":"STUDENT"}
v0.3  :4800  An signs in → 200; her cookie is now lfid_ses_NejUYrMN…
v0.3  :4800  attacker GET /me with the planted id → 401 {"error":"Not signed in"}
v0.3  :4800  An's tab → {"id":"usr_1","email":"an@student.labflow.example","name":"Nguyen Van An","role":"STUDENT"}`,
  '33-password': `$ bash demo3/change-password.sh
wrong current password  → {"error":"REAUTH_FAILED"}
right current password  → {"ok":true,"signedOutSessions":2}
phone /me               → {"error":"Not signed in"}
laptop OLD cookie /me   → {"error":"Not signed in"}
laptop NEW cookie /me   → {"id":"usr_3","email":"lan@labflow.example","nam`,
  '34-csrf': `$ node demo3/csrf-matrix.mjs
Chromium 156.0.8078.4
cookie SameSite  defence         attacker form  attacker fetch  An’s own form  email at the end
None             none            200 CHANGED    200 CHANGED     200            an.new@student.labflow.example
(unset)          none            200 CHANGED    401             200            an.new@student.labflow.example
Lax              none            401            401             200            an.new@student.labflow.example
None             fetch-metadata  403            403             200            an.new@student.labflow.example
None             token           403            403             200            an.new@student.labflow.example`,
  '34-v03': `$ bash demo3/csrf-v03.sh
Sec-Fetch-Site: cross-site               → {"error":"CROSS_SITE_REQUEST"} 403
Sec-Fetch-Site: same-site                → {"error":"CROSS_SITE_REQUEST"} 403
Origin: http://127.0.0.1:4801 (old browser) → {"error":"CROSS_SITE_REQUEST"} 403
Sec-Fetch-Site: same-origin              → {"ok":true,"email":"an@student.labflow.example"} 200
no browser headers (curl, a mobile app)  → {"ok":true,"email":"an@student.labflow.example"} 200`,
  '35-where': `$ node demo3/where.mjs
5000 lookups each, one process; PostgreSQL 17 and Redis 7 in Docker Desktop (macOS port forwarding adds a hop)
PostgreSQL row  median  470.8 µs per lookup · cookie 68 bytes
Redis key       median  363.2 µs per lookup · cookie 68 bytes
signed cookie   median    5.0 µs per lookup · cookie 129 bytes
Redis TTL of An's session key: 1796 s (the idle timeout is Redis's job)
after "sign An out everywhere":
  PostgreSQL → null
  Redis      → null
  signed     → {"userId":"usr_1","authAt":1793522022985}   (still valid until it expires, unless every request also checks a denylist)`,
  'lab-bat-dau': `$ node scripts/cham-lab-3.mjs lab3/starter
Lab 3 — lab3/starter/index.js
✗ T1 cookie: __Host-lfid_ses; HttpOnly; Secure; Path=/; SameSite Lax/Strict; no Domain 0/1.5
    ↳ your code threw Error: TODO sessionLayer
✗ T2 token: CSPRNG, ≥ 256 bits, the store keeps a digest — never the token             0/1.5
    ↳ your code threw Error: TODO sessionLayer
✗ T3 sign-in replaces any session the browser already had (session fixation)           0/1.5
    ↳ your code threw Error: TODO sessionLayer
✗ T4 idle timeout: 30 min without a request ⇒ 401, row deleted, cookie cleared         0/1
    ↳ your code threw Error: TODO sessionLayer
✗ T5 absolute timeout: 12 h after sign-in ⇒ 401 even with activity                     0/1
    ↳ your code threw Error: TODO sessionLayer
✗ T6 last-seen is not written on every request (100 requests in 10 s ⇒ ≤ 1 update)     0/0.5
    ↳ your code threw Error: TODO sessionLayer
✗ T7 sign-out clears the cookie and kills the row; sign-out-everywhere kills other devices 0/1
    ↳ your code threw Error: TODO sessionLayer
✗ T8 CSRF: another site cannot change the email (real Chromium); our own form still can 0/1.5
    ↳ your code threw Error: TODO sessionLayer
✗ T9 source: no Math.random, no SameSite=None, no Domain=                              0/0.5
    ↳ your code threw Error: TODO sessionLayer
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test

> labflow-id@0.3.0 test
> node --test --test-reporter=spec "test/**/*.test.js"

✔ newToken: prefix + 43 base64url chars, and checks its arguments (0.695125ms)
✔ tokenDigest is SHA-256 hex (0.27625ms)
✔ safeEqual: equal, different, different lengths, not strings (0.174167ms)
✔ signed value: round trip, tampering, expiry boundary (0.327375ms)
✔ signed value: key rotation and malformed input (0.157416ms)
✔ redact keeps only allowed keys, deeply (0.385041ms)
✔ hash is argon2id with the measured parameters and a fresh salt (164.605584ms)
✔ NFC: precomposed and decomposed Vietnamese verify the same (161.489166ms)
✔ bcrypt verifies and asks for a rehash; a wrong password never does (213.526125ms)
✔ policy: length, blocklist, context — no composition rules (0.703334ms)
✔ signIn: one answer for both failures, upgrade on success (383.477542ms)
✔ cookie: __Host- prefix, HttpOnly, Secure, SameSite=Lax, Path=/ (1.027166ms)
✔ sign-in replaces a planted session (fixation) (0.314333ms)
✔ idle 30 min and absolute 12 h (0.839541ms)
✔ csrf: cross-site and foreign Origin get 403; same-origin and non-browser clients pass (0.156083ms)
ℹ tests 15
ℹ suites 0
ℹ pass 15
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1075.575959`,
  'lab-tham-khao': `$ node scripts/cham-lab-3.mjs src/sessions
Lab 3 — src/sessions/index.js
✓ T1 cookie: __Host-lfid_ses; HttpOnly; Secure; Path=/; SameSite Lax/Strict; no Domain 1.5/1.5
✓ T2 token: CSPRNG, ≥ 256 bits, the store keeps a digest — never the token             1.5/1.5
✓ T3 sign-in replaces any session the browser already had (session fixation)           1.5/1.5
✓ T4 idle timeout: 30 min without a request ⇒ 401, row deleted, cookie cleared         1/1
✓ T5 absolute timeout: 12 h after sign-in ⇒ 401 even with activity                     1/1
✓ T6 last-seen is not written on every request (100 requests in 10 s ⇒ ≤ 1 update)     0.5/0.5
✓ T7 sign-out clears the cookie and kills the row; sign-out-everywhere kills other devices 1/1
✓ T8 CSRF: another site cannot change the email (real Chromium); our own form still can 1.5/1.5
✓ T9 source: no Math.random, no SameSite=None, no Domain=                              0.5/0.5
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-3.mjs lab3/yeu
Lab 3 — lab3/yeu/index.js
✓ T1 cookie: __Host-lfid_ses; HttpOnly; Secure; Path=/; SameSite Lax/Strict; no Domain 1.5/1.5
✗ T2 token: CSPRNG, ≥ 256 bits, the store keeps a digest — never the token             0/1.5
    ↳ the store contains the token itself: a leaked session table is a list of live sessions (lesson 1.3)
✗ T3 sign-in replaces any session the browser already had (session fixation)           0/1.5
    ↳ the planted session id still works after An signed in
✗ T4 idle timeout: 30 min without a request ⇒ 401, row deleted, cookie cleared         0/1
    ↳ 30 min idle still answered 200
✗ T5 absolute timeout: 12 h after sign-in ⇒ 401 even with activity                     0/1
    ↳ an active session is still alive 12 h after sign-in
✗ T6 last-seen is not written on every request (100 requests in 10 s ⇒ ≤ 1 update)     0/0.5
    ↳ 100 store updates for 100 requests — a write per request (lesson 3.1)
✗ T7 sign-out clears the cookie and kills the row; sign-out-everywhere kills other devices 0/1
    ↳ sign-out did not clear the cookie (same name, Path=/, Max-Age=0)
✗ T8 CSRF: another site cannot change the email (real Chromium); our own form still can 0/1.5
    ↳ a POST with the session cookie and Sec-Fetch-Site: cross-site answered 200, not 403 — SameSite alone is not enough (lesson 3.4: same-site subdomains, old browsers, cookies without the attribute)
✓ T9 source: no Math.random, no SameSite=None, no Domain=                              0.5/0.5
TOTAL 2/10 — NOT YET (pass = 7)`,
};
