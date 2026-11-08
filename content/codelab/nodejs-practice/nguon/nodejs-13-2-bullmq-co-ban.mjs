/** Node.js · 13.2 — BullMQ: Queue / Worker / Job, một job thực chất là hash + id trong danh sách wait, addBulk, concurrency I/O vs CPU. */
import { modul, cs, q, tn, bang1, jsBai, c } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '13.2 · Queue, Worker, Job — and the Redis underneath', kho: 'EASY', phut: 10,
  en: 'BullMQ is a library, not a server: the queue lives entirely in Redis, built from the primitives of chapter 12. Every question below follows from that one fact.',
  vi: 'BullMQ là thư viện, không phải máy chủ: hàng đợi nằm trọn trong Redis, dựng từ các viên gạch của chương 12. Mọi câu dưới đây đều suy ra từ một sự thật đó.',
  cau: [
    q('c1', ['Adding one job grew DBSIZE by 6 keys. What IS a waiting job in Redis?', 'Thêm một job làm DBSIZE tăng 6 khoá. Một job đang chờ thực chất là gì trong Redis?'],
      ['A hash with data and bookkeeping, plus its id in a wait list', 'A message published on a Pub/Sub channel that workers subscribe to', 'A row in a BullMQ daemon process that Redis forwards to workers', 'A stream entry that is acknowledged with XACK'],
      ['The worker pops the id from wait, moves it to active, takes a lock, runs your function, moves it to completed or failed — every step a chapter-12 operation.', 'Worker lấy id khỏi wait, chuyển sang active, giữ một khoá, chạy hàm của bạn, chuyển sang completed hoặc failed — bước nào cũng là thao tác của chương 12.']),
    q('c2', ['Why must the Worker run in a SEPARATE process from the web server?', 'Vì sao Worker phải chạy ở tiến trình TÁCH RIÊNG khỏi web server?'],
      ['They would share one event loop: a heavy job slows every request', 'BullMQ refuses to start a Worker in a process that listens on a port', 'Redis allows only one connection per process', 'Workers need root privileges that a web process must not have'],
      ['Chapter 2.4 measured a 2,871 ms block delaying the heartbeat by 2,873 ms. Two web containers and six workers — or the reverse during a backlog.', 'Chương 2.4 đo một lần chặn 2.871 ms làm nhịp tim trễ 2.873 ms. Hai container web và sáu worker — hoặc ngược lại khi tồn đọng.']),
    q('c3', ['20,000 jobs were added to a 3 MB Redis set to allkeys-lru. add() never threw. What happened?', '20.000 job được thêm vào một Redis 3 MB đặt allkeys-lru. add() không bao giờ ném lỗi. Chuyện gì xảy ra?'],
      ['Most jobs were silently evicted, even the id counter', 'BullMQ paused the queue until memory was freed', 'The oldest jobs were moved to disk and restored later', 'Redis rejected the extra jobs with OOM, which BullMQ retried'],
      ['The setting that is dangerous for a cache (noeviction) is the required setting for a queue. This site’s cache Redis is allkeys-lru — a queue would need a second instance.', 'Cấu hình nguy hiểm cho cache (noeviction) lại là cấu hình bắt buộc cho hàng đợi. Redis cache của website là allkeys-lru — hàng đợi sẽ cần một instance thứ hai.']),
    q('c4', ['Each waiting job costs about 250 bytes. What does a backlog of one million jobs mean on this site’s 256 MB instance?', 'Mỗi job đang chờ tốn khoảng 250 byte. Tồn đọng một triệu job có nghĩa gì trên instance 256 MB của website?'],
      ['About 250 MB — the whole instance; backlogs are not free storage', 'About 2.5 MB, because BullMQ compresses waiting jobs', 'Nothing: waiting jobs are stored on disk until a worker takes them', 'About 25 GB, because each job keeps six keys'],
      ['Size Redis for the worst backlog you will tolerate, and alert on “waiting is climbing” long before that (13.5).', 'Định cỡ Redis theo mức tồn đọng tệ nhất bạn chấp nhận, và cảnh báo "waiting đang tăng" từ rất lâu trước đó (13.5).']),
    q('c5', ['Two worker processes, one queue, 100 jobs: 50 + 50, duplicates 0. What gives that guarantee?', 'Hai tiến trình worker, một hàng đợi, 100 job: 50 + 50, trùng 0. Điều gì đem lại bảo đảm đó?'],
      ['The atomic move of each id from wait to active plus a per-job lock — one job to one worker', 'A leader election between the workers at startup', 'Pub/Sub, which delivers each message to one subscriber', 'BullMQ hashing job ids so that each worker owns half of them'],
      ['That is why you scale by simply starting more workers — no coordination, no configuration. Pub/Sub does the opposite: every subscriber gets every message.', 'Vì thế muốn mở rộng chỉ cần chạy thêm worker — không điều phối, không cấu hình. Pub/Sub làm ngược lại: mọi người đăng ký đều nhận mọi tin.']),
    q('c6', ['Why one queue per KIND of work (email, media, search) instead of one queue for everything?', 'Vì sao mỗi LOẠI việc một hàng đợi (email, media, search) thay vì một hàng đợi cho tất cả?'],
      ['So a 30-second video job cannot starve a password reset', 'Because BullMQ allows at most 10 job names per queue', 'Because Redis keys of one queue must fit in one hash slot', 'So that jobs of different kinds can share the same jobId'],
      ['Within a queue the job name is the discriminator your handler switches on (welcome, password-reset).', 'Bên trong một hàng đợi, tên job là thứ handler dùng để rẽ nhánh (welcome, password-reset).']),
  ],
  goiY: [['Translate every BullMQ word into a Redis structure: hash, list, sorted set, lock.', 'Dịch mọi từ của BullMQ ra một cấu trúc Redis: hash, list, sorted set, khoá.'], ['What does an eviction policy do to keys that a queue needs?', 'Chính sách đuổi làm gì với các khoá mà hàng đợi cần?']],
  loi: [['Running BullMQ on the cache Redis with allkeys-lru — jobs vanish and add() never complains.', 'Chạy BullMQ trên Redis cache với allkeys-lru — job biến mất mà add() không kêu ca gì.'], ['Starting the Worker inside the web server “to save a container”.', 'Khởi Worker bên trong web server "cho đỡ một container".']],
  tns: [tn('Queue', 'phía gửi', 'queue.add(name, data, opts) — nằm trong tiến trình web'), tn('Worker', 'phía làm', 'new Worker(name, handler, opts) — tiến trình riêng'), tn('Job', 'một việc', 'một hash trong Redis: data, opts, số lần thử, kết quả, lý do hỏng')],
  kn: ['BullMQ'],
});

