/** Node.js · 12.3 — Chọn đúng cấu trúc dữ liệu: String/Hash/List/Set/ZSet/Bitmap/HLL/Stream, vực mã hoá, đặt tên khoá. */
import { modul, cs, q, tn, bang1, jsBai, c, TN, FAKE_REDIS } from './_node-c12-14.mjs';

const CT = ['String', 'Hash', 'List', 'Set', 'Sorted Set', 'Bitmap', 'HyperLogLog', 'Stream'];
const E1 = cs({
  ten: '12.3 · The full menu: which structure answers which question', kho: 'EASY', phut: 10, loai: 'table',
  en: 'For each need from the Notes API, pick the Redis structure the lesson recommends. Think about the access pattern (what you will ASK), not just the shape of the data.',
  vi: 'Với mỗi nhu cầu của Notes API, chọn cấu trúc Redis mà bài khuyên dùng. Nghĩ theo cách truy cập (bạn sẽ HỎI gì), không chỉ hình dạng dữ liệu.',
  bang: [bang1('b1', ['Need → structure', 'Nhu cầu → cấu trúc'], [{ ma: 'n', ten: 'Need' }, { ma: 's', ten: 'Structure', luaChon: CT }], [
    { o: { n: 'A cached JSON of the user profile, plus a feature flag on/off' }, a: { s: 'String' } },
    { o: { n: 'A note’s counters where you bump ONE field: HINCRBY note:42 views 1' }, a: { s: 'Hash' } },
    { o: { n: 'Monthly leaderboard of notes by views, and “what rank is note 42?”' }, a: { s: 'Sorted Set' } },
    { o: { n: 'Tags of a note and “tags shared by note 1 and note 2” (intersection)' }, a: { s: 'Set' } },
    { o: { n: 'Which of our 1,000,000 users (dense numeric ids) were active today' }, a: { s: 'Bitmap' } },
    { o: { n: 'How many DISTINCT visitors this week — an approximation is fine, never “is user X in it?”' }, a: { s: 'HyperLogLog' } },
    { o: { n: 'The 100 most recent activity entries of a user (LPUSH + LTRIM)' }, a: { s: 'List' } },
    { o: { n: 'An append-only event log that workers consume with acknowledgements' }, a: { s: 'Stream' } },
  ], ['String for whole values and INCR counters; Hash when you edit individual fields; Sorted Set for anything with an ORDER (0.32 ms for a rank vs a window function in SQL); Set for membership and set arithmetic; Bitmap = 1 bit per dense id (152 KB for a million users); HyperLogLog = a fixed ~12 KB, counts only; List for capped recent entries; Stream for a log with consumer groups (12.5).', 'String cho giá trị trọn và bộ đếm INCR; Hash khi sửa từng trường; Sorted Set cho mọi thứ có THỨ TỰ (0,32 ms để hỏi hạng so với hàm cửa sổ trong SQL); Set cho thành viên và phép tính tập hợp; Bitmap = 1 bit mỗi id liền nhau (152 KB cho một triệu người); HyperLogLog = cố định ~12 KB, chỉ đếm; List cho N mục gần nhất có giới hạn; Stream cho nhật ký có nhóm tiêu thụ (12.5).'])],
  goiY: [['Ask: will I edit one field, rank, test membership, or only count?', 'Hỏi: mình sẽ sửa một trường, xếp hạng, kiểm thành viên, hay chỉ đếm?'], ['Dense numeric ids + yes/no per id ⇒ one bit each.', 'Id số liền nhau + có/không cho mỗi id ⇒ mỗi id một bit.']],
  loi: [['Choosing a Set to count unique visitors: exact, but 3.68 MB where a HyperLogLog needs ~12 KB.', 'Chọn Set để đếm khách duy nhất: chính xác, nhưng 3,68 MB trong khi HyperLogLog cần ~12 KB.'], ['Choosing HyperLogLog when the product needs “has user X seen this?” — HLL cannot answer membership.', 'Chọn HyperLogLog khi sản phẩm cần "người X đã xem chưa?" — HLL không trả lời được câu hỏi thành viên.']],
  tns: [tn('sorted set (ZSET)', 'tập có thứ tự', 'mỗi phần tử có điểm; Redis giữ sẵn thứ tự'), tn('HyperLogLog', 'đếm xấp xỉ', 'đếm số phần tử khác nhau trong ~12 KB cố định, sai ~0,8%'), tn('bitmap', 'bản đồ bit', 'một bit cho mỗi id số')],
  kn: ['data structures'],
});

