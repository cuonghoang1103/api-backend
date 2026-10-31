/**
 * api-00-4 — API Design · Section 0 · Lesson 0.2 "Tools: curl, HTTPie, Postman, Bruno" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s00-intro.mjs › api-0-2-bo-cong-cu. Output = chạy thật với máy chủ tấm gương echo.mjs (cổng 4001),
 * curl 8.7.1 + HTTPie 3.2.4 trên macOS. Sự thật về PowerShell/Bruno kiểm ở learn.microsoft.com và docs.usebruno.com (31/10/2026).
 */
import { lamDeck, sql, http, two, box, steps, cards, c, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Section 0 — Why API design matters', bai: '0.2' };

export const deck = { key: 'api-00-4', code: 'API 0.2', title: 'Tools: curl, HTTPie, Postman, Bruno', sub: 'Send any request, read any response' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Tools: curl, HTTPie,<br>Postman, Bruno', sub: 'Send any request, read any response —<br>and keep your requests with your code.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Why the browser address bar is <b>not enough</b> to test an API</li>
<li>The ten <b>curl</b> flags you will use all course long</li>
<li><b>HTTPie</b>: shorter commands — and the one way it can fool you</li>
<li><b>Postman</b> vs <b>Bruno</b>: GUI tools, and why a team project likes files in git</li>
<li>One habit: a <b>base URL variable</b> and saved requests</li>
</ul>
${box('Target for today', 'We aim every tool at the <b>mirror server</b> from lesson 0.1 (<code class="i">node echo.mjs</code>, port 4001), so you see exactly what each tool sends.', 'lam')}` },

  { t: 'Why not just use the browser?', body: `
<table class="t lon">
<tr><th>You need to…</th><th style="width:200px">Address bar</th><th style="width:200px">curl</th><th style="width:250px">Postman / Bruno</th></tr>
<tr><td>send a GET</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>send POST, PUT, PATCH, DELETE</td><td>❌</td><td>✅ <code class="i">-X</code></td><td>✅ dropdown</td></tr>
<tr><td>add a header (a token)</td><td>❌</td><td>✅ <code class="i">-H</code></td><td>✅ Headers tab</td></tr>
<tr><td>send a JSON body</td><td>❌</td><td style="white-space:nowrap">✅ <code class="i">--json</code></td><td>✅ Body tab</td></tr>
<tr><td>see raw status + headers</td><td>only in DevTools</td><td>✅ <code class="i">-i</code></td><td>✅ panels</td></tr>
<tr><td>paste into a bug report</td><td>❌</td><td>✅ one line</td><td>export first</td></tr>
</table>
${box('This course', 'uses <b>curl</b> in every lesson: one line you can copy, run, and compare with the output printed here.', 'xanh')}` },

  { t: 'curl: the ten flags you will actually use', body: `
<table class="t" style="font-size:21px">
<tr><th style="width:190px">Flag</th><th>What it does</th><th style="width:330px">Example</th></tr>
<tr><td><code class="i">-i</code></td><td>show response headers</td><td><code class="i">curl -i URL</code></td></tr>
<tr><td><code class="i">-v</code></td><td>show what was sent and received</td><td><code class="i">curl -v URL</code></td></tr>
<tr><td><code class="i">-X</code></td><td>choose the method</td><td><code class="i">-X DELETE</code></td></tr>
<tr><td><code class="i">-H</code></td><td>add a header</td><td><code class="i">-H 'Accept: application/json'</code></td></tr>
<tr><td><code class="i">-d</code></td><td>send a body (POST unless -X says otherwise)</td><td><code class="i">-d 'a=1'</code></td></tr>
<tr><td><code class="i">--json</code></td><td>send JSON + set Content-Type and Accept</td><td><code class="i">--json '{"a":1}'</code></td></tr>
<tr><td><code class="i">-I</code></td><td>HEAD request: headers only</td><td><code class="i">curl -I URL</code></td></tr>
<tr><td><code class="i">-s</code> · <code class="i">-o</code></td><td>silent · write the body to a file</td><td><code class="i">-s -o /dev/null</code></td></tr>
<tr><td><code class="i">-w</code></td><td>print chosen facts after the call</td><td><code class="i">-w '%{http_code}'</code></td></tr>
<tr><td><code class="i">-L</code></td><td>follow redirects (3xx)</td><td><code class="i">curl -L URL</code></td></tr>
</table>` },

  { giua: true, to: true,  t: 'curl --json: one flag instead of two headers', body: two(http(`$ curl --json '{"labId":"lab_1"}' http://localhost:4001/bookings
{
  "method": "POST",
  "url": "/bookings",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "content-type": "application/json",
    "accept": "application/json",
    "content-length": "17"
  },
  "body": "{\\"labId\\":\\"lab_1\\"}"
}`, { sm: true }), `
<ul style="font-size:22px">
<li>We wrote <b>no</b> <code class="i">-X POST</code>: a body makes curl use <b>POST</b> automatically</li>
<li><code class="i">--json</code> set <code class="i">content-type</code> <b>and</b> <code class="i">accept</code> to JSON</li>
<li>Needs curl <b>7.82</b> or newer — check with <code class="i">curl --version</code></li>
</ul>
${box('Still need -X', 'for <b>PUT</b>, <b>PATCH</b> and <b>DELETE</b>: <code class="i">curl -X PATCH --json …</code>', 'lam')}`, 'r64') },

  { t: 'curl in scripts: only the status code', to: true, giua: true, body: two(http(`$ BASE=http://localhost:4001
$ curl -s -o /dev/null -w "%{http_code} %{content_type}\\n" $BASE/labs
200 application/json; charset=utf-8`), `
<table class="t" style="font-size:20px">
<tr><th style="width:160px">Piece</th><th>Meaning</th></tr>
<tr><td><code class="i">BASE=…</code></td><td>a shell variable: write the host <b>once</b></td></tr>
<tr><td><code class="i">-s</code></td><td>no progress meter</td></tr>
<tr><td><code class="i">-o /dev/null</code></td><td>throw the body away</td></tr>
<tr><td><code class="i">-w "…"</code></td><td>print only what you ask for</td></tr>
</table>`) + box('Real use', 'This is how deploy scripts check “is every route alive?”: <b>404 = route missing</b>, 401/200 = mounted. One line per endpoint, no browser.', 'xanh') },

  { giua: true, to: true, t: 'Windows: two traps before your first curl', body: two(box('Trap 1 — PowerShell 5.1 has a fake “curl”', `In <b>Windows PowerShell 5.1</b>, <code class="i">curl</code> is an <b>alias</b> for <code class="i">Invoke-WebRequest</code> — different flags, different output. Type <code class="i">curl.exe</code> to run the real curl (shipped with Windows 10/11).`, 'do2'),
  box('Trap 2 — quotes', `PowerShell and <code class="i">cmd</code> treat <code class="i">'…'</code> and <code class="i">"…"</code> differently from bash/zsh, so JSON bodies break. Easiest fixes: use <b>Git Bash</b> or <b>WSL</b>, or put the JSON in a file: <code class="i">curl.exe --json @body.json URL</code>`, 'do2')) +
  sql(`# PowerShell — same request, real curl, body from a file
PS> Set-Content body.json '{"labId":"lab_1"}'
PS> curl.exe -i --json "@body.json" http://localhost:4001/bookings`, { lang: 'powershell' }) +
  `<p class="nho" style="margin:6px 0 0">Source: Microsoft Learn, Invoke-WebRequest (PowerShell 5.1): “aliases: iwr, curl, wget”. PowerShell 7 has no curl alias. (Windows commands shown, not run on the Mac used for this course.)</p>` },

  { giua: true, to: true,  t: 'HTTPie: shorter commands for humans', body: two(http(`$ http POST :4001/bookings labId=lab_1 seats:=2 urgent:=true
HTTP/1.1 200 OK
…
{
    "body": "{\\"labId\\": \\"lab_1\\", \\"seats\\": 2, \\"urgent\\": true}",
    "headers": {
        "accept": "application/json, */*;q=0.5",
        …
        "content-type": "application/json",
        …
    },
    "method": "POST",
    "url": "/bookings"
}`, { sm: true }), `
<table class="t" style="font-size:20px">
<tr><th>Syntax</th><th>Becomes</th></tr>
<tr><td><code class="i">:4001</code></td><td><code class="i">http://localhost:4001</code></td></tr>
<tr><td><code class="i">labId=lab_1</code></td><td>JSON <b>string</b></td></tr>
<tr><td><code class="i">seats:=2</code></td><td>raw JSON (<b>number</b>, true…)</td></tr>
<tr><td><code class="i">building==Alpha</code></td><td>query <code class="i">?building=Alpha</code></td></tr>
</table>
${box('Default', 'HTTPie sends JSON by default — no Content-Type to forget.', 'xanh')}`, 'r64') },

  { t: 'Trap: HTTPie re-sorts what it shows you', giua: true, body: vsd(http(`$ http :4000/labs/lab_1
…
{
    "building": "Alpha",
    "capacity": 30,
    "code": "AL-201",
    "id": "lab_1",
    "name": "Phòng Lab Mạng máy tính"
}`, { sm: true }) + `<p style="margin:8px 0 0;font-size:20px">Keys come out <b>alphabetically</b>, headers too — HTTPie’s pretty-printer did that.</p>`,
  http(`$ curl http://localhost:4000/labs/lab_1
{
  "id": "lab_1",
  "code": "AL-201",
  "name": "Phòng Lab Mạng máy tính",
  "building": "Alpha",
  "capacity": 30
}`, { sm: true }) + `<p style="margin:8px 0 0;font-size:20px">curl prints the bytes the server <b>really</b> sent. Use it (or <code class="i">http --pretty=none</code>) when order matters.</p>`,
  '⚠ Looks like the server’s order — it is not', '✓ The real response') + `<p class="nho" style="margin:6px 0 0">Output from the LabFlow API you build in lesson 0.3.</p>` },

  { t: 'Postman: the popular GUI', to: true, giua: true, body: two(`
<ul>
<li>Click method, type URL, fill <b>Headers</b> and <b>Body</b> tabs, press Send</li>
<li><b>Collections</b>: save requests in folders</li>
<li><b>Environments</b>: <code class="i">{{baseUrl}}</code> = <code class="i">http://localhost:4000</code> on your laptop, the real server elsewhere</li>
<li><b>Tests</b>: small scripts that check the response after each call</li>
</ul>`, box('Watch out', 'Collections usually live in your <b>Postman account / cloud workspace</b>. Never save real tokens or passwords in a shared workspace — treat it like code you publish.', 'do2') +
  box('Good for', 'exploring a big third-party API, demoing to non-developers.', 'lam')) },

  { giua: true, to: true, t: 'Bruno: requests as plain files in your repo', body: two(`
<ul style="font-size:22px">
<li>Desktop GUI like Postman, <b>offline-first</b>, no account needed</li>
<li>A collection is a <b>folder of plain-text files</b> (older versions: <code class="i">.bru</code>; newer: YAML)</li>
<li>Commit it next to your code: teammates <b>pull</b> the latest requests, reviewers see changes in a <b>diff</b></li>
<li>Open source (MIT) — <code class="i">github.com/usebruno/bruno</code></li>
</ul>`, sql(`labflow-api/
├── src/
├── package.json
└── api-requests/          ← Bruno collection
    ├── labs/
    │   ├── list-labs
    │   └── get-lab
    └── environments/
        └── local          ← baseUrl = http://localhost:4000`, { lang: 'plaintext' }) + box('Team project tip', 'Front-end and back-end share one folder of working requests — the contract you can <b>run</b>.', 'xanh')) },

  { t: 'Which tool when?', body: `
<table class="t lon">
<tr><th style="width:150px">Tool</th><th>Best for</th><th style="width:260px">Shared how</th><th style="width:150px">Cost</th></tr>
<tr><td><b>curl</b></td><td>lessons, bug reports, scripts, servers without a GUI</td><td>one copy-paste line</td><td>free, preinstalled</td></tr>
<tr><td><b>HTTPie</b></td><td>fast typing while exploring</td><td>one line</td><td>free CLI</td></tr>
<tr><td><b>Postman</b></td><td>big third-party APIs, demos</td><td>cloud workspace</td><td>free tier + paid</td></tr>
<tr><td><b>Bruno</b></td><td>team projects that live in git</td><td>files in the repo</td><td>free core</td></tr>
</table>
${box('Our rule', 'Learn with <b>curl</b> (you see everything). Pick <b>one</b> GUI for your team and commit its collection. Never paste real secrets into any of them.', 'xanh')}` },

  { t: 'Trap: quotes around JSON in the shell', to: true, giua: true, body: vsd(sql(`# double quotes: the shell eats the inner "
curl --json "{"labId":"lab_1"}" $BASE/bookings`, { lang: 'bash' }) + http(`# what the mirror received:
  "body": "{labId:lab_1}"`, { title: 'echo.mjs saw' }) +
  `<p style="margin:8px 0 0;font-size:21px">Bash/zsh strip the inner <code class="i">"</code> pairs. The server answers <b>400</b> and you blame the server.</p>`,
  sql(`# single quotes outside, double quotes inside
curl --json '{"labId":"lab_1"}' $BASE/bookings

# or keep the body in a file
curl --json @body.json $BASE/bookings`, { lang: 'bash' }) + http(`# what the mirror received:
  "body": "{\\"labId\\":\\"lab_1\\"}"`, { title: 'echo.mjs saw' }) +
  `<p style="margin:8px 0 0;font-size:21px">JSON needs <b>double</b> quotes, so wrap it in <b>single</b> quotes (macOS, Linux, Git Bash, WSL).</p>`) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>The address bar only does GET; you need a tool that controls <b>method, headers, body</b></li>
<li>curl: <code class="i">-i -v -X -H -d --json -I -s -o -w -L</code> — enough for the whole course</li>
<li>Windows PowerShell 5.1: type <code class="i">curl.exe</code>; mind the quotes</li>
<li>HTTPie is shorter but <b>re-sorts</b> what it prints</li>
<li>Postman = cloud workspace · Bruno = <b>files in git</b></li>
</ul>
${box('Next', 'Lesson 0.3 — build the LabFlow API skeleton with Node 22 + Express 5, and point these tools at it.', 'xanh')}` },
]);
