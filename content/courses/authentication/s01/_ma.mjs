/**
 * _ma.mjs (Chương 1) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  bearer: `// demo1/bearer.js — lesson 1.1: whoever holds the token IS the user, and a token in a URL travels further than you think.
import express from 'express';
import { newToken } from '../src/crypto/index.js';

const app = express();
app.use(express.json());
// An access log in nginx's default style: it records the FULL URL, query string included.
// (The user agent is shortened to its product token so the lines fit on a slide.)
const agent = (ua = '') => ua.match(/(HeadlessChrome|Firefox|curl)\\/[\\d.]+/)?.[0] ?? ua;
app.use((req, res, next) => {
  res.on('finish', () => console.log(\`\${req.ip} "\${req.method} \${req.originalUrl}" \${res.statusCode} "\${agent(req.get('user-agent'))}"\`));
  next();
});

const tokens = new Map(); // token → name (Chapter 3 stores a digest; here we keep it simple)
app.post('/sign-in', (req, res) => {
  const token = newToken('lfid_ses');
  tokens.set(token, req.body.name);
  res.json({ token });
});
app.get('/me', (req, res) => {
  const who = tokens.get((req.get('authorization') ?? '').replace(/^Bearer /, ''));
  if (!who) return res.status(401).json({ error: 'UNAUTHENTICATED' });
  res.json({ you: who });
});

// A password-reset page reached through a link in an email: the token is IN the URL.
// It loads a same-origin script and a third-party analytics pixel — like most real pages.
app.get('/reset', (req, res) => {
  if (req.query.policy) res.set('Referrer-Policy', req.query.policy);
  res.type('html').send(\`<!doctype html><title>Reset your password</title>
<script src="/static/app.js"></script>
<img src="http://127.0.0.1:4801/pixel.gif" alt="">
<form method="post" action="/reset"><input type="password" name="pw"><button>Save</button></form>\`);
});
app.get('/static/app.js', (req, res) => {
  console.log(\`  ↳ same-origin request, Referer: \${req.get('referer') ?? '(none)'}\`);
  res.type('js').send('// app');
});

app.listen(4800, () => console.log('demo1/bearer.js on http://localhost:4800'));`,
  thirdParty: `// demo1/third-party.js — an analytics server on ANOTHER origin. It logs the Referer header it receives.
import http from 'node:http';
http.createServer((req, res) => {
  console.log(\`[third-party] \${req.method} \${req.url}  Referer: \${req.headers.referer ?? '(none)'}\`);
  res.setHeader('content-type', 'image/gif');
  res.end(Buffer.from('R0lGODlhAQABAAAAACw=', 'base64'));
}).listen(4801, () => console.log('demo1/third-party.js on http://127.0.0.1:4801'));`,
  openReset: `// demo1/open-reset.mjs — open the reset link in real Chromium, once per Referrer-Policy, and let the servers log.
import { chromium } from 'playwright';
const token = process.argv[2];
const browser = await chromium.launch();
for (const policy of ['', 'no-referrer-when-downgrade', 'unsafe-url', 'no-referrer']) {
  const page = await browser.newPage();
  const url = \`http://localhost:4800/reset?token=\${token}\${policy ? \`&policy=\${policy}\` : ''}\`;
  await page.goto(url, { waitUntil: 'networkidle' });
  console.log(\`opened with Referrer-Policy: \${policy || '(not set — browser default)'}\`);
  await page.close();
}
console.log(\`Chromium \${browser.version()}\`);
await browser.close();`,
  predict: `// demo1/predict-math-random.mjs — lesson 1.2: Math.random() is a formula, not a coin. From SEEN outputs we compute the next ones.
// V8 (Node 22) uses xorshift128+ state, refills a cache of 64 numbers at a time and hands them out LAST-FIRST;
// each number is the top 52 bits of the 64-bit word "state0". Every step is XOR and shifts — linear over bits —
// so each output gives 52 linear equations about the 128 unknown state bits. Solve them, then run the generator.
import { execFileSync } from 'node:child_process';

// The "victim": a separate Node process that prints 8 Math.random() values (think: 8 tokens issued in a row).
const SEEN = Number(process.argv[2] ?? 3);
const PRED = 5;
const victim = execFileSync(process.execPath, ['-e', \`for (let i = 0; i < \${SEEN + PRED}; i++) console.log(Math.random())\`], { encoding: 'utf8' })
  .trim().split('\\n').map(Number);
const seen = victim.slice(0, SEEN); // what the attacker observed
const hidden = victim.slice(SEEN); // what it will try to predict

// ── symbolic state: each bit is a set of unknowns (a BigInt bitmask over 128 variables) ──
const M64 = (1n << 64n) - 1n;
const word = (base) => Array.from({ length: 64 }, (_, i) => 1n << BigInt(base + i)); // bit i ← variable base+i
const shl = (w, n) => w.map((_, i) => (i >= n ? w[i - n] : 0n));
const shr = (w, n) => w.map((_, i) => (i + n < 64 ? w[i + n] : 0n));
const xor = (a, b) => a.map((x, i) => x ^ b[i]);
function step([s0, s1]) { // exactly V8's XorShift128
  let x = s0; const y = s1;
  x = xor(x, shl(x, 23)); x = xor(x, shr(x, 17)); x = xor(x, y); x = xor(x, shr(y, 26));
  return [y, x];
}
// Unknown base state B = the state behind the LAST number we want to predict. Outputs go backwards in generator
// time, so the newest-seen number is T^(SEEN+PRED-1)(B) and the last prediction is B itself.
const TOP = SEEN + PRED - 1;
let st = [word(0), word(64)];
const states = [st];
for (let t = 1; t <= TOP; t++) states.push(st = step(st)); // states[t] = T^t(B)
const mantissa = (x) => BigInt(x * 2 ** 52); // exact: x = mantissa / 2^52
const rows = [];
seen.forEach((x, i) => {
  const s0 = states[TOP - i][0];
  const m = mantissa(x);
  for (let j = 0; j < 52; j++) rows.push(s0[j + 12] | (((m >> BigInt(j)) & 1n) << 128n));
});
// ── Gaussian elimination over GF(2) ──
const solved = new Array(128).fill(null);
let r = 0;
for (let v = 0; v < 128; v++) {
  const bit = 1n << BigInt(v);
  const p = rows.findIndex((row, k) => k >= r && (row & bit));
  if (p < 0) continue;
  [rows[r], rows[p]] = [rows[p], rows[r]];
  for (let k = 0; k < rows.length; k++) if (k !== r && (rows[k] & bit)) rows[k] ^= rows[r];
  solved[v] = r++;
}
let B = 0n;
for (let v = 0; v < 128; v++) if (solved[v] !== null && (rows[solved[v]] >> 128n) & 1n) B |= 1n << BigInt(v);
// ── run the real generator forward from B and read the numbers it will hand out next ──
let s0 = B & M64, s1 = (B >> 64n) & M64;
const real = [s0];
for (let t = 1; t < PRED; t++) {
  let x = s0; const y = s1;
  x ^= (x << 23n) & M64; x ^= x >> 17n; x ^= y; x ^= y >> 26n;
  s0 = y; s1 = x; real.push(s0);
}
const toDouble = (w) => Number(w >> 12n) / 2 ** 52;
const predicted = real.map(toDouble).reverse(); // B was the furthest one
console.log(\`solved \${r} of 128 state bits from \${rows.length} equations\`);
seen.forEach((x, i) => console.log(\`seen      #\${i + 1}  \${x}\`));
predicted.forEach((x, i) => console.log(\`predicted #\${i + SEEN + 1}  \${x}  \${x === hidden[i] ? '✓ matches' : '✗ actual ' + hidden[i]}\`));`,
  tokens: `// src/crypto/tokens.js — lessons 1.2 and 1.3: random tokens and how to store them.
import { randomBytes, createHash } from 'node:crypto';

const PREFIX = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/; // lfid_ses, lfid_key, lfid_reset …

/** A new random token: "<prefix>_<43 base64url chars>" = 32 bytes = 256 bits from the OS CSPRNG. */
export function newToken(prefix, bytes = 32) {
  if (typeof prefix !== 'string' || !PREFIX.test(prefix)) throw new TypeError(\`bad token prefix: \${prefix}\`);
  if (!Number.isInteger(bytes) || bytes < 16) throw new RangeError('a token needs at least 16 random bytes (128 bits)');
  return \`\${prefix}_\${randomBytes(bytes).toString('base64url')}\`;
}

/** What the database stores instead of the token: its SHA-256, hex. Fine for random tokens — NOT for passwords (Chapter 2). */
export function tokenDigest(token) {
  return createHash('sha256').update(token).digest('hex');
}`,
  tokenFormats: `// demo1/token-formats.mjs — lesson 1.2: the same random bytes, written three ways. Length is NOT the number of bits.
import { randomBytes, randomUUID } from 'node:crypto';
import { newToken } from '../src/crypto/index.js';

const b16 = randomBytes(16);
const rows = [
  ['randomBytes(16) hex', b16.toString('hex'), 128],
  ['randomBytes(16) base64url', b16.toString('base64url'), 128],
  ['randomBytes(32) base64url', randomBytes(32).toString('base64url'), 256],
  ['randomUUID() (v4)', randomUUID(), 122],
  ["newToken('lfid_ses')", newToken('lfid_ses'), 256],
  ['Math.random().toString(36).slice(2)', Math.random().toString(36).slice(2), 0],
];
for (const [how, value, bits] of rows) {
  console.log(\`\${how.padEnd(36)} \${String(value.length).padStart(2)} chars · \${String(bits).padStart(3)} random bits · \${value.slice(0, 12)}…\`);
}`,
  bits: `// demo1/bits.mjs — lesson 1.2: how long to guess ONE token of b random bits, at a rate far beyond any real attacker.
import { fmt } from './fmt.mjs';
const RATE = 1e12; // guesses per second (an absurdly generous attacker)
for (const b of [20, 32, 40, 64, 80, 122, 128, 256]) {
  const half = 2 ** (b - 1) / RATE; // on average you find it after trying half of the space
  console.log(\`\${String(b).padStart(3)} bits · \${(2 ** b).toExponential(2).padStart(9)} values · average \${fmt(half)}\`);
}
console.log('(age of the universe ≈ 1.4e10 years)');`,
  modulo: `// demo1/modulo-bias.mjs — lesson 1.2: turning random BYTES into a digit 0–9 with % 10 is biased. randomInt() is not.
import { randomBytes, randomInt } from 'node:crypto';
const N = 1_000_000;
const count = (pick) => { const c = new Array(10).fill(0); for (let i = 0; i < N; i++) c[pick(i)]++; return c; };
const bytes = randomBytes(N);
const biased = count((i) => bytes[i] % 10); // 256 = 25 × 10 + 6, so digits 0–5 get one extra byte value each
const fair = count(() => randomInt(10));
console.log(\`digit · byte % 10 · randomInt(10)   (\${N.toLocaleString('en-US')} draws each)\`);
for (let d = 0; d < 10; d++) console.log(\`  \${d}   · \${String(biased[d]).padStart(9)} · \${String(fair[d]).padStart(9)}\`);
console.log(\`expected with % 10: digits 0–5 → 26/256 = \${(26 / 256 * 100).toFixed(2)}%, digits 6–9 → 25/256 = \${(25 / 256 * 100).toFixed(2)}%\`);`,
  birthday: `// demo1/birthday.mjs — lesson 1.2: when do two random tokens collide? About after 2^(bits/2) tokens.
import { fmt } from './fmt.mjs';
for (const b of [32, 64, 122, 128]) {
  const n = 2 ** (b / 2) * Math.sqrt(2 * Math.log(2)); // tokens until P(any collision) = 50%
  console.log(\`\${String(b).padStart(3)} bits: 50% chance of a collision after \${n.toExponential(2)} tokens = \${fmt(n / 1000)} at 1,000 new tokens/s\`);
}`,
  fmt: `// demo1/fmt.mjs — print a duration in seconds the way a person would say it.
const YEAR = 365.25 * 24 * 3600;
export const fmt = (s) => (s < 1e-3 ? \`\${(s * 1e6).toFixed(1)} µs\` : s < 1 ? \`\${(s * 1e3).toFixed(1)} ms\` : s < 60 ? \`\${s.toFixed(1)} s\`
  : s < 3600 ? \`\${(s / 60).toFixed(1)} minutes\` : s < 86400 ? \`\${(s / 3600).toFixed(1)} hours\`
  : s < YEAR ? \`\${(s / 86400).toFixed(1)} days\` : \`\${(s / YEAR).toExponential(1)} years\`);`,
  timingEqual: `// demo1/timing-equal.mjs — lesson 1.3: does === take longer when more leading characters match?
// In-process, no network. Every round times every position (in a shuffled order, so JIT warm-up and
// CPU drift hit all positions alike); we print the median of 21 rounds × 1,000,000 comparisons.
import { randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

const LEN = Number(process.env.LEN ?? 64);
const secret = Buffer.from(randomBytes(LEN).toString('base64url').slice(0, LEN)).toString();
const positions = (process.env.POS ?? '0,1,8,16,32,48,63,64').split(',').map(Number).filter((p) => p <= LEN);
const ROUNDS = 21;
const N = 1_000_000;

// A guess with exactly m leading characters right (m = LEN: the whole token, as a separate string).
const flat = (s) => Buffer.from(s).toString(); // a fresh, flat copy — like a header value from a request
const guess = (m) => flat(m === LEN ? secret : secret.slice(0, m) + (secret[m] === 'A' ? 'B' : 'A') + secret.slice(m + 1));

const mode = process.argv[2] ?? 'strict';
const sb = Buffer.from(secret);
const compare = mode === 'strict'
  ? (g) => g === secret
  : (g) => g.length === sb.length && timingSafeEqual(g, sb);
// 8 separate copies per position: the loop picks a different object each time, so the JIT cannot
// hoist "is this guess equal to the secret?" out of the loop and time an empty loop instead.
const inputs = positions.map((m) => Array.from({ length: 8 }, () => (mode === 'strict' ? guess(m) : Buffer.from(guess(m)))));

const samples = positions.map(() => []);
let hits = 0;
for (let r = 0; r < ROUNDS; r++) {
  const order = positions.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = randomInt(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  for (const k of order) {
    const gs = inputs[k];
    const t = process.hrtime.bigint();
    for (let i = 0; i < N; i++) if (compare(gs[i & 7])) hits++;
    samples[k].push(Number(process.hrtime.bigint() - t) / N);
  }
}
const median = (a) => a.sort((x, y) => x - y)[a.length >> 1];
console.log(\`Node \${process.version} · \${mode === 'strict' ? '===' : 'timingSafeEqual'} · \${LEN}-char token · median of \${ROUNDS} rounds × \${N.toLocaleString('en-US')}\`);
positions.forEach((m, k) => console.log(\`\${String(m).padStart(2)} leading chars right → \${median(samples[k]).toFixed(2)} ns\`));
console.log(\`(\${hits.toLocaleString('en-US')} comparisons returned true — only the 'all right' row)\`);`,
  timingNaive: `// demo1/timing-naive.mjs — lesson 1.3: the SAME benchmark with one guess object per position. Looks fine. Lies.
// In-process, no network. Every round times every position (in a shuffled order, so JIT warm-up and
// CPU drift hit all positions alike); we print the median of 21 rounds × 1,000,000 comparisons.
import { randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

const LEN = Number(process.env.LEN ?? 64);
const secret = Buffer.from(randomBytes(LEN).toString('base64url').slice(0, LEN)).toString();
const positions = (process.env.POS ?? '0,1,8,16,32,48,63,64').split(',').map(Number).filter((p) => p <= LEN);
const ROUNDS = 21;
const N = 1_000_000;

// A guess with exactly m leading characters right (m = LEN: the whole token, as a separate string).
const flat = (s) => Buffer.from(s).toString(); // a fresh, flat copy — like a header value from a request
const guess = (m) => flat(m === LEN ? secret : secret.slice(0, m) + (secret[m] === 'A' ? 'B' : 'A') + secret.slice(m + 1));

const mode = process.argv[2] ?? 'strict';
const sb = Buffer.from(secret);
const compare = mode === 'strict'
  ? (g) => g === secret
  : (g) => g.length === sb.length && timingSafeEqual(g, sb);
const inputs = positions.map((m) => (mode === 'strict' ? guess(m) : Buffer.from(guess(m))));

const samples = positions.map(() => []);
let hits = 0;
for (let r = 0; r < ROUNDS; r++) {
  const order = positions.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = randomInt(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  for (const k of order) {
    const g = inputs[k];
    const t = process.hrtime.bigint();
    for (let i = 0; i < N; i++) if (compare(g)) hits++; // same g every time: the JIT may compute it ONCE
    samples[k].push(Number(process.hrtime.bigint() - t) / N);
  }
}
const median = (a) => a.sort((x, y) => x - y)[a.length >> 1];
console.log(\`Node \${process.version} · \${mode === 'strict' ? '===' : 'timingSafeEqual'} · \${LEN}-char token · median of \${ROUNDS} rounds × \${N.toLocaleString('en-US')}\`);
positions.forEach((m, k) => console.log(\`\${String(m).padStart(2)} leading chars right → \${median(samples[k]).toFixed(2)} ns\`));
console.log(\`(\${hits.toLocaleString('en-US')} comparisons returned true — only the 'all right' row)\`);`,
  keyServer: `// demo1/key-server.js — lesson 1.3: an endpoint that checks an API key with ===, the way most first versions do.
import http from 'node:http';
const API_KEY = process.env.DEMO_API_KEY; // a FAKE 64-character key, passed in by the demo
http.createServer((req, res) => {
  const ok = req.headers['x-api-key'] === API_KEY;
  res.statusCode = ok ? 200 : 401;
  res.end(ok ? 'ok' : 'no');
}).listen(4802, () => console.log('demo1/key-server.js on http://127.0.0.1:4802'));`,
  timingRemote: `// demo1/timing-remote.mjs — lesson 1.3: can a client see the === difference through HTTP on the SAME machine?
// Sends two guesses alternately (0 vs 63 leading characters right), N requests each, over one keep-alive connection.
import http from 'node:http';
const KEY = process.env.DEMO_API_KEY;
const N = Number(process.env.N ?? 20000);
const agent = new http.Agent({ keepAlive: true, maxSockets: 1 });
const wrong = (m) => KEY.slice(0, m) + (KEY[m] === 'A' ? 'B' : 'A') + KEY.slice(m + 1);
const guesses = { 'first char wrong': wrong(0), 'last char wrong ': wrong(63) };
const send = (key) => new Promise((resolve) => {
  const t = process.hrtime.bigint();
  http.get({ host: '127.0.0.1', port: 4802, path: '/', agent, headers: { 'x-api-key': key } }, (res) => {
    res.resume();
    res.on('end', () => resolve(Number(process.hrtime.bigint() - t)));
  });
});
const samples = Object.fromEntries(Object.keys(guesses).map((k) => [k, []]));
for (let i = 0; i < 2000; i++) await send(guesses['first char wrong']); // warm-up
for (let i = 0; i < N; i++) for (const [name, key] of Object.entries(guesses)) samples[name].push(await send(key));
const q = (a, p) => a[Math.floor(p * (a.length - 1))];
console.log(\`\${N.toLocaleString('en-US')} requests per guess, 127.0.0.1, one keep-alive connection\`);
for (const [name, a] of Object.entries(samples)) {
  a.sort((x, y) => x - y);
  console.log(\`\${name}: p10 \${(q(a, 0.1) / 1000).toFixed(1)} µs · median \${(q(a, 0.5) / 1000).toFixed(1)} µs · p90 \${(q(a, 0.9) / 1000).toFixed(1)} µs\`);
}
const [a, b] = Object.values(samples);
console.log(\`median difference: \${((q(b, 0.5) - q(a, 0.5))).toFixed(0)} ns (the in-process difference was about 2 ns)\`);`,
  compare: `// src/crypto/compare.js — lesson 1.3: compare two secrets without leaking where they differ.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const KEY = randomBytes(32); // per process, never stored: an attacker cannot predict either MAC

/** true if a and b are the same string. Any length, never throws, time does not depend on the content. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ma = createHmac('sha256', KEY).update(a).digest(); // always 32 bytes …
  const mb = createHmac('sha256', KEY).update(b).digest(); // … so timingSafeEqual never sees two lengths
  return timingSafeEqual(ma, mb);
}`,
  safeEqualDemo: `// demo1/safe-equal.mjs — lesson 1.3: safeEqual (src/crypto/compare.js) never throws and never compares secret bytes directly.
import { safeEqual } from '../src/crypto/index.js';
const t = 'lfid_ses_' + 'x'.repeat(43);
console.log('same token          →', safeEqual(t, 'lfid_ses_' + 'x'.repeat(43)));
console.log('last char different →', safeEqual(t, 'lfid_ses_' + 'x'.repeat(42) + 'y'));
console.log('shorter             →', safeEqual(t, 'lfid_ses_x'));
console.log('empty / not a string →', safeEqual(t, ''), safeEqual(t, undefined));`,
  webhook: `// demo1/webhook.mjs — lesson 1.3: verifying an HMAC signature on a webhook — raw bytes, constant time, a time limit.
// LabFlow ID notifies LabFlow API ("user.disabled"); the receiver must be sure LabFlow ID sent it, and sent it recently.
import express from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';

const SECRET = process.env.DEMO_WEBHOOK_SECRET; // shared by sender and receiver (FAKE value in this demo)
const TOLERANCE_SEC = 300;
const signature = (t, raw) => createHmac('sha256', SECRET).update(\`\${t}.\${raw}\`).digest('hex');

function verifySignature(header, raw, nowSec) {
  const parts = Object.fromEntries((header ?? '').split(',').map((kv) => kv.split('=')));
  const t = Number(parts.t);
  if (!Number.isInteger(t) || !/^[0-9a-f]{64}$/.test(parts.v1 ?? '')) return 'MALFORMED';
  if (Math.abs(nowSec - t) > TOLERANCE_SEC) return 'TOO_OLD';
  const good = Buffer.from(signature(t, raw), 'hex');
  return timingSafeEqual(good, Buffer.from(parts.v1, 'hex')) ? 'OK' : 'BAD_SIGNATURE';
}

const app = express();
// Receiver 1: lets express.json() parse first, then re-serialises the body to check it.
app.post('/hooks/parsed', express.json(), (req, res) => {
  res.json({ verdict: verifySignature(req.get('labflow-signature'), JSON.stringify(req.body), Math.floor(Date.now() / 1000)) });
});
// Receiver 2: keeps the exact bytes that were signed.
app.post('/hooks/raw', express.raw({ type: 'application/json' }), (req, res) => {
  res.json({ verdict: verifySignature(req.get('labflow-signature'), req.body.toString('utf8'), Math.floor(Date.now() / 1000)) });
});
const server = app.listen(4804);

// The sender: pretty-printed JSON, exactly as LabFlow ID writes it.
const raw = JSON.stringify({ type: 'user.disabled', user: 'usr_2', at: '2026-11-01T06:00:00Z' }, null, 2);
async function send(path, t, body = raw, sig = signature(t, raw)) {
  const res = await fetch(\`http://127.0.0.1:4804\${path}\`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'labflow-signature': \`t=\${t},v1=\${sig}\` }, body,
  });
  return (await res.json()).verdict;
}
const now = Math.floor(Date.now() / 1000);
console.log('parsed body, fresh          →', await send('/hooks/parsed', now));
console.log('raw body, fresh             →', await send('/hooks/raw', now));
console.log('raw body, user changed      →', await send('/hooks/raw', now, raw.replace('usr_2', 'usr_3')));
console.log('raw body, replayed 10 min   →', await send('/hooks/raw', now - 600));
server.close();`,
  server01: `// src/server.js — LabFlow ID v0.1 (end of Chapter 1). Fixed so far:
//   hole 3 — session ids come from the CSPRNG (lesson 1.2), and the database keeps only their SHA-256 (lesson 1.3);
//   the request log hides credentials (lesson 1.5).
// Still open: holes 1, 2, 4, 5, 6 — Chapters 2, 3, 6, 10. Never deploy this file.
import express from 'express';
import { load, save } from './store.js';
import { newToken, tokenDigest } from './crypto/index.js';
import { log, requestLog } from './log.js';

const app = express();
app.use(express.json());
app.use(requestLog);

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
  const token = newToken('lfid_ses'); // 256 bits from the CSPRNG
  db.sessions.push({ digest: tokenDigest(token), userId: user.id }); // the token itself is never stored; hole 4
  save(db);
  res.json({ session: token }); // hole 5
}); // hole 6

app.get('/me', (req, res) => {
  const db = load();
  const digest = tokenDigest(req.get('x-session') ?? '');
  const session = db.sessions.find((s) => s.digest === digest); // look up by digest: no secret is compared
  if (!session) return res.status(401).json({ error: 'Not signed in' });
  const user = db.users.find((u) => u.id === session.userId);
  res.json({ id: user.id, email: user.email, name: user.name });
});

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(\`LabFlow ID v0.1 on http://localhost:\${port}\`));`,
  sha256: `// demo1/sha256.mjs — lesson 1.4: SHA-256 written out, with ONE extra ability: start from a given digest.
// That ability is exactly what a length-extension attacker has, because a SHA-256 digest IS its internal state.
const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
  0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,
  0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70,
  0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
const IV = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
const rotr = (x, n) => (x >>> n) | (x << (32 - n));

function compress(h, block) { // one 64-byte block
  const w = new Array(64);
  for (let i = 0; i < 16; i++) w[i] = block.readUInt32BE(i * 4);
  for (let i = 16; i < 64; i++) {
    const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
    const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
    w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
  }
  let [a, b, c, d, e, f, g, hh] = h;
  for (let i = 0; i < 64; i++) {
    const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
    const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
    [hh, g, f, e, d, c, b, a] = [g, f, e, (d + t1) | 0, c, b, a, (t1 + t2) | 0];
  }
  return h.map((x, i) => (x + [a, b, c, d, e, f, g, hh][i]) | 0);
}

/** The padding SHA-256 appends to a message of \`len\` bytes: 0x80, zeros, then the length in bits (64-bit big-endian). */
export function padding(len) {
  const zeros = (55 - len) % 64 < 0 ? (55 - len) % 64 + 64 : (55 - len) % 64;
  const p = Buffer.alloc(1 + zeros + 8);
  p[0] = 0x80;
  p.writeBigUInt64BE(BigInt(len) * 8n, 1 + zeros);
  return p;
}

/** SHA-256 of \`data\`, optionally continuing from a previous digest that already covered \`doneLen\` bytes. */
export function sha256(data, from = null, doneLen = 0) {
  let h = from ? Array.from({ length: 8 }, (_, i) => from.readUInt32BE(i * 4) | 0) : IV;
  const msg = Buffer.concat([data, padding(doneLen + data.length)]);
  for (let i = 0; i < msg.length; i += 64) h = compress(h, msg.subarray(i, i + 64));
  const out = Buffer.alloc(32);
  h.forEach((x, i) => out.writeUInt32BE(x >>> 0, i * 4));
  return out;
}`,
  lengthExt: `// demo1/length-extension.mjs — lesson 1.4: sha256(secret + message) is NOT a MAC. HMAC is.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { sha256, padding } from './sha256.mjs';

const SECRET = randomBytes(24); // the server's key: 24 bytes; the attacker never sees it
const same = (a, b) => a.length === b.length && timingSafeEqual(a, b);
const tagNaive = (m) => createHash('sha256').update(Buffer.concat([SECRET, m])).digest();
const tagHmac = (m) => createHmac('sha256', SECRET).update(m).digest();
const roleOf = (m) => Object.fromEntries(new URLSearchParams(m.toString('latin1'))).role; // the LAST role= wins
const show = (m) => m.toString('latin1') // bytes you cannot type, shown as \\xNN; a run of zero bytes as \\x00×N
  .replace(/[^\\x20-\\x7e]/g, (c) => '\\\\x' + c.charCodeAt(0).toString(16).padStart(2, '0'))
  .replace(/(\\\\x00){3,}/g, (run) => \`\\\\x00×\${run.length / 4}\`);

// 0. Our own SHA-256 agrees with Node's (so the attack below is not a trick of a broken implementation).
console.log('own sha256 = node sha256:', sha256(Buffer.from('LabFlow')).equals(createHash('sha256').update('LabFlow').digest()));

// 1. The server issues a "signed" string to An (think: a cookie value or a link).
const msg = Buffer.from('user=usr_1&role=STUDENT');
const tag = tagNaive(msg);
console.log('issued  :', msg.toString(), '· tag', tag.toString('hex').slice(0, 16) + '…');

// 2. An knows the message, the tag and the key LENGTH (or simply tries 1…64). She appends her own text.
const extra = Buffer.from('&role=LAB_MANAGER');
const forged = Buffer.concat([msg, padding(SECRET.length + msg.length), extra]);
const forgedTag = sha256(extra, tag, SECRET.length + msg.length + padding(SECRET.length + msg.length).length);
console.log('forged  :', show(forged), \`(\${forged.length} bytes)\`);
console.log('sha256(secret+msg) accepts the forgery:', same(tagNaive(forged), forgedTag), '→ role =', roleOf(forged));

// 3. The same attack against HMAC-SHA256.
const hTag = tagHmac(msg);
const hForgedTag = sha256(extra, hTag, SECRET.length + msg.length + padding(SECRET.length + msg.length).length);
console.log('HMAC accepts the forgery:', same(tagHmac(forged), hForgedTag));`,
  threeTools: `// demo1/three-tools.mjs — lesson 1.4: hash, MAC and signature on the same message. Who can make each one? Who can check it?
import { createHash, createHmac, generateKeyPairSync, sign, verify } from 'node:crypto';

const msg = Buffer.from('user=usr_1&role=STUDENT');
const KEY = Buffer.from(process.env.DEMO_HMAC_KEY); // a FAKE shared key for the demo

// 1. Hash — no key. Anyone, the attacker included, can compute it for ANY message.
console.log('sha256      ', createHash('sha256').update(msg).digest('hex'));
console.log('sha256 (1 char changed)', createHash('sha256').update('user=usr_1&role=STUDENS').digest('hex'));
// 2. MAC — one shared key makes AND checks the tag.
console.log('hmac-sha256 ', createHmac('sha256', KEY).update(msg).digest('hex'));
// 3. Signature — the private key makes it, the public key only checks it.
const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const sig = sign(null, msg, privateKey);
console.log('ed25519 sig ', sig.length, 'bytes:', sig.toString('base64url').slice(0, 24) + '…');
console.log('verify with the public key            →', verify(null, msg, publicKey, sig));
console.log('verify a changed message              →', verify(null, Buffer.from('user=usr_1&role=LAB_MANAGER'), publicKey, sig));
try {
  sign(null, Buffer.from('user=usr_1&role=LAB_MANAGER'), publicKey);
  console.log('signed with the PUBLIC key?!');
} catch (e) {
  console.log('try to SIGN with the public key       →', e.code ?? e.message);
}`,
  sharedKey: `// demo1/shared-key.mjs — lesson 1.4: with HMAC, every service that can CHECK a token can also MAKE one.
// Tokens here are "<payload>.<tag>", the same shape as a JWT (Chapter 4 builds the real thing).
import { createHmac, generateKeyPairSync, sign, verify, timingSafeEqual } from 'node:crypto';

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const read = (t) => JSON.parse(Buffer.from(t.split('.')[0], 'base64url'));

// ── Design A: one shared HMAC key, given to LabFlow ID (issues) and to the billing service (only needs to check) ──
const SHARED = Buffer.from(process.env.DEMO_SHARED_KEY);
const macA = (p) => createHmac('sha256', SHARED).update(p).digest('base64url');
const issueA = (claims) => { const p = b64(claims); return \`\${p}.\${macA(p)}\`; };
const checkA = (t) => { const [p, s] = t.split('.'); const good = Buffer.from(macA(p)); const got = Buffer.from(s); return good.length === got.length && timingSafeEqual(good, got); };

const anA = issueA({ sub: 'usr_1', role: 'STUDENT' }); // by LabFlow ID
const evilA = issueA({ sub: 'usr_1', role: 'LAB_MANAGER' }); // by the BILLING service — it has the key, so it can
console.log('A · An’s token checks out          →', checkA(anA), read(anA));
console.log('A · token made by billing checks out →', checkA(evilA), read(evilA));

// ── Design B: LabFlow ID keeps an Ed25519 PRIVATE key; billing only gets the PUBLIC key ──
const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const issueB = (claims) => { const p = b64(claims); return \`\${p}.\${sign(null, Buffer.from(p), privateKey).toString('base64url')}\`; };
const checkB = (t) => { const [p, s] = t.split('.'); return verify(null, Buffer.from(p), publicKey, Buffer.from(s, 'base64url')); };

const anB = issueB({ sub: 'usr_1', role: 'STUDENT' });
console.log('B · billing checks An’s token       →', checkB(anB), read(anB));
try {
  const p = b64({ sub: 'usr_1', role: 'LAB_MANAGER' });
  console.log(\`\${p}.\${sign(null, Buffer.from(p), publicKey).toString('base64url')}\`);
} catch (e) {
  console.log('B · billing tries to make a token   →', e.code);
}
const tampered = b64({ sub: 'usr_1', role: 'LAB_MANAGER' }) + '.' + anB.split('.')[1]; // old signature, new payload
console.log('B · reuse An’s signature on a new payload →', checkB(tampered));`,
  encrypt: `// demo1/encrypt-not-protect.mjs — lesson 1.4: encryption hides a value; without a tag it does NOT stop changes.
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const key = randomBytes(32);
const plain = Buffer.from('{"uid":"usr_1","admin":false}');

// AES-256-CTR: encrypted, unreadable … and editable. The attacker never learns the key.
const iv = randomBytes(16);
const c = createCipheriv('aes-256-ctr', key, iv);
const ct = Buffer.concat([c.update(plain), c.final()]);
console.log('ciphertext (CTR) :', ct.toString('base64url'));
// She guesses the plaintext layout (it is the app's own format) and XORs "false" into "true ".
const at = plain.indexOf('false');
const evil = Buffer.from(ct);
for (let i = 0; i < 5; i++) evil[at + i] ^= 'false'.charCodeAt(i) ^ 'true '.charCodeAt(i);
const d = createDecipheriv('aes-256-ctr', key, iv);
const out = Buffer.concat([d.update(evil), d.final()]).toString();
console.log('server decrypts  :', out, '→ admin =', JSON.parse(out).admin);

// AES-256-GCM: same edit, but GCM carries an authentication tag — decryption refuses.
const iv2 = randomBytes(12);
const g = createCipheriv('aes-256-gcm', key, iv2);
const ct2 = Buffer.concat([g.update(plain), g.final()]);
const tag = g.getAuthTag();
for (let i = 0; i < 5; i++) ct2[at + i] ^= 'false'.charCodeAt(i) ^ 'true '.charCodeAt(i);
try {
  const dg = createDecipheriv('aes-256-gcm', key, iv2);
  dg.setAuthTag(tag);
  console.log(Buffer.concat([dg.update(ct2), dg.final()]).toString());
} catch (e) {
  console.log('GCM decrypt      :', e.message);
}`,
  logDemo: `// demo1/log-demo.js — lesson 1.5: three ways to log the same sign-in request. Only the last one is safe.
import express from 'express';
import pino from 'pino';
import { redact } from '../src/crypto/index.js';

const app = express();
app.use(express.json());

// 1) What everyone writes on day one.
app.post('/naive/sign-in', (req, res) => {
  console.log('sign-in', { headers: req.headers, body: req.body });
  res.json({ ok: true });
});

// 2) A deny-list: hide the fields we THOUGHT of.
const denyLog = pino({ base: null, timestamp: false, redact: ['headers.authorization', 'headers.cookie', 'body.password'] });
app.post('/deny/sign-in', (req, res) => {
  denyLog.info({ headers: req.headers, body: req.body }, 'sign-in');
  res.json({ ok: true });
});

// 3) An allow-list: log only the fields we DECIDED are safe; everything else is hidden, even fields added next year.
const log = pino({ base: null, timestamp: false });
const SAFE = ['headers', 'host', 'user-agent', 'content-type', 'body', 'email'];
app.post('/allow/sign-in', (req, res) => {
  log.info(redact({ headers: req.headers, body: req.body }, SAFE), 'sign-in');
  res.json({ ok: true });
});

app.listen(4800, () => console.log('demo1/log-demo.js on http://localhost:4800'));`,
  log: `// src/log.js — lesson 1.5: one request line per request, built from an ALLOW-list. Credentials never reach the log.
import pino from 'pino';
import { redact } from './crypto/index.js';

export const log = pino({ base: null });

const SAFE = ['method', 'path', 'status', 'ms', 'ip', 'headers', 'user-agent', 'content-type', 'body', 'email'];

export function requestLog(req, res, next) {
  const start = performance.now();
  res.on('finish', () => {
    log.info(redact({
      method: req.method,
      path: req.path, // never originalUrl: the query string may carry a token (lesson 1.1)
      status: res.statusCode,
      ms: Math.round(performance.now() - start),
      ip: req.ip,
      headers: req.headers,
      body: req.body ?? null,
    }, SAFE), 'request');
  });
  next();
}`,
  redact: `// src/crypto/redact.js — lesson 1.5: log only what you decided is safe (an allow-list), never "everything minus a deny-list".
const HIDDEN = '[redacted]';

/** A deep copy where every key NOT in \`allow\` is replaced by "[redacted]". Arrays and nested objects are walked. */
export function redact(value, allow) {
  const keep = new Set(allow);
  const walk = (v) => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, keep.has(k) ? walk(x) : HIDDEN]));
    }
    return v;
  };
  return walk(value);
}`,
  axiosError: `// demo1/axios-error.mjs — lesson 1.5: an error object carries the request that failed — Authorization header included.
import http from 'node:http';
import axios from 'axios';
import pino from 'pino';

const log = pino({ base: null, timestamp: false });
// A partner API that is having a bad day.
const partner = http.createServer((req, res) => { res.statusCode = 500; res.end('{"error":"upstream down"}'); });
await new Promise((r) => partner.listen(4803, r));

try {
  await axios.get('http://127.0.0.1:4803/v1/payments', { headers: { Authorization: \`Bearer \${process.env.PARTNER_API_KEY}\` } });
} catch (err) {
  log.error({ err }, 'payment API failed'); // ← the line that ends up in your log platform
  log.error({ status: err.response?.status, code: err.code, error: err.message }, 'payment API failed (safe)');
}
partner.close();`,
  makeLeak: `#!/bin/bash
# demo1/git/make-leak.sh — lesson 1.5: commit a secret by mistake, then "remove" it the way most people do.
# Usage: bash demo1/git/make-leak.sh <dir> <fake-key> <fake-session>
set -e
mkdir -p "$1" && cd "$1"
git init -q
git config user.name An && git config user.email an@student.labflow.example
printf 'PORT=4800\\nLFID_SIGNING_KEY=%s\\n' "$2" > .env
mkdir -p test/fixtures && printf '{ "user": "usr_1", "sid": "%s" }\\n' "$3" > test/fixtures/session.json
git add .env test && git commit -qm 'add config and a test fixture'
echo .env > .gitignore
git rm -q --cached .env            # "remove" it …
git add .gitignore && git commit -qm 'remove .env, add .gitignore'
echo '--- files git tracks now:'; git ls-files
echo '--- history:'; git log --oneline`,
  gitleaksLfid: `# demo1/git/gitleaks-lfid.toml — lesson 1.5: teach gitleaks what a LabFlow ID secret looks like (the prefix from lesson 1.2).
[extend]
useDefault = true

[[rules]]
id = "labflow-id-secret"
description = "LabFlow ID secret (lfid_key_ / lfid_ses_ / lfid_reset_)"
regex = '''lfid_(?:key|ses|reset)_[A-Za-z0-9_-]{20,}'''
keywords = ["lfid_"]`,
  webMain: `// demo1/web/main.js — lesson 1.5: what a front-end build does with environment variables.
// Vite replaces import.meta.env.VITE_* with the VALUE at build time; other variables are not exposed.
const payKey = import.meta.env.VITE_PAYMENT_SECRET_KEY; // ← a server secret, given a VITE_ name "to make it work"
const signing = import.meta.env.LFID_SIGNING_KEY; // ← not VITE_*: undefined in the browser

async function payLabFee(amount) {
  return fetch('https://pay.example/v1/charges', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + payKey, 'content-type': 'application/json' },
    body: JSON.stringify({ amount, signedBy: signing ?? null }),
  });
}
document.querySelector('#pay').addEventListener('click', () => payLabFee(50000));`,
  signed: `// src/crypto/signed.js — lessons 1.4 and Lab 1: a value the client may hold but cannot change.
// Format: <value as base64url>.<expiry, unix seconds>.<key id>.<HMAC-SHA256 of the first three parts, base64url>
import { createHmac } from 'node:crypto';
import { safeEqual } from './compare.js';

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64url');
const mac = (key, data) => createHmac('sha256', key).update(data).digest('base64url');

/** keys: { kid: secret, … }; kid: the key to sign with; ttlSec: lifetime; now: ms (inject it in tests). */
export function signValue(value, { keys, kid, ttlSec, now = Date.now() }) {
  if (typeof value !== 'string') throw new TypeError('value must be a string');
  if (!keys?.[kid]) throw new Error(\`unknown key id: \${kid}\`);
  if (!Number.isInteger(ttlSec) || ttlSec <= 0) throw new RangeError('ttlSec must be a positive integer');
  const body = \`\${b64(value)}.\${Math.floor(now / 1000) + ttlSec}.\${kid}\`;
  return \`\${body}.\${mac(keys[kid], body)}\`;
}

/** The value, or null if the string was changed, expired, signed with an unknown key, or is not ours at all. */
export function verifyValue(signed, { keys, now = Date.now() }) {
  if (typeof signed !== 'string') return null;
  const parts = signed.split('.');
  if (parts.length !== 4) return null;
  const [v, exp, kid, sig] = parts;
  const key = Object.hasOwn(keys, kid) ? keys[kid] : undefined;
  if (!key || !/^\\d+$/.test(exp)) return null;
  if (!safeEqual(sig, mac(key, \`\${v}.\${exp}.\${kid}\`))) return null; // signature first …
  if (Math.floor(now / 1000) >= Number(exp)) return null; // … then expiry (the exp is now trusted)
  return Buffer.from(v, 'base64url').toString('utf8');
}`,
  index: `// src/crypto/index.js — LabFlow ID's toolkit of primitives (Chapter 1). Every later chapter imports from here.
export { newToken, tokenDigest } from './tokens.js';
export { safeEqual } from './compare.js';
export { signValue, verifyValue } from './signed.js';
export { redact } from './redact.js';`,
  grader: `// scripts/cham-lab-1.mjs — the grader of Lab 1 (LabFlow ID's toolkit of primitives). 9 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-1.mjs <folder with index.js>      e.g.  node scripts/cham-lab-1.mjs lab1/my
// It only CALLS your functions (and reads your source for Math.random); it never edits your files.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = path.resolve(process.argv[2] ?? 'lab1/my');
const file = path.join(dir, 'index.js');
const m = await import(pathToFileURL(file).href);
const results = [];

async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) {
    why = e?.name === 'Expected' ? e.message : \`your code threw \${e?.name ?? 'Error'}: \${String(e?.message ?? e).split('\\n')[0]}\`;
  }
  results.push({ name, points, ok: !why, why });
}
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
const nothrow = (fn) => { try { return { v: fn() }; } catch (e) { return { e }; } };

// ── T1 token format ──
await check('T1 newToken format and argument checks', 1, () => {
  const t = m.newToken('lfid_ses');
  expect(/^lfid_ses_[A-Za-z0-9_-]{43}$/.test(t), \`"lfid_ses" + 32 bytes should be lfid_ses_ + 43 base64url chars, got \${JSON.stringify(t.slice(0, 30))}… (\${t.length} chars)\`);
  expect(/^lfid_key_[A-Za-z0-9_-]{22}$/.test(m.newToken('lfid_key', 16)), '16 bytes should give 22 base64url chars');
  for (const bad of ['', 'LFID', 'lfid ses', 'lfid__ses', '_ses', 42]) {
    const r = nothrow(() => m.newToken(bad));
    expect(r.e instanceof TypeError, \`prefix \${JSON.stringify(bad)} should throw TypeError\`);
  }
  for (const bad of [8, 15, 16.5, '32']) {
    const r = nothrow(() => m.newToken('lfid_ses', bad));
    expect(r.e instanceof RangeError, \`bytes = \${JSON.stringify(bad)} should throw RangeError\`);
  }
});

// ── T2 randomness source ──
await check('T2 newToken uses the CSPRNG, never Math.random', 1.5, () => {
  const real = Math.random;
  Math.random = () => { throw new Error('Math.random was called (the grader replaced it with a trap)'); };
  try { m.newToken('lfid_ses'); } finally { Math.random = real; }
  const run = () => execFileSync(process.execPath, ['--random-seed=7', '--input-type=module', '-e',
    \`const m = await import(\${JSON.stringify(pathToFileURL(file).href)}); console.log(m.newToken('lfid_ses'))\`], { encoding: 'utf8' }).trim();
  expect(run() !== run(), 'two processes with the same --random-seed produced the same token');
  const seen = new Set(Array.from({ length: 10000 }, () => m.newToken('lfid_ses')));
  expect(seen.size === 10000, \`10,000 tokens, only \${seen.size} distinct\`);
});

// ── T3 digest ──
await check('T3 tokenDigest = SHA-256 hex', 0.5, () => {
  const t = 'lfid_ses_' + 'A'.repeat(43);
  expect(m.tokenDigest(t) === createHash('sha256').update(t).digest('hex'), 'not the SHA-256 hex of the token');
});

// ── T4 safeEqual correctness ──
await check('T4 safeEqual answers correctly and never throws', 1.5, () => {
  const t = 'lfid_ses_' + 'x'.repeat(43);
  const cases = [[t, 'lfid_ses_' + 'x'.repeat(43), true], [t, 'lfid_ses_' + 'x'.repeat(42) + 'y', false], [t, 'y' + t.slice(1), false],
    [t, 'lfid_ses_x', false], [t, t + 'x', false], ['', '', true], [t, '', false], ['é', 'é', true], ['é', 'é', false],
    [t, undefined, false], [undefined, undefined, false], [null, null, false], [123, 123, false]];
  for (const [a, b, want] of cases) {
    const r = nothrow(() => m.safeEqual(a, b));
    expect(!r.e, \`safeEqual(\${JSON.stringify(a)?.slice(0, 20)}, \${JSON.stringify(b)?.slice(0, 20)}) threw\`);
    expect(r.v === want, \`safeEqual(\${JSON.stringify(a)?.slice(0, 20)}, \${JSON.stringify(b)?.slice(0, 20)}) should be \${want}\`);
  }
});

// ── T5 safeEqual timing ──
await check('T5 safeEqual time does not depend on where strings differ', 1, () => {
  const secret = Buffer.from('s'.repeat(1024)).toString();
  const first = Array.from({ length: 8 }, () => Buffer.from('t' + 's'.repeat(1023)).toString());
  const last = Array.from({ length: 8 }, () => Buffer.from('s'.repeat(1023) + 't').toString());
  let hits = 0; // USE every result — otherwise the JIT may delete the comparison and time an empty loop (lesson 1.3)
  const time = (gs) => { const t = process.hrtime.bigint(); for (let i = 0; i < 20000; i++) if (m.safeEqual(gs[i & 7], secret)) hits++; return Number(process.hrtime.bigint() - t); };
  const a = []; const b = [];
  for (let r = 0; r < 15; r++) { if (r & 1) { b.push(time(last)); a.push(time(first)); } else { a.push(time(first)); b.push(time(last)); } }
  const med = (x) => x.sort((p, q) => p - q)[7];
  const ratio = med(b) / med(a);
  expect(hits === 0, 'safeEqual said two different strings are equal');
  expect(ratio < 1.5, \`differs-at-the-end / differs-at-the-start = \${ratio.toFixed(2)}× (needs < 1.5×) on 1024-char strings\`);
});

const KEYS = { k1: 'demo-key-one-not-secret', k2: 'demo-key-two-not-secret' };
const NOW = Date.UTC(2026, 10, 1, 6, 0, 0); // 2026-11-01T06:00:00Z

// ── T6 signed values: round trip + tampering ──
await check('T6 signValue / verifyValue: round trip, tampered value / expiry / signature', 1.5, () => {
  const s = m.signValue('usr_1|STUDENT', { keys: KEYS, kid: 'k1', ttlSec: 900, now: NOW });
  expect(m.verifyValue(s, { keys: KEYS, now: NOW }) === 'usr_1|STUDENT', 'a fresh value does not verify');
  const p = s.split('.');
  const other = Buffer.from('usr_3|LAB_MANAGER').toString('base64url');
  expect(m.verifyValue([other, ...p.slice(1)].join('.'), { keys: KEYS, now: NOW }) === null, 'a changed VALUE was accepted');
  expect(m.verifyValue([p[0], String(Number(p[1]) + 86400), ...p.slice(2)].join('.'), { keys: KEYS, now: NOW }) === null, 'a changed EXPIRY was accepted');
  const sig = p.at(-1);
  const flipped = sig.slice(0, -1) + (sig.at(-1) === 'A' ? 'B' : 'A');
  expect(m.verifyValue([...p.slice(0, -1), flipped].join('.'), { keys: KEYS, now: NOW }) === null, 'a changed SIGNATURE was accepted');
  const tricky = 'a.b.c|ñ✓';
  expect(m.verifyValue(m.signValue(tricky, { keys: KEYS, kid: 'k1', ttlSec: 60, now: NOW }), { keys: KEYS, now: NOW }) === tricky, 'a value with dots / unicode does not round-trip');
});

// ── T7 expiry boundaries ──
await check('T7 expiry: valid until exp − 1 s, null from exp on', 1, () => {
  const s = m.signValue('usr_1', { keys: KEYS, kid: 'k1', ttlSec: 900, now: NOW });
  expect(m.verifyValue(s, { keys: KEYS, now: NOW + 899_000 }) === 'usr_1', '899 s later it should still be valid');
  expect(m.verifyValue(s, { keys: KEYS, now: NOW + 900_000 }) === null, 'exactly at exp it must be null (now ≥ exp)');
  expect(m.verifyValue(s, { keys: KEYS, now: NOW + 86_400_000 }) === null, 'a day later it must be null');
});

// ── T8 format, key rotation, malformed input ──
await check('T8 format with kid, key rotation, malformed input never throws', 1, () => {
  const s = m.signValue('usr_1', { keys: KEYS, kid: 'k2', ttlSec: 60, now: NOW });
  expect(/^[A-Za-z0-9_-]+\\.\\d+\\.k2\\.[A-Za-z0-9_-]{43}$/.test(s), \`format should be value.exp.kid.sig, got \${JSON.stringify(s)}\`);
  const old = m.signValue('usr_1', { keys: KEYS, kid: 'k1', ttlSec: 60, now: NOW });
  expect(m.verifyValue(old, { keys: KEYS, now: NOW }) === 'usr_1', 'a value signed with k1 must verify while k1 is still in keys');
  expect(m.verifyValue(old, { keys: { k2: KEYS.k2 }, now: NOW }) === null, 'after k1 is removed, its values must be rejected');
  const forgedKid = old.replace('.k1.', '.k9.');
  expect(m.verifyValue(forgedKid, { keys: KEYS, now: NOW }) === null, 'unknown kid accepted');
  expect(m.verifyValue(old.replace('.k1.', '.toString.'), { keys: KEYS, now: NOW }) === null, 'kid "toString" must not find a key on the prototype');
  for (const bad of ['', 'abc', 'a.b.c', 'a.b.c.d.e', '...', '.1.k1.', 'x.NaN.k1.' + 'A'.repeat(43), undefined, null, 42, {}]) {
    const r = nothrow(() => m.verifyValue(bad, { keys: KEYS, now: NOW }));
    expect(!r.e, \`verifyValue(\${JSON.stringify(bad)}) threw \${r.e?.name}\`);
    expect(r.v === null, \`verifyValue(\${JSON.stringify(bad)}) should be null\`);
  }
});

// ── T9 redact ──
await check('T9 redact: allow-list, deep, input untouched', 1, () => {
  const input = { method: 'POST', headers: { 'user-agent': 'curl/8.7.1', authorization: 'Bearer x', 'x-session': 'lfid_ses_x', Cookie: 'sid=1' },
    body: { email: 'an@student.labflow.example', password: 'p', matKhau: 'p', items: [{ email: 'b@x', pwd: 'p' }] } };
  const before = JSON.stringify(input);
  const out = m.redact(input, ['method', 'headers', 'user-agent', 'body', 'email', 'items']);
  expect(JSON.stringify(input) === before, 'the input object was changed');
  const want = { method: 'POST', headers: { 'user-agent': 'curl/8.7.1', authorization: '[redacted]', 'x-session': '[redacted]', Cookie: '[redacted]' },
    body: { email: 'an@student.labflow.example', password: '[redacted]', matKhau: '[redacted]', items: [{ email: 'b@x', pwd: '[redacted]' }] } };
  expect(JSON.stringify(out) === JSON.stringify(want), \`got \${JSON.stringify(out)}\`);
});

// ── report ──
const src = fs.readFileSync(file, 'utf8');
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 1 — \${path.relative(process.cwd(), file)}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(76)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
if (/Math\\.random/.test(src)) console.log('! the source mentions Math.random — tokens, codes and ids must come from node:crypto');
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  starter: `// lab1/starter/index.js — Lab 1: LabFlow ID's toolkit of primitives. Replace every TODO; keep the exported names.
// Grade it:  node scripts/cham-lab-1.mjs lab1/starter      (10 points, pass = 7)
import { randomBytes, createHash, createHmac, timingSafeEqual } from 'node:crypto';

/** "<prefix>_<base64url of \`bytes\` random bytes>". prefix like "lfid_ses" (lowercase, digits, single underscores).
 *  Bad prefix ⇒ TypeError. bytes not an integer ≥ 16 ⇒ RangeError. */
export function newToken(prefix, bytes = 32) {
  throw new Error('TODO newToken');
}

/** SHA-256 of the token, lowercase hex (64 chars) — what the database stores. */
export function tokenDigest(token) {
  throw new Error('TODO tokenDigest');
}

/** true only if a and b are equal strings. Any lengths, never throws, time must not depend on where they differ. */
export function safeEqual(a, b) {
  throw new Error('TODO safeEqual');
}

/** "<base64url(value)>.<exp unix seconds>.<kid>.<base64url HMAC-SHA256(keys[kid], first three parts)>". */
export function signValue(value, { keys, kid, ttlSec, now = Date.now() }) {
  throw new Error('TODO signValue');
}

/** The value, or null: changed, expired (now ≥ exp), unknown kid, malformed — never throws. Check the signature first. */
export function verifyValue(signed, { keys, now = Date.now() }) {
  throw new Error('TODO verifyValue');
}

/** Deep copy; every key not in \`allow\` becomes "[redacted]"; arrays and nested objects are walked; input not changed. */
export function redact(value, allow) {
  throw new Error('TODO redact');
}`,
  yeu: `// lab1/yeu/index.js — a FIRST ATTEMPT that "works": every happy-path call returns the right thing.
// Lesson Lab 1 runs the grader on it to show what the happy path does not prove.
import { createHash, createHmac } from 'node:crypto';

export function newToken(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function tokenDigest(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function safeEqual(a, b) {
  return a === b;
}

export function signValue(value, { keys, ttlSec, now = Date.now() }) {
  const key = Object.values(keys)[0];
  const exp = Math.floor(now / 1000) + ttlSec;
  const sig = createHmac('sha256', key).update(value + '.' + exp).digest('base64url');
  return \`\${Buffer.from(value).toString('base64url')}.\${exp}.\${sig}\`;
}

export function verifyValue(signed, { keys, now = Date.now() }) {
  const [v, exp, sig] = signed.split('.');
  if (Math.floor(now / 1000) > Number(exp)) return null;
  const value = Buffer.from(v, 'base64url').toString();
  const key = Object.values(keys)[0];
  const good = createHmac('sha256', key).update(value + '.' + exp).digest('base64url');
  return sig === good ? value : null;
}

export function redact(value) {
  const copy = JSON.parse(JSON.stringify(value));
  if (copy.body?.password) copy.body.password = '[redacted]';
  if (copy.headers?.authorization) copy.headers.authorization = '[redacted]';
  return copy;
}`,
  testCrypto: `// test/crypto.test.js — the toolkit of Chapter 1, pinned by tests (npm test). Later chapters keep these green.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { newToken, tokenDigest, safeEqual, signValue, verifyValue, redact } from '../src/crypto/index.js';

const KEYS = { k1: 'demo-key-one-not-secret', k2: 'demo-key-two-not-secret' };
const NOW = Date.UTC(2026, 10, 1, 6, 0, 0);

test('newToken: prefix + 43 base64url chars, and checks its arguments', () => {
  assert.match(newToken('lfid_ses'), /^lfid_ses_[A-Za-z0-9_-]{43}$/);
  assert.throws(() => newToken('LFID'), TypeError);
  assert.throws(() => newToken('lfid_ses', 8), RangeError);
});

test('tokenDigest is SHA-256 hex', () => {
  assert.equal(tokenDigest('abc'), createHash('sha256').update('abc').digest('hex'));
});

test('safeEqual: equal, different, different lengths, not strings', () => {
  assert.equal(safeEqual('lfid_ses_x', 'lfid_ses_x'), true);
  assert.equal(safeEqual('lfid_ses_x', 'lfid_ses_y'), false);
  assert.equal(safeEqual('lfid_ses_x', 'lfid_ses_xx'), false);
  assert.equal(safeEqual(undefined, undefined), false);
});

test('signed value: round trip, tampering, expiry boundary', () => {
  const s = signValue('usr_1', { keys: KEYS, kid: 'k1', ttlSec: 900, now: NOW });
  assert.equal(verifyValue(s, { keys: KEYS, now: NOW + 899_000 }), 'usr_1');
  assert.equal(verifyValue(s, { keys: KEYS, now: NOW + 900_000 }), null);
  const [, exp, kid, sig] = s.split('.');
  assert.equal(verifyValue([Buffer.from('usr_3').toString('base64url'), exp, kid, sig].join('.'), { keys: KEYS, now: NOW }), null);
});

test('signed value: key rotation and malformed input', () => {
  const old = signValue('usr_1', { keys: KEYS, kid: 'k1', ttlSec: 60, now: NOW });
  assert.equal(verifyValue(old, { keys: KEYS, now: NOW }), 'usr_1');
  assert.equal(verifyValue(old, { keys: { k2: KEYS.k2 }, now: NOW }), null);
  for (const bad of ['', 'a.b.c', undefined, 42]) assert.equal(verifyValue(bad, { keys: KEYS, now: NOW }), null);
});

test('redact keeps only allowed keys, deeply', () => {
  assert.deepEqual(redact({ body: { email: 'a', password: 'p' } }, ['body', 'email']), { body: { email: 'a', password: '[redacted]' } });
});`,
  pkg: `{
  "name": "labflow-id",
  "version": "0.1.0",
  "private": true,
  "description": "LabFlow ID — the identity service of the LabFlow platform, built step by step in the Authentication course (cuongthai.com/courses/authentication)",
  "type": "module",
  "engines": {
    "node": ">=22.12"
  },
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "seed": "node scripts/seed.mjs",
    "test": "node --test --test-reporter=spec \\"test/**/*.test.js\\""
  },
  "dependencies": {
    "express": "5.3.0",
    "pino": "10.4.0"
  },
  "devDependencies": {
    "axios": "1.21.0",
    "playwright": "1.64.1",
    "vite": "8.3.5"
  }
}`,
};
export const OUT = {
  '11-an': `$ T=$(curl -s localhost:4800/sign-in --json '{"name":"An"}' | node -p 'JSON.parse(require("fs").readFileSync(0)).token'); echo "$T" > /tmp/auth-an.tok; echo "An's token: \${T:0:16}…"; curl -s -w '\\n' localhost:4800/me -H "Authorization: Bearer $T"
An's token: lfid_ses_-6Vofi0…
{"you":"An"}`,
  '11-ke-cap': `$ T=$(cat /tmp/auth-an.tok); curl -s -w '\\n' http://127.0.0.1:4800/me -A 'Mozilla/5.0 (X11; Linux x86_64) Firefox/140.0' -H "Authorization: Bearer $T"; curl -s -w '\\n' http://127.0.0.1:4800/me -A 'Mozilla/5.0 (X11; Linux x86_64) Firefox/140.0' -H "Authorization: Bearer \${T}x"
{"you":"An"}
{"error":"UNAUTHENTICATED"}`,
  '11-log-labflow': `$ node demo1/bearer.js
demo1/bearer.js on http://localhost:4800
::1 "POST /sign-in" 200 "curl/8.7.1"
::1 "GET /me" 200 "curl/8.7.1"
::ffff:127.0.0.1 "GET /me" 200 "Firefox/140.0"
::ffff:127.0.0.1 "GET /me" 401 "Firefox/140.0"
::1 "GET /reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs" 200 "HeadlessChrome/156.0.8078.4"
  ↳ same-origin request, Referer: http://localhost:4800/reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs
::1 "GET /static/app.js" 200 "HeadlessChrome/156.0.8078.4"
::1 "GET /reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs&policy=no-referrer-when-downgrade" 200 "HeadlessChrome/156.0.8078.4"
  ↳ same-origin request, Referer: http://localhost:4800/reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs&policy=no-referrer-when-downgrade
::1 "GET /static/app.js" 200 "HeadlessChrome/156.0.8078.4"
::1 "GET /reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs&policy=unsafe-url" 200 "HeadlessChrome/156.0.8078.4"
  ↳ same-origin request, Referer: http://localhost:4800/reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs&policy=unsafe-url
::1 "GET /static/app.js" 200 "HeadlessChrome/156.0.8078.4"
::1 "GET /reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs&policy=no-referrer" 200 "HeadlessChrome/156.0.8078.4"
  ↳ same-origin request, Referer: (none)
::1 "GET /static/app.js" 200 "HeadlessChrome/156.0.8078.4"`,
  '11-log-third': `$ node demo1/third-party.js
demo1/third-party.js on http://127.0.0.1:4801
[third-party] GET /pixel.gif  Referer: http://localhost:4800/
[third-party] GET /pixel.gif  Referer: http://localhost:4800/reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs&policy=no-referrer-when-downgrade
[third-party] GET /pixel.gif  Referer: http://localhost:4800/reset?token=lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs&policy=unsafe-url
[third-party] GET /pixel.gif  Referer: (none)`,
  '11-referer': `$ node demo1/open-reset.mjs lfid_reset_lc-NOs0oEzuyaNQlhMcceU9fL_wDslgIG2Ps2x8CyAs
opened with Referrer-Policy: (not set — browser default)
opened with Referrer-Policy: no-referrer-when-downgrade
opened with Referrer-Policy: unsafe-url
opened with Referrer-Policy: no-referrer
Chromium 156.0.8078.4`,
  '12-bit': `$ node demo1/bits.mjs
 20 bits ·   1.05e+6 values · average 0.5 µs
 32 bits ·   4.29e+9 values · average 2.1 ms
 40 bits ·  1.10e+12 values · average 549.8 ms
 64 bits ·  1.84e+19 values · average 106.8 days
 80 bits ·  1.21e+24 values · average 1.9e+4 years
122 bits ·  5.32e+36 values · average 8.4e+16 years
128 bits ·  3.40e+38 values · average 5.4e+18 years
256 bits ·  1.16e+77 values · average 1.8e+57 years
(age of the universe ≈ 1.4e10 years)`,
  '12-dinh-dang': `$ node demo1/token-formats.mjs
randomBytes(16) hex                  32 chars · 128 random bits · 36b4c92c4c7d…
randomBytes(16) base64url            22 chars · 128 random bits · NrTJLEx9kx7v…
randomBytes(32) base64url            43 chars · 256 random bits · nFof-2EjtHpg…
randomUUID() (v4)                    36 chars · 122 random bits · 1afa114c-6b5…
newToken('lfid_ses')                 52 chars · 256 random bits · lfid_ses_NxQ…
Math.random().toString(36).slice(2)  11 chars ·   0 random bits · 1bo3ipuomxa…`,
  '12-doan-3': `$ node demo1/predict-math-random.mjs 3
solved 116 of 128 state bits from 156 equations
seen      #1  0.7687417272143058
seen      #2  0.07857574009734059
seen      #3  0.586388501710067
predicted #4  0.5822130548980315  ✗ actual 0.5795122489120079
predicted #5  0.16967548824640732  ✗ actual 0.19037344445534465
predicted #6  0.00023779199541862361  ✗ actual 0.30157791535542255
predicted #7  0.00008835429173914555  ✗ actual 0.6470860057437933
predicted #8  0.6746601670690242  ✗ actual 0.7851129921291875`,
  '12-doan-4': `$ node demo1/predict-math-random.mjs 4
solved 128 of 128 state bits from 208 equations
seen      #1  0.7980436820674115
seen      #2  0.43409064224165506
seen      #3  0.6773433750681119
seen      #4  0.5789724990920304
predicted #5  0.7036498251610732  ✓ matches
predicted #6  0.9511165411270226  ✓ matches
predicted #7  0.36864341469745265  ✓ matches
predicted #8  0.3003555395543658  ✓ matches
predicted #9  0.8369273864584925  ✓ matches`,
  '12-hat-giong': `$ node --random-seed=42 -p 'Math.random()'; node --random-seed=42 -p 'Math.random()'; node --random-seed=42 -p 'require("node:crypto").randomBytes(8).toString("hex")'; node --random-seed=42 -p 'require("node:crypto").randomBytes(8).toString("hex")'
0.7939112874678715
0.7939112874678715
d89be5dda68c0ee9
91a26dd4daf13574`,
  '12-modulo': `$ node demo1/modulo-bias.mjs
digit · byte % 10 · randomInt(10)   (1,000,000 draws each)
  0   ·    101778 ·    100139
  1   ·    101766 ·     99799
  2   ·    101703 ·     99738
  3   ·    100371 ·     99910
  4   ·    101371 ·     99898
  5   ·    101521 ·    100184
  6   ·     97883 ·    100020
  7   ·     98386 ·    100574
  8   ·     97115 ·    100046
  9   ·     98106 ·     99692
expected with % 10: digits 0–5 → 26/256 = 10.16%, digits 6–9 → 25/256 = 9.77%`,
  '12-sinh-nhat': `$ node demo1/birthday.mjs
 32 bits: 50% chance of a collision after 7.72e+4 tokens = 1.3 minutes at 1,000 new tokens/s
 64 bits: 50% chance of a collision after 5.06e+9 tokens = 58.5 days at 1,000 new tokens/s
122 bits: 50% chance of a collision after 2.71e+18 tokens = 8.6e+7 years at 1,000 new tokens/s
128 bits: 50% chance of a collision after 2.17e+19 tokens = 6.9e+8 years at 1,000 new tokens/s`,
  '12-v01-dang-nhap': `$ curl -s -w '\\n' localhost:4800/sign-in --json '{"email":"an@student.labflow.example","password":"an-lab-2026"}' | tee tmp/an.json; date +%H:%M
{"session":"lfid_ses_Dfcgu3iL-Yjddndj4VzrVgLHEop1b0Jtiq5i-mVTxXc"}
13:12`,
  '12-v01-doan': `$ node demo0/guess-session.mjs 13:12
window: 60,000 possible ids (one minute of Date.now())
tried 60000 ids in 6.70 s (8953 requests/s)
not found`,
  '13-do-1024': `$ LEN=1024 POS=0,128,256,512,768,1023,1024 node demo1/timing-equal.mjs strict
Node v22.23.3 · === · 1024-char token · median of 21 rounds × 1,000,000
 0 leading chars right → 4.61 ns
128 leading chars right → 8.54 ns
256 leading chars right → 14.14 ns
512 leading chars right → 22.07 ns
768 leading chars right → 29.91 ns
1023 leading chars right → 38.05 ns
1024 leading chars right → 36.98 ns
(21,000,000 comparisons returned true — only the 'all right' row)`,
  '13-do-dai': `$ node -e "require('node:crypto').timingSafeEqual(Buffer.from('abc'), Buffer.from('abcd'))" 2>&1 | grep -m2 -E 'RangeError|code'
RangeError: Input buffers must have the same byte length
  code: 'ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH'`,
  '13-do-naive': `$ node demo1/timing-naive.mjs strict
Node v22.23.3 · === · 64-char token · median of 21 rounds × 1,000,000
 0 leading chars right → 0.99 ns
 1 leading chars right → 0.99 ns
 8 leading chars right → 0.99 ns
16 leading chars right → 0.99 ns
32 leading chars right → 0.99 ns
48 leading chars right → 0.99 ns
63 leading chars right → 0.99 ns
64 leading chars right → 0.99 ns
(21,000,000 comparisons returned true — only the 'all right' row)`,
  '13-do-safe': `$ node demo1/timing-equal.mjs safe
Node v22.23.3 · timingSafeEqual · 64-char token · median of 21 rounds × 1,000,000
 0 leading chars right → 65.13 ns
 1 leading chars right → 65.71 ns
 8 leading chars right → 65.63 ns
16 leading chars right → 65.32 ns
32 leading chars right → 64.80 ns
48 leading chars right → 66.74 ns
63 leading chars right → 65.47 ns
64 leading chars right → 65.49 ns
(21,000,000 comparisons returned true — only the 'all right' row)`,
  '13-do-strict': `$ node demo1/timing-equal.mjs strict
Node v22.23.3 · === · 64-char token · median of 21 rounds × 1,000,000
 0 leading chars right → 4.61 ns
 1 leading chars right → 4.56 ns
 8 leading chars right → 4.59 ns
16 leading chars right → 5.28 ns
32 leading chars right → 6.29 ns
48 leading chars right → 6.61 ns
63 leading chars right → 6.56 ns
64 leading chars right → 6.24 ns
(21,000,000 comparisons returned true — only the 'all right' row)`,
  '13-safe-equal': `$ node demo1/safe-equal.mjs
same token          → true
last char different → false
shorter             → false
empty / not a string → false false`,
  '13-tu-xa-1': `$ node demo1/timing-remote.mjs
20,000 requests per guess, 127.0.0.1, one keep-alive connection
first char wrong: p10 42.9 µs · median 58.8 µs · p90 100.4 µs
last char wrong : p10 42.7 µs · median 58.9 µs · p90 103.1 µs
median difference: 125 ns (the in-process difference was about 2 ns)`,
  '13-tu-xa-2': `$ node demo1/timing-remote.mjs
20,000 requests per guess, 127.0.0.1, one keep-alive connection
first char wrong: p10 47.0 µs · median 58.1 µs · p90 98.0 µs
last char wrong : p10 47.0 µs · median 58.0 µs · p90 98.0 µs
median difference: -126 ns (the in-process difference was about 2 ns)`,
  '13-tu-xa-3': `$ node demo1/timing-remote.mjs
20,000 requests per guess, 127.0.0.1, one keep-alive connection
first char wrong: p10 47.5 µs · median 56.2 µs · p90 77.8 µs
last char wrong : p10 47.4 µs · median 56.1 µs · p90 78.1 µs
median difference: -42 ns (the in-process difference was about 2 ns)`,
  '13-v01-db': `$ node -p 'JSON.stringify(require("./data/db.json").sessions, null, 2)'
[
  {
    "digest": "00ce0da2b200ef2a43a66fab1601daaaa2130be1d2477354ae78a34fc471e752",
    "userId": "usr_1"
  }
]`,
  '13-v01-me': `$ S=$(node -p 'require("./tmp/an.json").session'); curl -s -w '\\n' localhost:4800/me -H "x-session: $S"
{"id":"usr_1","email":"an@student.labflow.example","name":"Nguyen Van An"}`,
  '13-webhook': `$ node demo1/webhook.mjs
parsed body, fresh          → BAD_SIGNATURE
raw body, fresh             → OK
raw body, user changed      → BAD_SIGNATURE
raw body, replayed 10 min   → TOO_OLD`,
  '14-ba-cong-cu': `$ node demo1/three-tools.mjs
sha256       15e8431cca1088cb6c3397d85a704ef9306364ac524b1a872f7e1d96329bbb87
sha256 (1 char changed) 4757d15bacf6d92184300eed2bc0c80793642052f25eb5067a839f8bd897d43b
hmac-sha256  169600ba0ffc70b5b9f3b75f3754e07152a7cf2184e4062e83f5e93591779600
ed25519 sig  64 bytes: IqYE85g1dQAGfxz4aApYaaVP…
verify with the public key            → true
verify a changed message              → false
try to SIGN with the public key       → ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE`,
  '14-khoa-chung': `$ node demo1/shared-key.mjs
A · An’s token checks out          → true { sub: 'usr_1', role: 'STUDENT' }
A · token made by billing checks out → true { sub: 'usr_1', role: 'LAB_MANAGER' }
B · billing checks An’s token       → true { sub: 'usr_1', role: 'STUDENT' }
B · billing tries to make a token   → ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE
B · reuse An’s signature on a new payload → false`,
  '14-ky-gia-tri-ma': `$ cat demo1/signed-demo.mjs
// demo1/signed-demo.mjs — lesson 1.4: a signed value with an expiry and a key id (src/crypto/signed.js).
import { signValue, verifyValue } from '../src/crypto/index.js';

const keys = { k1: process.env.DEMO_KEY_1, k2: process.env.DEMO_KEY_2 }; // FAKE demo keys
const NOW = Date.UTC(2026, 10, 1, 6, 0, 0); // 13:00 in Hanoi — a fixed clock, so the output is repeatable
const card = signValue('usr_1|STUDENT', { keys, kid: 'k1', ttlSec: 900, now: NOW });
console.log('signed      :', card);
console.log('verify now  :', verifyValue(card, { keys, now: NOW }));
const [v, exp, kid, sig] = card.split('.');
const other = Buffer.from('usr_1|LAB_MANAGER').toString('base64url');
console.log('new value   :', verifyValue([other, exp, kid, sig].join('.'), { keys, now: NOW }));
console.log('later exp   :', verifyValue([v, Number(exp) + 86400, kid, sig].join('.'), { keys, now: NOW }));
console.log('+899 s      :', verifyValue(card, { keys, now: NOW + 899_000 }));
console.log('+900 s      :', verifyValue(card, { keys, now: NOW + 900_000 }));
console.log('k1 retired  :', verifyValue(card, { keys: { k2: keys.k2 }, now: NOW }));`,
  '14-ky-gia-tri': `$ node demo1/signed-demo.mjs
signed      : dXNyXzF8U1RVREVOVA.1793513700.k1.txyDfib_FlLrl8xoSsI06wHz6MQ4byxY3YJBIW9g210
verify now  : usr_1|STUDENT
new value   : null
later exp   : null
+899 s      : usr_1|STUDENT
+900 s      : null
k1 retired  : null`,
  '14-ma-hoa': `$ node demo1/encrypt-not-protect.mjs
ciphertext (CTR) : f4D8CvjNMVCsydaCIamyunxjrkKXtzr0dhxqC1w
server decrypts  : {"uid":"usr_1","admin":true } → admin = true
GCM decrypt      : Unsupported state or unable to authenticate data`,
  '14-noi-dai': `$ node demo1/length-extension.mjs
own sha256 = node sha256: true
issued  : user=usr_1&role=STUDENT · tag b566226e0843a49d…
forged  : user=usr_1&role=STUDENT\\x80\\x00×14\\x01x&role=LAB_MANAGER (57 bytes)
sha256(secret+msg) accepts the forgery: true → role = LAB_MANAGER
HMAC accepts the forgery: false`,
  '14-thuc-hanh-do-dai': `$ node demo1/guess-key-length.mjs
accepted on try 18: key length is 18 bytes (real: 18)`,
  '14-thuc-hanh-ma': `$ cat demo1/guess-key-length.mjs
// demo1/guess-key-length.mjs — practice 1.4: the attacker does NOT know the key length. Try them all.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { sha256, padding } from './sha256.mjs';

const SECRET = randomBytes(16 + Math.floor(Math.random() * 17)); // 16…32 bytes, unknown to the attacker
const tagNaive = (m) => createHash('sha256').update(Buffer.concat([SECRET, m])).digest();
const accepts = (m, t) => timingSafeEqual(tagNaive(m), t); // the server, used as an oracle

const msg = Buffer.from('user=usr_1&role=STUDENT');
const tag = tagNaive(msg);
const extra = Buffer.from('&role=LAB_MANAGER');
for (let len = 1; len <= 64; len++) {
  const pad = padding(len + msg.length);
  const forged = Buffer.concat([msg, pad, extra]);
  if (accepts(forged, sha256(extra, tag, len + msg.length + pad.length))) {
    console.log(\`accepted on try \${len}: key length is \${len} bytes (real: \${SECRET.length})\`);
    break;
  }
}`,
  '15-axios': `$ node demo1/axios-error.mjs > tmp/app.log; wc -c tmp/app.log; grep -o 'pk_demo_partner_key_000' tmp/app.log | wc -l; head -c 330 tmp/app.log; echo ' …'; tail -1 tmp/app.log
    9773 tmp/app.log
       5
{"level":50,"err":{"code":"ERR_BAD_RESPONSE","config":{"adapter":["xhr","http","fetch"],"allowAbsoluteUrls":true,"env":{},"headers":{"Accept":"application/json, text/plain, */*","Accept-Encoding":"gzip, compress, deflate, br","Authorization":"Bearer pk_demo_partner_key_000","User-Agent":"axios/1.21.0"},"maxBodyLength":-1,"maxCon …
{"level":50,"status":500,"code":"ERR_BAD_RESPONSE","error":"Request failed with status code 500","msg":"payment API failed (safe)"}`,
  '15-env-con': `$ LFID_SIGNING_KEY=lfid_key_demo_000 node -e "require('node:child_process').execSync('node -p process.env.LFID_SIGNING_KEY', { stdio: 'inherit' })"
lfid_key_demo_000`,
  '15-git-1': `$ bash demo1/git/make-leak.sh tmp/shop lfid_key_00Hrn21xnHuxfIBnCmJaeEyzvbN6Z1Ex0M6XM-NiWdk lfid_ses_nrb_pw07YKkzbnfUYDsQUry01Yoi881il359Ma8gcGA
--- files git tracks now:
.gitignore
test/fixtures/session.json
--- history:
6a10e85 remove .env, add .gitignore
57dc980 add config and a test fixture`,
  '15-git-2': `$ cd tmp/shop && git log --oneline -S lfid_key_ && git show HEAD~1:.env
6a10e85 remove .env, add .gitignore
57dc980 add config and a test fixture
PORT=4800
LFID_SIGNING_KEY=lfid_key_00Hrn21xnHuxfIBnCmJaeEyzvbN6Z1Ex0M6XM-NiWdk`,
  '15-git-3': `$ cd tmp/shop && gitleaks git . --no-banner --redact -v 2>&1 | grep -E 'Finding|RuleID|File:|leaks found'; echo "exit \${PIPESTATUS[0]}"
Finding:     LFID_SIGNING_KEY=REDACTED
RuleID:      generic-api-key
File:        .env
1:09PM WRN leaks found: 1
exit 1`,
  '15-git-4': `$ cd tmp/shop && gitleaks git . --no-banner --redact -v --config ../../demo1/git/gitleaks-lfid.toml 2>&1 | grep -E 'Finding|RuleID|File:|leaks found'; echo "exit \${PIPESTATUS[0]}"
Finding:     ...": "usr_1", "sid": "REDACTED" }
RuleID:      labflow-id-secret
File:        test/fixtures/session.json
Finding:     LFID_SIGNING_KEY=REDACTED
RuleID:      labflow-id-secret
File:        .env
1:09PM WRN leaks found: 2
exit 1`,
  '15-log-server': `$ node demo1/log-demo.js
demo1/log-demo.js on http://localhost:4800
sign-in {
  headers: {
    host: 'localhost:4800',
    'user-agent': 'curl/8.7.1',
    'x-session': 'lfid_ses_demo-session-of-an',
    authorization: 'Bearer lfid_key_demo-key-of-an',
    'content-type': 'application/json',
    accept: 'application/json',
    'content-length': '91'
  },
  body: {
    email: 'an@student.labflow.example',
    password: 'an-lab-2026',
    newPassword: 'an-lab-2027'
  }
}
{"level":30,"headers":{"host":"localhost:4800","user-agent":"curl/8.7.1","x-session":"lfid_ses_demo-session-of-an","authorization":"[Redacted]","content-type":"application/json","accept":"application/json","content-length":"91"},"body":{"email":"an@student.labflow.example","password":"[Redacted]","newPassword":"an-lab-2027"},"msg":"sign-in"}
{"level":30,"headers":{"host":"localhost:4800","user-agent":"curl/8.7.1","x-session":"[redacted]","authorization":"[redacted]","content-type":"application/json","accept":"[redacted]","content-length":"[redacted]"},"body":{"email":"an@student.labflow.example","password":"[redacted]","newPassword":"[redacted]"},"msg":"sign-in"}`,
  '15-req-allow': `$ curl -s -w '\\n' localhost:4800/allow/sign-in -H 'x-session: lfid_ses_demo-session-of-an' -H "Authorization: Bearer $DEMO_KEY" --json '{"email":"an@student.labflow.example","password":"an-lab-2026","newPassword":"an-lab-2027"}'
{"ok":true}`,
  '15-req-deny': `$ curl -s -w '\\n' localhost:4800/deny/sign-in -H 'x-session: lfid_ses_demo-session-of-an' -H "Authorization: Bearer $DEMO_KEY" --json '{"email":"an@student.labflow.example","password":"an-lab-2026","newPassword":"an-lab-2027"}'
{"ok":true}`,
  '15-req-naive': `$ curl -s -w '\\n' localhost:4800/naive/sign-in -H 'x-session: lfid_ses_demo-session-of-an' -H "Authorization: Bearer $DEMO_KEY" --json '{"email":"an@student.labflow.example","password":"an-lab-2026","newPassword":"an-lab-2027"}'
{"ok":true}`,
  '15-thuc-hanh-log': `$ node demo1/log-demo.js
demo1/log-demo.js on http://localhost:4800
{"level":30,"headers":{"host":"localhost:4800","user-agent":"curl/8.7.1","content-type":"application/json","accept":"application/json","content-length":"78"},"body":{"email":"an@student.labflow.example","password":"[Redacted]","otp":"491023"},"msg":"sign-in"}
{"level":30,"headers":{"host":"localhost:4800","user-agent":"curl/8.7.1","content-type":"application/json","accept":"[redacted]","content-length":"[redacted]"},"body":{"email":"an@student.labflow.example","password":"[redacted]","otp":"[redacted]"},"msg":"sign-in"}`,
  '15-thuc-hanh-req': `$ for k in deny allow; do curl -s -o /dev/null localhost:4800/$k/sign-in --json '{"email":"an@student.labflow.example","password":"an-lab-2026","otp":"491023"}'; done`,
  '15-v01-log': `$ node src/server.js
{"level":30,"time":1793513540320,"msg":"LabFlow ID v0.1 on http://localhost:4800"}
{"level":30,"time":1793513540386,"method":"POST","path":"/sign-in","status":200,"ms":2,"ip":"::1","headers":{"host":"[redacted]","user-agent":"curl/8.7.1","content-type":"application/json","accept":"[redacted]","content-length":"[redacted]"},"body":{"email":"an@student.labflow.example","password":"[redacted]"},"msg":"request"}
{"level":30,"time":1793513540396,"method":"GET","path":"/me","status":401,"ms":1,"ip":"::1","headers":{"host":"[redacted]","user-agent":"curl/8.7.1","accept":"[redacted]","x-session":"[redacted]"},"body":null,"msg":"request"}`,
  '15-v01-req': `$ curl -s -o /dev/null localhost:4800/sign-in --json '{"email":"an@student.labflow.example","password":"an-lab-2026"}'; curl -s -o /dev/null 'localhost:4800/me?debug_token=lfid_ses_pasted-by-mistake' -H 'x-session: lfid_ses_demo-old-session'`,
  '15-vite': `$ cd demo1/web && VITE_PAYMENT_SECRET_KEY=sk_demo_payment_000 LFID_SIGNING_KEY=lfid_key_demo_000 npx vite build --logLevel warn && ls dist/assets && grep -o '.\\{60\\}sk_demo_payment_000.\\{20\\}' dist/assets/*.js; echo "lfid_key_demo_000 in bundle: $(grep -c 'lfid_key_demo_000' dist/assets/*.js)"
index-a1t7pdHK.js
e/v1/charges\`,{method:\`POST\`,headers:{Authorization:\`Bearer sk_demo_payment_000\`,"content-type":\`ap
lfid_key_demo_000 in bundle: 0`,
  '1x-seed': `$ npm run seed --silent
201 an@student.labflow.example {"id":"usr_1"}
201 binh@student.labflow.example {"id":"usr_2"}
201 lan@labflow.example {"id":"usr_3"}`,
  'lab-bat-dau': `$ cp -r lab1/starter lab1/my && node scripts/cham-lab-1.mjs lab1/my | tail -1
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test

> labflow-id@0.1.0 test
> node --test --test-reporter=spec "test/**/*.test.js"

✔ newToken: prefix + 43 base64url chars, and checks its arguments (0.725125ms)
✔ tokenDigest is SHA-256 hex (0.281667ms)
✔ safeEqual: equal, different, different lengths, not strings (0.179792ms)
✔ signed value: round trip, tampering, expiry boundary (0.3395ms)
✔ signed value: key rotation and malformed input (0.168833ms)
✔ redact keeps only allowed keys, deeply (0.395792ms)
ℹ tests 6
ℹ suites 0
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 55.644792`,
  'lab-starter': `$ node scripts/cham-lab-1.mjs lab1/starter
Lab 1 — lab1/starter/index.js
✗ T1 newToken format and argument checks                                       0/1
    ↳ your code threw Error: TODO newToken
✗ T2 newToken uses the CSPRNG, never Math.random                               0/1.5
    ↳ your code threw Error: TODO newToken
✗ T3 tokenDigest = SHA-256 hex                                                 0/0.5
    ↳ your code threw Error: TODO tokenDigest
✗ T4 safeEqual answers correctly and never throws                              0/1.5
    ↳ safeEqual("lfid_ses_xxxxxxxxxx, "lfid_ses_xxxxxxxxxx) threw
✗ T5 safeEqual time does not depend on where strings differ                    0/1
    ↳ your code threw Error: TODO safeEqual
✗ T6 signValue / verifyValue: round trip, tampered value / expiry / signature  0/1.5
    ↳ your code threw Error: TODO signValue
✗ T7 expiry: valid until exp − 1 s, null from exp on                           0/1
    ↳ your code threw Error: TODO signValue
✗ T8 format with kid, key rotation, malformed input never throws               0/1
    ↳ your code threw Error: TODO signValue
✗ T9 redact: allow-list, deep, input untouched                                 0/1
    ↳ your code threw Error: TODO redact
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-tham-khao': `$ node scripts/cham-lab-1.mjs src/crypto
Lab 1 — src/crypto/index.js
✓ T1 newToken format and argument checks                                       1/1
✓ T2 newToken uses the CSPRNG, never Math.random                               1.5/1.5
✓ T3 tokenDigest = SHA-256 hex                                                 0.5/0.5
✓ T4 safeEqual answers correctly and never throws                              1.5/1.5
✓ T5 safeEqual time does not depend on where strings differ                    1/1
✓ T6 signValue / verifyValue: round trip, tampered value / expiry / signature  1.5/1.5
✓ T7 expiry: valid until exp − 1 s, null from exp on                           1/1
✓ T8 format with kid, key rotation, malformed input never throws               1/1
✓ T9 redact: allow-list, deep, input untouched                                 1/1
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-1.mjs lab1/yeu
Lab 1 — lab1/yeu/index.js
✗ T1 newToken format and argument checks                                       0/1
    ↳ "lfid_ses" + 32 bytes should be lfid_ses_ + 43 base64url chars, got "lfid_ses_m5pzxhnnp6emvxgda1g"… (28 chars)
✗ T2 newToken uses the CSPRNG, never Math.random                               0/1.5
    ↳ your code threw Error: Math.random was called (the grader replaced it with a trap)
✓ T3 tokenDigest = SHA-256 hex                                                 0.5/0.5
✗ T4 safeEqual answers correctly and never throws                              0/1.5
    ↳ safeEqual(undefined, undefined) should be false
✗ T5 safeEqual time does not depend on where strings differ                    0/1
    ↳ differs-at-the-end / differs-at-the-start = 7.47× (needs < 1.5×) on 1024-char strings
✓ T6 signValue / verifyValue: round trip, tampered value / expiry / signature  1.5/1.5
✗ T7 expiry: valid until exp − 1 s, null from exp on                           0/1
    ↳ exactly at exp it must be null (now ≥ exp)
✗ T8 format with kid, key rotation, malformed input never throws               0/1
    ↳ format should be value.exp.kid.sig, got "dXNyXzE.1793512860.jF8zL8TxqWWnnyjG73rT2nvXC8RM-nBBIcnt2w3b5LA"
✗ T9 redact: allow-list, deep, input untouched                                 0/1
    ↳ got {"method":"POST","headers":{"user-agent":"curl/8.7.1","authorization":"[redacted]","x-session":"lfid_ses_x","Cookie":"sid=1"},"body":{"email":"an@student.labflow.example","password":"[redacted]","matKhau":"p","items":[{"email":"b@x","pwd":"p"}]}}
! the source mentions Math.random — tokens, codes and ids must come from node:crypto
TOTAL 2/10 — NOT YET (pass = 7)`,
};