const T = ['≈ 41 s', '≈ 8 s', '≈ 2.1 s', '≈ 0.5 s', '≈ 6 s'];
const E2 = cs({
  ten: '13.2 · Concurrency: predict the measurement', kho: 'MEDIUM', phut: 8, loai: 'table',
  en: 'Predict how long the lesson’s runs took. Two jobs types: 200 jobs that each WAIT 200 ms on I/O, and 100 jobs that each BURN 60 ms of CPU (hashing). One worker process; only the concurrency option changes.',
  vi: 'Dự đoán thời gian các lần chạy trong bài. Hai loại job: 200 job mỗi cái CHỜ I/O 200 ms, và 100 job mỗi cái ĐỐT 60 ms CPU (băm). Một tiến trình worker; chỉ đổi tuỳ chọn concurrency.',
  bang: [bang1('b1', ['Run → total time', 'Lần chạy → tổng thời gian'], [{ ma: 'r', ten: 'Run' }, { ma: 't', ten: 'Total', luaChon: T }], [
    { o: { r: 'I/O job, concurrency 1' }, a: { t: T[0] } },
    { o: { r: 'I/O job, concurrency 5' }, a: { t: T[1] } },
    { o: { r: 'I/O job, concurrency 20' }, a: { t: T[2] } },
    { o: { r: 'I/O job, concurrency 100' }, a: { t: T[3] } },
    { o: { r: 'CPU job, concurrency 1' }, a: { t: T[4] } },
    { o: { r: 'CPU job, concurrency 50' }, a: { t: T[4] } },
  ], ['I/O: 41,021 → 8,225 → 2,096 → 494 ms — nearly linear, 81× from 1 to 100, because waiting jobs overlap. CPU: 6,214 ms at concurrency 1 and 6,044 ms at 50 — zero gain: concurrency means “in flight”, and in flight is not parallel on one event loop. CPU-bound work needs more processes, a sandboxed processor or worker_threads.', 'I/O: 41.021 → 8.225 → 2.096 → 494 ms — gần tuyến tính, 81× từ 1 tới 100, vì các job đang chờ chồng lên nhau. CPU: 6.214 ms ở mức 1 và 6.044 ms ở mức 50 — không lợi gì: concurrency nghĩa là "đang bay", và đang bay không phải song song trên một event loop. Việc tốn CPU cần thêm tiến trình, sandboxed processor hoặc worker_threads.'])],
  goiY: [['I/O: total ≈ jobs ÷ concurrency × 200 ms.', 'I/O: tổng ≈ số job ÷ concurrency × 200 ms.'], ['CPU: one event loop executes one job’s code at a time, whatever the concurrency.', 'CPU: một event loop chạy code của một job mỗi lúc, bất kể concurrency.']],
  loi: [['Raising concurrency to fix a slow CPU-bound queue — the number does not move.', 'Tăng concurrency để chữa một hàng đợi tốn CPU chậm — con số không nhúc nhích.'], ['Assuming concurrency spawns threads.', 'Tưởng concurrency sinh ra luồng.']],
  tns: [tn('I/O-bound', 'chờ I/O', 'phần lớn thời gian là chờ mạng/đĩa'), tn('CPU-bound', 'tốn CPU', 'phần lớn thời gian là tính toán trên luồng chính')],
  kn: ['concurrency', 'event loop'],
});

