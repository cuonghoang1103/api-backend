/**
 * API Design — Chương 2: Lỗi, kiểm dữ liệu và phản hồi (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, Zod 4.6.7, curl 8.7.1, macOS. Mã cuối chương = lời giải Lab 2 (bài 2.5).
 * Slide: api-02-1 … api-02-4 + api-lab-2 (scripts/slides-src; api-02-3 ở API/v2); giảng EN/VI ở ./giang/.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-2-1-problem-details, api-2-2-validation, api-2-3-envelope, api-2-4-i18n và title chương.
 */

import G021 from './giang/api-02-1.mjs';
import G022 from './giang/api-02-2.mjs';
import G023 from './giang/api-02-3.mjs';
import G024 from './giang/api-02-4.mjs';
import GL2 from './giang/api-lab-2.mjs';

export default {
  title: 'Chapter 2 — Errors, validation and responses|||Chương 2 — Lỗi, kiểm dữ liệu và phản hồi',
  description: 'Một định dạng lỗi cho cả API (RFC 9457 Problem Details), kiểm dữ liệu ở cửa bằng schema Zod (415/413/400, object strict chống mass assignment), hình dạng response ổn định qua view, lỗi song ngữ theo Accept-Language và xử lý chữ tiếng Việt (NFC/NFD, đ, sắp xếp) — trên LabFlow API chạy thật; lab có rubric và quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Problem Details (RFC 9457): one error format for the whole API|||2.1 — Problem Details (RFC 9457): một định dạng lỗi cho cả API',
      slug: 'api-2-1-problem-details',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tìm bug 413 thành 500, chuyển mọi lỗi của LabFlow sang application/problem+json (type, title, status, detail, instance, trường mở rộng, JSON Pointer) bằng một tệp, và viết client rẽ nhánh theo type.',
      content: `${G021}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Problem Details (RFC 9457): one error format for the whole API</h2>
<p class="lead">A client spends more code on errors than on success: it must show the right message, highlight the right field, retry or give up. That is only possible if every error of every endpoint has the same shape. In Chapter 1 LabFlow invented its own shape and it mostly worked — until a request it did not expect turned a client mistake into a 500. In this lesson you find that bug, then move the whole API to the standard error format of the web, RFC 9457, by changing one file.</p>

<div class="callout ok">
<p><strong>After Chapter 2 you can:</strong></p>
<ul>
  <li>return every error in one standard shape (RFC 9457) with a machine-readable code;</li>
  <li>validate input at the edge and report every field error at once;</li>
  <li>decide exactly which fields leave the server;</li>
  <li>serve error messages in the caller’s language without breaking clients.</li>
</ul>
<p><strong>Why it matters:</strong> Clients spend most of their code on errors; a predictable error format is what makes an API pleasant — and it closes the holes attackers try first.</p>
</div>

<h3>Why a standard, if our own shape works?</h3>
<p>Think of medical records. Every hospital could write diagnoses in its own words, but then a doctor in another city cannot read your file quickly. Shared codes let any doctor act on any record. Errors are the same: if each API invents <code>{"error": …}</code>, <code>{"msg": …}</code>, <code>{"success": false, "code": 17}</code>, every client needs a new parser and every log tool a new rule.</p>
<p>The IETF published a shared shape for HTTP API errors in March 2016 as RFC 7807, and replaced it in July 2023 with <strong>RFC 9457 “Problem Details for HTTP APIs”</strong> (RFC 9457 says it obsoletes RFC 7807; the shape is the same, the text is clearer). It defines a JSON object, a media type — <code>application/problem+json</code> — and a few rules. Spring Framework 6 supports it natively, many API gateways produce it, and interviewers ask about it.</p>

<h3>First, the bug: a client mistake that became a 500</h3>
<p><code>express.json()</code> refuses bodies larger than <strong>100 KB by default</strong>. What does Chapter 1’s LabFlow do with one? Create a 200 KB booking and send it (this is the end-of-Chapter-1 code, unchanged):</p>
<pre><code class="language-bash">node -e "require('fs').writeFileSync('big.json', JSON.stringify({ labId: 'lab_1', startAt: '2026-11-05T08:00:00+07:00', endAt: '2026-11-05T10:00:00+07:00', purpose: 'x'.repeat(200000) }))"</code></pre>
<pre><code class="language-bash">wc -c big.json</code></pre>
<div class="out">  200104 big.json</div>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: application/json' \\
  --data-binary @big.json</code></pre>
<div class="out">HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-OPvq4uFWrS3OFyeJLrxQ0lr6I3Q"
Date: Sat, 31 Oct 2026 17:48:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "INTERNAL",
  "message": "Máy chủ gặp lỗi, thử lại sau"
}</div>
<p>The server log shows what really happened:</p>
<div class="out">PayloadTooLargeError: request entity too large
    at readStream (…/node_modules/raw-body/index.js:163:17)
    …
  expected: 200104,
  length: 200104,
  limit: 102400,
  type: 'entity.too.large'
}</div>
<p>Express already knew the right answer — <code>413 Content Too Large</code>, with the limit and the real length attached — but our error handler only recognised <code>entity.parse.failed</code>, so everything else fell through to “our fault, 500”. Two consequences: the client is told to retry something that will fail forever, and our monitoring counts a client mistake as a server incident. This is what happens when every error is formatted by hand in different places; we fix it at the same time as the format.</p>

<h3>RFC 9457 in five members</h3>
<table>
  <thead><tr><th>Member</th><th>What it is</th><th>LabFlow example</th><th>Rule from the RFC</th></tr></thead>
  <tbody>
    <tr><td><code>type</code></td><td>a URI that identifies the <em>kind</em> of problem — the thing clients branch on</td><td><code>https://labflow.example/problems/booking-conflict</code></td><td>absent ⇒ <code>about:blank</code>; absolute URIs recommended; clients SHOULD NOT dereference it automatically</td></tr>
    <tr><td><code>title</code></td><td>a short human summary of the type</td><td><code>Trùng lịch phòng</code></td><td>SHOULD NOT change from occurrence to occurrence, except for localisation</td></tr>
    <tr><td><code>status</code></td><td>the HTTP status code, repeated in the body</td><td><code>409</code></td><td>advisory only; it must match the real status line</td></tr>
    <tr><td><code>detail</code></td><td>what went wrong <em>this time</em></td><td><code>Phòng đã có lượt bk_1 trong khung giờ này</code></td><td>should help the client correct the problem, not give debugging information</td></tr>
    <tr><td><code>instance</code></td><td>identifies this occurrence</td><td><code>/bookings</code></td><td>a URI reference; if not dereferenceable it serves as a unique identifier</td></tr>
  </tbody>
</table>
<p>All five are optional, but a useful problem has at least <code>type</code>, <code>title</code> and <code>status</code>. The split between <code>title</code> (same every time) and <code>detail</code> (specific to this request) matters: dashboards group errors by <code>type</code>/<code>title</code>, people read <code>detail</code>.</p>
<p>The special value <code>about:blank</code> means “no extra meaning beyond the status code” — then <code>title</code> should be the standard phrase, such as <code>Not Found</code>. Use it for generic failures; give a real type to every error a client might handle differently.</p>

<h3>Extension members: everything else you need</h3>
<p>A problem may carry any other members, called <strong>extensions</strong>. The RFC is strict about one thing: clients <strong>MUST ignore</strong> extensions they do not recognise. That is what makes adding a member safe. LabFlow uses three:</p>
<ul>
  <li><code>code</code> — the machine code from Chapter 1 (<code>BOOKING_CONFLICT</code>). Strictly, <code>type</code> is the identifier; we keep <code>code</code> because it is short to log and to <code>switch</code> on, and because Chapter 1 clients already know it. Both are generated from the same value in one function, so they can never disagree.</li>
  <li><code>conflictWith</code> — the id of the booking that blocks this one, so the app can link to it.</li>
  <li><code>errors</code> — one entry per invalid field. This mirrors the example in RFC 9457 §3, where each entry has a <code>detail</code> and a <code>pointer</code> such as <code>#/age</code>. The pointer is a <strong>JSON Pointer</strong> (RFC 6901) written as a URI fragment: <code>#/startAt</code> is the member <code>startAt</code> of the body, <code>#/profile/color</code> a nested one. A front-end can map it straight to the form field to highlight.</li>
</ul>
<div class="callout warn"><p><strong>Only one problem per response.</strong> RFC 9457 recommends describing the most relevant or urgent problem rather than a “batch” of different ones. A list of field errors is fine — they are all the same type, “the body is invalid”. A 401 and a 404 at the same time is not: answer the first one in your order of checks.</p></div>

<h3>Build it: one file decides every error</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">route</span><span class="lz-t">throws HttpError</span><span class="lz-d">status + code + params</span></div>
  <div class="lz-step"><span class="lz-k">error middleware</span><span class="lz-t">one place</span><span class="lz-d">also turns parse errors into 400, big bodies into 413</span></div>
  <div class="lz-step"><span class="lz-k">sendProblem</span><span class="lz-t">builds the body</span><span class="lz-d">type · title · status · detail · instance · code</span></div>
  <div class="lz-step"><span class="lz-k">client</span><span class="lz-t">reads code</span><span class="lz-d">never parses the human text</span></div>
</div>
<p>Create <code>src/problems.js</code>. The <code>TITLES</code> table is the only place where error titles live; <code>typeOf</code> derives the URI from the code; <code>sendProblem</code> writes the response:</p>
<pre><code class="language-javascript">// problems.js — RFC 9457 Problem Details: MỘT chỗ quyết định một lỗi trông thế nào
import { STATUS_CODES } from 'node:http';

export const PROBLEM_BASE = 'https://labflow.example/problems/';

// title: câu NGẮN cho người đọc, giống hệt nhau ở mọi lần lỗi này xảy ra (RFC 9457 §3.1.3).
// Câu riêng của từng lần (id nào, giờ nào) để ở detail.
const TITLES = {
  VALIDATION_FAILED: 'Dữ liệu gửi lên không hợp lệ',
  MALFORMED_JSON: 'Body không phải JSON hợp lệ',
  UNKNOWN_QUERY_PARAM: 'Tham số truy vấn không được hỗ trợ',
  UNAUTHENTICATED: 'Cần đăng nhập',
  FORBIDDEN: 'Không đủ quyền',
  LAB_NOT_FOUND: 'Không tìm thấy phòng lab',
  DEVICE_NOT_FOUND: 'Không tìm thấy thiết bị',
  BOOKING_NOT_FOUND: 'Không tìm thấy lượt đặt',
  ISSUE_NOT_FOUND: 'Không tìm thấy báo hỏng',
  ROUTE_NOT_FOUND: 'Không có endpoint này',
  METHOD_NOT_ALLOWED: 'Phương thức không được hỗ trợ',
  BOOKING_CONFLICT: 'Trùng lịch phòng',
  ALREADY_CANCELLED: 'Lượt đặt đã huỷ',
  ALREADY_RESOLVED: 'Báo hỏng đã xử lý',
  DUPLICATE_SERIAL: 'Trùng số serial',
  LAB_RETIRED: 'Phòng lab đã ngừng sử dụng',
  PAYLOAD_TOO_LARGE: 'Body quá lớn',
  UNSUPPORTED_MEDIA_TYPE: 'Kiểu nội dung không được hỗ trợ',
  INVALID_TIME_RANGE: 'Khoảng thời gian không hợp lệ',
  UNKNOWN_LAB: 'Phòng lab không tồn tại',
  INTERNAL: 'Lỗi máy chủ',
};

// 'BOOKING_CONFLICT' ⇒ 'https://labflow.example/problems/booking-conflict'
export const typeOf = (code) =&gt; PROBLEM_BASE + code.toLowerCase().replaceAll('_', '-');

export function sendProblem(req, res, { status, code, detail, ...extra }) {
  res.status(status)
    .type('application/problem+json')        // KHÔNG phải application/json
    .json({
      type: typeOf(code),                     // định danh loại lỗi — client rẽ nhánh theo đây
      title: TITLES[code] ?? STATUS_CODES[status],
      status,                                 // nhắc lại mã HTTP (chỉ để tham khảo)
      detail,                                 // chuyện gì xảy ra LẦN NÀY
      instance: req.originalUrl,              // lần xảy ra này: request nào
      code,                                   // mở rộng của LabFlow: mã cũ từ Chương 1
      ...extra,                               // mở rộng khác: errors, conflictWith…
    });
}</code></pre>
<p>Then replace the end of <code>src/app.js</code> — the 404 catch-all and the error handler. Routes do not change at all: they keep throwing <code>HttpError</code> with the same arguments.</p>
<pre><code class="language-javascript">import { sendProblem } from './problems.js';
// …routes as before…

app.use((req, res) =&gt; {
  sendProblem(req, res, { status: 404, code: 'ROUTE_NOT_FOUND', detail: &#96;Không có \${req.method} \${req.path}&#96; });
});

// Một chỗ duy nhất biến MỌI lỗi thành application/problem+json
app.use((err, req, res, next) =&gt; {
  if (err instanceof HttpError) {
    const more = Array.isArray(err.details)
      ? { errors: err.details.map((d) =&gt; ({ pointer: &#96;#/\${d.field}&#96;, detail: d.issue })) }   // lỗi từng trường
      : err.details;                                                                       // thành viên mở rộng khác
    return sendProblem(req, res, { status: err.status, code: err.error, detail: err.message, ...more });
  }
  if (err.type === 'entity.parse.failed') {   // express.json không đọc được body
    return sendProblem(req, res, { status: 400, code: 'MALFORMED_JSON', detail: 'Body không phải JSON hợp lệ' });
  }
  if (err.type === 'entity.too.large') {      // body vượt giới hạn của express.json
    return sendProblem(req, res, { status: 413, code: 'PAYLOAD_TOO_LARGE', detail: &#96;Body tối đa \${err.limit} byte, nhận \${err.length} byte&#96; });
  }
  console.error(err);                         // chi tiết thật chỉ nằm trong log của server
  sendProblem(req, res, { status: 500, code: 'INTERNAL', detail: 'Máy chủ gặp lỗi, thử lại sau' });
});</code></pre>
<p>Two small changes elsewhere. In <code>src/http.js</code> the fourth argument of <code>HttpError</code> may now be either the array of field errors or an object of extension members. In <code>src/routes/bookings.js</code> the conflict carries the blocking id:</p>
<pre><code class="language-javascript">if (clash) throw new HttpError(409, 'BOOKING_CONFLICT', &#96;Phòng đã có lượt \${clash.id} trong khung giờ này&#96;, { conflictWith: clash.id });</code></pre>

<h3>Try it</h3>
<p>Restart the server. An unknown lab:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
ETag: W/"de-n7A1XrnCUccoJT3bD1Syj4y0bkQ"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Không tìm thấy phòng lab",
  "status": 404,
  "detail": "Không có phòng lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>
<p>Three things to notice. The media type is <code>application/problem+json</code>: Express keeps a type you set with <code>res.type()</code> and only adds <code>charset=utf-8</code>. <code>instance</code> is the path that failed. And <code>code</code> is still there for Chapter 1 clients.</p>
<p>A conflict — An books 8:00–10:00, then Bình asks for 9:00–11:00:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"SWT301 Lab 3"}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T09:00:00+07:00","endAt":"2026-11-02T11:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset=utf-8
Content-Length: 267
ETag: W/"10b-ZHrqMs1+uIYZF1aNLzRZ8dEGmhU"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/booking-conflict",
  "title": "Trùng lịch phòng",
  "status": 409,
  "detail": "Phòng đã có lượt bk_1 trong khung giờ này",
  "instance": "/bookings",
  "code": "BOOKING_CONFLICT",
  "conflictWith": "bk_1"
}</div>
<p>Field errors now use JSON Pointers:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"02/11/2026 8:00"}'</code></pre>
<div class="out">{
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
}</div>
<p>The 200 KB body — the bug from the start of the lesson — is now a proper 413 that tells the client the limit:</p>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: application/json' \\
  --data-binary @big.json</code></pre>
<div class="out">HTTP/1.1 413 Payload Too Large
Content-Type: application/problem+json; charset=utf-8
Content-Length: 233
ETag: W/"e9-3MMIWkatekATvILvuBNxPo6TxYY"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/payload-too-large",
  "title": "Body quá lớn",
  "status": 413,
  "detail": "Body tối đa 102400 byte, nhận 200104 byte",
  "instance": "/bookings",
  "code": "PAYLOAD_TOO_LARGE"
}</div>
<p>Headers set before the error survive: the 405 keeps <code>Allow</code>, the 401 keeps <code>WWW-Authenticate</code>.</p>
<pre><code class="language-bash">curl -i -X DELETE http://localhost:4000/labs/lab_1</code></pre>
<div class="out">HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: application/problem+json; charset=utf-8
Content-Length: 262
ETag: W/"106-Gc+Bcoiz1mAAzgnw7r19i3x+R+Q"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/method-not-allowed",
  "title": "Phương thức không được hỗ trợ",
  "status": 405,
  "detail": "DELETE không dùng được ở /labs/lab_1",
  "instance": "/labs/lab_1",
  "code": "METHOD_NOT_ALLOWED"
}</div>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings</code></pre>
<div class="out">HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
Content-Type: application/problem+json; charset=utf-8
Content-Length: 233
ETag: W/"e9-3u1HHKIRbQ14VvjcB9t7BxVO6Hc"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/unauthenticated",
  "title": "Cần đăng nhập",
  "status": 401,
  "detail": "Cần đăng nhập (thiếu hoặc sai token)",
  "instance": "/bookings",
  "code": "UNAUTHENTICATED"
}</div>
<p>Unknown URLs and broken JSON follow the same format, so a client never has to guess:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/rooms</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/route-not-found",
  "title": "Không có endpoint này",
  "status": 404,
  "detail": "Không có GET /rooms",
  "instance": "/rooms",
  "code": "ROUTE_NOT_FOUND"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId": "lab_1",}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/malformed-json",
  "title": "Body không phải JSON hợp lệ",
  "status": 400,
  "detail": "Body không phải JSON hợp lệ",
  "instance": "/bookings",
  "code": "MALFORMED_JSON"
}</div>

<h3>Which URI for <code>type</code>?</h3>
<ul>
  <li><strong>A domain you control.</strong> LabFlow uses <code>labflow.example</code>, because <code>.example</code> is reserved for documentation (RFC 2606) and can never belong to anyone. In your project use your real API domain, e.g. <code>https://api.your-app.com/problems/booking-conflict</code>.</li>
  <li><strong>Ideally a page that explains the error</strong> to a developer who pastes it into a browser: what causes it, how to fix it. Clients must not fetch it automatically; it is an identifier first. Chapter 7 generates these pages from the OpenAPI file.</li>
  <li><strong>Stable forever.</strong> Changing a <code>type</code> breaks every client that branches on it — exactly like renaming a field (Chapter 4).</li>
</ul>

<h3>A client that reads problems</h3>
<p>Here is what the format buys on the other side. A small Node 22 client using the built-in <code>fetch</code>: it checks <code>res.ok</code>, checks the media type, then branches on <code>type</code> — never on the human text, which may be reworded or translated (lesson 2.4):</p>
<pre><code class="language-javascript">// client.mjs — một client thật đọc lỗi RFC 9457: rẽ nhánh theo type, KHÔNG theo câu chữ
const API = 'http://localhost:4000';

async function book(token, body) {
  const res = await fetch(&#96;\${API}/bookings&#96;, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: &#96;Bearer \${token}&#96; },
    body: JSON.stringify(body),
  });
  if (res.ok) return { ok: true, booking: await res.json() };

  const ct = res.headers.get('content-type') ?? '';
  if (!ct.startsWith('application/problem+json')) throw new Error(&#96;Lỗi lạ \${res.status}: \${ct}&#96;);
  const p = await res.json();
  switch (p.type) {
    case 'https://labflow.example/problems/booking-conflict':
      return { ok: false, ui: &#96;Phòng bận (trùng \${p.conflictWith}). Chọn giờ khác nhé.&#96; };
    case 'https://labflow.example/problems/validation-failed':
      return { ok: false, ui: 'Kiểm lại: ' + p.errors.map((e) =&gt; e.pointer.slice(2)).join(', ') };
    default:
      return { ok: false, ui: p.title };          // loại chưa biết: vẫn có title để hiện
  }
}

const slot = { labId: 'lab_1', startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' };
console.log(await book('tok_an', slot));
console.log(await book('tok_bin', slot));
console.log(await book('tok_bin', { labId: 'lab_1', startAt: 'mai 8h' }));
console.log(await book('tok_bin', { ...slot, labId: 'lab_4' }));</code></pre>
<pre><code class="language-bash">node client.mjs</code></pre>
<div class="out">{
  ok: true,
  booking: {
    id: 'bk_1',
    labId: 'lab_1',
    userId: 'usr_1',
    startAt: '2026-11-02T01:00:00.000Z',
    endAt: '2026-11-02T03:00:00.000Z',
    purpose: null,
    status: 'PENDING',
    createdAt: '2026-10-31T17:39:45.555Z'
  }
}
{ ok: false, ui: 'Phòng bận (trùng bk_1). Chọn giờ khác nhé.' }
{ ok: false, ui: 'Kiểm lại: startAt, endAt' }
{ ok: false, ui: 'Phòng lab không tồn tại' }</div>
<p>The last call shows the safety net: <code>unknown-lab</code> has no <code>case</code>, so the client falls back to <code>title</code>, which every problem has. An app built like this survives new error types appearing on the server.</p>

<div class="pitfall"><p><strong>Trap — <code>detail</code> as a debugging channel.</strong> It is tempting to put <code>err.message</code>, a stack trace or the failing SQL into <code>detail</code> “to help”. That text reaches every client and every attacker: table names, file paths, library versions. RFC 9457 says <code>detail</code> should help the client <em>correct the request</em>. Debugging information belongs in the server log, where the request path in <code>instance</code> (or, later, a request id) lets you find it.</p></div>
<div class="pitfall"><p><strong>Trap — a different <code>title</code> on every occurrence.</strong> <code>"title": "Lab lab_9 not found"</code> puts the id into the title, so a dashboard sees a thousand different errors instead of one. Ids go in <code>detail</code> or in extensions; <code>title</code> stays fixed.</p></div>

<h3>400 or 422 for invalid fields?</h3>
<p>The validation example inside RFC 9457 itself answers <code>422 Unprocessable Content</code>. LabFlow answers <code>400</code> for a wrong <em>shape</em> and keeps <code>422</code> for “well-formed but meaningless” (lesson 1.3). Both are used by large public APIs; the RFC example is an illustration, not a rule. What matters is that your choice is written down and identical on every endpoint — which is now easy, because one file produces every error.</p>

<h3>The same idea in Spring Boot</h3>
<p>If you also learn Spring: Spring Framework 6 has a <code>ProblemDetail</code> class (“a representation for an RFC 9457 problem detail”), and any <code>@ExceptionHandler</code> may return it. Its <code>instance</code> is set from the request path, exactly like ours, and it is rendered as <code>application/problem+json</code>. In Spring Boot, the property <code>spring.mvc.problemdetails.enabled=true</code> makes the framework’s own errors — bad JSON, unknown route, wrong method — use the same format. Same standard, two stacks: a front-end written for one works against the other.</p>

<h3>In interviews and at work</h3>
<p><strong>“How do you design error responses?”</strong> One format for the whole API, RFC 9457 Problem Details: a stable <code>type</code> clients branch on, a fixed <code>title</code>, a per-request <code>detail</code>, the real HTTP status, and extensions such as field errors with JSON Pointers. Produced in one place, so every endpoint is consistent.</p>
<p><strong>“What is the difference between <code>title</code> and <code>detail</code>?”</strong> <code>title</code> describes the kind of problem and is the same every time; <code>detail</code> describes this occurrence. Logs and dashboards group by the first; users and developers read the second.</p>
<p><strong>“Why not always return 200 with <code>success: false</code>?”</strong> Because every generic tool — <code>fetch</code>’s <code>res.ok</code>, retries, caches, monitoring, load balancers — reads the status line, not your body. Lesson 2.3 measures what breaks.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9457.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9457 — Problem Details for HTTP APIs (Jul 2023) — read 1 Nov 2026</span><span class="lc-sub">The five standard members (type, title, status, detail, instance); type defaults to about:blank. It obsoletes RFC 7807.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc6901.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 6901 — JSON Pointer (Apr 2013) — read 1 Nov 2026</span><span class="lc-sub">The pointer in each field error: "~" is written as ~0 and "/" as ~1 inside a token.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Apply the changes, restart, and reproduce the eight responses above (ignore <code>Date</code>, <code>ETag</code> and <code>createdAt</code>).</li>
  <li>Cancel <code>bk_1</code> twice as <code>tok_an</code>. Write down the <code>type</code>, <code>title</code> and <code>instance</code> of the second answer before you run it, then compare.</li>
  <li>Add one line to <code>client.mjs</code> so that <code>unknown-lab</code> shows “This lab no longer exists, pick another one”. Do not touch the server.</li>
  <li>Grep your project for <code>res.status(</code>: apart from success responses, every error must now go through <code>sendProblem</code>. Fix any that do not.</li>
</ol>
<p><strong>Done when:</strong> every error you can trigger — 400, 401, 403, 404, 405, 409, 410, 413, 422, 500 — has the media type <code>application/problem+json</code>, a <code>type</code> under <code>https://labflow.example/problems/</code>, a fixed <code>title</code>, and the same status in the body as in the status line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Problem Details (RFC 9457)</span><span class="v">The IETF standard JSON shape for HTTP API errors; replaced RFC 7807 in July 2023.</span></div>
  <div class="kv"><span class="k">application/problem+json</span><span class="v">The media type of a problem document; lets clients recognise an error body without reading it.</span></div>
  <div class="kv"><span class="k">type</span><span class="v">A URI naming the kind of problem; the value clients branch on. Default <code>about:blank</code>.</span></div>
  <div class="kv"><span class="k">title / detail</span><span class="v">Fixed summary of the type / explanation of this occurrence.</span></div>
  <div class="kv"><span class="k">instance</span><span class="v">Identifies the occurrence; LabFlow uses the request path.</span></div>
  <div class="kv"><span class="k">Extension member</span><span class="v">Any extra member (<code>code</code>, <code>errors</code>, <code>conflictWith</code>); clients must ignore unknown ones.</span></div>
  <div class="kv"><span class="k">JSON Pointer (RFC 6901)</span><span class="v">A path into a JSON document, e.g. <code>#/startAt</code>; used to point at an invalid field.</span></div>
  <div class="kv"><span class="k">413 Content Too Large</span><span class="v">The body is larger than the server accepts; Express’s default JSON limit is 100 KB.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every error of every endpoint has one shape — RFC 9457, media type <code>application/problem+json</code>.</li>
  <li><code>type</code> identifies the kind, <code>title</code> stays fixed, <code>detail</code> explains this request, <code>status</code> repeats the real code, <code>instance</code> marks the occurrence.</li>
  <li>Extensions carry the rest — field errors with JSON Pointers, the conflicting id — and clients ignore what they do not know.</li>
  <li>One function produces every problem; routes only throw. That is how the 413-as-500 bug disappeared everywhere at once.</li>
  <li>Clients branch on <code>type</code> (or <code>code</code>), never on the human text, and fall back to <code>title</code>.</li>
  <li>Never put stack traces, SQL or file paths in <code>detail</code>; they belong in the server log.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-2-2-middleware" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — lesson 2.2: Middleware</span><span class="lc-sub">If you took SDN302 on Academy, the error-handling middleware with four parameters is the same piece we changed here. Same: one handler after all routes catches what the routes throw. Different: SDN302 sends a home-made JSON error; here the handler produces the standard RFC 9457 format. This lesson adds: the problem+json media type, type/title/detail/instance, field errors with JSON Pointers, and the 413 that a hand-made handler turns into a 500. Not taken SDN302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-5-2-literal-union" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">The same success-or-failure result, in types — TS 5.2: Literal unions &amp; narrowing by value</span><span class="lc-sub">Same: a response is one of a closed set of shapes, and a client tells them apart by a tag (the HTTP status / <code>type</code> here). Different: in TypeScript the result is a discriminated union (<code>{ ok: true } | { ok: false }</code>) that tsc narrows at compile time — read the minutes blind and it is TS2339 — and the error caught in a <code>catch</code> is <code>unknown</code> until you narrow it with <code>instanceof</code>.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Problem Details (RFC 9457): một định dạng lỗi cho cả API</h2>
<p class="lead">Một client tốn nhiều code cho lỗi hơn cho thành công: phải hiện đúng thông báo, tô đỏ đúng ô nhập, quyết định thử lại hay bỏ cuộc. Điều đó chỉ làm được khi mọi lỗi của mọi endpoint có <em>cùng một hình dạng</em>. Ở Chương 1, LabFlow tự nghĩ ra một hình dạng lỗi và nó chạy khá ổn — cho tới khi một request không lường trước biến lỗi của client thành lỗi 500. Trong bài này bạn tìm ra bug đó, rồi chuyển cả API sang định dạng lỗi chuẩn của web, RFC 9457, chỉ bằng cách sửa một tệp.</p>

<div class="callout ok">
<p><strong>Học xong Chương 2 bạn làm được:</strong></p>
<ul>
  <li>trả mọi lỗi theo một dạng chuẩn (RFC 9457) kèm mã máy đọc được;</li>
  <li>kiểm dữ liệu ngay ở cửa và báo mọi lỗi trường một lần;</li>
  <li>quyết định chính xác trường nào được rời server;</li>
  <li>trả câu báo lỗi theo ngôn ngữ người gọi mà không làm gãy client.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> Phần lớn code của client là xử lý lỗi; một định dạng lỗi đoán trước được làm API dễ dùng — và đóng những lỗ mà kẻ tấn công thử đầu tiên.</p>
</div>

<h3>Vì sao cần chuẩn, khi hình dạng tự chế vẫn chạy?</h3>
<p>Hãy nghĩ tới bệnh án. Bệnh viện nào cũng có thể ghi chẩn đoán bằng lời riêng của mình, nhưng khi đó bác sĩ ở thành phố khác không đọc nhanh được hồ sơ của bạn. Bộ mã bệnh dùng chung giúp bác sĩ nào cũng xử lý được hồ sơ nào. Lỗi của API cũng vậy: nếu mỗi API tự chế <code>{"error": …}</code>, <code>{"msg": …}</code>, <code>{"success": false, "code": 17}</code>, thì mỗi client cần một bộ đọc mới và mỗi công cụ log cần một luật mới.</p>
<p>IETF (tổ chức viết các chuẩn của Internet) công bố một hình dạng chung cho lỗi của HTTP API vào tháng 3/2016 với tên RFC 7807, rồi thay nó vào tháng 7/2023 bằng <strong>RFC 9457 "Problem Details for HTTP APIs"</strong> (chi tiết vấn đề cho HTTP API — RFC 9457 ghi rõ nó thay thế RFC 7807; hình dạng giữ nguyên, câu chữ rõ hơn). Chuẩn này định nghĩa một object JSON, một <strong>media type</strong> (kiểu nội dung) — <code>application/problem+json</code> — và vài luật. Spring Framework 6 hỗ trợ sẵn, nhiều API gateway sinh ra đúng định dạng này, và người phỏng vấn có hỏi.</p>

<h3>Trước hết, bug: lỗi của client hoá thành 500</h3>
<p><code>express.json()</code> từ chối body lớn hơn <strong>100 KB theo mặc định</strong>. LabFlow của Chương 1 xử lý một body như vậy ra sao? Tạo một lượt đặt nặng 200 KB rồi gửi đi (đây là code cuối Chương 1, chưa sửa gì):</p>
<pre><code class="language-bash">node -e "require('fs').writeFileSync('big.json', JSON.stringify({ labId: 'lab_1', startAt: '2026-11-05T08:00:00+07:00', endAt: '2026-11-05T10:00:00+07:00', purpose: 'x'.repeat(200000) }))"</code></pre>
<pre><code class="language-bash">wc -c big.json</code></pre>
<div class="out">  200104 big.json</div>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: application/json' \\
  --data-binary @big.json</code></pre>
<div class="out">HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-OPvq4uFWrS3OFyeJLrxQ0lr6I3Q"
Date: Sat, 31 Oct 2026 17:48:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "INTERNAL",
  "message": "Máy chủ gặp lỗi, thử lại sau"
}</div>
<p>Log của server cho thấy chuyện thật sự xảy ra:</p>
<div class="out">PayloadTooLargeError: request entity too large
    at readStream (…/node_modules/raw-body/index.js:163:17)
    …
  expected: 200104,
  length: 200104,
  limit: 102400,
  type: 'entity.too.large'
}</div>
<p>Express đã biết câu trả lời đúng — <code>413 Content Too Large</code> (nội dung quá lớn), kèm cả giới hạn lẫn độ dài thật — nhưng bộ xử lý lỗi của ta chỉ nhận ra <code>entity.parse.failed</code>, nên mọi thứ khác rơi xuống nhánh "lỗi của chúng tôi, 500". Hai hậu quả: client được bảo thử lại một thứ sẽ hỏng mãi mãi, và hệ thống giám sát đếm lỗi của client thành sự cố của server. Đó là cái giá khi mỗi chỗ tự định dạng lỗi theo kiểu của mình; ta sửa bug này cùng lúc với đổi định dạng.</p>

<h3>RFC 9457 gói gọn trong năm trường</h3>
<table>
  <thead><tr><th>Trường</th><th>Là gì</th><th>Ví dụ LabFlow</th><th>Luật trong RFC</th></tr></thead>
  <tbody>
    <tr><td><code>type</code></td><td>một URI định danh <em>loại</em> lỗi — thứ client dùng để rẽ nhánh</td><td><code>https://labflow.example/problems/booking-conflict</code></td><td>vắng ⇒ coi là <code>about:blank</code>; nên dùng URI tuyệt đối; client KHÔNG NÊN tự động mở URI này</td></tr>
    <tr><td><code>title</code></td><td>câu tóm tắt ngắn cho người đọc, của loại lỗi</td><td><code>Trùng lịch phòng</code></td><td>KHÔNG NÊN đổi giữa các lần xảy ra, trừ khi dịch sang ngôn ngữ khác</td></tr>
    <tr><td><code>status</code></td><td>mã trạng thái HTTP, nhắc lại trong body</td><td><code>409</code></td><td>chỉ để tham khảo; phải khớp với dòng trạng thái thật</td></tr>
    <tr><td><code>detail</code></td><td>chuyện gì sai <em>lần này</em></td><td><code>Phòng đã có lượt bk_1 trong khung giờ này</code></td><td>nên giúp client sửa request, không phải thông tin gỡ lỗi</td></tr>
    <tr><td><code>instance</code></td><td>định danh lần xảy ra này</td><td><code>/bookings</code></td><td>một URI; nếu không mở được thì nó là mã định danh duy nhất của lần lỗi</td></tr>
  </tbody>
</table>
<p>Cả năm trường đều tuỳ chọn, nhưng một lỗi có ích thì ít nhất có <code>type</code>, <code>title</code> và <code>status</code>. Việc tách <code>title</code> (lần nào cũng giống) khỏi <code>detail</code> (riêng cho request này) rất quan trọng: dashboard gom lỗi theo <code>type</code>/<code>title</code>, còn con người đọc <code>detail</code>.</p>
<p>Giá trị đặc biệt <code>about:blank</code> nghĩa là "không có ý nghĩa gì thêm ngoài mã trạng thái" — khi đó <code>title</code> nên là cụm chuẩn, như <code>Not Found</code>. Dùng nó cho lỗi chung chung; lỗi nào client có thể xử lý khác đi thì cho nó một <code>type</code> thật.</p>

<h3>Thành viên mở rộng: mọi thứ khác bạn cần</h3>
<p>Một problem được mang thêm trường bất kỳ, gọi là <strong>extension member</strong> (thành viên mở rộng). RFC chỉ nghiêm khắc ở một điểm: client <strong>PHẢI bỏ qua</strong> trường mở rộng mà nó không hiểu. Chính luật đó làm việc thêm trường trở nên an toàn. LabFlow dùng ba trường:</p>
<ul>
  <li><code>code</code> — mã máy đọc từ Chương 1 (<code>BOOKING_CONFLICT</code>). Nói chặt chẽ, <code>type</code> mới là định danh; ta giữ <code>code</code> vì nó ngắn, dễ ghi log và dễ <code>switch</code>, và vì client của Chương 1 đã quen nó. Cả hai sinh ra từ cùng một giá trị trong một hàm, nên không bao giờ lệch nhau.</li>
  <li><code>conflictWith</code> — id của lượt đặt đang chặn lượt này, để app hiện được đường dẫn tới nó.</li>
  <li><code>errors</code> — mỗi trường sai một dòng. Cách này bắt chước đúng ví dụ trong RFC 9457 §3, nơi mỗi dòng có <code>detail</code> và <code>pointer</code> như <code>#/age</code>. <code>pointer</code> là một <strong>JSON Pointer</strong> (con trỏ JSON, RFC 6901) viết dưới dạng phần đuôi <code>#</code> của URI: <code>#/startAt</code> là trường <code>startAt</code> của body, <code>#/profile/color</code> là trường lồng bên trong. Front-end ánh xạ thẳng nó sang ô nhập cần tô đỏ.</li>
</ul>
<div class="callout warn"><p><strong>Mỗi response chỉ một problem.</strong> RFC 9457 khuyên mô tả vấn đề quan trọng hoặc gấp nhất, không gom "một mớ" lỗi khác loại. Một danh sách lỗi từng trường thì được — chúng cùng một loại, "body không hợp lệ". Một lỗi 401 và một lỗi 404 cùng lúc thì không: hãy trả cái đứng trước trong thứ tự kiểm của bạn.</p></div>

<h3>Dựng: một tệp quyết định mọi lỗi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">route</span><span class="lz-t">ném HttpError</span><span class="lz-d">mã trạng thái + code + tham số</span></div>
  <div class="lz-step"><span class="lz-k">middleware lỗi</span><span class="lz-t">một chỗ duy nhất</span><span class="lz-d">cũng biến lỗi parse thành 400, body quá lớn thành 413</span></div>
  <div class="lz-step"><span class="lz-k">sendProblem</span><span class="lz-t">dựng body</span><span class="lz-d">type · title · status · detail · instance · code</span></div>
  <div class="lz-step"><span class="lz-k">client</span><span class="lz-t">đọc code</span><span class="lz-d">không bao giờ phân tích câu chữ cho người</span></div>
</div>
<p>Tạo <code>src/problems.js</code>. Bảng <code>TITLES</code> là nơi duy nhất chứa tiêu đề lỗi; <code>typeOf</code> sinh URI từ mã; <code>sendProblem</code> viết response:</p>
<pre><code class="language-javascript">// problems.js — RFC 9457 Problem Details: MỘT chỗ quyết định một lỗi trông thế nào
import { STATUS_CODES } from 'node:http';

export const PROBLEM_BASE = 'https://labflow.example/problems/';

// title: câu NGẮN cho người đọc, giống hệt nhau ở mọi lần lỗi này xảy ra (RFC 9457 §3.1.3).
// Câu riêng của từng lần (id nào, giờ nào) để ở detail.
const TITLES = {
  VALIDATION_FAILED: 'Dữ liệu gửi lên không hợp lệ',
  MALFORMED_JSON: 'Body không phải JSON hợp lệ',
  UNKNOWN_QUERY_PARAM: 'Tham số truy vấn không được hỗ trợ',
  UNAUTHENTICATED: 'Cần đăng nhập',
  FORBIDDEN: 'Không đủ quyền',
  LAB_NOT_FOUND: 'Không tìm thấy phòng lab',
  DEVICE_NOT_FOUND: 'Không tìm thấy thiết bị',
  BOOKING_NOT_FOUND: 'Không tìm thấy lượt đặt',
  ISSUE_NOT_FOUND: 'Không tìm thấy báo hỏng',
  ROUTE_NOT_FOUND: 'Không có endpoint này',
  METHOD_NOT_ALLOWED: 'Phương thức không được hỗ trợ',
  BOOKING_CONFLICT: 'Trùng lịch phòng',
  ALREADY_CANCELLED: 'Lượt đặt đã huỷ',
  ALREADY_RESOLVED: 'Báo hỏng đã xử lý',
  DUPLICATE_SERIAL: 'Trùng số serial',
  LAB_RETIRED: 'Phòng lab đã ngừng sử dụng',
  PAYLOAD_TOO_LARGE: 'Body quá lớn',
  UNSUPPORTED_MEDIA_TYPE: 'Kiểu nội dung không được hỗ trợ',
  INVALID_TIME_RANGE: 'Khoảng thời gian không hợp lệ',
  UNKNOWN_LAB: 'Phòng lab không tồn tại',
  INTERNAL: 'Lỗi máy chủ',
};

// 'BOOKING_CONFLICT' ⇒ 'https://labflow.example/problems/booking-conflict'
export const typeOf = (code) =&gt; PROBLEM_BASE + code.toLowerCase().replaceAll('_', '-');

export function sendProblem(req, res, { status, code, detail, ...extra }) {
  res.status(status)
    .type('application/problem+json')        // KHÔNG phải application/json
    .json({
      type: typeOf(code),                     // định danh loại lỗi — client rẽ nhánh theo đây
      title: TITLES[code] ?? STATUS_CODES[status],
      status,                                 // nhắc lại mã HTTP (chỉ để tham khảo)
      detail,                                 // chuyện gì xảy ra LẦN NÀY
      instance: req.originalUrl,              // lần xảy ra này: request nào
      code,                                   // mở rộng của LabFlow: mã cũ từ Chương 1
      ...extra,                               // mở rộng khác: errors, conflictWith…
    });
}</code></pre>
<p>Rồi thay phần cuối của <code>src/app.js</code> — lưới hứng 404 và bộ xử lý lỗi. Các route không đổi một dòng nào: chúng vẫn ném <code>HttpError</code> với đúng những tham số cũ.</p>
<pre><code class="language-javascript">import { sendProblem } from './problems.js';
// …các route như cũ…

app.use((req, res) =&gt; {
  sendProblem(req, res, { status: 404, code: 'ROUTE_NOT_FOUND', detail: &#96;Không có \${req.method} \${req.path}&#96; });
});

// Một chỗ duy nhất biến MỌI lỗi thành application/problem+json
app.use((err, req, res, next) =&gt; {
  if (err instanceof HttpError) {
    const more = Array.isArray(err.details)
      ? { errors: err.details.map((d) =&gt; ({ pointer: &#96;#/\${d.field}&#96;, detail: d.issue })) }   // lỗi từng trường
      : err.details;                                                                       // thành viên mở rộng khác
    return sendProblem(req, res, { status: err.status, code: err.error, detail: err.message, ...more });
  }
  if (err.type === 'entity.parse.failed') {   // express.json không đọc được body
    return sendProblem(req, res, { status: 400, code: 'MALFORMED_JSON', detail: 'Body không phải JSON hợp lệ' });
  }
  if (err.type === 'entity.too.large') {      // body vượt giới hạn của express.json
    return sendProblem(req, res, { status: 413, code: 'PAYLOAD_TOO_LARGE', detail: &#96;Body tối đa \${err.limit} byte, nhận \${err.length} byte&#96; });
  }
  console.error(err);                         // chi tiết thật chỉ nằm trong log của server
  sendProblem(req, res, { status: 500, code: 'INTERNAL', detail: 'Máy chủ gặp lỗi, thử lại sau' });
});</code></pre>
<p>Hai thay đổi nhỏ ở chỗ khác. Trong <code>src/http.js</code>, tham số thứ tư của <code>HttpError</code> giờ có thể là mảng lỗi từng trường, hoặc một object chứa các trường mở rộng. Trong <code>src/routes/bookings.js</code>, lỗi trùng lịch mang theo id của lượt đang chặn:</p>
<pre><code class="language-javascript">if (clash) throw new HttpError(409, 'BOOKING_CONFLICT', &#96;Phòng đã có lượt \${clash.id} trong khung giờ này&#96;, { conflictWith: clash.id });</code></pre>

<h3>Chạy thử</h3>
<p>Khởi động lại server. Một phòng không tồn tại:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
ETag: W/"de-n7A1XrnCUccoJT3bD1Syj4y0bkQ"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Không tìm thấy phòng lab",
  "status": 404,
  "detail": "Không có phòng lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>
<p>Để ý ba điều. Media type là <code>application/problem+json</code>: Express giữ nguyên kiểu bạn đặt bằng <code>res.type()</code> và chỉ thêm <code>charset=utf-8</code>. <code>instance</code> là đường dẫn bị lỗi. Và <code>code</code> vẫn còn đó cho client của Chương 1.</p>
<p>Trùng lịch — An đặt 8:00–10:00, rồi Bình xin 9:00–11:00:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"SWT301 Lab 3"}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T09:00:00+07:00","endAt":"2026-11-02T11:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset=utf-8
Content-Length: 267
ETag: W/"10b-ZHrqMs1+uIYZF1aNLzRZ8dEGmhU"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/booking-conflict",
  "title": "Trùng lịch phòng",
  "status": 409,
  "detail": "Phòng đã có lượt bk_1 trong khung giờ này",
  "instance": "/bookings",
  "code": "BOOKING_CONFLICT",
  "conflictWith": "bk_1"
}</div>
<p>Lỗi từng trường giờ dùng JSON Pointer:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"02/11/2026 8:00"}'</code></pre>
<div class="out">{
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
}</div>
<p>Body 200 KB — bug ở đầu bài — giờ là một lỗi 413 đàng hoàng, báo cho client biết giới hạn:</p>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: application/json' \\
  --data-binary @big.json</code></pre>
<div class="out">HTTP/1.1 413 Payload Too Large
Content-Type: application/problem+json; charset=utf-8
Content-Length: 233
ETag: W/"e9-3MMIWkatekATvILvuBNxPo6TxYY"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/payload-too-large",
  "title": "Body quá lớn",
  "status": 413,
  "detail": "Body tối đa 102400 byte, nhận 200104 byte",
  "instance": "/bookings",
  "code": "PAYLOAD_TOO_LARGE"
}</div>
<p>Header đặt trước khi ném lỗi vẫn còn nguyên: 405 giữ <code>Allow</code>, 401 giữ <code>WWW-Authenticate</code>.</p>
<pre><code class="language-bash">curl -i -X DELETE http://localhost:4000/labs/lab_1</code></pre>
<div class="out">HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: application/problem+json; charset=utf-8
Content-Length: 262
ETag: W/"106-Gc+Bcoiz1mAAzgnw7r19i3x+R+Q"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/method-not-allowed",
  "title": "Phương thức không được hỗ trợ",
  "status": 405,
  "detail": "DELETE không dùng được ở /labs/lab_1",
  "instance": "/labs/lab_1",
  "code": "METHOD_NOT_ALLOWED"
}</div>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings</code></pre>
<div class="out">HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
Content-Type: application/problem+json; charset=utf-8
Content-Length: 233
ETag: W/"e9-3u1HHKIRbQ14VvjcB9t7BxVO6Hc"
Date: Sat, 31 Oct 2026 17:41:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/unauthenticated",
  "title": "Cần đăng nhập",
  "status": 401,
  "detail": "Cần đăng nhập (thiếu hoặc sai token)",
  "instance": "/bookings",
  "code": "UNAUTHENTICATED"
}</div>
<p>URL không tồn tại và JSON hỏng cũng theo đúng định dạng đó, nên client không bao giờ phải đoán:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/rooms</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/route-not-found",
  "title": "Không có endpoint này",
  "status": 404,
  "detail": "Không có GET /rooms",
  "instance": "/rooms",
  "code": "ROUTE_NOT_FOUND"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId": "lab_1",}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/malformed-json",
  "title": "Body không phải JSON hợp lệ",
  "status": 400,
  "detail": "Body không phải JSON hợp lệ",
  "instance": "/bookings",
  "code": "MALFORMED_JSON"
}</div>

<h3>Dùng URI nào cho <code>type</code>?</h3>
<ul>
  <li><strong>Một tên miền bạn làm chủ.</strong> LabFlow dùng <code>labflow.example</code>, vì đuôi <code>.example</code> được giữ riêng cho tài liệu (RFC 2606) nên không bao giờ thuộc về ai. Trong dự án thật, dùng tên miền API của bạn, ví dụ <code>https://api.your-app.com/problems/booking-conflict</code>.</li>
  <li><strong>Tốt nhất là một trang giải thích lỗi</strong> cho lập trình viên dán URI vào trình duyệt: nguyên nhân, cách sửa. Client không được tự động tải nó; trước hết nó là một mã định danh. Chương 7 sinh các trang này từ tệp OpenAPI.</li>
  <li><strong>Ổn định mãi mãi.</strong> Đổi <code>type</code> là làm vỡ mọi client đang rẽ nhánh theo nó — y như đổi tên một trường (Chương 4).</li>
</ul>

<h3>Một client biết đọc problem</h3>
<p>Đây là thứ định dạng chuẩn mang lại ở phía bên kia. Một client nhỏ chạy Node 22 với <code>fetch</code> có sẵn: kiểm <code>res.ok</code>, kiểm media type, rồi rẽ nhánh theo <code>type</code> — không bao giờ theo câu chữ cho người đọc, vì câu chữ có thể được viết lại hay dịch (bài 2.4):</p>
<pre><code class="language-javascript">// client.mjs — một client thật đọc lỗi RFC 9457: rẽ nhánh theo type, KHÔNG theo câu chữ
const API = 'http://localhost:4000';

async function book(token, body) {
  const res = await fetch(&#96;\${API}/bookings&#96;, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: &#96;Bearer \${token}&#96; },
    body: JSON.stringify(body),
  });
  if (res.ok) return { ok: true, booking: await res.json() };

  const ct = res.headers.get('content-type') ?? '';
  if (!ct.startsWith('application/problem+json')) throw new Error(&#96;Lỗi lạ \${res.status}: \${ct}&#96;);
  const p = await res.json();
  switch (p.type) {
    case 'https://labflow.example/problems/booking-conflict':
      return { ok: false, ui: &#96;Phòng bận (trùng \${p.conflictWith}). Chọn giờ khác nhé.&#96; };
    case 'https://labflow.example/problems/validation-failed':
      return { ok: false, ui: 'Kiểm lại: ' + p.errors.map((e) =&gt; e.pointer.slice(2)).join(', ') };
    default:
      return { ok: false, ui: p.title };          // loại chưa biết: vẫn có title để hiện
  }
}

const slot = { labId: 'lab_1', startAt: '2026-11-02T08:00:00+07:00', endAt: '2026-11-02T10:00:00+07:00' };
console.log(await book('tok_an', slot));
console.log(await book('tok_bin', slot));
console.log(await book('tok_bin', { labId: 'lab_1', startAt: 'mai 8h' }));
console.log(await book('tok_bin', { ...slot, labId: 'lab_4' }));</code></pre>
<pre><code class="language-bash">node client.mjs</code></pre>
<div class="out">{
  ok: true,
  booking: {
    id: 'bk_1',
    labId: 'lab_1',
    userId: 'usr_1',
    startAt: '2026-11-02T01:00:00.000Z',
    endAt: '2026-11-02T03:00:00.000Z',
    purpose: null,
    status: 'PENDING',
    createdAt: '2026-10-31T17:39:45.555Z'
  }
}
{ ok: false, ui: 'Phòng bận (trùng bk_1). Chọn giờ khác nhé.' }
{ ok: false, ui: 'Kiểm lại: startAt, endAt' }
{ ok: false, ui: 'Phòng lab không tồn tại' }</div>
<p>Lời gọi cuối cho thấy tấm lưới an toàn: <code>unknown-lab</code> không có <code>case</code> nào, nên client lùi về <code>title</code> — problem nào cũng có. Một app viết như vậy sống sót được khi server đẻ thêm loại lỗi mới.</p>

<div class="pitfall"><p><strong>Bẫy — dùng <code>detail</code> làm kênh gỡ lỗi.</strong> Rất dễ nhét <code>err.message</code>, stack trace hay câu SQL hỏng vào <code>detail</code> "cho dễ sửa". Đoạn chữ đó tới tay mọi client và mọi kẻ tấn công: tên bảng, đường dẫn tệp, phiên bản thư viện. RFC 9457 nói <code>detail</code> nên giúp client <em>sửa request</em>. Thông tin gỡ lỗi thuộc về log của server, nơi đường dẫn trong <code>instance</code> (hoặc về sau là một request id) giúp bạn tìm ra nó.</p></div>
<div class="pitfall"><p><strong>Bẫy — mỗi lần lỗi một <code>title</code> khác.</strong> <code>"title": "Lab lab_9 not found"</code> nhét id vào tiêu đề, nên dashboard thấy một nghìn lỗi khác nhau thay vì một. Id đặt ở <code>detail</code> hoặc trường mở rộng; <code>title</code> giữ cố định.</p></div>

<h3>Trường sai thì 400 hay 422?</h3>
<p>Chính ví dụ về kiểm dữ liệu trong RFC 9457 trả <code>422 Unprocessable Content</code>. LabFlow trả <code>400</code> khi sai <em>hình dạng</em> và giữ <code>422</code> cho "đúng dạng nhưng vô nghĩa" (bài 1.3). Cả hai cách đều được các API công khai lớn dùng; ví dụ trong RFC là minh hoạ, không phải luật. Điều quan trọng là lựa chọn của bạn được ghi ra và giống hệt nhau ở mọi endpoint — giờ thì dễ, vì một tệp sinh ra mọi lỗi.</p>

<h3>Cùng ý tưởng trong Spring Boot</h3>
<p>Nếu bạn học cả Spring: Spring Framework 6 có lớp <code>ProblemDetail</code> ("biểu diễn một problem detail theo RFC 9457"), và mọi <code>@ExceptionHandler</code> đều trả được nó. <code>instance</code> của nó lấy từ đường dẫn request, y như của ta, và nó được gửi đi dưới dạng <code>application/problem+json</code>. Trong Spring Boot, thuộc tính <code>spring.mvc.problemdetails.enabled=true</code> làm các lỗi có sẵn của framework — JSON hỏng, route không có, sai phương thức — dùng cùng định dạng. Một chuẩn, hai nền tảng: front-end viết cho bên này chạy được với bên kia.</p>

<h3>Phỏng vấn và đi làm</h3>
<p><strong>"Em thiết kế response lỗi thế nào?"</strong> Một định dạng cho cả API, RFC 9457 Problem Details: <code>type</code> ổn định để client rẽ nhánh, <code>title</code> cố định, <code>detail</code> riêng từng request, mã HTTP thật, và các trường mở rộng như lỗi từng trường kèm JSON Pointer. Sinh ra ở một chỗ, nên endpoint nào cũng nhất quán.</p>
<p><strong>"<code>title</code> khác <code>detail</code> thế nào?"</strong> <code>title</code> mô tả loại lỗi, lần nào cũng giống; <code>detail</code> mô tả lần xảy ra này. Log và dashboard gom theo cái trước; người dùng và lập trình viên đọc cái sau.</p>
<p><strong>"Sao không luôn trả 200 kèm <code>success: false</code>?"</strong> Vì mọi công cụ dùng chung — <code>res.ok</code> của <code>fetch</code>, cơ chế thử lại, cache, giám sát, load balancer — đọc dòng trạng thái, không đọc body của bạn. Bài 2.3 đo xem cái gì hỏng.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9457.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9457 — Problem Details for HTTP APIs (7/2023) — đọc ngày 1/11/2026</span><span class="lc-sub">Năm thành viên chuẩn (type, title, status, detail, instance); type mặc định là about:blank. Nó thay thế RFC 7807.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc6901.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 6901 — JSON Pointer (4/2013) — đọc ngày 1/11/2026</span><span class="lc-sub">Con trỏ trong mỗi lỗi trường: "~" viết thành ~0 và "/" thành ~1 trong một token.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Áp các thay đổi, khởi động lại, và tái hiện tám response ở trên (bỏ qua <code>Date</code>, <code>ETag</code> và <code>createdAt</code>).</li>
  <li>Huỷ <code>bk_1</code> hai lần bằng <code>tok_an</code>. Viết ra <code>type</code>, <code>title</code> và <code>instance</code> của câu trả lời thứ hai TRƯỚC khi chạy, rồi so.</li>
  <li>Thêm một dòng vào <code>client.mjs</code> để <code>unknown-lab</code> hiện "Phòng này không còn nữa, chọn phòng khác nhé". Không đụng vào server.</li>
  <li>Tìm <code>res.status(</code> trong dự án: ngoài các response thành công, mọi lỗi giờ phải đi qua <code>sendProblem</code>. Sửa chỗ nào chưa.</li>
</ol>
<p><strong>Đạt khi:</strong> mọi lỗi bạn kích hoạt được — 400, 401, 403, 404, 405, 409, 410, 413, 422, 500 — đều có media type <code>application/problem+json</code>, <code>type</code> nằm dưới <code>https://labflow.example/problems/</code>, <code>title</code> cố định, và <code>status</code> trong body trùng với dòng trạng thái.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Problem Details (chi tiết vấn đề, RFC 9457)</span><span class="v">Chuẩn IETF về hình dạng JSON của lỗi HTTP API; thay RFC 7807 từ tháng 7/2023.</span></div>
  <div class="kv"><span class="k">application/problem+json (media type lỗi)</span><span class="v">Kiểu nội dung của tài liệu lỗi; client nhận ra body là lỗi mà chưa cần đọc.</span></div>
  <div class="kv"><span class="k">type (loại lỗi)</span><span class="v">URI đặt tên cho loại vấn đề; giá trị client dùng để rẽ nhánh. Mặc định <code>about:blank</code>.</span></div>
  <div class="kv"><span class="k">title / detail (tiêu đề / chi tiết)</span><span class="v">Câu tóm tắt cố định của loại lỗi / lời giải thích của lần xảy ra này.</span></div>
  <div class="kv"><span class="k">instance (lần xảy ra)</span><span class="v">Định danh lần lỗi; LabFlow dùng đường dẫn của request.</span></div>
  <div class="kv"><span class="k">Extension member (trường mở rộng)</span><span class="v">Trường thêm bất kỳ (<code>code</code>, <code>errors</code>, <code>conflictWith</code>); client phải bỏ qua trường lạ.</span></div>
  <div class="kv"><span class="k">JSON Pointer (con trỏ JSON, RFC 6901)</span><span class="v">Đường dẫn vào một tài liệu JSON, ví dụ <code>#/startAt</code>; dùng để chỉ ra trường bị sai.</span></div>
  <div class="kv"><span class="k">413 Content Too Large (nội dung quá lớn)</span><span class="v">Body lớn hơn mức server nhận; giới hạn JSON mặc định của Express là 100 KB.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mọi lỗi của mọi endpoint chỉ một hình dạng — RFC 9457, media type <code>application/problem+json</code>.</li>
  <li><code>type</code> định danh loại lỗi, <code>title</code> cố định, <code>detail</code> giải thích request này, <code>status</code> nhắc lại mã thật, <code>instance</code> đánh dấu lần xảy ra.</li>
  <li>Trường mở rộng chở phần còn lại — lỗi từng trường kèm JSON Pointer, id gây xung đột — và client bỏ qua thứ nó không biết.</li>
  <li>Một hàm sinh mọi problem; route chỉ việc ném lỗi. Nhờ vậy bug 413-thành-500 biến mất ở mọi nơi cùng lúc.</li>
  <li>Client rẽ nhánh theo <code>type</code> (hoặc <code>code</code>), không bao giờ theo câu chữ, và lùi về <code>title</code> khi gặp loại lạ.</li>
  <li>Không bao giờ để stack trace, SQL hay đường dẫn tệp trong <code>detail</code>; chúng thuộc về log của server.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-2-2-middleware" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp phần này ở SDN302 — bài 2.2: Middleware</span><span class="lc-sub">Nếu đã học SDN302 trên Academy, middleware xử lý lỗi bốn tham số chính là mảnh ta vừa sửa ở đây. Giống: một bộ xử lý đặt sau mọi route hứng những gì route ném ra. Khác: SDN302 gửi một lỗi JSON tự chế; ở đây bộ xử lý sinh ra định dạng chuẩn RFC 9457. Bài này thêm: media type problem+json, type/title/detail/instance, lỗi từng trường kèm JSON Pointer, và lỗi 413 mà một bộ xử lý tự chế biến thành 500. Chưa học SDN302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-5-2-literal-union" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Cùng một kết quả thành-công-hoặc-thất-bại, bằng kiểu — TS 5.2: Union literal &amp; thu hẹp theo giá trị</span><span class="lc-sub">Giống: một phản hồi là một trong một tập dáng đóng, và client phân biệt chúng bằng một nhãn (ở đây là HTTP status / <code>type</code>). Khác: trong TypeScript kết quả là một discriminated union (<code>{ ok: true } | { ok: false }</code>) mà tsc thu hẹp lúc biên dịch — đọc minutes mù là TS2339 — và lỗi bắt trong <code>catch</code> là <code>unknown</code> cho tới khi bạn thu hẹp bằng <code>instanceof</code>.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Validating input at the edge: schemas, strict objects, 415 and 413|||2.2 — Kiểm dữ liệu vào ngay cửa: schema, object strict, 415 và 413',
      slug: 'api-2-2-validation',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tấn công code Chương 1 thấy sáu request sai lọt qua, đặt phép kiểm vào đúng tầng (415/413, 400, 422/409), thay if bằng schema Zod 4, object strict chống mass assignment, bẫy 30/2 và ép kiểu.',
      content: `${G022}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Validating input at the edge</h2>
<p class="lead">Everything a client sends is a claim, not a fact: the type may be wrong, the field may not exist, the date may be impossible, and some clients are attackers. Validation is the door check that turns claims into facts before any business code runs. In this lesson you attack LabFlow’s Chapter 1 code and watch six requests slip through, then replace the hand-written <code>if</code>s with schemas, so that a bad request is refused at the door with every problem listed at once.</p>

<h3>Six requests that should never have worked</h3>
<p>All of these run against the code at the end of Chapter 1 (fresh server). Read each answer as a reviewer would.</p>
<p><strong>1. A number as a name, and a field that does not exist.</strong> The PATCH handler copies every key it receives:</p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_1 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"name":123,"isAdmin":true}'</code></pre>
<div class="out">{
  "id": "dev_1",
  "labId": "lab_1",
  "name": 123,
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "AVAILABLE",
  "isAdmin": true
}</div>
<p><code>name</code> is now the number 123 — every client that calls <code>name.toLowerCase()</code> will crash — and the device carries an <code>isAdmin</code> flag nobody designed. Imagine the same handler on a <code>users</code> resource with a real <code>role</code> field.</p>
<p><strong>2. A duplicate serial number through the back door.</strong> <code>POST /devices</code> refuses duplicates (Lab 1), but PATCH never checks:</p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_1 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"serialNo":"FOC1932X0K7"}'</code></pre>
<div class="out">{
  "id": "dev_1",
  "labId": "lab_1",
  "name": 123,
  "type": "ROUTER",
  "serialNo": "FOC1932X0K7",
  "status": "AVAILABLE",
  "isAdmin": true
}</div>
<p><strong>3. An object where text belongs, plus a field the client must not set.</strong></p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_2","startAt":"2026-11-03T08:00:00+07:00","endAt":"2026-11-03T10:00:00+07:00","purpose":{"$gt":""},"status":"APPROVED"}'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_2",
  "userId": "usr_1",
  "startAt": "2026-11-03T01:00:00.000Z",
  "endAt": "2026-11-03T03:00:00.000Z",
  "purpose": {
    "$gt": ""
  },
  "status": "PENDING",
  "createdAt": "2026-10-31T17:50:55.800Z"
}</div>
<p><code>purpose</code> stored an object — <code>{"$gt": ""}</code> is the classic shape of a MongoDB operator injection; with a real database the wrong code would pass it straight into a query. <code>status</code> was ignored only because the handler happened to destructure four fields; nothing in the contract says so.</p>
<p><strong>4. A body that is not JSON at all.</strong></p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: text/plain' \\
  -d '{"labId":"lab_1"}'</code></pre>
