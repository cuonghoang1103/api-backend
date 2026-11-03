/**
 * Bài 6.1 — Request và response (nâng cấp 02/11/2026). Output thật: _demo/_t6/chay.sh (máy chủ Node 22 _t6/server.mjs, curl 8.7,
 * raw.mjs gõ request bằng tay qua TCP). Deck: scripts/slides-src/wf-6-1.mjs (9 slide, WF/v1/wf-6-1). Code Lab: wf-6-1-request-response.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-6-1', 'Request and response', 'Request và response', [
  [1, 'Request and response',
    '<p>Every interaction between a browser and a server is one request and one response. This chapter takes that exchange apart. We start with its shape, using a small API that runs on the test machine, and the most direct tool there is: typing a request by hand.</p>',
    '<p>Mọi tương tác giữa trình duyệt và máy chủ đều là một request và một response. Chương này mổ xẻ cuộc trao đổi đó. Ta bắt đầu từ hình dạng của nó, dùng một API nhỏ chạy trên máy thử, và công cụ trực tiếp nhất có thể: tự gõ một request bằng tay.</p>'],
  [2, 'After this lesson you can…',
    '<p>Reading raw HTTP is a skill that pays off for your whole career: every debugging session on an API ends with looking at exactly what was sent and what came back. Once the shape is familiar, curl output, the Network tab and server logs all become easy to read.</p>',
    '<p>Đọc HTTP thô là kỹ năng có ích suốt sự nghiệp: mọi buổi gỡ lỗi API đều kết thúc bằng việc nhìn chính xác thứ đã gửi và thứ trả về. Khi đã quen hình dạng, output của curl, thẻ Network và log máy chủ đều trở nên dễ đọc.</p>'],
  [3, 'HTTP is text',
    '<p>This program opened a plain network connection to the API and typed a request character by character: a request line, two headers and an empty line. The server answered with text too: a status line, headers, an empty line and the body. Nothing more is hidden.</p>',
    '<p>Chương trình này mở một kết nối mạng thường tới API và gõ một request từng ký tự: một dòng request, hai header và một dòng trống. Máy chủ cũng trả lời bằng chữ: dòng trạng thái, các header, một dòng trống và phần thân. Không có gì bị giấu thêm.</p>'],
  [4, 'Anatomy of a request',
    '<p>The request line holds the method, the path and the version. Headers add information as name and value. An empty line ends the headers, and a body may follow, for example the JSON of a new product. The Host header says which site, because one server can host many.</p>',
    '<p>Dòng request chứa method, đường dẫn và phiên bản. Header thêm thông tin dạng tên và giá trị. Một dòng trống kết thúc phần header, rồi có thể có phần thân, ví dụ JSON của một sản phẩm mới. Header Host nói trang nào, vì một máy chủ có thể chứa nhiều trang.</p>'],
  [5, 'Anatomy of a response',
    '<p>The status line holds the version, a three-digit code and a short reason. Headers describe the body: its type, how to cache it, its version tag. Then the body itself. The code is for programs; the reason phrase is only for people reading.</p>',
    '<p>Dòng trạng thái chứa phiên bản, một mã ba chữ số và một lý do ngắn. Header mô tả phần thân: kiểu của nó, cách lưu đệm, nhãn phiên bản. Rồi tới chính phần thân. Mã số dành cho chương trình; cụm lý do chỉ dành cho người đọc.</p>'],
  [6, 'curl shows both sides',
    '<p>With the verbose flag, curl prints lines starting with a greater-than sign for what it sent and less-than for what it received. It is the fastest way to test an API without writing any code. The server’s own log, on the right, shows the same requests arriving.</p>',
    '<p>Với cờ verbose, curl in các dòng bắt đầu bằng dấu lớn hơn cho thứ nó gửi và nhỏ hơn cho thứ nó nhận. Đó là cách nhanh nhất để thử một API mà không cần viết mã. Log của chính máy chủ, bên phải, cho thấy cùng các request đó đổ về.</p>'],
  [7, 'Stateless',
    '<p>Each request stands alone: the server does not remember the previous one. Anything it needs — who you are, which page, which language — must travel in every request, in the path, the query, headers or cookies. That is why login needs cookies or tokens in Chapter 7.</p>',
    '<p>Mỗi request đứng một mình: máy chủ không nhớ request trước. Mọi thứ nó cần — bạn là ai, trang nào, ngôn ngữ nào — đều phải đi kèm trong từng request, ở đường dẫn, chuỗi truy vấn, header hay cookie. Vì vậy đăng nhập cần cookie hoặc token ở Chương 7.</p>'],
  [8, 'Versions of HTTP',
    '<p>HTTP 1.1 is text, as you saw. HTTP 2 and 3 send the same meaning in a faster binary form, many requests sharing one connection. Methods, status codes and headers stay identical, so everything in this chapter applies to all of them.</p>',
    '<p>HTTP 1.1 là chữ, như bạn đã thấy. HTTP 2 và 3 gửi cùng ý nghĩa dưới dạng nhị phân nhanh hơn, nhiều request dùng chung một kết nối. Method, mã trạng thái và header giữ nguyên, nên mọi thứ trong chương này áp dụng cho cả ba.</p>'],
  [9, 'Summary & practice',
    '<p>The practice runs the same small API on your machine and asks you to read and write raw HTTP. "Done when" checks that you can produce a request with curl and explain every line of its response.</p>',
    '<p>Bài luyện chạy chính API nhỏ đó trên máy bạn và yêu cầu bạn đọc và viết HTTP thô. "Xong khi" kiểm rằng bạn tạo được request bằng curl và giải thích được mọi dòng của response.</p>'],
]);

export default {
  title: '6.1 — Request and response: the shape of HTTP|||6.1 — Request và response: hình dạng của HTTP',
  slug: 'wf-6-1-request-response',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/iYM2zFP3Zn0', durationSeconds: 0 },
  description: 'Giải phẫu URL (URL object thật: protocol, host, port, origin, path, query, hash); HTTP là chữ: gõ request bằng tay qua TCP tới một API Node thật; giải phẫu request (dòng request, header, dòng trống, phần thân) và response (dòng trạng thái, header, phần thân); curl -v hai chiều và log máy chủ; phi trạng thái; HTTP/1.1, 2, 3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>One request, one response: the conversation behind every page</h2>
<p class="lead">After this lesson you can read a raw HTTP request and response line by line, name each part, send any request you like with <code>curl</code>, explain why a server does not remember you between requests, and know what changes (and what does not) between HTTP versions. You need this because every API you will build or call in Node.js, React or Next.js speaks this one protocol. When something breaks between the browser and the server, the answer is always in these few lines of text.</p>

<h3>The API we will use in this chapter</h3>
<p>All examples in Chapter 6 talk to a small product API running on the test machine at <code>http://localhost:3456</code>, written with Node.js and no libraries. You will be able to read all of it after Chapter 4, and you can run it yourself. It keeps five products in memory and supports listing, filtering, creating, changing and deleting them.</p>
${ma('javascript', CODE['_t6/server.mjs'], [35, 47])}
<p>That excerpt shows the idea: the server reads the method and the path of each request, decides what to do, and answers with a status code, headers and a body. The rest of the file is more of the same. Every output in this chapter was produced by a real request to it.</p>

<h3>Step 0 — the address: anatomy of a URL</h3>
<p>Before any request is sent, the browser reads the URL to find out where to send it and what to ask for. Each part has a name, and the browser's <code>URL</code> object splits it for you (this ran in Chromium):</p>
${ma('javascript', CODE['6-1/url.js'])}
${ra(OUT['6-1/url'])}
<table>
<thead><tr><th>Part</th><th>Example</th><th>Used for</th></tr></thead>
<tbody>
<tr><td>protocol (scheme)</td><td><code>https:</code></td><td>How to talk: HTTP inside an encrypted TLS connection</td></tr>
<tr><td>hostname</td><td><code>shop.example</code></td><td>Which machine; DNS turns it into an IP address (Lesson 0.2)</td></tr>
<tr><td>port</td><td><code>8443</code></td><td>Which program on that machine; hidden when it is the default (80 for http, 443 for https)</td></tr>
<tr><td>path</td><td><code>/api/products/3</code></td><td>Which resource on the server</td></tr>
<tr><td>query</td><td><code>?sort=price&amp;page=2</code></td><td>Options for this request (Lesson 6.5)</td></tr>
<tr><td>fragment (hash)</td><td><code>#reviews</code></td><td>A place inside the page; <strong>never sent to the server</strong></td></tr>
</tbody>
</table>
<p>The <strong>origin</strong> — protocol, host and port together — matters a lot later: browsers apply security rules per origin (CORS in Lesson 7.5, cookies in Chapter 7). <code>http://localhost:3000</code> and <code>http://localhost:3456</code> are two different origins because the ports differ.</p>

<h3>Step 1 — HTTP is just text</h3>
<p>Browsers, curl and fetch hide the details, so let us remove them. This program opens a plain TCP connection (the "pipe" from Lesson 0.2) and types an HTTP request by hand:</p>
${ma('javascript', CODE['_t6/raw.mjs'])}
${ra(OUT['_t6/out/raw'])}
<p>That is the whole protocol: text in a fixed shape, sent down a connection. The <code>36</code> and <code>0</code> around the body are an HTTP/1.1 detail called chunked encoding: the size of each piece of the body in hexadecimal (0x36 = 54 characters), then a zero to say "done". Tools remove these for you.</p>

<h3>Step 2 — anatomy of a request</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Request line</span><span class="lz-d"><code>GET /api/products/3 HTTP/1.1</code>: method, path (with any query), version.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Headers</span><span class="lz-d">One per line, <code>Name: value</code>. <code>Host</code> is required: one server may host many sites.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Empty line</span><span class="lz-d">Marks the end of the headers. Forget it and the server keeps waiting.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Body (optional)</span><span class="lz-d">Data sent to the server, e.g. JSON for a new product. GET usually has none.</span></div>
</div>
<p>Headers are case-insensitive: <code>Content-Type</code> and <code>content-type</code> are the same header, which is why Node gives you <code>req.headers['content-type']</code> in lower case.</p>

<h3>Step 3 — anatomy of a response</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Status line</span><span class="lz-t">HTTP/1.1 200 OK</span><span class="lz-d">Version, a three-digit status code, and a reason phrase for humans. Programs only look at the number (Lesson 6.3).</span></div>
<div class="lz-layer"><span class="lz-k">Headers</span><span class="lz-t">metadata</span><span class="lz-d"><code>Content-Type</code> (what the body is), <code>ETag</code> and <code>Cache-Control</code> (caching), <code>Location</code>, cookies… (Lesson 6.4).</span></div>
<div class="lz-layer"><span class="lz-k">Empty line</span><span class="lz-t">end of headers</span><span class="lz-d">Same rule as the request.</span></div>
<div class="lz-layer"><span class="lz-k">Body</span><span class="lz-t">the content</span><span class="lz-d">HTML, JSON, an image, or nothing at all (204, 304).</span></div>
</div>

<h3>Step 4 — curl shows both sides</h3>
<p>Typing requests by hand is instructive once. Day to day, <strong>curl</strong> builds them for you. With <code>-v</code> (verbose), it prints the request it sent (lines starting with <code>&gt;</code>) and the response headers it received (<code>&lt;</code>):</p>
${ra(OUT['_t6/out/http-v'])}
<p>curl added <code>User-Agent</code> (who is asking) and <code>Accept: */*</code> (any format is fine). The server added <code>Date</code>, <code>Connection</code> and the chunked encoding. Meanwhile, this is what the server itself printed for the first requests of this chapter:</p>
${ra(OUT['_t6/out/server-log'])}
<table>
<thead><tr><th>curl option</th><th>Does</th></tr></thead>
<tbody>
<tr><td><code>-i</code></td><td>Include the response headers in the output</td></tr>
<tr><td><code>-v</code></td><td>Verbose: request and response headers, and connection details</td></tr>
<tr><td><code>-I</code></td><td>Send HEAD: headers only, no body</td></tr>
<tr><td><code>-X METHOD</code></td><td>Use another method: <code>-X POST</code>, <code>-X DELETE</code></td></tr>
<tr><td><code>-H 'Name: value'</code></td><td>Add a header</td></tr>
<tr><td><code>-d 'data'</code></td><td>Send a body (implies POST)</td></tr>
<tr><td><code>-s</code></td><td>Silent: no progress bar</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — testing an API only through your own front-end.</strong> When a page shows nothing, you cannot tell whether the request was wrong, the server failed, or the page mishandled a good answer. Test the API alone first, with curl or the Network tab's "Copy as cURL". If curl gets the right answer, the bug is in the page; if not, it is in the request or the server. That one step halves debugging time.</p></div>

