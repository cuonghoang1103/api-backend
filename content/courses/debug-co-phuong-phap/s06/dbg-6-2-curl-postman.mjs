/**
 * 6.2 — Tái hiện request: curl -v, môi trường Postman/Bruno, Copy as cURL (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: curl 8.18.0, Bruno CLI 4.3.0 (@usebruno/cli), Newman 6.2.3, nginx 1.27.5 + API node:http (scratchpad/dbg/lab/ch6:
 * tools/c62-curl.sh, o-62-*.txt, bruno/labflow/, postman/). Mã: s06/_ma-6.mjs.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { BRU_ENV, BRU_TOI } from './_ma-6.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_V = `<div class="out">### curl -v: dòng * = curl kể, &gt; = gửi đi, &lt; = nhận về
$ curl -sv --cacert nginx/tls/ca.pem --resolve labflow.test:41643:127.0.0.1 -H "Authorization: Bearer sv-gia" https://labflow.test:41643/api/toi
* Added labflow.test:41643:127.0.0.1 to DNS cache
* Hostname labflow.test was found in DNS cache
*   Trying 127.0.0.1:41643...
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* SSL Trust Anchors:
*   CAfile: nginx/tls/ca.pem
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / RSASSA-PSS
* ALPN: server accepted http/1.1
* Server certificate:
*   subject: CN=labflow.test
*   start date: Nov 23 22:16:26 2026 GMT
*   expire date: Dec 23 22:16:26 2026 GMT
*   issuer: CN=LabFlow Dev CA
*   Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption
*   Certificate level 1: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption
*   subjectAltName: "labflow.test" matches cert's "labflow.test"
* SSL certificate verified via OpenSSL.
* Established connection to labflow.test (127.0.0.1 port 41643) from 127.0.0.1 port 32856 
* using HTTP/1.x
&gt; GET /api/toi HTTP/1.1
&gt; Host: labflow.test:41643
&gt; User-Agent: curl/8.18.0
&gt; Accept: */*
&gt; Authorization: Bearer sv-gia
&gt; 
* Request completely sent off
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
&lt; HTTP/1.1 200 OK
&lt; Server: nginx/1.27.5
&lt; Date: Mon, 23 Nov 2026 22:19:09 GMT
&lt; Content-Type: application/json; charset=utf-8
&lt; Transfer-Encoding: chunked
&lt; Connection: keep-alive
&lt; X-Request-Id: 63ea4d74
&lt; X-Request-Id: 86e01abb79507853a3244e243e11cbe4
&lt; 
* Connection #0 to host labflow.test:41643 left intact
{"ten":"SE1801","vaiTro":"SV"}
                                          (curl's "{ [5 bytes data]" lines removed)</div>`;

const OUT_W = `<div class="out">$ curl -s -o /dev/null --cacert nginx/tls/ca.pem --resolve labflow.test:41643:127.0.0.1 \\
    -w 'dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} gui-xong=%{time_pretransfer} byte-dau=%{time_starttransfer} tong=%{time_total} ma=%{http_code}\\n' \\
    'https://labflow.test:41643/api/cham?ms=800'
dns=0.000012 tcp=0.000104 tls=0.002182 gui-xong=0.002201 byte-dau=0.805730 tong=0.805807 ma=200
                                  ← 2 ms to get connected and encrypted, 803 ms waiting for the first byte = the server is slow</div>`;

const OUT_GO = `<div class="out">### Trap 1: -d sends a FORM, not JSON
$ curl -s -i -d '{"phong":401,"nguoiDat":"SE1805","batDau":"2026-11-25T08:00:00+07:00"}' 127.0.0.1:41610/api/dat-cho
HTTP/1.1 400 Bad Request
{"loi":"Thiếu trường phong/nguoiDat/batDau"}
$ curl -s -v -d '…' 127.0.0.1:41610/api/dat-cho 2>&1 | grep '^> Content-Type'
> Content-Type: application/x-www-form-urlencoded
$ curl -s -i --json '{"phong":401,"nguoiDat":"SE1805","batDau":"2026-11-25T08:00:00+07:00"}' 127.0.0.1:41610/api/dat-cho
HTTP/1.1 201 Created
{"id":2,"phong":401,"nguoiDat":"SE1805","batDau":"2026-11-25T01:00:00.000Z"}

### Trap 2: single quotes do not expand variables
$ TOKEN=sv-gia
$ curl -s -H 'Authorization: Bearer $TOKEN' 127.0.0.1:41610/api/toi
{"loi":"Chưa đăng nhập hoặc token sai"}               ← the server received the literal text "$TOKEN"
$ curl -s -H "Authorization: Bearer $TOKEN" 127.0.0.1:41610/api/toi
{"ten":"SE1801","vaiTro":"SV"}

### Trap 3: zsh (the macOS default shell) treats ? in a URL as a wildcard
% curl -s 127.0.0.1:41610/api/cham?ms=10
zsh:1: no matches found: 127.0.0.1:41610/api/cham?ms=10      [exit 1]   ← curl never ran
% curl -s '127.0.0.1:41610/api/cham?ms=10'
{"xong":true}

### Trap 4: -I is a HEAD request, not "GET but show headers"
$ curl -sI 127.0.0.1:41610/api/phong
HTTP/1.1 404 Not Found                                 ← our API has no HEAD route
$ curl -s -o /dev/null -w "%{http_code}\\n" 127.0.0.1:41610/api/phong
200                                                    ← use -i (GET + show headers) or -o /dev/null -w</div>`;

const OUT_BRU = `<div class="out">$ cat environments/local.bru
vars {
  baseUrl: http://127.0.0.1:41610
  token: {{process.env.LABFLOW_TOKEN}}
}
$ cat .env                 # listed in .gitignore — never committed
LABFLOW_TOKEN=sv-gia
$ bru run --env local
1-phong (200 OK) - 10 ms
   ✓ res.status: eq 200
2-toi (200 OK) - 3 ms
   ✓ res.status: eq 200
   ✓ res.body.vaiTro: eq SV
3-dat-cho (201 Created) - 3 ms
   ✓ res.status: eq 201
… Assertions 4/4   Status ✓ PASS

$ bru run --env test       # labflow.test existed only in curl's --resolve; this machine cannot resolve it
1-phong (getaddrinfo ENOTFOUND labflow.test)                ← lesson 6.1: DNS layer, no HTTP status
2-toi (getaddrinfo ENOTFOUND labflow.test)
3-dat-cho (getaddrinfo ENOTFOUND labflow.test)

$ mv .env .env.tam; bru run 2-toi.bru --env local           # a teammate cloned the repo but has no .env yet
2-toi (401 Unauthorized) - 9 ms
   ✕ res.status: eq 200
      expected 401 to equal 200

$ bru run --env local --output kq.json; (read the request headers saved in the report)
{"Authorization": "Bearer ********", "Host": "127.0.0.1:41610", "User-Agent": "bruno-runtime/4.3.0", …}   ← masked in the report</div>`;

const OUT_NEWMAN = `<div class="out">$ cat local.postman_environment.json
{ "name": "local", "values": [ { "key": "baseUrl", "value": "http://127.0.0.1:41610", "enabled": true },
                               { "key": "token", "value": "", "type": "secret", "enabled": true } ] }   ← no value stored
$ newman run labflow.postman_collection.json -e local.postman_environment.json --env-var token="$LABFLOW_TOKEN" --color off
→ Tôi là ai
  GET http://127.0.0.1:41610/api/toi [200 OK, 279B, 19ms]
  ✓  200
  │ 'rid =', 'b7bad9ed48968b6b022a49bbf0addaf3'
→ Báo cáo tuần
  GET http://127.0.0.1:41610/api/bao-cao [403 Forbidden, 307B, 3ms]
  1. 200                                                  ← failed assertion: SV is not allowed (403, lesson 6.1)
│              assertions │                2 │               1 │</div>`;

const BANG_CO_EN = `<table>
<thead><tr><th>Flag</th><th>What it does</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><code>-i</code></td><td>print response headers + body</td><td>always, for API calls</td></tr>
<tr><td><code>-v</code></td><td>print the conversation: <code>*</code> curl's notes, <code>&gt;</code> sent, <code>&lt;</code> received</td><td>"what exactly did I send?"</td></tr>
<tr><td><code>-sS</code></td><td>no progress bar, but still show errors</td><td>scripts, tickets</td></tr>
<tr><td><code>-o /dev/null -w '…'</code></td><td>discard body, print chosen variables (status, timings)</td><td>measuring, loops</td></tr>
<tr><td><code>-H 'K: V'</code></td><td>add/replace a header</td><td>Authorization, custom headers</td></tr>
<tr><td><code>--json '…'</code></td><td>POST JSON with <code>Content-Type</code> and <code>Accept</code> set (curl ≥ 7.82)</td><td>instead of <code>-d</code> for JSON APIs</td></tr>
<tr><td><code>-X METHOD</code></td><td>change the method only</td><td>DELETE/PUT/PATCH; never <code>-X POST</code> with <code>-L</code></td></tr>
<tr><td><code>--resolve host:port:ip</code></td><td>connect to an IP but keep the name (Host, SNI, cert check)</td><td>test a new server before DNS points to it</td></tr>
<tr><td><code>-L</code></td><td>follow redirects (and like browsers, POST becomes GET after 301/302)</td><td>knowingly — see Lab 6.5</td></tr>
<tr><td><code>-m 5</code></td><td>give up after 5 s</td><td>never let a probe hang</td></tr>
</tbody></table>`;

const BANG_CO_VI = `<table>
<thead><tr><th>Cờ</th><th>Làm gì</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>-i</code></td><td>in header response + body</td><td>luôn luôn, khi gọi API</td></tr>
<tr><td><code>-v</code></td><td>in cả cuộc trò chuyện: <code>*</code> curl kể, <code>&gt;</code> gửi đi, <code>&lt;</code> nhận về</td><td>"rốt cuộc mình đã gửi gì?"</td></tr>
<tr><td><code>-sS</code></td><td>tắt thanh tiến độ nhưng vẫn in lỗi</td><td>script, ticket</td></tr>
<tr><td><code>-o /dev/null -w '…'</code></td><td>bỏ body, in các biến mình chọn (mã, thời gian)</td><td>đo đạc, vòng lặp</td></tr>
<tr><td><code>-H 'K: V'</code></td><td>thêm/thay một header</td><td>Authorization, header riêng</td></tr>
<tr><td><code>--json '…'</code></td><td>POST JSON, tự đặt <code>Content-Type</code> và <code>Accept</code> (curl ≥ 7.82)</td><td>thay cho <code>-d</code> khi gọi API JSON</td></tr>
<tr><td><code>-X METHOD</code></td><td>chỉ đổi method</td><td>DELETE/PUT/PATCH; đừng bao giờ <code>-X POST</code> cùng <code>-L</code></td></tr>
<tr><td><code>--resolve host:cổng:ip</code></td><td>nối tới một IP nhưng giữ nguyên tên (Host, SNI, kiểm chứng chỉ)</td><td>thử server mới trước khi đổi DNS</td></tr>
<tr><td><code>-L</code></td><td>đi theo chuyển hướng (và giống trình duyệt, POST thành GET sau 301/302)</td><td>khi biết rõ mình làm gì — xem Lab 6.5</td></tr>
<tr><td><code>-m 5</code></td><td>bỏ cuộc sau 5 s</td><td>đừng để lệnh thăm dò treo mãi</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'Everything curl (Daniel Stenberg)', 'Sách miễn phí của tác giả curl: -v, -w, --resolve, --json, chuyển hướng.', 'https://everything.curl.dev/'),
  nguon('🧰', 'Bruno Docs — Environments, Secrets, CLI', 'Biến môi trường, process.env từ .env, chạy collection bằng bru run.', 'https://docs.usebruno.com/'),
  nguon('📮', 'Postman Docs — Variables & Newman', 'Initial vs current value, biến secret, newman run --env-var.', 'https://learning.postman.com/docs/sending-requests/variables/variables/'),
  nguon('🔐', 'CloudSEK — Postman Data Leaks (12/2024)', 'Hơn 30.000 workspace Postman công khai làm lộ token, khoá API thật.', 'https://www.cloudsek.com/blog/postman-data-leaks-the-hidden-risks-lurking-in-your-workspaces'),
  lienKet({ khoa: 'api-design', bai: 'api-0-2-bo-cong-cu', title: 'API Design 0.2 — curl, HTTPie, Postman và Bruno', sub: 'Cài đặt và thao tác cơ bản từng công cụ (bài này không dạy lại).', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-2-network', title: 'Debug 5.2 — Network và Copy as cURL', sub: 'Lấy request thật từ trình duyệt ra terminal.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-11-3-do-duong', title: 'Mạng cho developer 11.3 — mtr, ping, iperf3 và curl -w', sub: 'Đo đường đi và thời gian ở mức mạng.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '6.2 — Reproducing requests: curl -v, Postman/Bruno environments, Copy as cURL|||6.2 — Tái hiện request: curl -v, môi trường Postman/Bruno, Copy as cURL',
  slug: 'dbg-6-2-curl-postman',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc từng dòng curl -v (DNS, bắt tay TLS 1.3, chứng chỉ, header gửi/nhận), đo từng chặng bằng -w, --resolve để thử đúng tên; bốn bẫy gõ lệnh chạy thật (-d gửi form thay vì JSON, nháy đơn không thay $TOKEN, zsh nuốt dấu ?, -I là HEAD); rút gọn Copy as cURL thành request tối giản; collection Bruno + Newman chạy bằng CLI với môi trường tách bí mật (.env, biến secret). Góc hacker: hơn 30.000 workspace Postman công khai làm lộ khoá (CloudSEK 12/2024).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>A bug you can replay in one line is half fixed</h2>
<p class="lead">"It fails when I click Save" cannot be debugged by anyone but you. "This curl returns 400" can be debugged by anyone, on any machine, today and next month. This lesson turns requests into replayable commands and collections, and shows the traps that make a replay lie.</p>

<h3>An everyday picture: the doctor's recording</h3>
<p>A patient says "my heart sometimes races". The doctor does not guess — she attaches a Holter monitor and gets a recording that any colleague can read. A request captured as a curl line (or a saved Postman/Bruno request) is that recording: exact method, URL, headers and body, re-playable without the patient — the browser, the user's account, your laptop.</p>

<h3>1. Reading <code>curl -v</code> line by line</h3>
${OUT_V}
<p>Three kinds of lines: <code>*</code> = curl telling you what it does (DNS, connection, TLS, certificate check), <code>&gt;</code> = exactly what was sent, <code>&lt;</code> = exactly what came back. Read it as the layers of lesson 6.1, top to bottom: <em>Added … to DNS cache</em> (our <code>--resolve</code>), <em>Trying 127.0.0.1:41643</em> (TCP), the TLS 1.3 handshake with <em>ALPN</em> (curl offered HTTP/2, the server picked HTTP/1.1), the certificate block (<em>subject</em>, <em>issuer</em>, <em>expire date</em>, <em>subjectAltName matches</em>), then the request headers and the response. Two things are worth noticing in this real output. First, the response carries <strong>two</strong> <code>X-Request-Id</code> headers with different values — a real bug in our setup that lesson 6.4 investigates. Second, <code>-v</code> prints the <code>Authorization</code> header in clear text: never paste raw <code>-v</code> output into a ticket without masking it.</p>

<h3>2. Where did the time go? <code>-w</code></h3>
${OUT_W}
<p>The values are cumulative seconds from the start. Subtract neighbours: DNS → TCP → TLS → request sent → first byte → done. "The API is slow" becomes a precise sentence: connection and TLS took 2 ms; the server thought for 803 ms. If <code>tls</code> is large, look at the network or the certificate chain (OCSP, a far-away server); if <code>byte-dau</code> (time to first byte) minus <code>gui-xong</code> is large, look at the app; if <code>tong</code> − <code>byte-dau</code> is large, the response is big or the link is slow.</p>

<h3>3. The flags you actually need</h3>
${BANG_CO_EN}

<h3>4. Four traps that make a reproduction lie (all run for real)</h3>
${OUT_GO}
<p>Each trap produces a <em>believable</em> wrong answer — 400, 401, 404 — so you start debugging the server for a mistake in your own command. Habits: always quote URLs and JSON with single quotes; put variables in double quotes; prefer <code>--json</code>; use <code>-v</code> once to confirm what was really sent. On Windows, <code>cmd</code> needs double quotes and escaped inner quotes — that is why DevTools offers "Copy as cURL (cmd)" and "(PowerShell)" separately; in PowerShell, <code>curl</code> may be an alias of <code>Invoke-WebRequest</code> — type <code>curl.exe</code>.</p>

<h3>5. From "Copy as cURL" to a minimal request</h3>
<p>From DevTools (lesson 5.2) you get a 15-header monster: <code>sec-ch-ua</code>, <code>sec-fetch-*</code>, <code>accept-language</code>, every cookie. Reduce it like the minimal reproduction of lesson 1.2: delete one header, rerun, keep the deletion if the result is unchanged. You end with the 2–4 headers that matter — usually <code>Content-Type</code>, <code>Authorization</code> or one cookie, sometimes <code>Origin</code>. That reduction <em>is</em> the diagnosis: when removing a header changes the result, that header is part of the bug. Lab 6.5 is built entirely on this move.</p>

<h3>6. Postman and Bruno: collections with environments</h3>
<p>For more than three requests, keep a collection: the same requests run against <em>local</em>, <em>dev</em>, <em>UAT</em> by switching the environment, with assertions you can run in CI. Postman stores collections in its cloud workspace (export JSON to share); <strong>Bruno</strong> stores each request as a plain <code>.bru</code> text file in your repo, reviewed in pull requests like code. Here is a Bruno collection for LabFlow, run with the official CLI:</p>
${ma(BRU_ENV, 'text')}
${ma(BRU_TOI, 'text')}
${OUT_BRU}
<p>The secret lives in <code>.env</code> (gitignored), the environment file only <em>references</em> it. The same idea in Postman: mark the variable as <em>secret</em>, leave its value empty in the exported file, and inject it at run time:</p>
${OUT_NEWMAN}
<p>Use the tool's console when a request "looks right" but fails: Postman Console (View → Show Postman Console) and Bruno's Timeline show the request <em>after</em> variables were substituted — the place where <code>{{token}}</code> turns out to be empty, or <code>{{baseUrl}}</code> still points to UAT. Note the newman script logged one <code>X-Request-Id</code> while curl showed two: different tools pick different duplicates — another reason to fix the duplication (6.4).</p>

<h3>Hacker corner: public workspaces full of real keys</h3>
<p>In December 2024 CloudSEK reported more than 30,000 public Postman workspaces leaking live secrets — access tokens, refresh tokens, API keys for payment, CRM and cloud providers — mostly because environments with real values were shared or a workspace was switched to public. A collection is a perfect attack kit: it has the URLs, the methods, the body formats, and the token. Rules: never store production credentials in a collection or environment value that is exported or synced; use secret variables / <code>.env</code> + <code>.gitignore</code>; rotate a token the moment it appears in a shared file; check workspace visibility before inviting a client; mask <code>Authorization</code> and cookies in any <code>-v</code> output you paste.</p>

<h3>On the job</h3>
<p>In an outsourcing project the client's QA often reports in Vietnamese or Japanese with a screenshot. Your standard reply: "Reproduced with the request below on UAT (token masked). Expected 201, actual 400 <code>Thiếu trường…</code>; the cause is the Content-Type header." — then the curl line. Many teams keep a Bruno or Postman collection in the repo per module; adding the failing request to it, with an assertion, is a cheap regression test that QA can run without you.</p>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>curl -v</code> against the HTTPS port; label each <code>*</code> line with its layer (DNS, TCP, TLS, HTTP).</li>
<li>Use <code>-w</code> on <code>/api/cham?ms=800</code> and on <code>/api/phong</code>; compute time-to-first-byte for both.</li>
<li>Reproduce each of the four traps, then fix the command.</li>
<li>Copy a request from DevTools (any site you own or the Chapter 5 app), reduce it to the minimum headers that keep the same result.</li>
<li>Create the Bruno collection (or a Postman one), keep the token in <code>.env</code>, run it with <code>bru run</code> / <code>newman</code>, and show that <code>git status</code> does not list the secret.</li>
</ol>
<p><strong>Done when:</strong> your bug reports contain a one-line reproduction that works on someone else's machine and contains no secret.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reproduction</span><span class="v">A request anyone can replay to get the same failure.</span></div>
  <div class="kv"><span class="k">TTFB</span><span class="v">Time to first byte — server think time + network.</span></div>
  <div class="kv"><span class="k">ALPN</span><span class="v">TLS extension where client and server agree on HTTP/2 or HTTP/1.1.</span></div>
  <div class="kv"><span class="k">Collection</span><span class="v">Saved set of requests (+ assertions) in Postman/Bruno.</span></div>
  <div class="kv"><span class="k">Environment</span><span class="v">Variables (base URL, token…) swapped per stage.</span></div>
  <div class="kv"><span class="k">Secret variable</span><span class="v">A value kept out of exports/sync, injected at run time.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>curl -v</code>: <code>*</code> notes, <code>&gt;</code> sent, <code>&lt;</code> received — read it top-down as the layers.</li>
<li><code>-w</code> splits "slow" into DNS, TCP, TLS, server time and transfer.</li>
<li><code>-d</code> is a form, single quotes freeze <code>$VAR</code>, zsh eats <code>?</code>, <code>-I</code> is HEAD — each gives a convincing false result.</li>
<li>Reduce "Copy as cURL" header by header; the header that changes the result is the bug.</li>
<li>Collections + environments make requests replayable per stage; secrets stay out of the files.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Lỗi phát lại được bằng một dòng là đã sửa được một nửa</h2>
<p class="lead">"Bấm Lưu thì lỗi" thì chỉ mình bạn gỡ được. "Lệnh curl này trả 400" thì ai cũng gỡ được, trên máy nào cũng được, hôm nay hay tháng sau. Bài này biến request thành lệnh và collection phát lại được, và chỉ ra những cái bẫy làm bản phát lại nói dối.</p>

<h3>Liên tưởng đời thường: bản ghi điện tim của bác sĩ</h3>
<p>Bệnh nhân kể "thỉnh thoảng tim tôi đập nhanh". Bác sĩ không đoán — chị gắn máy Holter và có một bản ghi mà đồng nghiệp nào cũng đọc được. Một request chụp lại thành dòng curl (hoặc request lưu trong Postman/Bruno) chính là bản ghi đó: đúng method, URL, header, body, phát lại được mà không cần "bệnh nhân" — trình duyệt, tài khoản của người dùng, laptop của bạn.</p>

<h3>1. Đọc <code>curl -v</code> từng dòng</h3>
${OUT_V}
<p>Ba loại dòng: <code>*</code> = curl kể nó đang làm gì (DNS, kết nối, TLS, kiểm chứng chỉ), <code>&gt;</code> = đúng những gì đã gửi, <code>&lt;</code> = đúng những gì nhận về. Đọc từ trên xuống theo các tầng của bài 6.1: <em>Added … to DNS cache</em> (chính là <code>--resolve</code>), <em>Trying 127.0.0.1:41643</em> (TCP), bắt tay TLS 1.3 với <em>ALPN</em> (curl đề nghị HTTP/2, server chọn HTTP/1.1), khối chứng chỉ (<em>subject</em>, <em>issuer</em>, <em>expire date</em>, <em>subjectAltName matches</em>), rồi tới header request và response. Output thật này có hai điều đáng để ý. Một, response mang <strong>hai</strong> header <code>X-Request-Id</code> với hai giá trị khác nhau — một lỗi thật trong môi trường của mình, bài 6.4 sẽ điều tra. Hai, <code>-v</code> in header <code>Authorization</code> ra nguyên văn: đừng bao giờ dán output <code>-v</code> thô vào ticket mà không che.</p>

<h3>2. Thời gian đi đâu? <code>-w</code></h3>
${OUT_W}
<p>Các giá trị là số giây cộng dồn từ lúc bắt đầu. Lấy hai mốc liền nhau trừ cho nhau: DNS → TCP → TLS → gửi xong request → byte đầu tiên → xong. "API chậm" thành một câu chính xác: kết nối và TLS mất 2 ms; server nghĩ mất 803 ms. Nếu <code>tls</code> lớn, xem mạng hoặc chuỗi chứng chỉ (OCSP, server ở xa); nếu <code>byte-dau</code> trừ <code>gui-xong</code> lớn, xem app; nếu <code>tong</code> − <code>byte-dau</code> lớn, response to hoặc đường truyền chậm.</p>

<h3>3. Những cờ thật sự cần</h3>
${BANG_CO_VI}

<h3>4. Bốn cái bẫy làm bản tái hiện nói dối (đều chạy thật)</h3>
${OUT_GO}
<p>Bẫy nào cũng cho ra một kết quả sai <em>rất đáng tin</em> — 400, 401, 404 — thế là bạn đi gỡ server vì một lỗi trong chính câu lệnh của mình. Thói quen: luôn bọc URL và JSON bằng nháy đơn; biến thì để trong nháy kép; ưu tiên <code>--json</code>; chạy <code>-v</code> một lần để chắc chắn đã gửi gì. Trên Windows, <code>cmd</code> cần nháy kép và phải escape nháy bên trong — vì thế DevTools mới có riêng "Copy as cURL (cmd)" và "(PowerShell)"; trong PowerShell, <code>curl</code> có thể là bí danh của <code>Invoke-WebRequest</code> — hãy gõ <code>curl.exe</code>.</p>

<h3>5. Từ "Copy as cURL" tới request tối giản</h3>
<p>Từ DevTools (bài 5.2) bạn nhận về một lệnh 15 header: <code>sec-ch-ua</code>, <code>sec-fetch-*</code>, <code>accept-language</code>, mọi cookie. Rút gọn y như bản tái hiện tối giản ở bài 1.2: xoá một header, chạy lại, kết quả không đổi thì giữ việc xoá. Cuối cùng còn 2–4 header quan trọng — thường là <code>Content-Type</code>, <code>Authorization</code> hoặc một cookie, có khi là <code>Origin</code>. Chính việc rút gọn đó <em>là</em> chẩn đoán: xoá một header mà kết quả đổi thì header đó là một phần của lỗi. Lab 6.5 dựng hoàn toàn trên động tác này.</p>

<h3>6. Postman và Bruno: collection có môi trường</h3>
<p>Quá ba request thì nên giữ một collection: cùng các request chạy với <em>local</em>, <em>dev</em>, <em>UAT</em> chỉ bằng việc đổi môi trường, kèm phép kiểm (assertion) chạy được trong CI. Postman cất collection trong workspace trên mây của họ (xuất JSON để chia sẻ); <strong>Bruno</strong> cất mỗi request thành một tệp chữ <code>.bru</code> ngay trong repo, được review trong pull request như mã. Đây là collection Bruno cho LabFlow, chạy bằng CLI chính thức:</p>
${ma(BRU_ENV, 'text')}
${ma(BRU_TOI, 'text')}
${OUT_BRU}
<p>Bí mật nằm trong <code>.env</code> (đã gitignore), tệp môi trường chỉ <em>tham chiếu</em> tới nó. Postman cũng vậy: đánh dấu biến là <em>secret</em>, để trống giá trị trong tệp xuất ra, và bơm vào lúc chạy:</p>
${OUT_NEWMAN}
<p>Dùng console của công cụ khi request "trông đúng" mà vẫn hỏng: Postman Console (View → Show Postman Console) và Timeline của Bruno hiện request <em>sau khi</em> đã thay biến — nơi bạn phát hiện <code>{{token}}</code> rỗng, hay <code>{{baseUrl}}</code> vẫn trỏ UAT. Để ý script newman log ra một <code>X-Request-Id</code> trong khi curl thấy hai: mỗi công cụ chọn một bản trùng khác nhau — thêm một lý do để sửa vụ trùng header (bài 6.4).</p>

<h3>Góc hacker: workspace công khai đầy khoá thật</h3>
<p>Tháng 12/2024, CloudSEK báo cáo hơn 30.000 workspace Postman công khai đang làm lộ bí mật còn dùng được — access token, refresh token, khoá API của cổng thanh toán, CRM, nhà cung cấp đám mây — phần lớn vì môi trường chứa giá trị thật bị chia sẻ, hoặc workspace bị chuyển sang công khai. Một collection là bộ đồ nghề tấn công hoàn hảo: có URL, method, định dạng body, và token. Luật: không bao giờ để thông tin đăng nhập production trong giá trị collection hay môi trường được xuất/đồng bộ; dùng biến secret hoặc <code>.env</code> + <code>.gitignore</code>; đổi token ngay khi nó xuất hiện trong một tệp đã chia sẻ; kiểm chế độ hiển thị của workspace trước khi mời khách hàng; che <code>Authorization</code> và cookie trong mọi output <code>-v</code> bạn dán.</p>

<h3>Tình huống đi làm</h3>
<p>Trong dự án outsourcing, QA phía khách hay báo lỗi bằng tiếng Việt hoặc tiếng Nhật kèm ảnh chụp. Câu trả lời chuẩn của bạn: "Đã tái hiện bằng request dưới đây trên UAT (đã che token). Mong đợi 201, thực tế 400 <code>Thiếu trường…</code>; nguyên nhân là header Content-Type." — rồi dán dòng curl. Nhiều nhóm giữ một collection Bruno hoặc Postman trong repo cho mỗi module; thêm request hỏng vào đó kèm một phép kiểm là một test hồi quy rẻ mà QA tự chạy được, không cần bạn.</p>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>curl -v</code> vào cổng HTTPS; ghi tầng (DNS, TCP, TLS, HTTP) cạnh từng dòng <code>*</code>.</li>
<li>Dùng <code>-w</code> cho <code>/api/cham?ms=800</code> và <code>/api/phong</code>; tính thời gian tới byte đầu tiên của cả hai.</li>
<li>Tái hiện từng bẫy trong bốn bẫy, rồi sửa lệnh.</li>
<li>Copy một request từ DevTools (trang của chính bạn hoặc app của Chương 5), rút gọn tới số header tối thiểu mà kết quả vẫn y nguyên.</li>
<li>Tạo collection Bruno (hoặc Postman), để token trong <code>.env</code>, chạy bằng <code>bru run</code> / <code>newman</code>, và cho thấy <code>git status</code> không liệt kê bí mật.</li>
</ol>
<p><strong>Đạt khi:</strong> báo cáo lỗi của bạn có một dòng tái hiện chạy được trên máy người khác và không chứa bí mật nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bản tái hiện</span><span class="v">Request mà ai phát lại cũng ra đúng lỗi đó.</span></div>
  <div class="kv"><span class="k">TTFB</span><span class="v">Thời gian tới byte đầu tiên — thời gian server nghĩ + mạng.</span></div>
  <div class="kv"><span class="k">ALPN</span><span class="v">Phần mở rộng TLS để client và server thống nhất HTTP/2 hay HTTP/1.1.</span></div>
  <div class="kv"><span class="k">Collection</span><span class="v">Bộ request đã lưu (+ phép kiểm) trong Postman/Bruno.</span></div>
  <div class="kv"><span class="k">Môi trường</span><span class="v">Bộ biến (URL gốc, token…) đổi theo từng giai đoạn.</span></div>
  <div class="kv"><span class="k">Biến secret</span><span class="v">Giá trị không đi theo tệp xuất/đồng bộ, chỉ bơm vào lúc chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>curl -v</code>: <code>*</code> curl kể, <code>&gt;</code> gửi đi, <code>&lt;</code> nhận về — đọc từ trên xuống theo tầng.</li>
<li><code>-w</code> tách "chậm" thành DNS, TCP, TLS, thời gian server và thời gian truyền.</li>
<li><code>-d</code> là form, nháy đơn đóng băng <code>$VAR</code>, zsh nuốt <code>?</code>, <code>-I</code> là HEAD — mỗi cái cho một kết quả sai rất thuyết phục.</li>
<li>Rút gọn "Copy as cURL" từng header một; header nào làm đổi kết quả thì đó là lỗi.</li>
<li>Collection + môi trường giúp phát lại request theo từng giai đoạn; bí mật đứng ngoài các tệp.</li>
</ul>
${NGUON}
</div>
`,
};
