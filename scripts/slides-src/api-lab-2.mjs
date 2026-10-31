/**
 * api-lab-2 — API Design · Chapter 2 lab "Issue reports, version 2" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s02-loi-phan-hoi.mjs › api-2-5-lab. Output = chạy thật lời giải (Node 22.23.3, Express 5.3.0, Zod 4.6.7).
 */
import { lamDeck, sql, http, two, box } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 2 — Errors, validation and responses', bai: 'Lab 2' };

export const deck = { key: 'api-lab-2', code: 'API Lab 2', title: 'Lab 2 — Issue reports, version 2', sub: 'Schemas, problems in two languages, stable views' };

export const slides = lamDeck(meta, [
  { cover: true, nhan: 'Chapter 2 — Lab', t: 'Lab 2 — Issue<br>reports, version 2', sub: 'Bring Lab 1 up to Chapter 2’s standard —<br>and add one rule that needs all of it.' },

  { t: 'The request', to: true, body: `
<ul>
<li>“A report has a <b>title</b> (3–120 chars), a <b>severity</b> (LOW · MEDIUM · HIGH), maybe a <b>description</b> (≤ 1000). Anything else in the body is a mistake.”</li>
<li>“A manager may write a short <b>resolution</b> (≤ 500) when resolving.”</li>
<li>“One list of <b>all</b> reports, filterable by <b>status</b> and <b>severity</b>.”</li>
<li>“No two <b>open</b> reports with the same title on a device — and ‘Cổng console không lên đèn’ = ‘cong CONSOLE khong len den’.”</li>
<li>“The exchange students read <b>English</b>.”</li>
</ul>
${box('Time', 'Design 15 min · build 60–90 min · prove 20 min. Start from your code at the end of lesson 2.4.', 'lam')}` },

  { t: 'Part A — design before you code', to: true, giua: true, body: two(`
<table class="t" style="font-size:20px">
<tr><th>Input / situation</th><th>Layer</th><th>Status + code</th></tr>
<tr><td>title of 1 character</td><td>?</td><td>?</td></tr>
<tr><td>severity <code class="i">URGENT</code></td><td>?</td><td>?</td></tr>
<tr><td>extra member <code class="i">reporter</code></td><td>?</td><td>?</td></tr>
<tr><td><code class="i">dev_9</code> + empty body</td><td>?</td><td>?</td></tr>
<tr><td>same open title (any accents/case)</td><td>?</td><td>?</td></tr>
<tr><td><code class="i">text/plain</code> body</td><td>?</td><td>?</td></tr>
<tr><td><code class="i">?status=open</code></td><td>?</td><td>?</td></tr>
</table>`, `
<p style="margin:0 0 8px">Write one sentence of <b>why</b> for each:</p>
<ol>
<li>Device missing <b>and</b> body bad — which error wins? Same as Lab 1?</li>
<li>Which <b>extension member</b> lets the app open the existing report on a duplicate?</li>
</ol>
${box('Layers', '<b>door</b> 415/413 · <b>shape</b> 400 · <b>rule</b> 404/409/422', 'xanh')}`, 'r64') },

  { t: 'Part B — build it: six rules', to: true, giua: true, body: `
<ol>
<li><code class="i">IssueCreate</code>, <code class="i">IssueResolve</code>, <code class="i">IssuesQuery</code>: <b>strict</b> Zod schemas; every text through <code class="i">text()</code> (trim + NFC)</li>
<li>Keep Lab 1’s order <b>401 → 404 → 400</b>: load the device <b>before</b> <code class="i">validate</code></li>
<li>Duplicate rule compares <b>folded</b> titles; move <code class="i">fold</code> to <code class="i">src/text.js</code>; answer <b>409 DUPLICATE_ISSUE</b> + <code class="i">existing</code></li>
<li>Every issue leaves through <code class="i">toIssue</code>: <code class="i">description</code>, <code class="i">resolvedAt</code>, <code class="i">resolution</code> always present</li>
<li>The new code has <code class="i">title</code> + <code class="i">detail</code> in <b>vi</b> and <b>en</b></li>
<li>No more <code class="i">{ field, issue }</code> anywhere ⇒ remove the bridge in <code class="i">app.js</code></li>
</ol>` },

  { t: 'Reference solution: the heart of issues.js', body: sql(`function loadDevice(req, res, next) {                 // parent first ⇒ 401 → 404 → 400
  req.device = devices.find((x) => x.id === req.params.id);
  if (!req.device) throw new HttpError(404, 'DEVICE_NOT_FOUND', { id: req.params.id });
  next();
}

deviceIssuesRouter.route('/')
  .post(requireAuth, loadDevice, validate('body', IssueCreate), (req, res) => {
    const { title, severity, description } = req.valid.body;
    const same = issues.find((i) => i.deviceId === req.device.id && i.status === 'OPEN'
      && fold(i.title) === fold(title));                    // compare like a reader
    if (same) throw new HttpError(409, 'DUPLICATE_ISSUE', { existing: same.id }, { existing: same.id });
    const issue = { id: nextId('iss'), deviceId: req.device.id, reportedBy: req.user.id, title,
      severity, description, status: 'OPEN', createdAt: new Date().toISOString() };
    issues.push(issue);
    if (severity === 'HIGH') req.device.status = 'MAINTENANCE';
    res.status(201).location(\`/issues/\${issue.id}\`).json(toIssue(issue));
  })`, { lang: 'javascript', sm: true, hl: [1, 8, 11, 12] }) + `<p style="margin:8px 0 0;font-size:21px">Full file, schemas, view and messages: in the lesson text. Schemas: <code class="i">title: text(3, 120)</code>, <code class="i">severity: z.enum(SEVERITIES)</code>, <code class="i">description: text(1, 1000).optional()</code>.</p>` },

  { t: 'Part C — prove it (real transcript, 1/2)', body: two(http(`$ curl -s -X POST http://localhost:4000/devices/dev_1/issues \\
    -H 'Authorization: Bearer tok_an' -H 'Accept-Language: en' \\
    --json '{"title":"x","severity":"URGENT","reporter":"usr_2"}'
{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Invalid request body",
  "status": 400,
  "detail": "3 problem(s) in the body",
  …
  "errors": [
    { "pointer": "#/title",
      "detail": "Too small: expected string to have >=3 characters" },
    { "pointer": "#/severity",
      "detail": "Invalid option: expected one of \\"LOW\\"|\\"MEDIUM\\"|\\"HIGH\\"" },
    { "pointer": "#/reporter", "detail": "unknown field" }
  ]
}`, { sm: true, wrap: true, title: 'step 3 (output re-indented)' }), http(`$ curl -s -X POST http://localhost:4000/devices/dev_9/issues \\
    -H 'Authorization: Bearer tok_an' --json '{}'
{
  "type": "https://labflow.example/problems/device-not-found",
  …
  "detail": "Không có thiết bị dev_9",
  …
}
$ curl -s -X POST http://localhost:4000/devices/dev_1/issues \\
    -H 'Authorization: Bearer tok_bin' \\
    --json '{"title":"cong CONSOLE khong len den","severity":"LOW"}'
{
  "type": "https://labflow.example/problems/duplicate-issue",
  "status": 409,
  "detail": "Thiết bị đã có báo hỏng đang mở iss_1 cùng tiêu đề",
  …
  "existing": "iss_1"
}`, { sm: true, wrap: true, title: 'steps 4 and 5' })) },

  { t: 'Part C — prove it (real transcript, 2/2)', body: two(http(`$ curl -s 'http://localhost:4000/issues?status=OPEN&severity=HIGH'
{
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
}`, { sm: true, title: 'step 7 — ten members, null when empty' }), http(`$ curl -s -X POST http://localhost:4000/issues/iss_1/resolve \\
    -H 'Authorization: Bearer tok_lan' \\
    --json '{"resolution":"Thay cáp console mới"}'
{
  …
  "status": "RESOLVED",
  "resolvedAt": "2026-10-31T17:46:03.473Z",
  "resolution": "Thay cáp console mới"
}
$ curl -i -X POST http://localhost:4000/issues/iss_1/resolve \\
    -H 'Authorization: Bearer tok_lan' -H 'Accept-Language: en'
HTTP/1.1 409 Conflict
Content-Language: en
Vary: Accept-Language
…
  "title": "Issue already resolved",
  "detail": "Issue iss_1 is already resolved",
  "code": "ALREADY_RESOLVED"`, { sm: true, wrap: true, title: 'step 8' })) },

  { t: 'Rubric — 10 points, pass at 7', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:90px">Pts</th><th>Criterion</th><th style="width:300px">Checked by</th></tr>
<tr><td><b>2</b></td><td>Strict schemas (create, resolve, query); one pointer/parameter per problem</td><td>steps 3, 7 · schemas.js</td></tr>
<tr><td><b>1</b></td><td>Order 401 → 404 → 400 kept</td><td>step 4</td></tr>
<tr><td><b>2</b></td><td>Duplicate rule ignores accents, case, NFC/NFD; 409 carries the id</td><td>step 5 + your NFD test</td></tr>
<tr><td><b>1</b></td><td>Every error is problem+json with stable <code class="i">type</code>/<code class="i">code</code></td><td>any error</td></tr>
<tr><td><b>1</b></td><td>Two languages: <code class="i">Content-Language</code>, <code class="i">Vary</code>, only text translated</td><td>steps 3, 8</td></tr>
<tr><td><b>2</b></td><td>Same ten members in every state, <code class="i">null</code> when empty</td><td>steps 1, 7, 8</td></tr>
<tr><td><b>1</b></td><td><code class="i">TRANSCRIPT.md</code>: every command, real unedited output</td><td>the file</td></tr>
</table>
${box('Hand in', '<code class="i">DESIGN.md</code> · changed <code class="i">src/</code> files · <code class="i">TRANSCRIPT.md</code> — one commit whose message says what the API gained.', 'xanh')}` },
]);
