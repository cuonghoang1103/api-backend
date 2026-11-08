/**
 * node-12-6 — Node.js · Chapter 12 · Lesson 12.6 "Running Redis: the commands that freeze everything" (slide EN, đợt 9b — 01/11/2026).
 * MỘT deck, HAI tập: node-12-6 (slide 1–13: KEYS, SCAN, DEL, UNLINK, maxmemory ba chính sách, bảng) · node-12-6-2 (slide 14–22).
 *   A: ví dụ đời thường (một quầy, một khách chậm) · một triệu khoá (thật: 70,1 MB) · KEYS (thật: 431,4 ms, PING người khác tệ nhất 231,87 ms) · SCAN (thật: 1.140,9 ms, tệ nhất 5,31 ms) ·
 *      cả họ lệnh không giới hạn · DEL vs UNLINK (thật: 208,76 ms / tệ nhất 207,41 ms vs 0,54 / 0,54 ms) · FLUSHALL ASYNC · bảng phần A
 *   B: maxmemory noeviction (thật: ghi thêm 243.241 khoá rồi OOM, đọc vẫn chạy) · allkeys-lru (thật: 50.000 khoá mới 0 lỗi, DBSIZE 1.243.226 → 1.165.087, evicted 128.140) ·
 *      volatile-lru không TTL (thật: OOM) · bảng chính sách · persistence (thật: khởi động lại ⇒ không lưu 1000 → 0, AOF everysec 1000 → 1000) · một câu hỏi ·
 *      số cần theo dõi (thật: SLOWLOG keys 104.739 µs, hits 2.416 / misses 2.584 sau khi bị trục xuất, phân mảnh 1,32) · bảo mật · website · bốn ý · bài tập · tóm tắt chương 12
 * Nguồn: nodejs-12-6-van-hanh-production. Output THẬT: that/c12/{ops,persist} (Node 22.23.3, ioredis 5.11.1, Redis 7.4.9 Docker node12-redis; persist dùng hai container node12-nopersist/node12-aof, đã gỡ).
 * Khác web: 1.000.000 khoá 70,1 MB (web 93,4) · KEYS 431,4 ms / tệ nhất 231,87 (web 343,86 / 126,96) · SCAN 1.140,9 / 5,31 (web 857,41 / 6,87) · DEL 208,76 / 207,41 (web 205,50 / 205,30) ·
 *   UNLINK 0,54 (web 0,37) · noeviction 243.241 khoá (web 1.873) · evicted 128.140 (web 162.616) · SLOWLOG 104.739 µs (web 21.980) · tỉ lệ trúng 48 % vì bị trục xuất (web 86,6 %) · phân mảnh 1,32 (web 4,41).
 */
import { lamDeck, two, box, cards, flow, bang, vsd, J, T, TT, thanh, dong } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-12-6', code: 'NODE 12.6', title: 'Running Redis: the commands that freeze everything', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c12/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const MEM1M = num(R('ops', /^DBSIZE=1000000/), /used_memory=([\d.]+) MB/);
const KE = { d: num(R('ops', /^KEYS returned/), /in ([\d.]+) ms/), med: num(R('ops', /^meanwhile the OTHER/), /median ([\d.]+) ms/), worst: num(R('ops', /^meanwhile the OTHER/), /WORST ([\d.]+) ms/) };
const SC = { d: num(R('ops', /^SCAN walked/), /rounds, ([\d.]+) ms/), med: num(R('ops', /^but the other/), /median ([\d.]+) ms/), worst: num(R('ops', /^but the other/), /WORST ([\d.]+) ms/) };
const DL = { d: num(R('ops', /^DEL\s+hash/), /fields:\s+([\d.]+) ms/), w: num(R('ops', /^DEL\s+hash/), /worst PING ([\d.]+) ms/) };
const UL = { d: num(R('ops', /^UNLINK\s+hash/), /fields:\s+([\d.]+) ms/), w: num(R('ops', /^UNLINK\s+hash/), /worst PING ([\d.]+) ms/) };
const NOEV = num(R('ops', /^wrote \d+ more keys/), /wrote (\d+) more/);
const LRU = { from: num(R('ops', /^wrote 50,000/), /DBSIZE (\d+) ->/), to: num(R('ops', /^wrote 50,000/), /-> (\d+) \|/), ev: num(R('ops', /^wrote 50,000/), /evicted_keys = (\d+)/) };
const SLOW = num(R('ops', /^SLOWLOG/), /took (\d+) µs/);
const HM = { h: num(R('ops', /^keyspace_hits/), /hits=(\d+)/), m: num(R('ops', /^keyspace_hits/), /misses=(\d+)/), frag: num(R('ops', /^keyspace_hits/), /ratio=([\d.]+)/) };
const PERSIST = ra('c12/persist').split('\n').filter((l) => !l.startsWith('$') && l.trim()).join('\n');
const f = (n) => n.toLocaleString('en-US');