<div class="out">{
  "error": "VALIDATION_FAILED",
  "message": "Dữ liệu gửi lên chưa đúng định dạng",
  "details": [
    {
      "field": "labId",
      "issue": "required"
    },
    {
      "field": "startAt",
      "issue": "must be ISO 8601 with timezone"
    },
    {
      "field": "endAt",
      "issue": "must be ISO 8601 with timezone"
    }
  ]
}</div>
<p><code>express.json()</code> skips a <code>text/plain</code> body, so <code>req.body</code> is <code>undefined</code> and the client is told three fields are missing — although it sent them. The truthful answer is <code>415 Unsupported Media Type</code>.</p>
<p><strong>5. 30 February.</strong></p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-02-30T08:00:00+07:00","endAt":"2026-02-30T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "id": "bk_2",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-03-02T01:00:00.000Z",
  "endAt": "2026-03-02T03:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T17:50:55.829Z"
}</div>
<p>Our regular expression checked the <em>shape</em> of the date, and JavaScript’s <code>Date</code> silently rolled 30 February into 2 March. The student now has a booking on a day they never chose.</p>
<p><strong>6. Two error shapes in one API.</strong></p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"status":"BROKEN"}'</code></pre>
<div class="out">{
  "error": "VALIDATION_FAILED",
  "message": "status phải là một trong AVAILABLE, IN_USE, MAINTENANCE"
}</div>
<p>Compared with request 4, this <code>VALIDATION_FAILED</code> has no <code>details</code>, so a front-end cannot highlight the field. Each handler validated in its own way, and the results drifted apart.</p>
<p>None of this needs a genius attacker. It is what happens when validation is a scattering of <code>if</code>s written by different people on different days.</p>

<h3>Where each check belongs</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">0 · the door</span><span class="lz-lnote">JSON and not too big? ⇒ 415 / 413 — no data needed</span></div>
  <div class="lz-layer"><span class="lz-lname">1 · shape (schema)</span><span class="lz-lnote">fields, types, formats, lengths, no extras ⇒ 400 + every field error</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · business rules</span><span class="lz-lnote">makes sense now? ⇒ 422 / 409 — needs data</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · database constraints</span><span class="lz-lnote">last line of defence (Chapter 12)</span></div>
</div>
<table>
  <thead><tr><th>Layer</th><th>Question</th><th>Needs data?</th><th>Answer</th><th>LabFlow example</th></tr></thead>
  <tbody>
    <tr><td>0. The door</td><td>Is it JSON, and not too big?</td><td>no</td><td>415 / 413</td><td><code>text/plain</code>, 200 KB body</td></tr>
    <tr><td>1. Shape (schema)</td><td>Right fields, types, formats, lengths, no extras?</td><td>no</td><td>400 + every field error</td><td>name is a number, 30 February, unknown <code>isAdmin</code></td></tr>
    <tr><td>2. Business rules</td><td>Does it make sense now?</td><td>yes</td><td>422 / 409</td><td>end before start, unknown lab, slot taken, serial taken</td></tr>
    <tr><td>3. Database constraints</td><td>Last line of defence</td><td>yes</td><td>(Chapter 12)</td><td><code>UNIQUE (serial_no)</code></td></tr>
  </tbody>
</table>
<p>Layers 0 and 1 are cheap and identical for every request, so they run first and in one place — at the <strong>edge</strong> of the API. When a request reaches the handler, its body is guaranteed to have the right shape and the handler only checks rules that need data. That is the meaning of “validate at the edge, trust nothing inside”.</p>
<div class="callout warn"><p><strong>Client-side validation does not count.</strong> The form in your React app may check every field, but anyone can call the API with curl, Postman or a script. Front-end checks are for the user’s comfort; the server’s checks are for correctness and security. Always both.</p></div>

<h3>Why a schema instead of more <code>if</code>s</h3>
<p>A <strong>schema</strong> describes what valid data looks like — “an object with exactly these members: <code>labId</code> a string like <code>lab_1</code>, <code>startAt</code> an ISO date-time with an offset…” — and a library checks any value against it. One schema replaces a wall of <code>if</code>s, reports <em>every</em> problem instead of the first, and reads like documentation. LabFlow uses <strong>Zod</strong> (zod.dev), the most common choice in TypeScript/Node projects. Alternatives you will meet: Joi, Yup, Valibot, and AJV, which checks JSON Schema — the same language OpenAPI uses, which matters in Chapter 7. In Spring the same role is played by Bean Validation (<code>@Valid</code>, <code>@NotBlank</code>…).</p>
<pre><code class="language-bash">npm install zod@4</code></pre>
<div class="out">added 1 package, and audited 67 packages in 751ms

31 packages are looking for funding
  run &#96;npm fund&#96; for details

found 0 vulnerabilities</div>
<pre><code class="language-bash">npm ls zod</code></pre>
<div class="out">labflow-api@0.1.0 …/labflow-api
└── zod@4.6.7</div>
<p>Zod 4.6.7 at the time of writing. Write all input schemas in one file, <code>src/schemas.js</code>:</p>
<pre><code class="language-javascript">// schemas.js — hợp đồng đầu vào viết thành CODE: mỗi request phải khớp đúng một lược đồ
import { z } from 'zod';

