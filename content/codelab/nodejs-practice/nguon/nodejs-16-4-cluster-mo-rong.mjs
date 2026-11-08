/** Node.js 16.4 — Cluster: 3,4× cho việc CPU, 1,06× cho việc I/O, đỉnh rồi tụt, thứ hỏng khi fork (cache, rate limit, cron), khoá Redis. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'What cluster really multiplies', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 16.4: /cpu vs /io with 1–10 workers on a busy 10-core machine.',
  vi: 'Câu hỏi về bài 16.4: /cpu và /io với 1–10 worker trên máy 10 nhân đang bận.',
  cau: [
    q('c1', ['/io awaits 30 ms. With 1 worker 1,450 req/s, with 10 workers 1,547 req/s. Why almost no gain?', '/io chờ 30 ms. 1 worker 1.450 req/s, 10 worker 1.547 req/s. Vì sao gần như không lợi gì?'],
      ['One event loop already overlaps thousands of waits; ten loops wait no faster', 'Round-robin sent every request to the first worker, so nine were idle', 'The workers share one V8 heap, so they block each other on garbage collection', 'autocannon cannot open more than 1,500 connections per second'],
      ['10 workers, 10 distinct pids over 40 sample requests: distribution was correct. Waiting was never the thin part (chapter 2).', '10 worker, 10 pid khác nhau trên 40 request mẫu: phân phối đúng. Chờ đợi chưa bao giờ là chỗ hẹp (chương 2).']),
    q('c2', ['/cpu: 8 workers 40,278 req/s, 10 workers 36,299 req/s on a 10-core machine. What is the practical rule?', '/cpu: 8 worker 40.278 req/s, 10 worker 36.299 req/s trên máy 10 nhân. Luật thực tế là gì?'],
      ['Start at cores − 1, then measure down as well as up and pick the real peak', 'Always use os.cpus().length workers, the drop is measurement noise', 'Use twice the core count so that one worker can wait while another computes', 'Use exactly 4 workers, the peak the web lesson measured on its machine'],
      ['The client, nginx, log collectors and context switching compete for the same cores, and every worker is its own V8 with its own heap, JIT and GC.', 'Client, nginx, bộ thu log và việc chuyển ngữ cảnh tranh cùng các nhân, và mỗi worker là một V8 riêng với heap, JIT và GC riêng.']),
    q('c3', ['A nightly invoice job is guarded by let _started = false. Someone sets WORKERS=4. What happens?', 'Việc gửi hoá đơn hằng đêm được chặn bằng let _started = false. Ai đó đặt WORKERS=4. Chuyện gì xảy ra?'],
      ['Each customer gets 4 invoices, with no error and no log', 'Only the first worker runs it, because the flag is shared by cluster', 'The job throws “already started” in three workers and logs an error', 'cluster merges the four schedules into one, so nothing changes'],
      ['The flag stops a second start inside ONE process and does nothing across four. Use a Redis lock (chapter 12) or run jobs in their own process.', 'Cờ chỉ chặn lần khởi động thứ hai trong MỘT tiến trình và vô tác dụng giữa bốn tiến trình. Dùng khoá Redis (chương 12) hoặc chạy job trong tiến trình riêng.']),
    qn('c4', ['Which statements about the website match the lesson? (choose all that apply)', 'Những câu nào về website khớp với bài? (chọn mọi câu đúng)'],
      ['It runs one process: CMD ["node", "dist/index.js"], no cluster in src', 'cron.service.ts has 40 cron.schedule calls behind a per-process flag', 'One process per container is right, because the app is I/O-bound', 'It uses PM2 inside Docker to get zero-downtime reloads'],
      [0, 1, 2],
      ['For containers, N containers (one process each) is almost always right; PM2 duplicates what Docker already does. Before a second process appears, move the cron lock and the job queue into Redis.', 'Với container, N container (mỗi cái một tiến trình) gần như luôn đúng; PM2 làm trùng việc Docker đã làm. Trước khi có tiến trình thứ hai, hãy chuyển khoá cron và hàng đợi job vào Redis.']),
  ],
  goiY: [['Ask whether the route computes or waits.', 'Hỏi route đang tính toán hay đang chờ.'], ['Every worker is a separate process: nothing in memory is shared.', 'Mỗi worker là một tiến trình riêng: không gì trong bộ nhớ được chia sẻ.']],
  loi: [['Clustering an I/O-bound app and reporting “no change”.', 'Cluster một app bị giới hạn bởi I/O rồi báo “không đổi gì”.'], ['Copying os.cpus().length from a tutorial.', 'Chép os.cpus().length từ một hướng dẫn.']],
  tns: [tn('worker', 'worker', 'a forked process running the same app'), tn('round-robin', 'xoay vòng'), tn('context switch', 'chuyển ngữ cảnh')],
  kn: ['cluster', 'scaling'],
});

const E2 = cs({
  ten: 'It worked in one process: what breaks in two, and the fix', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Each item is correct with one process and wrong with N. Pick the fix the lesson names.',
  vi: 'Mỗi mục đúng khi có một tiến trình và sai khi có N. Chọn cách sửa bài học nêu.',
  bang: [bang1('b1', ['Shared state after cluster.fork()', 'Trạng thái chung sau cluster.fork()'], [{ ma: 'x', ten: 'In-process thing' }, { ma: 'f', ten: 'Fix', luaChon: ['Redis cache', 'count in Redis', 'Socket.IO Redis adapter', 'Redis lock or a separate process', 'aggregate per worker'] }], [
    { o: { x: 'An in-memory Map cache of notes (users see stale data depending on the worker)' }, a: { f: 'Redis cache' } },
    { o: { x: 'A rate limit of 100/min counted in RAM (becomes 100 × N)' }, a: { f: 'count in Redis' } },
    { o: { x: 'io.to(room).emit(…) never reaches a client connected to another worker' }, a: { f: 'Socket.IO Redis adapter' } },
    { o: { x: 'cron.schedule("0 2 * * *", sendInvoices) runs N times a night' }, a: { f: 'Redis lock or a separate process' } },
    { o: { x: 'http_requests_total on /metrics gives one value per worker' }, a: { f: 'aggregate per worker' } },
  ], ['Nothing in the code changed; the number of copies did. Shared state must leave the process before a second one appears — then scaling out is a configuration change, not an incident.', 'Mã không đổi gì; số bản sao mới đổi. Trạng thái chung phải ra khỏi tiến trình trước khi có tiến trình thứ hai — khi đó mở rộng chỉ là đổi cấu hình, không phải sự cố.'])],
  goiY: [['Each worker has its own heap.', 'Mỗi worker có heap riêng.'], ['Where can N processes see the same value?', 'Ở đâu N tiến trình thấy cùng một giá trị?']],
  loi: [['Assuming cluster shares module-level variables.', 'Tưởng cluster chia sẻ biến cấp module.'], ['Forgetting cron: it fails silently.', 'Quên cron: nó hỏng âm thầm.']],
  tns: [tn('shared state', 'trạng thái chung')],
  kn: ['cluster', 'Redis'],
});

function memoryRateLimit(n, workers, limit) {
  // n request của MỘT người dùng trong một phút, chia xoay vòng cho các worker; mỗi worker đếm trong RAM của nó.
  const per = Array.from({ length: workers }, (_, i) => Math.floor(n / workers) + (i < n % workers ? 1 : 0));
  const inMemory = per.reduce((s, c) => s + Math.min(c, limit), 0);
  const shared = Math.min(n, limit);                      // đếm ở Redis: một bộ đếm cho cả cụm
  return { perWorker: per, inMemory, shared, factor: Number((inMemory / shared).toFixed(2)) };
}
const E3 = await jsBai({
  ten: 'memoryRateLimit(n, workers, limit): how a RAM rate limit becomes limit × N', kho: 'MEDIUM', phut: 10,
  en: '<p>One user sends <code>n</code> requests in one minute. The primary hands them out <b>round-robin</b>: request 1 to worker 0, request 2 to worker 1, … Each worker counts in its own memory and lets through at most <code>limit</code>. Write <code>memoryRateLimit(n, workers, limit)</code> returning <code>{ perWorker, inMemory, shared, factor }</code>: how many requests each worker received, how many get through with in-memory counting, how many would get through with one shared counter (Redis), and <code>factor = inMemory / shared</code> rounded to 2 decimals.</p>',
  vi: '<p>Một người dùng gửi <code>n</code> request trong một phút. Tiến trình chính chia <b>xoay vòng</b>: request 1 cho worker 0, request 2 cho worker 1, … Mỗi worker đếm trong bộ nhớ riêng và cho qua tối đa <code>limit</code>. Viết <code>memoryRateLimit(n, workers, limit)</code> trả về <code>{ perWorker, inMemory, shared, factor }</code>: mỗi worker nhận bao nhiêu request, bao nhiêu lọt qua khi đếm trong bộ nhớ, bao nhiêu lọt qua với một bộ đếm chung (Redis), và <code>factor = inMemory / shared</code> làm tròn 2 chữ số.</p>',
  goiY: [['Round-robin gives floor(n / workers) to everyone and one extra to the first n % workers workers.', 'Xoay vòng chia floor(n / workers) cho mọi worker và thêm một cho n % workers worker đầu.'], ['inMemory = Σ min(count_i, limit); shared = min(n, limit).', 'inMemory = Σ min(count_i, limit); shared = min(n, limit).']],
  loi: [['Assuming the limit still holds because “the code did not change”.', 'Tưởng giới hạn vẫn giữ vì “mã không đổi”.'], ['Giving the remainder to the last workers instead of the first ones.', 'Chia phần dư cho các worker cuối thay vì các worker đầu.']],
  gt: ['With 4 workers and a limit of 100, an attacker gets 400 attempts a minute instead of 100 — a login brute-force protection silently weakened 4×. A shared counter in Redis (INCR + EXPIRE, chapter 9/12) is correct with 1 process or 100.', 'Với 4 worker và giới hạn 100, kẻ tấn công có 400 lần thử mỗi phút thay vì 100 — lớp chống dò mật khẩu yếu đi 4 lần mà không ai biết. Bộ đếm chung trong Redis (INCR + EXPIRE, chương 9/12) đúng với 1 tiến trình hay 100.'],
  kn: ['cluster', 'rate limiting'],
  tns: [tn('rate limit', 'giới hạn tốc độ'), tn('shared counter', 'bộ đếm chung')],
  dau: `/** in-memory rate limit across N workers */
