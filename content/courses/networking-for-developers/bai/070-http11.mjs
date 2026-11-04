/**
 * Chương 7 · 7.1 — HTTP/1.1 trên dây (slug khung netdev-7-1-http11). Bài MỞ CHƯƠNG 7.
 * Output thật: lab/out/c71-*.out.txt (dựng lại: bash lab/code/dung-output-ch7.sh).
 */
import { run, card, kv, cauNoi, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-07-1.mjs';

const L = card;
const WF = { mon: 'Web Foundations', khoa: 'web-foundations' };

export default {
  title: '7.1 — HTTP/1.1 on the wire|||7.1 — HTTP/1.1 trên dây',
  slug: 'netdev-7-1-http11',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 7: HTTP/1.1 là văn bản thuần — tự gõ một yêu cầu bằng nc và đọc câu trả lời nguyên văn (dòng trạng thái, header, dòng trống, thân); Host bắt buộc (lưu trú ảo theo tên); keep-alive dùng lại một kết nối cho nhiều yêu cầu; Transfer-Encoding: chunked phát một thân chưa biết độ dài; giới hạn ~6 kết nối/origin và các mẹo cũ (sprite, nối tệp, domain sharding) mà HTTP/2 làm lỗi thời.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>HTTP/1.1 on the wire</h2>
<p class="lead">HTTP is the protocol your code speaks all day — every <code>fetch</code>, every API call, every page load. And in its original 1.1 form it is just <strong>text</strong>: a line, some headers, a blank line, and a body. That simplicity is its superpower for a developer, because you can type a request by hand, read a response byte for byte, and stop treating HTTP as a black box. This chapter follows HTTP across three generations; this first lesson reads 1.1 on the wire, shows the two features that made it fast enough to carry the web for twenty years — keep-alive and chunked transfer — and explains the one limit that shaped a whole era of front-end tricks.</p>

<div class="callout info">
<p><strong>🎯 Chapter 7 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Read HTTP/1.1 as plain text</strong> and type a request by hand with <code>nc</code> — status line, headers, body.</li>
<li><strong>Explain HTTP/2</strong>: multiplexing many requests on one connection, HPACK header compression, and why server push was removed — read the actual frames.</li>
<li><strong>Explain HTTP/3 over QUIC</strong> and how a browser discovers and upgrades to it with <code>Alt-Svc</code> (Chapter 5).</li>
<li><strong>Use the headers that change behaviour</strong>: <code>Cache-Control</code>/<code>ETag</code> (caching), <code>Content-Encoding</code> (gzip/brotli), CORS, HSTS.</li>
<li><strong>Find the real client IP</strong> through a proxy chain (<code>X-Forwarded-For</code>) and know when a rate limiter is counting the wrong one.</li>
</ul>
<p><strong>Why a developer needs this:</strong> “the API is slow”, “this page isn’t caching”, “CORS is blocking me”, “the rate limiter banned everyone”, “HTTP/3 doesn’t kick in” are all HTTP problems you <em>read</em> once you can see the protocol. Everything in this chapter is measured on the base lab with real nginx serving HTTP/1.1, HTTP/2 and HTTP/3.</p>
</div>

<h3>HTTP/1.1 is just text</h3>
<p>You do not need a browser to make an HTTP request — you need a TCP connection and the right bytes. Type a request by hand with <code>nc</code> and read the raw reply:</p>
${cmd('docker compose -f compose.yml -p nfd up -d', 'docker exec -it nfd-client bash')}
${run('c71-raw', 'printf', 1)}
<p>A <strong>request</strong> is a request line (<code>GET / HTTP/1.1</code>), some headers, and a blank line. A <strong>response</strong> is a status line (<code>HTTP/1.1 200 OK</code>), some headers, a blank line, and the body. The blank line (<code>\\r\\n\\r\\n</code>) is what separates headers from body — forget it and the server waits forever. That is the entire protocol, and because it is human-readable you can read it in a capture, replay it with <code>nc</code>, and debug it without special tools.</p>
${net('encap', 'http', 'en', 'Watch an HTTP request get wrapped in TCP, IP and Ethernet on the way down — the layers under the text.', { tour: 'encap-layers' })}

<h3>The anatomy of a message</h3>
<table>
<tr><th>Part</th><th>Request</th><th>Response</th></tr>
<tr><td>line 1</td><td><code>GET / HTTP/1.1</code> — method, path, version</td><td><code>HTTP/1.1 200 OK</code> — version, status</td></tr>
<tr><td>headers</td><td><code>Host:</code>, <code>Accept:</code>, <code>Authorization:</code> …</td><td><code>Content-Type:</code>, <code>Content-Length:</code> …</td></tr>
<tr><td>blank line</td><td>ends the headers</td><td>ends the headers</td></tr>
<tr><td>body</td><td>optional (e.g. POST data)</td><td>the content</td></tr>
</table>
<p>The one header 1.1 made <strong>mandatory</strong> is <code>Host</code>. It tells a server that hosts many sites on one IP <em>which</em> site you want — <strong>name-based virtual hosting</strong>. It is the exact HTTP cousin of TLS’s SNI (lesson 6.2): SNI picks the certificate during the handshake, <code>Host</code> picks the virtual host for the request. (The method and status codes themselves — GET/POST/PUT, 200/404/500 — are Web Foundations territory; here we care about the bytes they travel in.)</p>

<h3>Keep-alive: one connection, many requests</h3>
<p>HTTP/1.0 opened a fresh TCP connection for every request and closed it after — paying a handshake each time (lesson 4.1). HTTP/1.1 keeps the connection open by default, so later requests reuse it:</p>
${run('c71-keepalive', 'curl', 1)}
<p>“<strong>Reusing existing connection</strong>”: the second <code>GET</code> rides the open TCP (and, over HTTPS, the open TLS) connection — no second handshake. This was the biggest single improvement of 1.1 over 1.0, and it is still the thing your HTTP client must get right (the connection pools of lesson 4.5). A client that opens and closes a connection per request throws this away.</p>

<h3>Chunked: streaming a body of unknown length</h3>
<p>Usually the server knows the response size and sends <code>Content-Length</code>. But when it is <em>generating</em> the response as it goes — a long report, a streamed AI answer, a live log — it does not know the total up front. HTTP/1.1’s answer is <strong>Transfer-Encoding: chunked</strong>:</p>
${run('c71-chunked', 'printf', 1, { max: 10 })}
<p>Each chunk is a <strong>size line in hexadecimal</strong> (<code>12</code> = 18 bytes) followed by exactly that many bytes, and the stream ends with a zero-size chunk. This is how a response can start arriving at the client before the server has finished producing it — the basis of streaming responses and Server-Sent Events (Chapter 9).</p>

<div class="pitfall co-tieu-de">
<p><strong>A proxy that buffers kills streaming.</strong> Chunked and SSE only stream end-to-end if every hop forwards chunks as they arrive. An nginx in front that buffers the response (<code>proxy_buffering on</code>, the default) will hold the whole body and deliver it at once — your “streaming” endpoint stops streaming. For SSE / chunked passthrough you must turn buffering off at the proxy (<code>proxy_buffering off</code>, <code>X-Accel-Buffering: no</code>). Test through the real proxy, not just against the origin.</p>
</div>

<h3>One request at a time: the limit that shaped the old web</h3>
<p>HTTP/1.1 has a hard constraint: a connection handles <strong>one request-response at a time</strong>. You cannot send request B until response A has come back (pipelining was tried and abandoned as too buggy). To load a page with dozens of assets, browsers open about <strong>six connections per origin</strong> and parallelise across them — but no more than six. A page with 100 small files queues behind those six, and the result is slow. A whole era of front-end engineering existed to dodge this:</p>
<ul>
<li><strong>CSS sprites</strong> — pack many icons into one image to make one request instead of many.</li>
<li><strong>Concatenation / bundling</strong> — glue all JS or CSS into a single file.</li>
<li><strong>Domain sharding</strong> — serve assets from <code>static1.</code>, <code>static2.</code>, … to trick the browser into opening more than six connections.</li>
</ul>
<p>Every one of these is a workaround for 1.1’s serialisation, and <strong>HTTP/2 made them obsolete</strong> (and sometimes harmful) by multiplexing many requests over one connection — the next lesson.</p>
${cauNoi('en', { ...WF, bai: 'wf-6-2-http-methods', so: '6.2', ten: 'HTTP methods: what the request intends', giong: 'the request line, methods (GET/POST/PUT) and status codes of HTTP', khac: 'Web Foundations teaches methods and status codes at the API-design level', them: 'reading the raw request/response bytes with nc, the Host header and virtual hosting, keep-alive measured, chunked transfer, and the 6-connection limit that shaped the old web' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate insists “HTTP is complicated, you need a library.” Show them it is text you can speak by hand, and demonstrate the two features that make it fast.</p>
<ol>
<li>From <code>nfd-client</code>, type a request by hand: <code>printf 'GET / HTTP/1.1\\r\\nHost: labflow.test\\r\\nConnection: close\\r\\n\\r\\n' | nc 10.10.2.10 80</code>. Label the status line, each header, the blank line, and the body.</li>
<li>Show keep-alive: <code>curl -v http://10.10.2.10/ http://10.10.2.10/</code> and find “Reusing existing connection”.</li>
<li>Show chunked: request the streaming endpoint (<code>nc 10.10.2.20 4100</code>) and point out <code>Transfer-Encoding: chunked</code> and a chunk size line.</li>
<li>Explain in two sentences why a 100-asset page was slow on HTTP/1.1 and what sprites/sharding were for.</li>
</ol>
<p><strong>Done when:</strong> you have a hand-typed request with a correct reply, shown the connection being reused, pointed at a chunk size line, and explained the 6-connection limit and its workarounds.</p>
<details><summary>Solution</summary>
<p>The reply is <code>HTTP/1.1 200 OK</code> + headers + blank line + <code>&lt;h1&gt;LabFlow lab&lt;/h1&gt;</code>. <code>curl -v</code> prints <code>Reusing existing connection</code> on the second request. The streaming endpoint returns <code>Transfer-Encoding: chunked</code> with a hex size line before each chunk. “A 100-asset page was slow because HTTP/1.1 does one request at a time per connection and browsers cap at ~6 connections per origin, so most assets queued. Sprites, bundling and domain sharding all existed to work around that serialisation — HTTP/2’s multiplexing removed the need.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['status line (dòng trạng thái)', 'The response’s first line: version + status code + reason (HTTP/1.1 200 OK).'],
  ['header (tiêu đề)', 'A name: value pair carrying metadata; ends at a blank line before the body.'],
  ['Host (header)', 'Mandatory in 1.1; selects the virtual host — the HTTP cousin of TLS’s SNI.'],
  ['keep-alive (giữ kết nối)', 'Reusing one TCP/TLS connection for several requests (default in 1.1).'],
  ['chunked (chia khúc)', 'Transfer-Encoding for a body of unknown length: size line + bytes, ending in a zero chunk.'],
  ['virtual hosting (lưu trú ảo)', 'One server/IP serving many sites, chosen by the Host header.'],
  ['domain sharding', 'An old trick: serving assets from many subdomains to exceed the 6-connection limit.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>HTTP/1.1 is plain text — request line + headers + blank line + body — which you can type by hand with <code>nc</code>.</li>
<li><code>Host</code> is mandatory (name-based virtual hosting), the HTTP cousin of TLS’s SNI.</li>
<li>Keep-alive reuses one connection for many requests (default in 1.1) — the biggest 1.0→1.1 win.</li>
<li>Chunked transfer streams a body of unknown length (hex size line + bytes, ending in a zero chunk).</li>
<li>One request at a time per connection → ~6 connections per origin and the sprite/sharding tricks; HTTP/2 fixes it.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9110', '📄', 'RFC 9110 — HTTP Semantics', 'Methods, status codes, headers — what HTTP means, across versions.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9112', '📄', 'RFC 9112 — HTTP/1.1', 'The 1.1 message syntax: request/status lines, chunked, connection management.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Messages', '📘', 'MDN — HTTP messages', 'The anatomy of requests and responses, with diagrams.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Connection_management_in_HTTP_1.x', '📘', 'MDN — Connection management in HTTP/1.x', 'Keep-alive, the connection limit, and why domain sharding existed.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>HTTP/1.1 trên dây</h2>
<p class="lead">HTTP là giao thức code của bạn nói cả ngày — mỗi <code>fetch</code>, mỗi lời gọi API, mỗi lần tải trang. Và ở dạng 1.1 nguyên bản nó chỉ là <strong>văn bản</strong>: một dòng, vài header, một dòng trống, và một thân. Sự đơn giản đó là siêu năng lực cho lập trình viên, vì bạn gõ được một yêu cầu bằng tay, đọc một câu trả lời từng byte, và thôi coi HTTP là một hộp đen. Chương này đi theo HTTP qua ba thế hệ; bài đầu này đọc 1.1 trên dây, chỉ ra hai tính năng làm nó đủ nhanh để cõng web suốt hai mươi năm — keep-alive và truyền chia khúc — và giải thích một giới hạn đã định hình cả một thời đại mẹo front-end.</p>

<div class="callout info">
<p><strong>🎯 Chương 7 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Đọc HTTP/1.1 như văn bản thuần</strong> và tự gõ một yêu cầu bằng <code>nc</code> — dòng trạng thái, header, thân.</li>
<li><strong>Giải thích HTTP/2</strong>: ghép nhiều yêu cầu trên một kết nối, nén header HPACK, và vì sao server push bị bỏ — đọc chính các frame.</li>
<li><strong>Giải thích HTTP/3 trên QUIC</strong> và một trình duyệt khám phá rồi nâng lên nó thế nào bằng <code>Alt-Svc</code> (Chương 5).</li>
<li><strong>Dùng các header đổi hành vi</strong>: <code>Cache-Control</code>/<code>ETag</code> (cache), <code>Content-Encoding</code> (gzip/brotli), CORS, HSTS.</li>
<li><strong>Tìm IP client thật</strong> qua một chuỗi proxy (<code>X-Forwarded-For</code>) và biết khi nào một bộ giới hạn tốc độ đang đếm nhầm.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> “API chậm”, “trang này không cache”, “CORS chặn mình”, “bộ giới hạn tốc độ cấm cả làng”, “HTTP/3 không kích hoạt” đều là các vấn đề HTTP bạn <em>đọc</em> ra một khi thấy được giao thức. Mọi thứ trong chương này đều đo trên lab cơ bản với nginx thật phục vụ HTTP/1.1, HTTP/2 và HTTP/3.</p>
</div>

<h3>HTTP/1.1 chỉ là văn bản</h3>
<p>Bạn không cần một trình duyệt để tạo một yêu cầu HTTP — bạn cần một kết nối TCP và đúng các byte. Tự gõ một yêu cầu bằng <code>nc</code> và đọc câu trả lời nguyên văn:</p>
${cmd('docker compose -f compose.yml -p nfd up -d', 'docker exec -it nfd-client bash')}
${run('c71-raw', 'printf', 1)}
<p>Một <strong>yêu cầu</strong> là một dòng yêu cầu (<code>GET / HTTP/1.1</code>), vài header, và một dòng trống. Một <strong>câu trả lời</strong> là một dòng trạng thái (<code>HTTP/1.1 200 OK</code>), vài header, một dòng trống, và thân. Dòng trống (<code>\\r\\n\\r\\n</code>) là thứ tách header khỏi thân — quên nó thì máy chủ chờ mãi. Đó là toàn bộ giao thức, và vì nó con người đọc được, bạn đọc nó trong một bản bắt gói, phát lại nó với <code>nc</code>, và gỡ lỗi nó mà không cần công cụ đặc biệt.</p>
${net('encap', 'http', 'vi', 'Xem một yêu cầu HTTP được bọc trong TCP, IP và Ethernet trên đường đi xuống — các tầng dưới văn bản.', { tour: 'encap-layers' })}

<h3>Cấu tạo một thông điệp</h3>
<table>
<tr><th>Phần</th><th>Yêu cầu</th><th>Câu trả lời</th></tr>
<tr><td>dòng 1</td><td><code>GET / HTTP/1.1</code> — method, đường dẫn, phiên bản</td><td><code>HTTP/1.1 200 OK</code> — phiên bản, trạng thái</td></tr>
<tr><td>header</td><td><code>Host:</code>, <code>Accept:</code>, <code>Authorization:</code> …</td><td><code>Content-Type:</code>, <code>Content-Length:</code> …</td></tr>
<tr><td>dòng trống</td><td>kết thúc header</td><td>kết thúc header</td></tr>
<tr><td>thân</td><td>tuỳ chọn (vd dữ liệu POST)</td><td>nội dung</td></tr>
</table>
<p>Header mà 1.1 làm <strong>bắt buộc</strong> là <code>Host</code>. Nó cho một máy chủ chứa nhiều site trên một IP biết bạn muốn <em>site nào</em> — <strong>lưu trú ảo theo tên (name-based virtual hosting)</strong>. Nó đúng là anh em HTTP của SNI của TLS (bài 6.2): SNI chọn chứng chỉ trong cú bắt tay, <code>Host</code> chọn host ảo cho yêu cầu. (Bản thân method và mã trạng thái — GET/POST/PUT, 200/404/500 — là lãnh địa Nền tảng Web; ở đây ta quan tâm các byte chúng đi trong đó.)</p>

<h3>Keep-alive: một kết nối, nhiều yêu cầu</h3>
<p>HTTP/1.0 mở một kết nối TCP mới cho mỗi yêu cầu và đóng sau đó — trả một cú bắt tay mỗi lần (bài 4.1). HTTP/1.1 giữ kết nối mở mặc định, nên các yêu cầu sau dùng lại nó:</p>
${run('c71-keepalive', 'curl', 1)}
<p>“<strong>Reusing existing connection</strong>”: <code>GET</code> thứ hai đi trên kết nối TCP đang mở (và, qua HTTPS, kết nối TLS đang mở) — không cú bắt tay thứ hai. Đây là cải tiến lớn nhất của 1.1 so với 1.0, và vẫn là thứ HTTP client của bạn phải làm đúng (các pool kết nối ở bài 4.5). Một client mở và đóng một kết nối mỗi yêu cầu vứt điều này đi.</p>

<h3>Chunked: phát một thân chưa biết độ dài</h3>
<p>Thường máy chủ biết cỡ câu trả lời và gửi <code>Content-Length</code>. Nhưng khi nó đang <em>sinh ra</em> câu trả lời dần — một báo cáo dài, một câu trả lời AI phát dòng, một log trực tiếp — nó không biết tổng ngay. Câu trả lời của HTTP/1.1 là <strong>Transfer-Encoding: chunked</strong>:</p>
${run('c71-chunked', 'printf', 1, { max: 10 })}
<p>Mỗi khúc là một <strong>dòng kích thước dạng thập lục phân</strong> (<code>12</code> = 18 byte) theo sau bởi đúng bấy nhiêu byte, và dòng phát kết thúc bằng một khúc kích thước không. Đây là cách một câu trả lời có thể bắt đầu tới client trước khi máy chủ xong việc sinh ra nó — nền tảng của câu trả lời phát dòng và Server-Sent Events (Chương 9).</p>

<div class="pitfall co-tieu-de">
<p><strong>Một proxy đệm giết phát dòng.</strong> Chunked và SSE chỉ phát dòng từ đầu tới cuối nếu mọi chặng chuyển các khúc ngay khi tới. Một nginx đứng trước đệm câu trả lời (<code>proxy_buffering on</code>, mặc định) sẽ giữ cả thân và giao một lần — điểm cuối “phát dòng” của bạn thôi phát dòng. Để chuyển thẳng SSE / chunked bạn phải tắt đệm ở proxy (<code>proxy_buffering off</code>, <code>X-Accel-Buffering: no</code>). Thử qua proxy thật, không chỉ với origin.</p>
</div>

<h3>Một yêu cầu một lúc: giới hạn đã định hình web cũ</h3>
<p>HTTP/1.1 có một ràng buộc cứng: một kết nối xử lý <strong>một yêu cầu-đáp một lúc</strong>. Bạn không gửi được yêu cầu B tới khi câu trả lời A về (pipelining từng được thử và bỏ vì quá nhiều lỗi). Để tải một trang có hàng chục tài nguyên, trình duyệt mở khoảng <strong>sáu kết nối mỗi origin</strong> và song song trên chúng — nhưng không hơn sáu. Một trang có 100 tệp nhỏ xếp hàng sau sáu cái đó, và kết quả là chậm. Cả một thời đại kỹ thuật front-end tồn tại để né điều này:</p>
<ul>
<li><strong>CSS sprite</strong> — nhét nhiều biểu tượng vào một ảnh để tạo một yêu cầu thay vì nhiều.</li>
<li><strong>Gộp / bundling</strong> — dán tất cả JS hay CSS thành một tệp.</li>
<li><strong>Domain sharding</strong> — phục vụ tài nguyên từ <code>static1.</code>, <code>static2.</code>, … để lừa trình duyệt mở hơn sáu kết nối.</li>
</ul>
<p>Mỗi cái trong số này là một cách lách sự nối tiếp của 1.1, và <strong>HTTP/2 làm chúng lỗi thời</strong> (và đôi khi có hại) bằng cách ghép nhiều yêu cầu trên một kết nối — bài kế.</p>
${cauNoi('vi', { ...WF, bai: 'wf-6-2-http-methods', so: '6.2', ten: 'HTTP method: request định làm gì', giong: 'dòng yêu cầu, các method (GET/POST/PUT) và mã trạng thái của HTTP', khac: 'khoá Nền tảng Web dạy method và mã trạng thái ở mức thiết kế API', them: 'đọc byte yêu cầu/câu trả lời thô bằng nc, header Host và lưu trú ảo, keep-alive đo được, truyền chia khúc, và giới hạn 6 kết nối đã định hình web cũ' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một đồng nghiệp khăng khăng “HTTP phức tạp, phải dùng thư viện.” Hãy cho họ thấy nó là văn bản bạn nói được bằng tay, và trình diễn hai tính năng làm nó nhanh.</p>
<ol>
<li>Từ <code>nfd-client</code>, tự gõ một yêu cầu: <code>printf 'GET / HTTP/1.1\\r\\nHost: labflow.test\\r\\nConnection: close\\r\\n\\r\\n' | nc 10.10.2.10 80</code>. Gắn nhãn dòng trạng thái, từng header, dòng trống, và thân.</li>
<li>Cho thấy keep-alive: <code>curl -v http://10.10.2.10/ http://10.10.2.10/</code> và tìm “Reusing existing connection”.</li>
<li>Cho thấy chunked: hỏi điểm cuối phát dòng (<code>nc 10.10.2.20 4100</code>) và chỉ ra <code>Transfer-Encoding: chunked</code> cùng một dòng kích thước khúc.</li>
<li>Giải thích trong hai câu vì sao một trang 100 tài nguyên chậm trên HTTP/1.1 và sprite/sharding dùng để làm gì.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một yêu cầu gõ tay với câu trả lời đúng, cho thấy kết nối được dùng lại, chỉ vào một dòng kích thước khúc, và giải thích giới hạn 6 kết nối cùng các cách lách.</p>
<details><summary>Lời giải</summary>
<p>Câu trả lời là <code>HTTP/1.1 200 OK</code> + header + dòng trống + <code>&lt;h1&gt;LabFlow lab&lt;/h1&gt;</code>. <code>curl -v</code> in <code>Reusing existing connection</code> ở yêu cầu thứ hai. Điểm cuối phát dòng trả <code>Transfer-Encoding: chunked</code> với một dòng kích thước hex trước mỗi khúc. “Một trang 100 tài nguyên chậm vì HTTP/1.1 làm một yêu cầu một lúc mỗi kết nối và trình duyệt chặn ở ~6 kết nối mỗi origin, nên phần lớn tài nguyên xếp hàng. Sprite, bundling và domain sharding đều tồn tại để né sự nối tiếp đó — ghép kênh của HTTP/2 bỏ nhu cầu ấy.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['status line (dòng trạng thái)', 'Dòng đầu của câu trả lời: phiên bản + mã trạng thái + lý do (HTTP/1.1 200 OK).'],
  ['header (tiêu đề)', 'Một cặp tên: giá trị mang thông tin phụ; kết thúc ở một dòng trống trước thân.'],
  ['Host (header)', 'Bắt buộc trong 1.1; chọn host ảo — anh em HTTP của SNI của TLS.'],
  ['keep-alive (giữ kết nối)', 'Dùng lại một kết nối TCP/TLS cho nhiều yêu cầu (mặc định trong 1.1).'],
  ['chunked (chia khúc)', 'Transfer-Encoding cho một thân chưa biết độ dài: dòng kích thước + byte, kết thúc bằng khúc không.'],
  ['virtual hosting (lưu trú ảo)', 'Một máy chủ/IP phục vụ nhiều site, chọn bằng header Host.'],
  ['domain sharding', 'Một mẹo cũ: phục vụ tài nguyên từ nhiều subdomain để vượt giới hạn 6 kết nối.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>HTTP/1.1 là văn bản thuần — dòng yêu cầu + header + dòng trống + thân — bạn gõ tay được bằng <code>nc</code>.</li>
<li><code>Host</code> bắt buộc (lưu trú ảo theo tên), anh em HTTP của SNI của TLS.</li>
<li>Keep-alive dùng lại một kết nối cho nhiều yêu cầu (mặc định trong 1.1) — thắng lợi lớn nhất 1.0→1.1.</li>
<li>Truyền chia khúc phát một thân chưa biết độ dài (dòng kích thước hex + byte, kết thúc bằng khúc không).</li>
<li>Một yêu cầu một lúc mỗi kết nối → ~6 kết nối/origin và các mẹo sprite/sharding; HTTP/2 sửa nó.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9110', '📄', 'RFC 9110 — Ngữ nghĩa HTTP', 'Method, mã trạng thái, header — HTTP nghĩa là gì, xuyên các phiên bản.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9112', '📄', 'RFC 9112 — HTTP/1.1', 'Cú pháp thông điệp 1.1: dòng yêu cầu/trạng thái, chunked, quản lý kết nối.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Messages', '📘', 'MDN — Thông điệp HTTP', 'Cấu tạo yêu cầu và câu trả lời, kèm sơ đồ.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Connection_management_in_HTTP_1.x', '📘', 'MDN — Quản lý kết nối trong HTTP/1.x', 'Keep-alive, giới hạn kết nối, và vì sao domain sharding tồn tại.', 'Mở')}
</div>
`,
};
