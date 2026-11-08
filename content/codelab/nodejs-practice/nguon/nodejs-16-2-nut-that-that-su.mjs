/** Node.js 16.2 — Thời gian thật sự ở đâu: DB 97,2%, trần Amdahl 2,8%, EXPLAIN 0,039 ms vs 4,616 ms, chờ pool vs chạy truy vấn, định luật Little. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'The database share, the pool curve, and a good plan that is not a fast query', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 16.2 (PostgreSQL 17, 500,000 notes, Node 22 in a Linux container).',
  vi: 'Câu hỏi về bài 16.2 (PostgreSQL 17, 500.000 ghi chú, Node 22 trong container Linux).',
  cau: [
    q('c1', ['db 4.616 ms (97.2%), JS transform 0.002 ms, JSON.stringify 0.131 ms (2.8%). If the JavaScript were infinitely fast, the route would go from 1,764 req/s to about…', 'db 4,616 ms (97,2%), biến đổi JS 0,002 ms, JSON.stringify 0,131 ms (2,8%). Nếu JavaScript nhanh vô hạn, route sẽ đi từ 1.764 req/s lên khoảng…'],
      ['1,814 req/s (+2.9%): the ceiling of all code-level tuning here', '3,528 req/s (2×): halving the work doubles the throughput', '17,640 req/s (10×): JavaScript is the slow part of Node', '1,764 req/s: serialisation is done by the database, not by Node'],
      ['Amdahl’s law: speeding up a part can only save what that part costs. Measure the share first.', 'Định luật Amdahl: tăng tốc một phần chỉ tiết kiệm được đúng phần đó tốn. Đo tỉ lệ trước.']),
    q('c2', ['EXPLAIN (ANALYZE, BUFFERS) says actual time 0.039 ms; the app measured 4.616 ms for the same query. Where is the rest?', 'EXPLAIN (ANALYZE, BUFFERS) báo actual time 0,039 ms; app đo 4,616 ms cho cùng truy vấn. Phần còn lại ở đâu?'],
      ['Waiting for a pool connection, the round trip and protocol, and PostgreSQL’s own queue', 'In the index scan, which EXPLAIN does not time when the pages are cached', 'In the JSON serialisation of the rows, which pg does inside the database', 'In the disk reads, because shared hit=12 means 12 pages came from disk'],
      ['A fast EXPLAIN means the plan is good, not that the query is fast. 99.2% of what the app called “database time” was not the engine.', 'EXPLAIN nhanh nghĩa là kế hoạch tốt, không nghĩa là truy vấn nhanh. 99,2% thứ app gọi là “thời gian CSDL” không phải của bộ máy CSDL.']),
    q('c3', ['20 concurrent requests. Pool 1: wait 14.065 ms, query 0.425 ms. Pool 50: wait 0.010 ms, query 6.500 ms. What happened?', '20 request đồng thời. Pool 1: chờ 14,065 ms, truy vấn 0,425 ms. Pool 50: chờ 0,010 ms, truy vấn 6,500 ms. Chuyện gì đã xảy ra?'],
      ['The queue moved from the Node pool into PostgreSQL; it did not vanish', 'The bigger pool made PostgreSQL slower because it reloaded its indexes', 'The wait disappeared, so the bigger pool is strictly better', 'Pool 50 used HTTP/2 multiplexing, which adds latency to each query'],
      ['Throughput peaked at pool 5 (1,707 req/s) and fell to 1,375 at 50: fifty sessions fight over the same CPU and buffers. The right pool size is a small multiple of the database’s cores.', 'Thông lượng đỉnh ở pool 5 (1.707 req/s) và tụt còn 1.375 ở 50: năm mươi phiên tranh cùng CPU và bộ đệm. Kích thước pool đúng là bội nhỏ của số nhân CSDL.']),
    qn('c4', ['Which actions are in the lesson’s order of “what to do” before touching JavaScript? (choose all that apply)', 'Những việc nào nằm trong thứ tự “nên làm gì” của bài, trước khi đụng tới JavaScript? (chọn mọi câu đúng)'],
      ['Reduce the number of queries (N+1: 51 → 2 queries, 6.3×)', 'Stop querying with a cache (chapter 12)', 'Move work out of the request with a queue (chapter 13)', 'Raise the pool max to 200 so no request ever waits'],
      [0, 1, 2],
      ['Then size the pool correctly — measured on both halves — and only then the JavaScript, 2.8% here.', 'Rồi định cỡ pool đúng — đo cả hai nửa — và chỉ sau đó mới tới JavaScript, ở đây 2,8%.']),
  ],
  goiY: [['Saving ≤ share of the part you speed up.', 'Phần tiết kiệm ≤ tỉ lệ của phần bạn tăng tốc.'], ['A queue does not disappear when you add servers; it moves.', 'Hàng đợi không biến mất khi thêm chỗ phục vụ; nó dời đi.']],
  loi: [['Timing only pool.query(): queueing and querying become one number that needs opposite fixes.', 'Chỉ đo pool.query(): xếp hàng và truy vấn thành một con số cần hai cách sửa ngược nhau.'], ['“Just raise max” — until “sorry, too many clients already”.', '“Cứ tăng max” — tới khi gặp “sorry, too many clients already”.']],
  tns: [tn('Amdahl’s law', 'định luật Amdahl'), tn('connection pool', 'pool kết nối'), tn('Little’s Law', 'định luật Little', 'concurrency = throughput × latency')],
  kn: ['performance', 'PostgreSQL', 'connection pool'],
});

function littlesLaw({ concurrency, throughput, latencyMs }) {
  // L = λ × W: số request đang ở trong hệ = thông lượng (req/s) × độ trễ (giây). Biết hai suy ra cái thứ ba.
  const r2 = (x) => Number(x.toFixed(2));
  if (concurrency === undefined) return { concurrency: r2(throughput * (latencyMs / 1000)), throughput, latencyMs };
  if (throughput === undefined) return { concurrency, throughput: r2(concurrency / (latencyMs / 1000)), latencyMs };
  return { concurrency, throughput, latencyMs: r2((concurrency / throughput) * 1000) };
}
const E2 = await jsBai({
  ten: 'littlesLaw({ concurrency, throughput, latencyMs }): give two, get the third', kho: 'EASY', phut: 7,
  en: '<p>Little’s Law: <b>concurrency = throughput × latency</b>. The argument has exactly two of the three fields (the missing one is <code>undefined</code>): <code>concurrency</code> (requests in the system), <code>throughput</code> (req/s), <code>latencyMs</code> (ms). Return all three, the computed one rounded to 2 decimals (<code>Number(x.toFixed(2))</code>), the given ones unchanged.</p>',
  vi: '<p>Định luật Little: <b>số đồng thời = thông lượng × độ trễ</b>. Đối số có đúng hai trong ba trường (trường thiếu là <code>undefined</code>): <code>concurrency</code> (số request trong hệ), <code>throughput</code> (req/s), <code>latencyMs</code> (ms). Trả về cả ba, trường được tính làm tròn 2 chữ số (<code>Number(x.toFixed(2))</code>), các trường cho sẵn giữ nguyên.</p>',
  goiY: [['Convert ms to seconds: latencyMs / 1000.', 'Đổi ms sang giây: latencyMs / 1000.'], ['Check which field is undefined and rearrange L = λW.', 'Xem trường nào undefined rồi biến đổi L = λW.']],
  loi: [['Forgetting the unit: req/s × ms gives a number 1,000× too big.', 'Quên đơn vị: req/s × ms cho con số lớn gấp 1.000 lần.'], ['Believing more concurrency raises throughput when the server capacity is fixed: it only raises latency.', 'Tin rằng tăng đồng thời làm tăng thông lượng khi năng lực phục vụ cố định: nó chỉ tăng độ trễ.']],
  gt: ['20 concurrent requests at 1,332 req/s spend 15.02 ms each in the system — almost exactly the 14.065 ms wait + 0.425 ms query measured with pool 1. With a fixed capacity, adding parallel requests can only add waiting.', '20 request đồng thời ở 1.332 req/s mỗi cái ở trong hệ 15,02 ms — gần đúng bằng 14,065 ms chờ + 0,425 ms truy vấn đo được với pool 1. Khi năng lực cố định, thêm request song song chỉ thêm thời gian chờ.'],
  kn: ['queueing', 'performance'],
  tns: [tn('throughput', 'thông lượng'), tn('latency', 'độ trễ'), tn('concurrency', 'số đồng thời')],
  dau: `/** Little's Law */