function memoryRateLimit(n, workers, limit) {
  // Write your solution here
  const per = Array.from({ length: workers }, () => n / workers);
  return { perWorker: per, inMemory: Math.min(n, limit), shared: Math.min(n, limit), factor: 1 };
}
`,
  giai: '// Reference solution\n' + nguon(memoryRateLimit),
  cases: [
    { goi: goi('memoryRateLimit', 1000, 4, 100), moTa: ['4 workers, limit 100/min, 1,000 attempts', '4 worker, giới hạn 100/phút, 1.000 lần thử'] },
    { goi: goi('memoryRateLimit', 50, 4, 100), moTa: ['Under the limit: nothing changes', 'Dưới giới hạn: không đổi gì'] },
    { goi: goi('memoryRateLimit', 250, 8, 20), an: true },
    { goi: goi('memoryRateLimit', 7, 3, 2), an: true },
  ],
});

function createLockStore(now) {
  // Redis giả cho đúng hai lệnh khoá: SET key value NX PX ttl, và "xoá nếu đúng chủ" (script Lua kinh điển).
  const data = new Map();                                  // key → { value, expiresAt }
  const alive = (k) => { const e = data.get(k); if (e && e.expiresAt <= now()) data.delete(k); return data.get(k); };
  return {
    setNX(key, value, ttlMs) {
      if (alive(key)) return null;                          // đã có người giữ ⇒ không ghi đè
      data.set(key, { value, expiresAt: now() + ttlMs });
      return 'OK';
    },
    get: (key) => (alive(key) ? alive(key).value : null),
    release(key, value) {
      const e = alive(key);
      if (!e || e.value !== value) return 0;                 // chỉ chủ mới được thả — không xoá khoá của người khác
      data.delete(key);
      return 1;
    },
  };
}
async function runNightly(workerIds, store, day, sendInvoices) {
  const sent = [];
  // mỗi worker chạy cùng một lịch cron; chỉ worker giành được khoá của NGÀY đó mới gửi
  await Promise.all(workerIds.map(async (w) => {
    if (store.setNX(`invoices:${day}`, w, 6 * 3600 * 1000) !== 'OK') return;
    await sendInvoices(w);
    sent.push(w);
  }));
  return sent;
}
const E4 = await jsBai({
  ten: 'createLockStore(now) + runNightly(): one invoice run per night, however many workers', kho: 'HARD', phut: 22,
  en: '<p>Replace the per-process flag with a lock that all processes see. First build a tiny fake Redis for locks, <code>createLockStore(now)</code> (<code>now</code> = injected clock in ms), with:</p><ul><li><code>setNX(key, value, ttlMs)</code> — like <code>SET key value NX PX ttlMs</code>: if the key is free (absent or expired) store it until <code>now() + ttlMs</code> and return <code>"OK"</code>; otherwise return <code>null</code> and change nothing;</li><li><code>get(key)</code> — the value, or <code>null</code> if absent/expired;</li><li><code>release(key, value)</code> — delete the key only if it is held with exactly this <code>value</code>; return 1 if deleted, else 0.</li></ul><p>Then <code>async runNightly(workerIds, store, day, sendInvoices)</code>: every worker tries <code>setNX("invoices:" + day, workerId, 6 h)</code>; only a worker that got <code>"OK"</code> awaits <code>sendInvoices(workerId)</code>. Return the ids of the workers that sent.</p>',
  vi: '<p>Thay cờ theo tiến trình bằng một khoá mà mọi tiến trình đều thấy. Trước hết dựng một Redis giả nhỏ cho khoá, <code>createLockStore(now)</code> (<code>now</code> = đồng hồ tiêm vào, ms), có:</p><ul><li><code>setNX(key, value, ttlMs)</code> — như <code>SET key value NX PX ttlMs</code>: nếu khoá trống (không có hoặc đã hết hạn) thì lưu tới <code>now() + ttlMs</code> và trả <code>"OK"</code>; không thì trả <code>null</code> và không đổi gì;</li><li><code>get(key)</code> — giá trị, hoặc <code>null</code> nếu không có/hết hạn;</li><li><code>release(key, value)</code> — chỉ xoá khoá nếu nó đang được giữ với đúng <code>value</code> này; trả 1 nếu đã xoá, không thì 0.</li></ul><p>Rồi <code>async runNightly(workerIds, store, day, sendInvoices)</code>: mọi worker thử <code>setNX("invoices:" + day, workerId, 6 giờ)</code>; chỉ worker nhận <code>"OK"</code> mới await <code>sendInvoices(workerId)</code>. Trả về id các worker đã gửi.</p>',
  yc: [['An expired key counts as free.', 'Khoá đã hết hạn được coi là trống.'], ['release by a non-owner must not delete the lock.', 'release bởi người không phải chủ không được xoá khoá.']],
  goiY: [['Store { value, expiresAt } per key; treat expiresAt <= now() as absent.', 'Lưu { value, expiresAt } cho mỗi khoá; coi expiresAt <= now() là không có.'], ['The lock key must contain the day, so tomorrow’s run gets a fresh lock even if today’s is still held.', 'Tên khoá phải chứa ngày, để lượt chạy ngày mai có khoá mới kể cả khi khoá hôm nay vẫn đang giữ.']],
  loi: [['A lock with no TTL: the worker that took it crashes, and no invoice is ever sent again.', 'Khoá không có TTL: worker giữ khoá bị sập, và không bao giờ có hoá đơn nào được gửi nữa.'], ['release() that deletes any value: a slow worker whose lock expired deletes the lock of the worker that took over.', 'release() xoá bất kể giá trị: một worker chậm có khoá đã hết hạn xoá mất khoá của worker vừa thay nó.']],
  gt: ['SET NX PX is atomic in Redis, so exactly one of N processes wins, whatever the timing; the TTL bounds the damage of a crash; checking the owner on release prevents deleting someone else’s lock. With this, WORKERS=4 sends one invoice per customer — the same as WORKERS=1.', 'SET NX PX là nguyên tử trong Redis nên đúng một trong N tiến trình thắng, dù thời điểm thế nào; TTL giới hạn thiệt hại khi sập; kiểm chủ khi thả tránh xoá khoá của người khác. Có cái này, WORKERS=4 gửi một hoá đơn mỗi khách — y như WORKERS=1.'],
  kn: ['distributed lock', 'Redis', 'cron'],
  tns: [tn('SET NX PX', 'SET NX PX', 'set if not exists, with a TTL in ms'), tn('lock owner', 'chủ khoá')],
  dau: `/** a lock store + the nightly job */
