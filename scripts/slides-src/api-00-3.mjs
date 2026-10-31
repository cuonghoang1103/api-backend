/**
 * api-00-3 — API Design · Section 0 · Lesson 0.1 "HTTP you actually need" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s00-intro.mjs › api-0-1-http. Output = chạy thật (Node 22.23.3, curl 8.7.1, macOS),
 * máy chủ "tấm gương" echo.mjs ở cổng 4001 và LabFlow ở cổng 4000.
 */
import { lamDeck, sql, http, two, box, steps, cards, kw, c, vsd, req, sh } from './_api-chung.mjs';

const meta = { chuong: 'Section 0 — Why API design matters', bai: '0.1' };

/* Lá thư: phong bì (header) + địa chỉ (URL) + nội dung (body) + thư trả lời có dấu (status). */
const thu = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <defs><marker id="m3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  <g data-k="di"><rect x="20" y="30" width="460" height="240" rx="12" fill="#fffaf0" stroke="#b85a2b" stroke-width="3"/>
  <text x="250" y="66" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">✉️ Letter you send = REQUEST</text>
  <text x="44" y="110" font-size="21" fill="#333"><tspan font-weight="800">To:</tspan> Lab office, Alpha building</text>
  <text x="44" y="140" font-size="18" fill="#336791">→ method + URL: POST /bookings</text>
  <text x="44" y="180" font-size="21" fill="#333"><tspan font-weight="800">On the envelope:</tspan> sender, language</text>
  <text x="44" y="210" font-size="18" fill="#336791">→ headers: Authorization, Content-Type</text>
  <text x="44" y="246" font-size="21" fill="#333"><tspan font-weight="800">Inside:</tspan> “Lab AL-201, Mon 8–10h”</text></g>
  <g data-k="ve"><rect x="630" y="30" width="460" height="240" rx="12" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="3"/>
  <text x="860" y="66" text-anchor="middle" font-size="24" font-weight="800" fill="#2f7d4f">📬 Reply = RESPONSE</text>
  <text x="654" y="112" font-size="21" fill="#333"><tspan font-weight="800">Stamp:</tspan> APPROVED / REJECTED</text>
  <text x="654" y="142" font-size="18" fill="#336791">→ status code: 201 Created, 409 Conflict</text>
  <text x="654" y="182" font-size="21" fill="#333"><tspan font-weight="800">Envelope:</tspan> date, format</text>
  <text x="654" y="212" font-size="18" fill="#336791">→ headers: Date, Content-Type</text>
  <text x="654" y="248" font-size="21" fill="#333"><tspan font-weight="800">Inside:</tspan> your booking slip</text></g>
  <line x1="488" y1="120" x2="622" y2="120" stroke="#b85a2b" stroke-width="4" marker-end="url(#m3)"/>
  <line x1="622" y1="190" x2="488" y2="190" stroke="#2f7d4f" stroke-width="4" marker-end="url(#m3)"/>
  <text x="555" y="108" text-anchor="middle" font-size="17" fill="#b85a2b" font-weight="700">sent</text>
  <text x="555" y="215" text-anchor="middle" font-size="17" fill="#2f7d4f" font-weight="700">answered</text>
