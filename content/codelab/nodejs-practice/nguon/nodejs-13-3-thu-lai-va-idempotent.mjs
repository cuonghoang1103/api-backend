/** Node.js · 13.3 — Thất bại: attempts + backoff, UnrecoverableError, idempotent (cú trừ tiền chạy ba lần), jobId khử trùng. */
import { modul, cs, q, tn, jsBai, c, TN } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '13.3 · Retries: what BullMQ does, and what you must add', kho: 'EASY', phut: 10,
  en: 'A queue turns “the email failed” into “the email was late” only if you configure it to — and configuring it carelessly creates a worse bug than the one you were fixing.',
  vi: 'Hàng đợi chỉ biến "email hỏng" thành "email tới trễ" nếu bạn cấu hình cho nó làm thế — và cấu hình ẩu tạo ra lỗi còn tệ hơn lỗi bạn định sửa.',
  cau: [
    q('c1', ['A job with no options fails once with "SMTP 421". What happens next?', 'Một job không có tuỳ chọn nào hỏng một lần với "SMTP 421". Chuyện gì xảy ra tiếp?'],
      ['Nothing: attempts defaults to 1, the job sits in the failed set with its reason until someone looks', 'BullMQ retries 3 times with exponential backoff by default', 'The job is deleted, because removeOnFail defaults to true', 'The worker crashes and restarts the job when it comes back'],
      ['attemptsMade = 1, no retry. Better than the inline version — the work is recorded and replayable — but nobody is coming unless you build an alert.', 'attemptsMade = 1, không thử lại. Tốt hơn bản trong request — việc được ghi lại và chạy lại được — nhưng không ai tới xem trừ khi bạn dựng cảnh báo.']),
    q('c2', ['Why is exponential backoff the right default and a fixed 300 ms the wrong one?', 'Vì sao backoff cấp số nhân là mặc định đúng còn cố định 300 ms là sai?'],
      ['Fast fixed retries add load to a service that is already drowning', 'Fixed backoff is not supported for more than 3 attempts', 'Exponential backoff uses less Redis memory per job', 'Fixed retries are executed in parallel, exponential ones in sequence'],
      ['Gaps of 288 → 417 → 826 → 1,674 ms give the other side room to recover. Add jitter so a thousand jobs that failed together do not retry together.', 'Các khoảng 288 → 417 → 826 → 1.674 ms cho bên kia chỗ để hồi phục. Thêm jitter để một nghìn job hỏng cùng lúc không thử lại cùng lúc.']),
    q('c3', ['The payment job debits the card, then the network drops; the retry runs again. The customer paid 300,000đ for a 100,000đ order. Whose fault is it?', 'Job thanh toán trừ thẻ, rồi mạng rớt; lần thử lại chạy lần nữa. Khách trả 300.000đ cho đơn 100.000đ. Lỗi của ai?'],
      ['The handler’s: a queue guarantees at-least-once delivery, so the handler must be idempotent', 'BullMQ’s: it should have detected that the first attempt succeeded', 'Redis’s: the job should have been locked for the whole retry window', 'The payment provider’s: it should never accept a second charge'],
      ['Exactly-once does not exist; idempotent handlers make at-least-once indistinguishable from it. Retries, stalled jobs and double clicks all run handlers twice.', 'Chính-xác-một-lần không tồn tại; handler luỹ đẳng làm ít-nhất-một-lần trông y như vậy. Thử lại, job treo và bấm đúp đều chạy handler hai lần.']),
    q('c4', ['add() was called 5 times with jobId "invoice-ORD-2026-777". How many jobs run, and when does that protection end?', 'add() được gọi 5 lần với jobId "invoice-ORD-2026-777". Bao nhiêu job chạy, và khi nào sự bảo vệ đó hết?'],
      ['One — but only while the old job still exists in Redis', 'One, forever: BullMQ remembers every jobId it has ever seen', 'Five, because jobId is only a label for the dashboard', 'One per worker process, because dedupe is local'],
      ['jobId is a cheap guard against double-submit in a short window, not a substitute for an idempotent handler. Use both.', 'jobId là chốt chặn rẻ chống bấm trùng trong khoảng ngắn, không thay được handler luỹ đẳng. Dùng cả hai.']),
    q('c5', ['queue.add(\'invoice\', data, { jobId: \'invoice:ORD-777\' }) throws. Why?', 'queue.add(\'invoice\', data, { jobId: \'invoice:ORD-777\' }) ném lỗi. Vì sao?'],
      ['A custom jobId cannot contain a colon — use invoice-ORD-777', 'jobId must be numeric', 'jobId must start with the queue name', 'The data is missing a userId field'],
      ['Error: Custom Id cannot contain : — easy to hit, because : is the natural separator everywhere else in Redis.', 'Error: Custom Id cannot contain : — dễ dính, vì : là dấu phân cách tự nhiên ở mọi chỗ khác trong Redis.']),
    q('c6', ['Which failure should throw UnrecoverableError (fail now, no retry)?', 'Kiểu hỏng nào nên ném UnrecoverableError (hỏng luôn, không thử lại)?'],
      ['The user no longer exists — it will fail identically five times', 'A connection reset while talking to SMTP', 'HTTP 503 from the payment provider', 'A 30-second timeout from the image service'],
      ['Retry infrastructure failures (timeout, 5xx, reset); never retry logic failures (4xx, validation, missing record) — or the queue spends its capacity on jobs that can never succeed.', 'Thử lại lỗi hạ tầng (quá giờ, 5xx, reset); đừng bao giờ thử lại lỗi logic (4xx, kiểm hợp lệ, thiếu bản ghi) — không thì hàng đợi tiêu hết sức vào những job không bao giờ thành công.']),
  ],
  goiY: [['Ask of every handler: what if it runs twice?', 'Hỏi với mọi handler: nếu nó chạy hai lần thì sao?'], ['Retry only what time can fix.', 'Chỉ thử lại thứ mà thời gian có thể chữa.']],
  loi: [['attempts: 10 on a paid API: ten bills for one piece of work.', 'attempts: 10 với một API trả phí: mười hoá đơn cho một việc.'], ['Trusting jobId as the only idempotency guard.', 'Tin jobId là chốt luỹ đẳng duy nhất.']],
  tns: [TN.backoff, TN.idempotent, TN.atLeastOnce, tn('dead letter', 'đống job chết', 'tập failed: giữ data + lý do để chạy lại khi đã sửa')],
  kn: ['retries', 'idempotency'],
});

