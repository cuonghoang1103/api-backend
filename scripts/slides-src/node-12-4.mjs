/**
 * node-12-4 — Node.js · Chapter 12 · Lesson 12.4 "Atomicity: rate limiting and locks done right" (slide EN, đợt 9b — 01/11/2026).
 * MỘT deck, HAI tập: node-12-4 (slide 1–12) · node-12-4-2 (slide 13–24).
 *   A: ví dụ đời thường (hai thu ngân cùng đọc bảng) · con bug khởi đầu (thật: INCR 100/400 · GET→SET 500/0, bộ đếm 1) · vì sao (dòng thời gian xen kẽ) · INCR rồi EXPIRE (thật: TTL -1 vs Lua 60) ·
 *      Lua / MULTI · cửa sổ cố định (thật: 10 request lọt trong 283 ms) · khi nào quan trọng · cửa sổ trượt (thật: 5 + 0, sau 1 s lại cho qua) · RAM (thật: 103.672 vs 56 vs 88 byte) · bảng phần A
 *   B: token bucket (thật: 10 tức thì ⇒ 5, còn 0,02; chờ 600 ms ⇒ qua, còn 2,03) · giá mỗi lần kiểm (thật: 0,371 / 0,336 / 0,354 ms) · so ba thuật toán · khoá sai 1 (thật: kẹt mãi) ·
 *      khoá sai 2 (thật: DEL xoá khoá của worker-2) · khoá đúng (thật: xoá 0, rồi 1) · khoá có làm gì không (thật: không khoá 2 / có khoá 50 / INCR 50; 0,860 ms) · khoá không phải bảo đảm ·
 *      website (index.ts THẬT: failOpen, XFF phải nhất; quota MULTI 3 cặp) · API Design 12.4 (không đo lại) · bài tập · tóm tắt
 * Nguồn: nodejs-12-4-nguyen-tu-rate-limit-lock. Output THẬT: that/c12/{atomic,locks} (Node 22.23.3, ioredis 5.11.1, Redis 7.4.9 Docker node12-redis; 50 kết nối riêng cho 50 worker).
 * Khác web: 10 request lọt trong 283 ms (web ~300 ms) · cửa sổ trượt 1001 phần tử = 103.672 B (web 89.072) · token bucket 88 B (web 96) · giá mỗi lần kiểm 0,34–0,37 ms (web 0,27–0,31) ·
 *   không khoá ⇒ bộ đếm 2 (web 1) · lock+unlock 0,860 ms (web 0,657).
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, vsd, hai_phien, J, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-12-4', code: 'NODE 12.4', title: 'Atomicity: rate limiting and locks done right', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c12/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const SPAN = num(R('atomic', /^=> \d+ requests allowed within/), /within (\d+) ms/);
const MEM = { sw: num(R('atomic', /sliding window holding/), /= (\d+) bytes/), fx: num(R('atomic', /fixed window, 1 key/), /= (\d+) bytes/), tb: num(R('atomic', /token bucket, 1 hash/), /= (\d+) bytes/) };
const COST = ['fixed', 'sliding', 'token'].map((k) => num(R('atomic', new RegExp(`^${k} .*per check`)), /: ([\d.]+) ms/));
const LK = num(R('locks', /500 x lock/), /: ([\d.]+) ms each/);
const NOLOCK = num(R('locks', /^NO lock/), /counter = (\d+)/);
const WEB = readFileSync('/Users/admin/Downloads/api-backend/src/index.ts', 'utf8').split('\n');
const QWEB = readFileSync('/Users/admin/Downloads/api-backend/src/services/quota.service.ts', 'utf8').split('\n');
const f = (n) => n.toLocaleString('en-US');

const cuaSvg = `<svg data-k="cuaso" viewBox="0 0 1100 200" width="1100" height="200" font-family="Arial">
<rect x="20" y="40" width="520" height="90" rx="10" fill="${LAM}12" stroke="${LAM}" stroke-width="2.5"/><text x="280" y="30" text-anchor="middle" font-size="21" font-weight="700" fill="${LAM}">window …471 (one second)</text>
<rect x="560" y="40" width="520" height="90" rx="10" fill="${LAM}12" stroke="${LAM}" stroke-width="2.5"/><text x="820" y="30" text-anchor="middle" font-size="21" font-weight="700" fill="${LAM}">window …472</text>
${[0, 1, 2, 3, 4].map((i) => `<circle cx="${430 + i * 22}" cy="85" r="9" fill="${NODE}"/>`).join('')}
${[0, 1, 2, 3, 4].map((i) => `<circle cx="${590 + i * 22}" cy="85" r="9" fill="${NODE}"/>`).join('')}
<line x1="550" y1="34" x2="550" y2="150" stroke="${DO}" stroke-width="3" stroke-dasharray="7 6"/>
<path d="M420,150 L700,150" stroke="${DO}" stroke-width="4"/><text x="560" y="182" text-anchor="middle" font-size="22" font-weight="700" fill="${DO}">10 allowed in ${SPAN} ms — the limit says 5 per second</text>
</svg>`;

const binhSvg = `<svg data-k="binh" viewBox="0 0 1100 200" width="990" height="180" font-family="Arial">
<path d="M380,30 L380,170 Q380,190 400,190 L560,190 Q580,190 580,170 L580,30" fill="none" stroke="${LAM}" stroke-width="5"/>
${[0, 1, 2, 3, 4].map((i) => `<rect x="400" y="${160 - i * 30}" width="160" height="24" rx="5" fill="${NODE}"/>`).join('')}
<text x="480" y="22" text-anchor="middle" font-size="20" font-weight="700" fill="${LAM}">bucket: 5 tokens</text>
<text x="300" y="70" text-anchor="end" font-size="21" fill="#333">refill: 5 tokens / s</text><path d="M310,62 L370,62" stroke="#b85a2b" stroke-width="3" marker-end="url(#mt)"/>
<text x="610" y="110" font-size="21" fill="#333">each request takes 1 token</text><path d="M590,120 L700,150" stroke="#b85a2b" stroke-width="3"/>
<text x="720" y="160" font-size="21" font-weight="700" fill="${DO}">empty ⇒ 429</text>
<defs><marker id="mt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 12 — Redis: caching, TTL and atomicity', bai: '12.4' }, [
  { cover: true, t: 'Atomicity:<br>rate limiting and locks<br>done right', sub: 'Here Redis stops being an optimisation and becomes a correctness tool — but only if you know which operations are atomic and which only look it.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Why one command is atomic and a sequence of commands is not — 500 requests through a limit of 100</li>
<li>The INCR-then-EXPIRE bug that rate-limits one user forever</li>
<li>Three rate limiters in Lua: fixed window, sliding window, token bucket — measured</li>
<li>Distributed locks: three ways to get them wrong, the right one</li>
<li>When you do not need a lock at all</li>
</ul>` + box('Why it matters to you', 'Lesson 8.4 built a limiter that works — for ONE Node process. Run two and a limit of 5 per minute becomes 10. Redis fixes that, if you use it atomically.', 'lam') },

  { t: 'An everyday picture: two cashiers, one whiteboard', to: true, giua: true, body: hai_phien([
    ['1', 'reads the board: 99 sold', '', 'limit is 100'],
    ['2', '', 'reads the board: 99 sold', 'both see room for one more'],
    ['3', 'sells a ticket, writes 100', '', ''],
    ['4', '', 'sells a ticket, writes 100', '101 tickets sold, board says 100', '#fde8e8'],
  ], { a: 'cashier A', b: 'cashier B', fs: 21 }) +
    two(box('Read, decide, write', 'Each step is fine on its own. The bug lives in the GAP between reading and writing, where someone else acts on the same old number.', 'do2'),
      box('The fix', 'One step that reads AND writes: "add one and tell me the new number". In Redis that is INCR — or a Lua script.', 'xanh')) },

  { t: 'The bug that starts it all', to: true, giua: true, body: TT('c12/atomic', 2, 4, 'node atomic.mjs · 500 requests in parallel, limit 100 · real', { hl: [2, 3], n: 104, sm: false }) +
    two(J(`// ✗ GET → check → SET
const c = Number(await redis.get(key) ?? 0);
if (c >= 100) return false;
await redis.set(key, c + 1);`, { sm: false, hl: [2, 4] }), J(`// ✓ one atomic command
const c = await redis.incr(key);
return c <= 100;`, { sm: false, hl: [2] })) +
    box('All 500 passed a limit of 100 — and the counter says 1', 'All 500 read 0, all 500 decided they were under the limit, all 500 wrote 1. And it looks perfect in every test that sends one request at a time.', 'do2') },

  { t: 'Why: Redis is atomic per COMMAND, not per sequence', to: true, giua: true, body: hai_phien([
    ['1', 'GET rl → 0', '', ''],
    ['2', '', 'GET rl → 0', 'B reads the same old value'],
    ['3', 'SET rl 1', '', ''],
    ['4', '', 'SET rl 1', 'A\'s increment is lost', '#fde8e8'],
  ], { a: 'request A', b: 'request B', fs: 21 }) +
    cards([['One command = atomic', 'Redis runs one command at a time, start to finish (12.1). INCR reads, adds and writes as ONE step.'], ['A sequence is not', 'Other clients\' commands run between your GET and your SET.'], ['So', 'Make the whole check-then-act ONE command: INCR, SET … NX, or a Lua script.']], 3) },

  { t: 'The second bug: INCR, then EXPIRE', to: true, giua: true, body: TT('c12/atomic', 5, 7, 'node atomic.mjs · [2] the process dies between the two commands · real', { hl: [2, 3], n: 104, sm: false }) +
    J(`-- set the expiry only on the FIRST increment, in the same atomic step
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return c`, { sm: false, hl: [2, 3] }) +
    box('One user, 429 forever, nothing in the logs', 'If the process dies, the connection drops or the request is cancelled between INCR and EXPIRE, the key has no expiry and never resets. A real, common, baffling production bug.', 'do2') },

  { t: 'Two ways to make it one step', to: true, giua: true, body: two(J(`// MULTI/EXEC: queue, then run as a block
await redis.multi()
  .incr(key)
  .pexpire(key, 60000)
  .exec();`, { sm: false, hl: [2, 5] }), J(`// Lua: one script = one atomic command
redis.defineCommand('incrWithTtl', {
  numberOfKeys: 1, lua: LUA_INCR_TTL,
});
await redis.incrWithTtl(key, 60000);`, { sm: false, hl: [2, 5] })) +
    cards([['MULTI/EXEC', 'Both commands run as a block; nothing interleaves. No branching: it always re-sets the expiry.'], ['Lua', 'Runs INSIDE Redis as one command, can branch ("only on the first INCR"), one round trip.'], ['EVALSHA', 'Send the script body once, then call it by hash. ioredis defineCommand does this for you.']], 3) +
    box('The rule', 'Anything that reads a value and then writes based on it must be ONE step inside Redis.', 'xanh') },

  { t: 'Algorithm 1 — fixed window, and the hole at the boundary', to: true, giua: true, body: cuaSvg + TT('c12/atomic', 8, 10, 'node atomic.mjs · [3] key rl:bob:<second>, limit 5 per second · real', { hl: [2, 3], n: 104, sm: false }) +
    box('Simple, one key, 56 bytes — and measurably wrong', `Five requests at the end of one window, five at the start of the next: twice the limit in ${SPAN} ms.`, 'do2') },

  { t: 'Does the boundary hole matter?', to: true, giua: true, body: two(box('Usually not: API throttling', 'Protecting a server from a busy client: an occasional 2× burst at the edge of a window is harmless.', 'xanh'),
    box('Yes: anything security-sensitive', 'A login endpoint: 5 password guesses per second or 10 is a real difference. Use a precise algorithm there.', 'do2')) +
    flow([{ t: 'INCR rl:bob:1793519471', s: 'window #1: 5 allowed', mau: LAM }, { t: 'the second ticks over', s: 'a NEW key', mau: CAM }, { t: 'INCR rl:bob:1793519472', s: 'window #2: 5 more', mau: DO }], { h: 130 }) +
    box('The key name holds the window', 'rl:&lt;user&gt;:&lt;second&gt; — the 12.3 trick again: a new period is a new key, the old one expires.', 'lam') },

  { t: 'Algorithm 2 — sliding window with a sorted set', to: true, giua: true, body: J(`local key, now, win, limit = KEYS[1], tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', key, 0, now - win)   -- drop what slid out of the window
local n = redis.call('ZCARD', key)
if n < limit then
  redis.call('ZADD', key, now, ARGV[4])             -- ARGV[4] must be UNIQUE
  redis.call('PEXPIRE', key, win)
  return {1, n + 1}
end
return {0, n}`, { sm: false, hl: [2, 5] }) +
    TT('c12/atomic', 11, 13, 'node atomic.mjs · [4] the same boundary test · real', { hl: [2, 3], n: 104, sm: false }) },

  { t: 'Exact — and the price is RAM', to: true, giua: true, body: TT('c12/atomic', 14, 16, 'node atomic.mjs · [5] MEMORY USAGE … SAMPLES 0 for ONE user · real', { hl: [2], n: 104, sm: false }) +
    thanh([['sliding window, 1001', MEM.sw, DO, `${f(MEM.sw)} bytes`], ['token bucket', MEM.tb, NODE, `${MEM.tb} bytes`], ['fixed window', MEM.fx, NODE, `${MEM.fx} bytes`]], { w: 1100, x0: 280, wMax: 520, h0: 56, chu: 22, log: true, ghi: 'one user · log scale · real' }) +
    box(`10,000 active users × ${Math.round(MEM.sw / 1000)} KB ≈ ${(MEM.sw * 10000 / 1e9).toFixed(1)} GB`, 'One entry per request in the window: a limit of 1,000 means 1,000 entries. Use it where the limit is SMALL and correctness matters (login: 5 per 15 min), not for general API throttling.', 'do2') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['500 requests, limit 100, GET→SET', '500 allowed, counter 1', 'one atomic command, never read-then-write'],
    ['INCR, crash, EXPIRE', 'TTL -1: limited forever', 'Lua or MULTI: one step'],
    ['fixed window at the boundary', `10 allowed in ${SPAN} ms`, 'fine for throttling, not for login'],
    ['sliding window, one user', `${f(MEM.sw)} bytes`, 'exact, but only for small limits'],
  ], { co: 21 }) + cards([['INCR · SET … NX PX', 'atomic single commands'], ['MULTI / EXEC', 'a block, no branching'], ['Lua (EVALSHA)', 'a script = one command, can branch']], 3) + two(box('Remember', 'Each Redis command is atomic. Your SEQUENCE of commands is not.', 'xanh'), box('Next', 'Part 2: token bucket, the cost of each check, and distributed locks.', 'lam')) },

  // ───────────── phần B ─────────────
  { t: 'Algorithm 3 — token bucket, when you WANT bursts', to: true, giua: true, body: binhSvg + TT('c12/atomic', 17, 19, 'node atomic.mjs · [6] 5 tokens, refill 5 per second · real', { hl: [2, 3], n: 104, sm: false }) +
    two(box('What a public API wants', 'A page that fires 8 requests on load should succeed; a script hammering steadily should not. Idle clients may spend the whole bucket at once, then are held to the refill rate.', 'xanh'),
      box(`Two fields in one hash: ${MEM.tb} bytes`, 'tokens + last timestamp. Never per-request state, so it scales to any limit.', 'lam')) },

  { t: 'What each check costs', to: true, giua: true, body: TT('c12/atomic', 20, 23, 'node atomic.mjs · [7] 1,000 sequential checks · real', { hl: [2, 3, 4], n: 104, sm: false }) +
    thanh([['fixed (Lua INCR)', COST[0], LAM, `${COST[0]} ms`], ['sliding (Lua ZSET)', COST[1], LAM, `${COST[1]} ms`], ['token bucket (Lua HASH)', COST[2], LAM, `${COST[2]} ms`]], { w: 1100, x0: 300, wMax: 480, h0: 56, chu: 22, ghi: 'per check · real' }) +
    box('All three cost the same: one round trip', 'Lesson 12.1 again — the work inside Redis is invisible. Choose by memory and semantics, never by speed.', 'xanh') },

  { t: 'Three limiters, side by side', to: true, giua: true, body: bang(['', 'fixed window', 'sliding window', 'token bucket'], [
    ['state per user', `1 counter · ${MEM.fx} B`, `1 entry per request · ${f(MEM.sw)} B at 1001`, `2 fields · ${MEM.tb} B`],
    ['at the boundary', `up to 2× (10 in ${SPAN} ms)`, 'exact', 'bursts up to the bucket size, by design'],
    ['cost per check', `${COST[0]} ms`, `${COST[1]} ms`, `${COST[2]} ms`],
    ['use it for', 'general throttling', 'small, security-sensitive limits', 'public APIs that allow bursts'],
  ], { co: 21 }) + box('All three must be ONE atomic step', 'Each is a Lua script here. Split any of them into separate commands and you are back to 500 through a limit of 100.', 'cam') },

  { t: 'Locks, wrong #1 — a lock with no expiry', to: true, giua: true, body: TT('c12/locks', 2, 5, 'node locks.mjs · SETNX, then the holder crashes · real', { hl: [2, 4], n: 104, sm: false }) +
    vsd(J(`await redis.setnx('job:lock', 'worker-1');`, { sm: false }), J(`await redis.set('job:lock', token, 'PX', 30000, 'NX');`, { sm: false }), '✗ dies with the process', '✓ expires on its own') +
    flow([{ t: 'SETNX job:lock', s: 'worker-1 gets it', mau: NODE }, { t: 'worker-1 crashes', s: 'no DEL ever runs', mau: DO }, { t: 'TTL = -1', s: 'the lock never expires', mau: DO }, { t: 'every worker waits', s: 'forever', mau: DO }], { h: 120 }) +
    box('One crashed process = a lock held forever', 'Always SET key value PX &lt;ttl&gt; NX — never a bare SETNX.', 'do2') },

  { t: 'Locks, wrong #2 — releasing with a plain DEL', to: true, giua: true, body: TT('c12/locks', 6, 10, 'node locks.mjs · the job takes longer than the lock · real', { hl: [3, 4, 5], n: 104, sm: false }) +
    hai_phien([['0 ms', 'SET lock w1 PX 300 NX → OK', '', 'worker-1 starts a 400 ms job'], ['300', '', 'SET lock w2 PX 300 NX → OK', 'lock expired: TWO workers inside'], ['400', 'DEL lock → 1', '', 'deletes WORKER-2\'s lock', '#fde8e8']], { a: 'worker-1', b: 'worker-2', fs: 20 }) },

  { t: 'Right — a unique token + compare-and-delete in Lua', to: true, giua: true, body: J(`const LUA_UNLOCK = \`if redis.call('GET', KEYS[1]) == ARGV[1]
  then return redis.call('DEL', KEYS[1]) else return 0 end\`;
async function acquire(key, ttlMs) {
  const token = crypto.randomUUID();
  return (await redis.set(key, token, 'PX', ttlMs, 'NX')) ? token : null;
}
const release = (key, token) => redis.eval(LUA_UNLOCK, 1, key, token);`, { sm: false, hl: [1, 4] }) +
    TT('c12/locks', 11, 16, 'node locks.mjs · the same slow job, with tokens · real', { hl: [4, 5], n: 104, sm: false }) },

  { t: 'Does the lock actually do anything? Measure it.', to: true, giua: true, body: TT('c12/locks', 17, 20, 'node locks.mjs · 50 workers on 50 connections, each read-modify-write +1 with 5 ms of work · real', { hl: [2, 4], n: 104, sm: false }) +
    two(box(`Without a lock: ${NOLOCK} instead of 50`, 'Forty-eight increments lost. With the lock: 50, correct.', 'do2'),
      box('With INCR: 50 — and no lock at all', 'No token, no TTL tuning, no failure mode. Inside Redis, reach for an atomic command or a Lua script first.', 'xanh')) +
    TT('c12/locks', 21, 21, 'and the price of the lock itself · real', { hl: [1], n: 104, sm: false }) },

  { t: 'A Redis lock is not a guarantee', to: true, giua: true, body: cards([
    ['The job can outlive the lock', 'Wrong #2 is exactly that: no Lua can fix a lock that has already expired.'],
    ['Make the work idempotent', 'Running twice must be harmless — then an occasional overlap does no damage.'],
    ['Or renew while working', 'Extend the TTL periodically; abort the job if the renewal fails.'],
    ['Correctness on the line?', 'Use the database: a transaction + a UNIQUE constraint (P2002 in lesson 7.3). Redlock across several Redis nodes is still debated.'],
  ], 2) + box('When a distributed lock IS the answer', 'The critical section touches something OUTSIDE Redis: a third-party API that must be called once, a file, a 10-second report.', 'lam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: J([447, 448, 449, "      logger.warn('rate limiter store error — failing open', …);", 453, 454, 455, 456, 464, 465, 466, 467].map((n) => typeof n === 'string' ? n : WEB[n - 1]).join('\n'), { sm: false, hl: [1, 5, 11, 12] }) +
    two(box('HTTP limiter: fixed window, fail-OPEN', 'src/index.ts (real lines): rate-limit-redis, 2,000 per 15 min per IP (RIGHTMOST X-Forwarded-For). Redis down ⇒ warn, let it through.', 'lam'),
      box('Quota: MULTI with three INCR + EXPIRE', 'quota.service.ts: minute (65 s), day, month counters for AI usage — atomic, immune to the INCR-then-EXPIRE bug.', 'xanh')) },

  { t: 'Making check-then-act atomic', to: true, giua: true, body: flow([
    { t: '1 read-then-write', s: 'a race under load', mau: DO }, { t: '2 one command', s: 'INCR: no gap', mau: NODE }, { t: '3 two commands', s: 'INCR then EXPIRE: a gap', mau: DO }, { t: '4 Lua / options', s: 'SET NX PX, a script', mau: NODE }], { h: 140 }) +
    box('API Design 12.4 applies it to a real API', 'The same atomic token bucket behind two instances: one Lua script that takes the clock from Redis TIME, 5 × 201 then 429 whichever instance answers — and the API keeps taking bookings when Redis is down. Not re-measured here.', 'lam') +
    box('Already seen in SDN302 8.2?', 'There express-rate-limit counts per IP in memory. Here you built the limiter yourself, shared by every process.', 'cam') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A password-reset endpoint must allow at most 3 requests per email per 15 minutes, across 4 Node processes. Another endpoint, GET /search, should allow bursts of 20 and then 5 per second per user. A nightly job must send ONE summary email even though all 4 processes run the scheduler. Pick an algorithm or tool for each and say why.', '') +
    `<div data-k="dapan">${box('Answer', 'Reset: sliding window (ZSET + Lua) on rl:reset:&lt;email&gt; — tiny limit, security-sensitive, exact at the boundary; ~3 entries per email. Search: token bucket (Lua, HASH, capacity 20, refill 5/s) — bursts by design, 2 fields per user. Nightly email: a lock SET job:digest:&lt;date&gt; &lt;token&gt; PX … NX + Lua release — or better, make the send idempotent with a row UNIQUE(date) in Postgres, so a second run is harmless.', 'xanh')}</div>` },

  { t: 'Atomicity — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['GET → check → SET, 500 in parallel', '500 through a limit of 100', 'INCR or a Lua script'],
    ['INCR then EXPIRE, crash in between', 'TTL -1, limited forever', 'one step: Lua / MULTI'],
    ['fixed · sliding · token bucket', `${COST.join(' · ')} ms per check`, 'choose by memory and semantics'],
    ['DEL releases a lock', 'deletes another worker\'s lock', 'token + compare-and-delete in Lua'],
    ['50 workers, no lock / lock / INCR', `${NOLOCK} / 50 / 50`, 'prefer atomic commands to locks'],
  ], { co: 21 }) + box('Next: 12.5 — Pub/Sub and Streams', 'The adapter of chapter 11 was Pub/Sub. Why the same mechanism is completely wrong for a job queue — and what a Stream remembers.', 'lam') },
]);
