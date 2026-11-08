/** Node.js · 13.5 — Khi worker chết: job treo (khoá + stalledInterval), job chặn event loop chạy hai lần, SIGTERM, dọn dẹp, add() treo khi Redis sập. */
import { modul, cs, q, tn, ord, jsBai, c, TN, FAKE_HTTP } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '13.5 · Killed, blocked, deployed: what survives?', kho: 'EASY', phut: 10,
  en: 'The lesson killed a worker on purpose, mid-job, and measured what survived. Each question is one of those runs.',
  vi: 'Bài cố ý giết worker giữa lúc đang làm job và đo xem cái gì sống sót. Mỗi câu là một lần chạy đó.',
  cau: [
    q('c1', ['SIGKILL in the middle of a job. Right after: active=1, waiting=0. 2,036 ms later a new worker picked it up and a "stalled" event fired. What mechanism rescued it?', 'SIGKILL giữa lúc job đang chạy. Ngay sau đó: active=1, waiting=0. 2.036 ms sau một worker mới nhặt lại nó và sự kiện "stalled" xảy ra. Cơ chế nào đã cứu nó?'],
      ['The per-job lock: nobody renewed it, it expired, and another worker’s stalled check moved the job back to wait', 'Redis persistence: the AOF replayed the job when the worker restarted', 'The SIGKILL handler, which put the job back before the process exited', 'BullMQ’s daemon process, which monitors every worker over TCP'],
      ['A worker holds a lock (lockDuration, default 30 s) and renews it while it works. With the defaults the same rescue took 60,070 ms — lock expiry plus the next stalled check.', 'Worker giữ một khoá (lockDuration, mặc định 30 s) và gia hạn nó trong lúc làm. Với cấu hình mặc định, cùng lần cứu đó mất 60.070 ms — khoá hết hạn cộng lần kiểm treo kế tiếp.']),
    q('c2', ['lockDuration 1 s. A job that AWAITS for 3 s completes fine; a job that spins in a while loop for 3 s runs twice and ends with "Missing lock for job 1. moveToFinished". Why?', 'lockDuration 1 s. Job AWAIT 3 s hoàn tất êm; job quay vòng while 3 s chạy hai lần và kết thúc bằng "Missing lock for job 1. moveToFinished". Vì sao?'],
      ['The renewal timer runs on the event loop; a blocking handler stops it, so the job is declared stalled and re-run', 'while loops are forbidden in BullMQ handlers', 'Awaiting renews the lock automatically, a loop releases it on purpose', 'The second run was a retry because the first threw an error'],
      ['Chapter 2.4 with a new consequence: there it cost latency, here it costs correctness. CPU-heavy work needs a sandboxed processor, a worker thread or a separate process — never a tighter lockDuration.', 'Chương 2.4 với một hậu quả mới: ở đó tốn độ trễ, ở đây tốn tính đúng đắn. Việc nặng CPU cần sandboxed processor, worker thread hoặc tiến trình riêng — không bao giờ là lockDuration chặt hơn.']),
    q('c3', ['A deploy sends SIGTERM. With a handler: exits after 1,296 ms, job completed. Without: exits after 5 ms. What happens to the job in the second case?', 'Một lần deploy gửi SIGTERM. Có handler: thoát sau 1.296 ms, job xong. Không có: thoát sau 5 ms. Job ở trường hợp hai ra sao?'],
      ['It is cut mid-way, sits in active, is rescued only by the stalled mechanism later — and then runs a second time', 'It is lost forever, because SIGTERM deletes the lock', 'It completes anyway, because Node finishes pending promises before exiting', 'It moves to failed with reason SIGTERM'],
      ['Not lost either way — but “eventually” is up to lockDuration + stalledInterval away, and the work runs again. Multiply by every deploy.', 'Không mất ở cả hai cách — nhưng "rồi sẽ được" có thể là lockDuration + stalledInterval sau, và việc chạy lại lần nữa. Nhân với mọi lần deploy.']),
    q('c4', ['Your jobs take up to 60 s and you deploy with Docker’s defaults. What else must you change?', 'Job của bạn mất tới 60 s và bạn deploy với mặc định của Docker. Còn phải đổi gì?'],
      ['Raise stop_grace_period above your longest job — Docker sends SIGKILL 10 s after SIGTERM', 'Nothing: worker.close() blocks SIGKILL until the jobs finish', 'Set lockDuration to 10 s so jobs finish before the kill', 'Use SIGINT instead of SIGTERM for deploys'],
      ['Or keep jobs short: a job you finish in a few seconds makes graceful shutdown trivial, a 20-minute job makes every deploy a decision.', 'Hoặc giữ job ngắn: job xong trong vài giây làm tắt êm trở nên dễ dàng, job 20 phút làm mỗi lần deploy là một quyết định.']),
    q('c5', ['3,000 completed jobs with no cleanup kept 3,000 records (+3.94 MB); with removeOnComplete: 100, +0.49 MB. Why keep FAILED jobs much longer than completed ones?', '3.000 job xong không dọn giữ lại 3.000 bản ghi (+3,94 MB); với removeOnComplete: 100 là +0,49 MB. Vì sao giữ job HỎNG lâu hơn hẳn job xong?'],
      ['A failed job is evidence you will replay after the fix', 'Failed jobs are smaller because they have no returnvalue', 'BullMQ cannot delete failed jobs automatically', 'Completed jobs block the wait list until they are removed'],
      ['removeOnComplete: { age: 3600, count: 1000 }, removeOnFail: { age: 7 days }. Leave both unset and Redis grows until it refuses writes with OOM.', 'removeOnComplete: { age: 3600, count: 1000 }, removeOnFail: { age: 7 ngày }. Bỏ trống cả hai thì Redis lớn dần tới khi từ chối ghi với OOM.']),
    q('c6', ['Redis is down. What does queue.add() do (BullMQ 6.7.2, measured)?', 'Redis sập. queue.add() làm gì (BullMQ 6.7.2, đã đo)?'],
      ['It hangs — no answer after 15 s, even with enableOfflineQueue: false — and your HTTP route hangs with it', 'It throws ECONNREFUSED at once', 'It stores the job in memory and sends it when Redis returns', 'It returns null so the caller can retry'],
      ['Wrap it in a timeout (Promise.race, ~1 s) and decide per queue: a welcome email fails open (the signup still succeeds), a payment fails closed.', 'Bọc nó trong một giới hạn thời gian (Promise.race, ~1 s) và quyết định theo từng hàng đợi: email chào mừng thì fail-open (đăng ký vẫn thành công), thanh toán thì fail-closed.']),
  ],
  goiY: [['Every rescue is the 12.4 lock with a TTL, applied per job.', 'Mọi lần cứu đều là khoá có TTL của 12.4, áp cho từng job.'], ['Ask what keeps running on the event loop while a handler works.', 'Hỏi xem thứ gì vẫn phải chạy trên event loop trong lúc handler làm việc.']],
  loi: [['Tightening lockDuration to “detect stalls faster” for a CPU-heavy job — it only makes the double run arrive sooner.', 'Siết lockDuration để "phát hiện treo nhanh hơn" cho job nặng CPU — chỉ làm lần chạy đôi tới sớm hơn.'], ['No SIGTERM handler: every deploy abandons the running jobs.', 'Không có handler SIGTERM: mỗi lần deploy bỏ dở các job đang chạy.']],
  tns: [TN.stalled, tn('lockDuration', 'thời hạn khoá job', 'worker phải gia hạn trước khi hết; mặc định 30 s'), tn('graceful shutdown', 'tắt êm', 'ngừng nhận job mới, làm nốt job đang chạy rồi mới thoát')],
  kn: ['stalled jobs', 'graceful shutdown'],
});