const E2 = cs({
  ten: '12.3 · Memory: the cliff, the key overhead, the trade-offs', kho: 'MEDIUM', phut: 10,
  en: 'Every answer below is a used_memory or MEMORY USAGE number from the lesson. The surprises are the point: the win is rarely where people expect it.',
  vi: 'Mọi đáp án dưới đây là một con số used_memory hoặc MEMORY USAGE trong bài. Những điều bất ngờ mới là trọng tâm: lợi ích hiếm khi nằm ở chỗ người ta nghĩ.',
  cau: [
    q('c1', ['A hash with 512 fields used 10,288 bytes; with 513 fields, 37,024 bytes. What happened?', 'Một hash 512 trường dùng 10.288 byte; 513 trường dùng 37.024 byte. Chuyện gì đã xảy ra?'],
      ['It crossed hash-max-listpack-entries (512) and was converted from a compact listpack to a real hash table', 'The 513th field was a large string, so Redis allocated a new memory page for it', 'Redis started storing a second copy of the hash for persistence', 'The key got an expiry, and keys with a TTL use a larger encoding'],
      ['The switch is not gradual: one extra field, 3.6× the RAM. Splitting the same 1,000 fields into eight hashes of 125 cost 20,864 bytes instead of 64,296.', 'Việc chuyển không từ từ: thêm một trường, RAM gấp 3,6. Chẻ cùng 1.000 trường thành tám hash 125 trường chỉ tốn 20.864 byte thay vì 64.296.']),
    q('c2', ['100,000 sessions: 100k String keys 11.66 MB; bucketed into 1,000 hashes × 100 fields 5.93 MB. Why does the lesson still store sessions as 100k Strings?', '100.000 phiên: 100k khoá String 11,66 MB; gom vào 1.000 hash × 100 trường 5,93 MB. Vì sao bài vẫn lưu phiên bằng 100k String?'],
      ['TTL lives on keys, never on hash fields — a session store needs per-session expiry', 'Hashes cannot store JSON values, so each session would have to be split into fields', 'Bucketed hashes are slower to read, 436 ms against 283 ms', 'Redis forbids more than 100 fields in a hash that is read concurrently'],
      ['Bucketing halves the RAM and takes away EXPIRE per item. For “the last 100 events per user” it is free money; for sessions it is not.', 'Gom lô giảm một nửa RAM và lấy mất EXPIRE theo từng mục. Với "100 sự kiện gần nhất của mỗi người" thì lợi to; với phiên thì không.']),
    q('c3', ['A set of 20 integers uses the intset encoding (96 bytes). You store ids as "user-42" instead of 42. What changes?', 'Một set 20 số nguyên dùng mã hoá intset (96 byte). Bạn lưu id dạng "user-42" thay vì 42. Điều gì thay đổi?'],
      ['The set can never be an intset — one non-numeric member converts it permanently to a larger encoding', 'Nothing: Redis strips the prefix and stores the number internally', 'The set becomes a sorted set, because strings need an order', 'SISMEMBER stops working until the set is rebuilt'],
      ['intset is the densest layout Redis has; it converts on the first non-integer member and never converts back.', 'intset là cách xếp đặc nhất của Redis; nó chuyển đổi ngay ở phần tử không phải số nguyên đầu tiên và không bao giờ chuyển lại.']),
    q('c4', ['An empty Redis holding 1,000,000 tiny keys used 93.4 MB. What sizing rule follows?', 'Một Redis trống chứa 1.000.000 khoá nhỏ dùng 93,4 MB. Rút ra quy tắc định cỡ nào?'],
      ['Size by key count first (~93 bytes of overhead per key), value size second', 'Size by value size only; key names are compressed to almost nothing', 'Keep below 1,000,000 keys, because Redis switches to disk above that', 'Divide maxmemory by the average value size to get the key limit'],
      ['Every key carries a dictionary entry, an expiry slot and an object header. Teams that add up value sizes hit maxmemory at a third of the expected key count.', 'Mỗi khoá mang một mục từ điển, một ô hạn và một đầu đối tượng. Đội nào chỉ cộng kích thước giá trị sẽ chạm maxmemory ở một phần ba số khoá dự kiến.']),
    q('c5', ['Why is the quota key named quota:42:month:2026-07 instead of quota:42 with a monthly reset job?', 'Vì sao khoá hạn mức tên quota:42:month:2026-07 thay vì quota:42 kèm một job đặt lại hằng tháng?'],
      ['Next month is simply a different key — no reset job, and the old key expires on its own', 'Redis sorts keys by name, so the date makes SCAN return them in order', 'A colon-separated date is required for keys that carry a TTL', 'It makes INCR atomic, which it would not be on a plain quota:42 key'],
      ['Put the time bucket inside the key when the data is periodic. The site’s minute key stops being referenced when the minute ends and expires 65 seconds later.', 'Đưa khoảng thời gian vào trong tên khoá khi dữ liệu có chu kỳ. Khoá phút của website thôi được dùng khi hết phút và tự hết hạn 65 giây sau.']),
  ],
  goiY: [['OBJECT ENCODING key and MEMORY USAGE key answer “why is Redis so big”.', 'OBJECT ENCODING key và MEMORY USAGE key trả lời "vì sao Redis to thế".'], ['TTL is a property of a KEY.', 'TTL là thuộc tính của KHOÁ.']],
  loi: [['Believing “use hashes” saves memory by itself — a 3-field hash per session is barely smaller than a JSON string.', 'Tin rằng "dùng hash" tự nó tiết kiệm bộ nhớ — mỗi phiên một hash 3 trường gần như không nhỏ hơn chuỗi JSON.'], ['Sizing Redis by summing value sizes and forgetting ~93 bytes per key.', 'Định cỡ Redis bằng cách cộng kích thước giá trị mà quên ~93 byte mỗi khoá.']],
  tns: [tn('listpack', 'mã hoá gọn', 'cách xếp phẳng cho tập nhỏ; quá ngưỡng thì đổi sang bảng băm'), tn('encoding cliff', 'vực mã hoá', 'qua một ngưỡng nhỏ là RAM nhảy vọt')],
  kn: ['memory', 'encoding'],
});