function createLockStore(now) {
  // Write your solution here
  const data = new Map();
  return {
    setNX(key, value, ttlMs) { data.set(key, value); return 'OK'; },
    get: (key) => data.get(key) ?? null,
    release(key, value) { return data.delete(key) ? 1 : 0; },
  };
}
async function runNightly(workerIds, store, day, sendInvoices) {
  const sent = [];
  for (const w of workerIds) {
    let _started = false;   // the per-process flag of cron.service.ts
    if (_started) continue;
    _started = true;
    await sendInvoices(w);
    sent.push(w);
  }
  return sent;
}
`,
  giai: '// Reference solution\n' + nguon(createLockStore, runNightly),
  cases: [
    { chuanBi: 'let t = 0; const store = createLockStore(() => t); let invoices = 0; const send = async () => { invoices += 120; };', goi: 'await (async () => { const sent = await runNightly(["w0", "w1", "w2", "w3"], store, "2026-11-08", send); return { workers: sent.length, invoices }; })()', moTa: ['WORKERS=4, one night', 'WORKERS=4, một đêm'] },
    { chuanBi: 'let t = 0; const s = createLockStore(() => t);', goi: '[s.setNX("k", "a", 1000), s.setNX("k", "b", 1000), s.get("k"), (t = 1000, s.setNX("k", "b", 1000)), s.get("k")]', moTa: ['setNX, then expiry', 'setNX, rồi hết hạn'] },
    { chuanBi: 'let t = 0; const s = createLockStore(() => t); s.setNX("job", "w1", 5000);', goi: '[s.release("job", "w2"), s.get("job"), s.release("job", "w1"), s.get("job"), s.release("job", "w1")]', an: true },
    { chuanBi: 'let t = 0; const store = createLockStore(() => t); const runs = [];', goi: 'await (async () => { const a = await runNightly(["w0", "w1"], store, "2026-11-08", async (w) => runs.push(w)); t += 3600 * 1000; const b = await runNightly(["w0", "w1"], store, "2026-11-08", async (w) => runs.push(w)); const c = await runNightly(["w0", "w1"], store, "2026-11-09", async (w) => runs.push(w)); return [a.length, b.length, c.length, runs.length]; })()', an: true },
  ],
});

function clusterAdvice(idlePct, runs) {
  // Bước 1–3: đọc dòng (idle) của profile dưới tải.
  if (idlePct > 60) return { verdict: 'io-bound', workers: 1, advice: 'fix what it waits on: queries, pool, cache, queue' };
  if (idlePct >= 30) return { verdict: 'mixed', workers: 1, advice: 'move the hot function to worker_threads' };
  // CPU-bound: chọn ĐỈNH đo được (trung vị nhiều lượt), không phải số nhân.
  const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const rows = Object.entries(runs).map(([w, xs]) => [Number(w), median(xs)]).sort((a, b) => a[0] - b[0]);
  let best = rows[0];
  for (const r of rows) if (r[1] > best[1]) best = r;
  const one = rows.find((r) => r[0] === 1);
  return { verdict: 'cpu-bound', workers: best[0], advice: `peak at ${best[0]} workers`, gain: one ? Number((best[1] / one[1]).toFixed(2)) : null };
}
const E5 = await jsBai({
  ten: 'clusterAdvice(idlePct, runs): the five-step test for “is cluster my answer?”', kho: 'MEDIUM', phut: 14,
  en: '<p>Encode the decision of the lesson. <code>idlePct</code> is the (idle) share of a CPU profile under load; <code>runs</code> maps a worker count to the req/s of several runs, e.g. <code>{ 1: [11812, …], 2: […] }</code>. Return:</p><ul><li>idle &gt; 60 → <code>{ verdict: "io-bound", workers: 1, advice: "fix what it waits on: queries, pool, cache, queue" }</code>;</li><li>30 ≤ idle ≤ 60 → <code>{ verdict: "mixed", workers: 1, advice: "move the hot function to worker_threads" }</code>;</li><li>idle &lt; 30 → <code>{ verdict: "cpu-bound", workers, advice: "peak at &lt;workers&gt; workers", gain }</code> where <code>workers</code> has the highest <b>median</b> req/s (ties: fewer workers) and <code>gain</code> = that median ÷ the median for 1 worker, rounded to 2 decimals (<code>null</code> if 1 was not measured).</li></ul>',
  vi: '<p>Mã hoá quyết định của bài. <code>idlePct</code> là tỉ lệ (idle) của CPU profile dưới tải; <code>runs</code> ánh xạ số worker tới req/s của nhiều lượt chạy, vd <code>{ 1: [11812, …], 2: […] }</code>. Trả về:</p><ul><li>idle &gt; 60 → <code>{ verdict: "io-bound", workers: 1, advice: "fix what it waits on: queries, pool, cache, queue" }</code>;</li><li>30 ≤ idle ≤ 60 → <code>{ verdict: "mixed", workers: 1, advice: "move the hot function to worker_threads" }</code>;</li><li>idle &lt; 30 → <code>{ verdict: "cpu-bound", workers, advice: "peak at &lt;workers&gt; workers", gain }</code> với <code>workers</code> có req/s <b>trung vị</b> cao nhất (hoà: ít worker hơn) và <code>gain</code> = trung vị đó ÷ trung vị của 1 worker, làm tròn 2 chữ số (<code>null</code> nếu chưa đo 1 worker).</li></ul>',
  goiY: [['Object keys are strings: convert with Number(w) and sort ascending, so ties keep the smaller count.', 'Khoá của object là chuỗi: đổi bằng Number(w) và sắp tăng dần, để khi hoà giữ số nhỏ hơn.'], ['Only replace the best row on a strictly greater median.', 'Chỉ thay dòng tốt nhất khi trung vị lớn hơn hẳn.']],
  loi: [['Picking the largest worker count measured: on this machine 10 workers were 9.9% below the peak at 8.', 'Chọn số worker lớn nhất đã đo: trên máy này 10 worker thấp hơn đỉnh ở 8 tới 9,9%.'], ['Clustering a 72%-idle app and calling the +6.7% a win while cron now runs N times.', 'Cluster một app rảnh 72% rồi gọi +6,7% là thắng trong khi cron giờ chạy N lần.']],
  gt: ['16.1’s route was 0.9% idle: a cluster candidate. 16.2’s route spent 97% in the database: not one. The (idle) line of one profile answers the question before you fork anything, and the real peak — not os.cpus().length — answers how many.', 'Route của 16.1 rảnh 0,9%: ứng viên cho cluster. Route của 16.2 dành 97% ở CSDL: không phải. Dòng (idle) của một profile trả lời câu hỏi trước khi bạn fork bất cứ thứ gì, và đỉnh thật — không phải os.cpus().length — trả lời bao nhiêu worker.'],
  kn: ['cluster', 'profiling', 'decision'],
  tns: [tn('I/O-bound', 'bị giới hạn bởi I/O'), tn('worker_threads', 'worker_threads', 'threads for one CPU-heavy function')],
  dau: `/** should we cluster, and with how many workers? */
