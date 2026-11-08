/**
 * node-13-2 — Node.js · Chapter 13 · Lesson 13.2 "BullMQ: Queue, Worker, and what a job is in Redis" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, MỘT tập node-13-2 (19 slide).
 *   từ 12.5 sang BullMQ · ba đối tượng · producer + worker · vì sao tiến trình riêng · mở hộp (thật: DBSIZE 1 → 6, hash + list wait + stream events, 216 B) ·
 *   đời một job · noeviction (thật: allkeys-lru ⇒ cảnh báo, 18.118/20.000 job không bao giờ chạy, bộ đếm id bị xoá) · giá mỗi job (thật: 2.474 vs 44.011 job/s, 17,8×, ~202 B) ·
 *   concurrency I/O (thật: 40.540,1 → 471,6 ms, 86×) · CPU (thật: 5.929,6 / 5.707,5 / 5.755,8 ms) · cách chữa (thật: sandboxed 4 = 1.667,0 ms, worker threads 2.325,8) ·
 *   hai worker (thật: 50/50, trùng 0) · đặt tên · payload (thật: job "béo" gửi địa chỉ cũ + lộ token) · website (thật: 19 gói, 16 MB, luxon 4,5 MB) · bài tập · tóm tắt.
 * Nguồn: nodejs-13-2-bullmq-co-ban. Output THẬT: that/c13/{inside,eviction,cost,concurrency,two-workers,payload,pkgsize} (Node 22.23.3, BullMQ 6.7.2, ioredis 6.0.0,
 *   Redis 7.4.9 Docker `node13-redis` 127.0.0.1:4880 noeviction + `node13-lru` 127.0.0.1:4885 maxmemory 3mb allkeys-lru, đã gỡ).
 * Khác web: DBSIZE +5 khoá (web +6: "meta" có sẵn từ khi tạo Queue) · add() 2.474 job/s (web 3.489) · addBulk 44.011 (web 37.249) ⇒ 17,8× (web 11×) · ~202 B/job (web ~250) ·
 *   I/O 86× (web 81×) · BullMQ 6.7.2: 19 gói, 16 MB (web 22 gói, 13 MB) · bổ sung: allkeys-lru đo thật, sandboxed processor đo thật, job "béo" đo thật.
 */
import { lamDeck, two, box, cards, flow, bang, J, TT, T, G, thanh, dong, ra } from './_c9-chung.mjs';

