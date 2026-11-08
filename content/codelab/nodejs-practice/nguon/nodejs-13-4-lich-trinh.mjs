/** Node.js · 13.4 — Lịch trình: delay "không sớm hơn", priority, limiter dùng chung, cron có múi giờ, job định kỳ chỉ toả việc. */
import { modul, cs, q, tn, jsBai, c } from './_node-c12-14.mjs';

const E1 = cs({
  ten: '13.4 · When, in what order, how fast, how often', kho: 'EASY', phut: 10,
  en: 'Once work lives in a queue, four questions become answerable. Each is one option, and each has an edge that surprises people.',
  vi: 'Khi việc nằm trong hàng đợi, bốn câu hỏi trở nên trả lời được. Mỗi câu là một tuỳ chọn, và mỗi tuỳ chọn có một cạnh sắc làm người ta bất ngờ.',
  cau: [
    q('c1', ['20 jobs delayed between 100 ms and 2,000 ms ran 52 ms late on average, 113 ms at worst. What does delay guarantee?', '20 job hẹn từ 100 ms tới 2.000 ms chạy trễ trung bình 52 ms, tệ nhất 113 ms. delay bảo đảm điều gì?'],
      ['“Not before” — never early; if every worker is busy when the moment arrives, the job waits its turn', '“Exactly at” — within one millisecond of the requested time', '“At most 100 ms late”, because the worker polls every 100 ms', 'Nothing: delayed jobs may run early when the queue is empty'],
      ['Fine for a reminder email, wrong for a countdown UI. A delayed job is a member of a sorted set scored by its run time — a 24-hour delay costs the same as a 1-second one.', 'Ổn cho email nhắc, sai cho giao diện đếm ngược. Job hẹn giờ là một phần tử của sorted set có điểm là thời điểm chạy — hẹn 24 giờ tốn ngang hẹn 1 giây.']),
    q('c2', ['The login OTP (priority 1) was added AFTER ten bulk reports. Which statement is true?', 'OTP đăng nhập (priority 1) được thêm SAU mười báo cáo hàng loạt. Câu nào đúng?'],
      ['It ran first among waiting jobs, but it cannot interrupt a report that is already running', 'It ran first and paused the running report until it finished', 'It ran last, because priority only applies to jobs added before others', 'Priority 1 is the LOWEST priority, so it ran after all reports'],
      ['Lower number wins. Priority decides the order jobs are taken out; if urgent and bulk work need different concurrency or limits, split the queue instead.', 'Số nhỏ thắng. Priority quyết định thứ tự lấy job ra; nếu việc gấp và việc hàng loạt cần concurrency hay giới hạn khác nhau thì tách hàng đợi.']),
    q('c3', ['Six worker containers each set limiter: { max: 10, duration: 1000 } on the sms queue. How many SMS per second go out in total?', 'Sáu container worker đều đặt limiter: { max: 10, duration: 1000 } cho hàng đợi sms. Tổng cộng mỗi giây gửi bao nhiêu SMS?'],
      ['10 — the limiter counter lives in Redis and is shared by every worker of the queue', '60 — each container has its own limiter', '6 — the limit is divided between the containers', 'Unbounded — the limiter only applies to retries'],
      ['Measured 10 · 10 · 10 · 0 for 30 jobs. This is how you respect a third-party limit: one limiter on the queue that owns those calls, not sleeps scattered through the code.', 'Đo được 10 · 10 · 10 · 0 cho 30 job. Đây là cách tôn trọng giới hạn của bên thứ ba: một limiter trên hàng đợi sở hữu các cuộc gọi đó, không phải sleep rải khắp code.']),
    q('c4', ['Three backend processes register the same job scheduler (same key) and also start a setInterval for the same cleanup. After 1.3 s?', 'Ba tiến trình backend cùng đăng ký một job scheduler (cùng khoá) và cùng khởi một setInterval cho cùng việc dọn dẹp. Sau 1,3 s?'],
      ['The scheduler fired 5 times (not 15); the setIntervals fire three times as often — one timer per process', 'Both fired 15 times, because each process registered its own', 'Both fired 5 times, because Node deduplicates identical timers', 'The scheduler fired 15 times; setInterval fired 5 times'],
      ['The schedule is state in Redis, not a timer in a process. setInterval and in-process node-cron multiply with the replica count — the nightly email goes out three times.', 'Lịch là trạng thái trong Redis, không phải bộ hẹn giờ trong tiến trình. setInterval và node-cron trong tiến trình nhân lên theo số bản sao — email đêm gửi ba lần.']),
    q('c5', ['A cleanup is registered with pattern \'0 3 * * *\' and no tz, on a server running in UTC. When does it fire in Vietnam (UTC+7)?', 'Một việc dọn dẹp đăng ký với mẫu \'0 3 * * *\' không có tz, trên máy chủ chạy UTC. Ở Việt Nam (UTC+7) nó chạy lúc mấy giờ?'],
      ['10:00 in the morning — in the middle of the working day', '03:00 at night, as intended', '20:00 the previous evening', 'It never fires: a pattern without tz is rejected'],
      ['Always pass tz: \'Asia/Ho_Chi_Minh\'. And if the process is down when a scheduled time passes, that occurrence is simply skipped — a scheduler is not a guarantee that something ran.', 'Luôn truyền tz: \'Asia/Ho_Chi_Minh\'. Và nếu tiến trình tắt đúng lúc giờ hẹn trôi qua, lần đó bị bỏ luôn — bộ lập lịch không bảo đảm rằng việc đã chạy.']),
    q('c6', ['Why should the nightly digest job only FAN OUT one job per user instead of sending 50,000 digests itself?', 'Vì sao job digest ban đêm chỉ nên TOẢ ra mỗi người một job thay vì tự gửi 50.000 bản tin?'],
      ['Each digest then retries on its own; a failure costs one person', 'Because BullMQ limits a job to 60 seconds of running time', 'Because a cron job cannot call a database', 'Because addBulk is the only way to send email from a worker'],
      ['The monolithic version fails 40,000 users deep with no record of where it stopped. The fan-out version gets retries, isolation, visibility and addBulk’s 11× for free.', 'Bản nguyên khối hỏng ở người thứ 40.000 mà không ghi lại đã dừng ở đâu. Bản toả việc được thử lại, cô lập, nhìn thấy được và cái 11× của addBulk miễn phí.']),
  ],
  goiY: [['Ask whether the state lives in Redis or in one process.', 'Hỏi xem trạng thái nằm trong Redis hay trong một tiến trình.'], ['Servers run in UTC.', 'Máy chủ chạy theo UTC.']],
  loi: [['Building a countdown on top of delay.', 'Dựng đồng hồ đếm ngược dựa trên delay.'], ['setInterval for a nightly job — fine with one container, three times the email with three.', 'setInterval cho job đêm — ổn với một container, ba lần email với ba container.']],
  tns: [tn('delayed job', 'job hẹn giờ', 'chạy không sớm hơn một thời điểm'), tn('limiter', 'bộ bóp tốc độ', 'tối đa max job mỗi duration ms, dùng chung qua Redis'), tn('job scheduler', 'bộ lập lịch job', 'lịch định kỳ lưu trong Redis, một lịch cho cả cụm')],
  kn: ['scheduling'],
});

