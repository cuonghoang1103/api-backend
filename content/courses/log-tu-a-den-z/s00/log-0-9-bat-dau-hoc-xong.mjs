/**
 * Bắt đầu tại đây (2/2) — Học xong làm được gì, cần nền gì, lộ trình, học kèm khoá nào, cách học không ngợp (soạn 22/11/2026).
 * Không có lệnh/output mới (lệnh minh hoạ chỉ là tên lệnh, chạy thật ở các chương sau).
 */
import { nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Start here (2/2) — What you will be able to do, the roadmap, and how to learn without drowning|||Bắt đầu tại đây (2/2) — Học xong làm được gì, lộ trình, và cách học không bị ngợp',
  slug: 'log-0-9-bat-dau-hoc-xong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mười câu hỏi bạn sẽ tự trả lời được bằng log; cần nền gì trước (và không cần gì); log trong ba nghề backend, DevOps/SRE, SOC; lộ trình 19 phần, đường ngắn 2 tuần và đường đầy đủ; học kèm khoá nào (linux-bash, OS, observability, blue-team-siem); cách học không ngợp: sổ tay lệnh tự gõ, mỗi buổi một câu hỏi thật, tra mã sự kiện thay vì học thuộc.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>What you will be able to do, the roadmap, and how to learn without drowning</h2>
<p class="lead">Lesson 1 showed why logs matter. This one is practical: the questions you will be able to answer alone, what you need to know before starting (less than you fear), how logs show up in three jobs you might apply for, the route through 19 parts, which other courses on this site fit alongside, and a study rhythm that works even when the first event ID list looks endless.</p>

<h3>Ten questions you will answer by yourself</h3>
<table>
<thead><tr><th>Question someone asks you</th><th>Where the answer lives</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>"My PC restarted by itself last night — why?"</td><td>Windows System log: Kernel-Power 41, EventLog 6008, BugCheck 1001, user/updater 1074</td><td>3, 4</td></tr>
<tr><td>"Did anyone log into my laptop while I was away?"</td><td>Security log 4624/4625 with logon types; macOS unified log</td><td>4, 6</td></tr>
<tr><td>"The service died and came back — what killed it?"</td><td><code>journalctl -u</code>, exit status, the kernel's OOM killer in <code>dmesg</code></td><td>7</td></tr>
<tr><td>"Is someone guessing SSH passwords on our VPS?"</td><td><code>/var/log/auth.log</code> or the journal of sshd</td><td>8, 14</td></tr>
<tr><td>"The page is blank for one user only."</td><td>Browser DevTools Console and Network, a HAR file</td><td>9</td></tr>
<tr><td>"Why did the website return 502 at 14:05?"</td><td>nginx access and error logs, then the app's own log</td><td>10</td></tr>
<tr><td>"Which query makes the app slow?"</td><td>PostgreSQL slow query log, <code>auto_explain</code></td><td>12</td></tr>
<tr><td>"The container keeps restarting."</td><td><code>docker logs</code>, <code>docker events</code>, <code>kubectl logs --previous</code></td><td>13</td></tr>
<tr><td>"Was this a real attack, and what did they do next?"</td><td>Correlating several sources on one timeline, MITRE ATT&amp;CK</td><td>14</td></tr>
<tr><td>"Can we be told automatically next time?"</td><td>Central logging (Loki, ELK) and alert rules</td><td>15</td></tr>
</tbody></table>

<h3>What you need before starting — and what you do not</h3>
<ul>
<li><strong>Needed:</strong> you can use a computer comfortably, open a terminal and type a command, and you know roughly what a server, an IP address and a web request are. A first-year IT student has all of this.</li>
<li><strong>Helpful but not required:</strong> basic Linux commands (<code>cd</code>, <code>ls</code>, <code>cat</code>). If they are new to you, do the first chapters of the Linux &amp; Bash course in parallel — you will only need them from Chapter 2 on.</li>
<li><strong>Not needed:</strong> security experience, networking theory, or knowing any event ID. This course teaches how to <em>look things up</em> and reason, not to memorise tables.</li>
<li><strong>Equipment:</strong> your own Windows or Mac laptop. Linux comes from WSL2 or a free virtual machine; lesson 0.1 sets it all up safely.</li>
</ul>

<h3>Logs in three jobs</h3>
<table>
<thead><tr><th>Role</th><th>What they do with logs every week</th><th>Chapters that matter most</th></tr></thead>
<tbody>
<tr><td><strong>Backend developer</strong></td><td>Find why a request failed; add a request id; read stack traces; check slow queries before users complain.</td><td>1, 2, 9, 10, 12</td></tr>
<tr><td><strong>DevOps / SRE</strong></td><td>On-call: service down, disk full, OOM, deploy broke something; centralise logs; write alerts that wake people only when needed.</td><td>7, 8, 13, 15, 16</td></tr>
<tr><td><strong>SOC analyst (blue team)</strong></td><td>Triage alerts: brute force, impossible travel, new admin account, cleared logs; build timelines; escalate with evidence.</td><td>4, 5, 8, 11, 14</td></tr>
</tbody></table>
<p>All three share Chapters 1–2 (how to read any line, and the toolkit). That is why everybody starts there.</p>

<h3>The roadmap: 19 parts in six blocks</h3>
<ol>
<li><strong>Foundations</strong> — Section 0, Chapter 1 (anatomy, levels, formats, time), Chapter 2 (less, grep, awk, jq, PowerShell).</li>
<li><strong>Windows</strong> — Chapter 3 (Event Viewer), Chapter 4 (event IDs you must recognise), Chapter 5 (PowerShell, audit policy, Sysmon).</li>
<li><strong>Other operating systems and the browser</strong> — Chapter 6 (macOS), 7 (journald), 8 (/var/log, auth, auditd, logrotate), 9 (DevTools, HAR).</li>
<li><strong>Applications and infrastructure</strong> — Chapter 10 (web servers, Node, Java/Spring), 11 (network), 12 (databases), 13 (containers, Kubernetes, CDN, cloud).</li>
<li><strong>Investigation and operations</strong> — Chapter 14 (security investigation), 15 (central logging and alerts), 16 (retention, cost, privacy, integrity).</li>
<li><strong>Career and final project</strong> — Chapter 17 (interviews), Chapter 18 (a multi-source incident and a written report).</li>
</ol>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Short path · 2 weeks</span><span class="lz-t">Ch1 → 2 → 3 → 4 → 7 → 8 → 10</span><span class="lz-d">About one hour a day. Enough to debug your own projects and survive a first on-call week.</span></div>
<div class="lz-step"><span class="lz-k">Full path · 8–10 weeks</span><span class="lz-t">All 19 parts in order</span><span class="lz-d">Three or four sessions a week, each ending with the lesson's 🧪 task. Finish with the Chapter 18 report — it is a portfolio piece.</span></div>
</div>

<h3>Courses that fit alongside (no repetition)</h3>
<p>Where another course on this site already teaches something in depth, this course uses it "for logs" and links there instead of teaching it twice:</p>
<ul>
<li><strong>Linux &amp; Bash</strong> — grep, awk, regex and systemd basics in depth; lesson 10.3 introduces <code>journalctl</code>. Chapter 7 here goes much further.</li>
<li><strong>Operating Systems for Developers</strong> — lesson 2.6 is a gentle first look at system logs; lesson 14.3 explains WSL, which you will use as your Linux in lesson 0.1.</li>
<li><strong>Observability &amp; Monitoring</strong> — the other side: <em>writing</em> structured logs, Loki/LogQL pipelines, alert design and SLOs.</li>
<li><strong>Blue Team &amp; SIEM</strong> and <strong>Incident Response</strong> — writing detection rules and running a SIEM; the full incident process. Chapter 14 here gives you the log-reading skills they assume.</li>
</ul>

<h3>How to learn this without drowning</h3>
<ul>
<li><strong>Keep a command notebook you type yourself.</strong> Copy-pasting teaches your clipboard. After each lesson write the two or three commands you used and one sentence on what each part does.</li>
<li><strong>One real question per session.</strong> "Why did my laptop wake up at 3 a.m.?" is a better study goal than "learn Event Viewer". Answer it on your own machine (read-only), or on the sample pack.</li>
<li><strong>Do not memorise event IDs — learn to look them up.</strong> You will recognise 4624 and 4625 after a week anyway. What matters is knowing which log to open and how to filter it.</li>
<li><strong>Red text is information.</strong> An error message is a log line about your command. Read it word by word before searching the web.</li>
<li><strong>English terms come with Vietnamese meanings</strong> in every 🗂 box. You do not need to translate whole pages — learn the 5–8 words of the lesson.</li>
<li><strong>Small wins:</strong> each chapter's lab has a clear "Done when". Tick it in your notebook — after Chapter 2 you will already have answered ten real questions about a day of web traffic.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>The trap of "reading all the theory first".</strong> Many people stop after a week of reading about formats and standards without ever opening a log. In this course every lesson has something to run. If you only have 20 minutes, skip the reading and do the 🧪 task — then come back.</p></div>

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok"><ol>
<li>Create a notebook (paper or a file <code>so-tay-log.md</code>). Title the first page "Questions I want logs to answer".</li>
<li>Write three questions about <em>your own</em> computers or projects (for example: "why does my laptop fan spin up at night?", "why did our SWP391 demo return 500 last week?").</li>
<li>Next to each, write which chapter from the table above you think will answer it. Choose the short or full path and write today's date as the start.</li>
</ol>
<p><strong>Done when:</strong> your notebook has three real questions, each mapped to a chapter, and a chosen path with a start date.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['on-call', 'Being the person who responds when a system breaks outside office hours.'],
  ['SOC (Security Operations Center)', 'A team that watches security alerts and investigates them.'],
  ['SRE / DevOps', 'Engineers who run, deploy and keep services reliable.'],
  ['triage', 'Quickly deciding how serious an alert is and what to do first.'],
  ['timeline', 'Events from several sources put in true time order — the core of every investigation.'],
  ['retention', 'How long logs are kept before being deleted.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>After the course you can answer "why did it restart / die / fail / slow down, and who logged in" from logs, on Windows, macOS, Linux, browser, web, network, database and containers.</li>
<li>You need only basic computer and terminal skills; Linux &amp; Bash can be learned in parallel.</li>
<li>Backend, DevOps/SRE and SOC all use logs weekly, with different chapters at the centre.</li>
<li>Short path: Ch1, 2, 3, 4, 7, 8, 10 in about two weeks; full path: all 19 parts ending with a written report.</li>
<li>Study with a self-typed command notebook, one real question per session, and look up event IDs instead of memorising them.</li>
</ul>
${nguon('📘', 'OWASP Logging Cheat Sheet', 'What good application logs contain — a reference you will reuse in Chapters 10 and 16', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${nguon('📗', 'NIST SP 800-92 — Guide to Computer Security Log Management', 'The classic government guide to managing logs in an organisation', 'https://csrc.nist.gov/pubs/sp/800/92/final')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux &amp; Bash 10.3 — logs and journalctl', sub: 'A first look at journald; Chapter 7 here goes deeper', cta: 'Open lesson' })}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-2-6-nhat-ky', title: 'OS for Developers 2.6 — system logs', sub: 'Where the operating system writes what it does', cta: 'Open lesson' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-0-8-bat-dau-tai-day', title: 'Observability &amp; Monitoring — start here', sub: 'The writing side: structured logs, pipelines, alerts and SLOs', cta: 'Open lesson' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-0-8-bat-dau-tai-day', title: 'Blue Team &amp; SIEM — start here', sub: 'Detection rules and SIEM operations, after this course', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Học xong làm được gì, lộ trình, và cách học không bị ngợp</h2>
<p class="lead">Bài 1 cho thấy vì sao log quan trọng. Bài này thực tế hơn: những câu hỏi bạn sẽ tự trả lời được, cần biết gì trước khi học (ít hơn bạn nghĩ), log xuất hiện thế nào trong ba nghề bạn có thể ứng tuyển, đường đi qua 19 phần, nên học kèm khoá nào trên trang, và một nhịp học vẫn chạy được ngay cả khi danh sách mã sự kiện đầu tiên trông dài vô tận.</p>

<h3>Mười câu hỏi bạn sẽ tự trả lời được</h3>
<table>
<thead><tr><th>Câu người khác hỏi bạn</th><th>Câu trả lời nằm ở đâu</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>"Đêm qua máy em tự khởi động lại — vì sao?"</td><td>Nhật ký System của Windows: Kernel-Power 41, EventLog 6008, BugCheck 1001, người dùng/bộ cập nhật 1074</td><td>3, 4</td></tr>
<tr><td>"Lúc em đi vắng có ai đăng nhập laptop không?"</td><td>Nhật ký Security 4624/4625 kèm kiểu đăng nhập; unified log của macOS</td><td>4, 6</td></tr>
<tr><td>"Dịch vụ chết rồi tự sống lại — cái gì giết nó?"</td><td><code>journalctl -u</code>, mã thoát, bộ giết OOM của nhân trong <code>dmesg</code></td><td>7</td></tr>
<tr><td>"Có ai đang dò mật khẩu SSH trên VPS không?"</td><td><code>/var/log/auth.log</code> hoặc journal của sshd</td><td>8, 14</td></tr>
<tr><td>"Trang trắng tinh, chỉ với một người dùng."</td><td>Console và Network trong DevTools của trình duyệt, tệp HAR</td><td>9</td></tr>
<tr><td>"Vì sao web trả 502 lúc 14:05?"</td><td>Access log và error log của nginx, rồi log của chính app</td><td>10</td></tr>
<tr><td>"Câu truy vấn nào làm app chậm?"</td><td>Slow query log của PostgreSQL, <code>auto_explain</code></td><td>12</td></tr>
<tr><td>"Container cứ khởi động lại liên tục."</td><td><code>docker logs</code>, <code>docker events</code>, <code>kubectl logs --previous</code></td><td>13</td></tr>
<tr><td>"Đây có phải tấn công thật không, và sau đó chúng làm gì?"</td><td>Ghép nhiều nguồn trên một dòng thời gian, MITRE ATT&amp;CK</td><td>14</td></tr>
<tr><td>"Lần sau hệ thống tự báo được không?"</td><td>Gom log tập trung (Loki, ELK) và luật cảnh báo</td><td>15</td></tr>
</tbody></table>

<h3>Cần nền gì trước khi học — và không cần gì</h3>
<ul>
<li><strong>Cần:</strong> dùng máy tính thành thạo, mở được terminal và gõ một lệnh, biết sơ sơ server, địa chỉ IP, một request web là gì. Sinh viên CNTT năm nhất có đủ.</li>
<li><strong>Có thì tốt, không bắt buộc:</strong> lệnh Linux cơ bản (<code>cd</code>, <code>ls</code>, <code>cat</code>). Nếu còn lạ, học song song vài chương đầu khoá Linux &amp; Bash — từ Chương 2 bạn mới cần tới.</li>
<li><strong>Không cần:</strong> kinh nghiệm bảo mật, lý thuyết mạng, hay thuộc bất kỳ mã sự kiện nào. Khoá này dạy cách <em>tra cứu</em> và suy luận, không bắt học thuộc bảng.</li>
<li><strong>Thiết bị:</strong> laptop Windows hoặc Mac của chính bạn. Linux có từ WSL2 hoặc một máy ảo miễn phí; bài 0.1 dựng tất cả một cách an toàn.</li>
</ul>

<h3>Log trong ba nghề</h3>
<table>
<thead><tr><th>Vai trò</th><th>Tuần nào cũng làm gì với log</th><th>Chương quan trọng nhất</th></tr></thead>
<tbody>
<tr><td><strong>Lập trình backend</strong></td><td>Tìm vì sao một request lỗi; gắn request id; đọc stack trace (vết ngăn xếp lỗi); xem truy vấn chậm trước khi người dùng than.</td><td>1, 2, 9, 10, 12</td></tr>
<tr><td><strong>DevOps / SRE (kỹ sư vận hành)</strong></td><td>Trực sự cố: dịch vụ chết, đầy đĩa, OOM, deploy làm hỏng gì đó; gom log tập trung; viết cảnh báo chỉ đánh thức người khi thật cần.</td><td>7, 8, 13, 15, 16</td></tr>
<tr><td><strong>Phân tích viên SOC (đội phòng thủ)</strong></td><td>Phân loại cảnh báo: dò mật khẩu, đăng nhập từ nơi lạ, tài khoản admin mới, log bị xoá; dựng dòng thời gian; báo lên kèm bằng chứng.</td><td>4, 5, 8, 11, 14</td></tr>
</tbody></table>
<p>Cả ba dùng chung Chương 1–2 (đọc một dòng bất kỳ, và bộ đồ nghề). Vì thế ai cũng bắt đầu từ đó.</p>

<h3>Lộ trình: 19 phần, sáu khối</h3>
<ol>
<li><strong>Nền tảng</strong> — Mục 0, Chương 1 (giải phẫu, mức, định dạng, thời gian), Chương 2 (less, grep, awk, jq, PowerShell).</li>
<li><strong>Windows</strong> — Chương 3 (Event Viewer), Chương 4 (những mã sự kiện phải nhận ra), Chương 5 (PowerShell, audit policy, Sysmon).</li>
<li><strong>Hệ điều hành khác và trình duyệt</strong> — Chương 6 (macOS), 7 (journald), 8 (/var/log, xác thực, auditd, logrotate), 9 (DevTools, HAR).</li>
<li><strong>Ứng dụng và hạ tầng</strong> — Chương 10 (web server, Node, Java/Spring), 11 (mạng), 12 (CSDL), 13 (container, Kubernetes, CDN, cloud).</li>
<li><strong>Điều tra và vận hành</strong> — Chương 14 (điều tra bảo mật), 15 (gom log và cảnh báo), 16 (thời gian lưu, chi phí, quyền riêng tư, toàn vẹn).</li>
<li><strong>Nghề nghiệp và dự án cuối</strong> — Chương 17 (phỏng vấn), Chương 18 (một sự cố đa nguồn và bản báo cáo viết).</li>
</ol>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Đường ngắn · 2 tuần</span><span class="lz-t">Ch1 → 2 → 3 → 4 → 7 → 8 → 10</span><span class="lz-d">Khoảng một giờ mỗi ngày. Đủ để gỡ lỗi dự án của chính bạn và sống sót qua tuần trực sự cố đầu tiên.</span></div>
<div class="lz-step"><span class="lz-k">Đường đầy đủ · 8–10 tuần</span><span class="lz-t">Đủ 19 phần theo thứ tự</span><span class="lz-d">Ba, bốn buổi mỗi tuần, buổi nào cũng kết thúc bằng 🧪 của bài. Kết thúc bằng bản báo cáo Chương 18 — bỏ vào hồ sơ năng lực được.</span></div>
</div>

<h3>Học kèm khoá nào (không học lại hai lần)</h3>
<p>Chỗ nào khoá khác trên trang đã dạy sâu, khoá này chỉ dùng nó "cho việc đọc log" và đặt liên kết, không dạy lại:</p>
<ul>
<li><strong>Linux &amp; Bash</strong> — grep, awk, regex và systemd cơ bản dạy kỹ; bài 10.3 nhập môn <code>journalctl</code>. Chương 7 ở đây đi sâu hơn nhiều.</li>
<li><strong>Operating Systems for Developers</strong> — bài 2.6 là cái nhìn đầu tiên nhẹ nhàng về log hệ thống; bài 14.3 giải thích WSL, thứ bạn sẽ dùng làm Linux ở bài 0.1.</li>
<li><strong>Observability &amp; Monitoring</strong> — phía bên kia: <em>viết</em> log có cấu trúc, đường ống Loki/LogQL, thiết kế cảnh báo và SLO.</li>
<li><strong>Blue Team &amp; SIEM</strong> và <strong>Incident Response</strong> — viết luật phát hiện và vận hành SIEM; quy trình xử lý sự cố đầy đủ. Chương 14 ở đây cho bạn kỹ năng đọc log mà hai khoá đó mặc định bạn đã có.</li>
</ul>

<h3>Cách học không bị ngợp</h3>
<ul>
<li><strong>Giữ một sổ tay lệnh tự tay gõ.</strong> Chép-dán chỉ dạy cho clipboard. Sau mỗi bài, ghi hai ba lệnh đã dùng và một câu nói từng phần của lệnh làm gì.</li>
<li><strong>Mỗi buổi một câu hỏi thật.</strong> "Vì sao laptop mình tự thức dậy lúc 3 giờ sáng?" là mục tiêu học tốt hơn "học Event Viewer". Trả lời trên chính máy mình (chỉ đọc), hoặc trên gói log mẫu.</li>
<li><strong>Đừng học thuộc mã sự kiện — học cách tra.</strong> Kiểu gì sau một tuần bạn cũng nhận ra 4624, 4625. Điều quan trọng là biết mở log nào và lọc ra sao.</li>
<li><strong>Chữ đỏ là thông tin.</strong> Một thông báo lỗi chính là một dòng log về lệnh của bạn. Đọc từng chữ trước khi đi tìm trên mạng.</li>
<li><strong>Thuật ngữ tiếng Anh luôn có nghĩa tiếng Việt</strong> trong ô 🗂 của từng bài. Không cần dịch cả trang — học 5–8 từ của bài.</li>
<li><strong>Thắng nhỏ:</strong> lab của mỗi chương có tiêu chí "Đạt khi" rõ ràng. Đánh dấu vào sổ — hết Chương 2 bạn đã tự trả lời mười câu hỏi thật về một ngày lưu lượng web.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Cái bẫy "đọc hết lý thuyết rồi mới làm".</strong> Rất nhiều người bỏ cuộc sau một tuần đọc về định dạng và chuẩn mà chưa từng mở một tệp log. Ở khoá này bài nào cũng có thứ để chạy. Nếu chỉ có 20 phút, bỏ qua phần đọc và làm 🧪 trước — rồi quay lại sau.</p></div>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo một cuốn sổ (giấy hoặc tệp <code>so-tay-log.md</code>). Trang đầu đặt tiêu đề "Những câu tôi muốn log trả lời".</li>
<li>Viết ba câu hỏi về <em>chính</em> máy tính hay dự án của bạn (ví dụ: "vì sao quạt laptop rú lên ban đêm?", "vì sao tuần trước demo SWP391 trả 500?").</li>
<li>Cạnh mỗi câu, ghi chương nào trong bảng trên bạn nghĩ sẽ trả lời nó. Chọn đường ngắn hoặc đường đầy đủ và ghi ngày hôm nay làm ngày bắt đầu.</li>
</ol>
<p><strong>Đạt khi:</strong> sổ có ba câu hỏi thật, mỗi câu gắn một chương, và một lộ trình đã chọn kèm ngày bắt đầu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['on-call (trực sự cố)', 'Là người phải xử lý khi hệ thống hỏng, kể cả ngoài giờ làm.'],
  ['SOC (trung tâm giám sát an ninh)', 'Đội theo dõi cảnh báo bảo mật và điều tra chúng.'],
  ['SRE / DevOps (kỹ sư vận hành)', 'Người chạy, triển khai và giữ cho dịch vụ ổn định.'],
  ['triage (phân loại)', 'Quyết định nhanh một cảnh báo nghiêm trọng tới đâu và làm gì trước.'],
  ['timeline (dòng thời gian)', 'Sự kiện từ nhiều nguồn xếp đúng thứ tự thời gian thật — lõi của mọi cuộc điều tra.'],
  ['retention (thời gian lưu)', 'Log được giữ bao lâu trước khi bị xoá.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Học xong bạn trả lời được "vì sao nó khởi động lại / chết / lỗi / chậm, và ai đã đăng nhập" bằng log, trên Windows, macOS, Linux, trình duyệt, web, mạng, CSDL và container.</li>
<li>Chỉ cần kỹ năng máy tính và terminal cơ bản; Linux &amp; Bash học song song được.</li>
<li>Backend, DevOps/SRE và SOC tuần nào cũng dùng log, mỗi nghề xoay quanh vài chương khác nhau.</li>
<li>Đường ngắn: Ch1, 2, 3, 4, 7, 8, 10 trong khoảng hai tuần; đường đầy đủ: cả 19 phần, kết thúc bằng một bản báo cáo.</li>
<li>Học với sổ tay lệnh tự gõ, mỗi buổi một câu hỏi thật, và tra mã sự kiện thay vì học thuộc.</li>
</ul>
${nguon('📘', 'OWASP Logging Cheat Sheet', 'Một log ứng dụng tốt gồm những gì — tài liệu sẽ dùng lại ở Chương 10 và 16', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${nguon('📗', 'NIST SP 800-92 — Hướng dẫn quản lý log bảo mật máy tính', 'Tài liệu kinh điển của NIST về quản lý log trong một tổ chức', 'https://csrc.nist.gov/pubs/sp/800/92/final')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-10-3-log-journalctl', title: 'Linux &amp; Bash 10.3 — log và journalctl', sub: 'Nhập môn journald; Chương 7 ở đây đi sâu hơn' })}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-2-6-nhat-ky', title: 'OS for Developers 2.6 — nhật ký hệ thống', sub: 'Hệ điều hành ghi lại việc nó làm ở đâu' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-0-8-bat-dau-tai-day', title: 'Observability &amp; Monitoring — bắt đầu tại đây', sub: 'Phía viết log: log có cấu trúc, đường ống, cảnh báo, SLO' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-0-8-bat-dau-tai-day', title: 'Blue Team &amp; SIEM — bắt đầu tại đây', sub: 'Luật phát hiện và vận hành SIEM, học sau khoá này' })}
</div>
`,
};
