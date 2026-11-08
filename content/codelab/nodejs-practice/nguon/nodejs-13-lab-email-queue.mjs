/** Node.js · Lab Chương 13 — Hàng đợi email của Notes API: worker có concurrency + thử lại không giữ chỗ + lỗi không cứu được; theo dõi hàng đợi; soát danh sách kiểm tra production. */
import { modul, cs, tn, bang1, jsBai, c, TN } from './_node-c12-14.mjs';

const FAKE_LAB = `// fake-email-lab.js — PROVIDED (loaded before answer.js).
// smtp: accepts 5 concurrent connections, 200 ms per message, "421 Too many concurrent connections" beyond that.
//   await smtp.send(to) · smtp.sent · smtp.rejected · smtp.peak
// users: a tiny table; welcome(job) is the job handler of the lab:
//   - the user is gone      ⇒ throws UnrecoverableError('user no longer exists')   (never retry)
//   - the address bounces   ⇒ throws Error('550 mailbox unavailable')             (retried, fails every time)
//   - otherwise sends through smtp (a 421 throws Error('421 …') — worth a retry)
class UnrecoverableError extends Error { constructor(m) { super(m); this.name = 'UnrecoverableError'; } }
const smtp = { max: 5, ms: 200, open: 0, peak: 0, sent: [], rejected: 0,
  send(to) {
    if (smtp.open >= smtp.max) { smtp.rejected++; return Promise.reject(new Error('421 Too many concurrent connections')); }
    smtp.open++; smtp.peak = Math.max(smtp.peak, smtp.open);
    return new Promise((ok) => setTimeout(() => { smtp.open--; smtp.sent.push(to); ok(); }, smtp.ms));
  } };
const users = new Map();
for (let i = 1; i <= 100; i++) users.set(i, { id: i, email: 'u' + i + '@x.vn' });
users.delete(13);                                  // deleted account
users.get(42).email = 'bounce@nowhere.invalid';    // hard bounce
async function welcome(job) {
  await new Promise((ok) => setTimeout(ok, 2));    // read the user (the job carries the id only)
  const u = users.get(job.data.userId);
  if (!u) throw new UnrecoverableError('user no longer exists');
  if (u.email.endsWith('.invalid')) throw new Error('550 mailbox unavailable');
  await smtp.send(u.email);
}
var sleep = typeof sleep === 'function' ? sleep : (ms) => new Promise((ok) => setTimeout(ok, ms));
`;

