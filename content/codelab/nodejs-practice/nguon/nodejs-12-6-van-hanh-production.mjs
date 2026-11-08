/** Node.js · 12.6 — Vận hành Redis: KEYS vs SCAN, DEL vs UNLINK, maxmemory + chính sách đuổi, persistence, số liệu cần nhìn. */
import { modul, cs, q, tn, bang1, jsBai, c, FAKE_REDIS } from './_node-c12-14.mjs';

const KQ = ['Writes fail with OOM, reads still work', 'Least recently used keys are evicted, no error', 'Least frequently used keys are evicted, no error', 'Only keys that have a TTL are evicted, no error'];
const DUNG = ['A cache', 'A primary store or a job queue', 'A trap: it fails silently'];
const E1 = cs({
  ten: '12.6 · maxmemory: what happens when Redis fills up', kho: 'MEDIUM', phut: 10, loai: 'table',
  en: 'Redis has hit maxmemory and a client sends a write. For each policy and situation, pick what happens, and what that setting is right for. The lesson filled a real Redis past the limit under each policy.',
  vi: 'Redis đã chạm maxmemory và một client gửi lệnh ghi. Với mỗi chính sách và tình huống, chọn chuyện gì xảy ra, và cấu hình đó hợp cho việc gì. Bài đã đổ đầy một Redis thật quá giới hạn dưới từng chính sách.',
  bang: [bang1('b1', ['Policy → outcome → right for', 'Chính sách → kết quả → hợp cho'], [{ ma: 'p', ten: 'Policy / situation' }, { ma: 'k', ten: 'Outcome', luaChon: KQ }, { ma: 'd', ten: 'Right for', luaChon: DUNG }], [
    { o: { p: 'noeviction (the default)' }, a: { k: KQ[0], d: DUNG[1] } },
    { o: { p: 'allkeys-lru' }, a: { k: KQ[1], d: DUNG[0] } },
    { o: { p: 'allkeys-lfu, a stable hot set pushed out by one-off scans' }, a: { k: KQ[2], d: DUNG[0] } },
    { o: { p: 'volatile-lru, and many keys were written with an EX' }, a: { k: KQ[3], d: DUNG[2] } },
    { o: { p: 'volatile-lru, and no key has a TTL (a plain SET removed them)' }, a: { k: KQ[0], d: DUNG[2] } },
  ], ['noeviction: Redis becomes read-only — logins and quota checks fail while the homepage loads; right only when losing a key is worse than failing (a primary store, a BullMQ queue — 13.2). allkeys-lru / lfu: Redis throws keys away and never errors — the setting for a cache, with the duty to survive any key disappearing. volatile-*: evicts only keys WITH a TTL; the moment some path forgets EX there is nothing to evict and you are back to OOM — it sounds safe and fails silently.', 'noeviction: Redis thành chỉ-đọc — đăng nhập và kiểm hạn mức hỏng trong khi trang chủ vẫn tải; chỉ đúng khi mất khoá còn tệ hơn báo lỗi (kho chính, hàng đợi BullMQ — 13.2). allkeys-lru / lfu: Redis vứt khoá và không bao giờ báo lỗi — cấu hình cho cache, kèm nghĩa vụ chịu được việc mọi khoá có thể biến mất. volatile-*: chỉ đuổi khoá CÓ TTL; khi một nhánh quên EX là không còn gì để đuổi và bạn quay lại OOM — nghe an toàn mà hỏng câm.'])],
  goiY: [['The default is the dangerous one for a cache.', 'Mặc định chính là cái nguy hiểm cho cache.'], ['volatile-* only sees keys with an expiry.', 'volatile-* chỉ nhìn thấy khoá có hạn.']],
  loi: [['Leaving noeviction on a cache: under memory pressure half the app breaks in ways that look nothing like “out of memory”.', 'Để noeviction cho cache: khi thiếu bộ nhớ nửa ứng dụng hỏng theo cách chẳng giống "hết bộ nhớ" chút nào.'], ['Pointing a job queue at a cache Redis with allkeys-lru: jobs are evicted and nothing tells you.', 'Trỏ hàng đợi job vào Redis cache với allkeys-lru: job bị đuổi mà không gì báo cho bạn.']],
  tns: [tn('maxmemory', 'trần bộ nhớ', 'quá mức này Redis đuổi khoá hoặc từ chối ghi'), tn('eviction policy', 'chính sách đuổi', 'khoá nào bị vứt khi đầy — hoặc không khoá nào (chỉ đọc)')],
  kn: ['maxmemory', 'eviction'],
});