const E2 = jsBai({
  ten: '13.4 · Which job runs next?', kho: 'MEDIUM', phut: 15,
  en: `<p>Write ${c('pickNext(jobs, now)')} — the id of the job a free worker takes next, or ${c('null')}. Each job is ${c("{ id, state: 'waiting' | 'delayed' | 'active', priority, timestamp, runAt? }")}:</p><ul><li>${c('active')} jobs are never picked (a running job is not interrupted);</li><li>a ${c('delayed')} job is eligible only when ${c('runAt <= now')} (“not before”);</li><li>among eligible jobs the LOWEST ${c('priority')} number wins (every job here has a priority ≥ 1);</li><li>ties: the older ${c('timestamp')} first, then the smaller ${c('id')} (compare ids as numbers).</li></ul>`,
  vi: `<p>Viết ${c('pickNext(jobs, now)')} — id của job mà một worker rảnh lấy tiếp, hoặc ${c('null')}. Mỗi job là ${c("{ id, state: 'waiting' | 'delayed' | 'active', priority, timestamp, runAt? }")}:</p><ul><li>job ${c('active')} không bao giờ được chọn (job đang chạy không bị ngắt);</li><li>job ${c('delayed')} chỉ đủ điều kiện khi ${c('runAt <= now')} ("không sớm hơn");</li><li>trong các job đủ điều kiện, số ${c('priority')} NHỎ NHẤT thắng (mọi job ở đây có priority ≥ 1);</li><li>hoà: ${c('timestamp')} cũ hơn trước, rồi ${c('id')} nhỏ hơn (so id như số).</li></ul>`,
  yc: [['Never pick active jobs, never pick a delayed job early.', 'Không bao giờ chọn job active, không bao giờ chọn job hẹn giờ quá sớm.'], ['Lower priority number first; then oldest; then smallest id.', 'Số priority nhỏ trước; rồi cũ nhất; rồi id nhỏ nhất.'], ['Do not modify jobs.', 'Không sửa jobs.']],
  dauVao: ['jobs — array · now — ms', 'jobs — mảng · now — ms'],
  dauRa: ['string | null — the id', 'chuỗi | null — id'],
  goiY: [['Filter first: state === \'waiting\' || (state === \'delayed\' && runAt <= now).', 'Lọc trước: state === \'waiting\' || (state === \'delayed\' && runAt <= now).'], ['Sort a COPY with (a, b) => a.priority - b.priority || a.timestamp - b.timestamp || Number(a.id) - Number(b.id), take [0].', 'Sắp xếp một BẢN SAO với (a, b) => a.priority - b.priority || a.timestamp - b.timestamp || Number(a.id) - Number(b.id), lấy [0].']],
  loi: [['Treating a higher number as more urgent: the bulk report (priority 10) jumps ahead of the OTP (priority 1).', 'Coi số lớn hơn là gấp hơn: báo cáo hàng loạt (priority 10) nhảy lên trước OTP (priority 1).'], ['Picking a delayed job whose runAt has not come — a reminder sent a day early.', 'Chọn job hẹn giờ chưa tới runAt — email nhắc gửi sớm một ngày.'], ['jobs.sort(…) in place: the caller’s array is reordered.', 'jobs.sort(…) tại chỗ: mảng của nơi gọi bị xếp lại.']],
  gt: ['Eligibility first (delay is a lower bound, active is untouchable), then the order: priority, then age. That is the lesson’s run — the OTP added after ten reports ran first among waiting jobs — and also its limit: priority decides what is taken out next, nothing more.', 'Điều kiện trước (delay là cận dưới, active thì không đụng), rồi thứ tự: priority, rồi tuổi. Đó là lần chạy của bài — OTP thêm sau mười báo cáo vẫn chạy trước trong các job đang chờ — và cũng là giới hạn của nó: priority chỉ quyết định cái gì được lấy ra tiếp, không hơn.'],
  kn: ['priority', 'delay'], tns: [tn('priority', 'độ ưu tiên', 'số nhỏ chạy trước'), tn('not before', 'không sớm hơn', 'delay là cận dưới, không phải giờ chính xác')],
  dau: `/** The id of the job a free worker takes next. */
function pickNext(jobs, now) {
  // Write your solution here
  const ok = jobs.filter((j) => j.state !== 'active');
  ok.sort((a, b) => b.priority - a.priority);
  return ok.length ? ok[0].id : null;
}
`,
  giai: `/** The id of the job a free worker takes next. */
function pickNext(jobs, now) {
  const eligible = jobs.filter((j) =>
    j.state === 'waiting' || (j.state === 'delayed' && j.runAt <= now));   // delay = "not before"; active is untouchable
  if (!eligible.length) return null;
  const order = [...eligible].sort((a, b) =>                               // a COPY — never reorder the caller's array
    a.priority - b.priority ||                                             // lower number = more urgent
    a.timestamp - b.timestamp ||                                           // then FIFO
    Number(a.id) - Number(b.id));                                          // then the id, as a number
  return order[0].id;
}
`,
  chung: `const J = (id, state, priority, timestamp, runAt) => ({ id: String(id), state, priority, timestamp, ...(runAt != null ? { runAt } : {}) });
const reports = Array.from({ length: 10 }, (_, i) => J(i + 1, 'waiting', 10, 1000 + i));`,
  cases: [
    { goi: `pickNext([...reports, J(11, 'waiting', 1, 2000)], 5000)`, moTa: ['The OTP added after 10 reports runs first', 'OTP thêm sau 10 báo cáo chạy trước'] },
    { goi: `[pickNext([J(1, 'delayed', 1, 0, 9000), J(2, 'waiting', 5, 100)], 8999), pickNext([J(1, 'delayed', 1, 0, 9000), J(2, 'waiting', 5, 100)], 9000)]`, moTa: ['A delayed job is eligible at runAt, not before', 'Job hẹn giờ đủ điều kiện từ runAt, không sớm hơn'] },
    { goi: `[pickNext([J(1, 'active', 1, 0), J(2, 'waiting', 3, 50)], 0), pickNext([J(1, 'active', 1, 0)], 0), pickNext([], 0)]`, moTa: ['Active jobs are never picked', 'Job active không bao giờ được chọn'] },
    { goi: `[pickNext([J(10, 'waiting', 2, 500), J(9, 'waiting', 2, 500), J(3, 'waiting', 2, 700)], 1000), pickNext([J(5, 'delayed', 1, 0, 2000), J(6, 'delayed', 1, 0, 1500)], 3000)]`, an: true },
    { goi: `(() => { const js = [J(1, 'waiting', 5, 3), J(2, 'waiting', 4, 2), J(3, 'delayed', 1, 1, 10)]; const r = [pickNext(js, 5), pickNext(js, 10)]; return [r, js.map((j) => j.id).join(',')]; })()`, an: true },
  ],
});