const E2 = cs({
  ten: '13.5 · A graceful shutdown, in order', kho: 'EASY', phut: 6, loai: 'order',
  en: 'docker stop sends SIGTERM to the worker process. Order what the shutdown handler of the lesson does, from the signal to the exit.',
  vi: 'docker stop gửi SIGTERM tới tiến trình worker. Sắp thứ tự những gì handler tắt của bài làm, từ tín hiệu tới lúc thoát.',
  cau: [ord('o1', ['From SIGTERM to exit', 'Từ SIGTERM tới lúc thoát'], [
    'process.on(\'SIGTERM\') fires and logs “shutting down worker”',
    'await worker.close() — stop taking NEW jobs, wait for the running ones to finish',
    'await queue.close()',
    'await redis.quit() — close the shared connection last, everything above still needed it',
    'process.exit(0) — before Docker’s grace period ends and SIGKILL arrives',
  ], ['The worker must stop taking work before anything else closes, and Redis must close last because both the worker and the queue use it. All of it has to fit in stop_grace_period (10 s by default).', 'Worker phải ngừng nhận việc trước khi bất cứ thứ gì khác đóng, và Redis phải đóng sau cùng vì cả worker lẫn queue đều dùng nó. Tất cả phải gọn trong stop_grace_period (mặc định 10 s).'])],
  goiY: [['What still needs Redis while the last job finishes?', 'Thứ gì còn cần Redis trong lúc job cuối làm nốt?'], ['Exit only after the work is done.', 'Chỉ thoát khi việc đã xong.']],
  loi: [['Closing Redis first: the running job cannot record its completion.', 'Đóng Redis trước: job đang chạy không ghi được việc hoàn tất của nó.'], ['process.exit(0) straight away: the 5 ms exit that leaves the job stuck in active.', 'process.exit(0) ngay lập tức: lần thoát 5 ms để job kẹt ở active.']],
  tns: [tn('SIGTERM', 'tín hiệu xin dừng', 'bắt và xử lý được — khác SIGKILL'), tn('stop_grace_period', 'thời gian ân hạn khi dừng', 'Docker chờ chừng này rồi gửi SIGKILL')],
  kn: ['graceful shutdown'],
});

