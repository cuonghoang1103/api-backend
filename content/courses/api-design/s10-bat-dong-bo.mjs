/**
 * API Design — Chương 10: Bất đồng bộ và thời gian thực (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, PostgreSQL 18.4 (:55432, bảng bookings 1 triệu dòng), Redis 8.2.2 (:6390),
 * bullmq 6.3.16, ws 8.22.0, @asyncapi/parser 3.6.4. Việc nền 202 + Location + /v2/jobs (proxy 100 s ⇒ 524, server vẫn làm tới 114,8 s),
 * hàng đợi BullMQ + worker (API/worker chết, stalled ~34 s, SIGTERM êm, 6 việc 30,9 → 10,4 s), hợp đồng sự kiện CloudEvents (mỏng/dày,
 * phiên bản, AsyncAPI 3.1, giao trùng 17 / mất 21 / đúng 1.000, ghi kép mất 342 vs outbox 0), polling/long polling/SSE/WebSocket
 * (trễ p50 1,1 s vs ~1 ms, nối lại Last-Event-ID, gzip thiếu res.flush() ⇒ 0/8), webhook Standard Webhooks (gửi: SSRF, ký, backoff,
 * nhật ký giao; nhận: body thô, phát lại, trả 202 trước, version). Mã cuối chương = lời giải Lab 10. Slide: api-10-1 … api-10-6 + api-lab-10.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-10-1-hang-doi, api-10-2-su-kien, api-10-3-realtime, api-10-4-webhook (thứ tự hiển thị 10.1, 10.3, 10.4, 10.5) và title chương;
 * bài MỚI tách ra: 10.2 api-10-1-worker, 10.6 api-10-4-nhan-webhook; lab api-10-7-lab, quiz api-10-8-quiz.
 */

import G101 from './giang/api-10-1.mjs';
import G102 from './giang/api-10-2.mjs';
import G103 from './giang/api-10-3.mjs';
import G104 from './giang/api-10-4.mjs';
import G105 from './giang/api-10-5.mjs';
import G106 from './giang/api-10-6.mjs';
import GL10 from './giang/api-lab-10.mjs';