export const deck = { key: 'node-13-2', code: 'NODE 13.2', title: 'BullMQ: Queue, Worker, and what a job is in Redis', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c13/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const C = { one: num(R('cost', /^add\(\)/), /-> ([\d,]+) jobs/), bulk: num(R('cost', /^addBulk/), /-> ([\d,]+) jobs/), x: num(R('cost', /^addBulk/), /\(([\d.]+)x/), b: num(R('cost', /bytes per job/), /~(\d+) bytes/), mb: num(R('cost', /waiting jobs =/), /= ([\d.]+) MB/) };
const IO = [1, 5, 20, 50, 100].map((c, i) => [c, num(ra('c13/concurrency', 3 + i, 3 + i), /:\s+([\d.]+) ms/)]);
const CPU = [1, 10, 50].map((c, i) => [c, num(ra('c13/concurrency', 10 + i, 10 + i), /:\s+([\d.]+) ms/)]);
const SB = { c4: num(R('concurrency', /child processes\), concurrency 4/), /:\s+([\d.]+) ms/), wt: num(R('concurrency', /useWorkerThreads/), /:\s+([\d.]+) ms/) };
const EV = { never: num(R('eviction', /will never run/), /=> (\d+) of/) };
const fmt = (x) => x.toLocaleString('en-US');

const doiSvg = `<svg data-k="doi" viewBox="0 0 1100 290" width="1100" height="290" font-family="Arial">
<defs><marker id="m2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
<path d="M1010,128 C1010,12 300,12 112,116" stroke="${TIM}" stroke-width="2.5" stroke-dasharray="7 6" fill="none" marker-end="url(#m2)"/><text x="560" y="30" text-anchor="middle" font-size="17" fill="${TIM}">when its time comes</text>
<rect x="10" y="120" width="200" height="90" rx="14" fill="${LAM}14" stroke="${LAM}" stroke-width="3"/><text x="110" y="158" text-anchor="middle" font-size="24" font-weight="700" fill="${LAM}">wait</text><text x="110" y="188" text-anchor="middle" font-size="17" fill="#555">a LIST of ids</text>
<rect x="300" y="120" width="230" height="90" rx="14" fill="${CAM}14" stroke="${CAM}" stroke-width="3"/><text x="415" y="158" text-anchor="middle" font-size="24" font-weight="700" fill="${CAM}">active</text><text x="415" y="188" text-anchor="middle" font-size="17" fill="#555">+ a LOCK with a TTL</text>
<rect x="640" y="56" width="220" height="90" rx="14" fill="${NODE}14" stroke="${NODE}" stroke-width="3"/><text x="750" y="94" text-anchor="middle" font-size="24" font-weight="700" fill="${NODE}">completed</text><text x="750" y="124" text-anchor="middle" font-size="17" fill="#555">returnvalue kept</text>
<rect x="640" y="190" width="220" height="90" rx="14" fill="${DO}14" stroke="${DO}" stroke-width="3"/><text x="750" y="228" text-anchor="middle" font-size="24" font-weight="700" fill="${DO}">failed</text><text x="750" y="258" text-anchor="middle" font-size="17" fill="#555">failedReason kept</text>
<rect x="930" y="130" width="160" height="90" rx="14" fill="${TIM}14" stroke="${TIM}" stroke-width="3"/><text x="1010" y="168" text-anchor="middle" font-size="22" font-weight="700" fill="${TIM}">delayed</text><text x="1010" y="198" text-anchor="middle" font-size="16" fill="#555">a sorted set</text>
<line x1="212" y1="165" x2="294" y2="165" stroke="#b85a2b" stroke-width="3" marker-end="url(#m2)"/><text x="253" y="152" text-anchor="middle" font-size="15" fill="#555">pop</text>
<line x1="532" y1="150" x2="634" y2="104" stroke="#b85a2b" stroke-width="3" marker-end="url(#m2)"/><line x1="532" y1="180" x2="634" y2="230" stroke="#b85a2b" stroke-width="3" marker-end="url(#m2)"/>
<path d="M862,235 C905,235 905,215 925,200" stroke="#b85a2b" stroke-width="3" fill="none" marker-end="url(#m2)"/><text x="903" y="262" text-anchor="middle" font-size="15" fill="#555">retry later</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 13 — Background jobs and queues', bai: '13.2' }, [
  { cover: true, t: 'BullMQ: Queue, Worker,<br>and what a job is in Redis', sub: 'Three objects are the whole API. Open the box and a job turns out to be a hash, an id in a list and a few events — the primitives you measured in chapter 12.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The three objects of BullMQ — and why the worker lives in its own process</li>
<li>Open the box: one job, key by key, in a real Redis</li>
<li>The one Redis setting a queue cannot live without</li>
<li>The price of a job, and the concurrency measurement that decides your architecture</li>
<li>Two workers, one queue · naming queues · what to put in job.data</li>
</ul>` + box('Why it matters to you', 'Lesson 13.1 showed WHY work leaves the request. This lesson is HOW — and the two numbers you will size every queue with.', 'lam') },

  { t: 'From lesson 12.5 to a library', to: true, giua: true, body: flow([
    { t: 'XADD', s: 'write the job', mau: DO }, { t: 'consumer group', s: 'share the work', mau: DO }, { t: 'XACK · PENDING', s: 'prove it was done', mau: DO }, { t: 'XAUTOCLAIM', s: 'rescue a dead worker', mau: DO }], { h: 120 }) +
    two(J(`// 12.5, by hand
await redis.xadd('jobs', '*', 'job', 'thumb-7');
// + XREADGROUP, XACK, XAUTOCLAIM loops…`, { sm: false, hl: [2] }), J(`// 13.2, with BullMQ
await queue.add('thumb', { docId: 7 });
// the worker loop is written for you`, { sm: false, hl: [2] })) +
    two(box('12.5 built it by hand', 'Streams, groups and claiming — and ended by saying most teams should not maintain that themselves.', 'cam'),
      box('BullMQ packages the same idea', 'A library, NOT a server: no daemon, no broker. The queue lives entirely in Redis, in structures you already know.', 'xanh')) },

  { t: 'Three objects, and that is the whole API', to: true, giua: true, body: cards([
    ['📮 Queue', 'The SENDING side. queue.add(name, data, opts). Lives inside your web process.'],
    ['🛠 Worker', 'The WORKING side. new Worker(name, handler, opts). Should live in a SEPARATE process.'],
    ['📄 Job', 'A record in Redis: the data, the options, the attempt count, the return value, the failure reason.'],
  ], 3) + flow([{ t: 'web process', s: "queue.add('welcome', …)", mau: NODE }, { t: 'Redis', s: 'bull:email:*', mau: DO }, { t: 'worker process', s: 'handler(job)', mau: LAM }], { h: 120 }) + box('Same name on both sides', 'The Queue and the Worker meet only through the queue NAME and the Redis connection. They never call each other.', 'lam') },

  { t: 'The code: a producer and a worker', to: true, giua: true, body: J(`// producer.js — inside the web process
import { Queue } from 'bullmq';
const emailQueue = new Queue('email', { connection: { host: '127.0.0.1', port: 6379 } });
await emailQueue.add('welcome', { userId: 42 });

// worker.js — A SEPARATE PROCESS: node worker.js
import { Worker } from 'bullmq';
new Worker('email', async (job) => {
  const user = await db.user.findUnique({ where: { id: job.data.userId } });
  await sendWelcomeEmail(user.email);
  return { sentAt: new Date().toISOString() };      // stored as job.returnvalue
}, { connection: { host: '127.0.0.1', port: 6379 }, concurrency: 10 });`, { sm: false, hl: [4, 7, 10] }) +
    two(box('return → job.returnvalue', 'Whatever the handler returns is saved on the job — the status endpoint of 13.1 reads it.', 'xanh'), box('throw → job.failedReason', 'An exception marks the attempt as failed. Whether it is retried is lesson 13.3.', 'do2')) },

  { t: 'Why the worker gets its own process', to: true, giua: true, body: flow([
    { t: 'web × 2', s: 'answers HTTP', mau: NODE }, { t: 'Redis', s: 'the queue', mau: DO }, { t: 'worker × 6', s: 'does the jobs', mau: LAM }], { h: 120 }) +
    two(box('A shared event loop is a shared problem', 'A worker inside the web process shares its event loop: a heavy job adds latency to EVERY HTTP request — the block lesson 2.4 measured.', 'do2'),
      box('Scale each side on its own', 'Two web containers and six workers during a backlog — or the reverse at peak traffic. No code change, just more processes.', 'xanh')) +
    box('And a crash stays a crash of ONE side', 'A worker that dies on job 4,000 does not take the API down with it; a deploy of the API does not cut a running job (lesson 13.5).', 'lam') },

  { t: 'Open the box: one job in a real Redis', to: true, giua: true, body: TT('c13/inside', 2, 17, 'node inside.mjs · BullMQ 6.7.2 · an empty Redis database · real', { hl: [2, 7, 13], n: 104, sm: true }) +
    box('That is the entire magic trick', 'A job is a HASH holding your data plus bookkeeping; its id sits in a LIST called wait; every change is an EVENT in a stream. All of it chapter 12.', 'xanh') },

  { t: 'The life of a job', to: true, giua: true, body: doiSvg + two(
    box('What the worker does', 'Blocking-pops an id from wait, moves it to active, takes a LOCK, runs your function, then moves it to completed or failed.', 'lam'),
    box('Every step is chapter 12', 'List pop (12.5) · a lock with a TTL (12.4) · a sorted set for delays (12.3, lesson 13.4) · a stream of events (12.5).', 'cam')) },

  { t: 'The one Redis setting a queue needs: noeviction', to: true, giua: true, body: TT('c13/eviction', 2, 8, 'node eviction.mjs · a Redis set up like a CACHE: maxmemory 3mb, allkeys-lru · one run (numbers vary, the outcome does not) · real', { hl: [2, 5, 7], n: 112, sm: true }) +
    J(`# docker-compose.yml of this website, line 91 — a CACHE Redis: do not put BullMQ on it
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru --appendonly yes`, { sm: true, hl: [2] }) +
    two(box('Your jobs are evicted like cache entries', `${fmt(EV.never)} of 20,000 jobs will never run. Even the id counter was evicted, so ids started again from 1 and new jobs overwrote old ones.`, 'do2'),
      box('maxmemory-policy noeviction', 'The setting lesson 12.6 called dangerous for a cache is REQUIRED for a queue: Redis refuses writes instead of silently dropping work.', 'xanh')) },

  { t: 'The price of a job', to: true, giua: true, body: TT('c13/cost', 2, 4, 'node cost.mjs · median of 5 runs · real', { hl: [2], n: 104, sm: false }) +
    thanh([['add() in a loop', C.one, DO, `${fmt(C.one)} jobs/s`], ['addBulk()', C.bulk, NODE, `${fmt(C.bulk)} jobs/s`]], { w: 1100, x0: 250, wMax: 600, h0: 58, chu: 22, ghi: 'jobs per second · real' }) +
    two(box(`addBulk: ${C.x}× faster`, 'Each add() is a round trip (lesson 12.1); addBulk is the pipeline fix. Any fan-out — "email all 50,000 subscribers" — uses addBulk, in chunks.', 'xanh'),
      box(`~${C.b} bytes per waiting job`, `1,000,000 waiting jobs ≈ ${Math.round(C.b * 1e6 / 1048576)} MB. This site's Redis has a 256 MB ceiling. A backlog is not free storage.`, 'cam')) },

  { t: 'Concurrency with a job that WAITS', to: true, giua: true, body: TT('c13/concurrency', 3, 7, 'node concurrency.mjs · 200 jobs, each awaits 200 ms of I/O · real', { hl: [1, 5], n: 104, sm: false }) +
    thanh(IO.map(([c, ms]) => [`concurrency ${c}`, ms, c === 1 ? DO : c < 50 ? CAM : NODE, `${fmt(ms)} ms`]), { log: true, w: 1100, x0: 250, wMax: 600, h0: 44, chu: 20, ghi: 'time for 200 jobs · log scale · real' }) +
    box(`Nearly linear: ${Math.round(IO[0][1] / IO[4][1])}× from 1 to 100`, 'While one job waits on the network, the event loop starts the next. This is what concurrency is for.', 'xanh') },

  { t: 'Concurrency with a job that COMPUTES', to: true, giua: true, body: TT('c13/concurrency', 9, 12, 'node concurrency.mjs · 100 jobs, each burns ~60 ms of CPU (pbkdf2) · real', { hl: [2, 3, 4], n: 104, sm: false }) +
    thanh(CPU.map(([c, ms]) => [`concurrency ${c}`, ms, DO, `${fmt(ms)} ms`]), { w: 1100, x0: 250, wMax: 600, h0: 52, chu: 21, ghi: 'time for 100 CPU jobs · real' }) +
    box('Zero improvement — not "less"', 'concurrency means "how many jobs are IN FLIGHT in this worker". In flight is not parallel: it is still ONE event loop. Chapter 2 arriving with the bill.', 'do2') },

  { t: 'The real fixes for CPU work: more processes', to: true, giua: true, body: J(`// point the worker at a FILE: BullMQ runs it in child processes
const worker = new Worker('thumbnails', path.join(import.meta.dirname, 'thumb-processor.mjs'), {
  connection, concurrency: 4,                 // up to 4 jobs, 4 processes
});`, { sm: false, hl: [2, 3] }) +
    TT('c13/concurrency', 14, 17, 'node concurrency.mjs · the same 100 CPU jobs · real', { hl: [3], n: 104, sm: false }) +
    cards([['sandboxed processor', `a file, child processes: ${fmt(SB.c4)} ms`], ['worker threads', `useWorkerThreads: ${fmt(SB.wt)} ms`], ['more worker processes', 'node worker.js × N, or containers']], 3) },

  { t: 'Two workers, one queue: does a job run twice?', to: true, giua: true, body: TT('c13/two-workers', 2, 2, 'node two-workers.mjs · two worker PROCESSES, 100 jobs · real', { hl: [1], n: 118, sm: true }) +
    flow([{ t: '100 jobs', s: 'one wait list', mau: LAM }, { t: 'blocking pop', s: 'one id → one worker', mau: DO }, { t: 'per-job lock', s: 'nobody else takes it', mau: CAM }, { t: 'A: 50 · B: 50', s: 'duplicates 0', mau: NODE }], { h: 120 }) +
    two(box('Scale by starting processes', 'No coordination, no configuration, no leader election. More workers = more throughput.', 'xanh'),
      box('Not a broadcast', 'Each job goes to exactly ONE worker — the opposite of Pub/Sub (12.5), where every listener gets every message.', 'lam')) },

  { t: 'One queue per KIND of work', to: true, giua: true, body: J(`// one queue per KIND of work, not one queue for everything
new Queue('email');     // send mail
new Queue('media');     // thumbnails, video compression
new Queue('search');    // rebuild the index

// WITHIN one queue, branch on the job name
await emailQueue.add('welcome', { userId: 42 });
await emailQueue.add('password-reset', { userId: 42, token });`, { sm: false, hl: [1, 6] }) +
    two(box('Why separate queues', 'A 30-second video job must not starve a password-reset email. They need different concurrency, limiters and urgency.', 'cam'),
      box('Why job names', 'Inside one queue, the name is what your handler switches on.', 'lam')) },

  { t: 'What goes in job.data', to: true, giua: true, body: TT('c13/payload', 2, 6, 'node payload.mjs · the user changes their email before the job runs · real', { hl: [1, 4, 5], n: 118, sm: true }) +
    two(box('✗ the whole object', 'A JSON string in Redis: it counts against maxmemory, anyone with redis-cli can read it (a reset token!), and it is a stale snapshot — the email goes to the OLD address.', 'do2'),
      box('✓ an id', 'Put the id in the job and let the worker fetch the rest. Small, nothing secret to leak, and always fresh.', 'xanh')) +
    J(`await emailQueue.add('password-reset', { userId: 42 });          // ✓ the worker loads the user,
const user = await db.user.findUnique({ where: { id: job.data.userId } });  //   creates the token itself`, { sm: true, hl: [1] }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: T(G('c13/pkgsize', 1, 2, 112) + '\n' + G('c13/pkgsize', 8, 9, 112) + '\n' + G('c13/pkgsize', 10, 14, 112), 'a fresh install of bullmq + ioredis in an empty folder · npm 10, Node 22 · real', { hl: [2, 4, 7, 8], sm: true }) +
    two(box('No BullMQ — on purpose', 'src/services/embedQueue.service.ts: one Node process, no horizontal scaling yet. The file says "BullMQ adds 50MB deps"; a fresh install here is 16 MB, luxon alone 4.5 MB.', 'lam'),
      box('What the in-process queue gives up', 'An array plus a _processing flag = concurrency 1. It keeps the latency win of 13.1 and gives up everything above: no second worker, no restart survival, no addBulk, no priority.', 'cam')) },

  { t: 'Exercise', to: true, giua: true, body: flow([{ t: 'media', s: 'sharp · ~80 ms CPU', mau: DO }, { t: 'email', s: 'SMTP · ~300 ms wait', mau: LAM }, { t: 'ONE worker process', s: 'concurrency: 50', mau: CAM }], { h: 110 }) + box('Exercise', 'A queue "media" makes thumbnails with sharp (~80 ms of CPU each) and "email" waits on SMTP (~300 ms each). Both run in one worker process with concurrency: 50. Thumbnails are slow and emails pile up behind them. What do you change — and which number in this lesson predicts the result?', '') +
    `<div data-k="dapan">${box('Answer', `Split them: "email" is I/O — keep it in a worker with high concurrency (the 1 → 100 line: ${Math.round(IO[0][1] / IO[4][1])}×). "media" is CPU — concurrency will not help (${fmt(CPU[0][1])} vs ${fmt(CPU[2][1])} ms); give it a sandboxed processor or more processes (4 processes: ${fmt(SB.c4)} ms). Separate queues so a slow thumbnail never delays an email.`, 'xanh')}</div>` },

  { t: 'BullMQ — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['one job in Redis', 'a hash + an id in "wait" + events, 216 B', 'it is chapter 12, packaged'],
    ['allkeys-lru Redis', `${fmt(EV.never)} / 20,000 jobs never run`, 'a queue needs noeviction'],
    ['add() vs addBulk()', `${fmt(C.one)} → ${fmt(C.bulk)} jobs/s`, 'fan out with addBulk'],
    ['concurrency 1 → 100, I/O', `${fmt(IO[0][1])} → ${fmt(IO[4][1])} ms`, 'helps work that WAITS'],
    ['concurrency 1 → 50, CPU', `${fmt(CPU[0][1])} → ${fmt(CPU[2][1])} ms`, 'CPU needs more processes'],
    ['two worker processes', '50 + 50, duplicates 0', 'scale by starting workers'],
  ], { co: 21 }) + box('Next: 13.3 — failure', 'No retries by default, backoff, and the charge that ran three times.', 'lam') },
]);