const E3 = jsBai({
  ten: '13.5 · The stalled-job check', kho: 'MEDIUM', phut: 15,
  en: `<p>Every ${c('stalledInterval')}, a worker looks at the ACTIVE jobs. A job whose lock expired (${c('lockUntil <= now')}) has nobody working on it any more. BullMQ moves it back to wait — unless it has already stalled ${c('maxStalledCount')} times (default 1), in which case it fails with the reason ${c("'job stalled more than allowable limit'")}. Write ${c('checkStalled(active, now, maxStalledCount = 1)')}:</p><ul><li>${c('active')} is ${c('[{ id, lockUntil, stalledCount }]')};</li><li>a live lock (${c('lockUntil > now')}) ⇒ the id goes to ${c('stillActive')};</li><li>an expired lock ⇒ ${c('stalledCount + 1')}; if that is greater than ${c('maxStalledCount')} ⇒ ${c('failed')} as ${c('{ id, reason }')}, otherwise ⇒ ${c('toWait')} as ${c('{ id, stalledCount }')};</li><li>return ${c('{ stillActive, toWait, failed }')} in input order.</li></ul>`,
  vi: `<p>Cứ mỗi ${c('stalledInterval')}, một worker nhìn các job ACTIVE. Job có khoá đã hết hạn (${c('lockUntil <= now')}) không còn ai làm nữa. BullMQ đưa nó về wait — trừ khi nó đã treo ${c('maxStalledCount')} lần (mặc định 1), khi đó nó hỏng với lý do ${c("'job stalled more than allowable limit'")}. Viết ${c('checkStalled(active, now, maxStalledCount = 1)')}:</p><ul><li>${c('active')} là ${c('[{ id, lockUntil, stalledCount }]')};</li><li>khoá còn sống (${c('lockUntil > now')}) ⇒ id vào ${c('stillActive')};</li><li>khoá đã hết ⇒ ${c('stalledCount + 1')}; nếu lớn hơn ${c('maxStalledCount')} ⇒ ${c('failed')} dạng ${c('{ id, reason }')}, ngược lại ⇒ ${c('toWait')} dạng ${c('{ id, stalledCount }')};</li><li>trả ${c('{ stillActive, toWait, failed }')} theo thứ tự đầu vào.</li></ul>`,
  yc: [['A job whose lock is still valid is never touched — however long it has been running.', 'Job có khoá còn hiệu lực không bao giờ bị đụng — dù đã chạy bao lâu.'], ['maxStalledCount defaults to 1.', 'maxStalledCount mặc định là 1.'], ['Do not modify the input.', 'Không sửa dữ liệu vào.']],
  dauVao: ['active — [{ id, lockUntil, stalledCount }] · now — ms · maxStalledCount — number', 'active — [{ id, lockUntil, stalledCount }] · now — ms · maxStalledCount — số'],
  dauRa: ['{ stillActive: id[], toWait: { id, stalledCount }[], failed: { id, reason }[] }', '{ stillActive: id[], toWait: { id, stalledCount }[], failed: { id, reason }[] }'],
  goiY: [['The only question about a running job is: is its lock still alive? Not: how long has it run?', 'Câu hỏi duy nhất với job đang chạy là: khoá của nó còn sống không? Không phải: nó đã chạy bao lâu?'], ['const n = (j.stalledCount || 0) + 1; n > maxStalledCount ? failed : toWait.', 'const n = (j.stalledCount || 0) + 1; n > maxStalledCount ? failed : toWait.']],
  loi: [['Declaring a job stalled because it has been active for a long time: long-but-healthy jobs (the 3-second await) renew their lock and must be left alone.', 'Coi job là treo vì nó active đã lâu: job dài mà khoẻ (lần await 3 giây) có gia hạn khoá và phải được để yên.'], ['Re-queueing forever: a job that blocks the event loop stalls on every run and never ends — maxStalledCount is what turns it into a visible failure.', 'Xếp lại mãi mãi: job chặn event loop treo ở mọi lần chạy và không bao giờ kết thúc — maxStalledCount là thứ biến nó thành một lỗi nhìn thấy được.'], ['Using < instead of <= for the expiry: a lock that expired exactly now is not dead yet in your code, and the rescue is delayed by one whole interval.', 'Dùng < thay vì <= cho hạn: khoá vừa hết đúng lúc này trong code bạn chưa chết, và lần cứu bị lùi cả một chu kỳ.']],
  gt: ['This is the distributed lock of 12.4 applied per job: liveness is proven by renewal, not by elapsed time. A dead worker stops renewing, the lock expires, and the next check returns the job to wait — the 2,036 ms rescue. The counter is what keeps a job that blocks the event loop from bouncing between active and wait forever: after the allowed number of stalls it fails, and the failed set tells you why.', 'Đây là khoá phân tán của 12.4 áp cho từng job: sự sống được chứng minh bằng việc gia hạn, không bằng thời gian đã trôi. Worker chết thôi gia hạn, khoá hết hạn, và lần kiểm kế đưa job về wait — lần cứu 2.036 ms. Bộ đếm là thứ giữ cho job chặn event loop không nảy qua lại giữa active và wait mãi mãi: sau số lần treo cho phép nó hỏng, và tập failed cho bạn biết vì sao.'],
  kn: ['stalled jobs', 'locks'], tns: [TN.stalled, tn('maxStalledCount', 'số lần treo tối đa', 'quá số này job bị đánh hỏng thay vì xếp lại')],
  dau: `/** One pass of the stalled-job check. */
function checkStalled(active, now, maxStalledCount = 1) {
  // Write your solution here — "long-running" is not "stalled"
  const stillActive = [], toWait = [], failed = [];
  for (const j of active) {
    if (now - (j.lockUntil - 30000) > 30000) toWait.push({ id: j.id, stalledCount: j.stalledCount + 1 });
    else stillActive.push(j.id);
  }
  return { stillActive, toWait, failed };
}
`,
  giai: `/** One pass of the stalled-job check (what every worker runs each stalledInterval). */
function checkStalled(active, now, maxStalledCount = 1) {
  const stillActive = [], toWait = [], failed = [];
  for (const j of active) {
    if (j.lockUntil > now) { stillActive.push(j.id); continue; }   // someone is renewing it: alive, however long
    const n = (j.stalledCount || 0) + 1;                            // the lock is dead: nobody works on this job
    if (n > maxStalledCount) failed.push({ id: j.id, reason: 'job stalled more than allowable limit' });
    else toWait.push({ id: j.id, stalledCount: n });                // back to wait: another worker will run it AGAIN
  }
  return { stillActive, toWait, failed };
}
`,
  chung: `const now = 1000000;
const A = (id, lockIn, stalledCount = 0) => ({ id: String(id), lockUntil: now + lockIn, stalledCount });`,
  cases: [
    { goi: `checkStalled([A(1, 5000), A(2, -1), A(3, 0)], now)`, moTa: ['Alive / expired / expired exactly now', 'Còn sống / đã hết / hết đúng lúc này'] },
    { goi: `checkStalled([A(4, -10, 1), A(5, -10, 0)], now)`, moTa: ['A job that already stalled once fails (default limit 1)', 'Job đã treo một lần thì hỏng (giới hạn mặc định 1)'] },
    { goi: `checkStalled([A(6, -10, 1), A(7, -10, 2)], now, 3)`, moTa: ['A higher limit re-queues more', 'Giới hạn cao hơn thì xếp lại nhiều hơn'] },
    { goi: `(() => { const xs = [A(8, 999999), A(9, -1, 0)]; const r = checkStalled(xs, now); return [r, xs[1].stalledCount]; })()`, an: true },
    { goi: `[checkStalled([], now), checkStalled([{ id: '10', lockUntil: now - 1 }], now)]`, an: true },
  ],
});