const E2 = cs({
  ten: '12.6 · The commands that freeze everything', kho: 'EASY', phut: 10,
  en: 'Redis executes one command at a time. While one command takes 200 ms, every other client in the fleet simply stops. The lesson measured that damage from a SECOND connection.',
  vi: 'Redis chạy một lệnh mỗi lúc. Khi một lệnh mất 200 ms, mọi client khác trong cả cụm đơn giản là dừng. Bài đo thiệt hại đó từ một kết nối THỨ HAI.',
  cau: [
    q('c1', ['On 1,000,000 keys: KEYS * took 343.86 ms, SCAN took 857.41 ms in total. Another client’s worst PING: 126.96 ms vs 6.87 ms. Which do you run on production, and why?', 'Trên 1.000.000 khoá: KEYS * mất 343,86 ms, SCAN tổng cộng 857,41 ms. PING tệ nhất của client khác: 126,96 ms so với 6,87 ms. Bạn chạy cái nào trên production, vì sao?'],
      ['SCAN — slower in total, but Redis serves other clients between rounds; the number that decides is the other client’s latency', 'KEYS — it is 2.5× faster, and one fast blocking command is better than a slow one', 'Either — both block Redis for the same total time', 'KEYS during the night, SCAN during the day, because traffic is lower at night'],
      ['Measuring only your command would pick KEYS. Every API request touching Redis paid the 127 ms spike — it looks like a network problem.', 'Chỉ đo lệnh của mình thì sẽ chọn KEYS. Mọi request API chạm Redis đã trả cú tăng 127 ms đó — nó trông như lỗi mạng.']),
    q('c2', ['What does SCAN guarantee about keys that exist for the whole scan?', 'SCAN bảo đảm gì về các khoá tồn tại suốt cuộc quét?'],
      ['Each is returned at least once — keys may repeat, so de-duplicate if it matters', 'Each is returned exactly once, in sorted order', 'Each is returned at least once, and SCAN locks them until it finishes', 'Nothing — keys can be missed if COUNT is too small'],
      ['A cursor-based iteration that lets Redis breathe between rounds, with at-least-once semantics.', 'Một phép duyệt theo con trỏ cho Redis thở giữa các vòng, với ngữ nghĩa ít nhất một lần.']),
    q('c3', ['Deleting a hash of 1,000,000 fields: DEL 205.50 ms (other clients blocked 205 ms), UNLINK 0.37 ms. What does UNLINK do differently?', 'Xoá một hash 1.000.000 trường: DEL 205,50 ms (client khác bị chặn 205 ms), UNLINK 0,37 ms. UNLINK làm gì khác?'],
      ['Removes the key from the keyspace at once and frees the memory in a background thread', 'Marks the key deleted and lets maxmemory eviction clean it up later', 'Deletes only the first 1,000 fields and schedules the rest', 'Moves the key to a trash database that FLUSHDB empties'],
      ['Freeing a million allocations is work; DEL does it inline. UNLINK has no downside — use it by default (and FLUSHALL ASYNC).', 'Giải phóng một triệu vùng nhớ là việc; DEL làm ngay trên luồng chính. UNLINK không có nhược điểm — dùng mặc định (và FLUSHALL ASYNC).']),
    q('c4', ['If this Redis lost everything right now, you would only lose performance. Which persistence setting does the lesson recommend?', 'Nếu Redis này mất sạch ngay lúc này, bạn chỉ mất hiệu năng. Bài khuyên cấu hình lưu bền nào?'],
      ['Neither RDB nor AOF — it restarts empty and the application warms it again', 'AOF with appendfsync always, so no cache entry is ever lost', 'RDB every minute plus AOF everysec, Redis’s recommendation for any data', 'AOF only, because RDB snapshots block the server'],
      ['Persistence is for data you would lose. If any answer is “data”, you have made Redis a primary database by accident — ask whether it belongs in PostgreSQL.', 'Lưu bền dành cho dữ liệu bạn sẽ mất. Nếu có câu trả lời là "dữ liệu", bạn đã vô tình biến Redis thành CSDL chính — hãy hỏi xem nó có thuộc về PostgreSQL không.']),
    q('c5', ['Which configuration does the lesson give for a production Redis that is exposed to your own servers only?', 'Bài đưa cấu hình nào cho một Redis production chỉ phục vụ máy chủ của bạn?'],
      ['Bind to a private interface, set requirepass, rename-command FLUSHALL "", slowlog-log-slower-than 10000', 'Bind 0.0.0.0 so every container can reach it, and rely on the firewall of the cloud', 'Disable SLOWLOG, because logging slow commands slows Redis down', 'Run KEYS * hourly to verify that no unexpected key exists'],
      ['An unauthenticated Redis on a public IP is compromised within hours (CONFIG SET dir writes an SSH key). Anything above 10 ms on an in-memory database is a bug, not load.', 'Redis không mật khẩu trên IP công khai bị chiếm trong vài giờ (CONFIG SET dir ghi khoá SSH). Lệnh nào trên 10 ms ở CSDL trong bộ nhớ là lỗi, không phải tải.']),
  ],
  goiY: [['Always ask what OTHER clients experience while your command runs.', 'Luôn hỏi client KHÁC chịu gì trong lúc lệnh của bạn chạy.'], ['Unbounded = KEYS, HGETALL / SMEMBERS / LRANGE 0 -1 on huge keys, DEL of a huge key.', 'Không giới hạn = KEYS, HGETALL / SMEMBERS / LRANGE 0 -1 trên khoá khổng lồ, DEL một khoá khổng lồ.']],
  loi: [['An admin script with KEYS * — a site-wide latency spike that looks like a network problem.', 'Một script quản trị có KEYS * — cú tăng độ trễ toàn trang trông như lỗi mạng.'], ['DEL on a big hash in a cleanup job: 205 ms of nobody being served.', 'DEL một hash lớn trong job dọn dẹp: 205 ms không ai được phục vụ.']],
  tns: [tn('SCAN', 'duyệt theo con trỏ', 'trả một con trỏ + một lô; Redis phục vụ người khác giữa các vòng'), tn('UNLINK', 'xoá không chặn', 'gỡ khoá ngay, giải phóng bộ nhớ ở luồng nền'), tn('SLOWLOG', 'nhật ký lệnh chậm', 'việc đầu tiên khi Redis "chậm"')],
  kn: ['operations'],
});

