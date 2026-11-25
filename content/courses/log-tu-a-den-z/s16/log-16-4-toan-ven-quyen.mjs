/**
 * 16.4 — Toàn vẹn và quyền truy cập (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s16/toan-ven'] (máy may16: quyền adm/systemd-journal, logrotate create 0640, chattr +a, chuỗi băm ./_demo/s16/toan-ven/chuoi-bam.py, băm bằng chứng),
 * OUT['s16/worm'] (MinIO RELEASE.2026-11-16 Object Lock COMPLIANCE + người dùng chỉ PutObject). Băm/giờ/versionId đổi mỗi lần chạy; lời chỉ dùng: dòng 5, 9 dòng, 29 ngày.
 * MITRE (kiểm 24/11/2026): Clear Linux or Mac System Logs = T1685.006 (cũ T1070.002, tactic Defense Impairment).
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Integrity and access control: who can read or delete logs, append-only storage, hash chains, sealing, chain of custody|||Toàn vẹn và quyền truy cập: ai được đọc/xoá log, lưu chỉ-ghi-thêm, chuỗi băm, niêm phong, chuỗi lưu giữ bằng chứng',
  slug: 'log-16-4-toan-ven-quyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Log chỉ là bằng chứng nếu không ai sửa hay xoá được mà không để lại dấu. Chạy thật trên máy Ubuntu: người không thuộc adm/systemd-journal bị từ chối đọc; log ứng dụng tạo với umask 022 thì ai cũng đọc, sửa bằng create 0640 root adm; chattr +a chặn ghi đè/xoá/đổi tên nhưng làm logrotate hỏng và root gỡ được; chuỗi băm bắt đúng dòng bị sửa, và chỉ bắt được việc tính lại cả chuỗi khi băm cuối đã gửi ra ngoài; MinIO Object Lock COMPLIANCE từ chối xoá kể cả với quản trị viên; tài khoản gửi log chỉ được PutObject; băm SHA-256 và sổ chuỗi lưu giữ khi thu bằng chứng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>A log is evidence only if nobody can quietly change it</h2>
<p class="lead">The first thing an intruder with root does after getting in is often to edit or delete the logs that show how (MITRE ATT&amp;CK T1685.006, "Clear Linux or Mac System Logs"; renumbered in 2026 from T1070.002). The first thing a lawyer asks about your log is "how do you know it was not edited?". This lesson answers both: who may read, who may write, who may delete — and how to make tampering impossible or at least visible.</p>

<h3>The everyday picture: the shop's camera</h3>
<p>A shop's security camera is useless if the night-shift employee can erase the recording. A good setup: staff can watch live, only the owner can export, the recording is copied every hour to a box nobody in the shop can open. Logs need the same split: read, write, delete — different people.</p>

<h3>Step 1 — who can read system logs (Linux)</h3>
${lenh('s16/toan-ven', 0)}
${lenh('s16/toan-ven', 1)}
${lenh('s16/toan-ven', 2)}
<p>Text logs are <code>syslog:adm</code> mode <code>640</code>; the journal directory belongs to group <code>systemd-journal</code>. A normal developer account gets "Permission denied" and journalctl shows only its own user journal. Adding someone to <code>adm</code> opens every log on the machine:</p>
${lenh('s16/toan-ven', 3)}
${lenh('s16/toan-ven', 4)}
<p>"Add the developer to adm so they can debug" is common and too broad: <code>auth.log</code> shows every login and sudo command of everyone. Better: give developers the central store (Grafana with a Viewer role and a label filter on their app), not a shell on the server. On Windows the equivalents are the <strong>Event Log Readers</strong> group for most logs and the "Manage auditing and security log" right for the Security log.</p>

<h3>Step 2 — your application's own log files</h3>
${lenh('s16/toan-ven', 5)}
${lenh('s16/toan-ven', 6)}
<p>An app running as root with the usual <code>umask 022</code> creates <code>-rw-r--r--</code>: anyone on the machine can read it, including the email in it. Fix the file and make logrotate create every new file correctly:</p>
${lenh('s16/toan-ven', 7)}
${lenh('s16/toan-ven', 8)}
<p>In containers the same idea applies to mounted log directories; Docker's own <code>json-file</code> logs live in <code>/var/lib/docker/containers/</code> readable only by root — and anyone in the <code>docker</code> group is effectively root.</p>

<h3>Step 3 — append-only on the machine</h3>
${lenh('s16/toan-ven', 9)}
<p><code>chattr +a</code> (ext4, xfs, btrfs) makes a file append-only: new lines can be added; overwriting, truncating, deleting and renaming fail with "Operation not permitted" — even for root. Two limits, both visible in real output:</p>
${lenh('s16/toan-ven', 10)}
${lenh('s16/toan-ven', 11)}
<p>logrotate can no longer rotate the file (you would need <code>prerotate chattr -a</code> / <code>postrotate chattr +a</code>), and root can simply remove the attribute. Append-only protects against accidents, buggy scripts and non-root attackers — not against root. Against root, the log must already be somewhere else.</p>

<h3>Step 4 — tamper-evident: a hash chain</h3>
<p>If you cannot stop a change, make it visible. Each line carries a hash of itself joined to the previous line's hash, so changing one line breaks every hash after it:</p>
${ma('python', 's16/toan-ven/chuoi-bam.py')}
${lenh('s16/toan-ven', 12)}
${lenh('s16/toan-ven', 13)}
${lenh('s16/toan-ven', 14)}
<p>The attacker turned "1 incorrect password attempt" into "session opened" — the checker names line 5. But an attacker with write access can recompute the whole chain:</p>
${lenh('s16/toan-ven', 15)}
<p>The recomputed chain is internally perfect (first check passes). It is caught only because the last hash of the original was saved elsewhere earlier (the "anchor") — the second check. That is the principle of every real system: journald's Forward Secure Sealing (<code>journalctl --setup-keys</code> / <code>--verify</code>, lesson 7.4) keeps the verification key off the machine; certificate transparency logs and blockchains publish their heads. The anchor must leave the machine.</p>

<h3>Step 5 — immutable, off the machine</h3>
<p>Object storage with <strong>Object Lock</strong> (S3, MinIO, and compatible stores) keeps every version and refuses to delete it before its retention date. MinIO, running locally:</p>
${ma('json', 's16/worm/chi-ghi.json')}
${lenh('s16/worm', 1)}
${lenh('s16/worm', 2)}
${lenh('s16/worm', 3)}
${lenh('s16/worm', 4)}
${lenh('s16/worm', 5)}
${lenh('s16/worm', 6)}
<p>The shipper's account (<code>may16-alloy</code>) can only <strong>add</strong> objects: it cannot read them back and cannot delete them. If an attacker steals the shipper's key from the server, they can add junk but not erase evidence. Now the administrator tries:</p>
${lenh('s16/worm', 7)}
${lenh('s16/worm', 8)}
${lenh('s16/worm', 9)}
${lenh('s16/worm', 10)}
<p>"Deleting" only adds a delete marker (v2); version v1 is still there. Deleting v1 itself, or clearing its retention, is refused: <em>WORM protected</em> (write once, read many). In <strong>COMPLIANCE</strong> mode nobody — not even the root account — can shorten it; in <strong>GOVERNANCE</strong> mode a user with a special permission can. Choose COMPLIANCE for evidence and legal retention (Decree 333/2026 asks for integrity "preventing unauthorised modification or deletion"), and mind that a wrong 10-year lock on a big bucket is a 10-year bill.</p>

<h3>Step 6 — separation of duties</h3>
<table>
<thead><tr><th>Role</th><th>Can</th><th>Cannot</th></tr></thead>
<tbody>
<tr><td>The server / shipper</td><td>write (append, PutObject)</td><td>read back, delete</td></tr>
<tr><td>Developers, support</td><td>read their app's logs in Grafana/Kibana</td><td>read auth/audit logs, delete</td></tr>
<tr><td>Security / ops on duty</td><td>read everything, export with a record</td><td>delete before retention</td></tr>
<tr><td>Log platform admin</td><td>configure retention (with review)</td><td>be the same person as the server admin</td></tr>
</tbody>
</table>
<p>Also: log the access to logs (Grafana and Kibana have audit logs of who searched what), and alert on deletion attempts and on silence (Chapter 15).</p>

<h3>Step 7 — collecting logs as evidence</h3>
${lenh('s16/toan-ven', 16)}
<p>When logs may end up in an investigation: copy, do not move; archive with stable ordering; compute <strong>SHA-256</strong> immediately and write it down; verify after every copy (the hash of the copy starts with the same digits); keep the original read-only. Record a <strong>chain of custody</strong>: what was collected, from where, by whom, when (with time zone), the hash, every hand-over. RFC 3227 gives the order of volatility (memory and network state before disk). The Incident Response course (7.3) covers this procedure in full.</p>

<h3>🛡️ Attacker's corner: clearing the tracks</h3>
<p>In the SolarWinds compromise (disclosed December 2020), APT29 used <code>auditpol</code> on Windows hosts to stop the collection of audit logs (MITRE ATT&amp;CK campaign C0024, technique T1685.001) — so the local logs showed a gap, not a crime. On Linux the equivalents are deleting or truncating <code>auth.log</code>, <code>wtmp</code>, the journal (T1685.006). What actually defeats this: the lines had already been shipped (Chapter 15), the copy is immutable and the shipper cannot delete (Step 5), and the gap itself raised an alert ("no logs for 15 minutes").</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"An attacker got root. Can you still trust the logs?" — Local ones, no. Lines shipped before the compromise to a store the server cannot delete, yes.</li>
<li>"What is WORM / Object Lock? Governance vs Compliance?" — see Step 5.</li>
<li>"How do you prove a log file was not changed?" — hash at collection, chain of custody; tamper-evident chains with an external anchor; FSS for journald.</li>
<li>"Should developers have SSH to production to read logs?" — prefer a central store with role-based read access.</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>Customer audit</strong> (common with Japanese customers in outsourcing): "who can delete production logs?" — answer with the roles table and show the lock configuration.</li>
<li><strong>You are asked for "the logs from last Tuesday"</strong> for a dispute: export with a hash and a short custody note, never a screenshot only.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your VM: create a user <code>xem</code> who can read the journal but not <code>/var/log/auth.log</code>. Which group?</li>
<li>Make <code>chattr +a</code> survive logrotate for <code>/var/log/shop/app.log</code>.</li>
<li>Extend <code>chuoi-bam.py</code> so that it prints the anchor every 100 lines; where would you send it?</li>
</ol>
<p><strong>Pass:</strong> (1) <code>usermod -aG systemd-journal xem</code> — then <code>journalctl</code> works, <code>cat /var/log/auth.log</code> still fails (but note: the journal contains the same auth messages! reading the journal is reading auth — group membership must be decided per person); (2) <code>prerotate</code> <code>chattr -a /var/log/shop/app.log</code> and <code>postrotate</code> <code>chattr +a /var/log/shop/app.log</code> inside the stanza (with <code>create</code>, the new file needs the attribute too); (3) to the central store, or a different machine, or even an email — anywhere the server's root cannot edit.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['adm / systemd-journal', 'Linux groups that can read text logs / the journal.'],
  ['Append-only (chattr +a)', 'File attribute: only appending allowed; root can remove it.'],
  ['Tamper-evident', 'Changes cannot be prevented but are detected (hash chain, FSS).'],
  ['WORM / Object Lock', 'Write once, read many: versions cannot be deleted before retention.'],
  ['COMPLIANCE vs GOVERNANCE', 'Lock nobody can shorten / lock a privileged user can bypass.'],
  ['Chain of custody', 'Record of who held evidence, when, and its hash at each step.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Read access: adm and systemd-journal are powerful; prefer a central store with roles.</li>
<li>App logs: 0640 root:adm, and <code>create</code> in logrotate.</li>
<li>chattr +a stops accidents, not root. Hash chains detect edits only with an external anchor.</li>
<li>Real protection: ship early to an immutable store with a write-only account.</li>
<li>Evidence: copy, hash, record custody.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Log chỉ là bằng chứng khi không ai lặng lẽ sửa được nó</h2>
<p class="lead">Việc đầu tiên kẻ đột nhập có root thường làm là sửa hoặc xoá những dòng log cho thấy hắn vào bằng cách nào (MITRE ATT&amp;CK T1685.006, "Clear Linux or Mac System Logs"; đánh số lại năm 2026, trước là T1070.002). Câu đầu tiên luật sư hỏi về log của bạn là "làm sao biết nó không bị sửa?". Bài này trả lời cả hai: ai được đọc, ai được ghi, ai được xoá — và làm sao để việc sửa không thể xảy ra, hoặc ít nhất phải lộ ra.</p>

<h3>Liên tưởng đời thường: camera của cửa hàng</h3>
<p>Camera an ninh vô dụng nếu nhân viên ca đêm xoá được đoạn ghi. Một cách bố trí tốt: nhân viên xem trực tiếp được, chỉ chủ cửa hàng được xuất đoạn ghi, và mỗi giờ đoạn ghi được chép sang một chiếc hộp không ai trong cửa hàng mở được. Log cần đúng sự chia tách đó: đọc, ghi, xoá — những người khác nhau.</p>

<h3>Bước 1 — ai đọc được log hệ thống (Linux)</h3>
${lenh('s16/toan-ven', 0)}
${lenh('s16/toan-ven', 1)}
${lenh('s16/toan-ven', 2)}
<p>Log dạng chữ thuộc <code>syslog:adm</code> quyền <code>640</code>; thư mục journal thuộc nhóm <code>systemd-journal</code>. Tài khoản lập trình viên bình thường nhận "Permission denied" và journalctl chỉ hiện journal của chính người dùng đó. Thêm ai đó vào <code>adm</code> là mở toang mọi log trên máy:</p>
${lenh('s16/toan-ven', 3)}
${lenh('s16/toan-ven', 4)}
<p>"Cho dev vào nhóm adm để họ gỡ lỗi" là chuyện hay gặp và quá rộng: <code>auth.log</code> cho thấy mọi lần đăng nhập và mọi lệnh sudo của mọi người. Cách tốt hơn: cho lập trình viên dùng kho trung tâm (Grafana với vai trò Viewer và bộ lọc nhãn đúng ứng dụng của họ), không cho shell trên máy chủ. Trên Windows, tương đương là nhóm <strong>Event Log Readers</strong> cho phần lớn log và quyền "Manage auditing and security log" cho log Security.</p>

<h3>Bước 2 — tệp log của chính ứng dụng</h3>
${lenh('s16/toan-ven', 5)}
${lenh('s16/toan-ven', 6)}
<p>Ứng dụng chạy bằng root với <code>umask 022</code> quen thuộc sẽ tạo <code>-rw-r--r--</code>: ai trên máy cũng đọc được, kể cả email bên trong. Sửa tệp, và bắt logrotate tạo mọi tệp mới đúng quyền:</p>
${lenh('s16/toan-ven', 7)}
${lenh('s16/toan-ven', 8)}
<p>Với container, ý tưởng y như vậy áp cho thư mục log được mount; log <code>json-file</code> của chính Docker nằm ở <code>/var/lib/docker/containers/</code> chỉ root đọc được — và ai thuộc nhóm <code>docker</code> thì thực chất là root.</p>

<h3>Bước 3 — chỉ-ghi-thêm ngay trên máy</h3>
${lenh('s16/toan-ven', 9)}
<p><code>chattr +a</code> (ext4, xfs, btrfs) biến tệp thành chỉ-ghi-thêm: thêm dòng mới được; ghi đè, cắt rỗng, xoá và đổi tên đều thất bại với "Operation not permitted" — kể cả với root. Hai giới hạn, đều thấy rõ trong output thật:</p>
${lenh('s16/toan-ven', 10)}
${lenh('s16/toan-ven', 11)}
<p>logrotate không xoay được tệp nữa (cần <code>prerotate chattr -a</code> / <code>postrotate chattr +a</code>), và root chỉ việc gỡ thuộc tính. Chỉ-ghi-thêm bảo vệ trước tai nạn, script lỗi và kẻ tấn công không có root — không chống được root. Muốn chống root, log phải đã nằm ở nơi khác.</p>

<h3>Bước 4 — để lại dấu khi bị sửa: chuỗi băm</h3>
<p>Nếu không ngăn được việc sửa, hãy làm cho nó lộ ra. Mỗi dòng mang băm của chính nó nối với băm của dòng trước, nên sửa một dòng là vỡ mọi băm phía sau:</p>
${ma('python', 's16/toan-ven/chuoi-bam.py')}
${lenh('s16/toan-ven', 12)}
${lenh('s16/toan-ven', 13)}
${lenh('s16/toan-ven', 14)}
<p>Kẻ tấn công biến "1 incorrect password attempt" thành "session opened" — bộ kiểm chỉ đúng dòng 5. Nhưng kẻ có quyền ghi có thể tính lại cả chuỗi:</p>
${lenh('s16/toan-ven', 15)}
<p>Chuỗi tính lại khớp hoàn hảo với chính nó (lần kiểm đầu qua). Nó chỉ bị bắt vì băm cuối của bản gốc đã được lưu ở nơi khác từ trước ("mốc") — lần kiểm thứ hai. Đó là nguyên lý của mọi hệ thống thật: Forward Secure Sealing của journald (<code>journalctl --setup-keys</code> / <code>--verify</code>, bài 7.4) giữ khoá kiểm ở ngoài máy; nhật ký Certificate Transparency và blockchain công bố "đầu chuỗi" của mình. Mốc phải rời khỏi máy.</p>

<h3>Bước 5 — bất biến, và ở ngoài máy</h3>
<p>Kho đối tượng có <strong>Object Lock</strong> (S3, MinIO và các kho tương thích) giữ mọi phiên bản và từ chối xoá trước ngày hết hạn lưu. MinIO, chạy ngay trên máy:</p>
${ma('json', 's16/worm/chi-ghi.json')}
${lenh('s16/worm', 1)}
${lenh('s16/worm', 2)}
${lenh('s16/worm', 3)}
${lenh('s16/worm', 4)}
${lenh('s16/worm', 5)}
${lenh('s16/worm', 6)}
<p>Tài khoản của bộ gửi log (<code>may16-alloy</code>) chỉ được <strong>thêm</strong> đối tượng: không đọc lại được, không xoá được. Kẻ tấn công lấy được khoá của bộ gửi trên máy chủ thì chỉ thêm được rác chứ không xoá được bằng chứng. Giờ đến lượt quản trị viên thử:</p>
${lenh('s16/worm', 7)}
${lenh('s16/worm', 8)}
${lenh('s16/worm', 9)}
${lenh('s16/worm', 10)}
<p>"Xoá" chỉ thêm một dấu xoá (v2); phiên bản v1 vẫn còn nguyên. Xoá chính v1, hay gỡ thời hạn lưu của nó, đều bị từ chối: <em>WORM protected</em> (ghi một lần, đọc nhiều lần). Ở chế độ <strong>COMPLIANCE</strong> không ai — kể cả tài khoản root — rút ngắn được; ở chế độ <strong>GOVERNANCE</strong> người có quyền đặc biệt thì làm được. Chọn COMPLIANCE cho bằng chứng và lưu theo luật (Nghị định 333/2026 đòi hỏi toàn vẹn, "ngăn chặn việc sửa đổi hoặc xoá dữ liệu trái phép"), và nhớ rằng khoá nhầm 10 năm trên một bucket lớn là hoá đơn 10 năm.</p>

<h3>Bước 6 — tách quyền</h3>
<table>
<thead><tr><th>Vai trò</th><th>Được</th><th>Không được</th></tr></thead>
<tbody>
<tr><td>Máy chủ / bộ gửi log</td><td>ghi (thêm dòng, PutObject)</td><td>đọc lại, xoá</td></tr>
<tr><td>Lập trình viên, hỗ trợ</td><td>đọc log ứng dụng của mình trên Grafana/Kibana</td><td>đọc log auth/audit, xoá</td></tr>
<tr><td>Bảo mật / vận hành trực ca</td><td>đọc mọi thứ, xuất có ghi sổ</td><td>xoá trước hạn</td></tr>
<tr><td>Quản trị nền tảng log</td><td>cấu hình thời gian lưu (có duyệt)</td><td>trùng người với quản trị máy chủ</td></tr>
</tbody>
</table>
<p>Thêm nữa: ghi log việc truy cập log (Grafana và Kibana có audit log ai đã tìm gì), và cảnh báo khi có người thử xoá và khi im lặng (Chương 15).</p>

<h3>Bước 7 — thu log làm bằng chứng</h3>
${lenh('s16/toan-ven', 16)}
<p>Khi log có thể đi vào một cuộc điều tra: chép, đừng di chuyển; đóng gói với thứ tự ổn định; tính <strong>SHA-256</strong> ngay và ghi lại; kiểm lại sau mỗi lần chép (băm của bản sao bắt đầu bằng đúng các chữ số đó); giữ bản gốc ở chế độ chỉ đọc. Ghi <strong>chuỗi lưu giữ</strong> (chain of custody): thu cái gì, từ đâu, ai thu, lúc nào (kèm múi giờ), mã băm, mỗi lần bàn giao. RFC 3227 đưa ra thứ tự dễ mất (bộ nhớ và trạng thái mạng trước đĩa). Khoá Incident Response (bài 7.3) dạy trọn quy trình này.</p>

<h3>🛡️ Góc hacker: xoá dấu vết</h3>
<p>Trong vụ SolarWinds (công bố 12/2020), nhóm APT29 dùng <code>auditpol</code> trên máy Windows để ngừng thu audit log (MITRE ATT&amp;CK chiến dịch C0024, kỹ thuật T1685.001) — để log tại chỗ chỉ còn một khoảng trống chứ không còn dấu vết tội. Trên Linux, tương đương là xoá hoặc cắt rỗng <code>auth.log</code>, <code>wtmp</code>, journal (T1685.006). Thứ thật sự đánh bại chiêu này: các dòng đã được gửi đi từ trước (Chương 15), bản sao là bất biến và bộ gửi không có quyền xoá (Bước 5), và chính khoảng trống đã kích hoạt cảnh báo ("15 phút không có log").</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Kẻ tấn công đã có root. Còn tin log được không?" — Log tại chỗ thì không. Các dòng đã gửi đi trước lúc bị chiếm, tới một kho mà máy chủ không xoá được, thì có.</li>
<li>"WORM / Object Lock là gì? Governance khác Compliance thế nào?" — xem Bước 5.</li>
<li>"Chứng minh một tệp log không bị sửa thế nào?" — băm lúc thu, chuỗi lưu giữ; chuỗi băm có mốc bên ngoài; FSS cho journald.</li>
<li>"Có nên cho lập trình viên SSH vào production để đọc log?" — nên dùng kho trung tâm với quyền đọc theo vai trò.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Khách hàng kiểm toán</strong> (hay gặp với khách Nhật trong outsourcing): "ai xoá được log production?" — trả lời bằng bảng vai trò và cho xem cấu hình khoá.</li>
<li><strong>Bạn được yêu cầu "log hôm thứ Ba tuần trước"</strong> cho một tranh chấp: xuất kèm mã băm và một ghi chú lưu giữ ngắn, đừng chỉ gửi ảnh chụp màn hình.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy ảo: tạo người dùng <code>xem</code> đọc được journal nhưng không đọc được <code>/var/log/auth.log</code>. Nhóm nào?</li>
<li>Làm cho <code>chattr +a</code> sống sót qua logrotate với <code>/var/log/shop/app.log</code>.</li>
<li>Mở rộng <code>chuoi-bam.py</code> để cứ 100 dòng in một mốc; bạn sẽ gửi mốc đó đi đâu?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) <code>usermod -aG systemd-journal xem</code> — <code>journalctl</code> chạy được, <code>cat /var/log/auth.log</code> vẫn bị từ chối (nhưng để ý: journal chứa đúng các thông điệp auth đó! đọc journal là đọc auth — quyền nhóm phải quyết theo từng người); (2) <code>prerotate</code> <code>chattr -a /var/log/shop/app.log</code> và <code>postrotate</code> <code>chattr +a /var/log/shop/app.log</code> trong khối cấu hình (với <code>create</code>, tệp mới cũng cần thuộc tính); (3) tới kho trung tâm, một máy khác, thậm chí một email — bất cứ đâu root của máy chủ không sửa được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['adm / systemd-journal', 'Nhóm Linux đọc được log dạng chữ / journal.'],
  ['Chỉ-ghi-thêm (chattr +a)', 'Thuộc tính tệp: chỉ được thêm vào cuối; root gỡ được.'],
  ['Để lại dấu (tamper-evident)', 'Không ngăn được việc sửa nhưng phát hiện được (chuỗi băm, FSS).'],
  ['WORM / Object Lock', 'Ghi một lần đọc nhiều lần: không xoá được phiên bản trước hạn lưu.'],
  ['COMPLIANCE và GOVERNANCE', 'Khoá không ai rút ngắn được / khoá người có quyền đặc biệt vượt được.'],
  ['Chuỗi lưu giữ', 'Sổ ghi ai giữ bằng chứng, lúc nào, và mã băm ở mỗi bước.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Quyền đọc: adm và systemd-journal rất mạnh; ưu tiên kho trung tâm có vai trò.</li>
<li>Log ứng dụng: 0640 root:adm, và <code>create</code> trong logrotate.</li>
<li>chattr +a chặn tai nạn, không chặn root. Chuỗi băm chỉ phát hiện được việc sửa khi có mốc bên ngoài.</li>
<li>Bảo vệ thật: gửi sớm tới kho bất biến bằng tài khoản chỉ-được-ghi.</li>
<li>Bằng chứng: chép, băm, ghi chuỗi lưu giữ.</li>
</ul>
${nguon('🛡️', 'MITRE ATT&CK — T1685.006 Clear Linux or Mac System Logs', 'Kỹ thuật xoá log (đánh số lại từ T1070.002)', 'https://attack.mitre.org/techniques/T1685/006/')}
${nguon('🛡️', 'MITRE ATT&CK — T1685.001 Disable or Modify Windows Event Log', 'Ví dụ C0024: APT29 dùng AUDITPOL trong vụ SolarWinds', 'https://attack.mitre.org/techniques/T1685/001/')}
${nguon('📘', 'MinIO — Object Retention (Object Lock)', 'COMPLIANCE vs GOVERNANCE, retention mặc định của bucket', 'https://min.io/docs/minio/linux/administration/object-management/object-retention.html')}
${nguon('📘', 'man7.org — chattr(1)', 'Thuộc tính a (append only) và i (immutable)', 'https://man7.org/linux/man-pages/man1/chattr.1.html')}
${nguon('📘', 'RFC 3227 — Guidelines for Evidence Collection and Archiving', 'Thứ tự dễ mất, chuỗi lưu giữ', 'https://www.rfc-editor.org/rfc/rfc3227')}
${lienKet({ khoa: 'incident-response', bai: 'ir-7-3-chuoi-luu-giu', title: 'Incident Response 7.3 — Băm, dấu thời gian và chuỗi lưu giữ', sub: 'Quy trình thu bằng chứng đầy đủ', cta: 'Mở bài' })}
</div>
`,
};
