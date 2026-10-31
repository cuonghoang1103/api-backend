/**
 * API Design — Chương 1: Tài nguyên và phương thức (soạn chi tiết 31/10/2026, đợt mẫu).
 * Dự án xuyên khoá LabFlow API — mã cuối chương ở bài 1.5 (lab). Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, curl 8.7.1, macOS.
 * Slide: api-01-1 … api-01-4 + api-lab-1 (scripts/slides-src); giảng EN/VI ở ./giang/.
 * LUẬT: < > → &lt; &gt; ; & → &amp; ; backtick → &#96; ; ${ → \${ ; \" trong output → \\".
 * GIỮ slug cũ api-1-1-tai-nguyen, api-1-2-phuong-thuc, api-1-3-status, api-1-4-dat-ten và title chương.
 */
import G011 from './giang/api-01-1.mjs';
import G012 from './giang/api-01-2.mjs';
import G013 from './giang/api-01-3.mjs';
import G014 from './giang/api-01-4.mjs';
import GL1 from './giang/api-lab-1.mjs';

export default {
  title: 'Chapter 1 — Resources and methods|||Chương 1 — Tài nguyên và phương thức',
  description: 'Biến yêu cầu thành tài nguyên và URL, chọn đúng phương thức (safe, idempotent, PUT/PATCH, 405), mã trạng thái có ý nghĩa, quy ước đặt tên/ngày giờ/tiền/id — trên LabFlow API chạy thật; lab có rubric và quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — Modelling resources, not actions|||1.1 — Mô hình hoá tài nguyên, không phải hành động',
      slug: 'api-1-1-tai-nguyen',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tìm tài nguyên từ user story, bộ sưu tập và phần tử, luật URL, lồng một tầng, URL lồng hay bộ lọc, hành động không phải CRUD (huỷ lượt đặt) — trên LabFlow.',
      content: `${G011}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Modelling resources, not actions</h2>
<p class="lead">Before methods, status codes or JSON fields, an API needs a <em>shape</em>: which things it exposes and what their addresses are. Get this right and most later decisions become obvious; get it wrong and every new feature invents a new URL. In this lesson you turn LabFlow’s requirements into resources and URLs, extend the skeleton from lesson 0.3 with devices and a nested collection, and design the one action that does not fit — cancelling a booking.</p>

<div class="callout ok">
<p><strong>After Chapter 1 you can:</strong></p>
<ul>
  <li>model a domain as resources and URLs instead of verbs;</li>
  <li>pick the right method and know which ones are safe to repeat;</li>
  <li>choose the exact status code for every outcome, in a fixed order;</li>
  <li>name fields, dates, money and ids so no client has to guess.</li>
</ul>
<p><strong>Why it matters:</strong> This is the vocabulary of every API review and every “design an API for…” interview question; LabFlow’s first resources are built here.</p>
</div>

<h3>What is a resource?</h3>
<p>A <strong>resource</strong> is anything the API lets clients name and work with: a lab, a device, a booking, a user. It has three properties:</p>
<ul>
  <li><strong>An identity</strong> that does not change: <code>lab_1</code>, <code>bk_7</code>.</li>
  <li><strong>A state</strong> — its current data: name, capacity, status.</li>
  <li><strong>An address</strong> — its URL: <code>/labs/lab_1</code>.</li>
</ul>
<p>The key insight: behind almost every <em>verb</em> in a requirement there is a <em>record</em> the business wants to keep. “I book a lab” becomes a <strong>booking</strong> with a lab, a user, a start, an end and a status. “I report a broken router” becomes an <strong>issue</strong>. “The manager approves it” is not a new thing at all — it changes the booking’s <code>status</code>. Model the records and the verbs mostly turn into HTTP methods, which a client already knows.</p>

<h3>Collection and item</h3>
<table>
  <thead><tr><th>Shape</th><th>URL</th><th>GET</th><th>POST</th><th>PUT / PATCH / DELETE</th></tr></thead>
  <tbody>
    <tr><td><strong>Collection</strong></td><td><code>/labs</code></td><td>list the members</td><td>add a new member; the server picks its id</td><td>— (rarely on a whole collection)</td></tr>
    <tr><td><strong>Item</strong></td><td><code>/labs/lab_2</code></td><td>read this member</td><td>— (except actions, below)</td><td>replace / change / remove this member</td></tr>
  </tbody>
</table>
<p>Two URLs per resource, a handful of methods — that is the whole vocabulary a client needs to learn. Compare with an RPC-style API where every operation has its own name.</p>

<h3>From user stories to resources</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">user story</span><span class="lz-t">“As a student I book a lab”</span><span class="lz-d">what people do</span></div>
  <div class="lz-step"><span class="lz-k">nouns</span><span class="lz-t">lab, booking, device</span><span class="lz-d">the things they act on</span></div>
  <div class="lz-step"><span class="lz-k">resources</span><span class="lz-t">collection + item</span><span class="lz-d">/bookings · /bookings/{id}</span></div>
  <div class="lz-step"><span class="lz-k">methods</span><span class="lz-t">a few standard verbs</span><span class="lz-d">GET · POST · PUT · PATCH · DELETE</span></div>
</div>
<table>
  <thead><tr><th>LabFlow user story</th><th>Nouns</th><th>Becomes</th></tr></thead>
  <tbody>
    <tr><td>As a <strong>student</strong>, I see which <strong>labs</strong> exist and where they are</td><td>student, lab</td><td><code>labs</code>; students are <code>users</code></td></tr>
    <tr><td>As a student, I <strong>book</strong> a lab for Monday 8–10h</td><td>booking</td><td><code>bookings</code></td></tr>
    <tr><td>As a student, I see the <strong>devices</strong> in a lab</td><td>device</td><td><code>devices</code>, nested under <code>labs</code></td></tr>
    <tr><td>As a <strong>lab manager</strong>, I mark a device as under repair</td><td>device status</td><td>a <strong>field</strong>: <code>status</code></td></tr>
    <tr><td>As a student, I <strong>cancel</strong> my booking</td><td>(an action)</td><td><code>POST /bookings/{id}/cancel</code></td></tr>
  </tbody>
</table>
<p>The method is mechanical: underline the nouns, circle the verbs. Nouns become resources or fields; verbs become methods — and the few verbs that carry their own business rules (cancel, approve, resolve) become explicit actions. This is the same domain-modelling step you meet in requirements engineering (SWR302), applied to URLs.</p>

<h3>Smell: verbs in the URL</h3>
<table>
  <thead><tr><th>RPC-style (avoid)</th><th>Resource style (LabFlow)</th></tr></thead>
  <tbody>
    <tr><td><code>GET /getLabs</code></td><td><code>GET /labs</code></td></tr>
    <tr><td><code>GET /getLabById?id=lab_1</code></td><td><code>GET /labs/lab_1</code></td></tr>
    <tr><td><code>POST /createBooking</code></td><td><code>POST /bookings</code></td></tr>
    <tr><td><code>POST /updateDevice</code></td><td><code>PATCH /devices/dev_1</code></td></tr>
    <tr><td><code>GET /deleteDevice?id=dev_3</code></td><td><code>DELETE /devices/dev_3</code></td></tr>
  </tbody>
</table>
<p>The left column is not “wrong” in the sense of not working — plenty of internal APIs look like it. But every new operation needs a new name, clients cannot guess, and the last row is dangerous: a <code>GET</code> that deletes will eventually be triggered by a browser prefetching links, a crawler, or a monitoring tool that “just checks the URL”. Lesson 1.2 explains why GET must never change data.</p>

<h3>URL rules for LabFlow</h3>
<ol>
  <li><strong>Plural nouns</strong> for collections: <code>/labs</code>, not <code>/lab</code>. The item then reads naturally as <code>/labs/lab_1</code>.</li>
  <li><strong>Lowercase</strong>, words joined by <strong>hyphens</strong>: <code>/lab-rooms</code>, not <code>/labRooms</code> or <code>/lab_rooms</code>.</li>
  <li><strong>Ids in the path</strong>, options in the <strong>query</strong>: <code>/labs?building=Alpha</code>.</li>
  <li><strong>No verbs</strong>, no file extensions (<code>.json</code>, <code>.php</code>) — the <code>Content-Type</code> header says the format.</li>
  <li><strong>No trailing slash</strong> in documentation: <code>/labs</code>, not <code>/labs/</code>.</li>
  <li><strong>One style everywhere.</strong> Google’s API Improvement Proposals, Microsoft’s REST guidelines and Zalando’s guidelines broadly agree on these; what matters most is that your team writes its list down and follows it.</li>
</ol>

<h3>Build it: devices and a nested collection</h3>
<p>Extend the skeleton. First the data — two new things in <code>src/db.js</code>: a retired lab (used in lesson 1.3) and the devices:</p>
<pre><code class="language-javascript">export const labs = [
  { id: 'lab_1', code: 'AL-201', name: 'Phòng Lab Mạng máy tính', building: 'Alpha', capacity: 30 },
  { id: 'lab_2', code: 'AL-305', name: 'Phòng Lab IoT', building: 'Alpha', capacity: 24 },
  { id: 'lab_3', code: 'BE-102', name: 'Phòng Lab Phần mềm', building: 'Beta', capacity: 40 },
  { id: 'lab_4', code: 'BE-001', name: 'Phòng máy cũ', building: 'Beta', capacity: 20, retiredAt: '2026-09-01T00:00:00.000Z' },
];

export const devices = [
  { id: 'dev_1', labId: 'lab_1', name: 'Cisco Router 2901', type: 'ROUTER', serialNo: 'FTX1840ALBQ', status: 'AVAILABLE' },
  { id: 'dev_2', labId: 'lab_1', name: 'Cisco Switch 2960', type: 'SWITCH', serialNo: 'FOC1932X0K7', status: 'AVAILABLE' },
  { id: 'dev_3', labId: 'lab_2', name: 'Raspberry Pi 5', type: 'BOARD', serialNo: 'RPI5-00421', status: 'AVAILABLE', note: 'Thiếu thẻ nhớ' },
];</code></pre>
<p>Next, one small helper so every route can fail the same way. Create <code>src/http.js</code>:</p>
<pre><code class="language-javascript">// http.js — một chỗ duy nhất tạo lỗi, để mọi endpoint trả lỗi CÙNG một hình dạng
export class HttpError extends Error {
  constructor(status, error, message, details) {
    super(message);
    this.status = status;   // mã HTTP: 400, 404, 409…
    this.error = error;     // mã máy đọc: 'BOOKING_CONFLICT'
    this.details = details; // tuỳ chọn: lỗi từng trường
  }
}</code></pre>
<p>A route now just <code>throw</code>s an <code>HttpError</code>; Express 5 catches it and passes it to the error handler, which turns it into JSON. Update the error handler at the end of <code>app.js</code>:</p>
<pre><code class="language-javascript">app.use((err, req, res, next) =&gt; {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.error, message: err.message, ...(err.details &amp;&amp; { details: err.details }),
    });
  }
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: 'Máy chủ gặp lỗi, thử lại sau' });
});</code></pre>
<p>Then move the lab routes into their own file with an Express <strong>Router</strong> — a mini-app mounted at a prefix — in <code>src/routes/labs.js</code>:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { labs, devices } from '../db.js';
import { HttpError } from '../http.js';

export const labsRouter = Router();

function findLab(labId) {
  const lab = labs.find((l) =&gt; l.id === labId);
  if (!lab) throw new HttpError(404, 'LAB_NOT_FOUND', &#96;Không có phòng lab \${labId}&#96;);
  if (lab.retiredAt) throw new HttpError(410, 'LAB_RETIRED', &#96;Phòng lab \${labId} đã ngừng sử dụng từ \${lab.retiredAt}&#96;);
  return lab;
}

labsRouter.get('/', (req, res) =&gt; {
  const { building } = req.query;
  let data = labs.filter((l) =&gt; !l.retiredAt);
  if (building) data = data.filter((l) =&gt; l.building === building);
  res.json({ data });
});

labsRouter.get('/:labId', (req, res) =&gt; res.json(findLab(req.params.labId)));

// Bộ sưu tập con: thiết bị THUỘC một phòng lab
labsRouter.get('/:labId/devices', (req, res) =&gt; {
  const lab = findLab(req.params.labId);
  res.json({ data: devices.filter((d) =&gt; d.labId === lab.id) });
});</code></pre>
<p>And a first version of <code>src/routes/devices.js</code> with the flat collection and item (lesson 1.2 adds the writes):</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices } from '../db.js';
import { HttpError } from '../http.js';

export const devicesRouter = Router();

devicesRouter.get('/', (req, res) =&gt; {
  const { labId } = req.query;
  res.json({ data: labId ? devices.filter((d) =&gt; d.labId === labId) : devices });
});

devicesRouter.get('/:id', (req, res) =&gt; {
  const d = devices.find((x) =&gt; x.id === req.params.id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${req.params.id}&#96;);
  res.json(d);
});</code></pre>
<p>Finally mount both routers in <code>app.js</code>, replacing the old lab routes (keep <code>/health</code>, the 404 catch-all and the error handler):</p>
<pre><code class="language-javascript">import { labsRouter } from './routes/labs.js';
import { devicesRouter } from './routes/devices.js';
import { HttpError } from './http.js';
// …
app.use('/labs', labsRouter);       // mọi đường dẫn bắt đầu bằng /labs đi vào labsRouter
app.use('/devices', devicesRouter);</code></pre>

<h3>Try it</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_1/devices</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 374
ETag: W/"176-jN3l+C+mNXKkcjwCmDhjhidvtHI"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
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
    }
  ]
}</div>
<pre><code class="language-bash">curl http://localhost:4000/devices/dev_3
curl 'http://localhost:4000/labs?building=Beta'</code></pre>
<div class="out">{
  "id": "dev_3",
  "labId": "lab_2",
  "name": "Raspberry Pi 5",
  "type": "BOARD",
  "serialNo": "RPI5-00421",
  "status": "AVAILABLE",
  "note": "Thiếu thẻ nhớ"
}
{
  "data": [
    {
      "id": "lab_3",
      "code": "BE-102",
      "name": "Phòng Lab Phần mềm",
      "building": "Beta",
      "capacity": 40
    }
  ]
}</div>
<p>Notice <code>lab_4</code> is in Building Beta but not in the list: a retired lab is filtered out of the collection. Asking for it directly gives a clear answer (lesson 1.3 explains <code>410</code>):</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_4
curl -i http://localhost:4000/labs/lab_9/devices</code></pre>
<div class="out">HTTP/1.1 410 Gone
Content-Type: application/json; charset=utf-8
Content-Length: 116
ETag: W/"74-nU/6AXg8iy91/e8kJLXZ/JvgJwU"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_RETIRED",
  "message": "Phòng lab lab_4 đã ngừng sử dụng từ 2026-09-01T00:00:00.000Z"
}
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-lXLsqA33DrufMdXbcY1kiV4Dmbs"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}</div>

<h3>Nested URL or filter?</h3>
<p><code>GET /labs/lab_1/devices</code> and <code>GET /devices?labId=lab_1</code> return the same two devices. Which is right? Both, for different jobs:</p>
<table>
  <thead><tr><th></th><th>Nested <code>/labs/{labId}/devices</code></th><th>Filter <code>/devices?labId=</code></th></tr></thead>
  <tbody>
    <tr><td>Reads as</td><td>“the devices of this lab”</td><td>“devices, filtered by lab”</td></tr>
    <tr><td>Wrong lab id</td><td>404 <code>LAB_NOT_FOUND</code> — the parent is checked</td><td>200 with an empty list</td></tr>
    <tr><td>Grows into</td><td>one fixed question</td><td>many questions: <code>?status=</code>, <code>?type=</code>, combined</td></tr>
    <tr><td>Use for</td><td>a lab’s detail screen</td><td>search, admin tables, reports</td></tr>
  </tbody>
</table>
<p>LabFlow keeps both, on purpose and documented. What you should avoid is the accident where two endpoints return slightly different shapes for the same data.</p>

<h3>Stop at one level of nesting</h3>
<p>It is tempting to mirror the real world: <code>/buildings/alpha/labs/lab_1/devices/dev_1/issues/iss_3</code>. Resist. The client must know every parent id just to read one issue; moving the device to another lab changes the URL of all its issues; and every level is one more place where you must check that the child really belongs to that parent. The rule: <strong>nest a collection once</strong> under its parent, and give every item its own short, flat URL — <code>/devices/dev_1</code>, <code>/issues/iss_3</code>. Because ids are unique across the system, the flat URL is enough to find anything.</p>

<h3>Actions that are not create, read, update or delete</h3>
<p>Cancelling a booking is the classic case. Four honest options:</p>
<table>
  <thead><tr><th>Option</th><th>For</th><th>Against</th></tr></thead>
  <tbody>
    <tr><td><code>PATCH /bookings/bk_1</code> with <code>{"status": "CANCELLED"}</code></td><td>pure resource style</td><td>the rules of cancelling (only the owner or a manager, not twice, maybe a reason, a deadline) hide inside a generic “edit”</td></tr>
    <tr><td><code>POST /bookings/bk_1/cancel</code></td><td>one obvious endpoint with its own rules, permission and documentation</td><td>a verb in the path — but as a <em>sub-resource action</em>, not as the main design</td></tr>
    <tr><td><code>POST /bookings/bk_1:cancel</code></td><td>Google’s convention (AIP-136, “custom methods”)</td><td>the colon surprises many routers and developers</td></tr>
    <tr><td><code>DELETE /bookings/bk_1</code></td><td>short</td><td>the booking must <strong>stay</strong> for history and statistics: cancel is not delete</td></tr>
  </tbody>
</table>
<p>LabFlow’s rule: <strong>state changes that carry business rules get an explicit action endpoint</strong> (<code>/cancel</code>, later <code>/approve</code>, and <code>/resolve</code> in the chapter lab); <strong>plain field edits use PATCH</strong>. Here is the real call against the end-of-chapter code (bookings and the <code>Authorization</code> header arrive in lesson 1.3):</p>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings/bk_1/cancel -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 281
ETag: W/"119-MGGiCXXn/XfBXIZXRlwFpKQpJ9w"
Date: Sat, 31 Oct 2026 16:05:55 GMT
Connection: keep-alive
Keep-Alive: timeout=5

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
}</div>
<p>The booking still exists (a later <code>GET /bookings/bk_1</code> returns exactly this), the response carries the new state so the client needs no second call, and <code>cancelledAt</code> records when. Whatever you choose, write the rule into your API guidelines so the next endpoint follows it.</p>

<div class="pitfall"><p><strong>Trap — URLs shaped like screens or tables.</strong> <code>GET /labDetailPage?labId=lab_1</code> or <code>GET /homeScreenData</code> mirror today’s UI; <code>GET /tbl_lab_device_mapping</code> leaks a database table. Screens are redesigned every sprint and tables get renamed, but once a URL is in the contract it stays. Design resources for the <em>domain</em>; a screen may call two or three of them, and that is fine.</p></div>

<h3>In interviews and at work</h3>
<p>“Design the URLs for X” is a common opener. A calm answer: (1) list the nouns, usually 3–6; (2) give each a collection URL and an item URL; (3) choose the parent–child pairs that deserve one level of nesting; (4) name the special actions and say why they are not a PATCH; (5) say what you left out and how you would add it later without breaking clients. In code reviews, the same checklist catches most URL problems before they are frozen.</p>

<a class="link-card" href="https://google.aip.dev/121" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Google AIP-121 — Resource-oriented design — read 1 Nov 2026</span><span class="lc-sub">Google’s design guide in one line: an API is built from named resources (nouns) and a small number of standard methods (verbs) — custom methods only where those do not fit.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add the code above to your project and run the five curl commands; compare with the outputs (ignore <code>Date</code> and <code>ETag</code>).</li>
  <li>The lab managers ask: “Each lab has a weekly <strong>timetable</strong> of fixed class slots.” Design the URLs: collection, item, and whether to nest. Write one sentence of reasoning for each choice.</li>
  <li>“A manager can <strong>approve</strong> a pending booking.” Decide between <code>PATCH</code> and an action endpoint, using LabFlow’s rule, and write the endpoint.</li>
  <li>Rewrite these RPC URLs in resource style: <code>/getDevicesOfLab?lab=lab_2</code>, <code>/removeBooking/bk_3</code>, <code>/listMyBookings</code>.</li>
</ol>
<p><strong>Done when:</strong> your five commands match, and every URL you designed is a plural noun path with at most one level of nesting, plus at most one action endpoint with a written reason. (One possible answer: <code>/labs/{labId}/timetable-slots</code> + <code>/timetable-slots/{id}</code>; <code>POST /bookings/{id}/approve</code>; <code>GET /labs/lab_2/devices</code>, <code>POST /bookings/bk_3/cancel</code>, <code>GET /bookings</code> — the server already returns only the caller’s bookings.)</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Resource</span><span class="v">A thing the API exposes, with an identity, a state and a URL.</span></div>
  <div class="kv"><span class="k">Collection</span><span class="v">The set of all members, e.g. <code>/labs</code>; GET lists, POST adds.</span></div>
  <div class="kv"><span class="k">Item</span><span class="v">One member addressed by id, e.g. <code>/labs/lab_2</code>.</span></div>
  <div class="kv"><span class="k">Sub-collection (nested)</span><span class="v">A collection under a parent: <code>/labs/{labId}/devices</code>.</span></div>
  <div class="kv"><span class="k">Query parameter</span><span class="v">An option after <code>?</code> that filters or shapes the response.</span></div>
  <div class="kv"><span class="k">Custom action</span><span class="v">An endpoint for a rule-heavy state change: <code>POST /bookings/{id}/cancel</code>.</span></div>
  <div class="kv"><span class="k">Router (Express)</span><span class="v">A mini-app mounted under a prefix with <code>app.use('/labs', labsRouter)</code>.</span></div>
  <div class="kv"><span class="k">RPC-style URL</span><span class="v">A URL named after an action (<code>/createBooking</code>) instead of a resource.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Model the records the business keeps; most verbs then become HTTP methods.</li>
  <li>Each resource has a collection URL and an item URL: plural, lowercase, ids in the path, options in the query.</li>
  <li>Nest a collection once under its parent; keep every item’s URL short and flat.</li>
  <li>A nested URL and a filter can coexist when both are documented and return the same shape.</li>
  <li>Rule-heavy state changes become explicit actions; plain edits use PATCH; cancel is not delete.</li>
  <li>Design for the domain, never for today’s screens or database tables.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/software-requirements/learn?lessonSlug=swr302-4-2-domain-model-dfd" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWR302 — lesson 4.2: Domain model and DFD</span><span class="lc-sub">If you took SWR302 on Academy, the noun-hunting step will feel familiar. Same: finding the business entities and their relationships in the requirements. Different: SWR302 draws them as a domain model; here they become API resources and URLs. This lesson adds: collection and item URLs, one level of nesting, and how to treat actions such as cancel. If you have not taken SWR302, this lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SWR302 LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Mô hình hoá tài nguyên, không phải hành động</h2>
<p class="lead">Trước khi nói tới phương thức, mã trạng thái hay trường JSON, một API cần có <em>hình dạng</em>: nó phơi ra những sự vật nào, và địa chỉ của chúng là gì. Làm đúng bước này thì phần lớn quyết định về sau trở nên hiển nhiên; làm sai thì mỗi tính năng mới lại đẻ ra một URL mới. Trong bài này bạn biến yêu cầu của LabFlow thành tài nguyên và URL, mở rộng khung ở bài 0.3 với thiết bị và một bộ sưu tập lồng, và thiết kế hành động duy nhất không vừa khuôn — huỷ lượt đặt.</p>

<div class="callout ok">
<p><strong>Học xong Chương 1 bạn làm được:</strong></p>
<ul>
  <li>mô hình hoá một miền nghiệp vụ thành tài nguyên và URL thay vì động từ;</li>
  <li>chọn đúng phương thức và biết cái nào gửi lại an toàn;</li>
  <li>chọn đúng mã trạng thái cho mọi kết quả, theo một thứ tự cố định;</li>
  <li>đặt tên trường, ngày giờ, tiền và id để không client nào phải đoán.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> Đây là từ vựng của mọi buổi review API và mọi câu phỏng vấn “thiết kế API cho…”; các tài nguyên đầu tiên của LabFlow được dựng ở đây.</p>
</div>

<h3>Tài nguyên là gì?</h3>
<p>Một <strong>tài nguyên</strong> (resource) là bất cứ thứ gì API cho phép client gọi tên và làm việc cùng: một phòng lab, một thiết bị, một lượt đặt, một người dùng. Nó có ba đặc điểm:</p>
<ul>
  <li><strong>Danh tính</strong> (identity) không đổi: <code>lab_1</code>, <code>bk_7</code>.</li>
  <li><strong>Trạng thái</strong> (state) — dữ liệu hiện tại: tên, sức chứa, tình trạng.</li>
  <li><strong>Địa chỉ</strong> — URL của nó: <code>/labs/lab_1</code>.</li>
</ul>
<p>Điểm mấu chốt: đằng sau gần như mọi <em>động từ</em> trong yêu cầu là một <em>bản ghi</em> mà nghiệp vụ muốn lưu. "Tôi đặt phòng lab" trở thành một <strong>lượt đặt</strong> (booking) gồm phòng, người đặt, giờ bắt đầu, giờ kết thúc và trạng thái. "Tôi báo router hỏng" trở thành một <strong>phiếu báo hỏng</strong> (issue). "Quản lý duyệt" thì chẳng phải thứ gì mới — nó đổi <code>status</code> của lượt đặt. Mô hình hoá các bản ghi, rồi động từ phần lớn sẽ biến thành phương thức HTTP mà client vốn đã biết.</p>

<h3>Bộ sưu tập và phần tử</h3>
<table>
  <thead><tr><th>Hình dạng</th><th>URL</th><th>GET</th><th>POST</th><th>PUT / PATCH / DELETE</th></tr></thead>
  <tbody>
    <tr><td><strong>Bộ sưu tập</strong> (collection)</td><td><code>/labs</code></td><td>liệt kê các thành viên</td><td>thêm thành viên mới; server tự chọn id</td><td>— (hiếm khi áp lên cả bộ sưu tập)</td></tr>
    <tr><td><strong>Phần tử</strong> (item)</td><td><code>/labs/lab_2</code></td><td>đọc thành viên này</td><td>— (trừ các hành động, ở dưới)</td><td>thay / sửa / xoá thành viên này</td></tr>
  </tbody>
</table>
<p>Hai URL cho mỗi tài nguyên, cộng một nhúm phương thức — đó là toàn bộ bộ từ vựng client cần học. Hãy so với một API kiểu RPC, nơi mỗi thao tác lại có một cái tên riêng.</p>

<h3>Từ user story tới tài nguyên</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">user story</span><span class="lz-t">“Là sinh viên, tôi đặt phòng lab”</span><span class="lz-d">việc người dùng làm</span></div>
  <div class="lz-step"><span class="lz-k">danh từ</span><span class="lz-t">phòng, lượt đặt, thiết bị</span><span class="lz-d">thứ họ tác động lên</span></div>
  <div class="lz-step"><span class="lz-k">tài nguyên</span><span class="lz-t">bộ sưu tập + phần tử</span><span class="lz-d">/bookings · /bookings/{id}</span></div>
  <div class="lz-step"><span class="lz-k">phương thức</span><span class="lz-t">vài động từ chuẩn</span><span class="lz-d">GET · POST · PUT · PATCH · DELETE</span></div>
</div>
<table>
  <thead><tr><th>User story của LabFlow</th><th>Danh từ</th><th>Trở thành</th></tr></thead>
  <tbody>
    <tr><td>Là <strong>sinh viên</strong>, tôi xem có những <strong>phòng lab</strong> nào và ở đâu</td><td>sinh viên, phòng lab</td><td><code>labs</code>; sinh viên là <code>users</code></td></tr>
    <tr><td>Là sinh viên, tôi <strong>đặt</strong> một phòng cho thứ Hai 8–10h</td><td>lượt đặt</td><td><code>bookings</code></td></tr>
    <tr><td>Là sinh viên, tôi xem các <strong>thiết bị</strong> trong một phòng</td><td>thiết bị</td><td><code>devices</code>, lồng dưới <code>labs</code></td></tr>
    <tr><td>Là <strong>quản lý lab</strong>, tôi đánh dấu một thiết bị đang sửa chữa</td><td>tình trạng thiết bị</td><td>một <strong>trường</strong>: <code>status</code></td></tr>
    <tr><td>Là sinh viên, tôi <strong>huỷ</strong> lượt đặt của mình</td><td>(một hành động)</td><td><code>POST /bookings/{id}/cancel</code></td></tr>
  </tbody>
</table>
<p>Cách làm rất máy móc: gạch chân danh từ, khoanh tròn động từ. Danh từ thành tài nguyên hoặc trường; động từ thành phương thức — và vài động từ mang luật nghiệp vụ riêng (huỷ, duyệt, xử lý xong) thành hành động riêng. Đây chính là bước mô hình hoá miền nghiệp vụ bạn gặp trong môn kỹ nghệ yêu cầu (SWR302), áp dụng cho URL.</p>

<h3>Dấu hiệu đáng ngờ: động từ trong URL</h3>
<table>
  <thead><tr><th>Kiểu RPC (nên tránh)</th><th>Kiểu tài nguyên (LabFlow)</th></tr></thead>
  <tbody>
    <tr><td><code>GET /getLabs</code></td><td><code>GET /labs</code></td></tr>
    <tr><td><code>GET /getLabById?id=lab_1</code></td><td><code>GET /labs/lab_1</code></td></tr>
    <tr><td><code>POST /createBooking</code></td><td><code>POST /bookings</code></td></tr>
    <tr><td><code>POST /updateDevice</code></td><td><code>PATCH /devices/dev_1</code></td></tr>
    <tr><td><code>GET /deleteDevice?id=dev_3</code></td><td><code>DELETE /devices/dev_3</code></td></tr>
  </tbody>
</table>
<p>Cột trái không "sai" theo nghĩa chạy không được — rất nhiều API nội bộ trông y như vậy. Nhưng thao tác mới nào cũng cần một cái tên mới, client không đoán được, và dòng cuối thì nguy hiểm: một <code>GET</code> mà xoá dữ liệu sớm muộn sẽ bị kích hoạt bởi trình duyệt tải trước các liên kết, bởi crawler, hay bởi một công cụ giám sát "chỉ kiểm tra URL thôi". Bài 1.2 giải thích vì sao GET không bao giờ được thay đổi dữ liệu.</p>

<h3>Luật URL của LabFlow</h3>
<ol>
  <li><strong>Danh từ số nhiều</strong> cho bộ sưu tập: <code>/labs</code>, không phải <code>/lab</code>. Khi đó phần tử đọc tự nhiên là <code>/labs/lab_1</code>.</li>
  <li><strong>Chữ thường</strong>, các từ nối bằng <strong>gạch ngang</strong>: <code>/lab-rooms</code>, không phải <code>/labRooms</code> hay <code>/lab_rooms</code>.</li>
  <li><strong>Id nằm trong path</strong>, tuỳ chọn nằm trong <strong>query</strong>: <code>/labs?building=Alpha</code>.</li>
  <li><strong>Không động từ</strong>, không đuôi tệp (<code>.json</code>, <code>.php</code>) — header <code>Content-Type</code> mới là thứ nói định dạng.</li>
  <li><strong>Không có dấu gạch chéo cuối</strong> trong tài liệu: <code>/labs</code>, không phải <code>/labs/</code>.</li>
  <li><strong>Một phong cách ở mọi nơi.</strong> Các hướng dẫn API Improvement Proposals của Google, REST guidelines của Microsoft và của Zalando phần lớn đồng thuận những điểm này; quan trọng nhất là nhóm bạn viết danh sách của mình ra và tuân theo.</li>
</ol>

<h3>Làm thật: thiết bị và một bộ sưu tập lồng</h3>
<p>Mở rộng khung. Trước tiên là dữ liệu — hai thứ mới trong <code>src/db.js</code>: một phòng đã ngừng dùng (dùng ở bài 1.3) và các thiết bị:</p>
<pre><code class="language-javascript">export const labs = [
  { id: 'lab_1', code: 'AL-201', name: 'Phòng Lab Mạng máy tính', building: 'Alpha', capacity: 30 },
  { id: 'lab_2', code: 'AL-305', name: 'Phòng Lab IoT', building: 'Alpha', capacity: 24 },
  { id: 'lab_3', code: 'BE-102', name: 'Phòng Lab Phần mềm', building: 'Beta', capacity: 40 },
  { id: 'lab_4', code: 'BE-001', name: 'Phòng máy cũ', building: 'Beta', capacity: 20, retiredAt: '2026-09-01T00:00:00.000Z' },
];

export const devices = [
  { id: 'dev_1', labId: 'lab_1', name: 'Cisco Router 2901', type: 'ROUTER', serialNo: 'FTX1840ALBQ', status: 'AVAILABLE' },
  { id: 'dev_2', labId: 'lab_1', name: 'Cisco Switch 2960', type: 'SWITCH', serialNo: 'FOC1932X0K7', status: 'AVAILABLE' },
  { id: 'dev_3', labId: 'lab_2', name: 'Raspberry Pi 5', type: 'BOARD', serialNo: 'RPI5-00421', status: 'AVAILABLE', note: 'Thiếu thẻ nhớ' },
];</code></pre>
<p>Tiếp theo, một hàm trợ giúp nhỏ để route nào cũng báo lỗi theo cùng một kiểu. Tạo <code>src/http.js</code>:</p>
<pre><code class="language-javascript">// http.js — một chỗ duy nhất tạo lỗi, để mọi endpoint trả lỗi CÙNG một hình dạng
export class HttpError extends Error {
  constructor(status, error, message, details) {
    super(message);
    this.status = status;   // mã HTTP: 400, 404, 409…
    this.error = error;     // mã máy đọc: 'BOOKING_CONFLICT'
    this.details = details; // tuỳ chọn: lỗi từng trường
  }
}</code></pre>
<p>Giờ route chỉ việc <code>throw</code> một <code>HttpError</code>; Express 5 bắt nó và chuyển cho bộ xử lý lỗi, nơi biến nó thành JSON. Sửa bộ xử lý lỗi ở cuối <code>app.js</code>:</p>
<pre><code class="language-javascript">app.use((err, req, res, next) =&gt; {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.error, message: err.message, ...(err.details &amp;&amp; { details: err.details }),
    });
  }
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: 'Máy chủ gặp lỗi, thử lại sau' });
});</code></pre>
<p>Rồi chuyển các route của phòng lab sang tệp riêng bằng <strong>Router</strong> của Express — một "app thu nhỏ" gắn dưới một tiền tố — trong <code>src/routes/labs.js</code>:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { labs, devices } from '../db.js';
import { HttpError } from '../http.js';

export const labsRouter = Router();

function findLab(labId) {
  const lab = labs.find((l) =&gt; l.id === labId);
  if (!lab) throw new HttpError(404, 'LAB_NOT_FOUND', &#96;Không có phòng lab \${labId}&#96;);
  if (lab.retiredAt) throw new HttpError(410, 'LAB_RETIRED', &#96;Phòng lab \${labId} đã ngừng sử dụng từ \${lab.retiredAt}&#96;);
  return lab;
}

labsRouter.get('/', (req, res) =&gt; {
  const { building } = req.query;
  let data = labs.filter((l) =&gt; !l.retiredAt);
  if (building) data = data.filter((l) =&gt; l.building === building);
  res.json({ data });
});

labsRouter.get('/:labId', (req, res) =&gt; res.json(findLab(req.params.labId)));

// Bộ sưu tập con: thiết bị THUỘC một phòng lab
labsRouter.get('/:labId/devices', (req, res) =&gt; {
  const lab = findLab(req.params.labId);
  res.json({ data: devices.filter((d) =&gt; d.labId === lab.id) });
});</code></pre>
<p>Và phiên bản đầu của <code>src/routes/devices.js</code> với bộ sưu tập và phần tử phẳng (bài 1.2 thêm các thao tác ghi):</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices } from '../db.js';
import { HttpError } from '../http.js';

export const devicesRouter = Router();

devicesRouter.get('/', (req, res) =&gt; {
  const { labId } = req.query;
  res.json({ data: labId ? devices.filter((d) =&gt; d.labId === labId) : devices });
});

devicesRouter.get('/:id', (req, res) =&gt; {
  const d = devices.find((x) =&gt; x.id === req.params.id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${req.params.id}&#96;);
  res.json(d);
});</code></pre>
<p>Cuối cùng gắn hai router trong <code>app.js</code>, thay cho các route phòng lab cũ (giữ nguyên <code>/health</code>, lưới hứng 404 và bộ xử lý lỗi):</p>
<pre><code class="language-javascript">import { labsRouter } from './routes/labs.js';
import { devicesRouter } from './routes/devices.js';
import { HttpError } from './http.js';
// …
app.use('/labs', labsRouter);       // mọi đường dẫn bắt đầu bằng /labs đi vào labsRouter
app.use('/devices', devicesRouter);</code></pre>

<h3>Chạy thử</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_1/devices</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 374
ETag: W/"176-jN3l+C+mNXKkcjwCmDhjhidvtHI"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
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
    }
  ]
}</div>
<pre><code class="language-bash">curl http://localhost:4000/devices/dev_3
curl 'http://localhost:4000/labs?building=Beta'</code></pre>
<div class="out">{
  "id": "dev_3",
  "labId": "lab_2",
  "name": "Raspberry Pi 5",
  "type": "BOARD",
  "serialNo": "RPI5-00421",
  "status": "AVAILABLE",
  "note": "Thiếu thẻ nhớ"
}
{
  "data": [
    {
      "id": "lab_3",
      "code": "BE-102",
      "name": "Phòng Lab Phần mềm",
      "building": "Beta",
      "capacity": 40
    }
  ]
}</div>
<p>Để ý <code>lab_4</code> cũng ở toà Beta nhưng không có trong danh sách: phòng đã ngừng dùng bị lọc khỏi bộ sưu tập. Hỏi thẳng nó thì nhận được câu trả lời rõ ràng (bài 1.3 giải thích mã <code>410</code>):</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_4
curl -i http://localhost:4000/labs/lab_9/devices</code></pre>
<div class="out">HTTP/1.1 410 Gone
Content-Type: application/json; charset=utf-8
Content-Length: 116
ETag: W/"74-nU/6AXg8iy91/e8kJLXZ/JvgJwU"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_RETIRED",
  "message": "Phòng lab lab_4 đã ngừng sử dụng từ 2026-09-01T00:00:00.000Z"
}
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-lXLsqA33DrufMdXbcY1kiV4Dmbs"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}</div>

<h3>URL lồng hay bộ lọc?</h3>
<p><code>GET /labs/lab_1/devices</code> và <code>GET /devices?labId=lab_1</code> trả về cùng hai thiết bị. Cái nào đúng? Cả hai, cho những việc khác nhau:</p>
<table>
  <thead><tr><th></th><th>Lồng <code>/labs/{labId}/devices</code></th><th>Lọc <code>/devices?labId=</code></th></tr></thead>
  <tbody>
    <tr><td>Đọc là</td><td>"các thiết bị của phòng này"</td><td>"thiết bị, lọc theo phòng"</td></tr>
    <tr><td>Id phòng sai</td><td>404 <code>LAB_NOT_FOUND</code> — cha được kiểm tra</td><td>200 với danh sách rỗng</td></tr>
    <tr><td>Phát triển thành</td><td>một câu hỏi cố định</td><td>nhiều câu hỏi: <code>?status=</code>, <code>?type=</code>, kết hợp</td></tr>
    <tr><td>Dùng cho</td><td>màn hình chi tiết một phòng</td><td>tìm kiếm, bảng quản trị, báo cáo</td></tr>
  </tbody>
</table>
<p>LabFlow giữ cả hai, có chủ đích và có ghi trong tài liệu. Điều cần tránh là tai nạn khi hai endpoint trả về những hình dạng hơi khác nhau cho cùng một dữ liệu.</p>

<h3>Dừng ở một tầng lồng</h3>
<p>Rất dễ bị cám dỗ sao chép thế giới thật: <code>/buildings/alpha/labs/lab_1/devices/dev_1/issues/iss_3</code>. Đừng. Client phải biết mọi id của các tầng cha chỉ để đọc một phiếu báo hỏng; chuyển thiết bị sang phòng khác là URL của mọi phiếu báo hỏng của nó đổi theo; và mỗi tầng là thêm một chỗ phải kiểm tra con có thật sự thuộc cha đó không. Luật: <strong>lồng một bộ sưu tập một lần</strong> dưới cha của nó, và cho mọi phần tử một URL ngắn, phẳng của riêng nó — <code>/devices/dev_1</code>, <code>/issues/iss_3</code>. Vì id là duy nhất trong toàn hệ thống, URL phẳng là đủ để tìm ra bất cứ thứ gì.</p>

<h3>Những hành động không phải tạo, đọc, sửa, xoá</h3>
<p>Huỷ lượt đặt là ví dụ kinh điển. Bốn lựa chọn sòng phẳng:</p>
<table>
  <thead><tr><th>Lựa chọn</th><th>Ủng hộ</th><th>Phản đối</th></tr></thead>
  <tbody>
    <tr><td><code>PATCH /bookings/bk_1</code> với <code>{"status": "CANCELLED"}</code></td><td>đúng kiểu tài nguyên thuần</td><td>các luật huỷ (chỉ chủ hoặc quản lý, không huỷ hai lần, có thể cần lý do, hạn chót) bị giấu trong một thao tác "sửa" chung chung</td></tr>
    <tr><td><code>POST /bookings/bk_1/cancel</code></td><td>một endpoint rõ ràng với luật, quyền và tài liệu riêng</td><td>có động từ trong path — nhưng là <em>hành động con</em>, không phải cách thiết kế chính</td></tr>
    <tr><td><code>POST /bookings/bk_1:cancel</code></td><td>quy ước của Google (AIP-136, "custom methods")</td><td>dấu hai chấm làm nhiều router và lập trình viên bất ngờ</td></tr>
    <tr><td><code>DELETE /bookings/bk_1</code></td><td>ngắn</td><td>lượt đặt phải được <strong>giữ lại</strong> làm lịch sử và thống kê: huỷ không phải xoá</td></tr>
  </tbody>
</table>
<p>Luật của LabFlow: <strong>thay đổi trạng thái có luật nghiệp vụ thì có endpoint hành động riêng</strong> (<code>/cancel</code>, sau này <code>/approve</code>, và <code>/resolve</code> trong lab của chương); <strong>sửa trường đơn thuần thì dùng PATCH</strong>. Đây là lời gọi thật trên code cuối chương (lượt đặt và header <code>Authorization</code> tới ở bài 1.3):</p>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings/bk_1/cancel -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 281
ETag: W/"119-MGGiCXXn/XfBXIZXRlwFpKQpJ9w"
Date: Sat, 31 Oct 2026 16:05:55 GMT
Connection: keep-alive
Keep-Alive: timeout=5

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
}</div>
<p>Lượt đặt vẫn tồn tại (một <code>GET /bookings/bk_1</code> sau đó trả về đúng nội dung này), response mang trạng thái mới nên client không cần gọi thêm, và <code>cancelledAt</code> ghi lại thời điểm. Dù chọn cách nào, hãy ghi luật vào hướng dẫn API của nhóm để endpoint kế tiếp làm theo.</p>

<div class="pitfall"><p><strong>Bẫy — URL mang hình dạng màn hình hoặc bảng dữ liệu.</strong> <code>GET /labDetailPage?labId=lab_1</code> hay <code>GET /homeScreenData</code> sao chép giao diện hôm nay; <code>GET /tbl_lab_device_mapping</code> làm lộ một bảng cơ sở dữ liệu. Màn hình được thiết kế lại mỗi sprint, bảng thì bị đổi tên, nhưng một URL đã vào hợp đồng thì ở lại mãi. Hãy thiết kế tài nguyên theo <em>nghiệp vụ</em>; một màn hình gọi hai ba tài nguyên cũng chẳng sao.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p>"Hãy thiết kế URL cho X" là câu mở đầu quen thuộc. Một câu trả lời điềm tĩnh: (1) liệt kê danh từ, thường 3–6 cái; (2) mỗi cái một URL bộ sưu tập và một URL phần tử; (3) chọn những cặp cha–con đáng lồng một tầng; (4) gọi tên các hành động đặc biệt và nói vì sao chúng không phải PATCH; (5) nói ra những gì bạn bỏ qua và cách thêm vào sau mà không làm vỡ client. Khi review code, chính danh sách này bắt được phần lớn lỗi URL trước khi chúng bị "đóng băng".</p>

<a class="link-card" href="https://google.aip.dev/121" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Google AIP-121 — Resource-oriented design — đọc ngày 1/11/2026</span><span class="lc-sub">Hướng dẫn thiết kế của Google trong một dòng: API dựng từ tài nguyên có tên (danh từ) và vài phương thức chuẩn (động từ) — phương thức tuỳ biến chỉ khi chúng không vừa.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm code ở trên vào dự án và chạy năm lệnh curl; so với output trong bài (bỏ qua <code>Date</code> và <code>ETag</code>).</li>
  <li>Quản lý lab yêu cầu: "Mỗi phòng có một <strong>thời khoá biểu</strong> hằng tuần gồm các tiết học cố định." Thiết kế URL: bộ sưu tập, phần tử, và có lồng hay không. Viết một câu lý giải cho mỗi lựa chọn.</li>
  <li>"Quản lý có thể <strong>duyệt</strong> một lượt đặt đang chờ." Chọn giữa <code>PATCH</code> và một endpoint hành động theo luật của LabFlow, rồi viết endpoint đó.</li>
  <li>Viết lại các URL kiểu RPC sau theo kiểu tài nguyên: <code>/getDevicesOfLab?lab=lab_2</code>, <code>/removeBooking/bk_3</code>, <code>/listMyBookings</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> năm lệnh của bạn khớp, và mọi URL bạn thiết kế đều là đường dẫn danh từ số nhiều, lồng tối đa một tầng, cộng tối đa một endpoint hành động có lý do ghi rõ. (Một đáp án khả dĩ: <code>/labs/{labId}/timetable-slots</code> + <code>/timetable-slots/{id}</code>; <code>POST /bookings/{id}/approve</code>; <code>GET /labs/lab_2/devices</code>, <code>POST /bookings/bk_3/cancel</code>, <code>GET /bookings</code> — server vốn đã chỉ trả về các lượt đặt của người gọi.)</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Resource (tài nguyên)</span><span class="v">Một sự vật API phơi ra, có danh tính, trạng thái và URL.</span></div>
  <div class="kv"><span class="k">Collection (bộ sưu tập)</span><span class="v">Tập mọi thành viên, ví dụ <code>/labs</code>; GET liệt kê, POST thêm.</span></div>
  <div class="kv"><span class="k">Item (phần tử)</span><span class="v">Một thành viên gọi bằng id, ví dụ <code>/labs/lab_2</code>.</span></div>
  <div class="kv"><span class="k">Sub-collection (bộ sưu tập lồng)</span><span class="v">Bộ sưu tập nằm dưới một cha: <code>/labs/{labId}/devices</code>.</span></div>
  <div class="kv"><span class="k">Query parameter (tham số truy vấn)</span><span class="v">Tuỳ chọn sau dấu <code>?</code> để lọc hoặc định hình response.</span></div>
  <div class="kv"><span class="k">Custom action (hành động riêng)</span><span class="v">Endpoint cho một thay đổi trạng thái nhiều luật: <code>POST /bookings/{id}/cancel</code>.</span></div>
  <div class="kv"><span class="k">Router (Express)</span><span class="v">"App thu nhỏ" gắn dưới một tiền tố bằng <code>app.use('/labs', labsRouter)</code>.</span></div>
  <div class="kv"><span class="k">RPC-style URL (URL kiểu RPC)</span><span class="v">URL đặt theo hành động (<code>/createBooking</code>) thay vì theo tài nguyên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mô hình hoá các bản ghi mà nghiệp vụ lưu giữ; khi đó phần lớn động từ thành phương thức HTTP.</li>
  <li>Mỗi tài nguyên có một URL bộ sưu tập và một URL phần tử: số nhiều, chữ thường, id trong path, tuỳ chọn trong query.</li>
  <li>Lồng một bộ sưu tập một lần dưới cha của nó; URL của mọi phần tử ngắn và phẳng.</li>
  <li>URL lồng và bộ lọc có thể cùng tồn tại nếu cả hai được ghi tài liệu và trả cùng hình dạng.</li>
  <li>Thay đổi trạng thái nhiều luật thành hành động riêng; sửa đơn thuần dùng PATCH; huỷ không phải xoá.</li>
  <li>Thiết kế theo nghiệp vụ, đừng bao giờ theo màn hình hôm nay hay bảng cơ sở dữ liệu.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/software-requirements/learn?lessonSlug=swr302-4-2-domain-model-dfd" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp phần này ở SWR302 — bài 4.2: Domain model và DFD</span><span class="lc-sub">Nếu bạn đã học SWR302 trên Academy, bước "săn danh từ" sẽ quen. Giống: tìm các thực thể nghiệp vụ và quan hệ giữa chúng trong yêu cầu. Khác: SWR302 vẽ chúng thành domain model; ở đây chúng thành tài nguyên và URL của API. Bài này thêm: URL bộ sưu tập và phần tử, lồng một tầng, và cách xử lý những hành động như huỷ. Chưa học SWR302 thì bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SWR302 →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Methods and their guarantees: safe, idempotent, PUT vs PATCH|||1.2 — Phương thức và cam kết của chúng: safe, idempotent, PUT và PATCH',
      slug: 'api-1-2-phuong-thuc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Safe và idempotent theo RFC 9110, vì sao quyết định việc gửi lại; POST/PUT/DELETE hai lần chạy thật; PUT thay toàn bộ, PATCH theo JSON Merge Patch; HEAD, OPTIONS, 405 + Allow.',
      content: `${G012}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Methods and their guarantees</h2>
<p class="lead">Choosing between POST, PUT, PATCH and DELETE is not a matter of taste. Each method carries promises defined by the HTTP standard, and clients, proxies and browsers act on those promises — most importantly when deciding whether a failed request may be sent again. In this lesson you add device writes to LabFlow and watch each method’s promise hold (or not) on real requests.</p>

<h3>Two promises: safe and idempotent</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">GET · HEAD · OPTIONS</span><span class="lz-lnote">safe (read-only) and idempotent — retry freely</span></div>
  <div class="lz-layer"><span class="lz-lname">PUT · DELETE</span><span class="lz-lnote">idempotent — the second identical request changes nothing more</span></div>
  <div class="lz-layer"><span class="lz-lname">PATCH</span><span class="lz-lnote">idempotent only if the patch says “set”, not “add 1”</span></div>
  <div class="lz-layer"><span class="lz-lname">POST</span><span class="lz-lnote">neither — a retry may create a second record (Chapter 5 fixes this)</span></div>
</div>
<p>RFC 9110 (“HTTP Semantics”, §9.2) defines two properties:</p>
<ul>
  <li><strong>Safe</strong> — the client does not ask for any change on the server. GET, HEAD and OPTIONS are safe. The server may still write a log line or a counter; what matters is that the client did not <em>request</em> a change, so browsers may prefetch these requests and crawlers may follow them.</li>
  <li><strong>Idempotent</strong> — sending the same request N times has the same <em>effect on the server</em> as sending it once. All safe methods are idempotent, and so are PUT and DELETE. That is what allows a client, or a proxy in between, to resend the request automatically after a network failure.</li>
</ul>
<table>
  <thead><tr><th>Method</th><th>Safe</th><th>Idempotent</th><th>LabFlow use</th><th>Success code</th></tr></thead>
  <tbody>
    <tr><td>GET</td><td>yes</td><td>yes</td><td>read a lab, list devices</td><td>200</td></tr>
    <tr><td>HEAD</td><td>yes</td><td>yes</td><td>headers only</td><td>200</td></tr>
    <tr><td>OPTIONS</td><td>yes</td><td>yes</td><td>“which methods work here?”</td><td>204 + <code>Allow</code></td></tr>
    <tr><td>PUT</td><td>no</td><td>yes</td><td>replace a whole device</td><td>200 (201 if PUT creates)</td></tr>
    <tr><td>DELETE</td><td>no</td><td>yes</td><td>remove a device</td><td>204</td></tr>
    <tr><td>POST</td><td>no</td><td>no</td><td>create a booking or device; actions like cancel</td><td>201 / 200</td></tr>
    <tr><td>PATCH</td><td>no</td><td>not promised</td><td>change some device fields</td><td>200</td></tr>
  </tbody>
</table>

<h3>Why it matters: the lost response</h3>
<p>A student’s phone sends <code>POST /devices</code>. The server saves the device and sends <code>201 Created</code> — and the Wi-Fi drops before the response arrives. From the phone’s point of view, the request timed out. It cannot know whether the request was lost on the way in or the response was lost on the way out. Should it retry?</p>
<ul>
  <li>For an <strong>idempotent</strong> method (GET, PUT, DELETE) — yes, always safe: the end state is the same.</li>
  <li>For <strong>POST</strong> — a retry may create a second device. Chapter 5 makes POST retries safe with <em>idempotency keys</em>; until then, a client must not retry POST blindly.</li>
</ul>

<h3>Build it: who may write, and the device writes</h3>
<p>Writes need to know who is calling. Real authentication is Chapter 6; for now LabFlow uses three fixed demo tokens. Add to <code>src/db.js</code>:</p>
<pre><code class="language-javascript">export const users = [
  { id: 'usr_1', name: 'Nguyễn Văn An', role: 'STUDENT' },
  { id: 'usr_2', name: 'Trần Thị Bình', role: 'STUDENT' },
  { id: 'usr_3', name: 'Cô Lan', role: 'LAB_MANAGER' },
];

// Token giả để học — xác thực thật (JWT, OAuth) học ở Chương 6
export const tokens = { tok_an: 'usr_1', tok_bin: 'usr_2', tok_lan: 'usr_3' };

export const bookings = [];

const counters = { bk: 0, dev: devices.length };
export const nextId = (prefix) =&gt; &#96;\${prefix}_\${++counters[prefix]}&#96;;</code></pre>
<p>Create <code>src/auth.js</code> with two middlewares (lesson 1.3 explains their 401 and 403 answers; lesson 1.4 fixes one bug in the first line):</p>
<pre><code class="language-javascript">import { tokens, users } from './db.js';
import { HttpError } from './http.js';

// Đọc "Authorization: Bearer &lt;token&gt;" ⇒ req.user. Không có/sai ⇒ 401.
export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('Authorization') ?? '').split(' ');
  const userId = scheme === 'Bearer' ? tokens[token] : undefined;
  if (!userId) {
    res.set('WWW-Authenticate', 'Bearer realm="labflow"');
    throw new HttpError(401, 'UNAUTHENTICATED', 'Cần đăng nhập (thiếu hoặc sai token)');
  }
  req.user = users.find((u) =&gt; u.id === userId);
  next();
}