const E3 = jsBai({
  ten: '13.2 · Open the box: a queue as a hash and three lists', kho: 'MEDIUM', phut: 20,
  en: `<p>Rebuild the core of what the lesson found inside Redis, in memory. ${c('createQueue()')} returns an object with:</p><ul><li>${c('add(name, data, opts = {})')} → the job id as a STRING (${c("'1'")}, ${c("'2'")}…); store the job ${c('{ id, name, data, opts, timestamp: Date.now(), attemptsMade: 0 }')} in a Map (the hash) and push the id to the end of ${c('wait')};</li><li>${c('take()')} → move the FIRST id of ${c('wait')} to ${c('active')} and return a COPY of its job, or ${c('null')} when nothing waits;</li><li>${c('complete(id, returnvalue)')} / ${c('fail(id, reason)')} → move an ACTIVE id to ${c('completed')} / ${c('failed')}, recording ${c('returnvalue')} / ${c('failedReason')} and ${c('finishedOn: Date.now()')}; return ${c('false')} if the id is not active;</li><li>${c('getJob(id)')} → a copy or ${c('null')}; ${c('counts()')} → ${c('{ wait, active, completed, failed }')}.</li></ul><p>A job taken by one worker must never be handed to another.</p>`,
  vi: `<p>Dựng lại trong bộ nhớ phần lõi của những gì bài tìm thấy trong Redis. ${c('createQueue()')} trả một đối tượng có:</p><ul><li>${c('add(name, data, opts = {})')} → id của job dạng CHUỖI (${c("'1'")}, ${c("'2'")}…); lưu job ${c('{ id, name, data, opts, timestamp: Date.now(), attemptsMade: 0 }')} vào một Map (cái hash) và đẩy id vào cuối ${c('wait')};</li><li>${c('take()')} → chuyển id ĐẦU của ${c('wait')} sang ${c('active')} và trả một BẢN SAO của job, hoặc ${c('null')} khi không có gì chờ;</li><li>${c('complete(id, returnvalue)')} / ${c('fail(id, reason)')} → chuyển một id đang ACTIVE sang ${c('completed')} / ${c('failed')}, ghi ${c('returnvalue')} / ${c('failedReason')} và ${c('finishedOn: Date.now()')}; trả ${c('false')} nếu id không ở active;</li><li>${c('getJob(id)')} → bản sao hoặc ${c('null')}; ${c('counts()')} → ${c('{ wait, active, completed, failed }')}.</li></ul><p>Job đã được một worker lấy không bao giờ được giao cho worker khác.</p>`,
  yc: [['FIFO: take() returns the oldest waiting job.', 'FIFO: take() trả job chờ lâu nhất.'], ['take() REMOVES the id from wait (no two workers get the same job).', 'take() XOÁ id khỏi wait (không hai worker nào nhận cùng job).'], ['Copies out, so a caller cannot change the stored job by accident.', 'Trả bản sao, để nơi gọi không vô tình sửa job đã lưu.']],
  dauVao: ['— (createQueue() takes no argument)', '— (createQueue() không nhận đối số)'],
  dauRa: ['{ add, take, complete, fail, getJob, counts }', '{ add, take, complete, fail, getJob, counts }'],
  goiY: [['State: const jobs = new Map(); const wait = [], active = new Set(), completed = [], failed = []; let seq = 0;', 'Trạng thái: const jobs = new Map(); const wait = [], active = new Set(), completed = [], failed = []; let seq = 0;'], ['take(): const id = wait.shift(); if (id === undefined) return null; active.add(id); return structuredClone(jobs.get(id));', 'take(): const id = wait.shift(); if (id === undefined) return null; active.add(id); return structuredClone(jobs.get(id));']],
  loi: [['take() that reads wait[0] without removing it: two workers polling at once both run job 1 — the duplicate the blocking pop exists to prevent.', 'take() đọc wait[0] mà không xoá: hai worker hỏi cùng lúc đều chạy job 1 — đúng thứ trùng lặp mà phép lấy chặn (blocking pop) sinh ra để ngăn.'], ['Numeric ids: BullMQ ids are strings, and Map.get(1) does not find the key "1".', 'Id dạng số: id của BullMQ là chuỗi, và Map.get(1) không tìm thấy khoá "1".'], ['Completing a job that is not active (already completed, or never taken): the counts drift and a job is “done” twice.', 'Hoàn tất một job không ở active (đã xong rồi, hoặc chưa ai lấy): số đếm lệch và một job "xong" hai lần.']],
  gt: ['That is the whole magic trick: a job is a record plus an id that moves between lists. Moving the id out of wait in the same step that hands it out is what lets 2 workers split 100 jobs 50 + 50 with zero duplicates. Real BullMQ does the move atomically in a Lua script and adds a lock with a TTL — the subject of 13.5.', 'Đó là toàn bộ màn ảo thuật: một job là một bản ghi cộng một id di chuyển giữa các danh sách. Chuyển id ra khỏi wait ngay trong bước giao nó đi là thứ giúp 2 worker chia 100 job 50 + 50 không trùng cái nào. BullMQ thật làm việc chuyển đó nguyên tử bằng kịch bản Lua và thêm một khoá có TTL — chủ đề của 13.5.'],
  kn: ['BullMQ internals'], tns: [tn('wait / active / completed / failed', 'các trạng thái job', 'danh sách id mà job đi qua')],
  dau: `/** An in-memory model of a BullMQ queue. */
function createQueue() {
  const jobs = new Map();
  const wait = [];
  let seq = 0;
  // Write your solution here
  return {
    add(name, data, opts = {}) { const id = ++seq; jobs.set(id, { id, name, data, opts }); wait.push(id); return id; },
    take() { return wait.length ? jobs.get(wait[0]) : null; },
    complete(id, returnvalue) { return true; },
    fail(id, reason) { return true; },
    getJob(id) { return jobs.get(id) || null; },
    counts() { return { wait: wait.length, active: 0, completed: 0, failed: 0 }; },
  };
}
`,
  giai: `/** An in-memory model of a BullMQ queue: a hash of jobs + ids moving between lists. */
function createQueue() {
  const jobs = new Map();               // bull:<q>:<id>  — the job hashes
  const wait = [];                      // bull:<q>:wait  — FIFO of ids
  const active = new Set();             // bull:<q>:active
  const completed = [], failed = [];
  let seq = 0;                          // bull:<q>:id    — the id counter
  const copy = (id) => (jobs.has(id) ? structuredClone(jobs.get(id)) : null);
  const finish = (id, list, patch) => {
    if (!active.has(id)) return false;  // only an ACTIVE job can finish (never twice)
    active.delete(id);
    Object.assign(jobs.get(id), patch, { finishedOn: Date.now() });
    list.push(id);
    return true;
  };
  return {
    add(name, data, opts = {}) {
      const id = String(++seq);         // ids are strings
      jobs.set(id, { id, name, data: structuredClone(data), opts, timestamp: Date.now(), attemptsMade: 0 });
      wait.push(id);
      return id;
    },
    take() {
      const id = wait.shift();          // REMOVE it from wait in the same step: nobody else can get it
      if (id === undefined) return null;
      active.add(id);
      return copy(id);
    },
    complete(id, returnvalue) { return finish(String(id), completed, { returnvalue }); },
    fail(id, reason) { return finish(String(id), failed, { failedReason: reason }); },
    getJob(id) { return copy(String(id)); },
    counts() { return { wait: wait.length, active: active.size, completed: completed.length, failed: failed.length }; },
  };
}
`,
  chung: `const qu = createQueue();`,
  cases: [
    { goi: `[qu.add('email', { to: 'an@x.vn', subject: 'Chào bạn' }), qu.add('email', { to: 'b@x.vn' }), qu.getJob('1'), qu.counts()]`, moTa: ['String ids, the stored job, counts', 'Id dạng chuỗi, job đã lưu, số đếm'] },
    { goi: `(() => { qu.add('a', {}); qu.add('b', {}); const w1 = qu.take(), w2 = qu.take(), w3 = qu.take(); return [w1.name, w2.name, w3, qu.counts()]; })()`, moTa: ['FIFO; two workers never get the same job', 'FIFO; hai worker không bao giờ nhận cùng một job'] },
    { goi: `(() => { qu.add('a', { n: 1 }); const j = qu.take(); return [qu.complete(j.id, { sentAt: 'x' }), qu.complete(j.id, 'again'), qu.getJob(j.id).returnvalue, qu.counts()]; })()`, moTa: ['complete() works once, only for an active job', 'complete() chỉ có tác dụng một lần, với job đang active'] },
    { goi: `(() => { const ids = Array.from({ length: 100 }, (_, i) => qu.add('job', { i })); const A = [], B = []; for (;;) { const a = qu.take(); if (!a) break; A.push(a.id); const b = qu.take(); if (!b) break; B.push(b.id); } return [A.length, B.length, new Set([...A, ...B]).size, ids[99]]; })()`, an: true },
    { goi: `(() => { qu.add('x', { tags: ['a'] }); const j = qu.take(); j.data.tags.push('HACK'); const f = qu.fail(j.id, 'SMTP 421'); const s = qu.getJob('1'); return [f, s.data.tags, s.failedReason, qu.fail('99', 'no'), qu.counts()]; })()`, an: true },
  ],
});

