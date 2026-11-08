/**
 * node-12-3 — Node.js · Chapter 12 · Lesson 12.3 "Picking the right structure" (slide EN, đợt 9b — 01/11/2026).
 * MỘT deck, HAI tập: node-12-3 (slide 1–12) · node-12-3-2 (slide 13–22).
 *   A: ví dụ đời thường (100 hộp có nhãn vs một bìa còng) · 100.000 phiên ba cách (thật: 11,91 / 11,67 / 5,92 MB) · ít khoá hơn mới là tiết kiệm (thật: ~50 B/khoá rỗng) ·
 *      vách listpack (thật: 512 → 513 trường 5.168 → 28.816 B, 5,6×; 8 × 125 = 10.368 B) · intset → listpack không quay lại · Set vs HyperLogLog (thật: 5,31 MB vs 14.392 B; hai cách đo 254× / 387×; lệch 0,17 %) ·
 *      đánh đổi HLL · bitmap (thật: 131.136 B, BITCOUNT 333.334; id 8.000.000 ⇒ 1.048.624 B; tuần: 31.428 / 88.571) · bảng phần A
 *   B: sorted set (thật: TOP 10 0,47 ms, hạng 0,38 ms) · lệnh ZSET · thực đơn đủ tám món · đặt tên khoá (thật: 49,7 / 50,5 / 66,5 B mỗi khoá) · chu kỳ trong tên khoá (thật: TTL 3.024.000 s) ·
 *      con số lúc 3 giờ sáng · website · vì sao cấu trúc hơn kích thước · bài tập · tóm tắt
 * Nguồn: nodejs-12-3-cau-truc-du-lieu. Output THẬT: that/c12/{structures,hll-2way,keys} (Node 22.23.3, ioredis 5.11.1, Redis 7.4.9 Docker node12-redis).
 * Khác web: vách 512 → 513 ×5,6 (web ×3,6: giá trị trường dài hơn) · 8 × 125 nhỏ hơn 4,7× (web 3,1×) · HLL nhỏ hơn Set 254× (used_memory) / 387× (MEMORY USAGE) — web 95× (HLL 0,04 MB ≠ 12 KB cố định)
 *   · bitmap 128 KB (web 152,3 KB) · ZSET 0,47 / 0,38 ms (web 0,77 / 0,32).
 */
import { lamDeck, two, box, cards, flow, bang, vsd, J, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-12-3', code: 'NODE 12.3', title: 'Picking the right structure', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c12/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const SS = ['\\[1\\]', '\\[2\\]', '\\[3\\]'].map((k) => num(R('structures', new RegExp(`^${k}`)), /([\d.]+) MB/));
const HC = [128, 512, 513, 1000].map((n) => ({ n, b: num(R('structures', new RegExp(`hash\\s+${n} fields`)), /RAM=\s*(\d+) bytes/), pf: num(R('structures', new RegExp(`hash\\s+${n} fields`)), /-> ([\d.]+) bytes\/field/) }));
const SPLIT = num(R('structures', /split into 8/), /RAM=(\d+)/);
const HW = { sd: num(R('hll-2way', /^Set/), /delta\s+(\d+)/), su: num(R('hll-2way', /^Set/), /USAGE\s+(\d+)/), hd: num(R('hll-2way', /^HyperLogLog/), /delta\s+(\d+)/), hu: num(R('hll-2way', /^HyperLogLog/), /USAGE\s+(\d+)/) };
const HLL = { est: num(R('structures', /HLL estimates/), /estimates (\d+)/), off: num(R('structures', /HLL estimates/), /off by ([\d.]+)%/) };
const BM = { b: num(R('structures', /^\[6\]/), /active: (\d+) bytes/), cnt: num(R('structures', /BITCOUNT/), /= (\d+)/), lone: num(R('structures', /ONE user/), /bitmap: (\d+) bytes/) };
const WK = { d1: num(R('keys', /active on day 1/), /day 1: (\d+)/), all: num(R('keys', /active on day 1/), /7 days: (\d+)/) };
const ZS = { top: num(R('structures', /^\[7\]/), /TOP 10 in ([\d.]+) ms/), rank: num(R('structures', /^\[7\]/), /user in ([\d.]+) ms/) };
const KB = ['short', 'readable', 'very long'].map((k) => num(R('keys', new RegExp(`^${k}`)), /-> ([\d.]+) bytes per key/));
const HEAVY = num(R('cache', /^\[1\]/), /rows\): ([\d.]+) ms/);
const f = (n) => n.toLocaleString('en-US');

