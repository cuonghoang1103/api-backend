/**
 * Bài 6.3 — Mã trạng thái (nâng cấp 02/11/2026). Output thật: _demo/_t6/chay.sh (14 mã từ API Node _t6/server.mjs bằng curl),
 * _demo/_t6/chay.mjs (Chromium: fetch thấy gì với từng mã), _demo/6-3/thong-bao.html (đổi mã thành câu cho người dùng).
 * Deck: scripts/slides-src/wf-6-3.mjs (9 slide, WF/v1/wf-6-3). Code Lab: wf-6-3-status-codes.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';


const G = walkWf('wf-6-3', 'Status codes', 'Mã trạng thái', [
  [1, 'Status codes',
    '<p>Every response begins with a three-digit number. Programs decide what to do from that number alone: show the data, follow a redirect, ask the user to log in, or show an error. This lesson collects fourteen real codes from our API and shows what each one means in practice.</p>',
    '<p>Mọi response bắt đầu bằng một số ba chữ số. Chương trình quyết định làm gì chỉ từ con số đó: hiện dữ liệu, đi theo chuyển hướng, mời người dùng đăng nhập, hay báo lỗi. Bài này gom mười bốn mã thật từ API của ta và cho thấy từng mã có nghĩa gì trong thực tế.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will read any status code by its first digit, pick the right code when you build an API, tell apart the pairs that confuse everyone — 401 and 403, 400 and 422 — and turn any response into a clear message for the user, including the case where there is no response at all.</p>',
    '<p>Bạn sẽ đọc mọi mã trạng thái qua chữ số đầu, chọn đúng mã khi dựng API, phân biệt những cặp làm ai cũng nhầm — 401 và 403, 400 và 422 — và biến mọi response thành một câu rõ ràng cho người dùng, kể cả trường hợp không có response nào.</p>'],
  [3, 'Five families',
    '<p>The first digit is the family. Two means it worked. Three means look somewhere else. Four means the request was wrong, so sending it again unchanged will fail again. Five means the server failed, so the same request might work later. One is informational and rarely seen.</p>',
    '<p>Chữ số đầu là họ. Hai nghĩa là thành công. Ba nghĩa là tìm ở chỗ khác. Bốn nghĩa là request sai, nên gửi lại y nguyên sẽ lại hỏng. Năm nghĩa là máy chủ hỏng, nên cùng request có thể thành công lúc sau. Một là thông tin và hiếm gặp.</p>'],
  [4, 'Fourteen real codes',
    '<p>Each line is one curl request to our API, with only the status code printed. Success has three flavours: 200 with data, 201 for something created, 204 for success with nothing to return. Then a redirect, a not-modified, nine client errors and one server error.</p>',
    '<p>Mỗi dòng là một request curl tới API của ta, chỉ in mã trạng thái. Thành công có ba kiểu: 200 kèm dữ liệu, 201 khi tạo ra thứ mới, 204 khi thành công mà không có gì trả về. Rồi một chuyển hướng, một chưa thay đổi, chín lỗi phía client và một lỗi máy chủ.</p>'],
  [5, '401 or 403, 400 or 422',
    '<p>401 means "I do not know who you are": log in and try again. 403 means "I know who you are, and the answer is no": logging in again will not help. 400 means the request could not even be read, like broken JSON. 422 means it was read fine, but the values are not acceptable.</p>',
    '<p>401 nghĩa là "tôi không biết bạn là ai": đăng nhập rồi thử lại. 403 nghĩa là "tôi biết bạn là ai, và câu trả lời là không": đăng nhập lại cũng vô ích. 400 nghĩa là request không đọc nổi, như JSON hỏng. 422 nghĩa là đọc được, nhưng giá trị không chấp nhận được.</p>'],
  [6, 'The body explains the code',
    '<p>A good API sends a body with every error: which product was not found, which fields are invalid. A redirect sends a Location header with the new address. A 401 sends a WWW-Authenticate header saying how to log in. The code is for programs; the body is for the developer and the user.</p>',
    '<p>Một API tốt gửi phần thân kèm mọi lỗi: sản phẩm nào không thấy, trường nào không hợp lệ. Chuyển hướng gửi header Location với địa chỉ mới. 401 gửi header WWW-Authenticate nói cách đăng nhập. Mã dành cho chương trình; phần thân dành cho lập trình viên và người dùng.</p>'],
  [7, 'What fetch sees',
    '<p>In the browser, fetch followed the 301 silently and reported 200 with redirected set to true. Every 4xx and 5xx resolved normally with ok set to false. Only the request to a port where nothing was listening threw an error. So checking res.ok is your job.</p>',
    '<p>Trong trình duyệt, fetch lặng lẽ đi theo 301 và báo 200 với redirected là true. Mọi 4xx và 5xx đều resolve bình thường với ok là false. Chỉ request tới một cổng không có ai nghe mới ném lỗi. Nên việc kiểm res.ok là của bạn.</p>'],
  [8, 'One function for every outcome',
    '<p>This helper throws an HttpError carrying the status and the body whenever ok is false, and a second function turns any error into a sentence for the user. 404 becomes "we could not find that item"; no response at all becomes "you seem to be offline".</p>',
    '<p>Hàm phụ này ném một HttpError mang mã và phần thân mỗi khi ok là false, và hàm thứ hai biến mọi lỗi thành một câu cho người dùng. 404 thành "không tìm thấy món đó"; không có response nào thành "có vẻ bạn đang mất mạng".</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to trigger every code on the local API on purpose, then extend the message function to handle a 409 and a 503. "Done when" checks that each code appears exactly once in your log and that nothing shows "undefined" to the user.</p>',
    '<p>Bài luyện yêu cầu bạn cố ý gây ra từng mã trên API cục bộ, rồi mở rộng hàm thông báo để xử lý 409 và 503. "Xong khi" kiểm mỗi mã xuất hiện đúng một lần trong log và không có chỗ nào hiện "undefined" cho người dùng.</p>'],
]);

export default {
  title: '6.3 — Status codes: what the server replies|||6.3 — Mã trạng thái: máy chủ trả lời gì',
  slug: 'wf-6-3-status-codes',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/wJa5CTIFj7U', durationSeconds: 0 },
  description: 'Năm họ mã theo chữ số đầu; 14 mã thật từ API Node bằng curl (200 201 204 301 304 400 401 403 404 405 415 422 429 500) kèm phần thân/header giải thích; 401 vs 403, 400 vs 422 vs 415; Chromium thật: fetch theo 301 lặng lẽ, 4xx/5xx không ném, chỉ mất kết nối mới ném; hàm requestJson + HttpError đổi mã thành câu cho người dùng.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Three digits that decide what happens next</h2>
<p class="lead">After this lesson you can read any status code by its first digit, choose the right code when you write an API, tell apart the pairs that confuse most beginners (401/403, 400/422, 404/405), know exactly which responses make <code>fetch</code> throw, and write one function that turns any outcome into a clear message for the user. Your Express routes will send these numbers with <code>res.status(…)</code>, and your React components will decide what to show from them.</p>

<h3>Step 1 — the first digit is the family</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">1xx</span><span class="lz-t">Informational</span><span class="lz-d">"Keep going" messages during a request (e.g. 101 switching to WebSocket). You rarely handle them directly.</span></div>
<div class="lz-layer"><span class="lz-k">2xx</span><span class="lz-t">Success</span><span class="lz-d">It worked. 200 with data, 201 something was created, 204 success with no body.</span></div>
<div class="lz-layer"><span class="lz-k">3xx</span><span class="lz-t">Redirection</span><span class="lz-d">Look elsewhere (301, 302, 307, 308 + <code>Location</code>) or "your copy is still fresh" (304).</span></div>
<div class="lz-layer"><span class="lz-k">4xx</span><span class="lz-t">Client error</span><span class="lz-d">The request was wrong. Sending it again unchanged will fail again — fix the request.</span></div>
<div class="lz-layer"><span class="lz-k">5xx</span><span class="lz-t">Server error</span><span class="lz-d">The server failed. The same request may work later; the bug is on the server side.</span></div>
</div>
<p>Even an unknown code can be handled correctly by its first digit: a client that receives <code>418</code> or <code>451</code> for the first time still knows it is a client error.</p>

<h3>Step 2 — fourteen real codes from our API</h3>
<p>Each line below is a curl request to the Chapter 6 API (<code>curl -s -o /dev/null -w '%{http_code}' …</code> prints only the code):</p>
${ra(OUT['_t6/out/status-codes'])}
<table>
<thead><tr><th>Code</th><th>Name</th><th>When to send it</th></tr></thead>
<tbody>
<tr><td>200</td><td>OK</td><td>GET, PUT, PATCH succeeded and you return data</td></tr>
<tr><td>201</td><td>Created</td><td>POST created a resource; add <code>Location: /api/products/8</code></td></tr>
<tr><td>204</td><td>No Content</td><td>Success with nothing to return (typical for DELETE)</td></tr>
<tr><td>301 / 308</td><td>Moved Permanently / Permanent Redirect</td><td>The address changed for good (308 keeps the method and body)</td></tr>
<tr><td>302 / 307</td><td>Found / Temporary Redirect</td><td>Go elsewhere this time (e.g. after login)</td></tr>
<tr><td>304</td><td>Not Modified</td><td>The client's cached copy is still current (Lesson 6.4)</td></tr>
<tr><td>400</td><td>Bad Request</td><td>The request cannot be read: broken JSON, wrong types</td></tr>
<tr><td>401</td><td>Unauthorized</td><td>Not logged in, or the token expired</td></tr>
<tr><td>403</td><td>Forbidden</td><td>Logged in, but not allowed</td></tr>
<tr><td>404</td><td>Not Found</td><td>No resource at this address</td></tr>
<tr><td>405</td><td>Method Not Allowed</td><td>The address exists but not with this method (+ <code>Allow</code>)</td></tr>
<tr><td>409</td><td>Conflict</td><td>Clashes with current state: email already taken, edit on an outdated version</td></tr>
<tr><td>415</td><td>Unsupported Media Type</td><td>The body is in a format the server does not accept</td></tr>
<tr><td>422</td><td>Unprocessable Content</td><td>Readable, but the values break the rules</td></tr>
<tr><td>429</td><td>Too Many Requests</td><td>Rate limit hit (+ <code>Retry-After</code>)</td></tr>
<tr><td>500</td><td>Internal Server Error</td><td>An unexpected exception on the server</td></tr>
<tr><td>502 / 503 / 504</td><td>Bad Gateway / Unavailable / Gateway Timeout</td><td>A proxy could not reach the app, it is overloaded or restarting, or it took too long</td></tr>
</tbody>
</table>

<h3>Step 3 — the body and headers explain the code</h3>
${ra(OUT['_t6/out/status-bodies'])}
<p>The status says <em>what kind</em> of outcome; the body says <em>exactly what</em>. A 422 that lists both broken fields lets a form highlight them at once. The 301 carries the new address in <code>Location</code>. The 401 carries <code>WWW-Authenticate: Bearer</code>, the standard way to say "send a token".</p>

<h3>Step 4 — the pairs that confuse everyone</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">401 vs 403</span><span class="v">401 = "who are you?" — log in and retry. 403 = "I know you, and no" — logging in again changes nothing. Our API: no header → 401, a normal user's token → 403.</span></div>
  <div class="kv"><span class="k">400 vs 422</span><span class="v">400 = cannot read it (<code>{oops</code>). 422 = read it fine, values are invalid (<code>"price": -5</code>). Many APIs use 400 for both; be consistent within one API.</span></div>
  <div class="kv"><span class="k">415</span><span class="v">The body is not in a format the server accepts: curl's <code>-d</code> without a header sends <code>application/x-www-form-urlencoded</code>, not JSON.</span></div>
  <div class="kv"><span class="k">404 vs 405</span><span class="v">404 = nothing lives here. 405 = something lives here, but not that method.</span></div>
  <div class="kv"><span class="k">500 vs 503</span><span class="v">500 = a bug threw an exception. 503 = deliberately not serving right now (overloaded, maintenance) — often with <code>Retry-After</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — 200 with an error inside.</strong> <code>{ "ok": false, "error": "not found" }</code> sent with status 200 looks harmless and quietly breaks every tool that reads status codes: <code>res.ok</code> is true, so the front-end tries to render a product that does not exist; monitoring reports 100% success while users see failures; caches store the error as a valid answer; retry logic never retries. Send the real status, and put the explanation in the body.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — 500 for the user's mistakes, and stack traces in the body.</strong> If an invalid id makes your code throw and you return 500, every typo in a URL looks like an outage in your logs, and the user is told "server error" for their own mistake. Validate input first and return 4xx. And never put <code>err.stack</code> in the response: it shows file paths, library versions and sometimes SQL to anyone who asks. Log the details on the server; send a short message.</p></div>

<h3>Step 5 — what <code>fetch</code> sees (real Chromium)</h3>
<p>The same codes, requested with <code>fetch</code> from a page served by the API:</p>
${ra(OUT['_t6/out/fetch-status'])}
<ul>
<li><strong>Redirects are followed automatically.</strong> The 301 never reached our code: we got the final 200, <code>redirected: true</code> and the new <code>url</code>.</li>
<li><strong>4xx and 5xx do not throw.</strong> They are valid HTTP responses. The promise resolves and <code>res.ok</code> is <code>false</code> (ok means 200–299).</li>
<li><strong>Only "no response" throws</strong>: server down, wrong port, DNS failure, CORS blocked, offline. The error is a generic <code>TypeError: Failed to fetch</code> — the browser deliberately hides the reason.</li>
</ul>

<h3>Step 6 — one function for every outcome</h3>
<p>Put the checks in one place and every component gets them for free. <code>requestJson</code> throws an <code>HttpError</code> with the status and body when <code>ok</code> is false; <code>messageFor</code> turns any error into a sentence:</p>
${ma('html', CODE['6-3/thong-bao.html'])}
${ra(OUT['6-3/thong-bao'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">No response?</span><span class="lz-d">fetch rejected with TypeError → "check your connection", offer retry.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">2xx</span><span class="lz-d">Read the body (except 204) and use it.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">401</span><span class="lz-d">Send the user to log in (or refresh the token once, Chapter 7).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Other 4xx</span><span class="lz-d">Show the server's explanation; do not retry unchanged.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">429 / 5xx</span><span class="lz-d">Say "try again later"; retry automatically only idempotent requests, after a delay.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — collect every code on purpose</strong></p>
<ol>
<li>With the Chapter 6 server running, write the curl command that produces each of: 200, 201, 204, 301, 304, 400, 401, 403, 404, 405, 415, 422, 429, 500. Use <code>-o /dev/null -w '%{http_code}\n'</code>.</li>
<li>For 304 you need the ETag: first <code>curl -s -i …/api/products/1</code>, copy the <code>ETag</code>, then send it in <code>If-None-Match</code>.</li>
<li>Copy <code>thong-bao.html</code>, serve it next to a small <code>api/</code> folder (<code>npx serve</code> or VS Code Live Server), and add cases to <code>messageFor</code> for 409 ("That name is already taken") and 503 ("We are updating; try again in a minute").</li>
<li>Change the server so <code>GET /api/products/abc</code> returns 400 "id must be a number" instead of 404.</li>
</ol>
<p>Hint: the rate limit counts from server start; restart the server to reset it. In the server, <code>Number('abc')</code> is <code>NaN</code> — check with <code>Number.isInteger</code>.</p>
<p><strong>Done when:</strong> your list of 14 commands prints 14 different codes in order; your page shows a sentence (never "undefined") for 409 and 503; and <code>curl -s -i …/api/products/abc</code> shows <code>HTTP/1.1 400 Bad Request</code> with your message. Then Code Lab module 6.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">status code</span><span class="v">mã trạng thái — ba chữ số đầu response.</span></div>
  <div class="kv"><span class="k">reason phrase</span><span class="v">cụm lý do — chữ sau mã, chỉ cho người đọc.</span></div>
  <div class="kv"><span class="k">client error (4xx)</span><span class="v">lỗi phía client — request sai.</span></div>
  <div class="kv"><span class="k">server error (5xx)</span><span class="v">lỗi phía máy chủ — máy chủ hỏng.</span></div>
  <div class="kv"><span class="k">redirect</span><span class="v">chuyển hướng — đi tới địa chỉ trong Location.</span></div>
  <div class="kv"><span class="k">authentication vs authorization</span><span class="v">xác thực (bạn là ai — 401) và phân quyền (được làm gì — 403).</span></div>
  <div class="kv"><span class="k">validation error</span><span class="v">lỗi kiểm tra dữ liệu — thường 422 hoặc 400.</span></div>
  <div class="kv"><span class="k">rate limit</span><span class="v">giới hạn tần suất — 429 + Retry-After.</span></div>
  <div class="kv"><span class="k">res.ok</span><span class="v">true khi mã 200–299.</span></div>
  <div class="kv"><span class="k">network error</span><span class="v">lỗi mạng — không có response; fetch ném TypeError.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>First digit = family: 2 success, 3 look elsewhere, 4 your request is wrong, 5 the server failed.</li>
  <li>201 + <code>Location</code> after creating; 204 when there is nothing to return.</li>
  <li>401 = not logged in; 403 = logged in but not allowed. 400 = unreadable; 422 = invalid values.</li>
  <li>Always send the real status and explain in the body; never 200 with an error inside.</li>
  <li>Never 500 for user mistakes, never a stack trace in the response.</li>
  <li><code>fetch</code> follows redirects, does not throw on 4xx/5xx, and throws only when there is no response.</li>
  <li>Handle all outcomes in one helper (HttpError + messageFor) instead of in every component.</li>
</ul>
${nguon('📗', 'MDN — HTTP response status codes', 'Every code with its meaning and typical use', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status')}
${nguon('📘', 'RFC 9110 §15 — Status codes', 'The specification for each class and code', 'https://www.rfc-editor.org/rfc/rfc9110#name-status-codes')}
${lienKet({ khoa: 'api-design', bai: 'api-1-3-status', title: 'API Design 1.3 — Status codes that mean something', sub: '201, 400 vs 422, 401 vs 403, 404 vs 410 and 409, decided as a designer', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Ba chữ số quyết định chuyện gì xảy ra tiếp</h2>
<p class="lead">Học xong bài này bạn đọc được mọi mã trạng thái qua chữ số đầu, chọn đúng mã khi viết API, phân biệt những cặp làm phần lớn người mới nhầm (401/403, 400/422, 404/405), biết chính xác response nào làm <code>fetch</code> ném lỗi, và viết một hàm biến mọi kết quả thành một câu rõ ràng cho người dùng. Route Express của bạn sẽ gửi những con số này bằng <code>res.status(…)</code>, và component React sẽ quyết định hiện gì dựa vào chúng.</p>

<h3>Bước 1 — chữ số đầu là họ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">1xx</span><span class="lz-t">Thông tin</span><span class="lz-d">Thông điệp "cứ tiếp tục" giữa chừng (vd 101 chuyển sang WebSocket). Hiếm khi bạn xử lý trực tiếp.</span></div>
<div class="lz-layer"><span class="lz-k">2xx</span><span class="lz-t">Thành công</span><span class="lz-d">Chạy được. 200 kèm dữ liệu, 201 đã tạo ra thứ mới, 204 thành công không phần thân.</span></div>
<div class="lz-layer"><span class="lz-k">3xx</span><span class="lz-t">Chuyển hướng</span><span class="lz-d">Tìm ở chỗ khác (301, 302, 307, 308 + <code>Location</code>) hoặc "bản của bạn vẫn còn mới" (304).</span></div>
<div class="lz-layer"><span class="lz-k">4xx</span><span class="lz-t">Lỗi phía client</span><span class="lz-d">Request sai. Gửi lại y nguyên sẽ lại hỏng — sửa request.</span></div>
<div class="lz-layer"><span class="lz-k">5xx</span><span class="lz-t">Lỗi máy chủ</span><span class="lz-d">Máy chủ hỏng. Cùng request có thể thành công lúc sau; lỗi nằm phía máy chủ.</span></div>
</div>
<p>Cả mã chưa gặp bao giờ cũng xử lý đúng được nhờ chữ số đầu: client lần đầu nhận <code>418</code> hay <code>451</code> vẫn biết đó là lỗi phía client.</p>

<h3>Bước 2 — mười bốn mã thật từ API của ta</h3>
<p>Mỗi dòng dưới đây là một request curl tới API Chương 6 (<code>curl -s -o /dev/null -w '%{http_code}' …</code> chỉ in mã):</p>
${ra(OUT['_t6/out/status-codes'])}
<table>
<thead><tr><th>Mã</th><th>Tên</th><th>Khi nào gửi</th></tr></thead>
<tbody>
<tr><td>200</td><td>OK</td><td>GET, PUT, PATCH thành công và bạn trả dữ liệu</td></tr>
<tr><td>201</td><td>Created</td><td>POST đã tạo tài nguyên; thêm <code>Location: /api/products/8</code></td></tr>
<tr><td>204</td><td>No Content</td><td>Thành công mà không có gì trả (thường cho DELETE)</td></tr>
<tr><td>301 / 308</td><td>Moved Permanently / Permanent Redirect</td><td>Địa chỉ đổi hẳn (308 giữ nguyên method và phần thân)</td></tr>
<tr><td>302 / 307</td><td>Found / Temporary Redirect</td><td>Lần này đi chỗ khác (vd sau khi đăng nhập)</td></tr>
<tr><td>304</td><td>Not Modified</td><td>Bản lưu đệm của client vẫn còn đúng (Bài 6.4)</td></tr>
<tr><td>400</td><td>Bad Request</td><td>Không đọc nổi request: JSON hỏng, sai kiểu</td></tr>
<tr><td>401</td><td>Unauthorized</td><td>Chưa đăng nhập, hoặc token đã hết hạn</td></tr>
<tr><td>403</td><td>Forbidden</td><td>Đã đăng nhập, nhưng không được phép</td></tr>
<tr><td>404</td><td>Not Found</td><td>Không có tài nguyên ở địa chỉ này</td></tr>
<tr><td>405</td><td>Method Not Allowed</td><td>Địa chỉ có, nhưng không nhận method này (+ <code>Allow</code>)</td></tr>
<tr><td>409</td><td>Conflict</td><td>Xung đột với trạng thái hiện tại: email đã có người dùng, sửa trên phiên bản cũ</td></tr>
<tr><td>415</td><td>Unsupported Media Type</td><td>Phần thân ở định dạng máy chủ không nhận</td></tr>
<tr><td>422</td><td>Unprocessable Content</td><td>Đọc được, nhưng giá trị phạm luật</td></tr>
<tr><td>429</td><td>Too Many Requests</td><td>Chạm giới hạn tần suất (+ <code>Retry-After</code>)</td></tr>
<tr><td>500</td><td>Internal Server Error</td><td>Một ngoại lệ bất ngờ trên máy chủ</td></tr>
<tr><td>502 / 503 / 504</td><td>Bad Gateway / Unavailable / Gateway Timeout</td><td>Proxy không với tới app, app quá tải hoặc đang khởi động lại, hoặc quá lâu</td></tr>
</tbody>
</table>

<h3>Bước 3 — phần thân và header giải thích mã</h3>
${ra(OUT['_t6/out/status-bodies'])}
<p>Mã trạng thái nói <em>loại</em> kết quả; phần thân nói <em>chính xác điều gì</em>. Một 422 liệt kê cả hai trường hỏng cho phép form tô đỏ chúng cùng lúc. 301 mang địa chỉ mới trong <code>Location</code>. 401 mang <code>WWW-Authenticate: Bearer</code>, cách chuẩn để nói "hãy gửi token".</p>

<h3>Bước 4 — những cặp làm ai cũng nhầm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">401 và 403</span><span class="v">401 = "bạn là ai?" — đăng nhập rồi thử lại. 403 = "tôi biết bạn, và không" — đăng nhập lại chẳng đổi gì. API của ta: không có header → 401, token người dùng thường → 403.</span></div>
  <div class="kv"><span class="k">400 và 422</span><span class="v">400 = không đọc nổi (<code>{oops</code>). 422 = đọc được, giá trị sai (<code>"price": -5</code>). Nhiều API dùng 400 cho cả hai; trong một API hãy nhất quán.</span></div>
  <div class="kv"><span class="k">415</span><span class="v">Phần thân không ở định dạng máy chủ nhận: <code>-d</code> của curl không kèm header sẽ gửi <code>application/x-www-form-urlencoded</code>, không phải JSON.</span></div>
  <div class="kv"><span class="k">404 và 405</span><span class="v">404 = ở đây không có gì. 405 = ở đây có, nhưng không nhận method đó.</span></div>
  <div class="kv"><span class="k">500 và 503</span><span class="v">500 = một lỗi lập trình ném ngoại lệ. 503 = cố ý tạm không phục vụ (quá tải, bảo trì) — thường kèm <code>Retry-After</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — 200 mà bên trong là lỗi.</strong> <code>{ "ok": false, "error": "not found" }</code> gửi với mã 200 trông vô hại và lặng lẽ phá mọi công cụ đọc mã trạng thái: <code>res.ok</code> là true nên front-end cố hiển thị một sản phẩm không tồn tại; giám sát báo 100% thành công trong khi người dùng gặp lỗi; bộ đệm lưu lỗi như một câu trả lời hợp lệ; logic thử lại không bao giờ thử lại. Hãy gửi đúng mã, và giải thích trong phần thân.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — 500 cho lỗi của người dùng, và stack trace trong phần thân.</strong> Nếu một id không hợp lệ làm mã của bạn ném lỗi và bạn trả 500, mọi lỗi gõ URL trông như sự cố trong log, và người dùng bị báo "lỗi máy chủ" cho chính lỗi của họ. Hãy kiểm dữ liệu vào trước và trả 4xx. Và đừng bao giờ đưa <code>err.stack</code> vào response: nó lộ đường dẫn tệp, phiên bản thư viện và đôi khi cả SQL cho bất kỳ ai hỏi. Ghi chi tiết vào log trên máy chủ; gửi đi một câu ngắn.</p></div>

<h3>Bước 5 — <code>fetch</code> thấy gì (Chromium thật)</h3>
<p>Cùng các mã đó, gọi bằng <code>fetch</code> từ một trang do API phục vụ:</p>
${ra(OUT['_t6/out/fetch-status'])}
<ul>
<li><strong>Chuyển hướng được đi theo tự động.</strong> 301 không bao giờ tới mã của ta: ta nhận 200 cuối cùng, <code>redirected: true</code> và <code>url</code> mới.</li>
<li><strong>4xx và 5xx không ném lỗi.</strong> Chúng là response HTTP hợp lệ. Promise resolve và <code>res.ok</code> là <code>false</code> (ok nghĩa là 200–299).</li>
<li><strong>Chỉ "không có response" mới ném</strong>: máy chủ tắt, sai cổng, lỗi DNS, bị CORS chặn, mất mạng. Lỗi là <code>TypeError: Failed to fetch</code> chung chung — trình duyệt cố ý giấu lý do.</li>
</ul>

<h3>Bước 6 — một hàm cho mọi kết quả</h3>
<p>Đặt các phép kiểm vào một chỗ thì mọi component được hưởng miễn phí. <code>requestJson</code> ném một <code>HttpError</code> mang mã và phần thân khi <code>ok</code> là false; <code>messageFor</code> biến mọi lỗi thành một câu:</p>
${ma('html', CODE['6-3/thong-bao.html'])}
${ra(OUT['6-3/thong-bao'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Không có response?</span><span class="lz-d">fetch reject với TypeError → "kiểm tra kết nối", cho nút thử lại.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">2xx</span><span class="lz-d">Đọc phần thân (trừ 204) và dùng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">401</span><span class="lz-d">Đưa người dùng tới đăng nhập (hoặc làm mới token một lần, Chương 7).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">4xx khác</span><span class="lz-d">Hiện lời giải thích của máy chủ; đừng thử lại y nguyên.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">429 / 5xx</span><span class="lz-d">Nói "thử lại sau"; chỉ tự thử lại request idempotent, sau một khoảng chờ.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — cố ý gom đủ mọi mã</strong></p>
<ol>
<li>Với máy chủ Chương 6 đang chạy, viết lệnh curl tạo ra từng mã: 200, 201, 204, 301, 304, 400, 401, 403, 404, 405, 415, 422, 429, 500. Dùng <code>-o /dev/null -w '%{http_code}\n'</code>.</li>
<li>Với 304 bạn cần ETag: trước hết <code>curl -s -i …/api/products/1</code>, chép <code>ETag</code>, rồi gửi nó trong <code>If-None-Match</code>.</li>
<li>Chép <code>thong-bao.html</code>, phục vụ nó cạnh một thư mục <code>api/</code> nhỏ (<code>npx serve</code> hoặc Live Server của VS Code), và thêm vào <code>messageFor</code> trường hợp 409 ("Tên này đã có người dùng") và 503 ("Chúng tôi đang cập nhật; thử lại sau một phút").</li>
<li>Sửa máy chủ để <code>GET /api/products/abc</code> trả 400 "id must be a number" thay vì 404.</li>
</ol>
<p>Gợi ý: giới hạn tần suất đếm từ lúc máy chủ khởi động; khởi động lại để đặt lại. Trong máy chủ, <code>Number('abc')</code> là <code>NaN</code> — kiểm bằng <code>Number.isInteger</code>.</p>
<p><strong>Xong khi:</strong> danh sách 14 lệnh của bạn in ra 14 mã khác nhau theo thứ tự; trang của bạn hiện một câu (không bao giờ "undefined") cho 409 và 503; và <code>curl -s -i …/api/products/abc</code> hiện <code>HTTP/1.1 400 Bad Request</code> kèm câu của bạn. Sau đó làm module Code Lab 6.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">status code</span><span class="v">mã trạng thái — ba chữ số đầu response.</span></div>
  <div class="kv"><span class="k">reason phrase</span><span class="v">cụm lý do — chữ sau mã, chỉ cho người đọc.</span></div>
  <div class="kv"><span class="k">client error (4xx)</span><span class="v">lỗi phía client — request sai.</span></div>
  <div class="kv"><span class="k">server error (5xx)</span><span class="v">lỗi phía máy chủ — máy chủ hỏng.</span></div>
  <div class="kv"><span class="k">redirect</span><span class="v">chuyển hướng — đi tới địa chỉ trong Location.</span></div>
  <div class="kv"><span class="k">authentication vs authorization</span><span class="v">xác thực (bạn là ai — 401) và phân quyền (được làm gì — 403).</span></div>
  <div class="kv"><span class="k">validation error</span><span class="v">lỗi kiểm tra dữ liệu — thường 422 hoặc 400.</span></div>
  <div class="kv"><span class="k">rate limit</span><span class="v">giới hạn tần suất — 429 + Retry-After.</span></div>
  <div class="kv"><span class="k">res.ok</span><span class="v">true khi mã 200–299.</span></div>
  <div class="kv"><span class="k">network error</span><span class="v">lỗi mạng — không có response; fetch ném TypeError.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chữ số đầu = họ: 2 thành công, 3 tìm chỗ khác, 4 request của bạn sai, 5 máy chủ hỏng.</li>
  <li>201 + <code>Location</code> sau khi tạo; 204 khi không có gì trả.</li>
  <li>401 = chưa đăng nhập; 403 = đăng nhập rồi nhưng không được phép. 400 = không đọc nổi; 422 = giá trị sai.</li>
  <li>Luôn gửi đúng mã và giải thích trong phần thân; không bao giờ 200 mà bên trong là lỗi.</li>
  <li>Không bao giờ 500 cho lỗi của người dùng, không bao giờ stack trace trong response.</li>
  <li><code>fetch</code> đi theo chuyển hướng, không ném với 4xx/5xx, và chỉ ném khi không có response.</li>
  <li>Xử lý mọi kết quả trong một hàm phụ (HttpError + messageFor) thay vì trong từng component.</li>
</ul>
${nguon('📗', 'MDN — HTTP response status codes', 'Mọi mã với nghĩa và cách dùng thường gặp', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status')}
${nguon('📘', 'RFC 9110 §15 — Status codes', 'Đặc tả cho từng họ và từng mã', 'https://www.rfc-editor.org/rfc/rfc9110#name-status-codes')}
${lienKet({ khoa: 'api-design', bai: 'api-1-3-status', title: 'Thiết kế API 1.3 — Mã trạng thái có ý nghĩa', sub: '201, 400 và 422, 401 và 403, 404 và 410, 409 — quyết định từ phía người thiết kế', cta: 'Mở bài' })}
</div>
`,
};
