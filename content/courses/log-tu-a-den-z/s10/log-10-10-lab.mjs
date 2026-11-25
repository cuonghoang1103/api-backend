/**
 * 10.10 — Lab 10: một đêm lưu lượng trên nginx + Node (soạn 24/11/2026).
 * Dữ liệu: Lab 10 dựng ở bài 10.1 + _demo/s10/web-lab/tao-luu-luong.py. Đáp án chạy thật: CODE/OUT['s10/lab10'] (mawk + jq, Ubuntu 24.04).
 * Biến thể Java dùng app _demo/s10/spring-lab (đã chạy thật ở 10.5–10.7).
 */
import { ma, ra, nguon, kv } from '../_chung.mjs';

export default {
  title: '10.10 — Lab 10 — A night of traffic on a test nginx + Node app: find the slow endpoint, the 502 cause and the scanner|||10.10 — Lab 10 — Một đêm lưu lượng trên nginx + Node thử nghiệm: tìm endpoint chậm, nguyên nhân 502 và kẻ quét',
  slug: 'log-10-10-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab có chấm: dựng nginx + app Node (pino) bằng Docker, chạy script "một đêm" lưu lượng (người dùng thật, máy quét, dò mật khẩu, khách bỏ đi, xuất báo cáo quá giờ, một lần app sập), rồi trả lời ba câu như một kỹ sư trực: endpoint nào chậm, vì sao có một loạt 502, ai đang quét và có lọt không — mỗi kết luận kèm dòng log làm bằng chứng và một báo cáo ngắn kiểu ticket. Có biến thể Java (Spring Boot + MDC + JSON + rolling file) và mốc dự án cá nhân.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab 10</span>
<h2>Lab 10 — The morning after: three questions, three pieces of evidence</h2>
<p class="lead">It is 08:00. The night on-call left a message: "Something happened around 03:35 (Vietnam time). Users saw errors, someone said the report page is slow, and the security bot flagged an IP. I am going to sleep." You have the four log files of the lab stack. Answer like an engineer: <strong>a conclusion, the command that proves it, and the log line</strong>.</p>

<h3>Setup (15 min)</h3>
<p>If you built Lab 10 in lesson 10.1, run <code>docker rm -f lgz-nginx lgz-node</code>, then <code>bash lab-up.bash</code> and <code>python3 tao-luu-luong.py</code> again for fresh logs. The traffic script (the "night"):</p>
${ma('python', 's10/web-lab/tao-luu-luong.py')}
<div class="callout warn"><p><strong>Rules.</strong> Read the script only <em>after</em> you finish — during the lab, pretend you do not know what it did. Point it only at your own lab (<code>127.0.0.1:41080</code>). Use the tools of Chapter 2 and this chapter: grep, awk, sort, uniq, jq. Time box: 60 minutes.</p></div>

<h3>The questions</h3>
<ol>
<li><strong>Slow:</strong> which endpoint is slow for users, how slow on average, and is the time spent in nginx or in the app?</li>
<li><strong>502:</strong> when did the 502s start and stop (to the second), how many requests failed, what was the cause, and which request triggered it?</li>
<li><strong>Scanner:</strong> which IP caused the most 4xx, what was it looking for, during which window, did it get any unexpected 2xx — and was there also a password attack?</li>
<li><strong>Bonus:</strong> one 504 and one 499 happened. Explain each in one sentence.</li>
</ol>
<h3>Hints (open one at a time)</h3>
<details><summary>Hint for 1</summary><p>Average <code>rt=</code> per path without the query string (lesson 10.2, Step 2); then compare <code>rt</code> with <code>urt</code> on the slow lines.</p></details>
<details><summary>Hint for 2</summary><p>First and last 502 in <code>access.log</code>; the matching <code>error.log</code> message; then the non-JSON lines of <code>app.log</code> and the line just before the supervisor message (lesson 10.4).</p></details>
<details><summary>Hint for 3</summary><p>Count 4xx by IP; list that IP's status + path; then group <code>/api/login</code> by IP and status (lesson 10.9).</p></details>

<h3>Answer key (run for real — open after you finish)</h3>
<details><summary>Show the commands and output</summary>
${ma('bash', 's10/lab10.bash')}
${ra('s10/lab10')}
</details>

<h3>Reading the answers</h3>
<details><summary>Show the explanation</summary>
<ul>
<li><strong>Slow = <code>/api/report</code></strong>: 63 requests, 1.366 s average versus 19 ms for <code>/api/products</code>; on those lines <code>rt ≈ urt</code>, so the time is in the app, not the network. Next step for the app team: what the report query does (Chapter 12).</li>
<li><strong>502 = app crash</strong>: from 20:35:01 to 20:35:04 UTC (03:35 Vietnam time), 20 requests on every endpoint. nginx says <code>connect() failed (111: Connection refused)</code> (plus one <em>prematurely closed</em> for the request in flight). The app log shows Node's crash report — <code>Error: cache warmup failed: redis not ready</code> at <code>app.js:44</code>, an unhandled promise rejection — then the supervisor restart. The trigger: <code>GET /api/crash</code> from 198.51.100.42 at 20:35:01, answered 202 just before the process died.</li>
<li><strong>Scanner = 203.0.113.66</strong>: 20:34:36–20:34:40, Nikto user agent, looking for <code>.env</code>, <code>.git/config</code>, WordPress, phpMyAdmin, backups, Actuator; SQLi/XSS/Log4Shell probes got 200 only because <code>/api/products</code> ignores parameters — no sign of success (no unexpected 2xx path, no outbound connection to verify in this lab). Separately, 192.0.2.51–53 ran a password spray (<code>python-requests</code>, 18 accounts, password <code>123456</code>), stopped by the 429 rate limit, no 200 on login. The same scanner IP also tried a log-injection username (10.9).</li>
<li><strong>Bonus</strong>: 504 = <code>/api/export</code> exceeded <code>proxy_read_timeout</code> (5.000 s, <em>upstream timed out (110)</em>); 499 = a client gave up on <code>/api/report</code> after 0.5 s.</li>
</ul>
</details>

<h3>Write the report (the part that gets you trusted)</h3>
<p>Five lines in a ticket or Slack thread, for someone who will not read logs:</p>
<pre><code class="language-text">[Incident 24/11 03:35 ICT] shop-api crashed once, 4 s of 502 (20 failed requests).
Cause: unhandled promise rejection in /api/crash handler (app.js:44) -&gt; Node process exit, auto-restart 3 s.
Evidence: nginx error.log "connect() failed (111)" 20:35:01–04Z; app.log crash trace + supervisor line 20:35:01Z.
Also: /api/report avg 1.37 s (app-side); scanner 203.0.113.66 + password spray 192.0.2.51-53, all blocked (404/403/429), no success.
Actions: add await/catch + test (owner: backend); look at report query (owner: backend); no security action needed beyond monitoring.</code></pre>

<h3>Java variant (optional, 45 min)</h3>
<p>Replace the Node app with the Spring Boot shop app from 10.5–10.7: run it with <code>--logging.config=classpath:logback-lab.xml</code> in the same network namespace as nginx (start it first as <code>--name lgz-node</code>, change <code>proxy_pass</code> to <code>127.0.0.1:8080</code>; give nginx another <code>listen</code> port, e.g. 8081, and publish that port as <code>127.0.0.1:41080</code>), send traffic to <code>/api/orders/1..20</code>, <code>/api/orders/13</code> and <code>/api/orders/7/confirm</code>. Then answer: find one request id in nginx <code>access.log</code>, <code>logs/shop.log</code> and <code>logs/shop.json</code>; show the root cause of the 500; show the archives created by the rolling policy.</p>

<h3>🛠 Project milestone</h3>
<p>Apply the chapter to <em>your</em> course project (the one you registered in lesson 0.9, or your SWP/LabFlow app): (1) the app logs JSON with a request id that the proxy passes in; (2) one forced error shows a complete stack trace with the root cause, linked to the access-log line by id; (3) no token, cookie or password appears in any log line (grep for <code>Bearer</code>, <code>password</code>, <code>Set-Cookie</code>); (4) log files rotate with a size cap. Save four screenshots or log excerpts in your project README under "Logging".</p>

<h3>Done when</h3>
<div class="callout ok"><ol>
<li>Three conclusions, each with a command and at least one quoted log line.</li>
<li>The 502 window is exact to the second and the trigger request is named.</li>
<li>You state whether the scanner or the password spray succeeded, and why you think so.</li>
<li>A five-line report a non-engineer can read.</li>
</ol>
<p><strong>Done when:</strong> the four points hold. Keep your commands — Chapter 14 (investigation) and Chapter 18 (capstone) reuse them on bigger, messier data.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['evidence', 'A log line (with source and time) that supports a conclusion; quote it, do not paraphrase.'],
  ['incident window', 'First and last timestamp of the impact, ideally to the second, in one stated time zone.'],
  ['trigger', 'The event that started the incident (here a request to /api/crash).'],
  ['impact', 'Who/what was affected: number of failed requests, endpoints, users.'],
])}
${nguon('📘', 'nginx — ngx_http_log_module', 'Fields used in this lab', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab 10</span>
<h2>Lab 10 — Sáng hôm sau: ba câu hỏi, ba bằng chứng</h2>
<p class="lead">Bây giờ là 08:00. Người trực đêm để lại tin nhắn: "Khoảng 03:35 (giờ Việt Nam) có chuyện. Người dùng thấy lỗi, có người bảo trang báo cáo chậm, bot bảo mật thì gắn cờ một IP. Tôi đi ngủ đây." Bạn có bốn tệp log của hệ lab. Hãy trả lời như một kỹ sư: <strong>một kết luận, lệnh chứng minh nó, và dòng log</strong>.</p>

<h3>Chuẩn bị (15 phút)</h3>
<p>Nếu đã dựng Lab 10 ở bài 10.1, chạy <code>docker rm -f lgz-nginx lgz-node</code>, rồi <code>bash lab-up.bash</code> và <code>python3 tao-luu-luong.py</code> lại để có log mới. Script lưu lượng ("đêm hôm đó"):</p>
${ma('python', 's10/web-lab/tao-luu-luong.py')}
<div class="callout warn"><p><strong>Luật chơi.</strong> Chỉ đọc script <em>sau khi</em> làm xong — trong lúc làm, hãy giả vờ không biết nó đã làm gì. Chỉ bắn vào lab của chính bạn (<code>127.0.0.1:41080</code>). Dùng công cụ của Chương 2 và chương này: grep, awk, sort, uniq, jq. Giới hạn: 60 phút.</p></div>

<h3>Các câu hỏi</h3>
<ol>
<li><strong>Chậm:</strong> endpoint nào chậm với người dùng, trung bình chậm bao nhiêu, và thời gian tiêu ở nginx hay ở app?</li>
<li><strong>502:</strong> loạt 502 bắt đầu và kết thúc lúc nào (chính xác tới giây), bao nhiêu request hỏng, nguyên nhân là gì, và request nào đã gây ra?</li>
<li><strong>Kẻ quét:</strong> IP nào gây nhiều 4xx nhất, nó tìm gì, trong khoảng thời gian nào, có nhận 2xx bất thường nào không — và có thêm một đợt dò mật khẩu không?</li>
<li><strong>Điểm cộng:</strong> có một lần 504 và một lần 499. Giải thích mỗi cái trong một câu.</li>
</ol>
<h3>Gợi ý (mở từng cái một)</h3>
<details><summary>Gợi ý câu 1</summary><p>Trung bình <code>rt=</code> theo đường dẫn đã bỏ query string (bài 10.2, Bước 2); rồi so <code>rt</code> với <code>urt</code> trên các dòng chậm.</p></details>
<details><summary>Gợi ý câu 2</summary><p>Dòng 502 đầu và cuối trong <code>access.log</code>; thông điệp tương ứng trong <code>error.log</code>; rồi các dòng không phải JSON của <code>app.log</code> và dòng ngay trước thông điệp supervisor (bài 10.4).</p></details>
<details><summary>Gợi ý câu 3</summary><p>Đếm 4xx theo IP; liệt kê mã + đường dẫn của IP đó; rồi gom <code>/api/login</code> theo IP và mã (bài 10.9).</p></details>

<h3>Đáp án (chạy thật — mở sau khi làm xong)</h3>
<details><summary>Xem lệnh và output</summary>
${ma('bash', 's10/lab10.bash')}
${ra('s10/lab10')}
</details>

<h3>Đọc đáp án</h3>
<details><summary>Xem giải thích</summary>
<ul>
<li><strong>Chậm = <code>/api/report</code></strong>: 63 request, trung bình 1,366 giây so với 19 ms của <code>/api/products</code>; trên các dòng đó <code>rt ≈ urt</code>, nên thời gian nằm trong app chứ không phải mạng. Bước tiếp theo cho đội app: câu truy vấn của báo cáo làm gì (Chương 12).</li>
<li><strong>502 = app sập</strong>: từ 20:35:01 tới 20:35:04 UTC (03:35 giờ Việt Nam), 20 request trên mọi endpoint. nginx ghi <code>connect() failed (111: Connection refused)</code> (thêm một <em>prematurely closed</em> cho request đang dở). Log app có báo cáo sập của Node — <code>Error: cache warmup failed: redis not ready</code> ở <code>app.js:44</code>, một promise bị từ chối không ai xử lý — rồi tới dòng supervisor khởi động lại. Kẻ châm ngòi: <code>GET /api/crash</code> từ 198.51.100.42 lúc 20:35:01, được trả 202 ngay trước khi tiến trình chết.</li>
<li><strong>Kẻ quét = 203.0.113.66</strong>: 20:34:36–20:34:40, user agent Nikto, đi tìm <code>.env</code>, <code>.git/config</code>, WordPress, phpMyAdmin, tệp sao lưu, Actuator; các phát dò SQLi/XSS/Log4Shell nhận 200 chỉ vì <code>/api/products</code> bỏ qua tham số — không có dấu hiệu thành công (không có đường dẫn 2xx bất thường; kết nối đi ra thì lab này không có để kiểm). Riêng 192.0.2.51–53 chạy một đợt password spray (<code>python-requests</code>, 18 tài khoản, mật khẩu <code>123456</code>), bị giới hạn 429 chặn, không có 200 nào ở đăng nhập. Chính IP máy quét còn thử một tên đăng nhập chèn log (10.9).</li>
<li><strong>Điểm cộng</strong>: 504 = <code>/api/export</code> vượt <code>proxy_read_timeout</code> (5,000 giây, <em>upstream timed out (110)</em>); 499 = một khách bỏ cuộc với <code>/api/report</code> sau 0,5 giây.</li>
</ul>
</details>

<h3>Viết báo cáo (phần khiến người ta tin bạn)</h3>
<p>Năm dòng trong ticket hoặc luồng Slack, cho người sẽ không đọc log:</p>
<pre><code class="language-text">[Sự cố 24/11 03:35 giờ VN] shop-api sập một lần, 4 giây 502 (20 request hỏng).
Nguyên nhân: promise bị từ chối không xử lý trong handler /api/crash (app.js:44) -&gt; tiến trình Node thoát, tự khởi động lại sau 3 giây.
Bằng chứng: nginx error.log "connect() failed (111)" 20:35:01–04Z; app.log có báo cáo sập + dòng supervisor 20:35:01Z.
Ngoài ra: /api/report trung bình 1,37 giây (phía app); máy quét 203.0.113.66 + dò mật khẩu 192.0.2.51-53, đều bị chặn (404/403/429), không thành công.
Việc cần làm: thêm await/catch + test (backend); xem câu truy vấn báo cáo (backend); bảo mật: chỉ cần theo dõi tiếp.</code></pre>

<h3>Biến thể Java (tuỳ chọn, 45 phút)</h3>
<p>Thay app Node bằng app shop Spring Boot của 10.5–10.7: chạy với <code>--logging.config=classpath:logback-lab.xml</code> trong cùng không gian mạng với nginx (chạy nó trước với <code>--name lgz-node</code>, đổi <code>proxy_pass</code> thành <code>127.0.0.1:8080</code>; cho nginx <code>listen</code> ở cổng khác, ví dụ 8081, và publish cổng đó ra <code>127.0.0.1:41080</code>), gửi lưu lượng tới <code>/api/orders/1..20</code>, <code>/api/orders/13</code> và <code>/api/orders/7/confirm</code>. Rồi trả lời: tìm một request id trong <code>access.log</code> của nginx, <code>logs/shop.log</code> và <code>logs/shop.json</code>; chỉ ra nguyên nhân gốc của lỗi 500; cho xem các tệp lưu trữ do chính sách xoay vòng tạo ra.</p>

<h3>🛠 Mốc dự án</h3>
<p>Áp chương này vào dự án <em>của bạn</em> (đề tài đã đăng ký ở bài 0.9, hoặc app SWP/LabFlow): (1) app log JSON có request id do proxy truyền vào; (2) một lỗi cố ý gây ra cho thấy stack trace đầy đủ có nguyên nhân gốc, nối với dòng access log bằng id; (3) không dòng log nào chứa token, cookie hay mật khẩu (grep <code>Bearer</code>, <code>password</code>, <code>Set-Cookie</code>); (4) tệp log tự xoay vòng có trần dung lượng. Lưu bốn ảnh chụp hoặc trích đoạn log vào README dự án, mục "Logging".</p>

<h3>Đạt khi</h3>
<div class="callout ok"><ol>
<li>Ba kết luận, mỗi cái có lệnh và ít nhất một dòng log được trích.</li>
<li>Khoảng 502 chính xác tới giây và gọi đúng tên request châm ngòi.</li>
<li>Bạn nói rõ máy quét hay đợt dò mật khẩu có thành công không, và vì sao bạn nghĩ vậy.</li>
<li>Một báo cáo năm dòng mà người không phải kỹ sư cũng đọc được.</li>
</ol>
<p><strong>Đạt khi:</strong> đủ bốn điểm trên. Giữ lại các lệnh của bạn — Chương 14 (điều tra) và Chương 18 (dự án cuối) dùng lại chúng trên dữ liệu lớn và lộn xộn hơn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['evidence (bằng chứng)', 'Một dòng log (kèm nguồn và giờ) ủng hộ một kết luận; trích nguyên văn, đừng diễn giải lại.'],
  ['incident window (khoảng sự cố)', 'Mốc đầu và mốc cuối của ảnh hưởng, lý tưởng là tới giây, ghi rõ một múi giờ.'],
  ['trigger (châm ngòi)', 'Sự kiện khởi đầu sự cố (ở đây là một request tới /api/crash).'],
  ['impact (ảnh hưởng)', 'Ai/cái gì bị ảnh hưởng: số request hỏng, endpoint, người dùng.'],
])}
${nguon('📘', 'nginx — ngx_http_log_module', 'Các trường dùng trong lab này', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
</div>
`,
};
