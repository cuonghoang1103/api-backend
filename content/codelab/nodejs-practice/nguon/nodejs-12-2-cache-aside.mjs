/** Node.js · 12.2 — Cache-aside và bốn lần phản chủ: payload lớn, tỉ lệ trúng phi tuyến, SET xoá TTL, cơn giẫm đạp. */
import { modul, cs, q, tn, jsBai, c, TN, FAKE_REDIS, FAKE_DB } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '12.2 · Cache-aside: when it wins, when it betrays you', kho: 'EASY', phut: 10,
  en: 'The lesson measured cache-aside on a real PostgreSQL with 500,000 notes. Each question below is one of those measurements — decide what it means before you read the explanation.',
  vi: 'Bài học đo cache-aside trên PostgreSQL thật với 500.000 ghi chú. Mỗi câu dưới đây là một phép đo — tự quyết định ý nghĩa của nó trước khi đọc giải thích.',
  cau: [
    q('c1', ['The leaderboard (GROUP BY over 500k rows) takes 48.04 ms; the homepage “20 newest notes” takes 0.46 ms thanks to an index. Which one should you cache?', 'Bảng xếp hạng (GROUP BY trên 500k dòng) mất 48,04 ms; trang chủ "20 ghi chú mới nhất" mất 0,46 ms nhờ chỉ mục. Nên cache cái nào?'],
      ['The leaderboard — cache what is expensive to COMPUTE; caching the indexed lookup saves 0.06 ms and adds an invalidation bug', 'Both, because every query becomes 120× faster once it is served from Redis', 'The homepage, because it is requested far more often than the leaderboard', 'Neither, because Redis GET + JSON.parse is always slower than an indexed query'],
      ['Redis answered the leaderboard in 0.40 ms (120×). The indexed query is already 0.46 ms; the cache would buy almost nothing and add a stale-data story.', 'Redis trả bảng xếp hạng trong 0,40 ms (120×). Truy vấn có chỉ mục vốn đã 0,46 ms; cache gần như không mua thêm gì mà thêm một câu chuyện dữ liệu cũ.']),
    q('c2', ['Caching 5,000 notes with their bodies (1,192 KB): GET 4.45 ms + JSON.parse 1.93 ms = 6.39 ms, while Postgres returns them in 5.38 ms. What is the lesson?', 'Cache 5.000 ghi chú kèm nội dung (1.192 KB): GET 4,45 ms + JSON.parse 1,93 ms = 6,39 ms, trong khi Postgres trả trong 5,38 ms. Bài học là gì?'],
      ['Postgres is slow at aggregating, not at streaming rows — a large, cheap-to-fetch result should not be cached', 'Redis is slow for values above 1 KB, so every value must be compressed before SET', 'JSON.parse is the bottleneck, so cached values should be stored as Hashes instead', 'The measurement is noise; a cache is always faster once it is warm'],
      ['The cache LOST (0.8×). Once transfer and parsing dominate, the cache is a second network hop with extra steps.', 'Cache THUA (0,8×). Khi truyền và parse chiếm phần lớn, cache chỉ là thêm một chặng mạng nữa.']),
    q('c3', ['At a 90% hit rate the endpoint averaged 5.19 ms; at 99%, 0.43 ms. Why is 90% twelve times worse?', 'Ở tỉ lệ trúng 90% trung bình 5,19 ms; ở 99% là 0,43 ms. Vì sao 90% tệ hơn mười hai lần?'],
      ['One request in ten still pays the full 48 ms miss, and that one dominates the average — alert on misses per second', 'At 90% Redis evicts keys more aggressively, so every hit is slower', 'Hit rates below 95% disable ioredis auto-pipelining', 'The 10% of misses each trigger a stampede of 200 queries'],
      ['0.9 × 0.4 + 0.1 × 48 ≈ 5.2 ms. The miss cost, not the hit cost, decides the average.', '0,9 × 0,4 + 0,1 × 48 ≈ 5,2 ms. Chi phí lần trượt, không phải lần trúng, quyết định trung bình.']),
    q('c4', ['A key had TTL 100. A refresh path runs SET key newValue (no EX). What does TTL key return now?', 'Một khoá có TTL 100. Một nhánh làm mới chạy SET key giáTrịMới (không có EX). TTL key giờ trả về gì?'],
      ['-1 — the key now lives forever; use KEEPTTL to keep the deadline', '100 — SET only changes the value and never touches the expiry', '-2 — SET without EX deletes the key once the reply is sent', '0 — the key expires immediately and the next GET returns null'],
      ['-2 means gone, -1 means immortal. A plain SET over an existing key removes its expiry; one forgotten EX slowly fills Redis with immortal stale entries.', '-2 là đã mất, -1 là bất tử. SET thường đè lên khoá có sẵn sẽ xoá hạn của nó; quên một EX là Redis dần đầy những bản cũ bất tử.']),
    q('c5', ['200 concurrent requests hit an empty cache. Naive cache-aside: 200 Postgres queries, 6,064 ms. In-process single-flight: 1 query, 65 ms. Why can single-flight use a plain Map with no lock?', '200 request đồng thời gặp cache rỗng. Cache-aside ngây thơ: 200 truy vấn, 6.064 ms. Single-flight trong tiến trình: 1 truy vấn, 65 ms. Vì sao single-flight dùng được Map thường, không cần khoá?'],
      ['The event loop runs one callback at a time, so nothing runs between inflight.has() and inflight.set()', 'Map operations are atomic in V8 because they are implemented in C++', 'Redis serialises the 200 requests before they reach Node', 'Promises are executed on separate threads, each with its own Map'],
      ['Synchronous code between two awaits cannot be interleaved. The limit is in the name: four Node processes still make four queries — use a Redis lock (SET NX PX) across the fleet.', 'Code đồng bộ giữa hai await không bị chen ngang. Giới hạn nằm ở tên gọi: bốn tiến trình Node vẫn ra bốn truy vấn — dùng khoá Redis (SET NX PX) cho cả cụm.']),
    q('c6', ['GET user:99999 misses, and the database has no such user. What should the cache do?', 'GET user:99999 trượt, và CSDL không có người dùng đó. Cache nên làm gì?'],
      ['Cache the negative result with a short TTL (SET user:99999 "null" EX 30) and test misses with hit !== null', 'Nothing — caching a missing row would hide new sign-ups forever', 'Throw 404 from the cache layer so the database is never asked again', 'Store an empty string, because if (!hit) will then skip the database'],
      ['Without a negative entry every request for a non-existent id goes to the database forever — random ids turn the cache into a pass-through. A short TTL keeps new sign-ups visible quickly.', 'Không có bản ghi âm thì mọi request cho id không tồn tại đều xuống CSDL mãi mãi — id ngẫu nhiên biến cache thành ống dẫn thẳng. TTL ngắn giúp người mới đăng ký sớm hiện ra.']),
  ],
  goiY: [['Compute: average = hit% × hit cost + miss% × miss cost.', 'Tính: trung bình = %trúng × giá trúng + %trượt × giá trượt.'], ['Remember the two magic TTL numbers: -2 gone, -1 immortal.', 'Nhớ hai số TTL: -2 đã mất, -1 bất tử.']],
  loi: [['Caching an indexed lookup "because Redis is faster" — it adds staleness and saves nothing.', 'Cache một truy vấn có chỉ mục "vì Redis nhanh hơn" — thêm dữ liệu cũ mà không tiết kiệm gì.'], ['Celebrating a 90% hit rate while the misses still dominate latency.', 'Ăn mừng tỉ lệ trúng 90% trong khi lần trượt vẫn quyết định độ trễ.']],
  tns: [TN.cacheAside, TN.ttl, TN.stampede, tn('hit rate', 'tỉ lệ trúng', 'phần request được cache trả lời — lợi ích phi tuyến gần 100%')],
  kn: ['cache-aside', 'TTL', 'stampede'],
});