<h3>Step 5 — HTTP is stateless</h3>
<p>Each request is independent: the server answers it and forgets it. It does not remember that you asked for product 1 a second ago, or that you logged in yesterday. Everything the server needs must be in the request itself:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Which resource</span><span class="v">In the path: <code>/api/products/3</code></span></div>
  <div class="kv"><span class="k">Which options</span><span class="v">In the query: <code>?category=office&amp;sort=-price</code> (Lesson 6.5)</span></div>
  <div class="kv"><span class="k">What format</span><span class="v">In headers: <code>Accept</code>, <code>Content-Type</code></span></div>
  <div class="kv"><span class="k">Who you are</span><span class="v">In a cookie or an <code>Authorization</code> header, on every request (Chapter 7)</span></div>
</div>
<p>This is what lets one API run on many machines behind a load balancer: any of them can answer any request. "Remembering" the user is done on purpose, with sessions and tokens.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — keeping user data in a server variable.</strong> A beginner's Node server stores <code>let currentUser = …</code> after a login. It seems to work while you test alone. With two users, the second login overwrites the first, and user A suddenly sees user B's data. After a restart, everyone is logged out. Per-user state must be tied to the request — a session id in a cookie, or a token — and stored in a database or session store.</p></div>

<h3>Step 6 — HTTP/1.1, HTTP/2, HTTP/3</h3>
<table>
<thead><tr><th>Version</th><th>On the wire</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>HTTP/1.1 (1997)</td><td>Text, as above</td><td>One request at a time per connection; browsers open several connections</td></tr>
<tr><td>HTTP/2 (2015)</td><td>Binary frames</td><td>Many requests share one connection; headers compressed</td></tr>
<tr><td>HTTP/3 (2022)</td><td>Binary, over QUIC (UDP)</td><td>Faster on bad networks, no head-of-line blocking</td></tr>
</tbody>
</table>
<p>In Lesson 0.2 curl talked to example.com with <code>HTTP/2</code>; here our local server speaks <code>HTTP/1.1</code>. The meaning is identical: method, path, headers, status, body. Everything in this chapter works the same on all three versions.</p>

