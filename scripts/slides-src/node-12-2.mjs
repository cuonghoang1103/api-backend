/**
 * node-12-2 — Node.js · Chapter 12 · Lesson 12.2 "Cache-aside: the pattern and its four betrayals" (slide EN, đợt 9b — 01/11/2026).
 * MỘT deck, HAI tập: node-12-2 (slide 1–12) · node-12-2-2 (slide 13–25).
 *   A: ví dụ đời thường (sổ tay cạnh điện thoại) · dữ liệu 500.000 ghi chú · khuôn bốn dòng · phản chủ 0 (thật: 58,34 ms → 0,41 ms, 143,5×) · cache cái TỔNG HỢP (trang chủ 0,65 ms) ·
 *      0,41 ms đi đâu (GET 0,39 · parse 3,4 µs) · phản chủ 1 payload to (thật: 1.602 KB, 11,81 vs 10,46 ms) · phản chủ 2 tỉ lệ trúng (thật: 61,22 / 30,92 / 6,73 / 0,93 / 0,38 ms) · bảng phần A
 *   B: phản chủ 3 TTL (thật: 2 → 1 → -2, -1) · SET xoá TTL (thật: 100 → -1, KEEPTTL 100) · phản chủ 4 stampede (thật: 200 truy vấn 4.178,0 ms) · single-flight (1 truy vấn 69,1 ms) ·
 *      khoá SET NX (1 truy vấn 80,6 ms) · jitter (thật: 1 giây vs 26 giây khác nhau) · tổng kết stampede · API Design 9.2 (43 → 4.150 req/s, không đo lại) · làm mới cache · cache cả lần trượt ·
 *      website · bốn chỗ phản bội · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-12-2-cache-aside. Output THẬT: that/c12/{seed,cache,ttl,stampede} (Node 22.23.3, ioredis 5.11.1, pg 8.23.1, Redis 7.4.9 + PostgreSQL 17.11 Docker node12-*).
 * Khác web: bảng xếp hạng 58,34 ms (web 48,04) · trúng 0,41 ms 143,5× (web 120×) · payload to 1.602 KB, cache chậm hơn 13 % (web 1.192 KB, 18 %) · 90 % trúng 6,73 ms = 7,2× tệ hơn 99 % (web 12×) ·
 *   stampede 4.178,0 / 69,1 / 80,6 / 2,9 ms (web 6.064,6 / 65,3 / 99,1 / 14,9) · jitter 61–89 s (web 60–89 s).
 */
import { lamDeck, two, box, cards, flow, bang, vsd, J, Q, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-12-2', code: 'NODE 12.2', title: 'Cache-aside: the pattern and its four betrayals', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c12/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const C1 = { heavy: num(R('cache', /^\[1\]/), /rows\): ([\d.]+) ms/), home: num(R('cache', /^\[1\]/), /20 newest: ([\d.]+) ms/), bytes: num(R('cache', /JSON payload/), /: (\d+) bytes/) };
const C2 = { hit: num(R('cache', /^\[2\]/), /parse: ([\d.]+) ms/), x: num(R('cache', /^\[2\]/), /-> ([\d.]+)x/) };
const C3 = { get: num(R('cache', /^\[3\]/), /raw GET ([\d.]+) ms/), parse: num(R('cache', /^\[3\]/), /parse ([\d.]+) ms/) };
const C4 = { kb: num(R('cache', /^\[4\]/), /payload (\d+) KB/), get: num(R('cache', /^\[4\]/), /GET ([\d.]+) ms/), parse: num(R('cache', /^\[4\]/), /parse ([\d.]+) ms/), tot: num(R('cache', /^\[4\]/), /= ([\d.]+) ms/), db: num(R('cache', /straight from Postgres/), /: ([\d.]+) ms/), x: num(R('cache', /straight from Postgres/), /is ([\d.]+)x/) };
const HR = [0, 50, 90, 99, 100].map((p) => [p, num(R('cache', new RegExp(`hit rate\\s+${p}%`)), /->\s+([\d.]+) ms per/)]);
const ST = ['1 plain', '2 single', '3 lock', '4 plain, cache WARM'].map((k) => { const l = R('stampede', new RegExp(`^\\[${k}`)); return { q: num(l, /\]\s+(\d+) Postgres/), ms: num(l, /\|\s+([\d.]+) ms for/) }; });
const JT = { a: num(R('ttl', /fixed/), /-> (\d+) distinct/), b: num(R('ttl', /jitter:/), /-> (\d+) distinct/), lo: num(R('ttl', /jitter:/), /between (\d+)/), hi: num(R('ttl', /jitter:/), /and (\d+) s/) };
const pct = (a, b) => Math.round((a / b - 1) * 100);