const E2 = jsBai({
  ten: '12.2 · Cache-aside in four lines — with a TTL', kho: 'EASY', phut: 10,
  en: `<p>The leaderboard query costs 48 ms (the fake ${c('db.leaderboard()')} waits 48 ms of virtual time and counts ${c('db.calls')}). Write ${c('getLeaderboard(redis, db)')} with the cache-aside pattern:</p><ol><li>${c("GET lb:top20")};</li><li>hit (the reply is not ${c('null')}) → return the parsed rows;</li><li>miss → ask the database;</li><li>write the JSON back <b>with an expiry of 60 seconds</b>, then return the rows.</li></ol><p>"Stale for at most 60 seconds is fine" is the invalidation strategy here, so the expiry is not optional: without it the first leaderboard ever computed is served forever.</p>`,
  vi: `<p>Truy vấn bảng xếp hạng tốn 48 ms (${c('db.leaderboard()')} giả chờ 48 ms giờ ảo và đếm ${c('db.calls')}). Viết ${c('getLeaderboard(redis, db)')} theo khuôn cache-aside:</p><ol><li>${c("GET lb:top20")};</li><li>trúng (câu trả lời khác ${c('null')}) → trả các dòng đã parse;</li><li>trượt → hỏi CSDL;</li><li>ghi JSON trở lại <b>với hạn 60 giây</b>, rồi trả các dòng.</li></ol><p>"Cũ tối đa 60 giây là chấp nhận được" chính là chiến lược làm mới ở đây, nên hạn không phải tuỳ chọn: thiếu nó thì bảng xếp hạng đầu tiên từng tính sẽ được phục vụ mãi mãi.</p>`,
  yc: [['Key: lb:top20. TTL: 60 seconds (EX 60).', 'Khoá: lb:top20. TTL: 60 giây (EX 60).'], ['A hit must not touch the database.', 'Lần trúng không được chạm CSDL.'], ['Test the miss with !== null, not with a falsy check.', 'Kiểm lần trượt bằng !== null, không bằng phép thử giá trị falsy.']],
  dauVao: ['redis — FakeRedis · db — { leaderboard(): Promise<row[]>, calls }', 'redis — FakeRedis · db — { leaderboard(): Promise<row[]>, calls }'],
  dauRa: ['Promise<row[]>', 'Promise<row[]>'],
  goiY: [['The four lines of the lesson: get → if (hit !== null) return JSON.parse(hit) → rows = await db.leaderboard() → set(…, JSON.stringify(rows), \'EX\', 60).', 'Bốn dòng của bài: get → if (hit !== null) return JSON.parse(hit) → rows = await db.leaderboard() → set(…, JSON.stringify(rows), \'EX\', 60).'], ['Check with await redis.ttl(\'lb:top20\') right after a miss: it must be 60, not -1.', 'Kiểm bằng await redis.ttl(\'lb:top20\') ngay sau lần trượt: phải là 60, không phải -1.']],
  loi: [['SET without EX: TTL -1, the cache never refreshes and the leaderboard freezes on the first value.', 'SET thiếu EX: TTL -1, cache không bao giờ làm mới, bảng xếp hạng đóng băng ở giá trị đầu tiên.'], ['Writing the rows object instead of JSON.stringify(rows): Redis stores strings — you would read back "[object Object]".', 'Ghi thẳng object thay vì JSON.stringify(rows): Redis lưu chuỗi — đọc lại sẽ ra "[object Object]".']],
  gt: ['Cache-aside means the application, not the database, owns the cache: every failure mode is in these four lines. The expiry is the whole invalidation strategy for a leaderboard: after 60 seconds the next request misses, recomputes and refreshes. The hidden test advances the virtual clock 61 seconds and checks that the database is asked again.', 'Cache-aside nghĩa là ứng dụng, không phải CSDL, sở hữu cache: mọi kiểu hỏng đều nằm trong bốn dòng này. Hạn sống là toàn bộ chiến lược làm mới cho bảng xếp hạng: sau 60 giây request kế tiếp trượt, tính lại và làm mới. Kiểm ẩn vặn đồng hồ ảo 61 giây và kiểm rằng CSDL được hỏi lại.'],
  kn: ['cache-aside', 'TTL'], tns: [TN.cacheAside, TN.ttl],
  gia: { 'fake-redis.js': FAKE_REDIS, 'fake-db.js': FAKE_DB },
  dau: `/** Cache-aside for the 48 ms leaderboard query. */
async function getLeaderboard(redis, db) {
  // Write your solution here — something is missing in line 4
  const hit = await redis.get('lb:top20');
  if (hit !== null) return JSON.parse(hit);
  const rows = await db.leaderboard();
  await redis.set('lb:top20', JSON.stringify(rows));
  return rows;
}
`,
  giai: `/** Cache-aside for the 48 ms leaderboard query. */
async function getLeaderboard(redis, db) {
  const hit = await redis.get('lb:top20');                 // 1. ask the cache (one round trip)
  if (hit !== null) return JSON.parse(hit);                // 2. hit → done (never test with if (hit))
  const rows = await db.leaderboard();                     // 3. miss → the real source (48 ms)
  await redis.set('lb:top20', JSON.stringify(rows), 'EX', 60);   // 4. write back WITH a deadline
  return rows;                                             // stale for at most 60 s — the chosen trade
}
`,
  chung: `const redis = new FakeRedis();
const db = makeDb({ rows: Array.from({ length: 30 }, (_, i) => ({ userId: i + 1, views: 1000 - i * 7 })) });`,
  cases: [
    { goi: `[(await getLeaderboard(redis, db)).length, (await getLeaderboard(redis, db))[0], db.calls]`, moTa: ['Miss then hit: the database is asked once', 'Trượt rồi trúng: CSDL chỉ bị hỏi một lần'] },
    { goi: `[await getLeaderboard(redis, db).then(() => redis.ttl('lb:top20')), db.calls]`, moTa: ['After a miss the key has TTL 60', 'Sau lần trượt khoá có TTL 60'] },
    { timeoutMs: 600000, goi: `[await getLeaderboard(redis, db).then(() => 'ok'), await sleep(61000), await getLeaderboard(redis, db).then((r) => r.length), db.calls]`, an: true, moTa: ['After 61 s the value is recomputed', 'Sau 61 s giá trị được tính lại'] },
    { chuanBi: `await redis.set('lb:top20', JSON.stringify([{ userId: 7, views: 5 }]), 'EX', 60);`, goi: `[await getLeaderboard(redis, db), db.calls]`, an: true },
    { goi: `[await Promise.all([1, 2, 3].map(async (i) => { await sleep(i * 100); return (await getLeaderboard(redis, db)).length; })), db.calls, await redis.ttl('lb:top20')]`, an: true },
  ],
});