const E2 = jsBai({
  ten: '13.3 · Compute the retry schedule', kho: 'EASY', phut: 10,
  en: `<p>Write ${c('retryDelays(attempts, backoff)')} — the waits BullMQ makes BEFORE attempts 2, 3, … ${c('attempts')}. ${c('backoff')} is ${c("{ type: 'fixed' | 'exponential', delay }")} or ${c('undefined')}:</p><ul><li>fixed: every wait is ${c('delay')};</li><li>exponential: the wait before attempt ${c('k + 1')} (after ${c('k')} failures) is ${c('delay × 2^(k − 1)')} — 1000, 2000, 4000, 8000…;</li><li>no backoff: every wait is 0; ${c('attempts')} of 1 (or missing) means no retry at all → ${c('[]')}.</li></ul><p>Also write ${c('lastRetryAt(attempts, backoff)')}: the total of those waits — the lesson’s “attempts: 5, delay: 1000 ⇒ the last retry lands around 16 seconds later”.</p>`,
  vi: `<p>Viết ${c('retryDelays(attempts, backoff)')} — các khoảng chờ BullMQ dừng TRƯỚC lần thử 2, 3, … ${c('attempts')}. ${c('backoff')} là ${c("{ type: 'fixed' | 'exponential', delay }")} hoặc ${c('undefined')}:</p><ul><li>fixed: mọi khoảng chờ bằng ${c('delay')};</li><li>exponential: khoảng chờ trước lần ${c('k + 1')} (sau ${c('k')} lần hỏng) là ${c('delay × 2^(k − 1)')} — 1000, 2000, 4000, 8000…;</li><li>không có backoff: mọi khoảng chờ là 0; ${c('attempts')} bằng 1 (hoặc thiếu) nghĩa là không thử lại → ${c('[]')}.</li></ul><p>Viết thêm ${c('lastRetryAt(attempts, backoff)')}: tổng các khoảng chờ đó — câu "attempts: 5, delay: 1000 ⇒ lần thử cuối rơi vào khoảng 16 giây sau" của bài.</p>`,
  yc: [['attempts counts the FIRST run too: 5 attempts = 4 waits.', 'attempts tính cả lần chạy ĐẦU: 5 lần thử = 4 khoảng chờ.'], ['The first exponential wait equals delay (2^0).', 'Khoảng chờ cấp số nhân đầu tiên bằng delay (2^0).'], ['Pure functions, no timers.', 'Hàm thuần, không hẹn giờ.']],
  dauVao: ['attempts — number | undefined · backoff — { type, delay } | undefined', 'attempts — số | undefined · backoff — { type, delay } | undefined'],
  dauRa: ['retryDelays → number[] · lastRetryAt → number', 'retryDelays → number[] · lastRetryAt → số'],
  goiY: [['Array.from({ length: Math.max(0, (attempts || 1) - 1) }, (_, i) => …) — i = 0 is the wait after the first failure.', 'Array.from({ length: Math.max(0, (attempts || 1) - 1) }, (_, i) => …) — i = 0 là khoảng chờ sau lần hỏng đầu tiên.'], ['exponential: backoff.delay * 2 ** i.', 'exponential: backoff.delay * 2 ** i.']],
  loi: [['delay × 2^k instead of 2^(k−1): every wait is twice too long and the first one is already 2 s.', 'delay × 2^k thay cho 2^(k−1): mọi khoảng chờ dài gấp đôi và khoảng đầu đã là 2 s.'], ['attempts waits instead of attempts − 1: one phantom retry after the last attempt.', 'attempts khoảng chờ thay vì attempts − 1: một lần thử ma sau lần cuối.']],
  gt: ['With attempts 5 and delay 1000 the waits are 1, 2, 4, 8 s and the last attempt starts 15 s after the first — “around 16 seconds” once the attempts themselves take time. The lesson measured 288 / 417 / 826 / 1,674 ms with delay 200: the same doubling plus Redis and worker overhead.', 'Với attempts 5 và delay 1000 các khoảng chờ là 1, 2, 4, 8 s và lần thử cuối bắt đầu 15 s sau lần đầu — "khoảng 16 giây" khi tính cả thời gian chạy của các lần thử. Bài đo 288 / 417 / 826 / 1.674 ms với delay 200: cùng phép nhân đôi cộng chi phí của Redis và worker.'],
  kn: ['backoff'], tns: [TN.backoff, tn('attempts', 'số lần thử', 'tính cả lần chạy đầu tiên')],
  dau: `function retryDelays(attempts, backoff) {
  // Write your solution here
  const out = [];
  for (let k = 1; k <= (attempts || 1); k++) out.push(backoff ? backoff.delay * 2 ** k : 0);
  return out;
}

function lastRetryAt(attempts, backoff) {
  return retryDelays(attempts, backoff).reduce((a, b) => a + b, 0);
}
`,
  giai: `/** The waits before attempts 2..attempts (attempts counts the first run). */
function retryDelays(attempts, backoff) {
  const waits = Math.max(0, (attempts || 1) - 1);          // 5 attempts ⇒ 4 waits; 1 ⇒ none
  return Array.from({ length: waits }, (_, i) => {         // i = number of failures so far − 1
    if (!backoff) return 0;                                 // no backoff: retry immediately
    if (backoff.type === 'exponential') return backoff.delay * 2 ** i;   // delay, 2·delay, 4·delay…
    return backoff.delay;                                   // fixed
  });
}

/** When the last attempt starts, relative to the first one. */
function lastRetryAt(attempts, backoff) {
  return retryDelays(attempts, backoff).reduce((a, b) => a + b, 0);
}
`,
  cases: [
    { goi: `[retryDelays(5, { type: 'exponential', delay: 1000 }), lastRetryAt(5, { type: 'exponential', delay: 1000 })]`, moTa: ['attempts 5, exponential 1000 → 1, 2, 4, 8 s; last at 15 s', 'attempts 5, exponential 1000 → 1, 2, 4, 8 s; lần cuối ở 15 s'] },
    { goi: `retryDelays(4, { type: 'fixed', delay: 300 })`, moTa: ['Fixed 300 ms, 4 attempts', 'Cố định 300 ms, 4 lần thử'] },
    { goi: `[retryDelays(undefined), retryDelays(1, { type: 'exponential', delay: 200 }), retryDelays(3)]`, moTa: ['Default: no retry; no backoff: immediate', 'Mặc định: không thử lại; không backoff: thử ngay'] },
    { goi: `[retryDelays(5, { type: 'exponential', delay: 200 }), lastRetryAt(3, { type: 'fixed', delay: 50 })]`, an: true },
    { goi: `lastRetryAt(10, { type: 'exponential', delay: 1000 })`, an: true },
  ],
});