const id = (prefix) =&gt; z.string().regex(new RegExp(&#96;^\${prefix}_\\\\d+$&#96;), &#96;must look like \${prefix}_1&#96;);
const instant = z.iso.datetime({ offset: true });   // bắt buộc Z hoặc ±hh:mm, kiểm cả ngày có thật

export const DEVICE_TYPES = ['ROUTER', 'SWITCH', 'BOARD', 'PC', 'OTHER'];
export const DEVICE_STATUSES = ['AVAILABLE', 'IN_USE', 'MAINTENANCE'];

// strictObject: trường lạ (status, userId, isAdmin…) ⇒ lỗi, không lặng lẽ bỏ qua
export const BookingCreate = z.strictObject({
  labId: id('lab'),
  startAt: instant,
  endAt: instant,
  purpose: z.string().trim().min(1).max(200).optional(),
});

const deviceFields = {
  labId: id('lab'),
  name: z.string().trim().min(1).max(100),
  type: z.enum(DEVICE_TYPES),
  serialNo: z.string().regex(/^[A-Z0-9-]{6,20}$/, 'must be 6–20 characters A–Z, 0–9 or -'),
  status: z.enum(DEVICE_STATUSES),
  note: z.string().trim().max(500).nullable().optional(),
};
export const DeviceCreate = z.strictObject(deviceFields);          // POST: đủ trường bắt buộc
export const DeviceReplace = DeviceCreate;                         // PUT = thay toàn bộ ⇒ cùng luật
export const DevicePatch = z.strictObject(deviceFields).partial(); // PATCH: trường nào cũng tuỳ chọn

export const LabsQuery = z.strictObject({
  building: z.string().trim().min(1).optional(),
  minCapacity: z.coerce.number().int().min(1).optional(),         // query luôn là chuỗi ⇒ ép sang số
});</code></pre>
<p>Read it as a contract. <code>z.strictObject</code> refuses unknown members — that alone closes holes 1 and 3. <code>z.iso.datetime({ offset: true })</code> requires <code>Z</code> or <code>±hh:mm</code>. <code>.trim()</code> also <em>cleans</em> the value: the handler receives <code>"SWT301"</code>, not <code>"  SWT301  "</code>. <code>.partial()</code> turns every field of the PATCH schema into an optional one, and only <code>note</code> accepts <code>null</code> (meaning “remove it”, JSON Merge Patch from lesson 1.2).</p>

<h3>Strict, strip or passthrough?</h3>
<table>
  <thead><tr><th>Zod</th><th>Unknown member <code>isAdmin</code></th><th>When</th></tr></thead>
  <tbody>
    <tr><td><code>z.object()</code> (default)</td><td>silently removed from the result</td><td>reading data you do not control, e.g. a third-party webhook</td></tr>
    <tr><td><code>z.strictObject()</code></td><td>error: unrecognized key</td><td><strong>LabFlow’s writes</strong> — typos and smuggled fields become visible</td></tr>
    <tr><td><code>z.looseObject()</code></td><td>kept as is</td><td>almost never for input</td></tr>
  </tbody>
</table>
<p>Strict has a cost: a client that sends a field the server does not know yet is refused. Some public APIs prefer to ignore unknown fields for that reason. LabFlow chooses strict because a silent typo — <code>"purpse"</code> — loses data without anyone noticing, and because accepting arbitrary fields is how <strong>mass assignment</strong> happens: the API copies a client-sent <code>role</code> or <code>isAdmin</code> into the record. OWASP lists this under <em>API3:2023 Broken Object Property Level Authorization</em>.</p>

<h3>One middleware for every schema</h3>
<p><code>src/validate.js</code> turns a schema into Express middleware. Errors become RFC 9457 field errors (lesson 2.1): JSON Pointers for the body, parameter names for the query.</p>
<pre><code class="language-javascript">// validate.js — một middleware cho mọi lược đồ: sai ⇒ 400 kèm MỌI lỗi; đúng ⇒ req.valid chứa dữ liệu đã làm sạch
import { HttpError } from './http.js';

// ['profile', 'color'] ⇒ '#/profile/color'  (JSON Pointer, RFC 6901: '~' ⇒ '~0', '/' ⇒ '~1')
export const toPointer = (path) =&gt;
  '#' + path.map((p) =&gt; '/' + String(p).replaceAll('~', '~0').replaceAll('/', '~1')).join('');

function toErrors(issues, where) {
  return issues.flatMap((i) =&gt; {
    const paths = i.code === 'unrecognized_keys' ? i.keys.map((k) =&gt; [...i.path, k]) : [i.path];
    const detail = i.code === 'unrecognized_keys' ? 'unknown field' : i.message;
    return paths.map((p) =&gt; (where === 'query'
      ? { parameter: String(p[0]), detail }       // lỗi ở query: tên tham số
      : { pointer: toPointer(p), detail }));      // lỗi ở body: JSON Pointer
  });
}

export const validate = (where, schema) =&gt; (req, res, next) =&gt; {
  const r = schema.safeParse(req[where] ?? {});
  if (!r.success) {
    throw new HttpError(400, where === 'query' ? 'INVALID_QUERY' : 'VALIDATION_FAILED',
      &#96;\${r.error.issues.length} lỗi trong \${where === 'query' ? 'tham số truy vấn' : 'body'}&#96;, toErrors(r.error.issues, where));
  }
  req.valid = { ...req.valid, [where]: r.data };   // Express 5: req.query chỉ đọc, không gán lại được
  next();
};</code></pre>
<p>Why <code>req.valid</code> and not overwrite <code>req.query</code>? Because Express 5 made <code>req.query</code> a getter. We measured it with a two-line app:</p>
<div class="out">{"threw":"Cannot set property query of #&lt;IncomingMessage&gt; which has only a getter"}</div>
<p>The tilde and slash replacement in <code>toPointer</code> is RFC 6901: a member literally named <code>a/b</code> is written <code>#/a~1b</code>, so it cannot be confused with a nested <code>b</code> inside <code>a</code>.</p>

<h3>Wire it in</h3>
<p>In <code>src/routes/bookings.js</code> the schema replaces the hand-made checks and the old regular expression; the business rules stay where they are:</p>
<pre><code class="language-javascript">import { validate } from '../validate.js';
import { BookingCreate } from '../schemas.js';
// …
  .post(validate('body', BookingCreate), (req, res) =&gt; {
    const { labId, startAt, endAt, purpose } = req.valid.body;   // 1) hình dạng đã được validate kiểm ⇒ 400
    // 2) Đúng hình dạng nhưng vô nghĩa về nghiệp vụ ⇒ 422
    const start = new Date(startAt), end = new Date(endAt);
    if (end &lt;= start) throw new HttpError(422, 'INVALID_TIME_RANGE', 'endAt phải sau startAt');
    // … UNKNOWN_LAB (422), BOOKING_CONFLICT (409) như cũ</code></pre>
<p><code>src/routes/devices.js</code> gets three schemas and one function for the rules that need data — including the duplicate serial check that PATCH was missing:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices, labs, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { DeviceCreate, DeviceReplace, DevicePatch } from '../schemas.js';

export const devicesRouter = Router();
const manager = [requireAuth, requireRole('LAB_MANAGER')];

function findDevice(id) {
  const d = devices.find((x) =&gt; x.id === id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${id}&#96;);
  return d;
}
// Luật NGHIỆP VỤ (cần tra dữ liệu) — chạy SAU khi hình dạng đã đúng
function checkRules(body, selfId) {
  if (body.labId !== undefined &amp;&amp; !labs.some((l) =&gt; l.id === body.labId &amp;&amp; !l.retiredAt))
    throw new HttpError(422, 'UNKNOWN_LAB', &#96;labId \${body.labId} không tồn tại hoặc đã ngừng dùng&#96;);
  if (body.serialNo !== undefined &amp;&amp; devices.some((d) =&gt; d.serialNo === body.serialNo &amp;&amp; d.id !== selfId))
    throw new HttpError(409, 'DUPLICATE_SERIAL', &#96;Đã có thiết bị mang số serial \${body.serialNo}&#96;);
}

devicesRouter.route('/')
  .get((req, res) =&gt; {
    const { labId } = req.query;
    res.json({ data: labId ? devices.filter((d) =&gt; d.labId === labId) : devices });
  })
  .post(...manager, validate('body', DeviceCreate), (req, res) =&gt; {
    const body = req.valid.body;
    checkRules(body);
    const device = { id: nextId('dev'), ...body };     // body đã qua strictObject ⇒ không có trường lạ
    devices.push(device);
    res.status(201).location(&#96;/devices/\${device.id}&#96;).json(device);
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

devicesRouter.route('/:id')
  .get((req, res) =&gt; res.json(findDevice(req.params.id)))
  // PUT = THAY TOÀN BỘ: lược đồ giống hệt lúc tạo
  .put(...manager, validate('body', DeviceReplace), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    checkRules(req.valid.body, d.id);
    Object.keys(d).forEach((k) =&gt; delete d[k]);
    Object.assign(d, { id: req.params.id, ...req.valid.body });
    res.json(d);
  })
  // PATCH = JSON Merge Patch (RFC 7396): null ⇒ xoá trường (chỉ note cho phép null)
  .patch(...manager, validate('body', DevicePatch), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    checkRules(req.valid.body, d.id);
    for (const [k, v] of Object.entries(req.valid.body)) {
      if (v === null) delete d[k];
      else d[k] = v;
    }
    res.json(d);
  })
  .delete(...manager, (req, res) =&gt; {
    const i = devices.findIndex((x) =&gt; x.id === req.params.id);
    if (i === -1) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${req.params.id}&#96;);
    devices.splice(i, 1);
    res.status(204).end();
  })
  .all(onlyAllow('GET', 'HEAD', 'PUT', 'PATCH', 'DELETE'));</code></pre>
<p>In <code>src/routes/labs.js</code>, <code>GET /labs</code> validates its query — which also replaces the hand-written unknown-parameter check of lesson 1.4 — and gains a <code>minCapacity</code> filter:</p>
<pre><code class="language-javascript">  .get(validate('query', LabsQuery), (req, res) =&gt; {
    const { building, minCapacity } = req.valid.query;   // tham số lạ, sai kiểu ⇒ 400 trước khi tới đây
    let data = labs.filter((l) =&gt; !l.retiredAt);
    if (building) data = data.filter((l) =&gt; l.building === building);
    if (minCapacity) data = data.filter((l) =&gt; l.capacity &gt;= minCapacity);
    res.json({ data });
  })</code></pre>
<p>Finally the door, in <code>src/app.js</code>, before <code>express.json()</code>: refuse non-JSON bodies with 415, and lower the size limit to what LabFlow really needs.</p>
<pre><code class="language-javascript">const JSON_TYPES = ['application/json', 'application/merge-patch+json'];
// Có body mà không phải JSON ⇒ 415 ngay ở cửa (req.is: null = không có body, false = có body nhưng sai kiểu)
app.use((req, res, next) =&gt; {
  if (req.is(JSON_TYPES) === false)
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', &#96;Chỉ nhận \${JSON_TYPES.join(' hoặc ')}, nhận \${req.get('content-type')}&#96;);
  next();
});
app.use(express.json({ type: JSON_TYPES, limit: '10kb' }));   // body lớn nhất hợp lệ của LabFlow &lt; 1 KB</code></pre>
<p><code>req.is()</code> has three answers, and the middleware relies on the difference: the matching type when the body matches, <code>false</code> when there is a body of another type, and <code>null</code> when there is no body at all — so <code>POST /bookings/bk_1/cancel</code>, which has no body, is not affected.</p>

<h3>Try it: the six holes again</h3>
<p>Restart the server and replay the attacks.</p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_1 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"name":123,"isAdmin":true}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong body",
  "instance": "/devices/dev_1",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/name",
      "detail": "Invalid input: expected string, received number"
    },
    {
      "pointer": "#/isAdmin",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -i \\
  -X PATCH http://localhost:4000/devices/dev_1 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"serialNo":"FOC1932X0K7"}'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset=utf-8
Content-Length: 243
ETag: W/"f3-rKpABrwBIv3/7HSvKbvWaInjYRQ"
Date: Sat, 31 Oct 2026 17:41:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/duplicate-serial",
  "title": "Trùng số serial",
  "status": 409,
  "detail": "Đã có thiết bị mang số serial FOC1932X0K7",
  "instance": "/devices/dev_1",
  "code": "DUPLICATE_SERIAL"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_2","startAt":"2026-11-03T08:00:00+07:00","endAt":"2026-11-03T10:00:00+07:00","purpose":{"$gt":""},"status":"APPROVED"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/purpose",
      "detail": "Invalid input: expected string, received object"
    },
    {
      "pointer": "#/status",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: text/plain' \\
  -d '{"labId":"lab_1"}'</code></pre>
<div class="out">HTTP/1.1 415 Unsupported Media Type
Content-Type: application/problem+json; charset=utf-8
Content-Length: 310
ETag: W/"136-Y2drd95ur2hNymjP4d/XNi/ANWI"
Date: Sat, 31 Oct 2026 17:41:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/unsupported-media-type",
  "title": "Kiểu nội dung không được hỗ trợ",
  "status": 415,
  "detail": "Chỉ nhận application/json hoặc application/merge-patch+json, nhận text/plain",
  "instance": "/bookings",
  "code": "UNSUPPORTED_MEDIA_TYPE"
}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"status":"BROKEN","note":null}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "1 lỗi trong body",
  "instance": "/devices/dev_3",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/status",
      "detail": "Invalid option: expected one of \\"AVAILABLE\\"|\\"IN_USE\\"|\\"MAINTENANCE\\""
    }
  ]
}</div>
<p>And the calendar: Zod’s date-time pattern knows how many days each month has (leap years included), so 30 February is refused. Notice the second error too — <code>10:00+07:00</code> without seconds:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-02-30T08:00:00+07:00","endAt":"2026-11-02T10:00+07:00"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/startAt",
      "detail": "Invalid ISO datetime"
    },
    {
      "pointer": "#/endAt",
      "detail": "Invalid ISO datetime"
    }
  ]
}</div>
<p>That second error is a real change of contract: Chapter 1’s regular expression accepted <code>T10:00+07:00</code>, Zod’s default requires seconds. Before any client exists, tightening the rule is free; after release, refusing something you used to accept is a <strong>breaking change</strong> (Chapter 4). Write the rule down: LabFlow requires seconds.</p>
<p>A valid booking passes, and arrives clean:</p>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"  SWT301 Lab 3  "}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /bookings/bk_1
Content-Type: application/json; charset=utf-8
Content-Length: 234
ETag: W/"ea-YvSPVSIkgrEbBoJc28p6kMYpTTA"
Date: Sat, 31 Oct 2026 17:41:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": "SWT301 Lab 3",
  "status": "PENDING",
  "createdAt": "2026-10-31T17:41:50.559Z"
}</div>
<p>Business rules still answer with their own codes — the schema only guarantees the shape:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_4","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/unknown-lab",
  "title": "Phòng lab không tồn tại",
  "status": 422,
  "detail": "labId lab_4 không tồn tại hoặc đã ngừng dùng",
  "instance": "/bookings",
  "code": "UNKNOWN_LAB"
}</div>
<p>The query is validated and converted: <code>"25"</code> becomes the number 25.</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?minCapacity=25'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "lab_1",
      "code": "AL-201",
      "name": "Phòng Lab Mạng máy tính",
      "building": "Alpha",
      "capacity": 30
    },
    {
      "id": "lab_3",
      "code": "BE-102",
      "name": "Phòng Lab Phần mềm",
      "building": "Beta",
      "capacity": 40
    }
  ]
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?minCapacity=abc&amp;Building=Beta'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-query",
  "title": "Tham số truy vấn không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong tham số truy vấn",
  "instance": "/labs?minCapacity=abc&amp;Building=Beta",
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "minCapacity",
      "detail": "Invalid input: expected number, received NaN"
    },
    {
      "parameter": "Building",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?minCapacity=10&amp;minCapacity=20'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-query",
  "title": "Tham số truy vấn không hợp lệ",
  "status": 400,
  "detail": "1 lỗi trong tham số truy vấn",
  "instance": "/labs?minCapacity=10&amp;minCapacity=20",
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "minCapacity",
      "detail": "Invalid input: expected number, received NaN"
    }
  ]
}</div>
<p>The last call sends <code>minCapacity</code> twice. Express turns that into an array, <code>Number(["10","20"])</code> is <code>NaN</code>, and the API refuses instead of guessing which one you meant.</p>
<p>JSON Merge Patch still works, and <code>null</code> is only allowed where the contract allows it:</p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE","note":null}'</code></pre>
<div class="out">{
  "id": "dev_3",
  "labId": "lab_2",
  "name": "Raspberry Pi 5",
  "type": "BOARD",
  "serialNo": "RPI5-00421",
  "status": "MAINTENANCE"
}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"name":null}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "1 lỗi trong body",
  "instance": "/devices/dev_3",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/name",
      "detail": "Invalid input: expected string, received null"
    }
  ]
}</div>

<div class="pitfall"><p><strong>Trap — <code>z.coerce.boolean()</code> on a query string.</strong> Coercion uses JavaScript’s own rules, and every non-empty string is truthy. Measured with Zod 4.6.7: <code>z.coerce.boolean().parse('false')</code> returns <code>true</code>. For <code>?onlyAvailable=false</code> use <code>z.stringbool()</code>, which returns <code>false</code> for <code>"false"</code>. Likewise <code>z.coerce.number()</code> turns <code>""</code> into <code>0</code> — LabFlow’s <code>.min(1)</code> catches it, a schema without a minimum would not.</p></div>
<div class="pitfall"><p><strong>Trap — validating, then using the original.</strong> If the handler reads <code>req.body</code> instead of <code>req.valid.body</code>, the trimmed, cleaned value is thrown away and an unknown field could sneak back in through a spread. Read only from the validated copy.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“Where do you validate input?”</strong> At the edge, in one middleware driven by a schema: media type and size first, then shape — every field error at once, as 400 with pointers. Business rules that need data come after, in the service, with their own codes (422, 409). The database keeps constraints as the last line of defence.</p>
<p><strong>“What is mass assignment?”</strong> Copying client-sent fields into a record without an allow-list, so a client can set fields it should not — role, owner, price. Fix: strict schemas for input, explicit mapping into the record, and server-owned fields (id, owner, status, timestamps) never taken from the body.</p>
<p><strong>“The front-end already validates, why again?”</strong> Because the API is public to anything that speaks HTTP. Client checks are for user experience; server checks are for correctness and security.</p>

<a class="link-card" href="https://zod.dev/api" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Zod — API reference (objects, strings) — read 1 Nov 2026</span><span class="lc-sub">z.object() strips unknown keys, z.strictObject() rejects them, z.looseObject() keeps them; z.string().trim() is a transform.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Install Zod, add <code>schemas.js</code> and <code>validate.js</code>, wire them in, and replay the six attacks: each must now be refused with the code shown above.</li>
  <li>Add a <code>sort</code> parameter to <code>GET /labs</code> that accepts only <code>name</code>, <code>-name</code>, <code>capacity</code> or <code>-capacity</code>. Write the schema first, then the code. <code>?sort=size</code> must give 400 with <code>"parameter": "sort"</code>.</li>
  <li>Send <code>{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":""}</code>. Predict the answer, then check. Is an empty purpose a different thing from no purpose? Write one sentence for the contract.</li>
  <li>Grep for <code>req.body</code> in <code>src/routes</code>: apart from <code>issues.js</code> (Lab 2), no handler may read it any more.</li>
</ol>
<p><strong>Done when:</strong> every write endpoint of labs, devices and bookings goes through a strict schema, every validation error is a 400 problem with an <code>errors</code> list that names every bad field, <code>text/plain</code> gives 415, and 11 KB of JSON gives 413.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Validation at the edge</span><span class="v">Checking media type, size and shape once, before any handler runs.</span></div>
  <div class="kv"><span class="k">Schema</span><span class="v">A description of valid data that a library can check values against.</span></div>
  <div class="kv"><span class="k">Zod</span><span class="v">The schema library LabFlow uses; <code>safeParse</code> returns the cleaned data or every issue.</span></div>
  <div class="kv"><span class="k">strictObject</span><span class="v">A Zod object that refuses unknown members instead of dropping them.</span></div>
  <div class="kv"><span class="k">Coercion</span><span class="v">Converting a value to the expected type, e.g. the query string <code>"25"</code> to the number 25.</span></div>
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Copying client-sent fields into a record without an allow-list (OWASP API3:2023).</span></div>
  <div class="kv"><span class="k">415 Unsupported Media Type</span><span class="v">The body is not in a format the endpoint accepts.</span></div>
  <div class="kv"><span class="k">Breaking change</span><span class="v">A change that makes a request or response that used to work stop working, e.g. requiring seconds.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Everything the client sends is a claim; validation turns it into facts before business code runs.</li>
  <li>Order: media type (415) and size (413), then shape (400 with every field error), then business rules (422/409).</li>
  <li>One schema per input, one middleware for all schemas; handlers read only <code>req.valid</code>.</li>
  <li>Strict objects make typos and smuggled fields visible and block mass assignment.</li>
  <li>A schema library checks things hand-written regexes miss — like 30 February — but coercion has traps (<code>"false"</code> is true).</li>
  <li>Tightening validation after release breaks clients: decide the rules early and write them down.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-8-2-production" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — lesson 8.2: Hardening an API for the real world</span><span class="lc-sub">If you took SDN302 on Academy, “strong validation with Joi or Zod” and “validate at the edge, trust nothing inside” are the same advice. Same: one validation step per route before the service layer. Different: SDN302 states the habit; here you attack a real API first and measure what slips through. This lesson adds: strict objects against mass assignment, field errors as RFC 9457 JSON Pointers, 415 and 413 at the door, coercion traps, and why tightening rules later is a breaking change. Not taken SDN302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-1-2-chung-minh-gi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Also in the TypeScript course — 1.2: what a type checker proves, and what it cannot</span><span class="lc-sub">Same: never trust the request body. Different: here a Zod schema checks the body at the door at runtime; that lesson shows, with real output, why the TypeScript type alone cannot — a body with "seats": "31" compiles and still crashes — and writes the first hand-made guard that Zod later replaces.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-6-4-generics-in-practice" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">A type is not a check — TypeScript 6.4: Generics in practice</span><span class="lc-sub">Same: putting a type on incoming data proves nothing — <code>parseJson&lt;User[]&gt;(body)</code> is as unchecked as trusting the body because it is typed. Different: there a Zod schema validates at runtime and returns a 400; the TypeScript lesson names the anti-pattern — a return-only generic is a cast in disguise — and the honest fix, return <code>unknown</code> and narrow with a guard.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Kiểm dữ liệu vào ngay cửa</h2>
<p class="lead">Mọi thứ client gửi lên chỉ là <em>lời khai</em>, chưa phải sự thật: kiểu có thể sai, trường có thể không tồn tại, ngày có thể không có thật, và có client là kẻ tấn công. Validation (kiểm dữ liệu) là chốt bảo vệ ở cửa, biến lời khai thành sự thật trước khi bất kỳ dòng code nghiệp vụ nào chạy. Trong bài này bạn tấn công code Chương 1 của LabFlow và nhìn sáu request lọt qua, rồi thay đống <code>if</code> viết tay bằng <strong>schema</strong> (lược đồ), để một request sai bị chặn ngay ở cửa kèm danh sách mọi lỗi trong một lần.</p>

<h3>Sáu request lẽ ra không bao giờ được chạy</h3>
<p>Tất cả chạy trên code cuối Chương 1 (server vừa khởi động lại). Hãy đọc từng câu trả lời bằng con mắt của người review.</p>
<p><strong>1. Tên là một con số, và một trường không hề tồn tại.</strong> Handler PATCH chép mọi khoá nó nhận được:</p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_1 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"name":123,"isAdmin":true}'</code></pre>
<div class="out">{
  "id": "dev_1",
  "labId": "lab_1",
  "name": 123,
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "AVAILABLE",
  "isAdmin": true
}</div>
<p><code>name</code> giờ là số 123 — client nào gọi <code>name.toLowerCase()</code> sẽ crash — và thiết bị mang một cờ <code>isAdmin</code> không ai thiết kế. Hãy tưởng tượng cùng handler đó trên tài nguyên <code>users</code> có trường <code>role</code> thật.</p>
<p><strong>2. Trùng số serial qua cửa sau.</strong> <code>POST /devices</code> chặn trùng (Lab 1), nhưng PATCH thì không bao giờ kiểm:</p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_1 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"serialNo":"FOC1932X0K7"}'</code></pre>
<div class="out">{
  "id": "dev_1",
  "labId": "lab_1",
  "name": 123,
  "type": "ROUTER",
  "serialNo": "FOC1932X0K7",
  "status": "AVAILABLE",
  "isAdmin": true
}</div>
<p><strong>3. Một object ở chỗ phải là chữ, cộng một trường client không được đặt.</strong></p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_2","startAt":"2026-11-03T08:00:00+07:00","endAt":"2026-11-03T10:00:00+07:00","purpose":{"$gt":""},"status":"APPROVED"}'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_2",
  "userId": "usr_1",
  "startAt": "2026-11-03T01:00:00.000Z",
  "endAt": "2026-11-03T03:00:00.000Z",
  "purpose": {
    "$gt": ""
  },
  "status": "PENDING",
  "createdAt": "2026-10-31T17:50:55.800Z"
}</div>
<p><code>purpose</code> lưu một object — <code>{"$gt": ""}</code> là hình dạng kinh điển của tấn công chèn toán tử MongoDB (operator injection); với cơ sở dữ liệu thật, code viết sai sẽ đưa thẳng nó vào câu truy vấn. <code>status</code> bị bỏ qua chỉ vì handler tình cờ lấy ra bốn trường; hợp đồng không hề nói vậy.</p>
<p><strong>4. Một body chẳng phải JSON.</strong></p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: text/plain' \\
  -d '{"labId":"lab_1"}'</code></pre>
<div class="out">{
  "error": "VALIDATION_FAILED",
  "message": "Dữ liệu gửi lên chưa đúng định dạng",
  "details": [
    {
      "field": "labId",
      "issue": "required"
    },
    {
      "field": "startAt",
      "issue": "must be ISO 8601 with timezone"
    },
    {
      "field": "endAt",
      "issue": "must be ISO 8601 with timezone"
    }
  ]
}</div>
<p><code>express.json()</code> bỏ qua body <code>text/plain</code>, nên <code>req.body</code> là <code>undefined</code> và client bị báo thiếu ba trường — dù nó đã gửi. Câu trả lời trung thực là <code>415 Unsupported Media Type</code> (kiểu nội dung không được hỗ trợ).</p>
<p><strong>5. Ngày 30 tháng 2.</strong></p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-02-30T08:00:00+07:00","endAt":"2026-02-30T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "id": "bk_2",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-03-02T01:00:00.000Z",
  "endAt": "2026-03-02T03:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T17:50:55.829Z"
}</div>
<p>Biểu thức chính quy của ta chỉ kiểm <em>hình dạng</em> của ngày, còn <code>Date</code> của JavaScript lặng lẽ cuộn 30/2 thành 2/3. Sinh viên giờ có một lượt đặt vào ngày họ chưa từng chọn.</p>
<p><strong>6. Hai hình dạng lỗi trong cùng một API.</strong></p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"status":"BROKEN"}'</code></pre>
<div class="out">{
  "error": "VALIDATION_FAILED",
  "message": "status phải là một trong AVAILABLE, IN_USE, MAINTENANCE"
}</div>
<p>So với request 4, lỗi <code>VALIDATION_FAILED</code> này không có <code>details</code>, nên front-end không tô đỏ được ô nhập. Mỗi handler kiểm theo cách riêng, và kết quả trôi dạt mỗi nơi một kiểu.</p>
<p>Không vụ nào cần hacker thiên tài. Đó là chuyện xảy ra khi việc kiểm dữ liệu là những <code>if</code> rải rác, do nhiều người viết vào nhiều ngày khác nhau.</p>

<h3>Mỗi phép kiểm thuộc về đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">0 · cửa vào</span><span class="lz-lnote">có phải JSON, không quá lớn? ⇒ 415 / 413 — chưa cần dữ liệu</span></div>
  <div class="lz-layer"><span class="lz-lname">1 · hình dạng (schema)</span><span class="lz-lnote">trường, kiểu, định dạng, độ dài, không trường lạ ⇒ 400 + mọi lỗi trường</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · luật nghiệp vụ</span><span class="lz-lnote">lúc này có hợp lý? ⇒ 422 / 409 — cần dữ liệu</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · ràng buộc CSDL</span><span class="lz-lnote">tuyến phòng thủ cuối (Chương 12)</span></div>
</div>
<table>
  <thead><tr><th>Tầng</th><th>Câu hỏi</th><th>Cần tra dữ liệu?</th><th>Trả lời</th><th>Ví dụ LabFlow</th></tr></thead>
  <tbody>
    <tr><td>0. Cửa</td><td>Có phải JSON, có quá lớn không?</td><td>không</td><td>415 / 413</td><td><code>text/plain</code>, body 200 KB</td></tr>
    <tr><td>1. Hình dạng (schema)</td><td>Đúng trường, kiểu, định dạng, độ dài, không thừa?</td><td>không</td><td>400 + mọi lỗi từng trường</td><td>name là số, 30/2, <code>isAdmin</code> lạ</td></tr>
    <tr><td>2. Luật nghiệp vụ</td><td>Bây giờ có hợp lý không?</td><td>có</td><td>422 / 409</td><td>kết thúc trước bắt đầu, phòng không có, trùng giờ, trùng serial</td></tr>
    <tr><td>3. Ràng buộc CSDL</td><td>Tuyến phòng thủ cuối</td><td>có</td><td>(Chương 12)</td><td><code>UNIQUE (serial_no)</code></td></tr>
  </tbody>
</table>
<p>Tầng 0 và 1 rẻ và giống nhau cho mọi request, nên chạy trước và ở một chỗ — ở <strong>edge</strong> (rìa, cửa vào) của API. Khi request tới được handler, body của nó chắc chắn đúng hình dạng và handler chỉ còn kiểm các luật cần tra dữ liệu. Đó là ý nghĩa của câu "kiểm ở cửa, bên trong không tin gì cả".</p>
<div class="callout warn"><p><strong>Kiểm ở phía client không được tính.</strong> Form trong app React có thể kiểm từng ô, nhưng ai cũng gọi được API bằng curl, Postman hay một đoạn script. Kiểm ở front-end là để người dùng dễ chịu; kiểm ở server là để đúng và an toàn. Luôn cần cả hai.</p></div>

<h3>Vì sao dùng schema thay vì thêm <code>if</code></h3>
<p>Một <strong>schema</strong> mô tả dữ liệu hợp lệ trông thế nào — "một object có đúng các trường: <code>labId</code> là chuỗi dạng <code>lab_1</code>, <code>startAt</code> là ngày giờ ISO có độ lệch múi giờ…" — và một thư viện đem giá trị bất kỳ ra so với nó. Một schema thay cho cả bức tường <code>if</code>, báo <em>mọi</em> lỗi chứ không chỉ lỗi đầu tiên, và đọc lên như tài liệu. LabFlow dùng <strong>Zod</strong> (zod.dev), lựa chọn phổ biến nhất trong dự án TypeScript/Node. Các lựa chọn khác bạn sẽ gặp: Joi, Yup, Valibot, và AJV — kiểm theo JSON Schema, đúng ngôn ngữ mà OpenAPI dùng, điều này quan trọng ở Chương 7. Trong Spring, vai trò này thuộc về Bean Validation (<code>@Valid</code>, <code>@NotBlank</code>…).</p>
<pre><code class="language-bash">npm install zod@4</code></pre>
<div class="out">added 1 package, and audited 67 packages in 751ms

31 packages are looking for funding
  run &#96;npm fund&#96; for details

found 0 vulnerabilities</div>
<pre><code class="language-bash">npm ls zod</code></pre>
<div class="out">labflow-api@0.1.0 …/labflow-api
└── zod@4.6.7</div>
<p>Lúc viết bài là Zod 4.6.7. Viết mọi schema đầu vào vào một tệp, <code>src/schemas.js</code>:</p>
<pre><code class="language-javascript">// schemas.js — hợp đồng đầu vào viết thành CODE: mỗi request phải khớp đúng một lược đồ
import { z } from 'zod';

const id = (prefix) =&gt; z.string().regex(new RegExp(&#96;^\${prefix}_\\\\d+$&#96;), &#96;must look like \${prefix}_1&#96;);
const instant = z.iso.datetime({ offset: true });   // bắt buộc Z hoặc ±hh:mm, kiểm cả ngày có thật

export const DEVICE_TYPES = ['ROUTER', 'SWITCH', 'BOARD', 'PC', 'OTHER'];
export const DEVICE_STATUSES = ['AVAILABLE', 'IN_USE', 'MAINTENANCE'];

// strictObject: trường lạ (status, userId, isAdmin…) ⇒ lỗi, không lặng lẽ bỏ qua
export const BookingCreate = z.strictObject({
  labId: id('lab'),
  startAt: instant,
  endAt: instant,
  purpose: z.string().trim().min(1).max(200).optional(),
});

const deviceFields = {
  labId: id('lab'),
  name: z.string().trim().min(1).max(100),
  type: z.enum(DEVICE_TYPES),
  serialNo: z.string().regex(/^[A-Z0-9-]{6,20}$/, 'must be 6–20 characters A–Z, 0–9 or -'),
  status: z.enum(DEVICE_STATUSES),
  note: z.string().trim().max(500).nullable().optional(),
};
export const DeviceCreate = z.strictObject(deviceFields);          // POST: đủ trường bắt buộc
export const DeviceReplace = DeviceCreate;                         // PUT = thay toàn bộ ⇒ cùng luật
export const DevicePatch = z.strictObject(deviceFields).partial(); // PATCH: trường nào cũng tuỳ chọn

export const LabsQuery = z.strictObject({
  building: z.string().trim().min(1).optional(),
  minCapacity: z.coerce.number().int().min(1).optional(),         // query luôn là chuỗi ⇒ ép sang số
});</code></pre>
<p>Hãy đọc nó như một bản hợp đồng. <code>z.strictObject</code> từ chối trường lạ — riêng điều này đã bịt lỗ 1 và 3. <code>z.iso.datetime({ offset: true })</code> bắt buộc có <code>Z</code> hoặc <code>±hh:mm</code>. <code>.trim()</code> còn <em>làm sạch</em> giá trị: handler nhận <code>"SWT301"</code>, không phải <code>"  SWT301  "</code>. <code>.partial()</code> biến mọi trường của schema PATCH thành tuỳ chọn, và chỉ <code>note</code> nhận <code>null</code> (nghĩa là "xoá nó đi", JSON Merge Patch ở bài 1.2).</p>

<h3>Strict, strip hay passthrough?</h3>
<table>
  <thead><tr><th>Zod</th><th>Trường lạ <code>isAdmin</code></th><th>Khi nào</th></tr></thead>
  <tbody>
    <tr><td><code>z.object()</code> (mặc định)</td><td>lặng lẽ bị gỡ khỏi kết quả</td><td>đọc dữ liệu bạn không kiểm soát, ví dụ webhook của bên thứ ba</td></tr>
    <tr><td><code>z.strictObject()</code></td><td>lỗi: khoá không được nhận dạng</td><td><strong>các thao tác ghi của LabFlow</strong> — lỗi gõ và trường bị lén nhét vào đều lộ ra</td></tr>
    <tr><td><code>z.looseObject()</code></td><td>giữ nguyên</td><td>gần như không bao giờ dùng cho dữ liệu vào</td></tr>
  </tbody>
</table>
<p>Strict có cái giá của nó: client gửi một trường mà server chưa biết sẽ bị từ chối. Vì vậy một số API công khai chọn bỏ qua trường lạ. LabFlow chọn strict vì một lỗi gõ lặng lẽ — <code>"purpse"</code> — làm mất dữ liệu mà không ai hay, và vì nhận trường tuỳ ý chính là cách <strong>mass assignment</strong> (gán hàng loạt) xảy ra: API chép <code>role</code> hay <code>isAdmin</code> do client gửi vào bản ghi. OWASP xếp lỗi này vào <em>API3:2023 Broken Object Property Level Authorization</em> (hỏng phân quyền ở mức thuộc tính của đối tượng).</p>

<h3>Một middleware cho mọi schema</h3>
<p><code>src/validate.js</code> biến một schema thành middleware của Express. Lỗi được đổi thành lỗi từng trường kiểu RFC 9457 (bài 2.1): JSON Pointer cho body, tên tham số cho query.</p>
<pre><code class="language-javascript">// validate.js — một middleware cho mọi lược đồ: sai ⇒ 400 kèm MỌI lỗi; đúng ⇒ req.valid chứa dữ liệu đã làm sạch
import { HttpError } from './http.js';

// ['profile', 'color'] ⇒ '#/profile/color'  (JSON Pointer, RFC 6901: '~' ⇒ '~0', '/' ⇒ '~1')
export const toPointer = (path) =&gt;
  '#' + path.map((p) =&gt; '/' + String(p).replaceAll('~', '~0').replaceAll('/', '~1')).join('');

function toErrors(issues, where) {
  return issues.flatMap((i) =&gt; {
    const paths = i.code === 'unrecognized_keys' ? i.keys.map((k) =&gt; [...i.path, k]) : [i.path];
    const detail = i.code === 'unrecognized_keys' ? 'unknown field' : i.message;
    return paths.map((p) =&gt; (where === 'query'
      ? { parameter: String(p[0]), detail }       // lỗi ở query: tên tham số
      : { pointer: toPointer(p), detail }));      // lỗi ở body: JSON Pointer
  });
}

export const validate = (where, schema) =&gt; (req, res, next) =&gt; {
  const r = schema.safeParse(req[where] ?? {});
  if (!r.success) {
    throw new HttpError(400, where === 'query' ? 'INVALID_QUERY' : 'VALIDATION_FAILED',
      &#96;\${r.error.issues.length} lỗi trong \${where === 'query' ? 'tham số truy vấn' : 'body'}&#96;, toErrors(r.error.issues, where));
  }
  req.valid = { ...req.valid, [where]: r.data };   // Express 5: req.query chỉ đọc, không gán lại được
  next();
};</code></pre>
<p>Vì sao là <code>req.valid</code> mà không ghi đè <code>req.query</code>? Vì Express 5 biến <code>req.query</code> thành getter (chỉ đọc). Ta đã đo bằng một app hai dòng:</p>
<div class="out">{"threw":"Cannot set property query of #&lt;IncomingMessage&gt; which has only a getter"}</div>
<p>Việc đổi dấu ngã và gạch chéo trong <code>toPointer</code> là luật của RFC 6901: một trường tên đúng là <code>a/b</code> được viết <code>#/a~1b</code>, để không bị nhầm với trường <code>b</code> lồng trong <code>a</code>.</p>

<h3>Lắp vào</h3>
<p>Trong <code>src/routes/bookings.js</code>, schema thay cho các phép kiểm tự chế và biểu thức chính quy cũ; luật nghiệp vụ giữ nguyên chỗ:</p>
<pre><code class="language-javascript">import { validate } from '../validate.js';
import { BookingCreate } from '../schemas.js';
// …
  .post(validate('body', BookingCreate), (req, res) =&gt; {
    const { labId, startAt, endAt, purpose } = req.valid.body;   // 1) hình dạng đã được validate kiểm ⇒ 400
    // 2) Đúng hình dạng nhưng vô nghĩa về nghiệp vụ ⇒ 422
    const start = new Date(startAt), end = new Date(endAt);
    if (end &lt;= start) throw new HttpError(422, 'INVALID_TIME_RANGE', 'endAt phải sau startAt');
    // … UNKNOWN_LAB (422), BOOKING_CONFLICT (409) như cũ</code></pre>
<p><code>src/routes/devices.js</code> nhận ba schema và một hàm cho các luật cần tra dữ liệu — kể cả phép kiểm trùng serial mà PATCH từng bỏ sót:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices, labs, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { DeviceCreate, DeviceReplace, DevicePatch } from '../schemas.js';

export const devicesRouter = Router();
const manager = [requireAuth, requireRole('LAB_MANAGER')];

function findDevice(id) {
  const d = devices.find((x) =&gt; x.id === id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${id}&#96;);
  return d;
}
// Luật NGHIỆP VỤ (cần tra dữ liệu) — chạy SAU khi hình dạng đã đúng
function checkRules(body, selfId) {
  if (body.labId !== undefined &amp;&amp; !labs.some((l) =&gt; l.id === body.labId &amp;&amp; !l.retiredAt))
    throw new HttpError(422, 'UNKNOWN_LAB', &#96;labId \${body.labId} không tồn tại hoặc đã ngừng dùng&#96;);
  if (body.serialNo !== undefined &amp;&amp; devices.some((d) =&gt; d.serialNo === body.serialNo &amp;&amp; d.id !== selfId))
    throw new HttpError(409, 'DUPLICATE_SERIAL', &#96;Đã có thiết bị mang số serial \${body.serialNo}&#96;);
}

devicesRouter.route('/')
  .get((req, res) =&gt; {
    const { labId } = req.query;
    res.json({ data: labId ? devices.filter((d) =&gt; d.labId === labId) : devices });
  })
  .post(...manager, validate('body', DeviceCreate), (req, res) =&gt; {
    const body = req.valid.body;
    checkRules(body);
    const device = { id: nextId('dev'), ...body };     // body đã qua strictObject ⇒ không có trường lạ
    devices.push(device);
    res.status(201).location(&#96;/devices/\${device.id}&#96;).json(device);
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

devicesRouter.route('/:id')
  .get((req, res) =&gt; res.json(findDevice(req.params.id)))
  // PUT = THAY TOÀN BỘ: lược đồ giống hệt lúc tạo
  .put(...manager, validate('body', DeviceReplace), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    checkRules(req.valid.body, d.id);
    Object.keys(d).forEach((k) =&gt; delete d[k]);
    Object.assign(d, { id: req.params.id, ...req.valid.body });
    res.json(d);
  })
  // PATCH = JSON Merge Patch (RFC 7396): null ⇒ xoá trường (chỉ note cho phép null)
  .patch(...manager, validate('body', DevicePatch), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    checkRules(req.valid.body, d.id);
    for (const [k, v] of Object.entries(req.valid.body)) {
      if (v === null) delete d[k];
      else d[k] = v;
    }
    res.json(d);
  })
  .delete(...manager, (req, res) =&gt; {
    const i = devices.findIndex((x) =&gt; x.id === req.params.id);
    if (i === -1) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${req.params.id}&#96;);
    devices.splice(i, 1);
    res.status(204).end();
  })
  .all(onlyAllow('GET', 'HEAD', 'PUT', 'PATCH', 'DELETE'));</code></pre>
<p>Trong <code>src/routes/labs.js</code>, <code>GET /labs</code> kiểm query của nó — thay luôn phép kiểm tham số lạ viết tay ở bài 1.4 — và có thêm bộ lọc <code>minCapacity</code>:</p>
<pre><code class="language-javascript">  .get(validate('query', LabsQuery), (req, res) =&gt; {
    const { building, minCapacity } = req.valid.query;   // tham số lạ, sai kiểu ⇒ 400 trước khi tới đây
    let data = labs.filter((l) =&gt; !l.retiredAt);
    if (building) data = data.filter((l) =&gt; l.building === building);
    if (minCapacity) data = data.filter((l) =&gt; l.capacity &gt;= minCapacity);
    res.json({ data });
  })</code></pre>
<p>Cuối cùng là cánh cửa, trong <code>src/app.js</code>, trước <code>express.json()</code>: từ chối body không phải JSON bằng 415, và hạ giới hạn kích thước xuống mức LabFlow thật sự cần.</p>
<pre><code class="language-javascript">const JSON_TYPES = ['application/json', 'application/merge-patch+json'];
// Có body mà không phải JSON ⇒ 415 ngay ở cửa (req.is: null = không có body, false = có body nhưng sai kiểu)
app.use((req, res, next) =&gt; {
  if (req.is(JSON_TYPES) === false)
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', &#96;Chỉ nhận \${JSON_TYPES.join(' hoặc ')}, nhận \${req.get('content-type')}&#96;);
  next();
});
app.use(express.json({ type: JSON_TYPES, limit: '10kb' }));   // body lớn nhất hợp lệ của LabFlow &lt; 1 KB</code></pre>
<p><code>req.is()</code> có ba kiểu trả lời, và middleware dựa vào chính sự khác nhau đó: trả về kiểu khớp khi body đúng kiểu, <code>false</code> khi có body nhưng sai kiểu, và <code>null</code> khi không có body — nên <code>POST /bookings/bk_1/cancel</code>, vốn không có body, không bị ảnh hưởng.</p>

<h3>Chạy thử: lại sáu lỗ hổng</h3>
<p>Khởi động lại server và tấn công lại.</p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_1 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"name":123,"isAdmin":true}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong body",
  "instance": "/devices/dev_1",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/name",
      "detail": "Invalid input: expected string, received number"
    },
    {
      "pointer": "#/isAdmin",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -i \\
  -X PATCH http://localhost:4000/devices/dev_1 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"serialNo":"FOC1932X0K7"}'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset=utf-8
Content-Length: 243
ETag: W/"f3-rKpABrwBIv3/7HSvKbvWaInjYRQ"
Date: Sat, 31 Oct 2026 17:41:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/duplicate-serial",
  "title": "Trùng số serial",
  "status": 409,
  "detail": "Đã có thiết bị mang số serial FOC1932X0K7",
  "instance": "/devices/dev_1",
  "code": "DUPLICATE_SERIAL"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_2","startAt":"2026-11-03T08:00:00+07:00","endAt":"2026-11-03T10:00:00+07:00","purpose":{"$gt":""},"status":"APPROVED"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/purpose",
      "detail": "Invalid input: expected string, received object"
    },
    {
      "pointer": "#/status",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: text/plain' \\
  -d '{"labId":"lab_1"}'</code></pre>
<div class="out">HTTP/1.1 415 Unsupported Media Type
Content-Type: application/problem+json; charset=utf-8
Content-Length: 310
ETag: W/"136-Y2drd95ur2hNymjP4d/XNi/ANWI"
Date: Sat, 31 Oct 2026 17:41:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/unsupported-media-type",
  "title": "Kiểu nội dung không được hỗ trợ",
  "status": 415,
  "detail": "Chỉ nhận application/json hoặc application/merge-patch+json, nhận text/plain",
  "instance": "/bookings",
  "code": "UNSUPPORTED_MEDIA_TYPE"
}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"status":"BROKEN","note":null}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "1 lỗi trong body",
  "instance": "/devices/dev_3",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/status",
      "detail": "Invalid option: expected one of \\"AVAILABLE\\"|\\"IN_USE\\"|\\"MAINTENANCE\\""
    }
  ]
}</div>
<p>Và cuốn lịch: mẫu ngày giờ của Zod biết mỗi tháng có bao nhiêu ngày (tính cả năm nhuận), nên 30/2 bị từ chối. Để ý cả lỗi thứ hai — <code>10:00+07:00</code> không có giây:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-02-30T08:00:00+07:00","endAt":"2026-11-02T10:00+07:00"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/startAt",
      "detail": "Invalid ISO datetime"
    },
    {
      "pointer": "#/endAt",
      "detail": "Invalid ISO datetime"
    }
  ]
}</div>
<p>Lỗi thứ hai là một thay đổi hợp đồng thật: biểu thức chính quy ở Chương 1 nhận <code>T10:00+07:00</code>, còn mặc định của Zod bắt buộc có giây. Khi chưa có client nào, siết luật là miễn phí; sau khi phát hành, từ chối thứ trước đây vẫn nhận là một <strong>breaking change</strong> (thay đổi phá vỡ, Chương 4). Hãy ghi luật này ra: LabFlow bắt buộc có giây.</p>
<p>Một lượt đặt hợp lệ thì qua, và tới nơi đã sạch sẽ:</p>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"  SWT301 Lab 3  "}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /bookings/bk_1
Content-Type: application/json; charset=utf-8
Content-Length: 234
ETag: W/"ea-YvSPVSIkgrEbBoJc28p6kMYpTTA"
Date: Sat, 31 Oct 2026 17:41:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": "SWT301 Lab 3",
  "status": "PENDING",
  "createdAt": "2026-10-31T17:41:50.559Z"
}</div>
<p>Luật nghiệp vụ vẫn trả mã riêng của chúng — schema chỉ bảo đảm hình dạng:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_4","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/unknown-lab",
  "title": "Phòng lab không tồn tại",
  "status": 422,
  "detail": "labId lab_4 không tồn tại hoặc đã ngừng dùng",
  "instance": "/bookings",
  "code": "UNKNOWN_LAB"
}</div>
<p>Query được kiểm và chuyển kiểu: <code>"25"</code> thành số 25.</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?minCapacity=25'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "lab_1",
      "code": "AL-201",
      "name": "Phòng Lab Mạng máy tính",
      "building": "Alpha",
      "capacity": 30
    },
    {
      "id": "lab_3",
      "code": "BE-102",
      "name": "Phòng Lab Phần mềm",
      "building": "Beta",
      "capacity": 40
    }
  ]
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?minCapacity=abc&amp;Building=Beta'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-query",
  "title": "Tham số truy vấn không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong tham số truy vấn",
  "instance": "/labs?minCapacity=abc&amp;Building=Beta",
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "minCapacity",
      "detail": "Invalid input: expected number, received NaN"
    },
    {
      "parameter": "Building",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?minCapacity=10&amp;minCapacity=20'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-query",
  "title": "Tham số truy vấn không hợp lệ",
  "status": 400,
  "detail": "1 lỗi trong tham số truy vấn",
  "instance": "/labs?minCapacity=10&amp;minCapacity=20",
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "minCapacity",
      "detail": "Invalid input: expected number, received NaN"
    }
  ]
}</div>
<p>Lời gọi cuối gửi <code>minCapacity</code> hai lần. Express biến nó thành mảng, <code>Number(["10","20"])</code> là <code>NaN</code>, và API từ chối thay vì đoán bạn muốn số nào.</p>
<p>JSON Merge Patch vẫn chạy, và <code>null</code> chỉ được dùng ở chỗ hợp đồng cho phép:</p>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE","note":null}'</code></pre>
<div class="out">{
  "id": "dev_3",
  "labId": "lab_2",
  "name": "Raspberry Pi 5",
  "type": "BOARD",
  "serialNo": "RPI5-00421",
  "status": "MAINTENANCE"
}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/devices/dev_3 \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"name":null}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "1 lỗi trong body",
  "instance": "/devices/dev_3",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/name",
      "detail": "Invalid input: expected string, received null"
    }
  ]
}</div>

