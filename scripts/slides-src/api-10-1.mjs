/**
 * api-10-1 — API Design · Chapter 10 · Lesson 10.1 "Asynchronous APIs: 202, jobs, polling" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s10-bat-dong-bo.mjs › api-10-1-hang-doi. Output = chạy thật LabFlow ch10 + perf/edge-proxy.mjs (timeout 100 s).
 */
import { lamDeck, sql, http, two, box, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 10 — Async and realtime', bai: '10.1' };

export const deck = { key: 'api-10-1', code: 'API 10.1', title: 'Asynchronous APIs', sub: '202 Accepted, job resources and polling' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'A button that<br>takes two minutes', sub: '202 Accepted, a job resource<br>and a client that polls politely.' },

  { t: 'Waiting inside one request', body: http(`$ curl -s -i … 'http://localhost:8090/v2/exports/bookings.csv?from=2026-11-01&to=2027-03-01'
HTTP/1.1 524 unknown
error code: 524 (A timeout occurred)
⇒ 524 after 100.012553 s
$ curl -s -o /dev/null … (same request: the user clicks again)
⇒ 524 after 100.005695 s`, { sm: true, wrap: 'any', title: 'client → edge proxy (timeout 100 s) → LabFlow' }) + two(http(`[sync] client bỏ đi sau 100.0 s — server VẪN làm tiếp
[sync] xong sau 114.8 s, 11698254 byte
[sync] client bỏ đi sau 100.0 s — server VẪN làm tiếp
[sync] xong sau 114.4 s, 11698254 byte`, { sm: true, wrap: 'any', title: 'LabFlow log' }), box('Three problems in four lines', 'The client got an error at 100 s · the server kept working to 114.8 s for a file nobody received · the second click did all 114 s again.', 'do2') + box('A longer timeout moves the cliff', 'Cloudflare 125 s, nginx 60 s, campus Wi-Fi less.', 'lam')) },

  { t: '202 Accepted: “received, not done yet”', body: two(http(`$ curl -s -i -X POST …/v2/exports --json '{"labId":"lab_1",…}'
HTTP/1.1 202 Accepted
Location: /v2/jobs/job_1
Retry-After: 2
Server-Timing: validate;dur=1.32, total;dur=17.06

{
  "id": "job_1",
  "kind": "bookings-export",
  "status": "running",
  "progress": {…},
  "links": {
    "self": "/v2/jobs/job_1",
    "cancel": "/v2/jobs/job_1/cancel"
  }
}`, { sm: true, wrap: 'any' }), box('Three headers carry the contract', '<b>202</b> — do not treat this as done.<br><b>Location</b> — where to look.<br><b>Retry-After: 2</b> — when to look again.', 'xanh') + box('17 ms, not two minutes', 'Nothing can time out because nothing is waiting. RFC 9110: a 202 should point to a status monitor.', 'lam'), 'r64') + flow([
    { t: 'POST ⇒ 202', s: 'in milliseconds' },
    { t: 'worker', s: 'does the work from a queue', mau: '#7a5195' },
    { t: 'client', s: 'polls, or gets a webhook', mau: '#2e7d32' },
  ], { h: 120 }) },

  { t: 'The job resource and a polling client', body: `<table class="t"><tr><th>Transition</th><th>What the client may rely on</th></tr>
<tr><td>queued → running</td><td>progress { done, total, percent } — total is null until counted</td></tr>
<tr><td>running → succeeded</td><td>result { href, contentType, bytes, expiresAt }</td></tr>
<tr><td>running → failed</td><td>error { code, detail } after the worker’s retries</td></tr>
<tr><td>queued | running → cancelled</td><td>POST /jobs/{id}/cancel; finished ⇒ 409</td></tr></table>` + http(`$ node perf/poll-job.mjs '{"labId":"lab_2","from":"2026-11-01","to":"2028-06-01"}'
  0.03 s  POST /v2/exports ⇒ 202, Location: /v2/jobs/job_2, Retry-After: 2
  4.05 s  GET /v2/jobs/job_2 ⇒ running    37%  (7500/20000)
 12.06 s  GET /v2/jobs/job_2 ⇒ succeeded 100%  (20000/20000)
 12.08 s  GET /v2/jobs/job_2/result ⇒ 200 text/csv; charset=utf-8, 20000 dòng, …
⇒ 7 lần hỏi trạng thái; việc chạy 10.2 s`, { sm: true, wrap: 'any' }) + box('Rules you already know', 'Someone else’s job ⇒ 404 (BOLA) · result too early ⇒ 409 + Retry-After · status is Cache-Control: no-store.', 'lam') },

  { t: 'Cancel, retention and a second click', body: http(`$ curl -s -X POST …/v2/jobs/job_2/cancel | jq -c '{status, cancelRequested, progress}'
{"status":"running","cancelRequested":true,"progress":{"done":5500,"total":213749,"percent":2}}
$ sleep 1; curl -s …/v2/jobs/job_2 | jq -c '{status, progress, finishedAt, links}'
{"status":"cancelled","progress":{"done":6000,"total":213749,"percent":2},…}
$ sleep 20; curl -s …/v2/jobs/job_1/result
  "status": 410,
  "detail": "Kết quả của việc job_1 chỉ giữ 20 giây sau khi xong; hãy tạo việc mới",
  "code": "RESULT_EXPIRED"`, { sm: true, wrap: 'any' }) + two(http(`# same Idempotency-Key twice
HTTP/1.1 202 Accepted
Location: /v2/jobs/job_1
HTTP/1.1 202 Accepted
Idempotent-Replayed: true
Location: /v2/jobs/job_1`, { sm: true }), box('Write all three down', '<b>Cancel</b> is a request: 202, stops at the next batch (261 ms later); a second cancel ⇒ 409.<br><b>Retention</b>: expiresAt, then 410 Gone (LabFlow: results 1 h, records 7 days).<br><b>Double click</b>: same key ⇒ same job.', 'xanh')) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>114 s export behind a 100 s proxy: client got <b>524</b>, server kept working, a second click doubled the work</li>
<li><b>202 + Location + Retry-After</b> in 17 ms; the job carries status, progress, result, error, links</li>
<li>Other people’s jobs 404 · result too early <b>409</b>, too late <b>410</b> · cancel is 202</li>
<li>The same Idempotency-Key turns a second click into the same job</li>
</ul>
${box('Next', 'Lesson 10.2 — restart the API, kill a worker: where the job really runs.', 'xanh')}` },
]);