function littlesLaw({ concurrency, throughput, latencyMs }) {
  // Write your solution here
  if (latencyMs === undefined) latencyMs = concurrency / throughput;
  if (concurrency === undefined) concurrency = throughput * latencyMs;
  if (throughput === undefined) throughput = concurrency / latencyMs;
  return { concurrency, throughput, latencyMs };
}
`,
  giai: '// Reference solution\n' + nguon(littlesLaw),
  cases: [
    { goi: 'littlesLaw({ concurrency: 20, throughput: 1332 })', moTa: ['Pool 1, 20 connections', 'Pool 1, 20 kết nối'] },
    { goi: 'littlesLaw({ throughput: 1764, latencyMs: 10 })', moTa: ['1,764 req/s at 10 ms', '1.764 req/s ở 10 ms'] },
    { goi: 'littlesLaw({ concurrency: 50, latencyMs: 30 })', an: true },
    { goi: 'littlesLaw({ concurrency: 20, throughput: 1375 })', an: true },
  ],
});

const CHO = ['your pool queue (Node)', 'round trip and protocol', 'PostgreSQL’s queue', 'the actual work'];
const E3 = cs({
  ten: 'Where does the time sit? Four places, four different fixes', kho: 'MEDIUM', phut: 8, loai: 'table',
  en: 'For each observation, pick where most of the time sits (lesson 16.2, “four places”).',
  vi: 'Với mỗi quan sát, chọn nơi phần lớn thời gian nằm (bài 16.2, “bốn chỗ”).',
  bang: [bang1('b1', ['Diagnose from the numbers', 'Chẩn đoán từ con số'], [{ ma: 'x', ten: 'Observation' }, { ma: 'w', ten: 'Time sits in', luaChon: CHO }], [
    { o: { x: 'pool max 2, 30 concurrent requests; pool.connect() takes 11 ms, client.query() 0.4 ms' }, a: { w: 'your pool queue (Node)' } },
    { o: { x: 'pool.waitingCount stays at 0 while client.query() rises from 0.4 to 6.5 ms as the pool grows to 50' }, a: { w: 'PostgreSQL’s queue' } },
    { o: { x: 'EXPLAIN ANALYZE: Seq Scan on notes, actual time 55.177 ms; with an index 0.084 ms' }, a: { w: 'the actual work' } },
    { o: { x: 'Same query, waiting 0.01 ms, EXPLAIN 0.039 ms, but the app measures 4.3 ms fetching 100 rows of ~400-byte bodies over a VM boundary' }, a: { w: 'round trip and protocol' } },
    { o: { x: 'pool.waitingCount climbs steadily during the traffic spike' }, a: { w: 'your pool queue (Node)' } },
  ], ['Wait rising ⇒ the queue is in your process: raise the pool a little or send fewer queries. Wait flat while query time rises ⇒ the database is the limit: stop raising the pool, reduce or cache queries. A slow EXPLAIN is the only case where the engine’s work itself is the problem (an index, chapter 7). Bytes across a VM hop are the protocol’s cost — left(body,100) gave +26.7% there.', 'Thời gian chờ tăng ⇒ hàng đợi nằm trong tiến trình của bạn: tăng pool một chút hoặc gửi ít truy vấn hơn. Chờ đứng yên mà thời gian truy vấn tăng ⇒ CSDL là giới hạn: thôi tăng pool, giảm hoặc cache truy vấn. EXPLAIN chậm là trường hợp duy nhất công việc của bộ máy CSDL là vấn đề (một index, chương 7). Byte qua ranh giới máy ảo là giá của giao thức — left(body,100) cho +26,7% ở đó.'])],
  goiY: [['pool.connect() measures the wait; client.query() measures everything after you hold a connection.', 'pool.connect() đo thời gian chờ; client.query() đo mọi thứ sau khi đã giữ kết nối.'], ['EXPLAIN only sees the engine’s work.', 'EXPLAIN chỉ thấy công việc của bộ máy CSDL.']],
  loi: [['Raising the pool when wait is already ~0.', 'Tăng pool khi thời gian chờ đã ~0.'], ['Calling a 0.04 ms EXPLAIN “a fast query”.', 'Gọi một EXPLAIN 0,04 ms là “truy vấn nhanh”.']],
  tns: [tn('waitingCount', 'waitingCount', 'requests waiting for a pool connection')],
  kn: ['PostgreSQL', 'diagnosis'],
});

function requestShares(samples, rps) {
  // Mỗi mẫu là 4 lần đọc đồng hồ: t0 → (db) → t1 → (js) → t2 → (ser) → t3.
  const n = samples.length;
  const avg = (f) => samples.reduce((s, x) => s + f(x), 0) / n;
  const db = avg((x) => x.t1 - x.t0);
  const js = avg((x) => x.t2 - x.t1);
  const ser = avg((x) => x.t3 - x.t2);
  const total = db + js + ser;
  const r3 = (v) => Number(v.toFixed(3));
  const pct = (v) => Number(((100 * v) / total).toFixed(1));
  return {
    dbMs: r3(db), jsMs: r3(js), serMs: r3(ser), totalMs: r3(total),
    dbPct: pct(db), codePct: pct(js + ser),
    ceilingRps: Math.round((rps * total) / db),      // nếu JS + JSON tốn 0 ms — trần của mọi phép tối ưu mã
  };
}
const SAMP = [{ t0: 0, t1: 4.6, t2: 4.602, t3: 4.73 }, { t0: 10, t1: 14.65, t2: 14.652, t3: 14.784 }, { t0: 20, t1: 24.598, t2: 24.6, t3: 24.733 }];
const E4 = await jsBai({
  ten: 'requestShares(samples, rps): time the parts, then compute the ceiling', kho: 'MEDIUM', phut: 12,
  en: '<p>Four reads of <code>process.hrtime.bigint()</code> split a request: <code>t0</code> before the query, <code>t1</code> after it, <code>t2</code> after the JS transform, <code>t3</code> after <code>JSON.stringify</code> (here already converted to ms). Write <code>requestShares(samples, rps)</code> returning <code>{ dbMs, jsMs, serMs, totalMs, dbPct, codePct, ceilingRps }</code>: the averages of <code>t1−t0</code>, <code>t2−t1</code>, <code>t3−t2</code> and their sum (3 decimals); <code>dbPct</code> and <code>codePct</code> (= js + ser) as a share of the total (1 decimal); and <code>ceilingRps</code> = the throughput if js + ser cost 0 ms: <code>rps × total / db</code>, rounded to an integer.</p>',
  vi: '<p>Bốn lần đọc <code>process.hrtime.bigint()</code> chia một request: <code>t0</code> trước truy vấn, <code>t1</code> sau nó, <code>t2</code> sau phép biến đổi JS, <code>t3</code> sau <code>JSON.stringify</code> (ở đây đã đổi sang ms). Viết <code>requestShares(samples, rps)</code> trả về <code>{ dbMs, jsMs, serMs, totalMs, dbPct, codePct, ceilingRps }</code>: trung bình của <code>t1−t0</code>, <code>t2−t1</code>, <code>t3−t2</code> và tổng của chúng (3 chữ số); <code>dbPct</code> và <code>codePct</code> (= js + ser) theo tỉ lệ trên tổng (1 chữ số); và <code>ceilingRps</code> = thông lượng nếu js + ser tốn 0 ms: <code>rps × total / db</code>, làm tròn thành số nguyên.</p>',
  goiY: [['Average each difference over all samples first, then derive the shares from the averages.', 'Lấy trung bình từng hiệu trên mọi mẫu trước, rồi suy ra tỉ lệ từ các trung bình.'], ['If the code part becomes free, each request takes db ms instead of total ms, so throughput scales by total / db.', 'Nếu phần mã thành miễn phí, mỗi request mất db ms thay vì total ms, nên thông lượng nhân với total / db.']],
  loi: [['Optimising the 0.002 ms transform because it is the code you can see.', 'Tối ưu phép biến đổi 0,002 ms vì đó là mã bạn nhìn thấy.'], ['Rounding before computing the shares: small parts then turn into 0%.', 'Làm tròn trước khi tính tỉ lệ: các phần nhỏ khi đó thành 0%.']],
  gt: ['The ceiling is the number that ends most tuning discussions: if all your JavaScript were free, 1,764 req/s would become about 1,814. The 97% sits behind one line, pool.query, so that is where the next measurement goes.', 'Trần là con số kết thúc phần lớn các cuộc tranh luận tối ưu: nếu toàn bộ JavaScript miễn phí, 1.764 req/s chỉ thành khoảng 1.814. 97% nằm sau một dòng, pool.query, nên phép đo tiếp theo phải đặt ở đó.'],
  kn: ['performance', 'Amdahl'],
  tns: [tn('hrtime', 'hrtime', 'monotonic high-resolution clock'), tn('ceiling', 'trần', 'the best possible gain of an optimisation')],
  dau: `/** split request time and compute the code-tuning ceiling */
