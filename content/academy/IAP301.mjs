/**
 * IAP301 — Policy Development in Information Assurance (Xây dựng chính sách
 * trong Đảm bảo an toàn thông tin). Ngành An toàn thông tin, kỳ 7, FPTU.
 * Giáo trình chuẩn: Whitman/Mattord "Management of Information Security" &
 * "Principles of Information Security"; NIST SP 800-53 & Cybersecurity
 * Framework; ISO/IEC 27001 & 27002; COBIT. Song ngữ VI+EN, 8 chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. KHÔNG backtick/${; "<"→&lt;, "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('iap301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách Whitman/Mattord, tiêu chuẩn chính thức (ISO 27001, NIST CSF/SP 800-53, COBIT), văn bản pháp luật, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">IAP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to build and manage an <strong>information security policy program</strong> — governance, standards, risk, policy writing, compliance — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IAP301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Whitman &amp; Mattord — <em>Management of Information Security</em> (Cengage) — the core policy/governance text.</li>
<li>Whitman &amp; Mattord — <em>Principles of Information Security</em> — foundations of the CIA triad and risk.</li>
</ul>
<h3>🌐 Official standards &amp; frameworks (free)</h3>
<ul>
<li><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener">NIST Cybersecurity Framework (CSF)</a> — Identify/Protect/Detect/Respond/Recover.</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" target="_blank" rel="noopener">NIST SP 800-53 Rev. 5</a> — security &amp; privacy control catalog.</li>
<li><a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener">ISO/IEC 27001</a> &amp; <a href="https://www.iso.org/standard/75652.html" target="_blank" rel="noopener">27002</a> — ISMS requirements &amp; controls.</li>
<li><a href="https://www.isaca.org/resources/cobit" target="_blank" rel="noopener">COBIT (ISACA)</a> — IT governance framework.</li>
</ul>
<h3>⚖️ Law &amp; regulation</h3>
<ul>
<li><a href="https://gdpr.eu/" target="_blank" rel="noopener">GDPR — EU General Data Protection Regulation</a></li>
<li><a href="https://www.pcisecuritystandards.org/" target="_blank" rel="noopener">PCI Security Standards Council (PCI-DSS)</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@InfosecInstitute" target="_blank" rel="noopener">Infosec</a> — governance, risk &amp; compliance explained.</li>
<li><a href="https://www.youtube.com/@ProfMesser" target="_blank" rel="noopener">Professor Messer</a> — Security+ concepts (policies, controls, risk).</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the CIA triad, governance vs. management, why policy exists.</li>
<li><strong>Frameworks</strong> — map ISO 27001, NIST CSF and COBIT to each other.</li>
<li><strong>Do the work</strong> — run a small risk assessment, then write one real policy + standard + procedure.</li>
<li><strong>Job-ready</strong> — read a compliance clause (GDPR/PCI) and turn it into a control and a metric.</li>
</ol></div>`,
    `<span class="eyebrow">IAP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để xây dựng và quản lý một <strong>chương trình chính sách an toàn thông tin</strong> — quản trị, tiêu chuẩn, rủi ro, viết chính sách, tuân thủ — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IAP301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Whitman &amp; Mattord — <em>Management of Information Security</em> (Cengage) — sách lõi về chính sách/quản trị.</li>
<li>Whitman &amp; Mattord — <em>Principles of Information Security</em> — nền tảng về bộ ba CIA và rủi ro.</li>
</ul>
<h3>🌐 Tiêu chuẩn &amp; khung (miễn phí)</h3>
<ul>
<li><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener">NIST Cybersecurity Framework (CSF)</a> — Nhận diện/Bảo vệ/Phát hiện/Ứng phó/Phục hồi.</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" target="_blank" rel="noopener">NIST SP 800-53 Rev. 5</a> — danh mục kiểm soát an toàn &amp; quyền riêng tư.</li>
<li><a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener">ISO/IEC 27001</a> &amp; <a href="https://www.iso.org/standard/75652.html" target="_blank" rel="noopener">27002</a> — yêu cầu ISMS &amp; danh mục kiểm soát.</li>
<li><a href="https://www.isaca.org/resources/cobit" target="_blank" rel="noopener">COBIT (ISACA)</a> — khung quản trị CNTT.</li>
</ul>
<h3>⚖️ Pháp luật &amp; quy định</h3>
<ul>
<li><a href="https://gdpr.eu/" target="_blank" rel="noopener">GDPR — Quy định bảo vệ dữ liệu EU</a></li>
<li>Luật An ninh mạng Việt Nam 2018 &amp; Nghị định 13/2023 về bảo vệ dữ liệu cá nhân.</li>
<li><a href="https://www.pcisecuritystandards.org/" target="_blank" rel="noopener">PCI Security Standards Council (PCI-DSS)</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@InfosecInstitute" target="_blank" rel="noopener">Infosec</a> — quản trị, rủi ro &amp; tuân thủ.</li>
<li><a href="https://www.youtube.com/@ProfMesser" target="_blank" rel="noopener">Professor Messer</a> — khái niệm Security+ (chính sách, kiểm soát, rủi ro).</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — bộ ba CIA, quản trị so với quản lý, vì sao cần chính sách.</li>
<li><strong>Khung</strong> — ánh xạ ISO 27001, NIST CSF và COBIT với nhau.</li>
<li><strong>Bắt tay làm</strong> — chạy một đánh giá rủi ro nhỏ, rồi viết một policy + standard + procedure thật.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc một điều khoản tuân thủ (GDPR/PCI) và biến nó thành kiểm soát và chỉ số đo.</li>
</ol></div>`,
  ]]);

const intro = doc('iap301-0-1-overview', 'Course overview: Policy development in information assurance|||Tổng quan: Xây dựng chính sách trong đảm bảo ATTT',
  'Đảm bảo an toàn thông tin là gì; vì sao chính sách là nền của quản trị; lộ trình 8 chương: quản trị & CIA → khung/tiêu chuẩn → rủi ro → viết chính sách → kiểm soát truy cập → ứng phó sự cố & BCP/DRP → tuân thủ → đào tạo & audit.',
  [[
    `<span class="eyebrow">IAP301 · Lesson 0.1 · Overview</span>
<h2>Policy development in information assurance</h2>
<p class="lead">This course is about <strong>how organizations govern security through written policy</strong>. Technology alone does not protect information — people, processes and rules do. A <strong>policy</strong> is management's documented intent: it says what must be protected, who is responsible, and what behaviour is required.</p>
<h3>What is information assurance?</h3>
<p><strong>Information assurance (IA)</strong> is the practice of protecting information and information systems so that they keep three core properties — the <strong>CIA triad</strong>:</p>
<ul>
<li><strong>Confidentiality</strong> — only authorized people can read it.</li>
<li><strong>Integrity</strong> — it is accurate and not tampered with.</li>
<li><strong>Availability</strong> — it is there when authorized people need it.</li>
</ul>
<h3>Why policy sits at the centre</h3>
<p>Governance (the board / executives) sets direction; management turns it into <strong>policy → standard → procedure → guideline</strong>; controls (technical, administrative, physical) enforce it; audit measures it. Policy is the bridge between "what leadership wants" and "what the system actually does".</p>
<h3>Roadmap (8 chapters)</h3>
<p>Governance &amp; CIA → frameworks (ISO 27001, NIST CSF, COBIT) → risk management → writing policy → access control &amp; data classification → incident response &amp; BCP/DRP → legal compliance &amp; ethics → awareness, audit &amp; metrics. Bilingual, with policy templates and a quiz per chapter.</p>`,
    `<span class="eyebrow">IAP301 · Bài 0.1 · Tổng quan</span>
<h2>Xây dựng chính sách trong đảm bảo an toàn thông tin</h2>
<p class="lead">Môn này nói về <strong>cách tổ chức quản trị an toàn bằng chính sách viết ra giấy</strong>. Chỉ công nghệ thì không bảo vệ được thông tin — con người, quy trình và quy tắc mới làm điều đó. Một <strong>chính sách</strong> là ý chí quản lý được ghi thành văn: nó nói cái gì phải được bảo vệ, ai chịu trách nhiệm, và hành vi nào là bắt buộc.</p>
<h3>Đảm bảo an toàn thông tin là gì?</h3>
<p><strong>Đảm bảo an toàn thông tin (IA)</strong> là việc bảo vệ thông tin và hệ thống thông tin sao cho chúng giữ được ba tính chất cốt lõi — <strong>bộ ba CIA</strong>:</p>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ người được phép mới đọc được.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — thông tin chính xác, không bị sửa trái phép.</li>
<li><strong>Sẵn sàng (Availability)</strong> — có mặt khi người được phép cần.</li>
</ul>
<h3>Vì sao chính sách nằm ở trung tâm</h3>
<p>Quản trị (hội đồng / lãnh đạo) định hướng; quản lý biến nó thành <strong>policy → standard → procedure → guideline</strong>; kiểm soát (kỹ thuật, hành chính, vật lý) thực thi; audit đo lường. Chính sách là cầu nối giữa "điều lãnh đạo muốn" và "điều hệ thống thực sự làm".</p>
<h3>Lộ trình (8 chương)</h3>
<p>Quản trị &amp; CIA → khung (ISO 27001, NIST CSF, COBIT) → quản lý rủi ro → viết chính sách → kiểm soát truy cập &amp; phân loại dữ liệu → ứng phó sự cố &amp; BCP/DRP → tuân thủ pháp lý &amp; đạo đức → đào tạo, audit &amp; đo lường. Song ngữ, có mẫu chính sách và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('iap301-1-1-governance-cia', '1.1 — Security governance & the CIA triad|||1.1 — Quản trị ATTT & bộ ba CIA',
  'Quản trị so với quản lý ATTT; bộ ba CIA (bí mật/toàn vẹn/sẵn sàng) và các tính chất mở rộng; vai trò (CISO, chủ dữ liệu, người quản lý, người dùng); mối quan hệ mối đe doạ–lỗ hổng–rủi ro.',
  [[
    `<span class="eyebrow">IAP301 · Chapter 1 · Lesson 1.1</span>
<h2>Security governance &amp; the CIA triad</h2>
<h3>Governance vs. management</h3>
<p><strong>Governance</strong> is the board/executive job of setting direction, appetite for risk, and accountability. <strong>Management</strong> is turning that direction into day-to-day work: policies, budgets, controls. IAP301 lives at the seam between the two.</p>
<h3>The CIA triad (and a bit more)</h3>
<ul>
<li><strong>Confidentiality</strong> — encryption, access control, classification.</li>
<li><strong>Integrity</strong> — hashing, change control, digital signatures.</li>
<li><strong>Availability</strong> — redundancy, backups, DDoS protection.</li>
</ul>
<p>Two properties are often added: <strong>authenticity</strong> (the actor is who they claim) and <strong>non-repudiation</strong> (they cannot deny an action).</p>
<h3>Key roles</h3>
<pre><code>Role            Responsibility
------------    --------------------------------------------
Board / Exec    Set risk appetite, approve top-level policy
CISO            Own the security program, report to leadership
Data owner      Classify data, decide who may access it
Data custodian  Operate/protect the data day to day (IT/admin)
User            Follow policy; report incidents
</code></pre>
<h3>Threat, vulnerability, risk</h3>
<p>A <strong>threat</strong> is a potential cause of harm; a <strong>vulnerability</strong> is a weakness a threat can exploit; <strong>risk</strong> is the chance a threat exploits a vulnerability and the impact if it does. Policy exists to reduce risk to a level leadership accepts.</p>
<div class="callout"><span class="badge">Core idea</span> Security is a business decision, not just a technical one. Governance decides how much risk is acceptable; policy writes that decision down.</div>`,
    `<span class="eyebrow">IAP301 · Chương 1 · Bài 1.1</span>
<h2>Quản trị ATTT &amp; bộ ba CIA</h2>
<h3>Quản trị so với quản lý</h3>
<p><strong>Quản trị (governance)</strong> là việc của hội đồng/lãnh đạo: định hướng, xác định mức chấp nhận rủi ro và trách nhiệm giải trình. <strong>Quản lý (management)</strong> là biến định hướng đó thành công việc hằng ngày: chính sách, ngân sách, kiểm soát. IAP301 nằm đúng ở đường nối hai thứ này.</p>
<h3>Bộ ba CIA (và hơn thế)</h3>
<ul>
<li><strong>Bí mật</strong> — mã hoá, kiểm soát truy cập, phân loại.</li>
<li><strong>Toàn vẹn</strong> — băm (hash), kiểm soát thay đổi, chữ ký số.</li>
<li><strong>Sẵn sàng</strong> — dự phòng, sao lưu, chống DDoS.</li>
</ul>
<p>Hai tính chất thường được thêm: <strong>xác thực</strong> (đúng người như họ tuyên bố) và <strong>chống chối bỏ</strong> (không thể phủ nhận hành động đã làm).</p>
<h3>Các vai trò chính</h3>
<pre><code>Vai trò          Trách nhiệm
------------    --------------------------------------------
HĐ / Lãnh đạo   Đặt mức chấp nhận rủi ro, duyệt chính sách gốc
CISO            Sở hữu chương trình ATTT, báo cáo lãnh đạo
Chủ dữ liệu     Phân loại dữ liệu, quyết ai được truy cập
Người quản lý   Vận hành/bảo vệ dữ liệu hằng ngày (IT/admin)
Người dùng      Tuân thủ chính sách; báo cáo sự cố
</code></pre>
<h3>Mối đe doạ, lỗ hổng, rủi ro</h3>
<p><strong>Mối đe doạ</strong> là nguyên nhân tiềm tàng gây hại; <strong>lỗ hổng</strong> là điểm yếu mà mối đe doạ khai thác được; <strong>rủi ro</strong> là khả năng mối đe doạ khai thác lỗ hổng và tác động nếu điều đó xảy ra. Chính sách sinh ra để giảm rủi ro xuống mức lãnh đạo chấp nhận.</p>
<div class="callout"><span class="badge">Ý cốt lõi</span> An toàn là một quyết định kinh doanh, không chỉ là kỹ thuật. Quản trị quyết mức rủi ro chấp nhận được; chính sách ghi quyết định đó ra giấy.</div>`,
  ]]);

const c1q = quiz('iap301-quiz-1', 'Quiz 1 — Governance & CIA|||Quiz 1 — Quản trị & CIA', [
  { id: 'q1', question: 'Bộ ba CIA trong an toàn thông tin gồm?', options: ['Control, Integrity, Access', 'Confidentiality, Integrity, Availability', 'Compliance, Identity, Audit', 'Cost, Impact, Availability'], correctIndex: 1, explanation: 'CIA = Bí mật (Confidentiality), Toàn vẹn (Integrity), Sẵn sàng (Availability).' },
  { id: 'q2', question: 'Ai chịu trách nhiệm PHÂN LOẠI dữ liệu và quyết định ai được truy cập?', options: ['Người dùng cuối', 'Chủ dữ liệu (data owner)', 'Nhà cung cấp mạng', 'Kiểm toán viên ngoài'], correctIndex: 1, explanation: 'Chủ dữ liệu phân loại và quyết quyền truy cập; người quản lý (custodian) chỉ vận hành/bảo vệ.' },
  { id: 'q3', question: 'Rủi ro (risk) được hiểu đúng nhất là?', options: ['Một điểm yếu trong hệ thống', 'Một tác nhân muốn gây hại', 'Khả năng mối đe doạ khai thác lỗ hổng cùng tác động của nó', 'Một biện pháp kiểm soát'], correctIndex: 2, explanation: 'Rủi ro = khả năng đe doạ khai thác lỗ hổng × tác động; khác với lỗ hổng và mối đe doạ.' },
]);

const c2 = doc('iap301-2-1-frameworks', '2.1 — Frameworks & standards (ISO 27001, NIST CSF, COBIT)|||2.1 — Khung & tiêu chuẩn (ISO 27001, NIST CSF, COBIT)',
  'ISO/IEC 27001 (ISMS) & 27002 (kiểm soát); NIST Cybersecurity Framework (5 chức năng) & SP 800-53; COBIT (quản trị CNTT); khi nào dùng cái nào và cách ánh xạ chúng.',
  [[
    `<span class="eyebrow">IAP301 · Chapter 2 · Lesson 2.1</span>
<h2>Frameworks &amp; standards</h2>
<p>You rarely invent controls from scratch — you adopt a recognized framework and tailor it. Three matter most.</p>
<h3>ISO/IEC 27001 &amp; 27002</h3>
<p><strong>ISO 27001</strong> defines an <strong>ISMS</strong> (Information Security Management System) — a certifiable, risk-based management process (Plan-Do-Check-Act). <strong>ISO 27002</strong> is its companion catalogue of controls (organizational, people, physical, technological).</p>
<h3>NIST Cybersecurity Framework (CSF)</h3>
<pre><code>The 5 CSF functions:
  Identify -> know your assets, risks, roles
  Protect  -> access control, training, safeguards
  Detect   -> monitoring, logging, alerts
  Respond  -> incident handling, communication
  Recover  -> restore services, lessons learned
</code></pre>
<p><strong>NIST SP 800-53</strong> is the deep control catalog (control families like AC, AU, IR) used behind CSF, especially by US federal systems.</p>
<h3>COBIT</h3>
<p><strong>COBIT</strong> (ISACA) is an <strong>IT governance</strong> framework — it links IT goals to business goals and defines who is accountable/responsible. It sits "above" security frameworks, at the governance layer.</p>
<h3>Which to use?</h3>
<pre><code>ISO 27001  -> want a certifiable management system
NIST CSF   -> want a common language + maturity view
NIST 800-53-> want a detailed control catalog
COBIT      -> want IT governance aligned to the business
</code></pre>
<div class="callout"><span class="badge">Map, don't duplicate</span> These frameworks overlap heavily. Mature programs pick one as the backbone and map the others onto it, so one control satisfies several requirements.</div>`,
    `<span class="eyebrow">IAP301 · Chương 2 · Bài 2.1</span>
<h2>Khung &amp; tiêu chuẩn</h2>
<p>Hiếm khi bạn tự nghĩ ra kiểm soát từ đầu — bạn chọn một khung được công nhận rồi điều chỉnh. Ba cái quan trọng nhất.</p>
<h3>ISO/IEC 27001 &amp; 27002</h3>
<p><strong>ISO 27001</strong> định nghĩa một <strong>ISMS</strong> (Hệ thống quản lý an toàn thông tin) — một quy trình quản lý theo rủi ro, có thể chứng nhận (vòng Plan-Do-Check-Act). <strong>ISO 27002</strong> là danh mục kiểm soát đi kèm (tổ chức, con người, vật lý, công nghệ).</p>
<h3>NIST Cybersecurity Framework (CSF)</h3>
<pre><code>5 chức năng của CSF:
  Identify -> biết tài sản, rủi ro, vai trò
  Protect  -> kiểm soát truy cập, đào tạo, biện pháp bảo vệ
  Detect   -> giám sát, ghi log, cảnh báo
  Respond  -> xử lý sự cố, truyền thông
  Recover  -> khôi phục dịch vụ, rút bài học
</code></pre>
<p><strong>NIST SP 800-53</strong> là danh mục kiểm soát chi tiết (họ kiểm soát như AC, AU, IR) đứng sau CSF, đặc biệt cho hệ thống liên bang Mỹ.</p>
<h3>COBIT</h3>
<p><strong>COBIT</strong> (ISACA) là khung <strong>quản trị CNTT</strong> — nối mục tiêu CNTT với mục tiêu kinh doanh và xác định ai chịu trách nhiệm giải trình/thực thi. Nó nằm "trên" các khung an toàn, ở tầng quản trị.</p>
<h3>Dùng cái nào?</h3>
<pre><code>ISO 27001  -> muốn hệ thống quản lý có thể chứng nhận
NIST CSF   -> muốn ngôn ngữ chung + góc nhìn độ trưởng thành
NIST 800-53-> muốn danh mục kiểm soát chi tiết
COBIT      -> muốn quản trị CNTT gắn với kinh doanh
</code></pre>
<div class="callout"><span class="badge">Ánh xạ, đừng lặp</span> Các khung này chồng lấn nhiều. Chương trình trưởng thành chọn một khung làm xương sống rồi ánh xạ các khung khác lên, để một kiểm soát thoả nhiều yêu cầu.</div>`,
  ]]);

const c2q = quiz('iap301-quiz-2', 'Quiz 2 — Frameworks|||Quiz 2 — Khung & tiêu chuẩn', [
  { id: 'q1', question: 'ISO/IEC 27001 định nghĩa cái gì?', options: ['Một ngôn ngữ lập trình', 'Một hệ thống quản lý an toàn thông tin (ISMS) có thể chứng nhận', 'Danh sách phần mềm diệt virus', 'Luật bảo vệ dữ liệu của EU'], correctIndex: 1, explanation: 'ISO 27001 quy định ISMS theo rủi ro, có thể chứng nhận; ISO 27002 là danh mục kiểm soát đi kèm.' },
  { id: 'q2', question: 'Năm chức năng của NIST Cybersecurity Framework là?', options: ['Plan, Do, Check, Act, Review', 'Identify, Protect, Detect, Respond, Recover', 'Confidentiality, Integrity, Availability, Auth, Audit', 'Create, Read, Update, Delete, Log'], correctIndex: 1, explanation: 'NIST CSF: Identify, Protect, Detect, Respond, Recover.' },
  { id: 'q3', question: 'COBIT chủ yếu là khung dành cho?', options: ['Quản trị CNTT gắn với mục tiêu kinh doanh', 'Cấu hình tường lửa', 'Mã hoá dữ liệu', 'Kiểm thử xâm nhập'], correctIndex: 0, explanation: 'COBIT (ISACA) là khung quản trị CNTT, đứng ở tầng governance.' },
]);

const c3 = doc('iap301-3-1-risk', '3.1 — Risk management|||3.1 — Quản lý rủi ro',
  'Quy trình quản lý rủi ro: xác định tài sản → phân tích mối đe doạ/lỗ hổng → định lượng (SLE/ARO/ALE) hoặc định tính (ma trận) → xử lý rủi ro (giảm/tránh/chuyển/chấp nhận) → rủi ro tồn dư.',
  [[
    `<span class="eyebrow">IAP301 · Chapter 3 · Lesson 3.1</span>
<h2>Risk management</h2>
<p>Risk management is the engine that decides which policies and controls you actually need. It runs in a repeatable cycle.</p>
<h3>The process</h3>
<pre><code>1. Identify assets      (what matters + its value)
2. Identify threats     (what could go wrong)
3. Identify vulns       (weaknesses that let it happen)
4. Analyze risk         (likelihood x impact)
5. Treat risk           (reduce/avoid/transfer/accept)
6. Monitor & review     (repeat; risk changes)
</code></pre>
<h3>Quantitative vs. qualitative</h3>
<p><strong>Qualitative</strong> uses a likelihood x impact matrix (Low/Medium/High) — fast, subjective. <strong>Quantitative</strong> uses money:</p>
<pre><code>SLE = Asset Value x Exposure Factor   (loss per single event)
ALE = SLE x ARO                       (expected loss per year)
  ARO = annual rate of occurrence

Example: laptop worth 20,000,000d, EF 100% (stolen),
  ARO 0.5 (once every 2 years)
  SLE = 20,000,000 x 1.0 = 20,000,000
  ALE = 20,000,000 x 0.5 = 10,000,000 / year
=> a control that costs less than 10,000,000/yr is worth it
</code></pre>
<h3>Four ways to treat risk</h3>
<ul>
<li><strong>Reduce / mitigate</strong> — add a control (most common).</li>
<li><strong>Avoid</strong> — stop doing the risky activity.</li>
<li><strong>Transfer</strong> — insurance, outsourcing.</li>
<li><strong>Accept</strong> — leadership signs off on the residual risk.</li>
</ul>
<div class="callout"><span class="badge">Residual risk</span> No control removes all risk. What remains after treatment is <strong>residual risk</strong> — and someone with authority must formally accept it.</div>`,
    `<span class="eyebrow">IAP301 · Chương 3 · Bài 3.1</span>
<h2>Quản lý rủi ro</h2>
<p>Quản lý rủi ro là động cơ quyết định bạn thực sự cần chính sách và kiểm soát nào. Nó chạy theo một vòng lặp lại được.</p>
<h3>Quy trình</h3>
<pre><code>1. Xác định tài sản     (cái gì quan trọng + giá trị)
2. Xác định mối đe doạ  (điều gì có thể sai)
3. Xác định lỗ hổng     (điểm yếu để nó xảy ra)
4. Phân tích rủi ro     (khả năng x tác động)
5. Xử lý rủi ro         (giảm/tránh/chuyển/chấp nhận)
6. Giám sát & rà soát   (lặp lại; rủi ro thay đổi)
</code></pre>
<h3>Định lượng so với định tính</h3>
<p><strong>Định tính</strong> dùng ma trận khả năng x tác động (Thấp/Vừa/Cao) — nhanh, chủ quan. <strong>Định lượng</strong> dùng tiền:</p>
<pre><code>SLE = Giá trị tài sản x Hệ số phơi nhiễm (mất mỗi lần)
ALE = SLE x ARO                    (kỳ vọng mất mỗi năm)
  ARO = số lần xảy ra mỗi năm

Ví dụ: laptop trị giá 20.000.000d, EF 100% (bị trộm),
  ARO 0,5 (2 năm một lần)
  SLE = 20.000.000 x 1,0 = 20.000.000
  ALE = 20.000.000 x 0,5 = 10.000.000 / năm
=> kiểm soát tốn dưới 10.000.000/năm là đáng làm
</code></pre>
<h3>Bốn cách xử lý rủi ro</h3>
<ul>
<li><strong>Giảm / giảm nhẹ</strong> — thêm một kiểm soát (phổ biến nhất).</li>
<li><strong>Tránh</strong> — ngừng hoạt động rủi ro đó.</li>
<li><strong>Chuyển</strong> — bảo hiểm, thuê ngoài.</li>
<li><strong>Chấp nhận</strong> — lãnh đạo ký chấp nhận rủi ro tồn dư.</li>
</ul>
<div class="callout"><span class="badge">Rủi ro tồn dư</span> Không kiểm soát nào loại bỏ hết rủi ro. Phần còn lại sau khi xử lý là <strong>rủi ro tồn dư</strong> — và người có thẩm quyền phải chính thức chấp nhận nó.</div>`,
  ]]);

const c3q = quiz('iap301-quiz-3', 'Quiz 3 — Risk management|||Quiz 3 — Quản lý rủi ro', [
  { id: 'q1', question: 'ALE (kỳ vọng mất mỗi năm) được tính bằng?', options: ['SLE + ARO', 'SLE x ARO', 'Giá trị tài sản x EF', 'ARO / SLE'], correctIndex: 1, explanation: 'ALE = SLE x ARO; trong đó SLE = Giá trị tài sản x Hệ số phơi nhiễm (EF).' },
  { id: 'q2', question: 'Mua bảo hiểm mạng để bù thiệt hại là cách xử lý rủi ro nào?', options: ['Chấp nhận (accept)', 'Tránh (avoid)', 'Chuyển (transfer)', 'Giảm (reduce)'], correctIndex: 2, explanation: 'Chuyển rủi ro (transfer) = đẩy tác động tài chính sang bên khác như bảo hiểm/thuê ngoài.' },
  { id: 'q3', question: 'Rủi ro tồn dư (residual risk) là gì?', options: ['Rủi ro trước khi làm gì cả', 'Rủi ro còn lại sau khi đã xử lý, cần được chấp nhận chính thức', 'Rủi ro không thể đo lường', 'Rủi ro do nhà cung cấp gây ra'], correctIndex: 1, explanation: 'Sau khi xử lý vẫn còn rủi ro tồn dư; người có thẩm quyền phải chấp nhận nó.' },
]);

const c4 = doc('iap301-4-1-writing-policy', '4.1 — Writing security policy|||4.1 — Xây dựng & viết chính sách bảo mật',
  'Kim tự tháp policy → standard → procedure → guideline; ba loại chính sách (EISP, ISSP, SysSP); cấu trúc một chính sách tốt (mục đích, phạm vi, vai trò, tuân thủ, xử lý vi phạm); vòng đời và phê duyệt.',
  [[
    `<span class="eyebrow">IAP301 · Chapter 4 · Lesson 4.1</span>
<h2>Writing security policy</h2>
<h3>The document pyramid</h3>
<pre><code>Policy     -> WHAT & WHY  (mandatory, high-level, rarely changes)
Standard   -> mandatory specifics (e.g. "AES-256", "12+ chars")
Procedure  -> step-by-step HOW (mandatory, operational)
Guideline  -> recommended best practice (optional advice)
</code></pre>
<p>Only the top three are mandatory; guidelines advise. Confusing these levels is the most common policy-writing mistake.</p>
<h3>Whitman &amp; Mattord: three policy types</h3>
<ul>
<li><strong>EISP</strong> — Enterprise Information Security Policy: the org-wide vision, signed by the top.</li>
<li><strong>ISSP</strong> — Issue-Specific Security Policy: one topic (email, acceptable use, remote work).</li>
<li><strong>SysSP</strong> — System-Specific Security Policy: configuration rules for a system (firewall ruleset, ACLs).</li>
</ul>
<h3>Anatomy of a good policy</h3>
<pre><code>1. Purpose        why this policy exists
2. Scope          who/what it applies to
3. Policy statements   the actual rules (clear, testable)
4. Roles & responsibilities
5. Compliance & enforcement (consequences of violation)
6. Review cycle & owner   (e.g. reviewed annually)
7. Version / approval / effective date
</code></pre>
<h3>Lifecycle</h3>
<p>Draft → review by stakeholders → approve by management → communicate/train → enforce → review/retire. An unread, unenforced policy is worse than none — it creates a false sense of security.</p>
<div class="callout"><span class="badge">Write it testable</span> A rule you cannot audit is not a policy statement, it is a wish. "Passwords must be strong" is a wish; "Passwords must be at least 12 characters" is a standard.</div>`,
    `<span class="eyebrow">IAP301 · Chương 4 · Bài 4.1</span>
<h2>Xây dựng &amp; viết chính sách bảo mật</h2>
<h3>Kim tự tháp tài liệu</h3>
<pre><code>Policy     -> CÁI GÌ & VÌ SAO (bắt buộc, mức cao, ít đổi)
Standard   -> chi tiết bắt buộc (vd "AES-256", "12+ ký tự")
Procedure  -> các BƯỚC làm thế nào (bắt buộc, vận hành)
Guideline  -> khuyến nghị thực hành tốt (lời khuyên, tuỳ chọn)
</code></pre>
<p>Chỉ ba tầng trên là bắt buộc; guideline chỉ khuyến nghị. Nhầm lẫn các tầng này là lỗi hay gặp nhất khi viết chính sách.</p>
<h3>Whitman &amp; Mattord: ba loại chính sách</h3>
<ul>
<li><strong>EISP</strong> — Chính sách ATTT cấp doanh nghiệp: tầm nhìn toàn tổ chức, do lãnh đạo cao nhất ký.</li>
<li><strong>ISSP</strong> — Chính sách theo vấn đề cụ thể: một chủ đề (email, sử dụng hợp lý, làm việc từ xa).</li>
<li><strong>SysSP</strong> — Chính sách theo hệ thống cụ thể: quy tắc cấu hình cho một hệ thống (bộ luật tường lửa, ACL).</li>
</ul>
<h3>Cấu trúc một chính sách tốt</h3>
<pre><code>1. Mục đích        vì sao có chính sách này
2. Phạm vi         áp dụng cho ai/cái gì
3. Nội dung chính sách   quy tắc thật (rõ, kiểm được)
4. Vai trò & trách nhiệm
5. Tuân thủ & xử lý vi phạm (hậu quả khi vi phạm)
6. Chu kỳ rà soát & chủ sở hữu (vd rà soát hằng năm)
7. Phiên bản / phê duyệt / ngày hiệu lực
</code></pre>
<h3>Vòng đời</h3>
<p>Soạn thảo → các bên rà soát → lãnh đạo phê duyệt → truyền thông/đào tạo → thực thi → rà soát/hết hiệu lực. Một chính sách không ai đọc, không ai thực thi còn tệ hơn không có — nó tạo cảm giác an toàn giả.</p>
<div class="callout"><span class="badge">Viết sao kiểm được</span> Một quy tắc không audit được thì không phải nội dung chính sách, mà là mong muốn. "Mật khẩu phải mạnh" là mong muốn; "Mật khẩu phải tối thiểu 12 ký tự" là standard.</div>`,
  ]]);

const c4q = quiz('iap301-quiz-4', 'Quiz 4 — Writing policy|||Quiz 4 — Viết chính sách', [
  { id: 'q1', question: 'Trong kim tự tháp tài liệu, cái nào chỉ mang tính KHUYẾN NGHỊ (không bắt buộc)?', options: ['Policy', 'Standard', 'Procedure', 'Guideline'], correctIndex: 3, explanation: 'Guideline là khuyến nghị/tuỳ chọn; policy, standard, procedure là bắt buộc.' },
  { id: 'q2', question: 'EISP (Enterprise Information Security Policy) là loại chính sách?', options: ['Cấu hình cho một hệ thống cụ thể', 'Tầm nhìn ATTT toàn tổ chức do lãnh đạo cao nhất ký', 'Hướng dẫn theo một vấn đề như email', 'Danh mục kiểm soát của ISO'], correctIndex: 1, explanation: 'EISP là chính sách gốc, cấp doanh nghiệp, định hướng toàn tổ chức. ISSP theo vấn đề, SysSP theo hệ thống.' },
  { id: 'q3', question: 'Vì sao "Mật khẩu phải mạnh" là câu KÉM trong chính sách?', options: ['Quá dài', 'Không kiểm/audit được vì không cụ thể, đo được', 'Thuộc về guideline', 'Vi phạm GDPR'], correctIndex: 1, explanation: 'Nội dung chính sách phải kiểm được; nên dùng standard cụ thể như "tối thiểu 12 ký tự".' },
]);

const c5 = doc('iap301-5-1-access-classification', '5.1 — Access control & data classification|||5.1 — Kiểm soát truy cập & phân loại tài sản/dữ liệu',
  'AAA (xác thực/uỷ quyền/ghi vết); mô hình kiểm soát truy cập (DAC/MAC/RBAC/ABAC); nguyên tắc least privilege & separation of duties; phân loại dữ liệu và xử lý theo nhãn.',
  [[
    `<span class="eyebrow">IAP301 · Chapter 5 · Lesson 5.1</span>
<h2>Access control &amp; data classification</h2>
<h3>AAA</h3>
<ul>
<li><strong>Authentication</strong> — prove who you are (password, token, biometric).</li>
<li><strong>Authorization</strong> — decide what you may do.</li>
<li><strong>Accounting / auditing</strong> — record what you did.</li>
</ul>
<h3>Access control models</h3>
<pre><code>DAC  Discretionary  owner grants access (file permissions)
MAC  Mandatory      system enforces labels (military, top-secret)
RBAC Role-Based     access by job role (most common in business)
ABAC Attribute-Based rules on attributes (dept, time, location)
</code></pre>
<h3>Two principles that shape policy</h3>
<ul>
<li><strong>Least privilege</strong> — give the minimum access needed to do the job, nothing more.</li>
<li><strong>Separation of duties</strong> — no single person controls a whole sensitive process (e.g. the person who requests a payment cannot also approve it).</li>
</ul>
<h3>Data classification</h3>
<pre><code>Level         Example                 Handling
-----------   ---------------------   ----------------------
Public        marketing page          no restriction
Internal      org chart               staff only
Confidential  customer PII            encrypt, need-to-know
Restricted    card data / secrets     strict, logged, limited
</code></pre>
<p>Classification drives handling: the label on the data decides how it is stored, transmitted, and destroyed.</p>
<div class="callout"><span class="badge">Label first, protect second</span> You cannot protect what you have not classified. Data classification is the input to almost every access and encryption decision.</div>`,
    `<span class="eyebrow">IAP301 · Chương 5 · Bài 5.1</span>
<h2>Kiểm soát truy cập &amp; phân loại dữ liệu</h2>
<h3>AAA</h3>
<ul>
<li><strong>Xác thực (Authentication)</strong> — chứng minh bạn là ai (mật khẩu, token, sinh trắc).</li>
<li><strong>Uỷ quyền (Authorization)</strong> — quyết định bạn được làm gì.</li>
<li><strong>Ghi vết (Accounting/auditing)</strong> — ghi lại bạn đã làm gì.</li>
</ul>
<h3>Các mô hình kiểm soát truy cập</h3>
<pre><code>DAC  Tuỳ quyền     chủ sở hữu cấp quyền (quyền tệp)
MAC  Bắt buộc      hệ thống ép theo nhãn (quân sự, tối mật)
RBAC Theo vai trò  cấp quyền theo chức danh (phổ biến nhất)
ABAC Theo thuộc tính  quy tắc theo phòng ban, giờ, vị trí
</code></pre>
<h3>Hai nguyên tắc định hình chính sách</h3>
<ul>
<li><strong>Đặc quyền tối thiểu</strong> — cấp đúng mức truy cập cần để làm việc, không hơn.</li>
<li><strong>Phân tách nhiệm vụ</strong> — không một người nào kiểm soát trọn một quy trình nhạy cảm (vd người đề nghị thanh toán không được đồng thời duyệt).</li>
</ul>
<h3>Phân loại dữ liệu</h3>
<pre><code>Mức          Ví dụ                    Cách xử lý
-----------   ---------------------   ----------------------
Công khai     trang marketing         không hạn chế
Nội bộ        sơ đồ tổ chức           chỉ nhân viên
Mật           PII khách hàng          mã hoá, cần-mới-biết
Tối mật       dữ liệu thẻ / bí mật    chặt, có log, giới hạn
</code></pre>
<p>Phân loại quyết định cách xử lý: nhãn trên dữ liệu quyết định nó được lưu, truyền và tiêu huỷ ra sao.</p>
<div class="callout"><span class="badge">Gắn nhãn trước, bảo vệ sau</span> Không thể bảo vệ thứ chưa phân loại. Phân loại dữ liệu là đầu vào của hầu hết mọi quyết định truy cập và mã hoá.</div>`,
  ]]);

const c5q = quiz('iap301-quiz-5', 'Quiz 5 — Access control|||Quiz 5 — Kiểm soát truy cập', [
  { id: 'q1', question: 'Nguyên tắc "đặc quyền tối thiểu" (least privilege) nghĩa là?', options: ['Cấp cho mọi người quyền admin cho tiện', 'Cấp đúng mức truy cập tối thiểu cần để làm việc', 'Không cấp quyền cho ai', 'Chỉ dùng mật khẩu ngắn'], correctIndex: 1, explanation: 'Least privilege: cấp mức truy cập tối thiểu đủ làm việc, giảm bề mặt tấn công.' },
  { id: 'q2', question: 'Mô hình cấp quyền theo CHỨC DANH công việc, phổ biến nhất trong doanh nghiệp là?', options: ['DAC', 'MAC', 'RBAC', 'ABAC'], correctIndex: 2, explanation: 'RBAC (Role-Based Access Control) cấp quyền theo vai trò/chức danh.' },
  { id: 'q3', question: 'Vì sao phân tách nhiệm vụ (separation of duties) quan trọng?', options: ['Để tăng tốc quy trình', 'Để không một người nào kiểm soát trọn một quy trình nhạy cảm, giảm gian lận', 'Để tiết kiệm tài khoản', 'Để bỏ qua bước audit'], correctIndex: 1, explanation: 'Chia một quy trình nhạy cảm cho nhiều người để không ai đơn phương gian lận được.' },
]);

const c6 = doc('iap301-6-1-incident-bcp', '6.1 — Incident response & business continuity|||6.1 — Ứng phó sự cố & liên tục kinh doanh (BCP/DRP)',
  'Vòng đời ứng phó sự cố (chuẩn bị→phát hiện→ngăn chặn→loại bỏ→phục hồi→bài học); BIA và các chỉ số RTO/RPO/MTD; phân biệt BCP với DRP; kế hoạch dự phòng.',
  [[
    `<span class="eyebrow">IAP301 · Chapter 6 · Lesson 6.1</span>
<h2>Incident response &amp; business continuity</h2>
<h3>The incident response lifecycle (NIST SP 800-61)</h3>
<pre><code>1. Preparation     plans, tools, trained team, contacts
2. Detection & analysis   is it really an incident?
3. Containment     stop the bleeding (short & long term)
4. Eradication     remove the cause (malware, account)
5. Recovery        restore & verify systems
6. Lessons learned update policy & controls
</code></pre>
<h3>BCP vs. DRP</h3>
<ul>
<li><strong>BCP (Business Continuity Plan)</strong> — keep the <em>whole business</em> running during disruption (people, sites, processes).</li>
<li><strong>DRP (Disaster Recovery Plan)</strong> — the IT-focused subset: restore <em>systems and data</em> after a disaster.</li>
</ul>
<h3>BIA and its key numbers</h3>
<p>A <strong>Business Impact Analysis (BIA)</strong> identifies critical processes and sets targets:</p>
<pre><code>RTO  Recovery Time Objective   how fast must it be back?
RPO  Recovery Point Objective  how much data loss is OK?
MTD  Maximum Tolerable Downtime the absolute limit
Example: RPO 1h  -> back up at least hourly
         RTO 4h  -> restore within 4 hours
</code></pre>
<div class="callout"><span class="badge">Test the plan</span> An untested plan is a hope. Tabletop exercises and failover drills are how you find the gaps before a real incident does.</div>`,
    `<span class="eyebrow">IAP301 · Chương 6 · Bài 6.1</span>
<h2>Ứng phó sự cố &amp; liên tục kinh doanh</h2>
<h3>Vòng đời ứng phó sự cố (NIST SP 800-61)</h3>
<pre><code>1. Chuẩn bị        kế hoạch, công cụ, đội ngũ, liên hệ
2. Phát hiện & phân tích   có đúng là sự cố không?
3. Ngăn chặn       chặn thiệt hại (ngắn & dài hạn)
4. Loại bỏ         gỡ nguyên nhân (mã độc, tài khoản)
5. Phục hồi        khôi phục & kiểm chứng hệ thống
6. Rút bài học     cập nhật chính sách & kiểm soát
</code></pre>
<h3>BCP so với DRP</h3>
<ul>
<li><strong>BCP (Kế hoạch liên tục kinh doanh)</strong> — giữ cho <em>toàn bộ doanh nghiệp</em> chạy khi gián đoạn (con người, địa điểm, quy trình).</li>
<li><strong>DRP (Kế hoạch khôi phục thảm hoạ)</strong> — phần tập trung vào CNTT: khôi phục <em>hệ thống và dữ liệu</em> sau thảm hoạ.</li>
</ul>
<h3>BIA và các con số then chốt</h3>
<p>Một <strong>Phân tích tác động kinh doanh (BIA)</strong> xác định quy trình trọng yếu và đặt mục tiêu:</p>
<pre><code>RTO  Mục tiêu thời gian phục hồi   phải chạy lại nhanh cỡ nào?
RPO  Mục tiêu điểm phục hồi        mất bao nhiêu dữ liệu chấp nhận?
MTD  Thời gian ngừng tối đa chịu được  giới hạn tuyệt đối
Ví dụ: RPO 1h  -> sao lưu ít nhất mỗi giờ
       RTO 4h  -> khôi phục trong 4 giờ
</code></pre>
<div class="callout"><span class="badge">Phải diễn tập</span> Kế hoạch chưa thử chỉ là hy vọng. Diễn tập trên bàn (tabletop) và diễn tập chuyển đổi dự phòng là cách tìm ra lỗ hổng trước khi sự cố thật tìm ra.</div>`,
  ]]);

const c6q = quiz('iap301-quiz-6', 'Quiz 6 — Incident & continuity|||Quiz 6 — Sự cố & liên tục', [
  { id: 'q1', question: 'Sự khác biệt chính giữa BCP và DRP là?', options: ['BCP chỉ về mã hoá, DRP về mật khẩu', 'BCP giữ toàn bộ doanh nghiệp chạy; DRP tập trung khôi phục hệ thống/dữ liệu CNTT', 'Chúng hoàn toàn giống nhau', 'DRP do người dùng viết, BCP do máy tạo'], correctIndex: 1, explanation: 'BCP bao trùm cả doanh nghiệp; DRP là tập con thiên về CNTT (khôi phục hệ thống, dữ liệu).' },
  { id: 'q2', question: 'RPO (Recovery Point Objective) trả lời câu hỏi nào?', options: ['Phải khôi phục nhanh cỡ nào', 'Được phép mất tối đa bao nhiêu dữ liệu', 'Ai chịu trách nhiệm', 'Chi phí kiểm soát là bao nhiêu'], correctIndex: 1, explanation: 'RPO = lượng dữ liệu tối đa chấp nhận mất; RTO mới là "nhanh cỡ nào".' },
  { id: 'q3', question: 'Bước nào KHÔNG thuộc vòng đời ứng phó sự cố (NIST)?', options: ['Ngăn chặn (Containment)', 'Loại bỏ (Eradication)', 'Rút bài học (Lessons learned)', 'Bán dữ liệu (Data monetization)'], correctIndex: 3, explanation: 'Vòng đời gồm chuẩn bị, phát hiện/phân tích, ngăn chặn, loại bỏ, phục hồi, rút bài học.' },
]);

const c7 = doc('iap301-7-1-compliance-ethics', '7.1 — Legal compliance & ethics|||7.1 — Tuân thủ pháp lý & đạo đức',
  'GDPR (nguyên tắc, quyền chủ thể dữ liệu, phạt); Luật An ninh mạng VN 2018 & Nghị định 13/2023 về dữ liệu cá nhân; PCI-DSS cho dữ liệu thẻ; đạo đức nghề nghiệp và ánh xạ tuân thủ thành kiểm soát.',
  [[
    `<span class="eyebrow">IAP301 · Chapter 7 · Lesson 7.1</span>
<h2>Legal compliance &amp; ethics</h2>
<p>Policy does not exist in a vacuum — laws and standards impose requirements you must meet, or face fines and liability.</p>
<h3>GDPR (EU)</h3>
<ul>
<li>Applies to anyone processing personal data of EU residents.</li>
<li>Principles: lawfulness, purpose limitation, data minimization, accuracy, storage limitation, integrity, accountability.</li>
<li>Data-subject rights: access, rectification, erasure ("right to be forgotten"), portability.</li>
<li>Fines up to 4% of global annual turnover; 72-hour breach notification.</li>
</ul>
<h3>Vietnam</h3>
<ul>
<li><strong>Cybersecurity Law 2018</strong> — data localization &amp; obligations for online services.</li>
<li><strong>Decree 13/2023 (PDPD)</strong> — personal data protection: consent, data-subject rights, impact assessment.</li>
</ul>
<h3>PCI-DSS</h3>
<p>A contractual standard for anyone storing/processing <strong>payment card data</strong> — build a secure network, protect cardholder data, restrict access, monitor and test. Non-compliance risks fines and losing the ability to take cards.</p>
<h3>Ethics</h3>
<p>Beyond the law: professional codes (e.g. (ISC)² Code of Ethics) require acting honestly, protecting society, and avoiding conflicts of interest — even where no law compels you.</p>
<div class="callout"><span class="badge">Compliance -&gt; control -&gt; metric</span> Turn each legal clause into a concrete control and a measurable metric. "GDPR 72h notification" becomes an incident-response procedure with a stopwatch you can audit.</div>`,
    `<span class="eyebrow">IAP301 · Chương 7 · Bài 7.1</span>
<h2>Tuân thủ pháp lý &amp; đạo đức</h2>
<p>Chính sách không tồn tại trong chân không — luật và tiêu chuẩn áp đặt yêu cầu bạn phải đáp ứng, nếu không sẽ bị phạt và chịu trách nhiệm pháp lý.</p>
<h3>GDPR (EU)</h3>
<ul>
<li>Áp dụng cho bất kỳ ai xử lý dữ liệu cá nhân của cư dân EU.</li>
<li>Nguyên tắc: hợp pháp, giới hạn mục đích, tối thiểu dữ liệu, chính xác, giới hạn lưu trữ, toàn vẹn, trách nhiệm giải trình.</li>
<li>Quyền chủ thể dữ liệu: truy cập, đính chính, xoá ("quyền được lãng quên"), di chuyển dữ liệu.</li>
<li>Phạt tới 4% doanh thu toàn cầu hằng năm; thông báo vi phạm trong 72 giờ.</li>
</ul>
<h3>Việt Nam</h3>
<ul>
<li><strong>Luật An ninh mạng 2018</strong> — nội địa hoá dữ liệu &amp; nghĩa vụ với dịch vụ trực tuyến.</li>
<li><strong>Nghị định 13/2023 (PDPD)</strong> — bảo vệ dữ liệu cá nhân: sự đồng ý, quyền chủ thể dữ liệu, đánh giá tác động.</li>
</ul>
<h3>PCI-DSS</h3>
<p>Tiêu chuẩn hợp đồng cho ai lưu/xử lý <strong>dữ liệu thẻ thanh toán</strong> — dựng mạng an toàn, bảo vệ dữ liệu chủ thẻ, hạn chế truy cập, giám sát và kiểm thử. Không tuân thủ có thể bị phạt và mất quyền chấp nhận thẻ.</p>
<h3>Đạo đức</h3>
<p>Trên cả luật: các bộ quy tắc nghề nghiệp (vd Code of Ethics của (ISC)²) yêu cầu hành xử trung thực, bảo vệ xã hội, tránh xung đột lợi ích — kể cả khi không luật nào bắt buộc.</p>
<div class="callout"><span class="badge">Tuân thủ -&gt; kiểm soát -&gt; chỉ số</span> Biến mỗi điều khoản pháp lý thành một kiểm soát cụ thể và một chỉ số đo được. "GDPR thông báo 72h" trở thành một quy trình ứng phó sự cố có bấm giờ để audit.</div>`,
  ]]);

const c7q = quiz('iap301-quiz-7', 'Quiz 7 — Compliance & ethics|||Quiz 7 — Tuân thủ & đạo đức', [
  { id: 'q1', question: 'GDPR yêu cầu thông báo vi phạm dữ liệu trong bao lâu?', options: ['24 giờ', '72 giờ', '7 ngày', '30 ngày'], correctIndex: 1, explanation: 'GDPR yêu cầu thông báo cho cơ quan giám sát trong vòng 72 giờ; phạt tới 4% doanh thu toàn cầu.' },
  { id: 'q2', question: 'Tiêu chuẩn nào áp dụng cho tổ chức lưu/xử lý DỮ LIỆU THẺ thanh toán?', options: ['ISO 9001', 'PCI-DSS', 'GDPR', 'COBIT'], correctIndex: 1, explanation: 'PCI-DSS là tiêu chuẩn hợp đồng cho dữ liệu thẻ thanh toán.' },
  { id: 'q3', question: 'Văn bản nào của Việt Nam tập trung vào BẢO VỆ DỮ LIỆU CÁ NHÂN?', options: ['Nghị định 13/2023 (PDPD)', 'PCI-DSS', 'NIST SP 800-53', 'ISO 27002'], correctIndex: 0, explanation: 'Nghị định 13/2023 (PDPD) quy định bảo vệ dữ liệu cá nhân; Luật An ninh mạng 2018 rộng hơn.' },
]);

const c8 = doc('iap301-8-1-awareness-audit-metrics', '8.1 — Awareness, audit & measuring the program|||8.1 — Đào tạo nhận thức, audit & đo lường hiệu quả',
  'Chương trình SETA (nhận thức/đào tạo/giáo dục); kiểm toán nội bộ và bên ngoài, bằng chứng tuân thủ; đo hiệu quả bằng KPI/KRI; vòng cải tiến liên tục (PDCA) khép lại chương trình.',
  [[
    `<span class="eyebrow">IAP301 · Chapter 8 · Lesson 8.1</span>
<h2>Awareness, audit &amp; measuring the program</h2>
<h3>SETA: the human layer</h3>
<pre><code>Awareness  -> everyone; short, frequent (phishing, passwords)
Training   -> role-specific skills (secure coding, admin)
Education  -> deep, formal (degrees, certifications)
</code></pre>
<p>People are the most-attacked control. A recurring <strong>SETA</strong> program — plus phishing simulations — is how policy reaches behaviour.</p>
<h3>Audit</h3>
<ul>
<li><strong>Internal audit</strong> — the org checks itself against its own policy.</li>
<li><strong>External / certification audit</strong> — an independent body (e.g. ISO 27001 certification) verifies conformance.</li>
<li>Audits need <strong>evidence</strong>: logs, tickets, approvals, screenshots — "if it isn't recorded, it didn't happen".</li>
</ul>
<h3>Metrics: KPI vs. KRI</h3>
<pre><code>KPI (performance)   % staff trained, patch time, MFA coverage
KRI (risk)          open critical vulns, failed logins, incidents
</code></pre>
<p>Good metrics are measurable, tied to a goal, and reported to leadership so they can adjust risk decisions.</p>
<h3>Continuous improvement</h3>
<p>The whole program is a loop — <strong>Plan-Do-Check-Act (PDCA)</strong>. Audit and metrics feed the "Check"; policy updates are the "Act". A security program is never "done".</p>
<div class="callout"><span class="badge">Measure what matters</span> Track outcomes (incidents avoided, time-to-patch), not vanity numbers. Metrics exist to drive decisions, not to fill a slide.</div>`,
    `<span class="eyebrow">IAP301 · Chương 8 · Bài 8.1</span>
<h2>Đào tạo nhận thức, audit &amp; đo lường hiệu quả</h2>
<h3>SETA: tầng con người</h3>
<pre><code>Nhận thức  -> mọi người; ngắn, thường xuyên (phishing, mật khẩu)
Đào tạo    -> kỹ năng theo vai trò (lập trình an toàn, quản trị)
Giáo dục   -> sâu, chính quy (bằng cấp, chứng chỉ)
</code></pre>
<p>Con người là kiểm soát bị tấn công nhiều nhất. Một chương trình <strong>SETA</strong> định kỳ — kèm mô phỏng phishing — là cách chính sách chạm đến hành vi.</p>
<h3>Audit</h3>
<ul>
<li><strong>Kiểm toán nội bộ</strong> — tổ chức tự đối chiếu với chính sách của mình.</li>
<li><strong>Kiểm toán ngoài / chứng nhận</strong> — bên độc lập (vd chứng nhận ISO 27001) xác nhận sự phù hợp.</li>
<li>Audit cần <strong>bằng chứng</strong>: log, phiếu, phê duyệt, ảnh chụp — "không ghi lại nghĩa là không xảy ra".</li>
</ul>
<h3>Chỉ số: KPI so với KRI</h3>
<pre><code>KPI (hiệu suất)   % nhân viên đã đào tạo, thời gian vá, phủ MFA
KRI (rủi ro)      lỗ hổng nghiêm trọng còn mở, đăng nhập thất bại, số sự cố
</code></pre>
<p>Chỉ số tốt thì đo được, gắn với mục tiêu, và được báo cáo lên lãnh đạo để họ điều chỉnh quyết định về rủi ro.</p>
<h3>Cải tiến liên tục</h3>
<p>Cả chương trình là một vòng lặp — <strong>Plan-Do-Check-Act (PDCA)</strong>. Audit và chỉ số nuôi bước "Check"; cập nhật chính sách là bước "Act". Một chương trình an toàn không bao giờ "xong".</p>
<div class="callout"><span class="badge">Đo cái đáng đo</span> Theo dõi kết quả (sự cố tránh được, thời gian vá), không phải số liệu phù phiếm. Chỉ số sinh ra để dẫn quyết định, không phải để lấp một slide.</div>`,
  ]]);

const c8q = quiz('iap301-quiz-8', 'Quiz 8 — Awareness & audit|||Quiz 8 — Nhận thức & audit', [
  { id: 'q1', question: 'Trong chương trình SETA, "Awareness" (nhận thức) nhắm tới?', options: ['Chỉ đội quản trị hệ thống', 'Mọi người, dạng ngắn và thường xuyên (phishing, mật khẩu)', 'Chỉ lãnh đạo cấp cao', 'Chỉ lập trình viên'], correctIndex: 1, explanation: 'Awareness dành cho mọi người, ngắn & lặp; training theo vai trò; education là chính quy, sâu.' },
  { id: 'q2', question: 'Vì sao kiểm toán (audit) cần BẰNG CHỨNG như log, phiếu, phê duyệt?', options: ['Để trang trí báo cáo', 'Vì "không ghi lại nghĩa là không xảy ra" — cần chứng minh sự tuân thủ', 'Để tăng dung lượng ổ đĩa', 'Vì luật cấm xoá log'], correctIndex: 1, explanation: 'Audit dựa trên bằng chứng khách quan; không có bằng chứng thì không chứng minh được đã thực hiện.' },
  { id: 'q3', question: 'Vòng Plan-Do-Check-Act (PDCA) thể hiện điều gì trong chương trình ATTT?', options: ['Chương trình làm một lần rồi xong', 'Cải tiến liên tục: audit/chỉ số nuôi bước Check, cập nhật chính sách là Act', 'Cách mã hoá dữ liệu', 'Một mô hình kiểm soát truy cập'], correctIndex: 1, explanation: 'PDCA là vòng cải tiến liên tục; chương trình an toàn không bao giờ "xong".' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'IAP301',
    slug: 'iap301-policy-development-in-information-assurance',
    title: 'Policy Development in Information Assurance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IAP301.webp',
    shortDescription: 'Governance & the CIA triad, standards (ISO 27001, NIST CSF, COBIT), risk, writing policy, access control & data classification, incident response & BCP/DRP, compliance (GDPR, PCI-DSS) & audit. Bilingual, with quizzes.|||Quản trị & bộ ba CIA, tiêu chuẩn (ISO 27001, NIST CSF, COBIT), rủi ro, viết chính sách, kiểm soát truy cập & phân loại dữ liệu, ứng phó sự cố & BCP/DRP, tuân thủ (GDPR, Luật ANM VN, PCI-DSS) & audit. Song ngữ, có quiz.',
    description: 'Môn <strong>IAP301 — Policy Development in Information Assurance</strong> (Xây dựng chính sách trong Đảm bảo an toàn thông tin, kỳ 7) dạy cách <strong>quản trị an toàn bằng chính sách viết ra</strong>. Từ <strong>quản trị &amp; bộ ba CIA</strong> → <strong>khung &amp; tiêu chuẩn</strong> (ISO 27001, NIST CSF, COBIT) → <strong>quản lý rủi ro</strong> → <strong>viết policy/standard/procedure/guideline</strong> → <strong>kiểm soát truy cập &amp; phân loại dữ liệu</strong> → <strong>ứng phó sự cố &amp; BCP/DRP</strong> → <strong>tuân thủ pháp lý &amp; đạo đức</strong> (GDPR, Luật ANM VN, PCI-DSS) → <strong>đào tạo, audit &amp; đo lường</strong>. Bám giáo trình Whitman/Mattord và các tiêu chuẩn NIST/ISO/COBIT, song ngữ, có mẫu chính sách và quiz mỗi chương.',
    whatYouLearn: 'Quản trị so với quản lý &amp; bộ ba CIA; ánh xạ ISO 27001, NIST CSF, NIST 800-53 và COBIT; quy trình rủi ro (SLE/ARO/ALE, xử lý rủi ro, rủi ro tồn dư); kim tự tháp policy/standard/procedure/guideline và EISP/ISSP/SysSP; AAA, DAC/MAC/RBAC/ABAC, least privilege &amp; separation of duties, phân loại dữ liệu; vòng đời ứng phó sự cố, BIA, RTO/RPO/MTD, BCP so với DRP; GDPR, Luật ANM VN &amp; Nghị định 13/2023, PCI-DSS, đạo đức; SETA, audit, KPI/KRI và vòng PDCA.',
    requirements: 'Không cần lập trình. Nên có hiểu biết cơ bản về hệ thống thông tin/mạng và làm quen với thuật ngữ CNTT.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Whitman/Mattord, tiêu chuẩn ISO/NIST/COBIT, văn bản pháp luật, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'IA là gì, bộ ba CIA, vai trò của chính sách, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Quản trị & CIA|||Chapter 1 — Governance & CIA', description: 'Quản trị vs quản lý, CIA, vai trò, đe doạ/lỗ hổng/rủi ro.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung & tiêu chuẩn|||Chapter 2 — Frameworks & standards', description: 'ISO 27001, NIST CSF/800-53, COBIT và cách ánh xạ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quản lý rủi ro|||Chapter 3 — Risk management', description: 'Quy trình rủi ro, SLE/ARO/ALE, xử lý & rủi ro tồn dư.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Viết chính sách|||Chapter 4 — Writing policy', description: 'Policy/standard/procedure/guideline, EISP/ISSP/SysSP, cấu trúc.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kiểm soát truy cập & phân loại|||Chapter 5 — Access control & classification', description: 'AAA, DAC/MAC/RBAC/ABAC, least privilege, phân loại dữ liệu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Sự cố & liên tục kinh doanh|||Chapter 6 — Incident & continuity', description: 'Vòng đời ứng phó sự cố, BIA, RTO/RPO/MTD, BCP/DRP.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tuân thủ & đạo đức|||Chapter 7 — Compliance & ethics', description: 'GDPR, Luật ANM VN & NĐ 13/2023, PCI-DSS, đạo đức nghề.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Nhận thức, audit & đo lường|||Chapter 8 — Awareness, audit & metrics', description: 'SETA, kiểm toán, KPI/KRI, vòng PDCA cải tiến liên tục.', lessons: [c8, c8q] },
  ],
};
