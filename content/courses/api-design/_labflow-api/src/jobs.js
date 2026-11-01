// jobs.js — bài 10.1: tài nguyên CÔNG VIỆC (job) cho API bất đồng bộ. Hai cách chạy, CÙNG một hợp đồng HTTP:
//   LABFLOW_JOBS=memory  việc chạy ngay trong tiến trình API (Map + vòng chạy) — đơn giản, nhưng khởi động lại là MẤT việc
//   LABFLOW_JOBS=bullmq  API xếp việc vào hàng đợi BullMQ trên Redis; tiến trình khác (src/worker.js) chạy việc
import { Queue } from 'bullmq';
import { createClient } from 'redis';
import { TASKS } from './tasks.js';
import { config } from './config.js';

export const MODE = config.jobs;                                                 // Chương 12: kho pg + Redis ⇒ mặc định bullmq
export const RESULT_TTL_SEC = Number(process.env.RESULT_TTL_SEC ?? 3600);     // giữ KẾT QUẢ 1 giờ
export const JOB_TTL_SEC = 7 * 86400;                                           // giữ BẢN GHI việc 7 ngày
export const QUEUE = 'labflow-jobs';
const connection = { url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390' };
const iso = (ms) => (ms ? new Date(ms).toISOString() : null);

// Hình dạng công khai của một việc — giống nhau cho cả hai cách chạy
export function toJob(j, base) {
  const done = ['succeeded', 'failed', 'cancelled'].includes(j.status);
  const { done: d = 0, total = null } = j.progress ?? {};
  return {
    id: j.id, kind: j.kind, status: j.status,
    progress: { done: d, total, percent: total ? Math.floor((100 * d) / total) : (j.status === 'succeeded' ? 100 : 0) },
    createdAt: iso(j.createdAt), startedAt: iso(j.startedAt), finishedAt: iso(j.finishedAt),
    cancelRequested: !!j.cancelRequested,
    result: j.status === 'succeeded' ? { href: `${base}/${j.id}/result`, ...j.result } : null,
    error: j.status === 'failed' ? { code: 'JOB_FAILED', detail: j.error } : null,
    links: { self: `${base}/${j.id}`, ...(!done && { cancel: `${base}/${j.id}/cancel` }) },
  };
}

/* ───────────── memory: chạy ngay trong tiến trình API ───────────── */
const mem = new Map();                    // id ⇒ việc
const results = new Map();                // id ⇒ { type, body, expiresAt }
let n = 0, running = 0;
const MAX_RUNNING = 2;
function pump() {
  const next = [...mem.values()].find((j) => j.status === 'queued');
  if (!next || running >= MAX_RUNNING) return;
  running++;
  next.status = 'running'; next.startedAt = Date.now(); next.ctl = new AbortController();
  runMem(next).finally(() => { next.finishedAt = Date.now(); running--; delete next.ctl; setImmediate(pump); });
  setImmediate(pump);                                             // còn chỗ ⇒ chạy thêm việc kế tiếp
}
async function runMem(j) {
  try {
    const task = TASKS[j.kind];
    const body = await task.run(j.data, { signal: j.ctl.signal, progress: async (done, total) => { j.progress = { done, total }; } });
    const expiresAt = Date.now() + RESULT_TTL_SEC * 1000;
    results.set(j.id, { type: task.type, body });
    setTimeout(() => results.delete(j.id), RESULT_TTL_SEC * 1000).unref();   // hết hạn ⇒ kết quả biến mất, bản ghi việc còn
    j.result = { contentType: task.type, bytes: Buffer.byteLength(body), expiresAt: iso(expiresAt) };
    j.status = 'succeeded';
  } catch (e) {
    j.status = e.message === 'CANCELLED' ? 'cancelled' : 'failed';
    j.error = e.message;
  }
}

/* ───────────── bullmq: xếp hàng trên Redis, worker riêng chạy ───────────── */
let queue = null, redis = null;
if (MODE === 'bullmq') {
  queue = new Queue(QUEUE, { connection });
  redis = createClient(connection);
  redis.on('error', (e) => console.error('redis jobs', e.message));
  await redis.connect();
}
const STATE = { waiting: 'queued', delayed: 'queued', prioritized: 'queued', 'waiting-children': 'queued', active: 'running', completed: 'succeeded' };
async function fromBull(job) {
  const state = await job.getState();
  const cancelled = state === 'failed' && job.failedReason === 'CANCELLED';
  return {
    id: job.id, kind: job.name, owner: job.data.owner, progress: job.progress,
    status: cancelled ? 'cancelled' : (STATE[state] ?? state),
    createdAt: job.timestamp, startedAt: job.processedOn, finishedAt: job.finishedOn,
    result: job.returnvalue, error: job.failedReason,
    cancelRequested: !!(await redis.exists(`labflow:cancel:${job.id}`)),
  };
}

/* ───────────── API dùng chung cho route ───────────── */
export async function createJob(kind, data, owner) {
  if (MODE === 'bullmq') {
    const id = `job_${await redis.incr('labflow:job-seq')}`;
    const job = await queue.add(kind, { ...data, owner }, {
      jobId: id,
      attempts: 3, backoff: { type: 'exponential', delay: 2000 },           // worker chết giữa chừng ⇒ việc được chạy lại
      removeOnComplete: { age: JOB_TTL_SEC }, removeOnFail: { age: JOB_TTL_SEC },
    });
    return fromBull(job);
  }
  const j = { id: `job_${++n}`, kind, data, owner, status: 'queued', createdAt: Date.now() };
  mem.set(j.id, j);
  setImmediate(pump);
  return j;
}

export async function getJob(id) {
  if (MODE === 'bullmq') { const job = await queue.getJob(id); return job ? fromBull(job) : null; }
  return mem.get(id) ?? null;
}

// Huỷ: memory ⇒ abort ngay; bullmq ⇒ đặt cờ + báo worker qua pub/sub (worker gọi worker.cancelJob ⇒ AbortSignal)
export async function cancelJob(id) {
  if (MODE === 'bullmq') {
    await redis.set(`labflow:cancel:${id}`, '1', { expiration: { type: 'EX', value: JOB_TTL_SEC } });
    await redis.publish('labflow:cancel', id);
    return;
  }
  const j = mem.get(id);
  j.cancelRequested = true;
  if (j.status === 'queued') { j.status = 'cancelled'; j.finishedAt = Date.now(); }
  j.ctl?.abort();
}

export async function getResult(id) {
  if (MODE === 'bullmq') {
    const [type, body] = await Promise.all([redis.get(`labflow:result:${id}:type`), redis.get(`labflow:result:${id}`)]);
    return body === null ? null : { type, body };
  }
  return results.get(id) ?? null;
}
