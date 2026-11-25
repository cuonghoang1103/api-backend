/**
 * 14.6 — MITRE ATT&CK (soạn 24/11/2026, agent lgz). Output thật: OUT['s14/attack'] — bảng _demo/s14/mau/attack-vu14.tsv (19 bước vụ web01) kiểm độ phủ bằng grep trên vu14.
 * Kiểm attack.mitre.org 24/11/2026: phiên bản v19.2; 15 chiến thuật (Defense Evasion cũ tách thành Stealth + Defense Impairment); T1562.012 → T1685.004, T1070.002 → T1685.006;
 * trang T1136.001 → Detection Strategy DET0447 → Analytic AN1236 (Linux): Log Sources DC0014 User Account Creation / auditd:SYSCALL "useradd or adduser executed", DC0061 File Modification; Mutable Elements BinaryPath, ExecutionSource.
 * Số tất định: 17/19 bước CÓ log (598, 2, 74, 1…, kworkerd/dbus-sync 111, webshell 5), 2 bước KHÔNG (T1685.006, T1070.003) — bằng chứng thay thế 2 dòng stat.txt; chiến thuật: Persistence 6, Stealth 3, Defense Impairment 3, …
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '14.6 — Mapping what you see to MITRE ATT&CK: tactic, technique, data sources|||14.6 — Gắn những gì thấy vào MITRE ATT&CK: tactic, technique, nguồn dữ liệu',
  slug: 'log-14-6-mitre-attack',
  type: 'LESSON',
  isFreePreview: true,
  description: 'ATT&CK là "từ điển chung" của nghề phòng thủ: chiến thuật (vì sao), kỹ thuật (bằng cách nào), kỹ thuật con và quy trình cụ thể. Bài này đọc một trang kỹ thuật thật của phiên bản v19.2 (T1136.001 → Detection Strategy DET0447 → Analytic AN1236 → bảng Log Sources: auditd:SYSCALL), lưu ý các thay đổi mới (Defense Evasion tách thành Stealth và Defense Impairment, T1070.002 thành T1685.006), gắn 19 bước của vụ web01 vào 8 chiến thuật — rồi dùng chính bảng đó để hỏi câu quan trọng nhất: "mình CÓ log để thấy bước này không?". Kết quả chạy thật: 17/19 có, 2 bước chỉ suy ra được từ siêu dữ liệu tệp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.6</span>
<h2>A shared vocabulary, and a checklist of blind spots</h2>
<p class="lead">MITRE ATT&amp;CK (Adversarial Tactics, Techniques and Common Knowledge — started inside MITRE in 2013, public since 2015) is a catalogue of what real attackers have been observed doing. It gives everyone the same words: when you write "T1110.003" in a report, every analyst, tool and customer knows you mean password spraying. For a log reader it is also something more practical: a list of behaviours you should be able to <em>see</em>.</p>

<h3>The everyday picture</h3>
<p>A medical code book (ICD). Doctors in different hospitals describe the same illness with the same code, and an insurer can ask "which of these codes can your hospital actually diagnose?". ATT&amp;CK is that book for attacks — and the second question is the one that matters for logs.</p>

<h3>Step 1 — the four levels</h3>
${kv([
  ['Tactic — WHY', 'The attacker\'s goal at that step: Initial Access, Persistence, Privilege Escalation, Credential Access, Exfiltration… (15 in Enterprise v19.2).'],
  ['Technique — HOW', 'A way to reach that goal: T1110 Brute Force, T1053 Scheduled Task/Job…'],
  ['Sub-technique', 'A specific variant: T1110.003 Password Spraying, T1053.003 Cron.'],
  ['Procedure', 'What one actor/tool actually did: "sprayed 25 names, 3 rounds, 17 minutes apart from 203.0.113.77".'],
])}
<div class="pitfall co-tieu-de"><p><strong>ATT&amp;CK changes.</strong> Checked on 24/11/2026, the current version is <strong>v19.2</strong>. Recent versions split the old "Defense Evasion" tactic into <strong>Stealth</strong> and <strong>Defense Impairment</strong>, and renumbered several techniques: Clear Linux or Mac System Logs T1070.002 → <strong>T1685.006</strong>, Clear Windows Event Logs T1070.001 → T1685.005, Disable or Modify Linux Audit System T1562.012 → <strong>T1685.004</strong>. Old links redirect — but reports and SIEM rules written with old numbers need updating. Always check the site, not memory (or an old blog post).</p></div>

<h3>Step 2 — reading one technique page</h3>
<p>Open <a href="https://attack.mitre.org/techniques/T1136/001/" target="_blank" rel="noopener">T1136.001 Create Account: Local Account</a>. Read in this order: <em>Description</em> (what it is), <em>Procedure Examples</em> (who used it), <em>Mitigations</em>, and <em>Detection Strategies</em>. Since v18 detection is no longer a loose "Data Sources" list: each technique links to a <strong>Detection Strategy</strong> (here DET0447), which has one <strong>Analytic</strong> per platform. The Linux analytic AN1236 says, word for word:</p>
<pre><code class="language-text">AN1236 — Local user accounts are created via binaries like 'useradd', 'adduser', or by editing passwd/shadow.
Log Sources:
  Data Component                      Name            Channel
  User Account Creation (DC0014)      auditd:SYSCALL  useradd or adduser executed
  File Modification (DC0061)          auditd:SYSCALL  write operation on /etc/passwd or /etc/shadow
Mutable Elements: BinaryPath (may be scripted via shell, cron, remote shells) · ExecutionSource (flag if issued from sshd sessions)</code></pre>
<p>That is a direct instruction for this course: "to see T1136.001 on Linux you need auditd recording useradd and writes to /etc/passwd". Compare with what web01 had (14.3): auth.log had the useradd line, auditd had ADD_USER — covered.</p>

<h3>Step 3 — the web01 incident, mapped and checked</h3>
<p>Each row: step, technique, tactic, which file should show it, and a grep pattern. The loop counts matches — "CÓ n" (yes, n lines) or "KHÔNG" (no):</p>
<details><summary><strong>attack-vu14.tsv</strong></summary>
${ma('text', 's14/mau/attack-vu14.tsv')}
</details>
${lenh('s14/attack', 0)}
${lenh('s14/attack', 1)}
${lenh('s14/attack', 2)}
<p>Seventeen steps have log lines. Two do not: rewriting auth.log and silencing bash history leave no log line by nature; you only infer them from file metadata. Ask the "what if" questions too: without the log server, steps 3–7 would also be KHÔNG (they were deleted locally); without the auditd rules, 8–11 would be KHÔNG. That is how ATT&amp;CK turns into a logging backlog.</p>

<h3>Step 4 — coverage as a habit</h3>
<ol>
<li>List the techniques that matter for <em>your</em> systems (a web app on Linux VPS ≠ a Windows domain).</li>
<li>For each, read the analytic's Log Sources and check: is that log enabled, collected, kept long enough (Chapter 16)?</li>
<li>Colour the result in <strong>ATT&amp;CK Navigator</strong> (green = logged and alerted, yellow = logged only, red = blind). Review after every incident.</li>
</ol>

<h3>🛡️ Attacker's corner</h3>
<p>Red teams use the same catalogue in reverse: tools like Atomic Red Team ship one small test per technique, so defenders can run "T1053.003" in a lab and check whether their logs and alerts fire. Doing that is exactly how Lab 18.6 builds its own scenario.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Tactic vs technique?" — why vs how; one technique can serve several tactics (cron = Execution, Persistence, Privilege Escalation).</li>
<li>"How would you use ATT&amp;CK to improve logging?" — map techniques to required log sources, find gaps, prioritise.</li>
<li>"What changed in ATT&amp;CK recently?" — Defense Evasion split into Stealth/Defense Impairment; Detection Strategies and Analytics replaced the old data-source lists; several renumbered techniques.</li>
</ul>

<h3>At work</h3>
<p>Customers (especially Japanese and European enterprises) increasingly ask outsourcing vendors for incident reports "with ATT&amp;CK mapping". Put the technique ID next to each timeline row — and check the number on the site the day you write it.</p>

<h3>🧪 Practice (30 min)</h3>
<ol>
<li>Map the Windows samples of 14.3 (jump01, fs01, fs02, the Run key) to techniques and tactics. Which tactic appears most?</li>
<li>Open the Detection Strategy of T1053.003 (Cron). What log source does its Linux analytic name? Did web01 have it?</li>
<li>Add two rows to attack-vu14.tsv for T1078 on the web (lan@, hoa@) and T1083 (ls of exports via webshell) and rerun the loop.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['ATT&CK', 'MITRE\'s public knowledge base of adversary tactics and techniques.'],
  ['Detection Strategy / Analytic', 'Since v18: how to detect a technique, per platform, with required log sources.'],
  ['Data Component', 'A specific kind of telemetry, e.g. DC0014 User Account Creation.'],
  ['Coverage', 'Which techniques you can see (logged) and alert on.'],
  ['Navigator', 'Web tool to colour techniques in layers (coverage, threat intel).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Use ATT&amp;CK IDs in reports; check numbers against v19.2+ on the site.</li>
<li>Each analytic tells you which log you need — that is your logging checklist.</li>
<li>Map every incident and ask "what would we have missed without X?".</li>
</ul>
${nguon('📘', 'MITRE ATT&CK — Enterprise matrix (v19.2)', '15 tactics, techniques, detection strategies', 'https://attack.mitre.org/')}
${nguon('📘', 'MITRE ATT&CK — DET0447 Local Account Creation Across Platforms', 'Analytics AN1235–AN1240 and their log sources', 'https://attack.mitre.org/detectionstrategies/DET0447/')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-4-1-attack', title: 'Blue Team course › 4.1 ATT&CK in depth', sub: 'Tactics, techniques, Navigator, coverage', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.6</span>
<h2>Một bộ từ vựng chung, và một danh sách điểm mù</h2>
<p class="lead">MITRE ATT&amp;CK (Adversarial Tactics, Techniques and Common Knowledge — bắt đầu trong nội bộ MITRE năm 2013, công khai từ 2015) là danh mục những gì kẻ tấn công thật đã được quan sát làm. Nó cho mọi người cùng một bộ từ: khi bạn viết "T1110.003" trong báo cáo, mọi người phân tích, mọi công cụ và khách hàng đều hiểu đó là password spraying. Với người đọc log, nó còn thực tế hơn: một danh sách hành vi mà bạn phải <em>nhìn thấy được</em>.</p>

<h3>Liên tưởng đời thường</h3>
<p>Bộ mã bệnh quốc tế (ICD). Bác sĩ ở các bệnh viện khác nhau mô tả cùng một bệnh bằng cùng một mã, và bên bảo hiểm có thể hỏi "bệnh viện của anh thật sự chẩn đoán được những mã nào?". ATT&amp;CK là cuốn sách đó cho tấn công — và câu hỏi thứ hai mới là câu quan trọng với log.</p>

<h3>Bước 1 — bốn tầng</h3>
${kv([
  ['Tactic (chiến thuật) — VÌ SAO', 'Mục tiêu của kẻ tấn công ở bước đó: Initial Access, Persistence, Privilege Escalation, Credential Access, Exfiltration… (15 chiến thuật trong Enterprise v19.2).'],
  ['Technique (kỹ thuật) — BẰNG CÁCH NÀO', 'Một cách đạt mục tiêu: T1110 Brute Force, T1053 Scheduled Task/Job…'],
  ['Sub-technique (kỹ thuật con)', 'Một biến thể cụ thể: T1110.003 Password Spraying, T1053.003 Cron.'],
  ['Procedure (quy trình)', 'Điều một nhóm/công cụ thật sự đã làm: "rải 25 tên, 3 đợt cách nhau 17 phút từ 203.0.113.77".'],
])}
<div class="pitfall co-tieu-de"><p><strong>ATT&amp;CK thay đổi.</strong> Kiểm ngày 24/11/2026, phiên bản hiện hành là <strong>v19.2</strong>. Các bản gần đây đã tách chiến thuật "Defense Evasion" cũ thành <strong>Stealth</strong> (ẩn mình) và <strong>Defense Impairment</strong> (làm hỏng phòng thủ), và đánh số lại nhiều kỹ thuật: Clear Linux or Mac System Logs T1070.002 → <strong>T1685.006</strong>, Clear Windows Event Logs T1070.001 → T1685.005, Disable or Modify Linux Audit System T1562.012 → <strong>T1685.004</strong>. Liên kết cũ tự chuyển hướng — nhưng báo cáo và quy tắc SIEM viết bằng số cũ cần cập nhật. Luôn kiểm trên trang, đừng tin trí nhớ (hay một bài blog cũ).</p></div>

<h3>Bước 2 — đọc một trang kỹ thuật</h3>
<p>Mở <a href="https://attack.mitre.org/techniques/T1136/001/" target="_blank" rel="noopener">T1136.001 Create Account: Local Account</a>. Đọc theo thứ tự: <em>Description</em> (nó là gì), <em>Procedure Examples</em> (ai đã dùng), <em>Mitigations</em> (giảm thiểu), và <em>Detection Strategies</em>. Từ v18, phần phát hiện không còn là danh sách "Data Sources" rời rạc: mỗi kỹ thuật trỏ tới một <strong>Detection Strategy</strong> (ở đây DET0447), trong đó có một <strong>Analytic</strong> cho mỗi nền tảng. Analytic Linux AN1236 viết nguyên văn:</p>
<pre><code class="language-text">AN1236 — Local user accounts are created via binaries like 'useradd', 'adduser', or by editing passwd/shadow.
Log Sources:
  Data Component                      Name            Channel
  User Account Creation (DC0014)      auditd:SYSCALL  useradd or adduser executed
  File Modification (DC0061)          auditd:SYSCALL  write operation on /etc/passwd or /etc/shadow
Mutable Elements: BinaryPath (may be scripted via shell, cron, remote shells) · ExecutionSource (flag if issued from sshd sessions)</code></pre>
<p>Đó là một chỉ dẫn trực tiếp cho khoá này: "muốn thấy T1136.001 trên Linux thì cần auditd ghi việc chạy useradd và việc ghi vào /etc/passwd". So với web01 (14.3): auth.log có dòng useradd, auditd có ADD_USER — đã phủ.</p>

<h3>Bước 3 — vụ web01, gắn nhãn và kiểm</h3>
<p>Mỗi hàng: bước, kỹ thuật, chiến thuật, tệp lẽ ra phải thấy nó, và một mẫu grep. Vòng lặp đếm số dòng khớp — "CÓ n" hoặc "KHÔNG":</p>
<details><summary><strong>attack-vu14.tsv</strong></summary>
${ma('text', 's14/mau/attack-vu14.tsv')}
</details>
${lenh('s14/attack', 0)}
${lenh('s14/attack', 1)}
${lenh('s14/attack', 2)}
<p>Mười bảy bước có dòng log. Hai bước không có: viết lại auth.log và làm câm lịch sử bash tự bản chất không để lại dòng log nào; bạn chỉ suy ra được từ siêu dữ liệu tệp. Hỏi thêm các câu "nếu như": không có máy chủ log thì bước 3–7 cũng thành KHÔNG (đã bị xoá ở máy); không có luật auditd thì 8–11 thành KHÔNG. Đó là cách ATT&amp;CK biến thành danh sách việc cần làm cho phần ghi log.</p>

<h3>Bước 4 — độ phủ thành thói quen</h3>
<ol>
<li>Liệt kê các kỹ thuật quan trọng với <em>hệ thống của bạn</em> (ứng dụng web trên VPS Linux ≠ một domain Windows).</li>
<li>Với mỗi kỹ thuật, đọc Log Sources của analytic và kiểm: log đó đã bật chưa, đã gom về chưa, giữ đủ lâu chưa (Chương 16)?</li>
<li>Tô màu kết quả trong <strong>ATT&amp;CK Navigator</strong> (xanh = có log và có cảnh báo, vàng = chỉ có log, đỏ = mù). Xem lại sau mỗi sự cố.</li>
</ol>

<h3>🛡️ Góc hacker</h3>
<p>Đội red team dùng cùng danh mục theo chiều ngược lại: công cụ như Atomic Red Team có sẵn một bài thử nhỏ cho mỗi kỹ thuật, để người phòng thủ chạy "T1053.003" trong lab và kiểm log và cảnh báo của mình có bắt được không. Bài 18.6 dựng kịch bản riêng theo đúng cách đó.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Tactic khác technique thế nào?" — vì sao và bằng cách nào; một kỹ thuật có thể phục vụ nhiều chiến thuật (cron = Execution, Persistence, Privilege Escalation).</li>
<li>"Bạn dùng ATT&amp;CK để cải thiện việc ghi log thế nào?" — gắn kỹ thuật với nguồn log cần có, tìm chỗ thiếu, xếp ưu tiên.</li>
<li>"ATT&amp;CK gần đây thay đổi gì?" — Defense Evasion tách thành Stealth/Defense Impairment; Detection Strategy và Analytic thay danh sách data source cũ; nhiều kỹ thuật đổi số.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Khách hàng (nhất là doanh nghiệp Nhật và châu Âu) ngày càng yêu cầu bên outsourcing nộp báo cáo sự cố "kèm gắn ATT&amp;CK". Ghi mã kỹ thuật cạnh từng hàng của dòng thời gian — và kiểm số trên trang vào đúng ngày bạn viết.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<ol>
<li>Gắn các mẫu Windows ở Bài 14.3 (jump01, fs01, fs02, khoá Run) vào kỹ thuật và chiến thuật. Chiến thuật nào xuất hiện nhiều nhất?</li>
<li>Mở Detection Strategy của T1053.003 (Cron). Analytic Linux của nó nêu nguồn log nào? web01 có nguồn đó không?</li>
<li>Thêm hai hàng vào attack-vu14.tsv cho T1078 phía web (lan@, hoa@) và T1083 (ls thư mục exports qua webshell) rồi chạy lại vòng lặp.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['ATT&CK', 'Kho tri thức công khai của MITRE về chiến thuật và kỹ thuật của kẻ tấn công.'],
  ['Detection Strategy / Analytic', 'Từ v18: cách phát hiện một kỹ thuật, theo từng nền tảng, kèm nguồn log cần có.'],
  ['Data Component', 'Một loại dữ liệu đo cụ thể, ví dụ DC0014 User Account Creation.'],
  ['Độ phủ (coverage)', 'Những kỹ thuật bạn thấy được (có log) và cảnh báo được.'],
  ['Navigator', 'Công cụ web tô màu các kỹ thuật theo lớp (độ phủ, tình báo mối đe doạ).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dùng mã ATT&amp;CK trong báo cáo; kiểm số theo v19.2 trở lên trên trang.</li>
<li>Mỗi analytic cho biết bạn cần log nào — đó là danh sách kiểm cho việc ghi log.</li>
<li>Gắn nhãn mọi sự cố và hỏi "không có X thì mình đã bỏ sót gì?".</li>
</ul>
${nguon('📘', 'MITRE ATT&CK — ma trận Enterprise (v19.2)', '15 chiến thuật, kỹ thuật, chiến lược phát hiện', 'https://attack.mitre.org/')}
${nguon('📘', 'MITRE ATT&CK — DET0447 Local Account Creation Across Platforms', 'Analytic AN1235–AN1240 và nguồn log của chúng', 'https://attack.mitre.org/detectionstrategies/DET0447/')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-4-1-attack', title: 'Khoá Blue Team › 4.1 ATT&CK chuyên sâu', sub: 'Chiến thuật, kỹ thuật, Navigator, độ phủ', cta: 'Mở bài' })}
</div>
`,
};
