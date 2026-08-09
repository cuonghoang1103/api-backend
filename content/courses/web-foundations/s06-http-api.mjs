/**
 * Web Foundations — Chương 6: Luồng HTTP & API (chu trình request/response, method,
 * status code, headers, JSON, REST, query/params). Chương nền cho NODE.JS.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

export default {
  title: 'Chapter 6 — HTTP & APIs|||Chương 6 — HTTP & API',
  description: 'Mọi ứng dụng web là các máy tính trò chuyện qua HTTP: trình duyệt gửi một yêu cầu, server trả một phản hồi. Học chu trình request/response, các method (GET/POST/PUT/DELETE), mã trạng thái, headers, định dạng JSON, và cách một REST API tổ chức URL — đúng ngôn ngữ mà backend Node.js của bạn sẽ nói.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — The request/response cycle|||6.1 — Chu trình yêu cầu/phản hồi',
      slug: 'wf-6-1-request-response',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/iYM2zFP3Zn0', durationSeconds: 0 },
      description: 'Client và server, giải phẫu một URL, và cấu trúc của một yêu cầu và một phản hồi HTTP — mô hình chung cho mọi tương tác web.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Every web interaction is a request and a response</h2>
<p class="lead">You saw the client side of this with <code>fetch</code> in Chapter 5. Now the full picture: a <strong>client</strong> (browser, mobile app) sends an HTTP <strong>request</strong>; a <strong>server</strong> does some work and sends back a <strong>response</strong>. That one exchange — request in, response out — is the entire model of the web.</p>

<h3>Anatomy of a URL</h3>
<pre><code>https://api.cuongthai.com/v1/users/42?active=true
└─┬─┘   └──────┬────────┘└──┬──────┘└────┬────┘
scheme      host          path        query string</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">scheme</span><span class="v">https — the protocol (encrypted HTTP). See Chapter 7.</span></div>
  <div class="kv"><span class="k">host</span><span class="v">Which server to talk to (resolved to an IP via DNS, from Chapter 0).</span></div>
  <div class="kv"><span class="k">path</span><span class="v">Which resource on that server — here, user 42.</span></div>
  <div class="kv"><span class="k">query string</span><span class="v">Extra options after ? — here, active=true. More in Lesson 6.5.</span></div>
</div>

<h3>What a request actually contains</h3>
<pre><code>GET /v1/users/42 HTTP/1.1        ← method + path + version
Host: api.cuongthai.com          ← headers (metadata)
Accept: application/json
Authorization: Bearer eyJhbGc...

(optional body — data sent up, e.g. on POST)</code></pre>

<h3>What the response contains</h3>
<pre><code>HTTP/1.1 200 OK                  ← status code + text
Content-Type: application/json   ← headers
Content-Length: 61

{ "id": 42, "name": "Lan" }      ← body (the actual data)</code></pre>
<p>Both messages share the same shape: a first line, some <strong>headers</strong>, and an optional <strong>body</strong>. Learn this shape once and every request you ever debug makes sense.</p>

<h3>Stateless — each request stands alone</h3>
<p class="note-ct"><strong>HTTP is stateless:</strong> the server does not remember you between requests. Each request must carry everything needed to handle it (which is why that <code>Authorization</code> header rides along every time). Chapter 7 is entirely about how logins work on top of a protocol that forgets you instantly — cookies, sessions and tokens exist to solve exactly this.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Mọi tương tác web là một yêu cầu và một phản hồi</h2>
<p class="lead">Bạn đã thấy phía client của điều này với <code>fetch</code> ở Chương 5. Giờ là bức tranh đầy đủ: một <strong>client</strong> (trình duyệt, app di động) gửi một <strong>yêu cầu (request)</strong> HTTP; một <strong>server</strong> làm việc gì đó rồi gửi lại một <strong>phản hồi (response)</strong>. Cuộc trao đổi đó — yêu cầu vào, phản hồi ra — chính là toàn bộ mô hình của web.</p>

<h3>Giải phẫu một URL</h3>
<pre><code>https://api.cuongthai.com/v1/users/42?active=true
└─┬─┘   └──────┬────────┘└──┬──────┘└────┬────┘
scheme      host          path       query string</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">scheme</span><span class="v">https — giao thức (HTTP mã hoá). Xem Chương 7.</span></div>
  <div class="kv"><span class="k">host</span><span class="v">Nói chuyện với server nào (phân giải ra IP qua DNS, từ Chương 0).</span></div>
  <div class="kv"><span class="k">path</span><span class="v">Tài nguyên nào trên server đó — ở đây, user 42.</span></div>
  <div class="kv"><span class="k">query string</span><span class="v">Tuỳ chọn thêm sau dấu ? — ở đây, active=true. Kỹ hơn ở Bài 6.5.</span></div>
</div>

<h3>Một yêu cầu thật ra chứa gì</h3>
<pre><code>GET /v1/users/42 HTTP/1.1        ← method + path + phiên bản
Host: api.cuongthai.com          ← headers (siêu dữ liệu)
Accept: application/json
Authorization: Bearer eyJhbGc...

(body tuỳ chọn — dữ liệu gửi lên, vd khi POST)</code></pre>

<h3>Phản hồi chứa gì</h3>
<pre><code>HTTP/1.1 200 OK                  ← mã trạng thái + chữ
Content-Type: application/json   ← headers
Content-Length: 61

{ "id": 42, "name": "Lan" }      ← body (dữ liệu thật)</code></pre>
<p>Cả hai thông điệp cùng hình dạng: một dòng đầu, một số <strong>header</strong>, và một <strong>body</strong> tuỳ chọn. Học hình dạng này một lần thì mọi yêu cầu bạn từng gỡ lỗi đều trở nên dễ hiểu.</p>

<h3>Không trạng thái (stateless) — mỗi yêu cầu đứng một mình</h3>
<p class="note-ct"><strong>HTTP không lưu trạng thái:</strong> server không nhớ bạn giữa các yêu cầu. Mỗi yêu cầu phải mang theo mọi thứ cần để xử lý nó (vì thế cái header <code>Authorization</code> đi kèm mỗi lần). Chương 7 hoàn toàn nói về cách đăng nhập vận hành trên một giao thức quên bạn ngay lập tức — cookie, session và token tồn tại để giải đúng bài toán này.</p>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — HTTP methods: the verbs of the web|||6.2 — HTTP method: các động từ của web',
      slug: 'wf-6-2-http-methods',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/7YcW25PHnAA', durationSeconds: 0 },
      description: 'GET, POST, PUT, PATCH, DELETE — mỗi method nói một ý định khác nhau; khái niệm "an toàn" và "bất biến" (idempotent) và vì sao chúng quan trọng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The method says what you intend to do</h2>
<p class="lead">Every request carries a <strong>method</strong> (also called a verb) that states its intent: am I reading data, creating it, changing it, or deleting it? Same URL, different method, different action. This convention is the backbone of every API you will build.</p>

<h3>The five you will use</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GET</span><span class="v">Read data. Should never change anything on the server.</span></div>
  <div class="kv"><span class="k">POST</span><span class="v">Create a new thing (submit a form, add a user).</span></div>
  <div class="kv"><span class="k">PUT</span><span class="v">Replace an existing thing entirely.</span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">Update part of an existing thing.</span></div>
  <div class="kv"><span class="k">DELETE</span><span class="v">Remove a thing.</span></div>
</div>

<h3>Same resource, method decides the action</h3>
<pre><code>GET    /users        → list all users
POST   /users        → create a new user (data in the body)
GET    /users/42     → read user 42
PUT    /users/42     → replace user 42
PATCH  /users/42     → update part of user 42 (e.g. just the email)
DELETE /users/42     → delete user 42</code></pre>
<p>Notice the URL names the <em>thing</em> (a user), and the method names the <em>action</em>. That clean split is what makes REST APIs (Lesson 6.5) predictable.</p>

<h3>Two properties worth knowing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Safe</span><span class="v">Does not change server state. GET is safe — reading a page never edits data.</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Doing it twice has the same effect as once. GET, PUT and DELETE are idempotent; POST is not.</span></div>
</div>
<p class="pitfall"><strong>Never do something destructive on a GET.</strong> A link like <code>GET /users/42/delete</code> is a real bug: browsers, crawlers and prefetchers fire GETs freely, so a bot could delete your data just by visiting links. Destructive actions must use POST/PUT/PATCH/DELETE, never GET. This is a genuine security principle, not just style.</p>

<p class="note-ct"><strong>Why POST is not idempotent:</strong> submitting a "create order" form twice makes two orders — which is exactly why double-clicking a checkout button is dangerous and apps disable it after the first click. Understanding idempotency tells you which actions are safe to retry after a flaky network.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Method nói bạn định làm gì</h2>
<p class="lead">Mỗi yêu cầu mang một <strong>method</strong> (còn gọi là động từ) nêu ý định: tôi đang đọc dữ liệu, tạo mới, sửa, hay xoá? Cùng một URL, khác method, khác hành động. Quy ước này là xương sống của mọi API bạn sẽ dựng.</p>

<h3>Năm cái bạn sẽ dùng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GET</span><span class="v">Đọc dữ liệu. Không bao giờ nên thay đổi gì trên server.</span></div>
  <div class="kv"><span class="k">POST</span><span class="v">Tạo một thứ mới (gửi form, thêm một user).</span></div>
  <div class="kv"><span class="k">PUT</span><span class="v">Thay thế hoàn toàn một thứ đang có.</span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">Cập nhật một phần của một thứ đang có.</span></div>
  <div class="kv"><span class="k">DELETE</span><span class="v">Xoá một thứ.</span></div>
</div>

<h3>Cùng tài nguyên, method quyết định hành động</h3>
<pre><code>GET    /users        → liệt kê tất cả user
POST   /users        → tạo một user mới (dữ liệu trong body)
GET    /users/42     → đọc user 42
PUT    /users/42     → thay thế user 42
PATCH  /users/42     → cập nhật một phần user 42 (vd chỉ email)
DELETE /users/42     → xoá user 42</code></pre>
<p>Để ý URL đặt tên cho <em>thứ</em> (một user), còn method đặt tên cho <em>hành động</em>. Sự tách bạch gọn gàng đó khiến REST API (Bài 6.5) dễ đoán.</p>

<h3>Hai tính chất đáng biết</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">An toàn (safe)</span><span class="v">Không thay đổi trạng thái server. GET an toàn — đọc một trang không bao giờ sửa dữ liệu.</span></div>
  <div class="kv"><span class="k">Bất biến (idempotent)</span><span class="v">Làm hai lần cho kết quả như một lần. GET, PUT và DELETE là idempotent; POST thì không.</span></div>
</div>
<p class="pitfall"><strong>Đừng bao giờ làm việc phá huỷ trên một GET.</strong> Một liên kết như <code>GET /users/42/delete</code> là một lỗi thật: trình duyệt, bọ thu thập và bộ tải trước bắn GET thoải mái, nên một con bot có thể xoá dữ liệu của bạn chỉ bằng việc ghé các liên kết. Hành động phá huỷ phải dùng POST/PUT/PATCH/DELETE, không bao giờ GET. Đây là một nguyên tắc bảo mật thật, không chỉ là phong cách.</p>

<p class="note-ct"><strong>Vì sao POST không idempotent:</strong> gửi form "tạo đơn hàng" hai lần tạo hai đơn — đúng là lý do bấm đúp nút thanh toán rất nguy và app khoá nút sau cú bấm đầu. Hiểu idempotency cho bạn biết hành động nào an toàn để thử lại sau một mạng chập chờn.</p>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Status codes: what the server replies|||6.3 — Mã trạng thái: server trả lời gì',
      slug: 'wf-6-3-status-codes',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/wJa5CTIFj7U', durationSeconds: 0 },
      description: 'Các nhóm 2xx/3xx/4xx/5xx và những mã hay gặp (200, 201, 301, 400, 401, 403, 404, 500) — cách đọc kết quả một yêu cầu chỉ bằng con số.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>A three-digit number tells you how the request went</h2>
<p class="lead">Every response starts with a <strong>status code</strong>. The first digit is the category, so you can tell at a glance whether things worked, need a redirect, were your fault, or were the server's fault. Reading these fluently is half of API debugging.</p>

<h3>The five families — learn the first digit first</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1xx</span><span class="v">Informational. Rare; you can mostly ignore these.</span></div>
  <div class="kv"><span class="k">2xx</span><span class="v">Success. It worked.</span></div>
  <div class="kv"><span class="k">3xx</span><span class="v">Redirection. Go look somewhere else.</span></div>
  <div class="kv"><span class="k">4xx</span><span class="v">Client error. YOUR request was wrong.</span></div>
  <div class="kv"><span class="k">5xx</span><span class="v">Server error. The server broke.</span></div>
</div>

<h3>The specific codes you will meet daily</h3>
<pre><code>200 OK                    ← success (GET/PUT/PATCH)
201 Created               ← success, a new thing was made (POST)
204 No Content            ← success, nothing to send back (DELETE)
301 Moved Permanently     ← this URL has a new home
400 Bad Request           ← malformed input (missing/invalid fields)
401 Unauthorized          ← you are not logged in / no valid token
403 Forbidden             ← logged in, but not allowed to do this
404 Not Found             ← no such resource
409 Conflict              ← clashes with current state (e.g. email taken)
500 Internal Server Error ← the server threw an exception</code></pre>

<h3>401 vs 403 — a distinction that trips people up</h3>
<p class="pitfall"><strong>401 means "who are you?"; 403 means "I know who you are, and no."</strong> A <code>401</code> says you are not authenticated — log in and try again. A <code>403</code> says you are authenticated but lack permission — logging in again will not help. Returning the wrong one confuses users and other developers, so pick deliberately.</p>

<p class="note-ct"><strong>These are the numbers your Node.js routes will send.</strong> When you build an Express API, you will write <code>res.status(201)</code> after creating something and <code>res.status(404)</code> when a lookup fails. Knowing the vocabulary now means your future API speaks correctly to every client — and the <code>deploy.sh</code> smoke-test in this very project distinguishes 401 (mounted, needs auth) from 404 (route missing) using exactly this scheme.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Một con số ba chữ số cho biết yêu cầu đi đến đâu</h2>
<p class="lead">Mọi phản hồi bắt đầu bằng một <strong>mã trạng thái (status code)</strong>. Chữ số đầu là nhóm, nên bạn liếc là biết mọi thứ chạy được, cần chuyển hướng, do lỗi của bạn, hay do lỗi của server. Đọc thành thạo những cái này là một nửa của việc gỡ lỗi API.</p>

<h3>Năm họ — học chữ số đầu trước</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1xx</span><span class="v">Thông tin. Hiếm; bạn phần lớn có thể bỏ qua.</span></div>
  <div class="kv"><span class="k">2xx</span><span class="v">Thành công. Nó chạy được.</span></div>
  <div class="kv"><span class="k">3xx</span><span class="v">Chuyển hướng. Đi tìm ở chỗ khác.</span></div>
  <div class="kv"><span class="k">4xx</span><span class="v">Lỗi client. Yêu cầu CỦA BẠN sai.</span></div>
  <div class="kv"><span class="k">5xx</span><span class="v">Lỗi server. Server hỏng.</span></div>
</div>

<h3>Các mã cụ thể bạn gặp hằng ngày</h3>
<pre><code>200 OK                    ← thành công (GET/PUT/PATCH)
201 Created               ← thành công, một thứ mới đã được tạo (POST)
204 No Content            ← thành công, không có gì để gửi lại (DELETE)
301 Moved Permanently     ← URL này có nhà mới
400 Bad Request           ← đầu vào sai định dạng (thiếu/không hợp lệ)
401 Unauthorized          ← bạn chưa đăng nhập / không có token hợp lệ
403 Forbidden             ← đã đăng nhập, nhưng không được phép làm việc này
404 Not Found             ← không có tài nguyên như vậy
409 Conflict              ← đụng với trạng thái hiện tại (vd email đã bị lấy)
500 Internal Server Error ← server ném một ngoại lệ</code></pre>

<h3>401 vs 403 — một phân biệt hay làm người ta vấp</h3>
<p class="pitfall"><strong>401 nghĩa là "bạn là ai?"; 403 nghĩa là "tôi biết bạn là ai, và không".</strong> Một <code>401</code> nói bạn chưa xác thực — hãy đăng nhập rồi thử lại. Một <code>403</code> nói bạn đã xác thực nhưng thiếu quyền — đăng nhập lại cũng vô ích. Trả sai một trong hai gây rối cho người dùng và lập trình viên khác, nên hãy chọn có chủ đích.</p>

<p class="note-ct"><strong>Đây là những con số mà route Node.js của bạn sẽ gửi.</strong> Khi dựng một API Express, bạn sẽ viết <code>res.status(201)</code> sau khi tạo một thứ và <code>res.status(404)</code> khi một tra cứu thất bại. Biết vốn từ này bây giờ nghĩa là API tương lai của bạn nói đúng với mọi client — và bộ smoke-test <code>deploy.sh</code> trong chính dự án này phân biệt 401 (đã gắn, cần auth) với 404 (route thiếu) đúng theo hệ này.</p>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Headers, JSON and the message body|||6.4 — Headers, JSON và phần thân thông điệp',
      slug: 'wf-6-4-headers-json',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/iiADhChRriM', durationSeconds: 0 },
      description: 'Headers hay gặp (Content-Type, Authorization), cú pháp JSON, và JSON.stringify/JSON.parse — cách dữ liệu được gắn nhãn và đóng gói giữa client và server.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Headers describe the message; the body carries the data</h2>
<p class="lead">A request or response is metadata plus payload. <strong>Headers</strong> are labelled facts about the message ("this body is JSON", "here is my token"); the <strong>body</strong> is the actual content. For modern APIs that content is almost always JSON.</p>

<h3>Headers you will meet constantly</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Content-Type</span><span class="v">What format the body is: application/json, text/html, image/png.</span></div>
  <div class="kv"><span class="k">Authorization</span><span class="v">Proof of who you are, usually Bearer &lt;token&gt; (Chapter 7).</span></div>
  <div class="kv"><span class="k">Accept</span><span class="v">What format the client wants back.</span></div>
  <div class="kv"><span class="k">Cache-Control</span><span class="v">How long a response may be reused before asking again.</span></div>
</div>

<h3>JSON — the language APIs speak</h3>
<p><strong>JSON</strong> (JavaScript Object Notation) is a plain-text format for structured data. It looks like a JavaScript object, with strict rules: keys in double quotes, no trailing commas, no comments.</p>
<pre><code>{
  "id": 42,
  "name": "Lan",
  "isAdmin": false,
  "roles": ["editor", "author"],
  "profile": { "city": "Hanoi" }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Values allowed</span><span class="v">string, number, boolean, null, array, object — that is all.</span></div>
  <div class="kv"><span class="k">Keys</span><span class="v">Always double-quoted strings. Single quotes are invalid JSON.</span></div>
  <div class="kv"><span class="k">No functions/dates</span><span class="v">JSON stores data only. Dates travel as strings.</span></div>
</div>

<h3>Crossing the wire: stringify and parse</h3>
<p>Objects live in memory, but only text can travel over HTTP. Two functions bridge the gap:</p>
<pre><code>const user = { name: "Lan", age: 25 };

const text = JSON.stringify(user);   // object → JSON text (to send)
// '{"name":"Lan","age":25}'

const back = JSON.parse(text);       // JSON text → object (on receive)
back.name;                           // "Lan"</code></pre>
<p>You met these in Chapter 5: <code>JSON.stringify</code> for the <code>fetch</code> body, and <code>response.json()</code> which parses for you.</p>
<p class="note-ct"><strong>A 400 Bad Request is often malformed JSON.</strong> A trailing comma, a single quote, or a missing bracket makes <code>JSON.parse</code> throw — and a server rejects it with 400. When an API call fails mysteriously, print the exact body you sent and check it is valid JSON first. It is the single most common beginner API bug.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON" target="_blank" rel="noopener">MDN — Working with JSON</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Headers mô tả thông điệp; body mang dữ liệu</h2>
<p class="lead">Một yêu cầu hay phản hồi là siêu dữ liệu cộng với tải trọng. <strong>Headers</strong> là những sự thật có nhãn về thông điệp ("body này là JSON", "đây là token của tôi"); <strong>body</strong> là nội dung thật. Với API hiện đại, nội dung đó gần như luôn là JSON.</p>

<h3>Các header bạn gặp liên tục</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Content-Type</span><span class="v">Body ở định dạng gì: application/json, text/html, image/png.</span></div>
  <div class="kv"><span class="k">Authorization</span><span class="v">Bằng chứng bạn là ai, thường là Bearer &lt;token&gt; (Chương 7).</span></div>
  <div class="kv"><span class="k">Accept</span><span class="v">Client muốn nhận lại định dạng gì.</span></div>
  <div class="kv"><span class="k">Cache-Control</span><span class="v">Một phản hồi được tái dùng bao lâu trước khi hỏi lại.</span></div>
</div>

<h3>JSON — ngôn ngữ mà API nói</h3>
<p><strong>JSON</strong> (JavaScript Object Notation) là một định dạng văn bản thuần cho dữ liệu có cấu trúc. Nó trông giống một đối tượng JavaScript, với luật nghiêm ngặt: khoá trong dấu nháy kép, không dấu phẩy thừa, không chú thích.</p>
<pre><code>{
  "id": 42,
  "name": "Lan",
  "isAdmin": false,
  "roles": ["editor", "author"],
  "profile": { "city": "Hanoi" }
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Giá trị được phép</span><span class="v">string, number, boolean, null, array, object — chỉ vậy.</span></div>
  <div class="kv"><span class="k">Khoá</span><span class="v">Luôn là chuỗi trong nháy kép. Nháy đơn là JSON không hợp lệ.</span></div>
  <div class="kv"><span class="k">Không hàm/ngày</span><span class="v">JSON chỉ lưu dữ liệu. Ngày tháng đi dưới dạng chuỗi.</span></div>
</div>

<h3>Băng qua đường dây: stringify và parse</h3>
<p>Đối tượng sống trong bộ nhớ, nhưng chỉ chữ mới đi qua HTTP được. Hai hàm bắc cầu:</p>
<pre><code>const user = { name: "Lan", age: 25 };

const text = JSON.stringify(user);   // đối tượng → chữ JSON (để gửi)
// '{"name":"Lan","age":25}'

const back = JSON.parse(text);       // chữ JSON → đối tượng (khi nhận)
back.name;                           // "Lan"</code></pre>
<p>Bạn đã gặp chúng ở Chương 5: <code>JSON.stringify</code> cho body của <code>fetch</code>, và <code>response.json()</code> tự phân tích giúp bạn.</p>
<p class="note-ct"><strong>Một 400 Bad Request thường là JSON sai định dạng.</strong> Một dấu phẩy thừa, một nháy đơn, hay một ngoặc thiếu khiến <code>JSON.parse</code> ném lỗi — và server từ chối với 400. Khi một lời gọi API hỏng bí ẩn, hãy in đúng body bạn đã gửi và kiểm nó có phải JSON hợp lệ trước. Đây là lỗi API phổ biến nhất của người mới.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON" target="_blank" rel="noopener">MDN — Làm việc với JSON</a></div>
</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — REST APIs, route params and query strings|||6.5 — REST API, tham số route và query string',
      slug: 'wf-6-5-rest-params-query',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/-MTSQjw5DrM', durationSeconds: 0 },
      description: 'REST như một cách đặt tên tài nguyên, tham số đường dẫn (/users/:id) vs query string (?page=2&sort=name), và vì sao đặt tên nhất quán khiến API dễ đoán.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>REST is a convention for naming things and acting on them</h2>
<p class="lead"><strong>REST</strong> is not a technology — it is a widely-agreed style for designing APIs. The core idea: model everything as <strong>resources</strong> (nouns) at clean URLs, and use HTTP methods (verbs) to act on them. Follow it and other developers can guess your API without reading docs.</p>

<h3>Resources are nouns; methods are verbs</h3>
<pre><code>GET    /posts          → all posts
POST   /posts          → create a post
GET    /posts/17       → one post
PATCH  /posts/17       → edit that post
DELETE /posts/17       → delete it
GET    /posts/17/comments   → comments belonging to post 17</code></pre>
<p>URLs name resources (plural nouns), never actions. <code>/getPosts</code> or <code>/deletePost?id=17</code> is <em>not</em> RESTful — the method already carries the verb.</p>

<h3>Route (path) parameters — identify one specific thing</h3>
<pre><code>GET /users/42        → the ":id" part is a path parameter = 42
GET /users/42/posts/9

// In Express (Node.js), you will write the route as:
//   app.get("/users/:id", ...)     and read req.params.id</code></pre>
<p>A path parameter is part of the address of a specific resource — which user, which post.</p>

<h3>Query strings — options that refine a request</h3>
<pre><code>GET /posts?page=2&amp;limit=10&amp;sort=newest&amp;tag=javascript
              └── key=value pairs after ?, joined by &amp; ──┘</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Path param</span><span class="v">Identifies WHICH resource: /posts/17. Part of the resource's identity.</span></div>
  <div class="kv"><span class="k">Query string</span><span class="v">Refines a request: filtering, sorting, pagination, search. Optional extras.</span></div>
</div>
<p>Rule of thumb: if removing it points at a different <em>thing</em>, it is a path param; if it just filters or sorts the same collection, it is a query parameter.</p>

<h3>The whole chapter, in one call</h3>
<pre><code>POST /posts                        ← method + resource
Content-Type: application/json     ← header
Authorization: Bearer &lt;token&gt;      ← header

{ "title": "Hello", "body": "..." } ← JSON body

──────────────── server replies ────────────────
201 Created                        ← status code
Content-Type: application/json
{ "id": 51, "title": "Hello" }     ← JSON body</code></pre>
<p class="note-ct"><strong>You can now read any API.</strong> Method, path, headers, body, status — every request you will ever send or build is these pieces. This is precisely the shape of the Node.js/Express routes you will write next: <code>router.post("/posts", ...)</code> reading <code>req.body</code>, <code>req.params</code>, <code>req.query</code> and replying with <code>res.status(201).json(...)</code>. Chapter 7 adds the missing piece: how the server knows who is making the request.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>REST là một quy ước để đặt tên các thứ và hành động lên chúng</h2>
<p class="lead"><strong>REST</strong> không phải một công nghệ — nó là một phong cách được đồng thuận rộng rãi để thiết kế API. Ý cốt lõi: mô hình hoá mọi thứ thành <strong>tài nguyên (resource)</strong> (danh từ) tại các URL gọn gàng, và dùng method HTTP (động từ) để hành động lên chúng. Theo nó thì lập trình viên khác đoán được API của bạn mà không cần đọc tài liệu.</p>

<h3>Tài nguyên là danh từ; method là động từ</h3>
<pre><code>GET    /posts          → tất cả bài viết
POST   /posts          → tạo một bài viết
GET    /posts/17       → một bài viết
PATCH  /posts/17       → sửa bài viết đó
DELETE /posts/17       → xoá nó
GET    /posts/17/comments   → các bình luận thuộc bài viết 17</code></pre>
<p>URL đặt tên tài nguyên (danh từ số nhiều), không bao giờ đặt tên hành động. <code>/getPosts</code> hay <code>/deletePost?id=17</code> <em>không</em> phải RESTful — method đã mang động từ rồi.</p>

<h3>Tham số route (đường dẫn) — chỉ đích một thứ cụ thể</h3>
<pre><code>GET /users/42        → phần ":id" là một tham số đường dẫn = 42
GET /users/42/posts/9

// Trong Express (Node.js), bạn sẽ viết route là:
//   app.get("/users/:id", ...)     rồi đọc req.params.id</code></pre>
<p>Một tham số đường dẫn là một phần của địa chỉ một tài nguyên cụ thể — user nào, bài viết nào.</p>

<h3>Query string — tuỳ chọn tinh chỉnh một yêu cầu</h3>
<pre><code>GET /posts?page=2&amp;limit=10&amp;sort=newest&amp;tag=javascript
              └── các cặp khoá=giá_trị sau ?, nối bằng &amp; ──┘</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tham số đường dẫn</span><span class="v">Chỉ định TÀI NGUYÊN NÀO: /posts/17. Một phần danh tính của tài nguyên.</span></div>
  <div class="kv"><span class="k">Query string</span><span class="v">Tinh chỉnh một yêu cầu: lọc, sắp xếp, phân trang, tìm kiếm. Tuỳ chọn thêm.</span></div>
</div>
<p>Quy tắc bỏ túi: nếu bỏ nó đi thì trỏ tới một <em>thứ</em> khác, đó là tham số đường dẫn; nếu nó chỉ lọc hay sắp xếp cùng một tập, đó là tham số query.</p>

<h3>Cả chương, trong một lời gọi</h3>
<pre><code>POST /posts                        ← method + tài nguyên
Content-Type: application/json     ← header
Authorization: Bearer &lt;token&gt;      ← header

{ "title": "Hello", "body": "..." } ← body JSON

──────────────── server trả lời ────────────────
201 Created                        ← mã trạng thái
Content-Type: application/json
{ "id": 51, "title": "Hello" }     ← body JSON</code></pre>
<p class="note-ct"><strong>Giờ bạn đọc được bất kỳ API nào.</strong> Method, path, headers, body, status — mọi yêu cầu bạn từng gửi hay dựng đều là những mảnh này. Đây đúng là hình dạng các route Node.js/Express bạn sẽ viết kế tiếp: <code>router.post("/posts", ...)</code> đọc <code>req.body</code>, <code>req.params</code>, <code>req.query</code> và trả lời bằng <code>res.status(201).json(...)</code>. Chương 7 thêm mảnh còn thiếu: làm sao server biết ai đang gửi yêu cầu.</p>
</div>
`,
    },

    /* ─────────────────────────── 6.6 quiz ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra chương 6',
      slug: 'wf-6-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về chu trình request/response, method, mã trạng thái, headers/JSON, REST và tham số route/query.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 6: the request/response cycle, HTTP methods, status codes, headers and JSON, and REST with route params vs query strings.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> The best way to internalise HTTP is to build a real API. On Code Lab, implement routes, methods, status codes and JSON responses on the Node.js (Express) track.</p>
<div class="link-card"><a href="/code-lab/nodejs-express">Practice on Code Lab → Node.js (Express) track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 6: chu trình request/response, method HTTP, mã trạng thái, headers và JSON, và REST với tham số route vs query string.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Cách tốt nhất để thấm HTTP là tự dựng một API thật. Trên Code Lab, hãy hiện thực các route, method, mã trạng thái và phản hồi JSON ở track Node.js (Express).</p>
<div class="link-card"><a href="/code-lab/nodejs-express">Luyện tập ở Code Lab → track Node.js (Express)</a></div></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which HTTP method should you use to READ data without changing anything?|||Method HTTP nào nên dùng để ĐỌC dữ liệu mà không thay đổi gì?',
            options: [
              'GET|||GET',
              'POST|||POST',
              'DELETE|||DELETE',
              'PUT|||PUT',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You submit a form to create a new account. Which method fits?|||Bạn gửi một form để tạo một tài khoản mới. Method nào hợp?',
            options: [
              'POST|||POST',
              'GET|||GET',
              'DELETE|||DELETE',
              'HEAD|||HEAD',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does a 404 status code mean?|||Mã trạng thái 404 nghĩa là gì?',
            options: [
              'Not Found — no such resource|||Not Found — không có tài nguyên như vậy',
              'Success|||Thành công',
              'The server crashed|||Server sập',
              'You must log in|||Bạn phải đăng nhập',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which status code family means the SERVER failed?|||Nhóm mã trạng thái nào nghĩa là SERVER thất bại?',
            options: [
              '5xx|||5xx',
              '2xx|||2xx',
              '3xx|||3xx',
              '4xx|||4xx',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between 401 and 403?|||Khác biệt giữa 401 và 403 là gì?',
            options: [
              '401 = not authenticated (log in); 403 = authenticated but not allowed|||401 = chưa xác thực (đăng nhập); 403 = đã xác thực nhưng không được phép',
              'They are identical|||Chúng y hệt nhau',
              '401 is a server error, 403 is success|||401 là lỗi server, 403 là thành công',
              '403 means log in, 401 means forbidden|||403 nghĩa là đăng nhập, 401 nghĩa là bị cấm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which header tells the server the request body is JSON?|||Header nào cho server biết body của yêu cầu là JSON?',
            options: [
              'Content-Type: application/json|||Content-Type: application/json',
              'Accept-Language: en|||Accept-Language: en',
              'Authorization: Bearer|||Authorization: Bearer',
              'Cache-Control: no-cache|||Cache-Control: no-cache',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which is VALID JSON?|||Cái nào là JSON HỢP LỆ?',
            options: [
              '{ "name": "Lan", "age": 25 }|||{ "name": "Lan", "age": 25 }',
              "{ 'name': 'Lan' }|||{ 'name': 'Lan' }",
              '{ name: "Lan", }|||{ name: "Lan", }',
              '{ "name": "Lan", // a user }|||{ "name": "Lan", // a user }',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which turns a JavaScript object into a JSON text string to send?|||Cái nào biến một đối tượng JavaScript thành chuỗi JSON để gửi?',
            options: [
              'JSON.stringify(obj)|||JSON.stringify(obj)',
              'JSON.parse(obj)|||JSON.parse(obj)',
              'obj.toJSON now|||obj.toJSON now',
              'String(obj) always works|||String(obj) luôn dùng được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In REST, a URL like /getPosts or /deletePost?id=5 is…|||Trong REST, một URL như /getPosts hay /deletePost?id=5 là…',
            options: [
              'Not RESTful — the method should carry the verb, URLs name resources|||Không RESTful — method nên mang động từ, URL đặt tên tài nguyên',
              'The correct RESTful style|||Đúng phong cách RESTful',
              'Required for GET requests|||Bắt buộc cho yêu cầu GET',
              'The only way to delete data|||Cách duy nhất để xoá dữ liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In /posts?page=2&sort=newest, what are page and sort?|||Trong /posts?page=2&sort=newest, page và sort là gì?',
            options: [
              'Query-string parameters that refine the request (filter/sort/paginate)|||Tham số query-string tinh chỉnh yêu cầu (lọc/sắp xếp/phân trang)',
              'Path parameters identifying one post|||Tham số đường dẫn chỉ định một bài viết',
              'HTTP headers|||Header HTTP',
              'Status codes|||Mã trạng thái',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
