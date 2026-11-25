/**
 * 8.5 — logrotate (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s08/logrotate'] — lab7 (Ubuntu 24.04, logrotate 3.21.0, nginx 1.24.0). Ứng dụng giả _demo/s08/vm/ghi.py mở tệp
 * MỘT lần rồi ghi mãi (dòng đánh số), dem.py đếm dòng mất/trùng; bốn cấu hình shop-*.conf ở _demo/s08/vm/.
 * Nguồn: logrotate(8) (man7.org); NVD CVE-2016-1247 + advisory của Dawid Golunski (legalhackers.com, 15/11/2016).
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '8.5 — logrotate: rotate, compress, delaycompress, copytruncate vs create + postrotate, size, dateext|||8.5 — logrotate: rotate, compress, delaycompress, copytruncate vs create + postrotate, size, dateext',
  slug: 'log-8-5-logrotate',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao log không làm đầy đĩa: logrotate chạy bằng timer, đọc /etc/logrotate.d/ của rsyslog và nginx. Thí nghiệm thật với một ứng dụng giữ tệp mở: create mà quên báo ⇒ ứng dụng ghi tiếp vào app.log.1, tệp mới trống mãi; create + postrotate HUP ⇒ tách đúng, 0 dòng mất; copytruncate ⇒ mất đúng 2000 dòng. Bẫy: chạy logrotate trên một tệp lẻ không đọc mặc định chung; thư mục ghi được bởi nhóm bị từ chối (và CVE-2016-1247 của nginx); xoá tệp log đang mở thì đĩa không nhả chỗ. Cấu hình dùng thật: daily + maxsize + dateext + delaycompress + su.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>logrotate: keeping logs without filling the disk — and without losing lines</h2>
<p class="lead">Logs only grow. On a busy server an access log can reach gigabytes a day, and a full disk stops the database, the app and often SSH logins. <code>logrotate</code> renames the current file, starts a new one, compresses old ones and deletes the oldest. Simple — until an application keeps writing to the old file. This lesson measures that with a fake app that numbers every line.</p>

<h3>The everyday picture: notebooks in a shop</h3>
<p>The cashier writes every sale in a notebook. Every evening the manager takes the full notebook, labels it with the date, puts a fresh one on the counter, and throws away notebooks older than two weeks. If the cashier does not notice the swap and keeps writing in the old notebook, the new one stays blank — the manager must <em>tell</em> the cashier (postrotate). Photocopying the old notebook and erasing it while the cashier is still writing (copytruncate) loses the sales written between the copy and the erase.</p>

<h3>Step 1 — what the system already does</h3>
${lenh('s08/logrotate', 0)}
${lenh('s08/logrotate', 1)}
${lenh('s08/logrotate', 2)}
${lenh('s08/logrotate', 3)}
<p>A <strong>systemd timer</strong> runs logrotate once a day (older systems: <code>/etc/cron.daily/logrotate</code>), at low CPU and I/O priority. <code>logrotate.conf</code> sets defaults (weekly, keep 4, create a new file), and every package drops its own file in <code>/etc/logrotate.d/</code>:</p>
<ul>
<li><code>rotate 14</code> — keep 14 old files; the 15th is deleted. Retention = rotate × frequency (nginx: 14 days).</li>
<li><code>compress</code> + <code>delaycompress</code> — gzip old files, but not the most recent one (<code>.1</code>), because a program may still be finishing a write to it.</li>
<li><code>missingok</code>, <code>notifempty</code> — no error if missing, skip if empty.</li>
<li><code>create 0640 www-data adm</code> — new empty file with these owner and permissions.</li>
<li><code>postrotate … endscript</code> — tell the program to reopen its files: rsyslog via <code>rsyslog-rotate</code> (HUP), nginx via <code>invoke-rc.d nginx rotate</code> (USR1). <code>sharedscripts</code> = run it once for all matching files, not once per file.</li>
</ul>

<h3>Step 2 — a fake app that holds its file open</h3>
${ma('python', 's08/vm/ghi.py')}
<p>Like most real applications (and Java/Node loggers writing to a file), it opens the file <strong>once</strong> and keeps the file descriptor. Each line has a number, so <code>dem.py</code> can count missing and duplicate lines after the rotation.</p>
${lenh('s08/logrotate', 4)}
${lenh('s08/logrotate', 5)}
<p>Always try <code>-d</code> (debug: prints what it would do, changes nothing). Look at <code>1048576 bytes</code>: our file has no frequency, and when you run logrotate on <em>a single file</em>, the defaults of <code>/etc/logrotate.conf</code> (weekly…) are <strong>not read</strong>, so built-in defaults apply. Test single files, but judge the final behaviour with <code>logrotate -d /etc/logrotate.conf</code>.</p>

<h3>Step 3 — version A: create, but nobody tells the app</h3>
${lenh('s08/logrotate', 6)}
${lenh('s08/logrotate', 7)}
<p>The descriptor of the app points to <code>/var/log/shopapp/app.log.1</code>. A rename does not change the file the app holds — it is the same inode with a new name. Result after 8 seconds: the new <code>app.log</code> has <strong>0 bytes</strong>, all 15,660 lines went into <code>app.log.1</code>. Nothing lost yet, but anyone doing <code>tail -f app.log</code> sees silence, and at the next rotations the app's file moves to <code>.2</code>, <code>.3</code>, gets compressed — and finally deleted while still open.</p>

<h3>Step 4 — version B: create + postrotate (tell the app)</h3>
${lenh('s08/logrotate', 8)}
${lenh('s08/logrotate', 9)}
<p>The app reopens on SIGHUP: lines before the rotation in <code>app.log.1</code>, after it in <code>app.log</code>, <strong>15,680 written, 15,680 found, 0 lost, 0 duplicate</strong>. This is the right way whenever the program supports reopening (nginx, rsyslog, Apache, most daemons, logback/log4j2 have their own rolling instead).</p>

<h3>Step 5 — version C: copytruncate (the app is not told)</h3>
${ma('text', 's08/vm/shop-copy.conf')}
${lenh('s08/logrotate', 10)}
<p>logrotate copies the file to <code>.1</code>, then cuts the original to zero. Lines written <em>between</em> the copy and the cut are in neither file: <strong>2,000 lines lost</strong> (numbers 438,001–440,000) at about 140,000 lines per second. Use copytruncate only for programs that cannot reopen their file, and accept the small loss — or better, make the program log to stdout/journald.</p>

<h3>Step 6 — when logrotate refuses: insecure permissions</h3>
${lenh('s08/logrotate', 11)}
<p>The folder became group-writable (<code>0770</code>), and logrotate (running as root) refuses. This is not pedantry. In <strong>CVE-2016-1247</strong> (published November 2016, found by Dawid Golunski), Debian and Ubuntu nginx packages left <code>/var/log/nginx</code> writable by <code>www-data</code>. Someone with a web shell as www-data could replace the error log with a symlink; when root's daily rotation re-created the file, the attacker got a root-owned file at a path of their choice and escalated to root. The fix is the <code>su</code> directive: rotate as the folder's owner, not as root.</p>

<h3>Step 7 — a production-grade config</h3>
${lenh('s08/logrotate', 12)}
${lenh('s08/logrotate', 13)}
${lenh('s08/logrotate', 14)}
<ul>
<li><code>su hv adm</code> — rotate as the owner (the debug output shows "switching euid from 0 to 1000").</li>
<li><code>daily</code> + <code>maxsize 50M</code> — every day, <em>or earlier</em> if the file exceeds 50 MB at a run (useful with an hourly timer; <code>size</code> alone would ignore the time).</li>
<li><code>dateext</code> + <code>dateformat -%Y%m%d-%s</code> — names like <code>app.log-20261124-1795472807</code> instead of <code>.1 .2 .3</code>: old files never get renamed again (easier for backup and log shippers), and <code>-%s</code> (epoch) keeps several rotations on the same day apart.</li>
<li>Look at the listing: two <code>.gz</code> and one uncompressed — that is <code>delaycompress</code>.</li>
</ul>
${lenh('s08/logrotate', 15)}
${lenh('s08/logrotate', 16)}
<p>The <strong>state file</strong> remembers when each log was last rotated; that is how "daily" works with a timer that might run late. Deleting the state file or the timer being off for weeks explains many "log was never rotated" tickets.</p>

<h3>Step 8 — the classic incident: deleted, but the disk is still full</h3>
${lenh('s08/logrotate', 17)}
${lenh('s08/logrotate', 18)}
<p>Someone "freed space" with <code>rm app.log</code>. The disk usage kept growing (958 → 971 MB) because the app still writes into the deleted inode: <code>/proc/PID/fd/3 -&gt; … (deleted)</code>. <code>du</code> cannot see it, <code>df</code> can. Space returns only when the last descriptor closes — here after SIGHUP (938 MB). On a real server: <code>sudo find /proc/[0-9]*/fd -lname '*(deleted)'</code> (or <code>lsof +L1</code>), then reopen/restart that service. If you must empty a log right now, <code>: &gt; app.log</code> (truncate) instead of <code>rm</code>.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>Night alert "disk 95 %" on a client's server (outsourcing):</strong> <code>du -xh /var/log | sort -h | tail</code>; check whether rotation runs (<code>systemctl list-timers logrotate*</code>, the state file, <code>logrotate -d</code> for errors); look for deleted-but-open files. Never <code>rm -rf /var/log/*</code> — you delete the evidence and may not free a byte.</li>
<li><strong>Spring Boot app writing <code>/var/log/app/app.log</code>:</strong> do not stack logrotate on top of logback's own rolling policy (two rotators fighting). Pick one: logback <code>RollingFileAppender</code> (lesson 10.6) or stdout to journald.</li>
<li><strong>Retention question in a review:</strong> "how long do we keep nginx logs?" = <code>rotate</code> × frequency, plus whatever the central log system keeps (Chapter 16).</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Copy <code>ghi.py</code> and <code>dem.py</code> into your VM and reproduce versions A, B and C. Record written/found/lost for each.</li>
<li>Write a config for <code>/var/log/myapp/*.log</code>: daily, 30 copies, compress with delay, dateext, rotate as the owner, reopen via postrotate. Check with <code>logrotate -d /etc/logrotate.conf</code>.</li>
<li>Reproduce step 8 and find the deleted file with <code>find /proc</code>.</li>
</ol>
<p><strong>Done when:</strong> your numbers show 0 lost for B, a non-zero loss for C, and you can explain both with inodes and file descriptors.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['rotate N', 'Keep N old files; retention = N × frequency.'],
  ['create · postrotate', 'Rename + new empty file · command to make the program reopen (HUP/USR1).'],
  ['copytruncate', 'Copy then truncate in place; the program needs no signal but lines can be lost.'],
  ['compress · delaycompress', 'gzip old files · leave the newest old file (.1) uncompressed one cycle.'],
  ['maxsize · dateext', 'Rotate early above a size even before the period · date-stamped names.'],
  ['su user group', 'Rotate as that user — required when the folder is not root-only.'],
  ['state file', '/var/lib/logrotate/status — when each log was last rotated.'],
  ['deleted but open', 'File removed while a process holds it: df counts it, du does not.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>logrotate runs from a daily timer; packages bring their own rules in /etc/logrotate.d/.</li>
<li>A program holding its file keeps writing to the renamed file unless told to reopen.</li>
<li>create + postrotate: 0 lines lost; copytruncate: some lines lost (2,000 here).</li>
<li>Insecure folder permissions are refused for a reason (CVE-2016-1247); use <code>su</code>.</li>
<li><code>rm</code> on an open log frees nothing until the process closes it.</li>
</ul>
${nguon('📘', 'logrotate(8)', 'All directives: create, copytruncate, maxsize, dateext, su', 'https://man7.org/linux/man-pages/man8/logrotate.8.html')}
${nguon('🛡', 'NVD — CVE-2016-1247', 'nginx packages on Debian/Ubuntu: root via log symlink', 'https://nvd.nist.gov/vuln/detail/CVE-2016-1247')}
${nguon('🔎', 'Dawid Golunski (2016) — advisory', 'How the logrotate path was abused', 'https://legalhackers.com/advisories/Nginx-Exploit-Deb-Root-PrivEsc-CVE-2016-1247.html')}
${lienKet({ khoa: 'docker', bai: 'dk-11-3-log', title: 'Docker 11.3 — Container logs', sub: 'Rotating container logs (json-file max-size/max-file)' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-10-6-java-slf4j-cau-hinh', title: 'Lesson 10.6 — SLF4J, Logback, Log4j2', sub: 'Rolling files inside a Java app instead of logrotate' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>logrotate: giữ log mà không làm đầy đĩa — và không mất dòng</h2>
<p class="lead">Log chỉ có lớn lên. Trên máy chủ bận, access log có thể lên tới vài GB một ngày, và đĩa đầy thì CSDL dừng, ứng dụng dừng, thường cả SSH cũng không vào được. <code>logrotate</code> đổi tên tệp hiện tại, mở tệp mới, nén tệp cũ và xoá tệp cũ nhất. Đơn giản — cho tới khi ứng dụng cứ ghi tiếp vào tệp cũ. Bài này đo chuyện đó bằng một ứng dụng giả đánh số từng dòng.</p>

<h3>Liên tưởng đời thường: sổ bán hàng của cửa hàng</h3>
<p>Thu ngân ghi mọi đơn vào một cuốn sổ. Tối nào quản lý cũng lấy cuốn đã đầy, dán nhãn ngày, đặt cuốn mới lên quầy, và vứt các cuốn quá hai tuần. Nếu thu ngân không để ý việc đổi sổ mà cứ ghi tiếp vào cuốn cũ, cuốn mới sẽ trống trơn — quản lý phải <em>báo</em> cho thu ngân (postrotate). Còn photo cuốn cũ rồi tẩy trắng nó trong lúc thu ngân vẫn đang ghi (copytruncate) thì mất những đơn ghi giữa lúc photo và lúc tẩy.</p>

<h3>Bước 1 — hệ thống đang làm gì sẵn</h3>
${lenh('s08/logrotate', 0)}
${lenh('s08/logrotate', 1)}
${lenh('s08/logrotate', 2)}
${lenh('s08/logrotate', 3)}
<p>Một <strong>timer của systemd</strong> chạy logrotate mỗi ngày một lần (hệ cũ: <code>/etc/cron.daily/logrotate</code>), với ưu tiên CPU và I/O thấp. <code>logrotate.conf</code> đặt mặc định (hằng tuần, giữ 4 bản, tạo tệp mới), và mỗi gói thả một tệp của mình vào <code>/etc/logrotate.d/</code>:</p>
<ul>
<li><code>rotate 14</code> — giữ 14 tệp cũ; tệp thứ 15 bị xoá. Thời gian lưu giữ = rotate × chu kỳ (nginx: 14 ngày).</li>
<li><code>compress</code> + <code>delaycompress</code> — nén gzip tệp cũ, nhưng chừa tệp gần nhất (<code>.1</code>), vì chương trình có thể còn đang ghi dở vào nó.</li>
<li><code>missingok</code>, <code>notifempty</code> — thiếu tệp không báo lỗi, tệp rỗng thì bỏ qua.</li>
<li><code>create 0640 www-data adm</code> — tạo tệp rỗng mới với chủ sở hữu và quyền này.</li>
<li><code>postrotate … endscript</code> — bảo chương trình mở lại tệp: rsyslog qua <code>rsyslog-rotate</code> (HUP), nginx qua <code>invoke-rc.d nginx rotate</code> (USR1). <code>sharedscripts</code> = chạy một lần cho mọi tệp khớp, không phải mỗi tệp một lần.</li>
</ul>

<h3>Bước 2 — một ứng dụng giả giữ tệp mở</h3>
${ma('python', 's08/vm/ghi.py')}
<p>Giống đa số ứng dụng thật (và các thư viện log của Java/Node khi ghi ra tệp), nó mở tệp <strong>một lần</strong> rồi giữ mã mô tả tệp (file descriptor). Mỗi dòng có số thứ tự, nên sau khi xoay <code>dem.py</code> đếm được dòng mất và dòng trùng.</p>
${lenh('s08/logrotate', 4)}
${lenh('s08/logrotate', 5)}
<p>Luôn thử <code>-d</code> trước (debug: in ra việc sẽ làm, không đổi gì). Nhìn <code>1048576 bytes</code>: tệp của ta không đặt chu kỳ, và khi chạy logrotate trên <em>một tệp lẻ</em>, các mặc định trong <code>/etc/logrotate.conf</code> (weekly…) <strong>không được đọc</strong>, nên mặc định cài sẵn được dùng. Thử từng tệp thì được, nhưng đánh giá hành vi cuối cùng bằng <code>logrotate -d /etc/logrotate.conf</code>.</p>

<h3>Bước 3 — bản A: create, nhưng không ai báo ứng dụng</h3>
${lenh('s08/logrotate', 6)}
${lenh('s08/logrotate', 7)}
<p>Mã mô tả tệp của ứng dụng trỏ tới <code>/var/log/shopapp/app.log.1</code>. Đổi tên không đổi tệp mà ứng dụng đang giữ — vẫn cùng inode, chỉ mang tên mới. Kết quả sau 8 giây: <code>app.log</code> mới có <strong>0 byte</strong>, cả 15.660 dòng vào <code>app.log.1</code>. Chưa mất gì, nhưng ai <code>tail -f app.log</code> sẽ chỉ thấy im lặng, và ở những lần xoay sau tệp của ứng dụng bị đẩy sang <code>.2</code>, <code>.3</code>, bị nén — rồi bị xoá trong khi vẫn đang mở.</p>

<h3>Bước 4 — bản B: create + postrotate (báo cho ứng dụng)</h3>
${lenh('s08/logrotate', 8)}
${lenh('s08/logrotate', 9)}
<p>Ứng dụng mở lại tệp khi nhận SIGHUP: dòng trước lúc xoay nằm ở <code>app.log.1</code>, sau đó ở <code>app.log</code>, <strong>ghi 15.680, thấy 15.680, mất 0, trùng 0</strong>. Đây là cách đúng mỗi khi chương trình hỗ trợ mở lại tệp (nginx, rsyslog, Apache, phần lớn dịch vụ nền; logback/log4j2 thì có cơ chế cuộn tệp riêng).</p>

<h3>Bước 5 — bản C: copytruncate (không báo ứng dụng)</h3>
${ma('text', 's08/vm/shop-copy.conf')}
${lenh('s08/logrotate', 10)}
<p>logrotate chép tệp sang <code>.1</code>, rồi cắt tệp gốc về 0. Dòng ghi <em>giữa</em> lúc chép và lúc cắt không nằm ở tệp nào: <strong>mất 2.000 dòng</strong> (số 438.001–440.000) ở tốc độ khoảng 140.000 dòng mỗi giây. Chỉ dùng copytruncate cho chương trình không mở lại được tệp, và chấp nhận mất chút ít — tốt hơn là cho chương trình ghi ra stdout/journald.</p>

<h3>Bước 6 — khi logrotate từ chối: quyền không an toàn</h3>
${lenh('s08/logrotate', 11)}
<p>Thư mục thành ghi được bởi nhóm (<code>0770</code>), và logrotate (chạy bằng root) từ chối. Đây không phải khó tính vô cớ. Trong <strong>CVE-2016-1247</strong> (công bố tháng 11/2016, do Dawid Golunski tìm ra), gói nginx của Debian và Ubuntu để <code>/var/log/nginx</code> ghi được bởi <code>www-data</code>. Ai có web shell dưới quyền www-data có thể thay error log bằng một liên kết tượng trưng (symlink); khi lần xoay hằng ngày của root tạo lại tệp, kẻ tấn công có được một tệp của root ở đường dẫn tuỳ chọn và leo lên root. Cách sửa là chỉ thị <code>su</code>: xoay bằng chủ của thư mục, không bằng root.</p>

<h3>Bước 7 — một cấu hình dùng thật</h3>
${lenh('s08/logrotate', 12)}
${lenh('s08/logrotate', 13)}
${lenh('s08/logrotate', 14)}
<ul>
<li><code>su hv adm</code> — xoay bằng chủ sở hữu (output debug hiện "switching euid from 0 to 1000").</li>
<li><code>daily</code> + <code>maxsize 50M</code> — mỗi ngày, <em>hoặc sớm hơn</em> nếu tệp vượt 50 MB lúc chạy (hữu ích khi timer chạy hằng giờ; chỉ dùng <code>size</code> thì bỏ qua thời gian).</li>
<li><code>dateext</code> + <code>dateformat -%Y%m%d-%s</code> — tên kiểu <code>app.log-20261124-1795472807</code> thay vì <code>.1 .2 .3</code>: tệp cũ không bao giờ bị đổi tên lại (dễ cho sao lưu và bộ gom log), còn <code>-%s</code> (epoch) giữ được nhiều lần xoay trong cùng một ngày.</li>
<li>Nhìn danh sách tệp: hai tệp <code>.gz</code> và một tệp chưa nén — đó là <code>delaycompress</code>.</li>
</ul>
${lenh('s08/logrotate', 15)}
${lenh('s08/logrotate', 16)}
<p><strong>Tệp trạng thái</strong> nhớ mỗi log được xoay lần cuối lúc nào; nhờ nó "daily" vẫn đúng dù timer chạy trễ. Tệp trạng thái bị xoá, hoặc timer tắt cả mấy tuần, là lời giải của rất nhiều ticket "log không bao giờ được xoay".</p>

<h3>Bước 8 — sự cố kinh điển: đã xoá mà đĩa vẫn đầy</h3>
${lenh('s08/logrotate', 17)}
${lenh('s08/logrotate', 18)}
<p>Ai đó "giải phóng chỗ" bằng <code>rm app.log</code>. Dung lượng dùng vẫn tăng (958 → 971 MB) vì ứng dụng vẫn ghi vào inode đã xoá: <code>/proc/PID/fd/3 -&gt; … (deleted)</code>. <code>du</code> không thấy, <code>df</code> thì thấy. Chỗ trống chỉ trở lại khi mã mô tả cuối cùng đóng — ở đây là sau SIGHUP (938 MB). Trên máy chủ thật: <code>sudo find /proc/[0-9]*/fd -lname '*(deleted)'</code> (hoặc <code>lsof +L1</code>), rồi bảo dịch vụ đó mở lại tệp hoặc khởi động lại. Nếu buộc phải làm rỗng log ngay, dùng <code>: &gt; app.log</code> (cắt về 0) thay vì <code>rm</code>.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Cảnh báo đêm "đĩa 95 %" trên máy của khách (outsourcing):</strong> <code>du -xh /var/log | sort -h | tail</code>; kiểm việc xoay có chạy không (<code>systemctl list-timers logrotate*</code>, tệp trạng thái, <code>logrotate -d</code> xem lỗi); tìm tệp đã xoá mà còn mở. Đừng bao giờ <code>rm -rf /var/log/*</code> — bạn xoá mất bằng chứng và có khi chẳng nhả được byte nào.</li>
<li><strong>Ứng dụng Spring Boot ghi <code>/var/log/app/app.log</code>:</strong> đừng chồng logrotate lên chính sách cuộn tệp của logback (hai bộ xoay giành nhau). Chọn một: <code>RollingFileAppender</code> của logback (Bài 10.6) hoặc ghi stdout vào journald.</li>
<li><strong>Câu hỏi lưu giữ khi rà soát:</strong> "log nginx giữ bao lâu?" = <code>rotate</code> × chu kỳ, cộng thời gian hệ thống log trung tâm giữ (Chương 16).</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Chép <code>ghi.py</code> và <code>dem.py</code> vào máy ảo của bạn và tái hiện bản A, B, C. Ghi lại số dòng ghi/thấy/mất của từng bản.</li>
<li>Viết cấu hình cho <code>/var/log/myapp/*.log</code>: hằng ngày, 30 bản, nén trễ, dateext, xoay bằng chủ sở hữu, mở lại qua postrotate. Kiểm bằng <code>logrotate -d /etc/logrotate.conf</code>.</li>
<li>Tái hiện bước 8 và tìm tệp đã xoá bằng <code>find /proc</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> số đo của bạn cho B mất 0, C mất khác 0, và bạn giải thích được cả hai bằng inode và mã mô tả tệp.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['rotate N', 'Giữ N tệp cũ; thời gian lưu giữ = N × chu kỳ.'],
  ['create · postrotate', 'Đổi tên + tạo tệp rỗng mới · lệnh bảo chương trình mở lại tệp (HUP/USR1).'],
  ['copytruncate', 'Chép rồi cắt tại chỗ; chương trình không cần tín hiệu nhưng có thể mất dòng.'],
  ['compress · delaycompress', 'Nén gzip tệp cũ · để tệp cũ mới nhất (.1) chưa nén thêm một vòng.'],
  ['maxsize · dateext', 'Xoay sớm khi vượt cỡ dù chưa tới chu kỳ · tên tệp gắn ngày.'],
  ['su user group', 'Xoay bằng người dùng đó — bắt buộc khi thư mục không chỉ root ghi được.'],
  ['tệp trạng thái', '/var/lib/logrotate/status — mỗi log được xoay lần cuối lúc nào.'],
  ['đã xoá mà còn mở', 'Tệp bị xoá khi tiến trình còn giữ: df tính, du không tính.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>logrotate chạy bằng timer hằng ngày; các gói mang luật riêng vào /etc/logrotate.d/.</li>
<li>Chương trình giữ tệp mở sẽ ghi tiếp vào tệp đã đổi tên nếu không được báo mở lại.</li>
<li>create + postrotate: mất 0 dòng; copytruncate: mất một ít (ở đây 2.000 dòng).</li>
<li>Quyền thư mục không an toàn bị từ chối là có lý do (CVE-2016-1247); dùng <code>su</code>.</li>
<li><code>rm</code> một log đang mở không nhả chỗ cho tới khi tiến trình đóng nó.</li>
</ul>
${nguon('📘', 'logrotate(8)', 'Mọi chỉ thị: create, copytruncate, maxsize, dateext, su', 'https://man7.org/linux/man-pages/man8/logrotate.8.html')}
${nguon('🛡', 'NVD — CVE-2016-1247', 'Gói nginx trên Debian/Ubuntu: lên root qua symlink của log', 'https://nvd.nist.gov/vuln/detail/CVE-2016-1247')}
${nguon('🔎', 'Dawid Golunski (2016) — advisory', 'Đường xoay log bị lợi dụng thế nào', 'https://legalhackers.com/advisories/Nginx-Exploit-Deb-Root-PrivEsc-CVE-2016-1247.html')}
${lienKet({ khoa: 'docker', bai: 'dk-11-3-log', title: 'Docker 11.3 — Log của container', sub: 'Xoay log container (json-file max-size/max-file)' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-10-6-java-slf4j-cau-hinh', title: 'Bài 10.6 — SLF4J, Logback, Log4j2', sub: 'Cuộn tệp ngay trong ứng dụng Java thay vì logrotate' })}
</div>
`,
};