</svg>`;

/* Giải phẫu URL — HTML (không SVG) để gạch chân khớp chữ thật. */
const url = () => {
  const parts = [['http', 'scheme', 'which protocol', '#336791', 0], ['://', '', '', '#999', 0], ['localhost', 'host', 'which machine', '#e08a1e', 1], [':4001', 'port', 'which program on it', '#b85a2b', 0],
    ['/labs', 'path', 'which resource', '#2f7d4f', 1], ['?building=Alpha', 'query', 'options / filters', '#7a3d12', 0]];
  return `<div style="display:flex;justify-content:center;font-family:Menlo,monospace;font-size:44px;font-weight:700;margin:20px 0 170px">` +
    parts.map(([t, n, d, m, row]) => `<span style="position:relative;color:${m};${n ? `border-bottom:5px solid ${m};` : ''}padding-bottom:4px">${t}` +
      (n ? `<span style="position:absolute;left:50%;transform:translateX(-50%);top:${row ? 140 : 68}px;white-space:nowrap;font-family:Arial;font-size:22px;text-align:center;line-height:1.3">` +
        `<b style="font-size:24px;color:${m}">${n}</b><br><span style="font-size:19px;font-weight:400;color:#555">${d}</span></span>` +
        `<span style="position:absolute;left:50%;top:60px;height:${row ? 80 : 8}px;border-left:2px dashed ${m}"></span>` : '') + `</span>`).join('') + `</div>`;
};

/* Vòng đời request ↔ response. */
const vong = () => `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">
  <defs><marker id="m4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#404040"/></marker></defs>
  <rect x="10" y="40" width="220" height="170" rx="14" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="120" y="110" text-anchor="middle" font-size="44">💻</text><text x="120" y="160" text-anchor="middle" font-size="24" font-weight="800" fill="#336791">client</text><text x="120" y="188" text-anchor="middle" font-size="17" fill="#555">curl · browser · app</text>
  <rect x="880" y="40" width="220" height="170" rx="14" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="3"/>
  <text x="990" y="110" text-anchor="middle" font-size="44">🖥️</text><text x="990" y="160" text-anchor="middle" font-size="24" font-weight="800" fill="#2f7d4f">server</text><text x="990" y="188" text-anchor="middle" font-size="17" fill="#555">Express · echo.mjs</text>
  <rect x="270" y="28" width="570" height="88" rx="10" fill="#fff7ef" stroke="#e08a1e" stroke-width="2.5"/>
  <text x="290" y="58" font-size="20" font-weight="800" fill="#b85a2b">① REQUEST</text>
  <text x="290" y="86" font-size="18" font-family="Menlo,monospace" fill="#333">method + path + version · headers · body?</text>
  <line x1="236" y1="72" x2="872" y2="72" stroke="#404040" stroke-width="0" />
  <path d="M840,72 L874,72" stroke="#404040" stroke-width="3.5" marker-end="url(#m4)"/>
  <rect x="270" y="134" width="570" height="88" rx="10" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="2.5"/>
  <text x="290" y="164" font-size="20" font-weight="800" fill="#2f7d4f">② RESPONSE</text>
  <text x="290" y="192" font-size="18" font-family="Menlo,monospace" fill="#333">version + status code · headers · body?</text>
  <path d="M270,178 L238,178" stroke="#404040" stroke-width="3.5" marker-end="url(#m4)"/>
  <text x="555" y="246" text-anchor="middle" font-size="19" fill="#404040" font-weight="700">One request ⇒ exactly one response. Then the connection is free for the next one.</text>