export function requireRole(role) {
  return (req, res, next) =&gt; {
    if (req.user.role !== role) throw new HttpError(403, 'FORBIDDEN', &#96;Chỉ \${role} được làm việc này&#96;);
    next();
  };
}</code></pre>
<p>Now the full <code>src/routes/devices.js</code>. Read the comments: they state the contract of each method.</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices, labs, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';

export const devicesRouter = Router();
const FIELDS = ['labId', 'name', 'type', 'serialNo', 'status'];   // PUT phải gửi đủ
const STATUSES = ['AVAILABLE', 'IN_USE', 'MAINTENANCE'];

function findDevice(id) {
  const d = devices.find((x) =&gt; x.id === id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${id}&#96;);
  return d;
}
function checkValues(body) {
  if (body.status !== undefined &amp;&amp; !STATUSES.includes(body.status))
    throw new HttpError(400, 'VALIDATION_FAILED', &#96;status phải là một trong \${STATUSES.join(', ')}&#96;);
  if (body.labId !== undefined &amp;&amp; !labs.some((l) =&gt; l.id === body.labId))
    throw new HttpError(422, 'UNKNOWN_LAB', &#96;labId \${body.labId} không tồn tại&#96;);
}

devicesRouter.route('/')
  .get((req, res) =&gt; {
    const { labId } = req.query;
    res.json({ data: labId ? devices.filter((d) =&gt; d.labId === labId) : devices });
  })
  // POST vào BỘ SƯU TẬP = tạo phần tử mới, server tự đặt id
  .post(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const missing = FIELDS.filter((f) =&gt; req.body?.[f] === undefined);
    if (missing.length) throw new HttpError(400, 'VALIDATION_FAILED', 'Thiếu trường bắt buộc', missing.map((f) =&gt; ({ field: f, issue: 'required' })));
    checkValues(req.body);
    const device = { id: nextId('dev') };
    for (const f of [...FIELDS, 'note']) if (req.body[f] !== undefined) device[f] = req.body[f];
    devices.push(device);
    res.status(201).location(&#96;/devices/\${device.id}&#96;).json(device);
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

devicesRouter.route('/:id')
  .get((req, res) =&gt; res.json(findDevice(req.params.id)))
  // PUT = THAY TOÀN BỘ: client gửi đủ mọi trường, thiếu ⇒ 400
  .put(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    const missing = FIELDS.filter((f) =&gt; req.body?.[f] === undefined);
    if (missing.length) throw new HttpError(400, 'VALIDATION_FAILED', 'PUT cần đủ mọi trường', missing.map((f) =&gt; ({ field: f, issue: 'required' })));
    checkValues(req.body);
    const next = { id: d.id };
    for (const f of [...FIELDS, 'note']) if (req.body[f] !== undefined) next[f] = req.body[f];
    Object.keys(d).forEach((k) =&gt; delete d[k]);
    Object.assign(d, next);
    res.json(d);
  })
  // PATCH = SỬA MỘT PHẦN theo JSON Merge Patch (RFC 7396): null nghĩa là xoá trường
  .patch(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    if (!req.is('application/merge-patch+json') &amp;&amp; !req.is('application/json'))
      throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Gửi body dạng application/merge-patch+json');
    if ('id' in (req.body ?? {})) throw new HttpError(400, 'VALIDATION_FAILED', 'Không được đổi id');
    checkValues(req.body);
    for (const [k, v] of Object.entries(req.body ?? {})) {
      if (v === null) delete d[k];
      else d[k] = v;
    }
    res.json(d);
  })
  .delete(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const i = devices.findIndex((x) =&gt; x.id === req.params.id);
    if (i === -1) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${req.params.id}&#96;);
    devices.splice(i, 1);
    res.status(204).end();   // xoá xong, không có gì để trả
  })
  .all(onlyAllow('GET', 'HEAD', 'PUT', 'PATCH', 'DELETE'));</code></pre>
<p>New pieces to notice: <code>devicesRouter.route('/:id')</code> groups all methods of one URL in one chain; middlewares such as <code>requireAuth</code> can be placed before the handler of a single method; <code>req.body?.[f]</code> uses optional chaining so a missing body does not crash; and <code>res.status(204).end()</code> sends a success with no body.</p>
<p>Two small changes elsewhere. In <code>app.js</code>, let <code>express.json()</code> also parse Merge Patch bodies:</p>
<pre><code class="language-javascript">app.use(express.json({ type: ['application/json', 'application/merge-patch+json'] }));</code></pre>
<p>And in <code>src/http.js</code>, add the helper that answers wrong methods (explained below):</p>
<pre><code class="language-javascript">// Route có thật nhưng sai phương thức ⇒ 405 + header Allow
export const onlyAllow = (...methods) =&gt; (req, res) =&gt; {
  res.set('Allow', methods.join(', '));
  if (req.method === 'OPTIONS') return res.status(204).end();
  throw new HttpError(405, 'METHOD_NOT_ALLOWED',
    &#96;\${req.method} không dùng được ở \${req.baseUrl}\${req.path}&#96;);
};</code></pre>

<h3>POST twice: two devices</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/devices -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_2","name":"Arduino Uno R4","type":"BOARD","serialNo":"ARD-R4-0099","status":"AVAILABLE"}'
curl -X POST http://localhost:4000/devices -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_2","name":"Arduino Uno R4","type":"BOARD","serialNo":"ARD-R4-0099","status":"AVAILABLE"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /devices/dev_4
Content-Type: application/json; charset=utf-8
Content-Length: 140
ETag: W/"8c-DhbYWIhI3BBrBLWjVu17igTqPOY"
Date: Sat, 31 Oct 2026 15:43:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "dev_4",
  "labId": "lab_2",
  "name": "Arduino Uno R4",
  "type": "BOARD",
  "serialNo": "ARD-R4-0099",
  "status": "AVAILABLE"
}
{
  "id": "dev_5",
  "labId": "lab_2",
  "name": "Arduino Uno R4",
  "type": "BOARD",
  "serialNo": "ARD-R4-0099",
  "status": "AVAILABLE"
}</div>
<p>Same request, two different resources: <code>dev_4</code> and <code>dev_5</code>, identical except for the id. <code>GET /devices?labId=lab_2</code> now lists three boards. This is POST working <em>correctly</em> — “create a new member” — and it is exactly why a timed-out POST must not be retried blindly. (The chapter lab adds a unique serial-number rule that turns the second call into <code>409 Conflict</code>.)</p>

<h3>POST a booking twice: a rule hides the problem</h3>
<p>Looking ahead to lesson 1.3, here is what the end-of-chapter code does when the same booking is sent twice:</p>
<pre><code class="language-bash">curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"SWT301 Lab 3"}'
# … the same command again …</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": "SWT301 Lab 3",
  "status": "PENDING",
  "createdAt": "2026-10-31T15:43:10.309Z"
}
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 101
ETag: W/"65-jELg4Gt2GmgcAO47S0BO+GCp3pc"
Date: Sat, 31 Oct 2026 15:43:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "BOOKING_CONFLICT",
  "message": "Phòng đã có lượt bk_1 trong khung giờ này"
}</div>
<p>The no-double-booking rule rejected the second copy — lucky. But think about the client: if the first response was lost and the retry got 409, the app shows an <em>error</em> for a booking that actually <em>succeeded</em>. And two one-hour bookings back to back would not overlap, so a retry would create a real duplicate. Business rules are not a retry strategy.</p>

<h3>PUT twice: same state</h3>
<pre><code class="language-bash">curl -X PUT http://localhost:4000/devices/dev_1 -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_1","name":"Cisco Router 2901","type":"ROUTER","serialNo":"FTX1840ALBQ","status":"MAINTENANCE"}'</code></pre>
<div class="out">{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "MAINTENANCE"
}</div>
<p>Run the same command again and you get exactly the same output. PUT means “make the resource <em>at this URL</em> look exactly like this body”. The second time, it already does. And because the client named the URL, there is no way to create a twin.</p>

<h3>PUT replaces everything — so LabFlow refuses half a body</h3>
<pre><code class="language-bash">curl -i -X PUT http://localhost:4000/devices/dev_1 -H 'Authorization: Bearer tok_lan' --json '{"status":"AVAILABLE"}'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 354
ETag: W/"162-tMaIw2eMDLD00X+OdcxIP+elYyY"
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

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
    {
      "field": "type",
      "issue": "required"
    },
    {
      "field": "serialNo",
      "issue": "required"
    }
  ]
}</div>
<p>A naive PUT handler that stores the body as received would have turned <code>dev_1</code> into <code>{ "id": "dev_1", "status": "AVAILABLE" }</code> — the name, type and serial number gone. That is the edit-form bug from the Section 0 demo story. There are two honest policies: <strong>strict</strong> (every field required, else 400 — LabFlow) or <strong>lenient</strong> (a missing field is reset to its default). Choose one and document it; never let “missing” silently mean “delete”.</p>