const E4 = jsBai({
  ten: '13.5 · removeOnComplete: { age, count }', kho: 'MEDIUM', phut: 15,
  en: `<p>Completed jobs are kept by default, forever — 3,000 trivial jobs cost 3.94 MB. Write ${c('prune(jobs, now, keep)')} that applies a retention rule like ${c('removeOnComplete: { age: 3600, count: 1000 }')}: keep a job only if it finished less than ${c('age')} SECONDS ago (${c('now - finishedOn < age * 1000')}) <b>and</b> it is among the ${c('count')} most recently finished. Either field may be missing (no limit of that kind). Return ${c('{ kept, removed }')} — two arrays of ids, newest first; ties on ${c('finishedOn')} go to the larger id first.</p>`,
  vi: `<p>Job đã xong được giữ mặc định, mãi mãi — 3.000 job vặt tốn 3,94 MB. Viết ${c('prune(jobs, now, keep)')} áp một luật lưu giữ kiểu ${c('removeOnComplete: { age: 3600, count: 1000 }')}: chỉ giữ job nếu nó xong cách đây chưa tới ${c('age')} GIÂY (${c('now - finishedOn < age * 1000')}) <b>và</b> nó nằm trong ${c('count')} job xong gần nhất. Trường nào cũng có thể vắng (không giới hạn kiểu đó). Trả ${c('{ kept, removed }')} — hai mảng id, mới nhất trước; trùng ${c('finishedOn')} thì id lớn hơn trước.</p>`,
  yc: [['age is in seconds; finishedOn and now in milliseconds.', 'age tính bằng giây; finishedOn và now bằng mili-giây.'], ['Both limits apply together (a job must satisfy both).', 'Cả hai giới hạn áp cùng lúc (job phải thoả cả hai).'], ['Do not modify jobs.', 'Không sửa jobs.']],
  dauVao: ['jobs — [{ id, finishedOn }] · now — ms · keep — { age?, count? }', 'jobs — [{ id, finishedOn }] · now — ms · keep — { age?, count? }'],
  dauRa: ['{ kept: string[], removed: string[] } — newest first', '{ kept: string[], removed: string[] } — mới nhất trước'],
  goiY: [['Sort a copy newest first: (a, b) => b.finishedOn - a.finishedOn || Number(b.id) - Number(a.id).', 'Sắp một bản sao mới nhất trước: (a, b) => b.finishedOn - a.finishedOn || Number(b.id) - Number(a.id).'], ['Walk it with an index i: young = keep.age == null || now - j.finishedOn < keep.age * 1000; within = keep.count == null || i < keep.count.', 'Đi qua nó với chỉ số i: young = keep.age == null || now - j.finishedOn < keep.age * 1000; within = keep.count == null || i < keep.count.']],
  loi: [['Comparing age (seconds) with milliseconds: everything older than 3.6 s is deleted.', 'So age (giây) với mili-giây: mọi thứ cũ hơn 3,6 s bị xoá.'], ['Keeping the FIRST count jobs in the array instead of the newest — the history you keep is last month’s.', 'Giữ count job ĐẦU mảng thay vì mới nhất — lịch sử bạn giữ là của tháng trước.'], ['Treating { count } alone as also “no older than an hour” (or the reverse): a missing field means no limit of that kind.', 'Coi { count } một mình cũng là "không cũ hơn một giờ" (hoặc ngược lại): trường vắng nghĩa là không giới hạn kiểu đó.']],
  gt: ['Retention is two caps on one ordering: by recency of completion. Sorting newest-first makes the count cap a prefix, and the age cap a filter on the same pass. Set it on every queue — and keep failures far longer than successes, because the failed set is what you replay after a fix.', 'Lưu giữ là hai cái trần trên cùng một thứ tự: độ gần của lúc hoàn tất. Sắp mới-nhất-trước biến trần count thành một tiền tố, còn trần age là bộ lọc trong cùng một lượt đi. Đặt nó cho mọi hàng đợi — và giữ job hỏng lâu hơn hẳn job thành công, vì tập failed là thứ bạn chạy lại sau khi sửa.'],
  kn: ['retention'], tns: [tn('removeOnComplete', 'dọn job đã xong', '{ age (giây), count } — giữ bao lâu, giữ bao nhiêu'), tn('retention', 'lưu giữ', 'giữ lại bao nhiêu lịch sử')],
  dau: `/** Apply removeOnComplete: { age, count }. */
function prune(jobs, now, keep) {
  // Write your solution here
  const kept = jobs.filter((j) => now - j.finishedOn < keep.age).slice(0, keep.count).map((j) => j.id);
  const removed = jobs.map((j) => j.id).filter((id) => !kept.includes(id));
  return { kept, removed };
}
`,
  giai: `/** Apply removeOnComplete: { age (seconds), count }. A missing field = no limit of that kind. */
function prune(jobs, now, keep) {
  const order = [...jobs].sort((a, b) => b.finishedOn - a.finishedOn || Number(b.id) - Number(a.id));   // newest first
  const kept = [], removed = [];
  order.forEach((j, i) => {
    const young = keep.age == null || now - j.finishedOn < keep.age * 1000;   // age is in SECONDS
    const within = keep.count == null || i < keep.count;                       // among the newest count
    (young && within ? kept : removed).push(j.id);
  });
  return { kept, removed };
}
`,
  chung: `const now = 10000000;
const J = (id, agoSec) => ({ id: String(id), finishedOn: now - agoSec * 1000 });
const jobs = [J(1, 7200), J(2, 30), J(3, 3599), J(4, 10), J(5, 3600), J(6, 5)];`,
  cases: [
    { goi: `prune(jobs, now, { age: 3600 })`, moTa: ['age 3600 s only: older than an hour is removed', 'Chỉ age 3600 s: cũ hơn một giờ bị xoá'] },
    { goi: `prune(jobs, now, { count: 2 })`, moTa: ['count 2 only: the two newest stay', 'Chỉ count 2: hai job mới nhất ở lại'] },
    { goi: `prune(jobs, now, { age: 3600, count: 3 })`, moTa: ['Both limits', 'Cả hai giới hạn'] },
    { goi: `[prune([J(7, 1), J(8, 1), J(9, 2)], now, { count: 2 }), prune(jobs, now, {}).removed]`, an: true },
    { goi: `(() => { const r = prune(jobs, now, { age: 60, count: 100 }); return [r, jobs.map((j) => j.id).join(',')]; })()`, an: true },
  ],
});