const E3 = jsBai({
  ten: '12.2 · Cache the miss: negative caching for users', kho: 'MEDIUM', phut: 15,
  en: `<p>${c('GET user:99999')} misses and the database has no such user. The naive code caches nothing, so every request for a non-existent id reaches the database forever — an attacker requesting random ids turns your cache into a pass-through. Write ${c('getUser(redis, db, id)')}:</p><ul><li>key ${c('user:<id>')}; a found user is cached as JSON with ${c('EX 300')};</li><li>a user that does not exist is cached as the string ${c('"null"')} with ${c('EX 30')} (short, so a new sign-up appears quickly);</li><li>a cached ${c('"null"')} is a HIT that returns ${c('null')} without asking the database.</li></ul><p>${c('db.findUser(id)')} resolves to the user or ${c('null')} after 48 ms and counts ${c('db.calls')}.</p>`,
  vi: `<p>${c('GET user:99999')} trượt và CSDL không có người dùng đó. Code ngây thơ không cache gì, nên mọi request cho id không tồn tại đều xuống CSDL mãi mãi — kẻ tấn công hỏi id ngẫu nhiên là biến cache thành ống dẫn thẳng. Viết ${c('getUser(redis, db, id)')}:</p><ul><li>khoá ${c('user:<id>')}; người dùng tìm thấy được cache dạng JSON với ${c('EX 300')};</li><li>người dùng không tồn tại được cache là chuỗi ${c('"null"')} với ${c('EX 30')} (ngắn, để người mới đăng ký sớm hiện ra);</li><li>một ${c('"null"')} trong cache là lần TRÚNG, trả ${c('null')} mà không hỏi CSDL.</li></ul><p>${c('db.findUser(id)')} resolve ra người dùng hoặc ${c('null')} sau 48 ms và đếm ${c('db.calls')}.</p>`,
  yc: [['Found: EX 300. Not found: the string "null" with EX 30.', 'Tìm thấy: EX 300. Không thấy: chuỗi "null" với EX 30.'], ['Ten requests for the same missing id → one database call.', 'Mười request cho cùng một id không tồn tại → một lần gọi CSDL.'], ['Distinguish "not in the cache" (reply null) from "cached as missing" (reply "null").', 'Phân biệt "không có trong cache" (trả null) với "đã cache là không có" (trả "null").']],
  dauVao: ['redis · db { findUser(id) } · id — number', 'redis · db { findUser(id) } · id — số'],
  dauRa: ['Promise<user | null>', 'Promise<user | null>'],
  goiY: [['The reply of GET is null (no key) or a string. JSON.parse("null") is null — so the hit path can stay one line.', 'Câu trả lời của GET là null (không có khoá) hoặc một chuỗi. JSON.parse("null") ra null — nên nhánh trúng vẫn chỉ một dòng.'], ['On a miss: const u = await db.findUser(id); await redis.set(key, JSON.stringify(u), \'EX\', u ? 300 : 30); return u;', 'Khi trượt: const u = await db.findUser(id); await redis.set(key, JSON.stringify(u), \'EX\', u ? 300 : 30); return u;']],
  loi: [['if (hit) return JSON.parse(hit) — fine for "null", but the same habit treats an empty-string cache entry as a miss on every request; test hit !== null.', 'if (hit) return JSON.parse(hit) — ổn với "null", nhưng cùng thói quen đó coi mục cache chuỗi rỗng là trượt ở mọi request; hãy kiểm hit !== null.'], ['Skipping the SET when the user is null: every probe for a random id costs a database query.', 'Bỏ qua SET khi người dùng là null: mỗi lần dò một id ngẫu nhiên tốn một truy vấn CSDL.'], ['Caching the negative result with the same 300 s TTL: a user who signs up is "missing" for five minutes.', 'Cache kết quả âm với cùng TTL 300 s: người vừa đăng ký "không tồn tại" suốt năm phút.']],
  gt: ['JSON.stringify(null) is the string "null", which Redis stores like any value; GET returns null only when the KEY is absent. That one-character difference is what lets a cache remember "this id does not exist". The short TTL bounds the damage of a negative entry that becomes wrong when the user is created.', 'JSON.stringify(null) là chuỗi "null", Redis lưu nó như mọi giá trị; GET chỉ trả null khi KHOÁ không có. Khác biệt một ký tự đó cho phép cache nhớ "id này không tồn tại". TTL ngắn giới hạn tác hại của một bản ghi âm trở nên sai khi người dùng được tạo.'],
  kn: ['negative caching', 'cache-aside'], tns: [tn('negative caching', 'cache kết quả âm', 'nhớ cả câu trả lời "không có" trong một thời gian ngắn'), TN.ttl],
  gia: { 'fake-redis.js': FAKE_REDIS, 'fake-db.js': FAKE_DB },
  dau: `/** Cache-aside for users, including users that do not exist. */
async function getUser(redis, db, id) {
  // Write your solution here — a missing user is never cached
  const key = \`user:\${id}\`;
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);
  const u = await db.findUser(id);
  if (u) await redis.set(key, JSON.stringify(u), 'EX', 300);
  return u;
}
`,
  giai: `/** Cache-aside for users, including users that do not exist. */
async function getUser(redis, db, id) {
  const key = \`user:\${id}\`;
  const hit = await redis.get(key);
  if (hit !== null) return JSON.parse(hit);        // "null" is a HIT: JSON.parse("null") === null, no DB call
  const u = await db.findUser(id);                 // true miss: the key does not exist at all
  // cache BOTH outcomes; the negative one briefly, so a new sign-up shows up within 30 s
  await redis.set(key, JSON.stringify(u), 'EX', u ? 300 : 30);
  return u;
}
`,
  chung: `const redis = new FakeRedis();
const db = makeDb({ rows: [{ id: 1, name: 'An' }, { id: 2, name: 'Binh' }] });`,
  cases: [
    { goi: `[await getUser(redis, db, 1), await getUser(redis, db, 1), db.calls, await redis.ttl('user:1')]`, moTa: ['Existing user: cached with EX 300', 'Người dùng có thật: cache với EX 300'] },
    { goi: `[await getUser(redis, db, 99999), db.calls, await redis.get('user:99999'), await redis.ttl('user:99999')]`, moTa: ['Missing user: cached as "null" with EX 30', 'Người dùng không có: cache là "null" với EX 30'] },
    { goi: `[await Promise.all(Array.from({ length: 10 }, (_, i) => sleep(i * 60).then(() => getUser(redis, db, 424242)))), db.calls]`, moTa: ['Ten probes for the same missing id → one database call', 'Mười lần dò cùng id không tồn tại → một lần gọi CSDL'] },
    { timeoutMs: 600000, goi: `[await getUser(redis, db, 3), (db.rows.push({ id: 3, name: 'Chi' }), await getUser(redis, db, 3)), await sleep(31000), await getUser(redis, db, 3), db.calls]`, an: true, moTa: ['A new sign-up appears after the 30 s negative TTL', 'Người mới đăng ký hiện ra sau TTL âm 30 s'] },
    { timeoutMs: 600000, goi: `[await getUser(redis, db, 2), await sleep(299000), await getUser(redis, db, 2), db.calls, await sleep(2000), await getUser(redis, db, 2), db.calls]`, an: true },
  ],
});