<h3>PATCH with JSON Merge Patch</h3>
<pre><code class="language-bash">curl -X PATCH http://localhost:4000/devices/dev_3 -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' -d '{"status":"MAINTENANCE","note":null}'</code></pre>
<div class="out">{
  "id": "dev_3",
  "labId": "lab_2",
  "name": "Raspberry Pi 5",
  "type": "BOARD",
  "serialNo": "RPI5-00421",
  "status": "MAINTENANCE"
}</div>
<p>Before the call, <code>dev_3</code> had <code>"status": "AVAILABLE"</code> and <code>"note": "Thiếu thẻ nhớ"</code>. JSON Merge Patch (RFC 7396) has three rules, and all three are visible here:</p>
<table>
  <thead><tr><th>In the patch body</th><th>Effect</th><th>Here</th></tr></thead>
  <tbody>
    <tr><td>a field with a value</td><td>set it</td><td><code>status</code> → <code>MAINTENANCE</code></td></tr>
    <tr><td>a field with <code>null</code></td><td>remove it</td><td><code>note</code> is gone</td></tr>
    <tr><td>a field not mentioned</td><td>leave it untouched</td><td><code>name</code>, <code>type</code>, <code>serialNo</code> unchanged</td></tr>
  </tbody>
</table>
<p>The media type <code>application/merge-patch+json</code> tells the server which patch format you mean. (There is another standard, JSON Patch, RFC 6902, which sends a list of operations such as <code>{"op": "replace", "path": "/status", "value": "IN_USE"}</code>; it is more powerful and more verbose. Merge Patch covers most API needs.) Sending the patch as <code>text/plain</code> gets <code>415 Unsupported Media Type</code> — lesson 1.3.</p>

<h3>PUT or PATCH?</h3>
<table>
  <thead><tr><th></th><th>PUT</th><th>PATCH (Merge Patch)</th></tr></thead>
  <tbody>
    <tr><td>Body contains</td><td>the whole new resource</td><td>only the fields to change</td></tr>
    <tr><td>Missing field means</td><td>error (strict) or reset (lenient)</td><td>leave it alone</td></tr>
    <tr><td>Idempotent?</td><td>always</td><td>Merge Patch: yes in practice; PATCH in general: not promised (an <code>increment</code> operation is not)</td></tr>
    <tr><td>Good for</td><td>forms that edit everything, sync jobs</td><td>toggles, status changes, slow mobile networks</td></tr>
    <tr><td>Risk</td><td>wiping fields the client forgot to send</td><td>a stray <code>null</code> removing a field you needed</td></tr>
  </tbody>
</table>

<h3>DELETE twice: 204, then 404 — still idempotent</h3>
<pre><code class="language-bash">curl -i -X DELETE http://localhost:4000/devices/dev_2 -H 'Authorization: Bearer tok_lan'
curl -i -X DELETE http://localhost:4000/devices/dev_2 -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 204 No Content
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-wlwv38lzM/vSkJyPwiWUFoI4HMY"
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "DEVICE_NOT_FOUND",
  "message": "Không có thiết bị dev_2"
}</div>
<p>Different responses, same effect: after one call or two, <code>dev_2</code> does not exist. Idempotency is a promise about the <strong>server’s state</strong>, not about identical replies. A client that retried a DELETE should therefore treat 404 as “already done”. (Some APIs answer 204 to every DELETE, even of a missing id, to make retries quieter. Either choice is fine if documented.)</p>

<h3>HEAD, OPTIONS and 405 Method Not Allowed</h3>
<p>Before <code>onlyAllow</code> existed, the skeleton from lesson 0.3 answered a wrong method like this:</p>
<pre><code class="language-bash">curl -i -X DELETE http://localhost:4000/labs
curl -i -X OPTIONS http://localhost:4000/labs</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 72
ETag: W/"48-QvJkI+4uhdqyzCa6Nl6J17B22qk"
Date: Sat, 31 Oct 2026 15:41:38 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ROUTE_NOT_FOUND",
  "message": "Không có DELETE /labs"
}
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 73
ETag: W/"49-S1S7m5cE9PeoMvKT19gkHWTSOGs"
Date: Sat, 31 Oct 2026 15:41:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ROUTE_NOT_FOUND",
  "message": "Không có OPTIONS /labs"
}</div>
<p>Both say “there is nothing at <code>/labs</code>”, which is false: the URL exists, only the method is wrong. (Express does answer OPTIONS by itself — but only if no middleware handles the request first, and our JSON 404 catch-all does.) The precise answer is <strong>405 Method Not Allowed</strong> with an <code>Allow</code> header listing what <em>is</em> allowed. To get it, write each URL as one <code>route()</code> chain that ends with <code>.all(onlyAllow(…))</code>, as in <code>devices.js</code> above, and do the same in <code>labs.js</code>:</p>
<pre><code class="language-javascript">labsRouter.route('/:labId')
  .get((req, res) =&gt; res.json(findLab(req.params.labId)))
  .all(onlyAllow('GET', 'HEAD'));</code></pre>
<pre><code class="language-bash">curl -I http://localhost:4000/labs
curl -i -X OPTIONS http://localhost:4000/devices/dev_1
curl -i -X DELETE http://localhost:4000/labs/lab_1</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 454
ETag: W/"1c6-+s1YqANIrEdiSpnMGpMRE1CaNZg"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

HTTP/1.1 204 No Content
Allow: GET, HEAD, PUT, PATCH, DELETE
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: application/json; charset=utf-8
Content-Length: 96
ETag: W/"60-s0sK3aD6cJANyiOD1rsS+XhToCY"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "METHOD_NOT_ALLOWED",
  "message": "DELETE không dùng được ở /labs/lab_1"
}</div>
<p>HEAD returned the headers a GET would return (note <code>Content-Length: 454</code>) but no body; Express answers HEAD automatically for every GET route. <code>.all()</code> runs only when no method above it matched, so it never interferes with real methods.</p>
<div class="callout warn"><p><strong>Use <code>curl -I</code>, not <code>curl -X HEAD</code>.</strong> With <code>-X HEAD</code> curl still waits for a body the server will never send, and hangs until the connection times out.</p></div>

<div class="pitfall"><p><strong>Trap — GET with side effects.</strong> <code>GET /bookings/bk_1/cancel</code> or <code>GET /devices/dev_3/delete</code> look convenient (“just open the link”). But GET is safe by contract: browsers prefetch links, chat apps fetch link previews, crawlers and monitoring tools follow URLs, caches replay responses. Sooner or later, something you never planned will call that URL. Anything that changes state must use POST, PUT, PATCH or DELETE.</p></div>

<h3>At work and in interviews</h3>
<ul>
  <li>“PUT vs PATCH?” — PUT replaces the whole resource and is idempotent; PATCH sends a partial change, with JSON Merge Patch as the common format; idempotency of PATCH is not guaranteed in general.</li>
  <li>“Which methods are idempotent, and why should I care?” — GET, HEAD, OPTIONS, PUT, DELETE; it decides whether clients, proxies and SDKs may retry automatically.</li>
  <li>“DELETE twice returns 404 — is it still idempotent?” — yes; idempotency is about state, not responses.</li>
</ul>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9110 — HTTP Semantics (June 2022) — read 1 Nov 2026</span><span class="lc-sub">§9.2.1 Safe Methods (“essentially read-only”) and §9.2.2 Idempotent Methods: PUT, DELETE and the safe methods.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc7396.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 7396 — JSON Merge Patch (Oct 2014) — read 1 Nov 2026</span><span class="lc-sub">The format behind LabFlow’s PATCH: members in the patch replace members in the target, and null means “remove this member”.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Restart the server (data resets) and reproduce: POST the Arduino twice, list <code>/devices?labId=lab_2</code>, and count the boards.</li>
  <li>Use PATCH to set <code>dev_1</code> to <code>IN_USE</code> and add a note <code>"Đang dùng cho Lab 3"</code> in one request; then remove only the note with a second PATCH.</li>
  <li>Try <code>PUT /devices/dev_1</code> with only <code>name</code> and <code>status</code>. Read the <code>details</code> list: which fields are missing?</li>
  <li>Find the 405s: try <code>DELETE /labs</code>, <code>PATCH /labs/lab_2</code> and <code>PUT /devices</code>. Write down the <code>Allow</code> header of each.</li>
</ol>
<p><strong>Done when:</strong> you can show, from your own terminal, one twin created by POST, one field removed by a <code>null</code> in PATCH, one 400 from a partial PUT, and three 405 responses with their <code>Allow</code> headers — and explain in one sentence each why.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Safe method</span><span class="v">The client asks for no change on the server: GET, HEAD, OPTIONS.</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">N identical requests have the same effect on the server as one.</span></div>
  <div class="kv"><span class="k">Retry</span><span class="v">Sending a request again after a failure or timeout.</span></div>
  <div class="kv"><span class="k">PUT</span><span class="v">Replace the whole resource at this URL with the body.</span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">Apply a partial change to a resource.</span></div>
  <div class="kv"><span class="k">JSON Merge Patch</span><span class="v">RFC 7396 patch format: value = set, <code>null</code> = remove, absent = keep.</span></div>
  <div class="kv"><span class="k">405 Method Not Allowed</span><span class="v">The URL exists but not with this method; sent with an <code>Allow</code> header.</span></div>
  <div class="kv"><span class="k">Allow header</span><span class="v">Lists the methods a URL supports.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Safe = no change requested (GET, HEAD, OPTIONS); idempotent = many calls, one effect (+ PUT, DELETE).</li>
  <li>These promises decide what a client may retry after a lost response; POST must never be retried blindly.</li>
  <li>POST twice creates twins; PUT twice keeps the same state; DELETE twice gives 204 then 404 and is still idempotent.</li>
  <li>PUT replaces everything — refuse or document partial bodies; PATCH with Merge Patch sets, removes (<code>null</code>) and keeps.</li>
  <li>An existing URL with a wrong method is 405 plus <code>Allow</code>, not 404.</li>
  <li>Never change state with GET.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-2-1-express-routing" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — lesson 2.1: Express routing &amp; your first app</span><span class="lc-sub">If you took SDN302 on Academy, routing by method (router.get, post, put, delete) and one router per resource will feel familiar. Same: mapping methods to handlers in Express. Different: SDN302 shows how to register the routes; here we ask what each method promises. This lesson adds: safe and idempotent, why POST cannot be retried blindly, PUT vs PATCH with JSON Merge Patch, and 405 with an Allow header. If you have not taken SDN302, this lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Phương thức và cam kết của chúng</h2>
<p class="lead">Chọn giữa POST, PUT, PATCH và DELETE không phải chuyện sở thích. Mỗi phương thức mang những lời hứa do chuẩn HTTP định nghĩa, và client, proxy, trình duyệt hành động dựa trên các lời hứa đó — quan trọng nhất là khi quyết định một request bị lỗi có được gửi lại hay không. Trong bài này bạn thêm các thao tác ghi thiết bị vào LabFlow và nhìn lời hứa của từng phương thức đứng vững (hoặc không) trên request thật.</p>

<h3>Hai lời hứa: safe và idempotent</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">GET · HEAD · OPTIONS</span><span class="lz-lnote">an toàn (chỉ đọc) và idempotent — gửi lại thoải mái</span></div>
  <div class="lz-layer"><span class="lz-lname">PUT · DELETE</span><span class="lz-lnote">idempotent — request y hệt lần hai không đổi thêm gì</span></div>
  <div class="lz-layer"><span class="lz-lname">PATCH</span><span class="lz-lnote">idempotent chỉ khi bản vá là “đặt bằng”, không phải “cộng 1”</span></div>
  <div class="lz-layer"><span class="lz-lname">POST</span><span class="lz-lnote">không phải cả hai — gửi lại có thể tạo bản ghi thứ hai (Chương 5 chữa)</span></div>
</div>
<p>RFC 9110 ("HTTP Semantics", §9.2) định nghĩa hai tính chất:</p>
<ul>
  <li><strong>Safe</strong> (an toàn) — client không yêu cầu server thay đổi gì. GET, HEAD và OPTIONS là safe. Server vẫn có thể ghi một dòng log hay tăng một bộ đếm; điều quan trọng là client không <em>yêu cầu</em> thay đổi, nên trình duyệt được tải trước các request này và crawler được đi theo chúng.</li>
  <li><strong>Idempotent</strong> (làm lại không đổi kết quả) — gửi cùng một request N lần có cùng <em>tác động lên server</em> như gửi một lần. Mọi phương thức safe đều idempotent, và PUT với DELETE cũng vậy. Chính điều này cho phép client, hoặc một proxy ở giữa, tự động gửi lại request sau khi mạng lỗi.</li>
</ul>
<table>
  <thead><tr><th>Phương thức</th><th>Safe</th><th>Idempotent</th><th>Dùng trong LabFlow</th><th>Mã thành công</th></tr></thead>
  <tbody>
    <tr><td>GET</td><td>có</td><td>có</td><td>đọc một phòng, liệt kê thiết bị</td><td>200</td></tr>
    <tr><td>HEAD</td><td>có</td><td>có</td><td>chỉ lấy header</td><td>200</td></tr>
    <tr><td>OPTIONS</td><td>có</td><td>có</td><td>"ở đây dùng được phương thức nào?"</td><td>204 + <code>Allow</code></td></tr>
    <tr><td>PUT</td><td>không</td><td>có</td><td>thay toàn bộ một thiết bị</td><td>200 (201 nếu PUT tạo mới)</td></tr>
    <tr><td>DELETE</td><td>không</td><td>có</td><td>xoá một thiết bị</td><td>204</td></tr>
    <tr><td>POST</td><td>không</td><td>không</td><td>tạo lượt đặt hay thiết bị; hành động như huỷ</td><td>201 / 200</td></tr>
    <tr><td>PATCH</td><td>không</td><td>không được hứa</td><td>sửa vài trường của thiết bị</td><td>200</td></tr>
  </tbody>
</table>

<h3>Vì sao quan trọng: response bị mất</h3>
<p>Điện thoại của một sinh viên gửi <code>POST /devices</code>. Server lưu thiết bị và gửi <code>201 Created</code> — rồi Wi-Fi rớt trước khi response tới nơi. Với điện thoại, request đã quá thời gian. Nó không thể biết request bị mất trên đường đi hay response bị mất trên đường về. Có nên gửi lại không?</p>
<ul>
  <li>Với phương thức <strong>idempotent</strong> (GET, PUT, DELETE) — có, luôn an toàn: trạng thái cuối cùng vẫn vậy.</li>
  <li>Với <strong>POST</strong> — gửi lại có thể tạo thêm một thiết bị thứ hai. Chương 5 làm cho việc gửi lại POST an toàn bằng <em>idempotency key</em>; trước lúc đó, client không được gửi lại POST một cách mù quáng.</li>
</ul>

<h3>Làm thật: ai được ghi, và các thao tác ghi thiết bị</h3>
<p>Thao tác ghi cần biết ai đang gọi. Xác thực thật là Chương 6; tạm thời LabFlow dùng ba token cố định để học. Thêm vào <code>src/db.js</code>:</p>
<pre><code class="language-javascript">export const users = [
  { id: 'usr_1', name: 'Nguyễn Văn An', role: 'STUDENT' },
  { id: 'usr_2', name: 'Trần Thị Bình', role: 'STUDENT' },
  { id: 'usr_3', name: 'Cô Lan', role: 'LAB_MANAGER' },
];

// Token giả để học — xác thực thật (JWT, OAuth) học ở Chương 6
export const tokens = { tok_an: 'usr_1', tok_bin: 'usr_2', tok_lan: 'usr_3' };

export const bookings = [];

const counters = { bk: 0, dev: devices.length };
export const nextId = (prefix) =&gt; &#96;\${prefix}_\${++counters[prefix]}&#96;;</code></pre>
<p>Tạo <code>src/auth.js</code> với hai middleware (bài 1.3 giải thích các câu trả lời 401 và 403 của chúng; bài 1.4 sửa một lỗi ở dòng đầu):</p>
<pre><code class="language-javascript">import { tokens, users } from './db.js';
import { HttpError } from './http.js';

// Đọc "Authorization: Bearer &lt;token&gt;" ⇒ req.user. Không có/sai ⇒ 401.
export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('Authorization') ?? '').split(' ');
  const userId = scheme === 'Bearer' ? tokens[token] : undefined;
  if (!userId) {
    res.set('WWW-Authenticate', 'Bearer realm="labflow"');
    throw new HttpError(401, 'UNAUTHENTICATED', 'Cần đăng nhập (thiếu hoặc sai token)');
  }
  req.user = users.find((u) =&gt; u.id === userId);
  next();
}

export function requireRole(role) {
  return (req, res, next) =&gt; {
    if (req.user.role !== role) throw new HttpError(403, 'FORBIDDEN', &#96;Chỉ \${role} được làm việc này&#96;);
    next();
  };
}</code></pre>
<p>Giờ là <code>src/routes/devices.js</code> đầy đủ. Hãy đọc các chú thích: chúng phát biểu hợp đồng của từng phương thức.</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices, labs, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';

export const devicesRouter = Router();
const FIELDS = ['labId', 'name', 'type', 'serialNo', 'status'];   // PUT phải gửi đủ
const STATUSES = ['AVAILABLE', 'IN_USE', 'MAINTENANCE'];

function findDevice(id) {
  const d = devices.find((x) =&gt; x.id === id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${id}&#96;);
  return d;
}
function checkValues(body) {
  if (body.status !== undefined &amp;&amp; !STATUSES.includes(body.status))
    throw new HttpError(400, 'VALIDATION_FAILED', &#96;status phải là một trong \${STATUSES.join(', ')}&#96;);
  if (body.labId !== undefined &amp;&amp; !labs.some((l) =&gt; l.id === body.labId))
    throw new HttpError(422, 'UNKNOWN_LAB', &#96;labId \${body.labId} không tồn tại&#96;);
}

devicesRouter.route('/')
  .get((req, res) =&gt; {
    const { labId } = req.query;
    res.json({ data: labId ? devices.filter((d) =&gt; d.labId === labId) : devices });
  })
  // POST vào BỘ SƯU TẬP = tạo phần tử mới, server tự đặt id
  .post(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const missing = FIELDS.filter((f) =&gt; req.body?.[f] === undefined);
    if (missing.length) throw new HttpError(400, 'VALIDATION_FAILED', 'Thiếu trường bắt buộc', missing.map((f) =&gt; ({ field: f, issue: 'required' })));
    checkValues(req.body);
    const device = { id: nextId('dev') };
    for (const f of [...FIELDS, 'note']) if (req.body[f] !== undefined) device[f] = req.body[f];
    devices.push(device);
    res.status(201).location(&#96;/devices/\${device.id}&#96;).json(device);
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

devicesRouter.route('/:id')
  .get((req, res) =&gt; res.json(findDevice(req.params.id)))
  // PUT = THAY TOÀN BỘ: client gửi đủ mọi trường, thiếu ⇒ 400
  .put(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    const missing = FIELDS.filter((f) =&gt; req.body?.[f] === undefined);
    if (missing.length) throw new HttpError(400, 'VALIDATION_FAILED', 'PUT cần đủ mọi trường', missing.map((f) =&gt; ({ field: f, issue: 'required' })));
    checkValues(req.body);
    const next = { id: d.id };
    for (const f of [...FIELDS, 'note']) if (req.body[f] !== undefined) next[f] = req.body[f];
    Object.keys(d).forEach((k) =&gt; delete d[k]);
    Object.assign(d, next);
    res.json(d);
  })
  // PATCH = SỬA MỘT PHẦN theo JSON Merge Patch (RFC 7396): null nghĩa là xoá trường
  .patch(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const d = findDevice(req.params.id);
    if (!req.is('application/merge-patch+json') &amp;&amp; !req.is('application/json'))
      throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Gửi body dạng application/merge-patch+json');
    if ('id' in (req.body ?? {})) throw new HttpError(400, 'VALIDATION_FAILED', 'Không được đổi id');
    checkValues(req.body);
    for (const [k, v] of Object.entries(req.body ?? {})) {
      if (v === null) delete d[k];
      else d[k] = v;
    }
    res.json(d);
  })
  .delete(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const i = devices.findIndex((x) =&gt; x.id === req.params.id);
    if (i === -1) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${req.params.id}&#96;);
    devices.splice(i, 1);
    res.status(204).end();   // xoá xong, không có gì để trả
  })
  .all(onlyAllow('GET', 'HEAD', 'PUT', 'PATCH', 'DELETE'));</code></pre>
<p>Những mảnh mới cần để ý: <code>devicesRouter.route('/:id')</code> gom mọi phương thức của một URL vào một chuỗi; middleware như <code>requireAuth</code> có thể đặt trước handler của riêng một phương thức; <code>req.body?.[f]</code> dùng optional chaining (truy cập tuỳ chọn) để body thiếu cũng không làm sập; và <code>res.status(204).end()</code> gửi một kết quả thành công không có body.</p>
<p>Hai thay đổi nhỏ ở chỗ khác. Trong <code>app.js</code>, cho <code>express.json()</code> phân tích cả body dạng Merge Patch:</p>
<pre><code class="language-javascript">app.use(express.json({ type: ['application/json', 'application/merge-patch+json'] }));</code></pre>
<p>Và trong <code>src/http.js</code>, thêm hàm trả lời các phương thức sai (giải thích bên dưới):</p>
<pre><code class="language-javascript">// Route có thật nhưng sai phương thức ⇒ 405 + header Allow
export const onlyAllow = (...methods) =&gt; (req, res) =&gt; {
  res.set('Allow', methods.join(', '));
  if (req.method === 'OPTIONS') return res.status(204).end();
  throw new HttpError(405, 'METHOD_NOT_ALLOWED',
    &#96;\${req.method} không dùng được ở \${req.baseUrl}\${req.path}&#96;);
};</code></pre>

<h3>POST hai lần: hai thiết bị</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/devices -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_2","name":"Arduino Uno R4","type":"BOARD","serialNo":"ARD-R4-0099","status":"AVAILABLE"}'
curl -X POST http://localhost:4000/devices -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_2","name":"Arduino Uno R4","type":"BOARD","serialNo":"ARD-R4-0099","status":"AVAILABLE"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /devices/dev_4
Content-Type: application/json; charset=utf-8
Content-Length: 140
ETag: W/"8c-DhbYWIhI3BBrBLWjVu17igTqPOY"
Date: Sat, 31 Oct 2026 15:43:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "dev_4",
  "labId": "lab_2",
  "name": "Arduino Uno R4",
  "type": "BOARD",
  "serialNo": "ARD-R4-0099",
  "status": "AVAILABLE"
}
{
  "id": "dev_5",
  "labId": "lab_2",
  "name": "Arduino Uno R4",
  "type": "BOARD",
  "serialNo": "ARD-R4-0099",
  "status": "AVAILABLE"
}</div>
<p>Cùng một request, hai tài nguyên khác nhau: <code>dev_4</code> và <code>dev_5</code>, giống hệt trừ id. <code>GET /devices?labId=lab_2</code> giờ liệt kê ba bo mạch. Đây là POST hoạt động <em>đúng</em> — "tạo một thành viên mới" — và cũng chính là lý do một POST bị quá thời gian không được gửi lại mù quáng. (Lab của chương thêm luật số serial duy nhất để lần gọi thứ hai thành <code>409 Conflict</code>.)</p>

<h3>POST một lượt đặt hai lần: luật nghiệp vụ che mất vấn đề</h3>
<p>Nhìn trước sang bài 1.3, đây là điều code cuối chương làm khi cùng một lượt đặt được gửi hai lần:</p>
<pre><code class="language-bash">curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"SWT301 Lab 3"}'
# … gửi lại đúng lệnh đó …</code></pre>
<div class="out">{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": "SWT301 Lab 3",
  "status": "PENDING",
  "createdAt": "2026-10-31T15:43:10.309Z"
}
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 101
ETag: W/"65-jELg4Gt2GmgcAO47S0BO+GCp3pc"
Date: Sat, 31 Oct 2026 15:43:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "BOOKING_CONFLICT",
  "message": "Phòng đã có lượt bk_1 trong khung giờ này"
}</div>
<p>Luật chống đặt trùng đã từ chối bản sao thứ hai — may mắn. Nhưng hãy nghĩ cho client: nếu response đầu bị mất và lần gửi lại nhận 409, app sẽ báo <em>lỗi</em> cho một lượt đặt thật ra đã <em>thành công</em>. Và hai lượt đặt một tiếng nối tiếp nhau thì không trùng giờ, nên gửi lại sẽ tạo bản trùng thật. Luật nghiệp vụ không phải là chiến lược gửi lại.</p>

<h3>PUT hai lần: cùng một trạng thái</h3>
<pre><code class="language-bash">curl -X PUT http://localhost:4000/devices/dev_1 -H 'Authorization: Bearer tok_lan' \\
  --json '{"labId":"lab_1","name":"Cisco Router 2901","type":"ROUTER","serialNo":"FTX1840ALBQ","status":"MAINTENANCE"}'</code></pre>
<div class="out">{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "MAINTENANCE"
}</div>
<p>Chạy lại đúng lệnh đó, bạn nhận đúng output đó. PUT nghĩa là "làm cho tài nguyên <em>ở URL này</em> trông y hệt body này". Lần thứ hai, nó vốn đã như thế. Và vì client tự gọi tên URL, không có cách nào sinh ra bản song sinh.</p>

<h3>PUT thay toàn bộ — nên LabFlow từ chối nửa cái body</h3>
<pre><code class="language-bash">curl -i -X PUT http://localhost:4000/devices/dev_1 -H 'Authorization: Bearer tok_lan' --json '{"status":"AVAILABLE"}'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 354
ETag: W/"162-tMaIw2eMDLD00X+OdcxIP+elYyY"
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

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
    {
      "field": "type",
      "issue": "required"
    },
    {
      "field": "serialNo",
      "issue": "required"
    }
  ]
}</div>
<p>Một handler PUT ngây thơ lưu body đúng như nhận sẽ biến <code>dev_1</code> thành <code>{ "id": "dev_1", "status": "AVAILABLE" }</code> — mất sạch tên, loại và số serial. Đó chính là lỗi form sửa trong câu chuyện demo ở Mục 0. Có hai chính sách đứng đắn: <strong>chặt chẽ</strong> (đủ mọi trường, thiếu thì 400 — LabFlow) hoặc <strong>nới lỏng</strong> (trường thiếu được đặt về mặc định). Chọn một và ghi vào tài liệu; đừng bao giờ để "thiếu" âm thầm mang nghĩa "xoá".</p>

<h3>PATCH với JSON Merge Patch</h3>
<pre><code class="language-bash">curl -X PATCH http://localhost:4000/devices/dev_3 -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: application/merge-patch+json' -d '{"status":"MAINTENANCE","note":null}'</code></pre>
<div class="out">{
  "id": "dev_3",
  "labId": "lab_2",
  "name": "Raspberry Pi 5",
  "type": "BOARD",
  "serialNo": "RPI5-00421",
  "status": "MAINTENANCE"
}</div>
<p>Trước lời gọi, <code>dev_3</code> có <code>"status": "AVAILABLE"</code> và <code>"note": "Thiếu thẻ nhớ"</code>. JSON Merge Patch (RFC 7396) có ba luật, và cả ba đều thấy được ở đây:</p>
<table>
  <thead><tr><th>Trong body patch</th><th>Tác động</th><th>Ở đây</th></tr></thead>
  <tbody>
    <tr><td>một trường có giá trị</td><td>đặt giá trị đó</td><td><code>status</code> → <code>MAINTENANCE</code></td></tr>
    <tr><td>một trường mang <code>null</code></td><td>xoá trường đó</td><td><code>note</code> biến mất</td></tr>
    <tr><td>một trường không nhắc tới</td><td>giữ nguyên</td><td><code>name</code>, <code>type</code>, <code>serialNo</code> không đổi</td></tr>
  </tbody>
</table>
<p>Kiểu dữ liệu <code>application/merge-patch+json</code> cho server biết bạn dùng định dạng patch nào. (Còn một chuẩn khác là JSON Patch, RFC 6902, gửi một danh sách thao tác như <code>{"op": "replace", "path": "/status", "value": "IN_USE"}</code>; mạnh hơn và dài dòng hơn. Merge Patch đủ cho phần lớn nhu cầu API.) Gửi patch dưới dạng <code>text/plain</code> sẽ nhận <code>415 Unsupported Media Type</code> — bài 1.3.</p>

<h3>PUT hay PATCH?</h3>
<table>
  <thead><tr><th></th><th>PUT</th><th>PATCH (Merge Patch)</th></tr></thead>
  <tbody>
    <tr><td>Body chứa</td><td>toàn bộ tài nguyên mới</td><td>chỉ các trường cần đổi</td></tr>
    <tr><td>Thiếu trường nghĩa là</td><td>lỗi (chặt) hoặc đặt lại (nới)</td><td>để nguyên</td></tr>
    <tr><td>Idempotent?</td><td>luôn luôn</td><td>Merge Patch: thực tế là có; PATCH nói chung: không được hứa (thao tác <code>increment</code> thì không)</td></tr>
    <tr><td>Hợp với</td><td>form sửa toàn bộ, việc đồng bộ</td><td>bật/tắt, đổi trạng thái, mạng di động chậm</td></tr>
    <tr><td>Rủi ro</td><td>xoá các trường client quên gửi</td><td>một <code>null</code> lạc chỗ xoá mất trường bạn cần</td></tr>
  </tbody>
</table>

<h3>DELETE hai lần: 204, rồi 404 — vẫn idempotent</h3>
<pre><code class="language-bash">curl -i -X DELETE http://localhost:4000/devices/dev_2 -H 'Authorization: Bearer tok_lan'
curl -i -X DELETE http://localhost:4000/devices/dev_2 -H 'Authorization: Bearer tok_lan'</code></pre>
<div class="out">HTTP/1.1 204 No Content
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-wlwv38lzM/vSkJyPwiWUFoI4HMY"
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "DEVICE_NOT_FOUND",
  "message": "Không có thiết bị dev_2"
}</div>
<p>Response khác nhau, tác động như nhau: sau một hay hai lần gọi, <code>dev_2</code> đều không còn. Idempotency là lời hứa về <strong>trạng thái của server</strong>, không phải về những câu trả lời giống hệt. Vì vậy client đã gửi lại DELETE nên coi 404 là "đã xong". (Có API trả 204 cho mọi DELETE, kể cả id không tồn tại, để việc gửi lại êm hơn. Chọn cách nào cũng được nếu có ghi tài liệu.)</p>

