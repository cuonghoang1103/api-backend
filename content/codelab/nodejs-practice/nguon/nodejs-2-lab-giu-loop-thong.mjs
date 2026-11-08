// Node.js — Lab chương 2: giữ event loop thông thoáng (chẩn đoán sự cố, cắt tải theo độ trễ, "quyết định rồi giao việc").
import { modul, cs, jsBai, bang1, tn, pre, RES_GIA } from './_node.mjs';

const TN = [
  tn('event-loop lag', 'độ trễ event loop', 'How late callbacks fire; the number that says "the main thread is busy".'),
  tn('load shedding', 'cắt tải', 'Refusing some requests quickly (503) so the process can recover instead of queueing forever.'),
  tn('202 Accepted', '202 Accepted', 'The request was accepted; the work happens later — poll a status URL.'),
  tn('decide and delegate', 'quyết định rồi giao việc', 'A request validates, stores and hands heavy work elsewhere instead of computing it.'),
  tn('thread pool exhaustion', 'cạn nhóm luồng', 'All 4 libuv threads busy: fs/dns/crypto calls queue although the JS thread is free.'),
];

const L1 = cs({
  ten: 'Lab 2.1 — Incident review: diagnose, then pick the cure',
  kho: 'MEDIUM', phut: 15, loai: 'table', dangBai: 'lab',
  en: 'Five real-looking incidents from a Notes API in production. For each, choose the <b>diagnosis</b> (what chapter 2 calls it) and the <b>cure</b> the chapter recommends. Both cells of a row must be right.',
  vi: 'Năm sự cố trông như thật của Notes API trên production. Với mỗi sự cố, chọn CHẨN ĐOÁN (chương 2 gọi nó là gì) và CÁCH CHỮA chương khuyên. Cả hai ô của một hàng phải đúng.',
  bang: [bang1('i1', ['Diagnosis and cure for each incident.', 'Chẩn đoán và cách chữa cho từng sự cố.'],
    [
      { ma: 'su', ten: 'Incident|||Sự cố' },
      { ma: 'chan', ten: 'Diagnosis|||Chẩn đoán', luaChon: ['CPU work blocks the main thread', 'libuv thread pool exhausted', 'nextTick / microtask starvation', 'in-memory state split across processes', 'timing-dependent ordering'] },
      { ma: 'chua', ten: 'Cure|||Cách chữa', luaChon: ['move it to a worker thread or a queue', 'fewer concurrent pool jobs (or a pool size up to the core count)', 'yield with setImmediate instead', 'move the state to a shared store (Redis)', 'express the order with await'] },
    ],
    [
      { o: { su: 'GET /export builds a 40 MB PDF in pure JS; during exports every endpoint, even /health, stops answering; heartbeat 3 s late' }, a: { chan: 'CPU work blocks the main thread', chua: 'move it to a worker thread or a queue' } },
      { o: { su: 'Login (async bcrypt, 12 rounds) under load: unrelated avatar fs.readFile calls go from 2 ms to 400 ms; heartbeat lag stays at 1 ms' }, a: { chan: 'libuv thread pool exhausted', chua: 'fewer concurrent pool jobs (or a pool size up to the core count)' } },
      { o: { su: 'A "fast path" re-queues itself with process.nextTick until a list is processed; the process uses 100% CPU and accepts no connections, no error logged' }, a: { chan: 'nextTick / microtask starvation', chua: 'yield with setImmediate instead' } },
      { o: { su: 'After moving to 4 cluster processes, users can post 4× more comments per minute than the limit allows' }, a: { chan: 'in-memory state split across processes', chua: 'move the state to a shared store (Redis)' } },
      { o: { su: 'On the laptop the server works; on the busy VPS the first requests after a deploy fail with "no database connection" — listen() is called from a setTimeout of 100 ms' }, a: { chan: 'timing-dependent ordering', chua: 'express the order with await' } },
    ],
    ['Read the symptom that separates them. Everything stops and the heartbeat is late ⇒ the JS thread is busy computing (2.4) ⇒ worker/queue (2.5). Only pool-backed calls (fs, crypto) slow down while the heartbeat is fine ⇒ the 4-thread pool is full (2.4). 100% CPU, no I/O, no error ⇒ a priority queue that never empties (2.3) ⇒ setImmediate yields. Counts multiplied by the number of processes ⇒ per-process memory (2.5) ⇒ shared store. Works fast, fails slow ⇒ ordering by timer (2.2) ⇒ await.', 'Đọc triệu chứng phân biệt chúng. Mọi thứ dừng và nhịp tim trễ ⇒ luồng JS bận tính (2.4) ⇒ worker/hàng đợi (2.5). Chỉ lời gọi dùng nhóm luồng (fs, crypto) chậm trong khi nhịp tim ổn ⇒ nhóm 4 luồng đầy (2.4). CPU 100%, không I/O, không lỗi ⇒ hàng ưu tiên không bao giờ rỗng (2.3) ⇒ nhường bằng setImmediate. Số đếm nhân theo số process ⇒ bộ nhớ riêng từng process (2.5) ⇒ store chung. Nhanh thì chạy, chậm thì hỏng ⇒ sắp thứ tự bằng hẹn giờ (2.2) ⇒ await.'])],
  goiY: [
    ['First question for every incident: is the heartbeat (event-loop lag) high or normal?', 'Câu hỏi đầu cho mọi sự cố: nhịp tim (độ trễ event loop) cao hay bình thường?'],
    ['High lag + everything frozen = blocking. Normal lag + only fs/crypto slow = pool. No lag number at all because nothing runs = starvation.', 'Trễ cao + mọi thứ đông cứng = chặn. Trễ bình thường + chỉ fs/crypto chậm = nhóm luồng. Không đo được gì vì không gì chạy = bỏ đói.'],
  ],
  loi: [
    ['Answering "cluster" for a blocking endpoint — it only spreads the freeze.', 'Trả lời "cluster" cho endpoint chặn — chỉ rải sự đông cứng ra.'],
    ['Confusing pool exhaustion with blocking: the JS thread is free there, so the heartbeat looks healthy.', 'Nhầm cạn nhóm luồng với chặn: ở đó luồng JS rảnh nên nhịp tim trông khoẻ.'],
  ],
  tns: TN,
});

