/** Node.js · 12.4 — Tính nguyên tử: cuộc đua GET→kiểm→SET, INCR rồi EXPIRE, ba thuật toán giới hạn, khoá phân tán có token. */
import { modul, cs, q, tn, jsBai, c, TN, FAKE_REDIS } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '12.4 · Atomic or merely looks like it?', kho: 'EASY', phut: 10,
  en: 'Redis runs one command at a time. That makes each COMMAND atomic — not your sequence of commands. Each question is a measurement from the lesson.',
  vi: 'Redis chạy một lệnh mỗi lúc. Điều đó làm từng LỆNH nguyên tử — không làm chuỗi lệnh của bạn nguyên tử. Mỗi câu là một phép đo trong bài.',
  cau: [
    q('c1', ['500 concurrent requests against a limit of 100, implemented as GET → check → SET. What happened?', '500 request đồng thời với giới hạn 100, cài bằng GET → kiểm → SET. Chuyện gì xảy ra?'],
      ['All 500 passed and the counter ended at 1 — everyone read 0, decided “under the limit”, and wrote 1', 'Exactly 100 passed, because Redis serialises the GET and the SET of each client', '100 passed and the counter ended at 500, the same as INCR', 'Redis rejected 400 SETs with a WRONGTYPE error'],
      ['Other clients run between your GET and your SET. The limiter did nothing at all — and every one-request-at-a-time test passed.', 'Các client khác chạy giữa GET và SET của bạn. Bộ giới hạn không làm gì cả — mà mọi test một-request-mỗi-lần vẫn qua.']),
    q('c2', ['INCR then EXPIRE as two commands. The process dies between them. What is the consequence?', 'INCR rồi EXPIRE là hai lệnh. Tiến trình chết giữa hai lệnh. Hậu quả là gì?'],
      ['The key has TTL -1: it never resets and that user is rate-limited forever', 'Nothing: Redis applies a default TTL of 60 s to counters', 'The counter is rolled back because the second command never arrived', 'The next INCR fails with an error until someone sets an expiry'],
      ['One user permanently 429, nothing in the logs. Fix: MULTI/EXEC, or a Lua script that sets the expiry on the first increment — one atomic command, one round trip.', 'Một người dùng 429 vĩnh viễn, log không có gì. Chữa: MULTI/EXEC, hoặc kịch bản Lua đặt hạn ở lần tăng đầu tiên — một lệnh nguyên tử, một vòng đi-về.']),
    q('c3', ['A fixed window of 5 requests per second. How many requests got through in ~300 ms around a window boundary?', 'Cửa sổ cố định 5 request mỗi giây. Bao nhiêu request lọt qua trong ~300 ms quanh ranh giới cửa sổ?'],
      ['10 — five at the end of one window, five at the start of the next', '5 — the counter is shared across both windows', '6 — one extra request because of clock skew', '0 — the second window rejects everything until the first one expires'],
      ['Double the configured limit at the boundary. Fine for API throttling, not for a login endpoint — use a sliding window there.', 'Gấp đôi giới hạn khai báo ở ranh giới. Ổn cho điều tiết API, không ổn cho endpoint đăng nhập — ở đó dùng cửa sổ trượt.']),
    q('c4', ['The sliding window (ZSET) is exact at the boundary. Why is it not the default for general API throttling?', 'Cửa sổ trượt (ZSET) chính xác ở ranh giới. Vì sao nó không phải mặc định cho điều tiết API chung?'],
      ['It stores one entry per request in the window: 89 KB for one user at a limit of 1,000 (vs 56 bytes for a fixed window)', 'It costs three round trips per check instead of one', 'Sorted sets cannot have a TTL, so the keys are never cleaned up', 'It needs Redis Cluster because a single node cannot sort timestamps'],
      ['All three algorithms cost one round trip (≈0.3 ms). Choose on memory and semantics: 10,000 users × 89 KB = 890 MB.', 'Cả ba thuật toán đều một vòng đi-về (≈0,3 ms). Chọn theo bộ nhớ và ngữ nghĩa: 10.000 người × 89 KB = 890 MB.']),
    q('c5', ['Worker-1 holds a lock with a 300 ms TTL, its job takes 400 ms, worker-2 takes the expired lock, then worker-1 calls DEL. What happens?', 'Worker-1 giữ khoá TTL 300 ms, job của nó mất 400 ms, worker-2 giành khoá đã hết hạn, rồi worker-1 gọi DEL. Chuyện gì xảy ra?'],
      ['Worker-1 deletes worker-2’s lock and the critical section is open to anyone', 'DEL fails because worker-1 no longer owns the key', 'Redis renews worker-1’s lock automatically while it is still running', 'Both workers block until the lock is released twice'],
      ['A lock must carry a unique token and be released by compare-and-delete in ONE atomic step (Lua). GET, compare in JavaScript, then DEL reintroduces the race.', 'Khoá phải mang token duy nhất và được mở bằng so-rồi-xoá trong MỘT bước nguyên tử (Lua). GET, so trong JavaScript, rồi DEL là đưa cuộc đua trở lại.']),
    q('c6', ['50 workers each add 1 to a counter (read-modify-write). No lock → 1, lock → 50, INCR → 50. What is the lesson’s conclusion?', '50 worker mỗi cái cộng 1 vào bộ đếm (đọc-sửa-ghi). Không khoá → 1, có khoá → 50, INCR → 50. Kết luận của bài là gì?'],
      ['The lock was never necessary: inside Redis use the atomic command or a script; a lock is for work OUTSIDE Redis', 'Always take a lock around Redis writes, because INCR is only atomic on a single node', 'Locks are faster than INCR because they batch the 50 updates', 'Use a lock with a 5 ms TTL so that it matches the work time'],
      ['INCR gives the same correct answer with no token, no TTL tuning and no failure mode. Locks are for a third-party call, a file, a ten-second report.', 'INCR cho cùng đáp án đúng mà không cần token, không phải chỉnh TTL, không có kiểu hỏng nào. Khoá dành cho cuộc gọi bên thứ ba, một tệp, một báo cáo mười giây.']),
  ],
  goiY: [['Ask: can another client run between my two commands?', 'Hỏi: client khác có chạy chen giữa hai lệnh của mình được không?'], ['A Lua script is ONE command for Redis.', 'Với Redis, một kịch bản Lua là MỘT lệnh.']],
  loi: [['Trusting a limiter because it passed tests that send one request at a time.', 'Tin một bộ giới hạn vì nó qua các test gửi một request mỗi lần.'], ['Taking a distributed lock for something INCR already does atomically.', 'Lấy khoá phân tán cho việc mà INCR đã làm nguyên tử sẵn.']],
  tns: [TN.atomic, TN.lua, TN.lock, tn('check-then-act', 'kiểm-rồi-làm', 'đọc, quyết định, ghi — để hở khe cho người khác chen vào')],
  kn: ['atomicity', 'rate limiting', 'locks'],
});

