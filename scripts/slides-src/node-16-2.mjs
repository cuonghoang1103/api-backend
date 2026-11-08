/**
 * node-16-2 — Node.js · Chapter 16 · Lesson 16.2 "Where the time really goes: 97% in one line" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, MỘT tập node-16-2.
 * Nguồn: nodejs-16-2-nut-that-that-su. Output THẬT: that/c16/parts-linux (CHÍNH: Node 22 trong container node:22-alpine, cùng mạng Docker với PostgreSQL 17.11 — giống một VPS)
 *   + that/c16/parts (PHỤ: Node trên macOS gọi Postgres qua cổng của Docker Desktop, thêm một chặng máy ảo). express 5.3.0, pg 8.23.1, autocannon -c 20 -d 5, TRUNG VỊ 5 lần.
 *   500.000 ghi chú (c15/seed), container node15-pg đã gỡ.
 * BỔ SUNG ngoài bài web: cùng phép "cắt body trong SQL" đo ở hai môi trường: +8,5 % trong mạng Linux, +26,7 % qua chặng máy ảo của Mac — byte đi đâu quyết định chi phí.
 * Số chương khác lấy theo VIDEO đã khoá (KE-HOACH): Ch7 kết nối 8,36 vs 0,41 ms (20,4×), pool 1/20 = 2.112 / 122 ms, N+1 38,2 ⇒ 6,1 ms (6,3×).
 * Khác web: 1.764 req/s (web 1.954) · DB 97,2 % (web 97,8 %) · left(body) +8,5 % (web +1,3 %) · EXPLAIN 0,039 ms vs app 4,616 ms = 118× (web 0,030 / 5,107 = 170×) ·
 *   pool: đỉnh ở 5 = 1.707 req/s, 25/50 tụt 1.373 (web đỉnh ở 10 = 2.935, 50 = 2.747).
 */
import { lamDeck, two, box, cards, flow, bang, vsd, J, Q, T, TT, thanh, dong, steps, cot } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-16-2', code: 'NODE 16.2', title: 'Where the time really goes: 97% in one line', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (re, t = 'parts-linux') => dong(`c16/${t}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const L = { rps: num(R(/^\[1\] LOAD/), /LOAD: ([\d,]+)/), db: num(R(/database query/), /([\d.]+) ms/), dbp: num(R(/database query/), /([\d.]+)%/), js: num(R(/JS transform/), /([\d.]+) ms/), ser: num(R(/JSON\.stringify/), /([\d.]+) ms/), serp: num(R(/JSON\.stringify/), /([\d.]+)%/), tot: num(R(/TOTAL measured/), /([\d.]+) ms/), free: num(R(/if the JS were FREE/), /~([\d,]+)/) };
const AF = { rps: num(R(/^AFTER/), /AFTER:\s+([\d,]+)/), db: num(R(/^AFTER/), /DB ([\d.]+)/), pct: num(R(/^AFTER/), /\(([\d.]+)%\)/) };
const AFM = { pct: num(R(/^AFTER/, 'parts'), /\(([\d.]+)%\)/), b: num(R(/^BEFORE/, 'parts'), /DB ([\d.]+)/), a: num(R(/^AFTER/, 'parts'), /DB ([\d.]+)/) };
const EX = num(R(/^Limit/), /actual time=[\d.]+\.\.([\d.]+)/);
const POOL = [1, 5, 10, 25, 50].map((m) => { const l = R(new RegExp(`^\\s+${m}\\s+[\\d,]+\\s`)); return { m, rps: num(l, new RegExp(`^\\s+${m}\\s+([\\d,]+)`)), wait: num(l, /ms\s+([\d.]+) ms\s+[\d.]+ ms$/), q: num(l, /([\d.]+) ms$/) }; });
const f = (n) => n.toLocaleString('en-US');

