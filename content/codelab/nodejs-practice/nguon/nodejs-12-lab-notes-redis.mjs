/** Node.js · Lab Chương 12 — Lớp Redis của Notes API: cache ghi chú (âm + jitter + single-flight + xoá khi ghi), middleware giới hạn tần suất fail-open, job đêm chạy một lần bằng khoá. */
import { modul, jsBai, c, TN, tn, FAKE_REDIS, FAKE_HTTP } from './_node-c12-14.mjs';

const FAKE_NOTES_DB = `// fake-notes-db.js — PROVIDED (loaded before answer.js). The Notes API's PostgreSQL, slow on purpose.
//   await db.findNote(id)          → { id, title, views } | null      (20 ms)
//   await db.updateNote(id, patch) → the updated note | null           (20 ms)
//   await db.leaderboard()         → top 20 by views                   (48 ms)
//   db.calls — { findNote, updateNote, leaderboard } counters · db.fail = n ⇒ the next n calls reject
function makeNotesDb(notes) {
  const rows = new Map(notes.map((n) => [n.id, { ...n }]));
  const db = { calls: { findNote: 0, updateNote: 0, leaderboard: 0 }, fail: 0 };
  const wait = (ms, v) => new Promise((ok, no) => setTimeout(() => { if (db.fail > 0) { db.fail--; no(new Error('db timeout')); } else ok(v); }, ms));
  db.findNote = (id) => { db.calls.findNote++; return wait(20, rows.has(id) ? { ...rows.get(id) } : null); };
  db.updateNote = (id, patch) => { db.calls.updateNote++; const r = rows.get(id); if (r) Object.assign(r, patch); return wait(20, r ? { ...r } : null); };
  db.leaderboard = () => { db.calls.leaderboard++; return wait(48, [...rows.values()].sort((a, b) => b.views - a.views || a.id - b.id).slice(0, 20).map((n) => ({ id: n.id, views: n.views }))); };
  return db;
}
`;

