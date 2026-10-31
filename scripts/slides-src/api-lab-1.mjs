/**
 * api-lab-1 — API Design · Chapter 1 lab "Device issue reports" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s01-tai-nguyen.mjs › api-1-5-lab. Output = chạy thật lời giải (Node 22.23.3, Express 5.3.0).
 */
import { lamDeck, sql, http, two, box, steps, cards, c, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 1 — Resources and methods', bai: 'Lab 1' };

export const deck = { key: 'api-lab-1', code: 'API Lab 1', title: 'Lab 1 — Device issue reports', sub: 'Design, build and prove a new resource' };

export const slides = lamDeck(meta, [
  { cover: true, nhan: 'Chapter 1 — Lab', t: 'Lab 1 — Device<br>issue reports', sub: 'Design a new LabFlow resource on paper,<br>build it in Express 5, prove it with curl.' },

  { t: 'The request from the lab managers', to: true, body: `
<ul>
<li>“As a <b>student</b>, I report that a device is broken: a short title and how bad it is (LOW, MEDIUM, HIGH).”</li>
<li>“As anyone, I see the reports of a device, and open one report.”</li>
<li>“As a <b>lab manager</b>, I mark a report as resolved — once.”</li>
<li>“If a report is <b>HIGH</b>, the device must go to <b>MAINTENANCE</b> at once so nobody books it.”</li>
<li>“And please stop people registering two devices with the <b>same serial number</b>.”</li>
</ul>
${box('Time', 'Design 20 min · build 60–90 min · prove 20 min. Start from your Chapter 1 code.', 'lam')}` },

  { giua: true, to: true,  t: 'Part A — design before you code', body: two(`
<p style="margin:0 0 6px;font-size:22px">Fill this table <b>on paper first</b>:</p>
<table class="t" style="font-size:20px">
<tr><th>Need</th><th>Method</th><th>URL</th><th>Success</th></tr>
<tr><td>report a problem</td><td>?</td><td>?</td><td>?</td></tr>
<tr><td>reports of one device</td><td>?</td><td>?</td><td>?</td></tr>
<tr><td>one report</td><td>?</td><td>?</td><td>?</td></tr>
<tr><td>resolve a report</td><td>?</td><td>?</td><td>?</td></tr>
</table>`, `
<p style="margin:0 0 6px;font-size:22px">…then list the <b>errors</b>:</p>
<ul style="font-size:21px">
<li>title missing / severity not in the list → ?</li>
<li>device does not exist → ?</li>
<li>student tries to resolve → ?</li>
<li>resolve twice → ?</li>
<li>DELETE on a report → ?</li>
<li>second device with an existing serial → ?</li>
</ul>
${box('Hint', 'Lessons 1.1 (nesting, actions), 1.2 (methods), 1.3 (the 4xx order), 1.4 (names).', 'xanh')}`) },

  { giua: true, t: 'Part B — build: rules your code must follow', to: true, body: `
<ol>
<li>Follow the <b>LabFlow naming guide</b> (1.4): camelCase fields, ids like <code class="i">iss_1</code>, UTC times</li>
<li>A new report starts as <code class="i">"status": "OPEN"</code> and records <code class="i">reportedBy</code> and <code class="i">createdAt</code></li>
<li><code class="i">severity: "HIGH"</code> sets the device’s <code class="i">status</code> to <code class="i">"MAINTENANCE"</code></li>
<li>Every URL answers a wrong method with <b>405 + Allow</b></li>
<li>Every error uses the <b>same JSON shape</b>: <code class="i">error</code>, <code class="i">message</code>, optional <code class="i">details</code></li>
<li>Router order: mount <code class="i">/devices/:id/issues</code> <b>before</b> <code class="i">/devices</code>; use <code class="i">Router({ mergeParams: true })</code></li>
</ol>` },

  { giua: true, to: true,  t: 'Part C — prove it (1/2): the happy path', body: two(http(`$ curl -i -X POST http://localhost:4000/devices/dev_1/issues \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"title":"Cổng console không lên đèn","severity":"HIGH"}'
HTTP/1.1 201 Created
Location: /issues/iss_1
…

{
  "id": "iss_1",
  "deviceId": "dev_1",
  "reportedBy": "usr_1",
  "title": "Cổng console không lên đèn",
  "severity": "HIGH",
  "status": "OPEN",
  "createdAt": "2026-10-31T15:45:00.120Z"
}`, { sm: true, wrap: true }), http(`$ curl http://localhost:4000/devices/dev_1
{
  "id": "dev_1",
  "labId": "lab_1",
  "name": "Cisco Router 2901",
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "MAINTENANCE"
}
$ curl -X POST http://localhost:4000/issues/iss_1/resolve \\
    -H 'Authorization: Bearer tok_lan'
{
  "id": "iss_1",
  …
  "status": "RESOLVED",
  "createdAt": "2026-10-31T15:45:00.120Z",
  "resolvedAt": "2026-10-31T15:45:00.191Z"
}`, { sm: true })) },

  { t: 'Part C — prove it (2/2): every error', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th>Request (all with the right token unless noted)</th><th style="width:270px">Status line</th><th style="width:250px"><code class="i">error</code></th></tr>
<tr><td><code class="i">POST /devices/dev_1/issues</code> <code class="i">{"severity":"URGENT"}</code></td><td>400 Bad Request</td><td>VALIDATION_FAILED</td></tr>
<tr><td><code class="i">POST /devices/dev_9/issues</code></td><td>404 Not Found</td><td>DEVICE_NOT_FOUND</td></tr>
<tr><td><code class="i">POST /issues/iss_1/resolve</code> as student <code class="i">tok_an</code></td><td>403 Forbidden</td><td>FORBIDDEN</td></tr>
<tr><td><code class="i">POST /issues/iss_1/resolve</code> a second time</td><td>409 Conflict</td><td>ALREADY_RESOLVED</td></tr>
<tr><td><code class="i">DELETE /issues/iss_1</code></td><td>405 Method Not Allowed</td><td>METHOD_NOT_ALLOWED + <code class="i">Allow: GET, HEAD</code></td></tr>
<tr><td><code class="i">POST /devices</code> with serial <code class="i">FTX1840ALBQ</code> again</td><td>409 Conflict</td><td>DUPLICATE_SERIAL</td></tr>
</table>
${box('Prove it like a reviewer would', 'Run the six commands in this order on a <b>freshly restarted</b> server, paste each full response into <code class="i">TRANSCRIPT.md</code>, and check the status line <b>before</b> the body.', 'xanh')}
<p class="nho" style="margin:4px 0 0">Table = summary of the real run; the written lesson has every full response.</p>` },

  { t: 'Rubric — 10 points', body: `
<table class="t" style="font-size:20px">
<tr><th style="width:70px">Pts</th><th>Criterion</th><th style="width:330px">Checked by</th></tr>
<tr><td><b>2</b></td><td>Design table: URLs are nouns, nested once, resolve is an explicit action</td><td>reading Part A</td></tr>
<tr><td><b>2</b></td><td>Correct methods + success codes (201 + Location, 200)</td><td>curl -i on the happy path</td></tr>
<tr><td><b>2</b></td><td>Correct error codes: 400, 404, 403, 409 ×2, 405 + Allow</td><td>the six error commands</td></tr>
<tr><td><b>1</b></td><td>HIGH severity moves the device to MAINTENANCE</td><td>GET the device after reporting</td></tr>
<tr><td><b>1</b></td><td>One error shape everywhere, all JSON (no HTML 404s)</td><td>any error + an unknown URL</td></tr>
<tr><td><b>1</b></td><td>Naming guide followed (camelCase, <code class="i">iss_</code> ids, UTC <code class="i">Z</code> times)</td><td>reading the responses</td></tr>
<tr><td><b>1</b></td><td><code class="i">TRANSCRIPT.md</code>: every command + its real output, pasted unedited</td><td>the file in your repo</td></tr>
</table>
${box('Pass', '7/10. Below 7: fix and resubmit — the next chapters build on this code.', 'lam')}` },

  { t: 'Hand-in checklist and stretch goals', to: true, giua: true, body: two(`
<p style="margin:0 0 6px;font-weight:800;font-size:22px">Hand in</p>
<ul>
<li>☐ <code class="i">DESIGN.md</code> — the Part A tables, with one sentence <b>why</b> per choice</li>
<li>☐ <code class="i">src/routes/issues.js</code> + changes to <code class="i">app.js</code>, <code class="i">db.js</code>, <code class="i">devices.js</code></li>
<li>☐ <code class="i">TRANSCRIPT.md</code> — real curl output, server restarted before you start</li>
<li>☐ a commit message that says what the API gained</li>
</ul>`, `
<p style="margin:0 0 6px;font-weight:800;font-size:22px">Stretch (no points, real skills)</p>
<ul>
<li>Resolving the <b>last open HIGH</b> report sets the device back to <code class="i">AVAILABLE</code></li>
<li><code class="i">GET /issues?status=OPEN</code> with unknown-parameter checking</li>
<li>A <b>Bruno</b> collection for the whole lab in <code class="i">api-requests/</code></li>
<li>Explain in 3 sentences why “resolve” is not a <code class="i">PATCH</code></li>
</ul>`) },
]);
