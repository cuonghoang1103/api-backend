// scripts/cham-lab-3.mjs — the grader of Lab 3 (LabFlow ID's session layer). 9 checks, 10 points, pass = 7.
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
    why = e?.name === 'Expected' ? e.message : `your code threw ${e?.name ?? 'Error'}: ${String(e?.message ?? e).split('\n')[0]}`;
  }
  results.push({ name, points, ok: !why, why });
}
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
const setCookies = (res) => res.headers.getSetCookie().filter((c) => c.startsWith(NAME + '='));
const valueOf = (c) => c.slice(NAME.length + 1).split(';')[0];
const cleared = (res) => setCookies(res).some((c) => valueOf(c) === '' || /max-age=0\b/i.test(c) || /expires=thu, 01 jan 1970/i.test(c));
async function signIn(user, cookie) {
  const res = await fetch(B + '/sign-in', { method: 'POST', headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: JSON.stringify({ user }) });
  const c = setCookies(res)[0];
  expect(c, `sign-in answered ${res.status} without a Set-Cookie for ${NAME}`);
  return { header: c, cookie: `${NAME}=${valueOf(c)}`, token: valueOf(c) };
}
const me = (cookie) => fetch(B + '/me', { headers: cookie ? { cookie } : {} });

// ── T1 cookie attributes ──
await check('T1 cookie: __Host-lfid_ses; HttpOnly; Secure; Path=/; SameSite Lax/Strict; no Domain', 1.5, async () => {
  const { header } = await signIn('usr_1');
  const a = header.split(';').map((x) => x.trim().toLowerCase());
  expect(a.includes('httponly'), `no HttpOnly: ${header}`);
  expect(a.includes('secure'), `no Secure (and a __Host- cookie without Secure is dropped by the browser): ${header}`);
  expect(a.includes('path=/'), `Path must be / for a __Host- cookie: ${header}`);
  expect(a.some((x) => x === 'samesite=lax' || x === 'samesite=strict'), `SameSite must be Lax or Strict: ${header}`);
  expect(!a.some((x) => x.startsWith('domain=')), `a Domain attribute makes the browser reject a __Host- cookie: ${header}`);
});

// ── T2 token + digest ──
await check('T2 token: CSPRNG, ≥ 256 bits, the store keeps a digest — never the token', 1.5, async () => {
  const real = Math.random;
  Math.random = () => { throw new Error('Math.random was called (the grader replaced it with a trap)'); };
  let a, b;
  try { a = await signIn('usr_1'); b = await signIn('usr_1'); } finally { Math.random = real; }
  expect(a.token !== b.token, 'two sign-ins produced the same token');
  const body = a.token.replace(/^lfid_ses_/, '');
  expect(/^[A-Za-z0-9_-]{43,}$/.test(body), `token ${a.token.slice(0, 20)}… is shorter than 32 random bytes in base64url (43 chars)`);
  expect(!JSON.stringify([...store.rows]).includes(body), 'the store contains the token itself: a leaked session table is a list of live sessions (lesson 1.3)');
});

// ── T3 fixation ──
await check('T3 sign-in replaces any session the browser already had (session fixation)', 1.5, async () => {
  const planted = await signIn('usr_2');                       // the attacker's own valid session…
  const n = store.rows.size;
  const after = await signIn('usr_1', planted.cookie);          // …planted in An's browser; An signs in
  expect(after.token !== planted.token, 'the same session id was kept after sign-in');
  expect((await me(planted.cookie)).status === 401, 'the planted session id still works after An signed in');
  expect(store.rows.size === n, `the old session was not destroyed (store grew from ${n} to ${store.rows.size})`);
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
  expect(r.status === 401, `30 min idle still answered ${r.status}`);
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
  expect(n <= 1, `${n} store updates for 100 requests — a write per request (lesson 3.1)`);
});

// ── T7 sign-out ──
await check('T7 sign-out clears the cookie and kills the row; sign-out-everywhere kills other devices', 1, async () => {
  const laptop = await signIn('usr_1'), phone = await signIn('usr_1');
  const r = await fetch(B + '/sign-out', { method: 'POST', headers: { cookie: laptop.cookie } });
  expect(cleared(r), 'sign-out did not clear the cookie (same name, Path=/, Max-Age=0)');
  const h = setCookies(r)[0] ?? '';
  expect(/path=\//i.test(h) && /secure/i.test(h), `the clearing Set-Cookie must repeat Path=/ and Secure, or the browser keeps the old cookie: ${h}`);
  expect((await me(laptop.cookie)).status === 401, 'the old cookie still works after sign-out (replay)');
  const tablet = await signIn('usr_1');
  const e = await fetch(B + '/sign-out-everywhere', { method: 'POST', headers: { cookie: tablet.cookie } });
  expect(e.status === 200, `sign-out-everywhere answered ${e.status}`);
  expect((await me(phone.cookie)).status === 401, 'the phone is still signed in after sign-out-everywhere');
});

// ── T8 CSRF in Chromium ──
await check('T8 CSRF: another site cannot change the email (real Chromium); our own form still can', 1.5, async () => {
  const s = await signIn('usr_1');
  for (const [label, headers] of [['Sec-Fetch-Site: cross-site', { 'sec-fetch-site': 'cross-site' }], ['Origin: http://127.0.0.1:4807', { origin: 'http://127.0.0.1:4807' }]]) {
    const r = await fetch(B + '/me/email', { method: 'POST', headers: { cookie: s.cookie, 'content-type': 'application/json', ...headers }, body: '{"email":"x@evil.example"}' });
    expect(r.status === 403, `a POST with the session cookie and ${label} answered ${r.status}, not 403 — SameSite alone is not enough (lesson 3.4: same-site subdomains, old browsers, cookies without the attribute)`);
  }
  const evil = http.createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(req.url === '/form'
    ? `<form id="f" method="POST" action="${B}/me/email"><input name="email" value="attacker@evil.example"></form><script>f.submit()</script>`
    : `<script>fetch('${B}/me/email', { method: 'POST', mode: 'no-cors', credentials: 'include', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'email=attacker@evil.example' })</script>`); })
    .listen(4807, '127.0.0.1');
  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext()).newPage();
    await page.goto(B + '/browser-login');
    emails.usr_1 = 'an@student.labflow.example';
    for (const p of ['form', 'fetch']) { await page.goto(`http://127.0.0.1:4807/${p}`); await page.waitForTimeout(800); }
    expect(emails.usr_1 === 'an@student.labflow.example', `the attacker's page changed An's email to ${emails.usr_1}`);
    await page.goto(B + '/settings');
    await Promise.all([page.waitForURL(B + '/me/email'), page.evaluate(() => document.getElementById('f').submit())]);
    expect(emails.usr_1 === 'an.new@student.labflow.example', `An's own same-origin form did not work (email is ${emails.usr_1})`);
  } finally { await browser.close(); evil.close(); }
});

// ── T9 source ──
await check('T9 source: no Math.random, no SameSite=None, no Domain=', 0.5, async () => {
  const src = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  expect(!startError && typeof layer?.start === 'function', 'sessionLayer is not written yet — the source check starts counting once it works');
  expect(!/Math\.random/.test(src), 'Math.random in a session module');
  expect(!/SameSite=None/i.test(src), 'SameSite=None sends the cookie on every cross-site request');
  expect(!/Domain=/i.test(src), 'a Domain attribute shares the cookie with every subdomain');
});

server?.close();
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 3 — ${path.relative(process.cwd(), file)}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(84)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