const hopSvg = `<svg data-k="hop" viewBox="0 0 1100 230" width="1100" height="230" font-family="Arial">
${Array.from({ length: 24 }, (_, i) => `<rect x="${12 + (i % 8) * 62}" y="${20 + Math.floor(i / 8) * 62}" width="52" height="52" rx="6" fill="${CAM}22" stroke="${CAM}" stroke-width="2"/><rect x="${16 + (i % 8) * 62}" y="${24 + Math.floor(i / 8) * 62}" width="44" height="13" fill="${CAM}"/>`).join('')}
<text x="262" y="222" text-anchor="middle" font-size="21" font-weight="700" fill="${CAM}">one KEY per item: every box has its own label</text>
<rect x="640" y="20" width="440" height="176" rx="14" fill="${NODE}14" stroke="${NODE}" stroke-width="3"/><rect x="650" y="30" width="420" height="22" fill="${NODE}"/>
${Array.from({ length: 24 }, (_, i) => `<rect x="${656 + (i % 8) * 52}" y="${64 + Math.floor(i / 8) * 42}" width="44" height="34" rx="4" fill="#fff" stroke="${NODE}" stroke-width="1.5"/>`).join('')}
<text x="860" y="222" text-anchor="middle" font-size="21" font-weight="700" fill="${NODE}">one KEY, many fields: one label, many pockets</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 12 — Redis: caching, TTL and atomicity', bai: '12.3' }, [
  { cover: true, t: 'Picking the right<br>structure: the same data,<br>a fraction of the RAM', sub: 'Redis is a small library of data structures that happens to live on a server. Every number below is RAM read from Redis itself, before and after loading the same information.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The same 100,000 sessions stored three ways — and where the saving really comes from</li>
<li>The encoding cliff: one more field, several times the RAM</li>
<li>Counting unique visitors in a fixed ~14 KB instead of megabytes</li>
<li>Bitmaps for "who was active today", sorted sets for leaderboards</li>
<li>The full menu, key names that pay off, and the number that surprises you at 3 am</li>
</ul>` + box('Why it matters to you', 'RAM is what Redis runs out of. Knowing eight structures instead of three is measured in gigabytes you do not have to buy.', 'lam') },

  { t: 'An everyday picture: boxes or a binder?', to: true, giua: true, body: hopSvg + two(box('Many small boxes', 'Every box needs its own label, its own shelf slot, its own "throw away on" date. With 100,000 boxes, the labels alone fill a shelf.', 'cam'),
    box('One binder', 'One label, many pockets: far less overhead. But you can no longer throw away ONE pocket on its own date — the date is on the binder.', 'xanh')) +
    box('In Redis', 'A KEY is a box with a label (dict entry, expiry slot, object header). A hash field is a pocket. TTL lives on the key, never on a field.', 'lam') },

  { t: 'The same 100,000 sessions, three ways', to: true, giua: true, body: TT('c12/structures', 2, 6, 'node structures.mjs · INFO used_memory before/after loading · real', { hl: [4, 5], n: 104, sm: false }) +
    thanh([['String + JSON', SS[0], CAM, `${SS[0]} MB · 100,000 keys`], ['Hash, 3 fields', SS[1], CAM, `${SS[1]} MB · 100,000 keys`], ['bucketed hashes', SS[2], NODE, `${SS[2]} MB · 1,000 keys`]], { w: 1100, x0: 230, wMax: 560, h0: 56, chu: 22, ghi: 'used_memory delta · real' }) },

  { t: 'The saving comes from FEWER KEYS', to: true, giua: true, body: two(box('A 3-field hash ≈ a JSON string', `${SS[1]} MB vs ${SS[0]} MB. The usual advice "use a hash" does not save what people expect here.`, 'cam'),
    box('Every key costs ~50 bytes before your data', `100,000 keys whose value is just "1" took ${KB[0]} bytes each (keys.mjs, below). Bucketing 100 sessions per key removes 99% of those labels.`, 'xanh')) +
    TT('c12/keys', 2, 5, 'node keys.mjs · 100,000 keys, value "1", only the NAME changes · real', { hl: [2], n: 104, sm: false }) +
    box('The trade-off', 'Bucketing halves the RAM and takes away EXPIRE: TTL lives on a key, not on a field. Sessions need a TTL each ⇒ pay for the keys. "Last 100 events per user" ⇒ bucket.', 'do2') },

  { t: 'The encoding cliff: one more field', to: true, giua: true, body: TT('c12/structures', 8, 12, 'node structures.mjs · MEMORY USAGE … SAMPLES 0 · hash-max-listpack-entries = 512 · real', { hl: [2, 3], n: 104, sm: false }) +
    thanh(HC.map((h) => [`${h.n} fields`, h.pf, h.n <= 512 ? NODE : DO, `${h.pf} bytes per field (${h.n <= 512 ? 'listpack' : 'hashtable'})`]), { w: 1100, x0: 200, wMax: 420, h0: 42, chu: 20, ghi: 'bytes per field · real' }) +
    box(`×${(HC[2].b / HC[1].b).toFixed(1)} for field number 513`, `${f(HC[1].b)} → ${f(HC[2].b)} bytes: you crossed hash-max-listpack-entries (512); a flat listpack became a real hash table.`, 'do2') },

  { t: 'Staying under the threshold', to: true, giua: true, body: two(J(`> OBJECT ENCODING h513
"hashtable"
> MEMORY USAGE h513 SAMPLES 0
(integer) ${HC[2].b}`, { sm: false }), J(`// 1000 fields → 8 hashes of 125
const key = \`h:\${Math.floor(id / 125)}\`;
await redis.hset(key, String(id), value);`, { sm: false, hl: [2] })) +
    thanh([['1 hash × 1000 fields', HC[3].b, DO, `${f(HC[3].b)} bytes · hashtable`], ['8 hashes × 125', SPLIT, NODE, `${f(SPLIT)} bytes · listpack`]], { w: 1100, x0: 250, wMax: 500, h0: 58, chu: 22, ghi: 'the same 1,000 fields · real' }) +
    box(`${(HC[3].b / SPLIT).toFixed(1)}× smaller, purely by staying under the cliff`, 'OBJECT ENCODING and MEMORY USAGE answer "why is Redis so big?" faster than any dashboard. MEMORY USAGE samples 5 elements by default — add SAMPLES 0 to count them all.', 'xanh') },

  { t: 'Sets do it too — and there is no way back', to: true, giua: true, body: TT('c12/structures', 14, 16, 'node structures.mjs · SADD ids 1 … 20, then SADD ids user-21, then SREM · real', { hl: [1, 2, 3], n: 104, sm: false }) +
    cards([['intset', 'A set of ONLY integers: the densest layout Redis has.'], ['+ one string', 'The set converts to listpack (later hashtable) — permanently.'], ['"user-42" vs 42', 'Storing ids as strings silently throws the intset away for your whole dataset.']], 3) +
    box('Store numeric ids as numbers', 'Prefix belongs in the KEY name (sess:42), not in every member of a set.', 'xanh') },

  { t: 'Counting unique users: Set or HyperLogLog', to: true, giua: true, body: TT('c12/structures', 18, 21, 'node structures.mjs · 100,000 distinct ids · real', { hl: [2, 3], n: 104, sm: false }) +
    bang(['measured with', 'Set (stores every id)', 'HyperLogLog', 'HLL is smaller by'], [
      ['INFO used_memory, before/after', `${f(HW.sd)} B`, `${f(HW.hd)} B`, `${Math.round(HW.sd / HW.hd)}×`],
      ['MEMORY USAGE (default sampling)', `${f(HW.su)} B`, `${f(HW.hu)} B`, `${Math.round(HW.su / HW.hu)}×`],
    ], { co: 21, cap: 'node hll-2way.mjs · the same 100,000 ids measured two ways · real' }) +
    box('Whatever the ruler: hundreds of times smaller', `The web lesson printed 95× (an HLL of 0.04 MB). A dense HLL is ~12 KB of registers plus a header: ${f(HW.hd)} bytes here — fixed, whether you add a million or a billion ids.`, 'lam') },

  { t: 'What HyperLogLog gives — and takes', to: true, giua: true, body: cards([
    ['PFADD · PFCOUNT', `Add ids, ask "how many?". Off by ${HLL.off}% here (${f(HLL.est)} for 100,000); standard error ~0.81%.`],
    ['PFMERGE', 'Merge seven daily HLLs into "unique users this week" — without storing a single id.'],
    ['NO membership', 'You can never ask "was user 42 here?". If you need SISMEMBER, you need a Set.'],
  ], 3) + vsd('<p>Ask HLL "did Alice visit?" — impossible.</p><p>Store exact ids for a "who" feature — needs a Set.</p>', '<p>Daily / weekly unique visitors on a dashboard: ~14 KB per counter, forever.</p><p>Approximate is enough.</p>', '✗ Not for "who"', '✓ For "how many"') +
    J(`await redis.pfadd('uniq:2026-11-01', userId);                       // on every visit
await redis.pfmerge('uniq:week:45', 'uniq:2026-11-01', /* … */ 'uniq:2026-11-07');
await redis.pfcount('uniq:week:45');                                 // ≈ unique users this week`, { sm: false, hl: [2] }) },

  { t: 'Membership on a dense id range: bitmaps', to: true, giua: true, body: TT('c12/structures', 23, 25, 'node structures.mjs · SETBIT active:2026-11-01 <userId> 1 · real', { hl: [1, 2, 3], n: 104, sm: false }) +
    TT('c12/keys', 6, 7, 'node keys.mjs · 7 daily bitmaps, BITOP AND ⇒ active on every day of the week · real', { hl: [2], n: 104, sm: false }) +
    two(box('One bit per user', `1,000,000 users in ${f(BM.b)} bytes (~128 KB), exact, GETBIT for one user. One bitmap a day + BITOP AND = weekly retention with no query.`, 'xanh'),
      box('Only for DENSE numeric ids', `A bitmap for user 8,000,000 allocates up to that bit: ${f(BM.lone)} bytes for ONE user.`, 'do2')) },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['100,000 sessions: String / Hash / bucketed', `${SS[0]} / ${SS[1]} / ${SS[2]} MB`, 'fewer keys, not "hash vs string"'],
    ['hash 512 → 513 fields', `${f(HC[1].b)} → ${f(HC[2].b)} bytes`, 'stay under the listpack threshold'],
    ['unique count: Set vs HLL', `${f(HW.sd)} vs ${f(HW.hd)} bytes`, 'HLL when "how many" is enough'],
    ['1,000,000 users active today', `${f(BM.b)} bytes`, 'bitmap for dense numeric ids'],
  ], { co: 21 }) + cards([['OBJECT ENCODING key', 'listpack, intset, hashtable…'], ['MEMORY USAGE key SAMPLES 0', 'exact bytes of one key'], ['INFO memory', 'used_memory before / after']], 3) + two(box('Remember', 'Every key carries ~50 bytes of overhead. TTL lives on the key.', 'xanh'), box('Next', 'Part 2: sorted sets, the full menu, key names, and sizing by key count.', 'lam')) },

  // ───────────── phần B ─────────────
  { t: 'Leaderboards: the sorted set', to: true, giua: true, body: TT('c12/structures', 27, 28, 'node structures.mjs · ZADD lb <score> user-N for 100,000 users · median of 9 · real', { hl: [1], n: 104, sm: false }) +
    thanh([['Postgres (12.2)', HEAVY, LAM, `${HEAVY} ms · the whole table`], ['ZREVRANGE top 10', ZS.top, NODE, `${ZS.top} ms`], ['ZREVRANK one user', ZS.rank, NODE, `${ZS.rank} ms · "what rank am I?"`]], { w: 1100, x0: 290, wMax: 480, h0: 58, chu: 22, log: true, ghi: 'log scale · real' }) +
    box('Redis keeps the order', '"What rank am I?" — SQL answers it with a window function over every row. A sorted set answers in well under a millisecond.', 'xanh') },

  { t: 'Sorted set: the five commands you need', to: true, giua: true, body: J(`await redis.zincrby('lb:notes:views:2026-11', 1, 'note:42');      // +1 view, O(log N)
await redis.zrevrange('lb:notes:views:2026-11', 0, 9, 'WITHSCORES'); // top 10
await redis.zrevrank('lb:notes:views:2026-11', 'note:42');           // my rank (0-based)
await redis.zscore('lb:notes:views:2026-11', 'note:42');             // my score
await redis.zrangebyscore('lb:notes:views:2026-11', 100, '+inf');    // everyone above 100`, { sm: false, hl: [1, 3] }) +
    flow([{ t: 'a view happens', s: 'ZINCRBY +1', mau: NODE }, { t: 'Redis re-sorts', s: 'by score, O(log N)', mau: DO }, { t: 'top 10', s: 'ZREVRANGE 0 9', mau: LAM }, { t: 'my rank', s: 'ZREVRANK', mau: CAM }], { h: 120 }) +
    two(box('When ranking is a product feature', 'Keep the sorted set as the source of truth for the live ranking; let Postgres keep the history.', 'xanh'),
      box('Also for time', 'Score = a timestamp ⇒ "everything in the last minute": the sliding-window rate limiter of lesson 12.4.', 'lam')) },

  { t: 'The full menu', to: true, giua: true, body: cards([
    ['String', 'JSON cache, flags, counters (INCR). The default — nothing wrong with it.'],
    ['Hash', 'Objects you change FIELD by field: HINCRBY user:42 views 1, not read-modify-write.'],
    ['List', 'Simple queues (LPUSH / BRPOP), the last N items (LPUSH + LTRIM).'],
    ['Set', 'Relations and set math: mutual friends (SINTER), tags, "seen already".'],
    ['Sorted set', 'Anything with an ORDER: leaderboards, priority queues, sliding windows (12.4).'],
    ['Bitmap', '1 bit per id on a dense range: daily activity, per-user feature flags.'],
    ['HyperLogLog', 'Unique counts when approximate is enough. ~14 KB, forever.'],
    ['Stream', 'An append-only log with consumer groups and acks — lesson 12.5.'],
  ], 4) },

  { t: 'Naming keys properly', to: true, giua: true, body: J(`// pattern: <domain>:<entity>:<id>:<attribute>
'sess:a3f9c1'                  // a login session
'user:42:profile'              // a cached profile
'lb:notes:views:2026-11'       // a monthly leaderboard
'rl:general:14.191.170.161'    // a rate-limit counter per IP
'quota:42:month:2026-11'       // a monthly quota — next month is a different key`, { sm: false, hl: [6] }) +
    TT('c12/keys', 3, 5, 'node keys.mjs · the prefix is stored once PER KEY · real', { hl: [3], n: 104, sm: false }) +
    box('Short, never cryptic', `A long prefix costs ${(KB[2] - KB[0]).toFixed(1)} bytes × every key. A key nobody can decode during an incident costs far more than those bytes.`, 'cam') },

  { t: 'Put the period in the key name', to: true, giua: true, body: TT('c12/keys', 9, 10, 'node keys.mjs · MULTI INCR + EXPIRE on a key named after the month · real', { hl: [1], n: 104, sm: false }) +
    flow([{ t: 'quota:42:month:2026-11', s: 'INCR all month', mau: NODE }, { t: 'December arrives', s: 'the code builds a new name', mau: LAM }, { t: 'quota:42:month:2026-12', s: 'starts at 1', mau: NODE }, { t: 'old key', s: 'expires by itself', mau: CAM }], { h: 130 }) +
    box('No reset job, no cron, no race', 'Periodic data with the period baked into the name: the next period is simply a different key, and the old one expires on its own.', 'xanh') },

  { t: 'The number that surprises you at 3 am', to: true, giua: true, body: two(box('Overhead per key', `~${KB[0].toFixed(0)} bytes for a key whose value is "1" (measured here); the web lesson measures 93.4 MB for 1,000,000 tiny keys in 12.6 — ~93 bytes each with a small value.`, 'do2'),
    box('How teams get it wrong', 'They add up the size of their VALUES, deploy, and hit maxmemory at a third of the expected key count.', 'cam')) +
    flow([{ t: '1. count the keys', s: 'how many, at peak?', mau: LAM }, { t: '2. × overhead', s: '~50–100 B each', mau: CAM }, { t: '3. + values', s: 'then the data', mau: NODE }, { t: '4. + headroom', s: 'fragmentation, growth', mau: TIM }], { h: 130 }) +
    box('The rule', 'Size Redis by KEY COUNT first, value size second.', 'xanh') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: J(`quota:<userId>:minute:<YYYY-MM-DD-HH-mm>     // expires after 65 s
quota:<userId>:day:<YYYY-MM-DD>              // expires after 90,000 s
quota:<userId>:month:<YYYY-MM>               // expires after 35 days`, { sm: false }) +
    two(box('Plain strings driven by INCR', 'The period is baked into the name. Nothing ever resets a counter: the minute key is simply never mentioned again once the minute is over.', 'xanh'),
      box('What a healthy keyspace looks like', 'The web lesson reports expired_keys:21 and evicted_keys:0 in production: everything that leaves, leaves because it expired.', 'lam')) +
    flow([{ t: '10:41', s: 'INCR quota:42:minute:…-10-41', mau: NODE }, { t: '10:42', s: 'a NEW key starts at 1', mau: NODE }, { t: '10:42:05', s: 'the 10:41 key expires (65 s)', mau: CAM }], { h: 120 }) +
    box('Same trick as part 1', 'MULTI wraps INCR + EXPIRE so the counter can never be left without an expiry — the bug lesson 12.4 opens with.', 'cam') },

  { t: 'Why structure matters more than size', to: true, giua: true, body: flow([
    { t: '1 one key per field', s: 'pays the per-key fee N times', mau: DO }, { t: '2 one hash', s: 'one key, compact encoding', mau: NODE }, { t: '3 the CLIFF', s: 'past 512: several × RAM', mau: DO }, { t: '4 to COUNT', s: 'do not store the items', mau: NODE }], { h: 140 }) +
    cards([['Know your thresholds', 'hash-max-listpack-entries 512 (and value size 64 B): CONFIG GET them.'], ['Measure, do not guess', 'OBJECT ENCODING + MEMORY USAGE … SAMPLES 0 on a real key.'], ['Pick by the question', '"how many" ⇒ HLL · "who" ⇒ Set · "top N" ⇒ sorted set · "was id X here" ⇒ bitmap.']], 3) +
    box('The habit', 'Before you add a key pattern, write down: how many keys at peak, which structure, which TTL, which question it answers. Four lines in the PR description save gigabytes later.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A notes app wants three things on its admin page: (1) how many DISTINCT users opened the app today and this week, (2) which of the 2 million users (ids 1…2,000,000) were active on each of the last 30 days, (3) the top 20 notes by views this month. Pick a structure and a key name for each, and estimate the RAM.', '') +
    `<div data-k="dapan">${box('Answer', '(1) HyperLogLog uniq:day:2026-11-01 (PFADD), PFMERGE 7 days ⇒ week: ~14 KB per day. (2) Bitmap active:2026-11-01, SETBIT userId: 2,000,000 bits ≈ 250 KB per day × 30 ≈ 7.5 MB; BITOP AND/OR for retention. (3) Sorted set lb:notes:views:2026-11, ZINCRBY on each view, ZREVRANGE 0 19. Month in every key name ⇒ no reset job; give each key an expiry.', 'xanh')}</div>` },

  { t: 'Structures — in one table', to: true, giua: true, body: bang(['question', 'structure', 'measured here'], [
    ['many small objects with a TTL each', 'one String/Hash per object', `${SS[0]} MB / 100,000`],
    ['many small objects, no TTL each', 'bucketed hashes, ≤ 512 fields', `${SS[2]} MB / 100,000`],
    ['how many distinct?', 'HyperLogLog', `${f(HW.hd)} bytes`],
    ['was id X active? (dense ids)', 'bitmap', `${f(BM.b)} bytes / 1,000,000`],
    ['top N, my rank', 'sorted set', `${ZS.top} / ${ZS.rank} ms`],
  ], { co: 21 }) + box('Next: 12.4 — atomicity', 'Redis stops being an optimisation and becomes a correctness tool: 500 requests through a limit of 100, the INCR-then-EXPIRE bug, and locks done right.', 'lam') },
]);