const L1 = jsBai({
  ten: 'Lab 12 · 1 — The notes cache, all four betrayals handled', kho: 'HARD', phut: 35, dangBai: 'lab',
  en: `<p>Build the Redis layer of the Notes API in one factory, ${c('createNotesCache({ redis, db, rand })')}, returning three methods. Everything chapter 12 measured goes in here.</p>
<ul>
<li>${c('getNote(id)')} — cache-aside on ${c('note:<id>')}. A found note is cached with ${c('EX = 300 + Math.floor(rand() * 60)')} (jitter, 12.2); a missing note is cached as ${c('"null"')} with ${c('EX 30')} (negative caching); a cached ${c('"null"')} is a hit. Concurrent misses for the SAME id share one database call (single-flight per id); a failed load is not remembered.</li>
<li>${c('updateNote(id, patch)')} — write to the database first, then <b>delete</b> the cached copy with ${c('UNLINK')} (delete on write — never update the cache in place). Resolve to the updated note.</li>
<li>${c('getLeaderboard()')} — cache-aside on ${c('lb:top20')} with ${c('EX 60')} (TTL-only invalidation: stale for at most a minute is the product decision), also single-flight.</li>
</ul>
<p>${c('rand')} is injected so the jitter is testable. ${c('db.calls')} counts each kind of database call.</p>`,
  vi: `<p>Dựng lớp Redis của Notes API trong một hàm nhà máy, ${c('createNotesCache({ redis, db, rand })')}, trả về ba phương thức. Mọi thứ chương 12 đã đo đều nằm ở đây.</p>
<ul>
<li>${c('getNote(id)')} — cache-aside trên ${c('note:<id>')}. Ghi chú tìm thấy được cache với ${c('EX = 300 + Math.floor(rand() * 60)')} (jitter, 12.2); ghi chú không có được cache là ${c('"null"')} với ${c('EX 30')} (cache kết quả âm); một ${c('"null"')} trong cache là lần trúng. Các lần trượt đồng thời cho CÙNG một id dùng chung một lần gọi CSDL (single-flight theo id); lần nạp hỏng không được nhớ.</li>
<li>${c('updateNote(id, patch)')} — ghi CSDL trước, rồi <b>xoá</b> bản cache bằng ${c('UNLINK')} (xoá khi ghi — không bao giờ cập nhật cache tại chỗ). Resolve ra ghi chú đã cập nhật.</li>
<li>${c('getLeaderboard()')} — cache-aside trên ${c('lb:top20')} với ${c('EX 60')} (làm mới chỉ bằng TTL: cũ tối đa một phút là quyết định của sản phẩm), cũng single-flight.</li>
</ul>
<p>${c('rand')} được tiêm vào để jitter kiểm được. ${c('db.calls')} đếm từng loại lời gọi CSDL.</p>`,
  yc: [['Negative caching (30 s) and jittered TTL (300–359 s) for notes.', 'Cache âm (30 s) và TTL rung (300–359 s) cho ghi chú.'], ['Single-flight per key; failures are not cached.', 'Single-flight theo khoá; lần hỏng không bị nhớ.'], ['Database first, then UNLINK the key — in that order.', 'CSDL trước, rồi UNLINK khoá — đúng thứ tự đó.']],
  dauVao: ['{ redis: FakeRedis, db: makeNotesDb(…), rand: () => number }', '{ redis: FakeRedis, db: makeNotesDb(…), rand: () => number }'],
  dauRa: ['{ getNote(id), updateNote(id, patch), getLeaderboard() } — all async', '{ getNote(id), updateNote(id, patch), getLeaderboard() } — đều async'],
  goiY: [['Write one private helper once(key, load) that does the single-flight with a Map; both getNote and getLeaderboard use it.', 'Viết một hàm phụ riêng once(key, load) làm single-flight bằng một Map; cả getNote lẫn getLeaderboard dùng nó.'], ['For getNote the loader is: const n = await db.findNote(id); await redis.set(key, JSON.stringify(n), \'EX\', n ? 300 + Math.floor(rand() * 60) : 30); return n;', 'Với getNote hàm nạp là: const n = await db.findNote(id); await redis.set(key, JSON.stringify(n), \'EX\', n ? 300 + Math.floor(rand() * 60) : 30); return n;'], ['Delete AFTER the database write: deleting first lets a concurrent reader put the old row back into the cache before your update lands.', 'Xoá SAU khi ghi CSDL: xoá trước thì một người đọc đồng thời kịp đưa dòng cũ trở lại cache trước khi bản cập nhật của bạn tới.']],
  loi: [['Updating the cached JSON in place on write: two concurrent writers interleave and the cache holds a value that was never in the database.', 'Sửa JSON trong cache tại chỗ khi ghi: hai người ghi đồng thời đan xen và cache giữ một giá trị chưa từng có trong CSDL.'], ['One shared in-flight entry for all notes: a request for note 2 waits for — and returns — note 1.', 'Một mục đang-bay dùng chung cho mọi ghi chú: request cho ghi chú 2 chờ — và nhận về — ghi chú 1.'], ['Forgetting that a missing note must not be single-flighted forever: .finally() must clear the entry.', 'Quên rằng ghi chú không có cũng không được bám mãi: .finally() phải xoá mục đó.']],
  gt: ['The pieces are the chapter’s fixes, composed: cache-aside (12.2), the negative entry against random-id probes, jitter against synchronised expiry, single-flight against the stampede, and delete-on-write — the invalidation strategy for data a user will notice is stale. Keying the in-flight map by the cache key makes single-flight per note, not global. Deleting after the write is the ordering that leaves no window for the old row to be re-cached by your own update.', 'Các mảnh là các cách chữa của chương, ghép lại: cache-aside (12.2), bản ghi âm chống dò id ngẫu nhiên, jitter chống hết hạn đồng loạt, single-flight chống giẫm đạp, và xoá khi ghi — chiến lược làm mới cho dữ liệu mà người dùng sẽ thấy là cũ. Lấy khoá cache làm khoá của map đang-bay cho single-flight theo từng ghi chú, không phải toàn cục. Xoá sau khi ghi là thứ tự không chừa khe nào để dòng cũ bị chính bản cập nhật của bạn đưa trở lại cache.'],
  kn: ['cache-aside', 'single-flight', 'invalidation'], tns: [TN.cacheAside, TN.singleFlight, TN.jitter, tn('delete on write', 'xoá khi ghi', 'DEL/UNLINK khoá trong chính nhánh code thay đổi dữ liệu')],
  gia: { 'fake-redis.js': FAKE_REDIS, 'fake-notes-db.js': FAKE_NOTES_DB },
  dau: `/** The Redis layer of the Notes API. */
function createNotesCache({ redis, db, rand }) {
  // Write your solution here — a correct but naive first version
  async function getNote(id) {
    const hit = await redis.get(\`note:\${id}\`);
    if (hit) return JSON.parse(hit);
    const n = await db.findNote(id);
    if (n) await redis.set(\`note:\${id}\`, JSON.stringify(n), 'EX', 300);
    return n;
  }
  async function updateNote(id, patch) {
    const n = await db.updateNote(id, patch);
    await redis.set(\`note:\${id}\`, JSON.stringify(n));
    return n;
  }
  async function getLeaderboard() {
    const hit = await redis.get('lb:top20');
    if (hit) return JSON.parse(hit);
    const rows = await db.leaderboard();
    await redis.set('lb:top20', JSON.stringify(rows), 'EX', 60);
    return rows;
  }
  return { getNote, updateNote, getLeaderboard };
}
`,
  giai: `/** The Redis layer of the Notes API. */
function createNotesCache({ redis, db, rand }) {
  const inflight = new Map();                       // single-flight, keyed by CACHE KEY (per note, not global)

  /** cache-aside with single-flight: one load per key at a time, failures not remembered */
  async function cached(key, load) {
    const hit = await redis.get(key);
    if (hit !== null) return JSON.parse(hit);       // "null" is a hit too (negative caching)
    if (inflight.has(key)) return inflight.get(key);
    const p = load().finally(() => inflight.delete(key));   // success OR failure: forget the flight
    inflight.set(key, p);                           // no await between has() and set()
    return p;
  }

  function getNote(id) {
    const key = \`note:\${id}\`;
    return cached(key, async () => {
      const n = await db.findNote(id);
      // found: 300 s + 0–59 s of jitter · missing: a short negative entry so probes stop hitting the DB
      await redis.set(key, JSON.stringify(n), 'EX', n ? 300 + Math.floor(rand() * 60) : 30);
      return n;
    });
  }

  async function updateNote(id, patch) {
    const n = await db.updateNote(id, patch);       // 1. the database is the truth
    await redis.unlink(\`note:\${id}\`);              // 2. then drop the copy — never patch it in place
    return n;
  }

  function getLeaderboard() {
    return cached('lb:top20', async () => {
      const rows = await db.leaderboard();
      await redis.set('lb:top20', JSON.stringify(rows), 'EX', 60);   // TTL-only: stale ≤ 60 s is fine
      return rows;
    });
  }

  return { getNote, updateNote, getLeaderboard };
}
`,
  chung: `const redis = new FakeRedis();
const db = makeNotesDb(Array.from({ length: 30 }, (_, i) => ({ id: i + 1, title: 'note ' + (i + 1), views: (i * 37) % 101 })));
const seq = (xs) => { let i = 0; return () => xs[i++ % xs.length]; };
const nc = createNotesCache({ redis, db, rand: seq([0.5, 0.1, 0.99]) });`,
  cases: [
    { goi: `[await nc.getNote(3), await nc.getNote(3), db.calls.findNote, await redis.ttl('note:3')]`, moTa: ['Cache-aside with a jittered TTL (300 + 30)', 'Cache-aside với TTL rung (300 + 30)'] },
    { goi: `[await Promise.all(Array.from({ length: 50 }, () => nc.getNote(404))), db.calls.findNote, await redis.get('note:404'), await redis.ttl('note:404')].slice(1)`, moTa: ['50 concurrent probes of a missing note → 1 query, negative entry 30 s', '50 lần dò đồng thời một ghi chú không có → 1 truy vấn, bản ghi âm 30 s'] },
    { goi: `[await nc.getNote(5).then((n) => n.title), await nc.updateNote(5, { title: 'edited' }).then((n) => n.title), await redis.exists('note:5'), await nc.getNote(5).then((n) => n.title), db.calls]`, moTa: ['Update: database, then the cached copy is deleted; the next read sees the edit', 'Cập nhật: CSDL trước, rồi bản cache bị xoá; lần đọc sau thấy bản sửa'] },
    { goi: `[(await Promise.all(Array.from({ length: 100 }, () => nc.getLeaderboard()))).every((r) => r.length === 20), db.calls.leaderboard, await redis.ttl('lb:top20')]`, moTa: ['Leaderboard stampede → one query, TTL 60', 'Giẫm đạp bảng xếp hạng → một truy vấn, TTL 60'] },
    { goi: `[await Promise.all([nc.getNote(1), nc.getNote(2), nc.getNote(1), nc.getNote(2)]).then((r) => r.map((n) => n.id)), db.calls.findNote]`, an: true, moTa: ['Single-flight is per note, not global', 'Single-flight theo từng ghi chú, không toàn cục'] },
    { goi: `await (async () => { db.fail = 1; const r = await Promise.allSettled([nc.getNote(7), nc.getNote(7)]); const again = await nc.getNote(7); return [r.map((x) => x.status), again.id, db.calls.findNote]; })()`, an: true, moTa: ['A failed load is retried, not remembered', 'Lần nạp hỏng được thử lại, không bị nhớ'] },
    { goi: `await (async () => { await nc.getNote(9); await nc.getNote(10); await nc.getNote(11); return [await redis.ttl('note:9'), await redis.ttl('note:10'), await redis.ttl('note:11')]; })()`, an: true },
    { goi: `await (async () => { await nc.getLeaderboard(); await nc.updateNote(2, { views: 1000 }); const stale = (await nc.getLeaderboard())[0].id; await sleep(61000); const fresh = (await nc.getLeaderboard())[0].id; return [stale, fresh, db.calls.leaderboard]; })()`, an: true, timeoutMs: 600000 },
  ],
});