const L1 = jsBai({
  ten: 'Lab 13 · 1 — The email worker: concurrency, retries that free the slot, unrecoverable', kho: 'HARD', phut: 40, dangBai: 'lab',
  en: `<p>Write the worker loop of the Notes API’s email queue as ${c('drainQueue(jobs, handler, { concurrency, attempts, backoff })')} — what BullMQ’s Worker does for you, so you know what you configure.</p>
<ul>
<li>${c('jobs')} is the wait list ${c('[{ id, data }]')}. Run ${c('handler(job)')} for jobs from the FRONT of the list, never more than ${c('concurrency')} at a time; a slot is reused as soon as it frees up.</li>
<li>Success ⇒ the id goes to ${c('completed')}.</li>
<li>Failure ⇒ count it on the job. If the error is an ${c('UnrecoverableError')} (check ${c("err.name")}), or the job has failed ${c('attempts')} times (default 1), it goes to ${c('failed')} as ${c('{ id, reason: err.message, attemptsMade }')}. Otherwise it goes back to the END of the wait list after a backoff delay (${c("{ type: 'exponential', delay }")} ⇒ ${c('delay × 2^(failures − 1)')}; ${c("'fixed'")} ⇒ ${c('delay')}; none ⇒ 0). <b>A job waiting for its retry does not hold a slot.</b></li>
<li>Resolve when nothing is waiting, running or scheduled, to ${c('{ completed, failed, peak }')} — ${c('completed')} and ${c('failed')} sorted by numeric id, ${c('peak')} = the highest number of handlers running at once.</li>
</ul>
<p>The fixture: 100 sign-ups, user 13 was deleted, user 42’s address hard-bounces, and the SMTP server takes 5 connections.</p>`,
  vi: `<p>Viết vòng lặp worker của hàng đợi email Notes API thành ${c('drainQueue(jobs, handler, { concurrency, attempts, backoff })')} — việc mà Worker của BullMQ làm hộ bạn, để bạn hiểu mình đang cấu hình cái gì.</p>
<ul>
<li>${c('jobs')} là danh sách chờ ${c('[{ id, data }]')}. Chạy ${c('handler(job)')} cho các job ở ĐẦU danh sách, không bao giờ quá ${c('concurrency')} cái cùng lúc; chỗ trống được dùng lại ngay khi có.</li>
<li>Thành công ⇒ id vào ${c('completed')}.</li>
<li>Hỏng ⇒ đếm lần hỏng trên job. Nếu lỗi là ${c('UnrecoverableError')} (kiểm ${c("err.name")}), hoặc job đã hỏng đủ ${c('attempts')} lần (mặc định 1), nó vào ${c('failed')} dạng ${c('{ id, reason: err.message, attemptsMade }')}. Ngược lại nó quay về CUỐI danh sách chờ sau một khoảng backoff (${c("{ type: 'exponential', delay }")} ⇒ ${c('delay × 2^(số lần hỏng − 1)')}; ${c("'fixed'")} ⇒ ${c('delay')}; không có ⇒ 0). <b>Job đang chờ thử lại không giữ chỗ.</b></li>
<li>Resolve khi không còn gì chờ, đang chạy hay đã hẹn, ra ${c('{ completed, failed, peak }')} — ${c('completed')} và ${c('failed')} sắp theo id dạng số, ${c('peak')} = số handler chạy cùng lúc nhiều nhất.</li>
</ul>
<p>Dữ liệu thử: 100 lượt đăng ký, user 13 đã bị xoá, địa chỉ của user 42 dội cứng, và máy chủ SMTP nhận 5 kết nối.</p>`,
  yc: [['Never more than concurrency handlers at once.', 'Không bao giờ quá concurrency handler cùng lúc.'], ['Retries wait with a timer OUTSIDE the slots, then rejoin the end of the wait list.', 'Lần thử lại chờ bằng hẹn giờ BÊN NGOÀI các chỗ, rồi quay lại cuối danh sách chờ.'], ['UnrecoverableError fails at once; other errors use the attempts.', 'UnrecoverableError hỏng ngay; lỗi khác dùng hết số lần thử.']],
  dauVao: ['jobs — [{ id, data: { userId } }] · handler — async (job) => any · { concurrency, attempts, backoff }', 'jobs — [{ id, data: { userId } }] · handler — async (job) => any · { concurrency, attempts, backoff }'],
  dauRa: ['Promise<{ completed: string[], failed: { id, reason, attemptsMade }[], peak: number }>', 'Promise<{ completed: string[], failed: { id, reason, attemptsMade }[], peak: number }>'],
  goiY: [['Return new Promise((done) => { … }) with a pump(): while (active < concurrency && wait.length) start the next job; if (!active && !wait.length && !scheduled) done(result).', 'Trả new Promise((done) => { … }) với một hàm pump(): while (active < concurrency && wait.length) khởi job kế; if (!active && !wait.length && !scheduled) done(kết quả).'], ['In the failure branch of a retryable job: scheduled++; setTimeout(() => { scheduled--; wait.push(job); pump(); }, delay). In finally: active--; pump().', 'Ở nhánh hỏng của job còn thử lại được: scheduled++; setTimeout(() => { scheduled--; wait.push(job); pump(); }, delay). Trong finally: active--; pump().'], ['Keep the failure count on a copy of the job (made), not in a Map keyed by position — positions change when jobs rejoin the list.', 'Giữ số lần hỏng trên một bản sao của job (made), không phải trong Map theo vị trí — vị trí thay đổi khi job quay lại danh sách.']],
  loi: [['await sleep(backoff) inside the handler slot: five failing jobs occupy all five slots while they wait, and the healthy jobs behind them stall.', 'await sleep(backoff) ngay trong chỗ của handler: năm job hỏng chiếm cả năm chỗ trong lúc chờ, và các job khoẻ phía sau bị kẹt.'], ['Retrying the deleted user five times: a logic failure fails identically and burns the queue’s capacity.', 'Thử lại user đã xoá năm lần: lỗi logic hỏng y hệt nhau và đốt sức chứa của hàng đợi.'], ['Resolving when the wait list is empty although retries are still scheduled: the bounce and the 421s are reported as never having run.', 'Resolve khi danh sách chờ rỗng dù còn lần thử lại đang hẹn: lần dội và các lỗi 421 bị báo như chưa từng chạy.']],
  gt: ['This is BullMQ’s worker in miniature: concurrency bounds the handlers in flight, a failed job is moved to the delayed set (here, a timer) so it does not hold a slot, it comes back as a normal waiting job when its backoff expires, and an UnrecoverableError skips straight to failed. With concurrency 5 the SMTP limit is never exceeded; with 8 the server answers 421 and the retries absorb it — the same 98 emails arrive either way, while the deleted account fails once and the bounce exhausts its attempts.', 'Đây là worker của BullMQ thu nhỏ: concurrency chặn số handler đang chạy, job hỏng được chuyển vào tập delayed (ở đây là một hẹn giờ) nên không giữ chỗ, nó quay lại thành job chờ bình thường khi hết backoff, và UnrecoverableError đi thẳng tới failed. Với concurrency 5 giới hạn SMTP không bao giờ bị vượt; với 8 máy chủ trả 421 và các lần thử lại hấp thụ nó — cùng 98 email tới nơi ở cả hai cách, trong khi tài khoản đã xoá hỏng một lần và địa chỉ dội dùng hết số lần thử.'],
  kn: ['worker', 'retries', 'concurrency'], tns: [TN.backoff, tn('delayed set', 'tập hẹn giờ', 'nơi job chờ thử lại — không chiếm chỗ của worker'), tn('UnrecoverableError', 'lỗi không cứu được', 'hỏng ngay, không thử lại')],
  gia: { 'fake-email-lab.js': FAKE_LAB },
  dau: `/** The worker loop: concurrency, attempts + backoff, UnrecoverableError. */
async function drainQueue(jobs, handler, { concurrency = 1, attempts = 1, backoff } = {}) {
  // Write your solution here — sequential, no retries
  const completed = [], failed = [];
  for (const job of jobs) {
    try { await handler(job); completed.push(job.id); }
    catch (err) { failed.push({ id: job.id, reason: err.message, attemptsMade: 1 }); }
  }
  return { completed, failed, peak: 1 };
}
`,
  giai: `/** The worker loop: concurrency, attempts + backoff (without holding a slot), UnrecoverableError. */
function drainQueue(jobs, handler, { concurrency = 1, attempts = 1, backoff } = {}) {
  const wait = jobs.map((j) => ({ ...j, made: 0 }));       // the wait list — a copy, with a failure counter
  const completed = [], failed = [];
  let active = 0, scheduled = 0, peak = 0;
  const delayFor = (made) => (!backoff ? 0 : backoff.type === 'exponential' ? backoff.delay * 2 ** (made - 1) : backoff.delay);
  const byId = (a, b) => Number(a.id ?? a) - Number(b.id ?? b);

  return new Promise((done) => {
    function pump() {
      while (active < concurrency && wait.length) run(wait.shift());     // reuse every free slot at once
      if (!active && !wait.length && !scheduled) {
        done({ completed: completed.sort(byId), failed: failed.sort(byId), peak });
      }
    }
    async function run(job) {
      active++; peak = Math.max(peak, active);
      try {
        await handler(job);
        completed.push(job.id);
      } catch (err) {
        job.made++;
        const hopeless = err && err.name === 'UnrecoverableError';      // logic failure: retrying cannot help
        if (hopeless || job.made >= attempts) {
          failed.push({ id: job.id, reason: err.message, attemptsMade: job.made });
        } else {
          scheduled++;                                                   // like BullMQ's delayed set:
          setTimeout(() => { scheduled--; wait.push(job); pump(); }, delayFor(job.made));   // no slot held while waiting
        }
      } finally {
        active--;
        pump();
      }
    }
    pump();
  });
}
`,
  chung: `const signups = Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1), data: { userId: i + 1 } }));
const opts = (concurrency) => ({ concurrency, attempts: 5, backoff: { type: 'exponential', delay: 100 } });`,
  cases: [
    { goi: `await drainQueue(signups, welcome, opts(5)).then((r) => [r.completed.length, r.failed, r.peak, smtp.sent.length, smtp.rejected, smtp.peak])`, moTa: ['Concurrency 5: 98 sent, 13 fails once (unrecoverable), 42 fails 5 times', 'Concurrency 5: gửi 98, user 13 hỏng một lần (không cứu được), user 42 hỏng 5 lần'] },
    { goi: `await drainQueue(signups.slice(0, 20), welcome, opts(8)).then((r) => [r.completed.length, r.failed.map((f) => f.id), r.peak, smtp.sent.length, smtp.rejected > 0, smtp.peak])`, moTa: ['Concurrency 8 against SMTP 5: 421s are retried, every email still arrives', 'Concurrency 8 với SMTP 5: lỗi 421 được thử lại, mọi email vẫn tới'] },
    { goi: `await drainQueue([{ id: '1', data: { userId: 42 } }], welcome, {}).then((r) => r.failed)`, moTa: ['Default attempts 1: no retry', 'attempts mặc định 1: không thử lại'] },
    { goi: `await (async () => { const t0 = Date.now(); let n = 0; const flaky = async () => { await sleep(10); if (++n <= 3) throw new Error('timeout'); }; const r = await drainQueue([{ id: '7', data: {} }], flaky, { concurrency: 1, attempts: 5, backoff: { type: 'exponential', delay: 200 } }); return [r.completed, r.failed, Date.now() - t0]; })()`, an: true, moTa: ['Exponential waits 200 / 400 / 800 between attempts', 'Khoảng chờ cấp số nhân 200 / 400 / 800 giữa các lần thử'] },
    { goi: `await (async () => { const t0 = Date.now(); const slowFail = async (j) => { await sleep(10); if (j.id === 'bad') throw new Error('timeout'); await sleep(90); }; const jobs = [{ id: 'bad', data: {} }, ...Array.from({ length: 4 }, (_, i) => ({ id: String(i + 1), data: {} }))]; const r = await drainQueue(jobs, slowFail, { concurrency: 1, attempts: 3, backoff: { type: 'fixed', delay: 1000 } }); return [r.completed, r.failed, Date.now() - t0 < 2500]; })()`, an: true, moTa: ['A job waiting for its retry does not block the others', 'Job đang chờ thử lại không chặn các job khác'] },
    { goi: `await drainQueue([], welcome, opts(3))`, an: true },
  ],
});

