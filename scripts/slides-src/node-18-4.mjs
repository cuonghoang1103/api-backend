/**
 * node-18-4 — Node.js · Chapter 18 · Lesson 18.4 "Monolith or services: deciding with numbers" (slide EN, đợt 12 — 08/11/2026).
 * MỘT deck, HAI tập: node-18-4 (18.4a, slide 1–10) · node-18-4-2 (18.4b, slide 11–19).
 * Nguồn: nodejs-18-4-monolith-hay-tach. Output THẬT: that/c18/{call, prod-arch} (Node 22.23.3 trên Mac; mã nguồn website chỉ đọc).
 * Số chương khác lấy theo VIDEO đã khoá: Ch15 OTel −17,6 % req/s (7.638 → 6.297) · Ch16 cluster /cpu 3,4×, /io +6,7 %, 16.2 97,2 % thời gian ở DB ·
 *   Ch13 job không idempotent trừ 300.000 thay vì 100.000 VND.
 * Khác web: một lời gọi hàm 2,0 ns vs HTTP loopback 0,072 ms (giữ kết nối) / 0,177 ms (kết nối mới) — web 0,14 / 1,29 ms ·
 *   tracing −17,6 % (web −39,6 %) · cron.service 40 lịch (web 11) · 7 container trong compose.
 */
import { lamDeck, two, box, cards, flow, bang, TT, thanh, steps, sql } from './_c9-chung.mjs';

