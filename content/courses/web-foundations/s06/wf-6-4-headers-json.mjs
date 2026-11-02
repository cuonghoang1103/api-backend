/**
 * Bài 6.4 — Header, JSON và phần thân (nâng cấp 02/11/2026). Output thật: _demo/_t6/chay.sh (curl → API Node _t6/server.mjs:
 * ETag/304, Accept: text/csv, 201 + Location, 415), _demo/_t6/chay.mjs (Chromium + CDP: trình duyệt tự gửi If-None-Match,
 * mạng 304 mà JS thấy 200), _demo/6-4/json.js (JSON làm rơi gì). Deck: scripts/slides-src/wf-6-4.mjs (9 slide, WF/v1/wf-6-4).
 * Code Lab: wf-6-4-headers-json.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

const G = walkWf('wf-6-4', 'Headers and JSON', 'Header và JSON', [
  [1, 'Headers and JSON',
    '<p>The status line says how it went; the body carries the data; headers describe everything in between: what format the body is in, how long it may be cached, where a new resource lives, who is asking. This lesson reads the headers that matter and the JSON format that almost every API speaks.</p>',
    '<p>Dòng trạng thái nói kết quả ra sao; phần thân chở dữ liệu; header mô tả mọi thứ ở giữa: phần thân ở định dạng gì, được lưu đệm bao lâu, tài nguyên mới nằm ở đâu, ai đang hỏi. Bài này đọc những header quan trọng và định dạng JSON mà gần như mọi API đều nói.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to read and set the headers you meet every day, ask a server for a different format, understand how browsers avoid downloading the same data twice, and predict exactly what survives a trip through JSON — and what quietly disappears.</p>',
    '<p>Bạn sẽ đọc và đặt được những header gặp hằng ngày, xin máy chủ một định dạng khác, hiểu cách trình duyệt tránh tải cùng dữ liệu hai lần, và đoán chính xác thứ gì sống sót qua chuyến đi JSON — và thứ gì lặng lẽ biến mất.</p>'],
  [3, 'Content-Type describes the body',
    '<p>Content-Type tells the receiver how to read the body. We posted valid JSON without that header, and the server answered 415: it refused to guess. With the header, the same body created a product and the response carried a Location header pointing at it.</p>',
    '<p>Content-Type nói với bên nhận cách đọc phần thân. Ta gửi JSON hợp lệ mà không có header đó, và máy chủ trả 415: nó từ chối đoán. Có header, cùng phần thân đó tạo được sản phẩm và response mang header Location trỏ tới nó.</p>'],
  [4, 'Accept asks for a format',
    '<p>Accept goes the other way: the client says which formats it would like back. Asking for text slash csv, the same address returned a CSV table instead of JSON. This is called content negotiation: one resource, several representations.</p>',
    '<p>Accept đi theo chiều ngược lại: client nói nó muốn nhận định dạng nào. Xin text/csv, cùng địa chỉ đó trả về một bảng CSV thay cho JSON. Đây gọi là thương lượng nội dung: một tài nguyên, nhiều cách biểu diễn.</p>'],
  [5, 'ETag and 304',
    '<p>The server labels each version of a product with an ETag. When the client sends that label back in If-None-Match and nothing changed, the server answers 304 with no body. The browser does this by itself: on the network it was a 304, yet JavaScript received a normal 200 with the full data from cache.</p>',
    '<p>Máy chủ dán nhãn mỗi phiên bản sản phẩm bằng một ETag. Khi client gửi lại nhãn đó trong If-None-Match và không có gì đổi, máy chủ trả 304 không phần thân. Trình duyệt tự làm việc này: trên mạng là 304, vậy mà JavaScript nhận một 200 bình thường với đủ dữ liệu từ bộ đệm.</p>'],
  [6, 'JSON on the wire',
    '<p>JSON is text. JSON dot stringify turns an object into that text; JSON dot parse turns it back. Only strings, numbers, booleans, null, arrays and plain objects survive. Undefined and functions vanish, NaN becomes null, and a Date becomes a string that stays a string after parsing.</p>',
    '<p>JSON là chữ. JSON.stringify biến object thành chữ đó; JSON.parse biến ngược lại. Chỉ chuỗi, số, boolean, null, mảng và object thường sống sót. Undefined và hàm biến mất, NaN thành null, và Date thành chuỗi rồi vẫn là chuỗi sau khi parse.</p>'],
  [7, 'JSON is strict',
    '<p>Single quotes, unquoted names and a trailing comma are all fine in JavaScript and all errors in JSON. And when a proxy returns an HTML error page, calling json on it fails with "Unexpected token less-than": the problem is not your parser, it is that the server did not send JSON.</p>',
    '<p>Nháy đơn, tên không có nháy và dấu phẩy thừa ở cuối đều ổn trong JavaScript và đều là lỗi trong JSON. Và khi một proxy trả trang lỗi HTML, gọi json trên nó hỏng với "Unexpected token &lt;": vấn đề không nằm ở bộ parse, mà là máy chủ đã không gửi JSON.</p>'],
  [8, 'The headers you will set',
    '<p>In daily work you set only a few: Content-Type when you send a body, Accept when you want a format, Authorization when you send a token. The server sets Content-Type, Location, Cache-Control, ETag and Set-Cookie. Everything else, the browser handles for you.</p>',
    '<p>Hằng ngày bạn chỉ đặt vài cái: Content-Type khi gửi phần thân, Accept khi muốn một định dạng, Authorization khi gửi token. Máy chủ đặt Content-Type, Location, Cache-Control, ETag và Set-Cookie. Mọi thứ còn lại, trình duyệt lo giúp bạn.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to send the same request with different headers and compare the responses, then fix a fetch call that forgets its Content-Type. "Done when" checks the 415, the CSV, the 304 and a successful 201.</p>',
    '<p>Bài luyện yêu cầu bạn gửi cùng một request với các header khác nhau và so các response, rồi sửa một lời gọi fetch quên Content-Type. "Xong khi" kiểm 415, CSV, 304 và một 201 thành công.</p>'],
]);

export default {
  title: '6.4 — Headers, JSON and the message body|||6.4 — Header, JSON và phần thân thông điệp',
  slug: 'wf-6-4-headers-json',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/iiADhChRriM', durationSeconds: 0 },
  description: 'Header request/response hay gặp; Content-Type (thiếu ⇒ 415 thật), 201 + Location; Accept: text/csv ⇒ cùng địa chỉ trả CSV; ETag + If-None-Match ⇒ 304 (curl) và Chromium tự làm: mạng 304, JS thấy 200; JSON.stringify/parse làm rơi undefined/hàm, NaN→null, Date→chuỗi, số lớn mất chính xác; JSON nghiêm hơn JS; "Unexpected token <" khi nhận trang HTML.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Headers describe the message; the body carries the data</h2>
<p class="lead">After this lesson you can read the headers of any response and know which ones matter, set the three headers you will write yourself almost every day, ask a server for a different format, explain how a browser avoids downloading unchanged data, and predict exactly what survives a round trip through JSON. Forgetting one header is behind a surprising number of "the API returns nothing" bugs — in Express, a missing <code>Content-Type</code> makes <code>req.body</code> empty.</p>

<h3>Step 1 — the headers you will meet</h3>
<p>Headers are <code>Name: value</code> lines. Some only appear in requests, some only in responses, and a few in both:</p>
<table>
<thead><tr><th>Header</th><th>Direction</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>Content-Type</code></td><td>both</td><td>The format of <em>this</em> body: <code>application/json; charset=utf-8</code>, <code>text/html</code>, <code>multipart/form-data</code>…</td></tr>
<tr><td><code>Content-Length</code></td><td>both</td><td>Size of the body in bytes</td></tr>
<tr><td><code>Accept</code></td><td>request</td><td>Formats the client would like back</td></tr>
<tr><td><code>Authorization</code></td><td>request</td><td>Credentials, usually <code>Bearer &lt;token&gt;</code> (Chapter 7)</td></tr>
<tr><td><code>Cookie</code> / <code>Set-Cookie</code></td><td>request / response</td><td>Small values the browser stores and sends back (Chapter 7)</td></tr>
<tr><td><code>User-Agent</code></td><td>request</td><td>Which program is asking</td></tr>
<tr><td><code>Location</code></td><td>response</td><td>Where a new resource lives (201) or where to go (3xx)</td></tr>
<tr><td><code>Cache-Control</code></td><td>both</td><td>Whether and how long a copy may be reused</td></tr>
<tr><td><code>ETag</code> / <code>If-None-Match</code></td><td>response / request</td><td>A version label, and "send it only if it changed"</td></tr>
</tbody>
</table>
<p>Header names are case-insensitive (<code>content-type</code> = <code>Content-Type</code>); with HTTP/2 they are always sent in lower case. Custom headers are allowed — many APIs add <code>X-Request-Id</code> to help match a user's error to a server log line.</p>

<h3>Step 2 — Content-Type: how to read the body</h3>
<p>The receiver cannot guess what bytes mean. The same <code>{"name":"Tape","price":15000}</code>, once with the header and once without:</p>
${ra(doan('_t6/out/headers', 3, 4))}
<p>With <code>Content-Type: application/json</code> the product was created: <strong>201</strong>, and <code>Location</code> tells us its address. Without it, curl's <code>-d</code> labelled the body as a form (<code>application/x-www-form-urlencoded</code>) and our server refused with <strong>415 Unsupported Media Type</strong>. This is how the server decides it:</p>
${ma('javascript', CODE['_t6/server.mjs'], [78, 87])}
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>fetch</code> with a JSON body but no Content-Type.</strong> <code>fetch(url, { method: 'POST', body: JSON.stringify(data) })</code> sends the text labelled <code>text/plain;charset=UTF-8</code>. A strict API answers 415; an Express app with <code>express.json()</code> silently skips parsing, so <code>req.body</code> is <code>{}</code> and you get "name is required" for a name you clearly sent. Always pair <code>JSON.stringify</code> with <code>headers: { 'Content-Type': 'application/json' }</code>.</p></div>

<h3>Step 3 — Accept: asking for a format</h3>
${ra(doan('_t6/out/headers', 2))}
<p>Same address, different representation. <code>Accept</code> lists what the client prefers, optionally with weights: <code>Accept: text/csv, application/json;q=0.8</code> means "CSV if you can, otherwise JSON". The server picks the best match and states its choice in <code>Content-Type</code> — always read <code>Content-Type</code>, not <code>Accept</code>, to know what you actually got. If nothing matches, a strict server answers <strong>406 Not Acceptable</strong>.</p>

<h3>Step 4 — ETag and 304: not downloading the same thing twice</h3>
${ra(doan('_t6/out/headers', 0, 1))}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">First request</span><span class="lz-d">Server sends the product + <code>ETag: "8c50…"</code> (a fingerprint of this version) + <code>Cache-Control: no-cache</code> ("check with me before reusing").</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Next request</span><span class="lz-d">Client sends <code>If-None-Match: "8c50…"</code> — "I have this version".</span></div>
<div class="lz-step"><span class="lz-k">3a</span><span class="lz-t">Unchanged</span><span class="lz-d"><strong>304 Not Modified</strong>, empty body. Reuse the stored copy.</span></div>
<div class="lz-step"><span class="lz-k">3b</span><span class="lz-t">Changed</span><span class="lz-d">200 with the new body and a new ETag.</span></div>
</div>
<p>In a browser you do not write any of this. Chromium, observed through the DevTools Protocol, while a page called <code>fetch('/api/products/2')</code> twice:</p>
${ra(OUT['_t6/out/etag-browser'])}
<p>The browser added <code>If-None-Match</code> by itself, the server answered 304 with no body, and the browser handed JavaScript a complete 200 built from its cache. That is why you may see "304" in the Network tab while your code only ever sees 200.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-Control: no-store</span><span class="v">Never keep a copy (private data, bank pages).</span></div>
  <div class="kv"><span class="k">Cache-Control: no-cache</span><span class="v">Keep a copy, but revalidate every time (what our API sends).</span></div>
  <div class="kv"><span class="k">Cache-Control: max-age=600</span><span class="v">Reuse for 10 minutes without asking at all.</span></div>
  <div class="kv"><span class="k">public, max-age=31536000, immutable</span><span class="v">For files whose name contains a hash (<code>app.3f9a1c.js</code>): cache for a year (Lesson 14.1).</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "I changed the data but the page shows the old value".</strong> A response sent with <code>max-age</code> is reused without contacting the server until it expires, so neither a refresh in your code nor a server fix helps until then. For API data that changes, send <code>no-cache</code> (with an ETag) or <code>no-store</code>; use long <code>max-age</code> only for files whose URL changes when their content changes. When debugging, tick "Disable cache" in the Network tab.</p></div>

<h3>Step 5 — JSON: the format APIs speak</h3>
<p>JSON (JavaScript Object Notation) is text that looks like JavaScript literals. Sending data means <code>JSON.stringify</code>; receiving means <code>JSON.parse</code> (which <code>res.json()</code> calls for you). Not everything survives the trip (real Chromium output):</p>
${ma('javascript', CODE['6-4/json.js'])}
${ra(OUT['6-4/json'])}
<table>
<thead><tr><th>JavaScript value</th><th>After stringify → parse</th></tr></thead>
<tbody>
<tr><td>string, finite number, true/false, null</td><td>Same</td></tr>
<tr><td>array, plain object</td><td>Same structure (a new copy)</td></tr>
<tr><td><code>undefined</code>, function, Symbol (as a property)</td><td>Property removed</td></tr>
<tr><td><code>NaN</code>, <code>Infinity</code></td><td><code>null</code></td></tr>
<tr><td><code>Date</code></td><td>ISO string — call <code>new Date(s)</code> yourself</td></tr>
<tr><td><code>Map</code>, <code>Set</code></td><td><code>{}</code> — convert with <code>Object.fromEntries</code> / <code>[...set]</code> first</td></tr>
<tr><td>integer above 2<sup>53</sup> − 1</td><td>Rounded — send big ids as strings</td></tr>
</tbody>
</table>

<h3>Step 6 — JSON is stricter than JavaScript</h3>
<p>The last four lines of that output are parse errors. JSON requires double quotes around every name and string, allows no trailing comma and no comments. The fourth one is the error you will see most in real projects:</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>Unexpected token '&lt;'</code>.</strong> Your code called <code>res.json()</code>, but the body was HTML: a 404 page from the dev server because the URL was wrong, a 502 page from nginx because the API was down, or a login page after a redirect. The JSON parser is fine — it is reading <code>&lt;!doctype html&gt;</code>. Check <code>res.ok</code> and <code>Content-Type</code> before parsing (Lesson 6.3's <code>requestJson</code> does both), and look at the response body in the Network tab.</p></div>

<h3>Step 7 — the headers you will actually set</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Client sets</span><span class="lz-t">Content-Type · Accept · Authorization</span><span class="lz-d">Only when sending a body, wanting a format, or proving who you are. The browser adds Host, User-Agent, Cookie, Accept-Language, If-None-Match itself.</span></div>
<div class="lz-layer"><span class="lz-k">Server sets</span><span class="lz-t">Content-Type · Location · Cache-Control · ETag · Set-Cookie</span><span class="lz-d">Express's <code>res.json()</code> sets Content-Type and Content-Length for you; <code>res.location()</code>, <code>res.set()</code> the rest.</span></div>
<div class="lz-layer"><span class="lz-k">Forbidden to set</span><span class="lz-t">Host · Content-Length · Cookie · Origin…</span><span class="lz-d">fetch in the browser silently ignores these; the browser controls them for security.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — same request, different headers</strong></p>
<ol>
<li>Run the Chapter 6 server. Send <code>POST /api/products</code> with a JSON body three ways: no Content-Type, <code>text/plain</code>, <code>application/json</code>. Record each status.</li>
<li>Request <code>/api/products?limit=3</code> with <code>Accept: text/csv</code>, then with <code>Accept: application/json</code>. Compare <code>Content-Type</code> in the two responses.</li>
<li>Get product 1 with <code>-i</code>, copy its ETag, send it back in <code>If-None-Match</code>. Then <code>PATCH</code> product 1 and send the old ETag again.</li>
<li>In the browser console on <code>http://localhost:3456/api/products</code>, run a <code>fetch</code> POST that forgets the Content-Type, then fix it.</li>
<li>Predict, then check in the console: <code>JSON.parse(JSON.stringify({ a: undefined, b: [undefined], d: new Date(0) }))</code>.</li>
</ol>
<p>Hint: in an array, <code>undefined</code> cannot be removed without shifting the other items, so it becomes <code>null</code>.</p>
<p><strong>Done when:</strong> you got 415, 415, 201 in step 1; step 2 shows <code>text/csv</code> then <code>application/json</code>; step 3 gives 304 before the PATCH and 200 with a new ETag after; your fixed fetch returns 201 with a <code>Location</code>; and your prediction in step 5 was <code>{ b: [null], d: "1970-01-01T00:00:00.000Z" }</code>. Then Code Lab module 6.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">header</span><span class="v">tiêu đề — dòng Tên: giá trị mô tả thông điệp.</span></div>
  <div class="kv"><span class="k">Content-Type / media type</span><span class="v">kiểu nội dung — phần thân là định dạng gì.</span></div>
  <div class="kv"><span class="k">content negotiation</span><span class="v">thương lượng nội dung — Accept chọn cách biểu diễn.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">nhãn phiên bản của một tài nguyên.</span></div>
  <div class="kv"><span class="k">conditional request</span><span class="v">request có điều kiện — If-None-Match ⇒ có thể 304.</span></div>
  <div class="kv"><span class="k">Cache-Control</span><span class="v">luật lưu đệm — no-store, no-cache, max-age.</span></div>
  <div class="kv"><span class="k">JSON</span><span class="v">định dạng chữ cho dữ liệu có cấu trúc.</span></div>
  <div class="kv"><span class="k">serialize / parse</span><span class="v">tuần tự hoá (stringify) / phân tích (parse).</span></div>
  <div class="kv"><span class="k">415 / 406</span><span class="v">không nhận định dạng gửi lên / không có định dạng client muốn.</span></div>
  <div class="kv"><span class="k">forbidden header</span><span class="v">header cấm — trình duyệt không cho mã JS đặt.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Headers describe the message: format, size, caching, location, credentials.</li>
  <li><code>Content-Type</code> says how to read <em>this</em> body; JSON bodies need <code>application/json</code> or the server may answer 415 or see an empty body.</li>
  <li><code>Accept</code> asks for a format; read <code>Content-Type</code> to know what you got.</li>
  <li>ETag + If-None-Match ⇒ 304 with no body; browsers do it automatically and give JS a 200.</li>
  <li><code>no-store</code>, <code>no-cache</code>, <code>max-age</code> decide whether a copy is reused.</li>
  <li>JSON drops undefined and functions, turns NaN into null and Dates into strings, rounds huge integers.</li>
  <li><code>Unexpected token '&lt;'</code> = you received HTML, not JSON. Check status and Content-Type first.</li>
</ul>
${nguon('📗', 'MDN — HTTP headers', 'Reference for every standard header', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers')}
${nguon('📘', 'MDN — HTTP caching', 'Cache-Control, ETag and revalidation explained', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-3-5-http-server', title: 'Node.js 3.5 — An HTTP server with the http module', sub: 'Set status, headers and JSON bodies yourself on the server side', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Header mô tả thông điệp; phần thân chở dữ liệu</h2>
<p class="lead">Học xong bài này bạn đọc được header của mọi response và biết cái nào quan trọng, đặt được ba header mà gần như ngày nào bạn cũng tự viết, xin máy chủ một định dạng khác, giải thích cách trình duyệt tránh tải lại dữ liệu chưa đổi, và đoán chính xác thứ gì sống sót qua một chuyến đi khứ hồi qua JSON. Quên một header là gốc của rất nhiều lỗi "API không trả gì" — trong Express, thiếu <code>Content-Type</code> làm <code>req.body</code> rỗng.</p>

<h3>Bước 1 — những header bạn sẽ gặp</h3>
<p>Header là các dòng <code>Tên: giá trị</code>. Có cái chỉ có trong request, có cái chỉ trong response, và vài cái có ở cả hai:</p>
<table>
<thead><tr><th>Header</th><th>Chiều</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td><code>Content-Type</code></td><td>cả hai</td><td>Định dạng của phần thân <em>này</em>: <code>application/json; charset=utf-8</code>, <code>text/html</code>, <code>multipart/form-data</code>…</td></tr>
<tr><td><code>Content-Length</code></td><td>cả hai</td><td>Kích thước phần thân tính bằng byte</td></tr>
<tr><td><code>Accept</code></td><td>request</td><td>Định dạng client muốn nhận</td></tr>
<tr><td><code>Authorization</code></td><td>request</td><td>Thông tin xác thực, thường <code>Bearer &lt;token&gt;</code> (Chương 7)</td></tr>
<tr><td><code>Cookie</code> / <code>Set-Cookie</code></td><td>request / response</td><td>Giá trị nhỏ trình duyệt lưu rồi gửi lại (Chương 7)</td></tr>
<tr><td><code>User-Agent</code></td><td>request</td><td>Chương trình nào đang hỏi</td></tr>
<tr><td><code>Location</code></td><td>response</td><td>Tài nguyên mới ở đâu (201) hoặc đi tới đâu (3xx)</td></tr>
<tr><td><code>Cache-Control</code></td><td>cả hai</td><td>Có được dùng lại bản sao không và trong bao lâu</td></tr>
<tr><td><code>ETag</code> / <code>If-None-Match</code></td><td>response / request</td><td>Nhãn phiên bản, và "chỉ gửi nếu đã đổi"</td></tr>
</tbody>
</table>
<p>Tên header không phân biệt hoa thường (<code>content-type</code> = <code>Content-Type</code>); với HTTP/2 chúng luôn được gửi chữ thường. Header tự đặt được phép — nhiều API thêm <code>X-Request-Id</code> để ghép lỗi người dùng gặp với một dòng log máy chủ.</p>

<h3>Bước 2 — Content-Type: cách đọc phần thân</h3>
<p>Bên nhận không thể đoán các byte nghĩa là gì. Cùng <code>{"name":"Tape","price":15000}</code>, một lần có header và một lần không:</p>
${ra(doan('_t6/out/headers', 3, 4))}
<p>Có <code>Content-Type: application/json</code> thì sản phẩm được tạo: <strong>201</strong>, và <code>Location</code> cho biết địa chỉ của nó. Không có, <code>-d</code> của curl dán nhãn phần thân là form (<code>application/x-www-form-urlencoded</code>) và máy chủ của ta từ chối bằng <strong>415 Unsupported Media Type</strong>. Đây là cách máy chủ quyết định:</p>
${ma('javascript', CODE['_t6/server.mjs'], [78, 87])}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>fetch</code> có phần thân JSON mà không có Content-Type.</strong> <code>fetch(url, { method: 'POST', body: JSON.stringify(data) })</code> gửi chữ đó với nhãn <code>text/plain;charset=UTF-8</code>. API chặt chẽ trả 415; app Express dùng <code>express.json()</code> lặng lẽ bỏ qua việc parse, nên <code>req.body</code> là <code>{}</code> và bạn nhận "name is required" cho cái tên rõ ràng đã gửi. Luôn đi cặp <code>JSON.stringify</code> với <code>headers: { 'Content-Type': 'application/json' }</code>.</p></div>

<h3>Bước 3 — Accept: xin một định dạng</h3>
${ra(doan('_t6/out/headers', 2))}
<p>Cùng địa chỉ, cách biểu diễn khác. <code>Accept</code> liệt kê thứ client thích, có thể kèm trọng số: <code>Accept: text/csv, application/json;q=0.8</code> nghĩa là "CSV nếu được, không thì JSON". Máy chủ chọn cái khớp nhất và nói lựa chọn của nó trong <code>Content-Type</code> — luôn đọc <code>Content-Type</code>, không phải <code>Accept</code>, để biết bạn thật sự nhận gì. Nếu không có gì khớp, máy chủ chặt chẽ trả <strong>406 Not Acceptable</strong>.</p>

<h3>Bước 4 — ETag và 304: không tải cùng một thứ hai lần</h3>
${ra(doan('_t6/out/headers', 0, 1))}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Request đầu</span><span class="lz-d">Máy chủ gửi sản phẩm + <code>ETag: "8c50…"</code> (dấu vân tay của phiên bản này) + <code>Cache-Control: no-cache</code> ("hỏi tôi trước khi dùng lại").</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Request sau</span><span class="lz-d">Client gửi <code>If-None-Match: "8c50…"</code> — "tôi có phiên bản này rồi".</span></div>
<div class="lz-step"><span class="lz-k">3a</span><span class="lz-t">Không đổi</span><span class="lz-d"><strong>304 Not Modified</strong>, phần thân rỗng. Dùng lại bản đã lưu.</span></div>
<div class="lz-step"><span class="lz-k">3b</span><span class="lz-t">Đã đổi</span><span class="lz-d">200 với phần thân mới và ETag mới.</span></div>
</div>
<p>Trong trình duyệt bạn không phải viết gì cả. Chromium, quan sát qua DevTools Protocol, khi một trang gọi <code>fetch('/api/products/2')</code> hai lần:</p>
${ra(OUT['_t6/out/etag-browser'])}
<p>Trình duyệt tự thêm <code>If-None-Match</code>, máy chủ trả 304 không phần thân, và trình duyệt trao cho JavaScript một 200 đầy đủ dựng từ bộ đệm. Vì vậy bạn có thể thấy "304" trong thẻ Network trong khi mã của bạn chỉ bao giờ thấy 200.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache-Control: no-store</span><span class="v">Không bao giờ giữ bản sao (dữ liệu riêng tư, trang ngân hàng).</span></div>
  <div class="kv"><span class="k">Cache-Control: no-cache</span><span class="v">Giữ bản sao, nhưng lần nào cũng hỏi lại (thứ API của ta gửi).</span></div>
  <div class="kv"><span class="k">Cache-Control: max-age=600</span><span class="v">Dùng lại trong 10 phút mà không hỏi gì.</span></div>
  <div class="kv"><span class="k">public, max-age=31536000, immutable</span><span class="v">Cho tệp có mã băm trong tên (<code>app.3f9a1c.js</code>): lưu một năm (Bài 14.1).</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "tôi đã đổi dữ liệu mà trang vẫn hiện giá trị cũ".</strong> Response gửi kèm <code>max-age</code> được dùng lại mà không liên lạc máy chủ cho tới khi hết hạn, nên cả việc tải lại trong mã lẫn sửa máy chủ đều vô ích cho tới lúc đó. Với dữ liệu API hay đổi, gửi <code>no-cache</code> (kèm ETag) hoặc <code>no-store</code>; chỉ dùng <code>max-age</code> dài cho tệp mà URL đổi khi nội dung đổi. Khi gỡ lỗi, tích "Disable cache" trong thẻ Network.</p></div>

<h3>Bước 5 — JSON: định dạng mà API nói</h3>
<p>JSON (JavaScript Object Notation) là chữ trông giống literal JavaScript. Gửi dữ liệu nghĩa là <code>JSON.stringify</code>; nhận nghĩa là <code>JSON.parse</code> (mà <code>res.json()</code> gọi giúp bạn). Không phải thứ gì cũng sống sót (output Chromium thật):</p>
${ma('javascript', CODE['6-4/json.js'])}
${ra(OUT['6-4/json'])}
<table>
<thead><tr><th>Giá trị JavaScript</th><th>Sau stringify → parse</th></tr></thead>
<tbody>
<tr><td>chuỗi, số hữu hạn, true/false, null</td><td>Như cũ</td></tr>
<tr><td>mảng, object thường</td><td>Cùng cấu trúc (một bản sao mới)</td></tr>
<tr><td><code>undefined</code>, hàm, Symbol (làm thuộc tính)</td><td>Thuộc tính bị bỏ</td></tr>
<tr><td><code>NaN</code>, <code>Infinity</code></td><td><code>null</code></td></tr>
<tr><td><code>Date</code></td><td>Chuỗi ISO — tự gọi <code>new Date(s)</code></td></tr>
<tr><td><code>Map</code>, <code>Set</code></td><td><code>{}</code> — đổi bằng <code>Object.fromEntries</code> / <code>[...set]</code> trước</td></tr>
<tr><td>số nguyên trên 2<sup>53</sup> − 1</td><td>Bị làm tròn — gửi id lớn dạng chuỗi</td></tr>
</tbody>
</table>

<h3>Bước 6 — JSON nghiêm hơn JavaScript</h3>
<p>Bốn dòng cuối của output đó là lỗi parse. JSON đòi nháy kép quanh mọi tên và chuỗi, không cho dấu phẩy thừa và không có chú thích. Dòng thứ tư là lỗi bạn sẽ gặp nhiều nhất trong dự án thật:</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>Unexpected token '&lt;'</code>.</strong> Mã của bạn gọi <code>res.json()</code>, nhưng phần thân là HTML: trang 404 của dev server vì sai URL, trang 502 của nginx vì API sập, hoặc trang đăng nhập sau một chuyển hướng. Bộ parse JSON không sai — nó đang đọc <code>&lt;!doctype html&gt;</code>. Kiểm <code>res.ok</code> và <code>Content-Type</code> trước khi parse (<code>requestJson</code> ở Bài 6.3 làm cả hai), và xem phần thân response trong thẻ Network.</p></div>

<h3>Bước 7 — những header bạn sẽ thật sự đặt</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Client đặt</span><span class="lz-t">Content-Type · Accept · Authorization</span><span class="lz-d">Chỉ khi gửi phần thân, muốn một định dạng, hay chứng minh bạn là ai. Trình duyệt tự thêm Host, User-Agent, Cookie, Accept-Language, If-None-Match.</span></div>
<div class="lz-layer"><span class="lz-k">Máy chủ đặt</span><span class="lz-t">Content-Type · Location · Cache-Control · ETag · Set-Cookie</span><span class="lz-d"><code>res.json()</code> của Express đặt Content-Type và Content-Length giúp bạn; <code>res.location()</code>, <code>res.set()</code> cho phần còn lại.</span></div>
<div class="lz-layer"><span class="lz-k">Bị cấm đặt</span><span class="lz-t">Host · Content-Length · Cookie · Origin…</span><span class="lz-d">fetch trong trình duyệt lặng lẽ bỏ qua chúng; trình duyệt tự kiểm soát vì lý do bảo mật.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — cùng request, khác header</strong></p>
<ol>
<li>Chạy máy chủ Chương 6. Gửi <code>POST /api/products</code> có phần thân JSON theo ba cách: không Content-Type, <code>text/plain</code>, <code>application/json</code>. Ghi lại từng mã.</li>
<li>Gọi <code>/api/products?limit=3</code> với <code>Accept: text/csv</code>, rồi với <code>Accept: application/json</code>. So <code>Content-Type</code> trong hai response.</li>
<li>Lấy sản phẩm 1 với <code>-i</code>, chép ETag, gửi lại trong <code>If-None-Match</code>. Rồi <code>PATCH</code> sản phẩm 1 và gửi lại ETag cũ.</li>
<li>Trong console trình duyệt ở <code>http://localhost:3456/api/products</code>, chạy một <code>fetch</code> POST quên Content-Type, rồi sửa nó.</li>
<li>Đoán, rồi kiểm trong console: <code>JSON.parse(JSON.stringify({ a: undefined, b: [undefined], d: new Date(0) }))</code>.</li>
</ol>
<p>Gợi ý: trong mảng, <code>undefined</code> không thể bị bỏ mà không làm dịch các phần tử khác, nên nó thành <code>null</code>.</p>
<p><strong>Xong khi:</strong> bước 1 cho 415, 415, 201; bước 2 hiện <code>text/csv</code> rồi <code>application/json</code>; bước 3 cho 304 trước PATCH và 200 kèm ETag mới sau đó; fetch đã sửa trả 201 kèm <code>Location</code>; và bạn đoán bước 5 là <code>{ b: [null], d: "1970-01-01T00:00:00.000Z" }</code>. Sau đó làm module Code Lab 6.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">header</span><span class="v">tiêu đề — dòng Tên: giá trị mô tả thông điệp.</span></div>
  <div class="kv"><span class="k">Content-Type / media type</span><span class="v">kiểu nội dung — phần thân là định dạng gì.</span></div>
  <div class="kv"><span class="k">content negotiation</span><span class="v">thương lượng nội dung — Accept chọn cách biểu diễn.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">nhãn phiên bản của một tài nguyên.</span></div>
  <div class="kv"><span class="k">conditional request</span><span class="v">request có điều kiện — If-None-Match ⇒ có thể 304.</span></div>
  <div class="kv"><span class="k">Cache-Control</span><span class="v">luật lưu đệm — no-store, no-cache, max-age.</span></div>
  <div class="kv"><span class="k">JSON</span><span class="v">định dạng chữ cho dữ liệu có cấu trúc.</span></div>
  <div class="kv"><span class="k">serialize / parse</span><span class="v">tuần tự hoá (stringify) / phân tích (parse).</span></div>
  <div class="kv"><span class="k">415 / 406</span><span class="v">không nhận định dạng gửi lên / không có định dạng client muốn.</span></div>
  <div class="kv"><span class="k">forbidden header</span><span class="v">header cấm — trình duyệt không cho mã JS đặt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Header mô tả thông điệp: định dạng, kích thước, lưu đệm, vị trí, thông tin xác thực.</li>
  <li><code>Content-Type</code> nói cách đọc phần thân <em>này</em>; phần thân JSON cần <code>application/json</code> nếu không máy chủ có thể trả 415 hoặc thấy phần thân rỗng.</li>
  <li><code>Accept</code> xin một định dạng; đọc <code>Content-Type</code> để biết bạn đã nhận gì.</li>
  <li>ETag + If-None-Match ⇒ 304 không phần thân; trình duyệt tự làm và trao cho JS một 200.</li>
  <li><code>no-store</code>, <code>no-cache</code>, <code>max-age</code> quyết định bản sao có được dùng lại không.</li>
  <li>JSON bỏ undefined và hàm, biến NaN thành null và Date thành chuỗi, làm tròn số nguyên quá lớn.</li>
  <li><code>Unexpected token '&lt;'</code> = bạn nhận HTML, không phải JSON. Kiểm mã và Content-Type trước.</li>
</ul>
${nguon('📗', 'MDN — HTTP headers', 'Tra cứu mọi header chuẩn', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers')}
${nguon('📘', 'MDN — HTTP caching', 'Cache-Control, ETag và kiểm tra lại, giải thích kỹ', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-3-5-http-server', title: 'Node.js 3.5 — Máy chủ HTTP với module http', sub: 'Tự đặt mã trạng thái, header và phần thân JSON ở phía máy chủ', cta: 'Mở bài' })}
</div>
`,
};
