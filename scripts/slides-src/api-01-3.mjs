/**
 * api-01-3 — API Design · Chapter 1 · Lesson 1.3 "Status codes that mean something" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s01-tai-nguyen.mjs › api-1-3-status. Output = chạy thật LabFlow (Node 22.23.3, Express 5.3.0).
 * Nghĩa từng mã theo RFC 9110 §15 (2022).
 */
import { lamDeck, sql, http, two, box, steps, cards, c, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 1 — Resources and methods', bai: '1.3' };

/* Cây quyết định chọn mã 4xx. */
const cay = () => {
  const q = [['Could you even read the request?', 'bad JSON, missing / wrong-type field', '400', '#b85a2b'],
    ['Do we know who is calling?', 'no / bad token', '401', '#b85a2b'],
    ['Is this caller allowed to do this?', 'logged in, wrong role or owner', '403', '#b85a2b'],
    ['Does the URL point to something?', 'no such id · gone for good → 410', '404', '#b85a2b'],
    ['Is the method allowed on that URL?', 'DELETE on a read-only lab', '405', '#b85a2b'],
    ['Does it make business sense?', 'end before start, unknown lab id', '422', '#c0392b'],
    ['Does it clash with the current state?', 'slot taken, already cancelled', '409', '#c0392b']];
  let s = `<svg viewBox="0 0 1110 450" width="1110" height="450" font-family="Arial">`;
  q.forEach(([t, d, code, m], i) => {
    const y = 6 + i * 63;
    s += `<rect x="0" y="${y}" width="900" height="54" rx="9" fill="#fff7ef" stroke="#e3c9ae" stroke-width="2"/>`;
    s += `<text x="16" y="${y + 24}" font-size="21" font-weight="800" fill="#262626">${i + 1}. ${t}</text>`;
    s += `<text x="16" y="${y + 46}" font-size="17" fill="#666">${d}</text>`;
    s += `<line x1="900" y1="${y + 27}" x2="950" y2="${y + 27}" stroke="${m}" stroke-width="3"/>`;
    s += `<rect x="952" y="${y + 4}" width="150" height="46" rx="9" fill="${m}"/><text x="1027" y="${y + 36}" text-anchor="middle" font-size="26" font-weight="800" fill="#fff">${code}</text>`;
  });
  return s + '</svg>';
};

export const deck = { key: 'api-01-3', code: 'API 1.3', title: 'Status codes that mean something', sub: '201, 204, 400/422, 401/403, 404/410, 409, 5xx' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Status codes that<br>mean something', sub: 'Three digits that tell the client what happened —<br>every one shown on the real LabFlow API.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Success that says <b>what</b> happened: <b>200</b>, <b>201 + Location</b>, <b>204</b></li>
<li>Three pairs everyone mixes up: <b>400 vs 422</b> · <b>401 vs 403</b> · <b>404 vs 410</b></li>
<li><b>409 Conflict</b> — the double-booking code</li>
<li>5xx: what the client should and should not see</li>
<li>A checklist to pick a code in ten seconds</li>
</ul>` },

  { t: 'Everyday example: answers at the lab office', body: `
<table class="t lon">
<tr><th>What the lab office says</th><th style="width:250px">HTTP says</th></tr>
<tr><td>“Booked. Here is your slip, number bk_1.”</td><td><b>201 Created</b> + Location</td></tr>
<tr><td>“I can’t read this form — half of it is empty.”</td><td><b>400 Bad Request</b></td></tr>
<tr><td>“Who are you? Show me your student card.”</td><td><b>401 Unauthorized</b></td></tr>
<tr><td>“I know you, but only lab managers may do that.”</td><td><b>403 Forbidden</b></td></tr>
<tr><td>“We have no room called AL-999.” / “That room was closed for good.”</td><td><b>404</b> / <b>410 Gone</b></td></tr>
<tr><td>“Your form is filled, but it ends before it starts.”</td><td><b>422 Unprocessable</b></td></tr>
<tr><td>“Someone already has that room at 9:00.”</td><td><b>409 Conflict</b></td></tr>
</table>` },

  { t: 'Pick a 4xx in ten seconds: ask in this order', body: cay() },

  { t: '201 Created — and where to find it', body: two(http(`$ curl -i -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"SWT301 Lab 3"}'
HTTP/1.1 201 Created
Location: /bookings/bk_1
Content-Type: application/json; charset=utf-8
Content-Length: 234
…

{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  …
  "status": "PENDING",
  "createdAt": "2026-10-31T15:43:26.161Z"
}`, { sm: true, wrap: true }), `
<ul style="font-size:21px">
<li><b>201</b> = “a new resource now exists” — not just “OK”</li>
<li><code class="i">Location</code> = its URL; the client can GET it later</li>
<li>Returning the created body saves a round trip</li>
</ul>
${sql(`res.status(201)
   .location(\`/bookings/\${booking.id}\`)
   .json(booking);`, { lang: 'javascript' })}
${box('200 vs 204', '<b>200</b>: success with a body (cancel returns the booking). <b>204</b>: success, nothing to send (DELETE).', 'lam')}`, 'r64') },

  { t: '400 Bad Request: the request itself is broken', body: two(http(`$ curl -i -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId": "lab_1",}'
HTTP/1.1 400 Bad Request
…

{
  "error": "MALFORMED_JSON",
  "message": "Body không phải JSON hợp lệ"
}`, { sm: true }) + `<p class="nho" style="margin:6px 0 0">The trailing comma makes it invalid JSON — <code class="i">express.json()</code> throws before our handler runs.</p>`,
  http(`$ curl -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_1","startAt":"02/11/2026 8:00"}'
{
  "error": "VALIDATION_FAILED",
  "message": "Dữ liệu gửi lên chưa đúng định dạng",
  "details": [
    {
      "field": "startAt",
      "issue": "must be ISO 8601 with timezone"
    },
    {
      "field": "endAt",
      "issue": "must be ISO 8601 with timezone"
    }
  ]
}`, { sm: true }) + `<p class="nho" style="margin:6px 0 0">Readable JSON, wrong <b>shape</b>: a field missing, a date in the wrong format. <code class="i">details</code> lists <b>every</b> problem at once.</p>`) },

  { giua: true, to: true,  t: '422: well-formed, but it makes no sense', body: two(http(`$ curl -i -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_1","startAt":"2026-11-02T10:00:00+07:00","endAt":"2026-11-02T08:00:00+07:00"}'
HTTP/1.1 422 Unprocessable Entity
…

{
  "error": "INVALID_TIME_RANGE",
  "message": "endAt phải sau startAt"
}`, { sm: true, wrap: true }), `
<table class="t" style="font-size:20px">
<tr><th style="width:90px">Code</th><th>LabFlow rule</th></tr>
<tr><td><b>400</b></td><td>can’t parse it, or a field is missing / wrong type / wrong format</td></tr>
<tr><td><b>422</b></td><td>shape is right, <b>meaning</b> is wrong: end ≤ start, <code class="i">labId</code> that does not exist</td></tr>
</table>
${box('Not every API splits them', 'Many use 400 for both — fine, if it is written down and <b>consistent</b>. The split helps clients: 400 = fix your code, 422 = show the user a message.', 'lam')}
<p class="nho" style="margin:6px 0 0">RFC 9110 names 422 “Unprocessable <b>Content</b>”; Node still prints the older phrase “Entity”. The number is what counts.</p>`, 'r46') },

  { t: '401 vs 403: who are you vs what may you do', body: two(http(`$ curl -i http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_sai'
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
…

{
  "error": "UNAUTHENTICATED",
  "message": "Cần đăng nhập (thiếu hoặc sai token)"
}`, { sm: true }) + box('401', 'We do <b>not know who you are</b> (no token, wrong token, expired). <code class="i">WWW-Authenticate</code> tells how to log in. Despite its name, it means <b>unauthenticated</b>.', 'lam'),
  http(`$ curl -i http://localhost:4000/bookings/bk_1 \\
    -H 'Authorization: Bearer tok_bin'
HTTP/1.1 403 Forbidden
…

{
  "error": "FORBIDDEN",
  "message": "Đây không phải lượt đặt của bạn"
}`, { sm: true }) + box('403', 'We <b>know</b> you (Bình), but you may not do this (read An’s booking). Logging in again will not help.', '')) },

  { t: '404 vs 410: not here, or gone for good', body: two(http(`$ curl -i http://localhost:4000/bookings/bk_99 \\
    -H 'Authorization: Bearer tok_an'
HTTP/1.1 404 Not Found
…

{
  "error": "BOOKING_NOT_FOUND",
  "message": "Không có lượt đặt bk_99"
}`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px"><b>404</b>: nothing at this URL (maybe never existed, maybe a typo).</p>`,
  http(`$ curl -i http://localhost:4000/labs/lab_4
HTTP/1.1 410 Gone
…

{
  "error": "LAB_RETIRED",
  "message": "Phòng lab lab_4 đã ngừng sử dụng từ 2026-09-01T00:00:00.000Z"
}`, { sm: true, wrap: true }) + `<p style="margin:6px 0 0;font-size:20px"><b>410</b>: it existed and was <b>removed on purpose</b> — clients may delete their bookmarks.</p>`) +
  box('403 or 404 for “not yours”?', 'Saying 403 confirms <code class="i">bk_1</code> <b>exists</b>. Many APIs answer <b>404</b> to strangers so ids cannot be probed. LabFlow keeps 403 for now; Chapter 6 (BOLA) revisits the choice.', 'do2') },

  { t: '409 Conflict: the double-booking code', body: two(http(`$ curl -i -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_bin' \\
    --json '{"labId":"lab_1","startAt":"2026-11-02T09:00:00+07:00","endAt":"2026-11-02T11:00:00+07:00"}'
HTTP/1.1 409 Conflict
…

{
  "error": "BOOKING_CONFLICT",
  "message": "Phòng đã có lượt bk_1 trong khung giờ này"
}
$ curl -X POST …/bookings/bk_1/cancel …   # An cancels
$ …Bình sends the same booking again…
{
  "id": "bk_2",
  "labId": "lab_1",
  "userId": "usr_2",
  …
  "status": "PENDING",
  …`, { sm: true, wrap: true }), `
<ul style="font-size:21px">
<li>Bình’s 9–11h overlaps An’s 8–10h → <b>409</b>: valid request, but it <b>conflicts with the current state</b></li>
<li>Same request later, after An cancels → <b>201</b>. That is the mark of 409: the <b>state</b> decides, not the input</li>
<li>Cancelling twice → also 409 (<code class="i">ALREADY_CANCELLED</code>)</li>
</ul>
${box('409 vs 422', '422: wrong whatever the state (end before start). 409: fine in another moment.', 'lam')}`, 'r64') },

  { t: '5xx: our fault — say so, but say little', body: two(http(`$ curl -i http://localhost:4000/debug/boom
HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8
…

{
  "error": "INTERNAL",
  "message": "Máy chủ gặp lỗi, thử lại sau"
}`, { sm: true, title: 'client sees (our handler)' }) + http(`TypeError: Cannot read properties of undefined (reading 'length')
    at file:///…/src/app.js:20:26
    …`, { sm: true, title: 'terminal 1 (server log) — the details stay here' }),
  `<ul style="font-size:21px">
<li><b>500</b>: a bug or an unexpected failure. Log everything on the server; tell the client <b>nothing internal</b></li>
<li>Express’s <b>default</b> handler in development prints the full stack trace — file paths included — <b>into the response</b></li>
<li><b>503</b> + <code class="i">Retry-After</code>: “overloaded / maintenance, come back later” (Chapter 8)</li>
<li>Never send <b>4xx for your own bug</b>, or 5xx for the client’s mistake — monitoring counts them separately</li>
</ul>`, 'r46') + `<p class="nho" style="margin:6px 0 0"><code class="i">/debug/boom</code> is a temporary route added only for this demo, then deleted.</p>` },

  { t: 'One error handler maps them all', body: sql(`// http.js — một chỗ duy nhất tạo lỗi
export class HttpError extends Error {
  constructor(status, error, message, details) {
    super(message);
    this.status = status; this.error = error; this.details = details;
  }
}
// app.js — after every route
app.use((err, req, res, next) => {
  if (err instanceof HttpError)
    return res.status(err.status).json({
      error: err.error, message: err.message, ...(err.details && { details: err.details }),
    });
  if (err.type === 'entity.parse.failed')     // thrown by express.json()
    return res.status(400).json({ error: 'MALFORMED_JSON', message: 'Body không phải JSON hợp lệ' });
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: 'Máy chủ gặp lỗi, thử lại sau' });
});`, { lang: 'javascript', sm: true, hl: [9, 10, 13, 14, 16] }) + `<p style="margin:6px 0 0;font-size:20px">Routes just <code class="i">throw new HttpError(409, 'BOOKING_CONFLICT', '…')</code>. One place decides the <b>shape</b>; Chapter 2 upgrades it to RFC 9457.</p>` },

  { t: 'Trap: 200 for everything', body: vsd(http(`$ curl -i -X POST http://localhost:4003/bookings --json '{"startAt":"2026-11-02T10:00:00+07:00","endAt":"2026-11-02T08:00:00+07:00"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
…

{"success":false,"error":"endAt must be after startAt"}`, { sm: true, wrap: true }) + `<ul style="font-size:20px;margin-top:8px">
<li>the front-end’s <code class="i">if (res.ok)</code> says <b>success</b></li>
<li>caches and monitoring count it as a good response</li>
<li>every client must parse the body to know what happened</li></ul>`,
  http(`$ curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' --json '{"labId":"lab_1","startAt":"2026-11-02T10:00:00+07:00","endAt":"2026-11-02T08:00:00+07:00"}'
HTTP/1.1 422 Unprocessable Entity
…

{
  "error": "INVALID_TIME_RANGE",
  "message": "endAt phải sau startAt"
}`, { sm: true, wrap: true }) + `<ul style="font-size:20px;margin-top:8px">
<li><code class="i">res.ok</code> is false — the error path runs</li>
<li>dashboards can graph 4xx vs 5xx</li>
<li>the body adds detail; the code already told the story</li></ul>`, '✗ bad200.mjs — every answer is 200', '✓ LabFlow') },

  { t: 'Quick reference: the codes LabFlow uses', body: `
<table class="t" style="font-size:19px;line-height:1.25">
<tr><th style="width:120px">Code</th><th style="width:290px">Name</th><th>LabFlow example</th></tr>
<tr><td style="color:#1f7a45"><b>200</b></td><td>OK</td><td>GET a lab · cancel returns the booking</td></tr>
<tr><td style="color:#1f7a45"><b>201</b></td><td>Created</td><td>POST /bookings, POST /devices (+ Location)</td></tr>
<tr><td style="color:#1f7a45"><b>204</b></td><td>No Content</td><td>DELETE /devices/{id} · OPTIONS</td></tr>
<tr><td style="color:#b85a2b"><b>400</b></td><td>Bad Request</td><td>bad JSON · missing field · wrong date format</td></tr>
<tr><td style="color:#b85a2b"><b>401</b></td><td>Unauthorized</td><td>no / wrong token (+ WWW-Authenticate)</td></tr>
<tr><td style="color:#b85a2b"><b>403</b></td><td>Forbidden</td><td>student deletes a device · reads someone else’s booking</td></tr>
<tr><td style="color:#b85a2b"><b>404</b> / <b>410</b></td><td>Not Found / Gone</td><td>no lab_9 · lab_4 retired</td></tr>
<tr><td style="color:#b85a2b"><b>405</b></td><td>Method Not Allowed</td><td>DELETE /labs/lab_1 (+ Allow)</td></tr>
<tr><td style="color:#b85a2b"><b>409</b></td><td>Conflict</td><td>overlapping booking · cancel twice</td></tr>
<tr><td style="color:#b85a2b"><b>415</b> / <b>422</b></td><td style="white-space:nowrap">Unsupported Media · Unprocessable</td><td>PATCH as text/plain · end before start</td></tr>
<tr><td style="color:#c0392b"><b>500</b> / <b>503</b></td><td style="white-space:nowrap">Internal Error · Unavailable</td><td>our bug · overloaded (Ch 8)</td></tr>
</table>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>The status code is <b>part of the contract</b>; the body only adds detail</li>
<li>Created → <b>201 + Location</b>; nothing to say → <b>204</b></li>
<li><b>400</b> broken request · <b>422</b> nonsense content · <b>409</b> clashes with current state</li>
<li><b>401</b> who are you? · <b>403</b> not allowed · <b>404</b> not here · <b>410</b> gone for good</li>
<li><b>5xx</b> = our fault: log details on the server, send a short JSON message</li>
</ul>
${box('Next', 'Lesson 1.4 — naming, casing, dates, money and ids: the small choices that break clients.', 'xanh')}` },
]);