<h3>The whole server, to copy</h3>
<p>This is the complete file behind every output in Chapter 6 — about 120 lines, no libraries. Save it as <code>server.mjs</code> and run <code>node server.mjs</code> (Node 18 or newer). It keeps data in memory, so restarting it resets the products.</p>
${ma('javascript', CODE['_t6/server.mjs'])}

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — read and write raw HTTP</strong></p>
<ol>
<li>Save the server above as <code>server.mjs</code> and the raw-request program as <code>raw.mjs</code> in one folder; run <code>node server.mjs</code>.</li>
<li>In another terminal, run <code>curl -v http://localhost:3456/api/products/2</code>. Label every line of the output: request line, request header, status line, response header, body.</li>
<li>Get the same product as CSV: add <code>-H 'Accept: text/csv'</code> to <code>/api/products?limit=2</code>.</li>
<li>Change <code>raw.mjs</code> to ask for <code>/api/products/999</code>, and read the raw 404.</li>
<li>Open <code>http://localhost:3456/api/products</code> in the browser with the Network tab open and compare its request headers with curl's.</li>
</ol>
<p>Hint: the browser sends many more headers than curl, including <code>Accept-Language</code> and <code>User-Agent</code> with its full name.</p>
<p><strong>Done when:</strong> you can point at the empty line in both the request and the response; the CSV request returns <code>Content-Type: text/csv</code>; the raw 404 shows status line <code>HTTP/1.1 404 Not Found</code> and a JSON body; and you can name three headers the browser sent that curl did not. Then Code Lab module 6.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HTTP</span><span class="v">giao thức truyền siêu văn bản — cách trình duyệt và máy chủ nói chuyện.</span></div>
  <div class="kv"><span class="k">request line</span><span class="v">dòng request — method, đường dẫn, phiên bản.</span></div>
  <div class="kv"><span class="k">status line</span><span class="v">dòng trạng thái — phiên bản, mã, lý do.</span></div>
  <div class="kv"><span class="k">header</span><span class="v">tiêu đề — Tên: giá trị, thông tin thêm.</span></div>
  <div class="kv"><span class="k">body</span><span class="v">phần thân — dữ liệu thật.</span></div>
  <div class="kv"><span class="k">TCP connection</span><span class="v">kết nối TCP — "đường ống" chở chữ.</span></div>
  <div class="kv"><span class="k">curl</span><span class="v">công cụ dòng lệnh gửi request.</span></div>
  <div class="kv"><span class="k">verbose</span><span class="v">chi tiết — in cả hai chiều.</span></div>
  <div class="kv"><span class="k">stateless</span><span class="v">phi trạng thái — máy chủ không nhớ request trước.</span></div>
  <div class="kv"><span class="k">chunked encoding</span><span class="v">mã hoá theo khúc — phần thân gửi từng mẩu có kích thước.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>HTTP is text: a start line, headers, an empty line, an optional body.</li>
  <li>Request line = method + path + version; status line = version + code + reason.</li>
  <li><code>Host</code> is required; header names are case-insensitive.</li>
  <li><code>curl -v</code> shows both directions; test the API alone before blaming the page.</li>
  <li>HTTP is stateless: every request must carry everything the server needs.</li>
  <li>Never keep per-user state in a server variable.</li>
  <li>HTTP/2 and /3 change the transport, not the meaning.</li>
