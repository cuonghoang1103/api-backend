/**
 * Bài 7.5 — HTTPS và CORS (nâng cấp 02/11/2026). Output thật: _demo/_t7/https.sh (curl 8.7: bắt tay TLS 1.3 với example.com,
 * chứng chỉ hết hạn / tự ký bị từ chối), _demo/_t7/chay.mjs (Chromium: request khác origin không có header CORS ⇒ JS nhận TypeError
 * nhưng MÁY CHỦ VẪN NHẬN request; preflight OPTIONS; '*' + credentials bị chặn). Deck: scripts/slides-src/wf-7-5.mjs (10 slide,
 * WF/v1/wf-7-5). Code Lab: wf-7-5-https-cors.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const khoi = (key, ...n) => { const p = OUT[key].split(/\n+(?=> )/); return n.map((i) => p[i].trim()).join('\n\n'); };

const G = walkWf('wf-7-5', 'HTTPS and CORS', 'HTTPS và CORS', [
  [1, 'HTTPS and CORS',
    '<p>Two protections that are often confused. HTTPS protects data while it travels between the browser and the server. CORS is a browser rule about which websites may read responses from your API. This lesson looks at both with real tools — and shows one thing CORS never does.</p>',
    '<p>Hai lớp bảo vệ hay bị nhầm với nhau. HTTPS bảo vệ dữ liệu trong lúc nó đi giữa trình duyệt và máy chủ. CORS là một luật của trình duyệt về việc website nào được đọc response từ API của bạn. Bài này xem cả hai bằng công cụ thật — và chỉ ra một điều CORS không bao giờ làm.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to read a TLS handshake and a certificate in curl, explain what HTTPS protects and what it does not, react correctly to a certificate error, define an origin, read a CORS error in the console, configure the headers an API needs, and explain why CORS does not protect your server.</p>',
    '<p>Bạn sẽ đọc được một lần bắt tay TLS và một chứng chỉ trong curl, giải thích HTTPS bảo vệ gì và không bảo vệ gì, xử lý đúng một lỗi chứng chỉ, định nghĩa được origin, đọc được lỗi CORS trong console, cấu hình các header mà một API cần, và giải thích vì sao CORS không bảo vệ máy chủ của bạn.</p>'],
  [3, 'What HTTPS gives you',
    '<p>HTTPS is HTTP inside TLS. It gives three things: nobody on the path can read the request, nobody can change it without being detected, and the browser knows it is talking to the real owner of the domain, thanks to a certificate signed by a trusted authority.</p>',
    '<p>HTTPS là HTTP bên trong TLS. Nó mang lại ba điều: không ai trên đường truyền đọc được request, không ai sửa được nó mà không bị phát hiện, và trình duyệt biết mình đang nói chuyện với đúng chủ tên miền, nhờ một chứng chỉ được một tổ chức tin cậy ký.</p>'],
  [4, 'The handshake in curl',
    '<p>curl shows the TLS 1.3 handshake, the agreement to speak HTTP 2, and the certificate: issued for example dot com, by a Cloudflare authority, valid until late December. Only after "certificate verify ok" does any HTTP travel, already encrypted.</p>',
    '<p>curl cho thấy lần bắt tay TLS 1.3, thoả thuận nói HTTP/2, và chứng chỉ: cấp cho example.com, bởi một tổ chức của Cloudflare, hiệu lực tới cuối tháng mười hai. Chỉ sau "certificate verify ok" thì HTTP mới bắt đầu đi, đã được mã hoá.</p>'],
  [5, 'Certificate errors stop everything',
    '<p>An expired certificate and a self-signed one both make curl refuse to connect, with exit code sixty. That is the correct behaviour. Turning verification off to make the error go away removes the one thing that proves you are talking to the right server.</p>',
    '<p>Chứng chỉ hết hạn và chứng chỉ tự ký đều khiến curl từ chối kết nối, mã thoát sáu mươi. Đó là hành vi đúng. Tắt kiểm tra cho hết lỗi là bỏ đi chính thứ duy nhất chứng minh bạn đang nói chuyện với đúng máy chủ.</p>'],
  [6, 'Origins and the same-origin policy',
    '<p>An origin is scheme, host and port together. By default, JavaScript on one origin may send requests to another, but may not read the responses. CORS headers are how the other server says "this origin may read my answers".</p>',
    '<p>Origin là giao thức, host và cổng gộp lại. Mặc định, JavaScript ở một origin được gửi request tới origin khác, nhưng không được đọc response. Header CORS là cách máy chủ kia nói "origin này được đọc câu trả lời của tôi".</p>'],
  [7, 'Blocked — but the request arrived',
    '<p>The page fetched an API without CORS headers. JavaScript got only "Failed to fetch", and the console explained the missing header. Look at the server log: the request arrived and the server answered. CORS hides the response from the page; it does not stop the request.</p>',
    '<p>Trang fetch một API không có header CORS. JavaScript chỉ nhận "Failed to fetch", và console giải thích thiếu header. Nhìn log máy chủ: request đã tới và máy chủ đã trả lời. CORS giấu response khỏi trang; nó không chặn request.</p>'],
  [8, 'Preflight',
    '<p>For a PUT with a JSON body, the browser first sends OPTIONS to ask permission. When the API answered without allowing anything, the PUT was never sent. When it allowed the method and the Content-Type header, the browser sent the real PUT.</p>',
    '<p>Với PUT có phần thân JSON, trình duyệt gửi OPTIONS trước để xin phép. Khi API trả lời mà không cho phép gì, PUT không bao giờ được gửi. Khi nó cho phép method và header Content-Type, trình duyệt gửi PUT thật.</p>'],
  [9, 'Credentials need an exact origin',
    '<p>A request that carries cookies must not be answered with a star. The browser blocked it. With the exact origin and Allow-Credentials true, it worked. Never echo back any origin together with credentials: that gives every website your users\' logged-in data.</p>',
    '<p>Request mang cookie không được trả lời bằng dấu sao. Trình duyệt đã chặn nó. Với đúng origin và Allow-Credentials true, nó chạy. Đừng bao giờ dội lại mọi origin kèm credentials: làm vậy là trao dữ liệu đăng nhập của người dùng cho mọi website.</p>'],
  [10, 'Summary & practice',
    '<p>The practice asks you to read a real certificate, reproduce a CORS error, and fix it on the server — not in the front-end. "Done when" checks the preflight in the Network tab and that the API still rejects unauthenticated requests.</p>',
    '<p>Bài luyện yêu cầu bạn đọc một chứng chỉ thật, tái hiện một lỗi CORS, và sửa nó ở máy chủ — không phải ở front-end. "Xong khi" kiểm preflight trong thẻ Network và API vẫn từ chối request chưa xác thực.</p>'],
]);

export default {
  title: '7.5 — HTTPS and CORS|||7.5 — HTTPS và CORS',
  slug: 'wf-7-5-https-cors',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/4KHiSt0oLJ0', durationSeconds: 0 },
  description: 'HTTPS: ba điều TLS mang lại, bắt tay TLS 1.3 + chứng chỉ example.com đọc bằng curl, chứng chỉ hết hạn/tự ký bị từ chối (exit 60), HTTPS không che gì, HSTS; CORS: origin và chính sách cùng origin, đo thật trong Chromium — thiếu header ⇒ "Failed to fetch" nhưng máy chủ VẪN nhận request, preflight OPTIONS cho PUT JSON, * + credentials bị chặn, origin chính xác + Allow-Credentials thì chạy; CORS không bảo vệ máy chủ.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>HTTPS protects the wire; CORS decides which pages may read your API</h2>
<p class="lead">After this lesson you can read a TLS handshake and a certificate with curl, say exactly what HTTPS protects (and what it leaves visible), handle a certificate error without switching security off, define an origin, read a CORS error message and fix it on the right side, and explain the most common CORS misunderstanding with evidence: a blocked request still reached the server. Every deployed app needs HTTPS (Lesson 14.3), and the first time your React front-end calls your Node API on another port, you will meet CORS.</p>

<h3>Part 1 — HTTPS</h3>
<h3>Step 1 — what HTTPS adds to HTTP</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Confidentiality</span><span class="lz-t">nobody can read it</span><span class="lz-d">The Basic header, cookie and JSON from Lessons 7.1–7.3 travel encrypted. On café Wi-Fi, other users see only noise.</span></div>
<div class="lz-layer"><span class="lz-k">Integrity</span><span class="lz-t">nobody can change it</span><span class="lz-d">An attacker in the middle cannot inject ads or scripts into the page without the change being detected.</span></div>
<div class="lz-layer"><span class="lz-k">Authentication</span><span class="lz-t">it is really them</span><span class="lz-d">The server proves it owns the domain with a certificate signed by an authority your system trusts.</span></div>
</div>

<h3>Step 2 — a real handshake, seen by curl</h3>
${ra(OUT['_t7/out/https-ok'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Client hello</span><span class="lz-d">curl offers TLS versions, ciphers and protocols (<code>ALPN: h2,http/1.1</code>).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Server hello + certificate</span><span class="lz-d">The server picks TLS 1.3 and HTTP/2 and sends its certificate: <code>CN=example.com</code>, issued by a Cloudflare authority, valid Sep 26 → Dec 25 2026.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Verify</span><span class="lz-d">curl checks the issuer chain to a trusted root, the dates, and that the name matches the URL: <code>SSL certificate verify ok</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Keys agreed</span><span class="lz-d">Both sides derive session keys. Only now does the first HTTP byte travel — encrypted.</span></div>
</div>
<p>Certificates today are short-lived (three months here) and free from Let's Encrypt; hosting platforms renew them automatically. Lesson 14.3 deploys an app with one.</p>

<h3>Step 3 — when the certificate is wrong</h3>
${ra(OUT['_t7/out/https-bad'])}
<p>badssl.com hosts deliberately broken servers for testing. curl refused both with exit code 60, and a browser shows a full-page warning. The certificate is the only thing proving you are not talking to an impostor — so the error is doing its job.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "fixing" a certificate error by turning verification off.</strong> <code>curl -k</code>, <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code>, <code>rejectUnauthorized: false</code> or clicking through the browser warning all make the error disappear and leave the connection open to anyone in the middle — the exact attack HTTPS exists to stop. Copied into production, they silently disable security for every request. Fix the cause: renew the certificate, install the missing intermediate, use the right hostname, or for local development add your own development certificate (mkcert) to the trust store.</p></div>
<div class="kv-grid">
  <div class="kv"><span class="k">Still visible with HTTPS</span><span class="v">The domain name (in the handshake), your IP and the server's, when and how much data. The path, query, headers and body are hidden.</span></div>
  <div class="kv"><span class="k">Not protected by HTTPS</span><span class="v">Bugs in your app: XSS, SQL injection, IDOR, weak passwords. HTTPS secures the pipe, not what is at either end.</span></div>
  <div class="kv"><span class="k">HSTS</span><span class="v"><code>Strict-Transport-Security: max-age=31536000</code> tells the browser to always use HTTPS for your domain — no plain-HTTP first request to intercept.</span></div>
  <div class="kv"><span class="k">Mixed content</span><span class="v">An HTTPS page loading a script over <code>http://</code> is blocked by the browser; images are upgraded or warned about.</span></div>
</div>

<h3>Part 2 — CORS</h3>
<h3>Step 4 — origins and the same-origin policy</h3>
<table>
<thead><tr><th>Page</th><th>Request to</th><th>Same origin?</th></tr></thead>
<tbody>
<tr><td><code>https://shop.example</code></td><td><code>https://shop.example/api/products</code></td><td>✅ same scheme, host, port</td></tr>
<tr><td><code>https://shop.example</code></td><td><code>https://api.shop.example/products</code></td><td>❌ different host (but the same <em>site</em> for cookies, Lesson 7.2)</td></tr>
<tr><td><code>http://localhost:5173</code> (Vite)</td><td><code>http://localhost:3000/api</code> (Node)</td><td>❌ different port — the classic development case</td></tr>
<tr><td><code>https://shop.example</code></td><td><code>http://shop.example</code></td><td>❌ different scheme</td></tr>
</tbody>
</table>
<p>The browser's <strong>same-origin policy</strong>: JavaScript may send a request to another origin, but may not <em>read</em> the response unless that origin agrees, using <strong>CORS</strong> (Cross-Origin Resource Sharing) headers. It protects users: without it, any website you visit could read your webmail or bank pages using your cookies.</p>

<h3>Step 5 — measured: blocked, yet the request arrived</h3>
<p>A page on <code>http://127.0.0.1:&lt;port&gt;</code> calls an API on <code>http://localhost:&lt;port&gt;</code> in Chromium. The API handler and what happened:</p>
${ma('javascript', CODE['_t7/chay.mjs'], [93, 95])}
${ra(khoi('_t7/out/cors', 0, 1, 2))}
<p>Look at the first block again: JavaScript got <code>TypeError: Failed to fetch</code>, the console printed the real reason — but <strong>the server saw the GET and sent the salary list</strong>. The browser received the response and refused to hand it to the page. CORS protects the <em>user's data from other pages</em>; it does not protect your server from requests. curl, Postman, a script or another server ignore CORS completely.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — treating CORS as access control.</strong> "Only my front-end's origin is allowed, so the API is private" is false: anyone can call it with curl, and the server answers. Authentication and authorization (Lessons 7.1–7.3) protect the API. CORS only decides which <em>browser pages</em> may read the answers. A data-changing request without a preflight (a simple form POST) is even executed before the browser checks anything — that is CSRF (Lesson 7.2).</p></div>

<h3>Step 6 — the preflight</h3>
<p>"Simple" requests (GET, HEAD, or a POST with a form-style Content-Type) go straight out. Anything else — PUT, DELETE, PATCH, a JSON body, an <code>Authorization</code> header — makes the browser ask first with <code>OPTIONS</code>:</p>
${ma('javascript', CODE['_t7/chay.mjs'], [105, 111])}
${ra(khoi('_t7/out/cors', 3, 4))}
<p>When the OPTIONS answer did not allow anything, the browser never sent the PUT — the server saw only OPTIONS. When it allowed <code>PUT</code> and the <code>Content-Type</code> header, the browser sent the real request. <code>Access-Control-Max-Age: 600</code> lets the browser reuse that permission for 10 minutes instead of asking every time.</p>

<h3>Step 7 — cookies across origins</h3>
${ra(khoi('_t7/out/cors', 5, 6))}
<p>With <code>credentials: 'include'</code> (send cookies), the wildcard <code>*</code> is refused. The server must name the exact origin and add <code>Access-Control-Allow-Credentials: true</code>; the cookie itself must also be allowed to travel cross-site (SameSite rules, Lesson 7.2).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — reflecting every Origin with credentials.</strong> To "make CORS work", some servers copy the request's <code>Origin</code> into <code>Access-Control-Allow-Origin</code> and add <code>Allow-Credentials: true</code>. That tells the browser: every website on the internet may read this user's logged-in data. Keep an explicit allow-list (<code>['https://shop.example']</code>), compare exactly, and add <code>Vary: Origin</code> so caches do not mix answers.</p></div>
<div class="kv-grid">
  <div class="kv"><span class="k">In development</span><span class="v">Use the dev server's proxy (Vite <code>server.proxy</code>, Next.js rewrites) so the page and API share one origin — no CORS needed.</span></div>
  <div class="kv"><span class="k">In production</span><span class="v">Serve both from one domain behind a reverse proxy (nginx: <code>/api</code> → Node), or configure CORS on the API with an allow-list.</span></div>
  <div class="kv"><span class="k">Never</span><span class="v">"Fix" CORS in the front-end, with a browser extension, or with a public CORS proxy. The header must come from the server you call.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (35 minutes) — read a certificate, cause a CORS error, fix it on the server</strong></p>
<ol>
<li>Run <code>curl -sv https://cuongthai.com -o /dev/null</code> (or any site) and write down: TLS version, HTTP version agreed, certificate subject, issuer, expiry date.</li>
<li>Open any HTTPS site, click the padlock and find the same certificate details in the browser.</li>
<li>Run the Chapter 6 server on port 3456. Open <code>http://127.0.0.1:5500</code> (any static page, e.g. VS Code Live Server) and in its console run <code>fetch('http://localhost:3456/api/products').then(r =&gt; r.json())</code>. Read the error and the server log.</li>
<li>In the server's <code>send</code> function add <code>'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'</code> and retry. Then try a <code>PATCH</code> with a JSON body and handle <code>OPTIONS</code> with <code>Allow-Methods</code> and <code>Allow-Headers</code>.</li>
<li>From the terminal, call the same API with curl. Does CORS stop curl?</li>
</ol>
<p>Hint: in DevTools → Network, tick "All" to see the OPTIONS row next to the PATCH.</p>
<p><strong>Done when:</strong> your certificate notes match the padlock dialog; step 3 shows the CORS error while the server log shows the GET; after step 4 the GET returns data and the Network tab shows OPTIONS (204) followed by PATCH (200); and you can answer step 5 with "no — and that is why the API needs authentication". Then Code Lab module 7.5.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TLS / HTTPS</span><span class="v">lớp mã hoá / HTTP chạy bên trong TLS.</span></div>
  <div class="kv"><span class="k">certificate</span><span class="v">chứng chỉ — chứng minh máy chủ sở hữu tên miền.</span></div>
  <div class="kv"><span class="k">certificate authority (CA)</span><span class="v">tổ chức cấp chứng chỉ được hệ thống tin.</span></div>
  <div class="kv"><span class="k">handshake</span><span class="v">bắt tay — thoả thuận phiên bản, khoá, chứng chỉ.</span></div>
  <div class="kv"><span class="k">HSTS</span><span class="v">luôn dùng HTTPS cho tên miền này.</span></div>
  <div class="kv"><span class="k">origin</span><span class="v">giao thức + host + cổng.</span></div>
  <div class="kv"><span class="k">same-origin policy</span><span class="v">chính sách cùng origin — không đọc response khác origin.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">header cho phép origin khác đọc response.</span></div>
  <div class="kv"><span class="k">preflight</span><span class="v">request OPTIONS xin phép trước.</span></div>
  <div class="kv"><span class="k">credentials mode</span><span class="v">chế độ gửi kèm cookie/thông tin xác thực.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>HTTPS = HTTP inside TLS: confidentiality, integrity and proof of the server's identity.</li>
  <li>A certificate error means "maybe not the real server" — fix the cause, never disable verification.</li>
  <li>HTTPS hides path, headers and body, not the domain; it does not fix app bugs.</li>
  <li>Origin = scheme + host + port; pages may send cross-origin requests but not read answers without CORS.</li>
  <li>CORS does not block requests: the server still receives and executes them. Use authentication.</li>
  <li>Non-simple requests send an OPTIONS preflight first; credentials need an exact origin, never <code>*</code>.</li>
  <li>Best fix: one origin (proxy) or an explicit allow-list on the server.</li>
</ul>
${nguon('📗', 'MDN — Cross-Origin Resource Sharing (CORS)', 'Simple requests, preflight and credentials, with examples', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS')}
${nguon('📘', 'MDN — Transport Layer Security', 'What TLS protects and how certificates work', 'https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security')}
${lienKet({ khoa: 'api-design', bai: 'api-6-4-cors', title: 'API Design 6.4 — CORS for API designers', sub: 'Allow-lists, preflight caching and credentials in a production API', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>HTTPS bảo vệ đường truyền; CORS quyết định trang nào được đọc API của bạn</h2>
<p class="lead">Học xong bài này bạn đọc được một lần bắt tay TLS và một chứng chỉ bằng curl, nói chính xác HTTPS bảo vệ gì (và để lộ gì), xử lý lỗi chứng chỉ mà không tắt bảo mật, định nghĩa được origin, đọc thông báo lỗi CORS và sửa nó ở đúng phía, và giải thích hiểu lầm phổ biến nhất về CORS bằng bằng chứng: một request bị chặn vẫn tới máy chủ. Mọi app đã deploy đều cần HTTPS (Bài 14.3), và lần đầu front-end React gọi API Node ở cổng khác, bạn sẽ gặp CORS.</p>

<h3>Phần 1 — HTTPS</h3>
<h3>Bước 1 — HTTPS thêm gì cho HTTP</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Bí mật</span><span class="lz-t">không ai đọc được</span><span class="lz-d">Header Basic, cookie và JSON ở Bài 7.1–7.3 đi dưới dạng mã hoá. Trên Wi-Fi quán cà phê, người khác chỉ thấy nhiễu.</span></div>
<div class="lz-layer"><span class="lz-k">Toàn vẹn</span><span class="lz-t">không ai sửa được</span><span class="lz-d">Kẻ đứng giữa không chèn được quảng cáo hay script vào trang mà không bị phát hiện.</span></div>
<div class="lz-layer"><span class="lz-k">Xác thực</span><span class="lz-t">đúng là họ</span><span class="lz-d">Máy chủ chứng minh nó sở hữu tên miền bằng một chứng chỉ do tổ chức mà hệ thống bạn tin ký.</span></div>
</div>

<h3>Bước 2 — một lần bắt tay thật, nhìn qua curl</h3>
${ra(OUT['_t7/out/https-ok'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Client hello</span><span class="lz-d">curl đề nghị các phiên bản TLS, bộ mã và giao thức (<code>ALPN: h2,http/1.1</code>).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Server hello + chứng chỉ</span><span class="lz-d">Máy chủ chọn TLS 1.3 và HTTP/2 rồi gửi chứng chỉ: <code>CN=example.com</code>, do một tổ chức của Cloudflare cấp, hiệu lực 26/9 → 25/12/2026.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểm</span><span class="lz-d">curl kiểm chuỗi tổ chức cấp tới một gốc tin cậy, ngày hiệu lực, và tên khớp URL: <code>SSL certificate verify ok</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Thống nhất khoá</span><span class="lz-d">Hai bên suy ra khoá phiên. Chỉ lúc này byte HTTP đầu tiên mới đi — đã được mã hoá.</span></div>
</div>
<p>Chứng chỉ ngày nay sống ngắn (ở đây ba tháng) và miễn phí từ Let's Encrypt; nền tảng hosting tự gia hạn. Bài 14.3 deploy một app có chứng chỉ.</p>

<h3>Bước 3 — khi chứng chỉ sai</h3>
${ra(OUT['_t7/out/https-bad'])}
<p>badssl.com dựng sẵn các máy chủ hỏng có chủ đích để thử. curl từ chối cả hai với mã thoát 60, còn trình duyệt hiện cảnh báo toàn trang. Chứng chỉ là thứ duy nhất chứng minh bạn không nói chuyện với kẻ mạo danh — nên lỗi đó đang làm đúng việc.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "sửa" lỗi chứng chỉ bằng cách tắt kiểm tra.</strong> <code>curl -k</code>, <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code>, <code>rejectUnauthorized: false</code> hay bấm bỏ qua cảnh báo trình duyệt đều làm lỗi biến mất và để kết nối mở cho bất kỳ ai đứng giữa — đúng cuộc tấn công mà HTTPS sinh ra để ngăn. Chép lên production, chúng lặng lẽ tắt bảo mật cho mọi request. Hãy sửa nguyên nhân: gia hạn chứng chỉ, cài chứng chỉ trung gian còn thiếu, dùng đúng tên máy, hoặc khi phát triển cục bộ thì thêm chứng chỉ phát triển của riêng bạn (mkcert) vào kho tin cậy.</p></div>
<div class="kv-grid">
  <div class="kv"><span class="k">Vẫn thấy được dù có HTTPS</span><span class="v">Tên miền (trong lúc bắt tay), IP của bạn và của máy chủ, lúc nào và bao nhiêu dữ liệu. Đường dẫn, query, header và phần thân bị giấu.</span></div>
  <div class="kv"><span class="k">HTTPS không bảo vệ</span><span class="v">Lỗi trong app: XSS, SQL injection, IDOR, mật khẩu yếu. HTTPS bảo vệ đường ống, không bảo vệ thứ ở hai đầu.</span></div>
  <div class="kv"><span class="k">HSTS</span><span class="v"><code>Strict-Transport-Security: max-age=31536000</code> bảo trình duyệt luôn dùng HTTPS cho tên miền — không còn request HTTP thường đầu tiên để chặn bắt.</span></div>
  <div class="kv"><span class="k">Mixed content</span><span class="v">Trang HTTPS nạp script qua <code>http://</code> bị trình duyệt chặn; ảnh thì được nâng cấp hoặc bị cảnh báo.</span></div>
</div>

<h3>Phần 2 — CORS</h3>
<h3>Bước 4 — origin và chính sách cùng origin</h3>
<table>
<thead><tr><th>Trang</th><th>Request tới</th><th>Cùng origin?</th></tr></thead>
<tbody>
<tr><td><code>https://shop.example</code></td><td><code>https://shop.example/api/products</code></td><td>✅ cùng giao thức, host, cổng</td></tr>
<tr><td><code>https://shop.example</code></td><td><code>https://api.shop.example/products</code></td><td>❌ khác host (nhưng cùng <em>site</em> với cookie, Bài 7.2)</td></tr>
<tr><td><code>http://localhost:5173</code> (Vite)</td><td><code>http://localhost:3000/api</code> (Node)</td><td>❌ khác cổng — trường hợp kinh điển khi phát triển</td></tr>
<tr><td><code>https://shop.example</code></td><td><code>http://shop.example</code></td><td>❌ khác giao thức</td></tr>
</tbody>
</table>
<p><strong>Chính sách cùng origin</strong> của trình duyệt: JavaScript được gửi request tới origin khác, nhưng không được <em>đọc</em> response trừ khi origin đó đồng ý, bằng header <strong>CORS</strong> (Cross-Origin Resource Sharing). Nó bảo vệ người dùng: thiếu nó, website nào bạn ghé cũng đọc được hộp thư hay trang ngân hàng của bạn bằng cookie của bạn.</p>

<h3>Bước 5 — đo thật: bị chặn, vậy mà request vẫn tới</h3>
<p>Một trang ở <code>http://127.0.0.1:&lt;port&gt;</code> gọi một API ở <code>http://localhost:&lt;port&gt;</code> trong Chromium. Hàm xử lý của API và chuyện đã xảy ra:</p>
${ma('javascript', CODE['_t7/chay.mjs'], [93, 95])}
${ra(khoi('_t7/out/cors', 0, 1, 2))}
<p>Nhìn lại khối đầu: JavaScript nhận <code>TypeError: Failed to fetch</code>, console in lý do thật — nhưng <strong>máy chủ đã thấy GET và gửi đi danh sách lương</strong>. Trình duyệt nhận response rồi từ chối trao nó cho trang. CORS bảo vệ <em>dữ liệu người dùng khỏi trang khác</em>; nó không bảo vệ máy chủ của bạn khỏi request. curl, Postman, một script hay một máy chủ khác bỏ qua CORS hoàn toàn.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi CORS là kiểm soát truy cập.</strong> "Chỉ origin của front-end được phép, nên API là riêng tư" là sai: ai cũng gọi được nó bằng curl, và máy chủ trả lời. Xác thực và phân quyền (Bài 7.1–7.3) mới bảo vệ API. CORS chỉ quyết định <em>trang trình duyệt</em> nào được đọc câu trả lời. Một request đổi dữ liệu không có preflight (form POST đơn giản) còn được thực thi trước khi trình duyệt kiểm gì — đó là CSRF (Bài 7.2).</p></div>

<h3>Bước 6 — preflight</h3>
<p>Request "đơn giản" (GET, HEAD, hoặc POST với Content-Type kiểu form) đi thẳng. Mọi thứ khác — PUT, DELETE, PATCH, phần thân JSON, header <code>Authorization</code> — khiến trình duyệt hỏi trước bằng <code>OPTIONS</code>:</p>
${ma('javascript', CODE['_t7/chay.mjs'], [105, 111])}
${ra(khoi('_t7/out/cors', 3, 4))}
<p>Khi câu trả lời OPTIONS không cho phép gì, trình duyệt không bao giờ gửi PUT — máy chủ chỉ thấy OPTIONS. Khi nó cho phép <code>PUT</code> và header <code>Content-Type</code>, trình duyệt gửi request thật. <code>Access-Control-Max-Age: 600</code> cho trình duyệt dùng lại sự cho phép đó 10 phút thay vì hỏi mỗi lần.</p>

<h3>Bước 7 — cookie qua các origin</h3>
${ra(khoi('_t7/out/cors', 5, 6))}
<p>Với <code>credentials: 'include'</code> (gửi cookie), dấu sao <code>*</code> bị từ chối. Máy chủ phải ghi đúng origin và thêm <code>Access-Control-Allow-Credentials: true</code>; bản thân cookie cũng phải được phép đi khác site (luật SameSite, Bài 7.2).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dội lại mọi Origin kèm credentials.</strong> Để "cho CORS chạy", vài máy chủ chép <code>Origin</code> của request vào <code>Access-Control-Allow-Origin</code> và thêm <code>Allow-Credentials: true</code>. Như vậy là nói với trình duyệt: mọi website trên internet được đọc dữ liệu đăng nhập của người dùng này. Hãy giữ một danh sách cho phép rõ ràng (<code>['https://shop.example']</code>), so chính xác, và thêm <code>Vary: Origin</code> để bộ đệm không trộn câu trả lời.</p></div>
<div class="kv-grid">
  <div class="kv"><span class="k">Khi phát triển</span><span class="v">Dùng proxy của dev server (Vite <code>server.proxy</code>, rewrites của Next.js) để trang và API chung một origin — không cần CORS.</span></div>
  <div class="kv"><span class="k">Ở production</span><span class="v">Phục vụ cả hai từ một tên miền sau reverse proxy (nginx: <code>/api</code> → Node), hoặc cấu hình CORS trên API với danh sách cho phép.</span></div>
  <div class="kv"><span class="k">Không bao giờ</span><span class="v">"Sửa" CORS ở front-end, bằng tiện ích trình duyệt, hay bằng một CORS proxy công cộng. Header phải đến từ chính máy chủ bạn gọi.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (35 phút) — đọc chứng chỉ, gây lỗi CORS, sửa ở máy chủ</strong></p>
<ol>
<li>Chạy <code>curl -sv https://cuongthai.com -o /dev/null</code> (hoặc trang bất kỳ) và ghi lại: phiên bản TLS, phiên bản HTTP được thoả thuận, chủ thể chứng chỉ, tổ chức cấp, ngày hết hạn.</li>
<li>Mở một trang HTTPS bất kỳ, bấm vào ổ khoá và tìm cùng các thông tin chứng chỉ đó trong trình duyệt.</li>
<li>Chạy máy chủ Chương 6 ở cổng 3456. Mở <code>http://127.0.0.1:5500</code> (trang tĩnh bất kỳ, vd Live Server của VS Code) và chạy trong console của nó <code>fetch('http://localhost:3456/api/products').then(r =&gt; r.json())</code>. Đọc lỗi và log máy chủ.</li>
<li>Trong hàm <code>send</code> của máy chủ thêm <code>'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'</code> rồi thử lại. Sau đó thử một <code>PATCH</code> có phần thân JSON và xử lý <code>OPTIONS</code> với <code>Allow-Methods</code> và <code>Allow-Headers</code>.</li>
<li>Từ terminal, gọi cùng API bằng curl. CORS có chặn được curl không?</li>
</ol>
<p>Gợi ý: trong DevTools → Network, chọn "All" để thấy dòng OPTIONS cạnh PATCH.</p>
<p><strong>Xong khi:</strong> ghi chép chứng chỉ của bạn khớp hộp thoại ổ khoá; bước 3 hiện lỗi CORS trong khi log máy chủ có GET; sau bước 4 GET trả dữ liệu và thẻ Network hiện OPTIONS (204) rồi PATCH (200); và bạn trả lời bước 5 là "không — vì vậy API cần xác thực". Sau đó làm module Code Lab 7.5.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TLS / HTTPS</span><span class="v">lớp mã hoá / HTTP chạy bên trong TLS.</span></div>
  <div class="kv"><span class="k">certificate</span><span class="v">chứng chỉ — chứng minh máy chủ sở hữu tên miền.</span></div>
  <div class="kv"><span class="k">certificate authority (CA)</span><span class="v">tổ chức cấp chứng chỉ được hệ thống tin.</span></div>
  <div class="kv"><span class="k">handshake</span><span class="v">bắt tay — thoả thuận phiên bản, khoá, chứng chỉ.</span></div>
  <div class="kv"><span class="k">HSTS</span><span class="v">luôn dùng HTTPS cho tên miền này.</span></div>
  <div class="kv"><span class="k">origin</span><span class="v">giao thức + host + cổng.</span></div>
  <div class="kv"><span class="k">same-origin policy</span><span class="v">chính sách cùng origin — không đọc response khác origin.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">header cho phép origin khác đọc response.</span></div>
  <div class="kv"><span class="k">preflight</span><span class="v">request OPTIONS xin phép trước.</span></div>
  <div class="kv"><span class="k">credentials mode</span><span class="v">chế độ gửi kèm cookie/thông tin xác thực.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>HTTPS = HTTP bên trong TLS: bí mật, toàn vẹn và bằng chứng danh tính máy chủ.</li>
  <li>Lỗi chứng chỉ nghĩa là "có thể không phải máy chủ thật" — sửa nguyên nhân, đừng bao giờ tắt kiểm tra.</li>
  <li>HTTPS giấu đường dẫn, header và phần thân, không giấu tên miền; nó không sửa lỗi của app.</li>
  <li>Origin = giao thức + host + cổng; trang được gửi request khác origin nhưng không đọc được câu trả lời nếu thiếu CORS.</li>
  <li>CORS không chặn request: máy chủ vẫn nhận và thực thi. Hãy dùng xác thực.</li>
  <li>Request không đơn giản gửi preflight OPTIONS trước; credentials cần origin chính xác, không bao giờ <code>*</code>.</li>
  <li>Cách sửa tốt nhất: một origin (proxy) hoặc danh sách cho phép rõ ràng trên máy chủ.</li>
</ul>
${nguon('📗', 'MDN — Cross-Origin Resource Sharing (CORS)', 'Request đơn giản, preflight và credentials, có ví dụ', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS')}
${nguon('📘', 'MDN — Transport Layer Security', 'TLS bảo vệ gì và chứng chỉ hoạt động ra sao', 'https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security')}
${lienKet({ khoa: 'api-design', bai: 'api-6-4-cors', title: 'Thiết kế API 6.4 — CORS cho người thiết kế API', sub: 'Danh sách cho phép, bộ đệm preflight và credentials trong API production', cta: 'Mở bài' })}
</div>
`,
};
