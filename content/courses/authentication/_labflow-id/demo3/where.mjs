// demo3/where.mjs — lesson 3.5: three places to keep a session — PostgreSQL, Redis, or the cookie itself (signed, lesson 1.4).
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
  ['PostgreSQL row', await bench('pg', () => pgStore.get(tokenDigest(pgToken))), `__Host-lfid_ses=${pgToken}`],
  ['Redis key', await bench('redis', () => redis.get(tokenDigest(rdToken))), `__Host-lfid_ses=${rdToken}`],
  ['signed cookie', await bench('signed', () => verifyValue(signed, { keys: KEYS })), `__Host-lfid_ses=${signed}`],
];
console.log(`${N} lookups each, one process; PostgreSQL 17 and Redis 7 in Docker Desktop (macOS port forwarding adds a hop)`);
for (const [name, us, cookie] of res) console.log(`${name.padEnd(15)} median ${us.toFixed(1).padStart(6)} µs per lookup · cookie ${cookie.length} bytes`);

console.log(`Redis TTL of An's session key: ${await redis.client.ttl('ses:' + tokenDigest(rdToken))} s (the idle timeout is Redis's job)`);
// Revoke An everywhere, then ask again
await pgStore.deleteByUser('usr_1');
await redis.deleteByUser('usr_1');
console.log('after "sign An out everywhere":');
console.log(`  PostgreSQL → ${JSON.stringify(await pgStore.get(tokenDigest(pgToken)))}`);
console.log(`  Redis      → ${JSON.stringify(await redis.get(tokenDigest(rdToken)))}`);
console.log(`  signed     → ${verifyValue(signed, { keys: KEYS })}   (still valid until it expires, unless every request also checks a denylist)`);
await redis.client.quit(); await pool.end();
