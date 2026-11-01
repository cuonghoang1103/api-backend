/** API Design · 10.2 — Hàng đợi và worker: BullMQ trên Redis, thử lại lùi dần, khoá việc, đóng êm (output thật bài 10.2). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Queues and workers 1 — What happened in each failure', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 10.2: LABFLOW_JOBS=memory vs bullmq, node src/worker.js, kill -9 and SIGTERM during a 10-second export.',
  vi: 'Những điều từ bài 10.2: LABFLOW_JOBS=memory và bullmq, node src/worker.js, kill -9 và SIGTERM giữa một lượt xuất 10 giây.',
  cau: [
    q('c1', ['With LABFLOW_JOBS=memory the API restarted while job_1 was at 17%. What did GET /v2/jobs/job_1 answer afterwards?', 'Với LABFLOW_JOBS=memory, API khởi động lại khi job_1 đang ở 17%. Sau đó GET /v2/jobs/job_1 trả gì?'],
      ['404 JOB_NOT_FOUND — the job lived only in the API process’s Map', '200 with status queued — the API re-created the job from its access log', '200 with status running at 17% — progress is kept in the client’s cookie', '503 — the API refuses job requests until the old process comes back'],
      ['An order written only in the waiter’s head is lost when the waiter goes home. BullMQ keeps the ticket in Redis.', 'Đơn chỉ ghi trong đầu người phục vụ thì mất khi người đó về. BullMQ giữ phiếu trong Redis.']),
    q('c2', ['The worker got SIGTERM at second 3 of a 10-second export. What did the log show?', 'Worker nhận SIGTERM ở giây thứ 3 của lượt xuất 10 giây. Log ghi gì?'],
      ['“đóng êm”, then the job finished at second 10, and only then the process exited', 'The job stopped at once and went back to waiting, then another worker redid it', 'The job was marked failed with reason SIGTERM and the client saw error.detail', 'Nothing: SIGTERM is ignored by Node, so the deploy waited forever for it'],
      ['worker.close() stops taking new jobs and finishes the current ones. Docker allows 10 s before SIGKILL — longer jobs need a longer stop timeout or checkpoints.', 'worker.close() thôi nhận việc mới, làm nốt việc đang giữ. Docker cho 10 s trước SIGKILL — việc dài hơn cần stop timeout dài hơn hoặc checkpoint.']),
    q('c3', ['Why must the Redis that holds the queue never use allkeys-lru?', 'Vì sao Redis chứa hàng đợi không bao giờ được dùng allkeys-lru?'],
      ['Eviction may silently delete job hashes and state lists, so promised jobs vanish', 'BullMQ refuses to start when it detects any eviction policy on the server', 'LRU eviction makes XADD slower than the worker’s lock renewal interval', 'allkeys-lru turns every job key into a volatile key with a one-hour TTL'],
      ['A job is a Redis hash (atm = attempts made) and its states are lists: a cache policy treats them as disposable.', 'Một việc là một hash Redis (atm = số lần đã thử), trạng thái là các danh sách: chính sách cache coi chúng là đồ bỏ được.']),
    q('c4', ['A healthy worker runs scryptSync in a loop for 20 s. What can happen to its job?', 'Một worker khoẻ chạy scryptSync liên tục 20 s. Việc của nó có thể bị gì?'],
      ['The lock is not renewed, the job is declared stalled and runs a second time', 'Nothing — a lock is renewed by Redis itself as long as the TCP connection is open', 'The job fails at once with a timeout error and is never retried again', 'BullMQ moves the job to a worker thread so the event loop is free again'],
      ['The lock is renewed by a timer on the event loop; a blocked loop looks exactly like a dead worker.', 'Khoá được gia hạn bằng bộ hẹn giờ trên event loop; loop bị chặn trông y như worker đã chết.']),
  ],
  goiY: [['Ask: where does the job live, and who keeps it alive?', 'Hỏi: việc nằm ở đâu, ai giữ cho nó sống?'], ['A crash and a deploy are different signals.', 'Sập và deploy là hai tín hiệu khác nhau.']],
  loi: [['Keeping background jobs in the API’s memory.', 'Giữ việc nền trong bộ nhớ của API.'], ['Running CPU-heavy work on the worker’s event loop.', 'Chạy việc nặng CPU trên event loop của worker.']],
  tns: [tn('queue', 'hàng đợi'), tn('graceful shutdown', 'đóng êm'), tn('eviction', 'đẩy khoá ra khi thiếu bộ nhớ')],
  kn: ['queues', 'workers'],
});

function backoffDelays(attempts, delayMs) {
  const out = [];
  for (let made = 1; made < attempts; made++) out.push(delayMs * 2 ** (made - 1));   // sau lần hỏng thứ `made`
  return out;
}
const E2 = jsBai({
  ten: 'Queues and workers 2 — Write backoffDelays(attempts, delayMs)', kho: 'EASY', phut: 8,
  en: `<p>A job is added with <code>attempts</code> and exponential backoff from <code>delayMs</code>: after the 1st failure wait <code>delayMs</code>, after the 2nd <code>2·delayMs</code>, after the 3rd <code>4·delayMs</code>… There is no wait after the last attempt. Return the list of waits (ms) between attempts — <code>attempts − 1</code> numbers.</p>`,
  vi: `<p>Một việc được thêm với <code>attempts</code> và lùi dần theo cấp số nhân từ <code>delayMs</code>: sau lần hỏng thứ 1 chờ <code>delayMs</code>, sau lần thứ 2 chờ <code>2·delayMs</code>, sau lần thứ 3 chờ <code>4·delayMs</code>… Sau lần cuối không chờ nữa. Trả danh sách thời gian chờ (ms) giữa các lần thử — <code>attempts − 1</code> số.</p>`,
  dauVao: ['attempts — integer ≥ 1; delayMs — number', 'attempts — số nguyên ≥ 1; delayMs — số'],
  dauRa: ['number[] (length attempts − 1)', 'number[] (dài attempts − 1)'],
  goiY: [['The k-th wait is delayMs · 2^(k−1).', 'Lần chờ thứ k là delayMs · 2^(k−1).'], ['attempts = 1 ⇒ no retry ⇒ [].', 'attempts = 1 ⇒ không thử lại ⇒ [].']],
  loi: [['Linear backoff (2, 4, 6 s): a restarting service gets hammered.', 'Lùi tuyến tính (2, 4, 6 s): dịch vụ đang khởi động lại bị dội.'], ['Adding a wait after the last attempt.', 'Thêm một lần chờ sau lần thử cuối.']],
  gt: ['Measured with ATTENDANCE_DOWN=1 and attempts: 3, delay 2000: attempt 2 started 2.0 s after the first failure, attempt 3 4.1 s after the second — then failed, with the reason in error.detail.', 'Đo với ATTENDANCE_DOWN=1 và attempts: 3, delay 2000: lần 2 bắt đầu 2,0 s sau lần hỏng đầu, lần 3 bắt đầu 4,1 s sau lần hỏng thứ hai — rồi failed, lý do nằm trong error.detail.'],
  kn: ['queues', 'retries'],
  tns: [tn('exponential backoff', 'lùi dần theo cấp số nhân'), tn('attempts', 'số lần thử tối đa')],
  dau: `/** waits between attempts of one job */