const FAKE_RETRY = `// fake-bullmq-errors.js — PROVIDED (loaded before answer.js).
class UnrecoverableError extends Error { constructor(m) { super(m); this.name = 'UnrecoverableError'; } }
var sleep = typeof sleep === 'function' ? sleep : (ms) => new Promise((ok) => setTimeout(ok, ms));
`;

const E3 = jsBai({
  ten: '13.3 · Run a job the way a worker does: attempts, backoff, unrecoverable', kho: 'MEDIUM', phut: 20,
  en: `<p>Write ${c('runJob(handler, opts = {})')} — what a worker does with ONE job:</p><ul><li>call ${c('await handler({ attemptsMade })')} (${c('attemptsMade')} = failures so far, starting at 0);</li><li>success → ${c("{ state: 'completed', attemptsMade: <runs>, returnvalue, at }")};</li><li>failure → if the error’s ${c('name')} is ${c("'UnrecoverableError'")}, or no attempts are left (${c('opts.attempts')}, default 1), resolve to ${c("{ state: 'failed', attemptsMade, failedReason: err.message, at }")}; otherwise wait (exponential: ${c('delay × 2^(failures − 1)')}, fixed: ${c('delay')}, none: 0) and try again;</li><li>${c('at')} = the start time of each run, in ms relative to the first one (use ${c('Date.now()')} — the grader’s clock is virtual).</li></ul>`,
  vi: `<p>Viết ${c('runJob(handler, opts = {})')} — việc một worker làm với MỘT job:</p><ul><li>gọi ${c('await handler({ attemptsMade })')} (${c('attemptsMade')} = số lần hỏng tới giờ, bắt đầu từ 0);</li><li>thành công → ${c("{ state: 'completed', attemptsMade: <số lần chạy>, returnvalue, at }")};</li><li>hỏng → nếu ${c('name')} của lỗi là ${c("'UnrecoverableError'")}, hoặc hết lượt thử (${c('opts.attempts')}, mặc định 1), resolve ra ${c("{ state: 'failed', attemptsMade, failedReason: err.message, at }")}; ngược lại chờ (exponential: ${c('delay × 2^(số lần hỏng − 1)')}, fixed: ${c('delay')}, không có: 0) rồi thử lại;</li><li>${c('at')} = thời điểm bắt đầu mỗi lần chạy, tính bằng ms so với lần đầu (dùng ${c('Date.now()')} — đồng hồ máy chấm là đồng hồ ảo).</li></ul>`,
  yc: [['attempts defaults to 1 (BullMQ does not retry unless told to).', 'attempts mặc định là 1 (BullMQ không thử lại trừ khi được bảo).'], ['UnrecoverableError stops at once, whatever attempts says.', 'UnrecoverableError dừng ngay, bất kể attempts là bao nhiêu.'], ['Never throw: the outcome is in the resolved object.', 'Không bao giờ ném: kết cục nằm trong object được resolve.']],
  dauVao: ['handler — async ({ attemptsMade }) => any · opts — { attempts?, backoff? }', 'handler — async ({ attemptsMade }) => any · opts — { attempts?, backoff? }'],
  dauRa: ['Promise<{ state, attemptsMade, returnvalue? | failedReason?, at: number[] }>', 'Promise<{ state, attemptsMade, returnvalue? | failedReason?, at: number[] }>'],
  goiY: [['const t0 = Date.now(); const at = []; for (let made = 0; ; ) { at.push(Date.now() - t0); try { … return completed } catch (err) { made++; … } }', 'const t0 = Date.now(); const at = []; for (let made = 0; ; ) { at.push(Date.now() - t0); try { … return completed } catch (err) { made++; … } }'], ['Wait with await sleep(ms) before the next loop iteration; for exponential ms = delay * 2 ** (made - 1).', 'Chờ bằng await sleep(ms) trước vòng lặp kế; với exponential ms = delay * 2 ** (made - 1).']],
  loi: [['Defaulting attempts to 3 “to be safe”: BullMQ’s default is 1, and silent retries on a payment job are not safe.', 'Mặc định attempts là 3 "cho chắc": mặc định của BullMQ là 1, và thử lại câm trên job thanh toán không hề chắc.'], ['Retrying an UnrecoverableError: a deleted user fails five times and burns four attempts.', 'Thử lại UnrecoverableError: người dùng đã xoá hỏng năm lần và đốt bốn lượt thử.'], ['Counting attemptsMade from 1 before the first run, or not counting the successful run: the reported number disagrees with BullMQ’s.', 'Đếm attemptsMade từ 1 trước lần chạy đầu, hoặc không đếm lần chạy thành công: con số báo ra lệch với BullMQ.']],
  gt: ['This is the attempts/backoff loop a BullMQ worker runs for you, made visible: on the virtual clock the starts land exactly on 0, 200, 600 ms for delay 200 — the lesson measured 10 → 298 → 715 ms with real Redis overhead. UnrecoverableError is the escape hatch for logic failures that time cannot fix.', 'Đây là vòng attempts/backoff mà worker BullMQ chạy hộ bạn, được làm cho nhìn thấy: trên đồng hồ ảo các lần bắt đầu rơi đúng 0, 200, 600 ms với delay 200 — bài đo 10 → 298 → 715 ms với chi phí Redis thật. UnrecoverableError là lối thoát cho lỗi logic mà thời gian không chữa được.'],
  kn: ['retries', 'backoff'], tns: [TN.backoff, tn('UnrecoverableError', 'lỗi không cứu được', 'ném nó ⇒ job hỏng ngay, không thử lại')],
  gia: { 'fake-bullmq-errors.js': FAKE_RETRY },
  dau: `/** Run one job like a worker: attempts + backoff + UnrecoverableError. */
async function runJob(handler, opts = {}) {
  // Write your solution here — retries forever-ish, ignores backoff and UnrecoverableError
  const attempts = opts.attempts || 3;
  const at = [];
  let made = 0;
  for (;;) {
    at.push(0);
    try {
      const returnvalue = await handler({ attemptsMade: made });
      return { state: 'completed', attemptsMade: made + 1, returnvalue, at };
    } catch (err) {
      made++;
      if (made >= attempts) return { state: 'failed', attemptsMade: made, failedReason: err.message, at };
    }
  }
}
`,
  giai: `/** Run one job like a worker: attempts + backoff + UnrecoverableError. */
async function runJob(handler, opts = {}) {
  const attempts = opts.attempts || 1;                 // BullMQ's default: ONE attempt, no retry
  const b = opts.backoff;
  const t0 = Date.now();
  const at = [];
  let made = 0;                                        // failures so far
  for (;;) {
    at.push(Date.now() - t0);
    try {
      const returnvalue = await handler({ attemptsMade: made });
      return { state: 'completed', attemptsMade: made + 1, returnvalue, at };
    } catch (err) {
      made++;
      const hopeless = err && err.name === 'UnrecoverableError';   // logic failure: retrying cannot help
      if (hopeless || made >= attempts) return { state: 'failed', attemptsMade: made, failedReason: err.message, at };
      const wait = !b ? 0 : b.type === 'exponential' ? b.delay * 2 ** (made - 1) : b.delay;
      await sleep(wait);                               // give the downstream room to recover
    }
  }
}
`,
  chung: `const flaky = (failures, msg = 'SMTP 421') => { let n = 0; return async () => { await sleep(5); if (n++ < failures) throw new Error(msg); return { sent: true }; }; };`,
  cases: [
    { goi: `await runJob(flaky(1))`, moTa: ['No options: one attempt, failed', 'Không tuỳ chọn: một lần thử, hỏng'] },
    { goi: `await runJob(flaky(2), { attempts: 5, backoff: { type: 'exponential', delay: 200 } })`, moTa: ['Recovers on attempt 3: starts at 0 / 205 / 610 ms', 'Hồi phục ở lần 3: bắt đầu lúc 0 / 205 / 610 ms'] },
    { goi: `await runJob(async () => { throw new UnrecoverableError('user no longer exists'); }, { attempts: 5, backoff: { type: 'fixed', delay: 1000 } })`, moTa: ['UnrecoverableError: failed after one attempt', 'UnrecoverableError: hỏng sau một lần thử'] },
    { goi: `await runJob(flaky(10), { attempts: 4, backoff: { type: 'fixed', delay: 300 } })`, an: true },
    { goi: `await runJob(async ({ attemptsMade }) => { if (attemptsMade < 3) throw new Error('timeout'); return attemptsMade; }, { attempts: 4 })`, an: true },
  ],
});

