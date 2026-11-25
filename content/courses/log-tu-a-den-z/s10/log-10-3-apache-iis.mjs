/**
 * 10.3 — Apache httpd và IIS ở mức nhận biết (soạn 24/11/2026).
 * Output thật: OUT['s10/apache'] (httpd:2.4-alpine, Apache/2.4.71, trong container) và OUT['s10/iis'] (log W3C u_ex261120.log của gói log mẫu,
 * đọc bằng mawk trong Ubuntu 24.04). PowerShell Import-Csv chỉ ghi dạng lệnh (đã dạy cách chạy ở bài 2.5).
 */
import { lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '10.3 — Apache httpd and IIS logs at recognition level: access_log/error_log, W3C fields, sc-substatus, time-taken, HTTPERR|||10.3 — Log Apache httpd và IIS ở mức nhận biết: access_log/error_log, trường W3C, sc-substatus, time-taken, HTTPERR',
  slug: 'log-10-3-apache-iis',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chạy Apache httpd 2.4 thật trong container: định dạng common/combined (%h %l %u %t "%r" %>s %b), dòng error log có [module:mức] và mã AH, LogLevel; đọc log IIS định dạng W3C: dòng #Fields là bản đồ cột, giờ UTC, sc-status.sc-substatus (401.1, 403.14, 404.0, 500.19, 502.5…), time-taken tính bằng mili giây, sc-win32-status; HTTPERR khi request chết trước cả IIS; đọc bằng awk và PowerShell Import-Csv.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Apache and IIS: same questions, different dialects</h2>
<p class="lead">nginx is not the only web server you will meet. Older Linux servers, shared hosting and many PHP apps run <strong>Apache httpd</strong>; Windows shops and .NET projects run <strong>IIS</strong>. You do not need to configure them to read them: the questions are the same as in 10.1–10.2 (who, what, status, how long, why it failed), only the column order and the names change. This lesson gives you the map for both.</p>

<h3>The everyday picture: the same form in two countries</h3>
<p>A passport always contains a name, a birth date and a number, but each country prints them in a different place and calls them differently. Once you know "where the name is" on a Vietnamese and a Japanese passport, you can read any of them. Apache's <code>%h</code> and IIS's <code>c-ip</code> are the same box: the client's address.</p>

<h3>Part A — Apache httpd</h3>
<p>We run the official image, send three requests, and read both logs. In the container, Apache writes the access log to stdout and the error log to stderr, so <code>docker logs</code> separates them for us.</p>
${lenh('s10/apache', 0)}
${lenh('s10/apache', 1)}
${lenh('s10/apache', 2)}
${lenh('s10/apache', 3)}
${lenh('s10/apache', 4)}
<p>This is the <strong>common</strong> format: <code>%h %l %u %t "%r" %>s %b</code> = client host, ident, user, time, request line, final status, body bytes. No referer, no user agent, no duration. Notice that the third request sent a custom User-Agent and it is simply not there — you cannot investigate what you did not log.</p>
${lenh('s10/apache', 6)}
<p>The config already defines <strong>combined</strong> (adds referer and user agent) and <strong>combinedio</strong> (adds bytes in/out), but <code>CustomLog</code> uses <code>common</code>. On a real server you would switch to combined and add <code>%D</code> (duration in microseconds) or <code>%{ms}T</code>. Locations to remember: Debian/Ubuntu <code>/var/log/apache2/access.log</code> and <code>error.log</code>; RHEL/Fedora <code>/var/log/httpd/access_log</code> and <code>error_log</code>.</p>
${lenh('s10/apache', 5)}
<p>An Apache error line: <code>[time with microseconds] [module:level] [pid N:tid M] AHnnnnn: message</code>. The <strong>AH code</strong> is a stable identifier — search "AH00558" and you find the explanation (here: no <code>ServerName</code> set, harmless). Levels are the syslog ones (<code>emerg … debug</code>, plus <code>trace1–8</code>); <code>LogLevel warn</code> is the default, and you can raise one module only: <code>LogLevel warn ssl:info</code>. Errors you will meet: <code>AH01630: client denied by server configuration</code> (403 from a Require rule), <code>AH00124: Request exceeded the limit of 10 internal redirects</code> (a rewrite loop), <code>AH01071: Got error 'PHP message: …'</code> (the PHP-FPM error, relayed), <code>AH01079: failed to make connection to backend</code> (Apache as a proxy — the Apache flavour of nginx's 502).</p>

<h3>Part B — IIS (Internet Information Services)</h3>
<p>IIS writes one text file per site per day in <strong>W3C extended</strong> format, by default under <code>%SystemDrive%\\inetpub\\logs\\LogFiles\\W3SVC&lt;site id&gt;\\u_exYYMMDD.log</code>. The course log pack contains one (lesson 0.1). The trick: the file describes itself.</p>
${lenh('s10/iis', 0)}
${lenh('s10/iis', 1)}
<p>Lines starting with <code>#</code> are headers, repeated every time IIS restarts the file. <strong><code>#Fields</code> is the column map</strong> — an administrator can add or remove fields, so never assume column 12 is the status: read <code>#Fields</code> first. Spaces inside values are replaced by <code>+</code> (look at the user agent). Two more traps: <strong>date and time are UTC</strong> regardless of the server's time zone, and <strong><code>time-taken</code> is in milliseconds</strong> (nginx: seconds).</p>
${lenh('s10/iis', 2)}
${lenh('s10/iis', 3)}
${lenh('s10/iis', 4)}
<p>IIS splits the status in three: <code>sc-status</code> (the HTTP code), <code>sc-substatus</code> (IIS's more precise reason) and <code>sc-win32-status</code> (the Windows error behind it). In this pack every substatus is 0, but in real logs the substatus is where the answer is:</p>
<table>
<thead><tr><th>Code</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>401.1 / 401.2</td><td>Logon failed (bad credentials) / no authentication method allowed by config</td></tr>
<tr><td>403.14</td><td>Directory listing denied (no default document)</td></tr>
<tr><td>404.0 / 404.7</td><td>Not found / file extension denied by request filtering</td></tr>
<tr><td>500.19</td><td>Configuration data invalid (broken web.config)</td></tr>
<tr><td>502.5 (or 500.30)</td><td>ASP.NET Core app failed to start (ASP.NET Core Module)</td></tr>
<tr><td>503 (+ HTTPERR)</td><td>Application pool stopped or queue full</td></tr>
</tbody></table>
<p><code>sc-win32-status</code> 0 = fine; 64 ("network name no longer available") and 1236 ("connection aborted") typically mean the client went away — IIS's version of nginx's 499. Here the slow page is clear: <code>/portal/report.aspx</code> averages 2.2 s and its 500s took 4.6–11 s — probably a timeout inside the page.</p>

<h3>HTTPERR — when the request dies before IIS sees it</h3>
<p>Below IIS sits the kernel driver <code>HTTP.sys</code>. If it rejects a request (malformed, too long, the app pool is down, the connection timed out), the IIS log has <em>no line at all</em>; the trace is in <code>%SystemRoot%\\System32\\LogFiles\\HTTPERR\\httperr*.log</code>. Its <code>s-reason</code> column says why: <code>Timer_ConnectionIdle</code> (idle connection closed — usually harmless), <code>Connection_Dropped</code>, <code>BadRequest</code>, <code>AppOffline</code> or <code>QueueFull</code> (the app pool is down or overloaded — a real 503). "The user got 503 but the IIS log is empty" → open HTTPERR.</p>

<h3>Reading W3C logs in PowerShell</h3>
<pre><code class="language-powershell">$f = 'C:\\inetpub\\logs\\LogFiles\\W3SVC1\\u_ex261120.log'
$cols = ((Get-Content $f -TotalCount 10 | Where-Object { $_ -like '#Fields:*' }) -replace '^#Fields: ' -split ' ')
Get-Content $f | Where-Object { $_ -notlike '#*' } |
  ConvertFrom-Csv -Delimiter ' ' -Header $cols |
  Where-Object { [int]$_.'sc-status' -ge 500 } |
  Group-Object 'cs-uri-stem' | Sort-Object Count -Descending | Select-Object Count, Name</code></pre>
<p>Run for real on the course pack (PowerShell 7.4.2 in a container, path changed to <code>windows/u_ex261120.log</code>):</p>
<pre><code>Count Name
----- ----
   13 /portal/report.aspx</code></pre>
<p>Same idea as lesson 2.5: build the header from <code>#Fields</code>, skip comment lines, then filter objects by name. Microsoft's free <strong>Log Parser 2.2</strong> (SQL over logs) is still used in Windows teams; you will recognise its <code>SELECT … FROM u_ex*.log</code> queries in old runbooks.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>Outsourcing for a Japanese client on Windows servers:</strong> the customer sends a zip of <code>u_ex*.log</code> files and asks "why was the portal slow on the 20th?". Read <code>#Fields</code>, convert times from UTC to JST (UTC+9) in your report, sort by <code>time-taken</code> — and say "ms" explicitly, because their ops team compares with Apache logs in microseconds.</li>
<li><strong>Shared hosting for a student project:</strong> cPanel gives you Apache's "Raw Access" and "Errors" pages — exactly the two logs above. "Internal Server Error" with nothing in the access log? The error log line with <code>AH01071</code> carries the PHP message.</li>
<li><strong>What if</strong> you must compare an IIS log with an nginx log of the proxy in front of it? Convert both to UTC and the same unit, then match by client IP and URL within a second (lesson 1.5).</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Start the httpd container again, switch the access log to combined by running <code>docker exec lgz-httpd sed -i 's/CustomLog \\/proc\\/self\\/fd\\/1 common/CustomLog \\/proc\\/self\\/fd\\/1 combined/' /usr/local/apache2/conf/httpd.conf</code>, then <code>docker exec lgz-httpd httpd -k graceful</code>; repeat the three curls. Show that the User-Agent now appears.</li>
<li>On the IIS sample, list the 3 hours (UTC) with the most requests, then convert them to Vietnam time.</li>
<li>For <code>/portal/report.aspx</code>, print the slowest 5 requests with their status and time-taken in seconds.</li>
</ol>
<p><strong>Done when:</strong> 1 shows <code>"lab-client/1.0"</code> in the access log; 2 adds 7 hours to every hour you print; 3 starts with 11.331 s, 11 s and 10.362 s — all of them 500s.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['common / combined', 'Apache formats: common = %h %l %u %t "%r" %>s %b; combined adds Referer and User-Agent.'],
  ['%D / %{ms}T', 'Apache request duration in microseconds / milliseconds.'],
  ['AH code', 'Stable Apache error identifier, e.g. AH00558, AH01630.'],
  ['W3C extended', 'IIS log format; #Fields lists the columns; times in UTC.'],
  ['sc-substatus', 'IIS detail code after the HTTP status, e.g. 401.1, 500.19.'],
  ['time-taken', 'IIS request duration in milliseconds.'],
  ['HTTPERR', 'HTTP.sys log for requests rejected before reaching IIS.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Apache: <code>common</code> has no user agent and no duration — switch to combined and add <code>%D</code>.</li>
<li>Apache error lines: <code>[module:level]</code> + an AH code you can search.</li>
<li>IIS: read <code>#Fields</code> first; times are UTC; <code>time-taken</code> is ms; the substatus is the real reason.</li>
<li>Empty IIS log but users see 503? Look in HTTPERR.</li>
</ul>
${nguon('📘', 'Apache httpd 2.4 — Log Files', 'LogFormat, CustomLog, ErrorLog, LogLevel, piped logs', 'https://httpd.apache.org/docs/2.4/logs.html')}
${nguon('📘', 'Microsoft Learn — HTTP status codes in IIS', 'Every status.substatus code and what to do about it', 'https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/health-diagnostic-performance/http-status-code')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Apache và IIS: cùng câu hỏi, khác phương ngữ</h2>
<p class="lead">nginx không phải web server duy nhất bạn sẽ gặp. Server Linux đời cũ, hosting dùng chung và rất nhiều app PHP chạy <strong>Apache httpd</strong>; công ty dùng Windows và dự án .NET chạy <strong>IIS</strong>. Bạn không cần biết cấu hình chúng mới đọc được: câu hỏi vẫn như ở bài 10.1–10.2 (ai, cái gì, mã nào, bao lâu, vì sao hỏng), chỉ thứ tự cột và tên gọi là đổi. Bài này đưa bạn tấm bản đồ cho cả hai.</p>

<h3>Liên tưởng đời thường: cùng một tờ khai ở hai nước</h3>
<p>Hộ chiếu nào cũng có tên, ngày sinh và số hộ chiếu, nhưng mỗi nước in ở một chỗ và gọi một kiểu. Khi đã biết "tên nằm ở đâu" trên hộ chiếu Việt Nam và hộ chiếu Nhật, bạn đọc được hộ chiếu nào cũng xong. <code>%h</code> của Apache và <code>c-ip</code> của IIS là cùng một ô: địa chỉ của khách.</p>

<h3>Phần A — Apache httpd</h3>
<p>Ta chạy ảnh chính thức, gửi ba request, rồi đọc cả hai log. Trong container, Apache ghi access log ra stdout và error log ra stderr, nên <code>docker logs</code> tách sẵn giúp ta.</p>
${lenh('s10/apache', 0)}
${lenh('s10/apache', 1)}
${lenh('s10/apache', 2)}
${lenh('s10/apache', 3)}
${lenh('s10/apache', 4)}
<p>Đây là định dạng <strong>common</strong>: <code>%h %l %u %t "%r" %>s %b</code> = máy khách, ident, người dùng, thời điểm, dòng request, mã cuối cùng, số byte body. Không có referer, không có user agent, không có thời gian xử lý. Để ý request thứ ba gửi kèm một User-Agent riêng mà nó chẳng hề xuất hiện — thứ không được log thì không điều tra được.</p>
${lenh('s10/apache', 6)}
<p>Cấu hình đã định nghĩa sẵn <strong>combined</strong> (thêm referer và user agent) và <strong>combinedio</strong> (thêm số byte vào/ra), nhưng <code>CustomLog</code> lại dùng <code>common</code>. Trên server thật bạn sẽ chuyển sang combined và thêm <code>%D</code> (thời gian xử lý tính bằng micro giây) hoặc <code>%{ms}T</code>. Chỗ cần nhớ: Debian/Ubuntu là <code>/var/log/apache2/access.log</code> và <code>error.log</code>; RHEL/Fedora là <code>/var/log/httpd/access_log</code> và <code>error_log</code>.</p>
${lenh('s10/apache', 5)}
<p>Một dòng lỗi của Apache: <code>[thời điểm kèm micro giây] [module:mức] [pid N:tid M] AHnnnnn: thông điệp</code>. <strong>Mã AH</strong> là định danh ổn định — tìm "AH00558" là ra lời giải thích (ở đây: chưa đặt <code>ServerName</code>, vô hại). Các mức là của syslog (<code>emerg … debug</code>, thêm <code>trace1–8</code>); mặc định <code>LogLevel warn</code>, và bạn có thể nâng riêng một module: <code>LogLevel warn ssl:info</code>. Lỗi bạn sẽ gặp: <code>AH01630: client denied by server configuration</code> (403 do luật Require), <code>AH00124: Request exceeded the limit of 10 internal redirects</code> (rewrite lặp vô tận), <code>AH01071: Got error 'PHP message: …'</code> (lỗi của PHP-FPM được chuyển lại), <code>AH01079: failed to make connection to backend</code> (Apache làm proxy — phiên bản Apache của cái 502 bên nginx).</p>

<h3>Phần B — IIS (Internet Information Services)</h3>
<p>IIS ghi mỗi site mỗi ngày một tệp văn bản theo định dạng <strong>W3C extended</strong>, mặc định ở <code>%SystemDrive%\\inetpub\\logs\\LogFiles\\W3SVC&lt;mã site&gt;\\u_exYYMMDD.log</code>. Gói log mẫu của khoá có một tệp như vậy (bài 0.1). Mẹo: tệp tự mô tả chính nó.</p>
${lenh('s10/iis', 0)}
${lenh('s10/iis', 1)}
<p>Dòng bắt đầu bằng <code>#</code> là tiêu đề, được lặp lại mỗi lần IIS mở tệp mới. <strong><code>#Fields</code> là bản đồ cột</strong> — quản trị viên có thể thêm bớt trường, nên đừng bao giờ mặc định cột 12 là mã trạng thái: đọc <code>#Fields</code> trước. Dấu cách bên trong giá trị bị thay bằng <code>+</code> (nhìn user agent). Thêm hai cái bẫy: <strong>ngày giờ là UTC</strong> bất kể múi giờ của server, và <strong><code>time-taken</code> tính bằng mili giây</strong> (nginx: giây).</p>
${lenh('s10/iis', 2)}
${lenh('s10/iis', 3)}
${lenh('s10/iis', 4)}
<p>IIS chia mã trạng thái làm ba: <code>sc-status</code> (mã HTTP), <code>sc-substatus</code> (lý do chi tiết hơn của IIS) và <code>sc-win32-status</code> (lỗi Windows đằng sau). Trong gói mẫu này substatus luôn là 0, nhưng ở log thật, substatus là chỗ chứa câu trả lời:</p>
<table>
<thead><tr><th>Mã</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td>401.1 / 401.2</td><td>Đăng nhập thất bại (sai thông tin) / cấu hình không cho phép cách xác thực nào</td></tr>
<tr><td>403.14</td><td>Không cho liệt kê thư mục (thiếu trang mặc định)</td></tr>
<tr><td>404.0 / 404.7</td><td>Không tìm thấy / đuôi tệp bị bộ lọc request chặn</td></tr>
<tr><td>500.19</td><td>Dữ liệu cấu hình không hợp lệ (web.config hỏng)</td></tr>
<tr><td>502.5 (hoặc 500.30)</td><td>App ASP.NET Core không khởi động được (ASP.NET Core Module)</td></tr>
<tr><td>503 (+ HTTPERR)</td><td>Application pool đã dừng hoặc hàng đợi đầy</td></tr>
</tbody></table>
<p><code>sc-win32-status</code> 0 = ổn; 64 ("network name no longer available") và 1236 ("connection aborted") thường nghĩa là khách đã bỏ đi — phiên bản IIS của 499 bên nginx. Ở đây trang chậm lộ rõ: <code>/portal/report.aspx</code> trung bình 2,2 giây và các lần 500 của nó mất 4,6–11 giây — nhiều khả năng là hết giờ chờ bên trong trang.</p>

<h3>HTTPERR — khi request chết trước khi IIS kịp thấy</h3>
<p>Bên dưới IIS là driver nhân <code>HTTP.sys</code>. Nếu nó từ chối một request (sai định dạng, quá dài, app pool đang tắt, kết nối hết giờ), log IIS <em>không có dòng nào cả</em>; dấu vết nằm ở <code>%SystemRoot%\\System32\\LogFiles\\HTTPERR\\httperr*.log</code>. Cột <code>s-reason</code> cho biết lý do: <code>Timer_ConnectionIdle</code> (đóng kết nối rảnh — thường vô hại), <code>Connection_Dropped</code>, <code>BadRequest</code>, <code>AppOffline</code> hay <code>QueueFull</code> (app pool tắt hoặc quá tải — một cái 503 thật). "Người dùng nhận 503 mà log IIS trống" → mở HTTPERR.</p>

<h3>Đọc log W3C bằng PowerShell</h3>
<pre><code class="language-powershell">$f = 'C:\\inetpub\\logs\\LogFiles\\W3SVC1\\u_ex261120.log'
$cols = ((Get-Content $f -TotalCount 10 | Where-Object { $_ -like '#Fields:*' }) -replace '^#Fields: ' -split ' ')
Get-Content $f | Where-Object { $_ -notlike '#*' } |
  ConvertFrom-Csv -Delimiter ' ' -Header $cols |
  Where-Object { [int]$_.'sc-status' -ge 500 } |
  Group-Object 'cs-uri-stem' | Sort-Object Count -Descending | Select-Object Count, Name</code></pre>
<p>Chạy thật trên gói log của khoá (PowerShell 7.4.2 trong container, đổi đường thành <code>windows/u_ex261120.log</code>):</p>
<pre><code>Count Name
----- ----
   13 /portal/report.aspx</code></pre>
<p>Cùng ý tưởng với bài 2.5: dựng tiêu đề từ <code>#Fields</code>, bỏ dòng chú thích, rồi lọc đối tượng theo tên. Công cụ miễn phí <strong>Log Parser 2.2</strong> của Microsoft (truy vấn SQL trên log) vẫn được dùng ở các đội Windows; bạn sẽ nhận ra câu <code>SELECT … FROM u_ex*.log</code> của nó trong các tài liệu vận hành cũ.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Outsourcing cho khách Nhật chạy server Windows:</strong> khách gửi một tệp zip toàn <code>u_ex*.log</code> và hỏi "vì sao portal chậm hôm 20?". Đọc <code>#Fields</code>, đổi giờ từ UTC sang giờ Nhật (UTC+9) trong báo cáo, xếp theo <code>time-taken</code> — và ghi rõ "ms", vì đội vận hành của họ đang so với log Apache tính bằng micro giây.</li>
<li><strong>Hosting dùng chung cho đồ án:</strong> cPanel cho bạn trang "Raw Access" và "Errors" của Apache — đúng hai log ở trên. Báo "Internal Server Error" mà access log chẳng có gì? Dòng error log có <code>AH01071</code> mang theo thông điệp của PHP.</li>
<li><strong>Nếu</strong> phải so log IIS với log nginx của proxy đứng trước nó? Đổi cả hai về UTC và cùng đơn vị, rồi ghép theo IP khách và URL trong cùng một giây (bài 1.5).</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy lại container httpd, chuyển access log sang combined bằng <code>docker exec lgz-httpd sed -i 's/CustomLog \\/proc\\/self\\/fd\\/1 common/CustomLog \\/proc\\/self\\/fd\\/1 combined/' /usr/local/apache2/conf/httpd.conf</code>, rồi <code>docker exec lgz-httpd httpd -k graceful</code>; gửi lại ba lệnh curl. Chứng minh User-Agent giờ đã xuất hiện.</li>
<li>Trên mẫu IIS, liệt kê 3 giờ (UTC) có nhiều request nhất, rồi đổi sang giờ Việt Nam.</li>
<li>Với <code>/portal/report.aspx</code>, in 5 request chậm nhất kèm mã trạng thái và time-taken tính bằng giây.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 có <code>"lab-client/1.0"</code> trong access log; câu 2 cộng 7 giờ vào mọi giờ bạn in ra; câu 3 bắt đầu bằng 11,331 s, 11 s và 10,362 s — tất cả đều là 500.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['common / combined', 'Định dạng Apache: common = %h %l %u %t "%r" %>s %b; combined thêm Referer và User-Agent.'],
  ['%D / %{ms}T', 'Thời gian xử lý request của Apache tính bằng micro giây / mili giây.'],
  ['mã AH', 'Định danh lỗi ổn định của Apache, ví dụ AH00558, AH01630.'],
  ['W3C extended', 'Định dạng log của IIS; #Fields liệt kê các cột; giờ theo UTC.'],
  ['sc-substatus', 'Mã chi tiết của IIS sau mã HTTP, ví dụ 401.1, 500.19.'],
  ['time-taken', 'Thời gian xử lý request của IIS, tính bằng mili giây.'],
  ['HTTPERR', 'Log của HTTP.sys cho request bị từ chối trước khi tới IIS.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Apache: <code>common</code> không có user agent và thời gian xử lý — chuyển sang combined và thêm <code>%D</code>.</li>
<li>Dòng lỗi Apache: <code>[module:mức]</code> + một mã AH tra được.</li>
<li>IIS: đọc <code>#Fields</code> trước; giờ là UTC; <code>time-taken</code> là ms; substatus mới là lý do thật.</li>
<li>Log IIS trống mà người dùng thấy 503? Tìm trong HTTPERR.</li>
</ul>
${nguon('📘', 'Apache httpd 2.4 — Log Files', 'LogFormat, CustomLog, ErrorLog, LogLevel, log qua ống', 'https://httpd.apache.org/docs/2.4/logs.html')}
${nguon('📘', 'Microsoft Learn — HTTP status codes in IIS', 'Mọi mã status.substatus và cách xử lý', 'https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/health-diagnostic-performance/http-status-code')}
</div>
`,
};
