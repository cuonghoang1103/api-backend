/**
 * ISP392 — Information System Programming Project (Đồ án Lập trình Hệ thống
 * thông tin). Ngành Hệ thống thông tin, FPTU, Kỳ 5. Đây là môn ĐỒ ÁN phần
 * mềm theo nhóm — khung bám QUY TRÌNH PHÁT TRIỂN PHẦN MỀM THỰC TẾ (SDLC),
 * KHÔNG phải 8 chương lý thuyết. 8 chương = 8 GIAI ĐOẠN SDLC, mỗi giai đoạn
 * 1 document song ngữ + 1 quiz 3 câu (giải thích tiếng Việt).
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG nested backtick/${; "&"→&amp; "<"→&lt; ">"→&gt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức giai đoạn.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('isp392-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Sommerville), Scrum Guide, tài liệu Git & CI/CD, công cụ, quy trình nộp đồ án.',
  [[
    `<span class="eyebrow">ISP392 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to run a real software project end-to-end — requirements, planning, design, coding, testing, deploy and defense — in one place. The official slides &amp; rubric live on <strong>FLM</strong>; below are free, legal references. <strong>No PDF uploads</strong> — links only.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU slides, project template and grading rubric for ISP392 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://software-engineering-book.com/" target="_blank" rel="noopener">Ian Sommerville — <em>Software Engineering</em> (10th ed.)</a> — the standard SDLC reference.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Pragmatic_Programmer" target="_blank" rel="noopener"><em>The Pragmatic Programmer</em> — Hunt &amp; Thomas</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://scrumguides.org/" target="_blank" rel="noopener">The Scrum Guide (scrumguides.org)</a> — the definitive Agile/Scrum framework.</li>
<li><a href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">Pro Git book (git-scm.com)</a> — version control, branching, workflows.</li>
<li><a href="https://docs.github.com/en/actions" target="_blank" rel="noopener">GitHub Actions docs</a> — CI/CD pipelines.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — UI/UX wireframes &amp; prototypes.</li>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — ERD / database schema design.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> / <a href="https://github.com/features/issues" target="_blank" rel="noopener">GitHub Projects</a> — backlog &amp; sprint boards.</li>
</ul>
<div class="callout"><span class="badge">How this course flows</span>
<ol>
<li><strong>Understand the problem</strong> — survey users, write the SRS (requirements).</li>
<li><strong>Plan</strong> — pick the stack, split the backlog into sprints, assign roles.</li>
<li><strong>Design</strong> — architecture, database (ERD), UML, UI/UX and API contract.</li>
<li><strong>Build</strong> — backend + database, then frontend + integration.</li>
<li><strong>Prove it works</strong> — unit/integration/UAT testing and bug-fixing.</li>
<li><strong>Ship &amp; defend</strong> — deploy, document, write the report, present.</li>
</ol></div>`,
    `<span class="eyebrow">ISP392 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để chạy một đồ án phần mềm trọn vòng — yêu cầu, kế hoạch, thiết kế, code, kiểm thử, triển khai và bảo vệ — gom về một chỗ. Slide &amp; rubric chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp. <strong>Không upload PDF</strong> — chỉ để link.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Slide chính thức, mẫu đồ án và bảng chấm (rubric) của ISP392 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://software-engineering-book.com/" target="_blank" rel="noopener">Ian Sommerville — <em>Software Engineering</em> (bản 10)</a> — sách chuẩn về SDLC.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Pragmatic_Programmer" target="_blank" rel="noopener"><em>The Pragmatic Programmer</em> — Hunt &amp; Thomas</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://scrumguides.org/" target="_blank" rel="noopener">The Scrum Guide (scrumguides.org)</a> — khung Agile/Scrum chuẩn.</li>
<li><a href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">Sách Pro Git (git-scm.com)</a> — quản lý phiên bản, nhánh, quy trình.</li>
<li><a href="https://docs.github.com/en/actions" target="_blank" rel="noopener">Tài liệu GitHub Actions</a> — pipeline CI/CD.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — wireframe &amp; prototype UI/UX.</li>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — thiết kế ERD / lược đồ CSDL.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> / <a href="https://github.com/features/issues" target="_blank" rel="noopener">GitHub Projects</a> — backlog &amp; bảng sprint.</li>
</ul>
<div class="callout"><span class="badge">Môn này chảy thế nào</span>
<ol>
<li><strong>Hiểu bài toán</strong> — khảo sát người dùng, viết SRS (đặc tả yêu cầu).</li>
<li><strong>Lập kế hoạch</strong> — chọn công nghệ, chia backlog thành sprint, phân vai.</li>
<li><strong>Thiết kế</strong> — kiến trúc, CSDL (ERD), UML, UI/UX và hợp đồng API.</li>
<li><strong>Xây dựng</strong> — backend + database, rồi frontend + tích hợp.</li>
<li><strong>Chứng minh chạy đúng</strong> — kiểm thử unit/integration/UAT và sửa lỗi.</li>
<li><strong>Ship &amp; bảo vệ</strong> — deploy, viết tài liệu, báo cáo, thuyết trình.</li>
</ol></div>`,
  ]]);

const intro = doc('isp392-0-1-overview', 'Course overview: a real software project, start to finish|||Tổng quan: một đồ án phần mềm trọn vòng',
  'ISP392 là môn đồ án NHÓM: xây một hệ thống thông tin thật theo quy trình SDLC. Deliverable chính: SRS, tài liệu thiết kế, mã nguồn chạy được, bộ test, bản deploy, báo cáo và buổi bảo vệ. Chấm theo rubric: quy trình + sản phẩm + đóng góp cá nhân.',
  [[
    `<span class="eyebrow">ISP392 · Lesson 0.1 · Overview</span>
<h2>Information System Programming Project</h2>
<p class="lead">ISP392 is a <strong>team capstone-style project</strong>: your group builds a <strong>real, working information system</strong> (e.g. a booking site, a school management portal, an e-commerce shop) by following a full <strong>Software Development Life Cycle (SDLC)</strong>. This is not a theory course — you ship software.</p>
<h3>What you deliver (deliverables)</h3>
<ul>
<li><strong>SRS</strong> — Software Requirements Specification (functional + non-functional requirements, use cases).</li>
<li><strong>Design docs</strong> — architecture, database ERD, UML diagrams, UI/UX mockups, API contract.</li>
<li><strong>Source code</strong> — a running backend, database and frontend in a Git repository.</li>
<li><strong>Test artifacts</strong> — test plan, test cases, and results (unit / integration / UAT).</li>
<li><strong>Deployment</strong> — the app running on a server or cloud, plus a README/setup guide.</li>
<li><strong>Final report &amp; defense</strong> — a written report and an oral presentation to the council.</li>
</ul>
<h3>How you're graded (rubric)</h3>
<pre><code>Typical ISP392 weighting (see FLM for the exact rubric):
  Process        ~30%  Scrum artifacts, sprint logs, Git history, teamwork
  Product        ~40%  Working features vs. the SRS, code quality, DB design
  Documentation  ~15%  SRS, design docs, test docs, final report
  Defense        ~15%  Presentation, Q&amp;A, individual contribution
</code></pre>
<div class="callout"><span class="badge">Key mindset</span> Grades reward <strong>the process, not just the demo</strong>. A polished 5-minute demo backed by no requirements, no tests and one person's commits scores far worse than a modest app with a clean SRS, real sprints, tests and evenly-shared Git history.</div>`,
    `<span class="eyebrow">ISP392 · Bài 0.1 · Tổng quan</span>
<h2>Đồ án Lập trình Hệ thống thông tin</h2>
<p class="lead">ISP392 là <strong>đồ án tốt nghiệp thu nhỏ theo NHÓM</strong>: nhóm bạn xây một <strong>hệ thống thông tin thật, chạy được</strong> (vd trang đặt lịch, cổng quản lý trường học, sàn thương mại điện tử) bằng cách đi trọn một vòng <strong>quy trình phát triển phần mềm (SDLC)</strong>. Đây không phải môn lý thuyết — bạn phải ra được sản phẩm.</p>
<h3>Bạn phải nộp gì (deliverable)</h3>
<ul>
<li><strong>SRS</strong> — Đặc tả yêu cầu phần mềm (yêu cầu chức năng + phi chức năng, use case).</li>
<li><strong>Tài liệu thiết kế</strong> — kiến trúc, ERD CSDL, sơ đồ UML, mockup UI/UX, hợp đồng API.</li>
<li><strong>Mã nguồn</strong> — backend, database và frontend chạy được trong một kho Git.</li>
<li><strong>Hồ sơ kiểm thử</strong> — kế hoạch test, ca kiểm thử và kết quả (unit / integration / UAT).</li>
<li><strong>Bản triển khai</strong> — ứng dụng chạy trên server hoặc cloud, kèm README/hướng dẫn cài.</li>
<li><strong>Báo cáo &amp; bảo vệ</strong> — báo cáo viết và buổi thuyết trình trước hội đồng.</li>
</ul>
<h3>Chấm điểm thế nào (rubric)</h3>
<pre><code>Trọng số ISP392 điển hình (xem rubric chính xác trên FLM):
  Quy trình     ~30%  Tài liệu Scrum, log sprint, lịch sử Git, làm việc nhóm
  Sản phẩm      ~40%  Chức năng chạy so với SRS, chất lượng code, thiết kế DB
  Tài liệu      ~15%  SRS, tài liệu thiết kế, tài liệu test, báo cáo cuối
  Bảo vệ        ~15%  Thuyết trình, hỏi đáp, đóng góp cá nhân
</code></pre>
<div class="callout"><span class="badge">Tư duy cốt lõi</span> Điểm thưởng cho <strong>quy trình, không chỉ bản demo</strong>. Một demo bóng bẩy 5 phút mà không có yêu cầu, không test và chỉ một người commit sẽ điểm thấp hơn nhiều so với một app vừa phải nhưng có SRS rõ, sprint thật, có test và lịch sử Git chia đều.</div>`,
  ]]);

const s1 = doc('isp392-1-1-requirements', 'Stage 1 — Idea, survey & requirements analysis (SRS)|||Giai đoạn 1 — Ý tưởng, khảo sát & phân tích yêu cầu (SRS)',
  'Chọn ý tưởng khả thi, khảo sát người dùng/đối thủ, gom yêu cầu; phân biệt yêu cầu chức năng và phi chức năng; viết use case và user story; đóng gói thành SRS.',
  [[
    `<span class="eyebrow">ISP392 · Stage 1 · Requirements</span>
<h2>Idea, survey &amp; requirements analysis</h2>
<p>Every project starts with a <strong>problem worth solving</strong>. Before writing a line of code you must understand <em>who</em> the users are, <em>what</em> they need, and <em>why</em>. This is the most important — and most skipped — stage.</p>
<h3>Steps</h3>
<ol>
<li><strong>Pick &amp; validate an idea</strong> — is it feasible in one semester? Is the scope realistic for your team size?</li>
<li><strong>Survey</strong> — interview potential users, study competitor apps, list pain points.</li>
<li><strong>Elicit requirements</strong> — turn findings into concrete requirements.</li>
<li><strong>Write the SRS</strong> — the single source of truth for what will be built.</li>
</ol>
<h3>Functional vs. non-functional</h3>
<ul>
<li><strong>Functional (FR)</strong> — what the system <em>does</em>: "User can register", "Admin can approve a booking".</li>
<li><strong>Non-functional (NFR)</strong> — how <em>well</em> it does it: performance, security, usability, availability. E.g. "A page loads in under 2s", "Passwords are hashed".</li>
</ul>
<h3>User story format</h3>
<pre><code>As a [role], I want [goal] so that [benefit].

Example:
  As a customer, I want to reset my password by email
  so that I can log in again if I forget it.

Acceptance criteria:
  - A reset link is emailed within 1 minute
  - The link expires after 30 minutes
  - After reset, the old password no longer works
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> If a requirement is not <strong>testable</strong>, it is not finished. "The app should be fast" is a wish; "search returns in under 2 seconds for 10k records" is a requirement.</div>`,
    `<span class="eyebrow">ISP392 · Giai đoạn 1 · Yêu cầu</span>
<h2>Ý tưởng, khảo sát &amp; phân tích yêu cầu</h2>
<p>Mọi đồ án bắt đầu từ một <strong>bài toán đáng giải</strong>. Trước khi viết dòng code nào, bạn phải hiểu <em>ai</em> là người dùng, họ cần <em>gì</em>, và <em>vì sao</em>. Đây là giai đoạn quan trọng nhất — và cũng hay bị bỏ qua nhất.</p>
<h3>Các bước</h3>
<ol>
<li><strong>Chọn &amp; kiểm chứng ý tưởng</strong> — làm nổi trong một kỳ không? Phạm vi có vừa sức nhóm không?</li>
<li><strong>Khảo sát</strong> — phỏng vấn người dùng tiềm năng, nghiên cứu app đối thủ, liệt kê điểm đau.</li>
<li><strong>Gom yêu cầu</strong> — biến phát hiện thành yêu cầu cụ thể.</li>
<li><strong>Viết SRS</strong> — nguồn sự thật duy nhất về những gì sẽ xây.</li>
</ol>
<h3>Chức năng và phi chức năng</h3>
<ul>
<li><strong>Chức năng (FR)</strong> — hệ thống <em>làm</em> gì: "Người dùng đăng ký được", "Admin duyệt được một đơn đặt".</li>
<li><strong>Phi chức năng (NFR)</strong> — làm <em>tốt</em> đến đâu: hiệu năng, bảo mật, dễ dùng, sẵn sàng. Vd "Trang tải dưới 2 giây", "Mật khẩu được băm".</li>
</ul>
<h3>Mẫu user story</h3>
<pre><code>Là [vai trò], tôi muốn [mục tiêu] để [lợi ích].

Ví dụ:
  Là khách hàng, tôi muốn đặt lại mật khẩu qua email
  để đăng nhập lại được khi quên mật khẩu.

Tiêu chí chấp nhận:
  - Link đặt lại được gửi trong vòng 1 phút
  - Link hết hạn sau 30 phút
  - Sau khi đặt lại, mật khẩu cũ không dùng được nữa
</code></pre>
<div class="callout"><span class="badge">Kinh nghiệm</span> Một yêu cầu không <strong>kiểm thử được</strong> thì chưa xong. "App nên nhanh" là mong ước; "tìm kiếm trả về dưới 2 giây với 10.000 bản ghi" mới là yêu cầu.</div>`,
  ]]);
const s1q = quiz('isp392-quiz-1', 'Quiz 1 — Requirements & SRS|||Quiz 1 — Yêu cầu & SRS', [
  { id: 'q1', question: 'Yêu cầu nào là PHI CHỨC NĂNG (non-functional)?', options: ['Người dùng đăng nhập được', 'Trang phải tải dưới 2 giây', 'Admin xoá được bài viết', 'Khách đặt được đơn hàng'], correctIndex: 1, explanation: 'Yêu cầu phi chức năng nói hệ thống làm TỐT đến đâu (hiệu năng, bảo mật...), còn "đăng nhập/đặt đơn/xoá" là chức năng — hệ thống LÀM gì.' },
  { id: 'q2', question: 'Đúng cấu trúc một user story?', options: ['Nếu... thì... nếu không...', 'Là [vai trò], tôi muốn [mục tiêu] để [lợi ích]', 'Cho... với... trả về...', 'Bảng dữ liệu gồm các cột...'], correctIndex: 1, explanation: 'User story chuẩn theo mẫu "Là [vai trò], tôi muốn [mục tiêu] để [lợi ích]", giúp gắn tính năng với người dùng và giá trị.' },
  { id: 'q3', question: 'Tài liệu SRS đóng vai trò gì trong đồ án?', options: ['Bản vẽ giao diện chi tiết từng pixel', 'Nguồn sự thật duy nhất về những gì hệ thống phải làm', 'Nhật ký commit Git', 'Kịch bản thuyết trình bảo vệ'], correctIndex: 1, explanation: 'SRS (Software Requirements Specification) là nguồn sự thật duy nhất về yêu cầu; mọi thiết kế, code và test đều đối chiếu lại nó.' },
]);

const s2 = doc('isp392-2-1-planning-stack', 'Stage 2 — Project planning & choosing the tech stack|||Giai đoạn 2 — Lập kế hoạch dự án & chọn công nghệ',
  'Chia backlog thành sprint (Scrum), phân vai nhóm, ước lượng công việc, lập timeline; chọn công nghệ (frontend/backend/database) theo yêu cầu, không theo mốt; dựng kho Git và quy trình nhánh.',
  [[
    `<span class="eyebrow">ISP392 · Stage 2 · Planning</span>
<h2>Project planning &amp; choosing the stack</h2>
<h3>Agile / Scrum in a nutshell</h3>
<p>Instead of building everything then testing at the end (waterfall), you build in short cycles called <strong>sprints</strong> (usually 1–2 weeks). Each sprint delivers a small working increment.</p>
<ul>
<li><strong>Product backlog</strong> — the full prioritized list of user stories.</li>
<li><strong>Sprint backlog</strong> — the stories your team commits to this sprint.</li>
<li><strong>Roles</strong> — Product Owner (priorities), Scrum Master (process), Dev Team (build).</li>
<li><strong>Ceremonies</strong> — planning, daily stand-up, review, retrospective.</li>
</ul>
<pre><code>Sprint plan (example, 2-week sprint):
  Sprint 1  Auth + user profile        (Login, Register, Reset pw)
  Sprint 2  Core feature A             (Create/list/edit bookings)
  Sprint 3  Core feature B + search    (Filter, pagination)
  Sprint 4  Admin panel + reports
  Sprint 5  Polish, testing, deploy
</code></pre>
<h3>Choosing a tech stack</h3>
<p>Pick tools that fit the <strong>requirements and the team's skills</strong> — not the newest hype. A boring, well-documented stack you know beats a trendy one you'll fight all semester.</p>
<pre><code>A common student stack:
  Frontend   React / Next.js  (or plain HTML+JS)
  Backend    Node.js + Express  (or Java Spring, .NET, PHP Laravel)
  Database   PostgreSQL / MySQL  (relational, since it's an IS project)
  Version    Git + GitHub
</code></pre>
<div class="callout"><span class="badge">Git branching</span> Agree on a workflow early: <code>main</code> stays deployable; each feature gets a branch (<code>feature/login</code>), merged via Pull Request after review. Never commit straight to <code>main</code>.</div>`,
    `<span class="eyebrow">ISP392 · Giai đoạn 2 · Kế hoạch</span>
<h2>Lập kế hoạch dự án &amp; chọn công nghệ</h2>
<h3>Agile / Scrum tóm gọn</h3>
<p>Thay vì xây hết rồi test ở cuối (waterfall), bạn xây theo chu kỳ ngắn gọi là <strong>sprint</strong> (thường 1–2 tuần). Mỗi sprint cho ra một phần chạy được.</p>
<ul>
<li><strong>Product backlog</strong> — danh sách đầy đủ user story đã xếp ưu tiên.</li>
<li><strong>Sprint backlog</strong> — các story nhóm cam kết làm trong sprint này.</li>
<li><strong>Vai trò</strong> — Product Owner (ưu tiên), Scrum Master (quy trình), Dev Team (làm).</li>
<li><strong>Nghi thức</strong> — họp kế hoạch, stand-up hằng ngày, review, retrospective.</li>
</ul>
<pre><code>Kế hoạch sprint (ví dụ, sprint 2 tuần):
  Sprint 1  Xác thực + hồ sơ         (Đăng nhập, Đăng ký, Đặt lại mk)
  Sprint 2  Tính năng lõi A          (Tạo/liệt kê/sửa đơn đặt)
  Sprint 3  Tính năng lõi B + tìm    (Lọc, phân trang)
  Sprint 4  Trang admin + báo cáo
  Sprint 5  Hoàn thiện, kiểm thử, deploy
</code></pre>
<h3>Chọn công nghệ (stack)</h3>
<p>Chọn công cụ hợp <strong>yêu cầu và kỹ năng của nhóm</strong> — không chạy theo mốt. Một stack "nhàm" nhưng nhiều tài liệu và bạn đã biết còn hơn một stack thời thượng mà bạn phải vật lộn cả kỳ.</p>
<pre><code>Stack sinh viên hay dùng:
  Frontend   React / Next.js  (hoặc HTML+JS thuần)
  Backend    Node.js + Express  (hoặc Java Spring, .NET, PHP Laravel)
  Database   PostgreSQL / MySQL  (quan hệ, vì đây là đồ án HTTT)
  Phiên bản  Git + GitHub
</code></pre>
<div class="callout"><span class="badge">Nhánh Git</span> Thống nhất quy trình sớm: <code>main</code> luôn deploy được; mỗi tính năng một nhánh (<code>feature/login</code>), gộp qua Pull Request sau khi review. Đừng commit thẳng vào <code>main</code>.</div>`,
  ]]);
const s2q = quiz('isp392-quiz-2', 'Quiz 2 — Planning & stack|||Quiz 2 — Kế hoạch & công nghệ', [
  { id: 'q1', question: 'Trong Scrum, "sprint" là gì?', options: ['Buổi thuyết trình cuối kỳ', 'Một chu kỳ phát triển ngắn (thường 1–2 tuần) cho ra phần chạy được', 'Tên một công cụ vẽ ERD', 'Lệnh gộp nhánh Git'], correctIndex: 1, explanation: 'Sprint là chu kỳ ngắn cố định (thường 1–2 tuần); mỗi sprint giao một phần tăng trưởng (increment) chạy được của sản phẩm.' },
  { id: 'q2', question: 'Tiêu chí ĐÚNG nhất khi chọn công nghệ cho đồ án nhóm?', options: ['Chọn công nghệ mới nhất, thời thượng nhất', 'Chọn theo yêu cầu dự án và kỹ năng sẵn có của nhóm', 'Chọn cái nào nặng nhất để gây ấn tượng', 'Mỗi người chọn một stack khác nhau'], correctIndex: 1, explanation: 'Nên chọn stack hợp yêu cầu và kỹ năng nhóm, nhiều tài liệu; chạy theo mốt dễ tốn cả kỳ để vật lộn.' },
  { id: 'q3', question: 'Thực hành Git nào phù hợp cho nhóm?', options: ['Ai cũng commit thẳng vào main', 'Mỗi tính năng một nhánh, gộp vào main qua Pull Request sau review', 'Chỉ một người được dùng Git', 'Không dùng nhánh, gửi code qua email'], correctIndex: 1, explanation: 'Giữ main luôn deploy được; làm mỗi tính năng trên nhánh riêng và gộp qua Pull Request có review giúp tránh xung đột và giữ chất lượng.' },
]);

const s3 = doc('isp392-3-1-system-design', 'Stage 3 — System design (architecture, database/ERD, UML)|||Giai đoạn 3 — Thiết kế hệ thống (kiến trúc, CSDL/ERD, UML)',
  'Chọn kiến trúc (client–server nhiều lớp); thiết kế CSDL bằng ERD và chuẩn hoá (normalization); mô hình hoá bằng UML (class, sequence, use case) để chốt cấu trúc trước khi code.',
  [[
    `<span class="eyebrow">ISP392 · Stage 3 · Design</span>
<h2>System design</h2>
<h3>Architecture</h3>
<p>Most information systems use a <strong>layered client–server</strong> architecture — the browser (client) talks to a backend server, which talks to a database. Separating layers keeps code maintainable.</p>
<pre><code>Browser (UI)  &lt;--HTTP/JSON--&gt;  Backend API  &lt;--SQL--&gt;  Database
  React                          Express               PostgreSQL
</code></pre>
<h3>Database design &amp; ERD</h3>
<p>An <strong>Entity–Relationship Diagram (ERD)</strong> shows entities (tables), their attributes (columns) and relationships (1–1, 1–N, N–N). Apply <strong>normalization</strong> to remove duplicated data.</p>
<pre><code>ERD (a booking system):
  User (id, name, email, password_hash)
  Room (id, name, capacity, price)
  Booking (id, user_id FK, room_id FK, start_time, end_time, status)

Relationships:
  User (1) ---- (N) Booking      one user makes many bookings
  Room (1) ---- (N) Booking      one room has many bookings
</code></pre>
<h3>UML models</h3>
<ul>
<li><strong>Use-case diagram</strong> — actors and what they can do.</li>
<li><strong>Class diagram</strong> — the object/data structure and relationships.</li>
<li><strong>Sequence diagram</strong> — the order of messages for one scenario (e.g. "place a booking").</li>
</ul>
<div class="callout"><span class="badge">Design before code</span> Fixing a table structure on paper costs minutes; fixing it after 5,000 rows and 20 screens depend on it costs days. Get the ERD reviewed by your team before you build.</div>`,
    `<span class="eyebrow">ISP392 · Giai đoạn 3 · Thiết kế</span>
<h2>Thiết kế hệ thống</h2>
<h3>Kiến trúc</h3>
<p>Hầu hết hệ thống thông tin dùng kiến trúc <strong>client–server nhiều lớp</strong> — trình duyệt (client) nói chuyện với server backend, server nói chuyện với CSDL. Tách lớp giúp code dễ bảo trì.</p>
<pre><code>Trình duyệt (UI)  &lt;--HTTP/JSON--&gt;  Backend API  &lt;--SQL--&gt;  CSDL
  React                            Express             PostgreSQL
</code></pre>
<h3>Thiết kế CSDL &amp; ERD</h3>
<p><strong>Sơ đồ thực thể–liên kết (ERD)</strong> mô tả thực thể (bảng), thuộc tính (cột) và quan hệ (1–1, 1–N, N–N). Áp dụng <strong>chuẩn hoá (normalization)</strong> để loại dữ liệu trùng lặp.</p>
<pre><code>ERD (hệ đặt phòng):
  User (id, name, email, password_hash)
  Room (id, name, capacity, price)
  Booking (id, user_id FK, room_id FK, start_time, end_time, status)

Quan hệ:
  User (1) ---- (N) Booking      một người đặt nhiều đơn
  Room (1) ---- (N) Booking      một phòng có nhiều đơn đặt
</code></pre>
<h3>Mô hình UML</h3>
<ul>
<li><strong>Sơ đồ use-case</strong> — tác nhân và những việc họ làm được.</li>
<li><strong>Sơ đồ lớp (class)</strong> — cấu trúc đối tượng/dữ liệu và quan hệ.</li>
<li><strong>Sơ đồ tuần tự (sequence)</strong> — thứ tự thông điệp cho một kịch bản (vd "đặt phòng").</li>
</ul>
<div class="callout"><span class="badge">Thiết kế trước khi code</span> Sửa cấu trúc bảng trên giấy tốn vài phút; sửa sau khi đã có 5.000 dòng và 20 màn hình phụ thuộc vào nó thì tốn nhiều ngày. Cho nhóm review ERD trước khi xây.</div>`,
  ]]);
const s3q = quiz('isp392-quiz-3', 'Quiz 3 — System design|||Quiz 3 — Thiết kế hệ thống', [
  { id: 'q1', question: 'ERD (sơ đồ thực thể–liên kết) mô tả điều gì?', options: ['Thứ tự thông điệp giữa các đối tượng', 'Thực thể (bảng), thuộc tính và quan hệ giữa chúng', 'Giao diện từng màn hình', 'Lịch chạy sprint'], correctIndex: 1, explanation: 'ERD thể hiện các thực thể (bảng), thuộc tính (cột) và quan hệ (1–1, 1–N, N–N) — nền tảng thiết kế CSDL.' },
  { id: 'q2', question: 'Một người dùng đặt nhiều đơn, mỗi đơn thuộc một người dùng. Đây là quan hệ?', options: ['1–1', '1–N (một–nhiều)', 'N–N (nhiều–nhiều)', 'Không có quan hệ'], correctIndex: 1, explanation: 'Một User có nhiều Booking, mỗi Booking thuộc đúng một User → quan hệ 1–N, thường cài bằng khoá ngoại (FK) user_id trong bảng Booking.' },
  { id: 'q3', question: 'Chuẩn hoá (normalization) CSDL nhằm mục đích chính gì?', options: ['Tăng tốc độ mạng', 'Loại bỏ dữ liệu trùng lặp và giữ tính nhất quán', 'Làm giao diện đẹp hơn', 'Giảm số dòng code frontend'], correctIndex: 1, explanation: 'Chuẩn hoá tách dữ liệu thành các bảng hợp lý để loại trùng lặp và tránh bất thường khi thêm/sửa/xoá, giữ dữ liệu nhất quán.' },
]);

const s4 = doc('isp392-4-1-uiux-api', 'Stage 4 — UI/UX design & the API contract|||Giai đoạn 4 — Thiết kế UI/UX & API',
  'Thiết kế trải nghiệm: wireframe → mockup → prototype (Figma); nguyên tắc UX (nhất quán, phản hồi, phòng lỗi); thống nhất hợp đồng API RESTful (endpoint, method, request/response) giữa frontend và backend trước khi code.',
  [[
    `<span class="eyebrow">ISP392 · Stage 4 · UI/UX &amp; API</span>
<h2>UI/UX design &amp; the API contract</h2>
<h3>From wireframe to prototype</h3>
<ol>
<li><strong>Wireframe</strong> — low-fidelity boxes: where things go, no colors.</li>
<li><strong>Mockup</strong> — high-fidelity visuals: real colors, fonts, spacing.</li>
<li><strong>Prototype</strong> — clickable flow (Figma) to test before coding.</li>
</ol>
<h3>UX principles</h3>
<ul>
<li><strong>Consistency</strong> — same action looks the same everywhere.</li>
<li><strong>Feedback</strong> — every action gets a visible response (loading, success, error).</li>
<li><strong>Error prevention</strong> — validate inputs, confirm destructive actions.</li>
</ul>
<h3>The API contract (REST)</h3>
<p>The frontend and backend teams agree on the <strong>API contract</strong> first — a list of endpoints with their methods, inputs and outputs. Then both sides can build in parallel.</p>
<pre><code>REST API contract (bookings):
  GET    /api/v1/bookings          -&gt; list my bookings
  POST   /api/v1/bookings          -&gt; create a booking
  GET    /api/v1/bookings/:id      -&gt; get one booking
  PUT    /api/v1/bookings/:id      -&gt; update a booking
  DELETE /api/v1/bookings/:id      -&gt; cancel a booking

POST /api/v1/bookings  request body:
  { "roomId": 3, "startTime": "2026-10-01T09:00", "endTime": "..." }
Response 201:
  { "id": 42, "status": "PENDING", ... }
</code></pre>
<div class="callout"><span class="badge">Why contract-first</span> With a fixed contract, the frontend can use fake data and the backend can be tested with tools like Postman — neither waits for the other. Change the contract only by agreement.</div>`,
    `<span class="eyebrow">ISP392 · Giai đoạn 4 · UI/UX &amp; API</span>
<h2>Thiết kế UI/UX &amp; hợp đồng API</h2>
<h3>Từ wireframe đến prototype</h3>
<ol>
<li><strong>Wireframe</strong> — bản khung thô: cái gì nằm ở đâu, chưa có màu.</li>
<li><strong>Mockup</strong> — bản chi tiết: màu, font, khoảng cách thật.</li>
<li><strong>Prototype</strong> — bản bấm được (Figma) để thử trước khi code.</li>
</ol>
<h3>Nguyên tắc UX</h3>
<ul>
<li><strong>Nhất quán</strong> — cùng một hành động thì trông giống nhau ở mọi nơi.</li>
<li><strong>Phản hồi</strong> — mọi thao tác đều có phản hồi thấy được (đang tải, thành công, lỗi).</li>
<li><strong>Phòng lỗi</strong> — kiểm tra dữ liệu nhập, xác nhận trước thao tác nguy hiểm.</li>
</ul>
<h3>Hợp đồng API (REST)</h3>
<p>Nhóm frontend và backend thống nhất <strong>hợp đồng API</strong> trước — danh sách endpoint kèm method, đầu vào, đầu ra. Sau đó hai bên xây song song.</p>
<pre><code>Hợp đồng REST API (đơn đặt):
  GET    /api/v1/bookings          -&gt; liệt kê đơn của tôi
  POST   /api/v1/bookings          -&gt; tạo một đơn đặt
  GET    /api/v1/bookings/:id      -&gt; lấy một đơn
  PUT    /api/v1/bookings/:id      -&gt; cập nhật một đơn
  DELETE /api/v1/bookings/:id      -&gt; huỷ một đơn

POST /api/v1/bookings  thân request:
  { "roomId": 3, "startTime": "2026-10-01T09:00", "endTime": "..." }
Phản hồi 201:
  { "id": 42, "status": "PENDING", ... }
</code></pre>
<div class="callout"><span class="badge">Vì sao chốt hợp đồng trước</span> Có hợp đồng cố định, frontend dùng dữ liệu giả còn backend test bằng Postman — không bên nào phải chờ bên kia. Chỉ đổi hợp đồng khi cả hai đồng ý.</div>`,
  ]]);
const s4q = quiz('isp392-quiz-4', 'Quiz 4 — UI/UX & API|||Quiz 4 — UI/UX & API', [
  { id: 'q1', question: 'Thứ tự đúng khi thiết kế giao diện?', options: ['Prototype → mockup → wireframe', 'Wireframe → mockup → prototype', 'Mockup → wireframe → prototype', 'Code trước, thiết kế sau'], correctIndex: 1, explanation: 'Đi từ thô đến tinh: wireframe (khung) → mockup (chi tiết màu/font) → prototype (bấm được) để thử trước khi code.' },
  { id: 'q2', question: 'Trong REST, muốn TẠO một đơn đặt mới thường dùng method nào?', options: ['GET', 'POST', 'DELETE', 'HEAD'], correctIndex: 1, explanation: 'POST dùng để tạo tài nguyên mới; GET để đọc, PUT/PATCH để cập nhật, DELETE để xoá.' },
  { id: 'q3', question: 'Vì sao nên chốt "hợp đồng API" trước khi code?', options: ['Để frontend và backend xây song song mà không chờ nhau', 'Để không phải viết test', 'Để bỏ qua bước thiết kế CSDL', 'Vì rubric bắt buộc dùng GraphQL'], correctIndex: 0, explanation: 'Hợp đồng API cố định cho phép frontend dùng dữ liệu giả và backend test bằng Postman độc lập, nên hai bên làm song song, giảm phụ thuộc.' },
]);

const s5 = doc('isp392-5-1-backend-database', 'Stage 5 — Building the backend & database|||Giai đoạn 5 — Triển khai backend & database',
  'Dựng CSDL từ ERD (migration); xây API theo lớp (route → service → repository); xác thực/uỷ quyền (hash mật khẩu, JWT); kiểm tra dữ liệu đầu vào; thử endpoint bằng Postman.',
  [[
    `<span class="eyebrow">ISP392 · Stage 5 · Backend</span>
<h2>Building the backend &amp; database</h2>
<h3>From ERD to real tables</h3>
<p>Turn the ERD into actual tables using <strong>migrations</strong> — versioned scripts that create/alter the schema, so every teammate's database matches.</p>
<h3>Layered backend</h3>
<pre><code>Request flow:
  Route      receives HTTP, validates input
    -&gt; Service   business logic ("can this user book this room?")
      -&gt; Repository   talks to the database (SQL / ORM)
</code></pre>
<p>Keeping these layers separate means you can test business logic without a real HTTP request, and swap the database without rewriting routes.</p>
<h3>Auth &amp; validation (non-negotiable)</h3>
<ul>
<li><strong>Hash passwords</strong> — never store plain text; use bcrypt/argon2.</li>
<li><strong>Authentication</strong> — verify identity (login → issue a token, e.g. JWT).</li>
<li><strong>Authorization</strong> — check permission (can this role do this action?).</li>
<li><strong>Validate every input</strong> — never trust data from the client.</li>
</ul>
<pre><code>Example endpoint (create booking):
  POST /api/v1/bookings
  1. Auth middleware: is the token valid? -&gt; who is the user?
  2. Validate body: roomId is a number, times are valid
  3. Service: is the room free in that time range?
  4. Repository: INSERT INTO bookings (...)
  5. Return 201 with the new booking
</code></pre>
<div class="callout"><span class="badge">Test as you build</span> Use <strong>Postman</strong> (or curl) to hit each endpoint the moment it's written — don't wait for the frontend. A route that returns 404 isn't mounted; 401 means it needs auth; 200/201 means it works.</div>`,
    `<span class="eyebrow">ISP392 · Giai đoạn 5 · Backend</span>
<h2>Triển khai backend &amp; database</h2>
<h3>Từ ERD ra bảng thật</h3>
<p>Biến ERD thành bảng thật bằng <strong>migration</strong> — script có phiên bản để tạo/sửa lược đồ, để CSDL của mọi thành viên khớp nhau.</p>
<h3>Backend nhiều lớp</h3>
<pre><code>Luồng xử lý một request:
  Route      nhận HTTP, kiểm tra đầu vào
    -&gt; Service   logic nghiệp vụ ("người này đặt phòng này được không?")
      -&gt; Repository   nói chuyện với CSDL (SQL / ORM)
</code></pre>
<p>Tách các lớp giúp test logic nghiệp vụ mà không cần request HTTP thật, và đổi CSDL mà không phải viết lại route.</p>
<h3>Xác thực &amp; kiểm tra dữ liệu (bắt buộc)</h3>
<ul>
<li><strong>Băm mật khẩu</strong> — không bao giờ lưu dạng thô; dùng bcrypt/argon2.</li>
<li><strong>Xác thực (authentication)</strong> — kiểm tra danh tính (đăng nhập → cấp token, vd JWT).</li>
<li><strong>Uỷ quyền (authorization)</strong> — kiểm tra quyền (vai trò này làm được việc này không?).</li>
<li><strong>Kiểm tra mọi đầu vào</strong> — không bao giờ tin dữ liệu từ client.</li>
</ul>
<pre><code>Ví dụ endpoint (tạo đơn đặt):
  POST /api/v1/bookings
  1. Middleware xác thực: token hợp lệ? -&gt; ai là người dùng?
  2. Kiểm tra body: roomId là số, thời gian hợp lệ
  3. Service: phòng có trống trong khoảng thời gian đó không?
  4. Repository: INSERT INTO bookings (...)
  5. Trả về 201 kèm đơn đặt mới
</code></pre>
<div class="callout"><span class="badge">Vừa xây vừa test</span> Dùng <strong>Postman</strong> (hoặc curl) gọi từng endpoint ngay khi viết xong — đừng chờ frontend. Route trả 404 là chưa mount; 401 là cần xác thực; 200/201 là chạy được.</div>`,
  ]]);
const s5q = quiz('isp392-quiz-5', 'Quiz 5 — Backend & database|||Quiz 5 — Backend & database', [
  { id: 'q1', question: 'Cách lưu mật khẩu người dùng đúng đắn là?', options: ['Lưu dạng văn bản thô cho dễ đối chiếu', 'Băm (hash) bằng bcrypt/argon2 rồi lưu bản băm', 'Lưu trong mã nguồn frontend', 'Gửi qua email để dự phòng'], correctIndex: 1, explanation: 'Không bao giờ lưu mật khẩu thô. Băm một chiều bằng bcrypt/argon2; khi đăng nhập thì so bản băm, kể cả admin cũng không đọc được mật khẩu gốc.' },
  { id: 'q2', question: 'Sự khác nhau giữa authentication và authorization?', options: ['Chúng là một', 'Authentication = kiểm tra danh tính; authorization = kiểm tra quyền', 'Authentication = kiểm tra quyền; authorization = mã hoá', 'Cả hai chỉ dùng cho admin'], correctIndex: 1, explanation: 'Authentication trả lời "bạn là ai" (đăng nhập); authorization trả lời "bạn được làm gì" (kiểm tra vai trò/quyền).' },
  { id: 'q3', question: 'Gọi một endpoint mới bằng Postman trả về HTTP 404 nghĩa là?', options: ['Route chạy tốt', 'Route cần xác thực', 'Route chưa được mount / chưa tồn tại', 'Dữ liệu đầu vào sai'], correctIndex: 2, explanation: '404 = không tìm thấy route (chưa mount / sai đường dẫn). 401 nghĩa là cần xác thực; 200/201 nghĩa là chạy được.' },
]);

const s6 = doc('isp392-6-1-frontend-integration', 'Stage 6 — Building the frontend & integration|||Giai đoạn 6 — Triển khai frontend & tích hợp',
  'Dựng giao diện theo mockup bằng component tái dùng; quản lý trạng thái; gọi API thật thay dữ liệu giả; xử lý ba trạng thái loading/success/error; tích hợp end-to-end và xử lý lỗi tích hợp thường gặp (CORS, sai kiểu dữ liệu).',
  [[
    `<span class="eyebrow">ISP392 · Stage 6 · Frontend</span>
<h2>Building the frontend &amp; integration</h2>
<h3>Build the UI from the mockups</h3>
<p>Turn the Figma mockups into <strong>reusable components</strong> (a Button, a Card, a BookingForm). Manage <strong>state</strong> — the data a screen currently shows — and re-render when it changes.</p>
<h3>Connect to the real API</h3>
<p>Replace the fake data from Stage 4 with real calls to the backend built in Stage 5. Every request has three states you must handle:</p>
<pre><code>Fetching data (every screen):
  loading  -&gt; show a spinner / skeleton
  success  -&gt; render the data
  error    -&gt; show a friendly message + retry

// Example
const res = await fetch('/api/v1/bookings', {
  headers: { Authorization: 'Bearer ' + token }
});
if (!res.ok) showError();
const bookings = await res.json();
</code></pre>
<h3>Integration — where the two halves meet</h3>
<p>Integration is the first time frontend and backend run together. Common problems:</p>
<ul>
<li><strong>CORS errors</strong> — backend must allow requests from the frontend's origin.</li>
<li><strong>Shape mismatch</strong> — frontend expects a field the backend didn't send (that's why the API contract matters).</li>
<li><strong>Auth token</strong> — forgetting to attach the token → every call returns 401.</li>
</ul>
<div class="callout"><span class="badge">Contract is king</span> When frontend and backend disagree, check the <strong>API contract</strong> first: what field name, what type, what status code? Most integration bugs are one side drifting from the agreed shape.</div>`,
    `<span class="eyebrow">ISP392 · Giai đoạn 6 · Frontend</span>
<h2>Triển khai frontend &amp; tích hợp</h2>
<h3>Dựng UI từ mockup</h3>
<p>Biến mockup Figma thành các <strong>component tái dùng</strong> (Button, Card, BookingForm). Quản lý <strong>trạng thái (state)</strong> — dữ liệu màn hình đang hiển thị — và vẽ lại khi nó đổi.</p>
<h3>Kết nối API thật</h3>
<p>Thay dữ liệu giả ở Giai đoạn 4 bằng lời gọi thật tới backend đã xây ở Giai đoạn 5. Mỗi request có ba trạng thái bạn phải xử lý:</p>
<pre><code>Lấy dữ liệu (mọi màn hình):
  loading  -&gt; hiện spinner / skeleton
  success  -&gt; vẽ dữ liệu ra
  error    -&gt; hiện thông báo thân thiện + nút thử lại

// Ví dụ
const res = await fetch('/api/v1/bookings', {
  headers: { Authorization: 'Bearer ' + token }
});
if (!res.ok) showError();
const bookings = await res.json();
</code></pre>
<h3>Tích hợp — nơi hai nửa gặp nhau</h3>
<p>Tích hợp là lần đầu frontend và backend chạy cùng nhau. Lỗi hay gặp:</p>
<ul>
<li><strong>Lỗi CORS</strong> — backend phải cho phép request từ origin của frontend.</li>
<li><strong>Lệch hình dạng dữ liệu</strong> — frontend mong một trường mà backend không gửi (vì thế hợp đồng API mới quan trọng).</li>
<li><strong>Token xác thực</strong> — quên gắn token → mọi lời gọi trả 401.</li>
</ul>
<div class="callout"><span class="badge">Hợp đồng là vua</span> Khi frontend và backend bất đồng, kiểm <strong>hợp đồng API</strong> trước: tên trường gì, kiểu gì, mã trạng thái gì? Đa số lỗi tích hợp là một bên trôi khỏi hình dạng đã thống nhất.</div>`,
  ]]);
const s6q = quiz('isp392-quiz-6', 'Quiz 6 — Frontend & integration|||Quiz 6 — Frontend & tích hợp', [
  { id: 'q1', question: 'Khi gọi API để lấy dữ liệu, frontend nên xử lý những trạng thái nào?', options: ['Chỉ trạng thái thành công', 'loading, success và error', 'Chỉ loading', 'Không cần xử lý gì'], correctIndex: 1, explanation: 'Mỗi lời gọi API có ba trạng thái cần xử lý: đang tải (loading), thành công (success) và lỗi (error) — bỏ sót error khiến app "đứng hình" khi mạng lỗi.' },
  { id: 'q2', question: 'Mọi lời gọi API sau đăng nhập đều trả HTTP 401. Nguyên nhân thường gặp?', options: ['Backend chưa chạy', 'Frontend quên gắn token xác thực vào request', 'CSDL đầy', 'Dùng sai màu nút bấm'], correctIndex: 1, explanation: '401 = chưa xác thực. Nguyên nhân phổ biến là frontend quên đính token (vd header Authorization: Bearer ...) vào request.' },
  { id: 'q3', question: 'Frontend mong có trường "customerName" nhưng backend trả về "userName". Đây là lỗi gì?', options: ['Lỗi CORS', 'Lệch hình dạng dữ liệu — hai bên trôi khỏi hợp đồng API', 'Lỗi cú pháp SQL', 'Lỗi phần cứng'], correctIndex: 1, explanation: 'Đây là lệch hình dạng (shape mismatch) do một bên không theo đúng hợp đồng API đã thống nhất; sửa bằng cách đối chiếu lại tên trường/kiểu trong hợp đồng.' },
]);

const s7 = doc('isp392-7-1-testing', 'Stage 7 — Testing (unit/integration/UAT) & bug-fixing|||Giai đoạn 7 — Kiểm thử (unit/integration/UAT) & sửa lỗi',
  'Các cấp kiểm thử (unit → integration → system → UAT); viết test case từ yêu cầu (input, bước, kết quả mong đợi); phân biệt kiểm thử thủ công và tự động; quy trình theo dõi và sửa lỗi.',
  [[
    `<span class="eyebrow">ISP392 · Stage 7 · Testing</span>
<h2>Testing &amp; bug-fixing</h2>
<h3>Levels of testing</h3>
<ul>
<li><strong>Unit test</strong> — one function/component in isolation (e.g. "does calculatePrice() return the right total?").</li>
<li><strong>Integration test</strong> — several parts together (e.g. "does POST /bookings actually write to the DB?").</li>
<li><strong>System test</strong> — the whole app against the requirements.</li>
<li><strong>UAT (User Acceptance Testing)</strong> — real users check it meets the SRS before release.</li>
</ul>
<h3>Writing a test case</h3>
<pre><code>Test case: TC-BOOK-01  "Cannot double-book a room"
  Precondition: Room 3 booked 09:00-10:00
  Steps:
    1. Log in as another user
    2. Try to book Room 3 at 09:30-10:30
  Expected: request rejected with a clear error
  Actual:   (fill in when run)
  Status:   Pass / Fail
</code></pre>
<h3>Manual vs. automated</h3>
<p>Automated tests (e.g. with Jest) run in seconds and catch regressions every time you change code. Manual/UAT catches usability issues a script can't judge. A good project uses both.</p>
<h3>Bug-fixing workflow</h3>
<ol>
<li><strong>Reproduce</strong> — find exact steps to trigger the bug.</li>
<li><strong>Log it</strong> — record it as an issue (steps, expected vs. actual, severity).</li>
<li><strong>Fix &amp; retest</strong> — fix, then re-run the failing case AND related ones (regression).</li>
</ol>
<div class="callout"><span class="badge">Tests are evidence</span> "It works on my machine" isn't proof. A passing test suite and a filled-in test-case table are the evidence the council looks for that your features actually meet the SRS.</div>`,
    `<span class="eyebrow">ISP392 · Giai đoạn 7 · Kiểm thử</span>
<h2>Kiểm thử &amp; sửa lỗi</h2>
<h3>Các cấp kiểm thử</h3>
<ul>
<li><strong>Unit test</strong> — một hàm/component riêng lẻ (vd "calculatePrice() trả đúng tổng không?").</li>
<li><strong>Integration test</strong> — nhiều phần chạy cùng nhau (vd "POST /bookings có thật sự ghi vào DB không?").</li>
<li><strong>System test</strong> — toàn app đối chiếu với yêu cầu.</li>
<li><strong>UAT (kiểm thử chấp nhận)</strong> — người dùng thật kiểm xem có đạt SRS trước khi phát hành.</li>
</ul>
<h3>Viết một ca kiểm thử</h3>
<pre><code>Ca kiểm thử: TC-BOOK-01  "Không đặt trùng một phòng"
  Điều kiện trước: Phòng 3 đã đặt 09:00-10:00
  Các bước:
    1. Đăng nhập bằng người dùng khác
    2. Thử đặt Phòng 3 lúc 09:30-10:30
  Kết quả mong đợi: request bị từ chối kèm thông báo rõ ràng
  Kết quả thực tế:  (điền khi chạy)
  Trạng thái:       Đạt / Không đạt
</code></pre>
<h3>Thủ công và tự động</h3>
<p>Test tự động (vd bằng Jest) chạy trong vài giây và bắt lỗi hồi quy mỗi lần bạn đổi code. Test thủ công/UAT bắt vấn đề dễ dùng mà script không phán được. Đồ án tốt dùng cả hai.</p>
<h3>Quy trình sửa lỗi</h3>
<ol>
<li><strong>Tái hiện</strong> — tìm đúng các bước làm lỗi xuất hiện.</li>
<li><strong>Ghi nhận</strong> — lưu thành issue (bước, mong đợi vs thực tế, mức độ nghiêm trọng).</li>
<li><strong>Sửa &amp; kiểm lại</strong> — sửa xong chạy lại ca lỗi VÀ các ca liên quan (hồi quy).</li>
</ol>
<div class="callout"><span class="badge">Test là bằng chứng</span> "Máy em chạy được" không phải bằng chứng. Bộ test đạt và bảng ca kiểm thử đã điền là bằng chứng hội đồng tìm kiếm để tin tính năng của bạn thật sự đạt SRS.</div>`,
  ]]);
const s7q = quiz('isp392-quiz-7', 'Quiz 7 — Testing|||Quiz 7 — Kiểm thử', [
  { id: 'q1', question: 'Kiểm thử một hàm riêng lẻ, tách biệt khỏi phần còn lại, gọi là?', options: ['UAT', 'Unit test', 'System test', 'Kiểm thử tải'], correctIndex: 1, explanation: 'Unit test kiểm một đơn vị nhỏ nhất (một hàm/component) một cách độc lập; integration test kiểm nhiều phần ghép lại.' },
  { id: 'q2', question: 'UAT (User Acceptance Testing) do ai thực hiện và nhằm gì?', options: ['Máy chủ tự chạy để đo tốc độ', 'Người dùng/khách hàng kiểm xem hệ thống có đạt yêu cầu (SRS) trước khi phát hành', 'Lập trình viên kiểm cú pháp code', 'Chỉ để kiểm màu sắc giao diện'], correctIndex: 1, explanation: 'UAT là kiểm thử chấp nhận do người dùng thực hiện, xác nhận hệ thống đáp ứng SRS trước khi phát hành.' },
  { id: 'q3', question: 'Sau khi sửa một lỗi, vì sao cần chạy lại cả các ca kiểm thử liên quan?', options: ['Để tốn thời gian cho đủ quy trình', 'Để phát hiện lỗi hồi quy — bản sửa vô tình làm hỏng phần khác', 'Vì rubric cấm sửa lỗi', 'Không cần, sửa xong là xong'], correctIndex: 1, explanation: 'Một bản sửa có thể vô tình làm hỏng chức năng khác (lỗi hồi quy); chạy lại ca lỗi và các ca liên quan giúp phát hiện sớm.' },
]);

const s8 = doc('isp392-8-1-deploy-report-defense', 'Stage 8 — Deployment, documentation, report & defense|||Giai đoạn 8 — Triển khai (deploy), tài liệu, báo cáo & bảo vệ',
  'Đưa app lên server/cloud (build → cấu hình env → chạy); CI/CD tự động hoá build và deploy; viết README/hướng dẫn cài; hoàn thiện báo cáo cuối; chuẩn bị và thực hiện buổi bảo vệ trước hội đồng.',
  [[
    `<span class="eyebrow">ISP392 · Stage 8 · Deploy &amp; defense</span>
<h2>Deployment, documentation, report &amp; defense</h2>
<h3>Deployment — from "localhost" to a real URL</h3>
<p>Deploying means running your app somewhere users can reach it (a VPS, or a cloud like Render/Railway/Vercel). Key steps:</p>
<pre><code>Deploy checklist:
  1. Build the production version (frontend + backend)
  2. Configure environment variables (DB url, secrets) on the server
  3. Run database migrations on the production DB
  4. Start the app (often in a Docker container)
  5. Smoke-test the live URL: does the login page load? do core routes work?
</code></pre>
<p><strong>CI/CD</strong> (e.g. GitHub Actions) automates this: on push, it runs tests, builds, and deploys — so a green pipeline gives confidence before release.</p>
<h3>Documentation</h3>
<ul>
<li><strong>README</strong> — how to install and run the project locally (setup, env, commands).</li>
<li><strong>User guide</strong> — how to use the main features.</li>
</ul>
<h3>Final report &amp; defense</h3>
<p>The report ties everything together: problem, requirements (SRS), design (ERD/UML), implementation, testing results, and each member's contribution. At the <strong>defense</strong>, you demo the live app and answer the council's questions.</p>
<div class="callout"><span class="badge">Defense tips</span> Demo the <strong>deployed</strong> app, not localhost. Be ready to explain <em>your own</em> code and decisions — the council asks each member individually. Have a backup video in case the network fails.</div>`,
    `<span class="eyebrow">ISP392 · Giai đoạn 8 · Deploy &amp; bảo vệ</span>
<h2>Triển khai, tài liệu, báo cáo &amp; bảo vệ</h2>
<h3>Triển khai — từ "localhost" đến một URL thật</h3>
<p>Triển khai là chạy app ở nơi người dùng truy cập được (một VPS, hoặc cloud như Render/Railway/Vercel). Các bước chính:</p>
<pre><code>Checklist triển khai:
  1. Build bản production (frontend + backend)
  2. Cấu hình biến môi trường (URL DB, secret) trên server
  3. Chạy migration trên CSDL production
  4. Khởi động app (thường trong container Docker)
  5. Smoke-test URL thật: trang đăng nhập lên không? route lõi chạy không?
</code></pre>
<p><strong>CI/CD</strong> (vd GitHub Actions) tự động hoá việc này: khi push, nó chạy test, build và deploy — pipeline xanh cho ta yên tâm trước khi phát hành.</p>
<h3>Tài liệu</h3>
<ul>
<li><strong>README</strong> — cách cài và chạy dự án ở máy cục bộ (cài đặt, env, lệnh).</li>
<li><strong>Hướng dẫn người dùng</strong> — cách dùng các tính năng chính.</li>
</ul>
<h3>Báo cáo cuối &amp; bảo vệ</h3>
<p>Báo cáo gói mọi thứ lại: bài toán, yêu cầu (SRS), thiết kế (ERD/UML), triển khai, kết quả kiểm thử, và đóng góp của từng thành viên. Ở buổi <strong>bảo vệ</strong>, bạn demo app chạy thật và trả lời câu hỏi của hội đồng.</p>
<div class="callout"><span class="badge">Mẹo bảo vệ</span> Demo app <strong>đã deploy</strong>, không phải localhost. Sẵn sàng giải thích code và quyết định <em>của chính bạn</em> — hội đồng hỏi từng thành viên riêng. Có sẵn video dự phòng phòng khi mạng lỗi.</div>`,
  ]]);
const s8q = quiz('isp392-quiz-8', 'Quiz 8 — Deploy, report & defense|||Quiz 8 — Deploy, báo cáo & bảo vệ', [
  { id: 'q1', question: 'CI/CD (vd GitHub Actions) giúp gì cho đồ án?', options: ['Vẽ ERD tự động', 'Tự động chạy test, build và triển khai khi có commit/push', 'Thay thế hoàn toàn việc viết code', 'Tăng dung lượng ổ cứng server'], correctIndex: 1, explanation: 'CI/CD tự động hoá kiểm thử, build và deploy; pipeline xanh cho ta bằng chứng và sự yên tâm trước khi phát hành.' },
  { id: 'q2', question: 'Tài liệu README trong dự án chủ yếu để làm gì?', options: ['Ghi điểm từng thành viên', 'Hướng dẫn cách cài đặt và chạy dự án (setup, env, lệnh)', 'Thay cho toàn bộ báo cáo cuối', 'Lưu mật khẩu người dùng'], correctIndex: 1, explanation: 'README hướng dẫn người khác cài và chạy dự án ở máy cục bộ — cấu hình môi trường, lệnh khởi động, phụ thuộc.' },
  { id: 'q3', question: 'Lời khuyên nào đúng cho buổi bảo vệ đồ án?', options: ['Chỉ cần demo trên localhost là đủ', 'Demo bản đã deploy và sẵn sàng giải thích code, quyết định của chính mình', 'Để một người nói hết, người khác im lặng', 'Không cần chuẩn bị video dự phòng'], correctIndex: 1, explanation: 'Nên demo app đã triển khai (không phải localhost), mỗi thành viên chuẩn bị giải thích phần việc và quyết định của mình, và có video dự phòng phòng khi mạng lỗi.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ISP392',
    slug: 'isp392-information-system-programming-project',
    title: 'Information System Programming Project',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ISP392.webp',
    shortDescription: 'Build a real information system end-to-end via the SDLC: requirements (SRS), planning & stack, design (ERD/UML), UI/UX & API, backend, frontend & integration, testing (UAT), deploy & defense. Bilingual team project with quizzes.|||Xây hệ thống thông tin thật trọn vòng theo SDLC: yêu cầu (SRS), kế hoạch & stack, thiết kế (ERD/UML), UI/UX & API, backend, frontend & tích hợp, kiểm thử (UAT), deploy & bảo vệ. Song ngữ, đồ án nhóm, có quiz.',
    description: 'Môn <strong>ISP392 — Information System Programming Project</strong> (Đồ án Lập trình Hệ thống thông tin, kỳ 5) là môn <strong>đồ án phần mềm theo NHÓM</strong>: xây một hệ thống thông tin thật, chạy được, đi trọn một vòng <strong>quy trình phát triển phần mềm (SDLC)</strong>. Khung gồm 8 giai đoạn: (1) ý tưởng, khảo sát &amp; phân tích yêu cầu (SRS) → (2) lập kế hoạch &amp; chọn công nghệ (Scrum) → (3) thiết kế hệ thống (kiến trúc, CSDL/ERD, UML) → (4) thiết kế UI/UX &amp; hợp đồng API → (5) triển khai backend &amp; database → (6) triển khai frontend &amp; tích hợp → (7) kiểm thử &amp; sửa lỗi → (8) deploy, tài liệu, báo cáo &amp; bảo vệ. Song ngữ, có ví dụ (user story, ERD, API spec, sprint plan) và quiz mỗi giai đoạn.',
    whatYouLearn: 'Phân tích &amp; viết SRS (yêu cầu chức năng/phi chức năng, use case, user story); Agile/Scrum (sprint, backlog, vai trò) &amp; chọn stack; thiết kế kiến trúc, CSDL/ERD, chuẩn hoá, UML; wireframe→prototype &amp; hợp đồng REST API; backend nhiều lớp, xác thực/uỷ quyền, migration; frontend theo component, tích hợp &amp; xử lý lỗi; kiểm thử unit/integration/UAT, test case, quy trình sửa lỗi; deploy, CI/CD, viết README, báo cáo &amp; bảo vệ.',
    requirements: 'Đã học lập trình web (frontend + backend) và cơ sở dữ liệu; biết dùng Git. Xem điều kiện tiên quyết chính xác trong khung chương trình ngành Hệ thống thông tin trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, Sommerville, Scrum Guide, Git & CI/CD, công cụ, rubric.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Môn đồ án nhóm, deliverable, rubric, SDLC.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Yêu cầu (SRS)|||Stage 1 — Requirements (SRS)', description: 'Ý tưởng, khảo sát, FR/NFR, use case, user story.', lessons: [s1, s1q] },
    { title: 'Giai đoạn 2 — Kế hoạch & công nghệ|||Stage 2 — Planning & stack', description: 'Scrum, sprint, backlog, chọn stack, Git.', lessons: [s2, s2q] },
    { title: 'Giai đoạn 3 — Thiết kế hệ thống|||Stage 3 — System design', description: 'Kiến trúc, ERD, chuẩn hoá, UML.', lessons: [s3, s3q] },
    { title: 'Giai đoạn 4 — UI/UX & API|||Stage 4 — UI/UX & API', description: 'Wireframe→prototype, UX, hợp đồng REST API.', lessons: [s4, s4q] },
    { title: 'Giai đoạn 5 — Backend & database|||Stage 5 — Backend & database', description: 'Migration, backend nhiều lớp, auth, validate.', lessons: [s5, s5q] },
    { title: 'Giai đoạn 6 — Frontend & tích hợp|||Stage 6 — Frontend & integration', description: 'Component, state, gọi API thật, xử lý lỗi tích hợp.', lessons: [s6, s6q] },
    { title: 'Giai đoạn 7 — Kiểm thử & sửa lỗi|||Stage 7 — Testing & bug-fixing', description: 'Unit/integration/UAT, test case, quy trình sửa lỗi.', lessons: [s7, s7q] },
    { title: 'Giai đoạn 8 — Deploy & bảo vệ|||Stage 8 — Deploy & defense', description: 'Deploy, CI/CD, README, báo cáo, bảo vệ.', lessons: [s8, s8q] },
  ],
};
