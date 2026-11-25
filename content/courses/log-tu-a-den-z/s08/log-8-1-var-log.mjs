/**
 * 8.1 — Dạo /var/log (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s08/var-log'] — máy ảo lab7 (Ubuntu 24.04.5, ảnh cloud tối giản) TRƯỚC và SAU khi cài rsyslog;
 * Rocky Linux 9.9 và Fedora 44 chạy trong container docker run --rm (chỉ để đọc cấu hình mặc định của gói).
 * Nguồn: last(1), lastlog(8) (man7.org), rsyslog 50-default.conf của Ubuntu, /etc/rsyslog.conf của Rocky 9.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '8.1 — A tour of /var/log on Debian/Ubuntu vs RHEL/Fedora, and wtmp/btmp/lastlog|||8.1 — Dạo /var/log trên Debian/Ubuntu so với RHEL/Fedora, và wtmp/btmp/lastlog',
  slug: 'log-8-1-var-log',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở /var/log của một máy Ubuntu 24.04 thật và thấy… không có syslog hay auth.log: ảnh cloud mới chỉ còn journald. Cài rsyslog để các tệp quen thuộc hiện ra, đối chiếu tên tệp Debian/Ubuntu với Rocky/RHEL (messages, secure, maillog, cron) và Fedora 44. Đọc ba tệp nhị phân wtmp/btmp/lastlog bằng last, lastb, lastlog, utmpdump (và bẫy giờ UTC trong đó), log cài gói dpkg/apt, cloud-init. Góc hacker: sửa wtmp để xoá dấu vết, và mật khẩu gõ nhầm vào ô tên người dùng nằm trong btmp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>A tour of /var/log — and the day it is almost empty</h2>
<p class="lead">Chapter 7 read the journal. This chapter reads the other half of Linux logging: plain text files in <code>/var/log</code> written by rsyslog, the binary login records wtmp/btmp/lastlog, the kernel's audit trail (auditd) and the job that keeps all of it from filling the disk (logrotate). Everything below was run on the same lab7 VM (Ubuntu 24.04) plus Rocky Linux 9 and Fedora 44 for comparison.</p>

<h3>The everyday picture: a building's paperwork</h3>
<p>The journal is the CCTV recorder from Chapter 7: everything, indexed, searchable. <code>/var/log</code> is the old paperwork room: one binder for visitors (auth.log), one for the boiler (kern.log), one for deliveries (mail.log), plus a punch-card machine at the door (wtmp) and a list of people who were refused (btmp). Different buildings name the binders differently — that is the Debian vs Red Hat difference.</p>

<h3>Step 1 — check before you search</h3>
${lenh('s08/var-log', 0)}
${lenh('s08/var-log', 1)}
${lenh('s08/var-log', 2)}
${lenh('s08/var-log', 3)}
<p>A fresh Ubuntu 24.04 <strong>cloud image</strong> has no <code>syslog</code>, no <code>auth.log</code>: rsyslog is not installed, so nothing writes text files. Many tutorials say "look in /var/log/auth.log" and the junior gets "No such file" and concludes "no logins happened". Wrong: the logins are in the journal.</p>
${lenh('s08/var-log', 4)}
<p>Rule: on any unknown machine, first ask <em>who writes logs here</em> — <code>systemctl status rsyslog</code> (or syslog-ng), and <code>journalctl --disk-usage</code>. Desktop Ubuntu and most servers installed from the ISO do ship rsyslog; minimal cloud images, containers and Fedora often do not.</p>

<h3>Step 2 — install rsyslog and the familiar files appear</h3>
${lenh('s08/var-log', 14)}
${lenh('s08/var-log', 15)}
${lenh('s08/var-log', 16)}
${lenh('s08/var-log', 17)}
<p>One failed SSH attempt from another lab machine, and it is in <code>auth.log</code> with a full timestamp: <code>2026-11-24T04:52:52.496170+07:00</code> — date, time to the microsecond, and time zone. That is the RFC 3339 "high precision" format that the rsyslog package of recent Debian/Ubuntu enables by default (the package changelog: "Enable high precision timestamps with timezone information"); <code>last --since</code> accepts <code>-3days</code>, <code>yesterday</code> or a date, not "last friday". Older systems (and Rocky 9) write <code>Nov 24 04:52:52</code>: no year, no zone (Chapter 1.5 explains why that hurts). Which file gets which line is decided by the rules in <code>/etc/rsyslog.d/50-default.conf</code>:</p>
${lenh('s08/var-log', 18)}
<p>Read it as "<em>facility.severity → file</em>": everything from <code>auth</code>/<code>authpriv</code> goes to <code>auth.log</code>; everything else except auth goes to <code>syslog</code>; the kernel to <code>kern.log</code>; emergencies to every logged-in terminal. The <code>-</code> before a path means "don't fsync after each line" (faster, may lose the last lines in a crash). Lesson 8.2 writes these rules.</p>

<h3>Step 3 — the same thing, Red Hat style</h3>
${lenh('s08/var-log', 19)}
${lenh('s08/var-log', 20)}
<table>
<tr><th>What</th><th>Debian / Ubuntu</th><th>RHEL / Rocky / Alma</th><th>Fedora 44</th></tr>
<tr><td>General system log</td><td><code>/var/log/syslog</code></td><td><code>/var/log/messages</code></td><td>journal only (rsyslog not installed)</td></tr>
<tr><td>Logins, sudo, su, sshd</td><td><code>/var/log/auth.log</code></td><td><code>/var/log/secure</code></td><td><code>journalctl _COMM=sshd</code> …</td></tr>
<tr><td>Kernel</td><td><code>/var/log/kern.log</code></td><td>in <code>messages</code></td><td><code>journalctl -k</code></td></tr>
<tr><td>Cron, mail</td><td>in <code>syslog</code>, <code>mail.log</code></td><td><code>/var/log/cron</code>, <code>/var/log/maillog</code></td><td>journal</td></tr>
<tr><td>Package installs</td><td><code>dpkg.log</code>, <code>apt/history.log</code></td><td><code>dnf.log</code>, <code>dnf.rpm.log</code></td><td>same as RHEL</td></tr>
<tr><td>Login records</td><td colspan="3"><code>wtmp</code>, <code>btmp</code>, <code>lastlog</code> (binary) — newer util-linux adds <code>lastlog2</code> (SQLite)</td></tr>
</table>

<h3>Step 4 — the binary trio: wtmp, btmp, lastlog</h3>
${lenh('s08/var-log', 5)}
<p><code>file</code> calls them "data": you cannot <code>cat</code> or <code>grep</code> them. Each is a table of fixed-size records written by login programs (sshd, login, systemd):</p>
<ul>
<li><strong>wtmp</strong> — every login, logout, boot and shutdown. Read with <code>last</code>.</li>
<li><strong>btmp</strong> — every <em>failed</em> login. Read with <code>lastb</code> (root only — see the hacker's corner).</li>
<li><strong>lastlog</strong> — one slot per UID: the last time each user logged in. Read with <code>lastlog</code>.</li>
</ul>
${lenh('s08/var-log', 6)}
${lenh('s08/var-log', 7)}
<p><code>last -x</code> adds the <code>shutdown</code> and <code>reboot</code> pseudo-users. Compare with Chapter 7: a <code>reboot</code> line <em>without</em> a <code>shutdown</code> line just before it is a crash or power cut — exactly what <code>--list-boots</code> showed. Here 04:41 has a shutdown (the clean reboot into the new kernel 6.8.0-149).</p>
${lenh('s08/var-log', 8)}
${lenh('s08/var-log', 9)}
${lenh('s08/var-log', 10)}
<p><code>utmpdump</code> shows the raw records. Look at the time: <code>2026-11-23T21:52:42+00:00</code> — UTC, while <code>last</code> printed 04:52 local time (+07). Same event, two clocks. When you paste a wtmp line into an incident report, write the zone.</p>

<h3>Step 5 — who installed what, and when the machine was born</h3>
${lenh('s08/var-log', 11)}
${lenh('s08/var-log', 12)}
${lenh('s08/var-log', 13)}
<p><code>apt/history.log</code> has the part people forget: <code>Requested-By: hv (1000)</code> — <em>which user</em> ran the install (through sudo). "Who installed this weird package on the server?" is answered here. <code>cloud-init.log</code> tells you when a cloud VM was first configured — again in UTC (<code>+0000</code>).</p>

<h3>Hacker's corner: wtmp is just a file, and btmp may hold passwords</h3>
<p>Because wtmp/btmp/lastlog are plain files of fixed records, an attacker with root can dump them with <code>utmpdump</code>, delete their own lines, and write them back (<code>utmpdump -r</code>). Tools that "clean" these files have existed since the 1990s; MITRE ATT&amp;CK lists this as <strong>T1070.002 — Clear Linux or Mac System Logs</strong>. Signs: a <code>last</code> history with gaps that do not match the journal, a file modified time that is newer than its last record, a login in <code>auth.log</code> with no matching <code>last</code> line. Defence: forward logs to another machine (8.2) — a local file proves nothing once root is lost.</p>
<p>Second trap: <code>lastb</code> stores the <em>username</em> typed at each failed login. Users sometimes type their password into the username field. That is one reason btmp is <code>-rw-rw---- root utmp</code> (step 1) — and why you never copy raw <code>lastb</code> output into a ticket that many people read.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, client's server:</strong> the customer gives you an account on a RHEL VPS. <code>/var/log/auth.log</code> does not exist — look in <code>/var/log/secure</code>. You get "Permission denied" on it: ask to be added to the right group (<code>adm</code> on Ubuntu, <code>wheel</code>/ACL on RHEL, <code>systemd-journal</code> for the journal) instead of asking for full sudo.</li>
<li><strong>"Did anyone log in over the weekend?"</strong> — <code>last -F --since -3days</code> on wtmp, then confirm in auth.log/journal. Two sources that agree are evidence; one source is a hint.</li>
<li><strong>"Who installed nginx on prod?"</strong> — <code>grep -A3 nginx /var/log/apt/history.log*</code> → <code>Requested-By</code>.</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>On your own Linux VM: does <code>/var/log/auth.log</code> or <code>/var/log/secure</code> exist? Who writes it (<code>systemctl status rsyslog</code>)?</li>
<li>Run <code>last -x -n 10</code>. Find one reboot and say whether it was clean or a crash.</li>
<li>Run <code>sudo utmpdump /var/log/wtmp | tail -3</code> and convert the times to your local zone.</li>
<li>Find the last package you installed and which user requested it.</li>
</ol>
<p><strong>Done when:</strong> you can name, for your distribution, the file (or journal command) for logins, kernel and packages, and explain one difference between <code>last</code> time and <code>utmpdump</code> time.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['/var/log/syslog · messages', 'General text log of Debian/Ubuntu · of RHEL/Rocky. Exists only if rsyslog (or syslog-ng) runs.'],
  ['auth.log · secure', 'Logins, sudo, su, sshd, PAM — Debian/Ubuntu · RHEL family.'],
  ['wtmp / btmp / lastlog', 'Binary login records: all sessions + boots · failed logins · last login per user.'],
  ['last · lastb · lastlog · utmpdump', 'Readers for the binary trio; utmpdump prints raw records (UTC) and can write them back.'],
  ['adm group', 'On Debian/Ubuntu, members can read most files in /var/log without sudo.'],
  ['T1070.002', 'MITRE ATT&amp;CK: clearing Linux/Mac system logs to hide activity.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Check who writes logs before you look for files: minimal images may have only journald.</li>
<li>Debian names: syslog, auth.log, kern.log; Red Hat: messages, secure, cron, maillog.</li>
<li>wtmp/btmp/lastlog are binary — read with last/lastb/lastlog; utmpdump shows UTC.</li>
<li><code>apt/history.log</code> tells you which user installed a package.</li>
<li>Local login records can be edited by root; trust copies on another machine.</li>
</ul>
${nguon('📘', 'last(1)', 'wtmp/btmp, -x, -F, --since', 'https://man7.org/linux/man-pages/man1/last.1.html')}
${nguon('📘', 'lastlog(8)', 'Last login per user', 'https://man7.org/linux/man-pages/man8/lastlog.8.html')}
${nguon('🛡', 'MITRE ATT&CK T1070.002', 'Indicator Removal: Clear Linux or Mac System Logs', 'https://attack.mitre.org/techniques/T1070/002/')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux & Bash 10.3 — Logs and journalctl', sub: 'Beginner introduction to Linux logs' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Dạo /var/log — và ngày nó gần như trống trơn</h2>
<p class="lead">Chương 7 đọc journal. Chương này đọc nửa còn lại của log Linux: tệp văn bản trong <code>/var/log</code> do rsyslog ghi, ba tệp nhị phân ghi đăng nhập wtmp/btmp/lastlog, nhật ký kiểm toán của nhân (auditd) và công việc giữ cho tất cả không làm đầy đĩa (logrotate). Mọi lệnh dưới đây chạy thật trên chính máy ảo lab7 (Ubuntu 24.04), cộng Rocky Linux 9 và Fedora 44 để so sánh.</p>

<h3>Liên tưởng đời thường: phòng giấy tờ của một toà nhà</h3>
<p>Journal là đầu ghi camera ở Chương 7: ghi hết, có chỉ mục, tìm được. <code>/var/log</code> là phòng giấy tờ kiểu cũ: một bìa hồ sơ cho khách ra vào (auth.log), một bìa cho phòng máy (kern.log), một bìa cho bưu phẩm (mail.log), thêm máy chấm công ở cửa (wtmp) và danh sách người bị từ chối (btmp). Mỗi toà nhà đặt tên bìa một kiểu — đó chính là khác biệt Debian với Red Hat.</p>

<h3>Bước 1 — kiểm trước khi tìm</h3>
${lenh('s08/var-log', 0)}
${lenh('s08/var-log', 1)}
${lenh('s08/var-log', 2)}
${lenh('s08/var-log', 3)}
<p>Một <strong>ảnh cloud</strong> Ubuntu 24.04 mới tinh không có <code>syslog</code>, không có <code>auth.log</code>: rsyslog chưa cài, nên chẳng ai ghi tệp văn bản. Rất nhiều bài hướng dẫn bảo "xem /var/log/auth.log", người mới gặp "No such file" rồi kết luận "không có ai đăng nhập". Sai: các lần đăng nhập nằm trong journal.</p>
${lenh('s08/var-log', 4)}
<p>Luật: trên máy lạ, câu đầu tiên là <em>ai đang ghi log ở đây</em> — <code>systemctl status rsyslog</code> (hoặc syslog-ng), và <code>journalctl --disk-usage</code>. Ubuntu bản desktop và đa số máy chủ cài từ ISO có rsyslog; ảnh cloud tối giản, container và Fedora thường không có.</p>

<h3>Bước 2 — cài rsyslog, các tệp quen thuộc hiện ra</h3>
${lenh('s08/var-log', 14)}
${lenh('s08/var-log', 15)}
${lenh('s08/var-log', 16)}
${lenh('s08/var-log', 17)}
<p>Một lần SSH sai mật khẩu từ máy lab khác, và nó nằm ngay trong <code>auth.log</code> với mốc giờ đầy đủ: <code>2026-11-24T04:52:52.496170+07:00</code> — ngày, giờ tới micro giây, và múi giờ. Đó là định dạng RFC 3339 "độ chính xác cao" mà gói rsyslog của Debian/Ubuntu bản mới bật mặc định (changelog của gói ghi: "Enable high precision timestamps with timezone information"). Hệ cũ hơn (và Rocky 9) ghi <code>Nov 24 04:52:52</code>: không năm, không múi giờ (Bài 1.5 giải thích vì sao điều đó gây hại). Dòng nào vào tệp nào do các luật trong <code>/etc/rsyslog.d/50-default.conf</code> quyết định:</p>
${lenh('s08/var-log', 18)}
<p>Đọc thành "<em>facility.severity → tệp</em>": mọi thứ từ <code>auth</code>/<code>authpriv</code> vào <code>auth.log</code>; mọi thứ khác trừ auth vào <code>syslog</code>; nhân vào <code>kern.log</code>; mức khẩn cấp gửi lên mọi terminal đang đăng nhập. Dấu <code>-</code> trước đường dẫn nghĩa là "không fsync sau mỗi dòng" (nhanh hơn, có thể mất vài dòng cuối khi sập). Bài 8.2 sẽ tự viết các luật này.</p>

<h3>Bước 3 — cũng thứ đó, kiểu Red Hat</h3>
${lenh('s08/var-log', 19)}
${lenh('s08/var-log', 20)}
<table>
<tr><th>Nội dung</th><th>Debian / Ubuntu</th><th>RHEL / Rocky / Alma</th><th>Fedora 44</th></tr>
<tr><td>Log hệ thống chung</td><td><code>/var/log/syslog</code></td><td><code>/var/log/messages</code></td><td>chỉ journal (không cài rsyslog)</td></tr>
<tr><td>Đăng nhập, sudo, su, sshd</td><td><code>/var/log/auth.log</code></td><td><code>/var/log/secure</code></td><td><code>journalctl _COMM=sshd</code> …</td></tr>
<tr><td>Nhân</td><td><code>/var/log/kern.log</code></td><td>nằm trong <code>messages</code></td><td><code>journalctl -k</code></td></tr>
<tr><td>Cron, thư</td><td>trong <code>syslog</code>, <code>mail.log</code></td><td><code>/var/log/cron</code>, <code>/var/log/maillog</code></td><td>journal</td></tr>
<tr><td>Cài gói</td><td><code>dpkg.log</code>, <code>apt/history.log</code></td><td><code>dnf.log</code>, <code>dnf.rpm.log</code></td><td>như RHEL</td></tr>
<tr><td>Bản ghi đăng nhập</td><td colspan="3"><code>wtmp</code>, <code>btmp</code>, <code>lastlog</code> (nhị phân) — util-linux mới thêm <code>lastlog2</code> (SQLite)</td></tr>
</table>
<p>Fedora 44 không cài rsyslog mặc định; <code>last</code> và <code>lastlog2</code> đến từ gói util-linux. Đây là hướng đi chung: các bản phân phối mới dần bỏ tệp văn bản, chỉ giữ journal.</p>

<h3>Bước 4 — bộ ba nhị phân: wtmp, btmp, lastlog</h3>
${lenh('s08/var-log', 5)}
<p><code>file</code> gọi chúng là "data": không <code>cat</code> hay <code>grep</code> được. Mỗi tệp là một bảng bản ghi kích thước cố định do các chương trình đăng nhập (sshd, login, systemd) ghi vào:</p>
<ul>
<li><strong>wtmp</strong> — mọi lần đăng nhập, đăng xuất, khởi động, tắt máy. Đọc bằng <code>last</code>.</li>
<li><strong>btmp</strong> — mọi lần đăng nhập <em>thất bại</em>. Đọc bằng <code>lastb</code> (chỉ root — xem góc hacker).</li>
<li><strong>lastlog</strong> — mỗi UID một ô: lần cuối từng người đăng nhập. Đọc bằng <code>lastlog</code>.</li>
</ul>
${lenh('s08/var-log', 6)}
${lenh('s08/var-log', 7)}
<p><code>last -x</code> thêm hai "người dùng giả" <code>shutdown</code> và <code>reboot</code>. Đối chiếu với Chương 7: một dòng <code>reboot</code> mà ngay trước nó <em>không có</em> dòng <code>shutdown</code> là sập hoặc mất điện — đúng như <code>--list-boots</code> đã cho thấy. Ở đây 04:41 có shutdown (lần khởi động lại sạch để vào nhân mới 6.8.0-149).</p>
${lenh('s08/var-log', 8)}
${lenh('s08/var-log', 9)}
${lenh('s08/var-log', 10)}
<p><code>utmpdump</code> in bản ghi thô. Nhìn giờ: <code>2026-11-23T21:52:42+00:00</code> — giờ UTC, trong khi <code>last</code> in 04:52 giờ máy (+07). Cùng một sự kiện, hai đồng hồ. Khi dán một dòng wtmp vào báo cáo sự cố, luôn ghi kèm múi giờ.</p>

<h3>Bước 5 — ai cài gì, và máy "ra đời" lúc nào</h3>
${lenh('s08/var-log', 11)}
${lenh('s08/var-log', 12)}
${lenh('s08/var-log', 13)}
<p><code>apt/history.log</code> có phần người ta hay quên: <code>Requested-By: hv (1000)</code> — <em>người dùng nào</em> đã chạy lệnh cài (qua sudo). Câu "ai cài cái gói lạ này lên máy chủ?" được trả lời ở đây. <code>cloud-init.log</code> cho biết máy ảo cloud được cấu hình lần đầu lúc nào — lại là giờ UTC (<code>+0000</code>).</p>

<h3>Góc hacker: wtmp chỉ là một tệp, còn btmp có thể chứa mật khẩu</h3>
<p>Vì wtmp/btmp/lastlog là tệp gồm các bản ghi cố định, kẻ đã có root có thể đổ chúng ra bằng <code>utmpdump</code>, xoá dòng của mình, rồi ghi ngược lại (<code>utmpdump -r</code>). Công cụ "dọn" các tệp này có từ thập niên 1990; MITRE ATT&amp;CK xếp nó vào <strong>T1070.002 — Clear Linux or Mac System Logs</strong>. Dấu hiệu: lịch sử <code>last</code> có khoảng trống không khớp với journal, thời điểm sửa tệp mới hơn bản ghi cuối, một lần đăng nhập có trong <code>auth.log</code> mà không có dòng <code>last</code> tương ứng. Phòng: gửi log sang máy khác (Bài 8.2) — tệp cục bộ không chứng minh được gì khi root đã mất.</p>
<p>Bẫy thứ hai: <code>lastb</code> lưu <em>tên người dùng</em> được gõ ở mỗi lần đăng nhập hỏng. Người dùng đôi khi gõ nhầm mật khẩu vào ô tên. Đó là một lý do btmp có quyền <code>-rw-rw---- root utmp</code> (bước 1) — và lý do đừng bao giờ dán nguyên output <code>lastb</code> vào một ticket mà nhiều người đọc.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, máy của khách hàng:</strong> khách cấp cho bạn một tài khoản trên VPS RHEL. Không có <code>/var/log/auth.log</code> — hãy xem <code>/var/log/secure</code>. Bị "Permission denied": xin vào đúng nhóm (<code>adm</code> trên Ubuntu, <code>wheel</code>/ACL trên RHEL, <code>systemd-journal</code> cho journal) thay vì xin sudo toàn quyền.</li>
<li><strong>"Cuối tuần có ai đăng nhập không?"</strong> — <code>last -F --since -3days</code> trên wtmp (last không hiểu "last friday" — báo invalid time value), rồi xác nhận lại bằng auth.log hoặc journal. Hai nguồn khớp nhau là bằng chứng; một nguồn chỉ là manh mối.</li>
<li><strong>"Ai cài nginx lên máy production?"</strong> — <code>grep -A3 nginx /var/log/apt/history.log*</code> → dòng <code>Requested-By</code>.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy ảo Linux của bạn: có <code>/var/log/auth.log</code> hay <code>/var/log/secure</code> không? Ai ghi nó (<code>systemctl status rsyslog</code>)?</li>
<li>Chạy <code>last -x -n 10</code>. Tìm một lần khởi động và nói nó là tắt sạch hay sập.</li>
<li>Chạy <code>sudo utmpdump /var/log/wtmp | tail -3</code> rồi đổi các mốc giờ sang múi giờ của bạn.</li>
<li>Tìm gói gần nhất bạn đã cài và người dùng nào yêu cầu cài.</li>
</ol>
<p><strong>Đạt khi:</strong> với bản phân phối của mình, bạn gọi tên được tệp (hoặc lệnh journal) cho đăng nhập, nhân và cài gói, và giải thích được một khác biệt giữa giờ của <code>last</code> và giờ của <code>utmpdump</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['/var/log/syslog · messages', 'Log văn bản chung của Debian/Ubuntu · của RHEL/Rocky. Chỉ có khi rsyslog (hoặc syslog-ng) chạy.'],
  ['auth.log · secure', 'Đăng nhập, sudo, su, sshd, PAM — Debian/Ubuntu · họ RHEL.'],
  ['wtmp / btmp / lastlog', 'Bản ghi đăng nhập nhị phân: mọi phiên + khởi động · đăng nhập hỏng · lần đăng nhập cuối của từng người.'],
  ['last · lastb · lastlog · utmpdump', 'Bộ đọc của ba tệp nhị phân; utmpdump in bản ghi thô (giờ UTC) và ghi ngược lại được.'],
  ['nhóm adm', 'Trên Debian/Ubuntu, thành viên đọc được phần lớn tệp trong /var/log mà không cần sudo.'],
  ['T1070.002', 'MITRE ATT&amp;CK: xoá log hệ thống Linux/Mac để giấu hoạt động.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểm ai đang ghi log trước khi đi tìm tệp: ảnh tối giản có thể chỉ có journald.</li>
<li>Tên kiểu Debian: syslog, auth.log, kern.log; kiểu Red Hat: messages, secure, cron, maillog.</li>
<li>wtmp/btmp/lastlog là nhị phân — đọc bằng last/lastb/lastlog; utmpdump hiện giờ UTC.</li>
<li><code>apt/history.log</code> cho biết người dùng nào đã cài một gói.</li>
<li>Root sửa được bản ghi đăng nhập cục bộ; hãy tin bản sao nằm trên máy khác.</li>
</ul>
${nguon('📘', 'last(1)', 'wtmp/btmp, -x, -F, --since', 'https://man7.org/linux/man-pages/man1/last.1.html')}
${nguon('📘', 'lastlog(8)', 'Lần đăng nhập cuối của từng người', 'https://man7.org/linux/man-pages/man8/lastlog.8.html')}
${nguon('🛡', 'MITRE ATT&CK T1070.002', 'Xoá log hệ thống Linux hoặc Mac', 'https://attack.mitre.org/techniques/T1070/002/')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux & Bash 10.3 — Log và journalctl', sub: 'Bản nhập môn về log Linux' })}
</div>
`,
};