const giaySvg = `<svg data-k="sotay" viewBox="0 0 1100 220" width="1100" height="220" font-family="Arial">
<rect x="10" y="20" width="250" height="170" rx="16" fill="${CAM}18" stroke="${CAM}" stroke-width="3"/><text x="135" y="70" text-anchor="middle" font-size="44">🧑‍💼</text><text x="135" y="120" text-anchor="middle" font-size="22" font-weight="700" fill="${CAM}">you, at the desk</text><text x="135" y="152" text-anchor="middle" font-size="19" fill="#555">(your Node process)</text>
<rect x="420" y="20" width="260" height="170" rx="16" fill="${NODE}14" stroke="${NODE}" stroke-width="3"/><text x="550" y="70" text-anchor="middle" font-size="44">📒</text><text x="550" y="120" text-anchor="middle" font-size="22" font-weight="700" fill="${NODE}">a notebook</text><text x="550" y="152" text-anchor="middle" font-size="19" fill="#555">answer + "valid until" (Redis)</text>
<rect x="840" y="20" width="250" height="170" rx="16" fill="${LAM}14" stroke="${LAM}" stroke-width="3"/><text x="965" y="70" text-anchor="middle" font-size="44">🏢</text><text x="965" y="120" text-anchor="middle" font-size="22" font-weight="700" fill="${LAM}">the slow office</text><text x="965" y="152" text-anchor="middle" font-size="19" fill="#555">(PostgreSQL)</text>
<line x1="265" y1="105" x2="410" y2="105" stroke="#b85a2b" stroke-width="3"/><text x="338" y="92" text-anchor="middle" font-size="19" fill="#b85a2b">1 look</text>
<line x1="685" y1="105" x2="830" y2="105" stroke="#b85a2b" stroke-width="3" stroke-dasharray="8 6"/><text x="758" y="92" text-anchor="middle" font-size="19" fill="#b85a2b">2 only if not there</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 12 — Redis: caching, TTL and atomicity', bai: '12.2' }, [
  { cover: true, t: 'Cache-aside:<br>the pattern and<br>its four betrayals', sub: 'Measured on a real PostgreSQL with 500,000 notes: where the cache wins over 140×, where it LOSES, and the stampede that turns correct code into a denial of service.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The cache-aside pattern in four lines — and what each line promises</li>
<li>When a cache wins, and the payload where it LOSES to the database</li>
<li>Why a 90% hit rate can still be slow</li>
<li>TTL, and the plain SET that silently deletes it</li>
<li>The stampede — and three fixes: single-flight, a lock, jitter</li>
<li>Invalidation: the three honest strategies</li>
</ul>` + box('Why it matters to you', 'Every product grows a slow aggregate query. The cache in front of it is the first Redis code you will write — and every way it fails is visible in your own four lines.', 'lam') },

  { t: 'An everyday picture: the notebook by the phone', to: true, giua: true, body: giaySvg + two(box('The habit', 'A colleague asks for this month\'s sales total. You call the slow office once, write the answer in a notebook with "valid until Friday", and answer everyone else from the notebook.', 'lam'),
    box('What can go wrong', 'The notebook is too thick to read quickly · you forget to cross out a stale number · the date is never written · and on Friday morning everybody calls the office at once.', 'do2')) +
    box('That is cache-aside', 'Your code owns the notebook. The database never knows it exists.', 'xanh') },

  { t: 'The setup: 500,000 notes, one expensive query', to: true, giua: true, body: TT('c12/seed', 2, 3, 'node seed.mjs · PostgreSQL 17.11 in Docker, same shape as the chapter 7 Notes API · real', { hl: [1], n: 104, sm: false }) +
    Q(`-- the leaderboard: aggregates EVERY row, then sorts
SELECT u.id, u.name, SUM(n.views)::int AS total
FROM notes n JOIN users u ON u.id = n.user_id
GROUP BY u.id, u.name
ORDER BY total DESC LIMIT 20;`, { sm: false, hl: [4, 5] }) +
    box('The kind of query every product grows', 'A ranking, a dashboard total, a "trending" list: it reads half a million rows to produce twenty. That is what a cache is for.', 'cam') },

  { t: 'The pattern, in four lines', to: true, giua: true, body: J(`async function getLeaderboard() {
  const hit = await redis.get('lb:top20');                        // 1. ask the cache
  if (hit !== null) return JSON.parse(hit);                       // 2. hit → done
  const rows = await db.query(SQL_HEAVY);                         // 3. miss → ask the source
  await redis.set('lb:top20', JSON.stringify(rows), 'EX', 60);    // 4. write back, WITH an expiry
  return rows;
}`, { sm: false, hl: [2, 3, 4, 5] }) +
    flow([{ t: 'GET lb:top20', s: 'ask Redis', mau: NODE }, { t: 'hit?', s: 'yes → return', mau: NODE }, { t: 'no → Postgres', s: 'the slow query', mau: LAM }, { t: 'SET … EX 60', s: 'for the next one', mau: CAM }], { h: 130 }) +
    box('Cache-aside = the application owns the cache', 'Read-through, write-through and write-behind hide the cache behind a library. Learn cache-aside first: every failure is visible in code you wrote.', 'lam') },

  { t: 'Betrayal #0 — none: the case where it works', to: true, giua: true, body: TT('c12/cache', 2, 4, 'node cache.mjs · median of 5 runs · real', { hl: [1, 3], n: 104, sm: false }) +
    thanh([['Postgres, GROUP BY 500k', C1.heavy, LAM, `${C1.heavy} ms`], ['Redis GET + JSON.parse', C2.hit, NODE, `${C2.hit} ms`]], { w: 1100, x0: 330, wMax: 560, h0: 60, chu: 22, ghi: 'the same 20-row leaderboard · real' }) +
    box(`${C2.x}× faster`, `${C1.heavy} ms → ${C2.hit} ms for a ${C1.bytes}-byte answer that took half a million rows to compute.`, 'xanh') },

  { t: 'Cache what is AGGREGATED, not what is INDEXED', to: true, giua: true, body: TT('c12/cache', 2, 2, 'node cache.mjs · [1] the second number · real', { hl: [1], n: 104, sm: false }) +
    two(box('The home page is already fast', `"20 newest notes" takes ${C1.home} ms: lesson 7.5 put an index on created_at. Caching it would buy about ${(C1.home - C2.hit).toFixed(2)} ms — and give you an invalidation bug for free.`, 'do2'),
      box('The leaderboard is not', `No index can avoid reading every row to SUM them: ${C1.heavy} ms. Aggregations are what a cache is for.`, 'xanh')) +
    box('The rule', 'Before adding a cache, ask: can an index make the source fast? An index has no invalidation story at all.', 'lam') },

  { t: `Where do the ${C2.hit} ms go?`, to: true, giua: true, body: TT('c12/cache', 5, 5, 'node cache.mjs · [3] · median of 5 · real', { hl: [1], n: 104, sm: false }) +
    thanh([['raw GET (round trip)', C3.get, LAM, `${C3.get} ms`], ['JSON.parse', C3.parse, NODE, `${(C3.parse * 1000).toFixed(1)} µs`]], { w: 1100, x0: 300, wMax: 600, h0: 60, chu: 22, ghi: 'one cache hit, split in two · real' }) +
    two(box('Almost all of it is lesson 12.1', 'The round trip to Redis. The work inside Redis and in JSON is a rounding error at this size.', 'lam'),
      box('So the cache hit costs one round trip', 'Which is why the next betrayal — a BIG payload — changes the picture completely.', 'cam')) },

  { t: 'Betrayal #1 — a big payload, where the cache LOSES', to: true, giua: true, body: TT('c12/cache', 6, 7, 'node cache.mjs · [4] the 5,000 newest notes WITH their body · median of 5 · real', { hl: [1, 2], n: 104, sm: false }) +
    thanh([['from Postgres', C4.db, LAM, `${C4.db} ms`], ['from Redis + parse', C4.tot, DO, `${C4.tot} ms (GET ${C4.get} + parse ${C4.parse})`]], { w: 1100, x0: 250, wMax: 470, h0: 60, chu: 22, ghi: `the same ${C4.kb} KB of rows · real` }) +
    box(`The cache made it ${pct(C4.tot, C4.db)}% slower`, 'Postgres is not slow at streaming rows out; it is slow at aggregating them. Once transfer and JSON.parse dominate, the cache is just a second network hop with extra steps.', 'do2') },

  { t: 'Cache what is expensive to COMPUTE, not what is merely BIG', to: true, giua: true, body: vsd(`<p>Cache a <b>1.6 MB list</b> that Postgres returns in ${C4.db} ms.</p><p>You pay the transfer twice (Postgres → Node → Redis) and a ${C4.parse} ms JSON.parse on every hit — and still lose.</p>`,
    `<p>Cache a <b>${C1.bytes}-byte leaderboard</b> that takes ${C1.heavy} ms to build.</p><p>Small to move, expensive to recompute: a perfect cache entry.</p>`, '✗ Big but cheap', '✓ Small but expensive') +
    cards([['Measure both sides', 'Time the source AND the hit, with the real payload.'], ['Watch the size', 'Up to ~10 KB the round trip rules (12.1). Past ~100 KB, bytes and parsing take over.'], ['Shape the entry', 'Cache the page the user sees, not the whole table.']], 3) },

  { t: 'Betrayal #2 — the hit rate is not linear', to: true, giua: true, body: TT('c12/cache', 8, 12, 'node cache.mjs · [5] 300 requests at a fixed hit rate · a miss runs the leaderboard query · real', { hl: [3, 4], n: 104, sm: false }) +
    thanh(HR.map(([p, ms]) => [`${p}% hits`, ms, p >= 99 ? NODE : p >= 90 ? CAM : DO, `${ms} ms / request`]), { w: 1100, x0: 200, wMax: 620, h0: 50, chu: 21, ghi: 'average time per request · real' }) },

  { t: 'Why 90% is not "almost there"', to: true, giua: true, body: two(box('The arithmetic', `At 90%, one request in ten still pays the full ${C1.heavy} ms. That one request dominates the average: ${HR[2][1]} ms, ${(HR[2][1] / HR[3][1]).toFixed(1)}× worse than 99% (${HR[3][1]} ms).`, 'do2'),
    box('What to alert on', 'Misses per second — that is the load your database feels. A percentage hides it: 90% of 10 req/s and 90% of 10,000 req/s are very different nights.', 'xanh')) +
    bang(['part A', 'measured here', 'the rule'], [
      ['#0 small aggregate', `${C1.heavy} → ${C2.hit} ms`, 'cache what is aggregated'],
      ['indexed query', `${C1.home} ms already`, 'an index beats a cache'],
      [`#1 ${C4.kb} KB payload`, `cache ${C4.tot} vs Postgres ${C4.db} ms`, 'not what is merely big'],
      ['#2 hit rate 90% vs 99%', `${HR[2][1]} vs ${HR[3][1]} ms`, 'alert on misses/second'],
    ], { co: 21 }) },

  // ───────────── phần B ─────────────
  { t: 'Betrayal #3 — the TTL', to: true, giua: true, body: TT('c12/ttl', 2, 6, 'node ttl.mjs · SET greeting hello EX 2 · real', { hl: [4, 5], n: 104, sm: false }) +
    cards([['TTL = seconds left', 'Time To Live: Redis deletes the key when it reaches 0.'], ['-2', 'the key does not exist (gone, or never was)'], ['-1', 'the key exists and NEVER expires — immortal']], 3) +
    box('Learn the two negatives', '-1 is exactly how a cache turns into a leak: entries nobody will ever read again, kept forever.', 'cam') },

  { t: 'The plain SET that silently deletes the TTL', to: true, giua: true, body: TT('c12/ttl', 7, 9, 'node ttl.mjs · [2] overwrite a key that has a TTL · real', { hl: [2], n: 104, sm: false }) +
    vsd(J(`// the refresh path that forgot EX
await redis.set(key, json);`, { sm: false }), J(`// update the value, keep the expiry
await redis.set(key, json, 'KEEPTTL');
// or say it again: 'EX', 60`, { sm: false }), '✗ TTL 100 → -1', '✓ TTL 100 → 100') +
    box('One forgetful branch is enough', 'Every SET without EX on an existing key removes its expiry. Redis slowly fills with immortal stale entries — until maxmemory (lesson 12.6).', 'do2') },

  { t: 'Betrayal #4 — the stampede', to: true, giua: true, body: TT('c12/stampede', 2, 3, 'node stampede.mjs · 200 concurrent requests the moment the key expired · Postgres pool of 10 · real', { hl: [2], n: 104, sm: false }) +
    two(box('200 identical expensive queries', `Every request misses, every one asks Postgres, every one writes the same value back: ${ST[0].q} queries, ${ST[0].ms.toLocaleString('en-US')} ms. And the data is right — the code is CORRECT.`, 'do2'),
      box('Correct, and a denial of service you wrote', `The same code with a warm cache: ${ST[3].q} queries, ${ST[3].ms} ms. Latency now depends on a coin flip: was the key alive?`, 'cam')) +
    TT('c12/stampede', 6, 6, 'the same 200 requests, cache warm · real', { hl: [1], n: 104, sm: false }) },

  { t: 'Fix A — single-flight (inside one process)', to: true, giua: true, body: J(`const inflight = new Map();
async function getLeaderboard() {
  const hit = await redis.get(KEY);
  if (hit !== null) return JSON.parse(hit);
  if (inflight.has(KEY)) return inflight.get(KEY);     // someone is loading: join them
  const p = (async () => {
    const rows = await db.query(SQL_HEAVY);
    await redis.set(KEY, JSON.stringify(rows), 'EX', 60);
    return rows;
  })().finally(() => inflight.delete(KEY));
  inflight.set(KEY, p);
  return p;
}`, { sm: false, hl: [5, 11] }) + TT('c12/stampede', 4, 4, 'node stampede.mjs · [2] · no race: nothing runs between inflight.has and inflight.set · per PROCESS · real', { hl: [1], n: 104, sm: false }) },

  { t: 'Fix B — a lock in Redis (one loader for the cluster)', to: true, giua: true, body: J(`const got = await redis.set(\`\${KEY}:lock\`, '1', 'PX', 5000, 'NX');   // only ONE caller gets OK
if (got) {
  try { /* load from Postgres, write the cache */ }
  finally { await redis.del(\`\${KEY}:lock\`); }      // ⚠ lesson 12.4: this DEL is not safe
} else {
  await sleep(10);                                 // lost: wait a little, read the cache again
}`, { sm: false, hl: [1, 4] }) + TT('c12/stampede', 5, 5, 'node stampede.mjs · [3] · real', { hl: [1], n: 104, sm: false }) +
    two(box('When one per process is still too many', 'A 10-second report, a paid third-party API: exactly ONE process in the whole cluster should do it.', 'lam'),
      box(`Dearer: ${ST[2].ms} vs ${ST[1].ms} ms`, 'The losers poll the cache until the winner finishes. And the plain DEL can delete someone else\'s lock — lesson 12.4.', 'cam')) },

  { t: 'Fix C — jitter, so keys do not die together', to: true, giua: true, body: TT('c12/ttl', 10, 12, 'node ttl.mjs · [3] 50 caches warmed in the same second · real', { hl: [2, 3], n: 104, sm: false }) +
    J(`await redis.set(key, json, 'EX', 60 + Math.floor(Math.random() * 30));   // 60–89 s`, { sm: false, hl: [1] }) +
    two(box('A synchronised stampede', `A deploy warms 50 caches in one second with the same TTL ⇒ 60 s later all 50 expire in ${JT.a} second — a stampede across many DIFFERENT keys, which a per-key lock cannot stop.`, 'do2'),
      box('Costs nothing', `With 0–30 s of jitter the expiries spread over ${JT.b} distinct seconds (${JT.lo}–${JT.hi} s). One line removes a whole family of bugs.`, 'xanh')) },

  { t: 'The stampede, in one picture', to: true, giua: true, body: thanh([
    ['plain, cache empty', ST[0].ms, DO, `${ST[0].q} queries · ${ST[0].ms.toLocaleString('en-US')} ms`],
    ['single-flight', ST[1].ms, NODE, `${ST[1].q} query · ${ST[1].ms} ms`],
    ['lock SET NX', ST[2].ms, CAM, `${ST[2].q} query · ${ST[2].ms} ms`],
    ['plain, cache warm', ST[3].ms, LAM, `${ST[3].q} queries · ${ST[3].ms} ms`],
  ], { w: 1100, x0: 250, wMax: 480, h0: 66, chu: 22, log: true, ghi: '200 concurrent requests · log scale · real' }) +
    box('API Design 9.2 measured the same under load', 'Under load (autocannon, a 1,000,000-row aggregate): 43 → 4,150 requests/s with the cache. 50 requests at the moment of expiry: 50 queries with no cache, still 32 with a plain cache, 1 with single-flight. Not re-measured here.', 'lam') },

  { t: 'Invalidation: the part nobody likes', to: true, giua: true, body: cards([
    ['TTL only', '"Up to 60 s stale is fine." Simplest: no invalidation code, no bugs. Right for leaderboards, trending lists, counts.'],
    ['Delete on write', 'DEL the key in the same code path that changes the data. Right for user profiles. The bug is always the write path you forgot.'],
    ['Versioned keys', 'note:42:v7 — bump the version and old keys become unreachable and expire. No delete, no race; costs RAM until they expire.'],
  ], 3) + flow([{ t: 'UPDATE notes …', s: 'the write path', mau: LAM }, { t: 'DEL note:42', s: 'delete on write', mau: CAM }, { t: 'next GET misses', s: 'reloads fresh data', mau: NODE }], { h: 120 }) + two(box('Prefer TTL', 'Reach for delete-on-write only when a stale read is visible AND embarrassing.', 'xanh'),
    box('Never update the cached value in place', 'Two concurrent writers interleave and leave a value that never existed in the database.', 'do2')) },

  { t: 'Forgetting to cache the miss', to: true, giua: true, body: vsd(J(`const hit = await redis.get(k);
if (!hit) {        // '' is a miss too!
  const u = await db.findUser(id);
  if (u) await redis.set(k, JSON.stringify(u),
    'EX', 300);
  return u;        // null: not cached
}`, { sm: false, hl: [2, 4] }), J(`const hit = await redis.get(k);
if (hit !== null) return JSON.parse(hit);
const u = await db.findUser(id);
await redis.set(k, JSON.stringify(u),
  'EX', u ? 300 : 30);  // cache the miss
return u;`, { sm: false, hl: [2, 5] }), '✗ every unknown id hits the DB', '✓ unknown ids are cached too') +
    box('The cache becomes a pipe', 'An attacker asking random ids that do not exist goes straight through to your database, forever. Cache "null" with a short TTL — and test hit !== null, never if (!hit).', 'cam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: two(box('What the production Redis holds', 'The web lesson reports 26 keys in 1.23 MB with maxmemory 256M and keyspace_hits:165 / keyspace_misses:20 (89.2%). Almost none of it is a cached query: they are rate-limit and quota counters (rl:general:&lt;ip&gt;, quota:&lt;userId&gt;:month:…).', 'lam'),
    box('A deliberate admission', 'The expensive reads were made fast by INDEXES in chapter 7 — one turned 28 ms into 0.129 ms — and an index has no invalidation story at all. Redis earns its place for counters shared by processes: lesson 12.4.', 'xanh')) +
    flow([{ t: '1 read', s: 'cache, then source', mau: NODE }, { t: '2 big payload', s: 'slower than the DB', mau: DO }, { t: '3 forgotten write', s: 'stale until TTL', mau: CAM }, { t: '4 same TTLs', s: 'expire together', mau: DO }], { h: 130 }) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'GET /stats/popular-tags runs an aggregate over all notes (~60 ms). Traffic: 300 req/s, steady; deploys warm all caches at once. A product manager says "stale for a minute is fine". Write getPopularTags() with cache-aside, and say which of the four betrayals you defended against, and how.', '') +
    `<div data-k="dapan">${box('Answer', 'GET → if (hit !== null) return; miss → single-flight (a Map of in-flight promises) around one SELECT; SET key json EX 60 + random 0–30 (jitter). TTL only, no delete-on-write — the PM accepted 60 s. Payload is a few KB, so caching wins (#1). Alert on misses/second, not on the hit % (#2). The SET always carries EX (#3). Single-flight + jitter stop the stampede (#4); a Redis lock only if one load per process is still too many.', 'xanh')}</div>` },

  { t: 'Cache-aside — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['a hit vs the aggregate', `${C2.hit} vs ${C1.heavy} ms`, 'cache what is expensive to compute'],
    [`a ${C4.kb} KB payload`, `${C4.tot} vs ${C4.db} ms`, 'not what is merely big'],
    ['hit rate 90% vs 99%', `${HR[2][1]} vs ${HR[3][1]} ms`, 'alert on misses/second'],
    ['SET without EX', 'TTL 100 → -1', 'EX every time, or KEEPTTL'],
    ['200 requests, key just expired', `${ST[0].q} → ${ST[1].q} query`, 'single-flight, lock, jitter'],
  ], { co: 22 }) + box('Next: 12.3 — data structures', 'The same 100,000 sessions stored three ways, the encoding cliff where one more field costs several times the RAM, and a counter hundreds of times smaller than a Set.', 'lam') },
]);
