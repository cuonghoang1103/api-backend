/**
 * api-10-4 — API Design · Chapter 10 · Lesson 10.4 "Realtime APIs: polling, SSE or WebSocket" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s10-bat-dong-bo.mjs › api-10-3-realtime. Output = chạy thật perf/realtime.mjs, idle.mjs, sse-resume.mjs, sse-buffer.mjs, two-instances.mjs.
 */
import { lamDeck, http, two, box, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 10 — Async and realtime', bai: '10.4' };

export const deck = { key: 'api-10-4', code: 'API 10.4', title: 'Realtime APIs', sub: 'Polling, SSE or WebSocket — choosing the contract' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Polling, SSE<br>or WebSocket?', sub: 'Four contracts for the same events —<br>measured, not guessed.' },

  { t: 'Four clients, same 30 events', body: `<table class="t"><tr><th>Contract</th><th>How</th></tr>
<tr><td><b>Polling</b> · GET /v2/events?after=42</td><td>plain HTTP, cacheable; delay ≈ half the interval</td></tr>
<tr><td><b>Long polling</b> · …&amp;wait=25</td><td>server holds the request until an event or 25 s</td></tr>
<tr><td><b>SSE</b> · GET /v2/events/stream</td><td>one never-ending response; browser reconnects itself</td></tr>
<tr><td><b>WebSocket</b> · ws://…/v2/ws</td><td>two-way upgrade; your own format and resume</td></tr></table>` + two(http(`$ node perf/realtime.mjs
30 sự kiện trong 14.7 s
client         nhận   p50     p95     max     request  byte
polling 2 s      30   1112 ms  1982 ms  2005 ms      8   12875
long polling     30      1 ms     4 ms     4 ms     30   20664
SSE              30      1 ms     5 ms     7 ms      1   10114
WebSocket        30      0 ms     3 ms     3 ms      2   10562`, { sm: true }), http(`# a quiet hour: 100 clients × 30 s, 0 events
$ node perf/idle.mjs poll
⇒ 1500 request, ~524 KB
$ node perf/idle.mjs long
⇒ 100 request, ~35 KB
$ node perf/idle.mjs sse
⇒ 100 request, ~33 KB`, { sm: true }), 'r64') + box('What a quiet hour costs', 'Polling made 1,500 requests to say “nothing new”, each authenticated and logged. Chapter 5’s IP limit (100 per 60 s) blocks a computer room behind one NAT within seconds.', 'do2') },

  { t: 'Server-Sent Events: the format and the resume', body: http(`$ curl -sN --max-time 2 …/v2/events/stream -H 'Last-Event-ID: 40'
retry: 3000

id: 41
event: labflow.booking.created.v1
data: {"id":"41","specversion":"1.0","type":"labflow.booking.created.v1",…,"status":"PENDING","version":1}
`, { sm: true, wrap: 'any', title: 'text/event-stream' }) + http(`$ node perf/sse-resume.mjs                      # EVENTS_KEEP=20
lần đầu                        nhận 5: 1:bk_1 2:bk_2 3:bk_3 4:bk_4 5:bk_5
(a) nối lại, KHÔNG Last-Event-ID nhận 2: 11:bk_11 12:bk_12
(b) Last-Event-ID: 5           nhận 7: 6:bk_6 7:bk_7 8:bk_8 9:bk_9 10:bk_10 11:bk_11 12:bk_12
(c) Last-Event-ID: 5 (quá cũ)  nhận 1: reset {"latest":"42"}`, { sm: true, wrap: 'any' }) + two(box('Resume is the contract', 'No Last-Event-ID ⇒ bk_6…bk_10 lost silently. With it: 7 of 7, in order. Too far behind ⇒ one <b>reset</b> event: reload state, continue from latest.', 'xanh'), box('Details that matter', 'Subscribe <b>before</b> replaying, hold what arrives meanwhile. <code class="i">: ping</code> every 15 s keeps proxies from closing idle streams.', 'lam')) },

  { t: 'The trap: works in curl, fails in the browser', giua: true, body: vsd(http(`$ node perf/sse-buffer.mjs
Content-Encoding: gzip · sinh 8 sự kiện ở giây 1…8 · client thấy 0: —
$ … curl -sN --max-time 3 …/v2/events/stream
retry: 3000

id: 9
event: labflow.booking.created.v1
$ … curl -sN --max-time 3 --compressed …
(curl --compressed: không thấy gì sau 3 s)`, { sm: true, wrap: 'any', title: 'LABFLOW_SSE_NOFLUSH=1' }) + '<p class="nho">Compression buffers a window of output: fine for JSON, fatal for a stream. Every browser sends Accept-Encoding: gzip.</p>',
  http(`$ node perf/sse-buffer.mjs
Content-Encoding: gzip · sinh 8 sự kiện ở giây 1…8 · client thấy 8: bk_1@1.1s bk_2@2.1s bk_3@3.1s bk_4@4.1s bk_5@5.1s bk_6@6.1s bk_7@7.1s bk_8@8.1s`, { sm: true, wrap: 'any', title: 'res.flush() after every write' }) + '<p class="nho">One layer out, nginx buffers proxied responses too ⇒ LabFlow sends <b>X-Accel-Buffering: no</b>. Test with gzip, not plain curl.</p>',
  '✗ Without flush', '✓ With flush') },

  { t: 'Who is listening, and on which server?', body: http(`$ node perf/ws-demo.mjs
POST /v2/realtime/tickets ⇒ 201 { ticket: "tkt_K8pj…", expiresIn: 30 }
đã nối (101 Switching Protocols)
← {"type":"hello","latest":"0"}
→ {"type":"resume","after":"0"}
dùng lại vé cũ ⇒ 401 {"type":"https://labflow.example/problems/ticket-invalid","status":401,"code":"TICKET_INVALID"}`, { sm: true, wrap: 'any' }) + box('Tickets for browsers', 'EventSource/WebSocket cannot send Authorization; a JWT in the URL lands in proxy logs ⇒ a ticket: 30 s, usable once.', 'lam') + two(http(`# events in process memory
$ node perf/two-instances.mjs
tạo 10 lượt đặt qua :4000 · client nối :4002 thấy 0: —`, { sm: true, wrap: 'any' }), http(`# LABFLOW_EVENTS=redis
$ node perf/two-instances.mjs
tạo 10 lượt đặt qua :4000 · client nối :4002 thấy 10: bk_1 … bk_10`, { sm: true, wrap: 'any' })) + box('Fan-out through Redis', 'Every instance tails one Redis Stream and pushes to its own clients; the stream is also the replay log.', 'xanh') },

  { t: 'Choosing, and summary', giua: true, body: `<table class="t"><tr><th>Pick</th><th>When</th></tr>
<tr><td><b>Polling</b></td><td>few clients, seconds don’t matter, job status (10.1) with Retry-After</td></tr>
<tr><td><b>Long polling</b></td><td>a fallback when a proxy blocks streaming</td></tr>
<tr><td><b>SSE</b></td><td>server → client feeds: dashboards, notifications, progress — LabFlow’s default</td></tr>
<tr><td><b>WebSocket</b></td><td>both directions at high rate: chat, editing, games — you own the protocol</td></tr></table>
<ul>
<li>Polling 2 s: p50 <b>1.1 s</b> late and <b>1,500</b> idle requests per 100 clients per 30 s; SSE 1 ms, 100</li>
<li>Last-Event-ID: 7 of 7 instead of 5 lost · no flush: browsers saw <b>0 of 8</b> · Redis Stream: <b>0 → 10 of 10</b></li>
</ul>
${box('Next', 'Lesson 10.5 — webhooks: pushing events to someone else’s server.', 'xanh')}` },
]);