const E3 = jsBai({
  ten: '13.4 · A limiter shared by every worker', kho: 'HARD', phut: 25,
  en: `<p>A third-party SMS API allows 10 calls per second. The lesson’s limiter lives in Redis, so it is shared by every worker of the queue. Model it:</p><ul><li>${c('createLimiter({ max, duration })')} returns ${c('{ take() }')}. ${c('await limiter.take()')} resolves when the caller may start one job: at most ${c('max')} starts per window of ${c('duration')} ms. The first window starts at the first ${c('take()')}; when a window is full, callers wait until it ends and a new window starts then.</li><li>${c('runWorker(jobs, handler, limiter)')} processes ${c('jobs')} one after another (concurrency 1): for each, ${c('await limiter.take()')}, then ${c('await handler(job)')}. Resolve to the start times (${c('Date.now()')}) of the jobs.</li></ul><p>Two workers that share ONE limiter must together stay at 10 per second; with a limiter each they would do 20.</p>`,
  vi: `<p>Một API SMS bên thứ ba cho 10 lần gọi mỗi giây. Limiter của bài nằm trong Redis, nên được mọi worker của hàng đợi dùng chung. Mô phỏng nó:</p><ul><li>${c('createLimiter({ max, duration })')} trả ${c('{ take() }')}. ${c('await limiter.take()')} resolve khi người gọi được phép bắt đầu một job: tối đa ${c('max')} lần bắt đầu mỗi cửa sổ ${c('duration')} ms. Cửa sổ đầu bắt đầu ở lần ${c('take()')} đầu tiên; khi một cửa sổ đã đầy, người gọi chờ tới khi nó hết và cửa sổ mới bắt đầu từ lúc đó.</li><li>${c('runWorker(jobs, handler, limiter)')} xử lý ${c('jobs')} lần lượt (concurrency 1): với mỗi job, ${c('await limiter.take()')}, rồi ${c('await handler(job)')}. Resolve ra các thời điểm bắt đầu (${c('Date.now()')}) của các job.</li></ul><p>Hai worker dùng chung MỘT limiter phải cùng nhau giữ 10 mỗi giây; mỗi worker một limiter thì sẽ ra 20.</p>`,
  yc: [['At most max starts in any window, across all callers of the same limiter.', 'Tối đa max lần bắt đầu trong mỗi cửa sổ, cộng mọi người gọi cùng một limiter.'], ['A waiting caller does not spin: it waits with a timer until the window ends.', 'Người gọi đang chờ không quay vòng bận: chờ bằng hẹn giờ tới khi cửa sổ hết.'], ['take() is safe when many callers call it at the same moment.', 'take() an toàn khi nhiều người gọi cùng một lúc.']],
  dauVao: ['{ max, duration } · jobs — any[] · handler — async (job) => void', '{ max, duration } · jobs — any[] · handler — async (job) => void'],
  dauRa: ['limiter — { take(): Promise<void> } · runWorker → Promise<number[]>', 'limiter — { take(): Promise<void> } · runWorker → Promise<number[]>'],
  goiY: [['State: let windowStart = null, used = 0. In a loop: now = Date.now(); if windowStart === null or now >= windowStart + duration → windowStart = now, used = 0. If used < max → used++ and return. Otherwise await sleep(windowStart + duration - now) and loop again.', 'Trạng thái: let windowStart = null, used = 0. Trong vòng lặp: now = Date.now(); nếu windowStart === null hoặc now >= windowStart + duration → windowStart = now, used = 0. Nếu used < max → used++ rồi return. Ngược lại await sleep(windowStart + duration - now) rồi lặp lại.'], ['Check-and-increment has no await between them, so concurrent callers cannot both take the last slot.', 'Kiểm-và-tăng không có await ở giữa, nên những người gọi đồng thời không thể cùng lấy chỗ cuối cùng.']],
  loi: [['A counter per worker (inside runWorker): six workers ⇒ six times the third party’s limit.', 'Mỗi worker một bộ đếm (bên trong runWorker): sáu worker ⇒ gấp sáu giới hạn của bên thứ ba.'], ['await sleep(1000) after every 10 jobs: handlers take time too, so the real rate drifts below the limit — and the count is still per worker.', 'await sleep(1000) sau mỗi 10 job: handler cũng tốn thời gian, nên tốc độ thật trôi dưới giới hạn — mà bộ đếm vẫn theo từng worker.'], ['Waking up all waiting callers when the window ends without re-checking: they all start at once and blow the next window.', 'Đánh thức mọi người đang chờ khi cửa sổ hết mà không kiểm lại: họ cùng bắt đầu một lúc và làm tràn cửa sổ kế.']],
  gt: ['The limiter is one shared counter with a window, exactly the fixed window of 12.4 — which is why putting it in Redis makes it fleet-wide. Waiters sleep until the window boundary and re-check in a loop, so even many simultaneous callers never exceed max. 30 jobs at 10/s start in three bursts of ten, about 1 s apart — the lesson’s 10 · 10 · 10.', 'Limiter là một bộ đếm dùng chung có cửa sổ, đúng cửa sổ cố định của 12.4 — vì thế đặt nó trong Redis là có hiệu lực cho cả cụm. Người chờ ngủ tới ranh giới cửa sổ rồi kiểm lại trong vòng lặp, nên kể cả nhiều người gọi cùng lúc cũng không vượt max. 30 job ở mức 10/s bắt đầu thành ba đợt mười cái, cách nhau khoảng 1 s — đúng 10 · 10 · 10 của bài.'],
  kn: ['throttling', 'rate limiting'], tns: [tn('limiter', 'bộ bóp tốc độ', 'tối đa max lần bắt đầu mỗi duration ms'), tn('throttling', 'bóp tốc độ', 'ép tốc độ xử lý khớp giới hạn của bên khác')],
  dau: `/** A limiter: at most max starts per duration ms. */
function createLimiter({ max, duration }) {
  // Write your solution here
  return { async take() {} };
}

/** Process jobs one by one, asking the limiter before each start. */
async function runWorker(jobs, handler, limiter) {
  const starts = [];
  let n = 0;
  for (const job of jobs) {
    if (++n % 10 === 0) await new Promise((ok) => setTimeout(ok, 1000));
    starts.push(Date.now());
    await handler(job);
  }
  return starts;
}
`,
  giai: `const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));

/** A limiter: at most max starts per window of duration ms — ONE object shared by every worker. */
function createLimiter({ max, duration }) {
  let windowStart = null, used = 0;
  return {
    async take() {
      for (;;) {
        const now = Date.now();
        if (windowStart === null || now >= windowStart + duration) { windowStart = now; used = 0; }   // a new window
        if (used < max) { used++; return; }          // check + increment, no await in between: no race
        await wait(windowStart + duration - now);    // sleep until the window ends, then RE-CHECK
      }
    },
  };
}

/** Process jobs one by one (concurrency 1), asking the shared limiter before each start. */
async function runWorker(jobs, handler, limiter) {
  const starts = [];
  for (const job of jobs) {
    await limiter.take();
    starts.push(Date.now());
    await handler(job);
  }
  return starts;
}
`,
  chung: `const t0 = Date.now();
const sms = async () => { await new Promise((ok) => setTimeout(ok, 5)); };
const perSecond = (starts) => { const b = []; for (const s of starts) { const i = Math.floor((s - t0) / 1000); b[i] = (b[i] || 0) + 1; } return Array.from(b, (x) => x || 0); };
const range = (n) => Array.from({ length: n }, (_, i) => i);`,
  cases: [
    { goi: `await runWorker(range(30), sms, createLimiter({ max: 10, duration: 1000 })).then(perSecond)`, moTa: ['30 jobs at 10/s → 10 · 10 · 10', '30 job ở 10/s → 10 · 10 · 10'] },
    { goi: `await (async () => { const lim = createLimiter({ max: 10, duration: 1000 }); const [a, b] = await Promise.all([runWorker(range(15), sms, lim), runWorker(range(15), sms, lim)]); return perSecond([...a, ...b].sort((x, y) => x - y)); })()`, moTa: ['Two workers, ONE shared limiter → still 10 per second in total', 'Hai worker, MỘT limiter dùng chung → tổng vẫn 10 mỗi giây'] },
    { goi: `await (async () => { const [a, b] = await Promise.all([runWorker(range(15), sms, createLimiter({ max: 10, duration: 1000 })), runWorker(range(15), sms, createLimiter({ max: 10, duration: 1000 }))]); return perSecond([...a, ...b].sort((x, y) => x - y)); })()`, moTa: ['A limiter each → 20 per second (the in-memory counter of 12.4)', 'Mỗi worker một limiter → 20 mỗi giây (bộ đếm trong bộ nhớ của 12.4)'] },
    { goi: `await (async () => { const lim = createLimiter({ max: 3, duration: 500 }); const s = await Promise.all(range(9).map(async () => { await lim.take(); return Date.now() - t0; })); return s.sort((x, y) => x - y); })()`, an: true, moTa: ['Nine simultaneous take() calls on max 3 / 500 ms', 'Chín lời gọi take() đồng thời với max 3 / 500 ms'] },
    { goi: `await (async () => { const lim = createLimiter({ max: 2, duration: 1000 }); const slow = async () => { await new Promise((ok) => setTimeout(ok, 700)); }; const s = await runWorker(range(5), slow, lim); return s.map((x) => x - t0); })()`, an: true, timeoutMs: 60000 },
  ],
});

