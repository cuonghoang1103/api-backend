/**
 * IA_GRA_ELE — Graduation Elective - Information Assurance (Học phần tự chọn
 * tốt nghiệp — An toàn thông tin), ngành ATTT, Kỳ 9, FPTU.
 * HỌC PHẦN TỰ CHỌN: không có nội dung cố định. Khung này hướng dẫn sinh viên
 * CHỌN & TỰ HỌC một chủ đề ATTT nâng cao + làm mini-project (định hướng
 * PHÒNG THỦ/giáo dục, nhấn mạnh đạo đức & hợp pháp). Song ngữ VI+EN.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n; escape <→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ia-gra-ele-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: quy định học phần tốt nghiệp (FLM/FAP), khung an ninh (NIST, OWASP, SANS), khoá học miễn phí (Coursera/edX), lab hợp pháp, lộ trình tự chọn chủ đề.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This is a <strong>graduation elective</strong> — there is no fixed syllabus. You <strong>choose an advanced information-security topic</strong>, study it self-directed, and deliver a <strong>defensive, educational mini-project</strong>. Everything below is free, legal and reputable. Follow FPTU's official graduation-elective rules on <strong>FLM/FAP</strong>.</p>
<h3>📘 Official rules &amp; syllabus</h3>
<p>The graduation-elective regulations, deliverables and rubric for your cohort are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> and <a href="https://fap.fpt.edu.vn" target="_blank" rel="noopener">FAP</a> — sign in with your FPTU account. <strong>Do not upload the PDF anywhere</strong>; read it in place.</p>
<h3>🌐 Security frameworks &amp; standards</h3>
<ul>
<li><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener">NIST Cybersecurity Framework &amp; SP 800 series</a></li>
<li><a href="https://owasp.org/" target="_blank" rel="noopener">OWASP — Top 10, ASVS, Cheat Sheets</a></li>
<li><a href="https://www.sans.org/security-resources/" target="_blank" rel="noopener">SANS — reading room &amp; free resources</a></li>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK — adversary tactics &amp; techniques</a></li>
</ul>
<h3>🎓 Free courses</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera — audit security specializations for free</a></li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX — university cybersecurity courses</a></li>
</ul>
<h3>🧪 Legal hands-on labs</h3>
<ul>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe — guided beginner-friendly rooms</a></li>
<li><a href="https://www.hackthebox.com/" target="_blank" rel="noopener">Hack The Box — machines &amp; academy</a></li>
<li><a href="https://ctftime.org/" target="_blank" rel="noopener">CTFtime — capture-the-flag events</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Pick</strong> — choose one advanced topic aligned with a career direction (Chapter 1).</li>
<li><strong>Map &amp; scope</strong> — survey the field, narrow to a defensive question (Chapters 2, 5).</li>
<li><strong>Practise safely</strong> — build an isolated lab, only on systems you own or are authorised to test (Chapter 3).</li>
<li><strong>Deliver</strong> — mini-project, report, presentation, and a path to a certification (Chapters 6-8).</li>
</ol></div>`,
    `<span class="eyebrow">IA_GRA_ELE · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Đây là <strong>học phần tự chọn tốt nghiệp</strong> — không có giáo trình cố định. Bạn <strong>tự chọn một chủ đề An toàn thông tin nâng cao</strong>, tự học có định hướng, và nộp một <strong>mini-project mang tính phòng thủ, giáo dục</strong>. Mọi nguồn dưới đây đều miễn phí, hợp pháp và uy tín. Theo đúng quy định học phần tốt nghiệp của FPTU trên <strong>FLM/FAP</strong>.</p>
<h3>📘 Quy định &amp; đề cương chính thức</h3>
<p>Quy định học phần tự chọn tốt nghiệp, danh mục sản phẩm nộp và rubric cho khoá của bạn nằm trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> và <a href="https://fap.fpt.edu.vn" target="_blank" rel="noopener">FAP</a> — đăng nhập bằng tài khoản FPTU. <strong>Đừng upload file PDF lên bất cứ đâu</strong>; đọc tại chỗ.</p>
<h3>🌐 Khung &amp; tiêu chuẩn an ninh</h3>
<ul>
<li><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener">NIST Cybersecurity Framework &amp; bộ SP 800</a></li>
<li><a href="https://owasp.org/" target="_blank" rel="noopener">OWASP — Top 10, ASVS, Cheat Sheets</a></li>
<li><a href="https://www.sans.org/security-resources/" target="_blank" rel="noopener">SANS — thư viện &amp; tài liệu miễn phí</a></li>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK — chiến thuật &amp; kỹ thuật của kẻ tấn công</a></li>
</ul>
<h3>🎓 Khoá học miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera — học ké (audit) miễn phí các chuyên đề bảo mật</a></li>
<li><a href="https://www.edx.org/" target="_blank" rel="noopener">edX — khoá an ninh mạng của các đại học</a></li>
</ul>
<h3>🧪 Lab thực hành hợp pháp</h3>
<ul>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe — phòng lab có hướng dẫn, hợp cho người mới</a></li>
<li><a href="https://www.hackthebox.com/" target="_blank" rel="noopener">Hack The Box — máy ảo &amp; academy</a></li>
<li><a href="https://ctftime.org/" target="_blank" rel="noopener">CTFtime — các giải capture-the-flag</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Chọn</strong> — chọn một chủ đề nâng cao khớp với định hướng nghề (Chương 1).</li>
<li><strong>Vẽ bản đồ &amp; khoanh vùng</strong> — khảo sát lĩnh vực, thu về một câu hỏi phòng thủ (Chương 2, 5).</li>
<li><strong>Luyện an toàn</strong> — dựng lab cách ly, chỉ thử trên hệ thống bạn sở hữu hoặc được phép (Chương 3).</li>
<li><strong>Nộp sản phẩm</strong> — mini-project, báo cáo, thuyết trình, và lộ trình lấy chứng chỉ (Chương 6-8).</li>
</ol></div>`,
  ]]);

const intro = doc('ia-gra-ele-0-1-overview', 'Course introduction: a graduation elective|||Giới thiệu môn: học phần tự chọn tốt nghiệp',
  'Học phần tự chọn tốt nghiệp là gì; cách chọn chủ đề; các sản phẩm phải nộp (learning contract, nghiên cứu, mini-project, báo cáo, thuyết trình); rubric chấm điểm; định hướng phòng thủ & đạo đức.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Lesson 0.1 · Overview</span>
<h2>What a graduation elective is</h2>
<p class="lead">A <strong>graduation elective</strong> is a self-directed, capstone-level course. Instead of a fixed lecture set, you take ownership: <strong>pick an advanced Information-Assurance topic, study it deeply, and produce original work</strong>. This course is a scaffold — it teaches you <em>how</em> to choose, learn, build and present, not <em>what</em> to memorise.</p>
<h3>What you will deliver</h3>
<pre><code>Deliverable            When        Weight (guide)
---------------------  ----------  -------------
Learning contract      Week 1-2    10%
Literature / field map Week 3-5    20%
Mini-project (defensive) Week 6-10 40%
Written report         Week 10-11  20%
Presentation + defence Week 12     10%
</code></pre>
<p>Exact weights and deadlines come from the FLM/FAP rubric for your cohort — always defer to that.</p>
<h3>Ground rules</h3>
<ul>
<li><strong>Defensive &amp; educational only.</strong> Build detection, hardening, analysis or teaching tools — never live attack tooling aimed at systems you do not own.</li>
<li><strong>Legal &amp; ethical.</strong> Only test systems you own or have written permission to test. Respect Vietnam's cyber-security law and FPTU's academic-integrity rules.</li>
<li><strong>Original.</strong> Cite every source; the report goes through plagiarism checks.</li>
</ul>
<div class="callout"><span class="badge">Mindset</span> Treat this like a small research + engineering project. The examiner rewards a clear question, honest scope, safe method, and a working, well-documented result — not flashy exploits.</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Bài 0.1 · Tổng quan</span>
<h2>Học phần tự chọn tốt nghiệp là gì</h2>
<p class="lead">Một <strong>học phần tự chọn tốt nghiệp</strong> là môn tự định hướng, ở tầm đồ án cuối khoá. Thay vì một bộ bài giảng cố định, bạn tự làm chủ: <strong>chọn một chủ đề An toàn thông tin nâng cao, học sâu, và tạo ra sản phẩm của riêng mình</strong>. Môn này là bộ khung — nó dạy bạn <em>cách</em> chọn, học, xây và trình bày, chứ không dạy bạn <em>phải</em> thuộc lòng gì.</p>
<h3>Bạn phải nộp những gì</h3>
<pre><code>Sản phẩm                Khi nào     Trọng số (tham khảo)
----------------------  ----------  --------------------
Learning contract       Tuần 1-2    10%
Bản đồ tài liệu/lĩnh vực Tuần 3-5   20%
Mini-project (phòng thủ) Tuần 6-10  40%
Báo cáo viết            Tuần 10-11  20%
Thuyết trình + phản biện Tuần 12    10%
</code></pre>
<p>Trọng số và hạn chính xác lấy từ rubric trên FLM/FAP cho khoá của bạn — luôn ưu tiên tài liệu đó.</p>
<h3>Nguyên tắc bất di bất dịch</h3>
<ul>
<li><strong>Chỉ phòng thủ &amp; giáo dục.</strong> Xây công cụ phát hiện, làm cứng, phân tích hay giảng dạy — tuyệt đối không làm công cụ tấn công nhắm vào hệ thống bạn không sở hữu.</li>
<li><strong>Hợp pháp &amp; đạo đức.</strong> Chỉ thử trên hệ thống bạn sở hữu hoặc được cho phép bằng văn bản. Tuân thủ Luật An ninh mạng Việt Nam và quy chế liêm chính học thuật của FPTU.</li>
<li><strong>Nguyên bản.</strong> Trích dẫn mọi nguồn; báo cáo bị quét đạo văn.</li>
</ul>
<div class="callout"><span class="badge">Tư duy</span> Hãy xem đây như một dự án nghiên cứu + kỹ thuật nhỏ. Giám khảo chấm cao câu hỏi rõ ràng, phạm vi trung thực, phương pháp an toàn, và kết quả chạy được, tài liệu hoá tốt — không phải màn khai thác phô trương.</div>`,
  ]]);

const c1 = doc('ia-gra-ele-1-1-chon-chu-de', '1.1 — What an elective is &amp; how to choose a topic|||1.1 — Học phần tự chọn là gì &amp; cách chọn chủ đề',
  'Tự chọn khác môn thường thế nào; chọn chủ đề theo định hướng nghề (blue team, pentest phòng thủ, forensics, cloud, GRC); tiêu chí SMART; tránh chủ đề quá rộng/quá hẹp/không kiểm được.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Chapter 1 · Lesson 1.1</span>
<h2>Choosing a topic by career direction</h2>
<p>The single biggest decision is your topic. A good elective topic is <strong>advanced enough to be worthy of a capstone, narrow enough to finish in a term, and defensible in a lab you legally control</strong>. Start from where you want to work.</p>
<pre><code>Career direction     ->  Candidate topic (defensive framing)
-------------------      -----------------------------------
Blue team / SOC          Build a home SIEM &amp; write detection rules
Security engineering     Harden a web app to OWASP ASVS L2
Digital forensics        Timeline a disk image from a CTF challenge
Cloud security           Audit an AWS/GCP account with open tooling
Malware analysis         Static-analyse a sample in an isolated VM
GRC / compliance         Map a small system to NIST CSF, write policy
</code></pre>
<h3>Make it SMART</h3>
<ul>
<li><strong>Specific</strong> — "detect brute-force SSH", not "study SOC".</li>
<li><strong>Measurable</strong> — define what "done" looks like (rule fires, report produced).</li>
<li><strong>Achievable</strong> — fits your skills + a term + a laptop-scale lab.</li>
<li><strong>Relevant</strong> — connects to a real job you want.</li>
<li><strong>Time-boxed</strong> — has milestones against the deliverable schedule.</li>
</ul>
<div class="callout"><span class="badge">Common traps</span> Too broad ("cloud security") — you drown. Too narrow ("one CVE's patch diff") — thin. Not testable (needs a botnet, a bank, real victims) — illegal or impossible. Pick something you can <em>build and measure</em> safely.</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Chương 1 · Bài 1.1</span>
<h2>Chọn chủ đề theo định hướng nghề</h2>
<p>Quyết định lớn nhất là chủ đề. Một chủ đề tự chọn tốt phải <strong>đủ nâng cao để xứng tầm đồ án, đủ hẹp để làm xong trong một kỳ, và bảo vệ được trong một lab bạn kiểm soát hợp pháp</strong>. Hãy bắt đầu từ nơi bạn muốn làm việc.</p>
<pre><code>Định hướng nghề       ->  Chủ đề gợi ý (khung phòng thủ)
-------------------       ------------------------------
Blue team / SOC           Dựng SIEM tại nhà &amp; viết luật phát hiện
Kỹ sư bảo mật             Làm cứng web app theo OWASP ASVS L2
Điều tra số               Dựng dòng thời gian từ ảnh đĩa CTF
An ninh cloud             Rà tài khoản AWS/GCP bằng công cụ mở
Phân tích mã độc          Phân tích tĩnh mẫu trong VM cách ly
GRC / tuân thủ            Ánh xạ hệ thống nhỏ vào NIST CSF, viết chính sách
</code></pre>
<h3>Làm cho nó SMART</h3>
<ul>
<li><strong>Cụ thể (Specific)</strong> — "phát hiện dò mật khẩu SSH", không phải "nghiên cứu SOC".</li>
<li><strong>Đo được (Measurable)</strong> — định nghĩa "xong" là gì (luật bắn, báo cáo ra).</li>
<li><strong>Khả thi (Achievable)</strong> — vừa sức bạn + một kỳ + lab cỡ laptop.</li>
<li><strong>Liên quan (Relevant)</strong> — nối với công việc thật bạn muốn.</li>
<li><strong>Có mốc thời gian (Time-boxed)</strong> — có milestone bám lịch nộp sản phẩm.</li>
</ul>
<div class="callout"><span class="badge">Bẫy thường gặp</span> Quá rộng ("an ninh cloud") — bạn chết đuối. Quá hẹp ("bản vá của một CVE") — mỏng. Không kiểm được (cần botnet, một ngân hàng, nạn nhân thật) — phi pháp hoặc bất khả. Hãy chọn thứ bạn <em>xây và đo</em> được một cách an toàn.</div>`,
  ]]);

const c1q = quiz('ia-gra-ele-quiz-1', 'Quiz 1 — Choosing a topic|||Quiz 1 — Chọn chủ đề', [
  { id: 'q1', question: 'Đặc điểm KHÁC biệt lớn nhất của học phần tự chọn tốt nghiệp so với môn thường là?', options: ['Không có bài kiểm tra nào', 'Sinh viên tự chọn chủ đề và tự định hướng học', 'Chỉ học lý thuyết, không thực hành', 'Do giảng viên giảng toàn bộ theo giáo trình cố định'], correctIndex: 1, explanation: 'Học phần tự chọn không có nội dung cố định; sinh viên tự chọn chủ đề nâng cao và tự học có định hướng.' },
  { id: 'q2', question: 'Một chủ đề tốt cho học phần này nên?', options: ['Càng rộng càng tốt để có nhiều thứ để viết', 'Cần một botnet thật để thử nghiệm', 'Đủ hẹp để làm xong trong một kỳ và kiểm được trong lab hợp pháp', 'Chỉ cần đọc lý thuyết, không làm sản phẩm'], correctIndex: 2, explanation: 'Chủ đề tốt phải đủ nâng cao, đủ hẹp để hoàn thành trong kỳ, và thử nghiệm được an toàn hợp pháp.' },
  { id: 'q3', question: 'Trong tiêu chí SMART, chữ "M" (Measurable) nghĩa là?', options: ['Chủ đề phải liên quan nghề', 'Định nghĩa rõ thế nào là "xong", có thể đo được kết quả', 'Chủ đề phải càng lớn càng tốt', 'Không cần mốc thời gian'], correctIndex: 1, explanation: 'Measurable = đo được: xác định rõ tiêu chí hoàn thành (ví dụ luật phát hiện bắn đúng, báo cáo được tạo ra).' },
]);

const c2 = doc('ia-gra-ele-2-1-ban-do-chu-de', '2.1 — A map of advanced security topics|||2.1 — Bản đồ chủ đề ATTT nâng cao',
  'Toàn cảnh các nhánh: pentest & red/blue team, SOC/SIEM, an ninh cloud, điều tra số, phân tích mã độc, mật mã học, GRC — mỗi nhánh: làm gì, kỹ năng cốt lõi, sản phẩm phòng thủ khả thi.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Chapter 2 · Lesson 2.1</span>
<h2>The landscape of advanced topics</h2>
<p>Information Assurance is broad. This map shows the main branches so you can locate yourself and pick one. Each is framed <strong>defensively</strong> — the version you can pursue ethically in this course.</p>
<pre><code>Branch              What it is                     A defensive project
------------------  ----------------------------  -----------------------------
Pentest / red-blue  Simulated attack + defence    Purple-team a lab, log &amp; detect
SOC / SIEM          Monitoring &amp; alerting          Ship logs, write detections
Cloud security      Securing AWS/GCP/Azure        Config audit + guardrails
Digital forensics   Recover &amp; analyse evidence     Investigate a CTF disk image
Malware analysis    Understand malicious code     Static analysis in isolated VM
Cryptography        Confidentiality &amp; integrity    Implement/compare a protocol
GRC                 Governance, risk, compliance  Map a system to NIST CSF
</code></pre>
<h3>How to read the map</h3>
<ul>
<li><strong>Red team</strong> attacks; <strong>blue team</strong> defends; <strong>purple team</strong> runs both to improve detection — the safest, most educational framing for a student lab.</li>
<li><strong>SIEM</strong> (e.g. Wazuh, Elastic) collects logs and raises alerts — the beating heart of a SOC.</li>
<li><strong>Forensics</strong> and <strong>malware analysis</strong> are read-only, evidence-driven — great for a controlled, offline lab.</li>
<li><strong>GRC</strong> is document- and process-heavy — ideal if you prefer policy over packets.</li>
</ul>
<div class="callout"><span class="badge">Use MITRE ATT&amp;CK</span> Whatever branch you pick, map it to ATT&amp;CK tactics/techniques — it gives your project a shared vocabulary examiners recognise.</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Chương 2 · Bài 2.1</span>
<h2>Toàn cảnh các chủ đề nâng cao</h2>
<p>An toàn thông tin rất rộng. Bản đồ này cho thấy các nhánh chính để bạn định vị và chọn một. Tất cả đều được đóng khung <strong>phòng thủ</strong> — phiên bản bạn có thể theo đuổi một cách đạo đức trong môn này.</p>
<pre><code>Nhánh               Là gì                         Dự án phòng thủ
------------------  ----------------------------  -----------------------------
Pentest / red-blue  Mô phỏng tấn công + phòng thủ Purple-team lab, log &amp; phát hiện
SOC / SIEM          Giám sát &amp; cảnh báo            Đẩy log, viết luật phát hiện
An ninh cloud       Bảo vệ AWS/GCP/Azure          Rà cấu hình + hàng rào bảo vệ
Điều tra số         Phục hồi &amp; phân tích chứng cứ  Điều tra ảnh đĩa CTF
Phân tích mã độc    Hiểu mã độc hại               Phân tích tĩnh trong VM cách ly
Mật mã học          Bảo mật &amp; toàn vẹn            Cài đặt/so sánh một giao thức
GRC                 Quản trị, rủi ro, tuân thủ    Ánh xạ hệ thống vào NIST CSF
</code></pre>
<h3>Đọc bản đồ thế nào</h3>
<ul>
<li><strong>Red team</strong> tấn công; <strong>blue team</strong> phòng thủ; <strong>purple team</strong> chạy cả hai để cải thiện khả năng phát hiện — khung an toàn và giàu tính giáo dục nhất cho lab sinh viên.</li>
<li><strong>SIEM</strong> (vd Wazuh, Elastic) gom log và bắn cảnh báo — trái tim của một SOC.</li>
<li><strong>Điều tra số</strong> và <strong>phân tích mã độc</strong> thiên về chỉ-đọc, dựa trên chứng cứ — rất hợp cho lab ngoại tuyến, có kiểm soát.</li>
<li><strong>GRC</strong> nặng về tài liệu và quy trình — lý tưởng nếu bạn thích chính sách hơn gói tin.</li>
</ul>
<div class="callout"><span class="badge">Dùng MITRE ATT&amp;CK</span> Chọn nhánh nào cũng nên ánh xạ vào chiến thuật/kỹ thuật ATT&amp;CK — nó cho dự án một ngôn ngữ chung mà giám khảo nhận ra ngay.</div>`,
  ]]);

const c2q = quiz('ia-gra-ele-quiz-2', 'Quiz 2 — Topic map|||Quiz 2 — Bản đồ chủ đề', [
  { id: 'q1', question: 'Trong mô hình đội, "purple team" là?', options: ['Đội chỉ tấn công', 'Đội chỉ phòng thủ', 'Kết hợp tấn công và phòng thủ để cải thiện khả năng phát hiện', 'Đội chỉ viết tài liệu'], correctIndex: 2, explanation: 'Purple team chạy cả tấn công (red) lẫn phòng thủ (blue) nhằm nâng cao năng lực phát hiện — khung an toàn, giáo dục cho lab.' },
  { id: 'q2', question: 'SIEM (ví dụ Wazuh, Elastic) trong một SOC làm nhiệm vụ gì?', options: ['Tấn công hệ thống mục tiêu', 'Thu thập log và bắn cảnh báo', 'Mã hoá ổ đĩa', 'Viết chính sách tuân thủ'], correctIndex: 1, explanation: 'SIEM gom log từ nhiều nguồn và sinh cảnh báo — chức năng giám sát cốt lõi của SOC.' },
  { id: 'q3', question: 'MITRE ATT&CK cung cấp cho dự án điều gì?', options: ['Một bộ mã độc để chạy thử', 'Ngôn ngữ chung mô tả chiến thuật/kỹ thuật của kẻ tấn công', 'Giấy phép thử nghiệm hệ thống bất kỳ', 'Một trình biên dịch mã'], correctIndex: 1, explanation: 'ATT&CK là kho tri thức chuẩn hoá về chiến thuật và kỹ thuật, giúp mô tả và ánh xạ dự án theo ngôn ngữ chung.' },
]);

const c3 = doc('ia-gra-ele-3-1-lab-an-toan', '3.1 — Tools &amp; a safe lab|||3.1 — Công cụ &amp; lab an toàn',
  'Dựng lab cách ly bằng VM (host-only/NAT), snapshot; luyện trên nền hợp pháp (TryHackMe, HackTheBox, CTF); nguyên tắc vàng: chỉ thử hệ thống bạn sở hữu hoặc được cho phép.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Chapter 3 · Lesson 3.1</span>
<h2>Tools and a safe, isolated lab</h2>
<p>You must practise <strong>without ever touching a system you are not authorised to touch</strong>. The answer is an isolated virtual lab plus purpose-built legal platforms.</p>
<h3>Isolated VM lab</h3>
<pre><code>Layer          Choice (example)          Note
-------------  ------------------------  ------------------------------
Hypervisor     VirtualBox / VMware       Run VMs on your own machine
Attacker VM    Kali / Parrot             Tooling, kept OFFLINE
Target VM      Metasploitable / DVWA     Intentionally vulnerable, LOCAL
Networking     Host-only or internal     No bridge to the real network
Safety         Snapshot before changes   Roll back instantly
</code></pre>
<ul>
<li><strong>Host-only / internal networking</strong> keeps traffic between your VMs — nothing leaks to the campus or home network.</li>
<li><strong>Snapshots</strong> let you revert malware or a broken config in seconds.</li>
<li>Keep any malware sample <strong>offline and clearly labelled</strong>; never run it on your host OS.</li>
</ul>
<h3>Legal practice platforms</h3>
<p><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe</a> and <a href="https://www.hackthebox.com/" target="_blank" rel="noopener">Hack The Box</a> give you targets you are <em>explicitly allowed</em> to attack; <a href="https://ctftime.org/" target="_blank" rel="noopener">CTFs</a> are sanctioned competitions. These are the right place to sharpen skills.</p>
<div class="callout"><span class="badge">The golden rule</span> Only test systems you <strong>own</strong> or have <strong>written permission</strong> to test. Unauthorised scanning or attacking is a crime under Vietnam's cyber-security law — no exceptions, no "just curious".</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Chương 3 · Bài 3.1</span>
<h2>Công cụ và một lab cách ly, an toàn</h2>
<p>Bạn phải luyện tập <strong>mà không bao giờ đụng vào hệ thống mình không được phép đụng</strong>. Lời giải là một lab ảo cách ly cộng với các nền tảng hợp pháp dựng sẵn.</p>
<h3>Lab máy ảo cách ly</h3>
<pre><code>Tầng           Lựa chọn (ví dụ)          Ghi chú
-------------  ------------------------  ------------------------------
Hypervisor     VirtualBox / VMware       Chạy VM trên chính máy bạn
VM tấn công    Kali / Parrot             Bộ công cụ, giữ NGOẠI TUYẾN
VM mục tiêu    Metasploitable / DVWA     Cố ý lỗ hổng, CỤC BỘ
Mạng           Host-only hoặc internal   Không cầu nối ra mạng thật
An toàn        Snapshot trước khi đổi    Lùi lại tức thì
</code></pre>
<ul>
<li><strong>Mạng host-only / internal</strong> giữ lưu lượng trong các VM của bạn — không rò rỉ ra mạng trường hay mạng nhà.</li>
<li><strong>Snapshot</strong> cho phép hoàn tác mã độc hoặc cấu hình hỏng trong vài giây.</li>
<li>Giữ mọi mẫu mã độc <strong>ngoại tuyến và ghi nhãn rõ ràng</strong>; đừng bao giờ chạy nó trên hệ điều hành máy chính (host).</li>
</ul>
<h3>Nền tảng luyện tập hợp pháp</h3>
<p><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe</a> và <a href="https://www.hackthebox.com/" target="_blank" rel="noopener">Hack The Box</a> cho bạn các mục tiêu mà bạn <em>được phép rõ ràng</em> để tấn công; <a href="https://ctftime.org/" target="_blank" rel="noopener">CTF</a> là các cuộc thi được cho phép. Đây là chỗ đúng để mài kỹ năng.</p>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Chỉ thử trên hệ thống bạn <strong>sở hữu</strong> hoặc có <strong>giấy phép bằng văn bản</strong>. Quét hay tấn công trái phép là tội phạm theo Luật An ninh mạng Việt Nam — không ngoại lệ, không "chỉ tò mò".</div>`,
  ]]);

const c3q = quiz('ia-gra-ele-quiz-3', 'Quiz 3 — Safe lab|||Quiz 3 — Lab an toàn', [
  { id: 'q1', question: 'Vì sao lab luyện tập nên dùng mạng "host-only" hoặc "internal"?', options: ['Để máy ảo chạy nhanh hơn', 'Để lưu lượng chỉ nằm trong các VM, không rò ra mạng thật', 'Để không cần snapshot', 'Để tấn công được nhiều mục tiêu hơn'], correctIndex: 1, explanation: 'Mạng host-only/internal cô lập lưu lượng giữa các VM, tránh rò rỉ hoặc gây hại ra mạng trường/nhà.' },
  { id: 'q2', question: 'Nguyên tắc vàng khi thử nghiệm an ninh là?', options: ['Được thử bất kỳ hệ thống nào nếu là mục đích học', 'Chỉ thử hệ thống bạn sở hữu hoặc được phép bằng văn bản', 'Chỉ cần ẩn danh là hợp pháp', 'Được thử máy chủ trường vì bạn là sinh viên'], correctIndex: 1, explanation: 'Quét/tấn công trái phép là phạm pháp; chỉ được thử trên hệ thống mình sở hữu hoặc được cấp phép rõ ràng.' },
  { id: 'q3', question: 'Snapshot của máy ảo hữu ích nhất vì?', options: ['Tăng RAM cho VM', 'Cho phép lùi ngay về trạng thái trước khi chạy mã độc hoặc cấu hình hỏng', 'Kết nối VM ra internet', 'Mã hoá ổ đĩa tự động'], correctIndex: 1, explanation: 'Snapshot cho phép hoàn tác tức thì sau khi thử nghiệm rủi ro (mã độc, cấu hình sai) — an toàn cho lab.' },
]);

const c4 = doc('ia-gra-ele-4-1-tu-hoc', '4.1 — Self-study method &amp; learning contract|||4.1 — Phương pháp tự học &amp; learning contract',
  'Viết learning contract (mục tiêu, chuẩn đầu ra, mốc, sản phẩm, cách đánh giá); vòng học chủ động; quản lý thời gian theo tuần; nhật ký học tập làm bằng chứng.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Chapter 4 · Lesson 4.1</span>
<h2>Self-study method &amp; the learning contract</h2>
<p>Self-directed does not mean unstructured. A <strong>learning contract</strong> is a short agreement — with yourself and your supervisor — that turns a vague topic into a plan.</p>
<h3>Learning-contract template</h3>
<pre><code>1. Topic &amp; motivation   -> one paragraph: what and why
2. Learning outcomes    -> 3-5 things you will be able to DO
3. Scope (in / out)     -> what you will and will NOT cover
4. Resources            -> courses, books, tools, datasets
5. Milestones           -> weekly checkpoints -> deliverables
6. Deliverable + demo   -> what you will build/show
7. Assessment mapping   -> how each output meets the rubric
</code></pre>
<h3>The active-learning loop</h3>
<ul>
<li><strong>Read a little</strong> — one concept or one tutorial section.</li>
<li><strong>Do a lot</strong> — reproduce it in your lab; break it; fix it.</li>
<li><strong>Write it down</strong> — a dated <strong>learning journal</strong> entry: what you tried, what happened, what you learned.</li>
<li><strong>Reflect weekly</strong> — did you hit the milestone? adjust scope early, not late.</li>
</ul>
<div class="callout"><span class="badge">Why the journal matters</span> The journal is <em>evidence</em>. It shows your process to the examiner, protects you against plagiarism suspicion, and is where your final report writes itself from.</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Chương 4 · Bài 4.1</span>
<h2>Phương pháp tự học &amp; learning contract</h2>
<p>Tự định hướng không có nghĩa là không có cấu trúc. Một <strong>learning contract</strong> (bản cam kết học tập) là thoả thuận ngắn — với chính bạn và người hướng dẫn — biến một chủ đề mơ hồ thành một kế hoạch.</p>
<h3>Mẫu learning contract</h3>
<pre><code>1. Chủ đề &amp; động lực    -> một đoạn: làm gì và vì sao
2. Chuẩn đầu ra          -> 3-5 việc bạn sẽ LÀM ĐƯỢC
3. Phạm vi (trong/ngoài) -> cái sẽ và sẽ KHÔNG bao gồm
4. Nguồn lực             -> khoá học, sách, công cụ, dữ liệu
5. Các mốc               -> checkpoint hàng tuần -> sản phẩm
6. Sản phẩm + demo       -> thứ bạn sẽ xây/trình diễn
7. Ánh xạ đánh giá       -> mỗi sản phẩm khớp rubric ra sao
</code></pre>
<h3>Vòng học chủ động</h3>
<ul>
<li><strong>Đọc một chút</strong> — một khái niệm hoặc một phần hướng dẫn.</li>
<li><strong>Làm thật nhiều</strong> — tái hiện trong lab; làm hỏng; sửa lại.</li>
<li><strong>Ghi lại</strong> — một dòng <strong>nhật ký học tập</strong> có ngày: đã thử gì, xảy ra gì, học được gì.</li>
<li><strong>Nhìn lại hàng tuần</strong> — có đạt mốc không? điều chỉnh phạm vi sớm, đừng để muộn.</li>
</ul>
<div class="callout"><span class="badge">Vì sao nhật ký quan trọng</span> Nhật ký là <em>bằng chứng</em>. Nó cho giám khảo thấy quá trình của bạn, bảo vệ bạn khỏi nghi ngờ đạo văn, và là nơi báo cáo cuối tự viết ra từ đó.</div>`,
  ]]);

const c4q = quiz('ia-gra-ele-quiz-4', 'Quiz 4 — Self-study|||Quiz 4 — Tự học', [
  { id: 'q1', question: 'Mục đích chính của một "learning contract" là?', options: ['Ký hợp đồng lao động với trường', 'Biến một chủ đề mơ hồ thành kế hoạch có mục tiêu, mốc và sản phẩm', 'Thay thế báo cáo cuối kỳ', 'Đăng ký bản quyền cho dự án'], correctIndex: 1, explanation: 'Learning contract là bản cam kết học tập, cụ thể hoá mục tiêu, phạm vi, mốc và sản phẩm — biến ý tưởng thành kế hoạch.' },
  { id: 'q2', question: 'Trong vòng học chủ động, sau khi "đọc một chút" thì bước quan trọng nhất là?', options: ['Đọc thêm thật nhiều lý thuyết', 'Làm/tái hiện trong lab, rồi ghi lại kết quả', 'Bỏ qua và chuyển chủ đề khác', 'Chờ giảng viên giảng lại'], correctIndex: 1, explanation: 'Học chủ động nhấn mạnh làm nhiều (thực hành trong lab) và ghi lại — kiến thức khắc sâu qua thực hành.' },
  { id: 'q3', question: 'Nhật ký học tập (learning journal) có giá trị vì?', options: ['Không có giá trị, chỉ tốn thời gian', 'Là bằng chứng quá trình, chống nghi ngờ đạo văn và là nguồn để viết báo cáo', 'Thay thế hoàn toàn mini-project', 'Chỉ dùng để nộp thay quiz'], correctIndex: 1, explanation: 'Nhật ký ghi lại quá trình có ngày tháng: là bằng chứng cho giám khảo và là chất liệu để viết báo cáo cuối.' },
]);

const c5 = doc('ia-gra-ele-5-1-nghien-cuu', '5.1 — Deep research on your chosen topic|||5.1 — Nghiên cứu chuyên sâu chủ đề đã chọn',
  'Đặt câu hỏi nghiên cứu; tìm & đánh giá nguồn (đọc có phê phán, tránh blog rác); ghi chú & trích dẫn; tổng hợp thành literature review; phân biệt nguồn sơ cấp/thứ cấp.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Chapter 5 · Lesson 5.1</span>
<h2>Deep research on your topic</h2>
<p>Before you build, you survey. A short <strong>literature / field review</strong> shows you what already exists so your project adds something, not repeats it.</p>
<h3>From topic to a research question</h3>
<p>Turn the topic into a question you can answer: not "SSH security", but <em>"Which log signals most reliably distinguish a brute-force attempt from a busy legitimate server, and how few false positives can a simple rule achieve?"</em></p>
<h3>Find and judge sources</h3>
<pre><code>Source type       Examples                    Trust
----------------  --------------------------  -----------------
Primary standards NIST SP 800, RFCs, OWASP    High, authoritative
Academic          IEEE, ACM, arXiv papers     High, peer-reviewed
Vendor docs       AWS/Microsoft/Cisco docs    High for their product
Community         SANS, well-known blogs      Medium, verify claims
Random blog / AI  unattributed posts          Low, cross-check ALWAYS
</code></pre>
<ul>
<li><strong>Read critically</strong> — who wrote it, when, do they cite evidence, is it reproducible?</li>
<li><strong>Take structured notes</strong> — quote, source, page/URL, your comment — so citation is trivial later.</li>
<li><strong>Synthesise</strong> — group findings by theme; state where sources agree, disagree, and leave gaps (your gap is your contribution).</li>
</ul>
<div class="callout"><span class="badge">Cite as you go</span> Keep a reference list from day one. Retro-fitting citations is how honest students accidentally plagiarise.</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Chương 5 · Bài 5.1</span>
<h2>Nghiên cứu chuyên sâu chủ đề của bạn</h2>
<p>Trước khi xây, hãy khảo sát. Một <strong>literature/field review</strong> ngắn cho bạn thấy những gì đã tồn tại, để dự án của bạn bổ sung chứ không lặp lại.</p>
<h3>Từ chủ đề đến câu hỏi nghiên cứu</h3>
<p>Biến chủ đề thành một câu hỏi bạn trả lời được: không phải "bảo mật SSH", mà <em>"Tín hiệu log nào phân biệt đáng tin cậy nhất giữa một lần dò mật khẩu và một máy chủ hợp lệ đang bận, và một luật đơn giản đạt được ít cảnh báo giả tới mức nào?"</em></p>
<h3>Tìm và đánh giá nguồn</h3>
<pre><code>Loại nguồn        Ví dụ                       Độ tin cậy
----------------  --------------------------  -----------------
Tiêu chuẩn gốc    NIST SP 800, RFC, OWASP     Cao, có thẩm quyền
Học thuật         Bài báo IEEE, ACM, arXiv    Cao, phản biện đồng đẳng
Tài liệu hãng     Docs AWS/Microsoft/Cisco    Cao cho sản phẩm của họ
Cộng đồng         SANS, blog uy tín           Vừa, phải kiểm chứng
Blog vô danh / AI Bài không nguồn             Thấp, LUÔN đối chiếu
</code></pre>
<ul>
<li><strong>Đọc có phê phán</strong> — ai viết, khi nào, có dẫn chứng không, có tái lập được không?</li>
<li><strong>Ghi chú có cấu trúc</strong> — trích dẫn, nguồn, trang/URL, nhận xét của bạn — để sau này trích dẫn cực dễ.</li>
<li><strong>Tổng hợp</strong> — nhóm phát hiện theo chủ đề; nêu chỗ các nguồn đồng ý, mâu thuẫn, và để trống (khoảng trống đó là đóng góp của bạn).</li>
</ul>
<div class="callout"><span class="badge">Trích dẫn ngay khi làm</span> Giữ danh mục tài liệu từ ngày đầu. Chắp vá trích dẫn về sau là cách sinh viên trung thực vô tình đạo văn.</div>`,
  ]]);

const c5q = quiz('ia-gra-ele-quiz-5', 'Quiz 5 — Research|||Quiz 5 — Nghiên cứu', [
  { id: 'q1', question: 'Một "câu hỏi nghiên cứu" tốt khác một "chủ đề" ở chỗ?', options: ['Nó dài hơn', 'Nó là câu hỏi cụ thể có thể trả lời/đo được, không chỉ là một lĩnh vực chung', 'Nó không cần nguồn', 'Nó luôn có sẵn đáp án trên mạng'], correctIndex: 1, explanation: 'Câu hỏi nghiên cứu thu hẹp chủ đề chung thành một câu hỏi cụ thể, trả lời và đo được — định hướng cho cả dự án.' },
  { id: 'q2', question: 'Nguồn nào thường có độ tin cậy CAO NHẤT cho một tuyên bố kỹ thuật?', options: ['Blog vô danh không dẫn nguồn', 'Nội dung do AI sinh ra không kiểm chứng', 'Tiêu chuẩn gốc (NIST, RFC, OWASP) và bài báo phản biện đồng đẳng', 'Bình luận mạng xã hội'], correctIndex: 2, explanation: 'Tiêu chuẩn gốc và bài báo học thuật phản biện có thẩm quyền và tính kiểm chứng cao; blog/AI phải luôn đối chiếu.' },
  { id: 'q3', question: 'Vì sao nên trích dẫn nguồn ngay từ ngày đầu?', options: ['Để báo cáo dài hơn', 'Vì chắp vá trích dẫn về sau dễ dẫn tới vô tình đạo văn', 'Vì rubric cấm trích dẫn muộn', 'Vì trích dẫn làm chậm nghiên cứu'], correctIndex: 1, explanation: 'Ghi nguồn khi đang làm giúp tránh vô tình đạo văn và tiết kiệm công sức khi viết báo cáo.' },
]);

const c6 = doc('ia-gra-ele-6-1-mini-project', '6.1 — The defensive mini-project|||6.1 — Mini-project phòng thủ',
  'Chọn dạng sản phẩm phòng thủ (lab giám sát, công cụ phát hiện, script làm cứng, phân tích forensics); vòng lặp xây-đo-cải tiến; tiêu chí "chạy được & tái lập được"; ví dụ dựng SIEM nhỏ.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Chapter 6 · Lesson 6.1</span>
<h2>The defensive mini-project</h2>
<p>The mini-project is the heart of the course (typically the largest weight). It must be <strong>defensive, safe, and reproducible</strong>: something that protects, detects, analyses, or teaches.</p>
<h3>Good project shapes</h3>
<pre><code>Shape                     Example deliverable
------------------------  ----------------------------------------
Monitoring lab            SIEM (Wazuh) + dashboards + 3 detections
Detection tooling         Script that flags brute-force in logs
Hardening                 Baseline + audit script for a Linux host
Config / cloud audit      Tool that checks S3 buckets for exposure
Forensics investigation   Report reconstructing a CTF disk timeline
Static malware analysis   Behaviour report of a sample (in a VM)
</code></pre>
<h3>Build - measure - improve</h3>
<ul>
<li><strong>Build</strong> the smallest thing that works end-to-end, then grow it.</li>
<li><strong>Measure</strong> — for a detector: true positives, false positives, missed events. Numbers beat adjectives.</li>
<li><strong>Improve</strong> — tune, re-measure, and record the before/after in your journal.</li>
</ul>
<h3>Make it reproducible</h3>
<p>Anyone should be able to re-run your project from your README: exact versions, setup steps, sample data, and expected output. Reproducibility is a grading criterion and a professional habit.</p>
<div class="callout"><span class="badge">Stay defensive</span> If a step would harm or attack a system you do not control, it does not belong in this project. Simulate the attack against your <em>own</em> lab target so you can build and prove the defence.</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Chương 6 · Bài 6.1</span>
<h2>Mini-project phòng thủ</h2>
<p>Mini-project là trái tim của môn học (thường chiếm trọng số lớn nhất). Nó phải <strong>mang tính phòng thủ, an toàn và tái lập được</strong>: một thứ bảo vệ, phát hiện, phân tích, hoặc giảng dạy.</p>
<h3>Các dạng sản phẩm tốt</h3>
<pre><code>Dạng                      Sản phẩm ví dụ
------------------------  ----------------------------------------
Lab giám sát              SIEM (Wazuh) + dashboard + 3 luật phát hiện
Công cụ phát hiện         Script phát hiện dò mật khẩu trong log
Làm cứng (hardening)      Baseline + script rà soát cho máy Linux
Rà cấu hình / cloud       Công cụ kiểm bucket S3 bị lộ
Điều tra số               Báo cáo dựng lại dòng thời gian ảnh đĩa CTF
Phân tích tĩnh mã độc     Báo cáo hành vi một mẫu (trong VM)
</code></pre>
<h3>Xây - đo - cải tiến</h3>
<ul>
<li><strong>Xây</strong> thứ nhỏ nhất chạy được trọn vẹn (end-to-end), rồi mở rộng.</li>
<li><strong>Đo</strong> — với bộ phát hiện: đúng dương, giả dương, sự kiện bị bỏ sót. Con số thắng tính từ.</li>
<li><strong>Cải tiến</strong> — tinh chỉnh, đo lại, và ghi trước/sau vào nhật ký.</li>
</ul>
<h3>Làm cho tái lập được</h3>
<p>Bất kỳ ai cũng phải chạy lại được dự án từ README của bạn: phiên bản chính xác, các bước cài, dữ liệu mẫu, và đầu ra kỳ vọng. Khả năng tái lập là tiêu chí chấm điểm và là thói quen chuyên nghiệp.</p>
<div class="callout"><span class="badge">Giữ tính phòng thủ</span> Nếu một bước gây hại hoặc tấn công hệ thống bạn không kiểm soát, nó không thuộc dự án này. Hãy mô phỏng tấn công lên mục tiêu trong <em>chính</em> lab của bạn để xây và chứng minh phần phòng thủ.</div>`,
  ]]);

const c6q = quiz('ia-gra-ele-quiz-6', 'Quiz 6 — Mini-project|||Quiz 6 — Mini-project', [
  { id: 'q1', question: 'Mini-project trong học phần này BẮT BUỘC phải mang tính?', options: ['Tấn công hệ thống thật để chứng minh kỹ năng', 'Phòng thủ, an toàn và tái lập được', 'Bí mật, không ai chạy lại được', 'Chỉ lý thuyết, không có sản phẩm'], correctIndex: 1, explanation: 'Định hướng môn là phòng thủ/giáo dục; sản phẩm phải an toàn, hợp pháp và có thể tái lập.' },
  { id: 'q2', question: 'Khi đánh giá một bộ phát hiện (detector), thước đo quan trọng gồm?', options: ['Màu sắc dashboard', 'Đúng dương, giả dương, sự kiện bị bỏ sót', 'Số dòng mã đã viết', 'Tên công cụ dùng'], correctIndex: 1, explanation: 'Hiệu quả phát hiện đo bằng true positive, false positive và missed events — con số thay cho nhận xét cảm tính.' },
  { id: 'q3', question: 'Vì sao "tái lập được" (reproducible) lại quan trọng?', options: ['Không quan trọng gì cả', 'Để người khác chạy lại từ README và là tiêu chí chấm điểm/thói quen chuyên nghiệp', 'Để giấu cách làm', 'Để dự án chạy nhanh hơn'], correctIndex: 1, explanation: 'Tái lập được (phiên bản, bước cài, dữ liệu, đầu ra kỳ vọng) giúp người khác kiểm chứng và là tiêu chí chấm điểm.' },
]);

const c7 = doc('ia-gra-ele-7-1-bao-cao', '7.1 — Writing the report &amp; documentation|||7.1 — Viết báo cáo &amp; tài liệu hoá',
  'Cấu trúc báo cáo (tóm tắt, giới thiệu, phương pháp, kết quả, bàn luận, kết luận, tài liệu); viết rõ ràng; hình/bảng có chú thích; README & tài liệu kỹ thuật; trích dẫn đúng chuẩn.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Chapter 7 · Lesson 7.1</span>
<h2>Writing the report &amp; documentation</h2>
<p>Your work only counts if it is communicated. The report is where you turn a lab and a journal into a credible, citable document.</p>
<h3>Report skeleton</h3>
<pre><code>Section          Purpose
---------------  --------------------------------------------
Abstract         The whole story in 150-250 words
Introduction     Problem, research question, why it matters
Background        What exists (your literature review)
Method           Exactly what you did (reproducible)
Results          What you found - tables, figures, numbers
Discussion       What it means, limitations, threats to validity
Conclusion       Answer the question; future work
References        Every source, one consistent style
Appendix         Code, configs, extra data
</code></pre>
<h3>Write so a busy examiner understands fast</h3>
<ul>
<li><strong>One idea per paragraph</strong>; lead with the point, then support it.</li>
<li><strong>Caption every figure and table</strong> and refer to it in the text — never drop a screenshot with no explanation.</li>
<li><strong>Be honest about limitations</strong> — stating what your project does <em>not</em> prove builds trust, not doubt.</li>
<li><strong>Consistent citation style</strong> (IEEE or APA) throughout; match in-text markers to the reference list.</li>
</ul>
<div class="callout"><span class="badge">README = the front door</span> Ship a clear README with the code: purpose, setup, how to run, expected output, and a safety note. It is the first thing a grader (and a future employer) opens.</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Chương 7 · Bài 7.1</span>
<h2>Viết báo cáo &amp; tài liệu hoá</h2>
<p>Công sức của bạn chỉ được tính khi được truyền đạt. Báo cáo là nơi bạn biến một lab và một cuốn nhật ký thành tài liệu đáng tin, trích dẫn được.</p>
<h3>Khung báo cáo</h3>
<pre><code>Phần             Mục đích
---------------  --------------------------------------------
Tóm tắt          Toàn bộ câu chuyện trong 150-250 chữ
Giới thiệu       Vấn đề, câu hỏi nghiên cứu, vì sao quan trọng
Bối cảnh         Những gì đã có (literature review của bạn)
Phương pháp      Chính xác bạn đã làm gì (tái lập được)
Kết quả          Bạn tìm ra gì - bảng, hình, con số
Bàn luận         Ý nghĩa, hạn chế, mối đe doạ tính hợp lệ
Kết luận         Trả lời câu hỏi; hướng phát triển
Tài liệu         Mọi nguồn, một chuẩn thống nhất
Phụ lục          Mã, cấu hình, dữ liệu thêm
</code></pre>
<h3>Viết để giám khảo bận rộn hiểu nhanh</h3>
<ul>
<li><strong>Một ý mỗi đoạn</strong>; nêu luận điểm trước, rồi mới dẫn chứng.</li>
<li><strong>Chú thích mọi hình và bảng</strong> và nhắc tới nó trong văn bản — đừng bao giờ thả một ảnh chụp mà không giải thích.</li>
<li><strong>Trung thực về hạn chế</strong> — nói rõ dự án <em>không</em> chứng minh điều gì làm tăng độ tin, không phải nghi ngờ.</li>
<li><strong>Chuẩn trích dẫn nhất quán</strong> (IEEE hoặc APA) xuyên suốt; khớp dấu trích trong bài với danh mục tài liệu.</li>
</ul>
<div class="callout"><span class="badge">README = cửa trước</span> Kèm một README rõ ràng với mã nguồn: mục đích, cài đặt, cách chạy, đầu ra kỳ vọng, và một lưu ý an toàn. Đó là thứ đầu tiên người chấm (và nhà tuyển dụng tương lai) mở ra.</div>`,
  ]]);

const c7q = quiz('ia-gra-ele-quiz-7', 'Quiz 7 — Report|||Quiz 7 — Báo cáo', [
  { id: 'q1', question: 'Phần "Method" (Phương pháp) trong báo cáo cần đạt yêu cầu gì?', options: ['Càng mơ hồ càng tốt để bảo mật', 'Mô tả chính xác điều đã làm, đủ để người khác tái lập', 'Chỉ liệt kê tên công cụ', 'Trùng với phần Kết luận'], correctIndex: 1, explanation: 'Phương pháp phải mô tả chính xác các bước để người khác tái lập được thí nghiệm/dự án.' },
  { id: 'q2', question: 'Vì sao nên trung thực nêu rõ hạn chế của dự án trong phần Bàn luận?', options: ['Vì nó làm giám khảo hạ điểm chắc chắn', 'Vì nêu rõ điều dự án KHÔNG chứng minh làm tăng độ tin cậy', 'Vì rubric bắt buộc phải chê bai bản thân', 'Vì càng ít kết quả càng tốt'], correctIndex: 1, explanation: 'Thừa nhận hạn chế và mối đe doạ tính hợp lệ thể hiện tư duy phản biện và làm báo cáo đáng tin hơn.' },
  { id: 'q3', question: 'Một README tốt kèm mã nguồn nên có?', options: ['Chỉ tên tác giả', 'Mục đích, cách cài, cách chạy, đầu ra kỳ vọng và lưu ý an toàn', 'Toàn bộ báo cáo dán vào', 'Không cần gì, mã tự nói'], correctIndex: 1, explanation: 'README là "cửa trước": nêu mục đích, hướng dẫn cài/chạy, đầu ra kỳ vọng và lưu ý an toàn để người khác dùng lại.' },
]);

const c8 = doc('ia-gra-ele-8-1-trinh-bay-chung-chi', '8.1 — Presenting, defending, certifications &amp; ethics|||8.1 — Trình bày, phản biện, chứng chỉ &amp; đạo đức',
  'Chuẩn bị slide & demo; trả lời phản biện; lộ trình chứng chỉ (Security+, CEH, OSCP, CISSP) theo cấp độ; đạo đức nghề & khung pháp lý; hành nghề có trách nhiệm.',
  [[
    `<span class="eyebrow">IA_GRA_ELE · Chapter 8 · Lesson 8.1</span>
<h2>Presenting, defending, certifications &amp; ethics</h2>
<h3>The presentation &amp; defence</h3>
<ul>
<li><strong>Tell a story</strong> — problem, what you built, what you measured, what it means. Not a tool tour.</li>
<li><strong>Demo the working thing</strong> — short, rehearsed, with a recorded fallback in case the live run fails.</li>
<li><strong>Expect hard questions</strong> — "why this approach? what are the false positives? what would you do next?" Answer honestly; "I don't know, but I'd test X" is a strong answer.</li>
</ul>
<h3>Certifications by level</h3>
<pre><code>Level        Certification    Focus
-----------  ---------------  -------------------------------
Entry        CompTIA Security+ Broad foundations, defensive
Offensive    CEH             Attack concepts (theory-heavy)
Hands-on     OSCP            Practical pentest (hard, lab exam)
Management    CISSP          Governance, needs work experience
</code></pre>
<p>Pick the one that matches your direction and pair it with your project story on your CV.</p>
<h3>Professional ethics &amp; the law</h3>
<ul>
<li><strong>Authorisation first</strong> — never test without explicit permission; keep it in writing.</li>
<li><strong>Minimise harm</strong> — disclose vulnerabilities responsibly; do not exfiltrate or damage data.</li>
<li><strong>Know the law</strong> — Vietnam's Law on Cybersecurity and Law on Cyber Information Security bind you; unauthorised access carries real penalties.</li>
<li><strong>Integrity</strong> — your skills can protect or harm; a security professional chooses to protect.</li>
</ul>
<div class="callout"><span class="badge">The core promise</span> The value of this course is not the exploits you can run — it is the judgement to know what you should <em>not</em>, and the skill to defend systems and people.</div>`,
    `<span class="eyebrow">IA_GRA_ELE · Chương 8 · Bài 8.1</span>
<h2>Trình bày, phản biện, chứng chỉ &amp; đạo đức</h2>
<h3>Thuyết trình &amp; phản biện</h3>
<ul>
<li><strong>Kể một câu chuyện</strong> — vấn đề, bạn xây gì, đo được gì, ý nghĩa gì. Không phải màn dạo qua công cụ.</li>
<li><strong>Demo thứ chạy được</strong> — ngắn, tập trước, có bản ghi dự phòng nếu chạy trực tiếp hỏng.</li>
<li><strong>Chuẩn bị câu hỏi khó</strong> — "vì sao chọn cách này? tỉ lệ giả dương? bước tiếp theo là gì?" Trả lời trung thực; "tôi chưa biết, nhưng tôi sẽ thử X" là câu trả lời mạnh.</li>
</ul>
<h3>Chứng chỉ theo cấp độ</h3>
<pre><code>Cấp độ       Chứng chỉ        Trọng tâm
-----------  ---------------  -------------------------------
Nhập môn     CompTIA Security+ Nền rộng, thiên phòng thủ
Tấn công     CEH             Khái niệm tấn công (nặng lý thuyết)
Thực chiến   OSCP            Pentest thực hành (khó, thi trên lab)
Quản lý      CISSP          Quản trị, cần kinh nghiệm làm việc
</code></pre>
<p>Chọn cái khớp định hướng của bạn và ghép với câu chuyện dự án trên CV.</p>
<h3>Đạo đức nghề &amp; pháp luật</h3>
<ul>
<li><strong>Xin phép trước</strong> — không bao giờ thử khi chưa được phép rõ ràng; giữ bằng văn bản.</li>
<li><strong>Giảm thiểu tác hại</strong> — công bố lỗ hổng có trách nhiệm; không lấy cắp hay phá hoại dữ liệu.</li>
<li><strong>Hiểu luật</strong> — Luật An ninh mạng và Luật An toàn thông tin mạng của Việt Nam ràng buộc bạn; truy cập trái phép có chế tài thật.</li>
<li><strong>Liêm chính</strong> — kỹ năng của bạn có thể bảo vệ hoặc gây hại; người làm an ninh chọn bảo vệ.</li>
</ul>
<div class="callout"><span class="badge">Lời hứa cốt lõi</span> Giá trị của môn này không nằm ở những đòn khai thác bạn chạy được — mà ở khả năng phán đoán để biết điều bạn <em>không</em> nên làm, và kỹ năng bảo vệ hệ thống và con người.</div>`,
  ]]);

const c8q = quiz('ia-gra-ele-quiz-8', 'Quiz 8 — Present &amp; ethics|||Quiz 8 — Trình bày &amp; đạo đức', [
  { id: 'q1', question: 'Khi demo trực tiếp trong buổi bảo vệ, biện pháp phòng ngừa tốt là?', options: ['Không cần chuẩn bị, cứ chạy ngẫu hứng', 'Có bản ghi (video) dự phòng phòng khi chạy trực tiếp hỏng', 'Chỉ chiếu slide, không demo', 'Chạy thử trên hệ thống thật của người khác'], correctIndex: 1, explanation: 'Demo nên ngắn, tập trước, và có bản ghi dự phòng để không phụ thuộc hoàn toàn vào lần chạy trực tiếp.' },
  { id: 'q2', question: 'Chứng chỉ nào thường yêu cầu kinh nghiệm làm việc và thiên về quản trị an ninh?', options: ['CompTIA Security+', 'OSCP', 'CISSP', 'CEH'], correctIndex: 2, explanation: 'CISSP hướng quản lý/quản trị an ninh và yêu cầu kinh nghiệm làm việc; Security+ là nền nhập môn.' },
  { id: 'q3', question: 'Nguyên tắc đạo đức cốt lõi trước khi thử nghiệm một hệ thống là?', options: ['Cứ thử rồi xin lỗi sau', 'Phải được cho phép rõ ràng, tốt nhất bằng văn bản', 'Chỉ cần dùng VPN che giấu', 'Được phép nếu chỉ để học'], correctIndex: 1, explanation: 'Phải có sự cho phép rõ ràng (nên bằng văn bản) trước khi thử; truy cập trái phép là vi phạm pháp luật.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'IA_GRA_ELE',
    slug: 'ia-gra-ele-graduation-elective-information-assurance',
    title: 'Graduation Elective - Information Assurance',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IA_GRA_ELE.webp',
    shortDescription: 'A graduation elective: choose an advanced infosec topic, self-study it, build a defensive, ethical mini-project. Covers picking a topic, mapping the field, a safe lab, research, build, report, present & certifications.|||Học phần tự chọn tốt nghiệp: chọn một chủ đề ATTT nâng cao, tự học, làm mini-project phòng thủ, đạo đức. Hướng dẫn chọn chủ đề, bản đồ lĩnh vực, lab an toàn, nghiên cứu, xây, báo cáo, trình bày & chứng chỉ.',
    description: 'Môn <strong>IA_GRA_ELE — Graduation Elective - Information Assurance</strong> (Học phần tự chọn tốt nghiệp — An toàn thông tin, kỳ 9) là môn <strong>tự định hướng</strong>: không có nội dung cố định. Bạn <strong>chọn một chủ đề ATTT nâng cao</strong>, tự học có định hướng, và làm một <strong>mini-project phòng thủ</strong>. Khung này dạy <em>cách</em>: chọn chủ đề theo nghề → bản đồ lĩnh vực (pentest/red-blue, SOC/SIEM, cloud, forensics, mã độc, mật mã, GRC) → lab an toàn &amp; hợp pháp → learning contract → nghiên cứu → mini-project → báo cáo → trình bày &amp; chứng chỉ. Nhấn mạnh <strong>đạo đức nghề &amp; pháp luật</strong>. Nguồn: NIST, OWASP, SANS, MITRE ATT&amp;CK, Coursera/edX, quy định FPTU trên FLM.',
    whatYouLearn: 'Hiểu học phần tự chọn tốt nghiệp &amp; cách chọn chủ đề SMART theo định hướng nghề; bản đồ các nhánh ATTT nâng cao; dựng lab cách ly an toàn (VM host-only, snapshot) &amp; nền luyện hợp pháp (TryHackMe/HackTheBox/CTF); viết learning contract &amp; phương pháp tự học; nghiên cứu &amp; đánh giá nguồn, trích dẫn; làm mini-project phòng thủ (xây-đo-cải tiến, tái lập được); viết báo cáo &amp; README; trình bày, phản biện; lộ trình chứng chỉ (Security+/CEH/OSCP/CISSP) &amp; đạo đức nghề.',
    requirements: 'Đã học các môn nền An toàn thông tin (mạng, hệ điều hành, an ninh cơ bản). Cần máy chạy được máy ảo (VirtualBox/VMware). Xem điều kiện tiên quyết trong khung chương trình ngành ATTT trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy định FLM/FAP, khung NIST/OWASP/SANS/ATT&CK, khoá miễn phí, lab hợp pháp, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Học phần tự chọn tốt nghiệp là gì, sản phẩm phải nộp, rubric, đạo đức.', lessons: [intro] },
    { title: 'Chương 1 — Chọn chủ đề|||Chapter 1 — Choosing a topic', description: 'Tự chọn là gì, chọn theo nghề, tiêu chí SMART.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bản đồ chủ đề ATTT|||Chapter 2 — Topic map', description: 'Pentest/SOC/cloud/forensics/mã độc/mật mã/GRC.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lab an toàn|||Chapter 3 — Safe lab', description: 'VM cách ly, snapshot, TryHackMe/HackTheBox/CTF, nguyên tắc vàng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tự học & learning contract|||Chapter 4 — Self-study', description: 'Learning contract, vòng học chủ động, nhật ký.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nghiên cứu chuyên sâu|||Chapter 5 — Deep research', description: 'Câu hỏi nghiên cứu, đánh giá nguồn, trích dẫn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mini-project phòng thủ|||Chapter 6 — Mini-project', description: 'Sản phẩm phòng thủ, xây-đo-cải tiến, tái lập được.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Viết báo cáo|||Chapter 7 — Report', description: 'Cấu trúc báo cáo, hình/bảng, README, trích dẫn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Trình bày & chứng chỉ|||Chapter 8 — Present & certs', description: 'Thuyết trình, phản biện, chứng chỉ, đạo đức & pháp luật.', lessons: [c8, c8q] },
  ],
};