function backoffDelays(attempts, delayMs) {
  // Write your solution here
  return Array.from({ length: attempts - 1 }, (_, i) => delayMs * (i + 1));
}
`,
  giai: '// Reference solution\n' + nguon(backoffDelays),
  cases: [
    { goi: goi('backoffDelays', 3, 2000), moTa: ['LabFlow’s export jobs', 'Việc xuất của LabFlow'] },
    { goi: goi('backoffDelays', 5, 1000), moTa: ['The practice task: 1 s, 5 attempts', 'Bài thực hành: 1 s, 5 lần'] },
    { goi: goi('backoffDelays', 1, 2000), an: true },
    { goi: goi('backoffDelays', 8, 30000), an: true },
  ],
});

function stallRecovery(lockMs, killAt, checks) {
  const step = lockMs / 2;                                     // worker gia hạn khoá mỗi lockMs/2 khi còn sống
  const alive = (t) => killAt === null || t < killAt;
  let marked = false, prev = -1;
  for (const c of checks) {
    let last = Math.floor(c / step) * step;                    // lần gia hạn gần nhất ≤ c …
    while (!alive(last)) last -= step;                         // … mà worker còn sống để làm
    if (last > prev) marked = false;                           // gia hạn sau lần kiểm trước ⇒ bỏ dấu
    if (marked && c >= last + lockMs) return c;                // đã đánh dấu + khoá hết hạn ⇒ trả về hàng chờ
    marked = true; prev = c;                                   // còn đang chạy ⇒ đánh dấu, kiểm lần sau
  }
  return null;
}
const E3 = jsBai({
  ten: 'Queues and workers 3 — Write stallRecovery(lockMs, killAt, checks): why 34 s, not 15', kho: 'HARD', phut: 25,
  en: `<p>In lesson 10.2 worker w1 was killed 4 s into job_1 (<code>lockDuration</code> 15 s), yet w2 restarted the job only about 34 s after it began. Model BullMQ’s rules (times in ms from the job start):</p><ul><li>While alive, the worker renews the lock at <code>0, lockMs/2, lockMs, …</code> — only at times <code>&lt; killAt</code> (<code>killAt = null</code>: never killed). The lock expires <code>lockMs</code> after the last renewal.</li><li>A stalled check runs at each time in <code>checks</code> (ascending). At a check: if the job was <b>marked</b> by an earlier check, no renewal happened since that mark, and the lock has expired (<code>check ≥ expiry</code>), the job goes back to waiting — return that check time. Otherwise the job is (re)marked.</li><li>A renewal at the same time as a check happens first. Return <code>null</code> if the job is never moved.</li></ul>`,
  vi: `<p>Ở bài 10.2 worker w1 bị giết khi job_1 mới chạy 4 s (<code>lockDuration</code> 15 s), vậy mà w2 chỉ chạy lại việc khoảng 34 s sau khi nó bắt đầu. Mô phỏng luật của BullMQ (thời gian tính bằng ms từ lúc việc bắt đầu):</p><ul><li>Khi còn sống, worker gia hạn khoá ở <code>0, lockMs/2, lockMs, …</code> — chỉ ở các thời điểm <code>&lt; killAt</code> (<code>killAt = null</code>: không bị giết). Khoá hết hạn <code>lockMs</code> sau lần gia hạn cuối.</li><li>Một lượt kiểm "bỏ dở" chạy ở mỗi thời điểm trong <code>checks</code> (tăng dần). Ở mỗi lượt: nếu việc đã bị <b>đánh dấu</b> ở lượt trước, không có lần gia hạn nào kể từ dấu đó, và khoá đã hết hạn (<code>check ≥ hạn</code>), việc quay về hàng chờ — trả thời điểm lượt kiểm đó. Ngược lại việc được đánh dấu (lại).</li><li>Gia hạn trùng thời điểm với lượt kiểm thì xảy ra trước. Trả <code>null</code> nếu việc không bao giờ bị đưa về.</li></ul>`,
  dauVao: ['lockMs — even number; killAt — number &gt; 0 | null; checks — ascending numbers', 'lockMs — số chẵn; killAt — số &gt; 0 | null; checks — các số tăng dần'],
  dauRa: ['the check time that moves the job, or null', 'thời điểm lượt kiểm đưa việc về, hoặc null'],
  goiY: [['For a check at c, the last renewal is the largest multiple of lockMs/2 that is ≤ c and &lt; killAt.', 'Với lượt kiểm ở c, lần gia hạn cuối là bội lớn nhất của lockMs/2 mà ≤ c và &lt; killAt.'], ['Keep two variables: marked, and the time of the previous check — a renewal after it clears the mark.', 'Giữ hai biến: marked, và thời điểm lượt kiểm trước — một lần gia hạn sau đó xoá dấu.']],
  loi: [['Returning the first check after the lock expired: a job needs to be seen twice, so recovery takes up to one more interval.', 'Trả lượt kiểm đầu tiên sau khi khoá hết hạn: việc phải bị thấy hai lần, nên hồi phục mất thêm tới một khoảng kiểm.'], ['Counting renewals after killAt — a dead worker renews nothing.', 'Tính cả lần gia hạn sau killAt — worker đã chết thì không gia hạn gì.']],
  gt: ['Kill at 4,000 ms: last renewal 0, lock expires at 15,000. w2’s checks run at 19,300 (mark) and 34,300 (move) — the log’s 01:07:38.587, 34.3 s after 01:07:04.272. A stall is not a failed attempt (“lần 1, đã bị bỏ dở 1 lần”), and the job restarted from 0% because nothing was checkpointed.', 'Giết ở 4.000 ms: lần gia hạn cuối ở 0, khoá hết hạn ở 15.000. Lượt kiểm của w2 chạy ở 19.300 (đánh dấu) và 34.300 (đưa về) — đúng 01:07:38.587 trong log, 34,3 s sau 01:07:04.272. Bị bỏ dở không tính là một lần thử hỏng (“lần 1, đã bị bỏ dở 1 lần”), và việc chạy lại từ 0% vì không có checkpoint.'],
  kn: ['queues', 'workers', 'failure handling'],
  tns: [tn('lock renewal', 'gia hạn khoá'), tn('stalled check', 'lượt kiểm việc bị bỏ dở'), tn('checkpoint', 'mốc tiến độ đã lưu')],
  dau: `/** when does a killed worker's job go back to waiting? */
function stallRecovery(lockMs, killAt, checks) {
  // Write your solution here
  if (killAt === null) return null;
  return checks.find((c) => c >= killAt + lockMs) ?? null;
}
`,
  giai: '// Reference solution\n' + nguon(stallRecovery),
  cases: [
    { goi: goi('stallRecovery', 15000, 4000, [19300, 34300, 49300]), moTa: ['Lesson 10.2: kill at 4 s', 'Bài 10.2: giết ở giây 4'] },
    { goi: goi('stallRecovery', 15000, null, [19300, 34300, 49300]), moTa: ['Never killed', 'Không bị giết'] },
    { goi: goi('stallRecovery', 5000, 4000, [3000, 6000, 9000, 12000]), an: true },
    { goi: goi('stallRecovery', 15000, 9000, [15000, 20000, 25000, 30000]), an: true },
    { goi: goi('stallRecovery', 15000, 4000, [19300]), an: true },
    { goi: goi('stallRecovery', 10000, 21000, [10000, 20000, 30000, 40000]), an: true },
  ],
});

export default doiDau({ slug: 'api-10-1-worker', ten: '10.2 Queues and workers: where a job really runs', khoa: KHOA, baiHoc: 'api-10-1-worker', de: [E1, E2, E3] });
