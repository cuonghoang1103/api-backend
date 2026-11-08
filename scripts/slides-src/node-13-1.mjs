/**
 * node-13-1 — Node.js · Chapter 13 · Lesson 13.1 "A request is not a place to do work" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, MỘT tập node-13-1 (17 slide).
 *   bốn thứ hỏng · ví dụ đời thường (quầy thu ngân + bếp + phiếu) · phép đo 1 độ trễ (thật: p95 308,7 vs 11,7 ms = 26,5× · 200 request 325,3 vs 43,6 = 7,5×) ·
 *   phép đo 2 SMTP chịu 5 kết nối (thật: 5/100 vs 100/100, đỉnh 5 cả hai, rút cạn 4.144,9 ms) · hình hài thay đổi · ba chi tiết gánh trọng lượng ·
 *   nên/không nên vào hàng đợi · hoá đơn trải nghiệm (thật: 202 + GET /jobs/:id active → completed/failed) · đừng add trong transaction (thật: NOT FOUND ×2, rollback) ·
 *   website (embedQueue.service.ts THẬT dòng 1–18) · bài tập · tóm tắt.
 * Nguồn: nodejs-13-1-vi-sao-hang-doi. Output THẬT: that/c13/{sync-async,smtp-limit,status,in-tx} (Node 22.23.3, BullMQ 6.7.2, ioredis 6.0.0, Express 5.3.0, pg 8.23.1,
 *   Redis 7.4.9 + PostgreSQL 17 trong Docker `node13-redis` 127.0.0.1:4880 / `node13-pg` 127.0.0.1:4881, macOS, máy bận ⇒ phép đo 1 = trung vị 5 vòng).
 * Khác web: 50 request p95 26,5× (web 17×) · 200 request 7,5× (web 7×) · 50 email xong sau 934,8 ms (web 930,4) · bản đồng bộ p95 50,6 ms vì 95 request bị từ chối NGAY (web 272,1) ·
 *   rút cạn 4.144,9 ms (web 4.126,0). Bổ sung ngoài web: đo thật add() trong transaction + endpoint trạng thái.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, TT, thanh, dong, ra } from './_c9-chung.mjs';

export const deck = { key: 'node-13-1', code: 'NODE 13.1', title: 'A request is not a place to do work', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const R = (ten, re) => dong(`c13/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const P95 = (n, k) => num(ra('c13/sync-async').split('\n').filter((l) => l.startsWith(`/${k} `))[n], /p95 ([\d.]+) ms/);
const S50 = P95(0, 'sync'), A50 = P95(0, 'async'), S200 = P95(1, 'sync'), A200 = P95(1, 'async');
const X50 = num(R('sync-async', /faster at p95/), /sees ([\d.]+)x/);
const DRAIN = num(R('smtp-limit', /drained the queue/), /in ([\d.]+) ms/);
const WEB = readFileSync('/Users/admin/Downloads/api-backend/src/services/embedQueue.service.ts', 'utf8').split('\n');

const bepSvg = `<svg data-k="bep" viewBox="0 0 1100 230" width="1100" height="230" font-family="Arial">
<rect x="10" y="20" width="340" height="190" rx="16" fill="${LAM}12" stroke="${LAM}" stroke-width="3"/>
<text x="40" y="92" font-size="54">🧑‍💼</text><text x="120" y="70" font-size="23" font-weight="700" fill="${LAM}">the cashier</text>
<text x="120" y="104" font-size="19" fill="#444">takes the order,</text><text x="120" y="130" font-size="19" fill="#444">hands you ticket #27</text><text x="40" y="180" font-size="20" font-weight="700" fill="${LAM}">= your route (202)</text>
<line x1="352" y1="115" x2="398" y2="115" stroke="#b85a2b" stroke-width="4"/><path d="M398,105 L414,115 L398,125 z" fill="#b85a2b"/>
<rect x="420" y="20" width="300" height="190" rx="16" fill="${CAM}12" stroke="${CAM}" stroke-width="3"/>
<text x="450" y="92" font-size="54">🧾</text><text x="530" y="70" font-size="23" font-weight="700" fill="${CAM}">the ticket rail</text>
<text x="530" y="104" font-size="19" fill="#444">orders wait</text><text x="530" y="130" font-size="19" fill="#444">in a line</text><text x="450" y="180" font-size="20" font-weight="700" fill="${CAM}">= the queue</text>
<line x1="722" y1="115" x2="768" y2="115" stroke="#b85a2b" stroke-width="4"/><path d="M768,105 L784,115 L768,125 z" fill="#b85a2b"/>
<rect x="790" y="20" width="300" height="190" rx="16" fill="${NODE}12" stroke="${NODE}" stroke-width="3"/>
<text x="820" y="92" font-size="54">🧑‍🍳</text><text x="900" y="70" font-size="23" font-weight="700" fill="${NODE}">the kitchen</text>
<text x="900" y="104" font-size="19" fill="#444">cooks at its</text><text x="900" y="130" font-size="19" fill="#444">own pace</text><text x="820" y="180" font-size="20" font-weight="700" fill="${NODE}">= the worker</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 13 — Background jobs and queues', bai: '13.1' }, [
  { cover: true, t: 'A request is not<br>a place to do work', sub: 'Send the welcome email inside the route and the user waits for it, loses it when it fails, and drowns the mail server when 100 people sign up at once. Measured.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The four things that break when slow work runs inside a request</li>
<li>Measurement 1: what the user waits for — inline vs a queue</li>
<li>Measurement 2: the one that changes your mind — 5 emails out of 100</li>
<li>The shape of the change, and the three details that carry it</li>
<li>What belongs in a queue, the UX bill, and the transaction trap</li>
</ul>` + box('Why it matters to you', 'Every real app grows work that is not about producing THIS response: email, thumbnails, payments, webhooks. Where you put that work decides whether it is late — or gone.', 'lam') },

  { t: 'What actually goes wrong', to: true, giua: true, body: cards([
    ['⏳ The user has to wait', 'Your latency becomes the latency of the slowest party in the chain — and you do not control it.'],
    ['💥 A failure loses it outright', 'The other side errors → the request 500s → the work vanishes, with no trace left to retry from.'],
    ['🚫 No brakes', '1,000 simultaneous sign-ups = 1,000 concurrent SMTP connections, against a server that can take 5.'],
    ['🔪 A deploy cuts straight through', 'SIGTERM in the middle of an outbound call. Lesson 13.5 measures exactly this.'],
  ], 2) + box('The boundary', 'Twelve chapters treated a request as the unit of everything. The first time a route must do work that is not about this response, you cross a hard line.', 'cam') },

  { t: 'An everyday picture: the cashier and the kitchen', to: true, giua: true, body: bepSvg + two(
    box('A cashier who cooks', 'Takes your order, then walks into the kitchen and cooks it while the line behind you grows. If the stove fails, your order is simply forgotten.', 'do2'),
    box('A cashier with a ticket rail', 'Takes the order, pins a ticket, gives you number 27 at once. The kitchen works through the rail at its own pace — and a burnt dish is cooked again.', 'xanh')) },

  { t: 'Measurement 1 — what the user waits for', to: true, giua: true, body: J(`app.post('/sync', async (req, res) => {      // BEFORE: the route does the work
  await sendWelcomeEmail();                        // 300 ms
  res.status(201).json({ ok: true });
});
app.post('/async', async (req, res) => {     // AFTER: the route only records it
  const job = await emailQueue.add('welcome', { userId: 42 });
  res.status(202).json({ jobId: job.id });
});`, { sm: false, hl: [2, 6] }) +
    TT('c13/sync-async', 2, 6, 'node sync-async.mjs · 50 concurrent POSTs · median of 5 rounds · real', { hl: [3, 4], n: 104, sm: false }) +
    box(`${X50}× faster at p95`, `The worker still sends all 50 emails — it simply does it after the users already have their answer.`, 'xanh') },

  { t: 'At 200 concurrent requests the gap narrows', to: true, giua: true, body: TT('c13/sync-async', 7, 11, 'node sync-async.mjs · 200 concurrent POSTs · median of 5 rounds · real', { hl: [3, 4], n: 104, sm: false }) +
    thanh([['50 · inline', S50, DO, `p95 ${S50} ms`], ['50 · queued', A50, NODE, `p95 ${A50} ms`], ['200 · inline', S200, DO, `p95 ${S200} ms`], ['200 · queued', A200, CAM, `p95 ${A200} ms`]], { w: 1100, x0: 230, wMax: 640, h0: 54, chu: 21, ghi: 'p95 latency the user sees · real' }) +
    box('Enqueuing is not free', `${X50}× at 50, only ${(S200 / A200).toFixed(1)}× at 200: every add() is a Redis round trip (lesson 12.1). This is the boring half of the argument.`, 'lam') },

  { t: 'Measurement 2 — the outside world has a limit', to: true, giua: true, body: flow([
    { t: '100 sign-ups', s: 'at the same instant', mau: LAM }, { t: 'your API', s: 'sends the welcome email', mau: NODE }, { t: 'SMTP server', s: '5 connections · 200 ms', mau: CAM }, { t: 'the 6th one', s: '421 Too many…', mau: DO }], { h: 130 }) +
    TT('c13/smtp-limit', 4, 9, 'node smtp-limit.mjs · A) send inside the request · real', { hl: [2, 3, 6], n: 104, sm: false }) +
    box('Not slow. Gone.', 'The synchronous version did not send slowly — it did not send at all, for 95 people, permanently, and reported HTTP 500 to each of them.', 'do2') },

  { t: 'The same 100 sign-ups through a queue', to: true, giua: true, body: TT('c13/smtp-limit', 11, 17, 'node smtp-limit.mjs · B) enqueue, worker concurrency 5 · real', { hl: [2, 4, 5, 7], n: 104, sm: false }) +
    two(box('100 out of 100', `Every user got 202 at once; the worker drained the queue in ${DRAIN.toLocaleString('en-US')} ms, five at a time. Not one email was lost.`, 'xanh'),
      box('A correctness difference', '5 / 100 versus 100 / 100 is not "faster". It is the difference between working and not working.', 'lam')) },

  { t: 'Peak connections: 5 in BOTH cases', to: true, giua: true, body: thanh([['emails sent · inline', 5, DO, '5 / 100'], ['emails sent · queued', 100, NODE, '100 / 100'], ['peak to SMTP · inline', 5, CAM, '5'], ['peak to SMTP · queued', 5, CAM, '5']], { w: 1100, x0: 330, wMax: 560, h0: 58, chu: 22, ghi: 'from the two runs above · real' }) +
    box('A queue is a place to put things down', 'The queue did not make the mail server faster. It made your system stop asking for more than the server can give — and it REMEMBERED the rest instead of dropping it.', 'xanh') },

  { t: 'The shape of the change', to: true, giua: true, body: two(J(`// BEFORE — the route does all the work
app.post('/register', async (req, res) => {
  const user = await createUser(req.body);
  await sendWelcomeEmail(user.email);  // 300 ms, may fail,
                                       // failing = lost
  res.status(201).json(user);
});`, { sm: true, hl: [4] }), J(`// AFTER — the route only records the work
app.post('/register', async (req, res) => {
  const user = await createUser(req.body);
  await emailQueue.add('welcome', { userId: user.id }, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
  });
  res.status(201).json(user);          // answers NOW
});`, { sm: true, hl: [4, 5, 6] })) + flow([{ t: 'route', s: 'createUser + add()', mau: NODE }, { t: 'Redis', s: 'the note waits', mau: DO }, { t: 'worker', s: 'another process', mau: LAM }, { t: 'SMTP', s: 'at its own pace', mau: CAM }], { h: 110, fs: 20 }) +
    box('Three lines moved', 'The route still creates the user. It no longer waits for the mail server — it writes a note saying "send this", and a worker reads the note.', 'lam') },

  { t: 'Three details that carry the weight', to: true, giua: true, body: J(`// what lands in Redis: a NOTE about the work, not the work
{ name: 'welcome',
  data: { userId: 42 },
  opts: { attempts: 5, backoff: { type: 'exponential', delay: 1000 } } }`, { sm: false, hl: [3, 4] }) + cards([
    ['🆔 userId, not the user', 'The worker re-reads the database, so it never acts on a stale snapshot from ten minutes ago (lesson 13.2 runs it).'],
    ['🔁 attempts + backoff', 'This pair turns "the email failed" into "the email was late". Without it there is NO retry (lesson 13.3).'],
    ['📮 201 or 202', 'Still 201 here: the user really was created. Use 202 Accepted when the resource itself is not ready yet.'],
  ], 3) + box('Read every diff like this', 'What does the job carry? What happens when it fails? What does the status code promise?', 'cam') },

  { t: 'What belongs in a queue, and what does not', to: true, giua: true, body: two(
    box('✓ Belongs on a queue', 'sending email / SMS / push · calling third-party APIs · thumbnails and video transcoding · rebuilding search indexes · exporting reports · outbound webhooks · periodic cleanup', 'xanh'),
    box('✗ Does NOT belong', 'anything whose answer is needed NOW (a password check, a data read) · work that must run in the SAME transaction as the write · work cheaper than enqueueing it', 'do2')) +
    flow([{ t: 'needed for THIS answer?', s: 'yes → keep it in the request', mau: LAM }, { t: 'same transaction?', s: 'yes → keep it in the request', mau: LAM }, { t: 'slower than an add()?', s: 'yes → queue it', mau: NODE }], { h: 120, fs: 21 }) +
    box('The last exclusion matters', 'Enqueuing costs a Redis round trip plus a worker wake-up. If the work itself takes 2 ms, you made it slower AND added a moving part.', 'cam') },

  { t: 'The UX bill you just signed', to: true, giua: true, body: cards([
    ['1 · say nothing', 'Let the result appear. Fine for a welcome email.'],
    ['2 · a status endpoint', 'GET /jobs/:id → waiting | active | completed | failed. The client polls.'],
    ['3 · push it', 'Send the result over the socket from chapter 11.'],
  ], 3) + TT('c13/status', 2, 6, 'node status.mjs · POST /exports/2026-10, then poll every 300 ms · real', { hl: [1, 5], n: 120, sm: true }) +
    box('The failure mode of async work', 'It is not an error message. It is a user who never finds out. Pick one of the three on purpose.', 'do2') },

  { t: 'Do not enqueue inside a transaction', to: true, giua: true, body: TT('c13/in-tx', 2, 11, 'node in-tx.mjs · PostgreSQL 17 + BullMQ · the worker reads the user the moment it gets the job · real', { hl: [3, 6, 9, 10], n: 104, sm: false }) +
    two(box('Before COMMIT', 'The worker can read the database before the row is visible — NOT FOUND. If the transaction rolls back, the job points at a user who never existed.', 'do2'),
      box('After COMMIT — or an outbox', 'Enqueue after the commit. If losing the job between commit and add() is unacceptable, write it as a row in the SAME transaction and let a sweeper enqueue it (transactional outbox).', 'xanh')) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: J(WEB.slice(2, 16).join('\n'), { sm: false, hl: [3, 4, 7, 11] }) +
    box('src/services/embedQueue.service.ts of this website, real lines 3–17', 'The upload answers at once; chunking and embedding run in the background. Not BullMQ: an in-process array — one process, and the trade-off written down. Lesson 13.5 measures what it costs.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: flow([{ t: 'charge the card', s: '2 s · the provider', mau: DO }, { t: 'receipt email', s: '300 ms · SMTP', mau: CAM }, { t: 'rebuild "top products"', s: '4 s · heavy SQL', mau: LAM }, { t: 'checkout page', s: 'times out at 5 s', mau: '#555555' }], { h: 120, fs: 20 }) + box('Exercise', 'POST /orders charges the card (2 s at the payment provider), sends a receipt email (300 ms), and rebuilds the "top products" page (4 s). The checkout page times out at 5 s. Which of the three stay inside the request, which go to a queue — and what status code do you answer?', '') +
    `<div data-k="dapan">${box('Answer', 'The receipt email and the "top products" rebuild go to queues: nobody waits for them, and both are safe to retry. The charge is the answer the user is waiting for: keep it in the request (or make the whole order async, answer 202 and show a status page). Answer 201 with the order — the order exists. And add() only after COMMIT.', 'xanh')}</div>` },

  { t: 'A request is not a place to do work — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['p95, 50 concurrent', `${S50} → ${A50} ms (${X50}×)`, 'answer first, work later'],
    ['p95, 200 concurrent', `${S200} → ${A200} ms`, 'enqueuing is a round trip too'],
    ['SMTP takes 5 at once', '5 / 100 sent → 100 / 100', 'a queue is a place to put things down'],
    ['add() before COMMIT', 'worker: NOT FOUND', 'enqueue after commit, or an outbox'],
    ['the user got 202', 'active → completed / failed', 'decide how they find out'],
  ], { co: 22 }) + box('Next: 13.2 — BullMQ', 'Queue, Worker, and what one job really is inside Redis — five keys, a hash and a list.', 'lam') },
]);
