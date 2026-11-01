// demo2/legacy.mjs — lesson 2.5: LabFlow's old booking system (2019) kept md5(password), no salt. Move 1,003 accounts
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

const count = async () => (await pool.query(`SELECT count(*) FILTER (WHERE pass_md5 IS NOT NULL) AS md5_left,
  count(*) FILTER (WHERE password_hash LIKE '$md5-argon2id$%') AS wrapped, count(*) FILTER (WHERE password_hash LIKE '$argon2id$%') AS argon2id
  FROM legacy_users`)).rows[0];
const table = new Map(WORDS.map((w) => [md5(w), w]));
let t0 = performance.now();
const rows = (await pool.query('SELECT id, pass_md5 FROM legacy_users')).rows;
console.log(`before: ${JSON.stringify(await count())} · the 10k list cracks ${rows.filter((r) => table.has(r.pass_md5)).length} rows in ${(performance.now() - t0).toFixed(0)} ms`);

// Step 1 — wrap every row now, and DROP the old value in the same UPDATE (Ashley Madison kept a second MD5 column: 11 M cracked)
t0 = performance.now();
await Promise.all(rows.map(async (r) => {
  await pool.query('UPDATE legacy_users SET password_hash = $2, pass_md5 = NULL WHERE id = $1', [r.id, await wrapLegacyMd5(r.pass_md5)]);
}));
console.log(`wrapped ${rows.length} rows in ${((performance.now() - t0) / 1000).toFixed(1)} s (${process.env.UV_THREADPOOL_SIZE ?? 4} threads) · ${JSON.stringify(await count())}`);

// Step 2 — An signs in: the wrapped hash verifies, asks for a rehash, and becomes a plain argon2id hash
const an = (await pool.query(`SELECT password_hash FROM legacy_users WHERE id = 'usr_1'`)).rows[0].password_hash;
const r = await verifyPassword(an, 'an-lab-2026');
console.log(`An signs in: ${JSON.stringify(r)} · stored was ${describe(an).scheme}`);
if (r.rehash) await pool.query(`UPDATE legacy_users SET password_hash = $1 WHERE id = 'usr_1'`, [await hashPassword('an-lab-2026')]);
console.log(`after An: ${JSON.stringify(await count())}`);

// The other two shapes: a modern algorithm with old parameters, and another algorithm
for (const [label, stored] of [
  ['bcrypt cost 10 (2022 accounts)', await bcrypt.hash('lan-lab-2026', 10)],
  ['argon2id m=19 MiB t=2 (v0.2-beta)', await argon2.hash('lan-lab-2026', { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 })],
]) console.log(`${label.padEnd(34)} → ${JSON.stringify(await verifyPassword(stored, 'lan-lab-2026'))}`);
await pool.end();
