/**
 * api-00-5 — API Design · Section 0 · Lesson 0.3 "Set up: the LabFlow API skeleton" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s00-intro.mjs › api-0-3-du-an-labflow (bài MỚI). Output = chạy thật Node 22.23.3 + Express 5.3.0, macOS.
 */
import { lamDeck, sql, http, two, box, steps, cards, c, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Section 0 — Why API design matters', bai: '0.3' };

/* Ba tệp và ai dùng ai. */
const baTep = () => `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">
  <defs><marker id="m5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  ${[[20, 'server.js', 'starts listening on', 'port 4000', '#336791'], [400, 'app.js', 'routes + 404 + errors', '“what the API does”', '#e08a1e'], [780, 'db.js', 'the data (in RAM', 'for now)', '#2f7d4f']]
    .map(([x, t, a, b, m]) => `<rect x="${x}" y="40" width="310" height="150" rx="14" fill="${m}14" stroke="${m}" stroke-width="3"/>` +
      `<text x="${x + 155}" y="92" text-anchor="middle" font-size="30" font-weight="800" fill="${m}" font-family="Menlo,monospace">${t}</text>` +
      `<text x="${x + 155}" y="132" text-anchor="middle" font-size="21" fill="#404040">${a}</text><text x="${x + 155}" y="160" text-anchor="middle" font-size="21" fill="#404040">${b}</text>`).join('')}
  <line x1="334" y1="115" x2="392" y2="115" stroke="#b85a2b" stroke-width="4" marker-end="url(#m5)"/>
  <line x1="714" y1="115" x2="772" y2="115" stroke="#b85a2b" stroke-width="4" marker-end="url(#m5)"/>
  <text x="363" y="100" text-anchor="middle" font-size="17" fill="#b85a2b" font-weight="700">imports</text>
  <text x="743" y="100" text-anchor="middle" font-size="17" fill="#b85a2b" font-weight="700">imports</text>
  <text x="555" y="222" text-anchor="middle" font-size="19" fill="#555">Tests (later) import app.js directly — no port, no running server needed.</text>
</svg>`;

export const deck = { key: 'api-00-5', code: 'API 0.3', title: 'Set up: the LabFlow API skeleton', sub: 'Node 22 + Express 5, three files' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Set up: your LabFlow<br>API skeleton', sub: 'Node 22 + Express 5, three small files,<br>three endpoints — running in 15 minutes.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Node.js 22 installed and checked</li>
<li>A project <code class="i">labflow-api</code> with <b>Express 5</b></li>
<li>Three endpoints: <code class="i">GET /health</code> · <code class="i">GET /labs</code> · <code class="i">GET /labs/:labId</code></li>
<li>An API that answers <b>JSON even when things go wrong</b> (unknown route, crash)</li>
<li>Auto-restart while you edit: <code class="i">npm run dev</code></li>
</ul>
${box('No database yet', 'Data lives in a JavaScript array. Design comes first; PostgreSQL arrives in the capstone. Every chapter until then adds to <b>this</b> project.', 'lam')}` },

  { t: 'Step 1: check Node.js 22', to: true, giua: true, body: two(http(`$ node -v
v22.23.3
$ npm -v
10.9.9`), `
<table class="t" style="font-size:21px">
<tr><th>Your machine</th><th>Install with</th></tr>
<tr><td>macOS / Linux</td><td><b>nvm</b>: <code class="i">nvm install 22</code></td></tr>
<tr><td>Windows</td><td>installer from <b>nodejs.org</b> (LTS) or <b>nvm-windows</b></td></tr>
</table>
${box('Any 22.x or newer', 'is fine. The course was run on <b>v22.23.3</b>. Seeing <code class="i">v18</code> or <code class="i">v20</code>? Upgrade first — <code class="i">node --watch</code> and some messages differ.', 'lam')}`, 'r37') },

  { giua: true, to: true,  t: 'Step 2: create the project and install Express 5', body: two(http(`$ mkdir labflow-api && cd labflow-api
$ npm init -y
Wrote to …/labflow-api/package.json:
…
$ npm install express@5

added 65 packages, and audited 66 packages in 798ms

30 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities
$ npm ls express
labflow-api@1.0.0 …/labflow-api
└── express@5.3.0`, { sm: true }), `
<ul style="font-size:21px">
<li><code class="i">npm init -y</code> creates <code class="i">package.json</code> with defaults</li>
<li><code class="i">express@5</code> = “latest 5.x” — 65 packages land in <code class="i">node_modules/</code></li>
<li><code class="i">npm ls</code> proves which version you really got</li>
</ul>
${box('Why say @5?', 'Old tutorials install Express <b>4</b>. Version 5 (2024) changes error handling and route syntax — this course uses 5.', 'lam')}`, 'r64') },

  { t: 'Step 3: package.json — four lines that matter', body: two(sql(`{
  "name": "labflow-api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "engines": { "node": ">=22" },
  "dependencies": {
    "express": "^5.3.0"
  }
}`, { lang: 'json', hl: [5, 7, 8, 10] }), `
<table class="t" style="font-size:20px">
<tr><th style="width:150px">Line</th><th>Why</th></tr>
<tr><td><code class="i">"type": "module"</code></td><td>use <code class="i">import</code> / <code class="i">export</code></td></tr>
<tr><td><code class="i">dev</code></td><td>restart on every save</td></tr>
<tr><td><code class="i">start</code></td><td>run once (production)</td></tr>
<tr><td><code class="i">engines</code></td><td>documents “needs Node 22+”</td></tr>
<tr><td><code class="i">private</code></td><td>never publish to npm by accident</td></tr>
</table>`, 'r46') },

  { t: 'Three files, three jobs', body: `${baTep()}
${sql(`labflow-api/
├── package.json
└── src/
    ├── server.js   ← start the program
    ├── app.js      ← the API itself
    └── db.js       ← the data`, { lang: 'plaintext' })}` },

  { t: 'db.js: three labs in memory', body: sql(`// db.js — "cơ sở dữ liệu" tạm trong RAM. Tắt server là mất; Chương 12 thay bằng PostgreSQL.
export const labs = [
  { id: 'lab_1', code: 'AL-201', name: 'Phòng Lab Mạng máy tính', building: 'Alpha', capacity: 30 },
  { id: 'lab_2', code: 'AL-305', name: 'Phòng Lab IoT', building: 'Alpha', capacity: 24 },
  { id: 'lab_3', code: 'BE-102', name: 'Phòng Lab Phần mềm', building: 'Beta', capacity: 40 },
];`, { lang: 'javascript', sm: true }).replace('<pre class="vs sm">', '<pre class="vs sm" style="font-size:13.5px">') + two(box('id vs code', '<code class="i">id</code> is for <b>machines</b> (never changes, used in URLs). <code class="i">code</code> is what <b>people</b> read on the door. Lesson 1.4 explains why ids look like <code class="i">lab_1</code>.', 'lam'),
  box('Vietnamese text in JSON', 'is fine: JSON is UTF-8, and Express adds <code class="i">charset=utf-8</code> to <code class="i">Content-Type</code> for you.', 'xanh')) +
  `<table class="t" style="font-size:20px;margin-top:4px"><tr><th>Field</th><th>Example</th><th>Meaning</th></tr><tr><td><code class="i">building</code></td><td>Alpha</td><td>which building — later used as a filter: <code class="i">/labs?building=Alpha</code></td></tr><tr><td><code class="i">capacity</code></td><td>30</td><td>how many students fit — a number, not a string</td></tr></table>` },

  { giua: true, to: true, t: 'app.js (1/2): the routes', body: two(sql(`import express from 'express';
import { labs } from './db.js';

export const app = express();
app.disable('x-powered-by');
app.set('json spaces', 2);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/labs', (req, res) => {
  res.json({ data: labs });
});`, { lang: 'javascript', sm: true }), `
<table class="t" style="font-size:19px">
<tr><th style="width:190px">Line</th><th>Meaning</th></tr>
<tr><td><code class="i">disable('x-powered-by')</code></td><td>do not advertise “Express”</td></tr>
<tr><td><code class="i">json spaces</code></td><td>indent JSON — easier to read while learning</td></tr>
<tr><td><code class="i">express.json()</code></td><td>parse JSON request bodies into <code class="i">req.body</code></td></tr>
<tr><td><code class="i">res.json(x)</code></td><td>send x as JSON, status 200</td></tr>
<tr><td><code class="i">{ data: labs }</code></td><td>wrap lists in an object — room to add paging later (Ch 3)</td></tr>
</table>`, 'r46') },

  { t: 'app.js (2/2): one lab, and JSON when things go wrong', body: sql(`app.get('/labs/:labId', (req, res) => {
  const lab = labs.find((l) => l.id === req.params.labId);
  if (!lab) {
    return res.status(404).json({ error: 'LAB_NOT_FOUND', message: \`Không có phòng lab \${req.params.labId}\` });
  }
  res.json(lab);
});

// Không route nào khớp ⇒ vẫn trả JSON, không trả trang HTML
app.use((req, res) => {
  res.status(404).json({ error: 'ROUTE_NOT_FOUND', message: \`Không có \${req.method} \${req.path}\` });
});

// Lỗi chưa lường trước ⇒ 500, không lộ stack trace cho client
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: 'Máy chủ gặp lỗi, thử lại sau' });
});`, { lang: 'javascript', sm: true, hl: [1, 10, 15] }) + `<p style="margin:6px 0 0;font-size:20px"><code class="i">:labId</code> is a <b>route parameter</b> → <code class="i">req.params.labId</code>. Order matters: the two <code class="i">app.use</code> catch-alls go <b>last</b>; an error handler has <b>four</b> arguments.</p>` },

  { giua: true, to: true,  t: 'Step 4: start it — and let it restart itself', body: two(sql(`import { app } from './app.js';

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () =>
  console.log(\`LabFlow API chạy ở http://localhost:\${PORT}\`));`, { lang: 'javascript' }) +
  box('PORT from the environment', '<code class="i">PORT=5000 npm run dev</code> moves it without editing code. Servers in the cloud tell your app the port this way.', 'lam'),
  http(`$ npm run dev

> labflow-api@0.1.0 dev
> node --watch src/server.js

LabFlow API chạy ở http://localhost:4000
Restarting 'src/server.js'
LabFlow API chạy ở http://localhost:4000`, { title: 'terminal 1 — leave it running' }) +
  `<p style="margin:8px 0 0;font-size:20px">The <b>Restarting</b> line appeared when we saved <code class="i">app.js</code>. Keep this terminal open; send requests from a <b>second</b> one.</p>`, 'r46') },

  { giua: true, to: true, t: 'First call: GET /health', body: two(http(`$ curl -i http://localhost:4000/health
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 20
ETag: W/"14-FnPp73GyekB2vjRBo6C/2fUpoY8"
Date: Sat, 31 Oct 2026 16:04:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "status": "ok"
}`), `
<table class="t" style="font-size:20px">
<tr><th style="width:170px">Header</th><th>Who set it</th></tr>
<tr><td>Content-Type</td><td><code class="i">res.json()</code></td></tr>
<tr><td>Content-Length</td><td>Express counted the bytes</td></tr>
<tr><td>ETag</td><td>Express: a fingerprint of the body (Ch 9 uses it)</td></tr>
<tr><td>Date · Keep-Alive</td><td>Node’s http server</td></tr>
</table>
${box('Why /health?', 'Load balancers, Docker and uptime monitors call it to ask “are you alive?”. Every real API has one.', 'xanh')}`, 'r46') },

  { giua: true, to: true,  t: 'GET /labs/:labId — found and not found', body: two(http(`$ curl -i http://localhost:4000/labs/lab_2
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 108
…

{
  "id": "lab_2",
  "code": "AL-305",
  "name": "Phòng Lab IoT",
  "building": "Alpha",
  "capacity": 24
}`, { sm: true }), http(`$ curl -i http://localhost:4000/labs/lab_9
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
…

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}`, { sm: true }) + box('Two fields, two readers', '<code class="i">error</code> is for the <b>program</b> (stable, compare in code). <code class="i">message</code> is for <b>people</b>. Chapter 2 turns this into the RFC 9457 standard.', 'lam')) },

  { t: 'Without the catch-all, Express answers in HTML', body: vsd(http(`$ curl -i http://localhost:4000/rooms
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Security-Policy: default-src 'none'
Content-Type: text/html; charset=utf-8
…

<!DOCTYPE html>
<html lang="en">
…
<pre>Cannot GET /rooms</pre>
…`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px">A mobile app trying <code class="i">JSON.parse()</code> on this <b>crashes</b>.</p>`,
  http(`$ curl -i http://localhost:4000/rooms
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
…

{
  "error": "ROUTE_NOT_FOUND",
  "message": "Không có GET /rooms"
}`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px">Same status, but every client can read it the same way as all other errors.</p>`, '✗ Express default (first version)', '✓ After adding the JSON 404') },

  { giua: true, to: true,  t: 'Express 5 vs 4: what changes for us', body: `
<table class="t lon">
<tr><th style="width:290px">Topic</th><th>Express 4</th><th>Express 5 (this course)</th></tr>
<tr><td>Error thrown in an <b>async</b> handler</td><td>not caught → request hangs, or Node stops on the unhandled rejection</td><td><b>caught</b> and sent to your error handler</td></tr>
<tr><td>Wildcard route</td><td><code class="i">'*'</code></td><td>must be named: <code class="i">'/*splat'</code></td></tr>
<tr><td>Optional part</td><td><code class="i">'/:id?'</code></td><td><code class="i">'/{:id}'</code></td></tr>
<tr><td>Released</td><td>2014</td><td>5.0 in Sep 2024 · default on npm since 5.1 (Mar 2025)</td></tr>
</table>
${box('Copying from an old tutorial?', 'If a route with <code class="i">*</code> or <code class="i">?</code> throws at startup, it was written for Express 4.', 'do2')}` },

  { t: 'Two first-day errors you will meet', giua: true, body: `
<p style="margin:0 0 4px;font-weight:800;color:#b0281a;font-size:22px">1 · Server not running (or wrong port) — no HTTP status at all, nothing answered</p>
${http(`$ curl -i http://localhost:4000/health
curl: (7) Failed to connect to localhost port 4000 after 1 ms: Couldn't connect to server`, { wrap: true })}
<p style="margin:12px 0 4px;font-weight:800;color:#b0281a;font-size:22px">2 · Forgot <code class="i">"type": "module"</code> — Node 22 guesses and warns</p>
${http(`$ node src/server.js
(node:92783) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///…/src/server.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /…/package.json.`, { wrap: true })}
<p style="margin:8px 0 0;font-size:20px">Older Node versions refuse outright: <code class="i">SyntaxError: Cannot use import statement outside a module</code>. Fix: add the line to <code class="i">package.json</code>.</p>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><code class="i">npm init -y</code> → <code class="i">npm install express@5</code> → <code class="i">"type": "module"</code></li>
<li><b>server.js</b> starts · <b>app.js</b> is the API · <b>db.js</b> holds the data</li>
<li><code class="i">npm run dev</code> restarts on save; send requests from a second terminal</li>
<li>Always answer <b>JSON</b> — add a 404 catch-all and a 4-argument error handler</li>
<li>Errors carry <code class="i">error</code> (for code) and <code class="i">message</code> (for people)</li>
</ul>
${box('Next', 'Quiz for Section 0 — then Chapter 1 turns these three endpoints into a real resource design.', 'xanh')}` },
]);
