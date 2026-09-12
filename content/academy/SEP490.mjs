/**
 * SEP490 — SE Capstone Project. Giáo trình FLM (syl): trải nghiệm toàn bộ pha dự
 * án (requirement→design→coding→testing→release), template & tài liệu mỗi pha,
 * áp dụng công nghệ đã học + nghiên cứu công nghệ mới, làm việc nhóm. Môn ĐỒ ÁN.
 * Song ngữ + checklist + bài tập. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('sep490-0-1-overview', 'Course overview: SE Capstone|||Tổng quan: Đồ án tốt nghiệp SE',
  'Capstone là gì, khác môn học thường thế nào; trải toàn bộ vòng đời phần mềm theo nhóm; lộ trình: khởi động & requirement → design → coding & testing → release & bảo vệ.',
  [[
    `<span class="eyebrow">SEP490 · Lesson 0.1 · Overview</span>
<h2>SE Capstone Project</h2>
<p class="lead">The capstone gives you the experience of a <strong>real software project</strong>: your team takes an idea through <em>every phase</em> — requirements, design, coding, testing, and release — applying everything you've learned and researching new technologies where needed.</p>
<h3>How it differs from a normal course</h3>
<ul>
<li>You own a <strong>whole product</strong>, not an exercise — scope, plan, build, ship.</li>
<li>You work as a <strong>team</strong> with roles, deadlines and a supervisor.</li>
<li>You produce <strong>professional documents</strong> for each stage using templates.</li>
<li>You defend your work in a <strong>final presentation</strong>.</li>
</ul>
<h3>Roadmap</h3>
<p>Project kickoff &amp; requirements → design (architecture, database, UI) → coding &amp; testing (with process &amp; version control) → release, documentation &amp; defense. Bilingual, with checklists and worked artifacts.</p>
<div class="callout"><span class="badge">Note</span> This is a process &amp; project course — the deliverable is a working product plus its documentation and a defense, not lecture code.</div>`,
    `<span class="eyebrow">SEP490 · Bài 0.1 · Tổng quan</span>
<h2>Đồ án tốt nghiệp SE (Capstone)</h2>
<p class="lead">Đồ án tốt nghiệp cho bạn trải nghiệm một <strong>dự án phần mềm thật</strong>: nhóm của bạn đưa một ý tưởng qua <em>mọi pha</em> — yêu cầu, thiết kế, lập trình, kiểm thử, và phát hành — áp dụng mọi thứ đã học và nghiên cứu công nghệ mới khi cần.</p>
<h3>Khác gì môn học thường</h3>
<ul>
<li>Bạn làm chủ <strong>cả một sản phẩm</strong>, không phải bài tập — xác định phạm vi, lập kế hoạch, xây, phát hành.</li>
<li>Bạn làm việc <strong>theo nhóm</strong> có vai trò, hạn chót và người hướng dẫn.</li>
<li>Bạn tạo <strong>tài liệu chuyên nghiệp</strong> cho mỗi giai đoạn bằng template.</li>
<li>Bạn <strong>bảo vệ</strong> sản phẩm trong buổi thuyết trình cuối.</li>
</ul>
<h3>Lộ trình</h3>
<p>Khởi động &amp; yêu cầu → thiết kế (kiến trúc, CSDL, UI) → lập trình &amp; kiểm thử (có quy trình &amp; quản lý phiên bản) → phát hành, tài liệu &amp; bảo vệ. Song ngữ, có checklist và mẫu tài liệu.</p>
<div class="callout"><span class="badge">Lưu ý</span> Đây là môn quy trình &amp; dự án — sản phẩm là một hệ thống chạy được cùng tài liệu và buổi bảo vệ, không phải code bài giảng.</div>`,
  ]]);

const c1 = doc('sep490-1-1-kickoff-requirements', '1.1 — Kickoff & requirements|||1.1 — Khởi động & yêu cầu',
  'Chọn đề tài & phạm vi, lập nhóm/vai trò, kế hoạch (milestone), thu thập yêu cầu (functional/non-functional), tài liệu SRS.',
  [[
    `<span class="eyebrow">SEP490 · Chapter 1 · Lesson 1.1</span>
<h2>Kickoff &amp; requirements</h2>
<h3>Start the project right</h3>
<ul>
<li><strong>Topic &amp; scope</strong> — pick a problem worth solving and define what's IN and OUT (scope creep kills capstones).</li>
<li><strong>Team &amp; roles</strong> — leader, backend, frontend, QA; agree on how you'll communicate and decide.</li>
<li><strong>Plan &amp; milestones</strong> — break the timeline into checkpoints with deliverables (a Gantt/roadmap).</li>
</ul>
<h3>Gathering requirements</h3>
<p>Requirements say <em>what</em> the system must do (not how):</p>
<ul>
<li><strong>Functional</strong> — features ("a user can reset their password").</li>
<li><strong>Non-functional</strong> — qualities ("responds in under 2s", "handles 500 users", secure).</li>
</ul>
<p>Capture them in an <strong>SRS</strong> (Software Requirements Specification), often as <strong>use cases</strong> or <strong>user stories</strong> ("As a &lt;role&gt;, I want &lt;goal&gt; so that &lt;benefit&gt;"). Good requirements are clear, testable, and agreed with the supervisor before you build.</p>
<div class="callout"><span class="badge">Why this phase decides everything</span> Fixing a misunderstanding here costs a sentence; fixing it after coding costs weeks. Nail scope and requirements first.</div>`,
    `<span class="eyebrow">SEP490 · Chương 1 · Bài 1.1</span>
<h2>Khởi động &amp; yêu cầu</h2>
<h3>Bắt đầu dự án cho đúng</h3>
<ul>
<li><strong>Đề tài &amp; phạm vi</strong> — chọn vấn đề đáng giải và xác định cái gì TRONG và NGOÀI phạm vi (phình phạm vi giết đồ án).</li>
<li><strong>Nhóm &amp; vai trò</strong> — trưởng nhóm, backend, frontend, QA; thống nhất cách trao đổi và ra quyết định.</li>
<li><strong>Kế hoạch &amp; mốc</strong> — chia dòng thời gian thành các mốc có sản phẩm bàn giao (Gantt/roadmap).</li>
</ul>
<h3>Thu thập yêu cầu</h3>
<p>Yêu cầu nói hệ thống phải làm <em>gì</em> (không phải làm sao):</p>
<ul>
<li><strong>Chức năng (functional)</strong> — tính năng ("người dùng đặt lại mật khẩu").</li>
<li><strong>Phi chức năng (non-functional)</strong> — chất lượng ("phản hồi dưới 2s", "chịu 500 người", bảo mật).</li>
</ul>
<p>Ghi vào <strong>SRS</strong> (Đặc tả yêu cầu phần mềm), thường dưới dạng <strong>use case</strong> hoặc <strong>user story</strong> ("Là &lt;vai trò&gt;, tôi muốn &lt;mục tiêu&gt; để &lt;lợi ích&gt;"). Yêu cầu tốt thì rõ ràng, kiểm được, và thống nhất với người hướng dẫn trước khi xây.</p>
<div class="callout"><span class="badge">Vì sao pha này quyết định tất cả</span> Sửa một hiểu lầm ở đây tốn một câu; sửa nó sau khi code tốn hàng tuần. Chốt phạm vi và yêu cầu trước.</div>`,
  ]]);

const c1q = quiz('sep490-quiz-1', 'Quiz 1 — Kickoff & requirements|||Quiz 1 — Khởi động & yêu cầu', [
  { id: 'q1', question: '"Hệ thống phản hồi dưới 2 giây, chịu 500 người" là loại yêu cầu?', options: ['Chức năng', 'Phi chức năng (non-functional)', 'Use case', 'Milestone'], correctIndex: 1, explanation: 'Non-functional mô tả CHẤT LƯỢNG (hiệu năng, bảo mật…).' },
  { id: 'q2', question: '"Scope creep" (phình phạm vi) nguy hiểm vì?', options: ['Làm code nhanh hơn', 'Thêm việc ngoài kế hoạch → trễ hạn, không kịp bảo vệ', 'Tăng bảo mật', 'Không ảnh hưởng'], correctIndex: 1, explanation: 'Phình phạm vi làm dự án không hoàn thành đúng hạn.' },
  { id: 'q3', question: 'Tài liệu ghi lại yêu cầu phần mềm gọi là?', options: ['SRS (Software Requirements Specification)', 'Gantt', 'Testbench', 'Commit'], correctIndex: 0, explanation: 'SRS đặc tả yêu cầu, thường qua use case/user story.' },
]);

const c2 = doc('sep490-2-1-design', '2.1 — Design: architecture, database & UI|||2.1 — Thiết kế: kiến trúc, CSDL & UI',
  'Kiến trúc hệ thống (tầng/layer, client-server), thiết kế CSDL (ERD, chuẩn hoá), thiết kế UI/UX (wireframe), tài liệu thiết kế.',
  [[
    `<span class="eyebrow">SEP490 · Chapter 2 · Lesson 2.1</span>
<h2>Design — architecture, database &amp; UI</h2>
<h3>Architecture</h3>
<p>Decide the <strong>high-level structure</strong> before writing code: a layered app (presentation → business → data), client-server, or microservices. Draw a <strong>component/deployment diagram</strong> showing the pieces and how they talk (which frontend, which backend, which database, external APIs).</p>
<h3>Database design</h3>
<p>Model your data as an <strong>ERD</strong> (Entity-Relationship Diagram) — entities, attributes, and relationships — then <strong>normalize</strong> to remove redundancy. A clean schema now saves painful migrations later.</p>
<h3>UI/UX design</h3>
<p>Design screens as <strong>wireframes</strong> (low-fidelity layouts) before styling. Focus on the user flow: can someone complete the key task with the fewest steps? Get feedback early — it's cheap to move a box in a wireframe, expensive in built code.</p>
<div class="callout"><span class="badge">Document it</span> The Design phase produces a design document (architecture + ERD + wireframes + tech choices). It's the blueprint your whole team codes against — and what the supervisor reviews before the build phase.</div>`,
    `<span class="eyebrow">SEP490 · Chương 2 · Bài 2.1</span>
<h2>Thiết kế — kiến trúc, CSDL &amp; UI</h2>
<h3>Kiến trúc</h3>
<p>Quyết định <strong>cấu trúc tổng thể</strong> trước khi viết code: ứng dụng phân tầng (trình bày → nghiệp vụ → dữ liệu), client-server, hoặc microservices. Vẽ <strong>sơ đồ thành phần/triển khai</strong> cho thấy các mảnh và cách chúng nói chuyện (frontend nào, backend nào, CSDL nào, API ngoài).</p>
<h3>Thiết kế cơ sở dữ liệu</h3>
<p>Mô hình dữ liệu bằng <strong>ERD</strong> (sơ đồ thực thể-quan hệ) — thực thể, thuộc tính, quan hệ — rồi <strong>chuẩn hoá</strong> để bỏ dư thừa. Lược đồ sạch bây giờ tiết kiệm những lần migration đau đớn về sau.</p>
<h3>Thiết kế UI/UX</h3>
<p>Thiết kế màn hình bằng <strong>wireframe</strong> (bố cục phác thảo) trước khi tô style. Tập trung vào luồng người dùng: có hoàn thành được việc chính với ít bước nhất không? Lấy phản hồi sớm — dịch một khối trong wireframe thì rẻ, trong code đã xây thì đắt.</p>
<div class="callout"><span class="badge">Ghi tài liệu</span> Pha thiết kế tạo ra tài liệu thiết kế (kiến trúc + ERD + wireframe + lựa chọn công nghệ). Đó là bản vẽ để cả nhóm code theo — và là thứ người hướng dẫn duyệt trước pha xây.</div>`,
  ]]);

const c2q = quiz('sep490-quiz-2', 'Quiz 2 — Design|||Quiz 2 — Thiết kế', [
  { id: 'q1', question: 'Mô hình hoá dữ liệu (thực thể, quan hệ) bằng?', options: ['Wireframe', 'ERD (Entity-Relationship Diagram)', 'Gantt', 'Use case'], correctIndex: 1, explanation: 'ERD mô tả thực thể/thuộc tính/quan hệ; rồi chuẩn hoá.' },
  { id: 'q2', question: 'Wireframe là?', options: ['Sơ đồ mạng', 'Bố cục màn hình phác thảo (low-fidelity) trước khi tô style', 'Bảng CSDL', 'Đoạn code'], correctIndex: 1, explanation: 'Wireframe kiểm luồng UX sớm, rẻ để sửa.' },
  { id: 'q3', question: 'Pha thiết kế nên hoàn tất TRƯỚC khi?', options: ['Thu thập yêu cầu', 'Viết phần lớn code (nó là bản vẽ để code theo)', 'Bảo vệ đồ án', 'Lập nhóm'], correctIndex: 1, explanation: 'Thiết kế là blueprint; code theo nó, tránh làm lại.' },
]);

const c3 = doc('sep490-3-1-build-test-release', '3.1 — Coding, testing & release|||3.1 — Lập trình, kiểm thử & phát hành',
  'Quy trình phát triển (Agile/Scrum sprint), quản lý phiên bản (Git branch/PR), kiểm thử (unit/integration/UAT), phát hành & triển khai, tài liệu & bảo vệ.',
  [[
    `<span class="eyebrow">SEP490 · Chapter 3 · Lesson 3.1</span>
<h2>Coding, testing &amp; release</h2>
<h3>Build with a process</h3>
<ul>
<li><strong>Agile/Scrum</strong> — work in short <strong>sprints</strong>, each ending in a demoable increment; hold stand-ups and reviews.</li>
<li><strong>Version control</strong> — Git with a branch per feature and <strong>pull requests</strong> reviewed by a teammate before merging to main. Never code straight on main.</li>
<li><strong>Coding standards</strong> — agree on style and structure so the code reads as one team's.</li>
</ul>
<h3>Testing</h3>
<ul>
<li><strong>Unit tests</strong> — each function/class in isolation.</li>
<li><strong>Integration tests</strong> — modules working together (API + DB).</li>
<li><strong>UAT</strong> (User Acceptance Testing) — does it meet the requirements from Chapter 1? Trace each test back to a requirement.</li>
</ul>
<h3>Release &amp; defense</h3>
<p><strong>Deploy</strong> the product (a server, cloud, or installer), write the <strong>user &amp; technical documentation</strong>, and prepare the <strong>final defense</strong>: demo the working product, explain your decisions, and show how you met the requirements. A capstone is judged on a <em>working, documented, defended</em> system — not just code.</p>
<div class="callout"><span class="badge">Through-line</span> Every phase connects: requirements → design → build → tests that prove the requirements → a release you can defend. Traceability is what separates a project from a pile of code.</div>`,
    `<span class="eyebrow">SEP490 · Chương 3 · Bài 3.1</span>
<h2>Lập trình, kiểm thử &amp; phát hành</h2>
<h3>Xây dựng có quy trình</h3>
<ul>
<li><strong>Agile/Scrum</strong> — làm theo <strong>sprint</strong> ngắn, mỗi sprint kết thúc bằng một phần demo được; họp stand-up và review.</li>
<li><strong>Quản lý phiên bản</strong> — Git với một nhánh cho mỗi tính năng và <strong>pull request</strong> được đồng đội duyệt trước khi merge vào main. Không code thẳng trên main.</li>
<li><strong>Chuẩn code</strong> — thống nhất style và cấu trúc để mã đọc như của một nhóm.</li>
</ul>
<h3>Kiểm thử</h3>
<ul>
<li><strong>Unit test</strong> — từng hàm/lớp riêng lẻ.</li>
<li><strong>Integration test</strong> — các module chạy cùng nhau (API + CSDL).</li>
<li><strong>UAT</strong> (kiểm thử chấp nhận) — có đáp ứng yêu cầu ở Chương 1 không? Truy mỗi test về một yêu cầu.</li>
</ul>
<h3>Phát hành &amp; bảo vệ</h3>
<p><strong>Triển khai</strong> sản phẩm (máy chủ, đám mây, hoặc bộ cài), viết <strong>tài liệu người dùng &amp; kỹ thuật</strong>, và chuẩn bị <strong>buổi bảo vệ</strong>: demo sản phẩm chạy được, giải thích các quyết định, và cho thấy đã đáp ứng yêu cầu ra sao. Đồ án được chấm trên một hệ thống <em>chạy được, có tài liệu, bảo vệ được</em> — không chỉ code.</p>
<div class="callout"><span class="badge">Xuyên suốt</span> Mọi pha nối nhau: yêu cầu → thiết kế → xây → test chứng minh yêu cầu → bản phát hành bảo vệ được. Truy vết (traceability) là thứ phân biệt một dự án với một đống code.</div>`,
  ]]);

const c3q = quiz('sep490-quiz-3', 'Quiz 3 — Build, test & release|||Quiz 3 — Xây, test & phát hành', [
  { id: 'q1', question: 'Trong quản lý phiên bản nhóm, thực hành đúng là?', options: ['Code thẳng trên main', 'Nhánh mỗi tính năng + pull request được duyệt rồi mới merge', 'Không dùng Git', 'Một người giữ toàn bộ code'], correctIndex: 1, explanation: 'Feature branch + PR review giữ main ổn định.' },
  { id: 'q2', question: 'UAT (User Acceptance Testing) kiểm?', options: ['Tốc độ CPU', 'Sản phẩm có đáp ứng ĐÚNG yêu cầu ban đầu không', 'Số dòng code', 'Màu giao diện'], correctIndex: 1, explanation: 'UAT truy về yêu cầu (Chương 1) để nghiệm thu.' },
  { id: 'q3', question: 'Đồ án capstone được chấm chủ yếu trên?', options: ['Chỉ số dòng code', 'Hệ thống chạy được + tài liệu + buổi bảo vệ', 'Số commit', 'Đẹp UI duy nhất'], correctIndex: 1, explanation: 'Sản phẩm hoàn chỉnh, có tài liệu, bảo vệ được.' },
]);

export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    courseCode: 'SEP490',
    slug: 'sep490-se-capstone-project',
    title: 'SE Capstone Project',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SEP490.webp',
    shortDescription: 'Run a real software project end-to-end — requirements, design (architecture/ERD/UI), build with process & Git, testing (unit/integration/UAT), release & defense. Bilingual, with checklists & quizzes.|||Chạy một dự án phần mềm trọn vẹn — yêu cầu, thiết kế (kiến trúc/ERD/UI), xây dựng có quy trình & Git, kiểm thử (unit/integration/UAT), phát hành & bảo vệ. Song ngữ, có checklist & quiz.',
    description: 'Môn <strong>SEP490 — SE Capstone Project</strong> (kỳ 9) cho trải nghiệm một <strong>dự án phần mềm thật</strong> theo nhóm, qua toàn bộ vòng đời: <strong>khởi động &amp; yêu cầu</strong> (phạm vi, vai trò, kế hoạch, SRS, use case/user story) → <strong>thiết kế</strong> (kiến trúc, ERD/chuẩn hoá, wireframe UI) → <strong>lập trình, kiểm thử &amp; phát hành</strong> (Agile/Scrum, Git branch/PR, unit/integration/UAT, triển khai, tài liệu, bảo vệ). Bám giáo trình FLM, song ngữ, có checklist và mẫu tài liệu, quiz mỗi chương. Đây là môn quy trình &amp; đồ án.',
    whatYouLearn: 'Chọn đề tài & quản phạm vi (tránh scope creep); tổ chức nhóm/vai trò & lập kế hoạch (milestone/Gantt); yêu cầu functional vs non-functional, SRS, use case/user story; thiết kế kiến trúc (layer/client-server), ERD & chuẩn hoá, wireframe UI/UX; quy trình Agile/Scrum (sprint); Git branch + pull request review; kiểm thử unit/integration/UAT (truy vết về yêu cầu); triển khai, viết tài liệu & bảo vệ đồ án.',
    requirements: 'Đã hoàn thành phần lớn chương trình SE (lập trình, CSDL, KTPM, kiểm thử). Làm theo nhóm; cần tài khoản Git.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Capstone là gì, khác môn thường.', lessons: [intro] },
    { title: 'Chương 1 — Khởi động & yêu cầu|||Chapter 1 — Kickoff & requirements', description: 'Phạm vi, nhóm, SRS, use case.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thiết kế|||Chapter 2 — Design', description: 'Kiến trúc, ERD, wireframe.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Xây, test & phát hành|||Chapter 3 — Build, test & release', description: 'Scrum, Git/PR, kiểm thử, bảo vệ.', lessons: [c3, c3q] },
  ],
};