const FAKE_MON = `// fake-monitor.js — PROVIDED (loaded before answer.js). A queue you can ask about itself (one round trip each):
//   await queue.getJobCounts('waiting', 'active', 'failed', 'delayed') → { waiting, active, failed, delayed }
//   await queue.getWaiting(0, 0) → [oldest waiting job] or []   (job.timestamp = when it was added, ms)
function makeMonitoredQueue(counts, oldestTimestamp) {
  return {
    getJobCounts(...names) { return new Promise((ok) => setTimeout(() => ok(Object.fromEntries(names.map((n) => [n, counts[n] || 0]))), 1)); },
    getWaiting(start, end) { return new Promise((ok) => setTimeout(() => ok(oldestTimestamp == null ? [] : [{ id: '1', timestamp: oldestTimestamp }]), 1)); },
  };
}
`;

const L2 = jsBai({
  ten: 'Lab 13 · 2 — Watch the queue: health endpoint and trend alerts', kho: 'MEDIUM', phut: 25, dangBai: 'lab',
  en: `<p>Queues fail silently — that is their characteristic failure mode. Write two functions.</p>
<p><b>1.</b> ${c('queueHealth(queue)')} — the lesson’s ${c('GET /health/queues')}: ${c("await queue.getJobCounts('waiting', 'active', 'failed', 'delayed')")} plus ${c('oldestWaitingAgeMs')} = ${c('Date.now() - oldest.timestamp')} for the oldest waiting job (${c('queue.getWaiting(0, 0)')}), or 0 when nothing waits. Ask for both in parallel.</p>
<p><b>2.</b> ${c('queueAlerts(samples, maxOldestMs = 600000)')} — ${c('samples')} are health snapshots in time order, ${c('{ waiting, failed, stalled, oldestWaitingAgeMs }')}, where ${c('stalled')} is the running total of stalled events. Return, in this order:</p>
<ul><li>${c("'waiting-climbing'")} — ${c('waiting')} strictly increased across the last 4 samples (a TREND, not an absolute number);</li><li>${c("'failed-climbing'")} — the same rule for ${c('failed')} (one failure is routine, a steady rise is an incident);</li><li>${c("'stalled'")} — the last sample’s ${c('stalled')} is higher than the previous one (this should be zero);</li><li>${c("'stuck'")} — the last sample’s ${c('oldestWaitingAgeMs')} is above ${c('maxOldestMs')} (a short queue can still be stuck).</li></ul>`,
  vi: `<p>Hàng đợi hỏng một cách câm lặng — đó là kiểu hỏng đặc trưng của chúng. Viết hai hàm.</p>
<p><b>1.</b> ${c('queueHealth(queue)')} — ${c('GET /health/queues')} của bài: ${c("await queue.getJobCounts('waiting', 'active', 'failed', 'delayed')")} cộng ${c('oldestWaitingAgeMs')} = ${c('Date.now() - oldest.timestamp')} của job chờ lâu nhất (${c('queue.getWaiting(0, 0)')}), hoặc 0 khi không có gì chờ. Hỏi cả hai song song.</p>
<p><b>2.</b> ${c('queueAlerts(samples, maxOldestMs = 600000)')} — ${c('samples')} là các ảnh chụp sức khoẻ theo thứ tự thời gian, ${c('{ waiting, failed, stalled, oldestWaitingAgeMs }')}, trong đó ${c('stalled')} là tổng cộng dồn số sự kiện treo. Trả về, theo thứ tự:</p>
<ul><li>${c("'waiting-climbing'")} — ${c('waiting')} tăng hẳn qua 4 mẫu cuối (một XU HƯỚNG, không phải một con số tuyệt đối);</li><li>${c("'failed-climbing'")} — cùng luật cho ${c('failed')} (một lần hỏng là chuyện thường, tăng đều là sự cố);</li><li>${c("'stalled'")} — ${c('stalled')} của mẫu cuối lớn hơn mẫu trước đó (số này lẽ ra phải bằng 0);</li><li>${c("'stuck'")} — ${c('oldestWaitingAgeMs')} của mẫu cuối lớn hơn ${c('maxOldestMs')} (hàng đợi ngắn vẫn có thể kẹt).</li></ul>`,
  yc: [['queueHealth: the two queries in parallel (Promise.all).', 'queueHealth: hai truy vấn chạy song song (Promise.all).'], ['Trend rules need at least 4 samples; the stalled rule needs 2.', 'Luật xu hướng cần ít nhất 4 mẫu; luật treo cần 2.'], ['Alerts in the order given, no duplicates.', 'Cảnh báo đúng thứ tự đã nêu, không trùng.']],
  dauVao: ['queue — fake-monitor.js · samples — snapshots, oldest first', 'queue — fake-monitor.js · samples — ảnh chụp, cũ nhất trước'],
  dauRa: ['queueHealth → Promise<{ waiting, active, failed, delayed, oldestWaitingAgeMs }> · queueAlerts → string[]', 'queueHealth → Promise<{ waiting, active, failed, delayed, oldestWaitingAgeMs }> · queueAlerts → string[]'],
  goiY: [['const [counts, [oldest]] = await Promise.all([queue.getJobCounts(…), queue.getWaiting(0, 0)]);', 'const [counts, [oldest]] = await Promise.all([queue.getJobCounts(…), queue.getWaiting(0, 0)]);'], ['const rising = (k) => samples.length >= 4 && samples.slice(-4).every((s, i, a) => i === 0 || s[k] > a[i - 1][k]);', 'const rising = (k) => samples.length >= 4 && samples.slice(-4).every((s, i, a) => i === 0 || s[k] > a[i - 1][k]);']],
  loi: [['Alerting on waiting > 10,000: a queue draining a big backlog pages you, and a stuck queue of 12 jobs never does.', 'Cảnh báo khi waiting > 10.000: hàng đợi đang rút một tồn đọng lớn thì réo bạn, còn hàng đợi kẹt 12 job thì không bao giờ.'], ['Alerting on failed > 0: one transient failure a day becomes a permanent page, and everyone learns to ignore it.', 'Cảnh báo khi failed > 0: một lần hỏng thoáng qua mỗi ngày thành cảnh báo thường trực, và ai cũng học cách lờ nó.'], ['Two awaits one after another in the health endpoint: twice the latency for an endpoint a monitor calls every few seconds.', 'Hai await nối tiếp trong endpoint sức khoẻ: gấp đôi độ trễ cho một endpoint bị hệ giám sát gọi vài giây một lần.']],
  gt: ['The numbers to watch, from the lesson: waiting climbing (work arrives faster than it leaves), failed climbing (something is systematically broken), stalled events (workers die or block the loop — should be zero) and the age of the oldest job (“the oldest job has waited 40 minutes” says more than “12 jobs are waiting”). Trends and ages catch what absolute thresholds miss.', 'Những con số cần nhìn, theo bài: waiting tăng (việc tới nhanh hơn việc đi), failed tăng (có gì đó hỏng có hệ thống), sự kiện treo (worker chết hoặc chặn vòng lặp — phải bằng 0) và tuổi của job lâu nhất ("job lâu nhất đã chờ 40 phút" nói nhiều hơn "12 job đang chờ"). Xu hướng và tuổi bắt được những gì ngưỡng tuyệt đối bỏ sót.'],
  kn: ['monitoring', 'alerting'], tns: [tn('trend alert', 'cảnh báo theo xu hướng', 'báo khi một số tăng đều, không khi nó vượt một mốc cố định'), tn('oldest job age', 'tuổi job lâu nhất', 'job chờ lâu nhất đã chờ bao lâu')],
  gia: { 'fake-monitor.js': FAKE_MON },
  dau: `async function queueHealth(queue) {
  // Write your solution here
  const counts = await queue.getJobCounts('waiting', 'active', 'failed', 'delayed');
  return { ...counts, oldestWaitingAgeMs: 0 };
}

function queueAlerts(samples, maxOldestMs = 600000) {
  const last = samples[samples.length - 1];
  const alerts = [];
  if (last.waiting > 10000) alerts.push('waiting-climbing');
  if (last.failed > 0) alerts.push('failed-climbing');
  return alerts;
}
`,
  giai: `/** GET /health/queues — counts + the age of the oldest waiting job (two queries, in parallel). */
async function queueHealth(queue) {
  const [counts, [oldest]] = await Promise.all([
    queue.getJobCounts('waiting', 'active', 'failed', 'delayed'),
    queue.getWaiting(0, 0),
  ]);
  return { ...counts, oldestWaitingAgeMs: oldest ? Date.now() - oldest.timestamp : 0 };
}

/** Alert on TRENDS and AGES, not on absolute numbers. */
function queueAlerts(samples, maxOldestMs = 600000) {
  const alerts = [];
  const rising = (k) => samples.length >= 4 && samples.slice(-4).every((s, i, a) => i === 0 || s[k] > a[i - 1][k]);
  const last = samples[samples.length - 1];
  const prev = samples[samples.length - 2];
  if (rising('waiting')) alerts.push('waiting-climbing');                     // arriving faster than leaving
  if (rising('failed')) alerts.push('failed-climbing');                       // systematic, not one-off
  if (prev && last.stalled > prev.stalled) alerts.push('stalled');            // workers dying / loop blocked
  if (last && last.oldestWaitingAgeMs > maxOldestMs) alerts.push('stuck');    // short can still be stuck
  return alerts;
}
`,
  chung: `const S = (waiting, failed, stalled, oldestMin) => ({ waiting, failed, stalled, oldestWaitingAgeMs: oldestMin * 60000 });`,
  cases: [
    { goi: `await queueHealth(makeMonitoredQueue({ waiting: 12, active: 5, failed: 3, delayed: 1 }, Date.now() - 40 * 60000))`, moTa: ['12 waiting, the oldest for 40 minutes', '12 job chờ, job lâu nhất đã chờ 40 phút'] },
    { goi: `[await queueHealth(makeMonitoredQueue({ active: 2 }, null)), await (async () => { const t0 = Date.now(); await queueHealth(makeMonitoredQueue({}, null)); return Date.now() - t0; })()]`, moTa: ['Nothing waits → age 0; both queries in parallel (1 ms, not 2)', 'Không gì chờ → tuổi 0; hai truy vấn song song (1 ms, không phải 2)'] },
    { goi: `[queueAlerts([S(100, 0, 0, 1), S(400, 0, 0, 1), S(900, 0, 0, 2), S(1500, 0, 0, 2)]), queueAlerts([S(50000, 0, 0, 1), S(40000, 0, 0, 1), S(30000, 0, 0, 1), S(20000, 1, 0, 1)])]`, moTa: ['A rising trend alerts; a big backlog that drains does not', 'Xu hướng tăng thì báo; tồn đọng lớn đang rút thì không'] },
    { goi: `[queueAlerts([S(12, 3, 0, 1), S(12, 3, 2, 45)]), queueAlerts([S(1, 1, 0, 0), S(2, 2, 0, 0), S(3, 3, 0, 0)])]`, an: true },
    { goi: `[queueAlerts([S(1, 0, 0, 0), S(2, 1, 0, 0), S(2, 2, 0, 0), S(3, 3, 0, 0), S(4, 4, 0, 11)], 10 * 60000), queueAlerts([S(0, 0, 0, 0)])]`, an: true },
  ],
});