<div class="pitfall"><p><strong>Bẫy — <code>z.coerce.boolean()</code> với query string.</strong> Ép kiểu dùng luật của chính JavaScript, mà chuỗi không rỗng nào cũng là truthy. Đo bằng Zod 4.6.7: <code>z.coerce.boolean().parse('false')</code> trả về <code>true</code>. Với <code>?onlyAvailable=false</code> hãy dùng <code>z.stringbool()</code>, nó trả <code>false</code> cho <code>"false"</code>. Tương tự <code>z.coerce.number()</code> biến <code>""</code> thành <code>0</code> — <code>.min(1)</code> của LabFlow bắt được, một schema không có mức tối thiểu thì không.</p></div>
<div class="pitfall"><p><strong>Bẫy — kiểm xong rồi lại dùng bản gốc.</strong> Nếu handler đọc <code>req.body</code> thay vì <code>req.valid.body</code>, giá trị đã cắt khoảng trắng, đã làm sạch bị vứt đi, và một trường lạ có thể lọt vào lại qua toán tử spread. Chỉ đọc từ bản đã kiểm.</p></div>

<h3>Phỏng vấn và đi làm</h3>
<p><strong>"Em kiểm dữ liệu vào ở đâu?"</strong> Ở cửa, trong một middleware chạy theo schema: media type và kích thước trước, rồi hình dạng — mọi lỗi từng trường một lần, trả 400 kèm pointer. Luật nghiệp vụ cần tra dữ liệu đi sau, trong service, với mã riêng (422, 409). Cơ sở dữ liệu giữ ràng buộc làm tuyến phòng thủ cuối.</p>
<p><strong>"Mass assignment là gì?"</strong> Chép các trường client gửi vào bản ghi mà không có danh sách cho phép, nên client đặt được thứ không được đặt — vai trò, chủ sở hữu, giá. Cách chữa: schema strict cho dữ liệu vào, ánh xạ tường minh vào bản ghi, và các trường do server sở hữu (id, chủ, status, mốc thời gian) không bao giờ lấy từ body.</p>
<p><strong>"Front-end kiểm rồi, sao còn kiểm nữa?"</strong> Vì API mở cho bất cứ thứ gì nói được HTTP. Kiểm ở client là cho trải nghiệm; kiểm ở server là cho tính đúng và an toàn.</p>