const L2 = jsBai({
  ten: 'Lab 12 · 2 — Rate-limit middleware that fails open', kho: 'HARD', phut: 30, dangBai: 'lab',
  en: `<p>Write the site’s HTTP limiter as Express middleware: ${c('rateLimit({ redis, limit, windowMs })')} returns ${c('async (req, res, next) => …')}.</p>
<ul>
<li><b>Key</b>: ${c('rl:general:<client>')}, where ${c('<client>')} is the <b>last</b> entry of ${c('X-Forwarded-For')} (trimmed) when the header is present — nginx appends the real address at the end, so the first entries can be forged — otherwise ${c('req.ip')}.</li>
<li><b>Count</b>: a fixed window, atomic (one ${c('redis.script')}: INCR, PEXPIRE on the first hit, and PTTL — return both the count and the remaining ms).</li>
<li><b>Headers</b> on every answered request: ${c('RateLimit-Limit')} and ${c('RateLimit-Remaining')} (${c('max(0, limit - count)')}).</li>
<li><b>Over the limit</b>: ${c('429')}, header ${c('Retry-After')} = ${c('Math.ceil(pttl / 1000)')} seconds, body ${c("{ error: 'TOO_MANY_REQUESTS' }")}; do not call ${c('next')}. Otherwise call ${c('next()')}.</li>
<li><b>Redis down</b>: log ${c("console.warn('rate limit skipped: ' + err.message)")} and call ${c('next()')} — a rate-limit outage must never become a site outage.</li>
</ul>`,
  vi: `<p>Viết bộ giới hạn HTTP của website dạng middleware Express: ${c('rateLimit({ redis, limit, windowMs })')} trả về ${c('async (req, res, next) => …')}.</p>
<ul>
<li><b>Khoá</b>: ${c('rl:general:<client>')}, trong đó ${c('<client>')} là mục <b>cuối</b> của ${c('X-Forwarded-For')} (đã cắt khoảng trắng) khi có header — nginx nối địa chỉ thật vào cuối, nên các mục đầu có thể bị giả — ngược lại là ${c('req.ip')}.</li>
<li><b>Đếm</b>: cửa sổ cố định, nguyên tử (một ${c('redis.script')}: INCR, PEXPIRE ở lần đầu, và PTTL — trả cả số đếm lẫn số ms còn lại).</li>
<li><b>Header</b> ở mọi request được trả lời: ${c('RateLimit-Limit')} và ${c('RateLimit-Remaining')} (${c('max(0, limit - count)')}).</li>
<li><b>Vượt giới hạn</b>: ${c('429')}, header ${c('Retry-After')} = ${c('Math.ceil(pttl / 1000)')} giây, body ${c("{ error: 'TOO_MANY_REQUESTS' }")}; không gọi ${c('next')}. Ngược lại gọi ${c('next()')}.</li>
<li><b>Redis sập</b>: ghi ${c("console.warn('rate limit skipped: ' + err.message)")} rồi gọi ${c('next()')} — sự cố bộ giới hạn không bao giờ được thành sự cố toàn trang.</li>
</ul>`,
  yc: [['Atomic count + TTL in one script (one round trip per request).', 'Đếm + TTL nguyên tử trong một kịch bản (mỗi request một vòng đi-về).'], ['Key on the last X-Forwarded-For entry.', 'Lấy khoá theo mục cuối của X-Forwarded-For.'], ['Fail open on Redis errors, with a warning.', 'Hỏng thì cho qua (fail-open) khi Redis lỗi, kèm cảnh báo.']],
  dauVao: ['{ redis, limit, windowMs } · then (req, res, next) from fake-http.js', '{ redis, limit, windowMs } · rồi (req, res, next) từ fake-http.js'],
  dauRa: ['middleware: async (req, res, next) => void', 'middleware: async (req, res, next) => void'],
  goiY: [['Client: const xff = req.headers[\'x-forwarded-for\']; const client = xff ? xff.split(\',\').pop().trim() : req.ip;', 'Client: const xff = req.headers[\'x-forwarded-for\']; const client = xff ? xff.split(\',\').pop().trim() : req.ip;'], ['Script: (r) => { const n = r.incr(key); if (n === 1) r.pexpire(key, windowMs); return [n, r.pttl(key)]; } — wrap the await in try/catch for the fail-open path, and call next() OUTSIDE that try so an error thrown by the next handler is not mistaken for a Redis outage.', 'Kịch bản: (r) => { const n = r.incr(key); if (n === 1) r.pexpire(key, windowMs); return [n, r.pttl(key)]; } — bọc lệnh await trong try/catch cho nhánh fail-open, và gọi next() NGOÀI khối try đó để lỗi do handler sau ném ra không bị nhầm là Redis sập.']],
  loi: [['Using the FIRST X-Forwarded-For entry: a client sends X-Forwarded-For: 1.2.3.4 and gets a fresh limit on every request.', 'Dùng mục ĐẦU của X-Forwarded-For: client gửi X-Forwarded-For: 1.2.3.4 là có giới hạn mới ở mỗi request.'], ['Letting a Redis error reach the error handler: Redis restarts for 10 seconds and every API call answers 500.', 'Để lỗi Redis chảy tới bộ xử lý lỗi: Redis khởi động lại 10 giây là mọi lời gọi API trả 500.'], ['Retry-After in milliseconds, or rounded down: clients retry too early and are rejected again.', 'Retry-After tính bằng mili-giây, hoặc làm tròn xuống: client thử lại quá sớm và lại bị từ chối.']],
  gt: ['The atomic script fixes the GET → SET race and the immortal-counter bug together, and returning PTTL from the same script gives an exact Retry-After without a second round trip. Keying on the last X-Forwarded-For entry is what the site does so the header cannot be spoofed; the fail-open wrapper is why a Redis outage logs a warning instead of taking the API down. The site raised its limit from 500 to 2,000 per 15 minutes after one user with many tabs locked their own IP out.', 'Kịch bản nguyên tử chữa cùng lúc cuộc đua GET → SET và lỗi bộ đếm bất tử, còn trả PTTL ngay trong kịch bản đó cho Retry-After chính xác mà không cần vòng đi-về thứ hai. Lấy khoá theo mục cuối của X-Forwarded-For là cách website làm để header không giả được; lớp fail-open là lý do Redis sập chỉ ghi một cảnh báo thay vì làm sập API. Website đã nâng giới hạn từ 500 lên 2.000 mỗi 15 phút sau khi một người mở nhiều tab tự khoá IP của mình.'],
  kn: ['middleware', 'rate limiting', 'fail-open'], tns: [tn('fail-open', 'hỏng thì cho qua', 'phụ thuộc phụ trợ hỏng thì bỏ qua kiểm tra, không chặn người dùng'), tn('Retry-After', 'thử lại sau', 'header nói client chờ bao nhiêu giây')],
  gia: { 'fake-redis.js': FAKE_REDIS, 'fake-http.js': FAKE_HTTP },
  dau: `/** Fixed-window rate limiting middleware. */
function rateLimit({ redis, limit, windowMs }) {
  // Write your solution here
  return async (req, res, next) => {
    const xff = req.headers['x-forwarded-for'];
    const key = \`rl:general:\${xff ? xff.split(',')[0].trim() : req.ip}\`;
    const count = await redis.incr(key);
    await redis.pexpire(key, windowMs);
    if (count > limit) return res.status(429).json({ error: 'TOO_MANY_REQUESTS' });
    next();
  };
}
`,
  giai: `/** Fixed-window rate limiting middleware (Redis), failing open. */
function rateLimit({ redis, limit, windowMs }) {
  return async (req, res, next) => {
    // nginx APPENDS the real client address: only the last entry can be trusted
    const xff = req.headers['x-forwarded-for'];
    const client = xff ? xff.split(',').pop().trim() : req.ip;
    const key = \`rl:general:\${client}\`;

    let count, pttl;
    try {
      // one atomic step: count, start the window on the first hit, and read what is left of it
      [count, pttl] = await redis.script((r) => {
        const n = r.incr(key);
        if (n === 1) r.pexpire(key, windowMs);
        return [n, r.pttl(key)];
      });
    } catch (err) {
      console.warn('rate limit skipped: ' + err.message);   // a limiter outage must not be a site outage
      return next();
    }

    res.set('RateLimit-Limit', limit);
    res.set('RateLimit-Remaining', Math.max(0, limit - count));
    if (count > limit) {
      res.set('Retry-After', Math.ceil(pttl / 1000));        // whole seconds, rounded UP
      return res.status(429).json({ error: 'TOO_MANY_REQUESTS' });
    }
    next();                                                   // outside the try: not a Redis error
  };
}
`,
  chung: `const redis = new FakeRedis();
const run = async (mw, reqOpts) => { const req = mkReq(reqOpts); const res = mkRes(); const next = mkNext(); await mw(req, res, next); return { status: res.statusCode, headers: res.headers, body: res.body, next: next.calls.length }; };`,
  cases: [
    { goi: `await (async () => { const mw = rateLimit({ redis, limit: 3, windowMs: 60000 }); const r = []; for (let i = 0; i < 4; i++) r.push(await run(mw, { ip: '14.191.170.161' })); return r; })()`, moTa: ['3 allowed with headers, the 4th gets 429 + Retry-After 60', '3 lần qua có header, lần 4 nhận 429 + Retry-After 60'] },
    { goi: `await (async () => { const mw = rateLimit({ redis, limit: 2, windowMs: 60000 }); const a = []; for (const fake of ['1.1.1.1', '2.2.2.2', '3.3.3.3']) a.push((await run(mw, { headers: { 'x-forwarded-for': fake + ', 203.0.113.9' } })).status); return [a, await redis.get('rl:general:203.0.113.9')]; })()`, moTa: ['Forged first XFF entries do not reset the limit', 'Mục XFF đầu bị giả không đặt lại giới hạn'] },
    { goi: `await (async () => { redis.down = true; const mw = rateLimit({ redis, limit: 1, windowMs: 1000 }); const r = await run(mw, { ip: '9.9.9.9' }); return [r.status, r.next, __log]; })()`, moTa: ['Redis down → next() and a warning (fail open)', 'Redis sập → next() và một cảnh báo (fail-open)'] },
    { goi: `await (async () => { const mw = rateLimit({ redis, limit: 50, windowMs: 1000 }); const r = await Promise.all(Array.from({ length: 80 }, () => run(mw, { ip: '5.5.5.5' }))); return [r.filter((x) => x.next === 1).length, r.filter((x) => x.status === 429).length, redis.roundTrips]; })()`, an: true, moTa: ['80 concurrent: exactly 50 pass, one round trip each', '80 đồng thời: đúng 50 qua, mỗi cái một vòng đi-về'] },
    { goi: `await (async () => { const mw = rateLimit({ redis, limit: 1, windowMs: 2500 }); await run(mw, { ip: '7.7.7.7' }); await sleep(1000); const r = await run(mw, { ip: '7.7.7.7' }); await sleep(1600); const after = await run(mw, { ip: '7.7.7.7' }); return [r.headers['retry-after'], r.headers['ratelimit-remaining'], after.status, after.next]; })()`, an: true },
  ],
});