const E3 = jsBai({
  ten: '12.3 · A leaderboard that answers “what rank am I?”', kho: 'MEDIUM', phut: 15,
  en: `<p>The SQL leaderboard of 12.2 costs 48 ms and can only be produced in full. A sorted set answers “what rank am I?” in 0.32 ms. Write three functions over the key ${c('lb:notes:views:<month>')} (e.g. ${c('lb:notes:views:2026-07')}):</p><ul><li>${c('addViews(redis, month, noteId, n)')} — add ${c('n')} views to a note (${c('ZINCRBY')}); resolve to the new total as a <b>number</b>;</li><li>${c('top(redis, month, k)')} — the ${c('k')} best notes, highest first, as ${c('[{ noteId, views }]')} with numbers (${c("ZREVRANGE … 'WITHSCORES'")} returns a flat array ${c('[member, score, member, score…]')} of strings);</li><li>${c('rankOf(redis, month, noteId)')} — 1-based rank (1 = most views), or ${c('null')} if the note has no views that month.</li></ul>`,
  vi: `<p>Bảng xếp hạng SQL của 12.2 tốn 48 ms và chỉ có thể dựng trọn. Sorted set trả lời "tôi hạng mấy?" trong 0,32 ms. Viết ba hàm trên khoá ${c('lb:notes:views:<tháng>')} (vd ${c('lb:notes:views:2026-07')}):</p><ul><li>${c('addViews(redis, month, noteId, n)')} — cộng ${c('n')} lượt xem cho một ghi chú (${c('ZINCRBY')}); resolve ra tổng mới dạng <b>số</b>;</li><li>${c('top(redis, month, k)')} — ${c('k')} ghi chú tốt nhất, cao nhất trước, dạng ${c('[{ noteId, views }]')} với số (${c("ZREVRANGE … 'WITHSCORES'")} trả một mảng phẳng ${c('[member, score, member, score…]')} toàn chuỗi);</li><li>${c('rankOf(redis, month, noteId)')} — hạng tính từ 1 (1 = nhiều lượt xem nhất), hoặc ${c('null')} nếu ghi chú không có lượt xem nào trong tháng đó.</li></ul>`,
  yc: [['One round trip per function call.', 'Mỗi lần gọi hàm một vòng đi-về.'], ['noteId and views are numbers in the output, not strings.', 'noteId và views trong kết quả là số, không phải chuỗi.'], ['Ranks are 1-based; ZREVRANK is 0-based.', 'Hạng tính từ 1; ZREVRANK tính từ 0.']],
  dauVao: ['redis · month — "YYYY-MM" · noteId, n, k — numbers', 'redis · month — "YYYY-MM" · noteId, n, k — số'],
  dauRa: ['addViews → number · top → {noteId, views}[] · rankOf → number | null', 'addViews → số · top → {noteId, views}[] · rankOf → số | null'],
  goiY: [['ZREVRANGE key 0 k-1 WITHSCORES — walk the flat array two at a time: for (let i = 0; i < a.length; i += 2).', 'ZREVRANGE key 0 k-1 WITHSCORES — đi mảng phẳng từng cặp: for (let i = 0; i < a.length; i += 2).'], ['zrevrank returns null for a missing member — keep the null, add 1 otherwise.', 'zrevrank trả null khi không có phần tử — giữ null, ngược lại cộng 1.']],
  loi: [['Using ZRANGE (ascending): the leaderboard comes out worst-first.', 'Dùng ZRANGE (tăng dần): bảng xếp hạng ra từ tệ nhất.'], ['Returning zrevrank as the rank: the top note is “rank 0”.', 'Trả zrevrank làm hạng: ghi chú đứng đầu thành "hạng 0".'], ['Asking ZREVRANGE for 0..k (inclusive end): one note too many.', 'Hỏi ZREVRANGE từ 0..k (cận cuối bao gồm): thừa một ghi chú.']],
  gt: ['Redis keeps the order inside the sorted set, so TOP-k and a single rank are one command each — no ORDER BY, no window function over every row. Putting the month in the key gives one leaderboard per month with no reset job. Converting strings to numbers at the edge keeps the API contract clean.', 'Redis giữ sẵn thứ tự trong sorted set, nên TOP-k và hạng của một phần tử đều chỉ một lệnh — không ORDER BY, không hàm cửa sổ trên mọi dòng. Đưa tháng vào khoá cho mỗi tháng một bảng xếp hạng mà không cần job đặt lại. Đổi chuỗi sang số ở rìa giữ hợp đồng API sạch.'],
  kn: ['sorted set', 'leaderboard'], tns: [tn('ZINCRBY', 'cộng điểm', 'tăng điểm của một phần tử, tạo nếu chưa có'), tn('ZREVRANK', 'hạng ngược', 'vị trí tính từ 0 theo điểm giảm dần')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `const key = (month) => \`lb:notes:views:\${month}\`;

async function addViews(redis, month, noteId, n) {
  return redis.zincrby(key(month), n, noteId);
}

async function top(redis, month, k) {
  // Write your solution here
  const ids = await redis.zrange(key(month), 0, k);
  return ids.map((id) => ({ noteId: id, views: 0 }));
}

async function rankOf(redis, month, noteId) {
  return redis.zrevrank(key(month), noteId);
}
`,
  giai: `const key = (month) => \`lb:notes:views:\${month}\`;   // one leaderboard per month, no reset job

async function addViews(redis, month, noteId, n) {
  const total = await redis.zincrby(key(month), n, noteId);   // creates the member if needed
  return Number(total);                                       // Redis replies with a string
}

async function top(redis, month, k) {
  // highest first, inclusive end index ⇒ 0 .. k-1
  const flat = await redis.zrevrange(key(month), 0, k - 1, 'WITHSCORES');
  const out = [];
  for (let i = 0; i < flat.length; i += 2) out.push({ noteId: Number(flat[i]), views: Number(flat[i + 1]) });
  return out;
}

async function rankOf(redis, month, noteId) {
  const r = await redis.zrevrank(key(month), noteId);         // 0-based, null when absent
  return r === null ? null : r + 1;
}
`,
  chung: `const redis = new FakeRedis();
const M = '2026-07';
for (const [id, v] of [[1, 50], [2, 980], [3, 120], [4, 980], [5, 7], [6, 300]]) await redis.zadd('lb:notes:views:' + M, v, String(id));
redis.roundTrips = 0;`,
  cases: [
    { goi: `[await top(redis, M, 3), redis.roundTrips]`, moTa: ['Top 3, highest first, numbers', 'Top 3, cao nhất trước, dạng số'] },
    { goi: `[await addViews(redis, M, 5, 400), await rankOf(redis, M, 5), await rankOf(redis, M, 2)]`, moTa: ['addViews returns a number; ranks are 1-based', 'addViews trả số; hạng tính từ 1'] },
    { goi: `[await rankOf(redis, M, 99), await rankOf(redis, '2026-08', 1), await top(redis, '2026-08', 5)]`, moTa: ['No views → null rank, empty month → []', 'Không có lượt xem → hạng null, tháng rỗng → []'] },
    { goi: `[await addViews(redis, '2026-08', 9, 3), await addViews(redis, '2026-08', 9, 4), await top(redis, '2026-08', 10), await rankOf(redis, '2026-08', 9)]`, an: true },
    { goi: `[(await top(redis, M, 100)).map((x) => x.noteId).join(','), (await top(redis, M, 1)).length]`, an: true },
  ],
});

const E4 = jsBai({
  ten: '12.3 · Quota counters with the period in the key', kho: 'MEDIUM', phut: 15,
  en: `<p>The site’s quota service never resets a counter: the period is baked into the name, and next month is simply a different key. Write:</p><ul><li>${c('quotaKeys(userId, ms)')} → ${c('{ minute, day, month }')} for the UTC time ${c('ms')}: ${c('quota:<id>:minute:YYYY-MM-DD-HH-mm')}, ${c('quota:<id>:day:YYYY-MM-DD')}, ${c('quota:<id>:month:YYYY-MM')} (two-digit months, days, hours, minutes);</li><li>${c('countUse(redis, userId, ms)')} → increments the three counters in ONE ${c('multi()')} (one round trip) and gives each its expiry — minute ${c('65')} s, day ${c('90000')} s, month ${c('35')} days — and resolves to ${c('{ minute, day, month }')} with the new counts.</li></ul>`,
  vi: `<p>Dịch vụ hạn mức của website không bao giờ đặt lại bộ đếm: khoảng thời gian nằm sẵn trong tên, tháng sau đơn giản là một khoá khác. Viết:</p><ul><li>${c('quotaKeys(userId, ms)')} → ${c('{ minute, day, month }')} cho thời điểm UTC ${c('ms')}: ${c('quota:<id>:minute:YYYY-MM-DD-HH-mm')}, ${c('quota:<id>:day:YYYY-MM-DD')}, ${c('quota:<id>:month:YYYY-MM')} (tháng, ngày, giờ, phút hai chữ số);</li><li>${c('countUse(redis, userId, ms)')} → tăng ba bộ đếm trong MỘT ${c('multi()')} (một vòng đi-về) và đặt hạn cho từng cái — phút ${c('65')} s, ngày ${c('90000')} s, tháng ${c('35')} ngày — rồi resolve ra ${c('{ minute, day, month }')} với số đếm mới.</li></ul>`,
  yc: [['Use UTC (getUTCFullYear, getUTCMonth…), not local time.', 'Dùng UTC (getUTCFullYear, getUTCMonth…), không dùng giờ địa phương.'], ['countUse: one round trip, INCR + EXPIRE for each of the three keys.', 'countUse: một vòng đi-về, INCR + EXPIRE cho từng khoá trong ba khoá.'], ['Counts are numbers.', 'Số đếm là số.']],
  dauVao: ['userId — number · ms — epoch milliseconds (UTC) · redis', 'userId — số · ms — mili-giây epoch (UTC) · redis'],
  dauRa: ['quotaKeys → { minute, day, month } (strings) · countUse → Promise<{ minute, day, month }> (numbers)', 'quotaKeys → { minute, day, month } (chuỗi) · countUse → Promise<{ minute, day, month }> (số)'],
  goiY: [['const d = new Date(ms); const p = (n) => String(n).padStart(2, \'0\'); getUTCMonth() is 0-based — add 1.', 'const d = new Date(ms); const p = (n) => String(n).padStart(2, \'0\'); getUTCMonth() tính từ 0 — cộng 1.'], ['const m = redis.multi(); m.incr(k.minute).expire(k.minute, 65)… ; const r = await m.exec(); the INCR replies are r[0][1], r[2][1], r[4][1].', 'const m = redis.multi(); m.incr(k.minute).expire(k.minute, 65)… ; const r = await m.exec(); các câu trả lời INCR là r[0][1], r[2][1], r[4][1].']],
  loi: [['getMonth()+1 without padding: "2026-7" and "2026-07" become two different keys for the same month.', 'getMonth()+1 không đệm số 0: "2026-7" và "2026-07" thành hai khoá khác nhau cho cùng một tháng.'], ['Local time instead of UTC: the day key flips at 07:00 Vietnam time on one server and at midnight on another.', 'Giờ địa phương thay vì UTC: khoá ngày lật lúc 07:00 giờ Việt Nam trên máy này và lúc nửa đêm trên máy khác.'], ['INCR and EXPIRE as two separate awaited commands: six round trips, and a crash in between leaves a counter with no TTL (lesson 12.4).', 'INCR và EXPIRE là hai lệnh await riêng: sáu vòng đi-về, và sập giữa chừng để lại một bộ đếm không có TTL (bài 12.4).']],
  gt: ['With the period inside the key, “resetting” is just time passing: the minute key stops being written when the minute ends and expires 65 s later; production shows expired_keys:21 and evicted_keys:0 — everything left on its own TTL. MULTI sends the six commands together and runs them as one unit, which is also what makes the site’s quota immune to the INCR-then-EXPIRE bug.', 'Khi khoảng thời gian nằm trong khoá, "đặt lại" chỉ là thời gian trôi: khoá phút thôi được ghi khi hết phút và hết hạn 65 s sau; production báo expired_keys:21 và evicted_keys:0 — mọi thứ rời đi theo TTL của chính nó. MULTI gửi sáu lệnh cùng nhau và chạy như một khối, cũng là thứ giúp hạn mức của website miễn nhiễm lỗi INCR-rồi-EXPIRE.'],
  kn: ['key naming', 'MULTI'], tns: [tn('time bucket', 'ô thời gian', 'khoảng thời gian ghi ngay trong tên khoá'), tn('MULTI / EXEC', 'giao dịch Redis', 'xếp lệnh rồi chạy cả khối, không ai chen giữa')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `function quotaKeys(userId, ms) {
  // Write your solution here
  const d = new Date(ms);
  return {
    minute: \`quota:\${userId}:minute:\${d.getUTCFullYear()}-\${d.getUTCMonth()}-\${d.getUTCDate()}-\${d.getUTCHours()}-\${d.getUTCMinutes()}\`,
    day: \`quota:\${userId}:day:\${d.getUTCFullYear()}-\${d.getUTCMonth()}-\${d.getUTCDate()}\`,
    month: \`quota:\${userId}:month:\${d.getUTCFullYear()}-\${d.getUTCMonth()}\`,
  };
}

async function countUse(redis, userId, ms) {
  const k = quotaKeys(userId, ms);
  return { minute: await redis.incr(k.minute), day: await redis.incr(k.day), month: await redis.incr(k.month) };
}
`,
  giai: `const p2 = (n) => String(n).padStart(2, '0');

/** quota keys for the UTC instant ms — the period IS the key, so nothing ever resets a counter */
function quotaKeys(userId, ms) {
  const d = new Date(ms);
  const month = \`\${d.getUTCFullYear()}-\${p2(d.getUTCMonth() + 1)}\`;   // getUTCMonth() is 0-based
  const day = \`\${month}-\${p2(d.getUTCDate())}\`;
  const minute = \`\${day}-\${p2(d.getUTCHours())}-\${p2(d.getUTCMinutes())}\`;
  return { minute: \`quota:\${userId}:minute:\${minute}\`, day: \`quota:\${userId}:day:\${day}\`, month: \`quota:\${userId}:month:\${month}\` };
}

/** INCR + EXPIRE for the three periods, as ONE MULTI (one round trip, one unit) */
async function countUse(redis, userId, ms) {
  const k = quotaKeys(userId, ms);
  const m = redis.multi();
  m.incr(k.minute).expire(k.minute, 65);          // a minute plus a margin
  m.incr(k.day).expire(k.day, 90000);             // 25 hours
  m.incr(k.month).expire(k.month, 35 * 86400);    // 35 days
  const r = await m.exec();                        // [[err, result], …] in the order queued
  return { minute: Number(r[0][1]), day: Number(r[2][1]), month: Number(r[4][1]) };
}
`,
  chung: `const redis = new FakeRedis();
const T = Date.UTC(2026, 6, 28, 3, 5, 9);   // 2026-07-28 03:05:09 UTC`,
  cases: [
    { goi: `quotaKeys(42, T)`, moTa: ['Keys for 2026-07-28 03:05 UTC (two digits everywhere)', 'Khoá cho 2026-07-28 03:05 UTC (hai chữ số mọi chỗ)'] },
    { goi: `[await countUse(redis, 42, T), await countUse(redis, 42, T + 30000), redis.roundTrips]`, moTa: ['Two uses in the same minute: counts 1 then 2, one round trip each', 'Hai lần dùng trong cùng một phút: đếm 1 rồi 2, mỗi lần một vòng đi-về'] },
    { goi: `[await countUse(redis, 7, T), await redis.ttl(quotaKeys(7, T).minute), await redis.ttl(quotaKeys(7, T).day), await redis.ttl(quotaKeys(7, T).month)]`, moTa: ['Each counter has its own TTL', 'Mỗi bộ đếm có TTL riêng'] },
    { goi: `[quotaKeys(1, Date.UTC(2026, 11, 31, 23, 59, 59)), quotaKeys(1, Date.UTC(2027, 0, 1, 0, 0, 0)).month]`, an: true },
    { goi: `[await countUse(redis, 5, T), await countUse(redis, 5, T + 61000), await countUse(redis, 5, Date.UTC(2026, 7, 1, 0, 0, 1))]`, an: true },
  ],
});

const E5 = jsBai({
  ten: '12.3 · Daily active users with bitmaps', kho: 'HARD', phut: 20,
  en: `<p>“Which of our million users were active today?” — 152 KB, exact, with one bit per numeric id. One bitmap per day, then ${c('BITOP AND')} across days gives retention with no query at all. Write, over keys ${c('active:<YYYY-MM-DD>')}:</p><ul><li>${c('markActive(redis, day, userId)')} — set the user’s bit (${c('SETBIT key userId 1')}); resolve to ${c('true')} if this is the user’s FIRST activity that day (the previous bit was 0), else ${c('false')};</li><li>${c('activeCount(redis, day)')} — how many users were active that day;</li><li>${c('activeEveryDay(redis, days)')} — how many users were active on ALL the given days: ${c('BITOP AND')} into the key ${c('active:all:<first>:<last>')} (first and last element of ${c('days')}), give that temporary key a 60-second TTL, and return its ${c('BITCOUNT')} — in one ${c('pipeline()')}.</li></ul>`,
  vi: `<p>"Trong một triệu người dùng, ai hoạt động hôm nay?" — 152 KB, chính xác, mỗi id số một bit. Mỗi ngày một bitmap, rồi ${c('BITOP AND')} qua các ngày cho tỉ lệ giữ chân mà không cần truy vấn nào. Viết, trên các khoá ${c('active:<YYYY-MM-DD>')}:</p><ul><li>${c('markActive(redis, day, userId)')} — bật bit của người dùng (${c('SETBIT key userId 1')}); resolve ra ${c('true')} nếu đây là lần hoạt động ĐẦU TIÊN của họ trong ngày (bit trước đó là 0), ngược lại ${c('false')};</li><li>${c('activeCount(redis, day)')} — số người hoạt động trong ngày;</li><li>${c('activeEveryDay(redis, days)')} — số người hoạt động trong TẤT CẢ các ngày cho trước: ${c('BITOP AND')} vào khoá ${c('active:all:<đầu>:<cuối>')} (phần tử đầu và cuối của ${c('days')}), đặt TTL 60 giây cho khoá tạm đó, rồi trả ${c('BITCOUNT')} của nó — trong một ${c('pipeline()')}.</li></ul>`,
  yc: [['markActive uses the reply of SETBIT (the previous bit) — no extra GETBIT round trip.', 'markActive dùng câu trả lời của SETBIT (bit cũ) — không thêm vòng GETBIT.'], ['activeEveryDay: BITOP + EXPIRE + BITCOUNT in ONE round trip; the temp key must not live forever.', 'activeEveryDay: BITOP + EXPIRE + BITCOUNT trong MỘT vòng đi-về; khoá tạm không được sống mãi.'], ['Empty days list → 0 without calling Redis.', 'Danh sách ngày rỗng → 0 mà không gọi Redis.']],
  dauVao: ['redis · day — "YYYY-MM-DD" · days — string[] · userId — number', 'redis · day — "YYYY-MM-DD" · days — string[] · userId — số'],
  dauRa: ['markActive → boolean · activeCount → number · activeEveryDay → number', 'markActive → boolean · activeCount → số · activeEveryDay → số'],
  goiY: [['SETBIT returns the bit that was there before: (await redis.setbit(k, id, 1)) === 0 means first time today.', 'SETBIT trả về bit có trước đó: (await redis.setbit(k, id, 1)) === 0 nghĩa là lần đầu trong ngày.'], ['const dest = `active:all:${days[0]}:${days[days.length - 1]}`; p.bitop(\'AND\', dest, ...days.map(k)).expire(dest, 60).bitcount(dest); the count is the last reply.', 'const dest = `active:all:${days[0]}:${days[days.length - 1]}`; p.bitop(\'AND\', dest, ...days.map(k)).expire(dest, 60).bitcount(dest); số đếm là câu trả lời cuối.']],
  loi: [['Fetching each day and intersecting in JavaScript: megabytes over the network for a number Redis can compute in place.', 'Tải từng ngày về rồi giao trong JavaScript: hàng MB qua mạng cho một con số Redis tính tại chỗ được.'], ['Leaving the BITOP destination without a TTL: every retention query leaves a 152 KB key behind forever.', 'Để khoá đích của BITOP không có TTL: mỗi lần hỏi tỉ lệ giữ chân để lại vĩnh viễn một khoá 152 KB.'], ['Using a bitmap for sparse or huge ids: a bitmap for user id 8,000,000 allocates a megabyte even if that is your only user.', 'Dùng bitmap cho id thưa hoặc rất lớn: bitmap cho id 8.000.000 cấp phát một MB dù đó là người dùng duy nhất.']],
  gt: ['One bit per id makes the day exact and tiny; BITOP AND computes “active on every day” inside Redis, BITCOUNT counts it, and the 60 s TTL keeps the temporary result from accumulating. Using the SETBIT reply for “first time today” saves the read-before-write round trip — and avoids its race.', 'Một bit mỗi id làm cho ngày vừa chính xác vừa nhỏ; BITOP AND tính "hoạt động mọi ngày" ngay trong Redis, BITCOUNT đếm nó, và TTL 60 s giữ cho kết quả tạm không tích tụ. Dùng câu trả lời của SETBIT cho "lần đầu hôm nay" bớt được vòng đọc-trước-khi-ghi — và tránh cuộc đua của nó.'],
  kn: ['bitmap', 'retention'], tns: [tn('SETBIT / BITCOUNT', 'bật bit / đếm bit', 'SETBIT trả bit cũ; BITCOUNT đếm số bit 1'), tn('BITOP AND', 'phép AND trên bitmap', 'giao các bitmap vào một khoá đích')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `const k = (day) => \`active:\${day}\`;

async function markActive(redis, day, userId) {
  // Write your solution here
  await redis.setbit(k(day), userId, 1);
  return true;
}

async function activeCount(redis, day) {
  return redis.bitcount(k(day));
}

async function activeEveryDay(redis, days) {
  let n = 0;
  for (const d of days) n = Math.max(n, await redis.bitcount(k(d)));
  return n;
}
`,
  giai: `const k = (day) => \`active:\${day}\`;          // one bitmap per day, bit index = numeric user id

async function markActive(redis, day, userId) {
  const before = await redis.setbit(k(day), userId, 1);   // SETBIT replies with the PREVIOUS bit
  return before === 0;                                   // first activity today — no extra GETBIT
}

async function activeCount(redis, day) {
  return redis.bitcount(k(day));                         // exact count of active users
}

async function activeEveryDay(redis, days) {
  if (days.length === 0) return 0;
  const dest = \`active:all:\${days[0]}:\${days[days.length - 1]}\`;
  const p = redis.pipeline();
  p.bitop('AND', dest, ...days.map(k))                   // intersect inside Redis
    .expire(dest, 60)                                    // a temporary result must not live forever
    .bitcount(dest);
  const replies = await p.exec();                        // one round trip
  return replies[2][1];
}
`,
  chung: `const redis = new FakeRedis();
const D = ['2026-07-21', '2026-07-22', '2026-07-23'];
const seed = async (day, ids) => { for (const id of ids) await redis.setbit('active:' + day, id, 1); };
await seed(D[0], [1, 2, 3, 5, 8, 13]); await seed(D[1], [2, 3, 5, 7, 11, 13]); await seed(D[2], [3, 5, 13, 21]);
redis.roundTrips = 0;`,
  cases: [
    { goi: `[await markActive(redis, '2026-07-24', 42), await markActive(redis, '2026-07-24', 42), await activeCount(redis, '2026-07-24')]`, moTa: ['First activity → true, second → false', 'Lần đầu → true, lần hai → false'] },
    { goi: `[await activeEveryDay(redis, D), redis.roundTrips, await redis.ttl('active:all:2026-07-21:2026-07-23')]`, moTa: ['Active on all three days: 3, 5, 13 → 3 in one round trip, temp key TTL 60', 'Hoạt động cả ba ngày: 3, 5, 13 → 3 trong một vòng đi-về, khoá tạm TTL 60'] },
    { goi: `[await activeEveryDay(redis, []), redis.roundTrips]`, moTa: ['No days → 0, no Redis call', 'Không có ngày → 0, không gọi Redis'] },
    { goi: `[await activeEveryDay(redis, D.slice(0, 2)), await activeCount(redis, D[0]), await markActive(redis, D[2], 2), await activeEveryDay(redis, D)]`, an: true },
    { goi: `[await activeEveryDay(redis, ['2026-07-21', '2026-07-30']), await activeCount(redis, '2026-07-30')]`, an: true },
  ],
});

export default modul('nodejs-12-3-cau-truc-du-lieu', '12.3 Redis data structures: sorted sets, counters, bitmaps', [E1, E2, E3, E4, E5]);
