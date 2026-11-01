// worker.js — bài 10.2: tiến trình RIÊNG chạy việc nền từ hàng đợi BullMQ (Redis). Chạy: node src/worker.js
//   API chết ⇒ worker vẫn làm; worker chết giữa chừng ⇒ khoá việc hết hạn, BullMQ đưa việc về hàng đợi, worker khác làm lại.
//   Chạy nhiều worker = thêm sức (mỗi worker WORKER_CONCURRENCY việc cùng lúc).
//   Chương 12 (kho pg): worker còn chạy relay outbox ⇒ Redis Stream (relay.js) và gửi email thông báo qua hàng đợi labflow-notify.
import { Worker, Queue, UnrecoverableError } from 'bullmq';
import { createClient } from 'redis';
import { pool as db } from './pg.js';
import { config } from './config.js';
import { store } from './store/index.js';
import { startRelay, xaddPublisher } from './relay.js';
import { sendMail, bookingMail, MAIL_KINDS } from './mailer.js';
import { TASKS } from './tasks.js';
import { QUEUE, RESULT_TTL_SEC } from './jobs.js';
import { STREAM, envelope } from './events.js';
import { signedHeaders } from './webhooks.js';
import { assertPublicUrl } from './safeFetch.js';

const connection = { url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390' };
// Bài 12.4: client Redis KHÔNG có trình nghe 'error' ⇒ Redis chớp tắt một lần là cả worker chết ("Unhandled 'error' event").
// Mọi client đều gắn trình nghe lỗi; thư viện tự nối lại khi Redis quay về.
const redisClient = (label) => {
  const c = createClient(connection);
  c.on('error', (e) => { if (c.lastErr !== e.message) log(`redis ${label}: ${(c.lastErr = e.message)}`); });
  c.on('ready', () => { if (c.lastErr) log(`redis ${label}: nối lại được`); c.lastErr = null; });
  return c;
};
// Vòng đọc stream: Redis mất ⇒ ghi log, chờ 1 s, đọc tiếp — KHÔNG thoát tiến trình
const forever = (label, body, onNoGroup) => (async () => {
  for (;;) {
    try { await body(); } catch (e) {
      log(`${label}: ${e.message} — thử lại sau 1 s`);
      // Redis khởi động lại mà không lưu đĩa ⇒ stream và nhóm consumer mất ⇒ dựng lại nhóm, đọc từ đầu stream mới (id 0)
      if (e.message.includes('NOGROUP')) await onNoGroup?.().catch(() => {});
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
})();
const redis = redisClient('kết quả'), sub = redisClient('huỷ');
await Promise.all([redis.connect(), sub.connect()]);
const name = process.env.WORKER_NAME ?? `w${process.pid}`;
const log = (...a) => console.log(new Date().toISOString().slice(11, 23), `[${name}]`, ...a);

const worker = new Worker(QUEUE, async (job, token, signal) => {
  log(`${job.id} bắt đầu (lần ${job.attemptsMade + 1}${job.stalledCounter ? `, đã bị bỏ dở ${job.stalledCounter} lần` : ''})`);
  if (await redis.exists(`labflow:cancel:${job.id}`)) throw new UnrecoverableError('CANCELLED');   // huỷ khi còn trong hàng đợi
  const task = TASKS[job.name];
  let body;
  try {
    body = await task.run(job.data, { signal, progress: (done, total) => job.updateProgress({ done, total }) });
  } catch (e) {
    if (e.message === 'CANCELLED') throw new UnrecoverableError('CANCELLED');   // huỷ thì KHÔNG thử lại
    throw e;                                                                      // lỗi khác ⇒ BullMQ thử lại (attempts: 3)
  }
  // Kết quả lớn nằm ở chỗ riêng, có hạn; bản ghi việc chỉ giữ mô tả của nó
  await redis.set(`labflow:result:${job.id}`, body, { expiration: { type: 'EX', value: RESULT_TTL_SEC } });
  await redis.set(`labflow:result:${job.id}:type`, task.type, { expiration: { type: 'EX', value: RESULT_TTL_SEC } });
  const expiresAt = new Date(Date.now() + RESULT_TTL_SEC * 1000).toISOString();
  // Bài 10.5 — báo "xong" thành sự kiện; webhook của người tạo việc nhận được nó
  const e = envelope(task.event, job.id, { jobId: job.id, kind: job.name, owner: job.data.owner, result: `/v2/jobs/${job.id}/result`, expiresAt });
  await redis.xAdd(STREAM, '*', { e: JSON.stringify(e) });
  log(`${job.id} xong: ${Buffer.byteLength(body)} byte`);
  return { contentType: task.type, bytes: Buffer.byteLength(body), expiresAt };
}, {
  connection,
  concurrency: Number(process.env.WORKER_CONCURRENCY ?? 2),
  lockDuration: Number(process.env.WORKER_LOCK_MS ?? 15000),      // không gia hạn khoá trong 15 s ⇒ coi như worker đã chết
  stalledInterval: Number(process.env.WORKER_LOCK_MS ?? 15000),
});
worker.on('failed', (job, err) => log(`${job?.id} hỏng: ${err.message} (đã thử ${job?.attemptsMade})`));
// API yêu cầu huỷ ⇒ worker đang giữ việc đó phát AbortSignal cho hàm xử lý
await sub.subscribe('labflow:cancel', (id) => { if (worker.cancelJob(id, 'CANCELLED')) log(`${id} nhận lệnh huỷ`); });
log(`sẵn sàng, hàng đợi ${QUEUE}, concurrency ${worker.opts.concurrency}`);

/* ───────────── Bài 10.5 — webhook: stream sự kiện ⇒ hàng đợi giao ⇒ POST có chữ ký, thử lại lùi dần ───────────── */
if (process.env.WORKER_WEBHOOKS !== '0' && (process.env.LABFLOW_PG || config.store === 'pg')) {
  const deliveries = new Queue('labflow-webhooks', { connection });
  const ATTEMPTS = Number(process.env.WEBHOOK_ATTEMPTS ?? 8);
  const BACKOFF_MS = Number(process.env.WEBHOOK_BACKOFF_MS ?? 30000);   // 30 s, 1 phút, 2 phút … (×2 mỗi lần, ±50% ngẫu nhiên)
  const TIMEOUT_MS = Number(process.env.WEBHOOK_TIMEOUT_MS ?? 5000);    // bên nhận phải trả 2xx trong 5 s
  const reader = redisClient('webhook');
  await reader.connect();
  await reader.xGroupCreate(STREAM, 'webhooks', '$', { MKSTREAM: true }).catch((e) => { if (!e.message.includes('BUSYGROUP')) throw e; });

  // Người điều phối: mỗi sự kiện × mỗi đăng ký khớp = MỘT thông điệp. jobId = msg_… ⇒ đọc lại sự kiện cũng không xếp trùng
  forever('điều phối webhook', async () => {
    const r = await reader.xReadGroup('webhooks', name, { key: STREAM, id: '>' }, { COUNT: 50, BLOCK: 5000 });
    for (const m of r?.[0]?.messages ?? []) {
      const e = { id: m.id, ...JSON.parse(m.message.e) };
      const { rows } = await db.query(`SELECT id FROM webhook_subscriptions WHERE status = 'active' AND $1 = ANY(events)
        AND ($2::text IS NULL OR owner_id = $2)`, [e.type, e.data?.owner ?? null]);   // việc của ai ⇒ chỉ webhook của người đó
      for (const s of rows) {
        const msgId = `msg_${m.id}_${s.id}`;
        await deliveries.add('deliver', { subId: s.id, msgId, event: e }, {
          jobId: msgId, attempts: ATTEMPTS, backoff: { type: 'exponential', delay: BACKOFF_MS, jitter: 0.5 },
          removeOnComplete: { age: 86400 }, removeOnFail: { age: 7 * 86400 },
        });
      }
      await reader.xAck(STREAM, 'webhooks', m.id);
    }
  }, () => reader.xGroupCreate(STREAM, 'webhooks', '0', { MKSTREAM: true }));

  const sender = new Worker('labflow-webhooks', async (job) => {
    const { subId, msgId, event } = job.data;
    const { rows: [s] } = await db.query('SELECT * FROM webhook_subscriptions WHERE id = $1', [subId]);
    if (!s || s.status !== 'active') return { skipped: true };
    const body = JSON.stringify(event);
    const t0 = performance.now();
    let status = null, error = null;
    try {
      await assertPublicUrl(s.url);                                     // kiểm lại lúc GỬI: DNS có thể đã đổi
      const r = await fetch(s.url, { method: 'POST', body, redirect: 'error', signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'content-type': 'application/json', 'user-agent': 'LabFlow-Webhooks/1.0', ...signedHeaders(s.secret, msgId, body) } });
      status = r.status;
      await r.body?.cancel();
    } catch (e) { error = e.name === 'TimeoutError' ? `timeout ${TIMEOUT_MS} ms` : (e.cause?.code ?? e.message); }
    const ms = Math.round(performance.now() - t0);
    await db.query(`INSERT INTO webhook_deliveries (msg_id, subscription_id, event_type, attempt, status_code, error, duration_ms)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, [msgId, subId, event.type, job.attemptsMade + 1, status, error, ms]);
    log(`webhook ${msgId.slice(0, 32)}… lần ${job.attemptsMade + 1}: ${status ?? error} (${ms} ms)`);
    if (status >= 200 && status < 300) return { status };
    if (status === 410) {                                               // bên nhận nói "đừng gửi nữa" ⇒ tắt đăng ký, không thử lại
      await db.query("UPDATE webhook_subscriptions SET status = 'disabled' WHERE id = $1", [subId]);
      throw new UnrecoverableError('410 Gone: subscription disabled');
    }
    throw new Error(error ?? `HTTP ${status}`);                         // lỗi khác ⇒ BullMQ thử lại theo backoff
  }, { connection, concurrency: 10 });
  sender.on('failed', (job, err) => { if (job && job.attemptsMade >= ATTEMPTS) log(`webhook ${job.id} BỎ sau ${job.attemptsMade} lần: ${err.message}`); });
  log(`webhook: ${ATTEMPTS} lần, lùi từ ${BACKOFF_MS} ms, timeout ${TIMEOUT_MS} ms`);
}
/* ───────────── Bài 12.5 — outbox ⇒ stream, và thông báo email qua hàng đợi ───────────── */
const closers = [worker];
if (config.store === 'pg' && process.env.WORKER_RELAY !== '0') {
  const relayRedis = redisClient('relay');
  await relayRedis.connect();
  await startRelay(xaddPublisher(relayRedis), log);
  log('relay outbox ⇒ stream: LISTEN labflow_outbox');
}
if (config.store === 'pg' && process.env.WORKER_NOTIFY !== '0') {
  const notifyQ = new Queue('labflow-notify', { connection });
  const reader = redisClient('thông báo');
  await reader.connect();
  await reader.xGroupCreate(STREAM, 'notify', '$', { MKSTREAM: true }).catch((e) => { if (!e.message.includes('BUSYGROUP')) throw e; });
  // Mỗi (lượt đặt, version) = MỘT thư. jobId cố định ⇒ relay phát lại sự kiện cũ cũng không xếp thư thứ hai (BullMQ bỏ qua id trùng)
  // Bài 12.5: tin đã ĐỌC mà chưa XACK (worker trước chết giữa chừng) nằm trong danh sách chờ (PEL) của consumer này.
  // Đọc bằng '>' chỉ thấy tin MỚI ⇒ khởi động thì đọc lại phần dở bằng id '0' trước, hết rồi mới sang '>'.
  let from = '0';
  forever('điều phối thông báo', async () => {
    const r = await reader.xReadGroup('notify', name, { key: STREAM, id: from }, { COUNT: 50, BLOCK: 5000 });
    if (from === '0' && !(r?.[0]?.messages?.length)) from = '>';
    for (const m of r?.[0]?.messages ?? []) {
      const e = JSON.parse(m.message.e);
      const kind = e.type.match(/^labflow\.booking\.(\w+)\.v1$/)?.[1];
      if (MAIL_KINDS.includes(kind)) {
        await notifyQ.add('mail', { kind, bookingId: e.data.id, version: e.data.version }, {
          jobId: `ntf_${e.data.id}_v${e.data.version}`, attempts: Number(process.env.NOTIFY_ATTEMPTS ?? 8),
          backoff: { type: 'exponential', delay: Number(process.env.NOTIFY_BACKOFF_MS ?? 2000), jitter: 0.5 },
          removeOnComplete: { age: 86400 }, removeOnFail: { age: 7 * 86400 },
        });
      }
      await reader.xAck(STREAM, 'notify', m.id);
    }
  }, () => reader.xGroupCreate(STREAM, 'notify', '0', { MKSTREAM: true }));
  const mailer = new Worker('labflow-notify', async (job) => {
    const { kind, bookingId } = job.data;
    const b = await store.getBooking(bookingId);                    // đọc dữ liệu MỚI NHẤT lúc gửi; email lấy từ bảng users
    if (!b) return { skipped: 'booking gone' };
    const u = await store.getUser(b.userId);
    const t0 = performance.now();
    const r = await sendMail(bookingMail(kind, { ...b, version: job.data.version }, u));
    log(`thư ${job.id} → ${u.email}: ${r.duplicate ? 'trùng, bỏ qua' : 'đã gửi'} (lần ${job.attemptsMade + 1}, ${Math.round(performance.now() - t0)} ms)`);
    return r;
  }, { connection, concurrency: 5,
    lockDuration: Number(process.env.WORKER_LOCK_MS ?? 15000), stalledInterval: Number(process.env.WORKER_LOCK_MS ?? 15000) });   // worker chết giữa chừng ⇒ ~15–30 s sau việc được làm lại
  mailer.on('failed', (job, err) => log(`thư ${job?.id} hỏng lần ${job?.attemptsMade}: ${err.message}`));
  closers.push(mailer);
  log('thông báo email: hàng đợi labflow-notify');
}
// Đóng êm (bài 10.2, 12.7): không nhận việc mới, làm NỐT việc đang dở, rồi mới thoát
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, async () => {
  log('đóng êm: làm nốt việc đang dở');
  await Promise.all(closers.map((w) => w.close()));
  await db.end().catch(() => {});
  process.exit(0);
});