const FAKE_PAY = `// fake-payments.js — PROVIDED (loaded before answer.js).
// db.payments: a table with a UNIQUE constraint on orderId (like Prisma: duplicate ⇒ error with code 'P2002')
//   await db.payments.create({ orderId, amount, status }) · await db.payments.find(orderId) · await db.payments.update(orderId, patch)
// psp (payment provider): await psp.charge({ orderId, amount }, { idempotencyKey }) → { id }
//   the SAME idempotencyKey returns the first result again WITHOUT charging · psp.totalCharged (đồng)
//   psp.failBeforeCharge = n ⇒ next n calls fail BEFORE charging · psp.dropAfterCharge = n ⇒ next n calls charge, then the reply is lost
// runWithRetries(fn, attempts) — calls fn() until it resolves or attempts run out (like a worker with attempts)
const db = { payments: { rows: new Map(),
  create(r) { return new Promise((ok, no) => setTimeout(() => { if (this.rows.has(r.orderId)) { const e = new Error('Unique constraint failed on the fields: (orderId)'); e.code = 'P2002'; no(e); } else { this.rows.set(r.orderId, { ...r }); ok({ ...r }); } }, 3)); },
  find(orderId) { return new Promise((ok) => setTimeout(() => ok(this.rows.has(orderId) ? { ...this.rows.get(orderId) } : null), 3)); },
  update(orderId, patch) { return new Promise((ok) => setTimeout(() => { const r = this.rows.get(orderId); Object.assign(r, patch); ok({ ...r }); }, 3)); },
} };
const psp = { totalCharged: 0, calls: 0, byKey: new Map(), failBeforeCharge: 0, dropAfterCharge: 0, seq: 0,
  charge({ orderId, amount }, opts) {
    psp.calls++;
    return new Promise((ok, no) => setTimeout(() => {
      if (psp.failBeforeCharge > 0) { psp.failBeforeCharge--; return no(new Error('PSP 503')); }
      const key = opts && opts.idempotencyKey;
      if (key && psp.byKey.has(key)) return ok({ ...psp.byKey.get(key) });
      psp.totalCharged += amount;
      const res = { id: 'ch_' + (++psp.seq), orderId, amount };
      if (key) psp.byKey.set(key, res);
      if (psp.dropAfterCharge > 0) { psp.dropAfterCharge--; return no(new Error('ECONNRESET')); }
      ok(res);
    }, 20));
  } };
async function runWithRetries(fn, attempts) {
  let last;
  for (let i = 0; i < attempts; i++) { try { return await fn(); } catch (e) { last = e; await new Promise((ok) => setTimeout(ok, 100 * 2 ** i)); } }
  throw last;
}
`;

