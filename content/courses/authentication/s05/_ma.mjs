/**
 * _ma.mjs (Chương 5) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  layer: `// src/refresh/layer.js — Chapter 5 = Lab 5 reference: refresh tokens that rotate, detect reuse, and revoke by family.
// store = { insert, getByDigest, getById, markUsed, revokeFamily, revokeAllForUser, listFamilies, revokeFamilyForUser }.
// A refresh token is a long-lived secret kept ONLY as a digest (lesson 1.3). Every use rotates it: the old one is marked
// used and a new one is minted in the same family. Presenting an already-used token is either a browser race (two tabs,
// lesson 5.5) or theft — and theft must revoke the whole family (lesson 5.2).
import { newToken, tokenDigest } from '../crypto/index.js';

export function refreshLayer({ store, now = () => Date.now(), familyTtlMs = 30 * 24 * 3600e3, graceMs = 10e3 }) {
  const recent = new Map(); // parentDigest -> { token, row, at }: the just-minted child, for the grace window (5.5)

  /** Start a new family (a new login on a new device), or add to an existing one during rotation. */
  async function issue(userId, { ip = null, ua = null, familyId, expiresAt } = {}) {
    const token = newToken('lfid_rt');
    const t = now();
    const row = {
      id: newToken('rt'), familyId: familyId ?? newToken('fam'), userId,
      digest: tokenDigest(token), createdAt: t, expiresAt: expiresAt ?? t + familyTtlMs,
      usedAt: null, replacedBy: null, revokedAt: null, ip, userAgent: ua,
    };
    await store.insert(row);
    return { token, row };
  }

  /** Rotate a presented token. ⇒ { token, row } (fresh token), or { error } with a reason. */
  async function rotate(presented, { ip = null, ua = null } = {}) {
    const digest = tokenDigest(presented);
    const rec = await store.getByDigest(digest);
    if (!rec) return { error: 'INVALID' };                 // never issued, or already pruned
    if (rec.revokedAt) return { error: 'REVOKED' };         // the family was revoked (sign-out, theft, password change)
    const t = now();
    if (t >= rec.expiresAt) return { error: 'EXPIRED' };    // the family's 30 days are up
    if (rec.usedAt) {
      const cached = recent.get(digest);
      if (cached && t - cached.at <= graceMs) return { token: cached.token, row: cached.row, raced: true }; // 5.5: the race
      await store.revokeFamily(rec.familyId, t);            // 5.2: reuse outside the grace window ⇒ theft ⇒ revoke the family
      return { error: 'REUSE_DETECTED', familyId: rec.familyId };
    }
    const next = await issue(rec.userId, { ip, ua, familyId: rec.familyId, expiresAt: rec.expiresAt });
    await store.markUsed(rec.id, { usedAt: t, replacedBy: next.row.id });
    recent.set(digest, { token: next.token, row: next.row, at: t });
    return { token: next.token, row: next.row };
  }

  const revokeFamily = (familyId) => store.revokeFamily(familyId, now());          // one device / login
  const revokeAll = (userId) => store.revokeAllForUser(userId, now());             // every device (password change, 5.3)
  const revokeDevice = (userId, familyId) => store.revokeFamilyForUser(userId, familyId, now());
  const listDevices = (userId) => store.listFamilies(userId, now());              // the devices page (5.4)

  return { issue, rotate, revokeFamily, revokeAll, revokeDevice, listDevices };
}`,
  pgStore: `// src/refresh/pg-store.js — the refresh-token store on PostgreSQL (lesson 5.1). Times are epoch ms in JavaScript.
import { q } from '../db.js';

const row = (r) => r ? {
  id: r.id, familyId: r.family_id, userId: r.user_id, digest: r.digest,
  createdAt: +r.created_at, expiresAt: +r.expires_at,
  usedAt: r.used_at ? +r.used_at : null, replacedBy: r.replaced_by,
  revokedAt: r.revoked_at ? +r.revoked_at : null, ip: r.ip, userAgent: r.user_agent,
} : null;
const ts = (ms) => new Date(ms);