export default {
  title: 'Chapter 10 — Async and realtime|||Chương 10 — Bất đồng bộ và thời gian thực',
  description: 'API bất đồng bộ và thời gian thực, đo thật trên LabFlow: 202 Accepted + tài nguyên công việc (proxy 100 s cắt việc xuất 114 s thành 524 trong khi server vẫn làm), hàng đợi BullMQ và worker sống qua API chết, worker bị giết, deploy; hợp đồng sự kiện CloudEvents mỏng/dày, phiên bản, AsyncAPI, consumer idempotent (17 bản trùng, 21 mất, đúng 1.000) và outbox (ghi kép mất 342 sự kiện, outbox 0); polling, SSE và WebSocket trên cùng luồng (trễ 1,1 s so với ~1 ms, nối lại bằng Last-Event-ID, bẫy gzip); webhook ký Standard Webhooks, thử lại lùi dần, nhận an toàn; lab báo cáo thành việc nền có webhook kèm script chấm, quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — Asynchronous APIs: 202 Accepted, job resources and polling|||10.1 — API bất đồng bộ: 202 Accepted, tài nguyên công việc và hỏi lại',
      slug: 'api-10-1-hang-doi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở đầu chương: học xong làm được gì. Việc xuất cả trường 114 s sau proxy 100 s ⇒ 524 mà server vẫn làm, bấm lại là nhân đôi; 202 + Location + Retry-After trả lời trong 17 ms; tài nguyên công việc (trạng thái, tiến độ, kết quả, lỗi), 404 việc người khác, 409 hỏi sớm, 410 hết hạn, huỷ 202, Idempotency-Key.',
      content: `${G101}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Asynchronous APIs: 202 Accepted, job resources and polling</h2>
<p class="lead">Some requests are not questions but <em>orders</em>: "export every booking of the semester". Answering them inside one HTTP request means the client, every proxy and the server all wait together — and the slowest of them decides when it fails. This lesson measures exactly that failure on LabFlow, then turns the order into a <strong>job</strong>: the API answers in milliseconds with <code>202 Accepted</code>, and a worker does the work from a queue.</p>

<div class="callout ok">
<p><strong>After Chapter 10 you can:</strong></p>
<ul>
  <li>turn a slow request into a job resource — <code>202</code>, <code>Location</code>, status, progress, cancel, how long results are kept — with a real queue (BullMQ on Redis 8.2) and a separate worker (10.1);</li>
  <li>write an event contract other teams can trust: thin or fat, versions, AsyncAPI, consumers that survive duplicates, and the outbox that stops events from vanishing (10.2);</li>
  <li>choose between polling, long polling, Server-Sent Events and WebSocket from measured latency and cost, and make reconnects lose nothing (10.3);</li>
  <li>send webhooks that receivers can verify, retry them politely, and receive them safely (10.4); then rebuild the Lab 8 report as a job with a webhook in Lab 10.</li>
</ul>
<p><strong>Why it is worth learning:</strong> every real backend has work that does not fit in a request — exports, emails, payments, AI calls. The way you expose that work (a job, an event, a stream, a webhook) is part of your API contract, and the bugs it causes — lost jobs, duplicate emails, stuck spinners — are the ones users notice first.</p>
</div>

<h3>A button that takes two minutes</h3>
<p>Cô Lan wants a CSV of every booking on campus this semester, with attendance, for the faculty report. The data is the Chapter 3 table in PostgreSQL (1,000,000 rows). The slow part is not SQL: for every 500 rows LabFlow must ask the campus attendance service, which answers in about 250 ms (simulated with <code>EXPORT_BATCH_MS</code> so you can reproduce it). The first version simply waits:</p>
<pre><code class="language-javascript">exportsRouter.route('/bookings.csv')
  .get(validate('query', ExportQuery), async (req, res) =&gt; {
    const t0 = performance.now();
    res.on('close', () =&gt; { if (!res.writableFinished) console.log(&#96;[sync] client bỏ đi sau \${((performance.now() - t0) / 1000).toFixed(1)} s — server VẪN làm tiếp&#96;); });
    const csv = await exportBookings(req.valid.query);            // ngồi chờ: 2 phút cho cả trường một học kỳ
    console.log(&#96;[sync] xong sau \${((performance.now() - t0) / 1000).toFixed(1)} s, \${csv.length} byte&#96;);
    res.type('text/csv').send(csv);
  })
  .all(onlyAllow('GET', 'HEAD'));

exportsRouter.route('/')
  .post(idempotent(), validate('body', ExportQuery), async (req, res) =&gt; {
    const job = await createJob('bookings-export', req.valid.body, req.user.id);
    const base = &#96;/v\${req.apiVersion}/jobs&#96;;
    res.status(202)                                                // 202: đã NHẬN, chưa LÀM — RFC 9110 §15.3.3
      .location(&#96;\${base}/\${job.id}&#96;)                               // theo dõi ở đây
      .set('Retry-After', process.env.JOB_POLL_SEC ?? '2')
      .json(toJob(job, base));
  })
  .all(onlyAllow('POST'));</code></pre>
<p>One lab takes 2.3 s — fine. The whole campus is another story. Between Cô Lan and LabFlow there is usually a proxy or CDN; <code>perf/edge-proxy.mjs</code> plays that role and gives up after 100 seconds without a response:</p>
<pre><code class="language-bash">curl -s -i \\
  -H 'Authorization: Bearer tok_lan' -w '⇒ %{http_code} after %{time_total} s\\n' 'http://localhost:8090/v2/exports/bookings.csv?from=2026-11-01&amp;to=2027-03-01'</code></pre>
<div class="out">HTTP/1.1 524 unknown
content-type: text/plain
Date: Sun, 01 Nov 2026 01:02:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

error code: 524 (A timeout occurred)
⇒ 524 after 100.012553 s</div>
<p>Cô Lan clicks again — another 524 at 100 s. This is LabFlow's own log for those minutes:</p>
<div class="out">[sync] client bỏ đi sau 100.0 s — server VẪN làm tiếp
[sync] xong sau 114.8 s, 11698254 byte
[sync] client bỏ đi sau 100.0 s — server VẪN làm tiếp
[sync] xong sau 114.4 s, 11698254 byte</div>
<p>Read it slowly — three problems in four lines. The client got an error after 100 s. The server did <em>not</em> know: it kept working until 114.8 s and produced an 11.7 MB file that nobody received. And when the user clicked again, the whole 114 s of work (and 428 calls to the attendance service) ran a second time. A longer timeout only moves the cliff: Cloudflare's default is 125 s, nginx's <code>proxy_read_timeout</code> is 60 s, a phone on campus Wi-Fi may drop much sooner. <code>524</code> is not even a standard HTTP code — Node prints its reason phrase as <code>unknown</code>; it is Cloudflare's "a timeout occurred".</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">sync</span><span class="lz-t">POST … wait 114 s</span><span class="lz-d">client, proxy and server all hold the connection</span></div>
  <div class="lz-step"><span class="lz-k">async 1</span><span class="lz-t">POST ⇒ 202 in ms</span><span class="lz-d">Location: /v2/jobs/job_1 — "order received"</span></div>
  <div class="lz-step"><span class="lz-k">async 2</span><span class="lz-t">worker does the work</span><span class="lz-d">from a queue, in another process</span></div>
  <div class="lz-step"><span class="lz-k">async 3</span><span class="lz-t">client asks or is told</span><span class="lz-d">GET the job (polling), or a webhook (10.4)</span></div>
</div>
<a class="link-card" href="https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-524/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Cloudflare — Error 524 (read 1 Nov 2026)</span><span class="lc-sub">524 = Cloudflare reached the origin but got no response within the Proxy Read Timeout (default 125 s). Its own advice: "Implement status polling of large HTTP processes" — exactly this lesson.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>202 Accepted: "received, not done yet"</h3>
<p>HTTP already has a status for this. RFC 9110 calls <code>202 Accepted</code> "intentionally noncommittal": the server has accepted the request, processing has not finished, and the response should point to a <em>status monitor</em>. In LabFlow the monitor is a new resource, the <strong>job</strong>:</p>
<pre><code class="language-bash">curl -s -i -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_1","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">HTTP/1.1 202 Accepted
Vary: Origin, Accept-Encoding
LabFlow-Version: 2
Location: /v2/jobs/job_1
Retry-After: 2
Content-Type: application/json; charset=utf-8
Content-Length: 378
ETag: W/"17a-59YB+fFzR2jOQLKAY9OcT70AFPE"
Server-Timing: validate;dur=1.32, total;dur=17.06
Date: Sun, 01 Nov 2026 01:27:42 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "job_1",
  "kind": "bookings-export",
  "status": "running",
  "progress": {
    "done": 0,
    "total": null,
    "percent": 0
  },
  "createdAt": "2026-11-01T01:27:42.007Z",
  "startedAt": null,
  "finishedAt": null,
  "cancelRequested": false,
  "result": null,
  "error": null,
  "links": {
    "self": "/v2/jobs/job_1",
    "cancel": "/v2/jobs/job_1/cancel"
  }
}</div>
<p>Three headers carry the contract. <code>202</code> says "do not treat this as done". <code>Location</code> says where to look. <code>Retry-After: 2</code> says when to look again — so clients do not hammer the server every 50 ms. The <code>POST</code> took 17.1 ms on the server instead of two minutes, and nothing can time out because nothing is waiting.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110#name-202-accepted" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9110 §15.3.3 — 202 Accepted (read 1 Nov 2026)</span><span class="lc-sub">Accepted for processing, not yet completed; there is no way to re-send a status code later, so the response should describe the current status and link to a status monitor with an estimate.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>The job resource: what a client may rely on</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">queued → running</span><span class="lz-lnote">progress { done, total, percent } — total is null until the worker has counted</span></div>
  <div class="lz-layer"><span class="lz-lname">running → succeeded</span><span class="lz-lnote">result { href, contentType, bytes, expiresAt } — the file lives at its own URL</span></div>
  <div class="lz-layer"><span class="lz-lname">running → failed</span><span class="lz-lnote">error { code, detail } — after the worker's own retries are used up</span></div>
  <div class="lz-layer"><span class="lz-lname">queued | running → cancelled</span><span class="lz-lnote">POST /jobs/{id}/cancel; finished jobs cannot be cancelled (409)</span></div>
</div>
<p>The rules are the ones you know from Chapters 2–6: someone else's job is <code>404</code> (BOLA, 6.2 — try it with <code>tok_an</code>); asking for the result too early is a <code>409</code> with <code>Retry-After</code>; the status is <code>Cache-Control: no-store</code> because it changes every second.</p>
<pre><code class="language-bash">curl -s -i http://localhost:4000/v2/jobs/job_1/result -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Vary: Origin, Accept-Language, Accept-Encoding
LabFlow-Version: 2
Retry-After: 2
Content-Language: vi
Content-Type: application/problem+json; charset=utf-8
Content-Length: 276
ETag: W/"114-1TiIsXl+lF9HBOxZgQzC8z/478I"
Server-Timing: total;dur=1.69
Date: Sun, 01 Nov 2026 01:27:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/job-not-finished",
  "title": "Việc chưa xong",
  "status": 409,
  "detail": "Việc job_1 đang running; hỏi lại GET /jobs/job_1 sau Retry-After giây",
  "instance": "/v2/jobs/job_1/result",
  "code": "JOB_NOT_FINISHED"
}</div>
<p>A client that follows the contract is short — POST, then GET <code>Location</code> every <code>Retry-After</code> seconds until a final status, then download:</p>
<pre><code class="language-bash">node perf/poll-job.mjs '{"labId":"lab_2","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">  0.03 s  POST /v2/exports ⇒ 202, Location: /v2/jobs/job_2, Retry-After: 2
  0.04 s  GET /v2/jobs/job_2 ⇒ running     0%  (0/20000)
  2.04 s  GET /v2/jobs/job_2 ⇒ running    17%  (3500/20000)
  4.05 s  GET /v2/jobs/job_2 ⇒ running    37%  (7500/20000)
  6.05 s  GET /v2/jobs/job_2 ⇒ running    57%  (11500/20000)
  8.06 s  GET /v2/jobs/job_2 ⇒ running    77%  (15500/20000)
 10.06 s  GET /v2/jobs/job_2 ⇒ running    97%  (19500/20000)
 12.06 s  GET /v2/jobs/job_2 ⇒ succeeded 100%  (20000/20000)
 12.08 s  GET /v2/jobs/job_2/result ⇒ 200 text/csv; charset=utf-8, 20000 dòng, hết hạn 2026-11-01T02:27:56.288Z
⇒ 7 lần hỏi trạng thái; việc chạy 10.2 s</div>
<p>Seven status requests for a 10-second job. That is the price of polling, and Lesson 10.3 measures it against the alternatives; for a job that ends once, a webhook (10.4) is often cheaper still.</p>

<h3>Cancel, retention and a second click</h3>
<p>Three contract questions every async API must answer in writing, measured:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"from":"2026-11-01","to":"2027-03-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_2</div>
<pre><code class="language-bash">sleep 3; curl -s -X POST http://localhost:4000/v2/jobs/job_2/cancel -H 'Authorization: Bearer tok_lan' | jq -c '{status, cancelRequested, progress}'</code></pre>
<div class="out">{"status":"running","cancelRequested":true,"progress":{"done":5500,"total":213749,"percent":2}}</div>
<pre><code class="language-bash">sleep 1; curl -s http://localhost:4000/v2/jobs/job_2 -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress, finishedAt, links}'</code></pre>
<div class="out">{"status":"cancelled","progress":{"done":6000,"total":213749,"percent":2},"finishedAt":"2026-11-01T01:05:20.277Z","links":{"self":"/v2/jobs/job_2"}}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/jobs/job_2/cancel \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":409,"code":"JOB_FINISHED","detail":"Việc job_2 đã cancelled, không huỷ được nữa"}</div>
<p>Cancel is a request, so it is <code>202</code> with <code>cancelRequested: true</code>; the worker stops at the next batch (here 261 ms later, at 6,000 of 213,749 rows), and a second cancel is <code>409 JOB_FINISHED</code>. Results are not kept forever — an 11.7 MB CSV per click would fill Redis — so the job says <code>expiresAt</code> and the result becomes <code>410 Gone</code> afterwards (20 s here so you can watch it; LabFlow keeps results 1 hour and job records 7 days):</p>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/jobs/job_1 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, result}'</code></pre>
<div class="out">{"status":"succeeded","result":{"href":"/v2/jobs/job_1/result","contentType":"text/csv; charset=utf-8","bytes":230490,"expiresAt":"2026-11-01T01:05:39.249Z"}}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %{size_download} bytes\\n' http://localhost:4000/v2/jobs/job_1/result \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">200 230490 bytes</div>
<pre><code class="language-bash">sleep 20; curl -s http://localhost:4000/v2/jobs/job_1/result -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/result-expired",
  "title": "Kết quả đã hết hạn",
  "status": 410,
  "detail": "Kết quả của việc job_1 chỉ giữ 20 giây sau khi xong; hãy tạo việc mới",
  "instance": "/v2/jobs/job_1/result",
  "code": "RESULT_EXPIRED"
}</div>
<p>And the double click? The <code>Idempotency-Key</code> from Chapter 5 works unchanged on a <code>202</code>: same key, same body ⇒ the same job, not a second two-minute export.</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null -X POST http://localhost:4000/v2/exports -H 'Authorization: Bearer tok_lan' -H 'Idempotency-Key: exp-2026-11-lab3' --json '{"labId":"lab_3","from":"2026-11-01","to":"2027-03-01"}' | grep -iE '^(HTTP|location|idempotent)' | tr -d '\\r'; done</code></pre>
<div class="out">HTTP/1.1 202 Accepted
Location: /v2/jobs/job_1
HTTP/1.1 202 Accepted
Idempotent-Replayed: true
Location: /v2/jobs/job_1</div>

<h3>One question left: where does the work run?</h3>
<p>Everything above works with a job runner inside the API process (<code>LABFLOW_JOBS=memory</code>) — until the process restarts. Lesson 10.2 restarts it, kills workers on purpose, and moves the work into a real queue.</p>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“An endpoint takes two minutes. What do you do?”</strong> 202 + Location to a job resource with status, progress, cancel and an expiry; a durable queue and workers; the client polls with Retry-After or gets a webhook. Mention the proxy timeout and the double click.</li>
  <li><strong>“Why not just raise the timeout?”</strong> Every hop has one (CDN 125 s, nginx 60 s, mobile networks less); the server keeps working after the client is gone; retries double the work.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>perf/edge-proxy.mjs</code> with <code>EDGE_TIMEOUT_MS=60000</code> (nginx's default) and export one lab for the whole range. Does it survive? How many rows per second does the export make?</li>
  <li>Write the client side of the contract: on <code>409</code> wait <code>Retry-After</code>, on <code>410</code> start a new job with a new <code>Idempotency-Key</code>, on <code>failed</code> show <code>error.detail</code>.</li>
  <li>Add <code>estimatedSecondsLeft</code> to the job (from rows per second so far) and use it as <code>Retry-After</code>, capped at 10.</li>
</ol>
<p><strong>Done when:</strong> your poll client makes fewer status requests than before for the same export, and survives an expired result without asking the user twice.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">202 Accepted</span><span class="v">Received and accepted for processing, not finished.</span></div>
  <div class="kv"><span class="k">Job resource</span><span class="v">A URL that describes one piece of background work: status, progress, result.</span></div>
  <div class="kv"><span class="k">Polling</span><span class="v">The client asks again at intervals; Retry-After sets the pace.</span></div>
  <div class="kv"><span class="k">Status monitor</span><span class="v">What RFC 9110 asks a 202 to point to: where the client watches the work.</span></div>
  <div class="kv"><span class="k">Retention</span><span class="v">How long results and records are kept — then 410 Gone.</span></div>
  <div class="kv"><span class="k">Proxy read timeout</span><span class="v">How long a proxy waits for the origin before giving up (Cloudflare 524).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A 114 s export behind a 100 s proxy: the client got 524, the server kept working, a second click doubled the work.</li>
  <li><code>202</code> + <code>Location</code> + <code>Retry-After</code> answered in 17 ms; the job resource carries status, progress, result, error and links.</li>
  <li>Other people's jobs are 404; results too early 409, too late 410; cancel is 202 and takes effect at the next batch (261 ms).</li>
  <li>The same Idempotency-Key turns a second click into the same job — no second two-minute export.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>API bất đồng bộ: 202 Accepted, tài nguyên công việc và hỏi lại</h2>
<p class="lead">Có những request không phải câu hỏi mà là <em>đơn đặt hàng</em>: “xuất mọi lượt đặt của học kỳ”. Trả lời chúng ngay trong một request HTTP nghĩa là client, mọi proxy và server cùng ngồi chờ — và kẻ kém kiên nhẫn nhất quyết định lúc nào hỏng. Bài này đo đúng cái hỏng đó trên LabFlow, rồi biến đơn hàng thành một <strong>việc (job)</strong>: API trả lời trong vài mili-giây bằng <code>202 Accepted</code>, còn một worker (tiến trình làm việc nền) làm việc từ hàng đợi.</p>

<div class="callout ok">
<p><strong>Học xong Chương 10 bạn làm được:</strong></p>
<ul>
  <li>biến một request chậm thành tài nguyên công việc — <code>202</code>, <code>Location</code>, trạng thái, tiến độ, huỷ, giữ kết quả bao lâu — với hàng đợi thật (BullMQ trên Redis 8.2) và worker chạy riêng (10.1);</li>
  <li>viết hợp đồng sự kiện (event contract) mà đội khác tin được: mỏng hay dày, phiên bản, AsyncAPI, consumer chịu được giao trùng, và outbox để sự kiện không biến mất (10.2);</li>
  <li>chọn giữa polling, long polling, Server-Sent Events và WebSocket bằng số đo độ trễ và chi phí, và nối lại mà không mất gì (10.3);</li>
  <li>gửi webhook mà bên nhận kiểm được, thử lại lịch sự, và nhận webhook an toàn (10.4); rồi dựng lại báo cáo của Lab 8 thành việc nền có webhook ở Lab 10.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> backend thật nào cũng có việc không vừa một request — xuất file, gửi email, thanh toán, gọi AI. Cách bạn mở việc đó ra ngoài (một job, một sự kiện, một luồng, một webhook) là một phần hợp đồng API, và lỗi nó gây ra — việc mất, email gửi hai lần, vòng xoay mãi không dừng — là những lỗi người dùng thấy đầu tiên.</p>
</div>

<h3>Một nút bấm mất hai phút</h3>
<p>Cô Lan cần file CSV mọi lượt đặt của cả trường trong học kỳ, kèm điểm danh, để nộp báo cáo khoa. Dữ liệu là bảng 1.000.000 dòng của Chương 3 trong PostgreSQL. Phần chậm không nằm ở SQL: cứ 500 dòng, LabFlow phải hỏi dịch vụ điểm danh của trường một lần, mất khoảng 250 ms (giả lập bằng <code>EXPORT_BATCH_MS</code> để bạn chạy lại được). Bản đầu tiên cứ thế ngồi chờ:</p>
<pre><code class="language-javascript">exportsRouter.route('/bookings.csv')
  .get(validate('query', ExportQuery), async (req, res) =&gt; {
    const t0 = performance.now();
    res.on('close', () =&gt; { if (!res.writableFinished) console.log(&#96;[sync] client bỏ đi sau \${((performance.now() - t0) / 1000).toFixed(1)} s — server VẪN làm tiếp&#96;); });
    const csv = await exportBookings(req.valid.query);            // ngồi chờ: 2 phút cho cả trường một học kỳ
    console.log(&#96;[sync] xong sau \${((performance.now() - t0) / 1000).toFixed(1)} s, \${csv.length} byte&#96;);
    res.type('text/csv').send(csv);
  })
  .all(onlyAllow('GET', 'HEAD'));

exportsRouter.route('/')
  .post(idempotent(), validate('body', ExportQuery), async (req, res) =&gt; {
    const job = await createJob('bookings-export', req.valid.body, req.user.id);
    const base = &#96;/v\${req.apiVersion}/jobs&#96;;
    res.status(202)                                                // 202: đã NHẬN, chưa LÀM — RFC 9110 §15.3.3
      .location(&#96;\${base}/\${job.id}&#96;)                               // theo dõi ở đây
      .set('Retry-After', process.env.JOB_POLL_SEC ?? '2')
      .json(toJob(job, base));
  })
  .all(onlyAllow('POST'));</code></pre>
<p>Một phòng mất 2,3 s — chờ được. Cả trường thì khác. Giữa cô Lan và LabFlow thường có một proxy hoặc CDN; <code>perf/edge-proxy.mjs</code> đóng vai đó và bỏ cuộc sau 100 giây không thấy trả lời:</p>
<pre><code class="language-bash">curl -s -i \\
  -H 'Authorization: Bearer tok_lan' -w '⇒ %{http_code} after %{time_total} s\\n' 'http://localhost:8090/v2/exports/bookings.csv?from=2026-11-01&amp;to=2027-03-01'</code></pre>
<div class="out">HTTP/1.1 524 unknown
content-type: text/plain
Date: Sun, 01 Nov 2026 01:02:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

error code: 524 (A timeout occurred)
⇒ 524 after 100.012553 s</div>
<p>Cô Lan bấm lại — thêm một 524 ở giây 100. Đây là log của chính LabFlow trong mấy phút đó:</p>
<div class="out">[sync] client bỏ đi sau 100.0 s — server VẪN làm tiếp
[sync] xong sau 114.8 s, 11698254 byte
[sync] client bỏ đi sau 100.0 s — server VẪN làm tiếp
[sync] xong sau 114.4 s, 11698254 byte</div>
<p>Đọc chậm thôi — ba vấn đề trong bốn dòng. Client nhận lỗi ở giây 100. Server thì <em>không hề biết</em>: nó làm tiếp tới giây 114,8 và tạo ra file 11,7 MB không ai nhận. Người dùng bấm lại, toàn bộ 114 giây (và 428 lần gọi dịch vụ điểm danh) chạy thêm lần nữa. Tăng timeout chỉ dời vách đá đi chỗ khác: mặc định của Cloudflare là 125 s, <code>proxy_read_timeout</code> của nginx là 60 s, điện thoại trên Wi-Fi trường có khi rớt sớm hơn nhiều. <code>524</code> còn không phải mã HTTP chuẩn — Node in cụm lý do là <code>unknown</code>; đó là “a timeout occurred” của Cloudflare.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">đồng bộ</span><span class="lz-t">POST … chờ 114 s</span><span class="lz-d">client, proxy và server cùng giữ kết nối</span></div>
  <div class="lz-step"><span class="lz-k">bất đồng bộ 1</span><span class="lz-t">POST ⇒ 202 sau vài ms</span><span class="lz-d">Location: /v2/jobs/job_1 — “đã nhận đơn”</span></div>
  <div class="lz-step"><span class="lz-k">bất đồng bộ 2</span><span class="lz-t">worker làm việc</span><span class="lz-d">lấy từ hàng đợi, ở một tiến trình khác</span></div>
  <div class="lz-step"><span class="lz-k">bất đồng bộ 3</span><span class="lz-t">client hỏi, hoặc được báo</span><span class="lz-d">GET việc đó (polling), hoặc webhook (10.4)</span></div>
</div>
<a class="link-card" href="https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-524/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Cloudflare — Error 524 (đọc ngày 1/11/2026)</span><span class="lc-sub">524 = Cloudflare nối được tới server gốc nhưng không nhận được trả lời trong Proxy Read Timeout (mặc định 125 s). Chính họ khuyên: “Implement status polling of large HTTP processes” — đúng nội dung bài này.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>202 Accepted: “đã nhận, chưa làm xong”</h3>
<p>HTTP có sẵn mã cho tình huống này. RFC 9110 gọi <code>202 Accepted</code> là “cố ý không cam kết” (intentionally noncommittal): server đã nhận request để xử lý, xử lý chưa xong, và câu trả lời nên chỉ tới một <em>chỗ theo dõi trạng thái</em> (status monitor). Trong LabFlow chỗ đó là một tài nguyên mới, <strong>việc (job)</strong>:</p>
<pre><code class="language-bash">curl -s -i -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_1","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">HTTP/1.1 202 Accepted
Vary: Origin, Accept-Encoding
LabFlow-Version: 2
Location: /v2/jobs/job_1
Retry-After: 2
Content-Type: application/json; charset=utf-8
Content-Length: 378
ETag: W/"17a-59YB+fFzR2jOQLKAY9OcT70AFPE"
Server-Timing: validate;dur=1.32, total;dur=17.06
Date: Sun, 01 Nov 2026 01:27:42 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "job_1",
  "kind": "bookings-export",
  "status": "running",
  "progress": {
    "done": 0,
    "total": null,
    "percent": 0
  },
  "createdAt": "2026-11-01T01:27:42.007Z",
  "startedAt": null,
  "finishedAt": null,
  "cancelRequested": false,
  "result": null,
  "error": null,
  "links": {
    "self": "/v2/jobs/job_1",
    "cancel": "/v2/jobs/job_1/cancel"
  }
}</div>
<p>Ba header mang cả hợp đồng. <code>202</code> nói “đừng coi là xong”. <code>Location</code> nói xem ở đâu. <code>Retry-After: 2</code> nói bao lâu nữa hãy xem lại — để client không hỏi dồn mỗi 50 ms. <code>POST</code> tốn 17,1 ms trên server thay vì hai phút, và không gì có thể hết giờ vì không ai phải chờ.</p>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110#name-202-accepted" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9110 §15.3.3 — 202 Accepted (đọc ngày 1/11/2026)</span><span class="lc-sub">Đã nhận để xử lý, chưa hoàn tất; HTTP không có cách gửi lại mã trạng thái sau, nên câu trả lời nên mô tả trạng thái hiện tại và trỏ tới chỗ theo dõi kèm ước lượng khi nào xong.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Tài nguyên công việc: client được phép tin vào gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">queued → running</span><span class="lz-lnote">progress { done, total, percent } — total là null cho tới khi worker đếm xong</span></div>
  <div class="lz-layer"><span class="lz-lname">running → succeeded</span><span class="lz-lnote">result { href, contentType, bytes, expiresAt } — file nằm ở URL riêng của nó</span></div>
  <div class="lz-layer"><span class="lz-lname">running → failed</span><span class="lz-lnote">error { code, detail } — sau khi worker đã thử lại hết số lần</span></div>
  <div class="lz-layer"><span class="lz-lname">queued | running → cancelled</span><span class="lz-lnote">POST /jobs/{id}/cancel; việc đã xong thì không huỷ được (409)</span></div>
</div>
<p>Luật xung quanh là những luật bạn đã biết từ Chương 2–6: việc của người khác là <code>404</code> (BOLA, 6.2 — thử bằng <code>tok_an</code>); hỏi kết quả quá sớm là <code>409</code> kèm <code>Retry-After</code>; trạng thái mang <code>Cache-Control: no-store</code> vì nó đổi mỗi giây.</p>
<pre><code class="language-bash">curl -s -i http://localhost:4000/v2/jobs/job_1/result -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Vary: Origin, Accept-Language, Accept-Encoding
LabFlow-Version: 2
Retry-After: 2
Content-Language: vi
Content-Type: application/problem+json; charset=utf-8
Content-Length: 276
ETag: W/"114-1TiIsXl+lF9HBOxZgQzC8z/478I"
Server-Timing: total;dur=1.69
Date: Sun, 01 Nov 2026 01:27:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/job-not-finished",
  "title": "Việc chưa xong",
  "status": 409,
  "detail": "Việc job_1 đang running; hỏi lại GET /jobs/job_1 sau Retry-After giây",
  "instance": "/v2/jobs/job_1/result",
  "code": "JOB_NOT_FINISHED"
}</div>
<p>Client làm đúng hợp đồng thì rất ngắn — POST, rồi GET <code>Location</code> sau mỗi <code>Retry-After</code> giây cho tới trạng thái cuối, rồi tải về:</p>
<pre><code class="language-bash">node perf/poll-job.mjs '{"labId":"lab_2","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">  0.03 s  POST /v2/exports ⇒ 202, Location: /v2/jobs/job_2, Retry-After: 2
  0.04 s  GET /v2/jobs/job_2 ⇒ running     0%  (0/20000)
  2.04 s  GET /v2/jobs/job_2 ⇒ running    17%  (3500/20000)
  4.05 s  GET /v2/jobs/job_2 ⇒ running    37%  (7500/20000)
  6.05 s  GET /v2/jobs/job_2 ⇒ running    57%  (11500/20000)
  8.06 s  GET /v2/jobs/job_2 ⇒ running    77%  (15500/20000)
 10.06 s  GET /v2/jobs/job_2 ⇒ running    97%  (19500/20000)
 12.06 s  GET /v2/jobs/job_2 ⇒ succeeded 100%  (20000/20000)
 12.08 s  GET /v2/jobs/job_2/result ⇒ 200 text/csv; charset=utf-8, 20000 dòng, hết hạn 2026-11-01T02:27:56.288Z
⇒ 7 lần hỏi trạng thái; việc chạy 10.2 s</div>
<p>Bảy lần hỏi trạng thái cho một việc 10 giây. Đó là cái giá của polling, và bài 10.3 đo nó so với các cách khác; với việc chỉ kết thúc một lần, webhook (10.4) thường còn rẻ hơn.</p>

<h3>Huỷ, thời hạn giữ và cú bấm thứ hai</h3>
<p>Ba câu hỏi hợp đồng mà API bất đồng bộ nào cũng phải trả lời bằng văn bản, đo thật:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"from":"2026-11-01","to":"2027-03-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_2</div>
<pre><code class="language-bash">sleep 3; curl -s -X POST http://localhost:4000/v2/jobs/job_2/cancel -H 'Authorization: Bearer tok_lan' | jq -c '{status, cancelRequested, progress}'</code></pre>
<div class="out">{"status":"running","cancelRequested":true,"progress":{"done":5500,"total":213749,"percent":2}}</div>
<pre><code class="language-bash">sleep 1; curl -s http://localhost:4000/v2/jobs/job_2 -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress, finishedAt, links}'</code></pre>
<div class="out">{"status":"cancelled","progress":{"done":6000,"total":213749,"percent":2},"finishedAt":"2026-11-01T01:05:20.277Z","links":{"self":"/v2/jobs/job_2"}}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/jobs/job_2/cancel \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":409,"code":"JOB_FINISHED","detail":"Việc job_2 đã cancelled, không huỷ được nữa"}</div>
<p>Huỷ là một <em>yêu cầu</em>, nên trả <code>202</code> kèm <code>cancelRequested: true</code>; worker dừng ở lô kế tiếp (ở đây sau 261 ms, tại dòng 6.000 trên 213.749), và huỷ lần hai là <code>409 JOB_FINISHED</code>. Kết quả không giữ mãi — mỗi cú bấm một CSV 11,7 MB thì Redis đầy — nên việc ghi rõ <code>expiresAt</code>, sau đó kết quả thành <code>410 Gone</code> (ở đây 20 giây để bạn kịp thấy; LabFlow giữ kết quả 1 giờ, bản ghi việc 7 ngày):</p>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/jobs/job_1 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, result}'</code></pre>
<div class="out">{"status":"succeeded","result":{"href":"/v2/jobs/job_1/result","contentType":"text/csv; charset=utf-8","bytes":230490,"expiresAt":"2026-11-01T01:05:39.249Z"}}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %{size_download} bytes\\n' http://localhost:4000/v2/jobs/job_1/result \\
  -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">200 230490 bytes</div>
<pre><code class="language-bash">sleep 20; curl -s http://localhost:4000/v2/jobs/job_1/result -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/result-expired",
  "title": "Kết quả đã hết hạn",
  "status": 410,
  "detail": "Kết quả của việc job_1 chỉ giữ 20 giây sau khi xong; hãy tạo việc mới",
  "instance": "/v2/jobs/job_1/result",
  "code": "RESULT_EXPIRED"
}</div>
<p>Còn cú bấm thứ hai? <code>Idempotency-Key</code> của Chương 5 chạy nguyên vẹn với <code>202</code>: cùng khoá, cùng body ⇒ cùng một việc, không phải thêm một lần xuất hai phút.</p>
<pre><code class="language-bash">for i in 1 2; do curl -s -D - -o /dev/null -X POST http://localhost:4000/v2/exports -H 'Authorization: Bearer tok_lan' -H 'Idempotency-Key: exp-2026-11-lab3' --json '{"labId":"lab_3","from":"2026-11-01","to":"2027-03-01"}' | grep -iE '^(HTTP|location|idempotent)' | tr -d '\\r'; done</code></pre>
<div class="out">HTTP/1.1 202 Accepted
Location: /v2/jobs/job_1
HTTP/1.1 202 Accepted
Idempotent-Replayed: true
Location: /v2/jobs/job_1</div>

<h3>Còn một câu hỏi: việc chạy ở đâu?</h3>
<p>Mọi thứ ở trên chạy được với bộ chạy việc ngay trong tiến trình API (<code>LABFLOW_JOBS=memory</code>) — cho tới khi tiến trình khởi động lại. Bài 10.2 khởi động lại nó, cố ý giết worker, và chuyển việc vào một hàng đợi thật.</p>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Một endpoint mất hai phút. Bạn làm gì?”</strong> 202 + Location tới tài nguyên công việc có trạng thái, tiến độ, huỷ và hạn giữ; hàng đợi bền và worker; client hỏi lại theo Retry-After hoặc nhận webhook. Nhắc tới timeout của proxy và cú bấm thứ hai.</li>
  <li><strong>“Sao không tăng timeout?”</strong> Chặng nào cũng có timeout (CDN 125 s, nginx 60 s, mạng di động ít hơn); server vẫn làm khi client đã đi; thử lại thì công việc nhân đôi.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>perf/edge-proxy.mjs</code> với <code>EDGE_TIMEOUT_MS=60000</code> (mặc định của nginx) và xuất một phòng cho cả khoảng thời gian. Có sống sót không? Việc xuất làm được bao nhiêu dòng mỗi giây?</li>
  <li>Viết phía client của hợp đồng: gặp <code>409</code> thì chờ <code>Retry-After</code>, gặp <code>410</code> thì tạo việc mới với <code>Idempotency-Key</code> mới, gặp <code>failed</code> thì hiện <code>error.detail</code>.</li>
  <li>Thêm <code>estimatedSecondsLeft</code> vào việc (từ số dòng/giây đã đạt) và dùng nó làm <code>Retry-After</code>, tối đa 10.</li>
</ol>
<p><strong>Đạt khi:</strong> client hỏi trạng thái ít lần hơn trước cho cùng một việc xuất, và qua được kết quả đã hết hạn mà không bắt người dùng bấm lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">202 Accepted (đã nhận)</span><span class="v">Đã nhận và chấp nhận xử lý, chưa xong.</span></div>
  <div class="kv"><span class="k">Job resource (tài nguyên công việc)</span><span class="v">Một URL mô tả một việc nền: trạng thái, tiến độ, kết quả.</span></div>
  <div class="kv"><span class="k">Polling (hỏi lại định kỳ)</span><span class="v">Client hỏi lại sau mỗi khoảng; Retry-After đặt nhịp.</span></div>
  <div class="kv"><span class="k">Status monitor (chỗ theo dõi trạng thái)</span><span class="v">Thứ RFC 9110 muốn câu trả lời 202 trỏ tới: nơi client theo dõi công việc.</span></div>
  <div class="kv"><span class="k">Retention (thời hạn giữ)</span><span class="v">Kết quả và bản ghi giữ bao lâu — sau đó 410 Gone.</span></div>
  <div class="kv"><span class="k">Proxy read timeout (thời gian chờ của proxy)</span><span class="v">Proxy chờ server gốc bao lâu trước khi bỏ cuộc (524 của Cloudflare).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Việc xuất 114 s sau proxy 100 s: client nhận 524, server vẫn làm tiếp, bấm lần hai là công việc nhân đôi.</li>
  <li><code>202</code> + <code>Location</code> + <code>Retry-After</code> trả lời trong 17 ms; tài nguyên công việc mang trạng thái, tiến độ, kết quả, lỗi và link.</li>
  <li>Việc của người khác 404; kết quả quá sớm 409, quá muộn 410; huỷ là 202 và có hiệu lực ở lô kế tiếp (261 ms).</li>
  <li>Cùng Idempotency-Key biến cú bấm thứ hai thành cùng một việc — không thêm một lần xuất hai phút.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 10.2 (bài MỚI) ─────────────────────────── */
    {
      title: '10.2 — Queues and workers: where an asynchronous job really runs|||10.2 — Hàng đợi và worker: việc bất đồng bộ thật sự chạy ở đâu',
      slug: 'api-10-1-worker',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Việc trong RAM mất khi khởi động lại (404); BullMQ trên Redis 8.2 và worker riêng: xem việc trong Redis, thử lại lùi 2 → 4 s rồi failed, API chết việc vẫn chạy, worker bị giết khôi phục sau ~34 s, SIGTERM làm xong mới thoát, 3 worker: 6 việc 30,9 → 10,4 s.',
      content: `${G102}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Queues and workers: where an asynchronous job really runs</h2>
<p class="lead">A <code>202</code> is a promise: “I have your order and I will finish it”. Lesson 10.1 designed what the client sees. This lesson makes the promise true when things break — the API restarts, the attendance service is down, a worker is killed in the middle, a deploy happens during a two-minute export. After it you can run background work in a real queue (BullMQ on Redis 8.2) and state, with numbers, what happens in each failure.</p>

<h3>A promise that dies with the process</h3>
<p>The simplest job runner is a <code>Map</code> plus a loop inside the API process (<code>LABFLOW_JOBS=memory</code>). It passes every test in 10.1. Then somebody deploys:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_4","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_1</div>
<pre><code class="language-bash">sleep 2; curl -s http://localhost:4000/v2/jobs/job_1 -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress}'</code></pre>
<div class="out">{"status":"running","progress":{"done":3500,"total":20000,"percent":17}}</div>
<pre><code class="language-bash">bash srv.sh labflow-ch10 4000 LABFLOW_JOBS=memory</code></pre>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/jobs/job_1 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":404,"code":"JOB_NOT_FOUND"}</div>
<p>The job and its work are gone, and the client that holds <code>/v2/jobs/job_1</code> gets 404 for a job the server promised. Think of a restaurant: an order written only in the waiter's head is lost when the waiter goes home. Real kitchens put the ticket on a rail that does not belong to any one person. That rail is a <strong>queue</strong>; the cooks who take tickets from it are <strong>workers</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">API</span><span class="lz-t">queue.add(job)</span><span class="lz-d">writes the ticket into Redis, answers 202</span></div>
  <div class="lz-step"><span class="lz-k">Redis</span><span class="lz-t">the rail</span><span class="lz-d">waiting → active → completed / failed, outside every process</span></div>
  <div class="lz-step"><span class="lz-k">worker</span><span class="lz-t">takes a ticket + lock</span><span class="lz-d">runs it, reports progress, stores the result</span></div>
  <div class="lz-step"><span class="lz-k">API</span><span class="lz-t">GET /jobs/{id}</span><span class="lz-d">reads the ticket's state back from Redis</span></div>
</div>

<h3>The queue, in code and in Redis</h3>
<p>With <code>LABFLOW_JOBS=bullmq</code> the API only adds jobs; <code>node src/worker.js</code> — a different process — runs them:</p>
<pre><code class="language-javascript">export async function createJob(kind, data, owner) {
  if (MODE === 'bullmq') {
    const id = &#96;job_\${await redis.incr('labflow:job-seq')}&#96;;
    const job = await queue.add(kind, { ...data, owner }, {
      jobId: id,
      attempts: 3, backoff: { type: 'exponential', delay: 2000 },           // worker chết giữa chừng ⇒ việc được chạy lại
      removeOnComplete: { age: JOB_TTL_SEC }, removeOnFail: { age: JOB_TTL_SEC },
    });
    return fromBull(job);
  }
  const j = { id: &#96;job_\${++n}&#96;, kind, data, owner, status: 'queued', createdAt: Date.now() };
  mem.set(j.id, j);
  setImmediate(pump);
  return j;
}</code></pre>
<pre><code class="language-javascript">const worker = new Worker(QUEUE, async (job, token, signal) =&gt; {
  log(&#96;\${job.id} bắt đầu (lần \${job.attemptsMade + 1}\${job.stalledCounter ? &#96;, đã bị bỏ dở \${job.stalledCounter} lần&#96; : ''})&#96;);
  if (await redis.exists(&#96;labflow:cancel:\${job.id}&#96;)) throw new UnrecoverableError('CANCELLED');   // huỷ khi còn trong hàng đợi
  const task = TASKS[job.name];
  let body;
  try {
    body = await task.run(job.data, { signal, progress: (done, total) =&gt; job.updateProgress({ done, total }) });
  } catch (e) {
    if (e.message === 'CANCELLED') throw new UnrecoverableError('CANCELLED');   // huỷ thì KHÔNG thử lại
    throw e;                                                                      // lỗi khác ⇒ BullMQ thử lại (attempts: 3)
  }
  // Kết quả lớn nằm ở chỗ riêng, có hạn; bản ghi việc chỉ giữ mô tả của nó
  await redis.set(&#96;labflow:result:\${job.id}&#96;, body, { expiration: { type: 'EX', value: RESULT_TTL_SEC } });
  await redis.set(&#96;labflow:result:\${job.id}:type&#96;, task.type, { expiration: { type: 'EX', value: RESULT_TTL_SEC } });
  const expiresAt = new Date(Date.now() + RESULT_TTL_SEC * 1000).toISOString();
  log(&#96;\${job.id} xong: \${Buffer.byteLength(body)} byte&#96;);
  return { contentType: task.type, bytes: Buffer.byteLength(body), expiresAt };
}, {
  connection,
  concurrency: Number(process.env.WORKER_CONCURRENCY ?? 2),
  lockDuration: Number(process.env.WORKER_LOCK_MS ?? 15000),      // không gia hạn khoá trong 15 s ⇒ coi như worker đã chết
  stalledInterval: Number(process.env.WORKER_LOCK_MS ?? 15000),
});</code></pre>
<p>Nothing here is magic. A job is a Redis hash; the states are Redis lists and sorted sets. After the run in the next section:</p>
<pre><code class="language-bash">redis-cli -p 6390 --scan --pattern 'bull:labflow-jobs:*' | sort</code></pre>
<div class="out">bull:labflow-jobs:events
bull:labflow-jobs:failed
bull:labflow-jobs:id
bull:labflow-jobs:job_1
bull:labflow-jobs:meta
bull:labflow-jobs:stalled-check</div>
<pre><code class="language-bash">redis-cli -p 6390 HGET bull:labflow-jobs:job_1 atm</code></pre>
<div class="out">3</div>
<p><code>atm</code> is “attempts made”. This is how you debug a stuck job with <code>redis-cli</code> — and why a queue's Redis must never evict keys (a cache Redis with <code>allkeys-lru</code> may silently drop jobs).</p>
<a class="link-card" href="https://docs.bullmq.io/guide/workers/stalled-jobs" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: BullMQ docs — Stalled jobs (read 1 Nov 2026)</span><span class="lc-sub">A worker holds a lock on its job and must keep renewing it; a job whose lock expires is stalled and goes back to waiting — or to failed after too many stalls. LabFlow uses bullmq 6.3.16 on Redis 8.2.2.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>When the work itself fails: retries with backoff</h3>
<p>The attendance service goes down (<code>ATTENDANCE_DOWN=1</code> on the worker). Each job was added with <code>attempts: 3</code> and exponential backoff from 2 s:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_6","from":"2026-11-01","to":"2027-03-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_1</div>
<pre><code class="language-bash">sleep 8; curl -s http://localhost:4000/v2/jobs/job_1 -H 'Authorization: Bearer tok_lan' | jq -c '{status, error, finishedAt}'</code></pre>
<div class="out">{"status":"failed","error":{"code":"JOB_FAILED","detail":"ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời"},"finishedAt":"2026-11-01T01:34:48.131Z"}</div>
<pre><code class="language-bash">grep job_1 worker-w1.log</code></pre>
<div class="out">01:34:41.227 [w1] job_1 bắt đầu (lần 1)
01:34:41.491 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời (đã thử 1)
01:34:43.527 [w1] job_1 bắt đầu (lần 2)
01:34:43.783 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời (đã thử 2)
01:34:47.877 [w1] job_1 bắt đầu (lần 3)
01:34:48.132 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời (đã thử 3)</div>
<p>Look at the gaps: attempt 2 started 2.0 s after the first failure, attempt 3 started 4.1 s after the second — exponential backoff, so a service that is restarting is not hammered. Only after the third failure does the client see <code>failed</code>, with the reason in <code>error.detail</code>. Two contract decisions are hiding here: <em>how long</em> a client may see <code>running</code> while retries happen (here ~7 s; in production you would wait minutes), and <em>what</em> a retry repeats — every attempt called the attendance service again, so the task must be safe to run twice (Lesson 10.3 measures what happens when it is not).</p>

<h3>When a process dies</h3>
<p>Kill the API with <code>kill -9</code> in the middle of an export and restart it three seconds later: the job is still <code>running</code> at 60% — the worker never noticed. Now kill the <em>worker</em> instead:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_5","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_1</div>
<pre><code class="language-bash">sleep 4; pkill -9 -f 'src/worker.js'; echo "worker w1 chết (kill -9)"</code></pre>
<div class="out">worker w1 chết (kill -9)</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/jobs/job_1 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress}'</code></pre>
<div class="out">{"status":"running","progress":{"done":7500,"total":20000,"percent":37}}</div>
<pre><code class="language-bash">bash w.sh w2 WORKER_WEBHOOKS=0; sleep 20; curl -s http://localhost:4000/v2/jobs/job_1 -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress}'</code></pre>
<div class="out">{"status":"running","progress":{"done":7500,"total":20000,"percent":37}}</div>
<pre><code class="language-bash">sleep 25; curl -s http://localhost:4000/v2/jobs/job_1 -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress, startedAt, finishedAt}'</code></pre>
<div class="out">{"status":"succeeded","progress":{"done":20000,"total":20000,"percent":100},"startedAt":"2026-11-01T01:07:38.585Z","finishedAt":"2026-11-01T01:07:48.804Z"}</div>
<pre><code class="language-bash">cat worker-w1.log worker-w2.log</code></pre>
<div class="out">01:07:03.507 [w1] sẵn sàng, hàng đợi labflow-jobs, concurrency 2
01:07:04.272 [w1] job_1 bắt đầu (lần 1)
01:07:08.573 [w2] sẵn sàng, hàng đợi labflow-jobs, concurrency 2
01:07:38.587 [w2] job_1 bắt đầu (lần 1, đã bị bỏ dở 1 lần)
01:07:48.804 [w2] job_1 xong: 1086381 byte</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0 s</span><span class="lz-t">w1 takes job_1</span><span class="lz-d">holds a lock, renews it while alive</span></div>
  <div class="lz-step"><span class="lz-k">4 s</span><span class="lz-t">kill -9 w1</span><span class="lz-d">nobody renews the lock; progress frozen at 37%</span></div>
  <div class="lz-step"><span class="lz-k">≈34 s</span><span class="lz-t">w2's stalled check</span><span class="lz-d">lock expired ⇒ job back to waiting ⇒ w2 starts it</span></div>
  <div class="lz-step"><span class="lz-k">≈45 s</span><span class="lz-t">succeeded</span><span class="lz-d">from 0%, not from 37%</span></div>
</div>
<p>Recovery took about 34 s: the lock had to expire (<code>lockDuration</code> 15 s here) and the next stalled check had to run. The log says “đã bị bỏ dở 1 lần” (stalled once) and still “lần 1”: a stall is not counted as a failed attempt. And the job restarted from zero because the worker kept no checkpoint — for a two-minute export, saving “last row done” with the job (<code>job.updateData</code>) turns a restart into a resume.</p>
<div class="pitfall"><p><strong>Trap — a busy worker looks dead.</strong> The lock is renewed by a timer on the worker's event loop. A task that blocks the loop with heavy synchronous work (Chapter 8's <code>scryptSync</code>) cannot renew it, so a healthy worker gets its job taken away and the job runs twice. Keep tasks asynchronous, or run CPU work in worker threads.</p></div>

<h3>Deploying without killing jobs</h3>
<p><code>kill -9</code> is a crash. A deploy sends <code>SIGTERM</code> first — and the worker can use it to stop taking new jobs but finish the ones it holds (<code>worker.close()</code>):</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_7","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_1</div>
<pre><code class="language-bash">sleep 3; redis-cli -p 6390 LRANGE bull:labflow-jobs:active 0 -1</code></pre>
<div class="out">job_1</div>
<pre><code class="language-bash">pkill -TERM -f 'src/worker.js'; sleep 9; cat worker-w1.log</code></pre>
<div class="out">01:34:51.430 [w1] sẵn sàng, hàng đợi labflow-jobs, concurrency 2
01:34:52.238 [w1] job_1 bắt đầu (lần 1)
01:34:55.280 [w1] đóng êm: làm nốt việc đang dở
01:35:02.401 [w1] job_1 xong: 1086381 byte</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/jobs/job_1 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress, startedAt, finishedAt}'</code></pre>
<div class="out">{"status":"succeeded","progress":{"done":20000,"total":20000,"percent":100},"startedAt":"2026-11-01T01:34:52.237Z","finishedAt":"2026-11-01T01:35:02.401Z"}</div>
<p>SIGTERM at second 3; the job finished at second 10 and only then did the process exit — no stall, no 30-second gap, no redone work. Your process manager must allow this: Docker gives 10 s by default before <code>SIGKILL</code>, so a worker with two-minute jobs needs a longer stop timeout (or checkpoints).</p>

<h3>More workers, same API</h3>
<pre><code class="language-bash">node perf/many-jobs.mjs 6</code></pre>
<div class="out">6 việc nhận 202 trong 63 ms
job_1: chờ trong hàng   0.0 s · xong ở giây  10.2
job_2: chờ trong hàng   0.0 s · xong ở giây  10.2
job_3: chờ trong hàng  10.2 s · xong ở giây  20.4
job_4: chờ trong hàng  10.2 s · xong ở giây  20.4
job_5: chờ trong hàng  20.4 s · xong ở giây  30.6
job_6: chờ trong hàng  20.4 s · xong ở giây  30.6
⇒ 6 việc xong sau 30.9 s</div>
<pre><code class="language-bash">bash w.sh w2 WORKER_WEBHOOKS=0; bash w.sh w3 WORKER_WEBHOOKS=0; cd labflow-ch10 &amp;&amp; node perf/many-jobs.mjs 6</code></pre>
<div class="out">6 việc nhận 202 trong 52 ms
job_7: chờ trong hàng   0.0 s · xong ở giây  10.2
job_8: chờ trong hàng   0.0 s · xong ở giây  10.3
job_9: chờ trong hàng   0.0 s · xong ở giây  10.3
job_10: chờ trong hàng   0.0 s · xong ở giây  10.3
job_11: chờ trong hàng   0.0 s · xong ở giây  10.3
job_12: chờ trong hàng   0.1 s · xong ở giây  10.2
⇒ 6 việc xong sau 10.4 s</div>
<p>Six exports took 30.9 s with one worker (two at a time) and 10.4 s with three. Every <code>POST</code> was answered within about 60 ms either way: the API's latency no longer depends on how much work is waiting.</p>
<a class="link-card" href="/courses/nodejs/learn?lessonSlug=nodejs-13-5-worker-chet-va-van-hanh" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Node.js course, lesson 13.5 — when the worker dies</span><span class="lc-sub">The queue side in depth: stalled jobs, shutting down during deploys, cleaning old jobs. Lesson 13.3 covers retries and the charge that ran three times. This lesson stays at the API contract.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Where do you run background jobs?”</strong> Not in the API's memory: a restart loses them (measured: 404). In a durable queue outside the process, with workers that can die and be replaced.</li>
  <li><strong>“A worker crashes in the middle of a job. What happens?”</strong> Its lock expires, the job is stalled and handed to another worker (~34 s here), and it runs again — so tasks must be idempotent or checkpointed.</li>
  <li><strong>“How do you deploy workers?”</strong> SIGTERM ⇒ stop taking jobs, finish current ones, then exit; a stop timeout longer than your longest job.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Make the export resumable: store <code>after</code> with <code>job.updateData()</code> after each batch and start from it on a retry. Kill the worker at 50% and measure the recovery again.</li>
  <li>Set <code>WORKER_LOCK_MS=5000</code> and repeat the kill test. How long is the recovery now? What could go wrong with a very short lock?</li>
  <li>Change the backoff to 1 s and attempts to 5 and repeat <code>ATTENDANCE_DOWN=1</code>. Write the times of every attempt from the worker log.</li>
</ol>
<p><strong>Done when:</strong> a worker killed at 50% finishes the job from about 50%, and you can explain each timestamp in the worker log.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Queue</span><span class="v">Durable list of jobs stored outside the API process.</span></div>
  <div class="kv"><span class="k">Worker</span><span class="v">A separate process that takes jobs from the queue and runs them.</span></div>
  <div class="kv"><span class="k">Lock</span><span class="v">A worker's claim on a job, renewed while it is alive.</span></div>
  <div class="kv"><span class="k">Stalled job</span><span class="v">A job whose lock expired; it goes back to waiting.</span></div>
  <div class="kv"><span class="k">Exponential backoff</span><span class="v">Wait 2 s, 4 s, 8 s… between attempts.</span></div>
  <div class="kv"><span class="k">Graceful shutdown</span><span class="v">On SIGTERM stop taking work, finish current work, then exit.</span></div>
  <div class="kv"><span class="k">Checkpoint</span><span class="v">Saved progress that lets a retry resume instead of restart.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Jobs in the API's memory vanished on restart (404); a BullMQ queue on Redis kept them.</li>
  <li>A job is a Redis hash; states are lists — readable with redis-cli when something is stuck.</li>
  <li>A failing dependency: 3 attempts, backoff 2 s → 4 s, then <code>failed</code> with the reason.</li>
  <li>API killed: the job kept running. Worker killed: recovered in ~34 s, from 0%. SIGTERM: the job finished first.</li>
  <li>Three workers instead of one: six exports 30.9 s → 10.4 s; POST stayed at ~60 ms.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Hàng đợi và worker: việc bất đồng bộ thật sự chạy ở đâu</h2>
<p class="lead">Một câu trả lời <code>202</code> là một lời hứa: “tôi đã nhận đơn và sẽ làm xong”. Bài 10.1 thiết kế phần client nhìn thấy. Bài này làm cho lời hứa đúng cả khi mọi thứ hỏng — API khởi động lại, dịch vụ điểm danh sập, worker bị giết giữa chừng, deploy đúng lúc đang xuất file hai phút. Học xong bạn chạy được việc nền trong một hàng đợi thật (BullMQ trên Redis 8.2) và nói được, bằng số đo, chuyện gì xảy ra trong từng kiểu hỏng.</p>

<h3>Lời hứa chết cùng tiến trình</h3>
<p>Bộ chạy việc đơn giản nhất là một <code>Map</code> cộng một vòng lặp ngay trong tiến trình API (<code>LABFLOW_JOBS=memory</code>). Nó qua mọi phép thử ở bài 10.1. Rồi có người deploy:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_4","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_1</div>
<pre><code class="language-bash">sleep 2; curl -s http://localhost:4000/v2/jobs/job_1 -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress}'</code></pre>
<div class="out">{"status":"running","progress":{"done":3500,"total":20000,"percent":17}}</div>
<pre><code class="language-bash">bash srv.sh labflow-ch10 4000 LABFLOW_JOBS=memory</code></pre>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/jobs/job_1 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":404,"code":"JOB_NOT_FOUND"}</div>
<p>Việc và công sức đều mất, và client đang giữ <code>/v2/jobs/job_1</code> nhận 404 cho một việc server đã hứa. Nghĩ tới nhà hàng: món gọi chỉ được nhớ trong đầu anh phục vụ thì mất khi anh ấy về nhà. Bếp thật ghim phiếu lên một thanh treo không thuộc về riêng ai. Thanh treo đó là <strong>hàng đợi (queue)</strong>; đầu bếp lấy phiếu xuống làm là <strong>worker</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">API</span><span class="lz-t">queue.add(job)</span><span class="lz-d">ghi phiếu vào Redis, trả 202</span></div>
  <div class="lz-step"><span class="lz-k">Redis</span><span class="lz-t">thanh treo phiếu</span><span class="lz-d">waiting → active → completed / failed, nằm ngoài mọi tiến trình</span></div>
  <div class="lz-step"><span class="lz-k">worker</span><span class="lz-t">lấy phiếu + giữ khoá</span><span class="lz-d">làm, báo tiến độ, cất kết quả</span></div>
  <div class="lz-step"><span class="lz-k">API</span><span class="lz-t">GET /jobs/{id}</span><span class="lz-d">đọc lại trạng thái phiếu từ Redis</span></div>
</div>

<h3>Hàng đợi, trong code và trong Redis</h3>
<p>Với <code>LABFLOW_JOBS=bullmq</code>, API chỉ thêm việc; <code>node src/worker.js</code> — một tiến trình khác — mới chạy việc:</p>
<pre><code class="language-javascript">export async function createJob(kind, data, owner) {
  if (MODE === 'bullmq') {
    const id = &#96;job_\${await redis.incr('labflow:job-seq')}&#96;;
    const job = await queue.add(kind, { ...data, owner }, {
      jobId: id,
      attempts: 3, backoff: { type: 'exponential', delay: 2000 },           // worker chết giữa chừng ⇒ việc được chạy lại
      removeOnComplete: { age: JOB_TTL_SEC }, removeOnFail: { age: JOB_TTL_SEC },
    });
    return fromBull(job);
  }
  const j = { id: &#96;job_\${++n}&#96;, kind, data, owner, status: 'queued', createdAt: Date.now() };
  mem.set(j.id, j);
  setImmediate(pump);
  return j;
}</code></pre>
<pre><code class="language-javascript">const worker = new Worker(QUEUE, async (job, token, signal) =&gt; {
  log(&#96;\${job.id} bắt đầu (lần \${job.attemptsMade + 1}\${job.stalledCounter ? &#96;, đã bị bỏ dở \${job.stalledCounter} lần&#96; : ''})&#96;);
  if (await redis.exists(&#96;labflow:cancel:\${job.id}&#96;)) throw new UnrecoverableError('CANCELLED');   // huỷ khi còn trong hàng đợi
  const task = TASKS[job.name];
  let body;
  try {
    body = await task.run(job.data, { signal, progress: (done, total) =&gt; job.updateProgress({ done, total }) });
  } catch (e) {
    if (e.message === 'CANCELLED') throw new UnrecoverableError('CANCELLED');   // huỷ thì KHÔNG thử lại
    throw e;                                                                      // lỗi khác ⇒ BullMQ thử lại (attempts: 3)
  }
  // Kết quả lớn nằm ở chỗ riêng, có hạn; bản ghi việc chỉ giữ mô tả của nó
  await redis.set(&#96;labflow:result:\${job.id}&#96;, body, { expiration: { type: 'EX', value: RESULT_TTL_SEC } });
  await redis.set(&#96;labflow:result:\${job.id}:type&#96;, task.type, { expiration: { type: 'EX', value: RESULT_TTL_SEC } });
  const expiresAt = new Date(Date.now() + RESULT_TTL_SEC * 1000).toISOString();
  log(&#96;\${job.id} xong: \${Buffer.byteLength(body)} byte&#96;);
  return { contentType: task.type, bytes: Buffer.byteLength(body), expiresAt };
}, {
  connection,
  concurrency: Number(process.env.WORKER_CONCURRENCY ?? 2),
  lockDuration: Number(process.env.WORKER_LOCK_MS ?? 15000),      // không gia hạn khoá trong 15 s ⇒ coi như worker đã chết
  stalledInterval: Number(process.env.WORKER_LOCK_MS ?? 15000),
});</code></pre>
<p>Không có gì thần bí. Một việc là một hash trong Redis; các trạng thái là list và sorted set của Redis. Sau lần chạy ở mục kế tiếp:</p>
<pre><code class="language-bash">redis-cli -p 6390 --scan --pattern 'bull:labflow-jobs:*' | sort</code></pre>
<div class="out">bull:labflow-jobs:events
bull:labflow-jobs:failed
bull:labflow-jobs:id
bull:labflow-jobs:job_1
bull:labflow-jobs:meta
bull:labflow-jobs:stalled-check</div>
<pre><code class="language-bash">redis-cli -p 6390 HGET bull:labflow-jobs:job_1 atm</code></pre>
<div class="out">3</div>
<p><code>atm</code> là “attempts made” (số lần đã thử). Đây là cách bạn gỡ một việc bị kẹt bằng <code>redis-cli</code> — và là lý do Redis của hàng đợi không bao giờ được tự xoá khoá (một Redis làm cache với <code>allkeys-lru</code> có thể lặng lẽ vứt việc của bạn).</p>
<a class="link-card" href="https://docs.bullmq.io/guide/workers/stalled-jobs" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: tài liệu BullMQ — Stalled jobs (đọc ngày 1/11/2026)</span><span class="lc-sub">Worker giữ khoá trên việc của nó và phải gia hạn liên tục; việc bị hết hạn khoá là “stalled” và quay về hàng chờ — hoặc vào failed nếu bị bỏ dở quá nhiều lần. LabFlow dùng bullmq 6.3.16 trên Redis 8.2.2.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi chính công việc hỏng: thử lại với backoff</h3>
<p>Dịch vụ điểm danh sập (<code>ATTENDANCE_DOWN=1</code> đặt cho worker). Mỗi việc được thêm với <code>attempts: 3</code> và backoff luỹ thừa (exponential backoff) bắt đầu từ 2 s:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_6","from":"2026-11-01","to":"2027-03-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_1</div>
<pre><code class="language-bash">sleep 8; curl -s http://localhost:4000/v2/jobs/job_1 -H 'Authorization: Bearer tok_lan' | jq -c '{status, error, finishedAt}'</code></pre>
<div class="out">{"status":"failed","error":{"code":"JOB_FAILED","detail":"ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời"},"finishedAt":"2026-11-01T01:34:48.131Z"}</div>
<pre><code class="language-bash">grep job_1 worker-w1.log</code></pre>
<div class="out">01:34:41.227 [w1] job_1 bắt đầu (lần 1)
01:34:41.491 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời (đã thử 1)
01:34:43.527 [w1] job_1 bắt đầu (lần 2)
01:34:43.783 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời (đã thử 2)
01:34:47.877 [w1] job_1 bắt đầu (lần 3)
01:34:48.132 [w1] job_1 hỏng: ATTENDANCE_UNAVAILABLE: dịch vụ điểm danh không trả lời (đã thử 3)</div>
<p>Nhìn khoảng cách: lần 2 bắt đầu 2,0 s sau lần hỏng đầu, lần 3 bắt đầu 4,1 s sau lần hỏng thứ hai — lùi dần theo luỹ thừa, để một dịch vụ đang khởi động lại không bị dồn dập. Chỉ sau lần hỏng thứ ba client mới thấy <code>failed</code>, lý do nằm trong <code>error.detail</code>. Có hai quyết định hợp đồng nấp ở đây: client có thể thấy <code>running</code> <em>bao lâu</em> trong lúc đang thử lại (ở đây ~7 s; production thường chờ vài phút), và lần thử lại <em>lặp lại những gì</em> — lần nào cũng gọi lại dịch vụ điểm danh, nên công việc phải an toàn khi chạy hai lần (bài 10.3 đo chuyện gì xảy ra khi không an toàn).</p>

<h3>Khi một tiến trình chết</h3>
<p>Giết API bằng <code>kill -9</code> giữa lúc đang xuất rồi bật lại sau ba giây: việc vẫn <code>running</code> ở 60% — worker không hề biết. Giờ giết <em>worker</em>:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_5","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_1</div>
<pre><code class="language-bash">sleep 4; pkill -9 -f 'src/worker.js'; echo "worker w1 chết (kill -9)"</code></pre>
<div class="out">worker w1 chết (kill -9)</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/jobs/job_1 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress}'</code></pre>
<div class="out">{"status":"running","progress":{"done":7500,"total":20000,"percent":37}}</div>
<pre><code class="language-bash">bash w.sh w2 WORKER_WEBHOOKS=0; sleep 20; curl -s http://localhost:4000/v2/jobs/job_1 -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress}'</code></pre>
<div class="out">{"status":"running","progress":{"done":7500,"total":20000,"percent":37}}</div>
<pre><code class="language-bash">sleep 25; curl -s http://localhost:4000/v2/jobs/job_1 -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress, startedAt, finishedAt}'</code></pre>
<div class="out">{"status":"succeeded","progress":{"done":20000,"total":20000,"percent":100},"startedAt":"2026-11-01T01:07:38.585Z","finishedAt":"2026-11-01T01:07:48.804Z"}</div>
<pre><code class="language-bash">cat worker-w1.log worker-w2.log</code></pre>
<div class="out">01:07:03.507 [w1] sẵn sàng, hàng đợi labflow-jobs, concurrency 2
01:07:04.272 [w1] job_1 bắt đầu (lần 1)
01:07:08.573 [w2] sẵn sàng, hàng đợi labflow-jobs, concurrency 2
01:07:38.587 [w2] job_1 bắt đầu (lần 1, đã bị bỏ dở 1 lần)
01:07:48.804 [w2] job_1 xong: 1086381 byte</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0 s</span><span class="lz-t">w1 nhận job_1</span><span class="lz-d">giữ khoá, còn sống thì gia hạn</span></div>
  <div class="lz-step"><span class="lz-k">4 s</span><span class="lz-t">kill -9 w1</span><span class="lz-d">không ai gia hạn khoá; tiến độ đứng ở 37%</span></div>
  <div class="lz-step"><span class="lz-k">≈34 s</span><span class="lz-t">w2 kiểm việc bị bỏ dở</span><span class="lz-d">khoá hết hạn ⇒ việc về hàng chờ ⇒ w2 làm</span></div>
  <div class="lz-step"><span class="lz-k">≈45 s</span><span class="lz-t">succeeded</span><span class="lz-d">từ 0%, không phải từ 37%</span></div>
</div>
<p>Khôi phục mất khoảng 34 s: khoá phải hết hạn (<code>lockDuration</code> 15 s ở đây) và lượt kiểm việc bị bỏ dở (stalled check) kế tiếp phải chạy. Log ghi “đã bị bỏ dở 1 lần” mà vẫn “lần 1”: bị bỏ dở không tính là một lần thử hỏng. Và việc làm lại từ đầu vì worker không lưu mốc (checkpoint) — với việc xuất hai phút, lưu “dòng cuối đã xong” vào việc (<code>job.updateData</code>) biến làm lại thành làm tiếp.</p>
<div class="pitfall"><p><strong>Bẫy — worker bận trông như worker chết.</strong> Khoá được gia hạn bởi một bộ hẹn giờ trên event loop của worker. Công việc chặn event loop bằng tính toán đồng bộ nặng (<code>scryptSync</code> của Chương 8) thì không gia hạn được, nên một worker khoẻ mạnh bị lấy mất việc và việc chạy hai lần. Giữ công việc bất đồng bộ, hoặc đẩy phần tính toán sang worker thread.</p></div>

<h3>Deploy mà không giết việc</h3>
<p><code>kill -9</code> là sập. Deploy thì gửi <code>SIGTERM</code> trước — và worker dùng nó để thôi nhận việc mới nhưng làm nốt việc đang giữ (<code>worker.close()</code>):</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code} %header{location}\\n' -X POST http://localhost:4000/v2/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_7","from":"2026-11-01","to":"2028-06-01"}'</code></pre>
<div class="out">202 /v2/jobs/job_1</div>
<pre><code class="language-bash">sleep 3; redis-cli -p 6390 LRANGE bull:labflow-jobs:active 0 -1</code></pre>
<div class="out">job_1</div>
<pre><code class="language-bash">pkill -TERM -f 'src/worker.js'; sleep 9; cat worker-w1.log</code></pre>
<div class="out">01:34:51.430 [w1] sẵn sàng, hàng đợi labflow-jobs, concurrency 2
01:34:52.238 [w1] job_1 bắt đầu (lần 1)
01:34:55.280 [w1] đóng êm: làm nốt việc đang dở
01:35:02.401 [w1] job_1 xong: 1086381 byte</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/jobs/job_1 \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, progress, startedAt, finishedAt}'</code></pre>
<div class="out">{"status":"succeeded","progress":{"done":20000,"total":20000,"percent":100},"startedAt":"2026-11-01T01:34:52.237Z","finishedAt":"2026-11-01T01:35:02.401Z"}</div>
<p>SIGTERM ở giây thứ 3; việc xong ở giây thứ 10 rồi tiến trình mới thoát — không bị bỏ dở, không hụt 30 giây, không làm lại. Trình quản lý tiến trình phải cho phép điều đó: Docker mặc định chỉ chờ 10 s trước khi <code>SIGKILL</code>, nên worker có việc hai phút cần thời gian dừng dài hơn (hoặc có mốc).</p>

<h3>Thêm worker, giữ nguyên API</h3>
<pre><code class="language-bash">node perf/many-jobs.mjs 6</code></pre>
<div class="out">6 việc nhận 202 trong 63 ms
job_1: chờ trong hàng   0.0 s · xong ở giây  10.2
job_2: chờ trong hàng   0.0 s · xong ở giây  10.2
job_3: chờ trong hàng  10.2 s · xong ở giây  20.4
job_4: chờ trong hàng  10.2 s · xong ở giây  20.4
job_5: chờ trong hàng  20.4 s · xong ở giây  30.6
job_6: chờ trong hàng  20.4 s · xong ở giây  30.6
⇒ 6 việc xong sau 30.9 s</div>
<pre><code class="language-bash">bash w.sh w2 WORKER_WEBHOOKS=0; bash w.sh w3 WORKER_WEBHOOKS=0; cd labflow-ch10 &amp;&amp; node perf/many-jobs.mjs 6</code></pre>
<div class="out">6 việc nhận 202 trong 52 ms
job_7: chờ trong hàng   0.0 s · xong ở giây  10.2
job_8: chờ trong hàng   0.0 s · xong ở giây  10.3
job_9: chờ trong hàng   0.0 s · xong ở giây  10.3
job_10: chờ trong hàng   0.0 s · xong ở giây  10.3
job_11: chờ trong hàng   0.0 s · xong ở giây  10.3
job_12: chờ trong hàng   0.1 s · xong ở giây  10.2
⇒ 6 việc xong sau 10.4 s</div>
<p>Sáu việc xuất mất 30,9 s với một worker (hai việc một lúc) và 10,4 s với ba worker. Mọi <code>POST</code> được trả lời trong khoảng 60 ms ở cả hai lần: độ trễ của API không còn phụ thuộc vào lượng việc đang chờ.</p>
<a class="link-card" href="/courses/nodejs/learn?lessonSlug=nodejs-13-5-worker-chet-va-van-hanh" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá Node.js, bài 13.5 — khi worker chết</span><span class="lc-sub">Phía hàng đợi đi sâu: việc bị bỏ dở, tắt khi deploy, dọn việc cũ. Bài 13.3 nói về thử lại và khoản tiền bị trừ ba lần. Bài này đứng ở hợp đồng API.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Chạy việc nền ở đâu?”</strong> Không trong RAM của API: khởi động lại là mất (đo được: 404). Trong hàng đợi bền nằm ngoài tiến trình, với worker chết được và thay được.</li>
  <li><strong>“Worker sập giữa một việc. Chuyện gì xảy ra?”</strong> Khoá hết hạn, việc bị coi là bỏ dở và giao cho worker khác (~34 s ở đây), rồi chạy lại — nên công việc phải idempotent hoặc có mốc.</li>
  <li><strong>“Deploy worker thế nào?”</strong> SIGTERM ⇒ thôi nhận việc, làm nốt việc đang có, rồi thoát; thời gian dừng dài hơn việc dài nhất.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Cho việc xuất làm tiếp được: lưu <code>after</code> bằng <code>job.updateData()</code> sau mỗi lô và bắt đầu từ đó khi thử lại. Giết worker ở 50% rồi đo lại thời gian khôi phục.</li>
  <li>Đặt <code>WORKER_LOCK_MS=5000</code> rồi lặp lại phép giết worker. Khôi phục giờ mất bao lâu? Khoá quá ngắn thì có thể hỏng chuyện gì?</li>
  <li>Đổi backoff thành 1 s và attempts thành 5, lặp lại <code>ATTENDANCE_DOWN=1</code>. Ghi thời điểm từng lần thử từ log của worker.</li>
</ol>
<p><strong>Đạt khi:</strong> worker bị giết ở 50% thì việc xong từ khoảng 50%, và bạn giải thích được từng mốc giờ trong log của worker.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Queue (hàng đợi)</span><span class="v">Danh sách việc bền, lưu ngoài tiến trình API.</span></div>
  <div class="kv"><span class="k">Worker (tiến trình làm việc)</span><span class="v">Tiến trình riêng lấy việc từ hàng đợi ra chạy.</span></div>
  <div class="kv"><span class="k">Lock (khoá)</span><span class="v">Worker “giữ chỗ” trên một việc, còn sống thì gia hạn.</span></div>
  <div class="kv"><span class="k">Stalled job (việc bị bỏ dở)</span><span class="v">Việc có khoá hết hạn; nó quay về hàng chờ.</span></div>
  <div class="kv"><span class="k">Exponential backoff (lùi dần luỹ thừa)</span><span class="v">Chờ 2 s, 4 s, 8 s… giữa các lần thử.</span></div>
  <div class="kv"><span class="k">Graceful shutdown (tắt êm)</span><span class="v">Nhận SIGTERM thì thôi nhận việc, làm nốt, rồi thoát.</span></div>
  <div class="kv"><span class="k">Checkpoint (mốc)</span><span class="v">Tiến độ đã lưu, để lần thử lại làm tiếp thay vì làm lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Việc trong RAM của API biến mất khi khởi động lại (404); hàng đợi BullMQ trên Redis giữ được chúng.</li>
  <li>Một việc là một hash trong Redis; trạng thái là các list — đọc được bằng redis-cli khi có gì kẹt.</li>
  <li>Phụ thuộc hỏng: 3 lần thử, lùi 2 s → 4 s, rồi <code>failed</code> kèm lý do.</li>
  <li>Giết API: việc vẫn chạy. Giết worker: khôi phục sau ~34 s, từ 0%. SIGTERM: làm xong việc rồi mới thoát.</li>
  <li>Ba worker thay vì một: sáu việc xuất 30,9 s → 10,4 s; POST vẫn ~60 ms.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Event contracts: payload design, versioning and idempotent consumers|||10.3 — Hợp đồng sự kiện: thiết kế payload, phiên bản và consumer idempotent',
      slug: 'api-10-2-su-kien',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phong bì CloudEvents; sự kiện mỏng (200 lần gọi ngược, 100 email đọc trạng thái mới) so với dày; thêm trường làm vỡ consumer khắt khe; AsyncAPI 3.1; giao ít nhất một lần: 17 bản trùng, đánh dấu trước mất 21, cùng transaction đúng 1.000; ghi kép mất 342 sự kiện, transactional outbox 0.',
      content: `${G103}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Event contracts: payload design, versioning and idempotent consumers</h2>
<p class="lead">A request says “do this”; an event says “this happened”. Once LabFlow publishes “booking cancelled”, the notification service, the faculty dashboard and the department system can all react — without LabFlow knowing they exist. The price: an event is a contract with readers you cannot see. After this lesson you can design and version an event, describe it in AsyncAPI, and — measured — build consumers that survive duplicates and producers that lose nothing.</p>

<h3>One event, read by people you will never meet</h3>
<p>Every change to a booking now becomes an event (code in <code>src/routes/bookings.js</code> and <code>src/events.js</code>):</p>
<pre><code class="language-javascript">const bookingEvent = (b) =&gt; ({ id: b.id, labId: b.labId, period: { start: b.startAt, end: b.endAt }, status: b.status, version: b.version ?? 1 });
// ⚠ GHI KÉP (dual write, bài 10.3): lượt đặt đã lưu, rồi MỚI phát sự kiện — phát hỏng thì sự kiện mất.
// LabFlow giữ dữ liệu trong RAM tới Chương 12, nên outbox (10.3) chờ tới khi có PostgreSQL.
const emit = (type, b) =&gt; publish(&#96;labflow.booking.\${type}.v1&#96;, b.id, bookingEvent(b)).catch((e) =&gt; console.error('publish', e.message));</code></pre>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/events?after=1&amp;limit=1' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[0]'</code></pre>
<div class="out">{"id":"2","specversion":"1.0","type":"labflow.booking.cancelled.v1","source":"/labflow/v2","subject":"bk_1","time":"2026-11-01T01:53:02.699Z","datacontenttype":"application/json","data":{"id":"bk_1","labId":"lab_2","period":{"start":"2026-12-01T01:00:00.000Z","end":"2026-12-01T03:00:00.000Z"},"status":"CANCELLED","version":2}}</div>
<p>The envelope follows <strong>CloudEvents 1.0</strong> (a CNCF specification). Required: <code>id</code>, <code>source</code>, <code>specversion</code>, <code>type</code>. Two rules carry this lesson: <code>source</code> + <code>id</code> must be unique for each distinct event — so a consumer can recognise a duplicate — and a re-sent duplicate <em>may</em> carry the same <code>id</code>. The <code>type</code> carries a version (<code>.v1</code>), and <code>data</code> carries the booking <em>as it was when the event happened</em>, including a <code>version</code> counter (2 after the cancel).</p>
<a class="link-card" href="https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: CloudEvents specification 1.0 (read 1 Nov 2026)</span><span class="lc-sub">Required: id, source, specversion, type. “Producers MUST ensure that source + id is unique for each distinct event”; a duplicate re-sent after a network error MAY keep the same id. Versions go in type (com.example.object.deleted.v2) or dataschema.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Thin or fat: measured on 300 events</h3>
<p>A <strong>thin</strong> event carries only an id (“booking bk_7 changed — ask me”). A <strong>fat</strong> event carries the state. <code>events/thin-vs-fat.mjs</code> creates 200 bookings, cancels 100 of them at once, then plays a slow consumer that sends a “your booking is confirmed” email for each <code>booking.created</code>:</p>
<pre><code class="language-bash">node events/thin-vs-fat.mjs</code></pre>
<div class="out">300 sự kiện: 200 created, 100 cancelled
kích thước: mỏng 60966 B (203 B/sự kiện) · dày 98966 B (330 B/sự kiện)
mỏng: 200 lần gọi lại API trong 94 ms · 100 email "đã đặt" đọc phải trạng thái CANCELLED
dày:  0 lần gọi lại API trong 0.0 ms · 0 sai — mỗi sự kiện nói đúng điều đã xảy ra lúc đó</div>
<p>Thin events are 38% smaller, but the consumer had to call LabFlow back 200 times — and 100 of those calls answered with <em>today's</em> state, <code>CANCELLED</code>, for an event that said “created”. A thin event tells you <em>that</em> something changed; you learn <em>what</em> only by asking now, and now may be later. Fat events answer both, at the cost of bytes and of everything you put in them reaching every subscriber. That is why LabFlow's booking events carry no user id, name or email.</p>

<h3>Changing an event without breaking its readers</h3>
<p>Two consumers read <code>data</code>: one strict (unknown fields are errors, like our request validation in Chapter 2), one tolerant (unknown fields are ignored):</p>
<pre><code class="language-bash">node events/versions.mjs</code></pre>
<div class="out">v1 như cũ                          labflow.booking.created.v1  strict: OK · tolerant: OK
v1 + trường mới purposeCategory    labflow.booking.created.v1  strict: LỖI unrecognized_keys purposeCategory · tolerant: OK
v2 đổi hình dạng (startAt/endAt)   labflow.booking.created.v2  strict: không nhận (chưa đăng ký v2) · tolerant: không nhận (chưa đăng ký v2)
phát song song khi chuyển: 139 B (v1) + 132 B (v2) mỗi lượt đặt</div>
<p>Adding a field broke the strict reader — Chapter 4 again, but with no error response to warn you. Rules for LabFlow's events: readers are tolerant; adding a field keeps the type; renaming or removing one creates a new type (<code>.v2</code>), and the producer publishes <em>both</em> until nobody subscribes to v1 any more.</p>

<h3>Writing the contract down: AsyncAPI</h3>
<p>OpenAPI describes request/response; <strong>AsyncAPI</strong> describes messages that flow one way through channels. LabFlow's <code>asyncapi/asyncapi.yaml</code> (AsyncAPI 3.1) names the Redis Stream channel, the five message types and their payload schemas, and says the delivery rules in words: at least once, deduplicate by <code>id</code>, compare <code>data.version</code>. The official parser checks it like Redocly checked OpenAPI in Chapter 7:</p>
<pre><code class="language-bash">node asyncapi/validate.mjs</code></pre>
<div class="out">⇒ hợp lệ: AsyncAPI 3.1.0, 1 kênh, 5 thông điệp: labflow.booking.created.v1, labflow.booking.cancelled.v1, labflow.booking.checked_in.v1, labflow.export.completed.v1, labflow.report.ready.v1</div>
<pre><code class="language-bash">node asyncapi/validate.mjs asyncapi/broken-ref.yaml</code></pre>
<div class="out">error   invalid-ref: '#/components/messages/BookingCheckIn' does not exist @ operations.publishLabflowEvents.messages.2.$ref
⇒ KHÔNG hợp lệ</div>

<h3>At least once: the duplicate you must expect</h3>
<p>Consumers read the stream through a Redis <strong>consumer group</strong>: <code>XREADGROUP</code> hands a message to one consumer, which processes it and confirms with <code>XACK</code>. A consumer that dies before <code>XACK</code> leaves the message <em>pending</em>; the next run claims it back (<code>XAUTOCLAIM</code>) and processes it again. Nothing is lost, but something may happen twice. <code>events/notifier.mjs</code> sends one notification per event and dies with 2% probability at every dangerous moment; <code>events/redelivery.mjs</code> restarts it until the stream is done:</p>
<pre><code class="language-javascript">async function handle(m) {
  const e = JSON.parse(m.message.e);
  const send = (c) =&gt; c.query('INSERT INTO notifications (event_id, booking_id) VALUES ($1, $2)', [e.id, e.subject]);   // "gửi email"
  if (MODE === 'none') { await send(db); maybeCrash(); }
  if (MODE === 'mark-first') {
    const { rowCount } = await db.query('INSERT INTO processed_events VALUES ($1, $2) ON CONFLICT DO NOTHING', [GROUP, e.id]);
    if (rowCount === 1) { maybeCrash(); await send(db); }                 // chết ở giữa ⇒ đã đánh dấu mà chưa gửi
    maybeCrash();
  }
  if (MODE === 'same-tx') {
    const c = await db.connect();
    try {
      await c.query('BEGIN');
      const { rowCount } = await c.query('INSERT INTO processed_events VALUES ($1, $2) ON CONFLICT DO NOTHING', [GROUP, e.id]);
      if (rowCount === 1) await send(c);                                   // trùng ⇒ bỏ qua, nhưng vẫn ack bên dưới
      await c.query('COMMIT');
    } finally { c.release(); }
    maybeCrash();
  }
  await redis.xAck(STREAM, GROUP, m.id);
}</code></pre>
<pre><code class="language-bash">MODE=none CRASH=0.02 node events/redelivery.mjs</code></pre>
<div class="out">MODE=none CRASH=0.02: 1000 sự kiện · consumer chết 17 lần · 18 lần chạy
⇒ đã gửi 1017 thông báo cho 1000 sự kiện khác nhau · trùng 17 · MẤT 0 · còn pending 0</div>
<pre><code class="language-bash">MODE=mark-first CRASH=0.02 node events/redelivery.mjs</code></pre>
<div class="out">MODE=mark-first CRASH=0.02: 1000 sự kiện · consumer chết 37 lần · 38 lần chạy
⇒ đã gửi 979 thông báo cho 979 sự kiện khác nhau · trùng 0 · MẤT 21 · còn pending 0</div>
<pre><code class="language-bash">MODE=same-tx CRASH=0.02 node events/redelivery.mjs</code></pre>
<div class="out">MODE=same-tx CRASH=0.02: 1000 sự kiện · consumer chết 27 lần · 28 lần chạy
⇒ đã gửi 1000 thông báo cho 1000 sự kiện khác nhau · trùng 0 · MẤT 0 · còn pending 0</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">none</span><span class="lz-t">send → ack</span><span class="lz-d">die between ⇒ sent again: 17 duplicates</span></div>
  <div class="lz-step"><span class="lz-k">mark-first</span><span class="lz-t">mark → send → ack</span><span class="lz-d">die after mark ⇒ never sent: 21 lost</span></div>
  <div class="lz-step"><span class="lz-k">same-tx</span><span class="lz-t">BEGIN mark + send COMMIT → ack</span><span class="lz-d">both or neither: 1,000 exactly</span></div>
</div>
<p>The tempting fix — “remember the id first, then do the work” — is worse than nothing: it turns duplicates into silent losses. The fix that works records the event id <em>in the same transaction</em> as the effect (<code>processed_events</code> with a primary key, <code>ON CONFLICT DO NOTHING</code>). This is what “idempotent consumer” means, and it is the only practical way to get an exactly-once <em>effect</em> from an at-least-once channel.</p>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-8-4-xclaim" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Redis course, lesson 8.4 — when a worker dies (XCLAIM, retries, dead letters)</span><span class="lc-sub">The stream side in depth: pending entries, claiming, delivery counters and a dead-letter stream. This lesson stays at the contract: what a consumer of LabFlow's events must assume.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>The producer side: events that never left</h3>
<p>Look again at <code>emit</code> above: the booking is saved, <em>then</em> the event is published. If publishing fails, the booking exists and its event does not. This is a <strong>dual write</strong>. <code>events/outbox.mjs</code> writes 1,000 bookings to PostgreSQL while Redis is cut off for 1.5 s:</p>
<pre><code class="language-bash">MODE=dual node events/outbox.mjs</code></pre>
<div class="out">MODE=dual: ghi 1000 lượt đặt trong 5.3 s (Redis rớt 1,5 s ở giây 1,5)
⇒ stream có 658 sự kiện cho 658 lượt đặt khác nhau · MẤT 342 · trùng 0 · XADD hỏng 342 lần</div>
<pre><code class="language-bash">MODE=outbox node events/outbox.mjs</code></pre>
<div class="out">MODE=outbox: ghi 1000 lượt đặt trong 6.1 s (Redis rớt 1,5 s ở giây 1,5)
⇒ stream có 1000 sự kiện cho 1000 lượt đặt khác nhau · MẤT 0 · trùng 0
⇒ độ trễ từ COMMIT tới khi lên stream: p50 118 ms · p99 1633 ms · max 1745 ms</div>
<pre><code class="language-bash">MODE=outbox RELAY_CRASH=1 node events/outbox.mjs</code></pre>
<div class="out">MODE=outbox RELAY_CRASH=1: ghi 1000 lượt đặt trong 5.9 s (Redis rớt 1,5 s ở giây 1,5)
⇒ stream có 1018 sự kiện cho 1000 lượt đặt khác nhau · MẤT 0 · trùng 18
⇒ độ trễ từ COMMIT tới khi lên stream: p50 118 ms · p99 1764 ms · max 1808 ms</div>
<p>Dual write lost 342 events — every booking made during the outage and while the client reconnected. The <strong>transactional outbox</strong> lost none: the event row is inserted in the <em>same</em> transaction as the booking, so both exist or neither does, and a relay publishes outbox rows afterwards, retrying while Redis is down:</p>
<pre><code class="language-javascript">async function relay() {                                          // chạy mỗi 100 ms; thật ra là một tiến trình riêng
  const c = await db.connect();
  try {
    await c.query('BEGIN');
    const { rows } = await c.query('SELECT id, type, payload FROM outbox WHERE published_at IS NULL ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED');
    for (const r of rows) await redis.xAdd(STREAM, '*', { e: JSON.stringify({ id: &#96;evt_\${r.id}&#96;, type: r.type, data: r.payload }) });
    if (process.env.RELAY_CRASH &amp;&amp; !relayCrashed &amp;&amp; rows.length) { relayCrashed = true; throw new Error('relay chết trước COMMIT'); }
    await c.query('UPDATE outbox SET published_at = clock_timestamp() WHERE id = ANY($1)', [rows.map((r) =&gt; r.id)]);
    await c.query('COMMIT');
  } catch { await c.query('ROLLBACK'); } finally { c.release(); }   // Redis rớt ⇒ không đánh dấu ⇒ lần sau phát lại
}</code></pre>
<p>The price is delay (p50 118 ms because the relay polls every 100 ms; p99 1.6 s during the outage) and duplicates: when the relay died after publishing but before marking rows, 18 events went out twice. Which is fine — the consumers above are idempotent, and the outbox gives every event its own <code>id</code> (<code>evt_42</code>) <em>before</em> publishing, so a duplicate keeps the same id. (Using the id Redis assigns at <code>XADD</code> would give each duplicate a new one.) LabFlow's bookings live in RAM until Chapter 12, so its own <code>emit</code> stays a dual write until then — written in a comment, not hidden.</p>
<a class="link-card" href="https://microservices.io/patterns/data/transactional-outbox.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: microservices.io — Transactional outbox (read 1 Nov 2026)</span><span class="lc-sub">Store the message in the database as part of the transaction that updates the business data; a separate process sends it to the broker. Drawback, as measured here: the relay may publish a message more than once, so consumers must be idempotent.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Thin or fat events?”</strong> Fat when consumers need what happened (measured: thin caused 200 call-backs and 100 stale reads); thin with a link when data is large or private. Never PII by default.</li>
  <li><strong>“How do you make a consumer idempotent?”</strong> Record the event id in the same transaction as the effect; skip when it exists. “Mark first” loses events.</li>
  <li><strong>“How do you publish an event when you save to the database?”</strong> Transactional outbox + relay; accept at-least-once and duplicates.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>events/redelivery.mjs</code> with <code>CRASH=0.1</code> in all three modes. Does the gap between them grow?</li>
  <li>Add <code>booking.checked_in.v1</code> to a consumer that keeps a “current status” table. Feed it events out of order and use <code>data.version</code> to keep the right status.</li>
  <li>Add a field <code>purposeCategory</code> to LabFlow's booking events, update <code>asyncapi.yaml</code>, validate it, and say in one sentence why the type stays <code>.v1</code>.</li>
</ol>
<p><strong>Done when:</strong> your consumer produces exactly one effect per event under crashes and the AsyncAPI parser reports a valid document.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Event</span><span class="v">A fact in the past tense (“booking cancelled”), not an order.</span></div>
  <div class="kv"><span class="k">CloudEvents</span><span class="v">Standard envelope: id, source, specversion, type, time, data.</span></div>
  <div class="kv"><span class="k">Thin / fat event</span><span class="v">Only an id to fetch, or the state at the time of the event.</span></div>
  <div class="kv"><span class="k">Tolerant reader</span><span class="v">A consumer that ignores fields it does not know.</span></div>
  <div class="kv"><span class="k">AsyncAPI</span><span class="v">OpenAPI's sibling for channels and one-way messages.</span></div>
  <div class="kv"><span class="k">At-least-once</span><span class="v">Nothing lost, duplicates possible — the default of queues and streams.</span></div>
  <div class="kv"><span class="k">Idempotent consumer</span><span class="v">Processing the same event twice has the effect of once.</span></div>
  <div class="kv"><span class="k">Transactional outbox</span><span class="v">The event is saved with the data in one transaction; a relay publishes it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>CloudEvents envelope; <code>source</code> + <code>id</code> unique; version in <code>type</code>; <code>data</code> = state at event time, no PII.</li>
  <li>Thin: 203 B/event but 200 call-backs and 100 stale reads; fat: 330 B/event, 0 call-backs.</li>
  <li>An added field broke a strict reader; breaking changes get a new type and are published in parallel.</li>
  <li>1,000 events with crashes: no dedup 17 duplicates, mark-first 21 lost, same transaction exactly 1,000.</li>
  <li>Redis down 1.5 s: dual write lost 342 events, outbox 0 (p50 lag 118 ms, 18 duplicates when the relay died).</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-swd16-2" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWD392 — lesson 3.C: architectural patterns (Asynchronous Message)</span><span class="lc-sub">Same: producer and consumer decoupled by one-way messages. Different: SWD392 draws the pattern (Gomaa 12.5); here it runs on LabFlow and is measured. This lesson adds the event envelope, versions, duplicates and the outbox. Not taken SWD392 yet? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Hợp đồng sự kiện: thiết kế payload, phiên bản và consumer idempotent</h2>
<p class="lead">Request nói “hãy làm việc này”; sự kiện (event) nói “việc này đã xảy ra”. Khi LabFlow phát “lượt đặt đã huỷ”, dịch vụ gửi thông báo, bảng điều khiển của khoa và hệ thống phòng đào tạo đều phản ứng được — mà LabFlow không cần biết chúng tồn tại. Cái giá: sự kiện là hợp đồng với những người đọc bạn không nhìn thấy. Học xong bài này bạn thiết kế và đánh phiên bản được sự kiện, mô tả nó bằng AsyncAPI, và — có số đo — dựng consumer (bên tiêu thụ) chịu được giao trùng và producer (bên phát) không làm mất gì.</p>

<h3>Một sự kiện, được đọc bởi người bạn không bao giờ gặp</h3>
<p>Mọi thay đổi của lượt đặt giờ thành một sự kiện (code ở <code>src/routes/bookings.js</code> và <code>src/events.js</code>):</p>
<pre><code class="language-javascript">const bookingEvent = (b) =&gt; ({ id: b.id, labId: b.labId, period: { start: b.startAt, end: b.endAt }, status: b.status, version: b.version ?? 1 });
// ⚠ GHI KÉP (dual write, bài 10.3): lượt đặt đã lưu, rồi MỚI phát sự kiện — phát hỏng thì sự kiện mất.
// LabFlow giữ dữ liệu trong RAM tới Chương 12, nên outbox (10.3) chờ tới khi có PostgreSQL.
const emit = (type, b) =&gt; publish(&#96;labflow.booking.\${type}.v1&#96;, b.id, bookingEvent(b)).catch((e) =&gt; console.error('publish', e.message));</code></pre>
<pre><code class="language-bash">curl -s 'http://localhost:4000/v2/events?after=1&amp;limit=1' \\
  -H 'Authorization: Bearer tok_lan' | jq -c '.data[0]'</code></pre>
<div class="out">{"id":"2","specversion":"1.0","type":"labflow.booking.cancelled.v1","source":"/labflow/v2","subject":"bk_1","time":"2026-11-01T01:53:02.699Z","datacontenttype":"application/json","data":{"id":"bk_1","labId":"lab_2","period":{"start":"2026-12-01T01:00:00.000Z","end":"2026-12-01T03:00:00.000Z"},"status":"CANCELLED","version":2}}</div>
<p>Phong bì theo <strong>CloudEvents 1.0</strong> (đặc tả của CNCF). Bắt buộc: <code>id</code>, <code>source</code>, <code>specversion</code>, <code>type</code>. Hai luật gánh cả bài: <code>source</code> + <code>id</code> phải duy nhất cho mỗi sự kiện khác nhau — để consumer nhận ra bản trùng — và một bản trùng gửi lại <em>được phép</em> mang cùng <code>id</code>. <code>type</code> mang số phiên bản (<code>.v1</code>), còn <code>data</code> mang lượt đặt <em>đúng như lúc sự kiện xảy ra</em>, kèm bộ đếm <code>version</code> (thành 2 sau khi huỷ).</p>
<a class="link-card" href="https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: đặc tả CloudEvents 1.0 (đọc ngày 1/11/2026)</span><span class="lc-sub">Bắt buộc: id, source, specversion, type. “Producers MUST ensure that source + id is unique for each distinct event”; bản trùng gửi lại sau lỗi mạng ĐƯỢC giữ cùng id. Phiên bản đặt trong type (com.example.object.deleted.v2) hoặc dataschema.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Mỏng hay dày: đo trên 300 sự kiện</h3>
<p>Sự kiện <strong>mỏng (thin)</strong> chỉ mang id (“lượt bk_7 đã đổi — hỏi tôi đi”). Sự kiện <strong>dày (fat)</strong> mang trạng thái. <code>events/thin-vs-fat.mjs</code> tạo 200 lượt đặt, huỷ ngay 100 lượt trong số đó, rồi đóng vai một consumer chậm gửi email “lượt đặt của bạn đã được xác nhận” cho mỗi <code>booking.created</code>:</p>
<pre><code class="language-bash">node events/thin-vs-fat.mjs</code></pre>
<div class="out">300 sự kiện: 200 created, 100 cancelled
kích thước: mỏng 60966 B (203 B/sự kiện) · dày 98966 B (330 B/sự kiện)
mỏng: 200 lần gọi lại API trong 94 ms · 100 email "đã đặt" đọc phải trạng thái CANCELLED
dày:  0 lần gọi lại API trong 0.0 ms · 0 sai — mỗi sự kiện nói đúng điều đã xảy ra lúc đó</div>
<p>Sự kiện mỏng nhỏ hơn 38%, nhưng consumer phải gọi ngược LabFlow 200 lần — và 100 lần trong đó trả về trạng thái <em>của bây giờ</em>, <code>CANCELLED</code>, cho một sự kiện nói “đã tạo”. Sự kiện mỏng cho bạn biết <em>có</em> gì đó đổi; đổi <em>thành gì</em> thì phải hỏi ngay lúc này, mà lúc này có thể đã muộn. Sự kiện dày trả lời cả hai, đổi lại tốn byte và mọi thứ bạn nhét vào đều tới tay mọi bên đăng ký. Vì thế sự kiện lượt đặt của LabFlow không mang userId, tên hay email.</p>

<h3>Đổi sự kiện mà không làm vỡ người đọc</h3>
<p>Hai consumer đọc <code>data</code>: một khắt khe (trường lạ là lỗi, như cách ta kiểm request ở Chương 2), một dễ tính (bỏ qua trường lạ — tolerant reader):</p>
<pre><code class="language-bash">node events/versions.mjs</code></pre>
<div class="out">v1 như cũ                          labflow.booking.created.v1  strict: OK · tolerant: OK
v1 + trường mới purposeCategory    labflow.booking.created.v1  strict: LỖI unrecognized_keys purposeCategory · tolerant: OK
v2 đổi hình dạng (startAt/endAt)   labflow.booking.created.v2  strict: không nhận (chưa đăng ký v2) · tolerant: không nhận (chưa đăng ký v2)
phát song song khi chuyển: 139 B (v1) + 132 B (v2) mỗi lượt đặt</div>
<p>Thêm một trường đã làm vỡ consumer khắt khe — lại là Chương 4, nhưng không có response lỗi nào báo cho bạn. Luật cho sự kiện của LabFlow: người đọc dễ tính; thêm trường thì giữ type; đổi tên hay bỏ trường thì tạo type mới (<code>.v2</code>), và bên phát phát <em>cả hai</em> cho tới khi không còn ai đăng ký v1.</p>

<h3>Viết hợp đồng ra giấy: AsyncAPI</h3>
<p>OpenAPI mô tả request/response; <strong>AsyncAPI</strong> mô tả thông điệp đi một chiều qua các kênh (channel). <code>asyncapi/asyncapi.yaml</code> của LabFlow (AsyncAPI 3.1) nêu kênh Redis Stream, năm loại thông điệp và lược đồ payload, và nói rõ luật giao bằng lời: ít nhất một lần, chống trùng theo <code>id</code>, so <code>data.version</code>. Parser chính thức kiểm nó như Redocly đã kiểm OpenAPI ở Chương 7:</p>
<pre><code class="language-bash">node asyncapi/validate.mjs</code></pre>
<div class="out">⇒ hợp lệ: AsyncAPI 3.1.0, 1 kênh, 5 thông điệp: labflow.booking.created.v1, labflow.booking.cancelled.v1, labflow.booking.checked_in.v1, labflow.export.completed.v1, labflow.report.ready.v1</div>
<pre><code class="language-bash">node asyncapi/validate.mjs asyncapi/broken-ref.yaml</code></pre>
<div class="out">error   invalid-ref: '#/components/messages/BookingCheckIn' does not exist @ operations.publishLabflowEvents.messages.2.$ref
⇒ KHÔNG hợp lệ</div>

<h3>Ít nhất một lần: bản trùng bạn phải đón trước</h3>
<p>Consumer đọc stream qua một <strong>consumer group</strong> của Redis: <code>XREADGROUP</code> giao một thông điệp cho một consumer, consumer xử lý rồi xác nhận bằng <code>XACK</code>. Consumer chết trước <code>XACK</code> thì thông điệp nằm ở trạng thái <em>pending</em>; lần chạy sau nhận lại nó (<code>XAUTOCLAIM</code>) và xử lý lần nữa. Không mất gì, nhưng có thể xảy ra hai lần. <code>events/notifier.mjs</code> gửi một thông báo cho mỗi sự kiện và chết với xác suất 2% ở mọi thời điểm nguy hiểm; <code>events/redelivery.mjs</code> khởi động lại nó cho tới khi hết stream:</p>
<pre><code class="language-javascript">async function handle(m) {
  const e = JSON.parse(m.message.e);
  const send = (c) =&gt; c.query('INSERT INTO notifications (event_id, booking_id) VALUES ($1, $2)', [e.id, e.subject]);   // "gửi email"
  if (MODE === 'none') { await send(db); maybeCrash(); }
  if (MODE === 'mark-first') {
    const { rowCount } = await db.query('INSERT INTO processed_events VALUES ($1, $2) ON CONFLICT DO NOTHING', [GROUP, e.id]);
    if (rowCount === 1) { maybeCrash(); await send(db); }                 // chết ở giữa ⇒ đã đánh dấu mà chưa gửi
    maybeCrash();
  }
  if (MODE === 'same-tx') {
    const c = await db.connect();
    try {
      await c.query('BEGIN');
      const { rowCount } = await c.query('INSERT INTO processed_events VALUES ($1, $2) ON CONFLICT DO NOTHING', [GROUP, e.id]);
      if (rowCount === 1) await send(c);                                   // trùng ⇒ bỏ qua, nhưng vẫn ack bên dưới
      await c.query('COMMIT');
    } finally { c.release(); }
    maybeCrash();
  }
  await redis.xAck(STREAM, GROUP, m.id);
}</code></pre>
<pre><code class="language-bash">MODE=none CRASH=0.02 node events/redelivery.mjs</code></pre>
<div class="out">MODE=none CRASH=0.02: 1000 sự kiện · consumer chết 17 lần · 18 lần chạy
⇒ đã gửi 1017 thông báo cho 1000 sự kiện khác nhau · trùng 17 · MẤT 0 · còn pending 0</div>
<pre><code class="language-bash">MODE=mark-first CRASH=0.02 node events/redelivery.mjs</code></pre>
<div class="out">MODE=mark-first CRASH=0.02: 1000 sự kiện · consumer chết 37 lần · 38 lần chạy
⇒ đã gửi 979 thông báo cho 979 sự kiện khác nhau · trùng 0 · MẤT 21 · còn pending 0</div>
<pre><code class="language-bash">MODE=same-tx CRASH=0.02 node events/redelivery.mjs</code></pre>
<div class="out">MODE=same-tx CRASH=0.02: 1000 sự kiện · consumer chết 27 lần · 28 lần chạy
⇒ đã gửi 1000 thông báo cho 1000 sự kiện khác nhau · trùng 0 · MẤT 0 · còn pending 0</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">none</span><span class="lz-t">gửi → ack</span><span class="lz-d">chết ở giữa ⇒ gửi lại: 17 bản trùng</span></div>
  <div class="lz-step"><span class="lz-k">mark-first</span><span class="lz-t">đánh dấu → gửi → ack</span><span class="lz-d">chết sau đánh dấu ⇒ không bao giờ gửi: mất 21</span></div>
  <div class="lz-step"><span class="lz-k">same-tx</span><span class="lz-t">BEGIN đánh dấu + gửi COMMIT → ack</span><span class="lz-d">cả hai hoặc không: đúng 1.000</span></div>
</div>
<p>Cách sửa hấp dẫn — “ghi nhớ id trước rồi mới làm” — còn tệ hơn không làm gì: nó biến bản trùng thành mất mát lặng lẽ. Cách đúng ghi id sự kiện <em>trong cùng transaction</em> với tác dụng của nó (bảng <code>processed_events</code> có khoá chính, <code>ON CONFLICT DO NOTHING</code>). Đó chính là “consumer idempotent”, và là cách thực tế duy nhất để có <em>tác dụng</em> đúng một lần từ một kênh giao ít nhất một lần.</p>
<a class="link-card" href="/courses/redis/learn?lessonSlug=rd-8-4-xclaim" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá Redis, bài 8.4 — khi worker chết (XCLAIM, thử lại, dead letter)</span><span class="lc-sub">Phía stream đi sâu: danh sách pending, nhận lại, bộ đếm lần giao và stream chứa thư chết. Bài này đứng ở hợp đồng: consumer sự kiện của LabFlow phải giả định gì.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Phía bên phát: sự kiện chưa từng rời đi</h3>
<p>Nhìn lại <code>emit</code> ở trên: lượt đặt được lưu, <em>rồi</em> sự kiện mới được phát. Phát hỏng thì lượt đặt còn mà sự kiện không. Đây là <strong>ghi kép (dual write)</strong>. <code>events/outbox.mjs</code> ghi 1.000 lượt đặt vào PostgreSQL trong lúc Redis bị cắt 1,5 s:</p>
<pre><code class="language-bash">MODE=dual node events/outbox.mjs</code></pre>
<div class="out">MODE=dual: ghi 1000 lượt đặt trong 5.3 s (Redis rớt 1,5 s ở giây 1,5)
⇒ stream có 658 sự kiện cho 658 lượt đặt khác nhau · MẤT 342 · trùng 0 · XADD hỏng 342 lần</div>
<pre><code class="language-bash">MODE=outbox node events/outbox.mjs</code></pre>
<div class="out">MODE=outbox: ghi 1000 lượt đặt trong 6.1 s (Redis rớt 1,5 s ở giây 1,5)
⇒ stream có 1000 sự kiện cho 1000 lượt đặt khác nhau · MẤT 0 · trùng 0
⇒ độ trễ từ COMMIT tới khi lên stream: p50 118 ms · p99 1633 ms · max 1745 ms</div>
<pre><code class="language-bash">MODE=outbox RELAY_CRASH=1 node events/outbox.mjs</code></pre>
<div class="out">MODE=outbox RELAY_CRASH=1: ghi 1000 lượt đặt trong 5.9 s (Redis rớt 1,5 s ở giây 1,5)
⇒ stream có 1018 sự kiện cho 1000 lượt đặt khác nhau · MẤT 0 · trùng 18
⇒ độ trễ từ COMMIT tới khi lên stream: p50 118 ms · p99 1764 ms · max 1808 ms</div>
<p>Ghi kép mất 342 sự kiện — mọi lượt đặt trong lúc mất kết nối và lúc client nối lại. <strong>Transactional outbox</strong> không mất cái nào: dòng sự kiện được chèn trong <em>cùng</em> transaction với lượt đặt, nên cả hai cùng có hoặc cùng không, và một relay (bộ chuyển tiếp) phát các dòng outbox sau đó, thử lại suốt lúc Redis sập:</p>
<pre><code class="language-javascript">async function relay() {                                          // chạy mỗi 100 ms; thật ra là một tiến trình riêng
  const c = await db.connect();
  try {
    await c.query('BEGIN');
    const { rows } = await c.query('SELECT id, type, payload FROM outbox WHERE published_at IS NULL ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED');
    for (const r of rows) await redis.xAdd(STREAM, '*', { e: JSON.stringify({ id: &#96;evt_\${r.id}&#96;, type: r.type, data: r.payload }) });
    if (process.env.RELAY_CRASH &amp;&amp; !relayCrashed &amp;&amp; rows.length) { relayCrashed = true; throw new Error('relay chết trước COMMIT'); }
    await c.query('UPDATE outbox SET published_at = clock_timestamp() WHERE id = ANY($1)', [rows.map((r) =&gt; r.id)]);
    await c.query('COMMIT');
  } catch { await c.query('ROLLBACK'); } finally { c.release(); }   // Redis rớt ⇒ không đánh dấu ⇒ lần sau phát lại
}</code></pre>
<p>Cái giá là độ trễ (p50 118 ms vì relay hỏi mỗi 100 ms; p99 1,6 s trong lúc sập) và bản trùng: khi relay chết sau khi phát mà trước khi đánh dấu, 18 sự kiện bị phát hai lần. Không sao — consumer ở trên đã idempotent, và outbox cấp <code>id</code> riêng cho từng sự kiện (<code>evt_42</code>) <em>trước</em> khi phát, nên bản trùng giữ nguyên id. (Dùng id do Redis cấp lúc <code>XADD</code> thì mỗi bản trùng sẽ có id mới.) Lượt đặt của LabFlow nằm trong RAM tới Chương 12, nên <code>emit</code> của nó vẫn là ghi kép tới lúc đó — ghi rõ trong chú thích, không giấu.</p>
<a class="link-card" href="https://microservices.io/patterns/data/transactional-outbox.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: microservices.io — Transactional outbox (đọc ngày 1/11/2026)</span><span class="lc-sub">Lưu thông điệp vào CSDL trong cùng transaction cập nhật dữ liệu nghiệp vụ; một tiến trình riêng gửi nó tới broker. Nhược điểm, như đo ở đây: relay có thể phát một thông điệp nhiều lần, nên consumer phải idempotent.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Sự kiện mỏng hay dày?”</strong> Dày khi consumer cần biết đã xảy ra gì (đo được: mỏng gây 200 lần gọi ngược và 100 lần đọc trạng thái cũ); mỏng kèm link khi dữ liệu lớn hoặc riêng tư. Mặc định không dữ liệu cá nhân.</li>
  <li><strong>“Làm consumer idempotent thế nào?”</strong> Ghi id sự kiện trong cùng transaction với tác dụng; đã có thì bỏ qua. “Đánh dấu trước” làm mất sự kiện.</li>
  <li><strong>“Lưu CSDL rồi phát sự kiện thế nào cho chắc?”</strong> Transactional outbox + relay; chấp nhận giao ít nhất một lần và bản trùng.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>events/redelivery.mjs</code> với <code>CRASH=0.1</code> ở cả ba chế độ. Khoảng cách giữa chúng có tăng không?</li>
  <li>Thêm <code>booking.checked_in.v1</code> vào một consumer giữ bảng “trạng thái hiện tại”. Cho nó ăn sự kiện sai thứ tự và dùng <code>data.version</code> để giữ đúng trạng thái.</li>
  <li>Thêm trường <code>purposeCategory</code> vào sự kiện lượt đặt, cập nhật <code>asyncapi.yaml</code>, kiểm nó, và nói trong một câu vì sao type vẫn là <code>.v1</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> consumer của bạn tạo đúng một tác dụng cho mỗi sự kiện dù bị giết, và parser AsyncAPI báo tài liệu hợp lệ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Event (sự kiện)</span><span class="v">Một sự thật ở thì quá khứ (“lượt đặt đã huỷ”), không phải mệnh lệnh.</span></div>
  <div class="kv"><span class="k">CloudEvents</span><span class="v">Phong bì chuẩn: id, source, specversion, type, time, data.</span></div>
  <div class="kv"><span class="k">Thin / fat event (mỏng / dày)</span><span class="v">Chỉ id để tự lấy, hay trạng thái tại lúc xảy ra.</span></div>
  <div class="kv"><span class="k">Tolerant reader (người đọc dễ tính)</span><span class="v">Consumer bỏ qua trường nó không biết.</span></div>
  <div class="kv"><span class="k">AsyncAPI</span><span class="v">“Anh em” của OpenAPI cho kênh và thông điệp một chiều.</span></div>
  <div class="kv"><span class="k">At-least-once (ít nhất một lần)</span><span class="v">Không mất, có thể trùng — mặc định của hàng đợi và stream.</span></div>
  <div class="kv"><span class="k">Idempotent consumer (consumer idempotent)</span><span class="v">Xử lý một sự kiện hai lần cho tác dụng như một lần.</span></div>
  <div class="kv"><span class="k">Transactional outbox</span><span class="v">Sự kiện lưu cùng dữ liệu trong một transaction; relay phát nó đi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Phong bì CloudEvents; <code>source</code> + <code>id</code> duy nhất; phiên bản trong <code>type</code>; <code>data</code> = trạng thái lúc xảy ra, không dữ liệu cá nhân.</li>
  <li>Mỏng: 203 B/sự kiện nhưng 200 lần gọi ngược và 100 lần đọc trạng thái cũ; dày: 330 B/sự kiện, 0 lần gọi ngược.</li>
  <li>Thêm một trường làm vỡ consumer khắt khe; thay đổi phá vỡ thì type mới và phát song song.</li>
  <li>1.000 sự kiện có sập: không chống trùng 17 bản trùng, đánh dấu trước mất 21, cùng transaction đúng 1.000.</li>
  <li>Redis sập 1,5 s: ghi kép mất 342 sự kiện, outbox 0 (trễ p50 118 ms, 18 bản trùng khi relay chết).</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-swd16-2" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp điều này ở SWD392 — bài 3.C: pattern kiến trúc (Asynchronous Message)</span><span class="lc-sub">Giống: bên phát và bên nhận tách nhau bằng thông điệp một chiều. Khác: SWD392 vẽ pattern (Gomaa 12.5); ở đây nó chạy trên LabFlow và được đo. Bài này thêm phong bì sự kiện, phiên bản, bản trùng và outbox. Chưa học SWD392? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — Realtime APIs: polling, SSE or WebSocket — choosing the contract|||10.4 — API thời gian thực: polling, SSE hay WebSocket — chọn hợp đồng',
      slug: 'api-10-3-realtime',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cùng 30 sự kiện: polling trễ p50 1,1 s, long polling/SSE/WebSocket ~1 ms; 100 client ngồi chờ: 1.500 request so với 100; nối lại SSE bằng Last-Event-ID (mất 5 so với đủ 7, reset khi quá cũ); gzip thiếu res.flush() ⇒ trình duyệt thấy 0/8; vé dùng một lần; Redis Stream cho hai instance.',
      content: `${G104}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Realtime APIs: polling, SSE or WebSocket — choosing the contract</h2>
<p class="lead">The lab dashboard on the faculty TV should show a booking the moment it is made. There are four ways to get an event from LabFlow to a screen — ask every few seconds, ask and wait, keep a stream open, or open a two-way socket — and they differ in delay, in how much work the server does when <em>nothing</em> happens, and in what breaks when the network drops. After this lesson you can choose between them from measurements on the same flow, and write the parts of the contract people forget: resuming after a disconnect, authentication, buffering proxies and more than one server.</p>

<h3>Four contracts for the same events</h3>
<p>All four read the event stream of 10.3. Think of a child in the back seat: polling asks “are we there yet?” every two seconds; long polling asks once and the driver answers only when there is news; SSE and WebSocket are the driver talking whenever something happens — SSE one way, WebSocket both ways.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Polling · GET /v2/events?after=42</span><span class="lz-lnote">plain HTTP, any client, cacheable; delay ≈ half the interval; cost even when idle</span></div>
  <div class="lz-layer"><span class="lz-lname">Long polling · …&amp;wait=25</span><span class="lz-lnote">the server holds the request until an event or 25 s; one request per event</span></div>
  <div class="lz-layer"><span class="lz-lname">Server-Sent Events · GET /v2/events/stream</span><span class="lz-lnote">one HTTP response that never ends; text lines id/event/data; browser reconnects by itself</span></div>
  <div class="lz-layer"><span class="lz-lname">WebSocket · ws://…/v2/ws</span><span class="lz-lnote">HTTP upgrade to a two-way connection; your own message format and reconnect logic</span></div>
</div>
<p>The polling endpoint is ordinary REST with a cursor (Chapter 3): no <code>after</code> means “start from now”, every answer carries <code>next</code>, and a cursor that has fallen out of the retained window is <code>410 EVENTS_EXPIRED</code> — reload the state, then listen again. Long polling is the same endpoint: with <code>wait=25</code> and nothing new, the handler subscribes to the event bus and answers when the next event arrives or 25 s pass (<code>src/routes/realtime.js</code>).</p>

<h3>Measured: delay, requests and bytes</h3>
<p><code>perf/realtime.mjs</code> creates 30 bookings 100–700 ms apart while one client of each kind listens, and records when each client saw each event:</p>
<pre><code class="language-bash">node perf/realtime.mjs</code></pre>
<div class="out">30 sự kiện trong 14.7 s
client         nhận   p50     p95     max     request  byte
polling 2 s      30   1112 ms  1982 ms  2005 ms      8   12875
long polling     30      1 ms     4 ms     4 ms     30   20664
SSE              30      1 ms     5 ms     7 ms      1   10114
WebSocket        30      0 ms     3 ms     3 ms      2   10562</div>
<p>Polling every 2 s saw events 1.1 s late on average and up to 2 s — half the interval and the whole interval, exactly as arithmetic predicts. The other three delivered in 1–5 ms. Long polling needed one request per event (30), SSE one request for everything, WebSocket two (the ticket and the upgrade). Now the question nobody asks in a demo — what does a quiet hour cost? 100 clients, 30 seconds, zero events:</p>
<pre><code class="language-bash">node perf/idle.mjs poll</code></pre>
<div class="out">poll  100 client × 30 s, 0 sự kiện ⇒ 1500 request, ~524 KB</div>
<pre><code class="language-bash">node perf/idle.mjs long</code></pre>
<div class="out">long  100 client × 30 s, 0 sự kiện ⇒ 100 request, ~35 KB</div>
<pre><code class="language-bash">node perf/idle.mjs sse</code></pre>
<div class="out">sse   100 client × 30 s, 0 sự kiện ⇒ 100 request, ~33 KB</div>
<p>Polling made 1,500 requests (~524 KB of headers and empty JSON) to say “nothing new” — every one authenticated and logged. Put Chapter 5's IP limit on it (100 per 60 s, as on <code>GET /labs</code>) and a computer room behind one NAT is blocked within seconds. Long polling and SSE cost one request per client.</p>

<h3>Server-Sent Events: the format and the resume</h3>
<p>SSE is a <code>text/event-stream</code> response written line by line. A client that reconnects sends the last <code>id</code> it saw in <code>Last-Event-ID</code>, and LabFlow replays what came after it:</p>
<pre><code class="language-bash">curl -sN --max-time 2 http://localhost:4000/v2/events/stream \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Last-Event-ID: 40'</code></pre>
<div class="out">retry: 3000

id: 41
event: labflow.booking.created.v1
data: {"id":"41","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_41","time":"2026-11-01T01:31:24.548Z","datacontenttype":"application/json","data":{"id":"bk_41","labId":"lab_3","period":{"start":"2028-04-19T01:00:00.000Z","end":"2028-04-19T03:00:00.000Z"},"status":"PENDING","version":1}}

id: 42
event: labflow.booking.created.v1
data: {"id":"42","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_42","time":"2026-11-01T01:31:24.549Z","datacontenttype":"application/json","data":{"id":"bk_42","labId":"lab_3","period":{"start":"2028-04-19T03:00:00.000Z","end":"2028-04-19T05:00:00.000Z"},"status":"PENDING","version":1}}</div>
<p><code>retry: 3000</code> tells the browser's <code>EventSource</code> to wait 3 s before reconnecting; a blank line ends each event; lines starting with <code>:</code> are comments, which LabFlow sends every 15 s (<code>: ping</code>) so that proxies do not close an idle connection — the HTML standard recommends exactly that. The handler subscribes <em>before</em> it replays, so an event that arrives during the replay is held, not lost:</p>
<pre><code class="language-javascript">realtimeRouter.route('/events/stream')
  .get(bearerOrTicket, async (req, res) =&gt; {
    res.status(200).set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' });
    const write = (s) =&gt; { res.write(s); if (!NO_FLUSH) res.flush?.(); };   // compression() giữ chữ trong bộ đệm gzip ⇒ PHẢI đẩy ra
    const send = (e) =&gt; write(&#96;id: \${e.id}\\nevent: \${e.type}\\ndata: \${JSON.stringify(e)}\\n\\n&#96;);
    write(&#96;retry: \${RETRY_MS}\\n\\n&#96;);                             // EventSource đợi bao lâu trước khi nối lại
    // Đăng ký nghe TRƯỚC, phát bù SAU — sự kiện tới giữa hai bước nằm trong &#96;held&#96;, không lọt
    let last = req.get('Last-Event-ID') ?? req.query.after ?? null, held = [], replaying = true;
    const off = subscribe((e) =&gt; (replaying ? held.push(e) : (!last || cmpId(e.id, last) &gt; 0) &amp;&amp; (send(e), last = e.id)));
    if (last) {
      for (;;) {
        const r = await since(last, 100);
        if (r.gap) { write(&#96;event: reset\\ndata: \${JSON.stringify({ latest: await latestId() })}\\n\\n&#96;); break; }
        for (const e of r.data) { send(e); last = e.id; }
        if (r.data.length &lt; 100) break;
      }
    }
    for (const e of held) if (!last || cmpId(e.id, last) &gt; 0) { send(e); last = e.id; }
    replaying = false; held = null;
    const ping = setInterval(() =&gt; write(': ping\\n\\n'), HEARTBEAT_MS);   // giữ kết nối qua proxy hay cắt kết nối im lặng
    req.on('close', () =&gt; { clearInterval(ping); off(); });
  })
  .all(onlyAllow('GET'));</code></pre>
<p>Does the resume work? <code>perf/sse-resume.mjs</code> receives 5 events, disconnects, misses 5, then reconnects three ways (<code>EVENTS_KEEP=20</code>, so LabFlow keeps only 20 events):</p>
<pre><code class="language-bash">node perf/sse-resume.mjs</code></pre>
<div class="out">lần đầu                        nhận 5: 1:bk_1 2:bk_2 3:bk_3 4:bk_4 5:bk_5
(a) nối lại, KHÔNG Last-Event-ID nhận 2: 11:bk_11 12:bk_12
(b) Last-Event-ID: 5           nhận 7: 6:bk_6 7:bk_7 8:bk_8 9:bk_9 10:bk_10 11:bk_11 12:bk_12
(c) Last-Event-ID: 5 (quá cũ)  nhận 1: reset {"latest":"42"}</div>
<p>Without <code>Last-Event-ID</code> the client silently lost bk_6…bk_10. With it, all 7 arrived in order. And when the client was away too long, LabFlow did not pretend: one <code>reset</code> event tells it to reload the state from the REST API and continue from <code>latest</code>. That “you are too far behind” answer is part of the contract — without it a client shows a dashboard with holes and no way to know.</p>
<a class="link-card" href="https://html.spec.whatwg.org/multipage/server-sent-events.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: WHATWG HTML — Server-sent events (read 1 Nov 2026)</span><span class="lc-sub">The event stream format (id, event, data, retry, comments), Last-Event-ID on reconnection, and the advice to send a comment line “every 15 seconds or so” for proxies that drop idle connections.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>The trap that works in curl and fails in the browser</h3>
<p>LabFlow compresses responses (Chapter 8.3). Compression keeps a window of output in a buffer to compress it well — fine for JSON, fatal for a stream that writes 300 bytes now and then. With <code>LABFLOW_SSE_NOFLUSH=1</code> the handler forgets <code>res.flush()</code>:</p>
<pre><code class="language-bash">node perf/sse-buffer.mjs</code></pre>
<div class="out">Content-Encoding: gzip · sinh 8 sự kiện ở giây 1…8 · client thấy 0: —</div>
<pre><code class="language-bash">(sleep 1; cd labflow-ch10 &amp;&amp; node -e "import('./perf/book.mjs').then((m) =&gt; m.book(1))") &amp; curl -sN --max-time 3 http://localhost:4000/v2/events/stream -H 'Authorization: Bearer tok_lan' | cut -c1-90</code></pre>
<div class="out">retry: 3000

id: 9
event: labflow.booking.created.v1
data: {"id":"9","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow</div>
<pre><code class="language-bash">(sleep 1; cd labflow-ch10 &amp;&amp; node -e "import('./perf/book.mjs').then((m) =&gt; m.book(1))") &amp; curl -sN --max-time 3 --compressed http://localhost:4000/v2/events/stream -H 'Authorization: Bearer tok_lan' | cut -c1-90; echo "(curl --compressed: không thấy gì sau 3 s)"</code></pre>
<div class="out">(curl --compressed: không thấy gì sau 3 s)</div>
<p>A client that sends <code>Accept-Encoding: gzip</code> — every browser does — saw <em>nothing</em> in 8 seconds; plain <code>curl</code> (no compression) worked perfectly, and <code>curl --compressed</code> also saw nothing. That is how this bug ships: the developer tests with curl. With <code>res.flush()</code> after every write:</p>
<pre><code class="language-bash">node perf/sse-buffer.mjs</code></pre>
<div class="out">Content-Encoding: gzip · sinh 8 sự kiện ở giây 1…8 · client thấy 8: bk_1@1.1s bk_2@2.1s bk_3@3.1s bk_4@4.1s bk_5@5.1s bk_6@6.1s bk_7@7.1s bk_8@8.1s</div>
<p>The same thing happens one layer out: nginx buffers proxied responses by default; LabFlow sends <code>X-Accel-Buffering: no</code> so nginx passes the stream through.</p>
<a class="link-card" href="https://github.com/expressjs/compression" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: expressjs/compression README (read 1 Nov 2026)</span><span class="lc-sub">“Because of the nature of compression this module does not work out of the box with server-sent events”; call res.flush() after each event. nginx: proxy_buffering on by default, X-Accel-Buffering: no turns it off per response.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Who is listening? Tickets for browsers</h3>
<p>Browsers cannot set an <code>Authorization</code> header on <code>EventSource</code> or <code>WebSocket</code>. Putting the 15-minute JWT in the URL would write it into every proxy log. LabFlow exchanges the token for a <strong>ticket</strong>: valid 30 s, usable once:</p>
<pre><code class="language-bash">node perf/ws-demo.mjs</code></pre>
<div class="out">POST /v2/realtime/tickets ⇒ 201 { ticket: "tkt_K8pj…", expiresIn: 30 }
đã nối (101 Switching Protocols)
← {"type":"hello","latest":"0"}
← {"type":"event","event":{"id":"1","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_1","time":"2026-11-01T0…
→ {"type":"resume","after":"0"}
← {"type":"event","event":{"id":"1","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_1","time":"2026-11-01T0…
dùng lại vé cũ ⇒ 401 {"type":"https://labflow.example/problems/ticket-invalid","status":401,"code":"TICKET_INVALID"}</div>
<p>The WebSocket also shows its cost: LabFlow had to invent a message format (<code>hello</code>, <code>event</code>, <code>resume</code>) and its own resume, which SSE gets from the standard. A ticket also protects against cross-site WebSocket hijacking: a page on another origin cannot open the socket with the user's cookies, because there are no cookies to use.</p>

<h3>More than one server</h3>
<p>Run two LabFlow instances (as behind the load balancer of 8.4). A booking created on :4000 must reach a dashboard connected to :4002:</p>
<pre><code class="language-bash">node perf/two-instances.mjs</code></pre>
<div class="out">tạo 10 lượt đặt qua :4000 · client nối :4002 thấy 0: —</div>
<pre><code class="language-bash">node perf/two-instances.mjs</code></pre>
<div class="out">tạo 10 lượt đặt qua :4000 · client nối :4002 thấy 10: bk_1 bk_2 bk_3 bk_4 bk_5 bk_6 bk_7 bk_8 bk_9 bk_10</div>
<pre><code class="language-bash">redis-cli -p 6390 XLEN labflow:events</code></pre>
<div class="out">10</div>
<p>With events in process memory the dashboard saw 0 of 10. With <code>LABFLOW_EVENTS=redis</code> every instance reads the tail of the same Redis Stream and pushes to its own clients: 10 of 10 — and the stream doubles as the replay log for <code>Last-Event-ID</code>.</p>
<a class="link-card" href="/courses/socket-io/learn?lessonSlug=io-5-1-vi-sao" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Socket.IO course, lesson 5.1 — why a Redis adapter</span><span class="lc-sub">Cross-worker broadcast measured from the socket side; lesson 0.2 explains why long polling is still alive in 2026. This lesson chooses the contract; Socket.IO is one way to implement the WebSocket row.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Choosing</h3>
<ul>
  <li><strong>Polling</strong> — a few clients, updates rarely matter within seconds, or the job status of 10.1 (with Retry-After). Simplest to cache and debug.</li>
  <li><strong>Long polling</strong> — when streaming is blocked by a proxy; a fallback, not a first choice.</li>
  <li><strong>SSE</strong> — server → client feeds: dashboards, notifications, progress. Plain HTTP, built-in resume. LabFlow's default.</li>
  <li><strong>WebSocket</strong> — both directions at high rate: chat, collaborative editing, games. You own the protocol.</li>
</ul>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Polling, SSE or WebSocket for a notifications feed?”</strong> SSE: one direction, HTTP-friendly, Last-Event-ID resume. Measured: polling every 2 s = 1.1 s average delay and 1,500 idle requests per 100 clients per 30 s.</li>
  <li><strong>“The stream works locally but not in production.”</strong> Buffering: compression without flush, nginx proxy_buffering, a CDN. Test with Accept-Encoding: gzip, not plain curl.</li>
  <li><strong>“How do you authenticate a WebSocket?”</strong> Short-lived one-time ticket from an authenticated endpoint, checked before the upgrade; never a long-lived token in the URL.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Run <code>perf/realtime.mjs</code> with polling every 500 ms. What happens to delay and to requests?</li>
  <li>Open the SSE stream in a browser page with <code>new EventSource('/v2/events/stream?ticket=…')</code>, stop LabFlow for 10 s, start it again. Read the reconnect in DevTools → Network.</li>
  <li>Add a <code>labId</code> filter to <code>/v2/events/stream</code> so the TV of lab_1 receives only lab_1. Does the replay respect the filter?</li>
</ol>
<p><strong>Done when:</strong> the filtered stream resumes after a restart without missing or duplicating an event for that lab.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long polling</span><span class="v">The server holds a request open until there is news or a timeout.</span></div>
  <div class="kv"><span class="k">Server-Sent Events</span><span class="v">One never-ending HTTP response of id/event/data lines, server → client.</span></div>
  <div class="kv"><span class="k">Last-Event-ID</span><span class="v">Header a reconnecting client sends so the server can replay what it missed.</span></div>
  <div class="kv"><span class="k">WebSocket</span><span class="v">A two-way connection created by an HTTP upgrade (101).</span></div>
  <div class="kv"><span class="k">Heartbeat</span><span class="v">A small message (“: ping”) that keeps idle connections alive.</span></div>
  <div class="kv"><span class="k">Ticket</span><span class="v">A short-lived, one-time credential for connections that cannot send headers.</span></div>
  <div class="kv"><span class="k">Fan-out</span><span class="v">Delivering one event to clients on every instance (here via a Redis Stream).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Same 30 events: polling 2 s p50 1.1 s late; long polling, SSE, WebSocket 0–1 ms.</li>
  <li>Idle 100 clients × 30 s: polling 1,500 requests, long polling and SSE 100.</li>
  <li>SSE resume: without Last-Event-ID 5 events lost silently; with it 7 of 7; too old ⇒ <code>reset</code> (polling: 410).</li>
  <li>Compression without <code>res.flush()</code>: browsers see 0 of 8 events while curl works.</li>
  <li>One-time 30 s tickets for EventSource/WebSocket; Redis Stream fan-out: 0 → 10 of 10 across two instances.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>API thời gian thực: polling, SSE hay WebSocket — chọn hợp đồng</h2>
<p class="lead">Màn hình TV của khoa phải hiện lượt đặt ngay khi nó được tạo. Có bốn cách đưa một sự kiện từ LabFlow tới màn hình — vài giây hỏi một lần, hỏi rồi chờ, giữ một luồng mở, hay mở một kết nối hai chiều — và chúng khác nhau ở độ trễ, ở lượng việc server phải làm khi <em>không có gì</em> xảy ra, và ở thứ gì vỡ khi mạng rớt. Học xong bài này bạn chọn được giữa chúng bằng số đo trên cùng một luồng, và viết được những phần hợp đồng hay bị quên: nối lại sau khi rớt, xác thực, proxy giữ đệm và nhiều server.</p>

<h3>Bốn hợp đồng cho cùng một dòng sự kiện</h3>
<p>Cả bốn đọc dòng sự kiện của bài 10.3. Hình dung đứa trẻ ngồi ghế sau: polling hỏi “tới chưa?” mỗi hai giây; long polling hỏi một lần và tài xế chỉ trả lời khi có tin; SSE và WebSocket là tài xế tự lên tiếng mỗi khi có chuyện — SSE một chiều, WebSocket hai chiều.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Polling · GET /v2/events?after=42</span><span class="lz-lnote">HTTP thường, client nào cũng dùng được, cache được; trễ ≈ nửa chu kỳ; tốn cả khi không có gì</span></div>
  <div class="lz-layer"><span class="lz-lname">Long polling · …&amp;wait=25</span><span class="lz-lnote">server giữ request tới khi có sự kiện hoặc hết 25 s; mỗi sự kiện một request</span></div>
  <div class="lz-layer"><span class="lz-lname">Server-Sent Events · GET /v2/events/stream</span><span class="lz-lnote">một response HTTP không bao giờ kết thúc; các dòng chữ id/event/data; trình duyệt tự nối lại</span></div>
  <div class="lz-layer"><span class="lz-lname">WebSocket · ws://…/v2/ws</span><span class="lz-lnote">nâng cấp HTTP thành kết nối hai chiều; tự đặt định dạng thông điệp và tự lo nối lại</span></div>
</div>
<p>Endpoint polling là REST bình thường có con trỏ (Chương 3): không có <code>after</code> nghĩa là “bắt đầu từ bây giờ”, câu trả lời nào cũng mang <code>next</code>, và con trỏ đã rơi khỏi vùng giữ là <code>410 EVENTS_EXPIRED</code> — tải lại trạng thái rồi nghe tiếp. Long polling dùng cùng endpoint: có <code>wait=25</code> mà chưa có gì mới thì handler đăng ký nghe bus sự kiện và trả lời khi sự kiện kế tiếp tới hoặc hết 25 s (<code>src/routes/realtime.js</code>).</p>

<h3>Đo: độ trễ, số request và số byte</h3>
<p><code>perf/realtime.mjs</code> tạo 30 lượt đặt cách nhau 100–700 ms trong lúc mỗi kiểu client một chiếc đang nghe, và ghi lại lúc từng client thấy từng sự kiện:</p>
<pre><code class="language-bash">node perf/realtime.mjs</code></pre>
<div class="out">30 sự kiện trong 14.7 s
client         nhận   p50     p95     max     request  byte
polling 2 s      30   1112 ms  1982 ms  2005 ms      8   12875
long polling     30      1 ms     4 ms     4 ms     30   20664
SSE              30      1 ms     5 ms     7 ms      1   10114
WebSocket        30      0 ms     3 ms     3 ms      2   10562</div>
<p>Polling 2 giây thấy sự kiện trễ trung bình 1,1 s và tối đa 2 s — đúng nửa chu kỳ và cả chu kỳ như phép tính dự đoán. Ba cách còn lại giao trong 1–5 ms. Long polling cần mỗi sự kiện một request (30), SSE một request cho tất cả, WebSocket hai (vé và nâng cấp). Giờ là câu hỏi không ai hỏi khi demo — một giờ yên ắng tốn bao nhiêu? 100 client, 30 giây, không sự kiện nào:</p>
<pre><code class="language-bash">node perf/idle.mjs poll</code></pre>
<div class="out">poll  100 client × 30 s, 0 sự kiện ⇒ 1500 request, ~524 KB</div>
<pre><code class="language-bash">node perf/idle.mjs long</code></pre>
<div class="out">long  100 client × 30 s, 0 sự kiện ⇒ 100 request, ~35 KB</div>
<pre><code class="language-bash">node perf/idle.mjs sse</code></pre>
<div class="out">sse   100 client × 30 s, 0 sự kiện ⇒ 100 request, ~33 KB</div>
<p>Polling gửi 1.500 request (~524 KB header và JSON rỗng) chỉ để nói “không có gì mới” — request nào cũng phải xác thực và ghi log. Gắn giới hạn theo IP của Chương 5 (100 lượt mỗi 60 s, như ở <code>GET /labs</code>) là một phòng máy sau cùng một NAT bị chặn trong vài giây. Long polling và SSE mỗi client một request.</p>

<h3>Server-Sent Events: định dạng và nối lại</h3>
<p>SSE là một response <code>text/event-stream</code> viết từng dòng. Client nối lại gửi <code>id</code> cuối cùng nó thấy trong header <code>Last-Event-ID</code>, và LabFlow phát bù phần sau đó:</p>
<pre><code class="language-bash">curl -sN --max-time 2 http://localhost:4000/v2/events/stream \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Last-Event-ID: 40'</code></pre>
<div class="out">retry: 3000

id: 41
event: labflow.booking.created.v1
data: {"id":"41","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_41","time":"2026-11-01T01:31:24.548Z","datacontenttype":"application/json","data":{"id":"bk_41","labId":"lab_3","period":{"start":"2028-04-19T01:00:00.000Z","end":"2028-04-19T03:00:00.000Z"},"status":"PENDING","version":1}}

id: 42
event: labflow.booking.created.v1
data: {"id":"42","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_42","time":"2026-11-01T01:31:24.549Z","datacontenttype":"application/json","data":{"id":"bk_42","labId":"lab_3","period":{"start":"2028-04-19T03:00:00.000Z","end":"2028-04-19T05:00:00.000Z"},"status":"PENDING","version":1}}</div>
<p><code>retry: 3000</code> bảo <code>EventSource</code> của trình duyệt chờ 3 s trước khi nối lại; một dòng trống kết thúc mỗi sự kiện; dòng bắt đầu bằng <code>:</code> là chú thích, LabFlow gửi mỗi 15 s (<code>: ping</code>) để proxy không cắt kết nối đang im — chuẩn HTML khuyên đúng như vậy. Handler đăng ký nghe <em>trước</em> rồi mới phát bù, nên sự kiện tới giữa lúc phát bù được giữ lại, không lọt:</p>
<pre><code class="language-javascript">realtimeRouter.route('/events/stream')
  .get(bearerOrTicket, async (req, res) =&gt; {
    res.status(200).set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' });
    const write = (s) =&gt; { res.write(s); if (!NO_FLUSH) res.flush?.(); };   // compression() giữ chữ trong bộ đệm gzip ⇒ PHẢI đẩy ra
    const send = (e) =&gt; write(&#96;id: \${e.id}\\nevent: \${e.type}\\ndata: \${JSON.stringify(e)}\\n\\n&#96;);
    write(&#96;retry: \${RETRY_MS}\\n\\n&#96;);                             // EventSource đợi bao lâu trước khi nối lại
    // Đăng ký nghe TRƯỚC, phát bù SAU — sự kiện tới giữa hai bước nằm trong &#96;held&#96;, không lọt
    let last = req.get('Last-Event-ID') ?? req.query.after ?? null, held = [], replaying = true;
    const off = subscribe((e) =&gt; (replaying ? held.push(e) : (!last || cmpId(e.id, last) &gt; 0) &amp;&amp; (send(e), last = e.id)));
    if (last) {
      for (;;) {
        const r = await since(last, 100);
        if (r.gap) { write(&#96;event: reset\\ndata: \${JSON.stringify({ latest: await latestId() })}\\n\\n&#96;); break; }
        for (const e of r.data) { send(e); last = e.id; }
        if (r.data.length &lt; 100) break;
      }
    }
    for (const e of held) if (!last || cmpId(e.id, last) &gt; 0) { send(e); last = e.id; }
    replaying = false; held = null;
    const ping = setInterval(() =&gt; write(': ping\\n\\n'), HEARTBEAT_MS);   // giữ kết nối qua proxy hay cắt kết nối im lặng
    req.on('close', () =&gt; { clearInterval(ping); off(); });
  })
  .all(onlyAllow('GET'));</code></pre>
<p>Nối lại có thật sự chạy không? <code>perf/sse-resume.mjs</code> nhận 5 sự kiện, ngắt kết nối, lỡ 5 sự kiện, rồi nối lại theo ba cách (<code>EVENTS_KEEP=20</code>: LabFlow chỉ giữ 20 sự kiện):</p>
<pre><code class="language-bash">node perf/sse-resume.mjs</code></pre>
<div class="out">lần đầu                        nhận 5: 1:bk_1 2:bk_2 3:bk_3 4:bk_4 5:bk_5
(a) nối lại, KHÔNG Last-Event-ID nhận 2: 11:bk_11 12:bk_12
(b) Last-Event-ID: 5           nhận 7: 6:bk_6 7:bk_7 8:bk_8 9:bk_9 10:bk_10 11:bk_11 12:bk_12
(c) Last-Event-ID: 5 (quá cũ)  nhận 1: reset {"latest":"42"}</div>
<p>Không có <code>Last-Event-ID</code>, client lặng lẽ mất bk_6…bk_10. Có nó, cả 7 tới đủ và đúng thứ tự. Còn khi client vắng quá lâu, LabFlow không giả vờ: một sự kiện <code>reset</code> bảo nó tải lại trạng thái từ REST API rồi nghe tiếp từ <code>latest</code>. Câu trả lời “bạn đã tụt quá xa” là một phần hợp đồng — thiếu nó, client hiện một bảng điều khiển thủng lỗ mà không cách nào biết.</p>
<a class="link-card" href="https://html.spec.whatwg.org/multipage/server-sent-events.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: WHATWG HTML — Server-sent events (đọc ngày 1/11/2026)</span><span class="lc-sub">Định dạng luồng sự kiện (id, event, data, retry, chú thích), Last-Event-ID khi nối lại, và lời khuyên gửi một dòng chú thích “every 15 seconds or so” cho các proxy hay cắt kết nối im lặng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Cái bẫy chạy được với curl mà hỏng trên trình duyệt</h3>
<p>LabFlow nén response (bài 8.3). Bộ nén giữ một đoạn output trong bộ đệm để nén cho tốt — ổn với JSON, chết người với một luồng thỉnh thoảng mới viết 300 byte. Với <code>LABFLOW_SSE_NOFLUSH=1</code>, handler quên <code>res.flush()</code>:</p>
<pre><code class="language-bash">node perf/sse-buffer.mjs</code></pre>
<div class="out">Content-Encoding: gzip · sinh 8 sự kiện ở giây 1…8 · client thấy 0: —</div>
<pre><code class="language-bash">(sleep 1; cd labflow-ch10 &amp;&amp; node -e "import('./perf/book.mjs').then((m) =&gt; m.book(1))") &amp; curl -sN --max-time 3 http://localhost:4000/v2/events/stream -H 'Authorization: Bearer tok_lan' | cut -c1-90</code></pre>
<div class="out">retry: 3000

id: 9
event: labflow.booking.created.v1
data: {"id":"9","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow</div>
<pre><code class="language-bash">(sleep 1; cd labflow-ch10 &amp;&amp; node -e "import('./perf/book.mjs').then((m) =&gt; m.book(1))") &amp; curl -sN --max-time 3 --compressed http://localhost:4000/v2/events/stream -H 'Authorization: Bearer tok_lan' | cut -c1-90; echo "(curl --compressed: không thấy gì sau 3 s)"</code></pre>
<div class="out">(curl --compressed: không thấy gì sau 3 s)</div>
<p>Client gửi <code>Accept-Encoding: gzip</code> — trình duyệt nào cũng gửi — <em>không thấy gì</em> trong 8 giây; <code>curl</code> thường (không nén) chạy hoàn hảo, còn <code>curl --compressed</code> cũng không thấy gì. Lỗi này lên production đúng theo cách đó: lập trình viên thử bằng curl. Có <code>res.flush()</code> sau mỗi lần viết:</p>
<pre><code class="language-bash">node perf/sse-buffer.mjs</code></pre>
<div class="out">Content-Encoding: gzip · sinh 8 sự kiện ở giây 1…8 · client thấy 8: bk_1@1.1s bk_2@2.1s bk_3@3.1s bk_4@4.1s bk_5@5.1s bk_6@6.1s bk_7@7.1s bk_8@8.1s</div>
<p>Chuyện tương tự xảy ra ở lớp ngoài: nginx mặc định giữ đệm response nó chuyển tiếp; LabFlow gửi <code>X-Accel-Buffering: no</code> để nginx cho luồng đi thẳng.</p>
<a class="link-card" href="https://github.com/expressjs/compression" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: README của expressjs/compression (đọc ngày 1/11/2026)</span><span class="lc-sub">“Because of the nature of compression this module does not work out of the box with server-sent events”; gọi res.flush() sau mỗi sự kiện. nginx: proxy_buffering bật mặc định, X-Accel-Buffering: no tắt nó cho từng response.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Ai đang nghe? Vé cho trình duyệt</h3>
<p>Trình duyệt không đặt được header <code>Authorization</code> cho <code>EventSource</code> hay <code>WebSocket</code>. Nhét JWT 15 phút vào URL thì nó nằm trong log của mọi proxy. LabFlow đổi token lấy một <strong>vé (ticket)</strong>: sống 30 s, dùng một lần:</p>
<pre><code class="language-bash">node perf/ws-demo.mjs</code></pre>
<div class="out">POST /v2/realtime/tickets ⇒ 201 { ticket: "tkt_K8pj…", expiresIn: 30 }
đã nối (101 Switching Protocols)
← {"type":"hello","latest":"0"}
← {"type":"event","event":{"id":"1","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_1","time":"2026-11-01T0…
→ {"type":"resume","after":"0"}
← {"type":"event","event":{"id":"1","specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_1","time":"2026-11-01T0…
dùng lại vé cũ ⇒ 401 {"type":"https://labflow.example/problems/ticket-invalid","status":401,"code":"TICKET_INVALID"}</div>
<p>WebSocket cũng lộ cái giá của nó: LabFlow phải tự nghĩ ra định dạng thông điệp (<code>hello</code>, <code>event</code>, <code>resume</code>) và tự làm phần nối lại, thứ SSE có sẵn trong chuẩn. Vé còn chặn được tấn công chiếm WebSocket chéo trang (cross-site WebSocket hijacking): trang của origin khác không mở được socket bằng cookie của người dùng, vì không có cookie nào để dùng.</p>

<h3>Nhiều hơn một server</h3>
<p>Chạy hai instance LabFlow (như sau load balancer ở bài 8.4). Lượt đặt tạo ở :4000 phải tới được bảng điều khiển nối vào :4002:</p>
<pre><code class="language-bash">node perf/two-instances.mjs</code></pre>
<div class="out">tạo 10 lượt đặt qua :4000 · client nối :4002 thấy 0: —</div>
<pre><code class="language-bash">node perf/two-instances.mjs</code></pre>
<div class="out">tạo 10 lượt đặt qua :4000 · client nối :4002 thấy 10: bk_1 bk_2 bk_3 bk_4 bk_5 bk_6 bk_7 bk_8 bk_9 bk_10</div>
<pre><code class="language-bash">redis-cli -p 6390 XLEN labflow:events</code></pre>
<div class="out">10</div>
<p>Sự kiện nằm trong RAM của tiến trình thì bảng điều khiển thấy 0 trên 10. Với <code>LABFLOW_EVENTS=redis</code>, mọi instance cùng đọc đuôi một Redis Stream và đẩy cho client của chính nó: 10 trên 10 — và stream kiêm luôn nhật ký phát bù cho <code>Last-Event-ID</code>.</p>
<a class="link-card" href="/courses/socket-io/learn?lessonSlug=io-5-1-vi-sao" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá Socket.IO, bài 5.1 — vì sao cần Redis adapter</span><span class="lc-sub">Phát sóng chéo worker đo từ phía socket; bài 0.2 giải thích vì sao long polling vẫn sống năm 2026. Bài này chọn hợp đồng; Socket.IO là một cách hiện thực dòng WebSocket.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Chọn thế nào</h3>
<ul>
  <li><strong>Polling</strong> — ít client, chậm vài giây không sao, hoặc trạng thái việc của bài 10.1 (kèm Retry-After). Dễ cache và dễ gỡ lỗi nhất.</li>
  <li><strong>Long polling</strong> — khi proxy chặn luồng; là phương án dự phòng, không phải lựa chọn đầu.</li>
  <li><strong>SSE</strong> — luồng từ server tới client: bảng điều khiển, thông báo, tiến độ. HTTP thường, nối lại có sẵn. Mặc định của LabFlow.</li>
  <li><strong>WebSocket</strong> — hai chiều với tần suất cao: chat, cùng soạn thảo, game. Bạn tự sở hữu giao thức.</li>
</ul>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Polling, SSE hay WebSocket cho luồng thông báo?”</strong> SSE: một chiều, thân thiện với HTTP, nối lại bằng Last-Event-ID. Đo được: polling 2 s = trễ trung bình 1,1 s và 1.500 request rỗng cho 100 client trong 30 s.</li>
  <li><strong>“Luồng chạy ở máy mình mà lên production thì không.”</strong> Bị giữ đệm: nén mà không flush, proxy_buffering của nginx, CDN. Thử với Accept-Encoding: gzip, đừng chỉ dùng curl trơn.</li>
  <li><strong>“Xác thực WebSocket thế nào?”</strong> Vé ngắn hạn dùng một lần lấy từ endpoint có xác thực, kiểm trước khi nâng cấp; không bao giờ để token sống lâu trong URL.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>perf/realtime.mjs</code> với polling mỗi 500 ms. Độ trễ và số request thay đổi thế nào?</li>
  <li>Mở luồng SSE trong một trang web bằng <code>new EventSource('/v2/events/stream?ticket=…')</code>, tắt LabFlow 10 s rồi bật lại. Xem lượt nối lại trong DevTools → Network.</li>
  <li>Thêm bộ lọc <code>labId</code> cho <code>/v2/events/stream</code> để TV của lab_1 chỉ nhận lab_1. Phần phát bù có theo bộ lọc không?</li>
</ol>
<p><strong>Đạt khi:</strong> luồng có lọc nối lại sau khi khởi động lại mà không lỡ cũng không lặp sự kiện nào của phòng đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long polling (hỏi rồi chờ)</span><span class="v">Server giữ request mở tới khi có tin hoặc hết giờ.</span></div>
  <div class="kv"><span class="k">Server-Sent Events (sự kiện từ server)</span><span class="v">Một response HTTP không kết thúc gồm các dòng id/event/data, server → client.</span></div>
  <div class="kv"><span class="k">Last-Event-ID</span><span class="v">Header client gửi khi nối lại để server phát bù phần đã lỡ.</span></div>
  <div class="kv"><span class="k">WebSocket</span><span class="v">Kết nối hai chiều tạo bằng nâng cấp HTTP (101).</span></div>
  <div class="kv"><span class="k">Heartbeat (nhịp tim)</span><span class="v">Thông điệp nhỏ (“: ping”) giữ cho kết nối im lặng không bị cắt.</span></div>
  <div class="kv"><span class="k">Ticket (vé)</span><span class="v">Thông tin xác thực ngắn hạn, dùng một lần, cho kết nối không gửi được header.</span></div>
  <div class="kv"><span class="k">Fan-out (phát tán)</span><span class="v">Đưa một sự kiện tới client trên mọi instance (ở đây qua Redis Stream).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cùng 30 sự kiện: polling 2 s trễ p50 1,1 s; long polling, SSE, WebSocket 0–1 ms.</li>
  <li>100 client ngồi chờ 30 s: polling 1.500 request, long polling và SSE 100.</li>
  <li>Nối lại SSE: không Last-Event-ID mất lặng lẽ 5 sự kiện; có nó đủ 7/7; quá cũ ⇒ <code>reset</code> (polling: 410).</li>
  <li>Nén mà không <code>res.flush()</code>: trình duyệt thấy 0/8 sự kiện trong khi curl vẫn chạy.</li>
  <li>Vé dùng một lần 30 s cho EventSource/WebSocket; phát tán qua Redis Stream: 0 → 10/10 trên hai instance.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — Designing webhooks (1): sending — signatures, retries and a delivery log|||10.5 — Thiết kế webhook (1): bên gửi — chữ ký, thử lại và nhật ký giao',
      slug: 'api-10-4-webhook',
      type: 'LESSON',
      isFreePreview: true,
      description: 'URL webhook là mục tiêu SSRF (422 cho http và địa chỉ nội bộ); secret hiện một lần; bộ điều phối từ stream sự kiện, id thông điệp chống xếp trùng; ký Standard Webhooks; bên nhận sập 3 lần ⇒ thử lại lùi dần có jitter, lần 4 thành công, nhật ký giao; webhooks trong OpenAPI 3.1.',
      content: `${G105}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Designing webhooks (1): sending — signatures, retries and a delivery log</h2>
<p class="lead">The department's system wants to know when a booking is cancelled. It could poll <code>/v2/events</code> forever (10.4 counted the cost), or LabFlow could <em>call it</em>: an HTTP POST to a URL the department registered. That call is a <strong>webhook</strong>. It looks like an ordinary request, but now LabFlow is the client, the receiver is someone else's server on the internet, and every question of Chapters 5–6 comes back reversed. After this lesson you can register, sign, send, retry and log webhooks the way Stripe and GitHub do — measured on LabFlow.</p>

<h3>Registering: a URL is an attack surface</h3>
<p>A subscription is a URL plus the event types it wants. LabFlow will send requests to that URL from inside its own network — which is exactly the SSRF of lesson 6.3. So the same checks apply, at registration <em>and</em> again before each delivery (DNS can change in between):</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/webhooks \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"url":"http://localhost:4005/hooks","events":["labflow.booking.created.v1"]}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"URL_NOT_ALLOWED","detail":"Không tải được URL này (https only)"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/webhooks \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"url":"https://169.254.169.254/latest/meta-data","events":["labflow.booking.created.v1"]}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"URL_NOT_ALLOWED","detail":"Không tải được URL này (private address)"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/webhooks \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"url":"https://example.com/hooks","events":["labflow.booking.created.v1"]}' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":403,"code":"FORBIDDEN"}</div>
<p>Plain <code>http</code> and private addresses (here the cloud metadata address 169.254.169.254) are refused with <code>422</code>, and only lab managers may subscribe. For this course <code>LABFLOW_WEBHOOK_ALLOW_LOCAL=1</code> lets <code>http://localhost:4005</code> through, so you can run a receiver on your own machine:</p>
<pre><code class="language-bash">curl -s -i -X POST http://localhost:4000/v2/webhooks \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"url":"http://localhost:4005/hooks","events":["labflow.booking.cancelled.v1"]}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Vary: Origin, Accept-Encoding
LabFlow-Version: 2
Location: /v2/webhooks/wh_mvx5n7hf
Cache-Control: no-store
Content-Type: application/json; charset=utf-8
Content-Length: 238
ETag: W/"ee-i5PPoTpaUJXw/s6+VIA/YNxZlUQ"
Server-Timing: validate;dur=0.06, total;dur=2.28
Date: Sun, 01 Nov 2026 01:32:07 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "wh_mvx5n7hf",
  "url": "http://localhost:4005/hooks",
  "events": [
    "labflow.booking.cancelled.v1"
  ],
  "status": "active",
  "createdAt": "2026-11-01T01:32:07.203Z",
  "secret": "whsec_MjHkjLKi…"
}</div>
<p>The <code>secret</code> (cut with … on this page) is shown <em>once</em>, like the API keys of 6.1, with <code>Cache-Control: no-store</code>. It is the key the receiver will use to check that a request really came from LabFlow.</p>

<h3>From an event to a signed POST</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">event in the stream</span><span class="lz-d">labflow:events (10.3) — written by the API or the worker</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">dispatcher</span><span class="lz-d">one message per event × matching subscription, id msg_…</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">delivery queue</span><span class="lz-d">BullMQ: attempts, exponential backoff with jitter</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">sender</span><span class="lz-d">sign, POST with a 5 s timeout, record the attempt</span></div>
</div>
<p>The dispatcher reads the event stream through its own consumer group and turns each event into one message per subscription. The message id is derived from the event id and the subscription, and it is used as the BullMQ <code>jobId</code> — so if the dispatcher reads the same event twice (10.3 showed it will), the second <code>add</code> is ignored (<code>src/worker.js</code>, about 20 lines). It also filters by owner: an <code>export.completed</code> event (from 10.1) goes only to webhooks of the person who started the export. The sender signs each attempt with <strong>Standard Webhooks</strong> — the scheme of Svix, close to Stripe's — HMAC-SHA256 over <code>id.timestamp.body</code>:</p>
<pre><code class="language-javascript">export function sign(secret, id, ts, body) {
  return &#96;v1,\${createHmac('sha256', keyOf(secret)).update(&#96;\${id}.\${ts}.\${body}&#96;).digest('base64')}&#96;;
}

export function signedHeaders(secret, id, body, ts = Math.floor(Date.now() / 1000)) {
  return { 'webhook-id': id, 'webhook-timestamp': String(ts), 'webhook-signature': sign(secret, id, ts, body) };
}

// Bên NHẬN: body phải là đúng chuỗi byte đã ký (express.raw, KHÔNG express.json rồi JSON.stringify lại)
export function verify(secret, headers, body, { toleranceSec = 300, now = Date.now() } = {}) {
  const id = headers['webhook-id'], ts = Number(headers['webhook-timestamp']), sigs = headers['webhook-signature'];
  if (!id || !ts || !sigs) return { ok: false, reason: 'missing headers' };
  if (Math.abs(now / 1000 - ts) &gt; toleranceSec) return { ok: false, reason: 'timestamp outside tolerance' };   // chống phát lại
  const expected = Buffer.from(sign(secret, id, ts, body).slice(3), 'base64');
  for (const s of sigs.split(' ')) {                         // có thể nhiều chữ ký (đang xoay khoá)
    const [ver, b64] = s.split(',');
    const got = Buffer.from(b64 ?? '', 'base64');
    if (ver === 'v1' &amp;&amp; got.length === expected.length &amp;&amp; timingSafeEqual(got, expected)) return { ok: true, id };
  }
  return { ok: false, reason: 'bad signature' };
}</code></pre>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","period":{"start":"2026-11-20T01:00:00Z","end":"2026-11-20T03:00:00Z"}}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">sleep 1; cat recv.log</code></pre>
<div class="out">bên nhận webhook ở :4005 {
  VERIFY: true,
  DEDUPE: true,
  ORDER: true,
  ASYNC: false,
  SLOW_MS: 0,
  failFirst: 0
}
✓ msg_1793496727230-0_wh_mvx5n… labflow.booking.created.v1 bk_1 v1</div>
<pre><code class="language-bash">jq '.headers | {"content-type", "user-agent", "webhook-id", "webhook-timestamp", "webhook-signature"}' dump.json</code></pre>
<div class="out">{
  "content-type": "application/json",
  "user-agent": "LabFlow-Webhooks/1.0",
  "webhook-id": "msg_1793496727230-0_wh_mvx5n6sx",
  "webhook-timestamp": "1793496727",
  "webhook-signature": "v1,U77XGBo4UR95…"
}</div>
<p>The subscription made when the receiver was started listens for <code>created</code>, <code>cancelled</code> and <code>export.completed</code>, so An's new booking arrived as <code>labflow.booking.created.v1</code>. Three headers carry the security: <code>webhook-id</code> (the same on every retry of this message — the receiver's deduplication key), <code>webhook-timestamp</code> (seconds; signed, so it cannot be changed), and <code>webhook-signature</code> (<code>v1,</code> + base64; several can be sent separated by spaces while you rotate secrets).</p>
<a class="link-card" href="https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Standard Webhooks specification (read 1 Nov 2026)</span><span class="lc-sub">webhook-id / webhook-timestamp / webhook-signature; sign msg_id.timestamp.payload with HMAC-SHA256; secrets whsec_ + base64 (24–64 bytes); retries with exponential backoff and jitter over days; 410 Gone ⇒ disable the endpoint; block internal networks (SSRF).</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>When the receiver is down: retries you can see</h3>
<p>The receiver is under maintenance and answers <code>503</code> three times (<code>FAIL_FIRST=3</code>). For the demo the worker starts its backoff at 1 s (in production 30 s) with 50% jitter:</p>
<pre><code class="language-javascript">  const sender = new Worker('labflow-webhooks', async (job) =&gt; {
    const { subId, msgId, event } = job.data;
    const { rows: [s] } = await db.query('SELECT * FROM webhook_subscriptions WHERE id = $1', [subId]);
    if (!s || s.status !== 'active') return { skipped: true };
    const body = JSON.stringify(event);
    const t0 = performance.now();
    let status = null, error = null;
    try {
      await assertPublicUrl(s.url);                                     // kiểm lại lúc GỬI: DNS có thể đã đổi
      const r = await fetch(s.url, { method: 'POST', body, redirect: 'error', signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'content-type': 'application/json', 'user-agent': 'LabFlow-Webhooks/1.0', ...signedHeaders(s.secret, msgId, body) } });
      status = r.status;
      await r.body?.cancel();
    } catch (e) { error = e.name === 'TimeoutError' ? &#96;timeout \${TIMEOUT_MS} ms&#96; : (e.cause?.code ?? e.message); }
    const ms = Math.round(performance.now() - t0);
    await db.query(&#96;INSERT INTO webhook_deliveries (msg_id, subscription_id, event_type, attempt, status_code, error, duration_ms)
      VALUES ($1, $2, $3, $4, $5, $6, $7)&#96;, [msgId, subId, event.type, job.attemptsMade + 1, status, error, ms]);
    log(&#96;webhook \${msgId.slice(0, 32)}… lần \${job.attemptsMade + 1}: \${status ?? error} (\${ms} ms)&#96;);
    if (status &gt;= 200 &amp;&amp; status &lt; 300) return { status };
    if (status === 410) {                                               // bên nhận nói "đừng gửi nữa" ⇒ tắt đăng ký, không thử lại
      await db.query("UPDATE webhook_subscriptions SET status = 'disabled' WHERE id = $1", [subId]);
      throw new UnrecoverableError('410 Gone: subscription disabled');
    }
    throw new Error(error ?? &#96;HTTP \${status}&#96;);                         // lỗi khác ⇒ BullMQ thử lại theo backoff
  }, { connection, concurrency: 10 });</code></pre>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","period":{"start":"2026-11-20T01:00:00Z","end":"2026-11-20T03:00:00Z"}}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">sleep 12; curl -s http://localhost:4000/v2/webhooks/$(jq -r .id wh.json)/deliveries -H 'Authorization: Bearer tok_lan' | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs, at}'</code></pre>
<div class="out">{"attempt":1,"status":503,"error":null,"durationMs":22,"at":"2026-11-01T01:17:06.874Z"}
{"attempt":2,"status":503,"error":null,"durationMs":2,"at":"2026-11-01T01:17:07.664Z"}
{"attempt":3,"status":503,"error":null,"durationMs":2,"at":"2026-11-01T01:17:09.490Z"}
{"attempt":4,"status":204,"error":null,"durationMs":2,"at":"2026-11-01T01:17:12.223Z"}</div>
<pre><code class="language-bash">grep -E 'webhook msg' worker-w1.log</code></pre>
<div class="out">01:17:06.875 [w1] webhook msg_1793495826841-0_wh_mvx53w31… lần 1: 503 (22 ms)
01:17:07.665 [w1] webhook msg_1793495826841-0_wh_mvx53w31… lần 2: 503 (2 ms)
01:17:09.490 [w1] webhook msg_1793495826841-0_wh_mvx53w31… lần 3: 503 (2 ms)
01:17:12.224 [w1] webhook msg_1793495826841-0_wh_mvx53w31… lần 4: 204 (2 ms)</div>
<p>Gaps of 0.8 s, 1.8 s and 2.7 s: roughly 1, 2 and 4 s, each shortened by up to half at random so that a thousand receivers that failed together do not all retry at the same instant (the jitter of 5.2). The fourth attempt got <code>204</code>. Just as important is the endpoint that showed it: <code>GET /v2/webhooks/{id}/deliveries</code>. When the department asks “why didn't we get the cancellation?”, you answer with status codes and timestamps, not with guesses — Stripe and GitHub both have such a page for exactly this reason.</p>
<p>What LabFlow promises (written in <code>openapi.yaml</code> and <code>docs/slo.md</code>):</p>
<ul>
  <li><strong>At least once.</strong> 8 attempts within about an hour (gaps of 30 s, 1, 2, 4, 8, 16 and 32 min, each shortened by up to half); Stripe retries for up to three days, the Standard Webhooks example schedule spans 75 hours. Longer schedules forgive longer outages.</li>
  <li><strong>Answer within 5 s.</strong> Slower counts as a failure and is retried (GitHub uses 10 s; the Standard Webhooks spec recommends 15–30 s). Lesson 10.6 shows what a slow receiver costs.</li>
  <li><strong>410 Gone</strong> means “stop”: LabFlow disables the subscription instead of retrying.</li>
  <li><strong>No order guarantee</strong>; use <code>data.version</code>. <strong>Redirects are not followed</strong> (<code>redirect: 'error'</code>), so a 302 cannot lead into the internal network.</li>
</ul>

<h3>Webhooks in the contract: OpenAPI 3.1</h3>
<p>OpenAPI 3.1 has a top-level <code>webhooks</code> section for requests the API <em>sends</em>. LabFlow's <code>openapi.yaml</code> 2.3.0 documents the headers, the body (the CloudEvents schema of 10.3) and the meaning of each answer:</p>
<pre><code class="language-yaml">webhooks:
  bookingEvent:
    post:
      summary: What LabFlow POSTs to your endpoint
      parameters:
        - { name: webhook-id, in: header, required: true, schema: { type: string, pattern: '^msg_' } }
        - { name: webhook-timestamp, in: header, required: true, schema: { type: string, pattern: '^\\d+$' } }
        - { name: webhook-signature, in: header, required: true, schema: { type: string, pattern: '^v1,' } }
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/Event' }
      responses:
        '202': { description: 'Received; will be processed later (recommended)' }
        '410': { description: Stop sending — LabFlow disables the subscription }</code></pre>
<a class="link-card" href="/courses/nodejs/learn?lessonSlug=nodejs-13-3-thu-lai-va-idempotent" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper: Node.js course, lesson 13.3 — retries, backoff and the charge that ran three times</span><span class="lc-sub">The queue mechanics behind the delivery worker: attempts, backoff strategies, and why every retried task must be idempotent. Here the retried task is an HTTP call to someone else's server.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Design webhooks for our API.”</strong> Registration with HTTPS-only, SSRF checks and a secret shown once; per-message id; HMAC signature with timestamp; queue with exponential backoff + jitter; delivery log; 410 to unsubscribe; no ordering, use versions.</li>
  <li><strong>“Why not just call the URL from the request handler?”</strong> The receiver may be slow or down; the user's request would wait or fail; there would be no retry and no record. Webhooks go through a queue.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Make the receiver answer <code>410</code> (add a <code>GONE=1</code> mode) and check that the subscription becomes <code>disabled</code> after one attempt.</li>
  <li>Add <code>POST /v2/webhooks/{id}/rotate</code>: create a new secret, sign with <em>both</em> for 24 h (two signatures in one header), then only the new one.</li>
  <li>Add <code>POST /v2/webhooks/{id}/test</code> that sends a <code>labflow.webhook.test.v1</code> event to that subscription only.</li>
</ol>
<p><strong>Done when:</strong> during the rotation window, receivers that know either secret accept the same delivery.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Webhook</span><span class="v">An HTTP request the API sends to a URL the subscriber registered.</span></div>
  <div class="kv"><span class="k">Subscription</span><span class="v">URL + event types + secret, owned by one user.</span></div>
  <div class="kv"><span class="k">HMAC signature</span><span class="v">A keyed hash of id.timestamp.body that only secret holders can produce.</span></div>
  <div class="kv"><span class="k">webhook-id</span><span class="v">Stays the same across retries of one message; the receiver dedupes by it.</span></div>
  <div class="kv"><span class="k">Jitter</span><span class="v">Randomness in retry delays so failed receivers are not retried in lockstep.</span></div>
  <div class="kv"><span class="k">Delivery log</span><span class="v">Every attempt with status, error and duration, visible to the subscriber.</span></div>
  <div class="kv"><span class="k">Secret rotation</span><span class="v">Signing with old and new secrets for a while, then only the new one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Webhook URLs are SSRF targets: HTTPS only, no private addresses, checked at registration and at delivery, no redirects.</li>
  <li>Event stream → one message per subscription (msg id = BullMQ jobId, so re-reading cannot double-queue) → signed POST.</li>
  <li>Standard Webhooks headers: id (dedupe), timestamp (replay window), signature (v1,HMAC-SHA256 of id.timestamp.body).</li>
  <li>Receiver down: 503, 503, 503, then 204 — gaps 0.8 / 1.8 / 2.7 s; every attempt visible in <code>/deliveries</code>.</li>
  <li>The contract states: at least once, 5 s to answer, 410 = stop, no order — and lives in OpenAPI 3.1 <code>webhooks</code>.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Thiết kế webhook (1): bên gửi — chữ ký, thử lại và nhật ký giao</h2>
<p class="lead">Hệ thống của phòng đào tạo muốn biết khi một lượt đặt bị huỷ. Nó có thể hỏi <code>/v2/events</code> mãi mãi (bài 10.4 đã đếm cái giá), hoặc LabFlow có thể <em>gọi nó</em>: một request POST tới URL mà phòng đào tạo đã đăng ký. Lời gọi đó là <strong>webhook</strong>. Trông như request bình thường, nhưng giờ LabFlow là client, bên nhận là server của người khác ngoài Internet, và mọi câu hỏi của Chương 5–6 quay lại theo chiều ngược. Học xong bài này bạn đăng ký, ký, gửi, thử lại và ghi nhật ký webhook theo cách Stripe và GitHub làm — đo trên LabFlow.</p>

<h3>Đăng ký: một URL là một bề mặt tấn công</h3>
<p>Một đăng ký (subscription) là một URL cộng các loại sự kiện nó muốn. LabFlow sẽ gửi request tới URL đó từ bên trong mạng của chính mình — đúng kiểu SSRF của bài 6.3. Nên áp đúng những phép kiểm đó, lúc đăng ký <em>và</em> lại trước mỗi lần giao (DNS có thể đổi ở giữa):</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/webhooks \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"url":"http://localhost:4005/hooks","events":["labflow.booking.created.v1"]}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"URL_NOT_ALLOWED","detail":"Không tải được URL này (https only)"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/webhooks \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"url":"https://169.254.169.254/latest/meta-data","events":["labflow.booking.created.v1"]}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"URL_NOT_ALLOWED","detail":"Không tải được URL này (private address)"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/webhooks \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"url":"https://example.com/hooks","events":["labflow.booking.created.v1"]}' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":403,"code":"FORBIDDEN"}</div>
<p><code>http</code> trơn và địa chỉ nội bộ (ở đây địa chỉ metadata của đám mây 169.254.169.254) bị từ chối bằng <code>422</code>, và chỉ quản lý phòng lab được đăng ký. Trong khoá học, <code>LABFLOW_WEBHOOK_ALLOW_LOCAL=1</code> cho <code>http://localhost:4005</code> đi qua để bạn chạy bên nhận ngay trên máy mình:</p>
<pre><code class="language-bash">curl -s -i -X POST http://localhost:4000/v2/webhooks \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"url":"http://localhost:4005/hooks","events":["labflow.booking.cancelled.v1"]}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Vary: Origin, Accept-Encoding
LabFlow-Version: 2
Location: /v2/webhooks/wh_mvx5n7hf
Cache-Control: no-store
Content-Type: application/json; charset=utf-8
Content-Length: 238
ETag: W/"ee-i5PPoTpaUJXw/s6+VIA/YNxZlUQ"
Server-Timing: validate;dur=0.06, total;dur=2.28
Date: Sun, 01 Nov 2026 01:32:07 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "wh_mvx5n7hf",
  "url": "http://localhost:4005/hooks",
  "events": [
    "labflow.booking.cancelled.v1"
  ],
  "status": "active",
  "createdAt": "2026-11-01T01:32:07.203Z",
  "secret": "whsec_MjHkjLKi…"
}</div>
<p><code>secret</code> (cắt bằng … trên trang này) chỉ hiện <em>một lần</em>, như API key ở bài 6.1, kèm <code>Cache-Control: no-store</code>. Đó là khoá bên nhận dùng để kiểm một request có thật sự đến từ LabFlow hay không.</p>

<h3>Từ một sự kiện tới một POST có chữ ký</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">sự kiện trong stream</span><span class="lz-d">labflow:events (10.3) — do API hoặc worker ghi</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">bộ điều phối</span><span class="lz-d">mỗi sự kiện × mỗi đăng ký khớp = một thông điệp, id msg_…</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">hàng đợi giao</span><span class="lz-d">BullMQ: số lần thử, backoff luỹ thừa có jitter</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">bên gửi</span><span class="lz-d">ký, POST với timeout 5 s, ghi lại lần thử</span></div>
</div>
<p>Bộ điều phối (dispatcher) đọc stream sự kiện qua consumer group riêng của nó và biến mỗi sự kiện thành một thông điệp cho mỗi đăng ký. Id thông điệp suy ra từ id sự kiện và đăng ký, và được dùng làm <code>jobId</code> của BullMQ — nên nếu bộ điều phối đọc cùng sự kiện hai lần (bài 10.3 cho thấy chuyện đó sẽ xảy ra), lần <code>add</code> thứ hai bị bỏ qua (<code>src/worker.js</code>, khoảng 20 dòng). Nó còn lọc theo chủ: sự kiện <code>export.completed</code> (của bài 10.1) chỉ tới webhook của người đã bắt đầu việc xuất. Bên gửi ký từng lần thử theo <strong>Standard Webhooks</strong> — cách của Svix, gần với Stripe — HMAC-SHA256 trên <code>id.timestamp.body</code>:</p>
<pre><code class="language-javascript">export function sign(secret, id, ts, body) {
  return &#96;v1,\${createHmac('sha256', keyOf(secret)).update(&#96;\${id}.\${ts}.\${body}&#96;).digest('base64')}&#96;;
}

export function signedHeaders(secret, id, body, ts = Math.floor(Date.now() / 1000)) {
  return { 'webhook-id': id, 'webhook-timestamp': String(ts), 'webhook-signature': sign(secret, id, ts, body) };
}

// Bên NHẬN: body phải là đúng chuỗi byte đã ký (express.raw, KHÔNG express.json rồi JSON.stringify lại)
export function verify(secret, headers, body, { toleranceSec = 300, now = Date.now() } = {}) {
  const id = headers['webhook-id'], ts = Number(headers['webhook-timestamp']), sigs = headers['webhook-signature'];
  if (!id || !ts || !sigs) return { ok: false, reason: 'missing headers' };
  if (Math.abs(now / 1000 - ts) &gt; toleranceSec) return { ok: false, reason: 'timestamp outside tolerance' };   // chống phát lại
  const expected = Buffer.from(sign(secret, id, ts, body).slice(3), 'base64');
  for (const s of sigs.split(' ')) {                         // có thể nhiều chữ ký (đang xoay khoá)
    const [ver, b64] = s.split(',');
    const got = Buffer.from(b64 ?? '', 'base64');
    if (ver === 'v1' &amp;&amp; got.length === expected.length &amp;&amp; timingSafeEqual(got, expected)) return { ok: true, id };
  }
  return { ok: false, reason: 'bad signature' };
}</code></pre>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","period":{"start":"2026-11-20T01:00:00Z","end":"2026-11-20T03:00:00Z"}}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">sleep 1; cat recv.log</code></pre>
<div class="out">bên nhận webhook ở :4005 {
  VERIFY: true,
  DEDUPE: true,
  ORDER: true,
  ASYNC: false,
  SLOW_MS: 0,
  failFirst: 0
}
✓ msg_1793496727230-0_wh_mvx5n… labflow.booking.created.v1 bk_1 v1</div>
<pre><code class="language-bash">jq '.headers | {"content-type", "user-agent", "webhook-id", "webhook-timestamp", "webhook-signature"}' dump.json</code></pre>
<div class="out">{
  "content-type": "application/json",
  "user-agent": "LabFlow-Webhooks/1.0",
  "webhook-id": "msg_1793496727230-0_wh_mvx5n6sx",
  "webhook-timestamp": "1793496727",
  "webhook-signature": "v1,U77XGBo4UR95…"
}</div>
<p>Đăng ký tạo lúc khởi động bên nhận nghe <code>created</code>, <code>cancelled</code> và <code>export.completed</code>, nên lượt đặt mới của An tới dưới dạng <code>labflow.booking.created.v1</code>. Ba header gánh phần an toàn: <code>webhook-id</code> (giống nhau ở mọi lần thử lại của thông điệp này — khoá chống trùng của bên nhận), <code>webhook-timestamp</code> (tính bằng giây; được ký nên không sửa được), và <code>webhook-signature</code> (<code>v1,</code> + base64; gửi được nhiều chữ ký cách nhau bởi dấu cách trong lúc xoay khoá).</p>
<a class="link-card" href="https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: đặc tả Standard Webhooks (đọc ngày 1/11/2026)</span><span class="lc-sub">webhook-id / webhook-timestamp / webhook-signature; ký msg_id.timestamp.payload bằng HMAC-SHA256; secret whsec_ + base64 (24–64 byte); thử lại lùi luỹ thừa có jitter kéo dài nhiều ngày; 410 Gone ⇒ tắt endpoint; chặn mạng nội bộ (SSRF).</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi bên nhận sập: thử lại mà nhìn thấy được</h3>
<p>Bên nhận đang bảo trì và trả <code>503</code> ba lần (<code>FAIL_FIRST=3</code>). Để demo, worker bắt đầu lùi từ 1 s (production 30 s) với jitter 50%:</p>
<pre><code class="language-javascript">  const sender = new Worker('labflow-webhooks', async (job) =&gt; {
    const { subId, msgId, event } = job.data;
    const { rows: [s] } = await db.query('SELECT * FROM webhook_subscriptions WHERE id = $1', [subId]);
    if (!s || s.status !== 'active') return { skipped: true };
    const body = JSON.stringify(event);
    const t0 = performance.now();
    let status = null, error = null;
    try {
      await assertPublicUrl(s.url);                                     // kiểm lại lúc GỬI: DNS có thể đã đổi
      const r = await fetch(s.url, { method: 'POST', body, redirect: 'error', signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'content-type': 'application/json', 'user-agent': 'LabFlow-Webhooks/1.0', ...signedHeaders(s.secret, msgId, body) } });
      status = r.status;
      await r.body?.cancel();
    } catch (e) { error = e.name === 'TimeoutError' ? &#96;timeout \${TIMEOUT_MS} ms&#96; : (e.cause?.code ?? e.message); }
    const ms = Math.round(performance.now() - t0);
    await db.query(&#96;INSERT INTO webhook_deliveries (msg_id, subscription_id, event_type, attempt, status_code, error, duration_ms)
      VALUES ($1, $2, $3, $4, $5, $6, $7)&#96;, [msgId, subId, event.type, job.attemptsMade + 1, status, error, ms]);
    log(&#96;webhook \${msgId.slice(0, 32)}… lần \${job.attemptsMade + 1}: \${status ?? error} (\${ms} ms)&#96;);
    if (status &gt;= 200 &amp;&amp; status &lt; 300) return { status };
    if (status === 410) {                                               // bên nhận nói "đừng gửi nữa" ⇒ tắt đăng ký, không thử lại
      await db.query("UPDATE webhook_subscriptions SET status = 'disabled' WHERE id = $1", [subId]);
      throw new UnrecoverableError('410 Gone: subscription disabled');
    }
    throw new Error(error ?? &#96;HTTP \${status}&#96;);                         // lỗi khác ⇒ BullMQ thử lại theo backoff
  }, { connection, concurrency: 10 });</code></pre>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/v2/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","period":{"start":"2026-11-20T01:00:00Z","end":"2026-11-20T03:00:00Z"}}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">sleep 12; curl -s http://localhost:4000/v2/webhooks/$(jq -r .id wh.json)/deliveries -H 'Authorization: Bearer tok_lan' | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs, at}'</code></pre>
<div class="out">{"attempt":1,"status":503,"error":null,"durationMs":22,"at":"2026-11-01T01:17:06.874Z"}
{"attempt":2,"status":503,"error":null,"durationMs":2,"at":"2026-11-01T01:17:07.664Z"}
{"attempt":3,"status":503,"error":null,"durationMs":2,"at":"2026-11-01T01:17:09.490Z"}
{"attempt":4,"status":204,"error":null,"durationMs":2,"at":"2026-11-01T01:17:12.223Z"}</div>
<pre><code class="language-bash">grep -E 'webhook msg' worker-w1.log</code></pre>
<div class="out">01:17:06.875 [w1] webhook msg_1793495826841-0_wh_mvx53w31… lần 1: 503 (22 ms)
01:17:07.665 [w1] webhook msg_1793495826841-0_wh_mvx53w31… lần 2: 503 (2 ms)
01:17:09.490 [w1] webhook msg_1793495826841-0_wh_mvx53w31… lần 3: 503 (2 ms)
01:17:12.224 [w1] webhook msg_1793495826841-0_wh_mvx53w31… lần 4: 204 (2 ms)</div>
<p>Khoảng cách 0,8 s, 1,8 s và 2,7 s: xấp xỉ 1, 2 và 4 s, mỗi khoảng bị rút ngẫu nhiên tới một nửa để một nghìn bên nhận cùng hỏng một lúc không bị thử lại cùng một khoảnh khắc (jitter của bài 5.2). Lần thứ tư nhận <code>204</code>. Quan trọng không kém là endpoint đã cho ta thấy điều đó: <code>GET /v2/webhooks/{id}/deliveries</code>. Khi phòng đào tạo hỏi “sao chúng tôi không nhận được tin huỷ?”, bạn trả lời bằng mã trạng thái và mốc giờ, không bằng phỏng đoán — Stripe và GitHub đều có một trang như vậy vì đúng lý do này.</p>
<p>Lời hứa của LabFlow (ghi trong <code>openapi.yaml</code> và <code>docs/slo.md</code>):</p>
<ul>
  <li><strong>Ít nhất một lần.</strong> 8 lần thử trong khoảng một giờ (cách nhau 30 s, 1, 2, 4, 8, 16 và 32 phút, mỗi khoảng rút ngẫu nhiên tới một nửa); Stripe thử lại tới ba ngày, lịch mẫu của Standard Webhooks kéo dài 75 giờ. Lịch càng dài càng tha thứ được sự cố dài.</li>
  <li><strong>Trả lời trong 5 s.</strong> Chậm hơn tính là hỏng và bị thử lại (GitHub dùng 10 s; đặc tả Standard Webhooks khuyên 15–30 s). Bài 10.6 cho thấy bên nhận chậm tốn gì.</li>
  <li><strong>410 Gone</strong> nghĩa là “dừng”: LabFlow tắt đăng ký thay vì thử lại.</li>
  <li><strong>Không đảm bảo thứ tự</strong>; dùng <code>data.version</code>. <strong>Không theo chuyển hướng</strong> (<code>redirect: 'error'</code>), để một 302 không dẫn được vào mạng nội bộ.</li>
</ul>

<h3>Webhook trong hợp đồng: OpenAPI 3.1</h3>
<p>OpenAPI 3.1 có mục <code>webhooks</code> ở cấp cao nhất cho các request mà API <em>gửi đi</em>. <code>openapi.yaml</code> 2.3.0 của LabFlow ghi header, body (lược đồ CloudEvents của bài 10.3) và ý nghĩa của từng câu trả lời:</p>
<pre><code class="language-yaml">webhooks:
  bookingEvent:
    post:
      summary: What LabFlow POSTs to your endpoint
      parameters:
        - { name: webhook-id, in: header, required: true, schema: { type: string, pattern: '^msg_' } }
        - { name: webhook-timestamp, in: header, required: true, schema: { type: string, pattern: '^\\d+$' } }
        - { name: webhook-signature, in: header, required: true, schema: { type: string, pattern: '^v1,' } }
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/Event' }
      responses:
        '202': { description: 'Received; will be processed later (recommended)' }
        '410': { description: Stop sending — LabFlow disables the subscription }</code></pre>
<a class="link-card" href="/courses/nodejs/learn?lessonSlug=nodejs-13-3-thu-lai-va-idempotent" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn: khoá Node.js, bài 13.3 — thử lại, backoff và khoản tiền bị trừ ba lần</span><span class="lc-sub">Cơ chế hàng đợi phía sau worker giao webhook: số lần thử, chiến lược lùi, và vì sao việc được thử lại phải idempotent. Ở đây việc được thử lại là một lời gọi HTTP tới server của người khác.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Thiết kế webhook cho API của chúng tôi.”</strong> Đăng ký chỉ HTTPS, kiểm SSRF, secret hiện một lần; mỗi thông điệp một id; chữ ký HMAC kèm timestamp; hàng đợi với backoff luỹ thừa + jitter; nhật ký giao; 410 để huỷ đăng ký; không đảm bảo thứ tự, dùng version.</li>
  <li><strong>“Sao không gọi URL ngay trong handler của request?”</strong> Bên nhận có thể chậm hoặc sập; request của người dùng phải chờ hoặc hỏng; không có thử lại, không có nhật ký. Webhook phải đi qua hàng đợi.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Cho bên nhận trả <code>410</code> (thêm chế độ <code>GONE=1</code>) và kiểm rằng đăng ký thành <code>disabled</code> sau đúng một lần thử.</li>
  <li>Thêm <code>POST /v2/webhooks/{id}/rotate</code>: tạo secret mới, ký bằng <em>cả hai</em> trong 24 giờ (hai chữ ký trong một header), sau đó chỉ secret mới.</li>
  <li>Thêm <code>POST /v2/webhooks/{id}/test</code> gửi sự kiện <code>labflow.webhook.test.v1</code> chỉ cho đăng ký đó.</li>
</ol>
<p><strong>Đạt khi:</strong> trong thời gian xoay khoá, bên nhận biết secret cũ hay secret mới đều chấp nhận cùng một lần giao.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Webhook</span><span class="v">Request HTTP do API gửi tới URL mà bên đăng ký đã khai.</span></div>
  <div class="kv"><span class="k">Subscription (đăng ký)</span><span class="v">URL + loại sự kiện + secret, thuộc về một người dùng.</span></div>
  <div class="kv"><span class="k">HMAC signature (chữ ký HMAC)</span><span class="v">Băm có khoá của id.timestamp.body mà chỉ người giữ secret tạo được.</span></div>
  <div class="kv"><span class="k">webhook-id</span><span class="v">Giữ nguyên qua các lần thử lại của một thông điệp; bên nhận chống trùng theo nó.</span></div>
  <div class="kv"><span class="k">Jitter (độ lệch ngẫu nhiên)</span><span class="v">Độ ngẫu nhiên trong thời gian chờ để các bên nhận không bị thử lại đồng loạt.</span></div>
  <div class="kv"><span class="k">Delivery log (nhật ký giao)</span><span class="v">Mọi lần thử kèm mã, lỗi, thời gian, bên đăng ký xem được.</span></div>
  <div class="kv"><span class="k">Secret rotation (xoay khoá)</span><span class="v">Ký bằng khoá cũ và mới một thời gian, rồi chỉ khoá mới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>URL webhook là mục tiêu SSRF: chỉ HTTPS, không địa chỉ nội bộ, kiểm lúc đăng ký và lúc giao, không theo chuyển hướng.</li>
  <li>Stream sự kiện → mỗi đăng ký một thông điệp (id thông điệp = jobId của BullMQ, đọc lại không xếp trùng) → POST có chữ ký.</li>
  <li>Header Standard Webhooks: id (chống trùng), timestamp (cửa sổ chống phát lại), signature (v1,HMAC-SHA256 của id.timestamp.body).</li>
  <li>Bên nhận sập: 503, 503, 503 rồi 204 — cách nhau 0,8 / 1,8 / 2,7 s; mọi lần thử hiện trong <code>/deliveries</code>.</li>
  <li>Hợp đồng ghi rõ: ít nhất một lần, 5 s để trả lời, 410 = dừng, không thứ tự — và nằm trong mục <code>webhooks</code> của OpenAPI 3.1.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 10.6 (bài MỚI) ─────────────────────────── */
    {
      title: '10.6 — Designing webhooks (2): receiving — raw bodies, replays, fast answers and order|||10.6 — Thiết kế webhook (2): bên nhận — body thô, phát lại, trả lời nhanh và thứ tự',
      slug: 'api-10-4-nhan-webhook',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kiểm chữ ký trên body thô (JSON dựng lại làm lệch chữ ký); request bị bắt: sửa body 401, cùng id 200 trùng, quá cửa sổ 401; bên nhận chậm 3 s: 5 lần thử 5 email, chống trùng 1 email, trả 202 trước 1 lần trong 21 ms; tin huỷ tới trước tin đặt và phép so version.',
      content: `${G106}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Designing webhooks (2): receiving — raw bodies, replays, fast answers and order</h2>
<p class="lead">Sooner or later your API is on the <em>other</em> side: a payment provider, GitHub or LabFlow calls an endpoint you wrote. That endpoint is public, anyone can POST to it, the same message may arrive several times, in the wrong order, and the sender gives up if you are slow. After this lesson you can write a receiver that rejects forgeries and replays, never does the same work twice, answers in milliseconds and keeps the right final state — each habit switched off once to measure what it prevents.</p>

<h3>The receiver's checklist</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">raw body</span><span class="lz-d">the exact bytes that were signed</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">signature + time</span><span class="lz-d">HMAC matches, timestamp within 5 min ⇒ else 401</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">seen this webhook-id?</span><span class="lz-d">yes ⇒ answer 2xx and stop</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">answer 2xx now</span><span class="lz-d">store/queue the event, work later</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">apply if newer</span><span class="lz-d">compare data.version; older news is dropped</span></div>
</div>
<p><code>webhooks/receiver.mjs</code> is the department's receiver on port 4005. Each step is an environment switch (<code>VERIFY</code>, <code>DEDUPE</code>, <code>ASYNC</code>, <code>ORDER</code>), so we can break one at a time:</p>
<pre><code class="language-javascript">app.post('/hooks', express.raw({ type: 'application/json' }), async (req, res) =&gt; {
  stats.received++;
  const body = req.body.toString('utf8');                    // ĐÚNG chuỗi byte đã ký
  if (VERIFY) {
    const v = verify(SECRET, req.headers, body, { toleranceSec: TOLERANCE });
    if (!v.ok) { stats.rejected++; console.log(&#96;✗ từ chối: \${v.reason}&#96;); return res.status(401).json({ error: v.reason }); }
  }
  if (failFirst &gt; 0) { failFirst--; stats.failedOnPurpose++; return res.status(503).end(); }
  const id = req.get('webhook-id');
  if (process.env.DUMP) writeFileSync(process.env.DUMP, JSON.stringify({ headers: req.headers, body }));
  if (DEDUPE &amp;&amp; seen.has(id)) { stats.duplicates++; return res.status(200).json({ duplicate: true }); }   // trùng ⇒ vẫn 2xx
  if (DEDUPE) seen.add(id);
  const event = JSON.parse(body);
  console.log(&#96;✓ \${id.slice(0, 28)}… \${event.type} \${event.subject ?? ''} v\${event.data?.version ?? '-'}&#96;);
  if (ASYNC) { setImmediate(() =&gt; handle(event).catch(console.error)); return res.status(202).end(); }   // nhận trước, làm sau
  await handle(event);
  res.status(204).end();
});</code></pre>

<h3>Step 1: verify the bytes you received, not the object you parsed</h3>
<p><code>express.raw()</code> keeps the body as bytes. The common mistake is <code>express.json()</code> followed by <code>JSON.stringify(req.body)</code> to “get the body back”. That works as long as the sender happens to write JSON exactly as Node does — until a sender written in Python (whose <code>json.dumps</code> escapes non-ASCII characters and adds spaces by default) calls you:</p>
<pre><code class="language-bash">node webhooks/reserialize.mjs</code></pre>
<div class="out">body thô        : {"type": "labflow.booking.created.v1", "data": {"labName": "Ph\\u00f2ng Lab M\\u1ea1ng"}}
parse + stringify: {"type":"labflow.booking.created.v1","data":{"labName":"Phòng Lab Mạng"}}
chữ ký trên body thô v1,ZLrEsD7a9yl… · trên bản dựng lại v1,wAoADndHaYw… ⇒ LỆCH</div>
<p>Same data, different bytes, different signature: every legitimate webhook from that sender is rejected, and the error only shows up for Vietnamese lab names. The Standard Webhooks spec and Stripe say the same thing in bold: verify the raw body.</p>

<h3>Step 2–3: forgeries and replays</h3>
<p>An attacker who captured one real delivery (the receiver's <code>DUMP</code> file plays the captured request) tries three things, with <code>TOLERANCE_SEC=10</code> so we do not wait five minutes:</p>
<pre><code class="language-bash">node webhooks/replay.mjs ../dump.json --tamper</code></pre>
<div class="out">body đã sửa (chữ ký ký 1 s trước) ⇒ 401 {"error":"bad signature"}</div>
<pre><code class="language-bash">node webhooks/replay.mjs ../dump.json</code></pre>
<div class="out">gửi lại y nguyên (chữ ký ký 1 s trước) ⇒ 200 {"duplicate":true}</div>
<pre><code class="language-bash">sleep 10; cd labflow-ch10 &amp;&amp; node webhooks/replay.mjs ../dump.json</code></pre>
<div class="out">gửi lại y nguyên (chữ ký ký 11 s trước) ⇒ 401 {"error":"timestamp outside tolerance"}</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Changed body, old signature ⇒ 401</span><span class="lz-lnote">the HMAC covers the body; compare with timingSafeEqual, not ===</span></div>
  <div class="lz-layer"><span class="lz-lname">Same request again, 1 s later ⇒ 200 duplicate</span><span class="lz-lnote">valid signature, but this webhook-id was already processed — answer 2xx so the sender stops</span></div>
  <div class="lz-layer"><span class="lz-lname">Same request, 11 s later ⇒ 401</span><span class="lz-lnote">the timestamp is signed too, so it cannot be refreshed; outside the window ⇒ replay refused</span></div>
</div>
<p>The two defences need each other: the time window limits how long a captured request is useful, and the id store covers replays inside the window. The store must remember ids at least as long as the window — in production a table with a unique key, written in the same transaction as the effect (10.3), kept for the sender's whole retry period.</p>
<a class="link-card" href="https://docs.stripe.com/webhooks" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Stripe — Receive Stripe events in your webhook endpoint (read 1 Nov 2026)</span><span class="lc-sub">Use the raw body; libraries default to a 5-minute tolerance against replay attacks; return 2xx quickly before complex logic; handle duplicate events by logging event ids; Stripe does not guarantee delivery order; retries for up to three days.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Step 4: answer first, work later — measured three ways</h3>
<p>The receiver's work takes 3 s (it emails the lecturer and calls another system). LabFlow waits 2 s (5 s in production) and allows 5 attempts:</p>
<pre><code class="language-bash">sleep 28; curl -s http://localhost:4000/v2/webhooks/$(jq -r .id wh.json)/deliveries -H 'Authorization: Bearer tok_lan' | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs}'</code></pre>
<div class="out">{"attempt":1,"status":null,"error":"timeout 2000 ms","durationMs":2003}
{"attempt":2,"status":null,"error":"timeout 2000 ms","durationMs":2003}
{"attempt":3,"status":null,"error":"timeout 2000 ms","durationMs":2002}
{"attempt":4,"status":null,"error":"timeout 2000 ms","durationMs":2001}
{"attempt":5,"status":null,"error":"timeout 2000 ms","durationMs":2004}</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c .stats</code></pre>
<div class="out">{"received":5,"rejected":0,"duplicates":0,"emails":5,"processed":5,"stale":0,"failedOnPurpose":0}</div>
<pre><code class="language-bash">grep -E 'BỎ' worker-w1.log</code></pre>
<div class="out">01:19:08.433 [w1] webhook msg_1793495925400-0_wh_mvx5604z BỎ sau 5 lần: timeout 2000 ms</div>
<p>Every attempt timed out, so LabFlow retried — but the receiver <em>did</em> finish each one after the sender had hung up. Five attempts, five emails to the lecturer, and LabFlow finally marked the message failed. Both sides did their job; together they sent five emails and recorded a failure. Turn deduplication on (still slow):</p>
<pre><code class="language-bash">sleep 8; curl -s http://localhost:4000/v2/webhooks/$(jq -r .id wh.json)/deliveries -H 'Authorization: Bearer tok_lan' | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs}'</code></pre>
<div class="out">{"attempt":1,"status":null,"error":"timeout 2000 ms","durationMs":2004}
{"attempt":2,"status":200,"error":null,"durationMs":7}</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c .stats</code></pre>
<div class="out">{"received":2,"rejected":0,"duplicates":1,"emails":1,"processed":1,"stale":0,"failedOnPurpose":0}</div>
<p>Attempt 2 found the id already seen and answered in 7 ms: one email. Better — but the sender still waited 2 s and logged a failure for nothing. Now answer first and work afterwards (<code>ASYNC=1</code>, a <code>202</code> before the 3-second job):</p>
<pre><code class="language-bash">sleep 5; curl -s http://localhost:4000/v2/webhooks/$(jq -r .id wh.json)/deliveries -H 'Authorization: Bearer tok_lan' | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs}'</code></pre>
<div class="out">{"attempt":1,"status":202,"error":null,"durationMs":21}</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c .stats</code></pre>
<div class="out">{"received":1,"rejected":0,"duplicates":0,"emails":1,"processed":1,"stale":0,"failedOnPurpose":0}</div>
<p>One attempt, 21 ms, one email. In production “afterwards” means a queue (10.2), not <code>setImmediate</code>: a receiver that answers 202 and then crashes must still find the event. GitHub expects an answer within 10 s; LabFlow says 5 s; either way the rule is the same — accept fast, then process.</p>
<a class="link-card" href="https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: GitHub Docs — Best practices for using webhooks (read 1 Nov 2026)</span><span class="lc-sub">“Your server should respond with a 2XX response within 10 seconds of receiving a webhook delivery”, otherwise the delivery counts as failed; X-GitHub-Delivery is unique per event and stays the same on redelivery — use it to deduplicate.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Step 5: the cancellation that arrived before the booking</h3>
<p>An books and cancels at once. The receiver fails its first request (<code>FAIL_FIRST=1</code>), so <code>booking.created</code> is retried a second later — after <code>booking.cancelled</code> has already been delivered. First with <code>ORDER=0</code> (last write wins), then with the version check:</p>
<pre><code class="language-bash">sleep 4; grep '✓' recv.log</code></pre>
<div class="out">✓ msg_1793495989883-0_wh_mvx57… labflow.booking.cancelled.v1 bk_1 v2
✓ msg_1793495989863-0_wh_mvx57… labflow.booking.created.v1 bk_1 v1</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c '{bookings, stale: .stats.stale}'</code></pre>
<div class="out">{"bookings":{"bk_1":{"status":"PENDING","version":1}},"stale":0}</div>
<pre><code class="language-bash">sleep 4; grep '✓' recv.log</code></pre>
<div class="out">✓ msg_1793495998569-0_wh_mvx57… labflow.booking.cancelled.v1 bk_1 v2
✓ msg_1793495998551-0_wh_mvx57… labflow.booking.created.v1 bk_1 v1</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c '{bookings, stale: .stats.stale}'</code></pre>
<div class="out">{"bookings":{"bk_1":{"status":"CANCELLED","version":2}},"stale":1}</div>
<p>Both receivers got the same two events in the same wrong order. The naive one ended with <code>PENDING</code> — the department believes the lab is booked when it is free. The careful one kept <code>CANCELLED</code> and counted one stale event, because every booking event carries <code>version</code> (10.3) and older news is dropped:</p>
<pre><code class="language-javascript">async function handle(event) {
  stats.emails++;                                             // tác dụng phụ không rút lại được: gửi email cho giảng viên
  if (SLOW_MS) await sleep(SLOW_MS);                          // gọi API khác, gửi email, ghi CSDL…
  const b = event.data;
  if (b?.id?.startsWith('bk_')) {
    const cur = bookings[b.id];
    if (ORDER &amp;&amp; cur &amp;&amp; cur.version &gt;= b.version) { stats.stale++; return; }   // sự kiện CŨ tới muộn ⇒ bỏ
    bookings[b.id] = { status: b.status, version: b.version };
  }
  stats.processed++;
}</code></pre>
<p>Timestamps are a weak substitute (two events can share a second, as Stripe warns); a per-object version is exact. Without any version, the safe fallback is the thin-event habit: treat the webhook as “something changed” and fetch the current state from the API.</p>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“How do you secure a webhook endpoint?”</strong> HMAC over the raw body with a constant-time compare; signed timestamp with a 5-minute window; dedupe by message id; HTTPS. An IP allow-list is a bonus, not a replacement.</li>
  <li><strong>“The provider says our endpoint keeps timing out.”</strong> Do the work after answering: store the event, answer 2xx, process from a queue. Measured: 5 timeouts and 5 emails became 1 attempt in 21 ms.</li>
  <li><strong>“Events arrive out of order.”</strong> Expected; compare a per-object version, or fetch current state.</li>
</ul>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
  <li>Replace the in-memory <code>seen</code> set with a PostgreSQL table <code>webhook_inbox(id text PRIMARY KEY, received_at timestamptz)</code> and insert the event there before answering 202. Restart the receiver between two deliveries of the same id.</li>
  <li>Process the inbox from a worker that marks rows done in the same transaction as its effect (the same-tx pattern of 10.3).</li>
  <li>Make the receiver accept two secrets at once (for LabFlow's rotation in 10.5's practice).</li>
</ol>
<p><strong>Done when:</strong> killing the receiver at any moment never loses an event and never sends a second email.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Raw body</span><span class="v">The exact bytes received; the only thing a signature can be checked against.</span></div>
  <div class="kv"><span class="k">Replay attack</span><span class="v">Sending a captured valid request again.</span></div>
  <div class="kv"><span class="k">Tolerance window</span><span class="v">How old a signed timestamp may be (commonly 5 minutes).</span></div>
  <div class="kv"><span class="k">Constant-time compare</span><span class="v">timingSafeEqual: comparing without leaking how many bytes matched.</span></div>
  <div class="kv"><span class="k">Inbox / dedupe store</span><span class="v">Ids of processed messages, kept at least as long as the sender retries.</span></div>
  <div class="kv"><span class="k">Acknowledge first</span><span class="v">Answer 2xx as soon as the event is safely stored; process later.</span></div>
  <div class="kv"><span class="k">Stale event</span><span class="v">An event older than the state you already have; dropped by version.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Verify the raw body: re-serialising a Python-style JSON body changed the signature for the same data.</li>
  <li>Captured request: changed body 401, same id within the window 200 duplicate, after the window 401.</li>
  <li>3-second work, 2-second sender timeout: 5 attempts and 5 emails; with dedupe 2 attempts and 1 email; answering 202 first: 1 attempt in 21 ms.</li>
  <li>Cancellation delivered before creation: last-write-wins ended PENDING (wrong); version check kept CANCELLED.</li>
  <li>Dedupe ids live as long as the sender retries and are written with the effect, in one transaction.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>Thiết kế webhook (2): bên nhận — body thô, phát lại, trả lời nhanh và thứ tự</h2>
<p class="lead">Sớm muộn API của bạn sẽ đứng ở phía <em>bên kia</em>: một cổng thanh toán, GitHub hay LabFlow gọi tới endpoint bạn viết. Endpoint đó công khai, ai cũng POST được, cùng một thông điệp có thể tới nhiều lần, sai thứ tự, và bên gửi bỏ cuộc nếu bạn chậm. Học xong bài này bạn viết được bên nhận từ chối được hàng giả và hàng phát lại, không bao giờ làm cùng một việc hai lần, trả lời trong vài mili-giây và giữ đúng trạng thái cuối — mỗi thói quen tắt đi một lần để đo xem nó chặn được gì.</p>

<h3>Danh sách việc của bên nhận</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">body thô</span><span class="lz-d">đúng chuỗi byte đã được ký</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">chữ ký + thời gian</span><span class="lz-d">HMAC khớp, timestamp trong 5 phút ⇒ không thì 401</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">đã gặp webhook-id này?</span><span class="lz-d">rồi ⇒ trả 2xx và dừng</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">trả 2xx ngay</span><span class="lz-d">cất/xếp hàng sự kiện, làm sau</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">áp dụng nếu mới hơn</span><span class="lz-d">so data.version; tin cũ thì bỏ</span></div>
</div>
<p><code>webhooks/receiver.mjs</code> là bên nhận của phòng đào tạo ở cổng 4005. Mỗi bước là một công tắc biến môi trường (<code>VERIFY</code>, <code>DEDUPE</code>, <code>ASYNC</code>, <code>ORDER</code>), để ta làm hỏng từng bước một:</p>
<pre><code class="language-javascript">app.post('/hooks', express.raw({ type: 'application/json' }), async (req, res) =&gt; {
  stats.received++;
  const body = req.body.toString('utf8');                    // ĐÚNG chuỗi byte đã ký
  if (VERIFY) {
    const v = verify(SECRET, req.headers, body, { toleranceSec: TOLERANCE });
    if (!v.ok) { stats.rejected++; console.log(&#96;✗ từ chối: \${v.reason}&#96;); return res.status(401).json({ error: v.reason }); }
  }
  if (failFirst &gt; 0) { failFirst--; stats.failedOnPurpose++; return res.status(503).end(); }
  const id = req.get('webhook-id');
  if (process.env.DUMP) writeFileSync(process.env.DUMP, JSON.stringify({ headers: req.headers, body }));
  if (DEDUPE &amp;&amp; seen.has(id)) { stats.duplicates++; return res.status(200).json({ duplicate: true }); }   // trùng ⇒ vẫn 2xx
  if (DEDUPE) seen.add(id);
  const event = JSON.parse(body);
  console.log(&#96;✓ \${id.slice(0, 28)}… \${event.type} \${event.subject ?? ''} v\${event.data?.version ?? '-'}&#96;);
  if (ASYNC) { setImmediate(() =&gt; handle(event).catch(console.error)); return res.status(202).end(); }   // nhận trước, làm sau
  await handle(event);
  res.status(204).end();
});</code></pre>

<h3>Bước 1: kiểm những byte nhận được, không phải object đã parse</h3>
<p><code>express.raw()</code> giữ body ở dạng byte. Lỗi hay gặp là dùng <code>express.json()</code> rồi <code>JSON.stringify(req.body)</code> để “lấy lại body”. Cách đó chạy được chừng nào bên gửi viết JSON y hệt cách Node viết — cho tới khi một bên gửi viết bằng Python (<code>json.dumps</code> mặc định thoát ký tự ngoài ASCII và thêm dấu cách) gọi bạn:</p>
<pre><code class="language-bash">node webhooks/reserialize.mjs</code></pre>
<div class="out">body thô        : {"type": "labflow.booking.created.v1", "data": {"labName": "Ph\\u00f2ng Lab M\\u1ea1ng"}}
parse + stringify: {"type":"labflow.booking.created.v1","data":{"labName":"Phòng Lab Mạng"}}
chữ ký trên body thô v1,ZLrEsD7a9yl… · trên bản dựng lại v1,wAoADndHaYw… ⇒ LỆCH</div>
<p>Cùng dữ liệu, khác byte, khác chữ ký: mọi webhook hợp lệ từ bên gửi đó đều bị từ chối, và lỗi chỉ lộ ra với tên phòng lab tiếng Việt. Đặc tả Standard Webhooks và Stripe đều in đậm cùng một câu: kiểm trên body thô.</p>

<h3>Bước 2–3: hàng giả và hàng phát lại</h3>
<p>Kẻ tấn công bắt được một lần giao thật (tệp <code>DUMP</code> của bên nhận đóng vai request bị bắt) thử ba việc, với <code>TOLERANCE_SEC=10</code> để khỏi chờ năm phút:</p>
<pre><code class="language-bash">node webhooks/replay.mjs ../dump.json --tamper</code></pre>
<div class="out">body đã sửa (chữ ký ký 1 s trước) ⇒ 401 {"error":"bad signature"}</div>
<pre><code class="language-bash">node webhooks/replay.mjs ../dump.json</code></pre>
<div class="out">gửi lại y nguyên (chữ ký ký 1 s trước) ⇒ 200 {"duplicate":true}</div>
<pre><code class="language-bash">sleep 10; cd labflow-ch10 &amp;&amp; node webhooks/replay.mjs ../dump.json</code></pre>
<div class="out">gửi lại y nguyên (chữ ký ký 11 s trước) ⇒ 401 {"error":"timestamp outside tolerance"}</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Sửa body, giữ chữ ký cũ ⇒ 401</span><span class="lz-lnote">HMAC phủ cả body; so bằng timingSafeEqual, không bằng ===</span></div>
  <div class="lz-layer"><span class="lz-lname">Gửi lại y nguyên, 1 s sau ⇒ 200 duplicate</span><span class="lz-lnote">chữ ký đúng, nhưng webhook-id này đã xử lý — trả 2xx để bên gửi thôi gửi</span></div>
  <div class="lz-layer"><span class="lz-lname">Gửi lại y nguyên, 11 s sau ⇒ 401</span><span class="lz-lnote">timestamp cũng được ký nên không làm mới được; ra ngoài cửa sổ ⇒ từ chối phát lại</span></div>
</div>
<p>Hai lớp phòng thủ cần nhau: cửa sổ thời gian giới hạn một request bị bắt dùng được bao lâu, kho id che những lần phát lại bên trong cửa sổ. Kho phải nhớ id ít nhất lâu bằng cửa sổ — production dùng một bảng có khoá duy nhất, ghi trong cùng transaction với tác dụng (10.3), giữ suốt thời gian bên gửi còn thử lại.</p>
<a class="link-card" href="https://docs.stripe.com/webhooks" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Stripe — Receive Stripe events in your webhook endpoint (đọc ngày 1/11/2026)</span><span class="lc-sub">Dùng body thô; thư viện mặc định cửa sổ 5 phút chống phát lại; trả 2xx thật nhanh trước logic phức tạp; chống trùng bằng cách ghi lại id sự kiện; Stripe không đảm bảo thứ tự giao; thử lại tới ba ngày.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Bước 4: trả lời trước, làm sau — đo ba cách</h3>
<p>Việc của bên nhận mất 3 s (gửi email cho giảng viên và gọi một hệ thống khác). LabFlow chờ 2 s (production 5 s) và cho 5 lần thử:</p>
<pre><code class="language-bash">sleep 28; curl -s http://localhost:4000/v2/webhooks/$(jq -r .id wh.json)/deliveries -H 'Authorization: Bearer tok_lan' | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs}'</code></pre>
<div class="out">{"attempt":1,"status":null,"error":"timeout 2000 ms","durationMs":2003}
{"attempt":2,"status":null,"error":"timeout 2000 ms","durationMs":2003}
{"attempt":3,"status":null,"error":"timeout 2000 ms","durationMs":2002}
{"attempt":4,"status":null,"error":"timeout 2000 ms","durationMs":2001}
{"attempt":5,"status":null,"error":"timeout 2000 ms","durationMs":2004}</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c .stats</code></pre>
<div class="out">{"received":5,"rejected":0,"duplicates":0,"emails":5,"processed":5,"stale":0,"failedOnPurpose":0}</div>
<pre><code class="language-bash">grep -E 'BỎ' worker-w1.log</code></pre>
<div class="out">01:19:08.433 [w1] webhook msg_1793495925400-0_wh_mvx5604z BỎ sau 5 lần: timeout 2000 ms</div>
<p>Lần nào cũng hết giờ, nên LabFlow thử lại — nhưng bên nhận <em>vẫn</em> làm xong từng lần sau khi bên gửi đã cúp máy. Năm lần thử, năm email tới giảng viên, và cuối cùng LabFlow đánh dấu thông điệp là hỏng. Cả hai bên đều làm đúng phần mình; gộp lại thì gửi năm email và ghi một lần thất bại. Bật chống trùng (vẫn chậm):</p>
<pre><code class="language-bash">sleep 8; curl -s http://localhost:4000/v2/webhooks/$(jq -r .id wh.json)/deliveries -H 'Authorization: Bearer tok_lan' | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs}'</code></pre>
<div class="out">{"attempt":1,"status":null,"error":"timeout 2000 ms","durationMs":2004}
{"attempt":2,"status":200,"error":null,"durationMs":7}</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c .stats</code></pre>
<div class="out">{"received":2,"rejected":0,"duplicates":1,"emails":1,"processed":1,"stale":0,"failedOnPurpose":0}</div>
<p>Lần 2 thấy id đã gặp và trả lời trong 7 ms: một email. Khá hơn — nhưng bên gửi vẫn chờ 2 s và ghi một lần hỏng vô ích. Giờ trả lời trước rồi mới làm (<code>ASYNC=1</code>, trả <code>202</code> trước việc 3 giây):</p>
<pre><code class="language-bash">sleep 5; curl -s http://localhost:4000/v2/webhooks/$(jq -r .id wh.json)/deliveries -H 'Authorization: Bearer tok_lan' | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs}'</code></pre>
<div class="out">{"attempt":1,"status":202,"error":null,"durationMs":21}</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c .stats</code></pre>
<div class="out">{"received":1,"rejected":0,"duplicates":0,"emails":1,"processed":1,"stale":0,"failedOnPurpose":0}</div>
<p>Một lần thử, 21 ms, một email. Ở production, “làm sau” nghĩa là một hàng đợi (10.2), không phải <code>setImmediate</code>: bên nhận đã trả 202 rồi sập vẫn phải tìm lại được sự kiện. GitHub đòi trả lời trong 10 s; LabFlow nói 5 s; đằng nào luật cũng vậy — nhận nhanh, xử lý sau.</p>
<a class="link-card" href="https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: GitHub Docs — Best practices for using webhooks (đọc ngày 1/11/2026)</span><span class="lc-sub">“Your server should respond with a 2XX response within 10 seconds of receiving a webhook delivery”, không thì lần giao bị coi là hỏng; X-GitHub-Delivery là duy nhất cho mỗi sự kiện và giữ nguyên khi giao lại — dùng nó để chống trùng.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Bước 5: tin huỷ tới trước tin đặt</h3>
<p>An đặt rồi huỷ ngay. Bên nhận hỏng request đầu tiên (<code>FAIL_FIRST=1</code>), nên <code>booking.created</code> được thử lại một giây sau — lúc <code>booking.cancelled</code> đã giao xong. Lần đầu với <code>ORDER=0</code> (ai ghi sau thắng), rồi với phép so version:</p>
<pre><code class="language-bash">sleep 4; grep '✓' recv.log</code></pre>
<div class="out">✓ msg_1793495989883-0_wh_mvx57… labflow.booking.cancelled.v1 bk_1 v2
✓ msg_1793495989863-0_wh_mvx57… labflow.booking.created.v1 bk_1 v1</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c '{bookings, stale: .stats.stale}'</code></pre>
<div class="out">{"bookings":{"bk_1":{"status":"PENDING","version":1}},"stale":0}</div>
<pre><code class="language-bash">sleep 4; grep '✓' recv.log</code></pre>
<div class="out">✓ msg_1793495998569-0_wh_mvx57… labflow.booking.cancelled.v1 bk_1 v2
✓ msg_1793495998551-0_wh_mvx57… labflow.booking.created.v1 bk_1 v1</div>
<pre><code class="language-bash">curl -s http://localhost:4005/state | jq -c '{bookings, stale: .stats.stale}'</code></pre>
<div class="out">{"bookings":{"bk_1":{"status":"CANCELLED","version":2}},"stale":1}</div>
<p>Hai bên nhận nhận cùng hai sự kiện theo cùng thứ tự sai. Bên ngây thơ kết thúc ở <code>PENDING</code> — phòng đào tạo tin phòng lab đang có người đặt trong khi nó trống. Bên cẩn thận giữ <code>CANCELLED</code> và đếm được một sự kiện cũ, vì sự kiện lượt đặt nào cũng mang <code>version</code> (10.3) và tin cũ bị bỏ:</p>
<pre><code class="language-javascript">async function handle(event) {
  stats.emails++;                                             // tác dụng phụ không rút lại được: gửi email cho giảng viên
  if (SLOW_MS) await sleep(SLOW_MS);                          // gọi API khác, gửi email, ghi CSDL…
  const b = event.data;
  if (b?.id?.startsWith('bk_')) {
    const cur = bookings[b.id];
    if (ORDER &amp;&amp; cur &amp;&amp; cur.version &gt;= b.version) { stats.stale++; return; }   // sự kiện CŨ tới muộn ⇒ bỏ
    bookings[b.id] = { status: b.status, version: b.version };
  }
  stats.processed++;
}</code></pre>
<p>Timestamp là thứ thay thế yếu (hai sự kiện có thể chung một giây, như Stripe cảnh báo); version theo từng đối tượng thì chính xác. Không có version nào, cách lùi an toàn là thói quen của sự kiện mỏng: coi webhook là “có gì đó đã đổi” rồi lấy trạng thái hiện tại từ API.</p>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Bảo vệ endpoint webhook thế nào?”</strong> HMAC trên body thô, so trong thời gian hằng; timestamp được ký với cửa sổ 5 phút; chống trùng theo id thông điệp; HTTPS. Danh sách IP cho phép là phần thêm, không thay được.</li>
  <li><strong>“Nhà cung cấp báo endpoint của ta cứ hết giờ.”</strong> Làm việc sau khi trả lời: cất sự kiện, trả 2xx, xử lý từ hàng đợi. Đo được: 5 lần hết giờ và 5 email thành 1 lần thử trong 21 ms.</li>
  <li><strong>“Sự kiện tới sai thứ tự.”</strong> Chuyện bình thường; so version theo đối tượng, hoặc lấy trạng thái hiện tại.</li>
</ul>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
  <li>Thay tập <code>seen</code> trong RAM bằng bảng PostgreSQL <code>webhook_inbox(id text PRIMARY KEY, received_at timestamptz)</code> và chèn sự kiện vào đó trước khi trả 202. Khởi động lại bên nhận giữa hai lần giao cùng một id.</li>
  <li>Xử lý inbox bằng một worker đánh dấu dòng đã xong trong cùng transaction với tác dụng của nó (mẫu cùng-transaction của bài 10.3).</li>
  <li>Cho bên nhận chấp nhận hai secret cùng lúc (cho bài thực hành xoay khoá của 10.5).</li>
</ol>
<p><strong>Đạt khi:</strong> giết bên nhận vào bất kỳ lúc nào cũng không mất sự kiện nào và không gửi email thứ hai.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Raw body (body thô)</span><span class="v">Đúng chuỗi byte nhận được; thứ duy nhất kiểm chữ ký được.</span></div>
  <div class="kv"><span class="k">Replay attack (tấn công phát lại)</span><span class="v">Gửi lại một request hợp lệ đã bắt được.</span></div>
  <div class="kv"><span class="k">Tolerance window (cửa sổ chấp nhận)</span><span class="v">Timestamp đã ký được phép cũ tới mức nào (thường 5 phút).</span></div>
  <div class="kv"><span class="k">Constant-time compare (so trong thời gian hằng)</span><span class="v">timingSafeEqual: so mà không lộ đã khớp bao nhiêu byte.</span></div>
  <div class="kv"><span class="k">Inbox / kho chống trùng</span><span class="v">Id các thông điệp đã xử lý, giữ ít nhất bằng thời gian bên gửi còn thử lại.</span></div>
  <div class="kv"><span class="k">Acknowledge first (xác nhận trước)</span><span class="v">Trả 2xx ngay khi sự kiện đã cất an toàn; xử lý sau.</span></div>
  <div class="kv"><span class="k">Stale event (sự kiện cũ)</span><span class="v">Sự kiện cũ hơn trạng thái đang có; bỏ nhờ version.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Kiểm trên body thô: dựng lại một body JSON kiểu Python làm đổi chữ ký dù cùng dữ liệu.</li>
  <li>Request bị bắt: sửa body 401, cùng id trong cửa sổ 200 duplicate, ngoài cửa sổ 401.</li>
  <li>Việc 3 giây, bên gửi chờ 2 giây: 5 lần thử và 5 email; có chống trùng 2 lần thử và 1 email; trả 202 trước: 1 lần thử trong 21 ms.</li>
  <li>Tin huỷ giao trước tin đặt: ai ghi sau thắng ra PENDING (sai); so version giữ CANCELLED.</li>
  <li>Id chống trùng sống lâu bằng thời gian bên gửi thử lại và được ghi cùng tác dụng, trong một transaction.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── Lab 10 ─────────────────────────── */
    {
      title: 'Lab 10 — The usage report as a background job with a webhook|||Lab 10 — Báo cáo dùng phòng thành việc nền có webhook',
      slug: 'api-10-7-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Báo cáo dùng phòng cả trường 92 ngày (23,3 s đồng bộ) thành việc nền: 202 + Location, Idempotency-Key, phân quyền, tiến độ theo ngày, huỷ, kết quả có hạn, webhook report.ready có chữ ký chỉ tới người tạo; thang chấm 10 điểm và script chấm (khởi đầu 0/10, lời giải 10/10), gói labflow-api-ch10.zip.',
      content: `${GL10}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab 10</span>
<h2>Lab 10: the usage report as a background job with a webhook</h2>
<p class="lead">In Lab 8 you made the usage report fast enough for one instance and one data set. Now the faculty wants it for the <em>whole campus</em> — 50 labs, up to 92 days, from the 1,000,000-row table — and each day needs a call to the attendance service. The starter answers correctly in 23 seconds while the client waits. Your job is to change the <em>contract</em>: answer at once with a job, let a worker compute it, let the manager cancel it, keep the result for a limited time, and tell the manager's system with a signed webhook when it is ready. A grading script measures all of it.</p>

<h3>Starting point</h3>
<p>The chapter's code (download at the end of this page), PostgreSQL with the Chapter 3 table on 55432, Redis 8.2 on 6390. The computation is already written (<code>src/reportTask.js › usageReport</code>, registered as task <code>usage-report</code> in <code>src/tasks.js</code>); the route is synchronous:</p>
<pre><code class="language-bash">cp src/routes/reportExports.js lab/report-exports-solution.backup.js   # the package ships the solution
cp lab/report-exports-starter.js src/routes/reportExports.js
LABFLOW_PG=1 LABFLOW_JOBS=bullmq LABFLOW_EVENTS=redis LABFLOW_WEBHOOK_ALLOW_LOCAL=1 npm start
LABFLOW_WEBHOOK_ALLOW_LOCAL=1 node src/worker.js        # second terminal</code></pre>
<pre><code class="language-javascript">// lab/report-exports-starter.js — Lab 10 (BẢN KHỞI ĐẦU): báo cáo dùng phòng cả trường, ĐỒNG BỘ.
// Chạy được, đúng số liệu — nhưng 92 ngày mất ~30 s: client giữ kết nối suốt, proxy 100 s cắt khi dữ liệu lớn hơn,
// người dùng bấm lại là tính lại từ đầu, và không ai được báo khi xong. Nhiệm vụ: đổi thành việc nền 202 + webhook.
//   cp lab/report-exports-starter.js src/routes/reportExports.js   (sao lưu lời giải trước)
import { Router } from 'express';
import { z } from 'zod';
import { onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { usageReport } from '../reportTask.js';

const Body = z.strictObject({ from: z.iso.date(), days: z.number().int().min(1).max(92).default(30) });
export const reportExportsRouter = Router();
reportExportsRouter.use(requireAuth, requireRole('LAB_MANAGER'));
reportExportsRouter.route('/')
  .post(validate('body', Body), async (req, res) =&gt; {
    const json = await usageReport(req.valid.body);              // ngồi chờ tới khi xong
    res.type('application/json').send(json);
  })
  .all(onlyAllow('POST'));</code></pre>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}, %{size_download} bytes in %{time_total} s\\n' -X POST http://localhost:4000/v2/reports/usage/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"from":"2027-01-01","days":92}'</code></pre>
<div class="out">200, 302812 bytes in 23.246151 s</div>
<p>23.3 seconds for 92 days, during which the client holds a connection, a proxy may cut it, and a second click computes everything again.</p>

<h3>Tasks</h3>
<ol>
  <li><strong>202 and a job (2 points).</strong> <code>POST /v2/reports/usage/exports</code> answers <code>202</code> in under 500 ms with <code>Location: /v2/jobs/{id}</code>, <code>Retry-After</code> and the job body (10.1). The same <code>Idempotency-Key</code> returns the same job.</li>
  <li><strong>Who may do what (1 point).</strong> Only lab managers create reports (403 for students); a job is visible only to its owner (404 for others).</li>
  <li><strong>Status and progress (1 point).</strong> The status goes queued/running → succeeded; progress is per day and never goes backwards; <code>Retry-After</code> while unfinished.</li>
  <li><strong>A correct result (2 points).</strong> <code>GET /v2/jobs/{id}/result</code> returns <code>application/json</code> with days × 50 rows whose counts match SQL.</li>
  <li><strong>Cancel (1 point).</strong> A running 92-day report stops within 3 s of <code>POST …/cancel</code>; its result is <code>409</code>.</li>
  <li><strong>Webhook (2 points).</strong> When a report succeeds, the creator's subscriptions to <code>labflow.report.ready.v1</code> receive a signed webhook (10.5) whose data names the job and the result link. A cancelled report sends nothing.</li>
  <li><strong>Retention in the contract (1 point).</strong> The job states <code>result.expiresAt</code>; OpenAPI documents the endpoint and AsyncAPI the new message.</li>
</ol>

<h3>Rubric (10 points) and the grading script</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">202 + idempotency — 2</span><span class="v">202 under 500 ms with Location and Retry-After; same key ⇒ same job, Idempotent-Replayed.</span></div>
  <div class="kv"><span class="k">Authorization — 1</span><span class="v">Student 403 on create, 404 on someone else's job.</span></div>
  <div class="kv"><span class="k">Status — 1</span><span class="v">running → succeeded, monotonic progress, Retry-After until final.</span></div>
  <div class="kv"><span class="k">Result — 2</span><span class="v">14 × 50 = 700 rows; three sampled rows equal a direct SQL count.</span></div>
  <div class="kv"><span class="k">Cancel — 1</span><span class="v">cancelled within 3 s, result 409.</span></div>
  <div class="kv"><span class="k">Webhook — 2</span><span class="v">report.ready for the right job, signature valid, nothing for the cancelled job.</span></div>
  <div class="kv"><span class="k">Retention — 1</span><span class="v">expiresAt after finishedAt (script); OpenAPI and AsyncAPI entries (checked by the reviewer).</span></div>
</div>
<p><code>lab/grade-lab10.mjs</code> runs every check against your running LabFlow: it registers its own webhook receiver on port 4006, creates a 14-day report and a 92-day report to cancel, and compares three rows with SQL. Against the starter:</p>
<pre><code class="language-bash">node lab/grade-lab10.mjs</code></pre>
<div class="out">✗ 0/1  POST trả 202 trong &lt; 500 ms, có Location /v2/jobs/{id} và Retry-After — 200, 3538 ms, 
✗ 0/1  Gửi lại cùng Idempotency-Key ⇒ cùng việc, Idempotent-Replayed
✗ 0/1  Sinh viên không tạo được (403) và không xem được việc của người khác (404) — 403, -
✗ 0/1  Trạng thái đi queued/running → succeeded, tiến độ không lùi, Retry-After khi chưa xong
✗ 0/2  Kết quả JSON đủ 14 × 50 dòng, số liệu khớp SQL
✗ 0/1  Huỷ việc đang chạy ⇒ cancelled trong 3 s; lấy kết quả ⇒ 409 — none, undefined%, result -
✗ 0/2  Webhook labflow.report.ready.v1 tới đúng việc, chữ ký hợp lệ; việc bị huỷ không báo — 0 webhook, chữ ký SAI, không thấy
✗ 0/1  Kết quả có expiresAt (sau finishedAt) — hợp đồng nói kết quả giữ bao lâu

Điểm: 0/10</div>
<div class="pitfall"><p><strong>Trap — the webhook goes to everyone.</strong> The report contains the whole campus. If the worker's event has no <code>owner</code>, the dispatcher (10.5) sends <code>report.ready</code> to <em>every</em> manager's subscription. Put the creator in the event and keep the event thin: a link, not the rows.</p></div>
<div class="pitfall"><p><strong>Trap — cancelling only the queue.</strong> Removing a waiting job is easy; a running one needs the worker to look at the abort signal between days. A report that ignores it reports “cancelled” while it keeps calling the attendance service for 20 more seconds.</p></div>

<h3>Reference solution and measurements</h3>
<p>The route only creates the job — everything else is generic and already built in 10.1–10.5:</p>
<pre><code class="language-javascript">// routes/reportExports.js — Lab 10 (LỜI GIẢI): báo cáo dùng phòng thành VIỆC NỀN.
//   POST /v2/reports/usage/exports { from, days } ⇒ 202 + Location /v2/jobs/{id} + Retry-After (Idempotency-Key dùng được)
//   Worker tính xong ⇒ sự kiện labflow.report.ready.v1 ⇒ webhook tới đăng ký của CHÍNH người tạo (src/worker.js)
import { Router } from 'express';
import { z } from 'zod';
import { onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { idempotent } from '../idempotency.js';
import { createJob, toJob } from '../jobs.js';

const Body = z.strictObject({ from: z.iso.date(), days: z.number().int().min(1).max(92).default(30) });
export const reportExportsRouter = Router();
reportExportsRouter.use(requireAuth, requireRole('LAB_MANAGER'));
reportExportsRouter.route('/')
  .post(idempotent(), validate('body', Body), async (req, res) =&gt; {
    const job = await createJob('usage-report', req.valid.body, req.user.id);
    const base = &#96;/v\${req.apiVersion}/jobs&#96;;
    res.status(202).location(&#96;\${base}/\${job.id}&#96;).set('Retry-After', process.env.JOB_POLL_SEC ?? '2').json(toJob(job, base));
  })
  .all(onlyAllow('POST'));</code></pre>
<p>The task checks the signal once per day and reports progress per day; <code>src/tasks.js</code> gives it the result type and the event to publish:</p>
<pre><code class="language-javascript">export async function usageReport({ from, days }, { progress = async () =&gt; {}, signal } = {}) {
  const rows = [];
  await progress(0, days);
  for (let d = 0; d &lt; days; d++) {
    if (signal?.aborted) throw new Cancelled();
    const day = new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10);
    const { rows: r } = await pool.query(&#96;SELECT lab_id, count(*)::int AS n FROM bookings
      WHERE start_at &gt;= $1::timestamptz AND start_at &lt; $1::timestamptz + interval '1 day' AND status &lt;&gt; 'CANCELLED'
      GROUP BY lab_id&#96;, [&#96;\${day}T00:00:00Z&#96;]);
    await sleep(BATCH_MS, signal);                                 // dịch vụ điểm danh: tỉ lệ có mặt của ngày đó
    const byLab = new Map(r.map((x) =&gt; [x.lab_id, x.n]));
    for (let l = 1; l &lt;= 50; l++) {
      const labId = &#96;lab_\${l}&#96;, n = byLab.get(labId) ?? 0;
      rows.push({ day, labId, bookings: n, attended: Math.round(n * 0.85) });
    }
    await progress(d + 1, days);
  }
  return JSON.stringify({ from, days, rows });
}</code></pre>
<pre><code class="language-javascript">'usage-report': { run: usageReport, type: 'application/json', event: 'labflow.report.ready.v1' },   // Lab 10</code></pre>
<pre><code class="language-bash">curl -s -i -X POST http://localhost:4000/v2/reports/usage/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"from":"2027-01-01","days":92}' | grep -iE '^(HTTP|location|retry-after|server-timing)'</code></pre>
<div class="out">HTTP/1.1 202 Accepted
Location: /v2/jobs/job_1
Retry-After: 2
Server-Timing: validate;dur=1.43, total;dur=16.09</div>
<pre><code class="language-bash">node lab/grade-lab10.mjs</code></pre>
<div class="out">✓ 1/1  POST trả 202 trong &lt; 500 ms, có Location /v2/jobs/{id} và Retry-After — 202, 6 ms, /v2/jobs/job_2
✓ 1/1  Gửi lại cùng Idempotency-Key ⇒ cùng việc, Idempotent-Replayed
✓ 1/1  Sinh viên không tạo được (403) và không xem được việc của người khác (404) — 403, 404
✓ 1/1  Trạng thái đi queued/running → succeeded, tiến độ không lùi, Retry-After khi chưa xong — running → succeeded
✓ 2/2  Kết quả JSON đủ 14 × 50 dòng, số liệu khớp SQL — 700 dòng, mẫu 31/31/30 vs SQL 31/31/30
✓ 1/1  Huỷ việc đang chạy ⇒ cancelled trong 3 s; lấy kết quả ⇒ 409 — cancelled, 5%, result 409
✓ 2/2  Webhook labflow.report.ready.v1 tới đúng việc, chữ ký hợp lệ; việc bị huỷ không báo — 1 webhook, chữ ký hợp lệ, result /v2/jobs/job_2/result
✓ 1/1  Kết quả có expiresAt (sau finishedAt) — hợp đồng nói kết quả giữ bao lâu — 2026-11-01T02:33:25.814Z

Điểm: 10/10</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Starter · 23.3 s per 92-day report</span><span class="lz-lnote">client waits; second click recomputes; nobody is told when it is done</span></div>
  <div class="lz-layer"><span class="lz-lname">Solution · 202 in 6 ms</span><span class="lz-lnote">worker computes; progress per day; cancel at the next day; result kept until expiresAt</span></div>
  <div class="lz-layer"><span class="lz-lname">Webhook · report.ready, signed</span><span class="lz-lnote">only the creator's subscriptions; thin event with a link the owner fetches with their token</span></div>
</div>
<p><strong>Discussion.</strong> Why is <code>report.ready</code> thin when booking events are fat (10.3)? Because the report is 46 KB for 14 days and up to 300 KB for 92, it is private to its creator, and it already lives at a URL that checks the token. A webhook full of campus data would sit in the receiver's logs for years.</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch10.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API at the end of Chapter 10 (labflow-api-ch10.zip)</span><span class="lc-sub">The chapter's code = this lab's solution: jobs.js, worker.js (BullMQ jobs + webhook dispatcher and sender), events.js (memory or Redis Stream), realtime routes (polling, SSE, WebSocket tickets), webhooks.js (Standard Webhooks), exports and reportExports, events/ (redelivery, outbox, thin-vs-fat, versions), asyncapi/, webhooks/receiver.mjs, perf/ scripts, lab/report-exports-starter.js and lab/grade-lab10.mjs. npm install, npm test (13 tests).</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>📌 What this lab shows</h3>
<ul>
  <li>A slow endpoint became a job by changing the contract, not the computation: 23.3 s of waiting became a 202 in 6 ms.</li>
  <li>Idempotency, authorization, progress, cancel and retention are the same rules as before, applied to a job resource.</li>
  <li>The webhook reached only the creator, signed, thin; the cancelled report sent nothing.</li>
  <li>A grading script turns “it works on my machine” into ten measured checks: 0/10 for the starter, 10/10 for the solution.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab 10</span>
<h2>Lab 10: báo cáo dùng phòng thành việc nền có webhook</h2>
<p class="lead">Ở Lab 8 bạn làm báo cáo dùng phòng đủ nhanh cho một instance và một bộ dữ liệu. Giờ khoa muốn báo cáo cho <em>cả trường</em> — 50 phòng, tới 92 ngày, trên bảng 1.000.000 dòng — và mỗi ngày phải hỏi dịch vụ điểm danh một lần. Bản khởi đầu trả lời đúng sau 23 giây trong lúc client ngồi chờ. Việc của bạn là đổi <em>hợp đồng</em>: trả lời ngay bằng một việc (job), để worker tính, cho quản lý huỷ được, giữ kết quả có thời hạn, và báo cho hệ thống của quản lý bằng một webhook có chữ ký khi xong. Một script chấm điểm đo tất cả.</p>

<h3>Điểm xuất phát</h3>
<p>Code của chương (tải ở cuối trang), PostgreSQL có bảng của Chương 3 ở 55432, Redis 8.2 ở 6390. Phần tính đã viết sẵn (<code>src/reportTask.js › usageReport</code>, đăng ký thành việc <code>usage-report</code> trong <code>src/tasks.js</code>); route thì đồng bộ:</p>
<pre><code class="language-bash">cp src/routes/reportExports.js lab/report-exports-solution.backup.js   # gói tải về chứa sẵn lời giải
cp lab/report-exports-starter.js src/routes/reportExports.js
LABFLOW_PG=1 LABFLOW_JOBS=bullmq LABFLOW_EVENTS=redis LABFLOW_WEBHOOK_ALLOW_LOCAL=1 npm start
LABFLOW_WEBHOOK_ALLOW_LOCAL=1 node src/worker.js        # cửa sổ terminal thứ hai</code></pre>
<pre><code class="language-javascript">// lab/report-exports-starter.js — Lab 10 (BẢN KHỞI ĐẦU): báo cáo dùng phòng cả trường, ĐỒNG BỘ.
// Chạy được, đúng số liệu — nhưng 92 ngày mất ~30 s: client giữ kết nối suốt, proxy 100 s cắt khi dữ liệu lớn hơn,
// người dùng bấm lại là tính lại từ đầu, và không ai được báo khi xong. Nhiệm vụ: đổi thành việc nền 202 + webhook.
//   cp lab/report-exports-starter.js src/routes/reportExports.js   (sao lưu lời giải trước)
import { Router } from 'express';
import { z } from 'zod';
import { onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { usageReport } from '../reportTask.js';

const Body = z.strictObject({ from: z.iso.date(), days: z.number().int().min(1).max(92).default(30) });
export const reportExportsRouter = Router();
reportExportsRouter.use(requireAuth, requireRole('LAB_MANAGER'));
reportExportsRouter.route('/')
  .post(validate('body', Body), async (req, res) =&gt; {
    const json = await usageReport(req.valid.body);              // ngồi chờ tới khi xong
    res.type('application/json').send(json);
  })
  .all(onlyAllow('POST'));</code></pre>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}, %{size_download} bytes in %{time_total} s\\n' -X POST http://localhost:4000/v2/reports/usage/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"from":"2027-01-01","days":92}'</code></pre>
<div class="out">200, 302812 bytes in 23.246151 s</div>
<p>23,3 giây cho 92 ngày, trong lúc đó client giữ kết nối, proxy có thể cắt, và bấm lần hai là tính lại toàn bộ.</p>

<h3>Nhiệm vụ</h3>
<ol>
  <li><strong>202 và một việc (2 điểm).</strong> <code>POST /v2/reports/usage/exports</code> trả <code>202</code> trong dưới 500 ms kèm <code>Location: /v2/jobs/{id}</code>, <code>Retry-After</code> và body của việc (10.1). Cùng <code>Idempotency-Key</code> thì trả về cùng việc.</li>
  <li><strong>Ai được làm gì (1 điểm).</strong> Chỉ quản lý phòng lab tạo được báo cáo (sinh viên 403); việc chỉ chủ của nó xem được (người khác 404).</li>
  <li><strong>Trạng thái và tiến độ (1 điểm).</strong> Trạng thái đi queued/running → succeeded; tiến độ tính theo ngày và không bao giờ lùi; có <code>Retry-After</code> khi chưa xong.</li>
  <li><strong>Kết quả đúng (2 điểm).</strong> <code>GET /v2/jobs/{id}/result</code> trả <code>application/json</code> gồm số ngày × 50 dòng với số liệu khớp SQL.</li>
  <li><strong>Huỷ (1 điểm).</strong> Báo cáo 92 ngày đang chạy dừng trong 3 s sau <code>POST …/cancel</code>; kết quả của nó là <code>409</code>.</li>
  <li><strong>Webhook (2 điểm).</strong> Báo cáo xong thì các đăng ký <code>labflow.report.ready.v1</code> của người tạo nhận một webhook có chữ ký (10.5), data nêu tên việc và link kết quả. Báo cáo bị huỷ không gửi gì.</li>
  <li><strong>Thời hạn giữ nằm trong hợp đồng (1 điểm).</strong> Việc ghi <code>result.expiresAt</code>; OpenAPI mô tả endpoint, AsyncAPI mô tả thông điệp mới.</li>
</ol>

<h3>Thang chấm (10 điểm) và script chấm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">202 + idempotency — 2</span><span class="v">202 dưới 500 ms kèm Location và Retry-After; cùng khoá ⇒ cùng việc, Idempotent-Replayed.</span></div>
  <div class="kv"><span class="k">Phân quyền — 1</span><span class="v">Sinh viên tạo ⇒ 403, xem việc của người khác ⇒ 404.</span></div>
  <div class="kv"><span class="k">Trạng thái — 1</span><span class="v">running → succeeded, tiến độ không lùi, Retry-After tới khi xong.</span></div>
  <div class="kv"><span class="k">Kết quả — 2</span><span class="v">14 × 50 = 700 dòng; ba dòng lấy mẫu bằng đúng phép đếm SQL trực tiếp.</span></div>
  <div class="kv"><span class="k">Huỷ — 1</span><span class="v">cancelled trong 3 s, kết quả 409.</span></div>
  <div class="kv"><span class="k">Webhook — 2</span><span class="v">report.ready đúng việc, chữ ký hợp lệ, không gì cho việc bị huỷ.</span></div>
  <div class="kv"><span class="k">Thời hạn giữ — 1</span><span class="v">expiresAt sau finishedAt (script); mục OpenAPI và AsyncAPI (người chấm xem).</span></div>
</div>
<p><code>lab/grade-lab10.mjs</code> chạy mọi phép kiểm vào LabFlow đang chạy của bạn: nó tự đăng ký bên nhận webhook ở cổng 4006, tạo một báo cáo 14 ngày và một báo cáo 92 ngày để huỷ, và so ba dòng với SQL. Chấm bản khởi đầu:</p>
<pre><code class="language-bash">node lab/grade-lab10.mjs</code></pre>
<div class="out">✗ 0/1  POST trả 202 trong &lt; 500 ms, có Location /v2/jobs/{id} và Retry-After — 200, 3538 ms, 
✗ 0/1  Gửi lại cùng Idempotency-Key ⇒ cùng việc, Idempotent-Replayed
✗ 0/1  Sinh viên không tạo được (403) và không xem được việc của người khác (404) — 403, -
✗ 0/1  Trạng thái đi queued/running → succeeded, tiến độ không lùi, Retry-After khi chưa xong
✗ 0/2  Kết quả JSON đủ 14 × 50 dòng, số liệu khớp SQL
✗ 0/1  Huỷ việc đang chạy ⇒ cancelled trong 3 s; lấy kết quả ⇒ 409 — none, undefined%, result -
✗ 0/2  Webhook labflow.report.ready.v1 tới đúng việc, chữ ký hợp lệ; việc bị huỷ không báo — 0 webhook, chữ ký SAI, không thấy
✗ 0/1  Kết quả có expiresAt (sau finishedAt) — hợp đồng nói kết quả giữ bao lâu

Điểm: 0/10</div>
<div class="pitfall"><p><strong>Bẫy — webhook tới tay mọi người.</strong> Báo cáo chứa số liệu cả trường. Sự kiện của worker thiếu <code>owner</code> thì bộ điều phối (10.5) gửi <code>report.ready</code> tới đăng ký của <em>mọi</em> quản lý. Đặt người tạo vào sự kiện và giữ sự kiện mỏng: một link, không phải các dòng số liệu.</p></div>
<div class="pitfall"><p><strong>Bẫy — chỉ huỷ trong hàng đợi.</strong> Bỏ một việc đang chờ thì dễ; việc đang chạy cần worker nhìn tín hiệu huỷ (abort signal) giữa các ngày. Báo cáo bỏ qua tín hiệu đó báo “đã huỷ” trong khi vẫn gọi dịch vụ điểm danh thêm 20 giây.</p></div>

<h3>Lời giải tham khảo và kết quả đo</h3>
<p>Route chỉ tạo việc — mọi thứ còn lại là phần dùng chung đã dựng ở 10.1–10.5:</p>
<pre><code class="language-javascript">// routes/reportExports.js — Lab 10 (LỜI GIẢI): báo cáo dùng phòng thành VIỆC NỀN.
//   POST /v2/reports/usage/exports { from, days } ⇒ 202 + Location /v2/jobs/{id} + Retry-After (Idempotency-Key dùng được)
//   Worker tính xong ⇒ sự kiện labflow.report.ready.v1 ⇒ webhook tới đăng ký của CHÍNH người tạo (src/worker.js)
import { Router } from 'express';
import { z } from 'zod';
import { onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { idempotent } from '../idempotency.js';
import { createJob, toJob } from '../jobs.js';

const Body = z.strictObject({ from: z.iso.date(), days: z.number().int().min(1).max(92).default(30) });
export const reportExportsRouter = Router();
reportExportsRouter.use(requireAuth, requireRole('LAB_MANAGER'));
reportExportsRouter.route('/')
  .post(idempotent(), validate('body', Body), async (req, res) =&gt; {
    const job = await createJob('usage-report', req.valid.body, req.user.id);
    const base = &#96;/v\${req.apiVersion}/jobs&#96;;
    res.status(202).location(&#96;\${base}/\${job.id}&#96;).set('Retry-After', process.env.JOB_POLL_SEC ?? '2').json(toJob(job, base));
  })
  .all(onlyAllow('POST'));</code></pre>
<p>Công việc nhìn tín hiệu huỷ mỗi ngày một lần và báo tiến độ theo ngày; <code>src/tasks.js</code> cho nó kiểu kết quả và sự kiện cần phát:</p>
<pre><code class="language-javascript">export async function usageReport({ from, days }, { progress = async () =&gt; {}, signal } = {}) {
  const rows = [];
  await progress(0, days);
  for (let d = 0; d &lt; days; d++) {
    if (signal?.aborted) throw new Cancelled();
    const day = new Date(Date.parse(from) + d * 86400000).toISOString().slice(0, 10);
    const { rows: r } = await pool.query(&#96;SELECT lab_id, count(*)::int AS n FROM bookings
      WHERE start_at &gt;= $1::timestamptz AND start_at &lt; $1::timestamptz + interval '1 day' AND status &lt;&gt; 'CANCELLED'
      GROUP BY lab_id&#96;, [&#96;\${day}T00:00:00Z&#96;]);
    await sleep(BATCH_MS, signal);                                 // dịch vụ điểm danh: tỉ lệ có mặt của ngày đó
    const byLab = new Map(r.map((x) =&gt; [x.lab_id, x.n]));
    for (let l = 1; l &lt;= 50; l++) {
      const labId = &#96;lab_\${l}&#96;, n = byLab.get(labId) ?? 0;
      rows.push({ day, labId, bookings: n, attended: Math.round(n * 0.85) });
    }
    await progress(d + 1, days);
  }
  return JSON.stringify({ from, days, rows });
}</code></pre>
<pre><code class="language-javascript">'usage-report': { run: usageReport, type: 'application/json', event: 'labflow.report.ready.v1' },   // Lab 10</code></pre>
<pre><code class="language-bash">curl -s -i -X POST http://localhost:4000/v2/reports/usage/exports \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"from":"2027-01-01","days":92}' | grep -iE '^(HTTP|location|retry-after|server-timing)'</code></pre>
<div class="out">HTTP/1.1 202 Accepted
Location: /v2/jobs/job_1
Retry-After: 2
Server-Timing: validate;dur=1.43, total;dur=16.09</div>
<pre><code class="language-bash">node lab/grade-lab10.mjs</code></pre>
<div class="out">✓ 1/1  POST trả 202 trong &lt; 500 ms, có Location /v2/jobs/{id} và Retry-After — 202, 6 ms, /v2/jobs/job_2
✓ 1/1  Gửi lại cùng Idempotency-Key ⇒ cùng việc, Idempotent-Replayed
✓ 1/1  Sinh viên không tạo được (403) và không xem được việc của người khác (404) — 403, 404
✓ 1/1  Trạng thái đi queued/running → succeeded, tiến độ không lùi, Retry-After khi chưa xong — running → succeeded
✓ 2/2  Kết quả JSON đủ 14 × 50 dòng, số liệu khớp SQL — 700 dòng, mẫu 31/31/30 vs SQL 31/31/30
✓ 1/1  Huỷ việc đang chạy ⇒ cancelled trong 3 s; lấy kết quả ⇒ 409 — cancelled, 5%, result 409
✓ 2/2  Webhook labflow.report.ready.v1 tới đúng việc, chữ ký hợp lệ; việc bị huỷ không báo — 1 webhook, chữ ký hợp lệ, result /v2/jobs/job_2/result
✓ 1/1  Kết quả có expiresAt (sau finishedAt) — hợp đồng nói kết quả giữ bao lâu — 2026-11-01T02:33:25.814Z

Điểm: 10/10</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Khởi đầu · 23,3 s mỗi báo cáo 92 ngày</span><span class="lz-lnote">client ngồi chờ; bấm lần hai tính lại; xong không ai được báo</span></div>
  <div class="lz-layer"><span class="lz-lname">Lời giải · 202 sau 6 ms</span><span class="lz-lnote">worker tính; tiến độ theo ngày; huỷ ở ngày kế tiếp; kết quả giữ tới expiresAt</span></div>
  <div class="lz-layer"><span class="lz-lname">Webhook · report.ready, có chữ ký</span><span class="lz-lnote">chỉ đăng ký của người tạo; sự kiện mỏng kèm link người chủ tự lấy bằng token</span></div>
</div>
<p><strong>Thảo luận.</strong> Vì sao <code>report.ready</code> mỏng trong khi sự kiện lượt đặt lại dày (10.3)? Vì báo cáo nặng 46 KB cho 14 ngày và tới 300 KB cho 92 ngày, nó riêng tư với người tạo, và nó đã nằm sẵn ở một URL có kiểm token. Một webhook nhồi số liệu cả trường sẽ nằm trong log của bên nhận nhiều năm.</p>

<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch10.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API cuối Chương 10 (labflow-api-ch10.zip)</span><span class="lc-sub">Code của chương = lời giải lab này: jobs.js, worker.js (việc BullMQ + bộ điều phối và gửi webhook), events.js (RAM hoặc Redis Stream), route realtime (polling, SSE, vé WebSocket), webhooks.js (Standard Webhooks), exports và reportExports, events/ (redelivery, outbox, thin-vs-fat, versions), asyncapi/, webhooks/receiver.mjs, các script perf/, lab/report-exports-starter.js và lab/grade-lab10.mjs. npm install, npm test (13 test).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📌 Lab này cho thấy</h3>
<ul>
  <li>Một endpoint chậm thành việc nền nhờ đổi hợp đồng, không đổi phần tính: 23,3 giây ngồi chờ thành một 202 sau 6 ms.</li>
  <li>Idempotency, phân quyền, tiến độ, huỷ và thời hạn giữ vẫn là những luật cũ, áp cho tài nguyên công việc.</li>
  <li>Webhook chỉ tới người tạo, có chữ ký, mỏng; báo cáo bị huỷ không gửi gì.</li>
  <li>Script chấm biến “máy em chạy được” thành mười phép kiểm có số đo: bản khởi đầu 0/10, lời giải 10/10.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── Quiz ─────────────────────────── */
    {
      title: 'Chapter 10 quiz|||Kiểm tra Chương 10',
      slug: 'api-10-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống từ số đo của chương: 524 sau proxy, việc mất khi khởi động lại, worker bị bỏ dở, sự kiện mỏng/dày, giao trùng, outbox, SSE và gzip, webhook chậm và sai thứ tự.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Chapter 10 quiz: async and realtime</h2>
<p class="lead">Ten situations from the chapter's own measurements: a 524 behind a proxy, a job that vanished on restart, a stalled worker, thin versus fat events, duplicates and lost events, an SSE stream that never arrived, and webhooks that were slow, replayed or out of order. Each explanation says why the right answer is right and why the most tempting wrong one is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can turn a slow request into a job resource with 202, Location, Retry-After, cancel and retention.</li>
  <li>I can explain what happens to a BullMQ job when the API or a worker dies.</li>
  <li>I can choose thin or fat events and evolve them without breaking readers.</li>
  <li>I can build a consumer that survives duplicates, and a producer that does not lose events.</li>
  <li>I can choose polling, SSE or WebSocket from measurements and make reconnects lose nothing.</li>
  <li>I can sign, retry and receive webhooks safely.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Kiểm tra Chương 10: bất đồng bộ và thời gian thực</h2>
<p class="lead">Mười tình huống từ chính các phép đo của chương: một 524 sau proxy, một việc biến mất khi khởi động lại, một worker bị coi là bỏ dở, sự kiện mỏng so với dày, bản trùng và sự kiện bị mất, một luồng SSE không bao giờ tới, và webhook bị chậm, bị phát lại hay sai thứ tự. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi biến được một request chậm thành tài nguyên công việc với 202, Location, Retry-After, huỷ và thời hạn giữ.</li>
  <li>Tôi giải thích được chuyện gì xảy ra với việc BullMQ khi API hoặc worker chết.</li>
  <li>Tôi chọn được sự kiện mỏng hay dày và đổi chúng mà không làm vỡ người đọc.</li>
  <li>Tôi dựng được consumer chịu được bản trùng, và producer không làm mất sự kiện.</li>
  <li>Tôi chọn được polling, SSE hay WebSocket bằng số đo và nối lại mà không mất gì.</li>
  <li>Tôi ký, thử lại và nhận webhook an toàn.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "A campus export takes 114 s behind a proxy that gives up after 100 s. What did LabFlow's log show?|||Việc xuất cả trường mất 114 s sau một proxy bỏ cuộc sau 100 s. Log của LabFlow cho thấy gì?",
            options: [
              "The server kept working until 114.8 s and produced a file nobody received|||Server vẫn làm tới giây 114,8 và tạo ra một file không ai nhận",
              "The server stopped the export at 100 s because the connection closed|||Server dừng việc xuất ở giây 100 vì kết nối đã đóng",
              "The proxy retried the request automatically and the second try succeeded|||Proxy tự gửi lại request và lần thứ hai thành công",
              "Express answered 504 Gateway Timeout before the proxy did|||Express trả 504 Gateway Timeout trước cả proxy",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 10.1. The proxy answered 524, but nothing told the handler to stop: it finished at 114.8 s, and a second click ran it again. Servers do not stop work when a client leaves unless they check.|||VI: Bài 10.1. Proxy trả 524, nhưng không gì bảo handler dừng: nó xong ở giây 114,8, và cú bấm thứ hai chạy lại lần nữa. Server không tự dừng việc khi client bỏ đi nếu không tự kiểm.",
          },
          {
            question: "Which response best starts a two-minute export?|||Câu trả lời nào mở đầu một việc xuất hai phút tốt nhất?",
            options: [
              "200 OK with an empty CSV that fills in later|||200 OK kèm CSV rỗng sẽ được điền sau",
              "201 Created with the CSV file as soon as it is ready|||201 Created kèm file CSV ngay khi xong",
              "202 Accepted, Location: /v2/jobs/{id}, Retry-After and the job's status|||202 Accepted, Location: /v2/jobs/{id}, Retry-After và trạng thái của việc",
              "303 See Other pointing to a page that refreshes itself|||303 See Other trỏ tới một trang tự làm mới",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 10.1. RFC 9110: 202 means accepted, not completed, and should point to a status monitor. 201 would mean the resource exists now; making the client wait for it is the original problem.|||VI: Bài 10.1. RFC 9110: 202 nghĩa là đã nhận, chưa xong, và nên trỏ tới chỗ theo dõi trạng thái. 201 nghĩa là tài nguyên đã tồn tại; bắt client chờ nó chính là vấn đề ban đầu.",
          },
          {
            question: "With LABFLOW_JOBS=memory, the API restarts during an export. What does GET /v2/jobs/job_1 return?|||Với LABFLOW_JOBS=memory, API khởi động lại giữa lúc xuất. GET /v2/jobs/job_1 trả về gì?",
            options: [
              "running at the same percent, because the job resumes|||running ở đúng phần trăm cũ, vì việc tiếp tục",
              "404 JOB_NOT_FOUND — the job and its work lived only in that process|||404 JOB_NOT_FOUND — việc và công sức chỉ sống trong tiến trình đó",
              "failed with the reason RESTART|||failed với lý do RESTART",
              "queued, waiting for the new process to pick it up|||queued, chờ tiến trình mới nhận lại",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lessons 10.1–10.2. A promise made with 202 must outlive the process; in-memory jobs do not. A BullMQ queue in Redis kept the job when the API was killed.|||VI: Bài 10.1–10.2. Lời hứa bằng 202 phải sống lâu hơn tiến trình; việc trong RAM thì không. Hàng đợi BullMQ trong Redis giữ được việc khi API bị giết.",
          },
          {
            question: "A worker is killed with kill -9 at 37%. What happens with BullMQ (lockDuration 15 s)?|||Một worker bị kill -9 ở 37%. Với BullMQ (lockDuration 15 s) chuyện gì xảy ra?",
            options: [
              "The job fails immediately and the client sees failed|||Việc hỏng ngay và client thấy failed",
              "The job continues from 37% on the next worker|||Việc chạy tiếp từ 37% trên worker kế tiếp",
              "Nothing until someone restarts the same worker by name|||Không gì cả cho tới khi ai đó khởi động lại đúng worker đó",
              "Its lock expires, a stalled check returns it to waiting, another worker runs it from 0%|||Khoá hết hạn, lượt kiểm việc bỏ dở đưa nó về hàng chờ, worker khác chạy lại từ 0%",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 10.2. Measured ~34 s to recovery, restarting from 0% because there was no checkpoint. A stall is not counted as a failed attempt.|||VI: Bài 10.2. Đo được ~34 s để khôi phục, chạy lại từ 0% vì không có mốc. Bị bỏ dở không tính là một lần thử hỏng.",
          },
          {
            question: "A consumer receives thin booking events and calls GET /v2/bookings/{id} for each. 100 of 200 bookings were cancelled right after creation. What did the measurement show?|||Một consumer nhận sự kiện lượt đặt mỏng và gọi GET /v2/bookings/{id} cho từng cái. 100 trên 200 lượt bị huỷ ngay sau khi tạo. Phép đo cho thấy gì?",
            options: [
              "200 call-backs, and 100 'booking created' emails read the current state CANCELLED|||200 lần gọi ngược, và 100 email “đã đặt” đọc phải trạng thái hiện tại CANCELLED",
              "Thin events were larger than fat events because of the extra call-backs|||Sự kiện mỏng lớn hơn sự kiện dày vì có thêm lời gọi ngược",
              "No difference: both kinds of events produced the same emails|||Không khác gì: cả hai loại sự kiện tạo ra cùng các email",
              "The thin consumer was blocked by the booking rate limit|||Consumer mỏng bị chặn bởi giới hạn tần suất đặt phòng",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Lesson 10.3. A thin event says that something changed; reading now gives today's state. Fat events carry the state at event time (330 vs 203 B) with no call-backs.|||VI: Bài 10.3. Sự kiện mỏng chỉ nói có gì đó đổi; đọc lúc này cho trạng thái của bây giờ. Sự kiện dày mang trạng thái lúc xảy ra (330 so với 203 B) và không gọi ngược.",
          },
          {
            question: "A consumer first inserts the event id into processed_events (autocommit), then sends the email, then XACKs. It sometimes crashes. Result?|||Một consumer chèn id sự kiện vào processed_events trước (tự commit), rồi gửi email, rồi XACK. Thỉnh thoảng nó sập. Kết quả?",
            options: [
              "Exactly one email per event, because the id is recorded|||Đúng một email mỗi sự kiện, vì id đã được ghi",
              "More emails than events, because Redis redelivers|||Nhiều email hơn số sự kiện, vì Redis giao lại",
              "Some events never get an email: a crash after the mark loses them (21 of 1,000)|||Có sự kiện không bao giờ được gửi email: sập sau khi đánh dấu là mất (21 trên 1.000)",
              "Redis refuses to redeliver marked events|||Redis từ chối giao lại sự kiện đã đánh dấu",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 10.3. Marking first turns duplicates into silent losses. Recording the id in the same transaction as the effect gave exactly 1,000 for 1,000.|||VI: Bài 10.3. Đánh dấu trước biến bản trùng thành mất mát lặng lẽ. Ghi id trong cùng transaction với tác dụng cho đúng 1.000 trên 1.000.",
          },
          {
            question: "Redis is unreachable for 1.5 s while 1,000 bookings are saved. Which approach lost no events?|||Redis không với tới được trong 1,5 s lúc lưu 1.000 lượt đặt. Cách nào không mất sự kiện nào?",
            options: [
              "Saving the booking, then XADD with a retry inside the request|||Lưu lượt đặt rồi XADD có thử lại ngay trong request",
              "Writing the event to an outbox table in the same transaction, published later by a relay|||Ghi sự kiện vào bảng outbox trong cùng transaction, relay phát đi sau",
              "Publishing to Redis Pub/Sub instead of a Stream|||Phát qua Redis Pub/Sub thay vì Stream",
              "XADD first, then saving the booking|||XADD trước, rồi mới lưu lượt đặt",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 10.3. Dual write lost 342 events; the outbox lost 0 at the price of ~118 ms lag and possible duplicates (18 when the relay died). Publishing first creates events for bookings that may never be saved.|||VI: Bài 10.3. Ghi kép mất 342 sự kiện; outbox mất 0, đổi lại trễ ~118 ms và có thể trùng (18 khi relay chết). Phát trước thì tạo sự kiện cho lượt đặt có thể không bao giờ được lưu.",
          },
          {
            question: "An SSE dashboard works with curl but shows nothing in the browser. LabFlow uses compression(). Most likely cause?|||Bảng điều khiển SSE chạy với curl nhưng không hiện gì trên trình duyệt. LabFlow dùng compression(). Nguyên nhân khả dĩ nhất?",
            options: [
              "Browsers do not support text/event-stream over HTTP/1.1|||Trình duyệt không hỗ trợ text/event-stream qua HTTP/1.1",
              "The browser needs a WebSocket instead|||Trình duyệt cần WebSocket thay vì SSE",
              "Last-Event-ID is missing on the first connection|||Thiếu Last-Event-ID ở lần nối đầu tiên",
              "gzip buffers the small writes; without res.flush() nothing reaches a client that sends Accept-Encoding|||gzip giữ đệm các lần viết nhỏ; thiếu res.flush() thì không gì tới được client gửi Accept-Encoding",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 10.4. Measured: 0 of 8 events with gzip, all 8 within ~0.1 s after adding res.flush(). Plain curl sends no Accept-Encoding, so it hides the bug.|||VI: Bài 10.4. Đo được: 0/8 sự kiện khi gzip, đủ 8 trong ~0,1 s sau khi thêm res.flush(). curl trơn không gửi Accept-Encoding nên che mất lỗi.",
          },
          {
            question: "A webhook receiver takes 3 s per event; LabFlow times out after 2 s and retries. Receiver has no deduplication. What happened?|||Bên nhận webhook mất 3 s mỗi sự kiện; LabFlow hết giờ sau 2 s và thử lại. Bên nhận không chống trùng. Chuyện gì đã xảy ra?",
            options: [
              "One email, because the sender stops after the first timeout|||Một email, vì bên gửi dừng sau lần hết giờ đầu",
              "Five attempts, five emails, and the message was finally marked failed|||Năm lần thử, năm email, và cuối cùng thông điệp bị đánh dấu hỏng",
              "No email, because a timed-out request is rolled back|||Không email nào, vì request hết giờ sẽ bị huỷ bỏ",
              "Two emails, because BullMQ allows one retry|||Hai email, vì BullMQ cho thử lại một lần",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 10.6. The receiver finished each attempt after the sender hung up. Dedupe cut it to one email; answering 202 first gave one attempt in 21 ms.|||VI: Bài 10.6. Bên nhận làm xong từng lần sau khi bên gửi đã cúp máy. Chống trùng giảm còn một email; trả 202 trước cho một lần thử trong 21 ms.",
          },
          {
            question: "booking.cancelled arrives before booking.created for the same booking. How should the receiver keep the right state?|||booking.cancelled tới trước booking.created của cùng một lượt đặt. Bên nhận giữ đúng trạng thái bằng cách nào?",
            options: [
              "Process events in arrival order; the sender guarantees order|||Xử lý theo thứ tự tới; bên gửi đảm bảo thứ tự",
              "Reject events older than 5 minutes|||Từ chối sự kiện cũ hơn 5 phút",
              "Apply an event only if its data.version is newer than the stored one|||Chỉ áp dụng sự kiện có data.version mới hơn bản đang giữ",
              "Use the event's time field, which is unique per second|||Dùng trường time của sự kiện, vốn duy nhất theo từng giây",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lesson 10.6. Last-write-wins ended PENDING (wrong); the version check kept CANCELLED. Timestamps can collide; the 5-minute window is for replay attacks, not ordering.|||VI: Bài 10.6. Ai ghi sau thắng ra PENDING (sai); so version giữ CANCELLED. Timestamp có thể trùng nhau; cửa sổ 5 phút là để chống phát lại, không phải để sắp thứ tự.",
          },
        ],
      },
    },
  ],
};
