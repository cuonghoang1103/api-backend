/** Node.js · 12.1 — Redis thực chất là gì: vòng đi-về chiếm gần hết thời gian, pipeline, MGET, một client dùng chung. */
import { modul, cs, q, tn, jsBai, c, TN, FAKE_REDIS } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '12.1 · Where the time goes: reading the measurements', kho: 'EASY', phut: 8,
  en: 'Every number below comes from the lesson, measured from Node against a local Redis. Read each one the way the lesson does: the work is free, the waiting is everything.',
  vi: 'Mọi con số dưới đây lấy từ bài học, đo từ Node tới một Redis cục bộ. Đọc từng số như bài đã đọc: việc thì miễn phí, chờ mới là tất cả.',
  cau: [
    q('c1', ['2,000 PING commands, each awaited, took 408.8 ms on localhost (0.204 ms each). Where did almost all of that time go?', '2.000 lệnh PING, await từng lệnh, mất 408,8 ms trên localhost (0,204 ms mỗi lệnh). Gần hết thời gian đó đi đâu?'],
      ['The round trip: writing to the socket, the kernel waking Redis, the reply waking Node again', 'Redis executing PING, which has to scan the keyspace once for every call', 'JSON.stringify and JSON.parse of the PONG reply inside ioredis', 'Redis writing every command to the append-only file before replying'],
      ['PING does no work. 0.204 ms is the socket round trip; the command itself is a rounding error inside that number — which is why 10,000 SETs cost the same as 10,000 PINGs.', 'PING không làm gì cả. 0,204 ms là vòng đi-về qua socket; bản thân lệnh chỉ là phần lẻ trong con số đó — vì thế 10.000 SET tốn ngang 10.000 PING.']),
    q('c2', ['10,000 SETs: awaited one by one 1,965 ms, in one pipeline 31 ms. What did the pipeline remove?', '10.000 SET: await từng cái 1.965 ms, trong một pipeline 31 ms. Pipeline đã bỏ đi cái gì?'],
      ['The waiting between commands — the work is the same 10,000 SETs, sent without waiting for each reply', 'Half of the work, because a pipeline merges identical SET commands into one', 'The durability of the writes: pipelined commands are not stored until EXEC', 'Redis’s single thread, because a pipeline runs commands on several threads'],
      ['A pipeline sends many commands and reads all replies at once: one round trip instead of 10,000. 63× faster for exactly the same work.', 'Pipeline gửi nhiều lệnh rồi đọc mọi câu trả lời một lượt: một vòng đi-về thay vì 10.000. Nhanh hơn 63× cho đúng cùng khối việc.']),
    q('c3', ['Batch size 1 → 100 bought 49×; 1,000 → 10,000 bought 8%. What batch size does the lesson recommend, and why?', 'Cỡ lô 1 → 100 được 49×; 1.000 → 10.000 chỉ được 8%. Bài khuyên cỡ lô nào, vì sao?'],
      ['Chunks of 100–1,000: the curve is flat after that, and one giant batch blocks every other client while it runs', 'Always everything in one pipeline, because each extra round trip costs another 0.2 ms', 'Exactly 1 command per pipeline, because larger batches lose replies under load', 'Chunks of 10, because Redis rejects pipelines of more than 64 commands'],
      ['Redis is single-threaded: a 10,000-command batch is one long stretch during which nobody else is served. The gain past ~1,000 is tiny, the cost to others is not.', 'Redis đơn luồng: một lô 10.000 lệnh là một khoảng dài không ai khác được phục vụ. Lợi ích sau ~1.000 rất nhỏ, cái giá với người khác thì không.']),
    q('c4', ['A GET of 100 bytes took 0.186 ms, of 10 KB 0.204 ms. What design rule follows?', 'GET 100 byte mất 0,186 ms, 10 KB mất 0,204 ms. Rút ra quy tắc thiết kế nào?'],
      ['Fetching one 10 KB object is far cheaper than a hundred 100-byte objects — group related data in one key', 'Keep every value under 100 bytes, because Redis slows down linearly with value size', 'Compress every value, because 10 KB costs 100× more transfer than 100 bytes', 'Store big values in Postgres, because Redis cannot hold values above 10 KB'],
      ['Until ~100 KB the round trip dominates: 100× more data cost 10% more time. A hundred small keys means a hundred round trips.', 'Tới khoảng 100 KB vòng đi-về vẫn áp đảo: dữ liệu gấp 100 lần chỉ tốn thêm 10% thời gian. Một trăm khoá nhỏ là một trăm vòng đi-về.']),
    q('c5', ['Why does the lesson open ONE Redis client per process, with an error listener and maxRetriesPerRequest: 2?', 'Vì sao bài mở MỘT client Redis cho mỗi tiến trình, có bộ nghe lỗi và maxRetriesPerRequest: 2?'],
      ['A connection is expensive to open and multiplexes thousands of commands; an unhandled error event crashes Node; unbounded retries hang requests', 'Redis allows only one connection per IP address, and the listener is required by the protocol', 'Two retries make every command exactly-once, and the listener logs slow commands', 'One client is faster because ioredis caches every GET reply in process memory'],
      ['One shared client is reused by every request. An EventEmitter emitting "error" with nobody listening kills the process (chapter 3.4). A bounded retry fails fast instead of piling up hung HTTP requests.', 'Một client dùng chung cho mọi request. EventEmitter phát "error" mà không ai nghe sẽ giết tiến trình (chương 3.4). Thử lại có giới hạn thì lỗi nhanh, thay vì dồn đống request HTTP treo.']),
  ],
  goiY: [['Ask of each number: is this the work, or the waiting?', 'Với mỗi con số hãy hỏi: đây là việc, hay là chờ?'], ['Remember: Redis runs ONE command (or one batch) at a time for everyone.', 'Nhớ: Redis chạy MỘT lệnh (hoặc một lô) tại một thời điểm cho tất cả mọi người.']],
  loi: [['Concluding "Redis is slow" from a loop of 200 awaited GETs — the loop is slow, MGET does the same in 1.6 ms.', 'Kết luận "Redis chậm" từ một vòng lặp 200 GET có await — chậm là vòng lặp, MGET làm việc đó trong 1,6 ms.'], ['Putting 100,000 commands in one pipeline and freezing every other client meanwhile.', 'Nhét 100.000 lệnh vào một pipeline và làm đứng mọi client khác trong lúc đó.']],
  tns: [TN.rtt, TN.pipeline, tn('MGET', 'lấy nhiều khoá', 'một lệnh, nhiều khoá, một vòng đi-về')],
  kn: ['round trip', 'pipelining'],
});