export const deck = { key: 'node-18-4', code: 'NODE 18.4', title: 'Monolith or services: deciding with numbers', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';

export const slides = lamDeck({ chuong: 'Chapter 18 — Architecture', bai: '18.4' }, [
  { cover: true, t: 'Monolith or services:<br>deciding with numbers', sub: 'The architecture question people ask first and should ask last. It is usually argued with adjectives; every input it needs is a number, and most are already in this course.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>What splitting buys, and what it costs — with measured numbers</li>
<li>A function call against the same call over HTTP: 2.0 ns vs 0.072 ms</li>
<li>The three signals that survive measurement</li>
<li>The middle option nobody names: a modular monolith</li>
<li>What this system already does that is service-shaped</li>
</ul>` + box('Why it matters to you', 'Splitting is reversible in theory and almost never in practice. Deciding with numbers is how you avoid a year of distributed-systems machinery you did not need.', 'lam') },

  { t: 'What splitting buys', to: true, giua: true, body: cards([['Independent scaling', 'Scale the CPU-heavy part on its own. But chapter 16 measured it: for I/O-bound work, more processes bought +6.7%.'], ['Fault isolation', 'One service dying does not take the system with it. TRUE — and it needs timeouts, retries and fallbacks at every call.'], ['Independent teams', 'The only GENUINELY good reason: service boundaries matching the boundaries between groups of people.']], 3) +
    box('Notice the pattern', 'Each benefit is real, and each one comes with a condition. The next slide is the bill.', 'cam') +
    flow([{ t: 'image resize', s: 'needs 16 cores', mau: CAM }, { t: 'its own service', s: 'scaled alone', mau: NODE }, { t: 'the rest', s: '2 cores is plenty', mau: LAM }], { h: 120 }) +
    box('That is the case where splitting pays', 'One part with a genuinely different appetite. If every part waits on the same database, there is nothing to scale separately.', 'xanh') },

  { t: 'What splitting costs', to: true, giua: true, body: cards([['Every call can now FAIL', 'Timeouts, retries, partial success. Each network call is a new failure mode.'], ['No more JOINs', 'One query becomes three network calls and an in-memory join in your code.'], ['No more transactions', 'Chapter 7 rolled a transaction back cleanly. Across two services there is no rollback.']], 3) +
    flow([{ t: 'monolith', s: 'createOrder(): all or nothing', mau: NODE }, { t: 'two services', s: 'pay ✓ · stock ✗', mau: DO }, { t: 'a state to design for', s: 'idempotency · compensation · reconciliation', mau: CAM }], { h: 130 }) +
    box('Like a transfer between two banks', 'Inside one bank, the money moves or it does not. Between two banks there is a moment when it has left one and not reached the other — and someone has to own that moment.', 'lam') +
    box('Chapter 13 measured one instance of it', 'A non-idempotent job retried 3 times charged 300,000 VND instead of 100,000. Across services this shape of bug is the normal case.', 'do2') },

  { t: 'A function call, or the same call over HTTP', to: true, giua: true, body: TT('c18/call', 2, 6, 'node call.mjs · the same work in-process vs in another process on 127.0.0.1 · median of 5 · real', { n: 104, hl: [2, 3, 4], sm: false }) +
    thanh([['function call', 2.0, NODE, '2.0 ns'], ['HTTP, keep-alive', 71542, CAM, '71,542 ns (0.072 ms)'], ['HTTP, new connection', 177167, DO, '177,167 ns (0.177 ms)']], { w: 1100, x0: 330, wMax: 500, h0: 52, chu: 22, log: true, ghi: 'log scale · loopback only: no real network, no TLS · real' }) +
    box('35,512× and 87,944×, on the same machine', 'A real network between two machines only adds to this. The web lesson measured 0.14 / 1.29 ms on another machine; the shape is the same.', 'cam') },

  { t: 'Numbers this course already measured', to: true, giua: true, body: bang(['', 'measured in', 'what it says about splitting'], [
    ['tracing across processes: −17.6% req/s', 'chapter 15 (OpenTelemetry)', 'not optional once a request spans services'],
    ['cluster on I/O work: +6.7%', 'chapter 16.4', 'more processes do not make waiting faster'],
    ['97.2% of request time in the DB', 'chapter 16.2', 'the bottleneck is not the process'],
    ['a retried payment: 300,000 instead of 100,000 VND', 'chapter 13.3', 'partial failure becomes the normal case'],
  ], { co: 21, hl: [3] }) + box('Every one of these is a number, not an adjective', 'Bring them to the argument, and most "we should split" discussions end quickly.', 'xanh') },

  { t: 'The three real signals', to: true, giua: true, body: steps([
    '<b>Wildly DIFFERENT scaling profiles</b> — one part needs 16 cores for CPU work, the rest needs 2. Chapter 16: cluster gave 3.4× on CPU work, 1.07× on I/O',
    '<b>Different release cadences</b> — one part changes daily, another quarterly and under audit. A shared deploy makes the slow part carry the fast part\'s risk',
    '<b>Teams treading on each other</b> — merge conflicts, waiting for each other to deploy, nobody daring to touch the other\'s files',
  ]) + box('None of them is "the codebase is big"', 'Signal 3 is decisive; the other two are usually solvable without splitting.', 'cam') +
    cards([['Check signal 1', 'A CPU profile per route (16.1): is one part CPU-bound while the rest waits?'], ['Check signal 2', 'git log per folder: does one part ship ten times as often as another?'], ['Check signal 3', 'Merge conflicts and "waiting for your deploy" — counted, not felt.']], 3) },

  { t: 'Conway: systems take the shape of the people who build them', to: true, giua: true, body: two(box('A boundary that matches a team boundary', 'Each team owns, deploys and is woken up for its own service. The network call costs something — and buys independence.', 'xanh'), box('A boundary that matches nothing', 'One person maintaining six services has every failure mode and none of the benefit.', 'do2')) +
    flow([{ t: 'team A', s: 'payments', mau: LAM }, { t: 'service A', s: 'deploys alone', mau: NODE }, { t: 'team B', s: 'catalogue', mau: LAM }, { t: 'service B', s: 'deploys alone', mau: NODE }], { h: 120 }) +
    box('Like a kitchen', 'Three cooks can share one kitchen if they each own a station. Splitting one cook\'s work across three kitchens just adds walking.', 'lam') },

  { t: 'A real trap: splitting to fix what splitting makes worse', to: true, giua: true, body: cards([['"Deploys are risky"', 'One artefact becomes several with an ordering requirement. More risk, not less.'], ['"The code is hard to understand"', 'Confusing in one repository becomes confusing in six, with network calls between the confusing parts.'], ['What splitting really buys', 'Independent scaling and independent failure — paid for in latency, partial failure and distributed transactions.']], 3) +
    box('Team frustration is not one of the three signals', 'It is a symptom. Find which of the three it really is before reaching for a network boundary.', 'do2') +
    flow([{ t: '"deploys scare us"', s: 'symptom', mau: CAM }, { t: 'smoke test + rollback', s: 'chapter 17', mau: NODE }, { t: '"code is confusing"', s: 'symptom', mau: CAM }, { t: 'layers + facades', s: '18.1–18.3', mau: NODE }], { h: 110 }) },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured', 'the rule'], [
    ['a call over HTTP', '0.072 ms vs 2.0 ns in-process', 'every boundary costs ~10⁴–10⁵×'],
    ['tracing', '−17.6% req/s', 'required once requests span processes'],
    ['I/O-bound scaling', '+6.7% with more processes', 'splitting does not make waiting faster'],
    ['partial failure', '300,000 instead of 100,000 VND', 'designed for, or paid for'],
    ['signals', 'scaling · cadence · teams', 'never "the codebase is big"'],
  ], { co: 22 }) + box('Part 2: the middle option, and what this system already does', 'A modular monolith, tables with owners, and the two pieces that would split first.', 'lam') },

  { t: 'The middle option nobody names', to: true, giua: true, body: flow([{ t: 'one file', s: 'everything together', mau: CAM }, { t: 'modular monolith', s: 'one deploy, hard inner walls', mau: NODE }, { t: 'twelve services', s: 'network between everything', mau: DO }], { h: 130 }) +
    cards([['One process, one deploy', 'You keep transactions, JOINs, and nanosecond function calls.'], ['Modules with EXPLICIT facades', 'Each feature exports a narrow API; importing another module\'s insides is forbidden — and enforced by lint.'], ['Tables have owners', 'Each module OWNS its tables; other modules read through its facade, not by querying them.'], ['Splittable later', 'The boundaries are already in place: splitting becomes turning function calls into network calls.']], 4) },

  { t: 'The step that gets skipped: tables have owners', to: true, giua: true, body: two(box('Without it', 'The boundaries exist in the folder tree and not in the data. A later split has to be rewritten from scratch, because every module reaches into every table.', 'do2'), box('With it', 'Only the courses module queries course tables. Everyone else asks the courses facade. A future split is a change of transport, not a rewrite.', 'xanh')) +
    box('Measured in 18.3', 'prisma.user is queried from 57 separate places in this backend — exactly the thing a modular monolith would forbid.', 'cam') +
    flow([{ t: 'enrolment module', s: 'wants course data', mau: LAM }, { t: 'courses facade', s: 'getCourse(id)', mau: NODE }, { t: 'course tables', s: 'owned by courses', mau: NODE }], { h: 110 }) },

  { t: 'The default that is right far more often than it is chosen', to: true, giua: true, body: steps([
    '<b>Start as a monolith with clean internal boundaries</b>',
    '<b>Split only when a specific, measured pain arrives</b> — a deploy queue, a scaling profile that genuinely differs, a team that cannot ship',
    '<b>Value the option to wait</b> — splitting is reversible in theory and almost never in practice',
  ]) + box('Every hour on distributed-systems machinery', 'before you have distributed-systems problems is an hour not spent on the product.', 'cam') +
    flow([{ t: 'monolith', s: 'clean boundaries', mau: NODE }, { t: 'measured pain', s: 'one of the three signals', mau: CAM }, { t: 'split ONE part', s: 'along a boundary already there', mau: LAM }], { h: 120 }) +
    box('The boundaries you drew in 18.1–18.3 are what make a later split cheap', 'Services, facades and table owners are the preparation; the network is only the last step.', 'xanh') },

  { t: 'You are already running a distributed system', to: true, giua: true, body: cards([['The job queue (ch. 13)', 'Producer and consumer meet through Redis. The worker can become its own process at any time.'], ['R2 / object storage (ch. 10)', 'Your files already live in another service — network calls and their failures, handled.'], ['Redis (ch. 12)', 'Shared state outside the process: what makes more than one replica possible at all.'], ['Payments and AI APIs', 'Already external: timeouts, retries, idempotency keys — you wrote all of it.']], 2) +
    box('So the question is not "network boundaries or not"', 'It is whether to add MORE of them inside code you control — where they buy the least and cost the most.', 'lam') },

  { t: 'What this website runs', to: true, giua: true, body: TT('c18/prod-arch', 1, 13, 'grep in docker-compose.yml and src/ · real', { n: 104, hl: [2, 4, 6, 7, 9, 11, 13], sm: true }) +
    two(box('One backend process, one database, one VPS', '7 containers: postgres, redis, backend, frontend, tts, coturn, nginx. Correct on all three signals: I/O-bound, one release cadence, one person.', 'xanh'), box('The useful boundaries are already there', 'R2 for files, Redis for shared state (and the Socket.IO adapter), external APIs for payments and AI — each adopted because something required it.', 'lam')) },

  { t: 'The two pieces that would split first', to: true, giua: true, body: cards([['embedQueue.service.ts', 'An in-process array queue (const _jobs = [], line 41). Its own comment admits a crash loses in-flight jobs.'], ['cron.service.ts', '40 cron.schedule calls guarded by one per-process flag (let _started, line 30). A second process runs every job twice (16.4).']], 2) +
    flow([{ t: 'today: one process', s: 'both correct', mau: NODE }, { t: 'a 2nd process appears', s: 'both break silently', mau: DO }, { t: 'move them first', s: 'queue + lock into Redis', mau: CAM }], { h: 120 }) +
    box('This is more useful than any opinion about microservices', 'It names exactly what a second process would break, before it exists.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your team of two runs a Notes API; 95% of request time is the database. A colleague wants to split "auth", "notes" and "search" into three services "so it scales". (1) Which of the three signals apply? (2) Name two measured costs from this lesson they would pay. (3) What would you do instead, and what would make you change your mind?', '') +
    box('Hint', 'Slides 5, 7 and 11.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) None: one cadence, one small team, and the work is I/O — more processes bought +6.7%. (2) Any two: a call over HTTP is ~0.072 ms against 2 ns; tracing costs −17.6%; no transactions across services (the triple charge). (3) A modular monolith with facades and table owners; change your mind when one part needs a very different scaling profile, a different release cadence, or a separate team.', 'xanh')}</div>` },

  { t: 'Lesson 18.4 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['function vs HTTP', '2.0 ns vs 0.072 / 0.177 ms', 'boundaries are expensive'],
    ['signals', 'scaling · cadence · teams', 'split on a measured pain'],
    ['modular monolith', 'facades + table owners', 'the default that is usually right'],
    ['already distributed', 'R2 · Redis · queue · external APIs', 'add boundaries only where they buy something'],
    ['this website', '1 process · 40 cron · in-process queue', 'know what a 2nd process would break'],
  ], { co: 22 }) + box('Next: 18.5 — decisions you cannot take back', 'One-way doors, writing down why, and what technical debt really is.', 'lam') },
]);
