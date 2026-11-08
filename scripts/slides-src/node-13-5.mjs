/**
 * node-13-5 — Node.js · Chapter 13 · Lesson 13.5 "When the worker dies: stalled jobs, deploys and cleanup" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, HAI tập: node-13-5 (slide 1–12) · node-13-5-2 (slide 13–22).
 *   A: ví dụ đời thường (sổ mượn đồ có hạn trả) · phép đo 1 SIGKILL (thật: khoá 2 s ⇒ nhặt lại sau 2.068 ms · mặc định ⇒ 60.070 ms, stalled 1, completed 1) · cơ chế khoá + gia hạn ·
 *      at-least-once cụ thể · phép đo 2 job dài (thật: 1 lần, stalled 0) vs job chặn (thật: "Missing lock for job 1. moveToFinished", chạy 2 lần, stalled 2, failed) ·
 *      phép đo 3 deploy (thật: có SIGTERM 903 ms, làm xong; không ⇒ 2 ms, kẹt active) · mã tắt êm · bảng phần 1.
 *   B: dọn dẹp (thật: 3.000 bản ghi +1,64 MB vs 100 bản +0,13 MB) · defaultJobOptions · năm tín hiệu · endpoint sức khoẻ (thật: waiting 9 → 39, tuổi job cũ nhất 453 → 1.944 ms) ·
 *      bull-board sau admin · Redis sập (thật: add() TREO 15 s cả khi enableOfflineQueue:false; bọc timeout ⇒ 201 fail-open / 503 fail-closed sau ~1 s) · checklist ·
 *      website (embedQueue + recoverPendingJobs THẬT dòng 219–225: hàm giữ chỗ, chưa làm gì) · bài tập · tóm tắt.
 * Nguồn: nodejs-13-5-worker-chet-va-van-hanh. Output THẬT: that/c13/{sigkill,long-block,shutdown,cleanup,health,redis-down} (Node 22.23.3, BullMQ 6.7.2, Redis 7.4.9 Docker).
 * Khác web: nhặt lại 2.068 ms (web 2.036) · mặc định đo thật 60.070 ms (web "tới lockDuration, 30 s") · tắt êm 903 ms (web 1.296) · 3.000 job +1,64 MB (web +3,94) ·
 *   web: "Redis sập ⇒ queue.add() ném lỗi" — thật: TREO (đã sửa web) · web: "cron gọi recoverPendingJobs() xếp lại job kẹt" — thật: hàm giữ chỗ, không có cột embeddingStatus (đã sửa web).
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-13-5', code: 'NODE 13.5', title: 'When the worker dies: stalled jobs, deploys and cleanup', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c13/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const PICK = [...readFileSync(new URL('file:///Users/admin/Documents/video-bai-giang/src/khung/node/that/c13/sigkill.out.txt', import.meta.url), 'utf8').matchAll(/picked the job up (\d+) ms/g)].map((m) => Number(m[1]));
const SD = { ok: num(R('shutdown', /exit 0\)/), /exited (\d+) ms/), cut: num(R('shutdown', /exit SIGTERM/), /exited (\d+) ms/) };
const CL = { all: num(R('cleanup', /NOT cleaned/), /\+([\d.]+) MB/), keep: num(R('cleanup', /removeOnComplete/), /\+([\d.]+) MB/) };
const WEB = readFileSync('/Users/admin/Downloads/api-backend/src/services/embedQueue.service.ts', 'utf8').split('\n');
const fmt = (x) => x.toLocaleString('en-US');

const soSvg = `<svg data-k="so" viewBox="0 0 1100 210" width="1100" height="210" font-family="Arial">
<rect x="10" y="15" width="1080" height="180" rx="16" fill="${LAM}0d" stroke="${LAM}" stroke-width="3"/>
<text x="40" y="95" font-size="60">📋</text>
<text x="130" y="60" font-size="23" font-weight="700" fill="${LAM}">the tool-room sign-out sheet</text>
<text x="130" y="96" font-size="20" fill="#444">"drill #3 — An — return by 10:30". While working, An comes back to extend it.</text>
<text x="130" y="128" font-size="20" fill="#444">An goes home sick: nobody extends it, the line expires, the drill is lent again.</text>
<text x="130" y="172" font-size="21" font-weight="700" fill="${NODE}">= a job lock with a TTL (lockDuration), renewed while working, checked by stalledInterval</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 13 — Background jobs and queues', bai: '13.5' }, [
  // ── PART 1 ──
  { cover: true, t: 'When the worker dies:<br>stalled jobs, deploys<br>and cleanup', sub: 'Workers get deployed over, OOM-killed, rescheduled, or crash on job 4,000 of 10,000. This lesson kills one on purpose, mid-job, and measures what survives.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Measurement 1: SIGKILL in the middle of a job — and how long the job sits stuck</li>
<li>Measurement 2: a long job is fine, a BLOCKING job runs twice and still fails</li>
<li>Measurement 3: the deploy — with and without a SIGTERM handler</li>
<li>Cleanup, the five signals to watch, and a health endpoint</li>
<li>When Redis itself is down, and the production checklist</li>
</ul>` + box('Why it matters to you', 'Every deploy is a small worker death. Whether a job is finished, delayed by a minute or run twice is decided by three settings and one signal handler.', 'lam') },

  { t: 'An everyday picture: the sign-out sheet', to: true, giua: true, body: soSvg + two(
    box('Not lost', 'The drill does not vanish when An goes home: the sheet expires and the drill goes back on the shelf.', 'xanh'),
    box('But not instant either', 'Until 10:30 the drill is "taken" by nobody. And if An was only slow — stuck in a meeting — it gets lent twice.', 'cam')) },

  { t: 'Measurement 1 — SIGKILL in the middle of a job', to: true, giua: true, body: TT('c13/sigkill', 2, 5, 'node sigkill.mjs · run A · lockDuration 2000, stalledInterval 1000 (short, to keep the run short) · real', { hl: [3, 4], n: 104, sm: false }) +
    flow([{ t: 'worker takes job', s: 'active = 1', mau: LAM }, { t: 'SIGKILL', s: 'cannot be caught', mau: DO }, { t: 'stuck in active', s: 'looks like "still working"', mau: CAM }, { t: 'lock expires', s: 'another worker takes it', mau: NODE }], { h: 120 }) +
    box('The job survived the one signal nothing can handle', `Picked up ${fmt(PICK[0])} ms later, completed. But for those seconds nothing in the queue's state said "broken" — it looked exactly like a slow job.`, 'xanh') },

  { t: 'The mechanism: a lock with a TTL, per job', to: true, giua: true, body: J(`new Worker('email', handler, {
  connection,
  lockDuration: 30_000,     // default: the lock on each active job lives 30 s…
                            // …and is RENEWED every lockDuration / 2 while the job runs
  stalledInterval: 30_000,  // default: how often a worker checks for expired locks
  maxStalledCount: 1,       // default: a job may stall once; the 2nd time it FAILS
});`, { sm: false, hl: [3, 5, 6] }) +
    flow([{ t: 'take job', s: 'lock 30 s', mau: LAM }, { t: 'every 15 s', s: 'renew the lock', mau: NODE }, { t: 'worker dies', s: 'no more renewals', mau: DO }, { t: 'check finds it', s: 'back to wait', mau: CAM }], { h: 110 }) +
    two(box('The lock of lesson 12.4, per job', 'Alive worker ⇒ renewed lock. Dead worker ⇒ nobody renews ⇒ the lock expires ⇒ a periodic check moves the job back to wait.', 'lam'),
      box('Log the "stalled" event', 'BullMQ emits "stalled" when it rescues a job. A steady trickle means workers are dying or jobs are blocking. It should be zero.', 'cam')) },

  { t: 'With the default settings: about a minute', to: true, giua: true, body: TT('c13/sigkill', 6, 10, 'node sigkill.mjs · run B · the defaults · real', { hl: [4, 5], n: 104, sm: false }) +
    thanh([['lock 2 s · check 1 s', PICK[0], NODE, `${fmt(PICK[0])} ms`], ['defaults 30 s · 30 s', PICK[1], DO, `${fmt(PICK[1])} ms`]], { w: 1100, x0: 300, wMax: 560, h0: 58, chu: 22, ghi: 'from SIGKILL to "another worker picked the job up" · real' }) +
    box('Up to lockDuration + stalledInterval', 'The lock must expire (up to 30 s) and then a check must run (every 30 s). Measured: one full minute of a job doing nothing — then it runs again.', 'do2') },

  { t: 'At-least-once, made concrete', to: true, giua: true, body: J(`new Worker('email', async (job) => {
  await sendWelcomeEmail(job.data.userId);   // ✓ the email has LEFT
  // 💥 SIGKILL here — the handler never returned, so BullMQ never marked the job completed
}, { connection });`, { sm: false, hl: [3] }) + flow([
    { t: 'the job runs', s: 'the email is SENT', mau: NODE }, { t: 'the worker dies', s: 'before marking it done', mau: DO }, { t: 'lock expires', s: 'the job goes back to wait', mau: CAM }, { t: 'it runs again', s: 'a second email', mau: DO }], { h: 130 }) +
    two(box('This is what 13.3 was about', 'A crash after the work finished but before the acknowledgement means the job runs again. Idempotency is not theory — it is this measurement.', 'cam'),
      box('So every handler must survive running twice', 'A unique key, a claim in one statement, or an idempotency key at the provider (13.3).', 'xanh')) },

  { t: 'Measurement 2 — a LONG job is fine', to: true, giua: true, body: J(`new Worker('lb', async () => {
  await sleep(3000);              // 3 s of waiting: timers, sockets, the database…
}, { connection, lockDuration: 1000 });`, { sm: false, hl: [2] }) +
    TT('c13/long-block', 2, 3, 'node long-block.mjs · two workers on the queue, lockDuration 1 s, stalledInterval 0.5 s · real', { hl: [2], n: 104, sm: false }) +
    flow([{ t: 'await sleep(3000)', s: 'the loop is FREE', mau: NODE }, { t: 'renewal timer', s: 'fires every 500 ms', mau: LAM }, { t: 'lock alive', s: 'no stall, 1 run', mau: NODE }], { h: 110 }) +
    box('Why it is fine', 'The lock-renewal timer runs on the event loop. While the handler AWAITS, the loop is free, the timer fires every 500 ms and the lock never expires. Long is not the problem.', 'xanh') },

  { t: 'A BLOCKING job runs twice — and still fails', to: true, giua: true, body: J(`new Worker('lb', async () => {
  const end = Date.now() + 3000;
  while (Date.now() < end);       // 3 s of pure CPU: the event loop is frozen
}, { connection, lockDuration: 1000 });`, { sm: false, hl: [3] }) +
    TT('c13/long-block', 4, 7, 'node long-block.mjs · the same queue and settings · real', { hl: [2, 4], n: 104, sm: false }) +
    flow([{ t: 'loop frozen', s: 'renewal cannot fire', mau: DO }, { t: 'lock expires', s: 'job declared stalled', mau: CAM }, { t: 'runs again', s: 'stalled twice ⇒ failed', mau: DO }, { t: 'original ends', s: '"Missing lock for job 1"', mau: DO }], { h: 120, fs: 19 }) },

  { t: 'Measurement 3 — the deploy', to: true, giua: true, body: TT('c13/shutdown', 2, 9, 'node shutdown.mjs · SIGTERM arrives 300 ms into a 1.2-second job · real', { hl: [2, 3, 6, 7, 8], n: 104, sm: false }) +
    two(box(`With a handler: ${fmt(SD.ok)} ms`, 'Finished the running job, closed, exited 0. The two waiting jobs stay in Redis for the next worker.', 'xanh'),
      box(`Without: ${fmt(SD.cut)} ms`, 'Killed mid-job. Not lost — the stalled check rescues it — but up to a minute later (measurement 1), and it runs a second time. Multiply by every deploy.', 'do2')) },

  { t: 'Graceful shutdown, in code', to: true, giua: true, body: J(`const worker = new Worker('email', handler, { connection, concurrency: 10 });

const shutdown = async (signal) => {
  logger.info('stopping worker', { signal });
  await worker.close();          // stop taking NEW jobs, wait for running ones
  await queue.close();
  await redis.quit();
  process.exit(0);
};
process.on('SIGTERM', shutdown); // docker stop, a deploy, the orchestrator
process.on('SIGINT', shutdown);  // Ctrl+C on your machine`, { sm: false, hl: [5, 10] }) +
    two(box('Give the platform enough time', 'Docker waits 10 s after SIGTERM, then sends SIGKILL. Jobs of 60 s need stop_grace_period raised — or they are killed mid-shutdown anyway.', 'cam'),
      box('Keep jobs short', 'A job you can finish in a few seconds makes shutdown trivial. A 20-minute job makes every deploy a decision.', 'lam')) },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured', 'the rule'], [
    ['SIGKILL, lock 2 s', `picked up after ${fmt(PICK[0])} ms`, 'jobs are not lost'],
    ['SIGKILL, defaults', `picked up after ${fmt(PICK[1])} ms`, 'but they wait ~1 min, then run again'],
    ['a 3 s job that awaits', '1 run, 0 stalls, completed', 'long is fine'],
    ['a 3 s job that blocks', '2 runs, 2 stalls, failed', 'CPU work: sandbox / threads / processes'],
    ['SIGTERM with a handler', `${fmt(SD.ok)} ms, job finished`, 'worker.close() on SIGTERM'],
    ['SIGTERM without', `${fmt(SD.cut)} ms, job stuck in active`, 'every deploy depends on it'],
  ], { co: 20 }) + box('Part 2', 'Cleanup, what to watch, a health endpoint, a dead Redis, and the production checklist.', 'lam') },

  // ── PART 2 ──
  { t: 'Cleanup, or Redis fills up with your history', to: true, giua: true, body: TT('c13/cleanup', 2, 3, 'node cleanup.mjs · 3,000 tiny jobs · real', { hl: [1, 2], n: 104, sm: false }) +
    thanh([['kept forever (default)', CL.all, DO, `+${CL.all} MB · 3,000 records`], ['removeOnComplete: 100', CL.keep, NODE, `+${CL.keep} MB · 100 records`]], { w: 1100, x0: 320, wMax: 480, h0: 58, chu: 21, ghi: 'Redis RAM after 3,000 finished jobs · real' }) +
    box('Completed jobs are kept FOREVER by default', `3,000 tiny jobs: ${CL.all} MB. At production volume that is how a queue quietly eats a 256 MB Redis and starts refusing writes with "OOM command not allowed" (12.6).`, 'do2') },

  { t: 'Retention on every queue', to: true, giua: true, body: J(`const emailQueue = new Queue('email', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { age: 3600, count: 1000 },   // keep 1 hour OR the last 1000
    removeOnFail: { age: 7 * 24 * 3600 },           // keep FAILED jobs a week
  },
});`, { sm: false, hl: [6, 7] }) +
    two(box('A completed job is a receipt nobody reads', 'Keep a few, for debugging. Trim by age and by count.', 'lam'),
      box('A failed job is evidence', 'Keep it far longer: lesson 13.3 replayed failures straight from the failed set. And remember: cleanup also ends the jobId guard (13.3).', 'cam')) },

  { t: 'What to watch', to: true, giua: true, body: cards([
    ['📈 waiting is climbing', 'THE most important signal: work arrives faster than it leaves. Alert on the TREND, not a number.'],
    ['❌ failed is climbing', 'One failure is routine; a steady rise is an incident.'],
    ['🧟 stalled events', 'Workers dying, or a job blocking the event loop. Should be zero.'],
    ['⏳ age of the oldest job', '"The oldest job has waited 40 minutes" says more than "12 are waiting".'],
    ['⏱ processing time', 'Slowly growing = a third party degrading, or your data grew.'],
    ['🔗 the dashboards come later', 'Chapter 15 turns these into metrics and alerts.'],
  ], 3) + box('Alerts worth having on day one', 'waiting has grown for 10 minutes · any failed job in the last 5 minutes on a payment queue · stalled > 0 · the oldest waiting job older than 5 minutes.', 'cam') },

  { t: 'A health endpoint — no library needed', to: true, giua: true, body: J(`app.get('/health/queues', async (req, res) => {
  const counts = await emailQueue.getJobCounts('waiting', 'active', 'failed', 'delayed');
  const [oldest] = await emailQueue.getWaiting(0, 0);
  res.json({ ...counts, oldestWaitingAgeMs: oldest ? Date.now() - oldest.timestamp : 0 });
});`, { sm: false, hl: [2, 4] }) +
    TT('c13/health', 2, 5, 'node health.mjs · 20 jobs/s arrive, the worker manages ~10/s · real', { hl: [4], n: 110, sm: true }) +
    box('This is what "falling behind" looks like', 'waiting grows by ~10 every second and the oldest job gets older every second. No error anywhere — only these two numbers.', 'cam') },

  { t: 'A dashboard — behind the admin check', to: true, giua: true, body: J(`import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter().setBasePath('/admin/queues');
createBullBoard({ queues: [new BullMQAdapter(emailQueue)], serverAdapter });
app.use('/admin/queues', requireAuth, requireRole('ADMIN'), serverAdapter.getRouter());`, { sm: false, hl: [7] }) +
    flow([{ t: 'browser', s: '/admin/queues', mau: LAM }, { t: 'requireAuth', s: 'who are you?', mau: CAM }, { t: "requireRole('ADMIN')", s: 'are you allowed?', mau: DO }, { t: 'bull-board', s: 'jobs + retry buttons', mau: NODE }], { h: 110 }) +
    two(box('What it gives you', 'Every queue, every failed job with its stack trace, and a retry button.', 'xanh'),
      box('Why it must sit behind 8.3', 'It shows job.data (ids, maybe more) and it can RE-RUN work — a payment, a mass email.', 'do2')) },

  { t: 'When Redis itself is down', to: true, giua: true, body: TT('c13/redis-down', 2, 6, 'node redis-down.mjs · nothing listens on the Redis port · the client gives up after 15 s · real', { hl: [1, 2, 4, 5], n: 104, sm: false }) +
    J(`const withTimeout = (p, ms) => Promise.race([p,
  new Promise((_, rej) => setTimeout(() => rej(new Error('queue timeout')), ms))]);
try { await withTimeout(emailQueue.add('welcome', { userId }), 1000); }
catch (err) { logger.warn('welcome email not queued', err); }        // fail OPEN`, { sm: true, hl: [3, 4] }) +
    two(box('add() does not throw — it HANGS', 'BullMQ waits for the connection to come back. Your request hangs with it — even with enableOfflineQueue: false.', 'do2'),
      box('Decide per queue, with a timeout', 'Welcome email: fail OPEN (201, log it). Payment: fail CLOSED (503, nothing charged). The rate limiter\'s choice in 12.4.', 'xanh')) },

  { t: 'The checklist before a queue goes to production', to: true, giua: true, body: cards([
    ['1 · a dedicated Redis, noeviction', 'Not the cache Redis with allkeys-lru: it evicts your jobs (13.2).'],
    ['2 · workers in their own process', 'No shared event loop with the web tier; scale each side alone.'],
    ['3 · attempts + backoff + idempotent', 'All three, not one of three (13.3).'],
    ['4 · SIGTERM closes the worker', 'Every single deploy depends on it.'],
    ['5 · removeOnComplete / removeOnFail', 'Unset, Redis grows until it refuses writes.'],
    ['6 · alerts on waiting and failed', 'Queues fail SILENTLY — that is their failure mode.'],
  ], 3) + box('And decide what happens when Redis is down', 'The queue is a second system that fails on its own schedule: a timeout around add(), fail open or closed per queue — never a signup that hangs.', 'lam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: J([...WEB.slice(12, 16), '', ...WEB.slice(218, 225)].join('\n'), { sm: false, hl: [1, 2, 9, 10] }) +
    two(box('The bill comes due here', 'In-process queue: no lock, no stalled check, no second worker. A deploy in the middle of an embedding loses that job outright.', 'do2'),
      box('The safety net is a placeholder', 'recoverPendingJobs() runs at boot (cron.service.ts), but it is a no-op: there is no embeddingStatus column yet. The mitigation in the comment is a plan, not code.', 'cam')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A worker resizes uploaded videos with a CPU-heavy loop (about 40 s per video), concurrency 2, default lockDuration. In production you see "Missing lock for job …" errors, some videos are processed twice, and every deploy leaves a few jobs stuck for a minute. Explain all three symptoms and fix them.', '') +
    `<div data-k="dapan">${box('Answer', 'The loop blocks the event loop longer than the lock lives, so renewals never fire: the job is declared stalled, run again (processed twice), and the original cannot finish ("Missing lock"). Fix: move the CPU work out of the event loop — a sandboxed processor or ffmpeg in a child process. Deploys: handle SIGTERM with worker.close() and raise stop_grace_period above the longest job, or split videos into shorter jobs. And make the handler idempotent: it WILL run twice someday.', 'xanh')}</div>` },

  { t: 'When the worker dies — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['SIGKILL mid-job', `rescued after ${fmt(PICK[0])} / ${fmt(PICK[1])} ms`, 'not lost, but late — and run again'],
    ['a blocking job', '2 runs, then failed', 'never block the loop in a handler'],
    ['the deploy', `${fmt(SD.ok)} ms vs ${fmt(SD.cut)} ms`, 'worker.close() on SIGTERM'],
    ['3,000 finished jobs', `+${CL.all} MB vs +${CL.keep} MB`, 'retention on every queue'],
    ['Redis down', 'add() hangs 15 s+', 'a timeout + fail open / closed'],
    ['falling behind', 'waiting 9 → 39 in 3 s', 'alert on the trend + the oldest job'],
  ], { co: 21 }) + box('Next: Chapter 14 — testing', 'Three kinds of tests, measured — and the bug that survives 100 % coverage.', 'lam') },
]);
