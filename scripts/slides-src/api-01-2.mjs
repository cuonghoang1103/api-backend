/**
 * api-01-2 — API Design · Chapter 1 · Lesson 1.2 "Methods and their guarantees" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s01-tai-nguyen.mjs › api-1-2-phuong-thuc. Output = chạy thật LabFlow (Node 22.23.3, Express 5.3.0).
 * Định nghĩa safe/idempotent theo RFC 9110 §9.2.1–9.2.2; PATCH theo RFC 5789 + JSON Merge Patch RFC 7396.
 */
import { lamDeck, sql, http, two, box, steps, cards, c, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 1 — Resources and methods', bai: '1.2' };

/* Mất response: client có được gửi lại không? */
const matResponse = () => `<svg viewBox="0 0 1110 270" width="1110" height="270" font-family="Arial">
  <defs><marker id="m6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#404040"/></marker>
  <marker id="m7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c0392b"/></marker></defs>
  <line x1="150" y1="40" x2="150" y2="250" stroke="#336791" stroke-width="4"/><line x1="960" y1="40" x2="960" y2="250" stroke="#2f7d4f" stroke-width="4"/>
  <text x="150" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="#336791">📱 client</text><text x="960" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="#2f7d4f">🖥️ server</text>
  <line x1="152" y1="70" x2="952" y2="110" stroke="#404040" stroke-width="3" marker-end="url(#m6)"/>
  <text x="550" y="78" text-anchor="middle" font-size="19" font-weight="700" fill="#404040">① POST /devices  {…Arduino…}</text>
  <rect x="975" y="100" width="128" height="34" rx="6" fill="#f1f9f4" stroke="#2f7d4f"/><text x="1039" y="123" text-anchor="middle" font-size="17" fill="#1f6b40" font-weight="700">dev_4 saved ✓</text>
  <line x1="952" y1="140" x2="560" y2="160" stroke="#c0392b" stroke-width="3" stroke-dasharray="8 6"/>
  <text x="520" y="172" text-anchor="middle" font-size="32">💥</text><text x="690" y="135" text-anchor="middle" font-size="18" fill="#c0392b" font-weight="700">201 lost (Wi-Fi drops)</text>
  <text x="300" y="185" text-anchor="middle" font-size="18" fill="#555">timeout… did it work?</text>
  <line x1="152" y1="205" x2="952" y2="235" stroke="#c0392b" stroke-width="3" marker-end="url(#m7)"/>
  <text x="550" y="212" text-anchor="middle" font-size="19" font-weight="700" fill="#c0392b">② retry: POST /devices  {…Arduino…}</text>
  <rect x="975" y="222" width="128" height="34" rx="6" fill="#fdf0ee" stroke="#c0392b"/><text x="1039" y="245" text-anchor="middle" font-size="17" fill="#a52a1d" font-weight="700">dev_5 = twin ✗</text>
</svg>`;

export const deck = { key: 'api-01-2', code: 'API 1.2', title: 'Methods and their guarantees', sub: 'Safe, idempotent, PUT vs PATCH, 405' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Methods and their<br>guarantees', sub: 'GET, POST, PUT, PATCH, DELETE —<br>and the two promises that decide what a client may retry.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Two promises a method can make: <b>safe</b> and <b>idempotent</b></li>
<li>Why they matter when the network <b>loses a response</b></li>
<li><b>POST</b> twice vs <b>PUT</b> twice vs <b>DELETE</b> twice — on the real LabFlow API</li>
<li><b>PUT</b> (replace everything) vs <b>PATCH</b> (change some fields, JSON Merge Patch)</li>
<li><b>HEAD</b>, <b>OPTIONS</b>, and <b>405 Method Not Allowed</b> with an <code class="i">Allow</code> header</li>
</ul>` },

  { t: 'Everyday example: buttons you press twice', to: true, body: `
<table class="t lon">
<tr><th>Action</th><th style="width:250px">Changes anything?</th><th style="width:300px">Pressing twice…</th></tr>
<tr><td>👀 Look at the lab timetable on the wall</td><td>no — <b>safe</b></td><td>same as once</td></tr>
<tr><td>🛗 Press the lift call button</td><td>yes</td><td>same as once — <b>idempotent</b></td></tr>
<tr><td>📝 “Set my seat to B12” on a form</td><td>yes</td><td>same as once — <b>idempotent</b></td></tr>
<tr><td>🥤 Put a coin in a vending machine</td><td>yes</td><td><b>two</b> drinks (and two coins)</td></tr>
</table>
${box('The question every client asks', '“My request timed out. If I send it <b>again</b>, can something bad happen?” The method’s promises answer it.', 'lam')}` },

  { giua: true, to: true, t: 'Two promises, defined by the HTTP standard', body: two(
    box('Safe', `<p style="margin:0">The client asks for <b>no change</b> on the server — read-only by meaning.</p><ul style="margin:6px 0 0"><li><b>GET, HEAD, OPTIONS</b></li><li>crawlers, prefetchers and caches may call them freely</li><li>the server may still write a log line — that is not a change the client asked for</li></ul>`, 'xanh'),
    box('Idempotent', `<p style="margin:0">Sending the request <b>N times</b> has the <b>same effect</b> on the server as sending it <b>once</b>.</p><ul style="margin:6px 0 0"><li>all safe methods + <b>PUT, DELETE</b></li><li>a client (or proxy) may <b>retry</b> it after a failure</li><li>same <b>effect</b> — not necessarily the same response</li></ul>`, 'lam')) +
    `<p class="nho" style="margin:10px 0 0">Source: RFC 9110 “HTTP Semantics”, §9.2.1 Safe Methods and §9.2.2 Idempotent Methods (2022).</p>` },

  { t: 'The method table to remember', body: `
<table class="t lon">
<tr><th style="width:140px">Method</th><th style="width:110px">Safe</th><th style="width:160px">Idempotent</th><th>Typical use in LabFlow</th><th style="width:190px">Success</th></tr>
<tr><td><b>GET</b></td><td>✅</td><td>✅</td><td>read a lab, list devices</td><td>200</td></tr>
<tr><td><b>HEAD</b></td><td>✅</td><td>✅</td><td>headers only (size, ETag)</td><td>200</td></tr>
<tr><td><b>OPTIONS</b></td><td>✅</td><td>✅</td><td>“which methods work here?”</td><td>204 + Allow</td></tr>
<tr><td><b>PUT</b></td><td>❌</td><td>✅</td><td>replace a whole device</td><td>200 (or 201)</td></tr>
<tr><td><b>DELETE</b></td><td>❌</td><td>✅</td><td>remove a device</td><td>204</td></tr>
<tr><td><b>POST</b></td><td>❌</td><td>❌</td><td>create a booking, cancel action</td><td>201 / 200</td></tr>
<tr><td><b>PATCH</b></td><td>❌</td><td>❌ (not promised)</td><td>change a few device fields</td><td>200</td></tr>
</table>` },

  { giua: true, to: true, t: 'Why it matters: the lost response', body: `${matResponse()}
<p style="margin:0;font-size:22px">The client cannot tell “request lost” from “response lost”. For <b>GET / PUT / DELETE</b> a retry is harmless. For <b>POST</b> a retry may create a <b>twin</b> — Chapter 5 fixes that with <b>idempotency keys</b>.</p>` },

  { t: 'POST twice = two devices', body: two(http(`$ curl -i -X POST http://localhost:4000/devices \\
    -H 'Authorization: Bearer tok_lan' \\
    --json '{"labId":"lab_2","name":"Arduino Uno R4","type":"BOARD","serialNo":"ARD-R4-0099","status":"AVAILABLE"}'
HTTP/1.1 201 Created
Location: /devices/dev_4
…
$ curl -X POST http://localhost:4000/devices …same command…
{
  "id": "dev_5",
  "labId": "lab_2",
  "name": "Arduino Uno R4",
  "type": "BOARD",
  "serialNo": "ARD-R4-0099",
  "status": "AVAILABLE"
}`, { sm: true, wrap: true }), `
<ul style="font-size:22px">
<li>Same body, two calls → <b>dev_4</b> and <b>dev_5</b>, identical twins</li>
<li>POST means “create <b>a new</b> member” — the server cannot know the second call was a retry</li>
<li>Nothing in the request says “this is the same Arduino”</li>
</ul>
${box('Lab 1 fixes part of it', 'Make <code class="i">serialNo</code> unique: the second call gets <b>409 Conflict</b>. A business rule — not a general cure.', 'lam')}`, 'r64') },

  { t: 'POST a booking twice: a rule saves us — this time', body: two(http(`$ curl -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"SWT301 Lab 3"}'
{
  "id": "bk_1",
  …
  "status": "PENDING",
  …
}
$ …same command again…
HTTP/1.1 409 Conflict
…

{
  "error": "BOOKING_CONFLICT",
  "message": "Phòng đã có lượt bk_1 trong khung giờ này"
}`, { sm: true, wrap: true }), `
<ul style="font-size:22px">
<li>The second booking would <b>overlap</b> the first, so the no-double-booking rule rejects it</li>
<li>But the client now sees an <b>error</b> for a booking that actually <b>succeeded</b></li>
<li>And for two different 1-hour slots in a row, nothing would catch a retry</li>
</ul>
${box('Takeaway', 'POST is <b>not idempotent</b>. Do not rely on luck; Chapter 5 makes retries safe on purpose.', 'do2')}`, 'r64') },

  { t: 'PUT twice = same state', body: two(http(`$ curl -X PUT http://localhost:4000/devices/dev_1 \\
    -H 'Authorization: Bearer tok_lan' \\
    --json '{"labId":"lab_1","name":"Cisco Router 2901","type":"ROUTER","serialNo":"FTX1840ALBQ","status":"MAINTENANCE"}'
{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "MAINTENANCE"
}
$ …same command again…
{
  "id": "dev_1",
  …identical…
  "status": "MAINTENANCE"
}`, { sm: true, wrap: true }), `
<ul style="font-size:22px">
<li>PUT says: “make the resource at <b>this URL</b> look <b>exactly like this</b>”</li>
<li>Doing it again changes nothing — the target state is already reached</li>
<li>The <b>client</b> chose the URL (<code class="i">/devices/dev_1</code>), so no twin can appear</li>
</ul>
${box('Safe to retry', 'A mobile app may resend a PUT after a timeout without asking the user.', 'xanh')}`, 'r64') },

  { t: 'PUT means the whole thing — so we refuse half a body', body: two(http(`$ curl -i -X PUT http://localhost:4000/devices/dev_1 \\
    -H 'Authorization: Bearer tok_lan' \\
    --json '{"status":"AVAILABLE"}'
HTTP/1.1 400 Bad Request
…

{
  "error": "VALIDATION_FAILED",
  "message": "PUT cần đủ mọi trường",
  "details": [
    {
      "field": "labId",
      "issue": "required"
    },
    {
      "field": "name",
      "issue": "required"
    },
    …  (type, serialNo)`, { sm: true }), `
<p style="margin:0;font-size:22px">A naive PUT that saves the body as-is would <b>wipe</b> name, type and serial — the demo-day bug from Section 0.</p>
${box('Two honest PUT policies', '<b>Strict</b> (LabFlow): every field required, else 400.<br><b>Lenient</b>: missing = reset to default. Pick one, write it in the docs.', 'lam')}
${box('Want to change one field?', 'That is what <b>PATCH</b> is for →', 'xanh')}`, 'r64') },

  { giua: true, to: true, t: 'PATCH with JSON Merge Patch', body: two(http(`$ curl -X PATCH http://localhost:4000/devices/dev_3 \\
    -H 'Authorization: Bearer tok_lan' \\
    -H 'Content-Type: application/merge-patch+json' \\
    -d '{"status":"MAINTENANCE","note":null}'
{
  "id": "dev_3",
  "labId": "lab_2",
  "name": "Raspberry Pi 5",
  "type": "BOARD",
  "serialNo": "RPI5-00421",
  "status": "MAINTENANCE"
}`, { sm: true }) + `<p class="nho" style="margin:6px 0 0">Before: <code class="i">status: "AVAILABLE"</code>, <code class="i">note: "Thiếu thẻ nhớ"</code>.</p>`, `
<table class="t" style="font-size:20px">
<tr><th>In the patch</th><th>Effect</th></tr>
<tr><td><code class="i">"status": "MAINTENANCE"</code></td><td>set the field</td></tr>
<tr><td><code class="i">"note": null</code></td><td><b>remove</b> the field</td></tr>
<tr><td>field not mentioned</td><td>left <b>untouched</b></td></tr>
</table>
${box('A named standard', '<b>RFC 7396</b>, media type <code class="i">application/merge-patch+json</code>. Saying “we use Merge Patch” is one sentence in your docs instead of a page of rules.', 'lam')}`, 'r64') },

  { t: 'PUT vs PATCH at a glance', to: true, body: `
<table class="t lon">
<tr><th style="width:260px"></th><th>PUT</th><th>PATCH (Merge Patch)</th></tr>
<tr><td>Body contains</td><td>the <b>whole</b> new resource</td><td>only the fields to <b>change</b></td></tr>
<tr><td>Missing field means</td><td>error (strict) or reset (lenient)</td><td>leave it alone</td></tr>
<tr><td>Idempotent?</td><td>✅ always</td><td>this one ✅, but not promised in general (e.g. <code class="i">{"op":"increment"}</code> styles)</td></tr>
<tr><td>Good for</td><td>forms that edit everything, sync jobs</td><td>toggles, status changes, mobile apps on slow networks</td></tr>
<tr><td>Risk</td><td>wiping fields you forgot to send</td><td><code class="i">null</code> removing a field you needed</td></tr>
</table>` },

  { giua: true, to: true, t: 'DELETE twice: 204, then 404 — still idempotent', body: two(http(`$ curl -i -X DELETE http://localhost:4000/devices/dev_2 \\
    -H 'Authorization: Bearer tok_lan'
HTTP/1.1 204 No Content
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

$ curl -i -X DELETE http://localhost:4000/devices/dev_2 \\
    -H 'Authorization: Bearer tok_lan'
HTTP/1.1 404 Not Found
…

{
  "error": "DEVICE_NOT_FOUND",
  "message": "Không có thiết bị dev_2"
}`, { sm: true }), `
<ul style="font-size:22px">
<li>Effect after 1 call: dev_2 gone. After 2 calls: dev_2 gone. <b>Same effect</b> ✅</li>
<li>The <b>responses</b> differ (204 vs 404) — idempotency is about the server state, not the reply</li>
<li><b>204</b> = success with <b>no body</b>: nothing left to show</li>
</ul>
${box('Client tip', 'After a retried DELETE, treat <b>404 as “already gone”</b>, not as a failure.', 'xanh')}`, 'r64') },

  { t: 'HEAD, OPTIONS and 405 Method Not Allowed', body: two(http(`$ curl -I http://localhost:4000/labs
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 454
…
$ curl -i -X OPTIONS http://localhost:4000/devices/dev_1
HTTP/1.1 204 No Content
Allow: GET, HEAD, PUT, PATCH, DELETE
…
$ curl -i -X DELETE http://localhost:4000/labs/lab_1
HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
…

{
  "error": "METHOD_NOT_ALLOWED",
  "message": "DELETE không dùng được ở /labs/lab_1"
}`, { sm: true }), `
<ul style="font-size:21px">
<li><b>HEAD</b>: headers of a GET, no body — Express answers it for every GET route</li>
<li><b>OPTIONS</b>: “what can I do here?” → the <code class="i">Allow</code> header lists it</li>
<li><b>405</b>: the URL exists, the method does not. Different from <b>404</b> (no such URL)</li>
</ul>
${box('Express default', 'Without extra code, Express answers a wrong method with <b>404</b> — the client cannot tell “typo in URL” from “not allowed”.', 'do2')}`, 'r64') },

  { t: 'The code: one route, all its methods, 405 for the rest', body: sql(`// http.js
export const onlyAllow = (...methods) => (req, res) => {
  res.set('Allow', methods.join(', '));
  if (req.method === 'OPTIONS') return res.status(204).end();
  throw new HttpError(405, 'METHOD_NOT_ALLOWED',
    \`\${req.method} không dùng được ở \${req.baseUrl}\${req.path}\`);
};

// routes/devices.js — shape of the route (handler bodies: see the lesson)
devicesRouter.route('/:id')
  .get((req, res) => res.json(findDevice(req.params.id)))
  .put(requireAuth, requireRole('LAB_MANAGER'), replaceDevice)
  .patch(requireAuth, requireRole('LAB_MANAGER'), patchDevice)
  .delete(requireAuth, requireRole('LAB_MANAGER'), deleteDevice)
  .all(onlyAllow('GET', 'HEAD', 'PUT', 'PATCH', 'DELETE'));   // ← last`, { lang: 'javascript', hl: [2, 3, 4, 15] }) +
  `<p style="margin:6px 0 0;font-size:20px"><code class="i">.all()</code> runs only when no method above matched. Express 5 forwards the <code class="i">throw</code> to the error handler from lesson 0.3. (Handler bodies are in the written lesson.)</p>` },

  { giua: true, to: true, t: 'Traps', body: vsd(sql(`GET /devices/dev_3/delete
GET /bookings/bk_1/cancel`, { lang: 'plaintext' }) + `<ul style="font-size:21px;margin-top:8px">
<li>browsers <b>prefetch</b> links, crawlers follow them, caches replay them</li>
<li>a GET that changes data <b>will</b> be triggered by something you did not plan</li></ul>`,
  `<ul style="font-size:21px;margin:0">
<li>GET / HEAD / OPTIONS <b>never</b> change data</li>
<li>Same <b>effect</b> ≠ same <b>response</b> (DELETE: 204 then 404)</li>
<li>PATCH is not promised idempotent — <b>check yours</b></li>
<li>POST is <b>never</b> safe to blind-retry without a key (Ch 5)</li>
<li>Choose the method by <b>effect</b>, not by “which one Express makes easy”</li></ul>`, '✗ GET with side effects', '✓ Rules of thumb') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>Safe</b> = asks for no change (GET, HEAD, OPTIONS). <b>Idempotent</b> = N times has the effect of once (+ PUT, DELETE)</li>
<li>Those promises decide whether a client may <b>retry</b> after a lost response</li>
<li>POST twice → twins; PUT twice → same state; DELETE twice → 204 then 404, still idempotent</li>
<li>PUT replaces <b>all</b> (LabFlow refuses half a body); PATCH with <b>Merge Patch</b> changes some, <code class="i">null</code> removes</li>
<li>Existing URL, wrong method → <b>405</b> + <code class="i">Allow</code></li>
</ul>
${box('Next', 'Lesson 1.3 — status codes that mean something: 201 + Location, 400 vs 422, 401 vs 403, 404 vs 410, 409.', 'xanh')}` },
]);