const E2 = jsBai({
  ten: '12.1 · Replace the GET loop with one MGET', kho: 'EASY', phut: 10,
  en: `<p>The Notes API shows the authors of a page of notes. The current code awaits one ${c('GET user:<id>')} per id — 200 ids, 200 round trips (~41 ms in the lesson), and somebody concluded "Redis is slow here". Rewrite ${c('getUsers(redis, ids)')} so it makes <b>exactly one</b> round trip with ${c('MGET')}.</p><p>Each key ${c('user:<id>')} holds a JSON string of the user. Return an array in the SAME order as ${c('ids')}: the parsed user, or ${c('null')} for an id that has no key. An empty ${c('ids')} returns ${c('[]')} without calling Redis.</p><p>The file ${c('fake-redis.js')} gives you an in-memory Redis with the ioredis API (${c('await redis.mget(...keys)')} returns an array of strings / ${c('null')}); ${c('redis.roundTrips')} counts round trips.</p>`,
  vi: `<p>Notes API hiển thị tác giả của một trang ghi chú. Code hiện tại await một ${c('GET user:<id>')} cho mỗi id — 200 id, 200 vòng đi-về (~41 ms trong bài), và có người đã kết luận "Redis chậm ở đây". Viết lại ${c('getUsers(redis, ids)')} để nó chỉ đi-về <b>đúng một lần</b> bằng ${c('MGET')}.</p><p>Mỗi khoá ${c('user:<id>')} giữ chuỗi JSON của người dùng. Trả mảng theo ĐÚNG thứ tự ${c('ids')}: người dùng đã parse, hoặc ${c('null')} với id không có khoá. ${c('ids')} rỗng thì trả ${c('[]')} và không gọi Redis.</p><p>Tệp ${c('fake-redis.js')} là một Redis trong bộ nhớ với API của ioredis (${c('await redis.mget(...keys)')} trả mảng chuỗi / ${c('null')}); ${c('redis.roundTrips')} đếm số vòng đi-về.</p>`,
  yc: [['One round trip for any number of ids (ids.length ≥ 1).', 'Một vòng đi-về cho mọi số lượng id (ids.length ≥ 1).'], ['Keep the order of ids; missing users are null.', 'Giữ thứ tự ids; người dùng không có là null.'], ['Do not call Redis at all for an empty list.', 'Danh sách rỗng thì không gọi Redis.']],
  dauVao: ['redis — FakeRedis · ids — number[]', 'redis — FakeRedis · ids — number[]'],
  dauRa: ['Promise<(object | null)[]>', 'Promise<(object | null)[]>'],
  goiY: [['Build the key list first: ids.map((id) => `user:${id}`).', 'Dựng danh sách khoá trước: ids.map((id) => `user:${id}`).'], ['await redis.mget(...keys) returns the values in key order — map each one with v === null ? null : JSON.parse(v).', 'await redis.mget(...keys) trả giá trị theo thứ tự khoá — map từng cái bằng v === null ? null : JSON.parse(v).']],
  loi: [['Keeping the for … await redis.get() loop: correct data, N round trips — the exact mistake that makes Redis look slower than Postgres.', 'Giữ vòng for … await redis.get(): dữ liệu đúng, N vòng đi-về — đúng lỗi làm Redis trông chậm hơn Postgres.'], ['Using Promise.all of N GETs: faster, but still N commands and N replies; MGET is one command.', 'Dùng Promise.all của N lệnh GET: nhanh hơn, nhưng vẫn N lệnh và N câu trả lời; MGET là một lệnh.'], ['Filtering out the nulls — the caller relies on result[i] belonging to ids[i].', 'Lọc bỏ các null — nơi gọi dựa vào việc result[i] thuộc về ids[i].']],
  gt: ['MGET is pipelining built into the command: one request, one reply, whatever the number of keys. The lesson measured 1,000 sequential GETs at 200.2 ms against one MGET at 1.6 ms (127×). Whenever you are about to loop over ids and GET each one, look for the plural command first: MGET, HMGET, SMEMBERS, ZRANGE.', 'MGET là pipeline gắn sẵn trong lệnh: một yêu cầu, một câu trả lời, bất kể bao nhiêu khoá. Bài đo 1.000 GET tuần tự 200,2 ms so với một MGET 1,6 ms (127×). Mỗi khi định lặp qua các id và GET từng cái, hãy tìm lệnh số nhiều trước: MGET, HMGET, SMEMBERS, ZRANGE.'],
  kn: ['MGET', 'round trip'], tns: [TN.rtt, tn('MGET', 'lấy nhiều khoá', 'một lệnh, nhiều khoá, một vòng đi-về')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Return the users for ids (same order, null when missing) — in ONE round trip. */
async function getUsers(redis, ids) {
  // Write your solution here — this loop is correct but makes ids.length round trips
  const out = [];
  for (const id of ids) {
    const v = await redis.get(\`user:\${id}\`);
    out.push(v === null ? null : JSON.parse(v));
  }
  return out;
}
`,
  giai: `/** Return the users for ids (same order, null when missing) — in ONE round trip. */
async function getUsers(redis, ids) {
  if (ids.length === 0) return [];                       // MGET with no key is an error in real Redis — and pointless
  const keys = ids.map((id) => \`user:\${id}\`);
  const values = await redis.mget(...keys);              // ONE command, ONE round trip, values in key order
  // a missing key comes back as null — keep the slot so result[i] still belongs to ids[i]
  return values.map((v) => (v === null ? null : JSON.parse(v)));
}
`,
  chung: `const redis = new FakeRedis();
for (let id = 1; id <= 300; id++) if (id % 7 !== 0) await redis.set(\`user:\${id}\`, JSON.stringify({ id, name: 'u' + id }));
redis.roundTrips = 0;`,
  cases: [
    { goi: `[await getUsers(redis, [3, 1, 7]), redis.roundTrips]`, moTa: ['Three ids, one missing (7): order kept, one round trip', 'Ba id, một id thiếu (7): giữ thứ tự, một vòng đi-về'] },
    { goi: `[(await getUsers(redis, Array.from({ length: 200 }, (_, i) => i + 1))).filter(Boolean).length, redis.roundTrips]`, moTa: ['200 ids → still ONE round trip', '200 id → vẫn MỘT vòng đi-về'] },
    { goi: `[await getUsers(redis, []), redis.roundTrips]`, moTa: ['Empty list: no Redis call', 'Danh sách rỗng: không gọi Redis'] },
    { goi: `[(await getUsers(redis, [14, 15, 999, 15])), redis.roundTrips]`, an: true },
    { goi: `[(await getUsers(redis, Array.from({ length: 50 }, (_, i) => 300 - i))).map((u) => (u ? u.id : null)).join(','), redis.roundTrips]`, an: true },
  ],
});

const E3 = jsBai({
  ten: '12.1 · Write 10,000 keys in pipelined chunks', kho: 'MEDIUM', phut: 15,
  en: `<p>A nightly import writes thousands of keys. Awaiting each ${c('SET')} costs one round trip per key (10,000 SETs = 1,965 ms in the lesson); one giant pipeline is fast but blocks every other client while Redis chews through it. Write ${c('setMany(redis, entries, chunkSize = 500)')}:</p><ul><li>${c('entries')} is an array of ${c('[key, value]')} pairs;</li><li>send them with ${c('redis.pipeline()')} in chunks of at most ${c('chunkSize')} commands — ${c('Math.ceil(entries.length / chunkSize)')} round trips in total, one ${c('exec()')} per chunk, chunks one after another;</li><li>if a chunk reply contains an error (${c('[err, result]')} with ${c('err')} not null), throw that error;</li><li>return the number of keys written.</li></ul>`,
  vi: `<p>Một đợt nhập dữ liệu ban đêm ghi hàng nghìn khoá. Await từng ${c('SET')} tốn một vòng đi-về mỗi khoá (10.000 SET = 1.965 ms trong bài); một pipeline khổng lồ thì nhanh nhưng làm đứng mọi client khác trong lúc Redis nhai nó. Viết ${c('setMany(redis, entries, chunkSize = 500)')}:</p><ul><li>${c('entries')} là mảng các cặp ${c('[key, value]')};</li><li>gửi bằng ${c('redis.pipeline()')} theo từng lô tối đa ${c('chunkSize')} lệnh — tổng cộng ${c('Math.ceil(entries.length / chunkSize)')} vòng đi-về, mỗi lô một ${c('exec()')}, các lô nối tiếp nhau;</li><li>nếu câu trả lời của một lô có lỗi (${c('[err, result]')} mà ${c('err')} khác null) thì ném lỗi đó;</li><li>trả số khoá đã ghi.</li></ul>`,
  yc: [['Exactly Math.ceil(n / chunkSize) round trips (0 when there is nothing to write).', 'Đúng Math.ceil(n / chunkSize) vòng đi-về (0 khi không có gì để ghi).'], ['No pipeline larger than chunkSize commands.', 'Không pipeline nào lớn hơn chunkSize lệnh.'], ['Surface errors from exec(): pipelines report them per command, they do not throw by themselves.', 'Đưa lỗi trong exec() ra ngoài: pipeline báo lỗi theo từng lệnh, tự nó không ném.']],
  dauVao: ['redis — FakeRedis · entries — [string, string][] · chunkSize — number (default 500)', 'redis — FakeRedis · entries — [string, string][] · chunkSize — số (mặc định 500)'],
  dauRa: ['Promise<number> — keys written', 'Promise<number> — số khoá đã ghi'],
  goiY: [['for (let i = 0; i < entries.length; i += chunkSize) { const part = entries.slice(i, i + chunkSize); … }', 'for (let i = 0; i < entries.length; i += chunkSize) { const part = entries.slice(i, i + chunkSize); … }'], ['Inside: const p = redis.pipeline(); for (const [k, v] of part) p.set(k, v); const replies = await p.exec(); then look for replies.find(([err]) => err).', 'Bên trong: const p = redis.pipeline(); for (const [k, v] of part) p.set(k, v); const replies = await p.exec(); rồi tìm replies.find(([err]) => err).']],
  loi: [['One pipeline for all 10,000 commands — fastest on your laptop, a latency spike for everybody else in production.', 'Một pipeline cho cả 10.000 lệnh — nhanh nhất trên máy bạn, một cú tăng độ trễ cho mọi người khác trên production.'], ['Forgetting to await exec(): the function returns before anything is written, and the chunk errors vanish.', 'Quên await exec(): hàm trả về trước khi ghi xong, và lỗi của lô biến mất.'], ['Assuming exec() throws on a failed command — it resolves with [err, null] for that slot, so an unchecked failure is silent.', 'Tưởng exec() ném lỗi khi một lệnh hỏng — nó resolve với [err, null] ở ô đó, nên lỗi không kiểm là lỗi câm.']],
  gt: ['The lesson’s batch-size curve: 1 → 100 commands per pipeline bought 49×, 1,000 → 10,000 bought 8%. Chunks of a few hundred keep almost all of the speed and give other clients a turn between chunks, because Redis serves them in between round trips. Checking each [err, result] pair matters because ioredis resolves exec() even when individual commands failed.', 'Đường cong cỡ lô trong bài: 1 → 100 lệnh mỗi pipeline được 49×, 1.000 → 10.000 được 8%. Lô vài trăm giữ gần hết tốc độ và cho client khác một lượt giữa các lô, vì Redis phục vụ họ giữa các vòng đi-về. Phải kiểm từng cặp [err, result] vì ioredis vẫn resolve exec() dù từng lệnh hỏng.'],
  kn: ['pipelining', 'batch size'], tns: [TN.pipeline, TN.rtt, tn('chunk', 'lô', 'một phần của danh sách lớn, gửi trong một lượt')],
  gia: { 'fake-redis.js': FAKE_REDIS },
  dau: `/** Write all entries with pipelines of at most chunkSize commands. */
async function setMany(redis, entries, chunkSize = 500) {
  // Write your solution here — this is the 1,965 ms version (one round trip per key)
  for (const [k, v] of entries) await redis.set(k, v);
  return entries.length;
}
`,
  giai: `/** Write all entries with pipelines of at most chunkSize commands. */
async function setMany(redis, entries, chunkSize = 500) {
  let written = 0;
  for (let i = 0; i < entries.length; i += chunkSize) {
    const part = entries.slice(i, i + chunkSize);        // never more than chunkSize commands in one batch
    const p = redis.pipeline();
    for (const [k, v] of part) p.set(k, v);              // queued locally — nothing is sent yet
    const replies = await p.exec();                      // ONE round trip for the whole chunk
    const failed = replies.find(([err]) => err);         // exec() resolves even if a command failed
    if (failed) throw failed[0];
    written += part.length;
  }
  return written;                                        // other clients got a turn between chunks
}
`,
  chung: `const redis = new FakeRedis();
const make = (n, p = 'k') => Array.from({ length: n }, (_, i) => [p + ':' + i, 'v' + i]);`,
  cases: [
    { goi: `[await setMany(redis, make(1200)), redis.roundTrips, await redis.get('k:1199')]`, moTa: ['1,200 keys, chunk 500 → 3 round trips', '1.200 khoá, lô 500 → 3 vòng đi-về'] },
    { goi: `[await setMany(redis, make(10), 4), redis.roundTrips, await redis.mget('k:0', 'k:9')]`, moTa: ['10 keys, chunk 4 → 3 round trips', '10 khoá, lô 4 → 3 vòng đi-về'] },
    { goi: `[await setMany(redis, []), redis.roundTrips]`, moTa: ['Nothing to write → no round trip', 'Không có gì để ghi → không vòng đi-về'] },
    { chuanBi: `redis.maxKeys = 3;`, goi: `await setMany(redis, make(6), 10)`, nem: 'ReplyError', thongDiep: 'OOM', moTa: ['A failed command inside a chunk is thrown', 'Lệnh hỏng trong một lô thì phải ném ra'] },
    { goi: `[await setMany(redis, make(1001, 'x'), 1000), redis.roundTrips - 0, await redis.get('x:1000')]`, an: true },
    { goi: `[await setMany(redis, make(500)), redis.roundTrips]`, an: true },
  ],
  kiemThem: [{ khop: 'pipeline\\(|multi\\(', moTa: { en: 'Uses redis.pipeline() (or multi())', vi: 'Dùng redis.pipeline() (hoặc multi())' } }],
});

const FAKE_CLIENT = `// fake-client.js — PROVIDED by the exercise (loaded before answer.js).
// createClient() builds a NEW connection object every time (count: createClient.created).
// client.connect() takes 5 ms (virtual) and sets client.isReady = true; set createClient.failNext = n to make
// the next n connect() calls reject with Error('ECONNREFUSED'). client.on(event, fn) registers a listener.
function createClient() {
  createClient.created++;
  const listeners = {};
  const client = {
    id: createClient.created, isReady: false,
    on(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); return client; },
    listenerCount(ev) { return (listeners[ev] || []).length; },
    connect() {
      return new Promise((ok, no) => setTimeout(() => {
        if (createClient.failNext > 0) { createClient.failNext--; no(new Error('ECONNREFUSED')); return; }
        client.isReady = true; ok(client);
      }, 5));
    },
  };
  return client;
}
createClient.created = 0;
createClient.failNext = 0;
`;

const E4 = jsBai({
  ten: '12.1 · getRedis(): one shared client, even under 20 first requests', kho: 'MEDIUM', phut: 15,
  en: `<p>The site’s ${c('src/config/redis.ts')} exports a lazy ${c('getRedis()')} that memoises the client <b>and returns the in-flight connect promise if one is already running</b> — so twenty concurrent first requests open one connection, not twenty. Write it.</p><ul><li>${c('createClient()')} (from ${c('fake-client.js')}) makes a new connection object; ${c('await client.connect()')} takes 5 ms.</li><li>Every call to ${c('getRedis()')} resolves to the SAME, connected client (${c('isReady === true')}).</li><li>Attach exactly one ${c("'error'")} listener (an EventEmitter that emits ${c('error')} with no listener crashes Node).</li><li>If ${c('connect()')} rejects, the caller gets the error, and the NEXT call tries again with a fresh client (do not cache a failure forever).</li></ul>`,
  vi: `<p>${c('src/config/redis.ts')} của website xuất một ${c('getRedis()')} khởi tạo lười, nhớ client <b>và trả về chính promise đang kết nối nếu đã có một lần kết nối đang chạy</b> — nên hai mươi request đầu tiên đồng thời chỉ mở một kết nối, không phải hai mươi. Hãy viết nó.</p><ul><li>${c('createClient()')} (trong ${c('fake-client.js')}) tạo một đối tượng kết nối mới; ${c('await client.connect()')} mất 5 ms.</li><li>Mọi lần gọi ${c('getRedis()')} resolve ra CÙNG một client đã kết nối (${c('isReady === true')}).</li><li>Gắn đúng một bộ nghe ${c("'error'")} (EventEmitter phát ${c('error')} mà không ai nghe sẽ làm sập Node).</li><li>Nếu ${c('connect()')} reject, nơi gọi nhận lỗi, và lần gọi KẾ TIẾP thử lại bằng client mới (đừng nhớ một lần hỏng mãi mãi).</li></ul>`,
  yc: [['20 concurrent first calls → createClient.created === 1.', '20 lời gọi đầu tiên đồng thời → createClient.created === 1.'], ['Never resolve to a client that is not connected yet.', 'Không bao giờ resolve ra client chưa kết nối xong.'], ['A failed connect is not cached.', 'Lần kết nối hỏng không được nhớ lại.']],
  dauVao: ['— (module-level state in answer.js)', '— (trạng thái cấp module trong answer.js)'],
  dauRa: ['Promise<client>', 'Promise<client>'],
  goiY: [['Keep two module variables: client (the connected one) and connecting (the promise of the connect that is running).', 'Giữ hai biến cấp module: client (cái đã kết nối) và connecting (promise của lần kết nối đang chạy).'], ['If client → return it. If connecting → return connecting. Otherwise create the promise, store it in connecting BEFORE awaiting anything, and clear it in .finally().', 'Có client → trả nó. Có connecting → trả connecting. Không thì tạo promise, gán vào connecting TRƯỚC khi await bất cứ gì, và xoá nó trong .finally().']],
  loi: [['Assigning client only after await connect(): every request that arrives during those 5 ms creates its own connection — 20 requests, 20 connections.', 'Chỉ gán client sau await connect(): mọi request tới trong 5 ms đó tự tạo kết nối riêng — 20 request, 20 kết nối.'], ['Assigning client before connect() finishes: the other callers get a client that is not ready and their first command fails.', 'Gán client trước khi connect() xong: những nơi gọi khác nhận client chưa sẵn sàng và lệnh đầu tiên của họ hỏng.'], ['Caching the rejected promise: after one network blip at boot, getRedis() fails forever.', 'Nhớ luôn promise đã reject: sau một lần mạng chập chờn lúc khởi động, getRedis() hỏng mãi mãi.']],
  gt: ['The event loop runs one callback at a time, so between "is anyone connecting?" and "I am connecting now" nothing else can run — storing the promise synchronously is enough, no lock needed. Concurrent callers attach to the same promise; .finally() clears it so a failure is retried by the next caller, while success leaves a memoised client. Production reports connected_clients:4 for the whole backend because of exactly this.', 'Event loop chạy một callback mỗi lúc, nên giữa "có ai đang kết nối không?" và "tôi đang kết nối" không gì khác chạy được — gán promise một cách đồng bộ là đủ, không cần khoá. Những lời gọi đồng thời bám vào cùng promise; .finally() xoá nó để lần hỏng được thử lại bởi người gọi sau, còn thành công thì để lại client đã nhớ. Production báo connected_clients:4 cho cả backend nhờ đúng điều này.'],
  kn: ['singleton', 'lazy initialisation'], tns: [tn('memoise', 'ghi nhớ kết quả', 'tính một lần, lần sau trả lại cái đã có'), tn('in-flight promise', 'promise đang bay', 'việc đã bắt đầu nhưng chưa xong — người tới sau bám vào nó')],
  gia: { 'fake-client.js': FAKE_CLIENT },
  dau: `let client = null;

/** One shared, connected client per process. */
async function getRedis() {
  // Write your solution here — correct for ONE caller, wrong for 20 concurrent ones
  if (client) return client;
  const c = createClient();
  c.on('error', (err) => console.error('redis error', err.message));
  await c.connect();
  client = c;
  return client;
}
`,
  giai: `let client = null;       // the connected client, once we have one
let connecting = null;   // the promise of the connect that is running right now

/** One shared, connected client per process. */
async function getRedis() {
  if (client) return client;                 // fast path: already connected
  if (connecting) return connecting;         // someone is connecting: wait for THEIR connection
  // set connecting synchronously — no other callback can run between the check above and this line
  connecting = (async () => {
    const c = createClient();
    c.on('error', (err) => console.error('redis error', err.message));   // never leave 'error' unhandled
    await c.connect();
    client = c;                              // publish only a READY client
    return c;
  })().finally(() => { connecting = null; }); // success or failure: the next caller decides again
  return connecting;
}
`,
  cases: [
    { goi: `await (async () => { const all = await Promise.all(Array.from({ length: 20 }, () => getRedis())); return [createClient.created, all.every((x) => x === all[0]), all.every((x) => x.isReady)]; })()`, moTa: ['20 concurrent first calls: one connection, all ready', '20 lời gọi đầu đồng thời: một kết nối, tất cả sẵn sàng'] },
    { goi: `await (async () => { const a = await getRedis(); const b = await getRedis(); return [createClient.created, a === b, a.listenerCount('error')]; })()`, moTa: ['Sequential calls reuse the client; one error listener', 'Gọi tuần tự dùng lại client; một bộ nghe lỗi'] },
    { goi: `await (async () => { createClient.failNext = 1; let first; try { await getRedis(); first = 'resolved'; } catch (e) { first = e.message; } const c = await getRedis(); return [first, c.isReady, createClient.created]; })()`, moTa: ['A failed connect is retried by the next call', 'Lần kết nối hỏng được thử lại ở lần gọi sau'] },
    { goi: `await (async () => { const p1 = getRedis(); await sleep(2); const p2 = getRedis(); await sleep(10); const p3 = getRedis(); const r = await Promise.all([p1, p2, p3]); return [createClient.created, r[0] === r[1] && r[1] === r[2], r[2].listenerCount('error')]; })()`, chuanBi: 'const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));', an: true },
    { goi: `await (async () => { createClient.failNext = 1; const r = await Promise.allSettled(Array.from({ length: 5 }, () => getRedis())); const c = await getRedis(); return [r.map((x) => x.status).join(','), createClient.created, c.isReady]; })()`, an: true },
  ],
});

export default modul('nodejs-12-1-redis-co-ban', '12.1 Redis: round trips, pipelining, MGET, one shared client', [E1, E2, E3, E4]);
