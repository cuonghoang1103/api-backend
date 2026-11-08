/**
 * node-12-1 — Node.js · Chapter 12 · Lesson 12.1 "What Redis really is, and where the time goes" (slide EN, đợt 9b — 01/11/2026).
 * MỘT deck, MỘT tập node-12-1 (16 slide).
 *   bốn tính chất (RAM · một luồng · cấu trúc · qua mạng) · phép đo 1 giá một vòng đi-về (thật: PING 0,481 ms; Redis tự làm 0,53 µs = 0,13 %) ·
 *   phép đo 2 pipeline 5 cách (thật: 4.683,7 → 28,4 ms) · auto-pipelining · lô càng to (thật: 1 → 10.000) · MGET (thật: 462,1 vs 0,9 ms) ·
 *   cỡ giá trị (thật: 100 B → 1 MB) · lỗi vòng lặp chậm hơn Postgres (thật: 84,0 / 1,3 / 0,7 ms) · chọn client (thật: 1,4 MB / 4,6 MB / 15 MB) ·
 *   kết nối đúng (ioredis) · website (node-redis 4.7.1, src/config/redis.ts THẬT) · bài tập · tóm tắt.
 * Nguồn: nodejs-12-1-redis-co-ban. Output THẬT: that/c12/{rtt,inside,loop-vs-pg,pkgsize} (Node 22.23.3, ioredis 5.11.1, pg 8.23.1, Redis 7.4.9 + PostgreSQL 17.11
 *   trong Docker `node12-redis` 127.0.0.1:4990 / `node12-pg` 127.0.0.1:4991, macOS — mỗi dòng = TRUNG VỊ 5 lần chạy vì máy đang bận).
 * Khác web: một vòng đi-về 0,481 ms (web 0,204 ms, Redis trong Docker trên macOS đi thêm một chặng máy ảo) ⇒ pipeline nhanh hơn 165× (web 63×) · MGET 510× (web 127×) ·
 *   cỡ 100 B → 10 KB +33 % (web +10 %) · node-redis mới nhất 6.3.1 15 MB (web 6.1.0 14 MB), website chạy node-redis 4.7.1.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-12-1', code: 'NODE 12.1', title: 'What Redis really is, and where the time goes', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c12/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const vi = (x) => String(x);
const P1 = num(R('rtt', /^\[1\]/), /-> ([\d.]+) ms each/);
const S2 = (k) => num(R('rtt', new RegExp(`^\\[${k}\\]`)), /:\s+([\d.]+) ms/);
const LO = [1, 10, 100, 1000, 10000].map((n) => [n, num(R('rtt', new RegExp(`batch\\s+${n} per`)), /:\s+([\d.]+) ms/)]);
const MG = { loop: num(R('rtt', /^\[4\]/), /one by one ([\d.]+) ms/), m: num(R('rtt', /^\[4\]/), /keys ([\d.]+) ms/), x: num(R('rtt', /^\[4\]/), /-> ([\d.]+)x/) };
const SZ = [100, 1024, 10240, 102400, 1048576].map((n) => [n, num(R('rtt', new RegExp(`GET a\\s+${n} byte`)), /: ([\d.]+) ms each/)]);
const IN = { seen: num(R('inside', /seen by Node/), /= (\d+) µs/), ping: num(R('inside', /inside Redis/), /PING ([\d.]+) µs/), set: num(R('inside', /inside Redis/), /SET ([\d.]+) µs/), pct: num(R('inside', /^=>/), /works ([\d.]+)%/) };
const LP = { loop: num(R('loop-vs-pg', /for-loop/), /:\s+([\d.]+) ms/), pg: num(R('loop-vs-pg', /^Postgres/), /:\s+([\d.]+) ms/), mget: num(R('loop-vs-pg', /ONE MGET/), /:\s+([\d.]+) ms/) };
const PK = { io: R('pkgsize', /^ioredis/).match(/([\d.]+M) on disk/)[1], nr4: R('pkgsize', /^redis .*4\.7\.1 —/).match(/([\d.]+M) on disk/)[1], nr: R('pkgsize', /^redis .*latest today/).match(/([\d.]+M) on disk/)[1], nrv: R('pkgsize', /^redis .*latest today/).match(/\) ([\d.]+) —/)[1] };
const X = (a, b) => Math.round(a / b);
const WEB = readFileSync('/Users/admin/Downloads/api-backend/src/config/redis.ts', 'utf8').split('\n');

// one round trip, to scale: the sliver inside Redis
const rttSvg = `<svg data-k="rtt" viewBox="0 0 1100 230" width="1100" height="230" font-family="Arial">
<text x="6" y="30" font-size="23" font-weight="700" fill="#333">one PING round trip, as Node sees it: ${IN.seen} µs</text>
<rect x="6" y="50" width="1088" height="76" rx="10" fill="${LAM}22" stroke="${LAM}" stroke-width="3"/>
<text x="275" y="83" text-anchor="middle" font-size="21" fill="${LAM}">write to the socket · kernel ·</text><text x="275" y="110" text-anchor="middle" font-size="21" fill="${LAM}">VM hop · Redis wakes up</text>
<rect x="548" y="44" width="4" height="88" fill="${DO}"/>
<text x="825" y="83" text-anchor="middle" font-size="21" fill="${LAM}">reply · kernel ·</text><text x="825" y="110" text-anchor="middle" font-size="21" fill="${LAM}">Node wakes up</text>
<line x1="550" y1="138" x2="550" y2="168" stroke="${DO}" stroke-width="3"/>
<text x="550" y="198" text-anchor="middle" font-size="23" font-weight="700" fill="${DO}">the PING itself, inside Redis: ${IN.ping} µs = ${IN.pct}% of the trip</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 12 — Redis: caching, TTL and atomicity', bai: '12.1' }, [
  { cover: true, t: 'What Redis really is,<br>and where the time goes', sub: '"Redis is fast" hides the one fact that decides whether your code is fast: almost none of the time you spend on Redis is spent inside Redis.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The four properties of Redis — and which one costs you the most</li>
<li>The price of one round trip, measured from Node and from inside Redis</li>
<li>Pipelines and MGET: the same work, one or two orders of magnitude faster</li>
<li>The loop that makes Redis slower than PostgreSQL</li>
<li>One shared client per process, connected the right way — and what this site runs</li>
</ul>` + box('Why it matters to you', 'Every later lesson — cache, rate limits, locks, queues — sits on top of this one number. Get the round trips right and Redis is fast; get them wrong and nothing else helps.', 'lam') },

  { t: 'The shape of the thing', to: true, giua: true, body: cards([
    ['🧠 Lives in RAM', 'Reads and writes cost nanoseconds, not a disk seek. In exchange, ALL the data must fit in RAM — and RAM is what you will run out of.'],
    ['☝️ One thread for commands', 'One command at a time, start to finish. Atomicity for free (12.4) — and one slow command freezes every other client (12.6).'],
    ['🧰 Data structures', 'Hashes, sets, sorted sets, bitmaps, streams — not just strings. The right one is worth hundreds of times the RAM (12.3).'],
    ['🌐 Over the network', 'Every command is a round trip over TCP. This is the dominant cost — and the one beginners never see.'],
  ], 2) + box('A server, not a library', 'Your Node process and Redis are two programs. They talk through a socket, even on the same laptop.', 'cam') },

  { t: 'Measurement 1 — the price of one round trip', to: true, giua: true, body: TT('c12/rtt', 3, 5, 'node rtt.mjs · ioredis 5.11.1 → Redis 7.4.9 on localhost · median of 5 runs · real', { hl: [2, 3], n: 104, sm: false }) +
    flow([{ t: 'await redis.ping()', s: 'Node writes to a socket', mau: NODE }, { t: 'kernel + network', s: 'even on localhost', mau: LAM }, { t: 'Redis', s: 'reads, answers', mau: DO }, { t: 'back to Node', s: 'the await resumes', mau: NODE }], { h: 130 }) +
    two(box('PING does nothing', `It is the cheapest command Redis has, and it still costs ${P1} ms — about ${num(R('rtt', /^\[1\]/), /-> ([\d,]+) ops\/s/).toLocaleString('en-US')} per second on a database that advertises hundreds of thousands.`, 'lam'),
      box('Writing 10,000 keys costs the same as pinging 10,000 times', `${S2('2a')} ms for 10,000 SETs, one await each. The work is free; the waiting is everything.`, 'do2')) },

  { t: 'Where the time goes', to: true, giua: true, body: rttSvg + TT('c12/inside', 2, 4, 'node inside.mjs · Redis counts its OWN time per command (INFO commandstats) · real', { hl: [2, 3], n: 104, sm: false }) +
    box('Nothing is broken', `Redis spent ${IN.ping} µs on the PING and ${IN.set} µs on a SET. The other ${IN.seen} µs is the socket, the kernel, waking processes up — on this Mac also a hop into Docker's VM (the web lesson measured 0.204 ms on its machine).`, 'cam') },

  { t: 'Measurement 2 — pipelining', to: true, giua: true, body: J(`const p = redis.pipeline();                 // queue commands locally…
for (let i = 0; i < 10000; i++) p.set(\`k:\${i}\`, 'v');
await p.exec();                              // …send them all, read all replies at once`, { sm: false, hl: [1, 3] }) +
    TT('c12/rtt', 5, 9, 'node rtt.mjs · the same 10,000 SETs, five ways · median of 5 runs · real', { hl: [1, 2], n: 104, sm: false }) +
    box(`${X(S2('2a'), S2('2b'))}× faster for the same work`, `${S2('2a')} ms → ${S2('2b')} ms. Not a micro-optimisation: a different order of magnitude, for three lines of code.`, 'xanh') },

  { t: 'Promise.all, and auto-pipelining', to: true, giua: true, body: J(`const redis = new Redis(process.env.REDIS_URL, {
  enableAutoPipelining: true,   // commands queued in the SAME tick go out in ONE socket write
});
await Promise.all(ids.map((id) => redis.set(\`k:\${id}\`, 'v')));`, { sm: false, hl: [2] }) +
    TT('c12/rtt', 8, 9, 'node rtt.mjs · [2d] vs [2e] · real', { hl: [1, 2], n: 104, sm: false }) +
    two(box('Promise.all alone already helps', `${S2('2a')} → ${S2('2e')} ms: the commands leave without waiting for each other.`, 'lam'),
      box('Auto-pipelining goes further', `${S2('2e')} → ${S2('2d')} ms: everything queued in one event-loop tick becomes one write to the socket. Turn it on by default.`, 'xanh')) },

  { t: 'Is a bigger batch always better?', to: true, giua: true, body: thanh(LO.map(([n, ms]) => [`${n.toLocaleString('en-US')} / pipeline`, ms, n === 1 ? DO : n <= 10 ? CAM : NODE, `${ms.toLocaleString('en-US')} ms`]), { log: true, w: 1100, x0: 250, wMax: 620, h0: 60, chu: 22, ghi: 'time for the same 10,000 SETs · log scale · median of 5 · real' }) +
    two(box('The curve flattens fast', `1 → 100 per batch buys ${X(LO[0][1], LO[2][1])}×. 1,000 → 10,000 buys only ${Math.round((LO[3][1] / LO[4][1] - 1) * 100)}% more.`, 'lam'),
      box('A giant pipeline blocks everyone', 'Redis runs one thing at a time: a 10,000-command batch is a long stretch other clients wait behind. Batch 100–1,000, never "send everything".', 'do2')) },

  { t: 'MGET: a pipeline built into the command', to: true, giua: true, body: TT('c12/rtt', 15, 15, 'node rtt.mjs · [4] 1,000 GET in a loop vs one MGET · median of 5 · real', { hl: [1], n: 104, sm: false }) +
    cards([
      ['MGET', 'many strings: MGET k1 k2 k3 …'],
      ['HMGET', 'many fields of one hash'],
      ['SMEMBERS · ZRANGE', 'a whole set, a slice of a sorted set'],
      ['…one round trip each', `${MG.loop} ms → ${MG.m} ms here: ${Math.round(MG.x)}× for one word.`],
    ], 4) + box('The habit to build', 'Whenever you are about to loop over a list of ids and GET each one, look for the plural command first.', 'xanh') },

  { t: 'Does the size of the value matter?', to: true, giua: true, body: thanh(SZ.map(([n, ms]) => [n >= 1048576 ? '1 MB' : n >= 1024 ? `${n / 1024} KB` : `${n} B`, ms, n <= 10240 ? NODE : n <= 102400 ? CAM : DO, `${ms} ms per GET`]), { w: 1100, x0: 130, wMax: 640, h0: 60, chu: 22, ghi: 'one GET, by value size · median of 5 · real' }) +
    two(box('Up to ~10 KB: the round trip still rules', `100 B → 10 KB is 100× the data for ${Math.round((SZ[2][1] / SZ[0][1] - 1) * 100)}% more time.`, 'lam'),
      box('So shape your keys', `ONE 10 KB object (${SZ[2][1]} ms) is far cheaper than a hundred 100-byte objects fetched one by one (~${(SZ[0][1] * 100).toFixed(0)} ms). Group related data under one key.`, 'xanh')) },

  { t: 'The bug that makes Redis slower than Postgres', to: true, giua: true, body: TT('c12/loop-vs-pg', 2, 5, 'node loop-vs-pg.mjs · 200 user ids, the cache is warm · median of 5 · real', { hl: [1, 3], n: 104, sm: false }) +
    two(J(`// ✗ 200 round trips
for (const id of ids) {
  users.push(await redis.get(\`user:\${id}\`));
}`, { sm: false, hl: [3] }), J(`// ✓ one round trip
const users = await redis.mget(
  ids.map((id) => \`user:\${id}\`),
);`, { sm: false, hl: [2] })) +
    box('"Redis is slow here" — no', `The loop pays ${LP.loop} ms; one Postgres query with = ANY($1) returns the same 200 rows in ${LP.pg} ms. People rip Redis out. The problem was never Redis — it was the loop: MGET does it in ${LP.mget} ms.`, 'do2') },

  { t: 'Choosing a client library', to: true, giua: true, body: bang(['', 'ioredis 5.11.1', `node-redis (package "redis")`], [
    ['on disk (fresh npm install, real)', PK.io, `${PK.nr4} (4.7.1) · ${PK.nr} (${PK.nrv}, latest)`],
    ['API', 'Promises, enableAutoPipelining', 'Promises, RESP3 by default in v5+'],
    ['extras', 'Cluster + Sentinel, Lua via defineCommand', 'official client; typed commands for Search/JSON/…'],
    ['in this course', 'the measurements (auto-pipelining in one line)', 'the production excerpts — it is what this site runs'],
  ], { co: 22 }) + box('Both are good', 'Pick one per project and use it everywhere. The rules in this chapter — round trips, pipelines, one client per process — are the same for both.', 'lam') },

  { t: 'Connecting the right way from Node', to: true, giua: true, body: J(`let client = null;                       // src/config/redis.js — ONE per process
export function getRedis() {
  if (client) return client;
  client = new Redis({
    host: process.env.REDIS_HOST ?? '127.0.0.1', port: Number(process.env.REDIS_PORT ?? 6379),
    enableAutoPipelining: true,          // measurement [2d]
    maxRetriesPerRequest: 2,             // fail fast instead of hanging a request
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });
  client.on('error', (err) => console.error('redis error', err.message));
  return client;
}`, { sm: false, hl: [3, 7, 10] }) + cards([
    ['One client per process', 'Not per request: Redis multiplexes thousands of commands on one socket.'],
    ['Bounded retries', 'Infinite retries turn a Redis hiccup into hanging requests.'],
    ['An error listener', 'An unheard error event crashes the process (lesson 3.4).'],
  ], 3) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: J([20, 21, 23, 25, 26, 27, 31, 32, '      // … host, port, password, database });', 47, 48, 51, 53, 54].map((n) => typeof n === 'string' ? n : WEB[n - 1]).join('\n'), { sm: false, hl: [3, 7, 13] }) +
    box('src/config/redis.ts of this website (node-redis 4.7.1), real lines 20–54', 'A connect in flight returns the SAME promise: twenty parallel first requests open ONE connection. Reconnects back off 50 ms per retry, never past 2 s.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A route shows a user\'s 50 most recent notes. Each note is cached in Redis as note:&lt;id&gt; (JSON). The code loops over the 50 ids and awaits redis.get for each, then fetches the 50 authors the same way. With the round trip measured in this lesson, how long does it take — and how do you make it ONE or TWO round trips?', '') +
    `<div data-k="dapan">${box('Answer', `100 sequential round trips × ${P1} ms ≈ ${(P1 * 100).toFixed(0)} ms, before any real work. Fix: one MGET for the 50 notes, then one MGET for the distinct author ids (2 round trips ≈ 1 ms). Or, if the ids are known up front, one pipeline with both. And check whether one Postgres query with = ANY($1) is simply enough.`, 'xanh')}</div>` },

  { t: 'Where the time goes — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['one round trip (PING)', `${P1} ms — Redis itself: ${IN.ping} µs`, 'count round trips, not commands'],
    ['10,000 SET: awaits → pipeline', `${S2('2a')} → ${S2('2b')} ms`, 'pipeline / auto-pipelining'],
    ['batch size 1,000 → 10,000', `${LO[3][1]} → ${LO[4][1]} ms`, 'batch 100–1,000'],
    ['1,000 GET → 1 MGET', `${MG.loop} → ${MG.m} ms`, 'use the plural command'],
    ['200 GETs in a loop vs Postgres', `${LP.loop} vs ${LP.pg} ms`, 'the loop is the bug'],
  ], { co: 22 }) + box('Next: 12.2 — cache-aside', 'The pattern every Redis user writes first, measured on 500,000 notes — and the four ways it betrays you.', 'lam') },
]);
