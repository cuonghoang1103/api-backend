/**
 * PRS201 — Policy and Risk Management in Information Systems. Giáo trình FLM:
 * quản trị & rủi ro HTTT — khung/tiêu chuẩn (NIST RMF, ISO 27005, COBIT), nhận
 * diện tài sản/đe doạ/lỗ hổng, đánh giá định tính & định lượng (SLE/ARO/ALE),
 * xử lý rủi ro, xây chính sách, kiểm soát/giám sát/tuân thủ, BCP/DRP & pháp lý VN.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('prs201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách Whitman/Mattord, chuẩn NIST/ISO/COBIT miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PRS201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Policy &amp; Risk Management in Information Systems</strong> — governance, risk frameworks, assessment, treatment, security policy, controls and business continuity — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PRS201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Management of Information Security</em> — Whitman &amp; Mattord (Cengage) — the primary text for governance, policy and risk.</li>
<li><em>Principles of Information Security</em> — Whitman &amp; Mattord — foundations of the CIA triad and risk.</li>
</ul>
<h3>🌐 Official / free standards</h3>
<ul>
<li><a href="https://csrc.nist.gov/pubs/sp/800/30/r1/final" target="_blank" rel="noopener">NIST SP 800-30 Rev.1 — Guide for Conducting Risk Assessments</a> (free PDF)</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/37/r2/final" target="_blank" rel="noopener">NIST SP 800-37 Rev.2 — Risk Management Framework (RMF)</a> (free PDF)</li>
<li><a href="https://www.iso.org/standard/80585.html" target="_blank" rel="noopener">ISO/IEC 27005 — Information security risk management</a></li>
<li><a href="https://www.isaca.org/resources/cobit" target="_blank" rel="noopener">ISACA — COBIT governance framework</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ProfessorMesser" target="_blank" rel="noopener">Professor Messer</a> — Security+ risk &amp; governance explained</li>
<li><a href="https://www.youtube.com/@InfosecInstitute" target="_blank" rel="noopener">Infosec</a> — risk management &amp; compliance topics</li>
</ul>
<h3>🛠️ Tools &amp; references</h3>
<ul>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK</a> — catalogue of adversary threats &amp; techniques</li>
<li><a href="https://cwe.mitre.org/" target="_blank" rel="noopener">MITRE CWE</a> &amp; <a href="https://cve.mitre.org/" target="_blank" rel="noopener">CVE</a> — weaknesses &amp; known vulnerabilities</li>
<li><a href="https://www.first.org/cvss/" target="_blank" rel="noopener">FIRST CVSS calculator</a> — score vulnerability severity</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — governance vs management, the CIA triad, what a risk is (asset × threat × vulnerability).</li>
<li><strong>Frameworks</strong> — walk the NIST RMF steps and the ISO 27005 process; know where COBIT fits.</li>
<li><strong>Do the maths</strong> — compute SLE, ARO and ALE for a scenario; compare qualitative vs quantitative.</li>
<li><strong>Job-ready</strong> — draft a policy, pick controls, build a BCP/DRP and an incident-response plan.</li>
</ol></div>`,
    `<span class="eyebrow">PRS201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Chính sách &amp; Quản lý rủi ro trong Hệ thống thông tin</strong> — quản trị, khung rủi ro, đánh giá, xử lý, chính sách bảo mật, kiểm soát và liên tục kinh doanh — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PRS201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Management of Information Security</em> — Whitman &amp; Mattord (Cengage) — sách chính về quản trị, chính sách và rủi ro.</li>
<li><em>Principles of Information Security</em> — Whitman &amp; Mattord — nền tảng bộ ba CIA và rủi ro.</li>
</ul>
<h3>🌐 Tiêu chuẩn chính thức / miễn phí</h3>
<ul>
<li><a href="https://csrc.nist.gov/pubs/sp/800/30/r1/final" target="_blank" rel="noopener">NIST SP 800-30 Rev.1 — Hướng dẫn đánh giá rủi ro</a> (PDF miễn phí)</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/37/r2/final" target="_blank" rel="noopener">NIST SP 800-37 Rev.2 — Khung quản lý rủi ro (RMF)</a> (PDF miễn phí)</li>
<li><a href="https://www.iso.org/standard/80585.html" target="_blank" rel="noopener">ISO/IEC 27005 — Quản lý rủi ro an toàn thông tin</a></li>
<li><a href="https://www.isaca.org/resources/cobit" target="_blank" rel="noopener">ISACA — Khung quản trị COBIT</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ProfessorMesser" target="_blank" rel="noopener">Professor Messer</a> — giảng rủi ro &amp; quản trị theo Security+</li>
<li><a href="https://www.youtube.com/@InfosecInstitute" target="_blank" rel="noopener">Infosec</a> — chủ đề quản lý rủi ro &amp; tuân thủ</li>
</ul>
<h3>🛠️ Công cụ &amp; tra cứu</h3>
<ul>
<li><a href="https://attack.mitre.org/" target="_blank" rel="noopener">MITRE ATT&amp;CK</a> — danh mục mối đe doạ &amp; kỹ thuật tấn công</li>
<li><a href="https://cwe.mitre.org/" target="_blank" rel="noopener">MITRE CWE</a> &amp; <a href="https://cve.mitre.org/" target="_blank" rel="noopener">CVE</a> — điểm yếu &amp; lỗ hổng đã biết</li>
<li><a href="https://www.first.org/cvss/" target="_blank" rel="noopener">Máy tính CVSS (FIRST)</a> — chấm mức nghiêm trọng lỗ hổng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — quản trị (governance) khác quản lý (management), bộ ba CIA, rủi ro là gì (tài sản × đe doạ × lỗ hổng).</li>
<li><strong>Khung chuẩn</strong> — đi qua các bước NIST RMF và quy trình ISO 27005; biết COBIT đứng ở đâu.</li>
<li><strong>Tính toán</strong> — tính SLE, ARO, ALE cho một tình huống; so định tính với định lượng.</li>
<li><strong>Sẵn sàng đi làm</strong> — soạn chính sách, chọn kiểm soát, dựng BCP/DRP và kế hoạch ứng phó sự cố.</li>
</ol></div>`,
  ]]);

const intro = doc('prs201-0-1-overview', 'Course overview: Policy & Risk Management|||Tổng quan: Chính sách & Quản lý rủi ro',
  'Vì sao rủi ro & chính sách quan trọng; bộ ba CIA; rủi ro = tài sản × đe doạ × lỗ hổng; lộ trình 8 chương từ quản trị → khung → đánh giá → xử lý → chính sách → kiểm soát → liên tục kinh doanh.',
  [[
    `<span class="eyebrow">PRS201 · Lesson 0.1 · Overview</span>
<h2>Policy &amp; Risk Management in Information Systems</h2>
<p class="lead">This course teaches you to <strong>protect an organization's information</strong> not by buying tools, but by <strong>managing risk</strong> and <strong>setting policy</strong>. You'll learn to identify what matters, measure the risk to it, decide what to do about that risk, write the rules that keep it in check, and keep the business running when things go wrong.</p>
<h3>The goal: the CIA triad</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorized people see the data.</li>
<li><strong>Integrity</strong> — the data is accurate and not tampered with.</li>
<li><strong>Availability</strong> — the data/service is there when needed.</li>
</ul>
<h3>What "risk" actually means</h3>
<p>Risk is not the same as a threat. A useful working model:</p>
<pre><code>Risk = f(Asset value, Threat likelihood, Vulnerability)
 - Asset        : something of value (data, server, reputation)
 - Threat       : a potential cause of harm (hacker, fire, insider)
 - Vulnerability: a weakness a threat can exploit (unpatched OS)
No vulnerability OR no threat  -> little/no risk
</code></pre>
<h3>Roadmap</h3>
<p>Governance &amp; risk basics → frameworks (NIST RMF, ISO 27005, COBIT) → identify assets/threats/vulnerabilities → assess risk (qualitative &amp; quantitative: SLE/ARO/ALE) → treat risk → write security policy → controls, monitoring &amp; compliance → business continuity, incident response &amp; Vietnamese law. Bilingual, with worked examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">PRS201 · Bài 0.1 · Tổng quan</span>
<h2>Chính sách &amp; Quản lý rủi ro trong Hệ thống thông tin</h2>
<p class="lead">Môn này dạy bạn <strong>bảo vệ thông tin của tổ chức</strong> không phải bằng cách mua công cụ, mà bằng <strong>quản lý rủi ro</strong> và <strong>đặt ra chính sách</strong>. Bạn học cách nhận diện thứ quan trọng, đo rủi ro với nó, quyết định làm gì với rủi ro đó, viết ra quy tắc giữ nó trong tầm kiểm soát, và giữ cho tổ chức vận hành khi sự cố xảy ra.</p>
<h3>Mục tiêu: bộ ba CIA</h3>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ người được phép mới xem được dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu chính xác, không bị sửa trộm.</li>
<li><strong>Sẵn sàng (Availability)</strong> — dữ liệu/dịch vụ có mặt khi cần.</li>
</ul>
<h3>"Rủi ro" thực chất là gì</h3>
<p>Rủi ro không phải là mối đe doạ. Một mô hình làm việc hữu ích:</p>
<pre><code>Rủi ro = f(Giá trị tài sản, Khả năng đe doạ, Lỗ hổng)
 - Tài sản  : thứ có giá trị (dữ liệu, máy chủ, uy tín)
 - Đe doạ   : nguyên nhân gây hại tiềm tàng (hacker, cháy, nội gián)
 - Lỗ hổng  : điểm yếu mà đe doạ khai thác được (OS chưa vá)
Không lỗ hổng HOẶC không đe doạ -> rủi ro rất thấp/không có
</code></pre>
<h3>Lộ trình</h3>
<p>Quản trị &amp; rủi ro cơ bản → khung chuẩn (NIST RMF, ISO 27005, COBIT) → nhận diện tài sản/đe doạ/lỗ hổng → đánh giá rủi ro (định tính &amp; định lượng: SLE/ARO/ALE) → xử lý rủi ro → viết chính sách bảo mật → kiểm soát, giám sát &amp; tuân thủ → liên tục kinh doanh, ứng phó sự cố &amp; pháp lý Việt Nam. Song ngữ, có ví dụ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('prs201-1-1-governance', '1.1 — IS governance & risk overview|||1.1 — Tổng quan quản trị & rủi ro HTTT',
  'Quản trị (governance) khác quản lý; vai trò lãnh đạo & khẩu vị rủi ro (risk appetite); rủi ro/mối đe doạ/lỗ hổng/tác động; vòng đời quản lý rủi ro.',
  [[
    `<span class="eyebrow">PRS201 · Chapter 1 · Lesson 1.1</span>
<h2>IS governance &amp; risk overview</h2>
<h3>Governance vs management</h3>
<p><strong>Governance</strong> sets direction and accountability — the board and senior leaders decide <em>what</em> risks are acceptable and <em>who</em> is responsible. <strong>Management</strong> executes — it runs the day-to-day controls. Whitman &amp; Mattord stress that information security is a <strong>management problem first</strong>, a technology problem second.</p>
<h3>Key vocabulary</h3>
<ul>
<li><strong>Asset</strong> — anything of value (data, hardware, people, reputation).</li>
<li><strong>Threat</strong> — a potential cause of an unwanted incident; a <strong>threat agent</strong> is who/what triggers it.</li>
<li><strong>Vulnerability</strong> — a weakness that a threat can exploit.</li>
<li><strong>Impact</strong> — the harm if it happens; <strong>likelihood</strong> — how probable it is.</li>
<li><strong>Risk appetite / tolerance</strong> — how much risk leadership is willing to accept.</li>
</ul>
<h3>The risk management life cycle</h3>
<pre><code>1. Identify   -> assets, threats, vulnerabilities
2. Assess     -> likelihood x impact = risk level
3. Treat      -> mitigate / transfer / accept / avoid
4. Monitor    -> review controls, re-assess, report
   (repeat continuously — risk is never "done")
</code></pre>
<div class="callout"><span class="badge">Big idea</span> You cannot eliminate all risk, and trying to would bankrupt the business. The job of risk management is to bring risk down to a level leadership has <em>consciously accepted</em> — no more, no less.</div>`,
    `<span class="eyebrow">PRS201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản trị &amp; rủi ro HTTT</h2>
<h3>Quản trị khác quản lý</h3>
<p><strong>Quản trị (governance)</strong> đặt định hướng và trách nhiệm giải trình — hội đồng và lãnh đạo cấp cao quyết định <em>rủi ro nào</em> chấp nhận được và <em>ai</em> chịu trách nhiệm. <strong>Quản lý (management)</strong> thực thi — vận hành kiểm soát hằng ngày. Whitman &amp; Mattord nhấn mạnh an toàn thông tin <strong>trước hết là bài toán quản lý</strong>, sau mới đến công nghệ.</p>
<h3>Từ vựng cốt lõi</h3>
<ul>
<li><strong>Tài sản (asset)</strong> — bất cứ thứ gì có giá trị (dữ liệu, phần cứng, con người, uy tín).</li>
<li><strong>Mối đe doạ (threat)</strong> — nguyên nhân tiềm tàng của sự cố; <strong>tác nhân đe doạ</strong> là ai/cái gì kích hoạt nó.</li>
<li><strong>Lỗ hổng (vulnerability)</strong> — điểm yếu mà mối đe doạ khai thác được.</li>
<li><strong>Tác động (impact)</strong> — thiệt hại nếu xảy ra; <strong>khả năng (likelihood)</strong> — mức độ dễ xảy ra.</li>
<li><strong>Khẩu vị / ngưỡng chịu rủi ro</strong> — mức rủi ro lãnh đạo sẵn sàng chấp nhận.</li>
</ul>
<h3>Vòng đời quản lý rủi ro</h3>
<pre><code>1. Nhận diện -> tài sản, mối đe doạ, lỗ hổng
2. Đánh giá  -> khả năng x tác động = mức rủi ro
3. Xử lý     -> giảm / chuyển / chấp nhận / tránh
4. Giám sát  -> rà kiểm soát, đánh giá lại, báo cáo
   (lặp liên tục — rủi ro không bao giờ "xong")
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Bạn không thể xoá hết rủi ro, và cố làm vậy sẽ khiến tổ chức phá sản. Việc của quản lý rủi ro là kéo rủi ro xuống mức mà lãnh đạo đã <em>chủ động chấp nhận</em> — không hơn, không kém.</div>`,
  ]]);

const c1q = quiz('prs201-quiz-1', 'Quiz 1 — Governance & risk|||Quiz 1 — Quản trị & rủi ro', [
  { id: 'q1', question: 'Điểm khác nhau cốt lõi giữa "governance" (quản trị) và "management" (quản lý) là?', options: ['Governance vận hành kiểm soát hằng ngày, management đặt định hướng', 'Governance đặt định hướng & trách nhiệm, management thực thi hằng ngày', 'Hai từ đồng nghĩa hoàn toàn', 'Governance chỉ là việc của bộ phận IT'], correctIndex: 1, explanation: 'Governance đặt định hướng và trách nhiệm giải trình; management thực thi các kiểm soát hằng ngày.' },
  { id: 'q2', question: 'Trong quản lý rủi ro, "lỗ hổng" (vulnerability) là gì?', options: ['Nguyên nhân gây hại tiềm tàng', 'Điểm yếu mà mối đe doạ có thể khai thác', 'Thiệt hại khi sự cố xảy ra', 'Thứ có giá trị cần bảo vệ'], correctIndex: 1, explanation: 'Lỗ hổng là điểm yếu; mối đe doạ (threat) mới là nguyên nhân gây hại, còn tài sản (asset) là thứ có giá trị.' },
  { id: 'q3', question: '"Risk appetite" (khẩu vị rủi ro) nói về điều gì?', options: ['Mức rủi ro lãnh đạo sẵn sàng chấp nhận', 'Số lượng lỗ hổng trong hệ thống', 'Chi phí mua công cụ bảo mật', 'Tốc độ vá lỗi'], correctIndex: 0, explanation: 'Khẩu vị rủi ro là mức rủi ro mà lãnh đạo chủ động chấp nhận — cơ sở để quyết định xử lý tới đâu.' },
]);

const c2 = doc('prs201-2-1-frameworks', '2.1 — Frameworks & standards|||2.1 — Khung & tiêu chuẩn',
  'NIST RMF (7 bước), ISO/IEC 27005 (quy trình lặp), ISO 27001/27002, COBIT (quản trị CNTT); mỗi khung dùng khi nào và bổ trợ nhau ra sao.',
  [[
    `<span class="eyebrow">PRS201 · Chapter 2 · Lesson 2.1</span>
<h2>Frameworks &amp; standards</h2>
<p>You don't invent risk management from scratch — you follow a <strong>framework</strong>. Three matter most:</p>
<h3>NIST Risk Management Framework (SP 800-37)</h3>
<pre><code>NIST RMF — 7 steps:
 0. Prepare      -> context, roles, risk strategy
 1. Categorize   -> classify system &amp; data by impact
 2. Select       -> pick security controls (SP 800-53)
 3. Implement    -> put the controls in place
 4. Assess       -> test that controls work
 5. Authorize    -> leadership accepts residual risk
 6. Monitor      -> ongoing checks, re-authorize
</code></pre>
<h3>ISO/IEC 27005</h3>
<p>The international standard for <strong>information security risk management</strong>. It defines an iterative process: <em>establish context → risk identification → analysis → evaluation → treatment</em>, with communication and monitoring throughout. It plugs into an <strong>ISO 27001</strong> ISMS (management system); <strong>ISO 27002</strong> is the catalogue of controls.</p>
<h3>COBIT</h3>
<p>ISACA's <strong>governance</strong> framework for enterprise IT. Where NIST/ISO focus on security risk, COBIT aligns IT with business goals, defining who is accountable and how IT delivers value — it answers "is IT governed well?", not just "is it secure?".</p>
<div class="callout"><span class="badge">How they fit</span> COBIT governs (direction &amp; accountability); ISO 27001/27005 runs the security management &amp; risk process; NIST RMF/SP 800-53 give concrete steps and a control catalogue. They overlap and reinforce, not compete.</div>`,
    `<span class="eyebrow">PRS201 · Chương 2 · Bài 2.1</span>
<h2>Khung &amp; tiêu chuẩn</h2>
<p>Bạn không tự nghĩ ra quản lý rủi ro từ đầu — bạn theo một <strong>khung (framework)</strong>. Ba khung quan trọng nhất:</p>
<h3>Khung quản lý rủi ro NIST (SP 800-37)</h3>
<pre><code>NIST RMF — 7 bước:
 0. Chuẩn bị   -> bối cảnh, vai trò, chiến lược rủi ro
 1. Phân loại  -> xếp hạng hệ thống &amp; dữ liệu theo tác động
 2. Chọn       -> chọn kiểm soát bảo mật (SP 800-53)
 3. Triển khai -> đưa kiểm soát vào vận hành
 4. Đánh giá   -> kiểm tra kiểm soát có hiệu lực
 5. Cho phép   -> lãnh đạo chấp nhận rủi ro còn lại
 6. Giám sát   -> kiểm tra liên tục, cấp phép lại
</code></pre>
<h3>ISO/IEC 27005</h3>
<p>Tiêu chuẩn quốc tế cho <strong>quản lý rủi ro an toàn thông tin</strong>. Nó định nghĩa quy trình lặp: <em>thiết lập bối cảnh → nhận diện rủi ro → phân tích → đánh giá → xử lý</em>, kèm truyền thông và giám sát xuyên suốt. Nó gắn vào hệ thống quản lý ISMS theo <strong>ISO 27001</strong>; <strong>ISO 27002</strong> là danh mục các kiểm soát.</p>
<h3>COBIT</h3>
<p>Khung <strong>quản trị</strong> CNTT doanh nghiệp của ISACA. Trong khi NIST/ISO tập trung vào rủi ro bảo mật, COBIT gắn CNTT với mục tiêu kinh doanh, xác định ai chịu trách nhiệm và CNTT tạo giá trị ra sao — nó trả lời "CNTT có được quản trị tốt không?", không chỉ "có an toàn không?".</p>
<div class="callout"><span class="badge">Chúng khớp thế nào</span> COBIT quản trị (định hướng &amp; trách nhiệm); ISO 27001/27005 vận hành quy trình quản lý &amp; rủi ro bảo mật; NIST RMF/SP 800-53 cho các bước cụ thể và danh mục kiểm soát. Chúng chồng lấn và bổ trợ, không cạnh tranh.</div>`,
  ]]);

const c2q = quiz('prs201-quiz-2', 'Quiz 2 — Frameworks|||Quiz 2 — Khung chuẩn', [
  { id: 'q1', question: 'NIST SP 800-37 mô tả điều gì?', options: ['Khung quản lý rủi ro (RMF) 7 bước', 'Danh mục các mối đe doạ tấn công', 'Bộ luật an ninh mạng Việt Nam', 'Máy tính điểm CVSS'], correctIndex: 0, explanation: 'SP 800-37 định nghĩa Khung quản lý rủi ro (RMF) với các bước Chuẩn bị → Phân loại → Chọn → Triển khai → Đánh giá → Cho phép → Giám sát.' },
  { id: 'q2', question: 'Tiêu chuẩn quốc tế chuyên về quản lý rủi ro an toàn thông tin là?', options: ['ISO 9001', 'ISO/IEC 27005', 'ISO 14001', 'PCI DSS'], correctIndex: 1, explanation: 'ISO/IEC 27005 là tiêu chuẩn quản lý rủi ro ATTT, gắn với ISMS theo ISO 27001; ISO 27002 là danh mục kiểm soát.' },
  { id: 'q3', question: 'COBIT khác NIST/ISO ở chỗ nó tập trung chủ yếu vào?', options: ['Cấu hình tường lửa', 'Quản trị CNTT & gắn CNTT với mục tiêu kinh doanh', 'Mã hoá dữ liệu', 'Kiểm thử xâm nhập'], correctIndex: 1, explanation: 'COBIT là khung quản trị CNTT: nó trả lời "CNTT có được quản trị tốt và tạo giá trị không", không chỉ vấn đề kỹ thuật bảo mật.' },
]);

const c3 = doc('prs201-3-1-asset-threat-vuln', '3.1 — Assets, threats & vulnerabilities|||3.1 — Nhận diện tài sản, mối đe doạ & lỗ hổng',
  'Kiểm kê & phân loại tài sản (định giá); phân loại mối đe doạ (con người/tự nhiên/kỹ thuật, cố ý/vô ý); tìm lỗ hổng (CVE/CWE, quét, kiểm thử); ghép thành cặp đe doạ-lỗ hổng.',
  [[
    `<span class="eyebrow">PRS201 · Chapter 3 · Lesson 3.1</span>
<h2>Assets, threats &amp; vulnerabilities</h2>
<h3>Step 1 — Identify &amp; value assets</h3>
<p>You can't protect what you haven't listed. Build an <strong>asset inventory</strong> (data, systems, people, facilities) and <strong>value/classify</strong> each — e.g. Public, Internal, Confidential, Restricted. Value drives priority: spend the most protecting the most valuable assets.</p>
<h3>Step 2 — Enumerate threats</h3>
<pre><code>Threat categories (examples):
 Human / deliberate : hacker, insider, malware, theft
 Human / accidental : misconfig, lost laptop, mistyped delete
 Natural            : flood, fire, earthquake, power loss
 Technical          : hardware failure, software bug, outage
</code></pre>
<p>Catalogues help: <strong>MITRE ATT&amp;CK</strong> lists real adversary techniques.</p>
<h3>Step 3 — Find vulnerabilities</h3>
<p>A <strong>vulnerability</strong> is the weakness a threat needs. Sources: <strong>CVE</strong> (known vulnerabilities), <strong>CWE</strong> (weakness types), plus <strong>vulnerability scanning</strong> and <strong>penetration testing</strong>. Score severity with <strong>CVSS</strong>.</p>
<div class="callout"><span class="badge">Threat + vulnerability = exposure</span> A threat with no matching vulnerability can't hurt you; a vulnerability with no threat is low priority. Risk lives where a real threat lines up with a real weakness on a valuable asset.</div>`,
    `<span class="eyebrow">PRS201 · Chương 3 · Bài 3.1</span>
<h2>Nhận diện tài sản, mối đe doạ &amp; lỗ hổng</h2>
<h3>Bước 1 — Nhận diện &amp; định giá tài sản</h3>
<p>Không thể bảo vệ thứ chưa liệt kê. Lập <strong>bảng kiểm kê tài sản</strong> (dữ liệu, hệ thống, con người, cơ sở vật chất) và <strong>định giá/phân loại</strong> từng cái — vd Công khai, Nội bộ, Bí mật, Hạn chế. Giá trị quyết định ưu tiên: dồn nhiều nhất để bảo vệ tài sản giá trị nhất.</p>
<h3>Bước 2 — Liệt kê mối đe doạ</h3>
<pre><code>Nhóm mối đe doạ (ví dụ):
 Con người / cố ý  : hacker, nội gián, mã độc, trộm cắp
 Con người / vô ý  : cấu hình sai, mất laptop, xoá nhầm
 Tự nhiên          : lụt, cháy, động đất, mất điện
 Kỹ thuật          : hỏng phần cứng, lỗi phần mềm, gián đoạn
</code></pre>
<p>Danh mục giúp ích: <strong>MITRE ATT&amp;CK</strong> liệt kê kỹ thuật tấn công thực tế.</p>
<h3>Bước 3 — Tìm lỗ hổng</h3>
<p><strong>Lỗ hổng</strong> là điểm yếu mà mối đe doạ cần. Nguồn: <strong>CVE</strong> (lỗ hổng đã biết), <strong>CWE</strong> (loại điểm yếu), cùng <strong>quét lỗ hổng</strong> và <strong>kiểm thử xâm nhập (pen-test)</strong>. Chấm mức nghiêm trọng bằng <strong>CVSS</strong>.</p>
<div class="callout"><span class="badge">Đe doạ + lỗ hổng = phơi nhiễm</span> Mối đe doạ không có lỗ hổng tương ứng thì không hại được bạn; lỗ hổng không có mối đe doạ thì ưu tiên thấp. Rủi ro nằm ở nơi một mối đe doạ thật gặp một điểm yếu thật trên tài sản giá trị.</div>`,
  ]]);

const c3q = quiz('prs201-quiz-3', 'Quiz 3 — Assets & threats|||Quiz 3 — Tài sản & đe doạ', [
  { id: 'q1', question: 'Bước đầu tiên trong nhận diện rủi ro thường là?', options: ['Mua bảo hiểm mạng', 'Kiểm kê & định giá/phân loại tài sản', 'Viết chính sách bảo mật', 'Cài tường lửa'], correctIndex: 1, explanation: 'Không thể bảo vệ thứ chưa liệt kê — phải kiểm kê và định giá/phân loại tài sản trước, để biết ưu tiên bảo vệ cái gì.' },
  { id: 'q2', question: 'CVE dùng để tra cứu điều gì?', options: ['Các mối đe doạ tự nhiên', 'Lỗ hổng bảo mật đã biết (đã công bố)', 'Chính sách nhân sự', 'Chi phí thiết bị'], correctIndex: 1, explanation: 'CVE là danh mục lỗ hổng đã biết được công bố; CWE là loại điểm yếu, còn CVSS chấm mức nghiêm trọng.' },
  { id: 'q3', question: 'Một mối đe doạ KHÔNG có lỗ hổng tương ứng thì?', options: ['Vẫn là rủi ro cao nhất', 'Gần như không gây hại được — ưu tiên thấp', 'Luôn dẫn tới mất dữ liệu', 'Phải mua bảo hiểm ngay'], correctIndex: 1, explanation: 'Rủi ro chỉ hiện thực khi mối đe doạ gặp lỗ hổng phù hợp trên tài sản giá trị; thiếu lỗ hổng thì đe doạ khó gây hại.' },
]);

const c4 = doc('prs201-4-1-assessment', '4.1 — Qualitative & quantitative assessment|||4.1 — Đánh giá định tính & định lượng',
  'Định tính (ma trận khả năng × tác động, thang thấp/vừa/cao); định lượng bằng tiền: EF, SLE = AV × EF, ARO, ALE = SLE × ARO; ví dụ tính toán.',
  [[
    `<span class="eyebrow">PRS201 · Chapter 4 · Lesson 4.1</span>
<h2>Qualitative &amp; quantitative assessment</h2>
<h3>Qualitative — a risk matrix</h3>
<p>Rate <strong>likelihood</strong> and <strong>impact</strong> on a simple scale and read the risk level off a matrix. Fast, subjective, great for prioritizing.</p>
<pre><code>Impact \\ Likelihood | Low    | Medium | High
--------------------|--------|--------|--------
High                | Medium | High   | High
Medium              | Low    | Medium | High
Low                 | Low    | Low    | Medium
</code></pre>
<h3>Quantitative — put a number on it</h3>
<p>Express risk in money so you can compare it to the cost of a control.</p>
<pre><code>EF  (Exposure Factor)      = % of asset value lost in one event
SLE (Single Loss Expectancy) = Asset Value (AV) x EF
ARO (Annualized Rate of Occurrence) = events per year
ALE (Annualized Loss Expectancy)   = SLE x ARO
</code></pre>
<h3>Worked example</h3>
<pre><code>A database server is worth AV = $50,000.
A ransomware hit destroys 60% of its value -> EF = 0.6
 SLE = 50,000 x 0.6          = $30,000
 ARO = 0.5 (once every 2 years)
 ALE = 30,000 x 0.5          = $15,000 / year
=> A control that costs &lt; $15,000/yr and prevents it is worth it.
</code></pre>
<div class="callout"><span class="badge">Qualitative vs quantitative</span> Qualitative is quick and needs no hard data but is subjective; quantitative is defensible and money-based but needs reliable numbers. Most real programs use both — qualitative to triage, quantitative to justify spend.</div>`,
    `<span class="eyebrow">PRS201 · Chương 4 · Bài 4.1</span>
<h2>Đánh giá định tính &amp; định lượng</h2>
<h3>Định tính — ma trận rủi ro</h3>
<p>Chấm <strong>khả năng</strong> và <strong>tác động</strong> trên thang đơn giản rồi đọc mức rủi ro trên ma trận. Nhanh, chủ quan, rất tốt để xếp ưu tiên.</p>
<pre><code>Tác động \\ Khả năng | Thấp   | Vừa    | Cao
--------------------|--------|--------|--------
Cao                 | Vừa    | Cao    | Cao
Vừa                 | Thấp   | Vừa    | Cao
Thấp                | Thấp   | Thấp   | Vừa
</code></pre>
<h3>Định lượng — gắn con số vào</h3>
<p>Diễn đạt rủi ro bằng tiền để so được với chi phí của một kiểm soát.</p>
<pre><code>EF  (Hệ số phơi nhiễm)   = % giá trị tài sản mất trong một sự cố
SLE (Tổn thất kỳ vọng đơn) = Giá trị tài sản (AV) x EF
ARO (Số lần xảy ra/năm)  = số sự cố mỗi năm
ALE (Tổn thất kỳ vọng năm) = SLE x ARO
</code></pre>
<h3>Ví dụ tính toán</h3>
<pre><code>Một máy chủ CSDL trị giá AV = 50.000 $.
Một vụ ransomware phá 60% giá trị -> EF = 0,6
 SLE = 50.000 x 0,6          = 30.000 $
 ARO = 0,5 (2 năm một lần)
 ALE = 30.000 x 0,5          = 15.000 $ / năm
=> Kiểm soát tốn &lt; 15.000 $/năm mà ngăn được thì đáng đầu tư.
</code></pre>
<div class="callout"><span class="badge">Định tính vs định lượng</span> Định tính nhanh, không cần số liệu cứng nhưng chủ quan; định lượng có căn cứ, theo tiền nhưng cần số đáng tin. Đa số chương trình thực tế dùng cả hai — định tính để sàng lọc, định lượng để biện minh chi tiêu.</div>`,
  ]]);

const c4q = quiz('prs201-quiz-4', 'Quiz 4 — Assessment & ALE|||Quiz 4 — Đánh giá & ALE', [
  { id: 'q1', question: 'Công thức tính SLE (Single Loss Expectancy) là?', options: ['SLE = AV × EF', 'SLE = SLE × ARO', 'SLE = AV × ARO', 'SLE = EF / AV'], correctIndex: 0, explanation: 'SLE = Giá trị tài sản (AV) × Hệ số phơi nhiễm (EF) — tổn thất kỳ vọng của MỘT sự cố.' },
  { id: 'q2', question: 'Tài sản AV = 20.000 $, EF = 0,5, ARO = 2 lần/năm. ALE bằng?', options: ['10.000 $', '20.000 $', '40.000 $', '5.000 $'], correctIndex: 1, explanation: 'SLE = 20.000 × 0,5 = 10.000 $; ALE = SLE × ARO = 10.000 × 2 = 20.000 $/năm.' },
  { id: 'q3', question: 'So với định lượng, đánh giá định tính có đặc điểm?', options: ['Luôn chính xác hơn về tiền bạc', 'Nhanh, không cần số liệu cứng nhưng mang tính chủ quan', 'Không cần con người tham gia', 'Bắt buộc phải có theo luật'], correctIndex: 1, explanation: 'Định tính dùng thang khả năng × tác động — nhanh và không cần số liệu cứng, nhưng chủ quan; định lượng theo tiền thì có căn cứ hơn nhưng cần số đáng tin.' },
]);

const c5 = doc('prs201-5-1-treatment', '5.1 — Risk treatment|||5.1 — Xử lý rủi ro',
  'Bốn lựa chọn: giảm (mitigate/reduce), chuyển (transfer, vd bảo hiểm/thuê ngoài), chấp nhận (accept), tránh (avoid); rủi ro còn lại (residual risk); phân tích chi phí-lợi ích.',
  [[
    `<span class="eyebrow">PRS201 · Chapter 5 · Lesson 5.1</span>
<h2>Risk treatment — the four options</h2>
<p>Once a risk is assessed, leadership picks a response. There are exactly four strategies:</p>
<pre><code>MITIGATE / REDUCE : apply controls to lower likelihood or impact
                    (patch, firewall, backups, training)
TRANSFER          : shift the loss to someone else
                    (cyber insurance, outsourcing, contracts)
ACCEPT            : consciously live with it
                    (when control cost > expected loss)
AVOID             : stop the activity that creates the risk
                    (don't launch the feature / store the data)
</code></pre>
<h3>Choosing with cost-benefit</h3>
<p>Compare the <strong>ALE before</strong> a control with the <strong>ALE after</strong> plus the control's annual cost. If a $5,000/yr control cuts ALE from $30,000 to $8,000, the value is <strong>30,000 − (8,000 + 5,000) = $17,000/yr</strong> — clearly worth it.</p>
<h3>Residual risk</h3>
<p>No control removes 100% of risk. What's left after treatment is <strong>residual risk</strong> — and leadership must formally <strong>accept</strong> it (this is the "Authorize" step in NIST RMF). Accepting risk you didn't measure is negligence; accepting risk you did measure is management.</p>
<div class="callout"><span class="badge">Common trap</span> "Accept" is a legitimate choice — but only when made <em>consciously</em> by someone with authority, and documented. Silently ignoring a risk is not "accepting" it.</div>`,
    `<span class="eyebrow">PRS201 · Chương 5 · Bài 5.1</span>
<h2>Xử lý rủi ro — bốn lựa chọn</h2>
<p>Sau khi đánh giá xong, lãnh đạo chọn cách ứng xử. Có đúng bốn chiến lược:</p>
<pre><code>GIẢM (MITIGATE)  : áp kiểm soát để hạ khả năng hoặc tác động
                   (vá lỗi, tường lửa, sao lưu, đào tạo)
CHUYỂN (TRANSFER): dời tổn thất sang bên khác
                   (bảo hiểm mạng, thuê ngoài, hợp đồng)
CHẤP NHẬN (ACCEPT): chủ động sống chung với rủi ro
                   (khi chi phí kiểm soát > tổn thất kỳ vọng)
TRÁNH (AVOID)    : dừng hoạt động sinh ra rủi ro
                   (không ra tính năng đó / không lưu dữ liệu đó)
</code></pre>
<h3>Chọn bằng phân tích chi phí-lợi ích</h3>
<p>So <strong>ALE trước</strong> khi có kiểm soát với <strong>ALE sau</strong> cộng chi phí năm của kiểm soát. Nếu một kiểm soát 5.000 $/năm kéo ALE từ 30.000 $ xuống 8.000 $, giá trị là <strong>30.000 − (8.000 + 5.000) = 17.000 $/năm</strong> — rõ ràng đáng làm.</p>
<h3>Rủi ro còn lại</h3>
<p>Không kiểm soát nào xoá 100% rủi ro. Phần còn lại sau xử lý là <strong>rủi ro còn lại (residual risk)</strong> — và lãnh đạo phải <strong>chấp nhận</strong> chính thức (đây là bước "Cho phép/Authorize" trong NIST RMF). Chấp nhận rủi ro chưa đo là tắc trách; chấp nhận rủi ro đã đo là quản lý.</p>
<div class="callout"><span class="badge">Bẫy thường gặp</span> "Chấp nhận" là lựa chọn hợp lệ — nhưng chỉ khi được người có thẩm quyền quyết <em>một cách chủ động</em> và ghi lại. Lặng lẽ bỏ qua một rủi ro KHÔNG phải là "chấp nhận" nó.</div>`,
  ]]);

const c5q = quiz('prs201-quiz-5', 'Quiz 5 — Risk treatment|||Quiz 5 — Xử lý rủi ro', [
  { id: 'q1', question: 'Mua bảo hiểm mạng (cyber insurance) là chiến lược xử lý rủi ro nào?', options: ['Giảm (mitigate)', 'Chuyển (transfer)', 'Tránh (avoid)', 'Chấp nhận (accept)'], correctIndex: 1, explanation: 'Bảo hiểm dời tổn thất tài chính sang bên thứ ba — đó là chuyển rủi ro (transfer).' },
  { id: 'q2', question: 'Quyết định KHÔNG triển khai một tính năng vì nó tạo ra rủi ro quá lớn là?', options: ['Chấp nhận (accept)', 'Chuyển (transfer)', 'Tránh (avoid)', 'Giảm (mitigate)'], correctIndex: 2, explanation: 'Loại bỏ hẳn hoạt động sinh ra rủi ro là chiến lược tránh (avoid).' },
  { id: 'q3', question: '"Rủi ro còn lại" (residual risk) là gì?', options: ['Rủi ro chưa được nhận diện', 'Phần rủi ro còn lại sau khi đã áp dụng kiểm soát, cần lãnh đạo chấp nhận', 'Rủi ro của đối thủ cạnh tranh', 'Rủi ro đã được xoá hoàn toàn'], correctIndex: 1, explanation: 'Không kiểm soát nào xoá 100% rủi ro; phần còn lại sau xử lý là residual risk và phải được lãnh đạo chính thức chấp nhận.' },
]);

const c6 = doc('prs201-6-1-policy', '6.1 — Building security policy|||6.1 — Xây dựng chính sách bảo mật',
  'Phân tầng: policy (nguyên tắc) → standard (bắt buộc) → guideline (khuyến nghị) → procedure (từng bước); EISP/ISSP/SysSP; vòng đời soạn-duyệt-ban hành-rà soát; chính sách phải khả thi & thực thi được.',
  [[
    `<span class="eyebrow">PRS201 · Chapter 6 · Lesson 6.1</span>
<h2>Building security policy</h2>
<h3>The document hierarchy</h3>
<pre><code>POLICY     : high-level intent &amp; principles (WHY / WHAT)  [mandatory]
STANDARD   : specific mandatory rules (e.g. "min 12-char passwords")
GUIDELINE  : recommended best practice (SHOULD, not must)
PROCEDURE  : exact step-by-step instructions (HOW)
</code></pre>
<h3>Three policy types (Whitman &amp; Mattord)</h3>
<ul>
<li><strong>EISP</strong> — Enterprise Information Security Policy: the organization-wide, executive-level policy.</li>
<li><strong>ISSP</strong> — Issue-Specific Security Policy: one topic (email use, acceptable use, BYOD).</li>
<li><strong>SysSP</strong> — System-Specific Security Policy: configuration rules for a specific system (firewall rulesets, ACLs).</li>
</ul>
<h3>Policy life cycle</h3>
<p>Draft → review &amp; approve (by leadership) → communicate/train → enforce → review &amp; update on a schedule. A policy nobody knows about or that can't be enforced is worthless.</p>
<div class="callout"><span class="badge">A policy must be</span> supported by leadership, communicated, realistic (people can actually follow it), and enforceable (with consequences). Otherwise it's "shelfware" — a document that exists only to pass an audit.</div>`,
    `<span class="eyebrow">PRS201 · Chương 6 · Bài 6.1</span>
<h2>Xây dựng chính sách bảo mật</h2>
<h3>Phân tầng tài liệu</h3>
<pre><code>CHÍNH SÁCH (POLICY): ý định &amp; nguyên tắc cấp cao (VÌ SAO/CÁI GÌ) [bắt buộc]
TIÊU CHUẨN (STANDARD): quy tắc bắt buộc cụ thể (vd "mật khẩu tối thiểu 12 ký tự")
HƯỚNG DẪN (GUIDELINE): khuyến nghị thực hành tốt (NÊN, không bắt buộc)
QUY TRÌNH (PROCEDURE): chỉ dẫn từng bước chính xác (LÀM THẾ NÀO)
</code></pre>
<h3>Ba loại chính sách (Whitman &amp; Mattord)</h3>
<ul>
<li><strong>EISP</strong> — Chính sách ATTT cấp doanh nghiệp: chính sách toàn tổ chức, do cấp điều hành ban hành.</li>
<li><strong>ISSP</strong> — Chính sách theo vấn đề cụ thể: một chủ đề (dùng email, sử dụng chấp nhận được, BYOD).</li>
<li><strong>SysSP</strong> — Chính sách theo hệ thống cụ thể: quy tắc cấu hình cho một hệ thống (luật tường lửa, ACL).</li>
</ul>
<h3>Vòng đời chính sách</h3>
<p>Soạn → rà soát &amp; phê duyệt (bởi lãnh đạo) → truyền đạt/đào tạo → thực thi → rà soát &amp; cập nhật định kỳ. Một chính sách không ai biết hoặc không thể thực thi thì vô giá trị.</p>
<div class="callout"><span class="badge">Một chính sách phải</span> được lãnh đạo ủng hộ, được truyền đạt, khả thi (người ta thực sự tuân theo được), và thực thi được (có chế tài). Nếu không nó chỉ là "tài liệu để trên kệ" — tồn tại chỉ để qua kỳ kiểm toán.</div>`,
  ]]);

const c6q = quiz('prs201-quiz-6', 'Quiz 6 — Security policy|||Quiz 6 — Chính sách bảo mật', [
  { id: 'q1', question: 'Trong phân tầng tài liệu, cái nào cho chỉ dẫn TỪNG BƯỚC "làm thế nào"?', options: ['Policy (chính sách)', 'Standard (tiêu chuẩn)', 'Guideline (hướng dẫn)', 'Procedure (quy trình)'], correctIndex: 3, explanation: 'Procedure là chỉ dẫn từng bước chính xác (HOW); policy nêu nguyên tắc, standard nêu quy tắc bắt buộc, guideline là khuyến nghị.' },
  { id: 'q2', question: 'EISP (Enterprise Information Security Policy) là loại chính sách?', options: ['Cấu hình cho một hệ thống cụ thể', 'Toàn doanh nghiệp, do cấp điều hành ban hành', 'Chỉ về một vấn đề như email', 'Chỉ là khuyến nghị không bắt buộc'], correctIndex: 1, explanation: 'EISP là chính sách ATTT cấp doanh nghiệp, phạm vi toàn tổ chức; ISSP theo vấn đề, SysSP theo hệ thống.' },
  { id: 'q3', question: 'Yếu tố nào KHÔNG cần thiết để một chính sách có hiệu lực thực tế?', options: ['Được lãnh đạo ủng hộ', 'Được truyền đạt & thực thi được', 'Khả thi để người dùng tuân theo', 'Được viết bằng càng nhiều thuật ngữ kỹ thuật càng tốt'], correctIndex: 3, explanation: 'Chính sách cần được ủng hộ, truyền đạt, khả thi và thực thi được; viết rối rắm bằng thuật ngữ không giúp ích mà còn khiến không ai tuân theo.' },
]);

const c7 = doc('prs201-7-1-controls-compliance', '7.1 — Controls, monitoring & compliance|||7.1 — Kiểm soát, giám sát & tuân thủ',
  'Phân loại kiểm soát (phòng ngừa/phát hiện/khắc phục; hành chính/kỹ thuật/vật lý); giám sát liên tục & KRI; kiểm toán (audit) nội bộ/độc lập; tuân thủ khung/luật.',
  [[
    `<span class="eyebrow">PRS201 · Chapter 7 · Lesson 7.1</span>
<h2>Controls, monitoring &amp; compliance</h2>
<h3>Types of control</h3>
<pre><code>By function:
 Preventive  : stop it happening   (access control, encryption)
 Detective   : notice it happening (logs, IDS, CCTV, alerts)
 Corrective  : fix it after        (backups, patching, IR plan)

By nature:
 Administrative : policies, training, procedures (people)
 Technical      : firewalls, MFA, encryption (systems)
 Physical       : locks, guards, badges (facilities)
</code></pre>
<h3>Monitoring &amp; KRIs</h3>
<p>Controls decay — you must <strong>monitor</strong> continuously. A <strong>Key Risk Indicator (KRI)</strong> is a metric that warns risk is rising (e.g. % of unpatched critical systems, failed-login spikes, overdue access reviews). KRIs are the early-warning dashboard for risk.</p>
<h3>Audit &amp; compliance</h3>
<p><strong>Audit</strong> independently checks that controls exist and work — internal audit, or external/independent for certification. <strong>Compliance</strong> is meeting the rules that apply to you: frameworks/standards (ISO 27001, PCI DSS) and laws. Being compliant is a floor, not a guarantee of security.</p>
<div class="callout"><span class="badge">Defense in depth</span> Combine preventive, detective and corrective controls across administrative, technical and physical layers. If one fails, another catches the incident — no single control should be a single point of failure.</div>`,
    `<span class="eyebrow">PRS201 · Chương 7 · Bài 7.1</span>
<h2>Kiểm soát, giám sát &amp; tuân thủ</h2>
<h3>Các loại kiểm soát</h3>
<pre><code>Theo chức năng:
 Phòng ngừa : chặn không cho xảy ra (kiểm soát truy cập, mã hoá)
 Phát hiện  : nhận ra khi đang xảy ra (log, IDS, CCTV, cảnh báo)
 Khắc phục  : sửa sau khi xảy ra     (sao lưu, vá lỗi, kế hoạch IR)

Theo bản chất:
 Hành chính : chính sách, đào tạo, quy trình (con người)
 Kỹ thuật   : tường lửa, MFA, mã hoá (hệ thống)
 Vật lý     : khoá, bảo vệ, thẻ từ (cơ sở vật chất)
</code></pre>
<h3>Giám sát &amp; KRI</h3>
<p>Kiểm soát bị bào mòn — phải <strong>giám sát</strong> liên tục. <strong>Chỉ số rủi ro chính (KRI)</strong> là thước đo cảnh báo rủi ro đang tăng (vd % hệ thống trọng yếu chưa vá, số lần đăng nhập thất bại tăng vọt, rà soát quyền quá hạn). KRI là bảng cảnh báo sớm cho rủi ro.</p>
<h3>Kiểm toán &amp; tuân thủ</h3>
<p><strong>Kiểm toán (audit)</strong> kiểm tra độc lập rằng kiểm soát tồn tại và có hiệu lực — kiểm toán nội bộ, hoặc bên ngoài/độc lập để cấp chứng nhận. <strong>Tuân thủ (compliance)</strong> là đáp ứng các quy tắc áp dụng cho bạn: khung/tiêu chuẩn (ISO 27001, PCI DSS) và luật. Tuân thủ là sàn tối thiểu, không đảm bảo an toàn.</p>
<div class="callout"><span class="badge">Phòng thủ nhiều lớp</span> Kết hợp kiểm soát phòng ngừa, phát hiện và khắc phục xuyên các lớp hành chính, kỹ thuật, vật lý. Một lớp hỏng thì lớp khác bắt được sự cố — không kiểm soát đơn lẻ nào được là điểm hỏng duy nhất.</div>`,
  ]]);

const c7q = quiz('prs201-quiz-7', 'Quiz 7 — Controls & compliance|||Quiz 7 — Kiểm soát & tuân thủ', [
  { id: 'q1', question: 'Hệ thống phát hiện xâm nhập (IDS) và log là loại kiểm soát theo chức năng nào?', options: ['Phòng ngừa (preventive)', 'Phát hiện (detective)', 'Khắc phục (corrective)', 'Vật lý (physical)'], correctIndex: 1, explanation: 'IDS/log giúp nhận ra sự cố khi đang xảy ra — đó là kiểm soát phát hiện (detective).' },
  { id: 'q2', question: 'KRI (Key Risk Indicator) dùng để làm gì?', options: ['Mã hoá dữ liệu', 'Cảnh báo sớm khi mức rủi ro đang tăng', 'Xoá log cũ', 'Thay thế cho chính sách bảo mật'], correctIndex: 1, explanation: 'KRI là thước đo cảnh báo rủi ro đang tăng (vd % hệ thống chưa vá), đóng vai trò bảng cảnh báo sớm.' },
  { id: 'q3', question: 'Nhận định nào ĐÚNG về tuân thủ (compliance)?', options: ['Tuân thủ đảm bảo tuyệt đối là an toàn', 'Tuân thủ là mức sàn tối thiểu, không đảm bảo an toàn', 'Tuân thủ chỉ liên quan tới phần cứng', 'Tuân thủ thay thế hoàn toàn cho quản lý rủi ro'], correctIndex: 1, explanation: 'Tuân thủ khung/luật là sàn tối thiểu; đạt tuân thủ không đồng nghĩa với an toàn thực sự.' },
]);

const c8 = doc('prs201-8-1-bcp-ir-legal', '8.1 — Continuity, incident response & VN law|||8.1 — Liên tục kinh doanh, ứng phó sự cố & pháp lý VN',
  'BCP/DRP & BIA (RTO/RPO); quy trình ứng phó sự cố (chuẩn bị→phát hiện→ngăn chặn→diệt→khôi phục→bài học); pháp lý Việt Nam (Luật An ninh mạng 2018, Nghị định 13/2023 bảo vệ dữ liệu cá nhân).',
  [[
    `<span class="eyebrow">PRS201 · Chapter 8 · Lesson 8.1</span>
<h2>Continuity, incident response &amp; Vietnamese law</h2>
<h3>Business Continuity &amp; Disaster Recovery</h3>
<p>A <strong>Business Impact Analysis (BIA)</strong> finds your critical processes and sets recovery targets:</p>
<pre><code>RTO (Recovery Time Objective)  : how fast must it be back?
RPO (Recovery Point Objective) : how much data can we lose?
BCP : keep the BUSINESS running (people, sites, processes)
DRP : recover the IT / TECHNOLOGY (systems, data, backups)
</code></pre>
<h3>Incident response life cycle (NIST SP 800-61)</h3>
<pre><code>1. Preparation
2. Detection &amp; Analysis
3. Containment       (stop the bleeding)
4. Eradication       (remove the cause)
5. Recovery          (restore service safely)
6. Post-incident     (lessons learned -> improve)
</code></pre>
<h3>Vietnamese legal context</h3>
<ul>
<li><strong>Luật An ninh mạng 2018</strong> (Cybersecurity Law) — data localization, incident reporting, responsibilities of service providers.</li>
<li><strong>Nghị định 13/2023/NĐ-CP</strong> — Personal Data Protection (PDPD): consent, data-subject rights, impact assessment, breach handling.</li>
</ul>
<div class="callout"><span class="badge">Tie it together</span> Risk management, policy, controls, continuity and legal compliance are one continuous cycle — identify, protect, detect, respond, recover — and then feed the lessons back into the next round of risk assessment.</div>`,
    `<span class="eyebrow">PRS201 · Chương 8 · Bài 8.1</span>
<h2>Liên tục kinh doanh, ứng phó sự cố &amp; pháp lý VN</h2>
<h3>Liên tục kinh doanh &amp; khôi phục thảm hoạ</h3>
<p><strong>Phân tích tác động kinh doanh (BIA)</strong> tìm các quy trình trọng yếu và đặt mục tiêu khôi phục:</p>
<pre><code>RTO (Mục tiêu thời gian khôi phục): bao lâu phải hoạt động lại?
RPO (Mục tiêu điểm khôi phục)     : chấp nhận mất bao nhiêu dữ liệu?
BCP : giữ cho HOẠT ĐỘNG KINH DOANH chạy (người, địa điểm, quy trình)
DRP : khôi phục CÔNG NGHỆ/CNTT (hệ thống, dữ liệu, sao lưu)
</code></pre>
<h3>Vòng đời ứng phó sự cố (NIST SP 800-61)</h3>
<pre><code>1. Chuẩn bị
2. Phát hiện &amp; phân tích
3. Ngăn chặn        (cầm máu)
4. Diệt trừ         (loại bỏ nguyên nhân)
5. Khôi phục        (phục hồi dịch vụ an toàn)
6. Sau sự cố        (bài học -> cải tiến)
</code></pre>
<h3>Bối cảnh pháp lý Việt Nam</h3>
<ul>
<li><strong>Luật An ninh mạng 2018</strong> — nội địa hoá dữ liệu, báo cáo sự cố, trách nhiệm của nhà cung cấp dịch vụ.</li>
<li><strong>Nghị định 13/2023/NĐ-CP</strong> — Bảo vệ dữ liệu cá nhân (PDPD): sự đồng ý, quyền của chủ thể dữ liệu, đánh giá tác động, xử lý vi phạm.</li>
</ul>
<div class="callout"><span class="badge">Ghép lại toàn cảnh</span> Quản lý rủi ro, chính sách, kiểm soát, liên tục kinh doanh và tuân thủ pháp lý là một chu trình liên tục — nhận diện, bảo vệ, phát hiện, ứng phó, khôi phục — rồi đưa bài học trở lại vòng đánh giá rủi ro kế tiếp.</div>`,
  ]]);

const c8q = quiz('prs201-quiz-8', 'Quiz 8 — Continuity & law|||Quiz 8 — Liên tục & pháp lý', [
  { id: 'q1', question: 'RPO (Recovery Point Objective) trả lời câu hỏi nào?', options: ['Bao lâu hệ thống phải hoạt động trở lại', 'Chấp nhận mất tối đa bao nhiêu dữ liệu', 'Chi phí một sự cố là bao nhiêu', 'Ai chịu trách nhiệm ứng phó'], correctIndex: 1, explanation: 'RPO xác định lượng dữ liệu tối đa có thể mất (tính theo thời gian); RTO mới là thời gian phải khôi phục hoạt động.' },
  { id: 'q2', question: 'Trong vòng đời ứng phó sự cố, bước "Ngăn chặn (Containment)" nhằm?', options: ['Loại bỏ hẳn nguyên nhân gốc', 'Ngăn sự cố lan rộng thêm ("cầm máu")', 'Rút ra bài học', 'Chuẩn bị công cụ trước sự cố'], correctIndex: 1, explanation: 'Containment là "cầm máu" — hạn chế phạm vi lan rộng; diệt trừ (eradication) mới loại bỏ nguyên nhân gốc.' },
  { id: 'q3', question: 'Văn bản pháp luật Việt Nam nào điều chỉnh việc bảo vệ dữ liệu cá nhân?', options: ['Nghị định 13/2023/NĐ-CP', 'ISO/IEC 27005', 'NIST SP 800-30', 'PCI DSS'], correctIndex: 0, explanation: 'Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân (PDPD); các mục còn lại là tiêu chuẩn/khung quốc tế, không phải luật Việt Nam.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'PRS201',
    slug: 'prs201-policy-and-risk-management-in-information-systems',
    title: 'Policy and Risk Management in Information Systems',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRS201.webp',
    shortDescription: 'Manage information risk, not just buy tools — CIA triad, frameworks (NIST RMF, ISO 27005, COBIT), asset/threat/vulnerability ID, qualitative & quantitative assessment (SLE/ARO/ALE), risk treatment, policy, controls, BCP/DRP. Bilingual, with quizzes.|||Quản lý rủi ro thông tin, không chỉ mua công cụ — bộ ba CIA, khung (NIST RMF, ISO 27005, COBIT), nhận diện tài sản/đe doạ/lỗ hổng, đánh giá định tính & định lượng (SLE/ARO/ALE), xử lý rủi ro, chính sách, kiểm soát, BCP/DRP. Song ngữ, có quiz.',
    description: 'Môn <strong>PRS201 — Policy and Risk Management in Information Systems</strong> (kỳ 3) dạy cách <strong>bảo vệ thông tin của tổ chức</strong> bằng quản lý rủi ro và chính sách, không chỉ bằng công cụ. Từ <strong>quản trị &amp; rủi ro cơ bản</strong> (CIA, tài sản/đe doạ/lỗ hổng) → <strong>khung chuẩn</strong> (NIST RMF, ISO 27005, COBIT) → <strong>nhận diện &amp; đánh giá rủi ro</strong> (định tính, định lượng SLE/ARO/ALE) → <strong>xử lý rủi ro</strong> (giảm/chuyển/chấp nhận/tránh) → <strong>chính sách bảo mật</strong> → <strong>kiểm soát, giám sát &amp; tuân thủ</strong> → <strong>liên tục kinh doanh, ứng phó sự cố &amp; pháp lý Việt Nam</strong>. Bám giáo trình Whitman/Mattord và chuẩn NIST/ISO/COBIT, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Quản trị khác quản lý &amp; bộ ba CIA; rủi ro = tài sản × đe doạ × lỗ hổng; NIST RMF 7 bước, ISO 27005, COBIT; kiểm kê &amp; định giá tài sản, tra CVE/CWE/CVSS; ma trận rủi ro định tính; tính SLE = AV × EF, ARO, ALE = SLE × ARO; bốn cách xử lý rủi ro &amp; rủi ro còn lại; phân tầng policy/standard/guideline/procedure, EISP/ISSP/SysSP; kiểm soát phòng ngừa/phát hiện/khắc phục, KRI, audit, tuân thủ; BCP/DRP, RTO/RPO, ứng phó sự cố; Luật An ninh mạng 2018 &amp; Nghị định 13/2023.',
    requirements: 'Hiểu biết cơ bản về hệ thống thông tin &amp; mạng máy tính. Không cần lập trình; cần tư duy phân tích và làm quen với khái niệm bảo mật thông tin.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Whitman/Mattord, chuẩn NIST/ISO/COBIT, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao rủi ro & chính sách; CIA; rủi ro = tài sản × đe doạ × lỗ hổng.', lessons: [intro] },
    { title: 'Chương 1 — Quản trị & rủi ro|||Chapter 1 — Governance & risk', description: 'Governance vs management, khẩu vị rủi ro, vòng đời quản lý rủi ro.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung & tiêu chuẩn|||Chapter 2 — Frameworks & standards', description: 'NIST RMF, ISO 27005, COBIT và cách chúng bổ trợ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tài sản, đe doạ & lỗ hổng|||Chapter 3 — Assets, threats & vulnerabilities', description: 'Kiểm kê tài sản, phân loại đe doạ, CVE/CWE/CVSS.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đánh giá rủi ro|||Chapter 4 — Risk assessment', description: 'Định tính (ma trận) & định lượng (SLE/ARO/ALE).', lessons: [c4, c4q] },
    { title: 'Chương 5 — Xử lý rủi ro|||Chapter 5 — Risk treatment', description: 'Giảm/chuyển/chấp nhận/tránh, chi phí-lợi ích, rủi ro còn lại.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chính sách bảo mật|||Chapter 6 — Security policy', description: 'Policy/standard/guideline/procedure, EISP/ISSP/SysSP, vòng đời.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kiểm soát & tuân thủ|||Chapter 7 — Controls & compliance', description: 'Loại kiểm soát, KRI, audit, tuân thủ, phòng thủ nhiều lớp.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Liên tục & pháp lý|||Chapter 8 — Continuity & law', description: 'BCP/DRP, RTO/RPO, ứng phó sự cố, luật ANM 2018 & NĐ 13/2023.', lessons: [c8, c8q] },
  ],
};