</svg>`;

export const deck = { key: 'api-00-3', code: 'API 0.1', title: 'HTTP you actually need', sub: 'Requests, responses, URLs, headers' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'HTTP you<br>actually need', sub: 'Open a real request and response<br>and read every single line.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>The <b>request → response</b> cycle every API call follows</li>
<li>A tiny <b>“mirror” server</b> that shows you exactly what you sent</li>
<li>How to read <code class="i">curl -i</code> and <code class="i">curl -v</code> output line by line</li>
<li>The five parts of a <b>URL</b>, the headers that matter, the status-code families</li>
<li>Two classic traps: a forgotten <code class="i">Content-Type</code>, and “HTTP remembers me”</li>
</ul>
${box('Why first', 'Every later chapter — status codes, errors, caching, security — is “just” a careful choice of these few lines.', 'lam')}` },

  { giua: true, to: true, t: 'Everyday example: a letter and its reply', body: `${thu()}
<p style="margin:0;font-size:23px">HTTP is a <b>letter format</b>: who it is for, notes on the envelope, the content — and a reply with a stamp on it.</p>` },

  { t: 'One request in, exactly one response out', body: `${vong()}
${two(box('Request', 'Written by the <b>client</b>. Starts with a line like <code class="i">GET /labs HTTP/1.1</code>.', 'lam'), box('Response', 'Written by the <b>server</b>. Starts with a line like <code class="i">HTTP/1.1 200 OK</code>.', 'xanh'))}` },

  { giua: true, to: true, t: 'Build a mirror: a server that echoes your request', body: two(sql(`// echo.mjs — prints what it receives, sends it back as JSON
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    console.log(\`\${req.method} \${req.url} HTTP/\${req.httpVersion}\`);
    console.log(req.headers);
    if (body) console.log('body:', body);
    const reply = { method: req.method, url: req.url, headers: req.headers, body };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(reply, null, 2));
  });
});
server.listen(4001, () => console.log('echo server: http://localhost:4001'));`, { lang: 'javascript', sm: true }), `
<ul style="font-size:21px">
<li>Only Node’s built-in <code class="i">node:http</code> — <b>no install</b></li>
<li>Collects the body piece by piece, then replies with <b>everything it saw</b></li>
<li>Run: <code class="i">node echo.mjs</code></li>
</ul>
${box('Why a mirror?', 'Frameworks hide the raw request. A mirror shows the <b>truth</b>: what curl really sent.', 'xanh')}`, 'r64') },

  { t: 'curl -i: the response, headers included', body: two(http(`$ curl -i http://localhost:4001/labs?building=Alpha
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:39:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{
  "method": "GET",
  "url": "/labs?building=Alpha",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "accept": "*/*"
  },
  "body": ""
}`, { sm: true }), `
<ul style="font-size:21px">
<li>Line 1: <b>status line</b> — version, code, reason</li>
<li>Then <b>headers</b>, one <code class="i">Name: value</code> per line</li>
<li>An <b>empty line</b> ends the headers</li>
<li>Then the <b>body</b> — here, the mirror shows curl sent <b>3 headers</b> and no body</li>
</ul>
${box('-i', '= <b>include</b> response headers. Without it curl prints only the body.', 'lam')}`, 'r64') },

  { t: 'curl -v: see the request you actually sent', body: two(http(`$ curl -v http://localhost:4001/labs/lab_1
…
* Connected to localhost (::1) port 4001
> GET /labs/lab_1 HTTP/1.1
> Host: localhost:4001
> User-Agent: curl/8.7.1
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200 OK
< Content-Type: application/json; charset=utf-8
< Date: Sat, 31 Oct 2026 15:40:02 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
{ [172 bytes data]
…`, { sm: true }), `
<table class="t" style="font-size:20px">
<tr><th style="width:70px">Prefix</th><th>Means</th></tr>
<tr><td><code class="i">*</code></td><td>curl talking to you (connection info)</td></tr>
<tr><td><code class="i">&gt;</code></td><td>lines curl <b>sent</b> — the request</td></tr>
<tr><td><code class="i">&lt;</code></td><td>lines curl <b>received</b> — the response</td></tr>
</table>
${box('Use it when', 'the server says your request is wrong and you are sure it is right. <b>-v</b> settles the argument.', 'xanh')}`, 'r64') },

  { t: 'A URL has five parts', body: `${url()}
${two(`<p style="margin:0;font-size:22px">The <b>path</b> names the resource; the <b>query</b> after <code class="i">?</code> tweaks <i>how</i> you want it. The server only sees <code class="i">/labs?building=Alpha</code> — host and port were used to find it.</p>`,
`<table class="t" style="font-size:20px"><tr><th>URL</th><th>Same resource?</th></tr><tr><td style="white-space:nowrap"><code class="i">/labs?building=Alpha</code></td><td rowspan="2" style="vertical-align:middle">yes — the <b>labs</b> collection, filtered differently</td></tr><tr><td style="white-space:nowrap"><code class="i">/labs?building=Beta</code></td></tr></table>`, 'r46')}` },

  { t: 'The request, line by line', to: true, giua: true, body: req([
    ['GET /labs/lab_1 HTTP/1.1', '<b>Request line</b>: method · path (+query) · HTTP version'],
    ['Host: localhost:4001', '<b>Host</b>: which site — one server can host many'],
    ['User-Agent: curl/8.7.1', '<b>User-Agent</b>: which program is calling'],
    ['Accept: */*', '<b>Accept</b>: formats the client can read (<code class="i">*/*</code> = anything)'],
    ['', '<b>Empty line</b>: “headers finished”'],
    ['(no body for GET)', '<b>Body</b>: only when sending data, e.g. POST'],
  ]) + `<p style="margin:12px 0 0;font-size:22px">That is all an HTTP/1.1 request is: <b>plain text</b>, in a fixed order.</p>` },

  { t: 'Sending data: POST with a JSON body', body: two(http(`$ curl -i -X POST http://localhost:4001/bookings \\
    -H 'Content-Type: application/json' \\
    -d '{"labId":"lab_1","purpose":"Lab 3 SWT301"}'
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
…

{
  "method": "POST",
  "url": "/bookings",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "accept": "*/*",
    "content-type": "application/json",
    "content-length": "42"
  },
  "body": "{\\"labId\\":\\"lab_1\\",\\"purpose\\":\\"Lab 3 SWT301\\"}"
}`, { sm: true }), `
<table class="t" style="font-size:20px">
<tr><th style="width:80px">Flag</th><th>Meaning</th></tr>
<tr><td><code class="i">-X</code></td><td>which <b>method</b> (default GET)</td></tr>
<tr><td><code class="i">-H</code></td><td>add a <b>header</b></td></tr>
<tr><td><code class="i">-d</code></td><td>the <b>body</b> (data) to send</td></tr>
</table>
${box('Notice', 'curl added <code class="i">content-length: 42</code> itself — the body is exactly 42 bytes. The server needs it to know where the body ends.', 'lam')}`, 'r64') },

  { t: 'The response: status code tells the story', body: `
<table class="t lon">
<tr><th style="width:120px">Family</th><th style="width:280px">Means</th><th>Examples you will use in this course</th></tr>
<tr><td><b>1xx</b></td><td>“hold on…” (informational)</td><td>rare in APIs — you can ignore for now</td></tr>
<tr><td style="color:#1f7a45"><b>2xx</b></td><td>success</td><td><b>200</b> OK · <b>201</b> Created · <b>204</b> No Content</td></tr>
<tr><td style="color:#336791"><b>3xx</b></td><td>look elsewhere</td><td><b>301</b> moved · <b>304</b> not modified (Ch 9)</td></tr>
<tr><td style="color:#b85a2b"><b>4xx</b></td><td>the <b>client</b> made a mistake</td><td><b>400</b> · <b>401</b> · <b>403</b> · <b>404</b> · <b>409</b> · <b>422</b> · <b>429</b></td></tr>
<tr><td style="color:#c0392b"><b>5xx</b></td><td>the <b>server</b> failed</td><td><b>500</b> bug · <b>503</b> overloaded / maintenance</td></tr>
</table>
${box('First digit first', 'Before reading anything else, look at the first digit: it tells you <b>whose fault</b> it is. Lesson 1.3 goes through each code.', 'xanh')}` },

  { t: 'Headers you will actually meet', body: `
<table class="t lon">
<tr><th style="width:230px">Header</th><th style="width:120px">Sent by</th><th>Job</th></tr>
<tr><td><code class="i">Content-Type</code></td><td>both</td><td>format of the <b>body</b>: <code class="i">application/json</code></td></tr>
<tr><td><code class="i">Accept</code></td><td>client</td><td>formats the client can read</td></tr>
<tr><td><code class="i">Authorization</code></td><td>client</td><td>who you are: <code class="i">Bearer &lt;token&gt;</code></td></tr>
<tr><td><code class="i">Content-Length</code></td><td>both</td><td>size of the body in bytes</td></tr>
<tr><td><code class="i">Location</code></td><td>server</td><td>URL of something just created (201)</td></tr>
<tr><td><code class="i">Cache-Control</code> · <code class="i">ETag</code></td><td>server</td><td>may this be cached? which version is it? (Ch 9)</td></tr>
</table>
<p class="nho" style="margin:6px 0 0">Header names are case-insensitive: <code class="i">content-type</code> = <code class="i">Content-Type</code>. That is why the mirror printed them in lowercase.</p>` },

  { t: 'Methods: the verb of the request', body: `
<table class="t lon">
<tr><th style="width:130px">Method</th><th>Intent</th><th style="width:320px">LabFlow example</th></tr>
<tr><td><b>GET</b></td><td>read — must not change anything</td><td><code class="i">GET /labs</code></td></tr>
<tr><td><b>POST</b></td><td>create / trigger an action</td><td><code class="i">POST /bookings</code></td></tr>
<tr><td><b>PUT</b></td><td>replace the whole thing</td><td><code class="i">PUT /devices/dev_1</code></td></tr>
<tr><td><b>PATCH</b></td><td>change some fields</td><td><code class="i">PATCH /devices/dev_1</code></td></tr>
<tr><td><b>DELETE</b></td><td>remove</td><td><code class="i">DELETE /devices/dev_2</code></td></tr>
<tr><td><b>HEAD · OPTIONS</b></td><td>headers only · “what can I do here?”</td><td><code class="i">curl -I</code> · <code class="i">-X OPTIONS</code></td></tr>
</table>
${box('Lesson 1.2', 'goes deep: which methods are <b>safe</b>, which are <b>idempotent</b>, and why that decides what a client may retry.', 'lam')}` },

  { t: 'HTTP does not remember you', to: true, giua: true, body: two(`
<ul>
<li>Each request stands <b>alone</b>; the server keeps no memory of “the conversation”</li>
<li>So every request must carry <b>everything</b> needed: who you are (<code class="i">Authorization</code>), what you want, the data</li>
<li>This is called <b>stateless</b> — and it is why one API can run on 10 servers behind a load balancer</li>
</ul>`, box('Wait, but I stay logged in?', 'Your browser re-sends a <b>cookie</b> or <b>token</b> on every request. The memory lives in the client (and the database), not in HTTP.', 'lam')) },

  { t: 'HTTP/1.1, /2, /3: same meaning, different wire', to: true, giua: true, body: `
<table class="t lon">
<tr><th>Version</th><th>On the wire</th><th>What changes for API design</th></tr>
<tr><td><b>HTTP/1.1</b> (1997)</td><td>plain text — what curl -v shows</td><td rowspan="3" style="vertical-align:middle;font-weight:700">Nothing. Methods, status codes and headers mean the same in all three — they are defined once, in <b>RFC 9110</b>.</td></tr>
<tr><td><b>HTTP/2</b> (2015)</td><td>binary frames, many requests on one connection</td></tr>
<tr><td><b>HTTP/3</b> (2022)</td><td>runs over QUIC (UDP) instead of TCP</td></tr>
</table>
${box('So', 'Learn the meaning once, on readable HTTP/1.1. Faster versions are an infrastructure upgrade, not a new contract.', 'xanh')}` },

  { giua: true, to: true, t: 'Trap: forgetting Content-Type', body: vsd(http(`$ curl -X POST http://localhost:4001/bookings \\
    -d '{"labId":"lab_1"}'
…
    "content-type": "application/x-www-form-urlencoded"
…`, { sm: true }) + `<p style="margin:8px 0 0;font-size:20px">curl’s <code class="i">-d</code> labels the body as a <b>web form</b> unless you say otherwise. Express’s <code class="i">express.json()</code> skips it — your handler sees <b>no body</b>.</p>`,
  http(`$ curl -X POST http://localhost:4001/bookings \\
    -H 'Content-Type: application/json' \\
    -d '{"labId":"lab_1"}'
…
    "content-type": "application/json"
…`, { sm: true }) + `<p style="margin:8px 0 0;font-size:20px">Or use <code class="i">curl --json '{…}'</code> (curl ≥ 7.82), which sets both <code class="i">Content-Type</code> and <code class="i">Accept</code> to JSON for you.</p>`, '✗ Body arrives, but labelled as a form', '✓ Say what the body is') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Every API call = <b>one request</b> (request line, headers, body?) → <b>one response</b> (status line, headers, body?)</li>
<li><code class="i">curl -i</code> shows response headers; <code class="i">curl -v</code> shows what you <b>sent</b></li>
<li>URL = scheme · host · port · <b>path</b> (which resource) · <b>query</b> (options)</li>
<li>First digit of the status: <b>2</b> ok · <b>4</b> your fault · <b>5</b> server’s fault</li>
<li>HTTP is <b>stateless</b>; always send <code class="i">Content-Type</code> with a body</li>
</ul>
${box('Next', 'Lesson 0.2 — tools: curl in depth, HTTPie, Postman and Bruno.', 'xanh')}` },
]);