</ul>
${nguon('📗', 'MDN — HTTP messages', 'Requests and responses in detail', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages')}
${nguon('📘', 'Everything curl', 'The free book about curl, by its author', 'https://everything.curl.dev/')}
${lienKet({ khoa: 'api-design', bai: 'api-0-1-http', title: 'API Design 0.1 — HTTP for API designers', sub: 'The same messages from the point of view of someone designing an API', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Một request, một response: cuộc trò chuyện sau mỗi trang</h2>
<p class="lead">Học xong bài này bạn đọc được request và response HTTP thô từng dòng, gọi tên từng phần, gửi bất kỳ request nào bạn muốn bằng <code>curl</code>, giải thích vì sao máy chủ không nhớ bạn giữa các request, và biết thứ gì đổi (và thứ gì không) giữa các phiên bản HTTP. Bạn cần điều này vì mọi API bạn sẽ dựng hay gọi trong Node.js, React hay Next.js đều nói đúng giao thức này. Khi có gì hỏng giữa trình duyệt và máy chủ, câu trả lời luôn nằm trong vài dòng chữ này.</p>

<h3>API ta dùng trong chương này</h3>
<p>Mọi ví dụ ở Chương 6 nói chuyện với một API sản phẩm nhỏ chạy trên máy thử tại <code>http://localhost:3456</code>, viết bằng Node.js không thư viện. Học xong Chương 4 bạn đọc được toàn bộ, và tự chạy được. Nó giữ năm sản phẩm trong bộ nhớ và hỗ trợ liệt kê, lọc, tạo, sửa và xoá.</p>
${ma('javascript', CODE['_t6/server.mjs'], [35, 47])}
<p>Đoạn trích đó cho thấy ý tưởng: máy chủ đọc method và đường dẫn của từng request, quyết định làm gì, rồi trả lời bằng mã trạng thái, header và phần thân. Phần còn lại của tệp cũng vậy. Mọi output trong chương này đều do một request thật tới nó tạo ra.</p>

<h3>Bước 0 — địa chỉ: giải phẫu một URL</h3>
<p>Trước khi gửi request nào, trình duyệt đọc URL để biết gửi tới đâu và hỏi gì. Mỗi phần có một tên, và đối tượng <code>URL</code> của trình duyệt tách giúp bạn (đoạn này chạy trong Chromium):</p>
${ma('javascript', CODE['6-1/url.js'])}
${ra(OUT['6-1/url'])}
<table>
<thead><tr><th>Phần</th><th>Ví dụ</th><th>Dùng để</th></tr></thead>
<tbody>
<tr><td>protocol (scheme)</td><td><code>https:</code></td><td>Cách nói chuyện: HTTP bên trong kết nối mã hoá TLS</td></tr>
<tr><td>hostname</td><td><code>shop.example</code></td><td>Máy nào; DNS đổi nó thành địa chỉ IP (Bài 0.2)</td></tr>
<tr><td>port</td><td><code>8443</code></td><td>Chương trình nào trên máy đó; ẩn đi khi là mặc định (80 cho http, 443 cho https)</td></tr>
<tr><td>path</td><td><code>/api/products/3</code></td><td>Tài nguyên nào trên máy chủ</td></tr>
<tr><td>query</td><td><code>?sort=price&amp;page=2</code></td><td>Tuỳ chọn cho request này (Bài 6.5)</td></tr>
<tr><td>fragment (hash)</td><td><code>#reviews</code></td><td>Một vị trí trong trang; <strong>không bao giờ gửi lên máy chủ</strong></td></tr>
</tbody>
</table>
<p><strong>Origin</strong> — protocol, host và port gộp lại — về sau rất quan trọng: trình duyệt áp luật bảo mật theo từng origin (CORS ở Bài 7.5, cookie ở Chương 7). <code>http://localhost:3000</code> và <code>http://localhost:3456</code> là hai origin khác nhau vì khác cổng.</p>

<h3>Bước 1 — HTTP chỉ là chữ</h3>
<p>Trình duyệt, curl và fetch giấu đi chi tiết, nên hãy gỡ chúng ra. Chương trình này mở một kết nối TCP trần ("đường ống" ở Bài 0.2) và gõ một request HTTP bằng tay:</p>
${ma('javascript', CODE['_t6/raw.mjs'])}
${ra(OUT['_t6/out/raw'])}
<p>Đó là toàn bộ giao thức: chữ theo một hình dạng cố định, gửi qua một kết nối. Số <code>36</code> và <code>0</code> quanh phần thân là một chi tiết của HTTP/1.1 gọi là chunked encoding: kích thước từng mẩu phần thân ở hệ mười sáu (0x36 = 54 ký tự), rồi số không để báo "xong". Các công cụ gỡ chúng đi giúp bạn.</p>

<h3>Bước 2 — giải phẫu một request</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dòng request</span><span class="lz-d"><code>GET /api/products/3 HTTP/1.1</code>: method, đường dẫn (kèm truy vấn nếu có), phiên bản.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Header</span><span class="lz-d">Mỗi dòng một cái, <code>Tên: giá trị</code>. <code>Host</code> là bắt buộc: một máy chủ có thể chứa nhiều trang.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dòng trống</span><span class="lz-d">Đánh dấu hết phần header. Quên nó là máy chủ cứ chờ mãi.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Phần thân (tuỳ chọn)</span><span class="lz-d">Dữ liệu gửi lên máy chủ, vd JSON của sản phẩm mới. GET thường không có.</span></div>
</div>
<p>Header không phân biệt hoa thường: <code>Content-Type</code> và <code>content-type</code> là một, vì vậy Node trao cho bạn <code>req.headers['content-type']</code> ở dạng chữ thường.</p>

<h3>Bước 3 — giải phẫu một response</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Dòng trạng thái</span><span class="lz-t">HTTP/1.1 200 OK</span><span class="lz-d">Phiên bản, mã trạng thái ba chữ số, và cụm lý do cho người đọc. Chương trình chỉ nhìn con số (Bài 6.3).</span></div>
<div class="lz-layer"><span class="lz-k">Header</span><span class="lz-t">thông tin phụ</span><span class="lz-d"><code>Content-Type</code> (phần thân là gì), <code>ETag</code> và <code>Cache-Control</code> (lưu đệm), <code>Location</code>, cookie… (Bài 6.4).</span></div>
<div class="lz-layer"><span class="lz-k">Dòng trống</span><span class="lz-t">hết header</span><span class="lz-d">Cùng luật như request.</span></div>
<div class="lz-layer"><span class="lz-k">Phần thân</span><span class="lz-t">nội dung</span><span class="lz-d">HTML, JSON, ảnh, hoặc không có gì (204, 304).</span></div>
</div>

<h3>Bước 4 — curl cho thấy cả hai chiều</h3>
<p>Gõ request bằng tay một lần là bổ ích. Hằng ngày, <strong>curl</strong> dựng chúng cho bạn. Với <code>-v</code> (verbose — chi tiết), nó in request đã gửi (dòng bắt đầu bằng <code>&gt;</code>) và các header response nhận được (<code>&lt;</code>):</p>
${ra(OUT['_t6/out/http-v'])}
<p>curl tự thêm <code>User-Agent</code> (ai đang hỏi) và <code>Accept: */*</code> (định dạng nào cũng được). Máy chủ thêm <code>Date</code>, <code>Connection</code> và chunked encoding. Trong lúc đó, đây là thứ chính máy chủ in ra cho các request đầu tiên của chương:</p>
${ra(OUT['_t6/out/server-log'])}
<table>
<thead><tr><th>Tuỳ chọn curl</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td><code>-i</code></td><td>In kèm header của response</td></tr>
<tr><td><code>-v</code></td><td>Chi tiết: header request, header response và thông tin kết nối</td></tr>
<tr><td><code>-I</code></td><td>Gửi HEAD: chỉ header, không phần thân</td></tr>
<tr><td><code>-X METHOD</code></td><td>Dùng method khác: <code>-X POST</code>, <code>-X DELETE</code></td></tr>
<tr><td><code>-H 'Tên: giá trị'</code></td><td>Thêm một header</td></tr>
<tr><td><code>-d 'dữ liệu'</code></td><td>Gửi phần thân (ngầm hiểu là POST)</td></tr>
<tr><td><code>-s</code></td><td>Im lặng: không hiện thanh tiến độ</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ thử API qua front-end của chính mình.</strong> Khi trang không hiện gì, bạn không phân biệt được request sai, máy chủ hỏng, hay trang xử lý sai một câu trả lời đúng. Hãy thử riêng API trước, bằng curl hoặc "Copy as cURL" của thẻ Network. Nếu curl nhận đúng, lỗi nằm ở trang; nếu không, lỗi nằm ở request hoặc máy chủ. Một bước đó cắt đôi thời gian gỡ lỗi.</p></div>

<h3>Bước 5 — HTTP là phi trạng thái</h3>
<p>Mỗi request độc lập: máy chủ trả lời rồi quên nó. Nó không nhớ bạn vừa hỏi sản phẩm 1 một giây trước, hay bạn đăng nhập hôm qua. Mọi thứ máy chủ cần phải nằm ngay trong request:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tài nguyên nào</span><span class="v">Trong đường dẫn: <code>/api/products/3</code></span></div>
  <div class="kv"><span class="k">Tuỳ chọn nào</span><span class="v">Trong truy vấn: <code>?category=office&amp;sort=-price</code> (Bài 6.5)</span></div>
  <div class="kv"><span class="k">Định dạng nào</span><span class="v">Trong header: <code>Accept</code>, <code>Content-Type</code></span></div>
  <div class="kv"><span class="k">Bạn là ai</span><span class="v">Trong cookie hoặc header <code>Authorization</code>, ở mọi request (Chương 7)</span></div>
</div>
<p>Nhờ vậy một API chạy được trên nhiều máy phía sau bộ cân bằng tải: máy nào cũng trả lời được mọi request. Việc "nhớ" người dùng được làm có chủ đích, bằng session và token.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — giữ dữ liệu người dùng trong biến của máy chủ.</strong> Máy chủ Node của người mới lưu <code>let currentUser = …</code> sau khi đăng nhập. Có vẻ chạy được khi bạn thử một mình. Với hai người dùng, lần đăng nhập thứ hai ghi đè lần đầu, và người A bỗng thấy dữ liệu của người B. Khởi động lại là mọi người bị đăng xuất. Trạng thái theo từng người phải gắn với request — một session id trong cookie, hoặc một token — và lưu trong cơ sở dữ liệu hay kho session.</p></div>

<h3>Bước 6 — HTTP/1.1, HTTP/2, HTTP/3</h3>
<table>
<thead><tr><th>Phiên bản</th><th>Trên đường truyền</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>HTTP/1.1 (1997)</td><td>Chữ, như trên</td><td>Mỗi kết nối một request một lúc; trình duyệt mở nhiều kết nối</td></tr>
<tr><td>HTTP/2 (2015)</td><td>Khung nhị phân</td><td>Nhiều request chung một kết nối; header được nén</td></tr>
<tr><td>HTTP/3 (2022)</td><td>Nhị phân, trên QUIC (UDP)</td><td>Nhanh hơn trên mạng kém, không bị nghẽn đầu hàng</td></tr>
</tbody>
</table>
<p>Ở Bài 0.2 curl nói chuyện với example.com bằng <code>HTTP/2</code>; ở đây máy chủ cục bộ nói <code>HTTP/1.1</code>. Ý nghĩa y hệt: method, đường dẫn, header, mã trạng thái, phần thân. Mọi thứ trong chương này chạy như nhau trên cả ba phiên bản.</p>

<h3>Toàn bộ máy chủ, để chép</h3>
<p>Đây là tệp hoàn chỉnh đứng sau mọi output ở Chương 6 — khoảng 120 dòng, không thư viện. Lưu thành <code>server.mjs</code> và chạy <code>node server.mjs</code> (Node 18 trở lên). Nó giữ dữ liệu trong bộ nhớ, nên khởi động lại là sản phẩm về như cũ.</p>
${ma('javascript', CODE['_t6/server.mjs'])}

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — đọc và viết HTTP thô</strong></p>
<ol>
<li>Lưu máy chủ ở trên thành <code>server.mjs</code> và chương trình gõ request thô thành <code>raw.mjs</code> trong cùng một thư mục; chạy <code>node server.mjs</code>.</li>
<li>Ở terminal khác, chạy <code>curl -v http://localhost:3456/api/products/2</code>. Dán nhãn từng dòng output: dòng request, header request, dòng trạng thái, header response, phần thân.</li>
<li>Lấy cùng sản phẩm dạng CSV: thêm <code>-H 'Accept: text/csv'</code> vào <code>/api/products?limit=2</code>.</li>
<li>Sửa <code>raw.mjs</code> để hỏi <code>/api/products/999</code>, rồi đọc 404 thô.</li>
<li>Mở <code>http://localhost:3456/api/products</code> trong trình duyệt với thẻ Network đang mở và so header request của nó với của curl.</li>
</ol>
<p>Gợi ý: trình duyệt gửi nhiều header hơn curl, gồm <code>Accept-Language</code> và <code>User-Agent</code> với tên đầy đủ.</p>
<p><strong>Xong khi:</strong> bạn chỉ được vào dòng trống ở cả request lẫn response; request CSV trả về <code>Content-Type: text/csv</code>; 404 thô hiện dòng trạng thái <code>HTTP/1.1 404 Not Found</code> và một phần thân JSON; và bạn kể được ba header trình duyệt gửi mà curl không gửi. Sau đó làm module Code Lab 6.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HTTP</span><span class="v">giao thức truyền siêu văn bản — cách trình duyệt và máy chủ nói chuyện.</span></div>
  <div class="kv"><span class="k">request line</span><span class="v">dòng request — method, đường dẫn, phiên bản.</span></div>
  <div class="kv"><span class="k">status line</span><span class="v">dòng trạng thái — phiên bản, mã, lý do.</span></div>
  <div class="kv"><span class="k">header</span><span class="v">tiêu đề — Tên: giá trị, thông tin thêm.</span></div>
  <div class="kv"><span class="k">body</span><span class="v">phần thân — dữ liệu thật.</span></div>
  <div class="kv"><span class="k">TCP connection</span><span class="v">kết nối TCP — "đường ống" chở chữ.</span></div>
  <div class="kv"><span class="k">curl</span><span class="v">công cụ dòng lệnh gửi request.</span></div>
  <div class="kv"><span class="k">verbose</span><span class="v">chi tiết — in cả hai chiều.</span></div>
  <div class="kv"><span class="k">stateless</span><span class="v">phi trạng thái — máy chủ không nhớ request trước.</span></div>
  <div class="kv"><span class="k">chunked encoding</span><span class="v">mã hoá theo khúc — phần thân gửi từng mẩu có kích thước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>HTTP là chữ: dòng mở đầu, các header, một dòng trống, phần thân tuỳ chọn.</li>
  <li>Dòng request = method + đường dẫn + phiên bản; dòng trạng thái = phiên bản + mã + lý do.</li>
  <li><code>Host</code> là bắt buộc; tên header không phân biệt hoa thường.</li>
  <li><code>curl -v</code> cho thấy hai chiều; thử riêng API trước khi đổ lỗi cho trang.</li>
  <li>HTTP phi trạng thái: request nào cũng phải mang đủ thứ máy chủ cần.</li>
  <li>Đừng bao giờ giữ trạng thái từng người dùng trong biến của máy chủ.</li>
  <li>HTTP/2 và /3 đổi cách truyền, không đổi ý nghĩa.</li>
</ul>
${nguon('📗', 'MDN — HTTP messages', 'Request và response chi tiết', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages')}
${nguon('📘', 'Everything curl', 'Sách miễn phí về curl, do chính tác giả viết', 'https://everything.curl.dev/')}
${lienKet({ khoa: 'api-design', bai: 'api-0-1-http', title: 'Thiết kế API 0.1 — HTTP cho người thiết kế API', sub: 'Cùng các thông điệp đó từ góc nhìn người thiết kế API', cta: 'Mở bài' })}
</div>
`,
};
