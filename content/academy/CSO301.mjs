/**
 * CSO301 — Cybersecurity Operations (Vận hành an ninh mạng). Ngành Khoa học
 * Máy tính FPTU, kỳ 5. Khung 8 chương theo nguồn chuẩn quốc tế: vận hành an
 * ninh & SOC → giám sát & SIEM → phát hiện mối đe doạ → ứng phó sự cố → phân
 * tích mã độc & pháp chứng → săn lùng mối đe doạ → quản lý lỗ hổng → tự động
 * hoá & vận hành. Song ngữ VI+EN, có khái niệm, công cụ, quy trình & ví dụ thật.
 * Nguồn: Cisco CyberOps Associate; D.W. Murdoch "Blue Team Handbook"; NIST
 * Cybersecurity Framework & SP 800-61; MITRE ATT&CK; SANS Blue Team.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cso301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Blue Team Handbook), tài liệu chuẩn (NIST, MITRE ATT&CK, Cisco CyberOps), YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">CSO301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to run security operations like a <strong>blue team</strong> — monitoring &amp; SIEM, threat detection, incident response, forensics, threat hunting and vulnerability management — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CSO301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books &amp; standards</h3>
<ul>
<li><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener">NIST Cybersecurity Framework (CSF)</a> — the Identify/Protect/Detect/Respond/Recover model.</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/61/r2/final" target="_blank" rel="noopener">NIST SP 800-61 — Computer Security Incident Handling Guide</a></li>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK</a> — the knowledge base of adversary tactics &amp; techniques.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.netacad.com/courses/cybersecurity" target="_blank" rel="noopener">Cisco Networking Academy — CyberOps Associate</a></li>
<li><a href="https://www.sans.org/blog/" target="_blank" rel="noopener">SANS Blue Team blog &amp; reading room</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@JohnHammond010" target="_blank" rel="noopener">John Hammond</a> — malware analysis &amp; blue-team walkthroughs.</li>
<li><a href="https://www.youtube.com/@13Cubed" target="_blank" rel="noopener">13Cubed</a> — digital forensics &amp; incident response.</li>
</ul>
<h3>🛠️ Tools &amp; hands-on labs</h3>
<ul>
<li><a href="https://www.elastic.co/elastic-stack" target="_blank" rel="noopener">Elastic Stack (ELK)</a> — open-source log search &amp; SIEM.</li>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe — SOC Level 1</a> — guided blue-team labs.</li>
<li><a href="https://letsdefend.io/" target="_blank" rel="noopener">LetsDefend</a> — hands-on SOC analyst simulations.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the CIA triad, defense in depth, what a SOC and a blue team actually do.</li>
<li><strong>See the data</strong> — collect logs into a SIEM (ELK/Splunk), write a detection, fire an alert.</li>
<li><strong>Respond</strong> — walk one incident through the NIST life cycle; triage a suspicious file.</li>
<li><strong>Job-ready</strong> — map detections to MITRE ATT&amp;CK, hunt on a hypothesis, and manage vulnerabilities by CVSS.</li>
</ol></div>`,
    `<span class="eyebrow">CSO301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để vận hành an ninh như một <strong>blue team</strong> — giám sát &amp; SIEM, phát hiện mối đe doạ, ứng phó sự cố, pháp chứng, săn lùng đe doạ và quản lý lỗ hổng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CSO301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách &amp; chuẩn tham khảo</h3>
<ul>
<li><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener">NIST Cybersecurity Framework (CSF)</a> — mô hình Identify/Protect/Detect/Respond/Recover.</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/61/r2/final" target="_blank" rel="noopener">NIST SP 800-61 — Hướng dẫn xử lý sự cố an ninh</a></li>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK</a> — kho tri thức chiến thuật &amp; kỹ thuật của kẻ tấn công.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.netacad.com/courses/cybersecurity" target="_blank" rel="noopener">Cisco Networking Academy — CyberOps Associate</a></li>
<li><a href="https://www.sans.org/blog/" target="_blank" rel="noopener">SANS Blue Team — blog &amp; reading room</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@JohnHammond010" target="_blank" rel="noopener">John Hammond</a> — phân tích mã độc &amp; hướng dẫn blue-team.</li>
<li><a href="https://www.youtube.com/@13Cubed" target="_blank" rel="noopener">13Cubed</a> — pháp chứng số &amp; ứng phó sự cố.</li>
</ul>
<h3>🛠️ Công cụ &amp; lab thực hành</h3>
<ul>
<li><a href="https://www.elastic.co/elastic-stack" target="_blank" rel="noopener">Elastic Stack (ELK)</a> — tìm kiếm log &amp; SIEM mã nguồn mở.</li>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe — SOC Level 1</a> — lab blue-team có hướng dẫn.</li>
<li><a href="https://letsdefend.io/" target="_blank" rel="noopener">LetsDefend</a> — mô phỏng công việc SOC analyst.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — bộ ba CIA, phòng thủ theo chiều sâu, SOC và blue team thực chất làm gì.</li>
<li><strong>Nhìn thấy dữ liệu</strong> — gom log vào SIEM (ELK/Splunk), viết một luật phát hiện, bắn một cảnh báo.</li>
<li><strong>Ứng phó</strong> — đưa một sự cố qua vòng đời NIST; phân loại một tệp khả nghi.</li>
<li><strong>Sẵn sàng đi làm</strong> — ánh xạ phát hiện sang MITRE ATT&amp;CK, săn lùng theo giả thuyết, quản lý lỗ hổng theo CVSS.</li>
</ol></div>`,
  ]]);

const intro = doc('cso301-0-1-overview', 'Course overview: Cybersecurity Operations|||Tổng quan: Vận hành an ninh mạng',
  'An ninh mạng vận hành là gì; blue team & SOC; bộ ba CIA; lộ trình 8 chương: SecOps & SOC → SIEM → phát hiện → ứng phó → mã độc/pháp chứng → săn lùng → lỗ hổng → tự động hoá.',
  [[
    `<span class="eyebrow">CSO301 · Lesson 0.1 · Overview</span>
<h2>Cybersecurity Operations</h2>
<p class="lead">This course teaches you to <strong>defend a live organization</strong> — the daily work of a <strong>blue team</strong> inside a <strong>Security Operations Center (SOC)</strong>. You will learn to monitor, detect, investigate and respond to attacks, not just to describe them in theory.</p>
<h3>The one idea behind everything</h3>
<p>Security operations exist to protect the <strong>CIA triad</strong>:</p>
<ul>
<li><strong>Confidentiality</strong> — only authorized people see the data.</li>
<li><strong>Integrity</strong> — data is not altered without authorization.</li>
<li><strong>Availability</strong> — systems stay up for the people who need them.</li>
</ul>
<p>Every alert, incident and control ultimately traces back to protecting one of these three.</p>
<h3>Roadmap</h3>
<p>SecOps &amp; the SOC → monitoring &amp; SIEM → threat detection (MITRE ATT&amp;CK) → incident response (NIST SP 800-61) → malware triage &amp; forensics → threat hunting → vulnerability management → automation (SOAR) &amp; SOC metrics. Bilingual, with real tools and worked examples.</p>
<div class="callout"><span class="badge">Red vs blue</span> A <strong>red team</strong> attacks to find weaknesses; the <strong>blue team</strong> defends, detects and responds. This course is the blue side — the people watching the screens at 3am.</div>`,
    `<span class="eyebrow">CSO301 · Bài 0.1 · Tổng quan</span>
<h2>Vận hành an ninh mạng</h2>
<p class="lead">Môn này dạy bạn <strong>phòng thủ một tổ chức đang chạy thật</strong> — công việc hằng ngày của một <strong>blue team</strong> bên trong <strong>Trung tâm vận hành an ninh (SOC)</strong>. Bạn học cách giám sát, phát hiện, điều tra và ứng phó với tấn công, chứ không chỉ mô tả lý thuyết.</p>
<h3>Một ý tưởng đứng sau tất cả</h3>
<p>Vận hành an ninh tồn tại để bảo vệ <strong>bộ ba CIA</strong>:</p>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ người được phép mới xem được dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu không bị sửa đổi trái phép.</li>
<li><strong>Sẵn sàng (Availability)</strong> — hệ thống luôn hoạt động cho người cần dùng.</li>
</ul>
<p>Mọi cảnh báo, sự cố và biện pháp kiểm soát cuối cùng đều quy về bảo vệ một trong ba điều này.</p>
<h3>Lộ trình</h3>
<p>SecOps &amp; SOC → giám sát &amp; SIEM → phát hiện mối đe doạ (MITRE ATT&amp;CK) → ứng phó sự cố (NIST SP 800-61) → phân tích mã độc &amp; pháp chứng → săn lùng mối đe doạ → quản lý lỗ hổng → tự động hoá (SOAR) &amp; chỉ số SOC. Song ngữ, có công cụ thật và ví dụ mẫu.</p>
<div class="callout"><span class="badge">Đỏ và xanh</span> <strong>Red team</strong> tấn công để tìm điểm yếu; <strong>blue team</strong> phòng thủ, phát hiện và ứng phó. Môn này đứng bên xanh — những người canh màn hình lúc 3 giờ sáng.</div>`,
  ]]);

const c1 = doc('cso301-1-1-secops-soc', '1.1 — Security operations, the SOC & the blue team|||1.1 — Vận hành an ninh, SOC & blue team',
  'SecOps là gì; SOC & vai trò (analyst L1/L2/L3); blue team; bộ ba CIA; phòng thủ theo chiều sâu (defense in depth) và các lớp bảo vệ.',
  [[
    `<span class="eyebrow">CSO301 · Chapter 1 · Lesson 1.1</span>
<h2>Security operations, the SOC &amp; the blue team</h2>
<h3>What is SecOps?</h3>
<p><strong>Security operations (SecOps)</strong> is the continuous work of keeping an organization safe: watching for attacks, deciding which alerts matter, and responding when something is real. It never stops — attacks arrive at any hour.</p>
<h3>The SOC and its people</h3>
<p>A <strong>Security Operations Center (SOC)</strong> is the team (and its tools) that does this. Analysts work in tiers:</p>
<ul>
<li><strong>Tier 1 (triage)</strong> — reviews alerts, filters false positives, escalates real ones.</li>
<li><strong>Tier 2 (investigation)</strong> — digs into escalated alerts, scopes the incident.</li>
<li><strong>Tier 3 (hunting / IR)</strong> — hunts for hidden threats and handles serious incidents.</li>
</ul>
<h3>Defense in depth</h3>
<p>No single control is enough, so defenders stack <strong>layers</strong> — if one fails, another still holds:</p>
<pre><code>Perimeter   -> firewall, IDS/IPS
Network     -> segmentation, monitoring
Endpoint    -> EDR/antivirus, hardening
Application -> input validation, WAF
Data        -> encryption, access control
People      -> training, MFA
</code></pre>
<div class="callout"><span class="badge">Real example</span> A phishing email slips past the mail filter (layer 1), but the endpoint EDR blocks the payload (layer 2), and the SIEM still raises an alert so the SOC investigates. That is defense in depth working.</div>`,
    `<span class="eyebrow">CSO301 · Chương 1 · Bài 1.1</span>
<h2>Vận hành an ninh, SOC &amp; blue team</h2>
<h3>SecOps là gì?</h3>
<p><strong>Vận hành an ninh (SecOps)</strong> là công việc liên tục giữ an toàn cho tổ chức: canh chừng tấn công, quyết định cảnh báo nào đáng bận tâm, và ứng phó khi có việc thật. Nó không bao giờ ngừng — tấn công đến bất kể giờ nào.</p>
<h3>SOC và con người của nó</h3>
<p><strong>Trung tâm vận hành an ninh (SOC)</strong> là đội ngũ (và công cụ) làm việc này. Analyst chia theo bậc:</p>
<ul>
<li><strong>Bậc 1 (phân loại)</strong> — xem cảnh báo, lọc dương tính giả, đẩy cái thật lên trên.</li>
<li><strong>Bậc 2 (điều tra)</strong> — đào sâu cảnh báo được đẩy lên, xác định phạm vi sự cố.</li>
<li><strong>Bậc 3 (săn lùng / IR)</strong> — săn mối đe doạ ẩn và xử lý sự cố nghiêm trọng.</li>
</ul>
<h3>Phòng thủ theo chiều sâu</h3>
<p>Không lớp nào đủ một mình, nên người phòng thủ xếp <strong>nhiều lớp</strong> — lớp này hỏng thì lớp khác vẫn giữ:</p>
<pre><code>Vành đai   -> tường lửa, IDS/IPS
Mạng       -> phân vùng, giám sát
Thiết bị   -> EDR/antivirus, làm cứng
Ứng dụng   -> kiểm tra đầu vào, WAF
Dữ liệu    -> mã hoá, kiểm soát truy cập
Con người  -> đào tạo, MFA
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Một email lừa đảo lọt qua bộ lọc thư (lớp 1), nhưng EDR trên máy chặn payload (lớp 2), và SIEM vẫn bắn cảnh báo để SOC điều tra. Đó là phòng thủ theo chiều sâu đang hoạt động.</div>`,
  ]]);

const c1q = quiz('cso301-quiz-1', 'Quiz 1 — SecOps & SOC|||Quiz 1 — SecOps & SOC', [
  { id: 'q1', question: 'What does the CIA triad stand for?|||Bộ ba CIA gồm những gì?', options: ['Control, Identity, Access|||Kiểm soát, Danh tính, Truy cập', 'Confidentiality, Integrity, Availability|||Bí mật, Toàn vẹn, Sẵn sàng', 'Cyber, Internet, Access', 'Compliance, Incident, Audit|||Tuân thủ, Sự cố, Kiểm toán'], correctIndex: 1, explanation: 'CIA = Confidentiality (bí mật), Integrity (toàn vẹn), Availability (sẵn sàng).' },
  { id: 'q2', question: 'Which SOC tier first reviews alerts and filters false positives?|||Bậc SOC nào xem cảnh báo đầu tiên và lọc dương tính giả?', options: ['Tier 1|||Bậc 1', 'Tier 3|||Bậc 3', 'Red team', 'CISO'], correctIndex: 0, explanation: 'Tier 1 (phân loại) xử lý cảnh báo đầu tiên và đẩy cái thật lên trên.' },
  { id: 'q3', question: 'The idea of stacking multiple protective layers is called?|||Ý tưởng xếp nhiều lớp bảo vệ chồng lên nhau gọi là?', options: ['Zero trust', 'Defense in depth|||Phòng thủ theo chiều sâu', 'Threat hunting|||Săn lùng mối đe doạ', 'Least privilege|||Đặc quyền tối thiểu'], correctIndex: 1, explanation: 'Defense in depth: nhiều lớp để lớp này hỏng thì lớp khác vẫn giữ.' },
]);

const c2 = doc('cso301-2-1-monitoring-siem', '2.1 — Monitoring & SIEM|||2.1 — Giám sát & SIEM',
  'Log management (nguồn log, chuẩn hoá, lưu trữ); SIEM là gì; Splunk & ELK; correlation rule; sinh và phân loại alert; ví dụ luật phát hiện brute-force.',
  [[
    `<span class="eyebrow">CSO301 · Chapter 2 · Lesson 2.1</span>
<h2>Monitoring &amp; SIEM</h2>
<h3>Logs — the raw material of defense</h3>
<p>Everything a defender knows starts as a <strong>log</strong>: firewall connections, Windows security events, web-server requests, authentication attempts. <strong>Log management</strong> means collecting them, normalizing different formats into common fields, and storing them so they can be searched.</p>
<h3>What a SIEM does</h3>
<p>A <strong>SIEM (Security Information and Event Management)</strong> is the central brain: it ingests logs from everywhere, then uses <strong>correlation rules</strong> to connect separate events into one meaningful signal, and raises an <strong>alert</strong>.</p>
<ul>
<li><strong>Splunk</strong> — powerful commercial SIEM with the SPL query language.</li>
<li><strong>Elastic Stack (ELK)</strong> — open-source: Elasticsearch stores, Logstash/Beats ingest, Kibana visualizes.</li>
</ul>
<h3>Correlation in action</h3>
<pre><code>Rule: brute-force login detection
 IF   event = failed_login
 AND  same source_ip
 AND  count &gt; 10 within 1 minute
 THEN raise alert "Possible brute force" (severity: medium)
</code></pre>
<p>One failed login is noise; ten from the same IP in a minute is a pattern worth an alert.</p>
<div class="callout"><span class="badge">Signal vs noise</span> A good SIEM rule fires on the pattern, not every event. Too broad and analysts drown in false positives (alert fatigue); too narrow and real attacks slip through.</div>`,
    `<span class="eyebrow">CSO301 · Chương 2 · Bài 2.1</span>
<h2>Giám sát &amp; SIEM</h2>
<h3>Log — nguyên liệu thô của phòng thủ</h3>
<p>Mọi thứ người phòng thủ biết đều bắt đầu từ một <strong>log</strong>: kết nối tường lửa, sự kiện bảo mật Windows, request web-server, các lần đăng nhập. <strong>Quản lý log</strong> nghĩa là thu thập chúng, chuẩn hoá các định dạng khác nhau về chung một bộ trường, và lưu trữ để tra cứu được.</p>
<h3>SIEM làm gì</h3>
<p><strong>SIEM (Quản lý thông tin &amp; sự kiện an ninh)</strong> là bộ não trung tâm: nó nạp log từ mọi nơi, rồi dùng <strong>luật tương quan (correlation)</strong> để nối các sự kiện rời rạc thành một tín hiệu có nghĩa, và bắn <strong>cảnh báo (alert)</strong>.</p>
<ul>
<li><strong>Splunk</strong> — SIEM thương mại mạnh, dùng ngôn ngữ truy vấn SPL.</li>
<li><strong>Elastic Stack (ELK)</strong> — mã nguồn mở: Elasticsearch lưu, Logstash/Beats nạp, Kibana trực quan hoá.</li>
</ul>
<h3>Tương quan trong thực tế</h3>
<pre><code>Luật: phát hiện brute-force đăng nhập
 NẾU  event = failed_login
 VÀ   cùng source_ip
 VÀ   đếm &gt; 10 trong 1 phút
 THÌ  bắn cảnh báo "Nghi brute force" (mức: trung bình)
</code></pre>
<p>Một lần đăng nhập thất bại là nhiễu; mười lần từ cùng một IP trong một phút là một mẫu đáng cảnh báo.</p>
<div class="callout"><span class="badge">Tín hiệu và nhiễu</span> Một luật SIEM tốt bắn theo mẫu, không phải mọi sự kiện. Rộng quá thì analyst chìm trong dương tính giả (alert fatigue); hẹp quá thì tấn công thật lọt qua.</div>`,
  ]]);

const c2q = quiz('cso301-quiz-2', 'Quiz 2 — Monitoring & SIEM|||Quiz 2 — Giám sát & SIEM', [
  { id: 'q1', question: 'What is the main job of a SIEM?|||Nhiệm vụ chính của SIEM là gì?', options: ['Encrypt all disks|||Mã hoá mọi ổ đĩa', 'Collect logs, correlate events and raise alerts|||Gom log, tương quan sự kiện và bắn cảnh báo', 'Attack the network|||Tấn công mạng', 'Patch software|||Vá phần mềm'], correctIndex: 1, explanation: 'SIEM nạp log, dùng luật tương quan để nối sự kiện và sinh cảnh báo.' },
  { id: 'q2', question: 'In the ELK stack, which tool stores and searches the data?|||Trong ELK, công cụ nào lưu và tìm kiếm dữ liệu?', options: ['Kibana', 'Logstash', 'Elasticsearch', 'Beats'], correctIndex: 2, explanation: 'Elasticsearch lưu và tìm kiếm; Kibana trực quan hoá; Logstash/Beats nạp.' },
  { id: 'q3', question: 'Too many low-value alerts overwhelming analysts is called?|||Quá nhiều cảnh báo giá trị thấp làm analyst quá tải gọi là?', options: ['Alert fatigue|||Mệt mỏi vì cảnh báo', 'Zero day|||Lỗ hổng zero-day', 'Correlation|||Tương quan', 'Baseline|||Đường nền'], correctIndex: 0, explanation: 'Alert fatigue: luật quá rộng sinh nhiều dương tính giả làm analyst kiệt sức.' },
]);

const c3 = doc('cso301-3-1-threat-detection', '3.1 — Threat detection|||3.1 — Phát hiện mối đe doạ',
  'Phát hiện dựa trên chữ ký vs bất thường; IDS/IPS (Snort/Suricata); MITRE ATT&CK (tactic/technique); IOC vs IOA; ví dụ ánh xạ phát hiện sang ATT&CK.',
  [[
    `<span class="eyebrow">CSO301 · Chapter 3 · Lesson 3.1</span>
<h2>Threat detection</h2>
<h3>Two ways to detect</h3>
<ul>
<li><strong>Signature-based</strong> — matches known-bad patterns (a specific malware hash, a known exploit string). Fast and accurate, but blind to new attacks.</li>
<li><strong>Anomaly-based</strong> — learns a baseline of normal, flags deviations. Can catch novel attacks, but produces more false positives.</li>
</ul>
<h3>IDS / IPS</h3>
<p>An <strong>IDS (Intrusion Detection System)</strong> watches traffic and <em>alerts</em>; an <strong>IPS (Intrusion Prevention System)</strong> sits inline and can <em>block</em>. <strong>Snort</strong> and <strong>Suricata</strong> are the classic open-source engines.</p>
<h3>MITRE ATT&amp;CK — a shared map</h3>
<p><strong>MITRE ATT&amp;CK</strong> is a catalog of how real adversaries behave, organized as <strong>tactics</strong> (the goal — e.g. Initial Access, Persistence, Exfiltration) and <strong>techniques</strong> (the how — e.g. T1566 Phishing). Mapping detections to ATT&amp;CK shows exactly which attacker behaviors you can and cannot see.</p>
<h3>IOC vs IOA</h3>
<pre><code>IOC (Indicator of Compromise) = evidence it ALREADY happened
   e.g. malicious IP, file hash, suspicious domain
IOA (Indicator of Attack)     = behavior of an attack IN PROGRESS
   e.g. process spawning powershell that downloads a file
</code></pre>
<div class="callout"><span class="badge">Why IOAs matter</span> IOCs age fast — attackers change IPs and hashes daily. IOAs describe behavior, which is much harder for an attacker to change, so behavior-based detection lasts longer.</div>`,
    `<span class="eyebrow">CSO301 · Chương 3 · Bài 3.1</span>
<h2>Phát hiện mối đe doạ</h2>
<h3>Hai cách phát hiện</h3>
<ul>
<li><strong>Theo chữ ký (signature)</strong> — khớp mẫu đã biết là xấu (hash mã độc cụ thể, chuỗi khai thác đã biết). Nhanh và chính xác, nhưng mù với tấn công mới.</li>
<li><strong>Theo bất thường (anomaly)</strong> — học đường nền bình thường, đánh dấu sai lệch. Bắt được tấn công mới lạ, nhưng sinh nhiều dương tính giả hơn.</li>
</ul>
<h3>IDS / IPS</h3>
<p><strong>IDS (Hệ phát hiện xâm nhập)</strong> theo dõi lưu lượng và <em>cảnh báo</em>; <strong>IPS (Hệ ngăn chặn xâm nhập)</strong> nằm trên đường đi và có thể <em>chặn</em>. <strong>Snort</strong> và <strong>Suricata</strong> là hai engine mã nguồn mở kinh điển.</p>
<h3>MITRE ATT&amp;CK — tấm bản đồ chung</h3>
<p><strong>MITRE ATT&amp;CK</strong> là danh mục cách kẻ tấn công thật hành động, tổ chức thành <strong>chiến thuật (tactic)</strong> (mục tiêu — vd Initial Access, Persistence, Exfiltration) và <strong>kỹ thuật (technique)</strong> (cách làm — vd T1566 Phishing). Ánh xạ phát hiện sang ATT&amp;CK cho thấy chính xác hành vi nào của kẻ tấn công bạn thấy được và không thấy được.</p>
<h3>IOC và IOA</h3>
<pre><code>IOC (Dấu hiệu bị xâm nhập) = bằng chứng việc ĐÃ xảy ra
   vd IP độc hại, hash tệp, tên miền khả nghi
IOA (Dấu hiệu đang tấn công) = hành vi của tấn công ĐANG diễn ra
   vd tiến trình sinh ra powershell rồi tải tệp về
</code></pre>
<div class="callout"><span class="badge">Vì sao IOA quan trọng</span> IOC mau cũ — kẻ tấn công đổi IP và hash mỗi ngày. IOA mô tả hành vi, thứ khó đổi hơn nhiều, nên phát hiện theo hành vi bền hơn.</div>`,
  ]]);

const c3q = quiz('cso301-quiz-3', 'Quiz 3 — Threat detection|||Quiz 3 — Phát hiện mối đe doạ', [
  { id: 'q1', question: 'What does MITRE ATT&CK catalog?|||MITRE ATT&CK lập danh mục về điều gì?', options: ['Firewall brands|||Các hãng tường lửa', 'Adversary tactics and techniques|||Chiến thuật và kỹ thuật của kẻ tấn công', 'Password policies|||Chính sách mật khẩu', 'Encryption keys|||Khoá mã hoá'], correctIndex: 1, explanation: 'ATT&CK là kho tri thức chiến thuật (tactic) và kỹ thuật (technique) của kẻ tấn công.' },
  { id: 'q2', question: 'An IPS differs from an IDS because it can?|||IPS khác IDS ở chỗ nó có thể?', options: ['Only log traffic|||Chỉ ghi log lưu lượng', 'Block traffic inline|||Chặn lưu lượng trực tiếp trên đường đi', 'Encrypt disks|||Mã hoá ổ đĩa', 'Write correlation rules|||Viết luật tương quan'], correctIndex: 1, explanation: 'IDS chỉ cảnh báo; IPS nằm inline và có thể chặn lưu lượng.' },
  { id: 'q3', question: 'Which describes behavior of an attack in progress?|||Cái nào mô tả hành vi của một tấn công đang diễn ra?', options: ['IOC', 'IOA', 'CVSS', 'HDRI'], correctIndex: 1, explanation: 'IOA (Indicator of Attack) mô tả hành vi đang diễn ra; IOC là bằng chứng đã xảy ra.' },
]);

const c4 = doc('cso301-4-1-incident-response', '4.1 — Incident response|||4.1 — Ứng phó sự cố',
  'Sự cố là gì; NIST SP 800-61 và 4 pha (chuẩn bị → phát hiện & phân tích → khống chế/diệt trừ/khôi phục → rút kinh nghiệm); containment, eradication, recovery; ví dụ ransomware.',
  [[
    `<span class="eyebrow">CSO301 · Chapter 4 · Lesson 4.1</span>
<h2>Incident response</h2>
<h3>Alert vs incident</h3>
<p>An <strong>alert</strong> is a signal that might be bad. An <strong>incident</strong> is a confirmed event that harms (or threatens) confidentiality, integrity or availability. Incident response (IR) is the disciplined process of handling one without making it worse.</p>
<h3>The NIST SP 800-61 life cycle</h3>
<pre><code>1. Preparation            -> tools, playbooks, training, contacts
2. Detection &amp; Analysis   -> confirm it is real, scope it
3. Containment,
   Eradication &amp; Recovery -> stop spread, remove threat, restore
4. Post-Incident Activity -> lessons learned, improve
</code></pre>
<h3>The three actions in the middle</h3>
<ul>
<li><strong>Containment</strong> — limit the damage now (isolate the host, block the IP). Short-term first, then longer-term.</li>
<li><strong>Eradication</strong> — remove the root cause (delete malware, close the exploited hole, reset credentials).</li>
<li><strong>Recovery</strong> — restore systems to normal and monitor closely to confirm the threat is gone.</li>
</ul>
<div class="callout"><span class="badge">Real example — ransomware</span> Detect the encryption alert → <strong>contain</strong> by pulling the infected machine off the network → <strong>eradicate</strong> the malware and patch the entry point → <strong>recover</strong> from clean backups → write the lessons learned so it cannot happen the same way twice.</div>`,
    `<span class="eyebrow">CSO301 · Chương 4 · Bài 4.1</span>
<h2>Ứng phó sự cố</h2>
<h3>Cảnh báo và sự cố</h3>
<p>Một <strong>cảnh báo (alert)</strong> là tín hiệu có thể là xấu. Một <strong>sự cố (incident)</strong> là sự việc đã xác nhận gây hại (hoặc đe doạ) tính bí mật, toàn vẹn hay sẵn sàng. Ứng phó sự cố (IR) là quy trình kỷ luật để xử lý mà không làm mọi thứ tệ hơn.</p>
<h3>Vòng đời NIST SP 800-61</h3>
<pre><code>1. Chuẩn bị              -> công cụ, playbook, đào tạo, liên hệ
2. Phát hiện &amp; Phân tích -> xác nhận là thật, xác định phạm vi
3. Khống chế, Diệt trừ
   &amp; Khôi phục            -> chặn lan, gỡ mối đe doạ, phục hồi
4. Sau sự cố             -> rút kinh nghiệm, cải thiện
</code></pre>
<h3>Ba hành động ở giữa</h3>
<ul>
<li><strong>Khống chế (containment)</strong> — hạn chế thiệt hại ngay (cách ly máy, chặn IP). Ngắn hạn trước, rồi dài hạn.</li>
<li><strong>Diệt trừ (eradication)</strong> — loại bỏ nguyên nhân gốc (xoá mã độc, vá lỗ hổng bị khai thác, đặt lại thông tin đăng nhập).</li>
<li><strong>Khôi phục (recovery)</strong> — đưa hệ thống về bình thường và giám sát sát sao để chắc chắn mối đe doạ đã hết.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật — ransomware</span> Phát hiện cảnh báo mã hoá → <strong>khống chế</strong> bằng cách rút máy nhiễm khỏi mạng → <strong>diệt trừ</strong> mã độc và vá điểm xâm nhập → <strong>khôi phục</strong> từ bản sao lưu sạch → viết bài học để không tái diễn theo cùng một cách.</div>`,
  ]]);

const c4q = quiz('cso301-quiz-4', 'Quiz 4 — Incident response|||Quiz 4 — Ứng phó sự cố', [
  { id: 'q1', question: 'Which standard defines the incident-handling life cycle used here?|||Chuẩn nào định nghĩa vòng đời xử lý sự cố dùng ở đây?', options: ['NIST SP 800-61', 'ISO 9001', 'PCI PIN', 'RFC 1918'], correctIndex: 0, explanation: 'NIST SP 800-61 — Computer Security Incident Handling Guide.' },
  { id: 'q2', question: 'Isolating an infected host to stop the spread is which step?|||Cách ly máy nhiễm để chặn lây lan là bước nào?', options: ['Eradication|||Diệt trừ', 'Containment|||Khống chế', 'Recovery|||Khôi phục', 'Preparation|||Chuẩn bị'], correctIndex: 1, explanation: 'Khống chế (containment) hạn chế thiệt hại ngay, trước khi diệt trừ và khôi phục.' },
  { id: 'q3', question: 'Removing the malware and closing the exploited hole is?|||Gỡ mã độc và bịt lỗ hổng bị khai thác là?', options: ['Detection|||Phát hiện', 'Recovery|||Khôi phục', 'Eradication|||Diệt trừ', 'Containment|||Khống chế'], correctIndex: 2, explanation: 'Diệt trừ (eradication) loại bỏ nguyên nhân gốc trước khi khôi phục.' },
]);

const c5 = doc('cso301-5-1-malware-forensics', '5.1 — Malware triage & basic forensics|||5.1 — Phân tích mã độc & pháp chứng cơ bản',
  'Phân loại mã độc (triage); phân tích tĩnh vs động; sandbox; pháp chứng cơ bản đĩa & bộ nhớ (RAM); chuỗi hành trình bằng chứng (chain of custody); ví dụ triage một tệp khả nghi.',
  [[
    `<span class="eyebrow">CSO301 · Chapter 5 · Lesson 5.1</span>
<h2>Malware triage &amp; basic forensics</h2>
<h3>Triage: is this file dangerous?</h3>
<p>When a suspicious file appears, you <strong>triage</strong> it — a quick assessment before deep analysis. Two approaches:</p>
<ul>
<li><strong>Static analysis</strong> — inspect without running: file hash, strings, imported functions. Safe, fast, but packers can hide the truth.</li>
<li><strong>Dynamic analysis</strong> — run it in a <strong>sandbox</strong> (isolated VM) and watch what it does: files created, network calls, registry changes.</li>
</ul>
<p>Check the hash against <strong>VirusTotal</strong> first — often someone has already identified it.</p>
<h3>Basic forensics: disk &amp; memory</h3>
<ul>
<li><strong>Disk forensics</strong> — recovers files, timelines and deleted data from storage. Slower, but survives a reboot.</li>
<li><strong>Memory (RAM) forensics</strong> — captures running processes, network connections and injected code that never touch disk. Must be collected <em>before</em> power-off.</li>
</ul>
<h3>Order of volatility &amp; chain of custody</h3>
<pre><code>Collect most-volatile first:
  RAM / running state  -> lost on power-off
  network connections  -> short-lived
  disk / files         -> persistent
Record every handover (who, when, hash) = chain of custody
</code></pre>
<div class="callout"><span class="badge">Why the hash matters</span> Hashing evidence when you collect it, and again later, proves it was not altered — essential if the incident ever reaches court.</div>`,
    `<span class="eyebrow">CSO301 · Chương 5 · Bài 5.1</span>
<h2>Phân tích mã độc &amp; pháp chứng cơ bản</h2>
<h3>Triage: tệp này có nguy hiểm không?</h3>
<p>Khi một tệp khả nghi xuất hiện, bạn <strong>phân loại (triage)</strong> nó — đánh giá nhanh trước khi phân tích sâu. Hai hướng:</p>
<ul>
<li><strong>Phân tích tĩnh (static)</strong> — soi mà không chạy: hash tệp, chuỗi ký tự, hàm import. An toàn, nhanh, nhưng packer có thể giấu sự thật.</li>
<li><strong>Phân tích động (dynamic)</strong> — chạy nó trong <strong>sandbox</strong> (máy ảo cách ly) và quan sát nó làm gì: tệp tạo ra, gọi mạng, thay đổi registry.</li>
</ul>
<p>Kiểm hash trên <strong>VirusTotal</strong> trước — thường đã có người nhận diện nó rồi.</p>
<h3>Pháp chứng cơ bản: đĩa &amp; bộ nhớ</h3>
<ul>
<li><strong>Pháp chứng đĩa</strong> — phục hồi tệp, dòng thời gian và dữ liệu đã xoá từ ổ lưu trữ. Chậm hơn, nhưng sống qua lần khởi động lại.</li>
<li><strong>Pháp chứng bộ nhớ (RAM)</strong> — chụp tiến trình đang chạy, kết nối mạng và mã tiêm không hề chạm đĩa. Phải thu thập <em>trước</em> khi tắt nguồn.</li>
</ul>
<h3>Thứ tự dễ bay hơi &amp; chuỗi hành trình bằng chứng</h3>
<pre><code>Thu cái dễ bay hơi nhất trước:
  RAM / trạng thái chạy -> mất khi tắt nguồn
  kết nối mạng          -> tồn tại ngắn
  đĩa / tệp             -> bền lâu
Ghi mọi lần bàn giao (ai, khi nào, hash) = chain of custody
</code></pre>
<div class="callout"><span class="badge">Vì sao cần hash</span> Băm bằng chứng lúc thu thập, rồi băm lại sau đó, chứng minh nó không bị sửa — thiết yếu nếu sự cố phải ra toà.</div>`,
  ]]);

const c5q = quiz('cso301-quiz-5', 'Quiz 5 — Malware & forensics|||Quiz 5 — Mã độc & pháp chứng', [
  { id: 'q1', question: 'Running malware in an isolated VM to watch its behavior is?|||Chạy mã độc trong máy ảo cách ly để xem hành vi là?', options: ['Static analysis|||Phân tích tĩnh', 'Dynamic analysis in a sandbox|||Phân tích động trong sandbox', 'Patching|||Vá lỗi', 'Encryption|||Mã hoá'], correctIndex: 1, explanation: 'Phân tích động chạy mẫu trong sandbox và quan sát hành vi.' },
  { id: 'q2', question: 'Which evidence must be captured before powering off a machine?|||Bằng chứng nào phải chụp trước khi tắt máy?', options: ['Disk files|||Tệp trên đĩa', 'Memory (RAM)|||Bộ nhớ (RAM)', 'Printed logs|||Log in ra giấy', 'Backup tapes|||Băng sao lưu'], correctIndex: 1, explanation: 'RAM dễ bay hơi, mất khi tắt nguồn, nên phải thu thập trước tiên.' },
  { id: 'q3', question: 'Recording who handled evidence, when, and its hash is called?|||Ghi lại ai xử lý bằng chứng, khi nào, và hash của nó gọi là?', options: ['Chain of custody|||Chuỗi hành trình bằng chứng', 'Correlation|||Tương quan', 'Sandboxing', 'Baselining|||Lập đường nền'], correctIndex: 0, explanation: 'Chain of custody chứng minh bằng chứng không bị thay đổi.' },
]);

const c6 = doc('cso301-6-1-threat-hunting', '6.1 — Threat hunting & threat intelligence|||6.1 — Săn lùng mối đe doạ & tình báo',
  'Săn lùng chủ động (proactive) vs chờ cảnh báo; săn theo giả thuyết (hypothesis-driven); threat intelligence (chiến lược/vận hành/chiến thuật); dùng ATT&CK định hướng; ví dụ một cuộc săn.',
  [[
    `<span class="eyebrow">CSO301 · Chapter 6 · Lesson 6.1</span>
<h2>Threat hunting &amp; threat intelligence</h2>
<h3>Hunting vs waiting</h3>
<p>Alerts are <em>reactive</em> — they fire after a rule matches. <strong>Threat hunting</strong> is <em>proactive</em>: you assume an attacker is already inside and go looking, even with no alert. It finds the threats detection rules missed.</p>
<h3>Hypothesis-driven hunting</h3>
<p>A good hunt starts with a testable <strong>hypothesis</strong>, not random searching:</p>
<pre><code>1. Hypothesis  -> "An attacker is using PowerShell for persistence."
2. Data        -> collect process + PowerShell logs
3. Search      -> look for encoded commands, odd parent processes
4. Conclude    -> found nothing (improve baseline) OR found it -> incident
</code></pre>
<h3>Threat intelligence</h3>
<p><strong>Threat intelligence</strong> is knowledge about adversaries that guides the hunt. It comes in levels:</p>
<ul>
<li><strong>Strategic</strong> — big-picture trends for leadership.</li>
<li><strong>Operational</strong> — which groups target your sector and how.</li>
<li><strong>Tactical</strong> — concrete TTPs and indicators to hunt for right now.</li>
</ul>
<div class="callout"><span class="badge">ATT&amp;CK drives the hunt</span> Pick a technique your telemetry cannot yet see (say T1059 Command &amp; Scripting Interpreter), hunt for it, then turn a successful hunt into a permanent detection rule.</div>`,
    `<span class="eyebrow">CSO301 · Chương 6 · Bài 6.1</span>
<h2>Săn lùng mối đe doạ &amp; tình báo</h2>
<h3>Săn lùng và chờ đợi</h3>
<p>Cảnh báo là <em>bị động</em> — chúng bắn sau khi một luật khớp. <strong>Săn lùng mối đe doạ</strong> là <em>chủ động</em>: bạn giả định kẻ tấn công đã ở bên trong và đi tìm, dù chưa có cảnh báo nào. Nó tìm ra thứ mà luật phát hiện bỏ sót.</p>
<h3>Săn theo giả thuyết</h3>
<p>Một cuộc săn tốt bắt đầu bằng một <strong>giả thuyết</strong> kiểm chứng được, không phải tìm ngẫu nhiên:</p>
<pre><code>1. Giả thuyết -> "Kẻ tấn công dùng PowerShell để trụ lại."
2. Dữ liệu    -> gom log tiến trình + PowerShell
3. Tìm        -> lệnh mã hoá, tiến trình cha bất thường
4. Kết luận   -> không thấy (cải thiện đường nền) HOẶC thấy -> sự cố
</code></pre>
<h3>Tình báo mối đe doạ</h3>
<p><strong>Tình báo mối đe doạ (threat intelligence)</strong> là hiểu biết về kẻ tấn công để định hướng cuộc săn. Nó có các mức:</p>
<ul>
<li><strong>Chiến lược</strong> — xu hướng toàn cảnh cho lãnh đạo.</li>
<li><strong>Vận hành</strong> — nhóm nào nhắm vào lĩnh vực của bạn và bằng cách nào.</li>
<li><strong>Chiến thuật</strong> — TTP và chỉ dấu cụ thể để săn ngay bây giờ.</li>
</ul>
<div class="callout"><span class="badge">ATT&amp;CK định hướng cuộc săn</span> Chọn một kỹ thuật mà dữ liệu của bạn chưa thấy được (vd T1059 Command &amp; Scripting Interpreter), săn nó, rồi biến cuộc săn thành công thành một luật phát hiện lâu dài.</div>`,
  ]]);

const c6q = quiz('cso301-quiz-6', 'Quiz 6 — Threat hunting|||Quiz 6 — Săn lùng mối đe doạ', [
  { id: 'q1', question: 'How does threat hunting differ from alert triage?|||Săn lùng khác phân loại cảnh báo ở chỗ nào?', options: ['It only reads reports|||Chỉ đọc báo cáo', 'It is proactive — searching without waiting for an alert|||Chủ động — tìm mà không chờ cảnh báo', 'It replaces backups|||Thay thế sao lưu', 'It is the same thing|||Giống hệt nhau'], correctIndex: 1, explanation: 'Săn lùng là chủ động: giả định đã bị xâm nhập và đi tìm dù chưa có cảnh báo.' },
  { id: 'q2', question: 'A good hunt starts with a?|||Một cuộc săn tốt bắt đầu bằng?', options: ['Random search|||Tìm kiếm ngẫu nhiên', 'Testable hypothesis|||Một giả thuyết kiểm chứng được', 'New firewall|||Tường lửa mới', 'Password reset|||Đặt lại mật khẩu'], correctIndex: 1, explanation: 'Săn theo giả thuyết: nêu giả thuyết, gom dữ liệu, tìm, kết luận.' },
  { id: 'q3', question: 'Concrete TTPs and indicators to hunt for now are which level of intel?|||TTP và chỉ dấu cụ thể để săn ngay thuộc mức tình báo nào?', options: ['Strategic|||Chiến lược', 'Tactical|||Chiến thuật', 'Financial|||Tài chính', 'Physical|||Vật lý'], correctIndex: 1, explanation: 'Tình báo chiến thuật cung cấp TTP và chỉ dấu cụ thể để hành động ngay.' },
]);

const c7 = doc('cso301-7-1-vulnerability-management', '7.1 — Vulnerability management & patching|||7.1 — Quản lý lỗ hổng & vá',
  'Lỗ hổng vs khai thác; quét lỗ hổng (Nessus/OpenVAS); CVE & CVSS (điểm mức độ nghiêm trọng); ưu tiên & vòng đời vá; quản lý bản vá; ví dụ tính điểm CVSS.',
  [[
    `<span class="eyebrow">CSO301 · Chapter 7 · Lesson 7.1</span>
<h2>Vulnerability management &amp; patching</h2>
<h3>Vulnerability, exploit, risk</h3>
<p>A <strong>vulnerability</strong> is a weakness; an <strong>exploit</strong> is code that abuses it; <strong>risk</strong> is the chance and impact of that happening. Vulnerability management is the ongoing cycle of finding and fixing weaknesses before attackers use them.</p>
<h3>Scanning</h3>
<p><strong>Vulnerability scanners</strong> like <strong>Nessus</strong> and <strong>OpenVAS</strong> check systems against a database of known issues and report what they find. A scan is a snapshot — you run it regularly, not once.</p>
<h3>CVE and CVSS</h3>
<ul>
<li><strong>CVE</strong> — a unique ID for a publicly known vulnerability (e.g. CVE-2021-44228, Log4Shell).</li>
<li><strong>CVSS</strong> — a 0–10 score for how severe it is, so you can prioritize.</li>
</ul>
<pre><code>CVSS severity bands:
  0.1 - 3.9  Low
  4.0 - 6.9  Medium
  7.0 - 8.9  High
  9.0 - 10.0 Critical  -> patch first
</code></pre>
<h3>The patch life cycle</h3>
<p>Discover → assess (CVSS + is it exploitable here?) → prioritize → <strong>test the patch</strong> → deploy → verify. Never skip testing: a bad patch can break production as surely as an attacker can.</p>
<div class="callout"><span class="badge">Prioritize by risk, not count</span> A hundred low findings on an internal test box matter less than one critical, internet-facing, actively-exploited CVE. Score, context and exposure decide the order.</div>`,
    `<span class="eyebrow">CSO301 · Chương 7 · Bài 7.1</span>
<h2>Quản lý lỗ hổng &amp; vá</h2>
<h3>Lỗ hổng, khai thác, rủi ro</h3>
<p>Một <strong>lỗ hổng (vulnerability)</strong> là điểm yếu; một <strong>khai thác (exploit)</strong> là mã lợi dụng nó; <strong>rủi ro (risk)</strong> là khả năng và mức tác động khi việc đó xảy ra. Quản lý lỗ hổng là chu trình liên tục tìm và sửa điểm yếu trước khi kẻ tấn công dùng.</p>
<h3>Quét lỗ hổng</h3>
<p><strong>Máy quét lỗ hổng</strong> như <strong>Nessus</strong> và <strong>OpenVAS</strong> đối chiếu hệ thống với cơ sở dữ liệu vấn đề đã biết và báo cáo cái tìm được. Một lần quét là một ảnh chụp — bạn quét định kỳ, không phải một lần.</p>
<h3>CVE và CVSS</h3>
<ul>
<li><strong>CVE</strong> — mã định danh duy nhất cho một lỗ hổng công khai đã biết (vd CVE-2021-44228, Log4Shell).</li>
<li><strong>CVSS</strong> — điểm 0–10 cho mức độ nghiêm trọng, để bạn ưu tiên.</li>
</ul>
<pre><code>Các mức nghiêm trọng CVSS:
  0.1 - 3.9  Thấp
  4.0 - 6.9  Trung bình
  7.0 - 8.9  Cao
  9.0 - 10.0 Nghiêm trọng -> vá trước tiên
</code></pre>
<h3>Vòng đời vá lỗi</h3>
<p>Phát hiện → đánh giá (CVSS + có khai thác được ở đây không?) → ưu tiên → <strong>thử bản vá</strong> → triển khai → xác minh. Đừng bỏ bước thử: một bản vá tồi có thể làm sập production chắc chắn như kẻ tấn công vậy.</p>
<div class="callout"><span class="badge">Ưu tiên theo rủi ro, không theo số lượng</span> Một trăm lỗi mức thấp trên máy test nội bộ ít quan trọng hơn một CVE nghiêm trọng, phơi ra Internet, đang bị khai thác. Điểm số, ngữ cảnh và mức phơi bày quyết định thứ tự.</div>`,
  ]]);

const c7q = quiz('cso301-quiz-7', 'Quiz 7 — Vulnerability management|||Quiz 7 — Quản lý lỗ hổng', [
  { id: 'q1', question: 'What does a CVSS score measure?|||Điểm CVSS đo cái gì?', options: ['Network speed|||Tốc độ mạng', 'The severity of a vulnerability (0–10)|||Mức nghiêm trọng của một lỗ hổng (0–10)', 'The number of users|||Số người dùng', 'Disk size|||Dung lượng đĩa'], correctIndex: 1, explanation: 'CVSS chấm 0–10 cho mức nghiêm trọng để ưu tiên vá.' },
  { id: 'q2', question: 'A unique public identifier for a known vulnerability is a?|||Mã định danh công khai duy nhất cho một lỗ hổng đã biết là?', options: ['CVE', 'SIEM', 'IOA', 'SOAR'], correctIndex: 0, explanation: 'CVE (Common Vulnerabilities and Exposures) định danh từng lỗ hổng công khai.' },
  { id: 'q3', question: 'Which step must never be skipped before deploying a patch?|||Bước nào tuyệt đối không bỏ trước khi triển khai bản vá?', options: ['Testing the patch|||Thử bản vá', 'Deleting all logs|||Xoá hết log', 'Disabling the firewall|||Tắt tường lửa', 'Emailing customers|||Gửi email khách hàng'], correctIndex: 0, explanation: 'Một bản vá chưa thử có thể làm sập production; luôn thử trước khi triển khai.' },
]);

const c8 = doc('cso301-8-1-automation-operations', '8.1 — Automation, SOC operations & ethics|||8.1 — Tự động hoá, vận hành SOC & đạo đức',
  'SOAR & playbook (tự động hoá ứng phó); chỉ số/KPI SOC (MTTD, MTTR); cải tiến liên tục; đạo đức nghề & tuân thủ (quyền riêng tư, luật, GDPR/NIST CSF).',
  [[
    `<span class="eyebrow">CSO301 · Chapter 8 · Lesson 8.1</span>
<h2>Automation, SOC operations &amp; ethics</h2>
<h3>SOAR &amp; playbooks</h3>
<p>Analysts cannot hand-handle every alert. <strong>SOAR (Security Orchestration, Automation and Response)</strong> connects tools and runs <strong>playbooks</strong> — codified, repeatable response steps — so routine work happens in seconds.</p>
<pre><code>Playbook: suspected phishing email
 1. Extract sender, URLs, attachments
 2. Check reputation (VirusTotal, threat intel)
 3. If malicious -> quarantine the email for all users
 4. Open a ticket, notify the analyst
</code></pre>
<h3>Measuring a SOC</h3>
<ul>
<li><strong>MTTD (Mean Time to Detect)</strong> — how long until you notice an attack.</li>
<li><strong>MTTR (Mean Time to Respond)</strong> — how long until you contain it.</li>
<li>Fewer false positives, more alerts closed — the goal is faster and more accurate over time.</li>
</ul>
<h3>Ethics &amp; compliance</h3>
<p>A SOC analyst sees everything — emails, files, browsing. That power carries duties:</p>
<ul>
<li><strong>Privacy &amp; least privilege</strong> — access only what an investigation needs.</li>
<li><strong>Compliance</strong> — follow law and frameworks (GDPR for personal data, the NIST CSF for structure, industry rules like PCI DSS).</li>
<li><strong>Integrity</strong> — handle evidence honestly; never abuse access.</li>
</ul>
<div class="callout"><span class="badge">Automate the boring, keep judgment human</span> SOAR should remove repetitive toil so analysts spend their time on the decisions that need a human — scoping, judgment calls and ethics.</div>`,
    `<span class="eyebrow">CSO301 · Chương 8 · Bài 8.1</span>
<h2>Tự động hoá, vận hành SOC &amp; đạo đức</h2>
<h3>SOAR &amp; playbook</h3>
<p>Analyst không thể xử tay mọi cảnh báo. <strong>SOAR (Điều phối, tự động hoá &amp; ứng phó an ninh)</strong> kết nối các công cụ và chạy <strong>playbook</strong> — các bước ứng phó được mã hoá, lặp lại được — để việc thường quy diễn ra trong vài giây.</p>
<pre><code>Playbook: nghi email lừa đảo
 1. Trích người gửi, URL, tệp đính kèm
 2. Kiểm uy tín (VirusTotal, threat intel)
 3. Nếu độc hại -> cách ly email cho mọi người dùng
 4. Mở ticket, báo cho analyst
</code></pre>
<h3>Đo lường một SOC</h3>
<ul>
<li><strong>MTTD (thời gian phát hiện trung bình)</strong> — mất bao lâu để nhận ra một tấn công.</li>
<li><strong>MTTR (thời gian ứng phó trung bình)</strong> — mất bao lâu để khống chế nó.</li>
<li>Ít dương tính giả hơn, đóng được nhiều cảnh báo hơn — mục tiêu là nhanh hơn và chính xác hơn theo thời gian.</li>
</ul>
<h3>Đạo đức &amp; tuân thủ</h3>
<p>Một SOC analyst nhìn thấy mọi thứ — email, tệp, lịch sử duyệt web. Quyền đó đi kèm bổn phận:</p>
<ul>
<li><strong>Riêng tư &amp; đặc quyền tối thiểu</strong> — chỉ truy cập thứ mà cuộc điều tra cần.</li>
<li><strong>Tuân thủ</strong> — theo luật và khung chuẩn (GDPR cho dữ liệu cá nhân, NIST CSF cho cấu trúc, quy định ngành như PCI DSS).</li>
<li><strong>Chính trực</strong> — xử lý bằng chứng trung thực; không bao giờ lạm dụng quyền truy cập.</li>
</ul>
<div class="callout"><span class="badge">Tự động hoá việc nhàm, giữ phán đoán cho con người</span> SOAR nên loại bỏ việc lặp đi lặp lại để analyst dành thời gian cho những quyết định cần con người — xác định phạm vi, phán đoán và đạo đức.</div>`,
  ]]);

const c8q = quiz('cso301-quiz-8', 'Quiz 8 — Automation & operations|||Quiz 8 — Tự động hoá & vận hành', [
  { id: 'q1', question: 'What does SOAR primarily do?|||SOAR chủ yếu làm gì?', options: ['Encrypt disks|||Mã hoá ổ đĩa', 'Orchestrate tools and run automated response playbooks|||Điều phối công cụ và chạy playbook ứng phó tự động', 'Scan for CVEs only|||Chỉ quét CVE', 'Train the red team|||Huấn luyện red team'], correctIndex: 1, explanation: 'SOAR kết nối công cụ và chạy playbook để tự động hoá ứng phó.' },
  { id: 'q2', question: 'MTTR measures?|||MTTR đo cái gì?', options: ['Mean time to respond / contain|||Thời gian ứng phó / khống chế trung bình', 'Number of servers|||Số máy chủ', 'Password length|||Độ dài mật khẩu', 'Log storage size|||Dung lượng lưu log'], correctIndex: 0, explanation: 'MTTR = thời gian trung bình để ứng phó và khống chế một sự cố.' },
  { id: 'q3', question: 'An analyst should access user data based on which principle?|||Analyst nên truy cập dữ liệu người dùng theo nguyên tắc nào?', options: ['Access everything always|||Luôn truy cập mọi thứ', 'Least privilege — only what the investigation needs|||Đặc quyền tối thiểu — chỉ thứ cuộc điều tra cần', 'Never access anything|||Không bao giờ truy cập gì', 'Share access freely|||Chia sẻ quyền thoải mái'], correctIndex: 1, explanation: 'Đặc quyền tối thiểu: chỉ truy cập đúng thứ cần cho điều tra, tôn trọng riêng tư.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CSO301',
    slug: 'cso301-cybersecurity-operations',
    title: 'Cybersecurity Operations',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSO301.webp',
    shortDescription: 'Defend as a blue team SOC — SIEM & log monitoring (Splunk/ELK), threat detection with MITRE ATT&CK, incident response (NIST 800-61), malware triage & forensics, threat hunting, vulnerability management (CVSS) and SOAR. Bilingual, with quizzes.|||Phòng thủ như blue team trong SOC — SIEM & giám sát log (Splunk/ELK), phát hiện bằng MITRE ATT&CK, ứng phó sự cố (NIST 800-61), mã độc & pháp chứng, săn lùng, quản lý lỗ hổng (CVSS) và SOAR. Song ngữ, có quiz.',
    description: 'Môn <strong>CSO301 — Cybersecurity Operations</strong> (kỳ 5, ngành Khoa học Máy tính) dạy bạn phòng thủ một tổ chức đang chạy thật — công việc của một <strong>blue team</strong> trong <strong>SOC</strong>. Đi qua cả vòng: <strong>vận hành an ninh &amp; SOC</strong> (CIA, phòng thủ theo chiều sâu) → <strong>giám sát &amp; SIEM</strong> (Splunk/ELK, correlation) → <strong>phát hiện mối đe doạ</strong> (IDS/IPS, MITRE ATT&amp;CK, IOC/IOA) → <strong>ứng phó sự cố</strong> (NIST SP 800-61) → <strong>phân tích mã độc &amp; pháp chứng</strong> → <strong>săn lùng mối đe doạ</strong> → <strong>quản lý lỗ hổng</strong> (CVE/CVSS) → <strong>tự động hoá (SOAR) &amp; đạo đức</strong>. Bám nguồn chuẩn quốc tế (Cisco CyberOps, Blue Team Handbook, NIST, MITRE ATT&amp;CK, SANS), song ngữ, có công cụ thật, quy trình và quiz mỗi chương.',
    whatYouLearn: 'Bộ ba CIA &amp; phòng thủ theo chiều sâu; vai trò SOC (analyst L1/L2/L3); quản lý log &amp; SIEM (Splunk/ELK, correlation rule, alert); phát hiện theo chữ ký vs bất thường, IDS/IPS (Snort/Suricata); MITRE ATT&amp;CK, IOC vs IOA; ứng phó sự cố theo NIST SP 800-61 (containment/eradication/recovery); triage mã độc (static/dynamic, sandbox) &amp; pháp chứng đĩa/bộ nhớ, chain of custody; săn lùng theo giả thuyết &amp; threat intelligence; quản lý lỗ hổng (Nessus/OpenVAS, CVE, CVSS, vòng đời vá); SOAR &amp; playbook, chỉ số SOC (MTTD/MTTR), đạo đức &amp; tuân thủ.',
    requirements: 'Kiến thức mạng máy tính cơ bản (TCP/IP, HTTP, DNS) và hệ điều hành. Nên có tài khoản lab miễn phí (TryHackMe/LetsDefend) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, chuẩn NIST/MITRE, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Blue team, SOC, bộ ba CIA, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vận hành an ninh & SOC|||Chapter 1 — Security operations & SOC', description: 'SecOps, SOC, blue team, CIA, phòng thủ theo chiều sâu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Giám sát & SIEM|||Chapter 2 — Monitoring & SIEM', description: 'Log management, SIEM, Splunk/ELK, correlation, alert.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phát hiện mối đe doạ|||Chapter 3 — Threat detection', description: 'IDS/IPS, MITRE ATT&CK, IOC/IOA.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ứng phó sự cố|||Chapter 4 — Incident response', description: 'NIST SP 800-61, containment/eradication/recovery.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mã độc & pháp chứng|||Chapter 5 — Malware & forensics', description: 'Triage, sandbox, pháp chứng đĩa/RAM, chain of custody.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Săn lùng mối đe doạ|||Chapter 6 — Threat hunting', description: 'Săn theo giả thuyết, threat intelligence, ATT&CK.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quản lý lỗ hổng & vá|||Chapter 7 — Vulnerability management', description: 'Quét lỗ hổng, CVE, CVSS, vòng đời vá.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tự động hoá & vận hành|||Chapter 8 — Automation & operations', description: 'SOAR, playbook, chỉ số SOC, đạo đức & tuân thủ.', lessons: [c8, c8q] },
  ],
};