<h3>HEAD, OPTIONS và 405 Method Not Allowed</h3>
<p>Khi chưa có <code>onlyAllow</code>, khung ở bài 0.3 trả lời phương thức sai như sau:</p>
<pre><code class="language-bash">curl -i -X DELETE http://localhost:4000/labs
curl -i -X OPTIONS http://localhost:4000/labs</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 72
ETag: W/"48-QvJkI+4uhdqyzCa6Nl6J17B22qk"
Date: Sat, 31 Oct 2026 15:41:38 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ROUTE_NOT_FOUND",
  "message": "Không có DELETE /labs"
}
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 73
ETag: W/"49-S1S7m5cE9PeoMvKT19gkHWTSOGs"
Date: Sat, 31 Oct 2026 15:41:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ROUTE_NOT_FOUND",
  "message": "Không có OPTIONS /labs"
}</div>
<p>Cả hai đều nói "ở <code>/labs</code> chẳng có gì", và điều đó sai: URL có tồn tại, chỉ phương thức là sai. (Express có tự trả lời OPTIONS — nhưng chỉ khi chưa middleware nào xử lý request trước, mà lưới hứng 404 JSON của ta thì đã xử lý.) Câu trả lời chính xác là <strong>405 Method Not Allowed</strong> kèm header <code>Allow</code> liệt kê những gì <em>được</em> phép. Muốn vậy, viết mỗi URL thành một chuỗi <code>route()</code> kết thúc bằng <code>.all(onlyAllow(…))</code>, như trong <code>devices.js</code> ở trên, và làm tương tự trong <code>labs.js</code>:</p>
<pre><code class="language-javascript">labsRouter.route('/:labId')
  .get((req, res) =&gt; res.json(findLab(req.params.labId)))
  .all(onlyAllow('GET', 'HEAD'));</code></pre>
<pre><code class="language-bash">curl -I http://localhost:4000/labs
curl -i -X OPTIONS http://localhost:4000/devices/dev_1
curl -i -X DELETE http://localhost:4000/labs/lab_1</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 454
ETag: W/"1c6-+s1YqANIrEdiSpnMGpMRE1CaNZg"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

HTTP/1.1 204 No Content
Allow: GET, HEAD, PUT, PATCH, DELETE
Date: Sat, 31 Oct 2026 15:42:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5

HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: application/json; charset=utf-8
Content-Length: 96
ETag: W/"60-s0sK3aD6cJANyiOD1rsS+XhToCY"
Date: Sat, 31 Oct 2026 15:42:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "METHOD_NOT_ALLOWED",
  "message": "DELETE không dùng được ở /labs/lab_1"
}</div>
<p>HEAD trả về đúng các header mà GET sẽ trả (để ý <code>Content-Length: 454</code>) nhưng không có body; Express tự trả lời HEAD cho mọi route GET. <code>.all()</code> chỉ chạy khi không phương thức nào phía trên khớp, nên nó không bao giờ cản các phương thức thật.</p>
<div class="callout warn"><p><strong>Dùng <code>curl -I</code>, đừng dùng <code>curl -X HEAD</code>.</strong> Với <code>-X HEAD</code>, curl vẫn chờ một body mà server sẽ không bao giờ gửi, và treo tới khi kết nối hết thời gian.</p></div>

<div class="pitfall"><p><strong>Bẫy — GET có tác dụng phụ.</strong> <code>GET /bookings/bk_1/cancel</code> hay <code>GET /devices/dev_3/delete</code> trông tiện ("chỉ cần mở link"). Nhưng theo hợp đồng GET là safe: trình duyệt tải trước các liên kết, app chat lấy bản xem trước của link, crawler và công cụ giám sát đi theo URL, cache phát lại response. Sớm muộn gì cũng có thứ bạn chưa từng tính tới gọi vào URL đó. Mọi thứ làm thay đổi trạng thái phải dùng POST, PUT, PATCH hoặc DELETE.</p></div>

<h3>Khi đi làm và khi phỏng vấn</h3>
<ul>
  <li>"PUT khác PATCH thế nào?" — PUT thay toàn bộ tài nguyên và idempotent; PATCH gửi thay đổi một phần, định dạng phổ biến là JSON Merge Patch; tính idempotent của PATCH nói chung không được bảo đảm.</li>
  <li>"Phương thức nào idempotent, và vì sao phải quan tâm?" — GET, HEAD, OPTIONS, PUT, DELETE; nó quyết định client, proxy và SDK có được tự động gửi lại hay không.</li>
  <li>"DELETE hai lần trả 404 — vẫn idempotent chứ?" — vẫn; idempotency nói về trạng thái, không về response.</li>