const L2 = jsBai({
  ten: 'Lab 2.2 — Shed load when the loop is lagging',
  kho: 'MEDIUM', phut: 20, diem: 30, dangBai: 'lab',
  en: `<p>When the loop is already late, accepting more requests only makes the queue longer (lesson 2.4: the 200th user waits ten minutes). Write the middleware factory <code>shedWhenLagging({ getLagMs, maxLagMs, retryAfterS })</code>:</p>
<ul><li><code>getLagMs()</code> returns the current event-loop lag in ms (in production: the p99 of <code>monitorEventLoopDelay</code> minus its resolution).</li>
<li>If the lag is <b>above</b> <code>maxLagMs</code> ⇒ answer immediately: status <b>503</b>, header <code>Retry-After</code> = <code>String(retryAfterS)</code>, body <code>{ error: 'overloaded', lagMs }</code> (the measured value, rounded to a whole number). Do not call <code>next</code>.</li>
<li>Otherwise call <code>next()</code>.</li>
<li>Never shed <code>GET /health</code> (the load balancer must keep seeing the process) — it always goes to <code>next()</code>.</li>
<li>Count what you did: the middleware function has a property <code>stats = { passed, shed }</code>.</li></ul>${pre("const shed = shedWhenLagging({ getLagMs: () => 640.4, maxLagMs: 200, retryAfterS: 5 });\nshed({ method: 'GET', path: '/notes' }, res, next);   // 503, Retry-After: '5', { error: 'overloaded', lagMs: 640 }\nshed.stats;                                            // { passed: 0, shed: 1 }")}`,
    vi: `<p>Khi vòng lặp đã trễ, nhận thêm request chỉ làm hàng dài thêm. Viết factory middleware shedWhenLagging({ getLagMs, maxLagMs, retryAfterS }): lag LỚN HƠN maxLagMs ⇒ trả ngay 503, header Retry-After = String(retryAfterS), body { error: 'overloaded', lagMs } (làm tròn), không gọi next; ngược lại next(). Không bao giờ cắt GET /health. Đếm vào thuộc tính stats = { passed, shed } của hàm middleware.</p>`,
  yc: [
    ['503 + Retry-After + body when lag &gt; max; otherwise <code>next()</code>.', '503 + Retry-After + body khi lag > max; ngược lại next().'],
    ['<code>GET /health</code> is never shed.', 'GET /health không bao giờ bị cắt.'],
    ['Read the lag on every request (it changes); keep <code>stats</code> per middleware instance.', 'Đọc lag ở mỗi request (nó thay đổi); stats riêng cho từng middleware.'],
  ],
  goiY: [
    ['Create the arrow first, attach the counters, return it: <code>const mw = (req, res, next) =&gt; {…}; mw.stats = { passed: 0, shed: 0 }; return mw;</code>', 'Tạo arrow trước, gắn bộ đếm, rồi trả: const mw = (req, res, next) => {…}; mw.stats = { passed: 0, shed: 0 }; return mw;'],
    ['Inside: health check first, then <code>const lag = getLagMs();</code>, then the comparison.', 'Bên trong: kiểm health trước, rồi const lag = getLagMs();, rồi so sánh.'],
  ],
  loi: [
    ['Reading the lag once when the factory runs — the middleware then sheds forever or never.', 'Đọc lag một lần lúc factory chạy — middleware khi đó cắt mãi hoặc không bao giờ cắt.'],
    ['Shedding <code>/health</code> — the load balancer marks the process dead and sends its traffic to the other processes, which are just as loaded.', 'Cắt cả /health — bộ cân bằng tải đánh dấu process chết và dồn lưu lượng sang các process khác, vốn cũng đang quá tải.'],
    ['<code>&gt;=</code> instead of <code>&gt;</code> — exactly at the threshold the request should still pass.', '>= thay vì > — đúng ngưỡng thì request vẫn phải qua.'],
  ],
  gt: ['Load shedding is the backend version of "fail fast": a cheap 503 with Retry-After costs microseconds, while accepting the request would add it to a queue behind seconds of blocked work. The factory closes over the configuration and the counters (lesson 1.2), reads the lag at request time so it reacts as the loop recovers, and exempts the health check so the orchestrator does not kill a process that is merely busy.',
    'Cắt tải là "hỏng nhanh" của backend: một 503 rẻ kèm Retry-After tốn vài micro giây, còn nhận request là nhét nó vào hàng sau vài giây việc bị chặn. Factory giữ cấu hình và bộ đếm trong closure (bài 1.2), đọc lag lúc có request để phản ứng khi vòng lặp hồi lại, và chừa health check để bộ điều phối không giết một process chỉ đang bận.'],
  kn: ['load shedding', 'event-loop lag', 'middleware factory'],
  tns: TN,
  viDu: [{ input: "shedWhenLagging({ getLagMs: () => 640.4, maxLagMs: 200, retryAfterS: 5 })({ method: 'GET', path: '/notes' }, res, next)", output: 'status 503 · Retry-After "5" · {"error":"overloaded","lagMs":640}', explanation: 'next is not called.|||Không gọi next.' }],
  chung: RES_GIA,
  dau: `function shedWhenLagging({ getLagMs, maxLagMs, retryAfterS }) {
  const lag = getLagMs();
  return (req, res, next) => {
    if (lag >= maxLagMs) {
      res.status(503).json({ error: 'overloaded' });
    }
    next();
  };
}
`,
  giai: `// Refuse cheaply while the loop is late, instead of queueing more work behind it.
function shedWhenLagging({ getLagMs, maxLagMs, retryAfterS }) {
  const mw = (req, res, next) => {
    // the load balancer must always see the process: never shed the health check
    if (req.method === 'GET' && req.path === '/health') {
      mw.stats.passed += 1;
      return next();
    }
    const lag = getLagMs(); // read NOW: the lag changes from request to request
    if (lag > maxLagMs) {
      mw.stats.shed += 1;
      return res
        .status(503)
        .set('Retry-After', String(retryAfterS))
        .json({ error: 'overloaded', lagMs: Math.round(lag) });
    }
    mw.stats.passed += 1;
    next();
  };
  mw.stats = { passed: 0, shed: 0 }; // per middleware instance (closure-free counters on the function)
  return mw;
}
`,
  cases: [
    { moTa: ['high lag ⇒ 503 + Retry-After, next not called', 'lag cao ⇒ 503 + Retry-After, không next'], chuanBi: "const shed = shedWhenLagging({ getLagMs: () => 640.4, maxLagMs: 200, retryAfterS: 5 }); const res = mkRes(); const next = mkNext(); shed({ method: 'GET', path: '/notes' }, res, next);", goi: '[res.statusCode, res.headers, res.body, next.calls, shed.stats]' },
    { moTa: ['normal lag ⇒ next()', 'lag bình thường ⇒ next()'], chuanBi: "const shed = shedWhenLagging({ getLagMs: () => 3, maxLagMs: 200, retryAfterS: 5 }); const res = mkRes(); const next = mkNext(); shed({ method: 'POST', path: '/notes' }, res, next);", goi: '[next.calls, res.sent, shed.stats]' },
    { moTa: ['GET /health is never shed', 'GET /health không bao giờ bị cắt'], chuanBi: "const shed = shedWhenLagging({ getLagMs: () => 5000, maxLagMs: 200, retryAfterS: 5 }); const res = mkRes(); const next = mkNext(); shed({ method: 'GET', path: '/health' }, res, next);", goi: '[next.calls, res.sent]' },
    { an: true, chuanBi: "let lag = 10; const shed = shedWhenLagging({ getLagMs: () => lag, maxLagMs: 100, retryAfterS: 2 }); const out = []; for (const l of [10, 100, 100.4, 250, 99]) { lag = l; const res = mkRes(); const next = mkNext(); shed({ method: 'GET', path: '/notes/1' }, res, next); out.push(next.calls.length ? 'next' : res.statusCode + ':' + res.headers['retry-after'] + ':' + res.body.lagMs); }", goi: '[out, shed.stats]' },
    { an: true, chuanBi: "const a = shedWhenLagging({ getLagMs: () => 999, maxLagMs: 1, retryAfterS: 1 }); const b = shedWhenLagging({ getLagMs: () => 0, maxLagMs: 1, retryAfterS: 1 }); a({ method: 'GET', path: '/x' }, mkRes(), mkNext()); b({ method: 'GET', path: '/x' }, mkRes(), mkNext()); a({ method: 'POST', path: '/health' }, mkRes(), mkNext());", goi: '[a.stats, b.stats]' },
  ],
});