export const slides = lamDeck({ chuong: 'Chapter 16 — Performance', bai: '16.2' }, [
  { cover: true, t: 'Where the time really goes:<br>97% in one line', sub: 'Lesson 16.1 had no database. Real routes have one — and that changes the arithmetic so completely that most JavaScript-level optimisation stops mattering.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Timing the parts of a real route: query, transform, serialise</li>
<li>The obvious fix — and why it barely moved the number</li>
<li>What PostgreSQL says the query costs: ${EX} ms against ${L.db} ms</li>
<li>Splitting the WAIT for a connection from the WORK of the query</li>
<li>Little's Law, the corrected mental model, and what to do — in order</li>
</ul>` + box('Why it matters to you', 'Every route you write talks to a database. Knowing which part of "database time" is the database is the difference between a fix and a wasted week.', 'lam') },

  { t: 'Where these numbers come from', to: true, giua: true, body: flow([{ t: 'autocannon', s: '20 connections', mau: CAM }, { t: 'Node 22 + Express', s: 'container node:22-alpine', mau: NODE }, { t: 'Docker network', s: 'like one VPS', mau: LAM }, { t: 'PostgreSQL 17', s: '500,000 notes', mau: TIM }], { h: 130 }) +
    two(box('Main measurement: inside Linux', 'Node and Postgres on the same Docker network — the shape of a real server.', 'xanh'),
      box('Second measurement: across a VM hop', 'The same program on the Mac host, reaching Postgres through Docker Desktop. One fix behaves very differently there — slide 7.', 'cam')) +
    box('Every timing', 'is the median of 5 runs of 5 seconds, after a 2-second warm-up — the same 500,000 notes as chapter 15.', 'lam') },

  { t: 'Timing the parts', to: true, giua: true, body: J(`const t0 = process.hrtime.bigint();
const rows = (await pool.query(Q1)).rows;                  // 100 newest notes
const t1 = process.hrtime.bigint();
const items = rows.map((r) => ({ id: r.id, title: r.title, excerpt: r.body.slice(0, 100), … }));
const t2 = process.hrtime.bigint();
const body = JSON.stringify({ items });
const t3 = process.hrtime.bigint();                        // db = t1-t0 · js = t2-t1 · ser = t3-t2`, { sm: true, hl: [2] }) +
    TT('c16/parts-linux', 2, 8, 'node parts.mjs inside node:22-alpine · pool max 10 · -c 20 · median of 5 · real', { hl: [3], n: 104, sm: true }) },

  { t: `${L.dbp}% against ${(100 - L.dbp).toFixed(1)}%`, to: true, giua: true, body: thanh([['database query', L.db, DO, `${L.db} ms (${L.dbp}%)`], ['JSON.stringify', L.ser, CAM, `${L.ser} ms`], ['JS transform', L.js, NODE, `${L.js} ms`]], { w: 1100, x0: 260, wMax: 560, h0: 56, chu: 22, ghi: 'average per request · real' }) +
    two(box('Make the JavaScript infinitely fast', `i.e. zero: ${f(L.rps)} → about ${f(L.free)} req/s. That is the CEILING of code-level tuning here: ${((L.free / L.rps - 1) * 100).toFixed(1)}%.`, 'cam'),
      box('So optimising the mapping function', 'is working on the wrong 3%. A faster serialiser, a leaner map, avoiding a spread — all compete for a tenth of a millisecond.', 'do2')) + box('Amdahl\'s law, in one line', 'Speeding up a part can only save what that part costs. Measure the share first (16.6 comes back to this).', 'lam') },

  { t: 'The obvious fix, and its measured result', to: true, giua: true, body: Q(`-- before
SELECT id, author_id, title, body, created_at FROM notes ORDER BY id DESC LIMIT 100;
-- after: truncate in SQL, ~30 KB less crosses the wire
SELECT id, author_id, title, left(body,100) AS body, created_at FROM notes ORDER BY id DESC LIMIT 100;`, { sm: false, hl: [4] }) +
    TT('c16/parts-linux', 10, 12, 'node parts.mjs · [2] inside the Linux network · real', { hl: [3], n: 104, sm: false }) +
    box(`+${AF.pct}% — the model was wrong`, `${L.db} → ${AF.db} ms of "database time". If 30 KB less barely matters, most of those milliseconds are not the data. Time to look inside.`, 'cam') },

  { t: 'Where the bytes travel changes the answer', to: true, giua: true, body: bang(['the same left(body,100) fix', 'DB time per request', 'throughput'], [
    ['Node and Postgres on one Linux network', `${L.db} → ${AF.db} ms`, `+${AF.pct}%`],
    ['Node on the Mac → Docker Desktop VM → Postgres', `${AFM.b} → ${AFM.a} ms`, `+${AFM.pct}%`],
  ], { co: 22, hl: [0] }) + two(box('A virtual-machine hop makes every byte expensive', 'On the Mac, each response crossed Docker Desktop\'s VM boundary: there, cutting 30 KB was worth a quarter of the throughput.', 'cam'),
    box('Measure where you will run', 'A benchmark on your laptop can disagree with the server by a factor of three on the same change. The web lesson measured +1.3% on its machine.', 'lam')) + flow([{ t: 'Node (Mac)', s: 'host process', mau: NODE }, { t: 'Docker Desktop VM', s: 'every byte crosses here', mau: DO }, { t: 'Postgres', s: 'container', mau: TIM }], { h: 110 }) },

  { t: 'What PostgreSQL says it costs', to: true, giua: true, body: TT('c16/parts-linux', 14, 21, 'EXPLAIN (ANALYZE, BUFFERS) · inside Postgres · real', { hl: [3, 9], n: 112, sm: false }) +
    cards([[`${EX} ms of real work`, 'Twelve pages, all already in memory (shared hit=12). The engine is done in tens of microseconds.'], [`${L.db} ms seen by the app`, `${Math.round(L.db / EX)}× more. So ${(100 - (EX / L.db) * 100).toFixed(1)}% of what the app calls "database time" is NOT the database engine.`], ['So where is it?', 'In a line most code never times.']], 3) },

  { t: 'Splitting the WAIT from the WORK', to: true, giua: true, body: J(`const t0 = process.hrtime.bigint();
const client = await pool.connect();          // WAIT: queue for a free connection
const t1 = process.hrtime.bigint();
try { rows = (await client.query(Q1)).rows; }  // WORK: the query itself
finally { client.release(); }`, { sm: false, hl: [2, 4] }) +
    TT('c16/parts-linux', 23, 29, 'node parts.mjs · [4] pool size vs 20 concurrent requests · median of 5 · real', { hl: [3, 6], n: 112, sm: true }) + box('Always 20 concurrent requests', 'Only the pool size changes from row to row.', 'lam') },

  { t: 'Three things fall out of that table', to: true, giua: true, body: cards([
    ['1 · Pool of 1: the wait IS the time', `${POOL[0].wait} ms waiting, ${POOL[0].q} ms querying. The database was never busy — twenty requests queued for one door.`],
    ['2 · The queue does not vanish, it MOVES', `Wait ${POOL[0].wait} → ${POOL[4].wait} ms; query ${POOL[0].q} → ${POOL[4].q} ms. The contention moved from your process into PostgreSQL.`],
    ['3 · More connections can make it worse', `Throughput peaks at pool ${POOL.reduce((a, b) => (b.rps > a.rps ? b : a)).m} (${f(Math.max(...POOL.map((p) => p.rps)))} req/s) and drops to ${f(POOL[4].rps)} at 50.`],
  ], 3) + thanh(POOL.map((p) => [`pool ${p.m}`, p.rps, p.m === 5 ? NODE : p.m >= 25 ? DO : LAM, `${f(p.rps)} req/s`]), { w: 1100, x0: 160, wMax: 600, h0: 40, chu: 20, ghi: 'throughput by pool size · real' }) + box('The web lesson found the same shape', 'peak at 10 on its machine (2,935 → 2,747 at 50). Where the peak sits depends on the cores; that a peak exists does not.', 'lam') },

  { t: "The law behind it: Little's Law", to: true, giua: true, body: box('concurrency = throughput × latency', 'With a fixed service capacity, adding parallel requests cannot raise throughput — it only raises how many are waiting, and so the latency.', 'xanh') +
    flow([{ t: 'database capacity', s: 'fixed by its cores', mau: LAM }, { t: '+ more connections', s: 'more waiting inside it', mau: CAM }, { t: 'same throughput', s: 'or a bit less', mau: DO }, { t: 'higher latency', s: 'for everyone', mau: DO }], { h: 130 }) +
    box('So "just raise max" is not a fix', 'The right pool size is roughly the number of queries the database can REALLY run at once — a small multiple of its CPU count, not a number chosen to look generous.', 'cam') },

  { t: 'The corrected mental model', to: true, giua: true, body: steps([
    '<b>Your queue (the pool)</b> — requests waiting for a connection; measure pool.waitingCount. Time sits here when the pool is too SMALL',
    '<b>The round trip + protocol</b> — serialising the query, sending, receiving, parsing rows: the part pg does and EXPLAIN never sees',
    '<b>PostgreSQL\'s queue</b> — sessions fighting over CPU, buffers, locks: where time moves when the pool is too LARGE',
    `<b>The actual work</b> — ${EX} ms. The only thing EXPLAIN ANALYZE measures, and the smallest part of all`,
  ]) + box('EXPLAIN being fast means the PLAN is good', 'Not that the query is fast. A perfectly planned query can cost milliseconds in production because of everything wrapped around it.', 'cam') },

  { t: 'What to do about it, in order', to: true, giua: true, body: bang(['', 'why'], [
    ['1 · Reduce the number of queries', 'N+1 (chapter 7): 51 queries → 2 took 38.2 → 6.1 ms (6.3×) — no pool tuning makes that up'],
    ['2 · Size the pool CORRECTLY', 'too small = queueing in Node, too large = queueing in Postgres; measure both halves'],
    ['3 · Stop querying altogether', 'a cache (chapter 12): the fastest query is the one that never happens'],
    ['4 · Move work out of the request', 'a queue (chapter 13): the user need not wait for the email'],
    ['5 · Only then the JavaScript', `${(100 - L.dbp).toFixed(1)}% here. Useful, and LAST`],
  ], { co: 21 }) + box('A real trap', 'Timing only pool.query() mixes queueing with querying into one number — and the two respond to OPPOSITE fixes. Time pool.connect() separately, or export pool.waitingCount as a gauge (15.4).', 'do2') },

  { t: 'Reading the two numbers in production', to: true, giua: true, body: two(box('waitingCount rising', 'Requests queue in YOUR process: raise the pool (a little), or reduce queries.', 'cam'), box('waitingCount flat, query time rising', 'The database is the limit: STOP raising the pool; reduce or cache queries.', 'do2')) +
    J(`const waiting = new client.Gauge({ name: 'pg_pool_waiting', help: 'requests waiting for a connection',
  collect() { this.set(pool.waitingCount); } });     // read live from the pool — a gauge that cannot drift`, { sm: true }) +
    box('This is the gauge 15.4 allowed', 'A value read from the system every scrape, never hand-managed with inc/dec.', 'lam') + cards([['pool.totalCount', 'connections open'], ['pool.idleCount', 'open but unused'], ['pool.waitingCount', 'requests queued for one']], 3) },

  { t: 'What this website does', to: true, giua: true, body: cards([
    ['A fresh connection per query', 'Chapter 7 measured 8.36 ms vs 0.41 ms reused — 20.4×. The small-pool end of the curve.'],
    ['Twenty 100 ms queries', '2,112 ms with a pool of 1 vs 122 ms with a pool of 20 — queueing in Node.'],
    ['Twelve clients × pool 10', '120 connections against max_connections 100: "sorry, too many clients already" — the large-pool end.'],
  ], 3) + box('Both failure modes, on the same system, months apart', 'They are the same failure — a queue in the wrong place — and only measuring BOTH halves tells you which one you have.', 'cam') + flow([{ t: 'pool too small', s: 'queue in Node', mau: CAM }, { t: 'pool right', s: 'short waits, busy DB', mau: NODE }, { t: 'pool too large', s: 'queue in Postgres', mau: DO }], { h: 110 }) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A route takes 12 ms. Your timer around pool.query() says 11 ms of it is "database". EXPLAIN ANALYZE says 0.04 ms. The pool has max 2 and 30 concurrent requests. (1) Where is the time? (2) What do you measure next, and what would each result tell you? (3) Your teammate wants to set max to 200. What happens?', '') +
    box('Hint', 'Slides 9, 10, 11 and 14.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) Almost all of it is waiting for one of 2 connections, not the query (0.04 ms). (2) Time pool.connect() separately (or pool.waitingCount): a big wait ⇒ raise the pool modestly or cut queries; a small wait with rising query time ⇒ the database is the limit. (3) The queue moves into PostgreSQL — sessions fight over CPU, throughput stays flat or drops (here 1,707 at 5 vs 1,373 at 25), and you may hit max_connections.', 'xanh')}</div>` },

  { t: 'Lesson 16.2 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['parts of one request', `DB ${L.dbp}% · JS + JSON ${(100 - L.dbp).toFixed(1)}%`, 'JS tuning has a ~3% ceiling here'],
    ['left(body,100) in SQL', `+${AF.pct}% (Linux) · +${AFM.pct}% (across a VM)`, 'measure where you will run'],
    ['EXPLAIN vs the app', `${EX} vs ${L.db} ms`, 'a good plan ≠ a fast query'],
    ['pool 1', `wait ${POOL[0].wait} ms · query ${POOL[0].q} ms`, 'time the wait separately'],
    ['pool 50', `wait ${POOL[4].wait} ms · query ${POOL[4].q} ms · ${f(POOL[4].rps)} req/s`, 'the queue moves, it does not vanish'],
  ], { co: 22 }) + box('Next: 16.3 — compression, and the setting that is hundreds of times slower', 'Trading CPU for bandwidth, measured — and the other lever: keep-alive.', 'lam') },
]);
