/**
 * ISP490 — IS Capstone Project (Đồ án tốt nghiệp Hệ thống thông tin).
 * Khung song ngữ theo QUY TRÌNH ĐỒ ÁN TỐT NGHIỆP end-to-end (không phải 8
 * chương lý thuyết): 8 giai đoạn từ chọn đề tài → bảo vệ trước hội đồng.
 * Nguồn: Sommerville (Software Engineering), quy định đồ án tốt nghiệp FPTU
 * (FLM), chuẩn trích dẫn APA/IEEE. KHÔNG upload PDF.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG nested backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('isp490-0-0-tai-lieu', '📚 Materials &amp; references|||📚 Tài liệu tham khảo',
  'Trung tâm tài liệu: quy định đồ án tốt nghiệp (FLM), sách nền tảng (Sommerville, PMBOK), chuẩn trích dẫn APA/IEEE, công cụ, lộ trình làm đồ án.',
  [[
    `<span class="eyebrow">ISP490 · Materials</span>
<h2>Capstone materials &amp; resource hub</h2>
<p class="lead">Everything you need to run an <strong>IS graduation capstone</strong> end-to-end — from picking a topic to defending it before a committee — in one place. The official capstone regulations, templates and rubric live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Regulations, templates &amp; rubric</h3>
<p>The FPTU capstone regulation, report template and grading rubric for ISP490 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account. Always build against the template your term actually uses.</p>
<h3>📗 Foundation books</h3>
<ul>
<li><a href="https://software-engineering-book.com/" target="_blank" rel="noopener">Ian Sommerville, <em>Software Engineering</em></a> — requirements, design, testing, project management.</li>
<li><a href="https://www.pmi.org/pmbok-guide-standards" target="_blank" rel="noopener">PMI <em>PMBOK Guide</em></a> — project scope, schedule and risk.</li>
<li><a href="https://agilemanifesto.org/" target="_blank" rel="noopener">The Agile Manifesto &amp; Scrum Guide</a> — iterative delivery.</li>
</ul>
<h3>🌐 Citation &amp; writing standards</h3>
<ul>
<li><a href="https://apastyle.apa.org/" target="_blank" rel="noopener">APA Style (apastyle.apa.org)</a> — author-date citation.</li>
<li><a href="https://www.ieee.org/content/dam/ieee-org/ieee/web/org/conferences/style_references_manual.pdf" target="_blank" rel="noopener">IEEE Reference Style</a> — numbered citation used in most CS reports.</li>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — free reference manager.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.draw.io/" target="_blank" rel="noopener">draw.io / diagrams.net</a> — UML, ERD, architecture diagrams.</li>
<li><a href="https://www.overleaf.com/" target="_blank" rel="noopener">Overleaf</a> — LaTeX report writing.</li>
<li><a href="https://github.com/" target="_blank" rel="noopener">GitHub Projects</a> — backlog, sprint board, milestones.</li>
</ul>
<div class="callout"><span class="badge">How to use this course</span>
<ol>
<li><strong>Follow the 8 phases in order</strong> — each one is a real capstone stage with a deliverable.</li>
<li><strong>Produce the artifact</strong> named in each phase (proposal, SRS, design, plan, code, test report, thesis, slides).</li>
<li><strong>Check against the FLM rubric</strong> before every milestone review.</li>
<li><strong>Rehearse the defense</strong> — the committee grades the report AND the presentation.</li>
</ol></div>`,
    `<span class="eyebrow">ISP490 · Tài liệu</span>
<h2>Trung tâm tài liệu đồ án tốt nghiệp</h2>
<p class="lead">Mọi thứ để làm một <strong>đồ án tốt nghiệp Hệ thống thông tin</strong> trọn vẹn — từ chọn đề tài đến bảo vệ trước hội đồng — gom về một chỗ. Quy định, mẫu báo cáo và rubric chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Quy định, mẫu &amp; rubric</h3>
<p>Quy định đồ án tốt nghiệp FPTU, mẫu báo cáo và rubric chấm điểm của ISP490 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU. Luôn dựng theo đúng mẫu của kỳ bạn đang học.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://software-engineering-book.com/" target="_blank" rel="noopener">Ian Sommerville, <em>Software Engineering</em></a> — yêu cầu, thiết kế, kiểm thử, quản lý dự án.</li>
<li><a href="https://www.pmi.org/pmbok-guide-standards" target="_blank" rel="noopener">PMI <em>PMBOK Guide</em></a> — phạm vi, tiến độ và rủi ro dự án.</li>
<li><a href="https://agilemanifesto.org/" target="_blank" rel="noopener">Tuyên ngôn Agile &amp; Scrum Guide</a> — phát triển lặp.</li>
</ul>
<h3>🌐 Chuẩn trích dẫn &amp; viết</h3>
<ul>
<li><a href="https://apastyle.apa.org/" target="_blank" rel="noopener">APA Style (apastyle.apa.org)</a> — trích dẫn tác giả-năm.</li>
<li><a href="https://www.ieee.org/content/dam/ieee-org/ieee/web/org/conferences/style_references_manual.pdf" target="_blank" rel="noopener">Chuẩn trích dẫn IEEE</a> — trích dẫn đánh số dùng nhiều trong báo cáo CNTT.</li>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — phần mềm quản lý tài liệu tham khảo miễn phí.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.draw.io/" target="_blank" rel="noopener">draw.io / diagrams.net</a> — sơ đồ UML, ERD, kiến trúc.</li>
<li><a href="https://www.overleaf.com/" target="_blank" rel="noopener">Overleaf</a> — viết báo cáo bằng LaTeX.</li>
<li><a href="https://github.com/" target="_blank" rel="noopener">GitHub Projects</a> — backlog, bảng sprint, milestone.</li>
</ul>
<div class="callout"><span class="badge">Cách dùng môn này</span>
<ol>
<li><strong>Làm 8 giai đoạn theo thứ tự</strong> — mỗi giai đoạn là một chặng đồ án thật, có sản phẩm bàn giao.</li>
<li><strong>Tạo ra đúng tài liệu</strong> mỗi giai đoạn nêu (đề cương, SRS, thiết kế, kế hoạch, mã, báo cáo kiểm thử, luận văn, slide).</li>
<li><strong>Đối chiếu rubric FLM</strong> trước mỗi buổi review milestone.</li>
<li><strong>Tập bảo vệ</strong> — hội đồng chấm cả báo cáo LẪN phần trình bày.</li>
</ol></div>`,
  ]]);

const intro = doc('isp490-0-1-overview', 'Course overview: the graduation capstone|||Tổng quan: đồ án tốt nghiệp',
  'Đồ án tốt nghiệp là gì; deliverable qua từng giai đoạn; hội đồng bảo vệ & phản biện; rubric chấm điểm; 8 giai đoạn end-to-end.',
  [[
    `<span class="eyebrow">ISP490 · Lesson 0.1 · Overview</span>
<h2>The IS graduation capstone</h2>
<p class="lead">ISP490 is not a lecture course — it is the <strong>graduation capstone</strong> where you plan, build and defend a complete information system. You act as a real project team: pick a problem, gather requirements, design and implement a solution, test it, write a thesis, and defend it before an examination committee.</p>
<h3>What you actually deliver</h3>
<ul>
<li><strong>Proposal</strong> — topic, scope, supervisor, timeline.</li>
<li><strong>SRS</strong> — requirement analysis document.</li>
<li><strong>Design</strong> — architecture, database, UML models.</li>
<li><strong>Project plan</strong> — Agile backlog, sprints, milestones.</li>
<li><strong>Working system</strong> — the implemented product.</li>
<li><strong>Test &amp; QA report</strong> — evidence it works.</li>
<li><strong>Thesis</strong> — the final written report.</li>
<li><strong>Defense</strong> — slides + live presentation to the committee.</li>
</ul>
<h3>How it is graded</h3>
<pre><code>Capstone rubric (typical weighting)
  Product / implementation .......... 30%
  Report (thesis) quality ........... 25%
  Analysis &amp; design ................. 20%
  Presentation &amp; defense ............ 15%
  Process &amp; teamwork ................ 10%
The committee = supervisor + reviewer (phản biện) + chair.
</code></pre>
<div class="callout"><span class="badge">Mindset</span> The committee judges evidence, not effort. Every claim in your defense must be backed by an artifact — a diagram, a test result, a metric, a commit.</div>`,
    `<span class="eyebrow">ISP490 · Bài 0.1 · Tổng quan</span>
<h2>Đồ án tốt nghiệp Hệ thống thông tin</h2>
<p class="lead">ISP490 không phải môn lý thuyết — đây là <strong>đồ án tốt nghiệp</strong> nơi bạn lập kế hoạch, xây dựng và bảo vệ một hệ thống thông tin hoàn chỉnh. Bạn làm việc như một nhóm dự án thật: chọn bài toán, khảo sát yêu cầu, thiết kế và hiện thực giải pháp, kiểm thử, viết luận văn và bảo vệ trước hội đồng.</p>
<h3>Bạn phải bàn giao những gì</h3>
<ul>
<li><strong>Đề cương (proposal)</strong> — đề tài, phạm vi, giảng viên hướng dẫn, tiến độ.</li>
<li><strong>SRS</strong> — tài liệu phân tích yêu cầu.</li>
<li><strong>Thiết kế</strong> — kiến trúc, cơ sở dữ liệu, mô hình UML.</li>
<li><strong>Kế hoạch dự án</strong> — backlog Agile, sprint, milestone.</li>
<li><strong>Hệ thống chạy được</strong> — sản phẩm đã hiện thực.</li>
<li><strong>Báo cáo kiểm thử &amp; QA</strong> — bằng chứng nó hoạt động.</li>
<li><strong>Luận văn</strong> — báo cáo tốt nghiệp cuối cùng.</li>
<li><strong>Bảo vệ</strong> — slide + trình bày trực tiếp trước hội đồng.</li>
</ul>
<h3>Chấm điểm thế nào</h3>
<pre><code>Rubric đồ án (trọng số điển hình)
  Sản phẩm / hiện thực .............. 30%
  Chất lượng báo cáo (luận văn) ..... 25%
  Phân tích &amp; thiết kế .............. 20%
  Trình bày &amp; bảo vệ ................ 15%
  Quy trình &amp; làm nhóm ............. 10%
Hội đồng = GV hướng dẫn + phản biện + chủ tịch.
</code></pre>
<div class="callout"><span class="badge">Tư duy</span> Hội đồng chấm bằng chứng, không chấm công sức. Mọi khẳng định khi bảo vệ phải có tài liệu chống lưng — một sơ đồ, một kết quả test, một chỉ số, một commit.</div>`,
  ]]);

const p1 = doc('isp490-1-1-proposal', 'Phase 1 — Topic, supervisor &amp; proposal|||Giai đoạn 1 — Đề tài, GVHD &amp; đề cương',
  'Chọn đề tài đúng tầm, tìm giảng viên hướng dẫn, viết đề cương: bối cảnh, vấn đề, mục tiêu, phạm vi, phương pháp, kế hoạch sơ bộ.',
  [[
    `<span class="eyebrow">ISP490 · Phase 1</span>
<h2>Topic selection, supervisor &amp; proposal</h2>
<p>The capstone starts with a <strong>problem worth solving</strong> and a supervisor who can guide it. A good topic is specific, feasible in one semester, and lets you demonstrate IS skills (analysis, database, integration), not just coding.</p>
<h3>Picking a topic that fits</h3>
<ul>
<li><strong>Real problem</strong> — a pain a stakeholder actually has.</li>
<li><strong>Right scope</strong> — buildable by your team in the term. Too big is the #1 capstone failure.</li>
<li><strong>Measurable outcome</strong> — you can state when it is "done".</li>
</ul>
<h3>The proposal document</h3>
<pre><code>PROPOSAL / ĐỀ CƯƠNG (outline)
 1. Title &amp; team members
 2. Context &amp; problem statement
 3. Objectives (SMART) &amp; expected outcomes
 4. Scope: in-scope / out-of-scope
 5. Proposed approach &amp; technology
 6. Preliminary plan (milestones)
 7. References
Signed off by the supervisor before work begins.
</code></pre>
<div class="callout"><span class="badge">Supervisor tip</span> Come to your supervisor with a one-paragraph problem statement and 2-3 candidate topics, not a blank page. Agreeing scope early prevents rework later.</div>`,
    `<span class="eyebrow">ISP490 · Giai đoạn 1</span>
<h2>Chọn đề tài, giảng viên hướng dẫn &amp; đề cương</h2>
<p>Đồ án bắt đầu từ một <strong>vấn đề đáng giải quyết</strong> và một giảng viên hướng dẫn (GVHD) có thể dẫn dắt. Đề tài tốt thì cụ thể, khả thi trong một kỳ, và cho phép bạn thể hiện kỹ năng HTTT (phân tích, cơ sở dữ liệu, tích hợp), không chỉ code.</p>
<h3>Chọn đề tài vừa tầm</h3>
<ul>
<li><strong>Vấn đề thật</strong> — nỗi đau mà một bên liên quan thực sự có.</li>
<li><strong>Phạm vi hợp lý</strong> — nhóm bạn làm xong trong kỳ. Ôm quá to là nguyên nhân trượt đồ án số một.</li>
<li><strong>Kết quả đo được</strong> — nêu rõ khi nào thì "xong".</li>
</ul>
<h3>Tài liệu đề cương</h3>
<pre><code>ĐỀ CƯƠNG / PROPOSAL (khung)
 1. Tên đề tài &amp; thành viên nhóm
 2. Bối cảnh &amp; phát biểu vấn đề
 3. Mục tiêu (SMART) &amp; kết quả kỳ vọng
 4. Phạm vi: trong / ngoài phạm vi
 5. Cách tiếp cận &amp; công nghệ đề xuất
 6. Kế hoạch sơ bộ (milestone)
 7. Tài liệu tham khảo
GVHD duyệt trước khi bắt đầu làm.
</code></pre>
<div class="callout"><span class="badge">Mẹo với GVHD</span> Đến gặp GVHD với một đoạn phát biểu vấn đề và 2-3 đề tài ứng viên, đừng đến tay trắng. Chốt phạm vi sớm tránh làm lại về sau.</div>`,
  ]]);

const p1q = quiz('isp490-quiz-1', 'Quiz 1 — Đề tài &amp; đề cương', [
  { id: 'q1', question: 'Nguyên nhân trượt đồ án tốt nghiệp phổ biến nhất khi chọn đề tài là?', options: ['Đề tài quá nhỏ', 'Phạm vi quá lớn, không làm xong trong kỳ', 'Có GVHD', 'Viết đề cương'], correctIndex: 1, explanation: 'Ôm phạm vi quá to là lỗi số một; đề tài phải khả thi trong một kỳ.' },
  { id: 'q2', question: 'Mục tiêu SMART trong đề cương nên như thế nào?', options: ['Mơ hồ để dễ đạt', 'Cụ thể, đo được', 'Không cần đo', 'Do hội đồng đặt'], correctIndex: 1, explanation: 'SMART = cụ thể, đo được, khả thi, liên quan, có thời hạn.' },
  { id: 'q3', question: 'Ai duyệt đề cương trước khi nhóm bắt đầu làm?', options: ['Chủ tịch hội đồng', 'Giảng viên phản biện', 'Giảng viên hướng dẫn (GVHD)', 'Phòng đào tạo'], correctIndex: 2, explanation: 'GVHD ký duyệt đề cương và chốt phạm vi trước khi triển khai.' },
]);

const p2 = doc('isp490-2-1-survey-requirements', 'Phase 2 — Current-state survey &amp; requirements|||Giai đoạn 2 — Khảo sát hiện trạng &amp; yêu cầu',
  'Khảo sát hiện trạng, tổng quan tài liệu (literature review), thu thập & phân tích yêu cầu; viết SRS: yêu cầu chức năng/phi chức năng, use case.',
  [[
    `<span class="eyebrow">ISP490 · Phase 2</span>
<h2>Current-state survey &amp; requirement analysis</h2>
<p>Before designing, you must understand the <strong>current state</strong> (how the problem is handled today, what systems exist) and review <strong>related work</strong>. Then you elicit and document requirements in an <strong>SRS</strong> (Software Requirements Specification).</p>
<h3>Gathering requirements</h3>
<ul>
<li><strong>Elicitation</strong> — interviews, observation, existing documents, surveys.</li>
<li><strong>Literature review</strong> — existing systems/solutions and their gaps (cite sources).</li>
<li><strong>Functional requirements</strong> — what the system must do.</li>
<li><strong>Non-functional requirements</strong> — performance, security, usability, scalability.</li>
</ul>
<h3>SRS structure &amp; use cases</h3>
<pre><code>SRS (outline)
 1. Introduction &amp; scope
 2. Current-state analysis
 3. Functional requirements (FR-01, FR-02, ...)
 4. Non-functional requirements (NFR)
 5. Use case model + descriptions
 6. Constraints &amp; assumptions

Use case: "Place order"
  Actor: Customer
  Pre:  logged in, cart not empty
  Main: select payment -&gt; confirm -&gt; system creates order
  Post: order saved, confirmation sent
</code></pre>
<div class="callout"><span class="badge">Sommerville</span> Requirements are the foundation — a fault fixed at requirements stage costs a fraction of the same fault found after implementation.</div>`,
    `<span class="eyebrow">ISP490 · Giai đoạn 2</span>
<h2>Khảo sát hiện trạng &amp; phân tích yêu cầu</h2>
<p>Trước khi thiết kế, bạn phải hiểu <strong>hiện trạng</strong> (vấn đề đang được xử lý ra sao, có hệ thống nào) và <strong>tổng quan tài liệu</strong> (literature review). Sau đó thu thập và ghi lại yêu cầu trong <strong>SRS</strong> (Đặc tả yêu cầu phần mềm).</p>
<h3>Thu thập yêu cầu</h3>
<ul>
<li><strong>Khai thác (elicitation)</strong> — phỏng vấn, quan sát, tài liệu sẵn có, khảo sát.</li>
<li><strong>Tổng quan tài liệu</strong> — hệ thống/giải pháp đã có và khoảng trống của chúng (trích dẫn nguồn).</li>
<li><strong>Yêu cầu chức năng</strong> — hệ thống phải làm gì.</li>
<li><strong>Yêu cầu phi chức năng</strong> — hiệu năng, bảo mật, khả dụng, mở rộng.</li>
</ul>
<h3>Cấu trúc SRS &amp; use case</h3>
<pre><code>SRS (khung)
 1. Giới thiệu &amp; phạm vi
 2. Phân tích hiện trạng
 3. Yêu cầu chức năng (FR-01, FR-02, ...)
 4. Yêu cầu phi chức năng (NFR)
 5. Mô hình use case + mô tả
 6. Ràng buộc &amp; giả định

Use case: "Đặt hàng"
  Tác nhân: Khách hàng
  Trước: đã đăng nhập, giỏ không rỗng
  Chính: chọn thanh toán -&gt; xác nhận -&gt; hệ thống tạo đơn
  Sau:  lưu đơn, gửi xác nhận
</code></pre>
<div class="callout"><span class="badge">Sommerville</span> Yêu cầu là nền móng — một lỗi sửa ở giai đoạn yêu cầu tốn một phần nhỏ so với chính lỗi đó phát hiện sau khi đã hiện thực.</div>`,
  ]]);

const p2q = quiz('isp490-quiz-2', 'Quiz 2 — Khảo sát &amp; yêu cầu', [
  { id: 'q1', question: '"Thời gian phản hồi dưới 2 giây" là loại yêu cầu nào?', options: ['Yêu cầu chức năng', 'Yêu cầu phi chức năng', 'Use case', 'Đề cương'], correctIndex: 1, explanation: 'Hiệu năng là yêu cầu phi chức năng (NFR); chức năng nói hệ thống làm gì.' },
  { id: 'q2', question: 'Mục đích chính của tổng quan tài liệu (literature review) là?', options: ['Làm dày báo cáo', 'Hiểu giải pháp đã có và khoảng trống của chúng', 'Thay cho khảo sát hiện trạng', 'Viết use case'], correctIndex: 1, explanation: 'Literature review chỉ ra hệ thống/giải pháp hiện có và khoảng trống đề tài lấp.' },
  { id: 'q3', question: 'Theo Sommerville, sửa một lỗi yêu cầu sớm so với sửa sau khi đã hiện thực thì?', options: ['Đắt hơn nhiều', 'Rẻ hơn nhiều', 'Chi phí như nhau', 'Không sửa được'], correctIndex: 1, explanation: 'Lỗi bắt ở giai đoạn yêu cầu rẻ hơn nhiều so với bắt sau khi code xong.' },
]);

const p3 = doc('isp490-3-1-analysis-design', 'Phase 3 — System analysis &amp; design|||Giai đoạn 3 — Phân tích &amp; thiết kế hệ thống',
  'Thiết kế kiến trúc (layered, client-server), mô hình dữ liệu (ERD, chuẩn hoá), UML (class, sequence, activity), thiết kế giao diện.',
  [[
    `<span class="eyebrow">ISP490 · Phase 3</span>
<h2>System analysis &amp; design</h2>
<p>Design turns requirements into a <strong>blueprint</strong> for building. You decide the architecture, model the data, and specify behavior with UML — enough that another developer could implement it.</p>
<h3>Architecture &amp; data</h3>
<ul>
<li><strong>Architecture</strong> — layered / client-server / microservices; pick and justify.</li>
<li><strong>Database</strong> — Entity-Relationship Diagram (ERD), then normalize (usually to 3NF) to remove redundancy.</li>
<li><strong>UML models</strong> — class diagram (structure), sequence diagram (interaction), activity diagram (flow).</li>
</ul>
<h3>Example: a simple class model</h3>
<pre><code>+-------------+        +-------------+
|  Customer   | 1    * |   Order     |
+-------------+--------+-------------+
| id          |        | id          |
| name        |        | customerId  |
| email       |        | total       |
+-------------+        | createdAt   |
                       +-------------+
Layered architecture:
  Presentation -&gt; Business Logic -&gt; Data Access -&gt; DB
</code></pre>
<div class="callout"><span class="badge">Traceability</span> Every design element should trace back to a requirement (FR/NFR). If a table or screen serves no requirement, question why it exists.</div>`,
    `<span class="eyebrow">ISP490 · Giai đoạn 3</span>
<h2>Phân tích &amp; thiết kế hệ thống</h2>
<p>Thiết kế biến yêu cầu thành <strong>bản vẽ</strong> để xây dựng. Bạn quyết định kiến trúc, mô hình hoá dữ liệu và đặc tả hành vi bằng UML — đủ để một lập trình viên khác có thể hiện thực.</p>
<h3>Kiến trúc &amp; dữ liệu</h3>
<ul>
<li><strong>Kiến trúc</strong> — phân lớp / client-server / microservices; chọn và biện giải.</li>
<li><strong>Cơ sở dữ liệu</strong> — sơ đồ thực thể - liên kết (ERD), rồi chuẩn hoá (thường tới 3NF) để loại dư thừa.</li>
<li><strong>Mô hình UML</strong> — sơ đồ lớp (cấu trúc), sơ đồ tuần tự (tương tác), sơ đồ hoạt động (luồng).</li>
</ul>
<h3>Ví dụ: mô hình lớp đơn giản</h3>
<pre><code>+-------------+        +-------------+
|  Customer   | 1    * |   Order     |
+-------------+--------+-------------+
| id          |        | id          |
| name        |        | customerId  |
| email       |        | total       |
+-------------+        | createdAt   |
                       +-------------+
Kiến trúc phân lớp:
  Giao diện -&gt; Nghiệp vụ -&gt; Truy cập dữ liệu -&gt; CSDL
</code></pre>
<div class="callout"><span class="badge">Truy vết</span> Mọi thành phần thiết kế phải truy về được một yêu cầu (FR/NFR). Một bảng hay màn hình không phục vụ yêu cầu nào thì phải hỏi vì sao nó tồn tại.</div>`,
  ]]);

const p3q = quiz('isp490-quiz-3', 'Quiz 3 — Phân tích &amp; thiết kế', [
  { id: 'q1', question: 'Chuẩn hoá cơ sở dữ liệu tới 3NF chủ yếu để?', options: ['Tăng dư thừa', 'Loại dư thừa và bất thường dữ liệu', 'Vẽ UML', 'Tăng tốc mạng'], correctIndex: 1, explanation: 'Chuẩn hoá loại dư thừa và tránh anomaly khi thêm/sửa/xoá.' },
  { id: 'q2', question: 'Sơ đồ UML nào mô tả tương tác giữa các đối tượng theo thời gian?', options: ['Sơ đồ lớp (class)', 'Sơ đồ tuần tự (sequence)', 'ERD', 'Sơ đồ triển khai'], correctIndex: 1, explanation: 'Sequence diagram thể hiện chuỗi thông điệp giữa các đối tượng theo thời gian.' },
  { id: 'q3', question: 'Nguyên tắc "truy vết" trong thiết kế nghĩa là?', options: ['Ghi log hệ thống', 'Mỗi thành phần thiết kế truy về được một yêu cầu', 'Theo dõi người dùng', 'Debug bằng breakpoint'], correctIndex: 1, explanation: 'Traceability: mỗi phần thiết kế phải gắn với một FR/NFR cụ thể.' },
]);

const p4 = doc('isp490-4-1-planning', 'Phase 4 — Project planning &amp; management|||Giai đoạn 4 — Lập kế hoạch &amp; quản lý dự án',
  'Quản lý dự án Agile/Scrum: product backlog, sprint, milestone, phân công, quản lý rủi ro, theo dõi tiến độ (burndown, Gantt).',
  [[
    `<span class="eyebrow">ISP490 · Phase 4</span>
<h2>Project planning &amp; management</h2>
<p>A capstone is a real project with a deadline, a team and risks. Most teams run <strong>Agile/Scrum</strong>: break work into a backlog, deliver in short <strong>sprints</strong>, and hit <strong>milestones</strong> the committee reviews.</p>
<h3>Agile essentials</h3>
<ul>
<li><strong>Product backlog</strong> — prioritized list of features (user stories).</li>
<li><strong>Sprint</strong> — a 1-2 week cycle producing a working increment.</li>
<li><strong>Milestones</strong> — the review gates your term defines (proposal, design, mid-term, final).</li>
<li><strong>Risk management</strong> — identify, assess, plan mitigation early.</li>
</ul>
<h3>A milestone plan</h3>
<pre><code>Milestone plan (14-week term)
  W1-2   Proposal approved            [M1]
  W3-4   SRS baseline                 [M2]
  W5-6   Design complete              [M3]
  W7-11  Implementation (sprints)     [M4]
  W12    Testing &amp; QA report          [M5]
  W13    Thesis draft
  W14    Defense                      [M6]

Risk register: [likelihood x impact] -&gt; mitigation
  Scope creep    | H x H | freeze backlog after M2
  Member drops   | M x H | pair on critical modules
</code></pre>
<div class="callout"><span class="badge">Track it</span> Use a burndown chart or GitHub Projects board so the supervisor can see progress at any point — "trust me it's fine" is not evidence.</div>`,
    `<span class="eyebrow">ISP490 · Giai đoạn 4</span>
<h2>Lập kế hoạch &amp; quản lý dự án</h2>
<p>Đồ án là một dự án thật, có deadline, có nhóm và có rủi ro. Đa số nhóm chạy <strong>Agile/Scrum</strong>: chia việc thành backlog, giao hàng theo <strong>sprint</strong> ngắn, và cán <strong>milestone</strong> để hội đồng review.</p>
<h3>Cốt lõi Agile</h3>
<ul>
<li><strong>Product backlog</strong> — danh sách tính năng ưu tiên (user story).</li>
<li><strong>Sprint</strong> — chu kỳ 1-2 tuần cho ra một phần chạy được.</li>
<li><strong>Milestone</strong> — các mốc review kỳ bạn quy định (đề cương, thiết kế, giữa kỳ, cuối kỳ).</li>
<li><strong>Quản lý rủi ro</strong> — nhận diện, đánh giá, lên phương án giảm thiểu sớm.</li>
</ul>
<h3>Kế hoạch milestone</h3>
<pre><code>Kế hoạch milestone (kỳ 14 tuần)
  T1-2   Duyệt đề cương               [M1]
  T3-4   Chốt SRS                     [M2]
  T5-6   Xong thiết kế                [M3]
  T7-11  Hiện thực (theo sprint)      [M4]
  T12    Kiểm thử &amp; báo cáo QA        [M5]
  T13    Bản nháp luận văn
  T14    Bảo vệ                       [M6]

Sổ rủi ro: [khả năng x tác động] -&gt; giảm thiểu
  Phình phạm vi | Cao x Cao | đóng băng backlog sau M2
  Mất thành viên| TB x Cao  | ghép cặp ở module then chốt
</code></pre>
<div class="callout"><span class="badge">Theo dõi</span> Dùng burndown hoặc bảng GitHub Projects để GVHD thấy tiến độ bất cứ lúc nào — "cứ tin em, ổn mà" không phải bằng chứng.</div>`,
  ]]);

const p4q = quiz('isp490-quiz-4', 'Quiz 4 — Kế hoạch &amp; quản lý', [
  { id: 'q1', question: 'Trong Scrum, một "sprint" là gì?', options: ['Toàn bộ đồ án', 'Chu kỳ ngắn cho ra một phần chạy được', 'Buổi bảo vệ', 'Sơ đồ Gantt'], correctIndex: 1, explanation: 'Sprint là chu kỳ 1-2 tuần tạo ra một increment chạy được.' },
  { id: 'q2', question: 'Product backlog là?', options: ['Danh sách lỗi', 'Danh sách tính năng ưu tiên (user story)', 'Báo cáo kiểm thử', 'Sổ rủi ro'], correctIndex: 1, explanation: 'Backlog là danh sách công việc/tính năng đã sắp ưu tiên.' },
  { id: 'q3', question: 'Cách xử lý rủi ro "phình phạm vi" (scope creep) hợp lý là?', options: ['Nhận mọi yêu cầu mới', 'Đóng băng backlog sau khi chốt phạm vi', 'Bỏ kiểm thử', 'Kéo dài vô hạn'], correctIndex: 1, explanation: 'Đóng băng phạm vi/backlog sau milestone chốt giúp chặn phình phạm vi.' },
]);

const p5 = doc('isp490-5-1-implementation', 'Phase 5 — System implementation|||Giai đoạn 5 — Hiện thực hệ thống',
  'Hiện thực: coding standard, version control (Git), code review, tích hợp liên tục, quản lý cấu hình; biến thiết kế thành sản phẩm chạy được.',
  [[
    `<span class="eyebrow">ISP490 · Phase 5</span>
<h2>System implementation</h2>
<p>Now you build the product from the design. The grade rewards a <strong>working, maintainable system</strong> — clean code, disciplined version control, and evidence of engineering practice, not a last-minute pile of files.</p>
<h3>Engineering discipline</h3>
<ul>
<li><strong>Version control</strong> — Git with meaningful commits and branches; the history is evidence of who did what.</li>
<li><strong>Coding standards</strong> — consistent naming, structure, comments.</li>
<li><strong>Code review</strong> — pull requests reviewed by a teammate before merge.</li>
<li><strong>Continuous integration</strong> — build/test on every push to catch breakage early.</li>
</ul>
<h3>A sane Git workflow</h3>
<pre><code>main            (always deployable)
  |
  +-- feature/order-checkout   -&gt; PR -&gt; review -&gt; merge
  +-- feature/admin-report     -&gt; PR -&gt; review -&gt; merge

Commit style:
  feat(order): add checkout with VNPay
  fix(auth): reject expired token
</code></pre>
<div class="callout"><span class="badge">Map to the SRS</span> Implement features in requirement/priority order so that even if you run short on time, the must-have requirements (FR-01...) are done first.</div>`,
    `<span class="eyebrow">ISP490 · Giai đoạn 5</span>
<h2>Hiện thực hệ thống</h2>
<p>Giờ bạn xây sản phẩm từ thiết kế. Điểm thưởng cho một <strong>hệ thống chạy được, dễ bảo trì</strong> — code sạch, quản lý phiên bản kỷ luật, và bằng chứng thực hành kỹ thuật, không phải một đống file dồn phút chót.</p>
<h3>Kỷ luật kỹ thuật</h3>
<ul>
<li><strong>Quản lý phiên bản</strong> — Git với commit và nhánh có ý nghĩa; lịch sử là bằng chứng ai làm gì.</li>
<li><strong>Chuẩn code</strong> — đặt tên, cấu trúc, chú thích nhất quán.</li>
<li><strong>Code review</strong> — pull request được đồng đội duyệt trước khi merge.</li>
<li><strong>Tích hợp liên tục (CI)</strong> — build/test mỗi lần push để bắt lỗi sớm.</li>
</ul>
<h3>Quy trình Git lành mạnh</h3>
<pre><code>main            (luôn deploy được)
  |
  +-- feature/order-checkout   -&gt; PR -&gt; review -&gt; merge
  +-- feature/admin-report     -&gt; PR -&gt; review -&gt; merge

Kiểu commit:
  feat(order): thêm thanh toán VNPay
  fix(auth): từ chối token hết hạn
</code></pre>
<div class="callout"><span class="badge">Bám SRS</span> Hiện thực tính năng theo thứ tự ưu tiên yêu cầu, để dù thiếu thời gian thì các yêu cầu bắt buộc (FR-01...) vẫn xong trước.</div>`,
  ]]);

const p5q = quiz('isp490-quiz-5', 'Quiz 5 — Hiện thực', [
  { id: 'q1', question: 'Vì sao lịch sử commit Git quan trọng với đồ án nhóm?', options: ['Làm đẹp repo', 'Là bằng chứng ai đóng góp gì', 'Thay cho báo cáo', 'Không cần thiết'], correctIndex: 1, explanation: 'Lịch sử Git cho hội đồng/GVHD thấy đóng góp thật của từng thành viên.' },
  { id: 'q2', question: 'Code review trước khi merge nhằm?', options: ['Làm chậm dự án', 'Bắt lỗi và giữ chất lượng code sớm', 'Thay thế kiểm thử', 'Tăng số commit'], correctIndex: 1, explanation: 'Review giúp phát hiện lỗi/nợ kỹ thuật trước khi vào nhánh chính.' },
  { id: 'q3', question: 'Nên hiện thực tính năng theo thứ tự nào khi thời gian eo hẹp?', options: ['Ngẫu nhiên', 'Theo ưu tiên yêu cầu, làm must-have trước', 'Dễ trước, không theo ưu tiên', 'Đẹp giao diện trước'], correctIndex: 1, explanation: 'Làm yêu cầu bắt buộc (must-have) trước để đảm bảo phần lõi hoàn thành.' },
]);

const p6 = doc('isp490-6-1-testing-qa', 'Phase 6 — Testing, evaluation &amp; QA|||Giai đoạn 6 — Kiểm thử, đánh giá &amp; QA',
  'Kiểm thử: unit/integration/system/UAT, test case, độ phủ, kiểm thử phi chức năng; đánh giá kết quả so với yêu cầu; viết báo cáo kiểm thử.',
  [[
    `<span class="eyebrow">ISP490 · Phase 6</span>
<h2>Testing, evaluation &amp; quality assurance</h2>
<p>Testing produces the <strong>evidence</strong> that your system meets its requirements. You plan test cases, execute them, record results, and evaluate the product against the SRS and non-functional targets.</p>
<h3>Levels of testing</h3>
<ul>
<li><strong>Unit</strong> — individual functions/classes.</li>
<li><strong>Integration</strong> — modules working together.</li>
<li><strong>System</strong> — the whole system against requirements.</li>
<li><strong>UAT</strong> — user acceptance, ideally with a real stakeholder.</li>
</ul>
<h3>A test case &amp; report</h3>
<pre><code>Test case TC-07 (maps to FR-03 "Place order")
  Steps:    login -&gt; add item -&gt; checkout -&gt; pay
  Expected: order created, status = PAID
  Actual:   order created, status = PAID
  Result:   PASS

Test report summary
  Total: 42 | Pass: 40 | Fail: 2 | Coverage: 78%
  Open defects: 2 (both low severity, logged)
</code></pre>
<div class="callout"><span class="badge">Evaluate honestly</span> A capstone with known, logged limitations reads as mature engineering. Hiding failing cases and getting caught in the defense is far worse.</div>`,
    `<span class="eyebrow">ISP490 · Giai đoạn 6</span>
<h2>Kiểm thử, đánh giá &amp; đảm bảo chất lượng</h2>
<p>Kiểm thử tạo ra <strong>bằng chứng</strong> rằng hệ thống đáp ứng yêu cầu. Bạn lập test case, thực thi, ghi kết quả và đánh giá sản phẩm so với SRS cùng các chỉ tiêu phi chức năng.</p>
<h3>Các mức kiểm thử</h3>
<ul>
<li><strong>Đơn vị (unit)</strong> — từng hàm/lớp.</li>
<li><strong>Tích hợp</strong> — các module phối hợp với nhau.</li>
<li><strong>Hệ thống</strong> — toàn hệ thống so với yêu cầu.</li>
<li><strong>UAT</strong> — nghiệm thu người dùng, tốt nhất có bên liên quan thật.</li>
</ul>
<h3>Test case &amp; báo cáo</h3>
<pre><code>Test case TC-07 (ánh xạ FR-03 "Đặt hàng")
  Bước:     đăng nhập -&gt; thêm hàng -&gt; checkout -&gt; trả tiền
  Kỳ vọng:  tạo đơn, trạng thái = PAID
  Thực tế:  tạo đơn, trạng thái = PAID
  Kết quả:  ĐẠT

Tóm tắt báo cáo kiểm thử
  Tổng: 42 | Đạt: 40 | Trượt: 2 | Độ phủ: 78%
  Lỗi còn mở: 2 (đều mức nhẹ, đã ghi nhận)
</code></pre>
<div class="callout"><span class="badge">Đánh giá trung thực</span> Một đồ án nêu rõ giới hạn đã ghi nhận trông rất chín về kỹ thuật. Giấu case trượt rồi bị bắt lúc bảo vệ thì tệ hơn nhiều.</div>`,
  ]]);

const p6q = quiz('isp490-quiz-6', 'Quiz 6 — Kiểm thử &amp; QA', [
  { id: 'q1', question: 'Kiểm thử ở mức "tích hợp" (integration) kiểm cái gì?', options: ['Từng hàm riêng lẻ', 'Các module phối hợp với nhau', 'Toàn hệ thống với người dùng', 'Giao diện màu sắc'], correctIndex: 1, explanation: 'Integration test kiểm việc các module ghép nối và làm việc cùng nhau.' },
  { id: 'q2', question: 'UAT (User Acceptance Testing) tốt nhất nên có?', options: ['Chỉ nhóm tự kiểm', 'Bên liên quan/người dùng thật nghiệm thu', 'Chỉ GVHD', 'Không ai'], correctIndex: 1, explanation: 'UAT là nghiệm thu bởi người dùng/bên liên quan thực tế.' },
  { id: 'q3', question: 'Cách xử lý các lỗi còn tồn khi bảo vệ nên là?', options: ['Giấu đi', 'Ghi nhận rõ ràng và nêu giới hạn', 'Xoá test case trượt', 'Đổ cho công cụ'], correctIndex: 1, explanation: 'Ghi nhận lỗi và giới hạn thể hiện sự chín về kỹ thuật; giấu là rủi ro.' },
]);

const p7 = doc('isp490-7-1-thesis-writing', 'Phase 7 — Writing the thesis|||Giai đoạn 7 — Viết báo cáo tốt nghiệp',
  'Cấu trúc luận văn (mở đầu → tổng quan → phân tích/thiết kế → hiện thực → kiểm thử → kết luận), trích dẫn APA/IEEE, chống đạo văn, hình/bảng.',
  [[
    `<span class="eyebrow">ISP490 · Phase 7</span>
<h2>Writing the graduation thesis</h2>
<p>The thesis is the <strong>permanent record</strong> of your project — it must let a reader understand the problem, your solution, and the evidence, without watching you present. Follow the FLM template and cite everything you did not invent.</p>
<h3>Thesis structure</h3>
<pre><code>THESIS (typical chapters)
  1. Introduction (problem, objectives, scope)
  2. Literature / current-state review
  3. Requirement analysis (from SRS)
  4. System analysis &amp; design (UML, ERD)
  5. Implementation
  6. Testing &amp; evaluation
  7. Conclusion &amp; future work
  References + Appendices
</code></pre>
<h3>Citations &amp; integrity</h3>
<ul>
<li><strong>APA</strong> — author-date, e.g. (Sommerville, 2015).</li>
<li><strong>IEEE</strong> — numbered, e.g. [1], with a matching reference list.</li>
<li><strong>Plagiarism</strong> — quote/paraphrase with a citation; never copy without attribution. Most terms run a similarity check.</li>
</ul>
<div class="callout"><span class="badge">Figures earn their place</span> Every diagram and table must be numbered, captioned, and referenced in the text ("as shown in Figure 3.2"). Decoration without reference is noise.</div>`,
    `<span class="eyebrow">ISP490 · Giai đoạn 7</span>
<h2>Viết báo cáo tốt nghiệp (luận văn)</h2>
<p>Luận văn là <strong>bản ghi vĩnh viễn</strong> của đồ án — phải để người đọc hiểu vấn đề, giải pháp và bằng chứng mà không cần nghe bạn trình bày. Theo đúng mẫu FLM và trích dẫn mọi thứ bạn không tự nghĩ ra.</p>
<h3>Cấu trúc luận văn</h3>
<pre><code>LUẬN VĂN (các chương điển hình)
  1. Mở đầu (vấn đề, mục tiêu, phạm vi)
  2. Tổng quan / hiện trạng
  3. Phân tích yêu cầu (từ SRS)
  4. Phân tích &amp; thiết kế (UML, ERD)
  5. Hiện thực
  6. Kiểm thử &amp; đánh giá
  7. Kết luận &amp; hướng phát triển
  Tài liệu tham khảo + Phụ lục
</code></pre>
<h3>Trích dẫn &amp; liêm chính</h3>
<ul>
<li><strong>APA</strong> — tác giả-năm, vd (Sommerville, 2015).</li>
<li><strong>IEEE</strong> — đánh số, vd [1], kèm danh mục tham khảo tương ứng.</li>
<li><strong>Đạo văn</strong> — trích/diễn giải phải có trích dẫn; không sao chép mà không ghi nguồn. Đa số kỳ có kiểm tra độ tương đồng.</li>
</ul>
<div class="callout"><span class="badge">Hình phải có chỗ đứng</span> Mọi sơ đồ và bảng phải được đánh số, có chú thích, và được nhắc trong văn bản ("như Hình 3.2"). Trang trí mà không nhắc tới là nhiễu.</div>`,
  ]]);

const p7q = quiz('isp490-quiz-7', 'Quiz 7 — Viết luận văn', [
  { id: 'q1', question: 'Trích dẫn kiểu (Sommerville, 2015) thuộc chuẩn nào?', options: ['IEEE', 'APA (tác giả-năm)', 'MLA số', 'Không chuẩn'], correctIndex: 1, explanation: 'APA dùng dạng tác giả-năm; IEEE dùng đánh số [1].' },
  { id: 'q2', question: 'Vì sao mỗi hình/bảng phải được nhắc trong văn bản?', options: ['Cho đủ trang', 'Để người đọc biết nó minh hoạ điều gì; nếu không là nhiễu', 'Bắt buộc phải màu', 'Để tăng độ tương đồng'], correctIndex: 1, explanation: 'Hình/bảng phải được đánh số, chú thích và tham chiếu trong văn bản.' },
  { id: 'q3', question: 'Diễn giải ý của người khác trong luận văn thì?', options: ['Không cần ghi nguồn', 'Vẫn phải trích dẫn nguồn', 'Chỉ ghi nếu sao chép nguyên văn', 'Ghi vào phụ lục là đủ'], correctIndex: 1, explanation: 'Cả trích nguyên văn lẫn diễn giải đều phải trích dẫn để tránh đạo văn.' },
]);

const p8 = doc('isp490-8-1-defense', 'Phase 8 — Slides, defense &amp; Q&amp;A|||Giai đoạn 8 — Slide, bảo vệ &amp; phản biện',
  'Chuẩn bị slide bảo vệ, demo hệ thống, trình bày trong thời gian giới hạn, trả lời phản biện của hội đồng, quản lý câu hỏi khó.',
  [[
    `<span class="eyebrow">ISP490 · Phase 8</span>
<h2>Slides, defense &amp; committee Q&amp;A</h2>
<p>The defense is where you present the project to the committee (supervisor, reviewer/phản biện, chair) and answer their questions. You have limited time — every slide must earn its place, and the live demo must actually work.</p>
<h3>Slide deck outline</h3>
<pre><code>DEFENSE DECK (~12-15 slides, ~15 min)
  1. Title, team, supervisor
  2. Problem &amp; motivation
  3. Objectives &amp; scope
  4. Related work (1 slide)
  5. Requirements (highlights)
  6. Architecture &amp; design (key diagrams)
  7. Live DEMO (the star of the show)
  8. Testing results &amp; evaluation
  9. Contributions per member
 10. Limitations &amp; future work
 11. Conclusion + Q&amp;A
</code></pre>
<h3>Handling the Q&amp;A (phản biện)</h3>
<ul>
<li><strong>Listen fully</strong> before answering; restate the question if unsure.</li>
<li><strong>Answer with evidence</strong> — point to a diagram, a metric, a test.</li>
<li><strong>"I don't know" beats bluffing</strong> — say what you would do to find out.</li>
<li><strong>Have a backup</strong> — record the demo in case the live one fails.</li>
</ul>
<div class="callout"><span class="badge">Rehearse</span> Time your talk, pre-load the demo, and prepare answers to the obvious hard questions (security, scalability, why this tech). The committee grades the report AND the presentation.</div>`,
    `<span class="eyebrow">ISP490 · Giai đoạn 8</span>
<h2>Slide, bảo vệ &amp; hỏi đáp hội đồng</h2>
<p>Bảo vệ là lúc bạn trình bày đồ án trước hội đồng (GVHD, phản biện, chủ tịch) và trả lời câu hỏi của họ. Thời gian có hạn — mỗi slide phải xứng chỗ đứng, và bản demo trực tiếp phải chạy thật.</p>
<h3>Khung bộ slide</h3>
<pre><code>SLIDE BẢO VỆ (~12-15 slide, ~15 phút)
  1. Tên đề tài, nhóm, GVHD
  2. Vấn đề &amp; động lực
  3. Mục tiêu &amp; phạm vi
  4. Công trình liên quan (1 slide)
  5. Yêu cầu (điểm nổi bật)
  6. Kiến trúc &amp; thiết kế (sơ đồ then chốt)
  7. DEMO trực tiếp (ngôi sao buổi bảo vệ)
  8. Kết quả kiểm thử &amp; đánh giá
  9. Đóng góp từng thành viên
 10. Giới hạn &amp; hướng phát triển
 11. Kết luận + Hỏi đáp
</code></pre>
<h3>Xử lý phản biện (Q&amp;A)</h3>
<ul>
<li><strong>Nghe hết câu hỏi</strong> rồi hãy trả lời; nếu chưa rõ thì nhắc lại câu hỏi.</li>
<li><strong>Trả lời bằng bằng chứng</strong> — chỉ vào sơ đồ, chỉ số, kết quả test.</li>
<li><strong>"Em chưa biết" hơn là bịa</strong> — nói cách bạn sẽ tìm ra câu trả lời.</li>
<li><strong>Có phương án dự phòng</strong> — quay video demo phòng khi bản trực tiếp hỏng.</li>
</ul>
<div class="callout"><span class="badge">Tập trước</span> Bấm giờ, nạp sẵn demo, và chuẩn bị câu trả lời cho những câu khó rõ ràng (bảo mật, khả năng mở rộng, vì sao chọn công nghệ này). Hội đồng chấm cả báo cáo LẪN phần trình bày.</div>`,
  ]]);

const p8q = quiz('isp490-quiz-8', 'Quiz 8 — Bảo vệ &amp; phản biện', [
  { id: 'q1', question: 'Trong slide bảo vệ, phần nào thường là "ngôi sao"?', options: ['Trang bìa', 'Demo hệ thống trực tiếp', 'Danh mục tham khảo', 'Lời cảm ơn'], correctIndex: 1, explanation: 'Demo trực tiếp cho hội đồng thấy sản phẩm chạy thật là điểm nhấn.' },
  { id: 'q2', question: 'Khi bị hỏi một câu bạn không biết trả lời, tốt nhất nên?', options: ['Bịa cho qua', 'Thừa nhận chưa biết và nói cách sẽ tìm ra', 'Im lặng', 'Đổi chủ đề'], correctIndex: 1, explanation: 'Thành thật và nêu hướng tìm câu trả lời tốt hơn là bịa và bị bắt.' },
  { id: 'q3', question: 'Vì sao nên quay sẵn video demo?', options: ['Để không phải nói', 'Làm phương án dự phòng nếu demo trực tiếp hỏng', 'Thay cho slide', 'Bắt buộc nộp'], correctIndex: 1, explanation: 'Video dự phòng cứu buổi bảo vệ khi demo trực tiếp gặp sự cố.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'ISP490',
    slug: 'isp490-is-capstone-project',
    title: 'IS Capstone Project',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ISP490.webp',
    shortDescription: 'Run an IS graduation capstone end-to-end: topic & proposal, survey & requirements, analysis & design, Agile planning, implementation, testing & QA, thesis writing, and defense. Bilingual, with templates & quizzes.|||Làm đồ án tốt nghiệp HTTT trọn vẹn: đề tài & đề cương, khảo sát & yêu cầu, phân tích & thiết kế, kế hoạch Agile, hiện thực, kiểm thử & QA, viết luận văn, và bảo vệ. Song ngữ, có mẫu & quiz.',
    description: 'Môn <strong>ISP490 — IS Capstone Project</strong> (Đồ án tốt nghiệp Hệ thống thông tin, kỳ 9) dẫn bạn qua <strong>quy trình đồ án tốt nghiệp end-to-end</strong> theo 8 giai đoạn thật: (1) chọn đề tài, tìm GVHD &amp; viết đề cương → (2) khảo sát hiện trạng &amp; phân tích yêu cầu (SRS) → (3) phân tích &amp; thiết kế (kiến trúc, CSDL, UML) → (4) lập kế hoạch &amp; quản lý dự án (Agile/Scrum) → (5) hiện thực hệ thống → (6) kiểm thử, đánh giá &amp; QA → (7) viết luận văn (trích dẫn APA/IEEE) → (8) chuẩn bị slide, bảo vệ &amp; phản biện. Bám Sommerville, quy định đồ án tốt nghiệp FPTU (FLM) và chuẩn trích dẫn APA/IEEE; song ngữ, có mẫu đề cương/UML/kế hoạch/rubric và quiz mỗi giai đoạn.',
    whatYouLearn: 'Chọn đề tài vừa tầm &amp; viết đề cương; khảo sát hiện trạng, literature review, viết SRS (FR/NFR, use case); thiết kế kiến trúc, ERD/chuẩn hoá, UML; lập kế hoạch Agile (backlog, sprint, milestone, quản lý rủi ro); hiện thực với Git/CI/code review; kiểm thử (unit/integration/system/UAT) &amp; báo cáo QA; viết luận văn theo mẫu FLM với trích dẫn APA/IEEE; chuẩn bị slide, demo, bảo vệ và trả lời phản biện.',
    requirements: 'Đã học các môn nền (phân tích thiết kế hệ thống, cơ sở dữ liệu, lập trình, quản lý dự án). Xem điều kiện tiên quyết trong khung chương trình ngành Hệ thống thông tin trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Materials', description: 'Quy định đồ án & rubric (FLM), Sommerville/PMBOK, chuẩn APA/IEEE, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đồ án tốt nghiệp, deliverable, hội đồng bảo vệ, rubric.', lessons: [intro] },
    { title: 'GĐ 1 — Đề tài & đề cương|||Phase 1 — Topic & proposal', description: 'Chọn đề tài, tìm GVHD, viết proposal.', lessons: [p1, p1q] },
    { title: 'GĐ 2 — Khảo sát & yêu cầu|||Phase 2 — Survey & requirements', description: 'Hiện trạng, literature review, SRS.', lessons: [p2, p2q] },
    { title: 'GĐ 3 — Phân tích & thiết kế|||Phase 3 — Analysis & design', description: 'Kiến trúc, ERD, UML.', lessons: [p3, p3q] },
    { title: 'GĐ 4 — Kế hoạch & quản lý|||Phase 4 — Planning & management', description: 'Agile/Scrum, milestone, rủi ro.', lessons: [p4, p4q] },
    { title: 'GĐ 5 — Hiện thực|||Phase 5 — Implementation', description: 'Git, CI, code review, coding standard.', lessons: [p5, p5q] },
    { title: 'GĐ 6 — Kiểm thử & QA|||Phase 6 — Testing & QA', description: 'Unit/integration/system/UAT, báo cáo.', lessons: [p6, p6q] },
    { title: 'GĐ 7 — Viết luận văn|||Phase 7 — Thesis writing', description: 'Cấu trúc luận văn, APA/IEEE, đạo văn.', lessons: [p7, p7q] },
    { title: 'GĐ 8 — Bảo vệ & phản biện|||Phase 8 — Defense & Q&A', description: 'Slide, demo, trình bày, trả lời hội đồng.', lessons: [p8, p8q] },
  ],
};