const L3 = jsBai({
  ten: 'Lab 2.3 — Decide and delegate: thumbnails without blocking the request',
  kho: 'HARD', phut: 35, diem: 30, dangBai: 'lab',
  en: `<p>"On this site, video and image processing never happens inside a request. The upload endpoint stores the file and returns immediately; the heavy work runs elsewhere." Build that endpoint pair. <code>createThumbnailApi({ store, pool })</code> returns two async handlers:</p>
<ul>
<li><code>upload(req, res)</code>: <code>req.body.file</code> missing ⇒ <b>400</b> <code>{ error: 'file is required' }</code>. Otherwise <code>const id = await store.save(req.body.file)</code>, record the job as <code>'queued'</code>, hand it to the pool <b>without awaiting it</b> — <code>pool.run(id)</code> resolves when the thumbnail is made, rejects if it fails — and answer <b>202</b> <code>{ id, status: 'queued' }</code> right away.</li>
<li>When the pool job starts it is <code>'processing'</code> (the pool calls the optional <code>onStart</code> you pass as a second argument: <code>pool.run(id, () =&gt; …)</code>); when it resolves ⇒ <code>'done'</code> with <code>thumbUrl</code> set to the resolved value; when it rejects ⇒ <code>'failed'</code> with <code>error</code> = the message. A failed thumbnail must never become an unhandled rejection.</li>
<li><code>status(req, res)</code>: <code>req.params.id</code> unknown ⇒ <b>404</b> <code>{ error: 'not found' }</code>; otherwise 200 with the job: <code>{ id, status }</code> plus <code>thumbUrl</code> or <code>error</code> when present.</li>
</ul>${pre("await api.upload({ body: { file: 'cat.png' } }, res);   // 202 { id: 'f1', status: 'queued' }  — after ~20 ms (the save)\n// the thumbnail takes 2 000 ms in the pool…\nawait api.status({ params: { id: 'f1' } }, res);       // 200 { id: 'f1', status: 'processing' }\n// …later\nawait api.status({ params: { id: 'f1' } }, res);       // 200 { id: 'f1', status: 'done', thumbUrl: '/thumbs/f1.webp' }")}<p>The tests give you a real pool of size 2 (the one from lesson 2.5) whose fake worker takes 2 000 ms per thumbnail and fails for files named <code>broken.png</code>.</p>`,
  vi: `<p>"Trên web này, xử lý ảnh/video không bao giờ diễn ra trong request. Endpoint upload lưu tệp và trả về ngay; việc nặng chạy ở nơi khác." Dựng cặp endpoint đó: upload — thiếu file ⇒ 400; ngược lại await store.save, ghi việc 'queued', giao cho pool KHÔNG await, trả 202 { id, status: 'queued' } ngay. Việc bắt đầu ⇒ 'processing' (onStart); resolve ⇒ 'done' kèm thumbUrl; reject ⇒ 'failed' kèm error; không bao giờ để thành unhandled rejection. status — id lạ ⇒ 404, ngược lại 200 với việc đó.</p>`,
  yc: [
    ['<code>upload</code> answers 202 after the save — it never waits for the thumbnail.', 'upload trả 202 sau khi lưu — không bao giờ chờ thumbnail.'],
    ['Job status moves queued → processing → done | failed; failures are caught.', 'Trạng thái đi queued → processing → done | failed; lỗi được bắt.'],
    ['400 for a missing file, 404 for an unknown id; each request answered exactly once.', '400 khi thiếu tệp, 404 khi id lạ; mỗi request trả lời đúng một lần.'],
  ],
  goiY: [
    ['Keep <code>const jobs = new Map();</code> in the factory (closure). A job is a plain object you update in place: <code>{ id, status }</code>.', 'Giữ const jobs = new Map(); trong factory (closure). Mỗi việc là object bạn cập nhật tại chỗ: { id, status }.'],
    ['Fire and forget, but with an owner for the error: <code>pool.run(id, () =&gt; { job.status = \'processing\'; }).then((url) =&gt; {…}, (err) =&gt; {…});</code> — no <code>await</code> in front.', 'Bắn rồi quên, nhưng lỗi có chủ: pool.run(id, onStart).then(onDone, onFail); — không có await phía trước.'],
    ['For <code>status</code>, copy the job into the response (<code>{ ...job }</code>) so the client never holds your live object.', 'Với status, chép việc vào response ({ ...job }) để client không giữ object đang sống của bạn.'],
  ],
  loi: [
    ['<code>await pool.run(id)</code> inside <code>upload</code> (the starter) — the user waits 2 s and the request holds a connection for the whole job: computing inside the request with extra steps.', 'await pool.run(id) trong upload (code khởi đầu) — người dùng chờ 2 s, request giữ kết nối suốt việc: vẫn là tính toán trong request.'],
    ['Calling <code>pool.run(id)</code> with no <code>.catch</code>/second <code>then</code> argument — a broken file becomes an unhandled rejection, which ends the process in Node 22 (lesson 1.4).', 'Gọi pool.run(id) không có .catch — tệp hỏng thành unhandled rejection, làm process thoát ở Node 22 (bài 1.4).'],
    ['Answering 202 before <code>store.save</code> finished — the id may not exist yet when the client polls.', 'Trả 202 trước khi store.save xong — client hỏi trạng thái có thể chưa có id.'],
  ],
  gt: ['The request does the cheap, must-succeed part (validate, store) and returns <b>202</b> with an id; the expensive part goes to a bounded pool that runs at its own pace. Because <code>pool.run</code> is not awaited, the handler finishes in the time of one save — but the Promise still has an owner: the rejection handler records <code>failed</code>, so no error escapes. The status object is updated as the job moves, and <code>status</code> returns a copy, which is the polling half of the pattern. In chapter 13 the in-memory Map becomes a real queue that survives restarts.',
    'Request làm phần rẻ và bắt buộc thành công (kiểm, lưu) rồi trả 202 kèm id; phần đắt giao cho một nhóm có giới hạn chạy theo nhịp của nó. Vì không await pool.run, handler xong trong thời gian một lần lưu — nhưng Promise vẫn có chủ: hàm xử lý reject ghi failed nên không lỗi nào thoát ra. Object trạng thái cập nhật theo việc, và status trả bản sao — nửa "hỏi trạng thái" của mẫu. Ở chương 13, Map trong RAM thành hàng đợi thật sống qua khởi động lại.'],
  kn: ['202 Accepted', 'fire-and-forget with error ownership', 'worker pool'],
  tns: TN,
  viDu: [{ input: "await api.upload({ body: { file: 'cat.png' } }, res)", output: 'status 202 · {"id":"f1","status":"queued"} after 20 ms', explanation: 'The starter answers after 2 020 ms.|||Code khởi đầu trả lời sau 2 020 ms.' }],
  chung: `${RES_GIA}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mkStore = () => { let n = 0; return { save: (file) => new Promise((ok) => setTimeout(() => ok('f' + ++n), 20)) }; };
const mkPool = (size, ms = 2000) => { let running = 0; const q = []; const files = {};
  const pump = () => { while (running < size && q.length) { const it = q.shift(); running++; if (it.onStart) it.onStart();
    setTimeout(() => { running--; files[it.id] === 'broken.png' ? it.ko(new Error('cannot decode ' + it.id)) : it.ok('/thumbs/' + it.id + '.webp'); pump(); }, ms); } };
  return { files, run: (id, onStart) => new Promise((ok, ko) => { q.push({ id, onStart, ok, ko }); pump(); }) }; };
const mkApi = (size) => { const store = mkStore(); const pool = mkPool(size); const save = store.save; store.save = (f) => save(f).then((id) => { pool.files[id] = f; return id; }); return createThumbnailApi({ store, pool }); };`,
  dau: `function createThumbnailApi({ store, pool }) {
  const jobs = new Map();
  return {
    async upload(req, res) {
      const id = await store.save(req.body.file);
      jobs.set(id, { id, status: 'queued' });
      const url = await pool.run(id);
      jobs.set(id, { id, status: 'done', thumbUrl: url });
      res.status(202).json(jobs.get(id));
    },
    async status(req, res) {
      res.json(jobs.get(req.params.id));
    },
  };
}
`,
  giai: `// "A request should decide and delegate, not compute."
function createThumbnailApi({ store, pool }) {
  const jobs = new Map(); // id -> { id, status, thumbUrl?, error? }  (private to this API)

  return {
    async upload(req, res) {
      const file = req.body && req.body.file;
      if (!file) return res.status(400).json({ error: 'file is required' });

      const id = await store.save(file);          // cheap and must succeed: await it
      const job = { id, status: 'queued' };
      jobs.set(id, job);

      // heavy work: hand it to the bounded pool and DO NOT await it…
      pool.run(id, () => { job.status = 'processing'; })
        .then(
          (thumbUrl) => { job.status = 'done'; job.thumbUrl = thumbUrl; },
          // …but give the error an owner, so a broken file never becomes an unhandled rejection
          (err) => { job.status = 'failed'; job.error = err.message; },
        );

      return res.status(202).json({ id, status: 'queued' }); // answered after the save only
    },

    async status(req, res) {
      const job = jobs.get(req.params.id);
      if (!job) return res.status(404).json({ error: 'not found' });
      return res.status(200).json({ ...job });     // a copy, not our live object
    },
  };
}
`,
  cases: [
    { moTa: ['upload answers 202 after the save (~20 ms), not after the thumbnail', 'upload trả 202 sau khi lưu (~20 ms)'], chuanBi: "const api = mkApi(2); const res = mkRes(); const t = Date.now(); await api.upload({ body: { file: 'cat.png' } }, res);", goi: '[res.statusCode, res.body, Date.now() - t]' },
    { moTa: ['status: processing, then done with thumbUrl', 'status: processing rồi done kèm thumbUrl'], chuanBi: "const api = mkApi(2); await api.upload({ body: { file: 'cat.png' } }, mkRes()); await sleep(100); const r1 = mkRes(); await api.status({ params: { id: 'f1' } }, r1); await sleep(2000); const r2 = mkRes(); await api.status({ params: { id: 'f1' } }, r2);", goi: '[r1.body, r2.statusCode, r2.body]' },
    { moTa: ['400 for a missing file, 404 for an unknown id', '400 khi thiếu tệp, 404 khi id lạ'], chuanBi: 'const api = mkApi(2); const a = mkRes(); await api.upload({ body: {} }, a); const b = mkRes(); await api.status({ params: { id: "nope" } }, b);', goi: '[a.statusCode, a.body, b.statusCode, b.body]' },
    { moTa: ['a broken file ends as failed, no unhandled rejection', 'tệp hỏng thành failed, không unhandled rejection'], chuanBi: "const api = mkApi(1); await api.upload({ body: { file: 'broken.png' } }, mkRes()); await sleep(2500); const r = mkRes(); await api.status({ params: { id: 'f1' } }, r);", goi: 'r.body' },
    { an: true, chuanBi: "const api = mkApi(2); for (const f of ['a.png', 'b.png', 'c.png']) await api.upload({ body: { file: f } }, mkRes()); await sleep(500); const s = []; for (const id of ['f1', 'f2', 'f3']) { const r = mkRes(); await api.status({ params: { id } }, r); s.push(r.body.status); } await sleep(4000); const r3 = mkRes(); await api.status({ params: { id: 'f3' } }, r3);", goi: '[s, r3.body]' },
    { an: true, chuanBi: "const api = mkApi(2); const r = mkRes(); await api.upload({ body: { file: 'x.png' } }, r); const s = mkRes(); await api.status({ params: { id: 'f1' } }, s); s.body.status = 'hacked'; const s2 = mkRes(); await api.status({ params: { id: 'f1' } }, s2);", goi: '[r.sent, s2.body.status]' },
  ],
});

export default modul('nodejs-2-lab-giu-loop-thong', 'Lab 2 — Keep the event loop free', [L1, L2, L3], 'nodejs-2-5-worker-threads');