const FAKE_BULK = `// fake-bullmq-queue.js — PROVIDED (loaded before answer.js). Each call is ONE Redis round trip (1 ms).
//   await queue.add(name, data, opts)       → { id }
//   await queue.addBulk([{ name, data, opts }, …]) → [{ id }, …]
//   queue.roundTrips · queue.jobs (everything added, in order)
const queue = {
  roundTrips: 0, jobs: [],
  _rt(v) { queue.roundTrips++; return new Promise((ok) => setTimeout(() => ok(v), 1)); },
  add(name, data, opts) { queue.jobs.push({ name, data, opts }); return queue._rt({ id: String(queue.jobs.length) }); },
  addBulk(list) { const ids = list.map((j) => { queue.jobs.push({ name: j.name, data: j.data, opts: j.opts }); return { id: String(queue.jobs.length) }; }); return queue._rt(ids); },
};
`;

const E4 = jsBai({
  ten: '13.2 · Fan out 50,000 jobs with addBulk', kho: 'MEDIUM', phut: 15,
  en: `<p>“Email all subscribers” means one job per user. An ${c('add()')} loop costs one round trip per job (3,489 jobs/s in the lesson); ${c('addBulk()')} is the pipeline fix (37,249 jobs/s). Write ${c('enqueueDigests(queue, userIds, chunkSize = 1000)')}:</p><ul><li>one job per user: name ${c("'digest'")}, data ${c('{ userId }')} and NOTHING else (no email, no name — the worker re-reads);</li><li>send them with ${c('queue.addBulk()')} in chunks of at most ${c('chunkSize')} — one round trip per chunk;</li><li>resolve to the number of jobs enqueued.</li></ul>`,
  vi: `<p>"Gửi thư cho mọi người đăng ký" là mỗi người một job. Vòng lặp ${c('add()')} tốn mỗi job một vòng đi-về (3.489 job/s trong bài); ${c('addBulk()')} là cách chữa kiểu pipeline (37.249 job/s). Viết ${c('enqueueDigests(queue, userIds, chunkSize = 1000)')}:</p><ul><li>mỗi người một job: tên ${c("'digest'")}, data ${c('{ userId }')} và KHÔNG gì khác (không email, không tên — worker sẽ đọc lại);</li><li>gửi bằng ${c('queue.addBulk()')} theo lô tối đa ${c('chunkSize')} — mỗi lô một vòng đi-về;</li><li>resolve ra số job đã xếp hàng.</li></ul>`,
  yc: [['Math.ceil(n / chunkSize) round trips.', 'Math.ceil(n / chunkSize) vòng đi-về.'], ['job.data is exactly { userId }.', 'job.data đúng bằng { userId }.'], ['No call at all for an empty list.', 'Danh sách rỗng thì không gọi gì.']],
  dauVao: ['queue · userIds — number[] · chunkSize — number', 'queue · userIds — number[] · chunkSize — số'],
  dauRa: ['Promise<number>', 'Promise<number>'],
  goiY: [['for (let i = 0; i < userIds.length; i += chunkSize) await queue.addBulk(userIds.slice(i, i + chunkSize).map(…));', 'for (let i = 0; i < userIds.length; i += chunkSize) await queue.addBulk(userIds.slice(i, i + chunkSize).map(…));'], ['Each element: { name: \'digest\', data: { userId } }.', 'Mỗi phần tử: { name: \'digest\', data: { userId } }.']],
  loi: [['A for…await queue.add() loop: 50,000 round trips (~14 s) for the enqueue alone.', 'Vòng for…await queue.add(): 50.000 vòng đi-về (~14 s) chỉ riêng để xếp hàng.'], ['One addBulk of all 50,000: a single giant command that blocks Redis for everyone else.', 'Một addBulk cả 50.000: một lệnh khổng lồ chặn Redis với mọi người khác.'], ['Putting the user object in data: 50,000 copies of personal data in Redis, all stale by the time the last job runs.', 'Đặt cả đối tượng user vào data: 50.000 bản dữ liệu cá nhân trong Redis, tất cả đã cũ khi job cuối chạy.']],
  gt: ['addBulk is chapter 12.1 again: the cost is the round trip, so batching removes the waiting, and chunks keep each batch from monopolising Redis. Ids-only payloads keep the backlog small (≈250 bytes per job) and the data fresh.', 'addBulk lại là chương 12.1: cái giá là vòng đi-về, nên gom lô bỏ được phần chờ, còn chia lô giữ cho mỗi lô không độc chiếm Redis. Payload chỉ có id giữ tồn đọng nhỏ (≈250 byte mỗi job) và dữ liệu luôn mới.'],
  kn: ['addBulk', 'fan-out'], tns: [tn('addBulk', 'thêm hàng loạt', 'nhiều job trong một lệnh, một vòng đi-về'), tn('fan-out', 'toả việc', 'một việc lớn tách thành nhiều job nhỏ độc lập')],
  gia: { 'fake-bullmq-queue.js': FAKE_BULK },
  dau: `/** One 'digest' job per user, enqueued efficiently. */
async function enqueueDigests(queue, userIds, chunkSize = 1000) {
  // Write your solution here
  for (const userId of userIds) await queue.add('digest', { userId, kind: 'weekly' });
  return userIds.length;
}
`,
  giai: `/** One 'digest' job per user, enqueued in chunks with addBulk (one round trip per chunk). */
async function enqueueDigests(queue, userIds, chunkSize = 1000) {
  let n = 0;
  for (let i = 0; i < userIds.length; i += chunkSize) {
    const chunk = userIds.slice(i, i + chunkSize);                         // bounded batch
    await queue.addBulk(chunk.map((userId) => ({ name: 'digest', data: { userId } })));   // ids only
    n += chunk.length;
  }
  return n;
}
`,
  chung: `const ids = (n) => Array.from({ length: n }, (_, i) => i + 1);`,
  cases: [
    { goi: `[await enqueueDigests(queue, ids(2500)), queue.roundTrips, queue.jobs[2499].name, queue.jobs[2499].data]`, moTa: ['2,500 users, chunk 1,000 → 3 round trips', '2.500 người, lô 1.000 → 3 vòng đi-về'] },
    { goi: `[await enqueueDigests(queue, ids(7), 3), queue.roundTrips, queue.jobs.map((j) => j.data.userId)]`, moTa: ['7 users, chunk 3 → 3 round trips, order kept', '7 người, lô 3 → 3 vòng đi-về, giữ thứ tự'] },
    { goi: `[await enqueueDigests(queue, []), queue.roundTrips]`, moTa: ['Nothing to enqueue → no call', 'Không có gì → không gọi'] },
    { goi: `[await enqueueDigests(queue, ids(50000)), queue.roundTrips, queue.jobs.every((j) => j.name === 'digest' && Object.keys(j.data).join() === 'userId')]`, an: true },
    { goi: `[await enqueueDigests(queue, ids(1000), 1000), queue.roundTrips]`, an: true },
  ],
});