const E4 = jsBai({
  ten: '13.4 · 03:00 in Vietnam is 20:00 UTC', kho: 'MEDIUM', phut: 15,
  en: `<p>Servers run in UTC. Write ${c('nextDailyRun(pattern, tzOffsetMinutes, nowMs)')} for daily cron patterns of the form ${c("'M H * * *'")} (minute, hour, then three stars): return the epoch milliseconds of the next run strictly AFTER ${c('nowMs')}, where ${c('H:M')} is a wall-clock time in a zone ${c('tzOffsetMinutes')} ahead of UTC (Vietnam: ${c('420')}; UTC: ${c('0')}). Vietnam has no daylight saving, so a fixed offset is exact.</p><p>The site’s own ${c('cron.service.ts')} documents the conversion for each job: nightly cleanup at 20:00 UTC = 03:00 Vietnam.</p>`,
  vi: `<p>Máy chủ chạy UTC. Viết ${c('nextDailyRun(pattern, tzOffsetMinutes, nowMs)')} cho các mẫu cron hằng ngày dạng ${c("'M H * * *'")} (phút, giờ, rồi ba dấu sao): trả mili-giây epoch của lần chạy kế tiếp, lớn hơn hẳn ${c('nowMs')}, trong đó ${c('H:M')} là giờ đồng hồ ở múi giờ đi trước UTC ${c('tzOffsetMinutes')} phút (Việt Nam: ${c('420')}; UTC: ${c('0')}). Việt Nam không có giờ mùa hè, nên độ lệch cố định là chính xác.</p><p>Chính ${c('cron.service.ts')} của website ghi chú cách quy đổi cho từng job: dọn dẹp đêm lúc 20:00 UTC = 03:00 Việt Nam.</p>`,
  yc: [['Strictly after nowMs: if it is exactly 03:00:00.000 local, the next run is tomorrow.', 'Lớn hơn hẳn nowMs: nếu đúng 03:00:00.000 giờ địa phương thì lần kế là ngày mai.'], ['Work in UTC arithmetic; do not use the machine’s local time.', 'Tính bằng số học UTC; không dùng giờ địa phương của máy.'], ['Seconds and milliseconds of the result are 0.', 'Giây và mili-giây của kết quả là 0.']],
  dauVao: ['pattern — "M H * * *" · tzOffsetMinutes — number · nowMs — epoch ms', 'pattern — "M H * * *" · tzOffsetMinutes — số · nowMs — mili-giây epoch'],
  dauRa: ['number — epoch ms (UTC)', 'số — mili-giây epoch (UTC)'],
  goiY: [['Shift into the zone: const local = new Date(nowMs + tz * 60000). Build the candidate with Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), H, M) — that is “local wall clock” expressed as if it were UTC.', 'Dịch vào múi giờ: const local = new Date(nowMs + tz * 60000). Dựng ứng viên bằng Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), H, M) — đó là "giờ đồng hồ địa phương" viết như thể là UTC.'], ['Shift back: candidate - tz * 60000. If that is <= nowMs, add 24 hours.', 'Dịch ngược: ứng viên - tz * 60000. Nếu kết quả <= nowMs thì cộng 24 giờ.']],
  loi: [['Ignoring the zone: \'0 3 * * *\' fires at 03:00 UTC = 10:00 in Vietnam — a “nightly” job in the middle of the working day.', 'Bỏ qua múi giờ: \'0 3 * * *\' chạy lúc 03:00 UTC = 10:00 ở Việt Nam — job "ban đêm" giữa giờ làm việc.'], ['Using getHours()/setHours(): the answer depends on the timezone of the machine running the code.', 'Dùng getHours()/setHours(): đáp án phụ thuộc múi giờ của máy chạy code.'], ['>= instead of >: called at exactly the fire time, it returns now and the job runs twice.', '>= thay vì >: gọi đúng lúc giờ chạy thì trả về chính lúc đó và job chạy hai lần.']],
  gt: ['Adding the offset turns “wall clock in Vietnam” into numbers you can read with the getUTC* methods; building the target with Date.UTC and subtracting the offset brings it back to a real instant. Always pass tz explicitly to the scheduler for the same reason — and remember that a zone with daylight saving makes a 02:30 job fire twice or zero times on the switch days.', 'Cộng độ lệch biến "giờ đồng hồ ở Việt Nam" thành những con số đọc được bằng các hàm getUTC*; dựng mốc đích bằng Date.UTC rồi trừ độ lệch đưa nó về một thời điểm thật. Cũng vì thế luôn truyền tz rõ ràng cho bộ lập lịch — và nhớ rằng múi giờ có giờ mùa hè làm job 02:30 chạy hai lần hoặc không lần nào vào ngày đổi giờ.'],
  kn: ['cron', 'time zones'], tns: [tn('UTC offset', 'độ lệch UTC', 'Việt Nam UTC+7 = +420 phút, không có giờ mùa hè'), tn('cron pattern', 'mẫu cron', 'phút giờ ngày tháng thứ — "0 3 * * *" = 03:00 hằng ngày')],
  dau: `/** Next run of a daily 'M H * * *' pattern in a zone tz minutes ahead of UTC. */
function nextDailyRun(pattern, tzOffsetMinutes, nowMs) {
  // Write your solution here — this treats H:M as UTC
  const [M, H] = pattern.split(' ').map(Number);
  const d = new Date(nowMs);
  let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), H, M);
  if (t <= nowMs) t += 86400000;
  return t;
}
`,
  giai: `/** Next run of a daily 'M H * * *' pattern in a zone tz minutes ahead of UTC (no DST). */
function nextDailyRun(pattern, tzOffsetMinutes, nowMs) {
  const [M, H] = pattern.trim().split(/\\s+/).map(Number);
  const off = tzOffsetMinutes * 60000;
  const local = new Date(nowMs + off);                 // "now" read on the zone's wall clock (via getUTC*)
  // today's H:M on that wall clock, written as if it were UTC — then shifted back to a real instant
  let t = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), H, M) - off;
  if (t <= nowMs) t += 86400000;                       // strictly AFTER now: already passed ⇒ tomorrow
  return t;
}
`,
  chung: `const iso = (ms) => new Date(ms).toISOString();
const VN = 420;`,
  cases: [
    { goi: `iso(nextDailyRun('0 3 * * *', VN, Date.UTC(2026, 10, 8, 12, 0)))`, moTa: ['03:00 Vietnam = 20:00 UTC', '03:00 Việt Nam = 20:00 UTC'] },
    { goi: `[iso(nextDailyRun('0 3 * * *', 0, Date.UTC(2026, 10, 8, 12, 0))), iso(nextDailyRun('0 3 * * *', VN, Date.UTC(2026, 10, 8, 21, 0)))]`, moTa: ['Without tz: 03:00 UTC (10:00 in Vietnam); after 20:00 UTC → the next day', 'Không có tz: 03:00 UTC (10:00 ở Việt Nam); sau 20:00 UTC → ngày hôm sau'] },
    { goi: `iso(nextDailyRun('30 23 * * *', VN, Date.UTC(2026, 11, 31, 16, 29)))`, moTa: ['23:30 Vietnam on New Year’s Eve', '23:30 Việt Nam đêm giao thừa'] },
    { goi: `[iso(nextDailyRun('0 3 * * *', VN, Date.UTC(2026, 10, 8, 20, 0))), iso(nextDailyRun('15 0 * * *', VN, Date.UTC(2026, 1, 28, 17, 14, 59)))]`, an: true },
    { goi: `[iso(nextDailyRun('0 9 * * *', -300, Date.UTC(2026, 5, 1, 13, 59))), iso(nextDailyRun('5 7 * * *', 330, Date.UTC(2026, 5, 1, 1, 0)))]`, an: true },
  ],
});

