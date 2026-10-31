/**
 * api-02-3 — API Design · Chapter 2 · Lesson 2.3 "Response shapes and envelopes" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s02-loi-phan-hoi.mjs › api-2-3-envelope. Output = chạy thật LabFlow (Node 22.23.3, Express 5.3.0).
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 2 — Errors, validation and responses', bai: '2.3' };

export const deck = { key: 'api-02-3', code: 'API 2.3', title: 'Response shapes and envelopes', sub: 'Views, null vs absent, wrapped lists' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Response shapes:<br>what goes out', sub: 'Successful answers are contract too —<br>three real problems, one file of views.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Three problems in answers that “work”: a <b>leak</b>, a shape that <b>depends on data</b>, a shape that <b>changes over time</b></li>
<li><b>Views</b> (DTOs): an allow-list at the exit</li>
<li>LabFlow’s rule for <b>null vs absent</b>, and why lists are <b>wrapped</b></li>
<li>Measure why “<b>always 200</b> + envelope” breaks ordinary tools</li>
<li>Pretty vs compact JSON: <b>454 vs 296 bytes</b></li>
</ul>` },

  { t: 'Everyday example: the receipt and the ledger', to: true, giua: true, body: two(`
<p style="margin-top:0">A shop keeps an internal <b>ledger</b>: cost price, supplier, the cashier’s notes about you.</p>
<p>You get a <b>receipt</b>: item, price, date. Someone <b>designed</b> what goes on it — nothing from the ledger appears by accident.</p>`,
  `<table class="t lon">
<tr><th>Shop</th><th>API</th></tr>
<tr><td>ledger</td><td>the database record</td></tr>
<tr><td>receipt</td><td>the <b>representation</b> in the response</td></tr>
<tr><td>receipt template</td><td>the <b>view</b> / DTO</td></tr>
</table>
${box('The rule', 'Every member you send is a member someone will depend on — and every member sent by accident is a leak.', 'xanh')}`, 'r46') },

  { t: 'Problem 1 — a leak: GET /me returns the record', to: true, body: two(sql(`meRouter.route('/')
  .get(requireAuth, (req, res) => res.json(req.user))   // ⚠ first version
  .all(onlyAllow('GET', 'HEAD'));`, { lang: 'javascript', sm: true }) + http(`$ curl -s http://localhost:4000/me -H 'Authorization: Bearer tok_bin'
{
  "id": "usr_2",
  "name": "Trần Thị Bình",
  "role": "STUDENT",
  "email": "binh@student.labflow.example",
  "passwordHash": "demo-hash-bin",
  "failedLogins": 3,
  "staffNote": "Hay đặt rồi không đến"
}`, { sm: true }), `
<ul style="font-size:21px">
<li><code class="i">passwordHash</code> — can be cracked offline</li>
<li><code class="i">failedLogins</code>, <code class="i">staffNote</code> — internal, never meant for her</li>
<li>Nobody <b>decided</b> to publish them: <code class="i">res.json</code> sends whatever it is given</li>
</ul>
${box('OWASP API3:2023', '“Excessive data exposure” — return only what the client needs. The T-Mobile incident (lesson 0.9) at 37 million accounts.', 'do2')}`, 'r64') },

  { t: 'Problems 2–3: the shape changes with data and time', body: two(http(`$ curl -s http://localhost:4000/devices
{
  "data": [
    { "id": "dev_1", …, "status": "AVAILABLE" },
    { "id": "dev_2", …, "status": "AVAILABLE" },
    {
      "id": "dev_3",
      …
      "status": "AVAILABLE",
      "note": "Thiếu thẻ nhớ"
    }
  ]
}`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px"><code class="i">note</code> exists on one device, is <b>missing</b> on two.</p>`,
  http(`$ curl -s -X POST …/bookings … --json '{"labId":"lab_1",…}'
{
  "id": "bk_1",
  …
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T17:42:07.584Z"
}
$ curl -s -X POST …/bookings/bk_1/cancel …
{
  "id": "bk_1",
  …
  "status": "CANCELLED",
  "createdAt": "2026-10-31T17:42:07.584Z",
  "cancelledAt": "2026-10-31T17:42:07.598Z"
}`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px"><b>8 members</b> when created, <b>9</b> after cancelling.</p>`) + box('Why it hurts', 'TypeScript gets <code class="i">undefined</code>, a table loses a column, a Kotlin/Swift decoder may fail on a missing key.', 'lam') },

  { t: 'Rule 1: an allow-list at the exit — src/views.js', body: sql(`// Only members named here leave the server (allow-list).
// LabFlow rule: optional members ALWAYS present, null when empty.
export const toLab = (l) => ({
  id: l.id, code: l.code, name: l.name, building: l.building, capacity: l.capacity,
});
export const toDevice = (d) => ({
  id: d.id, labId: d.labId, name: d.name, type: d.type, serialNo: d.serialNo, status: d.status,
  note: d.note ?? null,
});
export const toBooking = (b) => ({
  id: b.id, labId: b.labId, userId: b.userId, startAt: b.startAt, endAt: b.endAt,
  purpose: b.purpose ?? null, status: b.status, createdAt: b.createdAt,
  cancelledAt: b.cancelledAt ?? null,
});
export const toMe = (u) => ({ id: u.id, name: u.name, role: u.role, email: u.email });

// Lists: always { data: [...] } — room for paging metadata in Chapter 3
export const list = (items, view) => ({ data: items.map(view) });`, { lang: 'javascript', hl: [8, 12, 13, 15, 18] }) + `<p style="margin:8px 0 0;font-size:21px">Called a <b>DTO</b>, serializer, presenter or view — the database shape and the API shape are different things.</p>` },

  { t: 'Allow-list vs deny-list', to: true, body: vsd(sql(`const u = { ...req.user };
delete u.passwordHash;
delete u.failedLogins;
delete u.staffNote;
res.json(u);`, { lang: 'javascript' }) + `<ul style="margin-top:8px"><li>fails <b>open</b>: next month someone adds <code class="i">resetToken</code> — published the same day</li></ul>`,
  sql(`res.json(toMe(req.user));
// toMe names id, name, role, email
// — nothing else can go out`, { lang: 'javascript' }) + `<ul style="margin-top:8px"><li>fails <b>closed</b>: a new field stays internal until someone adds it to the view <b>on purpose</b> — in code review</li></ul>`, '✗ deny-list', '✓ allow-list (LabFlow)') + box('Use the view everywhere', '<code class="i">GET /devices</code> and <code class="i">GET /labs/lab_1/devices</code> both call <code class="i">toDevice</code> — one function, one shape, no drift.', 'xanh') },

  { t: 'Rule 2: one shape for the whole life of a resource', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:330px">Situation</th><th>LabFlow answer</th></tr>
<tr><td>optional member without a value</td><td><b>present, <code class="i">null</code></b> — <code class="i">"note": null</code></td></tr>
<tr><td>a filter that matches nothing</td><td><code class="i">{"data": []}</code> — never <code class="i">null</code>, never 404</td></tr>
<tr><td>numbers and booleans</td><td>real JSON numbers/booleans — <code class="i">"30" &lt; "4"</code> is <b>true</b> for strings</td></tr>
<tr><td>absent vs <code class="i">null</code> in a <b>request</b></td><td>absent = “not changed”, <code class="i">null</code> = “remove” (JSON Merge Patch)</td></tr>
</table>
${box('null or omit?', 'Both are legitimate and large APIs use each. What breaks clients is <b>mixing</b> them. Pick one, write it down.', 'lam')}` },

  { t: 'Rule 3: wrap lists, so paging is an additive change', body: vsd(sql(`// Chapter 0, if lists were bare arrays:
[ { "id": "lab_1", … }, { "id": "lab_2", … } ]

// Chapter 3 needs a "next page" link…
{ "data": [ … ], "page": { "next": "…" } }
// array became object ⇒ EVERY client breaks`, { lang: 'json' }),
  sql(`// LabFlow since Chapter 0:
{ "data": [ { "id": "lab_1", … }, … ] }

// Chapter 3 adds a member next to data:
{ "data": [ … ], "page": { "next": "…" } }
// additive ⇒ old clients just ignore "page"`, { lang: 'json' }), '✗ bare array', '✓ wrapped list') + two(box('Single resources', 'Not wrapped: there is nothing to say about a lab that is not in it. Metadata such as <code class="i">ETag</code> travels in headers (Chapter 9).', 'lam'), box('Other styles', 'JSON:API wraps items too — consistent, but more to type. Choose one style and apply it everywhere.', '')) },

  { t: 'Try it: the same members, always', body: two(http(`$ curl -s http://localhost:4000/me -H 'Authorization: Bearer tok_bin'
{
  "id": "usr_2",
  "name": "Trần Thị Bình",
  "role": "STUDENT",
  "email": "binh@student.labflow.example"
}
$ curl -i 'http://localhost:4000/labs?building=Gamma'
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 16
…

{
  "data": []
}`, { sm: true }), http(`$ curl -s -X POST …/bookings … --json '{"labId":"lab_1",…}'
{
  "id": "bk_1",
  …
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T17:54:15.507Z",
  "cancelledAt": null
}
$ curl -s -X POST …/bookings/bk_1/cancel …
{
  "id": "bk_1",
  …
  "purpose": null,
  "status": "CANCELLED",
  "createdAt": "2026-10-31T17:54:15.507Z",
  "cancelledAt": "2026-10-31T17:54:15.526Z"
}`, { sm: true })) + `<p style="margin:8px 0 0;font-size:21px">Four members for <code class="i">/me</code>; <b>nine</b> members for a booking before and after cancelling; an empty result is still a successful list.</p>` },

  { t: 'The “always 200” envelope — measured', body: two(sql(`// always200.mjs (port 4003)
app.get('/labs/:id', (req, res) => {
  if (req.params.id !== 'lab_1')
    return res.json({ success: false, code: 404,
      message: 'Không có phòng lab', data: null });
  res.json({ success: true, code: 200, message: 'OK',
    data: { id: 'lab_1', name: 'Phòng Lab Mạng máy tính' } });
});`, { lang: 'javascript', sm: true }) + http(`$ curl -i http://localhost:4003/labs/lab_9
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 74
…

{"success":false,"code":404,"message":"Không có phòng lab","data":null}`, { sm: true, wrap: true }),
  http(`$ node client200.mjs
http://localhost:4003/labs/lab_9 → status 200 | res.ok = true | app hiện: "Thành công!"
http://localhost:4000/labs/lab_9 → status 404 | res.ok = false | app hiện lỗi`, { sm: true, wrap: true }) + `<ul style="font-size:20px;margin-top:8px">
<li>caches may <b>store</b> the error as valid</li>
<li>retry libraries see <b>success</b></li>
<li>monitoring counts <b>zero</b> errors; health checks stay green</li>
<li>every client must know <code class="i">"code": 404</code> inside a 200 means failure</li></ul>
${box('Inherited an envelope?', 'Keep the HTTP status <b>truthful</b> anyway, and one documented error body. The harm is the 200.', 'lam')}`, 'r46') },

  { t: 'Status and body must agree', to: true, giua: true, body: two(`
<table class="t">
<tr><th style="width:140px">Answer</th><th>Body</th></tr>
<tr><td><b>200</b></td><td>the resource or the list</td></tr>
<tr><td><b>201</b></td><td>created resource through its view + <code class="i">Location</code></td></tr>
<tr><td><b>204</b></td><td><b>nothing at all</b></td></tr>
<tr><td><b>4xx/5xx</b></td><td>a problem document (2.1)</td></tr>
</table>`, http(`$ curl -i -X DELETE http://localhost:4000/devices/dev_2 \\
    -H 'Authorization: Bearer tok_lan'
HTTP/1.1 204 No Content
Date: Sat, 31 Oct 2026 17:54:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5

`, {}) + `<p style="margin:8px 0 0">No <code class="i">Content-Type</code>, no body — there is nothing to describe.</p>`, 'r46') + box('Same rule for every success', 'The body of a 2xx is always the <b>view</b> of the resource (or a list of views) — never a raw record, never a message like <code class="i">{"ok": true}</code>. <code class="i">HEAD</code> sends the same headers as <code class="i">GET</code> and no body.', 'xanh') },

  { t: 'Pretty or compact JSON? Measured on GET /labs', giua: true, body: two(http(`$ curl -s -o /dev/null -w '%{size_download} bytes\\n' http://localhost:4000/labs
454 bytes`, { title: 'development (json spaces = 2)', sm: true, wrap: true }) + http(`$ NODE_ENV=production npm start
$ curl -s http://localhost:4000/labs
{"data":[{"id":"lab_1","code":"AL-201","name":"Phòng Lab Mạng máy tính","building":"Alpha","capacity":30},{"id":"lab_2","code":"AL-305","name":"Phòng Lab IoT","building":"Alpha","capacity":24},{"id":"lab_3","code":"BE-102","name":"Phòng Lab Phần mềm","building":"Beta","capacity":40}]}
$ curl -s -o /dev/null -w '%{size_download} bytes\\n' http://localhost:4000/labs
296 bytes`, { title: 'production (compact)', sm: true, wrap: true }), `
<p style="font-size:26px;margin-top:0"><b>454 → 296 bytes</b>: about a third less, same data.</p>
${sql(`app.set('json spaces',
  process.env.NODE_ENV === 'production'
    ? 0 : 2);`, { lang: 'javascript' })}
<ul style="font-size:22px">
<li>humans still read production JSON with <code class="i">| jq</code> or the browser viewer</li>
<li>compression (gzip, at the reverse proxy) shrinks it further</li>
</ul>`) },

  { t: 'Traps: returning ORM objects, and views that drift', to: true, giua: true, body: vsd(sql(`const u = await prisma.user
  .findUnique({ where: { id } });
res.json(u);
// every column — including
// the ones added next year`, { lang: 'javascript' }) + `<ul style="margin-top:8px"><li>the <code class="i">/me</code> leak again, one layer down</li><li>same for a Mongoose document or a Spring <code class="i">@Entity</code></li></ul>`,
  sql(`const u = await prisma.user
  .findUnique({ where: { id } });
res.json(toMe(u));
// Spring: return a DTO record`, { lang: 'javascript' }) + `<ul style="margin-top:8px"><li>two endpoints, one view: <code class="i">toDevice</code> for both device lists</li><li>adding a member = editing the view, visible in review</li></ul>`, '✗ entity straight out', '✓ through a view') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Why not return the entity?”', 'The database shape is not the contract: it holds secrets and internal fields and changes for reasons unrelated to clients. A DTO is an explicit allow-list and a stable shape.'],
    ['“Should we wrap responses?”', 'Wrap lists so paging can be added without breaking clients; keep the HTTP status truthful; one documented error shape. Always-200 breaks caches, retries and monitoring.'],
    ['“null or omit?”', 'Either, consistently. LabFlow sends documented optional members always, <code class="i">null</code> when empty — the shape never changes over a resource’s life.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Successful responses are <b>contract</b>: every member sent will be depended on</li>
<li>Build every response through a <b>view</b> — an allow-list that fails closed</li>
<li>One shape for a resource’s whole life: optional members present, <code class="i">null</code> when empty</li>
<li>Wrap lists in <code class="i">{"data": [...]}</code>; empty lists are <code class="i">[]</code></li>
<li>Never 200 for a failure; compact JSON in production</li>
</ul>
${box('Next', 'Lesson 2.4 — errors for bilingual apps, and Vietnamese text done right.', 'xanh')}` },
]);
