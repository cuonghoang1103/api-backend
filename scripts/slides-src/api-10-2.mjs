/**
 * api-10-2 — API Design · Chapter 10 · Lesson 10.2 "Queues and workers" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s10-bat-dong-bo.mjs › api-10-1-worker. Output = chạy thật BullMQ 6.3.16 trên Redis 8.2.2, kill -9 / SIGTERM worker.
 */
import { lamDeck, sql, http, two, box, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 10 — Async and realtime', bai: '10.2' };

export const deck = { key: 'api-10-2', code: 'API 10.2', title: 'Queues and workers', sub: 'Where an asynchronous job really runs' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Queues and workers', sub: 'A 202 is a promise —<br>keep it when processes die.' },

  { t: 'A promise that dies with the process', giua: true, body: http(`$ curl … -X POST …/v2/exports --json '{"labId":"lab_4",…}'
202 /v2/jobs/job_1
$ sleep 2; curl -s …/v2/jobs/job_1 | jq -c '{status, progress}'
{"status":"running","progress":{"done":3500,"total":20000,"percent":17}}
$ bash srv.sh labflow-ch10 4000 LABFLOW_JOBS=memory          # a deploy
$ curl -s …/v2/jobs/job_1 | jq -c '{status, code}'
{"status":404,"code":"JOB_NOT_FOUND"}`, { sm: true, wrap: 'any', title: 'jobs in a Map inside the API process' }) + flow([
    { t: 'API', s: 'queue.add(job) ⇒ 202' },
    { t: 'Redis', s: 'the rail: waiting → active → done', mau: '#c0392b' },
    { t: 'worker', s: 'takes a ticket + a lock', mau: '#7a5195' },
    { t: 'API', s: 'GET /jobs/{id} reads Redis', mau: '#2e7d32' },
  ], { h: 130, fs: 19 }) + box('The restaurant rule', 'An order kept only in the waiter’s head is lost when the waiter goes home. Put the ticket on a rail nobody owns.', 'lam') },

  { t: 'The queue, in code and in Redis', body: sql(`const id = \`job_\${await redis.incr('labflow:job-seq')}\`;
const job = await queue.add(kind, { ...data, owner }, {
  jobId: id,
  attempts: 3, backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: { age: JOB_TTL_SEC }, removeOnFail: { age: JOB_TTL_SEC },
});
// node src/worker.js — another process
const worker = new Worker(QUEUE, async (job, token, signal) => { … }, {
  connection, concurrency: Number(process.env.WORKER_CONCURRENCY ?? 2),
  lockDuration: Number(process.env.WORKER_LOCK_MS ?? 15000), … });`, { lang: 'javascript', sm: true, hl: [4, 10] }) + two(http(`$ redis-cli -p 6390 --scan --pattern 'bull:labflow-jobs:*' | sort
bull:labflow-jobs:events
bull:labflow-jobs:failed
bull:labflow-jobs:job_1
…
$ redis-cli -p 6390 HGET bull:labflow-jobs:job_1 atm
3`, { sm: true, wrap: 'any' }), box('Nothing is magic', 'A job is a Redis hash; states are lists and sorted sets. <code class="i">atm</code> = attempts made.', 'xanh') + box('✗ Never evict', 'A cache Redis with allkeys-lru may silently drop jobs.', 'do2')) },

  { t: 'Retries with backoff, and more workers', giua: true, body: http(`$ grep job_1 worker-w1.log          # ATTENDANCE_DOWN=1
01:34:41.227 [w1] job_1 bắt đầu (lần 1)
01:34:41.491 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: … (đã thử 1)
01:34:43.527 [w1] job_1 bắt đầu (lần 2)
01:34:43.783 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: … (đã thử 2)
01:34:47.877 [w1] job_1 bắt đầu (lần 3)
01:34:48.132 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: … (đã thử 3)`, { sm: true, wrap: 'any' }) + two(box('Backoff 2 s → 4 s', 'Attempt 2 started 2.0 s after the first failure, attempt 3 4.1 s after the second. Only then the client sees <b>failed</b> + error.detail. Every attempt repeats the work ⇒ it must be safe to run twice.', 'lam'), http(`$ node perf/many-jobs.mjs 6     # one worker
6 việc nhận 202 trong 63 ms
⇒ 6 việc xong sau 30.9 s
# three workers
6 việc nhận 202 trong 52 ms
⇒ 6 việc xong sau 10.4 s`, { sm: true, wrap: 'any' })) },

  { t: 'When a worker dies — and when it is told to stop', giua: true, body: two(http(`$ cat worker-w1.log worker-w2.log
01:07:04.272 [w1] job_1 bắt đầu (lần 1)
01:07:38.587 [w2] job_1 bắt đầu (lần 1, đã bị bỏ dở 1 lần)
01:07:48.804 [w2] job_1 xong: 1086381 byte`, { sm: true, wrap: 'any', title: 'kill -9 w1 at 4 s (37%), then start w2' }) + box('Recovery ≈ 34 s, from 0%', 'The lock (15 s) must expire and the stalled check must run. A stall is not a failed attempt. Checkpoint with job.updateData() to resume.', 'lam'),
  http(`$ pkill -TERM -f 'src/worker.js'; sleep 9; cat worker-w1.log
01:34:52.238 [w1] job_1 bắt đầu (lần 1)
01:34:55.280 [w1] đóng êm: làm nốt việc đang dở
01:35:02.401 [w1] job_1 xong: 1086381 byte`, { sm: true, wrap: 'any', title: 'deploy: SIGTERM' }) + box('Graceful shutdown', 'Stop taking jobs, finish the current one, then exit. Docker gives 10 s before SIGKILL — raise the stop timeout.', 'xanh')) + box('✗ A busy worker looks dead', 'The lock is renewed on the event loop. scryptSync-style blocking work cannot renew it ⇒ the job is taken away and runs twice.', 'do2') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Jobs in the API’s memory vanished on restart (<b>404</b>); a BullMQ queue on Redis kept them</li>
<li>Failing dependency: 3 attempts, backoff <b>2 s → 4 s</b>, then failed with the reason</li>
<li>API killed: job kept running · worker killed: recovered in <b>~34 s</b> from 0% · SIGTERM: job finished first</li>
<li>Three workers: six exports <b>30.9 s → 10.4 s</b>; POST stayed at ~60 ms</li>
</ul>
${box('Next', 'Lesson 10.3 — events other teams read: contracts, versions, duplicates.', 'xanh')}` },
]);
