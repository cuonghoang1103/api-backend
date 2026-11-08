/**
 * node-13-3 — Node.js · Chapter 13 · Lesson 13.3 "Failure: retries, backoff, and the charge that ran three times" (slide EN, đợt 10 — 08/11/2026).
 * MỘT deck, HAI tập: node-13-3 (slide 1–12) · node-13-3-2 (slide 13–24).
 *   A: ví dụ đời thường (người giao hàng quay lại · thu ngân quẹt thẻ lần nữa) · mặc định KHÔNG thử lại (thật) · cố định 300 ms (thật: 311/312/302) · luỹ thừa 200 ms
 *      (thật: 204/415/811/1.604, failed sau 5) · jitter (thật: 145/369/469/1.138) · chọn attempts/delay · tự lành ở lần 3 (thật) · trừ tiền 3 lần (thật: 300.000 VND) ·
 *      at-least-once ≠ exactly-once · bảng phần 1.
 *   B: ba cách idempotent (thật: khoá duy nhất ⇒ trừ 1 lần, dòng kẹt PENDING · check-then-act 2 lần vs claim 1 lần · khoá idempotency ⇒ 1 lần) · jobId (thật: 5 lần bấm ⇒ 1,
 *      xoá xong ⇒ hoá đơn thứ hai, dấu ":" ném lỗi) · đống job chết (thật: 5 failed ⇒ sửa ⇒ 5 completed) · UnrecoverableError (thật: 5 lần vs 1 lần) · thử lại không miễn phí ·
 *      website (embedQueue.service.ts THẬT dòng 139–150: thử lại ngay, không backoff) · bài tập · bốn luật.
 * Nguồn: nodejs-13-3-thu-lai-va-idempotent. Output THẬT: that/c13/{retry,idem,jobid,dlq,unrecoverable} (Node 22.23.3, BullMQ 6.7.2, pg 8.23.1, Redis 7.4.9 + PostgreSQL 17 Docker).
 * Khác web: khoảng cách luỹ thừa 204/415/811/1.604 (web 288/417/826/1.674) · cố định 311/312/302 (web 368/312/311) · bổ sung đo thật: jitter, ba cách idempotent, UnrecoverableError ·
 *   cách 1 để lại dòng PENDING không ref (nêu rõ: cần đối soát hoặc kết hợp cách 3) · web nói website "đánh dấu tài liệu pending|processing|ready|failed" — thật ra đánh dấu JOB trong RAM
 *   (không có cột embeddingStatus) ⇒ đã sửa web.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, JW, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-13-3', code: 'NODE 13.3', title: 'Failure: retries, backoff, and the charge that ran three times', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const R = (ten, re) => dong(`c13/${ten}`, re);
const gaps = (re) => R('retry', re).match(/gaps: (.*?)( <-|$)/)[1].split(', ').map((x) => Number(x.replace(' ms', '')));
const G2 = gaps(/doubling every time/), GJ = gaps(/random, but still/), GF = gaps(/^\s+gaps: \d+ ms, \d+ ms, \d+ ms$/);
const WEB = readFileSync('/Users/admin/Downloads/api-backend/src/services/embedQueue.service.ts', 'utf8').split('\n');

const doiSvg = `<svg data-k="giao" viewBox="0 0 1100 220" width="1100" height="220" font-family="Arial">
<rect x="10" y="15" width="530" height="190" rx="16" fill="${NODE}12" stroke="${NODE}" stroke-width="3"/>
<text x="34" y="92" font-size="56">📦</text><text x="114" y="62" font-size="23" font-weight="700" fill="${NODE}">a courier, nobody home</text>
<text x="114" y="96" font-size="19" fill="#444">comes back tomorrow, then in 2 days,</text><text x="114" y="122" font-size="19" fill="#444">then in 4 — and leaves a note after 5 tries</text>
<text x="34" y="176" font-size="20" font-weight="700" fill="${NODE}">= retry + backoff + a dead-letter pile</text>
<rect x="560" y="15" width="530" height="190" rx="16" fill="${DO}12" stroke="${DO}" stroke-width="3"/>
<text x="584" y="92" font-size="56">💳</text><text x="664" y="62" font-size="23" font-weight="700" fill="${DO}">a cashier, the printer jams</text>
<text x="664" y="96" font-size="19" fill="#444">no receipt came out… so she swipes</text><text x="664" y="122" font-size="19" fill="#444">your card again. And again.</text>
<text x="584" y="176" font-size="20" font-weight="700" fill="${DO}">= a retry of work that is not idempotent</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 13 — Background jobs and queues', bai: '13.3' }, [
  // ── PART 1 ──
  { cover: true, t: 'Failure: retries, backoff,<br>and the charge<br>that ran three times', sub: 'A queue turns "the email failed" into "the email was late" — but only if you configure it. Configure it carelessly and you create a worse bug than the one you fixed.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>What BullMQ does with a failing job when you configure nothing</li>
<li>Fixed vs exponential backoff, and jitter — measured gap by gap</li>
<li>The bug that retries create: one order, three charges</li>
<li>Three ways to make a handler idempotent, and jobId at the door</li>
<li>The dead-letter pile, failing on purpose, and what retries cost</li>
</ul>` + box('Why it matters to you', 'Every job fails sometimes. Whether that means "late" or "charged three times" is decided by four lines of options and one property of your handler.', 'lam') },

  { t: 'An everyday picture: the courier and the cashier', to: true, giua: true, body: doiSvg + two(
    box('Retrying is how you survive', 'The courier comes back, waiting longer each time, and gives up with a note. Nothing is lost; nobody is spammed.', 'xanh'),
    box('Retrying is how you double-charge', 'The swipe may have WORKED — only the receipt failed. Doing it again is safe only if the second swipe cannot charge twice.', 'do2')) },

  { t: 'What happens with no configuration at all', to: true, giua: true, body: J(`await emailQueue.add('welcome', { userId: 42 });          // no options
new Worker('email', async () => { throw new Error('SMTP 421'); }, { connection });`, { sm: false, hl: [1] }) +
    TT('c13/retry', 2, 5, 'node retry.mjs · scenario 1 · real', { hl: [2, 4], n: 104, sm: false }) +
    two(box('One attempt. No retry.', 'The job moves to the failed set and stays there, silently, forever.', 'do2'),
      box('Still better than 13.1', 'The work is not lost: the data and the error message are kept, so it can be replayed — if somebody looks.', 'lam')) },

  { t: 'Turning retries on: fixed backoff', to: true, giua: true, body: J(`await emailQueue.add('welcome', { userId: 42 }, {
  attempts: 4,                                  // 1 try + 3 retries
  backoff: { type: 'fixed', delay: 300 },       // wait the SAME 300 ms each time
});`, { sm: false, hl: [2, 3] }) +
    TT('c13/retry', 7, 9, 'node retry.mjs · scenario 2 · real', { hl: [2, 3], n: 104, sm: false }) +
    box('The wrong default', 'A job usually fails because something downstream is OVERLOADED. Knocking again every 300 ms adds load to a service that is already drowning — your retries become the outage.', 'do2') },

  { t: 'Exponential backoff: the gap doubles', to: true, giua: true, body: TT('c13/retry', 11, 14, 'node retry.mjs · scenario 3 · attempts: 5, backoff { type: "exponential", delay: 200 } · real', { hl: [2, 3], n: 104, sm: false }) +
    thanh(G2.map((g, i) => [`retry ${i + 1}`, g, i < 1 ? NODE : i < 3 ? CAM : DO, `waited ${g.toLocaleString('en-US')} ms`]), { w: 1100, x0: 200, wMax: 640, h0: 52, chu: 21, ghi: 'the gap before each retry · real' }) +
    box('Room to recover', 'Each wait is twice the last: delay × 2^(n−1). The other side gets more and more time to come back before you knock again.', 'xanh') },

  { t: 'Jitter: do not retry in one wave', to: true, giua: true, body: J(`backoff: { type: 'exponential', delay: 200, jitter: 0.5 },   // each wait is randomised a bit`, { sm: false, hl: [1] }) +
    TT('c13/retry', 16, 17, 'node retry.mjs · scenario 3b · real', { hl: [2], n: 104, sm: false }) +
    flow([{ t: '1,000 jobs fail', s: 'the provider blipped at 10:00:00', mau: DO }, { t: 'no jitter', s: 'all retry at 10:00:01 — a wave', mau: CAM }, { t: 'with jitter', s: 'retries spread out', mau: NODE }], { h: 120 }) +
    box('The same idea as lesson 12.2', 'There jitter spread out cache expiries; here it spreads out retries. Identical delays synchronise every worker into one stampede.', 'lam') },

  { t: 'Choosing attempts and delay', to: true, giua: true, body: bang(['options', 'retries happen after (computed: delay × 2^(n−1))', 'covers'], [
    ['attempts 5, delay 200 (measured above)', '0.2 → 0.6 → 1.4 → 3.0 s', 'a blip'],
    ['attempts 5, delay 1,000', '1 → 3 → 7 → 15 s', 'most transient failures'],
    ['attempts 8, delay 1,000', '… → 31 → 63 → 127 s', 'a provider restarting'],
    ['attempts 3, fixed 300', '0.3 → 0.6 s', 'almost nothing — it hammers'],
  ], { co: 21, hl: [1] }) + two(box('A reasonable default', 'attempts: 5, exponential, delay: 1000 — the last retry lands about 15 s after the first try.', 'xanh'),
      box('Attempts are a budget', 'Every attempt is another call to someone else\'s service — and maybe another bill. 3 to 5 is usually right.', 'cam')) },

  { t: 'When it works, it is invisible', to: true, giua: true, body: TT('c13/retry', 19, 22, 'node retry.mjs · scenario 4 · the SMTP server comes back on attempt 3 · real', { hl: [2, 3], n: 104, sm: false }) +
    flow([{ t: 'try 1', s: 'SMTP 421', mau: DO }, { t: 'try 2', s: 'SMTP 421', mau: DO }, { t: 'try 3', s: 'sent ✓', mau: NODE }, { t: 'state', s: 'completed', mau: NODE }], { h: 120 }) +
    box('The whole point of the chapter, in four lines', 'Two failures, one success, final state completed, nobody paged. "The email failed" became "the email was a second late".', 'xanh') },

  { t: 'The bug that retries create', to: true, giua: true, body: J(`new Worker('payments', async (job) => {
  await psp.charge(job.data.orderId, job.data.amount);   // the card is debited…
  await saveReceipt(job.data.orderId);                  // …and the network drops here
}, { connection });                                     // attempts: 3`, { sm: false, hl: [2, 3] }) +
    TT('c13/retry', 24, 25, 'node retry.mjs · scenario 5 · 100,000 VND, the reply is lost after the charge · real', { hl: [2], n: 104, sm: false }) +
    flow([{ t: 'try 1', s: 'charge ✓ · reply lost', mau: DO }, { t: 'try 2', s: 'charge ✓ · reply lost', mau: DO }, { t: 'try 3', s: 'charge ✓ · reply lost', mau: DO }, { t: 'the customer', s: '−300,000 VND', mau: DO }], { h: 110 }) +
    box('The retry did exactly what you asked', 'Three charges for one order. "Retry until it succeeds" is only safe for work that can be repeated without consequence. This job could not.', 'do2') },

  { t: 'At-least-once, not exactly-once', to: true, giua: true, body: cards([
    ['🔁 a retry', 'The attempt failed AFTER the work happened — like the charge above.'],
    ['🧟 a stalled job', 'A worker crashed after the work but before the ACK; another worker runs it again (lesson 13.5).'],
    ['🖱 a duplicate add', 'The user double-clicked "Pay"; two jobs exist for one order.'],
  ], 3) + flow([{ t: 'at-least-once', s: 'the queue promises this', mau: CAM }, { t: '+ an idempotent handler', s: 'YOU write this', mau: LAM }, { t: '= effectively once', s: 'what the user sees', mau: NODE }], { h: 110 }) + box('The most important idea in the chapter', 'A queue guarantees AT-LEAST-ONCE delivery. Exactly-once does not exist in distributed systems. What exists is an IDEMPOTENT handler — running it twice has the same effect as once — which makes at-least-once look exactly like exactly-once.', 'cam') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured', 'the rule'], [
    ['no options', '1 run, failed, no retry', 'retries are something you configure'],
    ['fixed 300 ms', `gaps ${GF.join(' / ')} ms`, 'hammers a struggling service'],
    ['exponential 200 ms', `gaps ${G2.join(' / ')} ms`, 'room to recover'],
    ['+ jitter 0.5', `gaps ${GJ.join(' / ')} ms`, 'no synchronised wave'],
    ['charge, then the reply is lost', '300,000 VND for a 100,000 VND order', 'retry only idempotent work'],
  ], { co: 21 }) + box('Part 2', 'Three ways to make a handler idempotent, jobId at the door, the dead-letter pile, and failing on purpose.', 'lam') },

  // ── PART 2 ──
  { t: 'Three ways to make a handler idempotent', to: true, giua: true, body: cards([
    ['1 · a unique key in YOUR database', 'Insert a row keyed by the order first; a second run hits the unique constraint and stops. The safest.'],
    ['2 · check the state first', 'Read "is it done?" before acting. Cheap — but a race window remains.'],
    ['3 · an idempotency key at the provider', 'The payment provider remembers the key and returns the first result. Best, when they support it.'],
  ], 3) + box('The test for all three', 'Run the handler twice in a row, and twice at the same time. The world must look the same as after one run.', 'xanh') +
    box('Same failure for every way below', 'The card is charged, then the reply is lost on the first two attempts; attempts: 3.', 'lam') },

  { t: 'Way 1 — a unique key in the database', to: true, giua: true, body: J(`async function handleCharge(job) {
  const { orderId, amount } = job.data;
  try {
    await db.query("INSERT INTO payment VALUES ($1, $2, 'PENDING', NULL)", [orderId, amount]);
  } catch (err) {
    if (err.code === '23505') return { skipped: 'already charged' };   // Prisma: P2002 (lesson 7.3)
    throw err;
  }
  const r = await psp.charge({ orderId, amount });
  await db.query("UPDATE payment SET status = 'DONE', ref = $2 WHERE order_id = $1", [orderId, r.id]);
}`, { sm: true, hl: [4, 6] }) +
    TT('c13/idem', 2, 2, 'node idem.mjs · way 1 · PostgreSQL 17 · real', { hl: [1], n: 118, sm: true }) +
    two(box('Charged once', 'The second run hit the primary key and stopped before charging.', 'xanh'),
      box('…but look at the row', 'status PENDING, ref null: the money was taken and your record never heard back. Reconcile with the provider — or combine with way 3.', 'cam')) },

  { t: 'Way 2 — check the state, and its race', to: true, giua: true, body: two(J(`// ✗ check, then act
const d = await db.doc.findUnique(…);
if (d.thumbnailKey) return { skipped: true };
await render();                // both workers
await save('thumb-N.webp');    // get here`, { sm: false, hl: [3] }), J(`// ✓ claim in ONE statement
const { rowCount } = await db.query(
  \`UPDATE doc SET thumbnail_key = 'rendering'
   WHERE id = $1 AND thumbnail_key IS NULL\`, [id]);
if (rowCount === 0) return { skipped: true };`, { sm: false, hl: [4, 5] })) +
    TT('c13/idem', 3, 4, 'node idem.mjs · way 2 · two copies of the same job, concurrency 2 · real', { hl: [1, 2], n: 118, sm: true }) +
    box('Acceptable when running twice is only wasteful', 'Two workers both read "no thumbnail yet" before either writes. For a thumbnail: wasted CPU. For money: never. Claiming with one atomic UPDATE closes the window.', 'cam') },

  { t: 'Way 3 — an idempotency key at the provider', to: true, giua: true, body: J(`await psp.charge({ orderId, amount }, { idempotencyKey: \`charge-\${orderId}\` });`, { sm: false, hl: [1] }) +
    TT('c13/idem', 5, 5, 'node idem.mjs · way 3 · a fake provider that remembers keys, like Stripe does · real', { hl: [1], n: 118, sm: true }) +
    flow([{ t: 'try 1', s: 'charge(key) → ch_1 · reply lost', mau: CAM }, { t: 'try 2', s: 'same key → ch_1 again', mau: NODE }, { t: 'try 3', s: 'same key → ch_1 again', mau: NODE }], { h: 120 }) +
    box('The best option — when the other side supports it', 'The provider does the dedupe on ITS side, where the money is. A stable key per order: never a random one per attempt.', 'xanh') },

  { t: 'Stopping duplicates at the door: jobId', to: true, giua: true, body: J(`await invoiceQueue.add('create', { orderId }, { jobId: \`invoice-\${orderId}\` });`, { sm: false, hl: [1] }) +
    TT('c13/jobid', 2, 4, 'node jobid.mjs · 5 clicks on "Pay" · real', { hl: [3, 4, 5], n: 96, sm: false }) +
    flow([{ t: '5 clicks', s: 'add() × 5', mau: CAM }, { t: 'same jobId', s: 'invoice-ORD-2026-777', mau: LAM }, { t: '1 job', s: '1 invoice', mau: NODE }], { h: 110 }) +
    box('A deterministic id from the THING the job acts on', 'Derive it from the order, the user, the date — never from Date.now(). BullMQ refuses to create a second job with the same id.', 'xanh') },

  { t: 'Where the jobId guard ends', to: true, giua: true, body: TT('c13/jobid', 6, 10, 'node jobid.mjs · the same jobId, later · real', { hl: [3, 4, 7], n: 98, sm: false }) +
    two(box('Only while the old job exists', 'Once the completed job is removed — and you MUST clean up, lesson 13.5 — the same id is accepted again. jobId guards a short window, not forever. Use it AND an idempotent handler.', 'cam'),
      box('No colon in a jobId', 'Use invoice-ORD-777, not invoice:ORD-777. The colon is BullMQ\'s own key separator (bull:queue:id), so it throws.', 'do2')) },

  { t: 'The dead-letter pile, and how to work it', to: true, giua: true, body: flow([{ t: 'attempts used up', s: 'the job stops retrying', mau: DO }, { t: 'the failed set', s: 'data + failedReason kept', mau: CAM }, { t: 'fix the cause', s: 'deploy the config', mau: LAM }, { t: 'job.retry()', s: 'replay them all', mau: NODE }], { h: 110 }) + two(J(`const failed = await queue.getFailed(0, 1000);
for (const job of failed) await job.retry();`, { sm: false, hl: [2] }), TT('c13/dlq', 2, 5, 'node dlq.mjs · 5 SMS, the key is missing · real', { hl: [1, 5], n: 50, sm: false })) +
    two(box('Failed jobs keep everything', 'The data and the failedReason stay. Fix the real cause, then one loop replays the pile.', 'xanh'),
      box('Give the failed set an alert', 'A queue quietly piling up failures has stopped working while every graph looks green. The only signal is a number nobody is watching.', 'do2')) },

  { t: 'Failing on purpose', to: true, giua: true, body: J(`import { UnrecoverableError } from 'bullmq';
new Worker('email', async (job) => {
  const user = await db.user.findUnique({ where: { id: job.data.userId } });
  if (!user) throw new UnrecoverableError('user no longer exists');   // fail NOW, no retry
  await sendWelcomeEmail(user.email);           // an error HERE is worth retrying
}, { connection });`, { sm: false, hl: [4] }) +
    TT('c13/unrecoverable', 2, 3, 'node unrecoverable.mjs · attempts: 5 for both · real', { hl: [2], n: 104, sm: false }) +
    box('The rule of thumb', 'Retry INFRASTRUCTURE failures (timeouts, 5xx, connection reset). Never retry LOGIC failures (4xx, validation, a missing record): they fail identically five times.', 'cam') },

  { t: 'Retrying is not free', to: true, giua: true, body: cards([
    ['💸 a paid API', 'attempts: 10 against a metered API can bill you ten times for one piece of work.'],
    ['📧 your domain', 'Aggressive email retries get your domain marked as a spam source.'],
    ['🌊 a retry storm', 'Ten thousand failed jobs retrying hit the downstream harder than the original traffic did.'],
  ], 3) + flow([{ t: 'attempts 3–5', s: 'per queue, on purpose', mau: NODE }, { t: 'exponential + jitter', s: 'spread the load', mau: LAM }, { t: 'a limiter (13.4)', s: 'cap the drain rate', mau: CAM }], { h: 110 }) +
    box('So the retries cannot become the second outage', 'The meter is running on someone else.', 'do2') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: JW(WEB.slice(140, 149).join('\n'), 92, [1, 7], { sm: false }) +
    two(box('src/services/embedQueue.service.ts, real lines 141–149', 'A hand-rolled version of attempts: 3 — but the retry is IMMEDIATE (no backoff), and it is the in-memory JOB that is marked, not the document.', 'lam'),
      box('The right instinct', 'The file\'s safety net is "jobs are idempotent (re-running is safe)". Whatever queue you use, the handler must survive running twice.', 'xanh')) },

  { t: 'Exercise', to: true, giua: true, body: flow([{ t: '1 · INSERT invoice', s: 'a row in your DB', mau: LAM }, { t: '2 · charge the card', s: 'the provider', mau: DO }, { t: '3 · email the PDF', s: 'SMTP 421, 421, then ✓', mau: CAM }], { h: 110 }) + box('Exercise', 'A job "send-invoice" (1) inserts an invoice row, (2) charges the card at the provider, (3) emails the PDF. It runs with attempts: 5. Step 3 fails with SMTP 421 twice, then succeeds. How many invoice rows, charges and emails do you get — and what do you change so the answer is 1 / 1 / 1?', '') +
    `<div data-k="dapan">${box('Answer', 'As written: 3 rows, 3 charges, 1 email — every retry restarts at step 1. Fix: (1) INSERT with a unique key on the order (a retry skips the insert); (2) charge with an idempotency key "charge-ORDERID"; (3) split the email into its OWN job, added after the charge succeeds, so an SMTP failure retries only the email. Add jobId "invoice-ORDERID" against double clicks.', 'xanh')}</div>` },

  { t: 'Retrying without charging the card three times', to: true, giua: true, body: cards([
    ['1 · a timeout is UNKNOWN, not failed', 'The request may have succeeded and only the reply was lost. This one sentence is why retries need idempotency.'],
    ['2 · retry only what is safe to repeat', 'A read, a PUT, a delete. A payment only with a key that makes the second attempt return the first result.'],
    ['3 · back off exponentially, with jitter', 'Constant retries finish off a struggling service; identical delays synchronise every worker into one wave.'],
    ['4 · cap attempts, keep the failure', 'After the cap, the job lands in the failed set where a human can see it — with an alert on it.'],
  ], 2) + box('Next: 13.4 — scheduling', 'Delays that mean "not before", the OTP that jumps the queue, a limiter shared across processes, and why setInterval is the wrong tool.', 'lam') },
]);