const KQ = ['OK', 'Violation'];
const L3 = cs({
  ten: 'Lab 13 · 3 — Audit a queue before it goes to production', kho: 'MEDIUM', phut: 12, loai: 'table', dangBai: 'lab',
  en: 'A teammate opens a pull request that moves the Notes API’s emails to BullMQ. Check each line against the lesson’s production checklist (dedicated noeviction Redis, separate worker process, attempts + backoff + idempotent, SIGTERM closes the worker, retention, alerts) and the traps of 13.3–13.4.',
  vi: 'Một đồng đội mở pull request chuyển email của Notes API sang BullMQ. Soát từng dòng theo danh sách kiểm tra production của bài (Redis riêng noeviction, worker ở tiến trình riêng, attempts + backoff + luỹ đẳng, SIGTERM đóng worker, lưu giữ, cảnh báo) và các bẫy của 13.3–13.4.',
  bang: [bang1('b1', ['Line of the PR → OK or violation', 'Dòng của PR → ổn hay vi phạm'], [{ ma: 'x', ten: 'In the pull request' }, { ma: 'v', ten: 'Verdict', luaChon: KQ }], [
    { o: { x: 'connection: the existing cache Redis (maxmemory-policy allkeys-lru), to avoid a second container' }, a: { v: 'Violation' } },
    { o: { x: 'new Worker(\'email\', …) is created in server.js, right after app.listen(3000)' }, a: { v: 'Violation' } },
    { o: { x: 'defaultJobOptions: { attempts: 5, backoff: { type: \'exponential\', delay: 1000 } }, and the handler records sent emails under a unique (userId, kind) key' }, a: { v: 'OK' } },
    { o: { x: 'process.on(\'SIGTERM\', () => process.exit(0))' }, a: { v: 'Violation' } },
    { o: { x: 'removeOnComplete: { age: 3600, count: 1000 }, removeOnFail: { age: 7 * 24 * 3600 }' }, a: { v: 'OK' } },
    { o: { x: 'The only alert: page when waiting > 10,000' }, a: { v: 'Violation' } },
    { o: { x: 'stop_grace_period: 90s; the longest email job takes about 5 s' }, a: { v: 'OK' } },
    { o: { x: 'queue.add(\'invoice\', data, { jobId: \'invoice:\' + orderId })' }, a: { v: 'Violation' } },
    { o: { x: 'job.data = { userId } and the worker reads the user from the database' }, a: { v: 'OK' } },
  ], ['Violations: a queue on an allkeys-lru Redis loses jobs silently (18,118 of 20,000 in the measurement); a worker in the web process shares its event loop; exiting on SIGTERM abandons running jobs to the stalled mechanism; an absolute waiting threshold misses trends, failures and a stuck short queue; a colon in a custom jobId throws. OK: attempts + backoff with an idempotent handler, retention with failures kept longer, a grace period longer than the longest job, ids-only payloads.', 'Vi phạm: hàng đợi trên Redis allkeys-lru mất job lặng lẽ (18.118 trên 20.000 trong phép đo); worker trong tiến trình web dùng chung event loop; thoát ngay khi SIGTERM bỏ mặc job đang chạy cho cơ chế treo; ngưỡng waiting tuyệt đối bỏ sót xu hướng, lỗi và một hàng đợi ngắn bị kẹt; dấu hai chấm trong jobId tự đặt làm ném lỗi. Ổn: attempts + backoff với handler luỹ đẳng, lưu giữ với job hỏng giữ lâu hơn, thời gian ân hạn dài hơn job dài nhất, payload chỉ có id.'])],
  goiY: [['Go through the checklist: Redis policy, process, retries, shutdown, retention, alerts.', 'Đi qua danh sách kiểm tra: chính sách Redis, tiến trình, thử lại, tắt, lưu giữ, cảnh báo.'], ['Then the traps: jobId format, payload content.', 'Rồi tới các bẫy: định dạng jobId, nội dung payload.']],
  loi: [['Accepting the shared cache Redis “because it is only emails”.', 'Chấp nhận Redis cache dùng chung "vì chỉ là email thôi".'], ['Thinking process.exit(0) on SIGTERM is a graceful shutdown.', 'Tưởng process.exit(0) khi SIGTERM là tắt êm.']],
  tns: [tn('production checklist', 'danh sách kiểm tra production', 'Redis riêng noeviction · worker riêng · attempts + backoff + luỹ đẳng · SIGTERM · dọn dẹp · cảnh báo')],
  kn: ['operations'],
});

export default modul('nodejs-13-lab-email-queue', 'Lab 13 — The Notes API email queue', [L1, L2, L3], 'nodejs-13-5-worker-chet-va-van-hanh');
