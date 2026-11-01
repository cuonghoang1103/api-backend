/**
 * api-09-2 — API Design · Chapter 9 · Lesson 9.2 "Redis cache and stampede" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s09-du-lieu.mjs › api-9-1-server-cache. Output = chạy thật Redis 8.2 + PostgreSQL 18, perf/stampede.mjs, autocannon.
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 9 — Data at scale', bai: '9.2' };

export const deck = { key: 'api-09-2', code: 'API 9.2', title: 'Redis cache and stampede', sub: 'Server-side caching, measured' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Server-side caching<br>and the stampede', sub: 'Compute once, serve everyone —<br>until the key expires.' },

  { t: 'An expensive question', giua: true, body: sql(`// routes/stats.js — only with LABFLOW_PG=1
const SQL = \`SELECT lab_id AS "labId", count(*)::int AS bookings
  FROM bookings WHERE status <> 'CANCELLED'
  GROUP BY lab_id ORDER BY lab_id\`;      // 1,000,000 rows, full scan
statsRouter.route('/labs').get(async (req, res) => {
  const data = await cached(req, 'stats:labs:v1', 10,
    async () => { queries++; return (await pool.query(SQL)).rows; });
  res.set('LabFlow-DB-Queries', String(queries)).json({ data });
});`, { lang: 'javascript', sm: true, hl: [6] }) + flow([
    { t: '1', s: 'GET key in Redis' },
    { t: '2 · hit', s: 'return it', mau: '#2e7d32' },
    { t: '3 · miss', s: 'run the query', mau: '#b85a2b' },
    { t: '4', s: 'SET key EX ttl', mau: '#7a5195' },
  ]) + box('Cache-aside', 'Read the cache; on a miss, load from the database and store it with a TTL (+ up to 10% jitter).', 'lam') },

  { t: 'Hit, miss, and steady load', giua: true, body: two(http(`$ curl … /v2/stats/labs   (twice)
LabFlow-Cache: MISS
LabFlow-DB-Queries: 1
Server-Timing: cache;dur=3.12, db;dur=80.17, total;dur=87.34
LabFlow-Cache: HIT
LabFlow-DB-Queries: 1
Server-Timing: cache;dur=0.56, total;dur=1.34
$ redis-cli -p 6390 TTL stats:labs:v1
11`, { sm: true, wrap: 'any' }), http(`# autocannon -c 10 -d 10, no cache
│ Latency │ 76 ms │ 124 ms │ 669 ms │ 755 ms │
│ Req/Sec │ … │ 42.7 │ …
# with Redis
│ Latency │ 1 ms │ 1 ms │ 7 ms │ 12 ms │
│ Req/Sec │ … │ 4,150.3 │ …`, { sm: true, wrap: 'any' }) + box('~97×', 'The database now sees one query every ~10 s instead of 43 per second.', 'xanh') + box('✗ A key that forgets something', 'Filters, tenant, API version and a shape version (<code class="i">:v1</code>) all belong in the key.', 'do2')) },

  { t: 'The stampede', giua: true, body: two(http(`$ node perf/stampede.mjs        # key deleted, 50 requests at once
## no cache
⇒ CSDL bị hỏi 50 lần · p50 994 ms · max 1661 ms
## Redis cache-aside
⇒ CSDL bị hỏi 32 lần · p50 346 ms · max 783 ms
## + single-flight
⇒ CSDL bị hỏi 1 lần · p50 92 ms · max 97 ms`, { sm: true, wrap: 'any' }) + sql(`if (!inflight.has(key))
  inflight.set(key, fill().finally(() => inflight.delete(key)));
return inflight.get(key);   // everyone waits for ONE load`, { lang: 'javascript', sm: true }),
    box('Why plain caching failed', 'Everyone who arrived before the first load finished missed too: 32 queries (16 on another run).', 'do2') + box('Across instances', 'Single-flight is per process: 4 instances ⇒ up to 4 queries. Use a short lock (<code class="i">SET … NX PX</code>) or refresh before expiry — Redis course 6.3.', 'lam')) },

  { t: 'What the contract must say', to: true, giua: true, body: cards([
    ['Freshness', '“Statistics may be up to 10 s old.” Send Age if clients need to know.'],
    ['Invalidation', 'TTL (bounded staleness) or delete on write (fresher, every write path must remember).'],
    ['Failure', 'The cache is an optimisation: Redis down ⇒ fall back to the database, not 500.'],
  ]) + box('Interview: “what is a cache stampede?”', 'Many requests miss the same key at once and all hit the database. Single-flight, locks or early refresh, TTL jitter.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>1M-row aggregate 80–120 ms; Redis hit 1.3 ms; steady load <b>43 → 4,150 req/s</b></li>
<li>Expiry under 50 concurrent requests: <b>50</b> queries (no cache), <b>16–32</b> (cache-aside), <b>1</b> (single-flight)</li>
<li>Key = everything that changes the answer + a shape version; TTL with jitter</li>
<li>The contract states staleness; the cache fails open to the database</li>
</ul>
${box('Next', 'Lesson 9.3 — a read replica, and the note that vanished.', 'xanh')}` },
]);
