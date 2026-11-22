/**
 * 1.6 — Bản đồ log nằm ở đâu (soạn 22/11/2026). Không có output mới: đây là trang tra cứu, mỗi hàng trỏ tới chương dạy sâu.
 * Thời hạn/dung lượng mặc định ghi dạng "thường gặp" + lệnh tự kiểm trên máy, vì phụ thuộc bản phân phối/phiên bản.
 * Nguồn: man journald.conf (SystemMaxUse mặc định 10% hệ tệp, trần 4G; lưu bền khi có /var/log/journal), Docker docs
 * (json-file mặc định không xoay vòng), Microsoft Learn (Event Log), Apple (log/Console), kubernetes.io Logging Architecture.
 */
import { nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '1.6 — A map of where logs live: Windows, macOS, Linux, browser, network gear, databases, containers, cloud|||1.6 — Bản đồ log nằm ở đâu: Windows, macOS, Linux, trình duyệt, thiết bị mạng, CSDL, container, cloud',
  slug: 'log-1-6-ban-do-nguon',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một trang bản đồ cho mọi nguồn log của khoá: đường dẫn, công cụ mở, quyền cần có, log tự xoay/tự xoá sau bao lâu theo mặc định (và lệnh tự kiểm trên máy bạn), câu hỏi nào mở nguồn nào trước, chương nào dạy sâu; bẫy "log đã bị ghi đè trước khi bạn tới".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.6</span>
<h2>A map of where logs live — keep this page open</h2>
<p class="lead">You now know how to read a line. The next question in every real situation is "where is the line?". This lesson is a reference page: for each source in the course, where its logs are, what opens them, what permission you need, how long they survive by default — and which chapter teaches it in depth. Bookmark it; you will come back.</p>

<h3>The everyday picture: a library catalogue</h3>
<p>A library does not make you search every shelf. The catalogue says "networking — floor 3, shelf C". This table is your catalogue. Reading skills from Lessons 1.2–1.5 work on every shelf.</p>

<h3>Operating systems</h3>
<table>
<thead><tr><th>Source</th><th>Where</th><th>Open with</th><th>Permission</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Windows event logs</td><td><code>C:\\Windows\\System32\\winevt\\Logs\\*.evtx</code> (System, Application, Security, plus "Applications and Services Logs")</td><td>Event Viewer (<code>eventvwr.msc</code>), <code>Get-WinEvent</code>, <code>wevtutil</code></td><td>Any user for most logs; <strong>administrator</strong> for Security</td><td>3, 4, 5</td></tr>
<tr><td>Windows reliability history</td><td>Built from event logs</td><td>Reliability Monitor (<code>perfmon /rel</code>)</td><td>Any user</td><td>3.6</td></tr>
<tr><td>Windows text logs</td><td>Firewall <code>pfirewall.log</code>, IIS <code>u_ex*.log</code>, Windows Update, setup logs</td><td>Notepad for small files, PowerShell <code>Get-Content</code></td><td>Usually administrator</td><td>2.5, 3.7, 11.3</td></tr>
<tr><td>macOS unified log</td><td>Binary store under <code>/var/db/diagnostics</code></td><td>Console app, <code>log show</code>, <code>log stream</code></td><td>Admin for some private data</td><td>6</td></tr>
<tr><td>Linux journal</td><td><code>/var/log/journal/</code> (persistent) or <code>/run/log/journal/</code> (lost at reboot)</td><td><code>journalctl</code></td><td>Root, or groups <code>adm</code> / <code>systemd-journal</code></td><td>7</td></tr>
<tr><td>Linux kernel ring buffer</td><td>Memory</td><td><code>dmesg</code>, <code>journalctl -k</code></td><td>Often root</td><td>7.5</td></tr>
<tr><td>Linux text logs</td><td><code>/var/log/syslog</code> or <code>messages</code>, <code>auth.log</code> or <code>secure</code>, <code>wtmp</code>/<code>btmp</code></td><td><code>less</code>, <code>grep</code>, <code>last</code>, <code>lastb</code></td><td>Root or group <code>adm</code></td><td>8</td></tr>
<tr><td>Linux audit</td><td><code>/var/log/audit/audit.log</code></td><td><code>ausearch</code>, <code>aureport</code></td><td>Root</td><td>8.4</td></tr>
</tbody></table>

<h3>Browser, web and applications</h3>
<table>
<thead><tr><th>Source</th><th>Where</th><th>Open with</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Browser</td><td>In memory per tab — gone when you close it unless saved</td><td>DevTools Console/Network, HAR export, <code>chrome://net-export</code></td><td>9</td></tr>
<tr><td>nginx</td><td><code>/var/log/nginx/access.log</code>, <code>error.log</code> (paths set in the config)</td><td><code>tail -F</code>, <code>awk</code>, GoAccess</td><td>10.2</td></tr>
<tr><td>Apache / IIS</td><td><code>/var/log/apache2/</code> or <code>/var/log/httpd/</code>; <code>C:\\inetpub\\logs\\LogFiles\\</code></td><td>Same tools; PowerShell for IIS</td><td>10.3</td></tr>
<tr><td>Your app (Node, Spring)</td><td>stdout (captured by systemd/Docker), or a file you configured</td><td><code>journalctl -u</code>, <code>docker logs</code>, <code>jq</code></td><td>10.4–10.8</td></tr>
<tr><td>PostgreSQL / MySQL / SQL Server</td><td>Data directory <code>log/</code>, <code>/var/log/postgresql/</code>; MySQL error and slow logs; SQL Server ERRORLOG</td><td>Text tools, pgBadger, SSMS</td><td>12</td></tr>
</tbody></table>

<h3>Network, containers and cloud</h3>
<table>
<thead><tr><th>Source</th><th>Where</th><th>Open with</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Home router / Wi-Fi</td><td>The router's web page (System Log), sometimes sent by syslog to another machine</td><td>Browser; rsyslog receiver</td><td>11.1</td></tr>
<tr><td>Firewall</td><td>Windows <code>pfirewall.log</code>; Linux kernel messages from <code>ufw</code>/nftables rules</td><td>PowerShell; <code>journalctl -k</code>, <code>grep UFW</code></td><td>11.3–11.4</td></tr>
<tr><td>DNS</td><td>Pi-hole/AdGuard query log; Windows DNS Client operational log</td><td>Web UI; Event Viewer</td><td>11.2</td></tr>
<tr><td>Docker</td><td>Per container, through the logging driver (default <code>json-file</code>)</td><td><code>docker logs</code>, <code>docker events</code></td><td>13.1</td></tr>
<tr><td>Kubernetes</td><td>On each node, per container; gone when the pod is deleted</td><td><code>kubectl logs</code>, <code>--previous</code></td><td>13.2</td></tr>
<tr><td>CDN / proxy</td><td>The provider's dashboard and log export</td><td>Web UI, API</td><td>13.3</td></tr>
<tr><td>Cloud (AWS, Azure, GCP)</td><td>CloudWatch Logs + CloudTrail; Azure Monitor; Cloud Logging</td><td>Web console, CLI, query languages</td><td>13.4</td></tr>
</tbody></table>

<h3>How long logs survive by default — and how to check yours</h3>
<p>Logs are not kept forever. Each source deletes or overwrites old data by size or age, and defaults differ between versions — so the right habit is to <em>check on the machine</em> rather than memorise numbers:</p>
<table>
<thead><tr><th>Source</th><th>Common default</th><th>Check on your machine</th></tr></thead>
<tbody>
<tr><td>Windows event logs</td><td>A maximum size per log, oldest events overwritten when full — a busy Security log may cover only days</td><td>Event Viewer → right-click a log → Properties; <code>wevtutil gl Security</code></td></tr>
<tr><td>systemd journal</td><td>Up to 10% of the file system (capped at 4 GB) when persistent; volatile (lost at reboot) if <code>/var/log/journal</code> does not exist</td><td><code>journalctl --disk-usage</code>, <code>journalctl --list-boots</code></td></tr>
<tr><td>Text files in <code>/var/log</code></td><td>Rotated by logrotate — often weekly, a few generations kept</td><td><code>cat /etc/logrotate.d/rsyslog</code>, <code>ls -l /var/log/*.gz</code></td></tr>
<tr><td>Docker <code>json-file</code></td><td><strong>No rotation</strong> unless you set <code>max-size</code> — the opposite problem: disks fill up</td><td><code>docker info --format '{{.LoggingDriver}}'</code>; daemon/compose options</td></tr>
<tr><td>Browser DevTools</td><td>Until the tab closes or navigates (unless "Preserve log")</td><td>The checkbox in Console/Network</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><p><strong>"The log for that day is gone."</strong> A user reports a problem from last month; the Security log covers four days; the journal was volatile and the server rebooted. The investigation ends before it starts. Two lessons: check retention <em>before</em> you need it (Chapter 16), and when something happens, <strong>copy the logs first</strong> (export the EVTX, <code>journalctl -o export</code>), investigate second.</p></div>

<h3>Which source first? A starting guide</h3>
<ul>
<li><strong>Something on one machine</strong> (crash, restart, slow) → that machine's system log, then the app's log.</li>
<li><strong>Something for users of a website</strong> → access log (what did they request, what did they get), then error log, then app log.</li>
<li><strong>Something about identity</strong> (logins, new accounts, permission changes) → security/audit logs: Windows Security, <code>auth.log</code>, the app's audit table.</li>
<li><strong>Something between machines</strong> (cannot connect, timeouts) → both ends' logs, then firewall/DNS.</li>
<li><strong>Something in a container</strong> → <code>docker logs</code> / <code>kubectl logs --previous</code>, then the host's journal (OOM kills are recorded by the host kernel).</li>
</ul>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok"><ol>
<li>Copy the three tables into your notebook as a one-page map, keeping only the rows for systems you actually use.</li>
<li>Check retention on your own machine: Windows — <code>wevtutil gl System</code> and note <code>maxSize</code>; Linux/WSL — <code>journalctl --disk-usage</code> and <code>journalctl --list-boots | head -n 3</code>.</li>
<li>Write the date of the oldest log entry your machine still has for that source.</li>
</ol>
<p><strong>Done when:</strong> your map exists, and you can say "my System log goes back to …" or "my journal goes back to … (N boots)" with a real date.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['retention', 'How long logs are kept before deletion or overwrite.'],
  ['rotation', 'Starting a new log file and compressing or deleting old ones.'],
  ['volatile journal', 'A journal kept only in memory (/run), lost at reboot.'],
  ['logging driver', 'How Docker stores a container’s output (json-file, journald…).'],
  ['ring buffer', 'Fixed-size memory where the kernel keeps its latest messages.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Every source has a place, a tool and a permission; Security logs and <code>/var/log</code> usually need admin or group <code>adm</code>.</li>
<li>Browser logs live in the tab; container logs die with the container unless shipped elsewhere.</li>
<li>Retention is limited by size or age, and defaults vary — check with <code>wevtutil gl</code>, <code>journalctl --disk-usage</code>, logrotate configs.</li>
<li>Docker's default <code>json-file</code> does not rotate: the risk is a full disk, not lost logs.</li>
<li>When an incident happens, copy the logs first, investigate second.</li>
</ul>
${nguon('📘', 'man journald.conf — storage and SystemMaxUse', 'Persistent vs volatile journal and the default size limits', 'https://man7.org/linux/man-pages/man5/journald.conf.5.html')}
${nguon('📘', 'Docker docs — JSON File logging driver', 'Default driver; max-size and max-file are off unless set', 'https://docs.docker.com/engine/logging/drivers/json-file/')}
${nguon('📘', 'Kubernetes — Logging Architecture', 'Where container logs live on a node and when they are lost', 'https://kubernetes.io/docs/concepts/cluster-administration/logging/')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux &amp; Bash 10.3 — logs and journalctl', sub: 'First steps with /var/log and the journal', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.6</span>
<h2>Bản đồ log nằm ở đâu — hãy giữ trang này luôn mở</h2>
<p class="lead">Bạn đã biết đọc một dòng. Câu hỏi tiếp theo trong mọi tình huống thật là "dòng đó nằm ở đâu?". Bài này là một trang tra cứu: với mỗi nguồn trong khoá, log nằm ở đâu, mở bằng gì, cần quyền gì, mặc định sống được bao lâu — và chương nào dạy sâu. Hãy đánh dấu lại; bạn sẽ còn quay về.</p>

<h3>Liên tưởng đời thường: mục lục thư viện</h3>
<p>Thư viện không bắt bạn lục từng kệ. Mục lục ghi "mạng máy tính — tầng 3, kệ C". Các bảng dưới đây là mục lục của bạn. Kỹ năng đọc ở bài 1.2–1.5 dùng được ở mọi kệ.</p>

<h3>Hệ điều hành</h3>
<table>
<thead><tr><th>Nguồn</th><th>Ở đâu</th><th>Mở bằng</th><th>Quyền</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>Nhật ký sự kiện Windows</td><td><code>C:\\Windows\\System32\\winevt\\Logs\\*.evtx</code> (System, Application, Security, cùng "Applications and Services Logs")</td><td>Event Viewer (<code>eventvwr.msc</code>), <code>Get-WinEvent</code>, <code>wevtutil</code></td><td>Người dùng thường đọc được đa số; Security cần <strong>quản trị</strong></td><td>3, 4, 5</td></tr>
<tr><td>Lịch sử độ tin cậy Windows</td><td>Dựng từ nhật ký sự kiện</td><td>Reliability Monitor (<code>perfmon /rel</code>)</td><td>Người dùng thường</td><td>3.6</td></tr>
<tr><td>Log văn bản của Windows</td><td>Tường lửa <code>pfirewall.log</code>, IIS <code>u_ex*.log</code>, Windows Update, log cài đặt</td><td>Notepad cho tệp nhỏ, PowerShell <code>Get-Content</code></td><td>Thường cần quản trị</td><td>2.5, 3.7, 11.3</td></tr>
<tr><td>Unified log của macOS</td><td>Kho nhị phân dưới <code>/var/db/diagnostics</code></td><td>Ứng dụng Console, <code>log show</code>, <code>log stream</code></td><td>Admin để xem một số dữ liệu riêng tư</td><td>6</td></tr>
<tr><td>Journal của Linux</td><td><code>/var/log/journal/</code> (lưu bền) hoặc <code>/run/log/journal/</code> (mất khi khởi động lại)</td><td><code>journalctl</code></td><td>Root, hoặc nhóm <code>adm</code> / <code>systemd-journal</code></td><td>7</td></tr>
<tr><td>Bộ đệm vòng của nhân Linux</td><td>Bộ nhớ</td><td><code>dmesg</code>, <code>journalctl -k</code></td><td>Thường cần root</td><td>7.5</td></tr>
<tr><td>Log văn bản của Linux</td><td><code>/var/log/syslog</code> hoặc <code>messages</code>, <code>auth.log</code> hoặc <code>secure</code>, <code>wtmp</code>/<code>btmp</code></td><td><code>less</code>, <code>grep</code>, <code>last</code>, <code>lastb</code></td><td>Root hoặc nhóm <code>adm</code></td><td>8</td></tr>
<tr><td>Kiểm toán Linux (audit)</td><td><code>/var/log/audit/audit.log</code></td><td><code>ausearch</code>, <code>aureport</code></td><td>Root</td><td>8.4</td></tr>
</tbody></table>

<h3>Trình duyệt, web và ứng dụng</h3>
<table>
<thead><tr><th>Nguồn</th><th>Ở đâu</th><th>Mở bằng</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>Trình duyệt</td><td>Trong bộ nhớ từng tab — đóng tab là mất nếu chưa lưu</td><td>DevTools Console/Network, xuất HAR, <code>chrome://net-export</code></td><td>9</td></tr>
<tr><td>nginx</td><td><code>/var/log/nginx/access.log</code>, <code>error.log</code> (đường dẫn đặt trong cấu hình)</td><td><code>tail -F</code>, <code>awk</code>, GoAccess</td><td>10.2</td></tr>
<tr><td>Apache / IIS</td><td><code>/var/log/apache2/</code> hoặc <code>/var/log/httpd/</code>; <code>C:\\inetpub\\logs\\LogFiles\\</code></td><td>Cùng công cụ; PowerShell cho IIS</td><td>10.3</td></tr>
<tr><td>App của bạn (Node, Spring)</td><td>stdout (systemd/Docker bắt lại), hoặc tệp bạn cấu hình</td><td><code>journalctl -u</code>, <code>docker logs</code>, <code>jq</code></td><td>10.4–10.8</td></tr>
<tr><td>PostgreSQL / MySQL / SQL Server</td><td>Thư mục <code>log/</code> trong thư mục dữ liệu, <code>/var/log/postgresql/</code>; error log và slow log của MySQL; ERRORLOG của SQL Server</td><td>Công cụ chữ, pgBadger, SSMS</td><td>12</td></tr>
</tbody></table>

<h3>Mạng, container và cloud</h3>
<table>
<thead><tr><th>Nguồn</th><th>Ở đâu</th><th>Mở bằng</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>Router / Wi-Fi gia đình</td><td>Trang quản trị của router (System Log), đôi khi gửi qua syslog sang máy khác</td><td>Trình duyệt; máy nhận rsyslog</td><td>11.1</td></tr>
<tr><td>Tường lửa</td><td><code>pfirewall.log</code> của Windows; thông điệp nhân từ luật <code>ufw</code>/nftables trên Linux</td><td>PowerShell; <code>journalctl -k</code>, <code>grep UFW</code></td><td>11.3–11.4</td></tr>
<tr><td>DNS</td><td>Nhật ký truy vấn Pi-hole/AdGuard; nhật ký vận hành DNS Client của Windows</td><td>Giao diện web; Event Viewer</td><td>11.2</td></tr>
<tr><td>Docker</td><td>Theo từng container, qua logging driver (mặc định <code>json-file</code>)</td><td><code>docker logs</code>, <code>docker events</code></td><td>13.1</td></tr>
<tr><td>Kubernetes</td><td>Trên từng node, theo container; mất khi pod bị xoá</td><td><code>kubectl logs</code>, <code>--previous</code></td><td>13.2</td></tr>
<tr><td>CDN / proxy</td><td>Bảng điều khiển và chức năng xuất log của nhà cung cấp</td><td>Giao diện web, API</td><td>13.3</td></tr>
<tr><td>Cloud (AWS, Azure, GCP)</td><td>CloudWatch Logs + CloudTrail; Azure Monitor; Cloud Logging</td><td>Console web, CLI, ngôn ngữ truy vấn</td><td>13.4</td></tr>
</tbody></table>

<h3>Log mặc định sống được bao lâu — và kiểm trên máy bạn</h3>
<p>Log không được giữ mãi. Nguồn nào cũng xoá hoặc ghi đè dữ liệu cũ theo dung lượng hay theo tuổi, và mặc định khác nhau giữa các phiên bản — nên thói quen đúng là <em>kiểm trên máy</em> chứ đừng học thuộc con số:</p>
<table>
<thead><tr><th>Nguồn</th><th>Mặc định thường gặp</th><th>Kiểm trên máy bạn</th></tr></thead>
<tbody>
<tr><td>Nhật ký sự kiện Windows</td><td>Mỗi nhật ký có dung lượng tối đa, đầy thì sự kiện cũ nhất bị ghi đè — nhật ký Security của máy bận có khi chỉ phủ vài ngày</td><td>Event Viewer → chuột phải một nhật ký → Properties; <code>wevtutil gl Security</code></td></tr>
<tr><td>Journal của systemd</td><td>Tối đa 10% hệ tệp (trần 4 GB) khi lưu bền; chỉ trong bộ nhớ (mất khi khởi động lại) nếu không có <code>/var/log/journal</code></td><td><code>journalctl --disk-usage</code>, <code>journalctl --list-boots</code></td></tr>
<tr><td>Tệp chữ trong <code>/var/log</code></td><td>Do logrotate xoay vòng — thường mỗi tuần, giữ vài bản</td><td><code>cat /etc/logrotate.d/rsyslog</code>, <code>ls -l /var/log/*.gz</code></td></tr>
<tr><td>Docker <code>json-file</code></td><td><strong>Không xoay vòng</strong> trừ khi đặt <code>max-size</code> — vấn đề ngược lại: đầy đĩa</td><td><code>docker info --format '{{.LoggingDriver}}'</code>; tuỳ chọn của daemon/compose</td></tr>
<tr><td>DevTools trình duyệt</td><td>Tới khi đóng tab hay chuyển trang (trừ khi bật "Preserve log")</td><td>Ô đánh dấu trong Console/Network</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><p><strong>"Log của hôm đó mất rồi."</strong> Người dùng báo một sự cố từ tháng trước; nhật ký Security chỉ phủ bốn ngày; journal không lưu bền và server đã khởi động lại. Cuộc điều tra kết thúc trước khi bắt đầu. Hai bài học: kiểm thời gian lưu <em>trước khi</em> cần tới (Chương 16), và khi có chuyện, <strong>sao chép log trước</strong> (xuất EVTX, <code>journalctl -o export</code>), điều tra sau.</p></div>

<h3>Nguồn nào trước? Hướng dẫn khởi đầu</h3>
<ul>
<li><strong>Chuyện trên một máy</strong> (sập, khởi động lại, chậm) → log hệ thống của máy đó, rồi log của app.</li>
<li><strong>Chuyện với người dùng một website</strong> → access log (họ yêu cầu gì, nhận được gì), rồi error log, rồi log app.</li>
<li><strong>Chuyện về danh tính</strong> (đăng nhập, tài khoản mới, đổi quyền) → log bảo mật/kiểm toán: Security của Windows, <code>auth.log</code>, bảng kiểm toán của app.</li>
<li><strong>Chuyện giữa các máy</strong> (không kết nối được, hết thời gian chờ) → log của cả hai đầu, rồi tường lửa/DNS.</li>
<li><strong>Chuyện trong container</strong> → <code>docker logs</code> / <code>kubectl logs --previous</code>, rồi journal của máy chủ (vụ giết OOM do nhân của máy chủ ghi lại).</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Chép ba bảng vào sổ thành một bản đồ một trang, chỉ giữ những hàng cho hệ thống bạn thực sự dùng.</li>
<li>Kiểm thời gian lưu trên máy bạn: Windows — <code>wevtutil gl System</code> và ghi lại <code>maxSize</code>; Linux/WSL — <code>journalctl --disk-usage</code> và <code>journalctl --list-boots | head -n 3</code>.</li>
<li>Ghi ngày của bản ghi cũ nhất mà máy bạn còn giữ cho nguồn đó.</li>
</ol>
<p><strong>Đạt khi:</strong> bản đồ đã có, và bạn nói được "nhật ký System của tôi còn từ ngày …" hoặc "journal của tôi còn từ ngày … (N lần khởi động)" bằng một ngày thật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['retention (thời gian lưu)', 'Log được giữ bao lâu trước khi bị xoá hay ghi đè.'],
  ['rotation (xoay vòng)', 'Mở tệp log mới và nén hoặc xoá tệp cũ.'],
  ['volatile journal (journal tạm)', 'Journal chỉ giữ trong bộ nhớ (/run), mất khi khởi động lại.'],
  ['logging driver', 'Cách Docker lưu output của container (json-file, journald…).'],
  ['ring buffer (bộ đệm vòng)', 'Vùng nhớ cố định nơi nhân giữ các thông điệp mới nhất.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nguồn nào cũng có chỗ nằm, công cụ và quyền; nhật ký Security và <code>/var/log</code> thường cần quản trị hoặc nhóm <code>adm</code>.</li>
<li>Log trình duyệt sống trong tab; log container chết theo container trừ khi được đẩy đi nơi khác.</li>
<li>Thời gian lưu bị giới hạn theo dung lượng hay tuổi, mặc định khác nhau — kiểm bằng <code>wevtutil gl</code>, <code>journalctl --disk-usage</code>, cấu hình logrotate.</li>
<li><code>json-file</code> mặc định của Docker không xoay vòng: rủi ro là đầy đĩa, không phải mất log.</li>
<li>Khi có sự cố, sao chép log trước, điều tra sau.</li>
</ul>
${nguon('📘', 'man journald.conf — lưu trữ và SystemMaxUse', 'Journal lưu bền và tạm, giới hạn dung lượng mặc định', 'https://man7.org/linux/man-pages/man5/journald.conf.5.html')}
${nguon('📘', 'Docker docs — JSON File logging driver', 'Driver mặc định; max-size và max-file tắt trừ khi đặt', 'https://docs.docker.com/engine/logging/drivers/json-file/')}
${nguon('📘', 'Kubernetes — Logging Architecture', 'Log container nằm ở đâu trên node và khi nào thì mất', 'https://kubernetes.io/docs/concepts/cluster-administration/logging/')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux &amp; Bash 10.3 — log và journalctl', sub: 'Những bước đầu với /var/log và journal' })}
</div>
`,
};