</ul>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9110 — HTTP Semantics (6/2022) — đọc ngày 1/11/2026</span><span class="lc-sub">§9.2.1 Safe Methods (“về bản chất chỉ đọc”) và §9.2.2 Idempotent Methods: PUT, DELETE và các phương thức an toàn.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc7396.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 7396 — JSON Merge Patch (10/2014) — đọc ngày 1/11/2026</span><span class="lc-sub">Định dạng của PATCH trong LabFlow: thành viên trong bản vá thay thành viên ở đích, và null nghĩa là “xoá thành viên này”.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Khởi động lại server (dữ liệu về ban đầu) và tái hiện: POST cái Arduino hai lần, liệt kê <code>/devices?labId=lab_2</code>, và đếm số bo mạch.</li>
  <li>Dùng PATCH đặt <code>dev_1</code> thành <code>IN_USE</code> và thêm ghi chú <code>"Đang dùng cho Lab 3"</code> trong một request; rồi chỉ xoá ghi chú bằng một PATCH thứ hai.</li>
  <li>Thử <code>PUT /devices/dev_1</code> chỉ với <code>name</code> và <code>status</code>. Đọc danh sách <code>details</code>: thiếu những trường nào?</li>
  <li>Tìm các mã 405: thử <code>DELETE /labs</code>, <code>PATCH /labs/lab_2</code> và <code>PUT /devices</code>. Ghi lại header <code>Allow</code> của từng cái.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được, từ chính terminal của mình, một bản song sinh do POST tạo, một trường bị xoá bởi <code>null</code> trong PATCH, một lỗi 400 do PUT thiếu trường, và ba response 405 kèm header <code>Allow</code> — và giải thích mỗi cái bằng một câu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Safe method (phương thức an toàn)</span><span class="v">Client không yêu cầu server thay đổi gì: GET, HEAD, OPTIONS.</span></div>
  <div class="kv"><span class="k">Idempotent (làm lại không đổi kết quả)</span><span class="v">N request giống hệt có cùng tác động lên server như một request.</span></div>
  <div class="kv"><span class="k">Retry (gửi lại)</span><span class="v">Gửi lại một request sau khi bị lỗi hoặc quá thời gian.</span></div>
  <div class="kv"><span class="k">PUT</span><span class="v">Thay toàn bộ tài nguyên ở URL này bằng body.</span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">Áp một thay đổi một phần lên tài nguyên.</span></div>
  <div class="kv"><span class="k">JSON Merge Patch</span><span class="v">Định dạng patch RFC 7396: có giá trị = đặt, <code>null</code> = xoá, vắng mặt = giữ.</span></div>
  <div class="kv"><span class="k">405 Method Not Allowed</span><span class="v">URL có tồn tại nhưng không với phương thức này; đi kèm header <code>Allow</code>.</span></div>
  <div class="kv"><span class="k">Allow header</span><span class="v">Liệt kê các phương thức mà một URL hỗ trợ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Safe = không yêu cầu thay đổi (GET, HEAD, OPTIONS); idempotent = gọi nhiều lần, một tác động (+ PUT, DELETE).</li>
  <li>Hai lời hứa này quyết định client được gửi lại gì sau khi mất response; POST không bao giờ được gửi lại mù quáng.</li>
  <li>POST hai lần sinh bản song sinh; PUT hai lần giữ nguyên trạng thái; DELETE hai lần cho 204 rồi 404 và vẫn idempotent.</li>
  <li>PUT thay toàn bộ — từ chối hoặc ghi rõ cách xử lý body thiếu; PATCH với Merge Patch thì đặt, xoá (<code>null</code>) và giữ.</li>
  <li>URL có thật mà phương thức sai là 405 kèm <code>Allow</code>, không phải 404.</li>
  <li>Không bao giờ thay đổi trạng thái bằng GET.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-2-1-express-routing" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp phần này ở SDN302 — bài 2.1: Express routing &amp; app đầu tiên</span><span class="lc-sub">Nếu bạn đã học SDN302 trên Academy, việc định tuyến theo phương thức (router.get, post, put, delete) và mỗi tài nguyên một router sẽ quen. Giống: gắn phương thức với handler trong Express. Khác: SDN302 chỉ cách đăng ký route; ở đây ta hỏi mỗi phương thức hứa điều gì. Bài này thêm: safe và idempotent, vì sao không được gửi lại POST mù quáng, PUT so với PATCH theo JSON Merge Patch, và 405 kèm header Allow. Chưa học SDN302 thì bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — Status codes that mean something: 201, 400 vs 422, 401 vs 403, 404 vs 410, 409|||1.3 — Mã trạng thái có ý nghĩa: 201, 400 và 422, 401 và 403, 404 và 410, 409',
      slug: 'api-1-3-status',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng lượt đặt LabFlow và cho thấy từng mã trạng thái trên request thật: 201 + Location, 400/422, 401/403, 404/410, 409, 415, 500; danh sách chọn mã 4xx và bẫy "200 cho mọi thứ".',
      content: `${G013}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Status codes that mean something</h2>
<p class="lead">The status code is the first thing every client reads, and for many clients — monitoring dashboards, retry logic, <code>fetch</code>’s <code>res.ok</code> — it is the only thing. A well-chosen code tells the client <em>what happened</em> and <em>what to do next</em> before it opens the body. In this lesson you build LabFlow’s bookings, the richest resource so far, and trigger every status code it uses with a real request.</p>

<h3>Build it: the bookings resource</h3>
<p>Create <code>src/routes/bookings.js</code>. The <code>POST</code> handler checks the request in a deliberate order — shape, then meaning, then current state — and each stage has its own status code:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { bookings, labs, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);   // mọi thao tác đặt chỗ đều cần đăng nhập

const ISO = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2}(\\.\\d{1,3})?)?(Z|[+-]\\d{2}:\\d{2})$/;

function findOwnBooking(req) {
  const b = bookings.find((x) =&gt; x.id === req.params.id);
  if (!b) throw new HttpError(404, 'BOOKING_NOT_FOUND', &#96;Không có lượt đặt \${req.params.id}&#96;);
  if (b.userId !== req.user.id &amp;&amp; req.user.role !== 'LAB_MANAGER')
    throw new HttpError(403, 'FORBIDDEN', 'Đây không phải lượt đặt của bạn');
  return b;
}

bookingsRouter.route('/')
  .get((req, res) =&gt; {
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) =&gt; b.userId === req.user.id);
    res.json({ data: mine });
  })
  .post((req, res) =&gt; {
    const { labId, startAt, endAt, purpose } = req.body ?? {};
    // 1) Hình dạng request sai ⇒ 400
    const details = [];
    if (typeof labId !== 'string') details.push({ field: 'labId', issue: 'required' });
    if (!ISO.test(startAt ?? '')) details.push({ field: 'startAt', issue: 'must be ISO 8601 with timezone' });
    if (!ISO.test(endAt ?? '')) details.push({ field: 'endAt', issue: 'must be ISO 8601 with timezone' });
    if (details.length) throw new HttpError(400, 'VALIDATION_FAILED', 'Dữ liệu gửi lên chưa đúng định dạng', details);
    // 2) Đúng hình dạng nhưng vô nghĩa về nghiệp vụ ⇒ 422
    const start = new Date(startAt), end = new Date(endAt);
    if (end &lt;= start) throw new HttpError(422, 'INVALID_TIME_RANGE', 'endAt phải sau startAt');
    const lab = labs.find((l) =&gt; l.id === labId &amp;&amp; !l.retiredAt);
    if (!lab) throw new HttpError(422, 'UNKNOWN_LAB', &#96;labId \${labId} không tồn tại hoặc đã ngừng dùng&#96;);
    // 3) Hợp lệ nhưng đụng trạng thái hiện tại ⇒ 409
    const clash = bookings.find((b) =&gt; b.labId === labId &amp;&amp; b.status !== 'CANCELLED'
      &amp;&amp; start &lt; new Date(b.endAt) &amp;&amp; new Date(b.startAt) &lt; end);
    if (clash) throw new HttpError(409, 'BOOKING_CONFLICT', &#96;Phòng đã có lượt \${clash.id} trong khung giờ này&#96;);
    const booking = {
      id: nextId('bk'), labId, userId: req.user.id,
      startAt: start.toISOString(), endAt: end.toISOString(),
      purpose: purpose ?? null, status: 'PENDING', createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    res.status(201).location(&#96;/bookings/\${booking.id}&#96;).json(booking);
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

bookingsRouter.route('/:id')
  .get((req, res) =&gt; res.json(findOwnBooking(req)))
  .all(onlyAllow('GET', 'HEAD'));

// Hành động nghiệp vụ có luật riêng ⇒ một "tài nguyên hành động" dùng POST
bookingsRouter.route('/:id/cancel')
  .post((req, res) =&gt; {
    const b = findOwnBooking(req);
    if (b.status === 'CANCELLED') throw new HttpError(409, 'ALREADY_CANCELLED', &#96;Lượt \${b.id} đã huỷ rồi&#96;);
    b.status = 'CANCELLED';
    b.cancelledAt = new Date().toISOString();
    res.json(b);
  })
  .all(onlyAllow('POST'));</code></pre>
<p>Three details deserve a sentence each. <code>bookingsRouter.use(requireAuth)</code> protects every booking URL at once. The overlap test <code>start &lt; existing.end &amp;&amp; existing.start &lt; end</code> is the standard way to detect two time ranges that intersect (touching ranges such as 8–10 and 10–12 do <em>not</em> overlap). And the <code>ISO</code> regular expression only checks the <em>shape</em> of a date-time with a time zone; lesson 1.4 explains why the zone is required.</p>
<p>In <code>app.js</code>, mount the router and teach the error handler one more case — the error <code>express.json()</code> throws for invalid JSON:</p>
<pre><code class="language-javascript">import { bookingsRouter } from './routes/bookings.js';
// …
app.use('/bookings', bookingsRouter);
// … trong bộ xử lý lỗi, trước dòng console.error(err):
  if (err.type === 'entity.parse.failed') {   // body không phải JSON hợp lệ (express.json ném ra)
    return res.status(400).json({ error: 'MALFORMED_JSON', message: 'Body không phải JSON hợp lệ' });
  }</code></pre>

<h3>Choosing a 4xx: ask in this order</h3>
<div class="lz-map">
  <div class="lz-stage">ask in this order — the first “no” is the answer</div>
  <div class="lz-node"><span class="lz-badge">1</span><div class="lz-nbody"><div class="lz-ntitle">Could you read the request?</div><div class="lz-nsub">no ⇒ 400 (415 for an unsupported body format)</div></div></div>
  <div class="lz-node"><span class="lz-badge">2</span><div class="lz-nbody"><div class="lz-ntitle">Do we know who is calling?</div><div class="lz-nsub">no ⇒ 401</div></div></div>
  <div class="lz-node"><span class="lz-badge">3</span><div class="lz-nbody"><div class="lz-ntitle">Is this caller allowed?</div><div class="lz-nsub">no ⇒ 403</div></div></div>
  <div class="lz-node"><span class="lz-badge">4</span><div class="lz-nbody"><div class="lz-ntitle">Does the URL point to something?</div><div class="lz-nsub">no ⇒ 404 (410 if removed for good)</div></div></div>
  <div class="lz-node"><span class="lz-badge">5</span><div class="lz-nbody"><div class="lz-ntitle">Is the method allowed here?</div><div class="lz-nsub">no ⇒ 405 + Allow</div></div></div>
  <div class="lz-node"><span class="lz-badge">6</span><div class="lz-nbody"><div class="lz-ntitle">Does the content make business sense?</div><div class="lz-nsub">no ⇒ 422</div></div></div>
  <div class="lz-node"><span class="lz-badge">7</span><div class="lz-nbody"><div class="lz-ntitle">Does it clash with the current state?</div><div class="lz-nsub">yes ⇒ 409 · otherwise 200 / 201 / 204</div></div></div>
</div>
<table>
  <thead><tr><th>#</th><th>Question</th><th>If “no”</th><th>LabFlow example</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Could you even read the request?</td><td><strong>400</strong> (or <strong>415</strong> for an unsupported body format)</td><td>bad JSON, missing field, date in the wrong format</td></tr>
    <tr><td>2</td><td>Do we know who is calling?</td><td><strong>401</strong></td><td>no or unknown token</td></tr>
    <tr><td>3</td><td>Is this caller allowed to do this?</td><td><strong>403</strong></td><td>a student deleting a device; Bình reading An’s booking</td></tr>
    <tr><td>4</td><td>Does the URL point to something?</td><td><strong>404</strong>, or <strong>410</strong> if removed for good</td><td><code>bk_99</code>; retired <code>lab_4</code></td></tr>
    <tr><td>5</td><td>Is the method allowed on that URL?</td><td><strong>405</strong> + <code>Allow</code></td><td><code>DELETE /labs/lab_1</code></td></tr>
    <tr><td>6</td><td>Does the content make business sense?</td><td><strong>422</strong></td><td>end before start; unknown lab id in the body</td></tr>
    <tr><td>7</td><td>Does it clash with the current state?</td><td><strong>409</strong></td><td>slot already taken; cancelling twice</td></tr>
  </tbody>
</table>
<p>The order is not arbitrary. You cannot check permissions before you know who is calling, and there is no point checking a time range for a request you cannot parse. In practice the order of the checks in your code <em>is</em> the order above — look at the <code>POST</code> handler again. (Real frameworks sometimes run the auth check before the body parser; either way, each failure has exactly one code.)</p>

<h3>201 Created — and where to find it</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"SWT301 Lab 3"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /bookings/bk_1
Content-Type: application/json; charset=utf-8
Content-Length: 234
ETag: W/"ea-GWdWZ4S6IwjbckrToT4wMskEbJ4"
Date: Sat, 31 Oct 2026 15:43:26 GMT
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
  "createdAt": "2026-10-31T15:43:26.161Z"
}</div>
<p><strong>201</strong> says more than 200: “a new resource now exists”. <code>Location</code> tells the client its URL; the body saves a second request. The other success codes: <strong>200</strong> for success with a body (GET, PUT, PATCH, the cancel action) and <strong>204</strong> for success with nothing to say (DELETE, OPTIONS).</p>

<h3>400 Bad Request: the request itself is broken</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' --json '{"labId": "lab_1",}'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 82
ETag: W/"52-KqUT9JLohEvKXBpR+TI/Wtaiuag"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "MALFORMED_JSON",
  "message": "Body không phải JSON hợp lệ"
}</div>
<p>The trailing comma makes the body invalid JSON; <code>express.json()</code> throws before our handler runs, and the new branch in the error handler answers. Now readable JSON with the wrong shape:</p>
<pre><code class="language-bash">curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' --json '{"labId":"lab_1","startAt":"02/11/2026 8:00"}'</code></pre>
<div class="out">{
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
}</div>
<p><code>details</code> reports <em>every</em> problem at once. A client that only learns about the first error fixes one field, retries, learns about the next — three round trips instead of one.</p>

<h3>422 Unprocessable: well-formed, but it makes no sense</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T10:00:00+07:00","endAt":"2026-11-02T08:00:00+07:00"}'
curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_4","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json; charset=utf-8
Content-Length: 76
ETag: W/"4c-dGuxIWTJn4YNvZx3ZMmNLLZqm7E"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "INVALID_TIME_RANGE",
  "message": "endAt phải sau startAt"
}
{
  "error": "UNKNOWN_LAB",
  "message": "labId lab_4 không tồn tại hoặc đã ngừng dùng"
}</div>
<p>LabFlow’s rule: <strong>400</strong> when the request cannot be parsed or a field is missing, of the wrong type or in the wrong format; <strong>422</strong> when every field is well-formed but the combination makes no business sense. Why is an unknown <code>labId</code> in the <em>body</em> a 422 and not a 404? Because the URL <code>/bookings</code> exists; it is the content that refers to nothing. Many APIs simply use 400 for both cases — that is acceptable if documented. The split helps clients: 400 usually means “fix your code”, 422 “show the user a message”.</p>
<p>Notice the reason phrase: Node prints <code>Unprocessable Entity</code>, the name from older RFCs; RFC 9110 now calls 422 “Unprocessable Content”. Clients must read the number, never the phrase.</p>

<h3>401 vs 403: who are you, versus what may you do</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings -H 'Authorization: Bearer tok_sai'</code></pre>
<div class="out">HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
Content-Type: application/json; charset=utf-8
Content-Length: 95
ETag: W/"5f-ANg/5U+skKGv6bdtVP2UY6x3/jc"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "UNAUTHENTICATED",
  "message": "Cần đăng nhập (thiếu hoặc sai token)"
}</div>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings/bk_1 -H 'Authorization: Bearer tok_bin'
curl -i -X DELETE http://localhost:4000/devices/dev_1 -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
Content-Length: 89
ETag: W/"59-D24zyoc8SKRqq/zBaLNmb01srFE"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "FORBIDDEN",
  "message": "Đây không phải lượt đặt của bạn"
}
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
Content-Length: 86
ETag: W/"56-S+1oDvbr2pNyxsYSKYTXV4Oet0U"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "FORBIDDEN",
  "message": "Chỉ LAB_MANAGER được làm việc này"
}</div>
<p><strong>401</strong> means “I do not know who you are”: the name “Unauthorized” is a historical accident — it really means <em>unauthenticated</em>. The standard requires a <code>WWW-Authenticate</code> header with a 401, telling the client which scheme to use. <strong>403</strong> means “I know exactly who you are, and the answer is no”: logging in again will not help. The first 403 is a per-object check (An’s booking); the second a role check (only lab managers delete devices).</p>

<h3>404 vs 410, and a security question</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings/bk_99 -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 82
ETag: W/"52-kz0VkJJC7EC2cT+XyW7pkgpec6I"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "BOOKING_NOT_FOUND",
  "message": "Không có lượt đặt bk_99"
}</div>
<p><strong>404</strong>: nothing at this URL. <strong>410 Gone</strong> (you saw it in lesson 1.1 for <code>lab_4</code>): it existed and was removed on purpose, so clients may forget it. Most APIs never use 410, and that is fine; it is useful when you retire things deliberately.</p>
<div class="callout warn"><p><strong>403 or 404 for “not yours”?</strong> When Bình asks for <code>bk_1</code> and gets 403, he learns that <code>bk_1</code> <em>exists</em>. With guessable ids, someone could probe <code>bk_1</code>, <code>bk_2</code>, … and count other people’s bookings. Many APIs (GitHub does this for private repositories) answer <strong>404</strong> to anyone without access, so existence itself is hidden. LabFlow keeps 403 in Chapter 1 because it is easier to learn from; Chapter 6 (object-level authorisation) switches to 404 and explains the trade-off.</p></div>

<h3>409 Conflict: the double-booking code</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_bin' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T09:00:00+07:00","endAt":"2026-11-02T11:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 101
ETag: W/"65-jELg4Gt2GmgcAO47S0BO+GCp3pc"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "BOOKING_CONFLICT",
  "message": "Phòng đã có lượt bk_1 trong khung giờ này"
}</div>
<p>Bình’s 9–11h overlaps An’s 8–10h. Now An cancels, and Bình sends the very same request:</p>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings/bk_1/cancel -H 'Authorization: Bearer tok_an'
curl -i -X POST http://localhost:4000/bookings/bk_1/cancel -H 'Authorization: Bearer tok_an'
curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_bin' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T09:00:00+07:00","endAt":"2026-11-02T11:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 281
ETag: W/"119-t+vvMaIGOQQ/Shj1td4GPGtoqHU"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": "SWT301 Lab 3",
  "status": "CANCELLED",
  "createdAt": "2026-10-31T15:43:26.161Z",
  "cancelledAt": "2026-10-31T15:43:26.289Z"
}
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 80
ETag: W/"50-nX4uWQpVi5Y3xPqLLqOqJ4T8l7E"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ALREADY_CANCELLED",
  "message": "Lượt bk_1 đã huỷ rồi"
}
{
  "id": "bk_2",
  "labId": "lab_1",
  "userId": "usr_2",
  "startAt": "2026-11-02T02:00:00.000Z",
  "endAt": "2026-11-02T04:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T15:43:26.325Z"
}</div>
<p>The same request that got 409 a minute ago now succeeds. That is the signature of <strong>409</strong>: the request is valid, but it conflicts with the <em>current state</em> of the resource, and may succeed later. Compare <strong>422</strong>, which is wrong in any state (an end before a start never becomes valid). Cancelling twice is also a 409: the action is fine in general, but not in the booking’s current state.</p>

<h3>415 Unsupported Media Type</h3>
<pre><code class="language-bash">curl -i -X PATCH http://localhost:4000/devices/dev_1 -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: text/plain' -d 'status=MAINTENANCE'</code></pre>
<div class="out">HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json; charset=utf-8
Content-Length: 102
ETag: W/"66-7tdGTu3GtvaychyKNRYbs0d5kyg"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "UNSUPPORTED_MEDIA_TYPE",
  "message": "Gửi body dạng application/merge-patch+json"
}</div>
<p><strong>415</strong> is the precise answer when the <code>Content-Type</code> is one the endpoint does not accept — better than a confusing “field missing” 400.</p>

<h3>5xx: our fault — say so, but say little</h3>
<p>To see a real 500, add a temporary route with a bug just above the 404 catch-all in <code>app.js</code>, and delete it afterwards:</p>
<pre><code class="language-javascript">// TẠM để thử lỗi 500 — xoá sau khi thử
app.get('/debug/boom', async (req, res) =&gt; {
  const rows = undefined;              // giả sử truy vấn CSDL trả về undefined
  res.json({ total: rows.length });    // ⇒ TypeError
});</code></pre>
<pre><code class="language-bash">curl -i http://localhost:4000/debug/boom</code></pre>
<div class="out">HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-OPvq4uFWrS3OFyeJLrxQ0lr6I3Q"
Date: Sat, 31 Oct 2026 16:12:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "INTERNAL",
  "message": "Máy chủ gặp lỗi, thử lại sau"
}</div>
<p>Terminal 1 (the server) shows the real cause:</p>
<div class="out">TypeError: Cannot read properties of undefined (reading 'length')
    at file:///…/src/app.js:20:26
    at Layer.handleRequest (…/node_modules/router/lib/layer.js:152:17)
    …</div>
<p>The route is <code>async</code>: in Express 4 this thrown error would not reach the error handler at all; Express 5 catches it. Without our own handler, though, Express answers with its default page — and in development mode that page contains the <strong>full stack trace with file paths</strong>. Here is the start of what a bare Express 5 app (same bug, no custom handler) sent to the client:</p>
<div class="out">HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 2066
…

&lt;!DOCTYPE html&gt;
…
&lt;pre&gt;TypeError: Cannot read properties of undefined (reading &amp;#39;length&amp;#39;)&lt;br&gt; &amp;nbsp; &amp;nbsp;at file:///…/boom.mjs:5:26&lt;br&gt; …</div>
<p>With <code>NODE_ENV=production</code> Express shortens it to <code>Internal Server Error</code>, but it is still HTML. Your own JSON error handler is the reliable fix. Two more 5xx rules: <strong>503 Service Unavailable</strong> (with <code>Retry-After</code>) means “temporarily unable — overloaded or under maintenance” (Chapter 8); and never send a 4xx for your own bug or a 5xx for the client’s mistake — dashboards count them separately, and alerts fire on the wrong team.</p>

<h3>Trap: 200 for everything</h3>
<p>Some APIs answer every request with 200 and put the real result in the body. We wrote a tiny server that does exactly that (<code>bad200.mjs</code>, port 4003) to see the effect:</p>
<pre><code class="language-javascript">// bad200.mjs — CÁCH SAI: lỗi gì cũng trả 200
app.post('/bookings', (req, res) =&gt; {
  const { startAt, endAt } = req.body;
  if (new Date(endAt) &lt;= new Date(startAt)) {
    return res.json({ success: false, error: 'endAt must be after startAt' });
  }
  res.json({ success: true });
});</code></pre>
<pre><code class="language-bash">curl -i -X POST http://localhost:4003/bookings --json '{"startAt":"2026-11-02T10:00:00+07:00","endAt":"2026-11-02T08:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 55
ETag: W/"37-XTcZE3lSYm/qMpEWYh38zkdMWEk"
Date: Sat, 31 Oct 2026 16:14:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"success":false,"error":"endAt must be after startAt"}</div>
<p>To <code>fetch</code>, this is a success (<code>res.ok === true</code>); to a cache, a cacheable answer; to a monitoring dashboard, a happy user. Every client has to parse the body to discover the truth — and the ones that forget show “Booking successful!”, as in the demo-day story. LabFlow returns <code>422</code> for the same input (see above); the body only adds detail.</p>

<h3>Quick reference: the codes LabFlow uses</h3>
<table>
  <thead><tr><th>Code</th><th>Name</th><th>LabFlow example</th></tr></thead>
  <tbody>
    <tr><td>200</td><td>OK</td><td>GET a lab; the cancel action returns the booking</td></tr>
    <tr><td>201</td><td>Created</td><td>POST /bookings, POST /devices — with <code>Location</code></td></tr>
    <tr><td>204</td><td>No Content</td><td>DELETE /devices/{id}; OPTIONS</td></tr>
    <tr><td>400</td><td>Bad Request</td><td>invalid JSON, missing field, wrong date format</td></tr>
    <tr><td>401</td><td>Unauthorized</td><td>no or unknown token — with <code>WWW-Authenticate</code></td></tr>
    <tr><td>403</td><td>Forbidden</td><td>student deletes a device; reading someone else’s booking</td></tr>
    <tr><td>404 / 410</td><td>Not Found / Gone</td><td>no <code>bk_99</code>; retired <code>lab_4</code></td></tr>
    <tr><td>405</td><td>Method Not Allowed</td><td>DELETE /labs/lab_1 — with <code>Allow</code></td></tr>
    <tr><td>409</td><td>Conflict</td><td>overlapping booking; cancelling twice</td></tr>
    <tr><td>415 / 422</td><td>Unsupported Media Type / Unprocessable</td><td>PATCH sent as text/plain; end before start</td></tr>
    <tr><td>500 / 503</td><td>Internal Server Error / Unavailable</td><td>our bug; overloaded (Chapter 8)</td></tr>
  </tbody>
</table>

<h3>In interviews and code reviews</h3>
<ul>
  <li>“401 or 403?” — 401: not authenticated, send <code>WWW-Authenticate</code>; 403: authenticated but not allowed.</li>
  <li>“400 or 422?” — 400: cannot parse or invalid format; 422: well-formed but semantically invalid. State your team’s rule.</li>
  <li>“What does POST return on success?” — 201 Created with <code>Location</code> (and usually the body).</li>
  <li>Review red flag: any endpoint that returns 200 with <code>"success": false</code>, or a 500 for invalid user input.</li>
</ul>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9110 — HTTP Semantics (June 2022) — read 1 Nov 2026</span><span class="lc-sub">§15 Status Codes: §15.5.10 409 Conflict, §15.5.16 415 Unsupported Media Type, §15.5.21 422 Unprocessable Content.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Restart the server and walk the decision table from row 1 to row 7: produce one response for each of 400, 401, 403, 404, 405, 422 and 409, using only <code>curl</code>. Write the command next to each code.</li>
  <li>Book <code>lab_1</code> for 10:00–12:00 (Hanoi time) as Bình after An’s 8:00–10:00 booking. Overlap or not? Predict, then check.</li>
  <li>Add the <code>/debug/boom</code> route, compare the client output with the server terminal, then remove the route and confirm <code>/debug/boom</code> is now a JSON 404.</li>
  <li>Make Cô Lan (<code>tok_lan</code>) read An’s booking. Which line in <code>findOwnBooking</code> allows it?</li>
</ol>
<p><strong>Done when:</strong> you have a list of seven commands, each producing the intended status, and you can explain in one sentence why 10:00–12:00 does not overlap 8:00–10:00.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">201 Created + Location</span><span class="v">A new resource exists; the header gives its URL.</span></div>
  <div class="kv"><span class="k">204 No Content</span><span class="v">Success with no body.</span></div>
  <div class="kv"><span class="k">400 vs 422</span><span class="v">Cannot parse / malformed vs well-formed but makes no business sense.</span></div>
  <div class="kv"><span class="k">401 vs 403</span><span class="v">Not authenticated vs authenticated but not allowed.</span></div>
  <div class="kv"><span class="k">404 vs 410</span><span class="v">Nothing here vs deliberately removed for good.</span></div>
  <div class="kv"><span class="k">409 Conflict</span><span class="v">Valid request that clashes with the resource’s current state.</span></div>
  <div class="kv"><span class="k">415 Unsupported Media Type</span><span class="v">The body’s Content-Type is not accepted by this endpoint.</span></div>
  <div class="kv"><span class="k">Stack trace</span><span class="v">The list of function calls at the moment of an error; belongs in server logs, never in responses.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The status code is part of the contract; the body adds detail.</li>
  <li>Check in order — readable, authenticated, allowed, exists, method, meaning, state — and each failure has one code.</li>
  <li>201 + Location for creation, 204 when there is nothing to send.</li>
  <li>400 broken request, 422 nonsense content, 409 clash with current state; 401 who are you, 403 not allowed; 404 not here, 410 gone.</li>
  <li>5xx is our fault: log the details server-side, send a short JSON message — never Express’s default HTML.</li>
  <li>Never answer 200 with <code>"success": false</code>.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-4-1-rest-mvc" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — lesson 4.1: A full REST API with Express, Mongoose &amp; MVC</span><span class="lc-sub">If you took SDN302 on Academy, the status-code table (200/201/400/401/403/404/500) and “don’t return 200 for errors” will feel familiar. Same: the basic codes and a consistent error shape. Different: SDN302 lists the codes; here every one is triggered on a real API and chosen by a fixed order of questions. This lesson adds: 201 + Location, 400 vs 422, 409 for state conflicts, 410, 415, and what a 500 must not leak. If you have not taken SDN302, this lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Mã trạng thái có ý nghĩa</h2>
<p class="lead">Mã trạng thái là thứ đầu tiên client nào cũng đọc, và với nhiều client — bảng giám sát, logic gửi lại, <code>res.ok</code> của <code>fetch</code> — đó là thứ duy nhất được đọc. Một mã chọn đúng cho client biết <em>chuyện gì đã xảy ra</em> và <em>nên làm gì tiếp</em> trước cả khi mở body. Trong bài này bạn dựng tài nguyên lượt đặt của LabFlow, tài nguyên phong phú nhất cho tới giờ, và kích hoạt mọi mã trạng thái nó dùng bằng request thật.</p>

<h3>Làm thật: tài nguyên lượt đặt</h3>
<p>Tạo <code>src/routes/bookings.js</code>. Handler <code>POST</code> kiểm request theo một thứ tự có chủ đích — hình dạng, rồi ý nghĩa, rồi trạng thái hiện tại — và mỗi tầng có mã trạng thái riêng:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { bookings, labs, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);   // mọi thao tác đặt chỗ đều cần đăng nhập

const ISO = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2}(\\.\\d{1,3})?)?(Z|[+-]\\d{2}:\\d{2})$/;

function findOwnBooking(req) {
  const b = bookings.find((x) =&gt; x.id === req.params.id);
  if (!b) throw new HttpError(404, 'BOOKING_NOT_FOUND', &#96;Không có lượt đặt \${req.params.id}&#96;);
  if (b.userId !== req.user.id &amp;&amp; req.user.role !== 'LAB_MANAGER')
    throw new HttpError(403, 'FORBIDDEN', 'Đây không phải lượt đặt của bạn');
  return b;
}

bookingsRouter.route('/')
  .get((req, res) =&gt; {
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) =&gt; b.userId === req.user.id);
    res.json({ data: mine });
  })
  .post((req, res) =&gt; {
    const { labId, startAt, endAt, purpose } = req.body ?? {};
    // 1) Hình dạng request sai ⇒ 400
    const details = [];
    if (typeof labId !== 'string') details.push({ field: 'labId', issue: 'required' });
    if (!ISO.test(startAt ?? '')) details.push({ field: 'startAt', issue: 'must be ISO 8601 with timezone' });
    if (!ISO.test(endAt ?? '')) details.push({ field: 'endAt', issue: 'must be ISO 8601 with timezone' });
    if (details.length) throw new HttpError(400, 'VALIDATION_FAILED', 'Dữ liệu gửi lên chưa đúng định dạng', details);
    // 2) Đúng hình dạng nhưng vô nghĩa về nghiệp vụ ⇒ 422
    const start = new Date(startAt), end = new Date(endAt);
    if (end &lt;= start) throw new HttpError(422, 'INVALID_TIME_RANGE', 'endAt phải sau startAt');
    const lab = labs.find((l) =&gt; l.id === labId &amp;&amp; !l.retiredAt);
    if (!lab) throw new HttpError(422, 'UNKNOWN_LAB', &#96;labId \${labId} không tồn tại hoặc đã ngừng dùng&#96;);
    // 3) Hợp lệ nhưng đụng trạng thái hiện tại ⇒ 409
    const clash = bookings.find((b) =&gt; b.labId === labId &amp;&amp; b.status !== 'CANCELLED'
      &amp;&amp; start &lt; new Date(b.endAt) &amp;&amp; new Date(b.startAt) &lt; end);
    if (clash) throw new HttpError(409, 'BOOKING_CONFLICT', &#96;Phòng đã có lượt \${clash.id} trong khung giờ này&#96;);
    const booking = {
      id: nextId('bk'), labId, userId: req.user.id,
      startAt: start.toISOString(), endAt: end.toISOString(),
      purpose: purpose ?? null, status: 'PENDING', createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    res.status(201).location(&#96;/bookings/\${booking.id}&#96;).json(booking);
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

bookingsRouter.route('/:id')
  .get((req, res) =&gt; res.json(findOwnBooking(req)))
  .all(onlyAllow('GET', 'HEAD'));

// Hành động nghiệp vụ có luật riêng ⇒ một "tài nguyên hành động" dùng POST
bookingsRouter.route('/:id/cancel')
  .post((req, res) =&gt; {
    const b = findOwnBooking(req);
    if (b.status === 'CANCELLED') throw new HttpError(409, 'ALREADY_CANCELLED', &#96;Lượt \${b.id} đã huỷ rồi&#96;);
    b.status = 'CANCELLED';
    b.cancelledAt = new Date().toISOString();
    res.json(b);
  })
  .all(onlyAllow('POST'));</code></pre>
<p>Ba chi tiết đáng một câu giải thích. <code>bookingsRouter.use(requireAuth)</code> bảo vệ mọi URL lượt đặt cùng lúc. Phép kiểm trùng giờ <code>start &lt; existing.end &amp;&amp; existing.start &lt; end</code> là cách chuẩn để phát hiện hai khoảng thời gian giao nhau (hai khoảng chạm nhau như 8–10 và 10–12 thì <em>không</em> trùng). Và biểu thức chính quy <code>ISO</code> chỉ kiểm <em>hình dạng</em> của một ngày giờ có múi giờ; bài 1.4 giải thích vì sao bắt buộc phải có múi giờ.</p>
<p>Trong <code>app.js</code>, gắn router và dạy bộ xử lý lỗi thêm một trường hợp — lỗi mà <code>express.json()</code> ném ra khi JSON không hợp lệ:</p>
<pre><code class="language-javascript">import { bookingsRouter } from './routes/bookings.js';
// …
app.use('/bookings', bookingsRouter);
// … trong bộ xử lý lỗi, trước dòng console.error(err):
  if (err.type === 'entity.parse.failed') {   // body không phải JSON hợp lệ (express.json ném ra)
    return res.status(400).json({ error: 'MALFORMED_JSON', message: 'Body không phải JSON hợp lệ' });
  }</code></pre>

<h3>Chọn một mã 4xx: hỏi theo thứ tự này</h3>
<div class="lz-map">
  <div class="lz-stage">hỏi theo thứ tự này — câu “không” đầu tiên là đáp án</div>
  <div class="lz-node"><span class="lz-badge">1</span><div class="lz-nbody"><div class="lz-ntitle">Có đọc được request không?</div><div class="lz-nsub">không ⇒ 400 (415 nếu định dạng body không hỗ trợ)</div></div></div>
  <div class="lz-node"><span class="lz-badge">2</span><div class="lz-nbody"><div class="lz-ntitle">Có biết ai đang gọi không?</div><div class="lz-nsub">không ⇒ 401</div></div></div>
  <div class="lz-node"><span class="lz-badge">3</span><div class="lz-nbody"><div class="lz-ntitle">Người gọi có được phép không?</div><div class="lz-nsub">không ⇒ 403</div></div></div>
  <div class="lz-node"><span class="lz-badge">4</span><div class="lz-nbody"><div class="lz-ntitle">URL có trỏ tới thứ gì không?</div><div class="lz-nsub">không ⇒ 404 (410 nếu đã gỡ hẳn)</div></div></div>
  <div class="lz-node"><span class="lz-badge">5</span><div class="lz-nbody"><div class="lz-ntitle">Phương thức có được phép ở đây không?</div><div class="lz-nsub">không ⇒ 405 + Allow</div></div></div>
  <div class="lz-node"><span class="lz-badge">6</span><div class="lz-nbody"><div class="lz-ntitle">Nội dung có hợp lý về nghiệp vụ không?</div><div class="lz-nsub">không ⇒ 422</div></div></div>
  <div class="lz-node"><span class="lz-badge">7</span><div class="lz-nbody"><div class="lz-ntitle">Có xung đột với trạng thái hiện tại không?</div><div class="lz-nsub">có ⇒ 409 · còn lại 200 / 201 / 204</div></div></div>
</div>
<table>
  <thead><tr><th>#</th><th>Câu hỏi</th><th>Nếu "không"</th><th>Ví dụ LabFlow</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Có đọc được request không?</td><td><strong>400</strong> (hoặc <strong>415</strong> nếu định dạng body không được hỗ trợ)</td><td>JSON hỏng, thiếu trường, ngày giờ sai định dạng</td></tr>
    <tr><td>2</td><td>Có biết ai đang gọi không?</td><td><strong>401</strong></td><td>không có token hoặc token lạ</td></tr>
    <tr><td>3</td><td>Người gọi có được làm việc này không?</td><td><strong>403</strong></td><td>sinh viên xoá thiết bị; Bình đọc lượt đặt của An</td></tr>
    <tr><td>4</td><td>URL có trỏ tới thứ gì không?</td><td><strong>404</strong>, hoặc <strong>410</strong> nếu đã gỡ vĩnh viễn</td><td><code>bk_99</code>; phòng <code>lab_4</code> đã ngừng dùng</td></tr>
    <tr><td>5</td><td>Phương thức có dùng được ở URL đó không?</td><td><strong>405</strong> + <code>Allow</code></td><td><code>DELETE /labs/lab_1</code></td></tr>
    <tr><td>6</td><td>Nội dung có hợp lý về nghiệp vụ không?</td><td><strong>422</strong></td><td>kết thúc trước khi bắt đầu; id phòng không tồn tại trong body</td></tr>
    <tr><td>7</td><td>Có xung đột với trạng thái hiện tại không?</td><td><strong>409</strong></td><td>khung giờ đã có người đặt; huỷ hai lần</td></tr>
  </tbody>
</table>
<p>Thứ tự này không tuỳ tiện. Bạn không thể kiểm quyền trước khi biết ai đang gọi, và chẳng có lý gì đi kiểm khoảng thời gian của một request mà bạn còn không đọc nổi. Trên thực tế, thứ tự các phép kiểm trong code của bạn <em>chính là</em> thứ tự ở trên — hãy nhìn lại handler <code>POST</code>. (Các framework thật đôi khi chạy kiểm xác thực trước khi phân tích body; dù thế nào, mỗi lỗi chỉ có đúng một mã.)</p>

<h3>201 Created — và tìm nó ở đâu</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00","purpose":"SWT301 Lab 3"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /bookings/bk_1
Content-Type: application/json; charset=utf-8
Content-Length: 234
ETag: W/"ea-GWdWZ4S6IwjbckrToT4wMskEbJ4"
Date: Sat, 31 Oct 2026 15:43:26 GMT
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
  "createdAt": "2026-10-31T15:43:26.161Z"
}</div>
<p><strong>201</strong> nói nhiều hơn 200: "một tài nguyên mới vừa ra đời". <code>Location</code> cho client biết URL của nó; body giúp client khỏi gửi thêm request. Các mã thành công khác: <strong>200</strong> cho thành công có body (GET, PUT, PATCH, hành động huỷ) và <strong>204</strong> cho thành công mà chẳng có gì để nói (DELETE, OPTIONS).</p>

<h3>400 Bad Request: chính request bị hỏng</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' --json '{"labId": "lab_1",}'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 82
ETag: W/"52-KqUT9JLohEvKXBpR+TI/Wtaiuag"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "MALFORMED_JSON",
  "message": "Body không phải JSON hợp lệ"
}</div>
<p>Dấu phẩy thừa cuối cùng làm body thành JSON không hợp lệ; <code>express.json()</code> ném lỗi trước khi handler của ta chạy, và nhánh mới trong bộ xử lý lỗi trả lời. Giờ là JSON đọc được nhưng sai hình dạng:</p>
<pre><code class="language-bash">curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' --json '{"labId":"lab_1","startAt":"02/11/2026 8:00"}'</code></pre>
<div class="out">{
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
}</div>
<p><code>details</code> báo <em>mọi</em> lỗi cùng lúc. Client chỉ biết lỗi đầu tiên sẽ sửa một trường, gửi lại, biết thêm lỗi kế — ba lượt đi về thay vì một.</p>

<h3>422 Unprocessable: đúng hình dạng nhưng vô lý</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T10:00:00+07:00","endAt":"2026-11-02T08:00:00+07:00"}'
curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_4","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json; charset=utf-8
Content-Length: 76
ETag: W/"4c-dGuxIWTJn4YNvZx3ZMmNLLZqm7E"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "INVALID_TIME_RANGE",
  "message": "endAt phải sau startAt"
}
{
  "error": "UNKNOWN_LAB",
  "message": "labId lab_4 không tồn tại hoặc đã ngừng dùng"
}</div>
<p>Luật của LabFlow: <strong>400</strong> khi request không phân tích được, hoặc một trường bị thiếu, sai kiểu hay sai định dạng; <strong>422</strong> khi mọi trường đều đúng định dạng nhưng gộp lại thì vô lý về nghiệp vụ. Sao một <code>labId</code> không tồn tại trong <em>body</em> lại là 422 chứ không phải 404? Vì URL <code>/bookings</code> có tồn tại; chính nội dung mới trỏ vào chỗ trống. Nhiều API dùng luôn 400 cho cả hai trường hợp — chấp nhận được nếu có ghi tài liệu. Tách ra thì giúp client: 400 thường là "sửa code đi", 422 là "hiện thông báo cho người dùng".</p>
<p>Để ý cụm lý do: Node in <code>Unprocessable Entity</code>, tên trong các RFC cũ; RFC 9110 giờ gọi 422 là "Unprocessable Content". Client phải đọc con số, không bao giờ đọc cụm chữ.</p>

<h3>401 và 403: bạn là ai, và bạn được làm gì</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings -H 'Authorization: Bearer tok_sai'</code></pre>
<div class="out">HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
Content-Type: application/json; charset=utf-8
Content-Length: 95
ETag: W/"5f-ANg/5U+skKGv6bdtVP2UY6x3/jc"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "UNAUTHENTICATED",
  "message": "Cần đăng nhập (thiếu hoặc sai token)"
}</div>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings/bk_1 -H 'Authorization: Bearer tok_bin'
curl -i -X DELETE http://localhost:4000/devices/dev_1 -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
Content-Length: 89
ETag: W/"59-D24zyoc8SKRqq/zBaLNmb01srFE"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "FORBIDDEN",
  "message": "Đây không phải lượt đặt của bạn"
}
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
Content-Length: 86
ETag: W/"56-S+1oDvbr2pNyxsYSKYTXV4Oet0U"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "FORBIDDEN",
  "message": "Chỉ LAB_MANAGER được làm việc này"
}</div>
<p><strong>401</strong> nghĩa là "tôi không biết bạn là ai": cái tên "Unauthorized" là một tai nạn lịch sử — thật ra nó nghĩa là <em>chưa xác thực</em>. Chuẩn yêu cầu đi kèm 401 là header <code>WWW-Authenticate</code> cho client biết dùng cơ chế xác thực nào. <strong>403</strong> nghĩa là "tôi biết rõ bạn là ai, và câu trả lời là không": đăng nhập lại cũng chẳng giúp gì. Lỗi 403 thứ nhất là kiểm quyền theo đối tượng (lượt đặt của An); lỗi thứ hai là kiểm theo vai trò (chỉ quản lý lab được xoá thiết bị).</p>

<h3>404 và 410, cùng một câu hỏi bảo mật</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings/bk_99 -H 'Authorization: Bearer tok_an'</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 82
ETag: W/"52-kz0VkJJC7EC2cT+XyW7pkgpec6I"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "BOOKING_NOT_FOUND",
  "message": "Không có lượt đặt bk_99"
}</div>
<p><strong>404</strong>: ở URL này chẳng có gì. <strong>410 Gone</strong> (bạn đã thấy ở bài 1.1 với <code>lab_4</code>): nó từng tồn tại và bị gỡ có chủ đích, nên client có thể quên nó đi. Phần lớn API chẳng bao giờ dùng 410, và như thế cũng ổn; nó có ích khi bạn cố ý cho một thứ "nghỉ hưu".</p>
<div class="callout warn"><p><strong>403 hay 404 cho trường hợp "không phải của bạn"?</strong> Khi Bình hỏi <code>bk_1</code> và nhận 403, Bình biết được <code>bk_1</code> <em>có tồn tại</em>. Nếu id đoán được, ai đó có thể dò <code>bk_1</code>, <code>bk_2</code>, … và đếm lượt đặt của người khác. Nhiều API (GitHub làm vậy với repository riêng tư) trả <strong>404</strong> cho bất kỳ ai không có quyền, để giấu luôn việc nó có tồn tại hay không. LabFlow giữ 403 ở Chương 1 vì dễ học hơn; Chương 6 (phân quyền theo đối tượng) chuyển sang 404 và giải thích sự đánh đổi.</p></div>

<h3>409 Conflict: mã của chuyện đặt trùng</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_bin' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T09:00:00+07:00","endAt":"2026-11-02T11:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 101
ETag: W/"65-jELg4Gt2GmgcAO47S0BO+GCp3pc"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "BOOKING_CONFLICT",
  "message": "Phòng đã có lượt bk_1 trong khung giờ này"
}</div>
<p>Khung 9–11h của Bình trùng với 8–10h của An. Giờ An huỷ, và Bình gửi lại đúng request đó:</p>
<pre><code class="language-bash">curl -i -X POST http://localhost:4000/bookings/bk_1/cancel -H 'Authorization: Bearer tok_an'
curl -i -X POST http://localhost:4000/bookings/bk_1/cancel -H 'Authorization: Bearer tok_an'
curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_bin' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T09:00:00+07:00","endAt":"2026-11-02T11:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 281
ETag: W/"119-t+vvMaIGOQQ/Shj1td4GPGtoqHU"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": "SWT301 Lab 3",
  "status": "CANCELLED",
  "createdAt": "2026-10-31T15:43:26.161Z",
  "cancelledAt": "2026-10-31T15:43:26.289Z"
}
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 80
ETag: W/"50-nX4uWQpVi5Y3xPqLLqOqJ4T8l7E"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ALREADY_CANCELLED",
  "message": "Lượt bk_1 đã huỷ rồi"
}
{
  "id": "bk_2",
  "labId": "lab_1",
  "userId": "usr_2",
  "startAt": "2026-11-02T02:00:00.000Z",
  "endAt": "2026-11-02T04:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  "createdAt": "2026-10-31T15:43:26.325Z"
}</div>
<p>Đúng request đã nhận 409 một phút trước giờ lại thành công. Đó là dấu hiệu nhận biết <strong>409</strong>: request hợp lệ, nhưng xung đột với <em>trạng thái hiện tại</em> của tài nguyên, và có thể thành công về sau. So với <strong>422</strong>, thứ sai ở bất kỳ trạng thái nào (giờ kết thúc trước giờ bắt đầu thì chẳng bao giờ hợp lệ). Huỷ hai lần cũng là 409: hành động nói chung là ổn, chỉ là không ổn với trạng thái hiện tại của lượt đặt.</p>

<h3>415 Unsupported Media Type</h3>
<pre><code class="language-bash">curl -i -X PATCH http://localhost:4000/devices/dev_1 -H 'Authorization: Bearer tok_lan' \\
  -H 'Content-Type: text/plain' -d 'status=MAINTENANCE'</code></pre>
<div class="out">HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json; charset=utf-8
Content-Length: 102
ETag: W/"66-7tdGTu3GtvaychyKNRYbs0d5kyg"
Date: Sat, 31 Oct 2026 15:43:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "UNSUPPORTED_MEDIA_TYPE",
  "message": "Gửi body dạng application/merge-patch+json"
}</div>
<p><strong>415</strong> là câu trả lời chính xác khi <code>Content-Type</code> là loại endpoint không nhận — rõ ràng hơn một lỗi 400 "thiếu trường" khó hiểu.</p>

<h3>5xx: lỗi của ta — nhận lỗi, nhưng nói ít thôi</h3>
<p>Để thấy một lỗi 500 thật, thêm tạm một route có lỗi ngay trên lưới hứng 404 trong <code>app.js</code>, rồi xoá đi sau khi thử:</p>
<pre><code class="language-javascript">// TẠM để thử lỗi 500 — xoá sau khi thử
app.get('/debug/boom', async (req, res) =&gt; {
  const rows = undefined;              // giả sử truy vấn CSDL trả về undefined
  res.json({ total: rows.length });    // ⇒ TypeError
});</code></pre>
<pre><code class="language-bash">curl -i http://localhost:4000/debug/boom</code></pre>
<div class="out">HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-OPvq4uFWrS3OFyeJLrxQ0lr6I3Q"
Date: Sat, 31 Oct 2026 16:12:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "INTERNAL",
  "message": "Máy chủ gặp lỗi, thử lại sau"
}</div>
<p>Terminal 1 (server) cho thấy nguyên nhân thật:</p>
<div class="out">TypeError: Cannot read properties of undefined (reading 'length')
    at file:///…/src/app.js:20:26
    at Layer.handleRequest (…/node_modules/router/lib/layer.js:152:17)
    …</div>
<p>Route này là <code>async</code>: ở Express 4, lỗi bị ném ra này sẽ không bao giờ tới bộ xử lý lỗi; Express 5 thì bắt được. Nhưng nếu không có bộ xử lý của riêng ta, Express trả trang mặc định — và ở chế độ phát triển, trang đó chứa <strong>toàn bộ stack trace kèm đường dẫn tệp</strong>. Đây là phần đầu của thứ mà một app Express 5 trần (cùng lỗi đó, không có bộ xử lý riêng) đã gửi cho client:</p>
<div class="out">HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 2066
…

&lt;!DOCTYPE html&gt;
…
&lt;pre&gt;TypeError: Cannot read properties of undefined (reading &amp;#39;length&amp;#39;)&lt;br&gt; &amp;nbsp; &amp;nbsp;at file:///…/boom.mjs:5:26&lt;br&gt; …</div>
<p>Với <code>NODE_ENV=production</code>, Express rút gọn thành <code>Internal Server Error</code>, nhưng vẫn là HTML. Bộ xử lý lỗi JSON của chính bạn mới là cách sửa đáng tin. Thêm hai luật cho 5xx: <strong>503 Service Unavailable</strong> (kèm <code>Retry-After</code>) nghĩa là "tạm thời không phục vụ được — quá tải hoặc bảo trì" (Chương 8); và đừng bao giờ trả 4xx cho lỗi của chính mình hay 5xx cho lỗi của client — bảng giám sát đếm chúng riêng, và cảnh báo sẽ réo nhầm đội.</p>

<h3>Bẫy: 200 cho mọi thứ</h3>
<p>Có những API trả 200 cho mọi request và đặt kết quả thật vào body. Ta viết một server nhỏ làm đúng như vậy (<code>bad200.mjs</code>, cổng 4003) để xem hậu quả:</p>
<pre><code class="language-javascript">// bad200.mjs — CÁCH SAI: lỗi gì cũng trả 200
app.post('/bookings', (req, res) =&gt; {
  const { startAt, endAt } = req.body;
  if (new Date(endAt) &lt;= new Date(startAt)) {
    return res.json({ success: false, error: 'endAt must be after startAt' });
  }
  res.json({ success: true });
});</code></pre>
<pre><code class="language-bash">curl -i -X POST http://localhost:4003/bookings --json '{"startAt":"2026-11-02T10:00:00+07:00","endAt":"2026-11-02T08:00:00+07:00"}'</code></pre>
<div class="out">HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 55
ETag: W/"37-XTcZE3lSYm/qMpEWYh38zkdMWEk"
Date: Sat, 31 Oct 2026 16:14:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"success":false,"error":"endAt must be after startAt"}</div>
<p>Với <code>fetch</code>, đây là thành công (<code>res.ok === true</code>); với cache, một câu trả lời cache được; với bảng giám sát, một người dùng vui vẻ. Client nào cũng phải đọc body mới biết sự thật — và client nào quên sẽ hiện "Đặt phòng thành công!", y như câu chuyện ngày demo. LabFlow trả <code>422</code> cho cùng đầu vào đó (xem ở trên); body chỉ bổ sung chi tiết.</p>

<h3>Bảng tra nhanh: các mã LabFlow dùng</h3>
<table>
  <thead><tr><th>Mã</th><th>Tên</th><th>Ví dụ LabFlow</th></tr></thead>
  <tbody>
    <tr><td>200</td><td>OK</td><td>GET một phòng; hành động huỷ trả về lượt đặt</td></tr>
    <tr><td>201</td><td>Created</td><td>POST /bookings, POST /devices — kèm <code>Location</code></td></tr>
    <tr><td>204</td><td>No Content</td><td>DELETE /devices/{id}; OPTIONS</td></tr>
    <tr><td>400</td><td>Bad Request</td><td>JSON hỏng, thiếu trường, ngày giờ sai định dạng</td></tr>
    <tr><td>401</td><td>Unauthorized</td><td>không có token hoặc token lạ — kèm <code>WWW-Authenticate</code></td></tr>
    <tr><td>403</td><td>Forbidden</td><td>sinh viên xoá thiết bị; đọc lượt đặt của người khác</td></tr>
    <tr><td>404 / 410</td><td>Not Found / Gone</td><td>không có <code>bk_99</code>; phòng <code>lab_4</code> đã ngừng dùng</td></tr>
    <tr><td>405</td><td>Method Not Allowed</td><td>DELETE /labs/lab_1 — kèm <code>Allow</code></td></tr>
    <tr><td>409</td><td>Conflict</td><td>lượt đặt trùng giờ; huỷ hai lần</td></tr>
    <tr><td>415 / 422</td><td>Unsupported Media Type / Unprocessable</td><td>PATCH gửi dạng text/plain; kết thúc trước khi bắt đầu</td></tr>
    <tr><td>500 / 503</td><td>Internal Server Error / Unavailable</td><td>lỗi của ta; quá tải (Chương 8)</td></tr>
  </tbody>
</table>

<h3>Khi phỏng vấn và khi review code</h3>
<ul>
  <li>"401 hay 403?" — 401: chưa xác thực, gửi kèm <code>WWW-Authenticate</code>; 403: đã xác thực nhưng không được phép.</li>
  <li>"400 hay 422?" — 400: không phân tích được hoặc sai định dạng; 422: đúng định dạng nhưng sai ý nghĩa. Hãy nói rõ luật của nhóm bạn.</li>
  <li>"POST thành công trả về gì?" — 201 Created kèm <code>Location</code> (và thường kèm body).</li>
  <li>Dấu hiệu đỏ khi review: endpoint nào trả 200 với <code>"success": false</code>, hoặc trả 500 cho đầu vào sai của người dùng.</li>
</ul>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9110 — HTTP Semantics (6/2022) — đọc ngày 1/11/2026</span><span class="lc-sub">§15 Status Codes: §15.5.10 409 Conflict, §15.5.16 415 Unsupported Media Type, §15.5.21 422 Unprocessable Content.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Khởi động lại server và đi hết bảng quyết định từ dòng 1 tới dòng 7: tạo ra một response cho mỗi mã 400, 401, 403, 404, 405, 422 và 409, chỉ bằng <code>curl</code>. Ghi lệnh cạnh từng mã.</li>
  <li>Với tư cách Bình, đặt <code>lab_1</code> lúc 10:00–12:00 (giờ Hà Nội) sau lượt 8:00–10:00 của An. Có trùng không? Đoán trước, rồi kiểm.</li>
  <li>Thêm route <code>/debug/boom</code>, so output phía client với terminal của server, rồi xoá route và xác nhận <code>/debug/boom</code> giờ là một lỗi 404 dạng JSON.</li>
  <li>Cho Cô Lan (<code>tok_lan</code>) đọc lượt đặt của An. Dòng nào trong <code>findOwnBooking</code> cho phép điều đó?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có danh sách bảy lệnh, mỗi lệnh cho đúng mã mong muốn, và giải thích được trong một câu vì sao 10:00–12:00 không trùng với 8:00–10:00.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">201 Created + Location</span><span class="v">Một tài nguyên mới đã ra đời; header cho biết URL của nó.</span></div>
  <div class="kv"><span class="k">204 No Content</span><span class="v">Thành công nhưng không có body.</span></div>
  <div class="kv"><span class="k">400 và 422</span><span class="v">Không phân tích được / sai định dạng, so với đúng định dạng nhưng vô lý về nghiệp vụ.</span></div>
  <div class="kv"><span class="k">401 và 403</span><span class="v">Chưa xác thực, so với đã xác thực nhưng không được phép.</span></div>
  <div class="kv"><span class="k">404 và 410</span><span class="v">Không có gì ở đây, so với đã gỡ vĩnh viễn có chủ đích.</span></div>
  <div class="kv"><span class="k">409 Conflict (xung đột)</span><span class="v">Request hợp lệ nhưng đụng trạng thái hiện tại của tài nguyên.</span></div>
  <div class="kv"><span class="k">415 Unsupported Media Type</span><span class="v">Content-Type của body không được endpoint này nhận.</span></div>
  <div class="kv"><span class="k">Stack trace (dấu vết ngăn xếp)</span><span class="v">Danh sách các lời gọi hàm lúc xảy ra lỗi; thuộc về log của server, không bao giờ nằm trong response.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mã trạng thái là một phần của hợp đồng; body bổ sung chi tiết.</li>
  <li>Kiểm theo thứ tự — đọc được, đã xác thực, được phép, có tồn tại, đúng phương thức, hợp lý, không xung đột — mỗi lỗi một mã.</li>
  <li>201 + Location khi tạo mới, 204 khi chẳng có gì để gửi.</li>
  <li>400 request hỏng, 422 nội dung vô lý, 409 xung đột trạng thái; 401 bạn là ai, 403 không được phép; 404 không có, 410 đã gỡ.</li>
  <li>5xx là lỗi của ta: ghi log chi tiết phía server, gửi một câu JSON ngắn — không bao giờ để trang HTML mặc định của Express lọt ra.</li>
  <li>Đừng bao giờ trả 200 kèm <code>"success": false</code>.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-4-1-rest-mvc" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp phần này ở SDN302 — bài 4.1: Một REST API đầy đủ với Express, Mongoose &amp; MVC</span><span class="lc-sub">Nếu bạn đã học SDN302 trên Academy, bảng mã trạng thái (200/201/400/401/403/404/500) và lời khuyên "đừng trả 200 cho lỗi" sẽ quen. Giống: các mã cơ bản và một hình dạng lỗi thống nhất. Khác: SDN302 liệt kê các mã; ở đây mã nào cũng được kích hoạt trên API thật và được chọn theo một thứ tự câu hỏi cố định. Bài này thêm: 201 + Location, 400 so với 422, 409 cho xung đột trạng thái, 410, 415, và những gì một lỗi 500 không được làm lộ. Chưa học SDN302 thì bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Naming, casing and consistency: fields, dates, money and ids|||1.4 — Đặt tên, kiểu chữ và nhất quán: trường, ngày giờ, tiền và id',
      slug: 'api-1-4-dat-ten',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một kiểu chữ cho mỗi chỗ, đo thật cái gì phân biệt hoa thường, bộ lọc gõ sai, lỗi bearer viết thường, ngày giờ có múi giờ, tiền không dùng số thực, id dạng chuỗi, null/thiếu/rỗng, enum — và bảng quy ước LabFlow.',
      content: `${G014}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Naming, casing and consistency</h2>
