/**
 * api-01-1 — API Design · Chapter 1 · Lesson 1.1 "Modelling resources, not actions" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s01-tai-nguyen.mjs › api-1-1-tai-nguyen. Output = chạy thật LabFlow (Node 22.23.3, Express 5.3.0).
 */
import { lamDeck, sql, http, two, box, steps, cards, c, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 1 — Resources and methods', bai: '1.1' };

/* Bộ sưu tập ↔ phần tử: ngăn kéo hồ sơ. */
const keHoSo = () => `<svg viewBox="0 0 1110 260" width="1110" height="260" font-family="Arial">
  <rect x="20" y="30" width="430" height="210" rx="14" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="235" y="66" text-anchor="middle" font-size="24" font-weight="800" fill="#336791">🗄️ collection</text>
  <text x="235" y="96" text-anchor="middle" font-size="22" font-family="Menlo,monospace" fill="#245077">/labs</text>
  ${['lab_1 · AL-201', 'lab_2 · AL-305', 'lab_3 · BE-102'].map((t, i) => `<rect x="${55 + i * 14}" y="${118 + i * 30}" width="320" height="44" rx="6" fill="#fff" stroke="#9fb7d1" stroke-width="2"/><text x="${72 + i * 14}" y="${147 + i * 30}" font-size="19" font-family="Menlo,monospace" fill="#333">${t}</text>`).join('')}
  <path d="M470,135 L585,135" stroke="#e08a1e" stroke-width="5"/><path d="M585,119 L615,135 L585,151 z" fill="#e08a1e"/>
  <text x="540" y="118" text-anchor="middle" font-size="18" font-weight="700" fill="#b85a2b">pick one by id</text>
  <rect x="640" y="30" width="450" height="210" rx="14" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/>
  <text x="865" y="66" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">📄 item</text>
  <text x="865" y="96" text-anchor="middle" font-size="22" font-family="Menlo,monospace" fill="#7a3d12">/labs/lab_2</text>
  <g font-family="Menlo,monospace" font-size="19" fill="#333"><text x="680" y="140">id:       "lab_2"</text><text x="680" y="168">code:     "AL-305"</text><text x="680" y="196">name:     "Phòng Lab IoT"</text><text x="680" y="224">capacity: 24</text></g>
</svg>`;

/* Lồng một tầng: labs ⟶ devices, item phẳng. */
const long = () => `<svg viewBox="0 0 1110 220" width="1110" height="220" font-family="Arial">
  ${[[20, '/labs', 'all labs', '#336791'], [300, '/labs/lab_1', 'one lab', '#336791'], [580, '/labs/lab_1/devices', 'devices IN lab_1', '#e08a1e'], [860, '/devices/dev_1', 'one device (flat)', '#2f7d4f']]
    .map(([x, t, d, m]) => `<rect x="${x}" y="40" width="250" height="110" rx="12" fill="${m}14" stroke="${m}" stroke-width="3"/><text x="${x + 125}" y="88" text-anchor="middle" font-size="${t.length > 16 ? 19 : 22}" font-weight="800" font-family="Menlo,monospace" fill="${m}">${t}</text><text x="${x + 125}" y="122" text-anchor="middle" font-size="19" fill="#555">${d}</text>`).join('')}
  <path d="M274,95 L292,95" stroke="#404040" stroke-width="3"/><path d="M554,95 L572,95" stroke="#404040" stroke-width="3"/>
  <path d="M834,95 L852,95" stroke="#404040" stroke-width="3" stroke-dasharray="4 3"/>
  <text x="555" y="195" text-anchor="middle" font-size="20" fill="#404040" font-weight="700">Nest the <tspan fill="#b85a2b">collection</tspan> when it belongs to a parent; keep the <tspan fill="#2f7d4f">item</tspan> URL short and flat.</text>
</svg>`;

export const deck = { key: 'api-01-1', code: 'API 1.1', title: 'Modelling resources, not actions', sub: 'Nouns, collections, nesting, custom actions' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Modelling resources,<br>not actions', sub: 'Turn LabFlow’s requirements into nouns and URLs —<br>and handle the actions that do not fit.' },

  { giua: true, t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>What a <b>resource</b> is: a noun with an identity and a state</li>
<li><b>Collection</b> vs <b>item</b>: <code class="i">/labs</code> vs <code class="i">/labs/lab_1</code></li>
<li>How to find resources in a requirement — the LabFlow user stories</li>
<li>Why <code class="i">/getLabs</code> and <code class="i">/createBooking</code> are a smell</li>
<li>Nesting (<code class="i">/labs/lab_1/devices</code>) and when to stop</li>
<li>Actions that are not create/read/update/delete: <b>cancel a booking</b></li>
</ul>` },

  { giua: true, t: 'Everyday example: actions become things', to: true, body: `
<table class="t lon">
<tr><th>What people say (a verb)</th><th>What the system keeps (a noun)</th><th>Resource</th></tr>
<tr><td>“I <b>borrow</b> a book”</td><td>a loan slip: who, which book, until when</td><td><code class="i">loans</code></td></tr>
<tr><td>“I <b>book</b> lab AL-201 on Monday”</td><td>a booking: lab, user, start, end, status</td><td><code class="i">bookings</code></td></tr>
<tr><td>“I <b>report</b> that router 1 is broken”</td><td>an issue: device, title, severity</td><td><code class="i">issues</code></td></tr>
<tr><td>“The manager <b>approves</b> it”</td><td>the booking’s <b>status</b> changes</td><td>state of <code class="i">bookings</code></td></tr>
</table>
${box('The trick', 'Behind almost every verb there is a <b>record</b> the business wants to keep. That record is your resource — and once it exists you can list it, read it, search it, cancel it.', 'xanh')}` },

  { t: 'Collection and item', body: `${keHoSo()}
${two(box('Collection', `<code class="i">/labs</code> — the set. <b>GET</b> lists, <b>POST</b> adds a new member (server picks the id).`, 'lam'),
  box('Item', `<code class="i">/labs/lab_2</code> — one member, addressed by its <b>id</b>. GET reads it, PUT / PATCH / DELETE change it.`, ''))}` },

  { giua: true, to: true, t: 'From user stories to resources', body: `
<table class="t lon">
<tr><th>LabFlow user story</th><th style="width:200px">Nouns found</th><th style="width:270px">Resource</th></tr>
<tr><td>As a <b>student</b>, I see which <b>labs</b> are free on Monday</td><td>student, lab</td><td><code class="i">labs</code></td></tr>
<tr><td>As a student, I <b>book</b> a lab for 8–10h</td><td>booking</td><td><code class="i">bookings</code></td></tr>
<tr><td>As a student, I see the <b>devices</b> in a lab</td><td>device</td><td><code class="i">labs/{id}/devices</code></td></tr>
<tr><td>As a <b>lab manager</b>, I mark a device as under repair</td><td>device status</td><td>field <code class="i">status</code></td></tr>
<tr><td>As a student, I <b>cancel</b> my booking</td><td>(an action)</td><td><code class="i">bookings/{id}/cancel</code></td></tr>
</table>
<p class="nho" style="margin:6px 0 0">Underline the nouns, circle the verbs. Nouns → resources and fields; verbs → methods (lesson 1.2) or, rarely, custom actions.</p>` },

  { giua: true, to: true, t: 'Smell: verbs in the URL', body: vsd(sql(`GET  /getLabs
GET  /getLabById?id=lab_1
POST /createBooking
POST /updateDevice
GET  /deleteDevice?id=dev_3
POST /labs/list`, { lang: 'plaintext' }) + `<ul style="font-size:20px;margin-top:8px"><li>every new action = a new URL to invent and remember</li><li><b>GET that deletes</b>: a browser prefetch or crawler can delete data</li></ul>`,
  sql(`GET    /labs
GET    /labs/lab_1
POST   /bookings
PATCH  /devices/dev_1
DELETE /devices/dev_3
GET    /labs`, { lang: 'plaintext' }) + `<ul style="font-size:20px;margin-top:8px"><li>a few nouns × a handful of methods</li><li>clients <b>guess right</b>: if <code class="i">/labs/lab_1</code> exists, GET it</li></ul>`,
  '✗ RPC-style endpoints', '✓ Resources + methods') },

  { giua: true, to: true, t: 'URL rules we use in LabFlow', body: two(`
<ol style="font-size:22px">
<li><b>Plural nouns</b> for collections: <code class="i">/labs</code>, not <code class="i">/lab</code></li>
<li><b>Lowercase</b>, words joined by <b>hyphens</b>: <code class="i">/lab-rooms</code></li>
<li><b>ids in the path</b>, options in the <b>query</b>: <code class="i">/labs?building=Alpha</code></li>
<li><b>No verbs</b>, no file extensions (<code class="i">.json</code>, <code class="i">.php</code>)</li>
<li><b>No trailing slash</b> in what you document</li>
<li>One style, <b>everywhere</b> — consistency beats the “perfect” rule</li>
</ol>`, box('Why plural?', 'The collection URL and the item URL then read as one path: <code class="i">/labs</code> → <code class="i">/labs/lab_1</code>. Singular forces you to choose between <code class="i">/lab/lab_1</code> and <code class="i">/labs</code>.', 'lam') +
  box('Not laws', 'These are conventions (Google AIP, Microsoft and Zalando guidelines broadly agree). What matters in a team is that <b>everyone follows the same list</b>.', '')) },

  { t: 'The LabFlow map after Chapter 1', body: `
<table class="t" style="font-size:21px">
<tr><th style="width:420px">Endpoint</th><th>Meaning</th><th style="width:170px">Who</th></tr>
${[['GET /labs', 'list labs', 'anyone'], ['GET /labs/{labId}', 'one lab', 'anyone'], ['GET /labs/{labId}/devices', 'devices inside one lab', 'anyone'],
  ['GET /devices  ·  GET /devices/{id}', 'all devices (filter ?labId=) · one device', 'anyone'], ['POST /devices', 'register a device', 'lab manager'],
  ['PUT · PATCH · DELETE /devices/{id}', 'replace · edit · remove a device', 'lab manager'], ['GET /bookings  ·  POST /bookings', 'my bookings · book a lab', 'logged in'],
  ['GET /bookings/{id}', 'one booking', 'owner / manager'], ['POST /bookings/{id}/cancel', 'cancel a booking', 'owner / manager']]
  .map(([e, m, w]) => `<tr><td style="white-space:nowrap;font-family:Menlo,monospace;font-size:19px;color:#7a3d12">${e}</td><td>${m}</td><td>${w}</td></tr>`).join('')}
</table>
<p class="nho" style="margin:6px 0 0">Four nouns, eight URL patterns, thirteen endpoints. Lessons 1.2–1.4 fill in methods, status codes and field names.</p>` },

  { t: 'Nesting: a collection that belongs to a parent', body: `${long()}
${two(http(`$ curl http://localhost:4000/labs/lab_1/devices
{
  "data": [
    {
      "id": "dev_1",
      "labId": "lab_1",
      "name": "Cisco Router 2901",
      …
    },
    {
      "id": "dev_2",
      …`, { sm: true }), box('Read it as a sentence', '“the <b>devices</b> of <b>lab_1</b>”. The parent id in the path is a <b>filter you cannot forget</b> — and a wrong parent gives a clear 404 (next slide).', 'lam'), 'r64')}` },

  { t: 'Nested URL or a filter? Both can be right', body: two(http(`$ curl http://localhost:4000/labs/lab_9/devices
{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px"><b>Nested</b>: the parent is checked first — a wrong lab is a clear <b>404</b>.</p>`,
  http(`$ curl 'http://localhost:4000/devices?labId=lab_1'
{
  "data": [
    {
      "id": "dev_1",
      "labId": "lab_1",
      …
    },
    {
      "id": "dev_2",
      "labId": "lab_1",
      …`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px"><b>Filter</b>: one endpoint answers many questions (by lab, by status, by type later).</p>`) +
  box('LabFlow keeps both', '<code class="i">/labs/{id}/devices</code> for “what is in this room?” screens; <code class="i">/devices?labId=</code> for search and admin tables. Same data, two natural entry points — documented, not accidental.', 'lam') },

  { t: 'Stop at one level', giua: true, body: vsd(sql(`/buildings/alpha/labs/lab_1/devices/dev_1/issues/iss_3`, { lang: 'plaintext' }) + `
<ul style="font-size:21px;margin-top:8px">
<li>the client must know <b>every</b> parent id just to read one issue</li>
<li>move the device to another lab → its URL <b>changes</b></li>
<li>every level is one more ownership check to forget</li>
</ul>`, sql(`/labs/lab_1/devices     ← nested once
/devices/dev_1          ← flat item
/devices/dev_1/issues   ← nested once
/issues/iss_3           ← flat item`, { lang: 'plaintext' }) + `
<p style="margin:8px 0 0;font-size:21px">Rule of thumb: <b>parent/{id}/children</b> at most, and every item has its own short URL.</p>`, '✗ Deep nesting', '✓ One level, flat items') },

  { t: 'Actions that are not CRUD: cancel a booking', body: `
<table class="t" style="font-size:20px">
<tr><th style="width:330px">Option</th><th>Good</th><th>Problem</th></tr>
<tr><td><code class="i">PATCH /bookings/bk_1</code><br><code class="i">{"status":"CANCELLED"}</code></td><td>pure resource style</td><td>cancel has <b>rules</b> (owner only, not twice, maybe a reason) hidden inside a generic edit</td></tr>
<tr><td><code class="i">POST /bookings/bk_1/cancel</code></td><td>one obvious endpoint, its own rules, own permission</td><td>a “verb” in the path (but it is a <b>sub-resource action</b>)</td></tr>
<tr><td><code class="i">POST /bookings/bk_1:cancel</code></td><td>Google’s style (AIP-136 “custom methods”)</td><td>colon looks unusual to many clients and routers</td></tr>
<tr><td><code class="i">DELETE /bookings/bk_1</code></td><td>short</td><td>the record should <b>stay</b> (history, statistics) — cancel ≠ delete</td></tr>
</table>
${box('LabFlow choice', '<b>POST /bookings/{id}/cancel</b>. State changes with business rules get an explicit action endpoint; simple field edits use PATCH. Write the rule down so the team applies it the same way.', 'xanh')}` },

  { t: 'Cancel, for real', body: two(http(`$ curl -i -X POST http://localhost:4000/bookings/bk_1/cancel \\
    -H 'Authorization: Bearer tok_an'
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
…

{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": "SWT301 Lab 3",
  "status": "CANCELLED",
  "createdAt": "2026-10-31T16:05:55.582Z",
  "cancelledAt": "2026-10-31T16:05:55.593Z"
}`, { sm: true }), `
<ul style="font-size:21px">
<li>The booking <b>still exists</b> — <code class="i">GET /bookings/bk_1</code> returns it with <code class="i">status: "CANCELLED"</code></li>
<li>The response returns the <b>new state</b>, so the client does not need a second call</li>
<li><code class="i">cancelledAt</code> records <b>when</b> — useful for reports and disputes</li>
</ul>
${box('Times in UTC', '<code class="i">08:00+07:00</code> was stored as <code class="i">01:00Z</code>. Lesson 1.4 explains why.', 'lam')}`, 'r64') },

  { t: 'Trap: URLs shaped like screens or tables', to: true, giua: true, body: vsd(sql(`GET /labDetailPage?labId=lab_1
GET /homeScreenData
GET /tbl_lab_device_mapping`, { lang: 'plaintext' }) + `<p style="margin:8px 0 0;font-size:21px">Screens change every sprint; table names are internal. Both leak into the contract and then <b>can never change</b>.</p>`,
  sql(`GET /labs/lab_1
GET /labs/lab_1/devices
GET /bookings?userId=me   (Ch 3)`, { lang: 'plaintext' }) + `<p style="margin:8px 0 0;font-size:21px">Resources describe the <b>business</b>. A screen may call two or three of them; that is fine.</p>`, '✗ Leaks the UI / the database', '✓ Describes the domain') },

  { giua: true, t: 'Interview corner: “design the URLs for…”', to: true, body: steps([
    'List the <b>nouns</b> from the requirements (3–6 is normal)',
    'For each: collection URL + item URL (<code class="i">/bookings</code>, <code class="i">/bookings/{id}</code>)',
    'Decide parent–child pairs that deserve <b>one</b> level of nesting',
    'Name the special <b>actions</b> and say why they are not a PATCH',
    'Say what you left out — and how you would add it without breaking anyone',
  ]) + box('Interviewers listen for', 'consistency, the <b>reason</b> behind each choice, and that you noticed the hard part (here: double booking and cancel rules).', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A <b>resource</b> is a noun the business keeps; behind most verbs hides a record</li>
<li><b>Collection</b> <code class="i">/labs</code> + <b>item</b> <code class="i">/labs/{id}</code>; plural, lowercase, ids in the path, options in the query</li>
<li>Nest <b>one</b> level for children; items keep a short flat URL</li>
<li>Rule-heavy state changes → an explicit action: <code class="i">POST /bookings/{id}/cancel</code></li>
<li>Design for the <b>domain</b>, not for screens or tables</li>
</ul>
${box('Next', 'Lesson 1.2 — which method for which job, and what “safe” and “idempotent” promise.', 'xanh')}` },
]);
