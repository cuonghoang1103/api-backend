/**
 * api-lab-5 — API Design · Chapter 5 lab "Reporting that survives the basement" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s05-tin-cay.mjs › api-5-5-lab. Output = chạy thật lời giải (LABFLOW_DROP_FIRST=1).
 */
import { lamDeck, sql, http, two, box } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 5 — Reliability: idempotency, retries, rate limits', bai: 'Lab 5' };

export const deck = { key: 'api-lab-5', code: 'API Lab 5', title: 'Lab 5 — Reporting that survives the basement', sub: 'Exactly once, rate limited, conflict-safe' };

export const slides = lamDeck(meta, [
  { cover: true, nhan: 'Chapter 5 — Lab', t: 'Lab 5 — Reporting that<br>survives the basement', sub: 'Worst Wi-Fi, most broken devices,<br>two managers at once.' },

  { t: 'The request', to: true, body: `
<ul>
<li>“A tap on ‘Report’ over a bad connection creates <b>exactly one</b> issue, however often the app retries.”</li>
<li>“At most <b>3 reports per minute</b> per student — and tell the app how many are left.”</li>
<li>“Two managers resolving the same issue: the second must <b>see the conflict</b>.”</li>
<li>“Re-opening an unchanged issue should cost nothing.”</li>
</ul>
${box('Everything from Chapter 5', 'Idempotency key (5.1) · client retries (5.2) · per-user limit (5.3) · ETag + If-Match (5.4).', 'xanh')}
${box('Time', 'Design 15 min · build 60 min · prove 20 min. Start from your code at the end of lesson 5.4.', 'lam')}` },

  { t: 'Part A — design, Part B — rules', to: true, body: two(`
<p style="margin:0 0 6px"><b>Part A</b> (DESIGN.md)</p>
<ol>
<li>Middleware order on <code class="i">POST /v2/devices/:id/issues</code>; why a replay costs no token</li>
<li>Headers of the 3rd and 4th report in a minute</li>
<li>ETag of a new / resolved issue; resolve with the old tag ⇒ ?</li>
<li>Your client’s retry rules and timeout</li>
</ol>`, `
<p style="margin:0 0 6px"><b>Part B</b> (rules)</p>
<ol>
<li><code class="i">idempotent()</code> on create; one key per tap</li>
<li><code class="i">reportLimit</code> 3/60 s/user + headers</li>
<li>ETag on GET; If-Match ⇒ 412 on resolve</li>
<li><code class="i">report.mjs</code>: <code class="i">fetchWithRetry</code>, 2 s</li>
<li>Reuse 5.1–5.4, no copies</li>
</ol>`) },

  { t: 'Reference solution', body: two(sql(`// rateLimit.js
export const reportLimit = rateLimit({ name: 'report',
  capacity: 3, windowSec: 60, key: (req) => req.user.id });

// routes/issues.js — auth → idempotency → limit → 404 → 400
  .post(requireAuth, idempotent(), reportLimit, loadDevice,
    validate('body', IssueCreate), (req, res) => { … })

issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'),
    validate('body', IssueResolve), (req, res) => {
    const issue = findIssue(req.params.id);
    checkIfMatch(req, issue);          // old copy ⇒ 412
    if (issue.status === 'RESOLVED') throw new HttpError(409, …);
    issue.status = 'RESOLVED';
    // …
    bump(res, issue);
    res.json(viewsOf(req).issue(issue));
  })`, { lang: 'javascript', sm: true, hl: [6, 13, 17] }), sql(`// report.mjs — one tap = ONE key
const key = randomUUID();
const url = \`…/v2/devices/\${device}/issues\`;
const res = await fetchWithRetry(url, {
  method: 'POST',
  headers: {
    Authorization: 'Bearer tok_an',
    'Content-Type': 'application/json',
    'Idempotency-Key': \`"\${key}"\` },
  body: JSON.stringify({ title,
    severity: 'LOW' }),
}, { timeoutMs: 2000 });`, { lang: 'javascript', sm: true, hl: [2, 8] }) + box('Design answers', 'Replay answered before the limiter ⇒ free · 3rd report <code class="i">r=0</code>, 4th 429 · <code class="i">"iss_1-v1"</code> → <code class="i">"iss_1-v2"</code>; resolve with v1 ⇒ 412.', 'xanh'), 'r46') },

  { t: 'Part C — prove it (real transcript)', body: two(http(`# server: LABFLOW_DROP_FIRST=1
$ node report.mjs dev_1 'Quạt kêu to'
#1 TypeError sau 26 ms
   chờ 154 ms
#2 201 sau 5 ms
kết quả: 201 iss_1 (Idempotent-Replayed)

$ curl -s '…/v2/issues?deviceId=dev_1&status=OPEN' | jq -c '[.data[] | {id, title}]'
[{"id":"iss_1","title":"Quạt kêu to"}]

# three more reports in a row
HTTP/1.1 201 Created|RateLimit: "report";r=1;t=40
HTTP/1.1 201 Created|RateLimit: "report";r=0;t=60
HTTP/1.1 429 Too Many Requests|RateLimit: "report";r=0;t=20|Retry-After: 20`, { sm: true, wrap: true, title: 'steps 1–2 (loop command omitted)' }), http(`$ curl -si …/v2/issues/iss_1 | grep -E '^(HTTP|ETag)'
HTTP/1.1 200 OK
ETag: "iss_1-v1"

$ curl -s -X POST …/v2/issues/iss_1/resolve … -H 'If-Match: "iss_1-v1"' --json '{"resolution":"Đã vệ sinh quạt"}' | jq -c '{id, status, resolution}'
{"id":"iss_1","status":"RESOLVED","resolution":"Đã vệ sinh quạt"}

$ curl -s -X POST …/v2/issues/iss_1/resolve … -H 'If-Match: "iss_1-v1"' … | jq -c '{status, code, currentETag}'
{"status":412,"code":"PRECONDITION_FAILED","currentETag":"\\"iss_1-v2\\""}

$ curl -si …/v2/issues/iss_1 -H 'If-None-Match: "iss_1-v2"' | grep -E '^(HTTP|ETag)'
HTTP/1.1 304 Not Modified
ETag: "iss_1-v2"`, { sm: true, wrap: true, title: 'step 3' }) + box('Read it', 'One issue despite the lost response; only two 201s because step 1 used a token (its replay was free).', 'xanh'), 'r46') },

  { t: 'Rubric — 10 points', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:90px">Pts</th><th>Criterion</th><th style="width:280px">Checked by</th></tr>
<tr><td>3</td><td>Exactly one issue after a lost response; replay marked; one key per tap</td><td>step 1 · code</td></tr>
<tr><td>2</td><td>Per-user limit, correct headers, 429 + Retry-After, replays free</td><td>step 2 · Part A</td></tr>
<tr><td>2</td><td>Strong ETag, If-Match ⇒ 412 without change, version bumped</td><td>step 3</td></tr>
<tr><td>1</td><td>304 for an unchanged issue</td><td>step 3</td></tr>
<tr><td>1</td><td>Client: timeout, transient errors only, backoff + jitter</td><td>code</td></tr>
<tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
</table>
<p style="margin-top:10px">Pass: <b>7/10</b>. Stretch: keys and buckets in PostgreSQL/Redis shared by two processes · a client that reads <code class="i">RateLimit</code>.</p>` },
]);