<p class="lead">Resources, methods and status codes are the big decisions. This lesson is about the small ones: what to call a field, how to write a date, how to send money, what an id looks like, what <code>null</code> means. Each looks harmless, and each has broken real clients — usually months after release, when it is too late to change quietly. Every claim below is measured on LabFlow or in Node, not taken on trust.</p>

<h3>One thing, one name</h3>
<p>If a booking’s lab is <code>labId</code> in one endpoint, <code>lab_id</code> in another and <code>roomId</code> in a third, every client needs a translation table, and somebody will get it wrong. The first rule of naming is boring and absolute: <strong>the same concept has the same name, spelled the same way, everywhere in the API</strong>.</p>

<h3>One casing per place</h3>
<table>
  <thead><tr><th>Style</th><th>Looks like</th><th>Common in</th><th>LabFlow uses it for</th></tr></thead>
  <tbody>
    <tr><td>camelCase</td><td><code>startAt</code></td><td>JavaScript / TypeScript APIs</td><td>JSON fields, query keys</td></tr>
    <tr><td>snake_case</td><td><code>start_at</code></td><td>Python, Ruby, many public APIs</td><td>— (fine for database columns)</td></tr>
    <tr><td>kebab-case</td><td><code>lab-rooms</code></td><td>URLs</td><td>words in URL paths</td></tr>
    <tr><td>UPPER_SNAKE</td><td><code>IN_USE</code></td><td>enum values, error codes</td><td>enums and <code>error</code> codes</td></tr>
    <tr><td>Header-Case</td><td><code>Content-Type</code></td><td>HTTP headers</td><td>headers, as the standard writes them</td></tr>
  </tbody>
</table>
<p>There is no universally correct casing. GitHub’s REST API uses snake_case fields; Google’s JSON style guide recommends camelCase. LabFlow picks camelCase because its clients are JavaScript and the JSON maps directly onto objects. What matters is the absence of mixing.</p>

<h3>Field names that explain themselves</h3>
<ul>
  <li><strong>Ids</strong>: the noun plus <code>Id</code> — <code>labId</code>, <code>userId</code>, <code>deviceId</code>.</li>
  <li><strong>Moments in time</strong>: end in <code>At</code> — <code>startAt</code>, <code>createdAt</code>, <code>cancelledAt</code>. (Dates without time: <code>On</code> or <code>Date</code>, e.g. <code>birthDate</code>.)</li>
  <li><strong>Booleans</strong>: a yes/no question — <code>isActive</code>, <code>hasProjector</code>.</li>
  <li><strong>Lists</strong>: plural — <code>devices</code>, <code>tags</code>.</li>
  <li><strong>No private abbreviations</strong>: <code>capacity</code>, not <code>cap</code> or <code>cpty</code>.</li>
  <li><strong>Units when not obvious</strong>: <code>durationMinutes</code>, <code>sizeBytes</code>.</li>
</ul>
<p>A real LabFlow booking from lesson 1.3 already follows all of these: <code>id</code>, <code>labId</code>, <code>userId</code>, <code>startAt</code>, <code>endAt</code>, <code>purpose</code>, <code>status</code>, <code>createdAt</code>.</p>

<h3>What is case-sensitive? Measured</h3>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/Labs
curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/labs/
curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/labs/LAB_1
curl -s http://localhost:4000/bookings -H 'authorization: Bearer tok_an'</code></pre>
<div class="out">200
200
404
{
  "data": []
}</div>
<table>
  <thead><tr><th>Part of the request</th><th>Case-sensitive?</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>Path words (<code>/Labs</code>)</td><td>no — in Express by default</td><td>Express routing is case-insensitive unless you enable <code>case sensitive routing</code></td></tr>
    <tr><td>Trailing slash (<code>/labs/</code>)</td><td>ignored — in Express by default</td><td>“strict routing” is off by default</td></tr>
    <tr><td>Ids in the path (<code>LAB_1</code>)</td><td><strong>yes</strong></td><td>they are data, compared with <code>===</code></td></tr>
    <tr><td>Header names (<code>authorization</code>)</td><td>no</td><td>the HTTP standard says so</td></tr>
    <tr><td>Query keys (<code>?Building=</code>)</td><td><strong>yes</strong></td><td>they are just object keys in <code>req.query</code></td></tr>
  </tbody>
</table>
<p>Do not let “it happens to work” become part of the contract. Another framework, a reverse proxy or an API gateway may treat <code>/Labs</code> or <code>/labs/</code> differently. Document one form — lowercase, no trailing slash — and use only that in examples and clients.</p>

