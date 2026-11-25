/**
 * 10.2 — Đọc access và error log của nginx (soạn 24/11/2026).
 * Output thật: OUT['s10/nginx-doc'] — log Lab 10 (nginx 1.27, định dạng "main" = combined + rt/urt/rid, và bản JSON escape=json).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '10.2 — Reading nginx access and error logs field by field|||10.2 — Đọc access và error log của nginx: định dạng combined từng trường, request_time vs upstream_response_time, dòng lỗi hay gặp',
  slug: 'log-10-2-nginx-access-error',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tách một dòng combined thành từng trường bằng awk -F\'"\'; ba trường nên thêm (request_time, upstream_response_time, request_id) và cách dùng chúng để biết chậm ở nginx hay ở app; tìm request chậm nhất và trung bình theo endpoint; giải phẫu một dòng error log (giờ, mức, pid#tid, *số kết nối) và bảng mười dòng lỗi hay gặp; cùng log đó dưới dạng JSON để hỏi bằng jq. Tất cả chạy thật trên log của Lab 10.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>nginx logs field by field: what happened, how long it took, and why it failed</h2>
<p class="lead">nginx writes two logs. The <strong>access log</strong> has one line per request — the "what": who asked for what, what they got, how big, how long. The <strong>error log</strong> has one line per problem — the "why": timeouts, refused connections, limits, missing files. Reading them side by side answers most web incidents in minutes. This lesson is about <em>reading</em>; configuring the formats in depth is taught in the nginx course (links at the end).</p>

<h3>The everyday picture: the till receipt and the manager's notebook</h3>
<p>A shop's till prints a receipt for every sale: time, items, total. That is the access log — complete, boring, perfect for counting. The manager keeps a notebook only for problems: "14:05 card reader froze", "16:20 ran out of bags". That is the error log — short, irregular, and the only place that says <em>why</em>. A receipt saying "refund" tells you something went wrong; the notebook tells you what.</p>

<h3>Step 1 — one access line, split into its parts</h3>
${lenh('s10/nginx-doc', 0)}
${lenh('s10/nginx-doc', 1)}
<p>Splitting on the double quote (<code>-F'"'</code>) is the safest way to cut a combined line, because the request line and the user agent contain spaces. The parts:</p>
<table>
<thead><tr><th>Part</th><th>Variable</th><th>Meaning / trap</th></tr></thead>
<tbody>
<tr><td><code>172.17.0.1</code></td><td><code>$remote_addr</code></td><td>Who connected <em>to nginx</em>. Behind a CDN or load balancer this is the CDN, unless the real-IP module rewrites it (our lab does, for every request it parses).</td></tr>
<tr><td><code>- -</code></td><td><code>-</code> and <code>$remote_user</code></td><td>Historical ident field (always <code>-</code>) and the HTTP Basic auth user.</td></tr>
<tr><td><code>[23/Nov/2026:20:34:33 +0000]</code></td><td><code>$time_local</code></td><td>When the request <em>finished</em> (when the line was written), with the server's offset. +0000 = UTC.</td></tr>
<tr><td><code>GET /api/products HTTP/1.1</code></td><td><code>$request</code></td><td>Method, path <em>with query string</em>, protocol. Query strings can contain tokens — see lesson 16.3.</td></tr>
<tr><td><code>200 38</code></td><td><code>$status $body_bytes_sent</code></td><td>Status and size of the body (not headers). 0 bytes with 200 is suspicious.</td></tr>
<tr><td><code>"-"</code></td><td><code>$http_referer</code></td><td>The page that linked here; <code>-</code> for API calls and typed URLs.</td></tr>
<tr><td><code>"curl/8.18.0"</code></td><td><code>$http_user_agent</code></td><td>What the client <em>claims</em> to be. Free text, trivially faked, sometimes an attack itself (10.9).</td></tr>
<tr><td><code>rt=0.028</code></td><td><code>$request_time</code></td><td>Seconds from the first byte read from the client to the last byte sent — the user's waiting time as nginx saw it.</td></tr>
<tr><td><code>urt=0.029</code></td><td><code>$upstream_response_time</code></td><td>Seconds the upstream (app) took. <code>-</code> = no upstream. Several values separated by <code>,</code> = nginx tried several upstreams.</td></tr>
<tr><td><code>rid=8363…</code></td><td><code>$request_id</code></td><td>Random 32-hex id nginx generates per request; we pass it to the app as <code>X-Request-Id</code> so both logs share it.</td></tr>
</tbody></table>
<p>Why is <code>urt</code> (0.029) larger than <code>rt</code> (0.028) here? Both are rounded to milliseconds and measured by different clocks inside nginx; a 1 ms difference is noise. Differences of tenths of a second are not.</p>

<div class="pitfall co-tieu-de"><p><strong>The default "combined" format has no timing.</strong> Out of the box nginx writes combined: no <code>$request_time</code>, no upstream time, no request id. You cannot answer "is it slow?" from a default access log. If you are allowed to change one thing on a project's nginx, add those three fields (nginx course 10.1).</p></div>

<h3>Step 2 — slow requests, and slow endpoints</h3>
${lenh('s10/nginx-doc', 2)}
${lenh('s10/nginx-doc', 3)}
<p>The single slowest line is the 5.000 s timeout (lesson 10.1). But the endpoint that hurts users is <code>/api/report</code>: 63 requests averaging 1.37 s, while <code>/api/products</code> averages 19 ms. Averages hide tails — the real tool is a percentile (p95, p99), taught in Chapter 15 and in the observability course; for a quick look, sort and read the top lines as above. The awk trick <code>split($7, p, "?")</code> drops the query string so <code>/api/products?id=1</code> and <code>/api/products</code> count as one endpoint.</p>

<h3>Step 3 — nginx or the app? Compare rt and urt</h3>
${lenh('s10/nginx-doc', 4)}
<ul>
<li><strong><code>rt ≈ urt</code></strong> (most lines): the time was spent in the app. Look at the app.</li>
<li><strong><code>rt ≫ urt</code></strong>: the app answered quickly but sending to the client took long — a slow mobile network, a huge response, or a client reading slowly. The app team is innocent.</li>
<li><strong><code>urt=-</code></strong>: nginx answered alone (static file, 403, 413, 429, cache hit).</li>
<li><strong>499 with <code>rt = urt = 0.500</code></strong>: the client left at 0.5 s and nginx cut the upstream request at the same moment.</li>
<li><strong>504 with <code>5.000</code></strong>: exactly <code>proxy_read_timeout</code>. Round numbers in timing fields are configuration, not chance.</li>
</ul>

<h3>Step 4 — anatomy of an error line</h3>
${lenh('s10/nginx-doc', 5)}
<p><code>2026/11/23 20:34:36</code> — time (different format from the access log!) · <code>[error]</code> — level · <code>30#30</code> — worker process id # thread id · <code>*32</code> — connection number, the same for every error line of one connection · then the message, and the context: <code>client</code>, <code>server</code>, <code>request</code>, <code>upstream</code>, <code>host</code>. Levels, from noisiest: <code>debug, info, notice, warn, error, crit, alert, emerg</code>. The <code>error_log … warn;</code> line in our config means warn and above are written.</p>
<p>Count error lines by <em>kind</em>, not by exact text — strip the variable parts (time, ids, quoted values) and count what is left:</p>
${lenh('s10/nginx-doc', 6)}

<h3>The ten error lines you will meet at work</h3>
<table>
<thead><tr><th>Message (shortened)</th><th>Means</th><th>Usually goes with</th></tr></thead>
<tbody>
<tr><td><code>connect() failed (111: Connection refused) while connecting to upstream</code></td><td>Nothing listening on the app port</td><td>502 — app down or restarting</td></tr>
<tr><td><code>upstream prematurely closed connection</code></td><td>App closed the socket mid-answer (crashed, killed)</td><td>502</td></tr>
<tr><td><code>upstream timed out (110: Operation timed out)</code></td><td>App did not answer within proxy_read_timeout</td><td>504</td></tr>
<tr><td><code>no live upstreams while connecting to upstream</code></td><td>All servers in the upstream group marked failed</td><td>502 burst</td></tr>
<tr><td><code>upstream sent too big header</code></td><td>App's response headers (often huge cookies) exceed proxy buffers</td><td>502</td></tr>
<tr><td><code>client intended to send too large body</code></td><td>Upload above client_max_body_size</td><td>413</td></tr>
<tr><td><code>limiting requests, excess: … by zone</code></td><td>Rate limit hit</td><td>429 / 503</td></tr>
<tr><td><code>open() "…" failed (2: No such file or directory)</code></td><td>Static file missing (scanners trigger thousands)</td><td>404</td></tr>
<tr><td><code>open() "…" failed (13: Permission denied)</code></td><td>nginx user cannot read the file</td><td>403 — check file owner, SELinux</td></tr>
<tr><td><code>worker_connections are not enough</code></td><td>Connection limit reached under load</td><td>Dropped/slow connections</td></tr>
</tbody></table>
<p>The numbers in parentheses (2, 13, 104, 110, 111) are Linux <code>errno</code> codes: 2 ENOENT, 13 EACCES, 104 ECONNRESET, 110 ETIMEDOUT, 111 ECONNREFUSED. They are the same in Node error messages (10.4) — learn them once.</p>

<h3>Step 5 — the same log as JSON</h3>
${lenh('s10/nginx-doc', 7)}
${lenh('s10/nginx-doc', 8)}
<p>The second access log uses <code>log_format json escape=json</code>: one JSON object per line, numbers as numbers, quotes and control characters escaped. jq can now group 5xx by endpoint (replacing order ids with <code>:id</code>): 29 × 500 all on <code>/api/orders/:id</code> (the app bug), 20 × 502 spread over every endpoint (the app crash — it did not care which page you asked for). That contrast alone tells you "one broken feature" versus "whole app down". <code>urt</code> is a string because it can hold <code>"-"</code> or a list.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>"The site is slow" ticket at an outsourcing company:</strong> before touching code, run Step 2 and 3 for the last hour. If <code>rt ≈ urt</code> on one endpoint, hand the app team the endpoint and the numbers; if <code>rt ≫ urt</code>, the problem is network or payload size. Your ticket comment with three lines of evidence saves a day of guessing.</li>
<li><strong>On a VPS you rent for your own project:</strong> <code>/var/log/nginx/error.log</code> full of <code>open() "/var/www/html/wp-login.php" failed</code> is not an attack on you specifically — it is the background noise of the Internet (10.9). Do not panic; do make sure those paths really do not exist.</li>
<li><strong>What if</strong> the access log is empty but users get errors? Check the server block actually has <code>access_log</code> (or <code>access_log off;</code> somewhere), the disk is not full (Chapter 8), and that requests even reach this nginx (DNS/CDN — Chapter 13).</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>On your Lab 10 logs, print for each status code the average <code>rt</code> (awk with an array keyed by <code>$9</code>).</li>
<li>Find the connection number (<code>*N</code>) of the 504 in the error log, then all error lines with that number.</li>
<li>Rewrite Step 2's per-endpoint average with jq on <code>access.json</code> (<code>group_by</code>, <code>add / length</code> — lesson 2.4).</li>
<li>Explain, using one line each, the difference between a 502 with <em>prematurely closed</em> and a 502 with <em>connect() failed</em>.</li>
</ol>
<p><strong>Done when:</strong> 1 shows 504 ≈ 5.0 s and 429 ≈ 0.0 s; 2 prints exactly one line; 3 gives the same 1.366 s for <code>/api/report</code> (± your own run); 4 names "died while answering" versus "nothing listening".</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['combined', 'nginx/Apache default access-log format: IP, user, time, request, status, bytes, referer, user agent.'],
  ['$request_time', 'Time from first client byte read to last byte sent, in seconds with ms resolution.'],
  ['$upstream_response_time', 'Time the upstream took; "-" if none, comma-separated if several were tried.'],
  ['$request_id', '32-hex random id per request; pass it on as X-Request-Id to correlate logs.'],
  ['error log level', 'debug, info, notice, warn, error, crit, alert, emerg — error_log writes the given level and above.'],
  ['errno', 'Linux error number in messages: 2 ENOENT, 13 EACCES, 104 ECONNRESET, 110 ETIMEDOUT, 111 ECONNREFUSED.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Access log = what/who/how long; error log = why. Read them together, matched by time and client.</li>
<li>Cut combined lines on <code>"</code>; add <code>rt</code>, <code>urt</code>, <code>rid</code> to any format you control.</li>
<li><code>rt ≈ urt</code> → app; <code>rt ≫ urt</code> → client/network; <code>urt=-</code> → nginx alone; round numbers → a timeout setting.</li>
<li>Count error lines by kind after stripping variable parts; learn the ten common messages and their errno.</li>
<li>JSON access logs make grouping by endpoint/status a one-liner — and show "one feature broken" vs "whole app down".</li>
</ul>
${nguon('📘', 'nginx — ngx_http_log_module', 'log_format, access_log, escape=json, buffering, every variable', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
${nguon('📘', 'nginx — error_log directive', 'Levels and where errors are written', 'https://nginx.org/en/docs/http/ngx_http_core_module.html#error_log')}
${lienKet({ khoa: 'nginx', bai: 'nginx-10-1-log-mac-dinh-bo-sot', title: 'nginx 10.1 — What the default log misses', sub: 'Configuring the fields you just learned to read', cta: 'Open lesson' })}
${lienKet({ khoa: 'nginx', bai: 'nginx-10-2-log-json-escape', title: 'nginx 10.2 — JSON logs and escaping', sub: 'Why escape=json matters', cta: 'Open lesson' })}
${lienKet({ khoa: 'nginx', bai: 'nginx-10-4-error-log-va-cac-muc', title: 'nginx 10.4 — error_log and its levels', sub: 'Choosing the level, per-server error logs', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Log nginx từng trường: chuyện gì đã xảy ra, mất bao lâu, và vì sao hỏng</h2>
<p class="lead">nginx ghi hai log. <strong>Access log</strong> mỗi request một dòng — phần "cái gì": ai xin cái gì, nhận được gì, to bao nhiêu, mất bao lâu. <strong>Error log</strong> mỗi sự cố một dòng — phần "vì sao": hết giờ chờ, bị từ chối kết nối, chạm giới hạn, thiếu tệp. Đọc song song hai log trả lời được phần lớn sự cố web trong vài phút. Bài này dạy <em>đọc</em>; cấu hình định dạng chuyên sâu được dạy ở khoá nginx (liên kết cuối bài).</p>

<h3>Liên tưởng đời thường: hoá đơn ở quầy và sổ tay của quản lý</h3>
<p>Máy tính tiền của cửa hàng in hoá đơn cho mọi lần bán: giờ, món, tổng tiền. Đó là access log — đầy đủ, nhàm chán, hoàn hảo để đếm. Quản lý cửa hàng có một cuốn sổ chỉ ghi sự cố: "14:05 máy quẹt thẻ đứng", "16:20 hết túi". Đó là error log — ngắn, thất thường, và là nơi duy nhất nói <em>vì sao</em>. Một hoá đơn ghi "hoàn tiền" cho bạn biết có gì đó không ổn; cuốn sổ cho bạn biết đó là gì.</p>

<h3>Bước 1 — một dòng access, tách thành từng phần</h3>
${lenh('s10/nginx-doc', 0)}
${lenh('s10/nginx-doc', 1)}
<p>Tách theo dấu nháy kép (<code>-F'"'</code>) là cách an toàn nhất để cắt một dòng combined, vì dòng request và user agent có chứa dấu cách. Các phần:</p>
<table>
<thead><tr><th>Phần</th><th>Biến</th><th>Ý nghĩa / bẫy</th></tr></thead>
<tbody>
<tr><td><code>172.17.0.1</code></td><td><code>$remote_addr</code></td><td>Ai kết nối <em>tới nginx</em>. Sau CDN hay load balancer thì đây là CDN, trừ khi module real-IP ghi đè (lab của ta có, với mọi request nginx phân tích được).</td></tr>
<tr><td><code>- -</code></td><td><code>-</code> và <code>$remote_user</code></td><td>Trường ident lịch sử (luôn là <code>-</code>) và người dùng HTTP Basic auth.</td></tr>
<tr><td><code>[23/Nov/2026:20:34:33 +0000]</code></td><td><code>$time_local</code></td><td>Lúc request <em>kết thúc</em> (lúc dòng được ghi), kèm độ lệch múi giờ của server. +0000 = UTC.</td></tr>
<tr><td><code>GET /api/products HTTP/1.1</code></td><td><code>$request</code></td><td>Phương thức, đường dẫn <em>kèm query string</em>, giao thức. Query string có thể chứa token — xem bài 16.3.</td></tr>
<tr><td><code>200 38</code></td><td><code>$status $body_bytes_sent</code></td><td>Mã trạng thái và kích thước body (không tính header). 200 mà 0 byte là đáng ngờ.</td></tr>
<tr><td><code>"-"</code></td><td><code>$http_referer</code></td><td>Trang đã dẫn tới đây; <code>-</code> với lời gọi API và URL gõ tay.</td></tr>
<tr><td><code>"curl/8.18.0"</code></td><td><code>$http_user_agent</code></td><td>Thứ mà khách <em>tự xưng</em>. Chữ tự do, giả mạo dễ ợt, đôi khi chính nó là đòn tấn công (10.9).</td></tr>
<tr><td><code>rt=0.028</code></td><td><code>$request_time</code></td><td>Số giây từ byte đầu tiên đọc từ khách tới byte cuối cùng gửi đi — thời gian người dùng chờ, theo góc nhìn của nginx.</td></tr>
<tr><td><code>urt=0.029</code></td><td><code>$upstream_response_time</code></td><td>Số giây upstream (app) xử lý. <code>-</code> = không có upstream. Nhiều giá trị cách nhau bởi <code>,</code> = nginx đã thử nhiều upstream.</td></tr>
<tr><td><code>rid=8363…</code></td><td><code>$request_id</code></td><td>Mã ngẫu nhiên 32 ký tự hex nginx sinh cho mỗi request; ta chuyển nó sang app bằng <code>X-Request-Id</code> để hai log dùng chung.</td></tr>
</tbody></table>
<p>Vì sao <code>urt</code> (0,029) lại lớn hơn <code>rt</code> (0,028) ở đây? Cả hai được làm tròn tới mili giây và đo bằng hai đồng hồ khác nhau trong nginx; lệch 1 ms là nhiễu. Lệch vài phần mười giây thì không.</p>

<div class="pitfall co-tieu-de"><p><strong>Định dạng "combined" mặc định không có thời gian xử lý.</strong> Cài xong, nginx ghi combined: không có <code>$request_time</code>, không có thời gian upstream, không có request id. Bạn không thể trả lời "có chậm không?" từ access log mặc định. Nếu được phép đổi một thứ trên nginx của dự án, hãy thêm ba trường đó (khoá nginx bài 10.1).</p></div>

<h3>Bước 2 — request chậm, và endpoint chậm</h3>
${lenh('s10/nginx-doc', 2)}
${lenh('s10/nginx-doc', 3)}
<p>Dòng chậm nhất là cú hết giờ 5,000 giây (bài 10.1). Nhưng endpoint làm khổ người dùng là <code>/api/report</code>: 63 request, trung bình 1,37 giây, trong khi <code>/api/products</code> trung bình 19 ms. Trung bình che mất phần đuôi — công cụ đúng là phân vị (p95, p99), dạy ở Chương 15 và khoá observability; để xem nhanh, xếp rồi đọc mấy dòng đầu như trên. Mẹo awk <code>split($7, p, "?")</code> bỏ query string để <code>/api/products?id=1</code> và <code>/api/products</code> được tính là một endpoint.</p>

<h3>Bước 3 — nginx hay app? So rt và urt</h3>
${lenh('s10/nginx-doc', 4)}
<ul>
<li><strong><code>rt ≈ urt</code></strong> (đa số dòng): thời gian tiêu trong app. Nhìn vào app.</li>
<li><strong><code>rt ≫ urt</code></strong>: app trả lời nhanh nhưng gửi về khách lâu — mạng di động chậm, phản hồi quá to, hoặc khách đọc chậm. Đội app vô can.</li>
<li><strong><code>urt=-</code></strong>: nginx tự trả lời (tệp tĩnh, 403, 413, 429, trúng cache).</li>
<li><strong>499 với <code>rt = urt = 0.500</code></strong>: khách bỏ đi lúc 0,5 giây và nginx cắt luôn request sang upstream cùng lúc.</li>
<li><strong>504 với <code>5.000</code></strong>: đúng bằng <code>proxy_read_timeout</code>. Số tròn trong trường thời gian là cấu hình, không phải ngẫu nhiên.</li>
</ul>

<h3>Bước 4 — giải phẫu một dòng lỗi</h3>
${lenh('s10/nginx-doc', 5)}
<p><code>2026/11/23 20:34:36</code> — thời điểm (khác định dạng với access log!) · <code>[error]</code> — mức · <code>30#30</code> — mã tiến trình worker # mã luồng · <code>*32</code> — số thứ tự kết nối, giống nhau ở mọi dòng lỗi của cùng một kết nối · rồi đến thông điệp và ngữ cảnh: <code>client</code>, <code>server</code>, <code>request</code>, <code>upstream</code>, <code>host</code>. Các mức, từ ồn nhất: <code>debug, info, notice, warn, error, crit, alert, emerg</code>. Dòng <code>error_log … warn;</code> trong cấu hình của ta nghĩa là ghi từ warn trở lên.</p>
<p>Đếm dòng lỗi theo <em>loại</em>, không theo chữ y hệt — bỏ các phần thay đổi (giờ, mã số, giá trị trong nháy) rồi đếm phần còn lại:</p>
${lenh('s10/nginx-doc', 6)}

<h3>Mười dòng lỗi bạn sẽ gặp khi đi làm</h3>
<table>
<thead><tr><th>Thông điệp (rút gọn)</th><th>Nghĩa là</th><th>Thường đi cùng</th></tr></thead>
<tbody>
<tr><td><code>connect() failed (111: Connection refused) while connecting to upstream</code></td><td>Không có gì lắng nghe ở cổng app</td><td>502 — app tắt hoặc đang khởi động lại</td></tr>
<tr><td><code>upstream prematurely closed connection</code></td><td>App đóng socket giữa chừng (sập, bị giết)</td><td>502</td></tr>
<tr><td><code>upstream timed out (110: Operation timed out)</code></td><td>App không trả lời trong proxy_read_timeout</td><td>504</td></tr>
<tr><td><code>no live upstreams while connecting to upstream</code></td><td>Mọi server trong nhóm upstream đều bị đánh dấu hỏng</td><td>Một loạt 502</td></tr>
<tr><td><code>upstream sent too big header</code></td><td>Header phản hồi của app (thường do cookie khổng lồ) vượt bộ đệm proxy</td><td>502</td></tr>
<tr><td><code>client intended to send too large body</code></td><td>Tải lên vượt client_max_body_size</td><td>413</td></tr>
<tr><td><code>limiting requests, excess: … by zone</code></td><td>Chạm giới hạn tốc độ</td><td>429 / 503</td></tr>
<tr><td><code>open() "…" failed (2: No such file or directory)</code></td><td>Thiếu tệp tĩnh (máy quét gây ra hàng nghìn dòng)</td><td>404</td></tr>
<tr><td><code>open() "…" failed (13: Permission denied)</code></td><td>Người dùng chạy nginx không đọc được tệp</td><td>403 — kiểm tra chủ sở hữu tệp, SELinux</td></tr>
<tr><td><code>worker_connections are not enough</code></td><td>Hết suất kết nối khi tải cao</td><td>Kết nối bị rớt/chậm</td></tr>
</tbody></table>
<p>Các con số trong ngoặc (2, 13, 104, 110, 111) là mã <code>errno</code> của Linux: 2 ENOENT, 13 EACCES, 104 ECONNRESET, 110 ETIMEDOUT, 111 ECONNREFUSED. Trong thông báo lỗi của Node (10.4) chúng y hệt — học một lần dùng mãi.</p>

<h3>Bước 5 — cùng log đó dưới dạng JSON</h3>
${lenh('s10/nginx-doc', 7)}
${lenh('s10/nginx-doc', 8)}
<p>Access log thứ hai dùng <code>log_format json escape=json</code>: mỗi dòng một đối tượng JSON, số là số, dấu nháy và ký tự điều khiển được thoát. Giờ jq gom được 5xx theo endpoint (thay mã đơn hàng bằng <code>:id</code>): 29 lần 500 đều ở <code>/api/orders/:id</code> (lỗi của app), 20 lần 502 rải khắp mọi endpoint (app sập — nó không quan tâm bạn hỏi trang nào). Chỉ riêng sự tương phản đó đã nói "một tính năng hỏng" hay "cả app sập". <code>urt</code> là chuỗi vì nó có thể chứa <code>"-"</code> hoặc một danh sách.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Ticket "web chậm" ở công ty outsourcing:</strong> trước khi đụng vào mã, chạy Bước 2 và 3 cho một giờ gần nhất. Nếu <code>rt ≈ urt</code> trên một endpoint, đưa đội app endpoint đó kèm số liệu; nếu <code>rt ≫ urt</code>, vấn đề là mạng hoặc kích thước phản hồi. Một bình luận ticket có ba dòng bằng chứng tiết kiệm cả ngày đoán mò.</li>
<li><strong>Trên VPS bạn thuê cho dự án riêng:</strong> <code>/var/log/nginx/error.log</code> đầy <code>open() "/var/www/html/wp-login.php" failed</code> không phải là đòn nhắm riêng vào bạn — đó là tiếng ồn nền của Internet (10.9). Đừng hoảng; chỉ cần chắc chắn các đường dẫn đó thật sự không tồn tại.</li>
<li><strong>Nếu</strong> access log trống mà người dùng vẫn gặp lỗi? Kiểm tra server block có <code>access_log</code> thật không (hay có <code>access_log off;</code> ở đâu đó), đĩa có đầy không (Chương 8), và request có tới được nginx này không (DNS/CDN — Chương 13).</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trên log Lab 10 của bạn, in <code>rt</code> trung bình theo từng mã trạng thái (awk với mảng theo khoá <code>$9</code>).</li>
<li>Tìm số kết nối (<code>*N</code>) của dòng 504 trong error log, rồi in mọi dòng lỗi có số đó.</li>
<li>Viết lại phép tính trung bình theo endpoint ở Bước 2 bằng jq trên <code>access.json</code> (<code>group_by</code>, <code>add / length</code> — bài 2.4).</li>
<li>Giải thích, mỗi ý một dòng, khác nhau giữa 502 kèm <em>prematurely closed</em> và 502 kèm <em>connect() failed</em>.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 cho 504 ≈ 5,0 giây và 429 ≈ 0,0 giây; câu 2 in đúng một dòng; câu 3 ra cùng 1,366 giây cho <code>/api/report</code> (± theo lần chạy của bạn); câu 4 gọi đúng tên "chết khi đang trả lời" và "không có gì lắng nghe".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['combined', 'Định dạng access log mặc định của nginx/Apache: IP, người dùng, giờ, request, mã, số byte, referer, user agent.'],
  ['$request_time', 'Thời gian từ byte đầu đọc từ khách tới byte cuối gửi đi, tính bằng giây, chính xác tới ms.'],
  ['$upstream_response_time', 'Thời gian upstream xử lý; "-" nếu không có, nhiều giá trị cách nhau dấu phẩy nếu đã thử nhiều upstream.'],
  ['$request_id', 'Mã ngẫu nhiên 32 ký tự hex cho mỗi request; chuyển tiếp bằng X-Request-Id để nối log.'],
  ['mức error log', 'debug, info, notice, warn, error, crit, alert, emerg — error_log ghi mức đã chọn trở lên.'],
  ['errno', 'Mã lỗi Linux trong thông điệp: 2 ENOENT, 13 EACCES, 104 ECONNRESET, 110 ETIMEDOUT, 111 ECONNREFUSED.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Access log = cái gì/ai/bao lâu; error log = vì sao. Đọc cùng nhau, ghép theo giờ và khách.</li>
<li>Cắt dòng combined theo <code>"</code>; thêm <code>rt</code>, <code>urt</code>, <code>rid</code> vào mọi định dạng bạn được sửa.</li>
<li><code>rt ≈ urt</code> → app; <code>rt ≫ urt</code> → khách/mạng; <code>urt=-</code> → nginx tự xử; số tròn → một thiết lập timeout.</li>
<li>Đếm dòng lỗi theo loại sau khi bỏ phần thay đổi; thuộc mười thông điệp hay gặp và errno của chúng.</li>
<li>Access log JSON biến việc gom theo endpoint/mã thành một dòng lệnh — và cho thấy "một tính năng hỏng" khác "cả app sập".</li>
</ul>
${nguon('📘', 'nginx — ngx_http_log_module', 'log_format, access_log, escape=json, đệm ghi, mọi biến', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
${nguon('📘', 'nginx — chỉ thị error_log', 'Các mức và nơi ghi lỗi', 'https://nginx.org/en/docs/http/ngx_http_core_module.html#error_log')}
${lienKet({ khoa: 'nginx', bai: 'nginx-10-1-log-mac-dinh-bo-sot', title: 'nginx 10.1 — Log mặc định bỏ sót gì', sub: 'Cấu hình chính những trường bạn vừa học đọc', cta: 'Mở bài' })}
${lienKet({ khoa: 'nginx', bai: 'nginx-10-2-log-json-escape', title: 'nginx 10.2 — Log JSON và thoát ký tự', sub: 'Vì sao escape=json quan trọng', cta: 'Mở bài' })}
${lienKet({ khoa: 'nginx', bai: 'nginx-10-4-error-log-va-cac-muc', title: 'nginx 10.4 — error_log và các mức', sub: 'Chọn mức, error log riêng cho từng server', cta: 'Mở bài' })}
</div>
`,
};