<a class="link-card" href="https://zod.dev/api" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Zod — tài liệu API (object, string) — đọc ngày 1/11/2026</span><span class="lc-sub">z.object() lặng lẽ bỏ khoá lạ, z.strictObject() từ chối, z.looseObject() giữ lại; z.string().trim() là một phép biến đổi.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Cài Zod, thêm <code>schemas.js</code> và <code>validate.js</code>, lắp vào, rồi chạy lại sáu đòn tấn công: cái nào cũng phải bị từ chối với đúng mã như trên.</li>
  <li>Thêm tham số <code>sort</code> cho <code>GET /labs</code>, chỉ nhận <code>name</code>, <code>-name</code>, <code>capacity</code> hoặc <code>-capacity</code>. Viết schema trước, code sau. <code>?sort=size</code> phải ra 400 kèm <code>"parameter": "sort"</code>.</li>
  <li>Gửi <code>{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":""}</code>. Đoán câu trả lời rồi kiểm. Mục đích rỗng có khác "không có mục đích" không? Viết một câu cho hợp đồng.</li>
  <li>Tìm <code>req.body</code> trong <code>src/routes</code>: ngoài <code>issues.js</code> (Lab 2), không handler nào được đọc nó nữa.</li>
</ol>
<p><strong>Đạt khi:</strong> mọi endpoint ghi của labs, devices và bookings đều qua một schema strict, mọi lỗi kiểm dữ liệu là một problem 400 có danh sách <code>errors</code> nêu tên mọi trường sai, <code>text/plain</code> ra 415, và 11 KB JSON ra 413.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Validation at the edge (kiểm ở cửa)</span><span class="v">Kiểm media type, kích thước và hình dạng một lần, trước khi handler nào chạy.</span></div>
  <div class="kv"><span class="k">Schema (lược đồ)</span><span class="v">Bản mô tả dữ liệu hợp lệ mà thư viện đem giá trị ra so được.</span></div>
  <div class="kv"><span class="k">Zod</span><span class="v">Thư viện schema LabFlow dùng; <code>safeParse</code> trả dữ liệu đã làm sạch hoặc mọi lỗi.</span></div>
  <div class="kv"><span class="k">strictObject (object nghiêm ngặt)</span><span class="v">Object của Zod từ chối trường lạ thay vì lặng lẽ bỏ đi.</span></div>
  <div class="kv"><span class="k">Coercion (ép kiểu)</span><span class="v">Đổi giá trị sang kiểu mong đợi, ví dụ chuỗi query <code>"25"</code> thành số 25.</span></div>
  <div class="kv"><span class="k">Mass assignment (gán hàng loạt)</span><span class="v">Chép trường client gửi vào bản ghi mà không có danh sách cho phép (OWASP API3:2023).</span></div>
  <div class="kv"><span class="k">415 Unsupported Media Type (sai kiểu nội dung)</span><span class="v">Body không ở định dạng mà endpoint nhận.</span></div>
  <div class="kv"><span class="k">Breaking change (thay đổi phá vỡ)</span><span class="v">Thay đổi làm một request hay response từng chạy được giờ hỏng, ví dụ bắt buộc có giây.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mọi thứ client gửi là lời khai; validation biến nó thành sự thật trước khi code nghiệp vụ chạy.</li>
  <li>Thứ tự: media type (415) và kích thước (413), rồi hình dạng (400 kèm mọi lỗi từng trường), rồi luật nghiệp vụ (422/409).</li>
  <li>Mỗi đầu vào một schema, một middleware cho mọi schema; handler chỉ đọc <code>req.valid</code>.</li>
  <li>Object strict làm lộ lỗi gõ và trường bị lén nhét, chặn mass assignment.</li>
  <li>Thư viện schema bắt được thứ mà regex viết tay bỏ sót — như 30/2 — nhưng ép kiểu có bẫy (<code>"false"</code> thành true).</li>
  <li>Siết luật kiểm sau khi phát hành sẽ làm vỡ client: quyết luật sớm và ghi ra.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-8-2-production" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp phần này ở SDN302 — bài 8.2: Gia cố một API cho thế giới thật</span><span class="lc-sub">Nếu đã học SDN302 trên Academy, "validation mạnh bằng Joi hoặc Zod" và "kiểm ở cửa, bên trong không tin gì" là cùng một lời khuyên. Giống: một bước kiểm cho mỗi route, trước tầng service. Khác: SDN302 nêu thói quen; ở đây bạn tấn công một API thật trước và đo thứ gì lọt qua. Bài này thêm: object strict chặn mass assignment, lỗi từng trường dạng JSON Pointer của RFC 9457, 415 và 413 ở cửa, bẫy ép kiểu, và vì sao siết luật về sau là thay đổi phá vỡ. Chưa học SDN302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-1-2-chung-minh-gi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Cũng có ở khoá TypeScript — 1.2: trình kiểm tra kiểu chứng minh được gì, và không được gì</span><span class="lc-sub">Giống: không bao giờ tin body của request. Khác: ở đây schema Zod kiểm body ngay cửa lúc chạy; bài đó cho thấy bằng output thật vì sao chỉ có kiểu TypeScript thì không đủ — body có "seats": "31" vẫn biên dịch rồi vẫn sập — và viết guard tự tay đầu tiên mà sau này Zod thay thế.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-6-4-generics-in-practice" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Một cái kiểu không phải một phép kiểm — TypeScript 6.4: Generics thực chiến</span><span class="lc-sub">Giống: dán một cái kiểu lên dữ liệu đến không chứng minh gì — <code>parseJson&lt;User[]&gt;(body)</code> không được kiểm y như tin body vì nó có kiểu. Khác: ở đó một schema Zod kiểm lệ lúc chạy và trả 400; bài TypeScript gọi tên phản-khuôn-mẫu — một generic chỉ-trả-về là một phép ép kiểu trá hình — và cách sửa trung thực, trả <code>unknown</code> rồi narrow bằng một guard.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Response shapes: views, null vs absent, wrapped lists, no always-200|||2.3 — Hình dạng phản hồi: view, null hay vắng mặt, bọc danh sách, không luôn 200',
      slug: 'api-2-3-envelope',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sửa ba vấn đề của response thành công (lộ passwordHash ở /me, hình dạng đổi theo dữ liệu và thời gian) bằng view dạng danh sách cho phép, bọc danh sách, đo envelope luôn 200 và JSON gọn ở production.',
      content: `${G023}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Response shapes: what goes out, and in what wrapper</h2>
<p class="lead">Lessons 2.1 and 2.2 made bad requests fail cleanly. This lesson looks at the other side: the successful responses. They are part of the contract too — every field you send is a field some client will depend on, and every field you send by accident is a leak. You will find three real problems in LabFlow’s successful answers, fix them with one small file of “views”, and measure why the popular “always 200 with an envelope” style breaks ordinary tools.</p>

<h3>Three problems in answers that “work”</h3>
<p>We add a new endpoint, <code>GET /me</code> (“who am I?”), which every app needs after login. The user records in <code>db.js</code> now hold what real user tables hold — an e-mail, a password hash, a counter of failed logins, a private note from the lab staff (fake values, for learning). The first version simply returns the record:</p>
<pre><code class="language-javascript">meRouter.route('/')
  .get(requireAuth, (req, res) =&gt; res.json(req.user))   // ⚠ phiên bản ĐẦU: trả nguyên bản ghi nội bộ
  .all(onlyAllow('GET', 'HEAD'));</code></pre>
<pre><code class="language-bash">curl -s http://localhost:4000/me -H 'Authorization: Bearer tok_bin'</code></pre>
<div class="out">{
  "id": "usr_2",
  "name": "Trần Thị Bình",
  "role": "STUDENT",
  "email": "binh@student.labflow.example",
  "passwordHash": "demo-hash-bin",
  "failedLogins": 3,
  "staffNote": "Hay đặt rồi không đến"
}</div>
<p><strong>Problem 1 — a leak.</strong> Bình now sees her password hash (an attacker can try to crack it offline), the number of failed logins, and what the staff wrote about her. Nobody decided to publish these fields; they went out because <code>res.json</code> sends whatever object it is given. This is the “excessive data exposure” half of OWASP <em>API3:2023</em>, and the T-Mobile incident in lesson 0.9 was the same lesson at the scale of 37 million accounts: return only what the client needs.</p>
<pre><code class="language-bash">curl -s http://localhost:4000/devices</code></pre>
<div class="out">{
  "data": [
    {
      "id": "dev_1",
      "labId": "lab_1",
      "name": "Cisco Router 2901",
      "type": "ROUTER",
      "serialNo": "FTX1840ALBQ",
      "status": "AVAILABLE"
    },
    {
      "id": "dev_2",
      "labId": "lab_1",
      "name": "Cisco Switch 2960",
      "type": "SWITCH",
      "serialNo": "FOC1932X0K7",
      "status": "AVAILABLE"
    },
    {
      "id": "dev_3",
      "labId": "lab_2",
      "name": "Raspberry Pi 5",
      "type": "BOARD",
      "serialNo": "RPI5-00421",
      "status": "AVAILABLE",
      "note": "Thiếu thẻ nhớ"
    }
  ]
}</div>
<p><strong>Problem 2 — the shape depends on the data.</strong> <code>dev_3</code> has a <code>note</code>; <code>dev_1</code> and <code>dev_2</code> have no <code>note</code> member at all. A TypeScript client that declared <code>note: string | null</code> receives <code>undefined</code>; a table component that builds columns from the first row loses the column; a Kotlin or Swift decoder may fail on a missing key.</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T17:42:07.584Z"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings/bk_1/cancel \\
  -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": null,
  "status": "CANCELLED",
  "createdAt": "2026-10-31T17:42:07.584Z",
  "cancelledAt": "2026-10-31T17:42:07.598Z"
}</div>
<p><strong>Problem 3 — the shape changes over time.</strong> The same booking has 8 members when created and 9 after cancellation, because <code>cancelledAt</code> only appears when it is set. A client written against the first answer has never seen the field and does not handle it.</p>
<p>All three have the same cause: the response is whatever the internal object happens to be. The fix is to make the response a <em>deliberate</em> shape.</p>

<h3>Rule 1: an allow-list at the exit</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">internal record</span><span class="lz-t">everything</span><span class="lz-d">passwordHash, failedLogins, staffNote…</span></div>
  <div class="lz-step"><span class="lz-k">view</span><span class="lz-t">allow-list</span><span class="lz-d">only named fields leave the server</span></div>
  <div class="lz-step"><span class="lz-k">shape</span><span class="lz-t">never changes</span><span class="lz-d">optional fields present, null when empty</span></div>
  <div class="lz-step"><span class="lz-k">JSON</span><span class="lz-t">collections wrapped</span><span class="lz-d">{ data: [...] } — items are not</span></div>
</div>
<p>Create <code>src/views.js</code>: one function per resource that builds the public representation by naming every member. Engineers call this a <strong>DTO</strong> (data transfer object), a serializer, a presenter or a view; the idea is the same — the database shape and the API shape are different things, with a translation between them.</p>
<pre><code class="language-javascript">// views.js — "cửa ra" của dữ liệu. Chỉ trường có tên ở đây mới rời khỏi server (danh sách CHO PHÉP).
// Luật LabFlow: trường tuỳ chọn LUÔN có mặt, không có giá trị thì là null — hình dạng không đổi theo thời gian.
export const toLab = (l) =&gt; ({
  id: l.id, code: l.code, name: l.name, building: l.building, capacity: l.capacity,
});
export const toDevice = (d) =&gt; ({
  id: d.id, labId: d.labId, name: d.name, type: d.type, serialNo: d.serialNo, status: d.status,
  note: d.note ?? null,
});
export const toBooking = (b) =&gt; ({
  id: b.id, labId: b.labId, userId: b.userId, startAt: b.startAt, endAt: b.endAt,
  purpose: b.purpose ?? null, status: b.status, createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
});
export const toIssue = (i) =&gt; ({
  id: i.id, deviceId: i.deviceId, reportedBy: i.reportedBy, title: i.title, severity: i.severity,
  status: i.status, createdAt: i.createdAt, resolvedAt: i.resolvedAt ?? null,
});
export const toMe = (u) =&gt; ({ id: u.id, name: u.name, role: u.role, email: u.email });   // KHÔNG passwordHash, failedLogins, staffNote

// Danh sách: luôn bọc trong { data: [...] } — chỗ trống cho meta phân trang ở Chương 3
export const list = (items, view) =&gt; ({ data: items.map(view) });</code></pre>
<p>Why name the fields to <em>keep</em> rather than delete the dangerous ones (<code>delete user.passwordHash</code>)? Because a deny-list fails open: next month someone adds <code>resetToken</code> to the user record and it is published the same day. An allow-list fails closed: a new internal field stays internal until someone adds it to the view on purpose — in code review, where others can ask “should clients see this?”.</p>
<p>Use the views everywhere a resource leaves the server. In <code>src/routes/me.js</code>:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { onlyAllow } from '../http.js';
import { toMe } from '../views.js';

export const meRouter = Router();
meRouter.route('/')
  .get(requireAuth, (req, res) =&gt; res.json(toMe(req.user)))   // chỉ 4 trường của hợp đồng
  .all(onlyAllow('GET', 'HEAD'));</code></pre>
<p>and in every other route, for example:</p>
<pre><code class="language-javascript">res.json(list(data, toLab));                                              // GET /labs
res.json(toLab(findLab(req.params.labId)));                               // GET /labs/:labId
res.status(201).location(&#96;/bookings/\${booking.id}&#96;).json(toBooking(booking)); // POST /bookings
res.json(toBooking(b));                                                   // POST /bookings/:id/cancel</code></pre>

<h3>Rule 2: one shape for the whole life of a resource</h3>
<p>A field that has no value can be sent in two ways: <strong>present with <code>null</code></strong> (<code>"note": null</code>) or <strong>absent</strong>. Both are legitimate, and large APIs use each. What breaks clients is mixing them. LabFlow’s rule, written into the views above: <em>every documented optional member is always present; no value is <code>null</code></em>. The response then has the same members from creation to deletion, and a typed client can declare them once.</p>
<p>Three related rules follow from the same idea:</p>
<ul>
  <li><strong>An empty collection is <code>[]</code></strong>, never <code>null</code>, never a 404. “No labs in building Gamma” is a successful answer.</li>
  <li><strong>Numbers are numbers, booleans are booleans.</strong> <code>"capacity": "30"</code> forces every client to convert, and some will compare strings by mistake (<code>"30" &lt; "4"</code> is <code>true</code>).</li>
  <li><strong>Absent means “not changed”, <code>null</code> means “remove” in requests</strong> — that is the JSON Merge Patch convention from lesson 1.2, and why the PATCH schema in 2.2 accepts <code>null</code> only for <code>note</code>.</li>
</ul>

<h3>Rule 3: collections are wrapped, items are not</h3>
<p>Since Chapter 0 LabFlow answers a list as <code>{"data": [...]}</code> and a single resource as the object itself. The wrapper on lists is not decoration: it leaves room for information <em>about</em> the list. In Chapter 3 the list answer gains paging information next to <code>data</code> — for example <code>{"data": [...], "page": {"next": "…"}}</code> — an <strong>additive</strong> change that breaks nobody. If the list were a bare array, adding paging would change its type from array to object, which breaks every client. The <code>list()</code> helper in <code>views.js</code> makes the wrapper impossible to forget.</p>
<p>A single resource needs no wrapper: there is nothing to say about it that is not in it, and metadata such as caching validators travels in headers (<code>ETag</code>, Chapter 9). Some styles, such as JSON:API, wrap items too — consistent, but more to type. Pick one and apply it everywhere.</p>

<h3>Try it</h3>
<p>Restart the server. <code>/me</code> shows exactly the four members of the contract:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/me -H 'Authorization: Bearer tok_bin'</code></pre>
<div class="out">{
  "id": "usr_2",
  "name": "Trần Thị Bình",
  "role": "STUDENT",
  "email": "binh@student.labflow.example"
}</div>
<p>Every device now has a <code>note</code>, <code>null</code> when empty:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/devices</code></pre>
<div class="out">{
  "data": [
    {
      "id": "dev_1",
      "labId": "lab_1",
      "name": "Cisco Router 2901",
      "type": "ROUTER",
      "serialNo": "FTX1840ALBQ",
      "status": "AVAILABLE",
      "note": null
    },
    {
      "id": "dev_2",
      "labId": "lab_1",
      "name": "Cisco Switch 2960",
      "type": "SWITCH",
      "serialNo": "FOC1932X0K7",
      "status": "AVAILABLE",
      "note": null
    },
    {
      "id": "dev_3",
      "labId": "lab_2",
      "name": "Raspberry Pi 5",
      "type": "BOARD",
      "serialNo": "RPI5-00421",
      "status": "AVAILABLE",
      "note": "Thiếu thẻ nhớ"
    }
  ]
}</div>
<p>A booking has the same nine members before and after it is cancelled:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T17:54:15.507Z",
  "cancelledAt": null
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings/bk_1/cancel \\
  -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": null,
  "status": "CANCELLED",
  "createdAt": "2026-10-31T17:54:15.507Z",
  "cancelledAt": "2026-10-31T17:54:15.526Z"
}</div>
<p>An empty result is still a successful list:</p>
<pre><code class="language-bash">curl -i 'http://localhost:4000/labs?building=Gamma'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 16
ETag: W/"10-beFFU7PPED+FlAUqbY2w5ZxqgRU"
Date: Sat, 31 Oct 2026 17:54:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": []
}</div>

<h3>The “always 200” envelope</h3>
<p>Many projects — especially ones started from Spring tutorials with an <code>ApiResponse&lt;T&gt;</code> class — wrap every answer in an <strong>envelope</strong> such as <code>{"success": …, "code": …, "message": …, "data": …}</code> and always answer HTTP 200, putting the “real” status in the body. Here is that style in eight lines (<code>always200.mjs</code>, port 4003):</p>
<pre><code class="language-javascript">// always200.mjs — phản mẫu: "bọc mọi thứ", lỗi cũng trả HTTP 200
import express from 'express';
const app = express();
app.get('/labs/:id', (req, res) =&gt; {
  if (req.params.id !== 'lab_1') return res.json({ success: false, code: 404, message: 'Không có phòng lab', data: null });
  res.json({ success: true, code: 200, message: 'OK', data: { id: 'lab_1', name: 'Phòng Lab Mạng máy tính' } });
});
app.listen(4003, () =&gt; console.log('always200 ở http://localhost:4003'));</code></pre>
<pre><code class="language-bash">curl -i http://localhost:4003/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-8Tn4qzsllB11kaSHA6nMDI4ifp4"
Date: Sat, 31 Oct 2026 17:54:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"success":false,"code":404,"message":"Không có phòng lab","data":null}</div>
<pre><code class="language-bash">node client200.mjs</code></pre>
<div class="out">http://localhost:4003/labs/lab_9 → status 200 | res.ok = true | app hiện: "Thành công!"
http://localhost:4000/labs/lab_9 → status 404 | res.ok = false | app hiện lỗi</div>
<p>The second command asks the same question of both APIs with an ordinary <code>fetch</code>:</p>
<pre><code class="language-javascript">// client200.mjs — cùng một câu hỏi gửi tới hai API: HTTP nói thật và "luôn 200"
for (const url of ['http://localhost:4003/labs/lab_9', 'http://localhost:4000/labs/lab_9']) {
  const res = await fetch(url);
  console.log(url, '→ status', res.status, '| res.ok =', res.ok, '|', res.ok ? 'app hiện: "Thành công!"' : 'app hiện lỗi');
}</code></pre>
<p>The envelope API says <code>res.ok = true</code> for a lab that does not exist. Every generic tool reads it the same way: an HTTP cache may store the “error” as a valid response, a retry library sees success, monitoring counts zero errors, a load balancer’s health check stays green. Each client must instead know that <code>"code": 404</code> inside a 200 means failure — knowledge that lives in no standard.</p>
<div class="callout warn"><p><strong>If your team already uses an envelope,</strong> you do not have to fight it on day one. Keep the HTTP status truthful anyway (404 is still 404, even with an envelope body), and keep the error body in one documented shape — ideally Problem Details. The harm comes from the 200, not from the wrapper.</p></div>

<h3>Status and body must agree</h3>
<table>
  <thead><tr><th>Answer</th><th>Body</th><th>LabFlow</th></tr></thead>
  <tbody>
    <tr><td><code>200 OK</code></td><td>the resource or the list</td><td><code>GET</code>, <code>PUT</code>, <code>PATCH</code>, the cancel action</td></tr>
    <tr><td><code>201 Created</code></td><td>the created resource, through its view, plus <code>Location</code></td><td><code>POST /bookings</code>, <code>POST /devices</code></td></tr>
    <tr><td><code>204 No Content</code></td><td>nothing at all</td><td><code>DELETE /devices/:id</code></td></tr>
    <tr><td>4xx / 5xx</td><td>a problem document (lesson 2.1)</td><td>every error</td></tr>
  </tbody>
</table>
<pre><code class="language-bash">curl -i -X DELETE http://localhost:4000/devices/dev_2 -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 204 No Content
Date: Sat, 31 Oct 2026 17:54:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5</div>

<h3>Pretty or compact JSON?</h3>
<p>So far LabFlow indents JSON by two spaces so you can read it in the terminal. On the wire that costs bytes. Measured on <code>GET /labs</code>, same data:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{size_download} bytes\\n' http://localhost:4000/labs</code></pre>
<div class="out">454 bytes</div>
<pre><code class="language-bash">curl -s http://localhost:4000/labs</code></pre>
<div class="out">{"data":[{"id":"lab_1","code":"AL-201","name":"Phòng Lab Mạng máy tính","building":"Alpha","capacity":30},{"id":"lab_2","code":"AL-305","name":"Phòng Lab IoT","building":"Alpha","capacity":24},{"id":"lab_3","code":"BE-102","name":"Phòng Lab Phần mềm","building":"Beta","capacity":40}]}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{size_download} bytes\\n' http://localhost:4000/labs</code></pre>
<div class="out">296 bytes</div>
<p>454 bytes indented, 296 compact — about a third less. LabFlow now indents only outside production:</p>
<pre><code class="language-javascript">// Thụt lề 2 dấu cách cho dễ đọc khi học; production gửi JSON liền một dòng (ít byte hơn)
app.set('json spaces', process.env.NODE_ENV === 'production' ? 0 : 2);</code></pre>
<p>Humans can still read production JSON with <code>| jq</code> or the browser’s viewer; compression (gzip, usually done by the reverse proxy) shrinks it further.</p>

<div class="pitfall"><p><strong>Trap — returning ORM objects directly.</strong> <code>res.json(await prisma.user.findUnique(…))</code> or a Mongoose document sends every column, including ones added later. It is the <code>/me</code> leak again, one layer down. Map through a view; in Spring, return a DTO record instead of the <code>@Entity</code>.</p></div>
<div class="pitfall"><p><strong>Trap — two views for the same resource that drift apart.</strong> If <code>GET /devices</code> and <code>GET /labs/lab_1/devices</code> build their objects by hand, one day only one of them gets the new field. Both call <code>toDevice</code>; one function, one shape.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“Why not return the entity directly?”</strong> Because the database shape is not the contract: it contains secrets and internal fields, and it changes for reasons that have nothing to do with clients. A DTO is an explicit allow-list and a stable shape.</p>
<p><strong>“Should we wrap responses?”</strong> Wrap lists so that paging can be added without breaking clients; keep the HTTP status truthful; one documented error shape. An always-200 envelope breaks caches, retries and monitoring.</p>
<p><strong><code>null</code> or omit?</strong> Either, consistently. LabFlow sends documented optional members always, with <code>null</code> when empty, so the shape never changes over a resource’s life.</p>

<a class="link-card" href="https://google.aip.dev/158" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google AIP-158 — Pagination — read 1 Nov 2026</span><span class="lc-sub">Why a list is an object, not a bare array: the response carries the items plus next_page_token — room for paging metadata later.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>views.js</code>, use it in every route of labs, devices, bookings and <code>/me</code>, restart, and reproduce the outputs above.</li>
  <li>Prove the allow-list: add <code>resetToken: 'abc'</code> to Bình’s record in <code>db.js</code>, restart, call <code>/me</code> as <code>tok_bin</code>. The token must not appear. Then write the one-line change a deny-list version would have needed — and would have forgotten.</li>
  <li>Measure <code>GET /devices</code> with <code>-w '%{size_download}'</code> in both modes. Predict the saving first.</li>
  <li>Run <code>node client200.mjs</code> yourself, then explain in two sentences to a teammate why <code>res.ok</code> is <code>true</code> for the envelope API.</li>
</ol>
<p><strong>Done when:</strong> no route calls <code>res.json</code> on a raw record, <code>/me</code> returns exactly <code>id</code>, <code>name</code>, <code>role</code>, <code>email</code>, every device and booking has the same members whatever its state, and an empty filter returns <code>{"data": []}</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Representation</span><span class="v">The public shape of a resource in a response, as opposed to how it is stored.</span></div>
  <div class="kv"><span class="k">DTO / view / serializer</span><span class="v">The function or class that builds the representation from the internal record.</span></div>
  <div class="kv"><span class="k">Allow-list</span><span class="v">Naming what may go out; new fields stay hidden by default (fails closed).</span></div>
  <div class="kv"><span class="k">Excessive data exposure</span><span class="v">Sending fields the client does not need — part of OWASP API3:2023.</span></div>
  <div class="kv"><span class="k">Envelope</span><span class="v">A wrapper object around the data, e.g. <code>{"data": [...]}</code> or <code>{"success", "code", "data"}</code>.</span></div>
  <div class="kv"><span class="k">Additive change</span><span class="v">Adding a member a client may ignore — safe, unlike renaming or changing a type.</span></div>
  <div class="kv"><span class="k">null vs absent</span><span class="v">Two ways to say “no value”; pick one per API and never mix.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Successful responses are contract too: every member sent is a member someone will depend on.</li>
  <li>Build every response through a view that names the members to send — an allow-list that fails closed.</li>
  <li>Keep one shape for a resource’s whole life: documented optional members always present, <code>null</code> when empty.</li>
  <li>Wrap lists in <code>{"data": [...]}</code> so metadata such as paging can be added without breaking clients; empty lists are <code>[]</code>.</li>
  <li>Never answer 200 for a failure, envelope or not: caches, retries and monitoring read the status line.</li>
  <li>Indent JSON for humans in development, send it compact in production.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-6-3-generic-types-classes" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">The same envelope, as a generic type — TypeScript 6.3: Generic interfaces, classes &amp; defaults</span><span class="lc-sub">Same: model “a value or an error” once and reuse it for every resource — the success/failure envelope is a <code>Result&lt;T, E&gt;</code>. Different: here it is the JSON shape sent over the wire with an HTTP status; there it is a generic TypeScript type alias with a default error (<code>E = string</code>) that the compiler narrows on <code>ok</code>, built end-to-end in Lab 6.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Hình dạng phản hồi: cái gì đi ra, và bọc trong gì</h2>
<p class="lead">Bài 2.1 và 2.2 làm cho request sai thất bại một cách gọn gàng. Bài này nhìn sang phía bên kia: các response thành công. Chúng cũng là một phần của hợp đồng — mỗi trường bạn gửi là một trường mà client nào đó sẽ phụ thuộc vào, và mỗi trường bạn lỡ gửi là một vụ rò rỉ. Bạn sẽ tìm ra ba vấn đề thật trong các câu trả lời thành công của LabFlow, sửa chúng bằng một tệp "view" nhỏ, và đo xem vì sao kiểu "luôn trả 200 kèm envelope" rất phổ biến lại làm hỏng các công cụ bình thường.</p>

<h3>Ba vấn đề trong những câu trả lời "chạy được"</h3>
<p>Ta thêm một endpoint mới, <code>GET /me</code> ("tôi là ai?"), app nào cũng cần sau khi đăng nhập. Bản ghi người dùng trong <code>db.js</code> giờ chứa những thứ mà bảng người dùng thật hay chứa — email, mã băm mật khẩu (password hash), số lần đăng nhập sai, một ghi chú riêng của nhân viên phòng lab (giá trị giả, để học). Phiên bản đầu chỉ việc trả nguyên bản ghi:</p>
<pre><code class="language-javascript">meRouter.route('/')
  .get(requireAuth, (req, res) =&gt; res.json(req.user))   // ⚠ phiên bản ĐẦU: trả nguyên bản ghi nội bộ
  .all(onlyAllow('GET', 'HEAD'));</code></pre>
<pre><code class="language-bash">curl -s http://localhost:4000/me -H 'Authorization: Bearer tok_bin'</code></pre>
<div class="out">{
  "id": "usr_2",
  "name": "Trần Thị Bình",
  "role": "STUDENT",
  "email": "binh@student.labflow.example",
  "passwordHash": "demo-hash-bin",
  "failedLogins": 3,
  "staffNote": "Hay đặt rồi không đến"
}</div>
<p><strong>Vấn đề 1 — rò rỉ.</strong> Bình giờ thấy mã băm mật khẩu của mình (kẻ tấn công có thể đem về bẻ khoá ngoại tuyến), số lần đăng nhập sai, và cả lời nhân viên viết về cô. Không ai quyết định công bố các trường này; chúng đi ra chỉ vì <code>res.json</code> gửi bất cứ object nào nó được đưa. Đây là nửa "excessive data exposure" (lộ dữ liệu quá mức) của OWASP <em>API3:2023</em>, và sự cố T-Mobile ở bài 0.9 là cùng bài học ở quy mô 37 triệu tài khoản: chỉ trả về thứ client cần.</p>
<pre><code class="language-bash">curl -s http://localhost:4000/devices</code></pre>
<div class="out">{
  "data": [
    {
      "id": "dev_1",
      "labId": "lab_1",
      "name": "Cisco Router 2901",
      "type": "ROUTER",
      "serialNo": "FTX1840ALBQ",
      "status": "AVAILABLE"
    },
    {
      "id": "dev_2",
      "labId": "lab_1",
      "name": "Cisco Switch 2960",
      "type": "SWITCH",
      "serialNo": "FOC1932X0K7",
      "status": "AVAILABLE"
    },
    {
      "id": "dev_3",
      "labId": "lab_2",
      "name": "Raspberry Pi 5",
      "type": "BOARD",
      "serialNo": "RPI5-00421",
      "status": "AVAILABLE",
      "note": "Thiếu thẻ nhớ"
    }
  ]
}</div>
<p><strong>Vấn đề 2 — hình dạng phụ thuộc dữ liệu.</strong> <code>dev_3</code> có <code>note</code>; <code>dev_1</code> và <code>dev_2</code> hoàn toàn không có trường <code>note</code>. Một client TypeScript khai báo <code>note: string | null</code> lại nhận <code>undefined</code>; một component bảng dựng cột theo dòng đầu tiên sẽ mất cột; bộ giải mã của Kotlin hay Swift có thể lỗi khi thiếu khoá.</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T17:42:07.584Z"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings/bk_1/cancel \\
  -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": null,
  "status": "CANCELLED",
  "createdAt": "2026-10-31T17:42:07.584Z",
  "cancelledAt": "2026-10-31T17:42:07.598Z"
}</div>
<p><strong>Vấn đề 3 — hình dạng đổi theo thời gian.</strong> Cùng một lượt đặt có 8 trường lúc tạo và 9 trường sau khi huỷ, vì <code>cancelledAt</code> chỉ xuất hiện khi đã được đặt. Client viết theo câu trả lời đầu tiên chưa từng thấy trường này và không xử lý nó.</p>
<p>Cả ba có chung một nguyên nhân: response là bất cứ hình dạng gì object nội bộ tình cờ đang có. Cách chữa là biến response thành một hình dạng <em>có chủ đích</em>.</p>

<h3>Luật 1: danh sách cho phép ở cửa ra</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">bản ghi nội bộ</span><span class="lz-t">mọi thứ</span><span class="lz-d">passwordHash, failedLogins, staffNote…</span></div>
  <div class="lz-step"><span class="lz-k">view</span><span class="lz-t">danh sách cho phép</span><span class="lz-d">chỉ trường có tên mới rời server</span></div>
  <div class="lz-step"><span class="lz-k">hình dạng</span><span class="lz-t">không đổi</span><span class="lz-d">trường tuỳ chọn vẫn có, rỗng thì null</span></div>
  <div class="lz-step"><span class="lz-k">JSON</span><span class="lz-t">danh sách được bọc</span><span class="lz-d">{ data: [...] } — phần tử thì không</span></div>
</div>
<p>Tạo <code>src/views.js</code>: mỗi tài nguyên một hàm, dựng bản biểu diễn công khai bằng cách gọi tên từng trường. Kỹ sư gọi thứ này là <strong>DTO</strong> (data transfer object — đối tượng chuyển dữ liệu), serializer, presenter hay view; ý tưởng là một — hình dạng trong cơ sở dữ liệu và hình dạng của API là hai thứ khác nhau, có một bước dịch ở giữa.</p>
<pre><code class="language-javascript">// views.js — "cửa ra" của dữ liệu. Chỉ trường có tên ở đây mới rời khỏi server (danh sách CHO PHÉP).
// Luật LabFlow: trường tuỳ chọn LUÔN có mặt, không có giá trị thì là null — hình dạng không đổi theo thời gian.
export const toLab = (l) =&gt; ({
  id: l.id, code: l.code, name: l.name, building: l.building, capacity: l.capacity,
});
export const toDevice = (d) =&gt; ({
  id: d.id, labId: d.labId, name: d.name, type: d.type, serialNo: d.serialNo, status: d.status,
  note: d.note ?? null,
});
export const toBooking = (b) =&gt; ({
  id: b.id, labId: b.labId, userId: b.userId, startAt: b.startAt, endAt: b.endAt,
  purpose: b.purpose ?? null, status: b.status, createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
});
export const toIssue = (i) =&gt; ({
  id: i.id, deviceId: i.deviceId, reportedBy: i.reportedBy, title: i.title, severity: i.severity,
  status: i.status, createdAt: i.createdAt, resolvedAt: i.resolvedAt ?? null,
});
export const toMe = (u) =&gt; ({ id: u.id, name: u.name, role: u.role, email: u.email });   // KHÔNG passwordHash, failedLogins, staffNote

// Danh sách: luôn bọc trong { data: [...] } — chỗ trống cho meta phân trang ở Chương 3
export const list = (items, view) =&gt; ({ data: items.map(view) });</code></pre>
<p>Vì sao liệt kê những trường được <em>giữ</em> thay vì xoá những trường nguy hiểm (<code>delete user.passwordHash</code>)? Vì danh sách cấm (deny-list) hỏng theo kiểu mở cửa: tháng sau có người thêm <code>resetToken</code> vào bản ghi người dùng và nó bị công bố ngay hôm đó. Danh sách cho phép (allow-list) hỏng theo kiểu đóng cửa: một trường nội bộ mới vẫn nằm trong nhà cho tới khi có người cố ý thêm nó vào view — trong lúc review code, nơi người khác hỏi được "client có nên thấy cái này không?".</p>
<p>Dùng view ở mọi chỗ một tài nguyên rời khỏi server. Trong <code>src/routes/me.js</code>:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { onlyAllow } from '../http.js';
import { toMe } from '../views.js';

export const meRouter = Router();
meRouter.route('/')
  .get(requireAuth, (req, res) =&gt; res.json(toMe(req.user)))   // chỉ 4 trường của hợp đồng
  .all(onlyAllow('GET', 'HEAD'));</code></pre>
<p>và ở mọi route khác, ví dụ:</p>
<pre><code class="language-javascript">res.json(list(data, toLab));                                              // GET /labs
res.json(toLab(findLab(req.params.labId)));                               // GET /labs/:labId
res.status(201).location(&#96;/bookings/\${booking.id}&#96;).json(toBooking(booking)); // POST /bookings
res.json(toBooking(b));                                                   // POST /bookings/:id/cancel</code></pre>

<h3>Luật 2: một hình dạng cho cả đời một tài nguyên</h3>
<p>Một trường không có giá trị có thể được gửi theo hai cách: <strong>có mặt với <code>null</code></strong> (<code>"note": null</code>) hoặc <strong>vắng mặt</strong>. Cả hai đều chính đáng, và các API lớn dùng cả hai. Thứ làm vỡ client là trộn lẫn. Luật của LabFlow, đã viết vào các view ở trên: <em>mọi trường tuỳ chọn có trong tài liệu luôn có mặt; không có giá trị thì là <code>null</code></em>. Nhờ vậy response có đúng các trường đó từ lúc tạo tới lúc xoá, và client có kiểu chỉ cần khai báo một lần.</p>
<p>Ba luật liên quan đi ra từ cùng ý đó:</p>
<ul>
  <li><strong>Bộ sưu tập rỗng là <code>[]</code></strong>, không bao giờ là <code>null</code>, không bao giờ là 404. "Toà Gamma không có phòng nào" là một câu trả lời thành công.</li>
  <li><strong>Số là số, boolean là boolean.</strong> <code>"capacity": "30"</code> bắt mọi client phải đổi kiểu, và sẽ có client so sánh chuỗi do nhầm (<code>"30" &lt; "4"</code> là <code>true</code>).</li>
  <li><strong>Trong request, vắng nghĩa là "không đổi", <code>null</code> nghĩa là "xoá"</strong> — đó là quy ước JSON Merge Patch ở bài 1.2, và là lý do schema PATCH ở bài 2.2 chỉ nhận <code>null</code> cho <code>note</code>.</li>
</ul>

<h3>Luật 3: danh sách thì bọc, phần tử thì không</h3>
<p>Từ Mục 0, LabFlow trả danh sách dạng <code>{"data": [...]}</code> và một tài nguyên đơn lẻ là chính object đó. Lớp bọc quanh danh sách không phải để trang trí: nó chừa chỗ cho thông tin <em>về</em> danh sách. Ở Chương 3, câu trả lời dạng danh sách có thêm thông tin phân trang bên cạnh <code>data</code> — ví dụ <code>{"data": [...], "page": {"next": "…"}}</code> — một thay đổi <strong>thêm vào</strong> (additive), không làm vỡ ai. Nếu danh sách là một mảng trần, thêm phân trang sẽ đổi kiểu của nó từ mảng sang object, làm vỡ mọi client. Hàm <code>list()</code> trong <code>views.js</code> khiến không thể quên lớp bọc.</p>
<p>Một tài nguyên đơn lẻ không cần lớp bọc: chẳng có gì để nói về nó mà không nằm sẵn trong nó, và siêu dữ liệu như bộ kiểm cache đi trong header (<code>ETag</code>, Chương 9). Một số phong cách, như JSON:API, bọc cả phần tử — nhất quán, nhưng gõ nhiều hơn. Chọn một kiểu và áp dụng ở mọi nơi.</p>

<h3>Chạy thử</h3>
<p>Khởi động lại server. <code>/me</code> trả đúng bốn trường của hợp đồng:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/me -H 'Authorization: Bearer tok_bin'</code></pre>
<div class="out">{
  "id": "usr_2",
  "name": "Trần Thị Bình",
  "role": "STUDENT",
  "email": "binh@student.labflow.example"
}</div>
<p>Thiết bị nào cũng có <code>note</code>, rỗng thì là <code>null</code>:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/devices</code></pre>
<div class="out">{
  "data": [
    {
      "id": "dev_1",
      "labId": "lab_1",
      "name": "Cisco Router 2901",
      "type": "ROUTER",
      "serialNo": "FTX1840ALBQ",
      "status": "AVAILABLE",
      "note": null
    },
    {
      "id": "dev_2",
      "labId": "lab_1",
      "name": "Cisco Switch 2960",
      "type": "SWITCH",
      "serialNo": "FOC1932X0K7",
      "status": "AVAILABLE",
      "note": null
    },
    {
      "id": "dev_3",
      "labId": "lab_2",
      "name": "Raspberry Pi 5",
      "type": "BOARD",
      "serialNo": "RPI5-00421",
      "status": "AVAILABLE",
      "note": "Thiếu thẻ nhớ"
    }
  ]
}</div>
<p>Một lượt đặt có đúng chín trường trước và sau khi bị huỷ:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T17:54:15.507Z",
  "cancelledAt": null
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings/bk_1/cancel \\
  -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": null,
  "status": "CANCELLED",
  "createdAt": "2026-10-31T17:54:15.507Z",
  "cancelledAt": "2026-10-31T17:54:15.526Z"
}</div>
<p>Kết quả rỗng vẫn là một danh sách thành công:</p>
<pre><code class="language-bash">curl -i 'http://localhost:4000/labs?building=Gamma'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 16
ETag: W/"10-beFFU7PPED+FlAUqbY2w5ZxqgRU"
Date: Sat, 31 Oct 2026 17:54:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "data": []
}</div>

<h3>Envelope "luôn 200"</h3>
<p>Rất nhiều dự án — nhất là những dự án bắt đầu từ hướng dẫn Spring có lớp <code>ApiResponse&lt;T&gt;</code> — bọc mọi câu trả lời trong một <strong>envelope</strong> (phong bì) kiểu <code>{"success": …, "code": …, "message": …, "data": …}</code> và luôn trả HTTP 200, đặt mã trạng thái "thật" vào trong body. Đây là phong cách đó trong tám dòng (<code>always200.mjs</code>, cổng 4003):</p>
<pre><code class="language-javascript">// always200.mjs — phản mẫu: "bọc mọi thứ", lỗi cũng trả HTTP 200
import express from 'express';
const app = express();
app.get('/labs/:id', (req, res) =&gt; {
  if (req.params.id !== 'lab_1') return res.json({ success: false, code: 404, message: 'Không có phòng lab', data: null });
  res.json({ success: true, code: 200, message: 'OK', data: { id: 'lab_1', name: 'Phòng Lab Mạng máy tính' } });
});
app.listen(4003, () =&gt; console.log('always200 ở http://localhost:4003'));</code></pre>
<pre><code class="language-bash">curl -i http://localhost:4003/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-8Tn4qzsllB11kaSHA6nMDI4ifp4"
Date: Sat, 31 Oct 2026 17:54:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"success":false,"code":404,"message":"Không có phòng lab","data":null}</div>
<pre><code class="language-bash">node client200.mjs</code></pre>
<div class="out">http://localhost:4003/labs/lab_9 → status 200 | res.ok = true | app hiện: "Thành công!"
http://localhost:4000/labs/lab_9 → status 404 | res.ok = false | app hiện lỗi</div>
<p>Lệnh thứ hai hỏi cùng một câu với cả hai API bằng một <code>fetch</code> bình thường:</p>
<pre><code class="language-javascript">// client200.mjs — cùng một câu hỏi gửi tới hai API: HTTP nói thật và "luôn 200"
for (const url of ['http://localhost:4003/labs/lab_9', 'http://localhost:4000/labs/lab_9']) {
  const res = await fetch(url);
  console.log(url, '→ status', res.status, '| res.ok =', res.ok, '|', res.ok ? 'app hiện: "Thành công!"' : 'app hiện lỗi');
}</code></pre>
<p>API dùng envelope nói <code>res.ok = true</code> cho một phòng không tồn tại. Mọi công cụ dùng chung đọc y như vậy: cache HTTP có thể lưu "lỗi" như một response hợp lệ, thư viện thử lại thấy thành công, hệ thống giám sát đếm được 0 lỗi, health check của load balancer vẫn xanh. Thay vào đó, từng client phải tự biết rằng <code>"code": 404</code> nằm trong một response 200 nghĩa là thất bại — một hiểu biết không nằm trong chuẩn nào.</p>
<div class="callout warn"><p><strong>Nếu nhóm bạn đã dùng envelope,</strong> không cần đánh đổ nó ngay ngày đầu. Cứ giữ mã HTTP trung thực (404 vẫn là 404, dù body có envelope), và giữ body lỗi theo một hình dạng có tài liệu — tốt nhất là Problem Details. Cái hại đến từ con số 200, không phải từ lớp bọc.</p></div>

<h3>Mã trạng thái và body phải khớp nhau</h3>
<table>
  <thead><tr><th>Câu trả lời</th><th>Body</th><th>LabFlow</th></tr></thead>
  <tbody>
    <tr><td><code>200 OK</code></td><td>tài nguyên hoặc danh sách</td><td><code>GET</code>, <code>PUT</code>, <code>PATCH</code>, hành động huỷ</td></tr>
    <tr><td><code>201 Created</code></td><td>tài nguyên vừa tạo, qua view của nó, kèm <code>Location</code></td><td><code>POST /bookings</code>, <code>POST /devices</code></td></tr>
    <tr><td><code>204 No Content</code></td><td>hoàn toàn không có gì</td><td><code>DELETE /devices/:id</code></td></tr>
    <tr><td>4xx / 5xx</td><td>một tài liệu problem (bài 2.1)</td><td>mọi lỗi</td></tr>
  </tbody>
</table>
<pre><code class="language-bash">curl -i -X DELETE http://localhost:4000/devices/dev_2 -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 204 No Content
Date: Sat, 31 Oct 2026 17:54:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5</div>

<h3>JSON đẹp hay JSON gọn?</h3>
<p>Tới giờ LabFlow thụt lề JSON hai dấu cách để bạn đọc được trong terminal. Trên đường truyền, việc đó tốn byte. Đo trên <code>GET /labs</code>, cùng dữ liệu:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{size_download} bytes\\n' http://localhost:4000/labs</code></pre>
<div class="out">454 bytes</div>
<pre><code class="language-bash">curl -s http://localhost:4000/labs</code></pre>
<div class="out">{"data":[{"id":"lab_1","code":"AL-201","name":"Phòng Lab Mạng máy tính","building":"Alpha","capacity":30},{"id":"lab_2","code":"AL-305","name":"Phòng Lab IoT","building":"Alpha","capacity":24},{"id":"lab_3","code":"BE-102","name":"Phòng Lab Phần mềm","building":"Beta","capacity":40}]}</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{size_download} bytes\\n' http://localhost:4000/labs</code></pre>
<div class="out">296 bytes</div>
<p>454 byte khi thụt lề, 296 khi gọn — ít hơn khoảng một phần ba. LabFlow giờ chỉ thụt lề ngoài môi trường production:</p>
<pre><code class="language-javascript">// Thụt lề 2 dấu cách cho dễ đọc khi học; production gửi JSON liền một dòng (ít byte hơn)
app.set('json spaces', process.env.NODE_ENV === 'production' ? 0 : 2);</code></pre>
<p>Người vẫn đọc được JSON production bằng <code>| jq</code> hoặc trình xem JSON của trình duyệt; nén (gzip, thường do reverse proxy làm) còn làm nó nhỏ hơn nữa.</p>

<div class="pitfall"><p><strong>Bẫy — trả thẳng object của ORM.</strong> <code>res.json(await prisma.user.findUnique(…))</code> hay một document của Mongoose gửi đi mọi cột, kể cả cột thêm về sau. Đó lại là vụ rò rỉ <code>/me</code>, chỉ nằm sâu hơn một tầng. Hãy đi qua view; trong Spring, trả một DTO (record) thay vì <code>@Entity</code>.</p></div>
<div class="pitfall"><p><strong>Bẫy — hai view cho cùng một tài nguyên rồi trôi dạt.</strong> Nếu <code>GET /devices</code> và <code>GET /labs/lab_1/devices</code> tự dựng object bằng tay, sẽ có ngày chỉ một trong hai có trường mới. Cả hai gọi <code>toDevice</code>; một hàm, một hình dạng.</p></div>

<h3>Phỏng vấn và đi làm</h3>
<p><strong>"Sao không trả thẳng entity?"</strong> Vì hình dạng trong cơ sở dữ liệu không phải hợp đồng: nó chứa bí mật và trường nội bộ, và nó thay đổi vì những lý do chẳng liên quan gì tới client. DTO là một danh sách cho phép tường minh và một hình dạng ổn định.</p>
<p><strong>"Có nên bọc response không?"</strong> Bọc danh sách để thêm được phân trang mà không làm vỡ client; giữ mã HTTP trung thực; một hình dạng lỗi có tài liệu. Envelope luôn trả 200 làm hỏng cache, cơ chế thử lại và giám sát.</p>
<p><strong><code>null</code> hay bỏ hẳn?</strong> Cái nào cũng được, miễn nhất quán. LabFlow luôn gửi các trường tuỳ chọn có trong tài liệu, rỗng thì <code>null</code>, nên hình dạng không bao giờ đổi trong đời một tài nguyên.</p>

<a class="link-card" href="https://google.aip.dev/158" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google AIP-158 — Pagination — đọc ngày 1/11/2026</span><span class="lc-sub">Vì sao danh sách là một object, không phải mảng trần: câu trả lời mang các phần tử cộng next_page_token — chỗ trống cho thông tin phân trang sau này.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>views.js</code>, dùng nó ở mọi route của labs, devices, bookings và <code>/me</code>, khởi động lại, và tái hiện các output ở trên.</li>
  <li>Chứng minh danh sách cho phép: thêm <code>resetToken: 'abc'</code> vào bản ghi của Bình trong <code>db.js</code>, khởi động lại, gọi <code>/me</code> bằng <code>tok_bin</code>. Token không được xuất hiện. Rồi viết ra dòng sửa mà bản dùng danh sách cấm lẽ ra cần — và lẽ ra đã quên.</li>
  <li>Đo <code>GET /devices</code> bằng <code>-w '%{size_download}'</code> ở cả hai chế độ. Đoán mức tiết kiệm trước.</li>
  <li>Tự chạy <code>node client200.mjs</code>, rồi giải thích trong hai câu cho bạn cùng nhóm vì sao <code>res.ok</code> là <code>true</code> với API dùng envelope.</li>
</ol>
<p><strong>Đạt khi:</strong> không route nào gọi <code>res.json</code> với bản ghi thô, <code>/me</code> trả đúng <code>id</code>, <code>name</code>, <code>role</code>, <code>email</code>, thiết bị và lượt đặt nào cũng có cùng các trường dù ở trạng thái nào, và một bộ lọc không khớp trả <code>{"data": []}</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Representation (bản biểu diễn)</span><span class="v">Hình dạng công khai của tài nguyên trong response, khác với cách nó được lưu.</span></div>
  <div class="kv"><span class="k">DTO / view / serializer</span><span class="v">Hàm hay lớp dựng bản biểu diễn từ bản ghi nội bộ.</span></div>
  <div class="kv"><span class="k">Allow-list (danh sách cho phép)</span><span class="v">Gọi tên những gì được đi ra; trường mới mặc định bị giấu (hỏng theo kiểu đóng cửa).</span></div>
  <div class="kv"><span class="k">Excessive data exposure (lộ dữ liệu quá mức)</span><span class="v">Gửi những trường client không cần — một phần của OWASP API3:2023.</span></div>
  <div class="kv"><span class="k">Envelope (phong bì)</span><span class="v">Object bọc quanh dữ liệu, ví dụ <code>{"data": [...]}</code> hay <code>{"success", "code", "data"}</code>.</span></div>
  <div class="kv"><span class="k">Additive change (thay đổi thêm vào)</span><span class="v">Thêm một trường mà client có thể bỏ qua — an toàn, khác với đổi tên hay đổi kiểu.</span></div>
  <div class="kv"><span class="k">null hay vắng mặt</span><span class="v">Hai cách nói "không có giá trị"; mỗi API chọn một và không bao giờ trộn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Response thành công cũng là hợp đồng: mỗi trường gửi đi là một trường sẽ có người phụ thuộc.</li>
  <li>Dựng mọi response qua một view gọi tên các trường được gửi — danh sách cho phép, hỏng theo kiểu đóng cửa.</li>
  <li>Giữ một hình dạng cho cả đời tài nguyên: trường tuỳ chọn có tài liệu luôn có mặt, rỗng thì <code>null</code>.</li>
  <li>Bọc danh sách trong <code>{"data": [...]}</code> để thêm được siêu dữ liệu như phân trang mà không làm vỡ client; danh sách rỗng là <code>[]</code>.</li>
  <li>Không bao giờ trả 200 cho thất bại, có envelope hay không: cache, cơ chế thử lại và giám sát đọc dòng trạng thái.</li>
  <li>Thụt lề JSON cho người đọc khi phát triển, gửi gọn khi chạy production.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-6-3-generic-types-classes" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Cùng cái vỏ đó, dưới dạng một kiểu generic — TypeScript 6.3: Interface, class generic &amp; kiểu mặc định</span><span class="lc-sub">Giống: mô hình “một giá trị hoặc một lỗi” một lần và dùng lại cho mọi tài nguyên — vỏ thành-công/thất-bại là một <code>Result&lt;T, E&gt;</code>. Khác: ở đây là dáng JSON gửi qua mạng kèm HTTP status; ở đó là một type alias generic của TypeScript với lỗi mặc định (<code>E = string</code>) mà trình biên dịch thu hẹp trên <code>ok</code>, dựng trọn ở Lab 6.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Errors for bilingual apps: Accept-Language, message catalogues, Vietnamese text|||2.4 — Lỗi cho ứng dụng song ngữ: Accept-Language, danh mục câu chữ, chữ tiếng Việt',
      slug: 'api-2-4-i18n',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lỗi mang mã + tham số, câu chữ vi/en dựng theo Accept-Language kèm Content-Language và Vary, Zod tiếng Việt, và chữ tiếng Việt cho đúng: chuẩn hoá NFC, tìm không dấu (đ/Đ), sắp xếp bằng collator.',
      content: `${G024}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Errors for bilingual apps, and Vietnamese text done right</h2>
<p class="lead">LabFlow’s users read Vietnamese, but the same API also serves an English mobile app, international exchange students and, one day, a partner’s developers. Error messages must reach each of them in their language — without changing a single thing that programs depend on. In this lesson you separate the two clearly, negotiate the language with <code>Accept-Language</code>, make Zod speak Vietnamese, and fix three traps that only appear with Vietnamese text: look-alike letters that are not equal, a letter that refuses to lose its accent, and sorting.</p>

<h3>What is translated, and what never is</h3>
<table>
  <thead><tr><th>Part of the answer</th><th>Translated?</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td><code>type</code>, <code>code</code></td><td><strong>never</strong></td><td>programs branch on them; a translated code is a new code</td></tr>
    <tr><td>member names, <code>pointer</code>, <code>parameter</code></td><td><strong>never</strong></td><td>they are part of the contract (<code>#/startAt</code> in every language)</td></tr>
    <tr><td>enum values (<code>PENDING</code>, <code>MAINTENANCE</code>)</td><td><strong>never</strong></td><td>the app maps them to its own labels</td></tr>
    <tr><td>numbers, dates, money</td><td><strong>never formatted</strong></td><td>the API sends ISO dates and integer amounts; the client formats for its locale</td></tr>
    <tr><td><code>title</code>, <code>detail</code>, field <code>detail</code>s</td><td><strong>yes</strong></td><td>they exist for humans</td></tr>
    <tr><td>user data (a lab called “Phòng Lab IoT”)</td><td>no — it is data</td><td>the API returns what was stored; translating content is a product feature, not error handling</td></tr>
  </tbody>
</table>
<p>This split is why lesson 2.1 kept <code>code</code> and <code>type</code> stable and why the client in 2.1 never read <code>title</code> except as a fallback.</p>

<h3>Two places to translate — LabFlow uses both</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Never translated</span><span class="lz-lnote">code, type, field names, enum values, ids — machines read these</span></div>
  <div class="lz-layer"><span class="lz-lname">Translated by the server</span><span class="lz-lnote">title and detail of a problem, by Accept-Language ⇒ Content-Language</span></div>
  <div class="lz-layer"><span class="lz-lname">Translated by the client</span><span class="lz-lnote">its own UI, keyed by code — the server’s text is a fallback</span></div>
</div>
<p><strong>In the client, from the code.</strong> A mobile or web app keeps its own text for every error code it knows (<code>BOOKING_CONFLICT</code> → “Phòng đã có người đặt”). The app’s wording matches the rest of its screens, works offline, and changes without a server release. This is the main path for LabFlow’s own apps.</p>
<p><strong>On the server, from <code>Accept-Language</code>.</strong> For everything that has no translation table — a third-party developer’s script, a command-line tool, a log line, an error code the app is too old to know — the server sends <code>title</code> and <code>detail</code> in the requested language. That is what we build now.</p>

<h3><code>Accept-Language</code> in three minutes</h3>
<p>The client lists the languages it prefers, optionally with a weight <code>q</code> from 0 to 1 (default 1). A browser set to English with Vietnamese as second choice sends:</p>
<pre><code class="language-http">Accept-Language: en-US,en;q=0.9,vi;q=0.8</code></pre>
<p>The server picks the best language it actually has and says which one it used in <code>Content-Language</code> (RFC 9110 §8.5). Because the same URL now has different bodies for different <code>Accept-Language</code> values, it must also send <code>Vary: Accept-Language</code> (§12.5.5) — otherwise a cache may hand An’s Vietnamese error to an English user. If nothing matches, LabFlow answers in its default language; <code>406 Not Acceptable</code> is allowed by HTTP but would turn a missing translation into a broken request.</p>
<p>Express already parses the header: <code>req.acceptsLanguages('vi', 'en')</code> returns the best match among the languages you offer, the first one when the header is absent, and <code>false</code> when none matches.</p>

<h3>Build it</h3>
<p><strong>1. Messages live in one catalogue.</strong> Each code has a fixed <code>title</code> and a <code>detail</code> function that receives the values of this occurrence. <code>src/messages.js</code>:</p>
<pre><code class="language-javascript">// messages.js — câu chữ cho NGƯỜI đọc, theo ngôn ngữ. Mã (code, type, tên trường, giá trị enum) KHÔNG bao giờ dịch.
// Mỗi mã: [title — cố định, detail — hàm nhận tham số của lần lỗi này]
export const MESSAGES = {
  vi: {
    VALIDATION_FAILED: ['Dữ liệu gửi lên không hợp lệ', (p) =&gt; &#96;\${p.count} lỗi trong body&#96;],
    INVALID_QUERY: ['Tham số truy vấn không hợp lệ', (p) =&gt; &#96;\${p.count} lỗi trong tham số truy vấn&#96;],
    MALFORMED_JSON: ['Body không phải JSON hợp lệ', () =&gt; 'Kiểm lại dấu phẩy, dấu nháy và ngoặc'],
    UNAUTHENTICATED: ['Cần đăng nhập', () =&gt; 'Thiếu hoặc sai token'],
    FORBIDDEN: ['Không đủ quyền', (p) =&gt; (p.role ? &#96;Chỉ \${p.role} được làm việc này&#96; : 'Bạn không phải chủ của tài nguyên này')],
    LAB_NOT_FOUND: ['Không tìm thấy phòng lab', (p) =&gt; &#96;Không có phòng lab \${p.id}&#96;],
    DEVICE_NOT_FOUND: ['Không tìm thấy thiết bị', (p) =&gt; &#96;Không có thiết bị \${p.id}&#96;],
    BOOKING_NOT_FOUND: ['Không tìm thấy lượt đặt', (p) =&gt; &#96;Không có lượt đặt \${p.id}&#96;],
    ISSUE_NOT_FOUND: ['Không tìm thấy báo hỏng', (p) =&gt; &#96;Không có báo hỏng \${p.id}&#96;],
    ROUTE_NOT_FOUND: ['Không có endpoint này', (p) =&gt; &#96;Không có \${p.method} \${p.path}&#96;],
    METHOD_NOT_ALLOWED: ['Phương thức không được hỗ trợ', (p) =&gt; &#96;\${p.method} không dùng được ở \${p.path}&#96;],
    BOOKING_CONFLICT: ['Trùng lịch phòng', (p) =&gt; &#96;Phòng đã có lượt \${p.other} trong khung giờ này&#96;],
    ALREADY_CANCELLED: ['Lượt đặt đã huỷ', (p) =&gt; &#96;Lượt \${p.id} đã huỷ rồi&#96;],
    ALREADY_RESOLVED: ['Báo hỏng đã xử lý', (p) =&gt; &#96;Báo hỏng \${p.id} đã xử lý rồi&#96;],
    DUPLICATE_SERIAL: ['Trùng số serial', (p) =&gt; &#96;Đã có thiết bị mang số serial \${p.serialNo}&#96;],
    LAB_RETIRED: ['Phòng lab đã ngừng sử dụng', (p) =&gt; &#96;Phòng lab \${p.id} đã ngừng sử dụng từ \${p.since}&#96;],
    PAYLOAD_TOO_LARGE: ['Body quá lớn', (p) =&gt; &#96;Body tối đa \${p.limit} byte, nhận \${p.length} byte&#96;],
    UNSUPPORTED_MEDIA_TYPE: ['Kiểu nội dung không được hỗ trợ', (p) =&gt; &#96;Chỉ nhận JSON, nhận \${p.got}&#96;],
    INVALID_TIME_RANGE: ['Khoảng thời gian không hợp lệ', () =&gt; 'endAt phải sau startAt'],
    UNKNOWN_LAB: ['Phòng lab không tồn tại', (p) =&gt; &#96;labId \${p.id} không tồn tại hoặc đã ngừng dùng&#96;],
    INTERNAL: ['Lỗi máy chủ', () =&gt; 'Máy chủ gặp lỗi, thử lại sau'],
  },
  en: {
    VALIDATION_FAILED: ['Invalid request body', (p) =&gt; &#96;\${p.count} problem(s) in the body&#96;],
    INVALID_QUERY: ['Invalid query parameters', (p) =&gt; &#96;\${p.count} problem(s) in the query&#96;],
    MALFORMED_JSON: ['Body is not valid JSON', () =&gt; 'Check commas, quotes and brackets'],
    UNAUTHENTICATED: ['Authentication required', () =&gt; 'Missing or invalid token'],
    FORBIDDEN: ['Forbidden', (p) =&gt; (p.role ? &#96;Only \${p.role} may do this&#96; : 'You do not own this resource')],
    LAB_NOT_FOUND: ['Lab not found', (p) =&gt; &#96;There is no lab \${p.id}&#96;],
    DEVICE_NOT_FOUND: ['Device not found', (p) =&gt; &#96;There is no device \${p.id}&#96;],
    BOOKING_NOT_FOUND: ['Booking not found', (p) =&gt; &#96;There is no booking \${p.id}&#96;],
    ISSUE_NOT_FOUND: ['Issue not found', (p) =&gt; &#96;There is no issue \${p.id}&#96;],
    ROUTE_NOT_FOUND: ['No such endpoint', (p) =&gt; &#96;There is no \${p.method} \${p.path}&#96;],
    METHOD_NOT_ALLOWED: ['Method not allowed', (p) =&gt; &#96;\${p.method} is not supported on \${p.path}&#96;],
    BOOKING_CONFLICT: ['Booking conflict', (p) =&gt; &#96;The lab already has booking \${p.other} in this time slot&#96;],
    ALREADY_CANCELLED: ['Booking already cancelled', (p) =&gt; &#96;Booking \${p.id} is already cancelled&#96;],
    ALREADY_RESOLVED: ['Issue already resolved', (p) =&gt; &#96;Issue \${p.id} is already resolved&#96;],
    DUPLICATE_SERIAL: ['Duplicate serial number', (p) =&gt; &#96;A device with serial number \${p.serialNo} already exists&#96;],
    LAB_RETIRED: ['Lab retired', (p) =&gt; &#96;Lab \${p.id} has been out of use since \${p.since}&#96;],
    PAYLOAD_TOO_LARGE: ['Body too large', (p) =&gt; &#96;The body may be at most \${p.limit} bytes, got \${p.length}&#96;],
    UNSUPPORTED_MEDIA_TYPE: ['Unsupported media type', (p) =&gt; &#96;Only JSON is accepted, got \${p.got}&#96;],
    INVALID_TIME_RANGE: ['Invalid time range', () =&gt; 'endAt must be after startAt'],
    UNKNOWN_LAB: ['Unknown lab', (p) =&gt; &#96;labId \${p.id} does not exist or is retired&#96;],
    INTERNAL: ['Internal server error', () =&gt; 'Something went wrong on our side, try again later'],
  },
};</code></pre>
<p><strong>2. Choosing the language</strong> is one line; Zod 4 ships ready-made locales, Vietnamese included. <code>src/i18n.js</code>:</p>
<pre><code class="language-javascript">// i18n.js — chọn ngôn ngữ theo header Accept-Language (RFC 9110 §12.5.4)
import { z } from 'zod';
import { MESSAGES } from './messages.js';

export const SUPPORTED = ['vi', 'en'];
export const DEFAULT_LANG = 'vi';

// 'en-US,en;q=0.9,vi;q=0.8' ⇒ 'en'; không gửi header ⇒ 'vi' (cái đầu danh sách); 'fr' ⇒ false ⇒ mặc định 'vi'
export const pickLang = (req) =&gt; req.acceptsLanguages(...SUPPORTED) || DEFAULT_LANG;

export function texts(lang, code, params = {}) {
  const [title, detail] = MESSAGES[lang][code] ?? MESSAGES[lang].INTERNAL;
  return { title, detail: detail(params) };
}

// Thông báo lỗi của Zod theo đúng ngôn ngữ của request (Zod 4 có sẵn bộ tiếng Việt)
export const zodLocale = (lang) =&gt; z.locales[lang]().localeError;
export const UNKNOWN_FIELD = { vi: 'trường không được hỗ trợ', en: 'unknown field' };</code></pre>
<p><strong>3. Errors carry a code and parameters, never finished sentences.</strong> A sentence built inside a route is fixed to one language; parameters can be put into any. <code>src/http.js</code> changes its constructor:</p>
<pre><code class="language-javascript">// http.js — lỗi chỉ mang MÃ + THAM SỐ; câu chữ (vi/en) được dựng ở problems.js lúc trả lời
export class HttpError extends Error {
  constructor(status, code, params = {}, more) {
    super(code);
    this.status = status;   // mã HTTP: 400, 404, 409…
    this.code = code;       // mã máy đọc: 'BOOKING_CONFLICT'
    this.params = params;   // dữ liệu của lần lỗi này: { id: 'lab_9' }
    this.more = more;       // tuỳ chọn: mảng lỗi từng trường, HOẶC object thành viên mở rộng
  }
}

// Route có thật nhưng sai phương thức ⇒ 405 + header Allow
export const onlyAllow = (...methods) =&gt; (req, res) =&gt; {
  res.set('Allow', methods.join(', '));
  if (req.method === 'OPTIONS') return res.status(204).end();
  throw new HttpError(405, 'METHOD_NOT_ALLOWED', { method: req.method, path: req.baseUrl + req.path });
};</code></pre>
<p>and every <code>throw</code> changes the same way — before and after:</p>
<pre><code class="language-javascript">// trước (2.3): câu tiếng Việt cố định ngay trong route
throw new HttpError(404, 'LAB_NOT_FOUND', &#96;Không có phòng lab \${labId}&#96;);
// sau (2.4): chỉ mã + tham số; problems.js dựng câu theo ngôn ngữ người gọi
throw new HttpError(404, 'LAB_NOT_FOUND', { id: labId });
throw new HttpError(410, 'LAB_RETIRED', { id: labId, since: lab.retiredAt });
throw new HttpError(409, 'BOOKING_CONFLICT', { other: clash.id }, { conflictWith: clash.id });</code></pre>
<p>Twenty-one <code>throw</code>s change across the project (<code>auth.js</code>, <code>app.js</code>, <code>http.js</code>, <code>validate.js</code> and the four routers); the error handler passes <code>err.code</code>, <code>err.params</code> and <code>err.more</code> to <code>sendProblem</code>. That was mechanical work only because lesson 2.1 put every error through one function.</p>
<p><strong>4. <code>sendProblem</code> picks the language and announces it.</strong> <code>src/problems.js</code>, final version:</p>
<pre><code class="language-javascript">// problems.js — RFC 9457 Problem Details: MỘT chỗ quyết định một lỗi trông thế nào
import { pickLang, texts } from './i18n.js';

export const PROBLEM_BASE = 'https://labflow.example/problems/';

// 'BOOKING_CONFLICT' ⇒ 'https://labflow.example/problems/booking-conflict'
export const typeOf = (code) =&gt; PROBLEM_BASE + code.toLowerCase().replaceAll('_', '-');

export function sendProblem(req, res, { status, code, params, ...extra }) {
  const lang = pickLang(req);
  const { title, detail } = texts(lang, code, params);    // câu chữ dựng Ở ĐÂY, theo ngôn ngữ người gọi
  res.status(status)
    .set('Content-Language', lang)                        // body này viết bằng ngôn ngữ nào
    .vary('Accept-Language')                              // cache: cùng URL, khác ngôn ngữ ⇒ khác body
    .type('application/problem+json')
    .json({ type: typeOf(code), title, status, detail, instance: req.originalUrl, code, ...extra });
}</code></pre>
<p><strong>5. Validation messages follow the request language</strong> — Zod accepts an error map per call. In <code>src/validate.js</code>:</p>
<pre><code class="language-javascript">export const validate = (where, schema) =&gt; (req, res, next) =&gt; {
  const lang = pickLang(req);
  const r = schema.safeParse(req[where] ?? {}, { error: zodLocale(lang) });
  if (!r.success) {
    const errors = toErrors(r.error.issues, where, lang);
    throw new HttpError(400, where === 'query' ? 'INVALID_QUERY' : 'VALIDATION_FAILED', { count: errors.length }, errors);
  }
  req.valid = { ...req.valid, [where]: r.data };   // Express 5: req.query chỉ đọc, không gán lại được
  next();
};</code></pre>

<h3>Try it: one error, several languages</h3>
<p>No header — the default, Vietnamese:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
ETag: W/"de-n7A1XrnCUccoJT3bD1Syj4y0bkQ"
Date: Sat, 31 Oct 2026 17:44:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Không tìm thấy phòng lab",
  "status": 404,
  "detail": "Không có phòng lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>
<p>English:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_9 -H 'Accept-Language: en'</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Language: en
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 200
ETag: W/"c8-fR0t4DMybAWtqwAJqAU97G8yy34"
Date: Sat, 31 Oct 2026 17:44:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Lab not found",
  "status": 404,
  "detail": "There is no lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>
<p>Same <code>type</code>, same <code>code</code>, same <code>instance</code>; only the human text and <code>Content-Language</code> differ — and <code>Content-Length</code>, because Vietnamese letters take more bytes in UTF-8. A real browser header picks English, a language we do not have falls back to the default, and the weights are respected even when the order says otherwise:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/labs/lab_9 -H 'Accept-Language: en-US,en;q=0.9,vi;q=0.8'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Lab not found",
  "status": 404,
  "detail": "There is no lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/labs/lab_9 -H 'Accept-Language: fr'</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
ETag: W/"de-n7A1XrnCUccoJT3bD1Syj4y0bkQ"
Date: Sat, 31 Oct 2026 17:44:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5</div>
<pre><code class="language-bash">curl -s http://localhost:4000/labs/lab_9 -H 'Accept-Language: vi;q=0.4, en;q=0.6'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Lab not found",
  "status": 404,
  "detail": "There is no lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>

<h3>Zod in two languages — and a trap we wrote ourselves</h3>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab-1","startAt":"mai 8h","note":"x"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Invalid request body",
  "status": 400,
  "detail": "4 problem(s) in the body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/labId",
      "detail": "must look like lab_1"
    },
    {
      "pointer": "#/startAt",
      "detail": "Invalid ISO datetime"
    },
    {
      "pointer": "#/endAt",
      "detail": "Invalid input: expected string, received undefined"
    },
    {
      "pointer": "#/note",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab-1","startAt":"mai 8h","note":"x"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "4 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/labId",
      "detail": "must look like lab_1"
    },
    {
      "pointer": "#/startAt",
      "detail": "ngày giờ ISO không hợp lệ"
    },
    {
      "pointer": "#/endAt",
      "detail": "Đầu vào không hợp lệ: mong đợi string, nhận được undefined"
    },
    {
      "pointer": "#/note",
      "detail": "trường không được hỗ trợ"
    }
  ]
}</div>
<p>The Vietnamese answer is mostly Vietnamese — except the first line, <code>must look like lab_1</code>. That message came from our own schema in lesson 2.2 (<code>.regex(…, &#96;must look like \${prefix}_1&#96;)</code>). A custom message is used <em>as is</em>; it bypasses the locale. Either translate custom messages yourself or let the library write them. LabFlow removes the two custom messages from <code>schemas.js</code>:</p>
<pre><code class="language-javascript">// KHÔNG viết câu báo lỗi riêng: câu tự viết không được dịch — để Zod dùng câu theo ngôn ngữ của request
const id = (prefix) =&gt; z.string().regex(new RegExp(&#96;^\${prefix}_\\\\d+$&#96;));
// …
  serialNo: z.string().regex(/^[A-Z0-9-]{6,20}$/),</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab-1","startAt":"mai 8h","note":"x"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "4 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/labId",
      "detail": "Chuỗi không hợp lệ: phải khớp với mẫu /^lab_\\\\d+$/"
    },
    {
      "pointer": "#/startAt",
      "detail": "ngày giờ ISO không hợp lệ"
    },
    {
      "pointer": "#/endAt",
      "detail": "Đầu vào không hợp lệ: mong đợi string, nhận được undefined"
    },
    {
      "pointer": "#/note",
      "detail": "trường không được hỗ trợ"
    }
  ]
}</div>
<p>The library’s Vietnamese is not perfect (“mong đợi string”), but it is consistent and costs nothing. For the few messages users really see, the client should map the <code>pointer</code> to its own wording anyway.</p>
<p>Successful responses do not change with the language: there is no human text in them to translate, only data.</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_1 -H 'Accept-Language: en'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 122
ETag: W/"7a-uvX+0yMOfNePX7T77wYjzSxsZuw"
Date: Sat, 31 Oct 2026 17:44:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "lab_1",
  "code": "AL-201",
  "name": "Phòng Lab Mạng máy tính",
  "building": "Alpha",
  "capacity": 30
}</div>

<h3>Vietnamese text: two strings that look the same</h3>
<p>“ò” can be stored in two ways in Unicode: as <strong>one</strong> character (U+00F2, the <strong>NFC</strong> form, what most keyboards produce) or as <strong>two</strong> — “o” followed by a combining grave accent (U+0300, the <strong>NFD</strong> form, common in text copied from PDFs and in file names on macOS). They look identical on screen. Measured in Node 22:</p>
<pre><code class="language-javascript">// unicode.mjs — tiếng Việt trong API: đo thật, đừng đoán
const nfc = 'Phòng';                       // gõ bằng bộ gõ thường gặp: "ò" là MỘT ký tự (U+00F2)
const nfd = 'Phòng';                 // dán từ PDF / tên tệp macOS: "o" + dấu huyền rời (U+0300)
console.log('hiện ra:', nfc, nfd);
console.log('length:', nfc.length, nfd.length);
console.log('bằng nhau?', nfc === nfd, '| sau NFC:', nfc === nfd.normalize('NFC'));
console.log('tìm "Phòng" trong tên:', 'Phòng Lab IoT'.includes(nfd), '| sau NFC:', 'Phòng Lab IoT'.includes(nfd.normalize('NFC')));
console.log('byte UTF-8:', Buffer.byteLength(nfc), Buffer.byteLength(nfd));
console.log('Đ tách dấu được không?', 'Đ'.normalize('NFD').length === 1 ? 'không — Đ là chữ riêng' : 'có');
const ten = ['Bình', 'An', 'Đức', 'Dũng', 'Yến', 'Ánh'];
console.log('sort():          ', [...ten].sort().join(', '));
console.log('Intl.Collator vi:', [...ten].sort(new Intl.Collator('vi').compare).join(', '));
const t = new Date('2026-11-02T01:00:00.000Z');
console.log('vi-VN:', new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(t));
console.log('en-US:', new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(t));
console.log('tiền:', new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1250000),
  '|', new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(1250000));</code></pre>
<pre><code class="language-bash">node unicode.mjs</code></pre>
<div class="out">hiện ra: Phòng Phòng
length: 5 6
bằng nhau? false | sau NFC: true
tìm "Phòng" trong tên: false | sau NFC: true
byte UTF-8: 6 7
Đ tách dấu được không? không — Đ là chữ riêng
sort():           An, Bình, Dũng, Yến, Ánh, Đức
Intl.Collator vi: An, Ánh, Bình, Dũng, Đức, Yến
vi-VN: lúc 08:00 Thứ Hai, 2 tháng 11, 2026
en-US: Monday, November 2, 2026 at 8:00 AM
tiền: 1.250.000 ₫ | ₫1,250,000</div>
<p>Read the first four lines slowly: the two words print the same, have different lengths, are not equal, and a search for one does not find the other — until both are normalised. A student who pastes “Phòng” from the lab’s PDF timetable into LabFlow’s search would find nothing, and a uniqueness check (“two open issues with the same title”, Lab 2) would let duplicates through.</p>
<p><strong>The rule: normalise every human-typed string to NFC at the edge.</strong> Zod has it built in, so the <code>text()</code> helper in <code>schemas.js</code> does it for every field:</p>
<pre><code class="language-javascript">// Chữ người gõ: bỏ khoảng trắng hai đầu + chuẩn hoá Unicode về NFC ("ò" luôn là MỘT ký tự)
const text = (min, max) =&gt; z.string().trim().normalize('NFC').min(min).max(max);
// …
  purpose: text(1, 200).optional(),
  name: text(1, 100),
  note: text(0, 500).nullable().optional(),</code></pre>
<p>Proof — the purpose below is sent in NFD (it looks normal on your screen); the API stores 9 characters, the NFC length of “Phòng lab”:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"Phòng lab"}' | node -e "let s='';process.stdin.on('data',d=&gt;s+=d).on('end',()=&gt;{const p=JSON.parse(s).purpose;console.log(p, p.length, p===p.normalize('NFC'))})"</code></pre>
<div class="out">Phòng lab 9 true</div>
<p><strong>Searching like a human.</strong> Users type without accents (“phong lab mang”) or with them. LabFlow’s new <code>q</code> parameter compares <em>folded</em> text: decompose, remove the accent marks, lower-case. The line above already showed the trap — <code>Đ</code> has no decomposition, it is a separate letter, so it must be replaced by hand. In <code>src/routes/labs.js</code>:</p>
<pre><code class="language-javascript">// "Phòng Lab IoT" ⇒ "phong lab iot": tách dấu (NFD), bỏ dấu, đ ⇒ d (Đ/đ KHÔNG tách được bằng NFD), chữ thường
const fold = (s) =&gt; s.normalize('NFD').replace(/\\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
// …
    if (q) data = data.filter((l) =&gt; fold(l.name).includes(fold(q)));</code></pre>
<p>(<code>\\p{M}</code> is “any combining mark”; <code>LabsQuery</code> gains <code>q: text(1, 50).optional()</code>.) Both a no-accent query and an NFD-encoded one find the right lab:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?q=phong%20lab%20mang'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "lab_1",
      "code": "AL-201",
      "name": "Phòng Lab Mạng máy tính",
      "building": "Alpha",
      "capacity": 30
    }
  ]
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?q=Pho%CC%80ng%20Lab%20IoT'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "lab_2",
      "code": "AL-305",
      "name": "Phòng Lab IoT",
      "building": "Alpha",
      "capacity": 24
    }
  ]
}</div>
<p><strong>Sorting and formatting are locale work.</strong> The <code>sort()</code> line above put “Ánh” and “Đức” after “Yến”, because it compares code points; <code>Intl.Collator('vi')</code> sorts like a Vietnamese dictionary. And the same instant prints as “lúc 08:00 Thứ Hai, 2 tháng 11, 2026” or “Monday, November 2, 2026 at 8:00 AM”; the same amount as “1.250.000 ₫” or “₫1,250,000”. That is exactly why the API sends <code>2026-11-02T01:00:00.000Z</code> and integers: one unambiguous value, formatted by each client for its user. (Databases sort with a <em>collation</em> too — Chapter 12.)</p>

<div class="pitfall"><p><strong>Trap — translating codes.</strong> <code>"code": "TRÙNG_LỊCH"</code> for Vietnamese users and <code>"BOOKING_CONFLICT"</code> for English ones means every client needs both. Codes, types, enum values and member names are identifiers; only text for humans is translated.</p></div>
<div class="pitfall"><p><strong>Trap — forgetting <code>Vary</code>.</strong> Without <code>Vary: Accept-Language</code> a shared cache (a CDN, a company proxy) may store the first answer it sees and serve it to everyone. The bug looks random: “sometimes the errors are in English”.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“How do you localise API errors?”</strong> Stable machine codes that clients translate themselves, plus server-side <code>title</code>/<code>detail</code> chosen by <code>Accept-Language</code> for clients that have no table. The response says <code>Content-Language</code> and <code>Vary: Accept-Language</code>. Codes, field names and enum values are never translated.</p>
<p><strong>“A search for a Vietnamese name sometimes finds nothing. Why?”</strong> Unicode normalisation: the stored text and the query are in different forms (NFC vs NFD). Normalise to NFC on input; for accent-insensitive search, fold both sides — and handle đ/Đ separately.</p>
<p><strong>“Should the API format dates for the user?”</strong> No: send ISO 8601 in UTC and let the client format with the user’s locale and time zone (<code>Intl.DateTimeFormat</code>).</p>

<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: MDN — Accept-Language — read 1 Nov 2026</span><span class="lc-sub">Quality values (q, default 1) rank the languages; the header is only a hint — never override an explicit user choice, report the chosen language in Content-Language.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.unicode.org/reports/tr15/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Unicode UAX #15 — Normalization Forms (rev. 58, Aug 2026) — read 1 Nov 2026</span><span class="lc-sub">NFC = canonical decomposition followed by canonical composition: two spellings of the same letter become one sequence — why LabFlow normalises Vietnamese text.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Refactor your <code>throw</code>s to code + parameters, add <code>messages.js</code> and <code>i18n.js</code>, and reproduce the outputs above.</li>
  <li>Add Japanese for <code>LAB_NOT_FOUND</code> only (the JPD students asked): what happens for every other code when the request says <code>Accept-Language: ja</code>? Decide the rule — fall back per message, or keep the whole response in one language? Write it down and implement it.</li>
  <li>Run <code>node unicode.mjs</code>. Then add a lab named “Phòng Điện tử” to <code>db.js</code> and find it with <code>?q=dien%20tu</code> — it only works because <code>fold</code> handles đ.</li>
  <li>Check every problem response has <code>Content-Language</code> and <code>Vary: Accept-Language</code> with <code>curl -s -D - -o /dev/null</code>.</li>
</ol>
<p><strong>Done when:</strong> the same request gives the same <code>type</code>, <code>code</code> and <code>errors[].pointer</code> in Vietnamese and English with only human text changed, unknown languages fall back to Vietnamese, every text input is stored in NFC, and accent-free search finds “Phòng Lab Mạng máy tính”.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Localisation (l10n)</span><span class="v">Presenting text and formats in the user’s language and conventions.</span></div>
  <div class="kv"><span class="k">Accept-Language</span><span class="v">Request header listing preferred languages with optional weights <code>q</code>.</span></div>
  <div class="kv"><span class="k">Content-Language</span><span class="v">Response header saying which language the body is written in.</span></div>
  <div class="kv"><span class="k">Vary</span><span class="v">Tells caches which request headers change the response.</span></div>
  <div class="kv"><span class="k">Message catalogue</span><span class="v">One table of human texts per language, keyed by code.</span></div>
  <div class="kv"><span class="k">Unicode normalisation (NFC / NFD)</span><span class="v">Composed vs decomposed forms of the same letters; normalise to NFC before comparing or storing.</span></div>
  <div class="kv"><span class="k">Collation</span><span class="v">Language-aware sorting rules, e.g. <code>Intl.Collator('vi')</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Translate only text for humans — <code>title</code>, <code>detail</code>; codes, types, member names and enum values never change.</li>
  <li>Apps translate from the code; the server adds localised text chosen by <code>Accept-Language</code> for everyone else.</li>
  <li>Answer with <code>Content-Language</code> and <code>Vary: Accept-Language</code>; unknown languages fall back to the default.</li>
  <li>Errors carry a code and parameters; sentences are built at the edge, in one catalogue.</li>
  <li>Normalise Vietnamese input to NFC; fold accents (and đ/Đ by hand) for search; sort with a Vietnamese collator.</li>
  <li>Send ISO dates and integer amounts; formatting for a locale is the client’s job.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-7-4-template-literal-types" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Message keys that cannot be mistyped — TS 7.4: Template literal types</span><span class="lc-sub">Same: a closed set of message keys, one value for each, so a missing or misspelled key is caught, not shipped. Different: TypeScript builds the key type from two unions in a template literal (<code>&#96;&#36;{Resource}:&#36;{Field}&#96;</code>) and a <code>Record</code> over it forces a value for every combination — a typo is refused at compile time as TS2820, with a suggestion.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Lỗi cho ứng dụng song ngữ, và xử lý chữ tiếng Việt cho đúng</h2>
<p class="lead">Người dùng LabFlow đọc tiếng Việt, nhưng cùng một API còn phục vụ một app di động tiếng Anh, sinh viên trao đổi quốc tế và, một ngày nào đó, lập trình viên của đối tác. Thông báo lỗi phải tới tay từng người bằng ngôn ngữ của họ — mà không đổi một thứ gì chương trình đang dựa vào. Trong bài này bạn tách bạch hai thứ đó, thương lượng ngôn ngữ bằng <code>Accept-Language</code>, cho Zod nói tiếng Việt, và sửa ba cái bẫy chỉ xuất hiện với chữ tiếng Việt: những chữ trông giống nhau mà không bằng nhau, một chữ cái nhất định không chịu mất dấu, và chuyện sắp xếp.</p>

<h3>Cái gì được dịch, cái gì không bao giờ</h3>
<table>
  <thead><tr><th>Phần của câu trả lời</th><th>Có dịch?</th><th>Vì sao</th></tr></thead>
  <tbody>
    <tr><td><code>type</code>, <code>code</code></td><td><strong>không bao giờ</strong></td><td>chương trình rẽ nhánh theo chúng; dịch một mã là đẻ ra mã mới</td></tr>
    <tr><td>tên trường, <code>pointer</code>, <code>parameter</code></td><td><strong>không bao giờ</strong></td><td>chúng là một phần hợp đồng (<code>#/startAt</code> ở mọi ngôn ngữ)</td></tr>
    <tr><td>giá trị enum (<code>PENDING</code>, <code>MAINTENANCE</code>)</td><td><strong>không bao giờ</strong></td><td>app tự ánh xạ sang nhãn của nó</td></tr>
    <tr><td>số, ngày giờ, tiền</td><td><strong>không định dạng</strong></td><td>API gửi ngày ISO và số tiền nguyên; client định dạng theo locale (thiết lập vùng) của nó</td></tr>
    <tr><td><code>title</code>, <code>detail</code>, các <code>detail</code> của từng trường</td><td><strong>có</strong></td><td>chúng sinh ra để người đọc</td></tr>
    <tr><td>dữ liệu người dùng (phòng tên "Phòng Lab IoT")</td><td>không — đó là dữ liệu</td><td>API trả đúng thứ đã lưu; dịch nội dung là một tính năng sản phẩm, không phải chuyện xử lý lỗi</td></tr>
  </tbody>
</table>
<p>Chính sự tách bạch này là lý do bài 2.1 giữ <code>code</code> và <code>type</code> ổn định, và client ở bài 2.1 không bao giờ đọc <code>title</code> trừ khi để dự phòng.</p>

<h3>Hai nơi để dịch — LabFlow dùng cả hai</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Không bao giờ dịch</span><span class="lz-lnote">code, type, tên trường, giá trị enum, id — máy đọc những thứ này</span></div>
  <div class="lz-layer"><span class="lz-lname">Server dịch</span><span class="lz-lnote">title và detail của lỗi, theo Accept-Language ⇒ Content-Language</span></div>
  <div class="lz-layer"><span class="lz-lname">Client dịch</span><span class="lz-lnote">giao diện của nó, theo code — câu của server chỉ là dự phòng</span></div>
</div>
<p><strong>Ở client, dựa vào mã.</strong> App di động hay web giữ câu chữ riêng cho từng mã lỗi nó biết (<code>BOOKING_CONFLICT</code> → "Phòng đã có người đặt"). Câu chữ của app khớp với các màn hình khác, chạy được khi mất mạng, và đổi được mà không cần phát hành server. Đây là đường chính cho các app của chính LabFlow.</p>
<p><strong>Ở server, dựa vào <code>Accept-Language</code>.</strong> Với mọi thứ không có bảng dịch — script của lập trình viên bên thứ ba, công cụ dòng lệnh, một dòng log, một mã lỗi mà app quá cũ chưa biết — server gửi <code>title</code> và <code>detail</code> bằng ngôn ngữ được yêu cầu. Đó là thứ ta dựng bây giờ.</p>

<h3><code>Accept-Language</code> trong ba phút</h3>
<p>Client liệt kê các ngôn ngữ nó thích, có thể kèm trọng số <code>q</code> từ 0 tới 1 (mặc định 1). Một trình duyệt đặt tiếng Anh, tiếng Việt là lựa chọn thứ hai, sẽ gửi:</p>
<pre><code class="language-http">Accept-Language: en-US,en;q=0.9,vi;q=0.8</code></pre>
<p>Server chọn ngôn ngữ tốt nhất mà nó thật sự có, và nói rõ đã dùng ngôn ngữ nào trong <code>Content-Language</code> (RFC 9110 §8.5). Vì cùng một URL giờ có body khác nhau tuỳ giá trị <code>Accept-Language</code>, nó còn phải gửi <code>Vary: Accept-Language</code> (§12.5.5) — nếu không, một bộ cache có thể đưa lỗi tiếng Việt của An cho người dùng tiếng Anh. Nếu không khớp ngôn ngữ nào, LabFlow trả bằng ngôn ngữ mặc định; HTTP cho phép trả <code>406 Not Acceptable</code>, nhưng làm vậy là biến việc thiếu một bản dịch thành một request hỏng.</p>
<p>Express phân tích sẵn header này: <code>req.acceptsLanguages('vi', 'en')</code> trả về ngôn ngữ khớp nhất trong số bạn cung cấp, trả cái đầu tiên khi không có header, và trả <code>false</code> khi không khớp cái nào.</p>

<h3>Dựng</h3>
<p><strong>1. Câu chữ sống trong một cuốn danh mục.</strong> Mỗi mã có một <code>title</code> cố định và một hàm <code>detail</code> nhận các giá trị của lần xảy ra này. <code>src/messages.js</code>:</p>
<pre><code class="language-javascript">// messages.js — câu chữ cho NGƯỜI đọc, theo ngôn ngữ. Mã (code, type, tên trường, giá trị enum) KHÔNG bao giờ dịch.
// Mỗi mã: [title — cố định, detail — hàm nhận tham số của lần lỗi này]
export const MESSAGES = {
  vi: {
    VALIDATION_FAILED: ['Dữ liệu gửi lên không hợp lệ', (p) =&gt; &#96;\${p.count} lỗi trong body&#96;],
    INVALID_QUERY: ['Tham số truy vấn không hợp lệ', (p) =&gt; &#96;\${p.count} lỗi trong tham số truy vấn&#96;],
    MALFORMED_JSON: ['Body không phải JSON hợp lệ', () =&gt; 'Kiểm lại dấu phẩy, dấu nháy và ngoặc'],
    UNAUTHENTICATED: ['Cần đăng nhập', () =&gt; 'Thiếu hoặc sai token'],
    FORBIDDEN: ['Không đủ quyền', (p) =&gt; (p.role ? &#96;Chỉ \${p.role} được làm việc này&#96; : 'Bạn không phải chủ của tài nguyên này')],
    LAB_NOT_FOUND: ['Không tìm thấy phòng lab', (p) =&gt; &#96;Không có phòng lab \${p.id}&#96;],
    DEVICE_NOT_FOUND: ['Không tìm thấy thiết bị', (p) =&gt; &#96;Không có thiết bị \${p.id}&#96;],
    BOOKING_NOT_FOUND: ['Không tìm thấy lượt đặt', (p) =&gt; &#96;Không có lượt đặt \${p.id}&#96;],
    ISSUE_NOT_FOUND: ['Không tìm thấy báo hỏng', (p) =&gt; &#96;Không có báo hỏng \${p.id}&#96;],
    ROUTE_NOT_FOUND: ['Không có endpoint này', (p) =&gt; &#96;Không có \${p.method} \${p.path}&#96;],
    METHOD_NOT_ALLOWED: ['Phương thức không được hỗ trợ', (p) =&gt; &#96;\${p.method} không dùng được ở \${p.path}&#96;],
    BOOKING_CONFLICT: ['Trùng lịch phòng', (p) =&gt; &#96;Phòng đã có lượt \${p.other} trong khung giờ này&#96;],
    ALREADY_CANCELLED: ['Lượt đặt đã huỷ', (p) =&gt; &#96;Lượt \${p.id} đã huỷ rồi&#96;],
    ALREADY_RESOLVED: ['Báo hỏng đã xử lý', (p) =&gt; &#96;Báo hỏng \${p.id} đã xử lý rồi&#96;],
    DUPLICATE_SERIAL: ['Trùng số serial', (p) =&gt; &#96;Đã có thiết bị mang số serial \${p.serialNo}&#96;],
    LAB_RETIRED: ['Phòng lab đã ngừng sử dụng', (p) =&gt; &#96;Phòng lab \${p.id} đã ngừng sử dụng từ \${p.since}&#96;],
    PAYLOAD_TOO_LARGE: ['Body quá lớn', (p) =&gt; &#96;Body tối đa \${p.limit} byte, nhận \${p.length} byte&#96;],
    UNSUPPORTED_MEDIA_TYPE: ['Kiểu nội dung không được hỗ trợ', (p) =&gt; &#96;Chỉ nhận JSON, nhận \${p.got}&#96;],
    INVALID_TIME_RANGE: ['Khoảng thời gian không hợp lệ', () =&gt; 'endAt phải sau startAt'],
    UNKNOWN_LAB: ['Phòng lab không tồn tại', (p) =&gt; &#96;labId \${p.id} không tồn tại hoặc đã ngừng dùng&#96;],
    INTERNAL: ['Lỗi máy chủ', () =&gt; 'Máy chủ gặp lỗi, thử lại sau'],
  },
  en: {
    VALIDATION_FAILED: ['Invalid request body', (p) =&gt; &#96;\${p.count} problem(s) in the body&#96;],
    INVALID_QUERY: ['Invalid query parameters', (p) =&gt; &#96;\${p.count} problem(s) in the query&#96;],
    MALFORMED_JSON: ['Body is not valid JSON', () =&gt; 'Check commas, quotes and brackets'],
    UNAUTHENTICATED: ['Authentication required', () =&gt; 'Missing or invalid token'],
    FORBIDDEN: ['Forbidden', (p) =&gt; (p.role ? &#96;Only \${p.role} may do this&#96; : 'You do not own this resource')],
    LAB_NOT_FOUND: ['Lab not found', (p) =&gt; &#96;There is no lab \${p.id}&#96;],
    DEVICE_NOT_FOUND: ['Device not found', (p) =&gt; &#96;There is no device \${p.id}&#96;],
    BOOKING_NOT_FOUND: ['Booking not found', (p) =&gt; &#96;There is no booking \${p.id}&#96;],
    ISSUE_NOT_FOUND: ['Issue not found', (p) =&gt; &#96;There is no issue \${p.id}&#96;],
    ROUTE_NOT_FOUND: ['No such endpoint', (p) =&gt; &#96;There is no \${p.method} \${p.path}&#96;],
    METHOD_NOT_ALLOWED: ['Method not allowed', (p) =&gt; &#96;\${p.method} is not supported on \${p.path}&#96;],
    BOOKING_CONFLICT: ['Booking conflict', (p) =&gt; &#96;The lab already has booking \${p.other} in this time slot&#96;],
    ALREADY_CANCELLED: ['Booking already cancelled', (p) =&gt; &#96;Booking \${p.id} is already cancelled&#96;],
    ALREADY_RESOLVED: ['Issue already resolved', (p) =&gt; &#96;Issue \${p.id} is already resolved&#96;],
    DUPLICATE_SERIAL: ['Duplicate serial number', (p) =&gt; &#96;A device with serial number \${p.serialNo} already exists&#96;],
    LAB_RETIRED: ['Lab retired', (p) =&gt; &#96;Lab \${p.id} has been out of use since \${p.since}&#96;],
    PAYLOAD_TOO_LARGE: ['Body too large', (p) =&gt; &#96;The body may be at most \${p.limit} bytes, got \${p.length}&#96;],
    UNSUPPORTED_MEDIA_TYPE: ['Unsupported media type', (p) =&gt; &#96;Only JSON is accepted, got \${p.got}&#96;],
    INVALID_TIME_RANGE: ['Invalid time range', () =&gt; 'endAt must be after startAt'],
    UNKNOWN_LAB: ['Unknown lab', (p) =&gt; &#96;labId \${p.id} does not exist or is retired&#96;],
    INTERNAL: ['Internal server error', () =&gt; 'Something went wrong on our side, try again later'],
  },
};</code></pre>
<p><strong>2. Chọn ngôn ngữ</strong> chỉ một dòng; Zod 4 có sẵn bộ câu cho nhiều ngôn ngữ, có cả tiếng Việt. <code>src/i18n.js</code>:</p>
<pre><code class="language-javascript">// i18n.js — chọn ngôn ngữ theo header Accept-Language (RFC 9110 §12.5.4)
import { z } from 'zod';
import { MESSAGES } from './messages.js';

export const SUPPORTED = ['vi', 'en'];
export const DEFAULT_LANG = 'vi';

// 'en-US,en;q=0.9,vi;q=0.8' ⇒ 'en'; không gửi header ⇒ 'vi' (cái đầu danh sách); 'fr' ⇒ false ⇒ mặc định 'vi'
export const pickLang = (req) =&gt; req.acceptsLanguages(...SUPPORTED) || DEFAULT_LANG;

export function texts(lang, code, params = {}) {
  const [title, detail] = MESSAGES[lang][code] ?? MESSAGES[lang].INTERNAL;
  return { title, detail: detail(params) };
}

// Thông báo lỗi của Zod theo đúng ngôn ngữ của request (Zod 4 có sẵn bộ tiếng Việt)
export const zodLocale = (lang) =&gt; z.locales[lang]().localeError;
export const UNKNOWN_FIELD = { vi: 'trường không được hỗ trợ', en: 'unknown field' };</code></pre>
<p><strong>3. Lỗi mang mã và tham số, không bao giờ mang câu đã viết sẵn.</strong> Một câu dựng ngay trong route bị đóng đinh vào một ngôn ngữ; tham số thì đặt vào ngôn ngữ nào cũng được. <code>src/http.js</code> đổi hàm khởi tạo:</p>
<pre><code class="language-javascript">// http.js — lỗi chỉ mang MÃ + THAM SỐ; câu chữ (vi/en) được dựng ở problems.js lúc trả lời
export class HttpError extends Error {
  constructor(status, code, params = {}, more) {
    super(code);
    this.status = status;   // mã HTTP: 400, 404, 409…
    this.code = code;       // mã máy đọc: 'BOOKING_CONFLICT'
    this.params = params;   // dữ liệu của lần lỗi này: { id: 'lab_9' }
    this.more = more;       // tuỳ chọn: mảng lỗi từng trường, HOẶC object thành viên mở rộng
  }
}

// Route có thật nhưng sai phương thức ⇒ 405 + header Allow
export const onlyAllow = (...methods) =&gt; (req, res) =&gt; {
  res.set('Allow', methods.join(', '));
  if (req.method === 'OPTIONS') return res.status(204).end();
  throw new HttpError(405, 'METHOD_NOT_ALLOWED', { method: req.method, path: req.baseUrl + req.path });
};</code></pre>
<p>và mọi <code>throw</code> đổi theo cùng một kiểu — trước và sau:</p>
<pre><code class="language-javascript">// trước (2.3): câu tiếng Việt cố định ngay trong route
throw new HttpError(404, 'LAB_NOT_FOUND', &#96;Không có phòng lab \${labId}&#96;);
// sau (2.4): chỉ mã + tham số; problems.js dựng câu theo ngôn ngữ người gọi
throw new HttpError(404, 'LAB_NOT_FOUND', { id: labId });
throw new HttpError(410, 'LAB_RETIRED', { id: labId, since: lab.retiredAt });
throw new HttpError(409, 'BOOKING_CONFLICT', { other: clash.id }, { conflictWith: clash.id });</code></pre>
<p>Hai mươi mốt câu <code>throw</code> thay đổi khắp dự án (<code>auth.js</code>, <code>app.js</code>, <code>http.js</code>, <code>validate.js</code> và bốn router); bộ xử lý lỗi chuyển <code>err.code</code>, <code>err.params</code> và <code>err.more</code> cho <code>sendProblem</code>. Việc đó chỉ là công việc máy móc, vì bài 2.1 đã cho mọi lỗi đi qua một hàm.</p>
<p><strong>4. <code>sendProblem</code> chọn ngôn ngữ và báo ra.</strong> <code>src/problems.js</code>, bản cuối:</p>
<pre><code class="language-javascript">// problems.js — RFC 9457 Problem Details: MỘT chỗ quyết định một lỗi trông thế nào
import { pickLang, texts } from './i18n.js';

export const PROBLEM_BASE = 'https://labflow.example/problems/';

// 'BOOKING_CONFLICT' ⇒ 'https://labflow.example/problems/booking-conflict'
export const typeOf = (code) =&gt; PROBLEM_BASE + code.toLowerCase().replaceAll('_', '-');

export function sendProblem(req, res, { status, code, params, ...extra }) {
  const lang = pickLang(req);
  const { title, detail } = texts(lang, code, params);    // câu chữ dựng Ở ĐÂY, theo ngôn ngữ người gọi
  res.status(status)
    .set('Content-Language', lang)                        // body này viết bằng ngôn ngữ nào
    .vary('Accept-Language')                              // cache: cùng URL, khác ngôn ngữ ⇒ khác body
    .type('application/problem+json')
    .json({ type: typeOf(code), title, status, detail, instance: req.originalUrl, code, ...extra });
}</code></pre>
<p><strong>5. Câu báo lỗi kiểm dữ liệu theo ngôn ngữ của request</strong> — Zod nhận một bộ ánh xạ lỗi cho từng lần gọi. Trong <code>src/validate.js</code>:</p>
<pre><code class="language-javascript">export const validate = (where, schema) =&gt; (req, res, next) =&gt; {
  const lang = pickLang(req);
  const r = schema.safeParse(req[where] ?? {}, { error: zodLocale(lang) });
  if (!r.success) {
    const errors = toErrors(r.error.issues, where, lang);
    throw new HttpError(400, where === 'query' ? 'INVALID_QUERY' : 'VALIDATION_FAILED', { count: errors.length }, errors);
  }
  req.valid = { ...req.valid, [where]: r.data };   // Express 5: req.query chỉ đọc, không gán lại được
  next();
};</code></pre>

<h3>Chạy thử: một lỗi, nhiều ngôn ngữ</h3>
<p>Không có header — mặc định, tiếng Việt:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
ETag: W/"de-n7A1XrnCUccoJT3bD1Syj4y0bkQ"
Date: Sat, 31 Oct 2026 17:44:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Không tìm thấy phòng lab",
  "status": 404,
  "detail": "Không có phòng lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>
<p>Tiếng Anh:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_9 -H 'Accept-Language: en'</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Language: en
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 200
ETag: W/"c8-fR0t4DMybAWtqwAJqAU97G8yy34"
Date: Sat, 31 Oct 2026 17:44:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Lab not found",
  "status": 404,
  "detail": "There is no lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>
<p>Cùng <code>type</code>, cùng <code>code</code>, cùng <code>instance</code>; chỉ chữ cho người đọc và <code>Content-Language</code> khác — cùng với <code>Content-Length</code>, vì chữ tiếng Việt tốn nhiều byte hơn trong UTF-8. Một header thật của trình duyệt chọn ra tiếng Anh, một ngôn ngữ ta không có thì lùi về mặc định, và trọng số được tôn trọng kể cả khi thứ tự viết ngược lại:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/labs/lab_9 -H 'Accept-Language: en-US,en;q=0.9,vi;q=0.8'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Lab not found",
  "status": 404,
  "detail": "There is no lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null http://localhost:4000/labs/lab_9 -H 'Accept-Language: fr'</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
ETag: W/"de-n7A1XrnCUccoJT3bD1Syj4y0bkQ"
Date: Sat, 31 Oct 2026 17:44:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5</div>
<pre><code class="language-bash">curl -s http://localhost:4000/labs/lab_9 -H 'Accept-Language: vi;q=0.4, en;q=0.6'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Lab not found",
  "status": 404,
  "detail": "There is no lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}</div>

<h3>Zod hai thứ tiếng — và một cái bẫy do chính ta đặt</h3>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Accept-Language: en' \\
  --json '{"labId":"lab-1","startAt":"mai 8h","note":"x"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Invalid request body",
  "status": 400,
  "detail": "4 problem(s) in the body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/labId",
      "detail": "must look like lab_1"
    },
    {
      "pointer": "#/startAt",
      "detail": "Invalid ISO datetime"
    },
    {
      "pointer": "#/endAt",
      "detail": "Invalid input: expected string, received undefined"
    },
    {
      "pointer": "#/note",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab-1","startAt":"mai 8h","note":"x"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "4 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/labId",
      "detail": "must look like lab_1"
    },
    {
      "pointer": "#/startAt",
      "detail": "ngày giờ ISO không hợp lệ"
    },
    {
      "pointer": "#/endAt",
      "detail": "Đầu vào không hợp lệ: mong đợi string, nhận được undefined"
    },
    {
      "pointer": "#/note",
      "detail": "trường không được hỗ trợ"
    }
  ]
}</div>
<p>Câu trả lời tiếng Việt gần như toàn tiếng Việt — trừ dòng đầu, <code>must look like lab_1</code>. Câu đó đến từ chính schema của ta ở bài 2.2 (<code>.regex(…, &#96;must look like \${prefix}_1&#96;)</code>). Câu báo lỗi tự viết được dùng <em>y nguyên</em>; nó đi vòng qua bộ ngôn ngữ. Hoặc bạn tự dịch các câu tự viết, hoặc để thư viện viết. LabFlow bỏ hai câu tự viết khỏi <code>schemas.js</code>:</p>
<pre><code class="language-javascript">// KHÔNG viết câu báo lỗi riêng: câu tự viết không được dịch — để Zod dùng câu theo ngôn ngữ của request
const id = (prefix) =&gt; z.string().regex(new RegExp(&#96;^\${prefix}_\\\\d+$&#96;));
// …
  serialNo: z.string().regex(/^[A-Z0-9-]{6,20}$/),</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab-1","startAt":"mai 8h","note":"x"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "4 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/labId",
      "detail": "Chuỗi không hợp lệ: phải khớp với mẫu /^lab_\\\\d+$/"
    },
    {
      "pointer": "#/startAt",
      "detail": "ngày giờ ISO không hợp lệ"
    },
    {
      "pointer": "#/endAt",
      "detail": "Đầu vào không hợp lệ: mong đợi string, nhận được undefined"
    },
    {
      "pointer": "#/note",
      "detail": "trường không được hỗ trợ"
    }
  ]
}</div>
<p>Tiếng Việt của thư viện chưa hoàn hảo ("mong đợi string"), nhưng nhất quán và miễn phí. Với vài câu người dùng thật sự nhìn thấy, client đằng nào cũng nên ánh xạ <code>pointer</code> sang câu chữ của riêng nó.</p>
<p>Response thành công không đổi theo ngôn ngữ: trong đó không có chữ nào dành cho người để dịch, chỉ có dữ liệu.</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_1 -H 'Accept-Language: en'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 122
ETag: W/"7a-uvX+0yMOfNePX7T77wYjzSxsZuw"
Date: Sat, 31 Oct 2026 17:44:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "lab_1",
  "code": "AL-201",
  "name": "Phòng Lab Mạng máy tính",
  "building": "Alpha",
  "capacity": 30
}</div>

<h3>Chữ tiếng Việt: hai chuỗi trông giống hệt nhau</h3>
<p>Chữ "ò" có thể được lưu theo hai cách trong Unicode: là <strong>một</strong> ký tự (U+00F2, dạng <strong>NFC</strong> — dạng dựng sẵn, thứ phần lớn bộ gõ tạo ra) hoặc là <strong>hai</strong> — chữ "o" theo sau là dấu huyền rời (U+0300, dạng <strong>NFD</strong> — dạng tách rời, hay gặp trong chữ chép từ PDF và trong tên tệp trên macOS). Trên màn hình chúng giống hệt nhau. Đo trong Node 22:</p>
<pre><code class="language-javascript">// unicode.mjs — tiếng Việt trong API: đo thật, đừng đoán
const nfc = 'Phòng';                       // gõ bằng bộ gõ thường gặp: "ò" là MỘT ký tự (U+00F2)
const nfd = 'Phòng';                 // dán từ PDF / tên tệp macOS: "o" + dấu huyền rời (U+0300)
console.log('hiện ra:', nfc, nfd);
console.log('length:', nfc.length, nfd.length);
console.log('bằng nhau?', nfc === nfd, '| sau NFC:', nfc === nfd.normalize('NFC'));
console.log('tìm "Phòng" trong tên:', 'Phòng Lab IoT'.includes(nfd), '| sau NFC:', 'Phòng Lab IoT'.includes(nfd.normalize('NFC')));
console.log('byte UTF-8:', Buffer.byteLength(nfc), Buffer.byteLength(nfd));
console.log('Đ tách dấu được không?', 'Đ'.normalize('NFD').length === 1 ? 'không — Đ là chữ riêng' : 'có');
const ten = ['Bình', 'An', 'Đức', 'Dũng', 'Yến', 'Ánh'];
console.log('sort():          ', [...ten].sort().join(', '));
console.log('Intl.Collator vi:', [...ten].sort(new Intl.Collator('vi').compare).join(', '));
const t = new Date('2026-11-02T01:00:00.000Z');
console.log('vi-VN:', new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(t));
console.log('en-US:', new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(t));
console.log('tiền:', new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1250000),
  '|', new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(1250000));</code></pre>
<pre><code class="language-bash">node unicode.mjs</code></pre>
<div class="out">hiện ra: Phòng Phòng
length: 5 6
bằng nhau? false | sau NFC: true
tìm "Phòng" trong tên: false | sau NFC: true
byte UTF-8: 6 7
Đ tách dấu được không? không — Đ là chữ riêng
sort():           An, Bình, Dũng, Yến, Ánh, Đức
Intl.Collator vi: An, Ánh, Bình, Dũng, Đức, Yến
vi-VN: lúc 08:00 Thứ Hai, 2 tháng 11, 2026
en-US: Monday, November 2, 2026 at 8:00 AM
tiền: 1.250.000 ₫ | ₫1,250,000</div>
<p>Đọc chậm bốn dòng đầu: hai chữ in ra như nhau, có độ dài khác nhau, không bằng nhau, và tìm chữ này không thấy chữ kia — cho tới khi cả hai được chuẩn hoá. Một sinh viên dán chữ "Phòng" từ thời khoá biểu PDF của phòng lab vào ô tìm kiếm của LabFlow sẽ chẳng tìm được gì, và phép kiểm trùng ("hai báo hỏng đang mở cùng tiêu đề", Lab 2) sẽ để lọt bản trùng.</p>
<p><strong>Luật: chuẩn hoá mọi chuỗi người gõ về NFC ngay ở cửa.</strong> Zod có sẵn chức năng này, nên hàm <code>text()</code> trong <code>schemas.js</code> làm việc đó cho mọi trường:</p>
<pre><code class="language-javascript">// Chữ người gõ: bỏ khoảng trắng hai đầu + chuẩn hoá Unicode về NFC ("ò" luôn là MỘT ký tự)
const text = (min, max) =&gt; z.string().trim().normalize('NFC').min(min).max(max);
// …
  purpose: text(1, 200).optional(),
  name: text(1, 100),
  note: text(0, 500).nullable().optional(),</code></pre>
<p>Bằng chứng — mục đích dưới đây được gửi ở dạng NFD (trên màn hình bạn nó trông bình thường); API lưu 9 ký tự, đúng độ dài NFC của "Phòng lab":</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/bookings \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"Phòng lab"}' | node -e "let s='';process.stdin.on('data',d=&gt;s+=d).on('end',()=&gt;{const p=JSON.parse(s).purpose;console.log(p, p.length, p===p.normalize('NFC'))})"</code></pre>
<div class="out">Phòng lab 9 true</div>
<p><strong>Tìm kiếm như người thật.</strong> Người dùng gõ không dấu ("phong lab mang") hoặc có dấu. Tham số <code>q</code> mới của LabFlow so sánh chữ đã được <em>gấp</em> (fold): tách dấu, bỏ dấu, viết thường. Dòng output ở trên đã cho thấy cái bẫy — <code>Đ</code> không tách được, nó là một chữ cái riêng, nên phải thay bằng tay. Trong <code>src/routes/labs.js</code>:</p>
<pre><code class="language-javascript">// "Phòng Lab IoT" ⇒ "phong lab iot": tách dấu (NFD), bỏ dấu, đ ⇒ d (Đ/đ KHÔNG tách được bằng NFD), chữ thường
const fold = (s) =&gt; s.normalize('NFD').replace(/\\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
// …
    if (q) data = data.filter((l) =&gt; fold(l.name).includes(fold(q)));</code></pre>
<p>(<code>\\p{M}</code> nghĩa là "mọi dấu kết hợp"; <code>LabsQuery</code> có thêm <code>q: text(1, 50).optional()</code>.) Cả truy vấn không dấu lẫn truy vấn mã hoá NFD đều tìm đúng phòng:</p>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?q=phong%20lab%20mang'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "lab_1",
      "code": "AL-201",
      "name": "Phòng Lab Mạng máy tính",
      "building": "Alpha",
      "capacity": 30
    }
  ]
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/labs?q=Pho%CC%80ng%20Lab%20IoT'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "lab_2",
      "code": "AL-305",
      "name": "Phòng Lab IoT",
      "building": "Alpha",
      "capacity": 24
    }
  ]
}</div>
<p><strong>Sắp xếp và định dạng là việc của locale.</strong> Dòng <code>sort()</code> ở trên đặt "Ánh" và "Đức" sau "Yến", vì nó so mã ký tự; <code>Intl.Collator('vi')</code> sắp như từ điển tiếng Việt. Và cùng một thời điểm in ra thành "lúc 08:00 Thứ Hai, 2 tháng 11, 2026" hay "Monday, November 2, 2026 at 8:00 AM"; cùng một số tiền thành "1.250.000 ₫" hay "₫1,250,000". Chính vì thế API gửi <code>2026-11-02T01:00:00.000Z</code> và số nguyên: một giá trị không thể hiểu nhầm, để mỗi client định dạng cho người dùng của nó. (Cơ sở dữ liệu cũng sắp xếp theo một <em>collation</em> — Chương 12.)</p>

<div class="pitfall"><p><strong>Bẫy — dịch cả mã.</strong> <code>"code": "TRÙNG_LỊCH"</code> cho người Việt và <code>"BOOKING_CONFLICT"</code> cho người Anh nghĩa là client nào cũng phải biết cả hai. Mã, type, giá trị enum và tên trường là định danh; chỉ chữ cho người đọc mới được dịch.</p></div>
<div class="pitfall"><p><strong>Bẫy — quên <code>Vary</code>.</strong> Không có <code>Vary: Accept-Language</code>, một bộ cache dùng chung (CDN, proxy của công ty) có thể lưu câu trả lời đầu tiên nó thấy rồi phát cho tất cả. Bug trông như ngẫu nhiên: "thỉnh thoảng lỗi lại ra tiếng Anh".</p></div>

<h3>Phỏng vấn và đi làm</h3>
<p><strong>"Em bản địa hoá lỗi của API thế nào?"</strong> Mã máy ổn định để client tự dịch, cộng <code>title</code>/<code>detail</code> ở phía server chọn theo <code>Accept-Language</code> cho client không có bảng dịch. Response nói rõ <code>Content-Language</code> và <code>Vary: Accept-Language</code>. Mã, tên trường và giá trị enum không bao giờ dịch.</p>
<p><strong>"Tìm một tên tiếng Việt thỉnh thoảng không ra. Vì sao?"</strong> Chuẩn hoá Unicode: chữ đã lưu và chữ tìm ở hai dạng khác nhau (NFC và NFD). Chuẩn hoá về NFC khi nhận vào; để tìm không phân biệt dấu thì gấp cả hai phía — và xử lý riêng đ/Đ.</p>
<p><strong>"API có nên định dạng ngày giờ cho người dùng không?"</strong> Không: gửi ISO 8601 theo UTC và để client định dạng theo locale và múi giờ của người dùng (<code>Intl.DateTimeFormat</code>).</p>

<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: MDN — Accept-Language — đọc ngày 1/11/2026</span><span class="lc-sub">Trọng số q (mặc định 1) xếp hạng ngôn ngữ; header chỉ là gợi ý — không bao giờ đè lựa chọn rõ ràng của người dùng, báo ngôn ngữ đã chọn ở Content-Language.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.unicode.org/reports/tr15/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Unicode UAX #15 — Normalization Forms (bản 58, 8/2026) — đọc ngày 1/11/2026</span><span class="lc-sub">NFC = tách chính tắc rồi ghép chính tắc: hai cách viết của cùng một chữ thành một chuỗi — lý do LabFlow chuẩn hoá chữ tiếng Việt.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Đổi các <code>throw</code> sang mã + tham số, thêm <code>messages.js</code> và <code>i18n.js</code>, rồi tái hiện các output ở trên.</li>
  <li>Thêm tiếng Nhật chỉ cho <code>LAB_NOT_FOUND</code> (các bạn học JPD đề nghị): chuyện gì xảy ra với mọi mã khác khi request ghi <code>Accept-Language: ja</code>? Quyết định luật — lùi từng câu về mặc định, hay giữ cả response một ngôn ngữ? Viết ra rồi cài đặt.</li>
  <li>Chạy <code>node unicode.mjs</code>. Rồi thêm một phòng tên "Phòng Điện tử" vào <code>db.js</code> và tìm nó bằng <code>?q=dien%20tu</code> — chỉ tìm được nhờ <code>fold</code> xử lý chữ đ.</li>
  <li>Kiểm mọi response lỗi đều có <code>Content-Language</code> và <code>Vary: Accept-Language</code> bằng <code>curl -s -D - -o /dev/null</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> cùng một request cho ra cùng <code>type</code>, <code>code</code> và <code>errors[].pointer</code> ở tiếng Việt lẫn tiếng Anh, chỉ chữ cho người đọc thay đổi; ngôn ngữ lạ lùi về tiếng Việt; mọi chữ nhập vào được lưu ở dạng NFC; và tìm không dấu ra được "Phòng Lab Mạng máy tính".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Localisation (bản địa hoá, l10n)</span><span class="v">Trình bày chữ và định dạng theo ngôn ngữ, quy ước của người dùng.</span></div>
  <div class="kv"><span class="k">Accept-Language</span><span class="v">Header của request liệt kê ngôn ngữ ưa thích, có thể kèm trọng số <code>q</code>.</span></div>
  <div class="kv"><span class="k">Content-Language</span><span class="v">Header của response nói body được viết bằng ngôn ngữ nào.</span></div>
  <div class="kv"><span class="k">Vary</span><span class="v">Báo cho cache biết header nào của request làm response thay đổi.</span></div>
  <div class="kv"><span class="k">Message catalogue (danh mục câu chữ)</span><span class="v">Một bảng chữ cho người đọc theo từng ngôn ngữ, tra theo mã.</span></div>
  <div class="kv"><span class="k">Unicode normalisation (chuẩn hoá Unicode, NFC / NFD)</span><span class="v">Dạng dựng sẵn và dạng tách rời của cùng một chữ; chuẩn hoá về NFC trước khi so sánh hay lưu.</span></div>
  <div class="kv"><span class="k">Collation (quy tắc sắp xếp)</span><span class="v">Luật sắp xếp theo ngôn ngữ, ví dụ <code>Intl.Collator('vi')</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chỉ dịch chữ cho người đọc — <code>title</code>, <code>detail</code>; mã, type, tên trường và giá trị enum không bao giờ đổi.</li>
  <li>App dịch dựa vào mã; server thêm chữ đã bản địa hoá, chọn theo <code>Accept-Language</code>, cho mọi client khác.</li>
  <li>Trả lời kèm <code>Content-Language</code> và <code>Vary: Accept-Language</code>; ngôn ngữ lạ lùi về mặc định.</li>
  <li>Lỗi mang mã và tham số; câu chữ dựng ở cửa ra, trong một danh mục.</li>
  <li>Chuẩn hoá chữ tiếng Việt nhận vào về NFC; gấp dấu (và đ/Đ bằng tay) khi tìm kiếm; sắp xếp bằng collator tiếng Việt.</li>
  <li>Gửi ngày giờ ISO và số tiền nguyên; định dạng theo locale là việc của client.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-7-4-template-literal-types" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Khoá câu chữ không thể gõ sai — TS 7.4: Template literal types</span><span class="lc-sub">Giống: một tập khoá câu chữ đóng, mỗi khoá một giá trị, nên khoá thiếu hay gõ sai bị bắt chứ không lên sản phẩm. Khác: TypeScript dựng kiểu khoá từ hai union trong một template literal (<code>&#96;&#36;{Resource}:&#36;{Field}&#96;</code>) và một <code>Record</code> qua nó ép mọi tổ hợp phải có giá trị — một lỗi gõ bị từ chối lúc biên dịch là TS2820, kèm gợi ý.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 2.5 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '2.5 — Lab 2: issue reports, version 2 (schemas, problems in two languages, stable views — with rubric)|||2.5 — Lab 2: báo hỏng thiết bị phiên bản 2 (schema, lỗi hai thứ tiếng, view ổn định — có thang chấm)',
      slug: 'api-2-5-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: nâng báo hỏng của Lab 1 lên chuẩn Chương 2 và thêm luật chống trùng tiêu đề không phân biệt dấu; thang chấm 10 điểm, lời giải mẫu và transcript chạy thật.',
      content: `${GL2}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab</span>
<h2>Lab 2 — Issue reports, version 2</h2>
<p class="lead">The issue reports you built in Lab 1 are now the oldest code in LabFlow: hand-written checks, raw records in responses, half-Vietnamese errors. In this lab you bring them up to the standard of Chapter 2 on your own — schemas at the edge, problem details in two languages, views with a stable shape — and add one new rule that needs everything you learned. A rubric tells you how it will be marked; the reference solution and a real transcript are at the end.</p>

<h3>The request</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">design</span><span class="lz-d">every error the issue endpoints can return, with codes</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">build</span><span class="lz-d">strict schema, problem+json, 404 before 400</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">prove</span><span class="lz-d">real transcript of each error</span></div>
  <div class="lz-step"><span class="lz-k">score</span><span class="lz-t">rubric</span><span class="lz-d">10 points, pass at 7</span></div>
</div>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9457.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9457 — Problem Details for HTTP APIs (Jul 2023) — read 1 Nov 2026</span><span class="lc-sub">The format every error of this lab must follow.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<ul>
  <li>“A report must have a <strong>title</strong> of 3 to 120 characters, a <strong>severity</strong> (<code>LOW</code>, <code>MEDIUM</code>, <code>HIGH</code>) and may have a <strong>description</strong> of up to 1000 characters. Anything else in the body is a mistake and must be refused.”</li>
  <li>“When a manager resolves a report, they may write a short <strong>resolution</strong> (up to 500 characters).”</li>
  <li>“We need one list of <strong>all</strong> reports, filterable by <strong>status</strong> and <strong>severity</strong>, for the weekly maintenance meeting.”</li>
  <li>“Students keep reporting the same broken console port five times. A device must not have two <strong>open</strong> reports with the same title — and ‘Cổng console không lên đèn’ is the same title as ‘cong CONSOLE khong len den’.”</li>
  <li>“The exchange students read English.”</li>
</ul>
<p>Budget: design 15 minutes · build 60–90 minutes · prove 20 minutes. Start from your code at the end of lesson 2.4.</p>

<h3>Part A — design before you code (add to <code>DESIGN.md</code>)</h3>
<table>
  <thead><tr><th>Input / situation</th><th>Layer (door, shape, rule)</th><th>Status + <code>code</code></th></tr></thead>
  <tbody>
    <tr><td>title of 1 character</td><td>?</td><td>?</td></tr>
    <tr><td>severity <code>URGENT</code></td><td>?</td><td>?</td></tr>
    <tr><td>an extra member <code>reporter</code></td><td>?</td><td>?</td></tr>
    <tr><td>report on <code>dev_9</code> with an empty body</td><td>?</td><td>?</td></tr>
    <tr><td>second open report with the same title (any accents, any case)</td><td>?</td><td>?</td></tr>
    <tr><td>body sent as <code>text/plain</code></td><td>?</td><td>?</td></tr>
    <tr><td><code>GET /issues?status=open</code> (lower case)</td><td>?</td><td>?</td></tr>
  </tbody>
</table>
<p>Two decisions to write down with one sentence of <em>why</em> each: (1) for a report on a device that does not exist <em>and</em> a bad body, which error wins — and does that match Lab 1? (2) Which extension member should the duplicate error carry so the app can open the existing report?</p>

<h3>Part B — build it: rules your code must follow</h3>
<ol>
  <li><code>IssueCreate</code>, <code>IssueResolve</code> and <code>IssuesQuery</code> are strict Zod schemas in <code>schemas.js</code>; every text goes through <code>text()</code> (trim + NFC). No handler reads <code>req.body</code> or <code>req.query</code> directly.</li>
  <li>Keep Lab 1’s order for reporting: <strong>401 → 404 → 400</strong>. (Hint: a small middleware that loads the device, placed before <code>validate</code>.)</li>
  <li>The duplicate rule compares titles <strong>folded</strong> (lesson 2.4); move <code>fold</code> from <code>labs.js</code> to <code>src/text.js</code> so both routers share it. Answer <code>409 DUPLICATE_ISSUE</code> with the existing report’s id as an extension member.</li>
  <li>Every issue leaves the server through <code>toIssue</code>, with <code>description</code>, <code>resolvedAt</code> and <code>resolution</code> always present (<code>null</code> when empty); lists use <code>list()</code>.</li>
  <li>The new code has a <code>title</code> and <code>detail</code> in both languages in <code>messages.js</code>.</li>
  <li>When no file uses the old <code>{ field, issue }</code> shape any more, remove the bridge from the error handler in <code>app.js</code>: errors are passed through as they are.</li>
</ol>

<h3>Part C — prove it (write <code>TRANSCRIPT.md</code>)</h3>
<p>Restart the server and run, in this order, pasting every full response unedited:</p>
<ol>
  <li>An reports <code>dev_1</code> with severity <code>HIGH</code> → <strong>201</strong>, <code>Location</code>, all ten members.</li>
  <li><code>GET /devices/dev_1</code> → <code>MAINTENANCE</code>, <code>"note": null</code>.</li>
  <li>With <code>Accept-Language: en</code>, body <code>{"title":"x","severity":"URGENT","reporter":"usr_2"}</code> → <strong>400</strong> with three pointers.</li>
  <li><code>dev_9</code> with an empty body → <strong>404</strong>, not 400.</li>
  <li>Bình reports <code>"cong CONSOLE khong len den"</code> on <code>dev_1</code> → <strong>409</strong> with the existing id.</li>
  <li>A <code>text/plain</code> body → <strong>415</strong>.</li>
  <li><code>GET /issues?status=OPEN&amp;severity=HIGH</code> → one report; <code>?status=open</code> in English → <strong>400</strong> naming the parameter.</li>
  <li>Resolve <code>iss_1</code> as An → <strong>403</strong>; as Lan with a resolution → <strong>200</strong>; again in English → <strong>409</strong> with <code>Content-Language: en</code>.</li>
  <li><code>DELETE /issues/iss_1</code> → <strong>405</strong> with <code>Allow</code>.</li>
</ol>

<h3>Rubric — 10 points</h3>
<table>
  <thead><tr><th>Points</th><th>Criterion</th><th>Checked by</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Strict schemas for create, resolve and query; unknown members and wrong enums refused with one pointer/parameter each</td><td>steps 3, 7 · reading <code>schemas.js</code></td></tr>
    <tr><td>1</td><td>Order 401 → 404 → 400 kept</td><td>step 4</td></tr>
    <tr><td>2</td><td>Duplicate rule ignores accents, case and NFC/NFD; 409 carries the existing id</td><td>step 5 + one NFD test of your own</td></tr>
    <tr><td>1</td><td>Every error is <code>application/problem+json</code> with a stable <code>type</code> and <code>code</code></td><td>any error</td></tr>
    <tr><td>1</td><td>Both languages: <code>Content-Language</code>, <code>Vary</code>, translated <code>title</code>/<code>detail</code>, nothing else translated</td><td>steps 3, 8</td></tr>
    <tr><td>2</td><td>Responses through <code>toIssue</code>/<code>list</code>: same ten members in every state, <code>null</code> when empty</td><td>steps 1, 7, 8</td></tr>
    <tr><td>1</td><td><code>TRANSCRIPT.md</code> has every command with its real, unedited output</td><td>the file</td></tr>
  </tbody>
</table>
<p><strong>Pass: 7/10.</strong> Hand in <code>DESIGN.md</code>, the changed <code>src/</code> files and <code>TRANSCRIPT.md</code> in one commit whose message says what the API gained.</p>

<h3>Stretch goals (no points, real skills)</h3>
<ul>
  <li>Resolving the last open <code>HIGH</code> report of a device sets it back to <code>AVAILABLE</code> (from Lab 1’s stretch list, now with a proper response).</li>
  <li>A third language for the issue codes only; decide what the other codes do (lesson 2.4, practice 2).</li>
  <li>A front-end form: map each <code>errors[].pointer</code> to its input and show the <code>detail</code> under it.</li>
  <li>Return the duplicate check’s folded title in your own debug log only — never in the response.</li>
</ul>

<h3>Reference solution — read after you have tried</h3>
<p><strong>Design.</strong> title 1 char, <code>URGENT</code>, <code>reporter</code> → shape, 400 <code>VALIDATION_FAILED</code> (three pointers) · <code>dev_9</code> → rule that needs data, 404 <code>DEVICE_NOT_FOUND</code>, and it wins because the parent is loaded before the body is read, as in Lab 1 · same title → rule, 409 <code>DUPLICATE_ISSUE</code> with <code>existing</code> · <code>text/plain</code> → door, 415 · <code>status=open</code> → shape of the query, 400 <code>INVALID_QUERY</code> with <code>"parameter": "status"</code>.</p>
<p><code>src/text.js</code> (new — <code>fold</code> moves here from <code>labs.js</code>):</p>
<pre><code class="language-javascript">// text.js — so sánh chữ tiếng Việt "như người đọc": không phân biệt dấu, hoa thường, NFC/NFD
// "Phòng Lab IoT" ⇒ "phong lab iot"; đ/Đ không tách được bằng NFD nên đổi tay
export const fold = (s) =&gt; s.normalize('NFD').replace(/\\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();</code></pre>
<p><code>src/schemas.js</code> — add:</p>
<pre><code class="language-javascript">// Lab 2 — báo hỏng
export const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];
export const IssueCreate = z.strictObject({
  title: text(3, 120),
  severity: z.enum(SEVERITIES),
  description: text(1, 1000).optional(),
});
export const IssueResolve = z.strictObject({ resolution: text(1, 500).optional() });
export const IssuesQuery = z.strictObject({
  status: z.enum(['OPEN', 'RESOLVED']).optional(),
  severity: z.enum(SEVERITIES).optional(),
});</code></pre>
<p><code>src/views.js</code> — <code>toIssue</code> gains the new members:</p>
<pre><code class="language-javascript">export const toIssue = (i) =&gt; ({
  id: i.id, deviceId: i.deviceId, reportedBy: i.reportedBy, title: i.title, severity: i.severity,
  description: i.description ?? null, status: i.status, createdAt: i.createdAt,
  resolvedAt: i.resolvedAt ?? null, resolution: i.resolution ?? null,
});</code></pre>
<p><code>src/messages.js</code> — one line in each language:</p>
<pre><code class="language-javascript">// vi
DUPLICATE_ISSUE: ['Báo hỏng bị trùng', (p) =&gt; &#96;Thiết bị đã có báo hỏng đang mở \${p.existing} cùng tiêu đề&#96;],
// en
DUPLICATE_ISSUE: ['Duplicate issue', (p) =&gt; &#96;The device already has open issue \${p.existing} with the same title&#96;],</code></pre>
<p><code>src/app.js</code> — the bridge for the old shape goes:</p>
<pre><code class="language-javascript">    const more = Array.isArray(err.more)
      ? { errors: err.more }   // lỗi từng trường: { pointer | parameter, detail }
      : err.more;</code></pre>
<p><code>src/routes/issues.js</code>, complete:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices, issues, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { IssueCreate, IssueResolve, IssuesQuery } from '../schemas.js';
import { toIssue, list } from '../views.js';
import { fold } from '../text.js';

// Nạp thiết bị cha TRƯỚC khi kiểm body ⇒ giữ thứ tự của Lab 1: 401 → 404 → 400
function loadDevice(req, res, next) {
  req.device = devices.find((x) =&gt; x.id === req.params.id);
  if (!req.device) throw new HttpError(404, 'DEVICE_NOT_FOUND', { id: req.params.id });
  next();
}
function findIssue(id) {
  const i = issues.find((x) =&gt; x.id === id);
  if (!i) throw new HttpError(404, 'ISSUE_NOT_FOUND', { id });
  return i;
}

// Gắn dưới /devices: /devices/:id/issues (bộ sưu tập con)
export const deviceIssuesRouter = Router({ mergeParams: true });
deviceIssuesRouter.route('/')
  .get(loadDevice, (req, res) =&gt; res.json(list(issues.filter((i) =&gt; i.deviceId === req.device.id), toIssue)))
  .post(requireAuth, loadDevice, validate('body', IssueCreate), (req, res) =&gt; {
    const { title, severity, description } = req.valid.body;
    // Luật nghiệp vụ: một thiết bị không có hai báo hỏng ĐANG MỞ cùng tiêu đề (so như người đọc)
    const same = issues.find((i) =&gt; i.deviceId === req.device.id &amp;&amp; i.status === 'OPEN' &amp;&amp; fold(i.title) === fold(title));
    if (same) throw new HttpError(409, 'DUPLICATE_ISSUE', { existing: same.id }, { existing: same.id });
    const issue = { id: nextId('iss'), deviceId: req.device.id, reportedBy: req.user.id, title, severity,
      description, status: 'OPEN', createdAt: new Date().toISOString() };
    issues.push(issue);
    if (severity === 'HIGH') req.device.status = 'MAINTENANCE';   // hỏng nặng ⇒ khoá thiết bị
    res.status(201).location(&#96;/issues/\${issue.id}&#96;).json(toIssue(issue));
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Gắn ở gốc: /issues, /issues/:id và hành động /issues/:id/resolve
export const issuesRouter = Router();
issuesRouter.route('/')
  .get(validate('query', IssuesQuery), (req, res) =&gt; {
    const { status, severity } = req.valid.query;
    let data = issues;
    if (status) data = data.filter((i) =&gt; i.status === status);
    if (severity) data = data.filter((i) =&gt; i.severity === severity);
    res.json(list(data, toIssue));
  })
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id')
  .get((req, res) =&gt; res.json(toIssue(findIssue(req.params.id))))
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', IssueResolve), (req, res) =&gt; {
    const issue = findIssue(req.params.id);
    if (issue.status === 'RESOLVED') throw new HttpError(409, 'ALREADY_RESOLVED', { id: issue.id });
    issue.status = 'RESOLVED';
    issue.resolvedAt = new Date().toISOString();
    if (req.valid.body.resolution) issue.resolution = req.valid.body.resolution;
    res.json(toIssue(issue));
  })
  .all(onlyAllow('POST'));</code></pre>

<h3>Reference transcript (real run)</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/devices/dev_1/issues \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"title":"Cổng console không lên đèn","severity":"HIGH"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /issues/iss_1
Content-Type: application/json; charset=utf-8
Content-Length: 266
ETag: W/"10a-Gsv7lsOJWUra75ojgb5mXWRgDJw"
Date: Sat, 31 Oct 2026 17:46:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "description": null,
  "status": "OPEN",
  "createdAt": "2026-10-31T17:46:03.341Z",
  "resolvedAt": null,
  "resolution": null
}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/devices/dev_1</code></pre>
<div class="out">{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "MAINTENANCE",
  "note": null
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/devices/dev_1/issues \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Accept-Language: en' \\
  --json '{"title":"x","severity":"URGENT","reporter":"usr_2"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Invalid request body",
  "status": 400,
  "detail": "3 problem(s) in the body",
  "instance": "/devices/dev_1/issues",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/title",
      "detail": "Too small: expected string to have &gt;=3 characters"
    },
    {
      "pointer": "#/severity",
      "detail": "Invalid option: expected one of \\"LOW\\"|\\"MEDIUM\\"|\\"HIGH\\""
    },
    {
      "pointer": "#/reporter",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/devices/dev_9/issues \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/device-not-found",
  "title": "Không tìm thấy thiết bị",
  "status": 404,
  "detail": "Không có thiết bị dev_9",
  "instance": "/devices/dev_9/issues",
  "code": "DEVICE_NOT_FOUND"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/devices/dev_1/issues \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"title":"cong CONSOLE khong len den","severity":"LOW"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/duplicate-issue",
  "title": "Báo hỏng bị trùng",
  "status": 409,
  "detail": "Thiết bị đã có báo hỏng đang mở iss_1 cùng tiêu đề",
  "instance": "/devices/dev_1/issues",
  "code": "DUPLICATE_ISSUE",
  "existing": "iss_1"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/devices/dev_1/issues \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: text/plain' \\
  -d 'hỏng rồi'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/unsupported-media-type",
  "title": "Kiểu nội dung không được hỗ trợ",
  "status": 415,
  "detail": "Chỉ nhận JSON, nhận text/plain",
  "instance": "/devices/dev_1/issues",
  "code": "UNSUPPORTED_MEDIA_TYPE"
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?status=OPEN&amp;severity=HIGH'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "iss_1",
      "deviceId": "dev_1",
      "reportedBy": "usr_1",
      "title": "Cổng console không lên đèn",
      "severity": "HIGH",
      "description": null,
      "status": "OPEN",
      "createdAt": "2026-10-31T17:46:03.341Z",
      "resolvedAt": null,
      "resolution": null
    }
  ]
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?status=open' -H 'Accept-Language: en'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-query",
  "title": "Invalid query parameters",
  "status": 400,
  "detail": "1 problem(s) in the query",
  "instance": "/issues?status=open",
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "status",
      "detail": "Invalid option: expected one of \\"OPEN\\"|\\"RESOLVED\\""
    }
  ]
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/forbidden",
  "title": "Không đủ quyền",
  "status": 403,
  "detail": "Chỉ LAB_MANAGER được làm việc này",
  "instance": "/issues/iss_1/resolve",
  "code": "FORBIDDEN"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"resolution":"Thay cáp console mới"}'</code></pre>
<div class="out">{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "description": null,
  "status": "RESOLVED",
  "createdAt": "2026-10-31T17:46:03.341Z",
  "resolvedAt": "2026-10-31T17:46:03.473Z",
  "resolution": "Thay cáp console mới"
}</div>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Content-Language: en
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 235
ETag: W/"eb-JSdV17CVwzEKGwTfc9NRf2OE99w"
Date: Sat, 31 Oct 2026 17:46:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/already-resolved",
  "title": "Issue already resolved",
  "status": 409,
  "detail": "Issue iss_1 is already resolved",
  "instance": "/issues/iss_1/resolve",
  "code": "ALREADY_RESOLVED"
}</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null -X DELETE http://localhost:4000/issues/iss_1</code></pre>
<div class="out">HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 266
ETag: W/"10a-oTGg3iJJsF43idxSEgMWZ+3RANI"
Date: Sat, 31 Oct 2026 17:46:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5</div>
<p>Things to notice: step 3 lists all three problems in one answer; step 4 shows the parent check winning; step 5 caught a title typed without accents and in another case; step 8’s third answer is English because only its request asked for English.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab</span>
<h2>Lab 2 — Báo hỏng thiết bị, phiên bản 2</h2>
<p class="lead">Phần báo hỏng bạn dựng ở Lab 1 giờ là đoạn code cũ nhất của LabFlow: kiểm tra viết tay, response trả bản ghi thô, lỗi nửa tiếng Việt. Trong lab này bạn tự nâng nó lên chuẩn của Chương 2 — schema ở cửa, problem details hai thứ tiếng, view với hình dạng ổn định — và thêm một luật mới cần tới mọi thứ đã học. Thang chấm nói rõ cách chấm; lời giải mẫu và transcript chạy thật ở cuối bài.</p>

<h3>Yêu cầu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">thiết kế</span><span class="lz-d">mọi lỗi các endpoint báo hỏng có thể trả, kèm code</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">xây</span><span class="lz-d">schema chặt, problem+json, 404 trước 400</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">chứng minh</span><span class="lz-d">transcript thật của từng lỗi</span></div>
  <div class="lz-step"><span class="lz-k">chấm</span><span class="lz-t">thang điểm</span><span class="lz-d">10 điểm, đạt từ 7</span></div>
</div>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9457.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9457 — Problem Details for HTTP APIs (7/2023) — đọc ngày 1/11/2026</span><span class="lc-sub">Định dạng mà mọi lỗi của lab này phải theo.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<ul>
  <li>"Báo hỏng phải có <strong>tiêu đề</strong> (title) 3 tới 120 ký tự, một <strong>mức độ</strong> (severity: <code>LOW</code>, <code>MEDIUM</code>, <code>HIGH</code>) và có thể có <strong>mô tả</strong> (description) tối đa 1000 ký tự. Thứ gì khác trong body là nhầm lẫn và phải bị từ chối."</li>
  <li>"Khi quản lý xử lý xong một báo hỏng, họ có thể ghi một dòng <strong>cách xử lý</strong> (resolution) ngắn, tối đa 500 ký tự."</li>
  <li>"Chúng tôi cần một danh sách <strong>tất cả</strong> báo hỏng, lọc được theo <strong>trạng thái</strong> và <strong>mức độ</strong>, cho buổi họp bảo trì hằng tuần."</li>
  <li>"Sinh viên cứ báo cùng một cổng console hỏng tới năm lần. Một thiết bị không được có hai báo hỏng <strong>đang mở</strong> cùng tiêu đề — và 'Cổng console không lên đèn' là cùng tiêu đề với 'cong CONSOLE khong len den'."</li>
  <li>"Sinh viên trao đổi đọc tiếng Anh."</li>
</ul>
<p>Thời gian: thiết kế 15 phút · dựng 60–90 phút · chứng minh 20 phút. Bắt đầu từ code của bạn ở cuối bài 2.4.</p>

<h3>Phần A — thiết kế trước khi code (bổ sung vào <code>DESIGN.md</code>)</h3>
<table>
  <thead><tr><th>Đầu vào / tình huống</th><th>Tầng (cửa, hình dạng, luật)</th><th>Mã trạng thái + <code>code</code></th></tr></thead>
  <tbody>
    <tr><td>title 1 ký tự</td><td>?</td><td>?</td></tr>
    <tr><td>severity <code>URGENT</code></td><td>?</td><td>?</td></tr>
    <tr><td>trường thừa <code>reporter</code></td><td>?</td><td>?</td></tr>
    <tr><td>báo hỏng <code>dev_9</code> với body rỗng</td><td>?</td><td>?</td></tr>
    <tr><td>báo hỏng đang mở thứ hai cùng tiêu đề (dấu, hoa thường tuỳ ý)</td><td>?</td><td>?</td></tr>
    <tr><td>body gửi dạng <code>text/plain</code></td><td>?</td><td>?</td></tr>
    <tr><td><code>GET /issues?status=open</code> (chữ thường)</td><td>?</td><td>?</td></tr>
  </tbody>
</table>
<p>Hai quyết định cần ghi ra, mỗi cái một câu <em>vì sao</em>: (1) báo hỏng một thiết bị không tồn tại <em>và</em> body sai — lỗi nào thắng, và có khớp Lab 1 không? (2) Lỗi trùng nên mang trường mở rộng nào để app mở được báo hỏng đã có?</p>

<h3>Phần B — dựng: các luật code phải tuân theo</h3>
<ol>
  <li><code>IssueCreate</code>, <code>IssueResolve</code> và <code>IssuesQuery</code> là schema Zod strict trong <code>schemas.js</code>; mọi chữ đi qua <code>text()</code> (trim + NFC). Không handler nào đọc thẳng <code>req.body</code> hay <code>req.query</code>.</li>
  <li>Giữ thứ tự của Lab 1 khi báo hỏng: <strong>401 → 404 → 400</strong>. (Gợi ý: một middleware nhỏ nạp thiết bị, đặt trước <code>validate</code>.)</li>
  <li>Luật trùng so sánh tiêu đề đã <strong>gấp</strong> (bài 2.4); chuyển <code>fold</code> từ <code>labs.js</code> sang <code>src/text.js</code> để hai router dùng chung. Trả <code>409 DUPLICATE_ISSUE</code> kèm id của báo hỏng đã có dưới dạng trường mở rộng.</li>
  <li>Mọi báo hỏng rời server qua <code>toIssue</code>, với <code>description</code>, <code>resolvedAt</code> và <code>resolution</code> luôn có mặt (<code>null</code> khi rỗng); danh sách dùng <code>list()</code>.</li>
  <li>Mã lỗi mới có <code>title</code> và <code>detail</code> ở cả hai ngôn ngữ trong <code>messages.js</code>.</li>
  <li>Khi không tệp nào còn dùng hình dạng cũ <code>{ field, issue }</code>, gỡ "cầu nối" khỏi bộ xử lý lỗi trong <code>app.js</code>: lỗi được chuyển đi y nguyên.</li>
</ol>

<h3>Phần C — chứng minh (viết <code>TRANSCRIPT.md</code>)</h3>
<p>Khởi động lại server rồi chạy, đúng thứ tự, dán nguyên văn mọi response:</p>
<ol>
  <li>An báo hỏng <code>dev_1</code> mức <code>HIGH</code> → <strong>201</strong>, có <code>Location</code>, đủ mười trường.</li>
  <li><code>GET /devices/dev_1</code> → <code>MAINTENANCE</code>, <code>"note": null</code>.</li>
  <li>Với <code>Accept-Language: en</code>, body <code>{"title":"x","severity":"URGENT","reporter":"usr_2"}</code> → <strong>400</strong> kèm ba pointer.</li>
  <li><code>dev_9</code> với body rỗng → <strong>404</strong>, không phải 400.</li>
  <li>Bình báo <code>"cong CONSOLE khong len den"</code> cho <code>dev_1</code> → <strong>409</strong> kèm id đã có.</li>
  <li>Một body <code>text/plain</code> → <strong>415</strong>.</li>
  <li><code>GET /issues?status=OPEN&amp;severity=HIGH</code> → một báo hỏng; <code>?status=open</code> bằng tiếng Anh → <strong>400</strong> nêu tên tham số.</li>
  <li>Xử lý <code>iss_1</code> bằng An → <strong>403</strong>; bằng Lan kèm resolution → <strong>200</strong>; lần nữa bằng tiếng Anh → <strong>409</strong> với <code>Content-Language: en</code>.</li>
  <li><code>DELETE /issues/iss_1</code> → <strong>405</strong> kèm <code>Allow</code>.</li>
</ol>

<h3>Thang chấm — 10 điểm</h3>
<table>
  <thead><tr><th>Điểm</th><th>Tiêu chí</th><th>Kiểm bằng</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Schema strict cho tạo, xử lý và query; trường lạ và enum sai bị từ chối, mỗi lỗi một pointer/parameter</td><td>bước 3, 7 · đọc <code>schemas.js</code></td></tr>
    <tr><td>1</td><td>Giữ thứ tự 401 → 404 → 400</td><td>bước 4</td></tr>
    <tr><td>2</td><td>Luật trùng bỏ qua dấu, hoa thường và NFC/NFD; 409 mang id đã có</td><td>bước 5 + một phép thử NFD của riêng bạn</td></tr>
    <tr><td>1</td><td>Mọi lỗi là <code>application/problem+json</code> với <code>type</code> và <code>code</code> ổn định</td><td>lỗi bất kỳ</td></tr>
    <tr><td>1</td><td>Hai ngôn ngữ: <code>Content-Language</code>, <code>Vary</code>, <code>title</code>/<code>detail</code> được dịch, không gì khác bị dịch</td><td>bước 3, 8</td></tr>
    <tr><td>2</td><td>Response qua <code>toIssue</code>/<code>list</code>: cùng mười trường ở mọi trạng thái, rỗng thì <code>null</code></td><td>bước 1, 7, 8</td></tr>
    <tr><td>1</td><td><code>TRANSCRIPT.md</code> có mọi lệnh kèm output thật, không sửa</td><td>tệp nộp</td></tr>
  </tbody>
</table>
<p><strong>Đạt: 7/10.</strong> Nộp <code>DESIGN.md</code>, các tệp <code>src/</code> đã sửa và <code>TRANSCRIPT.md</code> trong một commit có lời nhắn nói rõ API vừa có thêm gì.</p>

<h3>Thử thách thêm (không tính điểm, kỹ năng thật)</h3>
<ul>
  <li>Xử lý xong báo hỏng <code>HIGH</code> cuối cùng đang mở của một thiết bị thì đưa thiết bị về <code>AVAILABLE</code> (từ danh sách thử thách của Lab 1, giờ với response chuẩn).</li>
  <li>Ngôn ngữ thứ ba chỉ cho các mã của báo hỏng; quyết định các mã khác làm gì (bài 2.4, thực hành 2).</li>
  <li>Một form front-end: ánh xạ mỗi <code>errors[].pointer</code> tới ô nhập tương ứng và hiện <code>detail</code> ngay dưới.</li>
  <li>Ghi tiêu đề đã gấp của phép kiểm trùng vào log gỡ lỗi của riêng bạn — không bao giờ vào response.</li>
</ul>

<h3>Lời giải mẫu — đọc sau khi đã tự làm</h3>
<p><strong>Thiết kế.</strong> title 1 ký tự, <code>URGENT</code>, <code>reporter</code> → hình dạng, 400 <code>VALIDATION_FAILED</code> (ba pointer) · <code>dev_9</code> → luật cần tra dữ liệu, 404 <code>DEVICE_NOT_FOUND</code>, và nó thắng vì thiết bị cha được nạp trước khi đọc body, như Lab 1 · trùng tiêu đề → luật, 409 <code>DUPLICATE_ISSUE</code> kèm <code>existing</code> · <code>text/plain</code> → cửa, 415 · <code>status=open</code> → hình dạng của query, 400 <code>INVALID_QUERY</code> kèm <code>"parameter": "status"</code>.</p>
<p><code>src/text.js</code> (mới — <code>fold</code> chuyển từ <code>labs.js</code> sang đây):</p>
<pre><code class="language-javascript">// text.js — so sánh chữ tiếng Việt "như người đọc": không phân biệt dấu, hoa thường, NFC/NFD
// "Phòng Lab IoT" ⇒ "phong lab iot"; đ/Đ không tách được bằng NFD nên đổi tay
export const fold = (s) =&gt; s.normalize('NFD').replace(/\\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();</code></pre>
<p><code>src/schemas.js</code> — thêm:</p>
<pre><code class="language-javascript">// Lab 2 — báo hỏng
export const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];
export const IssueCreate = z.strictObject({
  title: text(3, 120),
  severity: z.enum(SEVERITIES),
  description: text(1, 1000).optional(),
});
export const IssueResolve = z.strictObject({ resolution: text(1, 500).optional() });
export const IssuesQuery = z.strictObject({
  status: z.enum(['OPEN', 'RESOLVED']).optional(),
  severity: z.enum(SEVERITIES).optional(),
});</code></pre>
<p><code>src/views.js</code> — <code>toIssue</code> có thêm các trường mới:</p>
<pre><code class="language-javascript">export const toIssue = (i) =&gt; ({
  id: i.id, deviceId: i.deviceId, reportedBy: i.reportedBy, title: i.title, severity: i.severity,
  description: i.description ?? null, status: i.status, createdAt: i.createdAt,
  resolvedAt: i.resolvedAt ?? null, resolution: i.resolution ?? null,
});</code></pre>
<p><code>src/messages.js</code> — mỗi ngôn ngữ một dòng:</p>
<pre><code class="language-javascript">// vi
DUPLICATE_ISSUE: ['Báo hỏng bị trùng', (p) =&gt; &#96;Thiết bị đã có báo hỏng đang mở \${p.existing} cùng tiêu đề&#96;],
// en
DUPLICATE_ISSUE: ['Duplicate issue', (p) =&gt; &#96;The device already has open issue \${p.existing} with the same title&#96;],</code></pre>
<p><code>src/app.js</code> — cầu nối cho hình dạng cũ bị gỡ:</p>
<pre><code class="language-javascript">    const more = Array.isArray(err.more)
      ? { errors: err.more }   // lỗi từng trường: { pointer | parameter, detail }
      : err.more;</code></pre>
<p><code>src/routes/issues.js</code>, đầy đủ:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices, issues, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { IssueCreate, IssueResolve, IssuesQuery } from '../schemas.js';
import { toIssue, list } from '../views.js';
import { fold } from '../text.js';

// Nạp thiết bị cha TRƯỚC khi kiểm body ⇒ giữ thứ tự của Lab 1: 401 → 404 → 400
function loadDevice(req, res, next) {
  req.device = devices.find((x) =&gt; x.id === req.params.id);
  if (!req.device) throw new HttpError(404, 'DEVICE_NOT_FOUND', { id: req.params.id });
  next();
}
function findIssue(id) {
  const i = issues.find((x) =&gt; x.id === id);
  if (!i) throw new HttpError(404, 'ISSUE_NOT_FOUND', { id });
  return i;
}

// Gắn dưới /devices: /devices/:id/issues (bộ sưu tập con)
export const deviceIssuesRouter = Router({ mergeParams: true });
deviceIssuesRouter.route('/')
  .get(loadDevice, (req, res) =&gt; res.json(list(issues.filter((i) =&gt; i.deviceId === req.device.id), toIssue)))
  .post(requireAuth, loadDevice, validate('body', IssueCreate), (req, res) =&gt; {
    const { title, severity, description } = req.valid.body;
    // Luật nghiệp vụ: một thiết bị không có hai báo hỏng ĐANG MỞ cùng tiêu đề (so như người đọc)
    const same = issues.find((i) =&gt; i.deviceId === req.device.id &amp;&amp; i.status === 'OPEN' &amp;&amp; fold(i.title) === fold(title));
    if (same) throw new HttpError(409, 'DUPLICATE_ISSUE', { existing: same.id }, { existing: same.id });
    const issue = { id: nextId('iss'), deviceId: req.device.id, reportedBy: req.user.id, title, severity,
      description, status: 'OPEN', createdAt: new Date().toISOString() };
    issues.push(issue);
    if (severity === 'HIGH') req.device.status = 'MAINTENANCE';   // hỏng nặng ⇒ khoá thiết bị
    res.status(201).location(&#96;/issues/\${issue.id}&#96;).json(toIssue(issue));
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Gắn ở gốc: /issues, /issues/:id và hành động /issues/:id/resolve
export const issuesRouter = Router();
issuesRouter.route('/')
  .get(validate('query', IssuesQuery), (req, res) =&gt; {
    const { status, severity } = req.valid.query;
    let data = issues;
    if (status) data = data.filter((i) =&gt; i.status === status);
    if (severity) data = data.filter((i) =&gt; i.severity === severity);
    res.json(list(data, toIssue));
  })
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id')
  .get((req, res) =&gt; res.json(toIssue(findIssue(req.params.id))))
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', IssueResolve), (req, res) =&gt; {
    const issue = findIssue(req.params.id);
    if (issue.status === 'RESOLVED') throw new HttpError(409, 'ALREADY_RESOLVED', { id: issue.id });
    issue.status = 'RESOLVED';
    issue.resolvedAt = new Date().toISOString();
    if (req.valid.body.resolution) issue.resolution = req.valid.body.resolution;
    res.json(toIssue(issue));
  })
  .all(onlyAllow('POST'));</code></pre>

<h3>Transcript mẫu (chạy thật)</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/devices/dev_1/issues \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{"title":"Cổng console không lên đèn","severity":"HIGH"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /issues/iss_1
Content-Type: application/json; charset=utf-8
Content-Length: 266
ETag: W/"10a-Gsv7lsOJWUra75ojgb5mXWRgDJw"
Date: Sat, 31 Oct 2026 17:46:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "description": null,
  "status": "OPEN",
  "createdAt": "2026-10-31T17:46:03.341Z",
  "resolvedAt": null,
  "resolution": null
}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/devices/dev_1</code></pre>
<div class="out">{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "MAINTENANCE",
  "note": null
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/devices/dev_1/issues \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Accept-Language: en' \\
  --json '{"title":"x","severity":"URGENT","reporter":"usr_2"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Invalid request body",
  "status": 400,
  "detail": "3 problem(s) in the body",
  "instance": "/devices/dev_1/issues",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/title",
      "detail": "Too small: expected string to have &gt;=3 characters"
    },
    {
      "pointer": "#/severity",
      "detail": "Invalid option: expected one of \\"LOW\\"|\\"MEDIUM\\"|\\"HIGH\\""
    },
    {
      "pointer": "#/reporter",
      "detail": "unknown field"
    }
  ]
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/devices/dev_9/issues \\
  -H 'Authorization: Bearer tok_an' \\
  --json '{}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/device-not-found",
  "title": "Không tìm thấy thiết bị",
  "status": 404,
  "detail": "Không có thiết bị dev_9",
  "instance": "/devices/dev_9/issues",
  "code": "DEVICE_NOT_FOUND"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/devices/dev_1/issues \\
  -H 'Authorization: Bearer tok_bin' \\
  --json '{"title":"cong CONSOLE khong len den","severity":"LOW"}'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/duplicate-issue",
  "title": "Báo hỏng bị trùng",
  "status": 409,
  "detail": "Thiết bị đã có báo hỏng đang mở iss_1 cùng tiêu đề",
  "instance": "/devices/dev_1/issues",
  "code": "DUPLICATE_ISSUE",
  "existing": "iss_1"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/devices/dev_1/issues \\
  -H 'Authorization: Bearer tok_an' \\
  -H 'Content-Type: text/plain' \\
  -d 'hỏng rồi'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/unsupported-media-type",
  "title": "Kiểu nội dung không được hỗ trợ",
  "status": 415,
  "detail": "Chỉ nhận JSON, nhận text/plain",
  "instance": "/devices/dev_1/issues",
  "code": "UNSUPPORTED_MEDIA_TYPE"
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?status=OPEN&amp;severity=HIGH'</code></pre>
<div class="out">{
  "data": [
    {
      "id": "iss_1",
      "deviceId": "dev_1",
      "reportedBy": "usr_1",
      "title": "Cổng console không lên đèn",
      "severity": "HIGH",
      "description": null,
      "status": "OPEN",
      "createdAt": "2026-10-31T17:46:03.341Z",
      "resolvedAt": null,
      "resolution": null
    }
  ]
}</div>
<pre><code class="language-bash">curl -s 'http://localhost:4000/issues?status=open' -H 'Accept-Language: en'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/invalid-query",
  "title": "Invalid query parameters",
  "status": 400,
  "detail": "1 problem(s) in the query",
  "instance": "/issues?status=open",
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "status",
      "detail": "Invalid option: expected one of \\"OPEN\\"|\\"RESOLVED\\""
    }
  ]
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/forbidden",
  "title": "Không đủ quyền",
  "status": 403,
  "detail": "Chỉ LAB_MANAGER được làm việc này",
  "instance": "/issues/iss_1/resolve",
  "code": "FORBIDDEN"
}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_lan' \\
  --json '{"resolution":"Thay cáp console mới"}'</code></pre>
<div class="out">{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "description": null,
  "status": "RESOLVED",
  "createdAt": "2026-10-31T17:46:03.341Z",
  "resolvedAt": "2026-10-31T17:46:03.473Z",
  "resolution": "Thay cáp console mới"
}</div>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/issues/iss_1/resolve \\
  -H 'Authorization: Bearer tok_lan' \\
  -H 'Accept-Language: en'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Content-Language: en
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 235
ETag: W/"eb-JSdV17CVwzEKGwTfc9NRf2OE99w"
Date: Sat, 31 Oct 2026 17:46:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "type": "https://labflow.example/problems/already-resolved",
  "title": "Issue already resolved",
  "status": 409,
  "detail": "Issue iss_1 is already resolved",
  "instance": "/issues/iss_1/resolve",
  "code": "ALREADY_RESOLVED"
}</div>
<pre><code class="language-bash">curl -s -D - -o /dev/null -X DELETE http://localhost:4000/issues/iss_1</code></pre>
<div class="out">HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 266
ETag: W/"10a-oTGg3iJJsF43idxSEgMWZ+3RANI"
Date: Sat, 31 Oct 2026 17:46:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5</div>
<p>Những điều cần để ý: bước 3 liệt kê cả ba lỗi trong một câu trả lời; bước 4 cho thấy phép kiểm thiết bị cha thắng; bước 5 bắt được tiêu đề gõ không dấu và khác hoa thường; câu trả lời thứ ba ở bước 8 là tiếng Anh vì chỉ request đó xin tiếng Anh.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.6 Quiz (bài MỚI) ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 check: errors, validation and responses|||2.6 — Kiểm tra Chương 2: lỗi, kiểm dữ liệu và phản hồi',
      slug: 'api-2-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên LabFlow về RFC 9457, thứ tự kiểm dữ liệu, mass assignment, ép kiểu, view, envelope luôn 200, Accept-Language và NFC/NFD; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Chapter 2 check: errors, validation and responses</h2>
<p class="lead">Ten situations from the LabFlow API, most of them measured in this chapter. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10; if you miss one, re-read the lesson it points to and re-run its commands.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can write a problem document by hand and say what each of type, title, status, detail and instance is for.</li>
  <li>I can explain why errors carry a code and parameters, and where the sentence is built.</li>
  <li>I can put each check in its layer: door (415/413), shape (400), rule (422/409).</li>
  <li>I know what strict objects block, and two coercion traps.</li>
  <li>I can explain allow-list views, null-versus-absent, and why lists are wrapped.</li>
  <li>I can negotiate the language, and I know why “Phòng” is not always equal to “Phòng”.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Kiểm tra Chương 2: lỗi, kiểm dữ liệu và phản hồi</h2>
<p class="lead">Mười tình huống từ LabFlow API, phần lớn đã được đo trong chương này. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10; sai câu nào thì đọc lại bài mà câu đó chỉ tới và chạy lại các lệnh của bài.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi tự viết được một tài liệu problem và nói được type, title, status, detail, instance dùng để làm gì.</li>
  <li>Tôi giải thích được vì sao lỗi mang mã và tham số, và câu chữ được dựng ở đâu.</li>
  <li>Tôi đặt được mỗi phép kiểm vào đúng tầng: cửa (415/413), hình dạng (400), luật (422/409).</li>
  <li>Tôi biết object strict chặn được gì, và hai cái bẫy của ép kiểu.</li>
  <li>Tôi giải thích được view dạng danh sách cho phép, chuyện null hay vắng mặt, và vì sao danh sách được bọc.</li>
  <li>Tôi thương lượng được ngôn ngữ, và biết vì sao "Phòng" không phải lúc nào cũng bằng "Phòng".</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "A client sends a 200 KB booking body to LabFlow at the end of Chapter 1. Express’s JSON limit is 100 KB. What did the client receive, and why?|||Một client gửi body đặt phòng 200 KB tới LabFlow cuối Chương 1. Giới hạn JSON của Express là 100 KB. Client nhận được gì, và vì sao?",
            options: [
              "413, because express.json() refuses the body before any route runs|||413, vì express.json() từ chối body trước khi route nào chạy",
              "500 INTERNAL, because the error handler only recognised entity.parse.failed and the 413 fell through|||500 INTERNAL, vì bộ xử lý lỗi chỉ nhận ra entity.parse.failed nên lỗi 413 rơi xuống nhánh cuối",
              "400 MALFORMED_JSON, because a body that is too large cannot be parsed|||400 MALFORMED_JSON, vì body quá lớn thì không phân tích được",
              "201 Created, because Express truncates the body to 100 KB and continues|||201 Created, vì Express cắt body còn 100 KB rồi chạy tiếp",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: We measured it: the server log showed PayloadTooLargeError with type 'entity.too.large' and limit 102400, but the hand-made handler only knew 'entity.parse.failed', so the client got 500 INTERNAL — told to retry something that fails forever (lesson 2.1). 413 is what Express meant, and what LabFlow answers after the fix; Express never truncates a body.|||VI: Ta đã đo: log server có PayloadTooLargeError với type 'entity.too.large' và limit 102400, nhưng bộ xử lý tự chế chỉ biết 'entity.parse.failed', nên client nhận 500 INTERNAL — bị bảo thử lại một thứ hỏng mãi mãi (bài 2.1). 413 là ý của Express, và là câu LabFlow trả sau khi sửa; Express không bao giờ cắt bớt body.",
          },
          {
            question: "Which pair of RFC 9457 members should a dashboard use to group errors, and which should a person read to understand one occurrence?|||Cặp trường nào của RFC 9457 nên dùng để dashboard gom nhóm lỗi, và trường nào để người đọc hiểu một lần xảy ra?",
            options: [
              "Group by detail; read title|||Gom theo detail; đọc title",
              "Group by instance; read status|||Gom theo instance; đọc status",
              "Group by status; read type|||Gom theo status; đọc type",
              "Group by type (or title); read detail|||Gom theo type (hoặc title); đọc detail",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: type identifies the kind of problem and title must not change between occurrences (except for language), so they group well; detail explains this occurrence (“Phòng đã có lượt bk_1…”) and changes every time — grouping by it gives a thousand groups (lesson 2.1). instance identifies one occurrence, the opposite of a group.|||VI: type định danh loại lỗi và title không được đổi giữa các lần (trừ khi dịch), nên gom nhóm tốt; detail giải thích lần này (\"Phòng đã có lượt bk_1…\") và lần nào cũng khác — gom theo nó ra cả nghìn nhóm (bài 2.1). instance định danh một lần xảy ra, ngược hẳn với một nhóm.",
          },
          {
            question: "A client written in 2025 receives a LabFlow problem with an extension member conflictWith that it has never heard of. What does RFC 9457 require?|||Một client viết năm 2025 nhận được problem của LabFlow có trường mở rộng conflictWith mà nó chưa từng biết. RFC 9457 yêu cầu gì?",
            options: [
              "The client MUST ignore extension members it does not recognise|||Client PHẢI bỏ qua trường mở rộng mà nó không nhận ra",
              "The client must reject the whole response as invalid|||Client phải từ chối cả response vì không hợp lệ",
              "The server must not send members the client did not ask for|||Server không được gửi trường mà client không yêu cầu",
              "The client must dereference the type URI to learn the new member|||Client phải mở URI của type để học trường mới",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: RFC 9457 §3.2: clients MUST ignore extensions they don’t recognise — the rule that makes adding members safe (lesson 2.1). The RFC also says consumers SHOULD NOT automatically dereference the type URI, so the last option is doubly wrong.|||VI: RFC 9457 §3.2: client PHẢI bỏ qua trường mở rộng không nhận ra — chính luật làm cho việc thêm trường trở nên an toàn (bài 2.1). RFC còn nói client KHÔNG NÊN tự động mở URI của type, nên phương án cuối sai hai lần.",
          },
          {
            question: "PATCH /devices/dev_1 with {\"name\": 123, \"isAdmin\": true} returns 200 on Chapter 1 code and stores both. Which single change in lesson 2.2 blocks both problems?|||PATCH /devices/dev_1 với {\"name\": 123, \"isAdmin\": true} trả 200 trên code Chương 1 và lưu cả hai. Thay đổi nào ở bài 2.2 chặn được cả hai vấn đề?",
            options: [
              "Adding a database UNIQUE constraint on serial_no|||Thêm ràng buộc UNIQUE trên serial_no trong CSDL",
              "Checking typeof name in the PATCH handler|||Kiểm typeof name trong handler PATCH",
              "A strict Zod schema at the edge: name must be a string, unknown members are refused|||Một schema Zod strict ở cửa: name phải là chuỗi, trường lạ bị từ chối",
              "Lowering express.json’s limit to 10 KB|||Hạ giới hạn của express.json xuống 10 KB",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: z.strictObject with name: text(1, 100) gives two errors in one 400: #/name (expected string) and #/isAdmin (unknown field) — wrong type and mass assignment closed at once (lesson 2.2). A typeof check fixes only one of the two and only in one handler; the size limit and the UNIQUE constraint solve other problems.|||VI: z.strictObject với name: text(1, 100) cho hai lỗi trong một response 400: #/name (mong đợi chuỗi) và #/isAdmin (trường lạ) — sai kiểu và mass assignment bị chặn cùng lúc (bài 2.2). Kiểm typeof chỉ sửa một trong hai và chỉ trong một handler; giới hạn kích thước và UNIQUE giải những vấn đề khác.",
          },
          {
            question: "In which order does LabFlow’s POST /bookings check a request after Chapter 2?|||Sau Chương 2, POST /bookings của LabFlow kiểm một request theo thứ tự nào?",
            options: [
              "Media type (415) and size (413) → authentication (401) → shape (400, every field) → meaning (422) → state (409)|||Media type (415) và kích thước (413) → xác thực (401) → hình dạng (400, mọi trường) → ý nghĩa (422) → trạng thái (409)",
              "Authentication (401) → state (409) → shape (400) → meaning (422) → media type (415)|||Xác thực (401) → trạng thái (409) → hình dạng (400) → ý nghĩa (422) → media type (415)",
              "Shape (400) → media type (415) → authentication (401) → state (409) → meaning (422)|||Hình dạng (400) → media type (415) → xác thực (401) → trạng thái (409) → ý nghĩa (422)",
              "Meaning (422) → shape (400) → state (409) — media type is not checked|||Ý nghĩa (422) → hình dạng (400) → trạng thái (409) — media type không được kiểm",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The 415 middleware and express.json’s limit run in app.js before any router; requireAuth guards the bookings router; validate('body', BookingCreate) runs before the handler; inside the handler come 422 (time range, unknown lab) and then 409 (overlap) (lessons 2.1–2.2). Cheap checks without data first, checks against data last.|||VI: Middleware 415 và giới hạn của express.json chạy trong app.js trước mọi router; requireAuth canh router bookings; validate('body', BookingCreate) chạy trước handler; trong handler mới tới 422 (khoảng giờ, phòng không có) rồi 409 (trùng giờ) (bài 2.1–2.2). Phép kiểm rẻ, không cần dữ liệu đi trước; phép kiểm cần tra dữ liệu đi sau.",
          },
          {
            question: "GET /labs?onlyAvailable=false is validated with z.coerce.boolean(). Measured with Zod 4.6.7, what does the handler receive?|||GET /labs?onlyAvailable=false được kiểm bằng z.coerce.boolean(). Đo với Zod 4.6.7, handler nhận được gì?",
            options: [
              "false, because Zod reads the word “false”|||false, vì Zod đọc được chữ \"false\"",
              "a 400 error, because \"false\" is not a boolean|||lỗi 400, vì \"false\" không phải boolean",
              "the string \"false\", because coercion only works on numbers|||chuỗi \"false\", vì ép kiểu chỉ áp dụng cho số",
              "true, because any non-empty string is truthy — use z.stringbool() instead|||true, vì chuỗi không rỗng nào cũng là truthy — hãy dùng z.stringbool()",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Coercion uses JavaScript’s Boolean(): Boolean(\"false\") is true. We measured z.coerce.boolean().parse('false') → true and z.stringbool().parse('false') → false (lesson 2.2). The tempting first option is exactly the bug: the filter silently does the opposite.|||VI: Ép kiểu dùng Boolean() của JavaScript: Boolean(\"false\") là true. Ta đã đo z.coerce.boolean().parse('false') → true và z.stringbool().parse('false') → false (bài 2.2). Phương án đầu hấp dẫn chính là bug: bộ lọc lặng lẽ làm điều ngược lại.",
          },
          {
            question: "GET /me first returned res.json(req.user) and leaked passwordHash. Why does LabFlow fix it with toMe(u) listing four members rather than delete user.passwordHash?|||GET /me ban đầu trả res.json(req.user) và làm lộ passwordHash. Vì sao LabFlow sửa bằng toMe(u) liệt kê bốn trường thay vì delete user.passwordHash?",
            options: [
              "delete is slower than building a new object|||delete chậm hơn dựng object mới",
              "An allow-list fails closed: a field added to the record later stays hidden until someone adds it to the view on purpose|||Danh sách cho phép hỏng theo kiểu đóng cửa: trường thêm vào bản ghi về sau vẫn bị giấu cho tới khi có người cố ý thêm vào view",
              "delete would remove the hash from the database too|||delete sẽ xoá luôn mã băm trong cơ sở dữ liệu",
              "Express refuses to send objects that contain a property called passwordHash|||Express từ chối gửi object có thuộc tính tên passwordHash",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: A deny-list fails open — next month someone adds resetToken and it is published the same day; an allow-list publishes only what it names (lesson 2.3). Option C is half-true in this in-memory demo (delete mutates the shared record), but the design reason is fail-closed; Express sends any object.|||VI: Danh sách cấm hỏng theo kiểu mở cửa — tháng sau có người thêm resetToken và nó bị công bố ngay; danh sách cho phép chỉ công bố thứ nó gọi tên (bài 2.3). Phương án C đúng một nửa trong bản demo lưu RAM này (delete sửa thẳng bản ghi dùng chung), nhưng lý do thiết kế là hỏng-đóng-cửa; Express gửi object nào cũng được.",
          },
          {
            question: "A teammate proposes {\"success\": false, \"code\": 404, \"data\": null} with HTTP 200 for every error. What did fetch report in lesson 2.3’s measurement?|||Một bạn đề xuất trả {\"success\": false, \"code\": 404, \"data\": null} với HTTP 200 cho mọi lỗi. Trong phép đo ở bài 2.3, fetch báo gì?",
            options: [
              "res.ok = false, because fetch reads the code member|||res.ok = false, vì fetch đọc trường code",
              "A network error, because the body contradicts the status|||Một lỗi mạng, vì body mâu thuẫn với mã trạng thái",
              "res.ok = true — so the app showed “Thành công!”, and caches, retries and monitoring would also treat it as success|||res.ok = true — nên app hiện \"Thành công!\", và cache, thử lại, giám sát cũng coi đó là thành công",
              "res.status = 404, because Express rewrites the status from the body|||res.status = 404, vì Express viết lại mã trạng thái theo body",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: client200.mjs printed “status 200 | res.ok = true | app hiện: Thành công!” for the envelope API and 404/false for LabFlow (lesson 2.3). Generic tools read the status line only; Express never rewrites it from the body. If a team keeps an envelope, the status must stay truthful.|||VI: client200.mjs in ra \"status 200 | res.ok = true | app hiện: Thành công!\" với API envelope và 404/false với LabFlow (bài 2.3). Công cụ dùng chung chỉ đọc dòng trạng thái; Express không bao giờ viết lại nó theo body. Nếu nhóm giữ envelope, mã trạng thái vẫn phải trung thực.",
          },
          {
            question: "With Accept-Language: en, which members of LabFlow’s 404 problem change compared with the Vietnamese answer?|||Với Accept-Language: en, những trường nào trong problem 404 của LabFlow thay đổi so với câu trả lời tiếng Việt?",
            options: [
              "Only title and detail (plus Content-Language and Content-Length in the headers)|||Chỉ title và detail (cộng Content-Language và Content-Length ở header)",
              "title, detail and code — the code becomes English too|||title, detail và code — mã cũng thành tiếng Anh",
              "Every member, including type and instance|||Mọi trường, kể cả type và instance",
              "Nothing — Accept-Language only affects HTML pages|||Không gì cả — Accept-Language chỉ ảnh hưởng trang HTML",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The measured pair: “Không tìm thấy phòng lab / Không có phòng lab lab_9” became “Lab not found / There is no lab lab_9”; type, status, instance and code stayed identical; Content-Length dropped from 222 to 200 bytes because Vietnamese letters take more bytes in UTF-8 (lesson 2.4). Codes are identifiers and are never translated.|||VI: Cặp đã đo: \"Không tìm thấy phòng lab / Không có phòng lab lab_9\" thành \"Lab not found / There is no lab lab_9\"; type, status, instance và code giữ nguyên; Content-Length giảm từ 222 xuống 200 byte vì chữ tiếng Việt tốn nhiều byte hơn trong UTF-8 (bài 2.4). Mã là định danh và không bao giờ được dịch.",
          },
          {
            question: "A student pastes “Phòng” from a PDF into LabFlow’s search and the Chapter 1 code finds nothing, although the lab exists. What is the cause and the fix?|||Một sinh viên dán chữ \"Phòng\" từ PDF vào ô tìm kiếm và code Chương 1 không tìm thấy gì, dù phòng có tồn tại. Nguyên nhân và cách sửa?",
            options: [
              "The PDF used a different font; strip formatting in the front-end|||PDF dùng phông khác; bỏ định dạng ở front-end",
              "The pasted text is NFD (o + combining accent); normalise to NFC at the edge, and fold accents for search|||Chữ dán vào ở dạng NFD (o + dấu rời); chuẩn hoá về NFC ở cửa, và gấp dấu khi tìm kiếm",
              "JavaScript strings cannot hold Vietnamese; store names in English|||Chuỗi JavaScript không chứa được tiếng Việt; lưu tên bằng tiếng Anh",
              "The query string must be sent in Base64|||Query string phải được gửi bằng Base64",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Measured: 'Phòng' NFC has length 5, NFD length 6, they are not ===, and includes() fails until both are NFC (lesson 2.4). LabFlow’s text() helper normalises every input to NFC, and the q search folds both sides — with đ/Đ replaced by hand, since Đ has no decomposition. Fonts are a display matter; the bytes differ.|||VI: Đo được: 'Phòng' dạng NFC dài 5, dạng NFD dài 6, chúng không ===, và includes() thất bại cho tới khi cả hai về NFC (bài 2.4). Hàm text() của LabFlow chuẩn hoá mọi đầu vào về NFC, và tìm kiếm q gấp cả hai phía — thay đ/Đ bằng tay, vì Đ không tách được. Phông chữ là chuyện hiển thị; còn ở đây byte khác nhau.",
          },
        ],
      },
    },
  ],
};