const E4 = jsBai({
  ten: '12.2 · Stop the stampede: single-flight', kho: 'HARD', phut: 20,
  en: `<p>A popular key expires and 200 in-flight requests all miss, all query Postgres and all write the same value back: correct code, and a denial-of-service attack you wrote yourself (6,064 ms in the lesson). Write ${c('makeGetLeaderboard(redis, db)')} that returns an async function ${c('get()')}:</p><ul><li>cache-aside on key ${c('lb:top20')} with ${c('EX 60')};</li><li>while one load is in progress, every other miss in THIS process attaches to the same promise instead of querying again;</li><li>when the load finishes — success <b>or failure</b> — forget it, so a failed load is retried by the next request instead of being cached forever;</li><li>each ${c('makeGetLeaderboard')} has its own in-flight map (two instances = two processes).</li></ul>`,
  vi: `<p>Một khoá phổ biến hết hạn và 200 request đang bay cùng trượt, cùng hỏi Postgres và cùng ghi lại một giá trị: code đúng, và là một vụ tấn công từ chối dịch vụ do chính bạn viết (6.064 ms trong bài). Viết ${c('makeGetLeaderboard(redis, db)')} trả về một hàm async ${c('get()')}:</p><ul><li>cache-aside trên khoá ${c('lb:top20')} với ${c('EX 60')};</li><li>trong lúc một lần nạp đang chạy, mọi lần trượt khác trong tiến trình NÀY bám vào cùng promise thay vì truy vấn lại;</li><li>khi lần nạp kết thúc — thành công <b>hoặc thất bại</b> — quên nó đi, để lần nạp hỏng được thử lại ở request sau thay vì bị nhớ mãi;</li><li>mỗi ${c('makeGetLeaderboard')} có map đang-bay riêng (hai thể hiện = hai tiến trình).</li></ul>`,
  yc: [['200 concurrent calls on an empty cache → db.calls === 1, everyone gets the rows.', '200 lời gọi đồng thời trên cache rỗng → db.calls === 1, ai cũng nhận được các dòng.'], ['A rejected load rejects its waiters and is NOT remembered.', 'Lần nạp bị reject thì reject những người đang chờ và KHÔNG được nhớ lại.'], ['Warm cache: no database call at all.', 'Cache ấm: không gọi CSDL lần nào.']],
  dauVao: ['redis · db { leaderboard(), calls, fail }', 'redis · db { leaderboard(), calls, fail }'],
  dauRa: ['() => Promise<row[]>', '() => Promise<row[]>'],
  goiY: [['Keep const inflight = new Map() inside makeGetLeaderboard (one per instance).', 'Giữ const inflight = new Map() bên trong makeGetLeaderboard (mỗi thể hiện một cái).'], ['After a miss: if (inflight.has(KEY)) return inflight.get(KEY); otherwise build the load promise with (async () => { … })().finally(() => inflight.delete(KEY)) and set it BEFORE returning.', 'Sau lần trượt: if (inflight.has(KEY)) return inflight.get(KEY); không thì dựng promise nạp bằng (async () => { … })().finally(() => inflight.delete(KEY)) và set nó TRƯỚC khi trả về.']],
  loi: [['Putting the Map at the top of the file: two instances share it, so the "two processes" test sees one query instead of two.', 'Đặt Map ở đầu tệp: hai thể hiện dùng chung, nên kiểm "hai tiến trình" thấy một truy vấn thay vì hai.'], ['Deleting the entry only on success: one database timeout and every later request waits on a rejected promise forever.', 'Chỉ xoá mục khi thành công: một lần CSDL quá giờ là mọi request sau chờ trên một promise đã reject mãi mãi.'], ['Awaiting something between inflight.has() and inflight.set(): other requests slip into that gap and each starts its own query.', 'Await thứ gì đó giữa inflight.has() và inflight.set(): các request khác lọt vào khe đó và mỗi cái tự khởi một truy vấn.']],
  gt: ['Between inflight.has and inflight.set there is no await, so the event loop cannot run another request in between — no race, no lock. The first miss creates the promise; the 199 others find it and await the same result: 1 query instead of 200 (65 ms instead of 6 s in the lesson). .finally() removes the entry in both outcomes, which is what keeps a transient database error from being cached.', 'Giữa inflight.has và inflight.set không có await, nên event loop không thể chạy request khác chen vào — không đua, không cần khoá. Lần trượt đầu tạo promise; 199 cái còn lại thấy nó và await cùng một kết quả: 1 truy vấn thay vì 200 (65 ms thay vì 6 s trong bài). .finally() xoá mục trong cả hai kết cục, đó là thứ giữ cho một lỗi CSDL thoáng qua không bị nhớ lại.'],
  kn: ['single-flight', 'stampede'], tns: [TN.stampede, TN.singleFlight],
  gia: { 'fake-redis.js': FAKE_REDIS, 'fake-db.js': FAKE_DB },
  dau: `/** Returns get(): cache-aside on lb:top20 that never sends two loads at once from this process. */
function makeGetLeaderboard(redis, db) {
  const KEY = 'lb:top20';
  // Write your solution here — correct, and 200 queries on a cold cache
  return async function get() {
    const hit = await redis.get(KEY);
    if (hit !== null) return JSON.parse(hit);
    const rows = await db.leaderboard();
    await redis.set(KEY, JSON.stringify(rows), 'EX', 60);
    return rows;
  };
}
`,
  giai: `/** Returns get(): cache-aside on lb:top20 that never sends two loads at once from this process. */
function makeGetLeaderboard(redis, db) {
  const KEY = 'lb:top20';
  const inflight = new Map();                 // per instance = per process

  return async function get() {
    const hit = await redis.get(KEY);
    if (hit !== null) return JSON.parse(hit);

    if (inflight.has(KEY)) return inflight.get(KEY);   // someone is already loading: ride along

    // no await between has() and set(): the event loop cannot interleave another request here
    const p = (async () => {
      const rows = await db.leaderboard();
      await redis.set(KEY, JSON.stringify(rows), 'EX', 60);
      return rows;
    })().finally(() => inflight.delete(KEY));          // success OR failure: forget the flight

    inflight.set(KEY, p);
    return p;
  };
}
`,
  chung: `const redis = new FakeRedis();
const db = makeDb({ rows: Array.from({ length: 25 }, (_, i) => ({ userId: i + 1, views: 900 - i })) });`,
  cases: [
    { goi: `await (async () => { const get = makeGetLeaderboard(redis, db); const t0 = Date.now(); const all = await Promise.all(Array.from({ length: 200 }, () => get())); return [db.calls, all.every((r) => r.length === 20), Date.now() - t0 < 100]; })()`, moTa: ['200 concurrent calls on a cold cache → one query', '200 lời gọi đồng thời trên cache lạnh → một truy vấn'] },
    { goi: `await (async () => { const get = makeGetLeaderboard(redis, db); await get(); await Promise.all(Array.from({ length: 50 }, () => get())); return db.calls; })()`, moTa: ['Warm cache: no more queries', 'Cache ấm: không truy vấn thêm'] },
    { goi: `await (async () => { db.fail = 1; const get = makeGetLeaderboard(redis, db); const r = await Promise.allSettled(Array.from({ length: 5 }, () => get())); const again = await get(); return [r.map((x) => x.status).join(','), again.length, db.calls]; })()`, moTa: ['A failed load is not remembered: the next call retries', 'Lần nạp hỏng không được nhớ: lần gọi sau thử lại'] },
    { goi: `await (async () => { const a = makeGetLeaderboard(redis, db), b = makeGetLeaderboard(redis, db); await Promise.all([...Array.from({ length: 30 }, () => a()), ...Array.from({ length: 30 }, () => b())]); return db.calls; })()`, an: true, moTa: ['Two instances (two processes) → two queries, not 60', 'Hai thể hiện (hai tiến trình) → hai truy vấn, không phải 60'] },
    { timeoutMs: 600000, goi: `await (async () => { const get = makeGetLeaderboard(redis, db); await Promise.all(Array.from({ length: 40 }, () => get())); await sleep(61000); await Promise.all(Array.from({ length: 40 }, () => get())); return [db.calls, await redis.ttl('lb:top20')]; })()`, an: true },
  ],
});

