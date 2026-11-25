/**
 * 16.5 — Nếp kiểm log hằng ngày và hằng tuần (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s16/nep'] (máy may16: bao-cao-sang.sh chạy hai lần cách 1 phút sau khi gay-su-kien.sh tạo sự kiện thật — SSH sai mật khẩu qua sshd thật,
 * sudo sai, dịch vụ shop-mail hỏng, nginx 502 và quét 404; timer systemd 07:30). Số trong lời: 3 → 12 SSH sai, 2 → 8 lần 5xx, 1 dịch vụ hỏng, 7 dòng warning (6 ssh + 1 init.scope).
 * "đĩa 95 %" là đĩa thật của máy chạy container (dùng chung) — ghi rõ trong bài.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'A 10-minute daily and weekly log review routine for your own machines and servers|||Nếp kiểm log 10 phút mỗi ngày và mỗi tuần cho máy và máy chủ của chính bạn',
  slug: 'log-16-5-nep-hang-ngay',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Danh sách kiểm 10 phút mỗi sáng cho Linux (đăng nhập, sudo, tài khoản, dịch vụ hỏng, cảnh báo journal, OOM/đĩa, dung lượng log), web (5xx, kẻ quét) và Windows (4625, 4624 kiểu 10, 4720/4732, 1102, 7034, 41/6008), cộng danh sách mỗi tuần. Tự động hoá thành bao-cao-sang.sh chạy thật trên máy chủ lab: số đếm + dòng bằng chứng, lưu lại để so "hôm nay khác gì lần trước" (SSH sai 3 → 12, 5xx 2 → 8), chạy bằng timer systemd 07:30. Bẫy thật: lỗi stderr của dịch vụ là mức info nên không lọt vào -p err. Ghi sổ "bình thường" để thấy cái lạ — đây là phần "toàn quyền kiểm soát hệ thống".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.5</span>
<h2>Ten minutes every morning</h2>
<p class="lead">Alerts (Chapter 15) catch what you predicted. A short daily look catches what you did not: a new user account, a service that has been failing quietly for three days, a disk creeping to 95 %. This lesson gives the checklist, then turns it into a script that runs itself at 07:30 and tells you only what changed.</p>

<h3>The everyday picture: the pilot's walk-around</h3>
<p>Before every flight, even after thousands, a pilot walks around the plane and checks the same items in the same order. Not because something is usually wrong — because the routine makes the unusual jump out. Ten minutes, the same order, every day.</p>

<h3>The daily checklist (Linux server)</h3>
<table>
<thead><tr><th>#</th><th>Question</th><th>Where (lesson)</th><th>Suspicious when</th></tr></thead>
<tbody>
<tr><td>1</td><td>Failed SSH logins — how many, from which IPs?</td><td><code>journalctl _COMM=sshd</code> (8.3)</td><td>a jump, a new country, a valid user name</td></tr>
<tr><td>2</td><td>Successful logins — who, from where?</td><td><code>Accepted</code>, <code>last</code> (8.3)</td><td>any login you cannot explain</td></tr>
<tr><td>3</td><td>sudo — failures and commands</td><td><code>_COMM=sudo</code> (8.3)</td><td>reading <code>/etc/shadow</code>, new users running sudo</td></tr>
<tr><td>4</td><td>Account and group changes</td><td><code>useradd/usermod/passwd</code>, auditd (8.4)</td><td>any change not in a ticket</td></tr>
<tr><td>5</td><td>Failed services</td><td><code>systemctl --failed</code> (7.2)</td><td>anything listed</td></tr>
<tr><td>6</td><td>Warnings and errors by unit</td><td><code>journalctl -p warning</code> (7.2)</td><td>a unit that was quiet yesterday</td></tr>
<tr><td>7</td><td>Kernel: OOM, disk I/O errors, read-only remount</td><td><code>journalctl -k</code> (7.5)</td><td>any line</td></tr>
<tr><td>8</td><td>Disk usage and log volume</td><td><code>df</code>, <code>du /var/log</code> (16.2)</td><td>&gt; 85 %, or log volume ×3</td></tr>
<tr><td>9</td><td>Web: 5xx by endpoint, scanners</td><td>nginx access log (10.2, 10.9)</td><td>new 5xx endpoint, a scanner that got 200s</td></tr>
<tr><td>10</td><td>Did the logs themselves arrive?</td><td>central store (15.5)</td><td>a source silent since yesterday</td></tr>
</tbody>
</table>
<p><strong>Windows PC/servers</strong> (Chapters 3–5; Lab 5 builds the PowerShell version): 4625 failed logons, 4624 logon type 10 (RDP) and 3 from unknown IPs, 4720/4732 new user / added to Administrators, 4740 lockouts, 1102 Security log cleared, 7034/7036 services crashing, 41/6008 unexpected shutdowns, 1000/1001 application crashes, Defender detections.</p>

<h3>Turn it into a script</h3>
${ma('bash', 's16/nep/bao-cao-sang.sh')}
<p>Design choices: every item is <strong>one number plus a few lines of evidence</strong>; numbers are saved to <code>/var/lib/bao-cao/</code> so the last block can say what changed; the script only reads. Set it up on the lab server and create a problem to read about:</p>
${lenh('s16/nep', 0)}
${lenh('s16/nep', 1)}
${lenh('s16/nep', 2)}
<p>The first run only stored the counts. A minute later, after more real events (wrong SSH passwords against the real sshd, a wrong sudo password, failing payments, a scanner):</p>
${lenh('s16/nep', 3)}
<p>How to read it in under a minute:</p>
<ul>
<li><strong>The "changed" block first</strong>: failed SSH 3 → 12, 5xx 2 → 8. Both need a look; everything else is as before.</li>
<li><strong>Evidence lines</strong>: all failures from one IP (here the lab itself); the 502s all on <code>/api/thanh-toan</code> — the payment gateway, not the whole site; <code>an</code> ran <code>cat /etc/shadow</code> with sudo — legitimate or not, someone must know why.</li>
<li><strong>A trap the output shows</strong>: <code>shop-mail.service</code> is failed, but its own error message ("cannot connect to SMTP") is <em>not</em> among the warnings: a service's stderr is logged at priority <em>info</em> by default (<code>SyslogLevel=</code>), so <code>-p err</code> never sees it. Only systemd's own "Failed with result" line counts. That is why item 5 asks systemd directly, and why apps should log real levels (Chapter 10).</li>
<li><strong>Disk 95 % ⚠</strong>: the container shares the real disk of the machine below it, so this number is real — exactly what the routine is for.</li>
</ul>

<h3>Run it every morning</h3>
${ma('ini', 's16/nep/bao-cao-sang.timer')}
${lenh('s16/nep', 4)}
${lenh('s16/nep', 5)}
<p><code>Persistent=true</code> runs a missed 07:30 as soon as the machine is up. The output is in the journal (<code>journalctl -u bao-cao-sang</code>); add one line at the end of the script to push it to your phone (ntfy or Telegram, lesson 15.5): <code>curl -s -d @- ntfy.example/bao-cao-may16</code>. Several servers: run it on each and read them in the central store, or write the same queries in LogQL once.</p>

<h3>The weekly checklist (30 minutes)</h3>
<ol>
<li>Trends: top 5 error messages this week vs last week; any new one?</li>
<li>Log volume per source (16.2) and disk forecast.</li>
<li>Retention actually deleted old data (16.1): oldest file/index date is what the policy says.</li>
<li>Trigger one alert on purpose and see it arrive (15.5).</li>
<li>Who has access to logs and to the log platform (16.4) — remove leavers.</li>
<li>Scan a day of logs for secrets (gitleaks + local rules, 16.3).</li>
<li>Restore one archived day from cold storage and grep it — an archive you have never read back is a hope, not a backup.</li>
</ol>

<h3>Keep a notebook of "normal"</h3>
<p>The routine works because you learn what normal looks like: "about 300 failed SSH per day from scanners", "5xx below 10 a day", "the backup job warns every Sunday". Write these baselines down (a <code>BINH-THUONG.md</code> next to the script). Then the question each morning is not "is this bad?" but "is this different?" — that is what "full control of the system" means in practice.</p>

<h3>🛡️ Attacker's corner: quiet beats loud</h3>
<p>Careful intruders avoid triggering alerts: one login with a stolen password (no brute force), one new user named like a service account, one cron job. Each is a single line that no threshold catches — but items 2, 4 and the "changed" block of a daily routine do. The Uber breach of September 2022 began with a contractor's credentials and MFA fatigue — a "successful login" problem, not a "failed login" one.</p>

<h3>Real-world situations</h3>
<ul>
<li><strong>OJT week 1</strong>: you are given read access to a staging server. Run the checklist and write down five "normal" baselines — a great first message to your mentor.</li>
<li><strong>Your own VPS / student project</strong>: install the timer and read the report with your morning coffee for a month.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>bao-cao-sang.sh</code> on your VM. Which item is empty because the source does not exist there?</li>
<li>Add item 11: number of distinct IPs that requested <code>/.env</code> or <code>/.git/</code>.</li>
<li>Make the script exit with code 1 when anything is above a threshold, so the timer shows "failed" when it needs you.</li>
</ol>
<p><strong>Pass:</strong> (1) e.g. nginx on a VM without a web server, or OOM in a container; (2) <code>awk '$7 ~ /^\\/(\\.env|\\.git)/ {print $1}' "$A" | sort -u | wc -l</code>; (3) a variable <code>CAN_XEM=1</code> set by any threshold and <code>exit $CAN_XEM</code> at the end — <code>systemctl --failed</code> then lists the report service itself, and item 5 of tomorrow's report catches it.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Baseline', 'What "normal" looks like for a system, written down.'],
  ['Morning report', 'Scheduled summary: numbers + evidence + what changed.'],
  ['systemd timer', 'Scheduled unit; Persistent=true runs missed runs at boot.'],
  ['SyslogLevel', 'Default priority systemd gives to a service\'s stdout/stderr (info).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Same ten questions, same order, ten minutes.</li>
<li>Automate: numbers + evidence + diff vs the previous run, at 07:30.</li>
<li>Ask systemd for failed services; stderr of a service is not "err".</li>
<li>Weekly: trends, volume, retention, alert test, access review, secret scan, restore test.</li>
<li>Write down normal; look for different.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.5</span>
<h2>Mười phút mỗi sáng</h2>
<p class="lead">Cảnh báo (Chương 15) bắt được những gì bạn đã đoán trước. Một lần nhìn ngắn mỗi ngày bắt được những gì bạn không đoán: một tài khoản mới, một dịch vụ âm thầm hỏng ba ngày, một ổ đĩa bò dần lên 95 %. Bài này đưa danh sách kiểm, rồi biến nó thành script tự chạy lúc 07:30 và chỉ báo cho bạn cái gì đã thay đổi.</p>

<h3>Liên tưởng đời thường: phi công đi một vòng quanh máy bay</h3>
<p>Trước mỗi chuyến bay, dù đã bay hàng nghìn lần, phi công vẫn đi một vòng quanh máy bay và kiểm đúng những mục ấy theo đúng thứ tự ấy. Không phải vì thường có gì hỏng — mà vì nếp quen làm cho điều bất thường nổi bật lên. Mười phút, cùng một thứ tự, mỗi ngày.</p>

<h3>Danh sách kiểm hằng ngày (máy chủ Linux)</h3>
<table>
<thead><tr><th>#</th><th>Câu hỏi</th><th>Xem ở đâu (bài)</th><th>Đáng ngờ khi</th></tr></thead>
<tbody>
<tr><td>1</td><td>SSH đăng nhập sai — bao nhiêu, từ IP nào?</td><td><code>journalctl _COMM=sshd</code> (8.3)</td><td>tăng vọt, quốc gia mới, tên người dùng có thật</td></tr>
<tr><td>2</td><td>Đăng nhập thành công — ai, từ đâu?</td><td><code>Accepted</code>, <code>last</code> (8.3)</td><td>bất kỳ lần nào bạn không giải thích được</td></tr>
<tr><td>3</td><td>sudo — lần sai và lệnh đã chạy</td><td><code>_COMM=sudo</code> (8.3)</td><td>đọc <code>/etc/shadow</code>, người dùng mới chạy sudo</td></tr>
<tr><td>4</td><td>Đổi tài khoản và nhóm</td><td><code>useradd/usermod/passwd</code>, auditd (8.4)</td><td>thay đổi nào không có ticket</td></tr>
<tr><td>5</td><td>Dịch vụ hỏng</td><td><code>systemctl --failed</code> (7.2)</td><td>có bất cứ thứ gì trong danh sách</td></tr>
<tr><td>6</td><td>Cảnh báo và lỗi theo unit</td><td><code>journalctl -p warning</code> (7.2)</td><td>một unit hôm qua còn im lặng</td></tr>
<tr><td>7</td><td>Nhân: OOM, lỗi I/O đĩa, remount chỉ đọc</td><td><code>journalctl -k</code> (7.5)</td><td>có bất kỳ dòng nào</td></tr>
<tr><td>8</td><td>Dung lượng đĩa và lượng log</td><td><code>df</code>, <code>du /var/log</code> (16.2)</td><td>&gt; 85 %, hoặc lượng log ×3</td></tr>
<tr><td>9</td><td>Web: 5xx theo endpoint, kẻ quét</td><td>access log nginx (10.2, 10.9)</td><td>endpoint 5xx mới, kẻ quét nhận được mã 200</td></tr>
<tr><td>10</td><td>Bản thân log có về đủ không?</td><td>kho trung tâm (15.5)</td><td>một nguồn im lặng từ hôm qua</td></tr>
</tbody>
</table>
<p><strong>Máy/máy chủ Windows</strong> (Chương 3–5; Lab 5 dựng bản PowerShell): 4625 đăng nhập thất bại, 4624 kiểu 10 (RDP) và kiểu 3 từ IP lạ, 4720/4732 người dùng mới / được thêm vào Administrators, 4740 khoá tài khoản, 1102 log Security bị xoá, 7034/7036 dịch vụ chết, 41/6008 tắt máy bất thường, 1000/1001 ứng dụng sập, phát hiện của Defender.</p>

<h3>Biến nó thành script</h3>
${ma('bash', 's16/nep/bao-cao-sang.sh')}
<p>Cách thiết kế: mỗi mục là <strong>một con số cộng vài dòng bằng chứng</strong>; số đếm được lưu vào <code>/var/lib/bao-cao/</code> để khối cuối nói được cái gì đã đổi; script chỉ đọc. Cài lên máy chủ lab và tạo ra một vấn đề để đọc:</p>
${lenh('s16/nep', 0)}
${lenh('s16/nep', 1)}
${lenh('s16/nep', 2)}
<p>Lần chạy đầu chỉ lưu số đếm. Một phút sau, sau thêm các sự kiện thật (gõ sai mật khẩu SSH vào sshd thật, gõ sai mật khẩu sudo, thanh toán lỗi, một kẻ quét):</p>
${lenh('s16/nep', 3)}
<p>Đọc trong chưa đầy một phút:</p>
<ul>
<li><strong>Đọc khối "khác lần trước" trước</strong>: SSH sai 3 → 12, 5xx 2 → 8. Cả hai cần xem; mọi thứ khác như cũ.</li>
<li><strong>Dòng bằng chứng</strong>: mọi lần sai đến từ một IP (ở đây chính là máy lab); 502 dồn hết vào <code>/api/thanh-toan</code> — cổng thanh toán, không phải cả trang; <code>an</code> đã chạy <code>cat /etc/shadow</code> bằng sudo — hợp lệ hay không, phải có người biết vì sao.</li>
<li><strong>Một cái bẫy mà output cho thấy</strong>: <code>shop-mail.service</code> đang hỏng, nhưng chính thông điệp lỗi của nó ("không kết nối được SMTP") <em>không</em> nằm trong số cảnh báo: stderr của dịch vụ mặc định được ghi ở mức <em>info</em> (<code>SyslogLevel=</code>), nên <code>-p err</code> không bao giờ thấy. Chỉ dòng "Failed with result" của chính systemd được tính. Vì vậy mục 5 hỏi thẳng systemd, và ứng dụng phải ghi đúng mức (Chương 10).</li>
<li><strong>Đĩa 95 % ⚠</strong>: container dùng chung ổ đĩa thật của máy bên dưới, nên con số này là thật — đúng là thứ mà nếp kiểm sinh ra để bắt.</li>
</ul>

<h3>Cho nó chạy mỗi sáng</h3>
${ma('ini', 's16/nep/bao-cao-sang.timer')}
${lenh('s16/nep', 4)}
${lenh('s16/nep', 5)}
<p><code>Persistent=true</code> chạy bù lần 07:30 bị lỡ ngay khi máy bật lên. Kết quả nằm trong journal (<code>journalctl -u bao-cao-sang</code>); thêm một dòng cuối script để đẩy về điện thoại (ntfy hoặc Telegram, bài 15.5): <code>curl -s -d @- ntfy.example/bao-cao-may16</code>. Nhiều máy chủ: chạy trên từng máy và đọc trong kho trung tâm, hoặc viết cùng các câu hỏi đó bằng LogQL một lần.</p>

<h3>Danh sách kiểm hằng tuần (30 phút)</h3>
<ol>
<li>Xu hướng: 5 thông điệp lỗi nhiều nhất tuần này so với tuần trước; có cái nào mới?</li>
<li>Lượng log theo nguồn (16.2) và dự báo đĩa.</li>
<li>Thời gian lưu có thật sự xoá dữ liệu cũ (16.1): ngày của tệp/chỉ mục cũ nhất đúng như chính sách.</li>
<li>Cố ý gây một cảnh báo và xem nó tới (15.5).</li>
<li>Ai có quyền vào log và vào nền tảng log (16.4) — gỡ người đã nghỉ.</li>
<li>Quét một ngày log tìm bí mật (gitleaks + luật trong nước, 16.3).</li>
<li>Khôi phục một ngày đã lưu trữ ở tầng lạnh và grep thử — kho lưu trữ chưa từng đọc lại là một hy vọng, không phải bản sao lưu.</li>
</ol>

<h3>Giữ một cuốn sổ "bình thường"</h3>
<p>Nếp kiểm hiệu quả vì bạn học được bình thường trông thế nào: "khoảng 300 lần SSH sai mỗi ngày từ các máy quét", "5xx dưới 10 lần một ngày", "job sao lưu Chủ nhật nào cũng có cảnh báo". Ghi các mốc này lại (một tệp <code>BINH-THUONG.md</code> cạnh script). Khi đó câu hỏi mỗi sáng không còn là "cái này có tệ không?" mà là "cái này có khác không?" — "toàn quyền kiểm soát hệ thống" trong thực tế chính là vậy.</p>

<h3>🛡️ Góc hacker: lặng lẽ thắng ồn ào</h3>
<p>Kẻ đột nhập cẩn thận tránh kích hoạt cảnh báo: một lần đăng nhập bằng mật khẩu đánh cắp (không dò), một người dùng mới đặt tên giống tài khoản dịch vụ, một cron job. Mỗi thứ chỉ là một dòng mà không ngưỡng nào bắt được — nhưng mục 2, mục 4 và khối "khác lần trước" của nếp kiểm hằng ngày thì bắt được. Vụ Uber tháng 9/2022 bắt đầu bằng thông tin đăng nhập của một nhà thầu và chiêu dội thông báo MFA — một vấn đề "đăng nhập thành công", không phải "đăng nhập thất bại".</p>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Tuần đầu OJT</strong>: bạn được cấp quyền đọc một máy chủ staging. Chạy danh sách kiểm và ghi năm mốc "bình thường" — một tin nhắn đầu tiên rất tốt gửi mentor.</li>
<li><strong>VPS riêng / đồ án</strong>: cài timer và đọc báo cáo cùng ly cà phê sáng trong một tháng.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>bao-cao-sang.sh</code> trên máy ảo của bạn. Mục nào trống vì nguồn đó không có trên máy?</li>
<li>Thêm mục 11: số IP khác nhau đã gọi <code>/.env</code> hoặc <code>/.git/</code>.</li>
<li>Cho script thoát với mã 1 khi có mục vượt ngưỡng, để timer hiện "failed" khi nó cần bạn.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) vd nginx trên máy ảo không có web server, hoặc OOM trong container; (2) <code>awk '$7 ~ /^\\/(\\.env|\\.git)/ {print $1}' "$A" | sort -u | wc -l</code>; (3) một biến <code>CAN_XEM=1</code> được đặt bởi bất kỳ ngưỡng nào và <code>exit $CAN_XEM</code> ở cuối — khi đó <code>systemctl --failed</code> liệt kê chính dịch vụ báo cáo, và mục 5 của báo cáo hôm sau bắt được nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Mốc bình thường (baseline)', 'Hệ thống "bình thường" trông thế nào, được ghi lại.'],
  ['Báo cáo buổi sáng', 'Tóm tắt chạy theo lịch: con số + bằng chứng + cái đã đổi.'],
  ['systemd timer', 'Unit chạy theo lịch; Persistent=true chạy bù lần bị lỡ khi khởi động.'],
  ['SyslogLevel', 'Mức mặc định systemd gán cho stdout/stderr của dịch vụ (info).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mười câu hỏi, cùng thứ tự, mười phút.</li>
<li>Tự động hoá: con số + bằng chứng + so với lần trước, lúc 07:30.</li>
<li>Hỏi systemd về dịch vụ hỏng; stderr của dịch vụ không phải "err".</li>
<li>Hằng tuần: xu hướng, dung lượng, thời gian lưu, thử cảnh báo, rà quyền, quét bí mật, thử khôi phục.</li>
<li>Ghi lại bình thường; đi tìm cái khác thường.</li>
</ul>
${nguon('📘', 'man7.org — systemd.timer(5)', 'OnCalendar, Persistent', 'https://man7.org/linux/man-pages/man5/systemd.timer.5.html')}
${nguon('📘', 'man7.org — systemd.exec(5)', 'SyslogLevel=, StandardError=', 'https://man7.org/linux/man-pages/man5/systemd.exec.5.html')}
${nguon('🛡️', 'Help Net Security — Uber says Lapsus$ gang is behind the recent breach (20/9/2022)', 'Mật khẩu nhà thầu mua trên dark web + dội thông báo MFA, theo cập nhật của Uber', 'https://www.helpnetsecurity.com/2022/09/20/uber-data-breach-lapsus/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-9-1-loi-hua-danh-thuc', title: 'Observability 9.1 — Cảnh báo là lời hứa đánh thức ai đó', sub: 'Khi nào là cảnh báo, khi nào chỉ là báo cáo', cta: 'Mở bài' })}
</div>
`,
};