const FAKE_SLOW_Q = `// fake-queues.js — PROVIDED (loaded before answer.js).
//   emailQueue / paymentQueue: await q.add(name, data) → { id } after 2 ms; q.hang = true ⇒ add() NEVER resolves
//   (BullMQ 6.7.2 with Redis down: no answer after 15 s, even with enableOfflineQueue: false)
//   createUser(body) → { id, email } after 10 ms · q.added — what was enqueued
function makeQueue() {
  const q = { added: [], hang: false,
    add(name, data) { if (q.hang) return new Promise(() => {}); q.added.push({ name, data }); return new Promise((ok) => setTimeout(() => ok({ id: String(q.added.length) }), 2)); } };
  return q;
}
const emailQueue = makeQueue();
const paymentQueue = makeQueue();
let uid = 100;
const createUser = async (body) => { await new Promise((ok) => setTimeout(ok, 10)); return { id: ++uid, email: body.email }; };
`;

const E5 = jsBai({
  ten: '13.5 · When Redis is down, add() hangs: fail open or fail closed', kho: 'HARD', phut: 25,
  en: `<p>With Redis down, ${c('queue.add()')} does not throw — it hangs, and your HTTP route hangs with it. Write three things:</p><ol><li>${c('addWithTimeout(queue, name, data, ms = 1000)')} — resolve with what ${c('add')} resolves, or reject with ${c("Error('QUEUE_TIMEOUT')")} after ${c('ms')}. Clear the timer when ${c('add')} wins.</li><li>${c('makeSignup({ createUser, emailQueue })')} → handler: create the user, then enqueue ${c("'welcome'")} with ${c('{ userId }')} through ${c('addWithTimeout')}. If that fails, ${c("console.warn('welcome email not queued: ' + err.message)")} and STILL answer ${c('201 { id, email }')} — the user cares about the account, not the email (fail open).</li><li>${c('makeCheckout({ paymentQueue })')} → handler: enqueue ${c("'charge'")} with ${c('req.body')} (${c('{ orderId, amount }')}) through ${c('addWithTimeout')}; success ⇒ ${c('202 { jobId }')}; failure ⇒ ${c("503 { error: 'PAYMENTS_UNAVAILABLE' }")} — never pretend a payment was accepted (fail closed).</li></ol>`,
  vi: `<p>Khi Redis sập, ${c('queue.add()')} không ném lỗi — nó treo, và route HTTP của bạn treo theo. Viết ba thứ:</p><ol><li>${c('addWithTimeout(queue, name, data, ms = 1000)')} — resolve bằng thứ ${c('add')} resolve, hoặc reject với ${c("Error('QUEUE_TIMEOUT')")} sau ${c('ms')}. Xoá hẹn giờ khi ${c('add')} thắng.</li><li>${c('makeSignup({ createUser, emailQueue })')} → handler: tạo user, rồi xếp hàng ${c("'welcome'")} với ${c('{ userId }')} qua ${c('addWithTimeout')}. Nếu hỏng, ${c("console.warn('welcome email not queued: ' + err.message)")} và VẪN trả ${c('201 { id, email }')} — người dùng cần tài khoản, không cần email (fail-open).</li><li>${c('makeCheckout({ paymentQueue })')} → handler: xếp hàng ${c("'charge'")} với ${c('req.body')} (${c('{ orderId, amount }')}) qua ${c('addWithTimeout')}; thành công ⇒ ${c('202 { jobId }')}; hỏng ⇒ ${c("503 { error: 'PAYMENTS_UNAVAILABLE' }")} — không bao giờ giả vờ đã nhận một khoản thanh toán (fail-closed).</li></ol>`,
  yc: [['No route waits longer than ~1 s when Redis is down.', 'Không route nào chờ quá ~1 s khi Redis sập.'], ['Signup: fail open with a warning. Checkout: fail closed with 503.', 'Đăng ký: fail-open kèm cảnh báo. Thanh toán: fail-closed với 503.'], ['The timer is cleared when add() resolves in time.', 'Hẹn giờ được xoá khi add() resolve kịp.']],
  dauVao: ['queues and createUser from fake-queues.js · (req, res) from fake-http.js', 'hàng đợi và createUser trong fake-queues.js · (req, res) trong fake-http.js'],
  dauRa: ['addWithTimeout → Promise · makeSignup / makeCheckout → async (req, res) => void', 'addWithTimeout → Promise · makeSignup / makeCheckout → async (req, res) => void'],
  goiY: [['let t; const timeout = new Promise((_, no) => { t = setTimeout(() => no(new Error(\'QUEUE_TIMEOUT\')), ms); }); try { return await Promise.race([queue.add(name, data), timeout]); } finally { clearTimeout(t); }', 'let t; const timeout = new Promise((_, no) => { t = setTimeout(() => no(new Error(\'QUEUE_TIMEOUT\')), ms); }); try { return await Promise.race([queue.add(name, data), timeout]); } finally { clearTimeout(t); }'], ['The two handlers differ only in their catch block — and that difference is the whole decision.', 'Hai handler chỉ khác nhau ở khối catch — và khác biệt đó chính là toàn bộ quyết định.']],
  loi: [['await queue.add() with no timeout: Redis restarts and every signup request hangs until the client gives up.', 'await queue.add() không giới hạn giờ: Redis khởi động lại là mọi request đăng ký treo tới khi client bỏ cuộc.'], ['Letting the enqueue error reach the error handler: a working signup becomes a 500 because an email could not be queued.', 'Để lỗi xếp hàng chảy tới bộ xử lý lỗi: một lượt đăng ký thành công biến thành 500 chỉ vì một email không xếp được.'], ['Failing open on payments: the client is told “accepted” for a charge that was never recorded.', 'Fail-open cho thanh toán: client được báo "đã nhận" cho một khoản chưa từng được ghi lại.']],
  gt: ['Promise.race turns “hangs forever” into “fails in a second”, and finally clears the timer either way. What a failure MEANS is a product decision per queue — the same fail-open versus fail-closed choice the rate limiter made in 12.4: losing a welcome email is acceptable, silently losing a payment is not.', 'Promise.race biến "treo mãi" thành "hỏng sau một giây", và finally xoá hẹn giờ ở cả hai kết cục. Một lần hỏng có NGHĨA là gì là quyết định sản phẩm cho từng hàng đợi — đúng lựa chọn fail-open hay fail-closed mà bộ giới hạn tần suất đã làm ở 12.4: mất email chào mừng thì chấp nhận được, lặng lẽ mất một khoản thanh toán thì không.'],
  kn: ['timeouts', 'fail-open / fail-closed'], tns: [tn('fail-open', 'hỏng thì cho qua', 'phụ thuộc phụ trợ hỏng thì vẫn phục vụ'), tn('fail-closed', 'hỏng thì chặn', 'không chắc chắn thì từ chối, không giả vờ thành công'), tn('Promise.race', 'cuộc đua promise', 'lấy kết quả của promise về đích trước')],
  gia: { 'fake-queues.js': FAKE_SLOW_Q, 'fake-http.js': FAKE_HTTP },
  dau: `async function addWithTimeout(queue, name, data, ms = 1000) {
  // Write your solution here
  return queue.add(name, data);
}

function makeSignup({ createUser, emailQueue }) {
  return async (req, res) => {
    const user = await createUser(req.body);
    await addWithTimeout(emailQueue, 'welcome', { userId: user.id });
    res.status(201).json({ id: user.id, email: user.email });
  };
}

function makeCheckout({ paymentQueue }) {
  return async (req, res) => {
    const job = await addWithTimeout(paymentQueue, 'charge', req.body);
    res.status(202).json({ jobId: job.id });
  };
}
`,
  giai: `/** queue.add() with a deadline: Redis down ⇒ add() hangs, so race it against a timer. */
async function addWithTimeout(queue, name, data, ms = 1000) {
  let t;
  const timeout = new Promise((_, no) => { t = setTimeout(() => no(new Error('QUEUE_TIMEOUT')), ms); });
  try {
    return await Promise.race([queue.add(name, data), timeout]);
  } finally {
    clearTimeout(t);                       // add() won (or lost): the timer must not linger
  }
}

/** Signup: the account matters, the email does not — FAIL OPEN. */
function makeSignup({ createUser, emailQueue }) {
  return async (req, res) => {
    const user = await createUser(req.body);
    try {
      await addWithTimeout(emailQueue, 'welcome', { userId: user.id });
    } catch (err) {
      console.warn('welcome email not queued: ' + err.message);   // visible, but not the user's problem
    }
    res.status(201).json({ id: user.id, email: user.email });
  };
}

/** Checkout: never pretend a payment was accepted — FAIL CLOSED. */
function makeCheckout({ paymentQueue }) {
  return async (req, res) => {
    try {
      const job = await addWithTimeout(paymentQueue, 'charge', req.body);
      res.status(202).json({ jobId: job.id });
    } catch (err) {
      res.status(503).json({ error: 'PAYMENTS_UNAVAILABLE' });
    }
  };
}
`,
  chung: `const call = async (h, body) => { const req = mkReq({ method: 'POST', body }); const res = mkRes(); const t0 = Date.now(); let thrown = null; try { await h(req, res); } catch (e) { thrown = e.message; } return { status: res.statusCode, body: res.body, ms: Date.now() - t0, thrown }; };
const signup = makeSignup({ createUser, emailQueue });
const checkout = makeCheckout({ paymentQueue });`,
  cases: [
    { goi: `[await call(signup, { email: 'an@x.vn' }).then((r) => [r.status, r.body, r.thrown]), emailQueue.added]`, moTa: ['Redis up: 201 and the job is queued', 'Redis sống: 201 và job được xếp hàng'] },
    { goi: `await (async () => { emailQueue.hang = true; const r = await call(signup, { email: 'b@x.vn' }); return [r.status, r.body, r.ms <= 1100, __log]; })()`, moTa: ['Redis down: signup still 201 within ~1 s, with a warning', 'Redis sập: đăng ký vẫn 201 trong ~1 s, kèm cảnh báo'] },
    { goi: `await (async () => { paymentQueue.hang = true; const r = await call(checkout, { orderId: 'ORD-1', amount: 100000 }); return [r.status, r.body, r.ms <= 1100]; })()`, moTa: ['Redis down: checkout answers 503, never 202', 'Redis sập: thanh toán trả 503, không bao giờ 202'] },
    { goi: `[await call(checkout, { orderId: 'ORD-2', amount: 5 }).then((r) => [r.status, r.body]), paymentQueue.added]`, an: true },
    { goi: `await (async () => { const slow = { add: () => new Promise((ok) => setTimeout(() => ok({ id: 'late' }), 300)) }; const a = await addWithTimeout(slow, 'x', {}, 1000); let b; try { await addWithTimeout(slow, 'x', {}, 100); } catch (e) { b = e.message; } return [a, b]; })()`, an: true },
  ],
});

export default modul('nodejs-13-5-worker-chet-va-van-hanh', '13.5 Stalled jobs, graceful shutdown, retention, add() timeouts', [E1, E2, E3, E4, E5]);
