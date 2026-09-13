/**
 * SPM401 — Security Project Management (Quản lý dự án An toàn thông tin).
 * Ngành Khoa học Máy tính, kỳ 7 (FPTU). Song ngữ VI+EN + quiz mỗi chương.
 * Giáo trình: PMI PMBOK Guide; Whitman/Mattord "Management of Information
 * Security"; ISO 21500; NIST SP 800-37 (RMF); Schwalbe "IT Project Management".
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('spm401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (PMBOK, Whitman/Mattord, Schwalbe), chuẩn ISO 21500 & NIST SP 800-37, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">SPM401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Security Project Management</strong> — running an information-security project from charter to closure — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are legal, mostly-free references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for SPM401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books &amp; standards</h3>
<ul>
<li><a href="https://www.pmi.org/pmbok-guide-standards" target="_blank" rel="noopener">PMI — <em>A Guide to the Project Management Body of Knowledge (PMBOK Guide)</em></a></li>
<li>Whitman &amp; Mattord — <em>Management of Information Security</em> (Cengage)</li>
<li>Kathy Schwalbe — <em>Information Technology Project Management</em></li>
<li><a href="https://www.iso.org/standard/74947.html" target="_blank" rel="noopener">ISO 21500 — Guidance on project management</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://csrc.nist.gov/pubs/sp/800/37/r2/final" target="_blank" rel="noopener">NIST SP 800-37 Rev.2 — Risk Management Framework (RMF)</a></li>
<li><a href="https://www.iso.org/isoiec-27001-information-security.html" target="_blank" rel="noopener">ISO/IEC 27001 — Information security management</a></li>
<li><a href="https://www.pmi.org/" target="_blank" rel="noopener">Project Management Institute (PMI)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Praizion" target="_blank" rel="noopener">Praizion</a> — PMP / PMBOK concepts explained</li>
<li><a href="https://www.youtube.com/@AgileForGrowth" target="_blank" rel="noopener">Agile for Growth</a> — Scrum &amp; Agile fundamentals</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener">Jira</a> — backlog, sprints &amp; issue tracking</li>
<li><a href="https://www.microsoft.com/microsoft-365/project/project-management-software" target="_blank" rel="noopener">Microsoft Project</a> — schedule, WBS &amp; Gantt</li>
<li><a href="https://www.gantt.com/" target="_blank" rel="noopener">Gantt.com</a> — Gantt chart basics</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the project life cycle, five process groups, charter, scope, WBS and the triple constraint (scope-time-cost).</li>
<li><strong>Practice</strong> — draft a charter and a WBS for a small security project (e.g. rolling out MFA), then build a schedule and risk register.</li>
<li><strong>Go deeper</strong> — quantitative risk, earned value, procurement, RMF/ISO 27001 compliance woven into the project.</li>
<li><strong>Job-ready</strong> — run a project in Jira, report status with EVM, and close with a lessons-learned review.</li>
</ol></div>`,
    `<span class="eyebrow">SPM401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản lý dự án An toàn thông tin</strong> — điều hành một dự án bảo mật từ charter tới kết thúc — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn hợp pháp, phần lớn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SPM401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo &amp; chuẩn</h3>
<ul>
<li><a href="https://www.pmi.org/pmbok-guide-standards" target="_blank" rel="noopener">PMI — <em>Cẩm nang Kiến thức Quản lý Dự án (PMBOK Guide)</em></a></li>
<li>Whitman &amp; Mattord — <em>Management of Information Security</em> (Cengage)</li>
<li>Kathy Schwalbe — <em>Information Technology Project Management</em></li>
<li><a href="https://www.iso.org/standard/74947.html" target="_blank" rel="noopener">ISO 21500 — Hướng dẫn quản lý dự án</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://csrc.nist.gov/pubs/sp/800/37/r2/final" target="_blank" rel="noopener">NIST SP 800-37 Rev.2 — Khung Quản lý Rủi ro (RMF)</a></li>
<li><a href="https://www.iso.org/isoiec-27001-information-security.html" target="_blank" rel="noopener">ISO/IEC 27001 — Quản lý an toàn thông tin</a></li>
<li><a href="https://www.pmi.org/" target="_blank" rel="noopener">Viện Quản lý Dự án (PMI)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Praizion" target="_blank" rel="noopener">Praizion</a> — khái niệm PMP / PMBOK</li>
<li><a href="https://www.youtube.com/@AgileForGrowth" target="_blank" rel="noopener">Agile for Growth</a> — nền tảng Scrum &amp; Agile</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.atlassian.com/software/jira" target="_blank" rel="noopener">Jira</a> — backlog, sprint &amp; theo dõi công việc</li>
<li><a href="https://www.microsoft.com/microsoft-365/project/project-management-software" target="_blank" rel="noopener">Microsoft Project</a> — lịch trình, WBS &amp; Gantt</li>
<li><a href="https://www.gantt.com/" target="_blank" rel="noopener">Gantt.com</a> — nhập môn biểu đồ Gantt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vòng đời dự án, năm nhóm quy trình, charter, phạm vi, WBS và ràng buộc ba (phạm vi-thời gian-chi phí).</li>
<li><strong>Luyện tập</strong> — soạn charter và WBS cho một dự án bảo mật nhỏ (vd triển khai MFA), rồi dựng lịch trình và sổ rủi ro.</li>
<li><strong>Đào sâu</strong> — rủi ro định lượng, giá trị thu được (EVM), mua sắm, tuân thủ RMF/ISO 27001 lồng trong dự án.</li>
<li><strong>Sẵn sàng đi làm</strong> — chạy dự án trên Jira, báo cáo trạng thái bằng EVM, kết thúc bằng buổi rút kinh nghiệm.</li>
</ol></div>`,
  ]]);

const intro = doc('spm401-0-1-overview', 'Course overview: Security Project Management|||Tổng quan: Quản lý dự án An toàn thông tin',
  'Dự án là gì; vì sao dự án an ninh cần quản lý riêng; ràng buộc ba (phạm vi/thời gian/chi phí); lộ trình 8 chương: vòng đời → khởi tạo → kế hoạch → rủi ro → nguồn lực/chi phí → thực thi/chất lượng → giám sát/tuân thủ → kết thúc/Agile.',
  [[
    `<span class="eyebrow">SPM401 · Lesson 0.1 · Overview</span>
<h2>Security Project Management</h2>
<p class="lead">This course teaches you to <strong>plan, run and close an information-security project</strong> — deploying MFA, building a SOC, achieving ISO 27001 certification — using proven project-management discipline (PMBOK, ISO 21500) adapted to the realities of security work.</p>
<h3>What is a project?</h3>
<p>A <strong>project</strong> is a temporary effort with a defined start and end that creates a unique product or result — unlike <em>operations</em>, which are ongoing. "Roll out disk encryption to 500 laptops by Q3" is a project; "run the help desk" is operations.</p>
<h3>The triple constraint</h3>
<p>Every project balances three competing forces — change one and the others move:</p>
<ul>
<li><strong>Scope</strong> — what will be delivered.</li>
<li><strong>Time</strong> — the schedule / deadline.</li>
<li><strong>Cost</strong> — the budget &amp; resources.</li>
</ul>
<p>Quality sits in the middle. Security projects add a fourth pressure: <strong>risk &amp; compliance</strong> are the whole point, not an afterthought.</p>
<h3>Roadmap</h3>
<p>Life cycle &amp; process groups → initiating (charter, stakeholders) → planning (WBS, schedule, estimates) → risk → resources, cost &amp; procurement → executing &amp; quality/safety → monitoring, change control &amp; compliance (RMF/ISO 27001) → closing, lessons learned &amp; Agile/Scrum. Bilingual, with a quiz each chapter.</p>`,
    `<span class="eyebrow">SPM401 · Bài 0.1 · Tổng quan</span>
<h2>Quản lý dự án An toàn thông tin</h2>
<p class="lead">Môn này dạy bạn <strong>lập kế hoạch, điều hành và kết thúc một dự án an toàn thông tin</strong> — triển khai MFA, dựng SOC, đạt chứng nhận ISO 27001 — bằng kỷ luật quản lý dự án đã được kiểm chứng (PMBOK, ISO 21500), chỉnh cho phù hợp thực tế công việc bảo mật.</p>
<h3>Dự án là gì?</h3>
<p>Một <strong>dự án</strong> là nỗ lực tạm thời, có mốc bắt đầu và kết thúc rõ ràng, tạo ra một sản phẩm hoặc kết quả duy nhất — khác với <em>vận hành</em> vốn diễn ra liên tục. "Triển khai mã hoá ổ đĩa cho 500 máy trước Q3" là dự án; "trực bàn hỗ trợ" là vận hành.</p>
<h3>Ràng buộc ba</h3>
<p>Mọi dự án cân bằng ba lực cạnh tranh — đổi một cái là hai cái kia dịch chuyển:</p>
<ul>
<li><strong>Phạm vi (Scope)</strong> — sẽ bàn giao những gì.</li>
<li><strong>Thời gian (Time)</strong> — lịch trình / hạn chót.</li>
<li><strong>Chi phí (Cost)</strong> — ngân sách &amp; nguồn lực.</li>
</ul>
<p>Chất lượng nằm ở giữa. Dự án bảo mật có thêm áp lực thứ tư: <strong>rủi ro &amp; tuân thủ</strong> chính là mục đích, không phải chuyện tính sau.</p>
<h3>Lộ trình</h3>
<p>Vòng đời &amp; nhóm quy trình → khởi tạo (charter, bên liên quan) → lập kế hoạch (WBS, lịch trình, ước lượng) → rủi ro → nguồn lực, chi phí &amp; mua sắm → thực thi &amp; chất lượng/an toàn → giám sát, kiểm soát thay đổi &amp; tuân thủ (RMF/ISO 27001) → kết thúc, bài học &amp; Agile/Scrum. Song ngữ, mỗi chương một quiz.</p>`,
  ]]);

const c1 = doc('spm401-1-1-lifecycle', '1.1 — Project management &amp; the security project life cycle|||1.1 — Quản lý dự án &amp; vòng đời dự án an ninh',
  'Quản lý dự án là gì; vai trò PM; năm nhóm quy trình PMBOK (khởi tạo→lập kế hoạch→thực thi→giám sát→kết thúc); vòng đời dự đoán (waterfall) vs thích ứng (agile); đặc thù dự án an ninh.',
  [[
    `<span class="eyebrow">SPM401 · Chapter 1 · Lesson 1.1</span>
<h2>Project management &amp; the security project life cycle</h2>
<p>Project management is <strong>applying knowledge, skills, tools and techniques to project activities to meet requirements</strong>. The <strong>project manager (PM)</strong> is accountable for delivering scope, on time, on budget, at the right quality — and for security projects, at the required risk posture.</p>
<h3>The five PMBOK process groups</h3>
<pre><code>Initiating   -> authorise the project, appoint PM, identify stakeholders
Planning     -> scope, schedule, cost, risk, quality, resources
Executing    -> do the work, coordinate people & vendors
Monitoring   -> measure progress, control change, report status
Closing      -> hand over, release resources, capture lessons
</code></pre>
<p>These groups are not phases done once — on a large project they <em>repeat</em> every phase.</p>
<h3>Predictive vs adaptive life cycle</h3>
<ul>
<li><strong>Predictive (waterfall)</strong> — scope fixed up front; good for well-understood work like a compliance audit or a firewall migration.</li>
<li><strong>Adaptive (agile)</strong> — scope evolves in short iterations; good for uncertain work like building a new detection platform.</li>
</ul>
<div class="callout"><span class="badge">Security is different</span> A security project's success is measured partly by <strong>reduced risk and demonstrated compliance</strong>, not only by shipping a deliverable — so risk management runs through every phase.</div>`,
    `<span class="eyebrow">SPM401 · Chương 1 · Bài 1.1</span>
<h2>Quản lý dự án &amp; vòng đời dự án an ninh</h2>
<p>Quản lý dự án là <strong>vận dụng kiến thức, kỹ năng, công cụ và kỹ thuật vào hoạt động dự án để đáp ứng yêu cầu</strong>. <strong>Quản lý dự án (PM)</strong> chịu trách nhiệm bàn giao đúng phạm vi, đúng hạn, đúng ngân sách, đúng chất lượng — và với dự án bảo mật, đúng mức độ rủi ro yêu cầu.</p>
<h3>Năm nhóm quy trình PMBOK</h3>
<pre><code>Khởi tạo   -> phê duyệt dự án, chỉ định PM, nhận diện bên liên quan
Lập kế hoạch -> phạm vi, lịch trình, chi phí, rủi ro, chất lượng, nguồn lực
Thực thi   -> làm việc, điều phối con người & nhà cung cấp
Giám sát   -> đo tiến độ, kiểm soát thay đổi, báo cáo trạng thái
Kết thúc   -> bàn giao, giải phóng nguồn lực, ghi lại bài học
</code></pre>
<p>Các nhóm này không phải làm một lần rồi thôi — ở dự án lớn chúng <em>lặp lại</em> ở mỗi giai đoạn.</p>
<h3>Vòng đời dự đoán vs thích ứng</h3>
<ul>
<li><strong>Dự đoán (waterfall)</strong> — phạm vi cố định từ đầu; hợp với việc đã hiểu rõ như một cuộc kiểm toán tuân thủ hay di dời tường lửa.</li>
<li><strong>Thích ứng (agile)</strong> — phạm vi tiến hoá theo các vòng lặp ngắn; hợp với việc còn nhiều bất định như xây nền tảng phát hiện mới.</li>
</ul>
<div class="callout"><span class="badge">Dự án bảo mật khác biệt</span> Thành công của dự án bảo mật đo một phần bằng <strong>rủi ro giảm và tuân thủ chứng minh được</strong>, không chỉ bằng việc bàn giao sản phẩm — nên quản lý rủi ro xuyên suốt mọi giai đoạn.</div>`,
  ]]);

const c1q = quiz('spm401-quiz-1', 'Quiz 1 — Life cycle|||Quiz 1 — Vòng đời', [
  { id: 'q1', question: 'Đặc điểm phân biệt "dự án" với "vận hành" là?', options: ['Dự án diễn ra liên tục không kết thúc', 'Dự án là nỗ lực tạm thời có bắt đầu và kết thúc, tạo kết quả duy nhất', 'Dự án luôn rẻ hơn vận hành', 'Dự án không cần ngân sách'], correctIndex: 1, explanation: 'Dự án tạm thời, có mốc đầu-cuối, tạo sản phẩm/kết quả duy nhất; vận hành thì liên tục.' },
  { id: 'q2', question: 'Thứ tự đúng của năm nhóm quy trình PMBOK là?', options: ['Lập kế hoạch → Khởi tạo → Thực thi → Kết thúc → Giám sát', 'Khởi tạo → Lập kế hoạch → Thực thi → Giám sát → Kết thúc', 'Thực thi → Khởi tạo → Giám sát → Kết thúc → Lập kế hoạch', 'Khởi tạo → Thực thi → Lập kế hoạch → Giám sát → Kết thúc'], correctIndex: 1, explanation: 'Khởi tạo → Lập kế hoạch → Thực thi → Giám sát & kiểm soát → Kết thúc.' },
  { id: 'q3', question: 'Vòng đời "thích ứng" (agile) phù hợp nhất khi?', options: ['Phạm vi đã rõ và cố định hoàn toàn', 'Công việc còn nhiều bất định, phạm vi tiến hoá theo vòng lặp ngắn', 'Không có bên liên quan nào', 'Ngân sách bằng không'], correctIndex: 1, explanation: 'Agile hợp với việc bất định, phạm vi làm rõ dần qua các vòng lặp ngắn.' },
]);

const c2 = doc('spm401-2-1-initiating', '2.1 — Initiating &amp; defining scope|||2.1 — Khởi tạo &amp; xác định phạm vi',
  'Business case; project charter (mục tiêu, phạm vi cao cấp, PM, ngân sách sơ bộ); phân tích bên liên quan (ma trận quyền lực/quan tâm); tuyên bố phạm vi & tiêu chí nghiệm thu; scope creep.',
  [[
    `<span class="eyebrow">SPM401 · Chapter 2 · Lesson 2.1</span>
<h2>Initiating &amp; defining scope</h2>
<h3>The project charter</h3>
<p>A project is born from a <strong>business case</strong> (why do this? what is the risk/benefit?) and is formally authorised by a <strong>project charter</strong>. The charter names the <strong>PM and their authority</strong>, states the high-level objectives, scope, budget and key stakeholders. Without it, a PM has no mandate.</p>
<h3>Stakeholder analysis</h3>
<p>A <strong>stakeholder</strong> is anyone affected by the project — CISO, IT ops, end users, auditors, vendors. Map them on a <strong>power / interest grid</strong> to decide how to engage each:</p>
<pre><code>            Low interest      High interest
High power   Keep satisfied    Manage closely
Low power    Monitor           Keep informed
</code></pre>
<h3>Scope statement &amp; acceptance criteria</h3>
<p>The <strong>scope statement</strong> says exactly what is IN and OUT, plus the <strong>acceptance criteria</strong> that define "done". For a MFA rollout: IN = all staff email &amp; VPN; OUT = contractor laptops. Vague scope invites <strong>scope creep</strong> — uncontrolled growth that blows the schedule and budget.</p>
<div class="callout"><span class="badge">Write it down</span> "Not in scope" is as important as "in scope". The clearest way to kill scope creep is to have listed the exclusions in the signed charter.</div>`,
    `<span class="eyebrow">SPM401 · Chương 2 · Bài 2.1</span>
<h2>Khởi tạo &amp; xác định phạm vi</h2>
<h3>Project charter (điều lệ dự án)</h3>
<p>Một dự án sinh ra từ <strong>business case</strong> (vì sao làm? rủi ro/lợi ích gì?) và được phê duyệt chính thức bằng <strong>project charter</strong>. Charter chỉ định <strong>PM và quyền hạn của họ</strong>, nêu mục tiêu cấp cao, phạm vi, ngân sách và các bên liên quan chính. Không có nó, PM không có thẩm quyền.</p>
<h3>Phân tích bên liên quan</h3>
<p><strong>Bên liên quan (stakeholder)</strong> là bất kỳ ai chịu tác động của dự án — CISO, vận hành IT, người dùng cuối, kiểm toán, nhà cung cấp. Xếp họ lên <strong>ma trận quyền lực / quan tâm</strong> để quyết cách tương tác:</p>
<pre><code>              Ít quan tâm      Rất quan tâm
Quyền lực cao  Giữ hài lòng     Quản lý sát sao
Quyền lực thấp Theo dõi         Cập nhật thường xuyên
</code></pre>
<h3>Tuyên bố phạm vi &amp; tiêu chí nghiệm thu</h3>
<p><strong>Tuyên bố phạm vi</strong> nói chính xác cái gì TRONG và NGOÀI, cùng <strong>tiêu chí nghiệm thu</strong> định nghĩa "hoàn thành". Với dự án MFA: TRONG = email &amp; VPN toàn nhân viên; NGOÀI = laptop nhà thầu. Phạm vi mơ hồ mời gọi <strong>scope creep</strong> — phình không kiểm soát, phá vỡ lịch trình và ngân sách.</p>
<div class="callout"><span class="badge">Viết ra giấy</span> "Ngoài phạm vi" quan trọng ngang "trong phạm vi". Cách rõ ràng nhất để chặn scope creep là đã liệt kê phần loại trừ trong charter đã ký.</div>`,
  ]]);

const c2q = quiz('spm401-quiz-2', 'Quiz 2 — Initiating|||Quiz 2 — Khởi tạo', [
  { id: 'q1', question: 'Tài liệu chính thức phê duyệt dự án và trao quyền cho PM là?', options: ['Sổ rủi ro', 'Project charter (điều lệ dự án)', 'Biểu đồ Gantt', 'Báo cáo EVM'], correctIndex: 1, explanation: 'Charter phê duyệt dự án, chỉ định PM và quyền hạn, nêu mục tiêu/phạm vi cấp cao.' },
  { id: 'q2', question: 'Với bên liên quan "quyền lực cao, quan tâm cao", chiến lược tương tác là?', options: ['Chỉ theo dõi', 'Quản lý sát sao (manage closely)', 'Bỏ qua', 'Chỉ cập nhật khi kết thúc'], correctIndex: 1, explanation: 'Ma trận quyền lực/quan tâm: quyền lực cao + quan tâm cao → quản lý sát sao.' },
  { id: 'q3', question: '"Scope creep" là hiện tượng?', options: ['Phạm vi phình to không kiểm soát, phá lịch trình và ngân sách', 'Dự án kết thúc sớm', 'Chi phí giảm bất ngờ', 'Rủi ro tự biến mất'], correctIndex: 0, explanation: 'Scope creep = phạm vi mở rộng ngoài kiểm soát; chống bằng scope statement rõ và kiểm soát thay đổi.' },
]);

const c3 = doc('spm401-3-1-planning', '3.1 — Planning: WBS, schedule &amp; estimation|||3.1 — Lập kế hoạch: WBS, lịch trình &amp; ước lượng',
  'Work Breakdown Structure (WBS) & gói công việc; sơ đồ mạng, đường găng (critical path); biểu đồ Gantt & mốc; ước lượng thời gian/chi phí (analogous, parametric, three-point PERT).',
  [[
    `<span class="eyebrow">SPM401 · Chapter 3 · Lesson 3.1</span>
<h2>Planning: WBS, schedule &amp; estimation</h2>
<h3>Work Breakdown Structure (WBS)</h3>
<p>The <strong>WBS</strong> decomposes the whole scope into manageable <strong>work packages</strong> — deliverable-oriented, not a to-do list. "If it isn't in the WBS, it isn't in the project."</p>
<pre><code>1  MFA Rollout
1.1  Design
   1.1.1 Choose MFA vendor
   1.1.2 Define enrolment policy
1.2  Pilot (IT dept)
1.3  Company-wide rollout
1.4  Training & handover
</code></pre>
<h3>Schedule &amp; critical path</h3>
<p>Sequence the work packages, estimate durations, and find the <strong>critical path</strong> — the longest chain of dependent tasks, which sets the shortest possible project length. A slip on the critical path slips the whole project. A <strong>Gantt chart</strong> shows tasks as bars over a timeline with <strong>milestones</strong> (zero-duration checkpoints).</p>
<h3>Estimation techniques</h3>
<ul>
<li><strong>Analogous</strong> — "the last rollout took 8 weeks, so this will too" (fast, rough).</li>
<li><strong>Parametric</strong> — rate × quantity (e.g. 0.5 h/laptop × 500).</li>
<li><strong>Three-point (PERT)</strong> — (Optimistic + 4×Most-likely + Pessimistic) / 6, to handle uncertainty.</li>
</ul>
<div class="callout"><span class="badge">Decompose first</span> Estimate small work packages, not the whole project — small pieces are far easier to estimate accurately, and errors cancel out.</div>`,
    `<span class="eyebrow">SPM401 · Chương 3 · Bài 3.1</span>
<h2>Lập kế hoạch: WBS, lịch trình &amp; ước lượng</h2>
<h3>Cấu trúc phân rã công việc (WBS)</h3>
<p><strong>WBS</strong> phân rã toàn bộ phạm vi thành các <strong>gói công việc</strong> quản lý được — hướng theo sản phẩm bàn giao, không phải danh sách việc vặt. "Không nằm trong WBS thì không thuộc dự án."</p>
<pre><code>1  Triển khai MFA
1.1  Thiết kế
   1.1.1 Chọn nhà cung cấp MFA
   1.1.2 Định chính sách đăng ký
1.2  Thí điểm (phòng IT)
1.3  Triển khai toàn công ty
1.4  Đào tạo & bàn giao
</code></pre>
<h3>Lịch trình &amp; đường găng</h3>
<p>Sắp trình tự gói công việc, ước lượng thời lượng, tìm <strong>đường găng (critical path)</strong> — chuỗi công việc phụ thuộc dài nhất, quyết định độ dài ngắn nhất của dự án. Trễ trên đường găng là trễ cả dự án. <strong>Biểu đồ Gantt</strong> hiện công việc thành các thanh trên trục thời gian kèm <strong>mốc (milestone)</strong> (điểm kiểm tra thời lượng bằng 0).</p>
<h3>Kỹ thuật ước lượng</h3>
<ul>
<li><strong>Tương tự (analogous)</strong> — "đợt trước mất 8 tuần nên đợt này cũng vậy" (nhanh, thô).</li>
<li><strong>Tham số (parametric)</strong> — đơn giá × số lượng (vd 0,5 giờ/máy × 500).</li>
<li><strong>Ba điểm (PERT)</strong> — (Lạc quan + 4×Khả dĩ nhất + Bi quan) / 6, để xử lý bất định.</li>
</ul>
<div class="callout"><span class="badge">Phân rã trước</span> Ước lượng từng gói nhỏ, không ước lượng cả dự án — mảnh nhỏ dễ ước chính xác hơn, và sai số triệt tiêu lẫn nhau.</div>`,
  ]]);

const c3q = quiz('spm401-quiz-3', 'Quiz 3 — Planning|||Quiz 3 — Lập kế hoạch', [
  { id: 'q1', question: 'WBS (Work Breakdown Structure) dùng để?', options: ['Liệt kê rủi ro', 'Phân rã phạm vi thành các gói công việc quản lý được', 'Tính lương nhân viên', 'Đo sự hài lòng khách hàng'], correctIndex: 1, explanation: 'WBS phân rã toàn bộ phạm vi thành work package; "không trong WBS thì không thuộc dự án".' },
  { id: 'q2', question: '"Đường găng" (critical path) là?', options: ['Công việc rẻ nhất', 'Chuỗi công việc phụ thuộc DÀI NHẤT, quyết định thời gian tối thiểu của dự án', 'Công việc ít rủi ro nhất', 'Danh sách bên liên quan'], correctIndex: 1, explanation: 'Critical path là chuỗi dài nhất; trễ trên đó là trễ cả dự án.' },
  { id: 'q3', question: 'Ước lượng ba điểm (PERT) tính kỳ vọng theo công thức?', options: ['(Lạc quan + Bi quan) / 2', '(Lạc quan + 4×Khả dĩ nhất + Bi quan) / 6', 'Khả dĩ nhất × 3', 'Bi quan − Lạc quan'], correctIndex: 1, explanation: 'PERT: (O + 4M + P) / 6, đặt trọng số cao cho ước lượng khả dĩ nhất.' },
]);

const c4 = doc('spm401-4-1-risk', '4.1 — Risk management for security projects|||4.1 — Quản lý rủi ro dự án an ninh',
  'Quy trình rủi ro: nhận diện → phân tích định tính (P×I) → định lượng (EMV) → ứng phó → giám sát; sổ rủi ro; chiến lược (tránh/giảm/chuyển/chấp nhận); phân biệt rủi ro DỰ ÁN vs rủi ro an ninh thông tin.',
  [[
    `<span class="eyebrow">SPM401 · Chapter 4 · Lesson 4.1</span>
<h2>Risk management for security projects</h2>
<p>A <strong>risk</strong> is an uncertain event that, if it happens, affects an objective. Note the distinction: <strong>project risk</strong> ("the vendor is late") threatens the schedule/budget; the <strong>information-security risk</strong> the project itself is meant to reduce ("credentials get phished") is the reason the project exists. This chapter is about managing project risk.</p>
<h3>The risk process</h3>
<pre><code>Identify -> Analyse (qualitative) -> Analyse (quantitative)
         -> Plan response -> Monitor & control
</code></pre>
<h3>Qualitative &amp; quantitative analysis</h3>
<ul>
<li><strong>Qualitative</strong> — score each risk by <strong>Probability × Impact</strong> and rank (High/Med/Low) to prioritise attention.</li>
<li><strong>Quantitative</strong> — <strong>Expected Monetary Value = Probability × Impact($)</strong>. A 20% chance of a $50,000 loss = $10,000 EMV, used to size contingency reserves.</li>
</ul>
<h3>Response strategies (threats)</h3>
<ul>
<li><strong>Avoid</strong> — change the plan so the risk cannot occur.</li>
<li><strong>Mitigate</strong> — reduce its probability or impact.</li>
<li><strong>Transfer</strong> — shift it to a third party (insurance, a vendor SLA).</li>
<li><strong>Accept</strong> — acknowledge it and set aside a reserve.</li>
</ul>
<div class="callout"><span class="badge">Risk register</span> All of this lives in a living <strong>risk register</strong>: id, description, probability, impact, score, owner, response, status — reviewed at every status meeting, not written once and filed.</div>`,
    `<span class="eyebrow">SPM401 · Chương 4 · Bài 4.1</span>
<h2>Quản lý rủi ro dự án an ninh</h2>
<p>Một <strong>rủi ro</strong> là sự kiện bất định mà nếu xảy ra sẽ tác động tới một mục tiêu. Lưu ý phân biệt: <strong>rủi ro dự án</strong> ("nhà cung cấp giao trễ") đe doạ lịch trình/ngân sách; còn <strong>rủi ro an ninh thông tin</strong> mà chính dự án nhằm giảm ("thông tin đăng nhập bị lừa lấy") là lý do dự án tồn tại. Chương này bàn về quản lý rủi ro dự án.</p>
<h3>Quy trình rủi ro</h3>
<pre><code>Nhận diện -> Phân tích (định tính) -> Phân tích (định lượng)
          -> Lập ứng phó -> Giám sát & kiểm soát
</code></pre>
<h3>Phân tích định tính &amp; định lượng</h3>
<ul>
<li><strong>Định tính</strong> — chấm mỗi rủi ro theo <strong>Xác suất × Tác động</strong> và xếp hạng (Cao/TB/Thấp) để ưu tiên chú ý.</li>
<li><strong>Định lượng</strong> — <strong>Giá trị kỳ vọng (EMV) = Xác suất × Tác động (tiền)</strong>. 20% khả năng thiệt hại 50.000$ = EMV 10.000$, dùng để định cỡ quỹ dự phòng.</li>
</ul>
<h3>Chiến lược ứng phó (mối đe doạ)</h3>
<ul>
<li><strong>Tránh (avoid)</strong> — đổi kế hoạch để rủi ro không thể xảy ra.</li>
<li><strong>Giảm (mitigate)</strong> — hạ xác suất hoặc tác động.</li>
<li><strong>Chuyển (transfer)</strong> — đẩy sang bên thứ ba (bảo hiểm, SLA nhà cung cấp).</li>
<li><strong>Chấp nhận (accept)</strong> — thừa nhận và để dành quỹ dự phòng.</li>
</ul>
<div class="callout"><span class="badge">Sổ rủi ro</span> Tất cả sống trong một <strong>sổ rủi ro (risk register)</strong>: mã, mô tả, xác suất, tác động, điểm, chủ sở hữu, ứng phó, trạng thái — rà ở mọi buổi họp trạng thái, không phải viết một lần rồi cất tủ.</div>`,
  ]]);

const c4q = quiz('spm401-quiz-4', 'Quiz 4 — Risk|||Quiz 4 — Rủi ro', [
  { id: 'q1', question: 'Trong phân tích định lượng, EMV (giá trị tiền kỳ vọng) tính bằng?', options: ['Tác động − Xác suất', 'Xác suất × Tác động (tiền)', 'Xác suất + Tác động', 'Tác động / Xác suất'], correctIndex: 1, explanation: 'EMV = Xác suất × Tác động; vd 20% × 50.000$ = 10.000$.' },
  { id: 'q2', question: 'Mua bảo hiểm hoặc chuyển rủi ro sang nhà cung cấp qua SLA là chiến lược?', options: ['Tránh (avoid)', 'Chuyển (transfer)', 'Chấp nhận (accept)', 'Khai thác (exploit)'], correctIndex: 1, explanation: 'Chuyển (transfer) đẩy hậu quả/trách nhiệm rủi ro sang bên thứ ba.' },
  { id: 'q3', question: 'Phát biểu nào đúng về "rủi ro dự án" so với "rủi ro an ninh thông tin"?', options: ['Chúng luôn giống hệt nhau', 'Rủi ro dự án đe doạ lịch trình/ngân sách; rủi ro ATTT là thứ dự án nhằm giảm', 'Rủi ro dự án không cần quản lý', 'Rủi ro ATTT do PM chịu trách nhiệm về lịch trình'], correctIndex: 1, explanation: 'Rủi ro dự án ảnh hưởng mục tiêu dự án; rủi ro ATTT là lý do triển khai dự án bảo mật.' },
]);

const c5 = doc('spm401-5-1-resource-cost-procurement', '5.1 — Resource, cost &amp; procurement management|||5.1 — Quản lý nguồn lực, chi phí &amp; mua sắm',
  'Ma trận trách nhiệm RACI; lập ngân sách & đường cơ sở chi phí (cost baseline); quỹ dự phòng (contingency vs management reserve); mua sắm: loại hợp đồng (fixed-price vs T&M), quy trình chọn nhà cung cấp.',
  [[
    `<span class="eyebrow">SPM401 · Chapter 5 · Lesson 5.1</span>
<h2>Resource, cost &amp; procurement management</h2>
<h3>Resources &amp; the RACI matrix</h3>
<p>People, tools and facilities are the project's resources. A <strong>RACI matrix</strong> makes accountability unambiguous for each task:</p>
<pre><code>Task                Responsible  Accountable  Consulted  Informed
Choose MFA vendor   Security eng CISO         Legal      Staff
Configure servers   Sysadmin     IT manager   Security   Helpdesk
</code></pre>
<p>Exactly one <strong>A</strong> per task — one throat to choke.</p>
<h3>Cost &amp; the budget</h3>
<p>Sum the work-package cost estimates into a <strong>cost baseline</strong> — the approved, time-phased budget against which performance is measured. Add reserves for risk: <strong>contingency reserve</strong> (for known risks, controlled by the PM) and <strong>management reserve</strong> (for unknown-unknowns, controlled by management).</p>
<h3>Procurement</h3>
<p>When you buy from outside, the <strong>contract type</strong> allocates risk:</p>
<ul>
<li><strong>Fixed-price</strong> — vendor bears the cost risk; good when scope is clear.</li>
<li><strong>Time &amp; materials (T&amp;M)</strong> — buyer bears the risk; good when scope is uncertain.</li>
</ul>
<div class="callout"><span class="badge">Buy vs build</span> A "make-or-buy" analysis decides whether to build in-house or procure — for security tools it is usually buy (a vetted product), but the vendor's access then becomes a risk you must manage.</div>`,
    `<span class="eyebrow">SPM401 · Chương 5 · Bài 5.1</span>
<h2>Quản lý nguồn lực, chi phí &amp; mua sắm</h2>
<h3>Nguồn lực &amp; ma trận RACI</h3>
<p>Con người, công cụ và cơ sở vật chất là nguồn lực dự án. <strong>Ma trận RACI</strong> làm rõ trách nhiệm cho từng công việc:</p>
<pre><code>Công việc            Thực hiện    Chịu trách nhiệm Tư vấn    Thông báo
Chọn nhà cung cấp MFA KS bảo mật   CISO             Pháp chế  Nhân viên
Cấu hình máy chủ     Sysadmin     Trưởng IT        Bảo mật   Helpdesk
</code></pre>
<p>Đúng một <strong>A</strong> (chịu trách nhiệm) cho mỗi công việc — một đầu mối chịu trách nhiệm.</p>
<h3>Chi phí &amp; ngân sách</h3>
<p>Cộng ước lượng chi phí các gói công việc thành <strong>đường cơ sở chi phí (cost baseline)</strong> — ngân sách đã duyệt, phân theo thời gian, làm mốc đo hiệu suất. Thêm quỹ cho rủi ro: <strong>quỹ dự phòng (contingency)</strong> (cho rủi ro đã biết, PM kiểm soát) và <strong>quỹ quản lý (management reserve)</strong> (cho bất định chưa biết, cấp quản lý kiểm soát).</p>
<h3>Mua sắm</h3>
<p>Khi mua từ bên ngoài, <strong>loại hợp đồng</strong> phân bổ rủi ro:</p>
<ul>
<li><strong>Giá cố định (fixed-price)</strong> — nhà cung cấp gánh rủi ro chi phí; hợp khi phạm vi rõ.</li>
<li><strong>Thời gian &amp; vật tư (T&amp;M)</strong> — bên mua gánh rủi ro; hợp khi phạm vi còn bất định.</li>
</ul>
<div class="callout"><span class="badge">Mua hay tự làm</span> Phân tích "make-or-buy" quyết định tự dựng nội bộ hay mua ngoài — với công cụ bảo mật thường là mua (sản phẩm đã kiểm định), nhưng quyền truy cập của nhà cung cấp khi đó trở thành rủi ro phải quản lý.</div>`,
  ]]);

const c5q = quiz('spm401-quiz-5', 'Quiz 5 — Resource/cost/procurement|||Quiz 5 — Nguồn lực/chi phí/mua sắm', [
  { id: 'q1', question: 'Trong ma trận RACI, mỗi công việc nên có bao nhiêu người "Accountable" (A)?', options: ['Không có ai', 'Đúng một người', 'Càng nhiều càng tốt', 'Ít nhất ba người'], correctIndex: 1, explanation: 'Mỗi công việc chỉ đúng một A — một đầu mối chịu trách nhiệm cuối cùng.' },
  { id: 'q2', question: 'Loại hợp đồng nào đặt rủi ro chi phí lên NHÀ CUNG CẤP, hợp khi phạm vi rõ ràng?', options: ['Thời gian & vật tư (T&M)', 'Giá cố định (fixed-price)', 'Hợp đồng mở vô hạn', 'Không hợp đồng'], correctIndex: 1, explanation: 'Fixed-price: nhà cung cấp gánh rủi ro vượt chi phí; hợp khi phạm vi xác định rõ.' },
  { id: 'q3', question: '"Đường cơ sở chi phí" (cost baseline) là?', options: ['Chi phí thực tế cuối dự án', 'Ngân sách đã duyệt, phân theo thời gian, dùng làm mốc đo hiệu suất', 'Lương của PM', 'Giá thị trường của công cụ'], correctIndex: 1, explanation: 'Cost baseline là ngân sách phê duyệt phân theo thời gian, dùng so với chi tiêu thực.' },
]);

const c6 = doc('spm401-6-1-executing-quality', '6.1 — Executing &amp; managing quality/safety|||6.1 — Thực thi &amp; quản lý chất lượng/an toàn',
  'Chỉ đạo & quản lý công việc; xây dựng và dẫn dắt nhóm; quản lý chất lượng (planning/assurance/control); phân biệt QA vs QC; đảm bảo an toàn trong thi công bảo mật (thay đổi có kiểm soát, không làm gián đoạn dịch vụ).',
  [[
    `<span class="eyebrow">SPM401 · Chapter 6 · Lesson 6.1</span>
<h2>Executing &amp; managing quality/safety</h2>
<h3>Directing the work</h3>
<p>In <strong>executing</strong>, the plan meets reality: the PM coordinates people and vendors, removes blockers, and keeps the team aligned. Most of a PM's effort — and budget — is spent here. Building and leading the <strong>team</strong> (develop, motivate, resolve conflict) is a core PM skill, not an afterthought.</p>
<h3>Quality: QA vs QC</h3>
<ul>
<li><strong>Quality planning</strong> — define what "good" means (standards, acceptance criteria).</li>
<li><strong>Quality assurance (QA)</strong> — audit the <em>process</em>: are we following the right procedures? (prevention)</li>
<li><strong>Quality control (QC)</strong> — inspect the <em>deliverables</em>: does the output meet spec? (detection)</li>
</ul>
<p>QA prevents defects; QC catches them. Both are cheaper than fixing problems in production.</p>
<h3>Safety in security work</h3>
<p>A security project changes live, business-critical systems. "Safety" here means <strong>not causing an outage while improving security</strong>: use <strong>controlled change windows</strong>, test in a pilot, prepare a <strong>rollback plan</strong>, and never push a firewall or MFA change to everyone at once.</p>
<div class="callout"><span class="badge">Pilot then scale</span> The pilot (chapter 3's WBS) exists precisely so quality and safety problems surface on 20 machines, not 500.</div>`,
    `<span class="eyebrow">SPM401 · Chương 6 · Bài 6.1</span>
<h2>Thực thi &amp; quản lý chất lượng/an toàn</h2>
<h3>Chỉ đạo công việc</h3>
<p>Ở <strong>thực thi</strong>, kế hoạch gặp thực tế: PM điều phối con người và nhà cung cấp, gỡ vướng, giữ nhóm cùng hướng. Phần lớn công sức — và ngân sách — của PM tiêu ở đây. Xây dựng và dẫn dắt <strong>nhóm</strong> (phát triển, tạo động lực, hoá giải xung đột) là kỹ năng cốt lõi của PM, không phải chuyện phụ.</p>
<h3>Chất lượng: QA vs QC</h3>
<ul>
<li><strong>Lập kế hoạch chất lượng</strong> — định nghĩa "tốt" nghĩa là gì (chuẩn, tiêu chí nghiệm thu).</li>
<li><strong>Đảm bảo chất lượng (QA)</strong> — kiểm <em>quy trình</em>: ta có làm đúng thủ tục không? (phòng ngừa)</li>
<li><strong>Kiểm soát chất lượng (QC)</strong> — kiểm <em>sản phẩm bàn giao</em>: đầu ra có đạt đặc tả không? (phát hiện)</li>
</ul>
<p>QA ngăn lỗi; QC bắt lỗi. Cả hai đều rẻ hơn sửa sự cố khi đã lên production.</p>
<h3>An toàn trong công việc bảo mật</h3>
<p>Dự án bảo mật thay đổi các hệ thống sống, trọng yếu cho kinh doanh. "An toàn" ở đây nghĩa là <strong>không gây gián đoạn dịch vụ trong khi tăng cường bảo mật</strong>: dùng <strong>cửa sổ thay đổi có kiểm soát</strong>, thử ở bản thí điểm, chuẩn bị <strong>kế hoạch rollback</strong>, và không bao giờ đẩy thay đổi tường lửa hay MFA cho tất cả cùng lúc.</p>
<div class="callout"><span class="badge">Thí điểm rồi mở rộng</span> Bản thí điểm (WBS ở chương 3) tồn tại chính là để lỗi chất lượng và an toàn lộ ra trên 20 máy, không phải 500.</div>`,
  ]]);

const c6q = quiz('spm401-quiz-6', 'Quiz 6 — Executing/quality|||Quiz 6 — Thực thi/chất lượng', [
  { id: 'q1', question: 'Khác biệt giữa QA và QC là?', options: ['QA kiểm sản phẩm, QC kiểm quy trình', 'QA kiểm/đảm bảo QUY TRÌNH (phòng ngừa), QC kiểm SẢN PHẨM bàn giao (phát hiện)', 'QA và QC hoàn toàn giống nhau', 'QC chỉ dùng cho phần mềm'], correctIndex: 1, explanation: 'QA hướng quy trình để phòng lỗi; QC kiểm tra sản phẩm để phát hiện lỗi.' },
  { id: 'q2', question: 'Biện pháp "an toàn" khi triển khai thay đổi bảo mật lên hệ thống sống là?', options: ['Đẩy cho toàn bộ người dùng cùng lúc để nhanh', 'Dùng cửa sổ thay đổi có kiểm soát, thí điểm, và chuẩn bị kế hoạch rollback', 'Bỏ qua giai đoạn thử', 'Không thông báo cho ai'], correctIndex: 1, explanation: 'Thay đổi có kiểm soát + thí điểm + rollback tránh gây gián đoạn dịch vụ.' },
  { id: 'q3', question: 'Trong dự án, nhóm quy trình nào tiêu tốn phần lớn ngân sách và công sức?', options: ['Khởi tạo', 'Thực thi (executing)', 'Kết thúc', 'Chỉ lập kế hoạch'], correctIndex: 1, explanation: 'Thực thi là nơi công việc thực sự diễn ra, chiếm phần lớn chi phí và nỗ lực.' },
]);

const c7 = doc('spm401-7-1-monitoring-compliance', '7.1 — Monitoring, change control &amp; compliance|||7.1 — Giám sát, kiểm soát thay đổi &amp; tuân thủ',
  'Giám sát tiến độ; giá trị thu được (EVM: PV/EV/AC, SV/CV, SPI/CPI); kiểm soát thay đổi tích hợp & CCB; lồng tuân thủ vào dự án — NIST RMF (6 bước) và triển khai/chứng nhận ISO/IEC 27001.',
  [[
    `<span class="eyebrow">SPM401 · Chapter 7 · Lesson 7.1</span>
<h2>Monitoring, change control &amp; compliance</h2>
<h3>Earned Value Management (EVM)</h3>
<p>EVM answers "are we on schedule and on budget?" with numbers, not gut feel:</p>
<pre><code>PV  Planned Value   = budgeted cost of work SCHEDULED
EV  Earned Value    = budgeted cost of work DONE
AC  Actual Cost     = what the done work actually cost

SV = EV - PV   (schedule variance; negative = behind)
CV = EV - AC   (cost variance;    negative = over budget)
SPI = EV / PV  (>1 ahead of schedule)
CPI = EV / AC  (>1 under budget)
</code></pre>
<h3>Integrated change control</h3>
<p>Change is inevitable, but uncontrolled change is scope creep. Every change request goes through a <strong>Change Control Board (CCB)</strong>: assess impact on scope/time/cost/risk, approve or reject, and update the baselines. No baseline is changed silently.</p>
<h3>Compliance woven into the project</h3>
<ul>
<li><strong>NIST RMF (SP 800-37)</strong> — 6 steps: Categorize -&gt; Select -&gt; Implement -&gt; Assess -&gt; Authorize -&gt; Monitor. Map these onto your project phases.</li>
<li><strong>ISO/IEC 27001</strong> — establishing an ISMS <em>is</em> a project: scope, risk assessment, Statement of Applicability, controls, internal audit, then certification audit.</li>
</ul>
<div class="callout"><span class="badge">Compliance is a deliverable</span> On a security project, "passed the RMF authorization" or "achieved ISO 27001 cert" is a milestone in the schedule with its own work packages — not paperwork done at the end.</div>`,
    `<span class="eyebrow">SPM401 · Chương 7 · Bài 7.1</span>
<h2>Giám sát, kiểm soát thay đổi &amp; tuân thủ</h2>
<h3>Quản lý giá trị thu được (EVM)</h3>
<p>EVM trả lời "ta có đúng lịch, đúng ngân sách không?" bằng con số, không phải cảm tính:</p>
<pre><code>PV  Giá trị kế hoạch = chi phí dự toán của công việc THEO LỊCH
EV  Giá trị thu được = chi phí dự toán của công việc ĐÃ LÀM
AC  Chi phí thực tế  = công việc đã làm thực tế tốn bao nhiêu

SV = EV - PV   (lệch lịch; âm = chậm tiến độ)
CV = EV - AC   (lệch chi phí; âm = vượt ngân sách)
SPI = EV / PV  (>1 vượt tiến độ)
CPI = EV / AC  (>1 dưới ngân sách)
</code></pre>
<h3>Kiểm soát thay đổi tích hợp</h3>
<p>Thay đổi là tất yếu, nhưng thay đổi không kiểm soát chính là scope creep. Mọi yêu cầu thay đổi đi qua <strong>Hội đồng Kiểm soát Thay đổi (CCB)</strong>: đánh giá tác động tới phạm vi/thời gian/chi phí/rủi ro, duyệt hoặc từ chối, rồi cập nhật đường cơ sở. Không đường cơ sở nào bị đổi âm thầm.</p>
<h3>Lồng tuân thủ vào dự án</h3>
<ul>
<li><strong>NIST RMF (SP 800-37)</strong> — 6 bước: Phân loại -&gt; Chọn -&gt; Triển khai -&gt; Đánh giá -&gt; Cấp phép -&gt; Giám sát. Ánh xạ các bước này vào giai đoạn dự án.</li>
<li><strong>ISO/IEC 27001</strong> — thiết lập ISMS <em>chính là</em> một dự án: phạm vi, đánh giá rủi ro, Tuyên bố Áp dụng (SoA), biện pháp, kiểm toán nội bộ, rồi kiểm toán chứng nhận.</li>
</ul>
<div class="callout"><span class="badge">Tuân thủ là sản phẩm bàn giao</span> Trong dự án bảo mật, "đạt cấp phép RMF" hay "đạt chứng nhận ISO 27001" là một mốc trong lịch trình với gói công việc riêng — không phải giấy tờ làm cho xong ở cuối.</div>`,
  ]]);

const c7q = quiz('spm401-quiz-7', 'Quiz 7 — Monitoring/compliance|||Quiz 7 — Giám sát/tuân thủ', [
  { id: 'q1', question: 'Chỉ số CPI (Cost Performance Index) trong EVM tính bằng và ý nghĩa?', options: ['EV / AC; lớn hơn 1 nghĩa là đang DƯỚI ngân sách', 'AC / EV; lớn hơn 1 nghĩa là vượt ngân sách', 'PV − EV; luôn dương', 'EV × AC; đo tiến độ'], correctIndex: 0, explanation: 'CPI = EV / AC; CPI > 1 nghĩa là tiêu ít hơn giá trị đã làm ra → dưới ngân sách.' },
  { id: 'q2', question: 'Vai trò của Hội đồng Kiểm soát Thay đổi (CCB) là?', options: ['Tự động duyệt mọi thay đổi', 'Đánh giá tác động của yêu cầu thay đổi rồi duyệt/từ chối và cập nhật đường cơ sở', 'Viết mã cho dự án', 'Chỉ họp khi kết thúc dự án'], correctIndex: 1, explanation: 'CCB đánh giá tác động scope/time/cost/risk, quyết định và cập nhật baseline — chống thay đổi âm thầm.' },
  { id: 'q3', question: 'NIST SP 800-37 (RMF) gồm sáu bước theo thứ tự nào?', options: ['Chọn → Phân loại → Đánh giá → Triển khai → Giám sát → Cấp phép', 'Phân loại → Chọn → Triển khai → Đánh giá → Cấp phép → Giám sát', 'Triển khai → Chọn → Phân loại → Cấp phép → Giám sát → Đánh giá', 'Giám sát → Cấp phép → Đánh giá → Triển khai → Chọn → Phân loại'], correctIndex: 1, explanation: 'RMF: Categorize → Select → Implement → Assess → Authorize → Monitor.' },
]);

const c8 = doc('spm401-8-1-closing-agile', '8.1 — Closing, lessons learned &amp; Agile/Scrum|||8.1 — Kết thúc, bài học kinh nghiệm &amp; Agile/Scrum',
  'Kết thúc dự án: nghiệm thu, đóng hợp đồng, giải phóng nguồn lực; báo cáo bài học kinh nghiệm; chuyển giao sang vận hành; Agile/Scrum trong dự án bảo mật (vai trò, sự kiện, artifact) và khi nào chọn agile.',
  [[
    `<span class="eyebrow">SPM401 · Chapter 8 · Lesson 8.1</span>
<h2>Closing, lessons learned &amp; Agile/Scrum</h2>
<h3>Closing the project</h3>
<p>Closing is deliberate, not "the work just stopped". It includes: get formal <strong>acceptance</strong> of deliverables against the criteria, <strong>close contracts</strong> with vendors, <strong>release the team</strong> and resources, archive documents, and — crucially for security — <strong>hand over to operations</strong> (who now runs the MFA service, monitors the SOC?).</p>
<h3>Lessons learned</h3>
<p>A <strong>lessons-learned</strong> review captures what went well and what didn't, so the next project doesn't repeat mistakes. It only has value if it is <em>recorded and reused</em> — a retrospective filed and forgotten is wasted.</p>
<h3>Agile / Scrum for security projects</h3>
<pre><code>Roles   Product Owner (priorities) · Scrum Master (process) · Team
Events  Sprint · Sprint Planning · Daily Standup · Review · Retrospective
Items   Product Backlog -> Sprint Backlog -> Increment
</code></pre>
<p>Scrum delivers a working <strong>increment</strong> every short sprint (1-4 weeks) and re-plans each time — ideal when requirements are uncertain (building new detection rules) but harder for fixed-deadline compliance work, where a predictive plan often fits better.</p>
<div class="callout"><span class="badge">Choose by uncertainty</span> Predictive for well-defined, compliance-driven work; adaptive (Scrum) for exploratory, fast-changing work. Many real security programmes blend both (hybrid).</div>`,
    `<span class="eyebrow">SPM401 · Chương 8 · Bài 8.1</span>
<h2>Kết thúc, bài học kinh nghiệm &amp; Agile/Scrum</h2>
<h3>Kết thúc dự án</h3>
<p>Kết thúc là có chủ đích, không phải "công việc tự ngừng". Bao gồm: lấy <strong>nghiệm thu</strong> chính thức sản phẩm theo tiêu chí, <strong>đóng hợp đồng</strong> với nhà cung cấp, <strong>giải phóng nhóm</strong> và nguồn lực, lưu trữ tài liệu, và — quan trọng với bảo mật — <strong>chuyển giao sang vận hành</strong> (ai vận hành dịch vụ MFA, ai trực SOC?).</p>
<h3>Bài học kinh nghiệm</h3>
<p>Buổi rà <strong>bài học kinh nghiệm (lessons learned)</strong> ghi lại cái gì tốt và cái gì chưa tốt, để dự án sau không lặp sai lầm. Nó chỉ có giá trị nếu được <em>ghi lại và dùng lại</em> — một buổi rút kinh nghiệm cất tủ rồi quên là lãng phí.</p>
<h3>Agile / Scrum cho dự án bảo mật</h3>
<pre><code>Vai trò   Product Owner (ưu tiên) · Scrum Master (quy trình) · Nhóm
Sự kiện   Sprint · Họp lập Sprint · Standup hằng ngày · Review · Retro
Artifact  Product Backlog -> Sprint Backlog -> Increment (bản gia tăng)
</code></pre>
<p>Scrum bàn giao một <strong>bản gia tăng</strong> chạy được sau mỗi sprint ngắn (1-4 tuần) và lập lại kế hoạch mỗi lần — lý tưởng khi yêu cầu bất định (xây luật phát hiện mới) nhưng khó hơn cho việc tuân thủ hạn chót cố định, nơi kế hoạch dự đoán thường hợp hơn.</p>
<div class="callout"><span class="badge">Chọn theo độ bất định</span> Dự đoán cho việc rõ ràng, hướng tuân thủ; thích ứng (Scrum) cho việc khám phá, đổi nhanh. Nhiều chương trình bảo mật thực tế trộn cả hai (hybrid).</div>`,
  ]]);

const c8q = quiz('spm401-quiz-8', 'Quiz 8 — Closing/Agile|||Quiz 8 — Kết thúc/Agile', [
  { id: 'q1', question: 'Hoạt động nào KHÔNG thuộc giai đoạn kết thúc dự án?', options: ['Lấy nghiệm thu chính thức sản phẩm', 'Đóng hợp đồng và giải phóng nguồn lực', 'Ghi lại bài học kinh nghiệm', 'Lập đường cơ sở chi phí lần đầu'], correctIndex: 3, explanation: 'Lập cost baseline thuộc lập kế hoạch; kết thúc gồm nghiệm thu, đóng hợp đồng, giải phóng nguồn lực, bài học.' },
  { id: 'q2', question: 'Trong Scrum, ai chịu trách nhiệm sắp thứ tự ưu tiên của Product Backlog?', options: ['Scrum Master', 'Product Owner', 'Toàn bộ khách hàng', 'Kiểm toán viên'], correctIndex: 1, explanation: 'Product Owner sở hữu và ưu tiên hoá Product Backlog; Scrum Master lo quy trình.' },
  { id: 'q3', question: 'Khi nào vòng đời dự đoán (predictive) thường hợp hơn Scrum?', options: ['Khi yêu cầu thay đổi liên tục', 'Khi việc đã rõ ràng, hướng tuân thủ với hạn chót cố định', 'Khi không có bên liên quan', 'Khi không cần chất lượng'], correctIndex: 1, explanation: 'Việc rõ ràng, tuân thủ, hạn chót cố định hợp kế hoạch dự đoán; việc bất định hợp Scrum.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'SPM401',
    slug: 'spm401-security-project-management',
    title: 'Security Project Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SPM401.webp',
    shortDescription: 'Running an information-security project end to end — life cycle, charter & stakeholders, WBS & scheduling, risk, cost & procurement, quality & safety, monitoring, change control & compliance (RMF/ISO 27001), closing & Agile/Scrum. Bilingual, with quizzes.|||Quản lý dự án an toàn thông tin trọn vòng đời — charter & bên liên quan, WBS & lịch trình, rủi ro, chi phí & mua sắm, chất lượng, giám sát & kiểm soát thay đổi, tuân thủ (RMF/ISO 27001), kết thúc & Agile/Scrum. Song ngữ, có quiz.',
    description: 'Môn <strong>SPM401 — Security Project Management</strong> (kỳ 7) dạy cách <strong>lập kế hoạch, điều hành và kết thúc một dự án an toàn thông tin</strong>. Từ <strong>vòng đời &amp; nhóm quy trình</strong> → <strong>khởi tạo</strong> (charter, bên liên quan, phạm vi) → <strong>lập kế hoạch</strong> (WBS, lịch trình, ước lượng) → <strong>rủi ro</strong> → <strong>nguồn lực, chi phí &amp; mua sắm</strong> → <strong>thực thi &amp; chất lượng/an toàn</strong> → <strong>giám sát, kiểm soát thay đổi &amp; tuân thủ (RMF/ISO 27001)</strong> → <strong>kết thúc, bài học &amp; Agile/Scrum</strong>. Bám giáo trình PMBOK, ISO 21500, Whitman/Mattord &amp; Schwalbe; song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Vòng đời dự án &amp; năm nhóm quy trình PMBOK; project charter &amp; phân tích bên liên quan (ma trận quyền lực/quan tâm); tuyên bố phạm vi &amp; chống scope creep; WBS, đường găng, Gantt, ước lượng PERT; quản lý rủi ro (định tính P×I, định lượng EMV, ứng phó); ma trận RACI, đường cơ sở chi phí, loại hợp đồng mua sắm; QA vs QC &amp; an toàn thay đổi; EVM (SPI/CPI), kiểm soát thay đổi (CCB); tuân thủ NIST RMF &amp; ISO 27001; kết thúc dự án, bài học kinh nghiệm và Agile/Scrum.',
    requirements: 'Kiến thức nền về an toàn thông tin (khái niệm rủi ro, biện pháp kiểm soát) và tin học đại cương. Không cần lập trình.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, ISO/NIST, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Dự án là gì, ràng buộc ba, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vòng đời dự án|||Chapter 1 — Project life cycle', description: 'Nhóm quy trình PMBOK, predictive vs adaptive.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khởi tạo & phạm vi|||Chapter 2 — Initiating & scope', description: 'Charter, bên liên quan, scope, scope creep.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lập kế hoạch|||Chapter 3 — Planning', description: 'WBS, đường găng, Gantt, ước lượng PERT.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quản lý rủi ro|||Chapter 4 — Risk management', description: 'Nhận diện, P×I, EMV, chiến lược ứng phó, sổ rủi ro.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nguồn lực, chi phí & mua sắm|||Chapter 5 — Resource, cost & procurement', description: 'RACI, cost baseline, quỹ dự phòng, hợp đồng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thực thi & chất lượng|||Chapter 6 — Executing & quality', description: 'Dẫn dắt nhóm, QA vs QC, an toàn thay đổi.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giám sát & tuân thủ|||Chapter 7 — Monitoring & compliance', description: 'EVM, CCB, NIST RMF, ISO 27001 trong dự án.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kết thúc & Agile|||Chapter 8 — Closing & Agile', description: 'Nghiệm thu, bài học, chuyển giao, Scrum.', lessons: [c8, c8q] },
  ],
};