const E4 = jsBai({
  ten: '13.3 · The charge that must not run three times', kho: 'HARD', phut: 25,
  en: `<p>The lesson’s triple charge: the handler debits the card, the network drops, the retry debits again. Write ${c('handleCharge(job, { db, psp })')} for ${c('job.data = { orderId, amount }')} so that the customer is charged exactly once, whatever runs it again — a retry, a stalled job reclaimed after a crash, or a duplicate job from a double click:</p><ol><li>claim the order with a row: ${c("db.payments.create({ orderId, amount, status: 'PENDING' })")}. A duplicate throws an error with ${c("code 'P2002'")}: then read the row — if it is already ${c("'DONE'")}, return ${c('{ skipped: true, ref }')}; if it is still PENDING (an earlier run died midway), carry on;</li><li>charge with an idempotency key the provider understands: ${c('psp.charge({ orderId, amount }, { idempotencyKey: `charge-${orderId}` })')};</li><li>mark the row ${c("{ status: 'DONE', ref: result.id }")} and return ${c('{ charged: true, ref }')}.</li></ol><p>Any other error is re-thrown, so the worker retries.</p>`,
  vi: `<p>Cú trừ tiền ba lần của bài: handler trừ thẻ, mạng rớt, lần thử lại trừ thêm. Viết ${c('handleCharge(job, { db, psp })')} với ${c('job.data = { orderId, amount }')} sao cho khách bị trừ đúng một lần, bất kể cái gì chạy lại nó — một lần thử lại, một job treo được nhặt lại sau khi sập, hay một job trùng do bấm đúp:</p><ol><li>giữ chỗ đơn hàng bằng một dòng: ${c("db.payments.create({ orderId, amount, status: 'PENDING' })")}. Trùng thì ném lỗi có ${c("code 'P2002'")}: khi đó đọc dòng — nếu đã ${c("'DONE'")} thì trả ${c('{ skipped: true, ref }')}; nếu vẫn PENDING (lần chạy trước chết giữa chừng) thì làm tiếp;</li><li>trừ tiền với khoá luỹ đẳng mà nhà cung cấp hiểu: ${c('psp.charge({ orderId, amount }, { idempotencyKey: `charge-${orderId}` })')};</li><li>đánh dấu dòng ${c("{ status: 'DONE', ref: result.id }")} và trả ${c('{ charged: true, ref }')}.</li></ol><p>Mọi lỗi khác được ném lại, để worker thử lại.</p>`,
  yc: [['psp.totalCharged equals the amount once, in every scenario.', 'psp.totalCharged bằng đúng số tiền một lần, ở mọi tình huống.'], ['A PENDING row from a dead run does not block the charge forever.', 'Một dòng PENDING của lần chạy đã chết không chặn việc trừ tiền mãi mãi.'], ['Non-P2002 errors are re-thrown.', 'Lỗi không phải P2002 được ném lại.']],
  dauVao: ['job — { data: { orderId, amount } } · { db, psp } from fake-payments.js', 'job — { data: { orderId, amount } } · { db, psp } trong fake-payments.js'],
  dauRa: ['Promise<{ charged: true, ref } | { skipped: true, ref }>', 'Promise<{ charged: true, ref } | { skipped: true, ref }>'],
  goiY: [['try { await db.payments.create(…) } catch (err) { if (err.code !== \'P2002\') throw err; const row = await db.payments.find(orderId); if (row.status === \'DONE\') return { skipped: true, ref: row.ref }; }', 'try { await db.payments.create(…) } catch (err) { if (err.code !== \'P2002\') throw err; const row = await db.payments.find(orderId); if (row.status === \'DONE\') return { skipped: true, ref: row.ref }; }'], ['Why both guards? The row stops a second job after success; the idempotency key stops a second debit when the reply of the first one was lost.', 'Vì sao cần cả hai chốt? Dòng dữ liệu chặn job thứ hai sau khi đã thành công; khoá luỹ đẳng chặn lần trừ thứ hai khi câu trả lời của lần đầu bị mất.']],
  loi: [['Charging first and recording after: a drop between the two is the triple charge.', 'Trừ tiền trước rồi mới ghi: rớt mạng giữa hai bước chính là cú trừ ba lần.'], ['Returning “skipped” on ANY P2002: a run that died after creating the row but before charging leaves the order unpaid forever.', 'Trả "skipped" với MỌI P2002: lần chạy chết sau khi tạo dòng nhưng trước khi trừ tiền để đơn hàng không bao giờ được trả.'], ['A check-then-act guard (find the row, then create it): two workers both see “no row” and both charge.', 'Chốt kiểm-rồi-làm (tìm dòng, rồi mới tạo): hai worker cùng thấy "không có dòng" và cùng trừ tiền.']],
  gt: ['A queue is at-least-once, so the handler must make running twice harmless. The unique row (P2002, chapter 7.3) is the atomic claim — two workers cannot both create it. The idempotency key covers the case no database can see: the provider charged, but the reply was lost, so a retry must get the first result back instead of a second debit. A PENDING row means “an earlier run died somewhere”, which is exactly when to continue rather than skip.', 'Hàng đợi là ít-nhất-một-lần, nên handler phải làm cho việc chạy hai lần vô hại. Dòng duy nhất (P2002, chương 7.3) là phép giữ chỗ nguyên tử — hai worker không thể cùng tạo nó. Khoá luỹ đẳng che trường hợp CSDL không thấy được: nhà cung cấp đã trừ, nhưng câu trả lời mất, nên lần thử lại phải nhận lại kết quả đầu thay vì trừ lần hai. Dòng PENDING nghĩa là "một lần chạy trước đã chết đâu đó", đúng lúc phải làm tiếp thay vì bỏ qua.'],
  kn: ['idempotency', 'unique constraint'], tns: [TN.idempotent, tn('idempotency key', 'khoá luỹ đẳng', 'cùng khoá ⇒ bên kia trả lại kết quả cũ, không làm lần hai'), tn('P2002', 'lỗi trùng khoá duy nhất (Prisma)', 'ràng buộc UNIQUE từ chối dòng thứ hai')],
  gia: { 'fake-payments.js': FAKE_PAY },
  dau: `/** Charge an order — must be safe to run more than once. */
async function handleCharge(job, { db, psp }) {
  // Write your solution here — this is the lesson's triple charge
  const { orderId, amount } = job.data;
  const result = await psp.charge({ orderId, amount });
  await db.payments.create({ orderId, amount, status: 'DONE', ref: result.id });
  return { charged: true, ref: result.id };
}
`,
  giai: `/** Charge an order — safe to run any number of times (at-least-once delivery). */
async function handleCharge(job, { db, psp }) {
  const { orderId, amount } = job.data;
  try {
    // 1) claim the order atomically: the UNIQUE constraint lets exactly one row exist
    await db.payments.create({ orderId, amount, status: 'PENDING' });
  } catch (err) {
    if (err.code !== 'P2002') throw err;                       // a real error: let the worker retry
    const row = await db.payments.find(orderId);
    if (row.status === 'DONE') return { skipped: true, ref: row.ref };   // already paid: nothing to do
    // still PENDING: an earlier run died midway (maybe after charging) — continue, the key below protects us
  }
  // 2) the provider deduplicates on the key: a lost reply + retry returns the FIRST charge, no second debit
  const result = await psp.charge({ orderId, amount }, { idempotencyKey: \`charge-\${orderId}\` });
  // 3) record the outcome
  await db.payments.update(orderId, { status: 'DONE', ref: result.id });
  return { charged: true, ref: result.id };
}
`,
  chung: `const job = { data: { orderId: 'ORD-2026-777', amount: 100000 } };
const deps = { db, psp };`,
  cases: [
    { goi: `[await handleCharge(job, deps), psp.totalCharged, (await db.payments.find('ORD-2026-777')).status]`, moTa: ['Happy path: charged once, row DONE', 'Đường suôn: trừ một lần, dòng DONE'] },
    { goi: `await (async () => { psp.dropAfterCharge = 1; const r = await runWithRetries(() => handleCharge(job, deps), 3); return [r, psp.totalCharged, psp.calls]; })()`, moTa: ['The network drops after the charge; the retry does not charge again', 'Mạng rớt sau khi trừ; lần thử lại không trừ thêm'] },
    { goi: `await (async () => { await handleCharge(job, deps); const again = await handleCharge({ data: { ...job.data } }, deps); return [again, psp.totalCharged]; })()`, moTa: ['A duplicate job after success → skipped', 'Job trùng sau khi đã thành công → bỏ qua'] },
    { goi: `await (async () => { psp.failBeforeCharge = 1; const r = await runWithRetries(() => handleCharge(job, deps), 3); return [r.charged, psp.totalCharged]; })()`, an: true, moTa: ['The first attempt fails BEFORE charging: the retry must still charge', 'Lần đầu hỏng TRƯỚC khi trừ: lần thử lại vẫn phải trừ'] },
    { goi: `await (async () => { const r = await Promise.all([handleCharge(job, deps), handleCharge(job, deps), handleCharge(job, deps)]); return [psp.totalCharged, (await db.payments.find('ORD-2026-777')).status, r.every((x) => x.ref === r[0].ref)]; })()`, an: true, moTa: ['Three workers at once: one charge', 'Ba worker cùng lúc: một lần trừ'] },
    { goi: `await (async () => { let err; try { await handleCharge({ data: { orderId: 'X', amount: 5 } }, { db: { payments: { create: async () => { throw new Error('connection terminated'); } } }, psp }); } catch (e) { err = e.message; } return [err, psp.totalCharged]; })()`, an: true },
  ],
});

