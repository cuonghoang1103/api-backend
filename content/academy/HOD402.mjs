/**
 * HOD402 — Ethical Hacking and Offensive Security (Hacking có đạo đức &
 * An ninh tấn công). Ngành An toàn thông tin FPTU, Kỳ 7.
 *
 * KHUNG GIÁO DỤC về kiểm thử xâm nhập CÓ UỶ QUYỀN (authorized penetration
 * testing): phương pháp luận, tư duy phòng thủ, đạo đức, khuôn khổ pháp lý.
 * KHÔNG phải hướng dẫn tấn công phá hoại — chỉ khái niệm & phương pháp, không
 * payload/exploit thực thi. Nguồn chuẩn: EC-Council CEH, PTES, NIST SP 800-115,
 * OWASP, Georgia Weidman "Penetration Testing".
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n;
 * "&"→"&amp;" trong nội dung HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('hod402-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: chuẩn EC-Council CEH, PTES, NIST SP 800-115, OWASP, sách Georgia Weidman, lab học tập hợp pháp, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">HOD402 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>authorized</strong> penetration testing and ethical hacking — legal scope, methodology and, above all, a defensive mindset. Every resource below is for learning on <strong>systems you own or are permitted to test</strong>.</p>
<h3>📘 Official standards &amp; frameworks</h3>
<ul>
<li><a href="https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/" target="_blank" rel="noopener">EC-Council CEH</a> — certified ethical hacker body of knowledge</li>
<li><a href="http://www.pentest-standard.org/" target="_blank" rel="noopener">PTES — Penetration Testing Execution Standard</a></li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/115/final" target="_blank" rel="noopener">NIST SP 800-115</a> — technical guide to security testing</li>
<li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener">OWASP Top 10</a> — common web application risks</li>
</ul>
<h3>📗 Reference book</h3>
<ul>
<li><a href="https://nostarch.com/pentesting" target="_blank" rel="noopener"><em>Penetration Testing: A Hands-On Introduction to Hacking</em> — Georgia Weidman</a></li>
</ul>
<h3>🧪 Legal practice labs</h3>
<ul>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe</a> — guided rooms in a sandboxed lab</li>
<li><a href="https://www.hackthebox.com/" target="_blank" rel="noopener">Hack The Box</a> — intentionally vulnerable machines to practice on</li>
</ul>
<div class="callout"><span class="badge">4-step self-study path</span>
<ol>
<li><strong>Ethics &amp; law first</strong> — authorization, scope, rules of engagement. Never test anything without written permission.</li>
<li><strong>Methodology</strong> — learn the PTES/CEH phases as a repeatable process, not a bag of tricks.</li>
<li><strong>Practice in a lab</strong> — TryHackMe / Hack The Box only, or your own VMs.</li>
<li><strong>Defensive lens</strong> — for every technique, learn the control that stops it, and how to write the fix into a report.</li>
</ol></div>`,
    `<span class="eyebrow">HOD402 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học kiểm thử xâm nhập <strong>CÓ UỶ QUYỀN</strong> và hacking có đạo đức — phạm vi pháp lý, phương pháp luận và trên hết là tư duy phòng thủ. Mọi nguồn dưới đây dùng để học trên <strong>hệ thống bạn sở hữu hoặc được phép kiểm thử</strong>.</p>
<h3>📘 Chuẩn &amp; khuôn khổ chính thức</h3>
<ul>
<li><a href="https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/" target="_blank" rel="noopener">EC-Council CEH</a> — khối kiến thức hacker có đạo đức</li>
<li><a href="http://www.pentest-standard.org/" target="_blank" rel="noopener">PTES — Chuẩn thực thi kiểm thử xâm nhập</a></li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/115/final" target="_blank" rel="noopener">NIST SP 800-115</a> — hướng dẫn kỹ thuật kiểm thử bảo mật</li>
<li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener">OWASP Top 10</a> — các rủi ro ứng dụng web phổ biến</li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://nostarch.com/pentesting" target="_blank" rel="noopener"><em>Penetration Testing: A Hands-On Introduction to Hacking</em> — Georgia Weidman</a></li>
</ul>
<h3>🧪 Lab thực hành hợp pháp</h3>
<ul>
<li><a href="https://tryhackme.com/" target="_blank" rel="noopener">TryHackMe</a> — phòng học có hướng dẫn trong lab cách ly</li>
<li><a href="https://www.hackthebox.com/" target="_blank" rel="noopener">Hack The Box</a> — máy cố tình có lỗ hổng để luyện tập</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học 4 bước</span>
<ol>
<li><strong>Đạo đức &amp; pháp lý trước</strong> — uỷ quyền, scope, rules of engagement. Không bao giờ kiểm thử thứ gì khi chưa có văn bản cho phép.</li>
<li><strong>Phương pháp luận</strong> — học các pha PTES/CEH như một quy trình lặp lại được, không phải một túi mẹo.</li>
<li><strong>Luyện trong lab</strong> — chỉ TryHackMe / Hack The Box, hoặc máy ảo của chính bạn.</li>
<li><strong>Góc nhìn phòng thủ</strong> — với mỗi kỹ thuật, học biện pháp chặn nó và cách viết bản vá vào báo cáo.</li>
</ol></div>`,
  ]]);

const intro = doc('hod402-0-1-overview', 'Course overview: ethical hacking & offensive security|||Tổng quan: hacking có đạo đức & an ninh tấn công',
  'Môn học về pentest CÓ UỶ QUYỀN dưới góc giáo dục: chỉ thực hành trên hệ thống ĐƯỢC PHÉP/lab, nhấn đạo đức, khuôn khổ pháp lý và tư duy phòng thủ.',
  [[
    `<span class="eyebrow">HOD402 · Lesson 0.1 · Overview</span>
<h2>Ethical hacking &amp; offensive security</h2>
<p class="lead">This course teaches how attackers think so that defenders can build stronger systems. You study <strong>authorized penetration testing</strong> — testing done <em>with written permission</em>, within an agreed <strong>scope</strong>, to find and fix weaknesses before a real attacker does.</p>
<div class="callout"><span class="badge">Read this first</span> Everything here is for systems you <strong>own</strong> or are <strong>explicitly permitted</strong> to test. Attacking systems without authorization is a crime. This is a course in methodology and defense — it deliberately teaches <em>concepts</em>, not ready-to-run attack payloads.</div>
<h3>Why offense teaches defense</h3>
<p>You cannot defend what you do not understand. By learning how reconnaissance, scanning and exploitation work, you learn exactly which controls stop them — and that is the real deliverable of every ethical hack.</p>
<h3>Roadmap</h3>
<p>Ethics &amp; law → the pentest methodology → reconnaissance → scanning &amp; enumeration → vulnerability analysis → exploitation &amp; post-exploitation (defensive view) → web &amp; network attacks (OWASP mapping) → reporting, remediation &amp; purple teaming. Bilingual, with a quiz per chapter.</p>`,
    `<span class="eyebrow">HOD402 · Bài 0.1 · Tổng quan</span>
<h2>Hacking có đạo đức &amp; an ninh tấn công</h2>
<p class="lead">Môn này dạy cách kẻ tấn công suy nghĩ để người phòng thủ dựng hệ thống vững hơn. Bạn học <strong>kiểm thử xâm nhập có uỷ quyền</strong> — việc kiểm thử làm <em>khi có văn bản cho phép</em>, trong một <strong>scope</strong> đã thoả thuận, để tìm và vá điểm yếu trước khi kẻ tấn công thật ra tay.</p>
<div class="callout"><span class="badge">Đọc điều này trước</span> Mọi thứ ở đây dành cho hệ thống bạn <strong>sở hữu</strong> hoặc được <strong>cho phép rõ ràng</strong> kiểm thử. Tấn công hệ thống không được uỷ quyền là hành vi phạm pháp. Đây là môn về phương pháp luận và phòng thủ — chủ đích dạy <em>khái niệm</em>, không dạy payload tấn công chạy được ngay.</div>
<h3>Vì sao học tấn công lại dạy phòng thủ</h3>
<p>Bạn không thể bảo vệ thứ mình không hiểu. Khi hiểu cách thu thập thông tin, quét và khai thác hoạt động, bạn biết chính xác biện pháp nào chặn chúng — và đó mới là sản phẩm thật của mỗi lần hack có đạo đức.</p>
<h3>Lộ trình</h3>
<p>Đạo đức &amp; pháp lý → phương pháp luận pentest → thu thập thông tin → quét &amp; liệt kê → phân tích lỗ hổng → khai thác &amp; hậu khai thác (góc phòng thủ) → tấn công web &amp; mạng (ánh xạ OWASP) → báo cáo, khắc phục &amp; purple team. Song ngữ, có quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('hod402-1-1-ethics-legal', '1.1 — Ethical hacking & the law|||1.1 — Hacking đạo đức & pháp lý',
  'Ethical hacking là gì; mũ trắng/đen/xám; uỷ quyền, scope, rules of engagement; khuôn khổ pháp lý và hệ quả của việc kiểm thử trái phép.',
  [[
    `<span class="eyebrow">HOD402 · Chapter 1 · Lesson 1.1</span>
<h2>Ethical hacking &amp; the law</h2>
<h3>What ethical hacking is</h3>
<p>An <strong>ethical hacker</strong> uses the same techniques as an attacker, but <em>legally, with permission, and to help the owner</em>. The single line that separates a penetration test from a crime is <strong>authorization</strong>.</p>
<ul>
<li><strong>White hat</strong> — tests with permission and reports findings to fix them.</li>
<li><strong>Black hat</strong> — attacks illegally for personal gain or harm.</li>
<li><strong>Grey hat</strong> — acts without clear permission; still legally risky even if well intentioned.</li>
</ul>
<h3>Authorization &amp; scope</h3>
<p>Before any testing, a <strong>rules of engagement (RoE)</strong> document defines the <strong>scope</strong> (which IPs, domains, hours), what is off-limits, and who to contact. Testing outside scope is unauthorized access.</p>
<h3>Ethics &amp; defensive takeaway</h3>
<p>Under laws such as Vietnam Cybersecurity Law and the equivalents abroad, unauthorized access is a crime regardless of intent. The professional habit: <strong>get written permission, stay in scope, protect any data you touch, and report responsibly</strong>.</p>
<div class="callout"><span class="badge">Rule zero</span> No signed authorization, no test. This is the first control a mature security program enforces.</div>`,
    `<span class="eyebrow">HOD402 · Chương 1 · Bài 1.1</span>
<h2>Hacking đạo đức &amp; pháp lý</h2>
<h3>Hacking có đạo đức là gì</h3>
<p>Một <strong>hacker có đạo đức</strong> dùng đúng kỹ thuật của kẻ tấn công, nhưng <em>hợp pháp, có phép, và để giúp chủ sở hữu</em>. Ranh giới duy nhất tách một cuộc pentest khỏi một tội phạm là <strong>uỷ quyền</strong>.</p>
<ul>
<li><strong>Mũ trắng</strong> — kiểm thử khi có phép và báo cáo để vá lỗi.</li>
<li><strong>Mũ đen</strong> — tấn công trái phép vì lợi ích cá nhân hoặc gây hại.</li>
<li><strong>Mũ xám</strong> — hành động khi chưa có phép rõ ràng; vẫn rủi ro pháp lý dù thiện chí.</li>
</ul>
<h3>Uỷ quyền &amp; scope</h3>
<p>Trước khi kiểm thử, một văn bản <strong>rules of engagement (RoE)</strong> xác định <strong>scope</strong> (IP, tên miền, khung giờ nào), thứ gì cấm chạm, và liên hệ với ai. Kiểm thử ngoài scope là truy cập trái phép.</p>
<h3>Đạo đức &amp; điểm phòng thủ</h3>
<p>Theo các luật như Luật An ninh mạng Việt Nam và tương đương ở nước ngoài, truy cập trái phép là tội phạm bất kể ý định. Thói quen chuyên nghiệp: <strong>xin phép bằng văn bản, ở trong scope, bảo vệ mọi dữ liệu chạm tới, và báo cáo có trách nhiệm</strong>.</p>
<div class="callout"><span class="badge">Quy tắc số 0</span> Không có uỷ quyền ký tên thì không kiểm thử. Đây là biện pháp đầu tiên mà một chương trình bảo mật trưởng thành áp dụng.</div>`,
  ]]);

const c1q = quiz('hod402-quiz-1', 'Quiz 1 — Ethics & law|||Quiz 1 — Đạo đức & pháp lý', [
  { id: 'q1', question: 'Ranh giới duy nhất tách pentest khỏi tội phạm là gì?|||What is the single line separating a pentest from a crime?', options: ['Công cụ dùng|||The tools used', 'Uỷ quyền (authorization)|||Authorization', 'Độ khó mục tiêu|||Target difficulty', 'Thời gian kiểm thử|||Testing time'], correctIndex: 1, explanation: 'Cùng kỹ thuật, nhưng phải có phép — uỷ quyền là điều kiện tiên quyết.' },
  { id: 'q2', question: 'Văn bản xác định scope, giờ kiểm thử và thứ cấm chạm gọi là?|||The document defining scope, hours and off-limits targets is?', options: ['Rules of engagement (RoE)', 'CVE', 'Payload', 'Firewall'], correctIndex: 0, explanation: 'RoE quy định phạm vi và giới hạn của cuộc kiểm thử.' },
  { id: 'q3', question: 'Hacker mũ trắng khác mũ đen ở điểm cốt lõi nào?|||What core point distinguishes a white hat from a black hat?', options: ['Kỹ năng cao hơn|||Higher skill', 'Có phép & báo cáo để vá|||Permission & reports to fix', 'Dùng nhiều công cụ hơn|||Uses more tools', 'Làm việc ban đêm|||Works at night'], correctIndex: 1, explanation: 'Mũ trắng kiểm thử hợp pháp, có phép và báo cáo để khắc phục.' },
]);

const c2 = doc('hod402-2-1-methodology', '2.1 — The pentest methodology|||2.1 — Phương pháp luận pentest',
  'Các pha PTES/CEH: reconnaissance → scanning → gaining access → post-exploitation → reporting; vì sao quy trình lặp lại được quan trọng hơn mẹo lẻ.',
  [[
    `<span class="eyebrow">HOD402 · Chapter 2 · Lesson 2.1</span>
<h2>The pentest methodology</h2>
<p>Professional testing follows a repeatable process, not random tricks. The <strong>PTES</strong> and <strong>CEH</strong> phases line up closely:</p>
<pre><code>1. Reconnaissance   -> gather information (OSINT)
2. Scanning         -> find live hosts, ports, services
3. Gaining access   -> exploit a validated weakness
4. Post-exploitation-> assess impact (data reachable, pivot)
5. Reporting        -> document findings and fixes
</code></pre>
<h3>Pre-engagement comes first</h3>
<p>Before phase 1 there is always <strong>pre-engagement</strong>: scope, RoE, and authorization. PTES also adds <strong>threat modeling</strong> and <strong>vulnerability analysis</strong> between recon and exploitation.</p>
<h3>Defensive takeaway</h3>
<p>Defenders map their controls onto the same phases — threat intelligence limits recon value, network segmentation limits scanning, patching removes the exploit, and logging/EDR catches post-exploitation. A good report follows the phases so each finding pairs with a control.</p>
<div class="callout"><span class="badge">Process over tricks</span> The value of a pentest is a <em>reproducible</em> methodology anyone can follow, review and defend against.</div>`,
    `<span class="eyebrow">HOD402 · Chương 2 · Bài 2.1</span>
<h2>Phương pháp luận pentest</h2>
<p>Kiểm thử chuyên nghiệp theo một quy trình lặp lại được, không phải mẹo ngẫu nhiên. Các pha <strong>PTES</strong> và <strong>CEH</strong> khớp nhau khá sát:</p>
<pre><code>1. Thu thập thông tin -> gom thông tin (OSINT)
2. Quét              -> tìm host sống, cổng, dịch vụ
3. Giành quyền truy cập -> khai thác điểm yếu đã xác thực
4. Hậu khai thác     -> đánh giá tác động (dữ liệu chạm tới, pivot)
5. Báo cáo           -> ghi lại phát hiện và cách vá
</code></pre>
<h3>Tiền giao kèo đến trước</h3>
<p>Trước pha 1 luôn có <strong>pre-engagement</strong>: scope, RoE và uỷ quyền. PTES còn thêm <strong>mô hình hoá mối đe doạ</strong> và <strong>phân tích lỗ hổng</strong> giữa thu thập và khai thác.</p>
<h3>Điểm phòng thủ</h3>
<p>Người phòng thủ ánh xạ biện pháp của mình lên chính các pha đó — tình báo mối đe doạ làm giảm giá trị thu thập, phân vùng mạng hạn chế quét, vá lỗi xoá đường khai thác, và log/EDR bắt hậu khai thác. Báo cáo tốt bám các pha để mỗi phát hiện đi kèm một biện pháp.</p>
<div class="callout"><span class="badge">Quy trình hơn mẹo lẻ</span> Giá trị của pentest là một phương pháp luận <em>tái lập được</em> mà ai cũng theo, soi lại và phòng thủ được.</div>`,
  ]]);

const c2q = quiz('hod402-quiz-2', 'Quiz 2 — Methodology|||Quiz 2 — Phương pháp luận', [
  { id: 'q1', question: 'Thứ tự đúng các pha pentest là?|||The correct order of pentest phases is?', options: ['Báo cáo → quét → thu thập|||Reporting → scanning → recon', 'Thu thập → quét → giành quyền → hậu khai thác → báo cáo|||Recon → scanning → access → post → reporting', 'Khai thác → thu thập → quét|||Exploit → recon → scanning', 'Quét → báo cáo → thu thập|||Scanning → reporting → recon'], correctIndex: 1, explanation: 'PTES/CEH: thu thập → quét → giành quyền → hậu khai thác → báo cáo.' },
  { id: 'q2', question: 'Bước LUÔN đến trước pha thu thập thông tin là?|||What ALWAYS comes before reconnaissance?', options: ['Pre-engagement: scope & uỷ quyền|||Pre-engagement: scope & authorization', 'Khai thác|||Exploitation', 'Viết báo cáo|||Writing the report', 'Cài Metasploit|||Installing Metasploit'], correctIndex: 0, explanation: 'Không có scope và uỷ quyền thì không bắt đầu bất kỳ pha kỹ thuật nào.' },
  { id: 'q3', question: 'Vì sao quy trình lặp lại được quan trọng?|||Why does a repeatable process matter?', options: ['Chạy nhanh hơn|||Runs faster', 'Tái lập, soi lại & phòng thủ được|||Reproducible, reviewable & defensible', 'Ít công cụ hơn|||Fewer tools', 'Không cần báo cáo|||No report needed'], correctIndex: 1, explanation: 'Phương pháp luận tái lập được là sản phẩm thật của pentest.' },
]);

const c3 = doc('hod402-3-1-recon', '3.1 — Information gathering (reconnaissance)|||3.1 — Thu thập thông tin (reconnaissance)',
  'Reconnaissance & OSINT; phân biệt passive vs active; footprinting bề mặt tấn công; biện pháp giảm lộ thông tin.',
  [[
    `<span class="eyebrow">HOD402 · Chapter 3 · Lesson 3.1</span>
<h2>Information gathering</h2>
<p>Reconnaissance maps the target before any interaction. It splits into two kinds:</p>
<ul>
<li><strong>Passive</strong> — gather public information without touching the target: WHOIS, DNS records, search engines, public code and leaked data. This is <strong>OSINT</strong> (open-source intelligence).</li>
<li><strong>Active</strong> — interact with the target directly (pings, banner grabbing), which can be logged and detected.</li>
</ul>
<h3>What footprinting reveals</h3>
<p>Domains, subdomains, IP ranges, technologies, employee names and emails — together they draw the <strong>attack surface</strong>.</p>
<h3>Defensive takeaway</h3>
<ul>
<li>Minimize public exposure: review DNS records, code repositories and document metadata.</li>
<li>Train staff against social engineering and phishing that recon enables.</li>
<li>Monitor for leaked credentials and typosquatting domains.</li>
</ul>
<div class="callout"><span class="badge">Concept only</span> This course discusses <em>what</em> reconnaissance finds and how to reduce it — not step-by-step scripts to harvest a live target.</div>`,
    `<span class="eyebrow">HOD402 · Chương 3 · Bài 3.1</span>
<h2>Thu thập thông tin</h2>
<p>Reconnaissance vẽ bản đồ mục tiêu trước mọi tương tác. Nó chia làm hai loại:</p>
<ul>
<li><strong>Passive (bị động)</strong> — gom thông tin công khai mà không chạm mục tiêu: WHOIS, bản ghi DNS, công cụ tìm kiếm, mã nguồn công khai và dữ liệu rò rỉ. Đây là <strong>OSINT</strong> (tình báo nguồn mở).</li>
<li><strong>Active (chủ động)</strong> — tương tác trực tiếp với mục tiêu (ping, lấy banner), có thể bị ghi log và phát hiện.</li>
</ul>
<h3>Footprinting để lộ những gì</h3>
<p>Tên miền, tên miền phụ, dải IP, công nghệ, tên và email nhân viên — cùng nhau vẽ nên <strong>bề mặt tấn công</strong>.</p>
<h3>Điểm phòng thủ</h3>
<ul>
<li>Giảm lộ thông tin công khai: rà bản ghi DNS, kho mã nguồn và metadata tài liệu.</li>
<li>Huấn luyện nhân viên chống social engineering và phishing mà recon tạo tiền đề.</li>
<li>Theo dõi thông tin đăng nhập rò rỉ và tên miền giả mạo (typosquatting).</li>
</ul>
<div class="callout"><span class="badge">Chỉ khái niệm</span> Môn này bàn <em>recon tìm thấy gì</em> và cách giảm nó — không đưa script từng bước để thu thập một mục tiêu thật.</div>`,
  ]]);

const c3q = quiz('hod402-quiz-3', 'Quiz 3 — Reconnaissance|||Quiz 3 — Thu thập thông tin', [
  { id: 'q1', question: 'Thu thập thông tin công khai KHÔNG chạm mục tiêu gọi là?|||Gathering public info WITHOUT touching the target is?', options: ['Active recon', 'Passive recon (OSINT)', 'Khai thác|||Exploitation', 'Báo cáo|||Reporting'], correctIndex: 1, explanation: 'Passive/OSINT dùng nguồn công khai, không tương tác trực tiếp.' },
  { id: 'q2', question: 'Vì sao active recon dễ bị phát hiện hơn passive?|||Why is active recon more detectable than passive?', options: ['Nó tương tác trực tiếp, bị ghi log|||It interacts directly and gets logged', 'Nó chậm hơn|||It is slower', 'Nó không dùng công cụ|||It uses no tools', 'Nó hợp pháp hơn|||It is more legal'], correctIndex: 0, explanation: 'Tương tác trực tiếp (ping, banner) để lại dấu vết trong log.' },
  { id: 'q3', question: 'Biện pháp phòng thủ chống thu thập thông tin là?|||A defense against information gathering is?', options: ['Mở hết mọi cổng|||Open every port', 'Giảm lộ thông tin công khai & chống phishing|||Minimize public exposure & counter phishing', 'Tắt log|||Disable logging', 'Công khai email nội bộ|||Publish internal emails'], correctIndex: 1, explanation: 'Giảm bề mặt lộ thông tin và huấn luyện chống social engineering.' },
]);

const c4 = doc('hod402-4-1-scanning-enum', '4.1 — Scanning & enumeration|||4.1 — Quét & liệt kê',
  'Khái niệm scanning (host/port/service), vai trò Nmap, enumeration; góc phòng thủ: đóng cổng thừa, firewall, IDS/IPS.',
  [[
    `<span class="eyebrow">HOD402 · Chapter 4 · Lesson 4.1</span>
<h2>Scanning &amp; enumeration</h2>
<h3>Scanning</h3>
<p>Scanning turns a list of addresses into a map of what is reachable: which <strong>hosts</strong> are alive, which <strong>ports</strong> are open, and which <strong>services and versions</strong> run behind them. <strong>Nmap</strong> is the standard tool for this discovery step.</p>
<h3>Enumeration</h3>
<p><strong>Enumeration</strong> goes one level deeper: extracting usernames, shares, and service details from those open services to plan the next step.</p>
<h3>Defensive takeaway</h3>
<ul>
<li>Close unused ports and remove unneeded services — a smaller attack surface is scanned faster by defenders too.</li>
<li>Use a <strong>firewall</strong> to allow only required traffic, and an <strong>IDS/IPS</strong> to flag scan patterns.</li>
<li>Hide version banners where possible; keep services patched so a known version is not a free exploit.</li>
</ul>
<div class="callout"><span class="badge">Blue-team view</span> The same scan an auditor runs, run it yourself first: you cannot defend a port you did not know was open.</div>`,
    `<span class="eyebrow">HOD402 · Chương 4 · Bài 4.1</span>
<h2>Quét &amp; liệt kê</h2>
<h3>Quét (scanning)</h3>
<p>Quét biến một danh sách địa chỉ thành bản đồ những gì chạm tới được: <strong>host</strong> nào đang sống, <strong>cổng</strong> nào mở, và <strong>dịch vụ cùng phiên bản</strong> nào chạy phía sau. <strong>Nmap</strong> là công cụ tiêu chuẩn cho bước khám phá này.</p>
<h3>Liệt kê (enumeration)</h3>
<p><strong>Liệt kê</strong> đi sâu hơn một cấp: rút tên người dùng, thư mục chia sẻ và chi tiết dịch vụ từ các dịch vụ mở đó để lên kế hoạch bước tiếp.</p>
<h3>Điểm phòng thủ</h3>
<ul>
<li>Đóng cổng không dùng và gỡ dịch vụ không cần — bề mặt tấn công nhỏ hơn thì người phòng thủ cũng rà nhanh hơn.</li>
<li>Dùng <strong>firewall</strong> chỉ cho lưu lượng cần thiết, và <strong>IDS/IPS</strong> để đánh dấu mẫu quét.</li>
<li>Ẩn banner phiên bản khi có thể; giữ dịch vụ được vá để một phiên bản đã biết không thành đường khai thác miễn phí.</li>
</ul>
<div class="callout"><span class="badge">Góc đội xanh</span> Đúng bản quét mà kiểm toán viên chạy, hãy tự chạy trước: bạn không thể phòng thủ một cổng mà mình không biết là đang mở.</div>`,
  ]]);

const c4q = quiz('hod402-quiz-4', 'Quiz 4 — Scanning & enumeration|||Quiz 4 — Quét & liệt kê', [
  { id: 'q1', question: 'Công cụ tiêu chuẩn để khám phá host/cổng/dịch vụ là?|||The standard tool for host/port/service discovery is?', options: ['Nmap', 'Excel', 'WHOIS', 'Wireshark'], correctIndex: 0, explanation: 'Nmap là công cụ quét mạng tiêu chuẩn.' },
  { id: 'q2', question: 'Liệt kê (enumeration) khác quét ở chỗ?|||Enumeration differs from scanning in that it?', options: ['Rút chi tiết như tên người dùng, share|||Extracts details like usernames, shares', 'Chỉ ping host|||Only pings hosts', 'Xoá log|||Deletes logs', 'Viết báo cáo|||Writes reports'], correctIndex: 0, explanation: 'Enumeration đi sâu hơn để rút chi tiết từ dịch vụ mở.' },
  { id: 'q3', question: 'Biện pháp phòng thủ chống quét là?|||A defense against scanning is?', options: ['Mở mọi cổng|||Open all ports', 'Đóng cổng thừa, firewall & IDS/IPS|||Close unused ports, firewall & IDS/IPS', 'Bỏ vá lỗi|||Stop patching', 'Công khai banner phiên bản|||Publish version banners'], correctIndex: 1, explanation: 'Giảm cổng mở, lọc firewall và phát hiện mẫu quét bằng IDS/IPS.' },
]);

const c5 = doc('hod402-5-1-vuln-analysis', '5.1 — Vulnerability analysis|||5.1 — Phân tích lỗ hổng',
  'Vulnerability assessment vs pentest; CVE & CVSS; công cụ quét lỗ hổng (Nessus/OpenVAS); ưu tiên vá theo rủi ro.',
  [[
    `<span class="eyebrow">HOD402 · Chapter 5 · Lesson 5.1</span>
<h2>Vulnerability analysis</h2>
<h3>Assessment vs penetration test</h3>
<p>A <strong>vulnerability assessment</strong> lists and rates weaknesses; a <strong>penetration test</strong> goes further and safely proves which are truly exploitable. Analysis is the bridge between scanning and exploitation.</p>
<h3>CVE &amp; CVSS</h3>
<ul>
<li><strong>CVE</strong> — a public identifier for a specific known vulnerability (e.g. CVE-2021-44228).</li>
<li><strong>CVSS</strong> — a 0-10 score of severity, so teams fix the most dangerous issues first.</li>
</ul>
<p>Scanners such as <strong>Nessus</strong> and <strong>OpenVAS</strong> compare discovered software versions against these databases and report matches.</p>
<h3>Defensive takeaway</h3>
<p>The output feeds <strong>patch and risk management</strong>: prioritize by CVSS <em>and</em> business context (is it internet-facing? does it hold sensitive data?). A high score on an isolated test box matters less than a medium score on a public login page.</p>
<div class="callout"><span class="badge">Verify, do not assume</span> Scanners produce false positives — an ethical hacker validates a finding before reporting it as real.</div>`,
    `<span class="eyebrow">HOD402 · Chương 5 · Bài 5.1</span>
<h2>Phân tích lỗ hổng</h2>
<h3>Đánh giá lỗ hổng vs kiểm thử xâm nhập</h3>
<p>Một <strong>đánh giá lỗ hổng</strong> liệt kê và chấm điểm điểm yếu; một <strong>kiểm thử xâm nhập</strong> đi xa hơn và chứng minh an toàn cái nào thật sự khai thác được. Phân tích là cầu nối giữa quét và khai thác.</p>
<h3>CVE &amp; CVSS</h3>
<ul>
<li><strong>CVE</strong> — mã định danh công khai cho một lỗ hổng đã biết cụ thể (vd CVE-2021-44228).</li>
<li><strong>CVSS</strong> — điểm mức độ nghiêm trọng 0-10, để đội ngũ vá cái nguy hiểm nhất trước.</li>
</ul>
<p>Các công cụ như <strong>Nessus</strong> và <strong>OpenVAS</strong> so phiên bản phần mềm phát hiện được với các cơ sở dữ liệu này và báo cáo trùng khớp.</p>
<h3>Điểm phòng thủ</h3>
<p>Kết quả đi vào <strong>quản lý vá và rủi ro</strong>: ưu tiên theo CVSS <em>và</em> bối cảnh nghiệp vụ (có ra Internet không? có giữ dữ liệu nhạy cảm không?). Điểm cao trên máy thử cô lập ít quan trọng hơn điểm trung bình trên trang đăng nhập công khai.</p>
<div class="callout"><span class="badge">Xác thực, đừng đoán</span> Công cụ quét sinh dương tính giả — hacker có đạo đức xác thực một phát hiện trước khi báo cáo là thật.</div>`,
  ]]);

const c5q = quiz('hod402-quiz-5', 'Quiz 5 — Vulnerability analysis|||Quiz 5 — Phân tích lỗ hổng', [
  { id: 'q1', question: 'CVSS dùng để làm gì?|||What is CVSS used for?', options: ['Đặt tên lỗ hổng|||Name a vulnerability', 'Chấm điểm mức nghiêm trọng 0-10|||Score severity 0-10', 'Quét cổng|||Scan ports', 'Viết payload|||Write payloads'], correctIndex: 1, explanation: 'CVSS cho điểm 0-10 để ưu tiên vá.' },
  { id: 'q2', question: 'CVE là gì?|||What is a CVE?', options: ['Mã định danh công khai của một lỗ hổng đã biết|||A public ID of a known vulnerability', 'Một loại firewall|||A type of firewall', 'Một công cụ quét|||A scanning tool', 'Một chứng chỉ nghề|||A professional certificate'], correctIndex: 0, explanation: 'CVE là mã định danh chuẩn cho lỗ hổng đã biết cụ thể.' },
  { id: 'q3', question: 'Vì sao phải xác thực kết quả của công cụ quét?|||Why validate scanner output?', options: ['Vì chúng luôn đúng|||Because they are always right', 'Vì có dương tính giả|||Because of false positives', 'Vì chúng bất hợp pháp|||Because they are illegal', 'Vì chúng quá chậm|||Because they are too slow'], correctIndex: 1, explanation: 'Công cụ quét sinh dương tính giả; cần xác thực trước khi báo cáo.' },
]);

const c6 = doc('hod402-6-1-exploitation-post', '6.1 — Exploitation & post-exploitation (defensive view)|||6.1 — Khai thác & hậu khai thác (góc phòng thủ)',
  'Khái niệm exploitation; Metasploit ở mức phương pháp; leo thang đặc quyền & lateral movement — hiểu để phòng thủ, KHÔNG payload cụ thể.',
  [[
    `<span class="eyebrow">HOD402 · Chapter 6 · Lesson 6.1</span>
<h2>Exploitation &amp; post-exploitation</h2>
<div class="callout"><span class="badge">Concept only</span> This chapter explains <em>how exploitation works and how to stop it</em>. It does not provide working exploit code — the learning goal is defense.</div>
<h3>What exploitation means</h3>
<p><strong>Exploitation</strong> is turning a validated weakness into access. Frameworks like <strong>Metasploit</strong> organize known techniques so testers can safely and repeatably demonstrate impact in a lab. At the methodology level, the point is: a known vulnerability plus a matching technique equals access.</p>
<h3>Post-exploitation</h3>
<ul>
<li><strong>Privilege escalation</strong> — moving from a low-privilege user to admin/root by abusing misconfigurations or unpatched flaws.</li>
<li><strong>Lateral movement</strong> — using one compromised host to reach others.</li>
<li>The tester measures <em>impact</em> (what data is reachable) rather than causing damage.</li>
</ul>
<h3>Defensive takeaway</h3>
<p>Patch promptly, apply <strong>least privilege</strong>, segment networks, and deploy <strong>EDR/logging</strong> so escalation and lateral movement are detected. Defense-in-depth means one exploited host is not the whole network.</p>`,
    `<span class="eyebrow">HOD402 · Chương 6 · Bài 6.1</span>
<h2>Khai thác &amp; hậu khai thác</h2>
<div class="callout"><span class="badge">Chỉ khái niệm</span> Chương này giải thích <em>khai thác hoạt động thế nào và cách chặn nó</em>. Không cung cấp mã khai thác chạy được — mục tiêu học là phòng thủ.</div>
<h3>Khai thác nghĩa là gì</h3>
<p><strong>Khai thác</strong> là biến một điểm yếu đã xác thực thành quyền truy cập. Các khung như <strong>Metasploit</strong> tổ chức các kỹ thuật đã biết để người kiểm thử chứng minh tác động an toàn và lặp lại được trong lab. Ở mức phương pháp, điểm mấu chốt là: một lỗ hổng đã biết cộng kỹ thuật khớp thì bằng quyền truy cập.</p>
<h3>Hậu khai thác</h3>
<ul>
<li><strong>Leo thang đặc quyền</strong> — đi từ người dùng quyền thấp lên admin/root bằng cách lợi dụng cấu hình sai hoặc lỗi chưa vá.</li>
<li><strong>Lateral movement</strong> — dùng một host bị chiếm để với tới host khác.</li>
<li>Người kiểm thử đo <em>tác động</em> (dữ liệu nào chạm tới được) chứ không gây thiệt hại.</li>
</ul>
<h3>Điểm phòng thủ</h3>
<p>Vá kịp thời, áp <strong>đặc quyền tối thiểu</strong>, phân vùng mạng, và triển khai <strong>EDR/log</strong> để phát hiện leo thang và lateral movement. Phòng thủ nhiều lớp nghĩa là một host bị khai thác không phải là cả mạng.</p>`,
  ]]);

const c6q = quiz('hod402-quiz-6', 'Quiz 6 — Exploitation & post|||Quiz 6 — Khai thác & hậu khai thác', [
  { id: 'q1', question: 'Đi từ quyền thấp lên admin/root gọi là?|||Moving from low privilege to admin/root is called?', options: ['Reconnaissance', 'Leo thang đặc quyền (privilege escalation)|||Privilege escalation', 'Báo cáo|||Reporting', 'Quét cổng|||Port scanning'], correctIndex: 1, explanation: 'Privilege escalation lợi dụng cấu hình sai/lỗi chưa vá để nâng quyền.' },
  { id: 'q2', question: 'Biện pháp phòng thủ chống leo thang & lateral movement là?|||A defense against escalation & lateral movement is?', options: ['Đặc quyền tối thiểu, phân vùng mạng, EDR/log|||Least privilege, segmentation, EDR/logging', 'Cho mọi user quyền admin|||Give every user admin', 'Tắt bản vá|||Disable patches', 'Gộp toàn mạng một vùng|||Flatten the whole network'], correctIndex: 0, explanation: 'Least privilege, phân vùng và EDR/log giới hạn và phát hiện lan rộng.' },
  { id: 'q3', question: 'Trong lab, người kiểm thử có đạo đức nhắm tới điều gì?|||In the lab, what does an ethical tester aim for?', options: ['Gây thiệt hại tối đa|||Maximum damage', 'Đo tác động, không phá hoại|||Measure impact, not destroy', 'Xoá dữ liệu|||Delete data', 'Giữ quyền vĩnh viễn|||Keep access forever'], correctIndex: 1, explanation: 'Mục tiêu là chứng minh tác động an toàn, không gây hại.' },
]);

const c7 = doc('hod402-7-1-web-network', '7.1 — Web & network attacks (OWASP mapping)|||7.1 — Tấn công web & mạng (ánh xạ OWASP)',
  'Các lớp tấn công web/mạng phổ biến ở mức khái niệm; ánh xạ OWASP Top 10; biện pháp phòng chống (validation, mã hoá, phân quyền).',
  [[
    `<span class="eyebrow">HOD402 · Chapter 7 · Lesson 7.1</span>
<h2>Web &amp; network attacks</h2>
<p>Most real-world weaknesses fall into a few well-known classes. <strong>OWASP Top 10</strong> catalogs the web ones; understanding the class matters more than any single payload.</p>
<h3>Common classes (concept)</h3>
<ul>
<li><strong>Injection</strong> (e.g. SQL injection) — untrusted input treated as code. Fix: parameterized queries and input validation.</li>
<li><strong>Broken access control</strong> — users reaching data or actions they should not. Fix: enforce authorization server-side on every request.</li>
<li><strong>Cross-site scripting (XSS)</strong> — malicious script running in a victim browser. Fix: output encoding and a content security policy.</li>
<li><strong>Network-level</strong> — sniffing and man-in-the-middle on unencrypted traffic. Fix: TLS everywhere and network segmentation.</li>
</ul>
<h3>Defensive takeaway</h3>
<p>The pattern repeats: <strong>never trust input, encode output, enforce authorization, encrypt in transit</strong>. Map each finding to its OWASP category so the fix is a known, documented control.</p>
<div class="callout"><span class="badge">Class over payload</span> Learn the vulnerability class and its control; the specific exploit changes, the defensive principle does not.</div>`,
    `<span class="eyebrow">HOD402 · Chương 7 · Bài 7.1</span>
<h2>Tấn công web &amp; mạng</h2>
<p>Hầu hết điểm yếu ngoài đời rơi vào vài lớp quen thuộc. <strong>OWASP Top 10</strong> liệt kê các lớp phía web; hiểu lớp quan trọng hơn bất kỳ payload đơn lẻ nào.</p>
<h3>Các lớp phổ biến (khái niệm)</h3>
<ul>
<li><strong>Injection</strong> (vd SQL injection) — đầu vào không tin cậy bị xử lý như mã. Chặn: truy vấn tham số hoá và kiểm tra đầu vào.</li>
<li><strong>Broken access control</strong> — người dùng chạm tới dữ liệu/hành động không được phép. Chặn: ép phân quyền phía máy chủ trên mọi request.</li>
<li><strong>Cross-site scripting (XSS)</strong> — script độc chạy trong trình duyệt nạn nhân. Chặn: mã hoá đầu ra và content security policy.</li>
<li><strong>Mức mạng</strong> — nghe lén và man-in-the-middle trên lưu lượng không mã hoá. Chặn: TLS khắp nơi và phân vùng mạng.</li>
</ul>
<h3>Điểm phòng thủ</h3>
<p>Mẫu lặp lại: <strong>không tin đầu vào, mã hoá đầu ra, ép phân quyền, mã hoá khi truyền</strong>. Ánh xạ mỗi phát hiện về đúng nhóm OWASP để bản vá là một biện pháp đã biết, có tài liệu.</p>
<div class="callout"><span class="badge">Lớp hơn payload</span> Học lớp lỗ hổng và biện pháp của nó; exploit cụ thể thay đổi, nguyên tắc phòng thủ thì không.</div>`,
  ]]);

const c7q = quiz('hod402-quiz-7', 'Quiz 7 — Web & network|||Quiz 7 — Web & mạng', [
  { id: 'q1', question: 'Đầu vào không tin cậy bị xử lý như mã thuộc lớp lỗ hổng nào?|||Untrusted input treated as code is which class?', options: ['Injection', 'TLS', 'Firewall', 'CVSS'], correctIndex: 0, explanation: 'Injection (vd SQLi); chặn bằng truy vấn tham số hoá.' },
  { id: 'q2', question: 'Biện pháp chống broken access control là?|||The fix for broken access control is?', options: ['Ép phân quyền phía máy chủ mọi request|||Enforce authorization server-side every request', 'Tin đầu vào client|||Trust client input', 'Bỏ TLS|||Drop TLS', 'Công khai mọi API|||Expose every API'], correctIndex: 0, explanation: 'Phân quyền phải được ép ở máy chủ trên từng request.' },
  { id: 'q3', question: 'Vì sao học "lớp lỗ hổng" hơn là học payload cụ thể?|||Why learn the vulnerability class over a specific payload?', options: ['Payload luôn hợp pháp|||Payloads are always legal', 'Exploit đổi, nguyên tắc phòng thủ không đổi|||Exploits change, the defense does not', 'Lớp lỗ hổng dễ chạy hơn|||Classes are easier to run', 'Không cần OWASP|||OWASP is unneeded'], correctIndex: 1, explanation: 'Nguyên tắc phòng thủ theo lớp bền hơn từng exploit riêng lẻ.' },
]);

const c8 = doc('hod402-8-1-reporting-defense', '8.1 — Reporting, remediation & defense|||8.1 — Báo cáo, khắc phục & phòng thủ',
  'Cấu trúc báo cáo pentest; khắc phục theo ưu tiên; purple team (red + blue); đạo đức nghề & chứng chỉ (CEH, OSCP, Security+).',
  [[
    `<span class="eyebrow">HOD402 · Chapter 8 · Lesson 8.1</span>
<h2>Reporting, remediation &amp; defense</h2>
<h3>The report is the product</h3>
<p>A pentest delivers value only through a clear <strong>report</strong>. A good one contains: an executive summary, the scope and methodology, each finding with severity (CVSS) and evidence, and — most important — a <strong>concrete remediation</strong> for every issue.</p>
<h3>Remediation &amp; retest</h3>
<p>Findings are prioritized by risk, fixed by the owner, and then <strong>retested</strong> to confirm the fix. A finding is not closed until it is verified.</p>
<h3>Purple team &amp; the ethics loop</h3>
<ul>
<li><strong>Red team</strong> attacks, <strong>blue team</strong> defends, <strong>purple team</strong> is the two working together so every attack becomes a lasting detection or control.</li>
<li>Ethics never end at the report: protect the data you saw, disclose responsibly, and never keep access.</li>
</ul>
<h3>Career &amp; certifications</h3>
<p>Recognized paths include <strong>CEH</strong>, <strong>OSCP</strong>, and <strong>CompTIA Security+/PenTest+</strong>. They certify both skill and a commitment to a professional code of conduct.</p>
<div class="callout"><span class="badge">Close the loop</span> Offense without a report is vandalism; the deliverable that makes it ethical is a fix the defender can apply.</div>`,
    `<span class="eyebrow">HOD402 · Chương 8 · Bài 8.1</span>
<h2>Báo cáo, khắc phục &amp; phòng thủ</h2>
<h3>Báo cáo mới là sản phẩm</h3>
<p>Một cuộc pentest chỉ tạo giá trị qua một <strong>báo cáo</strong> rõ ràng. Báo cáo tốt gồm: tóm tắt cho lãnh đạo, scope và phương pháp, từng phát hiện kèm mức nghiêm trọng (CVSS) và bằng chứng, và — quan trọng nhất — một <strong>biện pháp khắc phục</strong> cụ thể cho mỗi vấn đề.</p>
<h3>Khắc phục &amp; kiểm lại</h3>
<p>Phát hiện được ưu tiên theo rủi ro, chủ sở hữu vá, rồi <strong>kiểm lại</strong> để xác nhận bản vá. Một phát hiện chưa đóng cho tới khi được xác thực.</p>
<h3>Purple team &amp; vòng đạo đức</h3>
<ul>
<li><strong>Red team</strong> tấn công, <strong>blue team</strong> phòng thủ, <strong>purple team</strong> là hai bên phối hợp để mỗi đòn tấn công thành một khả năng phát hiện hoặc biện pháp lâu dài.</li>
<li>Đạo đức không dừng ở báo cáo: bảo vệ dữ liệu đã thấy, công bố có trách nhiệm, và không bao giờ giữ quyền truy cập.</li>
</ul>
<h3>Nghề nghiệp &amp; chứng chỉ</h3>
<p>Các lộ trình được công nhận gồm <strong>CEH</strong>, <strong>OSCP</strong>, và <strong>CompTIA Security+/PenTest+</strong>. Chúng chứng nhận cả kỹ năng lẫn cam kết với quy tắc ứng xử nghề nghiệp.</p>
<div class="callout"><span class="badge">Khép vòng</span> Tấn công mà không có báo cáo là phá hoại; sản phẩm khiến nó có đạo đức là một bản vá mà người phòng thủ áp dụng được.</div>`,
  ]]);

const c8q = quiz('hod402-quiz-8', 'Quiz 8 — Reporting & defense|||Quiz 8 — Báo cáo & phòng thủ', [
  { id: 'q1', question: 'Sản phẩm thật của một cuộc pentest là gì?|||What is the true deliverable of a pentest?', options: ['Quyền truy cập giữ lại|||Retained access', 'Báo cáo rõ ràng kèm khắc phục|||A clear report with remediation', 'Số cổng đã quét|||The number of ports scanned', 'Payload đã chạy|||The payloads run'], correctIndex: 1, explanation: 'Giá trị nằm ở báo cáo và biện pháp khắc phục cụ thể.' },
  { id: 'q2', question: 'Purple team là gì?|||What is a purple team?', options: ['Chỉ đội tấn công|||The attacking team only', 'Red & blue phối hợp|||Red & blue working together', 'Một công cụ quét|||A scanning tool', 'Một chứng chỉ|||A certificate'], correctIndex: 1, explanation: 'Purple team = red (tấn công) + blue (phòng thủ) phối hợp.' },
  { id: 'q3', question: 'Một phát hiện được coi là "đóng" khi nào?|||When is a finding considered closed?', options: ['Ngay khi ghi vào báo cáo|||As soon as it is written down', 'Khi vá xong & kiểm lại xác nhận|||When fixed & retest confirms it', 'Khi khách hàng quên nó|||When the client forgets it', 'Không bao giờ|||Never'], correctIndex: 1, explanation: 'Phát hiện chỉ đóng sau khi vá và kiểm lại xác nhận.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'HOD402',
    slug: 'hod402-ethical-hacking-and-offensive-security',
    title: 'Ethical Hacking and Offensive Security',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/HOD402.webp',
    shortDescription: 'University course in AUTHORIZED penetration testing & ethical hacking — legal scope & authorization, the pentest methodology, OWASP mapping & a defensive mindset. Concepts & methodology only, no attack payloads.|||Môn đại học về kiểm thử xâm nhập CÓ UỶ QUYỀN & hacking có đạo đức — phạm vi pháp lý & uỷ quyền, phương pháp luận pentest, ánh xạ OWASP & tư duy phòng thủ. Chỉ khái niệm & phương pháp, không payload.',
    description: 'Môn <strong>HOD402 — Ethical Hacking and Offensive Security</strong> (Hacking có đạo đức &amp; An ninh tấn công, ngành An toàn thông tin, kỳ 7) dạy <strong>kiểm thử xâm nhập CÓ UỶ QUYỀN</strong> dưới góc giáo dục. Từ <strong>đạo đức &amp; khuôn khổ pháp lý</strong> (uỷ quyền, scope, rules of engagement) → <strong>phương pháp luận pentest</strong> (thu thập → quét → phân tích lỗ hổng → khai thác → báo cáo) → <strong>web &amp; mạng</strong> (ánh xạ OWASP) → <strong>báo cáo, khắc phục &amp; purple team</strong>. Nhấn mạnh: chỉ thực hành trên hệ thống ĐƯỢC PHÉP hoặc lab, KHÔNG hướng dẫn tấn công phá hoại. Bám chuẩn EC-Council CEH, PTES, NIST SP 800-115.',
    whatYouLearn: 'Phân biệt mũ trắng/đen/xám &amp; yêu cầu uỷ quyền/scope; các pha PTES/CEH; thu thập thông tin (OSINT, passive vs active); quét &amp; liệt kê (khái niệm Nmap, enumeration); phân tích lỗ hổng (CVE/CVSS, công cụ quét); khái niệm khai thác &amp; leo thang đặc quyền (góc phòng thủ); tấn công web/mạng phổ biến &amp; biện pháp phòng chống (OWASP); viết báo cáo pentest, khắc phục &amp; mô hình purple team; đạo đức nghề &amp; chứng chỉ.',
    requirements: 'Kiến thức mạng máy tính (TCP/IP), Linux cơ bản &amp; an toàn thông tin nhập môn. QUAN TRỌNG: chỉ thực hành trên lab riêng hoặc hệ thống có văn bản cho phép — tấn công hệ thống không được uỷ quyền là VI PHẠM PHÁP LUẬT.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Chuẩn CEH/PTES/NIST/OWASP, sách Georgia Weidman, lab hợp pháp, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Pentest có uỷ quyền, đạo đức, pháp lý, tư duy phòng thủ.', lessons: [intro] },
    { title: 'Chương 1 — Đạo đức & pháp lý|||Chapter 1 — Ethics & law', description: 'Mũ trắng/đen/xám, uỷ quyền, scope, RoE, luật.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phương pháp luận|||Chapter 2 — Methodology', description: 'Các pha PTES/CEH: thu thập → quét → khai thác → báo cáo.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thu thập thông tin|||Chapter 3 — Reconnaissance', description: 'OSINT, passive vs active, footprinting, phòng thủ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quét & liệt kê|||Chapter 4 — Scanning & enumeration', description: 'Nmap, enumeration, firewall/IDS, đóng cổng thừa.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích lỗ hổng|||Chapter 5 — Vulnerability analysis', description: 'CVE/CVSS, Nessus/OpenVAS, ưu tiên vá theo rủi ro.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Khai thác & hậu khai thác|||Chapter 6 — Exploitation & post', description: 'Khái niệm khai thác, leo thang đặc quyền, góc phòng thủ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Web & mạng|||Chapter 7 — Web & network', description: 'OWASP Top 10, các lớp tấn công, biện pháp phòng chống.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Báo cáo & phòng thủ|||Chapter 8 — Reporting & defense', description: 'Báo cáo pentest, khắc phục, purple team, đạo đức, chứng chỉ.', lessons: [c8, c8q] },
  ],
};
