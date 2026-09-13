/**
 * DPY391 — Data Security and Privacy. Ngành Khoa học Máy tính FPTU (Kỳ 5).
 * Khung 8 chương: bảo mật vs quyền riêng tư, vòng đời & phân loại dữ liệu,
 * mã hoá, kiểm soát truy cập, nguyên tắc quyền riêng tư, Privacy by Design,
 * tuân thủ & pháp lý (GDPR/NĐ 13/2023/ISO 27701), sự cố & quản trị.
 * Nguồn chuẩn: GDPR, NIST Privacy Framework, ISO/IEC 27701, "The Privacy
 * Engineer's Manifesto", NĐ 13/2023 VN. Song ngữ + kỹ thuật + điều luật + ví dụ.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dpy391-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), luật & khung chuẩn (GDPR, NIST Privacy Framework, ISO 27701, NĐ 13/2023), sách, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DPY391 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Data Security and Privacy</strong> — protecting data (confidentiality, integrity, availability) and respecting people's privacy rights — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are the free, authoritative standards and laws this course is built on.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for DPY391 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>The Privacy Engineer's Manifesto</em> — Dennedy, Fox &amp; Finneran (privacy by design in practice).</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final" target="_blank" rel="noopener">NIST SP 800-57 — Recommendation for Key Management</a>.</li>
</ul>
<h3>🌐 Standards &amp; law (free)</h3>
<ul>
<li><a href="https://gdpr-info.eu/" target="_blank" rel="noopener">GDPR — full text (EU Regulation 2016/679)</a></li>
<li><a href="https://www.nist.gov/privacy-framework" target="_blank" rel="noopener">NIST Privacy Framework</a> — Identify, Govern, Control, Communicate, Protect.</li>
<li><a href="https://www.iso.org/standard/71670.html" target="_blank" rel="noopener">ISO/IEC 27701</a> — Privacy Information Management System (PIMS).</li>
<li>Nghị định 13/2023/NĐ-CP — Bảo vệ dữ liệu cá nhân (Việt Nam).</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ComputerphileMirror" target="_blank" rel="noopener">Computerphile</a> — encryption, hashing &amp; security explained.</li>
<li><a href="https://www.youtube.com/@ProfessorMesser" target="_blank" rel="noopener">Professor Messer</a> — Security+ concepts (access control, CIA).</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.cyberchef.io/" target="_blank" rel="noopener">CyberChef</a> — hashing, encoding &amp; encryption in the browser.</li>
<li><a href="https://csrc.nist.gov/glossary" target="_blank" rel="noopener">NIST Glossary</a> — precise definitions of security &amp; privacy terms.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — security vs privacy, CIA triad, PII, data lifecycle &amp; classification.</li>
<li><strong>Protect</strong> — encryption (at rest / in transit), key management, hashing, access control (RBAC/ABAC, least privilege).</li>
<li><strong>Privacy engineering</strong> — privacy principles, consent, data minimization, Privacy by Design, anonymization &amp; differential privacy.</li>
<li><strong>Compliance &amp; response</strong> — GDPR/CCPA, NĐ 13/2023, ISO 27701, DPIA, data-subject rights, breach response &amp; data ethics.</li>
</ol></div>`,
    `<span class="eyebrow">DPY391 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Bảo mật &amp; Quyền riêng tư dữ liệu</strong> — bảo vệ dữ liệu (bí mật, toàn vẹn, sẵn sàng) và tôn trọng quyền riêng tư của con người — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các chuẩn và luật gốc mà môn này dựa vào.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DPY391 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>The Privacy Engineer's Manifesto</em> — Dennedy, Fox &amp; Finneran (privacy by design trong thực tế).</li>
<li><a href="https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final" target="_blank" rel="noopener">NIST SP 800-57 — Khuyến nghị Quản lý Khoá</a>.</li>
</ul>
<h3>🌐 Chuẩn &amp; luật (miễn phí)</h3>
<ul>
<li><a href="https://gdpr-info.eu/" target="_blank" rel="noopener">GDPR — toàn văn (Quy định EU 2016/679)</a></li>
<li><a href="https://www.nist.gov/privacy-framework" target="_blank" rel="noopener">NIST Privacy Framework</a> — Identify, Govern, Control, Communicate, Protect.</li>
<li><a href="https://www.iso.org/standard/71670.html" target="_blank" rel="noopener">ISO/IEC 27701</a> — Hệ quản lý thông tin quyền riêng tư (PIMS).</li>
<li>Nghị định 13/2023/NĐ-CP — Bảo vệ dữ liệu cá nhân (Việt Nam).</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ComputerphileMirror" target="_blank" rel="noopener">Computerphile</a> — giảng mã hoá, băm &amp; bảo mật.</li>
<li><a href="https://www.youtube.com/@ProfessorMesser" target="_blank" rel="noopener">Professor Messer</a> — khái niệm Security+ (kiểm soát truy cập, CIA).</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.cyberchef.io/" target="_blank" rel="noopener">CyberChef</a> — băm, mã hoá &amp; giải mã trên trình duyệt.</li>
<li><a href="https://csrc.nist.gov/glossary" target="_blank" rel="noopener">NIST Glossary</a> — định nghĩa chuẩn xác thuật ngữ bảo mật &amp; quyền riêng tư.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — bảo mật vs quyền riêng tư, bộ ba CIA, PII, vòng đời &amp; phân loại dữ liệu.</li>
<li><strong>Bảo vệ</strong> — mã hoá (khi lưu / khi truyền), quản lý khoá, băm, kiểm soát truy cập (RBAC/ABAC, quyền tối thiểu).</li>
<li><strong>Kỹ thuật quyền riêng tư</strong> — nguyên tắc, đồng thuận, tối thiểu hoá dữ liệu, Privacy by Design, ẩn danh &amp; riêng tư vi phân.</li>
<li><strong>Tuân thủ &amp; xử lý sự cố</strong> — GDPR/CCPA, NĐ 13/2023, ISO 27701, DPIA, quyền chủ thể dữ liệu, ứng phó rò rỉ &amp; đạo đức dữ liệu.</li>
</ol></div>`,
  ]]);

const intro = doc('dpy391-0-1-overview', 'Course overview: Data Security &amp; Privacy|||Tổng quan: Bảo mật &amp; Quyền riêng tư dữ liệu',
  'Môn học làm gì; bảo mật vs quyền riêng tư; vì sao quan trọng; lộ trình 8 chương từ nền tảng → bảo vệ → kỹ thuật quyền riêng tư → tuân thủ & sự cố.',
  [[
    `<span class="eyebrow">DPY391 · Lesson 0.1 · Overview</span>
<h2>Data Security &amp; Privacy</h2>
<p class="lead">This course teaches you to <strong>protect data</strong> and <strong>respect privacy</strong> — two goals that overlap but are not the same. <strong>Security</strong> keeps data safe from unauthorized access; <strong>privacy</strong> governs whether you should collect and use personal data at all, and how.</p>
<h3>Why it matters</h3>
<ul>
<li>Every app handles <strong>personal data (PII)</strong> — names, emails, locations, health, payments.</li>
<li>A single breach can cost millions and destroy trust; laws like <strong>GDPR</strong> and <strong>NĐ 13/2023</strong> now carry real penalties.</li>
<li>Engineers who understand privacy build systems that are safe <em>by design</em>, not patched after an incident.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Foundations (security vs privacy, CIA, PII) → data lifecycle &amp; classification → encryption &amp; key management → access control → privacy principles &amp; GDPR → Privacy by Design → compliance &amp; law → breach response &amp; governance. Bilingual, with techniques, real clauses of law, worked examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">DPY391 · Bài 0.1 · Tổng quan</span>
<h2>Bảo mật &amp; Quyền riêng tư dữ liệu</h2>
<p class="lead">Môn này dạy bạn <strong>bảo vệ dữ liệu</strong> và <strong>tôn trọng quyền riêng tư</strong> — hai mục tiêu giao nhau nhưng không giống nhau. <strong>Bảo mật</strong> giữ dữ liệu an toàn khỏi truy cập trái phép; <strong>quyền riêng tư</strong> quyết định có nên thu thập và dùng dữ liệu cá nhân hay không, và dùng thế nào.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li>Mọi ứng dụng đều xử lý <strong>dữ liệu cá nhân (PII)</strong> — tên, email, vị trí, sức khoẻ, thanh toán.</li>
<li>Một lần rò rỉ có thể tốn hàng triệu đô và huỷ hoại niềm tin; luật như <strong>GDPR</strong> và <strong>NĐ 13/2023</strong> nay có chế tài thật.</li>
<li>Kỹ sư hiểu quyền riêng tư sẽ dựng hệ thống an toàn <em>ngay từ thiết kế</em>, không phải vá sau sự cố.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Nền tảng (bảo mật vs quyền riêng tư, CIA, PII) → vòng đời &amp; phân loại dữ liệu → mã hoá &amp; quản lý khoá → kiểm soát truy cập → nguyên tắc quyền riêng tư &amp; GDPR → Privacy by Design → tuân thủ &amp; pháp lý → ứng phó sự cố &amp; quản trị. Song ngữ, có kỹ thuật, điều luật thật, ví dụ và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dpy391-1-1-security-vs-privacy', '1.1 — Security &amp; privacy of data|||1.1 — Bảo mật &amp; quyền riêng tư dữ liệu',
  'Bảo mật vs quyền riêng tư; bộ ba CIA (bí mật/toàn vẹn/sẵn sàng); PII là gì; vì sao dữ liệu cá nhân quan trọng.',
  [[
    `<span class="eyebrow">DPY391 · Chapter 1 · Lesson 1.1</span>
<h2>Security &amp; privacy of data</h2>
<h3>Two related, distinct goals</h3>
<ul>
<li><strong>Security</strong> — protecting data from unauthorized access, change or loss. It answers "is the data safe?"</li>
<li><strong>Privacy</strong> — the right of a person to control what is collected about them and how it is used. It answers "should we have this data, and are we using it fairly?"</li>
</ul>
<p>You can have security without privacy (a well-encrypted database of data you had no right to collect) but you cannot have privacy without security.</p>
<h3>The CIA triad</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorized parties can read the data (encryption, access control).</li>
<li><strong>Integrity</strong> — data is not altered without detection (hashing, signatures).</li>
<li><strong>Availability</strong> — data &amp; services are reachable when needed (backups, redundancy).</li>
</ul>
<h3>PII — personal data</h3>
<p><strong>PII (Personally Identifiable Information)</strong> is any data that identifies a person: name, email, phone, national ID, location, biometrics. Some is <em>sensitive</em> (health, religion, ethnicity) and needs stronger protection. Under NĐ 13/2023, "dữ liệu cá nhân nhạy cảm" is a defined, higher-risk category.</p>
<div class="callout"><span class="badge">Key idea</span> Security is a means; privacy is a goal. A privacy engineer secures data <em>and</em> asks whether it should exist.</div>`,
    `<span class="eyebrow">DPY391 · Chương 1 · Bài 1.1</span>
<h2>Bảo mật &amp; quyền riêng tư dữ liệu</h2>
<h3>Hai mục tiêu liên quan nhưng khác nhau</h3>
<ul>
<li><strong>Bảo mật (security)</strong> — bảo vệ dữ liệu khỏi truy cập, sửa đổi hay mất mát trái phép. Trả lời "dữ liệu có an toàn không?"</li>
<li><strong>Quyền riêng tư (privacy)</strong> — quyền của một người kiểm soát thứ gì được thu thập về mình và dùng ra sao. Trả lời "có nên giữ dữ liệu này không, và ta dùng nó công bằng chưa?"</li>
</ul>
<p>Có thể có bảo mật mà không có quyền riêng tư (một CSDL mã hoá tốt chứa dữ liệu ta không có quyền thu thập), nhưng không thể có quyền riêng tư nếu thiếu bảo mật.</p>
<h3>Bộ ba CIA</h3>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ bên được phép mới đọc được (mã hoá, kiểm soát truy cập).</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu không bị sửa mà không bị phát hiện (băm, chữ ký).</li>
<li><strong>Sẵn sàng (Availability)</strong> — dữ liệu &amp; dịch vụ truy cập được khi cần (sao lưu, dự phòng).</li>
</ul>
<h3>PII — dữ liệu cá nhân</h3>
<p><strong>PII (thông tin định danh cá nhân)</strong> là mọi dữ liệu nhận diện một người: tên, email, số điện thoại, CCCD, vị trí, sinh trắc học. Một số là <em>nhạy cảm</em> (sức khoẻ, tôn giáo, dân tộc) và cần bảo vệ mạnh hơn. Theo NĐ 13/2023, "dữ liệu cá nhân nhạy cảm" là một nhóm có định nghĩa riêng, rủi ro cao hơn.</p>
<div class="callout"><span class="badge">Ý chính</span> Bảo mật là phương tiện; quyền riêng tư là mục tiêu. Kỹ sư quyền riêng tư vừa bảo vệ dữ liệu vừa hỏi liệu nó có nên tồn tại.</div>`,
  ]]);

const c1q = quiz('dpy391-quiz-1', 'Quiz 1 — Security &amp; privacy|||Quiz 1 — Bảo mật &amp; quyền riêng tư', [
  { id: 'q1', question: 'What does the CIA triad consist of?|||Bộ ba CIA trong bảo mật gồm?', options: ['Confidentiality, Integrity, Availability|||Bí mật, Toàn vẹn, Sẵn sàng', 'Control, Identity, Access|||Kiểm soát, Định danh, Truy cập', 'Consent, Integrity, Audit|||Đồng thuận, Toàn vẹn, Kiểm toán', 'Cipher, Index, Alert|||Mã, Chỉ mục, Cảnh báo'], correctIndex: 0, explanation: 'CIA = Confidentiality (bí mật), Integrity (toàn vẹn), Availability (sẵn sàng).' },
  { id: 'q2', question: 'What is the core difference between security and privacy?|||Khác biệt cốt lõi giữa bảo mật và quyền riêng tư?', options: ['They are identical|||Chúng giống hệt nhau', 'Security keeps data safe; privacy governs whether to collect/use personal data and how|||Bảo mật giữ dữ liệu an toàn; quyền riêng tư quyết định có nên thu thập/dùng dữ liệu và dùng thế nào', 'Privacy is only for big companies|||Quyền riêng tư chỉ dành cho công ty lớn', 'Security needs no encryption|||Bảo mật không cần mã hoá'], correctIndex: 1, explanation: 'Bảo mật = an toàn dữ liệu; quyền riêng tư = quyền kiểm soát dữ liệu cá nhân.' },
  { id: 'q3', question: 'What is PII?|||PII là gì?', options: ['A network protocol|||Giao thức mạng', 'Personally Identifiable Information (name, email, location...)|||Thông tin định danh cá nhân (tên, email, vị trí...)', 'An encryption algorithm|||Một thuật toán mã hoá', 'A type of firewall|||Một loại tường lửa'], correctIndex: 1, explanation: 'PII = dữ liệu nhận diện một cá nhân; loại nhạy cảm cần bảo vệ mạnh hơn.' },
]);

const c2 = doc('dpy391-2-1-lifecycle-classification', '2.1 — Data lifecycle &amp; classification|||2.1 — Vòng đời &amp; phân loại dữ liệu',
  'Vòng đời dữ liệu (thu thập→lưu→dùng→chia sẻ→lưu trữ→huỷ); phân loại theo độ nhạy; data governance & quyền sở hữu dữ liệu.',
  [[
    `<span class="eyebrow">DPY391 · Chapter 2 · Lesson 2.1</span>
<h2>Data lifecycle &amp; classification</h2>
<h3>The data lifecycle</h3>
<pre><code>Collect  -> only what you need, with a lawful basis
Store    -> encrypt, control access, set retention
Use      -> only for the stated purpose
Share    -> with controls (contracts, minimization)
Archive  -> long-term, restricted
Destroy  -> secure deletion when no longer needed
</code></pre>
<p>Privacy risk exists at every stage — the safest data is data you never collected, and data you deleted on time.</p>
<h3>Data classification</h3>
<p>Classifying data by sensitivity tells you how hard to protect it. A common scheme:</p>
<ul>
<li><strong>Public</strong> — no harm if disclosed (marketing pages).</li>
<li><strong>Internal</strong> — for staff only (org charts).</li>
<li><strong>Confidential</strong> — customer PII, contracts.</li>
<li><strong>Restricted / Sensitive</strong> — health, payment, biometrics — strongest controls.</li>
</ul>
<h3>Data governance</h3>
<p><strong>Governance</strong> assigns responsibility: a <em>data owner</em> decides classification &amp; access, a <em>data steward</em> maintains quality, and a <strong>data inventory / record of processing</strong> (required by GDPR Art. 30) lists what you hold and why.</p>
<div class="callout"><span class="badge">Rule of thumb</span> You cannot protect or delete data you do not know you have — start with an inventory.</div>`,
    `<span class="eyebrow">DPY391 · Chương 2 · Bài 2.1</span>
<h2>Vòng đời &amp; phân loại dữ liệu</h2>
<h3>Vòng đời dữ liệu</h3>
<pre><code>Thu thập -> chỉ lấy thứ cần, có căn cứ hợp pháp
Lưu trữ  -> mã hoá, kiểm soát truy cập, đặt thời hạn
Sử dụng  -> chỉ cho mục đích đã nêu
Chia sẻ  -> có kiểm soát (hợp đồng, tối thiểu hoá)
Lưu kho  -> dài hạn, hạn chế truy cập
Tiêu huỷ -> xoá an toàn khi không còn cần
</code></pre>
<p>Rủi ro quyền riêng tư có ở mọi giai đoạn — dữ liệu an toàn nhất là dữ liệu bạn chưa bao giờ thu thập, và dữ liệu bạn đã xoá đúng hạn.</p>
<h3>Phân loại dữ liệu</h3>
<p>Phân loại theo độ nhạy cho biết cần bảo vệ mạnh đến đâu. Một sơ đồ phổ biến:</p>
<ul>
<li><strong>Công khai (Public)</strong> — lộ ra không gây hại (trang marketing).</li>
<li><strong>Nội bộ (Internal)</strong> — chỉ cho nhân viên (sơ đồ tổ chức).</li>
<li><strong>Bí mật (Confidential)</strong> — PII khách hàng, hợp đồng.</li>
<li><strong>Hạn chế / Nhạy cảm (Restricted)</strong> — sức khoẻ, thanh toán, sinh trắc — kiểm soát mạnh nhất.</li>
</ul>
<h3>Quản trị dữ liệu (data governance)</h3>
<p><strong>Quản trị</strong> giao trách nhiệm: <em>chủ dữ liệu</em> quyết phân loại &amp; quyền truy cập, <em>người quản lý dữ liệu</em> giữ chất lượng, và một <strong>kho kiểm kê / hồ sơ xử lý dữ liệu</strong> (GDPR Điều 30 yêu cầu) liệt kê bạn giữ gì và vì sao.</p>
<div class="callout"><span class="badge">Nguyên tắc</span> Không thể bảo vệ hay xoá thứ mình không biết là mình có — hãy bắt đầu bằng kiểm kê.</div>`,
  ]]);

const c2q = quiz('dpy391-quiz-2', 'Quiz 2 — Lifecycle &amp; classification|||Quiz 2 — Vòng đời &amp; phân loại', [
  { id: 'q1', question: 'Which lifecycle stage most reduces privacy risk when done right?|||Giai đoạn nào của vòng đời dữ liệu giảm rủi ro quyền riêng tư nhiều nhất khi làm đúng?', options: ['Collect as little as possible + delete on time|||Thu thập ít nhất có thể + xoá đúng hạn', 'Store as much as possible|||Lưu càng nhiều càng tốt', 'Share widely|||Chia sẻ rộng rãi', 'Ignore retention limits|||Bỏ qua thời hạn lưu'], correctIndex: 0, explanation: 'Dữ liệu an toàn nhất là dữ liệu chưa thu thập hoặc đã xoá đúng hạn.' },
  { id: 'q2', question: 'Which data class needs the strongest controls?|||Nhóm dữ liệu nào cần kiểm soát mạnh nhất?', options: ['Public|||Công khai (Public)', 'Internal|||Nội bộ (Internal)', 'Restricted / Sensitive (health, payment, biometrics)|||Hạn chế / Nhạy cảm (sức khoẻ, thanh toán, sinh trắc)', 'Marketing pages|||Trang marketing'], correctIndex: 2, explanation: 'Dữ liệu nhạy cảm/hạn chế cần mức bảo vệ cao nhất.' },
  { id: 'q3', question: 'What is the first step of data governance?|||Bước đầu tiên của quản trị dữ liệu là?', options: ['Delete all data|||Xoá hết dữ liệu', 'Build a data inventory / record of processing (know what you hold and why)|||Lập kho kiểm kê / hồ sơ xử lý (biết mình giữ gì và vì sao)', 'Make all data public|||Công khai mọi dữ liệu', 'Turn off encryption|||Tắt mã hoá'], correctIndex: 1, explanation: 'Không thể bảo vệ thứ mình không biết là có — bắt đầu bằng kiểm kê (GDPR Điều 30).' },
]);

const c3 = doc('dpy391-3-1-encryption', '3.1 — Encryption to protect data|||3.1 — Mã hoá bảo vệ dữ liệu',
  'Mã hoá khi lưu (at rest) & khi truyền (in transit); đối xứng vs bất đối xứng; quản lý khoá; băm (hashing) vs mã hoá; tokenization.',
  [[
    `<span class="eyebrow">DPY391 · Chapter 3 · Lesson 3.1</span>
<h2>Encryption to protect data</h2>
<h3>At rest &amp; in transit</h3>
<ul>
<li><strong>At rest</strong> — data stored on disk/DB is encrypted (e.g. AES-256), so a stolen drive or backup is useless.</li>
<li><strong>In transit</strong> — data moving over the network is encrypted (TLS/HTTPS), so it cannot be read or tampered with in flight.</li>
</ul>
<h3>Symmetric vs asymmetric</h3>
<ul>
<li><strong>Symmetric</strong> (AES) — one shared key encrypts &amp; decrypts; fast, used for bulk data.</li>
<li><strong>Asymmetric</strong> (RSA, ECC) — a public key encrypts, a private key decrypts; used for key exchange &amp; signatures.</li>
</ul>
<h3>Key management</h3>
<p>Encryption is only as strong as key protection. Store keys separately from data (a <strong>KMS / HSM</strong>), rotate them, and never hard-code keys in source. This is the core of NIST SP 800-57.</p>
<h3>Hashing vs encryption vs tokenization</h3>
<ul>
<li><strong>Hashing</strong> (SHA-256, bcrypt) — one-way; used for passwords &amp; integrity. Cannot be reversed.</li>
<li><strong>Encryption</strong> — two-way with a key; used to protect data you must read back.</li>
<li><strong>Tokenization</strong> — replace sensitive values (a card number) with a meaningless token; the real value lives in a separate vault.</li>
</ul>
<pre><code>Password storage (correct):
  store  = bcrypt(password + salt)   // one-way hash
  verify = bcrypt.compare(input, stored)
  // NEVER store the plaintext password
</code></pre>
<div class="callout"><span class="badge">Pitfall</span> Encoding (Base64) is NOT encryption — it hides nothing. Hashing is not encryption either: you cannot decrypt a hash.</div>`,
    `<span class="eyebrow">DPY391 · Chương 3 · Bài 3.1</span>
<h2>Mã hoá bảo vệ dữ liệu</h2>
<h3>Khi lưu &amp; khi truyền</h3>
<ul>
<li><strong>Khi lưu (at rest)</strong> — dữ liệu trên đĩa/CSDL được mã hoá (vd AES-256), nên ổ cứng hay bản sao lưu bị trộm cũng vô dụng.</li>
<li><strong>Khi truyền (in transit)</strong> — dữ liệu đi trên mạng được mã hoá (TLS/HTTPS), không đọc hay sửa được giữa đường.</li>
</ul>
<h3>Đối xứng vs bất đối xứng</h3>
<ul>
<li><strong>Đối xứng</strong> (AES) — một khoá chung để mã &amp; giải; nhanh, dùng cho khối dữ liệu lớn.</li>
<li><strong>Bất đối xứng</strong> (RSA, ECC) — khoá công khai để mã, khoá riêng để giải; dùng trao đổi khoá &amp; chữ ký.</li>
</ul>
<h3>Quản lý khoá</h3>
<p>Mã hoá chỉ mạnh bằng cách bảo vệ khoá. Giữ khoá tách khỏi dữ liệu (một <strong>KMS / HSM</strong>), xoay khoá định kỳ, và không bao giờ nhúng khoá vào mã nguồn. Đây là lõi của NIST SP 800-57.</p>
<h3>Băm vs mã hoá vs tokenization</h3>
<ul>
<li><strong>Băm (hashing)</strong> (SHA-256, bcrypt) — một chiều; dùng cho mật khẩu &amp; toàn vẹn. Không đảo ngược được.</li>
<li><strong>Mã hoá</strong> — hai chiều bằng khoá; dùng bảo vệ dữ liệu cần đọc lại.</li>
<li><strong>Tokenization</strong> — thay giá trị nhạy cảm (số thẻ) bằng token vô nghĩa; giá trị thật nằm trong kho riêng.</li>
</ul>
<pre><code>Lưu mật khẩu (đúng):
  luu   = bcrypt(matkhau + salt)   // băm một chiều
  kiem  = bcrypt.compare(nhap, luu)
  // KHÔNG BAO GIỜ lưu mật khẩu dạng gốc
</code></pre>
<div class="callout"><span class="badge">Bẫy</span> Encoding (Base64) KHÔNG phải mã hoá — nó chẳng giấu gì. Băm cũng không phải mã hoá: bạn không "giải mã" được một giá trị băm.</div>`,
  ]]);

const c3q = quiz('dpy391-quiz-3', 'Quiz 3 — Encryption|||Quiz 3 — Mã hoá', [
  { id: 'q1', question: 'How should user passwords be stored?|||Nên lưu mật khẩu người dùng thế nào?', options: ['Plaintext|||Dạng gốc (plaintext)', 'One-way hash with salt (e.g. bcrypt)|||Băm một chiều có salt (vd bcrypt)', 'Base64 encoding|||Mã hoá Base64', 'In a cookie|||Trong cookie'], correctIndex: 1, explanation: 'Mật khẩu phải băm một chiều + salt, không bao giờ lưu gốc; băm không đảo ngược.' },
  { id: 'q2', question: 'What state of data does TLS/HTTPS protect?|||TLS/HTTPS bảo vệ dữ liệu ở trạng thái nào?', options: ['At rest|||Khi lưu (at rest)', 'In transit|||Khi truyền (in transit)', 'When printed on paper|||Khi in ra giấy', 'When deleted|||Khi xoá'], correctIndex: 1, explanation: 'TLS mã hoá dữ liệu khi truyền trên mạng.' },
  { id: 'q3', question: 'Why is key management important?|||Vì sao quản lý khoá quan trọng?', options: ['Because encryption is only as strong as key protection — keep keys separate from data, rotate them, never hard-code them|||Vì mã hoá chỉ mạnh bằng cách bảo vệ khoá — giữ khoá tách khỏi dữ liệu, xoay khoá, không nhúng vào mã', 'Because keys make data run faster|||Vì khoá làm dữ liệu chạy nhanh hơn', 'Because keys replace backups|||Vì khoá thay cho backup', 'Because keys are Base64|||Vì khoá là Base64'], correctIndex: 0, explanation: 'Khoá lộ thì mã hoá vô nghĩa; dùng KMS/HSM, xoay khoá (NIST SP 800-57).' },
]);

const c4 = doc('dpy391-4-1-access-control', '4.1 — Access control|||4.1 — Kiểm soát truy cập',
  'Kiểm soát truy cập; IAM (định danh, xác thực, uỷ quyền); nguyên tắc quyền tối thiểu; RBAC vs ABAC; MFA.',
  [[
    `<span class="eyebrow">DPY391 · Chapter 4 · Lesson 4.1</span>
<h2>Access control</h2>
<h3>IAM: three steps</h3>
<ul>
<li><strong>Identification</strong> — who claims to be here (a username).</li>
<li><strong>Authentication</strong> — prove it (password + MFA).</li>
<li><strong>Authorization</strong> — what they are allowed to do (permissions).</li>
</ul>
<p><strong>IAM (Identity &amp; Access Management)</strong> ties these together and logs them.</p>
<h3>Least privilege</h3>
<p>The <strong>principle of least privilege</strong>: every user and service gets the minimum access needed to do its job — and no more. It limits the blast radius when an account is compromised.</p>
<h3>RBAC vs ABAC</h3>
<ul>
<li><strong>RBAC (Role-Based)</strong> — permissions attach to <em>roles</em> (admin, editor, viewer); users get roles. Simple, common.</li>
<li><strong>ABAC (Attribute-Based)</strong> — access decided by <em>attributes</em> (department = HR AND time = business hours AND location = VN). Flexible, fine-grained.</li>
</ul>
<pre><code>RBAC example:
  role "editor"  -> can: read, write posts
  role "viewer"  -> can: read posts
  user Lan       -> role editor  => Lan can write
</code></pre>
<div class="callout"><span class="badge">Defense in depth</span> Add <strong>MFA</strong> (something you know + something you have) so a stolen password alone is not enough.</div>`,
    `<span class="eyebrow">DPY391 · Chương 4 · Bài 4.1</span>
<h2>Kiểm soát truy cập</h2>
<h3>IAM: ba bước</h3>
<ul>
<li><strong>Định danh (Identification)</strong> — ai đang xưng ở đây (tên đăng nhập).</li>
<li><strong>Xác thực (Authentication)</strong> — chứng minh điều đó (mật khẩu + MFA).</li>
<li><strong>Uỷ quyền (Authorization)</strong> — được phép làm gì (quyền hạn).</li>
</ul>
<p><strong>IAM (Quản lý định danh &amp; truy cập)</strong> gắn ba bước này lại và ghi log.</p>
<h3>Quyền tối thiểu</h3>
<p><strong>Nguyên tắc quyền tối thiểu (least privilege)</strong>: mỗi người dùng và dịch vụ chỉ được cấp mức truy cập tối thiểu để làm việc — không hơn. Nó thu hẹp thiệt hại khi một tài khoản bị chiếm.</p>
<h3>RBAC vs ABAC</h3>
<ul>
<li><strong>RBAC (theo Vai trò)</strong> — quyền gắn vào <em>vai trò</em> (admin, editor, viewer); người dùng nhận vai trò. Đơn giản, phổ biến.</li>
<li><strong>ABAC (theo Thuộc tính)</strong> — quyền quyết theo <em>thuộc tính</em> (phòng ban = HR VÀ giờ = hành chính VÀ vị trí = VN). Linh hoạt, chi tiết.</li>
</ul>
<pre><code>Ví dụ RBAC:
  vai tro "editor"  -> duoc: doc, ghi bai
  vai tro "viewer"  -> duoc: doc bai
  user Lan          -> vai tro editor  => Lan duoc ghi
</code></pre>
<div class="callout"><span class="badge">Phòng thủ nhiều lớp</span> Thêm <strong>MFA</strong> (thứ bạn biết + thứ bạn có) để một mật khẩu bị trộm thôi là chưa đủ.</div>`,
  ]]);

const c4q = quiz('dpy391-quiz-4', 'Quiz 4 — Access control|||Quiz 4 — Kiểm soát truy cập', [
  { id: 'q1', question: 'What does the principle of least privilege mean?|||Nguyên tắc quyền tối thiểu (least privilege) nghĩa là?', options: ['Grant everyone every permission for convenience|||Cấp mọi quyền cho mọi người cho tiện', 'Grant only the minimum access needed to do the job|||Chỉ cấp mức truy cập tối thiểu cần để làm việc', 'No one may access anything|||Không ai được truy cập gì', 'Only admins exist|||Chỉ admin tồn tại'], correctIndex: 1, explanation: 'Least privilege thu hẹp thiệt hại khi tài khoản bị chiếm.' },
  { id: 'q2', question: 'What is the difference between RBAC and ABAC?|||Khác biệt giữa RBAC và ABAC?', options: ['RBAC attaches permissions to roles; ABAC decides by attributes (department, time, location...)|||RBAC gắn quyền vào vai trò; ABAC quyết theo thuộc tính (phòng ban, giờ, vị trí...)', 'They are the same|||Hai cái giống hệt', 'ABAC does not use attributes|||ABAC không dùng thuộc tính', 'RBAC has no roles|||RBAC không có vai trò'], correctIndex: 0, explanation: 'RBAC = theo vai trò; ABAC = theo thuộc tính, chi tiết hơn.' },
  { id: 'q3', question: 'What are the three IAM steps in order?|||Ba bước của IAM theo thứ tự là?', options: ['Authorization → Authentication → Identification|||Uỷ quyền → Xác thực → Định danh', 'Identification → Authentication → Authorization|||Định danh → Xác thực → Uỷ quyền', 'Encrypt → Hash → Log|||Mã hoá → Băm → Log', 'Backup → Restore → Audit|||Backup → Restore → Audit'], correctIndex: 1, explanation: 'Định danh (ai) → Xác thực (chứng minh) → Uỷ quyền (được làm gì).' },
]);

const c5 = doc('dpy391-5-1-privacy-principles', '5.1 — Privacy principles &amp; GDPR|||5.1 — Nguyên tắc quyền riêng tư &amp; GDPR',
  'Nguyên tắc quyền riêng tư; GDPR (căn cứ hợp pháp, đồng thuận); tối thiểu hoá dữ liệu; giới hạn mục đích; giới hạn lưu trữ.',
  [[
    `<span class="eyebrow">DPY391 · Chapter 5 · Lesson 5.1</span>
<h2>Privacy principles &amp; GDPR</h2>
<h3>Core privacy principles (GDPR Art. 5)</h3>
<ul>
<li><strong>Lawfulness, fairness, transparency</strong> — process data legally and tell people about it.</li>
<li><strong>Purpose limitation</strong> — collect for a specific, stated purpose; do not reuse it for something else.</li>
<li><strong>Data minimization</strong> — collect only what is necessary.</li>
<li><strong>Accuracy</strong> — keep data correct and up to date.</li>
<li><strong>Storage limitation</strong> — keep it only as long as needed.</li>
<li><strong>Integrity &amp; confidentiality</strong> — secure it.</li>
<li><strong>Accountability</strong> — be able to prove all of the above.</li>
</ul>
<h3>Lawful basis &amp; consent</h3>
<p>GDPR requires a <strong>lawful basis</strong> to process personal data (Art. 6): consent, contract, legal obligation, vital interests, public task, or legitimate interests. Where <strong>consent</strong> is used it must be <em>freely given, specific, informed and unambiguous</em> — a pre-ticked box is not consent, and it must be as easy to withdraw as to give.</p>
<pre><code>Data minimization in practice:
  Sign-up form asks: email, password        (needed)
  NOT: date of birth, gender, phone         (not needed -> do not collect)
</code></pre>
<div class="callout"><span class="badge">Vietnam</span> NĐ 13/2023 mirrors these ideas: it requires consent (sự đồng ý) for most processing and defines the rights of the data subject (chủ thể dữ liệu).</div>`,
    `<span class="eyebrow">DPY391 · Chương 5 · Bài 5.1</span>
<h2>Nguyên tắc quyền riêng tư &amp; GDPR</h2>
<h3>Nguyên tắc cốt lõi (GDPR Điều 5)</h3>
<ul>
<li><strong>Hợp pháp, công bằng, minh bạch</strong> — xử lý dữ liệu đúng luật và cho người ta biết.</li>
<li><strong>Giới hạn mục đích</strong> — thu thập cho một mục đích cụ thể đã nêu; không dùng lại cho việc khác.</li>
<li><strong>Tối thiểu hoá dữ liệu</strong> — chỉ thu thập thứ cần thiết.</li>
<li><strong>Chính xác</strong> — giữ dữ liệu đúng và cập nhật.</li>
<li><strong>Giới hạn lưu trữ</strong> — chỉ giữ trong thời gian cần.</li>
<li><strong>Toàn vẹn &amp; bí mật</strong> — bảo vệ dữ liệu.</li>
<li><strong>Trách nhiệm giải trình</strong> — chứng minh được mọi điều trên.</li>
</ul>
<h3>Căn cứ hợp pháp &amp; đồng thuận</h3>
<p>GDPR đòi một <strong>căn cứ hợp pháp</strong> để xử lý dữ liệu cá nhân (Điều 6): đồng thuận, hợp đồng, nghĩa vụ pháp lý, lợi ích sống còn, nhiệm vụ công, hoặc lợi ích chính đáng. Khi dùng <strong>đồng thuận</strong>, nó phải <em>tự nguyện, cụ thể, được thông tin và rõ ràng</em> — ô tick sẵn không phải đồng thuận, và rút lại phải dễ như khi cho.</p>
<pre><code>Tối thiểu hoá trong thực tế:
  Form đăng ký hỏi: email, mật khẩu        (cần)
  KHÔNG: ngày sinh, giới tính, số điện thoại (không cần -> đừng thu thập)
</code></pre>
<div class="callout"><span class="badge">Việt Nam</span> NĐ 13/2023 phản ánh các ý này: yêu cầu sự đồng ý cho hầu hết việc xử lý và quy định quyền của chủ thể dữ liệu.</div>`,
  ]]);

const c5q = quiz('dpy391-quiz-5', 'Quiz 5 — Privacy principles|||Quiz 5 — Nguyên tắc quyền riêng tư', [
  { id: 'q1', question: 'What does data minimization mean?|||Nguyên tắc tối thiểu hoá dữ liệu (data minimization) là?', options: ['Collect as much data as possible|||Thu thập càng nhiều dữ liệu càng tốt', 'Collect only data that is truly necessary|||Chỉ thu thập dữ liệu thật sự cần thiết', 'Compress data to make it smaller|||Nén dữ liệu cho nhỏ lại', 'Delete all data|||Xoá toàn bộ dữ liệu'], correctIndex: 1, explanation: 'Chỉ thu thập thứ cần — ít dữ liệu, ít rủi ro.' },
  { id: 'q2', question: 'Under GDPR, valid consent must be?|||Theo GDPR, đồng thuận (consent) hợp lệ phải?', options: ['A pre-ticked box|||Dùng ô tick sẵn', 'Freely given, specific, informed, unambiguous and easy to withdraw|||Tự nguyện, cụ thể, được thông tin, rõ ràng và rút lại dễ dàng', 'Permanent and non-withdrawable|||Vĩnh viễn không rút được', 'Given by a third party|||Do bên thứ ba cấp'], correctIndex: 1, explanation: 'Consent phải tự nguyện, cụ thể, có thông tin, rõ ràng; ô tick sẵn không tính.' },
  { id: 'q3', question: 'What does purpose limitation mean?|||Giới hạn mục đích (purpose limitation) nghĩa là?', options: ['Use data for anything|||Dùng dữ liệu cho bất kỳ việc gì', 'Use data only for the specific stated purpose it was collected for|||Chỉ dùng dữ liệu cho mục đích cụ thể đã nêu khi thu thập', 'Limit the number of users|||Giới hạn số người dùng', 'Limit disk space|||Giới hạn dung lượng đĩa'], correctIndex: 1, explanation: 'Dữ liệu thu cho mục đích A không được tái sử dụng cho mục đích B khác.' },
]);

const c6 = doc('dpy391-6-1-privacy-by-design', '6.1 — Privacy by Design &amp; techniques|||6.1 — Privacy by Design &amp; kỹ thuật',
  'Privacy by Design (7 nguyên tắc); ẩn danh (anonymization) vs bút danh (pseudonymization); riêng tư vi phân (differential privacy).',
  [[
    `<span class="eyebrow">DPY391 · Chapter 6 · Lesson 6.1</span>
<h2>Privacy by Design &amp; techniques</h2>
<h3>Privacy by Design (PbD)</h3>
<p>Coined by Ann Cavoukian and written into <strong>GDPR Art. 25</strong> as "data protection by design and by default". Privacy is built into the system from the start, not added later. Key ideas: be <em>proactive not reactive</em>, make privacy the <em>default setting</em>, and keep it <em>end-to-end</em> across the lifecycle.</p>
<h3>Anonymization vs pseudonymization</h3>
<ul>
<li><strong>Pseudonymization</strong> — replace identifiers with a pseudonym (user_123); the link back exists but is kept separately. Still personal data under GDPR.</li>
<li><strong>Anonymization</strong> — remove identifiers so a person can no longer be re-identified. Truly anonymized data falls outside GDPR — but true anonymization is hard.</li>
</ul>
<h3>Differential privacy</h3>
<p><strong>Differential privacy</strong> adds carefully calibrated <em>noise</em> to results (or data) so that whether any single person is included makes almost no difference to the output. It lets you publish useful statistics while giving a mathematical guarantee about individual privacy — used by Apple and the US Census.</p>
<pre><code>Re-identification risk:
  "anonymous" = age + ZIP + gender
  -> studies show this triple identifies most people uniquely!
  -> real anonymization must generalize / suppress such quasi-identifiers
</code></pre>
<div class="callout"><span class="badge">Lesson</span> Removing the name is not anonymization. Quasi-identifiers can re-identify people — design for it.</div>`,
    `<span class="eyebrow">DPY391 · Chương 6 · Bài 6.1</span>
<h2>Privacy by Design &amp; kỹ thuật</h2>
<h3>Privacy by Design (PbD)</h3>
<p>Do Ann Cavoukian đề xướng và được ghi vào <strong>GDPR Điều 25</strong> là "bảo vệ dữ liệu ngay từ thiết kế và theo mặc định". Quyền riêng tư được dựng vào hệ thống ngay từ đầu, không phải thêm sau. Ý chính: <em>chủ động chứ không đối phó</em>, để quyền riêng tư là <em>thiết lập mặc định</em>, và giữ nó <em>xuyên suốt</em> cả vòng đời.</p>
<h3>Ẩn danh vs bút danh</h3>
<ul>
<li><strong>Bút danh hoá (pseudonymization)</strong> — thay định danh bằng bút danh (user_123); liên kết ngược vẫn tồn tại nhưng giữ riêng. Vẫn là dữ liệu cá nhân theo GDPR.</li>
<li><strong>Ẩn danh hoá (anonymization)</strong> — bỏ định danh để không còn tái nhận diện được một người. Dữ liệu ẩn danh thật sự nằm ngoài GDPR — nhưng ẩn danh thật rất khó.</li>
</ul>
<h3>Riêng tư vi phân (differential privacy)</h3>
<p><strong>Riêng tư vi phân</strong> thêm <em>nhiễu</em> được cân chỉnh vào kết quả (hoặc dữ liệu) sao cho việc một người có mặt hay không gần như không đổi đầu ra. Nó cho phép công bố thống kê hữu ích mà vẫn có bảo đảm toán học về quyền riêng tư cá nhân — Apple và Điều tra dân số Mỹ đang dùng.</p>
<pre><code>Rủi ro tái nhận diện:
  "ẩn danh" = tuổi + mã bưu chính + giới tính
  -> nghiên cứu cho thấy bộ ba này nhận diện DUY NHẤT phần lớn người!
  -> ẩn danh thật phải tổng quát hoá / che các định danh gần (quasi-identifier)
</code></pre>
<div class="callout"><span class="badge">Bài học</span> Bỏ tên không phải là ẩn danh. Định danh gần vẫn tái nhận diện được người — hãy thiết kế để chống điều đó.</div>`,
  ]]);

const c6q = quiz('dpy391-quiz-6', 'Quiz 6 — Privacy by Design|||Quiz 6 — Privacy by Design', [
  { id: 'q1', question: 'What does Privacy by Design mean?|||Privacy by Design nghĩa là?', options: ['Add privacy after the system is finished|||Thêm quyền riêng tư sau khi hệ thống xong', 'Build privacy into the system from the start, on by default|||Dựng quyền riêng tư vào hệ thống ngay từ thiết kế, mặc định bật', 'It applies only to the home page|||Chỉ áp dụng cho trang chủ', 'It is just marketing material|||Chỉ là tài liệu marketing'], correctIndex: 1, explanation: 'PbD (GDPR Điều 25): quyền riêng tư ngay từ thiết kế và theo mặc định.' },
  { id: 'q2', question: 'Difference between anonymization and pseudonymization?|||Khác biệt giữa ẩn danh và bút danh?', options: ['They are exactly the same|||Giống nhau hoàn toàn', 'Pseudonymization keeps a re-link (still personal data); true anonymization cannot be re-identified|||Bút danh vẫn có liên kết ngược (vẫn là dữ liệu cá nhân); ẩn danh thật thì không tái nhận diện được', 'Anonymization is easier than pseudonymization|||Ẩn danh dễ hơn bút danh', 'Pseudonymization falls outside GDPR|||Bút danh nằm ngoài GDPR'], correctIndex: 1, explanation: 'Pseudonymization còn liên kết ngược nên vẫn là PII; anonymization thật loại bỏ khả năng tái nhận diện.' },
  { id: 'q3', question: 'How does differential privacy work?|||Riêng tư vi phân (differential privacy) hoạt động bằng cách?', options: ['Deleting all data|||Xoá toàn bộ dữ liệu', 'Adding calibrated noise so one individual presence barely changes the result|||Thêm nhiễu cân chỉnh để sự có mặt của một cá nhân gần như không đổi kết quả', 'Encrypting with AES|||Mã hoá bằng AES', 'Compressing data|||Nén dữ liệu'], correctIndex: 1, explanation: 'Thêm nhiễu để cho bảo đảm toán học về riêng tư cá nhân khi công bố thống kê.' },
]);

const c7 = doc('dpy391-7-1-compliance-law', '7.1 — Compliance &amp; law|||7.1 — Tuân thủ &amp; pháp lý',
  'GDPR & CCPA; NĐ 13/2023 VN; ISO/IEC 27701 (PIMS); DPIA (đánh giá tác động); quyền của chủ thể dữ liệu.',
  [[
    `<span class="eyebrow">DPY391 · Chapter 7 · Lesson 7.1</span>
<h2>Compliance &amp; law</h2>
<h3>The major laws</h3>
<ul>
<li><strong>GDPR</strong> (EU) — the global benchmark; fines up to 4% of worldwide turnover.</li>
<li><strong>CCPA/CPRA</strong> (California) — rights to know, delete and opt out of sale.</li>
<li><strong>NĐ 13/2023/NĐ-CP</strong> (Việt Nam) — Nghị định Bảo vệ dữ liệu cá nhân: requires consent, defines sensitive personal data, data-subject rights, and cross-border transfer rules (hồ sơ đánh giá tác động chuyển dữ liệu ra nước ngoài).</li>
</ul>
<h3>Data-subject rights</h3>
<p>Modern laws give people rights over their data: <strong>access</strong> (see it), <strong>rectification</strong> (fix it), <strong>erasure</strong> ("right to be forgotten"), <strong>portability</strong> (take it elsewhere), and <strong>objection</strong>. Your system must be able to find and act on one person's data on request.</p>
<h3>ISO/IEC 27701 &amp; DPIA</h3>
<ul>
<li><strong>ISO/IEC 27701</strong> — extends ISO 27001 into a <strong>Privacy Information Management System (PIMS)</strong>; certification shows an organization manages privacy systematically.</li>
<li><strong>DPIA (Data Protection Impact Assessment)</strong> — required (GDPR Art. 35) before high-risk processing: describe the processing, assess risks to people, and record mitigations.</li>
</ul>
<div class="callout"><span class="badge">Practical</span> Build a "delete my account" flow and a data-export feature early — data-subject rights are not optional, and retrofitting them is painful.</div>`,
    `<span class="eyebrow">DPY391 · Chương 7 · Bài 7.1</span>
<h2>Tuân thủ &amp; pháp lý</h2>
<h3>Các luật lớn</h3>
<ul>
<li><strong>GDPR</strong> (EU) — chuẩn mực toàn cầu; phạt tới 4% doanh thu toàn cầu.</li>
<li><strong>CCPA/CPRA</strong> (California) — quyền được biết, xoá và từ chối bán dữ liệu.</li>
<li><strong>NĐ 13/2023/NĐ-CP</strong> (Việt Nam) — Nghị định Bảo vệ dữ liệu cá nhân: yêu cầu đồng ý, định nghĩa dữ liệu cá nhân nhạy cảm, quyền chủ thể dữ liệu, và quy tắc chuyển dữ liệu xuyên biên giới (hồ sơ đánh giá tác động chuyển dữ liệu ra nước ngoài).</li>
</ul>
<h3>Quyền của chủ thể dữ liệu</h3>
<p>Luật hiện đại trao cho người dân quyền với dữ liệu của mình: <strong>truy cập</strong> (xem), <strong>chỉnh sửa</strong> (sửa), <strong>xoá</strong> ("quyền được lãng quên"), <strong>di chuyển dữ liệu</strong> (mang đi nơi khác), và <strong>phản đối</strong>. Hệ thống của bạn phải tìm và xử lý được dữ liệu của một cá nhân khi có yêu cầu.</p>
<h3>ISO/IEC 27701 &amp; DPIA</h3>
<ul>
<li><strong>ISO/IEC 27701</strong> — mở rộng ISO 27001 thành <strong>Hệ quản lý thông tin quyền riêng tư (PIMS)</strong>; chứng nhận cho thấy tổ chức quản lý quyền riêng tư một cách hệ thống.</li>
<li><strong>DPIA (Đánh giá tác động bảo vệ dữ liệu)</strong> — bắt buộc (GDPR Điều 35) trước khi xử lý rủi ro cao: mô tả việc xử lý, đánh giá rủi ro với con người, và ghi lại biện pháp giảm thiểu.</li>
</ul>
<div class="callout"><span class="badge">Thực tế</span> Hãy dựng luồng "xoá tài khoản" và tính năng xuất dữ liệu từ sớm — quyền chủ thể dữ liệu là bắt buộc, và lắp thêm về sau rất cực.</div>`,
  ]]);

const c7q = quiz('dpy391-quiz-7', 'Quiz 7 — Compliance &amp; law|||Quiz 7 — Tuân thủ &amp; pháp lý', [
  { id: 'q1', question: 'Which Vietnamese decree governs personal data protection?|||Nghị định nào của Việt Nam về bảo vệ dữ liệu cá nhân?', options: ['NĐ 13/2023/NĐ-CP|||NĐ 13/2023/NĐ-CP', 'GDPR (EU)|||GDPR (EU)', 'CCPA (California)|||CCPA (California)', 'ISO 9001|||ISO 9001'], correctIndex: 0, explanation: 'NĐ 13/2023/NĐ-CP là Nghị định Bảo vệ dữ liệu cá nhân của Việt Nam.' },
  { id: 'q2', question: 'When is a DPIA used?|||DPIA (Đánh giá tác động bảo vệ dữ liệu) dùng khi nào?', options: ['After a breach has happened|||Sau khi rò rỉ đã xảy ra', 'Before high-risk data processing (GDPR Art. 35)|||Trước khi thực hiện việc xử lý dữ liệu rủi ro cao (GDPR Điều 35)', 'Only during financial audits|||Chỉ khi kiểm toán tài chính', 'Never required|||Không bao giờ bắt buộc'], correctIndex: 1, explanation: 'DPIA làm TRƯỚC hoạt động xử lý rủi ro cao để đánh giá và giảm thiểu rủi ro.' },
  { id: 'q3', question: 'The right to be forgotten is which data-subject right?|||Quyền được lãng quên là quyền nào của chủ thể dữ liệu?', options: ['Right to access|||Quyền truy cập', 'Right to erasure|||Quyền xoá (erasure)', 'Right to portability|||Quyền di chuyển dữ liệu', 'Right to object|||Quyền phản đối'], correctIndex: 1, explanation: 'Right to be forgotten = quyền yêu cầu xoá dữ liệu cá nhân.' },
]);

const c8 = doc('dpy391-8-1-incident-governance', '8.1 — Incident response &amp; governance|||8.1 — Sự cố &amp; quản trị',
  'Ứng phó rò rỉ dữ liệu (phát hiện→cô lập→thông báo); nghĩa vụ thông báo 72h; DLP; kiểm toán (audit); đạo đức dữ liệu.',
  [[
    `<span class="eyebrow">DPY391 · Chapter 8 · Lesson 8.1</span>
<h2>Incident response &amp; governance</h2>
<h3>Data breach response</h3>
<pre><code>1 Detect   -> monitoring/alerts catch the incident
2 Contain  -> stop the bleeding (revoke keys, isolate systems)
3 Assess   -> what data, whose, how much
4 Notify   -> regulator &amp; affected people
5 Recover  -> restore, patch the root cause
6 Learn    -> post-mortem, update controls
</code></pre>
<p>Under <strong>GDPR Art. 33</strong>, a controller must notify the supervisory authority of a breach <strong>within 72 hours</strong> of becoming aware, unless it is unlikely to risk people's rights. NĐ 13/2023 has its own notification duties.</p>
<h3>DLP &amp; auditing</h3>
<ul>
<li><strong>DLP (Data Loss Prevention)</strong> — tools that detect and block sensitive data leaving the organization (e.g. an email with card numbers).</li>
<li><strong>Auditing / logging</strong> — record who accessed what and when, so misuse is detectable and provable. Logs themselves must be protected and must not leak PII.</li>
</ul>
<h3>Data ethics</h3>
<p>Compliance is the floor, not the ceiling. <strong>Data ethics</strong> asks whether a use is <em>right</em>, not just legal: avoid dark patterns, biased models, and surveillance that betrays user trust. An engineer's duty of care extends beyond the letter of the law.</p>
<div class="callout"><span class="badge">Golden rule</span> Handle other people's data the way you would want yours handled. Legal + secure + ethical — all three.</div>`,
    `<span class="eyebrow">DPY391 · Chương 8 · Bài 8.1</span>
<h2>Sự cố &amp; quản trị</h2>
<h3>Ứng phó rò rỉ dữ liệu</h3>
<pre><code>1 Phat hien -> giam sat/canh bao bat duoc su co
2 Co lap    -> chan lan rong (thu hoi khoa, cach ly he thong)
3 Danh gia  -> du lieu gi, cua ai, bao nhieu
4 Thong bao -> co quan quan ly &amp; nguoi bi anh huong
5 Khoi phuc -> phuc hoi, va nguyen nhan goc
6 Rut kinh nghiem -> hop mo xe, cap nhat kiem soat
</code></pre>
<p>Theo <strong>GDPR Điều 33</strong>, bên kiểm soát phải thông báo cho cơ quan giám sát về vụ rò rỉ <strong>trong 72 giờ</strong> kể từ khi biết, trừ khi khó gây rủi ro cho quyền của người dân. NĐ 13/2023 có nghĩa vụ thông báo riêng của mình.</p>
<h3>DLP &amp; kiểm toán</h3>
<ul>
<li><strong>DLP (Ngăn thất thoát dữ liệu)</strong> — công cụ phát hiện và chặn dữ liệu nhạy cảm rời khỏi tổ chức (vd email chứa số thẻ).</li>
<li><strong>Kiểm toán / ghi log</strong> — ghi ai truy cập gì, khi nào, để lạm dụng bị phát hiện và chứng minh được. Bản thân log phải được bảo vệ và không được lộ PII.</li>
</ul>
<h3>Đạo đức dữ liệu</h3>
<p>Tuân thủ là mức sàn, không phải trần. <strong>Đạo đức dữ liệu</strong> hỏi một cách dùng có <em>đúng đắn</em> không, chứ không chỉ hợp pháp: tránh dark pattern, mô hình thiên lệch, và giám sát phản bội niềm tin người dùng. Trách nhiệm của kỹ sư vượt ra ngoài câu chữ của luật.</p>
<div class="callout"><span class="badge">Quy tắc vàng</span> Hãy xử lý dữ liệu của người khác như cách bạn muốn dữ liệu của mình được xử lý. Hợp pháp + an toàn + đạo đức — đủ cả ba.</div>`,
  ]]);

const c8q = quiz('dpy391-quiz-8', 'Quiz 8 — Incident &amp; governance|||Quiz 8 — Sự cố &amp; quản trị', [
  { id: 'q1', question: 'Under GDPR Art. 33, how soon must a breach be reported to the authority?|||Theo GDPR Điều 33, phải thông báo cơ quan giám sát về vụ rò rỉ trong bao lâu?', options: ['Within 72 hours of becoming aware|||Trong 72 giờ kể từ khi biết', 'Within 1 year|||Trong 1 năm', 'No notification needed|||Không cần thông báo', 'Only if sued|||Chỉ khi bị kiện'], correctIndex: 0, explanation: 'GDPR yêu cầu thông báo trong vòng 72 giờ khi bên kiểm soát biết về vụ rò rỉ.' },
  { id: 'q2', question: 'What does DLP (Data Loss Prevention) do?|||DLP (Data Loss Prevention) làm gì?', options: ['Encrypt disks|||Mã hoá ổ đĩa', 'Detect and block sensitive data leaving the organization|||Phát hiện và chặn dữ liệu nhạy cảm rời khỏi tổ chức', 'Create passwords|||Tạo mật khẩu', 'Compress backup files|||Nén file backup'], correctIndex: 1, explanation: 'DLP ngăn dữ liệu nhạy cảm thất thoát ra ngoài (vd email chứa số thẻ).' },
  { id: 'q3', question: 'Why does data ethics matter beyond legal compliance?|||Vì sao đạo đức dữ liệu quan trọng ngoài việc tuân thủ luật?', options: ['Because laws do not exist|||Vì luật không tồn tại', 'Because compliance is the floor — doing right (avoiding dark patterns, bias, surveillance) goes beyond the letter of the law|||Vì tuân thủ là mức sàn — đúng đắn (tránh dark pattern, thiên lệch, giám sát) vượt ngoài câu chữ luật', 'Because ethics replaces encryption|||Vì đạo đức thay cho mã hoá', 'Because ethics makes systems faster|||Vì đạo đức làm hệ thống nhanh hơn'], correctIndex: 1, explanation: 'Hợp pháp là tối thiểu; đạo đức hỏi việc dùng dữ liệu có đúng đắn không.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'DPY391',
    slug: 'dpy391-data-security-and-privacy',
    title: 'Data Security and Privacy',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DPY391.webp',
    shortDescription: 'Protecting data & privacy: CIA & PII, data lifecycle, encryption & key management, access control (RBAC/ABAC), GDPR, Privacy by Design, anonymization, compliance (NĐ 13/2023, ISO 27701, DPIA) & breach response. Bilingual.|||Bảo mật & quyền riêng tư dữ liệu: CIA & PII, vòng đời dữ liệu, mã hoá & quản lý khoá, kiểm soát truy cập (RBAC/ABAC), GDPR, Privacy by Design, ẩn danh, tuân thủ (NĐ 13/2023, ISO 27701, DPIA) & xử lý sự cố. Song ngữ.',
    description: 'Môn <strong>DPY391 — Data Security and Privacy</strong> (Khoa học Máy tính, kỳ 5) dạy cách <strong>bảo vệ dữ liệu</strong> và <strong>tôn trọng quyền riêng tư</strong>. Từ <strong>nền tảng</strong> (bảo mật vs quyền riêng tư, CIA, PII) → <strong>vòng đời &amp; phân loại dữ liệu</strong> → <strong>mã hoá &amp; quản lý khoá</strong> → <strong>kiểm soát truy cập</strong> (RBAC/ABAC, quyền tối thiểu) → <strong>nguyên tắc quyền riêng tư &amp; GDPR</strong> → <strong>Privacy by Design</strong> → <strong>tuân thủ &amp; pháp lý</strong> (GDPR, NĐ 13/2023, ISO 27701, DPIA) → <strong>sự cố &amp; quản trị</strong>. Song ngữ, bám chuẩn quốc tế và luật VN, có kỹ thuật, điều luật, ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Bảo mật vs quyền riêng tư, bộ ba CIA, PII &amp; dữ liệu nhạy cảm; vòng đời &amp; phân loại dữ liệu, data governance; mã hoá at rest/in transit, đối xứng/bất đối xứng, quản lý khoá, băm, tokenization; IAM, quyền tối thiểu, RBAC/ABAC, MFA; nguyên tắc GDPR, đồng thuận, tối thiểu hoá, giới hạn mục đích; Privacy by Design, ẩn danh/bút danh, riêng tư vi phân; GDPR/CCPA/NĐ 13/2023, ISO 27701, DPIA, quyền chủ thể dữ liệu; ứng phó rò rỉ, DLP, kiểm toán, đạo đức dữ liệu.',
    requirements: 'Kiến thức lập trình &amp; hệ thống thông tin cơ bản. Không bắt buộc nền mật mã học sâu — các khái niệm mã hoá được giải thích từ đầu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, luật & chuẩn (GDPR, NIST, ISO 27701, NĐ 13/2023), sách, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Bảo mật vs quyền riêng tư, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Bảo mật & quyền riêng tư|||Chapter 1 — Security & privacy', description: 'Security vs privacy, CIA, PII.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vòng đời & phân loại|||Chapter 2 — Lifecycle & classification', description: 'Data lifecycle, classification, governance.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mã hoá bảo vệ dữ liệu|||Chapter 3 — Encryption', description: 'At rest/in transit, khoá, băm, tokenization.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Kiểm soát truy cập|||Chapter 4 — Access control', description: 'IAM, least privilege, RBAC/ABAC, MFA.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nguyên tắc quyền riêng tư|||Chapter 5 — Privacy principles', description: 'GDPR, consent, tối thiểu hoá, giới hạn mục đích.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Privacy by Design|||Chapter 6 — Privacy by Design', description: 'PbD, ẩn danh/bút danh, riêng tư vi phân.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tuân thủ & pháp lý|||Chapter 7 — Compliance & law', description: 'GDPR/CCPA, NĐ 13/2023, ISO 27701, DPIA, quyền chủ thể.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Sự cố & quản trị|||Chapter 8 — Incident & governance', description: 'Breach response, DLP, audit, đạo đức dữ liệu.', lessons: [c8, c8q] },
  ],
};