function clusterAdvice(idlePct, runs) {
  // Write your solution here
  const max = Math.max(...Object.keys(runs).map(Number));
  return { verdict: 'cpu-bound', workers: max, advice: 'peak at ' + max + ' workers', gain: null };
}
`,
  giai: '// Reference solution\n' + nguon(clusterAdvice),
  cases: [
    { goi: goi('clusterAdvice', 0.9, { 1: [11812, 11650, 11900], 2: [20482, 20100, 20700], 4: [38461, 38000, 38800], 8: [40278, 39900, 40500], 10: [36299, 36000, 36800] }), moTa: ['The /cpu route: 0.9% idle', 'Route /cpu: rảnh 0,9%'] },
    { goi: goi('clusterAdvice', 72, { 1: [1450], 10: [1547] }), moTa: ['72% idle: I/O-bound', 'Rảnh 72%: bị giới hạn bởi I/O'] },
    { goi: goi('clusterAdvice', 45, { 1: [5000], 4: [9000] }), an: true },
    { goi: goi('clusterAdvice', 12, { 2: [900, 1000, 950], 4: [1300, 1200, 1250], 6: [1250, 1310, 1240] }), an: true },
    { goi: goi('clusterAdvice', 20, { 1: [100, 100], 2: [180, 200], 3: [190, 190] }), an: true },
  ],
});

export default modul('nodejs-16-4-cluster-mo-rong', '16.4 Cluster: what it multiplies and what it breaks', [E1, E2, E3, E5, E4]);