function requestShares(samples, rps) {
  // Write your solution here
  const s = samples[0];
  const db = s.t1 - s.t0, js = s.t2 - s.t1, ser = s.t3 - s.t2, total = db + js + ser;
  return { dbMs: db, jsMs: js, serMs: ser, totalMs: total, dbPct: 100 * db / total, codePct: 100 * (js + ser) / total, ceilingRps: rps * 2 };
}
`,
  giai: '// Reference solution\n' + nguon(requestShares),
  cases: [
    { goi: goi('requestShares', SAMP, 1764), moTa: ['Three requests of the 16.2 route', 'Ba request của route 16.2'] },
    { goi: goi('requestShares', [{ t0: 0, t1: 1, t2: 6, t3: 10 }], 500), moTa: ['A route where code dominates', 'Một route mà mã chiếm phần lớn'] },
    { goi: goi('requestShares', [{ t0: 0, t1: 9, t2: 9.05, t3: 9.2 }, { t0: 0, t1: 9, t2: 9.05, t3: 9.2 }], 1000), an: true },
    { goi: goi('requestShares', [{ t0: 5, t1: 9.291, t2: 9.293, t3: 9.424 }, { t0: 0, t1: 4.291, t2: 4.293, t3: 4.424 }], 1914), an: true },
  ],
});

async function queryTimed(pool, sql, params, now) {
  const t0 = now();
  const client = await pool.connect();            // CHỜ một kết nối rảnh — hàng đợi của chính tiến trình bạn
  const t1 = now();
  try {
    const r = await client.query(sql, params);     // LÀM: khứ hồi + giao thức + hàng đợi Postgres + công việc thật
    const t2 = now();
    return { rows: r.rows, waitMs: t1 - t0, queryMs: t2 - t1 };
  } finally {
    client.release();                              // luôn trả kết nối — kể cả khi truy vấn ném lỗi
  }
}
const POOL = (plan) => `const clock = { t: 0 }; let released = 0; const plan = ${JSON.stringify(plan)};
  const pool = { connect: async () => { clock.t += plan.wait; return { query: async (sql, params) => { clock.t += plan.query; if (plan.fail) throw new Error('relation "notes" does not exist'); return { rows: [{ id: params[0] }] }; }, release: () => { released++; } }; } };
  const now = () => clock.t;`;
const E5 = await jsBai({
  ten: 'queryTimed(pool, sql, params, now): time the wait and the work separately — and always release', kho: 'HARD', phut: 15,
  en: '<p><code>pool.query()</code> does two things: wait for a free connection, then run the query. Split them. Write <code>async queryTimed(pool, sql, params, now)</code>: read <code>now()</code>, <code>await pool.connect()</code>, read <code>now()</code> again, run <code>await client.query(sql, params)</code>, read <code>now()</code> a third time, and return <code>{ rows, waitMs, queryMs }</code>. Call <code>client.release()</code> exactly once in every case, including when the query throws (the error must still reach the caller).</p>',
  vi: '<p><code>pool.query()</code> làm hai việc: chờ một kết nối rảnh, rồi chạy truy vấn. Hãy tách chúng. Viết <code>async queryTimed(pool, sql, params, now)</code>: đọc <code>now()</code>, <code>await pool.connect()</code>, đọc <code>now()</code> lần nữa, chạy <code>await client.query(sql, params)</code>, đọc <code>now()</code> lần thứ ba, và trả về <code>{ rows, waitMs, queryMs }</code>. Gọi <code>client.release()</code> đúng một lần trong mọi trường hợp, kể cả khi truy vấn ném lỗi (lỗi vẫn phải tới được bên gọi).</p>',
  yc: [['Use try / finally for release().', 'Dùng try / finally cho release().'], ['Do not swallow the query error.', 'Không nuốt lỗi truy vấn.']],
  goiY: [['Three timestamps: before connect, after connect, after query.', 'Ba mốc thời gian: trước connect, sau connect, sau query.'], ['Put the query inside try { … } and client.release() inside finally { … }; return from inside try.', 'Đặt truy vấn trong try { … } và client.release() trong finally { … }; return ngay trong try.']],
  loi: [['Forgetting release() on the error path: after max errors the pool is empty and every request waits forever.', 'Quên release() ở nhánh lỗi: sau max lần lỗi, pool cạn và mọi request chờ mãi mãi.'], ['Catching the error and returning rows: [] — the caller now believes the table is empty.', 'Bắt lỗi rồi trả rows: [] — bên gọi tưởng bảng rỗng.']],
  gt: ['Two numbers, two opposite fixes: a large waitMs means the queue is in your process (pool too small, or too many queries); a small wait with a rising queryMs means the database is the limit. Export pool.waitingCount as a gauge read at scrape time (15.4) to watch the first one in production.', 'Hai con số, hai cách sửa ngược nhau: waitMs lớn nghĩa là hàng đợi nằm trong tiến trình của bạn (pool quá nhỏ, hoặc quá nhiều truy vấn); chờ nhỏ mà queryMs tăng nghĩa là CSDL là giới hạn. Xuất pool.waitingCount thành gauge đọc lúc scrape (15.4) để theo dõi cái đầu trong production.'],
  kn: ['connection pool', 'async/await', 'try/finally'],
  tns: [tn('release', 'trả kết nối'), tn('pool exhaustion', 'cạn pool')],
  dau: `/** split pool wait from query work */