const E5 = jsBai({
  ten: '12.2 · Keep the deadline, spread the deadlines', kho: 'MEDIUM', phut: 15,
  en: `<p>Two small fixes from the lesson, in one file.</p><p><b>1.</b> ${c('updateValue(redis, key, value)')} replaces the value of a cached key <b>without touching its expiry</b> (a plain ${c('SET')} would make TTL ${c('-1')}: immortal). If the key does not exist, do nothing and return ${c('false')}; otherwise return ${c('true')}.</p><p><b>2.</b> ${c('warmAll(redis, entries, baseSec, spreadSec, rand)')} writes every ${c('[key, value]')} with ${c('EX = baseSec + Math.floor(rand() * spreadSec)')}, so 50 caches warmed in the same second do not all expire in the same second 60 s later. ${c('rand')} is injected (a function returning [0, 1)) so the test is deterministic. Return the array of TTLs used, in order.</p>`,
  vi: `<p>Hai cách chữa nhỏ trong bài, gộp một tệp.</p><p><b>1.</b> ${c('updateValue(redis, key, value)')} thay giá trị của một khoá đã cache <b>mà không đụng tới hạn của nó</b> (SET thường sẽ làm TTL thành ${c('-1')}: bất tử). Khoá không tồn tại thì không làm gì và trả ${c('false')}; ngược lại trả ${c('true')}.</p><p><b>2.</b> ${c('warmAll(redis, entries, baseSec, spreadSec, rand)')} ghi mọi ${c('[key, value]')} với ${c('EX = baseSec + Math.floor(rand() * spreadSec)')}, để 50 cache được làm ấm trong cùng một giây không cùng hết hạn trong một giây 60 s sau. ${c('rand')} được tiêm vào (hàm trả số trong [0, 1)) để kiểm có tính tất định. Trả mảng các TTL đã dùng, theo thứ tự.</p>`,
  yc: [['updateValue keeps the remaining TTL (KEEPTTL) and never creates a key.', 'updateValue giữ TTL còn lại (KEEPTTL) và không bao giờ tạo khoá mới.'], ['warmAll uses baseSec + Math.floor(rand() * spreadSec) seconds per key.', 'warmAll dùng baseSec + Math.floor(rand() * spreadSec) giây cho mỗi khoá.'], ['Use one pipeline in warmAll (one round trip for all keys).', 'Dùng một pipeline trong warmAll (một vòng đi-về cho mọi khoá).']],
  dauVao: ['redis · key, value — strings · entries — [key, value][] · baseSec, spreadSec — numbers · rand — () => number', 'redis · key, value — chuỗi · entries — [key, value][] · baseSec, spreadSec — số · rand — () => số'],
  dauRa: ['updateValue → Promise<boolean> · warmAll → Promise<number[]>', 'updateValue → Promise<boolean> · warmAll → Promise<number[]>'],
  goiY: [['SET accepts KEEPTTL and XX together: set(key, value, \'XX\', \'KEEPTTL\') returns null when the key is absent.', 'SET nhận cả KEEPTTL lẫn XX: set(key, value, \'XX\', \'KEEPTTL\') trả null khi khoá không có.'], ['In warmAll compute the TTLs first, then queue p.set(k, v, \'EX\', ttl) for each, then await p.exec().', 'Trong warmAll tính TTL trước, rồi xếp p.set(k, v, \'EX\', ttl) cho từng khoá, rồi await p.exec().']],
  loi: [['set(key, value) in the refresh path: the TTL silently becomes -1 and the entry lives until Redis evicts it.', 'set(key, value) ở nhánh làm mới: TTL âm thầm thành -1 và mục đó sống tới khi Redis đuổi nó ra.'], ['Checking EXISTS first and then SET KEEPTTL: two round trips and a race — the key can expire in between and be re-created without a TTL.', 'Kiểm EXISTS trước rồi mới SET KEEPTTL: hai vòng đi-về và một cuộc đua — khoá có thể hết hạn ở giữa và được tạo lại không có TTL.'], ['Using a fixed TTL for a batch warm-up: 50 keys die in the same second — a synchronised stampede no per-key lock can stop.', 'Dùng TTL cố định cho một đợt làm ấm: 50 khoá chết cùng một giây — một cơn giẫm đạp đồng loạt mà khoá theo từng key không cứu được.']],
  gt: ['KEEPTTL keeps the deadline, XX refuses to create a missing key — one atomic command, so there is no gap between "it exists" and "update it". Jitter costs one multiplication and removes a whole failure class: in the lesson, 50 keys with TTL 60 all expired in the same second; with 0–30 s of jitter they expired over 60–89 s.', 'KEEPTTL giữ hạn, XX từ chối tạo khoá chưa có — một lệnh nguyên tử, nên không có khe hở giữa "nó tồn tại" và "cập nhật nó". Jitter chỉ tốn một phép nhân mà xoá cả một lớp lỗi: trong bài, 50 khoá TTL 60 hết hạn cùng một giây; thêm jitter 0–30 s thì chúng hết hạn rải trong 60–89 s.'],
  kn: ['TTL', 'jitter'], tns: [TN.ttl, TN.jitter, tn('KEEPTTL', 'giữ hạn', 'tuỳ chọn của SET: đổi giá trị, giữ nguyên thời điểm hết hạn')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Replace a cached value, keep its deadline. */
async function updateValue(redis, key, value) {
  // Write your solution here
  await redis.set(key, value);
  return true;
}

/** Warm many keys with a jittered TTL; returns the TTLs used. */
async function warmAll(redis, entries, baseSec, spreadSec, rand) {
  const ttls = [];
  for (const [k, v] of entries) { await redis.set(k, v, 'EX', baseSec); ttls.push(baseSec); }
  return ttls;
}
`,
  giai: `/** Replace a cached value, keep its deadline. */
async function updateValue(redis, key, value) {
  // XX: only if the key exists · KEEPTTL: do not reset the expiry (a plain SET would make TTL -1)
  const ok = await redis.set(key, value, 'XX', 'KEEPTTL');
  return ok === 'OK';                                       // null ⇒ the key was absent, nothing created
}

/** Warm many keys with a jittered TTL; returns the TTLs used. */
async function warmAll(redis, entries, baseSec, spreadSec, rand) {
  const ttls = entries.map(() => baseSec + Math.floor(rand() * spreadSec));   // spread the deadlines
  const p = redis.pipeline();
  entries.forEach(([k, v], i) => p.set(k, v, 'EX', ttls[i]));
  await p.exec();                                           // one round trip for the whole warm-up
  return ttls;
}
`,
  chung: `const redis = new FakeRedis();
const seq = (xs) => { let i = 0; return () => xs[i++ % xs.length]; };`,
  cases: [
    { chuanBi: `await redis.set('note:42', 'v1', 'EX', 100); await sleep(5000);`, goi: `[await updateValue(redis, 'note:42', 'v2'), await redis.get('note:42'), await redis.ttl('note:42')]`, moTa: ['Update keeps the remaining TTL (95 s)', 'Cập nhật giữ TTL còn lại (95 s)'] },
    { goi: `[await updateValue(redis, 'note:404', 'x'), await redis.exists('note:404')]`, moTa: ['A missing key is not created', 'Khoá không có thì không được tạo'] },
    { goi: `[await warmAll(redis, [['a', '1'], ['b', '2'], ['c', '3']], 60, 30, seq([0, 0.5, 0.99])), redis.roundTrips, await redis.ttl('b')]`, moTa: ['Jittered TTLs 60 / 75 / 89, one round trip', 'TTL rung 60 / 75 / 89, một vòng đi-về'] },
    { timeoutMs: 600000, chuanBi: `await redis.set('s', 'old', 'EX', 30);`, goi: `[await updateValue(redis, 's', 'new'), await sleep(31000), await redis.get('s'), await redis.ttl('s')]`, an: true },
    { goi: `await (async () => { const ttls = await warmAll(redis, Array.from({ length: 50 }, (_, i) => ['k' + i, 'v']), 60, 30, seq([0.1, 0.37, 0.64, 0.91, 0.22])); return [new Set(ttls).size, Math.min(...ttls), Math.max(...ttls), redis.roundTrips]; })()`, an: true },
  ],
});

export default modul('nodejs-12-2-cache-aside', '12.2 Cache-aside, TTL, negative caching, single-flight', [E1, E2, E3, E4, E5]);
