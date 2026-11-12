/**
 * api-lab-10 — API Design · Chapter 10 · Lab 10 "Usage report as a background job with a webhook" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s10-bat-dong-bo.mjs › api-10-7-lab. Output = chạy thật lab/grade-lab10.mjs trên bản khởi đầu và lời giải.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 10 — Async and realtime', bai: 'Lab 10' };

export const deck = { key: 'api-lab-10', code: 'API Lab 10', title: 'Lab 10 — Report job with a webhook', sub: 'Change the contract, not the computation' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Lab 10: the usage report<br>as a background job', sub: '202, progress, cancel, retention —<br>and a signed webhook when it is ready.' },

  { t: 'Starting point and seven tasks', body: sql(`reportExportsRouter.route('/')
  .post(validate('body', Body), async (req, res) => {
    const json = await usageReport(req.valid.body);              // waits until done
    res.type('application/json').send(json);
  })`, { lang: 'javascript', sm: true, hl: [3] }) + http(`$ curl -s -o /dev/null -w '%{http_code}, %{size_download} bytes in %{time_total} s\\n' -X POST …/v2/reports/usage/exports --json '{"from":"2027-01-01","days":92}'
200, 302812 bytes in 23.246151 s`, { sm: true, wrap: 'any', title: 'starter: 50 labs × 92 days, one attendance call per day' }) + cards([
    ['202 + job (2)', '< 500 ms, Location, Retry-After; same Idempotency-Key ⇒ same job'],
    ['Who (1)', 'students 403; someone else’s job 404'],
    ['Status (1)', 'running → succeeded; progress per day, never backwards'],
    ['Result (2)', 'days × 50 rows that match SQL'],
    ['Cancel (1)', 'a 92-day report stops within 3 s; result 409'],
    ['Webhook (2) · Retention (1)', 'signed report.ready to the creator only; expiresAt + OpenAPI/AsyncAPI'],
  ]) },

  { t: 'Rubric and the grading script', body: cards([
    ['202 + idempotency — 2', '202 under 500 ms with Location and Retry-After; same key ⇒ Idempotent-Replayed.'],
    ['Authorization — 1', 'Student 403 on create, 404 on someone else’s job.'],
    ['Status — 1', 'running → succeeded, monotonic progress, Retry-After until final.'],
    ['Result — 2', '14 × 50 = 700 rows; three sampled rows equal a direct SQL count.'],
    ['Cancel — 1 · Retention — 1', 'Cancelled within 3 s, result 409 · expiresAt after finishedAt; contract entries.'],
    ['Webhook — 2', 'report.ready for the right job, signature valid, nothing for the cancelled job.'],
  ]) + http(`$ node lab/grade-lab10.mjs                  # against the starter
✗ 0/1  POST trả 202 trong < 500 ms, có Location /v2/jobs/{id} và Retry-After — 200, 3538 ms,
✗ 0/2  Webhook labflow.report.ready.v1 tới đúng việc, chữ ký hợp lệ; việc bị huỷ không báo — 0 webhook, chữ ký SAI, không thấy
…
Điểm: 0/10`, { sm: true, wrap: 'any', title: 'own receiver on :4006 · a 14-day report · a 92-day report to cancel' }) },

  { t: 'The reference solution', giua: true, body: sql(`reportExportsRouter.route('/')
  .post(idempotent(), validate('body', Body), async (req, res) => {
    const job = await createJob('usage-report', req.valid.body, req.user.id);
    const base = \`/v\${req.apiVersion}/jobs\`;
    res.status(202).location(\`\${base}/\${job.id}\`)
      .set('Retry-After', process.env.JOB_POLL_SEC ?? '2').json(toJob(job, base));
  })
// src/tasks.js
'usage-report': { run: usageReport, type: 'application/json', event: 'labflow.report.ready.v1' },
// src/reportTask.js › usageReport — once per day
if (signal?.aborted) throw new Cancelled();
…
await progress(d + 1, days);`, { lang: 'javascript', sm: true, hl: [3, 9, 11] }) + two(box('✗ The webhook goes to everyone', 'No owner in the event ⇒ the dispatcher (10.5) sends report.ready to every manager. Put the creator in it; keep it thin: a link, not the rows.', 'do2'), box('✗ Cancelling only the queue', 'A running job must check the abort signal between days, or it says “cancelled” and keeps calling attendance for 20 s.', 'do2')) },

  { t: 'Measured: the solution', body: http(`$ curl -s -i -X POST …/v2/reports/usage/exports --json '{"from":"2027-01-01","days":92}' | grep -iE …
HTTP/1.1 202 Accepted
Location: /v2/jobs/job_1
Retry-After: 2
Server-Timing: validate;dur=1.43, total;dur=16.09`, { sm: true, wrap: 'any' }) + http(`$ node lab/grade-lab10.mjs
✓ 1/1  POST trả 202 trong < 500 ms, có Location /v2/jobs/{id} và Retry-After — 202, 6 ms, /v2/jobs/job_2
✓ 1/1  Gửi lại cùng Idempotency-Key ⇒ cùng việc, Idempotent-Replayed
✓ 1/1  Sinh viên không tạo được (403) và không xem được việc của người khác (404) — 403, 404
✓ 1/1  Trạng thái đi queued/running → succeeded, tiến độ không lùi, Retry-After khi chưa xong — running → succeeded
✓ 2/2  Kết quả JSON đủ 14 × 50 dòng, số liệu khớp SQL — 700 dòng, mẫu 31/31/30 vs SQL 31/31/30
✓ 1/1  Huỷ việc đang chạy ⇒ cancelled trong 3 s; lấy kết quả ⇒ 409 — cancelled, 5%, result 409
✓ 2/2  Webhook labflow.report.ready.v1 tới đúng việc, chữ ký hợp lệ; việc bị huỷ không báo — 1 webhook, chữ ký hợp lệ, …
✓ 1/1  Kết quả có expiresAt (sau finishedAt) — hợp đồng nói kết quả giữ bao lâu — 2026-11-01T02:33:25.814Z

Điểm: 10/10`, { sm: true, wrap: 'any' }) + box('Starter → solution', '23.3 s holding a connection ⇒ 202 in 6–16 ms; one signed webhook, none for the cancelled job.', 'xanh') },

  { t: 'What this lab shows', to: true, giua: true, body: `
<ul>
<li>Same computation, new contract: <b>23.3 s</b> of waiting became a <b>202 in 6 ms</b></li>
<li>Idempotency, authorization, progress, cancel, retention: old rules on a job resource</li>
<li>The webhook reached only the creator — signed, thin; the cancelled report sent nothing</li>
<li>The grader: <b>0/10</b> for the starter, <b>10/10</b> for the solution</li>
</ul>
${two(box('Why is report.ready thin?', '46–300 KB, private to its creator, already at a URL that checks the token. Campus data in a webhook would sit in logs for years.', 'lam'), box('Download', 'labflow-api-ch10-b.zip — chapter code = this lab’s solution, plus lab/report-exports-starter.js and lab/grade-lab10.mjs.', 'xanh'))}` },
]);