export const pgStore = {
  async insert(s) {
    await q(\`INSERT INTO refresh_tokens (id, family_id, user_id, digest, created_at, expires_at, ip, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\`,
      [s.id, s.familyId, s.userId, s.digest, ts(s.createdAt), ts(s.expiresAt), s.ip, s.userAgent]);
  },
  async getByDigest(digest) { return row((await q('SELECT * FROM refresh_tokens WHERE digest = $1', [digest])).rows[0]); },
  async getById(id) { return row((await q('SELECT * FROM refresh_tokens WHERE id = $1', [id])).rows[0]); },
  async markUsed(id, f) {
    await q('UPDATE refresh_tokens SET used_at = $2, replaced_by = $3 WHERE id = $1', [id, ts(f.usedAt), f.replacedBy]);
  },
  // Revoke every token of a family that is not already revoked. Returns how many rows it touched.
  async revokeFamily(familyId, t) {
    return (await q('UPDATE refresh_tokens SET revoked_at = $2 WHERE family_id = $1 AND revoked_at IS NULL', [familyId, ts(t)])).rowCount;
  },
  async revokeAllForUser(userId, t) {
    return (await q('UPDATE refresh_tokens SET revoked_at = $2 WHERE user_id = $1 AND revoked_at IS NULL', [userId, ts(t)])).rowCount;
  },
  async revokeFamilyForUser(userId, familyId, t) {
    return (await q('UPDATE refresh_tokens SET revoked_at = $3 WHERE user_id = $1 AND family_id = $2 AND revoked_at IS NULL', [userId, familyId, ts(t)])).rowCount;
  },
  // One entry per live family (a device): the current token's times, the login's ip/ua.
  async listFamilies(userId, t) {
    const r = await q(\`SELECT family_id,
        min(created_at) AS first_seen, max(created_at) AS last_seen,
        (array_agg(ip ORDER BY created_at))[1] AS ip,
        (array_agg(user_agent ORDER BY created_at))[1] AS user_agent,
        max(expires_at) AS expires_at
      FROM refresh_tokens
      WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > $2
      GROUP BY family_id ORDER BY max(created_at) DESC\`, [userId, ts(t)]);
    return r.rows.map((x) => ({ familyId: x.family_id, firstSeen: +x.first_seen, lastSeen: +x.last_seen,
      ip: x.ip, userAgent: x.user_agent, expiresAt: +x.expires_at }));
  },
};`,
  sql003: `-- sql/003_refresh.sql — Chapter 5: refresh tokens, in families, each stored only as a digest (lesson 1.3).
-- One row per refresh token ever issued; a family is one login on one device. A token is "current" while used_at IS NULL.
CREATE TABLE refresh_tokens (
  id          text        PRIMARY KEY,                 -- rt_<random> — the row id, safe to log
  family_id   text        NOT NULL,                    -- fam_<random> — all tokens from one login share it
  user_id     text        NOT NULL REFERENCES users(id),
  digest      text        NOT NULL,                    -- SHA-256 of the token; the token itself is never stored
  created_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL,                    -- the family's absolute end (30 days); a rotated token keeps it
  used_at     timestamptz,                             -- when this token was rotated away (NULL = the current, live token)
  replaced_by text,                                    -- the id of the token that replaced it (for the grace window, 5.5)
  revoked_at  timestamptz,                             -- set on every token of a family when the family is revoked
  ip          inet,
  user_agent  text
);
CREATE UNIQUE INDEX refresh_tokens_digest_idx ON refresh_tokens (digest);           -- look a presented token up by its digest
CREATE INDEX refresh_tokens_family_idx ON refresh_tokens (family_id);               -- revoke a whole family at once
CREATE INDEX refresh_tokens_user_idx ON refresh_tokens (user_id);                   -- the devices page, and "sign out everywhere"`,
  server05: `// src/server.js — LabFlow ID v0.5 (end of Chapter 5). Fixed so far:
//   hole 1 — argon2id in PostgreSQL, measured parameters, upgrade on login (Chapter 2);
//   hole 3 — CSPRNG session ids, only their SHA-256 stored (Chapter 1);
//   hole 4 — sessions end: idle 30 min, absolute 12 h, sign-out, sign-out-everywhere (lesson 3.1);
//   hole 5 — the session travels in a __Host- cookie JavaScript cannot read, never in a JSON body (3.2); CSRF checked (3.4).
// Chapter 4: LabFlow ID issues short-lived JWT access tokens (EdDSA, kid, 7 claims) and a public JWKS (lesson 4.x).
// New in Chapter 5: a long-lived REFRESH token, in a family, in a __Host- cookie. /refresh rotates it and mints a fresh
//   access token; a reused (already-rotated) refresh token means theft and revokes the whole family (lesson 5.2); a
//   devices page lists and revokes families (5.4); a password change revokes every family (5.3).
// Still open: the sign-up half of hole 2 (Chapter 6) and hole 6, unlimited guessing (Chapter 10). Never deploy this file.
import express from 'express';
import { users } from './users.js';
import { hashPassword, verifyPassword, checkNewPassword, loadBlocklist, pwnedCount, signIn } from './passwords/index.js';
import { sessionLayer, pgStore } from './sessions/index.js';
import { accessTokens, eddsa, newEd25519, ACCESS_TTL_SEC } from './jwt/index.js';
import { publicJwks } from './jwt/jwks.js';
import { refreshLayer, pgStore as refreshStore } from './refresh/index.js';
import { tokenDigest } from './crypto/index.js';
import { log, requestLog } from './log.js';

const BLOCKLIST = loadBlocklist();
const sessions = sessionLayer({ store: pgStore, touchEveryMs: Number(process.env.TOUCH_EVERY_MS ?? 60e3) });
const refresh = refreshLayer({ store: refreshStore, graceMs: Number(process.env.REFRESH_GRACE_MS ?? 10e3) });

const ACTIVE_KID = process.env.JWT_KID ?? 'ed-2026-11';
const keyring = { [ACTIVE_KID]: eddsa(newEd25519()) };
const ISSUER = process.env.JWT_ISSUER ?? 'https://id.labflow.example';
const AUDIENCE = process.env.JWT_AUDIENCE ?? 'labflow-api';
const tokens = accessTokens({ keyring, activeKid: ACTIVE_KID, issuer: ISSUER, audience: AUDIENCE });

const RT_COOKIE = '__Host-lfid_rt';                               // the refresh token, HttpOnly, never read by JavaScript (4.5)
const RT_ATTRS = 'Path=/; HttpOnly; Secure; SameSite=Lax';
const setRefreshCookie = (res, token) => res.append('Set-Cookie', \`\${RT_COOKIE}=\${token}; \${RT_ATTRS}; Max-Age=\${30 * 24 * 3600}\`);
const clearRefreshCookie = (res) => res.append('Set-Cookie', \`\${RT_COOKIE}=; \${RT_ATTRS}; Max-Age=0\`);
function readCookie(header, name) {
  for (const part of String(header ?? '').split(';')) { const i = part.indexOf('='); if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim(); }
  return null;
}

const app = express();
app.use(requestLog);
app.use(express.json({ limit: '8kb' }));
app.use(sessions.load);   // req.session = the row, or null
app.use(sessions.csrf);   // POST/PUT/PATCH/DELETE must come from our own origin

const needSession = (req, res, next) => (req.session ? next() : res.status(401).json({ error: 'Not signed in' }));
const accessFor = (u) => tokens.issue(u.id, { role: u.role });

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
  await sessions.start(req, res, user.id);                         // the web session (Chapter 3), in its own cookie
  const { token } = await refresh.issue(user.id, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null }); // a new family (device)
  setRefreshCookie(res, token);
  res.json({ ok: true, access_token: accessFor(user), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, mustChangePassword: user.mustChangePassword || common });
});

// lesson 5.1, 5.2: exchange the refresh token for a fresh access token, rotating the refresh token every time.
app.post('/refresh', async (req, res) => {
  const presented = readCookie(req.headers.cookie, RT_COOKIE);
  if (!presented) return res.status(401).json({ error: 'NO_REFRESH_TOKEN' });
  const r = await refresh.rotate(presented, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null });
  if (r.error) {
    clearRefreshCookie(res);                                       // a bad refresh token is cleared, whatever the reason
    if (r.error === 'REUSE_DETECTED') log.warn({ familyId: r.familyId }, 'refresh token reuse — family revoked');
    return res.status(401).json({ error: r.error });
  }
  const u = await users.findById(r.row.userId);
  setRefreshCookie(res, r.token);                                  // the rotated refresh token
  res.json({ ok: true, access_token: accessFor(u), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, ...(r.raced ? { raced: true } : {}) });
});

app.get('/me', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  res.json({ id: u.id, email: u.email, name: u.name, role: u.role });
});

// lesson 5.4: the devices page — one row per live family, with "this is you?" fields and a revoke button.
app.get('/me/devices', needSession, async (req, res) => {
  res.json({ devices: await refresh.listDevices(req.session.userId) });
});
app.post('/me/devices/revoke', needSession, async (req, res) => {
  const familyId = String(req.body?.familyId ?? '');
  const revoked = await refresh.revokeDevice(req.session.userId, familyId);
  res.json({ ok: true, revoked });
});

// lesson 4.x compatibility: also mint an access token from the session (web clients without a stored refresh token).
app.post('/token', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId);
  res.json({ access_token: accessFor(u), token_type: 'Bearer', expires_in: ACCESS_TTL_SEC, scope: AUDIENCE });
});

app.get('/.well-known/jwks.json', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(await publicJwks(keyring));
});

app.post('/me/email', needSession, async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!/^[^@\\s]+@[^@\\s]+$/.test(email)) return res.status(422).json({ error: 'BAD_EMAIL' });
  await users.updateEmail(req.session.userId, email);
  res.json({ ok: true, email });
});

// lesson 3.3 + 5.3: change the password, end every session AND revoke every refresh family, start fresh.
app.post('/me/password', needSession, async (req, res) => {
  const { current, next: pw } = req.body ?? {};
  const u = await users.findById(req.session.userId);
  if (!(await verifyPassword(u.passwordHash, String(current ?? ''))).ok) return res.status(403).json({ error: 'REAUTH_FAILED' });
  const problems = checkNewPassword(pw, { email: u.email, blocklist: BLOCKLIST });
  if (problems.length) return res.status(422).json({ error: 'WEAK_PASSWORD', problems });
  await users.updateHash(u.id, await hashPassword(pw));
  const endedSessions = await sessions.endAll(u.id);
  const revokedFamilies = await refresh.revokeAll(u.id);
  await sessions.start(req, res, u.id);
  const { token } = await refresh.issue(u.id, { ip: req.ip ?? null, ua: req.headers['user-agent'] ?? null });
  setRefreshCookie(res, token);
  res.json({ ok: true, signedOutSessions: endedSessions, revokedFamilies });
});

// lesson 5.3: sign-out ends this session and revokes this device's refresh family.
app.post('/sign-out', async (req, res) => {
  const presented = readCookie(req.headers.cookie, RT_COOKIE);
  if (presented) { const rec = await refreshStore.getByDigest(tokenDigest(presented)); if (rec) await refresh.revokeFamily(rec.familyId); }
  clearRefreshCookie(res);
  await sessions.end(req, res);
  res.json({ ok: true });
});
app.post('/sign-out-everywhere', needSession, async (req, res) => {
  const revokedFamilies = await refresh.revokeAll(req.session.userId);
  clearRefreshCookie(res);
  res.json({ ok: true, ended: await sessions.endAll(req.session.userId), revokedFamilies });
});

app.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? 'INTERNAL' }));

const port = Number(process.env.PORT ?? 4800);
app.listen(port, () => log.info(\`LabFlow ID v0.5 on http://localhost:\${port} (JWKS kid \${ACTIVE_KID})\`));`,
  grader: `// scripts/cham-lab-5.mjs — the grader of Lab 5 (LabFlow ID's refresh-token layer). 9 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-5.mjs <folder with index.js>     e.g.  node scripts/cham-lab-5.mjs lab5/my
// It passes YOUR refreshLayer an in-memory store and a fake clock, then drives rotation, reuse and the race. No database.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { tokenDigest } from '../src/crypto/index.js';
import { memoryStore } from '../src/refresh/memory-store.js';

const dir = path.resolve(process.argv[2] ?? 'lab5/my');
const file = path.join(dir, 'index.js');
const m = await import(pathToFileURL(file).href);

let CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
const now = () => CLOCK;
const tick = (ms) => (CLOCK += ms);
function layer(graceMs = 10e3, familyTtlMs = 30 * 24 * 3600e3) {
  const store = memoryStore();
  return { rl: m.refreshLayer({ store, now, graceMs, familyTtlMs }), store };
}

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : \`your code threw \${e?.name ?? 'Error'}: \${String(e?.message ?? e).split('\\n')[0]}\`; }
  results.push({ name, points, ok: !why, why });
}

// ── T1 issue + rotate: fresh token, same family ──
await check('T1 issue returns a token + family; rotate gives a new token in the same family', 1.5, async () => {
  const { rl } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  expect(a && typeof a.token === 'string' && a.row && a.row.familyId, 'issue must return { token, row } with a familyId');
  tick(60e3);
  const r1 = await rl.rotate(a.token);
  expect(r1.token && r1.token !== a.token, 'rotate must return a new token');
  expect(r1.row.familyId === a.row.familyId, 'the rotated token must stay in the same family');
});

// ── T2 the token is stored as a digest, never in the clear ──
await check('T2 the store keeps a SHA-256 digest, never the token itself', 1, async () => {
  const { rl, store } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1');
  const row = [...store.rows.values()][0];
  expect(row.digest === tokenDigest(a.token), 'the stored digest must be the SHA-256 of the token');
  expect(!JSON.stringify(row).includes(a.token), 'the raw token must not be stored anywhere on the row');
});

// ── T3 reuse of a rotated token revokes the whole family ──
await check('T3 reusing a rotated token revokes the whole family (theft)', 2, async () => {
  const { rl } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1');
  tick(60e3); const r1 = await rl.rotate(a.token);
  tick(60e3); const r2 = await rl.rotate(r1.token);
  tick(3600e3); // long past the grace window
  const reuse = await rl.rotate(a.token);
  expect(reuse.error === 'REUSE_DETECTED', \`reusing an old token must return REUSE_DETECTED, got \${JSON.stringify(reuse)}\`);
  const dead = await rl.rotate(r2.token);
  expect(dead.error === 'REVOKED', 'after reuse, even the current token must be REVOKED');
});

// ── T4 the race: same token within grace ⇒ same child ──
await check('T4 the race: the same token rotated twice within grace returns the same child', 1.5, async () => {
  const { rl } = layer(10e3); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1');
  tick(60e3);
  const x1 = await rl.rotate(a.token);
  tick(50); // 50 ms later — a second tab with the same cookie
  const x2 = await rl.rotate(a.token);
  expect(x1.token && x2.token && x1.token === x2.token, \`within grace, both must get the same token (got \${x1.token} vs \${x2.token})\`);
});

// ── T5 outside grace ⇒ theft ──
await check('T5 outside the grace window, the same second use is theft', 1, async () => {
  const { rl } = layer(10e3); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1');
  tick(60e3); await rl.rotate(a.token);
  tick(11000); // past the 10 s grace
  expect((await rl.rotate(a.token)).error === 'REUSE_DETECTED', 'a reuse 11 s later (grace 10 s) must be REUSE_DETECTED');
});

// ── T6 invalid / expired / revoked, without flagging theft ──
await check('T6 invalid, expired and revoked tokens are rejected (not flagged as theft)', 1, async () => {
  const { rl } = layer(10e3, 5000); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  expect((await rl.rotate('lfid_rt_nope')).error === 'INVALID', 'an unknown token must be INVALID');
  const a = await rl.issue('usr_1');
  tick(6000);
  expect((await rl.rotate(a.token)).error === 'EXPIRED', 'past the family ttl, a token must be EXPIRED');
  const b = await rl.issue('usr_2');
  await rl.revokeFamily(b.row.familyId);
  expect((await rl.rotate(b.token)).error === 'REVOKED', 'a revoked family must give REVOKED');
});

// ── T7 device list: one row per family ──
await check('T7 listDevices: one row per live family, not one per rotation', 1, async () => {
  const { rl } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  tick(1000); await rl.issue('usr_1', { ua: 'phone' });
  tick(1000); const r = await rl.rotate(a.token); await rl.rotate(r.token); // rotate the laptop twice
  const devices = await rl.listDevices('usr_1');
  expect(devices.length === 2, \`two logins should be two devices despite rotation, got \${devices.length}\`);
});

// ── T8 revoke one device, and all ──
await check('T8 revokeDevice revokes one family; revokeAll revokes every family', 1, async () => {
  const { rl } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  tick(1000); const b = await rl.issue('usr_1', { ua: 'phone' });
  await rl.revokeDevice('usr_1', a.row.familyId);
  expect((await rl.rotate(a.token)).error === 'REVOKED', 'the revoked device must be dead');
  expect((await rl.rotate(b.token)).token, 'the other device must still work');
  await rl.revokeAll('usr_1');
  expect((await rl.rotate(b.token)).error === 'REVOKED', 'revokeAll must revoke the rest');
});

const src = fs.readFileSync(file, 'utf8');
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 5 — \${path.relative(process.cwd(), file)}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(72)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
if (/Math\\.random/.test(src)) console.log('! the source mentions Math.random — tokens must come from node:crypto (lesson 1.2)');
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  yeu: `// lab5/yeu/index.js — a first attempt that "works": it rotates and hands out new tokens, and even has a devices page.
// But it never marks a token used, so it cannot tell a rotated token from a stolen one — no reuse detection, no grace,
// and a revoked token still refreshes.
import { newToken, tokenDigest } from '../../src/crypto/index.js';

export function refreshLayer({ store, now = () => Date.now(), familyTtlMs = 30 * 24 * 3600e3, graceMs = 10e3 }) {
  async function issue(userId, { ip = null, ua = null, familyId, expiresAt } = {}) {
    const token = newToken('lfid_rt'); const t = now();
    const row = { id: newToken('rt'), familyId: familyId ?? newToken('fam'), userId, digest: tokenDigest(token),
      createdAt: t, expiresAt: expiresAt ?? t + familyTtlMs, usedAt: null, replacedBy: null, revokedAt: null, ip, userAgent: ua };
    await store.insert(row);
    return { token, row };
  }
  async function rotate(presented) {
    const rec = await store.getByDigest(tokenDigest(presented));
    if (!rec) return { error: 'INVALID' };
    const next = await issue(rec.userId, { familyId: rec.familyId }); // just mint a new one — looks fine, until it isn't
    return { token: next.token, row: next.row };
  }
  return {
    issue, rotate,
    revokeFamily: (familyId) => store.revokeFamily(familyId, now()),
    revokeAll: (userId) => store.revokeAllForUser(userId, now()),
    revokeDevice: (userId, familyId) => store.revokeFamilyForUser(userId, familyId, now()),
    listDevices: (userId) => store.listFamilies(userId, now()),
  };
}`,
};
export const OUT = {
  '51-sign-in': `$ bash demo5/sign-in-refresh.sh
$ curl -s localhost:4800/sign-in  (returns an access token; sets a refresh cookie)
HTTP/1.1 200 OK
Set-Cookie: __Host-lfid_rt=lfid_rt_MX8Iw8…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
{"ok":true,"access_token":"eyJhbGciOiJFZERTQSIs…","token_type":"Bearer","expires_in":900,"mustChangePassword":false}

$ # the refresh token stored in the cookie jar (only its first chars shown):
__Host-lfid_rt	lfid_rt_MX8Iw8zm…

$ curl -s -X POST localhost:4800/refresh  (rotates the refresh token, mints a new access token)
HTTP/1.1 200 OK
Set-Cookie: __Host-lfid_rt=lfid_rt_EOSo-P…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
{"ok":true,"access_token":"eyJhbGciOiJFZERTQSIs…","token_type":"Bearer","expires_in":900}

$ # the refresh cookie CHANGED — the old one is now used and would be rejected (rotation):
__Host-lfid_rt	lfid_rt_EOSo-PYX…`,
  '51-two-tokens': `$ node demo5/two-tokens.mjs
ACCESS token (a JWT — Chapter 4):
  shape    : 3 base64url parts, 376 chars
  readable : {"sub":"usr_1","role":"STUDENT"}
  lifetime : 15 minutes · stateless (no DB lookup) · cannot be revoked before it expires

REFRESH token (opaque, Chapter 5):
  shape    : lfid_rt_XEhu… — one opaque secret, no readable claims
  stored   : only its SHA-256 digest 9979aa15ee6762d3… (never the token, lesson 1.3)
  lifetime : 30 days · stateful (one row) · revocable instantly, and rotated on every use

why not one token for both jobs:
  long-lived JWT  ⇒ a stolen token is valid for 30 days and cannot be revoked (4.3)
  short-lived refresh ⇒ the user would re-enter their password every 15 minutes
  so: a short access token for every request, a long refresh token used only at /refresh`,
  '52-rotate-reuse': `$ node demo5/rotate-reuse.mjs
An signs in → refresh token r0, family fam_Pq4AHiK…
she refreshes twice (r0→r1→r2); the family so far:
  #1 rt_6Wu7Xc… fam fam_Pq4… used=yes revoked=no 
  #2 rt_akJaBW… fam fam_Pq4… used=yes revoked=no 
  #3 rt_-7oD3Y… fam fam_Pq4… used=no  revoked=no 

a thief copied r0 earlier and now replays it (long after it was rotated):
  rotate(r0) → REUSE_DETECTED · family fam_Pq4AHiK… revoked

the family after reuse detection — every token revoked, including the live r2:
  #1 rt_6Wu7Xc… fam fam_Pq4… used=yes revoked=YES
  #2 rt_akJaBW… fam fam_Pq4… used=yes revoked=YES
  #3 rt_-7oD3Y… fam fam_Pq4… used=no  revoked=YES

so An’s next real refresh also fails (she must sign in again):
  rotate(r2) → REVOKED

The cost: the real user is signed out too. That is the point — a reuse means one of the two copies is a
thief, and you cannot tell which, so you end the family and make everyone re-authenticate.`,
  '53-five-events': `$ node demo5/five-events.mjs
1. sign-out (this device)        → next refresh: REVOKED
2. sign-out everywhere / pw change → next refresh: REVOKED
3. refresh reuse (theft)          → next refresh: REVOKED
4. absolute expiry (30 days)      → next refresh: EXPIRED
5. admin/devices-page revoke      → next refresh: REVOKED

Every path ends with a refresh that no longer works, so the next 15-minute access token is never minted.
The access token already out there still works until it expires (≤ 15 min) — the window you accept for
skipping a per-request lookup (lesson 4.3). Shorten the access token to shrink it.`,
  '54-devices': `$ bash demo5/devices.sh
$ curl -s -b laptop.jar localhost:4800/me/devices   (every live family, one row per device)
  fam_eJ8mAlD…  ua=labpc  ip=::1
  fam_i9aKDEG…  ua=phone  ip=::1
  fam_QEivbL4…  ua=laptop  ip=::1

$ curl -s -X POST localhost:4800/me/devices/revoke -d {"familyId":"<phone>"}  (revoke just the phone)
{"ok":true,"revoked":1}

$ # the phone can no longer refresh:
{"error":"REVOKED"}
$ # and it is gone from the list:
  2 devices left: labpc, laptop`,
  '55-race': `$ node demo5/race.mjs
grace window = 10 s (LabFlow ID default):
  tab A → new token lfid_rt_n7li…
  tab B → new token lfid_rt_n7li… (raced=true)
  same token? true → both tabs stay signed in

grace window = 0 (naive rotation — the false positive):
  tab A → new token lfid_rt_2EKL…
  tab B → REUSE_DETECTED ← the real user just got logged out

rotation throughput (memory store, macOS arm64): 150,730 rotations/s (0.007 ms each)`,
  'lab-bat-dau': `$ node scripts/cham-lab-5.mjs lab5/starter
Lab 5 — lab5/starter/index.js
✗ T1 issue returns a token + family; rotate gives a new token in the same family 0/1.5
    ↳ your code threw Error: not implemented
✗ T2 the store keeps a SHA-256 digest, never the token itself              0/1
    ↳ your code threw Error: not implemented
✗ T3 reusing a rotated token revokes the whole family (theft)              0/2
    ↳ your code threw Error: not implemented
✗ T4 the race: the same token rotated twice within grace returns the same child 0/1.5
    ↳ your code threw Error: not implemented
✗ T5 outside the grace window, the same second use is theft                0/1
    ↳ your code threw Error: not implemented
✗ T6 invalid, expired and revoked tokens are rejected (not flagged as theft) 0/1
    ↳ your code threw Error: not implemented
✗ T7 listDevices: one row per live family, not one per rotation            0/1
    ↳ your code threw Error: not implemented
✗ T8 revokeDevice revokes one family; revokeAll revokes every family       0/1
    ↳ your code threw Error: not implemented
TOTAL 0/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test 2>&1 | grep -v 'npm notice'

> labflow-id@0.4.0 test
> node --test --test-reporter=spec "test/**/*.test.js"

✔ newToken: prefix + 43 base64url chars, and checks its arguments (0.667292ms)
✔ tokenDigest is SHA-256 hex (0.274292ms)
✔ safeEqual: equal, different, different lengths, not strings (0.181125ms)
✔ signed value: round trip, tampering, expiry boundary (0.332542ms)
✔ signed value: key rotation and malformed input (0.167542ms)
✔ redact keeps only allowed keys, deeply (0.395333ms)
✔ issue + verify: round trip with the seven claims (1.42925ms)
✔ alg: none is rejected (algorithm comes from the key, not the header) (0.363834ms)
✔ HS/RS confusion is rejected (public key used as an HMAC secret) (0.907042ms)
✔ unknown or missing kid is rejected (0.208833ms)
✔ tampered payload is rejected (signature covers header.payload) (0.364792ms)
✔ claims: iss, aud, sub, exp, nbf, iat, jti each enforced (1.433541ms)
✔ exp boundary and clock skew (0.563042ms)
✔ revocation by jti (0.3035ms)
✔ key rotation: two live keys verify, a dropped key does not (0.495459ms)
✔ interop with jose (both directions) (6.467625ms)
✔ hash is argon2id with the measured parameters and a fresh salt (162.777375ms)
✔ NFC: precomposed and decomposed Vietnamese verify the same (159.963792ms)
✔ bcrypt verifies and asks for a rehash; a wrong password never does (201.996833ms)
✔ policy: length, blocklist, context — no composition rules (0.644167ms)
✔ signIn: one answer for both failures, upgrade on success (354.012167ms)
✔ issue + rotate: a fresh token each time, same family (1.23375ms)
✔ reuse of a rotated token revokes the whole family (0.375417ms)
✔ the refresh race: the same token rotated twice within grace returns the same child (0.173958ms)
✔ outside the grace window, the same second use is treated as theft (0.114666ms)
✔ invalid, expired and revoked tokens are rejected without flagging theft (0.19625ms)
✔ device list and revocation (0.218166ms)
✔ a rotated family still appears as one device (not one per rotation) (0.225375ms)
✔ cookie: __Host- prefix, HttpOnly, Secure, SameSite=Lax, Path=/ (1.025792ms)
✔ sign-in replaces a planted session (fixation) (0.334208ms)
✔ idle 30 min and absolute 12 h (0.821541ms)
✔ csrf: cross-site and foreign Origin get 403; same-origin and non-browser clients pass (0.129666ms)
ℹ tests 32
ℹ suites 0
ℹ pass 32
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1022.906583`,
  'lab-tham-khao': `$ node scripts/cham-lab-5.mjs lab5/tham-khao
Lab 5 — lab5/tham-khao/index.js
✓ T1 issue returns a token + family; rotate gives a new token in the same family 1.5/1.5
✓ T2 the store keeps a SHA-256 digest, never the token itself              1/1
✓ T3 reusing a rotated token revokes the whole family (theft)              2/2
✓ T4 the race: the same token rotated twice within grace returns the same child 1.5/1.5
✓ T5 outside the grace window, the same second use is theft                1/1
✓ T6 invalid, expired and revoked tokens are rejected (not flagged as theft) 1/1
✓ T7 listDevices: one row per live family, not one per rotation            1/1
✓ T8 revokeDevice revokes one family; revokeAll revokes every family       1/1
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-5.mjs lab5/yeu
Lab 5 — lab5/yeu/index.js
✓ T1 issue returns a token + family; rotate gives a new token in the same family 1.5/1.5
✓ T2 the store keeps a SHA-256 digest, never the token itself              1/1
✗ T3 reusing a rotated token revokes the whole family (theft)              0/2
    ↳ reusing an old token must return REUSE_DETECTED, got {"token":"lfid_rt_y8ANCIAmwBPweGJsxJd9Y-WRKp5O55fmKaR14EHHT4E","row":{"id":"rt_5GcV0Im0TH55uXETWrWDaONt6h_PXGBr0dusIOFOFwA","familyId":"fam_Fa9623D5zjdUNxFQgJPEl80LJMenXoZOzcmjVcM_DG4","userId":"usr_1","digest":"cf8341a72d3a2a15a600a310dd7d0d1f6ef992dbe8f30552c2f349875b2ecac7","createdAt":1793700120000,"expiresAt":1796292120000,"usedAt":null,"replacedBy":null,"revokedAt":null,"ip":null,"userAgent":null}}
✗ T4 the race: the same token rotated twice within grace returns the same child 0/1.5
    ↳ within grace, both must get the same token (got lfid_rt_f0EBgbsXDw2EMz7ePUr5SEgPG7AjMMfkswrMVSA6bRg vs lfid_rt_khrAIvXQjF-UlIr0Rx-LIiyU9NBmIUlPaLOkwzalbr8)
✗ T5 outside the grace window, the same second use is theft                0/1
    ↳ a reuse 11 s later (grace 10 s) must be REUSE_DETECTED
✗ T6 invalid, expired and revoked tokens are rejected (not flagged as theft) 0/1
    ↳ past the family ttl, a token must be EXPIRED
✓ T7 listDevices: one row per live family, not one per rotation            1/1
✗ T8 revokeDevice revokes one family; revokeAll revokes every family       0/1
    ↳ the revoked device must be dead
TOTAL 3.5/10 — NOT YET (pass = 7)`,
};
