/**
 * api-10-6 — API Design · Chapter 10 · Lesson 10.6 "Webhooks (2): receiving" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s10-bat-dong-bo.mjs › api-10-4-nhan-webhook. Output = chạy thật webhooks/receiver.mjs :4005 (VERIFY/DEDUPE/ASYNC/ORDER) + LabFlow ch10.
 */
import { lamDeck, sql, http, two, box, steps, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 10 — Async and realtime', bai: '10.6' };

export const deck = { key: 'api-10-6', code: 'API 10.6', title: 'Webhooks (2): receiving', sub: 'Raw bodies, replays, fast answers and order' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Webhooks (2):<br>receiving', sub: 'A public endpoint, duplicates, wrong order —<br>and a sender that gives up if you are slow.' },

  { t: 'The receiver’s checklist', body: two(steps([
    '<b>Raw body</b> — the exact bytes that were signed',
    '<b>Signature + time</b> — HMAC matches, timestamp within 5 min, else 401',
    '<b>Seen this webhook-id?</b> — yes ⇒ answer 2xx and stop',
    '<b>Answer 2xx now</b> — store/queue the event, work later',
    '<b>Apply if newer</b> — compare data.version',
  ]), box('Break one at a time', 'webhooks/receiver.mjs on :4005 — every step is an environment switch: VERIFY, DEDUPE, ASYNC, ORDER. Switch one off, measure what it prevents.', 'lam'), 'r64') + sql(`app.post('/hooks', express.raw({ type: 'application/json' }), async (req, res) => {
  const body = req.body.toString('utf8');                    // the exact signed bytes
  const v = verify(SECRET, req.headers, body, { toleranceSec: TOLERANCE });      // if (VERIFY)
  if (!v.ok) { stats.rejected++; … return res.status(401).json({ error: v.reason }); }
  const id = req.get('webhook-id');
  if (DEDUPE && seen.has(id)) { stats.duplicates++; return res.status(200).json({ duplicate: true }); }
  …
  if (ASYNC) { setImmediate(() => handle(event).catch(console.error)); return res.status(202).end(); }`, { lang: 'javascript', sm: true, hl: [1, 8] }) },

  { t: 'Raw bytes, forgeries and replays', body: http(`$ node webhooks/reserialize.mjs
body thô        : {"type": "labflow.booking.created.v1", "data": {"labName": "Ph\\u00f2ng Lab M\\u1ea1ng"}}
parse + stringify: {"type":"labflow.booking.created.v1","data":{"labName":"Phòng Lab Mạng"}}
chữ ký trên body thô v1,ZLrEsD7a9yl… · trên bản dựng lại v1,wAoADndHaYw… ⇒ LỆCH`, { sm: true, wrap: 'any', title: 'express.json() + JSON.stringify ≠ the bytes a Python sender signed' }) + http(`$ node webhooks/replay.mjs ../dump.json --tamper
body đã sửa (chữ ký ký 1 s trước) ⇒ 401 {"error":"bad signature"}
$ node webhooks/replay.mjs ../dump.json
gửi lại y nguyên (chữ ký ký 1 s trước) ⇒ 200 {"duplicate":true}
$ sleep 10; node webhooks/replay.mjs ../dump.json
gửi lại y nguyên (chữ ký ký 11 s trước) ⇒ 401 {"error":"timestamp outside tolerance"}`, { sm: true, wrap: 'any', title: 'a captured delivery, TOLERANCE_SEC=10' }) + two(box('Verify the raw body', 'Same data, different bytes, different signature — and it only breaks for Vietnamese lab names.', 'do2'), box('Two defences, together', 'The window limits how long a capture is useful; the id store covers replays inside it. Compare with timingSafeEqual.', 'xanh')) },

  { t: 'Answer first, work later — measured three ways', body: `<p class="nho">The receiver’s work takes 3 s (an email to the lecturer + another system); LabFlow waits 2 s and allows 5 attempts.</p>` + http(`# slow, no dedupe
{"attempt":1,"status":null,"error":"timeout 2000 ms","durationMs":2003}
…
{"attempt":5,"status":null,"error":"timeout 2000 ms","durationMs":2004}
{"received":5,"rejected":0,"duplicates":0,"emails":5,"processed":5,"stale":0,"failedOnPurpose":0}
# slow + dedupe
{"attempt":1,"status":null,"error":"timeout 2000 ms","durationMs":2004}
{"attempt":2,"status":200,"error":null,"durationMs":7}
{"received":2,"rejected":0,"duplicates":1,"emails":1,"processed":1,"stale":0,"failedOnPurpose":0}
# ASYNC=1: 202 first, then the 3-second job
{"attempt":1,"status":202,"error":null,"durationMs":21}
{"received":1,"rejected":0,"duplicates":0,"emails":1,"processed":1,"stale":0,"failedOnPurpose":0}`, { sm: true, wrap: 'any', title: '/v2/webhooks/{id}/deliveries  +  receiver /state' }) + two(box('5 timeouts, 5 emails', 'Both sides did their job; together they sent five emails and logged a failure (BỎ sau 5 lần).', 'do2'), box('1 attempt, 21 ms, 1 email', '“Later” means a queue (10.2), not setImmediate: a receiver that crashes after 202 must still find the event.', 'xanh')) },

  { t: 'The cancellation that arrived before the booking', body: `<p class="nho">An books and cancels at once; the receiver fails its first request (FAIL_FIRST=1), so <b>created</b> is retried after <b>cancelled</b> was delivered.</p>` + vsd(http(`$ sleep 4; grep '✓' recv.log
✓ msg_1793495989883-0_wh_mvx57… labflow.booking.cancelled.v1 bk_1 v2
✓ msg_1793495989863-0_wh_mvx57… labflow.booking.created.v1 bk_1 v1
$ curl -s …:4005/state | jq -c '{bookings, stale: .stats.stale}'
{"bookings":{"bk_1":{"status":"PENDING","version":1}},"stale":0}`, { sm: true, wrap: 'any' }) + '<p class="nho">The department believes the lab is booked when it is free.</p>', http(`$ sleep 4; grep '✓' recv.log
✓ msg_1793495998569-0_wh_mvx57… labflow.booking.cancelled.v1 bk_1 v2
✓ msg_1793495998551-0_wh_mvx57… labflow.booking.created.v1 bk_1 v1
$ curl -s …:4005/state | jq -c '{bookings, stale: .stats.stale}'
{"bookings":{"bk_1":{"status":"CANCELLED","version":2}},"stale":1}`, { sm: true, wrap: 'any' }) + '<p class="nho">Same two events, same wrong order — one stale event dropped.</p>', '✗ ORDER=0 (last write wins)', '✓ Version check') + box('The check, and without a version', '<code class="i">if (ORDER &amp;&amp; cur &amp;&amp; cur.version &gt;= b.version) { stats.stale++; return; }</code> — older news is dropped. No version? Timestamps are weak (two events share a second): fetch current state instead.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Verify the <b>raw body</b>: re-serialising Python-style JSON changed the signature for the same data</li>
<li>Captured request: changed body <b>401</b>, same id in the window <b>200 duplicate</b>, after it <b>401</b></li>
<li>3 s work vs 2 s timeout: <b>5 attempts, 5 emails</b> · dedupe: 2 attempts, 1 email · 202 first: <b>1 attempt, 21 ms</b></li>
<li>Cancellation before creation: last-write-wins ended PENDING; the version check kept CANCELLED</li>
<li>Dedupe ids live as long as the sender retries, written with the effect in one transaction</li>
</ul>
${box('Next', 'Lab 10 — the usage report as a background job with a webhook.', 'xanh')}` },
]);
