/**
 * api-02-1 — API Design · Chapter 2 · Lesson 2.1 "Problem Details (RFC 9457)" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s02-loi-phan-hoi.mjs › api-2-1-problem-details. Output = chạy thật LabFlow (Node 22.23.3, Express 5.3.0).
 * RFC 9457 (07/2023, thay RFC 7807 03/2016) — trích các luật §3.1.1–3.1.5, §3.2, §4.2.1.
 */
import { lamDeck, sql, http, two, box, steps, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 2 — Errors, validation and responses', bai: '2.1' };

export const deck = { key: 'api-02-1', code: 'API 2.1', title: 'Problem Details (RFC 9457)', sub: 'One error format for the whole API' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Problem Details<br>(RFC 9457)', sub: 'One error format for the whole API —<br>built in one file, measured on LabFlow.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Find a real bug: a <b>client mistake that became a 500</b></li>
<li>The web’s standard error shape: <b>type · title · status · detail · instance</b></li>
<li><b>Extension members</b>: machine code, conflicting id, field errors with JSON Pointers</li>
<li>Move every LabFlow error to <code class="i">application/problem+json</code> by editing <b>one file</b></li>
<li>A client that branches on <code class="i">type</code> — never on the text</li>
</ul>` },

  { t: 'Everyday example: shared codes on medical records', to: true, giua: true, body: two(`
<p style="margin-top:0">Every hospital could write diagnoses in its own words — then no other doctor can read your file quickly. <b>Shared codes</b> let any doctor act on any record.</p>
<p>APIs are the same. Home-made error shapes force every client to write a new parser, and every log tool a new rule:</p>`,
  sql(`{ "error": "NOT_FOUND" }
{ "msg": "lab not found", "status": 0 }
{ "success": false, "code": 17 }
{ "errors": [ { "message": "…" } ] }
{ "error": "LAB_NOT_FOUND", "message": "…" }   // LabFlow, Ch 1`, { lang: 'json' }) + box('The fix', 'One standard shape that every client, gateway and log tool already understands: <b>RFC 9457 Problem Details</b>.', 'xanh'), 'r46') },

  { t: 'The bug: a 200 KB body becomes a 500', body: two(http(`$ wc -c big.json
  200104 big.json
$ curl -i -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    -H 'Content-Type: application/json' \\
    --data-binary @big.json
HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8
…

{
  "error": "INTERNAL",
  "message": "Máy chủ gặp lỗi, thử lại sau"
}`, { sm: true, title: 'Chapter 1 code' }), http(`PayloadTooLargeError: request entity too large
    at readStream (…/raw-body/index.js:163:17)
    …
  expected: 200104,
  length: 200104,
  limit: 102400,
  type: 'entity.too.large'
}`, { sm: true, title: 'server log' }) + `<ul style="font-size:20px;margin-top:8px">
<li><code class="i">express.json()</code> refuses bodies over <b>100 KB</b> by default — it already meant <b>413</b></li>
<li>Our handler only knew <code class="i">entity.parse.failed</code> ⇒ everything else became <b>500</b></li>
<li>The client is told to retry; monitoring counts a client error as <b>our</b> incident</li></ul>`, 'r46') },

  { t: 'RFC 9457: the standard shape for HTTP API errors', to: true, giua: true, body: `
<table class="t lon">
<tr><th style="width:230px">When</th><th>What happened</th></tr>
<tr><td><b>March 2016</b></td><td>RFC 7807 defines “Problem Details for HTTP APIs”</td></tr>
<tr><td><b>July 2023</b></td><td><b>RFC 9457</b> obsoletes RFC 7807 — same shape, clearer text</td></tr>
<tr><td>Today</td><td>Spring Framework 6 <code class="i">ProblemDetail</code>, API gateways, many public APIs</td></tr>
</table>
${cards([['One JSON object', 'five standard members + any extensions'], ['One media type', '<code class="i">application/problem+json</code> — a client knows it is an error before reading it'], ['A few rules', 'what is fixed, what changes per request, what clients must ignore']])}` },

  { t: 'Anatomy of a problem (real LabFlow answer)', body: two(http(`HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset=utf-8
Content-Length: 267

{
  "type": "https://labflow.example/problems/booking-conflict",
  "title": "Trùng lịch phòng",
  "status": 409,
  "detail": "Phòng đã có lượt bk_1 trong khung giờ này",
  "instance": "/bookings",
  "code": "BOOKING_CONFLICT",
  "conflictWith": "bk_1"
}`, { title: 'An holds 8–10h; Bình asks for 9–11h' }), `
<table class="t" style="font-size:20px">
<tr><th style="width:150px">Member</th><th>Meaning</th></tr>
<tr><td><b>type</b></td><td>a URI naming the <b>kind</b> of problem — clients branch on it</td></tr>
<tr><td><b>title</b></td><td>short summary, the <b>same every time</b></td></tr>
<tr><td><b>status</b></td><td>repeats the real HTTP code</td></tr>
<tr><td><b>detail</b></td><td>what went wrong <b>this time</b></td></tr>
<tr><td><b>instance</b></td><td>this occurrence (LabFlow: the path)</td></tr>
<tr><td><i>code</i></td><td>extension: machine code kept from Ch 1</td></tr>
<tr><td><i>conflictWith</i></td><td>extension: the booking that blocks this one</td></tr>
</table>`, 'r64') },

  { t: 'The rules that come with the five members', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:150px">Member</th><th>Rule (RFC 9457 §3.1)</th></tr>
<tr><td><b>type</b></td><td>absent ⇒ <code class="i">about:blank</code>; absolute URIs recommended; clients <b>SHOULD NOT</b> dereference it automatically</td></tr>
<tr><td><b>title</b></td><td><b>SHOULD NOT</b> change from occurrence to occurrence, except for localisation</td></tr>
<tr><td><b>status</b></td><td>only advisory — must match the real status line</td></tr>
<tr><td><b>detail</b></td><td>should help the client <b>correct</b> the problem — not debugging information</td></tr>
<tr><td><b>instance</b></td><td>a URI reference; if not dereferenceable, a unique id for this occurrence</td></tr>
</table>
${two(box('about:blank', '“No meaning beyond the status code” — then <code class="i">title</code> is the standard phrase, e.g. <i>Not Found</i>. Use it for generic failures.', 'lam'), box('Dashboards vs people', 'Group errors by <b>type / title</b>; people read <b>detail</b>.', 'xanh'))}` },

  { t: 'Extension members: errors with JSON Pointers', body: two(http(`$ curl -s -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_1","startAt":"02/11/2026 8:00"}'
{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "Dữ liệu gửi lên chưa đúng định dạng",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/startAt",
      "detail": "must be ISO 8601 with timezone"
    },
    {
      "pointer": "#/endAt",
      "detail": "must be ISO 8601 with timezone"
    }
  ]
}`, { sm: true }), `
<ul style="font-size:21px">
<li>Any extra member is an <b>extension</b>; clients <b>MUST ignore</b> the ones they do not know</li>
<li><code class="i">errors</code> mirrors the RFC’s own example: <code class="i">detail</code> + <code class="i">pointer</code></li>
<li><b>JSON Pointer</b> (RFC 6901): <code class="i">#/startAt</code> = member of the body; <code class="i">#/profile/color</code> = nested</li>
<li>A form maps the pointer straight to the input to highlight</li>
</ul>
${box('One problem per response', 'Field errors are one problem (“the body is invalid”). A 401 and a 404 together are not — answer the first in your order of checks.', 'lam')}`, 'r64') },

  { t: 'Build it: one file decides every error', body: sql(`// problems.js — RFC 9457 Problem Details
import { STATUS_CODES } from 'node:http';
export const PROBLEM_BASE = 'https://labflow.example/problems/';
const TITLES = {                 // the ONLY place titles live
  BOOKING_CONFLICT: 'Trùng lịch phòng',
  LAB_NOT_FOUND: 'Không tìm thấy phòng lab',
  /* … one line per code … */
};

// 'BOOKING_CONFLICT' ⇒ 'https://labflow.example/problems/booking-conflict'
export const typeOf = (code) => PROBLEM_BASE + code.toLowerCase().replaceAll('_', '-');

export function sendProblem(req, res, { status, code, detail, ...extra }) {
  res.status(status)
    .type('application/problem+json')
    .json({ type: typeOf(code), title: TITLES[code] ?? STATUS_CODES[status],
            status, detail, instance: req.originalUrl, code, ...extra });
}`, { lang: 'javascript', hl: [11, 14, 15, 16] }) + `<p style="margin:8px 0 0;font-size:21px"><code class="i">TITLES</code> is the only place titles live · <code class="i">type</code> and <code class="i">code</code> come from <b>one value</b>, so they can never disagree.</p>` },

  { t: 'Build it: the error handler at the end of app.js', body: sql(`app.use((req, res) => sendProblem(req, res,
  { status: 404, code: 'ROUTE_NOT_FOUND', detail: \`Không có \${req.method} \${req.path}\` }));

app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    const more = Array.isArray(err.details)
      ? { errors: err.details.map((d) => ({ pointer: \`#/\${d.field}\`, detail: d.issue })) }
      : err.details;                                         // { conflictWith: 'bk_1' }
    return sendProblem(req, res, { status: err.status, code: err.error, detail: err.message, ...more });
  }
  if (err.type === 'entity.parse.failed') return sendProblem(req, res, { status: 400, code: 'MALFORMED_JSON', … });
  if (err.type === 'entity.too.large')
    return sendProblem(req, res, { status: 413, code: 'PAYLOAD_TOO_LARGE',
      detail: \`Body tối đa \${err.limit} byte, nhận \${err.length} byte\` });
  console.error(err);                      // details stay in the server log
  sendProblem(req, res, { status: 500, code: 'INTERNAL', detail: 'Máy chủ gặp lỗi, thử lại sau' });
});`, { lang: 'javascript', sm: true, hl: [12, 13, 14] }) + `<p style="margin:8px 0 0;font-size:21px">Routes do <b>not change</b>: they keep throwing <code class="i">HttpError</code>. One function ⇒ the 413 bug disappears <b>everywhere at once</b>.</p>` },

  { t: 'Try it: 404 and the fixed 413', body: two(http(`$ curl -i http://localhost:4000/labs/lab_9
HTTP/1.1 404 Not Found
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
…

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Không tìm thấy phòng lab",
  "status": 404,
  "detail": "Không có phòng lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}`, { sm: true, wrap: true }), http(`$ curl -i -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    -H 'Content-Type: application/json' \\
    --data-binary @big.json
HTTP/1.1 413 Payload Too Large
Content-Type: application/problem+json; charset=utf-8
Content-Length: 233
…

{
  "type": "https://labflow.example/problems/payload-too-large",
  "title": "Body quá lớn",
  "status": 413,
  "detail": "Body tối đa 102400 byte, nhận 200104 byte",
  "instance": "/bookings",
  "code": "PAYLOAD_TOO_LARGE"
}`, { sm: true, wrap: true })) + `<p class="nho" style="margin:6px 0 0">Express keeps the type set by <code class="i">res.type()</code> and only appends <code class="i">charset=utf-8</code>. RFC 9110 names 413 “Content Too Large”; Node prints the older phrase.</p>` },

  { t: 'Headers set before the error survive', body: two(http(`$ curl -i -X DELETE http://localhost:4000/labs/lab_1
HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: application/problem+json; charset=utf-8
…

{
  "type": "https://labflow.example/problems/method-not-allowed",
  "title": "Phương thức không được hỗ trợ",
  "status": 405,
  "detail": "DELETE không dùng được ở /labs/lab_1",
  "instance": "/labs/lab_1",
  "code": "METHOD_NOT_ALLOWED"
}`, { sm: true, wrap: true }), http(`$ curl -i http://localhost:4000/bookings
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
Content-Type: application/problem+json; charset=utf-8
…

{
  "type": "https://labflow.example/problems/unauthenticated",
  "title": "Cần đăng nhập",
  "status": 401,
  "detail": "Cần đăng nhập (thiếu hoặc sai token)",
  "instance": "/bookings",
  "code": "UNAUTHENTICATED"
}`, { sm: true, wrap: true })) + `<p style="margin:8px 0 0;font-size:21px"><code class="i">Allow</code> (405) and <code class="i">WWW-Authenticate</code> (401) are still required by RFC 9110 — the problem body only <b>adds</b> to them.</p>` },

  { t: 'Which URI for type?', to: true, giua: true, body: steps([
    '<b>A domain you control.</b> LabFlow uses <code class="i">labflow.example</code> — <code class="i">.example</code> is reserved for documentation (RFC 2606). Your project: <code class="i">https://api.your-app.com/problems/…</code>',
    '<b>Ideally a page that explains the error</b> to a developer who opens it — cause and fix. Clients never fetch it automatically; it is an <b>identifier</b> first (Chapter 7 generates the pages).',
    '<b>Stable forever.</b> Changing a <code class="i">type</code> breaks every client that branches on it — like renaming a field (Chapter 4).',
  ]) + box('Avoid', '<code class="i">http://localhost:4000/…</code> (not stable) · an id inside the type (<code class="i">…/lab-not-found/lab_9</code>) · a different URI per environment.', 'do2') },

  { t: 'A client that reads problems', body: sql(`const ct = res.headers.get('content-type') ?? '';
if (!ct.startsWith('application/problem+json')) throw new Error(\`Lỗi lạ \${res.status}: \${ct}\`);
const p = await res.json();
switch (p.type) {
  case 'https://labflow.example/problems/booking-conflict':
    return { ok: false, ui: \`Phòng bận (trùng \${p.conflictWith}). Chọn giờ khác nhé.\` };
  case 'https://labflow.example/problems/validation-failed':
    return { ok: false, ui: 'Kiểm lại: ' + p.errors.map((e) => e.pointer.slice(2)).join(', ') };
  default:
    return { ok: false, ui: p.title };   // unknown type: every problem still has a title
}`, { lang: 'javascript', sm: true, hl: [4, 9, 10] }) + two(http(`$ node client.mjs
{ ok: true, booking: { id: 'bk_1', …, status: 'PENDING', … } }
{ ok: false, ui: 'Phòng bận (trùng bk_1). Chọn giờ khác nhé.' }
{ ok: false, ui: 'Kiểm lại: startAt, endAt' }
{ ok: false, ui: 'Phòng lab không tồn tại' }`, { sm: true }), `<ul style="font-size:20px;margin:0">
<li>check <code class="i">res.ok</code>, then the media type, then <code class="i">type</code></li>
<li>never branch on <code class="i">title</code>/<code class="i">detail</code> — they get reworded and translated</li>
<li>last line: <code class="i">unknown-lab</code> has no <code class="i">case</code> ⇒ falls back to <code class="i">title</code>, survives new error types</li></ul>`, 'r64') },

  { t: 'Traps: detail as a debug channel, title per occurrence', to: true, body: vsd(sql(`{
  "type": ".../internal",
  "title": "Lab lab_9 not found",
  "detail": "TypeError: Cannot read properties of
    undefined at /srv/labflow/src/app.js:20 —
    SELECT * FROM labs WHERE id = 'lab_9'"
}`, { lang: 'json', sm: true }) + `<ul style="font-size:20px;margin-top:8px">
<li>stack, file paths, SQL reach every client — and every attacker</li>
<li>an id in the title ⇒ a dashboard sees a thousand different errors</li></ul>`,
  sql(`{
  "type": "https://labflow.example/problems/
           lab-not-found",
  "title": "Không tìm thấy phòng lab",
  "detail": "Không có phòng lab lab_9",
  "instance": "/labs/lab_9"
}`, { lang: 'json', sm: true }) + `<ul style="font-size:20px;margin-top:8px">
<li><code class="i">detail</code> helps the client <b>correct</b> the request</li>
<li>ids go in <code class="i">detail</code> or extensions; <code class="i">title</code> stays fixed</li>
<li>debug details: the <b>server log</b>, found via <code class="i">instance</code></li></ul>`, '✗ leaks and fragments', '✓ LabFlow') },

  { t: '400 or 422 for fields? And the same idea in Spring', to: true, giua: true, body: two(box('400 or 422?', `
<p>RFC 9457’s own validation example answers <b>422 Unprocessable Content</b>.</p>
<p>LabFlow: <b>400</b> = wrong <b>shape</b> · <b>422</b> = well-formed but meaningless (lesson 1.3).</p>
<p>Both are used by large public APIs; the RFC example is an illustration, not a rule. Write your choice down — one file now makes it identical everywhere.</p>`, 'lam'),
  box('Spring Framework 6 / Spring Boot', `
<p><code class="i">ProblemDetail</code>: “a representation for an RFC 9457 problem detail”, returned from any <code class="i">@ExceptionHandler</code>.</p>
<p><code class="i">instance</code> is set from the request path — like ours — and it is sent as <code class="i">application/problem+json</code>.</p>
<p><code class="i">spring.mvc.problemdetails.enabled=true</code>: the framework’s own errors use the same format.</p>`, 'xanh')) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Every error, every endpoint: <b>one shape</b> — <code class="i">application/problem+json</code></li>
<li><b>type</b> identifies the kind · <b>title</b> fixed · <b>detail</b> this request · <b>status</b> repeats the code</li>
<li>Extensions carry the rest; clients <b>ignore</b> what they do not know</li>
<li><b>One function</b> produces every problem — that is how the 413 bug vanished</li>
<li>Clients branch on <code class="i">type</code>/<code class="i">code</code>, never on text; no stack traces in <code class="i">detail</code></li>
</ul>
${box('Next', 'Lesson 2.2 — validating input at the edge: six requests that should never have worked.', 'xanh')}` },
]);