const FAKE_DEDUPE = `// fake-dedupe-queue.js — PROVIDED (loaded before answer.js). jobId semantics of BullMQ:
//   await queue.add(name, data, { jobId })  → { id } — if a job with that id still EXISTS, nothing is added and its id is returned
//   a jobId containing ':' throws Error('Custom Id cannot contain :')
//   queue.removeCompleted() simulates removeOnComplete cleaning up · queue.count() — jobs that exist
const queue = { jobs: new Map(), seq: 0,
  add(name, data, opts) {
    return new Promise((ok, no) => setTimeout(() => {
      const id = opts && opts.jobId != null ? String(opts.jobId) : String(++queue.seq);
      if (id.includes(':')) return no(new Error('Custom Id cannot contain :'));
      if (!queue.jobs.has(id)) queue.jobs.set(id, { id, name, data, state: 'waiting' });
      ok({ id });
    }, 1));
  },
  complete(id) { queue.jobs.get(id).state = 'completed'; },
  removeCompleted() { for (const [id, j] of queue.jobs) if (j.state === 'completed') queue.jobs.delete(id); },
  count() { return queue.jobs.size; },
};
`;

const E5 = jsBai({
  ten: '13.3 · Five clicks on “Pay”, one invoice', kho: 'EASY', phut: 10,
  en: `<p>Give the invoice job a deterministic ${c('jobId')} derived from the order, so BullMQ refuses to create a second one while the first still exists. Write:</p><ul><li>${c('invoiceJobId(orderId)')} → ${c("'invoice-' + orderId")} with every ${c("':'")} replaced by ${c("'-'")} (BullMQ throws ${c('Custom Id cannot contain :')}, and order ids from another system can contain colons);</li><li>${c('requestInvoice(queue, orderId)')} → ${c("queue.add('invoice', { orderId }, { jobId })")}; resolve to the job id.</li></ul><p>The hidden test also shows the limit the lesson warns about: once the completed job is cleaned up, the same id can be added again — jobId is a guard for a short window, not a substitute for an idempotent handler.</p>`,
  vi: `<p>Đặt cho job hoá đơn một ${c('jobId')} tất định suy ra từ đơn hàng, để BullMQ từ chối tạo job thứ hai trong khi job đầu còn tồn tại. Viết:</p><ul><li>${c('invoiceJobId(orderId)')} → ${c("'invoice-' + orderId")} với mọi ${c("':'")} đổi thành ${c("'-'")} (BullMQ ném ${c('Custom Id cannot contain :')}, và mã đơn từ hệ thống khác có thể chứa dấu hai chấm);</li><li>${c('requestInvoice(queue, orderId)')} → ${c("queue.add('invoice', { orderId }, { jobId })")}; resolve ra id của job.</li></ul><p>Kiểm ẩn còn cho thấy giới hạn mà bài cảnh báo: khi job đã xong bị dọn đi, cùng id đó lại thêm được — jobId là chốt chặn cho một khoảng ngắn, không thay được handler luỹ đẳng.</p>`,
  yc: [['Same order ⇒ same jobId; no colon in it.', 'Cùng đơn ⇒ cùng jobId; không có dấu hai chấm.'], ['Five concurrent clicks ⇒ one job.', 'Năm lần bấm đồng thời ⇒ một job.'], ['Different orders ⇒ different jobs.', 'Đơn khác nhau ⇒ job khác nhau.']],
  dauVao: ['queue — fake-dedupe-queue.js · orderId — string', 'queue — fake-dedupe-queue.js · orderId — chuỗi'],
  dauRa: ['invoiceJobId → string · requestInvoice → Promise<string>', 'invoiceJobId → chuỗi · requestInvoice → Promise<chuỗi>'],
  goiY: [['String(orderId).replaceAll(\':\', \'-\') — or .split(\':\').join(\'-\').', 'String(orderId).replaceAll(\':\', \'-\') — hoặc .split(\':\').join(\'-\').'], ['const { id } = await queue.add(\'invoice\', { orderId }, { jobId: invoiceJobId(orderId) }); return id;', 'const { id } = await queue.add(\'invoice\', { orderId }, { jobId: invoiceJobId(orderId) }); return id;']],
  loi: [['jobId: \'invoice:\' + orderId — natural for Redis keys, rejected by BullMQ.', 'jobId: \'invoice:\' + orderId — tự nhiên với khoá Redis, bị BullMQ từ chối.'], ['jobId: Date.now() or a random UUID: every click is “new”, so nothing is deduplicated.', 'jobId: Date.now() hay một UUID ngẫu nhiên: mỗi lần bấm đều "mới", nên chẳng khử trùng được gì.']],
  gt: ['Deduplication needs an id that is the same for the same intent — derived from the order, not from time. BullMQ ignores an add() whose jobId already exists, so five clicks produce one job; but the guard only lasts while that job is in Redis, which is why the charge handler of the previous exercise must still be idempotent.', 'Khử trùng cần một id giống nhau cho cùng một ý định — suy ra từ đơn hàng, không từ thời gian. BullMQ bỏ qua lệnh add() có jobId đã tồn tại, nên năm lần bấm ra một job; nhưng chốt chặn chỉ kéo dài khi job đó còn trong Redis, nên handler trừ tiền của đề trước vẫn phải luỹ đẳng.'],
  kn: ['jobId', 'deduplication'], tns: [tn('jobId', 'id job tự đặt', 'id tất định — thêm lần hai khi job cũ còn tồn tại thì bị bỏ qua')],
  gia: { 'fake-dedupe-queue.js': FAKE_DEDUPE },
  dau: `function invoiceJobId(orderId) {
  // Write your solution here
  return 'invoice:' + orderId;
}

async function requestInvoice(queue, orderId) {
  const { id } = await queue.add('invoice', { orderId }, { jobId: invoiceJobId(orderId) });
  return id;
}
`,
  giai: `/** A deterministic id for "the invoice of this order" — no colon, BullMQ rejects it. */
function invoiceJobId(orderId) {
  return 'invoice-' + String(orderId).split(':').join('-');
}

/** Same order ⇒ same jobId ⇒ BullMQ refuses a second job while the first still exists. */
async function requestInvoice(queue, orderId) {
  const { id } = await queue.add('invoice', { orderId }, { jobId: invoiceJobId(orderId) });
  return id;
}
`,
  cases: [
    { goi: `[invoiceJobId('ORD-2026-777'), invoiceJobId('shop:42:ORD-9')]`, moTa: ['Deterministic, colon-free ids', 'Id tất định, không dấu hai chấm'] },
    { goi: `await (async () => { const ids = await Promise.all(Array.from({ length: 5 }, () => requestInvoice(queue, 'ORD-2026-777'))); return [ids, queue.count()]; })()`, moTa: ['Five clicks → one job', 'Năm lần bấm → một job'] },
    { goi: `await (async () => { const a = await requestInvoice(queue, 'legacy:ORD:1'); const b = await requestInvoice(queue, 'ORD-2'); return [a, b, queue.count()]; })()`, moTa: ['A colon in the order id does not throw; two orders, two jobs', 'Mã đơn có dấu hai chấm không làm ném lỗi; hai đơn, hai job'] },
    { goi: `await (async () => { const id = await requestInvoice(queue, 'ORD-7'); queue.complete(id); const again = await requestInvoice(queue, 'ORD-7'); const before = queue.count(); queue.removeCompleted(); await requestInvoice(queue, 'ORD-7'); return [again === id, before, queue.count(), queue.jobs.get(id).state]; })()`, an: true, moTa: ['The limit: after cleanup the same id is accepted again', 'Giới hạn: sau khi dọn, cùng id lại được nhận'] },
    { goi: `[invoiceJobId(12345), invoiceJobId('a::b')]`, an: true },
  ],
});

export default modul('nodejs-13-3-thu-lai-va-idempotent', '13.3 Retries, backoff, idempotent handlers, jobId', [E1, E2, E3, E4, E5]);