const E3 = jsBai({
  ten: '12.6 · Replace KEYS with a SCAN loop', kho: 'MEDIUM', phut: 15,
  en: `<p>A cleanup script lists keys with ${c("await redis.keys('sess:*')")}. On a million keys that froze every other client for 127 ms. Write ${c('scanAll(redis, pattern, count = 100)')}:</p><ul><li>call ${c("redis.scan(cursor, 'MATCH', pattern, 'COUNT', count)")} starting from cursor ${c("'0'")}; each reply is ${c('[nextCursor, keys]')};</li><li>stop when the returned cursor is ${c("'0'")} — not when a page comes back empty (a page can be empty in the middle of a scan);</li><li>SCAN may return a key more than once: return each key ONCE, sorted.</li></ul><p>The fake records ${c('redis.usedKeys = true')} if anyone calls ${c('KEYS')}.</p>`,
  vi: `<p>Một script dọn dẹp liệt kê khoá bằng ${c("await redis.keys('sess:*')")}. Trên một triệu khoá nó làm đứng mọi client khác 127 ms. Viết ${c('scanAll(redis, pattern, count = 100)')}:</p><ul><li>gọi ${c("redis.scan(cursor, 'MATCH', pattern, 'COUNT', count)")} bắt đầu từ con trỏ ${c("'0'")}; mỗi câu trả lời là ${c('[nextCursor, keys]')};</li><li>dừng khi con trỏ trả về là ${c("'0'")} — không phải khi một trang về rỗng (giữa cuộc quét một trang có thể rỗng);</li><li>SCAN có thể trả một khoá nhiều lần: trả mỗi khoá MỘT lần, đã sắp xếp.</li></ul><p>Bản giả ghi ${c('redis.usedKeys = true')} nếu có ai gọi ${c('KEYS')}.</p>`,
  yc: [['Never call KEYS.', 'Không bao giờ gọi KEYS.'], ['Loop on the cursor until it comes back as "0".', 'Lặp theo con trỏ tới khi nó về "0".'], ['No duplicates in the result; sorted.', 'Kết quả không trùng; đã sắp xếp.']],
  dauVao: ['redis · pattern — glob (sess:*) · count — page size hint', 'redis · pattern — mẫu glob (sess:*) · count — gợi ý cỡ trang'],
  dauRa: ['Promise<string[]>', 'Promise<string[]>'],
  goiY: [['let cursor = \'0\'; const seen = new Set(); do { const [next, keys] = await redis.scan(cursor, \'MATCH\', pattern, \'COUNT\', count); keys.forEach((k) => seen.add(k)); cursor = next; } while (cursor !== \'0\');', 'let cursor = \'0\'; const seen = new Set(); do { const [next, keys] = await redis.scan(cursor, \'MATCH\', pattern, \'COUNT\', count); keys.forEach((k) => seen.add(k)); cursor = next; } while (cursor !== \'0\');'], ['A do…while runs the first SCAN even though the starting cursor is also "0".', 'do…while chạy lần SCAN đầu tiên dù con trỏ khởi đầu cũng là "0".']],
  loi: [['while (cursor !== \'0\') { … } with cursor starting at \'0\': the loop body never runs and the result is empty.', 'while (cursor !== \'0\') { … } với con trỏ bắt đầu bằng \'0\': thân vòng lặp không bao giờ chạy và kết quả rỗng.'], ['Stopping at the first empty page: MATCH filters after the page is taken, so an empty page means nothing.', 'Dừng ở trang rỗng đầu tiên: MATCH lọc sau khi lấy trang, nên trang rỗng chẳng nói lên gì.'], ['Pushing into an array: the key that ends one page and starts the next is counted twice.', 'Đẩy vào mảng: khoá kết thúc trang này và mở đầu trang sau bị đếm hai lần.']],
  gt: ['SCAN hands back a slice and a cursor, and Redis serves other clients between your rounds — the lesson’s other-client worst case fell from 126.96 ms to 6.87 ms. Only the cursor value "0" means the iteration is complete; COUNT is a hint, MATCH is applied after the slice is taken, so empty pages are normal. A Set gives the de-duplication SCAN’s at-least-once guarantee requires.', 'SCAN trả một lát và một con trỏ, và Redis phục vụ client khác giữa các vòng của bạn — trường hợp tệ nhất của client khác trong bài giảm từ 126,96 ms xuống 6,87 ms. Chỉ giá trị con trỏ "0" mới nghĩa là đã duyệt xong; COUNT là gợi ý, MATCH áp sau khi lấy lát, nên trang rỗng là bình thường. Một Set cho việc khử trùng mà bảo đảm ít-nhất-một-lần của SCAN đòi hỏi.'],
  kn: ['SCAN', 'cursor'], tns: [tn('cursor', 'con trỏ', 'vị trí để vòng SCAN sau tiếp tục; "0" = xong')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Every key matching pattern, once, sorted — without blocking Redis. */
async function scanAll(redis, pattern, count = 100) {
  // Write your solution here — KEYS blocks every other client
  return (await redis.keys(pattern)).sort();
}
`,
  giai: `/** Every key matching pattern, once, sorted — without blocking Redis. */
async function scanAll(redis, pattern, count = 100) {
  const seen = new Set();                  // SCAN is at-least-once: a key may come back twice
  let cursor = '0';
  do {                                     // do…while: the FIRST call also starts from cursor '0'
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);
    for (const k of keys) seen.add(k);     // an empty page is normal — MATCH filters after the slice
    cursor = next;
  } while (cursor !== '0');                // only cursor '0' means the iteration is complete
  return [...seen].sort();
}
`,
  chung: `const redis = new FakeRedis();
for (let i = 0; i < 35; i++) await redis.set('sess:' + String(i).padStart(3, '0'), 'x');
for (let i = 0; i < 40; i++) await redis.set('user:' + i + ':profile', '{}');
redis.roundTrips = 0;`,
  cases: [
    { goi: `[(await scanAll(redis, 'sess:*', 10)).length, redis.usedKeys === true, redis.roundTrips]`, moTa: ['35 session keys, pages of 10, no KEYS', '35 khoá phiên, trang 10, không KEYS'] },
    { goi: `[(await scanAll(redis, 'sess:*', 10)).slice(0, 3), new Set(await scanAll(redis, 'sess:*', 7)).size]`, moTa: ['Sorted, no duplicates (SCAN repeats a key between pages)', 'Đã sắp xếp, không trùng (SCAN lặp một khoá giữa các trang)'] },
    { goi: `[(await scanAll(redis, 'user:*:profile', 5)).length, (await scanAll(redis, 'nope:*', 50)).length, redis.usedKeys === true]`, moTa: ['Empty pages in the middle do not stop the scan', 'Trang rỗng ở giữa không làm dừng cuộc quét'] },
    { goi: `[(await scanAll(redis, 'sess:00*')), redis.usedKeys === true]`, an: true },
    { goi: `[(await scanAll(redis, '*', 3)).length, redis.roundTrips > 20, redis.usedKeys === true]`, an: true },
  ],
  kiemThem: [{ khop: '\\.keys\\(', phuDinh: true, moTa: { en: 'Does not call redis.keys()', vi: 'Không gọi redis.keys()' } }],
});

const E4 = jsBai({
  ten: '12.6 · Read INFO like an operator', kho: 'MEDIUM', phut: 20,
  en: `<p>${c('INFO')} returns plain text: lines ${c('name:value')}, section headers starting with ${c('#')}, lines separated by ${c('\\r\\n')}. Write ${c("healthReport(infoText, purpose)")} where ${c('purpose')} is ${c("'cache'")} or ${c("'queue'")}, returning:</p><ul><li>${c('hitRate')} — ${c('keyspace_hits / (hits + misses) × 100')} rounded to 1 decimal, or ${c('null')} when both are 0;</li><li>${c('fragmentation')} — ${c('mem_fragmentation_ratio')} as a number; ${c('evictedKeys')} — a number; ${c('policy')} — ${c('maxmemory_policy')};</li><li>${c('warnings')}, in this order: ${c("'no-maxmemory'")} if ${c('maxmemory')} is 0; ${c("'policy'")} if a cache does not use ${c('allkeys-lru')} / ${c('allkeys-lfu')}, or a queue does not use ${c('noeviction')}; ${c("'fragmentation'")} if the ratio is above 1.5; ${c("'evicting'")} if ${c('evicted_keys')} is above 0 and the purpose is ${c("'queue'")} (for a queue an eviction is a lost job).</li></ul>`,
  vi: `<p>${c('INFO')} trả chữ thô: các dòng ${c('tên:giá trị')}, đầu mục bắt đầu bằng ${c('#')}, các dòng cách nhau bằng ${c('\\r\\n')}. Viết ${c("healthReport(infoText, purpose)")} với ${c('purpose')} là ${c("'cache'")} hoặc ${c("'queue'")}, trả về:</p><ul><li>${c('hitRate')} — ${c('keyspace_hits / (hits + misses) × 100')} làm tròn 1 chữ số thập phân, hoặc ${c('null')} khi cả hai bằng 0;</li><li>${c('fragmentation')} — ${c('mem_fragmentation_ratio')} dạng số; ${c('evictedKeys')} — số; ${c('policy')} — ${c('maxmemory_policy')};</li><li>${c('warnings')}, theo thứ tự: ${c("'no-maxmemory'")} nếu ${c('maxmemory')} là 0; ${c("'policy'")} nếu cache không dùng ${c('allkeys-lru')} / ${c('allkeys-lfu')}, hoặc hàng đợi không dùng ${c('noeviction')}; ${c("'fragmentation'")} nếu tỉ lệ trên 1,5; ${c("'evicting'")} nếu ${c('evicted_keys')} lớn hơn 0 và mục đích là ${c("'queue'")} (với hàng đợi, một lần đuổi là một job mất).</li></ul>`,
  yc: [['Parse every name:value line, skip blank lines and # headers, accept \\r\\n and \\n.', 'Parse mọi dòng tên:giá trị, bỏ dòng trống và đầu mục #, nhận cả \\r\\n lẫn \\n.'], ['Numbers are numbers in the result.', 'Số trong kết quả là số.'], ['Warnings in the order given.', 'Cảnh báo theo đúng thứ tự đã nêu.']],
  dauVao: ['infoText — the reply of INFO · purpose — "cache" | "queue"', 'infoText — câu trả lời của INFO · purpose — "cache" | "queue"'],
  dauRa: ['{ hitRate, fragmentation, evictedKeys, policy, warnings }', '{ hitRate, fragmentation, evictedKeys, policy, warnings }'],
  goiY: [['const f = {}; for (const line of infoText.split(/\\r?\\n/)) { if (!line || line[0] === \'#\') continue; const i = line.indexOf(\':\'); f[line.slice(0, i)] = line.slice(i + 1); }', 'const f = {}; for (const line of infoText.split(/\\r?\\n/)) { if (!line || line[0] === \'#\') continue; const i = line.indexOf(\':\'); f[line.slice(0, i)] = line.slice(i + 1); }'], ['Split on the FIRST colon only — some values contain colons. Round with Math.round(x * 10) / 10.', 'Chỉ tách ở dấu hai chấm ĐẦU TIÊN — vài giá trị có chứa dấu hai chấm. Làm tròn bằng Math.round(x * 10) / 10.']],
  loi: [['line.split(\':\') — a value such as executable:/usr/bin/redis-server or a Windows path is cut in pieces.', 'line.split(\':\') — giá trị như executable:/usr/bin/redis-server hay đường dẫn Windows bị cắt vụn.'], ['Forgetting \\r: "allkeys-lru\\r" !== "allkeys-lru" and every cache is reported with a wrong policy.', 'Quên \\r: "allkeys-lru\\r" !== "allkeys-lru" và mọi cache bị báo sai chính sách.'], ['Treating evictions as a problem for a cache: for a cache sized as a blast radius they are the brake working; for a queue they are lost jobs.', 'Coi việc đuổi là vấn đề của cache: với cache định cỡ làm vùng chịu nổ thì đó là phanh đang làm việc; với hàng đợi đó là job bị mất.']],
  gt: ['The decisive numbers are few: the hit/miss pair (alert on misses per second, 12.2), the fragmentation ratio (1.0–1.5 healthy), evicted_keys, and the policy — which must match the purpose: allkeys-* for a cache, noeviction for a queue. Production here shows used_memory 1.23M of 256M, evicted_keys:0 and a hit rate of 89.2%.', 'Các con số quyết định chỉ có vài cái: cặp trúng/trượt (cảnh báo theo số lần trượt mỗi giây, 12.2), tỉ lệ phân mảnh (1,0–1,5 là khoẻ), evicted_keys, và chính sách — phải khớp mục đích: allkeys-* cho cache, noeviction cho hàng đợi. Production ở đây báo used_memory 1,23M trên 256M, evicted_keys:0 và tỉ lệ trúng 89,2%.'],
  kn: ['observability', 'INFO'], tns: [tn('mem_fragmentation_ratio', 'tỉ lệ phân mảnh', 'used_memory_rss / used_memory — 1,0–1,5 là khoẻ'), tn('keyspace_hits / misses', 'trúng / trượt', 'cặp số cho biết cache có đang làm việc không')],
  dau: `/** Turn the text of INFO into a small health report. */
function healthReport(infoText, purpose) {
  // Write your solution here
  const f = {};
  for (const line of infoText.split('\\n')) { const [k, v] = line.split(':'); f[k] = v; }
  const hits = Number(f.keyspace_hits), misses = Number(f.keyspace_misses);
  return { hitRate: Math.round((hits / (hits + misses)) * 100), fragmentation: f.mem_fragmentation_ratio, evictedKeys: f.evicted_keys, policy: f.maxmemory_policy, warnings: [] };
}
`,
  giai: `/** Turn the text of INFO into a small health report. */
function healthReport(infoText, purpose) {
  const f = {};
  for (const raw of infoText.split(/\\r?\\n/)) {          // INFO uses \\r\\n
    const line = raw.trim();
    if (!line || line[0] === '#') continue;               // blank lines and "# Memory" headers
    const i = line.indexOf(':');                          // split on the FIRST colon only
    if (i > 0) f[line.slice(0, i)] = line.slice(i + 1);
  }
  const num = (k) => Number(f[k] || 0);
  const hits = num('keyspace_hits'), misses = num('keyspace_misses');
  const hitRate = hits + misses === 0 ? null : Math.round((hits / (hits + misses)) * 1000) / 10;
  const policy = f.maxmemory_policy;
  const fragmentation = num('mem_fragmentation_ratio');
  const evictedKeys = num('evicted_keys');

  const warnings = [];
  if (num('maxmemory') === 0) warnings.push('no-maxmemory');                       // no ceiling at all
  const okPolicy = purpose === 'queue' ? policy === 'noeviction' : policy === 'allkeys-lru' || policy === 'allkeys-lfu';
  if (!okPolicy) warnings.push('policy');                                           // cache ⇒ allkeys-*, queue ⇒ noeviction
  if (fragmentation > 1.5) warnings.push('fragmentation');
  if (evictedKeys > 0 && purpose === 'queue') warnings.push('evicting');            // an evicted job is a lost job
  return { hitRate, fragmentation, evictedKeys, policy, warnings };
}
`,
  chung: `const info = (o) => ['# Server', 'redis_version:7.4.9', 'executable:/usr/local/bin/redis-server', '', '# Memory',
  'used_memory:1289748', 'maxmemory:' + (o.max ?? 268435456), 'maxmemory_policy:' + (o.policy || 'allkeys-lru'), 'mem_fragmentation_ratio:' + (o.frag ?? 1.12), '',
  '# Stats', 'keyspace_hits:' + (o.hits ?? 165), 'keyspace_misses:' + (o.misses ?? 20), 'evicted_keys:' + (o.evicted ?? 0), 'expired_keys:21'].join(o.lf ? '\\n' : '\\r\\n');`,
  cases: [
    { goi: `healthReport(info({}), 'cache')`, moTa: ['The site’s production numbers: 89.2%, healthy', 'Số production của website: 89,2%, khoẻ'] },
    { goi: `healthReport(info({ policy: 'noeviction', max: 0, frag: 4.41, hits: 7775, misses: 1208 }), 'cache')`, moTa: ['A cache on the default policy with no ceiling', 'Một cache dùng chính sách mặc định, không có trần'] },
    { goi: `healthReport(info({ policy: 'allkeys-lru', evicted: 162616 }), 'queue')`, moTa: ['A queue on a cache Redis: wrong policy and evicted jobs', 'Hàng đợi trên Redis cache: sai chính sách và job bị đuổi'] },
    { goi: `[healthReport(info({ hits: 0, misses: 0, lf: true, policy: 'noeviction' }), 'queue'), healthReport(info({ policy: 'allkeys-lfu', evicted: 5 }), 'cache').warnings]`, an: true },
    { goi: `healthReport(info({ policy: 'volatile-lru', hits: 1, misses: 2, frag: 1.5 }), 'cache')`, an: true },
  ],
});

export default modul('nodejs-12-6-van-hanh-production', '12.6 Running Redis: SCAN, UNLINK, maxmemory, INFO', [E1, E2, E3, E4]);