const E5 = jsBai({
  ten: '13.4 · The nightly job only fans the work out', kho: 'EASY', phut: 10,
  en: `<p>The scheduled ${c('cron')} job must not send 50,000 digests itself. It builds one job per user for ${c('addBulk')}. Write ${c('digestJobs(users, today)')} — for every user with ${c('needsDigest === true')}, in order:</p><pre>{ name: 'digest', data: { userId }, opts: { jobId: 'digest-&lt;userId&gt;-&lt;today&gt;', attempts: 3 } }</pre><p>${c('today')} is ${c("'YYYY-MM-DD'")}. The deterministic jobId means that if the scheduler fires twice the same night (a deploy, a second registration), each user still gets one digest; it has no colon, because BullMQ rejects colons in custom ids.</p>`,
  vi: `<p>Job ${c('cron')} theo lịch không được tự gửi 50.000 bản tin. Nó dựng mỗi người một job cho ${c('addBulk')}. Viết ${c('digestJobs(users, today)')} — với mọi người có ${c('needsDigest === true')}, theo thứ tự:</p><pre>{ name: 'digest', data: { userId }, opts: { jobId: 'digest-&lt;userId&gt;-&lt;today&gt;', attempts: 3 } }</pre><p>${c('today')} dạng ${c("'YYYY-MM-DD'")}. jobId tất định nghĩa là nếu bộ lập lịch chạy hai lần trong cùng một đêm (một lần deploy, một lần đăng ký thứ hai), mỗi người vẫn chỉ nhận một bản tin; nó không có dấu hai chấm, vì BullMQ từ chối dấu hai chấm trong id tự đặt.</p>`,
  yc: [['Only users with needsDigest === true.', 'Chỉ người có needsDigest === true.'], ['data is exactly { userId }.', 'data đúng bằng { userId }.'], ['Same user + same day ⇒ same jobId.', 'Cùng người + cùng ngày ⇒ cùng jobId.']],
  dauVao: ['users — [{ id, email, needsDigest }] · today — "YYYY-MM-DD"', 'users — [{ id, email, needsDigest }] · today — "YYYY-MM-DD"'],
  dauRa: ['array of { name, data, opts }', 'mảng { name, data, opts }'],
  goiY: [['users.filter((u) => u.needsDigest === true).map((u) => ({ … }))', 'users.filter((u) => u.needsDigest === true).map((u) => ({ … }))'], ['jobId: `digest-${u.id}-${today}`.', 'jobId: `digest-${u.id}-${today}`.']],
  loi: [['jobId with a timestamp: a second firing of the scheduler sends everyone a second digest.', 'jobId có mốc thời gian: bộ lập lịch chạy lần hai là ai cũng nhận bản tin thứ hai.'], ['Putting the email in data: the worker sends to the address of last night, not the current one.', 'Đặt email vào data: worker gửi tới địa chỉ của đêm qua, không phải địa chỉ hiện tại.']],
  gt: ['The fan-out version gets everything from the chapter for free: each digest retries on its own (attempts 3), a failure costs one person, progress is a shrinking queue, and the jobId derived from user + day makes a duplicate firing harmless while the jobs still exist.', 'Bản toả việc được mọi thứ của chương miễn phí: mỗi bản tin tự thử lại (attempts 3), một lần hỏng chỉ ảnh hưởng một người, tiến độ là một hàng đợi đang ngắn lại, và jobId suy ra từ người + ngày làm lần chạy trùng trở nên vô hại khi các job còn tồn tại.'],
  kn: ['fan-out', 'jobId'], tns: [tn('fan-out', 'toả việc', 'một job định kỳ chỉ sinh ra các job nhỏ, mỗi người một job')],
  dau: `/** One addBulk entry per user who needs a digest. */
function digestJobs(users, today) {
  // Write your solution here
  return users.map((u) => ({ name: 'digest', data: { userId: u.id, email: u.email }, opts: { jobId: \`digest:\${u.id}:\${Date.now()}\`, attempts: 3 } }));
}
`,
  giai: `/** One addBulk entry per user who needs a digest — the cron job only FANS OUT the work. */
function digestJobs(users, today) {
  return users
    .filter((u) => u.needsDigest === true)
    .map((u) => ({
      name: 'digest',
      data: { userId: u.id },                                  // the worker re-reads the current email
      opts: { jobId: \`digest-\${u.id}-\${today}\`, attempts: 3 },   // same user + same night ⇒ one job; no colon
    }));
}
`,
  chung: `const users = [{ id: 1, email: 'a@x.vn', needsDigest: true }, { id: 2, email: 'b@x.vn', needsDigest: false }, { id: 3, email: 'c@x.vn', needsDigest: true }];`,
  cases: [
    { goi: `digestJobs(users, '2026-11-08')`, moTa: ['Two users need a digest', 'Hai người cần bản tin'] },
    { goi: `[digestJobs(users, '2026-11-08')[0].opts.jobId === digestJobs(users, '2026-11-08')[0].opts.jobId, digestJobs([], '2026-11-08')]`, moTa: ['Deterministic: two firings, same ids', 'Tất định: chạy hai lần, cùng id'] },
    { goi: `digestJobs([{ id: 9, needsDigest: 'yes' }, { id: 10, needsDigest: true }], '2026-12-31').map((j) => j.opts.jobId)`, an: true },
    { goi: `digestJobs(Array.from({ length: 5 }, (_, i) => ({ id: 100 + i, email: 'u' + i + '@x.vn', needsDigest: i % 2 === 0 })), '2027-01-01').map((j) => [j.data, j.opts.jobId.includes(':')])`, an: true },
  ],
});

export default modul('nodejs-13-4-lich-trinh', '13.4 Scheduling: priority, shared limiter, cron in a time zone', [E1, E2, E3, E4, E5]);