async function queryTimed(pool, sql, params, now) {
  // Write your solution here
  const t0 = now();
  const client = await pool.connect();
  const r = await client.query(sql, params);
  client.release();
  return { rows: r.rows, waitMs: 0, queryMs: now() - t0 };
}
`,
  giai: '// Reference solution\n' + nguon(queryTimed),
  cases: [
    { chuanBi: POOL({ wait: 14.065, query: 0.425 }), goi: 'await (async () => { const r = await queryTimed(pool, "SELECT * FROM notes WHERE id = $1", [7], now); return { ...r, waitMs: Number(r.waitMs.toFixed(3)), queryMs: Number(r.queryMs.toFixed(3)), released }; })()', moTa: ['Pool 1: the wait is the time', 'Pool 1: thời gian chờ chính là thời gian'] },
    { chuanBi: POOL({ wait: 0.01, query: 6.5 }), goi: 'await (async () => { const r = await queryTimed(pool, "SELECT 1", [1], now); return [Number(r.waitMs.toFixed(3)), Number(r.queryMs.toFixed(3)), released]; })()', moTa: ['Pool 50: the queue moved into PostgreSQL', 'Pool 50: hàng đợi dời vào PostgreSQL'] },
    { chuanBi: POOL({ wait: 1, query: 2, fail: true }), goi: 'await (async () => { let msg = ""; try { await queryTimed(pool, "SELECT * FROM notes", [1], now); } catch (e) { msg = e.message; } return { msg, released }; })()', an: true },
    { chuanBi: POOL({ wait: 3, query: 4 }), goi: 'await (async () => { for (let i = 0; i < 3; i++) await queryTimed(pool, "SELECT 1", [i], now); return { released, t: clock.t }; })()', an: true },
  ],
});

export default modul('nodejs-16-2-nut-that-that-su', '16.2 Where the time really goes: the database and the pool', [E1, E2, E3, E4, E5]);