<h3>Trap: a misspelled filter is silently ignored</h3>
<pre><code class="language-bash">curl 'http://localhost:4000/labs?Building=Beta'</code></pre>
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
      "id": "lab_2",
      "code": "AL-305",
      "name": "Phòng Lab IoT",
      "building": "Alpha",
      "capacity": 24
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
<p><code>Building</code> is not <code>building</code>, so the handler never saw a filter and returned everything. The app shows Alpha rooms under a “Beta” filter, no error appears anywhere, and the bug can live for months. Fix it by refusing what you do not understand — add three lines at the top of the <code>GET /labs</code> handler:</p>
<pre><code class="language-javascript">  .get((req, res) =&gt; {
    // Tham số lạ (gõ sai "Building") ⇒ báo lỗi thay vì lặng lẽ bỏ qua
    const unknown = Object.keys(req.query).filter((k) =&gt; !['building'].includes(k));
    if (unknown.length) throw new HttpError(400, 'UNKNOWN_QUERY_PARAM', &#96;Không hỗ trợ tham số: \${unknown.join(', ')}&#96;);
    const { building } = req.query;
    // … như cũ …</code></pre>
<pre><code class="language-bash">curl -i 'http://localhost:4000/labs?Building=Beta'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 90
ETag: W/"5a-ToGameS+yomr0PZnu61WqfhFG68"
Date: Sat, 31 Oct 2026 15:44:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "UNKNOWN_QUERY_PARAM",
  "message": "Không hỗ trợ tham số: Building"
}</div>
<p>Rejecting unknown parameters is a choice, not a law — some APIs ignore them so that old servers tolerate newer clients. For filters, where silence means wrong data, LabFlow rejects.</p>

<h3>A bug we shipped in lesson 1.3 — found in the standard</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings -H 'Authorization: bearer tok_an'</code></pre>
<div class="out">HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
Content-Type: application/json; charset=utf-8
Content-Length: 95
ETag: W/"5f-ANg/5U+skKGv6bdtVP2UY6x3/jc"
Date: Sat, 31 Oct 2026 15:44:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "UNAUTHENTICATED",
  "message": "Cần đăng nhập (thiếu hoặc sai token)"
}</div>
<p>The token is valid; only the word <code>bearer</code> is lowercase. RFC 9110 (§11.1) says the authentication scheme name is <strong>case-insensitive</strong>, and some HTTP libraries and hand-written clients do send it in lowercase. Our <code>auth.js</code> compared with <code>scheme === 'Bearer'</code>. The fix:</p>
<pre><code class="language-javascript">const userId = scheme?.toLowerCase() === 'bearer' ? tokens[token] : undefined;   // RFC 9110: tên scheme không phân biệt hoa thường</code></pre>
<pre><code class="language-bash">curl http://localhost:4000/bookings -H 'Authorization: bearer tok_an'</code></pre>
<div class="out">{
  "data": []
}</div>
<p>The general rule (often called the robustness principle): be strict in what you <em>send</em> — LabFlow’s own docs always write <code>Bearer</code> — and accept what the standard <em>allows</em>. When in doubt, read the RFC section; it is usually a page or two.</p>

<h3>Dates: a time without a zone is a guess</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">client sends</span><span class="lz-t">2027-03-02T08:00:00+07:00</span><span class="lz-d">offset required — no offset ⇒ 400</span></div>
  <div class="lz-step"><span class="lz-k">server parses</span><span class="lz-t">an instant</span><span class="lz-d">the offset turns local time into one moment</span></div>
  <div class="lz-step"><span class="lz-k">stores</span><span class="lz-t">UTC</span><span class="lz-d">2027-03-02T01:00:00.000Z</span></div>
  <div class="lz-step"><span class="lz-k">returns</span><span class="lz-t">Z</span><span class="lz-d">the client formats it for the user</span></div>
</div>
<p>Save this script as <code>naming.mjs</code> next to your project and run it with two different time zones:</p>
<pre><code class="language-javascript">// naming.mjs — ba cái bẫy dữ liệu trong JSON (chạy: node naming.mjs)
const show = (label, value) =&gt; console.log(label.padEnd(44), value);

// 1) Số nguyên lớn
show(&#96;JSON.parse('{"id": 9007199254740993}').id&#96;, JSON.parse('{"id": 9007199254740993}').id);
show('Number.MAX_SAFE_INTEGER', Number.MAX_SAFE_INTEGER);

// 2) Tiền bằng số thực
show('0.1 + 0.2', 0.1 + 0.2);
show('4.35 * 100', 4.35 * 100);
show('435 * 3   (whole cents, integers)', 435 * 3);

// 3) Ngày giờ
show(&#96;new Date('2026-11-02T08:00:00')&#96;, new Date('2026-11-02T08:00:00').toISOString());
show(&#96;new Date('2026-11-02T08:00:00+07:00')&#96;, new Date('2026-11-02T08:00:00+07:00').toISOString());
show(&#96;new Date('2026-11-02')&#96;, new Date('2026-11-02').toISOString());</code></pre>
<pre><code class="language-bash">TZ=Asia/Ho_Chi_Minh node naming.mjs
TZ=UTC node naming.mjs</code></pre>
<div class="out">JSON.parse('{"id": 9007199254740993}').id    9007199254740992
Number.MAX_SAFE_INTEGER                      9007199254740991
0.1 + 0.2                                    0.30000000000000004
4.35 * 100                                   434.99999999999994
435 * 3   (whole cents, integers)            1305
new Date('2026-11-02T08:00:00')              2026-11-02T01:00:00.000Z
new Date('2026-11-02T08:00:00+07:00')        2026-11-02T01:00:00.000Z
new Date('2026-11-02')                       2026-11-02T00:00:00.000Z
JSON.parse('{"id": 9007199254740993}').id    9007199254740992
Number.MAX_SAFE_INTEGER                      9007199254740991
0.1 + 0.2                                    0.30000000000000004
4.35 * 100                                   434.99999999999994
435 * 3   (whole cents, integers)            1305
new Date('2026-11-02T08:00:00')              2026-11-02T08:00:00.000Z
new Date('2026-11-02T08:00:00+07:00')        2026-11-02T01:00:00.000Z
new Date('2026-11-02')                       2026-11-02T00:00:00.000Z</div>
<p>Look at the last three lines of each run. A date-time <strong>without an offset</strong> is read as <em>local time of the machine running the code</em>: 01:00Z on a laptop in Hanoi, 08:00Z on a server or Docker container set to UTC — seven hours apart from identical code. <strong>With</strong> an offset (<code>+07:00</code>) both agree. And a <strong>date-only</strong> string is read as UTC midnight — a different rule again, which trips people who expect local midnight. (<code>TZ=…</code> sets the time zone for one command; it works on macOS and Linux. Your laptop’s own zone is what you get without it.)</p>

<h3>LabFlow’s date rule</h3>
<ol>
  <li><strong>Accept</strong> only RFC 3339 (the internet profile of ISO 8601) date-times <strong>with an offset</strong>: <code>2026-11-02T08:00:00+07:00</code> or <code>2026-11-02T01:00:00Z</code>.</li>
  <li><strong>Store and return UTC</strong> with <code>Z</code>: <code>2026-11-02T01:00:00.000Z</code>. That is why An’s 8:00 booking came back as <code>01:00:00.000Z</code> in lessons 1.1 and 1.3.</li>
  <li>The <strong>client</strong> converts to the user’s local time for display.</li>
  <li><strong>Date-only</strong> values (a birthday, a public holiday) stay <code>YYYY-MM-DD</code>, with no time and no zone.</li>
</ol>
<pre><code class="language-bash">curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00","endAt":"2026-11-02T10:00:00"}'</code></pre>
<div class="out">{
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
}</div>
<p>Refusing the guess with a 400 today is far cheaper than a lecturer arriving at an empty lab at 15:00.</p>

<h3>Money: never a float</h3>
<p>The output above shows why: <code>0.1 + 0.2</code> is <code>0.30000000000000004</code> and <code>4.35 * 100</code> is <code>434.99999999999994</code>. Binary floating point cannot store most decimal fractions exactly; sometimes the error is invisible, sometimes it becomes a one-cent difference in an invoice. Integers are exact. Two safe formats:</p>
<pre><code class="language-json">{ "deposit": { "amount": 150000, "currency": "VND" } }
{ "fee": { "amount": 1999, "currency": "USD" } }
{ "fee": { "amount": "19.99", "currency": "USD" } }</code></pre>
<p>Option A is an integer in the smallest unit (1999 cents = 19.99 USD); option B a decimal string. LabFlow will use option A for device deposits in the capstone. The Vietnamese đồng has no smaller unit in practice, so the amount is whole đồng. Always send the <strong>currency</strong>: the number alone is ambiguous.</p>

<h3>Ids: strings, not big numbers</h3>
<p>The first line of the output: parsing the JSON number <code>9007199254740993</code> in JavaScript silently gives <code>9007199254740992</code>. JavaScript numbers are exact only up to <code>Number.MAX_SAFE_INTEGER</code>, 2<sup>53</sup> − 1. RFC 8259 (JSON, §6) warns that numbers beyond that range may not be exchanged exactly. Twitter’s API, whose ids outgrew 53 bits, sends every id twice — <code>id</code> and <code>id_str</code> — and its developer documentation tells clients to use the string.</p>
<p>LabFlow ids are always <strong>strings</strong>, with a type prefix: <code>"lab_1"</code>, <code>"bk_1"</code>, <code>"dev_3"</code>.</p>
<ul>
  <li>No precision problems, whatever the database uses internally.</li>
  <li>The prefix tells humans and logs what the id is: a <code>bk_</code> id pasted into a <code>/labs/</code> URL is an obvious mistake.</li>
  <li>Clients must treat ids as <strong>opaque</strong>: compare and pass them along, never parse them or do arithmetic. That leaves the server free to change the format later (Chapter 9 discusses ids that do not reveal how many records exist).</li>
</ul>

<h3>null, missing and empty are three different answers</h3>
<table>
  <thead><tr><th>In the JSON</th><th>Means</th><th>LabFlow rule</th></tr></thead>
  <tbody>
    <tr><td><code>"purpose": null</code></td><td>the field exists and has no value</td><td>use for optional fields (see <code>bk_2</code> in lesson 1.3)</td></tr>
    <tr><td>field absent</td><td>unknown, not returned, or an older client</td><td>responses always include every declared field</td></tr>
    <tr><td><code>"devices": []</code></td><td>a list with zero items</td><td>lists are never <code>null</code></td></tr>
    <tr><td><code>"note": null</code> in a PATCH</td><td>remove this field (Merge Patch)</td><td>as in lesson 1.2</td></tr>
  </tbody>
</table>
<p>The practical reason: front-end code like <code>booking.devices.length</code> crashes on <code>null</code> but works on <code>[]</code>. Predictable shapes mean fewer “Cannot read properties of null” errors in your teammates’ console.</p>

<h3>Enums are words</h3>
<p><code>"status": 2</code> means nothing without a lookup table in someone’s head, and if the list is ever reordered, old data silently changes meaning. <code>"status": "PENDING"</code> is readable in logs, in curl output, in a bug report. LabFlow’s enums are UPPER_SNAKE strings: bookings <code>PENDING</code> · <code>APPROVED</code> · <code>CANCELLED</code>; devices <code>AVAILABLE</code> · <code>IN_USE</code> · <code>MAINTENANCE</code>. Adding a value later is a contract change — Chapter 4 explains how to do it without breaking old clients.</p>

<h3>The LabFlow naming guide</h3>
<table>
  <thead><tr><th>Thing</th><th>Rule</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>URL path</td><td>plural nouns, lowercase, kebab-case, no trailing slash</td><td><code>/labs/{labId}/devices</code></td></tr>
    <tr><td>JSON field, query key</td><td>camelCase, full words</td><td><code>startAt</code>, <code>?labId=</code></td></tr>
    <tr><td>Unknown query key</td><td>400 <code>UNKNOWN_QUERY_PARAM</code></td><td><code>?Building=</code> → 400</td></tr>
    <tr><td>Id</td><td>string with a type prefix, opaque</td><td><code>"bk_1"</code></td></tr>
    <tr><td>Date-time</td><td>accept with offset, return UTC <code>Z</code></td><td><code>2026-11-02T01:00:00.000Z</code></td></tr>
    <tr><td>Date only</td><td><code>YYYY-MM-DD</code></td><td><code>2026-09-01</code></td></tr>
    <tr><td>Money</td><td>integer in the smallest unit + currency</td><td><code>{"amount": 150000, "currency": "VND"}</code></td></tr>
    <tr><td>Enum, error code</td><td>UPPER_SNAKE strings</td><td><code>IN_USE</code>, <code>BOOKING_CONFLICT</code></td></tr>
    <tr><td>Optional value / list</td><td><code>null</code> when empty / <code>[]</code>, never <code>null</code></td><td><code>"purpose": null</code></td></tr>
  </tbody>
</table>
<p>Put a table like this in your project’s README on day one. In a team it ends arguments before they begin, and in a code review it turns opinions into a checklist.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc3339.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 3339 — Date and Time on the Internet: Timestamps (Jul 2002) — read 1 Nov 2026</span><span class="lc-sub">§5.6: date-time = full-date "T" full-time, with time-offset = "Z" / ("+" / "-") hh:mm — the format LabFlow accepts.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Microsoft Azure REST API Guidelines — read 1 Nov 2026</span><span class="lc-sub">Two rules LabFlow shares with Microsoft’s guidelines: camelCase for every JSON field name, and RFC 3339 for date-times.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Apply both fixes (unknown query keys and lowercase <code>bearer</code>) and re-run the two failing commands until they behave as shown.</li>
  <li>Run <code>naming.mjs</code> with <code>TZ=Asia/Ho_Chi_Minh</code> and with <code>TZ=America/New_York</code>. Which line changes, and by how many hours?</li>
  <li>A teammate proposes this response for a device deposit: <code>{"Deposit_Amount": 150000.0, "paid": 1, "paidDate": "02/11/2026"}</code>. Rewrite it following the LabFlow guide.</li>
  <li>Find one public API you use (GitHub, a payment gateway, a weather API) and note its casing style, id format and date format.</li>
</ol>
<p><strong>Done when:</strong> <code>?Building=Beta</code> returns 400, <code>bearer</code> in lowercase is accepted, and your rewritten deposit looks like <code>{"deposit": {"amount": 150000, "currency": "VND"}, "isPaid": true, "paidAt": "2026-11-02T03:00:00.000Z"}</code> — or you can explain each difference from it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">camelCase / snake_case / kebab-case</span><span class="v"><code>startAt</code> / <code>start_at</code> / <code>start-at</code>.</span></div>
  <div class="kv"><span class="k">Case-insensitive</span><span class="v">Upper and lower case are treated as the same.</span></div>
  <div class="kv"><span class="k">RFC 3339 / ISO 8601</span><span class="v">Standard text formats for dates and times, e.g. <code>2026-11-02T08:00:00+07:00</code>.</span></div>
  <div class="kv"><span class="k">UTC offset</span><span class="v">How far a local time is from UTC: <code>+07:00</code> for Vietnam; <code>Z</code> means UTC.</span></div>
  <div class="kv"><span class="k">Floating point</span><span class="v">Binary number format that cannot store most decimals exactly.</span></div>
  <div class="kv"><span class="k">MAX_SAFE_INTEGER</span><span class="v">2<sup>53</sup> − 1, the largest integer JavaScript represents exactly.</span></div>
  <div class="kv"><span class="k">Opaque id</span><span class="v">An id clients store and pass back but never interpret.</span></div>
  <div class="kv"><span class="k">Enum</span><span class="v">A field with a closed list of allowed values.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>One concept, one name; one casing per place — camelCase JSON, kebab-case URL words, UPPER_SNAKE enums.</li>
  <li>Ids and query keys are case-sensitive; reject unknown query keys instead of ignoring them.</li>
  <li>Accept what the standard allows (lowercase <code>bearer</code>); send only the canonical form.</li>
  <li>Date-times with an offset in, UTC <code>Z</code> out; date-only values as <code>YYYY-MM-DD</code>.</li>
  <li>Money as an integer in the smallest unit plus currency; ids as opaque prefixed strings.</li>
  <li><code>null</code> ≠ absent ≠ <code>[]</code>; enums are words; write the guide down.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Đặt tên, kiểu chữ và nhất quán</h2>
<p class="lead">Tài nguyên, phương thức và mã trạng thái là những quyết định lớn. Bài này nói về những quyết định nhỏ: gọi một trường là gì, viết ngày giờ thế nào, gửi tiền ra sao, id trông như thế nào, <code>null</code> nghĩa là gì. Cái nào trông cũng vô hại, và cái nào cũng từng làm vỡ client thật — thường là vài tháng sau khi phát hành, lúc đã quá muộn để lặng lẽ sửa. Mọi khẳng định bên dưới đều được đo trên LabFlow hoặc trong Node, không phải tin suông.</p>

<h3>Một thứ, một tên</h3>
<p>Nếu phòng của một lượt đặt là <code>labId</code> ở endpoint này, <code>lab_id</code> ở endpoint kia và <code>roomId</code> ở endpoint thứ ba, client nào cũng cần một bảng tra để dịch, và sẽ có người dịch sai. Luật đầu tiên của việc đặt tên nhàm chán nhưng tuyệt đối: <strong>cùng một khái niệm thì cùng một tên, viết cùng một kiểu, ở mọi nơi trong API</strong>.</p>

<h3>Mỗi chỗ một kiểu chữ</h3>
<table>
  <thead><tr><th>Kiểu</th><th>Trông như</th><th>Phổ biến ở</th><th>LabFlow dùng cho</th></tr></thead>
  <tbody>
    <tr><td>camelCase</td><td><code>startAt</code></td><td>API JavaScript / TypeScript</td><td>trường JSON, khoá query</td></tr>
    <tr><td>snake_case</td><td><code>start_at</code></td><td>Python, Ruby, nhiều API công khai</td><td>— (hợp với cột cơ sở dữ liệu)</td></tr>
    <tr><td>kebab-case</td><td><code>lab-rooms</code></td><td>URL</td><td>các từ trong đường dẫn URL</td></tr>
    <tr><td>UPPER_SNAKE</td><td><code>IN_USE</code></td><td>giá trị enum, mã lỗi</td><td>enum và mã <code>error</code></td></tr>
    <tr><td>Header-Case</td><td><code>Content-Type</code></td><td>header HTTP</td><td>header, đúng như chuẩn viết</td></tr>
  </tbody>
</table>
<p>Không có kiểu chữ nào đúng cho mọi nơi. REST API của GitHub dùng trường snake_case; hướng dẫn JSON của Google khuyên camelCase. LabFlow chọn camelCase vì client của nó là JavaScript và JSON ánh xạ thẳng vào object. Điều quan trọng là không trộn lẫn.</p>

<h3>Tên trường tự giải thích</h3>
<ul>
  <li><strong>Id</strong>: danh từ cộng <code>Id</code> — <code>labId</code>, <code>userId</code>, <code>deviceId</code>.</li>
  <li><strong>Thời điểm</strong>: kết thúc bằng <code>At</code> — <code>startAt</code>, <code>createdAt</code>, <code>cancelledAt</code>. (Ngày không có giờ: <code>On</code> hoặc <code>Date</code>, ví dụ <code>birthDate</code>.)</li>
  <li><strong>Boolean</strong>: một câu hỏi có/không — <code>isActive</code>, <code>hasProjector</code>.</li>
  <li><strong>Danh sách</strong>: số nhiều — <code>devices</code>, <code>tags</code>.</li>
  <li><strong>Không viết tắt kiểu riêng tư</strong>: <code>capacity</code>, không phải <code>cap</code> hay <code>cpty</code>.</li>
  <li><strong>Đơn vị khi không hiển nhiên</strong>: <code>durationMinutes</code>, <code>sizeBytes</code>.</li>
</ul>
<p>Một lượt đặt LabFlow thật ở bài 1.3 đã theo đúng tất cả: <code>id</code>, <code>labId</code>, <code>userId</code>, <code>startAt</code>, <code>endAt</code>, <code>purpose</code>, <code>status</code>, <code>createdAt</code>.</p>

<h3>Cái gì phân biệt hoa thường? Đo thật</h3>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/Labs
curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/labs/
curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/labs/LAB_1
curl -s http://localhost:4000/bookings -H 'authorization: Bearer tok_an'</code></pre>
<div class="out">200
200
404
{
  "data": []
}</div>
<table>
  <thead><tr><th>Phần của request</th><th>Phân biệt hoa thường?</th><th>Vì sao</th></tr></thead>
  <tbody>
    <tr><td>Các từ trong path (<code>/Labs</code>)</td><td>không — mặc định của Express</td><td>định tuyến Express không phân biệt hoa thường trừ khi bật <code>case sensitive routing</code></td></tr>
    <tr><td>Gạch chéo cuối (<code>/labs/</code>)</td><td>bị bỏ qua — mặc định của Express</td><td>"strict routing" mặc định tắt</td></tr>
    <tr><td>Id trong path (<code>LAB_1</code>)</td><td><strong>có</strong></td><td>id là dữ liệu, so bằng <code>===</code></td></tr>
    <tr><td>Tên header (<code>authorization</code>)</td><td>không</td><td>chuẩn HTTP quy định vậy</td></tr>
    <tr><td>Khoá query (<code>?Building=</code>)</td><td><strong>có</strong></td><td>chúng chỉ là các khoá object trong <code>req.query</code></td></tr>
  </tbody>
</table>
<p>Đừng để chuyện "tình cờ chạy được" thành một phần của hợp đồng. Framework khác, reverse proxy hay API gateway có thể xử lý <code>/Labs</code> hoặc <code>/labs/</code> khác đi. Hãy ghi tài liệu một dạng duy nhất — chữ thường, không gạch chéo cuối — và chỉ dùng dạng đó trong ví dụ và client.</p>

<h3>Bẫy: bộ lọc gõ sai bị lặng lẽ bỏ qua</h3>
<pre><code class="language-bash">curl 'http://localhost:4000/labs?Building=Beta'</code></pre>
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
      "id": "lab_2",
      "code": "AL-305",
      "name": "Phòng Lab IoT",
      "building": "Alpha",
      "capacity": 24
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
<p><code>Building</code> không phải <code>building</code>, nên handler chẳng thấy bộ lọc nào và trả về tất cả. App hiện phòng toà Alpha dưới bộ lọc "Beta", không có lỗi nào xuất hiện ở đâu cả, và lỗi này có thể sống hàng tháng trời. Sửa bằng cách từ chối thứ mình không hiểu — thêm ba dòng ở đầu handler <code>GET /labs</code>:</p>
<pre><code class="language-javascript">  .get((req, res) =&gt; {
    // Tham số lạ (gõ sai "Building") ⇒ báo lỗi thay vì lặng lẽ bỏ qua
    const unknown = Object.keys(req.query).filter((k) =&gt; !['building'].includes(k));
    if (unknown.length) throw new HttpError(400, 'UNKNOWN_QUERY_PARAM', &#96;Không hỗ trợ tham số: \${unknown.join(', ')}&#96;);
    const { building } = req.query;
    // … như cũ …</code></pre>
<pre><code class="language-bash">curl -i 'http://localhost:4000/labs?Building=Beta'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 90
ETag: W/"5a-ToGameS+yomr0PZnu61WqfhFG68"
Date: Sat, 31 Oct 2026 15:44:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "UNKNOWN_QUERY_PARAM",
  "message": "Không hỗ trợ tham số: Building"
}</div>
<p>Từ chối tham số lạ là một lựa chọn, không phải luật — có API cố ý bỏ qua chúng để server cũ chịu được client mới hơn. Với bộ lọc, nơi im lặng đồng nghĩa với dữ liệu sai, LabFlow chọn từ chối.</p>

<h3>Một lỗi ta để lọt ở bài 1.3 — tìm ra nhờ đọc chuẩn</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/bookings -H 'Authorization: bearer tok_an'</code></pre>
<div class="out">HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
Content-Type: application/json; charset=utf-8
Content-Length: 95
ETag: W/"5f-ANg/5U+skKGv6bdtVP2UY6x3/jc"
Date: Sat, 31 Oct 2026 15:44:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "UNAUTHENTICATED",
  "message": "Cần đăng nhập (thiếu hoặc sai token)"
}</div>
<p>Token hợp lệ; chỉ chữ <code>bearer</code> viết thường. RFC 9110 (§11.1) nói tên cơ chế xác thực <strong>không phân biệt hoa thường</strong>, và có những thư viện HTTP hay client viết tay gửi nó viết thường thật. <code>auth.js</code> của ta lại so bằng <code>scheme === 'Bearer'</code>. Cách sửa:</p>
<pre><code class="language-javascript">const userId = scheme?.toLowerCase() === 'bearer' ? tokens[token] : undefined;   // RFC 9110: tên scheme không phân biệt hoa thường</code></pre>
<pre><code class="language-bash">curl http://localhost:4000/bookings -H 'Authorization: bearer tok_an'</code></pre>
<div class="out">{
  "data": []
}</div>
<p>Luật chung (hay gọi là nguyên tắc bền vững — robustness principle): nghiêm ngặt với thứ mình <em>gửi</em> — tài liệu của LabFlow luôn viết <code>Bearer</code> — và chấp nhận những gì chuẩn <em>cho phép</em>. Khi phân vân, hãy đọc đúng mục đó trong RFC; thường chỉ một hai trang.</p>

<h3>Ngày giờ: giờ không kèm múi giờ là một phỏng đoán</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">client gửi</span><span class="lz-t">2027-03-02T08:00:00+07:00</span><span class="lz-d">bắt buộc có múi giờ — thiếu ⇒ 400</span></div>
  <div class="lz-step"><span class="lz-k">server đọc</span><span class="lz-t">một thời điểm</span><span class="lz-d">múi giờ biến giờ địa phương thành một thời điểm</span></div>
  <div class="lz-step"><span class="lz-k">lưu</span><span class="lz-t">UTC</span><span class="lz-d">2027-03-02T01:00:00.000Z</span></div>
  <div class="lz-step"><span class="lz-k">trả về</span><span class="lz-t">Z</span><span class="lz-d">client tự định dạng cho người dùng</span></div>
</div>
<p>Lưu đoạn script này thành <code>naming.mjs</code> cạnh dự án và chạy với hai múi giờ khác nhau:</p>
<pre><code class="language-javascript">// naming.mjs — ba cái bẫy dữ liệu trong JSON (chạy: node naming.mjs)
const show = (label, value) =&gt; console.log(label.padEnd(44), value);

// 1) Số nguyên lớn
show(&#96;JSON.parse('{"id": 9007199254740993}').id&#96;, JSON.parse('{"id": 9007199254740993}').id);
show('Number.MAX_SAFE_INTEGER', Number.MAX_SAFE_INTEGER);

// 2) Tiền bằng số thực
show('0.1 + 0.2', 0.1 + 0.2);
show('4.35 * 100', 4.35 * 100);
show('435 * 3   (whole cents, integers)', 435 * 3);

// 3) Ngày giờ
show(&#96;new Date('2026-11-02T08:00:00')&#96;, new Date('2026-11-02T08:00:00').toISOString());
show(&#96;new Date('2026-11-02T08:00:00+07:00')&#96;, new Date('2026-11-02T08:00:00+07:00').toISOString());
show(&#96;new Date('2026-11-02')&#96;, new Date('2026-11-02').toISOString());</code></pre>
<pre><code class="language-bash">TZ=Asia/Ho_Chi_Minh node naming.mjs
TZ=UTC node naming.mjs</code></pre>
<div class="out">JSON.parse('{"id": 9007199254740993}').id    9007199254740992
Number.MAX_SAFE_INTEGER                      9007199254740991
0.1 + 0.2                                    0.30000000000000004
4.35 * 100                                   434.99999999999994
435 * 3   (whole cents, integers)            1305
new Date('2026-11-02T08:00:00')              2026-11-02T01:00:00.000Z
new Date('2026-11-02T08:00:00+07:00')        2026-11-02T01:00:00.000Z
new Date('2026-11-02')                       2026-11-02T00:00:00.000Z
JSON.parse('{"id": 9007199254740993}').id    9007199254740992
Number.MAX_SAFE_INTEGER                      9007199254740991
0.1 + 0.2                                    0.30000000000000004
4.35 * 100                                   434.99999999999994
435 * 3   (whole cents, integers)            1305
new Date('2026-11-02T08:00:00')              2026-11-02T08:00:00.000Z
new Date('2026-11-02T08:00:00+07:00')        2026-11-02T01:00:00.000Z
new Date('2026-11-02')                       2026-11-02T00:00:00.000Z</div>
<p>Nhìn ba dòng cuối của mỗi lần chạy. Ngày giờ <strong>không kèm độ lệch múi giờ</strong> được đọc theo <em>giờ địa phương của máy đang chạy code</em>: 01:00Z trên laptop ở Hà Nội, 08:00Z trên server hay container Docker đặt giờ UTC — lệch bảy tiếng từ cùng một đoạn code. <strong>Có</strong> độ lệch (<code>+07:00</code>) thì cả hai khớp nhau. Còn chuỗi <strong>chỉ có ngày</strong> lại được đọc là nửa đêm UTC — một luật khác nữa, làm vấp những ai tưởng là nửa đêm giờ địa phương. (<code>TZ=…</code> đặt múi giờ cho riêng một lệnh; chạy được trên macOS và Linux. Không có nó thì máy dùng múi giờ của chính laptop bạn.)</p>

<h3>Luật ngày giờ của LabFlow</h3>
<ol>
  <li><strong>Chỉ nhận</strong> ngày giờ theo RFC 3339 (bản rút gọn cho Internet của ISO 8601) <strong>có độ lệch múi giờ</strong>: <code>2026-11-02T08:00:00+07:00</code> hoặc <code>2026-11-02T01:00:00Z</code>.</li>
  <li><strong>Lưu và trả về giờ UTC</strong> kèm <code>Z</code>: <code>2026-11-02T01:00:00.000Z</code>. Đó là lý do lượt đặt 8:00 của An quay về thành <code>01:00:00.000Z</code> ở bài 1.1 và 1.3.</li>
  <li><strong>Client</strong> tự đổi sang giờ địa phương của người dùng khi hiển thị.</li>
  <li>Giá trị <strong>chỉ có ngày</strong> (ngày sinh, ngày lễ) giữ dạng <code>YYYY-MM-DD</code>, không giờ, không múi giờ.</li>
</ol>
<pre><code class="language-bash">curl -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' \\
  --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00","endAt":"2026-11-02T10:00:00"}'</code></pre>
<div class="out">{
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
}</div>
<p>Từ chối việc đoán bằng một lỗi 400 hôm nay rẻ hơn rất nhiều so với cảnh giảng viên tới một phòng lab trống lúc 15:00.</p>

<h3>Tiền: không bao giờ là số thực</h3>
<p>Output ở trên cho thấy lý do: <code>0.1 + 0.2</code> ra <code>0.30000000000000004</code> và <code>4.35 * 100</code> ra <code>434.99999999999994</code>. Số thực nhị phân (floating point) không lưu chính xác được phần lớn phân số thập phân; có khi sai số vô hình, có khi thành chênh lệch một xu trên hoá đơn. Số nguyên thì chính xác. Hai định dạng an toàn:</p>
<pre><code class="language-json">{ "deposit": { "amount": 150000, "currency": "VND" } }
{ "fee": { "amount": 1999, "currency": "USD" } }
{ "fee": { "amount": "19.99", "currency": "USD" } }</code></pre>
<p>Cách A là số nguyên theo đơn vị nhỏ nhất (1999 cent = 19,99 USD); cách B là chuỗi thập phân. LabFlow sẽ dùng cách A cho tiền đặt cọc thiết bị trong dự án cuối khoá. Tiền đồng trên thực tế không có đơn vị nhỏ hơn, nên số tiền là đồng chẵn. Luôn gửi kèm <strong>loại tiền</strong>: chỉ một con số thì mơ hồ.</p>

<h3>Id: chuỗi, không phải số lớn</h3>
<p>Dòng đầu của output: phân tích số JSON <code>9007199254740993</code> trong JavaScript lặng lẽ cho ra <code>9007199254740992</code>. Số trong JavaScript chỉ chính xác tới <code>Number.MAX_SAFE_INTEGER</code>, tức 2<sup>53</sup> − 1. RFC 8259 (JSON, §6) cảnh báo các số vượt khoảng đó có thể không được trao đổi chính xác. API của Twitter, có id vượt quá 53 bit, gửi mỗi id hai lần — <code>id</code> và <code>id_str</code> — và tài liệu dành cho nhà phát triển dặn client dùng bản chuỗi.</p>
<p>Id của LabFlow luôn là <strong>chuỗi</strong>, có tiền tố loại: <code>"lab_1"</code>, <code>"bk_1"</code>, <code>"dev_3"</code>.</p>
<ul>
  <li>Không có chuyện mất độ chính xác, dù cơ sở dữ liệu bên trong dùng gì.</li>
  <li>Tiền tố cho người đọc và log biết đó là id gì: dán một id <code>bk_</code> vào URL <code>/labs/</code> là lỗi lộ ra ngay.</li>
  <li>Client phải coi id là <strong>"hộp kín"</strong> (opaque): chỉ so sánh và gửi lại, không bao giờ phân tích hay làm phép tính. Như vậy server được tự do đổi định dạng về sau (Chương 9 bàn về những id không làm lộ có bao nhiêu bản ghi).</li>
</ul>

<h3>null, thiếu trường và rỗng là ba câu trả lời khác nhau</h3>
<table>
  <thead><tr><th>Trong JSON</th><th>Nghĩa là</th><th>Luật của LabFlow</th></tr></thead>
  <tbody>
    <tr><td><code>"purpose": null</code></td><td>trường có tồn tại và không có giá trị</td><td>dùng cho trường tuỳ chọn (xem <code>bk_2</code> ở bài 1.3)</td></tr>
    <tr><td>vắng mặt trường</td><td>không rõ, không được trả về, hoặc client cũ</td><td>response luôn có đủ mọi trường đã khai báo</td></tr>
    <tr><td><code>"devices": []</code></td><td>danh sách không có phần tử nào</td><td>danh sách không bao giờ là <code>null</code></td></tr>
    <tr><td><code>"note": null</code> trong PATCH</td><td>xoá trường này (Merge Patch)</td><td>như ở bài 1.2</td></tr>
  </tbody>
</table>
<p>Lý do thực tế: code front-end kiểu <code>booking.devices.length</code> sập với <code>null</code> nhưng chạy được với <code>[]</code>. Hình dạng dễ đoán nghĩa là ít lỗi "Cannot read properties of null" hơn trong console của đồng đội.</p>

<h3>Enum là chữ</h3>
<p><code>"status": 2</code> chẳng có nghĩa gì nếu không có cái bảng tra nằm trong đầu ai đó, và nếu danh sách bị đổi thứ tự thì dữ liệu cũ lặng lẽ đổi nghĩa. <code>"status": "PENDING"</code> đọc được trong log, trong output curl, trong báo cáo lỗi. Enum của LabFlow là chuỗi UPPER_SNAKE: lượt đặt <code>PENDING</code> · <code>APPROVED</code> · <code>CANCELLED</code>; thiết bị <code>AVAILABLE</code> · <code>IN_USE</code> · <code>MAINTENANCE</code>. Thêm một giá trị về sau là thay đổi hợp đồng — Chương 4 giải thích cách làm mà không làm vỡ client cũ.</p>

<h3>Hướng dẫn đặt tên của LabFlow</h3>
<table>
  <thead><tr><th>Thứ</th><th>Luật</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Đường dẫn URL</td><td>danh từ số nhiều, chữ thường, kebab-case, không gạch chéo cuối</td><td><code>/labs/{labId}/devices</code></td></tr>
    <tr><td>Trường JSON, khoá query</td><td>camelCase, từ đầy đủ</td><td><code>startAt</code>, <code>?labId=</code></td></tr>
    <tr><td>Khoá query lạ</td><td>400 <code>UNKNOWN_QUERY_PARAM</code></td><td><code>?Building=</code> → 400</td></tr>
    <tr><td>Id</td><td>chuỗi có tiền tố loại, "hộp kín"</td><td><code>"bk_1"</code></td></tr>
    <tr><td>Ngày giờ</td><td>nhận có độ lệch, trả về UTC <code>Z</code></td><td><code>2026-11-02T01:00:00.000Z</code></td></tr>
    <tr><td>Chỉ có ngày</td><td><code>YYYY-MM-DD</code></td><td><code>2026-09-01</code></td></tr>
    <tr><td>Tiền</td><td>số nguyên theo đơn vị nhỏ nhất + loại tiền</td><td><code>{"amount": 150000, "currency": "VND"}</code></td></tr>
    <tr><td>Enum, mã lỗi</td><td>chuỗi UPPER_SNAKE</td><td><code>IN_USE</code>, <code>BOOKING_CONFLICT</code></td></tr>
    <tr><td>Giá trị tuỳ chọn / danh sách</td><td><code>null</code> khi trống / <code>[]</code>, không bao giờ <code>null</code></td><td><code>"purpose": null</code></td></tr>
  </tbody>
</table>
<p>Hãy đặt một bảng như thế này vào README của dự án ngay ngày đầu. Trong nhóm, nó dập tắt tranh cãi trước khi tranh cãi bắt đầu; khi review code, nó biến ý kiến cá nhân thành một danh sách kiểm tra.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc3339.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 3339 — Date and Time on the Internet: Timestamps (7/2002) — đọc ngày 1/11/2026</span><span class="lc-sub">§5.6: date-time = full-date "T" full-time, với time-offset = "Z" / ("+" / "-") hh:mm — đúng định dạng LabFlow nhận.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Microsoft Azure REST API Guidelines — đọc ngày 1/11/2026</span><span class="lc-sub">Hai luật LabFlow trùng với hướng dẫn của Microsoft: camelCase cho mọi tên trường JSON, và RFC 3339 cho ngày giờ.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Áp cả hai bản sửa (khoá query lạ và <code>bearer</code> viết thường) rồi chạy lại hai lệnh đang lỗi cho tới khi chúng cư xử đúng như trong bài.</li>
  <li>Chạy <code>naming.mjs</code> với <code>TZ=Asia/Ho_Chi_Minh</code> và với <code>TZ=America/New_York</code>. Dòng nào thay đổi, và lệch bao nhiêu giờ?</li>
  <li>Một bạn cùng nhóm đề xuất response này cho tiền đặt cọc thiết bị: <code>{"Deposit_Amount": 150000.0, "paid": 1, "paidDate": "02/11/2026"}</code>. Viết lại theo hướng dẫn của LabFlow.</li>
  <li>Tìm một API công khai bạn đang dùng (GitHub, cổng thanh toán, API thời tiết) và ghi lại kiểu chữ, định dạng id và định dạng ngày giờ của nó.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>?Building=Beta</code> trả 400, <code>bearer</code> viết thường được chấp nhận, và bản viết lại của bạn trông như <code>{"deposit": {"amount": 150000, "currency": "VND"}, "isPaid": true, "paidAt": "2026-11-02T03:00:00.000Z"}</code> — hoặc bạn giải thích được từng điểm khác với nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">camelCase / snake_case / kebab-case</span><span class="v"><code>startAt</code> / <code>start_at</code> / <code>start-at</code>.</span></div>
  <div class="kv"><span class="k">Case-insensitive (không phân biệt hoa thường)</span><span class="v">Chữ hoa và chữ thường được coi là như nhau.</span></div>
  <div class="kv"><span class="k">RFC 3339 / ISO 8601</span><span class="v">Định dạng văn bản chuẩn cho ngày giờ, ví dụ <code>2026-11-02T08:00:00+07:00</code>.</span></div>
  <div class="kv"><span class="k">UTC offset (độ lệch múi giờ)</span><span class="v">Giờ địa phương cách UTC bao nhiêu: <code>+07:00</code> cho Việt Nam; <code>Z</code> nghĩa là UTC.</span></div>
  <div class="kv"><span class="k">Floating point (số thực dấu phẩy động)</span><span class="v">Định dạng số nhị phân không lưu chính xác được phần lớn số thập phân.</span></div>
  <div class="kv"><span class="k">MAX_SAFE_INTEGER</span><span class="v">2<sup>53</sup> − 1, số nguyên lớn nhất JavaScript biểu diễn chính xác.</span></div>
  <div class="kv"><span class="k">Opaque id (id "hộp kín")</span><span class="v">Id client chỉ lưu và gửi lại, không bao giờ diễn giải.</span></div>
  <div class="kv"><span class="k">Enum (kiểu liệt kê)</span><span class="v">Trường chỉ nhận một danh sách giá trị đóng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một khái niệm, một tên; mỗi chỗ một kiểu chữ — JSON camelCase, từ trong URL kebab-case, enum UPPER_SNAKE.</li>
  <li>Id và khoá query phân biệt hoa thường; hãy từ chối khoá query lạ thay vì lờ đi.</li>
  <li>Chấp nhận những gì chuẩn cho phép (<code>bearer</code> viết thường); chỉ gửi dạng chuẩn.</li>
  <li>Ngày giờ nhận vào có độ lệch, trả ra UTC <code>Z</code>; giá trị chỉ có ngày dạng <code>YYYY-MM-DD</code>.</li>
  <li>Tiền là số nguyên theo đơn vị nhỏ nhất kèm loại tiền; id là chuỗi có tiền tố, "hộp kín".</li>
  <li><code>null</code> ≠ vắng mặt ≠ <code>[]</code>; enum là chữ; hãy viết hướng dẫn ra.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 1.5 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '1.5 — Lab 1: device issue reports (design, build, prove — with rubric)|||1.5 — Lab 1: báo hỏng thiết bị (thiết kế, dựng, chứng minh — có thang chấm)',
      slug: 'api-1-5-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: thiết kế tài nguyên báo hỏng thiết bị trên giấy, dựng bằng Express 5, chứng minh 8 bước bằng curl; thang chấm 10 điểm, lời giải mẫu và transcript chạy thật.',
      content: `${GL1}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab</span>
<h2>Lab 1 — Device issue reports</h2>
<p class="lead">Time to use every idea of Chapter 1 without a step-by-step guide. You receive a short request from the lab managers, design the new resource on paper, build it into your LabFlow API, and prove each promise with curl. A rubric tells you exactly how it will be marked. The reference solution and a real transcript are at the end — try first, then compare.</p>

<h3>The request</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">design</span><span class="lz-d">DESIGN.md: resources, URLs, methods, codes</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">build</span><span class="lz-d">routes that follow the rules</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">prove</span><span class="lz-d">TRANSCRIPT.md with real curl -i output</span></div>
  <div class="lz-step"><span class="lz-k">score</span><span class="lz-t">rubric</span><span class="lz-d">10 points, pass at 7</span></div>
</div>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 9110 — HTTP Semantics (June 2022) — read 1 Nov 2026</span><span class="lc-sub">The reference for every status code and method rule the rubric checks.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<ul>
  <li>“As a <strong>student</strong> (any logged-in user), I report that a device is broken: a short <strong>title</strong> and a <strong>severity</strong> — <code>LOW</code>, <code>MEDIUM</code> or <code>HIGH</code>.”</li>
  <li>“As anyone, I see all reports of one device, and I can open a single report.”</li>
  <li>“As a <strong>lab manager</strong>, I mark a report as <strong>resolved</strong> — once.”</li>
  <li>“If a report is <code>HIGH</code>, the device must switch to <code>MAINTENANCE</code> immediately, so nobody books it.”</li>
  <li>“And please: two devices must never share the same <strong>serial number</strong>.”</li>
</ul>
<p>Budget: design 20 minutes · build 60–90 minutes · prove 20 minutes. Start from your code at the end of lesson 1.4 (the changed files are listed in “Reference solution” below).</p>

<h3>Part A — design before you code (write <code>DESIGN.md</code>)</h3>
<table>
  <thead><tr><th>Need</th><th>Method</th><th>URL</th><th>Success code</th></tr></thead>
  <tbody>
    <tr><td>report a problem with a device</td><td>?</td><td>?</td><td>?</td></tr>
    <tr><td>list the reports of one device</td><td>?</td><td>?</td><td>?</td></tr>
    <tr><td>open one report</td><td>?</td><td>?</td><td>?</td></tr>
    <tr><td>resolve a report</td><td>?</td><td>?</td><td>?</td></tr>
  </tbody>
</table>
<p>Then decide the status code and <code>error</code> code for each failure: title missing or severity not in the list; device does not exist; a student tries to resolve; resolving twice; <code>DELETE</code> on a report; registering a second device with an existing serial number. Write one sentence of <em>why</em> for each choice — lesson 1.1 for URLs and actions, 1.2 for methods, 1.3 for the order of 4xx questions, 1.4 for names.</p>

<h3>Part B — build it: rules your code must follow</h3>
<ol>
  <li>Follow the LabFlow naming guide (1.4): camelCase fields, string ids with the prefix <code>iss_</code>, UTC times with <code>Z</code>.</li>
  <li>A new report starts with <code>"status": "OPEN"</code> and records <code>reportedBy</code> (the caller’s id) and <code>createdAt</code>.</li>
  <li><code>"severity": "HIGH"</code> sets the device’s <code>status</code> to <code>MAINTENANCE</code> in the same request.</li>
  <li>Every URL answers a wrong method with <code>405</code> and an <code>Allow</code> header (use <code>onlyAllow</code>).</li>
  <li>Every error uses the one shape: <code>error</code>, <code>message</code>, optional <code>details</code> (throw <code>HttpError</code>).</li>
  <li>The nested router is mounted at <code>/devices/:id/issues</code>. Create it with <code>Router({ mergeParams: true })</code> — without that option the router cannot see <code>:id</code>, because the parameter belongs to the mount path, not to its own routes.</li>
</ol>

<h3>Part C — prove it (write <code>TRANSCRIPT.md</code>)</h3>
<p>Restart the server (the in-memory data resets) and run, in this order, pasting every full response unedited:</p>
<ol>
  <li>Report <code>dev_1</code> with severity <code>HIGH</code> as <code>tok_an</code> → expect <strong>201</strong> + <code>Location</code>.</li>
  <li><code>GET /devices/dev_1</code> → status is now <code>MAINTENANCE</code>.</li>
  <li>Report with body <code>{"severity":"URGENT"}</code> → <strong>400</strong> with two <code>details</code>.</li>
  <li>Report on <code>dev_9</code> → <strong>404</strong>.</li>
  <li><code>GET /devices/dev_1/issues</code> → a list with one report.</li>
  <li>Resolve <code>iss_1</code> as <code>tok_an</code> → <strong>403</strong>; as <code>tok_lan</code> → <strong>200</strong>; again → <strong>409</strong>.</li>
  <li><code>DELETE /issues/iss_1</code> → <strong>405</strong> with <code>Allow: GET, HEAD</code>.</li>
  <li><code>POST /devices</code> with serial <code>FTX1840ALBQ</code> (already used by <code>dev_1</code>) → <strong>409</strong>.</li>
</ol>

<h3>Rubric — 10 points</h3>
<table>
  <thead><tr><th>Points</th><th>Criterion</th><th>Checked by</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Design: URLs are plural nouns, nested at most once, resolve is an explicit action with a reason</td><td>reading <code>DESIGN.md</code></td></tr>
    <tr><td>2</td><td>Correct methods and success codes (201 + <code>Location</code> on create, 200 on read and resolve)</td><td>steps 1, 5, 6</td></tr>
    <tr><td>2</td><td>Correct error codes: 400, 404, 403, 409 (twice), 405 + <code>Allow</code></td><td>steps 3, 4, 6, 7, 8</td></tr>
    <tr><td>1</td><td><code>HIGH</code> severity moves the device to <code>MAINTENANCE</code></td><td>step 2</td></tr>
    <tr><td>1</td><td>One JSON error shape everywhere; no HTML responses, even for unknown URLs</td><td>any error + <code>GET /nothing</code></td></tr>
    <tr><td>1</td><td>Naming guide followed (camelCase, <code>iss_</code> ids, UTC <code>Z</code> times)</td><td>reading the responses</td></tr>
    <tr><td>1</td><td><code>TRANSCRIPT.md</code> contains every command and its real, unedited output</td><td>the file in your repository</td></tr>
  </tbody>
</table>
<p><strong>Pass: 7/10.</strong> Below 7, fix and resubmit — Chapter 2 builds on this code. Hand in <code>DESIGN.md</code>, <code>src/routes/issues.js</code> with the changes to <code>app.js</code>, <code>db.js</code> and <code>devices.js</code>, <code>TRANSCRIPT.md</code>, and a commit whose message says what the API gained.</p>

<h3>Stretch goals (no points, real skills)</h3>
<ul>
  <li>Resolving the <em>last</em> open <code>HIGH</code> report of a device sets it back to <code>AVAILABLE</code>.</li>
  <li><code>GET /issues?status=OPEN</code>, rejecting unknown query keys as in lesson 1.4.</li>
  <li>A Bruno collection (lesson 0.2) with one request per transcript step, committed in <code>api-requests/</code>.</li>
  <li>Three sentences in <code>DESIGN.md</code>: why “resolve” is an action and not <code>PATCH {"status": "RESOLVED"}</code>.</li>
</ul>

<h3>Reference solution — read after you have tried</h3>
<p><strong>Design.</strong> <code>POST /devices/{id}/issues</code> → 201 + <code>Location: /issues/{id}</code> · <code>GET /devices/{id}/issues</code> → 200 · <code>GET /issues/{id}</code> → 200 · <code>POST /issues/{id}/resolve</code> → 200. Errors: 400 <code>VALIDATION_FAILED</code> · 404 <code>DEVICE_NOT_FOUND</code> / <code>ISSUE_NOT_FOUND</code> · 403 <code>FORBIDDEN</code> · 409 <code>ALREADY_RESOLVED</code> · 405 + <code>Allow</code> · 409 <code>DUPLICATE_SERIAL</code>. The collection is nested once under its device; each report has a short flat URL; resolve carries rules (manager only, once, a timestamp), so it is an action.</p>
<p><code>src/db.js</code> — add the collection and its counter:</p>
<pre><code class="language-javascript">export const issues = [];        // Lab 1: báo hỏng thiết bị

const counters = { bk: 0, dev: devices.length, iss: 0 };</code></pre>
<p><code>src/routes/issues.js</code>:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices, issues, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];

// Gắn dưới /devices: /devices/:id/issues (bộ sưu tập con)
export const deviceIssuesRouter = Router({ mergeParams: true });
deviceIssuesRouter.route('/')
  .get((req, res) =&gt; {
    const device = findDevice(req.params.id);
    res.json({ data: issues.filter((i) =&gt; i.deviceId === device.id) });
  })
  .post(requireAuth, (req, res) =&gt; {
    const device = findDevice(req.params.id);
    const { title, severity } = req.body ?? {};
    const details = [];
    if (typeof title !== 'string' || !title.trim()) details.push({ field: 'title', issue: 'required' });
    if (!SEVERITIES.includes(severity)) details.push({ field: 'severity', issue: &#96;one of \${SEVERITIES.join(', ')}&#96; });
    if (details.length) throw new HttpError(400, 'VALIDATION_FAILED', 'Dữ liệu báo hỏng chưa đúng', details);
    const issue = { id: nextId('iss'), deviceId: device.id, reportedBy: req.user.id, title: title.trim(),
      severity, status: 'OPEN', createdAt: new Date().toISOString() };
    issues.push(issue);
    if (severity === 'HIGH') device.status = 'MAINTENANCE';   // hỏng nặng ⇒ khoá thiết bị
    res.status(201).location(&#96;/issues/\${issue.id}&#96;).json(issue);
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Gắn ở gốc: /issues/:id và hành động /issues/:id/resolve
export const issuesRouter = Router();
issuesRouter.route('/:id')
  .get((req, res) =&gt; res.json(findIssue(req.params.id)))
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const issue = findIssue(req.params.id);
    if (issue.status === 'RESOLVED') throw new HttpError(409, 'ALREADY_RESOLVED', &#96;Báo hỏng \${issue.id} đã xử lý rồi&#96;);
    issue.status = 'RESOLVED';
    issue.resolvedAt = new Date().toISOString();
    res.json(issue);
  })
  .all(onlyAllow('POST'));

function findDevice(id) {
  const d = devices.find((x) =&gt; x.id === id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${id}&#96;);
  return d;
}
function findIssue(id) {
  const i = issues.find((x) =&gt; x.id === id);
  if (!i) throw new HttpError(404, 'ISSUE_NOT_FOUND', &#96;Không có báo hỏng \${id}&#96;);
  return i;
}</code></pre>
<p><code>src/app.js</code> — mount both routers:</p>
<pre><code class="language-javascript">import { deviceIssuesRouter, issuesRouter } from './routes/issues.js';
// …
app.use('/devices/:id/issues', deviceIssuesRouter);   // đặt TRƯỚC /devices
app.use('/devices', devicesRouter);
app.use('/issues', issuesRouter);</code></pre>
<p><code>src/routes/devices.js</code> — in <code>POST /</code>, right after <code>checkValues(req.body);</code>:</p>
<pre><code class="language-javascript">    if (devices.some((d) =&gt; d.serialNo === req.body.serialNo))
      throw new HttpError(409, 'DUPLICATE_SERIAL', &#96;Đã có thiết bị mang số serial \${req.body.serialNo}&#96;);</code></pre>
<p>Mounting the nested router first is a readability convention here: <code>devicesRouter</code>’s <code>/:id</code> route matches only a single path segment, so <code>/devices/dev_1/issues</code> would not be caught by it anyway. What is <em>required</em> is <code>mergeParams: true</code>.</p>
<p><strong>Reference transcript</strong> (real run, freshly started server):</p>
<div class="out">$ curl -i -X POST http://localhost:4000/devices/dev_1/issues -H 'Authorization: Bearer tok_an' --json '{"title":"Cổng console không lên đèn","severity":"HIGH"}'
HTTP/1.1 201 Created
Location: /issues/iss_1
Content-Type: application/json; charset=utf-8
Content-Length: 199
ETag: W/"c7-w/AMo04zzj7i39XEgU2iiFxlN7M"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "status": "OPEN",
  "createdAt": "2026-10-31T15:45:00.120Z"
}
$ curl http://localhost:4000/devices/dev_1
{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "MAINTENANCE"
}
$ curl -X POST http://localhost:4000/devices/dev_1/issues -H 'Authorization: Bearer tok_an' --json '{"severity":"URGENT"}'
{
  "error": "VALIDATION_FAILED",
  "message": "Dữ liệu báo hỏng chưa đúng",
  "details": [
    {
      "field": "title",
      "issue": "required"
    },
    {
      "field": "severity",
      "issue": "one of LOW, MEDIUM, HIGH"
    }
  ]
}
$ curl -i -X POST http://localhost:4000/devices/dev_9/issues -H 'Authorization: Bearer tok_an' --json '{"title":"x","severity":"LOW"}'
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-KPUFzIOXLuRSt8gts8hFwtIglFk"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "DEVICE_NOT_FOUND",
  "message": "Không có thiết bị dev_9"
}
$ curl http://localhost:4000/devices/dev_1/issues
{
  "data": [
    {
      "id": "iss_1",
      "deviceId": "dev_1",
      "reportedBy": "usr_1",
      "title": "Cổng console không lên đèn",
      "severity": "HIGH",
      "status": "OPEN",
      "createdAt": "2026-10-31T15:45:00.120Z"
    }
  ]
}
$ curl -i -X POST http://localhost:4000/issues/iss_1/resolve -H 'Authorization: Bearer tok_an'
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
Content-Length: 86
ETag: W/"56-S+1oDvbr2pNyxsYSKYTXV4Oet0U"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "FORBIDDEN",
  "message": "Chỉ LAB_MANAGER được làm việc này"
}
$ curl -X POST http://localhost:4000/issues/iss_1/resolve -H 'Authorization: Bearer tok_lan'
{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "status": "RESOLVED",
  "createdAt": "2026-10-31T15:45:00.120Z",
  "resolvedAt": "2026-10-31T15:45:00.191Z"
}
$ curl -i -X POST http://localhost:4000/issues/iss_1/resolve -H 'Authorization: Bearer tok_lan'
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 87
ETag: W/"57-x5BRqLK7LDiLX6MLnqwYvuOnPe8"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ALREADY_RESOLVED",
  "message": "Báo hỏng iss_1 đã xử lý rồi"
}
$ curl -i -X DELETE http://localhost:4000/issues/iss_1
HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: application/json; charset=utf-8
Content-Length: 98
ETag: W/"62-eSmB/n++CtdYFw0Dys8aYlur/+U"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "METHOD_NOT_ALLOWED",
  "message": "DELETE không dùng được ở /issues/iss_1"
}
$ curl -i -X POST http://localhost:4000/devices -H 'Authorization: Bearer tok_lan' --json '{"labId":"lab_1","name":"Router dự phòng","type":"ROUTER","serialNo":"FTX1840ALBQ","status":"AVAILABLE"}'
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 100
ETag: W/"64-WgB1/oSPddBSHIwMMVxtOdNlRe4"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "DUPLICATE_SERIAL",
  "message": "Đã có thiết bị mang số serial FTX1840ALBQ"
}</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab</span>
<h2>Lab 1 — Báo hỏng thiết bị</h2>
<p class="lead">Đã tới lúc dùng mọi ý của Chương 1 mà không có hướng dẫn từng bước. Bạn nhận một yêu cầu ngắn từ quản lý lab, thiết kế tài nguyên mới trên giấy, dựng nó vào LabFlow API của mình, và chứng minh từng lời hứa bằng curl. Thang chấm cho biết chính xác bạn được chấm thế nào. Lời giải mẫu và một bản ghi chạy thật nằm ở cuối — hãy tự làm trước, rồi mới so.</p>

<h3>Yêu cầu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">thiết kế</span><span class="lz-d">DESIGN.md: tài nguyên, URL, phương thức, mã</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">xây</span><span class="lz-d">route theo đúng luật</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">chứng minh</span><span class="lz-d">TRANSCRIPT.md với output curl -i thật</span></div>
  <div class="lz-step"><span class="lz-k">chấm</span><span class="lz-t">thang điểm</span><span class="lz-d">10 điểm, đạt từ 7</span></div>
</div>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc9110.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 9110 — HTTP Semantics (6/2022) — đọc ngày 1/11/2026</span><span class="lc-sub">Tài liệu gốc cho mọi luật mã trạng thái và phương thức mà thang chấm kiểm.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<ul>
  <li>"Là <strong>sinh viên</strong> (bất kỳ ai đã đăng nhập), tôi báo một thiết bị bị hỏng: một <strong>tiêu đề</strong> ngắn và <strong>mức độ</strong> — <code>LOW</code>, <code>MEDIUM</code> hoặc <code>HIGH</code>."</li>
  <li>"Là bất kỳ ai, tôi xem được mọi phiếu báo của một thiết bị, và mở được từng phiếu."</li>
  <li>"Là <strong>quản lý lab</strong>, tôi đánh dấu một phiếu là <strong>đã xử lý</strong> — một lần thôi."</li>
  <li>"Nếu phiếu ở mức <code>HIGH</code>, thiết bị phải chuyển ngay sang <code>MAINTENANCE</code> để không ai đặt nó."</li>
  <li>"Và nhờ luôn: hai thiết bị không bao giờ được trùng <strong>số serial</strong>."</li>
</ul>
<p>Thời gian: thiết kế 20 phút · dựng 60–90 phút · chứng minh 20 phút. Bắt đầu từ code của bạn ở cuối bài 1.4 (các tệp thay đổi được liệt kê ở mục "Lời giải mẫu" bên dưới).</p>

<h3>Phần A — thiết kế trước khi code (viết <code>DESIGN.md</code>)</h3>
<table>
  <thead><tr><th>Nhu cầu</th><th>Phương thức</th><th>URL</th><th>Mã thành công</th></tr></thead>
  <tbody>
    <tr><td>báo hỏng một thiết bị</td><td>?</td><td>?</td><td>?</td></tr>
    <tr><td>liệt kê phiếu báo của một thiết bị</td><td>?</td><td>?</td><td>?</td></tr>
    <tr><td>mở một phiếu</td><td>?</td><td>?</td><td>?</td></tr>
    <tr><td>đánh dấu đã xử lý</td><td>?</td><td>?</td><td>?</td></tr>
  </tbody>
</table>
<p>Rồi quyết định mã trạng thái và mã <code>error</code> cho từng lỗi: thiếu tiêu đề hoặc mức độ không thuộc danh sách; thiết bị không tồn tại; sinh viên cố đánh dấu đã xử lý; xử lý hai lần; <code>DELETE</code> một phiếu; đăng ký thiết bị thứ hai trùng số serial. Viết một câu <em>vì sao</em> cho từng lựa chọn — bài 1.1 cho URL và hành động, 1.2 cho phương thức, 1.3 cho thứ tự các câu hỏi 4xx, 1.4 cho cách đặt tên.</p>

<h3>Phần B — dựng: các luật code phải tuân theo</h3>
<ol>
  <li>Theo hướng dẫn đặt tên của LabFlow (1.4): trường camelCase, id dạng chuỗi có tiền tố <code>iss_</code>, giờ UTC kèm <code>Z</code>.</li>
  <li>Phiếu mới bắt đầu với <code>"status": "OPEN"</code> và ghi lại <code>reportedBy</code> (id người gọi) cùng <code>createdAt</code>.</li>
  <li><code>"severity": "HIGH"</code> đặt <code>status</code> của thiết bị thành <code>MAINTENANCE</code> ngay trong cùng request.</li>
  <li>URL nào cũng trả <code>405</code> kèm header <code>Allow</code> cho phương thức sai (dùng <code>onlyAllow</code>).</li>
  <li>Lỗi nào cũng dùng một hình dạng: <code>error</code>, <code>message</code>, <code>details</code> tuỳ chọn (ném <code>HttpError</code>).</li>
  <li>Router lồng được gắn ở <code>/devices/:id/issues</code>. Tạo nó bằng <code>Router({ mergeParams: true })</code> — thiếu tuỳ chọn này router không nhìn thấy <code>:id</code>, vì tham số đó thuộc về đường dẫn gắn, không thuộc các route của chính nó.</li>
</ol>

<h3>Phần C — chứng minh (viết <code>TRANSCRIPT.md</code>)</h3>
<p>Khởi động lại server (dữ liệu trong bộ nhớ về ban đầu) và chạy theo đúng thứ tự, dán nguyên văn từng response:</p>
<ol>
  <li>Báo hỏng <code>dev_1</code> mức <code>HIGH</code> bằng <code>tok_an</code> → mong đợi <strong>201</strong> + <code>Location</code>.</li>
  <li><code>GET /devices/dev_1</code> → status giờ là <code>MAINTENANCE</code>.</li>
  <li>Báo hỏng với body <code>{"severity":"URGENT"}</code> → <strong>400</strong> kèm hai mục <code>details</code>.</li>
  <li>Báo hỏng <code>dev_9</code> → <strong>404</strong>.</li>
  <li><code>GET /devices/dev_1/issues</code> → danh sách có một phiếu.</li>
  <li>Xử lý <code>iss_1</code> bằng <code>tok_an</code> → <strong>403</strong>; bằng <code>tok_lan</code> → <strong>200</strong>; lần nữa → <strong>409</strong>.</li>
  <li><code>DELETE /issues/iss_1</code> → <strong>405</strong> kèm <code>Allow: GET, HEAD</code>.</li>
  <li><code>POST /devices</code> với serial <code>FTX1840ALBQ</code> (đã thuộc về <code>dev_1</code>) → <strong>409</strong>.</li>
</ol>

<h3>Thang chấm — 10 điểm</h3>
<table>
  <thead><tr><th>Điểm</th><th>Tiêu chí</th><th>Kiểm bằng</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Thiết kế: URL là danh từ số nhiều, lồng tối đa một tầng, "xử lý" là hành động riêng có lý do</td><td>đọc <code>DESIGN.md</code></td></tr>
    <tr><td>2</td><td>Phương thức và mã thành công đúng (201 + <code>Location</code> khi tạo, 200 khi đọc và xử lý)</td><td>bước 1, 5, 6</td></tr>
    <tr><td>2</td><td>Mã lỗi đúng: 400, 404, 403, 409 (hai lần), 405 + <code>Allow</code></td><td>bước 3, 4, 6, 7, 8</td></tr>
    <tr><td>1</td><td>Mức <code>HIGH</code> chuyển thiết bị sang <code>MAINTENANCE</code></td><td>bước 2</td></tr>
    <tr><td>1</td><td>Một hình dạng lỗi JSON ở mọi nơi; không có response HTML nào, kể cả URL lạ</td><td>lỗi bất kỳ + <code>GET /nothing</code></td></tr>
    <tr><td>1</td><td>Theo hướng dẫn đặt tên (camelCase, id <code>iss_</code>, giờ UTC <code>Z</code>)</td><td>đọc các response</td></tr>
    <tr><td>1</td><td><code>TRANSCRIPT.md</code> có mọi lệnh kèm output thật, không sửa</td><td>tệp trong repository của bạn</td></tr>
  </tbody>
</table>
<p><strong>Đạt: 7/10.</strong> Dưới 7 thì sửa và nộp lại — Chương 2 xây trên chính code này. Nộp <code>DESIGN.md</code>, <code>src/routes/issues.js</code> cùng các thay đổi ở <code>app.js</code>, <code>db.js</code> và <code>devices.js</code>, <code>TRANSCRIPT.md</code>, và một commit có message nói rõ API có thêm gì.</p>

<h3>Thử thách thêm (không tính điểm, kỹ năng thật)</h3>
<ul>
  <li>Xử lý phiếu <code>HIGH</code> đang mở <em>cuối cùng</em> của một thiết bị thì trả nó về <code>AVAILABLE</code>.</li>
  <li><code>GET /issues?status=OPEN</code>, từ chối khoá query lạ như bài 1.4.</li>
  <li>Một collection Bruno (bài 0.2) mỗi bước transcript một request, commit trong <code>api-requests/</code>.</li>
  <li>Ba câu trong <code>DESIGN.md</code>: vì sao "xử lý" là một hành động chứ không phải <code>PATCH {"status": "RESOLVED"}</code>.</li>
</ul>

<h3>Lời giải mẫu — đọc sau khi đã tự làm</h3>
<p><strong>Thiết kế.</strong> <code>POST /devices/{id}/issues</code> → 201 + <code>Location: /issues/{id}</code> · <code>GET /devices/{id}/issues</code> → 200 · <code>GET /issues/{id}</code> → 200 · <code>POST /issues/{id}/resolve</code> → 200. Lỗi: 400 <code>VALIDATION_FAILED</code> · 404 <code>DEVICE_NOT_FOUND</code> / <code>ISSUE_NOT_FOUND</code> · 403 <code>FORBIDDEN</code> · 409 <code>ALREADY_RESOLVED</code> · 405 + <code>Allow</code> · 409 <code>DUPLICATE_SERIAL</code>. Bộ sưu tập được lồng một tầng dưới thiết bị; mỗi phiếu có URL ngắn, phẳng; "xử lý" mang luật riêng (chỉ quản lý, một lần, có mốc thời gian) nên nó là một hành động.</p>
<p><code>src/db.js</code> — thêm bộ sưu tập và bộ đếm của nó:</p>
<pre><code class="language-javascript">export const issues = [];        // Lab 1: báo hỏng thiết bị

const counters = { bk: 0, dev: devices.length, iss: 0 };</code></pre>
<p><code>src/routes/issues.js</code>:</p>
<pre><code class="language-javascript">import { Router } from 'express';
import { devices, issues, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];

// Gắn dưới /devices: /devices/:id/issues (bộ sưu tập con)
export const deviceIssuesRouter = Router({ mergeParams: true });
deviceIssuesRouter.route('/')
  .get((req, res) =&gt; {
    const device = findDevice(req.params.id);
    res.json({ data: issues.filter((i) =&gt; i.deviceId === device.id) });
  })
  .post(requireAuth, (req, res) =&gt; {
    const device = findDevice(req.params.id);
    const { title, severity } = req.body ?? {};
    const details = [];
    if (typeof title !== 'string' || !title.trim()) details.push({ field: 'title', issue: 'required' });
    if (!SEVERITIES.includes(severity)) details.push({ field: 'severity', issue: &#96;one of \${SEVERITIES.join(', ')}&#96; });
    if (details.length) throw new HttpError(400, 'VALIDATION_FAILED', 'Dữ liệu báo hỏng chưa đúng', details);
    const issue = { id: nextId('iss'), deviceId: device.id, reportedBy: req.user.id, title: title.trim(),
      severity, status: 'OPEN', createdAt: new Date().toISOString() };
    issues.push(issue);
    if (severity === 'HIGH') device.status = 'MAINTENANCE';   // hỏng nặng ⇒ khoá thiết bị
    res.status(201).location(&#96;/issues/\${issue.id}&#96;).json(issue);
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Gắn ở gốc: /issues/:id và hành động /issues/:id/resolve
export const issuesRouter = Router();
issuesRouter.route('/:id')
  .get((req, res) =&gt; res.json(findIssue(req.params.id)))
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'), (req, res) =&gt; {
    const issue = findIssue(req.params.id);
    if (issue.status === 'RESOLVED') throw new HttpError(409, 'ALREADY_RESOLVED', &#96;Báo hỏng \${issue.id} đã xử lý rồi&#96;);
    issue.status = 'RESOLVED';
    issue.resolvedAt = new Date().toISOString();
    res.json(issue);
  })
  .all(onlyAllow('POST'));

function findDevice(id) {
  const d = devices.find((x) =&gt; x.id === id);
  if (!d) throw new HttpError(404, 'DEVICE_NOT_FOUND', &#96;Không có thiết bị \${id}&#96;);
  return d;
}
function findIssue(id) {
  const i = issues.find((x) =&gt; x.id === id);
  if (!i) throw new HttpError(404, 'ISSUE_NOT_FOUND', &#96;Không có báo hỏng \${id}&#96;);
  return i;
}</code></pre>
<p><code>src/app.js</code> — gắn cả hai router:</p>
<pre><code class="language-javascript">import { deviceIssuesRouter, issuesRouter } from './routes/issues.js';
// …
app.use('/devices/:id/issues', deviceIssuesRouter);   // đặt TRƯỚC /devices
app.use('/devices', devicesRouter);
app.use('/issues', issuesRouter);</code></pre>
<p><code>src/routes/devices.js</code> — trong <code>POST /</code>, ngay sau <code>checkValues(req.body);</code>:</p>
<pre><code class="language-javascript">    if (devices.some((d) =&gt; d.serialNo === req.body.serialNo))
      throw new HttpError(409, 'DUPLICATE_SERIAL', &#96;Đã có thiết bị mang số serial \${req.body.serialNo}&#96;);</code></pre>
<p>Gắn router lồng trước chỉ là quy ước cho dễ đọc: route <code>/:id</code> của <code>devicesRouter</code> chỉ khớp đúng một đoạn đường dẫn, nên đằng nào nó cũng không bắt <code>/devices/dev_1/issues</code>. Điều <em>bắt buộc</em> là <code>mergeParams: true</code>.</p>
<p><strong>Transcript mẫu</strong> (chạy thật, server vừa khởi động):</p>
<div class="out">$ curl -i -X POST http://localhost:4000/devices/dev_1/issues -H 'Authorization: Bearer tok_an' --json '{"title":"Cổng console không lên đèn","severity":"HIGH"}'
HTTP/1.1 201 Created
Location: /issues/iss_1
Content-Type: application/json; charset=utf-8
Content-Length: 199
ETag: W/"c7-w/AMo04zzj7i39XEgU2iiFxlN7M"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "status": "OPEN",
  "createdAt": "2026-10-31T15:45:00.120Z"
}
$ curl http://localhost:4000/devices/dev_1
{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "MAINTENANCE"
}
$ curl -X POST http://localhost:4000/devices/dev_1/issues -H 'Authorization: Bearer tok_an' --json '{"severity":"URGENT"}'
{
  "error": "VALIDATION_FAILED",
  "message": "Dữ liệu báo hỏng chưa đúng",
  "details": [
    {
      "field": "title",
      "issue": "required"
    },
    {
      "field": "severity",
      "issue": "one of LOW, MEDIUM, HIGH"
    }
  ]
}
$ curl -i -X POST http://localhost:4000/devices/dev_9/issues -H 'Authorization: Bearer tok_an' --json '{"title":"x","severity":"LOW"}'
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 79
ETag: W/"4f-KPUFzIOXLuRSt8gts8hFwtIglFk"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "DEVICE_NOT_FOUND",
  "message": "Không có thiết bị dev_9"
}
$ curl http://localhost:4000/devices/dev_1/issues
{
  "data": [
    {
      "id": "iss_1",
      "deviceId": "dev_1",
      "reportedBy": "usr_1",
      "title": "Cổng console không lên đèn",
      "severity": "HIGH",
      "status": "OPEN",
      "createdAt": "2026-10-31T15:45:00.120Z"
    }
  ]
}
$ curl -i -X POST http://localhost:4000/issues/iss_1/resolve -H 'Authorization: Bearer tok_an'
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
Content-Length: 86
ETag: W/"56-S+1oDvbr2pNyxsYSKYTXV4Oet0U"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "FORBIDDEN",
  "message": "Chỉ LAB_MANAGER được làm việc này"
}
$ curl -X POST http://localhost:4000/issues/iss_1/resolve -H 'Authorization: Bearer tok_lan'
{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "status": "RESOLVED",
  "createdAt": "2026-10-31T15:45:00.120Z",
  "resolvedAt": "2026-10-31T15:45:00.191Z"
}
$ curl -i -X POST http://localhost:4000/issues/iss_1/resolve -H 'Authorization: Bearer tok_lan'
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 87
ETag: W/"57-x5BRqLK7LDiLX6MLnqwYvuOnPe8"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ALREADY_RESOLVED",
  "message": "Báo hỏng iss_1 đã xử lý rồi"
}
$ curl -i -X DELETE http://localhost:4000/issues/iss_1
HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: application/json; charset=utf-8
Content-Length: 98
ETag: W/"62-eSmB/n++CtdYFw0Dys8aYlur/+U"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "METHOD_NOT_ALLOWED",
  "message": "DELETE không dùng được ở /issues/iss_1"
}
$ curl -i -X POST http://localhost:4000/devices -H 'Authorization: Bearer tok_lan' --json '{"labId":"lab_1","name":"Router dự phòng","type":"ROUTER","serialNo":"FTX1840ALBQ","status":"AVAILABLE"}'
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8
Content-Length: 100
ETag: W/"64-WgB1/oSPddBSHIwMMVxtOdNlRe4"
Date: Sat, 31 Oct 2026 15:45:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "DUPLICATE_SERIAL",
  "message": "Đã có thiết bị mang số serial FTX1840ALBQ"
}</div>
</div>
`,
    },
    /* ─────────────────────────── 1.6 Kiểm tra (bài MỚI) ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 check: resources, methods, status codes, naming|||1.6 — Kiểm tra Chương 1: tài nguyên, phương thức, mã trạng thái, đặt tên',
      slug: 'api-1-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên LabFlow về URL, safe/idempotent, PUT/PATCH/DELETE, 405, 401/403, 400/422/409 và ngày giờ có múi giờ; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Chapter 1 check: resources, methods, status codes, naming</h2>
<p class="lead">Ten situations from the LabFlow API. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10; if you miss one, re-read the lesson it points to and re-run its curl commands.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can turn a user story into a collection URL, an item URL and, if needed, one action endpoint.</li>
  <li>I can say which methods are safe and which are idempotent, and why that decides retries.</li>
  <li>I can explain PUT vs PATCH with JSON Merge Patch, and why DELETE twice is still idempotent.</li>
  <li>I can pick 400, 401, 403, 404, 405, 409, 410, 415 or 422 with the ordered questions.</li>
  <li>I know LabFlow’s rules for casing, ids, dates, money and null.</li>
  <li>My lab passes at least 7 of the 10 rubric points.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Kiểm tra Chương 1: tài nguyên, phương thức, mã trạng thái, đặt tên</h2>
<p class="lead">Mười tình huống từ LabFlow API. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10; sai câu nào thì đọc lại bài mà câu đó chỉ tới và chạy lại các lệnh curl của bài.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi biến được một user story thành URL bộ sưu tập, URL phần tử và, khi cần, một endpoint hành động.</li>
  <li>Tôi nói được phương thức nào safe, phương thức nào idempotent, và vì sao điều đó quyết định việc gửi lại.</li>
  <li>Tôi giải thích được PUT khác PATCH (JSON Merge Patch) thế nào, và vì sao DELETE hai lần vẫn idempotent.</li>
  <li>Tôi chọn được 400, 401, 403, 404, 405, 409, 410, 415 hay 422 bằng chuỗi câu hỏi có thứ tự.</li>
  <li>Tôi nắm luật của LabFlow về kiểu chữ, id, ngày giờ, tiền và <code>null</code>.</li>
  <li>Lab của tôi đạt ít nhất 7 trên 10 điểm của thang chấm.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Which URL follows LabFlow’s rules for “the devices that belong to lab_1”?|||URL nào theo đúng luật của LabFlow cho "các thiết bị thuộc lab_1"?',
            options: [
              'GET /getDevices?lab=lab_1',
              'GET /lab/lab_1/device',
              'GET /labs/lab_1/devices',
              'GET /labs/lab_1/devices/list',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Plural nouns, the parent id in the path, the child collection nested once, no verbs (lesson 1.1). /labs/lab_1/devices/list looks close but adds a verb-like segment to a collection that GET already lists.|||VI: Danh từ số nhiều, id của cha nằm trong path, bộ sưu tập con lồng một tầng, không động từ (bài 1.1). /labs/lab_1/devices/list trông gần đúng nhưng thêm một đoạn mang nghĩa động từ vào bộ sưu tập mà GET vốn đã liệt kê.',
          },
          {
            question: 'A student’s app sends POST /bookings, then times out without a response. What should the app developer know before adding an automatic retry?|||App của một sinh viên gửi POST /bookings rồi bị quá thời gian, không nhận được response. Người viết app cần biết gì trước khi thêm việc tự động gửi lại?',
            options: [
              'POST is not idempotent: the first request may have succeeded, so a blind retry can create a second booking|||POST không idempotent: request đầu có thể đã thành công, nên gửi lại mù quáng có thể tạo lượt đặt thứ hai',
              'POST is idempotent, so a retry is always harmless|||POST là idempotent, nên gửi lại luôn vô hại',
              'The server automatically ignores duplicate POST requests|||Server tự động bỏ qua các request POST trùng lặp',
              'The app should retry with GET /bookings instead, which creates the booking safely|||App nên gửi lại bằng GET /bookings, cách đó tạo lượt đặt an toàn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The client cannot tell a lost request from a lost response (lesson 1.2). Only idempotent methods (GET, PUT, DELETE…) are safe to retry blindly; POST needs idempotency keys (Chapter 5). The server does not deduplicate by itself — two identical device POSTs created dev_4 and dev_5.|||VI: Client không phân biệt được request bị mất với response bị mất (bài 1.2). Chỉ phương thức idempotent (GET, PUT, DELETE…) mới được gửi lại mù quáng; POST cần idempotency key (Chương 5). Server không tự lọc trùng — hai POST thiết bị giống hệt đã tạo ra dev_4 và dev_5.',
          },
          {
            question: 'A lab manager sends PUT /devices/dev_1 with only {"status":"AVAILABLE"}. What does LabFlow answer, and why?|||Một quản lý lab gửi PUT /devices/dev_1 chỉ với {"status":"AVAILABLE"}. LabFlow trả lời gì, và vì sao?',
            options: [
              '200 and only the status changes — PUT merges fields|||200 và chỉ status đổi — PUT gộp các trường',
              '204 with no body, because nothing else changed|||204 không có body, vì không còn gì khác thay đổi',
              '405, because PUT is not allowed on devices|||405, vì PUT không được dùng với thiết bị',
              '400 listing the missing fields, because PUT replaces the whole resource and LabFlow refuses half a body|||400 liệt kê các trường còn thiếu, vì PUT thay toàn bộ tài nguyên và LabFlow từ chối nửa cái body',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: PUT means “make the resource exactly this body”. A naive server would wipe name, type and serial; LabFlow’s strict policy returns 400 with details (lesson 1.2). Changing one field is what PATCH is for — “PUT merges fields” describes PATCH, not PUT.|||VI: PUT nghĩa là "làm cho tài nguyên y hệt body này". Server ngây thơ sẽ xoá sạch tên, loại và số serial; chính sách chặt của LabFlow trả 400 kèm details (bài 1.2). Đổi một trường là việc của PATCH — "PUT gộp các trường" là mô tả PATCH, không phải PUT.',
          },
          {
            question: 'DELETE /devices/dev_2 returns 204 the first time and 404 the second time. Is DELETE still idempotent?|||DELETE /devices/dev_2 trả 204 lần đầu và 404 lần thứ hai. DELETE còn idempotent không?',
            options: [
              'No — idempotent methods must return identical responses|||Không — phương thức idempotent phải trả các response giống hệt',
              'Yes — idempotency is about the effect on the server: after one or two calls, dev_2 is gone|||Có — idempotency nói về tác động lên server: sau một hay hai lần gọi, dev_2 đều không còn',
              'Only if the server returns 204 both times|||Chỉ khi server trả 204 cả hai lần',
              'No — DELETE is never idempotent in HTTP|||Không — trong HTTP, DELETE không bao giờ idempotent',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: RFC 9110 defines idempotency by the intended effect on the server, not by the response. Same state after one or many calls (lesson 1.2). Some APIs do return 204 every time for quieter retries, but that is a choice, not a requirement.|||VI: RFC 9110 định nghĩa idempotency theo tác động lên server, không theo response. Một hay nhiều lần gọi đều cho cùng một trạng thái (bài 1.2). Có API chọn trả 204 mọi lần cho việc gửi lại êm hơn, nhưng đó là lựa chọn, không phải yêu cầu.',
          },
          {
            question: 'PATCH /devices/dev_3 with Content-Type application/merge-patch+json and body {"status":"MAINTENANCE","note":null}. What happens to the note field?|||PATCH /devices/dev_3 với Content-Type application/merge-patch+json và body {"status":"MAINTENANCE","note":null}. Trường note bị sao?',
            options: [
              'It is removed from the device|||Nó bị xoá khỏi thiết bị',
              'It is kept as the string "null"|||Nó được giữ thành chuỗi "null"',
              'It is left unchanged because null is ignored|||Nó giữ nguyên vì null bị bỏ qua',
              'The request fails with 400 because null is not allowed|||Request thất bại với 400 vì không cho phép null',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: JSON Merge Patch (RFC 7396): a value sets, null removes, an absent field is kept (lesson 1.2). “Left unchanged” is what happens to fields you do not mention at all — not to fields set to null.|||VI: JSON Merge Patch (RFC 7396): có giá trị thì đặt, null thì xoá, vắng mặt thì giữ (bài 1.2). "Giữ nguyên" là chuyện xảy ra với những trường bạn không nhắc tới — không phải với trường mang null.',
          },
          {
            question: 'A client sends DELETE /labs/lab_1. The URL exists, but labs are read-only in the API. What is the most precise response?|||Một client gửi DELETE /labs/lab_1. URL có tồn tại nhưng phòng lab chỉ được đọc trong API. Response chính xác nhất là gì?',
            options: [
              '404 Not Found|||404 Not Found',
              '403 Forbidden|||403 Forbidden',
              '405 Method Not Allowed with Allow: GET, HEAD|||405 Method Not Allowed kèm Allow: GET, HEAD',
              '400 Bad Request|||400 Bad Request',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The URL exists; only the method is not supported for anyone, so 405 with an Allow header (lesson 1.2). 404 would claim there is nothing at /labs/lab_1 — which is what Express does by default, and why we added onlyAllow. 403 is for a caller who lacks permission for something others may do.|||VI: URL có tồn tại; chỉ là phương thức này không dùng được với bất kỳ ai, nên là 405 kèm header Allow (bài 1.2). 404 sẽ nói ở /labs/lab_1 chẳng có gì — đó là điều Express làm mặc định, và là lý do ta thêm onlyAllow. 403 dành cho người gọi thiếu quyền làm việc mà người khác được làm.',
          },
          {
            question: 'Bình, logged in with a valid token, requests GET /bookings/bk_1, which belongs to An. What does the Chapter 1 LabFlow API return?|||Bình đăng nhập với token hợp lệ, gửi GET /bookings/bk_1 — lượt đặt của An. LabFlow API ở Chương 1 trả về gì?',
            options: [
              '401 Unauthorized|||401 Unauthorized',
              '400 Bad Request|||400 Bad Request',
              '409 Conflict|||409 Conflict',
              '403 Forbidden (and Chapter 6 discusses answering 404 instead, to hide that bk_1 exists)|||403 Forbidden (và Chương 6 bàn việc trả 404 thay thế, để giấu việc bk_1 tồn tại)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Bình is authenticated, so 401 is wrong; he is not allowed to see this object, so 403 (lesson 1.3). The tempting 401 means “we do not know who you are” — logging in again would not help Bình.|||VI: Bình đã được xác thực nên 401 là sai; Bình không được xem đối tượng này nên là 403 (bài 1.3). Phương án 401 hấp dẫn nghĩa là "không biết bạn là ai" — Bình có đăng nhập lại cũng chẳng giúp gì.',
          },
          {
            question: 'POST /bookings with startAt 10:00+07:00 and endAt 08:00+07:00 on the same day. Which status code fits LabFlow’s rules?|||POST /bookings với startAt 10:00+07:00 và endAt 08:00+07:00 cùng ngày. Mã trạng thái nào hợp với luật của LabFlow?',
            options: [
              '409 Conflict|||409 Conflict',
              '422 Unprocessable — the shape is valid but the meaning is not|||422 Unprocessable — hình dạng hợp lệ nhưng ý nghĩa thì không',
              '400 Bad Request — invalid JSON|||400 Bad Request — JSON không hợp lệ',
              '201 Created, and the server swaps the times|||201 Created, và server tự đổi chỗ hai giờ',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Both dates are well-formed ISO 8601 with an offset, so it is not a 400; an end before the start is never valid in any state, so 422 (lesson 1.3). 409 is tempting, but 409 means “valid, but clashes with the current state” — it could succeed later; this request never can.|||VI: Cả hai ngày giờ đều đúng định dạng ISO 8601 có múi giờ, nên không phải 400; kết thúc trước khi bắt đầu thì chẳng bao giờ hợp lệ ở trạng thái nào, nên là 422 (bài 1.3). 409 nghe hấp dẫn, nhưng 409 nghĩa là "hợp lệ nhưng đụng trạng thái hiện tại" — có thể thành công về sau; còn request này thì không bao giờ.',
          },
          {
            question: 'Bình books lab_1 for 9:00–11:00 while An holds 8:00–10:00. After An cancels, the very same request from Bình succeeds. Which code did Bình’s first attempt get?|||Bình đặt lab_1 lúc 9:00–11:00 trong khi An đang giữ 8:00–10:00. Sau khi An huỷ, đúng request đó của Bình lại thành công. Lần đầu Bình nhận mã nào?',
            options: [
              '422 Unprocessable|||422 Unprocessable',
              '403 Forbidden|||403 Forbidden',
              '409 Conflict|||409 Conflict',
              '404 Not Found|||404 Not Found',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The request was valid but clashed with the current state of the lab’s schedule; when the state changed, it succeeded — the signature of 409 (lesson 1.3). 422 would mean the content is meaningless in itself, which it is not.|||VI: Request hợp lệ nhưng đụng trạng thái hiện tại của lịch phòng; khi trạng thái đổi, nó thành công — đúng dấu hiệu của 409 (bài 1.3). 422 nghĩa là bản thân nội dung đã vô lý, mà ở đây thì không.',
          },
          {
            question: 'The front-end sends "startAt": "2026-11-02T08:00:00" (no offset). The API runs in a Docker container set to UTC. What does LabFlow do, and why?|||Front-end gửi "startAt": "2026-11-02T08:00:00" (không có múi giờ). API chạy trong container Docker đặt giờ UTC. LabFlow làm gì, và vì sao?',
            options: [
              'Rejects it with 400: without an offset the server would read 08:00 UTC, i.e. 15:00 in Hanoi|||Từ chối bằng 400: không có múi giờ thì server sẽ đọc thành 08:00 UTC, tức 15:00 ở Hà Nội',
              'Accepts it as 08:00 Hanoi time, because JavaScript always uses the user’s time zone|||Nhận nó là 08:00 giờ Hà Nội, vì JavaScript luôn dùng múi giờ của người dùng',
              'Accepts it as a date-only value and ignores the time|||Nhận nó như một giá trị chỉ có ngày và bỏ qua giờ',
              'Converts it to a Unix timestamp number in the response|||Đổi nó thành con số Unix timestamp trong response',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: We measured it: new Date("2026-11-02T08:00:00") gives 01:00Z on a Hanoi laptop but 08:00Z on a UTC server (lesson 1.4). JavaScript uses the time zone of the machine running the code, not the user’s — so LabFlow requires an offset and answers 400 without one.|||VI: Ta đã đo: new Date("2026-11-02T08:00:00") cho 01:00Z trên laptop ở Hà Nội nhưng 08:00Z trên server UTC (bài 1.4). JavaScript dùng múi giờ của máy đang chạy code, không phải của người dùng — vì vậy LabFlow bắt buộc phải có múi giờ và trả 400 nếu thiếu.',
          },
        ],
      },
    },
  ],
};
