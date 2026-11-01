/**
 * _ma.mjs (Chương 2) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  sql001: `-- sql/001_users.sql — Chapter 2: users live in PostgreSQL; the password column holds a self-describing hash string.
CREATE TABLE users (
  id                   text PRIMARY KEY,                 -- usr_1, usr_2 … (same ids as the other LabFlow courses)
  email                text NOT NULL UNIQUE,             -- stored lower-case
  name                 text NOT NULL,
  role                 text NOT NULL DEFAULT 'STUDENT',  -- STUDENT | LAB_MANAGER
  password_hash        text NOT NULL,                    -- $argon2id$v=19$m=…,t=…,p=…$salt$hash
  must_change_password boolean NOT NULL DEFAULT false,   -- set when the password is found in a breach list (lesson 2.4)
  created_at           timestamptz NOT NULL DEFAULT now()
);
CREATE SEQUENCE user_seq;

-- Sessions keep the v0.1 design (only a SHA-256 digest of the token). Chapter 3 adds expiry, last_seen, ip/ua.
CREATE TABLE sessions (
  digest     text PRIMARY KEY,
  user_id    text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
  db: `// src/db.js — Chapter 2: LabFlow ID moves from data/db.json to PostgreSQL 17.
// One pool per process. DATABASE_URL comes from the environment (lesson 1.5: secrets reach the process at run time).
import pg from 'pg';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

/** One query, parameters always separate from the SQL text (never string concatenation). */
export const q = (text, params = []) => pool.query(text, params);`,
  users: `// src/users.js — the users table (PostgreSQL), shaped as the small "store" that signIn() expects.
import { q } from './db.js';

const row = (r) => r && { id: r.id, email: r.email, name: r.name, role: r.role, passwordHash: r.password_hash, mustChangePassword: r.must_change_password };

