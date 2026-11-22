/**
 * 1.1 — Log, sự kiện, metric, trace, nhật ký kiểm toán (soạn 22/11/2026).
 * Không trùng: obs-0-2-ba-tru-cot (ba trụ cột chuyên sâu) — ở đây chỉ PHÂN LOẠI để biết mở nguồn nào.
 * Output: OUT['s01/muc-log'] (lệnh 0) chạy thật trên gói log mẫu.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '1.1 — Log, event, metric, trace, audit trail: what is what|||1.1 — Log, sự kiện, metric, trace, nhật ký kiểm toán: cái nào là cái nào',
  slug: 'log-1-1-log-la-gi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn loại log theo người ghi (hệ thống, ứng dụng, truy cập, bảo mật/kiểm toán) và bốn mục đích (gỡ lỗi, vận hành, bảo mật, tuân thủ); sự kiện (event) của Windows khác dòng log văn bản ở đâu; khi nào hỏi log, khi nào metric hay trace trả lời nhanh hơn; bảng "câu hỏi → mở nguồn nào trước" cho tình huống máy tự khởi động lại, web 502, ai đăng nhập.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Log, event, metric, trace, audit trail: knowing which one you are holding</h2>
<p class="lead">When something breaks, the first minute decides a lot: do you open the right source, or do you scroll through the wrong one for half an hour? This lesson gives you a vocabulary for "which kind of record is this" — by who writes it and why — and a table that maps everyday questions to the source you should open first.</p>

<h3>The everyday picture: a hospital</h3>
<ul>
<li>The <strong>nurse's shift notes</strong> ("bed 12 had a fever at 03:00, gave paracetamol") — <em>operational logs</em>.</li>
<li>The <strong>heart-rate monitor</strong> showing a number every second — a <em>metric</em>.</li>
<li>The <strong>patient's path</strong> through reception → X-ray → doctor → pharmacy with times — a <em>trace</em>.</li>
<li>The <strong>controlled-drugs register</strong>, signed by two people, never erased — an <em>audit trail</em>.</li>
</ul>
<p>Same hospital, four kinds of record, each answering a different question. Your servers are the same.</p>

<h3>Step 1 — four kinds of log, by who writes them</h3>
<table>
<thead><tr><th>Kind</th><th>Written by</th><th>Typical examples</th><th>Answers</th></tr></thead>
<tbody>
<tr><td><strong>System log</strong></td><td>The operating system and its services</td><td>Windows <em>System</em> log, Linux journal, <code>dmesg</code>, macOS unified log</td><td>Boot, shutdown, drivers, disks, services starting and dying, out-of-memory</td></tr>
<tr><td><strong>Application log</strong></td><td>A program — including yours</td><td>A Node/Spring app's log file, Windows <em>Application</em> log, PostgreSQL log</td><td>Errors inside the app, slow operations, business events</td></tr>
<tr><td><strong>Access log</strong></td><td>Something that serves requests</td><td>nginx/Apache/IIS access log, load balancer log, firewall allow/deny</td><td>Who requested what, when, with which result</td></tr>
<tr><td><strong>Security / audit log</strong></td><td>The OS or app, about identity and permissions</td><td>Windows <em>Security</em> log, <code>/var/log/auth.log</code>, <code>auditd</code>, database audit</td><td>Who logged in, who changed permissions, who read sensitive data</td></tr>
</tbody></table>
<p>The boundary is not sharp — <code>sshd</code> is a service (system) that writes about logins (security) — but the table tells you where to start.</p>

<h3>Step 2 — four purposes, which decide how a log must be kept</h3>
<ul>
<li><strong>Debugging</strong> — very detailed, kept for days, can be noisy. Losing some is acceptable.</li>
<li><strong>Operations</strong> — errors, restarts, latency; kept weeks to months; feeds alerts (Chapter 15).</li>
<li><strong>Security</strong> — logins, privilege changes, suspicious requests; must be complete and sent off the machine quickly, because attackers delete local copies.</li>
<li><strong>Compliance / audit</strong> — required by a law or a contract; must be complete, tamper-evident, kept for a defined period (Chapter 16).</li>
</ul>
<div class="callout warn"><p><strong>Why it matters to you now:</strong> when a teammate says "just turn off logging, the disk is full", ask which purpose those logs serve. Turning off debug logs is fine; deleting the authentication log of a server is not.</p></div>

<h3>Step 3 — "event" versus "log line"</h3>
<p>On Windows you read <strong>events</strong>: structured records with fixed fields (Event ID, Level, Provider, TimeCreated, and an XML body). In a Linux text file you read <strong>lines</strong>: whatever text the program printed. Modern Linux (the journal) and modern apps (JSON logs) are closer to Windows: each record is a set of named fields. Here is the sample app's JSON log: every record has a numeric field <code>level</code>, so you can count records by kind without reading a single message:</p>
${lenh('s01/muc-log', 0)}
<p>695 informational records, 22 warnings, 25 errors — a first picture of a day in one command. With free text you would need a pattern for every message format; with fields you just ask for the field. That is the whole argument for structured logging, which lesson 1.4 continues.</p>

<h3>Step 4 — log, metric or trace? Pick by the question</h3>
<table>
<thead><tr><th>Your question</th><th>Fastest answer</th><th>Why not the others first</th></tr></thead>
<tbody>
<tr><td>"Is the error rate higher than usual?"</td><td>Metric</td><td>Counting log lines works, but a metric graph shows the trend instantly</td></tr>
<tr><td>"What error did user 1027 get at 14:05?"</td><td>Log</td><td>Metrics have no per-user detail</td></tr>
<tr><td>"Which of our five services makes checkout slow?"</td><td>Trace</td><td>Logs from five services must be stitched by hand</td></tr>
<tr><td>"Who added an admin account last night?"</td><td>Security/audit log</td><td>Nothing else records identity changes</td></tr>
<tr><td>"Did the server run out of memory?"</td><td>Metric for "how close", system log for "what was killed"</td><td>Both — this is common</td></tr>
</tbody></table>
<p>A student project usually has no metrics or traces at all — just logs. That is fine: everything in this course works with logs alone, and the observability course adds the rest.</p>

<h3>Real situation: "my PC restarted itself last night — which log?"</h3>
<p>Not the Application log (apps do not restart the machine), not the Security log (that is about logins). It is the <strong>System</strong> log, because power, kernel, drivers and the update service write there. You will look for a handful of event IDs (Kernel-Power 41, EventLog 6008, User32 1074) in Chapter 4 — but knowing <em>which log</em> already cuts the search from millions of events to a few hundred.</p>
<table>
<thead><tr><th>Situation</th><th>Open first</th><th>Then</th></tr></thead>
<tbody>
<tr><td>PC restarted unexpectedly</td><td>Windows System log</td><td>Reliability Monitor (Chapter 3)</td></tr>
<tr><td>Website returns 502</td><td>Web server error log</td><td>App log, then system log of the app server</td></tr>
<tr><td>"Someone logged into my account"</td><td>The app's own login/audit log</td><td>Access log for that user's IPs</td></tr>
<tr><td>Linux service keeps dying</td><td>The journal of that service unit</td><td>Kernel messages (OOM)</td></tr>
<tr><td>Page blank for one user</td><td>Browser DevTools Console</td><td>Network tab, then the server's access log</td></tr>
</tbody></table>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok"><ol>
<li>On your own Windows machine open Event Viewer → Windows Logs. Write down the <em>number of events</em> shown for Application, Security and System (the count appears in the right-hand header). On Linux/WSL instead run <code>journalctl --list-boots | tail -n 3</code>.</li>
<li>For each of the five situations in the last table, write the source you would open first <em>on your own machine</em> (your laptop has no nginx — say so).</li>
<li>In the sample pack, run the command shown in Step 3 and write one sentence: what share of the app's records are errors?</li>
</ol>
<p><strong>Done when:</strong> you can name the first source for all five situations on your own machine, and you computed that errors are about 3% of the sample app's records (25 of 742).</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['system log', 'Written by the operating system and its services: boot, drivers, services, memory.'],
  ['application log', 'Written by a program about its own work and errors.'],
  ['access log', 'One record per request served: who, what, when, result.'],
  ['audit log / audit trail', 'A complete, trustworthy record of who did what to which data.'],
  ['event', 'A structured record with named fields (Windows Event ID, journal fields).'],
  ['structured log', 'A log whose records are fields (JSON, key=value) instead of free text.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Four kinds by writer: system, application, access, security/audit.</li>
<li>Four purposes — debugging, operations, security, compliance — decide how long and how safely logs are kept.</li>
<li>Windows events and journal/JSON records have named fields; plain text lines do not.</li>
<li>Choose log, metric or trace by the question; student projects usually have only logs, and that is enough.</li>
<li>"PC restarted" → System log; "502" → web server error log; "who logged in" → security/audit log.</li>
</ul>
${nguon('📗', 'NIST SP 800-92 — Guide to Computer Security Log Management', 'Section 2 classifies security software, OS and application logs', 'https://csrc.nist.gov/pubs/sp/800/92/final')}
${nguon('📘', 'Microsoft Learn — Event logging', 'How Windows defines an event and the standard logs', 'https://learn.microsoft.com/en-us/windows/win32/eventlog/event-logging')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-0-2-ba-tru-cot', title: 'Observability 0.2 — the three pillars', sub: 'Metrics, logs and traces taught in depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Log, sự kiện, metric, trace, nhật ký kiểm toán: biết mình đang cầm loại nào</h2>
<p class="lead">Khi có sự cố, phút đầu tiên quyết định nhiều thứ: bạn mở đúng nguồn, hay cuộn một nguồn sai suốt nửa giờ? Bài này cho bạn bộ từ vựng "bản ghi này thuộc loại nào" — theo ai ghi và ghi để làm gì — cùng một bảng nối những câu hỏi hằng ngày với nguồn nên mở đầu tiên.</p>

<h3>Liên tưởng đời thường: một bệnh viện</h3>
<ul>
<li><strong>Sổ giao ca của y tá</strong> ("giường 12 sốt lúc 03:00, đã cho paracetamol") — <em>log vận hành</em>.</li>
<li><strong>Máy đo nhịp tim</strong> hiện một con số mỗi giây — một <em>metric (số đo)</em>.</li>
<li><strong>Đường đi của bệnh nhân</strong> qua tiếp đón → chụp X-quang → bác sĩ → nhà thuốc, có ghi giờ — một <em>trace (vết)</em>.</li>
<li><strong>Sổ thuốc gây nghiện</strong>, hai người ký, không bao giờ tẩy xoá — một <em>nhật ký kiểm toán (audit trail)</em>.</li>
</ul>
<p>Cùng một bệnh viện, bốn loại bản ghi, mỗi loại trả lời một câu hỏi khác nhau. Server của bạn cũng vậy.</p>

<h3>Bước 1 — bốn loại log, theo ai ghi</h3>
<table>
<thead><tr><th>Loại</th><th>Ai ghi</th><th>Ví dụ thường gặp</th><th>Trả lời câu gì</th></tr></thead>
<tbody>
<tr><td><strong>Log hệ thống</strong></td><td>Hệ điều hành và các dịch vụ của nó</td><td>Nhật ký <em>System</em> của Windows, journal của Linux, <code>dmesg</code>, unified log của macOS</td><td>Khởi động, tắt máy, driver, ổ đĩa, dịch vụ chạy và chết, hết bộ nhớ</td></tr>
<tr><td><strong>Log ứng dụng</strong></td><td>Một chương trình — kể cả của bạn</td><td>Tệp log của app Node/Spring, nhật ký <em>Application</em> của Windows, log PostgreSQL</td><td>Lỗi bên trong app, thao tác chậm, sự kiện nghiệp vụ</td></tr>
<tr><td><strong>Log truy cập (access log)</strong></td><td>Thứ phục vụ request</td><td>Access log của nginx/Apache/IIS, log bộ cân bằng tải, tường lửa cho/chặn</td><td>Ai yêu cầu gì, lúc nào, kết quả ra sao</td></tr>
<tr><td><strong>Log bảo mật / kiểm toán</strong></td><td>Hệ điều hành hay app, về danh tính và quyền</td><td>Nhật ký <em>Security</em> của Windows, <code>/var/log/auth.log</code>, <code>auditd</code>, kiểm toán CSDL</td><td>Ai đăng nhập, ai đổi quyền, ai đọc dữ liệu nhạy cảm</td></tr>
</tbody></table>
<p>Ranh giới không sắc nét — <code>sshd</code> là một dịch vụ (hệ thống) nhưng ghi về đăng nhập (bảo mật) — nhưng bảng này cho bạn biết bắt đầu từ đâu.</p>

<h3>Bước 2 — bốn mục đích, quyết định log phải được giữ thế nào</h3>
<ul>
<li><strong>Gỡ lỗi (debug)</strong> — rất chi tiết, giữ vài ngày, có thể ồn. Mất một ít cũng chấp nhận được.</li>
<li><strong>Vận hành</strong> — lỗi, khởi động lại, độ trễ; giữ vài tuần tới vài tháng; là nguồn cho cảnh báo (Chương 15).</li>
<li><strong>Bảo mật</strong> — đăng nhập, đổi quyền, request đáng ngờ; phải đầy đủ và được đẩy ra khỏi máy thật nhanh, vì kẻ tấn công sẽ xoá bản tại chỗ.</li>
<li><strong>Tuân thủ / kiểm toán</strong> — luật hoặc hợp đồng bắt buộc; phải đầy đủ, khó sửa lén, giữ đúng một khoảng thời gian quy định (Chương 16).</li>
</ul>
<div class="callout warn"><p><strong>Vì sao điều này quan trọng với bạn ngay bây giờ:</strong> khi bạn cùng nhóm bảo "tắt log đi cho rồi, đầy đĩa", hãy hỏi log đó phục vụ mục đích nào. Tắt log debug thì ổn; xoá log xác thực của một server thì không.</p></div>

<h3>Bước 3 — "sự kiện" khác "dòng log" ở đâu</h3>
<p>Trên Windows bạn đọc <strong>sự kiện (event)</strong>: bản ghi có cấu trúc với các trường cố định (Event ID, Level, Provider, TimeCreated, và một thân XML). Trong một tệp văn bản trên Linux bạn đọc <strong>dòng</strong>: chương trình in ra chữ gì thì có chữ đó. Linux đời mới (journal) và app đời mới (log JSON) giống Windows hơn: mỗi bản ghi là một tập trường có tên. Đây là log JSON của app mẫu: bản ghi nào cũng có trường số <code>level</code>, nên đếm được bản ghi theo loại mà không cần đọc một thông điệp nào:</p>
${lenh('s01/muc-log', 0)}
<p>695 bản ghi thông tin, 22 cảnh báo, 25 lỗi — bức tranh đầu tiên của cả một ngày chỉ bằng một lệnh. Với chữ tự do, bạn cần một mẫu tìm cho mỗi kiểu thông điệp; với trường, bạn chỉ việc hỏi trường. Đó là toàn bộ lý lẽ của log có cấu trúc (structured logging), bài 1.4 nói tiếp.</p>

<h3>Bước 4 — log, metric hay trace? Chọn theo câu hỏi</h3>
<table>
<thead><tr><th>Câu hỏi của bạn</th><th>Trả lời nhanh nhất</th><th>Vì sao không dùng cái khác trước</th></tr></thead>
<tbody>
<tr><td>"Tỉ lệ lỗi có cao hơn mọi khi không?"</td><td>Metric</td><td>Đếm dòng log cũng được, nhưng đồ thị metric cho thấy xu hướng ngay</td></tr>
<tr><td>"Người dùng 1027 gặp lỗi gì lúc 14:05?"</td><td>Log</td><td>Metric không có chi tiết theo từng người</td></tr>
<tr><td>"Trong năm dịch vụ, cái nào làm bước thanh toán chậm?"</td><td>Trace</td><td>Log của năm dịch vụ phải tự ghép bằng tay</td></tr>
<tr><td>"Đêm qua ai đã thêm một tài khoản admin?"</td><td>Log bảo mật/kiểm toán</td><td>Không gì khác ghi lại thay đổi về danh tính</td></tr>
<tr><td>"Server có hết bộ nhớ không?"</td><td>Metric cho "sát tới đâu", log hệ thống cho "cái gì bị giết"</td><td>Cả hai — chuyện này rất hay gặp</td></tr>
</tbody></table>
<p>Đồ án sinh viên thường chẳng có metric hay trace gì — chỉ có log. Không sao: mọi thứ trong khoá này làm được chỉ với log, khoá observability bổ sung phần còn lại.</p>

<h3>Tình huống thật: "đêm qua máy tự khởi động lại — xem log nào?"</h3>
<p>Không phải nhật ký Application (app không khởi động lại máy), không phải Security (đó là chuyện đăng nhập). Là nhật ký <strong>System</strong>, vì nguồn điện, nhân hệ điều hành, driver và dịch vụ cập nhật đều ghi vào đó. Ở Chương 4 bạn sẽ tìm vài mã sự kiện (Kernel-Power 41, EventLog 6008, User32 1074) — nhưng chỉ cần biết <em>mở log nào</em> đã thu hẹp việc tìm từ hàng triệu sự kiện xuống vài trăm.</p>
<table>
<thead><tr><th>Tình huống</th><th>Mở đầu tiên</th><th>Rồi tới</th></tr></thead>
<tbody>
<tr><td>Máy tự khởi động lại</td><td>Nhật ký System của Windows</td><td>Reliability Monitor (Chương 3)</td></tr>
<tr><td>Web trả 502</td><td>Error log của web server</td><td>Log của app, rồi log hệ thống của máy chạy app</td></tr>
<tr><td>"Có người vào tài khoản của tôi"</td><td>Log đăng nhập/kiểm toán của chính app</td><td>Access log theo các IP của người đó</td></tr>
<tr><td>Dịch vụ Linux cứ chết hoài</td><td>Journal của đúng unit dịch vụ đó</td><td>Thông điệp của nhân (OOM)</td></tr>
<tr><td>Trang trắng với một người dùng</td><td>Console trong DevTools của trình duyệt</td><td>Tab Network, rồi access log của server</td></tr>
</tbody></table>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy Windows của bạn mở Event Viewer → Windows Logs. Ghi lại <em>số sự kiện</em> đang có của Application, Security và System (con số hiện ở đầu khung bên phải). Trên Linux/WSL thì chạy <code>journalctl --list-boots | tail -n 3</code>.</li>
<li>Với năm tình huống trong bảng cuối, ghi nguồn bạn sẽ mở đầu tiên <em>trên chính máy mình</em> (laptop bạn không có nginx — ghi rõ như vậy).</li>
<li>Trong gói log mẫu, chạy lệnh ở Bước 3 và viết một câu: lỗi chiếm bao nhiêu phần trong các bản ghi của app?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi tên được nguồn đầu tiên cho cả năm tình huống trên máy mình, và tính ra lỗi chiếm khoảng 3% bản ghi của app mẫu (25 trên 742).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['system log (log hệ thống)', 'Do hệ điều hành và dịch vụ của nó ghi: khởi động, driver, dịch vụ, bộ nhớ.'],
  ['application log (log ứng dụng)', 'Do một chương trình ghi về công việc và lỗi của chính nó.'],
  ['access log (log truy cập)', 'Mỗi request được phục vụ một bản ghi: ai, cái gì, lúc nào, kết quả.'],
  ['audit log (nhật ký kiểm toán)', 'Bản ghi đầy đủ, đáng tin về ai đã làm gì với dữ liệu nào.'],
  ['event (sự kiện)', 'Bản ghi có cấu trúc với các trường có tên (Event ID của Windows, trường của journal).'],
  ['structured log (log có cấu trúc)', 'Log mà mỗi bản ghi là các trường (JSON, khoá=giá trị) thay vì chữ tự do.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn loại theo người ghi: hệ thống, ứng dụng, truy cập, bảo mật/kiểm toán.</li>
<li>Bốn mục đích — gỡ lỗi, vận hành, bảo mật, tuân thủ — quyết định log được giữ bao lâu và an toàn tới đâu.</li>
<li>Sự kiện Windows và bản ghi journal/JSON có trường có tên; dòng văn bản thường thì không.</li>
<li>Chọn log, metric hay trace theo câu hỏi; đồ án sinh viên thường chỉ có log, và thế là đủ.</li>
<li>"Máy tự khởi động lại" → System; "502" → error log web server; "ai đăng nhập" → log bảo mật/kiểm toán.</li>
</ul>
${nguon('📗', 'NIST SP 800-92 — Hướng dẫn quản lý log bảo mật', 'Mục 2 phân loại log của phần mềm bảo mật, hệ điều hành và ứng dụng', 'https://csrc.nist.gov/pubs/sp/800/92/final')}
${nguon('📘', 'Microsoft Learn — Event logging', 'Windows định nghĩa một sự kiện và các nhật ký chuẩn thế nào', 'https://learn.microsoft.com/en-us/windows/win32/eventlog/event-logging')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-0-2-ba-tru-cot', title: 'Observability 0.2 — ba trụ cột', sub: 'Metric, log và trace dạy chuyên sâu' })}
</div>
`,
};
