/**
 * node-13-4 — Node.js · Chapter 13 · Lesson 13.4 "Scheduling: delays, priority, throttling and cron" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, HAI tập: node-13-4 (slide 1–10) · node-13-4-2 (slide 11–19).
 *   A: ví dụ đời thường (phòng khám: hẹn giờ · cấp cứu chen trước · quầy chỉ gọi 10 người/giây) · delay = sorted set (thật: zset, score/4096 = giờ chạy) · không thăm dò ·
 *      độ chính xác (thật: trễ 2–101 ms, TB 47,9 · worker bận: tới 911 ms, TB 248,6) · priority (thật: OTP chạy #1/11 · job đang chạy không bị ngắt: 1.511 ms) ·
 *      limiter (thật: 10 · 10 · 10, 2.018 ms · 3 tiến trình vẫn 10 · 10 · 10) · bảng phần 1.
 *   B: upsertJobScheduler (thật: 6 lần mỗi 400 ms, gọi lại = 1 lịch) · 3 tiến trình (thật: 5 lần vs setInterval 12 lần) · bốn cơ chế · job định kỳ nên chỉ chia việc
 *      (thật: 1 job khổng lồ 4.797 email, 1.599 người nhận 3 bản, 401 người không có · chia việc 1.999 + 1 hỏng cô lập, cron chạy 2 lần vẫn 1 bản) · múi giờ (thật: 10:00 vs 03:00) ·
 *      website (cron.service.ts THẬT dòng 30–40 + 77–78: 40 lịch node-cron, cờ _started theo tiến trình) · bài tập · bốn nhu cầu.
 * Nguồn: nodejs-13-4-lich-trinh. Output THẬT: that/c13/{delay,priority,limiter,scheduler,fanout} (Node 22.23.3, BullMQ 6.7.2, Redis 7.4.9 Docker `node13-redis`).
 * Khác web: sai số hẹn giờ TB 47,9 / max 101 ms (web 52 / 113) · limiter 2.018 ms (web 2.017) · scheduler 3 tiến trình 5 lần (web 5) · bổ sung đo thật: worker bận, job đang chạy không bị ngắt,
 *   limiter 3 tiến trình, setInterval 3 tiến trình, fan-out vs job khổng lồ, múi giờ · web ghi website "eleven cron.schedule()" — đếm thật 40 ⇒ đã sửa web.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-13-4', code: 'NODE 13.4', title: 'Scheduling: delays, priority, throttling and cron', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c13/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const D = { avg: num(R('delay', /average/), /average ([\d.]+) ms/), max: num(R('delay', /average/), /max ([\d.]+) ms/), bavg: num(R('delay', /min 10 ms/), /average ([\d.]+) ms/), bmax: num(R('delay', /min 10 ms/), /max ([\d.]+) ms/) };
const CRON = readFileSync('/Users/admin/Downloads/api-backend/src/services/cron.service.ts', 'utf8');
const CL = CRON.split('\n');
const NCRON = (CRON.match(/cron\.schedule\(/g) ?? []).length;

const khamSvg = `<svg data-k="kham" viewBox="0 0 1100 220" width="1100" height="220" font-family="Arial">
<rect x="10" y="15" width="255" height="190" rx="16" fill="${TIM}12" stroke="${TIM}" stroke-width="3"/><text x="30" y="80" font-size="46">🗓</text><text x="96" y="62" font-size="21" font-weight="700" fill="${TIM}">appointment</text><text x="96" y="92" font-size="17" fill="#444">"not before 9:00"</text><text x="30" y="178" font-size="19" font-weight="700" fill="${TIM}">= delay</text>
<rect x="285" y="15" width="255" height="190" rx="16" fill="${DO}12" stroke="${DO}" stroke-width="3"/><text x="305" y="80" font-size="46">🚑</text><text x="371" y="62" font-size="21" font-weight="700" fill="${DO}">emergency</text><text x="371" y="92" font-size="17" fill="#444">seen first</text><text x="305" y="178" font-size="19" font-weight="700" fill="${DO}">= priority</text>
<rect x="560" y="15" width="255" height="190" rx="16" fill="${CAM}12" stroke="${CAM}" stroke-width="3"/><text x="580" y="80" font-size="46">🎫</text><text x="646" y="62" font-size="21" font-weight="700" fill="${CAM}">10 per hour</text><text x="646" y="92" font-size="17" fill="#444">the doctor's limit</text><text x="580" y="178" font-size="19" font-weight="700" fill="${CAM}">= limiter</text>
<rect x="835" y="15" width="255" height="190" rx="16" fill="${NODE}12" stroke="${NODE}" stroke-width="3"/><text x="855" y="80" font-size="46">🔁</text><text x="921" y="62" font-size="21" font-weight="700" fill="${NODE}">check-up</text><text x="921" y="92" font-size="17" fill="#444">every 6 months</text><text x="855" y="178" font-size="19" font-weight="700" fill="${NODE}">= scheduler</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 13 — Background jobs and queues', bai: '13.4' }, [
  // ── PART 1 ──
  { cover: true, t: 'Scheduling: delays,<br>priority, throttling<br>and cron', sub: 'Once work lives in a queue, four questions get an answer: when should it run, in what order, how fast, and how often. Each is one option — and each has an edge.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>delay: where a delayed job lives, and how late "on time" really is</li>
<li>priority: the OTP that jumps ten reports — and the job it still waits for</li>
<li>limiter: matching someone else's rate limit, across every worker</li>
<li>Recurring work: why setInterval is the wrong tool, measured on 3 processes</li>
<li>What a scheduled job should do, and the time-zone trap</li>
</ul>` + box('Why it matters to you', 'Reminders, OTPs, a partner API that allows 10 calls per second, the nightly cleanup: every app has all four. Each one is a single option in BullMQ.', 'lam') },

  { t: 'An everyday picture: a clinic', to: true, giua: true, body: khamSvg + two(
    box('Four different questions', 'WHEN may it run · in what ORDER · how FAST may we go · how OFTEN. Mixing them up is where scheduling bugs come from.', 'cam'),
    box('One owner for each', 'In a queue each question is one option — and the queue, not your process, keeps the answer.', 'xanh')) },

  { t: 'delay: "not before"', to: true, giua: true, body: J(`await queue.add('remind', { userId }, { delay: 24 * 60 * 60 * 1000 });   // remind in 24 hours`, { sm: false, hl: [1] }) +
    TT('c13/delay', 2, 5, 'node delay.mjs · one delayed job, inside Redis · real', { hl: [3, 4], n: 104, sm: false }) +
    two(box('A sorted set scored by run time', 'The same structure lesson 12.3 used for leaderboards. The score encodes the moment the job becomes due.', 'lam'),
      box('Nothing polls it', 'The worker asks Redis for what is due and sleeps until the next score. A 24-hour delay costs the same as a 1-second one.', 'xanh')) },

  { t: 'How accurate is a delay?', to: true, giua: true, body: TT('c13/delay', 7, 13, 'node delay.mjs · 20 jobs due between 100 ms and 2,000 ms · real', { hl: [3, 4, 7], n: 104, sm: false }) +
    thanh([['idle worker · avg', D.avg, NODE, `${D.avg} ms late`], ['idle worker · max', D.max, CAM, `${D.max} ms late`], ['busy worker · avg', D.bavg, CAM, `${D.bavg} ms late`], ['busy worker · max', D.bmax, DO, `${D.bmax} ms late`]], { w: 1100, x0: 270, wMax: 600, h0: 48, chu: 20, ghi: 'how late the 20 jobs ran · real' }) +
    box('Never early — sometimes late', 'delay guarantees "not before". It says nothing about how busy the workers are when the moment comes: a due job waits its turn. Never build a countdown UI from it.', 'cam') },

  { t: 'priority: the OTP must not wait behind a report', to: true, giua: true, body: J(`for (let i = 1; i <= 10; i++) await q.add('bulk-report', { n: i }, { priority: 10 });
await q.add('login-otp', { userId: 42 }, { priority: 1 });    // lower number = sooner`, { sm: false, hl: [2] }) +
    TT('c13/priority', 2, 3, 'node priority.mjs · added in this order, one worker, concurrency 1 · real', { hl: [1, 2], n: 104, sm: false }) +
    flow([{ t: '10 × bulk-report', s: 'priority 10, added FIRST', mau: LAM }, { t: 'login-otp', s: 'priority 1, added LAST', mau: DO }, { t: 'the worker takes', s: 'login-otp first', mau: NODE }], { h: 120 }) +
    box('Exactly the scenario priority exists for', 'A user staring at a login screen beats a report nobody will read for an hour.', 'xanh') },

  { t: 'What priority does NOT do', to: true, giua: true, body: TT('c13/priority', 5, 6, 'node priority.mjs · an encode already running, then the OTP arrives · real', { hl: [2], n: 104, sm: false }) +
    two(box('It only decides who is taken OUT next', 'A job already running is never interrupted. Here the OTP waited 1.5 s behind a video encode that started a moment earlier.', 'do2'),
      box('It is not a substitute for separate queues', 'If urgent and bulk work need different concurrency or limits, split the queue (lesson 13.2) instead of sorting one.', 'cam')) +
    flow([{ t: 'otp queue', s: 'concurrency 10, fast jobs', mau: DO }, { t: 'media queue', s: 'concurrency 2, slow jobs', mau: LAM }], { h: 110 }) },

  { t: 'limiter: match someone else\'s rate limit', to: true, giua: true, body: J(`new Worker('sms', handler, {
  connection,
  concurrency: 10,
  limiter: { max: 10, duration: 1000 },   // at most 10 jobs per second
});`, { sm: false, hl: [4] }) +
    TT('c13/limiter', 2, 3, 'node limiter.mjs · 30 jobs, one worker · real', { hl: [2], n: 104, sm: false }) +
    box('The honest answer to "the partner API allows 100 requests per minute"', 'Not sleeps scattered through your code. One limiter on the queue that owns those calls. The burst waits in Redis; the limiter decides how fast it drains.', 'xanh') },

  { t: 'The limiter is shared by EVERY worker', to: true, giua: true, body: TT('c13/limiter', 4, 6, 'node limiter.mjs · three worker processes, each { max: 10, duration: 1000 } · real', { hl: [2, 3], n: 104, sm: false }) +
    thanh([['1 process', 10, NODE, '10 jobs in second 1'], ['3 processes', 10, NODE, '10 jobs in second 1'], ['3 × in-memory limit', 30, DO, 'would be 30 — what an in-process counter gives']], { w: 1100, x0: 260, wMax: 520, h0: 54, chu: 21, ghi: 'jobs started in the first second' }) +
    box('The counter lives in Redis', 'Six worker containers with max: 10 still make ten calls per second in total, not sixty — the distinction lesson 12.4 drew between an in-memory counter and a Redis one, for free.', 'lam') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['option', 'measured', 'what it means'], [
    ['delay', `late by ${D.avg} ms on average, ${D.bmax} ms when busy`, '"not before", never "exactly at"'],
    ['priority: 1', 'the OTP ran #1 of 11', 'chooses who is taken out next'],
    ['priority vs a running job', 'the OTP waited 1.5 s', 'never interrupts a job'],
    ['limiter 10/s, 1 process', '10 · 10 · 10', 'drains a burst at the partner\'s pace'],
    ['limiter 10/s, 3 processes', '10 · 10 · 10', 'one counter, in Redis'],
  ], { co: 21 }) + box('Part 2', 'Recurring work: why setInterval is the wrong tool, what a scheduled job should do, and the time-zone trap.', 'lam') },

  // ── PART 2 ──
  { t: 'Recurring work: a job scheduler', to: true, giua: true, body: J(`// 03:00 every night, Vietnam time
await queue.upsertJobScheduler(
  'nightly-cleanup',                                  // a STABLE key — the whole point
  { pattern: '0 3 * * *', tz: 'Asia/Ho_Chi_Minh' },
  { name: 'cleanup', data: {} },
);`, { sm: false, hl: [3, 4] }) +
    TT('c13/scheduler', 2, 5, 'node scheduler.mjs · { every: 400 } so the run is short · real', { hl: [2, 4], n: 104, sm: false }) +
    box('upsert = update or insert', 'This call lives in your startup code and runs on EVERY boot. With the same key it updates the schedule instead of adding a second one.', 'xanh') },

  { t: 'Three processes register the same schedule', to: true, giua: true, body: TT('c13/scheduler', 6, 10, 'node scheduler.mjs · 3 app processes, each runs its boot code · ~1.3 s · real', { hl: [2, 4], n: 104, sm: false }) +
    thanh([['upsertJobScheduler × 3', 5, NODE, '5 runs (one schedule)'], ['setInterval × 3', 12, DO, '12 runs (three timers)']], { w: 1100, x0: 320, wMax: 520, h0: 58, chu: 22, ghi: 'the same ~1.3 s window · real' }) +
    box('The schedule is STATE IN REDIS, not a timer in a process', 'With setInterval, three replicas = three timers = the nightly cleanup runs three times, the report email goes out three times. The only thing between you and that bug is that you run one container today.', 'do2') },

  { t: 'Four ways to run something on a schedule', to: true, giua: true, body: cards([
    ['setInterval', 'Drifts, dies with the process, multiplies with the replica count, forgets missed runs. Only for harmless in-memory work.'],
    ['node-cron in the process', 'Real cron syntax and time zones — but still inside the process: 3 replicas = 3 runs. Needs a distributed lock (12.4).'],
    ['the OS crontab', 'Survives app restarts, but lives outside your code, your logs and your repo. Easy to forget when you move servers.'],
    ['BullMQ job scheduler', 'The schedule lives in Redis: ONE run however many processes, plus the retries and visibility of every other job.'],
  ], 2) + flow([{ t: 'setInterval', s: '3 replicas → 3 runs', mau: DO }, { t: 'node-cron', s: '3 replicas → 3 runs', mau: DO }, { t: 'crontab', s: 'per server', mau: CAM }, { t: 'job scheduler', s: '3 replicas → 1 run', mau: NODE }], { h: 110 }) },

  { t: 'What a scheduled job should actually do', to: true, giua: true, body: two(J(`// ✗ the cron job does everything
new Worker('cron', async () => {
  const users = await db.user.findMany(…);
  for (const u of users)        // 50,000
    await sendDigest(u);        // dies at #40,000
});`, { sm: false, hl: [4, 5] }), J(`// ✓ the cron job only FANS OUT
new Worker('cron', async () => {
  const users = await db.user.findMany(…);
  await digestQueue.addBulk(users.map((u) => ({
    name: 'digest', data: { userId: u.id },
    opts: { jobId: \`digest-\${u.id}-\${today}\`,
            attempts: 3 } })));
});`, { sm: false, hl: [4, 6] })) +
    flow([{ t: 'cron fires', s: 'once a day', mau: TIM }, { t: 'addBulk', s: '50,000 small jobs', mau: LAM }, { t: 'workers', s: 'each retries alone', mau: NODE }], { h: 110 }) +
    box('Every lesson of the chapter, for free', 'Each digest retries on its own (13.3), a failure touches one person, progress shows as a shrinking queue, addBulk makes the enqueue cheap (13.2), and the jobId stops a double run.', 'xanh') },

  { t: 'Measured: one giant job vs fan-out', to: true, giua: true, body: TT('c13/fanout', 2, 6, 'node fanout.mjs · 2,000 users, user #1,600 has a broken address · attempts: 3 · real', { hl: [2, 4, 5], n: 104, sm: false }) +
    thanh([['giant job · emails sent', 4797, DO, '4,797 · 1,599 got 3 copies'], ['fan-out · emails sent', 1999, NODE, '1,999 · one each']], { w: 1100, x0: 320, wMax: 400, h0: 56, chu: 20, ghi: 'for 2,000 users · real' }) +
    two(box('The giant job', 'Each retry restarted from user #1 — and still failed at #1,600. 401 people got nothing.', 'do2'),
      box('Fan-out, cron fired TWICE', 'The jobId turned the second fan-out into nothing. One failure, isolated, with its reason.', 'xanh')) },

  { t: 'The time-zone trap', to: true, giua: true, body: TT('c13/scheduler', 12, 14, 'node scheduler.mjs · TZ=UTC, like a server · real', { hl: [2, 3], n: 112, sm: false }) +
    two(box('Always pass tz', '"0 3 * * *" without tz fires at 3 a.m. UTC = 10 a.m. in Vietnam: a "nightly cleanup" in the middle of the working day.', 'do2'),
      box('Two more edges', 'In countries with daylight saving, a 2:30 a.m. job fires twice or never on the switch nights. And if the process is down when a time passes, that run is simply skipped.', 'cam')) +
    box('A scheduler is not proof that something ran', 'Only that something was ASKED to run. Alert on the job\'s result, not on the schedule.', 'lam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: J([...CL.slice(29, 40), '  …', ...CL.slice(76, 78)].join('\n'), { sm: true, hl: [1, 7, 14] }) +
    two(box(`node-cron, ${NCRON} cron.schedule() calls`, 'src/services/cron.service.ts: the nightly cleanup at 20:00 UTC (03:00 Vietnam) — the comments document every UTC ↔ Vietnam conversion. The pitfall above, taken seriously.', 'xanh'),
      box('The guard is per PROCESS', 'let _started = false protects one process from starting twice. Correct today: production runs exactly one backend container. The day a second one starts, every job silently runs twice.', 'do2')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'You will run the API as 3 containers. Today it has: setInterval(sendReminders, 60_000) at boot; a partner SMS API limited to 5 calls/second, called directly from routes with a sleep(200) between calls; and OTP emails in the same queue as weekly newsletters. Fix all three.', '') +
    `<div data-k="dapan">${box('Answer', '(1) Replace setInterval with queue.upsertJobScheduler(\'send-reminders\', { every: 60000 }, …): one schedule in Redis, not three timers. (2) Put SMS calls on an "sms" queue whose worker has limiter { max: 5, duration: 1000 }: the limit holds across all 3 containers; routes only add(). (3) Give OTPs priority 1 — or better, their own queue with its own concurrency, so a newsletter blast never sits in front of a login.', 'xanh')}</div>` },

  { t: 'Four scheduling needs, four mechanisms', to: true, giua: true, body: cards([
    ['1 · delay — not before a time', 'Queued now, eligible later. "Not before", never "exactly at": a busy pool adds latency on top.'],
    ['2 · priority — jump the queue', 'An OTP must not wait behind ten thousand newsletters. It only reorders what is WAITING.'],
    ['3 · limiter — match someone\'s limit', 'On the worker, shared in Redis. The queue absorbs the burst; the limiter decides the drain rate.'],
    ['4 · repeat — cron with ONE owner', 'A job scheduler in the queue, not a timer per server: three instances must not run the night three times.'],
  ], 2) + box('Next: 13.5 — when the worker dies', 'SIGKILL in the middle of a job, a job that blocks the event loop, the deploy, cleanup and what to watch.', 'lam') },
]);