const L3 = jsBai({
  ten: 'Lab 12 · 3 — The nightly report runs once, on any number of processes', kho: 'MEDIUM', phut: 20, dangBai: 'lab',
  en: `<p>Three backend processes all wake up at 03:00 and want to build the expensive nightly report (it calls a paid third-party API — the case where a distributed lock is the right tool, not INCR). Write ${c('withLock(redis, key, ttlMs, token, fn)')}:</p><ul><li>try to take the lock with ${c('SET key token PX ttlMs NX')}; if someone else holds it, resolve to ${c('{ ran: false }')} without calling ${c('fn')};</li><li>otherwise ${c('await fn()')} and resolve to ${c('{ ran: true, result }')};</li><li>always release in a ${c('finally')} — with compare-and-delete in one script, so a job that outlived its TTL cannot delete the lock of whoever took it next;</li><li>if ${c('fn')} throws, the lock is still released and the error is re-thrown.</li></ul>`,
  vi: `<p>Ba tiến trình backend cùng thức dậy lúc 03:00 và cùng muốn dựng báo cáo đêm tốn kém (nó gọi một API bên thứ ba trả phí — đúng trường hợp khoá phân tán là công cụ đúng, không phải INCR). Viết ${c('withLock(redis, key, ttlMs, token, fn)')}:</p><ul><li>thử giành khoá bằng ${c('SET key token PX ttlMs NX')}; nếu người khác đang giữ, resolve ra ${c('{ ran: false }')} và không gọi ${c('fn')};</li><li>ngược lại ${c('await fn()')} rồi resolve ra ${c('{ ran: true, result }')};</li><li>luôn mở khoá trong ${c('finally')} — bằng so-rồi-xoá trong một kịch bản, để job chạy quá TTL không xoá được khoá của người giành nó sau đó;</li><li>nếu ${c('fn')} ném lỗi, khoá vẫn được mở và lỗi được ném lại.</li></ul>`,
  yc: [['fn runs at most once while the lock is held.', 'fn chạy nhiều nhất một lần khi khoá đang được giữ.'], ['Release in finally, compare-and-delete.', 'Mở khoá trong finally, bằng so-rồi-xoá.'], ['Errors from fn propagate.', 'Lỗi của fn được truyền ra ngoài.']],
  dauVao: ['redis · key · ttlMs · token — unique per process · fn — async () => any', 'redis · key · ttlMs · token — duy nhất mỗi tiến trình · fn — async () => any'],
  dauRa: ['Promise<{ ran: false } | { ran: true, result }>', 'Promise<{ ran: false } | { ran: true, result }>'],
  goiY: [['const ok = await redis.set(key, token, \'PX\', ttlMs, \'NX\'); if (ok !== \'OK\') return { ran: false };', 'const ok = await redis.set(key, token, \'PX\', ttlMs, \'NX\'); if (ok !== \'OK\') return { ran: false };'], ['try { return { ran: true, result: await fn() }; } finally { await redis.script((r) => (r.get(key) === token ? r.del(key) : 0)); }', 'try { return { ran: true, result: await fn() }; } finally { await redis.script((r) => (r.get(key) === token ? r.del(key) : 0)); }']],
  loi: [['Releasing only after a success: one failed run and nobody can build the report until the TTL ends.', 'Chỉ mở khoá khi thành công: một lần chạy hỏng là không ai dựng được báo cáo tới khi hết TTL.'], ['Plain DEL in finally: a run that took longer than ttlMs deletes the lock of the process that legitimately took it next.', 'DEL thường trong finally: lần chạy lâu hơn ttlMs xoá khoá của tiến trình đã giành nó hợp lệ sau đó.'], ['return fn() inside try without await: finally runs before fn finishes, and the lock is released while the work is still going.', 'return fn() trong try mà không await: finally chạy trước khi fn xong, và khoá được mở trong lúc việc vẫn đang chạy.']],
  gt: ['The lock is a correctness tool only for work outside Redis, and only if the work fits in its TTL; the token plus compare-and-delete makes the release safe even when it does not. try/finally guarantees release on both outcomes, and awaiting fn inside the try is what keeps the lock held for the whole job.', 'Khoá chỉ là công cụ đúng đắn cho việc nằm ngoài Redis, và chỉ khi việc vừa trong TTL; token cộng so-rồi-xoá làm việc mở khoá an toàn kể cả khi không vừa. try/finally bảo đảm mở khoá ở cả hai kết cục, và await fn bên trong try là thứ giữ khoá suốt cả job.'],
  kn: ['distributed lock'], tns: [TN.lock, tn('critical section', 'vùng tới hạn', 'đoạn việc chỉ một bên được làm tại một thời điểm')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Run fn only if we get the lock. */
async function withLock(redis, key, ttlMs, token, fn) {
  // Write your solution here
  const ok = await redis.set(key, token, 'PX', ttlMs, 'NX');
  if (ok !== 'OK') return { ran: false };
  const result = await fn();
  await redis.del(key);
  return { ran: true, result };
}
`,
  giai: `/** Run fn only if we get the lock; always release it, and only if it is still ours. */
async function withLock(redis, key, ttlMs, token, fn) {
  const ok = await redis.set(key, token, 'PX', ttlMs, 'NX');   // NX: one owner · PX: a crash cannot block forever
  if (ok !== 'OK') return { ran: false };                       // another process is doing it
  try {
    return { ran: true, result: await fn() };                   // await INSIDE try: the lock covers the whole job
  } finally {
    // compare-and-delete in one atomic step — never delete a lock that expired and changed hands
    await redis.script((r) => (r.get(key) === token ? r.del(key) : 0));
  }
}
`,
  chung: `const redis = new FakeRedis();
let calls = 0;
const report = async () => { calls++; await sleep(200); return 'report-' + calls; };`,
  cases: [
    { goi: `[await Promise.all(['p1', 'p2', 'p3'].map((t) => withLock(redis, 'lock:nightly', 5000, t, report))), calls, await redis.exists('lock:nightly')]`, moTa: ['Three processes → the report is built once; lock released', 'Ba tiến trình → báo cáo dựng một lần; khoá được mở'] },
    { goi: `await (async () => { let err; try { await withLock(redis, 'lock:n', 5000, 'p1', async () => { throw new Error('API 503'); }); } catch (e) { err = e.message; } return [err, await redis.exists('lock:n'), (await withLock(redis, 'lock:n', 5000, 'p2', report)).ran]; })()`, moTa: ['fn throws → lock released, error re-thrown', 'fn ném lỗi → khoá được mở, lỗi được ném lại'] },
    { goi: `await (async () => { const slow = withLock(redis, 'lock:s', 100, 'p1', report); await sleep(150); const second = await redis.set('lock:s', 'p2', 'PX', 1000, 'NX'); await slow; return [second, await redis.get('lock:s')]; })()`, moTa: ['A run that outlived its TTL does not delete the next owner’s lock', 'Lần chạy quá TTL không xoá khoá của chủ kế tiếp'] },
    { goi: `await (async () => { const a = await withLock(redis, 'lock:q', 1000, 'p1', report); const b = await withLock(redis, 'lock:q', 1000, 'p2', report); return [a, b, calls]; })()`, an: true },
    { goi: `await (async () => { const holder = withLock(redis, 'lock:h', 1000, 'p1', report); await sleep(50); const other = await withLock(redis, 'lock:h', 1000, 'p2', report); await holder; return [other, calls, await redis.exists('lock:h')]; })()`, an: true },
  ],
});

export default modul('nodejs-12-lab-notes-redis', 'Lab 12 — The Redis layer of the Notes API', [L1, L2, L3], 'nodejs-12-6-van-hanh-production');