export const users = {
  async findByEmail(email) {
    return row((await q('SELECT * FROM users WHERE email = $1', [email])).rows[0]);
  },
  async findById(id) {
    return row((await q('SELECT * FROM users WHERE id = $1', [id])).rows[0]);
  },
  async create({ email, name, role = 'STUDENT', passwordHash }) {
    const r = await q(\`INSERT INTO users (id, email, name, role, password_hash)
      VALUES ('usr_' || nextval('user_seq'), $1, $2, $3, $4) RETURNING *\`, [email.trim().toLowerCase(), name, role, passwordHash]);
    return row(r.rows[0]);
  },
  async updateHash(id, passwordHash) {
    await q('UPDATE users SET password_hash = $2 WHERE id = $1', [id, passwordHash]);
  },
  async flagMustChange(id) {
    await q('UPDATE users SET must_change_password = true WHERE id = $1', [id]);
  },
};`,
  server02: `// src/server.js — LabFlow ID v0.2 (end of Chapter 2). Fixed so far:
//   hole 1 — passwords are argon2id hashes in PostgreSQL, parameters chosen by measurement, old hashes upgraded on login;
//   hole 2 (sign-in half) — one answer and the same work for "no such email" and "wrong password" (lesson 2.3);
//   hole 3 — CSPRNG session ids, only their SHA-256 stored (lessons 1.2, 1.3); credentials never logged (lesson 1.5).
// Still open: holes 4, 5, 6 and the sign-up half of hole 2 — Chapters 3, 6, 10. Never deploy this file.
import express from 'express';
import { q } from './db.js';
import { users } from './users.js';
import { newToken, tokenDigest } from './crypto/index.js';
import { hashPassword, checkNewPassword, loadBlocklist, pwnedCount, signIn } from './passwords/index.js';
import { log, requestLog } from './log.js';

const BLOCKLIST = loadBlocklist();
const app = express();
app.use(requestLog);                     // first, so even a request the body parser rejects (413, bad JSON) gets its log line
app.use(express.json({ limit: '8kb' })); // a password is ≤ 128 characters; nobody needs a 100 kB sign-in body

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
  if (error) return res.status(401).json({ error: 'Email or password is incorrect' }); // one message for both cases
  const common = BLOCKLIST.has(password.normalize('NFC').toLowerCase());
  if (common) await users.flagMustChange(user.id); // lesson 2.4: a known-common password must be changed
  const token = newToken('lfid_ses');
  await q('INSERT INTO sessions (digest, user_id) VALUES ($1, $2)', [tokenDigest(token), user.id]); // hole 4
  res.json({ session: token, mustChangePassword: user.mustChangePassword || common }); // hole 5
}); // hole 6

app.get('/me', async (req, res) => {
  const r = await q(\`SELECT u.id, u.email, u.name, u.role FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.digest = $1\`, [tokenDigest(req.get('x-session') ?? '')]);
  if (!r.rows[0]) return res.status(401).json({ error: 'Not signed in' });
  res.json(r.rows[0]);
});

// Errors answer with a code, never a stack trace (and never the body that caused them).
app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? 'INTERNAL' }));

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(\`LabFlow ID v0.2 on http://localhost:\${port}\`));`,
  seed: `// scripts/seed.mjs — Chapter 2: An, Binh and Co Lan are EXISTING accounts, imported straight into PostgreSQL
// (the new password policy applies to new passwords; Binh's "123456" gets flagged at her next sign-in — lesson 2.4).
import { pool } from '../src/db.js';
import { hashPassword } from '../src/passwords/index.js';

const USERS = [
  ['usr_1', 'an@student.labflow.example', 'Nguyen Van An', 'STUDENT', 'an-lab-2026'],
  ['usr_2', 'binh@student.labflow.example', 'Tran Thi Binh', 'STUDENT', '123456'],
  ['usr_3', 'lan@labflow.example', 'Co Lan', 'LAB_MANAGER', 'lan-lab-2026'],
];
for (const [id, email, name, role, password] of USERS) {
  await pool.query(\`INSERT INTO users (id, email, name, role, password_hash) VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash\`, [id, email, name, role, await hashPassword(password)]);
  console.log('seeded', id, email, role);
}
await pool.query(\`SELECT setval('user_seq', 3)\`);
await pool.end();`,
  hash: `// src/passwords/hash.js — lessons 2.2, 2.3, 2.5 and Lab 2: store a password as a slow, salted, self-describing hash.
import { createHash } from 'node:crypto';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

// Chosen by \`node demo2/tune.mjs 100 256\` on the machine that runs LabFlow ID (lesson 2.2): ≤ 100 ms, ≤ 64 MiB per thread.
export const PARAMS = { type: argon2.argon2id, memoryCost: 65536, timeCost: 2, parallelism: 1 };

/** NIST SP 800-63B-4: normalise Unicode to NFC before hashing, so "ì" typed on any keyboard is the same bytes. */
export const normalize = (password) => password.normalize('NFC');

export const hashPassword = (password) => argon2.hash(normalize(password), PARAMS);

/** What a stored string says about itself: scheme + parameters (lesson 2.2). The argon2 package writes "m=…,p=…,t=…" —
 *  read the parameters by NAME, never by position. */
export function describe(stored) {
  let m;
  if ((m = /^\\$(argon2id|md5-argon2id)\\$v=19\\$([^$]+)\\$/.exec(stored ?? ''))) {
    const p = Object.fromEntries(m[2].split(',').map((kv) => kv.split('=')).map(([k, v]) => [k, Number(v)]));
    return { scheme: m[1], m: p.m, t: p.t, p: p.p };
  }
  if ((m = /^\\$2[aby]\\$(\\d\\d)\\$/.exec(stored ?? ''))) return { scheme: 'bcrypt', cost: Number(m[1]) };
  return { scheme: 'unknown' };
}

/** True when the stored hash is not today's scheme with today's parameters (lesson 2.5). */
export function needsRehash(stored) {
  const d = describe(stored);
  return !(d.scheme === 'argon2id' && d.m >= PARAMS.memoryCost && d.t >= PARAMS.timeCost && d.p >= PARAMS.parallelism);
}

const md5 = (s) => createHash('md5').update(s).digest('hex');

/** ⇒ { ok, rehash }. Understands today's argon2id, older argon2id parameters, bcrypt, and wrapped legacy MD5. */
export async function verifyPassword(stored, password) {
  if (typeof stored !== 'string' || typeof password !== 'string') return { ok: false, rehash: false };
  const d = describe(stored);
  let ok = false;
  if (d.scheme === 'argon2id') ok = await argon2.verify(stored, normalize(password));
  else if (d.scheme === 'bcrypt') ok = await bcrypt.compare(normalize(password), stored);
  else if (d.scheme === 'md5-argon2id') {
    // lesson 2.5: md5(password) from the old system, wrapped in argon2id the day we migrated. The old system hashed raw input.
    ok = await argon2.verify(stored.replace('$md5-argon2id$', '$argon2id$'), md5(password));
  }
  return { ok, rehash: ok && needsRehash(stored) };
}

/** lesson 2.5: wrap an unsalted legacy MD5 hex digest without knowing the password. */
export async function wrapLegacyMd5(md5hex) {
  return (await argon2.hash(md5hex, PARAMS)).replace('$argon2id$', '$md5-argon2id$');
}`,
  policy: `// src/passwords/policy.js — lesson 2.4: the password rules NIST SP 800-63B-4 asks for, and nothing else.
import fs from 'node:fs';

export const MIN_LENGTH = 15;   // passwords are LabFlow ID's only factor (until Chapter 7) ⇒ NIST: at least 15
export const MAX_LENGTH = 128;  // NIST: allow at least 64; the cap keeps hashing cost bounded (lesson 2.3)

/** The blocklist: the 10,001 most common passwords (SecLists), compared as WHOLE passwords, case-insensitive. */
export function loadBlocklist(file = 'wordlists/10k-most-common.txt') {
  return new Set(fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\\n').filter(Boolean).map((w) => w.toLowerCase()) : []);
}

/** Problems with a NEW password (sign-up, change, reset). Empty array = accepted. Length counts code points (NFC). */
export function checkNewPassword(password, { email = '', blocklist = new Set() } = {}) {
  if (typeof password !== 'string') return ['NOT_A_STRING'];
  const pw = password.normalize('NFC');
  const length = [...pw].length;
  const problems = [];
  if (length < MIN_LENGTH) problems.push('TOO_SHORT');
  if (length > MAX_LENGTH) problems.push('TOO_LONG');
  if (blocklist.has(pw.toLowerCase())) problems.push('COMMON');
  // context words and their obvious derivatives: the service name, the email's local part
  const core = pw.toLowerCase().replace(/[^\\p{L}]/gu, '');
  const context = ['labflow', 'labflowid', email.split('@')[0].toLowerCase().replace(/[^\\p{L}]/gu, '')].filter((w) => w.length >= 3);
  if (context.includes(core)) problems.push('CONTEXT_WORD');
  return problems;
}`,
  pwned: `// src/passwords/pwned.js — lesson 2.4: has this password appeared in a breach? HIBP Pwned Passwords, k-anonymity:
// only the first 5 hex characters of its SHA-1 leave the server. ⇒ a count (0 = not seen), or null when we could not ask.
import { createHash } from 'node:crypto';

export async function pwnedCount(password, { base = 'https://api.pwnedpasswords.com', timeoutMs = 1500 } = {}) {
  const sha1 = createHash('sha1').update(password.normalize('NFC')).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5), suffix = sha1.slice(5);
  try {
    const res = await fetch(\`\${base}/range/\${prefix}\`, {
      headers: { 'Add-Padding': 'true', 'User-Agent': 'labflow-id-course' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    for (const line of (await res.text()).split('\\n')) {
      const [s, n] = line.trim().split(':');
      if (s === suffix) return Number(n);   // padding lines have count 0
    }
    return 0;
  } catch {
    return null;                            // fail OPEN: the service being down must not block sign-ups (say so in logs)
  }
}`,
  signin: `// src/passwords/signin.js — lesson 2.3: one sign-in flow whose branches look the same from outside.
//   same answer for "no such email" and "wrong password" · same work (a dummy hash) · rehash on success (lesson 2.5)
import { randomBytes } from 'node:crypto';
import { hashPassword, verifyPassword } from './hash.js';
import { MAX_LENGTH } from './policy.js';

// Hashed once at startup with today's parameters, so "no such user" costs exactly one real verify.
const DUMMY = await hashPassword(randomBytes(16).toString('base64url'));

/** store = { findByEmail(email) ⇒ { id, passwordHash, … } | null, updateHash(id, hash) }. ⇒ { user } | { error } */
export async function signIn(store, email, password) {
  if (typeof email !== 'string' || typeof password !== 'string' || [...password].length > MAX_LENGTH) {
    return { error: 'INVALID_CREDENTIALS' };            // the length is the attacker's own input: no secret leaks here
  }
  const user = await store.findByEmail(email.trim().toLowerCase());
  const { ok, rehash } = await verifyPassword(user?.passwordHash ?? DUMMY, password);
  if (!user || !ok) return { error: 'INVALID_CREDENTIALS' };
  if (rehash) await store.updateHash(user.id, await hashPassword(password));
  return { user };
}`,
  population: `// demo2/population.mjs — lessons 2.1 and 2.5: 1,000 made-up LabFlow accounts plus An, Binh and Co Lan.
// Passwords follow a rough real-world shape: 30% from the top 100, 40% from the rest of the top 10,000, 30% strong.
import fs from 'node:fs';
import { randomBytes } from 'node:crypto';

export const WORDS = fs.readFileSync('wordlists/10k-most-common.txt', 'utf8').split('\\n').filter(Boolean);

export function population() {
  const people = [
    { id: 'usr_1', email: 'an@student.labflow.example', password: 'an-lab-2026' },
    { id: 'usr_2', email: 'binh@student.labflow.example', password: '123456' },
    { id: 'usr_3', email: 'lan@labflow.example', password: 'lan-lab-2026' },
  ];
  for (let i = 4; i <= 1003; i++) {
    const k = i % 10;
    const password = k < 3 ? WORDS[i % 100]
      : k < 7 ? WORDS[100 + ((i * 37) % 9900)]
      : randomBytes(9).toString('base64url');                // 12 random characters
    people.push({ id: \`usr_\${i}\`, email: \`sv\${i}@student.labflow.example\`, password });
  }
  return people;
}`,
  naiveCopy: `// demo2/naive-copy.mjs — lesson 2.1: the migration a hurried team writes: users go to PostgreSQL exactly as they were in v0.1.
import { pool } from '../src/db.js';
import { population } from './population.mjs';

await pool.query('DROP TABLE IF EXISTS naive_users');
await pool.query('CREATE TABLE naive_users (id text PRIMARY KEY, email text, password text)');
for (const p of population()) await pool.query('INSERT INTO naive_users VALUES ($1, $2, $3)', [p.id, p.email, p.password]);
console.log('copied', (await pool.query('SELECT count(*) FROM naive_users')).rows[0].count, 'users');
await pool.end();`,
  dump: `// demo2/dump.mjs — what an attacker sees after one SQL injection or one leaked backup: the table, row by row.
import { pool } from '../src/db.js';
const table = process.argv[2] ?? 'users';
const cols = process.argv[3] ?? 'id, email, password_hash';
const { rows } = await pool.query(\`SELECT \${cols} FROM \${table} ORDER BY length(id), id LIMIT \${Number(process.argv[4] ?? 5)}\`);
for (const r of rows) console.log(Object.values(r).join(' | '));
await pool.end();`,
  crack: `// demo2/crack.mjs — lesson 2.1: the attacker already HAS the users table. Four ways it could have been stored,
// one attacker with the 10,001 most common passwords. Same people, same list — only the storage changes.
import { createHash, randomBytes } from 'node:crypto';
import argon2 from 'argon2';
import { population, WORDS } from './population.mjs';

const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const people = population();
const ms = (t0) => (performance.now() - t0).toFixed(0).padStart(6) + ' ms';
console.log(\`\${people.length} accounts · attacker list: \${WORDS.length} passwords\`);

// 1. plain text: nothing to crack
console.log(\`plain        read all \${people.length} passwords: no work at all\`);

// 2. SHA-256, no salt: hash the list ONCE, then every account is a lookup
let t0 = performance.now();
const table = new Map(WORDS.map((w) => [sha256(w), w]));
const unsalted = people.map((p) => sha256(p.password));
const hit2 = unsalted.filter((h) => table.has(h)).length;
const same = unsalted.filter((h, i) => unsalted.indexOf(h) !== i).length;
console.log(\`sha256       \${WORDS.length} hashes\${ms(t0)} → cracked \${hit2}/\${people.length} (and \${same} rows repeat another row's hash)\`);

// 3. SHA-256 with a 16-byte salt per account: the list must be hashed again for EVERY account
t0 = performance.now();
let hit3 = 0, n3 = 0;
for (const p of people) {
  const salt = randomBytes(16).toString('hex');
  const stored = sha256(salt + p.password);
  for (const w of WORDS) { n3++; if (sha256(salt + w) === stored) { hit3++; break; } }
}
console.log(\`sha256+salt  \${n3} hashes\${ms(t0)} → cracked \${hit3}/\${people.length}\`);

// 4. argon2id (LabFlow ID v0.2 parameters): measure the rate on 40 guesses, then try the list on Binh only
const P = { type: argon2.argon2id, memoryCost: 65536, timeCost: 2, parallelism: 1 };
const binh = await argon2.hash('123456', P);
t0 = performance.now();
let guesses = 0, found = null;
for (const w of WORDS) { guesses++; if (await argon2.verify(binh, w)) { found = w; break; } }
console.log(\`argon2id     Binh: "\${found}" after \${guesses} guesses\${ms(t0)}\`);
t0 = performance.now();
await Promise.all(WORDS.slice(0, 40).map((w) => argon2.verify(binh, w + '!')));
const perSec = 40 / ((performance.now() - t0) / 1000);
const hours = (WORDS.length * people.length) / perSec / 3600;
console.log(\`argon2id     \${perSec.toFixed(1)} guesses/s with \${process.env.UV_THREADPOOL_SIZE ?? 4} threads → whole list × \${people.length} accounts ≈ \${hours.toFixed(0)} h\`);`,
  crackTable: `// demo2/crack-table.mjs — lesson 2.1: how long to try EVERY password of a kind, for one salted account.
// CPU rates are measured here; GPU rates are hashcat 6.2.6 on one RTX 4090 (public benchmark, see the lesson's sources).
import { createHash } from 'node:crypto';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import { fmt as fmt1 } from '../demo1/fmt.mjs';
const YEAR = 365.25 * 24 * 3600;
const fmt = (s) => (s >= YEAR && s < 1000 * YEAR ? \`\${(s / YEAR).toFixed(0)} years\` : fmt1(s));

const words = ['password', '123456', 'an-lab-2026', 'qwerty'].map((w) => '9f2c4e7a1b3d5f60' + w); // salt + guess
let n = 0; const end = performance.now() + 1000;
while (performance.now() < end) for (let i = 0; i < 1000; i++, n++) createHash('sha256').update(words[n & 3]).digest('hex');
const shaCpu = n;                                                  // per second, one core

const P = { type: argon2.argon2id, memoryCost: 65536, timeCost: 2, parallelism: 1 };
const h = await argon2.hash('x', P);
let t0 = performance.now();
await Promise.all(Array.from({ length: 40 }, (_, i) => argon2.verify(h, 'g' + i)));
const argonCpu = 40 / ((performance.now() - t0) / 1000);
const b = await bcrypt.hash('x', 12);
t0 = performance.now();
await Promise.all(Array.from({ length: 20 }, (_, i) => bcrypt.compare('g' + i, b)));
const bcryptCpu = 20 / ((performance.now() - t0) / 1000);

const RATES = [
  ['sha256 · 1 CPU core', shaCpu],
  ['sha256 · RTX 4090', 21975.5e6],
  ['bcrypt-12 · RTX 4090', 184.0e3 / 2 ** 7],                 // benchmark is cost 5 (32 rounds); cost 12 = 4,096 rounds
  ['bcrypt-12 · this Mac', bcryptCpu],
  ['argon2id · this Mac', argonCpu],                          // m=64 MiB, t=2, p=1 — LabFlow ID v0.2
];
const SPACES = [['top-10k', 10001], ['8 a-z', 26 ** 8], ['4 words', 7776 ** 4], ['12 a-zA-Z0-9', 62 ** 12]];
console.log('guesses/s'.padEnd(36) + SPACES.map(([k]) => k.padEnd(15)).join(''));
for (const [name, rate] of RATES) {
  console.log(\`\${name.padEnd(21)}\${(rate >= 1e5 ? rate.toExponential(2) : rate.toFixed(rate < 100 ? 1 : 0)).padStart(13)}  \` + SPACES.map(([, g]) => fmt(g / rate).padEnd(15)).join(''));
}
console.log(\`(\${process.env.UV_THREADPOOL_SIZE ?? 4} threads; time to try the WHOLE space for ONE salted account)\`);`,
  tune: `// demo2/tune.mjs — lesson 2.2: choose argon2id parameters by MEASURING on the machine that will run them.
// Rule: two budgets — time per hash (one login = one hash) and RAM for hashing shared by the threads that hash at once
// (libuv's thread pool: UV_THREADPOOL_SIZE, default 4). Then the most memory, then the most passes, that fit both.
import argon2 from 'argon2';

const BUDGET_MS = Number(process.argv[2] ?? 100);
const RAM_MIB = Number(process.argv[3] ?? 256);
const THREADS = Number(process.env.UV_THREADPOOL_SIZE ?? 4);
const MAX_KIB = (RAM_MIB / THREADS) * 1024;          // memory one hash may use when every thread hashes at once
const MEMORY_KIB = [19456, 47104, 65536, 131072];      // 19 MiB (OWASP minimum) … 128 MiB
const PASSES = [1, 2, 3, 4];
const median = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];

async function timeOne(m, t) {
  const runs = [];
  for (let i = 0; i < 7; i++) {
    const t0 = performance.now();
    await argon2.hash('an-lab-2026', { type: argon2.argon2id, memoryCost: m, timeCost: t, parallelism: 1 });
    runs.push(performance.now() - t0);
  }
  return median(runs);
}

console.log(\`budgets: \${BUDGET_MS} ms per hash, \${RAM_MIB} MiB for \${THREADS} hashing threads ⇒ ≤ \${MAX_KIB / 1024} MiB each\`);
console.log(\`argon2id p=1 · median of 7 · Node \${process.version} \${process.arch}\`);
console.log('memory     t=1      t=2      t=3      t=4');
let best = null;
for (const m of MEMORY_KIB) {
  const cells = [];
  for (const t of PASSES) {
    const ms = await timeOne(m, t);
    const fits = ms <= BUDGET_MS && m <= MAX_KIB;
    cells.push(ms.toFixed(1).padStart(6) + (ms > BUDGET_MS ? '*' : m > MAX_KIB ? '#' : ' '));
    if (fits && (!best || m > best.m || (m === best.m && t > best.t))) best = { m, t, ms };
  }
  console.log(\`\${String(m / 1024).padStart(4)} MiB \${cells.join('  ')}\`);
}
console.log('* = too slow   # = too much memory for the thread pool');
console.log(best ? \`choose m=\${best.m} (\${best.m / 1024} MiB), t=\${best.t}, p=1 → \${best.ms.toFixed(1)} ms\` : 'nothing fits: raise the budget or buy CPU');`,
  load: `// demo2/load.mjs — lesson 2.2: what one argon2id setting does when MANY people sign in at the same moment.
//   node demo2/load.mjs <concurrent logins> <parallelism p>      (UV_THREADPOOL_SIZE = threads that hash at once)
import argon2 from 'argon2';

const N = Number(process.argv[2] ?? 40), p = Number(process.argv[3] ?? 1);
const P = { type: argon2.argon2id, memoryCost: 65536, timeCost: 2, parallelism: p };
const stored = await argon2.hash('an-lab-2026', P);
const base = process.memoryUsage().rss;
let peak = base;
const sampler = setInterval(() => { peak = Math.max(peak, process.memoryUsage().rss); }, 5);

const t0 = performance.now();
const lat = await Promise.all(Array.from({ length: N }, async () => {
  await argon2.verify(stored, 'an-lab-2026');
  return performance.now() - t0;                 // how long THIS user waited, from the moment everyone pressed "Sign in"
}));
clearInterval(sampler);
lat.sort((a, b) => a - b);
const f = (x) => x.toFixed(0).padStart(5) + ' ms';
console.log(\`\${N} logins · p=\${p} · threads=\${process.env.UV_THREADPOOL_SIZE ?? 4} | p50 \${f(lat[N >> 1])} | p95 \${f(lat[Math.floor(N * 0.95)])} | last \${f(lat[N - 1])} | RSS +\${((peak - base) / 2 ** 20).toFixed(0)} MiB\`);`,
  format: `// demo2/format.mjs — lesson 2.2: a password hash is a self-describing string. Read it by name, not by position.
import argon2 from 'argon2';
import { hashPassword, describe, needsRehash } from '../src/passwords/index.js';

const stored = await hashPassword('an-lab-2026');
console.log(stored);
const [, id, v, params, salt, hash] = stored.split('$');
console.log(JSON.stringify({ id, v, params, saltBytes: Buffer.from(salt, 'base64').length, hashBytes: Buffer.from(hash, 'base64').length }));

// The bug: a regex that assumes the order m, t, p (the order most blog posts print).
const naive = /m=(\\d+),t=(\\d+),p=(\\d+)/.exec(stored);
console.log('naive parse:', naive, '⇒ needsRehash would be true on EVERY login');
console.log('by name    :', describe(stored), '⇒ needsRehash', needsRehash(stored));
console.log('argon2.needsRehash(stored, {memoryCost: 65536, timeCost: 3}) =', argon2.needsRehash(stored, { memoryCost: 65536, timeCost: 3 }));`,
  scrypt: `// demo2/scrypt-maxmem.mjs — lesson 2.2: scrypt is built into node:crypto, but OWASP's parameters do not run by default.
import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);
const salt = randomBytes(16);
const N = 2 ** 17, r = 8, p = 1;                 // OWASP minimum: 128 × N × r bytes = 128 MiB
for (const opts of [{ N, r, p }, { N, r, p, maxmem: 129 * 2 ** 20 }]) {
  const t0 = performance.now();
  try {
    const key = await scryptAsync('an-lab-2026', salt, 32, opts);
    console.log(\`maxmem \${opts.maxmem ?? 'default (32 MiB)'}: ok in \${(performance.now() - t0).toFixed(0)} ms, \${key.toString('base64').slice(0, 16)}…\`);
  } catch (e) {
    console.log(\`maxmem \${opts.maxmem ?? 'default (32 MiB)'}: \${e.code} — \${e.message}\`);
  }
}`,
  bcrypt72: `// demo2/bcrypt-72.mjs — lesson 2.2: bcrypt reads only the first 72 BYTES. Vietnamese letters take 2–3 bytes each in UTF-8.
import bcrypt from 'bcrypt';
const base = 'Mật khẩu của tôi là câu thơ dài: Trăm năm trong cõi người ta, chữ tài';   // 69 characters
console.log(\`\${[...base].length} characters = \${Buffer.byteLength(base)} bytes\`);
const stored = await bcrypt.hash(base + ' chữ mệnh khéo là ghét nhau', 10);
console.log('verify with a different ending:', await bcrypt.compare(base + ' — anything at all', stored));`,
  signinNaive: `// demo2/signin-naive.js — lesson 2.3: the sign-in most tutorials write. Same message for both failures… and an early return.
import express from 'express';
import { users } from '../src/users.js';
import { verifyPassword } from '../src/passwords/index.js';

const app = express();
app.use(express.json());
app.post('/sign-in', async (req, res) => {
  const user = await users.findByEmail(String(req.body.email).toLowerCase());
  if (!user) return res.status(401).json({ error: 'Email or password is incorrect' });   // no hash computed
  const { ok } = await verifyPassword(user.passwordHash, req.body.password);
  if (!ok) return res.status(401).json({ error: 'Email or password is incorrect' });
  res.json({ ok: true });
});
app.listen(4802, () => console.log('demo2/signin-naive.js on http://localhost:4802'));`,
  timingSignin: `// demo2/timing-signin.mjs — lesson 2.3: does the sign-in endpoint tell an outsider which emails have accounts?
// 60 requests per case, alternating, through HTTP. Same 401 body every time — only the clock differs.
const port = process.argv[2] ?? '4800';
const CASES = { 'no such email ': 'nobody@student.labflow.example', 'An, wrong pw  ': 'an@student.labflow.example' };
const times = Object.fromEntries(Object.keys(CASES).map((k) => [k, []]));
let body;
for (let i = 0; i < 60; i++) {
  for (const [k, email] of Object.entries(CASES)) {
    const t0 = performance.now();
    const res = await fetch(\`http://localhost:\${port}/sign-in\`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'wrong-password-1' }),
    });
    body = \`\${res.status} \${await res.text()}\`;
    times[k].push(performance.now() - t0);
  }
}
const med = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];
console.log(\`port \${port} · every response: \${body}\`);
for (const [k, xs] of Object.entries(times)) console.log(\`\${k} median \${med(xs).toFixed(1).padStart(6)} ms\`);
const [a, b] = Object.values(times).map(med);
console.log(\`ratio \${(Math.max(a, b) / Math.min(a, b)).toFixed(1)}×\`);`,
  unicode: `// demo2/unicode.mjs — lesson 2.3: the same password, typed with two Vietnamese keyboard settings, is two byte strings.
// Unikey/EVKey "Unicode dựng sẵn" = precomposed (NFC); "Unicode tổ hợp" = base letter + combining mark (NFD).
import argon2 from 'argon2';
import { PARAMS, normalize } from '../src/passwords/index.js';

const precomposed = 'Bình-thích-hoa-sen-2026'.normalize('NFC');   // "ì" = U+00EC
const decomposed = 'Bình-thích-hoa-sen-2026'.normalize('NFD');    // "ì" = "i" + U+0300
console.log('look the same:', precomposed, '|', decomposed);
console.log('equal strings:', precomposed === decomposed, '· bytes', Buffer.byteLength(precomposed), 'vs', Buffer.byteLength(decomposed));
const raw = await argon2.hash(precomposed, PARAMS);
console.log('no normalisation  → verify the "tổ hợp" typing:', await argon2.verify(raw, decomposed));
const good = await argon2.hash(normalize(precomposed), PARAMS);
console.log('NFC on both sides → verify the "tổ hợp" typing:', await argon2.verify(good, normalize(decomposed)));`,
  pepper: `// demo2/pepper.mjs — lesson 2.3: a pepper is a secret key, kept OUT of the database, mixed in before the slow hash.
// It helps exactly when the attacker has the table but not the key — and it locks everyone out if you lose the key.
import { createHmac } from 'node:crypto';
import argon2 from 'argon2';
import { PARAMS } from '../src/passwords/index.js';
import { WORDS } from './population.mjs';

const PEPPER = Buffer.from(process.env.PASSWORD_PEPPER ?? '', 'base64url');     // 32 bytes, from the environment
const peppered = (pw) => createHmac('sha256', PEPPER).update(pw.normalize('NFC')).digest('base64');
const binhRow = await argon2.hash(peppered('123456'), PARAMS);                  // what the users table holds

async function attack(label, prepare) {
  const t0 = performance.now();
  for (const w of WORDS.slice(0, 20)) if (await argon2.verify(binhRow, prepare(w))) {
    return console.log(\`\${label}: cracked "\${w}" in \${(performance.now() - t0).toFixed(0)} ms\`);
  }
  console.log(\`\${label}: 0 of the top 20 match — without the key every guess is wrong\`);
}
await attack('table only (SQL injection, stolen backup)', (w) => w);
await attack('table + PASSWORD_PEPPER (whole server taken)', peppered);
const lost = Buffer.alloc(32, 7);                                              // the key after a bad redeploy
console.log('Binh signs in after the key is lost:', await argon2.verify(binhRow, createHmac('sha256', lost).update('123456').digest('base64')));`,
  longPw: `// demo2/long-password.mjs — lesson 2.3: how much does a LONG password cost the server? (argon2 pre-hashes its input)
import argon2 from 'argon2';
import { PARAMS } from '../src/passwords/index.js';
for (const n of [16, 128, 1e5, 1e6, 1e7]) {
  const pw = 'a'.repeat(n);
  const t0 = performance.now();
  await argon2.hash(pw, PARAMS);
  console.log(\`\${String(n).padStart(9)} chars → \${(performance.now() - t0).toFixed(0).padStart(4)} ms\`);
}`,
  signInTries: `# demo2/sign-in-tries.sh — lessons 2.3 and 2.4: existing accounts sign in to v0.2 (server on :4800).
si() { curl -s -w ' %{http_code}\\n' localhost:4800/sign-in -H 'content-type: application/json' -d "$1" | sed -E 's/(lfid_ses_.{8})[^"]*/\\1…/'; }
si '{"email":"an@student.labflow.example","password":"an-lab-2026"}'
si '{"email":"binh@student.labflow.example","password":"123456"}'
si '{"email":"An@Student.LabFlow.example ","password":"an-lab-2026"}'
si '{"email":"an@student.labflow.example","password":"wrong-password-1"}'
si '{"email":"nobody@student.labflow.example","password":"wrong-password-1"}'
head -c 20000 /dev/zero | tr '\\0' 'a' | (printf '{"email":"an@student.labflow.example","password":"'; cat; printf '"}') \\
  | curl -s -o /dev/null -w 'a 20 kB password → %{http_code}\\n' localhost:4800/sign-in -H 'content-type: application/json' --data-binary @-`,
  signUpTries: `# demo2/sign-up-tries.sh — lesson 2.4: four new passwords against LabFlow ID v0.2's policy (server on :4800).
for pw in '123456' 'LabFlow2026!!!!!' 'iloveyouiloveyou' 'hoa sen nở giữa đầm lầy tháng năm'; do
  curl -s -w ' %{http_code}' localhost:4800/sign-up -H 'content-type: application/json' \\
    -d "{\\"email\\":\\"sv$RANDOM@student.labflow.example\\",\\"name\\":\\"SV\\",\\"password\\":\\"$pw\\"}"
  echo "  ← \\"$pw\\""
done`,
  composition: `// demo2/composition.mjs — lesson 2.4: do the classic rules ("8+, upper, lower, digit, symbol") keep common passwords out?
import { WORDS } from './population.mjs';

const classic = (pw) => pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
const pass = WORDS.filter(classic);
console.log(\`top-10k passwords that pass the classic rules: \${pass.length} → \${pass.slice(0, 6).join(', ')}\`);
console.log(\`top-10k passwords with 15+ characters: \${WORDS.filter((w) => [...w].length >= 15).length}\`);
// What people do when forced: capitalise the first letter, add "1!" at the end.
const forced = WORDS.slice(0, 1000).map((w) => w[0].toUpperCase() + w.slice(1) + '1!').filter(classic);
console.log(\`top-1000 "Capitalised + 1!": \${forced.length} now pass, e.g. \${forced.slice(0, 4).join(', ')}\`);`,
  hibp: `// demo2/hibp.mjs — lesson 2.4: ask Have I Been Pwned whether a password has leaked — sending 5 hex characters only.
import { createHash } from 'node:crypto';
import { pwnedCount } from '../src/passwords/index.js';

const pw = process.argv[2];
const sha1 = createHash('sha1').update(pw).digest('hex').toUpperCase();
const res = await fetch(\`https://api.pwnedpasswords.com/range/\${sha1.slice(0, 5)}\`, { headers: { 'Add-Padding': 'true' } });
const lines = (await res.text()).trim().split('\\n');
console.log(\`SHA-1 \${sha1.slice(0, 5)}|\${sha1.slice(5, 12)}… → sent "\${sha1.slice(0, 5)}", got \${lines.length} suffixes (\${lines.filter((l) => l.endsWith(':0')).length} padding)\`);
console.log(\`pwnedCount("\${pw}") =\`, await pwnedCount(pw));`,
  hibpDown: `// demo2/hibp-down.mjs — lesson 2.4: what if the breach service hangs? A server on :4801 that accepts and never answers.
import http from 'node:http';
import { pwnedCount } from '../src/passwords/index.js';
const silent = http.createServer(() => {}).listen(4801);
const t0 = performance.now();
const n = await pwnedCount('iloveyouiloveyou', { base: 'http://127.0.0.1:4801', timeoutMs: 1500 });
console.log(\`pwnedCount → \${n} after \${(performance.now() - t0).toFixed(0)} ms (null = "could not ask": fail open, log it)\`);
silent.close(); process.exit(0);`,
  legacy: `// demo2/legacy.mjs — lesson 2.5: LabFlow's old booking system (2019) kept md5(password), no salt. Move 1,003 accounts
// to argon2id TODAY without knowing a single password: wrap every row, then unwrap each one at its owner's next sign-in.
import { createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import { pool } from '../src/db.js';
import { population, WORDS } from './population.mjs';
import { wrapLegacyMd5, verifyPassword, hashPassword, describe } from '../src/passwords/index.js';

const md5 = (s) => createHash('md5').update(s).digest('hex');
const people = population();
await pool.query('DROP TABLE IF EXISTS legacy_users');
await pool.query('CREATE TABLE legacy_users (id text PRIMARY KEY, email text, pass_md5 text, password_hash text)');
for (const p of people) await pool.query('INSERT INTO legacy_users (id, email, pass_md5) VALUES ($1, $2, $3)', [p.id, p.email, md5(p.password)]);

const count = async () => (await pool.query(\`SELECT count(*) FILTER (WHERE pass_md5 IS NOT NULL) AS md5_left,
  count(*) FILTER (WHERE password_hash LIKE '$md5-argon2id$%') AS wrapped, count(*) FILTER (WHERE password_hash LIKE '$argon2id$%') AS argon2id
  FROM legacy_users\`)).rows[0];
const table = new Map(WORDS.map((w) => [md5(w), w]));
let t0 = performance.now();
const rows = (await pool.query('SELECT id, pass_md5 FROM legacy_users')).rows;
console.log(\`before: \${JSON.stringify(await count())} · the 10k list cracks \${rows.filter((r) => table.has(r.pass_md5)).length} rows in \${(performance.now() - t0).toFixed(0)} ms\`);

// Step 1 — wrap every row now, and DROP the old value in the same UPDATE (Ashley Madison kept a second MD5 column: 11 M cracked)
t0 = performance.now();
await Promise.all(rows.map(async (r) => {
  await pool.query('UPDATE legacy_users SET password_hash = $2, pass_md5 = NULL WHERE id = $1', [r.id, await wrapLegacyMd5(r.pass_md5)]);
}));
console.log(\`wrapped \${rows.length} rows in \${((performance.now() - t0) / 1000).toFixed(1)} s (\${process.env.UV_THREADPOOL_SIZE ?? 4} threads) · \${JSON.stringify(await count())}\`);

// Step 2 — An signs in: the wrapped hash verifies, asks for a rehash, and becomes a plain argon2id hash
const an = (await pool.query(\`SELECT password_hash FROM legacy_users WHERE id = 'usr_1'\`)).rows[0].password_hash;
const r = await verifyPassword(an, 'an-lab-2026');
console.log(\`An signs in: \${JSON.stringify(r)} · stored was \${describe(an).scheme}\`);
if (r.rehash) await pool.query(\`UPDATE legacy_users SET password_hash = $1 WHERE id = 'usr_1'\`, [await hashPassword('an-lab-2026')]);
console.log(\`after An: \${JSON.stringify(await count())}\`);

// The other two shapes: a modern algorithm with old parameters, and another algorithm
for (const [label, stored] of [
  ['bcrypt cost 10 (2022 accounts)', await bcrypt.hash('lan-lab-2026', 10)],
  ['argon2id m=19 MiB t=2 (v0.2-beta)', await argon2.hash('lan-lab-2026', { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 })],
]) console.log(\`\${label.padEnd(34)} → \${JSON.stringify(await verifyPassword(stored, 'lan-lab-2026'))}\`);
await pool.end();`,
  grader: `// scripts/cham-lab-2.mjs — the grader of Lab 2 (LabFlow ID's password module). 9 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-2.mjs <folder with index.js>      e.g.  node scripts/cham-lab-2.mjs lab2/my
// It only CALLS your four functions with a fake in-memory user store (no database needed) and reads your source last.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

const dir = path.resolve(process.argv[2] ?? 'lab2/my');
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
const safely = async (fn) => { try { return { v: await fn() }; } catch (e) { return { e }; } };
const params = (s) => Object.fromEntries((/^\\$argon2id\\$v=19\\$([^$]+)\\$/.exec(s ?? '')?.[1] ?? '').split(',').map((kv) => kv.split('=')).map(([k, v]) => [k, Number(v)]));
const BLOCK = new Set(fs.existsSync('wordlists/10k-most-common.txt')
  ? fs.readFileSync('wordlists/10k-most-common.txt', 'utf8').split('\\n').filter(Boolean) : ['password', '123456', 'qwerty', 'iloveyou']);
const median = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];
const fakeStore = (rows) => {
  const updates = [];
  return { updates, rows,
    async findByEmail(email) { return rows.find((r) => r.email === email) ?? null; },
    async updateHash(id, h) { updates.push([id, h]); rows.find((r) => r.id === id).passwordHash = h; } };
};

// ── T1 format ──
await check('T1 argon2id, self-describing, OWASP minimum or above, salted', 1, async () => {
  const a = await m.hashPassword('an-lab-2026'), b = await m.hashPassword('an-lab-2026');
  expect(typeof a === 'string' && a.startsWith('$argon2id$v=19$'), \`expected a "$argon2id$v=19$…" string, got \${JSON.stringify(String(a).slice(0, 24))}…\`);
  const p = params(a);
  expect(p.m >= 19456 && p.t >= 2 || p.m >= 47104 && p.t >= 1, \`parameters m=\${p.m}, t=\${p.t} are below OWASP's minimum (m=19456 t=2, or m=47104 t=1)\`);
  expect(a !== b, 'the same password hashed twice gave the same string: no random salt');
});

// ── T2 the stolen table ──
await check('T2 a stolen row resists fast cracking (no plain/MD5/SHA, ≥ 10 ms per guess)', 1.5, async () => {
  const row = await m.hashPassword('123456');
  for (const alg of ['md5', 'sha1', 'sha256']) for (const enc of ['hex', 'base64']) {
    expect(!row.includes(createHash(alg).update('123456').digest(enc)), \`the row contains \${alg}("123456") — crackable at billions of guesses per second\`);
  }
  expect(!row.includes('123456'), 'the row contains the password itself');
  const times = [];
  for (const g of ['password', 'qwerty', '12345678', 'iloveyou', 'abc123']) {
    const t0 = performance.now(); await m.verifyPassword(row, g); times.push(performance.now() - t0);
  }
  expect(median(times) >= 10, \`one wrong guess costs \${median(times).toFixed(1)} ms — an attacker tries the 10k list in \${(median(times) * 10).toFixed(0)} ms per account\`);
});

// ── T3 verify ──
await check('T3 verifyPassword: right/wrong, never throws, Unicode NFC', 1, async () => {
  const s = await m.hashPassword('an-lab-2026');
  expect((await m.verifyPassword(s, 'an-lab-2026'))?.ok === true, 'the right password was rejected');
  for (const bad of ['an-lab-2027', '', 'AN-LAB-2026']) expect((await m.verifyPassword(s, bad))?.ok === false, \`\${JSON.stringify(bad)} was accepted\`);
  for (const [st, pw] of [[s, undefined], [s, 42], ['not-a-hash', 'x'], [undefined, 'x']]) {
    const r = await safely(() => m.verifyPassword(st, pw));
    expect(!r.e && r.v?.ok === false, \`verifyPassword(\${JSON.stringify(st)?.slice(0, 12)}, \${JSON.stringify(pw)}) should be { ok: false }, \${r.e ? 'it threw ' + r.e.name : 'got ' + JSON.stringify(r.v)}\`);
  }
  const vi = 'Bình-thích-hoa-sen-2026';
  const t = await m.hashPassword(vi.normalize('NFC'));
  expect((await m.verifyPassword(t, vi.normalize('NFD')))?.ok === true, 'the same Vietnamese password typed as "Unicode tổ hợp" (NFD) was rejected — normalise to NFC');
});

// ── T4 rehash ──
await check('T4 old shapes verify and ask for a rehash (old params, bcrypt, wrapped MD5)', 1.5, async () => {
  const cur = await m.hashPassword('lan-lab-2026');
  const r0 = await m.verifyPassword(cur, 'lan-lab-2026');
  expect(r0?.ok === true && r0.rehash === false, \`today's hash should give { ok: true, rehash: false }, got \${JSON.stringify(r0)}\`);
  const md5 = createHash('md5').update('lan-lab-2026').digest('hex');
  const shapes = [
    ['argon2id m=8 MiB t=1', await argon2.hash('lan-lab-2026', { type: argon2.argon2id, memoryCost: 8192, timeCost: 1, parallelism: 1 })],
    ['bcrypt cost 10', await bcrypt.hash('lan-lab-2026', 10)],
    ['md5 wrapped in argon2id', (await argon2.hash(md5, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 })).replace('$argon2id$', '$md5-argon2id$')],
  ];
  for (const [label, stored] of shapes) {
    const ok = await safely(() => m.verifyPassword(stored, 'lan-lab-2026'));
    expect(!ok.e && ok.v?.ok === true && ok.v.rehash === true, \`\${label}: expected { ok: true, rehash: true }, \${ok.e ? 'it threw ' + ok.e.name : 'got ' + JSON.stringify(ok.v)}\`);
    const bad = await safely(() => m.verifyPassword(stored, 'wrong-password-1'));
    expect(!bad.e && bad.v?.ok === false && !bad.v.rehash, \`\${label} + wrong password: expected { ok: false, rehash: false }\`);
  }
});

// ── T5 signIn upgrades ──
await check('T5 signIn upgrades an old hash on success, and only on success', 1, async () => {
  const store = fakeStore([{ id: 'usr_3', email: 'lan@labflow.example', passwordHash: await bcrypt.hash('lan-lab-2026', 10) }]);
  await m.signIn(store, 'lan@labflow.example', 'wrong-password-1');
  expect(store.updates.length === 0, 'a FAILED sign-in rewrote the stored hash');
  const ok = await m.signIn(store, 'lan@labflow.example', 'lan-lab-2026');
  expect(ok?.user?.id === 'usr_3', \`the right password should give { user }, got \${JSON.stringify(ok)?.slice(0, 80)}\`);
  expect(store.updates.length === 1 && store.updates[0][1].startsWith('$argon2id$'), 'the bcrypt hash was not replaced by an argon2id hash');
  const again = await m.signIn(store, 'lan@labflow.example', 'lan-lab-2026');
  expect(again?.user && store.updates.length === 1, 'the upgraded hash was rewritten again on the next sign-in');
});

// ── T6 timing ──
await check('T6 "no such email" and "wrong password" take the same time (ratio < 1.5×)', 1.5, async () => {
  const store = fakeStore([{ id: 'usr_1', email: 'an@student.labflow.example', passwordHash: await m.hashPassword('an-lab-2026') }]);
  const a = [], b = [];
  for (let i = 0; i < 15; i++) {
    let t0 = performance.now(); await m.signIn(store, \`nobody\${i}@student.labflow.example\`, 'wrong-password-' + i); a.push(performance.now() - t0);
    t0 = performance.now(); await m.signIn(store, 'an@student.labflow.example', 'wrong-password-' + i); b.push(performance.now() - t0);
  }
  const ra = median(a), rb = median(b), ratio = Math.max(ra, rb) / Math.max(Math.min(ra, rb), 0.001);
  expect(ratio < 1.5, \`no such email \${ra.toFixed(1)} ms vs wrong password \${rb.toFixed(1)} ms — \${ratio.toFixed(1)}×: the clock tells who has an account\`);
});

// ── T7 one answer ──
await check('T7 one answer for both failures; email matched trimmed + lower-case', 0.5, async () => {
  const store = fakeStore([{ id: 'usr_1', email: 'an@student.labflow.example', passwordHash: await m.hashPassword('an-lab-2026') }]);
  const x = await m.signIn(store, 'nobody@student.labflow.example', 'wrong-password-1');
  const y = await m.signIn(store, 'an@student.labflow.example', 'wrong-password-1');
  expect(!x?.user && !y?.user && JSON.stringify(x) === JSON.stringify(y), \`different answers: \${JSON.stringify(x)} vs \${JSON.stringify(y)}\`);
  expect((await m.signIn(store, ' An@Student.LabFlow.example ', 'an-lab-2026'))?.user?.id === 'usr_1', '" An@Student.LabFlow.example " should find An');
});

// ── T8 policy ──
await check('T8 checkNewPassword follows NIST 800-63B-4 (length, blocklist, context, no composition rules)', 1, async () => {
  const c = (pw, email = 'an@student.labflow.example') => m.checkNewPassword(pw, { email, blocklist: BLOCK });
  const rejected = [['123456', 'COMMON'], ['an-lab-2026', 'TOO_SHORT'], ['x'.repeat(129), 'TOO_LONG'], ['LabFlow2026!!!!!', 'CONTEXT_WORD']];
  for (const [pw, code] of rejected) {
    const r = c(pw);
    expect(Array.isArray(r) && r.includes(code), \`\${JSON.stringify(pw.slice(0, 20))} should include \${code}, got \${JSON.stringify(r)}\`);
  }
  for (const pw of ['tram nam trong coi nguoi ta', 'correct horse battery staple', 'ờ'.repeat(15).normalize('NFD')]) {
    const r = c(pw);
    expect(Array.isArray(r) && r.length === 0, \`\${JSON.stringify(pw.slice(0, 20))} is long and uncommon — it should be accepted (no composition rules), got \${JSON.stringify(r)}\`);
  }
});

// ── T9 source ──
await check('T9 source: no blocking *Sync hashing, no Math.random, no password in a log line', 1, async () => {
  expect(typeof (await m.hashPassword('x-x-x-x-x-x-x-x')) === 'string', 'hashPassword is not written yet — the source checks start counting once it works');
  const src = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\\n');
  expect(!/\\b(hashSync|compareSync|verifySync|scryptSync|pbkdf2Sync)\\b/.test(src), 'a *Sync hash call blocks the event loop for every user (nodejs 8.1: /health 2,784 ms)');
  expect(!/Math\\.random/.test(src), 'Math.random in a password module');
  expect(!/console\\.\\w+\\([^)\\n]*\\b(password|pw)\\b/i.test(src), 'a console call prints a password (lesson 1.5: logs are read by many people)');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 2 — \${path.relative(process.cwd(), file)}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(86)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  starter: `// lab2/starter/index.js — Lab 2: LabFlow ID's password module. Replace every TODO; keep the four exported names.
// Allowed: node:crypto (md5 for the legacy branch only), the argon2 and bcrypt packages. Grade: node scripts/cham-lab-2.mjs lab2/my
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

/** ⇒ a self-describing argon2id string ("$argon2id$v=19$m=…,t=…,p=…$salt$hash"), parameters you MEASURED (lesson 2.2). */
export async function hashPassword(password) {
  throw new Error('TODO hashPassword');
}

/** ⇒ { ok, rehash }. Today's argon2id, older argon2id parameters, bcrypt "$2b$…", and "$md5-argon2id$…" (lesson 2.5). Never throws. */
export async function verifyPassword(stored, password) {
  throw new Error('TODO verifyPassword');
}

/** ⇒ [] or a list of problems: TOO_SHORT (< 15), TOO_LONG (> 128), COMMON (whole password in blocklist), CONTEXT_WORD (lesson 2.4). */
export function checkNewPassword(password, { email = '', blocklist = new Set() } = {}) {
  throw new Error('TODO checkNewPassword');
}

/** store = { findByEmail(email), updateHash(id, hash) } ⇒ { user } or { error: 'INVALID_CREDENTIALS' } (lesson 2.3). */
export async function signIn(store, email, password) {
  throw new Error('TODO signIn');
}`,
  yeu: `// lab2/yeu/index.js — a FIRST ATTEMPT that "works": An can sign up and sign in, wrong passwords are refused.
import argon2 from 'argon2';

export async function hashPassword(password) {
  return argon2.hash(password);                           // the package defaults
}

export async function verifyPassword(stored, password) {
  return { ok: await argon2.verify(stored, password), rehash: false };
}

export function checkNewPassword(password) {
  const problems = [];                                    // the rules every sign-up form used to have
  if (password.length < 8) problems.push('TOO_SHORT');
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) problems.push('NEEDS_MIXED_CASE');
  if (!/\\d/.test(password)) problems.push('NEEDS_DIGIT');
  if (!/[^A-Za-z0-9]/.test(password)) problems.push('NEEDS_SYMBOL');
  return problems;
}

export async function signIn(store, email, password) {
  const user = await store.findByEmail(email);
  if (!user) return { error: 'NO_SUCH_ACCOUNT' };
  const { ok } = await verifyPassword(user.passwordHash, password);
  if (!ok) return { error: 'WRONG_PASSWORD' };
  return { user };
}`,
  test: `// test/passwords.test.js — Chapter 2: the password module, without a database (a fake store).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import { hashPassword, verifyPassword, describe, checkNewPassword, signIn, PARAMS } from '../src/passwords/index.js';

test('hash is argon2id with the measured parameters and a fresh salt', async () => {
  const a = await hashPassword('an-lab-2026'), b = await hashPassword('an-lab-2026');
  assert.deepEqual(describe(a), { scheme: 'argon2id', m: PARAMS.memoryCost, t: PARAMS.timeCost, p: PARAMS.parallelism });
  assert.notEqual(a, b);
});

test('NFC: precomposed and decomposed Vietnamese verify the same', async () => {
  const s = await hashPassword('Bình-thích-hoa-sen-2026'.normalize('NFC'));
  assert.equal((await verifyPassword(s, 'Bình-thích-hoa-sen-2026'.normalize('NFD'))).ok, true);
});

test('bcrypt verifies and asks for a rehash; a wrong password never does', async () => {
  const old = await bcrypt.hash('lan-lab-2026', 10);
  assert.deepEqual(await verifyPassword(old, 'lan-lab-2026'), { ok: true, rehash: true });
  assert.deepEqual(await verifyPassword(old, 'nope'), { ok: false, rehash: false });
});

test('policy: length, blocklist, context — no composition rules', () => {
  const blocklist = new Set(['123456']);
  assert.deepEqual(checkNewPassword('123456', { blocklist }), ['TOO_SHORT', 'COMMON']);
  assert.deepEqual(checkNewPassword('LabFlow2026!!!!!'), ['CONTEXT_WORD']);
  assert.deepEqual(checkNewPassword('hoa sen nở giữa đầm lầy tháng năm'), []);
});

test('signIn: one answer for both failures, upgrade on success', async () => {
  const rows = [{ id: 'usr_3', email: 'lan@labflow.example', passwordHash: await bcrypt.hash('lan-lab-2026', 10) }];
  const updates = [];
  const store = { findByEmail: async (e) => rows.find((r) => r.email === e) ?? null, updateHash: async (id, h) => updates.push(h) };
  assert.deepEqual(await signIn(store, 'nobody@labflow.example', 'x'), await signIn(store, 'lan@labflow.example', 'x'));
  assert.equal((await signIn(store, 'Lan@LabFlow.example', 'lan-lab-2026')).user.id, 'usr_3');
  assert.equal(describe(updates[0]).scheme, 'argon2id');
});`,
};
export const OUT = {
  '21-crack': `$ node demo2/crack.mjs
1003 accounts · attacker list: 10001 passwords
plain        read all 1003 passwords: no work at all
sha256       10001 hashes    15 ms → cracked 701/1003 (and 271 rows repeat another row's hash)
sha256+salt  4960404 hashes  2425 ms → cracked 701/1003
argon2id     Binh: "123456" after 2 guesses   166 ms
argon2id     51.2 guesses/s with 10 threads → whole list × 1003 accounts ≈ 54 h`,
  '21-migrate': `$ npm run migrate --silent && npm run seed --silent
applied 001_users.sql
seeded usr_1 an@student.labflow.example STUDENT
seeded usr_2 binh@student.labflow.example STUDENT
seeded usr_3 lan@labflow.example LAB_MANAGER`,
  '21-naive': `$ node demo2/naive-copy.mjs && node demo2/dump.mjs naive_users 'id, email, password' 6
copied 1003 users
usr_1 | an@student.labflow.example | an-lab-2026
usr_2 | binh@student.labflow.example | 123456
usr_3 | lan@labflow.example | lan-lab-2026
usr_4 | sv4@student.labflow.example | butter
usr_5 | sv5@student.labflow.example | tucker
usr_6 | sv6@student.labflow.example | warrior`,
  '21-table': `$ node demo2/crack-table.mjs
guesses/s                           top-10k        8 a-z          4 words        12 a-zA-Z0-9   
sha256 · 1 CPU core        2.00e+6  5.0 ms         1.2 days       58 years       5.1e+7 years   
sha256 · RTX 4090         2.20e+10  0.5 µs         9.5 s          1.9 days       4.7e+3 years   
bcrypt-12 · RTX 4090          1438  7.0 s          5 years        8.1e+4 years   7.1e+10 years  
bcrypt-12 · this Mac          18.9  8.8 minutes    349 years      6.1e+6 years   5.4e+12 years  
argon2id · this Mac           50.7  3.3 minutes    131 years      2.3e+6 years   2.0e+12 years  
(10 threads; time to try the WHOLE space for ONE salted account)`,
  '21-v02-dump': `$ node demo2/dump.mjs users 'id, email, password_hash' 3
usr_1 | an@student.labflow.example | $argon2id$v=19$m=65536,p=1,t=2$j4YAZjfI7tPPAvzdyHax5w$IRM6qgHcjxLRyvEg+iFVnHB06Ui6D+NSgbQ+Duz+aiU
usr_2 | binh@student.labflow.example | $argon2id$v=19$m=65536,p=1,t=2$QjUI5VoXbqCOqADohVyqJA$9x2JKzHny5pL386TX7ewCUh69T1PmtK0s457SDg7GY0
usr_3 | lan@labflow.example | $argon2id$v=19$m=65536,p=1,t=2$RExvOi3EIKk95RqqzJ4VSw$iisJPbQIAkaBpGOZ3ZAKVhUsed3ZdqlQ1SPdUZUMxoI`,
  '22-bcrypt72': `$ node demo2/bcrypt-72.mjs
69 characters = 89 bytes
verify with a different ending: true`,
  '22-format': `$ node demo2/format.mjs
$argon2id$v=19$m=65536,p=1,t=2$CQsmecpkoqaIooD8MMx6hQ$RQHeXgxCipOhjE9sOlKXrTtt+ymiJPhOtCyUjh6XWTM
{"id":"argon2id","v":"v=19","params":"m=65536,p=1,t=2","saltBytes":16,"hashBytes":32}
naive parse: null ⇒ needsRehash would be true on EVERY login
by name    : { scheme: 'argon2id', m: 65536, t: 2, p: 1 } ⇒ needsRehash false
argon2.needsRehash(stored, {memoryCost: 65536, timeCost: 3}) = true`,
  '22-load': `$ for t in 4 10 64; do UV_THREADPOOL_SIZE=$t node demo2/load.mjs 1 1; UV_THREADPOOL_SIZE=$t node demo2/load.mjs 40 1; done; node demo2/load.mjs 1 4; node demo2/load.mjs 40 4
1 logins · p=1 · threads=4 | p50    83 ms | p95    83 ms | last    83 ms | RSS +1 MiB
40 logins · p=1 · threads=4 | p50   511 ms | p95   850 ms | last   854 ms | RSS +194 MiB
1 logins · p=1 · threads=10 | p50    80 ms | p95    80 ms | last    80 ms | RSS +1 MiB
40 logins · p=1 · threads=10 | p50   424 ms | p95   698 ms | last   699 ms | RSS +578 MiB
1 logins · p=1 · threads=64 | p50    84 ms | p95    84 ms | last    84 ms | RSS +1 MiB
40 logins · p=1 · threads=64 | p50   537 ms | p95   605 ms | last   612 ms | RSS +2498 MiB
1 logins · p=4 · threads=4 | p50    27 ms | p95    27 ms | last    27 ms | RSS +1 MiB
40 logins · p=4 · threads=4 | p50   307 ms | p95   529 ms | last   534 ms | RSS +194 MiB`,
  '22-scrypt': `$ node demo2/scrypt-maxmem.mjs
maxmem default (32 MiB): ERR_CRYPTO_INVALID_SCRYPT_PARAMS — Invalid scrypt params: error:030000AC:digital envelope routines::memory limit exceeded
maxmem 135266304: ok in 275 ms, yq/R5/MTU8FK0phI…`,
  '22-tune': `$ node demo2/tune.mjs 100 256
budgets: 100 ms per hash, 256 MiB for 4 hashing threads ⇒ ≤ 64 MiB each
argon2id p=1 · median of 7 · Node v22.23.3 arm64
memory     t=1      t=2      t=3      t=4
  19 MiB   12.2     26.1     34.8     46.4 
  46 MiB   28.8     59.0     86.5    117.6*
  64 MiB   40.1     86.5    127.9*   165.1*
 128 MiB   85.3#   170.2*   264.3*   348.3*
* = too slow   # = too much memory for the thread pool
choose m=65536 (64 MiB), t=2, p=1 → 86.5 ms`,
  '23-log': `$ node src/server.js
{"level":30,"time":1793518348969,"method":"POST","path":"/sign-in","status":401,"ms":91,"ip":"::1","headers":{"host":"[redacted]","user-agent":"curl/8.7.1","accept":"[redacted]","content-type":"application/json","content-length":"[redacted]"},"body":{"email":"an@student.labflow.example","password":"[redacted]"},"msg":"request"}
{"level":30,"time":1793518349080,"method":"POST","path":"/sign-in","status":401,"ms":98,"ip":"::1","headers":{"host":"[redacted]","user-agent":"curl/8.7.1","accept":"[redacted]","content-type":"application/json","content-length":"[redacted]"},"body":{"email":"nobody@student.labflow.example","password":"[redacted]"},"msg":"request"}
{"level":30,"time":1793518349115,"method":"POST","path":"/sign-in","status":413,"ms":1,"ip":"::1","headers":{"host":"[redacted]","user-agent":"curl/8.7.1","accept":"[redacted]","content-type":"application/json","content-length":"[redacted]"},"body":null,"msg":"request"}`,
  '23-long': `$ node demo2/long-password.mjs
       16 chars →   85 ms
      128 chars →   86 ms
   100000 chars →   85 ms
  1000000 chars →   92 ms
 10000000 chars →  121 ms`,
  '23-naive': `$ node demo2/timing-signin.mjs 4802 && node demo2/timing-signin.mjs 4802
port 4802 · every response: 401 {"error":"Email or password is incorrect"}
no such email  median    2.3 ms
An, wrong pw   median   86.5 ms
ratio 37.3×
port 4802 · every response: 401 {"error":"Email or password is incorrect"}
no such email  median    2.2 ms
An, wrong pw   median   85.9 ms
ratio 39.0×`,
  '23-pepper': `$ node demo2/pepper.mjs
table only (SQL injection, stolen backup): 0 of the top 20 match — without the key every guess is wrong
table + PASSWORD_PEPPER (whole server taken): cracked "123456" in 186 ms
Binh signs in after the key is lost: false`,
  '23-signin': `$ bash demo2/sign-in-tries.sh
{"session":"lfid_ses_Ep6R7Hj2…","mustChangePassword":false} 200
{"session":"lfid_ses_vC-V5of_…","mustChangePassword":true} 200
{"session":"lfid_ses_SsGKWyW9…","mustChangePassword":false} 200
{"error":"Email or password is incorrect"} 401
{"error":"Email or password is incorrect"} 401
a 20 kB password → 413`,
  '23-unicode': `$ node demo2/unicode.mjs
look the same: Bình-thích-hoa-sen-2026 | Bình-thích-hoa-sen-2026
equal strings: false · bytes 25 vs 27
no normalisation  → verify the "tổ hợp" typing: false
NFC on both sides → verify the "tổ hợp" typing: true`,
  '23-v02': `$ node demo2/timing-signin.mjs 4800 && node demo2/timing-signin.mjs 4800
port 4800 · every response: 401 {"error":"Email or password is incorrect"}
no such email  median   86.3 ms
An, wrong pw   median   86.8 ms
ratio 1.0×
port 4800 · every response: 401 {"error":"Email or password is incorrect"}
no such email  median   85.8 ms
An, wrong pw   median   87.1 ms
ratio 1.0×`,
  '24-composition': `$ node demo2/composition.mjs
top-10k passwords that pass the classic rules: 0 → 
top-10k passwords with 15+ characters: 1
top-1000 "Capitalised + 1!": 756 now pass, e.g. Password1!, Qwerty1!, Dragon1!, Baseball1!`,
  '24-down': `$ node demo2/hibp-down.mjs
pwnedCount → null after 1503 ms (null = "could not ask": fail open, log it)`,
  '24-hibp': `$ for p in 123456 'Password1!' 'P@ssw0rd!' 'iloveyouiloveyou' 'hoa sen nở giữa đầm lầy tháng năm'; do node demo2/hibp.mjs "$p"; done
SHA-1 7C4A8|D09CA37… → sent "7C4A8", got 2100 suffixes (1 padding)
pwnedCount("123456") = 210461208
SHA-1 32CA9|FC1A0F5… → sent "32CA9", got 2202 suffixes (1 padding)
pwnedCount("Password1!") = 584516
SHA-1 076D3|E6C4B9F… → sent "076D3", got 2111 suffixes (1 padding)
pwnedCount("P@ssw0rd!") = 119515
SHA-1 5361F|CA33CAB… → sent "5361F", got 2121 suffixes (1 padding)
pwnedCount("iloveyouiloveyou") = 4707
SHA-1 B5947|B59F7D5… → sent "B5947", got 2094 suffixes (1 padding)
pwnedCount("hoa sen nở giữa đầm lầy tháng năm") = 0`,
  '24-signup': `$ bash demo2/sign-up-tries.sh
{"error":"WEAK_PASSWORD","problems":["TOO_SHORT","COMMON"]} 422  ← "123456"
{"error":"WEAK_PASSWORD","problems":["CONTEXT_WORD"]} 422  ← "LabFlow2026!!!!!"
{"error":"WEAK_PASSWORD","problems":["BREACHED"]} 422  ← "iloveyouiloveyou"
{"id":"usr_4"} 201  ← "hoa sen nở giữa đầm lầy tháng năm"`,
  '25-legacy': `$ node demo2/legacy.mjs
before: {"md5_left":"1003","wrapped":"0","argon2id":"0"} · the 10k list cracks 701 rows in 4 ms
wrapped 1003 rows in 17.1 s (10 threads) · {"md5_left":"0","wrapped":"1003","argon2id":"0"}
An signs in: {"ok":true,"rehash":true} · stored was md5-argon2id
after An: {"md5_left":"0","wrapped":"1002","argon2id":"1"}
bcrypt cost 10 (2022 accounts)     → {"ok":true,"rehash":true}
argon2id m=19 MiB t=2 (v0.2-beta)  → {"ok":true,"rehash":true}`,
  'lab-bat-dau': `$ node scripts/cham-lab-2.mjs lab2/starter
Lab 2 — lab2/starter/index.js
✗ T1 argon2id, self-describing, OWASP minimum or above, salted                           0/1
    ↳ your code threw Error: TODO hashPassword
✗ T2 a stolen row resists fast cracking (no plain/MD5/SHA, ≥ 10 ms per guess)            0/1.5
    ↳ your code threw Error: TODO hashPassword
✗ T3 verifyPassword: right/wrong, never throws, Unicode NFC                              0/1
    ↳ your code threw Error: TODO hashPassword
✗ T4 old shapes verify and ask for a rehash (old params, bcrypt, wrapped MD5)            0/1.5
    ↳ your code threw Error: TODO hashPassword
✗ T5 signIn upgrades an old hash on success, and only on success                         0/1
    ↳ your code threw Error: TODO signIn
✗ T6 "no such email" and "wrong password" take the same time (ratio < 1.5×)              0/1.5
    ↳ your code threw Error: TODO hashPassword
✗ T7 one answer for both failures; email matched trimmed + lower-case                    0/0.5
    ↳ your code threw Error: TODO hashPassword
✗ T8 checkNewPassword follows NIST 800-63B-4 (length, blocklist, context, no composition rules) 0/1
    ↳ your code threw Error: TODO checkNewPassword
✗ T9 source: no blocking *Sync hashing, no Math.random, no password in a log line        0/1
    ↳ your code threw Error: TODO hashPassword
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test

> labflow-id@0.2.0 test
> node --test --test-reporter=spec "test/**/*.test.js"

✔ newToken: prefix + 43 base64url chars, and checks its arguments (0.721666ms)
✔ tokenDigest is SHA-256 hex (0.29075ms)
✔ safeEqual: equal, different, different lengths, not strings (0.314292ms)
✔ signed value: round trip, tampering, expiry boundary (0.444125ms)
✔ signed value: key rotation and malformed input (0.182041ms)
✔ redact keeps only allowed keys, deeply (0.402708ms)
✔ hash is argon2id with the measured parameters and a fresh salt (175.166541ms)
✔ NFC: precomposed and decomposed Vietnamese verify the same (167.474916ms)
✔ bcrypt verifies and asks for a rehash; a wrong password never does (210.237292ms)
✔ policy: length, blocklist, context — no composition rules (0.671334ms)
✔ signIn: one answer for both failures, upgrade on success (377.637916ms)
ℹ tests 11
ℹ suites 0
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1088.811125`,
  'lab-tham-khao': `$ node scripts/cham-lab-2.mjs src/passwords
Lab 2 — src/passwords/index.js
✓ T1 argon2id, self-describing, OWASP minimum or above, salted                           1/1
✓ T2 a stolen row resists fast cracking (no plain/MD5/SHA, ≥ 10 ms per guess)            1.5/1.5
✓ T3 verifyPassword: right/wrong, never throws, Unicode NFC                              1/1
✓ T4 old shapes verify and ask for a rehash (old params, bcrypt, wrapped MD5)            1.5/1.5
✓ T5 signIn upgrades an old hash on success, and only on success                         1/1
✓ T6 "no such email" and "wrong password" take the same time (ratio < 1.5×)              1.5/1.5
✓ T7 one answer for both failures; email matched trimmed + lower-case                    0.5/0.5
✓ T8 checkNewPassword follows NIST 800-63B-4 (length, blocklist, context, no composition rules) 1/1
✓ T9 source: no blocking *Sync hashing, no Math.random, no password in a log line        1/1
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-2.mjs lab2/yeu
Lab 2 — lab2/yeu/index.js
✓ T1 argon2id, self-describing, OWASP minimum or above, salted                           1/1
✓ T2 a stolen row resists fast cracking (no plain/MD5/SHA, ≥ 10 ms per guess)            1.5/1.5
✗ T3 verifyPassword: right/wrong, never throws, Unicode NFC                              0/1
    ↳ verifyPassword("$argon2id$v, undefined) should be { ok: false }, it threw TypeError
✗ T4 old shapes verify and ask for a rehash (old params, bcrypt, wrapped MD5)            0/1.5
    ↳ argon2id m=8 MiB t=1: expected { ok: true, rehash: true }, got {"ok":true,"rehash":false}
✗ T5 signIn upgrades an old hash on success, and only on success                         0/1
    ↳ the right password should give { user }, got {"error":"WRONG_PASSWORD"}
✗ T6 "no such email" and "wrong password" take the same time (ratio < 1.5×)              0/1.5
    ↳ no such email 0.0 ms vs wrong password 35.2 ms — 4590.6×: the clock tells who has an account
✗ T7 one answer for both failures; email matched trimmed + lower-case                    0/0.5
    ↳ different answers: {"error":"NO_SUCH_ACCOUNT"} vs {"error":"WRONG_PASSWORD"}
✗ T8 checkNewPassword follows NIST 800-63B-4 (length, blocklist, context, no composition rules) 0/1
    ↳ "123456" should include COMMON, got ["TOO_SHORT","NEEDS_MIXED_CASE","NEEDS_SYMBOL"]
✓ T9 source: no blocking *Sync hashing, no Math.random, no password in a log line        1/1
TOTAL 3.5/10 — NOT YET (pass = 7)`,
};
