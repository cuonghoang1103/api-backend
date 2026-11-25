/**
 * 14.4 — Khi kẻ tấn công xoá log (soạn 24/11/2026, agent lgz). Output thật: OUT['s14/xoa-dau'] — vu14 (tao-vu.py) + EVTX công khai (clear-1102, clear-104 PC01.example.corp 19/3/2019; svc-7045 fs02 11/7/2020).
 * Số tất định: auth.log cục bộ 1936 dòng / bản logsrv 2446; dòng mất: 70/70/69 (01:40/01:57/02:14) + 2 (02:15) + 5 (02:16) — 74 Failed, 74 Connection closed, 60 Invalid user, 1 Accepted, sudo ×2, useradd ×2, usermod ×2, chpasswd ×1;
 * MỒ CÔI duy nhất: 02:14:01 sshd[3045102] session opened deploy; LẶNG logsrv 426 phút 02:24:08 → 09:31:00; auditd LẶNG 427 phút 02:22:30 → 09:29:31; cảnh báo IM_LANG 02:54:10;
 * rsyslogd exiting on signal 15 02:24:08 + start 02:24:10; auth.log sinh 2026-11-19 02:23:05 (syslog sinh 2026-11-01), .bash_history deploy → /dev/null 02:15:00, root 0 byte 02:23:41;
 * Windows: 104 System 23:34:25 + 1102 Security 23:35:07 (user01, rec 452811); fs02 104 21:49:56 rồi 7045 bad-task 21:50:07.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '14.4 — When attackers delete logs: 1102/104, truncated auth.log, wiped history, time gaps, stopped auditd, journal verify errors|||14.4 — Khi kẻ tấn công xoá log: 1102/104, auth.log bị cắt, history bị xoá, khoảng trống thời gian, auditd bị dừng, journal verify báo lỗi',
  slug: 'log-14-4-xoa-dau-vet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Không có log cũng là bằng chứng — nếu bạn biết tìm chỗ trống. Trên web01, kẻ tấn công dùng sed xoá 216 dòng khỏi auth.log, tắt auditd, cắt đường gửi log, và trỏ .bash_history về /dev/null. Bài này tìm lại mọi thứ: so bản cục bộ với bản đã gửi về máy chủ log, phiên SSH "mồ côi" không có dòng Accepted, khoảng lặng 426 phút, tệp log có ngày "sinh" giữa đêm, cảnh báo "nguồn im lặng" — và trên Windows là 1102/104 trên log công khai. Phòng: gửi log đi ngay, chỉ-ghi-thêm, tách quyền, cảnh báo khi một nguồn im lặng (Equifax 2017: 76 ngày không ai thấy).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>The absence of logs is evidence too</h2>
<p class="lead">Once root, an attacker can edit any file on the machine — including the logs. That is why "the log says nothing happened" proves nothing on its own. But deleting is clumsy: it leaves holes, broken pairs, new file timestamps, and — if logs were shipped elsewhere — a second copy that does not match. This lesson finds all of them on web01.</p>

<h3>The everyday picture</h3>
<p>A page torn out of the guard's logbook. You cannot read what was on it, but you can see the stub, the page numbers jump, and the copy the guard faxed to head office every evening still has it.</p>

<h3>Step 1 — compare with the copy that left the machine</h3>
${lenh('s14/xoa-dau', 0)}
${lenh('s14/xoa-dau', 1)}
${lenh('s14/xoa-dau', 2)}
<p><code>grep -vxFf A B</code> prints lines of B that are not, character for character, a line of A. Every line about 203.0.113.77, the sudo bash, the new user — 216 lines — exist on the log server and not on web01. The attacker ran something like <code>sed -i '/203.0.113.77/d; /sysupdate/d' /var/log/auth.log</code>. rsyslog had already forwarded them the moment they were written (Lesson 8.2) — deleting the local file cannot recall them.</p>

<h3>Step 2 — broken pairs: a session with no logon</h3>
<p>Without the central copy, look for <em>pairs</em> that should always appear together. sshd writes <code>Accepted …</code> and then <code>session opened</code> with the same PID:</p>
${lenh('s14/xoa-dau', 3)}
<p>One session at 02:14:01 has no Accepted line — the attacker removed lines containing the IP, but the session line has no IP in it. Partial cleaning is the usual case; look for orphans (sudo COMMAND without session opened, session opened without closed, 4624 without 4634).</p>

<h3>Step 3 — silence where there should be noise</h3>
${lenh('s14/xoa-dau', 4)}
${lenh('s14/xoa-dau', 5)}
<p>web01 normally sends a line at least every hour (cron at :17, bots all day). 426 minutes of nothing on the log server, 427 minutes of nothing in auditd — they start 1–2 minutes apart, right after <code>audit_enabled=0</code>. The log server noticed after 30 minutes:</p>
${lenh('s14/xoa-dau', 6)}
${lenh('s14/xoa-dau', 7)}
<p>rsyslog was restarted at 02:24:08 (signal 15 = a normal stop). Locally it kept writing; remotely nothing more arrived — the forwarding rule had been removed before the restart (T1685, Disable or Modify Tools).</p>

<h3>Step 4 — the files themselves</h3>
${lenh('s14/xoa-dau', 8)}
<p><code>sed -i</code> does not edit in place: it writes a new file and renames it over the old one. So auth.log has a new inode and a <strong>birth time</strong> of 02:23:05 — while syslog was born on 1/11 at the monthly rotation. A log file born in the middle of the night, not at rotation time, has been rewritten. History: deploy's <code>.bash_history</code> is a symlink to <code>/dev/null</code> (created 02:15:00), root's is empty (T1070.003). These are file-system facts — collect them (<code>stat</code>, <code>ls -la</code>) before anyone "cleans up".</p>

<h3>Step 5 — Windows: 1102 and 104</h3>
${lenh('s14/xoa-dau', 9)}
${lenh('s14/xoa-dau', 10)}
<p>Clearing the Security log always writes <strong>1102</strong> into the new, empty Security log (with who did it); clearing any other log writes <strong>104</strong> into System. The attacker cannot clear without leaving that line — unless they stop the Event Log service or patch it (Lesson 4.3). On fs02 the System log was cleared 11 seconds <em>before</em> a service was installed: clearing is often a sign of what comes next, not the end.</p>

${kv([
  ['Linux', 'Local vs central diff; orphan pairs; time gaps; file birth time/inode; empty or /dev/null history; auditd CONFIG_CHANGE / DAEMON_END; journalctl --verify errors (Lesson 7.4 sealing).'],
  ['Windows', '1102, 104, 4719 (audit policy changed), 7040/7036 on EventLog service, gaps in EventRecordID (Lesson 4.3).'],
  ['Everywhere', 'Silence alert per source; copies that left the machine (log server, CDN/WAF logs, cloud audit logs, firewall).'],
])}

<h3>Defence: make deletion useless</h3>
<ol>
<li><strong>Ship logs off the machine immediately</strong> (rsyslog/Alloy/agent — Chapter 15). What has left cannot be edited by root on the host.</li>
<li><strong>Append-only on the receiver</strong>: the server account that receives cannot delete; object-lock / WORM for archives (Lesson 16.4).</li>
<li><strong>Separate duties</strong>: the admins of web01 are not admins of the log server.</li>
<li><strong>Alert on silence</strong>: "no lines from host X for N minutes" is one of the most valuable alerts you can write.</li>
<li>Lock auditd rules with <code>-e 2</code> (immutable until reboot) so <code>auditctl -e 0</code> fails — then a reboot itself becomes the signal.</li>
</ol>

<h3>🛡️ Real incident: Equifax, 2017</h3>
<p>The US GAO report on the Equifax breach (GAO-18-559, August 2018) describes attackers inside the network for <strong>76 days</strong> in 2017. A device that inspected encrypted traffic had an <strong>expired certificate</strong> — expired about ten months earlier — so it had silently stopped inspecting. When the certificate was renewed, the suspicious traffic was noticed immediately. No one deleted a log; the source simply went quiet, and nobody was alerted that it had.</p>
${nguon('📘', 'U.S. GAO — GAO-18-559: Data Protection — Actions Taken by Equifax and Federal Agencies', '76 days undetected; expired certificate on traffic inspection', 'https://www.gao.gov/products/gao-18-559')}
${nguon('📘', 'MITRE ATT&CK — T1685.006 Clear Linux or Mac System Logs · T1070.003 Clear Command History', 'v19.2 (formerly T1070.002)', 'https://attack.mitre.org/techniques/T1685/006/')}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"An attacker had root and cleaned auth.log. How can you still know what happened?" — central copy, orphan pairs, gaps, file metadata, other sources.</li>
<li>"What does Event ID 1102 record and why can't the attacker avoid it?" — Security log cleared, written into the new log with the subject.</li>
<li>"What is the cheapest alert that would have helped Equifax?" — a silence/heartbeat alert per source.</li>
</ul>

<h3>At work</h3>
<p>In an incident, your first technical action is <strong>preserve</strong>: copy logs off the host (and hash them) before rebooting or "fixing". Write down the commands you ran and when (Lesson 16.4, chain of custody).</p>

<h3>🧪 Practice (30 min)</h3>
<ol>
<li>Find all <code>sudo … COMMAND=</code> lines on the log server that have no matching line on web01.</li>
<li>Write a silence check for <code>audit.log</code>: print every gap longer than 65 minutes (cron makes a record every hour).</li>
<li>On a VM: <code>stat /var/log/auth.log</code>, run <code>sudo sed -i '$d' /var/log/auth.log</code>, <code>stat</code> again — what changed (inode, birth)? What does rsyslog do now (does it keep writing to the old, deleted inode until HUP)?</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Orphan record', 'One half of a pair that should always appear together.'],
  ['Gap / silence', 'A period with no records from a source that normally always writes.'],
  ['Birth time (%w)', 'When the file (inode) was created; rewritten logs get a new one.'],
  ['1102 / 104', 'Security log cleared / another log cleared (written in System).'],
  ['Append-only', 'Storage where data can be added but not changed or deleted.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Deleting leaves holes: diff with the shipped copy, orphans, gaps, file metadata.</li>
<li>Ship logs away immediately and alert on silence.</li>
<li>Clearing is often the prelude, not the end — read what follows.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-3-xoa-log-chinh-sach', title: 'Lesson 4.3 — Tampering: 1102/104/4719', sub: 'Windows side in detail', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-16-4-toan-ven-quyen', title: 'Lesson 16.4 — Integrity and access', sub: 'Append-only, hashing, separation of duties', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Không có log cũng là bằng chứng</h2>
<p class="lead">Khi đã là root, kẻ tấn công sửa được mọi tệp trên máy — kể cả log. Vì thế "log không ghi gì cả" tự nó không chứng minh được gì. Nhưng xoá thì vụng: nó để lại lỗ hổng, cặp dòng bị gãy, mốc thời gian tệp mới, và — nếu log đã được gửi đi — một bản thứ hai không khớp. Bài này tìm lại tất cả trên web01.</p>

<h3>Liên tưởng đời thường</h3>
<p>Một trang bị xé khỏi sổ trực của bảo vệ. Bạn không đọc được trang đó, nhưng thấy cuống giấy, số trang nhảy cóc, và bản fax mà bảo vệ gửi về trụ sở mỗi tối vẫn còn nguyên trang đó.</p>

<h3>Bước 1 — so với bản đã rời khỏi máy</h3>
${lenh('s14/xoa-dau', 0)}
${lenh('s14/xoa-dau', 1)}
${lenh('s14/xoa-dau', 2)}
<p><code>grep -vxFf A B</code> in các dòng của B không trùng khít (từng ký tự, cả dòng) với dòng nào của A. Mọi dòng về 203.0.113.77, lệnh sudo bash, người dùng mới — 216 dòng — có ở máy chủ log mà không có trên web01. Kẻ tấn công đã chạy kiểu như <code>sed -i '/203.0.113.77/d; /sysupdate/d' /var/log/auth.log</code>. Nhưng rsyslog đã chuyển các dòng đó đi ngay lúc chúng được ghi (Bài 8.2) — xoá tệp cục bộ không gọi chúng về được.</p>

<h3>Bước 2 — cặp bị gãy: phiên không có lần đăng nhập</h3>
<p>Khi không có bản trung tâm, tìm những <em>cặp</em> luôn đi cùng nhau. sshd ghi <code>Accepted …</code> rồi <code>session opened</code> với cùng PID:</p>
${lenh('s14/xoa-dau', 3)}
<p>Một phiên lúc 02:14:01 không có dòng Accepted — kẻ tấn công xoá các dòng chứa IP, nhưng dòng session không chứa IP. Dọn dở dang là chuyện thường; hãy tìm "mồ côi" (sudo COMMAND không có session opened, session opened không có closed, 4624 không có 4634).</p>

<h3>Bước 3 — im lặng ở chỗ lẽ ra phải ồn</h3>
${lenh('s14/xoa-dau', 4)}
${lenh('s14/xoa-dau', 5)}
<p>Bình thường web01 gửi ít nhất một dòng mỗi giờ (cron lúc phút 17, bot cả ngày). 426 phút không có gì ở máy chủ log, 427 phút không có gì trong auditd — bắt đầu cách nhau 1–2 phút, ngay sau <code>audit_enabled=0</code>. Máy chủ log phát hiện sau 30 phút:</p>
${lenh('s14/xoa-dau', 6)}
${lenh('s14/xoa-dau', 7)}
<p>rsyslog bị khởi động lại lúc 02:24:08 (signal 15 = dừng bình thường). Ở máy nó vẫn ghi; ở xa thì không nhận thêm gì — luật chuyển tiếp đã bị gỡ trước khi khởi động lại (T1685, Disable or Modify Tools).</p>

<h3>Bước 4 — chính các tệp</h3>
${lenh('s14/xoa-dau', 8)}
<p><code>sed -i</code> không sửa tại chỗ: nó ghi tệp mới rồi đổi tên đè lên tệp cũ. Vì vậy auth.log có inode mới và <strong>thời điểm sinh</strong> (birth, <code>%w</code>) là 02:23:05 — trong khi syslog sinh ngày 1/11 lúc xoay log hằng tháng. Một tệp log "sinh" giữa đêm, không đúng giờ xoay, là tệp đã bị viết lại. Lịch sử lệnh: <code>.bash_history</code> của deploy là liên kết tới <code>/dev/null</code> (tạo lúc 02:15:00), của root thì rỗng (T1070.003). Đây là dữ kiện của hệ thống tệp — hãy thu chúng (<code>stat</code>, <code>ls -la</code>) trước khi ai đó "dọn dẹp".</p>

<h3>Bước 5 — Windows: 1102 và 104</h3>
${lenh('s14/xoa-dau', 9)}
${lenh('s14/xoa-dau', 10)}
<p>Xoá log Security luôn ghi <strong>1102</strong> vào chính log Security mới, rỗng (kèm người làm); xoá bất kỳ log nào khác ghi <strong>104</strong> vào System. Kẻ tấn công không thể xoá mà không để lại dòng đó — trừ khi dừng hoặc vá dịch vụ Event Log (Bài 4.3). Trên fs02, log System bị xoá 11 giây <em>trước</em> khi một dịch vụ được cài: xoá log thường báo hiệu việc sắp tới, không phải kết thúc.</p>

${kv([
  ['Linux', 'So bản cục bộ với bản trung tâm; cặp mồ côi; khoảng lặng; birth time/inode của tệp; history rỗng hoặc trỏ /dev/null; auditd CONFIG_CHANGE / DAEMON_END; journalctl --verify báo lỗi (niêm phong, Bài 7.4).'],
  ['Windows', '1102, 104, 4719 (đổi audit policy), 7040/7036 trên dịch vụ EventLog, EventRecordID nhảy cóc (Bài 4.3).'],
  ['Mọi nơi', 'Cảnh báo im lặng theo từng nguồn; các bản đã rời máy (máy chủ log, log CDN/WAF, audit log của cloud, tường lửa).'],
])}

<h3>Phòng: làm cho việc xoá trở nên vô ích</h3>
<ol>
<li><strong>Gửi log ra khỏi máy ngay</strong> (rsyslog/Alloy/agent — Chương 15). Thứ đã đi rồi thì root trên máy không sửa được.</li>
<li><strong>Chỉ ghi thêm ở phía nhận</strong>: tài khoản nhận log không có quyền xoá; khoá đối tượng (object lock) / WORM cho kho lưu trữ (Bài 16.4).</li>
<li><strong>Tách quyền</strong>: người quản trị web01 không phải người quản trị máy chủ log.</li>
<li><strong>Cảnh báo khi im lặng</strong>: "không có dòng nào từ máy X trong N phút" là một trong những cảnh báo đáng giá nhất bạn có thể viết.</li>
<li>Khoá luật auditd bằng <code>-e 2</code> (bất biến tới lần khởi động lại) để <code>auditctl -e 0</code> thất bại — khi đó chính việc khởi động lại trở thành tín hiệu.</li>
</ol>

<h3>🛡️ Sự cố thật: Equifax, 2017</h3>
<p>Báo cáo của GAO (cơ quan kiểm toán Quốc hội Mỹ) về vụ Equifax (GAO-18-559, tháng 8/2018) mô tả kẻ tấn công ở trong mạng <strong>76 ngày</strong> năm 2017. Thiết bị soi lưu lượng mã hoá có <strong>chứng chỉ đã hết hạn</strong> — hết hạn khoảng mười tháng trước đó — nên nó lặng lẽ ngừng soi. Khi chứng chỉ được thay, lưu lượng đáng ngờ bị phát hiện ngay. Không ai xoá log cả; nguồn log chỉ đơn giản là im lặng, và không ai được báo rằng nó đã im lặng.</p>
${nguon('📘', 'U.S. GAO — GAO-18-559: Data Protection — Actions Taken by Equifax and Federal Agencies', '76 ngày không bị phát hiện; chứng chỉ hết hạn trên thiết bị soi lưu lượng', 'https://www.gao.gov/products/gao-18-559')}
${nguon('📘', 'MITRE ATT&CK — T1685.006 Clear Linux or Mac System Logs · T1070.003 Clear Command History', 'v19.2 (số cũ T1070.002)', 'https://attack.mitre.org/techniques/T1685/006/')}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Kẻ tấn công có root và đã dọn auth.log. Làm sao vẫn biết chuyện gì xảy ra?" — bản trung tâm, cặp mồ côi, khoảng lặng, siêu dữ liệu tệp, nguồn khác.</li>
<li>"Event ID 1102 ghi gì và vì sao kẻ tấn công không tránh được?" — log Security bị xoá, ghi vào log mới kèm người làm.</li>
<li>"Cảnh báo rẻ nhất lẽ ra đã giúp Equifax là gì?" — cảnh báo im lặng/nhịp tim cho từng nguồn.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Khi có sự cố, việc kỹ thuật đầu tiên của bạn là <strong>giữ nguyên</strong>: chép log ra khỏi máy (và tính hash) trước khi khởi động lại hay "sửa". Ghi lại lệnh nào bạn đã chạy và lúc nào (Bài 16.4, chuỗi lưu giữ bằng chứng). Ở công ty outsourcing, nhiều khi người vận hành của khách đã "dọn" máy trước khi bạn được gọi — hỏi ngay: log có gửi về đâu không, ai đã đăng nhập vào máy từ lúc phát hiện.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<ol>
<li>Tìm mọi dòng <code>sudo … COMMAND=</code> ở máy chủ log mà không có dòng tương ứng trên web01.</li>
<li>Viết kiểm tra im lặng cho <code>audit.log</code>: in mọi khoảng trống dài hơn 65 phút (cron sinh một bản ghi mỗi giờ).</li>
<li>Trên máy ảo: <code>stat /var/log/auth.log</code>, chạy <code>sudo sed -i '$d' /var/log/auth.log</code>, <code>stat</code> lần nữa — cái gì đổi (inode, birth)? rsyslog giờ ghi vào đâu (có tiếp tục ghi vào inode cũ đã bị xoá cho tới khi nhận HUP không)?</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Bản ghi mồ côi', 'Một nửa của cặp lẽ ra luôn đi cùng nhau.'],
  ['Khoảng trống / im lặng', 'Một quãng không có bản ghi nào từ nguồn vốn luôn ghi.'],
  ['Thời điểm sinh (%w)', 'Lúc tệp (inode) được tạo; log bị viết lại có thời điểm sinh mới.'],
  ['1102 / 104', 'Log Security bị xoá / log khác bị xoá (ghi trong System).'],
  ['Chỉ ghi thêm (append-only)', 'Nơi lưu chỉ cho thêm dữ liệu, không cho sửa hay xoá.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xoá để lại lỗ: so với bản đã gửi, tìm mồ côi, khoảng lặng, siêu dữ liệu tệp.</li>
<li>Gửi log đi ngay và cảnh báo khi im lặng.</li>
<li>Xoá log thường là màn mở đầu, không phải kết thúc — đọc tiếp xem sau đó là gì.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-3-xoa-log-chinh-sach', title: 'Bài 4.3 — Can thiệp log: 1102/104/4719', sub: 'Phía Windows chi tiết', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-16-4-toan-ven-quyen', title: 'Bài 16.4 — Toàn vẹn và quyền', sub: 'Chỉ ghi thêm, băm, tách quyền', cta: 'Mở bài' })}
</div>
`,
};