const quaySvg = `<svg data-k="quay" viewBox="0 0 1100 190" width="1100" height="190" font-family="Arial">
<rect x="10" y="40" width="150" height="110" rx="14" fill="${DO}18" stroke="${DO}" stroke-width="3"/><text x="85" y="95" text-anchor="middle" font-size="40">🧑‍💼</text><text x="85" y="135" text-anchor="middle" font-size="19" font-weight="700" fill="${DO}">ONE counter</text>
<rect x="190" y="55" width="230" height="80" rx="12" fill="${CAM}22" stroke="${CAM}" stroke-width="3"/><text x="305" y="90" text-anchor="middle" font-size="20" font-weight="700" fill="${CAM}">KEYS * (a cart of</text><text x="305" y="116" text-anchor="middle" font-size="20" font-weight="700" fill="${CAM}">1,000,000 items)</text>
${[0, 1, 2, 3, 4, 5].map((i) => `<text x="${480 + i * 100}" y="110" text-anchor="middle" font-size="40">🧍</text>`).join('')}
<text x="770" y="170" text-anchor="middle" font-size="20" fill="#333">every other client waits behind it — even for a 1-item PING</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 12 — Redis: caching, TTL and atomicity', bai: '12.6' }, [
  { cover: true, t: 'Running Redis:<br>the commands that<br>freeze everything', sub: 'One command at a time is a gift for atomicity and a loaded gun when one command takes 200 ms. Measured from a second connection — the only honest way to see the damage.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>KEYS vs SCAN: why the slower one is the right one</li>
<li>DEL vs UNLINK: a blocking delete hidden in one command</li>
<li>maxmemory: what happens when Redis is full, policy by policy</li>
<li>Persistence: RDB, AOF, or nothing — decided by one question</li>
<li>The numbers to watch, and how not to get hacked</li>
</ul>` + box('Why it matters to you', 'Most Redis outages are not Redis being slow. They are one command, or one default setting, that nobody measured from the outside.', 'lam') },

  { t: 'An everyday picture: one counter, one slow customer', to: true, giua: true, body: quaySvg + two(box('One thread, one queue', 'Redis serves one command at a time (12.1). A command that takes 200 ms is 200 ms during which every other client simply stands still.', 'do2'),
    box('So measure from OUTSIDE', 'Timing the slow command itself tells you nothing about the damage. A second client pinging every 2 ms shows what every API request felt.', 'xanh')) },

  { t: 'The setting: one million keys', to: true, giua: true, body: TT('c12/ops', 2, 3, 'node ops.mjs · [1] one million SET key:N v, in pipelines of 10,000 · real', { hl: [2], n: 104, sm: false }) +
    cards([['~73 bytes per tiny key', `${MEM1M} MB for 1,000,000 keys whose value is "v" — the per-key overhead of lesson 12.3 at scale.`], ['The web lesson', 'measured 93.4 MB on its machine: same order of magnitude, different allocator details.'], ['Now', 'a second client PINGs every 2 ms while we run the command every tutorial warns about.']], 3) +
    box('A production-sized keyspace', 'Rate-limit counters, sessions, cache entries: a million keys is an ordinary Redis.', 'lam') },

  { t: 'KEYS vs SCAN, measured from the outside', to: true, giua: true, body: TT('c12/ops', 4, 9, 'node ops.mjs · [2] [3] the OTHER client PINGs every 2 ms · real', { hl: [3, 6], n: 104, sm: false }) +
    thanh([['KEYS: worst PING', KE.worst, DO, `${KE.worst} ms`], ['SCAN: worst PING', SC.worst, NODE, `${SC.worst} ms`], ['normal PING', KE.med, LAM, `${KE.med} ms`]], { w: 1100, x0: 260, wMax: 560, h0: 52, chu: 22, ghi: "another client's latency while the command runs · real" }) },

  { t: 'The honest framing: SCAN is slower — and right', to: true, giua: true, body: two(box(`SCAN took ${(SC.d / KE.d).toFixed(1)}× longer in total`, `${f(SC.d)} ms vs ${KE.d} ms. Measure only the command itself and you would pick KEYS.`, 'cam'),
    box('But the number that decides is the other one', `A normal ${KE.med} ms PING took ${KE.worst} ms during KEYS. Every API request touching Redis paid that — it looks exactly like a network incident.`, 'do2')) +
    J(`let cursor = '0';
do {
  const [next, keys] = await redis.scan(cursor, 'MATCH', 'sess:*', 'COUNT', 1000);
  for (const k of keys) handle(k);       // keys may repeat: de-duplicate if it matters
  cursor = next;
} while (cursor !== '0');`, { sm: false, hl: [3] }) +
    box('SCAN returns a cursor and a slice', 'Redis serves other clients between calls. It guarantees every key present for the whole scan is returned at least once — possibly more.', 'lam') },

  { t: 'The same warning for the whole family', to: true, giua: true, body: cards([
    ['HGETALL on a huge hash', '→ HSCAN'], ['SMEMBERS on a huge set', '→ SSCAN'], ['ZRANGE 0 -1 on a huge sorted set', '→ ZSCAN / a bounded range'], ['LRANGE 0 -1 on a huge list', '→ a bounded range'],
  ], 4) + vsd('<p>"Give me everything" commands on an unbounded collection.</p><p>Fine on your laptop with 100 items, an outage with 10 million.</p>', '<p>Iterate with a cursor, or bound the range.</p><p>The server stays responsive between calls.</p>', '✗ Unbounded', '✓ Incremental') +
    box('Admin scripts are where KEYS hides', 'A one-off "clean up old sessions" script with KEYS sess:* inside is a site-wide latency spike.', 'cam') },

  { t: 'DEL vs UNLINK: the same blocking, hidden in a delete', to: true, giua: true, body: TT('c12/ops', 10, 12, 'node ops.mjs · [4] delete ONE hash of 1,000,000 fields · real', { hl: [2, 3], n: 104, sm: false }) +
    thanh([['DEL', DL.d, DO, `${DL.d} ms · others wait ${DL.w} ms`], ['UNLINK', UL.d, NODE, `${UL.d} ms · others wait ${UL.w} ms`]], { w: 1100, x0: 140, wMax: 600, h0: 56, chu: 22, ghi: 'time for the caller · real' }) +
    box('Deleting is work too', `Freeing a million allocations happens on the main thread with DEL: ${DL.d} ms of everyone waiting. UNLINK removes the key at once and frees the memory in a background thread: ${Math.round(DL.d / UL.d)}× faster for the caller, invisible to everyone else.`, 'xanh') },

  { t: 'Make UNLINK the default', to: true, giua: true, body: J(`await redis.unlink('report:big');          // instead of DEL
await redis.flushdb('ASYNC');               // instead of a blocking FLUSHDB`, { sm: false, hl: [1, 2] }) +
    cards([['UNLINK', 'No downside: same result, the expensive part moves to a background thread.'], ['FLUSHALL / FLUSHDB ASYNC', 'The same idea for wiping a database — and better still, rename them away (part 2).'], ['lazyfree-lazy-user-del yes', 'A config switch that makes a plain DEL behave like UNLINK.']], 3) +
    box('Small keys do not matter', 'DEL of a 10-byte string is instant either way. The rule is about big collections — and you rarely know in advance which keys will grow big.', 'lam') },

  { t: 'maxmemory, policy noeviction — the default', to: true, giua: true, body: TT('c12/ops', 13, 15, 'node ops.mjs · [5] maxmemory = current usage + 200 KB, keep writing · real', { hl: [2, 3], n: 104, sm: false }) +
    two(box('A full Redis becomes READ-ONLY', 'Every write fails with OOM while reads keep working. If Redis holds your sessions or rate limits, half the app breaks in a way that does not look like "out of memory" at all.', 'do2'),
      box('What users see', 'Logins fail, quota checks throw, the home page still loads. Incident reports blame the auth code.', 'cam')) +
    flow([{ t: 'used_memory', s: 'grows to maxmemory', mau: LAM }, { t: 'SET / INCR / XADD', s: '→ OOM error', mau: DO }, { t: 'GET', s: 'still works', mau: NODE }, { t: 'the app', s: 'half broken', mau: DO }], { h: 130 }) },

  { t: 'allkeys-lru: Redis makes room by itself', to: true, giua: true, body: TT('c12/ops', 16, 17, 'node ops.mjs · [6] the same full Redis, policy switched to allkeys-lru · real', { hl: [2], n: 104, sm: false }) +
    thanh([['DBSIZE before', LRU.from, LAM, f(LRU.from)], ['DBSIZE after +50,000', LRU.to, NODE, f(LRU.to)], ['evicted_keys', LRU.ev, CAM, f(LRU.ev)]], { w: 1100, x0: 290, wMax: 520, h0: 52, chu: 22, ghi: 'real' }) +
    box('No errors — and an obligation', 'Least-recently-used keys are thrown away to make room. That is what you want for a CACHE — and your app must survive any key vanishing at any moment. If you followed 12.2 (cache-aside), it already does.', 'xanh') },

  { t: 'The trap: volatile-lru with no TTLs', to: true, giua: true, body: TT('c12/ops', 18, 19, 'node ops.mjs · [7] volatile-lru, every key was written without EX · real', { hl: [2], n: 104, sm: false }) +
    vsd('<p>volatile-lru "only evicts keys that would expire anyway" — sounds safer.</p><p>One code path writes without a TTL ⇒ nothing is eligible ⇒ OOM, read-only Redis again.</p>', '<p>allkeys-lru for a cache: everything is a candidate.</p><p>Or make sure EVERY write carries EX (and remember: a plain SET removes it — 12.2).</p>', '✗ volatile-* + missing TTLs', '✓ allkeys-lru for caches') +
    box('volatile-* without TTLs = noeviction', 'The policy is only as good as every SET in the codebase.', 'do2') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'the command', "the OTHER client's worst wait", 'the rule'], [
    ['list keys', `KEYS * · ${KE.d} ms`, `${KE.worst} ms`, 'SCAN with a cursor'],
    ['list keys', `SCAN · ${f(SC.d)} ms total`, `${SC.worst} ms`, 'slower overall, harmless'],
    ['delete a 1M-field hash', `DEL · ${DL.d} ms`, `${DL.w} ms`, 'UNLINK'],
    ['delete a 1M-field hash', `UNLINK · ${UL.d} ms`, `${UL.w} ms`, 'the default'],
    ['Redis full, noeviction', `OOM after ${f(NOEV)} more keys`, 'reads work, writes fail', 'not for a cache'],
    ['Redis full, allkeys-lru', `${f(LRU.ev)} keys evicted`, '0 errors', 'the cache setting'],
  ], { co: 20 }) + two(box('Remember', 'Judge a command by what EVERYONE ELSE waits, not by its own duration — and pick maxmemory-policy before Redis is full.', 'xanh'), box('Next', 'Part 2: the policies side by side, persistence, the numbers to watch, and security.', 'lam')) },

  // ───────────── phần B ─────────────
  { t: 'The policies, side by side', to: true, giua: true, body: cards([
    ['noeviction', 'THE DEFAULT. Full ⇒ every write errors. Right only when Redis is your PRIMARY store and you prefer errors to data loss.'],
    ['allkeys-lru', 'Evict the least recently used key. The choice for a CACHE. Set maxmemory with it and forget it.'],
    ['allkeys-lfu', 'Evict by FREQUENCY of use. Better when a stable hot set gets pushed out by one-off scans.'],
    ['volatile-*', 'Only keys WITH a TTL. Sounds safe, fails silently the day a code path forgets EX.'],
  ], 2) + J(`# redis.conf for a cache
maxmemory 256mb
maxmemory-policy allkeys-lru`, { sm: false }) },

  { t: 'Persistence: does the data survive a restart?', to: true, giua: true, body: T(PERSIST, 'bash persist.sh · two throw-away Redis 7.4 containers, 1,000 keys each, docker restart · real', { sm: false, hl: [3] }) +
    cards([['RDB (snapshots)', 'Periodic full copies: small files, fast restart, easy backup. Loses everything since the last snapshot.'], ['AOF (command log)', 'Every write appended; appendfsync everysec ⇒ lose at most ~1 s. Bigger file, slower restart.'], ['Both / neither', 'Both for important data (AOF to recover, RDB to back up). Neither for a pure cache: restart empty, warm up.']], 3) +
    box('What the demo shows', 'Without persistence a restart is an empty Redis — fine for a cache, a disaster for sessions. With AOF everysec the 1,000 keys came back.', 'lam') },

  { t: 'Decided by one question', to: true, giua: true, body: flow([
    { t: 'Redis is wiped now', s: 'what do you lose?', mau: DO }, { t: 'only performance', s: 'caches re-warm', mau: NODE }, { t: '→ no persistence', s: 'simplest, fastest', mau: NODE }], { h: 130 }) +
    flow([{ t: 'Redis is wiped now', s: 'what do you lose?', mau: DO }, { t: 'DATA', s: 'sessions, queues, counters', mau: CAM }, { t: '→ AOF + RDB', s: 'and ask: should it be in Postgres?', mau: CAM }], { h: 130 }) +
    box('If the answer is "data"', 'You have quietly turned Redis into a primary database. It is worth asking whether that data belongs in PostgreSQL, with transactions and backups you already trust.', 'lam') },

  { t: 'The numbers to watch', to: true, giua: true, body: TT('c12/ops', 21, 22, 'node ops.mjs · [8] slowlog-log-slower-than 10000, then INFO · real', { hl: [1, 2], n: 104, sm: false }) +
    cards([['SLOWLOG GET 10', `The first thing to run when Redis "got slow": it caught KEYS at ${f(SLOW)} µs with no extra tooling. Set slowlog-log-slower-than 10000 (10 ms).`], ['keyspace_hits / misses', `${f(HM.h)} / ${f(HM.m)} here — right after eviction threw keys away. Alert on misses per second (12.2).`], ['mem_fragmentation_ratio', `used_memory_rss / used_memory: ${HM.frag} here. 1.0–1.5 is healthy; high and sustained ⇒ RSS far above your data, dangerous with a container memory limit.`]], 3) +
    J(`redis-cli SLOWLOG GET 10
redis-cli INFO stats | grep -E 'keyspace_(hits|misses)|evicted_keys'
redis-cli INFO memory | grep -E 'used_memory_human|mem_fragmentation_ratio'`, { sm: false }) },

  { t: 'Security: do not get hacked through Redis', to: true, giua: true, body: J(`# redis.conf
bind 127.0.0.1 10.0.0.5            # private interfaces only — NEVER the internet
requirepass <a long random secret>
rename-command FLUSHALL ""         # disabled entirely
rename-command KEYS ""
rename-command CONFIG ""           # the door attackers use`, { sm: false, hl: [2, 4, 7] }) +
    two(box('An open 6379 is owned within hours', 'The standard attack: CONFIG SET dir + dbfilename to write an SSH key or a cron file onto the host through a "database save".', 'do2'),
      box('Nobody runs FLUSHALL, KEYS or DEBUG on production', 'Not you, not a script, not an intern. rename-command makes it impossible instead of forbidden.', 'xanh')) +
    box('Course Redis 10.2 – 10.4', 'Exposure to the network, ACL users instead of one shared password, hardening — in depth.', 'lam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: two(box('Configured as a cache', 'Redis 7.4.9 in Docker, maxmemory 256M, maxmemory-policy allkeys-lru: a runaway key can never break writes.', 'xanh'),
    box('Its state, as the web lesson reports', 'used_memory 1.23M of 256M, evicted_keys:0, expired_keys:21, connected_clients:4, hit rate 89.2%.', 'lam')) +
    flow([{ t: '0.5% of the limit', s: 'used today', mau: NODE }, { t: 'evicted 0', s: 'never needed', mau: NODE }, { t: 'the limit', s: 'an emergency brake', mau: CAM }], { h: 130 }) +
    box('Sizing a cache', 'Generous enough that eviction is an emergency brake, not a daily event — and allkeys-lru so that hitting it is never an outage.', 'cam') },

  { t: 'The commands that freeze the server', to: true, giua: true, body: flow([
    { t: '1 one at a time', s: 'every client shares it', mau: LAM }, { t: '2 KEYS sweeps all', s: 'SCAN slices it', mau: DO }, { t: '3 DEL frees inline', s: 'UNLINK in background', mau: DO }, { t: '4 nothing unbounded', s: 'KEYS, FLUSHALL, loops', mau: NODE }], { h: 140 }) +
    box('The rule', 'KEYS, FLUSHALL, SMEMBERS on a huge set, a Lua script with a loop: each is fine on your laptop and an outage in production.', 'cam') +
    box('And the two settings to check on day one', 'maxmemory + maxmemory-policy (allkeys-lru for a cache), and whether you need persistence at all.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A teammate\'s nightly script runs KEYS session:* and DEL on every match; Redis has 3 million keys, no maxmemory, and is used for sessions AND a cache. Users report "random 300 ms spikes at 2 am" and, last month, "login broken for an hour" when the VPS ran out of memory. Diagnose and fix — commands and config.', '') +
    `<div data-k="dapan">${box('Answer', 'Spikes: KEYS blocks everyone (SLOWLOG GET shows it) ⇒ SCAN MATCH session:* COUNT 1000 and UNLINK in batches — better, give sessions a TTL so no cleanup job is needed. Outage: no maxmemory ⇒ the container/OS killed it. Split concerns: sessions are DATA (persistence or move to Postgres), the cache is performance ⇒ separate instances, or at least maxmemory + allkeys-lru on the cache. Plus rename-command KEYS/FLUSHALL, bind private, requirepass.', 'xanh')}</div>` },

  { t: 'Chapter 12 — in one table', to: true, giua: true, body: bang(['lesson', 'measured', 'the rule'], [
    ['12.1 round trips', 'PING: 0.53 µs inside, ~420 µs on the way', 'pipeline, MGET, count round trips'],
    ['12.2 cache-aside', '143× on a small aggregate; slower on 1.6 MB', 'cache what is expensive, single-flight, jitter'],
    ['12.3 structures', 'field 513: ×5.6 RAM; HLL ~14 KB', 'fewer keys, stay under thresholds'],
    ['12.4 atomicity', '500 through a limit of 100', 'INCR / Lua; locks with tokens'],
    ['12.5 Pub/Sub vs Streams', 'PUBLISH → 0; PENDING → XAUTOCLAIM', 'signals vs work'],
    ['12.6 operations', `KEYS: others wait ${Math.round(KE.worst)} ms; OOM at maxmemory`, 'SCAN, UNLINK, allkeys-lru'],
  ], { co: 20 }) + box('Next: chapter 13 — background jobs and queues', 'BullMQ on Redis: retries, backoff, delayed jobs — everything 12.5 built by hand, done for you.', 'lam') },
]);