const E2 = jsBai({
  ten: '12.4 · An atomic fixed-window limiter', kho: 'MEDIUM', phut: 15,
  en: `<p>The starter is the GET → check → SET limiter of the lesson: correct one request at a time, useless under load. Rewrite ${c('allowFixed(redis, key, limit, windowMs)')} as ONE atomic step with ${c('redis.script(fn)')} — the stand-in for ${c('EVAL')} of the lesson’s Lua script:</p><pre>local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return c</pre><p>Inside ${c('script(fn)')}, ${c('r.incr(k)')} and ${c('r.pexpire(k, ms)')} run synchronously (no ${c('await')}). Resolve to ${c('{ allowed, count }')}: ${c('allowed')} is ${c('count <= limit')}.</p>`,
  vi: `<p>Code khởi đầu là bộ giới hạn GET → kiểm → SET của bài: đúng khi mỗi lần một request, vô dụng khi có tải. Viết lại ${c('allowFixed(redis, key, limit, windowMs)')} thành MỘT bước nguyên tử bằng ${c('redis.script(fn)')} — thứ đứng thay ${c('EVAL')} kịch bản Lua của bài:</p><pre>local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return c</pre><p>Bên trong ${c('script(fn)')}, ${c('r.incr(k)')} và ${c('r.pexpire(k, ms)')} chạy đồng bộ (không ${c('await')}). Resolve ra ${c('{ allowed, count }')}: ${c('allowed')} là ${c('count <= limit')}.</p>`,
  yc: [['300 concurrent calls with limit 100 → exactly 100 allowed.', '300 lời gọi đồng thời với giới hạn 100 → đúng 100 được qua.'], ['The expiry is set on the FIRST increment only, inside the same atomic step.', 'Hạn chỉ được đặt ở lần tăng ĐẦU TIÊN, trong cùng bước nguyên tử.'], ['One round trip per call.', 'Mỗi lần gọi một vòng đi-về.']],
  dauVao: ['redis · key — e.g. "rl:login:bob" · limit — number · windowMs — number', 'redis · key — vd "rl:login:bob" · limit — số · windowMs — số'],
  dauRa: ['Promise<{ allowed: boolean, count: number }>', 'Promise<{ allowed: boolean, count: number }>'],
  goiY: [['await redis.script((r) => { const c = r.incr(key); if (c === 1) r.pexpire(key, windowMs); return c; })', 'await redis.script((r) => { const c = r.incr(key); if (c === 1) r.pexpire(key, windowMs); return c; })'], ['Compare outside the script: return { allowed: count <= limit, count }.', 'So sánh ngoài kịch bản: return { allowed: count <= limit, count }.']],
  loi: [['await redis.incr(key) then await redis.pexpire(key, …): correct counts, two round trips, and a crash in between leaves a counter that never resets.', 'await redis.incr(key) rồi await redis.pexpire(key, …): đếm đúng, hai vòng đi-về, và sập giữa chừng để lại bộ đếm không bao giờ đặt lại.'], ['Calling PEXPIRE on every increment: the window slides forward on every request and a client that keeps retrying is never released.', 'Gọi PEXPIRE ở mọi lần tăng: cửa sổ trượt tới sau mỗi request và một client cứ thử lại không bao giờ được thả.'], ['Writing await inside the script function — a Lua script cannot wait for anything; the fake refuses it.', 'Viết await bên trong hàm kịch bản — kịch bản Lua không chờ được gì; bản giả từ chối nó.']],
  gt: ['INCR is atomic, so 300 concurrent increments produce 1…300 with no lost update; exactly the first 100 are ≤ limit. Doing INCR and PEXPIRE in one script makes the pair indivisible (no immortal counter) and costs one round trip instead of two. Setting the expiry only when c === 1 keeps the window fixed.', 'INCR là nguyên tử, nên 300 lần tăng đồng thời cho 1…300 mà không mất lần nào; đúng 100 cái đầu ≤ giới hạn. Gộp INCR và PEXPIRE vào một kịch bản làm cặp lệnh không thể tách (không có bộ đếm bất tử) và tốn một vòng đi-về thay vì hai. Chỉ đặt hạn khi c === 1 giữ cửa sổ cố định.'],
  kn: ['atomicity', 'fixed window'], tns: [TN.atomic, TN.lua, tn('fixed window', 'cửa sổ cố định', 'đếm theo từng ô thời gian — rò gấp đôi ở ranh giới')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Fixed-window rate limit: at most \`limit\` calls per window of windowMs. */
async function allowFixed(redis, key, limit, windowMs) {
  // Write your solution here — this is the lesson's broken limiter
  const count = Number(await redis.get(key)) || 0;
  if (count >= limit) return { allowed: false, count };
  await redis.set(key, count + 1, 'PX', windowMs);
  return { allowed: true, count: count + 1 };
}
`,
  giai: `/** Fixed-window rate limit: at most \`limit\` calls per window of windowMs. */
async function allowFixed(redis, key, limit, windowMs) {
  // ONE atomic step inside Redis (EVAL): nothing can run between the INCR and the PEXPIRE
  const count = await redis.script((r) => {
    const c = r.incr(key);                 // atomic: 300 concurrent callers get 1, 2, … 300
    if (c === 1) r.pexpire(key, windowMs); // the window starts at the FIRST request and stays fixed
    return c;
  });
  return { allowed: count <= limit, count };
}
`,
  chung: `const redis = new FakeRedis();
const burst = (n, key, limit, win) => Promise.all(Array.from({ length: n }, () => allowFixed(redis, key, limit, win)));`,
  cases: [
    { goi: `await burst(300, 'rl:api:1.2.3.4', 100, 60000).then((r) => [r.filter((x) => x.allowed).length, Math.max(...r.map((x) => x.count))])`, moTa: ['300 concurrent, limit 100 → exactly 100 allowed', '300 đồng thời, giới hạn 100 → đúng 100 được qua'] },
    { goi: `[await allowFixed(redis, 'rl:login:bob', 5, 60000), await redis.pttl('rl:login:bob') > 59000]`, moTa: ['The first call sets the window expiry', 'Lần gọi đầu đặt hạn của cửa sổ'] },
    { goi: `[await burst(10, 'k', 5, 1000).then((r) => r.filter((x) => x.allowed).length), await sleep(1001), await allowFixed(redis, 'k', 5, 1000)]`, moTa: ['After the window, a new window starts', 'Hết cửa sổ thì cửa sổ mới bắt đầu'] },
    { goi: `[await burst(250, 'rl:x', 100, 60000).then(() => redis.roundTrips), await redis.ttl('rl:x')]`, an: true, moTa: ['One round trip per call, TTL kept', 'Mỗi lần gọi một vòng đi-về, TTL được giữ'] },
    { goi: `await (async () => { await allowFixed(redis, 'w', 3, 1000); await sleep(600); await allowFixed(redis, 'w', 3, 1000); await allowFixed(redis, 'w', 3, 1000); await sleep(500); return [await allowFixed(redis, 'w', 3, 1000), await redis.pttl('w') > 900]; })()`, an: true, moTa: ['The window does not slide on later increments', 'Cửa sổ không trượt theo các lần tăng sau'] },
  ],
});

const E3 = jsBai({
  ten: '12.4 · Close the boundary hole: a sliding window', kho: 'HARD', phut: 20,
  en: `<p>A fixed window lets 10 requests through in ~300 ms around a boundary when the limit says 5 per second. The sliding window stores one timestamp per request in a sorted set and counts only those inside the last ${c('windowMs')}. Port the lesson’s Lua script to ${c('redis.script(fn)')}:</p><pre>ZREMRANGEBYSCORE key 0 (now - win)     -- drop what slid out
n = ZCARD key
if n &lt; limit then ZADD key now id; PEXPIRE key win; return {1, n + 1} end
return {0, n}</pre><p>Write ${c('allowSliding(redis, key, nowMs, windowMs, limit, requestId)')} → ${c('{ allowed, count }')}. ${c('requestId')} is unique per request (two requests in the same millisecond must not collapse into one member). ${c('nowMs')} is passed in — never read the clock inside a script.</p>`,
  vi: `<p>Cửa sổ cố định cho 10 request lọt trong ~300 ms quanh ranh giới khi giới hạn ghi 5 mỗi giây. Cửa sổ trượt lưu một mốc thời gian mỗi request trong sorted set và chỉ đếm những cái nằm trong ${c('windowMs')} vừa qua. Chuyển kịch bản Lua của bài sang ${c('redis.script(fn)')}:</p><pre>ZREMRANGEBYSCORE key 0 (now - win)     -- vứt những gì đã trôi ra
n = ZCARD key
if n &lt; limit then ZADD key now id; PEXPIRE key win; return {1, n + 1} end
return {0, n}</pre><p>Viết ${c('allowSliding(redis, key, nowMs, windowMs, limit, requestId)')} → ${c('{ allowed, count }')}. ${c('requestId')} là duy nhất cho mỗi request (hai request cùng một mili-giây không được gộp thành một phần tử). ${c('nowMs')} được truyền vào — đừng đọc đồng hồ bên trong kịch bản.</p>`,
  yc: [['Exactly the limit inside ANY window of windowMs, including across a boundary.', 'Đúng bằng giới hạn trong BẤT KỲ cửa sổ windowMs nào, kể cả qua ranh giới.'], ['A rejected request is NOT added to the set.', 'Request bị từ chối KHÔNG được thêm vào tập.'], ['The key expires after windowMs of silence (PEXPIRE on each accepted request).', 'Khoá hết hạn sau windowMs im lặng (PEXPIRE ở mỗi request được nhận).']],
  dauVao: ['redis · key · nowMs, windowMs, limit — numbers · requestId — unique string', 'redis · key · nowMs, windowMs, limit — số · requestId — chuỗi duy nhất'],
  dauRa: ['Promise<{ allowed: boolean, count: number }>', 'Promise<{ allowed: boolean, count: number }>'],
  goiY: [['Inside the script: r.zremrangebyscore(key, 0, nowMs - windowMs); const n = r.zcard(key);', 'Trong kịch bản: r.zremrangebyscore(key, 0, nowMs - windowMs); const n = r.zcard(key);'], ['Accept only when n < limit: r.zadd(key, nowMs, requestId); r.pexpire(key, windowMs); return { allowed: true, count: n + 1 }; otherwise return { allowed: false, count: n }.', 'Chỉ nhận khi n < limit: r.zadd(key, nowMs, requestId); r.pexpire(key, windowMs); return { allowed: true, count: n + 1 }; ngược lại return { allowed: false, count: n }.']],
  loi: [['Using the timestamp as the member: two requests in the same millisecond become one entry and the limit leaks.', 'Dùng mốc thời gian làm phần tử: hai request cùng mili-giây thành một mục và giới hạn bị rò.'], ['Adding the request before checking the count: rejected requests fill the window and a client that keeps retrying is locked out forever.', 'Thêm request trước khi kiểm số đếm: các request bị từ chối lấp đầy cửa sổ và client cứ thử lại bị khoá ngoài mãi mãi.'], ['Doing ZREMRANGEBYSCORE, ZCARD and ZADD as three awaited commands: the same check-then-act race as GET → SET, now with a sorted set.', 'Làm ZREMRANGEBYSCORE, ZCARD và ZADD bằng ba lệnh await: đúng cuộc đua kiểm-rồi-làm như GET → SET, giờ với sorted set.']],
  gt: ['The window is “the last windowMs before now”, not a calendar bucket, so the five requests before the boundary still count 160 ms after it — exactly the lesson’s “before boundary 5, after 160 ms 0”. The script makes trim + count + add one atomic decision. The price is memory: one member per accepted request, which is why the lesson keeps this for small, security-sensitive limits.', 'Cửa sổ là "windowMs vừa qua tính tới bây giờ", không phải ô lịch, nên năm request trước ranh giới vẫn được đếm 160 ms sau nó — đúng "trước ranh giới 5, sau 160 ms 0" của bài. Kịch bản biến cắt + đếm + thêm thành một quyết định nguyên tử. Cái giá là bộ nhớ: mỗi request được nhận một phần tử, vì thế bài chỉ dùng nó cho giới hạn nhỏ và nhạy cảm về bảo mật.'],
  kn: ['sliding window', 'sorted set', 'Lua'], tns: [tn('sliding window', 'cửa sổ trượt', 'đếm trong khoảng windowMs vừa qua — không rò ở ranh giới'), TN.lua],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Sliding-window limit (sorted set of request timestamps). */
async function allowSliding(redis, key, nowMs, windowMs, limit, requestId) {
  // Write your solution here — this is a FIXED window in disguise (calendar buckets)
  const bucket = \`\${key}:\${Math.floor(nowMs / windowMs)}\`;
  const count = await redis.script((r) => { const c = r.incr(bucket); if (c === 1) r.pexpire(bucket, windowMs); return c; });
  return { allowed: count <= limit, count: Math.min(count, limit) };
}
`,
  giai: `/** Sliding-window limit (sorted set of request timestamps). */
async function allowSliding(redis, key, nowMs, windowMs, limit, requestId) {
  return redis.script((r) => {                              // ONE atomic decision (EVAL)
    r.zremrangebyscore(key, 0, nowMs - windowMs);          // drop everything that slid out of the window
    const n = r.zcard(key);                                // requests still inside the last windowMs
    if (n < limit) {
      r.zadd(key, nowMs, requestId);                       // member must be UNIQUE — not the timestamp
      r.pexpire(key, windowMs);                            // idle users clean themselves up
      return { allowed: true, count: n + 1 };
    }
    return { allowed: false, count: n };                   // rejected requests are NOT recorded
  });
}
`,
  chung: `const redis = new FakeRedis();
let seq = 0;
const at = (ms, key = 'rl:login:bob', win = 1000, limit = 5) => allowSliding(redis, key, ms, win, limit, 'r' + (++seq));`,
  cases: [
    { goi: `await (async () => { const before = []; for (let t = 900; t < 950; t += 10) before.push((await at(t)).allowed); const after = []; for (let t = 1100; t < 1150; t += 10) after.push((await at(t)).allowed); return [before.filter(Boolean).length, after.filter(Boolean).length]; })()`, moTa: ['Boundary: 5 before 1000 ms, 0 just after (the fixed window would allow 5 more)', 'Ranh giới: 5 trước mốc 1000 ms, 0 ngay sau (cửa sổ cố định sẽ cho thêm 5)'] },
    { goi: `await (async () => { for (let i = 0; i < 5; i++) await at(100); const r = await at(1101); return [r, await redis.zcard('rl:login:bob')]; })()`, moTa: ['Five in the same millisecond all count; a full second later one is allowed again', 'Năm request cùng mili-giây đều được tính; tròn một giây sau lại cho qua một'] },
    { goi: `await (async () => { const r = []; for (let i = 0; i < 8; i++) r.push((await at(500 + i)).count); return [r, await redis.zcard('rl:login:bob')]; })()`, moTa: ['Rejected requests are not added', 'Request bị từ chối không được thêm vào'] },
    { goi: `await (async () => { const r = await Promise.all(Array.from({ length: 50 }, () => at(2000, 'rl:burst', 1000, 10))); return [r.filter((x) => x.allowed).length, await redis.pttl('rl:burst') > 0]; })()`, an: true },
    { goi: `await (async () => { await at(0, 'k2', 60000, 2); await at(30000, 'k2', 60000, 2); const a = await at(59999, 'k2', 60000, 2); const b = await at(60001, 'k2', 60000, 2); return [a.allowed, b.allowed, b.count]; })()`, an: true },
  ],
});

const E4 = jsBai({
  ten: '12.4 · A token bucket that allows bursts', kho: 'HARD', phut: 20,
  en: `<p>For a public API you usually want bursts: a page that fires eight requests on load should succeed, a script hammering you steadily should not. A bucket holds up to ${c('capacity')} tokens and refills at ${c('refillPerSec')} tokens per second; each request spends one. Two fields in a hash, 96 bytes per user. Write ${c('takeToken(redis, key, { capacity, refillPerSec }, nowMs)')} as one ${c('redis.script(fn)')}:</p><ol><li>read ${c('tokens')} and ${c('ts')} from the hash (missing ⇒ a FULL bucket at ${c('nowMs')});</li><li>refill: ${c('tokens = min(capacity, tokens + (nowMs - ts) / 1000 * refillPerSec)')};</li><li>if ${c('tokens >= 1')} spend one and allow, else deny;</li><li>write back ${c('tokens')} and ${c('ts = nowMs')}, and ${c('PEXPIRE')} the key after ${c('Math.ceil(capacity / refillPerSec * 1000)')} ms (an idle bucket is full anyway, so it can disappear).</li></ol><p>Resolve to ${c('{ allowed, tokens }')} with ${c('tokens')} rounded to 2 decimals.</p>`,
  vi: `<p>Với API công khai bạn thường muốn cho phép bùng phát: một trang bắn tám request khi tải phải thành công, một script nện đều đặn thì không. Một bình chứa tối đa ${c('capacity')} token và được nạp ${c('refillPerSec')} token mỗi giây; mỗi request tiêu một token. Hai trường trong một hash, 96 byte mỗi người. Viết ${c('takeToken(redis, key, { capacity, refillPerSec }, nowMs)')} bằng một ${c('redis.script(fn)')}:</p><ol><li>đọc ${c('tokens')} và ${c('ts')} trong hash (không có ⇒ bình ĐẦY tại ${c('nowMs')});</li><li>nạp: ${c('tokens = min(capacity, tokens + (nowMs - ts) / 1000 * refillPerSec)')};</li><li>nếu ${c('tokens >= 1')} tiêu một và cho qua, ngược lại từ chối;</li><li>ghi lại ${c('tokens')} và ${c('ts = nowMs')}, rồi ${c('PEXPIRE')} khoá sau ${c('Math.ceil(capacity / refillPerSec * 1000)')} ms (bình nhàn rỗi thì đằng nào cũng đầy, nên có thể biến mất).</li></ol><p>Resolve ra ${c('{ allowed, tokens }')} với ${c('tokens')} làm tròn 2 chữ số thập phân.</p>`,
  yc: [['10 instant requests on a fresh bucket of 5 → 5 allowed.', '10 request tức thì trên bình mới 5 token → 5 được qua.'], ['Refill is continuous: 600 ms at 5/s gives 3 tokens.', 'Nạp liên tục: 600 ms ở 5/s cho 3 token.'], ['Read, refill, spend and write in ONE atomic step.', 'Đọc, nạp, tiêu và ghi trong MỘT bước nguyên tử.']],
  dauVao: ['redis · key · { capacity, refillPerSec } · nowMs', 'redis · key · { capacity, refillPerSec } · nowMs'],
  dauRa: ['Promise<{ allowed: boolean, tokens: number }>', 'Promise<{ allowed: boolean, tokens: number }>'],
  goiY: [['const h = r.hgetall(key); let tokens = h.tokens === undefined ? capacity : Number(h.tokens); const ts = h.ts === undefined ? nowMs : Number(h.ts);', 'const h = r.hgetall(key); let tokens = h.tokens === undefined ? capacity : Number(h.tokens); const ts = h.ts === undefined ? nowMs : Number(h.ts);'], ['After deciding: r.hset(key, { tokens, ts: nowMs }); r.pexpire(key, Math.ceil(capacity / refillPerSec * 1000)); round with Math.round(tokens * 100) / 100 only in the RETURN value.', 'Sau khi quyết: r.hset(key, { tokens, ts: nowMs }); r.pexpire(key, Math.ceil(capacity / refillPerSec * 1000)); chỉ làm tròn bằng Math.round(tokens * 100) / 100 ở giá trị TRẢ VỀ.']],
  loi: [['Forgetting the cap: a user quiet for an hour gets 18,000 tokens and can burst far beyond capacity.', 'Quên chặn trần: người im lặng một giờ có 18.000 token và bùng vượt xa capacity.'], ['Rounding the stored value: small refills (0.004 tokens) are lost forever and a steady client is starved.', 'Làm tròn giá trị lưu: các lần nạp nhỏ (0,004 token) mất vĩnh viễn và client đều đặn bị bỏ đói.'], ['Reading the hash with one command and writing with another: two concurrent requests both see 1 token and both spend it.', 'Đọc hash bằng một lệnh, ghi bằng lệnh khác: hai request đồng thời cùng thấy 1 token và cùng tiêu nó.']],
  gt: ['The bucket stores only “how many tokens, as of when”, so it never needs per-request state; the refill is computed lazily from the elapsed time on the next request. Doing the whole read-refill-spend-write in one script removes the race, and the expiry equal to the time needed to refill to full lets idle users vanish without changing behaviour.', 'Bình chỉ lưu "bao nhiêu token, tính tới lúc nào", nên không bao giờ cần trạng thái theo từng request; phần nạp được tính lười từ thời gian đã trôi ở request kế tiếp. Làm trọn đọc-nạp-tiêu-ghi trong một kịch bản xoá cuộc đua, và hạn bằng thời gian nạp đầy cho phép người dùng nhàn rỗi biến mất mà không đổi hành vi.'],
  kn: ['token bucket', 'Lua'], tns: [tn('token bucket', 'bình token', 'cho bùng tới capacity, rồi bị bóp về tốc độ nạp'), TN.lua],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Token bucket in a hash { tokens, ts }. */
async function takeToken(redis, key, { capacity, refillPerSec }, nowMs) {
  // Write your solution here — this bucket never refills
  return redis.script((r) => {
    const h = r.hgetall(key);
    let tokens = h.tokens === undefined ? capacity : Number(h.tokens);
    const allowed = tokens >= 1;
    if (allowed) tokens -= 1;
    r.hset(key, { tokens, ts: nowMs });
    return { allowed, tokens };
  });
}
`,
  giai: `/** Token bucket in a hash { tokens, ts }. */
async function takeToken(redis, key, { capacity, refillPerSec }, nowMs) {
  return redis.script((r) => {                                // read → refill → spend → write: ONE atomic step
    const h = r.hgetall(key);
    let tokens = h.tokens === undefined ? capacity : Number(h.tokens);   // new user = full bucket
    const ts = h.ts === undefined ? nowMs : Number(h.ts);
    tokens = Math.min(capacity, tokens + ((nowMs - ts) / 1000) * refillPerSec);   // lazy refill, capped
    const allowed = tokens >= 1;
    if (allowed) tokens -= 1;
    r.hset(key, { tokens, ts: nowMs });                       // store the exact value — never round state
    r.pexpire(key, Math.ceil((capacity / refillPerSec) * 1000));   // idle long enough ⇒ full ⇒ may vanish
    return { allowed, tokens: Math.round(tokens * 100) / 100 };
  });
}
`,
  chung: `const redis = new FakeRedis();
const B = { capacity: 5, refillPerSec: 5 };`,
  cases: [
    { goi: `await (async () => { const r = []; for (let i = 0; i < 10; i++) r.push((await takeToken(redis, 'tb:ip1', B, 1000)).allowed); return r.filter(Boolean).length; })()`, moTa: ['10 instant requests → the bucket of 5 bursts empty', '10 request tức thì → bình 5 token bùng hết'] },
    { goi: `await (async () => { for (let i = 0; i < 5; i++) await takeToken(redis, 'tb:ip2', B, 1000); return takeToken(redis, 'tb:ip2', B, 1600); })()`, moTa: ['600 ms later: 3 tokens refilled, one spent → 2 left', '600 ms sau: nạp 3 token, tiêu một → còn 2'] },
    { goi: `[await takeToken(redis, 'tb:ip3', B, 0), await takeToken(redis, 'tb:ip3', B, 3600000), await redis.pttl('tb:ip3')]`, moTa: ['An hour of silence refills only up to capacity; TTL = time to refill', 'Một giờ im lặng chỉ nạp tới capacity; TTL = thời gian nạp đầy'] },
    { goi: `await (async () => { const r = await Promise.all(Array.from({ length: 12 }, () => takeToken(redis, 'tb:par', { capacity: 8, refillPerSec: 1 }, 5000))); return r.filter((x) => x.allowed).length; })()`, an: true },
    { goi: `await (async () => { const S = { capacity: 2, refillPerSec: 0.5 }; const out = []; for (const t of [0, 0, 0, 1000, 2000, 2500, 6500]) { const x = await takeToken(redis, 'tb:s', S, t); out.push(x.allowed + ':' + x.tokens); } return out; })()`, an: true },
  ],
});

const E5 = jsBai({
  ten: '12.4 · A lock you cannot release for someone else', kho: 'MEDIUM', phut: 15,
  en: `<p>Two ways to get a distributed lock wrong: no expiry (one crash and it is held forever) and unlocking with plain ${c('DEL')} (a slow worker deletes the lock of the worker that legitimately took it after expiry). Write:</p><ul><li>${c('acquire(redis, key, token, ttlMs)')} → ${c('true')} if this caller now holds the lock (${c("SET key token PX ttlMs NX")}), ${c('false')} if someone else holds it;</li><li>${c('release(redis, key, token)')} → ${c('1')} if it deleted ITS OWN lock, ${c('0')} otherwise — compare-and-delete in ONE ${c('redis.script(fn)')} (the lesson’s ${c("if GET == token then DEL")} Lua).</li></ul><p>In production the token is ${c('crypto.randomUUID()')}; here the caller passes it.</p>`,
  vi: `<p>Hai cách làm hỏng khoá phân tán: không có hạn (sập một lần là bị giữ mãi) và mở khoá bằng ${c('DEL')} thường (worker chậm xoá khoá của worker đã giành nó hợp lệ sau khi hết hạn). Viết:</p><ul><li>${c('acquire(redis, key, token, ttlMs)')} → ${c('true')} nếu người gọi giờ đang giữ khoá (${c("SET key token PX ttlMs NX")}), ${c('false')} nếu người khác đang giữ;</li><li>${c('release(redis, key, token)')} → ${c('1')} nếu đã xoá khoá CỦA CHÍNH MÌNH, ${c('0')} trong mọi trường hợp khác — so-rồi-xoá trong MỘT ${c('redis.script(fn)')} (Lua ${c("if GET == token then DEL")} của bài).</li></ul><p>Trên production token là ${c('crypto.randomUUID()')}; ở đây nơi gọi truyền vào.</p>`,
  yc: [['The lock always has an expiry.', 'Khoá luôn có hạn.'], ['release never deletes a lock held by another token.', 'release không bao giờ xoá khoá đang do token khác giữ.'], ['Check and delete happen in the same atomic step.', 'Kiểm và xoá xảy ra trong cùng một bước nguyên tử.']],
  dauVao: ['redis · key · token — string · ttlMs — number', 'redis · key · token — chuỗi · ttlMs — số'],
  dauRa: ['acquire → Promise<boolean> · release → Promise<0 | 1>', 'acquire → Promise<boolean> · release → Promise<0 | 1>'],
  goiY: [['acquire: (await redis.set(key, token, \'PX\', ttlMs, \'NX\')) === \'OK\'.', 'acquire: (await redis.set(key, token, \'PX\', ttlMs, \'NX\')) === \'OK\'.'], ['release: redis.script((r) => (r.get(key) === token ? r.del(key) : 0)).', 'release: redis.script((r) => (r.get(key) === token ? r.del(key) : 0)).']],
  loi: [['SET key token NX without PX (the old SETNX): a crashed holder leaves TTL -1 and everyone waits forever.', 'SET key token NX thiếu PX (SETNX cũ): người giữ bị sập để lại TTL -1 và mọi người chờ mãi.'], ['await redis.get(key) === token, then await redis.del(key): the lock can expire and be taken between the two commands — you delete the new owner’s lock.', 'await redis.get(key) === token, rồi await redis.del(key): khoá có thể hết hạn và bị người khác giành giữa hai lệnh — bạn xoá khoá của chủ mới.'], ['Believing the lock makes a slow job safe: if the job outlives the TTL, two workers run at once; make the work idempotent or renew the lock.', 'Tin rằng khoá làm job chậm an toàn: job sống lâu hơn TTL thì hai worker chạy cùng lúc; hãy làm việc luỹ đẳng hoặc gia hạn khoá.']],
  gt: ['NX gives mutual exclusion, PX guarantees a crashed holder cannot block forever, and the token proves ownership. The compare-and-delete must be ONE script because the lock can expire between a GET and a DEL. In the lesson’s run, worker-1 releasing after its TTL “deleted 0 keys” and the lock stayed with worker-2.', 'NX cho loại trừ lẫn nhau, PX bảo đảm người giữ bị sập không chặn mãi, và token chứng minh quyền sở hữu. So-rồi-xoá phải là MỘT kịch bản vì khoá có thể hết hạn giữa GET và DEL. Trong lần chạy của bài, worker-1 mở khoá sau khi hết TTL "xoá 0 khoá" và khoá vẫn thuộc worker-2.'],
  kn: ['distributed lock'], tns: [TN.lock, tn('compare-and-delete', 'so-rồi-xoá', 'chỉ xoá khi giá trị còn đúng là của mình — trong một bước')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Try to take the lock. */
async function acquire(redis, key, token, ttlMs) {
  // Write your solution here — both functions have one of the lesson's bugs
  return (await redis.set(key, token, 'NX')) === 'OK';
}

/** Release the lock only if we still own it. */
async function release(redis, key, token) {
  return redis.del(key);
}
`,
  giai: `/** Try to take the lock. */
async function acquire(redis, key, token, ttlMs) {
  // NX = only if nobody holds it · PX = a crashed holder cannot block everyone forever
  return (await redis.set(key, token, 'PX', ttlMs, 'NX')) === 'OK';
}

/** Release the lock only if we still own it. */
async function release(redis, key, token) {
  // compare-and-delete in ONE atomic step (EVAL): the lock cannot expire and change hands in between
  return redis.script((r) => (r.get(key) === token ? r.del(key) : 0));
}
`,
  chung: `const redis = new FakeRedis();`,
  cases: [
    { goi: `[await acquire(redis, 'lock:report', 'w1', 300), await acquire(redis, 'lock:report', 'w2', 300), await redis.pttl('lock:report') > 0]`, moTa: ['Second acquire fails; the lock has an expiry', 'Lần giành thứ hai thất bại; khoá có hạn'] },
    { goi: `await (async () => { await acquire(redis, 'lock:report', 'w1', 300); await sleep(400); const w2 = await acquire(redis, 'lock:report', 'w2', 300); const r1 = await release(redis, 'lock:report', 'w1'); return [w2, r1, await redis.get('lock:report'), await release(redis, 'lock:report', 'w2'), await redis.exists('lock:report')]; })()`, moTa: ['The lesson’s scenario: worker-1 releases late → deletes 0, lock stays with worker-2', 'Kịch bản của bài: worker-1 mở muộn → xoá 0, khoá vẫn của worker-2'] },
    { goi: `await (async () => { await acquire(redis, 'lock:crash', 'w1', 500); await sleep(501); return acquire(redis, 'lock:crash', 'w9', 500); })()`, moTa: ['A crashed holder does not block forever', 'Người giữ bị sập không chặn mãi'] },
    { goi: `await (async () => { const got = await Promise.all(['a', 'b', 'c', 'd'].map((t) => acquire(redis, 'lock:x', t, 1000))); const owner = await redis.get('lock:x'); const rel = await Promise.all(['a', 'b', 'c', 'd'].map((t) => release(redis, 'lock:x', t))); return [got.filter(Boolean).length, rel.reduce((x, y) => x + y, 0), owner === ['a', 'b', 'c', 'd'][got.indexOf(true)]]; })()`, an: true },
    { goi: `[await release(redis, 'lock:none', 'w1'), await acquire(redis, 'lock:y', 't1', 1000), await release(redis, 'lock:y', 't1'), await acquire(redis, 'lock:y', 't2', 1000)]`, an: true },
  ],
});

export default modul('nodejs-12-4-nguyen-tu-rate-limit-lock', '12.4 Atomic rate limiting and safe distributed locks', [E1, E2, E3, E4, E5]);