const E5 = jsBai({
  ten: '13.2 · Lint a job payload before it goes into Redis', kho: 'EASY', phut: 10,
  en: `<p>${c('job.data')} is a JSON string in Redis: it counts against maxmemory, anyone with ${c('redis-cli')} can read it, and without ${c('removeOnComplete')} it is still there next week. Write ${c('checkPayload(data)')} that returns the list of problems, in this order:</p><ol><li>${c("'too-big'")} if ${c('JSON.stringify(data).length > 1024')};</li><li>${c("'secret:<key>'")} for every key, at any depth, whose name matches ${c('/password|token|secret|apikey|card/i')} (in the order found, depth-first);</li><li>${c("'object:<key>'")} for every TOP-level key whose value is a plain object (not an array, not null) — send an id, let the worker fetch the rest.</li></ol><p>A clean payload returns ${c('[]')}.</p>`,
  vi: `<p>${c('job.data')} là một chuỗi JSON trong Redis: nó tính vào maxmemory, ai có ${c('redis-cli')} cũng đọc được, và không có ${c('removeOnComplete')} thì tuần sau nó vẫn còn đó. Viết ${c('checkPayload(data)')} trả về danh sách vấn đề, theo thứ tự:</p><ol><li>${c("'too-big'")} nếu ${c('JSON.stringify(data).length > 1024')};</li><li>${c("'secret:<khoá>'")} cho mọi khoá, ở mọi độ sâu, có tên khớp ${c('/password|token|secret|apikey|card/i')} (theo thứ tự gặp, đi sâu trước);</li><li>${c("'object:<khoá>'")} cho mọi khoá CẤP NGOÀI CÙNG có giá trị là object thường (không phải mảng, không null) — gửi id, để worker tự lấy phần còn lại.</li></ol><p>Payload sạch trả ${c('[]')}.</p>`,
  yc: [['Problems in the order given; secrets found at any depth.', 'Vấn đề theo đúng thứ tự; khoá bí mật tìm ở mọi độ sâu.'], ['Arrays are not “objects” for rule 3, but are searched for secrets.', 'Mảng không tính là "object" ở luật 3, nhưng vẫn được dò khoá bí mật.'], ['Do not modify data.', 'Không sửa data.']],
  dauVao: ['data — any JSON value (usually an object)', 'data — giá trị JSON bất kỳ (thường là object)'],
  dauRa: ['string[]', 'string[]'],
  goiY: [['A recursive walk(value): if Array → walk each element; if object → for each [k, v]: test k, then walk(v).', 'Một hàm đệ quy walk(value): nếu Array → walk từng phần tử; nếu object → với mỗi [k, v]: kiểm k, rồi walk(v).'], ['Rule 3 is a separate loop over Object.entries(data) with v && typeof v === \'object\' && !Array.isArray(v).', 'Luật 3 là một vòng riêng trên Object.entries(data) với v && typeof v === \'object\' && !Array.isArray(v).']],
  loi: [['typeof v === \'object\' alone: null and arrays are flagged as objects.', 'Chỉ typeof v === \'object\': null và mảng bị coi là object.'], ['Checking secrets only at the top level: { user: { passwordHash } } slips through.', 'Chỉ dò khoá bí mật ở cấp ngoài: { user: { passwordHash } } lọt qua.']],
  gt: ['The lesson’s rule — put an id in the job and let the worker fetch the rest — fixes three problems at once: memory (≈250 bytes a job), exposure (job.data is readable and survives completion) and staleness (a ten-minute-old snapshot emails an old address). A check like this one can run in the producer before every add().', 'Quy tắc của bài — đặt id vào job và để worker tự lấy phần còn lại — chữa ba vấn đề một lúc: bộ nhớ (≈250 byte một job), lộ lọt (job.data đọc được và sống qua khi xong) và dữ liệu cũ (ảnh chụp mười phút trước gửi thư tới địa chỉ cũ). Một phép kiểm như thế này có thể chạy ở phía gửi trước mọi lần add().'],
  kn: ['job payload'], tns: [tn('payload', 'dữ liệu mang theo', 'job.data — chuỗi JSON nằm trong Redis')],
  dau: `/** What is wrong with this job.data? */
function checkPayload(data) {
  // Write your solution here
  const problems = [];
  if (JSON.stringify(data).length > 1024) problems.push('too-big');
  for (const k of Object.keys(data)) if (/password|token|secret|apikey|card/i.test(k)) problems.push('secret:' + k);
  return problems;
}
`,
  giai: `/** What is wrong with this job.data? */
function checkPayload(data) {
  const problems = [];
  if (JSON.stringify(data).length > 1024) problems.push('too-big');      // counts against maxmemory
  const SECRET = /password|token|secret|apikey|card/i;
  (function walk(v) {                                                     // depth-first, any depth
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) {
        if (SECRET.test(k)) problems.push('secret:' + k);                  // readable by anyone with redis-cli
        walk(x);
      }
    }
  })(data);
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    for (const [k, x] of Object.entries(data)) {
      if (x && typeof x === 'object' && !Array.isArray(x)) problems.push('object:' + k);   // send an id instead
    }
  }
  return problems;
}
`,
  cases: [
    { goi: `checkPayload({ userId: 42 })`, moTa: ['An id only: clean', 'Chỉ một id: sạch'] },
    { goi: `checkPayload({ user: { id: 42, email: 'an@x.vn', passwordHash: '$argon2…' }, resetToken: 'abc' })`, moTa: ['A whole user with a hash + a token', 'Cả đối tượng user kèm hash + một token'] },
    { goi: `checkPayload({ noteIds: [1, 2, 3], html: 'x'.repeat(2000) })`, moTa: ['A 2 KB body: too big (arrays are fine)', 'Nội dung 2 KB: quá lớn (mảng thì được)'] },
    { goi: `checkPayload({ items: [{ sku: 'A', cardNumber: '4111' }], meta: null, apiKey: 'k', order: { id: 7 } })`, an: true },
    { goi: `[checkPayload({ a: { b: { c: { secretSauce: 1 } } } }), checkPayload({ tags: ['x'], n: 1 })]`, an: true },
  ],
});

export default modul('nodejs-13-2-bullmq-co-ban', '13.2 BullMQ: what a job is, addBulk, concurrency, payloads', [E1, E2, E3, E4, E5]);
